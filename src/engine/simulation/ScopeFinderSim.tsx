/**
 * Scope Finder (LEGB) Simulation Primitive
 * Section 14 (Day 11 Signature Simulation):
 * Visualizes Python's LEGB name resolution order:
 * Local -> Enclosing -> Global -> Built-in.
 */

import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface ScopeQuery {
  name: string;
  resolvedLevel: 'L' | 'E' | 'G' | 'B' | 'NONE';
  value: string;
  explanation: string;
}

const QUERIES: ScopeQuery[] = [
  {
    name: 'tax',
    resolvedLevel: 'L',
    value: '0.15',
    explanation: 'Found immediately in Local scope (inner() frame). Search stops at L.',
  },
  {
    name: 'rate',
    resolvedLevel: 'E',
    value: '1.08',
    explanation: 'Not in Local; found in Enclosing scope (outer() frame). Search stops at E.',
  },
  {
    name: 'CURRENCY',
    resolvedLevel: 'G',
    value: '"NGN"',
    explanation: 'Not in Local or Enclosing; found in Global module scope. Search stops at G.',
  },
  {
    name: 'len',
    resolvedLevel: 'B',
    value: '<built-in function len>',
    explanation: 'Not in L, E, or G; resolved in Built-in scope (builtins module).',
  },
  {
    name: 'unknown_var',
    resolvedLevel: 'NONE',
    value: 'NameError',
    explanation: 'Checked L -> E -> G -> B and found nothing. Python raises NameError.',
  },
];

const LEVELS: { key: 'L' | 'E' | 'G' | 'B'; label: string; bindings: string[] }[] = [
  { key: 'L', label: 'L — Local (inner)', bindings: ['tax = 0.15', 'total = 115'] },
  { key: 'E', label: 'E — Enclosing (outer)', bindings: ['rate = 1.08'] },
  { key: 'G', label: 'G — Global (<module>)', bindings: ['CURRENCY = "NGN"', 'APP = "Ledger"'] },
  { key: 'B', label: 'B — Built-in (builtins)', bindings: ['len', 'print', 'range', 'sum'] },
];

export const ScopeFinderSim: React.FC = () => {
  const [selectedName, setSelectedName] = useState<string>('rate');
  const activeQuery = QUERIES.find((q) => q.name === selectedName) || QUERIES[0];

  const order: ('L' | 'E' | 'G' | 'B')[] = ['L', 'E', 'G', 'B'];
  const hitIndex = activeQuery.resolvedLevel === 'NONE' ? 4 : order.indexOf(activeQuery.resolvedLevel);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="LEGB Scope Finder & Lookup Order" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        {/* Name Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="eyebrow-label text-xs">LOOKUP SYMBOL</span>
          </div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Symbol Lookup Selector">
            {QUERIES.map((q) => (
              <button
                key={q.name}
                type="button"
                aria-pressed={selectedName === q.name}
                onClick={() => setSelectedName(q.name)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors ${
                  selectedName === q.name
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {q.name}
              </button>
            ))}
          </div>
        </div>

        {/* LEGB Layers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LEVELS.map((lvl, idx) => {
            const isMatch = activeQuery.resolvedLevel === lvl.key;
            const wasSearched = idx <= hitIndex;
            return (
              <div
                key={lvl.key}
                className={`p-4 rounded-2xl border transition-all ${
                  isMatch
                    ? 'border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/40'
                    : wasSearched
                    ? 'border-amber-500/30 bg-[var(--bg-surface)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-extrabold text-[var(--text-main)]">{lvl.label}</span>
                  <span className="font-mono text-[10px] font-bold">
                    {isMatch ? (
                      <span className="text-emerald-400">MATCH</span>
                    ) : wasSearched ? (
                      <span className="text-amber-400">MISS</span>
                    ) : (
                      <span className="text-[var(--text-dim)]">SKIPPED</span>
                    )}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                  {lvl.bindings.map((b) => (
                    <span
                      key={b}
                      className="px-2 py-1 rounded-md bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-muted)]"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div
          role="status"
          aria-live="polite"
          className={`p-4 rounded-2xl border flex items-start gap-3 text-xs text-[var(--text-main)] ${
            activeQuery.resolvedLevel === 'NONE'
              ? 'border-rose-500/40 bg-rose-500/15'
              : 'border-emerald-500/30 bg-emerald-500/10'
          }`}
        >
          {activeQuery.resolvedLevel === 'NONE' ? (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="font-mono font-bold mb-0.5">
              {activeQuery.name} -&gt; {activeQuery.value}
            </div>
            <div className="text-[var(--text-muted)]">{activeQuery.explanation}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
