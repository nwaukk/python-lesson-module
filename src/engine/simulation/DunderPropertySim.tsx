/**
 * Dunder Methods, @property & Method Decorators Simulator
 * Section 14 (Day 21 Signature Simulation):
 * Visualizes __str__/__repr__, __len__/__eq__/__add__, @property validation,
 * and @classmethod/@staticmethod dispatch.
 */

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface DunderTab {
  id: 'str-repr' | 'operators' | 'property' | 'decorators';
  label: string;
  code: string;
  result: string;
  note: string;
}

const TABS: DunderTab[] = [
  {
    id: 'str-repr',
    label: '__str__ vs __repr__',
    code: `class Item:\n    def __init__(self, sku): self.sku = sku\n    def __repr__(self): return f"Item(sku={self.sku!r})"\n    def __str__(self): return f"SKU #{self.sku}"`,
    result: 'print(Item("A1")) -> "SKU #A1" | repr(Item("A1")) -> "Item(sku=\'A1\')"',
    note: '__str__ targets end users (print/f-strings); __repr__ targets developers/debugging and is used inside lists.',
  },
  {
    id: 'operators',
    label: '__len__ / __eq__ / __add__',
    code: `class Money:\n    def __init__(self, cents): self.cents = cents\n    def __add__(self, other): return Money(self.cents + other.cents)\n    def __eq__(self, other): return self.cents == other.cents`,
    result: 'Money(150) + Money(250) == Money(400)  # True!',
    note: 'Implementing dunder methods lets custom objects work natively with +, ==, len(), and sorted().',
  },
  {
    id: 'property',
    label: '@property Validation',
    code: `class Account:\n    @property\n    def balance(self): return self._balance\n    @balance.setter\n    def balance(self, v):\n        if v < 0: raise ValueError("Negative balance")\n        self._balance = v`,
    result: 'acc.balance = -10  # Raises ValueError while keeping clean attribute syntax!',
    note: '@property lets you add validation behind normal dot-access (`acc.balance = ...`) without breaking callers.',
  },
  {
    id: 'decorators',
    label: '@classmethod & @staticmethod',
    code: `class Date:\n    def __init__(self, y, m, d): ...\n    @classmethod\n    def from_iso(cls, s): return cls(*map(int, s.split("-")))\n    @staticmethod\n    def is_leap(y): return y % 4 == 0`,
    result: 'Date.from_iso("2026-11-10") -> returns Date instance (or subclass!)',
    note: '@classmethod receives `cls` (ideal for alternate constructors); @staticmethod receives neither `self` nor `cls`.',
  },
];

export const DunderPropertySim: React.FC = () => {
  const [tabId, setTabId] = useState<DunderTab['id']>('str-repr');
  const active = TABS.find((t) => t.id === tabId) || TABS[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Dunder Methods, @property & Class/Static Methods" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">OOP PROTOCOL</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Dunder Protocol Selector">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={tabId === t.id}
                onClick={() => setTabId(t.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                  tabId === t.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <pre className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--accent-primary)] overflow-x-auto">
          {active.code}
        </pre>

        <pre className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-main)] overflow-x-auto">
          {active.result}
        </pre>

        <div className="flex items-start gap-2 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          <Sparkles className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <span>{active.note}</span>
        </div>
      </div>
    </div>
  );
};
