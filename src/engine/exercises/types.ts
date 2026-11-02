/**
 * Exercise & Assessment Engine Types
 * Strict compliance with Section 7.3, 10.2, and 13.1.
 */

import { TestCase, ExerciseType } from '../lesson/types';

export type DifficultyTier = 'foundation' | 'standard' | 'challenge' | 'project';

export interface ExerciseOption {
  id: string;
  text: string;
  explanation: string;
  isCorrect: boolean;
}

export interface LineOrderBlock {
  id: string;
  code: string;
  indent: number; // 0, 1, 2 indentation levels
}

export interface GapItem {
  id: string;
  beforeText: string;
  afterText: string;
  correctAnswer: string;
  options?: string[]; // Multiple choice options for gap
}

export interface ExerciseData {
  id: string;
  title: string;
  type: ExerciseType;
  tier: DifficultyTier;
  points: number;
  prompt: string;
  contextScenario?: string;
  // Multiple choice & predict output
  options?: ExerciseOption[];
  // Fix the bug & write code
  starterCode?: string;
  solutionCode?: string;
  testCases?: TestCase[];
  // Order the lines (Parsons problem)
  jumbledLines?: LineOrderBlock[];
  correctLineOrder?: string[]; // IDs in correct order
  // Fill the gaps
  gaps?: GapItem[];
  // Theory reasoning
  modelAnswer?: string;
  markingCriteria?: { id: string; label: string; points: number }[];
  // Trace explanation
  traceStepCode?: string;
  traceQuestion?: string;
  // Progressive Hint Ladder (Section 10.2: 3 hints before worked solution)
  hints: string[];
}

export interface ExerciseSubmissionState {
  exerciseId: string;
  userAnswer?: string | string[] | Record<string, string>;
  isCompleted: boolean;
  score: number;
  unassisted: boolean; // False if solution was unlocked
  unlockedHintLevel: number; // 0, 1, 2, 3
  solutionUnlocked: boolean;
  attemptsCount: number;
  lastAttemptAt?: string;
  feedback?: {
    passed: boolean;
    message: string;
    detailedResults?: { label: string; passed: boolean; expected?: string; actual?: string }[];
  };
}

export interface AssessmentQuestion {
  id: string;
  scenario: string;
  question: string;
  codeSnippet?: string;
  options: ExerciseOption[];
  points: number;
}

export interface DayAssessmentData {
  dayNumber: number;
  title: string;
  passingScorePercentage: number;
  timeLimitMinutes?: number;
  questions: AssessmentQuestion[];
}
