/**
 * Iteration Timeline Simulation Primitive
 * Section 14 (Day 10 Signature Simulation):
 * Visualizes each pass of a loop with the loop variable, accumulator state,
 * condition evaluation, and printed output at that exact moment.
 */

import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, CheckCircle2, Terminal } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface LoopPass {
  passIndex: number;
  line: number;
  loopVar: string;
  loopVal: string | number;
  accumulator: number;
  conditionText: string;
  conditionResult: boolean;
  outputLine?: string;
  note: string;
}

interface PresetScenario {
  id: string;
  label: string;
  codeLines: string[];
  passes: LoopPass[];
}

const SCENARIOS: PresetScenario[] = [
  {
    id: 'sum-list',
    label: 'for-in Accumulator',
    codeLines: [
      'scores = [15, 20, 10, 25]',
      'total = 0',
      'for s in scores:',
      '    total += s',
      '    print(f"Added {s} -> {total}")',
      'print("Final:", total)',
    ],
    passes: [
      { passIndex: 0, line: 2, loopVar: 's', loopVal: '—', accumulator: 0, conditionText: 'Initialize total = 0', conditionResult: true, note: 'Accumulator initialized to 0 before loop starts.' },
      { passIndex: 1, line: 4, loopVar: 's', loopVal: 15, accumulator: 15, conditionText: 'next(iter(scores)) -> 15', conditionResult: true, outputLine: 'Added 15 -> 15', note: 'Pass 1: s bound to 15; total updated 0 + 15 = 15.' },
      { passIndex: 2, line: 4, loopVar: 's', loopVal: 20, accumulator: 35, conditionText: 'next(iter(scores)) -> 20', conditionResult: true, outputLine: 'Added 20 -> 35', note: 'Pass 2: s rebound to 20; total updated 15 + 20 = 35.' },
      { passIndex: 3, line: 4, loopVar: 's', loopVal: 10, accumulator: 45, conditionText: 'next(iter(scores)) -> 10', conditionResult: true, outputLine: 'Added 10 -> 45', note: 'Pass 3: s rebound to 10; total updated 35 + 10 = 45.' },
      { passIndex: 4, line: 4, loopVar: 's', loopVal: 25, accumulator: 70, conditionText: 'next(iter(scores)) -> 25', conditionResult: true, outputLine: 'Added 25 -> 70', note: 'Pass 4: s rebound to 25; total updated 45 + 25 = 70.' },
      { passIndex: 5, line: 6, loopVar: 's', loopVal: 25, accumulator: 70, conditionText: 'StopIteration raised (Exhausted)', conditionResult: false, outputLine: 'Final: 70', note: 'Loop ends cleanly. Notice loop variable s still holds 25 in scope!' },
    ],
  },
  {
    id: 'while-countdown',
    label: 'while Loop Counter',
    codeLines: [
      'n = 3',
      'sum_val = 0',
      'while n > 0:',
      '    sum_val += n',
      '    print(f"n={n}, sum={sum_val}")',
      '    n -= 1',
      'print("Liftoff! n is now", n)',
    ],
    passes: [
      { passIndex: 0, line: 2, loopVar: 'n', loopVal: 3, accumulator: 0, conditionText: 'Setup: n = 3, sum_val = 0', conditionResult: true, note: 'Initial state before first while condition test.' },
      { passIndex: 1, line: 4, loopVar: 'n', loopVal: 3, accumulator: 3, conditionText: '3 > 0 -> True', conditionResult: true, outputLine: 'n=3, sum=3', note: 'Pass 1: Condition True. sum_val becomes 3, then n decrements to 2.' },
      { passIndex: 2, line: 4, loopVar: 'n', loopVal: 2, accumulator: 5, conditionText: '2 > 0 -> True', conditionResult: true, outputLine: 'n=2, sum=5', note: 'Pass 2: Condition True. sum_val becomes 5, then n decrements to 1.' },
      { passIndex: 3, line: 4, loopVar: 'n', loopVal: 1, accumulator: 6, conditionText: '1 > 0 -> True', conditionResult: true, outputLine: 'n=1, sum=6', note: 'Pass 3: Condition True. sum_val becomes 6, then n decrements to 0.' },
      { passIndex: 4, line: 7, loopVar: 'n', loopVal: 0, accumulator: 6, conditionText: '0 > 0 -> False (Exit)', conditionResult: false, outputLine: 'Liftoff! n is now 0', note: 'Condition 0 > 0 is False; while loop exits to line 7.' },
    ],
  },
];

export const IterationTimelineSim: React.FC = () => {
  const [scenarioId, setScenarioId] = useState<string>('sum-list');
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
  const currentPass = scenario.passes[stepIndex] || scenario.passes[0];

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIndex >= scenario.passes.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setStepIndex((prev) => Math.min(prev + 1, scenario.passes.length - 1));
    }, 1100 / speed);
    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIndex, speed, scenario.passes.length]);

  const handleScenarioChange = (id: string) => {
    setIsPlaying(false);
    setScenarioId(id);
    setStepIndex(0);
  };

  const outputsSoFar = scenario.passes
    .slice(0, stepIndex + 1)
    .map((p) => p.outputLine)
    .filter((line): line is string => Boolean(line));

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Loop Iteration Timeline & Accumulator Tracer"
        badge="simulation"
        isPlaying={isPlaying}
        onTogglePlay={() => {
          if (stepIndex >= scenario.passes.length - 1) setStepIndex(0);
          setIsPlaying((p) => !p);
        }}
        onStepNext={() => {
          setIsPlaying(false);
          setStepIndex((p) => Math.min(p + 1, scenario.passes.length - 1));
        }}
        onStepPrev={() => {
          setIsPlaying(false);
          setStepIndex((p) => Math.max(p - 1, 0));
        }}
        onReset={() => {
          setIsPlaying(false);
          setStepIndex(0);
        }}
        currentStep={stepIndex + 1}
        totalSteps={scenario.passes.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        {/* Scenario Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">LOOP PATTERN</span>
          <div className="flex items-center gap-2" role="group" aria-label="Loop Pattern Presets">
            {SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                type="button"
                aria-pressed={scenarioId === sc.id}
                onClick={() => handleScenarioChange(sc.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                  scenarioId === sc.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Code + Live State Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Highlighted Code */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <span className="eyebrow-label text-xs">EXECUTION POINTER</span>
            <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs space-y-1 overflow-x-auto">
              {scenario.codeLines.map((lineText, idx) => {
                const lineNum = idx + 1;
                const isActive = currentPass.line === lineNum;
                return (
                  <div
                    key={lineNum}
                    className={`flex items-center gap-3 px-2 py-1 rounded-md transition-colors ${
                      isActive
                        ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold border-l-2 border-[var(--accent-primary)]'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    <span className="w-4 text-right text-[10px] text-[var(--text-dim)] select-none">{lineNum}</span>
                    <pre className="whitespace-pre">{lineText}</pre>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Registers & Output */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <span className="eyebrow-label text-[10px] block mb-1">LOOP VARIABLE ({currentPass.loopVar})</span>
                <div className="font-mono text-xl font-extrabold text-[var(--accent-primary)]">
                  {String(currentPass.loopVal)}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <span className="eyebrow-label text-[10px] block mb-1">ACCUMULATOR</span>
                <div className="font-mono text-xl font-extrabold text-emerald-400">
                  {currentPass.accumulator}
                </div>
              </div>
            </div>

            <div
              role="status"
              aria-live="polite"
              className={`p-3.5 rounded-2xl border text-xs ${
                currentPass.conditionResult
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-[var(--text-main)]'
                  : 'border-amber-500/30 bg-amber-500/10 text-[var(--text-main)]'
              }`}
            >
              <div className="font-mono font-bold text-[11px] mb-1">
                {currentPass.conditionText}
              </div>
              <div className="text-[var(--text-muted)]">{currentPass.note}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-main)]">
                <Terminal className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>Console Output So Far</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs text-emerald-400 min-h-[64px] space-y-0.5">
                {outputsSoFar.length === 0 ? (
                  <span className="text-[var(--text-dim)] italic">(No output yet)</span>
                ) : (
                  outputsSoFar.map((out, i) => <div key={i}>{out}</div>)
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pass Timeline Strip */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
          <span className="eyebrow-label text-xs">ITERATION TIMELINE PASSES</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {scenario.passes.map((p, idx) => (
              <button
                key={p.passIndex}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setStepIndex(idx);
                }}
                aria-pressed={stepIndex === idx}
                className={`p-2.5 rounded-xl border text-left font-mono text-xs transition-all ${
                  stepIndex === idx
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]'
                    : idx < stepIndex
                    ? 'border-emerald-500/30 bg-emerald-500/5 text-[var(--text-main)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)]'
                }`}
              >
                <div className="text-[10px] font-bold">Pass {idx}</div>
                <div className="text-[11px] truncate">{p.loopVar}={String(p.loopVal)}</div>
                <div className="text-[10px] text-emerald-400">acc={p.accumulator}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
