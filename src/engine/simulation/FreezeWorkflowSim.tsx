/**
 * pip freeze & Reproducible requirements.txt Workflow Simulator
 * Section 14 (Day 23 Signature Simulation):
 * Visualizes pinning dependencies with pip freeze > requirements.txt,
 * excluding .venv/ in .gitignore, and reproducing exact builds in CI/CD.
 */

import React, { useState } from 'react';
import { PackageCheck } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface WorkflowStage {
  id: 'install' | 'freeze' | 'gitignore' | 'reproduce';
  label: string;
  command: string;
  artifactTitle: string;
  artifactContent: string;
  note: string;
}

const STAGES: WorkflowStage[] = [
  {
    id: 'install',
    label: '1. Install in .venv',
    command: 'pip install requests==2.32.3 beautifulsoup4==4.12.3',
    artifactTitle: 'Installed in .venv/lib/.../site-packages',
    artifactContent: `beautifulsoup4==4.12.3\ncertifi==2024.7.4\ncharset-normalizer==3.3.2\nidna==3.7\nrequests==2.32.3\nsoupsieve==2.5\nurllib3==2.2.2`,
    note: 'Installing 2 top-level packages also pulls in their transitive dependencies (urllib3, certifi, soupsieve) inside the isolated .venv.',
  },
  {
    id: 'freeze',
    label: '2. pip freeze',
    command: 'pip freeze > requirements.txt',
    artifactTitle: 'requirements.txt (Committed to Git)',
    artifactContent: `beautifulsoup4==4.12.3\ncertifi==2024.7.4\ncharset-normalizer==3.3.2\nidna==3.7\nrequests==2.32.3\nsoupsieve==2.5\nurllib3==2.2.2`,
    note: 'pip freeze outputs exact pinned versions (==) so teammates and production servers install the exact tested dependency graph.',
  },
  {
    id: 'gitignore',
    label: '3. .gitignore Hygiene',
    command: 'echo ".venv/" >> .gitignore',
    artifactTitle: '.gitignore (Never Commit .venv/)',
    artifactContent: `.venv/\nvenv/\n__pycache__/\n*.pyc\n.env`,
    note: 'Virtual environments contain OS-specific binaries and thousands of files. Commit requirements.txt to Git, never the .venv/ folder itself.',
  },
  {
    id: 'reproduce',
    label: '4. Reproduce on New Machine',
    command: 'python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt',
    artifactTitle: 'Fresh CI / Teammate Environment',
    artifactContent: `Collecting requests==2.32.3\nCollecting beautifulsoup4==4.12.3\n...\nSuccessfully installed 7 packages (exact match!)`,
    note: 'Any teammate or CI runner can recreate your exact environment from scratch in seconds using requirements.txt.',
  },
];

export const FreezeWorkflowSim: React.FC = () => {
  const [stageId, setStageId] = useState<WorkflowStage['id']>('freeze');
  const active = STAGES.find((s) => s.id === stageId) || STAGES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="pip freeze & Reproducible Environment Workflow" badge="simulation" />
      <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-5">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Reproducibility Workflow Stage">
            {STAGES.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={stageId === s.id}
                onClick={() => setStageId(s.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                  stageId === s.id
                    ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                    : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
              <PackageCheck className="w-4 h-4" />
              <span>Stage Command &amp; Output</span>
            </div>

            <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-xs text-emerald-400">
              $ {active.command}
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-[var(--border-subtle)] space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {active.artifactTitle}
              </div>
              <pre className="font-mono text-xs text-slate-100 whitespace-pre-wrap">{active.artifactContent}</pre>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{active.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
