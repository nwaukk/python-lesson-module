/**
 * Runtime Execution Context & Hook
 * Section 8: Manages offline Pyodide worker runtime, live streaming stdout/stderr,
 * interactive input() prompt, trace stepping, run timeout, persistent cell variables,
 * and plain-language error diagnosis.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  PythonRuntime,
  RuntimeStatus,
  ExecutionMode,
  RunOptions,
  TraceOptions,
  RunResult,
  TraceResult,
  TraceStep,
  ParsedPythonError,
  OutputChunk,
} from './types';
import { pyodideWorker } from './PyodideWorkerRuntime';
import { nativePythonRuntime } from './NativePythonRuntime';
import { traceReplay } from './TraceReplayRuntime';
import { simulationRuntime } from './SimulationRuntime';
import { storage } from '../../store/storageAdapter';
import { NativePythonDetectionResult } from '../../platform/desktopBridge';

export type PythonEngineChoice = 'pyodide' | 'native';

interface PersistedRuntimeSettings {
  schemaVersion: 1;
  timeLimitMs: number;
  persistVariables: boolean;
  pythonEngine: PythonEngineChoice;
}

const DEFAULT_RUNTIME_SETTINGS: PersistedRuntimeSettings = {
  schemaVersion: 1,
  timeLimitMs: 5000,
  persistVariables: true,
  pythonEngine: 'pyodide',
};

interface PendingInputContinuation {
  kind: 'run' | 'trace';
  code: string;
  options?: RunOptions | TraceOptions;
  collectedInputs: string[];
  resolve: (result: any) => void;
}

interface RuntimeContextValue {
  activeRuntime: PythonRuntime;
  runtimeMode: ExecutionMode;
  setRuntimeMode: (mode: ExecutionMode) => void;
  pythonEngine: PythonEngineChoice;
  setPythonEngine: (choice: PythonEngineChoice) => Promise<{ switched: boolean; message?: string }>;
  nativePythonInfo: NativePythonDetectionResult | null;
  isCheckingNativePython: boolean;
  engineFallbackNotice: string | null;
  clearEngineFallbackNotice: () => void;
  refreshNativePythonDetection: () => Promise<NativePythonDetectionResult>;
  status: RuntimeStatus;
  loadProgress: number;
  statusMessage: string;
  isEngineCached: boolean;
  ensureEngineReady: () => Promise<void>;
  timeLimitMs: number;
  setTimeLimitMs: (ms: number) => void;
  persistVariables: boolean;
  setPersistVariables: (persist: boolean) => void;
  // Input Queue & Interactive Console Prompt
  inputQueue: string[];
  addInput: (val: string) => void;
  removeInput: (idx: number) => void;
  clearInputQueue: () => void;
  setInputQueue: (items: string[]) => void;
  pendingInputPrompt: string | null;
  submitInteractiveInput: (val: string) => void;
  cancelInteractiveInput: () => void;
  // Live Stream & Execution
  isExecuting: boolean;
  streamChunks: OutputChunk[];
  offlineNotice: string | null;
  runResult: RunResult | null;
  traceResult: TraceResult | null;
  activeTraceStep: TraceStep | null;
  activeTraceIndex: number;
  runCode: (code: string, options?: RunOptions) => Promise<RunResult>;
  traceCode: (code: string, options?: TraceOptions) => Promise<TraceResult>;
  stopExecution: () => void;
  resetRuntime: () => Promise<void>;
  // Stepper controls
  stepNext: () => void;
  stepPrev: () => void;
  jumpToStep: (idx: number) => void;
  isTracePlaying: boolean;
  toggleTracePlay: () => void;
  traceSpeed: number; // 0.5x, 1.0x, 2.0x
  setTraceSpeed: (speed: number) => void;
  lastError: ParsedPythonError | null;
  clearOutput: () => void;
}

const RuntimeContext = createContext<RuntimeContextValue | undefined>(undefined);

export const RuntimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [runtimeSettings, setRuntimeSettings] = useState<PersistedRuntimeSettings>(() => {
    const saved = storage.getItem<PersistedRuntimeSettings>('runtime_settings', DEFAULT_RUNTIME_SETTINGS);
    return {
      schemaVersion: 1,
      timeLimitMs:
        typeof saved.timeLimitMs === 'number' && saved.timeLimitMs >= 1000 && saved.timeLimitMs <= 60000
          ? saved.timeLimitMs
          : 5000,
      persistVariables: typeof saved.persistVariables === 'boolean' ? saved.persistVariables : true,
      pythonEngine: saved.pythonEngine === 'native' ? 'native' : 'pyodide',
    };
  });

  const [runtimeMode, setRuntimeMode] = useState<ExecutionMode>('real');
  const [status, setStatus] = useState<RuntimeStatus>('not-loaded');
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('Preparing Python engine...');
  const [isEngineCached, setIsEngineCached] = useState<boolean>(false);

  const [nativePythonInfo, setNativePythonInfo] = useState<NativePythonDetectionResult | null>(null);
  const [isCheckingNativePython, setIsCheckingNativePython] = useState<boolean>(false);
  const [engineFallbackNotice, setEngineFallbackNotice] = useState<string | null>(null);

  const [inputQueue, setInputQueue] = useState<string[]>([]);
  const [pendingInputPrompt, setPendingInputPrompt] = useState<string | null>(null);

  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [streamChunks, setStreamChunks] = useState<OutputChunk[]>([]);
  const [offlineNotice, setOfflineNotice] = useState<string | null>(null);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [traceResult, setTraceResult] = useState<TraceResult | null>(null);
  const [activeTraceIndex, setActiveTraceIndex] = useState<number>(0);
  const [isTracePlaying, setIsTracePlaying] = useState<boolean>(false);
  const [traceSpeed, setTraceSpeed] = useState<number>(1.0);
  const [lastError, setLastError] = useState<ParsedPythonError | null>(null);

  const continuationRef = useRef<PendingInputContinuation | null>(null);
  const isWaitingSabInputRef = useRef<boolean>(false);

  const timeLimitMs = runtimeSettings.timeLimitMs;
  const persistVariables = runtimeSettings.persistVariables;
  const pythonEngine = runtimeSettings.pythonEngine;

  const setTimeLimitMs = useCallback((ms: number) => {
    setRuntimeSettings((prev) => ({
      ...prev,
      timeLimitMs: Math.max(1000, Math.min(60000, ms)),
    }));
  }, []);

  const setPersistVariables = useCallback((persist: boolean) => {
    setRuntimeSettings((prev) => ({
      ...prev,
      persistVariables: persist,
    }));
  }, []);

  const refreshNativePythonDetection = useCallback(async () => {
    setIsCheckingNativePython(true);
    try {
      const info = await nativePythonRuntime.detect();
      setNativePythonInfo(info);
      return info;
    } finally {
      setIsCheckingNativePython(false);
    }
  }, []);

  const setPythonEngine = useCallback(
    async (choice: PythonEngineChoice): Promise<{ switched: boolean; message?: string }> => {
      if (choice === 'pyodide') {
        setRuntimeSettings((prev) => ({ ...prev, pythonEngine: 'pyodide' }));
        setEngineFallbackNotice(null);
        return { switched: true, message: 'Using Built-in offline Pyodide engine.' };
      }

      const info = await refreshNativePythonDetection();
      if (!info.found) {
        setRuntimeSettings((prev) => ({ ...prev, pythonEngine: 'pyodide' }));
        setEngineFallbackNotice(info.message);
        return { switched: false, message: info.message };
      }

      setRuntimeSettings((prev) => ({ ...prev, pythonEngine: 'native' }));
      setEngineFallbackNotice(null);
      return { switched: true, message: info.message };
    },
    [refreshNativePythonDetection]
  );

  const clearEngineFallbackNotice = useCallback(() => {
    setEngineFallbackNotice(null);
  }, []);

  // Safeguard: if persisted preference was 'native' on a machine/browser without Python, stay safely on Pyodide
  useEffect(() => {
    if (pythonEngine !== 'native') return;
    let cancelled = false;
    void refreshNativePythonDetection().then((info) => {
      if (!cancelled && !info.found) {
        setRuntimeSettings((prev) => ({ ...prev, pythonEngine: 'pyodide' }));
        setEngineFallbackNotice(info.message);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [pythonEngine, refreshNativePythonDetection]);

  useEffect(() => {
    storage.setItem('runtime_settings', runtimeSettings);
  }, [runtimeSettings]);

  useEffect(() => {
    return storage.subscribeHydration(() => {
      const hydrated = storage.getItem<PersistedRuntimeSettings>('runtime_settings', DEFAULT_RUNTIME_SETTINGS);
      setRuntimeSettings({
        schemaVersion: 1,
        timeLimitMs: typeof hydrated.timeLimitMs === 'number' ? hydrated.timeLimitMs : 5000,
        persistVariables: typeof hydrated.persistVariables === 'boolean' ? hydrated.persistVariables : true,
        pythonEngine: hydrated.pythonEngine === 'native' ? 'native' : 'pyodide',
      });
    });
  }, []);

  const activeRuntime = useMemo(() => {
    if (runtimeMode === 'trace') return traceReplay;
    if (runtimeMode === 'simulation') return simulationRuntime;
    if (pythonEngine === 'native') return nativePythonRuntime;
    return pyodideWorker;
  }, [runtimeMode, pythonEngine]);

  // Subscribe to runtime status, live output streaming, and SAB input() prompts
  useEffect(() => {
    const unsubStatus = activeRuntime.onStatusChange((s, p, msg, cached) => {
      setStatus(s);
      setLoadProgress(p);
      if (msg) setStatusMessage(msg);
      if (typeof cached === 'boolean') setIsEngineCached(cached);
    });

    const unsubOutput = activeRuntime.onOutput((chunk) => {
      setStreamChunks((prev) => [...prev, chunk]);
      if (chunk.type === 'system' && chunk.text.startsWith('Not available in offline mode')) {
        setOfflineNotice(chunk.text);
      }
    });

    const unsubInput =
      'onInputRequest' in activeRuntime && activeRuntime.onInputRequest
        ? activeRuntime.onInputRequest((prompt: string) => {
            isWaitingSabInputRef.current = true;
            setPendingInputPrompt(prompt || 'Enter input:');
          })
        : () => {};

    return () => {
      unsubStatus();
      unsubOutput();
      unsubInput();
    };
  }, [activeRuntime]);

  const ensureEngineReady = useCallback(async () => {
    try {
      await activeRuntime.init();
    } catch (err) {
      console.warn('Lazy Python engine init deferred/fallback active:', err);
    }
  }, [activeRuntime]);

  const addInput = useCallback((val: string) => {
    if (!val.trim()) return;
    setInputQueue((prev) => [...prev, val]);
  }, []);

  const removeInput = useCallback((idx: number) => {
    setInputQueue((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const clearInputQueue = useCallback(() => {
    setInputQueue([]);
  }, []);

  const clearOutput = useCallback(() => {
    setRunResult(null);
    setTraceResult(null);
    setStreamChunks([]);
    setOfflineNotice(null);
    setLastError(null);
    setActiveTraceIndex(0);
    setPendingInputPrompt(null);
  }, []);

  const executeRunInternal = useCallback(
    async (code: string, options?: RunOptions, accumulatedInputs?: string[]): Promise<RunResult> => {
      const effectiveInputs = accumulatedInputs ?? [...(options?.inputQueue ?? inputQueue)];
      const res = await activeRuntime.run(code, {
        ...options,
        timeLimitMs: options?.timeLimitMs ?? timeLimitMs,
        inputQueue: effectiveInputs,
        persistentNamespace: options?.persistentNamespace ?? persistVariables,
      });

      // Handle non-isolated interactive input() request by opening inline prompt in console
      if (res.needsInputPrompt !== null && res.needsInputPrompt !== undefined && !options?.isolated) {
        setPendingInputPrompt(res.needsInputPrompt || 'Enter input:');
        return new Promise<RunResult>((resolve) => {
          continuationRef.current = {
            kind: 'run',
            code,
            options,
            collectedInputs: effectiveInputs,
            resolve,
          };
        });
      }

      return res;
    },
    [activeRuntime, inputQueue, timeLimitMs, persistVariables]
  );

  const executeTraceInternal = useCallback(
    async (code: string, options?: TraceOptions, accumulatedInputs?: string[]): Promise<TraceResult> => {
      const effectiveInputs = accumulatedInputs ?? [...(options?.inputQueue ?? inputQueue)];
      const res = await activeRuntime.trace(code, {
        ...options,
        timeLimitMs: options?.timeLimitMs ?? timeLimitMs + 2000,
        inputQueue: effectiveInputs,
        maxSteps: options?.maxSteps ?? 300,
        persistentNamespace: options?.persistentNamespace ?? persistVariables,
      });

      if (res.needsInputPrompt !== null && res.needsInputPrompt !== undefined && !options?.isolated) {
        setPendingInputPrompt(res.needsInputPrompt || 'Enter input:');
        return new Promise<TraceResult>((resolve) => {
          continuationRef.current = {
            kind: 'trace',
            code,
            options,
            collectedInputs: effectiveInputs,
            resolve,
          };
        });
      }

      return res;
    },
    [activeRuntime, inputQueue, timeLimitMs, persistVariables]
  );

  const runCode = useCallback(
    async (code: string, options?: RunOptions): Promise<RunResult> => {
      const isInteractive = !options?.isolated;
      if (isInteractive) {
        setIsExecuting(true);
        setLastError(null);
        setStreamChunks([]);
        setOfflineNotice(null);
        setPendingInputPrompt(null);
        continuationRef.current = null;
      }

      try {
        let res: RunResult;
        try {
          res = await executeRunInternal(code, options);
        } catch (err: any) {
          if (pythonEngine === 'native') {
            console.warn('Native Python unavailable, falling back to Built-in Pyodide:', err);
            const fallbackMsg = String(err?.message || 'Native Python unavailable; using Built-in Pyodide engine.');
            setRuntimeSettings((prev) => ({ ...prev, pythonEngine: 'pyodide' }));
            setEngineFallbackNotice(fallbackMsg);
            res = await pyodideWorker.run(code, {
              ...options,
              timeLimitMs: options?.timeLimitMs ?? timeLimitMs,
              inputQueue: [...(options?.inputQueue ?? inputQueue)],
              persistentNamespace: options?.persistentNamespace ?? persistVariables,
            });
          } else if (runtimeMode === 'real') {
            console.warn('Pyodide execution issue, switching cleanly to TraceReplay:', err);
            res = await traceReplay.run(code, {
              timeLimitMs,
              inputQueue: [...(options?.inputQueue ?? inputQueue)],
            });
          } else {
            throw err;
          }
        }

        if (isInteractive) {
          setRunResult(res);
          if (res.offlineNotice) setOfflineNotice(res.offlineNotice);
          if (res.error) setLastError(res.error);
          setIsExecuting(false);
        }
        return res;
      } catch (e: any) {
        const fallbackResult: RunResult = {
          stdout: '',
          stderr: String(e?.message || e),
          exitCode: 1,
          durationMs: 0,
          memoryObjectsCreated: 0,
          bytecodeSteps: 0,
        };
        if (isInteractive) {
          setRunResult(fallbackResult);
          setIsExecuting(false);
        }
        return fallbackResult;
      }
    },
    [executeRunInternal, runtimeMode, pythonEngine, timeLimitMs, inputQueue, persistVariables]
  );

  const traceCode = useCallback(
    async (code: string, options?: TraceOptions): Promise<TraceResult> => {
      setIsExecuting(true);
      setLastError(null);
      setStreamChunks([]);
      setOfflineNotice(null);
      setPendingInputPrompt(null);
      continuationRef.current = null;

      try {
        let res: TraceResult;
        try {
          res = await executeTraceInternal(code, options);
        } catch (err: any) {
          if (pythonEngine === 'native') {
            setRuntimeSettings((prev) => ({ ...prev, pythonEngine: 'pyodide' }));
            setEngineFallbackNotice(String(err?.message || 'Native Python unavailable; using Built-in Pyodide engine.'));
            res = await pyodideWorker.trace(code, {
              ...options,
              timeLimitMs: options?.timeLimitMs ?? timeLimitMs + 2000,
              inputQueue: [...inputQueue],
              maxSteps: options?.maxSteps ?? 300,
            });
          } else {
            res = await traceReplay.trace(code, { timeLimitMs, inputQueue: [...inputQueue] });
          }
        }

        setTraceResult(res);
        setActiveTraceIndex(0);
        if (res.offlineNotice) setOfflineNotice(res.offlineNotice);
        if (res.error) setLastError(res.error);
        setIsExecuting(false);
        return res;
      } catch (e: any) {
        setIsExecuting(false);
        const emptyTrace: TraceResult = {
          steps: [],
          totalSteps: 0,
          truncated: false,
          stdout: '',
          stderr: String(e?.message || e),
          durationMs: 0,
        };
        setTraceResult(emptyTrace);
        return emptyTrace;
      }
    },
    [executeTraceInternal, timeLimitMs, inputQueue]
  );

  const submitInteractiveInput = useCallback(
    (val: string) => {
      setPendingInputPrompt(null);

      // 1. Synchronous SAB blocking path: wake worker directly mid-execution
      if (isWaitingSabInputRef.current && 'submitInput' in activeRuntime && activeRuntime.submitInput) {
        isWaitingSabInputRef.current = false;
        setStreamChunks((prev) => [
          ...prev,
          { type: 'stdout', text: `${val}\n`, timestamp: Date.now() },
        ]);
        activeRuntime.submitInput(val);
        return;
      }

      // 2. Non-isolated resumption path: append answer and continue execution
      const pending = continuationRef.current;
      if (pending) {
        continuationRef.current = null;
        const nextInputs = [...pending.collectedInputs, val];
        setStreamChunks([]);
        if (pending.kind === 'run') {
          void executeRunInternal(pending.code, pending.options as RunOptions, nextInputs).then(pending.resolve);
        } else {
          void executeTraceInternal(pending.code, pending.options as TraceOptions, nextInputs).then(pending.resolve);
        }
      }
    },
    [activeRuntime, executeRunInternal, executeTraceInternal]
  );

  const cancelInteractiveInput = useCallback(() => {
    setPendingInputPrompt(null);
    if (isWaitingSabInputRef.current) {
      isWaitingSabInputRef.current = false;
      activeRuntime.stop();
      setIsExecuting(false);
    }
    const pending = continuationRef.current;
    if (pending) {
      continuationRef.current = null;
      const cancelledErr: ParsedPythonError = {
        name: 'EOFError',
        message: 'Input prompt cancelled by user.',
        traceback: 'EOFError: Input prompt cancelled by user.',
        friendlyExplanation: 'You cancelled the interactive input() prompt before supplying a value.',
        fixSuggestions: ['Click Run Code again or stage inputs in the Inputs tab.'],
      };
      if (pending.kind === 'run') {
        pending.resolve({
          stdout: '',
          stderr: 'EOFError: Input prompt cancelled by user.',
          exitCode: 1,
          durationMs: 0,
          memoryObjectsCreated: 0,
          bytecodeSteps: 0,
          error: cancelledErr,
        });
      } else {
        pending.resolve({
          steps: [],
          totalSteps: 0,
          truncated: false,
          stdout: '',
          stderr: 'EOFError: Input prompt cancelled by user.',
          durationMs: 0,
          error: cancelledErr,
        });
      }
      setIsExecuting(false);
    }
  }, [activeRuntime]);

  const stopExecution = useCallback(() => {
    isWaitingSabInputRef.current = false;
    setPendingInputPrompt(null);
    if (continuationRef.current) {
      cancelInteractiveInput();
    } else {
      activeRuntime.stop();
      setIsExecuting(false);
    }
  }, [activeRuntime, cancelInteractiveInput]);

  const resetRuntime = useCallback(async () => {
    isWaitingSabInputRef.current = false;
    setPendingInputPrompt(null);
    continuationRef.current = null;
    await activeRuntime.reset();
    clearOutput();
    setStreamChunks([
      {
        type: 'system',
        text: 'Python runtime reset cleanly. All variables cleared from memory.',
        timestamp: Date.now(),
      },
    ]);
  }, [activeRuntime, clearOutput]);

  // Stepper controls
  const stepNext = useCallback(() => {
    if (!traceResult || traceResult.steps.length === 0) return;
    setActiveTraceIndex((prev) => Math.min(traceResult.steps.length - 1, prev + 1));
  }, [traceResult]);

  const stepPrev = useCallback(() => {
    if (!traceResult) return;
    setActiveTraceIndex((prev) => Math.max(0, prev - 1));
  }, [traceResult]);

  const jumpToStep = useCallback(
    (idx: number) => {
      if (!traceResult) return;
      const bounded = Math.max(0, Math.min(traceResult.steps.length - 1, idx));
      setActiveTraceIndex(bounded);
    },
    [traceResult]
  );

  const toggleTracePlay = useCallback(() => {
    setIsTracePlaying((prev) => !prev);
  }, []);

  // Automatic trace playback interval
  useEffect(() => {
    if (!isTracePlaying || !traceResult || traceResult.steps.length <= 1) return;

    const intervalTime = Math.max(200, Math.round(1000 / traceSpeed));
    const timer = setInterval(() => {
      setActiveTraceIndex((prev) => {
        if (prev >= traceResult.steps.length - 1) {
          setIsTracePlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isTracePlaying, traceResult, traceSpeed]);

  const activeTraceStep = traceResult?.steps[activeTraceIndex] || null;

  const value = useMemo(
    () => ({
      activeRuntime,
      runtimeMode,
      setRuntimeMode,
      pythonEngine,
      setPythonEngine,
      nativePythonInfo,
      isCheckingNativePython,
      engineFallbackNotice,
      clearEngineFallbackNotice,
      refreshNativePythonDetection,
      status,
      loadProgress,
      statusMessage,
      isEngineCached,
      ensureEngineReady,
      timeLimitMs,
      setTimeLimitMs,
      persistVariables,
      setPersistVariables,
      inputQueue,
      addInput,
      removeInput,
      clearInputQueue,
      setInputQueue,
      pendingInputPrompt,
      submitInteractiveInput,
      cancelInteractiveInput,
      isExecuting,
      streamChunks,
      offlineNotice,
      runResult,
      traceResult,
      activeTraceStep,
      activeTraceIndex,
      runCode,
      traceCode,
      stopExecution,
      resetRuntime,
      stepNext,
      stepPrev,
      jumpToStep,
      isTracePlaying,
      toggleTracePlay,
      traceSpeed,
      setTraceSpeed,
      lastError,
      clearOutput,
    }),
    [
      activeRuntime,
      runtimeMode,
      pythonEngine,
      setPythonEngine,
      nativePythonInfo,
      isCheckingNativePython,
      engineFallbackNotice,
      clearEngineFallbackNotice,
      refreshNativePythonDetection,
      status,
      loadProgress,
      statusMessage,
      isEngineCached,
      ensureEngineReady,
      timeLimitMs,
      setTimeLimitMs,
      persistVariables,
      setPersistVariables,
      inputQueue,
      addInput,
      removeInput,
      clearInputQueue,
      pendingInputPrompt,
      submitInteractiveInput,
      cancelInteractiveInput,
      isExecuting,
      streamChunks,
      offlineNotice,
      runResult,
      traceResult,
      activeTraceStep,
      activeTraceIndex,
      runCode,
      traceCode,
      stopExecution,
      resetRuntime,
      stepNext,
      stepPrev,
      jumpToStep,
      isTracePlaying,
      toggleTracePlay,
      traceSpeed,
      lastError,
      clearOutput,
    ]
  );

  return <RuntimeContext.Provider value={value}>{children}</RuntimeContext.Provider>;
};

export const usePythonRuntime = (): RuntimeContextValue => {
  const context = useContext(RuntimeContext);
  if (!context) {
    throw new Error('usePythonRuntime must be used within a RuntimeProvider');
  }
  return context;
};
