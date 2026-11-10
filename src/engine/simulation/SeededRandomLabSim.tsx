/**
 * Seeded Random Lab Simulation
 * Section 14 (Day 12 Signature Simulation):
 * Demonstrates that setting random.seed(s) produces the exact same deterministic
 * pseudo-random sequence every time, while changing the seed yields a different sequence.
 */

import React, { useState } from 'react';
import { Dices, RefreshCw } from 'lucide-react';
import { SimulationController } from './SimulationController';

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateSequence(seed: number, count: number): number[] {
  const rng = mulberry32(seed);
  return Array.from({ length: count }, () => Math.floor(rng() * 90) + 10);
}

export const SeededRandomLabSim: React.FC = () => {
  const [seed, setSeed] = useState<number>(42);
  const [runCount, setRunCount] = useState<number>(1);

  const sequenceA = generateSequence(seed, 5);
  const sequenceB = generateSequence(seed, 5);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Seeded Random Reproducibility Lab" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        {/* Seed Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Dices className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="eyebrow-label text-xs">SELECT SEED (random.seed(s))</span>
          </div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Random Seed Presets">
            {[7, 42, 101, 2026].map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={seed === s}
                onClick={() => {
                  setSeed(s);
                  setRunCount((c) => c + 1);
                }}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors ${
                  seed === s
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                seed({s})
              </button>
            ))}
            <button
              type="button"
              onClick={() => setRunCount((c) => c + 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] text-xs font-bold text-[var(--text-main)] hover:border-[var(--accent-primary)]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-run</span>
            </button>
          </div>
        </div>

        {/* Two Independent Runs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
            <span className="eyebrow-label text-xs">RUN #1 (random.seed({seed}))</span>
            <div className="flex flex-wrap gap-2 font-mono text-sm">
              {sequenceA.map((n, i) => (
                <span
                  key={i}
                  className="px-3 py-2 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] font-bold"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
            <span className="eyebrow-label text-xs">RUN #{runCount + 1} (random.seed({seed}))</span>
            <div className="flex flex-wrap gap-2 font-mono text-sm">
              {sequenceB.map((n, i) => (
                <span
                  key={i}
                  className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-bold"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          role="status"
          aria-live="polite"
          className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-[var(--text-main)]"
        >
          <strong>Deterministic Match:</strong> Both runs with <code className="font-mono">random.seed({seed})</code>{' '}
          produced the exact same sequence <code className="font-mono">[{sequenceA.join(', ')}]</code>. Seeding makes
          tests and lesson examples 100% reproducible.
        </div>
      </div>
    </div>
  );
};
