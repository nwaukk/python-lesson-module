import React, { useState } from 'react';
import { Globe, ArrowRight, CheckCircle2, AlertTriangle, Server } from 'lucide-react';

interface RouteScenario {
  id: string;
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
  query: string;
  matchedRule: string;
  handler: string;
  statusCode: number;
  statusText: string;
  responseBody: string;
  note: string;
}

const SCENARIOS: RouteScenario[] = [
  {
    id: 'home',
    method: 'GET',
    path: '/',
    query: '',
    matchedRule: "@app.route('/', methods=['GET'])",
    handler: 'def home(): return render_template("index.html")',
    statusCode: 200,
    statusText: '200 OK',
    responseBody: '<h1>Welcome to Python Visual Lab</h1>',
    note: 'Exact root path match. WSGI passes environ["REQUEST_METHOD"]="GET" and PATH_INFO="/" to Flask.',
  },
  {
    id: 'user-id',
    method: 'GET',
    path: '/users/42',
    query: '',
    matchedRule: "@app.route('/users/<int:user_id>', methods=['GET'])",
    handler: 'def get_user(user_id): return jsonify({"id": user_id, "role": "analyst"})',
    statusCode: 200,
    statusText: '200 OK',
    responseBody: '{"id": 42, "role": "analyst"}',
    note: 'Converter `<int:user_id>` parses "42" into Python int 42 before calling `get_user(42)`.',
  },
  {
    id: 'create-order',
    method: 'POST',
    path: '/api/orders',
    query: '',
    matchedRule: "@app.route('/api/orders', methods=['POST'])",
    handler: 'def create_order(): data = request.get_json(); return jsonify(data), 201',
    statusCode: 201,
    statusText: '201 Created',
    responseBody: '{"order_id": 109, "status": "created"}',
    note: 'POST carries a JSON payload in the request body; returning `(body, 201)` sets HTTP 201 Created.',
  },
  {
    id: 'method-mismatch',
    method: 'DELETE',
    path: '/api/orders',
    query: '',
    matchedRule: "@app.route('/api/orders', methods=['POST'])",
    handler: 'No handler accepts DELETE on /api/orders',
    statusCode: 405,
    statusText: '405 Method Not Allowed',
    responseBody: '{"error": "Method Not Allowed", "allowed": ["POST"]}',
    note: 'The URL path exists, so Flask returns 405 (not 404) with an Allow header.',
  },
  {
    id: 'not-found',
    method: 'GET',
    path: '/admin/secret',
    query: '?debug=true',
    matchedRule: 'No matching rule in app.url_map',
    handler: '@app.errorhandler(404) -> page_not_found(err)',
    statusCode: 404,
    statusText: '404 Not Found',
    responseBody: '{"error": "Route /admin/secret not found"}',
    note: 'No URL rule matches `/admin/secret`; Flask invokes the registered 404 error handler.',
  },
];

export const FlaskRoutingSim: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('home');
  const active = SCENARIOS.find((s) => s.id === selectedId) || SCENARIOS[0];
  const isSuccess = active.statusCode >= 200 && active.statusCode < 300;

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-panel)] p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-sky-400" />
          <h4 className="text-sm font-bold text-[var(--text-main)]">
            WSGI &amp; Flask URL Routing Dispatcher
          </h4>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Select HTTP request scenario">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => setSelectedId(sc.id)}
              aria-pressed={selectedId === sc.id}
              className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                selectedId === sc.id
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
              }`}
            >
              {sc.method} {sc.path}
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline visualization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
            1. Incoming HTTP &amp; WSGI environ
          </div>
          <div className="font-mono text-xs text-[var(--text-main)]">
            <div>REQUEST_METHOD: <span className="text-amber-300">{active.method}</span></div>
            <div>PATH_INFO: <span className="text-emerald-300">{active.path}</span></div>
            <div>QUERY_STRING: <span className="text-[var(--text-muted)]">{active.query || '(empty)'}</span></div>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-400">
            <Server className="w-3.5 h-3.5" />
            <span>2. Flask url_map &amp; View</span>
          </div>
          <div className="font-mono text-xs text-[var(--text-main)] break-all">
            {active.matchedRule}
          </div>
          <div className="font-mono text-[11px] text-[var(--text-muted)] break-all pt-1 border-t border-[var(--border-subtle)]">
            {active.handler}
          </div>
        </div>

        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              3. HTTP Response
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-bold ${
                isSuccess
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {isSuccess ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              {active.statusText}
            </span>
          </div>
          <pre className="font-mono text-xs text-[var(--text-main)] whitespace-pre-wrap break-all bg-[var(--bg-app)] p-2 rounded-md border border-[var(--border-subtle)]">
            {active.responseBody}
          </pre>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] px-3 py-2 text-xs text-[var(--text-muted)]">
        <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
        <span>{active.note}</span>
      </div>
    </div>
  );
};
