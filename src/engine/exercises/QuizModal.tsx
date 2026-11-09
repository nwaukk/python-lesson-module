/**
 * Day Assessment & Quiz Checkpoint Runner
 * Section 10.2: 10 scenario-based questions, genuine misconception distractors,
 * 80% passing threshold, detailed rationale review, and progress persistence.
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Clock,
  Sparkles,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import { DayAssessmentData, AssessmentQuestion } from './types';
import { useProgress } from '../../store/progressContext';

interface Props {
  assessment: DayAssessmentData;
  onClose: () => void;
}

export const QuizModal: React.FC<Props> = ({ assessment, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [reviewMode, setReviewMode] = useState<boolean>(false);

  const { markQuizComplete } = useProgress();

  const totalQuestions = assessment.questions.length;
  const currentQuestion: AssessmentQuestion = assessment.questions[currentQuestionIndex];

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleCalculateScore = () => {
    let correctCount = 0;
    assessment.questions.forEach((q) => {
      const selected = answers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect);
      if (selected && correctOpt && selected === correctOpt.id) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    setIsSubmitted(true);
    markQuizComplete(assessment.dayNumber, percentage);
  };

  const scorePercentage = isSubmitted
    ? Math.round(
        (assessment.questions.filter((q) => {
          const selected = answers[q.id];
          const correctOpt = q.options.find((o) => o.isCorrect);
          return selected && correctOpt && selected === correctOpt.id;
        }).length /
          totalQuestions) *
          100
      )
    : 0;

  const passed = scorePercentage >= assessment.passingScorePercentage;

  const handleResetQuiz = () => {
    setAnswers({});
    setIsSubmitted(false);
    setReviewMode(false);
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-3xl max-h-[90vh] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-between">
          <div>
            <span className="eyebrow-label text-[10px] text-[var(--accent-primary)] block">
              DAY {assessment.dayNumber} CHECKPOINT QUIZ
            </span>
            <h2 className="text-sm sm:text-base font-bold text-[var(--text-main)]">
              {assessment.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
              Pass: {assessment.passingScorePercentage}%
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[var(--border-subtle)] text-[var(--text-dim)] hover:text-[var(--text-main)]"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {!isSubmitted ? (
            /* Question Active Answering Mode */
            <div className="space-y-5">
              {/* Question Progress Bar & Index */}
              <div className="flex items-center justify-between text-xs text-[var(--text-dim)] font-mono">
                <span>
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <span>
                  {Object.keys(answers).length} of {totalQuestions} Answered
                </span>
              </div>
              <div className="h-1.5 w-full bg-[var(--border-subtle)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent-primary)] transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                  }}
                />
              </div>

              {/* Scenario Context */}
              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] text-xs text-[var(--text-muted)] leading-relaxed italic">
                {currentQuestion.scenario}
              </div>

              {/* Question Prompt */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[var(--text-main)]">
                  {currentQuestion.question}
                </h3>
                {currentQuestion.codeSnippet && (
                  <pre className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-sky-300 overflow-x-auto">
                    {currentQuestion.codeSnippet}
                  </pre>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelectOption(currentQuestion.id, opt.id);
                        }
                      }}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={0}
                      className={`w-full text-left p-3.5 rounded-xl border cursor-pointer flex items-center justify-between gap-3 text-xs font-mono transition-all ${
                        isSelected
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-main)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-center font-bold text-[var(--text-dim)]">
                          {opt.id.toUpperCase()}.
                        </span>
                        <span>{opt.text}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--accent-on)]'
                            : 'border-[var(--border-subtle)]'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Results & Review Mode */
            <div className="space-y-6 animate-in fade-in">
              <div
                className={`p-6 rounded-2xl border text-center space-y-3 ${
                  passed
                    ? 'border-emerald-500/40 bg-emerald-500/10'
                    : 'border-amber-500/40 bg-amber-500/10'
                }`}
              >
                <div className="flex justify-center">
                  {passed ? (
                    <Award className="w-12 h-12 text-emerald-400" />
                  ) : (
                    <XCircle className="w-12 h-12 text-amber-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-main)]">
                    {passed ? 'Checkpoint Passed!' : 'Requires Review'}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {passed
                      ? `Congratulations! You scored ${scorePercentage}%, meeting the 80% passing threshold.`
                      : `You scored ${scorePercentage}%. Review the misconception breakdowns below and retry.`}
                  </p>
                </div>
              </div>

              {/* Review Section */}
              <div className="space-y-4">
                <span className="eyebrow-label text-[10px] block text-[var(--text-dim)]">
                  DETAILED QUESTION BREAKDOWN
                </span>
                {assessment.questions.map((q, idx) => {
                  const userAnsId = answers[q.id];
                  const userOpt = q.options.find((o) => o.id === userAnsId);
                  const isCorrect = userOpt?.isCorrect ?? false;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border space-y-2 text-xs ${
                        isCorrect
                          ? 'border-emerald-500/25 bg-emerald-500/5'
                          : 'border-red-500/25 bg-red-500/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--text-main)]">
                          Q{idx + 1}: {q.question}
                        </span>
                        {isCorrect ? (
                          <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-400 font-bold text-[11px]">
                            <XCircle className="w-3.5 h-3.5" /> Incorrect
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)]">
                        Your answer: <code className="font-mono text-sky-300">{userOpt?.text || '(Unanswered)'}</code>
                      </div>
                      <div className="p-2.5 rounded bg-black/30 border border-white/5 text-[11px] text-[var(--text-main)] leading-relaxed">
                        <span className="font-bold text-[var(--text-dim)] block mb-0.5">Rationale:</span>
                        {userOpt?.explanation || q.options.find((o) => o.isCorrect)?.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="px-5 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-between">
          {!isSubmitted ? (
            <>
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] text-xs font-bold transition-colors"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleCalculateScore}
                  disabled={Object.keys(answers).length < totalQuestions}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md disabled:opacity-40 transition-colors"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Submit Quiz</span>
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                onClick={handleResetQuiz}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] text-xs font-bold transition-colors"
              >
                <span>Done</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
