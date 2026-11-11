/**
 * Sequence & Function Packing / Unpacking Simulator
 * Section 14 (Day 17 Signature Simulation):
 * Visualizes extended iterable unpacking (head, *mid, tail),
 * *args / **kwargs parameter packing, and dictionary merging ({**a, **b}).
 */

import React, { useState } from 'react';
import { PackageOpen } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface UnpackMode {
  id: 'starred-seq' | 'args-kwargs' | 'dict-spread';
  label: string;
  code: string;
  bindings: { target: string; type: string; value: string }[];
  note: string;
}

const MODES: UnpackMode[] = [
  {
    id: 'starred-seq',
    label: 'head, *mid, tail',
    code: 'first, *middle, last = [10, 20, 30, 40, 50]',
    bindings: [
      { target: 'first', type: 'int', value: '10' },
      { target: 'middle', type: 'list', value: '[20, 30, 40]' },
      { target: 'last', type: 'int', value: '50' },
    ],
    note: 'The starred target (*middle) ALWAYS binds to a list—even if 0 or 1 elements remain.',
  },
  {
    id: 'args-kwargs',
    label: '*args & **kwargs',
    code: 'def log(level, *args, **kwargs): ...  # log("INFO", 200, "OK", host="api-1")',
    bindings: [
      { target: 'level', type: 'str', value: '"INFO"' },
      { target: 'args', type: 'tuple', value: '(200, "OK")' },
      { target: 'kwargs', type: 'dict', value: '{"host": "api-1"}' },
    ],
    note: 'In a function signature, *args packs extra positional arguments into a tuple; **kwargs packs extra keywords into a dict.',
  },
  {
    id: 'dict-spread',
    label: '{**defaults, **env}',
    code: 'cfg = {**{"port": 8000, "debug": False}, **{"debug": True}}',
    bindings: [
      { target: 'cfg["port"]', type: 'int', value: '8000' },
      { target: 'cfg["debug"]', type: 'bool', value: 'True (right-most wins)' },
    ],
    note: 'When spreading dictionaries with ** (or merging with |), duplicate keys on the right overwrite earlier ones.',
  },
];

export const PackingUnpackingSim: React.FC = () => {
  const [modeId, setModeId] = useState<UnpackMode['id']>('starred-seq');
  const active = MODES.find((m) => m.id === modeId) || MODES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Packing & Unpacking (* / **) Binding Lab" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">UNPACKING PATTERN</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Unpacking Pattern Selector">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={modeId === m.id}
                onClick={() => setModeId(m.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors ${
                  modeId === m.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <pre className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--accent-primary)] overflow-x-auto">
          {active.code}
        </pre>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {active.bindings.map((b) => (
            <div
              key={b.target}
              className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-[var(--text-main)]">{b.target}</span>
                <span className="px-1.5 py-0.5 rounded bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-dim)]">
                  {b.type}
                </span>
              </div>
              <div className="font-mono text-xs text-emerald-400 break-all">{b.value}</div>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          <PackageOpen className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <span>{active.note}</span>
        </div>
      </div>
    </div>
  );
};
