/**
 * Console Panel
 * Section 8.2: Captures and displays standard output, standard error,
 * and system execution notifications with copy and clear actions.
 */

import React from 'react';
import { Terminal, Copy, Trash2, CheckCircle2, AlertTriangle, CornerDownRight } from 'lucide-react';
import { usePythonRuntime } from './runtimeContext';

export const ConsolePanel: React.FC = () => {
  const { runResult, traceResult, isExecuting, lastError, clearOutput } = usePythonRuntime();

  const stdout = (traceResult?.stdout ?? runResult?.stdout) || '';
  const stderr = (traceResult?.stderr ?? runResult?.stderr) || '';

  const handleCopy = () => {
    const text = stdout + (stderr ? `\nErrors:\n${stderr}` : '');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)] font-mono text-xs">
      {/* Console Subheader */}
      <div className="px-3 py-1.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] flex items-center justify-between text-[11px] text-[var(--text-dim)] shrink-0">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          <span>STDOUT &amp; STDERR STREAM</span>
          {isExecuting && (
            <span className="flex items-center gap-1 text-sky-400 font-semibold animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> Running...
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {(stdout || stderr) && (
            <>
              <button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-[var(--border-subtle)] text-[var(--text-dim)] hover:text-[var(--text-main)]"
                title="Copy terminal output"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={clearOutput}
                className="p-1 rounded hover:bg-[var(--border-subtle)] text-[var(--text-dim)] hover:text-[var(--text-main)]"
                title="Clear console"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Output Stream Content with Live Region Announcement */}
      <div
        className="flex-1 p-3 overflow-y-auto space-y-2 select-text"
        role="region"
        aria-live="polite"
        aria-atomic="false"
        aria-label="Python Terminal Output Stream"
      >
        {/* Invisible live region for screen readers */}
        <div className="sr-only" aria-live="assertive" aria-atomic="true">
          {isExecuting
            ? 'Executing Python script...'
            : lastError
            ? `Execution failed: ${lastError.name}. ${lastError.friendlyExplanation}`
            : stdout
            ? `Python output: ${stdout}`
            : ''}
        </div>

        {!stdout && !stderr && !isExecuting && (
          <div className="text-[var(--text-dim)] italic py-4 text-center">
            Click "Run Code" or "Step" to execute and see standard output here.
          </div>
        )}

        {stdout && (
          <div className="text-[var(--text-main)] whitespace-pre-wrap leading-relaxed">
            {stdout}
          </div>
        )}

        {stderr && (
          <div className="p-2.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 whitespace-pre-wrap leading-relaxed">
            <div className="flex items-center gap-1.5 text-red-400 font-bold mb-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Traceback (most recent call last):</span>
            </div>
            {stderr}
          </div>
        )}

        {/* Friendly Error Translator Banner if error occurred */}
        {lastError && (
          <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span>Plain-Language Diagnosis: {lastError.name}</span>
              {lastError.line && <span>Line {lastError.line}</span>}
            </div>
            <p className="text-xs text-amber-100/90 leading-relaxed">
              {lastError.friendlyExplanation}
            </p>
            {lastError.fixSuggestions.length > 0 && (
              <div className="pt-1 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400">Suggestions to fix:</span>
                <ul className="list-disc pl-4 text-xs space-y-0.5 text-amber-200/80">
                  {lastError.fixSuggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
