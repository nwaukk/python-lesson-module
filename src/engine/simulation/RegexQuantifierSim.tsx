/**
 * Regex Character Classes & Quantifier Workbench (Greedy vs Lazy)
 * Section 14 (Day 18 Signature Simulation):
 * Visualizes greedy (.*) vs lazy (.*?) matching, shorthand classes,
 * and ^ / $ / \b anchors.
 */

import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface QuantifierMode {
  id: 'greedy' | 'lazy' | 'bounds' | 'anchors';
  label: string;
  pattern: string;
  sample: string;
  matches: string[];
  note: string;
}

const MODES: QuantifierMode[] = [
  {
    id: 'greedy',
    label: 'Greedy <.*>',
    pattern: 'r"<.*>"',
    sample: '"<b>hi</b> and <i>bye</i>"',
    matches: ['"<b>hi</b> and <i>bye</i>"'],
    note: 'Greedy quantifiers (*, +, {m,n}) consume as much text as possible, stretching from the first < to the LAST >.',
  },
  {
    id: 'lazy',
    label: 'Lazy <.*?>',
    pattern: 'r"<.*?>"',
    sample: '"<b>hi</b> and <i>bye</i>"',
    matches: ['"<b>"', '"</b>"', '"<i>"', '"</i>"'],
    note: 'Adding ? after a quantifier (*?, +?, ??) makes it lazy (non-greedy), stopping at the FIRST closing >.',
  },
  {
    id: 'bounds',
    label: 'Exact {m,n}',
    pattern: 'r"\\b\\d{3}-\\d{4}\\b"',
    sample: '"Call 555-1234 or 12-34"',
    matches: ['"555-1234"'],
    note: '{3} requires exactly 3 digits; \\b word boundaries prevent matching partial longer numbers.',
  },
  {
    id: 'anchors',
    label: 'Anchors ^ and $',
    pattern: 'r"^[a-z]{3,5}$"',
    sample: '"abc" vs "abcdef"',
    matches: ['"abc" -> Match', '"abcdef" -> None'],
    note: '^ anchors to start of string and $ anchors to end of string, validating the entire string rather than a substring.',
  },
];

export const RegexQuantifierSim: React.FC = () => {
  const [modeId, setModeId] = useState<QuantifierMode['id']>('greedy');
  const active = MODES.find((m) => m.id === modeId) || MODES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Quantifiers (Greedy vs Lazy) & Anchors Lab" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">QUANTIFIER MODE</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Regex Quantifier Mode">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
            <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">PATTERN</div>
            <div className="font-mono text-xs font-bold text-[var(--accent-primary)]">{active.pattern}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
            <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">INPUT SAMPLE</div>
            <div className="font-mono text-xs text-[var(--text-main)]">{active.sample}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {active.matches.map((item, idx) => (
            <div
              key={idx}
              className="px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 font-mono text-xs font-bold text-emerald-300"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          <SlidersHorizontal className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <span>{active.note}</span>
        </div>
      </div>
    </div>
  );
};
