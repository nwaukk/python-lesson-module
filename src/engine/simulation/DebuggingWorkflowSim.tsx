/**
 * Systematic Debugging Workflow Simulator
 * Section 14 (Day 15 Signature Simulation):
 * Walks through the 5-step debugging loop:
 * Reproduce -> Isolate -> Inspect State (repr/type) -> Fix -> Verify.
 */

import React, { useState } from 'react';
import { Search, CheckCircle2 } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface DebugStep {
  id: string;
  step: number;
  title: string;
  action: string;
  example: string;
  insight: string;
}

const STEPS: DebugStep[] = [
  {
    id: 'reproduce',
    step: 1,
    title: '1. Reproduce Deterministically',
    action: 'Capture the exact input that triggers the failure every time.',
    example: 'avg_price(["10", "20"])  # fails reliably with string inputs',
    insight: 'Never guess fixes before you can trigger the bug on demand.',
  },
  {
    id: 'isolate',
    step: 2,
    title: '2. Isolate the Failing Frame',
    action: 'Read the bottom of the traceback to pinpoint the exact file, line, and expression.',
    example: 'File "calc.py", line 3, in avg_price -> total / len(items)',
    insight: 'Distinguish where the exception surfaced from where bad data entered.',
  },
  {
    id: 'inspect',
    step: 3,
    title: '3. Inspect Types & Values (repr / type)',
    action: 'Print repr(val) and type(val) — "20" and 20 look identical with plain print()!',
    example: 'print(repr(x), type(x))  # "\'10\'" <class \'str\'>',
    insight: 'repr() reveals quotes around strings and trailing whitespace.',
  },
  {
    id: 'fix',
    step: 4,
    title: '4. Apply Minimal Root-Cause Fix',
    action: 'Convert or validate at the boundary rather than masking errors with bare except.',
    example: 'nums = [float(x) for x in items]',
    insight: 'Never silence bugs with except: pass.',
  },
  {
    id: 'verify',
    step: 5,
    title: '5. Verify Edge Cases',
    action: 'Re-run original failing input plus boundary cases (empty list, negative, zero).',
    example: 'assert avg_price(["10", "20"]) == 15.0',
    insight: 'Confirm both the fix and absence of regressions.',
  },
];

export const DebuggingWorkflowSim: React.FC = () => {
  const [stepId, setStepId] = useState<string>('inspect');
  const active = STEPS.find((s) => s.id === stepId) || STEPS[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Systematic 5-Step Debugging Workflow" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]" role="group" aria-label="Debugging Step Selector">
          {STEPS.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={stepId === s.id}
              onClick={() => setStepId(s.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                stepId === s.id
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-primary)]">
            <Search className="w-4 h-4" />
            <span>{active.title}</span>
          </div>
          <p className="text-xs text-[var(--text-main)]">{active.action}</p>
          <pre className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--accent-primary)] overflow-x-auto">
            {active.example}
          </pre>
          <p className="text-xs text-emerald-400 flex items-start gap-1.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{active.insight}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
