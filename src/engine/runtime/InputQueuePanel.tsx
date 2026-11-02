/**
 * Input Queue Panel
 * Section 8.2: Supplies values for Python input() prompts prior to execution.
 */

import React, { useState } from 'react';
import { Plus, Trash2, ListOrdered, AlertCircle, CornerDownLeft } from 'lucide-react';
import { usePythonRuntime } from './runtimeContext';

export const InputQueuePanel: React.FC = () => {
  const { inputQueue, addInput, removeInput, clearInputQueue } = usePythonRuntime();
  const [newInputVal, setNewInputVal] = useState('');

  const handleAdd = () => {
    if (!newInputVal.trim()) return;
    addInput(newInputVal.trim());
    setNewInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-[var(--accent-primary)]" />
          <span className="font-bold text-[var(--text-main)]">input() Staged Queue</span>
        </div>
        {inputQueue.length > 0 && (
          <button
            onClick={clearInputQueue}
            className="text-[11px] text-[var(--text-dim)] hover:text-red-400"
          >
            Clear all
          </button>
        )}
      </div>

      <p className="text-[11px] text-[var(--text-muted)] font-sans leading-relaxed">
        Because browser workers cannot pause execution waiting for keyboard prompts, stage the responses your Python <code className="px-1 rounded bg-[var(--bg-app)] text-[var(--syntax-builtin)]">input()</code> statements will read:
      </p>

      {/* Input Entry Box */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="e.g. Alice or 25"
          value={newInputVal}
          onChange={(e) => setNewInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-dim)] focus:ring-1 focus:ring-[var(--accent-primary)]"
        />
        <button
          onClick={handleAdd}
          disabled={!newInputVal.trim()}
          className="px-3 py-1.5 rounded-xl bg-[var(--accent-primary)] text-[var(--accent-on)] text-xs font-bold disabled:opacity-50 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Stage</span>
        </button>
      </div>

      {/* Staged Items List */}
      {inputQueue.length === 0 ? (
        <div className="p-3 rounded-xl border border-dashed border-[var(--border-subtle)] text-center text-[11px] text-[var(--text-dim)] font-sans">
          Queue is empty. Python programs without <code className="text-[var(--accent-primary)]">input()</code> will run immediately.
        </div>
      ) : (
        <div className="space-y-1.5 pt-1">
          {inputQueue.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)]"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[var(--text-dim)] font-bold">
                  input() #{idx + 1}:
                </span>
                <span className="text-[var(--text-main)] font-semibold">"{item}"</span>
              </div>
              <button
                onClick={() => removeInput(idx)}
                className="text-[var(--text-dim)] hover:text-red-400 p-1"
                title="Remove entry"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
