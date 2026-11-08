import React, { useState } from 'react';
import { Layers, Search, Plus, Trash2, Code, ShieldCheck, AlertCircle, ArrowRight, CornerDownRight } from 'lucide-react';

type DictOpMode = 'get_vs_bracket' | 'setdefault' | 'pop' | 'update' | 'views' | 'nested';

export const DictMutationFlowSim: React.FC = () => {
  const [activeMode, setActiveMode] = useState<DictOpMode>('get_vs_bracket');

  // Interactive dictionary state
  const [userRecord, setUserRecord] = useState<Record<string, any>>({
    id: 'USR-8821',
    name: 'Amina Bello',
    tier: 'PLATINUM',
    balance_ngn: 450000.0,
    contact: {
      email: 'amina.bello@lagosbank.ng',
      city: 'Lagos',
      phone: '08023456789',
    },
  });

  const [queryKey, setQueryKey] = useState('tier');
  const [defaultVal, setDefaultVal] = useState('STANDARD');
  const [updateKey, setUpdateKey] = useState('status');
  const [updateValue, setUpdateValue] = useState('ACTIVE');

  const [simOutput, setSimOutput] = useState<{
    code: string;
    result: string;
    status: 'success' | 'keyerror' | 'fallback';
    explanation: string;
  }>({
    code: 'userRecord["tier"]',
    result: "'PLATINUM'",
    status: 'success',
    explanation: 'Direct key access d[k] finds existing key in O(1) time and returns value.',
  });

  // Action Handlers
  const handleDirectAccess = (keyName: string) => {
    const k = keyName.trim();
    if (k in userRecord) {
      setSimOutput({
        code: `val = user_record["${k}"]`,
        result: JSON.stringify(userRecord[k]),
        status: 'success',
        explanation: `Key "${k}" found in dictionary. Returns value in O(1) time.`,
      });
    } else {
      setSimOutput({
        code: `val = user_record["${k}"]`,
        result: `KeyError: '${k}'`,
        status: 'keyerror',
        explanation: `KeyError raised! Key "${k}" does not exist. Use .get() to prevent crashes.`,
      });
    }
  };

  const handleGetAccess = (keyName: string, fallback: string) => {
    const k = keyName.trim();
    const fb = fallback.trim();
    if (k in userRecord) {
      setSimOutput({
        code: `val = user_record.get("${k}", "${fb}")`,
        result: JSON.stringify(userRecord[k]),
        status: 'success',
        explanation: `Key "${k}" exists. Returns real value "${userRecord[k]}"; fallback ignored.`,
      });
    } else {
      setSimOutput({
        code: `val = user_record.get("${k}", "${fb}")`,
        result: `"${fb}" (default fallback)`,
        status: 'fallback',
        explanation: `Key "${k}" is missing! .get() gracefully returns fallback "${fb}" without raising KeyError.`,
      });
    }
  };

  const handleSetDefault = (keyName: string, defaultSetting: string) => {
    const k = keyName.trim();
    const dVal = defaultSetting.trim();
    if (!k) return;

    if (k in userRecord) {
      setSimOutput({
        code: `existing = user_record.setdefault("${k}", "${dVal}")`,
        result: JSON.stringify(userRecord[k]),
        status: 'success',
        explanation: `Key "${k}" already exists with value "${userRecord[k]}". Dictionary is UNCHANGED; existing value returned.`,
      });
    } else {
      setUserRecord((prev) => ({ ...prev, [k]: dVal }));
      setSimOutput({
        code: `new_val = user_record.setdefault("${k}", "${dVal}")`,
        result: `"${dVal}" (inserted and returned)`,
        status: 'success',
        explanation: `Key "${k}" was missing! setdefault() inserted "${k}": "${dVal}" and returned "${dVal}".`,
      });
    }
  };

  const handlePop = (keyName: string) => {
    const k = keyName.trim();
    if (k in userRecord) {
      const poppedVal = userRecord[k];
      const nextRecord = { ...userRecord };
      delete nextRecord[k];
      setUserRecord(nextRecord);
      setSimOutput({
        code: `removed = user_record.pop("${k}")`,
        result: JSON.stringify(poppedVal),
        status: 'success',
        explanation: `Removed key "${k}" in-place and returned its value ${JSON.stringify(poppedVal)}.`,
      });
    } else {
      setSimOutput({
        code: `removed = user_record.pop("${k}")`,
        result: `KeyError: '${k}'`,
        status: 'keyerror',
        explanation: `pop("${k}") raises KeyError because key is missing! Use pop("${k}", default) for safe eviction.`,
      });
    }
  };

  const handleUpdate = () => {
    const k = updateKey.trim();
    const v = updateValue.trim();
    if (!k || !v) return;

    setUserRecord((prev) => ({ ...prev, [k]: v }));
    setSimOutput({
      code: `user_record.update({"${k}": "${v}"})`,
      result: 'None (mutated in-place)',
      status: 'success',
      explanation: `Updated dictionary in-place with key "${k}". Existing keys are overwritten; novel keys are appended.`,
    });
  };

  const handleResetRecord = () => {
    setUserRecord({
      id: 'USR-8821',
      name: 'Amina Bello',
      tier: 'PLATINUM',
      balance_ngn: 450000.0,
      contact: {
        email: 'amina.bello@lagosbank.ng',
        city: 'Lagos',
        phone: '08023456789',
      },
    });
    setSimOutput({
      code: '# Reset user_record',
      result: 'OK',
      status: 'success',
      explanation: 'User record restored to initial state.',
    });
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 bg-[var(--bg-surface)] overflow-y-auto space-y-4 text-[var(--text-main)]">
      {/* Simulation Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[var(--accent-primary)]" />
          <div>
            <h2 className="text-sm font-bold tracking-tight">Dictionary Retrieval, Mutation &amp; View Navigator</h2>
            <p className="text-[11px] text-[var(--text-muted)]">
              Interactive playground comparing `d[k]` vs `.get()`, `.setdefault()`, `.pop()`, and nested object traversal.
            </p>
          </div>
        </div>

        <button
          onClick={handleResetRecord}
          className="px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] text-xs text-[var(--text-muted)] transition-colors"
        >
          Reset Dictionary
        </button>
      </div>

      {/* Mode Navigation Bar */}
      <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-xs">
        <button
          onClick={() => setActiveMode('get_vs_bracket')}
          className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
            activeMode === 'get_vs_bracket'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] border-transparent'
              : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          d[k] vs .get(k, default)
        </button>
        <button
          onClick={() => setActiveMode('setdefault')}
          className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
            activeMode === 'setdefault'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] border-transparent'
              : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          .setdefault()
        </button>
        <button
          onClick={() => setActiveMode('pop')}
          className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
            activeMode === 'pop'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] border-transparent'
              : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          .pop(k) &amp; Eviction
        </button>
        <button
          onClick={() => setActiveMode('update')}
          className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
            activeMode === 'update'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] border-transparent'
              : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          .update() Merge
        </button>
        <button
          onClick={() => setActiveMode('nested')}
          className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
            activeMode === 'nested'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] border-transparent'
              : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          Nested JSON Traversal
        </button>
      </div>

      {/* Main Stage Grid: Interactive Controls + Live Record Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Interactive Operation Workbench */}
        <div className="space-y-3 p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
          <div className="text-xs font-bold text-[var(--text-main)] flex items-center justify-between">
            <span>Operation Parameters</span>
            <span className="text-[10px] uppercase font-mono text-[var(--accent-primary)] font-bold">
              Mode: {activeMode}
            </span>
          </div>

          {activeMode === 'get_vs_bracket' && (
            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Target Key Name:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={queryKey}
                    onChange={(e) => setQueryKey(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] font-mono text-xs focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                  <button
                    onClick={() => setQueryKey('country')}
                    className="px-2 py-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  >
                    Set Missing Key
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Default Fallback:</label>
                <input
                  type="text"
                  value={defaultVal}
                  onChange={(e) => setDefaultVal(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] font-mono text-xs focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleDirectAccess(queryKey)}
                  className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>d["{queryKey}"]</span>
                </button>
                <button
                  onClick={() => handleGetAccess(queryKey, defaultVal)}
                  className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>d.get("{queryKey}", ...)</span>
                </button>
              </div>
            </div>
          )}

          {activeMode === 'setdefault' && (
            <div className="space-y-2.5 text-xs">
              <p className="text-[11px] text-[var(--text-muted)]">
                `setdefault(k, default)` retrieves value if key exists, OR inserts `k: default` if key is missing.
              </p>
              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Key:</label>
                <input
                  type="text"
                  value={queryKey}
                  onChange={(e) => setQueryKey(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Default Value:</label>
                <input
                  type="text"
                  value={defaultVal}
                  onChange={(e) => setDefaultVal(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs"
                />
              </div>
              <button
                onClick={() => handleSetDefault(queryKey, defaultVal)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--accent-primary)] text-[var(--accent-on)] font-bold transition-colors"
              >
                Execute d.setdefault("{queryKey}", "{defaultVal}")
              </button>
            </div>
          )}

          {activeMode === 'pop' && (
            <div className="space-y-2.5 text-xs">
              <p className="text-[11px] text-[var(--text-muted)]">
                `pop(k)` removes the key and returns its value. Raises `KeyError` if missing and no fallback provided.
              </p>
              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Key to Pop:</label>
                <input
                  type="text"
                  value={queryKey}
                  onChange={(e) => setQueryKey(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs"
                />
              </div>
              <button
                onClick={() => handlePop(queryKey)}
                className="w-full px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Execute d.pop("{queryKey}")</span>
              </button>
            </div>
          )}

          {activeMode === 'update' && (
            <div className="space-y-2.5 text-xs">
              <p className="text-[11px] text-[var(--text-muted)]">
                {'update(other)'} merges key-value pairs into the dictionary in-place, overwriting matches.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={updateKey}
                  onChange={(e) => setUpdateKey(e.target.value)}
                  placeholder="Key"
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs"
                />
                <input
                  type="text"
                  value={updateValue}
                  onChange={(e) => setUpdateValue(e.target.value)}
                  placeholder="Value"
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs"
                />
              </div>
              <button
                onClick={handleUpdate}
                className="w-full px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Execute d.update({"{"}"{updateKey}": "{updateValue}"{"}"})</span>
              </button>
            </div>
          )}

          {activeMode === 'nested' && (
            <div className="space-y-2 text-xs">
              <p className="text-[11px] text-[var(--text-muted)]">
                Chained subscript access: `user_record['contact']['city']`.
              </p>
              <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1 font-mono text-[11px]">
                <div className="text-emerald-400">user_record["contact"]["city"]</div>
                <div className="text-[var(--text-muted)]">↳ Result: "Lagos"</div>
                <div className="pt-1 border-t border-[var(--border-subtle)] text-amber-300">
                  user_record.get("contact", {"{}"}).get("email")
                </div>
                <div className="text-[var(--text-muted)]">↳ Safe defensive chaining</div>
              </div>
              <button
                onClick={() => {
                  setSimOutput({
                    code: 'city = user_record["contact"]["city"]',
                    result: '"Lagos"',
                    status: 'success',
                    explanation: 'Chained bracket notation accesses nested dictionary structure in O(1) sequential lookups.',
                  });
                }}
                className="w-full px-3 py-1.5 rounded-lg bg-[var(--accent-primary)] text-[var(--accent-on)] font-bold"
              >
                Inspect user_record['contact']['city']
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Live In-Memory Record Inspector */}
        <div className="space-y-2 p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-2 pb-1 border-b border-[var(--border-subtle)]">
              <span>Current Heap Object: `user_record`</span>
              <span className="text-[10px] font-mono text-emerald-400">
                {Object.keys(userRecord).length} root keys
              </span>
            </div>

            <pre className="font-mono text-xs p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] overflow-x-auto leading-relaxed">
              {JSON.stringify(userRecord, null, 2)}
            </pre>
          </div>

          <div className="text-[10px] text-[var(--text-muted)] flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
            <span>CPython PyDictObject</span>
            <span>Insertion Order Preserved</span>
          </div>
        </div>
      </div>

      {/* Evaluated Execution Trajectory Card */}
      <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-1.5">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-[var(--text-main)] font-bold">{simOutput.code}</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              simOutput.status === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : simOutput.status === 'fallback'
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}
          >
            {simOutput.status.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)] font-sans">Return Value:</span>
          <span
            className={`font-bold ${
              simOutput.status === 'keyerror'
                ? 'text-rose-400'
                : simOutput.status === 'fallback'
                ? 'text-amber-300'
                : 'text-emerald-400'
            }`}
          >
            {simOutput.result}
          </span>
        </div>

        <div className="text-[11px] text-[var(--text-muted)] font-sans pt-1">
          {simOutput.explanation}
        </div>
      </div>
    </div>
  );
};
