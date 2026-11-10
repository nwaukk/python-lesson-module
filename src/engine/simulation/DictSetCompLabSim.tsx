/**
 * Dict & Set Comprehension Lab
 * Section 14 (Day 13 Signature Simulation):
 * Visualizes set comprehensions (automatic deduplication) and dictionary
 * comprehensions (key-value mapping, filtering, and key/value inversion).
 */

import React, { useState } from 'react';
import { Braces, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface CompVariant {
  id: string;
  label: string;
  kind: 'set' | 'dict';
  syntax: string;
  steps: { input: string; result: string; status: 'added' | 'dedup' | 'overwritten' }[];
  finalValue: string;
  note: string;
}

const VARIANTS: CompVariant[] = [
  {
    id: 'set-dedup',
    label: 'Set Comprehension {x}',
    kind: 'set',
    syntax: '{w.lower() for w in ["Py", "py", "API", "api"]}',
    steps: [
      { input: '"Py"', result: '"py"', status: 'added' },
      { input: '"py"', result: '"py" (already in set)', status: 'dedup' },
      { input: '"API"', result: '"api"', status: 'added' },
      { input: '"api"', result: '"api" (already in set)', status: 'dedup' },
    ],
    finalValue: '{"py", "api"}',
    note: 'Curly braces without a colon create a set comprehension, automatically deduplicating identical normalized values.',
  },
  {
    id: 'dict-map',
    label: 'Dict Comprehension {k: v}',
    kind: 'dict',
    syntax: '{name: len(name) for name in ["Ada", "Grace", "Lin"]}',
    steps: [
      { input: '"Ada"', result: '"Ada": 3', status: 'added' },
      { input: '"Grace"', result: '"Grace": 5', status: 'added' },
      { input: '"Lin"', result: '"Lin": 3', status: 'added' },
    ],
    finalValue: '{"Ada": 3, "Grace": 5, "Lin": 3}',
    note: 'A colon between key and value expressions builds a dictionary in a single readable pass.',
  },
  {
    id: 'dict-invert',
    label: 'Dict Inversion {v: k}',
    kind: 'dict',
    syntax: '{v: k for k, v in {"a": 1, "b": 1, "c": 2}.items()}',
    steps: [
      { input: '("a", 1)', result: '1: "a"', status: 'added' },
      { input: '("b", 1)', result: '1: "b" (overwrites 1: "a")', status: 'overwritten' },
      { input: '("c", 2)', result: '2: "c"', status: 'added' },
    ],
    finalValue: '{1: "b", 2: "c"}',
    note: 'When inverting a dict, duplicate values become colliding keys—the later entry silently overwrites the earlier one.',
  },
];

export const DictSetCompLabSim: React.FC = () => {
  const [variantId, setVariantId] = useState<string>('set-dedup');
  const active = VARIANTS.find((v) => v.id === variantId) || VARIANTS[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Set & Dictionary Comprehension Lab" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">COLLECTION FORM</span>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Collection Comprehension Selector">
            {VARIANTS.map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={variantId === v.id}
                onClick={() => setVariantId(v.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                  variantId === v.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <pre className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs sm:text-sm text-[var(--accent-primary)] overflow-x-auto">
            {active.syntax}
          </pre>
        </div>

        <div className="space-y-2">
          {active.steps.map((s, idx) => (
            <div
              key={idx}
              className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
            >
              <span className="font-mono text-xs text-[var(--text-main)]">item = {s.input}</span>
              <span
                className={`font-mono text-xs font-semibold flex items-center gap-1.5 ${
                  s.status === 'added' ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {s.status === 'added' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                {s.result}
              </span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--accent-primary)]/40 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-primary)]">
            <Braces className="w-4 h-4" />
            <span>Final {active.kind === 'set' ? 'Set' : 'Dictionary'}</span>
          </div>
          <div className="font-mono text-sm font-bold text-[var(--text-main)]">{active.finalValue}</div>
          <p className="text-xs text-[var(--text-muted)]">{active.note}</p>
        </div>
      </div>
    </div>
  );
};
