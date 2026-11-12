/**
 * Virtual Environment Isolation & sys.prefix Inspector Simulator
 * Section 14 (Day 23 Signature Simulation):
 * Visualizes how virtual environments isolate sys.prefix, site-packages, and
 * dependency versions between projects without polluting Global Python.
 */

import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface EnvProfile {
  id: 'global' | 'proj-a' | 'proj-b';
  label: string;
  sysPrefix: string;
  sysBasePrefix: string;
  isVenv: boolean;
  sitePackages: string;
  installedPackages: string[];
  note: string;
}

const PROFILES: EnvProfile[] = [
  {
    id: 'global',
    label: 'Global System Python',
    sysPrefix: '/usr/local/python3.12',
    sysBasePrefix: '/usr/local/python3.12',
    isVenv: false,
    sitePackages: '/usr/local/python3.12/lib/python3.12/site-packages',
    installedPackages: ['pip==24.0', 'setuptools==69.0.3'],
    note: 'When sys.prefix == sys.base_prefix, no virtual environment is active. Installing project packages here risks version conflicts across unrelated apps.',
  },
  {
    id: 'proj-a',
    label: 'Project A (.venv)',
    sysPrefix: '/home/dev/legacy-billing/.venv',
    sysBasePrefix: '/usr/local/python3.12',
    isVenv: true,
    sitePackages: '/home/dev/legacy-billing/.venv/lib/python3.12/site-packages',
    installedPackages: ['requests==2.28.1', 'flask==2.2.5', 'urllib3==1.26.18'],
    note: 'Project A runs legacy Flask 2.2 + requests 2.28.1 inside its own .venv folder. sys.prefix != sys.base_prefix confirms isolation is active.',
  },
  {
    id: 'proj-b',
    label: 'Project B (.venv)',
    sysPrefix: '/home/dev/ai-scraper/.venv',
    sysBasePrefix: '/usr/local/python3.12',
    isVenv: true,
    sitePackages: '/home/dev/ai-scraper/.venv/lib/python3.12/site-packages',
    installedPackages: ['requests==2.32.3', 'beautifulsoup4==4.12.3', 'urllib3==2.2.2'],
    note: 'Project B uses modern requests 2.32.3 + urllib3 2.2.2 simultaneously on the same machine without breaking Project A.',
  },
];

export const VenvIsolationSim: React.FC = () => {
  const [profileId, setProfileId] = useState<EnvProfile['id']>('proj-a');
  const active = PROFILES.find((p) => p.id === profileId) || PROFILES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Virtual Environment & sys.prefix Isolation Inspector" badge="simulation" />
      <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-5">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Environment Profile Selector">
            {PROFILES.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={profileId === p.id}
                onClick={() => setProfileId(p.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                  profileId === p.id
                    ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                    : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                <Layers className="w-4 h-4" />
                <span>Runtime Interpreter State</span>
              </div>
              <span
                className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold border ${
                  active.isVenv
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                }`}
              >
                {active.isVenv ? 'ISOLATED VENV ACTIVE' : 'GLOBAL INTERPRETER'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="text-[var(--text-muted)] font-semibold mb-1">sys.prefix</div>
                <div className="font-mono text-[var(--text-main)] break-all">{active.sysPrefix}</div>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="text-[var(--text-muted)] font-semibold mb-1">sys.base_prefix</div>
                <div className="font-mono text-[var(--text-main)] break-all">{active.sysBasePrefix}</div>
              </div>
              <div className="sm:col-span-2 p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="text-[var(--text-muted)] font-semibold mb-1">Active site-packages Directory</div>
                <div className="font-mono text-emerald-400 break-all">{active.sitePackages}</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2">
              <div className="text-xs font-semibold text-[var(--text-muted)]">Isolated Packages Visible to import</div>
              <div className="flex flex-wrap gap-2">
                {active.installedPackages.map((pkg) => (
                  <span
                    key={pkg}
                    className="px-2.5 py-1 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-main)]"
                  >
                    {pkg}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{active.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
