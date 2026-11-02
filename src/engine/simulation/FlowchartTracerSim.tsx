/**
 * Flowchart Tracer Simulation Primitive
 * Section 8.4: Illuminates the execution path through if, elif, and else decision trees.
 */

import React, { useState } from 'react';
import { GitBranch, ArrowDown, Check, CornerDownRight, Sparkles } from 'lucide-react';
import { SimulationController } from './SimulationController';

export const FlowchartTracerSim: React.FC = () => {
  const [score, setScore] = useState<number>(75);

  let activeBranch: 'A' | 'B' | 'F';
  if (score >= 70) activeBranch = 'A';
  else if (score >= 50) activeBranch = 'B';
  else activeBranch = 'F';

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Flowchart & Decision Branch Tracer"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {/* Score Slider Control */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="eyebrow-label text-xs">INPUT SCORE VALUE: score = {score}</span>
            <span className="font-mono text-xs font-bold text-[var(--accent-primary)]">
              Grade: {activeBranch === 'A' ? 'Distinction (A)' : activeBranch === 'B' ? 'Credit (B)' : 'Needs Revision (F)'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={score}
            onChange={(e) => setScore(parseInt(e.target.value, 10))}
            className="w-full accent-[var(--accent-primary)] cursor-pointer"
          />
        </div>

        {/* Illuminated Flowchart Decision Tree */}
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 flex flex-col items-center font-mono text-xs shadow-inner">
          {/* Decision Node 1: if score >= 70 */}
          <div
            className={`w-full max-w-md p-3.5 rounded-2xl border-2 text-center transition-all ${
              activeBranch === 'A'
                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 ring-2 ring-emerald-500/30'
                : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)]'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-[var(--text-dim)] mb-0.5">Condition 1</div>
            <div className="font-bold text-sm">if score &gt;= 70:</div>
            <div className="text-[11px] mt-1">
              Result: {score >= 70 ? 'True (Branch Taken)' : 'False (Proceed to elif)'}
            </div>
          </div>

          <ArrowDown className={`w-4 h-4 ${activeBranch !== 'A' ? 'text-amber-400' : 'text-slate-600'}`} />

          {/* Decision Node 2: elif score >= 50 */}
          <div
            className={`w-full max-w-md p-3.5 rounded-2xl border-2 text-center transition-all ${
              activeBranch === 'B'
                ? 'border-sky-500 bg-sky-500/15 text-sky-300 ring-2 ring-sky-500/30'
                : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)]'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-[var(--text-dim)] mb-0.5">Condition 2</div>
            <div className="font-bold text-sm">elif score &gt;= 50:</div>
            <div className="text-[11px] mt-1">
              Result: {score >= 70 ? 'Skipped (earlier branch satisfied)' : score >= 50 ? 'True (Branch Taken)' : 'False (Proceed to else)'}
            </div>
          </div>

          <ArrowDown className={`w-4 h-4 ${activeBranch === 'F' ? 'text-amber-400' : 'text-slate-600'}`} />

          {/* Default Node 3: else */}
          <div
            className={`w-full max-w-md p-3.5 rounded-2xl border-2 text-center transition-all ${
              activeBranch === 'F'
                ? 'border-red-500 bg-red-500/15 text-red-300 ring-2 ring-red-500/30'
                : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)]'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-[var(--text-dim)] mb-0.5">Fallback</div>
            <div className="font-bold text-sm">else:</div>
            <div className="text-[11px] mt-1">
              Result: {activeBranch === 'F' ? 'Executed (No condition met)' : 'Skipped'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
