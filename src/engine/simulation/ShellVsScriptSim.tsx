/**
 * Shell versus Script Signature Simulation
 * Master Specification Section 8.4 & Day 1 Brief:
 * Compares the interactive REPL (line-by-line immediate evaluation, auto-echoing expressions)
 * with script file execution (top-to-bottom batch, requiring explicit print()).
 */

import React, { useState } from 'react';
import {
  Terminal,
  FileCode,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { SimulationController } from './SimulationController';

interface ReplStep {
  prompt: string;
  command: string;
  echoOutput?: string;
  internalNote: string;
}

const REPL_STEPS: ReplStep[] = [
  {
    prompt: '>>>',
    command: 'unit_price = 750',
    internalNote: 'Variable bound in global namespace. No return value, so REPL displays nothing.',
  },
  {
    prompt: '>>>',
    command: 'quantity = 4',
    internalNote: 'Variable bound. Ready for calculations.',
  },
  {
    prompt: '>>>',
    command: 'unit_price * quantity',
    echoOutput: '3000',
    internalNote:
      'REPL evaluates the expression and automatically prints the return value (3000) WITHOUT print()!',
  },
  {
    prompt: '>>>',
    command: 'print("Transaction Total: N3,000")',
    echoOutput: 'Transaction Total: N3,000',
    internalNote: 'Explicit print() writes formatted string to stdout.',
  },
];

const SCRIPT_LINES = [
  '# pos_receipt.py',
  'unit_price = 750',
  'quantity = 4',
  'unit_price * quantity  # Evaluated, but discarded without print()!',
  'print("Transaction Total: N3,000")',
];

export const ShellVsScriptSim: React.FC = () => {
  const [replProgress, setReplProgress] = useState<number>(0);
  const [scriptRan, setScriptRan] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'both' | 'repl' | 'script'>('both');

  const handleStepRepl = () => {
    if (replProgress < REPL_STEPS.length) {
      setReplProgress((prev) => prev + 1);
    }
  };

  const handleRunScript = () => {
    setScriptRan(true);
  };

  const handleReset = () => {
    setReplProgress(0);
    setScriptRan(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Interactive Shell (REPL) versus Script File Execution"
        badge="simulation"
        onReset={handleReset}
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Core Pedagogical Insight Banner */}
        <div className="bg-[var(--accent-subtle)] border border-[var(--accent-primary)]/30 rounded-2xl p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-[var(--text-main)]">
              The Essential Difference: Automatic Echo vs Explicit Print
            </span>
            <p className="text-[var(--text-muted)] leading-relaxed">
              In the <strong>Interactive Shell (REPL)</strong>, Python immediately evaluates any expression you type and auto-prints its value. In a <strong>Script File (.py)</strong>, Python runs silently from top to bottom; expressions without <code className="font-mono bg-[var(--bg-surface)] px-1 rounded text-[var(--accent-primary)]">print()</code> calculate internally and are immediately discarded!
            </p>
          </div>
        </div>

        {/* View Switcher for Compact Screens */}
        <div className="sm:hidden flex rounded-xl bg-[var(--bg-surface)] p-1 border border-[var(--border-subtle)] text-xs">
          <button
            onClick={() => setActiveTab('both')}
            className={`flex-1 py-1 rounded-lg ${activeTab === 'both' ? 'bg-[var(--accent-primary)] text-white font-bold' : 'text-[var(--text-muted)]'}`}
          >
            Side by Side
          </button>
          <button
            onClick={() => setActiveTab('repl')}
            className={`flex-1 py-1 rounded-lg ${activeTab === 'repl' ? 'bg-[var(--accent-primary)] text-white font-bold' : 'text-[var(--text-muted)]'}`}
          >
            REPL Shell
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`flex-1 py-1 rounded-lg ${activeTab === 'script' ? 'bg-[var(--accent-primary)] text-white font-bold' : 'text-[var(--text-muted)]'}`}
          >
            Script File
          </button>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Column 1: Interactive REPL */}
          {(activeTab === 'both' || activeTab === 'repl') && (
            <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] flex flex-col overflow-hidden shadow-xs">
              <div className="px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-xs text-[var(--text-main)]">Interactive Shell (REPL)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Line-by-Line Immediate
                </span>
              </div>

              {/* REPL Terminal Window */}
              <div className="p-4 flex-1 bg-[var(--bg-code)] font-mono text-xs text-[var(--text-code)] min-h-[220px] flex flex-col justify-start space-y-1.5">
                <div className="text-[var(--text-dim)]">
                  Python 3.12 (Interactive REPL Simulation)
                  <br />
                  Type "help" for more information.
                </div>

                {REPL_STEPS.slice(0, replProgress).map((step, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="text-emerald-300">
                      <span className="text-amber-400 select-none mr-1.5">{step.prompt}</span>
                      {step.command}
                    </div>
                    {step.echoOutput && (
                      <div className="text-sky-300 font-bold pl-5">
                        {step.echoOutput}
                      </div>
                    )}
                  </div>
                ))}

                {replProgress < REPL_STEPS.length ? (
                  <div className="flex items-center text-amber-400 pt-1">
                    <span className="select-none mr-1.5">&gt;&gt;&gt;</span>
                    <span className="w-2 h-4 bg-amber-400 animate-pulse" />
                  </div>
                ) : (
                  <div className="text-emerald-400 text-[11px] pt-2 border-t border-[var(--border-subtle)] flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> REPL demonstration complete.
                  </div>
                )}
              </div>

              {/* REPL Controller Footer */}
              <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] space-y-2">
                {replProgress > 0 && (
                  <div className="text-[11px] text-[var(--text-dim)] bg-[var(--bg-app)] p-2 rounded-lg border border-[var(--border-subtle)]">
                    <strong className="text-[var(--text-main)]">Note:</strong>{' '}
                    {REPL_STEPS[replProgress - 1].internalNote}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[var(--text-muted)]">
                    Step {replProgress} of {REPL_STEPS.length}
                  </span>
                  <button
                    onClick={handleStepRepl}
                    disabled={replProgress >= REPL_STEPS.length}
                    className="px-3 py-1.5 rounded-lg bg-[var(--accent-primary)] text-[var(--accent-on)] text-xs font-semibold hover:bg-[var(--accent-hover)] disabled:opacity-40 transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Send Next Line</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Column 2: Script File Execution */}
          {(activeTab === 'both' || activeTab === 'script') && (
            <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] flex flex-col overflow-hidden shadow-xs">
              <div className="px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-sky-400" />
                  <span className="font-bold text-xs text-[var(--text-main)]">Script File (pos_receipt.py)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  Batch Execution
                </span>
              </div>

              {/* Script Source Code View */}
              <div className="p-4 bg-[var(--bg-code)] font-mono text-xs border-b border-[var(--border-subtle)] space-y-1">
                {SCRIPT_LINES.map((line, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2 ${
                      idx === 3
                        ? 'bg-amber-500/10 -mx-2 px-2 py-0.5 rounded text-amber-200'
                        : 'text-[var(--text-code)]'
                    }`}
                  >
                    <span className="text-[var(--text-dim)] select-none w-4 text-right">
                      {idx + 1}
                    </span>
                    <span className="flex-1">{line}</span>
                  </div>
                ))}
              </div>

              {/* Script Execution Console */}
              <div className="p-4 flex-1 bg-[var(--bg-surface)] font-mono text-xs min-h-[110px] flex flex-col justify-start">
                <div className="text-[11px] font-sans font-bold text-[var(--text-dim)] mb-1 flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5" /> Terminal Run Output:
                </div>

                {scriptRan ? (
                  <div className="space-y-1 text-emerald-400 bg-[var(--bg-code)] p-3 rounded-xl border border-[var(--border-subtle)]">
                    <div className="text-[var(--text-dim)] text-[11px]">$ python3 pos_receipt.py</div>
                    <div className="text-emerald-300 font-bold">Transaction Total: N3,000</div>
                  </div>
                ) : (
                  <div className="text-xs text-[var(--text-dim)] italic flex-1 flex items-center justify-center p-4 border border-dashed border-[var(--border-subtle)] rounded-xl">
                    Click "Run Script (python3 pos_receipt.py)" to execute the file.
                  </div>
                )}
              </div>

              {/* Script Controller Footer */}
              <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] space-y-2">
                <div className="text-[11px] text-[var(--text-dim)] bg-[var(--bg-app)] p-2 rounded-lg border border-[var(--border-subtle)]">
                  <strong className="text-[var(--text-main)]">Key Insight:</strong> Line 4 evaluated{' '}
                  <code className="text-amber-400">750 * 4 = 3000</code>, but because it wasn't passed to{' '}
                  <code className="text-sky-300">print()</code>, nothing was displayed!
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[var(--text-muted)]">
                    Command: python3 pos_receipt.py
                  </span>
                  <button
                    onClick={handleRunScript}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Script</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
