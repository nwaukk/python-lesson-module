/**
 * Semantic Versioning & Version Specifier Resolver Simulator
 * Section 14 (Day 20 Signature Simulation):
 * Visualizes SemVer (MAJOR.MINOR.PATCH) and pip version specifiers (==, >=, ~=, <).
 */

import React, { useState } from 'react';
import { GitBranch } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface SpecifierCase {
  id: 'exact' | 'compatible' | 'bounded' | 'unpinned';
  label: string;
  spec: string;
  matches: string[];
  rejected: string[];
  note: string;
}

const CASES: SpecifierCase[] = [
  {
    id: 'exact',
    label: '==2.31.0 (Exact Pin)',
    spec: 'requests==2.31.0',
    matches: ['2.31.0'],
    rejected: ['2.30.0', '2.31.1', '2.32.3', '3.0.0'],
    note: 'Exact pinning (`==`) guarantees identical builds in production and CI, as produced by `pip freeze`.',
  },
  {
    id: 'compatible',
    label: '~=2.31.0 (Compatible)',
    spec: 'requests~=2.31.0',
    matches: ['2.31.0', '2.31.1'],
    rejected: ['2.30.0', '2.32.3', '3.0.0'],
    note: 'Compatible release (`~=2.31.0`) is equivalent to `>=2.31.0, ==2.31.*`—allows patch fixes without minor/major jumps.',
  },
  {
    id: 'bounded',
    label: '>=2.31,<3.0 (Range)',
    spec: 'requests>=2.31.0,<3.0.0',
    matches: ['2.31.0', '2.31.1', '2.32.3'],
    rejected: ['2.30.0', '3.0.0'],
    note: 'Upper-bounded ranges allow minor feature updates and bugfixes while blocking breaking MAJOR (3.0.0) upgrades.',
  },
  {
    id: 'unpinned',
    label: 'requests (Unpinned)',
    spec: 'requests',
    matches: ['2.30.0', '2.31.0', '2.31.1', '2.32.3', '3.0.0'],
    rejected: [],
    note: 'Unpinned names install whatever is latest on PyPI today—risky for production apps if a breaking MAJOR release ships tomorrow.',
  },
];

export const SemverResolverSim: React.FC = () => {
  const [caseId, setCaseId] = useState<SpecifierCase['id']>('compatible');
  const active = CASES.find((c) => c.id === caseId) || CASES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="SemVer (MAJOR.MINOR.PATCH) & Specifier Resolver" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">REQUIREMENT SPEC</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Version Specifier Selector">
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
          # requirements.txt{'\n'}{active.spec}
        </pre>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">MATCHING CANDIDATES</div>
            <div className="flex flex-wrap gap-1.5">
              {active.matches.map((v) => (
                <span key={v} className="px-2 py-1 rounded-md border border-[var(--accent-primary)] bg-[var(--accent-subtle)] font-mono text-xs font-bold text-[var(--accent-primary)]">
                  {v}
                </span>
              ))}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">EXCLUDED VERSIONS</div>
            <div className="flex flex-wrap gap-1.5">
              {active.rejected.length > 0 ? (
                active.rejected.map((v) => (
                  <span key={v} className="px-2 py-1 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-app)] font-mono text-xs text-[var(--text-muted)] line-through">
                    {v}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[var(--text-muted)]">None excluded (any version allowed)</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          <GitBranch className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <span>{active.note}</span>
        </div>
      </div>
    </div>
  );
};
