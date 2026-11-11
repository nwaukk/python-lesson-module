/**
 * Regex Methods Comparator Simulator (match vs search vs findall vs sub)
 * Section 14 (Day 18 Signature Simulation):
 * Visualizes how re.match(), re.search(), re.findall(), and re.sub()
 * behave on the same target text, highlighting index-0 anchoring vs full scan.
 */

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface RegexMethodMode {
  id: 'match' | 'search' | 'findall' | 'sub';
  label: string;
  code: string;
  result: string;
  explanation: string;
}

const MODES: RegexMethodMode[] = [
  {
    id: 'match',
    label: 're.match()',
    code: 're.match(r"\\d+", "Order #402 shipped")',
    result: 'None (index 0 is "O", not a digit)',
    explanation: 're.match() ONLY checks at index 0 of the string. Because "Order" starts with "O", it returns None!',
  },
  {
    id: 'search',
    label: 're.search()',
    code: 're.search(r"\\d+", "Order #402 shipped")',
    result: '<re.Match span=(7, 10), match="402">',
    explanation: 're.search() scans left-to-right across the entire string and returns the FIRST Match object found.',
  },
  {
    id: 'findall',
    label: 're.findall()',
    code: 're.findall(r"\\d+", "Order #402, box #19")',
    result: '["402", "19"]',
    explanation: 're.findall() returns a list of ALL non-overlapping matching strings (or tuples if groups are used).',
  },
  {
    id: 'sub',
    label: 're.sub()',
    code: 're.sub(r"\\d+", "XXX", "Order #402, box #19")',
    result: '"Order #XXX, box #XXX"',
    explanation: 're.sub() replaces every match with the replacement string and returns a new string.',
  },
];

export const RegexMethodsSim: React.FC = () => {
  const [modeId, setModeId] = useState<RegexMethodMode['id']>('match');
  const active = MODES.find((m) => m.id === modeId) || MODES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="re.match() vs re.search() vs re.findall() vs re.sub()" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">REGEX FUNCTION</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Regex Method Selector">
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

        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
          <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">RETURN VALUE</div>
          <div className={`font-mono text-xs font-bold ${modeId === 'match' ? 'text-amber-300' : 'text-emerald-400'}`}>
            {active.result}
          </div>
        </div>

        <div className="flex items-start gap-2 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          <Search className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <span>{active.explanation}</span>
        </div>
      </div>
    </div>
  );
};
