import React, { useState } from 'react';
import { Shield, Lock, Unlock, RefreshCw } from 'lucide-react';

type AuthMode = 'none' | 'api-key' | 'bearer' | 'cors-preflight' | 'rate-limit';

interface AuthScenario {
  title: string;
  headers: string[];
  statusCode: string;
  allowed: boolean;
  responseHeaders: string[];
  summary: string;
}

const AUTH_SCENARIOS: Record<AuthMode, AuthScenario> = {
  none: {
    title: 'Unauthenticated Request',
    headers: ['GET /api/v1/orders HTTP/1.1', 'Host: api.example.com'],
    statusCode: '401 Unauthorized',
    allowed: false,
    responseHeaders: ['WWW-Authenticate: Bearer realm="orders"'],
    summary: 'Missing credentials trigger 401 Unauthorized—distinct from 403 Forbidden (authenticated, but lacking permission).',
  },
  'api-key': {
    title: 'API Key Header',
    headers: ['GET /api/v1/orders HTTP/1.1', 'X-API-Key: sk_live_••••9f2a'],
    statusCode: '200 OK',
    allowed: true,
    responseHeaders: ['X-RateLimit-Remaining: 59'],
    summary: 'API keys identify the calling application/project. Always pass them in headers and load from os.environ—never commit to Git.',
  },
  bearer: {
    title: 'Bearer Token (JWT / OAuth)',
    headers: ['GET /api/v1/orders HTTP/1.1', 'Authorization: Bearer eyJhbGciOi...'],
    statusCode: '200 OK',
    allowed: true,
    responseHeaders: ['X-RateLimit-Remaining: 58', 'Cache-Control: private, no-store'],
    summary: 'Bearer tokens represent an authenticated user or service scope with short expiry and signed claims.',
  },
  'cors-preflight': {
    title: 'Browser CORS Preflight (OPTIONS)',
    headers: [
      'OPTIONS /api/v1/orders HTTP/1.1',
      'Origin: https://app.frontend.dev',
      'Access-Control-Request-Method: POST',
      'Access-Control-Request-Headers: Authorization, Content-Type',
    ],
    statusCode: '204 No Content',
    allowed: true,
    responseHeaders: [
      'Access-Control-Allow-Origin: https://app.frontend.dev',
      'Access-Control-Allow-Methods: GET, POST, OPTIONS',
      'Access-Control-Allow-Headers: Authorization, Content-Type',
    ],
    summary: 'Browsers enforce Same-Origin Policy and send an OPTIONS preflight before cross-origin JSON/Auth requests; Python requests scripts bypass CORS.',
  },
  'rate-limit': {
    title: 'Rate Limit Exceeded (Backoff)',
    headers: ['GET /api/v1/orders HTTP/1.1', 'Authorization: Bearer eyJhbGciOi...'],
    statusCode: '429 Too Many Requests',
    allowed: false,
    responseHeaders: ['X-RateLimit-Remaining: 0', 'Retry-After: 4'],
    summary: 'When X-RateLimit-Remaining hits 0, the server returns 429 with Retry-After. Clients should sleep with exponential backoff + jitter.',
  },
};

export const ApiAuthCorsSim: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('bearer');
  const scenario = AUTH_SCENARIOS[mode];

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-panel)] p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-400" />
          <h4 className="text-sm font-bold text-[var(--text-main)]">
            API Auth, Rate Limits &amp; CORS Preflight Inspector
          </h4>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Auth and CORS modes">
          {([
            ['none', 'No Auth (401)'],
            ['api-key', 'API Key'],
            ['bearer', 'Bearer JWT'],
            ['cors-preflight', 'CORS OPTIONS'],
            ['rate-limit', 'Rate Limit (429)'],
          ] as [AuthMode, string][]).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={mode === key}
              onClick={() => setMode(key)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                mode === key
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 space-y-2">
          <div className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5">
            {scenario.allowed ? (
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-amber-400" />
            )}
            Outgoing Request Headers
          </div>
          <pre className="text-xs font-mono text-[var(--text-main)] whitespace-pre-wrap overflow-x-auto">
            {scenario.headers.join('\n')}
          </pre>
        </div>

        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[var(--text-main)] flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              Server Policy Response
            </span>
            <span className={`font-mono font-bold tabular-nums ${scenario.allowed ? 'text-emerald-400' : 'text-amber-400'}`}>
              {scenario.statusCode}
            </span>
          </div>
          <pre className="text-xs font-mono text-[var(--text-main)] whitespace-pre-wrap overflow-x-auto">
            {scenario.responseHeaders.join('\n')}
          </pre>
        </div>
      </div>

      <div className="text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-2.5">
        {scenario.summary}
      </div>
    </div>
  );
};
