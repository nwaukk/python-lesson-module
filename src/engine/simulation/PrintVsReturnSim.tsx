/**
 * Print vs Return Simulation Primitive
 * Section 14 (Day 11 Signature Simulation):
 * Compares the same function written with print() vs return, highlighting
 * what goes to sys.stdout versus what value actually reaches the caller.
 */

import React, { useState } from 'react';
import { Terminal, CornerDownLeft, AlertTriangle } from 'lucide-react';
import { SimulationController } from './SimulationController';

export const PrintVsReturnSim: React.FC = () => {
  const [inputVal, setInputVal] = useState<number>(5);

  const printedCallerValue = 'None';
  const returnedCallerValue = String(inputVal * 2);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Print vs Return: What Reaches the Caller?" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        {/* Input Slider */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-[200px]">
            <div className="flex items-center justify-between">
              <label htmlFor="pvr-input" className="eyebrow-label text-xs">ARGUMENT x</label>
              <span className="font-mono text-sm font-extrabold text-[var(--accent-primary)]">x = {inputVal}</span>
            </div>
            <input
              id="pvr-input"
              type="range"
              min="1"
              max="20"
              value={inputVal}
              aria-label="Argument x value"
              onChange={(e) => setInputVal(parseInt(e.target.value, 10))}
              className="w-full accent-[var(--accent-primary)] cursor-pointer"
            />
          </div>
          <div className="font-mono text-xs px-3 py-2 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-main)]">
            Caller expression: <span className="text-[var(--accent-primary)] font-bold">total = double({inputVal}) + 1</span>
          </div>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Version A: print() */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="eyebrow-label text-xs text-amber-400">VERSION A: USES print()</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 font-bold">
                Implicit None
              </span>
            </div>
            <pre className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-main)] overflow-x-auto">
{`def double_print(x):
    print(x * 2)  # No return!

res = double_print(${inputVal})
print("Caller got:", res)`}
            </pre>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-1.5 text-[10px] eyebrow-label mb-1">
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  <span>sys.stdout</span>
                </div>
                <div className="font-mono font-bold text-emerald-400">{inputVal * 2}</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-1.5 text-[10px] eyebrow-label mb-1">
                  <CornerDownLeft className="w-3 h-3 text-rose-400" />
                  <span>Value in `res`</span>
                </div>
                <div className="font-mono font-bold text-rose-400">{printedCallerValue}</div>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[11px] text-[var(--text-main)] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>
                <code className="font-mono">res + 1</code> raises{' '}
                <code className="font-mono font-bold">TypeError: unsupported operand type(s) for +: &apos;NoneType&apos; and &apos;int&apos;</code>!
              </span>
            </div>
          </div>

          {/* Version B: return */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="eyebrow-label text-xs text-emerald-400">VERSION B: USES return</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 font-bold">
                Composable Value
              </span>
            </div>
            <pre className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-main)] overflow-x-auto">
{`def double_return(x):
    return x * 2

res = double_return(${inputVal})
print("Caller got:", res)`}
            </pre>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-1.5 text-[10px] eyebrow-label mb-1">
                  <Terminal className="w-3 h-3 text-[var(--text-dim)]" />
                  <span>sys.stdout (inside fn)</span>
                </div>
                <div className="font-mono text-[var(--text-dim)] italic">(silent)</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-1.5 text-[10px] eyebrow-label mb-1">
                  <CornerDownLeft className="w-3 h-3 text-emerald-400" />
                  <span>Value in `res`</span>
                </div>
                <div className="font-mono font-bold text-emerald-400">{returnedCallerValue}</div>
              </div>
            </div>
            <div
              role="status"
              aria-live="polite"
              className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-[var(--text-main)]"
            >
              <code className="font-mono">res + 1</code> evaluates cleanly to{' '}
              <strong className="font-mono text-emerald-400">{inputVal * 2 + 1}</strong> because the caller received an{' '}
              <code className="font-mono">int</code>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
