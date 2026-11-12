/**
 * Cross-Platform Virtual Environment Creation & Activation Simulator
 * Section 14 (Day 23 Signature Simulation):
 * Visualizes python -m venv creation, OS-specific bin/ vs Scripts/ layouts,
 * activation commands, prompt prefix changes, and deactivation.
 */

import React, { useState } from 'react';
import { Terminal } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface PlatformSpec {
  id: 'unix' | 'powershell' | 'cmd';
  label: string;
  createCmd: string;
  activateCmd: string;
  deactivateCmd: string;
  pythonPath: string;
  binDir: string;
  promptPrefix: string;
  note: string;
}

const PLATFORMS: PlatformSpec[] = [
  {
    id: 'unix',
    label: 'macOS / Linux (bash/zsh)',
    createCmd: 'python3 -m venv .venv',
    activateCmd: 'source .venv/bin/activate',
    deactivateCmd: 'deactivate',
    pythonPath: '.venv/bin/python',
    binDir: '.venv/bin/',
    promptPrefix: '(.venv) dev@host:~/project$',
    note: 'POSIX systems place executables in .venv/bin/ and use the shell builtin `source` (or `.`) to modify PATH and VIRTUAL_ENV in the current shell.',
  },
  {
    id: 'powershell',
    label: 'Windows PowerShell',
    createCmd: 'python -m venv .venv',
    activateCmd: '.venv\\Scripts\\Activate.ps1',
    deactivateCmd: 'deactivate',
    pythonPath: '.venv\\Scripts\\python.exe',
    binDir: '.venv\\Scripts\\',
    promptPrefix: '(.venv) PS C:\\project>',
    note: 'Windows places executables in .venv\\Scripts\\. If PowerShell blocks scripts, run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once.',
  },
  {
    id: 'cmd',
    label: 'Windows Command Prompt',
    createCmd: 'python -m venv .venv',
    activateCmd: '.venv\\Scripts\\activate.bat',
    deactivateCmd: 'deactivate',
    pythonPath: '.venv\\Scripts\\python.exe',
    binDir: '.venv\\Scripts\\',
    promptPrefix: '(.venv) C:\\project>',
    note: 'Command Prompt runs activate.bat, prepending .venv\\Scripts to PATH so `python` and `pip` resolve to the isolated environment.',
  },
];

export const VenvActivationSim: React.FC = () => {
  const [platformId, setPlatformId] = useState<PlatformSpec['id']>('unix');
  const [isActive, setIsActive] = useState<boolean>(true);
  const active = PLATFORMS.find((p) => p.id === platformId) || PLATFORMS[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Cross-Platform venv Creation & Activation Lab" badge="simulation" />
      <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-5">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Target Shell Selector">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={platformId === p.id}
                  onClick={() => setPlatformId(p.id)}
                  className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                    platformId === p.id
                      ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                      : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              aria-pressed={isActive}
              onClick={() => setIsActive((v) => !v)}
              className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-subtle)]'
              }`}
            >
              {isActive ? 'State: Activated' : 'State: Deactivated'}
            </button>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
              <Terminal className="w-4 h-4" />
              <span>Shell Lifecycle Commands</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="text-[var(--text-muted)] font-semibold mb-1">1. Create</div>
                <div className="font-mono text-[var(--text-main)] break-all">{active.createCmd}</div>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="text-[var(--text-muted)] font-semibold mb-1">2. Activate</div>
                <div className="font-mono text-emerald-400 break-all">{active.activateCmd}</div>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="text-[var(--text-muted)] font-semibold mb-1">3. Deactivate</div>
                <div className="font-mono text-amber-300 break-all">{active.deactivateCmd}</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-[var(--border-subtle)] font-mono text-xs space-y-1.5">
              <div className="text-slate-400"># Terminal Prompt Preview</div>
              <div className="text-emerald-400">
                {isActive ? active.promptPrefix : active.promptPrefix.replace('(.venv) ', '')}{' '}
                <span className="text-slate-100">which python</span>
              </div>
              <div className="text-sky-300">
                {isActive ? active.pythonPath : '/usr/local/bin/python3 (Global)'}
              </div>
              <div className="text-slate-400">
                Executable Folder: <span className="text-slate-200">{active.binDir}</span> | pyvenv.cfg:{' '}
                <span className="text-slate-200">include-system-site-packages = false</span>
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{active.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
