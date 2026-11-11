/**
 * BeautifulSoup find/find_all & CSS Selector (select) Simulator
 * Section 14 (Day 22 Signature Simulation):
 * Visualizes CSS selectors, class/id/attribute matching, and Python list results.
 */

import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface SelectorCase {
  id: 'find' | 'find-all' | 'css-child' | 'attr-sel';
  label: string;
  query: string;
  matched: string[];
  note: string;
}

const CASES: SelectorCase[] = [
  {
    id: 'find',
    label: 'soup.find("h2")',
    query: 'soup.find("h2", class_="title")',
    matched: ['<h2 class="title">Python Mastery</h2>  # Returns first Tag or None'],
    note: '`soup.find()` returns the FIRST matching Tag (or `None` if nothing matches—always check `if tag:` before accessing `.text`!).',
  },
  {
    id: 'find-all',
    label: 'soup.find_all()',
    query: 'soup.find_all("span", class_="price")',
    matched: ['<span class="price">₦12,500</span>', '<span class="price">₦8,000</span>'],
    note: '`soup.find_all()` returns a Python `list` of all matching Tags (or `[]` if none match). Notice the trailing underscore in `class_="price"` because `class` is a Python keyword!',
  },
  {
    id: 'css-child',
    label: 'soup.select("div.card > a")',
    query: 'soup.select("div.card > a.buy")',
    matched: ['<a class="buy" href="/buy/1">Buy</a>', '<a class="buy" href="/buy/2">Buy</a>'],
    note: '`soup.select()` uses standard CSS selectors (`>` direct child, `.class`, `#id`, space descendant) and always returns a list.',
  },
  {
    id: 'attr-sel',
    label: 'a[href^="https"]',
    query: 'soup.select(\'a[href^="https"]\')',
    matched: ['<a href="https://docs.python.org">Docs</a>'],
    note: 'CSS attribute selectors like `[href^="https"]` (starts with) or `[href$=".pdf"]` (ends with) filter links cleanly in one line.',
  },
];

export const CssSelectorSim: React.FC = () => {
  const [caseId, setCaseId] = useState<SelectorCase['id']>('find');
  const active = CASES.find((c) => c.id === caseId) || CASES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="BeautifulSoup find() & CSS Selector (select) Lab" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">SELECTOR</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="CSS Selector Query">
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
          {active.query}
        </pre>

        <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
          <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">MATCHED ELEMENTS</div>
          <div className="space-y-1.5">
            {active.matched.map((item) => (
              <div key={item} className="p-2 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-main)] overflow-x-auto">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-2 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          <Filter className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <span>{active.note}</span>
        </div>
      </div>
    </div>
  );
};
