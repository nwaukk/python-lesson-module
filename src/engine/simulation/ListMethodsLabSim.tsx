/**
 * Python List Methods Laboratory Simulation
 * Interactive simulator for 11 core list methods:
 * append, extend, insert, remove, pop, clear, index, count, sort, reverse, and copy.
 * Emphasizes the critical "In-Place Mutation returning None" trap vs pure functions.
 */

import React, { useState } from 'react';
import { SimulationController } from './SimulationController';
import { Play, RotateCcw, AlertTriangle, Check, Layers, ArrowRight, CornerDownRight } from 'lucide-react';

interface MethodDef {
  name: string;
  signature: string;
  mutates: boolean;
  returns: string;
  defaultArg?: string;
  description: string;
  isNoneTrap?: boolean;
}

const METHODS: MethodDef[] = [
  {
    name: 'sort',
    signature: 'lst.sort(reverse=False)',
    mutates: true,
    returns: 'None',
    description: 'Sorts elements in-place using Timsort algorithm. Does NOT return the list!',
    isNoneTrap: true,
  },
  {
    name: 'reverse',
    signature: 'lst.reverse()',
    mutates: true,
    returns: 'None',
    description: 'Reverses list elements in-place. Does NOT return the list!',
    isNoneTrap: true,
  },
  {
    name: 'append',
    signature: "lst.append('Kano')",
    mutates: true,
    returns: 'None',
    defaultArg: "'Kano'",
    description: 'Adds a single element to the end of the list in O(1) amortized time.',
    isNoneTrap: true,
  },
  {
    name: 'extend',
    signature: "lst.extend(['Enugu', 'Jos'])",
    mutates: true,
    returns: 'None',
    defaultArg: "['Enugu', 'Jos']",
    description: 'Iterates through an iterable and appends each element to the list in-place.',
    isNoneTrap: true,
  },
  {
    name: 'insert',
    signature: "lst.insert(1, 'Ibadan')",
    mutates: true,
    returns: 'None',
    defaultArg: "1, 'Ibadan'",
    description: 'Inserts an item before the specified index in O(N) time.',
    isNoneTrap: true,
  },
  {
    name: 'pop',
    signature: 'lst.pop()',
    mutates: true,
    returns: 'Popped Item (e.g. "Abuja")',
    description: 'Removes and returns the item at index (defaults to last item -1).',
  },
  {
    name: 'remove',
    signature: "lst.remove('Lagos')",
    mutates: true,
    returns: 'None',
    defaultArg: "'Lagos'",
    description: 'Searches for and removes the first matching item. Raises ValueError if absent.',
    isNoneTrap: true,
  },
  {
    name: 'count',
    signature: "lst.count('Lagos')",
    mutates: false,
    returns: 'Integer Count (e.g. 1)',
    defaultArg: "'Lagos'",
    description: 'Returns the frequency of the specified value. Never mutates list.',
  },
  {
    name: 'index',
    signature: "lst.index('Abuja')",
    mutates: false,
    returns: 'Integer Index (e.g. 1)',
    defaultArg: "'Abuja'",
    description: 'Returns the zero-based index of the first occurrence. Raises ValueError if absent.',
  },
  {
    name: 'copy',
    signature: 'lst.copy()',
    mutates: false,
    returns: 'New List [..]',
    description: 'Creates and returns a new shallow copy of the list (equivalent to lst[:]).',
  },
  {
    name: 'clear',
    signature: 'lst.clear()',
    mutates: true,
    returns: 'None',
    description: 'Removes all elements, resetting length to 0 in-place.',
    isNoneTrap: true,
  },
];

const INITIAL_LIST = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Lagos'];

export const ListMethodsLabSim: React.FC = () => {
  const [list, setList] = useState<string[]>([...INITIAL_LIST]);
  const [activeMethodName, setActiveMethodName] = useState<string>('sort');
  const [customArg, setCustomArg] = useState<string>('');
  const [lastCallResult, setLastCallResult] = useState<{
    call: string;
    mutated: boolean;
    returned: string;
    isTrap: boolean;
    before: string[];
    after: string[];
    error?: string;
  } | null>(null);

  const activeMethod = METHODS.find((m) => m.name === activeMethodName) || METHODS[0];

  const handleExecute = () => {
    const beforeState = [...list];
    let afterState = [...list];
    let returnValue = 'None';
    let errorMessage: string | undefined = undefined;

    switch (activeMethod.name) {
      case 'sort':
        afterState.sort();
        returnValue = 'None';
        break;
      case 'reverse':
        afterState.reverse();
        returnValue = 'None';
        break;
      case 'append': {
        const itemToAdd = customArg.trim() || 'Kano';
        afterState.push(itemToAdd.replace(/^['"]|['"]$/g, ''));
        returnValue = 'None';
        break;
      }
      case 'extend': {
        afterState.push('Enugu', 'Jos');
        returnValue = 'None';
        break;
      }
      case 'insert': {
        afterState.splice(1, 0, 'Kaduna');
        returnValue = 'None';
        break;
      }
      case 'pop': {
        if (afterState.length === 0) {
          errorMessage = 'IndexError: pop from empty list';
          returnValue = 'Exception Raised';
        } else {
          const popped = afterState.pop();
          returnValue = `'${popped}'`;
        }
        break;
      }
      case 'remove': {
        const target = (customArg.trim() || 'Lagos').replace(/^['"]|['"]$/g, '');
        const idx = afterState.indexOf(target);
        if (idx === -1) {
          errorMessage = `ValueError: list.remove(x): x not in list ('${target}')`;
          returnValue = 'Exception Raised';
        } else {
          afterState.splice(idx, 1);
          returnValue = 'None';
        }
        break;
      }
      case 'count': {
        const target = (customArg.trim() || 'Lagos').replace(/^['"]|['"]$/g, '');
        const count = afterState.filter((x) => x === target).length;
        returnValue = String(count);
        break;
      }
      case 'index': {
        const target = (customArg.trim() || 'Abuja').replace(/^['"]|['"]$/g, '');
        const idx = afterState.indexOf(target);
        if (idx === -1) {
          errorMessage = `ValueError: '${target}' is not in list`;
          returnValue = 'Exception Raised';
        } else {
          returnValue = String(idx);
        }
        break;
      }
      case 'copy':
        returnValue = `['${afterState.join("', '")}']`;
        break;
      case 'clear':
        afterState = [];
        returnValue = 'None';
        break;
    }

    if (!errorMessage) {
      setList(afterState);
    }

    setLastCallResult({
      call: activeMethod.signature,
      mutated: activeMethod.mutates,
      returned: returnValue,
      isTrap: activeMethod.isNoneTrap ?? false,
      before: beforeState,
      after: errorMessage ? beforeState : afterState,
      error: errorMessage,
    });
  };

  const handleResetList = () => {
    setList([...INITIAL_LIST]);
    setLastCallResult(null);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Python List Methods Laboratory: In-Place Mutation vs Return Semantics"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 max-w-5xl mx-auto w-full">
        {/* Current List State Visualizer */}
        <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>Active List Variable:</span>
              <code className="text-[var(--accent-primary)] font-mono">cities = [{list.map((c) => `'${c}'`).join(', ')}]</code>
            </span>
            <span className="text-[11px] font-mono text-[var(--text-dim)]">
              len: {list.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {list.length === 0 ? (
              <div className="text-xs text-[var(--text-muted)] italic py-2">
                List is empty: []
              </div>
            ) : (
              list.map((item, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] flex items-center gap-2 text-xs font-mono"
                >
                  <span className="text-[10px] text-[var(--text-dim)]">[{idx}]</span>
                  <span className="font-bold text-[var(--text-main)]">'{item}'</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Method Selector Chips */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-[var(--text-muted)]">
            Select a Python List Method to Test:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {METHODS.map((method) => {
              const isActive = method.name === activeMethodName;
              return (
                <button
                  key={method.name}
                  onClick={() => {
                    setActiveMethodName(method.name);
                    setCustomArg(method.defaultArg || '');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] font-bold shadow-xs'
                      : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <span>.{method.name}()</span>
                  {method.isNoneTrap && (
                    <span
                      className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-sans"
                      title="Mutates list in-place and returns None"
                    >
                      None
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Method Details & Execution Card */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
            <div>
              <div className="font-mono text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                <span>cities.{activeMethod.name}()</span>
                <span
                  className={`text-[10px] font-sans px-2 py-0.5 rounded font-bold ${
                    activeMethod.mutates
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                  }`}
                >
                  {activeMethod.mutates ? 'MUTATES IN-PLACE' : 'NON-MUTATING'}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {activeMethod.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExecute}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] text-xs font-bold transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute cities.{activeMethod.name}()</span>
              </button>

              <button
                onClick={handleResetList}
                className="p-2 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] transition-colors"
                title="Reset list to initial items"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Execution Result Box */}
          {lastCallResult && (
            <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-3 animate-in fade-in duration-150">
              {lastCallResult.error ? (
                <div className="text-xs text-red-400 font-mono space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Exception Raised:</span>
                  </div>
                  <div className="pl-5 text-red-300">{lastCallResult.error}</div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                      <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">
                        STATEMENT EXECUTED
                      </div>
                      <div className="font-mono text-[var(--text-main)] font-semibold">
                        cities.{lastCallResult.call.replace(/^lst\./, '')}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                      <div className="text-[10px] eyebrow-label text-amber-400">
                        RETURN VALUE OF METHOD
                      </div>
                      <div className="font-mono text-amber-300 font-bold flex items-center gap-1.5">
                        <span>{lastCallResult.returned}</span>
                        {lastCallResult.returned === 'None' && (
                          <span className="text-[10px] font-sans px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold">
                            Returns None!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {lastCallResult.isTrap && (
                    <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <strong>Watch-out for the In-Place None Reassignment Trap:</strong>
                        <p className="text-[11px] text-amber-200/90 mt-0.5">
                          Never write <code className="font-mono bg-black/30 px-1 py-0.2 rounded">cities = cities.{activeMethod.name}()</code>! Because <code className="font-mono">.{activeMethod.name}()</code> returns <code className="font-mono">None</code>, reassigning to the variable will overwrite your list with <code className="font-mono">None</code>.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="text-xs space-y-1 font-mono">
                    <div className="text-[10px] text-[var(--text-dim)]">STATE AFTER EXECUTION:</div>
                    <div className="text-emerald-400 font-semibold truncate">
                      cities = [{lastCallResult.after.map((c) => `'${c}'`).join(', ')}]
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
