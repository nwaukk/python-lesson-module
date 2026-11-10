/**
 * Python Error Classifier & Diagnostic Lab
 * Section 14 (Day 15 Signature Simulation):
 * Contrasts parse-time SyntaxError/IndentationError against runtime exceptions
 * (NameError, TypeError, ValueError, KeyError, IndexError, AttributeError).
 */

import React, { useState } from 'react';
import { Bug, CheckCircle2, Terminal } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface ErrorCase {
  id: string;
  name: string;
  phase: 'Compile / Parse Time' | 'Runtime Execution';
  badCode: string;
  errorLine: string;
  cause: string;
  fix: string;
}

const ERROR_CASES: ErrorCase[] = [
  {
    id: 'syntax',
    name: 'SyntaxError',
    phase: 'Compile / Parse Time',
    badCode: 'if score >= 80\n    print("Pass")',
    errorLine: 'SyntaxError: expected ":"',
    cause: 'Code violates Python grammar before a single line executes.',
    fix: 'Add the missing colon (:) at the end of the if header.',
  },
  {
    id: 'name',
    name: 'NameError',
    phase: 'Runtime Execution',
    badCode: 'username = "ada"\nprint(usrname)',
    errorLine: "NameError: name 'usrname' is not defined",
    cause: 'Identifier is misspelled, never assigned, or out of scope.',
    fix: 'Check spelling (username) and ensure assignment runs before read.',
  },
  {
    id: 'type',
    name: 'TypeError',
    phase: 'Runtime Execution',
    badCode: 'age = "25"\nprint(age + 5)',
    errorLine: 'TypeError: can only concatenate str (not "int") to str',
    cause: 'Operation/function applied to an object of an incompatible type.',
    fix: 'Convert explicitly: int(age) + 5.',
  },
  {
    id: 'value',
    name: 'ValueError',
    phase: 'Runtime Execution',
    badCode: 'n = int("abc")',
    errorLine: "ValueError: invalid literal for int() with base 10: 'abc'",
    cause: 'Type is right (str), but the specific value cannot be parsed.',
    fix: 'Validate with .isdigit() or handle with try/except ValueError.',
  },
  {
    id: 'key',
    name: 'KeyError / IndexError',
    phase: 'Runtime Execution',
    badCode: 'cfg = {"port": 8080}\nprint(cfg["host"])',
    errorLine: "KeyError: 'host'",
    cause: 'Requested dictionary key or sequence index does not exist.',
    fix: 'Use cfg.get("host", "localhost") or check bounds len(seq).',
  },
];

export const ErrorClassifierSim: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('type');
  const active = ERROR_CASES.find((e) => e.id === selectedId) || ERROR_CASES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Python Error Classifier & Diagnostic Lab" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">EXCEPTION TYPE</span>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Exception Type Selector">
            {ERROR_CASES.map((e) => (
              <button
                key={e.id}
                type="button"
                aria-pressed={selectedId === e.id}
                onClick={() => setSelectedId(e.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors ${
                  selectedId === e.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {e.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[var(--text-muted)] flex items-center gap-1.5">
              <Bug className="w-4 h-4 text-rose-400" />
              <span>Failing Code</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--accent-primary)]">
              {active.phase}
            </span>
          </div>
          <pre className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-main)] overflow-x-auto">
            {active.badCode}
          </pre>
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 font-mono text-xs text-rose-400 flex items-center gap-2">
            <Terminal className="w-4 h-4 shrink-0" />
            <span>{active.errorLine}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-emerald-500/30 space-y-2">
          <div className="text-xs font-bold text-[var(--text-main)]">Root Cause: {active.cause}</div>
          <div className="text-xs text-emerald-400 flex items-start gap-1.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Fix: {active.fix}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
