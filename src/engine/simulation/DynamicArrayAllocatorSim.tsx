/**
 * CPython Dynamic Array Allocator Simulation (PyListObject)
 * Demonstrates internal list memory architecture: contiguous pointer array,
 * current size (ob_size) vs allocated capacity (allocated), and over-allocation growth algorithm.
 */

import React, { useState } from 'react';
import { SimulationController } from './SimulationController';
import { Plus, Minus, RotateCcw, Cpu, Layers, ArrowRight, Zap, Info } from 'lucide-react';

interface ListItem {
  id: string;
  value: string;
  type: 'str' | 'int' | 'bool' | 'float';
  memoryAddress: string;
}

// CPython list resize formula:
// new_allocated = (size_t)newsize + (newsize >> 3) + (newsize < 9 ? 3 : 6);
function getCPythonCapacity(size: number): number {
  if (size === 0) return 0;
  return size + (size >> 3) + (size < 9 ? 3 : 6);
}

const INITIAL_ITEMS: ListItem[] = [
  { id: '1', value: "'Lagos'", type: 'str', memoryAddress: '0x7f9a10' },
  { id: '2', value: "'Abuja'", type: 'str', memoryAddress: '0x7f9a28' },
  { id: '3', value: '2026', type: 'int', memoryAddress: '0x7f9b00' },
];

export const DynamicArrayAllocatorSim: React.FC = () => {
  const [items, setItems] = useState<ListItem[]>(INITIAL_ITEMS);
  const [inputValue, setInputValue] = useState('');
  const [historyLog, setHistoryLog] = useState<string[]>([
    'Initialized PyListObject with 3 elements. Allocated capacity: 6 slots.',
  ]);

  const size = items.length;
  // Calculate allocated capacity based on CPython rules (clamping to max capacity reached)
  const capacity = Math.max(size, getCPythonCapacity(size));
  const spareSlots = Math.max(0, capacity - size);

  const handleAppend = (val?: string) => {
    const rawVal = val !== undefined ? val : (inputValue.trim() || `'Item_${size + 1}'`);
    const isNumber = !isNaN(Number(rawVal)) && rawVal !== '';
    const isBool = rawVal === 'True' || rawVal === 'False';

    let itemType: 'str' | 'int' | 'bool' | 'float' = 'str';
    if (isBool) itemType = 'bool';
    else if (isNumber) itemType = rawVal.includes('.') ? 'float' : 'int';

    const hexSuffix = Math.floor(Math.random() * 0xfff).toString(16).padStart(3, '0');
    const newItem: ListItem = {
      id: String(Date.now() + Math.random()),
      value: rawVal,
      type: itemType,
      memoryAddress: `0x7f9${hexSuffix}`,
    };

    const newSize = size + 1;
    const oldCapacity = capacity;
    const newCapacity = Math.max(newSize, getCPythonCapacity(newSize));

    let logMessage = `append(${rawVal}): len increased to ${newSize}.`;
    if (newSize > oldCapacity) {
      logMessage += ` ⚡ RESIZE TRIGGERED! Buffer over-allocated from ${oldCapacity} to ${newCapacity} slots.`;
    } else {
      logMessage += ` Placed into pre-allocated slot ${newSize - 1} in O(1) time without reallocating.`;
    }

    setItems([...items, newItem]);
    setHistoryLog((prev) => [logMessage, ...prev.slice(0, 9)]);
    setInputValue('');
  };

  const handlePop = () => {
    if (items.length === 0) return;
    const popped = items[items.length - 1];
    const newItems = items.slice(0, -1);
    setItems(newItems);
    setHistoryLog((prev) => [
      `pop(): Removed ${popped.value} from index ${items.length - 1}. len is now ${newItems.length}.`,
      ...prev.slice(0, 9),
    ]);
  };

  const handleReset = () => {
    setItems(INITIAL_ITEMS);
    setHistoryLog(['Reset PyListObject to initial 3-element state.']);
  };

  const handleBulkAdd = () => {
    const demoBatch = ["'Kano'", "'Ibadan'", '99.5', 'True', "'Enugu'", '500'];
    let current = [...items];
    const logs: string[] = [];

    demoBatch.forEach((val) => {
      const hex = Math.floor(Math.random() * 0xfff).toString(16).padStart(3, '0');
      current.push({
        id: String(Math.random()),
        value: val,
        type: val.startsWith("'") ? 'str' : val.includes('.') ? 'float' : val === 'True' ? 'bool' : 'int',
        memoryAddress: `0x7f9${hex}`,
      });
    });

    setItems(current);
    setHistoryLog((prev) => [
      `Batch appended 6 elements. Rapid growth triggered PyList_Resize reallocation. Current len: ${current.length}, capacity: ${getCPythonCapacity(current.length)}.`,
      ...prev.slice(0, 8),
    ]);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="CPython Dynamic Array Allocator (PyListObject Internals)"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 max-w-5xl mx-auto w-full">
        {/* Metric Badges & Memory Layout Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <div className="text-[10px] eyebrow-label text-[var(--accent-primary)]">LOGICAL SIZE (ob_size)</div>
            <div className="text-2xl font-bold font-mono text-[var(--text-main)] mt-0.5">
              {size} <span className="text-xs font-normal text-[var(--text-muted)]">elements</span>
            </div>
            <div className="text-[11px] text-[var(--text-dim)] mt-0.5">len(my_list)</div>
          </div>

          <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <div className="text-[10px] eyebrow-label text-sky-400">ALLOCATED CAPACITY</div>
            <div className="text-2xl font-bold font-mono text-sky-300 mt-0.5">
              {capacity} <span className="text-xs font-normal text-[var(--text-muted)]">slots</span>
            </div>
            <div className="text-[11px] text-[var(--text-dim)] mt-0.5">ob_item** buffer</div>
          </div>

          <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <div className="text-[10px] eyebrow-label text-amber-400">OVER-ALLOCATION BUFFER</div>
            <div className="text-2xl font-bold font-mono text-amber-300 mt-0.5">
              {spareSlots} <span className="text-xs font-normal text-[var(--text-muted)]">free slots</span>
            </div>
            <div className="text-[11px] text-[var(--text-dim)] mt-0.5">Guarantees O(1) amortized appends</div>
          </div>

          <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <div className="text-[10px] eyebrow-label text-emerald-400">ESTIMATED BYTES</div>
            <div className="text-2xl font-bold font-mono text-emerald-300 mt-0.5">
              {56 + capacity * 8} <span className="text-xs font-normal text-[var(--text-muted)]">bytes</span>
            </div>
            <div className="text-[11px] text-[var(--text-dim)] mt-0.5">sys.getsizeof() on 64-bit</div>
          </div>
        </div>

        {/* PyListObject Header Structure Card */}
        <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="text-xs font-bold text-[var(--text-main)]">
                PyListObject Structure in CPython (Heap Memory Representation)
              </span>
            </div>
            <span className="text-[11px] font-mono text-[var(--text-dim)]">
              Address: 0x7ffd9820
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)]">
              <div className="text-[10px] text-[var(--text-dim)]">ob_refcnt</div>
              <div className="text-[var(--text-main)] font-bold">1 (Active reference)</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)]">
              <div className="text-[10px] text-[var(--text-dim)]">ob_type</div>
              <div className="text-purple-300 font-bold">&amp;PyList_Type</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)]">
              <div className="text-[10px] text-[var(--text-dim)]">ob_size</div>
              <div className="text-[var(--accent-primary)] font-bold">{size}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)]">
              <div className="text-[10px] text-[var(--text-dim)]">allocated (buffer)</div>
              <div className="text-sky-300 font-bold">{capacity}</div>
            </div>
          </div>
        </div>

        {/* Contiguous Pointer Array Visualization */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-sky-400" />
              Contiguous Heap Pointer Buffer: <code className="text-sky-300 font-mono">PyObject** ob_item</code>
            </span>
            <span className="text-[11px] text-[var(--text-dim)]">
              64-bit Pointers (8 bytes per slot)
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-x-auto">
            {capacity === 0 ? (
              <div className="text-center py-6 text-xs text-[var(--text-muted)]">
                List buffer is currently empty (0 slots allocated).
              </div>
            ) : (
              <div className="flex items-stretch gap-2 min-w-max pb-1">
                {Array.from({ length: capacity }).map((_, idx) => {
                  const item = items[idx];
                  const isFilled = idx < size;

                  return (
                    <div
                      key={idx}
                      className={`w-28 rounded-xl p-3 flex flex-col justify-between border transition-all ${
                        isFilled
                          ? 'border-[var(--accent-primary)]/40 bg-[var(--bg-app)] shadow-xs'
                          : 'border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]/30 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                          <span className="text-[var(--text-dim)]">[{idx}]</span>
                          {isFilled ? (
                            <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold">
                              {item.type}
                            </span>
                          ) : (
                            <span className="text-[9px] text-[var(--text-dim)]">EMPTY</span>
                          )}
                        </div>

                        <div className="font-mono text-sm font-bold truncate text-[var(--text-main)] my-1">
                          {isFilled ? item.value : 'NULL'}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-dim)] truncate">
                        {isFilled ? `→ ${item.memoryAddress}` : 'Unused slot'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Interactive Controls Bar */}
        <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3">
          <div className="text-xs font-bold text-[var(--text-main)]">
            Interactive List Operations &amp; Growth Triggers
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. 'Kaduna' or 42"
              className="px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] w-44"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAppend();
              }}
            />

            <button
              onClick={() => handleAppend()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>append()</span>
            </button>

            <button
              onClick={handlePop}
              disabled={items.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] text-xs font-semibold text-[var(--text-main)] disabled:opacity-30 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
              <span>pop()</span>
            </button>

            <button
              onClick={handleBulkAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-xs font-semibold text-sky-300 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>+6 Batch Append (Trigger Resize)</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] text-xs text-[var(--text-muted)] transition-colors ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Live Reallocation Log */}
        <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
          <div className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>CPython Memory Allocator Event Log</span>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-[11px] space-y-1.5 max-h-36 overflow-y-auto">
            {historyLog.map((log, i) => (
              <div
                key={i}
                className={i === 0 ? 'text-[var(--accent-primary)] font-semibold' : 'text-[var(--text-muted)]'}
              >
                {i === 0 ? '► ' : '  '}
                {log}
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[var(--text-dim)] leading-relaxed">
            Formula applied: <code className="text-amber-300">new_allocated = newsize + (newsize &gt;&gt; 3) + (newsize &lt; 9 ? 3 : 6)</code>.
            Because memory is over-allocated, 4 out of 5 appends require zero memory allocation overhead, achieving guaranteed $O(1)$ amortized time.
          </p>
        </div>
      </div>
    </div>
  );
};
