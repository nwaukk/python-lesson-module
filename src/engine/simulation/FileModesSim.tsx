/**
 * File Open Modes Simulator (r, w, a, x, b)
 * Section 14 (Day 19 Signature Simulation):
 * Visualizes file open modes, truncation behavior, cursor start position,
 * and missing/existing file errors.
 */

import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface FileModeSpec {
  id: 'r' | 'w' | 'a' | 'x' | 'rb';
  label: string;
  syntax: string;
  ifExists: string;
  ifMissing: string;
  cursorStart: string;
  note: string;
}

const MODES: FileModeSpec[] = [
  {
    id: 'r',
    label: "'r' (Read)",
    syntax: 'open("data.txt", "r", encoding="utf-8")',
    ifExists: 'Opens for reading; content preserved',
    ifMissing: 'Raises FileNotFoundError',
    cursorStart: 'Byte 0 (start of file)',
    note: 'Default mode when mode is omitted. Always specify encoding="utf-8" for cross-platform text files.',
  },
  {
    id: 'w',
    label: "'w' (Write)",
    syntax: 'open("data.txt", "w", encoding="utf-8")',
    ifExists: 'TRUNCATES file to 0 bytes immediately!',
    ifMissing: 'Creates a new empty file',
    cursorStart: 'Byte 0 (after truncating)',
    note: 'Caution: opening an existing file in "w" mode erases all previous content before you even call .write().',
  },
  {
    id: 'a',
    label: "'a' (Append)",
    syntax: 'open("data.txt", "a", encoding="utf-8")',
    ifExists: 'Preserves existing content; writes at end',
    ifMissing: 'Creates a new empty file',
    cursorStart: 'End of file (EOF)',
    note: 'Ideal for logs and audit trails because existing records are never overwritten.',
  },
  {
    id: 'x',
    label: "'x' (Exclusive Create)",
    syntax: 'open("data.txt", "x", encoding="utf-8")',
    ifExists: 'Raises FileExistsError (safe guard!)',
    ifMissing: 'Creates a new empty file for writing',
    cursorStart: 'Byte 0',
    note: 'Prevents accidental overwrites when generating unique exports or lock files.',
  },
  {
    id: 'rb',
    label: "'rb' (Read Binary)",
    syntax: 'open("image.png", "rb")',
    ifExists: 'Reads raw bytes (no encoding/newline translation)',
    ifMissing: 'Raises FileNotFoundError',
    cursorStart: 'Byte 0',
    note: 'Never pass encoding= to binary modes ("rb", "wb")—doing so raises ValueError.',
  },
];

export const FileModesSim: React.FC = () => {
  const [modeId, setModeId] = useState<FileModeSpec['id']>('r');
  const active = MODES.find((m) => m.id === modeId) || MODES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="File Open Modes (r / w / a / x / rb) Inspector" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">OPEN MODE</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="File Open Mode Selector">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={modeId === m.id}
                onClick={() => setModeId(m.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
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
          {active.syntax}
        </pre>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
            <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">IF FILE EXISTS</div>
            <div className={`text-xs font-semibold ${modeId === 'w' || modeId === 'x' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-main)]'}`}>
              {active.ifExists}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
            <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">IF FILE MISSING</div>
            <div className="text-xs font-semibold text-[var(--text-main)]">{active.ifMissing}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
            <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">CURSOR START</div>
            <div className="text-xs font-mono text-[var(--accent-primary)]">{active.cursorStart}</div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          <FileText className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <span>{active.note}</span>
        </div>
      </div>
    </div>
  );
};
