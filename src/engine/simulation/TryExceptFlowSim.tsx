/**
 * Try / Except / Else / Finally Execution Flow Simulator
 * Section 14 (Day 17 Signature Simulation):
 * Visualizes which blocks execute under success, handled exception,
 * unhandled exception, and early return scenarios.
 */

import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface FlowScenario {
  id: 'success' | 'handled' | 'unhandled' | 'early-return';
  label: string;
  inputExpr: string;
  blocks: { name: 'try' | 'except ValueError' | 'else' | 'finally'; status: 'executed' | 'skipped'; detail: string }[];
  outcome: string;
}

const SCENARIOS: FlowScenario[] = [
  {
    id: 'success',
    label: 'Valid Input ("42")',
    inputExpr: 'parse_qty("42")',
    blocks: [
      { name: 'try', status: 'executed', detail: 'val = int("42") succeeds -> val = 42' },
      { name: 'except ValueError', status: 'skipped', detail: 'No ValueError raised; except is skipped.' },
      { name: 'else', status: 'executed', detail: 'Runs ONLY because try completed with zero exceptions.' },
      { name: 'finally', status: 'executed', detail: 'Always executes for cleanup before returning 42.' },
    ],
    outcome: 'Returns 42 cleanly after else + finally.',
  },
  {
    id: 'handled',
    label: 'Handled ValueError ("abc")',
    inputExpr: 'parse_qty("abc")',
    blocks: [
      { name: 'try', status: 'executed', detail: 'int("abc") raises ValueError mid-block.' },
      { name: 'except ValueError', status: 'executed', detail: 'Matches ValueError; logs fallback and returns 0.' },
      { name: 'else', status: 'skipped', detail: 'Skipped because an exception occurred in try.' },
      { name: 'finally', status: 'executed', detail: 'Still executes before the return 0 from except!' },
    ],
    outcome: 'Exception caught; returns 0 after finally.',
  },
  {
    id: 'unhandled',
    label: 'Unhandled TypeError (None)',
    inputExpr: 'parse_qty(None)',
    blocks: [
      { name: 'try', status: 'executed', detail: 'int(None) raises TypeError.' },
      { name: 'except ValueError', status: 'skipped', detail: 'TypeError does NOT match except ValueError.' },
      { name: 'else', status: 'skipped', detail: 'Skipped because try raised an exception.' },
      { name: 'finally', status: 'executed', detail: 'Runs cleanup FIRST, then TypeError propagates upward!' },
    ],
    outcome: 'Cleanup runs in finally, then TypeError propagates.',
  },
  {
    id: 'early-return',
    label: 'Early return in try',
    inputExpr: 'parse_qty("10") # returns inside try',
    blocks: [
      { name: 'try', status: 'executed', detail: 'Executes return 10 inside try block.' },
      { name: 'except ValueError', status: 'skipped', detail: 'No exception occurred.' },
      { name: 'else', status: 'skipped', detail: 'Skipped because try exited via early return!' },
      { name: 'finally', status: 'executed', detail: 'Guaranteed to run even on an early return.' },
    ],
    outcome: 'finally runs before function hands back 10; else is skipped.',
  },
];

export const TryExceptFlowSim: React.FC = () => {
  const [scenarioId, setScenarioId] = useState<FlowScenario['id']>('success');
  const active = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="try / except / else / finally Flow Tracer" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">EXECUTION SCENARIO</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Exception Flow Scenario">
            {SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                type="button"
                aria-pressed={scenarioId === sc.id}
                onClick={() => setScenarioId(sc.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors ${
                  scenarioId === sc.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--accent-primary)]">
          Call: {active.inputExpr}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {active.blocks.map((blk) => {
            const ran = blk.status === 'executed';
            return (
              <div
                key={blk.name}
                className={`p-3.5 rounded-xl border space-y-1.5 ${
                  ran
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] opacity-70'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--text-main)]">{blk.name}:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ran ? 'bg-emerald-500/20 text-emerald-300' : 'bg-[var(--bg-app)] text-[var(--text-dim)]'
                    }`}
                  >
                    {blk.status}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{blk.detail}</p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)]">
          {active.id === 'unhandled' ? (
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <ArrowRight className="w-3.5 h-3.5 text-[var(--text-dim)] shrink-0" />
          <span>{active.outcome}</span>
        </div>
      </div>
    </div>
  );
};
