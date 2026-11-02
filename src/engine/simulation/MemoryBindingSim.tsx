/**
 * Memory & Object-Binding Simulation Primitive
 * Section 8.4 & 14 (Day 2): Dissects names as pointers bound to objects in heap memory.
 * Features:
 * 1. Preset guided scenarios:
 *    - Shared List Aliasing & In-Place Mutation (b = a, b.append(3))
 *    - Integer Rebinding (x = 10, y = x, x = 20 - rebinding does not mutate y)
 *    - Multiple Assignment & Tuple Swapping (a, b = b, a)
 * 2. Interactive custom binding playground:
 *    - Learners create identifiers, pick types/values, and watch name tags and arrow pointers update.
 */

import React, { useState } from 'react';
import { ArrowRight, RotateCcw, Link2, Box, Layers, Sparkles, PlusCircle } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface VariableBinding {
  name: string;
  targetObjectId: number;
}

interface HeapObject {
  id: number;
  type: string;
  value: string;
  isMutable: boolean;
  color: string;
}

interface ScenarioStep {
  code: string;
  action: string;
  bindings: VariableBinding[];
  objects: HeapObject[];
}

const SCENARIOS: { id: string; title: string; steps: ScenarioStep[] }[] = [
  {
    id: 'shared-list',
    title: '1. Shared List Aliasing (b = a & in-place mutation)',
    steps: [
      {
        code: 'a = [1, 2]',
        action: 'Name "a" is bound to a new list object in heap memory (#obj-101).',
        bindings: [{ name: 'a', targetObjectId: 101 }],
        objects: [{ id: 101, type: 'list', value: '[1, 2]', isMutable: true, color: '#f472b6' }],
      },
      {
        code: 'b = a',
        action: 'Name "b" is assigned "a". Both names now point to the EXACT SAME object (#obj-101) in memory!',
        bindings: [
          { name: 'a', targetObjectId: 101 },
          { name: 'b', targetObjectId: 101 },
        ],
        objects: [{ id: 101, type: 'list', value: '[1, 2]', isMutable: true, color: '#f472b6' }],
      },
      {
        code: 'b.append(3)',
        action: 'List #obj-101 is mutated in place. Because "a" and "b" share the same object, both names see the change!',
        bindings: [
          { name: 'a', targetObjectId: 101 },
          { name: 'b', targetObjectId: 101 },
        ],
        objects: [{ id: 101, type: 'list', value: '[1, 2, 3]', isMutable: true, color: '#f472b6' }],
      },
      {
        code: 'a = [1, 2, 3]',
        action: 'Rebinding: "a" is rebound to a brand new object (#obj-102). The pointer moves, while "b" remains pointing to #obj-101.',
        bindings: [
          { name: 'a', targetObjectId: 102 },
          { name: 'b', targetObjectId: 101 },
        ],
        objects: [
          { id: 101, type: 'list', value: '[1, 2, 3]', isMutable: true, color: '#f472b6' },
          { id: 102, type: 'list', value: '[1, 2, 3]', isMutable: true, color: '#38bdf8' },
        ],
      },
    ],
  },
  {
    id: 'int-rebinding',
    title: '2. Integer Rebinding (x = 10, y = x, x = 20)',
    steps: [
      {
        code: 'x = 10',
        action: 'Name "x" points to integer object 10 (#obj-201). Integers are immutable in Python.',
        bindings: [{ name: 'x', targetObjectId: 201 }],
        objects: [{ id: 201, type: 'int', value: '10', isMutable: false, color: '#38bdf8' }],
      },
      {
        code: 'y = x',
        action: 'Name "y" is assigned "x". Both point to #obj-201 (value 10).',
        bindings: [
          { name: 'x', targetObjectId: 201 },
          { name: 'y', targetObjectId: 201 },
        ],
        objects: [{ id: 201, type: 'int', value: '10', isMutable: false, color: '#38bdf8' }],
      },
      {
        code: 'x = 20',
        action: 'Rebinding x: "x" now points to new integer object 20 (#obj-202). "y" still points to 10! Integers cannot mutate in place.',
        bindings: [
          { name: 'x', targetObjectId: 202 },
          { name: 'y', targetObjectId: 201 },
        ],
        objects: [
          { id: 201, type: 'int', value: '10', isMutable: false, color: '#38bdf8' },
          { id: 202, type: 'int', value: '20', isMutable: false, color: '#10b981' },
        ],
      },
    ],
  },
  {
    id: 'multiple-assignment',
    title: '3. Multiple Assignment & Swap (a, b = b, a)',
    steps: [
      {
        code: 'a, b = 10, 20',
        action: 'Tuple packing and unpacking: 10 and 20 are evaluated first, then "a" binds to 10 and "b" binds to 20.',
        bindings: [
          { name: 'a', targetObjectId: 301 },
          { name: 'b', targetObjectId: 302 },
        ],
        objects: [
          { id: 301, type: 'int', value: '10', isMutable: false, color: '#38bdf8' },
          { id: 302, type: 'int', value: '20', isMutable: false, color: '#f59e0b' },
        ],
      },
      {
        code: 'a, b = b, a',
        action: 'Python evaluates right-hand side tuple (20, 10) in temporary memory, then swaps the bindings without needing a temp variable!',
        bindings: [
          { name: 'a', targetObjectId: 302 },
          { name: 'b', targetObjectId: 301 },
        ],
        objects: [
          { id: 301, type: 'int', value: '10', isMutable: false, color: '#38bdf8' },
          { id: 302, type: 'int', value: '20', isMutable: false, color: '#f59e0b' },
        ],
      },
    ],
  },
];

export const MemoryBindingSim: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('shared-list');
  const [step, setStep] = useState<number>(1);
  const [beforeAfter, setBeforeAfter] = useState<'before' | 'after'>('after');

  // Custom interactive playground state
  const [customVars, setCustomVars] = useState<VariableBinding[]>([
    { name: 'city', targetObjectId: 501 },
    { name: 'capital', targetObjectId: 501 },
  ]);
  const [customObjs, setCustomObjs] = useState<HeapObject[]>([
    { id: 501, type: 'str', value: '"Abuja"', isMutable: false, color: '#38bdf8' },
  ]);
  const [newVarName, setNewVarName] = useState<string>('state');
  const [newVarType, setNewVarType] = useState<string>('str');
  const [newVarValue, setNewVarValue] = useState<string>('"FCT"');

  const scenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];
  const currentStep = scenario.steps[step - 1] || scenario.steps[0];

  const handleScenarioChange = (id: string) => {
    setActiveScenarioId(id);
    setStep(1);
  };

  const handleAddCustomBinding = () => {
    const trimmed = newVarName.trim();
    if (!trimmed) return;
    const nextId = customObjs.length > 0 ? Math.max(...customObjs.map((o) => o.id)) + 1 : 501;
    const colors = ['#f472b6', '#38bdf8', '#10b981', '#f59e0b', '#a855f7'];
    const chosenColor = colors[nextId % colors.length];

    const newObj: HeapObject = {
      id: nextId,
      type: newVarType,
      value: newVarValue,
      isMutable: newVarType === 'list' || newVarType === 'dict' || newVarType === 'set',
      color: chosenColor,
    };

    setCustomObjs([...customObjs, newObj]);
    setCustomVars([...customVars.filter((v) => v.name !== trimmed), { name: trimmed, targetObjectId: nextId }]);
    setNewVarName('');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Memory &amp; Object-Binding Engine"
        badge="simulation"
        currentStep={step}
        totalSteps={scenario.steps.length}
        onStepNext={() => setStep((s) => Math.min(scenario.steps.length, s + 1))}
        onStepPrev={() => setStep((s) => Math.max(1, s - 1))}
        onReset={() => setStep(1)}
        hasBeforeAfter={true}
        beforeAfterMode={beforeAfter}
        onToggleBeforeAfter={() => setBeforeAfter(beforeAfter === 'after' ? 'before' : 'after')}
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {/* Scenario Selector Tabs */}
        <div className="space-y-2">
          <span className="eyebrow-label text-[10px] text-[var(--accent-primary)]">
            SELECT MEMORY BINDING SCENARIO
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleScenarioChange(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 border ${
                  activeScenarioId === s.id
                    ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] font-bold shadow-xs'
                    : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* Code Step Banner */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="space-y-1">
            <span className="eyebrow-label text-[10px] text-[var(--accent-primary)]">
              EXECUTING INSTRUCTION
            </span>
            <div className="font-mono text-sm font-bold text-sky-400">
              &gt;&gt;&gt; {currentStep.code}
            </div>
            <p className="text-xs text-[var(--text-muted)]">{currentStep.action}</p>
          </div>
          <div className="text-xs font-mono text-[var(--text-dim)] shrink-0 self-start sm:self-auto">
            Step {step} of {scenario.steps.length}
          </div>
        </div>

        {/* Visual Memory Stage: Names on Left, Objects on Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-inner">
          {/* Namespace Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
              <Layers className="w-4 h-4 text-purple-400" />
              <span className="eyebrow-label text-xs">NAMESPACE (VARIABLE IDENTIFIERS)</span>
            </div>

            <div className="space-y-3">
              {currentStep.bindings.map((b) => (
                <div
                  key={b.name}
                  className="p-3.5 rounded-2xl border-2 border-purple-500/40 bg-purple-500/10 flex items-center justify-between animate-in fade-in duration-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-base text-purple-300">{b.name}</span>
                    <span className="text-[10px] text-[var(--text-dim)]">(identifier)</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-purple-200 font-bold">
                    <span>points to</span>
                    <ArrowRight className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span className="px-2 py-0.5 rounded bg-[var(--bg-app)] border border-purple-500/30">
                      #obj-{b.targetObjectId}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Heap Memory Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
              <Box className="w-4 h-4 text-amber-400" />
              <span className="eyebrow-label text-xs">HEAP MEMORY (STORED OBJECTS)</span>
            </div>

            <div className="space-y-3">
              {currentStep.objects.map((obj) => (
                <div
                  key={obj.id}
                  className="p-3.5 rounded-2xl border-2 flex flex-col gap-1.5 transition-all shadow-md"
                  style={{
                    backgroundColor: `${obj.color}15`,
                    borderColor: `${obj.color}50`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[var(--text-main)]">
                      #obj-{obj.id}
                    </span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${obj.color}25`, color: obj.color }}
                    >
                      {obj.type} • {obj.isMutable ? 'Mutable' : 'Immutable'}
                    </span>
                  </div>

                  <div className="font-mono text-sm font-black text-[var(--text-main)] bg-[var(--bg-app)]/60 p-2.5 rounded-xl border border-white/5">
                    {obj.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CPython Note */}
        <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[11px] text-[var(--text-dim)] space-y-1">
          <span className="font-bold text-[var(--text-muted)]">CPython Implementation Detail</span>
          <p>
            In Python, everything is an object. Numbers, strings, and lists live in heap memory. Small integers (-5 to 256) and short strings are cached and interned by CPython as an optimisation, but the language guarantee is that assignments bind names to references, not copies.
          </p>
        </div>
      </div>
    </div>
  );
};
