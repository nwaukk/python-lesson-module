/**
 * Truth Table & Boolean Logic Simulation Primitive
 * Section 8.4: Interactive truth-table switches for Boolean algebra (and, or, not),
 * glowing active row matrix, short-circuit execution pipeline,
 * and Python's non-boolean operand return semantics.
 */

import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Check, X, Sparkles, FastForward, ArrowRight, ShieldAlert } from 'lucide-react';
import { SimulationController } from './SimulationController';

export const TruthTableSim: React.FC = () => {
  const [valA, setValA] = useState<boolean>(true);
  const [valB, setValB] = useState<boolean>(false);
  const [mode, setMode] = useState<'matrix' | 'short-circuit' | 'non-boolean'>('matrix');

  const andResult = valA && valB;
  const orResult = valA || valB;
  const notAResult = !valA;

  // Complete truth table combinations
  const rows = [
    { a: true, b: true, and: true, or: true, notA: false },
    { a: true, b: false, and: false, or: true, notA: false },
    { a: false, b: true, and: false, or: true, notA: true },
    { a: false, b: false, and: false, or: false, notA: true },
  ];

  // Non-boolean operands for demo
  const nonBooleanExamples = [
    { expr: '"Lagos" or "Abuja"', a: '"Lagos"', b: '"Abuja"', aTruthy: true, op: 'or', result: '"Lagos"', reason: '"Lagos" is truthy; or returns the first truthy operand immediately without evaluating "Abuja".' },
    { expr: '"" or "Guest User"', a: '""', b: '"Guest User"', aTruthy: false, op: 'or', result: '"Guest User"', reason: '"" is falsy; or continues and evaluates/returns the second operand.' },
    { expr: '0 and "Premium Access"', a: '0', b: '"Premium Access"', aTruthy: false, op: 'and', result: '0', reason: '0 is falsy; and short-circuits and returns 0 without evaluating "Premium Access".' },
    { expr: '[1, 2] and "Success"', a: '[1, 2]', b: '"Success"', aTruthy: true, op: 'and', result: '"Success"', reason: '[1, 2] is non-empty (truthy); and proceeds to evaluate and return "Success".' },
    { expr: 'None or {"status": "ok"}', a: 'None', b: '{"status": "ok"}', aTruthy: false, op: 'or', result: '{"status": "ok"}', reason: 'None is falsy; or proceeds and returns the fallback dictionary.' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Boolean Logic, Truth Tables & Short-Circuiting"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {/* Navigation Mode Tabs */}
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2 text-xs">
          <button
            onClick={() => setMode('matrix')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              mode === 'matrix'
                ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Truth Table Matrix
          </button>
          <button
            onClick={() => setMode('short-circuit')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              mode === 'short-circuit'
                ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Short-Circuit Pipeline
          </button>
          <button
            onClick={() => setMode('non-boolean')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              mode === 'non-boolean'
                ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Non-Boolean Return Values
          </button>
        </div>

        {/* MODE 1: MATRIX & SWITCHES */}
        {mode === 'matrix' && (
          <div className="space-y-6">
            {/* Interactive Input Switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Switch A */}
              <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between shadow-xs">
                <div>
                  <span className="eyebrow-label text-xs">OPERAND A</span>
                  <div className="font-mono text-base font-bold text-[var(--text-main)]">
                    a = <span className={valA ? 'text-emerald-400' : 'text-red-400'}>{String(valA)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setValA(!valA)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                    valA
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}
                >
                  {valA ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  <span>{valA ? 'True' : 'False'}</span>
                </button>
              </div>

              {/* Switch B */}
              <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between shadow-xs">
                <div>
                  <span className="eyebrow-label text-xs">OPERAND B</span>
                  <div className="font-mono text-base font-bold text-[var(--text-main)]">
                    b = <span className={valB ? 'text-emerald-400' : 'text-red-400'}>{String(valB)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setValB(!valB)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                    valB
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}
                >
                  {valB ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  <span>{valB ? 'True' : 'False'}</span>
                </button>
              </div>
            </div>

            {/* Live Evaluated Formulas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-1">
                <span className="text-[10px] eyebrow-label text-[var(--text-dim)]">a and b</span>
                <div className={`text-base font-bold ${andResult ? 'text-emerald-400' : 'text-red-400'}`}>
                  {String(andResult)}
                </div>
                <div className="text-[10px] text-[var(--text-dim)] font-sans">True only if BOTH are True</div>
              </div>

              <div className="p-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-1">
                <span className="text-[10px] eyebrow-label text-[var(--text-dim)]">a or b</span>
                <div className={`text-base font-bold ${orResult ? 'text-emerald-400' : 'text-red-400'}`}>
                  {String(orResult)}
                </div>
                <div className="text-[10px] text-[var(--text-dim)] font-sans">True if AT LEAST ONE is True</div>
              </div>

              <div className="p-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-1">
                <span className="text-[10px] eyebrow-label text-[var(--text-dim)]">not a</span>
                <div className={`text-base font-bold ${notAResult ? 'text-emerald-400' : 'text-red-400'}`}>
                  {String(notAResult)}
                </div>
                <div className="text-[10px] text-[var(--text-dim)] font-sans">Inverts the Boolean value of a</div>
              </div>
            </div>

            {/* Complete Truth Table Stage with Glowing Active Row */}
            <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 shadow-inner font-mono text-xs">
              <div className="eyebrow-label text-xs">TRUTH TABLE MATRIX</div>
              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)] text-[var(--text-dim)]">
                      <th className="py-2.5 px-3">a</th>
                      <th className="py-2.5 px-3">b</th>
                      <th className="py-2.5 px-3 text-sky-400">a and b</th>
                      <th className="py-2.5 px-3 text-purple-400">a or b</th>
                      <th className="py-2.5 px-3 text-amber-400">not a</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {rows.map((r, idx) => {
                      const isActive = r.a === valA && r.b === valB;
                      return (
                        <tr
                          key={idx}
                          className={`transition-colors ${
                            isActive
                              ? 'bg-[var(--accent-subtle)] text-[var(--text-main)] font-bold ring-2 ring-[var(--accent-primary)]'
                              : 'text-[var(--text-muted)] hover:bg-[var(--bg-app)]'
                          }`}
                        >
                          <td className="py-2.5 px-3">{String(r.a)}</td>
                          <td className="py-2.5 px-3">{String(r.b)}</td>
                          <td className="py-2.5 px-3 text-sky-300">{String(r.and)}</td>
                          <td className="py-2.5 px-3 text-purple-300">{String(r.or)}</td>
                          <td className="py-2.5 px-3 text-amber-300">{String(r.notA)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: SHORT-CIRCUIT PIPELINE */}
        {mode === 'short-circuit' && (
          <div className="space-y-6 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
              <span className="eyebrow-label text-xs font-sans">WHAT IS SHORT-CIRCUIT EVALUATION?</span>
              <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
                Python evaluates logical operators from left to right and stops execution as soon as the final truth value is mathematically determined. Operand 2 is <strong>never executed</strong> if operand 1 is sufficient.
              </p>
            </div>

            {/* Case 1: AND short-circuiting */}
            <div className="p-5 rounded-2xl border border-sky-500/30 bg-[var(--bg-surface)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sky-400 font-bold">1. A and B (Short-circuits if A is False)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/30">AND GATE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-2">
                  <div className="text-[var(--text-dim)] text-[10px]">When A = False:</div>
                  <div className="text-sm font-bold text-[var(--text-main)]">False and expensive_query()</div>
                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-sans flex items-center gap-1.5">
                    <FastForward className="w-4 h-4 shrink-0" />
                    <span><strong>Short-circuited!</strong> expensive_query() is NOT called. Returns False.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-2">
                  <div className="text-[var(--text-dim)] text-[10px]">When A = True:</div>
                  <div className="text-sm font-bold text-[var(--text-main)]">True and expensive_query()</div>
                  <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-sans flex items-center gap-1.5">
                    <ArrowRight className="w-4 h-4 shrink-0" />
                    <span>A is True, so Python must evaluate expensive_query() to determine outcome.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Case 2: OR short-circuiting */}
            <div className="p-5 rounded-2xl border border-purple-500/30 bg-[var(--bg-surface)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-purple-400 font-bold">2. A or B (Short-circuits if A is True)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">OR GATE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-2">
                  <div className="text-[var(--text-dim)] text-[10px]">When A = True:</div>
                  <div className="text-sm font-bold text-[var(--text-main)]">True or database_call()</div>
                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-sans flex items-center gap-1.5">
                    <FastForward className="w-4 h-4 shrink-0" />
                    <span><strong>Short-circuited!</strong> database_call() is NEVER called. Returns True.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-2">
                  <div className="text-[var(--text-dim)] text-[10px]">When A = False:</div>
                  <div className="text-sm font-bold text-[var(--text-main)]">False or database_call()</div>
                  <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-sans flex items-center gap-1.5">
                    <ArrowRight className="w-4 h-4 shrink-0" />
                    <span>A is False, so Python must evaluate database_call() to determine outcome.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: NON-BOOLEAN RETURN VALUES */}
        {mode === 'non-boolean' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2 text-xs">
              <span className="eyebrow-label text-xs">THE PYTHON TRUTHINESS ENGINE</span>
              <p className="text-[var(--text-muted)] leading-relaxed">
                In Python, <code className="text-sky-400 font-mono">and</code> and <code className="text-purple-400 font-mono">or</code> do NOT convert their operands to <code className="text-emerald-400 font-mono">bool</code>! They evaluate truthiness, but return the <strong>exact operand object itself</strong>. This allows idiomatic fallback values (e.g. <code className="text-amber-300 font-mono">username or 'Anonymous'</code>).
              </p>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {nonBooleanExamples.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--accent-primary)]">{item.expr}</span>
                    <span className="text-base font-bold text-emerald-400">→ {item.result}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] font-sans">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
