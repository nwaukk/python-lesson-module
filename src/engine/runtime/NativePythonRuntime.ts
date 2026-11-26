/**
 * Native Python Runtime Adapter (Optional Desktop Mode, Off by Default)
 * Executes user scripts through a local Python 3 installation spawned by the
 * Electron main process, streaming stdout/stderr, stdin prompts, and tracebacks over IPC.
 */

import {
  PythonRuntime,
  RuntimeStatus,
  RunOptions,
  TraceOptions,
  RunResult,
  TraceResult,
  OutputChunk,
} from './types';
import { parsePythonError } from './errorTranslator';
import {
  detectNativePython,
  runNativePythonProcess,
  sendNativePythonInput,
  stopNativePythonProcess,
  subscribeNativePythonEvents,
  NativePythonDetectionResult,
} from '../../platform/desktopBridge';

export class NativePythonRuntime implements PythonRuntime {
  id = 'native-python';
  name = 'Native System Python';
  mode = 'real' as const;
  status: RuntimeStatus = 'not-loaded';
  loadProgress = 0;
  statusMessage = 'Checking system Python...';
  isCached = true;
  detectedInfo: NativePythonDetectionResult | null = null;

  private statusListeners = new Set<
    (status: RuntimeStatus, progress: number, message?: string, cached?: boolean) => void
  >();
  private outputListeners = new Set<(chunk: OutputChunk) => void>();
  private inputListeners = new Set<(prompt: string) => void>();

  private activeRunId: string | null = null;
  private unsubEvents: (() => void) | null = null;

  private notifyStatus(
    status: RuntimeStatus,
    progress: number,
    message?: string
  ) {
    this.status = status;
    this.loadProgress = progress;
    if (message) this.statusMessage = message;
    this.statusListeners.forEach((cb) => cb(status, progress, message, true));
  }

  private notifyOutput(chunk: OutputChunk) {
    this.outputListeners.forEach((cb) => cb(chunk));
  }

  private notifyInput(prompt: string) {
    this.inputListeners.forEach((cb) => cb(prompt));
  }

  async detect(): Promise<NativePythonDetectionResult> {
    this.notifyStatus('loading', 35, 'Checking for system Python 3...');
    const res = await detectNativePython();
    this.detectedInfo = res;
    if (res.found) {
      this.notifyStatus('ready', 100, `Native Python ${res.version} ready`);
    } else {
      this.notifyStatus('failed', 0, res.message);
    }
    return res;
  }

  async init(): Promise<void> {
    const res = await this.detect();
    if (!res.found) {
      throw new Error(res.message);
    }
  }

  private executeProcess(
    code: string,
    mode: 'run' | 'trace',
    options?: RunOptions | TraceOptions
  ): Promise<{
    stdout: string;
    stderr: string;
    exitCode: number;
    durationMs: number;
    stopped: boolean;
    timedOut: boolean;
    tracePayload?: {
      steps: any[];
      totalSteps: number;
      truncated: boolean;
    } | null;
    notFoundMessage?: string;
  }> {
    return new Promise((resolve, reject) => {
      const runId = `nat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      this.activeRunId = runId;
      this.notifyStatus('running', 100, `Running via Native Python ${this.detectedInfo?.version || ''}...`);

      let stdoutAcc = '';
      let stderrAcc = '';

      if (this.unsubEvents) {
        this.unsubEvents();
        this.unsubEvents = null;
      }

      const cleanup = () => {
        if (this.unsubEvents) {
          this.unsubEvents();
          this.unsubEvents = null;
        }
        if (this.activeRunId === runId) {
          this.activeRunId = null;
        }
      };

      this.unsubEvents = subscribeNativePythonEvents((ev) => {
        if (ev.runId !== runId) return;

        if (ev.event === 'stdout' && typeof ev.data === 'string') {
          stdoutAcc += ev.data;
          this.notifyOutput({
            type: 'stdout',
            text: ev.data,
            timestamp: Date.now(),
          });
        } else if (ev.event === 'stderr' && typeof ev.data === 'string') {
          stderrAcc += ev.data;
          this.notifyOutput({
            type: 'stderr',
            text: ev.data,
            timestamp: Date.now(),
          });
        } else if (ev.event === 'input-request') {
          this.notifyInput(ev.prompt || 'Enter input:');
        } else if (ev.event === 'error') {
          const msg = ev.message || 'Native Python process failed.';
          stderrAcc += (stderrAcc ? '\n' : '') + msg;
          cleanup();
          this.notifyStatus('ready', 100, `Native Python ${this.detectedInfo?.version || ''} ready`);
          resolve({
            stdout: stdoutAcc,
            stderr: stderrAcc,
            exitCode: 1,
            durationMs: 0,
            stopped: false,
            timedOut: false,
          });
        } else if (ev.event === 'done') {
          cleanup();
          this.notifyStatus('ready', 100, `Native Python ${this.detectedInfo?.version || ''} ready`);
          resolve({
            stdout: stdoutAcc,
            stderr: stderrAcc,
            exitCode: typeof ev.exitCode === 'number' ? ev.exitCode : 0,
            durationMs: typeof ev.durationMs === 'number' ? ev.durationMs : 0,
            stopped: Boolean(ev.stopped),
            timedOut: Boolean(ev.timedOut),
            tracePayload: ev.tracePayload || null,
          });
        }
      });

      runNativePythonProcess({
        runId,
        code,
        mode,
        inputQueue: options?.inputQueue || [],
        timeLimitMs: options?.timeLimitMs ?? 10000,
        maxSteps: (options as TraceOptions | undefined)?.maxSteps ?? 300,
      })
        .then((startRes) => {
          this.detectedInfo = startRes.detected;
          if (!startRes.started) {
            cleanup();
            this.notifyStatus('failed', 0, startRes.detected.message);
            resolve({
              stdout: '',
              stderr: startRes.detected.message,
              exitCode: 1,
              durationMs: 0,
              stopped: false,
              timedOut: false,
              notFoundMessage: startRes.detected.message,
            });
          }
        })
        .catch((err) => {
          cleanup();
          reject(err);
        });
    });
  }

  async run(code: string, options?: RunOptions): Promise<RunResult> {
    const raw = await this.executeProcess(code, 'run', options);
    if (raw.notFoundMessage) {
      throw new Error(raw.notFoundMessage);
    }

    let stderr = raw.stderr;
    if (raw.timedOut && !stderr) {
      stderr = `TimeoutError: Execution exceeded ${(options?.timeLimitMs ?? 10000) / 1000}s limit and was terminated.`;
    } else if (raw.stopped && !stderr) {
      stderr = 'KeyboardInterrupt: Native Python process was stopped by user.';
    }

    const parsedErr = stderr ? parsePythonError(stderr) : null;

    return {
      stdout: raw.stdout,
      stderr,
      exitCode: raw.stopped || raw.timedOut ? 1 : raw.exitCode,
      durationMs: raw.durationMs,
      memoryObjectsCreated: 0,
      bytecodeSteps: 0,
      error: parsedErr,
    };
  }

  async trace(code: string, options?: TraceOptions): Promise<TraceResult> {
    const raw = await this.executeProcess(code, 'trace', options);
    if (raw.notFoundMessage) {
      throw new Error(raw.notFoundMessage);
    }

    let stderr = raw.stderr;
    if (raw.timedOut && !stderr) {
      stderr = `TimeoutError: Trace exceeded ${(options?.timeLimitMs ?? 10000) / 1000}s limit and was terminated.`;
    } else if (raw.stopped && !stderr) {
      stderr = 'KeyboardInterrupt: Native Python trace was stopped by user.';
    }

    const parsedErr = stderr ? parsePythonError(stderr) : null;
    const steps = Array.isArray(raw.tracePayload?.steps) ? raw.tracePayload.steps : [];

    return {
      steps,
      totalSteps: raw.tracePayload?.totalSteps ?? steps.length,
      truncated: Boolean(raw.tracePayload?.truncated),
      stdout: raw.stdout,
      stderr,
      durationMs: raw.durationMs,
      error: parsedErr,
    };
  }

  submitInput(value: string): void {
    if (!this.activeRunId) return;
    void sendNativePythonInput(this.activeRunId, value);
  }

  stop(): void {
    if (this.activeRunId) {
      const id = this.activeRunId;
      void stopNativePythonProcess(id);
    } else {
      void stopNativePythonProcess();
    }
    this.notifyStatus('ready', 100, `Native Python ${this.detectedInfo?.version || ''} ready`);
  }

  async reset(): Promise<void> {
    this.stop();
    await this.detect().catch(() => undefined);
  }

  onStatusChange(
    listener: (status: RuntimeStatus, progress: number, message?: string, cached?: boolean) => void
  ): () => void {
    this.statusListeners.add(listener);
    listener(this.status, this.loadProgress, this.statusMessage, this.isCached);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  onOutput(listener: (chunk: OutputChunk) => void): () => void {
    this.outputListeners.add(listener);
    return () => {
      this.outputListeners.delete(listener);
    };
  }

  onInputRequest(listener: (prompt: string) => void): () => void {
    this.inputListeners.add(listener);
    return () => {
      this.inputListeners.delete(listener);
    };
  }
}

export const nativePythonRuntime = new NativePythonRuntime();
