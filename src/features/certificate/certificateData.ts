/**
 * Certificate Data & 30-Day Progress Aggregator
 * Computes per-day and level-by-level progress summaries across all 30 days
 * for live preview and PDF completion certificate generation.
 */

import { COURSE_DAYS_MANIFEST, DayManifestItem } from '../../data/manifest';
import { getDayModule } from '../../engine/lesson/dayLoader';
import { UserProgress } from '../../store/progressContext';

export type DayLevel = DayManifestItem['level'];

export interface DayProgressRow {
  day: number;
  title: string;
  level: DayLevel;
  subtopicsCompleted: number;
  subtopicsTotal: number;
  exercisesCompleted: number;
  exercisesTotal: number;
  quizScore: number | null;
  quizPassed: boolean;
  dayCompleted: boolean;
  status: 'completed' | 'in-progress' | 'not-started';
}

export interface LevelProgressSummary {
  level: DayLevel;
  label: string;
  dayRange: string;
  daysTotal: number;
  daysCompleted: number;
  subtopicsCompleted: number;
  subtopicsTotal: number;
  exercisesCompleted: number;
  exercisesTotal: number;
  quizzesPassed: number;
  averageQuizScore: number | null;
}

export interface CertificateSummary {
  recipientName: string;
  trackFocus: string;
  certificateId: string;
  issuedDateIso: string;
  issuedDateFormatted: string;
  daysCompleted: number;
  daysTotal: number;
  subtopicsCompleted: number;
  subtopicsTotal: number;
  overallCompletionPercentage: number;
  exercisesCompleted: number;
  exercisesTotal: number;
  averageExerciseScore: number | null;
  quizzesCompleted: number;
  quizzesPassed: number;
  averageQuizScore: number | null;
  streakDays: number;
  notesCount: number;
  bookmarksCount: number;
  isFullCompletion: boolean;
  levelBreakdown: LevelProgressSummary[];
  days: DayProgressRow[];
}

export const CERTIFICATE_TRACK_OPTIONS = [
  'Full 30-Day Python Mastery',
  'Backend Engineering & REST APIs',
  'Data Science & Analytics Pipelines',
  'Python Foundations & OOP Architecture',
] as const;

export function formatDisplayDate(isoDate: string): string {
  const parsed = new Date(`${isoDate.slice(0, 10)}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function generateCertificateId(
  recipientName: string,
  issuedDateIso: string,
  subtopicsCompleted: number,
  daysCompleted: number
): string {
  const seed = `${recipientName.trim().toLowerCase()}|${issuedDateIso}|${subtopicsCompleted}|${daysCompleted}`;
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const hex = (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
  const dateTag = issuedDateIso.slice(0, 10).replace(/-/g, '');
  return `PVL-${dateTag}-${hex.slice(0, 6)}`;
}

export function buildCertificateSummary(
  progress: UserProgress,
  recipientName: string,
  trackFocus: string = CERTIFICATE_TRACK_OPTIONS[0],
  issuedDateIso: string = new Date().toISOString().slice(0, 10)
): CertificateSummary {
  const cleanName = recipientName.trim() || 'Python Visual Lab Learner';

  const days: DayProgressRow[] = COURSE_DAYS_MANIFEST.map((manifestDay) => {
    const dayModule = getDayModule(manifestDay.number);
    const subtopicsTotal = dayModule ? dayModule.subtopics.length : manifestDay.subtopicsCount;

    let subtopicsCompleted = 0;
    for (let idx = 0; idx < subtopicsTotal; idx++) {
      if (progress.completedSubtopics.includes(`${manifestDay.number}_${idx}`)) {
        subtopicsCompleted++;
      }
    }

    const dayExerciseIds = dayModule
      ? dayModule.subtopics.flatMap((sub) => (sub.practise || []).map((ex) => ex.id))
      : [];
    const exercisesTotal = dayExerciseIds.length;
    const exercisesCompleted = dayExerciseIds.filter(
      (id) => progress.exerciseScores[id] !== undefined
    ).length;

    const rawQuiz = progress.quizScores[manifestDay.number];
    const quizScore = typeof rawQuiz === 'number' ? rawQuiz : null;
    const passingThreshold = dayModule?.dayQuiz?.passingScorePercentage ?? 80;
    const quizPassed = quizScore !== null && quizScore >= passingThreshold;

    const explicitDayDone = progress.completedDays.includes(manifestDay.number);
    const allSubtopicsDone = subtopicsTotal > 0 && subtopicsCompleted >= subtopicsTotal;
    const dayCompleted = explicitDayDone || allSubtopicsDone;

    let status: DayProgressRow['status'] = 'not-started';
    if (dayCompleted) {
      status = 'completed';
    } else if (subtopicsCompleted > 0 || exercisesCompleted > 0 || quizScore !== null) {
      status = 'in-progress';
    }

    return {
      day: manifestDay.number,
      title: manifestDay.title,
      level: manifestDay.level,
      subtopicsCompleted,
      subtopicsTotal,
      exercisesCompleted,
      exercisesTotal,
      quizScore,
      quizPassed,
      dayCompleted,
      status,
    };
  });

  const daysCompleted = days.filter((d) => d.dayCompleted).length;
  const daysTotal = days.length;
  const subtopicsCompleted = days.reduce((acc, d) => acc + d.subtopicsCompleted, 0);
  const subtopicsTotal = days.reduce((acc, d) => acc + d.subtopicsTotal, 0);
  const overallCompletionPercentage =
    subtopicsTotal > 0 ? Math.min(100, Math.round((subtopicsCompleted / subtopicsTotal) * 100)) : 0;

  const exercisesCompleted = days.reduce((acc, d) => acc + d.exercisesCompleted, 0);
  const exercisesTotal = days.reduce((acc, d) => acc + d.exercisesTotal, 0);
  const scoredExercises = Object.values(progress.exerciseScores).filter((v) => typeof v === 'number');
  const averageExerciseScore =
    scoredExercises.length > 0
      ? Math.round(scoredExercises.reduce((a, b) => a + b, 0) / scoredExercises.length)
      : null;

  const quizRows = days.filter((d) => d.quizScore !== null);
  const quizzesCompleted = quizRows.length;
  const quizzesPassed = days.filter((d) => d.quizPassed).length;
  const averageQuizScore =
    quizRows.length > 0
      ? Math.round(quizRows.reduce((acc, d) => acc + (d.quizScore || 0), 0) / quizRows.length)
      : null;

  const levelMeta: { level: DayLevel; label: string; dayRange: string }[] = [
    { level: 'beginner', label: 'Level 1: Foundations', dayRange: 'Days 1–8' },
    { level: 'intermediate', label: 'Level 2: Core Engineering', dayRange: 'Days 9–20' },
    { level: 'advanced', label: 'Level 3: Applied Systems', dayRange: 'Days 21–30' },
  ];

  const levelBreakdown: LevelProgressSummary[] = levelMeta.map((meta) => {
    const levelDays = days.filter((d) => d.level === meta.level);
    const levelQuizzes = levelDays.filter((d) => d.quizScore !== null);
    return {
      level: meta.level,
      label: meta.label,
      dayRange: meta.dayRange,
      daysTotal: levelDays.length,
      daysCompleted: levelDays.filter((d) => d.dayCompleted).length,
      subtopicsCompleted: levelDays.reduce((acc, d) => acc + d.subtopicsCompleted, 0),
      subtopicsTotal: levelDays.reduce((acc, d) => acc + d.subtopicsTotal, 0),
      exercisesCompleted: levelDays.reduce((acc, d) => acc + d.exercisesCompleted, 0),
      exercisesTotal: levelDays.reduce((acc, d) => acc + d.exercisesTotal, 0),
      quizzesPassed: levelDays.filter((d) => d.quizPassed).length,
      averageQuizScore:
        levelQuizzes.length > 0
          ? Math.round(
              levelQuizzes.reduce((acc, d) => acc + (d.quizScore || 0), 0) / levelQuizzes.length
            )
          : null,
    };
  });

  const notesCount = Object.values(progress.notes).filter((n) => n && n.trim().length > 0).length;
  const bookmarksCount = progress.bookmarks.length;

  return {
    recipientName: cleanName,
    trackFocus,
    certificateId: generateCertificateId(cleanName, issuedDateIso, subtopicsCompleted, daysCompleted),
    issuedDateIso,
    issuedDateFormatted: formatDisplayDate(issuedDateIso),
    daysCompleted,
    daysTotal,
    subtopicsCompleted,
    subtopicsTotal,
    overallCompletionPercentage,
    exercisesCompleted,
    exercisesTotal,
    averageExerciseScore,
    quizzesCompleted,
    quizzesPassed,
    averageQuizScore,
    streakDays: progress.streakDays,
    notesCount,
    bookmarksCount,
    isFullCompletion: daysCompleted === daysTotal && subtopicsCompleted === subtopicsTotal,
    levelBreakdown,
    days,
  };
}
