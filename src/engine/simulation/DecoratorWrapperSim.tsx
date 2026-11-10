/**
 * Decorator Wrapper & functools.wraps Simulator
 * Section 14 (Day 14 Signature Simulation):
 * Visualizes @decorator syntactic sugar (fn = decorator(fn)), call-time wrapping
 * (before -> original fn(*args, **kwargs) -> after), and metadata preservation.
 */

import React, { useState } from 'react';
import { Layers, ArrowDown, ShieldCheck, AlertTriangle } from 'lucide-react';
import { SimulationController } from './SimulationController';

export const DecoratorWrapperSim: React.FC = () => {
  const [useWraps, setUseWraps] = useState<boolean>(true);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="@decorator Wrapping & functools.wraps Inspector" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">METADATA MODE</span>
          <div className="flex items-center gap-2" role="group" aria-label="functools.wraps toggle">
            <button
              type="button"
              aria-pressed={useWraps}
              onClick={() => setUseWraps(true)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                useWraps
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)]'
              }`}
            >
              With @functools.wraps(fn)
            </button>
            <button
              type="button"
              aria-pressed={!useWraps}
              onClick={() => setUseWraps(false)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                !useWraps
                  ? 'border-amber-500/60 bg-amber-500/15 text-amber-400'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)]'
              }`}
            >
              Without @wraps
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-primary)]">
            <Layers className="w-4 h-4" />
            <span>Execution Flow: compute(5)</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-main)]">
              1. wrapper(5) starts -&gt; pre-call hook (e.g., logging / auth check)
            </div>
            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-[var(--text-muted)]" />
            </div>
            <div className="p-2.5 rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent-primary)]/40 text-[var(--accent-primary)]">
              2. result = fn(*args, **kwargs) -&gt; executes original compute(5)
            </div>
            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-[var(--text-muted)]" />
            </div>
            <div className="p-2.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-main)]">
              3. post-call hook (e.g., timing / audit) -&gt; returns result
            </div>
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border space-y-2 ${
            useWraps ? 'bg-[var(--bg-surface)] border-emerald-500/40' : 'bg-[var(--bg-surface)] border-amber-500/40'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold">
            {useWraps ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            )}
            <span className={useWraps ? 'text-emerald-400' : 'text-amber-400'}>
              {useWraps ? 'Metadata Preserved' : 'Metadata Overwritten'}
            </span>
          </div>
          <div className="font-mono text-xs text-[var(--text-main)] space-y-1">
            <div>compute.__name__ -&gt; {useWraps ? '"compute"' : '"wrapper"'}</div>
            <div>compute.__doc__  -&gt; {useWraps ? '"Return square of x."' : 'None'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
