/**
 * Import Simulator (Virtual File Tree + Namespace Diagram)
 * Section 14 (Day 12 Signature Simulation):
 * Visualizes how different Python import forms populate the caller's namespace
 * from a virtual project file tree, including alias and star-import collision risks.
 */

import React, { useState } from 'react';
import { FolderTree, FileCode, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface ImportForm {
  id: string;
  label: string;
  statement: string;
  usage: string;
  namespaceBindings: { name: string; target: string; warning?: boolean }[];
  note: string;
  isRisky?: boolean;
}

const IMPORT_FORMS: ImportForm[] = [
  {
    id: 'import-mod',
    label: 'import math_utils',
    statement: 'import math_utils',
    usage: 'math_utils.tax(100)',
    namespaceBindings: [
      { name: 'math_utils', target: '<module "math_utils" from "/vfs/math_utils.py">' },
    ],
    note: 'Cleanest namespace: binds only the module name math_utils. Zero risk of name collisions.',
  },
  {
    id: 'from-import',
    label: 'from math_utils import tax',
    statement: 'from math_utils import tax',
    usage: 'tax(100)',
    namespaceBindings: [
      { name: 'tax', target: '<function math_utils.tax>' },
    ],
    note: 'Binds only tax directly in the caller namespace; other names in math_utils stay encapsulated.',
  },
  {
    id: 'import-as',
    label: 'import math_utils as mu',
    statement: 'import math_utils as mu',
    usage: 'mu.tax(100)',
    namespaceBindings: [
      { name: 'mu', target: '<module "math_utils" from "/vfs/math_utils.py">' },
    ],
    note: 'Binds a concise local alias mu while preserving full module qualification.',
  },
  {
    id: 'star-import',
    label: 'from math_utils import *',
    statement: 'from math_utils import *',
    usage: 'tax(100)  # + silent shadow!',
    namespaceBindings: [
      { name: 'tax', target: '<function math_utils.tax>', warning: true },
      { name: 'round', target: '<shadows built-in round()!>', warning: true },
      { name: 'PI', target: '3.14159', warning: true },
    ],
    note: 'AVOID: Star imports dump every public name into your namespace, making origin unclear and silently shadowing existing names.',
    isRisky: true,
  },
];

export const ImportSimulatorSim: React.FC = () => {
  const [formId, setFormId] = useState<string>('import-mod');
  const active = IMPORT_FORMS.find((f) => f.id === formId) || IMPORT_FORMS[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Virtual File Tree & Import Namespace Simulator" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        {/* Import Form Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">IMPORT FORM</span>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Import Syntax Selector">
            {IMPORT_FORMS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={formId === f.id}
                onClick={() => setFormId(f.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors ${
                  formId === f.id
                    ? f.isRisky
                      ? 'border-amber-500/60 bg-amber-500/15 text-amber-400'
                      : 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* File Tree + Caller Namespace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Virtual File Tree */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="eyebrow-label text-xs">VIRTUAL PROJECT TREE (/vfs)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs space-y-2 text-[var(--text-main)]">
              <div className="flex items-center gap-2 font-bold text-[var(--accent-primary)]">
                <FileCode className="w-3.5 h-3.5" />
                <span>main.py (caller)</span>
              </div>
              <pre className="pl-5 text-[11px] text-[var(--text-muted)]">
{`${active.statement}
print(${active.usage})`}
              </pre>
              <div className="flex items-center gap-2 font-bold text-sky-400 pt-2 border-t border-[var(--border-subtle)]">
                <FileCode className="w-3.5 h-3.5" />
                <span>math_utils.py (module)</span>
              </div>
              <pre className="pl-5 text-[11px] text-[var(--text-muted)]">
{`PI = 3.14159
def tax(amount): return amount * 0.075
def round(x): return int(x)  # collision!`}
              </pre>
            </div>
          </div>

          {/* Caller Namespace */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
            <span className="eyebrow-label text-xs block">MAIN.PY NAMESPACE (globals())</span>
            <div className="space-y-2">
              {active.namespaceBindings.map((b) => (
                <div
                  key={b.name}
                  className={`p-3 rounded-xl border font-mono text-xs ${
                    b.warning
                      ? 'border-amber-500/40 bg-amber-500/10'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-app)]'
                  }`}
                >
                  <div className="font-bold text-[var(--accent-primary)]">{b.name}</div>
                  <div className="text-[11px] text-[var(--text-muted)] truncate">{b.target}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          role="status"
          aria-live="polite"
          className={`p-4 rounded-2xl border flex items-start gap-3 text-xs text-[var(--text-main)] ${
            active.isRisky
              ? 'border-amber-500/40 bg-amber-500/15'
              : 'border-emerald-500/30 bg-emerald-500/10'
          }`}
        >
          {active.isRisky ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <span>{active.note}</span>
        </div>
      </div>
    </div>
  );
};
