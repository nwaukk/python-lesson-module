/**
 * Infinite Loop Safety Simulation Primitive
 * Section 14 (Day 10 Signature Simulation):
 * Demonstrates a while loop that never terminates, automatically halted by a
 * safety step limit, and lets learners toggle to the fixed bounded loop
 * with a clear root-cause explanation.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ShieldAlert, ShieldCheck, Wrench } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface SafetyStep {
  step: number;
  line: number;
  counterVal: number;
  conditionText: string;
  haltedBySafety: boolean;
  terminatedCleanly: boolean;
  note: string;
}

const MAX_SAFETY_STEPS = 10;

export const InfiniteLoopSafetySim: React.FC = () => {
  const [mode, setMode] = useState<'buggy' | 'fixed'>('buggy');
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);

  const steps: SafetyStep[] = useMemo(() => {
    if (mode === 'buggy') {
      const list: SafetyStep[] = [
        {
          step: 0,
          line: 1,
          counterVal: 1,
          conditionText: 'Initialize retries = 1',
          haltedBySafety: false,
          terminatedCleanly: false,
          note: 'Starting state: retries = 1. Target condition is while retries <= 3.',
        },
      ];
      for (let s = 1; s < MAX_SAFETY_STEPS; s++) {
        list.push({
          step: s,
          line: 3,
          counterVal: 1,
          conditionText: '1 <= 3 -> True (retries unchanged!)',
          haltedBySafety: s === MAX_SAFETY_STEPS - 1,
          terminatedCleanly: false,
          note:
            s === MAX_SAFETY_STEPS - 1
              ? `SAFETY LIMIT REACHED (${MAX_SAFETY_STEPS} steps): Execution halted to prevent browser freeze. retries stayed 1 forever!`
              : `Pass ${s}: Condition 1 <= 3 is still True because retries was never incremented.`,
        });
      }
      return list;
    }

    return [
      {
        step: 0,
        line: 1,
        counterVal: 1,
        conditionText: 'Initialize retries = 1',
        haltedBySafety: false,
        terminatedCleanly: false,
        note: 'Starting state: retries = 1. Loop includes retries += 1 to advance toward termination.',
      },
      {
        step: 1,
        line: 4,
        counterVal: 2,
        conditionText: '1 <= 3 -> True; retries += 1 -> 2',
        haltedBySafety: false,
        terminatedCleanly: false,
        note: 'Pass 1: Body runs and increments retries from 1 to 2.',
      },
      {
        step: 2,
        line: 4,
        counterVal: 3,
        conditionText: '2 <= 3 -> True; retries += 1 -> 3',
        haltedBySafety: false,
        terminatedCleanly: false,
        note: 'Pass 2: Body runs and increments retries from 2 to 3.',
      },
      {
        step: 3,
        line: 4,
        counterVal: 4,
        conditionText: '3 <= 3 -> True; retries += 1 -> 4',
        haltedBySafety: false,
        terminatedCleanly: false,
        note: 'Pass 3: Body runs and increments retries from 3 to 4.',
      },
      {
        step: 4,
        line: 5,
        counterVal: 4,
        conditionText: '4 <= 3 -> False (Loop Exits Cleanly)',
        haltedBySafety: false,
        terminatedCleanly: true,
        note: 'Condition 4 <= 3 is False! Loop terminates cleanly after 3 bounded passes.',
      },
    ];
  }, [mode]);

  const currentStep = steps[stepIndex] || steps[0];

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }, 800 / speed);
    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIndex, speed, steps.length]);

  const handleModeSwitch = (nextMode: 'buggy' | 'fixed') => {
    setIsPlaying(false);
    setMode(nextMode);
    setStepIndex(0);
  };

  const codeLines =
    mode === 'buggy'
      ? [
          'retries = 1',
          'while retries <= 3:',
          '    print("Attempting connection...", retries)',
          '    # BUG: forgot retries += 1!',
          'print("Done")  # Never reached',
        ]
      : [
          'retries = 1',
          'while retries <= 3:',
          '    print("Attempting connection...", retries)',
          '    retries += 1  # FIX: advance state!',
          'print("Done")  # Reached cleanly',
        ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Infinite Loop Safety & Termination Guard"
        badge="simulation"
        isPlaying={isPlaying}
        onTogglePlay={() => {
          if (stepIndex >= steps.length - 1) setStepIndex(0);
          setIsPlaying((p) => !p);
        }}
        onStepNext={() => {
          setIsPlaying(false);
          setStepIndex((p) => Math.min(p + 1, steps.length - 1));
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
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        {/* Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="eyebrow-label text-xs">LOOP VARIANT</span>
          </div>
          <div className="flex items-center gap-2" role="group" aria-label="Loop Variant Selector">
            <button
              type="button"
              aria-pressed={mode === 'buggy'}
              onClick={() => handleModeSwitch('buggy')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                mode === 'buggy'
                  ? 'border-red-500/60 bg-red-500/15 text-red-300'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Infinite Loop (Missing Update)
            </button>
            <button
              type="button"
              aria-pressed={mode === 'fixed'}
              onClick={() => handleModeSwitch('fixed')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                mode === 'fixed'
                  ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Fixed Bounded Loop (retries += 1)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Code View */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <span className="eyebrow-label text-xs">EXECUTION TRACE</span>
            <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs space-y-1 overflow-x-auto">
              {codeLines.map((text, idx) => {
                const lineNum = idx + 1;
                const isActive = currentStep.line === lineNum;
                return (
                  <div
                    key={lineNum}
                    className={`flex items-center gap-3 px-2 py-1 rounded-md transition-colors ${
                      isActive
                        ? currentStep.haltedBySafety
                          ? 'bg-red-500/15 text-red-300 font-bold border-l-2 border-red-400'
                          : 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold border-l-2 border-[var(--accent-primary)]'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    <span className="w-4 text-right text-[10px] text-[var(--text-dim)] select-none">{lineNum}</span>
                    <pre className="whitespace-pre">{text}</pre>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Guard Metrics */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <span className="eyebrow-label text-[10px] block mb-1">retries VALUE</span>
                <div className="font-mono text-2xl font-extrabold text-[var(--accent-primary)]">
                  {currentStep.counterVal}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <span className="eyebrow-label text-[10px] block mb-1">SAFETY STEP GUARD</span>
                <div className="font-mono text-2xl font-extrabold text-[var(--text-main)]">
                  {currentStep.step} / {MAX_SAFETY_STEPS - 1}
                </div>
              </div>
            </div>

            <div
              role="status"
              aria-live="polite"
              className={`p-4 rounded-2xl border text-xs space-y-1.5 text-[var(--text-main)] ${
                currentStep.haltedBySafety
                  ? 'border-red-500/40 bg-red-500/10'
                  : currentStep.terminatedCleanly
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'
              }`}
            >
              <div className="flex items-center gap-2 font-mono font-bold text-[11px]">
                {currentStep.haltedBySafety ? (
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span>{currentStep.conditionText}</span>
              </div>
              <p className="text-[var(--text-muted)] leading-relaxed">{currentStep.note}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] space-y-1">
              <div className="font-bold text-[var(--text-main)]">How to Prevent Infinite Loops</div>
              <p>
                Every <code className="font-mono text-[var(--accent-primary)]">while</code> loop needs a state update
                (such as <code className="font-mono text-[var(--accent-primary)]">retries += 1</code> or a{' '}
                <code className="font-mono text-[var(--accent-primary)]">break</code> condition) that moves the loop
                test closer to <code className="font-mono">False</code> on each iteration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
