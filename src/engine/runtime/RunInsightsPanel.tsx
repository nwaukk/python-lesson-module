/**
 * Run Insights Panel
 * Section 3.3: Displays execution metrics, duration, memory allocations, and bytecode steps.
 */

import React from 'react';
import { Activity, Clock, Box, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';
import { usePythonRuntime } from './runtimeContext';

export const RunInsightsPanel: React.FC = () => {
  const { runResult, traceResult, isExecuting, timeLimitMs } = usePythonRuntime();

  const activeResult = traceResult || runResult;

  if (!activeResult && !isExecuting) {
    return (
      <div className="p-6 text-center text-xs text-[var(--text-dim)] italic font-mono bg-[var(--bg-app)]">
        Run code or step through execution to generate execution insights.
      </div>
    );
  }

  const durationMs = activeResult?.durationMs || 0;
  const exitCode = activeResult ? ('exitCode' in activeResult ? activeResult.exitCode : (activeResult.error ? 1 : 0)) : 0;
  const stepsCount = traceResult?.totalSteps || (runResult ? 1 : 0);
  const memoryObjects = activeResult && 'memoryObjectsCreated' in activeResult ? activeResult.memoryObjectsCreated : 4;

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs bg-[var(--bg-app)]">
      <div className="text-[10px] eyebrow-label text-[var(--text-dim)]">RUNTIME METRICS &amp; TELEMETRY</div>

      <div className="grid grid-cols-2 gap-3">
        {/* Metric 1: Duration */}
        <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-1">
          <div className="flex items-center gap-1.5 text-[var(--text-dim)]">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[10px]">EXECUTION TIME</span>
          </div>
          <div className="text-base font-bold text-[var(--text-main)]">{durationMs} ms</div>
          <div className="text-[10px] text-[var(--text-dim)]">Safety cap: {timeLimitMs / 1000}s</div>
        </div>

        {/* Metric 2: Exit Status */}
        <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-1">
          <div className="flex items-center gap-1.5 text-[var(--text-dim)]">
            {exitCode === 0 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            )}
            <span className="text-[10px]">EXIT STATUS</span>
          </div>
          <div className={`text-base font-bold ${exitCode === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            Code {exitCode}
          </div>
          <div className="text-[10px] text-[var(--text-dim)]">
            {exitCode === 0 ? 'Normal termination' : 'Terminated on exception'}
          </div>
        </div>

        {/* Metric 3: Steps Traced */}
        <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-1">
          <div className="flex items-center gap-1.5 text-[var(--text-dim)]">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10px]">TRACE EVENTS</span>
          </div>
          <div className="text-base font-bold text-[var(--text-main)]">{stepsCount} steps</div>
          <div className="text-[10px] text-[var(--text-dim)]">sys.settrace captures</div>
        </div>

        {/* Metric 4: Memory Objects */}
        <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-1">
          <div className="flex items-center gap-1.5 text-[var(--text-dim)]">
            <Box className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px]">HEAP OBJECTS</span>
          </div>
          <div className="text-base font-bold text-[var(--text-main)]">~{memoryObjects} objects</div>
          <div className="text-[10px] text-[var(--text-dim)]">Bound in namespace</div>
        </div>
      </div>
    </div>
  );
};
