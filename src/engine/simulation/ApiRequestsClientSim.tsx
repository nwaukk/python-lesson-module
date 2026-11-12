import React, { useState } from 'react';
import { Terminal, CheckCircle2, AlertTriangle } from 'lucide-react';

type ScenarioKey = 'ok-200' | 'not-found-404' | 'timeout' | 'bad-json';

interface ClientScenario {
  label: string;
  code: string;
  status: string;
  isError: boolean;
  output: string;
  explanation: string;
}

const SCENARIOS: Record<ScenarioKey, ClientScenario> = {
  'ok-200': {
    label: '200 OK + .json()',
    code: `resp = requests.get("https://api.example.com/users", params={"role": "dev"}, timeout=5)\nresp.raise_for_status()\ndata = resp.json()`,
    status: '200 OK',
    isError: false,
    output: `status_code = 200\nheaders['Content-Type'] = 'application/json'\ndata = {'users': ['Ada', 'Tunde'], 'count': 2}`,
    explanation: 'raise_for_status() passes silently on 2xx responses, and resp.json() decodes the UTF-8 JSON body into a Python dict.',
  },
  'not-found-404': {
    label: '404 + raise_for_status()',
    code: `resp = requests.get("https://api.example.com/users/999", timeout=5)\nresp.raise_for_status()`,
    status: '404 Not Found',
    isError: true,
    output: `requests.exceptions.HTTPError: 404 Client Error: Not Found for url: https://api.example.com/users/999`,
    explanation: 'requests does NOT raise an exception on 4xx/5xx by default—always call resp.raise_for_status() so HTTP failures are caught explicitly.',
  },
  timeout: {
    label: 'Read Timeout (5s)',
    code: `resp = requests.get("https://api.example.com/slow-report", timeout=(2, 5))`,
    status: 'Timeout',
    isError: true,
    output: `requests.exceptions.ReadTimeout: HTTPSConnectionPool(host='api.example.com', port=443): Read timed out. (read timeout=5)`,
    explanation: 'Without timeout=(connect, read), requests waits indefinitely if a server hangs. Always pass an explicit timeout.',
  },
  'bad-json': {
    label: 'HTML Error Body -> JSONDecodeError',
    code: `resp = requests.get("https://api.example.com/health", timeout=5)\ndata = resp.json()  # Server returned 502 HTML page`,
    status: '502 Bad Gateway',
    isError: true,
    output: `requests.exceptions.JSONDecodeError: Expecting value: line 1 column 1 (char 0) — body was "<html>502 Bad Gateway</html>"`,
    explanation: 'Calling resp.json() before checking resp.raise_for_status() or Content-Type fails with JSONDecodeError when a proxy returns HTML.',
  },
};

export const ApiRequestsClientSim: React.FC = () => {
  const [selected, setSelected] = useState<ScenarioKey>('ok-200');
  const scenario = SCENARIOS[selected];

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-panel)] p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-bold text-[var(--text-main)]">
            Python requests Client &amp; Status Inspector
          </h4>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="requests client scenarios">
          {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={selected === key}
              onClick={() => setSelected(key)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                selected === key
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
              }`}
            >
              {SCENARIOS[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3">
        <div className="text-xs font-semibold text-[var(--text-muted)] mb-1.5">Python Client Call</div>
        <pre className="text-xs font-mono text-[var(--text-main)] whitespace-pre-wrap overflow-x-auto">
          {scenario.code}
        </pre>
      </div>

      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[var(--text-main)] flex items-center gap-1.5">
            {scenario.isError ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
            Runtime Outcome
          </span>
          <span className={`font-mono font-bold tabular-nums ${scenario.isError ? 'text-amber-400' : 'text-emerald-400'}`}>
            {scenario.status}
          </span>
        </div>
        <pre className="text-xs font-mono text-[var(--text-main)] whitespace-pre-wrap overflow-x-auto">
          {scenario.output}
        </pre>
      </div>

      <div className="text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-2.5">
        {scenario.explanation}
      </div>
    </div>
  );
};
