import React, { useState } from 'react';
import { Database, Search, Plus, Trash2, Cpu, ShieldAlert, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface DictEntry {
  entryIndex: number;
  hash: number;
  key: string;
  value: string;
}

// Educational deterministic hash function for strings
function computeDictHash(val: string): number {
  let h = 0;
  for (let i = 0; i < val.length; i++) {
    h = (h * 31 + val.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export const CompactDictMemorySim: React.FC = () => {
  const tableSize = 8;
  const mask = tableSize - 1;

  // CPython 3.6+ Compact Dict Architecture:
  // 1. dk_indices: Sparse hash table storing offsets into dk_entries (or -1 if empty, -2 if dummy)
  // 2. dk_entries: Dense array storing (hash, key, value) in exact insertion order
  const [indices, setIndices] = useState<(number | -1 | -2)[]>([
    -1, 0, -1, 1, -1, -1, 2, -1
  ]);

  const [entries, setEntries] = useState<DictEntry[]>([
    { entryIndex: 0, hash: computeDictHash('user_id'), key: 'user_id', value: 'USR-9021' },
    { entryIndex: 1, hash: computeDictHash('currency'), key: 'currency', value: 'NGN' },
    { entryIndex: 2, hash: computeDictHash('active'), key: 'active', value: 'True' },
  ]);

  const [inputKey, setInputKey] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [log, setLog] = useState<{
    type: 'success' | 'overwrite' | 'collision' | 'error' | 'lookup';
    message: string;
    steps: string[];
  }>({
    type: 'success',
    message: 'CPython 3.6+ Compact Dict: 8-slot indices table mapped to dense entries array.',
    steps: [
      'dk_indices: Sparse 8-element array of integer byte offsets.',
      'dk_entries: Dense array appending (hash, key, value) in chronological order.',
      'Memory optimization: Saves ~25% memory while guaranteeing insertion order by default (PEP 468/Python 3.7+).'
    ],
  });

  const handleInsertOrUpdate = () => {
    const k = inputKey.trim();
    const v = inputValue.trim();
    if (!k || !v) return;

    // Check for unhashable key type (e.g. list literal)
    if (k.startsWith('[') && k.endsWith(']')) {
      setLog({
        type: 'error',
        message: "TypeError: unhashable type: 'list'",
        steps: [
          `Attempted to use mutable list as dictionary key: ${k}`,
          "Dictionary keys must be hashable and immutable (str, int, float, tuple, frozenset).",
          "Lists do not implement __hash__() and cannot be mapped to bucket indices."
        ]
      });
      setInputKey('');
      setInputValue('');
      return;
    }

    const h = computeDictHash(k);
    let bucketIdx = h & mask;
    const probeSteps: string[] = [
      `1. Compute hash("${k}") = ${h}`,
      `2. Target bucket in dk_indices = hash & 7 = [${bucketIdx}]`
    ];

    // Check if key already exists in entries
    const existingEntryIndex = entries.findIndex((e) => e.key === k);

    if (existingEntryIndex !== -1) {
      // Key Overwrite! Updates value in place; insertion order is PRESERVED!
      probeSteps.push(`3. Key "${k}" already exists at dk_entries[${existingEntryIndex}].`);
      probeSteps.push(`4. OVERWRITE: Update value from "${entries[existingEntryIndex].value}" to "${v}". Insertion order unaffected!`);

      const nextEntries = [...entries];
      nextEntries[existingEntryIndex] = {
        ...nextEntries[existingEntryIndex],
        value: v,
      };
      setEntries(nextEntries);

      setLog({
        type: 'overwrite',
        message: `Key Overwrite: '${k}' updated to '${v}' (Insertion order preserved).`,
        steps: probeSteps
      });
      setInputKey('');
      setInputValue('');
      return;
    }

    // New Key Insertion
    let slotFound = -1;
    let stepCount = 2;
    const nextIndices = [...indices];

    for (let i = 0; i < tableSize; i++) {
      const entryRef = nextIndices[bucketIdx];
      if (entryRef === -1 || entryRef === -2) {
        slotFound = bucketIdx;
        probeSteps.push(`${++stepCount}. dk_indices[${bucketIdx}] is available -> store pointer to dk_entries[${entries.length}]`);
        break;
      } else {
        const nextBucket = (5 * bucketIdx + 1) & mask;
        probeSteps.push(`${++stepCount}. Collision at dk_indices[${bucketIdx}] (points to entry #${entryRef}) -> probe to [${nextBucket}]`);
        bucketIdx = nextBucket;
      }
    }

    if (slotFound !== -1) {
      const newEntryIdx = entries.length;
      nextIndices[slotFound] = newEntryIdx;
      const newEntry: DictEntry = {
        entryIndex: newEntryIdx,
        hash: h,
        key: k,
        value: v
      };

      setIndices(nextIndices);
      setEntries([...entries, newEntry]);

      setLog({
        type: 'success',
        message: `Inserted new entry '${k}': '${v}' at dk_entries[${newEntryIdx}].`,
        steps: probeSteps
      });
    }

    setInputKey('');
    setInputValue('');
  };

  const handleLookup = () => {
    const k = inputKey.trim();
    if (!k) return;

    const h = computeDictHash(k);
    let bucketIdx = h & mask;
    const probeSteps: string[] = [
      `1. Compute hash("${k}") = ${h}`,
      `2. Check dk_indices[${bucketIdx}]`
    ];

    let found = false;
    for (let i = 0; i < tableSize; i++) {
      const entryRef = indices[bucketIdx];
      if (entryRef === -1) {
        probeSteps.push(`3. Encountered empty slot (-1) -> Key "${k}" is NOT in dictionary.`);
        break;
      } else if (entryRef >= 0 && entries[entryRef]?.key === k) {
        probeSteps.push(`3. Match confirmed at dk_entries[${entryRef}] -> Value = "${entries[entryRef].value}"`);
        found = true;
        break;
      } else {
        const nextBucket = (5 * bucketIdx + 1) & mask;
        probeSteps.push(`Collision/probe -> jump to dk_indices[${nextBucket}]`);
        bucketIdx = nextBucket;
      }
    }

    setLog({
      type: found ? 'lookup' : 'error',
      message: found
        ? `Found '${k}': '${entries.find((e) => e.key === k)?.value}' in O(1) time.`
        : `KeyError: '${k}' not found in dictionary!`,
      steps: probeSteps
    });
  };

  const handleReset = () => {
    setIndices([-1, 0, -1, 1, -1, -1, 2, -1]);
    setEntries([
      { entryIndex: 0, hash: computeDictHash('user_id'), key: 'user_id', value: 'USR-9021' },
      { entryIndex: 1, hash: computeDictHash('currency'), key: 'currency', value: 'NGN' },
      { entryIndex: 2, hash: computeDictHash('active'), key: 'active', value: 'True' },
    ]);
    setLog({
      type: 'success',
      message: 'Dictionary reset to starter 3-entry state.',
      steps: ['dk_indices & dk_entries restored to baseline.']
    });
    setInputKey('');
    setInputValue('');
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 bg-[var(--bg-surface)] overflow-y-auto space-y-4 text-[var(--text-main)]">
      {/* Simulation Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-[var(--accent-primary)]" />
          <div>
            <h2 className="text-sm font-bold tracking-tight">CPython Compact Dict Memory Architecture</h2>
            <p className="text-[11px] text-[var(--text-muted)]">
              Visualizing the split indices table (`dk_indices`) and dense chronological entries array (`dk_entries`).
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] text-xs text-[var(--text-muted)] transition-colors"
        >
          Reset Architecture
        </button>
      </div>

      {/* Control Bar: Key/Value Insertion and Lookup */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-xs">
        <input
          type="text"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          placeholder='Key (e.g. "email")'
          className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] font-mono text-xs w-32 focus:outline-none focus:border-[var(--accent-primary)]"
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder='Value (e.g. "ada@ng.com")'
          className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] font-mono text-xs w-44 focus:outline-none focus:border-[var(--accent-primary)]"
        />

        <button
          onClick={handleInsertOrUpdate}
          disabled={!inputKey.trim() || !inputValue.trim()}
          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium disabled:opacity-50 transition-colors flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Set (d[k] = v)</span>
        </button>

        <button
          onClick={handleLookup}
          disabled={!inputKey.trim()}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium disabled:opacity-50 transition-colors flex items-center gap-1"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Lookup (d[k])</span>
        </button>

        <button
          onClick={() => {
            setInputKey('[1, 2]');
            setInputValue('"invalid"');
          }}
          className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono transition-colors flex items-center gap-1"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Test Unhashable [List] Key</span>
        </button>
      </div>

      {/* Layer 1: dk_indices (Sparse Hash Table Array) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold font-mono text-sky-400 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            1. dk_indices (Sparse Bucket Table — 8 bytes total)
          </span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono">
            Slot = hash(key) &amp; 7
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {indices.map((entryRef, slotIdx) => (
            <div
              key={slotIdx}
              className={`p-2 rounded-xl border flex flex-col items-center justify-between transition-all ${
                entryRef >= 0
                  ? 'bg-sky-500/10 border-sky-500/50 shadow-sm'
                  : 'bg-[var(--bg-app)] border-[var(--border-subtle)] opacity-60'
              }`}
            >
              <span className="text-[10px] font-mono text-[var(--text-muted)]">[{slotIdx}]</span>
              <span
                className={`font-mono text-sm font-bold ${
                  entryRef >= 0 ? 'text-sky-300' : 'text-[var(--text-muted)]'
                }`}
              >
                {entryRef >= 0 ? `#${entryRef}` : '-1'}
              </span>
              <span className="text-[9px] font-mono text-[var(--text-muted)]">
                {entryRef >= 0 ? 'Points to entry' : 'EMPTY'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Layer 2: dk_entries (Dense Ordered Entries Array) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold font-mono text-emerald-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            2. dk_entries (Dense Array in Exact Chronological Insertion Order)
          </span>
          <span className="text-[10px] text-emerald-300 font-mono font-semibold">
            len(d) = {entries.length} items
          </span>
        </div>

        <div className="space-y-1.5">
          {entries.map((entry, i) => (
            <div
              key={entry.key}
              className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2 font-mono text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
                  Entry #{entry.entryIndex}
                </span>
                <span className="font-bold text-[var(--text-main)]">
                  "{entry.key}":
                </span>
                <span className="text-amber-300">
                  {entry.value.startsWith('"') ? entry.value : `"${entry.value}"`}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
                <span>hash: {entry.hash}</span>
                <span className="text-sky-400">order rank: {i + 1} of {entries.length}</span>
              </div>
            </div>
          ))}
          {entries.length === 0 && (
            <div className="p-3 text-center text-xs text-[var(--text-muted)] italic">
              Dictionary entries array is currently empty.
            </div>
          )}
        </div>
      </div>

      {/* Step-by-Step PVM Internal Trajectory */}
      {log && (
        <div
          className={`p-3.5 rounded-xl border space-y-1.5 text-xs animate-fadeIn ${
            log.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : log.type === 'overwrite'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : log.type === 'lookup'
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5 font-mono">
            {log.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{log.message}</span>
          </div>

          <div className="pl-5 space-y-1 text-[11px] opacity-90 font-mono">
            {log.steps.map((st, i) => (
              <div key={i}>{st}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
