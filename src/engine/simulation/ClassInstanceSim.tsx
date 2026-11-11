/**
 * Class Blueprint, Instance Memory & Attribute Lookup Simulator
 * Section 14 (Day 21 Signature Simulation):
 * Visualizes class vs instance namespaces (__dict__), `self` binding,
 * and the mutable class attribute trap.
 */

import React, { useState } from 'react';
import { Box } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface InstanceCase {
  id: 'blueprint' | 'self-binding' | 'class-vs-inst' | 'mutable-trap';
  label: string;
  code: string;
  classNamespace: string;
  instanceANamespace: string;
  instanceBNamespace: string;
  note: string;
}

const CASES: InstanceCase[] = [
  {
    id: 'blueprint',
    label: 'Class vs Instances',
    code: `class Wallet:\n    currency = "NGN"\n    def __init__(self, owner, bal=0):\n        self.owner = owner\n        self.bal = bal\nw1 = Wallet("Ada", 500)\nw2 = Wallet("Tunde", 200)`,
    classNamespace: 'Wallet.__dict__: {"currency": "NGN", "__init__": <fn>}',
    instanceANamespace: 'w1.__dict__: {"owner": "Ada", "bal": 500}',
    instanceBNamespace: 'w2.__dict__: {"owner": "Tunde", "bal": 200}',
    note: 'Each instance gets its own __dict__ for instance attributes (owner, bal), while sharing class attributes (currency) on Wallet.',
  },
  {
    id: 'self-binding',
    label: 'How self Binds',
    code: `w1.deposit(100)  # Python translates to: Wallet.deposit(w1, 100)`,
    classNamespace: 'Wallet.deposit(self, amt) -> looks up method on class',
    instanceANamespace: 'self is bound to w1 -> w1.bal becomes 600',
    instanceBNamespace: 'w2.bal remains 200 (completely untouched)',
    note: '`self` is not a keyword—it is simply the first parameter receiving the instance on which the method was called.',
  },
  {
    id: 'class-vs-inst',
    label: 'Shadowing Class Attr',
    code: `w1.currency = "USD"  # Creates instance attr on w1 ONLY!`,
    classNamespace: 'Wallet.currency is still "NGN"',
    instanceANamespace: 'w1.__dict__: {"owner": "Ada", "bal": 500, "currency": "USD"}',
    instanceBNamespace: 'w2.currency falls back to Wallet.currency ("NGN")',
    note: 'Assigning `self.attr = val` always writes to the instance __dict__, shadowing the class attribute for that instance only.',
  },
  {
    id: 'mutable-trap',
    label: 'Mutable Class Trap',
    code: `class BadBag:\n    items = []  # SHARED list across ALL instances!\nb1 = BadBag(); b2 = BadBag()\nb1.items.append("key")`,
    classNamespace: 'BadBag.items is ["key"] (mutated in place!)',
    instanceANamespace: 'b1.items -> ["key"] (no "items" in b1.__dict__)',
    instanceBNamespace: 'b2.items -> ["key"] (unexpectedly sees b1’s item!)',
    note: 'Never use a mutable list/dict as a class attribute unless sharing is intentional. Initialize `self.items = []` inside `__init__`.',
  },
];

export const ClassInstanceSim: React.FC = () => {
  const [caseId, setCaseId] = useState<InstanceCase['id']>('blueprint');
  const active = CASES.find((c) => c.id === caseId) || CASES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Class Blueprint, self & Instance Namespace Inspector" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">OOP MECHANIC</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Class Instance Mechanic Selector">
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
            <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">CLASS NAMESPACE</div>
            <div className="font-mono text-xs text-[var(--accent-primary)] break-words">{active.classNamespace}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
            <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">INSTANCE A</div>
            <div className="font-mono text-xs text-[var(--text-main)] break-words">{active.instanceANamespace}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
            <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">INSTANCE B</div>
            <div className="font-mono text-xs text-[var(--text-main)] break-words">{active.instanceBNamespace}</div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          <Box className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <span>{active.note}</span>
        </div>
      </div>
    </div>
  );
};
