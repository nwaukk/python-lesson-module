/**
 * Sequence Grid Simulation Primitive
 * Section 8.4: Interactive sequence grid displaying positive (0..n-1) and negative (-n..-1) indices,
 * start/stop/step slicing sliders, and slice formula evaluation.
 */

import React, { useState } from 'react';
import { Sliders, Sparkles, Copy, Check } from 'lucide-react';
import { SimulationController } from './SimulationController';

export const SequenceGridSim: React.FC = () => {
  const [text, setText] = useState<string>('PYTHON');
  const [start, setStart] = useState<number>(0);
  const [stop, setStop] = useState<number>(text.length);
  const [step, setStep] = useState<number>(1);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const n = text.length;
  const chars = text.split('');

  // Calculate slice items according to Python slice semantics
  const getSliceResult = (): { chars: string[]; indices: number[] } => {
    const indices: number[] = [];
    const slicedChars: string[] = [];
    if (step === 0) return { chars: [], indices: [] };

    let actualStart = start;
    let actualStop = stop;

    // Normalise
    if (step > 0) {
      if (actualStart < 0) actualStart = Math.max(0, n + actualStart);
      if (actualStop < 0) actualStop = Math.max(0, n + actualStop);
      actualStart = Math.min(n, actualStart);
      actualStop = Math.min(n, actualStop);

      for (let i = actualStart; i < actualStop; i += step) {
        indices.push(i);
        slicedChars.push(chars[i]);
      }
    } else {
      // Negative step
      if (actualStart < 0) actualStart = Math.max(-1, n + actualStart);
      if (actualStop < 0) actualStop = Math.max(-1, n + actualStop);
      for (let i = actualStart; i > actualStop; i += step) {
        if (i >= 0 && i < n) {
          indices.push(i);
          slicedChars.push(chars[i]);
        }
      }
    }
    return { chars: slicedChars, indices };
  };

  const sliceData = getSliceResult();
  const sliceExpression = `text[${start}:${stop}${step !== 1 ? `:${step}` : ''}]`;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Sequence Index & Slice Grid"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {/* Input Text Box */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="eyebrow-label text-xs">EDIT SEQUENCE TEXT</span>
            <span className="text-xs font-mono text-[var(--text-dim)]">Length: {n} items</span>
          </div>
          <input
            type="text"
            value={text}
            maxLength={18}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              setText(val);
              setStop(val.length);
            }}
            placeholder="Type text..."
            className="w-full px-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] font-mono text-base font-bold tracking-widest text-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] uppercase"
          />
        </div>

        {/* The Dual-Index Sequence Grid Stage */}
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 overflow-x-auto shadow-inner">
          <div className="text-[10px] eyebrow-label text-[var(--text-dim)] mb-1">
            CLICK ANY CELL TO INSPECT INDEX EXPRESSIONS
          </div>

          <div className="inline-flex gap-2 min-w-full justify-start sm:justify-center py-2">
            {chars.map((char, i) => {
              const positiveIdx = i;
              const negativeIdx = i - n;
              const isSliced = sliceData.indices.includes(i);
              const isClicked = selectedIdx === i;

              return (
                <div
                  key={i}
                  onClick={() => setSelectedIdx(i)}
                  className={`flex flex-col items-center gap-1.5 cursor-pointer p-2 rounded-2xl border-2 transition-all ${
                    isClicked
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] scale-105 shadow-md'
                      : isSliced
                      ? 'border-emerald-500/60 bg-emerald-500/15'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  {/* Positive index (top) */}
                  <span className="font-mono text-xs font-bold text-sky-400">
                    +{positiveIdx}
                  </span>

                  {/* Character Box */}
                  <div className="w-12 h-14 rounded-xl bg-[var(--bg-surface-elevated)] border border-white/10 flex items-center justify-center font-mono text-xl font-black text-[var(--text-main)] shadow-sm">
                    {char}
                  </div>

                  {/* Negative index (bottom) */}
                  <span className="font-mono text-xs font-bold text-amber-400">
                    {negativeIdx}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 text-xs font-mono">
            <span className="text-sky-400 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Positive Index (0 to {n - 1})
            </span>
            <span className="text-amber-400 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Negative Index (-{n} to -1)
            </span>
          </div>
        </div>

        {/* Slice Sliders Section */}
        <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="eyebrow-label text-xs">INTERACTIVE SLICE CONTROLS</span>
            </div>
            <div className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-lg border border-emerald-500/30">
              {sliceExpression} =&gt; "{sliceData.chars.join('')}"
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            {/* Start Slider */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
              <div className="flex justify-between">
                <span className="text-[var(--text-dim)] font-bold">START INDEX:</span>
                <span className="text-sky-400 font-bold">{start}</span>
              </div>
              <input
                type="range"
                min={-n}
                max={n}
                value={start}
                onChange={(e) => setStart(parseInt(e.target.value, 10))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            {/* Stop Slider */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
              <div className="flex justify-between">
                <span className="text-[var(--text-dim)] font-bold">STOP INDEX:</span>
                <span className="text-sky-400 font-bold">{stop}</span>
              </div>
              <input
                type="range"
                min={-n}
                max={n}
                value={stop}
                onChange={(e) => setStop(parseInt(e.target.value, 10))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            {/* Step Slider */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
              <div className="flex justify-between">
                <span className="text-[var(--text-dim)] font-bold">STEP STRIDE:</span>
                <span className="text-emerald-400 font-bold">{step}</span>
              </div>
              <input
                type="range"
                min={-3}
                max={3}
                value={step === 0 ? 1 : step}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setStep(val === 0 ? 1 : val);
                }}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
