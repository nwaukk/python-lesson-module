/**
 * Syntax Repair Lab Signature Simulation
 * Master Specification Section 8.4 & Day 1 Brief:
 * Broken beginner programs that the learner diagnoses, repairs in an embedded editor,
 * and executes in the real Pyodide runtime to verify.
 */

import React, { useState } from 'react';
import {
  Wrench,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  HelpCircle,
  Terminal,
} from 'lucide-react';
import { SimulationController } from './SimulationController';
import { usePythonRuntime } from '../runtime/runtimeContext';

interface RepairCase {
  id: string;
  title: string;
  brokenCode: string;
  solutionHint: string;
  expectedOutput: string;
  errorName: string;
  diagnosis: string;
}

const REPAIR_CASES: RepairCase[] = [
  {
    id: 'case-quotes',
    title: 'Case 1: Unterminated String Literal',
    brokenCode: `print("Welcome to Lagos Tech Fest)`,
    solutionHint: 'Add the missing double quotation mark before the closing parenthesis: print("Welcome to Lagos Tech Fest")',
    expectedOutput: 'Welcome to Lagos Tech Fest',
    errorName: 'SyntaxError: unterminated string literal',
    diagnosis: 'Strings in Python must be closed with the exact same quote character (single or double) that opened them.',
  },
  {
    id: 'case-parens',
    title: 'Case 2: Missing Parentheses on print()',
    brokenCode: `print "Good morning Abuja"`,
    solutionHint: 'In Python 3, print is a function, not a statement. Wrap the argument in parentheses: print("Good morning Abuja")',
    expectedOutput: 'Good morning Abuja',
    errorName: 'SyntaxError: Missing parentheses in call to \'print\'',
    diagnosis: 'In older Python 2 (deprecated), print was a statement. In modern Python 3, parentheses are mandatory.',
  },
  {
    id: 'case-casing',
    title: 'Case 3: Case-Sensitivity Typo',
    brokenCode: `Print("Port Harcourt Oil & Gas Expo")`,
    solutionHint: 'Change uppercase "Print" to lowercase "print": print("Port Harcourt Oil & Gas Expo")',
    expectedOutput: 'Port Harcourt Oil & Gas Expo',
    errorName: 'NameError: name \'Print\' is not defined',
    diagnosis: 'Python is strictly case-sensitive. "Print" is treated as an unknown variable name, while "print" is the built-in function.',
  },
  {
    id: 'case-brackets',
    title: 'Case 4: Unclosed List Bracket',
    brokenCode: `scores = [85, 92, 78\nprint(scores)`,
    solutionHint: 'Close the list on line 1 with a closing square bracket: scores = [85, 92, 78]',
    expectedOutput: '[85, 92, 78]',
    errorName: 'SyntaxError: closing parenthesis \')\' does not match opening parenthesis \'[\'',
    diagnosis: 'Every opening bracket or parenthesis must have a matching closing pair before Python can execute.',
  },
];

export const SyntaxRepairSim: React.FC = () => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number>(0);
  const [code, setCode] = useState<string>(REPAIR_CASES[0].brokenCode);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [fixedCases, setFixedCases] = useState<Record<string, boolean>>({});
  const [localResult, setLocalResult] = useState<{ stdout: string; stderr: string; status: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const { runCode } = usePythonRuntime();

  const currentCase = REPAIR_CASES[selectedCaseIndex];

  const handleSelectCase = (index: number) => {
    setSelectedCaseIndex(index);
    setCode(REPAIR_CASES[index].brokenCode);
    setShowHint(false);
    setLocalResult(null);
  };

  const handleTestFix = async () => {
    setIsTesting(true);
    try {
      const res = await runCode(code);
      setLocalResult({
        stdout: res.stdout,
        stderr: res.stderr || (res.error ? res.error.message : ''),
        status: res.exitCode === 0 && !res.error ? 'success' : 'error',
      });
      if (res.exitCode === 0 && !res.error) {
        if (res.stdout.trim() === currentCase.expectedOutput.trim()) {
          setFixedCases((prev) => ({ ...prev, [currentCase.id]: true }));
        }
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handleResetCurrent = () => {
    setCode(currentCase.brokenCode);
    setShowHint(false);
    setLocalResult(null);
  };

  const isCaseSolved = fixedCases[currentCase.id];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Syntax Repair Clinic (Real Pyodide Runtime)"
        badge="real"
        onReset={handleResetCurrent}
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Case Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {REPAIR_CASES.map((item, idx) => {
            const isSelected = selectedCaseIndex === idx;
            const isSolved = fixedCases[item.id];

            return (
              <button
                key={item.id}
                onClick={() => handleSelectCase(idx)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] shadow-xs'
                    : isSolved
                    ? 'border-emerald-500/40 bg-emerald-500/10'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-[10px] text-[var(--text-dim)]">
                    #0{idx + 1}
                  </span>
                  {isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="font-bold text-xs text-[var(--text-main)] truncate">
                  {item.title.split(':')[1] || item.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Diagnosis & Error Banner */}
        <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-red-500/15 text-red-400">
                <AlertOctagon className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold">
                  Reported Exception
                </span>
                <h4 className="text-xs font-mono font-bold text-red-300">
                  {currentCase.errorName}
                </h4>
              </div>
            </div>

            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-[var(--accent-primary)] hover:underline flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
          </div>

          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            {currentCase.diagnosis}
          </p>

          {showHint && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
              <strong>Hint:</strong> {currentCase.solutionHint}
            </div>
          )}
        </div>

        {/* Repair Workbench: Editor & Console */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left: Code Repair Editor */}
          <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[var(--text-main)] flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                Repair Editor
              </span>
              <button
                onClick={handleResetCurrent}
                className="text-[11px] text-[var(--text-dim)] hover:text-[var(--text-main)] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset Code
              </button>
            </div>

            <div className="p-3 flex-1 bg-[var(--bg-code)] flex flex-col">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full flex-1 bg-transparent text-[var(--text-code)] font-mono text-xs leading-relaxed resize-none outline-hidden min-h-[140px]"
                placeholder="Type your corrected Python code here..."
                spellCheck={false}
              />
            </div>

            <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-between">
              <span className="text-[11px] text-[var(--text-dim)]">
                Target Output: <code className="text-emerald-400 font-mono font-bold">"{currentCase.expectedOutput}"</code>
              </span>
              <button
                onClick={handleTestFix}
                disabled={isTesting}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-40"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {isTesting ? 'Testing...' : 'Test Fix in Pyodide'}
              </button>
            </div>
          </div>

          {/* Right: Real Execution Feedback */}
          <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[var(--text-main)] flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Pyodide Execution Result
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  isCaseSolved
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-[var(--bg-app)] text-[var(--text-dim)]'
                }`}
              >
                {isCaseSolved ? 'RESOLVED' : localResult ? localResult.status.toUpperCase() : 'IDLE'}
              </span>
            </div>

            <div className="p-4 flex-1 bg-[var(--bg-code)] font-mono text-xs text-[var(--text-code)] min-h-[140px] overflow-y-auto">
              {localResult?.stderr ? (
                <div className="text-red-400 whitespace-pre-wrap">{localResult.stderr}</div>
              ) : localResult?.stdout ? (
                <div className="text-emerald-300 whitespace-pre-wrap">{localResult.stdout}</div>
              ) : (
                <div className="text-[var(--text-dim)] italic">
                  Press "Test Fix in Pyodide" to run your repaired code.
                </div>
              )}
            </div>

            <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]">
              {isCaseSolved ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Success! Error repaired and output verified correctly.</span>
                </div>
              ) : (
                <div className="text-[11px] text-[var(--text-dim)]">
                  Make your fix in the editor and click "Test Fix" to verify against the real Python compiler.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
