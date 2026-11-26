/**
 * Offline Pyodide Web Worker Runtime
 * Serves 100% locally bundled Pyodide assets (./pyodide/ via ./pyodide-worker.js, zero CDN requests).
 * Supports lazy initialization, single-instance lock, live stdout/stderr streaming,
 * interactive console input() (SharedArrayBuffer + non-isolated prompt resumption),
 * interrupt / timeout recovery, persistent cell namespaces, and sys.settrace stepping.
 */

import {
  PythonRuntime,
  RuntimeStatus,
  ExecutionMode,
  RunOptions,
  TraceOptions,
  RunResult,
  TraceResult,
  OutputChunk,
} from './types';
import { parsePythonError } from './errorTranslator';

interface PendingWorkerRequest {
  kind: 'RUN' | 'TRACE';
  resolve: (val: any) => void;
  reject: (err: any) => void;
  timer?: ReturnType<typeof setTimeout>;
  streamedStdout: string;
  streamedStderr: string;
  offlineNotices: string[];
  startedAt: number;
}

function resolveWorkerUrls(): { workerUrl: string; indexURL: string } {
  if (typeof window === 'undefined') {
    return { workerUrl: './pyodide-worker.js', indexURL: './pyodide/' };
  }
  const base = document.baseURI || window.location.href;
  return {
    workerUrl: new URL('./pyodide-worker.js', base).href,
    indexURL: new URL('./pyodide/', base).href,
  };
}

export class PyodideWorkerRuntime implements PythonRuntime {
  public id = 'pyodide-worker';
  public name = 'Pyodide Web Worker (Offline Python 3.12)';
  public mode: ExecutionMode = 'real';
  public status: RuntimeStatus = 'not-loaded';
  public loadProgress = 0;
  public statusMessage = 'Preparing Python engine...';
  public isCached = false;

  private worker: Worker | null = null;
  private initPromise: Promise<void> | null = null;
  private statusListeners: Set<(status: RuntimeStatus, progress: number, message?: string, cached?: boolean) => void> = new Set();
  private outputListeners: Set<(chunk: OutputChunk) => void> = new Set();
  private inputRequestListeners: Set<(prompt: string) => void> = new Set();
  private pendingRequests: Map<string, PendingWorkerRequest> = new Map();

  private activeInputSab: SharedArrayBuffer | null = null;
  private activeInterruptSab: SharedArrayBuffer | null = null;
  private stopGraceTimer: ReturnType<typeof setTimeout> | null = null;

  public onStatusChange(
    listener: (status: RuntimeStatus, progress: number, message?: string, cached?: boolean) => void
  ): () => void {
    this.statusListeners.add(listener);
    listener(this.status, this.loadProgress, this.statusMessage, this.isCached);
    return () => this.statusListeners.delete(listener);
  }

  public onOutput(listener: (chunk: OutputChunk) => void): () => void {
    this.outputListeners.add(listener);
    return () => this.outputListeners.delete(listener);
  }

  public onInputRequest(listener: (prompt: string) => void): () => void {
    this.inputRequestListeners.add(listener);
    return () => this.inputRequestListeners.delete(listener);
  }

  private emitOutputChunk(type: OutputChunk['type'], text: string): void {
    const chunk: OutputChunk = { type, text, timestamp: Date.now() };
    this.outputListeners.forEach((l) => l(chunk));
  }

  private setStatus(
    status: RuntimeStatus,
    progress = this.loadProgress,
    message = this.statusMessage,
    cached = this.isCached
  ): void {
    this.status = status;
    this.loadProgress = progress;
    this.statusMessage = message;
    this.isCached = cached;
    this.statusListeners.forEach((l) => l(status, progress, message, cached));
  }

  public async init(): Promise<void> {
    if (this.status === 'ready' && this.worker) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise<void>((resolve, reject) => {
      try {
        if (typeof Worker === 'undefined') {
          this.setStatus('failed', 0, 'Web Workers are unavailable in this environment.', false);
          reject(new Error('Web Workers unavailable'));
          return;
        }

        const { workerUrl, indexURL } = resolveWorkerUrls();
        this.setStatus('loading', 10, 'Preparing Python engine...', false);

        const worker = new Worker(workerUrl);
        this.worker = worker;

        let settledInit = false;

        worker.onmessage = (e) => {
          const msg = e.data || {};

          if (msg.type === 'STATUS') {
            const nextStatus = msg.status as RuntimeStatus;
            const nextProg = typeof msg.progress === 'number' ? msg.progress : this.loadProgress;
            const nextMsg = msg.message || this.statusMessage;
            const nextCached = Boolean(msg.cached);
            this.setStatus(nextStatus, nextProg, nextMsg, nextCached);

            if (nextStatus === 'ready' && !settledInit) {
              settledInit = true;
              resolve();
            } else if (nextStatus === 'failed' && !settledInit) {
              settledInit = true;
              this.initPromise = null;
              reject(new Error(msg.error || 'Failed to prepare Python engine.'));
            }
            return;
          }

          if (msg.type === 'OUTPUT_CHUNK' && msg.id && this.pendingRequests.has(msg.id)) {
            const req = this.pendingRequests.get(msg.id)!;
            const chunkType = (msg.chunkType as OutputChunk['type']) || 'stdout';
            const text = String(msg.text || '');
            if (chunkType === 'stdout') req.streamedStdout += text;
            else if (chunkType === 'stderr') req.streamedStderr += text;
            else if (chunkType === 'system' && text) req.offlineNotices.push(text);
            this.emitOutputChunk(chunkType, text);
            return;
          }

          if (msg.type === 'INPUT_REQUEST') {
            const prompt = String(msg.prompt || '');
            this.inputRequestListeners.forEach((l) => l(prompt));
            return;
          }

          if (msg.id && this.pendingRequests.has(msg.id)) {
            const req = this.pendingRequests.get(msg.id)!;
            if (req.timer) clearTimeout(req.timer);
            this.pendingRequests.delete(msg.id);
            if (this.stopGraceTimer) {
              clearTimeout(this.stopGraceTimer);
              this.stopGraceTimer = null;
            }
            this.setStatus('ready', 100, this.isCached ? 'Python 3.12 Ready (Cached)' : 'Python 3.12 Ready (Offline)', this.isCached);

            if (msg.type === 'RUN_SUCCESS' || msg.type === 'TRACE_SUCCESS') {
              req.resolve(msg.result);
            } else {
              req.reject(new Error(msg.error || 'Python execution failed'));
            }
          }
        };

        worker.onerror = (err) => {
          console.error('Pyodide Worker crashed:', err);
          if (!settledInit) {
            settledInit = true;
            this.initPromise = null;
            this.setStatus('failed', 0, 'Python worker crashed during initialization.', false);
            reject(new Error(err?.message || 'Worker error'));
          } else {
            this.recoverFromCrash('Python worker encountered a memory/runtime fault and was safely recovered.');
          }
        };

        worker.postMessage({ type: 'INIT', indexURL });
      } catch (e: any) {
        this.initPromise = null;
        this.setStatus('failed', 0, 'Could not start offline Python worker.', false);
        reject(e);
      }
    });

    return this.initPromise;
  }

  private recoverFromCrash(reason: string): void {
    const crashErr = parsePythonError(`RuntimeError: ${reason}`);
    this.pendingRequests.forEach((req) => {
      if (req.timer) clearTimeout(req.timer);
      if (req.kind === 'TRACE') {
        req.resolve({
          steps: [],
          totalSteps: 0,
          truncated: true,
          stdout: req.streamedStdout,
          stderr: req.streamedStderr ? `${req.streamedStderr}\n${reason}` : reason,
          durationMs: Date.now() - req.startedAt,
          error: crashErr,
        });
      } else {
        req.resolve({
          stdout: req.streamedStdout,
          stderr: req.streamedStderr ? `${req.streamedStderr}\n${reason}` : reason,
          exitCode: 1,
          durationMs: Date.now() - req.startedAt,
          memoryObjectsCreated: 0,
          bytecodeSteps: 0,
          error: crashErr,
        });
      }
    });
    this.pendingRequests.clear();
    this.terminateWorkerOnly();
    this.emitOutputChunk('system', reason);
  }

  public submitInput(value: string): void {
    if (!this.activeInputSab || typeof Atomics === 'undefined') return;
    const ctrl = new Int32Array(this.activeInputSab, 0, 2);
    const dataView = new Uint8Array(this.activeInputSab, 8);
    const encoded = new TextEncoder().encode(String(value));
    const clampedLen = Math.min(encoded.length, dataView.byteLength);
    dataView.set(encoded.subarray(0, clampedLen), 0);
    Atomics.store(ctrl, 1, clampedLen);
    Atomics.store(ctrl, 0, 1);
    Atomics.notify(ctrl, 0, 1);
  }

  private createSharedBuffers(): { inputSab: SharedArrayBuffer | null; interruptSab: SharedArrayBuffer | null } {
    if (
      typeof SharedArrayBuffer !== 'undefined' &&
      typeof window !== 'undefined' &&
      Boolean(window.crossOriginIsolated)
    ) {
      try {
        this.activeInputSab = new SharedArrayBuffer(65536);
        this.activeInterruptSab = new SharedArrayBuffer(4);
        return { inputSab: this.activeInputSab, interruptSab: this.activeInterruptSab };
      } catch {
        this.activeInputSab = null;
        this.activeInterruptSab = null;
      }
    }
    this.activeInputSab = null;
    this.activeInterruptSab = null;
    return { inputSab: null, interruptSab: null };
  }

  public async run(code: string, options?: RunOptions): Promise<RunResult> {
    if (this.status === 'failed' || !this.worker) {
      this.initPromise = null;
      await this.init();
    } else if (this.status !== 'ready') {
      await this.init();
    }

    const id = `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timeLimitMs = options?.timeLimitMs ?? 5000;
    const { indexURL } = resolveWorkerUrls();
    const { inputSab, interruptSab } = this.createSharedBuffers();

    this.setStatus('running', 100, 'Executing Python script...', this.isCached);

    return new Promise<RunResult>((resolve, reject) => {
      const pending: PendingWorkerRequest = {
        kind: 'RUN',
        streamedStdout: '',
        streamedStderr: '',
        offlineNotices: [],
        startedAt: Date.now(),
        resolve: (raw: any) => {
          const rawErrorText = raw.error ? String(raw.error) : null;
          const error = rawErrorText ? parsePythonError(rawErrorText) : null;
          const combinedStderr = [raw.stderr, rawErrorText].filter(Boolean).join('\n').trim();
          resolve({
            stdout: raw.stdout ?? pending.streamedStdout,
            stderr: combinedStderr,
            exitCode: raw.exitCode ?? (error ? 1 : 0),
            durationMs: raw.durationMs ?? 0,
            memoryObjectsCreated: raw.memoryObjectsCreated ?? 0,
            bytecodeSteps: 12,
            error,
            needsInputPrompt: raw.needsInputPrompt ?? null,
            offlineNotice:
              raw.offlineNotice ||
              (pending.offlineNotices.length > 0 ? pending.offlineNotices.join('\n') : null),
          });
        },
        reject,
      };

      pending.timer = setTimeout(() => {
        if (!this.pendingRequests.has(id)) return;
        this.pendingRequests.delete(id);
        const partialStdout = pending.streamedStdout;
        this.terminateAndRespawn();

        const msg = `TimeoutError: Execution exceeded time limit of ${(timeLimitMs / 1000).toFixed(1).replace(/\.0$/, '')}s.`;
        const timeoutError = parsePythonError(msg);
        resolve({
          stdout: partialStdout,
          stderr: `${msg} Worker was safely terminated and reset.`,
          exitCode: 124,
          durationMs: timeLimitMs,
          memoryObjectsCreated: 0,
          bytecodeSteps: 0,
          error: timeoutError,
        });
      }, timeLimitMs + 400);

      this.pendingRequests.set(id, pending);

      this.worker?.postMessage({
        id,
        type: 'RUN',
        code,
        indexURL,
        inputQueue: options?.inputQueue || [],
        maxOutputChars: options?.maxOutputChars || 65000,
        isolated: options?.isolated ?? false,
        persistentNamespace: options?.persistentNamespace ?? true,
        inputSab,
        interruptSab,
      });
    });
  }

  public async trace(code: string, options?: TraceOptions): Promise<TraceResult> {
    if (this.status === 'failed' || !this.worker) {
      this.initPromise = null;
      await this.init();
    } else if (this.status !== 'ready') {
      await this.init();
    }

    const id = `trace_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timeLimitMs = options?.timeLimitMs ?? 7000;
    const { indexURL } = resolveWorkerUrls();
    const { inputSab, interruptSab } = this.createSharedBuffers();

    this.setStatus('running', 100, 'Tracing execution steps...', this.isCached);

    return new Promise<TraceResult>((resolve, reject) => {
      const pending: PendingWorkerRequest = {
        kind: 'TRACE',
        streamedStdout: '',
        streamedStderr: '',
        offlineNotices: [],
        startedAt: Date.now(),
        resolve: (raw: any) => {
          const rawErrorText = raw.error ? String(raw.error) : null;
          const error = rawErrorText ? parsePythonError(rawErrorText) : null;
          const combinedStderr = [raw.stderr, rawErrorText].filter(Boolean).join('\n').trim();
          resolve({
            steps: raw.steps || [],
            totalSteps: raw.totalSteps || 0,
            truncated: Boolean(raw.truncated),
            stdout: raw.stdout ?? pending.streamedStdout,
            stderr: combinedStderr,
            durationMs: raw.durationMs || 0,
            error,
            needsInputPrompt: raw.needsInputPrompt ?? null,
            offlineNotice:
              raw.offlineNotice ||
              (pending.offlineNotices.length > 0 ? pending.offlineNotices.join('\n') : null),
          });
        },
        reject,
      };

      pending.timer = setTimeout(() => {
        if (!this.pendingRequests.has(id)) return;
        this.pendingRequests.delete(id);
        const partialStdout = pending.streamedStdout;
        this.terminateAndRespawn();

        const msg = `TimeoutError: Tracing exceeded ${(timeLimitMs / 1000).toFixed(1).replace(/\.0$/, '')}s safety limit.`;
        const timeoutError = parsePythonError(msg);
        resolve({
          steps: [],
          totalSteps: 0,
          truncated: true,
          stdout: partialStdout,
          stderr: msg,
          durationMs: timeLimitMs,
          error: timeoutError,
        });
      }, timeLimitMs + 400);

      this.pendingRequests.set(id, pending);

      this.worker?.postMessage({
        id,
        type: 'TRACE',
        code,
        indexURL,
        inputQueue: options?.inputQueue || [],
        maxSteps: options?.maxSteps || 300,
        isolated: options?.isolated ?? false,
        persistentNamespace: options?.persistentNamespace ?? true,
        inputSab,
        interruptSab,
      });
    });
  }

  public stop(): void {
    if (this.status !== 'running' && this.pendingRequests.size === 0) return;

    // 1. Attempt gentle KeyboardInterrupt via SharedArrayBuffer first (keeps worker warm if responsive)
    if (this.activeInterruptSab) {
      try {
        const iv = new Uint8Array(this.activeInterruptSab);
        iv[0] = 2; // SIGINT -> KeyboardInterrupt
        if (this.stopGraceTimer) clearTimeout(this.stopGraceTimer);
        this.stopGraceTimer = setTimeout(() => {
          if (this.pendingRequests.size > 0) {
            this.forceStopPendingRequests();
          }
        }, 300);
        return;
      } catch {
        // Fall through to hard worker termination
      }
    }

    // 2. Immediately terminate worker if SharedArrayBuffer isn't active
    this.forceStopPendingRequests();
  }

  private forceStopPendingRequests(): void {
    const interruptErr = parsePythonError('KeyboardInterrupt: Execution stopped by user.');
    this.pendingRequests.forEach((req) => {
      if (req.timer) clearTimeout(req.timer);
      if (req.kind === 'TRACE') {
        req.resolve({
          steps: [],
          totalSteps: 0,
          truncated: true,
          stdout: req.streamedStdout,
          stderr: 'KeyboardInterrupt: Execution stopped by user.',
          durationMs: Date.now() - req.startedAt,
          error: interruptErr,
        });
      } else {
        req.resolve({
          stdout: req.streamedStdout,
          stderr: 'KeyboardInterrupt: Execution stopped by user.',
          exitCode: 130,
          durationMs: Date.now() - req.startedAt,
          memoryObjectsCreated: 0,
          bytecodeSteps: 0,
          error: interruptErr,
        });
      }
    });
    this.pendingRequests.clear();
    this.terminateAndRespawn();
  }

  public async resetNamespace(): Promise<void> {
    if (this.worker && this.status === 'ready') {
      this.worker.postMessage({ id: `reset_${Date.now()}`, type: 'RESET_NAMESPACE' });
    }
  }

  public async reset(): Promise<void> {
    this.terminateAndRespawn();
    await this.init();
  }

  private terminateWorkerOnly(): void {
    if (this.stopGraceTimer) {
      clearTimeout(this.stopGraceTimer);
      this.stopGraceTimer = null;
    }
    if (this.worker) {
      try {
        this.worker.terminate();
      } catch {}
      this.worker = null;
    }
    this.initPromise = null;
    this.activeInputSab = null;
    this.activeInterruptSab = null;
    this.setStatus('not-loaded', 0, 'Preparing Python engine...', this.isCached);
  }

  private terminateAndRespawn(): void {
    this.pendingRequests.forEach((req) => {
      if (req.timer) clearTimeout(req.timer);
    });
    this.pendingRequests.clear();
    this.terminateWorkerOnly();
  }
}

export const pyodideWorker = new PyodideWorkerRuntime();
