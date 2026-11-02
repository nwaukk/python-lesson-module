/**
 * Unified ExerciseCard Component
 * Implements all 8 exercise types per Section 7.3 & 10.2:
 * 1. scenario-mcq
 * 2. predict-output
 * 3. fix-the-bug
 * 4. order-the-lines (Parsons)
 * 5. fill-the-gaps
 * 6. write-code
 * 7. theory-reasoning
 * 8. explain-the-trace
 * Features:
 * - 4 difficulty tiers: 🟢 Foundation, 🔵 Standard, 🟡 Challenge, 🟣 Project
 * - 3-level progressive hint ladder before worked solution
 * - Worked solution penalty tracking (unassisted: false)
 * - Seeded variant switcher
 * - Score persistence via ProgressContext
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  Unlock,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Code,
  AlertTriangle,
  Shuffle,
  Eye,
  FileQuestion,
} from 'lucide-react';
import { ExerciseData, ExerciseSubmissionState, DifficultyTier } from './types';
import { TIER_CONFIGS, generateSeededVariant } from './variants';
import { useProgress } from '../../store/progressContext';
import { CodeRunnerExercise } from './CodeRunnerExercise';
import { ParsonsReorder } from './ParsonsReorder';
import { TheoryChecklist } from './TheoryChecklist';

interface Props {
  exercise: ExerciseData;
  onGraded?: (state: ExerciseSubmissionState) => void;
}

export const ExerciseCard: React.FC<Props> = ({ exercise: initialExercise, onGraded }) => {
  const [exercise, setExercise] = useState<ExerciseData>(initialExercise);
  const [variantSeed, setVariantSeed] = useState<number>(1);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [gapAnswers, setGapAnswers] = useState<Record<string, string>>({});
  const [traceAnswer, setTraceAnswer] = useState<string>('');
  
  // Hint & Solution state
  const [hintLevel, setHintLevel] = useState<number>(0); // 0 = none, 1..3
  const [solutionUnlocked, setSolutionUnlocked] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ passed: boolean; message: string } | null>(null);

  const { markExerciseComplete } = useProgress();
  const tierConfig = TIER_CONFIGS[exercise.tier] || TIER_CONFIGS.standard;

  // Swap to fresh seeded variant
  const handleShuffleVariant = () => {
    const nextSeed = variantSeed + 1;
    setVariantSeed(nextSeed);
    const variant = generateSeededVariant(initialExercise, nextSeed);
    setExercise(variant);
    setSelectedOptionId(null);
    setGapAnswers({});
    setFeedback(null);
    setIsCompleted(false);
    setScore(0);
    setSolutionUnlocked(false);
    setHintLevel(0);
  };

  const handleComplete = (awardedScore: number, passed: boolean, message: string) => {
    setIsCompleted(true);
    setScore(awardedScore);
    setFeedback({ passed, message });

    // Mark in persistent state
    markExerciseComplete(exercise.id, awardedScore);

    if (onGraded) {
      onGraded({
        exerciseId: exercise.id,
        isCompleted: true,
        score: awardedScore,
        unassisted: !solutionUnlocked && hintLevel <= 1,
        unlockedHintLevel: hintLevel,
        solutionUnlocked,
        attemptsCount: 1,
        feedback: { passed, message },
      });
    }
  };

  // Option selection for scenario-mcq / predict-output / explain-the-trace
  const handleSelectOption = (optionId: string) => {
    if (solutionUnlocked) return;
    setSelectedOptionId(optionId);
    const chosen = exercise.options?.find((o) => o.id === optionId);
    if (!chosen) return;

    if (chosen.isCorrect) {
      const awarded = solutionUnlocked ? Math.floor(exercise.points * 0.25) : exercise.points;
      handleComplete(awarded, true, chosen.explanation || 'Correct! Well reasoned.');
    } else {
      setFeedback({
        passed: false,
        message: chosen.explanation || 'Not quite right. Review the explanation and try again.',
      });
    }
  };

  // Verify fill the gaps
  const handleVerifyGaps = () => {
    if (!exercise.gaps) return;
    let correctCount = 0;
    exercise.gaps.forEach((g) => {
      const userVal = (gapAnswers[g.id] || '').trim().toLowerCase();
      if (userVal === g.correctAnswer.trim().toLowerCase()) {
        correctCount++;
      }
    });

    const allCorrect = correctCount === exercise.gaps.length;
    const awarded = allCorrect ? (solutionUnlocked ? Math.floor(exercise.points * 0.25) : exercise.points) : 0;

    handleComplete(
      awarded,
      allCorrect,
      allCorrect
        ? 'All blanks filled with valid Python keywords and syntax!'
        : `${correctCount} of ${exercise.gaps.length} blanks correct. Check case sensitivity and syntax.`
    );
  };

  // Progressive Hint Ladder click
  const handleRequestNextHint = () => {
    if (hintLevel < 3) {
      setHintLevel((prev) => prev + 1);
    }
  };

  const handleUnlockSolution = () => {
    setSolutionUnlocked(true);
    setHintLevel(3);
    setFeedback({
      passed: false,
      message: 'Worked solution unlocked. This exercise is logged as assisted practice.',
    });
  };

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-5 shadow-xs">
      {/* Header: Tier, Type, Points & Seed Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3.5">
        <div className="flex items-center gap-2">
          {/* Difficulty Tier Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${tierConfig.badgeClass}`}
          >
            <span>{tierConfig.icon}</span>
            <span>{tierConfig.label}</span>
          </span>

          {/* Exercise Type Pill */}
          <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-dim)]">
            {exercise.type.replace('-', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Seeded Variant Button */}
          <button
            onClick={handleShuffleVariant}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-[var(--accent-primary)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            title="Generate fresh parameterised variant"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Variant {variantSeed}</span>
          </button>

          {/* Points Pill */}
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/30">
            {score > 0 ? `${score} / ${exercise.points}` : `${exercise.points}`} pts
          </span>
        </div>
      </div>

      {/* Title & Prompt */}
      <div className="space-y-1.5">
        <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)]">{exercise.title}</h3>
        {exercise.contextScenario && (
          <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] text-xs text-[var(--text-muted)] leading-relaxed italic">
            {exercise.contextScenario}
          </div>
        )}
        <p className="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed font-normal">
          {exercise.prompt}
        </p>
      </div>

      {/* ================================================================= */}
      {/* 8 INTERACTIVE QUESTION BODIES                                      */}
      {/* ================================================================= */}

      {/* 1 & 2 & 8: Scenario MCQ / Predict Output / Explain the Trace */}
      {(exercise.type === 'scenario-mcq' ||
        exercise.type === 'predict-output' ||
        exercise.type === 'explain-the-trace') &&
        exercise.options && (
          <div className="space-y-2.5">
            {exercise.traceStepCode && (
              <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-main)] overflow-x-auto">
                <pre>{exercise.traceStepCode}</pre>
              </div>
            )}

            <div className="space-y-2">
              {exercise.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const showExplanation = isSelected || solutionUnlocked;

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? opt.isCorrect
                          ? 'border-emerald-500/40 bg-emerald-500/10'
                          : 'border-amber-500/40 bg-amber-500/10'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="font-mono text-xs font-bold text-[var(--text-dim)] shrink-0 mt-0.5">
                          {opt.id.toUpperCase()}.
                        </span>
                        <span className="text-xs font-mono text-[var(--text-main)] leading-snug">
                          {opt.text}
                        </span>
                      </div>
                      {isSelected && (
                        opt.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        )
                      )}
                    </div>

                    {showExplanation && (
                      <p
                        className={`mt-2 pt-2 border-t text-[11px] font-sans leading-relaxed ${
                          opt.isCorrect
                            ? 'border-emerald-500/20 text-emerald-200/90'
                            : 'border-amber-500/20 text-amber-200/90'
                        }`}
                      >
                        {opt.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      {/* 3 & 6: Fix the Bug & Write Code */}
      {(exercise.type === 'fix-the-bug' || exercise.type === 'write-code') && (
        <CodeRunnerExercise
          starterCode={exercise.starterCode || '# Write your Python solution here\n'}
          solutionCode={exercise.solutionCode}
          testCases={exercise.testCases}
          onComplete={(passed, details) => {
            const pts = passed
              ? solutionUnlocked
                ? Math.floor(exercise.points * 0.25)
                : exercise.points
              : 0;
            handleComplete(
              pts,
              passed,
              passed
                ? 'All automated test cases passed successfully in Pyodide!'
                : `Test runner completed: ${details?.passedCount || 0} of ${
                    details?.totalCount || 1
                  } passed.`
            );
          }}
        />
      )}

      {/* 4: Order the Lines (Parsons Reorder) */}
      {exercise.type === 'order-the-lines' && exercise.jumbledLines && (
        <ParsonsReorder
          initialLines={exercise.jumbledLines}
          correctOrder={exercise.correctLineOrder || []}
          onComplete={(passed) => {
            const pts = passed
              ? solutionUnlocked
                ? Math.floor(exercise.points * 0.25)
                : exercise.points
              : 0;
            handleComplete(
              pts,
              passed,
              passed
                ? 'Excellent! Instructions ordered in valid chronological sequence.'
                : 'Sequence is incorrect. Look at variable declaration order.'
            );
          }}
        />
      )}

      {/* 5: Fill the Gaps */}
      {exercise.type === 'fill-the-gaps' && exercise.gaps && (
        <div className="space-y-4">
          <div className="space-y-2.5">
            {exercise.gaps.map((gap, idx) => (
              <div
                key={gap.id}
                className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] flex flex-wrap items-center gap-2 font-mono text-xs"
              >
                <span className="text-[10px] text-[var(--text-dim)] font-sans">Blank {idx + 1}:</span>
                <span className="text-[var(--text-main)]">{gap.beforeText}</span>
                <input
                  type="text"
                  value={gapAnswers[gap.id] || ''}
                  onChange={(e) =>
                    setGapAnswers({ ...gapAnswers, [gap.id]: e.target.value })
                  }
                  placeholder="?"
                  className="w-28 px-2 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-center text-xs font-bold text-sky-400 focus:ring-1 focus:ring-[var(--accent-primary)]"
                />
                <span className="text-[var(--text-main)]">{gap.afterText}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleVerifyGaps}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] text-xs font-bold transition-colors"
          >
            <span>Verify Gaps</span>
          </button>
        </div>
      )}

      {/* 7: Theory Reasoning */}
      {exercise.type === 'theory-reasoning' && (
        <TheoryChecklist
          prompt={exercise.prompt}
          modelAnswer={exercise.modelAnswer}
          markingCriteria={exercise.markingCriteria}
          maxPoints={exercise.points}
          onScoreChange={(awarded, complete) => {
            if (complete) {
              handleComplete(
                solutionUnlocked ? Math.floor(awarded * 0.25) : awarded,
                awarded > 0,
                `Self-evaluation score: ${awarded} points recorded.`
              );
            }
          }}
        />
      )}

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            feedback.passed
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-amber-500/30 bg-amber-500/10 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.passed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          {isCompleted && (
            <span className="font-bold text-[var(--accent-primary)]">+{score} pts</span>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* PROGRESSIVE HINT LADDER (Section 10.2: 3 hints before solution)    */}
      {/* ================================================================= */}
      <div className="pt-3 border-t border-[var(--border-subtle)] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[var(--text-muted)] font-medium">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Hint Ladder ({hintLevel}/3 unlocked)</span>
          </div>

          <div className="flex items-center gap-2">
            {hintLevel < 3 && (
              <button
                onClick={handleRequestNextHint}
                className="text-[11px] text-[var(--accent-primary)] hover:underline flex items-center gap-1"
              >
                <span>Unlock Hint {hintLevel + 1}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}

            {hintLevel === 3 && !solutionUnlocked && (
              <button
                onClick={handleUnlockSolution}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                title="Worked solution unlocks but does not count as unassisted mastery"
              >
                <Unlock className="w-3 h-3" />
                <span>Reveal Worked Solution</span>
              </button>
            )}
          </div>
        </div>

        {/* Revealed Hints */}
        {hintLevel > 0 && (
          <div className="space-y-2">
            {exercise.hints.slice(0, hintLevel).map((h, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-200/90 text-xs flex items-start gap-2 animate-in fade-in"
              >
                <span className="font-bold text-amber-400 shrink-0 text-[11px]">Hint {i + 1}:</span>
                <span className="leading-relaxed">{h}</span>
              </div>
            ))}
          </div>
        )}

        {/* Worked Solution Reveal */}
        {solutionUnlocked && (
          <div className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-200 text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-300">Worked Solution (Assisted)</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                Assisted Practice
              </span>
            </div>
            <pre className="font-mono text-[11px] p-2.5 rounded bg-black/40 border border-purple-500/20 text-purple-200 whitespace-pre-wrap overflow-x-auto">
              {exercise.solutionCode || exercise.modelAnswer || 'See correct option highlighted above.'}
            </pre>
            <p className="text-[10px] text-purple-300/80 italic">
              Notice: Re-try with a new parameterised variant above to achieve unassisted mastery.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
