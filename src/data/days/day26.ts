/**
 * Day 26: Python for Web Development using Flask (Advanced Python)
 * Part A (Learn) conforming to Sections 10, 13.2, and 14 of the Master Specification.
 * Includes:
 *  - 8 Detailed Subtopics following the 10-step pedagogical structure
 *  - 3 Signature Simulations: flask-routing-sim, jinja-template-sim, http-form-redirect-sim
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_26_MODULE: DayModule = {
  schemaVersion: 1,
  number: 26,
  title: 'Python for Web Development using Flask',
  level: 'advanced',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/26_Day_Python_web',
  estimatedMinutes: 85,
  prerequisites: [11, 21],
  objectives: [
    'Understand HTTP request/response lifecycles and the WSGI interface connecting web servers to Python apps',
    'Create Flask applications with @app.route() decorators and typed dynamic path converters (<int:id>)',
    'Handle HTTP methods (GET, POST, PUT, DELETE) and read request.args, request.form, and request.get_json()',
    'Render dynamic HTML with Jinja2 {{ }} expressions, {% %} control blocks, and XSS auto-escaping',
    'Build maintainable layouts using Jinja2 template inheritance ({% extends %}, {% block %}) and url_for()',
    'Implement HTML form validation and the Post/Redirect/Get (PRG) pattern to prevent duplicate submissions',
    'Serve static files, return JSON APIs with jsonify(), and register custom 404/500 error handlers',
    'Organize modular Flask apps with Blueprints and deploy via production WSGI servers like gunicorn',
  ],
  subtopics: [
    {
      id: 'day26-sub1',
      number: 1,
      title: 'Web Architecture, HTTP Request/Response & WSGI',
      summary: 'Trace how a browser HTTP request flows through a WSGI server into a Python callable.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'How Python Speaks HTTP via WSGI',
        paragraphs: [
          'Every web interaction begins when a client sends an **HTTP Request** (method, path, headers, optional body) and receives an **HTTP Response** (status code like `200 OK` or `404 Not Found`, headers, and body).',
          'Python web frameworks like **Flask** sit behind **WSGI** (Web Server Gateway Interface, PEP 3333). The WSGI server (such as Werkzeug in development or Gunicorn in production) translates raw HTTP bytes into an `environ` dictionary and passes a `start_response` callback into your Python app.',
        ],
        keyTerms: [
          {
            term: 'WSGI',
            definition: 'Standard Python interface (`app(environ, start_response)`) decoupling web servers from frameworks.',
          },
          {
            term: 'HTTP Status Code',
            definition: '3-digit response code: 2xx Success, 3xx Redirect, 4xx Client Error, 5xx Server Error.',
          },
        ],
        bulletPoints: [
          'WSGI `environ` holds `REQUEST_METHOD`, `PATH_INFO`, `QUERY_STRING`, and headers.',
          'Never use Flask’s built-in `app.run()` in production; use a multi-worker WSGI server like `gunicorn`.',
        ],
      },
      visualise: {
        type: 'flask-routing-sim',
        title: 'WSGI & Flask URL Routing Dispatcher',
        badge: 'simulation',
        description: 'Inspect how WSGI `environ` fields flow into Flask routing and HTTP status responses.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Minimal PEP 3333 WSGI Application in Pure Python',
          runMode: 'real',
          code: `def simple_wsgi_app(environ, start_response):
    path = environ.get("PATH_INFO", "/")
    method = environ.get("REQUEST_METHOD", "GET")
    if method == "GET" and path == "/health":
        start_response("200 OK", [("Content-Type", "text/plain")])
        return [b"OK"]
    start_response("404 Not Found", [("Content-Type", "text/plain")])
    return [b"Not Found"]

captured = {}
def fake_start(status, headers):
    captured["status"] = status

body = simple_wsgi_app({"REQUEST_METHOD": "GET", "PATH_INFO": "/health"}, fake_start)
print(captured["status"], body[0].decode())`,
          expectedOutput: '200 OK OK',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'def simple_wsgi_app(environ, start_response):',
          internalEffect: 'Defines the standard two-argument WSGI callable invoked per HTTP request.',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: 'start_response("200 OK", [...]); return [b"OK"]',
          internalEffect: 'Emits status & headers first, then returns an iterable of byte chunks.',
        },
      ],
      apply: {
        domain: 'Platform Engineering',
        contextTitle: 'Inspecting Query Strings from WSGI environ',
        scenario: 'Parse `QUERY_STRING` into a dictionary using `urllib.parse.parse_qs`.',
        code: `from urllib.parse import parse_qs

environ = {"PATH_INFO": "/search", "QUERY_STRING": "q=flask&page=2"}
params = {k: v[0] for k, v in parse_qs(environ["QUERY_STRING"]).items()}
print(params)`,
        outcome: "{'q': 'flask', 'page': '2'}",
      },
      commonMistakes: [
        {
          label: 'Returning str Instead of bytes from Raw WSGI',
          erroneousCode: `# return ["Hello"]  # Raw WSGI expects bytes iterable, not str!`,
          errorMessage: 'TypeError: response body must be bytes',
          explanation: 'Raw WSGI requires `bytes` (`b"Hello"`). Flask wraps this automatically so view functions can return `str` or `dict`.',
          correctedCode: `# return [b"Hello"]`,
        },
      ],
      sourceNotes: 'Covers HTTP & WSGI architecture for Day 26.',
      practise: [
        {
          id: 'day26-ex1',
          title: 'Why Gunicorn Replaces app.run() in Production',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'A startup deploys `app.run(host="0.0.0.0", port=8000)` directly to production, and requests stall whenever one endpoint runs a 2-second report. Why does switching to `gunicorn -w 4` solve this?',
          contextScenario: 'Scaling a SaaS analytics web portal under concurrent user traffic.',
          options: [
            {
              id: 'a',
              text: 'Gunicorn spawns multiple WSGI worker processes to handle concurrent requests, whereas Flask’s dev server is not hardened for production concurrency.',
              explanation: 'Correct! Production WSGI servers like Gunicorn manage multiple worker processes, timeouts, and graceful restarts.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'Gunicorn automatically compiles Python into C++ machine code.',
              explanation: 'Incorrect. Gunicorn runs standard Python WSGI workers; it does not compile Python to C++.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'Gunicorn bypasses HTTP and uses raw UDP sockets.',
              explanation: 'Incorrect. Gunicorn is an HTTP/WSGI server over TCP.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'app.run() only supports GET requests.',
              explanation: 'Incorrect. `app.run()` supports all HTTP methods, but lacks production worker management and security hardening.',
              isCorrect: false,
            },
          ],
          hints: [
            'Consider how Flask’s built-in Werkzeug server is intended only for local development.',
            'What does `-w 4` tell Gunicorn to do?',
          ],
          points: 10,
        },
        {
          id: 'day26-ex2',
          title: 'Predict WSGI environ Status & Body',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'If a WSGI callable checks `environ["PATH_INFO"] == "/metrics"` and returns `("200 OK", [b"up=1"])` or `("404 Not Found", [b"missing"])`, what does `PATH_INFO="/status"` return?',
          contextScenario: 'Testing a health-check probe in a Kubernetes cluster.',
          options: [
            {
              id: 'a',
              text: "('404 Not Found', [b'missing'])",
              explanation: 'Correct! `/status` does not match `/metrics`, so the fallback 404 response is emitted.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: "('200 OK', [b'up=1'])",
              explanation: 'Incorrect. Only `PATH_INFO == "/metrics"` matches.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: "('405 Method Not Allowed', [b'missing'])",
              explanation: 'Incorrect. Unmatched paths return 404, not 405.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Raises KeyError: PATH_INFO',
              explanation: 'Incorrect. `PATH_INFO` is provided as `"/status"`.',
              isCorrect: false,
            },
          ],
          hints: [
            'Compare `"/status"` with `"/metrics"`.',
            'Which branch executes when they are not equal?',
          ],
          points: 10,
        },
        {
          id: 'day26-ex3',
          title: 'Build a WSGI Query String Parser',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Write `extract_query_params(environ)` that parses `environ.get("QUERY_STRING", "")` using `urllib.parse.parse_qs` and returns a dict mapping each key to its first value.',
          contextScenario: 'Extracting filter parameters from a WSGI request environment.',
          starterCode: `from urllib.parse import parse_qs

def extract_query_params(environ):
    # Parse environ.get("QUERY_STRING", "") and return {k: v[0] ...}
    pass

print(extract_query_params({"QUERY_STRING": "env=prod&region=eu"}))`,
          solutionCode: `from urllib.parse import parse_qs

def extract_query_params(environ):
    raw = environ.get("QUERY_STRING", "")
    return {k: vals[0] for k, vals in parse_qs(raw).items()}

print(extract_query_params({"QUERY_STRING": "env=prod&region=eu"}))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Parses query string',
              setup: 'print(extract_query_params({"QUERY_STRING": "env=prod&region=eu"}))',
              expected: "{'env': 'prod', 'region': 'eu'}",
              hidden: false,
            },
          ],
          hints: [
            'Call `parse_qs(environ.get("QUERY_STRING", ""))`.',
            'Each value in `parse_qs` is a list; take `vals[0]`.',
          ],
          points: 15,
        },
        {
          id: 'day26-ex4',
          title: 'Why WSGI Decouples Web Servers from Frameworks',
          type: 'theory-reasoning',
          tier: 'standard',
          prompt: 'Explain the architectural benefit of PEP 3333 (WSGI) sitting between Nginx/Gunicorn and Flask/Django.',
          contextScenario: 'Evaluating Python web server deployment options for an enterprise team.',
          modelAnswer: 'WSGI defines a universal Python callable contract `app(environ, start_response)`. Because both web servers (Gunicorn, uWSGI) and frameworks (Flask, Django) implement this contract, teams can swap or scale the server layer independently without rewriting application routes.',
          markingCriteria: [
            { id: 'mc1', label: 'Identifies the standard callable contract (environ, start_response)', points: 5 },
            { id: 'mc2', label: 'Explains server and framework interchangeability/decoupling', points: 5 },
          ],
          hints: [
            'Think about how Gunicorn can serve both Flask and Django apps.',
            'What does the standard `app(environ, start_response)` contract provide?',
          ],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day26-sub2',
      number: 2,
      title: 'Flask App Anatomy, @app.route() & Dynamic Path Converters',
      summary: 'Map URL paths and typed path parameters (<int:id>, <string:slug>) to Python view functions.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Declarative URL Routing with @app.route()',
        paragraphs: [
          'Flask uses the **`@app.route("/path")`** decorator to bind a URL pattern to a Python **view function** inside `app.url_map`.',
          'Dynamic segments like **`/users/<int:user_id>`** extract and validate parts of the URL before your function runs. Built-in converters include `string` (default, no slashes), `int`, `float`, `uuid`, and `path` (accepts slashes).',
        ],
        keyTerms: [
          {
            term: 'View Function',
            definition: 'A Python function decorated with `@app.route(...)` that returns an HTTP response.',
          },
          {
            term: 'URL Converter',
            definition: 'Type annotation inside `<type:name>` (e.g., `<int:id>`) that parses and validates URL segments.',
          },
        ],
        bulletPoints: [
          'If `<int:user_id>` receives `"abc"`, Flask returns `404 Not Found` automatically without calling your view.',
          'Flask also provides shorthand decorators `@app.get(...)` and `@app.post(...)`.',
        ],
      },
      visualise: {
        type: 'flask-routing-sim',
        title: 'Dynamic Route Matching (/users/<int:user_id>)',
        badge: 'simulation',
        description: 'Click `GET /users/42` to see how `<int:user_id>` extracts `42` as an integer.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Simulating Typed URL Route Matching with Regex',
          runMode: 'real',
          code: `import re

def match_user_route(path):
    m = re.fullmatch(r"/users/(\\d+)", path)
    if not m:
        return (404, "Not Found")
    user_id = int(m.group(1))
    return (200, f"User #{user_id} (type={type(user_id).__name__})")

print(match_user_route("/users/42"))
print(match_user_route("/users/alice"))`,
          expectedOutput: `(200, 'User #42 (type=int)')
(404, 'Not Found')`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 're.fullmatch(r"/users/(\\d+)", path)',
          internalEffect: 'Enforces that the segment is digits only, mirroring `<int:user_id>`.',
        },
        {
          step: 2,
          codeLine: 7,
          instruction: 'user_id = int(m.group(1))',
          internalEffect: 'Converts the matched string into a Python int before passing to the handler.',
        },
      ],
      apply: {
        domain: 'REST API Design',
        contextTitle: 'Dispatching Multiple Routes from a Route Table',
        scenario: 'Look up handlers in a route registry dictionary.',
        code: `routes = {
    "/": lambda: (200, "Home"),
    "/about": lambda: (200, "About Python Visual Lab"),
}
for path in ["/", "/missing"]:
    status, body = routes.get(path, lambda: (404, "Not Found"))()
    print(path, "->", status, body)`,
        outcome: `/ -> 200 Home
/missing -> 404 Not Found`,
      },
      commonMistakes: [
        {
          label: 'Forgetting Leading Slash in @app.route()',
          erroneousCode: `# @app.route("users")  # ValueError: urls must start with a leading slash`,
          errorMessage: "ValueError: urls must start with a leading slash",
          explanation: 'Every Flask route string must begin with `/`, such as `@app.route("/users")`.',
          correctedCode: `# @app.route("/users")`,
        },
      ],
      sourceNotes: 'Covers @app.route() and URL converters for Day 26.',
      practise: [
        {
          id: 'day26-ex5',
          title: 'Typed Dynamic Converter Behavior (<int:id>)',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Given `@app.route("/invoices/<int:inv_id>")`, what happens when a client requests `GET /invoices/abc`?',
          contextScenario: 'Protecting a billing lookup endpoint from non-numeric IDs.',
          options: [
            {
              id: 'a',
              text: 'Flask returns 404 Not Found automatically without calling the view function.',
              explanation: 'Correct! The `<int:...>` converter only matches non-negative digits, so `"abc"` fails routing and returns 404.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'Flask passes "abc" as a string to the view function.',
              explanation: 'Incorrect. That only happens for the default `<inv_id>` (string) converter.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'Flask raises a 500 Internal Server Error inside int("abc").',
              explanation: 'Incorrect. The URL map rejects `"abc"` during routing before the view runs.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Flask redirects to /invoices/0.',
              explanation: 'Incorrect. Converters never substitute default numbers.',
              isCorrect: false,
            },
          ],
          hints: [
            'Does `<int:inv_id>` validate at routing time or inside the function?',
            'If a URL pattern does not match, what status code does Flask return?',
          ],
          points: 10,
        },
        {
          id: 'day26-ex6',
          title: 'Complete the Dynamic Route Decorator',
          type: 'fill-the-gaps',
          tier: 'foundation',
          prompt: 'Fill in the missing converter and parameter name to capture an integer `item_id` from `/catalog/105`.',
          contextScenario: 'Building an e-commerce product detail route.',
          gaps: [
            {
              id: 'g1',
              beforeText: '@app.route("/catalog/<',
              afterText: ':item_id>")\ndef get_item(',
              correctAnswer: 'int',
              options: ['int', 'number', 'str', 'path'],
            },
            {
              id: 'g2',
              beforeText: '',
              afterText: '):\n    return {"id": item_id}',
              correctAnswer: 'item_id',
              options: ['item_id', 'id', 'request', 'args'],
            },
          ],
          hints: [
            'Use the `int` URL converter.',
            'The view function parameter name must match `item_id`.',
          ],
          points: 10,
        },
        {
          id: 'day26-ex7',
          title: 'Fix Missing Leading Slash & Integer Conversion in Router',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'Fix `match_order_route(path)` so it requires a leading `/` and returns `(200, int_id)` as an `int` rather than a `str`.',
          contextScenario: 'Implementing a lightweight URL matcher for `/orders/<int:id>`.',
          starterCode: `import re

def match_order_route(path):
    m = re.fullmatch(r"orders/(\\d+)", path)  # BUG: missing leading /
    if not m:
        return (404, None)
    return (200, m.group(1))  # BUG: returns str instead of int!

print(match_order_route("/orders/77"))`,
          solutionCode: `import re

def match_order_route(path):
    m = re.fullmatch(r"/orders/(\\d+)", path)
    if not m:
        return (404, None)
    return (200, int(m.group(1)))

print(match_order_route("/orders/77"))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Matches /orders/77 with int 77',
              setup: 'status, val = match_order_route("/orders/77")\nprint(status, val, type(val).__name__)',
              expected: '200 77 int',
              hidden: false,
            },
          ],
          hints: [
            'Add `/` at the start of the regex pattern.',
            'Wrap `m.group(1)` in `int(...)`.',
          ],
          points: 15,
        },
        {
          id: 'day26-ex8',
          title: 'Implement <path:subpath> vs <string:slug> Matcher',
          type: 'write-code',
          tier: 'challenge',
          prompt: 'Write `route_docs(path)` that matches `/docs/<subpath>` (allowing nested slashes like `/docs/api/v2/auth`) and returns `(200, subpath)`, or `(404, None)` if it does not start with `/docs/` with a non-empty subpath.',
          contextScenario: 'Serving nested documentation pages in a developer portal.',
          starterCode: `def route_docs(path):
    # Return (200, subpath) if path starts with "/docs/" and has non-empty subpath, else (404, None)
    pass

print(route_docs("/docs/api/v2/auth"))
print(route_docs("/docs/"))`,
          solutionCode: `def route_docs(path):
    if path.startswith("/docs/") and len(path) > len("/docs/"):
        return (200, path[len("/docs/"):])
    return (404, None)

print(route_docs("/docs/api/v2/auth"))
print(route_docs("/docs/"))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Handles nested path converter',
              setup: 'print(route_docs("/docs/api/v2/auth"), route_docs("/docs/"))',
              expected: "(200, 'api/v2/auth') (404, None)",
              hidden: false,
            },
          ],
          hints: [
            'Check `path.startswith("/docs/")` and `len(path) > 6`.',
            'Slice `path[6:]` to extract the nested subpath.',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day26-sub3',
      number: 3,
      title: 'HTTP Methods (GET, POST, PUT, DELETE) & the request Object',
      summary: 'Differentiate idempotent reads from state-changing writes and inspect query, form, and JSON payloads.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Reading Data Safely from Flask’s request Object',
        paragraphs: [
          'By default, `@app.route("/items")` only accepts **`GET`**. To accept form submissions or API writes, specify **`methods=["GET", "POST"]`** (or `@app.post("/items")`). If a client sends `DELETE` to a `POST`-only route, Flask returns **`405 Method Not Allowed`**.',
          'Inside a view function, Flask’s thread-local **`request`** object exposes inputs by location: `request.args` (URL query `?k=v`), `request.form` (HTML form body), and `request.get_json()` (JSON API body).',
        ],
        keyTerms: [
          {
            term: '405 Method Not Allowed',
            definition: 'Returned when the URL path exists in `url_map` but does not allow the incoming HTTP method.',
          },
          {
            term: 'request.args vs request.form vs request.get_json()',
            definition: 'Three distinct attributes on Flask `request` for query strings, form-encoded bodies, and JSON bodies.',
          },
        ],
        bulletPoints: [
          'Use `request.args.get("page", default=1, type=int)` for safe query parameter parsing.',
          'Use `GET` for safe, cacheable reads; `POST` for creates; `PUT`/`PATCH` for updates; `DELETE` for removals.',
        ],
      },
      visualise: {
        type: 'flask-routing-sim',
        title: '405 Method Not Allowed vs 201 Created',
        badge: 'simulation',
        description: 'Compare `POST /api/orders` (201) with `DELETE /api/orders` (405 Method Not Allowed).',
        initialConfig: {},
      },
      code: [
        {
          title: 'Method-Aware Route Dispatcher (200 / 201 / 405 / 404)',
          runMode: 'real',
          code: `route_methods = {
    "/api/orders": {"GET", "POST"},
}

def dispatch(method, path):
    if path not in route_methods:
        return 404
    if method not in route_methods[path]:
        return 405
    return 201 if method == "POST" else 200

print(dispatch("POST", "/api/orders"))
print(dispatch("DELETE", "/api/orders"))
print(dispatch("GET", "/unknown"))`,
          expectedOutput: `201
405
404`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 6,
          instruction: 'if path not in route_methods: return 404',
          internalEffect: 'Returns 404 only when the path itself has no registered rules.',
        },
        {
          step: 2,
          codeLine: 8,
          instruction: 'if method not in route_methods[path]: return 405',
          internalEffect: 'Returns 405 when the path exists but rejects the HTTP method.',
        },
      ],
      apply: {
        domain: 'API Backend',
        contextTitle: 'Parsing JSON Request Body Safely',
        scenario: 'Validate required keys on an incoming JSON order payload.',
        code: `import json

raw_body = '{"sku": "KB-01", "qty": 2}'
payload = json.loads(raw_body)
if "sku" in payload and isinstance(payload.get("qty"), int):
    print("Valid order:", payload["sku"], payload["qty"])`,
        outcome: 'Valid order: KB-01 2',
      },
      commonMistakes: [
        {
          label: 'Reading Form Data from request.args Instead of request.form',
          erroneousCode: `# email = request.args["email"]  # Fails for POST HTML forms!`,
          errorMessage: 'KeyError: email on POST form submission',
          explanation: 'URL query strings live in `request.args`; `POST` HTML form fields live in `request.form`.',
          correctedCode: `# email = request.form.get("email", "").strip()`,
        },
      ],
      sourceNotes: 'Covers HTTP methods and Flask request object for Day 26.',
      practise: [
        {
          id: 'day26-ex9',
          title: 'Predict 404 vs 405 Method Not Allowed',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'A Flask app defines `@app.post("/webhooks/stripe")`. What HTTP status code does Flask return for `GET /webhooks/stripe` vs `GET /webhooks/unknown`?',
          contextScenario: 'Debugging a webhook integration test suite.',
          options: [
            {
              id: 'a',
              text: '405 Method Not Allowed for GET /webhooks/stripe; 404 Not Found for GET /webhooks/unknown.',
              explanation: 'Correct! `/webhooks/stripe` exists in `url_map` (just not for GET), so Flask returns 405; `/webhooks/unknown` does not exist at all, so Flask returns 404.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: '404 Not Found for both.',
              explanation: 'Incorrect. Existing paths with disallowed HTTP methods return 405, not 404.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '405 Method Not Allowed for both.',
              explanation: 'Incorrect. Unknown paths return 404.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: '200 OK for GET /webhooks/stripe because Flask always enables GET.',
              explanation: 'Incorrect. `@app.post(...)` restricts the route to POST only.',
              isCorrect: false,
            },
          ],
          hints: [
            'Does the path `/webhooks/stripe` exist in `app.url_map`?',
            'Path exists + wrong method = 405; path missing = 404.',
          ],
          points: 10,
        },
        {
          id: 'day26-ex10',
          title: 'Order the JSON POST Endpoint Steps',
          type: 'order-the-lines',
          tier: 'foundation',
          prompt: 'Order these lines to implement a Flask `POST /api/devices` endpoint that validates JSON input and returns HTTP 201.',
          contextScenario: 'Registering IoT devices via a JSON REST endpoint.',
          jumbledLines: [
            { id: 'l3', code: '    if not data or "serial" not in data:', indent: 0 },
            { id: 'l1', code: '@app.post("/api/devices")', indent: 0 },
            { id: 'l4', code: '        return jsonify({"error": "serial required"}), 400', indent: 0 },
            { id: 'l2', code: 'def register_device():\n    data = request.get_json(silent=True)', indent: 0 },
            { id: 'l5', code: '    return jsonify({"registered": data["serial"]}), 201', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4', 'l5'],
          hints: [
            'Start with the `@app.post` decorator.',
            'Parse JSON with `request.get_json(silent=True)` before checking `"serial"`.',
            'Return `400` on invalid input and `201` on success.',
          ],
          points: 10,
        },
        {
          id: 'day26-ex11',
          title: 'Trace Where request.args, request.form, and request.get_json() Read From',
          type: 'explain-the-trace',
          tier: 'standard',
          prompt: 'A client sends `POST /search?limit=10` with JSON body `{"query": "pandas"}`. Explain which `request` attribute holds `"limit"` and which holds `"query"`.',
          contextScenario: 'Handling hybrid query-string + JSON body API requests.',
          traceStepCode: `# HTTP Request:
# POST /search?limit=10
# Content-Type: application/json
# Body: {"query": "pandas"}`,
          traceQuestion: 'Which Flask `request` attributes return `"10"` and `"pandas"`?',
          modelAnswer: '`request.args.get("limit")` reads `"10"` from the URL query string (`?limit=10`), while `request.get_json()["query"]` reads `"pandas"` from the JSON request body. `request.form` is empty because the body is JSON, not form-encoded.',
          markingCriteria: [
            { id: 'mc1', label: 'Maps limit=10 to request.args', points: 5 },
            { id: 'mc2', label: 'Maps {"query": "pandas"} to request.get_json()', points: 5 },
          ],
          hints: [
            'Everything after `?` in the URL goes into `request.args`.',
            'Application/json payloads are parsed by `request.get_json()`.',
          ],
          points: 15,
        },
        {
          id: 'day26-ex12',
          title: 'Implement Method-Aware HTTP Dispatcher',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Write `dispatch_request(route_table, method, path)` where `route_table` maps `path -> set_of_methods`. Return `404` if `path` is missing, `405` if `method` is not allowed, `201` for `POST`, and `200` otherwise.',
          contextScenario: 'Building a unit-testable Flask routing simulator.',
          starterCode: `def dispatch_request(route_table, method, path):
    # Return 404, 405, 201 (POST), or 200
    pass

table = {"/items": {"GET", "POST"}, "/health": {"GET"}}
print(dispatch_request(table, "POST", "/items"))
print(dispatch_request(table, "DELETE", "/items"))
print(dispatch_request(table, "GET", "/none"))`,
          solutionCode: `def dispatch_request(route_table, method, path):
    if path not in route_table:
        return 404
    if method not in route_table[path]:
        return 405
    return 201 if method == "POST" else 200

table = {"/items": {"GET", "POST"}, "/health": {"GET"}}
print(dispatch_request(table, "POST", "/items"))
print(dispatch_request(table, "DELETE", "/items"))
print(dispatch_request(table, "GET", "/none"))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Returns 201, 405, 404',
              setup: 't = {"/items": {"GET", "POST"}}\nprint(dispatch_request(t, "POST", "/items"), dispatch_request(t, "DELETE", "/items"), dispatch_request(t, "GET", "/x"))',
              expected: '201 405 404',
              hidden: false,
            },
          ],
          hints: [
            'Check `if path not in route_table: return 404` first.',
            'Then check `if method not in route_table[path]: return 405`.',
          ],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day26-sub4',
      number: 4,
      title: 'Jinja2 Templates: {{ }}, {% %}, Filters & XSS Auto-Escaping',
      summary: 'Render dynamic HTML safely with Jinja2 expressions, loops, conditionals, and automatic HTML escaping.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Dynamic HTML Without XSS Vulnerabilities',
        paragraphs: [
          'Instead of concatenating HTML strings in Python, Flask renders files from the `templates/` folder via **`render_template("home.html", user_name="Ada")`** using the **Jinja2** engine.',
          'Jinja2 uses **`{{ expr }}`** to output values, **`{% stmt %}`** for `if`/`for` logic, and **filters** like `{{ name|upper }}`. Crucially, Jinja2 **auto-escapes** HTML characters (`<`, `>`, `&`, `"`) in `.html` templates so user-supplied `<script>` tags cannot execute Cross-Site Scripting (XSS) attacks.',
        ],
        keyTerms: [
          {
            term: 'Auto-Escaping',
            definition: 'Automatic conversion of `<`, `>`, `&` to `&lt;`, `&gt;`, `&amp;` in `.html` templates to block XSS.',
          },
          {
            term: '|safe Filter',
            definition: 'Disables auto-escaping for trusted HTML; dangerous if used on untrusted user input.',
          },
        ],
        bulletPoints: [
          'Use `{{ var }}` for variables and `{% for x in items %} ... {% endfor %}` for loops.',
          'Never apply `|safe` to user-submitted comments, names, or query parameters.',
        ],
      },
      visualise: {
        type: 'jinja-template-sim',
        title: 'Jinja2 Template & Auto-Escaping Lab',
        badge: 'simulation',
        description: 'Click `Test XSS Input` and toggle `Autoescape` to see how Jinja2 neutralizes `<script>` tags.',
        initialConfig: {},
      },
      code: [
        {
          title: 'HTML Auto-Escaping in Python (html.escape)',
          runMode: 'real',
          code: `import html

user_input = '<script>alert("xss")</script>'
safe_output = f"<p>Hello, {html.escape(user_input)}</p>"
print(safe_output)`,
          expectedOutput: '<p>Hello, &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</p>',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'html.escape(user_input)',
          internalEffect: 'Replaces `<`, `>`, and `"` with inert HTML character entities.',
        },
      ],
      apply: {
        domain: 'Web Security',
        contextTitle: 'Rendering Safe List Items from User Data',
        scenario: 'Escape each item before wrapping in `<li>` tags.',
        code: `import html
tags = ["python", "<b>flask</b>"]
rendered = "".join(f"<li>{html.escape(t)}</li>" for t in tags)
print(rendered)`,
        outcome: '<li>python</li><li>&lt;b&gt;flask&lt;/b&gt;</li>',
      },
      commonMistakes: [
        {
          label: 'Using |safe on Untrusted User Input',
          erroneousCode: `# {{ comment_text | safe }}  <!-- Enables stored XSS! -->`,
          errorMessage: 'Security Vulnerability: Stored Cross-Site Scripting (XSS)',
          explanation: 'Only use `|safe` on HTML sanitized by a library like `bleach` or authored by trusted developers.',
          correctedCode: `# {{ comment_text }}  <!-- Jinja2 auto-escapes by default -->`,
        },
      ],
      sourceNotes: 'Covers Jinja2 syntax and XSS auto-escaping for Day 26.',
      practise: [
        {
          id: 'day26-ex13',
          title: 'Preventing Stored XSS in Jinja2 Templates',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'A user sets their display name to `<img src=x onerror=alert(1)>`. Which Jinja2 expression renders it safely as visible text without executing JavaScript?',
          contextScenario: 'Hardening a community forum profile page against XSS.',
          options: [
            {
              id: 'a',
              text: '{{ display_name }} (default auto-escaping enabled)',
              explanation: 'Correct! Jinja2 auto-escapes `.html` templates by default, converting `<` and `>` to `&lt;` and `&gt;`.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: '{{ display_name | safe }}',
              explanation: 'Incorrect. `|safe` disables auto-escaping and allows the `onerror` script to execute.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '{% autoescape false %}{{ display_name }}{% endautoescape %}',
              explanation: 'Incorrect. Disabling autoescape creates an XSS vulnerability.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: '{{ display_name | upper | safe }}',
              explanation: 'Incorrect. Uppercasing HTML tags (`<IMG ... ONERROR=...>`) still executes in browsers when `|safe` is applied.',
              isCorrect: false,
            },
          ],
          hints: [
            'HTML browsers still execute uppercase `<IMG ONERROR=...>` tags.',
            'Jinja2 escapes `.html` variables automatically unless told otherwise.',
          ],
          points: 10,
        },
        {
          id: 'day26-ex14',
          title: 'Predict Escaped HTML Output',
          type: 'predict-output',
          tier: 'standard',
          prompt: 'What does `f"<span>{html.escape(msg)}</span>"` produce when `msg = "A & B < 5"`?',
          contextScenario: 'Rendering mathematical comparison text inside an HTML badge.',
          options: [
            {
              id: 'a',
              text: '<span>A &amp; B &lt; 5</span>',
              explanation: 'Correct! Both `&` and `<` are converted into `&amp;` and `&lt;`.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: '<span>A & B &lt; 5</span>',
              explanation: 'Incorrect. `&` is also escaped to `&amp;` so it cannot form unintended HTML entities.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '<span>A & B < 5</span>',
              explanation: 'Incorrect. `html.escape` escapes `<`, `>`, `&`, `"`, and `\'`.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: '<span>A &amp; B < 5</span>',
              explanation: 'Incorrect. `<` is always escaped to `&lt;`.',
              isCorrect: false,
            },
          ],
          hints: [
            '`&` becomes `&amp;`.',
            '`<` becomes `&lt;`.',
          ],
          points: 15,
        },
        {
          id: 'day26-ex15',
          title: 'Fix Unescaped HTML Injection in Template Renderer',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'Fix `render_profile(name)` so user-supplied HTML characters are escaped with `html.escape()` instead of injected raw.',
          contextScenario: 'Securing a user bio renderer.',
          starterCode: `import html

def render_profile(name):
    return f"<div class='user'>{name}</div>"  # BUG: raw interpolation!

print(render_profile("<script>bad()</script>"))`,
          solutionCode: `import html

def render_profile(name):
    return f"<div class='user'>{html.escape(name)}</div>"

print(render_profile("<script>bad()</script>"))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Escapes script tags',
              setup: 'print(render_profile("<script>bad()</script>"))',
              expected: "<div class='user'>&lt;script&gt;bad()&lt;/script&gt;</div>",
              hidden: false,
            },
          ],
          hints: [
            'Import `html` is already present.',
            'Wrap `name` in `html.escape(name)`.',
          ],
          points: 15,
        },
        {
          id: 'day26-ex16',
          title: 'Render Safe Escaped Unordered List',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Write `render_ul(items)` that escapes each string in `items` with `html.escape` and returns `"<ul><li>...</li></ul>"` (or `"<ul></ul>"` if empty).',
          contextScenario: 'Rendering search history tags safely in a dashboard.',
          starterCode: `import html

def render_ul(items):
    # Return "<ul>" + "".join(f"<li>{html.escape(x)}</li>" ...) + "</ul>"
    pass

print(render_ul(["flask", "<b>xss</b>"]))`,
          solutionCode: `import html

def render_ul(items):
    inner = "".join(f"<li>{html.escape(str(x))}</li>" for x in items)
    return f"<ul>{inner}</ul>"

print(render_ul(["flask", "<b>xss</b>"]))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Escapes list items',
              setup: 'print(render_ul(["flask", "<b>xss</b>"]))',
              expected: '<ul><li>flask</li><li>&lt;b&gt;xss&lt;/b&gt;</li></ul>',
              hidden: false,
            },
          ],
          hints: [
            'Use a generator expression over `items`.',
            'Escape each item with `html.escape(str(x))`.',
          ],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day26-sub5',
      number: 5,
      title: 'Template Inheritance ({% extends %}, {% block %}) & url_for()',
      summary: 'Eliminate duplicated navbars/footers using base layouts and generate resilient links with url_for().',
      estimatedMinutes: 10,
      introduce: {
        headline: 'DRY Layouts with Inheritance & Reverse URL Routing',
        paragraphs: [
          'Repeating `<head>`, `<nav>`, and `<footer>` across 20 HTML pages is brittle. Jinja2 solves this with **template inheritance**: define shared chrome in `base.html` with **`{% block content %}{% endblock %}`**, then child templates start with **`{% extends "base.html" %}`** and override only their blocks.',
          'Similarly, never hardcode URLs like `href="/users/42"`. Use **`url_for("get_user", user_id=42)`**, which generates the URL from the Python **view function name**—so changing `@app.route` later updates every link automatically.',
        ],
        keyTerms: [
          {
            term: '{% extends "base.html" %}',
            definition: 'Inherits structure and blocks from a parent layout template.',
          },
          {
            term: 'url_for(endpoint, **values)',
            definition: 'Reverse-resolves a Flask view function name into its current URL path.',
          },
        ],
        bulletPoints: [
          '`{% extends ... %}` must be the very first tag in a child template.',
          'Use `url_for("static", filename="css/app.css")` for static assets.',
        ],
      },
      visualise: {
        type: 'jinja-template-sim',
        title: 'Template Inheritance ({% extends %} + {% block %})',
        badge: 'simulation',
        description: 'Inspect how `home.html` extends `base.html` and fills `{% block content %}`.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Modeling Reverse URL Resolution (url_for)',
          runMode: 'real',
          code: `endpoint_map = {
    "home": "/",
    "user_profile": "/users/{user_id}",
}

def url_for(endpoint, **kwargs):
    pattern = endpoint_map[endpoint]
    return pattern.format(**kwargs)

print(url_for("home"))
print(url_for("user_profile", user_id=42))`,
          expectedOutput: `/
/users/42`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 6,
          instruction: 'def url_for(endpoint, **kwargs):',
          internalEffect: 'Looks up the route template by view function name instead of hardcoding paths.',
        },
      ],
      apply: {
        domain: 'Frontend Architecture',
        contextTitle: 'Composing Base Layout + Page Block',
        scenario: 'Inject page title and content into a shared HTML shell.',
        code: `def render_with_base(title, content):
    return f"<html><title>{title}</title><body>{content}</body></html>"

print(render_with_base("Dashboard", "<h1>Metrics</h1>"))`,
        outcome: '<html><title>Dashboard</title><body><h1>Metrics</h1></body></html>',
      },
      commonMistakes: [
        {
          label: 'Passing URL Path Instead of Function Name to url_for()',
          erroneousCode: `# url_for("/users/42")  # BuildError: Could not build url for endpoint '/users/42'`,
          errorMessage: 'werkzeug.routing.exceptions.BuildError',
          explanation: '`url_for()` takes the Python **function name** (endpoint), e.g., `url_for("get_user", user_id=42)`.',
          correctedCode: `# url_for("get_user", user_id=42)`,
        },
      ],
      sourceNotes: 'Covers Jinja2 inheritance and url_for() for Day 26.',
      practise: [
        {
          id: 'day26-ex17',
          title: 'Why url_for() Beats Hardcoded Links',
          type: 'theory-reasoning',
          tier: 'standard',
          prompt: 'Explain why `url_for("user_detail", user_id=42)` is superior to hardcoding `href="/users/42"` in Jinja2 templates.',
          contextScenario: 'Refactoring a Flask app to add an `/app/v2` prefix across 30 routes.',
          modelAnswer: '`url_for()` resolves the URL dynamically from the Python endpoint name (`user_detail`). If the route decorator changes from `/users/<int:user_id>` to `/app/v2/users/<int:user_id>`, every `url_for()` link updates automatically without broken links, and `url_for` also handles URL encoding and application root prefixes.',
          markingCriteria: [
            { id: 'mc1', label: 'Notes reverse lookup by endpoint function name', points: 5 },
            { id: 'mc2', label: 'Explains resilience when route paths or prefixes change', points: 5 },
          ],
          hints: [
            'What happens if you change `@app.route("/users/...")` to `@app.route("/v2/users/...")`?',
            'Does `url_for` take the URL string or the Python function name?',
          ],
          points: 15,
        },
        {
          id: 'day26-ex18',
          title: 'Complete the Child Template Inheritance Tags',
          type: 'fill-the-gaps',
          tier: 'foundation',
          prompt: 'Fill in the two Jinja2 block tags so `dashboard.html` inherits from `base.html` and overrides the `content` block.',
          contextScenario: 'Creating a new analytics page using the shared layout.',
          gaps: [
            {
              id: 'g1',
              beforeText: '{% ',
              afterText: ' "base.html" %}',
              correctAnswer: 'extends',
              options: ['extends', 'import', 'include', 'inherit'],
            },
            {
              id: 'g2',
              beforeText: '{% ',
              afterText: ' content %}\n  <h1>Metrics</h1>\n{% endblock %}',
              correctAnswer: 'block',
              options: ['block', 'section', 'def', 'slot'],
            },
          ],
          hints: [
            'Parent inheritance uses `{% extends "base.html" %}`.',
            'Overridable regions use `{% block name %}`.',
          ],
          points: 10,
        },
        {
          id: 'day26-ex19',
          title: 'Order the Base-to-Child Template Resolution',
          type: 'order-the-lines',
          tier: 'foundation',
          prompt: 'Order the lines of a valid Jinja2 child template.',
          contextScenario: 'Authoring `orders.html` extending `base.html`.',
          jumbledLines: [
            { id: 'l3', code: '  <h1>Recent Orders</h1>', indent: 0 },
            { id: 'l1', code: '{% extends "base.html" %}', indent: 0 },
            { id: 'l4', code: '{% endblock %}', indent: 0 },
            { id: 'l2', code: '{% block content %}', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: [
            '`{% extends "base.html" %}` must be the very first line.',
            'Wrap the page HTML inside `{% block content %} ... {% endblock %}`.',
          ],
          points: 10,
        },
        {
          id: 'day26-ex20',
          title: 'Implement Reverse URL Builder with Query Params',
          type: 'write-code',
          tier: 'challenge',
          prompt: 'Write `build_url(endpoint_map, endpoint, **params)` that substitutes `{key}` placeholders in the route pattern and appends any extra `params` as a sorted `?k=v&...` query string.',
          contextScenario: 'Implementing a mini `url_for()` supporting both path and query parameters.',
          starterCode: `def build_url(endpoint_map, endpoint, **params):
    # Format path placeholders, append remaining params as sorted ?k=v query string
    pass

routes = {"user_orders": "/users/{uid}/orders"}
print(build_url(routes, "user_orders", uid=7, status="paid"))`,
          solutionCode: `import re

def build_url(endpoint_map, endpoint, **params):
    pattern = endpoint_map[endpoint]
    path_keys = set(re.findall(r"\\{(\\w+)\\}", pattern))
    path_vals = {k: params[k] for k in path_keys}
    url = pattern.format(**path_vals)
    query_items = sorted((k, v) for k, v in params.items() if k not in path_keys)
    if query_items:
        qs = "&".join(f"{k}={v}" for k, v in query_items)
        url = f"{url}?{qs}"
    return url

routes = {"user_orders": "/users/{uid}/orders"}
print(build_url(routes, "user_orders", uid=7, status="paid"))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Builds path + sorted query string',
              setup: 'r = {"user_orders": "/users/{uid}/orders"}\nprint(build_url(r, "user_orders", uid=7, status="paid"))',
              expected: '/users/7/orders?status=paid',
              hidden: false,
            },
          ],
          hints: [
            'Find `{key}` placeholders with `re.findall(r"\\{(\\w+)\\}", pattern)`.',
            'Format the path with those keys, then join remaining sorted `params` as `k=v`.',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day26-sub6',
      number: 6,
      title: 'HTML Forms, Server Validation & Post/Redirect/Get (PRG)',
      summary: 'Validate POST form inputs on the server and redirect with 302 to prevent duplicate refresh submissions.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Why POST Handlers Should Redirect, Not Render',
        paragraphs: [
          'When a user submits an HTML form via `POST /contact`, returning `render_template("thanks.html")` directly leaves `POST /contact` as the browser’s last request. If the user presses **Refresh (F5)**, the browser re-sends the `POST` and creates a **duplicate record**.',
          'The **Post/Redirect/Get (PRG)** pattern fixes this: after validating `request.form` and saving data, return **`redirect(url_for("thanks"))`** (`302 Found`). The browser then issues a safe `GET /thanks`, making refresh idempotent.',
        ],
        keyTerms: [
          {
            term: 'Post/Redirect/Get (PRG)',
            definition: 'Pattern where a successful POST returns a 302 redirect to a GET confirmation route.',
          },
          {
            term: 'flash(message)',
            definition: 'Stores a one-time notification in the signed session cookie across a redirect.',
          },
        ],
        bulletPoints: [
          'Always validate form fields server-side; client-side HTML `required` attributes can be bypassed.',
          'If validation fails, re-render the form template with `400` or inline error messages.',
        ],
      },
      visualise: {
        type: 'http-form-redirect-sim',
        title: 'Form Handling & Post / Redirect / Get (PRG) Simulator',
        badge: 'simulation',
        description: 'Step through PRG vs Direct POST Render and watch DB row counts on browser refresh.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Server-Side Form Validation & PRG Response Tuple',
          runMode: 'real',
          code: `def handle_signup(form):
    email = form.get("email", "").strip()
    if "@" not in email:
        return (400, "Invalid email address")
    return (302, "Location: /welcome")

print(handle_signup({"email": "bad-email"}))
print(handle_signup({"email": "ada@example.com"}))`,
          expectedOutput: `(400, 'Invalid email address')
(302, 'Location: /welcome')`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'if "@" not in email: return (400, ...)',
          internalEffect: 'Rejects invalid input before writing to the database.',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: 'return (302, "Location: /welcome")',
          internalEffect: 'Issues a redirect on success so browser refresh only repeats GET /welcome.',
        },
      ],
      apply: {
        domain: 'Checkout Flow',
        contextTitle: 'Preventing Double Charges with PRG',
        scenario: 'Simulate PRG sequence tracking database insert count.',
        code: `db = []
def post_order(item):
    db.append(item)
    return ("302 Found", "/receipt")

status, target = post_order("Laptop")
print(status, target, "rows:", len(db))`,
        outcome: '302 Found /receipt rows: 1',
      },
      commonMistakes: [
        {
          label: 'Rendering a Confirmation Template Directly from POST',
          erroneousCode: `# if request.method == "POST": save(); return render_template("ok.html")`,
          errorMessage: 'Browser refresh re-submits POST and duplicates the database write',
          explanation: 'Always return `redirect(url_for("..."))` after a successful state-changing POST.',
          correctedCode: `# if request.method == "POST": save(); return redirect(url_for("ok"))`,
        },
      ],
      sourceNotes: 'Covers HTML forms, validation, and PRG for Day 26.',
      practise: [
        {
          id: 'day26-ex21',
          title: 'Why PRG Redirects Prevent Duplicate Form Writes',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'After a user submits a payment form via `POST /checkout`, your Flask handler returns `render_template("receipt.html")` directly. What happens if the user presses F5 (Refresh)?',
          contextScenario: 'Preventing accidental double-charges in an e-commerce checkout flow.',
          options: [
            {
              id: 'a',
              text: 'The browser re-sends the POST /checkout request, potentially creating a duplicate order/charge.',
              explanation: 'Correct! Returning 302 `redirect(url_for("receipt"))` switches the browser history to a safe `GET /receipt` request.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'The browser automatically converts the refresh into a GET /checkout.',
              explanation: 'Incorrect. Browsers repeat the exact last HTTP method/request (POST) on refresh unless redirected.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'Flask caches POST responses and refuses to re-run the function.',
              explanation: 'Incorrect. POST requests are not cached and will re-execute.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Flask returns 405 Method Not Allowed on refresh.',
              explanation: 'Incorrect. `/checkout` accepts POST, so it executes again.',
              isCorrect: false,
            },
          ],
          hints: [
            'What HTTP method does the browser repeat when refreshing a page rendered from a POST?',
            'How does `redirect(url_for(...))` change the last request method?',
          ],
          points: 10,
        },
        {
          id: 'day26-ex22',
          title: 'Trace the PRG HTTP Status Sequence',
          type: 'explain-the-trace',
          tier: 'challenge',
          prompt: 'Trace the 3 HTTP round-trips in a Post/Redirect/Get submission for `/contact` -> `/thanks`.',
          contextScenario: 'Auditing network logs for a contact-us form.',
          traceStepCode: `1. Client -> GET /contact       <- 200 OK (HTML Form)
2. Client -> POST /contact      <- 302 Found (Location: /thanks)
3. Client -> GET /thanks        <- 200 OK (Confirmation HTML)`,
          traceQuestion: 'Why is Step 2 returning `302 Found` instead of `200 OK` essential for safe browser refreshes?',
          modelAnswer: 'Because `302 Found` instructs the browser to immediately issue a `GET /thanks` in Step 3. Once Step 3 completes, `GET /thanks` is the most recent request in browser history, so pressing Refresh only repeats the safe `GET /thanks` and never re-submits Step 2’s `POST`.',
          markingCriteria: [
            { id: 'mc1', label: 'Identifies 302 triggers automatic GET /thanks', points: 5 },
            { id: 'mc2', label: 'Explains refresh repeats GET /thanks rather than POST /contact', points: 5 },
          ],
          hints: [
            'Look at what the final request in browser history is after Step 3.',
            'Refreshing repeats the final request.',
          ],
          points: 15,
        },
        {
          id: 'day26-ex23',
          title: 'Fix Missing Server-Side Validation Before Redirect',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'Fix `submit_feedback(form)` so empty `"message"` values return `(400, "Message required")` instead of appending empty strings and returning `302`.',
          contextScenario: 'Validating user feedback forms on the server.',
          starterCode: `saved = []

def submit_feedback(form):
    msg = form.get("message", "").strip()
    saved.append(msg)  # BUG: saves empty message and redirects!
    return (302, "/thanks")

print(submit_feedback({"message": "   "}))`,
          solutionCode: `saved = []

def submit_feedback(form):
    msg = form.get("message", "").strip()
    if not msg:
        return (400, "Message required")
    saved.append(msg)
    return (302, "/thanks")

print(submit_feedback({"message": "   "}))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Rejects blank message with 400',
              setup: 'saved.clear()\nprint(submit_feedback({"message": "   "}), len(saved))',
              expected: "(400, 'Message required') 0",
              hidden: false,
            },
          ],
          hints: [
            'Check `if not msg:` right after `.strip()`.',
            'Return `(400, "Message required")` before appending to `saved`.',
          ],
          points: 15,
        },
        {
          id: 'day26-ex24',
          title: 'Implement PRG Form Handler with DB State',
          type: 'write-code',
          tier: 'challenge',
          prompt: 'Write `handle_prg_post(db, form)` that validates `email` (must contain `"@"`) and `name` (non-empty after strip), returning `(400, "Invalid")` if invalid, or appending `{"name": name, "email": email}` to `db` and returning `(302, "/thanks")`.',
          contextScenario: 'Implementing a clean newsletter signup endpoint.',
          starterCode: `def handle_prg_post(db, form):
    # Validate name and email; append to db and return (302, "/thanks") or (400, "Invalid")
    pass

store = []
print(handle_prg_post(store, {"name": "Ada", "email": "ada@py.org"}))
print(len(store))`,
          solutionCode: `def handle_prg_post(db, form):
    name = form.get("name", "").strip()
    email = form.get("email", "").strip()
    if not name or "@" not in email:
        return (400, "Invalid")
    db.append({"name": name, "email": email})
    return (302, "/thanks")

store = []
print(handle_prg_post(store, {"name": "Ada", "email": "ada@py.org"}))
print(len(store))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Validates and redirects 302',
              setup: 's = []\nprint(handle_prg_post(s, {"name": "Ada", "email": "ada@py.org"}), handle_prg_post(s, {"name": "", "email": "x"}), len(s))',
              expected: "(302, '/thanks') (400, 'Invalid') 1",
              hidden: false,
            },
          ],
          hints: [
            'Strip both `name` and `email` first.',
            'Return `(400, "Invalid")` if `not name or "@" not in email`.',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day26-sub7',
      number: 7,
      title: 'Static Assets, JSON APIs (jsonify) & Custom Error Handlers',
      summary: 'Serve CSS/JS from static/, return structured JSON with status codes, and handle 404/500 cleanly.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'JSON Endpoints & Predictable Error Responses',
        paragraphs: [
          'Flask serves CSS, JavaScript, and images from the `static/` directory automatically, referenced via `url_for("static", filename="style.css")`.',
          'For REST APIs, return **`jsonify({"error": "Not found"})`** with an explicit HTTP status code tuple `(jsonify(...), 404)`. Register **`@app.errorhandler(404)`** so clients receive consistent JSON or HTML error pages instead of raw stack traces.',
        ],
        keyTerms: [
          {
            term: 'jsonify()',
            definition: 'Serializes Python dicts/lists to JSON with `Content-Type: application/json`.',
          },
          {
            term: '@app.errorhandler(code)',
            definition: 'Registers a custom handler for HTTP error codes like 404 or 500.',
          },
        ],
        bulletPoints: [
          'Return `(jsonify(payload), 201)` for resource creation.',
          'Never expose `debug=True` stack traces in production; they leak environment secrets.',
        ],
      },
      visualise: {
        type: 'flask-routing-sim',
        title: 'JSON API Responses & 404 Error Handler',
        badge: 'simulation',
        description: 'Select `GET /admin/secret` to inspect the 404 error handler response.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Structured JSON Response & Status Tuple Builder',
          runMode: 'real',
          code: `import json

def json_response(payload, status=200):
    return {
        "status": status,
        "content_type": "application/json",
        "body": json.dumps(payload),
    }

print(json_response({"ok": True, "id": 7}, 201))
print(json_response({"error": "Not Found"}, 404))`,
          expectedOutput: `{'status': 201, 'content_type': 'application/json', 'body': '{"ok": true, "id": 7}'}
{'status': 404, 'content_type': 'application/json', 'body': '{"error": "Not Found"}'}`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'json.dumps(payload)',
          internalEffect: 'Serializes the Python dictionary into a valid JSON string.',
        },
      ],
      apply: {
        domain: 'REST Microservice',
        contextTitle: 'Returning 404 JSON on Missing Resource',
        scenario: 'Look up a product by ID and return 404 JSON if absent.',
        code: `import json
catalog = {1: "Keyboard"}
item = catalog.get(99)
resp = (json.dumps({"item": item}), 200) if item else (json.dumps({"error": "Missing"}), 404)
print(resp)`,
        outcome: '(\'{"error": "Missing"}\', 404)',
      },
      commonMistakes: [
        {
          label: 'Leaving debug=True Enabled in Production',
          erroneousCode: `# app.run(host="0.0.0.0", debug=True)  # Exposes Werkzeug interactive debugger!`,
          errorMessage: 'Critical Security Risk: Remote Code Execution via Werkzeug Debugger',
          explanation: 'Never run `debug=True` on a public server; control debug mode via environment variables and use Gunicorn.',
          correctedCode: `# gunicorn -w 4 "app:create_app()"`,
        },
      ],
      sourceNotes: 'Covers static files, jsonify, and error handlers for Day 26.',
      practise: [
        {
          id: 'day26-ex25',
          title: 'Predict JSON API Response Tuple Status',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'In Flask, a view returns `return jsonify({"id": 99}), 201`. What HTTP status code and `Content-Type` header does the client receive?',
          contextScenario: 'Verifying a REST resource-creation endpoint.',
          options: [
            {
              id: 'a',
              text: 'Status 201 Created and Content-Type: application/json.',
              explanation: 'Correct! Returning `(jsonify(...), 201)` sets both the JSON Content-Type header and status 201.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'Status 200 OK and Content-Type: text/html.',
              explanation: 'Incorrect. `jsonify()` sets `application/json`, and the second tuple element overrides status to `201`.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'Status 201 Created and Content-Type: text/plain.',
              explanation: 'Incorrect. `jsonify()` always sets `application/json`.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Flask raises TypeError because views cannot return tuples.',
              explanation: 'Incorrect. Flask views natively accept `(body, status)` and `(body, status, headers)` tuples.',
              isCorrect: false,
            },
          ],
          hints: [
            'What does `jsonify()` set the `Content-Type` header to?',
            'What does the second element of `(response, 201)` control?',
          ],
          points: 10,
        },
        {
          id: 'day26-ex26',
          title: 'Fix 404 Error Handler Returning 200 Status',
          type: 'fix-the-bug',
          tier: 'challenge',
          prompt: 'Fix `not_found_handler(path)` so it returns status `404` alongside the JSON error payload instead of defaulting to `200`.',
          contextScenario: 'Ensuring monitoring tools detect missing API endpoints properly.',
          starterCode: `import json

def not_found_handler(path):
    body = json.dumps({"error": f"Path {path} not found"})
    return (body, 200)  # BUG: returns 200 OK on a 404!

print(not_found_handler("/bad"))`,
          solutionCode: `import json

def not_found_handler(path):
    body = json.dumps({"error": f"Path {path} not found"})
    return (body, 404)

print(not_found_handler("/bad"))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Returns 404 status code',
              setup: 'print(not_found_handler("/bad"))',
              expected: '(\'{"error": "Path /bad not found"}\', 404)',
              hidden: false,
            },
          ],
          hints: [
            'Change the status code in the returned tuple from `200` to `404`.',
          ],
          points: 15,
        },
        {
          id: 'day26-ex27',
          title: 'REST Resource Lookup Returning 200 or 404 JSON',
          type: 'write-code',
          tier: 'project',
          prompt: 'Write `get_resource_json(store, item_id)` returning `(json.dumps(store[item_id]), 200)` if `item_id in store`, else `(json.dumps({"error": "Not Found"}), 404)`.',
          contextScenario: 'Implementing a clean JSON GET endpoint with 404 handling.',
          starterCode: `import json

def get_resource_json(store, item_id):
    # Return (json_str, 200) if found else (json_str, 404)
    pass

db = {1: {"name": "Sensor-A"}}
print(get_resource_json(db, 1))
print(get_resource_json(db, 9))`,
          solutionCode: `import json

def get_resource_json(store, item_id):
    if item_id in store:
        return (json.dumps(store[item_id]), 200)
    return (json.dumps({"error": "Not Found"}), 404)

db = {1: {"name": "Sensor-A"}}
print(get_resource_json(db, 1))
print(get_resource_json(db, 9))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Returns 200 on hit and 404 on miss',
              setup: 'db = {1: {"name": "Sensor-A"}}\nprint(get_resource_json(db, 1), get_resource_json(db, 9))',
              expected: '(\'{"name": "Sensor-A"}\', 200) (\'{"error": "Not Found"}\', 404)',
              hidden: false,
            },
          ],
          hints: [
            'Check `if item_id in store:` first.',
            'Serialize with `json.dumps(...)` and return the `(body, status)` tuple.',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day26-sub8',
      number: 8,
      title: 'Project Structure, Blueprints & Production WSGI Deployment',
      summary: 'Scale Flask apps with Application Factories, Blueprints, and multi-worker Gunicorn deployment.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'From Single-File Script to Production Service',
        paragraphs: [
          'As a Flask app grows beyond a few routes, putting everything in `app.py` causes circular imports. **Blueprints** (`Blueprint("auth", __name__, url_prefix="/auth")`) group related routes, templates, and static files into modular components.',
          'Pairing Blueprints with an **Application Factory** (`def create_app(): ...`) makes testing and configuration clean. In production, deploy behind **Gunicorn** (`gunicorn -w 4 "myapp:create_app()"`) rather than Flask’s single-process dev server.',
        ],
        keyTerms: [
          {
            term: 'Blueprint',
            definition: 'Modular collection of Flask routes and handlers registered onto the main app.',
          },
          {
            term: 'Application Factory',
            definition: 'A `create_app(config)` function that constructs and configures a Flask instance cleanly.',
          },
        ],
        bulletPoints: [
          'Use `url_prefix="/api/v1"` when registering API Blueprints.',
          'Read `SECRET_KEY` from `os.environ`, never hardcode it in source control.',
        ],
      },
      visualise: {
        type: 'http-form-redirect-sim',
        title: 'Production Request Lifecycle Overview',
        badge: 'simulation',
        description: 'Review end-to-end stateful POST -> 302 -> GET lifecycle in a production-ready app.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Modeling Blueprint Route Prefix Registration',
          runMode: 'real',
          code: `def register_blueprint(url_map, prefix, routes):
    for sub_path, handler in routes.items():
        url_map[f"{prefix}{sub_path}"] = handler

app_urls = {}
register_blueprint(app_urls, "/auth", {"/login": "auth.login", "/logout": "auth.logout"})
register_blueprint(app_urls, "/api", {"/orders": "api.orders"})
print(app_urls)`,
          expectedOutput: "{'/auth/login': 'auth.login', '/auth/logout': 'auth.logout', '/api/orders': 'api.orders'}",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'url_map[f"{prefix}{sub_path}"] = handler',
          internalEffect: 'Namespaces blueprint routes under a shared `url_prefix`.',
        },
      ],
      apply: {
        domain: 'Production Deployment',
        contextTitle: 'Validating Required Production Config Keys',
        scenario: 'Ensure `SECRET_KEY` is present before booting the app factory.',
        code: `def create_app(env):
    if not env.get("SECRET_KEY"):
        raise RuntimeError("SECRET_KEY must be set")
    return {"status": "ready", "debug": False}

print(create_app({"SECRET_KEY": "prod-secret-xyz"}))`,
        outcome: "{'status': 'ready', 'debug': False}",
      },
      commonMistakes: [
        {
          label: 'Hardcoding SECRET_KEY in Git',
          erroneousCode: `# app.config["SECRET_KEY"] = "dev-1234"  # Compromises session cookies!`,
          errorMessage: 'Session Forgery Risk if SECRET_KEY is leaked',
          explanation: 'Load `SECRET_KEY` from `os.environ.get("SECRET_KEY")` in production.',
          correctedCode: `# app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]`,
        },
      ],
      sourceNotes: 'Covers Blueprints, App Factory, and Gunicorn deployment for Day 26.',
      practise: [
        {
          id: 'day26-ex28',
          title: 'Blueprint url_prefix Namespace Resolution',
          type: 'scenario-mcq',
          tier: 'standard',
          prompt: 'An API Blueprint is created with `Blueprint("billing", __name__, url_prefix="/api/v1")` and defines `@bp.get("/invoices")`. What full URL path is registered on the Flask app?',
          contextScenario: 'Versioning a multi-team Flask REST API with Blueprints.',
          options: [
            {
              id: 'a',
              text: '/api/v1/invoices',
              explanation: 'Correct! Flask prepends the Blueprint’s `url_prefix` (`/api/v1`) to each route (`/invoices`).',
              isCorrect: true,
            },
            {
              id: 'b',
              text: '/invoices',
              explanation: 'Incorrect. Without `url_prefix`, it would be `/invoices`, but `url_prefix="/api/v1"` prefixes it.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '/billing/api/v1/invoices',
              explanation: 'Incorrect. The Blueprint name `"billing"` is used for `url_for("billing.invoices")`, not added to the URL path.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: '/api/v1/billing/invoices',
              explanation: 'Incorrect. Only `url_prefix` is prepended to the route path.',
              isCorrect: false,
            },
          ],
          hints: [
            'Combine `url_prefix` + route path.',
            'Does the Blueprint name `"billing"` appear in the URL unless put in `url_prefix`?',
          ],
          points: 15,
        },
        {
          id: 'day26-ex29',
          title: 'Blueprint Registration with Prefix Collision Guard',
          type: 'write-code',
          tier: 'project',
          prompt: 'Write `register_bp(app_routes, prefix, bp_routes)` that registers `prefix + path -> handler` into `app_routes`, raising `ValueError` if any full path is already registered.',
          contextScenario: 'Preventing accidental route collisions when mounting team Blueprints.',
          starterCode: `def register_bp(app_routes, prefix, bp_routes):
    # Register prefix + path -> handler; raise ValueError on duplicate full path
    pass

routes = {}
register_bp(routes, "/v1", {"/users": "v1_users"})
print(routes)`,
          solutionCode: `def register_bp(app_routes, prefix, bp_routes):
    for sub, handler in bp_routes.items():
        full = f"{prefix}{sub}"
        if full in app_routes:
            raise ValueError(f"Duplicate route: {full}")
        app_routes[full] = handler

routes = {}
register_bp(routes, "/v1", {"/users": "v1_users"})
print(routes)`,
          testCases: [
            {
              id: 'tc1',
              label: 'Registers prefixed routes and guards duplicates',
              setup: 'r = {}\nregister_bp(r, "/v1", {"/users": "u"})\nprint(r)',
              expected: "{'/v1/users': 'u'}",
              hidden: false,
            },
          ],
          hints: [
            'Build `full = f"{prefix}{sub}"`.',
            'Check `if full in app_routes: raise ValueError(...)`.',
          ],
          points: 20,
        },
        {
          id: 'day26-ex30',
          title: 'Application Factory Environment Config Validator',
          type: 'write-code',
          tier: 'project',
          prompt: 'Write `build_app_config(env)` that reads `"SECRET_KEY"` (raising `RuntimeError` if missing/empty) and `"FLASK_ENV"` (default `"production"`), returning `{"SECRET_KEY": key, "DEBUG": env_name == "development"}`.',
          contextScenario: 'Ensuring production deployments never boot with `DEBUG=True` or empty secrets.',
          starterCode: `def build_app_config(env):
    # Validate SECRET_KEY and compute DEBUG from FLASK_ENV == "development"
    pass

print(build_app_config({"SECRET_KEY": "abc", "FLASK_ENV": "production"}))`,
          solutionCode: `def build_app_config(env):
    key = env.get("SECRET_KEY", "").strip()
    if not key:
        raise RuntimeError("Missing SECRET_KEY")
    mode = env.get("FLASK_ENV", "production")
    return {"SECRET_KEY": key, "DEBUG": mode == "development"}

print(build_app_config({"SECRET_KEY": "abc", "FLASK_ENV": "production"}))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Builds safe production config',
              setup: 'print(build_app_config({"SECRET_KEY": "abc"}))',
              expected: "{'SECRET_KEY': 'abc', 'DEBUG': False}",
              hidden: false,
            },
          ],
          hints: [
            'Check `if not key: raise RuntimeError(...)`.',
            'Set `"DEBUG": mode == "development"`.',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
  ],
  realWorldLabs: [
    {
      id: 'day26-lab1',
      title: 'RESTful Ticket Router & Method/Status Dispatcher',
      description: 'Build a Blueprint-prefixed route table supporting dynamic integer IDs (/api/tickets/<int:id>), method validation (405 vs 404), and JSON response serialization.',
      domain: 'Customer Support Platform',
      starterCode: `import json, re

# 1. Register routes under prefix "/api": GET /tickets, POST /tickets, GET /tickets/<int:id>
# 2. Dispatch ("POST", "/api/tickets") -> 201 JSON
# 3. Dispatch ("DELETE", "/api/tickets") -> 405 JSON
# 4. Dispatch ("GET", "/api/tickets/42") -> 200 JSON with id=42
# 5. Dispatch ("GET", "/api/tickets/abc") -> 404 JSON
`,
      targetOutput: `201 {"status": "created"}
405 {"error": "Method Not Allowed"}
200 {"ticket_id": 42}
404 {"error": "Not Found"}`,
    },
    {
      id: 'day26-lab2',
      title: 'XSS-Safe Jinja2 Renderer & PRG Form Submission Pipeline',
      description: 'Validate patient intake form fields on POST, neutralize XSS payloads via html.escape(), store valid submissions, and emit a 302 PRG redirect so refresh does not duplicate records.',
      domain: 'Healthcare Patient Intake',
      starterCode: `import html

records = []

# 1. Handle POST with {"patient": "<script>alert(1)</script>", "email": "ada@clinic.org"}
# 2. Escape patient name safely, save to records, return 302 -> /intake/thanks
# 3. Render GET /intake/thanks showing escaped patient name and DB count = 1
`,
      targetOutput: `POST -> 302 /intake/thanks
GET /intake/thanks -> <p>Saved: &lt;script&gt;alert(1)&lt;/script&gt;</p> (count=1)`,
    },
  ],
  miniProject: {
    id: 'day26-project',
    title: 'Modular Flask Micro-Framework Simulator (Blueprints, Dynamic Routes, Escaped Templates & PRG)',
    brief: 'Build an end-to-end Flask-style web engine in Python supporting Blueprint prefix registration, dynamic `<int:id>` routing, method enforcement (200/201/404/405), XSS-escaped HTML rendering, and Post/Redirect/Get form handling.',
    requirements: [
      'Register Blueprint routes under a shared url_prefix with duplicate-route detection',
      'Match static routes and dynamic <int:id> routes while returning 404 for non-numeric IDs',
      'Enforce allowed HTTP methods per route, returning 405 Method Not Allowed when path matches but method does not',
      'Render HTML templates with html.escape() auto-escaping to neutralize <script> XSS payloads',
      'Implement server-side form validation returning 400 on invalid input and 302 redirect on valid POST (PRG)',
      'Provide a reverse url_for(endpoint, **params) helper for generating links from endpoint names',
    ],
    rubric: [
      { criterion: 'Blueprint prefix registration & dynamic <int:id> routing', weight: 25 },
      { criterion: 'Accurate 200 / 201 / 400 / 404 / 405 HTTP status dispatch', weight: 25 },
      { criterion: 'XSS-safe HTML rendering & url_for() reverse resolution', weight: 25 },
      { criterion: 'Server-validated PRG form workflow preventing duplicates', weight: 25 },
    ],
    starterCode: `import html, json, re

# Build FlaskMiniApp with:
# - register_blueprint(prefix, routes)
# - dispatch(method, path, form=None)
# - render_safe(template_str, **context)
# - url_for(endpoint, **params)
`,
  },
  dayQuiz: {
    title: 'Day 26 Checkpoint Quiz',
    questions: [
      {
        id: 'day26-q1',
        scenario: 'You are deploying a Flask app to handle 50 concurrent users in production.',
        question: 'Why should you run it behind `gunicorn` instead of `app.run()`?',
        options: [
          {
            id: 'a',
            text: 'Gunicorn manages multiple WSGI worker processes for concurrency and production hardening, while app.run() is for local development only.',
            explanation: 'Correct! Flask’s built-in Werkzeug server is single-process/dev-only; Gunicorn provides multi-worker WSGI process management.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'app.run() cannot serve HTML templates.',
            explanation: 'Incorrect. `app.run()` serves templates fine in local development.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Gunicorn automatically writes SQL queries for you.',
            explanation: 'Incorrect. Gunicorn is a WSGI HTTP server, not an ORM.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'app.run() only accepts localhost connections and cannot bind to 0.0.0.0.',
            explanation: 'Incorrect. `app.run(host="0.0.0.0")` can bind externally, though it is still unsafe for production.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day26-q2',
        scenario: 'A route is defined as `@app.route("/products/<int:product_id>")`.',
        question: 'What happens when a browser requests `/products/laptop`?',
        options: [
          {
            id: 'a',
            text: 'Flask returns 404 Not Found without invoking the view function.',
            explanation: 'Correct! The `<int:...>` converter rejects `"laptop"` during URL matching and returns 404.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Flask passes product_id="laptop" as a string.',
            explanation: 'Incorrect. That only happens without the `int:` converter.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Flask returns 405 Method Not Allowed.',
            explanation: 'Incorrect. 405 is for disallowed HTTP methods, not unmatched path types.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Flask casts "laptop" to 0.',
            explanation: 'Incorrect. Converters never silently substitute 0.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day26-q3',
        scenario: 'A route is decorated with `@app.post("/api/orders")`, and a client sends `GET /api/orders`.',
        question: 'Which HTTP status code does Flask return?',
        options: [
          {
            id: 'a',
            text: '405 Method Not Allowed',
            explanation: 'Correct! The path `/api/orders` exists in `url_map`, but `GET` is not in its allowed methods.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: '404 Not Found',
            explanation: 'Incorrect. 404 is returned only when no rule matches the URL path.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: '200 OK',
            explanation: 'Incorrect. `@app.post` restricts the route to POST only.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: '302 Found',
            explanation: 'Incorrect. Method mismatches do not trigger redirects.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day26-q4',
        scenario: 'A client sends `POST /search?sort=desc` with an HTML form field `query=flask` in the request body.',
        question: 'Where does Flask expose `sort` and `query`?',
        options: [
          {
            id: 'a',
            text: 'sort in request.args and query in request.form.',
            explanation: 'Correct! URL query strings (`?sort=desc`) live in `request.args`, while form-encoded POST bodies live in `request.form`.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Both in request.args.',
            explanation: 'Incorrect. POST form body fields are not placed in `request.args`.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Both in request.form.',
            explanation: 'Incorrect. URL query parameters are not placed in `request.form`.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Both in request.get_json().',
            explanation: 'Incorrect. `get_json()` is for `application/json` bodies.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day26-q5',
        scenario: 'A user submits `<script>stealCookies()</script>` as their bio, and the template renders `{{ bio }}` in `profile.html`.',
        question: 'What happens in the browser?',
        options: [
          {
            id: 'a',
            text: 'The script tag is auto-escaped to &lt;script&gt;... and displayed safely as plain text.',
            explanation: 'Correct! Jinja2 auto-escapes `.html` templates by default, preventing XSS execution.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'The script executes because Jinja2 requires |escape explicitly.',
            explanation: 'Incorrect. Flask enables Jinja2 auto-escaping for `.html` templates by default.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Flask raises a TemplateSyntaxError.',
            explanation: 'Incorrect. User data containing `<script>` is valid string data and is simply escaped.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'The bio is silently deleted.',
            explanation: 'Incorrect. Escaping preserves the text visually without executing it as HTML/JS.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day26-q6',
        scenario: 'You want `about.html` to reuse the navbar and footer defined in `base.html`.',
        question: 'Which Jinja2 tags must appear in `about.html`?',
        options: [
          {
            id: 'a',
            text: '{% extends "base.html" %} at the top, and {% block content %}...{% endblock %}.',
            explanation: 'Correct! `{% extends %}` inherits the parent layout and `{% block %}` overrides the named section.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: '{{ extends("base.html") }} and {{ block("content") }}.',
            explanation: 'Incorrect. Control/inheritance tags use `{% ... %}`, not `{{ ... }}`.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: '{% import "base.html" %}',
            explanation: 'Incorrect. `import` is for Jinja2 macros, not layout inheritance.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: '@app.extends("base.html") in Python.',
            explanation: 'Incorrect. Template inheritance is declared inside the `.html` template.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day26-q7',
        scenario: 'You have a view function `def order_detail(order_id): ...` mapped to `/orders/<int:order_id>`.',
        question: 'How should you generate its link inside a Jinja2 template?',
        options: [
          {
            id: 'a',
            text: '{{ url_for("order_detail", order_id=15) }}',
            explanation: 'Correct! `url_for()` takes the endpoint (function name) and keyword arguments for its dynamic segments.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: '{{ url_for("/orders/15") }}',
            explanation: 'Incorrect. Passing a URL path instead of the endpoint name raises `BuildError`.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: '{{ route("order_detail", 15) }}',
            explanation: 'Incorrect. `route` is not a Jinja2 template helper.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: '{{ redirect("order_detail", order_id=15) }}',
            explanation: 'Incorrect. `redirect()` is for HTTP 302 responses in Python views, not HTML href links.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day26-q8',
        scenario: 'Users report that refreshing the confirmation page after submitting a form creates duplicate database entries.',
        question: 'Which pattern fixes this?',
        options: [
          {
            id: 'a',
            text: 'Post/Redirect/Get (PRG): return redirect(url_for("confirm")) with 302 after saving the POST.',
            explanation: 'Correct! Redirecting to a GET route ensures browser refresh only repeats the safe GET.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Return render_template("confirm.html"), 201 from the POST handler.',
            explanation: 'Incorrect. Returning HTML directly on POST leaves POST as the last request in browser history.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Change the HTML form method from POST to GET.',
            explanation: 'Incorrect. State-changing mutations should never use GET, which is unsafe for bookmarks/crawlers and leaks data in URLs.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Add |safe to the form inputs.',
            explanation: 'Incorrect. `|safe` disables XSS escaping and has nothing to do with duplicate submissions.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day26-q9',
        scenario: 'An API endpoint creates a new record and needs to return JSON with HTTP status 201.',
        question: 'Which return statement in a Flask view is idiomatic?',
        options: [
          {
            id: 'a',
            text: 'return jsonify({"id": new_id}), 201',
            explanation: 'Correct! Returning `(jsonify(data), 201)` sets `Content-Type: application/json` and HTTP status `201 Created`.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'return {"id": new_id, "status": 201}',
            explanation: 'Incorrect. That puts `"status": 201` in the JSON body while the HTTP status code remains `200 OK`.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'return 201, jsonify({"id": new_id})',
            explanation: 'Incorrect. Flask expects `(body, status)`, not `(status, body)`.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'return render_template("201.json")',
            explanation: 'Incorrect. `render_template` defaults to `text/html`, not `application/json`.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day26-q10',
        scenario: 'A Flask codebase is growing across authentication, billing, and admin modules.',
        question: 'How do Flask Blueprints help structure the project cleanly?',
        options: [
          {
            id: 'a',
            text: 'Blueprints group related routes, templates, and url_prefixes into modular files registered onto the app in a factory.',
            explanation: 'Correct! Blueprints prevent circular imports and organize large Flask apps by feature domain.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Blueprints replace WSGI with GraphQL automatically.',
            explanation: 'Incorrect. Blueprints are a Flask routing/organization mechanism.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Blueprints disable Jinja2 auto-escaping globally.',
            explanation: 'Incorrect. Blueprints preserve Jinja2 auto-escaping.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Blueprints require running separate Gunicorn processes per route.',
            explanation: 'Incorrect. All Blueprints are registered onto the same Flask application instance.',
            isCorrect: false,
          },
        ],
      },
    ],
    passingScorePercentage: 80,
  },
  cheatSheet: [
    {
      category: 'HTTP Lifecycle & WSGI Contract',
      syntax: 'def app(environ, start_response): ... return [b"OK"]',
      description: 'WSGI (PEP 3333) standardizes how web servers (Gunicorn) pass HTTP request metadata (environ) to Python web frameworks.',
      example: `def wsgi_app(environ, start_response):
    start_response("200 OK", [("Content-Type", "text/plain")])
    return [b"Healthy"]`,
    },
    {
      category: 'Flask App & @app.route() Basics',
      syntax: 'app = Flask(__name__); @app.route("/")',
      description: 'Creates the Flask application instance and binds URL paths (always starting with /) to Python view functions.',
      example: `from flask import Flask
app = Flask(__name__)

@app.route("/")
def home():
    return "Hello, Flask!"`,
    },
    {
      category: 'Dynamic URL Path Converters (<int:id>)',
      syntax: '@app.route("/users/<int:user_id>")',
      description: 'Extracts and type-converts URL segments (int, float, string, uuid, path). Invalid types return 404 before calling the view.',
      example: `@app.route("/orders/<int:order_id>")
def get_order(order_id):
    return {"order_id": order_id}`,
    },
    {
      category: 'HTTP Methods & Status Codes (200, 201, 404, 405)',
      syntax: '@app.route("/items", methods=["GET", "POST"])',
      description: 'Restrict routes to specific HTTP verbs; matching path with disallowed verb returns 405 Method Not Allowed, missing path returns 404.',
      example: `@app.post("/api/items")
def create_item():
    return {"created": True}, 201`,
    },
    {
      category: 'Inspecting request (args, form, get_json)',
      syntax: 'request.args.get("q")  |  request.form.get("email")  |  request.get_json()',
      description: 'Reads URL query params via args, POST HTML form fields via form, and JSON API bodies via get_json().',
      example: `page = request.args.get("page", default=1, type=int)
payload = request.get_json(silent=True) or {}`,
    },
    {
      category: 'Jinja2 Expressions & XSS Auto-Escaping',
      syntax: 'render_template("page.html", user=name)  |  {{ user }}',
      description: 'Jinja2 auto-escapes <, >, &, " in .html templates to block XSS. Never pass untrusted user input through |safe.',
      example: `<!-- templates/profile.html -->
<h2>Welcome, {{ user_name }}</h2>
{% for tag in tags %}<li>{{ tag }}</li>{% endfor %}`,
    },
    {
      category: 'Template Inheritance & Reverse url_for()',
      syntax: '{% extends "base.html" %}  |  {{ url_for("get_order", order_id=7) }}',
      description: 'Share layouts with {% extends %} and {% block %}; generate resilient links from Python endpoint names using url_for().',
      example: `{% extends "base.html" %}
{% block content %}
  <a href="{{ url_for('get_order', order_id=7) }}">Order #7</a>
{% endblock %}`,
    },
    {
      category: 'HTML Forms & Post/Redirect/Get (PRG)',
      syntax: 'return redirect(url_for("thanks"))',
      description: 'Validate request.form server-side, save state, and return a 302 redirect to a GET route so browser refresh never duplicates writes.',
      example: `@app.post("/contact")
def submit_contact():
    save_message(request.form["email"])
    return redirect(url_for("thanks"))`,
    },
    {
      category: 'JSON APIs (jsonify) & Custom Error Handlers',
      syntax: 'return jsonify({"error": "Not Found"}), 404',
      description: 'Serialize dicts to application/json with explicit status codes and register @app.errorhandler(404) for consistent error payloads.',
      example: `@app.errorhandler(404)
def handle_404(err):
    return jsonify({"error": "Resource not found"}), 404`,
    },
    {
      category: 'Blueprints, App Factory & Gunicorn Deployment',
      syntax: 'bp = Blueprint("api", __name__, url_prefix="/api/v1")',
      description: 'Modularize routes with Blueprints and create_app(), load SECRET_KEY from os.environ, and serve via gunicorn in production.',
      example: `def create_app():
    app = Flask(__name__)
    app.register_blueprint(api_bp)
    return app
# CLI: gunicorn -w 4 "myapp:create_app()"`,
    },
  ],
  sourceNotes: [
    'Curriculum reference: https://github.com/Asabeneh/30-Days-Of-Python/tree/master/26_Day_Python_web',
  ],
};
