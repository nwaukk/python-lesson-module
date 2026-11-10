/**
 * Range Slider Simulation Primitive
 * Section 14 (Day 10 Signature Simulation):
 * Visualizes numbers produced by range(start, stop, step),
 * highlighting exclusive stop boundaries and negative stepping.
 */

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { SimulationController } from './SimulationController';

export const RangeSliderSim: React.FC = () => {
  const [start, setStart] = useState<number>(0);
  const [stop, setStop] = useState<number>(10);
  const [step, setStep] = useState<number>(2);

  const generated: number[] = [];
  if (step > 0) {
    for (let i = start; i < stop && generated.length < 40; i += step) {
      generated.push(i);
    }
  } else if (step < 0) {
    for (let i = start; i > stop && generated.length < 40; i += step) {
      generated.push(i);
    }
  }

  const isEmptyDirectionMismatch =
    (step > 0 && start >= stop) || (step < 0 && start <= stop) || step === 0;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="range(start, stop, step) Sequence Generator"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        {/* Live Expression Banner */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="eyebrow-label text-[10px] block mb-0.5">PYTHON CALL</span>
            <code className="font-mono text-base font-extrabold text-[var(--accent-primary)]">
              list(range({start}, {stop}, {step}))
            </code>
          </div>
          <div className="text-right">
            <span className="eyebrow-label text-[10px] block mb-0.5">LENGTH (COUNT)</span>
            <span className="font-mono text-base font-bold text-emerald-400">
              {generated.length} items
            </span>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="range-start" className="eyebrow-label text-xs">START (INCLUSIVE)</label>
              <span className="font-mono text-sm font-bold text-[var(--accent-primary)]">{start}</span>
            </div>
            <input
              id="range-start"
              type="range"
              min="-10"
              max="20"
              value={start}
              aria-label="Range start value"
              onChange={(e) => setStart(parseInt(e.target.value, 10))}
              className="w-full accent-[var(--accent-primary)] cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="range-stop" className="eyebrow-label text-xs">STOP (EXCLUSIVE!)</label>
              <span className="font-mono text-sm font-bold text-amber-400">{stop}</span>
            </div>
            <input
              id="range-stop"
              type="range"
              min="-10"
              max="20"
              value={stop}
              aria-label="Range stop value"
              onChange={(e) => setStop(parseInt(e.target.value, 10))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="range-step" className="eyebrow-label text-xs">STEP</label>
              <span className="font-mono text-sm font-bold text-sky-400">{step}</span>
            </div>
            <input
              id="range-step"
              type="range"
              min="-5"
              max="5"
              value={step}
              aria-label="Range step value"
              onChange={(e) => setStep(parseInt(e.target.value, 10))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[var(--text-dim)]">
              <span>-5 (Reverse)</span>
              <span>0 (Error!)</span>
              <span>+5 (Forward)</span>
            </div>
          </div>
        </div>

        {/* Status / Warning */}
        <div
          role="status"
          aria-live="polite"
          className={`p-4 rounded-2xl border flex items-start gap-3 text-xs text-[var(--text-main)] ${
            step === 0
              ? 'border-rose-500/40 bg-rose-500/15'
              : isEmptyDirectionMismatch
              ? 'border-amber-500/40 bg-amber-500/15'
              : 'border-emerald-500/30 bg-emerald-500/10'
          }`}
        >
          {step === 0 || isEmptyDirectionMismatch ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div>
            {step === 0 ? (
              <span>
                <strong>ValueError: range() arg 3 must not be zero.</strong> Step cannot be 0 because the sequence would never advance toward <code className="font-mono">stop</code>.
              </span>
            ) : isEmptyDirectionMismatch ? (
              <span>
                <strong>Empty Sequence []:</strong> With <code className="font-mono">start={start}</code>, <code className="font-mono">stop={stop}</code>, and <code className="font-mono">step={step}</code>, the direction moves away from or starts past <code className="font-mono">stop</code>.
              </span>
            ) : (
              <span>
                Generates <strong>{generated.length}</strong> integers starting at <code className="font-mono">{start}</code> and stopping strictly <strong>before</strong> <code className="font-mono">{stop}</code> (stop is exclusive!).
              </span>
            )}
          </div>
        </div>

        {/* Generated Elements Grid */}
        <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <span className="eyebrow-label text-xs">GENERATED SEQUENCE OUTPUT</span>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {generated.length === 0 ? (
              <span className="text-[var(--text-dim)] italic">[] (empty range)</span>
            ) : (
              <>
                {generated.map((num, idx) => (
                  <React.Fragment key={`${num}-${idx}`}>
                    <div className="px-3 py-2 rounded-xl border border-[var(--accent-primary)]/40 bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold">
                      {num}
                    </div>
                    {idx < generated.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--text-dim)] shrink-0" />
                    )}
                  </React.Fragment>
                ))}
                <div
                  className="px-3 py-2 rounded-xl border border-dashed border-amber-500/50 bg-amber-500/10 text-amber-400 font-bold"
                  title="Stop boundary is exclusive and never included"
                >
                  {stop} (excluded)
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
