/**
 * Python Runtime Abstraction Types & Interfaces
 * Section 8.1 & 8.2 of Master Specification.
 */

export type RuntimeStatus =
  | 'not-loaded'
  | 'loading'
  | 'ready'
  | 'running'
  | 'stopped'
  | 'failed';

export type ExecutionMode = 'real' | 'trace' | 'simulation';

export interface TraceVariable {
  name: string;
  type: string;
  repr: string;
  objectId: number;
  isMutable: boolean;
}

export interface TraceStep {
  stepNumber: number;
  line: number;
  event: 'line' | 'call' | 'return' | 'exception';
  functionName: string;
  scope: 'global' | 'local';
  variables: Record<string, TraceVariable>;
  stdoutDelta?: string;
}

export interface ParsedPythonError {
  name: string; // e.g. "TypeError", "ZeroDivisionError"
  message: string;
  line?: number;
  traceback: string;
  friendlyExplanation: string;
  fixSuggestions: string[];
}

export interface RunOptions {
  timeLimitMs?: number;
  inputQueue?: string[];
  maxOutputChars?: number;
  isolated?: boolean;
  persistentNamespace?: boolean;
}

export interface TraceOptions extends RunOptions {
  maxSteps?: number;
}

export interface RunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
  memoryObjectsCreated: number;
  bytecodeSteps: number;
  error?: ParsedPythonError | null;
  needsInputPrompt?: string | null;
  offlineNotice?: string | null;
}

export interface TraceResult {
  steps: TraceStep[];
  totalSteps: number;
  truncated: boolean;
  stdout: string;
  stderr: string;
  durationMs: number;
  error?: ParsedPythonError | null;
  needsInputPrompt?: string | null;
  offlineNotice?: string | null;
}

export interface OutputChunk {
  type: 'stdout' | 'stderr' | 'system';
  text: string;
  timestamp: number;
}

export interface PythonRuntime {
  id: string;
  name: string;
  mode: ExecutionMode;
  status: RuntimeStatus;
  loadProgress: number; // 0 to 100
  statusMessage?: string;
  isCached?: boolean;
  init(): Promise<void>;
  run(code: string, options?: RunOptions): Promise<RunResult>;
  trace(code: string, options?: TraceOptions): Promise<TraceResult>;
  stop(): void;
  reset(): Promise<void>;
  resetNamespace?(): Promise<void>;
  submitInput?(value: string): void;
  installPackage?(packageName: string): Promise<boolean>;
  onStatusChange(listener: (status: RuntimeStatus, progress: number, message?: string, cached?: boolean) => void): () => void;
  onOutput(listener: (chunk: OutputChunk) => void): () => void;
  onInputRequest?(listener: (prompt: string) => void): () => void;
}
