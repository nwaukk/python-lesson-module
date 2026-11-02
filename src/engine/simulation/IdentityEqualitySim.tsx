/**
 * Identity (is) vs Equality (==) Simulation Primitive
 * Section 8.4: Visualises object identity (memory id check) versus value equality (__eq__),
 * demonstrating CPython integer caching (-5 to 256), mutable collection duplication,
 * variable aliasing, and None singleton inspection.
 */

import React, { useState } from 'react';
import { ShieldCheck, Layers, HelpCircle, Check, X, ArrowRight, AlertTriangle, Sparkles } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface Scenario {
  id: string;
  title: string;
  description: string;
  code: string;
  varAName: string;
  varAValue: string;
  varAId: string;
  varBName: string;
  varBValue: string;
  varBId: string;
  isEqual: boolean; // ==
  isIdentical: boolean; // is
  explanation: string;
}

export const IdentityEqualitySim: React.FC = () => {
  const scenarios: Scenario[] = [
    {
      id: 'small-int',
      title: 'Small Integer Caching (-5 to 256)',
      description: 'CPython pre-allocates and caches small integers from -5 to 256 at startup.',
      code: `a = 200\nb = 200\nprint(a == b)  # True (values equal)\nprint(a is b)  # True (same cached memory address!)`,
      varAName: 'a',
      varAValue: '200',
      varAId: '0x104a3200',
      varBName: 'b',
      varBValue: '200',
      varBId: '0x104a3200',
      isEqual: true,
      isIdentical: true,
      explanation: 'Because 200 falls within [-5, 256], CPython points both a and b to the exact same singleton PyLongObject in heap memory. Therefore, a is b is True.',
    },
    {
      id: 'large-int',
      title: 'Large Integers Outside Cache',
      description: 'Integers outside [-5, 256] instantiated separately receive distinct memory objects.',
      code: `a = 1000\nb = 1000\nprint(a == b)  # True (values match)\nprint(a is b)  # False in separate REPL lines!`,
      varAName: 'a',
      varAValue: '1000',
      varAId: '0x104a9820',
      varBName: 'b',
      varBValue: '1000',
      varBId: '0x104be140',
      isEqual: true,
      isIdentical: false,
      explanation: 'Both objects have value 1000 (so a == b is True), but they reside at distinct memory addresses (0x104a9820 != 0x104be140), so a is b is False.',
    },
    {
      id: 'lists-distinct',
      title: 'Distinct Lists with Identical Content',
      description: 'Each list literal [...] allocates a brand new list container in heap memory.',
      code: `list_a = [1, 2, 3]\nlist_b = [1, 2, 3]\nprint(list_a == list_b)  # True (elements match)\nprint(list_a is list_b)  # False (two distinct lists!)`,
      varAName: 'list_a',
      varAValue: '[1, 2, 3]',
      varAId: '0x105021a0',
      varBName: 'list_b',
      varBValue: '[1, 2, 3]',
      varBId: '0x105089c0',
      isEqual: true,
      isIdentical: false,
      explanation: 'Even though both lists contain identical elements, they are two separate mutable containers. Mutating list_a does not affect list_b.',
    },
    {
      id: 'lists-alias',
      title: 'Shared Reference (Aliasing)',
      description: 'Assigning one variable to another copies the pointer reference, not the container.',
      code: `list_a = [1, 2, 3]\nlist_b = list_a\nprint(list_a == list_b)  # True\nprint(list_a is list_b)  # True (same object!)`,
      varAName: 'list_a',
      varAValue: '[1, 2, 3]',
      varAId: '0x105021a0',
      varBName: 'list_b',
      varBValue: '[1, 2, 3]',
      varBId: '0x105021a0',
      isEqual: true,
      isIdentical: true,
      explanation: 'Assignment (=) never copies objects. list_b receives the identical pointer address as list_a, so id(list_a) == id(list_b) is True.',
    },
    {
      id: 'none-singleton',
      title: 'None Singleton Comparison',
      description: 'None is a unique singleton in CPython. Always use "is" when checking for None (PEP 8).',
      code: `status = None\nprint(status is None)      # True (idiomatic PEP 8)\nprint(status is not None)  # False`,
      varAName: 'status',
      varAValue: 'None',
      varAId: '0x009f4000',
      varBName: 'None',
      varBValue: 'None',
      varBId: '0x009f4000',
      isEqual: true,
      isIdentical: true,
      explanation: 'There exists exactly ONE None object across the entire Python runtime. Checking status is None tests pointer identity directly without invoking __eq__ methods.',
    },
  ];

  const [activeScenarioId, setActiveScenarioId] = useState<string>('small-int');
  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Identity (is) vs Equality (==) Inspector"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {/* Scenario Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow-label text-[10px] text-[var(--text-dim)] mr-1">EXPLORE SCENARIOS:</span>
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveScenarioId(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                activeScenario.id === s.id
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold shadow-xs'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Active Scenario Overview */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
          <h3 className="font-bold text-sm text-[var(--text-main)]">{activeScenario.title}</h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">{activeScenario.description}</p>
        </div>

        {/* Visual Memory Slot Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Variable A Slot */}
          <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="eyebrow-label text-xs">VARIABLE 1</span>
              <span className="font-mono text-[10px] text-[var(--text-dim)]">id: {activeScenario.varAId}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono space-y-1">
              <div className="text-xs text-[var(--text-dim)]">Name: <span className="text-[var(--accent-primary)] font-bold">{activeScenario.varAName}</span></div>
              <div className="text-base font-bold text-[var(--text-main)]">Value: {activeScenario.varAValue}</div>
            </div>
          </div>

          {/* Variable B Slot */}
          <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="eyebrow-label text-xs">VARIABLE 2</span>
              <span className="font-mono text-[10px] text-[var(--text-dim)]">id: {activeScenario.varBId}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono space-y-1">
              <div className="text-xs text-[var(--text-dim)]">Name: <span className="text-[var(--accent-primary)] font-bold">{activeScenario.varBName}</span></div>
              <div className="text-base font-bold text-[var(--text-main)]">Value: {activeScenario.varBValue}</div>
            </div>
          </div>
        </div>

        {/* Comparison Verdict Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
          {/* Equality (==) */}
          <div className={`p-4 rounded-2xl border space-y-2 ${
            activeScenario.isEqual
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              : 'border-red-500/40 bg-red-500/10 text-red-300'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold">VALUE EQUALITY (==)</span>
              {activeScenario.isEqual ? <Check className="w-5 h-5 text-emerald-400" /> : <X className="w-5 h-5 text-red-400" />}
            </div>
            <div className="text-lg font-bold">
              {activeScenario.varAName} == {activeScenario.varBName} → {String(activeScenario.isEqual)}
            </div>
            <div className="text-[10px] font-sans opacity-80">
              Evaluates if both objects hold equivalent data contents.
            </div>
          </div>

          {/* Identity (is) */}
          <div className={`p-4 rounded-2xl border space-y-2 ${
            activeScenario.isIdentical
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              : 'border-amber-500/40 bg-amber-500/10 text-amber-300'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold">OBJECT IDENTITY (is)</span>
              {activeScenario.isIdentical ? <Check className="w-5 h-5 text-emerald-400" /> : <X className="w-5 h-5 text-amber-400" />}
            </div>
            <div className="text-lg font-bold">
              {activeScenario.varAName} is {activeScenario.varBName} → {String(activeScenario.isIdentical)}
            </div>
            <div className="text-[10px] font-sans opacity-80">
              Evaluates id(a) == id(b) (same memory location in heap).
            </div>
          </div>
        </div>

        {/* Code & Architectural Explanation */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="eyebrow-label text-xs">PYTHON IMPLEMENTATION &amp; EXPLANATION</span>
            <span className="text-[11px] font-mono text-[var(--accent-primary)] font-bold">CPython Memory Semantics</span>
          </div>
          <pre className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs text-sky-300 overflow-x-auto">
            {activeScenario.code}
          </pre>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            {activeScenario.explanation}
          </p>
        </div>

        {/* PEP 8 Golden Rule */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-sky-500/30 text-xs space-y-1">
          <div className="flex items-center gap-2 text-sky-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>PEP 8 Rule of Thumb</span>
          </div>
          <p className="text-[var(--text-muted)] leading-relaxed">
            Always use <code className="text-sky-300 font-mono">is</code> or <code className="text-sky-300 font-mono">is not</code> when testing for singletons like <code className="text-emerald-400 font-mono">None</code>. For general value comparisons (numbers, strings, sequences, dictionaries), always use <code className="text-emerald-400 font-mono">==</code> or <code className="text-emerald-400 font-mono">!=</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
