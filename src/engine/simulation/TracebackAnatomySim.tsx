/**
 * Traceback Anatomy & Stack Frame Reader
 * Section 14 (Day 15 Signature Simulation):
 * Visualizes Python's "Traceback (most recent call last):" structure,
 * guiding learners to read bottom-up from the Exception line to the root cause frame.
 */

import React, { useState } from 'react';
import { AlertOctagon, Layers, ArrowUp } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface Frame {
  id: string;
  file: string;
  line: number;
  fn: string;
  code: string;
  locals: string;
  note: string;
}

const FRAMES: Frame[] = [
  {
    id: 'f1',
    file: 'main.py',
    line: 12,
    fn: '<module>',
    code: 'total = checkout("99.50", 2)',
    locals: 'No local error — passed string "99.50" as price.',
    note: 'Entry point (oldest call). Notice the bug started here by passing a str instead of float.',
  },
  {
    id: 'f2',
    file: 'billing.py',
    line: 5,
    fn: 'checkout',
    code: 'return apply_tax(price * qty)',
    locals: 'price = "99.50" (str), qty = 2 (int)',
    note: 'In Python, "99.50" * 2 silently produces "99.5099.50" instead of failing here!',
  },
  {
    id: 'f3',
    file: 'billing.py',
    line: 2,
    fn: 'apply_tax',
    code: 'return subtotal * 1.08',
    locals: 'subtotal = "99.5099.50" (str)',
    note: 'Most recent call (bottom frame): str * float is illegal -> raises TypeError here.',
  },
];

export const TracebackAnatomySim: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('f3');
  const active = FRAMES.find((f) => f.id === selectedId) || FRAMES[2];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Traceback Anatomy & Stack Frame Reader" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>Traceback (most recent call last) — click a frame to inspect</span>
            </span>
            <span className="flex items-center gap-1 text-[var(--accent-primary)]">
              <ArrowUp className="w-3.5 h-3.5" /> Read bottom-up
            </span>
          </div>

          <div className="space-y-2">
            {FRAMES.map((f, idx) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={selectedId === f.id}
                onClick={() => setSelectedId(f.id)}
                className={`w-full text-left p-3 rounded-xl border font-mono text-xs transition-colors ${
                  selectedId === f.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-[var(--accent-primary)]/40'
                }`}
              >
                <div className="text-[var(--text-muted)]">
                  Frame {idx + 1}: File &quot;{f.file}&quot;, line {f.line}, in {f.fn}
                </div>
                <div className="text-[var(--text-main)] font-bold mt-0.5">&nbsp;&nbsp;{f.code}</div>
              </button>
            ))}

            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 font-mono text-xs text-rose-400 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 shrink-0" />
              <span>TypeError: can&apos;t multiply sequence by non-int of type &apos;float&apos;</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--accent-primary)]/40 space-y-2">
          <div className="text-xs font-bold text-[var(--accent-primary)]">
            Frame Inspector: {active.file}:{active.line} ({active.fn})
          </div>
          <div className="font-mono text-xs text-[var(--text-main)] bg-[var(--bg-app)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
            State: {active.locals}
          </div>
          <p className="text-xs text-[var(--text-muted)]">{active.note}</p>
        </div>
      </div>
    </div>
  );
};
