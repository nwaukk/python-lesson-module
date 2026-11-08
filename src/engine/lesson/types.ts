/**
 * Lesson Engine Data Contracts & Types
 * Strict compliance with Section 7.3 of the Master Specification.
 */

import { ExecutionMode } from '../runtime/types';

export interface RichText {
  headline: string;
  paragraphs: string[];
  keyTerms?: { term: string; definition: string }[];
  bulletPoints?: string[];
}

export type SimulationPrimitiveType =
  | 'stepper'
  | 'memory-binding'
  | 'sequence-grid'
  | 'expression-tree'
  | 'truth-table'
  | 'flowchart-tracer'
  | 'instruction-journey'
  | 'shell-vs-script'
  | 'terminal-console'
  | 'indentation-lab'
  | 'syntax-repair'
  | 'data-types-visualizer'
  | 'type-conversion'
  | 'builtin-explorer'
  | 'naming-rules'
  | 'arithmetic-lab'
  | 'identity-equality'
  | 'string-index-slice'
  | 'string-methods-lab'
  | 'split-join'
  | 'find-index'
  | 'numeric-predicates'
  | 'dynamic-array-allocator'
  | 'list-mutability-lab'
  | 'list-methods-lab'
  | 'list-slicing-splicing'
  | 'copy-aliasing-inspector'
  | 'tuple-list-memory-inspector'
  | 'tuple-unpacking-lab'
  | 'tuple-immutability-trap'
  | 'venn-diagram-simulator'
  | 'hash-set-table-inspector'
  | 'compact-dict-memory-inspector'
  | 'dict-mutation-flow-sim';

export interface SimulationRef {
  type: SimulationPrimitiveType;
  title: string;
  badge: ExecutionMode; // 'real' | 'trace' | 'simulation'
  description: string;
  initialConfig: Record<string, any>;
  beforeAfterSupport?: boolean;
}

export interface CodeExample {
  title: string;
  code: string;
  runMode: ExecutionMode;
  expectedOutput: string;
  notes?: string;
  highlightLines?: number[];
}

export interface ExplainStep {
  step: number;
  codeLine: number;
  instruction: string;
  internalEffect: string; // What Python does internally in CPython / PVM
  outputEffect?: string;
}

export interface PracticalExample {
  contextTitle: string;
  scenario: string;
  code?: string;
  outcome?: string;
  domain: string;
}

export interface Mistake {
  label: string;
  erroneousCode?: string;
  errorMessage?: string;
  explanation: string;
  correctedCode?: string;
}

export type ExerciseType =
  | 'scenario-mcq'
  | 'predict-output'
  | 'fix-the-bug'
  | 'order-the-lines'
  | 'fill-the-gaps'
  | 'write-code'
  | 'theory-reasoning'
  | 'explain-the-trace';

export interface ExerciseOption {
  id: string;
  text: string;
  explanation: string;
  isCorrect: boolean;
}

export interface TestCase {
  id: string;
  label: string;
  setup: string;
  expected: string;
  hidden: boolean;
}

export interface Exercise {
  id: string;
  title?: string;
  type: ExerciseType;
  tier: 'foundation' | 'standard' | 'challenge' | 'project';
  prompt: string;
  contextScenario?: string;
  options?: ExerciseOption[]; // For scenario-mcq / predict-output
  starterCode?: string;
  solutionCode?: string;
  testCases?: TestCase[];
  jumbledLines?: { id: string; code: string; indent: number }[];
  correctLineOrder?: string[];
  gaps?: { id: string; beforeText: string; afterText: string; correctAnswer: string; options?: string[] }[];
  modelAnswer?: string;
  markingCriteria?: { id: string; label: string; points: number }[];
  traceStepCode?: string;
  traceQuestion?: string;
  hints: string[]; // 3 progressive hints
  points: number;
}

export interface Question {
  id: string;
  scenario: string;
  question: string;
  codeSnippet?: string;
  options: ExerciseOption[];
  points?: number;
}

export interface RealWorldLab {
  id: string;
  title: string;
  description: string;
  domain: string;
  starterCode: string;
  targetOutput: string;
}

export interface MiniProject {
  id: string;
  title: string;
  brief: string;
  requirements: string[];
  rubric: { criterion: string; weight: number }[];
  starterCode: string;
}

export interface CheatSheetBlock {
  category: string;
  syntax: string;
  description: string;
  example: string;
}

export interface Assessment {
  title: string;
  questions: Question[];
  passingScorePercentage: number;
}

export interface Subtopic {
  id: string;
  number: number;
  title: string;
  summary: string;
  estimatedMinutes: number;
  introduce: RichText;
  visualise: SimulationRef;
  code: CodeExample[];
  explain: ExplainStep[];
  apply: PracticalExample;
  commonMistakes: Mistake[];
  practise?: Exercise[];
  assess?: Question[];
  sourceNotes?: string;
}

export interface DayModule {
  schemaVersion: 1;
  number: number;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  sourceUrl: string;
  estimatedMinutes: number;
  prerequisites: number[];
  objectives: string[];
  subtopics: Subtopic[];
  realWorldLabs: RealWorldLab[];
  miniProject: MiniProject;
  dayQuiz: Assessment;
  cheatSheet: CheatSheetBlock[];
  sourceNotes: string[];
}
