/**
 * Grade Boundaries & Elif Order Inspector Simulation
 * Section 14 (Day 9 Signature Simulation):
 * A WAEC-style A1 to F9 grader where elif evaluation order matters,
 * demonstrating how sequential branch short-circuiting misgrades students if ordered incorrectly.
 */

import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface GradeRule {
  grade: string;
  name: string;
  threshold: number;
  condition: string;
}

const CORRECT_RULES: GradeRule[] = [
  { grade: 'A1', name: 'Excellent', threshold: 75, condition: 'score >= 75' },
  { grade: 'B2', name: 'Very Good', threshold: 70, condition: 'score >= 70' },
  { grade: 'B3', name: 'Good', threshold: 65, condition: 'score >= 65' },
  { grade: 'C4', name: 'Credit', threshold: 60, condition: 'score >= 60' },
  { grade: 'C5', name: 'Credit', threshold: 55, condition: 'score >= 55' },
  { grade: 'C6', name: 'Credit', threshold: 50, condition: 'score >= 50' },
  { grade: 'D7', name: 'Pass', threshold: 45, condition: 'score >= 45' },
  { grade: 'E8', name: 'Pass', threshold: 40, condition: 'score >= 40' },
];

const BROKEN_RULES: GradeRule[] = [
  { grade: 'E8', name: 'Pass (WRONG ORDER)', threshold: 40, condition: 'score >= 40' },
  { grade: 'D7', name: 'Pass', threshold: 45, condition: 'score >= 45' },
  { grade: 'C6', name: 'Credit', threshold: 50, condition: 'score >= 50' },
  { grade: 'C5', name: 'Credit', threshold: 55, condition: 'score >= 55' },
  { grade: 'C4', name: 'Credit', threshold: 60, condition: 'score >= 60' },
  { grade: 'B3', name: 'Good', threshold: 65, condition: 'score >= 65' },
  { grade: 'B2', name: 'Very Good', threshold: 70, condition: 'score >= 70' },
  { grade: 'A1', name: 'Excellent', threshold: 75, condition: 'score >= 75' },
];

export const GradeBoundariesSim: React.FC = () => {
  const [score, setScore] = useState<number>(85);
  const [mode, setMode] = useState<'correct' | 'broken'>('correct');

  // Compute grade under correct logic
  let correctGrade = 'F9';
  let correctName = 'Fail';
  let correctTriggeredRule: GradeRule | null = null;
  for (const rule of CORRECT_RULES) {
    if (score >= rule.threshold) {
      correctGrade = rule.grade;
      correctName = rule.name;
      correctTriggeredRule = rule;
      break;
    }
  }

  // Compute grade under broken logic
  let brokenGrade = 'F9';
  let brokenName = 'Fail';
  let brokenTriggeredRule: GradeRule | null = null;
  for (const rule of BROKEN_RULES) {
    if (score >= rule.threshold) {
      brokenGrade = rule.grade;
      brokenName = rule.name;
      brokenTriggeredRule = rule;
      break;
    }
  }

  const activeRules = mode === 'correct' ? CORRECT_RULES : BROKEN_RULES;
  const activeGrade = mode === 'correct' ? correctGrade : brokenGrade;
  const activeName = mode === 'correct' ? correctName : brokenName;
  const activeTriggeredRule = mode === 'correct' ? correctTriggeredRule : brokenTriggeredRule;
  const isMisgraded = mode === 'broken' && activeGrade !== correctGrade;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="WAEC Grade Boundaries & Elif Order Inspector"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {/* Mode Selector & Score Slider */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Order Toggle */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
            <span className="eyebrow-label text-xs">ELIF CHAIN ORDER MODE</span>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Elif Chain Order Mode">
              <button
                type="button"
                aria-pressed={mode === 'correct'}
                onClick={() => setMode('correct')}
                className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  mode === 'correct'
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Descending Order (Correct)</span>
              </button>

              <button
                type="button"
                aria-pressed={mode === 'broken'}
                onClick={() => setMode('broken')}
                className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  mode === 'broken'
                    ? 'border-rose-500 bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/40'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Ascending Order (Broken!)</span>
              </button>
            </div>
          </div>

          {/* Score Slider */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="waec-score-slider" className="eyebrow-label text-xs">CANDIDATE EXAM SCORE</label>
              <span className="font-mono text-base font-extrabold text-[var(--accent-primary)]">
                {score} / 100
              </span>
            </div>
            <input
              id="waec-score-slider"
              type="range"
              min="0"
              max="100"
              value={score}
              aria-label="Candidate Exam Score"
              aria-valuetext={`${score} out of 100 — Grade ${activeGrade}`}
              onChange={(e) => setScore(parseInt(e.target.value, 10))}
              className="w-full accent-[var(--accent-primary)] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[var(--text-dim)]">
              <span>0 (F9)</span>
              <span>40 (E8)</span>
              <span>50 (C6)</span>
              <span>65 (B3)</span>
              <span>75 (A1)</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* Verdict Banner */}
        <div
          role="status"
          aria-live="polite"
          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
            isMisgraded
              ? 'border-rose-500/50 bg-rose-500/15 text-rose-200'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {isMisgraded ? (
              <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            )}
            <div>
              <div className="font-bold text-sm">
                Awarded Grade: <span className="font-mono font-extrabold text-base underline">{activeGrade} ({activeName})</span>
              </div>
              <div className="text-xs opacity-90 mt-0.5">
                {isMisgraded ? (
                  <span className="text-rose-300 font-semibold">
                    CATASTROPHIC MISGRADE! Candidate scored {score} (qualifying for {correctGrade} {correctName}), but received {brokenGrade} because {brokenTriggeredRule?.condition} short-circuited first!
                  </span>
                ) : (
                  <span>
                    Accurately graded according to WAEC standard boundaries. Highest qualifying threshold ({activeTriggeredRule?.condition || 'else'}) matched.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] eyebrow-label text-[var(--text-dim)] block">EXPECTED GRADE</span>
            <span className="font-mono text-sm font-bold text-emerald-300">
              {correctGrade} ({correctName})
            </span>
          </div>
        </div>

        {/* Sequential Branch Execution Ladder */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="eyebrow-label text-xs">
              SEQUENTIAL ELIF EVALUATION LADDER ({mode === 'correct' ? 'DESCENDING' : 'ASCENDING'})
            </span>
            <span className="text-[10px] text-[var(--text-dim)] font-mono">
              Python evaluates top-to-bottom and exits on FIRST True condition
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeRules.map((rule, idx) => {
              const wouldMatch = score >= rule.threshold;
              const isFirstMatch = activeTriggeredRule === rule;
              const isShortCircuited = wouldMatch && !isFirstMatch;

              return (
                <div
                  key={rule.grade}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isFirstMatch
                      ? mode === 'correct'
                        ? 'border-emerald-500 bg-emerald-500/20 shadow-md ring-2 ring-emerald-500/40'
                        : 'border-rose-500 bg-rose-500/20 shadow-md ring-2 ring-rose-500/40'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[var(--text-dim)]">
                        {idx === 0 ? 'if' : 'elif'}
                      </span>
                      <code className="font-mono text-xs font-semibold text-[var(--text-main)]">
                        {rule.condition}:
                      </code>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-bold ${
                        isFirstMatch
                          ? mode === 'correct'
                            ? 'bg-emerald-500/30 text-emerald-200'
                            : 'bg-rose-500/30 text-rose-200'
                          : 'bg-[var(--bg-app)] text-[var(--text-dim)]'
                      }`}
                    >
                      grade = "{rule.grade}"
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[var(--text-muted)]">{rule.name}</span>
                    <span
                      className={`font-mono text-[10px] font-bold ${
                        isFirstMatch
                          ? 'text-emerald-300'
                          : isShortCircuited
                          ? 'text-amber-400 line-through'
                          : 'text-[var(--text-dim)]'
                      }`}
                    >
                      {isFirstMatch
                        ? '--> BRANCH TAKEN (EXITS)'
                        : isShortCircuited
                        ? 'SKIPPED (DEAD CODE)'
                        : wouldMatch
                        ? 'True'
                        : 'False (Tests Next)'}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Fallback Else */}
            <div
              className={`p-3.5 rounded-xl border transition-all ${
                score < 40
                  ? 'border-emerald-500 bg-emerald-500/20 ring-2 ring-emerald-500/40'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] opacity-70'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--text-dim)]">else:</span>
                  <code className="font-mono text-xs font-semibold text-[var(--text-main)]">
                    # Score &lt; 40
                  </code>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md font-mono font-bold bg-[var(--bg-app)] text-[var(--text-dim)]">
                  grade = "F9"
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[var(--text-muted)]">Fail</span>
                <span className="font-mono text-[10px] font-bold text-[var(--text-dim)]">
                  {score < 40 ? '--> BRANCH TAKEN (EXITS)' : 'Skipped'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
