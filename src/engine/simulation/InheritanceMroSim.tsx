/**
 * Inheritance, super(), Polymorphism & MRO (__mro__) Simulator
 * Section 14 (Day 21 Signature Simulation):
 * Visualizes single inheritance, super() chaining, C3 MRO linearization,
 * and polymorphic dispatch.
 */

import React, { useState } from 'react';
import { GitMerge } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface MroCase {
  id: 'single' | 'super-chain' | 'diamond-mro' | 'polymorphism';
  label: string;
  code: string;
  mroOrder: string[];
  outcome: string;
  note: string;
}

const CASES: MroCase[] = [
  {
    id: 'single',
    label: 'Single Inheritance',
    code: `class Employee:\n    def role(self): return "Staff"\nclass Manager(Employee):\n    def role(self): return "Manager"`,
    mroOrder: ['Manager', 'Employee', 'object'],
    outcome: 'Manager().role() -> "Manager" (overrides Employee.role)',
    note: 'Python walks __mro__ from left to right and invokes the first matching method.',
  },
  {
    id: 'super-chain',
    label: 'super().__init__()',
    code: `class User:\n    def __init__(self, name): self.name = name\nclass Admin(User):\n    def __init__(self, name, level):\n        super().__init__(name)\n        self.level = level`,
    mroOrder: ['Admin.__init__', 'User.__init__', 'object.__init__'],
    outcome: 'Admin("Ada", 3) -> name="Ada", level=3',
    note: 'super() delegates to the next class in __mro__ without hardcoding the parent class name.',
  },
  {
    id: 'diamond-mro',
    label: 'Diamond C3 MRO',
    code: `class A: pass\nclass B(A): pass\nclass C(A): pass\nclass D(B, C): pass`,
    mroOrder: ['D', 'B', 'C', 'A', 'object'],
    outcome: 'D.__mro__ visits B then C before shared base A (C3 Linearization)',
    note: 'C3 linearization ensures subclasses appear before parents and preserves left-to-right base order (B before C).',
  },
  {
    id: 'polymorphism',
    label: 'Polymorphic Dispatch',
    code: `def notify_all(channels, msg):\n    for ch in channels:\n        ch.send(msg)  # Duck typing: any object with .send()`,
    mroOrder: ['EmailNotifier.send()', 'SmsNotifier.send()', 'PushNotifier.send()'],
    outcome: 'Same loop dispatches cleanly to each channel implementation',
    note: 'Polymorphism lets one function operate on diverse objects sharing a common method interface.',
  },
];

export const InheritanceMroSim: React.FC = () => {
  const [caseId, setCaseId] = useState<MroCase['id']>('single');
  const active = CASES.find((c) => c.id === caseId) || CASES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Inheritance, super(), Polymorphism & MRO Inspector" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">HIERARCHY</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Inheritance Mode Selector">
            {CASES.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={caseId === c.id}
                onClick={() => setCaseId(c.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
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

        <pre className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--accent-primary)] overflow-x-auto">
          {active.code}
        </pre>

        <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
          <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">RESOLUTION CHAIN</div>
          <div className="flex flex-wrap items-center gap-2">
            {active.mroOrder.map((cls, idx) => (
              <React.Fragment key={cls}>
                <span className="px-2.5 py-1 rounded-md border border-[var(--accent-primary)] bg-[var(--accent-subtle)] font-mono text-xs font-bold text-[var(--accent-primary)]">
                  {cls}
                </span>
                {idx < active.mroOrder.length - 1 && (
                  <span className="font-mono text-xs text-[var(--text-muted)]">-&gt;</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-main)]">
          {active.outcome}
        </div>

        <div className="flex items-start gap-2 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          <GitMerge className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <span>{active.note}</span>
        </div>
      </div>
    </div>
  );
};
