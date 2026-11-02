/**
 * Simulation Runtime
 * Section 8.1: Safe scripted visual model for concepts that cannot run in a browser
 * (e.g. Flask servers, MongoDB connections, system sockets).
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

export class SimulationRuntime implements PythonRuntime {
  public id = 'simulation-runtime';
  public name = 'Scripted Simulation Model';
  public mode: ExecutionMode = 'simulation';
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
    return {
      stdout: `[SIMULATION ENGINE]\nSimulating server route resolution & payload dispatch...\nHTTP/1.1 200 OK\nContent-Type: application/json\n{"status": "simulated", "code_length": ${code.length}}`,
      stderr: '',
      exitCode: 0,
      durationMs: 8,
      memoryObjectsCreated: 6,
      bytecodeSteps: 18,
      error: null,
    };
  }

  public async trace(code: string, options?: TraceOptions): Promise<TraceResult> {
    return {
      steps: [
        {
          stepNumber: 1,
          line: 1,
          event: 'line',
          functionName: '<simulation>',
          scope: 'global',
          variables: {
            simulation_state: {
              name: 'simulation_state',
              type: 'str',
              repr: '"active"',
              objectId: 9999,
              isMutable: false,
            },
          },
          stdoutDelta: '[SIMULATION INITIALISED]\n',
        },
      ],
      totalSteps: 1,
      truncated: false,
      stdout: '[SIMULATION INITIALISED]\n',
      stderr: '',
      durationMs: 5,
      error: null,
    };
  }

  public stop(): void {}
  public async reset(): Promise<void> {}
}

export const simulationRuntime = new SimulationRuntime();
