/**
 * Lesson Content Renderer & Subtopic Pager
 * Sections 3.3, 7.3 & 10.1: Renders lesson subtopics following the 10-step pedagogical journey:
 * Objectives, Concept, Code, Explain, Apply, Common Mistakes, Practise, and Source Note.
 */

import React, { useEffect } from 'react';
import {
  Bookmark,
  CheckCircle,
  Clock,
  ExternalLink,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Award,
  HelpCircle,
  FileCheck,
  Code,
  Briefcase,
  Play,
  FileCode,
  Sparkles,
  FileText,
  ListChecks,
} from 'lucide-react';
import { Subtopic, DayModule } from './types';
import { useProgress } from '../../store/progressContext';
import { useNavigation } from '../../store/navigationContext';
import { ExerciseCard } from '../exercises/ExerciseCard';
import { QuizModal } from '../exercises/QuizModal';
import { CheatSheetModal } from './CheatSheetModal';
import { ExerciseData, DayAssessmentData } from '../exercises/types';

interface Props {
  dayModule: DayModule;
  subtopic: Subtopic;
  subtopicIndex: number;
  totalSubtopics: number;
  onLoadCode?: (code: string) => void;
}

export const LessonRenderer: React.FC<Props> = ({
  dayModule,
  subtopic,
  subtopicIndex,
  totalSubtopics,
  onLoadCode,
}) => {
  const { activeDay, nextSubtopic, prevSubtopic, selectDay } = useNavigation();
  const {
    isSubtopicCompleted,
    toggleSubtopicCompleted,
    isSubtopicBookmarked,
    toggleBookmark,
    getNote,
    saveNote,
  } = useProgress();

  const isCompleted = isSubtopicCompleted(activeDay, subtopicIndex);
  const isBookmarked = isSubtopicBookmarked(activeDay, subtopicIndex);
  const userNote = getNote(activeDay, subtopicIndex);
  const [activeQuizData, setActiveQuizData] = React.useState<DayAssessmentData | null>(null);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = React.useState(false);

  // Keyboard navigation: [ for prev, ] for next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === '[') {
        e.preventDefault();
        prevSubtopic();
      } else if (e.key === ']') {
        e.preventDefault();
        nextSubtopic();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSubtopic, prevSubtopic]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 text-sm" style={{ maxWidth: 'var(--reading-max-width)' }}>
      {/* Title & Reading Metadata */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="eyebrow-label text-[10px] text-[var(--accent-primary)]">
            {dayModule.number === 0 ? 'WELCOME TOUR' : `DAY ${dayModule.number}`} • TOPIC {subtopicIndex + 1} OF {totalSubtopics}
          </div>
          <div className="flex items-center gap-2">
            {dayModule.cheatSheet && dayModule.cheatSheet.length > 0 && (
              <button
                onClick={() => setIsCheatSheetOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-main)] transition-colors shadow-xs"
                title="View Day Cheat Sheet"
              >
                <FileText className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>Cheat Sheet</span>
              </button>
            )}
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-dim)]">
              <Clock className="w-3.5 h-3.5" />
              <span>~{subtopic.estimatedMinutes} mins</span>
            </div>
          </div>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-[var(--text-main)] mb-1.5">
          {subtopic.title}
        </h1>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          {subtopic.summary}
        </p>
      </div>

      {/* 1. OBJECTIVES */}
      {dayModule.objectives && dayModule.objectives.length > 0 && subtopicIndex === 0 && (
        <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-2">
          <span className="eyebrow-label text-[10px] block text-[var(--text-dim)]">DAY OBJECTIVES</span>
          <ul className="text-xs space-y-1.5 text-[var(--text-muted)]">
            {dayModule.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[var(--accent-primary)] font-bold">✓</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 2. INTRODUCE (CONCEPT) */}
      <div className="space-y-3">
        <span className="eyebrow-label text-[10px] block text-[var(--accent-primary)]">
          1. INTRODUCE CONCEPT
        </span>
        <h2 className="text-base font-bold text-[var(--text-main)]">
          {subtopic.introduce.headline}
        </h2>
        {subtopic.introduce.paragraphs.map((p, idx) => (
          <p key={idx} className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            {p}
          </p>
        ))}

        {subtopic.introduce.keyTerms && (
          <div className="space-y-1.5 pt-1">
            <span className="eyebrow-label text-[10px] block text-[var(--text-dim)]">KEY VOCABULARY</span>
            {subtopic.introduce.keyTerms.map((kt) => (
              <div key={kt.term} className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-xs">
                <span className="font-bold text-[var(--text-main)]">{kt.term}: </span>
                <span className="text-[var(--text-muted)]">{kt.definition}</span>
              </div>
            ))}
          </div>
        )}

        {subtopic.introduce.bulletPoints && (
          <ul className="text-xs space-y-1 text-[var(--text-muted)] list-disc pl-5">
            {subtopic.introduce.bulletPoints.map((bp, i) => (
              <li key={i}>{bp}</li>
            ))}
          </ul>
        )}
      </div>

      {/* 3. WORKED EXAMPLE (CONNECT) */}
      {subtopic.code && subtopic.code.length > 0 && (
        <div className="space-y-2">
          <span className="eyebrow-label text-[10px] block text-emerald-400">
            2. WORKED CODE EXAMPLE
          </span>
          {subtopic.code.map((c, i) => (
            <div key={i} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] overflow-hidden">
              <div className="px-3 py-1.5 bg-[var(--bg-surface-elevated)] border-b border-[var(--border-subtle)] flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--text-main)]">{c.title}</span>
                <span className="badge-real-python px-2 py-0.5 rounded text-[10px] font-bold">
                  {c.runMode.toUpperCase()}
                </span>
              </div>
              <pre className="p-3 font-mono text-xs text-[var(--text-main)] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {c.code}
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* 4. EXPLAIN (Internal Python Cause & Effect) */}
      {subtopic.explain && subtopic.explain.length > 0 && (
        <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2.5">
          <span className="eyebrow-label text-[10px] block text-[var(--accent-primary)]">
            3. WHAT PYTHON DOES INTERNALLY
          </span>
          <div className="space-y-2">
            {subtopic.explain.map((exp) => (
              <div key={exp.step} className="text-xs space-y-0.5 border-l-2 border-[var(--accent-primary)] pl-2.5">
                <div className="font-mono text-[11px] text-sky-300 font-bold">
                  Line {exp.codeLine}: {exp.instruction}
                </div>
                <div className="text-[var(--text-muted)]">{exp.internalEffect}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. APPLY (Real-World Application) */}
      {subtopic.apply && (
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="eyebrow-label text-[10px] text-amber-400">
              4. PRACTICAL APPLICATION
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-[var(--bg-surface)] text-[var(--text-dim)]">
              {subtopic.apply.domain}
            </span>
          </div>
          <h4 className="text-xs font-bold text-[var(--text-main)]">{subtopic.apply.contextTitle}</h4>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">{subtopic.apply.scenario}</p>
        </div>
      )}

      {/* 6. COMMON MISTAKES */}
      {subtopic.commonMistakes && subtopic.commonMistakes.length > 0 && (
        <div className="p-4 rounded-xl border border-red-500/25 bg-red-500/5 space-y-2.5 text-xs">
          <span className="eyebrow-label text-[10px] block text-red-400">
            5. COMMON MISTAKES &amp; PITFALLS
          </span>
          {subtopic.commonMistakes.map((m, i) => (
            <div key={i} className="space-y-1 text-red-200/90">
              <div className="font-bold text-red-300">{m.label}</div>
              <p className="text-[11px]">{m.explanation}</p>
              {m.erroneousCode && (
                <div className="font-mono text-[11px] bg-black/40 p-2 rounded border border-red-500/20 text-red-300">
                  {m.erroneousCode}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 8. PRACTISE & CHALLENGES */}
      {subtopic.practise && subtopic.practise.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <span className="eyebrow-label text-[10px] text-[var(--accent-primary)] block">
              6. PRACTISE &amp; CHALLENGES ({subtopic.practise.length})
            </span>
            <span className="text-[10px] text-[var(--text-dim)]">Reasoning &amp; Application</span>
          </div>
          <div className="space-y-4">
            {subtopic.practise.map((ex) => {
              const exData: ExerciseData = {
                id: ex.id,
                title: (ex as any).title || `${ex.tier.toUpperCase()} Challenge: ${ex.type.replace('-', ' ')}`,
                type: ex.type,
                tier: ex.tier,
                points: ex.points,
                prompt: ex.prompt,
                contextScenario: (ex as any).contextScenario,
                options: ex.options,
                starterCode: ex.starterCode,
                solutionCode: ex.solutionCode,
                testCases: ex.testCases,
                jumbledLines: (ex as any).jumbledLines,
                correctLineOrder: (ex as any).correctLineOrder,
                gaps: (ex as any).gaps,
                modelAnswer: ex.modelAnswer,
                markingCriteria: (ex as any).markingCriteria,
                traceStepCode: (ex as any).traceStepCode,
                hints: ex.hints || ['Read the prompt carefully and consider edge cases.'],
              };
              return <ExerciseCard key={ex.id} exercise={exData} />;
            })}
          </div>
        </div>
      )}

      {/* SUBTOPIC CHECKPOINT ASSESSMENT */}
      {subtopic.assess && subtopic.assess.length > 0 && (
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="eyebrow-label text-[10px] text-emerald-400">
                TOPIC CHECKPOINT
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-dim)]">
              {subtopic.assess.length} Questions • 80% Pass
            </span>
          </div>

          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Test your understanding of this topic before moving on.
          </p>

          <button
            onClick={() =>
              setActiveQuizData({
                dayNumber: dayModule.number,
                title: `${dayModule.title} - ${subtopic.title}`,
                passingScorePercentage: 80,
                questions: subtopic.assess.map((q) => ({
                  id: q.id,
                  scenario: q.scenario,
                  question: q.question,
                  options: q.options,
                  points: q.points || 10,
                })),
              })
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] text-xs font-bold transition-colors shadow-xs"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Launch Topic Quiz ({subtopic.assess.length} Questions)</span>
          </button>
        </div>
      )}

      {/* FINAL SUBTOPIC SPECIAL SECTIONS: REAL-WORLD LABS, MINI-PROJECT & FULL DAY QUIZ */}
      {subtopicIndex === totalSubtopics - 1 && (
        <div className="space-y-6 pt-4 border-t border-[var(--border-subtle)]">
          {/* REAL-WORLD LABS */}
          {dayModule.realWorldLabs && dayModule.realWorldLabs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[var(--accent-primary)]" />
                <span className="eyebrow-label text-[10px] text-[var(--accent-primary)]">
                  REAL-WORLD LABS ({dayModule.realWorldLabs.length})
                </span>
              </div>

              <div className="space-y-4">
                {dayModule.realWorldLabs.map((lab) => (
                  <div
                    key={lab.id}
                    className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[var(--text-main)]">
                        {lab.title}
                      </h3>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--bg-app)] text-[var(--accent-primary)] border border-[var(--border-subtle)]">
                        {lab.domain}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {lab.description}
                    </p>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-[var(--text-dim)] font-mono">
                        <span>Starter Code</span>
                        {onLoadCode && (
                          <button
                            onClick={() => onLoadCode(lab.starterCode)}
                            className="text-[var(--accent-primary)] hover:underline flex items-center gap-1 font-sans text-xs"
                          >
                            <FileCode className="w-3.5 h-3.5" /> Load into Editor
                          </button>
                        )}
                      </div>
                      <pre className="p-3 rounded-xl bg-[var(--bg-code)] text-xs font-mono text-[var(--text-code)] overflow-x-auto border border-[var(--border-subtle)]">
                        {lab.starterCode}
                      </pre>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[11px] font-mono text-emerald-400">
                      <span className="text-[var(--text-dim)] block text-[10px] uppercase font-sans font-semibold mb-0.5">
                        Target Expected Output:
                      </span>
                      <pre className="whitespace-pre-wrap">{lab.targetOutput}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MINI PROJECT */}
          {dayModule.miniProject && (
            <div className="p-5 rounded-2xl border border-[var(--accent-primary)]/40 bg-[var(--accent-subtle)]/30 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
                  <span className="eyebrow-label text-[10px] text-[var(--accent-primary)]">
                    DAY {dayModule.number} MINI PROJECT
                  </span>
                </div>
                {onLoadCode && dayModule.miniProject.starterCode && (
                  <button
                    onClick={() => onLoadCode(dayModule.miniProject.starterCode)}
                    className="px-3 py-1 rounded-lg bg-[var(--accent-primary)] text-[var(--accent-on)] text-xs font-bold hover:bg-[var(--accent-hover)] transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Load Project Starter</span>
                  </button>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-[var(--text-main)] mb-1">
                  {dayModule.miniProject.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {dayModule.miniProject.brief}
                </p>
              </div>

              {/* Requirements Checklist */}
              <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
                <span className="text-[11px] font-bold text-[var(--text-main)] uppercase tracking-wider block">
                  Project Requirements
                </span>
                <ul className="text-xs space-y-1.5 text-[var(--text-muted)]">
                  {dayModule.miniProject.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rubric */}
              {dayModule.miniProject.rubric && dayModule.miniProject.rubric.length > 0 && (
                <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1.5">
                  <span className="text-[11px] font-bold text-[var(--text-main)] uppercase tracking-wider block">
                    Assessment Rubric
                  </span>
                  <div className="divide-y divide-[var(--border-subtle)] text-xs">
                    {dayModule.miniProject.rubric.map((r, i) => (
                      <div key={i} className="py-1.5 flex items-center justify-between text-[var(--text-muted)]">
                        <span>{r.criterion}</span>
                        <span className="font-mono font-bold text-[var(--accent-primary)]">{r.weight}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DAY 1 CHECKPOINT ASSESSMENT (10 QUESTIONS) */}
          {dayModule.dayQuiz && dayModule.dayQuiz.questions.length > 0 && (
            <div className="p-5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <span className="eyebrow-label text-[10px] text-emerald-400">
                    DAY {dayModule.number} COMPREHENSIVE QUIZ
                  </span>
                </div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  {dayModule.dayQuiz.questions.length} Questions • 80% to Pass
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[var(--text-main)] mb-1">
                  {dayModule.dayQuiz.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Evaluate your complete mastery of Day {dayModule.number} with scenario-based reasoning questions, error diagnosis, and mental execution traces.
                </p>
              </div>

              <button
                onClick={() =>
                  setActiveQuizData({
                    dayNumber: dayModule.number,
                    title: dayModule.dayQuiz.title,
                    passingScorePercentage: dayModule.dayQuiz.passingScorePercentage || 80,
                    questions: dayModule.dayQuiz.questions.map((q) => ({
                      id: q.id,
                      scenario: q.scenario,
                      question: q.question,
                      codeSnippet: q.codeSnippet,
                      options: q.options,
                      points: q.points || 10,
                    })),
                  })
                }
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <FileCheck className="w-4 h-4" />
                <span>Launch Day {dayModule.number} Assessment ({dayModule.dayQuiz.questions.length} Questions)</span>
              </button>
            </div>
          )}

          {/* DAY SUMMARY CARD (Section 13.2 & 13.5) */}
          <div className="p-5 rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-surface)] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-[var(--accent-primary)]" />
                <span className="eyebrow-label text-[10px] text-[var(--accent-primary)]">
                  DAY {dayModule.number} COMPLETE SUMMARY
                </span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold">
                {totalSubtopics} Subtopics • ~{dayModule.estimatedMinutes} Mins Mastered
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-[var(--text-main)] mb-1">
                Day {dayModule.number} Mastery Checklist &amp; Knowledge Wrap-up
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {dayModule.number === 3
                  ? 'Congratulations on finishing Day 3! You have mastered arithmetic, relational, boolean logic, short-circuiting, object identity (is) vs equality (==), and operator precedence.'
                  : dayModule.number === 2
                  ? 'Congratulations on finishing Day 2! You have mastered variables as name-to-object bindings, dynamic typing, type inspection, safe conversions, and essential built-in functions.'
                  : `Congratulations on finishing Day ${dayModule.number}! You have progressed through the 10-step pedagogical journey from Python's execution architecture to diagnosing real tracebacks.`}
              </p>
            </div>

            {/* Concepts Mastered */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-2">
              <span className="text-[11px] font-bold text-[var(--text-main)] uppercase tracking-wider block">
                Core Competencies Acquired
              </span>
              <ul className="text-xs space-y-2 text-[var(--text-muted)]">
                {dayModule.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vocabulary Recap */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[var(--text-main)] uppercase tracking-wider block">
                Key Technical Vocabulary
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {dayModule.number === 3 ? (
                  <>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">Boolean Truthiness</div>
                      <div className="text-[var(--text-muted)] text-[11px]">All objects evaluate to boolean; 0, None, and empty sequences are falsy.</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">Float Division (/)</div>
                      <div className="text-[var(--text-muted)] text-[11px]">Python 3 / always produces a float (8 / 4 = 2.0).</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">Negative Floor Division (//)</div>
                      <div className="text-[var(--text-muted)] text-[11px]">Rounds towards -∞: -7 // 2 = -4 (not -3!).</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">Modulus Law (%)</div>
                      <div className="text-[var(--text-muted)] text-[11px]">Remainder adheres to r = a - (a // b) * b.</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">Right-Associative (**)</div>
                      <div className="text-[var(--text-muted)] text-[11px]">Powers group right-to-left: 2 ** 3 ** 2 == 512.</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">Chained Comparisons</div>
                      <div className="text-[var(--text-muted)] text-[11px]">18 &lt;= age &lt;= 65 evaluates both bounds without repeating operands.</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">Short-Circuiting</div>
                      <div className="text-[var(--text-muted)] text-[11px]">and and or halt early and return deciding operand values.</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">Identity (is) vs Equality (==)</div>
                      <div className="text-[var(--text-muted)] text-[11px]">is checks memory id(); == checks value equality. Use is for None.</div>
                    </div>
                  </>
                ) : dayModule.number === 2 ? (
                  <>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">Object &amp; Pointer Binding</div>
                      <div className="text-[var(--text-muted)] text-[11px]">Variables store pointer references to objects in heap memory, not data boxes.</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">Shared Reference (Aliasing)</div>
                      <div className="text-[var(--text-muted)] text-[11px]">Multiple names referencing the identical memory address (id(a) == id(b)).</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">Atomic Multi-Assignment</div>
                      <div className="text-[var(--text-muted)] text-[11px]">RHS expressions evaluate into an ephemeral tuple before LHS bindings occur.</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">Decimal Truncation</div>
                      <div className="text-[var(--text-muted)] text-[11px]">int() truncates floats towards zero without rounding; int("3.5") raises ValueError.</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">Subclass Hierarchy</div>
                      <div className="text-[var(--text-muted)] text-[11px]">bool is a subclass of int (issubclass(bool, int) is True), inheriting integer math.</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">Pure Functions vs In-Place</div>
                      <div className="text-[var(--text-muted)] text-[11px]">sorted() returns a brand new list; list.sort() mutates in place returning None.</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">stdout vs Return Value</div>
                      <div className="text-[var(--text-muted)] text-[11px]">print() transmits characters to sys.stdout and always returns None.</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">Identifier &amp; Keyword Rules</div>
                      <div className="text-[var(--text-muted)] text-[11px]">Names must be valid identifiers and never match any of the 35 reserved keywords.</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">CPython &amp; Bytecode</div>
                      <div className="text-[var(--text-muted)] text-[11px]">Source code compiles to intermediate bytecode (.pyc) before execution.</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">PVM (Python Virtual Machine)</div>
                      <div className="text-[var(--text-muted)] text-[11px]">The runtime loop executing bytecode instructions sequentially.</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">REPL / Shell</div>
                      <div className="text-[var(--text-muted)] text-[11px]">Read-Eval-Print Loop (&gt;&gt;&gt;) for rapid interactive line exploration.</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">Significant Whitespace</div>
                      <div className="text-[var(--text-muted)] text-[11px]">PEP 8 4-space indentation defines block scope without curly braces.</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">Dynamic Typing</div>
                      <div className="text-[var(--text-muted)] text-[11px]">Types belong to objects at runtime; variables are names bound to values.</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                      <div className="font-bold text-[var(--text-main)]">Traceback Anatomy</div>
                      <div className="text-[var(--text-muted)] text-[11px]">Read bottom-to-top: exception on the bottom line, source line directly above.</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Open Cheat Sheet Button */}
            {dayModule.cheatSheet && dayModule.cheatSheet.length > 0 && (
              <button
                onClick={() => setIsCheatSheetOpen(true)}
                className="w-full py-2.5 rounded-xl border border-[var(--accent-primary)] bg-[var(--accent-subtle)]/50 hover:bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open Day {dayModule.number} Quick-Reference Cheat Sheet ({dayModule.cheatSheet.length} Cards)</span>
              </button>
            )}
          </div>

          {/* NEXT UP PREVIEW (Section 13.2) */}
          {dayModule.number === 1 ? (
            <div className="p-5 rounded-2xl border border-[var(--accent-primary)]/40 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--accent-subtle)]/20 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="eyebrow-label text-[10px] text-[var(--accent-primary)]">
                  NEXT UP IN 30 DAYS OF PYTHON
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--bg-app)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                  BEGINNER • 90 MINS
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[var(--text-main)] mb-1">
                  Day 2 — Variables and Built-in Functions ★
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Take the next major step in your programming journey. In Day 2, you will dissect how Python binds names to objects in memory, explore dynamic reassignment, inspect types with <code className="text-[var(--accent-primary)]">type()</code>, master type casting, and harness standard built-in functions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--text-muted)] pt-1">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-app)]/80 border border-[var(--border-subtle)]">
                  <span className="text-[var(--accent-primary)] font-bold">→</span>
                  <span>Name-to-Object Binding Visualisation</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-app)]/80 border border-[var(--border-subtle)]">
                  <span className="text-[var(--accent-primary)] font-bold">→</span>
                  <span>Dynamic Type Conversion &amp; Errors</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-app)]/80 border border-[var(--border-subtle)]">
                  <span className="text-[var(--accent-primary)] font-bold">→</span>
                  <span>15+ Core Built-in Functions</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-app)]/80 border border-[var(--border-subtle)]">
                  <span className="text-[var(--accent-primary)] font-bold">→</span>
                  <span>Mutable References &amp; Aliasing Traps</span>
                </div>
              </div>

              <button
                onClick={() => selectDay(2)}
                className="w-full mt-2 py-3 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <span>Continue to Day 2: Variables &amp; Built-in Functions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : dayModule.number === 2 ? (
            <div className="p-5 rounded-2xl border border-[var(--accent-primary)]/40 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--accent-subtle)]/20 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="eyebrow-label text-[10px] text-[var(--accent-primary)]">
                  NEXT UP IN 30 DAYS OF PYTHON
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--bg-app)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                  BEGINNER • 60 MINS
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[var(--text-main)] mb-1">
                  Day 3 — Operators (Arithmetic, Comparison &amp; Logical) ★
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Deepen your computational skills. In Day 3, you will explore arithmetic, comparison, logical, assignment, identity, and membership operators, construct truth tables, and build real-world calculators.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--text-muted)] pt-1">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-app)]/80 border border-[var(--border-subtle)]">
                  <span className="text-[var(--accent-primary)] font-bold">→</span>
                  <span>Arithmetic &amp; Floor Division Nuances</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-app)]/80 border border-[var(--border-subtle)]">
                  <span className="text-[var(--accent-primary)] font-bold">→</span>
                  <span>Comparison &amp; Boolean Truth Tables</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-app)]/80 border border-[var(--border-subtle)]">
                  <span className="text-[var(--accent-primary)] font-bold">→</span>
                  <span>Logical Operators: and, or, not Short-Circuiting</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-app)]/80 border border-[var(--border-subtle)]">
                  <span className="text-[var(--accent-primary)] font-bold">→</span>
                  <span>Identity (is) vs Equality (==) Internals</span>
                </div>
              </div>

              <button
                onClick={() => selectDay(3)}
                className="w-full mt-2 py-3 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <span>Continue to Day 3: Operators</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : dayModule.number === 3 ? (
            <div className="p-5 rounded-2xl border border-[var(--accent-primary)]/40 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--accent-subtle)]/20 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="eyebrow-label text-[10px] text-[var(--accent-primary)]">
                  NEXT UP IN 30 DAYS OF PYTHON
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--bg-app)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                  BEGINNER • 75 MINS
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[var(--text-main)] mb-1">
                  Day 4 — Strings (Formatting, Slicing &amp; Methods) ★
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Deepen your text processing capabilities. In Day 4, you will master string immutability, character indexing grids, slicing notation [start:stop:step], modern f-string interpolation, escape characters, and 20+ built-in string methods.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--text-muted)] pt-1">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-app)]/80 border border-[var(--border-subtle)]">
                  <span className="text-[var(--accent-primary)] font-bold">→</span>
                  <span>String Immutability &amp; Index Grid</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-app)]/80 border border-[var(--border-subtle)]">
                  <span className="text-[var(--accent-primary)] font-bold">→</span>
                  <span>Slice Notation: [start:stop:step]</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-app)]/80 border border-[var(--border-subtle)]">
                  <span className="text-[var(--accent-primary)] font-bold">→</span>
                  <span>Modern f-string Formatting &amp; Floats</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-app)]/80 border border-[var(--border-subtle)]">
                  <span className="text-[var(--accent-primary)] font-bold">→</span>
                  <span>20+ Built-in Methods (.split, .join, .strip)</span>
                </div>
              </div>

              <button
                onClick={() => selectDay(4)}
                className="w-full mt-2 py-3 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <span>Continue to Day 4: Strings</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-5 rounded-2xl border border-[var(--accent-primary)]/40 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--accent-subtle)]/20 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="eyebrow-label text-[10px] text-[var(--accent-primary)]">
                  NEXT UP IN 30 DAYS OF PYTHON
                </span>
              </div>
              <h3 className="text-base font-bold text-[var(--text-main)] mb-1">
                Day {dayModule.number + 1}
              </h3>
              <button
                onClick={() => selectDay(dayModule.number + 1)}
                className="w-full mt-2 py-3 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <span>Continue to Day {dayModule.number + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quiz Modal */}
      {activeQuizData && (
        <QuizModal
          assessment={activeQuizData}
          onClose={() => setActiveQuizData(null)}
        />
      )}

      {/* Cheat Sheet Modal */}
      {isCheatSheetOpen && dayModule.cheatSheet && (
        <CheatSheetModal
          dayNumber={dayModule.number}
          dayTitle={dayModule.title}
          blocks={dayModule.cheatSheet}
          isOpen={isCheatSheetOpen}
          onClose={() => setIsCheatSheetOpen(false)}
          onLoadCode={onLoadCode}
        />
      )}

      {/* 7. SOURCE NOTE */}
      <div className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[11px] text-[var(--text-dim)] space-y-1">
        <div className="font-semibold text-[var(--text-muted)]">Source Note &amp; Attribution</div>
        <p>
          Derived from Asabeneh Yetayeh's <em>30 Days of Python</em> curriculum with original visual enhancements.
        </p>
        <a
          href={dayModule.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent-primary)] hover:underline inline-block pt-0.5"
        >
          View repository source →
        </a>
      </div>

      {/* Personal Notes */}
      <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
        <span className="eyebrow-label text-[10px] block">MY PERSONAL NOTES</span>
        <textarea
          value={userNote}
          onChange={(e) => saveNote(activeDay, subtopicIndex, e.target.value)}
          placeholder="Type notes and reminders for this topic (autosaved)..."
          className="w-full h-20 p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-dim)] focus:ring-1 focus:ring-[var(--accent-primary)] resize-none"
        />
      </div>

      {/* Subtopic Pager Navigation Bar */}
      <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
        <button
          onClick={prevSubtopic}
          disabled={subtopicIndex === 0 && activeDay === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] text-xs font-semibold text-[var(--text-main)] disabled:opacity-40 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous ([)</span>
        </button>

        <button
          onClick={() => toggleSubtopicCompleted(activeDay, subtopicIndex)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
            isCompleted
              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
              : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
        </button>

        <button
          onClick={nextSubtopic}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] text-xs font-bold shadow-md transition-colors"
        >
          <span>Next (])</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
