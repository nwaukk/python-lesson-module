/**
 * Code Playground Frame
 * Free-form Python execution scratchpad with CodeMirror 6, Pyodide Web Worker,
 * Input Queue, templates, and execution telemetry.
 */

import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Terminal,
  Sparkles,
  Copy,
  Check,
  Activity,
  ListOrdered,
  Square,
} from 'lucide-react';
import { CodeMirrorEditor } from '../../engine/editor/CodeMirrorEditor';
import { usePythonRuntime } from '../../engine/runtime/runtimeContext';
import { ConsolePanel } from '../../engine/runtime/ConsolePanel';
import { VariablesPanel } from '../../engine/runtime/VariablesPanel';
import { TraceTimeline } from '../../engine/runtime/TraceTimeline';
import { RunInsightsPanel } from '../../engine/runtime/RunInsightsPanel';
import { InputQueuePanel } from '../../engine/runtime/InputQueuePanel';

const STARTER_SNIPPETS = [
  {
    name: 'Hello World & Variables',
    code: `# Basic Python Variables\nuser = "Learner"\nlevel = 1\nprint(f"Hello, {user}! Welcome to Level {level}.")`,
  },
  {
    name: 'Fibonacci Series',
    code: `# Generate Fibonacci numbers\na, b = 0, 1\nsequence = []\nfor _ in range(10):\n    sequence.append(a)\n    a, b = b, a + b\nprint("Fibonacci:", sequence)`,
  },
  {
    name: 'List Comprehension',
    code: `# Filter and square even numbers\nnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\neven_squares = [n**2 for n in numbers if n % 2 == 0]\nprint("Even squares:", even_squares)`,
  },
  {
    name: 'Interactive input() Demo',
    code: `# Reads from the Input Queue\nname = input("Enter your name: ")\nage = int(input("Enter your age: "))\nprint(f"Welcome, {name}! In 5 years you will be {age + 5}.")`,
  },
];

export const PlaygroundView: React.FC = () => {
  const [code, setCode] = useState(STARTER_SNIPPETS[0].code);
  const [activeTab, setActiveTab] = useState<'console' | 'variables' | 'trace' | 'insights' | 'inputs'>('console');
  const [copied, setCopied] = useState(false);

  const {
    runCode,
    traceCode,
    stopExecution,
    isExecuting,
    status,
    loadProgress,
    activeTraceStep,
    inputQueue,
    setInputQueue,
  } = usePythonRuntime();

  const handleRun = async () => {
    setActiveTab('console');
    await runCode(code);
  };

  const handleTrace = async () => {
    setActiveTab('trace');
    await traceCode(code);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectSnippet = (snippet: typeof STARTER_SNIPPETS[0]) => {
    setCode(snippet.code);
    if (snippet.name.includes('input()')) {
      setInputQueue(['Amara', '24']);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      {/* Playground Top Bar */}
      <div className="px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[var(--accent-primary)]" />
          <span className="font-bold text-xs text-[var(--text-main)]">Python Code Playground</span>
          <span className="badge-real-python px-2 py-0.5 rounded text-[10px] font-bold">
            REAL PYTHON
          </span>
          <span className="text-[11px] font-mono text-[var(--text-dim)] hidden sm:inline">
            {status === 'loading'
              ? `Loading Pyodide (${loadProgress}%)...`
              : status === 'ready'
              ? 'Pyodide 3.12 Ready'
              : status === 'running'
              ? 'Executing...'
              : 'Ready'}
          </span>
        </div>

        {/* Snippet Presets */}
        <div className="flex items-center gap-1.5 text-xs overflow-x-auto">
          <span className="text-[10px] text-[var(--text-dim)] font-medium">Templates:</span>
          {STARTER_SNIPPETS.map((snip) => (
            <button
              key={snip.name}
              onClick={() => handleSelectSnippet(snip)}
              className="px-2 py-0.5 rounded bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors whitespace-nowrap"
            >
              {snip.name}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] text-xs text-[var(--text-muted)] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={() => setCode('')}
            className="px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] text-xs text-[var(--text-muted)] transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleTrace}
            disabled={isExecuting}
            className="flex items-center gap-1 px-3 py-1 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] text-xs font-semibold text-[var(--text-main)] transition-colors disabled:opacity-50"
            title="Step-through trace with live variable inspector"
          >
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>Trace</span>
          </button>
          {isExecuting ? (
            <button
              onClick={stopExecution}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              onClick={handleRun}
              className="flex items-center gap-1.5 px-4 py-1 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] text-xs font-bold shadow-md transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Code</span>
            </button>
          )}
        </div>
      </div>

      {/* CodeMirror Editor & Results Split */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        <div className="flex-1 h-full min-h-[180px] border-b md:border-b-0 md:border-r border-[var(--border-subtle)] overflow-hidden">
          <CodeMirrorEditor
            value={code}
            onChange={setCode}
            highlightLine={activeTraceStep?.line}
          />
        </div>

        {/* Tabbed Results Pane */}
        <div className="w-full md:w-80 lg:w-96 flex flex-col bg-[var(--bg-app)] shrink-0">
          <div className="flex items-center border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-2 overflow-x-auto text-xs font-medium">
            {[
              { id: 'console', label: 'Console' },
              { id: 'variables', label: 'Variables' },
              { id: 'trace', label: 'Trace' },
              { id: 'insights', label: 'Insights' },
              { id: 'inputs', label: `Inputs (${inputQueue.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-2 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] font-semibold'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {activeTab === 'console' && <ConsolePanel />}
            {activeTab === 'variables' && <VariablesPanel />}
            {activeTab === 'trace' && <TraceTimeline />}
            {activeTab === 'insights' && <RunInsightsPanel />}
            {activeTab === 'inputs' && (
              <div className="p-3 overflow-y-auto">
                <InputQueuePanel />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
