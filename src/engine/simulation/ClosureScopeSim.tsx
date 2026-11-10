/**
 * Lexical Closure & Nonlocal Scope Simulator
 * Section 14 (Day 14 Signature Simulation):
 * Visualizes how an inner function captures enclosing cell variables (__closure__)
 * and mutates them via `nonlocal` across independent factory instances.
 */

import React, { useState } from 'react';
import { Lock, Plus, RotateCcw } from 'lucide-react';
import { SimulationController } from './SimulationController';

export const ClosureScopeSim: React.FC = () => {
  const [counterA, setCounterA] = useState<number>(0);
  const [counterB, setCounterB] = useState<number>(10);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Lexical Closure & __closure__ Cell Inspector" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Factory Function with Retained Cell Variable
          </div>
          <pre className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--accent-primary)] overflow-x-auto">{`def make_counter(start=0):
    count = start
    def step():
        nonlocal count
        count += 1
        return count
    return step`}</pre>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[var(--text-main)]">c1 = make_counter(0)</span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <Lock className="w-3 h-3" /> cell count = {counterA}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCounterA((v) => v + 1)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-primary)] text-[var(--accent-on)] text-xs font-bold hover:opacity-90 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" /> Call c1()
              </button>
              <button
                type="button"
                onClick={() => setCounterA(0)}
                aria-label="Reset counter c1"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[var(--text-main)]">c2 = make_counter(10)</span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <Lock className="w-3 h-3" /> cell count = {counterB}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCounterB((v) => v + 1)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-primary)] text-[var(--accent-on)] text-xs font-bold hover:opacity-90 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" /> Call c2()
              </button>
              <button
                type="button"
                onClick={() => setCounterB(10)}
                aria-label="Reset counter c2"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)] p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          Each call to <code className="text-[var(--accent-primary)]">make_counter()</code> creates a separate{' '}
          <code className="text-[var(--accent-primary)]">__closure__</code> cell for <code className="text-[var(--accent-primary)]">count</code>. Calling{' '}
          <code className="text-[var(--accent-primary)]">c1()</code> mutates only its own cell via <code className="text-[var(--accent-primary)]">nonlocal</code> without affecting <code className="text-[var(--accent-primary)]">c2()</code>.
        </p>
      </div>
    </div>
  );
};
