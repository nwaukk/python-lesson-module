/**
 * GroupBy Split-Apply-Combine & Merge/Join Simulator
 * Section 14 (Day 25 Signature Simulation):
 * Visualizes groupby() Split-Apply-Combine aggregations alongside
 * pd.merge(..., how="inner" | "left") and pd.concat() operations.
 */

import React, { useState } from 'react';
import { GitFork } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface CombineCase {
  id: 'groupby' | 'inner' | 'left' | 'concat';
  label: string;
  code: string;
  output: string;
  note: string;
}

const CASES: CombineCase[] = [
  {
    id: 'groupby',
    label: 'groupby().agg()',
    code: 'orders.groupby("dept", as_index=False).agg(total=("amount", "sum"), avg=("amount", "mean"))',
    output: `dept    | total | avg
--------+-------+------
Eng     | 350.0 | 175.0
Sales   | 120.0 | 120.0`,
    note: 'Split-Apply-Combine splits rows by "dept", applies sum/mean per group, and combines the results into a summary DataFrame.',
  },
  {
    id: 'inner',
    label: 'merge(how="inner")',
    code: 'pd.merge(orders, customers, on="cust_id", how="inner")',
    output: `order_id | cust_id | name
---------+---------+-------
101      | C1      | Ada
102      | C2      | Grace`,
    note: 'Inner join keeps ONLY rows whose join key ("cust_id") exists in BOTH DataFrames. Unmatched order 103 (C9) is dropped.',
  },
  {
    id: 'left',
    label: 'merge(how="left")',
    code: 'pd.merge(orders, customers, on="cust_id", how="left")',
    output: `order_id | cust_id | name
---------+---------+-------
101      | C1      | Ada
102      | C2      | Grace
103      | C9      | NaN   <-- preserved from left!`,
    note: 'Left join keeps ALL rows from the left DataFrame (orders) and fills unmatched right columns with NaN.',
  },
  {
    id: 'concat',
    label: 'pd.concat([jan, feb])',
    code: 'pd.concat([jan_df, feb_df], ignore_index=True)',
    output: `0: Jan Row A
1: Jan Row B
2: Feb Row A   <-- clean 0..N index!`,
    note: 'Always pass ignore_index=True when stacking monthly DataFrames vertically so duplicate 0, 1 row indices are reset cleanly.',
  },
];

export const GroupByMergeSim: React.FC = () => {
  const [caseId, setCaseId] = useState<CombineCase['id']>('groupby');
  const active = CASES.find((c) => c.id === caseId) || CASES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="GroupBy Split-Apply-Combine & Merge/Join Lab" badge="simulation" />
      <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-5">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Aggregation or Join Mode">
            {CASES.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={caseId === c.id}
                onClick={() => setCaseId(c.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                  caseId === c.id
                    ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                    : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
              <GitFork className="w-4 h-4" />
              <span>Operation &amp; Resulting Table</span>
            </div>

            <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-xs text-emerald-400">
              {active.code}
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-[var(--border-subtle)]">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Output DataFrame
              </div>
              <pre className="font-mono text-xs text-slate-100 whitespace-pre-wrap">{active.output}</pre>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{active.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
