/**
 * NumPy Broadcasting & Axis Reduction Simulator
 * Section 14 (Day 24 Signature Simulation):
 * Visualizes scalar, row, and column broadcasting alignment rules as well as
 * axis=0 (column-wise) vs axis=1 (row-wise) aggregations.
 */

import React, { useState } from 'react';
import { GitMerge } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface BroadcastCase {
  id: 'scalar' | 'row' | 'col' | 'axis0' | 'axis1';
  label: string;
  operation: string;
  leftShape: string;
  rightShape: string;
  resultShape: string;
  resultText: string;
  note: string;
}

const CASES: BroadcastCase[] = [
  {
    id: 'scalar',
    label: 'Scalar + (2, 3)',
    operation: 'np.array([[1, 2, 3], [4, 5, 6]]) + 10',
    leftShape: '(2, 3)',
    rightShape: '() -> stretched to (2, 3)',
    resultShape: '(2, 3)',
    resultText: '[[11, 12, 13],\n [14, 15, 16]]',
    note: 'A scalar has shape () and broadcasts virtually across every element without allocating an extra (2, 3) array.',
  },
  {
    id: 'row',
    label: 'Row (1, 3) + (2, 3)',
    operation: 'matrix + np.array([100, 200, 300])',
    leftShape: '(2, 3)',
    rightShape: '(3,) -> padded (1, 3)',
    resultShape: '(2, 3)',
    resultText: '[[101, 202, 303],\n [104, 205, 306]]',
    note: 'Trailing dimensions match (3 == 3), and the leading dimension 1 stretches to 2 so each row receives [100, 200, 300].',
  },
  {
    id: 'col',
    label: 'Col (2, 1) + (2, 3)',
    operation: 'matrix + np.array([[10], [20]])',
    leftShape: '(2, 3)',
    rightShape: '(2, 1)',
    resultShape: '(2, 3)',
    resultText: '[[11, 12, 13],\n [24, 25, 26]]',
    note: 'Row counts match (2 == 2), and the column dimension 1 stretches to 3 so row 0 adds 10 and row 1 adds 20.',
  },
  {
    id: 'axis0',
    label: 'sum(axis=0)',
    operation: 'np.array([[1, 2, 3], [4, 5, 6]]).sum(axis=0)',
    leftShape: '(2, 3)',
    rightShape: 'Collapse Axis 0 (rows)',
    resultShape: '(3,)',
    resultText: '[5, 7, 9]  # column totals',
    note: 'axis=0 collapses the row dimension (2 -> gone), producing one sum per column.',
  },
  {
    id: 'axis1',
    label: 'sum(axis=1)',
    operation: 'np.array([[1, 2, 3], [4, 5, 6]]).sum(axis=1)',
    leftShape: '(2, 3)',
    rightShape: 'Collapse Axis 1 (cols)',
    resultShape: '(2,)',
    resultText: '[6, 15]  # row totals',
    note: 'axis=1 collapses the column dimension (3 -> gone), producing one sum per row.',
  },
];

export const BroadcastingAxisSim: React.FC = () => {
  const [caseId, setCaseId] = useState<BroadcastCase['id']>('row');
  const active = CASES.find((c) => c.id === caseId) || CASES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Broadcasting Alignment & Axis Reduction Lab" badge="simulation" />
      <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-5">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Broadcasting and Axis Mode">
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
              <GitMerge className="w-4 h-4" />
              <span>Shape Alignment &amp; Output</span>
            </div>

            <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-xs text-emerald-400">
              {active.operation}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="text-[var(--text-muted)] font-semibold mb-1">Input Shape</div>
                <div className="font-mono text-[var(--text-main)]">{active.leftShape}</div>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="text-[var(--text-muted)] font-semibold mb-1">Rule / Operand</div>
                <div className="font-mono text-sky-300">{active.rightShape}</div>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="text-[var(--text-muted)] font-semibold mb-1">Output Shape</div>
                <div className="font-mono text-emerald-300">{active.resultShape}</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-[var(--border-subtle)]">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Result Tensor
              </div>
              <pre className="font-mono text-xs text-slate-100 whitespace-pre-wrap">{active.resultText}</pre>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{active.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
