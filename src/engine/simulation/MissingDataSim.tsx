/**
 * Missing Data (NaN / None), dropna() & fillna() Imputation Simulator
 * Section 14 (Day 25 Signature Simulation):
 * Visualizes isna() masks, subset dropna(), and median/constant fillna()
 * imputation pipelines on tabular data.
 */

import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface MissingStage {
  id: 'raw' | 'isna' | 'dropna' | 'fillna';
  label: string;
  command: string;
  rows: string[][];
  note: string;
}

const STAGES: MissingStage[] = [
  {
    id: 'raw',
    label: 'Raw DataFrame',
    command: 'df  # 4 rows, missing values in price and city',
    rows: [
      ['1', 'Oslo', '120.0'],
      ['2', 'None (NaN)', '80.0'],
      ['3', 'Lisbon', 'NaN'],
      ['4', 'Lima', '100.0'],
    ],
    note: 'Real-world CSVs contain missing values represented as NaN (float) or None/pd.NA. Always inspect df.isna().sum() before modeling.',
  },
  {
    id: 'isna',
    label: 'df.isna() Mask',
    command: 'df.isna()  # boolean mask of missing cells',
    rows: [
      ['False', 'False', 'False'],
      ['False', 'True', 'False'],
      ['False', 'False', 'True'],
      ['False', 'False', 'False'],
    ],
    note: 'In Python/Pandas, NaN != NaN is True! Never check `x == float("nan")`; always use `df.isna()` or `math.isnan(x)`.',
  },
  {
    id: 'dropna',
    label: 'dropna(subset=["price"])',
    command: 'df.dropna(subset=["price"])  # drop only rows missing price',
    rows: [
      ['1', 'Oslo', '120.0'],
      ['2', 'None (NaN)', '80.0'],
      ['4', 'Lima', '100.0'],
    ],
    note: 'Using subset=["price"] preserves row 2 (which has a valid price) instead of discarding any row with any missing column.',
  },
  {
    id: 'fillna',
    label: 'fillna(median)',
    command: 'df.fillna({"city": "Unknown", "price": df["price"].median()})',
    rows: [
      ['1', 'Oslo', '120.0'],
      ['2', 'Unknown', '80.0'],
      ['3', 'Lisbon', '100.0'],
      ['4', 'Lima', '100.0'],
    ],
    note: 'Imputing numeric columns with the median (100.0) and categorical columns with "Unknown" retains all 4 rows without skewing outliers.',
  },
];

export const MissingDataSim: React.FC = () => {
  const [stageId, setStageId] = useState<MissingStage['id']>('raw');
  const active = STAGES.find((s) => s.id === stageId) || STAGES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Missing Data (NaN), dropna() & fillna() Pipeline" badge="simulation" />
      <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-5">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Missing Data Strategy">
            {STAGES.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={stageId === s.id}
                onClick={() => setStageId(s.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                  stageId === s.id
                    ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                    : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
              <Filter className="w-4 h-4" />
              <span>DataFrame State ({active.rows.length} rows)</span>
            </div>

            <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-xs text-emerald-400">
              {active.command}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
                    <th className="py-2 px-3">id</th>
                    <th className="py-2 px-3">city</th>
                    <th className="py-2 px-3">price</th>
                  </tr>
                </thead>
                <tbody>
                  {active.rows.map((row, idx) => (
                    <tr key={idx} className="border-b border-[var(--border-subtle)]/50">
                      {row.map((cell, cIdx) => {
                        const isMissing = cell.includes('NaN') || cell === 'True';
                        return (
                          <td
                            key={cIdx}
                            className={`py-2 px-3 ${
                              isMissing
                                ? 'bg-amber-500/15 text-amber-300 font-bold'
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

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{active.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
