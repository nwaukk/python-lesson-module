/**
 * Argument Matcher Simulation Primitive
 * Section 14 (Day 11 Signature Simulation):
 * Demonstrates how Python binds positional, keyword, default, *args, and **kwargs
 * arguments to parameters, and flags TypeError on missing or extra arguments.
 */

import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, GitMerge } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface CallCase {
  id: string;
  label: string;
  callCode: string;
  isValid: boolean;
  bindings: { param: string; value: string; source: string }[];
  message: string;
}

const CALL_CASES: CallCase[] = [
  {
    id: 'pos-default',
    label: 'Positional + Default',
    callCode: 'create_user("Ada", "admin")',
    isValid: true,
    bindings: [
      { param: 'name', value: '"Ada"', source: 'positional arg 0' },
      { param: 'role', value: '"admin"', source: 'positional arg 1' },
      { param: 'active', value: 'True', source: 'default value' },
    ],
    message: 'All required parameters satisfied; active falls back to its default True.',
  },
  {
    id: 'keyword-reorder',
    label: 'Keyword Reordered',
    callCode: 'create_user(active=False, name="Kofi")',
    isValid: true,
    bindings: [
      { param: 'name', value: '"Kofi"', source: 'keyword arg' },
      { param: 'role', value: '"viewer"', source: 'default value' },
      { param: 'active', value: 'False', source: 'keyword arg' },
    ],
    message: 'Keyword arguments match by parameter name regardless of order.',
  },
  {
    id: 'missing-req',
    label: 'Missing Required (Error)',
    callCode: 'create_user()',
    isValid: false,
    bindings: [{ param: 'name', value: 'MISSING!', source: 'no default' }],
    message: "TypeError: create_user() missing 1 required positional argument: 'name'",
  },
  {
    id: 'too-many',
    label: 'Extra Positional (Error)',
    callCode: 'create_user("Ada", "admin", True, 99)',
    isValid: false,
    bindings: [
      { param: 'name', value: '"Ada"', source: 'positional arg 0' },
      { param: 'role', value: '"admin"', source: 'positional arg 1' },
      { param: 'active', value: 'True', source: 'positional arg 2' },
      { param: '???', value: '99', source: 'no *args parameter!' },
    ],
    message: 'TypeError: create_user() takes from 1 to 3 positional arguments but 4 were given',
  },
];

export const ArgumentMatcherSim: React.FC = () => {
  const [caseId, setCaseId] = useState<string>('pos-default');
  const active = CALL_CASES.find((c) => c.id === caseId) || CALL_CASES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Parameter & Argument Binding Matcher" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        {/* Signature Header */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
          <span className="eyebrow-label text-xs">FUNCTION SIGNATURE</span>
          <pre className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--accent-primary)] font-bold overflow-x-auto">
            def create_user(name, role=&quot;viewer&quot;, active=True):
          </pre>
        </div>

        {/* Call Presets */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="eyebrow-label text-xs">CALL EXPRESSION</span>
          </div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Call Expression Presets">
            {CALL_CASES.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={caseId === c.id}
                onClick={() => setCaseId(c.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                  caseId === c.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Call Preview & Binding Table */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <div className="font-mono text-sm font-extrabold text-[var(--text-main)]">
            {active.callCode}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {active.bindings.map((b, idx) => (
              <div
                key={`${b.param}-${idx}`}
                className={`p-3 rounded-xl border font-mono text-xs ${
                  b.param === '???' || b.value === 'MISSING!'
                    ? 'border-rose-500/40 bg-rose-500/10'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)]'
                }`}
              >
                <div className="text-[10px] text-[var(--text-dim)]">{b.source}</div>
                <div className="font-bold text-[var(--text-main)] mt-0.5">
                  <span className="text-[var(--accent-primary)]">{b.param}</span> = {b.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          role="status"
          aria-live="polite"
          className={`p-4 rounded-2xl border flex items-start gap-3 text-xs text-[var(--text-main)] ${
            active.isValid
              ? 'border-emerald-500/30 bg-emerald-500/10'
              : 'border-rose-500/40 bg-rose-500/15'
          }`}
        >
          {active.isValid ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <span className="font-mono">{active.message}</span>
        </div>
      </div>
    </div>
  );
};
