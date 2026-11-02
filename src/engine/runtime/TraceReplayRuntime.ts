/**
 * Trace Replay Runtime
 * Section 8.1 & 8.2: Replays recorded or pre-authored execution traces offline or when Pyodide is unavailable.
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
  TraceStep,
} from './types';

export class TraceReplayRuntime implements PythonRuntime {
  public id = 'trace-replay';
  public name = 'Scripted Trace Replay (Offline & Fast)';
  public mode: ExecutionMode = 'trace';
  public status: RuntimeStatus = 'ready';
  public loadProgress = 100;

  private statusListeners: Set<(status: RuntimeStatus, progress: number) => void> = new Set();
  private outputListeners: Set<(chunk: OutputChunk) => void> = new Set();

  public onStatusChange(listener: (status: RuntimeStatus, progress: number) => void): () => void {
    this.statusListeners.add(listener);
    listener(this.status, this.loadProgress);
    return () => this.statusListeners.delete(listener);
  }

  public onOutput(listener: (chunk: OutputChunk) => void): () => void {
    this.outputListeners.add(listener);
    return () => this.outputListeners.delete(listener);
  }

  public async init(): Promise<void> {
    this.status = 'ready';
  }

  public async run(code: string, options?: RunOptions): Promise<RunResult> {
    const trace = await this.trace(code, options);
    return {
      stdout: trace.stdout,
      stderr: trace.stderr,
      exitCode: trace.error ? 1 : 0,
      durationMs: trace.durationMs,
      memoryObjectsCreated: trace.steps.length,
      bytecodeSteps: trace.steps.length * 2,
      error: trace.error,
    };
  }

  public async trace(code: string, options?: TraceOptions): Promise<TraceResult> {
    const lines = code.trim().split('\n');
    const steps: TraceStep[] = [];
    const simulatedVars: Record<string, any> = {};
    let stdoutAcc = '';

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      // Simple educational interpreter for basic assignments & prints
      if (trimmed.includes('=') && !trimmed.startsWith('print')) {
        const [left, right] = trimmed.split('=').map((s) => s.trim());
        let val: any = right;
        let typeName = 'str';
        let isMutable = false;

        if (right.startsWith('"') || right.startsWith("'")) {
          val = right.replace(/['"]/g, '');
          typeName = 'str';
        } else if (!isNaN(Number(right))) {
          val = Number(right);
          typeName = Number.isInteger(val) ? 'int' : 'float';
        } else if (right.startsWith('[') && right.endsWith(']')) {
          typeName = 'list';
          isMutable = true;
          val = right;
        } else if (right === 'True' || right === 'False') {
          typeName = 'bool';
        }

        simulatedVars[left] = {
          name: left,
          type: typeName,
          repr: String(val),
          objectId: 1000 + idx,
          isMutable,
        };
      } else if (trimmed.startsWith('print(')) {
        const inside = trimmed.slice(6, -1).trim();
        let printedText = inside;
        if (simulatedVars[inside]) {
          printedText = simulatedVars[inside].repr;
        } else if (inside.startsWith('f"') || inside.startsWith("f'")) {
          printedText = inside.slice(2, -1);
          Object.keys(simulatedVars).forEach((k) => {
            printedText = printedText.replace(new RegExp(`\\{${k}\\}`, 'g'), simulatedVars[k].repr);
          });
        } else {
          printedText = inside.replace(/['"]/g, '');
        }
        stdoutAcc += printedText + '\n';
      }

      steps.push({
        stepNumber: steps.length + 1,
        line: idx + 1,
        event: 'line',
        functionName: '<module>',
        scope: 'global',
        variables: { ...simulatedVars },
        stdoutDelta: stdoutAcc,
      });
    });

    return {
      steps,
      totalSteps: steps.length,
      truncated: false,
      stdout: stdoutAcc,
      stderr: '',
      durationMs: 4,
      error: null,
    };
  }

  public stop(): void {}
  public async reset(): Promise<void> {}
}

export const traceReplay = new TraceReplayRuntime();
