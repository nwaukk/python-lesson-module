/**
 * Arithmetic & Division Visualizer Simulation
 * Section 8.4: Interactive arithmetic lab demonstrating all 7 Python operators,
 * standard float division vs floor division rounding towards negative infinity,
 * modulus remainder algebra (r = a - (a // b) * b), and exponentiation.
 */

import React, { useState } from 'react';
import { Calculator, Divide, HelpCircle, ArrowRight, RotateCcw, AlertTriangle, Sparkles, Hash } from 'lucide-react';
import { SimulationController } from './SimulationController';

export const ArithmeticVisualizerSim: React.FC = () => {
  const [valA, setValA] = useState<number>(17);
  const [valB, setValB] = useState<number>(5);
  const [activeTab, setActiveTab] = useState<'all' | 'division' | 'modulus' | 'strings'>('all');

  const bIsZero = valB === 0;

  // Python arithmetic calculations
  const add = valA + valB;
  const sub = valA - valB;
  const mul = valA * valB;
  const div = bIsZero ? null : valA / valB;
  // In Python, floor division rounds towards negative infinity (Math.floor)
  const floorDiv = bIsZero ? null : Math.floor(valA / valB);
  // Python modulus follows: r = a - (a // b) * b
  const mod = bIsZero ? null : valA - Math.floor(valA / valB) * valB;
  const pow = Math.pow(valA, valB);

  const presets = [
    { label: 'Standard (17, 5)', a: 17, b: 5, note: 'Classic floor division and remainder' },
    { label: 'Negative (-7, 2)', a: -7, b: 2, note: '-7 // 2 is -4 (rounds down towards -∞!)' },
    { label: 'Float Operands (7.5, 2.0)', a: 7.5, b: 2.0, note: 'Float operands yield float results' },
    { label: 'Power (2, 8)', a: 2, b: 8, note: 'Exponentiation 2 ** 8 = 256' },
    { label: 'Clock / 24h (27, 24)', a: 27, b: 24, note: '27 % 24 = 3 (hours on a clock)' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Arithmetic & Division Operations Visualiser"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow-label text-[10px] text-[var(--text-dim)] mr-1">SCENARIOS:</span>
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setValA(p.a);
                setValB(p.b);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors border ${
                valA === p.a && valB === p.b
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Operand Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="eyebrow-label text-xs">OPERAND A (NUMERATOR)</span>
              <span className="font-mono text-xs text-[var(--text-dim)]">type: {Number.isInteger(valA) ? 'int' : 'float'}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="any"
                value={valA}
                onChange={(e) => setValA(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-lg font-bold text-[var(--text-main)] focus:outline-hidden focus:border-[var(--accent-primary)]"
              />
              <div className="flex gap-1">
                <button
                  onClick={() => setValA((v) => v - 1)}
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-xs font-bold text-[var(--text-main)]"
                >
                  -1
                </button>
                <button
                  onClick={() => setValA((v) => v + 1)}
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-xs font-bold text-[var(--text-main)]"
                >
                  +1
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="eyebrow-label text-xs">OPERAND B (DENOMINATOR)</span>
              <span className="font-mono text-xs text-[var(--text-dim)]">type: {Number.isInteger(valB) ? 'int' : 'float'}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="any"
                value={valB}
                onChange={(e) => setValB(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-lg font-bold text-[var(--text-main)] focus:outline-hidden focus:border-[var(--accent-primary)]"
              />
              <div className="flex gap-1">
                <button
                  onClick={() => setValB((v) => v - 1)}
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-xs font-bold text-[var(--text-main)]"
                >
                  -1
                </button>
                <button
                  onClick={() => setValB((v) => v + 1)}
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-xs font-bold text-[var(--text-main)]"
                >
                  +1
                </button>
              </div>
            </div>
            {bIsZero && (
              <div className="text-[11px] text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>ZeroDivisionError: division or modulo by zero!</span>
              </div>
            )}
          </div>
        </div>

        {/* View Mode Navigation */}
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'all'
                ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            All 7 Operators Grid
          </button>
          <button
            onClick={() => setActiveTab('division')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'division'
                ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            / vs // Deep-Dive
          </button>
          <button
            onClick={() => setActiveTab('modulus')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'modulus'
                ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Modulus (%) Architecture
          </button>
          <button
            onClick={() => setActiveTab('strings')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'strings'
                ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Sequence (+ / *) Operations
          </button>
        </div>

        {/* TAB 1: ALL OPERATORS GRID */}
        {activeTab === 'all' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
            {/* Addition */}
            <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-1">
              <div className="flex items-center justify-between text-[var(--text-dim)] text-[10px]">
                <span>ADDITION (+)</span>
                <span>type: {Number.isInteger(add) ? 'int' : 'float'}</span>
              </div>
              <div className="text-sm text-[var(--text-muted)]">{valA} + {valB}</div>
              <div className="text-xl font-bold text-emerald-400">= {add}</div>
              <div className="text-[10px] text-[var(--text-dim)] font-sans">Standard mathematical sum</div>
            </div>

            {/* Subtraction */}
            <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-1">
              <div className="flex items-center justify-between text-[var(--text-dim)] text-[10px]">
                <span>SUBTRACTION (-)</span>
                <span>type: {Number.isInteger(sub) ? 'int' : 'float'}</span>
              </div>
              <div className="text-sm text-[var(--text-muted)]">{valA} - {valB}</div>
              <div className="text-xl font-bold text-emerald-400">= {sub}</div>
              <div className="text-[10px] text-[var(--text-dim)] font-sans">Difference between operands</div>
            </div>

            {/* Multiplication */}
            <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-1">
              <div className="flex items-center justify-between text-[var(--text-dim)] text-[10px]">
                <span>MULTIPLICATION (*)</span>
                <span>type: {Number.isInteger(mul) ? 'int' : 'float'}</span>
              </div>
              <div className="text-sm text-[var(--text-muted)]">{valA} * {valB}</div>
              <div className="text-xl font-bold text-emerald-400">= {mul}</div>
              <div className="text-[10px] text-[var(--text-dim)] font-sans">Product of operands</div>
            </div>

            {/* Division (Float) */}
            <div className="p-4 rounded-2xl border border-sky-500/30 bg-sky-500/5 space-y-1">
              <div className="flex items-center justify-between text-sky-400 text-[10px] font-bold">
                <span>FLOAT DIVISION (/)</span>
                <span>ALWAYS float</span>
              </div>
              <div className="text-sm text-[var(--text-muted)]">{valA} / {valB}</div>
              <div className="text-xl font-bold text-sky-300">
                {bIsZero ? <span className="text-red-400 text-sm">ZeroDivisionError</span> : `= ${div}`}
              </div>
              <div className="text-[10px] text-[var(--text-dim)] font-sans">Always returns float, even for 4 / 2 = 2.0</div>
            </div>

            {/* Floor Division */}
            <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-1">
              <div className="flex items-center justify-between text-amber-400 text-[10px] font-bold">
                <span>FLOOR DIVISION (//)</span>
                <span>Rounds to -∞</span>
              </div>
              <div className="text-sm text-[var(--text-muted)]">{valA} // {valB}</div>
              <div className="text-xl font-bold text-amber-300">
                {bIsZero ? <span className="text-red-400 text-sm">ZeroDivisionError</span> : `= ${floorDiv}`}
              </div>
              <div className="text-[10px] text-[var(--text-dim)] font-sans">Discards fractional part, rounds towards -∞</div>
            </div>

            {/* Modulus */}
            <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-500/5 space-y-1">
              <div className="flex items-center justify-between text-purple-400 text-[10px] font-bold">
                <span>MODULUS (%)</span>
                <span>Remainder</span>
              </div>
              <div className="text-sm text-[var(--text-muted)]">{valA} % {valB}</div>
              <div className="text-xl font-bold text-purple-300">
                {bIsZero ? <span className="text-red-400 text-sm">ZeroDivisionError</span> : `= ${mod}`}
              </div>
              <div className="text-[10px] text-[var(--text-dim)] font-sans">Formula: r = a - (a // b) * b</div>
            </div>

            {/* Exponentiation */}
            <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-1 sm:col-span-2 lg:col-span-3">
              <div className="flex items-center justify-between text-[var(--text-dim)] text-[10px]">
                <span>EXPONENTIATION (**)</span>
                <span>Power ($a^b$)</span>
              </div>
              <div className="text-sm text-[var(--text-muted)]">{valA} ** {valB}</div>
              <div className="text-xl font-bold text-emerald-400">
                = {Math.abs(pow) > 1e12 ? pow.toExponential(4) : pow}
              </div>
              <div className="text-[10px] text-[var(--text-dim)] font-sans">Raises base a to exponent power b. Right-associative!</div>
            </div>
          </div>
        )}

        {/* TAB 2: DIVISION COMPARISON DEEP-DIVE */}
        {activeTab === 'division' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="eyebrow-label text-xs">VISUAL NUMBER LINE &amp; FLOOR ROUNDING</span>
                <span className="text-xs font-mono text-[var(--accent-primary)] font-bold">
                  {valA} / {valB} = {bIsZero ? 'undefined' : div}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Notice the difference between standard division <code className="text-sky-400">/</code> and floor division <code className="text-amber-400">//</code>. In Python, floor division does <strong>not</strong> truncate towards zero (like C/Java integer cast); it mathematically computes <code className="text-[var(--text-main)] font-mono">math.floor()</code>, rounding down towards negative infinity (<code className="text-[var(--accent-primary)] font-mono">-∞</code>).
              </p>

              {!bIsZero && div !== null && floorDiv !== null && (
                <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-4">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <div>
                      <span className="text-[var(--text-dim)] block text-[10px]">FLOAT DIVISION (/)</span>
                      <span className="text-base font-bold text-sky-400">{valA} / {valB} = {div}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[var(--text-dim)]" />
                    <div>
                      <span className="text-[var(--text-dim)] block text-[10px]">FLOOR DIVISION (//)</span>
                      <span className="text-base font-bold text-amber-400">{valA} // {valB} = {floorDiv}</span>
                    </div>
                  </div>

                  {valA < 0 !== valB < 0 && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        <strong>Crucial Python Watch-out:</strong> Because one operand is negative, the true quotient is negative ({div}). Rounding down towards <code className="font-mono font-bold">-∞</code> moves further negative from {div} down to <strong>{floorDiv}</strong> (not {Math.trunc(div)})!
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MODULUS ARCHITECTURE */}
        {activeTab === 'modulus' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <span className="eyebrow-label text-xs block">THE FORMAL PYTHON MODULUS LAW</span>
              <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-purple-500/30 font-mono text-center text-sm space-y-1">
                <div className="text-purple-400 font-bold text-base">r = a - (a // b) * b</div>
                <div className="text-xs text-[var(--text-muted)]">
                  {valA} - ({floorDiv}) * {valB} = <span className="text-emerald-400 font-bold">{mod}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-1">
                  <div className="font-bold text-[var(--text-main)]">1. Parity Check (Even vs Odd)</div>
                  <div className="text-[var(--text-muted)]">
                    <code className="text-purple-300 font-mono">number % 2 == 0</code> yields <code className="text-emerald-400 font-mono">{valA % 2 === 0 ? 'True (Even)' : 'False (Odd)'}</code> for {valA}.
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-1">
                  <div className="font-bold text-[var(--text-main)]">2. Clock / Cycle Wraparound</div>
                  <div className="text-[var(--text-muted)]">
                    Any counter cycling across interval <code className="font-mono text-[var(--text-main)]">N</code> wraps around safely using <code className="font-mono text-purple-300">count % N</code>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STRING / SEQUENCE OPERATORS */}
        {activeTab === 'strings' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <span className="eyebrow-label text-xs block">OPERATOR OVERLOADING ON SEQUENCES</span>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                In Python, <code className="text-emerald-400 font-mono">+</code> and <code className="text-emerald-400 font-mono">*</code> are polymorphic. When applied to strings or lists, they perform concatenation and repetition instead of mathematical addition and multiplication.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-1">
                  <div className="text-[var(--text-dim)] text-[10px]">STRING CONCATENATION (+)</div>
                  <div className="text-[var(--text-muted)]">"Python " + "Visual Lab"</div>
                  <div className="text-emerald-400 font-bold text-sm">→ "Python Visual Lab"</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-1">
                  <div className="text-[var(--text-dim)] text-[10px]">STRING REPETITION (*)</div>
                  <div className="text-[var(--text-muted)]">"₦500 " * 3</div>
                  <div className="text-emerald-400 font-bold text-sm">→ "₦500 ₦500 ₦500 "</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-red-500/20 text-red-300 space-y-1">
                  <div className="text-red-400 text-[10px] font-bold">TYPEERROR TRAP: STRING + INT</div>
                  <div className="text-[var(--text-muted)]">"Total: ₦" + 500</div>
                  <div className="text-red-400 font-bold text-xs">→ TypeError: can only concatenate str (not "int") to str</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
