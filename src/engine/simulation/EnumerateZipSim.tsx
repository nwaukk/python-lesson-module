/**
 * Enumerate & Zip Pairing Simulator
 * Section 14 (Day 17 Signature Simulation):
 * Visualizes enumerate(seq, start=...) index-value pairs,
 * zip(a, b, strict=...) shortest-length truncation vs ValueError,
 * and zip(*pairs) matrix/pair transposition.
 */

import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface IterPattern {
  id: 'enumerate' | 'zip-truncate' | 'zip-strict' | 'unzip';
  label: string;
  expr: string;
  pairs: string[];
  note: string;
}

const PATTERNS: IterPattern[] = [
  {
    id: 'enumerate',
    label: 'enumerate(start=1)',
    expr: 'list(enumerate(["Lagos", "Abuja", "Kano"], start=1))',
    pairs: ['(1, "Lagos")', '(2, "Abuja")', '(3, "Kano")'],
    note: 'enumerate() yields (index, item) tuples lazily without manual counter variables.',
  },
  {
    id: 'zip-truncate',
    label: 'zip() Default',
    expr: 'list(zip(["A", "B", "C"], [10, 20]))',
    pairs: ['("A", 10)', '("B", 20)'],
    note: 'By default (strict=False), zip() stops silently at the shortest iterable ("C" is dropped).',
  },
  {
    id: 'zip-strict',
    label: 'zip(strict=True)',
    expr: 'list(zip(["A", "B", "C"], [10, 20], strict=True))',
    pairs: ['ValueError: zip() argument 2 is shorter than argument 1'],
    note: 'Python 3.10+ strict=True catches mismatched lengths immediately instead of silently dropping data.',
  },
  {
    id: 'unzip',
    label: 'zip(*pairs) Unzip',
    expr: 'names, scores = zip(*[("Ada", 95), ("Tunde", 88)])',
    pairs: ['names = ("Ada", "Tunde")', 'scores = (95, 88)'],
    note: 'Unpacking a list of pairs into zip(*pairs) transposes columns back into separate tuples.',
  },
];

export const EnumerateZipSim: React.FC = () => {
  const [patternId, setPatternId] = useState<IterPattern['id']>('enumerate');
  const active = PATTERNS.find((p) => p.id === patternId) || PATTERNS[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="enumerate() & zip() Pairing Visualizer" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">ITERATOR MODE</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Enumerate and Zip Mode">
            {PATTERNS.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={patternId === p.id}
                onClick={() => setPatternId(p.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors ${
                  patternId === p.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <pre className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--accent-primary)] overflow-x-auto">
          {active.expr}
        </pre>

        <div className="flex flex-wrap gap-2.5">
          {active.pairs.map((item, idx) => (
            <div
              key={idx}
              className={`px-3.5 py-2.5 rounded-xl border font-mono text-xs font-bold ${
                active.id === 'zip-strict'
                  ? 'border-red-500/30 bg-red-500/10 text-red-300'
                  : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          <Layers className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <span>{active.note}</span>
        </div>
      </div>
    </div>
  );
};
