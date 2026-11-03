/**
 * Sequence Grid & Slice Sliders Simulation Primitive
 * Section 8.4 & Day 4 Brief:
 * Interactive sequence grid displaying positive (0..n-1) and negative (-n..-1) indices,
 * start/stop/step slicing sliders, slice presets (including [::-1] reverse), clicked character
 * dual-index inspection, and the critical distinction between out-of-range indexing (IndexError)
 * versus out-of-range slicing (gracefully clamped without error).
 */

import React, { useState } from 'react';
import { Sliders, Sparkles, Copy, Check, AlertTriangle, Info, RotateCcw } from 'lucide-react';
import { SimulationController } from './SimulationController';

export const SequenceGridSim: React.FC = () => {
  const [text, setText] = useState<string>('PYTHON');
  const [start, setStart] = useState<number>(0);
  const [stop, setStop] = useState<number>(6);
  const [step, setStep] = useState<number>(1);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showErrorComparison, setShowErrorComparison] = useState<boolean>(false);

  const n = text.length;
  const chars = text.split('');

  // Python slice semantics implementation
  const getSliceResult = (): { chars: string[]; indices: number[]; clampedInfo?: string } => {
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
      actualStart = Math.min(n - 1, actualStart);
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
  const slicedString = sliceData.chars.join('');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`${sliceExpression}  # returns "${slicedString}"`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Slice presets
  const applyPreset = (st: number, sp: number, stepVal: number) => {
    setStart(st);
    setStop(sp);
    setStep(stepVal);
    setSelectedIdx(null);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Character Index Grid & Slice Sliders"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {/* Input Text Box */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="eyebrow-label text-xs">EDIT SEQUENCE STRING</span>
            <span className="text-xs font-mono text-[var(--text-dim)]">Length: {n} chars</span>
          </div>
          <input
            type="text"
            value={text}
            maxLength={22}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              setText(val);
              setStop(val.length);
            }}
            placeholder="Type text..."
            className="w-full px-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] font-mono text-base font-bold tracking-widest text-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] uppercase"
          />

          <div className="flex flex-wrap gap-1.5 pt-1">
            {['PYTHON', 'DEVELOPER', 'ABUJA_TECH', 'ALGORITHM', 'NIGERIA'].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setText(preset);
                  setStart(0);
                  setStop(preset.length);
                  setStep(1);
                  setSelectedIdx(null);
                }}
                className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-app)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* The Dual-Index Sequence Grid Stage */}
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 overflow-x-auto shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-[10px] eyebrow-label text-[var(--text-dim)]">
              CLICK ANY CELL TO INSPECT DUAL-INDEX MEMORY EXPRESSIONS
            </span>
            <span className="text-[10px] font-mono text-sky-400">
              Positive: [0 .. {n - 1}] | Negative: [-{n} .. -1]
            </span>
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
                  <div className="w-11 h-13 rounded-xl bg-[var(--bg-surface-elevated)] border border-white/10 flex items-center justify-center font-mono text-lg font-black text-[var(--text-main)] shadow-sm">
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

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-mono">
            <span className="text-sky-400 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Positive Index (Left-to-Right: 0 to {n - 1})
            </span>
            <span className="text-amber-400 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Negative Index (Right-to-Left: -{n} to -1)
            </span>
          </div>
        </div>

        {/* Selected Character Inspector Popup */}
        {selectedIdx !== null && (
          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400">
                Selected Character: '{chars[selectedIdx]}'
              </span>
              <button
                onClick={() => setSelectedIdx(null)}
                className="text-xs text-[var(--text-dim)] hover:text-[var(--text-main)]"
              >
                ✕ Close
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/40 border border-sky-500/20">
                <span className="text-[var(--text-dim)]">Positive Index: </span>
                <span className="text-sky-300 font-bold">text[{selectedIdx}] == '{chars[selectedIdx]}'</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20">
                <span className="text-[var(--text-dim)]">Negative Index: </span>
                <span className="text-amber-300 font-bold">text[{selectedIdx - n}] == '{chars[selectedIdx]}'</span>
              </div>
            </div>
          </div>
        )}

        {/* Slice Sliders Section */}
        <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="eyebrow-label text-xs">INTERACTIVE SLICE CONTROLS</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-lg border border-emerald-500/30">
                {sliceExpression} =&gt; "{slicedString}"
              </div>
              <button
                onClick={handleCopyCode}
                className="p-1 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                title="Copy slice expression"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Quick Presets Ribbon */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className="text-[10px] text-[var(--text-dim)] mr-1">PRESETS:</span>
            <button
              onClick={() => applyPreset(0, n, 1)}
              className="px-2 py-0.5 rounded bg-[var(--bg-app)] border border-[var(--border-subtle)] hover:text-sky-400"
            >
              [:] Full Copy
            </button>
            <button
              onClick={() => applyPreset(n, -n - 1, -1)}
              className="px-2 py-0.5 rounded bg-[var(--bg-app)] border border-[var(--border-subtle)] hover:text-emerald-400 font-bold"
            >
              [::-1] Reverse
            </button>
            <button
              onClick={() => applyPreset(0, n, 2)}
              className="px-2 py-0.5 rounded bg-[var(--bg-app)] border border-[var(--border-subtle)] hover:text-purple-400"
            >
              [::2] Evens
            </button>
            <button
              onClick={() => applyPreset(1, n, 2)}
              className="px-2 py-0.5 rounded bg-[var(--bg-app)] border border-[var(--border-subtle)] hover:text-purple-400"
            >
              [1::2] Odds
            </button>
            <button
              onClick={() => applyPreset(-3, n, 1)}
              className="px-2 py-0.5 rounded bg-[var(--bg-app)] border border-[var(--border-subtle)] hover:text-amber-400"
            >
              [-3:] Last 3
            </button>
            <button
              onClick={() => applyPreset(2, 50, 1)}
              className="px-2 py-0.5 rounded bg-[var(--bg-app)] border border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
            >
              [2:50] Out-of-Range Slice
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            {/* Start Slider */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
              <div className="flex justify-between">
                <span className="text-[var(--text-dim)] font-bold">START:</span>
                <span className="text-sky-400 font-bold">{start}</span>
              </div>
              <input
                type="range"
                min={-n}
                max={n + 4}
                value={start}
                onChange={(e) => setStart(parseInt(e.target.value, 10))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            {/* Stop Slider */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
              <div className="flex justify-between">
                <span className="text-[var(--text-dim)] font-bold">STOP (EXCLUSIVE):</span>
                <span className="text-sky-400 font-bold">{stop}</span>
              </div>
              <input
                type="range"
                min={-n - 1}
                max={n + 10}
                value={stop}
                onChange={(e) => setStop(parseInt(e.target.value, 10))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            {/* Step Slider */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
              <div className="flex justify-between">
                <span className="text-[var(--text-dim)] font-bold">STEP (STRIDE):</span>
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

        {/* Watch-Out: Out-of-Range Index vs Out-of-Range Slice Comparison */}
        <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-[var(--text-main)]">
                Python Watch-out: Out-of-Range Indexing vs Slicing
              </h4>
            </div>
            <button
              onClick={() => setShowErrorComparison(!showErrorComparison)}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              {showErrorComparison ? 'Hide Analysis' : 'Show Side-by-Side Analysis'}
            </button>
          </div>

          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            One of the most frequent Python interview and debugging surprises: accessing an index past the string's length
            raises an unhandled <strong>IndexError</strong>, but slicing past the bounds <strong>gracefully clamps</strong> and returns whatever characters fall within range (or an empty string) without ever raising an error.
          </p>

          {showErrorComparison && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/40 space-y-1.5 font-mono text-xs">
                <div className="text-red-400 font-bold">1. Out-of-Range Index: FATAL ERROR</div>
                <div className="text-slate-300">text = "{text}"</div>
                <div className="text-red-300">val = text[99]  # ❌ CRASH!</div>
                <div className="p-2 rounded bg-red-950/60 border border-red-500/40 text-red-200 text-[11px]">
                  IndexError: string index out of range
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 space-y-1.5 font-mono text-xs">
                <div className="text-emerald-400 font-bold">2. Out-of-Range Slice: GRACEFUL CLAMP</div>
                <div className="text-slate-300">text = "{text}"</div>
                <div className="text-emerald-300">val = text[2:99]  # ✅ Works!</div>
                <div className="p-2 rounded bg-black/50 border border-emerald-500/40 text-emerald-300 text-[11px]">
                  Returns: "{text.slice(2)}" (clamped cleanly to len={n})
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
