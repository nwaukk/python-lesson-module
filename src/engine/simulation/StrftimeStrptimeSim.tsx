/**
 * strftime & strptime Format Code Lab
 * Section 14 (Day 16 Signature Simulation):
 * Visualizes converting datetime -> str with strftime() and str -> datetime
 * with strptime(), highlighting common format directive tokens.
 */

import React, { useState } from 'react';
import { ArrowRight, Code2 } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface FormatPreset {
  id: string;
  label: string;
  direction: 'strftime (object -> str)' | 'strptime (str -> object)';
  code: string;
  tokens: { code: string; meaning: string }[];
  result: string;
}

const PRESETS: FormatPreset[] = [
  {
    id: 'iso-fmt',
    label: 'ISO Date + Time',
    direction: 'strftime (object -> str)',
    code: 'dt.strftime("%Y-%m-%d %H:%M")',
    tokens: [
      { code: '%Y', meaning: '4-digit year (2026)' },
      { code: '%m', meaning: 'Zero-padded month (11)' },
      { code: '%d', meaning: 'Zero-padded day (10)' },
      { code: '%H:%M', meaning: '24-hour clock (14:30)' },
    ],
    result: '"2026-11-10 14:30"',
  },
  {
    id: 'human-fmt',
    label: 'Human Readable',
    direction: 'strftime (object -> str)',
    code: 'dt.strftime("%A, %B %d, %Y")',
    tokens: [
      { code: '%A', meaning: 'Full weekday name (Tuesday)' },
      { code: '%B', meaning: 'Full month name (November)' },
      { code: '%d', meaning: 'Day of month (10)' },
      { code: '%Y', meaning: 'Year (2026)' },
    ],
    result: '"Tuesday, November 10, 2026"',
  },
  {
    id: 'parse-us',
    label: 'Parse Input String',
    direction: 'strptime (str -> object)',
    code: 'datetime.strptime("10/11/2026 09:15", "%d/%m/%Y %H:%M")',
    tokens: [
      { code: '%d/%m/%Y', meaning: 'Matches day/month/year order' },
      { code: '%H:%M', meaning: 'Matches 24-hour hour:minute' },
    ],
    result: 'datetime.datetime(2026, 11, 10, 9, 15)',
  },
];

export const StrftimeStrptimeSim: React.FC = () => {
  const [presetId, setPresetId] = useState<string>('iso-fmt');
  const active = PRESETS.find((p) => p.id === presetId) || PRESETS[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="strftime & strptime Format Directive Lab" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">FORMAT PRESET</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Format Preset Selector">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={presetId === p.id}
                onClick={() => setPresetId(p.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                  presetId === p.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-primary)]">
            {active.direction}
          </div>
          <pre className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-main)] overflow-x-auto">
            {active.code}
          </pre>
        </div>

        <div className="space-y-2">
          {active.tokens.map((t) => (
            <div
              key={t.code}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs"
            >
              <span className="font-mono font-bold text-[var(--accent-primary)]">{t.code}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
              <span className="text-[var(--text-main)] flex-1 text-right">{t.meaning}</span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-emerald-500/30 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <Code2 className="w-4 h-4" />
            <span>Evaluated Result</span>
          </div>
          <div className="font-mono text-xs sm:text-sm text-[var(--text-main)]">{active.result}</div>
        </div>
      </div>
    </div>
  );
};
