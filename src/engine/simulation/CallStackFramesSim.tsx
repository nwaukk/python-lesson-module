/**
 * Call Stack Frames Simulation Primitive
 * Section 14 (Day 11 Signature Simulation):
 * Visualizes Python's call stack: each function call pushes a new stack frame
 * with its own local variables, and returning pops that frame and passes the
 * return value back to the caller.
 */

import React, { useState, useEffect } from 'react';
import { Layers, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface StackFrame {
  name: string;
  locals: Record<string, string>;
  returnLine?: string;
}

interface StackStep {
  line: number;
  action: 'push' | 'exec' | 'pop' | 'done';
  frames: StackFrame[];
  note: string;
}

const CODE_LINES = [
  'def square(n):',
  '    res = n * n',
  '    return res',
  '',
  'def hypotenuse_sq(a, b):',
  '    sa = square(a)',
  '    sb = square(b)',
  '    return sa + sb',
  '',
  'ans = hypotenuse_sq(3, 4)',
];

const STEPS: StackStep[] = [
  {
    line: 10,
    action: 'exec',
    frames: [{ name: '<module>', locals: {} }],
    note: 'Module frame starts. Calling hypotenuse_sq(3, 4) on line 10.',
  },
  {
    line: 5,
    action: 'push',
    frames: [
      { name: '<module>', locals: {} },
      { name: 'hypotenuse_sq', locals: { a: '3', b: '4' }, returnLine: 'line 10' },
    ],
    note: 'PUSH frame hypotenuse_sq(a=3, b=4). Notice its locals are isolated from <module>.',
  },
  {
    line: 6,
    action: 'push',
    frames: [
      { name: '<module>', locals: {} },
      { name: 'hypotenuse_sq', locals: { a: '3', b: '4' }, returnLine: 'line 10' },
      { name: 'square', locals: { n: '3' }, returnLine: 'line 6' },
    ],
    note: 'PUSH frame square(n=3) from line 6.',
  },
  {
    line: 2,
    action: 'exec',
    frames: [
      { name: '<module>', locals: {} },
      { name: 'hypotenuse_sq', locals: { a: '3', b: '4' }, returnLine: 'line 10' },
      { name: 'square', locals: { n: '3', res: '9' }, returnLine: 'line 6' },
    ],
    note: 'Inside square: res = 3 * 3 -> 9.',
  },
  {
    line: 3,
    action: 'pop',
    frames: [
      { name: '<module>', locals: {} },
      { name: 'hypotenuse_sq', locals: { a: '3', b: '4', sa: '9' }, returnLine: 'line 10' },
    ],
    note: 'POP frame square(3): returns 9 to hypotenuse_sq, binding sa = 9. Frame locals destroyed.',
  },
  {
    line: 7,
    action: 'push',
    frames: [
      { name: '<module>', locals: {} },
      { name: 'hypotenuse_sq', locals: { a: '3', b: '4', sa: '9' }, returnLine: 'line 10' },
      { name: 'square', locals: { n: '4' }, returnLine: 'line 7' },
    ],
    note: 'PUSH fresh frame square(n=4) from line 7.',
  },
  {
    line: 2,
    action: 'exec',
    frames: [
      { name: '<module>', locals: {} },
      { name: 'hypotenuse_sq', locals: { a: '3', b: '4', sa: '9' }, returnLine: 'line 10' },
      { name: 'square', locals: { n: '4', res: '16' }, returnLine: 'line 7' },
    ],
    note: 'Inside square: res = 4 * 4 -> 16.',
  },
  {
    line: 3,
    action: 'pop',
    frames: [
      { name: '<module>', locals: {} },
      { name: 'hypotenuse_sq', locals: { a: '3', b: '4', sa: '9', sb: '16' }, returnLine: 'line 10' },
    ],
    note: 'POP frame square(4): returns 16, binding sb = 16.',
  },
  {
    line: 8,
    action: 'pop',
    frames: [{ name: '<module>', locals: { ans: '25' } }],
    note: 'POP frame hypotenuse_sq: returns 9 + 16 = 25 to <module>, binding ans = 25.',
  },
];

export const CallStackFramesSim: React.FC = () => {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);

  const current = STEPS[stepIndex] || STEPS[0];

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIndex >= STEPS.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
    }, 1200 / speed);
    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIndex, speed]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Call Stack Frames & Local Isolation"
        badge="simulation"
        isPlaying={isPlaying}
        onTogglePlay={() => {
          if (stepIndex >= STEPS.length - 1) setStepIndex(0);
          setIsPlaying((p) => !p);
        }}
        onStepNext={() => {
          setIsPlaying(false);
          setStepIndex((p) => Math.min(p + 1, STEPS.length - 1));
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
        totalSteps={STEPS.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Code Pointer */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <span className="eyebrow-label text-xs">EXECUTION POINTER</span>
            <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs space-y-0.5 overflow-x-auto">
              {CODE_LINES.map((text, idx) => {
                const lineNum = idx + 1;
                const isActive = current.line === lineNum;
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
                    <pre className="whitespace-pre">{text || ' '}</pre>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Call Stack */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--accent-primary)]" />
                <span className="eyebrow-label text-xs">ACTIVE CALL STACK (TOP = CURRENT)</span>
              </div>
              <span className="font-mono text-[11px] text-[var(--text-muted)]">
                Depth: {current.frames.length}
              </span>
            </div>

            <div className="space-y-2.5 flex flex-col-reverse">
              {current.frames.map((frame, idx) => {
                const isTop = idx === current.frames.length - 1;
                const entries = Object.entries(frame.locals);
                return (
                  <div
                    key={`${frame.name}-${idx}`}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isTop
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-app)] opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-extrabold text-[var(--text-main)]">
                        Frame #{idx}: {frame.name}()
                      </span>
                      {frame.returnLine && (
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                          returns to {frame.returnLine}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 font-mono text-xs">
                      {entries.length === 0 ? (
                        <span className="text-[var(--text-dim)] italic">(no locals bound yet)</span>
                      ) : (
                        entries.map(([k, v]) => (
                          <span
                            key={k}
                            className="px-2 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)]"
                          >
                            <span className="text-[var(--accent-primary)] font-bold">{k}</span> = {v}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          role="status"
          aria-live="polite"
          className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-start gap-3 text-xs text-[var(--text-main)]"
        >
          {current.action === 'push' ? (
            <ArrowUpRight className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          ) : current.action === 'pop' ? (
            <ArrowDownLeft className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <Layers className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          )}
          <span>{current.note}</span>
        </div>
      </div>
    </div>
  );
};
