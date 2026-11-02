/**
 * Trace Timeline Scrubber & Step Controller
 * Section 8.3: Step forward, backward, play/pause, scrub slider, and speed multiplier.
 */

import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  FastForward,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { usePythonRuntime } from './runtimeContext';

export const TraceTimeline: React.FC = () => {
  const {
    traceResult,
    activeTraceStep,
    activeTraceIndex,
    stepNext,
    stepPrev,
    jumpToStep,
    isTracePlaying,
    toggleTracePlay,
    traceSpeed,
    setTraceSpeed,
  } = usePythonRuntime();

  if (!traceResult || traceResult.steps.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-[var(--text-dim)] italic bg-[var(--bg-app)]">
        No execution trace recorded. Click "Step" in the toolbar to begin step-through debugging.
      </div>
    );
  }

  const totalSteps = traceResult.steps.length;

  return (
    <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2.5">
      {/* Top Controller Bar */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="badge-trace px-2 py-0.5 rounded text-[10px] font-bold">
            TRACE TIMELINE
          </span>
          <span className="font-mono font-semibold text-[var(--text-main)]">
            Step {activeTraceIndex + 1} of {totalSteps}
          </span>
          {traceResult.truncated && (
            <span className="text-[10px] text-amber-400 font-medium">
              (Capped at 300 steps)
            </span>
          )}
        </div>

        {/* Stepper Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => jumpToStep(0)}
            disabled={activeTraceIndex === 0}
            className="p-1 rounded hover:bg-[var(--border-subtle)] text-[var(--text-muted)] disabled:opacity-40"
            title="Jump to Start"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={stepPrev}
            disabled={activeTraceIndex === 0}
            className="px-2 py-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:bg-[var(--border-strong)] text-[var(--text-main)] font-semibold text-xs disabled:opacity-40"
            title="Previous step"
          >
            ← Back
          </button>
          <button
            onClick={toggleTracePlay}
            className="p-1.5 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] shadow-xs transition-colors"
            title={isTracePlaying ? 'Pause execution' : 'Play execution'}
          >
            {isTracePlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>
          <button
            onClick={stepNext}
            disabled={activeTraceIndex >= totalSteps - 1}
            className="px-2 py-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:bg-[var(--border-strong)] text-[var(--text-main)] font-semibold text-xs disabled:opacity-40"
            title="Next step"
          >
            Step →
          </button>
          <button
            onClick={() => jumpToStep(totalSteps - 1)}
            disabled={activeTraceIndex >= totalSteps - 1}
            className="p-1 rounded hover:bg-[var(--border-subtle)] text-[var(--text-muted)] disabled:opacity-40"
            title="Jump to End"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Speed Presets */}
          <div className="flex items-center ml-2 border-l border-[var(--border-subtle)] pl-2 text-[10px]">
            {[0.5, 1.0, 2.0].map((s) => (
              <button
                key={s}
                onClick={() => setTraceSpeed(s)}
                className={`px-1.5 py-0.5 rounded font-mono ${
                  traceSpeed === s
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold'
                    : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrub Slider */}
      <input
        type="range"
        min="0"
        max={totalSteps - 1}
        value={activeTraceIndex}
        onChange={(e) => jumpToStep(parseInt(e.target.value, 10))}
        className="w-full accent-[var(--accent-primary)] cursor-pointer h-1.5 bg-[var(--bg-app)] rounded-lg"
      />

      {/* Active Step Details (Line & Event) */}
      {activeTraceStep && (
        <div className="p-2 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[var(--accent-primary)] font-bold">
              Line {activeTraceStep.line}
            </span>
            <span className="text-[var(--text-dim)]">•</span>
            <span className="text-[var(--text-muted)]">
              Event: <span className="text-emerald-400">{activeTraceStep.event}</span> in <code className="text-[var(--syntax-keyword)]">{activeTraceStep.functionName}()</code>
            </span>
          </div>
          <span className="text-[10px] text-[var(--text-dim)]">
            {Object.keys(activeTraceStep.variables).length} variables in scope
          </span>
        </div>
      )}
    </div>
  );
};
