import React, { useState } from 'react';
import { Layers, FolderTree, ShieldCheck } from 'lucide-react';

type TrackKey = 'backend-api' | 'data-pipeline' | 'cli-tool' | 'automation-suite';

interface CapstoneSpec {
  label: string;
  title: string;
  stack: string;
  tree: string;
  gates: string[];
  outcome: string;
}

const TRACKS: Record<TrackKey, CapstoneSpec> = {
  'backend-api': {
    label: 'Flask + MongoDB REST API',
    title: 'Multi-Tenant Study Tracker API',
    stack: 'Python 3.12 · Flask · PyMongo · pytest · Gunicorn',
    tree: `study_tracker/\n├── pyproject.toml\n├── .env.example\n├── app/\n│   ├── __init__.py       # create_app() factory\n│   ├── serializers.py    # ObjectId + ISO 8601 converters\n│   ├── validators.py     # 400/422 payload guards\n│   └── routes.py         # GET/POST/PATCH/DELETE + pagination\n└── tests/\n    └── test_api.py`,
    gates: [
      'Return structured JSON errors for 400, 404, 409, and 422',
      'Enforce PATCH field allowlist & Idempotency-Key on POST',
      'Verify pagination bounds (1 <= limit <= 100) via unit tests',
    ],
    outcome: 'Production-ready REST service deployable behind Gunicorn with zero exposed secrets.',
  },
  'data-pipeline': {
    label: 'NumPy + Pandas Pipeline',
    title: 'Automated Retail & Sensor ETL Analyzer',
    stack: 'Python 3.12 · Pandas · NumPy · Requests · pytest',
    tree: `telemetry_etl/\n├── pyproject.toml\n├── src/etl/\n│   ├── ingest.py         # Retrying API client + timeout\n│   ├── clean.py          # Missing value & dtype normalization\n│   └── aggregate.py      # GroupBy cohort metrics & exports\n└── tests/\n    └── test_clean.py`,
    gates: [
      'Zero SettingWithCopyWarning via explicit .loc assignments',
      'Deterministic schema checks before/after outer/left merges',
      'Automated CSV + JSON summary artifact export',
    ],
    outcome: 'Reproducible ETL pipeline turning messy API JSON into validated cohort reports.',
  },
  'cli-tool': {
    label: 'Packaged CLI Utility',
    title: 'Log Auditor & Regex Report Generator',
    stack: 'Python 3.12 · argparse · pathlib · re · csv · pytest',
    tree: `log_auditor/\n├── pyproject.toml        # console_scripts entrypoint\n├── src/log_auditor/\n│   ├── __init__.py\n│   ├── parser.py         # Streaming generator + compiled regex\n│   └── cli.py            # argparse + __main__ guard\n└── tests/\n    └── test_parser.py`,
    gates: [
      'Stream multi-GB files lazily with generators instead of .read()',
      'Mask PII tokens/emails in exported CSV/JSON audit reports',
      'Installable via `pip install -e .` inside an isolated .venv',
    ],
    outcome: 'Installable command-line package demonstrating clean Python module design and streaming I/O.',
  },
  'automation-suite': {
    label: 'API + Test Automation Suite',
    title: 'Contract Verifier & Webhook Replay Harness',
    stack: 'Python 3.12 · requests · pytest · unittest.mock',
    tree: `contract_harness/\n├── pyproject.toml\n├── src/harness/\n│   ├── client.py         # Session() + 429 exponential backoff\n│   └── verifier.py       # Schema & status code assertions\n└── tests/\n    └── test_backoff.py   # Mocked HTTP status tests`,
    gates: [
      'Explicit (connect, read) timeouts on every network call',
      'Unit tests mocking 429 Retry-After & 502 HTML error bodies',
      'README quickstart with reproducible pytest pass output',
    ],
    outcome: 'Resilient integration test harness proving defensive networking and mocking mastery.',
  },
};

export const CapstoneArchitectureSim: React.FC = () => {
  const [track, setTrack] = useState<TrackKey>('backend-api');
  const spec = TRACKS[track];

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[var(--color-success)] shrink-0" aria-hidden="true" />
          <h4 className="text-sm font-bold text-[var(--text-main)]">
            Final Capstone Architecture &amp; Portfolio Blueprint
          </h4>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Capstone track selector">
          {(Object.keys(TRACKS) as TrackKey[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={track === key}
              onClick={() => setTrack(key)}
              className={`min-h-[40px] px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                track === key
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] border-[var(--accent-primary)]'
                  : 'bg-[var(--bg-app)] text-[var(--text-main)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
              }`}
            >
              {TRACKS[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
        <span className="font-semibold text-[var(--text-main)]">{spec.title}</span>
        <span>{spec.stack}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3.5 space-y-2">
          <div className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5">
            <FolderTree className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
            <span>Project Layout</span>
          </div>
          <pre className="text-xs font-mono text-[var(--text-main)] whitespace-pre overflow-x-auto">
            {spec.tree}
          </pre>
        </div>

        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3.5 space-y-2">
          <div className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-success)] shrink-0" aria-hidden="true" />
            <span>Production Quality Gates</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[var(--text-main)] list-disc list-inside">
            {spec.gates.map((gate) => (
              <li key={gate}>{gate}</li>
            ))}
          </ul>
          <div className="text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
            {spec.outcome}
          </div>
        </div>
      </div>
    </div>
  );
};
