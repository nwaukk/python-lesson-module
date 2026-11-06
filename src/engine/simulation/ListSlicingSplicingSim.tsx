/**
 * List Slicing & Slice Assignment (Splicing) Studio
 * Visualizes sequence extraction (lst[start:stop:step]) and in-place slice assignment
 * (lst[start:stop] = iterable), demonstrating dynamic expansion and contraction of list buffers.
 */

import React, { useState } from 'react';
import { SimulationController } from './SimulationController';
import { Sliders, Scissors, RotateCcw, ArrowRight, Layers, Check } from 'lucide-react';

const INITIAL_ITEMS = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf'];

export const ListSlicingSplicingSim: React.FC = () => {
  const [items, setItems] = useState<string[]>([...INITIAL_ITEMS]);
  const [mode, setMode] = useState<'slice' | 'splice'>('slice');

  // Slice sliders
  const [start, setStart] = useState<number>(1);
  const [stop, setStop] = useState<number>(5);
  const [step, setStep] = useState<number>(1);

  // Splice replacement input
  const [spliceReplacement, setSpliceReplacement] = useState<string>("'X', 'Y', 'Z'");

  // Compute sliced elements
  const computeSlice = (): { indices: number[]; values: string[] } => {
    const indices: number[] = [];
    const values: string[] = [];
    const len = items.length;

    if (step === 0) return { indices, values };

    let s = start;
    let e = stop;

    // Normalizing indices
    if (s < 0) s = Math.max(0, len + s);
    if (e < 0) e = Math.max(0, len + e);

    if (step > 0) {
      for (let i = s; i < Math.min(e, len); i += step) {
        indices.push(i);
        values.push(items[i]);
      }
    } else {
      // Negative step
      let startIdx = start < 0 ? len + start : Math.min(start, len - 1);
      let stopIdx = stop < 0 ? len + stop : stop;
      for (let i = startIdx; i > stopIdx && i >= 0; i += step) {
        indices.push(i);
        values.push(items[i]);
      }
    }

    return { indices, values };
  };

  const sliceResult = computeSlice();

  const handleExecuteSplice = () => {
    const tokens = spliceReplacement
      .split(',')
      .map((t) => t.trim().replace(/^['"]|['"]$/g, ''))
      .filter((t) => t.length > 0);

    const newItems = [...items];
    const s = Math.max(0, start);
    const countToDelete = Math.max(0, stop - s);
    newItems.splice(s, countToDelete, ...tokens);

    setItems(newItems);
  };

  const handleReset = () => {
    setItems([...INITIAL_ITEMS]);
    setStart(1);
    setStop(5);
    setStep(1);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="List Slicing & Slice Assignment (Splicing) Studio"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 max-w-5xl mx-auto w-full">
        {/* Mode Selector Tabs */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
          <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl">
            <button
              onClick={() => setMode('slice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                mode === 'slice'
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Sequence Slicing [start:stop:step]</span>
            </button>
            <button
              onClick={() => setMode('splice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                mode === 'splice'
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Slice Assignment / Splicing (lst[1:4] = [...])</span>
            </button>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] text-xs text-[var(--text-muted)] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset List</span>
          </button>
        </div>

        {/* List Memory Grid */}
        <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Current List Buffer (len = {items.length}):</span>
            </span>
            <span className="font-mono text-[11px] text-[var(--text-dim)]">
              Indices: 0 to {items.length - 1} (Negative: -{items.length} to -1)
            </span>
          </div>

          <div className="flex items-stretch gap-2 overflow-x-auto pb-1">
            {items.map((item, idx) => {
              const isSelected = sliceResult.indices.includes(idx);
              const isSpliceRange = mode === 'splice' && idx >= start && idx < stop;

              return (
                <div
                  key={idx}
                  className={`min-w-[5.5rem] p-3 rounded-xl border text-center transition-all ${
                    isSpliceRange
                      ? 'border-red-500/50 bg-red-500/10 shadow-xs'
                      : isSelected
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] shadow-xs'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-app)]'
                  }`}
                >
                  <div className="text-[10px] font-mono text-[var(--text-dim)] mb-0.5">
                    [{idx}] / [{-items.length + idx}]
                  </div>
                  <div className="font-mono text-xs font-bold text-[var(--text-main)] truncate my-1">
                    '{item}'
                  </div>
                  <div className="text-[9px] font-mono">
                    {isSpliceRange ? (
                      <span className="text-red-300 font-bold">REPLACED</span>
                    ) : isSelected ? (
                      <span className="text-[var(--accent-primary)] font-bold">SLICED</span>
                    ) : (
                      <span className="text-[var(--text-dim)]">RETAINED</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Controls according to Mode */}
        {mode === 'slice' ? (
          <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
            <div className="text-xs font-bold text-[var(--text-main)] flex items-center justify-between">
              <span>Slice Parameters</span>
              <code className="text-[var(--accent-primary)] font-mono text-sm font-bold">
                items[{start}:{stop}:{step}]
              </code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Start Index:</span>
                  <span className="font-mono font-bold text-[var(--text-main)]">{start}</span>
                </div>
                <input
                  type="range"
                  min={-items.length}
                  max={items.length}
                  value={start}
                  onChange={(e) => setStart(Number(e.target.value))}
                  className="w-full accent-[var(--accent-primary)]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Stop Index (exclusive):</span>
                  <span className="font-mono font-bold text-[var(--text-main)]">{stop}</span>
                </div>
                <input
                  type="range"
                  min={-items.length}
                  max={items.length}
                  value={stop}
                  onChange={(e) => setStop(Number(e.target.value))}
                  className="w-full accent-[var(--accent-primary)]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Step Stride:</span>
                  <span className="font-mono font-bold text-[var(--text-main)]">{step}</span>
                </div>
                <input
                  type="range"
                  min={-2}
                  max={3}
                  value={step}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val !== 0) setStep(val);
                  }}
                  className="w-full accent-[var(--accent-primary)]"
                />
              </div>
            </div>

            {/* Quick Slicing Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-[11px] text-[var(--text-dim)] mr-1">Presets:</span>
              <button
                onClick={() => {
                  setStart(0);
                  setStop(3);
                  setStep(1);
                }}
                className="px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-[var(--border-strong)] font-mono text-[11px]"
              >
                items[:3] (First 3)
              </button>
              <button
                onClick={() => {
                  setStart(-3);
                  setStop(items.length);
                  setStep(1);
                }}
                className="px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-[var(--border-strong)] font-mono text-[11px]"
              >
                items[-3:] (Last 3)
              </button>
              <button
                onClick={() => {
                  setStart(0);
                  setStop(items.length);
                  setStep(2);
                }}
                className="px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-[var(--border-strong)] font-mono text-[11px]"
              >
                items[::2] (Evens)
              </button>
              <button
                onClick={() => {
                  setStart(items.length - 1);
                  setStop(-items.length - 1);
                  setStep(-1);
                }}
                className="px-2.5 py-1 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-300 font-mono text-[11px]"
              >
                items[::-1] (Reverse Copy)
              </button>
            </div>

            {/* Slice Extraction Output */}
            <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-xs font-mono space-y-1">
              <div className="text-[10px] text-[var(--text-dim)]">EXTRACTED SUB-SEQUENCE (NEW LIST ALLOCATED):</div>
              <div className="text-[var(--accent-primary)] font-bold text-sm">
                [{sliceResult.values.map((v) => `'${v}'`).join(', ')}]
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
            <div className="text-xs font-bold text-[var(--text-main)] flex items-center justify-between">
              <span>Slice Assignment / In-Place Splicing</span>
              <code className="text-red-300 font-mono text-sm font-bold">
                items[{start}:{stop}] = [{spliceReplacement}]
              </code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Start Index:</label>
                <input
                  type="number"
                  min={0}
                  max={items.length}
                  value={start}
                  onChange={(e) => setStart(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] font-mono text-xs text-[var(--text-main)]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Stop Index:</label>
                <input
                  type="number"
                  min={start}
                  max={items.length}
                  value={stop}
                  onChange={(e) => setStop(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] font-mono text-xs text-[var(--text-main)]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Replacement Elements (comma-separated):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={spliceReplacement}
                    onChange={(e) => setSpliceReplacement(e.target.value)}
                    placeholder="'X', 'Y', 'Z'"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] font-mono text-xs text-[var(--text-main)]"
                  />
                  <button
                    onClick={handleExecuteSplice}
                    className="px-3 py-1.5 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] font-bold text-xs shrink-0"
                  >
                    Splice
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              <strong>Dynamic Expansion/Contraction:</strong> Notice that replacing <code>[{start}:{stop}]</code> ({Math.max(0, stop - start)} items) with {spliceReplacement.split(',').length} items dynamically resizes the list buffer in-place without altering the list's memory address!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
