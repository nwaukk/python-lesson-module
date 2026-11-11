/**
 * File Cursor & Context Manager Simulator (read, tell, seek, with)
 * Section 14 (Day 19 Signature Simulation):
 * Visualizes cursor movement across read(), EOF exhaustion, seek(0) rewind,
 * and automatic close() via `with` context managers.
 */

import React, { useState } from 'react';
import { MoveRight } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface CursorStep {
  id: 'open' | 'read-all' | 'read-eof' | 'seek-0' | 'exit-with';
  label: string;
  call: string;
  cursorPos: number;
  returned: string;
  closed: boolean;
  note: string;
}

const STEPS: CursorStep[] = [
  {
    id: 'open',
    label: '1. Enter with open()',
    call: 'with open("log.txt", "r", encoding="utf-8") as f:',
    cursorPos: 0,
    returned: 'File handle open; f.tell() == 0',
    closed: false,
    note: 'The context manager opens the file and positions the read cursor at byte 0.',
  },
  {
    id: 'read-all',
    label: '2. f.read()',
    call: 'first = f.read()  # file has "ABC\\nDEF"',
    cursorPos: 7,
    returned: '"ABC\\nDEF" (7 chars read)',
    closed: false,
    note: 'f.read() consumes everything up to EOF, advancing f.tell() to byte 7.',
  },
  {
    id: 'read-eof',
    label: '3. Second f.read()',
    call: 'second = f.read()',
    cursorPos: 7,
    returned: '"" (empty string at EOF!)',
    closed: false,
    note: 'Because the cursor is already at EOF, a second f.read() returns "" instead of re-reading from the top.',
  },
  {
    id: 'seek-0',
    label: '4. f.seek(0)',
    call: 'f.seek(0); f.readline()',
    cursorPos: 4,
    returned: '"ABC\\n" (cursor rewound to 0, then read line 1)',
    closed: false,
    note: 'f.seek(0) rewinds the cursor back to byte 0 so you can read again.',
  },
  {
    id: 'exit-with',
    label: '5. Exit with block',
    call: '# Indented block ends (even if an exception occurred)',
    cursorPos: 4,
    returned: 'f.closed == True',
    closed: true,
    note: 'Python automatically calls f.close() when leaving the with block, preventing file-descriptor leaks.',
  },
];

export const FileCursorSim: React.FC = () => {
  const [stepId, setStepId] = useState<CursorStep['id']>('open');
  const active = STEPS.find((s) => s.id === stepId) || STEPS[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="File Cursor (tell / seek) & with Context Manager Lab" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">EXECUTION STEP</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="File Cursor Step Selector">
            {STEPS.map((st) => (
              <button
                key={st.id}
                type="button"
                aria-pressed={stepId === st.id}
                onClick={() => setStepId(st.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                  stepId === st.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        <pre className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--accent-primary)] overflow-x-auto">
          {active.call}
        </pre>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
            <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">f.tell() CURSOR</div>
            <div className="font-mono text-sm font-bold text-[var(--accent-primary)]">Byte {active.cursorPos} / 7</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
            <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">RESULT</div>
            <div className="font-mono text-xs text-[var(--text-main)] break-all">{active.returned}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
            <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">HANDLE STATE</div>
            <div className={`font-mono text-xs font-bold ${active.closed ? 'text-[var(--accent-primary)]' : 'text-[var(--text-main)]'}`}>
              {active.closed ? 'CLOSED (auto-cleaned)' : 'OPEN'}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          <MoveRight className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <span>{active.note}</span>
        </div>
      </div>
    </div>
  );
};
