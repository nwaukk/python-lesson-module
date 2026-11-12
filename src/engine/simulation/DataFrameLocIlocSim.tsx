/**
 * DataFrame loc vs. iloc & Series Index Alignment Simulator
 * Section 14 (Day 25 Signature Simulation):
 * Visualizes label-based loc[] (inclusive slicing) vs integer-position iloc[]
 * (exclusive stop), plus Series index-based alignment and .copy() safety.
 */

import React, { useState } from 'react';
import { Table2 } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface QuerySpec {
  id: 'loc-slice' | 'iloc-slice' | 'series-align' | 'copy-guard';
  label: string;
  expression: string;
  matchedRows: number[];
  matchedCols: number[];
  resultPreview: string;
  note: string;
}

const HEADERS = ['index', 'item', 'dept', 'price'];
const ROWS = [
  ['sku_a', 'Keyboard', 'Tech', '75.0'],
  ['sku_b', 'Notebook', 'Office', '12.0'],
  ['sku_c', 'Monitor', 'Tech', '240.0'],
];

const QUERIES: QuerySpec[] = [
  {
    id: 'loc-slice',
    label: 'df.loc["sku_a":"sku_b", "item":"dept"]',
    expression: 'df.loc["sku_a":"sku_b", "item":"dept"]  # label-based, INCLUSIVE stop!',
    matchedRows: [0, 1],
    matchedCols: [1, 2],
    resultPreview: 'sku_a: Keyboard | Tech\nsku_b: Notebook | Office',
    note: 'loc[] uses row/column labels and INCLUDES the stop label ("sku_b" and "dept"), unlike standard Python slicing.',
  },
  {
    id: 'iloc-slice',
    label: 'df.iloc[0:2, 1:3]',
    expression: 'df.iloc[0:2, 1:3]  # integer-position, EXCLUSIVE stop!',
    matchedRows: [0, 1],
    matchedCols: [1, 2],
    resultPreview: 'row 0: Keyboard | Tech\nrow 1: Notebook | Office',
    note: 'iloc[] uses 0-based integer positions and EXCLUDES the stop index (0:2 selects 0 and 1, 1:3 selects 1 and 2).',
  },
  {
    id: 'series-align',
    label: 'Series Index Alignment',
    expression: 's1 + s2  # aligns by index label, NOT position!',
    matchedRows: [0, 2],
    matchedCols: [0, 3],
    resultPreview: 'sku_a: 75 + 5 = 80.0\nsku_b: NaN (missing in s2)\nsku_c: 240 + 10 = 250.0',
    note: 'Pandas aligns Series arithmetic by index label. Any label present in only one Series yields NaN.',
  },
  {
    id: 'copy-guard',
    label: '.copy() vs SettingWithCopy',
    expression: 'tech = df[df["dept"] == "Tech"].copy()\ntech["price"] *= 0.9',
    matchedRows: [0, 2],
    matchedCols: [2, 3],
    resultPreview: 'sku_a price -> 67.5 (safe copy)\nsku_c price -> 216.0 (safe copy)',
    note: 'Chained indexing like df[mask]["col"] = val triggers SettingWithCopyWarning. Use df.loc[mask, "col"] = val or .copy().',
  },
];

export const DataFrameLocIlocSim: React.FC = () => {
  const [queryId, setQueryId] = useState<QuerySpec['id']>('loc-slice');
  const active = QUERIES.find((q) => q.id === queryId) || QUERIES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="DataFrame loc / iloc & Index Alignment Inspector" badge="simulation" />
      <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-5">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="DataFrame Indexing Mode">
            {QUERIES.map((q) => (
              <button
                key={q.id}
                type="button"
                aria-pressed={queryId === q.id}
                onClick={() => setQueryId(q.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                  queryId === q.id
                    ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                    : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
              <Table2 className="w-4 h-4" />
              <span>Tabular Selection Highlight</span>
            </div>

            <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-xs text-emerald-400 whitespace-pre-wrap">
              {active.expression}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
                    {HEADERS.map((h, cIdx) => (
                      <th
                        key={h}
                        className={`py-2 px-3 ${
                          active.matchedCols.includes(cIdx) ? 'text-[var(--accent-primary)] font-bold' : ''
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row, rIdx) => (
                    <tr key={row[0]} className="border-b border-[var(--border-subtle)]/50">
                      {row.map((cell, cIdx) => {
                        const hit = active.matchedRows.includes(rIdx) && active.matchedCols.includes(cIdx);
                        return (
                          <td
                            key={cIdx}
                            className={`py-2 px-3 ${
                              hit
                                ? 'bg-emerald-500/15 text-emerald-300 font-bold'
                                : 'text-[var(--text-main)]'
                            }`}
                          >
                            {cell}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-[var(--border-subtle)]">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Result Output
              </div>
              <pre className="font-mono text-xs text-slate-100 whitespace-pre-wrap">{active.resultPreview}</pre>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{active.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
