/**
 * Standard Library Module Explorer Simulation
 * Section 14 (Day 12 Signature Simulation):
 * Lets learners choose a standard library module and inspect its dir() names,
 * key functions/constants, and sample output.
 */

import React, { useState } from 'react';
import { Package, Terminal } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface ModuleInfo {
  name: string;
  summary: string;
  dirSample: string[];
  codeExample: string;
  output: string;
}

const MODULES: ModuleInfo[] = [
  {
    name: 'math',
    summary: 'C-backed mathematical functions and constants (sqrt, ceil, floor, pi, e).',
    dirSample: ['ceil', 'comb', 'cos', 'e', 'fabs', 'factorial', 'floor', 'gcd', 'inf', 'log', 'pi', 'pow', 'sqrt', 'tau'],
    codeExample: 'import math\nprint(math.sqrt(81), round(math.pi, 4))',
    output: '9.0 3.1416',
  },
  {
    name: 'random',
    summary: 'Pseudo-random number generators, choice, shuffle, and deterministic seed().',
    dirSample: ['choice', 'choices', 'randint', 'random', 'randrange', 'sample', 'seed', 'shuffle', 'uniform'],
    codeExample: 'import random\nrandom.seed(42)\nprint(random.randint(1, 100), random.choice(["A", "B", "C"]))',
    output: '82 A',
  },
  {
    name: 'statistics',
    summary: 'Descriptive statistics for numeric data: mean, median, mode, stdev.',
    dirSample: ['fmean', 'geometric_mean', 'harmonic_mean', 'mean', 'median', 'mode', 'multimode', 'pstdev', 'stdev', 'variance'],
    codeExample: 'import statistics as stats\ndata = [10, 20, 20, 40]\nprint(stats.mean(data), stats.median(data), stats.mode(data))',
    output: '22.5 20.0 20',
  },
  {
    name: 'datetime',
    summary: 'Date, time, timestamp, and timedelta arithmetic classes.',
    dirSample: ['MAXYEAR', 'MINYEAR', 'date', 'datetime', 'time', 'timedelta', 'timezone', 'tzinfo'],
    codeExample: 'from datetime import date, timedelta\nd = date(2026, 11, 9)\nprint(d + timedelta(days=7))',
    output: '2026-11-16',
  },
  {
    name: 'sys',
    summary: 'Interpreter runtime parameters, version info, recursion limit, and module search path.',
    dirSample: ['argv', 'exit', 'getrecursionlimit', 'getsizeof', 'modules', 'path', 'platform', 'stdin', 'stdout', 'version'],
    codeExample: 'import sys\nprint("Limit:", sys.getrecursionlimit())',
    output: 'Limit: 1000',
  },
];

export const ModuleExplorerSim: React.FC = () => {
  const [modName, setModName] = useState<string>('math');
  const active = MODULES.find((m) => m.name === modName) || MODULES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Standard Library Module & dir() Explorer" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        {/* Module Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="eyebrow-label text-xs">STDLIB MODULE</span>
          </div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Module Selector">
            {MODULES.map((m) => (
              <button
                key={m.name}
                type="button"
                aria-pressed={modName === m.name}
                onClick={() => setModName(m.name)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors ${
                  modName === m.name
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Summary & dir() output */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <div
            role="status"
            aria-live="polite"
            className="text-xs text-[var(--text-main)]"
          >
            <strong className="font-mono text-[var(--accent-primary)]">{active.name}</strong>: {active.summary}
          </div>

          <div>
            <span className="eyebrow-label text-[10px] block mb-2">
              PUBLIC NAMES FROM dir({active.name})
            </span>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {active.dirSample.map((attr) => (
                <span
                  key={attr}
                  className="px-2.5 py-1 rounded-md bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-main)]"
                >
                  {attr}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sample Usage & Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <span className="eyebrow-label text-xs">USAGE EXAMPLE</span>
            <pre className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-main)] overflow-x-auto">
              {active.codeExample}
            </pre>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="eyebrow-label text-xs">RUNTIME OUTPUT</span>
            </div>
            <pre className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs text-emerald-400">
              {active.output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
