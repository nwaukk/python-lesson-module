/**
 * Expression Tree Evaluator Simulation Primitive
 * Section 8.4: Visualises operator precedence, step-by-step mathematical reduction,
 * right-associative exponentiation (2 ** 3 ** 2 == 512), and practical formulas.
 */

import React, { useState } from 'react';
import { ArrowDown, RotateCcw, SkipForward, Sparkles, Calculator, Layers, HelpCircle } from 'lucide-react';
import { SimulationController } from './SimulationController';

export const ExpressionTreeSim: React.FC = () => {
  const [tab, setTab] = useState<'precedence' | 'right-assoc' | 'geometry'>('precedence');
  const [step, setStep] = useState<number>(1);

  // Expression 1: 2 + 3 * 4 ** 2
  const steps = [
    {
      step: 1,
      expression: '2 + 3 * 4 ** 2',
      action: 'Initial Expression. Python parses operator precedence: ** (exponent) has highest precedence.',
      highlight: '4 ** 2',
      reducedTo: '16',
      intermediate: '2 + 3 * 16',
    },
    {
      step: 2,
      expression: '2 + 3 * 16',
      action: 'Next highest precedence: * (multiplication) takes precedence over + (addition).',
      highlight: '3 * 16',
      reducedTo: '48',
      intermediate: '2 + 48',
    },
    {
      step: 3,
      expression: '2 + 48',
      action: 'Final operation: + (addition) evaluates.',
      highlight: '2 + 48',
      reducedTo: '50',
      intermediate: '50',
    },
  ];

  // Geometry formula calculator state
  const [base, setBase] = useState<number>(10);
  const [height, setHeight] = useState<number>(6);
  const [hours, setHours] = useState<number>(45);
  const [rate, setRate] = useState<number>(2500);

  const triangleArea = 0.5 * base * height;
  const regularHours = Math.min(40, hours);
  const overtimeHours = Math.max(0, hours - 40);
  const totalPay = regularHours * rate + overtimeHours * (rate * 1.5);

  const current = steps[step - 1];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Expression Tree & Operator Precedence"
        badge="simulation"
        currentStep={tab === 'precedence' ? step : undefined}
        totalSteps={tab === 'precedence' ? steps.length : undefined}
        onStepNext={tab === 'precedence' ? () => setStep((s) => Math.min(steps.length, s + 1)) : undefined}
        onStepPrev={tab === 'precedence' ? () => setStep((s) => Math.max(1, s - 1)) : undefined}
        onReset={tab === 'precedence' ? () => setStep(1) : undefined}
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2 text-xs">
          <button
            onClick={() => setTab('precedence')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              tab === 'precedence'
                ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Precedence Stepper
          </button>
          <button
            onClick={() => setTab('right-assoc')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              tab === 'right-assoc'
                ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Right-Associativity (2 ** 3 ** 2)
          </button>
          <button
            onClick={() => setTab('geometry')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              tab === 'geometry'
                ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Practical Formula Calculators
          </button>
        </div>

        {/* TAB 1: PRECEDENCE STEPPER */}
        {tab === 'precedence' && (
          <div className="space-y-6">
            {/* Step Banner */}
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="eyebrow-label text-xs">EVALUATION STEP {step} OF 3</span>
                <span className="text-xs font-mono text-[var(--accent-primary)] font-bold">
                  Hierarchy: ** &gt; * &gt; +
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">{current.action}</p>
            </div>

            {/* Visual Reduction Stages */}
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5 flex flex-col items-center shadow-xs">
              <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-app)] font-mono text-lg font-bold text-slate-300">
                2 + 3 * <span className="text-amber-400 font-black px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">4 ** 2</span>
              </div>

              <ArrowDown className="w-5 h-5 text-[var(--text-dim)] animate-bounce" />

              <div className={`p-4 rounded-2xl border font-mono text-lg font-bold transition-all ${
                step >= 2 ? 'border-sky-500/40 bg-sky-500/10 text-sky-200' : 'border-dashed border-[var(--border-subtle)] opacity-40'
              }`}>
                2 + <span className="text-sky-400 font-black px-1.5 py-0.5 rounded bg-sky-500/20 border border-sky-500/40">3 * 16</span>
              </div>

              <ArrowDown className="w-5 h-5 text-[var(--text-dim)]" />

              <div className={`p-4 rounded-2xl border font-mono text-lg font-bold transition-all ${
                step >= 3 ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300 ring-2 ring-emerald-500/30' : 'border-dashed border-[var(--border-subtle)] opacity-40'
              }`}>
                Result: <span className="text-emerald-400 font-black text-2xl ml-2">50</span>
              </div>
            </div>

            {/* Precedence Reference Ladder */}
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2 text-xs">
              <span className="eyebrow-label text-[10px] block">OPERATOR PRECEDENCE HIERARCHY</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center">
                <div className="p-2 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                  <div className="text-[var(--text-dim)] text-[10px]">1. Highest</div>
                  <div className="text-amber-400 font-bold">() Parentheses</div>
                </div>
                <div className="p-2 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                  <div className="text-[var(--text-dim)] text-[10px]">2. Exponent</div>
                  <div className="text-amber-400 font-bold">** Power</div>
                </div>
                <div className="p-2 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                  <div className="text-[var(--text-dim)] text-[10px]">3. Multiplicative</div>
                  <div className="text-sky-400 font-bold">*, /, //, %</div>
                </div>
                <div className="p-2 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                  <div className="text-[var(--text-dim)] text-[10px]">4. Additive</div>
                  <div className="text-emerald-400 font-bold">+, -</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RIGHT-ASSOCIATIVE EXPONENTIATION */}
        {tab === 'right-assoc' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
              <span className="eyebrow-label text-xs block">RIGHT-TO-LEFT ASSOCIATIVITY OF POWER (**)</span>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Most operators in Python (like <code className="font-mono text-emerald-400">+</code>, <code className="font-mono text-emerald-400">-</code>, <code className="font-mono text-emerald-400">*</code>, <code className="font-mono text-emerald-400">/</code>) group left-to-right. However, the exponentiation operator <code className="font-mono text-amber-400 font-bold">**</code> is <strong>right-associative</strong>!
              </p>

              <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono space-y-4">
                <div className="text-center">
                  <div className="text-xs text-[var(--text-dim)]">Expression:</div>
                  <div className="text-xl font-bold text-[var(--text-main)]">2 ** 3 ** 2</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
                    <div className="text-emerald-400 font-bold">✓ Python (Right-to-Left):</div>
                    <div className="text-[var(--text-main)]">2 ** (3 ** 2)</div>
                    <div className="text-[var(--text-main)]">= 2 ** 9</div>
                    <div className="text-emerald-300 font-bold text-base">= 512</div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 space-y-1 opacity-70">
                    <div className="text-red-400 font-bold">✗ Left-to-Right (Incorrect!):</div>
                    <div className="text-[var(--text-muted)]">(2 ** 3) ** 2</div>
                    <div className="text-[var(--text-muted)]">= 8 ** 2</div>
                    <div className="text-red-400 font-bold text-base">= 64 (Wrong!)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GEOMETRY & PAYROLL FORMULAS */}
        {tab === 'geometry' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Triangle Area Calculator */}
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="eyebrow-label text-xs">TRIANGLE AREA FORMULA</span>
                <span className="font-mono text-xs text-[var(--accent-primary)]">0.5 * b * h</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[var(--text-dim)] block">BASE (b)</label>
                  <input
                    type="number"
                    value={base}
                    onChange={(e) => setBase(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-sm text-[var(--text-main)]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--text-dim)] block">HEIGHT (h)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-sm text-[var(--text-main)]"
                  />
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs space-y-1">
                <div className="text-[var(--text-dim)]">area = 0.5 * {base} * {height}</div>
                <div className="text-emerald-400 font-bold text-base">Area = {triangleArea} sq units</div>
              </div>
            </div>

            {/* Weekly Earnings with Overtime */}
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="eyebrow-label text-xs">WEEKLY WAGE + OVERTIME</span>
                <span className="font-mono text-xs text-[var(--accent-primary)]">rate * 1.5 OT</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[var(--text-dim)] block">HOURS WORKED</label>
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-sm text-[var(--text-main)]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--text-dim)] block">HOURLY RATE (₦)</label>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-sm text-[var(--text-main)]"
                  />
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs space-y-1">
                <div className="text-[var(--text-dim)]">
                  Regular: {regularHours}h @ ₦{rate.toLocaleString()} | Overtime: {overtimeHours}h @ ₦{Math.round(rate * 1.5).toLocaleString()}
                </div>
                <div className="text-emerald-400 font-bold text-base">
                  Weekly Pay = ₦{Math.round(totalPay).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
