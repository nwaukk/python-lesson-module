/* eslint-disable no-restricted-globals */
/**
 * Python Visual Lab — Dedicated Offline Pyodide Web Worker
 * Serves 100% locally bundled Pyodide files from ./pyodide/ (zero CDN requests).
 * Supports live streaming stdout/stderr, readable line-numbered tracebacks,
 * interactive input() (both SharedArrayBuffer blocking & non-isolated continuation),
 * SharedArrayBuffer interrupt / Stop support, persistent cell namespaces,
 * sys.settrace stepping, Cache Storage warming, and offline educational shims.
 */

const CACHE_NAME = 'pvl-pyodide-cache-v0.27.8';
const CORE_FILES = [
  'pyodide.js',
  'pyodide.asm.js',
  'pyodide.asm.wasm',
  'python_stdlib.zip',
  'pyodide-lock.json',
];

let pyodide = null;
let isReady = false;
let initPromise = null;
let activeInputSab = null;
let activeInterruptSab = null;
let activeRunId = null;

function resolveDefaultIndexUrl() {
  return new URL('./pyodide/', self.location.href).href;
}

async function checkAndWarmCache(indexUrl) {
  try {
    if (typeof self.caches === 'undefined') {
      return { cached: false };
    }
    const cache = await self.caches.open(CACHE_NAME);
    const keyReq = new Request(indexUrl + 'pyodide.asm.wasm');
    const alreadyCached = Boolean(await cache.match(keyReq));

    if (!alreadyCached) {
      // Warm cache asynchronously in background without holding duplicate buffers
      Promise.allSettled(
        CORE_FILES.map(async (fname) => {
          const url = indexUrl + fname;
          const existing = await cache.match(url);
          if (!existing) {
            const resp = await fetch(url);
            if (resp && resp.ok) {
              await cache.put(url, resp);
            }
          }
        })
      ).catch(() => {});
    }
    return { cached: alreadyCached };
  } catch {
    return { cached: false };
  }
}

const PYTHON_BOOTSTRAP = String.raw`
import sys
import io
import json
import types
import traceback

class _PvlNeedsInputError(Exception):
    def __init__(self, prompt=""):
        super().__init__(prompt)
        self.prompt = prompt

class _PvlStream(io.TextIOBase):
    def __init__(self, kind, emit_fn):
        self.kind = kind
        self._emit = emit_fn
        self._chunks = []

    def writable(self):
        return True

    def write(self, text):
        if text:
            s = str(text)
            self._chunks.append(s)
            self._emit(self.kind, s)
        return len(text)

    def flush(self):
        pass

    def getvalue(self):
        return "".join(self._chunks)

_pvl_input_queue = []
_pvl_can_block_input = False
_pvl_request_sync_input = None
_pvl_emit_callback = None
_pvl_active_offline_notices = set()

def _pvl_notify_offline(mod_name, message):
    key = mod_name + ":" + message
    if key not in _pvl_active_offline_notices:
        _pvl_active_offline_notices.add(key)
        if _pvl_emit_callback is not None:
            _pvl_emit_callback("system", f"Not available in offline mode ({mod_name}): {message}")

def _pvl_set_runtime_hooks(emit_fn, sync_input_fn, can_block):
    global _pvl_emit_callback, _pvl_request_sync_input, _pvl_can_block_input
    _pvl_emit_callback = emit_fn
    _pvl_request_sync_input = sync_input_fn
    _pvl_can_block_input = bool(can_block)

def _pvl_set_inputs(items):
    global _pvl_input_queue
    _pvl_input_queue = [str(x) for x in (items or [])]

def _pvl_readline(prompt=""):
    prompt_str = "" if prompt is None else str(prompt)
    if prompt_str:
        sys.stdout.write(prompt_str)
        sys.stdout.flush()

    if _pvl_input_queue:
        val = _pvl_input_queue.pop(0)
        sys.stdout.write(val + "\n")
        sys.stdout.flush()
        return val

    if _pvl_can_block_input and _pvl_request_sync_input is not None:
        val = _pvl_request_sync_input(prompt_str)
        sys.stdout.write(str(val) + "\n")
        sys.stdout.flush()
        return str(val)

    raise _PvlNeedsInputError(prompt_str)

import builtins
builtins.input = _pvl_readline

# ------------------------------------------------------------------
# Persistent user namespace between Playground / Notebook cells
# ------------------------------------------------------------------
_pvl_user_ns = {"__name__": "__main__"}

def _pvl_reset_namespace():
    global _pvl_user_ns
    _pvl_user_ns = {"__name__": "__main__"}

def _pvl_clean_traceback(exc):
    tb = exc.__traceback__
    # Skip internal exec() harness frames outside <stdin> when user frames exist
    frames = traceback.extract_tb(tb)
    stdin_frames = [f for f in frames if f.filename == "<stdin>"]
    if stdin_frames:
        lines = ["Traceback (most recent call last):"]
        for frame in stdin_frames:
            lines.append(f'  File "<stdin>", line {frame.lineno}, in {frame.name}')
            if frame.line:
                lines.append(f"    {frame.line}")
        lines.extend(traceback.format_exception_only(type(exc), exc))
        return "\n".join(line.rstrip("\n") for line in lines)
    return "".join(traceback.format_exception(type(exc), exc, tb)).strip()

# ------------------------------------------------------------------
# Offline Educational Shims for Internet / OS / DB Modules
# Only handles modules that genuinely cannot access internet/OS offline.
# Does NOT mask nonexistent module typos so ModuleNotFoundError remains real.
# ------------------------------------------------------------------
def _install_offline_shims():
    # 1. requests offline sample-data simulator
    req_mod = types.ModuleType("requests")

    class HTTPError(Exception):
        pass

    class RequestException(Exception):
        pass

    _SAMPLE_ROUTES = {
        "/users": [
            {"id": 1, "name": "Amara Okafor", "city": "Lagos", "role": "Engineer"},
            {"id": 2, "name": "Kwame Mensah", "city": "Accra", "role": "Analyst"},
            {"id": 3, "name": "Zainab Musa", "city": "Abuja", "role": "Educator"},
        ],
        "/products": [
            {"sku": "PY-101", "name": "Solar Inverter 3kVA", "price_ngn": 420000, "in_stock": True},
            {"sku": "PY-102", "name": "USB-C Hub", "price_ngn": 18500, "in_stock": True},
        ],
        "/weather": {"city": "Nairobi", "temp_c": 23.4, "humidity": 61, "condition": "Partly Cloudy"},
        "/rates": {"base": "USD", "NGN": 1550.0, "GHS": 15.2, "KES": 129.0},
        "/todos": [
            {"id": 1, "title": "Complete Python Visual Lab", "completed": True},
            {"id": 2, "title": "Build offline API project", "completed": False},
        ],
    }

    class Response:
        def __init__(self, url, status_code=200, payload=None, method="GET"):
            self.url = url
            self.status_code = status_code
            self.ok = 200 <= status_code < 400
            self._payload = payload if payload is not None else {"url": url, "method": method, "status": "simulated-offline"}
            self.headers = {"Content-Type": "application/json", "X-PVL-Mode": "Offline-Sample-Data"}
            self.text = json.dumps(self._payload, indent=2)

        def json(self):
            return self._payload

        def raise_for_status(self):
            if self.status_code >= 400:
                raise HTTPError(f"{self.status_code} Error for url: {self.url}")

        def __repr__(self):
            return f"<Response [{self.status_code}]>"

    def _resolve_sample(url, method="GET", json_body=None, params=None):
        _pvl_notify_offline(
            "requests",
            "Live HTTP calls require internet access (or Desktop Native Python mode). Returning bundled sample API data so HTTP status, .json(), and error handling still work offline."
        )
        lower = str(url).lower()
        if "404" in lower or "missing" in lower:
            return Response(url, 404, {"error": "Not Found (sample 404)"}, method=method)
        if "500" in lower:
            return Response(url, 500, {"error": "Internal Server Error (sample 500)"}, method=method)
        if method in ("POST", "PUT", "PATCH") and json_body is not None:
            created = dict(json_body) if isinstance(json_body, dict) else {"payload": json_body}
            created.setdefault("id", 101)
            created["_source"] = "offline-sample-echo"
            return Response(url, 201 if method == "POST" else 200, created, method=method)
        for route_key, data in _SAMPLE_ROUTES.items():
            if route_key in lower or route_key.strip("/") in lower:
                return Response(url, 200, data, method=method)
        return Response(url, 200, {"message": "Offline sample HTTP response", "url": url, "params": params or {}, "items": _SAMPLE_ROUTES["/users"][:2]}, method=method)

    class Session:
        def get(self, url, params=None, **kwargs):
            return _resolve_sample(url, "GET", params=params)
        def post(self, url, json=None, data=None, **kwargs):
            return _resolve_sample(url, "POST", json_body=json or data)
        def put(self, url, json=None, **kwargs):
            return _resolve_sample(url, "PUT", json_body=json)
        def delete(self, url, **kwargs):
            return Response(url, 204, {"deleted": True}, method="DELETE")
        def close(self):
            pass
        def __enter__(self):
            return self
        def __exit__(self, *args):
            self.close()

    req_mod.get = lambda url, params=None, **kw: _resolve_sample(url, "GET", params=params)
    req_mod.post = lambda url, json=None, data=None, **kw: _resolve_sample(url, "POST", json_body=json or data)
    req_mod.put = lambda url, json=None, **kw: _resolve_sample(url, "PUT", json_body=json)
    req_mod.delete = lambda url, **kw: Response(url, 204, {"deleted": True}, method="DELETE")
    req_mod.Session = Session
    req_mod.Response = Response
    req_mod.HTTPError = HTTPError
    req_mod.RequestException = RequestException
    sys.modules["requests"] = req_mod

    # 2. pymongo offline in-memory sample simulator
    mongo_mod = types.ModuleType("pymongo")
    mongo_err_mod = types.ModuleType("pymongo.errors")

    class OperationFailure(Exception):
        pass

    class DuplicateKeyError(Exception):
        pass

    mongo_err_mod.OperationFailure = OperationFailure
    mongo_err_mod.DuplicateKeyError = DuplicateKeyError

    class _MockResult:
        def __init__(self, **kw):
            for k, v in kw.items():
                setattr(self, k, v)

    def _matches(doc, query):
        if not query:
            return True
        for k, expected in query.items():
            if k not in doc or doc[k] != expected:
                return False
        return True

    class _MockCollection:
        def __init__(self, name, seed=None):
            self.name = name
            self._docs = list(seed or [])
            self._next_id = len(self._docs) + 1

        def insert_one(self, doc):
            copy_doc = dict(doc)
            if "_id" not in copy_doc:
                copy_doc["_id"] = f"obj_{self._next_id}"
                self._next_id += 1
            self._docs.append(copy_doc)
            return _MockResult(inserted_id=copy_doc["_id"])

        def insert_many(self, docs):
            ids = [self.insert_one(d).inserted_id for d in docs]
            return _MockResult(inserted_ids=ids)

        def find(self, query=None, projection=None):
            matched = [dict(d) for d in self._docs if _matches(d, query or {})]
            if projection:
                incl = {k for k, v in projection.items() if v}
                excl = {k for k, v in projection.items() if not v and k != "_id"}
                if incl:
                    matched = [{k: v for k, v in d.items() if k in incl or (k == "_id" and projection.get("_id", 1))} for d in matched]
                elif excl:
                    matched = [{k: v for k, v in d.items() if k not in excl} for d in matched]
            return matched

        def find_one(self, query=None, projection=None):
            res = self.find(query, projection)
            return res[0] if res else None

        def update_one(self, query, update):
            for d in self._docs:
                if _matches(d, query):
                    if "$set" in update:
                        d.update(update["$set"])
                    if "$inc" in update:
                        for k, amt in update["$inc"].items():
                            d[k] = d.get(k, 0) + amt
                    return _MockResult(matched_count=1, modified_count=1)
            return _MockResult(matched_count=0, modified_count=0)

        def delete_one(self, query):
            for idx, d in enumerate(self._docs):
                if _matches(d, query):
                    self._docs.pop(idx)
                    return _MockResult(deleted_count=1)
            return _MockResult(deleted_count=0)

        def count_documents(self, query=None):
            return len(self.find(query or {}))

        def create_index(self, keys, **kwargs):
            return str(keys)

    class _MockDatabase:
        def __init__(self, name):
            self.name = name
            self._cols = {
                "students": _MockCollection("students", [
                    {"_id": "stu_1", "name": "Chidi Nwosu", "track": "Python", "score": 92},
                    {"_id": "stu_2", "name": "Aisha Bello", "track": "Data", "score": 88},
                ]),
                "users": _MockCollection("users", [
                    {"_id": "usr_1", "username": "amara", "plan": "pro"},
                ]),
            }

        def __getitem__(self, col_name):
            if col_name not in self._cols:
                self._cols[col_name] = _MockCollection(col_name)
            return self._cols[col_name]

        def list_collection_names(self):
            return list(self._cols.keys())

    class MongoClient:
        def __init__(self, uri="mongodb://localhost:27017", **kwargs):
            _pvl_notify_offline(
                "pymongo",
                "Live MongoDB servers require an active daemon or Desktop Native Python mode. Running an in-memory sample document store (pre-seeded with 'students' and 'users' collections)."
            )
            self.uri = uri
            self._dbs = {}
            self.admin = self["admin"]

        def __getitem__(self, db_name):
            if db_name not in self._dbs:
                self._dbs[db_name] = _MockDatabase(db_name)
            return self._dbs[db_name]

        def command(self, name):
            return {"ok": 1.0, "offline_sample": True, "command": name}

        def close(self):
            pass

    mongo_mod.MongoClient = MongoClient
    mongo_mod.ASCENDING = 1
    mongo_mod.DESCENDING = -1
    mongo_mod.errors = mongo_err_mod
    sys.modules["pymongo"] = mongo_mod
    sys.modules["pymongo.errors"] = mongo_err_mod

    # 3. flask offline educational simulator
    flask_mod = types.ModuleType("flask")

    class _FlaskRequest:
        method = "GET"
        args = {}
        json = {}
        form = {}

    class _TestResp:
        def __init__(self, data, status_code=200):
            self.data = data if isinstance(data, bytes) else str(data).encode("utf-8")
            self.status_code = status_code
        def get_json(self):
            return json.loads(self.data.decode("utf-8"))
        def get_data(self, as_text=False):
            return self.data.decode("utf-8") if as_text else self.data

    class _TestClient:
        def __init__(self, app):
            self.app = app
        def get(self, path):
            return self.app._dispatch("GET", path)
        def post(self, path, json=None):
            return self.app._dispatch("POST", path, body=json)

    class Flask:
        def __init__(self, import_name):
            _pvl_notify_offline(
                "flask",
                "Binding live local network ports is disabled in browser offline mode. Your @app.route definitions and app.test_client() work with the built-in simulated WSGI router."
            )
            self.import_name = import_name
            self._routes = {}

        def route(self, rule, methods=None):
            methods = methods or ["GET"]
            def decorator(fn):
                for m in methods:
                    self._routes[(m.upper(), rule)] = fn
                return fn
            return decorator

        def _dispatch(self, method, path, body=None):
            fn = self._routes.get((method.upper(), path))
            if not fn:
                return _TestResp(json.dumps({"error": "Not Found"}), 404)
            flask_mod.request.method = method.upper()
            flask_mod.request.json = body or {}
            res = fn()
            if isinstance(res, tuple):
                return _TestResp(res[0], res[1])
            return _TestResp(res, 200)

        def test_client(self):
            return _TestClient(self)

        def run(self, **kwargs):
            print("[Offline Flask Simulator] Mock server configured. Routes:", list(self._routes.keys()))
            print("Tip: Call client = app.test_client() and client.get('/') to test routes offline.")

    flask_mod.Flask = Flask
    flask_mod.request = _FlaskRequest()
    flask_mod.jsonify = lambda *a, **kw: json.dumps(a[0] if a else kw)
    flask_mod.render_template_string = lambda tpl, **ctx: tpl.format(**ctx) if ctx else tpl
    sys.modules["flask"] = flask_mod

    # 4. sqlite3 educational offline simulator
    sqlite_mod = types.ModuleType("sqlite3")

    class _MockCursor:
        def __init__(self, conn):
            self.conn = conn
            self._last_rows = []

        def execute(self, sql, params=()):
            norm = " ".join(sql.strip().split())
            upper = norm.upper()
            if upper.startswith("CREATE TABLE"):
                tbl = norm.split("(")[0].split()[-1].strip('"' + chr(96) + '[]')
                self.conn._tables.setdefault(tbl, [])
                self._last_rows = []
            elif upper.startswith("INSERT INTO"):
                parts = norm.split("VALUES", 1)
                tbl = parts[0].replace("INSERT INTO", "", 1).strip().split()[0].split("(")[0].strip('"' + chr(96) + '[]')
                self.conn._tables.setdefault(tbl, [])
                if params:
                    self.conn._tables[tbl].append(tuple(params))
                elif len(parts) > 1:
                    raw_vals = parts[1].strip().strip("();")
                    self.conn._tables[tbl].append(tuple(v.strip().strip("'\"") for v in raw_vals.split(",")))
            elif upper.startswith("SELECT"):
                from_idx = upper.find("FROM ")
                tbl = norm[from_idx + 5:].strip().split()[0].strip(';"' + chr(96) + '[]') if from_idx != -1 else "sample"
                self._last_rows = list(self.conn._tables.get(tbl, [(1, "Offline Sample Row", 95)]))
            return self

        def fetchall(self):
            return list(self._last_rows)

        def fetchone(self):
            return self._last_rows[0] if self._last_rows else None

    class _MockConnection:
        def __init__(self, db):
            _pvl_notify_offline(
                "sqlite3",
                "Native SQLite C extension is unavailable in core browser WASM offline bundle. Using in-memory SQL table simulator with sample data."
            )
            self.database = db
            self._tables = {"sample": [(1, "Lagos Lab", 98), (2, "Nairobi Hub", 94)]}

        def cursor(self):
            return _MockCursor(self)

        def execute(self, sql, params=()):
            return self.cursor().execute(sql, params)

        def commit(self):
            pass

        def close(self):
            pass

        def __enter__(self):
            return self

        def __exit__(self, *args):
            self.close()

    sqlite_mod.connect = lambda database=":memory:", **kw: _MockConnection(database)
    sys.modules["sqlite3"] = sqlite_mod

    # 5. Friendly wrapper notice for socket.socket offline usage
    import socket as _orig_socket
    _OrigSocketCls = _orig_socket.socket

    class _OfflineEducationalSocket:
        def __init__(self, *args, **kwargs):
            _pvl_notify_offline(
                "socket",
                "Raw OS TCP/UDP sockets require Desktop Native Python mode. Simulating local loopback socket responses for concept learning."
            )
            self._sent = b""
        def connect(self, addr):
            return None
        def bind(self, addr):
            return None
        def listen(self, backlog=1):
            return None
        def sendall(self, data):
            self._sent = bytes(data)
        def recv(self, bufsize=1024):
            return self._sent or b"HTTP/1.1 200 OK (Offline Loopback Simulation)\r\n\r\n"
        def close(self):
            pass
        def __enter__(self):
            return self
        def __exit__(self, *args):
            self.close()

    _orig_socket.socket = _OfflineEducationalSocket

def _pvl_prepare_run(code, inputs, isolated, max_steps, max_chars, can_block):
    global _pvl_pending_code, _pvl_pending_isolated, _pvl_pending_max_steps, _pvl_pending_max_chars, _pvl_can_block_input
    _pvl_set_inputs(inputs)
    _pvl_active_offline_notices.clear()
    _pvl_pending_code = str(code)
    _pvl_pending_isolated = bool(isolated)
    _pvl_pending_max_steps = int(max_steps)
    _pvl_pending_max_chars = int(max_chars)
    _pvl_can_block_input = bool(can_block)

_install_offline_shims()
`;

async function ensurePyodideInitialized(customIndexUrl) {
  if (isReady && pyodide) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const indexUrl = customIndexUrl || resolveDefaultIndexUrl();
    const { cached } = await checkAndWarmCache(indexUrl);

    self.postMessage({
      type: 'STATUS',
      status: 'loading',
      progress: 15,
      cached,
      message: cached ? 'Loading cached Python engine...' : 'Preparing Python engine...',
    });

    // Load local pyodide.js (zero CDN requests)
    if (typeof self.loadPyodide !== 'function') {
      self.importScripts(indexUrl + 'pyodide.js');
    }

    self.postMessage({
      type: 'STATUS',
      status: 'loading',
      progress: 55,
      cached,
      message: 'Initialising Python 3.12 WebAssembly runtime...',
    });

    pyodide = await self.loadPyodide({ indexURL: indexUrl });

    self.postMessage({
      type: 'STATUS',
      status: 'loading',
      progress: 85,
      cached,
      message: 'Mounting offline Python standard library...',
    });

    await pyodide.runPythonAsync(PYTHON_BOOTSTRAP);

    // Expose live JS hooks into Python
    const emitFn = (kind, text) => {
      if (!activeRunId) return;
      self.postMessage({
        id: activeRunId,
        type: 'OUTPUT_CHUNK',
        chunkType: kind,
        text: String(text),
      });
    };

    const syncInputFn = (prompt) => {
      if (!activeInputSab || typeof Atomics === 'undefined') {
        return '';
      }
      const ctrl = new Int32Array(activeInputSab, 0, 2);
      const dataView = new Uint8Array(activeInputSab, 8);
      Atomics.store(ctrl, 0, 0);
      Atomics.store(ctrl, 1, 0);

      self.postMessage({
        id: activeRunId,
        type: 'INPUT_REQUEST',
        prompt: String(prompt || ''),
      });

      const interruptView = activeInterruptSab ? new Uint8Array(activeInterruptSab) : null;
      while (Atomics.load(ctrl, 0) === 0) {
        if (interruptView && interruptView[0] !== 0) {
          throw new Error('KeyboardInterrupt: Execution interrupted while waiting for input.');
        }
        Atomics.wait(ctrl, 0, 0, 50);
      }

      const len = Atomics.load(ctrl, 1);
      const bytes = dataView.slice(0, len);
      return new TextDecoder().decode(bytes);
    };

    const canBlockInput = typeof SharedArrayBuffer !== 'undefined' && Boolean(self.crossOriginIsolated);
    const setHooks = pyodide.globals.get('_pvl_set_runtime_hooks');
    setHooks(emitFn, syncInputFn, canBlockInput);
    if (typeof setHooks.destroy === 'function') setHooks.destroy();

    isReady = true;
    self.postMessage({
      type: 'STATUS',
      status: 'ready',
      progress: 100,
      cached,
      message: cached ? 'Python 3.12 Ready (Cached)' : 'Python 3.12 Ready (Offline)',
    });
  })().catch((err) => {
    isReady = false;
    pyodide = null;
    initPromise = null;
    self.postMessage({
      type: 'STATUS',
      status: 'failed',
      progress: 0,
      cached: false,
      error: String(err),
      message: 'Failed to prepare Python engine.',
    });
    throw err;
  });

  return initPromise;
}

function preprocessShellPipNotice(code) {
  const trimmed = String(code || '').trim();
  const pipMatch = trimmed.match(/^(?:!|%)?pip3?\s+install\s+(.+)$/im);
  if (pipMatch) {
    const pkg = pipMatch[1].trim();
    return {
      intercepted: true,
      pkg,
      message:
        `Not available in offline mode (pip install): Installing '${pkg}' from PyPI requires internet access or Desktop Native Python mode. Built-in standard library modules (math, random, datetime, json, re, collections, statistics, csv, pathlib, urllib.parse) work offline without pip.`,
    };
  }
  return { intercepted: false };
}

self.onmessage = async function (e) {
  const msg = e.data || {};
  const { id, type } = msg;

  if (type === 'INIT') {
    try {
      await ensurePyodideInitialized(msg.indexURL);
    } catch {
      // Status already emitted
    }
    return;
  }

  if (type === 'RESET_NAMESPACE') {
    if (isReady && pyodide) {
      try {
        const resetFn = pyodide.globals.get('_pvl_reset_namespace');
        resetFn();
        if (typeof resetFn.destroy === 'function') resetFn.destroy();
      } catch {}
    }
    if (id) {
      self.postMessage({ id, type: 'RESET_DONE' });
    }
    return;
  }

  if (type === 'RUN' || type === 'TRACE') {
    const {
      code = '',
      inputQueue = [],
      maxSteps = 300,
      isolated = false,
      persistentNamespace = true,
      inputSab = null,
      interruptSab = null,
      maxOutputChars = 65000,
    } = msg;

    try {
      await ensurePyodideInitialized(msg.indexURL);
    } catch (err) {
      self.postMessage({
        id,
        type: 'ERROR',
        error: String(err),
      });
      return;
    }

    const pipCheck = preprocessShellPipNotice(code);
    if (pipCheck.intercepted) {
      self.postMessage({ id, type: 'OUTPUT_CHUNK', chunkType: 'system', text: pipCheck.message });
      if (type === 'TRACE') {
        self.postMessage({
          id,
          type: 'TRACE_SUCCESS',
          result: {
            steps: [],
            totalSteps: 0,
            truncated: false,
            stdout: '',
            stderr: '',
            durationMs: 1,
            error: null,
            offlineNotice: pipCheck.message,
          },
        });
      } else {
        self.postMessage({
          id,
          type: 'RUN_SUCCESS',
          result: {
            stdout: '',
            stderr: '',
            error: null,
            durationMs: 1,
            exitCode: 0,
            offlineNotice: pipCheck.message,
          },
        });
      }
      return;
    }

    activeRunId = id;
    activeInputSab = inputSab || null;
    activeInterruptSab = interruptSab || null;

    if (interruptSab && typeof pyodide.setInterruptBuffer === 'function') {
      try {
        const iv = new Uint8Array(interruptSab);
        iv[0] = 0;
        pyodide.setInterruptBuffer(iv);
      } catch {}
    }

    try {
      const canBlock = Boolean(inputSab && typeof SharedArrayBuffer !== 'undefined' && self.crossOriginIsolated);
      const prepFn = pyodide.globals.get('_pvl_prepare_run');
      prepFn(
        String(code),
        inputQueue || [],
        Boolean(isolated || !persistentNamespace),
        Number(maxSteps) || 300,
        Number(maxOutputChars) || 65000,
        canBlock
      );
      if (typeof prepFn.destroy === 'function') prepFn.destroy();

      if (type === 'RUN') {
        const pyRunner = String.raw`
import sys, time

_pvl_out_stream = _PvlStream("stdout", _pvl_emit_callback)
_pvl_err_stream = _PvlStream("stderr", _pvl_emit_callback)
_pvl_old_out = sys.stdout
_pvl_old_err = sys.stderr
sys.stdout = _pvl_out_stream
sys.stderr = _pvl_err_stream

_pvl_exec_ns = {"__name__": "__main__"} if _pvl_pending_isolated else _pvl_user_ns
_pvl_start = time.perf_counter()
_pvl_err_text = None
_pvl_needs_input = None

try:
    _pvl_code_obj = compile(_pvl_pending_code, "<stdin>", "exec")
    exec(_pvl_code_obj, _pvl_exec_ns)
except _PvlNeedsInputError as inp_exc:
    _pvl_needs_input = inp_exc.prompt
except KeyboardInterrupt:
    _pvl_err_text = "KeyboardInterrupt: Execution interrupted by user."
except BaseException as exc:
    _pvl_err_text = _pvl_clean_traceback(exc)
finally:
    _pvl_dur = (time.perf_counter() - _pvl_start) * 1000.0
    sys.stdout = _pvl_old_out
    sys.stderr = _pvl_old_err

_pvl_raw_stdout = _pvl_out_stream.getvalue()
if len(_pvl_raw_stdout) > _pvl_pending_max_chars:
    _pvl_raw_stdout = _pvl_raw_stdout[:_pvl_pending_max_chars] + "\n... [Output truncated for readability]"

_pvl_notices = list(_pvl_active_offline_notices)
{
    "stdout": _pvl_raw_stdout,
    "stderr": _pvl_err_stream.getvalue(),
    "error": _pvl_err_text,
    "durationMs": _pvl_dur,
    "needsInputPrompt": _pvl_needs_input,
    "offlineNotice": "\n".join(_pvl_notices) if _pvl_notices else None,
    "namespaceVarsCount": len([k for k in _pvl_exec_ns.keys() if not str(k).startswith("_")]),
}
`;
        const resultProxy = await pyodide.runPythonAsync(pyRunner);
        const res = resultProxy.toJs({ dict_converter: Object.fromEntries });
        resultProxy.destroy();

        self.postMessage({
          id,
          type: 'RUN_SUCCESS',
          result: {
            stdout: res.stdout || '',
            stderr: res.stderr || '',
            error: res.error || null,
            durationMs: Math.round(res.durationMs || 0),
            exitCode: res.error ? 1 : 0,
            needsInputPrompt: res.needsInputPrompt ?? null,
            offlineNotice: res.offlineNotice || null,
            memoryObjectsCreated: res.namespaceVarsCount || 0,
          },
        });
      } else {
        // TRACE mode with sys.settrace + live streaming chunks
        const pyTracer = String.raw`
import sys, time

_pvl_out_stream = _PvlStream("stdout", _pvl_emit_callback)
_pvl_err_stream = _PvlStream("stderr", _pvl_emit_callback)
_pvl_old_out = sys.stdout
_pvl_old_err = sys.stderr
sys.stdout = _pvl_out_stream
sys.stderr = _pvl_err_stream

_pvl_exec_ns = {"__name__": "__main__"} if _pvl_pending_isolated else _pvl_user_ns
_trace_steps = []
_max_steps = int(_pvl_pending_max_steps)
_step_count = 0
_truncated = False
_prev_stdout_len = 0

def _pvl_tracer(frame, event, arg):
    global _step_count, _truncated, _prev_stdout_len
    if frame.f_code.co_filename != "<stdin>":
        return _pvl_tracer

    _step_count += 1
    if _step_count > _max_steps:
        _truncated = True
        return None

    local_vars = {}
    for k, v in frame.f_locals.items():
        if str(k).startswith("_pvl_") or str(k).startswith("_trace_") or str(k).startswith("__"):
            continue
        try:
            r = repr(v)
            if len(r) > 100:
                r = r[:97] + "..."
            local_vars[k] = {
                "name": k,
                "type": type(v).__name__,
                "repr": r,
                "objectId": id(v) % 10000,
                "isMutable": type(v) in (list, dict, set, bytearray),
            }
        except Exception:
            pass

    curr_out = _pvl_out_stream.getvalue()
    delta = curr_out[_prev_stdout_len:]
    _prev_stdout_len = len(curr_out)

    _trace_steps.append({
        "stepNumber": _step_count,
        "line": frame.f_lineno,
        "event": event,
        "functionName": frame.f_code.co_name,
        "scope": "local" if frame.f_code.co_name != "<module>" else "global",
        "variables": local_vars,
        "stdoutDelta": delta,
    })
    return _pvl_tracer

_pvl_start = time.perf_counter()
_pvl_err_text = None
_pvl_needs_input = None

try:
    _pvl_code_obj = compile(_pvl_pending_code, "<stdin>", "exec")
    sys.settrace(_pvl_tracer)
    exec(_pvl_code_obj, _pvl_exec_ns)
except _PvlNeedsInputError as inp_exc:
    _pvl_needs_input = inp_exc.prompt
except KeyboardInterrupt:
    _pvl_err_text = "KeyboardInterrupt: Execution interrupted by user."
except BaseException as exc:
    _pvl_err_text = _pvl_clean_traceback(exc)
finally:
    sys.settrace(None)
    _pvl_dur = (time.perf_counter() - _pvl_start) * 1000.0
    sys.stdout = _pvl_old_out
    sys.stderr = _pvl_old_err

_pvl_notices = list(_pvl_active_offline_notices)
{
    "steps": _trace_steps,
    "totalSteps": _step_count,
    "truncated": _truncated,
    "stdout": _pvl_out_stream.getvalue(),
    "stderr": _pvl_err_stream.getvalue(),
    "durationMs": _pvl_dur,
    "error": _pvl_err_text,
    "needsInputPrompt": _pvl_needs_input,
    "offlineNotice": "\n".join(_pvl_notices) if _pvl_notices else None,
}
`;
        const resultProxy = await pyodide.runPythonAsync(pyTracer);
        const res = resultProxy.toJs({ dict_converter: Object.fromEntries });
        resultProxy.destroy();

        self.postMessage({
          id,
          type: 'TRACE_SUCCESS',
          result: {
            steps: res.steps || [],
            totalSteps: res.totalSteps || 0,
            truncated: Boolean(res.truncated),
            stdout: res.stdout || '',
            stderr: res.stderr || '',
            durationMs: Math.round(res.durationMs || 0),
            error: res.error || null,
            needsInputPrompt: res.needsInputPrompt ?? null,
            offlineNotice: res.offlineNotice || null,
          },
        });
      }
    } catch (err) {
      self.postMessage({
        id,
        type: type === 'TRACE' ? 'TRACE_SUCCESS' : 'RUN_SUCCESS',
        result:
          type === 'TRACE'
            ? {
                steps: [],
                totalSteps: 0,
                truncated: false,
                stdout: '',
                stderr: String(err),
                durationMs: 0,
                error: String(err),
              }
            : {
                stdout: '',
                stderr: String(err),
                error: String(err),
                durationMs: 0,
                exitCode: 1,
              },
      });
    } finally {
      activeRunId = null;
      activeInputSab = null;
      activeInterruptSab = null;
    }
  }
};
