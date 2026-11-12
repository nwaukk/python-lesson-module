/**
 * NumPy ndarray Shape, Memory Layout & Slicing Inspector Simulator
 * Section 14 (Day 24 Signature Simulation):
 * Visualizes 1D, 2D, and 3D ndarray shapes, ndim, size, dtype, strides,
 * and multidimensional slicing without copying underlying data.
 */

import React, { useState } from 'react';
import { Grid3X3 } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface ArrayLayoutSpec {
  id: 'vec1d' | 'mat2d' | 'slice2d' | 'tensor3d';
  label: string;
  expression: string;
  shape: string;
  ndim: number;
  size: number;
  dtype: string;
  flatMemory: string[];
  visualRows: string[][];
  note: string;
}

const LAYOUTS: ArrayLayoutSpec[] = [
  {
    id: 'vec1d',
    label: '1D Vector (4,)',
    expression: 'np.array([10, 20, 30, 40], dtype="int64")',
    shape: '(4,)',
    ndim: 1,
    size: 4,
    dtype: 'int64 (8 bytes/elem)',
    flatMemory: ['10', '20', '30', '40'],
    visualRows: [['10', '20', '30', '40']],
    note: 'A 1D ndarray stores elements contiguously in a single C-style memory buffer—unlike a Python list of scattered object pointers.',
  },
  {
    id: 'mat2d',
    label: '2D Matrix (2, 3)',
    expression: 'np.arange(1, 7).reshape(2, 3)',
    shape: '(2, 3)',
    ndim: 2,
    size: 6,
    dtype: 'int64 (48 bytes total)',
    flatMemory: ['1', '2', '3', '4', '5', '6'],
    visualRows: [
      ['1', '2', '3'],
      ['4', '5', '6'],
    ],
    note: 'Reshaping (6,) to (2, 3) creates a zero-copy view over the exact same 6-element contiguous buffer by updating shape and strides.',
  },
  {
    id: 'slice2d',
    label: '2D Slice arr[:, 1:]',
    expression: 'arr[:, 1:]  # rows: all, cols: 1..end',
    shape: '(2, 2)',
    ndim: 2,
    size: 4,
    dtype: 'int64 (view)',
    flatMemory: ['[1]', '2', '3', '[4]', '5', '6'],
    visualRows: [
      ['2', '3'],
      ['5', '6'],
    ],
    note: 'Basic NumPy slices return a view, not a copy! Mutating arr[:, 1:] = 0 modifies the original matrix in place.',
  },
  {
    id: 'tensor3d',
    label: '3D Tensor (2, 2, 2)',
    expression: 'np.arange(8).reshape(2, 2, 2)',
    shape: '(2, 2, 2)',
    ndim: 3,
    size: 8,
    dtype: 'int64 (64 bytes total)',
    flatMemory: ['0', '1', '2', '3', '4', '5', '6', '7'],
    visualRows: [
      ['[0, 1]', '[2, 3]'],
      ['[4, 5]', '[6, 7]'],
    ],
    note: 'Axis 0 selects the 2D block, Axis 1 selects the row, and Axis 2 selects the column inside the contiguous buffer.',
  },
];

export const NdarrayShapeSim: React.FC = () => {
  const [layoutId, setLayoutId] = useState<ArrayLayoutSpec['id']>('mat2d');
  const active = LAYOUTS.find((l) => l.id === layoutId) || LAYOUTS[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="ndarray Shape, Memory Buffer & Slicing Inspector" badge="simulation" />
      <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-5">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Array Layout Selector">
            {LAYOUTS.map((l) => (
              <button
                key={l.id}
                type="button"
                aria-pressed={layoutId === l.id}
                onClick={() => setLayoutId(l.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                  layoutId === l.id
                    ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                    : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
              <Grid3X3 className="w-4 h-4" />
              <span>Array Metadata &amp; Grid View</span>
            </div>

            <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-xs text-emerald-400">
              {active.expression}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="text-[var(--text-muted)]">shape</div>
                <div className="font-mono font-bold text-[var(--text-main)]">{active.shape}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="text-[var(--text-muted)]">ndim</div>
                <div className="font-mono font-bold text-[var(--text-main)]">{active.ndim}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="text-[var(--text-muted)]">size</div>
                <div className="font-mono font-bold text-[var(--text-main)]">{active.size}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="text-[var(--text-muted)]">dtype</div>
                <div className="font-mono font-bold text-sky-300">{active.dtype}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-[var(--border-subtle)] space-y-2">
                <div className="text-slate-400 font-semibold">Logical Shape View</div>
                <div className="space-y-1.5">
                  {active.visualRows.map((row, rIdx) => (
                    <div key={rIdx} className="flex gap-1.5">
                      {row.map((cell, cIdx) => (
                        <div
                          key={cIdx}
                          className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 font-mono text-emerald-300"
                        >
                          {cell}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-[var(--border-subtle)] space-y-2">
                <div className="text-slate-400 font-semibold">Contiguous Flat Memory Buffer</div>
                <div className="flex flex-wrap gap-1.5">
                  {active.flatMemory.map((cell, idx) => (
                    <div
                      key={idx}
                      className={`px-2 py-1 rounded border font-mono ${
                        cell.startsWith('[')
                          ? 'bg-slate-900/40 border-slate-800 text-slate-500'
                          : 'bg-slate-900 border-sky-500/40 text-sky-300'
                      }`}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{active.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
