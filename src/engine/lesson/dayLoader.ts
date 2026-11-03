/**
 * Day Module Loader Registry
 * Section 7.2: Decoupled day loader returning structured DayModule definitions.
 * Includes Day 0 (Welcome Tour) and manifest-backed modules for Days 1–30.
 */

import { DayModule } from './types';
import { WELCOME_TOUR_MODULE } from './welcomeTour';
import { COURSE_DAYS_MANIFEST } from '../../data/manifest';
import { DAY_1_MODULE } from '../../data/days/day1';
import { DAY_2_MODULE } from '../../data/days/day2';
import { DAY_3_MODULE } from '../../data/days/day3';
import { DAY_4_MODULE } from '../../data/days/day4';

export function getDayModule(dayNumber: number): DayModule {
  if (dayNumber === 0) {
    return WELCOME_TOUR_MODULE;
  }

  const manifest = COURSE_DAYS_MANIFEST.find((d) => d.number === dayNumber) || COURSE_DAYS_MANIFEST[0];

  // If Day 1, return the fully authored DAY_1_MODULE
  if (dayNumber === 1) {
    return DAY_1_MODULE;
  }

  // If Day 2, return the fully authored DAY_2_MODULE
  if (dayNumber === 2) {
    return DAY_2_MODULE;
  }

  // If Day 3, return the fully authored DAY_3_MODULE
  if (dayNumber === 3) {
    return DAY_3_MODULE;
  }

  // If Day 4, return the fully authored DAY_4_MODULE
  if (dayNumber === 4) {
    return DAY_4_MODULE;
  }

  // Placeholder module for Days 2–30
  return {
    schemaVersion: 1,
    number: dayNumber,
    title: manifest.title,
    level: manifest.level,
    sourceUrl: manifest.sourceUrl,
    estimatedMinutes: manifest.estimatedMinutes,
    prerequisites: manifest.prerequisites,
    objectives: [
      `Master core concepts of ${manifest.title}.`,
      'Interact with signature visual simulations and inspect runtime variables.',
      'Solve practical reasoning exercises and real-world scenario challenges.',
    ],
    subtopics: Array.from({ length: manifest.subtopicsCount }).map((_, i) => ({
      id: `day${dayNumber}-sub${i + 1}`,
      number: i + 1,
      title: `${manifest.title} - Part ${i + 1}`,
      summary: manifest.summary,
      estimatedMinutes: Math.round(manifest.estimatedMinutes / manifest.subtopicsCount),
      introduce: {
        headline: `${manifest.title}: Topic ${i + 1}`,
        paragraphs: [
          `This lesson covers Topic ${i + 1} of Day ${dayNumber}: ${manifest.title}.`,
          manifest.summary,
          'Full curriculum content, signature interactive simulations, and exercises will be delivered in the respective Day build phase.',
        ],
      },
      visualise: {
        type: 'memory-binding',
        title: `${manifest.title} Visual Laboratory`,
        badge: 'simulation',
        description: 'Interactive concept visualizer.',
        initialConfig: {},
      },
      code: [
        {
          title: `Day ${dayNumber} Starter Example`,
          code: `# Day ${dayNumber}: ${manifest.title}\nprint("Day ${dayNumber} content scheduled.")`,
          runMode: 'real',
          expectedOutput: `Day ${dayNumber} content scheduled.`,
        },
      ],
      explain: [],
      apply: {
        contextTitle: 'Practical Application',
        scenario: 'Real-world use case in industry.',
        code: `# Day ${dayNumber} practical implementation\n`,
        outcome: '',
        domain: 'automation',
      },
      commonMistakes: [],
      practise: [],
      assess: [],
    })),
    realWorldLabs: [],
    miniProject: {
      id: `mp-d${dayNumber}`,
      title: `${manifest.title} Mini Project`,
      brief: `Apply the skills learned in Day ${dayNumber} to build a real-world programme.`,
      requirements: ['Implement requirements according to specification'],
      rubric: [{ criterion: 'Working code and tests', weight: 100 }],
      starterCode: `# Day ${dayNumber} Project\n`,
    },
    dayQuiz: {
      title: `Day ${dayNumber} Checkpoint Quiz`,
      questions: [],
      passingScorePercentage: 80,
    },
    cheatSheet: [],
    sourceNotes: [
      `Curriculum reference: ${manifest.sourceUrl}`,
    ],
  };
}
