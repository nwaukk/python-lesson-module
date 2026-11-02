/**
 * Runtime Execution Context & Hook
 * Section 8: Manages active Python runtime, execution state, trace stepping,
 * input queue, and error diagnostic output.
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  PythonRuntime,
  RuntimeStatus,
  ExecutionMode,
  RunResult,
  TraceResult,
  TraceStep,
  ParsedPythonError,
} from './types';
import { pyodideWorker } from './PyodideWorkerRuntime';
import { traceReplay } from './TraceReplayRuntime';
import { simulationRuntime } from './SimulationRuntime';

interface RuntimeContextValue {
  activeRuntime: PythonRuntime;
  runtimeMode: ExecutionMode;
  setRuntimeMode: (mode: ExecutionMode) => void;
  status: RuntimeStatus;
  loadProgress: number;
  timeLimitMs: number;
  setTimeLimitMs: (ms: number) => void;
  // Input Queue
  inputQueue: string[];
  addInput: (val: string) => void;
  removeInput: (idx: number) => void;
  clearInputQueue: () => void;
  setInputQueue: (items: string[]) => void;
  // Execution
  isExecuting: boolean;
  runResult: RunResult | null;
  traceResult: TraceResult | null;
  activeTraceStep: TraceStep | null;
  activeTraceIndex: number;
  runCode: (code: string) => Promise<RunResult>;
  traceCode: (code: string) => Promise<TraceResult>;
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
  const [runtimeMode, setRuntimeMode] = useState<ExecutionMode>('real');
  const [status, setStatus] = useState<RuntimeStatus>('not-loaded');
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [timeLimitMs, setTimeLimitMs] = useState<number>(5000);
  const [inputQueue, setInputQueue] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [traceResult, setTraceResult] = useState<TraceResult | null>(null);
  const [activeTraceIndex, setActiveTraceIndex] = useState<number>(0);
  const [isTracePlaying, setIsTracePlaying] = useState<boolean>(false);
  const [traceSpeed, setTraceSpeed] = useState<number>(1.0);
  const [lastError, setLastError] = useState<ParsedPythonError | null>(null);

  const activeRuntime = useMemo(() => {
    if (runtimeMode === 'trace') return traceReplay;
    if (runtimeMode === 'simulation') return simulationRuntime;
    return pyodideWorker;
  }, [runtimeMode]);

  // Sync status
  useEffect(() => {
    const unsub = activeRuntime.onStatusChange((s, p) => {
      setStatus(s);
      setLoadProgress(p);
    });
    return unsub;
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
    setLastError(null);
    setActiveTraceIndex(0);
  }, []);

  const runCode = useCallback(async (code: string): Promise<RunResult> => {
    setIsExecuting(true);
    setLastError(null);

    try {
      let res: RunResult;
      try {
        res = await activeRuntime.run(code, {
          timeLimitMs,
          inputQueue: [...inputQueue],
        });
      } catch (err: any) {
        // Fallback to TraceReplay if Pyodide failed
        if (runtimeMode === 'real') {
          console.warn('Pyodide failed, falling back to TraceReplay:', err);
          res = await traceReplay.run(code, { timeLimitMs, inputQueue: [...inputQueue] });
        } else {
          throw err;
        }
      }

      setRunResult(res);
      if (res.error) {
        setLastError(res.error);
      }
      setIsExecuting(false);
      return res;
    } catch (e: any) {
      setIsExecuting(false);
      const fallbackResult: RunResult = {
        stdout: '',
        stderr: String(e.message || e),
        exitCode: 1,
        durationMs: 0,
        memoryObjectsCreated: 0,
        bytecodeSteps: 0,
      };
      setRunResult(fallbackResult);
      return fallbackResult;
    }
  }, [activeRuntime, timeLimitMs, inputQueue, runtimeMode]);

  const traceCode = useCallback(async (code: string): Promise<TraceResult> => {
    setIsExecuting(true);
    setLastError(null);

    try {
      let res: TraceResult;
      try {
        res = await activeRuntime.trace(code, {
          timeLimitMs: timeLimitMs + 2000,
          inputQueue: [...inputQueue],
          maxSteps: 300,
        });
      } catch (err) {
        res = await traceReplay.trace(code, { timeLimitMs, inputQueue: [...inputQueue] });
      }

      setTraceResult(res);
      setActiveTraceIndex(0);
      if (res.error) {
        setLastError(res.error);
      }
      setIsExecuting(false);
      return res;
    } catch (e: any) {
      setIsExecuting(false);
      const emptyTrace: TraceResult = {
        steps: [],
        totalSteps: 0,
        truncated: false,
        stdout: '',
        stderr: String(e.message || e),
        durationMs: 0,
      };
      setTraceResult(emptyTrace);
      return emptyTrace;
    }
  }, [activeRuntime, timeLimitMs, inputQueue]);

  const stopExecution = useCallback(() => {
    activeRuntime.stop();
    setIsExecuting(false);
  }, [activeRuntime]);

  const resetRuntime = useCallback(async () => {
    await activeRuntime.reset();
    clearOutput();
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

  const jumpToStep = useCallback((idx: number) => {
    if (!traceResult) return;
    const bounded = Math.max(0, Math.min(traceResult.steps.length - 1, idx));
    setActiveTraceIndex(bounded);
  }, [traceResult]);

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
      status,
      loadProgress,
      timeLimitMs,
      setTimeLimitMs,
      inputQueue,
      addInput,
      removeInput,
      clearInputQueue,
      setInputQueue,
      isExecuting,
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
      status,
      loadProgress,
      timeLimitMs,
      inputQueue,
      addInput,
      removeInput,
      clearInputQueue,
      isExecuting,
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
