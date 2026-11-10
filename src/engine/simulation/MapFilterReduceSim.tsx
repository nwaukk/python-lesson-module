/**
 * Map / Filter / Reduce Pipeline Simulator
 * Section 14 (Day 14 Signature Simulation):
 * Visualizes lazy map() transformations, filter() predicate gating, and
 * functools.reduce() cumulative folding step-by-step.
 */

import React, { useState } from 'react';
import { ArrowRight, Filter, Layers, Sigma } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface PipelineMode {
  id: string;
  label: string;
  code: string;
  steps: { input: string; operation: string; output: string; kept?: boolean }[];
  finalResult: string;
  note: string;
}

const MODES: PipelineMode[] = [
  {
    id: 'map',
    label: 'map(fn, seq)',
    code: 'list(map(lambda x: x * 2, [3, 5, 8]))',
    steps: [
      { input: '3', operation: '3 * 2', output: '6', kept: true },
      { input: '5', operation: '5 * 2', output: '10', kept: true },
      { input: '8', operation: '8 * 2', output: '16', kept: true },
    ],
    finalResult: '[6, 10, 16]',
    note: 'map() returns a lazy iterator that applies fn to every element 1-to-1. Wrap in list() to materialize.',
  },
  {
    id: 'filter',
    label: 'filter(pred, seq)',
    code: 'list(filter(lambda x: x >= 10, [4, 12, 7, 19]))',
    steps: [
      { input: '4', operation: '4 >= 10 -> False', output: 'dropped', kept: false },
      { input: '12', operation: '12 >= 10 -> True', output: '12', kept: true },
      { input: '7', operation: '7 >= 10 -> False', output: 'dropped', kept: false },
      { input: '19', operation: '19 >= 10 -> True', output: '19', kept: true },
    ],
    finalResult: '[12, 19]',
    note: 'filter() keeps only items where pred(item) is truthy. Passing None as pred filters out all falsy values.',
  },
  {
    id: 'reduce',
    label: 'functools.reduce()',
    code: 'reduce(lambda acc, x: acc + x, [10, 20, 30])',
    steps: [
      { input: 'acc=10, x=20', operation: '10 + 20', output: 'acc = 30', kept: true },
      { input: 'acc=30, x=30', operation: '30 + 30', output: 'acc = 60', kept: true },
    ],
    finalResult: '60',
    note: 'reduce() folds a sequence left-to-right into a single cumulative value. For simple sums, built-in sum() is preferred.',
  },
];

export const MapFilterReduceSim: React.FC = () => {
  const [modeId, setModeId] = useState<string>('map');
  const active = MODES.find((m) => m.id === modeId) || MODES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Map / Filter / Reduce Functional Pipeline" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">HIGHER-ORDER FUNCTION</span>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Higher-Order Function Selector">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={modeId === m.id}
                onClick={() => setModeId(m.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors ${
                  modeId === m.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <pre className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs sm:text-sm text-[var(--accent-primary)] overflow-x-auto">
            {active.code}
          </pre>
        </div>

        <div className="space-y-2.5">
          {active.steps.map((s, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 p-3 rounded-xl border ${
                s.kept === false
                  ? 'bg-[var(--bg-app)] border-amber-500/30 opacity-75'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)]'
              }`}
            >
              <div className="font-mono text-xs text-[var(--text-main)]">{s.input}</div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] hidden sm:block" />
              <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)]">
                {modeId === 'filter' ? (
                  <Filter className={`w-3.5 h-3.5 ${s.kept ? 'text-emerald-400' : 'text-amber-400'}`} />
                ) : modeId === 'reduce' ? (
                  <Sigma className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                ) : (
                  <Layers className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                )}
                <span>{s.operation}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] hidden sm:block" />
              <div className={`font-mono text-xs font-bold ${s.kept === false ? 'text-amber-400' : 'text-emerald-400'}`}>
                {s.output}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--accent-primary)]/40 space-y-1.5">
          <div className="text-xs font-bold text-[var(--accent-primary)]">Materialized Output</div>
          <div className="font-mono text-sm font-bold text-[var(--text-main)]">{active.finalResult}</div>
          <p className="text-xs text-[var(--text-muted)]">{active.note}</p>
        </div>
      </div>
    </div>
  );
};
