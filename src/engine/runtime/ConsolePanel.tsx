/**
 * Console Panel
 * Section 8.2: Live stdout/stderr streaming, interactive input() prompt,
 * Python loading indicator ("Preparing Python engine..."), offline module notices,
 * readable line-numbered tracebacks, run timeout setting, and runtime reset.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Terminal,
  Copy,
  Trash2,
  AlertTriangle,
  RotateCcw,
  CornerDownLeft,
  Info,
  Clock,
  Loader2,
} from 'lucide-react';
import { usePythonRuntime } from './runtimeContext';

const TIMEOUT_OPTIONS = [
  { label: '3s', ms: 3000 },
  { label: '5s', ms: 5000 },
  { label: '10s', ms: 10000 },
  { label: '20s', ms: 20000 },
  { label: '30s', ms: 30000 },
];

export const ConsolePanel: React.FC = () => {
  const {
    runResult,
    traceResult,
    isExecuting,
    status,
    loadProgress,
    statusMessage,
    streamChunks,
    offlineNotice,
    pendingInputPrompt,
    submitInteractiveInput,
    cancelInteractiveInput,
    timeLimitMs,
    setTimeLimitMs,
    resetRuntime,
    lastError,
    clearOutput,
    pythonEngine,
    nativePythonInfo,
    engineFallbackNotice,
    clearEngineFallbackNotice,
  } = usePythonRuntime();

  const [interactiveVal, setInteractiveVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const streamedStdout = streamChunks
    .filter((c) => c.type === 'stdout')
    .map((c) => c.text)
    .join('');

  const systemMessages = streamChunks
    .filter((c) => c.type === 'system')
    .map((c) => c.text);

  const stdout = streamedStdout || traceResult?.stdout || runResult?.stdout || '';
  const stderr = traceResult?.stderr || runResult?.stderr || '';
  const activeOfflineNotice = offlineNotice || systemMessages.find((m) => m.startsWith('Not available in offline mode')) || null;
  const infoMessages = systemMessages.filter((m) => !m.startsWith('Not available in offline mode'));

  useEffect(() => {
    if (pendingInputPrompt !== null) {
      setInteractiveVal('');
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [pendingInputPrompt]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [stdout, stderr, pendingInputPrompt, activeOfflineNotice]);

  const handleCopy = () => {
    const text = stdout + (stderr ? `\nErrors:\n${stderr}` : '');
    navigator.clipboard.writeText(text);
  };

  const handleSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    submitInteractiveInput(interactiveVal);
    setInteractiveVal('');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)] font-mono text-xs">
      {/* Console Subheader with Timeout Control & Reset Runtime */}
      <div className="px-3 py-1.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--text-dim)] shrink-0">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          <span>Console Output</span>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
              pythonEngine === 'native'
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-dim)]'
            }`}
          >
            {pythonEngine === 'native'
              ? `Native Python ${nativePythonInfo?.version || '3'}`
              : 'Built-in Pyodide'}
          </span>
          {isExecuting && (
            <span className="flex items-center gap-1 text-sky-400 font-semibold">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>{pendingInputPrompt !== null ? 'Waiting for input()' : 'Running'}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Run Timeout Selector */}
          <label className="inline-flex items-center gap-1 text-[10px] text-[var(--text-dim)]" title="Execution timeout limit">
            <Clock className="w-3 h-3" />
            <select
              aria-label="Run timeout seconds"
              value={timeLimitMs}
              onChange={(e) => setTimeLimitMs(Number(e.target.value))}
              className="bg-[var(--bg-app)] border border-[var(--border-subtle)] rounded px-1.5 py-0.5 text-[10px] text-[var(--text-main)] tabular-nums"
            >
              {TIMEOUT_OPTIONS.map((opt) => (
                <option key={opt.ms} value={opt.ms}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          {/* Reset Runtime */}
          <button
            type="button"
            onClick={() => void resetRuntime()}
            disabled={isExecuting}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-[var(--border-subtle)] text-[var(--text-dim)] hover:text-[var(--text-main)] disabled:opacity-40 text-[10px]"
            title="Reset Python interpreter & clear variables"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Engine</span>
          </button>

          {(stdout || stderr || systemMessages.length > 0) && (
            <>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 rounded hover:bg-[var(--border-subtle)] text-[var(--text-dim)] hover:text-[var(--text-main)]"
                title="Copy terminal output"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
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

      {/* First-Launch / Engine Loading Indicator */}
      {status === 'loading' && (
        <div className="px-3 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-1.5 shrink-0">
          <div className="flex items-center justify-between text-[11px] font-sans">
            <span className="flex items-center gap-1.5 font-medium text-[var(--accent-primary)]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{statusMessage || 'Preparing Python engine...'}</span>
            </span>
            <span className="font-mono text-[10px] text-[var(--text-dim)] tabular-nums">
              {loadProgress}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--bg-app)] overflow-hidden">
            <div
              className="h-full bg-[var(--accent-primary)] transition-all duration-300"
              style={{ width: `${Math.max(8, loadProgress)}%` }}
            />
          </div>
        </div>
      )}

      {/* Output Stream Content with Live Region Announcement */}
      <div
        className="flex-1 p-3 overflow-y-auto space-y-2.5 select-text"
        role="region"
        aria-live="polite"
        aria-atomic="false"
        aria-label="Python Terminal Output Stream"
      >
        <div className="sr-only" aria-live="assertive" aria-atomic="true">
          {isExecuting
            ? 'Executing Python script...'
            : lastError
            ? `Execution failed: ${lastError.name}. ${lastError.friendlyExplanation}`
            : stdout
            ? `Python output: ${stdout}`
            : ''}
        </div>

        {!stdout && !stderr && !isExecuting && infoMessages.length === 0 && !activeOfflineNotice && pendingInputPrompt === null && (
          <div className="text-[var(--text-dim)] italic py-4 text-center font-sans">
            Click "Run Code" or "Step" to execute Python offline and stream output here.
          </div>
        )}

        {/* Native Python Unavailable Fallback Notice */}
        {engineFallbackNotice && (
          <div
            role="note"
            className="p-2.5 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-200 font-sans text-xs flex items-start justify-between gap-2"
          >
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 leading-relaxed">
                <div className="font-semibold text-sky-300">Using Built-in Python Engine</div>
                <div>{engineFallbackNotice}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={clearEngineFallbackNotice}
              className="text-[11px] text-sky-300 hover:underline shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Offline Module Educational Explanation */}
        {activeOfflineNotice && (
          <div
            role="note"
            className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 font-sans text-xs flex items-start gap-2"
          >
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 leading-relaxed">
              <div className="font-semibold text-amber-300">Offline Simulated Mode</div>
              <div>{activeOfflineNotice}</div>
            </div>
          </div>
        )}

        {/* Informational system notices (e.g. engine reset) */}
        {infoMessages.map((msg, idx) => (
          <div
            key={idx}
            className="px-2.5 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[11px] text-[var(--text-muted)] font-sans"
          >
            {msg}
          </div>
        ))}

        {/* Live Standard Output */}
        {stdout && (
          <pre className="text-[var(--text-main)] whitespace-pre-wrap leading-relaxed font-mono m-0">
            {stdout}
          </pre>
        )}

        {/* Interactive Console input() Prompt */}
        {pendingInputPrompt !== null && (
          <form
            onSubmit={handleSubmitPrompt}
            className="p-2.5 rounded-lg border border-[var(--accent-primary)]/50 bg-[var(--bg-surface)] space-y-2"
          >
            <div className="flex items-center justify-between text-[11px] font-sans">
              <span className="font-semibold text-[var(--accent-primary)]">
                input() Prompt: {pendingInputPrompt}
              </span>
              <button
                type="button"
                onClick={cancelInteractiveInput}
                className="text-[11px] text-[var(--text-dim)] hover:text-red-400"
              >
                Cancel
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                ref={inputRef}
                type="text"
                value={interactiveVal}
                onChange={(e) => setInteractiveVal(e.target.value)}
                placeholder="Type response and press Enter..."
                className="flex-1 px-2.5 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-app)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] text-xs font-semibold"
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </form>
        )}

        {/* Readable Line-Numbered Traceback */}
        {stderr && (
          <div className="p-2.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 whitespace-pre-wrap leading-relaxed">
            <div className="flex items-center justify-between text-red-400 font-bold mb-1">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Traceback {lastError?.line ? `(Line ${lastError.line})` : ''}</span>
              </span>
              {lastError?.name && <span className="text-[10px] font-mono">{lastError.name}</span>}
            </div>
            {stderr}
          </div>
        )}

        {/* Friendly Error Translator Banner */}
        {lastError && (
          <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 space-y-2 font-sans">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span>Plain-Language Diagnosis: {lastError.name}</span>
              {lastError.line && <span className="font-mono tabular-nums">Line {lastError.line}</span>}
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

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
