/**
 * CodeRunnerExercise Component
 * Supports 'fix-the-bug' and 'write-code' exercise types.
 * Embedded CodeMirror 6, live Python test execution, expected vs actual outputs.
 * Strict compliance with Section 10.2 of Master Specification.
 */

import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle2, XCircle, AlertTriangle, Eye, ShieldCheck } from 'lucide-react';
import { CodeMirrorEditor } from '../editor/CodeMirrorEditor';
import { usePythonRuntime } from '../runtime/runtimeContext';
import { TestCase } from '../lesson/types';

interface Props {
  starterCode: string;
  solutionCode?: string;
  testCases?: TestCase[];
  onComplete: (passed: boolean, details?: { passedCount: number; totalCount: number }) => void;
}

export const CodeRunnerExercise: React.FC<Props> = ({
  starterCode,
  solutionCode,
  testCases = [],
  onComplete,
}) => {
  const [code, setCode] = useState<string>(starterCode);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<{
    tested: boolean;
    allPassed: boolean;
    results: {
      id: string;
      label: string;
      passed: boolean;
      expected: string;
      actual: string;
      hidden: boolean;
    }[];
    executionOutput?: string;
    error?: string;
  } | null>(null);

  const { runCode } = usePythonRuntime();

  const handleReset = () => {
    setCode(starterCode);
    setTestResults(null);
  };

  const handleRunTests = async () => {
    setIsRunning(true);
    setTestResults(null);

    try {
      // 1. Run main user code to get stdout & syntax validity
      const mainRun = await runCode(code);
      const mainOutput = mainRun.stdout.trim();

      if (mainRun.error) {
        setTestResults({
          tested: true,
          allPassed: false,
          results: [],
          executionOutput: mainOutput,
          error: mainRun.error.friendlyExplanation || mainRun.error.traceback,
        });
        onComplete(false, { passedCount: 0, totalCount: testCases.length || 1 });
        setIsRunning(false);
        return;
      }

      // 2. Evaluate test cases if present
      if (testCases.length === 0) {
        // Simple output or syntax check
        const passed = !mainRun.error && mainOutput.length > 0;
        setTestResults({
          tested: true,
          allPassed: passed,
          results: [
            {
              id: 'basic-check',
              label: 'Execution and output check',
              passed,
              expected: 'Successful execution with valid output',
              actual: mainOutput || '(No output produced)',
              hidden: false,
            },
          ],
          executionOutput: mainOutput,
        });
        onComplete(passed, { passedCount: passed ? 1 : 0, totalCount: 1 });
        setIsRunning(false);
        return;
      }

      const results = [];
      let passedCount = 0;

      for (const tc of testCases) {
        // Run code with test case setup/call
        const testScript = `${code}\n\n# Test Case: ${tc.label}\n${tc.setup || ''}`;
        const runRes = await runCode(testScript);
        const actual = runRes.stdout.trim();
        const expected = tc.expected.trim();

        // Check if output matches expected (or contains expected)
        const passed = !runRes.error && (actual === expected || actual.endsWith(expected));
        if (passed) passedCount++;

        results.push({
          id: tc.id,
          label: tc.label,
          passed,
          expected,
          actual: runRes.error ? `Error: ${runRes.error.name}` : actual,
          hidden: tc.hidden,
        });
      }

      const allPassed = passedCount === testCases.length;
      setTestResults({
        tested: true,
        allPassed,
        results,
        executionOutput: mainOutput,
      });

      onComplete(allPassed, { passedCount, totalCount: testCases.length });
    } catch (err: any) {
      setTestResults({
        tested: true,
        allPassed: false,
        results: [],
        error: err?.message || 'Execution failed',
      });
      onComplete(false, { passedCount: 0, totalCount: testCases.length });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Code Editor Container */}
      <div className="rounded-xl border border-[var(--border-subtle)] overflow-hidden bg-[var(--bg-app)]">
        <div className="px-3 py-2 bg-[var(--bg-surface-elevated)] border-b border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
          <span className="text-[var(--text-dim)]">solution.py</span>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            title="Reset code to starter template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="font-sans text-[11px]">Reset Starter</span>
          </button>
        </div>
        <div className="h-48 min-h-[160px]">
          <CodeMirrorEditor value={code} onChange={setCode} />
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between">
        <div className="text-[11px] text-[var(--text-dim)]">
          {testCases.length > 0
            ? `${testCases.filter((t) => !t.hidden).length} visible test${testCases.length > 1 ? 's' : ''}${
                testCases.some((t) => t.hidden) ? ' + hidden tests' : ''
              }`
            : 'Interactive code test'}
        </div>

        <button
          onClick={handleRunTests}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] text-xs font-bold shadow-md disabled:opacity-50 transition-colors"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isRunning ? 'Running in Pyodide...' : 'Run Test Cases'}</span>
        </button>
      </div>

      {/* Test Results Output */}
      {testResults && (
        <div className="space-y-3 font-sans animate-in fade-in">
          {/* Summary Status Banner */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
              testResults.allPassed
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {testResults.allPassed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-amber-400 shrink-0" />
              )}
              <span className="font-semibold">
                {testResults.allPassed
                  ? 'All tests passed! Correct Python solution.'
                  : 'Some tests did not pass. Check the expected versus actual values below.'}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/30 border border-white/10 uppercase">
              REAL PYTHON
            </span>
          </div>

          {/* Error Traceback if runtime exception occurred */}
          {testResults.error && (
            <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-red-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Runtime Exception</span>
              </div>
              <pre className="font-mono text-[11px] whitespace-pre-wrap bg-black/40 p-2.5 rounded border border-red-500/20 text-red-300 overflow-x-auto">
                {testResults.error}
              </pre>
            </div>
          )}

          {/* Test Case Breakdown */}
          {testResults.results.length > 0 && (
            <div className="space-y-2">
              <span className="eyebrow-label text-[10px] block text-[var(--text-dim)]">TEST RESULTS</span>
              {testResults.results.map((r, i) => (
                <div
                  key={r.id}
                  className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                    r.passed
                      ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-200'
                      : 'border-amber-500/20 bg-amber-500/5 text-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-medium">
                      {r.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <span>
                        Test {i + 1}: {r.label}
                      </span>
                    </div>
                    {r.hidden ? (
                      <span className="text-[10px] text-[var(--text-dim)] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                        Hidden Test
                      </span>
                    ) : (
                      <span className="text-[10px] text-[var(--text-dim)]">Visible Test</span>
                    )}
                  </div>

                  {!r.passed && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                      <div className="p-2 rounded bg-black/30 border border-white/5">
                        <span className="text-[10px] text-[var(--text-dim)] block mb-0.5 font-sans">
                          Expected Output:
                        </span>
                        <div className="text-emerald-400 whitespace-pre-wrap">
                          {r.hidden ? '(Hidden verification)' : r.expected}
                        </div>
                      </div>
                      <div className="p-2 rounded bg-black/30 border border-white/5">
                        <span className="text-[10px] text-[var(--text-dim)] block mb-0.5 font-sans">
                          Actual Output:
                        </span>
                        <div className="text-red-300 whitespace-pre-wrap">{r.actual || '(None)'}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
