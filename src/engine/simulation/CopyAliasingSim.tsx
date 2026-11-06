/**
 * Shallow Copy vs Deep Copy & Aliasing Inspector
 * Visualizes the #1 pitfall in Python data structures:
 * 1. Assignment Aliasing (b = a) -> Shared pointer
 * 2. Shallow Copy (b = a.copy()) -> New outer list, shared nested objects
 * 3. Deep Copy (b = copy.deepcopy(a)) -> Fully recursive clones
 */

import React, { useState } from 'react';
import { SimulationController } from './SimulationController';
import { Copy, GitFork, AlertCircle, CheckCircle2, RotateCcw, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

type CopyMode = 'aliasing' | 'shallow' | 'deep';

export const CopyAliasingSim: React.FC = () => {
  const [mode, setMode] = useState<CopyMode>('aliasing');

  // Memory structures for list A and list B
  const [listA, setListA] = useState<{ id: string; items: any[]; innerId: string }>({
    id: '0x7fa100',
    items: ['Alpha', 'Beta', [10, 20]],
    innerId: '0x7fa999',
  });

  const [listB, setListB] = useState<{ id: string; items: any[]; innerId: string }>({
    id: '0x7fa100', // initially aliasing
    items: ['Alpha', 'Beta', [10, 20]],
    innerId: '0x7fa999',
  });

  const [actionLog, setActionLog] = useState<string>('Select an operation mode to inspect pointer bindings.');

  // Set mode handler
  const handleSelectMode = (newMode: CopyMode) => {
    setMode(newMode);
    const initialItems = ['Alpha', 'Beta', [10, 20]];
    const baseInnerId = '0x7fa999';

    if (newMode === 'aliasing') {
      setListA({ id: '0x7fa100', items: initialItems, innerId: baseInnerId });
      setListB({ id: '0x7fa100', items: initialItems, innerId: baseInnerId });
      setActionLog('Mode: b = a. Both variables bind to the exact same PyListObject (0x7fa100).');
    } else if (newMode === 'shallow') {
      setListA({ id: '0x7fa100', items: initialItems, innerId: baseInnerId });
      setListB({ id: '0x7fb200', items: ['Alpha', 'Beta', initialItems[2]], innerId: baseInnerId });
      setActionLog('Mode: b = a.copy(). b is a new outer list (0x7fb200), but nested list (0x7fa999) is SHARED!');
    } else {
      setListA({ id: '0x7fa100', items: initialItems, innerId: baseInnerId });
      setListB({ id: '0x7fb200', items: ['Alpha', 'Beta', [10, 20]], innerId: '0x7fc888' });
      setActionLog('Mode: b = copy.deepcopy(a). Both outer list and nested list are completely independent clones!');
    }
  };

  const handleMutateOuterB = () => {
    const val = `'Item_${Math.floor(Math.random() * 90 + 10)}'`;
    if (mode === 'aliasing') {
      const updated = [...listA.items, val];
      setListA({ ...listA, items: updated });
      setListB({ ...listB, items: updated });
      setActionLog(`b.append(${val}) was called. Because b IS a, list A was ALSO mutated in-place!`);
    } else {
      const updatedB = [...listB.items, val];
      setListB({ ...listB, items: updatedB });
      setActionLog(`b.append(${val}) was called. b has a separate outer buffer, so list A remains completely untouched!`);
    }
  };

  const handleMutateInnerB = () => {
    const num = Math.floor(Math.random() * 90 + 10);
    if (mode === 'aliasing' || mode === 'shallow') {
      const newInner = [...listA.items[2], num];
      const updatedA = [listA.items[0], listA.items[1], newInner];
      const updatedB = [listB.items[0], listB.items[1], newInner];
      setListA({ ...listA, items: updatedA });
      setListB({ ...listB, items: updatedB });
      setActionLog(
        `b[2].append(${num}) called on nested list! Because nested list (0x7fa999) is shared in ${mode} mode, list A was mutated as well!`
      );
    } else {
      // deep copy
      const newInnerB = [...listB.items[2], num];
      const updatedB = [listB.items[0], listB.items[1], newInnerB];
      setListB({ ...listB, items: updatedB });
      setActionLog(`b[2].append(${num}) called on nested list. Because deepcopy cloned the inner list, list A is 100% PROTECTED!`);
    }
  };

  const handleReset = () => {
    handleSelectMode(mode);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Copy vs Aliasing Inspector: Shallow Copy, Deep Copy & Reference Traps"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 max-w-5xl mx-auto w-full">
        {/* Mode Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => handleSelectMode('aliasing')}
            className={`p-3 rounded-xl border text-left transition-all ${
              mode === 'aliasing'
                ? 'border-red-500/50 bg-red-500/10 shadow-xs'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-red-500/30'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold text-red-300 mb-1">
              <span>1. Aliasing (b = a)</span>
              <span className="text-[10px] text-red-400">SHARED ID</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Two variable names binding to the same list pointer. Zero copying occurs.
            </p>
          </button>

          <button
            onClick={() => handleSelectMode('shallow')}
            className={`p-3 rounded-xl border text-left transition-all ${
              mode === 'shallow'
                ? 'border-amber-500/50 bg-amber-500/10 shadow-xs'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-amber-500/30'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-300 mb-1">
              <span>2. Shallow Copy (b = a.copy())</span>
              <span className="text-[10px] text-amber-400">PARTIAL</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Clones outer list, but nested lists still share memory pointers.
            </p>
          </button>

          <button
            onClick={() => handleSelectMode('deep')}
            className={`p-3 rounded-xl border text-left transition-all ${
              mode === 'deep'
                ? 'border-emerald-500/50 bg-emerald-500/10 shadow-xs'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-emerald-500/30'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-300 mb-1">
              <span>3. Deep Copy (copy.deepcopy(a))</span>
              <span className="text-[10px] text-emerald-400">INDEPENDENT</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Recursively clones outer list and all nested containers. 100% isolated.
            </p>
          </button>
        </div>

        {/* Visual Memory Representation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* List A Card */}
          <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--text-main)] font-mono flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[var(--accent-primary)] inline-block"></span>
                <span>Original Variable:</span>
                <code className="text-[var(--accent-primary)] font-bold">a</code>
              </span>
              <span className="font-mono text-[11px] text-[var(--text-dim)]">
                id(a): {listA.id}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-2">
              <div className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider font-semibold">
                Outer List Elements (len = {listA.items.length})
              </div>
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)]">
                  [0] '{listA.items[0]}'
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)]">
                  [1] '{listA.items[1]}'
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent-primary)] text-[var(--accent-primary)] font-bold flex items-center gap-1">
                  [2] [{listA.items[2].join(', ')}]
                  <span className="text-[9px] opacity-75">({listA.innerId})</span>
                </span>
                {listA.items.slice(3).map((it, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold"
                  >
                    [{3 + idx}] {it}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* List B Card */}
          <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--text-main)] font-mono flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-sky-400 inline-block"></span>
                <span>Target Variable:</span>
                <code className="text-sky-300 font-bold">b</code>
              </span>
              <span className="font-mono text-[11px] text-[var(--text-dim)]">
                id(b): {listB.id}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-2">
              <div className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider font-semibold">
                Outer List Elements (len = {listB.items.length})
              </div>
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)]">
                  [0] '{listB.items[0]}'
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)]">
                  [1] '{listB.items[1]}'
                </span>
                <span
                  className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1 ${
                    listA.innerId === listB.innerId
                      ? 'bg-red-500/15 border-red-500/40 text-red-300'
                      : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  [2] [{listB.items[2].join(', ')}]
                  <span className="text-[9px] opacity-75">({listB.innerId})</span>
                </span>
                {listB.items.slice(3).map((it, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-300 font-bold"
                  >
                    [{3 + idx}] {it}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mutation Action Triggers */}
        <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3">
          <div className="text-xs font-bold text-[var(--text-main)] flex items-center justify-between">
            <span>Test Mutating Variable 'b'</span>
            <span className="text-[11px] text-[var(--text-dim)]">Observe if variable 'a' is affected:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleMutateOuterB}
              className="px-3.5 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] text-xs font-bold transition-colors shadow-xs"
            >
              Mutate Outer: b.append('NEW')
            </button>

            <button
              onClick={handleMutateInnerB}
              className="px-3.5 py-2 rounded-xl border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-bold transition-colors"
            >
              Mutate Inner: b[2].append(99)
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] text-xs text-[var(--text-muted)] transition-colors ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>

        {/* Action Log & Explanatory Callout */}
        <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
          <div className="text-xs font-bold text-[var(--text-main)] flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Inspector Diagnostic Output:</span>
          </div>
          <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-main)] leading-relaxed">
            {actionLog}
          </div>
        </div>
      </div>
    </div>
  );
};
