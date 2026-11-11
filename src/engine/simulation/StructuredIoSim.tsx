/**
 * Structured File I/O Simulator (JSON, CSV & pathlib.Path)
 * Section 14 (Day 19 Signature Simulation):
 * Visualizes json.dump/load, csv.DictReader/writer with newline="",
 * and modern pathlib.Path operations.
 */

import React, { useState } from 'react';
import { Database } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface IoFormat {
  id: 'json' | 'csv' | 'pathlib';
  label: string;
  code: string;
  output: string;
  note: string;
}

const FORMATS: IoFormat[] = [
  {
    id: 'json',
    label: 'JSON (load / dump)',
    code: 'json.dumps({"user": "Ada", "active": True}, indent=2)',
    output: '{\n  "user": "Ada",\n  "active": true\n}',
    note: 'Python bool True becomes JSON true, None becomes null, and strings always use double quotes.',
  },
  {
    id: 'csv',
    label: 'CSV (DictReader / newline="")',
    code: 'with open("users.csv", "w", newline="", encoding="utf-8") as f: ...',
    output: "DictReader row: {'name': 'Ada', 'score': '95'}",
    note: 'Always pass newline="" to open() with csv.reader/writer; all DictReader values are strings until cast.',
  },
  {
    id: 'pathlib',
    label: 'pathlib.Path',
    code: 'p = Path("logs") / "app.txt"; p.write_text("ok", encoding="utf-8")',
    output: 'p.name -> "app.txt" | p.suffix -> ".txt"',
    note: 'Path uses the / operator for OS-independent path joining and provides .read_text(), .write_text(), and .exists().',
  },
];

export const StructuredIoSim: React.FC = () => {
  const [formatId, setFormatId] = useState<IoFormat['id']>('json');
  const active = FORMATS.find((f) => f.id === formatId) || FORMATS[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Structured I/O (JSON, CSV & pathlib.Path) Inspector" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">I/O FORMAT</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Structured IO Format Selector">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={formatId === f.id}
                onClick={() => setFormatId(f.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                  formatId === f.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {f.label}
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
          <Database className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <span>{active.note}</span>
        </div>
      </div>
    </div>
  );
};
