/**
 * Comprehension Pipeline Simulator
 * Section 14 (Day 13 Signature Simulation):
 * Visualizes list comprehension execution step-by-step:
 * Source Iterable -> Optional Filter Condition -> Transform Expression -> Output List.
 */

import React, { useState } from 'react';
import { ArrowRight, Filter, Sparkles, Layers } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface CompMode {
  id: string;
  label: string;
  syntax: string;
  sourceLabel: string;
  items: { raw: string; passesFilter: boolean; transformed: string; note: string }[];
  output: string;
  explanation: string;
}

const MODES: CompMode[] = [
  {
    id: 'basic',
    label: 'Transform Only',
    syntax: '[n * n for n in nums]',
    sourceLabel: 'nums = [2, 3, 4, 5]',
    items: [
      { raw: '2', passesFilter: true, transformed: '4', note: '2 * 2 -> 4' },
      { raw: '3', passesFilter: true, transformed: '9', note: '3 * 3 -> 9' },
      { raw: '4', passesFilter: true, transformed: '16', note: '4 * 4 -> 16' },
      { raw: '5', passesFilter: true, transformed: '25', note: '5 * 5 -> 25' },
    ],
    output: '[4, 9, 16, 25]',
    explanation: 'Every element in nums is evaluated by the expression n * n and appended to a new list in order.',
  },
  {
    id: 'filter',
    label: 'Filter (if)',
    syntax: '[n * 10 for n in nums if n % 2 == 0]',
    sourceLabel: 'nums = [1, 2, 3, 4]',
    items: [
      { raw: '1', passesFilter: false, transformed: '—', note: '1 % 2 == 0 is False (skipped)' },
      { raw: '2', passesFilter: true, transformed: '20', note: '2 % 2 == 0 is True -> 20' },
      { raw: '3', passesFilter: false, transformed: '—', note: '3 % 2 == 0 is False (skipped)' },
      { raw: '4', passesFilter: true, transformed: '40', note: '4 % 2 == 0 is True -> 40' },
    ],
    output: '[20, 40]',
    explanation: 'The trailing if clause acts as a gatekeeper: only items where the condition is truthy reach the transform expression.',
  },
  {
    id: 'ternary',
    label: 'Ternary (if-else)',
    syntax: '["even" if n % 2 == 0 else "odd" for n in nums]',
    sourceLabel: 'nums = [1, 2, 3, 4]',
    items: [
      { raw: '1', passesFilter: true, transformed: '"odd"', note: '1 % 2 != 0 -> "odd"' },
      { raw: '2', passesFilter: true, transformed: '"even"', note: '2 % 2 == 0 -> "even"' },
      { raw: '3', passesFilter: true, transformed: '"odd"', note: '3 % 2 != 0 -> "odd"' },
      { raw: '4', passesFilter: true, transformed: '"even"', note: '4 % 2 == 0 -> "even"' },
    ],
    output: '["odd", "even", "odd", "even"]',
    explanation: 'An if-else expression BEFORE the for keyword maps every item to one of two values without filtering any item out.',
  },
  {
    id: 'flatten',
    label: 'Nested Flatten',
    syntax: '[x for row in matrix for x in row]',
    sourceLabel: 'matrix = [[1, 2], [3, 4]]',
    items: [
      { raw: 'row=[1,2], x=1', passesFilter: true, transformed: '1', note: 'Outer loop row=[1,2], inner x=1' },
      { raw: 'row=[1,2], x=2', passesFilter: true, transformed: '2', note: 'Outer loop row=[1,2], inner x=2' },
      { raw: 'row=[3,4], x=3', passesFilter: true, transformed: '3', note: 'Outer loop row=[3,4], inner x=3' },
      { raw: 'row=[3,4], x=4', passesFilter: true, transformed: '4', note: 'Outer loop row=[3,4], inner x=4' },
    ],
    output: '[1, 2, 3, 4]',
    explanation: 'Multiple for clauses read left-to-right just like nested for loops: outer loop first, inner loop second.',
  },
];

export const ComprehensionPipelineSim: React.FC = () => {
  const [modeId, setModeId] = useState<string>('filter');
  const active = MODES.find((m) => m.id === modeId) || MODES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="List Comprehension Pipeline Visualizer" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">COMPREHENSION PATTERN</span>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Comprehension Pattern Selector">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={modeId === m.id}
                onClick={() => setModeId(m.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
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

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            {active.sourceLabel}
          </div>
          <pre className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs sm:text-sm text-[var(--accent-primary)] overflow-x-auto">
            {active.syntax}
          </pre>
        </div>

        <div className="space-y-2.5">
          {active.items.map((item, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 p-3 rounded-xl border ${
                item.passesFilter
                  ? 'bg-[var(--bg-surface)] border-[var(--border-subtle)]'
                  : 'bg-[var(--bg-app)] border-amber-500/30 opacity-75'
              }`}
            >
              <div className="font-mono text-xs text-[var(--text-main)]">
                <span className="text-[var(--text-muted)] mr-1.5">in:</span>
                {item.raw}
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] hidden sm:block" />
              <div className="flex items-center gap-1.5 text-xs">
                <Filter className={`w-3.5 h-3.5 shrink-0 ${item.passesFilter ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span className={item.passesFilter ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                  {item.note}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] hidden sm:block" />
              <div className="font-mono text-xs font-bold text-right sm:text-left">
                {item.passesFilter ? (
                  <span className="text-[var(--accent-primary)]">emit {item.transformed}</span>
                ) : (
                  <span className="text-[var(--text-muted)]">filtered out</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--accent-primary)]/40 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-primary)]">
            <Layers className="w-4 h-4" />
            <span>Resulting List Object</span>
          </div>
          <div className="font-mono text-sm font-bold text-[var(--text-main)]">{active.output}</div>
          <p className="text-xs text-[var(--text-muted)] flex items-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0 mt-0.5" />
            <span>{active.explanation}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
