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
import { DAY_5_MODULE } from '../../data/days/day5';
import { DAY_6_MODULE } from '../../data/days/day6';
import { DAY_7_MODULE } from '../../data/days/day7';
import { DAY_8_MODULE } from '../../data/days/day8';
import { DAY_9_MODULE } from '../../data/days/day9';
import { DAY_10_MODULE } from '../../data/days/day10';
import { DAY_11_MODULE } from '../../data/days/day11';
import { DAY_12_MODULE } from '../../data/days/day12';
import { DAY_13_MODULE } from '../../data/days/day13';
import { DAY_14_MODULE } from '../../data/days/day14';
import { DAY_15_MODULE } from '../../data/days/day15';
import { DAY_16_MODULE } from '../../data/days/day16';
import { DAY_17_MODULE } from '../../data/days/day17';
import { DAY_18_MODULE } from '../../data/days/day18';
import { DAY_19_MODULE } from '../../data/days/day19';
import { DAY_20_MODULE } from '../../data/days/day20';
import { DAY_21_MODULE } from '../../data/days/day21';
import { DAY_22_MODULE } from '../../data/days/day22';

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

  // If Day 5, return the fully authored DAY_5_MODULE
  if (dayNumber === 5) {
    return DAY_5_MODULE;
  }

  // If Day 6, return the fully authored DAY_6_MODULE
  if (dayNumber === 6) {
    return DAY_6_MODULE;
  }

  // If Day 7, return the fully authored DAY_7_MODULE
  if (dayNumber === 7) {
    return DAY_7_MODULE;
  }

  // If Day 8, return the fully authored DAY_8_MODULE
  if (dayNumber === 8) {
    return DAY_8_MODULE;
  }

  // If Day 9, return the fully authored DAY_9_MODULE
  if (dayNumber === 9) {
    return DAY_9_MODULE;
  }

  // If Day 10, return the fully authored DAY_10_MODULE
  if (dayNumber === 10) {
    return DAY_10_MODULE;
  }

  // If Day 11, return the fully authored DAY_11_MODULE
  if (dayNumber === 11) {
    return DAY_11_MODULE;
  }

  // If Day 12, return the fully authored DAY_12_MODULE
  if (dayNumber === 12) {
    return DAY_12_MODULE;
  }

  // If Day 13, return the fully authored DAY_13_MODULE
  if (dayNumber === 13) {
    return DAY_13_MODULE;
  }

  // If Day 14, return the fully authored DAY_14_MODULE
  if (dayNumber === 14) {
    return DAY_14_MODULE;
  }

  // If Day 15, return the fully authored DAY_15_MODULE
  if (dayNumber === 15) {
    return DAY_15_MODULE;
  }

  // If Day 16, return the fully authored DAY_16_MODULE
  if (dayNumber === 16) {
    return DAY_16_MODULE;
  }

  // If Day 17, return the fully authored DAY_17_MODULE
  if (dayNumber === 17) {
    return DAY_17_MODULE;
  }

  // If Day 18, return the fully authored DAY_18_MODULE
  if (dayNumber === 18) {
    return DAY_18_MODULE;
  }

  // If Day 19, return the fully authored DAY_19_MODULE
  if (dayNumber === 19) {
    return DAY_19_MODULE;
  }

  // If Day 20, return the fully authored DAY_20_MODULE
  if (dayNumber === 20) {
    return DAY_20_MODULE;
  }

  // If Day 21, return the fully authored DAY_21_MODULE
  if (dayNumber === 21) {
    return DAY_21_MODULE;
  }

  // If Day 22, return the fully authored DAY_22_MODULE
  if (dayNumber === 22) {
    return DAY_22_MODULE;
  }

  // Placeholder module for Days 23–30
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
