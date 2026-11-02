/**
 * Shared Simulation Controller Bar
 * Section 8.4: Shared controller for play, pause, step, back, reset, speed, before/after, and status badges.
 */

import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  FastForward,
  Sparkles,
} from 'lucide-react';
import { ExecutionMode } from '../runtime/types';

interface Props {
  title: string;
  badge: ExecutionMode;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  onStepNext?: () => void;
  onStepPrev?: () => void;
  onReset?: () => void;
  currentStep?: number;
  totalSteps?: number;
  speed?: number;
  onSpeedChange?: (speed: number) => void;
  beforeAfterMode?: 'before' | 'after';
  onToggleBeforeAfter?: () => void;
  hasBeforeAfter?: boolean;
}

export const SimulationController: React.FC<Props> = ({
  title,
  badge,
  isPlaying = false,
  onTogglePlay,
  onStepNext,
  onStepPrev,
  onReset,
  currentStep = 1,
  totalSteps = 1,
  speed = 1.0,
  onSpeedChange,
  beforeAfterMode = 'after',
  onToggleBeforeAfter,
  hasBeforeAfter = false,
}) => {
  return (
    <div className="px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex flex-wrap items-center justify-between gap-2 shrink-0">
      {/* Title & Badge */}
      <div className="flex items-center gap-2">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            badge === 'real'
              ? 'badge-real-python'
              : badge === 'trace'
              ? 'badge-trace'
              : 'badge-simulation'
          }`}
        >
          {badge === 'real' ? 'REAL PYTHON' : badge === 'trace' ? 'TRACE' : 'SIMULATION'}
        </span>
        <span className="text-xs font-semibold text-[var(--text-main)] truncate max-w-xs sm:max-w-md">
          {title}
        </span>
      </div>

      {/* Controller Buttons */}
      <div className="flex items-center gap-1.5 text-xs">
        {hasBeforeAfter && onToggleBeforeAfter && (
          <button
            onClick={onToggleBeforeAfter}
            className={`px-2.5 py-1 rounded text-xs font-semibold border transition-colors ${
              beforeAfterMode === 'before'
                ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
            title="Compare state before and after execution"
          >
            {beforeAfterMode === 'before' ? 'Before Execution' : 'After Execution'}
          </button>
        )}

        {totalSteps > 1 && (
          <span className="font-mono text-[11px] text-[var(--text-dim)] px-1">
            {currentStep}/{totalSteps}
          </span>
        )}

        {onStepPrev && (
          <button
            onClick={onStepPrev}
            disabled={currentStep <= 1}
            className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-30 transition-colors"
            title="Step backward"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
        )}

        {onTogglePlay && (
          <button
            onClick={onTogglePlay}
            className="p-1.5 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] shadow-xs transition-colors"
            title={isPlaying ? 'Pause animation' : 'Play animation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>
        )}

        {onStepNext && (
          <button
            onClick={onStepNext}
            disabled={currentStep >= totalSteps}
            className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-30 transition-colors"
            title="Step forward"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        )}

        {onReset && (
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            title="Reset simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        {onSpeedChange && (
          <div className="hidden sm:flex items-center ml-1 border-l border-[var(--border-subtle)] pl-1.5 text-[10px]">
            {[0.5, 1.0, 2.0].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-1.5 py-0.5 rounded font-mono ${
                  speed === s
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold'
                    : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
