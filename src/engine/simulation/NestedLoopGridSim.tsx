/**
 * Nested Loop Grid Simulation Primitive
 * Section 14 (Day 10 Signature Simulation):
 * Visualizes nested for-loop execution by filling a multiplication-table grid
 * cell by cell, highlighting outer loop variable i, inner loop variable j,
 * active row/column, and live product i * j.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Grid3X3 } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface GridStep {
  i: number;
  j: number;
  product: number;
  filledCount: number;
  note: string;
}

export const NestedLoopGridSim: React.FC = () => {
  const [gridSize, setGridSize] = useState<number>(4);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);

  const steps: GridStep[] = useMemo(() => {
    const list: GridStep[] = [];
    let count = 0;
    for (let i = 1; i <= gridSize; i++) {
      for (let j = 1; j <= gridSize; j++) {
        count += 1;
        list.push({
          i,
          j,
          product: i * j,
          filledCount: count,
          note:
            j === 1
              ? `Outer loop enters i=${i}; inner loop starts j=1 -> ${i} * 1 = ${i}.`
              : j === gridSize
              ? `Inner loop finishes row i=${i} at j=${j} -> ${i} * ${j} = ${i * j}.`
              : `Outer i=${i} stays fixed while inner j advances to ${j} -> ${i} * ${j} = ${i * j}.`,
        });
      }
    }
    return list;
  }, [gridSize]);

  const activeStep = steps[stepIndex] || steps[0];

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }, 850 / speed);
    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIndex, speed, steps.length]);

  const handleSizeChange = (size: number) => {
    setIsPlaying(false);
    setGridSize(size);
    setStepIndex(0);
  };

  const rows = Array.from({ length: gridSize }, (_, idx) => idx + 1);
  const cols = Array.from({ length: gridSize }, (_, idx) => idx + 1);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Nested Loop Multiplication Grid"
        badge="simulation"
        isPlaying={isPlaying}
        onTogglePlay={() => {
          if (stepIndex >= steps.length - 1) setStepIndex(0);
          setIsPlaying((p) => !p);
        }}
        onStepNext={() => {
          setIsPlaying(false);
          setStepIndex((p) => Math.min(p + 1, steps.length - 1));
        }}
        onStepPrev={() => {
          setIsPlaying(false);
          setStepIndex((p) => Math.max(p - 1, 0));
        }}
        onReset={() => {
          setIsPlaying(false);
          setStepIndex(0);
        }}
        currentStep={stepIndex + 1}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        {/* Grid Size Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="eyebrow-label text-xs">GRID DIMENSIONS (1..N)</span>
          </div>
          <div className="flex items-center gap-2" role="group" aria-label="Grid Size Selector">
            {[3, 4, 5].map((size) => (
              <button
                key={size}
                type="button"
                aria-pressed={gridSize === size}
                onClick={() => handleSizeChange(size)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-colors ${
                  gridSize === size
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {size} x {size}
              </button>
            ))}
          </div>
        </div>

        {/* Live Loop Registers + Code */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
              <span className="eyebrow-label text-xs">NESTED LOOP CODE</span>
              <pre className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-main)] overflow-x-auto leading-relaxed">
{`for i in range(1, ${gridSize + 1}):
    for j in range(1, ${gridSize + 1}):
        cell = i * j
        print(f"{cell:3}", end=" ")
    print()`}
              </pre>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center">
                <span className="eyebrow-label text-[10px] block mb-1">OUTER (i)</span>
                <div className="font-mono text-xl font-extrabold text-[var(--accent-primary)]">{activeStep.i}</div>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center">
                <span className="eyebrow-label text-[10px] block mb-1">INNER (j)</span>
                <div className="font-mono text-xl font-extrabold text-sky-400">{activeStep.j}</div>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center">
                <span className="eyebrow-label text-[10px] block mb-1">i * j</span>
                <div className="font-mono text-xl font-extrabold text-emerald-400">{activeStep.product}</div>
              </div>
            </div>

            <div
              role="status"
              aria-live="polite"
              className="p-3.5 rounded-2xl border border-[var(--accent-primary)]/30 bg-[var(--accent-subtle)] text-xs text-[var(--text-main)]"
            >
              <div className="font-mono font-bold text-[var(--accent-primary)] mb-1">
                Pass {stepIndex + 1} of {steps.length} ({gridSize} outer x {gridSize} inner)
              </div>
              <div className="text-[var(--text-muted)]">{activeStep.note}</div>
            </div>
          </div>

          {/* Multiplication Grid */}
          <div className="lg:col-span-7 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 overflow-x-auto">
            <div className="flex items-center justify-between">
              <span className="eyebrow-label text-xs">MULTIPLICATION MATRIX</span>
              <span className="font-mono text-[11px] text-[var(--text-muted)]">
                Filled: {activeStep.filledCount}/{steps.length} cells
              </span>
            </div>

            <div className="inline-block min-w-full">
              <table className="w-full border-separate border-spacing-1.5 font-mono text-xs">
                <thead>
                  <tr>
                    <th className="p-2 text-[10px] text-[var(--text-dim)] text-center">i \ j</th>
                    {cols.map((col) => (
                      <th
                        key={col}
                        className={`p-2 rounded-lg text-center font-bold transition-colors ${
                          activeStep.j === col
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                            : 'bg-[var(--bg-app)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                        }`}
                      >
                        j={col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row}>
                      <th
                        className={`p-2 rounded-lg text-center font-bold transition-colors ${
                          activeStep.i === row
                            ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[var(--accent-primary)]'
                            : 'bg-[var(--bg-app)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                        }`}
                      >
                        i={row}
                      </th>
                      {cols.map((col) => {
                        const cellIdx = (row - 1) * gridSize + (col - 1);
                        const isActive = cellIdx === stepIndex;
                        const isFilled = cellIdx <= stepIndex;
                        return (
                          <td
                            key={col}
                            className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                              isActive
                                ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)] scale-[1.03]'
                                : isFilled
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                                : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-dim)]'
                            }`}
                          >
                            {isFilled ? row * col : '·'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
