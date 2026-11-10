/**
 * Lambda Evaluator & Keyed Sorting Visualizer
 * Section 14 (Day 13 Signature Simulation):
 * Visualizes anonymous lambda expressions and how sorted(..., key=lambda ...)
 * computes sort keys per element without mutating the original items.
 */

import React, { useState } from 'react';
import { ArrowDownUp, Zap, CheckCircle2 } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface LambdaPreset {
  id: string;
  label: string;
  code: string;
  keyExpr: string;
  rows: { item: string; keyVal: string; rank: number }[];
  sortedOutput: string;
  takeaway: string;
}

const PRESETS: LambdaPreset[] = [
  {
    id: 'tuple-score',
    label: 'Sort by 2nd Tuple Field',
    code: 'sorted(players, key=lambda p: p[1], reverse=True)',
    keyExpr: 'p[1]',
    rows: [
      { item: '("Ada", 94)', keyVal: '94', rank: 1 },
      { item: '("Lin", 88)', keyVal: '88', rank: 2 },
      { item: '("Kai", 72)', keyVal: '72', rank: 3 },
    ],
    sortedOutput: '[("Ada", 94), ("Lin", 88), ("Kai", 72)]',
    takeaway: 'Without key=lambda, Python compares tuples by index 0 (alphabetical name) first.',
  },
  {
    id: 'dict-price',
    label: 'Sort Dicts by Price',
    code: 'sorted(items, key=lambda d: d["price"])',
    keyExpr: 'd["price"]',
    rows: [
      { item: '{"sku": "B", "price": 12}', keyVal: '12', rank: 1 },
      { item: '{"sku": "C", "price": 19}', keyVal: '19', rank: 2 },
      { item: '{"sku": "A", "price": 45}', keyVal: '45', rank: 3 },
    ],
    sortedOutput: '[{"sku": "B", "price": 12}, {"sku": "C", "price": 19}, {"sku": "A", "price": 45}]',
    takeaway: 'Dicts cannot be compared directly with <; key=lambda extracts a comparable number or string.',
  },
  {
    id: 'case-insensitive',
    label: 'Case-Insensitive Sort',
    code: 'sorted(tags, key=lambda s: s.lower())',
    keyExpr: 's.lower()',
    rows: [
      { item: '"api"', keyVal: '"api"', rank: 1 },
      { item: '"CLI"', keyVal: '"cli"', rank: 2 },
      { item: '"ML"', keyVal: '"ml"', rank: 3 },
    ],
    sortedOutput: '["api", "CLI", "ML"]',
    takeaway: 'Original casing ("CLI", "ML") is preserved in the output while sorting uses the lowercase key.',
  },
];

export const LambdaEvaluatorSim: React.FC = () => {
  const [presetId, setPresetId] = useState<string>('tuple-score');
  const active = PRESETS.find((p) => p.id === presetId) || PRESETS[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Lambda Keyed Sorting & Expression Evaluator" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">LAMBDA SCENARIO</span>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Lambda Scenario Selector">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={presetId === p.id}
                onClick={() => setPresetId(p.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                  presetId === p.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)]">
            <Zap className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Single-Expression Anonymous Function</span>
          </div>
          <pre className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs sm:text-sm text-[var(--accent-primary)] overflow-x-auto">
            {active.code}
          </pre>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-3 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            <span>Original Element</span>
            <span>Computed Key ({active.keyExpr})</span>
            <span>Rank</span>
          </div>
          {active.rows.map((r, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
            >
              <span className="font-mono text-xs text-[var(--text-main)] truncate">{r.item}</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/30">
                {r.keyVal}
              </span>
              <span className="font-mono text-xs font-bold text-emerald-400">#{r.rank}</span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-emerald-500/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <ArrowDownUp className="w-4 h-4" />
            <span>Sorted Output</span>
          </div>
          <div className="font-mono text-xs sm:text-sm text-[var(--text-main)] break-all">{active.sortedOutput}</div>
          <p className="text-xs text-[var(--text-muted)] flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>{active.takeaway}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
