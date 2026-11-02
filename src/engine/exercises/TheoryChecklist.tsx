/**
 * TheoryChecklist Component
 * Section 10.2: Supports theory-reasoning questions with a written answer area,
 * official model answer reveal, and self-assessment marking criteria.
 */

import React, { useState } from 'react';
import { CheckSquare, Square, Eye, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';

interface Props {
  prompt: string;
  modelAnswer?: string;
  markingCriteria?: { id: string; label: string; points: number }[];
  maxPoints: number;
  onScoreChange: (awardedPoints: number, isComplete: boolean) => void;
}

export const TheoryChecklist: React.FC<Props> = ({
  prompt,
  modelAnswer = 'The Python interpreter evaluates instructions sequentially, allocating memory for distinct objects and binding names within the active execution frame.',
  markingCriteria = [
    { id: 'crit-1', label: 'Mentions variable-to-object binding or reference assignment', points: 3 },
    { id: 'crit-2', label: 'Explains whether the data type is mutable or immutable', points: 4 },
    { id: 'crit-3', label: 'Identifies the correct execution outcome or error state', points: 3 },
  ],
  maxPoints,
  onScoreChange,
}) => {
  const [learnerResponse, setLearnerResponse] = useState<string>('');
  const [solutionRevealed, setSolutionRevealed] = useState<boolean>(false);
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({});

  const toggleCriterion = (id: string, pts: number) => {
    const updated = { ...checkedCriteria, [id]: !checkedCriteria[id] };
    setCheckedCriteria(updated);

    // Calculate total score
    let total = 0;
    markingCriteria.forEach((c) => {
      if (updated[c.id]) total += c.points;
    });

    const isComplete = Object.values(updated).some(Boolean);
    onScoreChange(Math.min(total, maxPoints), isComplete);
  };

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Learner Reasoning Input */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-[var(--text-muted)] flex items-center justify-between">
          <span>Your Reasoning &amp; Explanation:</span>
          <span className="text-[10px] text-[var(--text-dim)] font-normal">
            Type your explanation before revealing the model answer
          </span>
        </label>
        <textarea
          value={learnerResponse}
          onChange={(e) => setLearnerResponse(e.target.value)}
          placeholder="Explain Python's internal behaviour, why this occurs, and what the runtime does..."
          rows={4}
          className="w-full p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-main)] placeholder:text-[var(--text-dim)] text-xs focus:ring-1 focus:ring-[var(--accent-primary)] resize-y leading-relaxed"
        />
      </div>

      {/* Reveal Model Answer Button */}
      {!solutionRevealed ? (
        <button
          onClick={() => setSolutionRevealed(true)}
          disabled={learnerResponse.trim().length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] text-[var(--text-main)] text-xs font-semibold disabled:opacity-40 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          <span>Reveal Model Answer &amp; Self-Marking Rubric</span>
        </button>
      ) : (
        <div className="space-y-4 animate-in fade-in">
          {/* Model Answer Box */}
          <div className="p-4 rounded-xl border border-sky-500/25 bg-sky-500/5 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
              <BookOpen className="w-4 h-4" />
              <span>Official Model Answer</span>
            </div>
            <p className="text-xs text-[var(--text-main)] leading-relaxed whitespace-pre-wrap">
              {modelAnswer}
            </p>
          </div>

          {/* Self-Assessment Marking Rubric */}
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="eyebrow-label text-[10px] text-[var(--accent-primary)]">
                SELF-ASSESSMENT MARKING RUBRIC
              </span>
              <span className="text-[11px] text-[var(--text-muted)] font-mono">
                Checked Points: {Object.keys(checkedCriteria).filter((k) => checkedCriteria[k]).reduce((acc, k) => {
                  const crit = markingCriteria.find((c) => c.id === k);
                  return acc + (crit?.points || 0);
                }, 0)} / {maxPoints}
              </span>
            </div>

            <div className="space-y-2">
              {markingCriteria.map((c) => {
                const isChecked = !!checkedCriteria[c.id];
                return (
                  <div
                    key={c.id}
                    onClick={() => toggleCriterion(c.id, c.points)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                      isChecked
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-[var(--text-dim)] shrink-0" />
                      )}
                      <span className="text-xs">{c.label}</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[var(--accent-primary)] shrink-0">
                      +{c.points} pts
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
