/**
 * Regex Capturing Groups, Named Groups & Compiled Flags Inspector
 * Section 14 (Day 18 Signature Simulation):
 * Visualizes (...) numbered groups, (?P<name>...) named groups,
 * (?:...) non-capturing groups, and re.compile() with flags.
 */

import React, { useState } from 'react';
import { Brackets } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface GroupMode {
  id: 'numbered' | 'named' | 'non-capturing' | 'compiled-flags';
  label: string;
  pattern: string;
  input: string;
  extracted: { key: string; val: string }[];
  note: string;
}

const MODES: GroupMode[] = [
  {
    id: 'numbered',
    label: 'Groups (...)',
    pattern: 'r"(\\w+)@([\\w.-]+)"',
    input: '"ada@example.org"',
    extracted: [
      { key: 'm.group(0)', val: '"ada@example.org" (full match)' },
      { key: 'm.group(1)', val: '"ada"' },
      { key: 'm.group(2)', val: '"example.org"' },
    ],
    note: 'Parentheses () create numbered capture groups starting at 1; group(0) is always the entire match.',
  },
  {
    id: 'named',
    label: 'Named (?P<name>...)',
    pattern: 'r"(?P<user>\\w+)@(?P<domain>[\\w.-]+)"',
    input: '"ada@example.org"',
    extracted: [
      { key: 'm.group("user")', val: '"ada"' },
      { key: 'm.group("domain")', val: '"example.org"' },
      { key: 'm.groupdict()', val: "{'user': 'ada', 'domain': 'example.org'}" },
    ],
    note: 'Named groups (?P<name>...) make regexes self-documenting and let you extract a dict with .groupdict().',
  },
  {
    id: 'non-capturing',
    label: 'Non-Capturing (?:...)',
    pattern: 'r"(?:https?://)([\\w.-]+)"',
    input: '"https://docs.python.org"',
    extracted: [
      { key: 're.findall(...)', val: '["docs.python.org"]' },
      { key: 'm.group(1)', val: '"docs.python.org"' },
    ],
    note: '(?:...) groups sub-expressions for quantifiers or | alternation WITHOUT polluting group(1) or findall() output.',
  },
  {
    id: 'compiled-flags',
    label: 're.compile & Flags',
    pattern: 're.compile(r"error:\\s+(\\w+)", re.IGNORECASE)',
    input: '"ERROR: Timeout"',
    extracted: [
      { key: 'm.group(1)', val: '"Timeout"' },
      { key: 'flags', val: 're.IGNORECASE (case-insensitive)' },
    ],
    note: 're.compile() pre-compiles a reusable Pattern object with flags like re.IGNORECASE (re.I) or re.MULTILINE (re.M).',
  },
];

export const RegexGroupsSim: React.FC = () => {
  const [modeId, setModeId] = useState<GroupMode['id']>('numbered');
  const active = MODES.find((m) => m.id === modeId) || MODES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Capturing Groups, Named Groups & Compiled Patterns" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">GROUPING MODE</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Regex Group Mode">
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
          {active.pattern}  # on {active.input}
        </pre>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {active.extracted.map((item) => (
            <div
              key={item.key}
              className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1"
            >
              <div className="font-mono text-xs font-bold text-[var(--text-main)]">{item.key}</div>
              <div className="font-mono text-xs text-emerald-400 break-all">{item.val}</div>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          <Brackets className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <span>{active.note}</span>
        </div>
      </div>
    </div>
  );
};
