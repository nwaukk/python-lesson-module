import React, { useState } from 'react';
import { Database, Search, Plus, AlertTriangle, CheckCircle2, RefreshCw, Cpu, ShieldAlert } from 'lucide-react';

interface BucketSlot {
  index: number;
  hash: number | null;
  key: string | null;
  status: 'EMPTY' | 'OCCUPIED' | 'DUMMY';
}

// Simple deterministic hash simulation for educational demonstration
function computePseudoHash(val: string): number {
  let h = 0;
  for (let i = 0; i < val.length; i++) {
    h = (h * 31 + val.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export const HashSetTableSim: React.FC = () => {
  const tableSize = 8;
  const mask = tableSize - 1;

  const [buckets, setBuckets] = useState<BucketSlot[]>([
    { index: 0, hash: null, key: null, status: 'EMPTY' },
    { index: 1, hash: null, key: null, status: 'EMPTY' },
    { index: 2, hash: null, key: null, status: 'EMPTY' },
    { index: 3, hash: null, key: null, status: 'EMPTY' },
    { index: 4, hash: null, key: null, status: 'EMPTY' },
    { index: 5, hash: null, key: null, status: 'EMPTY' },
    { index: 6, hash: null, key: null, status: 'EMPTY' },
    { index: 7, hash: null, key: null, status: 'EMPTY' },
  ]);

  const [inputVal, setInputVal] = useState<string>('');
  const [logMessage, setLogMessage] = useState<{
    type: 'success' | 'duplicate' | 'error' | 'lookup';
    message: string;
    steps: string[];
  } | null>({
    type: 'success',
    message: 'Set table initialized with 8 empty bucket slots (mask = 7).',
    steps: ['Initial PySetObject allocated with PySet_MINSIZE = 8 slots.'],
  });

  const occupiedCount = buckets.filter((b) => b.status === 'OCCUPIED').length;

  const handleInsert = (rawInput?: string) => {
    const val = (rawInput ?? inputVal).trim();
    if (!val) return;

    // Check for unhashable list input
    if (val.startsWith('[') && val.endsWith(']')) {
      setLogMessage({
        type: 'error',
        message: "TypeError: unhashable type: 'list'",
        steps: [
          `Attempted to insert mutable object: ${val}`,
          'In Python, set elements must implement __hash__() and remain immutable for their lifetime.',
          'Lists are mutable and do not possess a fixed hash code. Insertion rejected with TypeError.',
        ],
      });
      setInputVal('');
      return;
    }

    const h = computePseudoHash(val);
    let idx = h & mask;
    const probeSteps: string[] = [
      `1. Compute hash("${val}") = ${h}`,
      `2. Initial bucket offset = hash & 7 = ${idx}`,
    ];

    let foundSlot = -1;
    let stepCount = 2;

    for (let i = 0; i < tableSize; i++) {
      const slot = buckets[idx];
      if (slot.status === 'EMPTY') {
        foundSlot = idx;
        probeSteps.push(`${++stepCount}. Slot [${idx}] is EMPTY -> inserting "${val}"`);
        break;
      } else if (slot.status === 'OCCUPIED' && slot.key === val) {
        // Duplicate found!
        probeSteps.push(
          `${++stepCount}. Slot [${idx}] contains identical key "${val}" -> DUPLICATE REJECTED (set length unchanged)`
        );
        setLogMessage({
          type: 'duplicate',
          message: `Duplicate detected: "${val}" already exists at slot [${idx}].`,
          steps: probeSteps,
        });
        setInputVal('');
        return;
      } else {
        // Collision: Perturbation probe
        const nextIdx = (5 * idx + 1) & mask;
        probeSteps.push(
          `${++stepCount}. Slot [${idx}] is occupied by "${slot.key}" (collision) -> probe to slot [${nextIdx}]`
        );
        idx = nextIdx;
      }
    }

    if (foundSlot !== -1) {
      const nextBuckets = [...buckets];
      nextBuckets[foundSlot] = {
        index: foundSlot,
        hash: h,
        key: val,
        status: 'OCCUPIED',
      };
      setBuckets(nextBuckets);
      setLogMessage({
        type: 'success',
        message: `Successfully inserted "${val}" into bucket [${foundSlot}] in O(1) time.`,
        steps: probeSteps,
      });
      setInputVal('');
    }
  };

  const handleLookup = () => {
    const val = inputVal.trim();
    if (!val) return;

    const h = computePseudoHash(val);
    let idx = h & mask;
    const steps = [
      `1. Compute hash("${val}") = ${h}`,
      `2. Target bucket = hash & 7 = ${idx}`,
    ];

    let isPresent = false;
    for (let i = 0; i < tableSize; i++) {
      const slot = buckets[idx];
      if (slot.status === 'EMPTY') {
        steps.push(`3. Slot [${idx}] is EMPTY -> element is ABSENT (return False)`);
        break;
      } else if (slot.status === 'OCCUPIED' && slot.key === val) {
        steps.push(`3. Slot [${idx}] matches key "${val}" -> FOUND in O(1) time (return True)`);
        isPresent = true;
        break;
      } else {
        idx = (5 * idx + 1) & mask;
      }
    }

    setLogMessage({
      type: 'lookup',
      message: `Membership test: "${val}" in set -> ${isPresent ? 'True' : 'False'}`,
      steps,
    });
  };

  const handleReset = () => {
    setBuckets(
      Array.from({ length: tableSize }, (_, i) => ({
        index: i,
        hash: null,
        key: null,
        status: 'EMPTY',
      }))
    );
    setLogMessage({
      type: 'success',
      message: 'Set table reset to empty.',
      steps: ['All 8 bucket slots cleared.'],
    });
    setInputVal('');
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-sm text-[var(--text-main)]">
              CPython PySetObject Hash Table &amp; Deduplication Inspector
            </h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Watch hash values map to bucket slots via bitmasking, observe collision resolution, and see duplicate rejection.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="self-start sm:self-auto px-2.5 py-1 text-xs rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Table</span>
        </button>
      </div>

      {/* Input & Action Bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder='Enter value (e.g. "Lagos", 42)'
          className="px-3 py-1.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] w-48 font-mono text-xs"
        />

        <button
          onClick={() => handleInsert()}
          disabled={!inputVal.trim()}
          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium disabled:opacity-50 transition-colors flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Insert (.add)</span>
        </button>

        <button
          onClick={handleLookup}
          disabled={!inputVal.trim()}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium disabled:opacity-50 transition-colors flex items-center gap-1"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Test (in set)</span>
        </button>

        <button
          onClick={() => handleInsert('["Lagos", "Abuja"]')}
          className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-medium transition-colors flex items-center gap-1"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Try Add [List] (Fails)</span>
        </button>
      </div>

      {/* Table Statistics */}
      <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
        <div>
          <span>Capacity: </span>
          <strong className="text-[var(--text-main)] font-mono">{tableSize} slots</strong>
        </div>
        <div>
          <span>Occupied (Set Length): </span>
          <strong className="text-emerald-400 font-mono">{occupiedCount} elements</strong>
        </div>
        <div>
          <span>Load Factor: </span>
          <strong className="text-[var(--accent-primary)] font-mono">
            {((occupiedCount / tableSize) * 100).toFixed(0)}%
          </strong>
        </div>
      </div>

      {/* 8-Bucket Hash Table Visualization */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {buckets.map((slot) => (
          <div
            key={slot.index}
            className={`p-2.5 rounded-xl border flex flex-col justify-between min-h-[5.5rem] transition-all ${
              slot.status === 'OCCUPIED'
                ? 'bg-emerald-500/10 border-emerald-500/40 shadow-sm'
                : 'bg-[var(--bg-app)] border-[var(--border-subtle)] opacity-70'
            }`}
          >
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="font-bold text-[var(--text-muted)]">Slot [{slot.index}]</span>
              <span
                className={`font-semibold ${
                  slot.status === 'OCCUPIED' ? 'text-emerald-400' : 'text-[var(--text-muted)]'
                }`}
              >
                {slot.status}
              </span>
            </div>

            <div className="font-mono text-xs font-bold text-[var(--text-main)] my-1 truncate text-center">
              {slot.key !== null ? slot.key : '—'}
            </div>

            <div className="text-[9px] font-mono text-[var(--text-muted)] truncate text-center">
              {slot.hash !== null ? `h: ${slot.hash}` : 'NULL'}
            </div>
          </div>
        ))}
      </div>

      {/* Execution Log & Step-by-Step Trajectory */}
      {logMessage && (
        <div
          className={`p-3.5 rounded-xl border space-y-2 text-xs animate-fadeIn ${
            logMessage.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : logMessage.type === 'duplicate'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : logMessage.type === 'lookup'
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5 font-mono">
            {logMessage.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{logMessage.message}</span>
          </div>

          <div className="pl-5 space-y-1 text-[11px] opacity-90 font-mono">
            {logMessage.steps.map((st, i) => (
              <div key={i}>{st}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
