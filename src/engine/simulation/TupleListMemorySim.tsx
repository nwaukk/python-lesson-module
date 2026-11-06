import React, { useState } from 'react';
import { Database, Lock, AlertTriangle, ArrowRight, RefreshCw, Cpu } from 'lucide-react';

interface ElementItem {
  id: string;
  value: string;
  type: string;
  address: string;
}

export const TupleListMemorySim: React.FC = () => {
  const [items, setItems] = useState<ElementItem[]>([
    { id: '1', value: '"Lagos"', type: 'str', address: '0x7fff_1001' },
    { id: '2', value: '2026', type: 'int', address: '0x7fff_1002' },
    { id: '3', value: 'True', type: 'bool', address: '0x7fff_1003' },
    { id: '4', value: '450.5', type: 'float', address: '0x7fff_1004' },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [attemptError, setAttemptError] = useState<string | null>(null);

  // CPython 64-bit memory calculations
  // PyTupleObject base size = 48 bytes + 8 bytes per item pointer
  // PyListObject base size = 56 bytes + 8 bytes per allocated pointer
  // List over-allocation formula simulation:
  const getListAllocated = (n: number) => {
    if (n === 0) return 0;
    return n + (n >> 3) + (n < 9 ? 3 : 6);
  };

  const listAllocated = getListAllocated(items.length);
  const tupleSize = 48 + items.length * 8;
  const listSize = 56 + listAllocated * 8;

  const handleAppendList = () => {
    if (!inputVal.trim()) return;
    const newItem: ElementItem = {
      id: String(Date.now()),
      value: inputVal.trim(),
      type: isNaN(Number(inputVal)) ? 'str' : 'int',
      address: `0x7fff_${(items.length + 1).toString(16).padStart(4, '0')}`,
    };
    setItems([...items, newItem]);
    setInputVal('');
    setAttemptError(null);
  };

  const handleAppendTupleAttempt = () => {
    setAttemptError("AttributeError: 'tuple' object has no attribute 'append'. Tuples are strictly immutable contiguous arrays!");
  };

  const handleReset = () => {
    setItems([
      { id: '1', value: '"Lagos"', type: 'str', address: '0x7fff_1001' },
      { id: '2', value: '2026', type: 'int', address: '0x7fff_1002' },
      { id: '3', value: 'True', type: 'bool', address: '0x7fff_1003' },
      { id: '4', value: '450.5', type: 'float', address: '0x7fff_1004' },
    ]);
    setAttemptError(null);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[var(--accent-primary)]" />
            <h3 className="font-extrabold text-sm text-[var(--text-main)]">
              CPython Memory Layout: PyTupleObject vs PyListObject
            </h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Compare contiguous fixed pointer arrays (Tuples) with dynamically over-allocated resizing arrays (Lists).
          </p>
        </div>

        <button
          onClick={handleReset}
          className="self-start sm:self-auto px-2.5 py-1 text-xs rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Arrays</span>
        </button>
      </div>

      {/* Controls & Append Test */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder='Enter value (e.g. "Abuja", 99)'
          className="px-3 py-1.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] w-48 font-mono text-xs"
        />

        <button
          onClick={handleAppendList}
          disabled={!inputVal.trim()}
          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium disabled:opacity-50 transition-colors"
        >
          Append to List (O(1))
        </button>

        <button
          onClick={handleAppendTupleAttempt}
          className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-medium transition-colors"
        >
          Try tuple.append() [Fails]
        </button>
      </div>

      {/* Error alert */}
      {attemptError && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2 animate-fadeIn">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="font-mono">{attemptError}</div>
        </div>
      )}

      {/* Side-by-side memory architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tuple Card */}
        <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs text-[var(--text-main)] uppercase tracking-wider">
                PyTupleObject (Fixed Array)
              </span>
            </div>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
              IMMUTABLE • NO SLACK
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-[var(--text-muted)]">
              <span>Logical Length (ob_size):</span>
              <span className="font-mono font-bold text-[var(--text-main)]">{items.length} items</span>
            </div>
            <div className="flex justify-between text-[var(--text-muted)]">
              <span>Allocated Capacity:</span>
              <span className="font-mono font-bold text-emerald-400">{items.length} slots (0 wasted)</span>
            </div>
            <div className="flex justify-between text-[var(--text-muted)]">
              <span>sys.getsizeof(tuple):</span>
              <span className="font-mono font-bold text-[var(--accent-primary)]">{tupleSize} bytes</span>
            </div>
          </div>

          {/* Tuple Memory Blocks */}
          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block mb-2">
              Contiguous 64-bit Pointer Table (ob_item)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-2 rounded-lg bg-[var(--bg-surface)] border border-emerald-500/30 flex flex-col justify-between"
                >
                  <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono">
                    <span>[{idx}]</span>
                    <span className="text-emerald-400">P*</span>
                  </div>
                  <div className="font-mono text-xs font-bold text-[var(--text-main)] my-1 truncate">
                    {item.value}
                  </div>
                  <div className="text-[9px] font-mono text-[var(--text-muted)] truncate">
                    {item.address}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] leading-relaxed">
            <strong className="text-[var(--text-main)]">Memory Advantage:</strong> Tuples allocate exactly the memory required for their elements with zero over-allocation slack. CPython also maintains a small tuple free-list for tuples up to length 20, making tuple allocation faster than list allocation.
          </div>
        </div>

        {/* List Card */}
        <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-xs text-[var(--text-main)] uppercase tracking-wider">
                PyListObject (Dynamic Array)
              </span>
            </div>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold">
              MUTABLE • OVER-ALLOCATED
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-[var(--text-muted)]">
              <span>Logical Length (ob_size):</span>
              <span className="font-mono font-bold text-[var(--text-main)]">{items.length} items</span>
            </div>
            <div className="flex justify-between text-[var(--text-muted)]">
              <span>Allocated Capacity:</span>
              <span className="font-mono font-bold text-blue-400">
                {listAllocated} slots ({listAllocated - items.length} buffer slack)
              </span>
            </div>
            <div className="flex justify-between text-[var(--text-muted)]">
              <span>sys.getsizeof(list):</span>
              <span className="font-mono font-bold text-[var(--accent-primary)]">{listSize} bytes</span>
            </div>
          </div>

          {/* List Memory Blocks */}
          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block mb-2">
              Contiguous 64-bit Pointer Table + Unused Slack
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-2 rounded-lg bg-[var(--bg-surface)] border border-blue-500/30 flex flex-col justify-between"
                >
                  <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono">
                    <span>[{idx}]</span>
                    <span className="text-blue-400">P*</span>
                  </div>
                  <div className="font-mono text-xs font-bold text-[var(--text-main)] my-1 truncate">
                    {item.value}
                  </div>
                  <div className="text-[9px] font-mono text-[var(--text-muted)] truncate">
                    {item.address}
                  </div>
                </div>
              ))}

              {/* Slack slots */}
              {Array.from({ length: listAllocated - items.length }).map((_, idx) => (
                <div
                  key={`slack-${idx}`}
                  className="p-2 rounded-lg bg-[var(--bg-surface)]/40 border border-dashed border-[var(--border-subtle)] flex flex-col justify-between opacity-60"
                >
                  <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono">
                    <span>[{items.length + idx}]</span>
                    <span className="text-amber-400">NULL</span>
                  </div>
                  <div className="font-mono text-[11px] text-[var(--text-muted)] italic my-1">
                    Unused slot
                  </div>
                  <div className="text-[9px] font-mono text-[var(--text-muted)]">
                    Slack buffer
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] leading-relaxed">
            <strong className="text-[var(--text-main)]">Memory Trade-off:</strong> Lists allocate excess pointer slots so appends can be $O(1)$ amortized without triggering `realloc()` on every call. For fixed datasets that will never change, tuples save memory and prevent accidental mutations.
          </div>
        </div>
      </div>
    </div>
  );
};
