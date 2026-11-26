/**
 * Code Playground Frame
 * Free-form Python execution scratchpad with CodeMirror 6, Pyodide Web Worker,
 * Input Queue, templates, and execution telemetry.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  Play,
  RotateCcw,
  Terminal,
  Copy,
  Check,
  Activity,
  Square,
  BookmarkPlus,
  Trash2,
  FolderOpen,
  Save,
} from 'lucide-react';
import { CodeMirrorEditor } from '../../engine/editor/CodeMirrorEditor';
import { usePythonRuntime } from '../../engine/runtime/runtimeContext';
import { ConsolePanel } from '../../engine/runtime/ConsolePanel';
import { VariablesPanel } from '../../engine/runtime/VariablesPanel';
import { TraceTimeline } from '../../engine/runtime/TraceTimeline';
import { RunInsightsPanel } from '../../engine/runtime/RunInsightsPanel';
import { InputQueuePanel } from '../../engine/runtime/InputQueuePanel';
import { storage } from '../../store/storageAdapter';
import { PersistedPlaygroundState, SavedCodeSnippet } from '../../store/backupManager';
import {
  openPythonFileDialog,
  savePythonFileDialog,
  subscribeDesktopMenuActions,
} from '../../platform/desktopBridge';

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

const DEFAULT_PLAYGROUND_STATE: PersistedPlaygroundState = {
  schemaVersion: 1,
  activeCode: STARTER_SNIPPETS[0].code,
  savedSnippets: [],
};

export const PlaygroundView: React.FC = () => {
  const [persistedState, setPersistedState] = useState<PersistedPlaygroundState>(() => {
    const raw = storage.getItem<PersistedPlaygroundState>('code_snippets', DEFAULT_PLAYGROUND_STATE);
    return {
      schemaVersion: 1,
      activeCode: typeof raw.activeCode === 'string' ? raw.activeCode : STARTER_SNIPPETS[0].code,
      activeFilePath: typeof raw.activeFilePath === 'string' ? raw.activeFilePath : undefined,
      activeFileName: typeof raw.activeFileName === 'string' ? raw.activeFileName : undefined,
      savedSnippets: Array.isArray(raw.savedSnippets) ? raw.savedSnippets : [],
    };
  });
  const [activeTab, setActiveTab] = useState<'console' | 'variables' | 'trace' | 'insights' | 'inputs'>('console');
  const [copied, setCopied] = useState(false);
  const [fileStatusMsg, setFileStatusMsg] = useState<string | null>(null);
  const [isSavingSnippet, setIsSavingSnippet] = useState(false);
  const [snippetTitle, setSnippetTitle] = useState('');

  const code = persistedState.activeCode;
  const savedSnippets = persistedState.savedSnippets;

  const setCode = (nextCode: string) => {
    setPersistedState((prev) => ({ ...prev, activeCode: nextCode }));
  };

  useEffect(() => {
    return storage.subscribeHydration(() => {
      const hydrated = storage.getItem<PersistedPlaygroundState>('code_snippets', DEFAULT_PLAYGROUND_STATE);
      setPersistedState({
        schemaVersion: 1,
        activeCode: typeof hydrated.activeCode === 'string' ? hydrated.activeCode : STARTER_SNIPPETS[0].code,
        activeFilePath: typeof hydrated.activeFilePath === 'string' ? hydrated.activeFilePath : undefined,
        activeFileName: typeof hydrated.activeFileName === 'string' ? hydrated.activeFileName : undefined,
        savedSnippets: Array.isArray(hydrated.savedSnippets) ? hydrated.savedSnippets : [],
      });
    });
  }, []);

  useEffect(() => {
    storage.setItem('code_snippets', persistedState);
  }, [persistedState]);

  const {
    runCode,
    traceCode,
    stopExecution,
    resetRuntime,
    ensureEngineReady,
    isExecuting,
    status,
    loadProgress,
    statusMessage,
    isEngineCached,
    activeTraceStep,
    inputQueue,
    setInputQueue,
    pendingInputPrompt,
    persistVariables,
    setPersistVariables,
    pythonEngine,
    nativePythonInfo,
  } = usePythonRuntime();

  useEffect(() => {
    void ensureEngineReady();
  }, [ensureEngineReady]);

  useEffect(() => {
    if (pendingInputPrompt !== null) {
      setActiveTab('console');
    }
  }, [pendingInputPrompt]);

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

  const handleOpenPy = useCallback(async () => {
    try {
      const res = await openPythonFileDialog();
      if (!res.canceled && typeof res.content === 'string') {
        const openedCode = res.content;
        setPersistedState((prev) => ({
          ...prev,
          activeCode: openedCode,
          activeFilePath: res.filePath,
          activeFileName: res.fileName,
        }));
        setFileStatusMsg(`Opened ${res.fileName || 'file.py'}`);
        setTimeout(() => setFileStatusMsg(null), 2500);
      }
    } catch (err: any) {
      setFileStatusMsg(err?.message || 'Could not open file');
      setTimeout(() => setFileStatusMsg(null), 3000);
    }
  }, []);

  const handleSavePy = useCallback(
    async (saveAs = false) => {
      try {
        const res = await savePythonFileDialog({
          content: code,
          filePath: persistedState.activeFilePath,
          defaultName: persistedState.activeFileName || 'playground_script.py',
          saveAs,
        });
        if (!res.canceled) {
          setPersistedState((prev) => ({
            ...prev,
            activeFilePath: res.filePath || prev.activeFilePath,
            activeFileName: res.fileName || prev.activeFileName,
          }));
          setFileStatusMsg(`Saved ${res.fileName || 'script.py'}`);
          setTimeout(() => setFileStatusMsg(null), 2500);
        }
      } catch (err: any) {
        setFileStatusMsg(err?.message || 'Could not save file');
        setTimeout(() => setFileStatusMsg(null), 3000);
      }
    },
    [code, persistedState.activeFilePath, persistedState.activeFileName]
  );

  useEffect(() => {
    return subscribeDesktopMenuActions((event) => {
      if (event.action === 'save-py') {
        void handleSavePy(Boolean(event.payload?.saveAs));
      }
    });
  }, [handleSavePy]);

  const handleSelectSnippet = (snippet: { name: string; code: string }) => {
    setCode(snippet.code);
    if (snippet.name.includes('input()')) {
      setInputQueue(['Amara', '24']);
    }
  };

  const handleSaveSnippet = () => {
    const trimmed = snippetTitle.trim();
    if (!trimmed) return;
    const now = new Date().toISOString();
    const newEntry: SavedCodeSnippet = {
      id: `snip-${Date.now()}`,
      name: trimmed,
      code,
      updatedAt: now,
    };
    setPersistedState((prev) => ({
      ...prev,
      savedSnippets: [newEntry, ...prev.savedSnippets.filter((s) => s.name !== trimmed)].slice(0, 25),
    }));
    setSnippetTitle('');
    setIsSavingSnippet(false);
  };

  const handleDeleteSavedSnippet = (id: string) => {
    setPersistedState((prev) => ({
      ...prev,
      savedSnippets: prev.savedSnippets.filter((s) => s.id !== id),
    }));
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
          {persistedState.activeFileName && (
            <span
              className="px-2 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-app)] font-mono text-[11px] text-[var(--text-muted)] truncate max-w-[160px]"
              title={persistedState.activeFilePath || persistedState.activeFileName}
            >
              {persistedState.activeFileName}
            </span>
          )}
          {fileStatusMsg && (
            <span className="text-[11px] font-medium text-emerald-400">
              {fileStatusMsg}
            </span>
          )}
          <span className="text-[11px] font-mono text-[var(--text-dim)] hidden sm:inline tabular-nums">
            {status === 'loading'
              ? `${statusMessage || 'Preparing Python engine...'} (${loadProgress}%)`
              : status === 'ready'
              ? pythonEngine === 'native'
                ? `Native Python ${nativePythonInfo?.version || '3'} Ready`
                : isEngineCached
                ? 'Pyodide 3.12 Offline (Cached)'
                : 'Pyodide 3.12 Offline Ready'
              : status === 'running'
              ? 'Executing...'
              : 'Offline Engine Standby'}
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
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setPersistVariables(!persistVariables)}
            className={`px-2 py-1 rounded-lg border text-[11px] font-medium transition-colors whitespace-nowrap ${
              persistVariables
                ? 'border-[var(--accent-primary)]/40 bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                : 'border-[var(--border-subtle)] text-[var(--text-dim)]'
            }`}
            title="Keep Python variables alive between consecutive runs"
          >
            {persistVariables ? 'Vars: Shared' : 'Vars: Isolated'}
          </button>
          <button
            type="button"
            onClick={() => void resetRuntime()}
            disabled={isExecuting}
            className="flex items-center gap-1 px-2 py-1 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] text-xs text-[var(--text-muted)] transition-colors disabled:opacity-40 whitespace-nowrap"
            title="Reset Python runtime and clear variables"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Engine</span>
          </button>
          <button
            type="button"
            onClick={() => void handleOpenPy()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] text-xs text-[var(--text-muted)] transition-colors whitespace-nowrap"
            title="Open local .py script (Ctrl+O)"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Open .py</span>
          </button>
          <button
            type="button"
            onClick={() => void handleSavePy(false)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] text-xs text-[var(--text-muted)] transition-colors whitespace-nowrap"
            title="Save as .py script (Ctrl+S)"
          >
            <Save className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Save .py</span>
          </button>
          <button
            onClick={() => setIsSavingSnippet((v) => !v)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] text-xs text-[var(--text-muted)] transition-colors whitespace-nowrap"
            title="Save current code snippet locally"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Save Snippet</span>
          </button>
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

      {/* Inline Save Snippet Bar / Saved Snippets Library */}
      {(isSavingSnippet || savedSnippets.length > 0) && (
        <div className="px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          {isSavingSnippet && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={snippetTitle}
                onChange={(e) => setSnippetTitle(e.target.value)}
                placeholder="Snippet title (e.g. Prime Finder)"
                className="px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-dim)]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveSnippet();
                  if (e.key === 'Escape') setIsSavingSnippet(false);
                }}
              />
              <button
                onClick={handleSaveSnippet}
                disabled={!snippetTitle.trim()}
                className="px-3 py-1 rounded-lg bg-[var(--accent-primary)] text-[var(--accent-on)] font-semibold text-xs disabled:opacity-50"
              >
                Save Locally
              </button>
              <button
                onClick={() => setIsSavingSnippet(false)}
                className="px-2 py-1 text-xs text-[var(--text-dim)] hover:text-[var(--text-main)]"
              >
                Cancel
              </button>
            </div>
          )}
          {savedSnippets.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[11px] text-[var(--text-dim)] font-medium whitespace-nowrap">
                Saved ({savedSnippets.length}):
              </span>
              {savedSnippets.map((snip) => (
                <div
                  key={snip.id}
                  className="inline-flex items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] overflow-hidden shrink-0"
                >
                  <button
                    onClick={() => handleSelectSnippet(snip)}
                    className="px-2.5 py-1 text-[11px] font-medium text-[var(--text-main)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent-primary)] transition-colors whitespace-nowrap"
                    title={`Load "${snip.name}"`}
                  >
                    {snip.name}
                  </button>
                  <button
                    onClick={() => handleDeleteSavedSnippet(snip.id)}
                    className="px-1.5 py-1 text-[var(--text-dim)] hover:text-red-400 border-l border-[var(--border-subtle)]"
                    title={`Delete "${snip.name}"`}
                    aria-label={`Delete snippet ${snip.name}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
