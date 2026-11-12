import React, { useState } from 'react';
import { Globe, Send, ArrowRight } from 'lucide-react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface EndpointPreset {
  method: HttpMethod;
  path: string;
  query: string;
  requestBody: string;
  statusCode: number;
  statusText: string;
  idempotent: boolean;
  responseBody: string;
  note: string;
}

const PRESETS: Record<HttpMethod, EndpointPreset> = {
  GET: {
    method: 'GET',
    path: '/api/v1/books',
    query: '?topic=python&limit=2',
    requestBody: '(none — GET requests should not send a body)',
    statusCode: 200,
    statusText: 'OK',
    idempotent: true,
    responseBody: '{\n  "count": 2,\n  "results": [\n    { "id": 101, "title": "Fluent Python" },\n    { "id": 102, "title": "Effective Python" }\n  ]\n}',
    note: 'Safe & idempotent: reading resources never mutates server state.',
  },
  POST: {
    method: 'POST',
    path: '/api/v1/books',
    query: '',
    requestBody: '{\n  "title": "Python Cookbook",\n  "topic": "python"\n}',
    statusCode: 201,
    statusText: 'Created',
    idempotent: false,
    responseBody: '{\n  "id": 103,\n  "title": "Python Cookbook",\n  "topic": "python"\n}',
    note: 'Not idempotent: repeating POST creates a new resource each time (201 Created).',
  },
  PUT: {
    method: 'PUT',
    path: '/api/v1/books/103',
    query: '',
    requestBody: '{\n  "id": 103,\n  "title": "Python Cookbook (3rd Ed.)",\n  "topic": "python"\n}',
    statusCode: 200,
    statusText: 'OK',
    idempotent: true,
    responseBody: '{\n  "id": 103,\n  "title": "Python Cookbook (3rd Ed.)",\n  "topic": "python"\n}',
    note: 'Idempotent: replacing resource 103 multiple times yields the exact same state.',
  },
  DELETE: {
    method: 'DELETE',
    path: '/api/v1/books/103',
    query: '',
    requestBody: '(none)',
    statusCode: 204,
    statusText: 'No Content',
    idempotent: true,
    responseBody: '(empty body — 204 No Content)',
    note: 'Idempotent: deleting a resource leaves it absent whether called once or repeatedly.',
  },
};

export const ApiHttpLifecycleSim: React.FC = () => {
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [includeQuery, setIncludeQuery] = useState<boolean>(true);

  const preset = PRESETS[method];
  const fullUrl = `https://api.example.com${preset.path}${method === 'GET' && includeQuery ? preset.query : ''}`;

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-panel)] p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-sky-400" />
          <h4 className="text-sm font-bold text-[var(--text-main)]">
            HTTP Request &amp; REST Endpoint Lifecycle
          </h4>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="HTTP verb selector">
          {(['GET', 'POST', 'PUT', 'DELETE'] as HttpMethod[]).map((verb) => (
            <button
              key={verb}
              type="button"
              aria-pressed={method === verb}
              onClick={() => setMethod(verb)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                method === verb
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
              }`}
            >
              {verb}
            </button>
          ))}
          {method === 'GET' && (
            <button
              type="button"
              aria-pressed={includeQuery}
              onClick={() => setIncludeQuery((prev) => !prev)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                includeQuery
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
              }`}
            >
              {includeQuery ? 'Query String: ON' : 'Query String: OFF'}
            </button>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3 font-mono text-xs text-[var(--text-main)] flex flex-wrap items-center gap-2">
        <Send className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        <span className="font-bold text-sky-300">{preset.method}</span>
        <span className="break-all">{fullUrl}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--text-main)]">Client Request</span>
            <span>Idempotent: {preset.idempotent ? 'Yes' : 'No'}</span>
          </div>
          <pre className="text-xs font-mono text-[var(--text-main)] whitespace-pre-wrap overflow-x-auto">
            {`Accept: application/json\nContent-Type: application/json\n\n${preset.requestBody}`}
          </pre>
        </div>

        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[var(--text-main)] flex items-center gap-1">
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              Server Response
            </span>
            <span className="font-mono font-bold text-emerald-400 tabular-nums">
              {preset.statusCode} {preset.statusText}
            </span>
          </div>
          <pre className="text-xs font-mono text-[var(--text-main)] whitespace-pre-wrap overflow-x-auto">
            {preset.responseBody}
          </pre>
        </div>
      </div>

      <div className="text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-2.5">
        {preset.note}
      </div>
    </div>
  );
};
