/**
 * PyPI & pip Lifecycle Simulator
 * Section 14 (Day 20 Signature Simulation):
 * Visualizes pip install, upgrade, uninstall, list, show, freeze,
 * and virtual environment isolation effects.
 */

import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface PipCommandSpec {
  id: 'install' | 'upgrade' | 'freeze' | 'show' | 'uninstall' | 'venv';
  label: string;
  command: string;
  effect: string;
  target: string;
  output: string;
  note: string;
}

const COMMANDS: PipCommandSpec[] = [
  {
    id: 'install',
    label: 'pip install',
    command: 'python -m pip install requests==2.32.3',
    effect: 'Downloads wheel from PyPI + transitive deps (urllib3, certifi, idna, charset-normalizer)',
    target: '.venv/lib/python3.12/site-packages/',
    output: 'Successfully installed certifi-2024.8.30 charset-normalizer-3.4.0 idna-3.10 requests-2.32.3 urllib3-2.2.3',
    note: 'Using `python -m pip` guarantees you install into the active Python interpreter rather than a mismatched global pip.',
  },
  {
    id: 'upgrade',
    label: 'pip install -U',
    command: 'python -m pip install --upgrade requests',
    effect: 'Resolves latest compatible version on PyPI and replaces older installed wheel',
    target: '.venv/lib/python3.12/site-packages/',
    output: 'Attempting uninstall: requests-2.31.0 -> Successfully installed requests-2.32.3',
    note: 'Without `--upgrade` (`-U`), `pip install pkg` exits early if any version of `pkg` is already satisfied.',
  },
  {
    id: 'freeze',
    label: 'pip freeze',
    command: 'python -m pip freeze > requirements.txt',
    effect: 'Exports exact pinned versions (`pkg==x.y.z`) of all installed packages',
    target: 'requirements.txt (project root)',
    output: 'certifi==2024.8.30\ncharset-normalizer==3.4.0\nidna==3.10\nrequests==2.32.3\nurllib3==2.2.3',
    note: 'Commit `requirements.txt` to Git so teammates and CI/CD reproduce the exact same dependency tree.',
  },
  {
    id: 'show',
    label: 'pip show',
    command: 'python -m pip show requests',
    effect: 'Inspects installed metadata: Version, License, Location, and Requires/Required-by',
    target: 'Read-only metadata query',
    output: 'Name: requests\nVersion: 2.32.3\nSummary: Python HTTP for Humans.\nRequires: certifi, charset-normalizer, idna, urllib3',
    note: 'Useful for auditing licenses, checking install paths, and tracing why a transitive dependency is present.',
  },
  {
    id: 'uninstall',
    label: 'pip uninstall',
    command: 'python -m pip uninstall -y requests',
    effect: 'Removes `requests` from site-packages (leaves shared transitive deps intact)',
    target: '.venv/lib/python3.12/site-packages/',
    output: 'Successfully uninstalled requests-2.32.3',
    note: '`pip uninstall` only removes the named package; unused transitive dependencies stay unless removed explicitly.',
  },
  {
    id: 'venv',
    label: 'python -m venv',
    command: 'python -m venv .venv && source .venv/bin/activate',
    effect: 'Creates an isolated Python environment with its own site-packages directory',
    target: './.venv/ (local project directory)',
    output: '(.venv) $ which python -> /project/.venv/bin/python',
    note: 'Always activate a virtual environment per project so Project A (Django 4) and Project B (Django 5) never collide.',
  },
];

export const PipLifecycleSim: React.FC = () => {
  const [cmdId, setCmdId] = useState<PipCommandSpec['id']>('install');
  const active = COMMANDS.find((c) => c.id === cmdId) || COMMANDS[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="PyPI, pip & Virtual Environment Lifecycle" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">PIP COMMAND</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Pip Command Selector">
            {COMMANDS.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={cmdId === c.id}
                onClick={() => setCmdId(c.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                  cmdId === c.id
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
          $ {active.command}
        </pre>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
            <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">ENVIRONMENT EFFECT</div>
            <div className="text-xs font-semibold text-[var(--text-main)]">{active.effect}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
            <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">TARGET LOCATION</div>
            <div className="font-mono text-xs text-[var(--accent-primary)] break-all">{active.target}</div>
          </div>
        </div>

        <pre className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-main)] overflow-x-auto">
          {active.output}
        </pre>

        <div className="flex items-start gap-2 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          <Package className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <span>{active.note}</span>
        </div>
      </div>
    </div>
  );
};
