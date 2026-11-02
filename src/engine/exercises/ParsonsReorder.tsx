/**
 * Parsons Problem: Line Reordering Component
 * Section 10.2: Drag-and-drop & keyboard accessible line-ordering exercise.
 */

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, CheckCircle2, XCircle, RotateCcw, Sparkles } from 'lucide-react';
import { LineOrderBlock } from './types';

interface Props {
  initialLines: LineOrderBlock[];
  correctOrder: string[];
  onComplete: (isCorrect: boolean) => void;
}

export const ParsonsReorder: React.FC<Props> = ({ initialLines, correctOrder, onComplete }) => {
  const [lines, setLines] = useState<LineOrderBlock[]>(initialLines);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const moveLine = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === lines.length - 1) return;

    const newLines = [...lines];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newLines[index];
    newLines[index] = newLines[targetIdx];
    newLines[targetIdx] = temp;
    setLines(newLines);
    setChecked(false);
  };

  const handleVerify = () => {
    const currentOrder = lines.map((l) => l.id);
    const passed = currentOrder.every((id, idx) => id === correctOrder[idx]);
    setIsCorrect(passed);
    setChecked(true);
    onComplete(passed);
  };

  const handleReset = () => {
    setLines(initialLines);
    setChecked(false);
    setIsCorrect(false);
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="text-[11px] font-sans text-[var(--text-dim)]">
        Re-order the Python lines into the correct execution sequence using the up/down buttons:
      </div>

      <div className="space-y-2">
        {lines.map((line, idx) => (
          <div
            key={line.id}
            className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] flex items-center justify-between gap-3 shadow-xs hover:border-[var(--border-strong)] transition-all"
            style={{ paddingLeft: `${line.indent * 16 + 12}px` }}
          >
            <div className="flex items-center gap-2 text-[var(--text-main)] font-mono">
              <span className="text-[10px] text-[var(--text-dim)] w-4 text-center">{idx + 1}</span>
              <span>{line.code}</span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => moveLine(idx, 'up')}
                disabled={idx === 0}
                className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-30"
                title="Move up"
                aria-label={`Move line ${idx + 1} up`}
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => moveLine(idx, 'down')}
                disabled={idx === lines.length - 1}
                className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-30"
                title="Move down"
                aria-label={`Move line ${idx + 1} down`}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Order</span>
        </button>

        <button
          onClick={handleVerify}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] text-xs font-bold shadow-md transition-colors"
        >
          <span>Verify Order</span>
        </button>
      </div>

      {checked && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2.5 font-sans ${
            isCorrect
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-amber-500/30 bg-amber-500/10 text-amber-200'
          }`}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <span className="text-xs">
            {isCorrect
              ? 'Excellent! The Python statements are arranged in logical execution order.'
              : 'Order is not quite right yet. Remember to initialize variables before referencing them in statements.'}
          </span>
        </div>
      )}
    </div>
  );
};
