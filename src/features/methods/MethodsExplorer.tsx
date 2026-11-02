/**
 * Python Methods Explorer
 * Full implementation of Section 9 of the Master Specification.
 * Live execution via Pyodide, side-by-side comparisons, 8-part execution breakdown,
 * and clear mutability signals (Returns new value vs Modifies in place).
 */

import React, { useState } from 'react';
import {
  Layers,
  Play,
  Check,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Search,
  Scale,
  Shield,
  Zap,
  Info,
  RotateCcw,
} from 'lucide-react';
import { DATA_TYPES } from '../../design/tokens';
import {
  METHODS_REGISTRY,
  MethodEntry,
  PythonObjectType,
} from '../../data/methodsRegistry';
import { usePythonRuntime } from '../../engine/runtime/runtimeContext';

export const MethodsExplorer: React.FC = () => {
  const [selectedType, setSelectedType] = useState<PythonObjectType>('str');
  const [selectedMethodName, setSelectedMethodName] = useState<string>('upper');
  const [targetObject, setTargetObject] = useState<string>('"python visual lab"');
  const [methodArgs, setMethodArgs] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'inspect' | 'compare'>('inspect');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<{
    code: string;
    returned: string;
    afterState: string;
    isRealPython: boolean;
    explanation: string;
  } | null>(null);

  const { runCode } = usePythonRuntime();

  // Filter methods by type and search query
  const methodsForType = METHODS_REGISTRY.filter((m) => m.type === selectedType);
  const filteredMethods = methodsForType.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedMethod: MethodEntry =
    METHODS_REGISTRY.find((m) => m.name === selectedMethodName && m.type === selectedType) ||
    methodsForType[0] ||
    METHODS_REGISTRY[0];

  const handleSelectMethod = (m: MethodEntry) => {
    setSelectedMethodName(m.name);
    setTargetObject(m.defaultTarget);
    setMethodArgs(m.defaultArgs);
    setExecutionResult(null);
  };

  const handleTypeChange = (typeKey: PythonObjectType) => {
    setSelectedType(typeKey);
    const first = METHODS_REGISTRY.find((m) => m.type === typeKey);
    if (first) {
      handleSelectMethod(first);
    }
    setSearchQuery('');
  };

  const handleExecute = async () => {
    setIsRunning(true);
    const callArgs = methodArgs.trim();
    const generatedCode = callArgs
      ? `obj = ${targetObject}\nret = obj.${selectedMethod.name}(${callArgs})`
      : `obj = ${targetObject}\nret = obj.${selectedMethod.name}()`;

    const runnerScript = `
${generatedCode}
import reprlib
print("___RETURNED___")
print(repr(ret))
print("___AFTER___")
print(repr(obj))
`;

    try {
      const res = await runCode(runnerScript);
      if (!res.error && res.stdout.includes('___RETURNED___')) {
        const parts = res.stdout.split('___RETURNED___')[1]?.split('___AFTER___') || [];
        const returnedVal = parts[0]?.trim() || 'None';
        const afterVal = parts[1]?.trim() || targetObject;

        setExecutionResult({
          code: callArgs ? `${targetObject}.${selectedMethod.name}(${callArgs})` : `${targetObject}.${selectedMethod.name}()`,
          returned: returnedVal,
          afterState: `${afterVal} ${selectedMethod.mutates ? '(modified in place)' : '(unchanged)'}`,
          isRealPython: true,
          explanation: selectedMethod.mutates
            ? `Python executed .${selectedMethod.name}() directly in memory on the ${selectedType} object. The object was modified in place and returned ${returnedVal}.`
            : `Python evaluated .${selectedMethod.name}() on the immutable ${selectedType} and returned a brand-new value (${returnedVal}), leaving the original object unchanged.`,
        });
      } else {
        // Fallback to pre-authored example values
        const fallbackExample = selectedMethod.examples[0];
        setExecutionResult({
          code: fallbackExample?.code || `${targetObject}.${selectedMethod.name}(${methodArgs})`,
          returned: fallbackExample?.returned || 'Executed',
          afterState: fallbackExample?.afterState || targetObject,
          isRealPython: false,
          explanation: selectedMethod.purpose,
        });
      }
    } catch {
      const fallbackExample = selectedMethod.examples[0];
      setExecutionResult({
        code: fallbackExample?.code || `${targetObject}.${selectedMethod.name}(${methodArgs})`,
        returned: fallbackExample?.returned || 'Executed',
        afterState: fallbackExample?.afterState || targetObject,
        isRealPython: false,
        explanation: selectedMethod.purpose,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const isImmutable = selectedType === 'str' || selectedType === 'tuple';

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-app)] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-[var(--accent-primary)]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-main)]">
              Python Methods Explorer
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Explore built-in methods, inspect parameters, understand mutability signals, and compare alternatives.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs">
          <button
            onClick={() => setActiveTab('inspect')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'inspect'
                ? 'bg-[var(--accent-primary)] text-[var(--accent-on)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Inspect &amp; Test
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            disabled={!selectedMethod.comparison}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40 ${
              activeTab === 'compare'
                ? 'bg-[var(--accent-primary)] text-[var(--accent-on)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>
        </div>
      </div>

      {/* Type Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['str', 'list', 'tuple', 'set', 'dict'] as PythonObjectType[]).map((typeKey) => {
          const dt = DATA_TYPES[typeKey];
          const isSelected = selectedType === typeKey;
          const isTypeImmutable = typeKey === 'str' || typeKey === 'tuple';

          return (
            <button
              key={typeKey}
              onClick={() => handleTypeChange(typeKey)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono font-bold transition-all shrink-0 ${
                isSelected
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]/30'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <span>{dt?.symbol}</span>
              <span>{typeKey}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-sans uppercase font-bold ${
                  isTypeImmutable
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                }`}
              >
                {isTypeImmutable ? 'Immutable' : 'Mutable'}
              </span>
            </button>
          );
        })}
      </div>

      {activeTab === 'inspect' ? (
        /* ================================================================ */
        /* TAB 1: INSPECT & TEST STAGE                                      */
        /* ================================================================ */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Method List with Search */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[var(--text-dim)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${selectedType} methods...`}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-dim)] focus:ring-1 focus:ring-[var(--accent-primary)]"
              />
            </div>

            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {filteredMethods.map((m) => {
                const isSelected = selectedMethod.name === m.name;
                return (
                  <div
                    key={m.name}
                    onClick={() => handleSelectMethod(m)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] ring-1 ring-[var(--accent-primary)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-[var(--text-main)]">
                        .{m.name}()
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          m.mutates
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {m.mutates ? 'Modifies in Place' : 'Returns New Value'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">{m.purpose}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: 8-Part Execution & Breakdown Stage */}
          <div className="lg:col-span-2 space-y-5">
            {/* Stage Header */}
            <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
                <div>
                  <div className="font-mono text-sm font-bold text-[var(--text-main)]">
                    {selectedMethod.signature}
                  </div>
                  <div className="text-xs text-[var(--text-dim)] mt-0.5">
                    {selectedMethod.purpose}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-bold border ${
                      selectedMethod.mutates
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {selectedMethod.mutates ? <Zap className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                    <span>{selectedMethod.mutates ? 'In-Place Mutation' : 'Immutable Guarantee'}</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-dim)]">
                    Introduced: Day {selectedMethod.introducedInDay}
                  </span>
                </div>
              </div>

              {/* Parameters Breakdown */}
              {selectedMethod.parameters.length > 0 && (
                <div className="space-y-1.5">
                  <span className="eyebrow-label text-[10px] text-[var(--text-dim)] block">
                    PARAMETER SCHEMA
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedMethod.parameters.map((p) => (
                      <div
                        key={p.name}
                        className="p-2 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-xs font-mono"
                      >
                        <div className="flex items-center justify-between text-sky-400 font-bold">
                          <span>{p.name}</span>
                          <span className="text-[10px] text-[var(--text-dim)] font-sans">
                            {p.required ? 'Required' : `Default: ${p.defaultValue}`}
                          </span>
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] font-sans mt-0.5">
                          {p.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Target & Arguments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="eyebrow-label block mb-1 text-[10px]">1. ORIGINAL OBJECT</label>
                  <input
                    type="text"
                    value={targetObject}
                    onChange={(e) => setTargetObject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] font-mono text-xs text-[var(--text-main)] focus:ring-1 focus:ring-[var(--accent-primary)]"
                  />
                </div>
                <div>
                  <label className="eyebrow-label block mb-1 text-[10px]">2. METHOD ARGUMENTS</label>
                  <input
                    type="text"
                    value={methodArgs}
                    placeholder="(no arguments required)"
                    onChange={(e) => setMethodArgs(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] font-mono text-xs text-[var(--text-main)] focus:ring-1 focus:ring-[var(--accent-primary)]"
                  />
                </div>
              </div>

              {/* Execution Action Button */}
              <button
                onClick={handleExecute}
                disabled={isRunning}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] text-xs font-bold shadow-md disabled:opacity-50 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunning ? 'Evaluating in Pyodide...' : 'Execute Method in Python'}</span>
              </button>
            </div>

            {/* 8-Part Execution Breakdown Output (Section 9 Requirement) */}
            {executionResult && (
              <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4 font-mono text-xs animate-in fade-in">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 font-sans">
                  <span className="eyebrow-label text-[10px] text-[var(--accent-primary)]">
                    8-POINT EXECUTION BREAKDOWN
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/30 border border-white/10 uppercase">
                    {executionResult.isRealPython ? 'REAL PYTHON' : 'SIMULATION'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 1. Original Object */}
                  <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] text-[var(--text-dim)] font-sans block mb-1">
                      1. Original Object
                    </span>
                    <span className="text-sky-300 font-bold">{targetObject}</span>
                  </div>

                  {/* 2 & 3. Method & Arguments */}
                  <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] text-[var(--text-dim)] font-sans block mb-1">
                      2 &amp; 3. Method &amp; Arguments
                    </span>
                    <span className="text-emerald-400 font-bold">
                      .{selectedMethod.name}({methodArgs || ''})
                    </span>
                  </div>

                  {/* 4. Generated Python Code */}
                  <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] sm:col-span-2">
                    <span className="text-[10px] text-[var(--text-dim)] font-sans block mb-1">
                      4. Generated Python Instruction
                    </span>
                    <span className="text-purple-300 font-bold">{executionResult.code}</span>
                  </div>

                  {/* 6. Returned Result */}
                  <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] text-[var(--text-dim)] font-sans block mb-1">
                      6. Returned Value
                    </span>
                    <span className="text-emerald-400 font-bold">{executionResult.returned}</span>
                  </div>

                  {/* 7. Object Afterwards */}
                  <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] text-[var(--text-dim)] font-sans block mb-1">
                      7. Object State Afterwards
                    </span>
                    <span className="text-amber-300 font-bold">{executionResult.afterState}</span>
                  </div>
                </div>

                {/* 8. Plain Explanation */}
                <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 font-sans text-xs text-[var(--text-muted)] space-y-1">
                  <span className="text-[10px] text-[var(--text-dim)] uppercase font-bold block">
                    8. Plain Explanation
                  </span>
                  <p className="leading-relaxed">{executionResult.explanation}</p>
                </div>
              </div>
            )}

            {/* Edge Cases & Common Errors */}
            {(selectedMethod.edgeCases.length > 0 || selectedMethod.commonErrors.length > 0) && (
              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3 text-xs">
                {selectedMethod.edgeCases.length > 0 && (
                  <div>
                    <span className="eyebrow-label text-[10px] text-sky-400 block mb-1">EDGE CASES</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[var(--text-muted)]">
                      {selectedMethod.edgeCases.map((ec, i) => (
                        <li key={i}>{ec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedMethod.commonErrors.length > 0 && (
                  <div className="pt-2 border-t border-[var(--border-subtle)]">
                    <span className="eyebrow-label text-[10px] text-amber-400 block mb-1">
                      COMMON ERRORS &amp; MISCONCEPTIONS
                    </span>
                    {selectedMethod.commonErrors.map((err, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-[var(--bg-app)] border border-amber-500/20 space-y-1">
                        <div className="font-mono text-amber-300 font-bold">{err.error}</div>
                        <div className="text-[11px] text-[var(--text-muted)]">Cause: {err.cause}</div>
                        <div className="text-[11px] text-emerald-400 font-medium">Fix: {err.fix}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ================================================================ */
        /* TAB 2: SIDE-BY-SIDE COMPARISON MODAL                             */
        /* ================================================================ */
        selectedMethod.comparison && (
          <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div>
                <span className="eyebrow-label text-[10px] text-[var(--accent-primary)] block">
                  SIDE-BY-SIDE METHOD COMPARISON
                </span>
                <h2 className="text-lg font-bold text-[var(--text-main)]">
                  {selectedMethod.comparison.comparisonTitle}
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('inspect')}
                className="text-xs text-[var(--accent-primary)] hover:underline"
              >
                ← Back to Inspector
              </button>
            </div>

            <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/5 text-xs text-sky-200 space-y-1">
              <span className="font-bold text-sky-400 block">Key Distinguishing Difference:</span>
              <p className="leading-relaxed">{selectedMethod.comparison.keyDifference}</p>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Method A */}
              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-3 font-mono text-xs">
                <div className="font-bold text-emerald-400 font-sans text-sm">
                  .{selectedMethod.name}()
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[var(--text-dim)] font-sans block">Python Call:</span>
                  <code className="text-sky-300 block bg-black/40 p-2 rounded">
                    {selectedMethod.comparison.exampleComparison.methodACall}
                  </code>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[var(--text-dim)] font-sans block">Result:</span>
                  <code className="text-emerald-300 block bg-black/40 p-2 rounded">
                    {selectedMethod.comparison.exampleComparison.methodAResult}
                  </code>
                </div>
              </div>

              {/* Method B Counterpart */}
              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-3 font-mono text-xs">
                <div className="font-bold text-purple-400 font-sans text-sm">
                  .{selectedMethod.comparison.counterpartName}()
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[var(--text-dim)] font-sans block">Python Call:</span>
                  <code className="text-sky-300 block bg-black/40 p-2 rounded">
                    {selectedMethod.comparison.exampleComparison.methodBCall}
                  </code>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[var(--text-dim)] font-sans block">Result:</span>
                  <code className="text-purple-300 block bg-black/40 p-2 rounded">
                    {selectedMethod.comparison.exampleComparison.methodBResult}
                  </code>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
