import React, { useState } from 'react';
import { Layers, Plus, Trash2, RefreshCw, Code, CheckCircle2 } from 'lucide-react';

type VennOp = 'union' | 'intersection' | 'diff_a_b' | 'diff_b_a' | 'sym_diff' | 'subset' | 'disjoint';

export const VennDiagramSim: React.FC = () => {
  const [setA, setSetA] = useState<string[]>(['Python', 'SQL', 'FastAPI', 'Docker']);
  const [setB, setSetB] = useState<string[]>(['Python', 'TypeScript', 'React', 'Docker']);
  const [selectedOp, setSelectedOp] = useState<VennOp>('intersection');
  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');

  // Set calculations
  const aSet = new Set(setA);
  const bSet = new Set(setB);

  const intersection = setA.filter((x) => bSet.has(x));
  const onlyA = setA.filter((x) => !bSet.has(x));
  const onlyB = setB.filter((x) => !aSet.has(x));
  const union = Array.from(new Set([...setA, ...setB]));
  const symDiff = [...onlyA, ...onlyB];
  const isSubset = setA.every((x) => bSet.has(x));
  const isDisjoint = intersection.length === 0;

  let activeResult: string[] = [];
  let opSymbol = '&';
  let opMethod = 'A.intersection(B)';
  let opExplanation = 'Items present in both Set A and Set B.';
  let booleanResult: boolean | null = null;

  switch (selectedOp) {
    case 'union':
      activeResult = union;
      opSymbol = '|';
      opMethod = 'A.union(B)';
      opExplanation = 'All unique elements from both Set A and Set B.';
      break;
    case 'intersection':
      activeResult = intersection;
      opSymbol = '&';
      opMethod = 'A.intersection(B)';
      opExplanation = 'Only elements present in both Set A and Set B.';
      break;
    case 'diff_a_b':
      activeResult = onlyA;
      opSymbol = '-';
      opMethod = 'A.difference(B)';
      opExplanation = 'Elements that belong to Set A, but NOT to Set B.';
      break;
    case 'diff_b_a':
      activeResult = onlyB;
      opSymbol = '-';
      opMethod = 'B.difference(A)';
      opExplanation = 'Elements that belong to Set B, but NOT to Set A.';
      break;
    case 'sym_diff':
      activeResult = symDiff;
      opSymbol = '^';
      opMethod = 'A.symmetric_difference(B)';
      opExplanation = 'Elements in either Set A or Set B, but NOT in both (exclusive OR).';
      break;
    case 'subset':
      booleanResult = isSubset;
      opSymbol = '<=';
      opMethod = 'A.issubset(B)';
      opExplanation = 'Returns True if every element of Set A is contained in Set B.';
      break;
    case 'disjoint':
      booleanResult = isDisjoint;
      opSymbol = 'isdisjoint';
      opMethod = 'A.isdisjoint(B)';
      opExplanation = 'Returns True if Set A and Set B have zero elements in common (intersection is empty).';
      break;
  }

  const handleAddItemA = () => {
    if (!inputA.trim()) return;
    if (!aSet.has(inputA.trim())) {
      setSetA([...setA, inputA.trim()]);
    }
    setInputA('');
  };

  const handleAddItemB = () => {
    if (!inputB.trim()) return;
    if (!bSet.has(inputB.trim())) {
      setSetB([...setB, inputB.trim()]);
    }
    setInputB('');
  };

  const handleReset = () => {
    setSetA(['Python', 'SQL', 'FastAPI', 'Docker']);
    setSetB(['Python', 'TypeScript', 'React', 'Docker']);
    setSelectedOp('intersection');
    setInputA('');
    setInputB('');
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[var(--accent-primary)]" />
            <h3 className="font-extrabold text-sm text-[var(--text-main)]">
              Interactive Mathematical Set &amp; Venn Operations Studio
            </h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Visualize Union, Intersection, Difference, and Symmetric Difference with real Python set operator semantics.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="self-start sm:self-auto px-2.5 py-1 text-xs rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Sets</span>
        </button>
      </div>

      {/* Operation Selection Bar */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        <button
          onClick={() => setSelectedOp('union')}
          className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
            selectedOp === 'union'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] border-transparent'
              : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          Union (A | B)
        </button>

        <button
          onClick={() => setSelectedOp('intersection')}
          className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
            selectedOp === 'intersection'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] border-transparent'
              : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          Intersection (A &amp; B)
        </button>

        <button
          onClick={() => setSelectedOp('diff_a_b')}
          className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
            selectedOp === 'diff_a_b'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] border-transparent'
              : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          Difference (A - B)
        </button>

        <button
          onClick={() => setSelectedOp('diff_b_a')}
          className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
            selectedOp === 'diff_b_a'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] border-transparent'
              : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          Difference (B - A)
        </button>

        <button
          onClick={() => setSelectedOp('sym_diff')}
          className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
            selectedOp === 'sym_diff'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] border-transparent'
              : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          Symmetric Diff (A ^ B)
        </button>

        <button
          onClick={() => setSelectedOp('subset')}
          className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
            selectedOp === 'subset'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] border-transparent'
              : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          Subset (A &lt;= B)
        </button>

        <button
          onClick={() => setSelectedOp('disjoint')}
          className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
            selectedOp === 'disjoint'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] border-transparent'
              : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          Disjoint Test
        </button>
      </div>

      {/* Live Python Expression & Result Box */}
      <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-1 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-[var(--text-main)] font-bold">
              {selectedOp === 'diff_b_a'
                ? 'B - A  # Or B.difference(A)'
                : selectedOp === 'subset'
                ? 'A <= B  # Or A.issubset(B)'
                : selectedOp === 'disjoint'
                ? 'A.isdisjoint(B)'
                : `A ${opSymbol} B  # Or ${opMethod}`}
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-sans text-[var(--text-muted)]">
            {opExplanation}
          </span>
        </div>

        <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)]">Evaluated Result:</span>
          {booleanResult !== null ? (
            <span
              className={`font-bold px-2 py-0.5 rounded font-mono ${
                booleanResult
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              {booleanResult ? 'True' : 'False'}
            </span>
          ) : (
            <span className="font-bold text-emerald-400 font-mono">
              {activeResult.length === 0 ? 'set()' : `{${activeResult.map((x) => `"${x}"`).join(', ')}}`}
            </span>
          )}
        </div>
      </div>

      {/* Visual Venn Diagram Zones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Only in Set A */}
        <div
          className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
            selectedOp === 'diff_a_b' || selectedOp === 'union' || selectedOp === 'sym_diff'
              ? 'bg-blue-500/10 border-blue-500/50 shadow-sm'
              : 'bg-[var(--bg-app)] border-[var(--border-subtle)] opacity-70'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-blue-400">
                Only in A (A - B)
              </span>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                {onlyA.length} items
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {onlyA.map((item) => (
                <span
                  key={item}
                  className="px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-blue-500/30 text-xs font-mono text-[var(--text-main)]"
                >
                  {item}
                </span>
              ))}
              {onlyA.length === 0 && (
                <span className="text-[11px] text-[var(--text-muted)] italic">None</span>
              )}
            </div>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] mt-2">
            Unique to Set A
          </span>
        </div>

        {/* Intersection: In Both A and B */}
        <div
          className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
            selectedOp === 'intersection' || selectedOp === 'union'
              ? 'bg-emerald-500/15 border-emerald-500/60 shadow-sm'
              : 'bg-[var(--bg-app)] border-[var(--border-subtle)] opacity-70'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-emerald-400">
                Intersection (A &amp; B)
              </span>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                {intersection.length} items
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {intersection.map((item) => (
                <span
                  key={item}
                  className="px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300"
                >
                  {item}
                </span>
              ))}
              {intersection.length === 0 && (
                <span className="text-[11px] text-[var(--text-muted)] italic">No shared items (Disjoint)</span>
              )}
            </div>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] mt-2">
            Common shared elements
          </span>
        </div>

        {/* Only in Set B */}
        <div
          className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
            selectedOp === 'diff_b_a' || selectedOp === 'union' || selectedOp === 'sym_diff'
              ? 'bg-purple-500/10 border-purple-500/50 shadow-sm'
              : 'bg-[var(--bg-app)] border-[var(--border-subtle)] opacity-70'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-purple-400">
                Only in B (B - A)
              </span>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                {onlyB.length} items
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {onlyB.map((item) => (
                <span
                  key={item}
                  className="px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-purple-500/30 text-xs font-mono text-[var(--text-main)]"
                >
                  {item}
                </span>
              ))}
              {onlyB.length === 0 && (
                <span className="text-[11px] text-[var(--text-muted)] italic">None</span>
              )}
            </div>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] mt-2">
            Unique to Set B
          </span>
        </div>
      </div>

      {/* Set Mutation Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
        {/* Set A Control */}
        <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-[var(--text-main)]">Set A (Backend Stack)</span>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">len={setA.length}</span>
          </div>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={inputA}
              onChange={(e) => setInputA(e.target.value)}
              placeholder="Add skill to A"
              className="flex-1 px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] text-xs focus:outline-none focus:border-[var(--accent-primary)] font-mono"
            />
            <button
              onClick={handleAddItemA}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Set B Control */}
        <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-[var(--text-main)]">Set B (Frontend Stack)</span>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">len={setB.length}</span>
          </div>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={inputB}
              onChange={(e) => setInputB(e.target.value)}
              placeholder="Add skill to B"
              className="flex-1 px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] text-xs focus:outline-none focus:border-[var(--accent-primary)] font-mono"
            />
            <button
              onClick={handleAddItemB}
              className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
