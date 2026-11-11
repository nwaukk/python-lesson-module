/**
 * Package Metadata, pyproject.toml & HTTP Package Usage Simulator
 * Section 14 (Day 20 Signature Simulation):
 * Visualizes importlib.metadata inspection, pyproject.toml structure,
 * and consuming third-party packages like requests safely.
 */

import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface AnatomyTab {
  id: 'metadata' | 'pyproject' | 'requests';
  label: string;
  code: string;
  output: string;
  note: string;
}

const TABS: AnatomyTab[] = [
  {
    id: 'metadata',
    label: 'importlib.metadata',
    code: 'from importlib.metadata import version, metadata\nprint(version("jsonschema"))',
    output: 'Name: jsonschema\nVersion: 4.23.0\nRequires-Python: >=3.8',
    note: 'Python 3.8+ includes `importlib.metadata` in the standard library so code can inspect installed package versions at runtime.',
  },
  {
    id: 'pyproject',
    label: 'pyproject.toml',
    code: '[project]\nname = "invoice-cli"\nversion = "0.2.0"\ndependencies = ["requests~=2.32.0", "rich>=13.7"]',
    output: 'PEP 621 standard manifest -> buildable with `pip install .` or `pip install -e .`',
    note: '`pyproject.toml` is the modern PEP 517/621 standard replacing legacy `setup.py` for declaring package metadata and dependencies.',
  },
  {
    id: 'requests',
    label: 'requests HTTP Client',
    code: 'resp = requests.get("https://api.example.com/rates", timeout=5)\nresp.raise_for_status()\ndata = resp.json()',
    output: 'Status: 200 OK -> Parsed JSON dict: {"NGN": 1580.5, "EUR": 0.92}',
    note: 'Always pass `timeout=` to `requests.get()` so a hung server cannot stall your Python process indefinitely.',
  },
];

export const PackageAnatomySim: React.FC = () => {
  const [tabId, setTabId] = useState<AnatomyTab['id']>('metadata');
  const active = TABS.find((t) => t.id === tabId) || TABS[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Package Metadata, pyproject.toml & External APIs" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">PACKAGE VIEW</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Package Anatomy Selector">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={tabId === t.id}
                onClick={() => setTabId(t.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                  tabId === t.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <pre className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--accent-primary)] overflow-x-auto">
          {active.code}
        </pre>

        <pre className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-main)] overflow-x-auto">
          {active.output}
        </pre>

        <div className="flex items-start gap-2 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          <Layers className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <span>{active.note}</span>
        </div>
      </div>
    </div>
  );
};
