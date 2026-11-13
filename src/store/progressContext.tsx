/**
 * Progress, Notes, Bookmarks & State Persistence Context
 * Fully compliant with Section 7.4 & 11.
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { storage } from './storageAdapter';
import { COURSE_DAYS_MANIFEST } from '../data/manifest';

const TOTAL_COURSE_SUBTOPICS = COURSE_DAYS_MANIFEST.reduce((acc, day) => acc + day.subtopicsCount, 0);

function getDaySubtopicCount(dayNumber: number): number {
  return COURSE_DAYS_MANIFEST.find((d) => d.number === dayNumber)?.subtopicsCount ?? 8;
}

export interface UserProgress {
  schemaVersion: 1;
  completedDays: number[];
  completedSubtopics: string[]; // "day_subtopic" e.g. "1_0"
  bookmarks: string[];
  notes: Record<string, string>; // "day_subtopic" -> content
  streakDays: number;
  lastStudiedDate: string; // ISO date string (YYYY-MM-DD)
  exerciseScores: Record<string, number>;
  quizScores: Record<number, number>;
}

const DEFAULT_PROGRESS: UserProgress = {
  schemaVersion: 1,
  completedDays: [],
  completedSubtopics: [],
  bookmarks: [],
  notes: {},
  streakDays: 1,
  lastStudiedDate: new Date().toISOString().slice(0, 10),
  exerciseScores: {},
  quizScores: {},
};

interface ProgressContextValue {
  progress: UserProgress;
  isFallbackStorage: boolean;
  isDayCompleted: (day: number) => boolean;
  toggleDayCompleted: (day: number) => void;
  isSubtopicCompleted: (day: number, subtopic: number) => boolean;
  toggleSubtopicCompleted: (day: number, subtopic: number) => void;
  isSubtopicBookmarked: (day: number, subtopic: number) => boolean;
  toggleBookmark: (day: number, subtopic: number) => void;
  getNote: (day: number, subtopic: number) => string;
  saveNote: (day: number, subtopic: number, content: string) => void;
  markExerciseComplete: (exerciseId: string, score: number) => void;
  markQuizComplete: (day: number, scorePercentage: number) => void;
  resetProgress: () => void;
  exportProgressJson: () => string;
  importProgressJson: (json: string) => boolean;
  totalSubtopicsCompleted: number;
  totalCourseSubtopics: number;
  completionPercentage: number;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    return storage.getItem<UserProgress>('user_progress', DEFAULT_PROGRESS);
  });

  const [isFallbackStorage, setIsFallbackStorage] = useState<boolean>(() => storage.isUsingFallback());

  useEffect(() => {
    const unsub = storage.subscribeStatus((isFallback) => {
      setIsFallbackStorage(isFallback);
    });
    return unsub;
  }, []);

  // Save progress changes
  useEffect(() => {
    storage.setItem('user_progress', progress);
  }, [progress]);

  // Streak verification on load
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (progress.lastStudiedDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const isConsecutive = progress.lastStudiedDate === yesterday;
      setProgress((prev) => ({
        ...prev,
        lastStudiedDate: today,
        streakDays: isConsecutive ? prev.streakDays + 1 : 1,
      }));
    }
  }, [progress.lastStudiedDate]);

  const isDayCompleted = useCallback(
    (day: number) => {
      if (progress.completedDays.includes(day)) return true;
      const count = getDaySubtopicCount(day);
      let allCompleted = count > 0;
      for (let s = 0; s < count; s++) {
        if (!progress.completedSubtopics.includes(`${day}_${s}`)) {
          allCompleted = false;
          break;
        }
      }
      return allCompleted;
    },
    [progress.completedDays, progress.completedSubtopics]
  );

  const toggleDayCompleted = useCallback((day: number) => {
    setProgress((prev) => {
      const isCompleted = prev.completedDays.includes(day);
      const updatedDays = isCompleted
        ? prev.completedDays.filter((d) => d !== day)
        : [...prev.completedDays, day];
      return { ...prev, completedDays: updatedDays };
    });
  }, []);

  const isSubtopicCompleted = useCallback(
    (day: number, subtopic: number) => {
      return progress.completedSubtopics.includes(`${day}_${subtopic}`);
    },
    [progress.completedSubtopics]
  );

  const toggleSubtopicCompleted = useCallback((day: number, subtopic: number) => {
    const key = `${day}_${subtopic}`;
    setProgress((prev) => {
      const exists = prev.completedSubtopics.includes(key);
      const updatedSubtopics = exists
        ? prev.completedSubtopics.filter((k) => k !== key)
        : [...prev.completedSubtopics, key];

      // Auto-sync completedDays using the actual day's subtopic count
      const daySubtopicsCount = getDaySubtopicCount(day);
      let allDone = daySubtopicsCount > 0;
      for (let s = 0; s < daySubtopicsCount; s++) {
        const subKey = `${day}_${s}`;
        if (!updatedSubtopics.includes(subKey)) {
          allDone = false;
          break;
        }
      }

      let updatedDays = [...prev.completedDays];
      if (allDone && !updatedDays.includes(day)) {
        updatedDays.push(day);
      } else if (!allDone && updatedDays.includes(day)) {
        updatedDays = updatedDays.filter((d) => d !== day);
      }

      return {
        ...prev,
        completedSubtopics: updatedSubtopics,
        completedDays: updatedDays,
      };
    });
  }, []);

  const isSubtopicBookmarked = useCallback(
    (day: number, subtopic: number) => {
      return progress.bookmarks.includes(`${day}_${subtopic}`);
    },
    [progress.bookmarks]
  );

  const toggleBookmark = useCallback((day: number, subtopic: number) => {
    const key = `${day}_${subtopic}`;
    setProgress((prev) => {
      const exists = prev.bookmarks.includes(key);
      const updated = exists ? prev.bookmarks.filter((k) => k !== key) : [...prev.bookmarks, key];
      return { ...prev, bookmarks: updated };
    });
  }, []);

  const getNote = useCallback(
    (day: number, subtopic: number) => {
      return progress.notes[`${day}_${subtopic}`] || '';
    },
    [progress.notes]
  );

  const saveNote = useCallback((day: number, subtopic: number, content: string) => {
    const key = `${day}_${subtopic}`;
    setProgress((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        [key]: content,
      },
    }));
  }, []);

  const markExerciseComplete = useCallback((exerciseId: string, score: number) => {
    setProgress((prev) => ({
      ...prev,
      exerciseScores: {
        ...prev.exerciseScores,
        [exerciseId]: score,
      },
    }));
  }, []);

  const markQuizComplete = useCallback((day: number, scorePercentage: number) => {
    setProgress((prev) => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [day]: scorePercentage,
      },
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    storage.removeItem('user_progress');
  }, []);

  const exportProgressJson = useCallback((): string => {
    return JSON.stringify({
      app: 'Python Visual Lab',
      type: 'progress_backup',
      exportedAt: new Date().toISOString(),
      progress,
    }, null, 2);
  }, [progress]);

  const importProgressJson = useCallback((jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.progress && parsed.progress.schemaVersion === 1) {
        setProgress(parsed.progress);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const totalSubtopicsCompleted = progress.completedSubtopics.length;
  const completionPercentage =
    TOTAL_COURSE_SUBTOPICS > 0
      ? Math.min(100, Math.round((totalSubtopicsCompleted / TOTAL_COURSE_SUBTOPICS) * 100))
      : 0;

  const value = useMemo(
    () => ({
      progress,
      isFallbackStorage,
      isDayCompleted,
      toggleDayCompleted,
      isSubtopicCompleted,
      toggleSubtopicCompleted,
      isSubtopicBookmarked,
      toggleBookmark,
      getNote,
      saveNote,
      markExerciseComplete,
      markQuizComplete,
      resetProgress,
      exportProgressJson,
      importProgressJson,
      totalSubtopicsCompleted,
      totalCourseSubtopics: TOTAL_COURSE_SUBTOPICS,
      completionPercentage,
    }),
    [
      progress,
      isFallbackStorage,
      isDayCompleted,
      toggleDayCompleted,
      isSubtopicCompleted,
      toggleSubtopicCompleted,
      isSubtopicBookmarked,
      toggleBookmark,
      getNote,
      saveNote,
      markExerciseComplete,
      markQuizComplete,
      resetProgress,
      exportProgressJson,
      importProgressJson,
      totalSubtopicsCompleted,
      completionPercentage,
    ]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export const useProgress = (): ProgressContextValue => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
};
