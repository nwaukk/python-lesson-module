/**
 * Welcome Tour Day Module (Day 0)
 * Section 13.1: Complete lesson exercising every engine capability:
 * Visualise, Interact, Connect, Execute, Explain, Apply, Practise, and Assess.
 */

import { DayModule } from './types';

export const WELCOME_TOUR_MODULE: DayModule = {
  schemaVersion: 1,
  number: 0,
  title: 'Welcome Tour: The Visual Learning Engine',
  level: 'beginner',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python',
  estimatedMinutes: 20,
  prerequisites: [],
  objectives: [
    'Understand the ten-step visual learning method behind Python Visual Lab.',
    'Interact with tactile simulation primitives (memory bindings, sequence grids, truth tables).',
    'Execute real Python in the Pyodide Web Worker and step through execution traces.',
    'Customise your workspace with themes, typography, and layout presets.',
  ],
  subtopics: [
    {
      id: 'tour-1',
      number: 1,
      title: 'The Ten-Step Visual Journey',
      summary: 'How Python Visual Lab transforms programming education through tactile visual cause and effect.',
      estimatedMinutes: 5,
      introduce: {
        headline: 'Don’t Just Read Code. See Python in Action.',
        paragraphs: [
          'Welcome to Python Visual Lab! Most programming tutorials ask you to memorise abstract rules from static text. Here, every concept is taught through an interactive cause-and-effect model.',
          'Every concept moves through a ten-step journey: from a clear plain explanation and interactive simulation, through code connection, real execution, step-by-step tracing, practical real-world application, and graduated exercises.',
          'Look for the three permanent status badges: REAL PYTHON (run inside the Pyodide Web Worker), TRACE (recorded execution stepped line-by-line), and SIMULATION (a safe scripted model for architecture concepts).',
        ],
        bulletPoints: [
          'Clear status badges: never confusing a simulation with real execution',
          'Tactile interactive controls: sliders, switches, and before/after comparisons',
          'Zero telemetry or tracking: 100% private and runs entirely in your browser',
        ],
      },
      visualise: {
        type: 'instruction-journey',
        title: 'Python Instruction Journey (Source -> Bytecode -> PVM)',
        badge: 'simulation',
        description: 'Watch human-readable source code compile into bytecode and execute inside the Python Virtual Machine.',
        initialConfig: { step: 1 },
      },
      code: [
        {
          title: 'Your First Python Statement',
          code: `# Welcome Tour demonstration\nlearner = "Engineer"\nprint(f"Welcome to the Visual Lab, {learner}!")`,
          runMode: 'real',
          expectedOutput: 'Welcome to the Visual Lab, Engineer!',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'learner = "Engineer"',
          internalEffect: 'Allocates string object "Engineer" in heap memory and binds name "learner" to it.',
        },
        {
          step: 2,
          codeLine: 3,
          instruction: 'print(f"Welcome to the Visual Lab, {learner}!")',
          internalEffect: 'Evaluates f-string expression and streams character buffer to sys.stdout.',
        },
      ],
      apply: {
        contextTitle: 'Real-World Automation',
        scenario: 'Writing an onboarding welcome script for automated developer environments.',
        code: 'def welcome(name):\n    return f"Ready to build, {name}."\nprint(welcome("Ada"))',
        outcome: 'Ready to build, Ada.',
        domain: 'automation',
      },
      commonMistakes: [
        {
          label: 'Assuming Variables are Boxes',
          erroneousCode: '# Misconception: b = a copies the data',
          errorMessage: 'Aliasing misconception',
          explanation: 'In Python, assignment never copies values by default. It binds names to objects.',
          correctedCode: '# Use a.copy() or list(a) when you need a distinct copy',
        },
      ],
      practise: [
        {
          id: 'p-1',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'What does the REAL PYTHON badge indicate in Python Visual Lab?',
          options: [
            {
              id: 'opt-1',
              text: 'The code is executed by a real client-side Python interpreter.',
              explanation: 'Correct! Real code runs inside our browser-isolated Pyodide Web Worker.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'The code is sent to an external cloud server.',
              explanation: 'Incorrect. Python Visual Lab runs 100% client-side with zero external servers.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'It is an animated mockup of code execution.',
              explanation: 'Incorrect. Mockups and models carry the SIMULATION badge.',
              isCorrect: false,
            },
          ],
          hints: ['Read the badge descriptions in the introduction.'],
          points: 10,
        },
      ],
      assess: [
        {
          id: 'q-1',
          scenario: 'A student runs an infinite while loop in their script.',
          question: 'How does Python Visual Lab protect your browser?',
          options: [
            {
              id: 'o-1',
              text: 'A 5-second execution timeout safely terminates and recreates the worker.',
              explanation: 'Correct! The worker is cleanly respawned without freezing your browser tab.',
              isCorrect: true,
            },
            {
              id: 'o-2',
              text: 'The entire browser tab must be force closed.',
              explanation: 'False. The Web Worker architecture isolates execution completely.',
              isCorrect: false,
            },
          ],
        },
      ],
    },
    {
      id: 'tour-2',
      number: 2,
      title: 'Memory & Object-Binding Simulator',
      summary: 'Explore how variables are pointers to objects and how aliasing works in memory.',
      estimatedMinutes: 5,
      introduce: {
        headline: 'Names Point to Objects in Memory',
        paragraphs: [
          'In many languages, variables are taught as labelled boxes holding values. In Python, variables are identifiers (tags) bound to distinct objects residing in heap memory.',
          'When you write `b = a`, you do NOT create a second copy of the data. Both names `a` and `b` point to the exact same memory address. If the object is mutable (like a list), modifying it via `b` changes what `a` sees.',
        ],
      },
      visualise: {
        type: 'memory-binding',
        title: 'Interactive Name-to-Object Binding',
        badge: 'simulation',
        description: 'Step through variable creation, aliasing, and in-place list mutation.',
        initialConfig: { step: 1 },
      },
      code: [
        {
          title: 'Shared Reference Experiment',
          code: `a = [1, 2]\nb = a\nb.append(3)\nprint(f"a: {a}")\nprint(f"b: {b}")`,
          runMode: 'real',
          expectedOutput: 'a: [1, 2, 3]\nb: [1, 2, 3]',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'b = a',
          internalEffect: 'Copies reference pointer from "a" to "b". Reference count of list object increases to 2.',
        },
      ],
      apply: {
        contextTitle: 'Student Roster Updates',
        scenario: 'Updating student course enrollment where multiple system views reference the same active cohort.',
        code: 'cohort = ["Amara", "Tunde"]\nactive = cohort\nactive.append("Chidi")\nprint(len(cohort))',
        outcome: '3',
        domain: 'school',
      },
      commonMistakes: [],
      practise: [
        {
          id: 'ex-predict-1',
          type: 'predict-output',
          tier: 'standard',
          points: 10,
          prompt: 'What will be printed when this Python snippet executes?',
          traceStepCode: 'a = [1, 2]\nb = a\nb.append(3)\nprint(a)',
          options: [
            {
              id: 'a',
              text: '[1, 2, 3]',
              explanation: 'Correct! b = a binds both names to the same list. Modifying b mutates the shared list.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: '[1, 2]',
              explanation: 'Incorrect. In Python, assignment does not copy list data. Both names point to the same list.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'None',
              explanation: 'Incorrect. print(a) displays the contents of list a.',
              isCorrect: false,
            },
          ],
          hints: [
            'Remember: names are labels pointing to objects, not separate boxes.',
            'Does b = a create a new list or alias the existing list?',
            'Solution: The list was mutated in place, so print(a) displays [1, 2, 3].',
          ],
        },
        {
          id: 'ex-order-1',
          type: 'order-the-lines',
          tier: 'foundation',
          points: 10,
          prompt: 'Arrange the Python lines into the correct execution sequence to create and modify an aliased list:',
          jumbledLines: [
            { id: 'l-3', code: 'print(f"Items: {items}")', indent: 0 },
            { id: 'l-1', code: 'items = ["Apple", "Banana"]', indent: 0 },
            { id: 'l-2', code: 'alias = items', indent: 0 },
            { id: 'l-4', code: 'alias.append("Cherry")', indent: 0 },
          ],
          correctLineOrder: ['l-1', 'l-2', 'l-4', 'l-3'],
          hints: [
            'Initialize the items list first.',
            'Bind alias to items before calling methods on alias.',
            'Call print at the very end to observe the final state.',
          ],
        } as any,
      ],
      assess: [
        {
          id: 'q-alias-1',
          scenario: 'A developer writes x = [10, 20]; y = x; y.clear()',
          question: 'What is the length of x afterwards?',
          options: [
            {
              id: 'o-1',
              text: '0',
              explanation: 'Correct! Both x and y point to the same list object that was cleared.',
              isCorrect: true,
            },
            {
              id: 'o-2',
              text: '2',
              explanation: 'Incorrect. Lists are mutable and shared across references.',
              isCorrect: false,
            },
          ],
        },
      ],
    },
    {
      id: 'tour-3',
      number: 3,
      title: 'Sequence Grids & Dual-Index Slicing',
      summary: 'Master positive and negative index systems and slicing syntax with interactive sliders.',
      estimatedMinutes: 5,
      introduce: {
        headline: 'Indexing and Slicing Sequences',
        paragraphs: [
          'Python sequences (strings, lists, tuples) support dual-indexing: positive indices starting at 0 from the left, and negative indices starting at -1 from the right.',
          'Slicing with `sequence[start:stop:step]` allows rapid extraction. Crucially, the `stop` index is always exclusive (not included in the result).',
        ],
      },
      visualise: {
        type: 'sequence-grid',
        title: 'Dual-Index Sequence Grid',
        badge: 'simulation',
        description: 'Interactive character sequence grid with positive and negative coordinate positions.',
        initialConfig: { text: 'PYTHON' },
      },
      code: [
        {
          title: 'Dual Indexing Code Sample',
          code: `text = "PYTHON"\nprint("First:", text[0])\nprint("Last:", text[-1])\nprint("Slice [1:4]:", text[1:4])`,
          runMode: 'real',
          expectedOutput: 'First: P\nLast: N\nSlice [1:4]: YTH',
        },
      ],
      explain: [],
      apply: {
        contextTitle: 'Data Extraction',
        scenario: 'Extracting area code prefixes and timestamps from formatted telemetry strings.',
        code: 'phone = "+2348012345678"\ncountry_code = phone[:4]\nprint(country_code)',
        outcome: '+234',
        domain: 'ecommerce',
      },
      commonMistakes: [],
      practise: [
        {
          id: 'ex-fix-1',
          type: 'fix-the-bug',
          tier: 'foundation',
          points: 10,
          prompt: 'Fix the index out-of-range bug in this string accessor script so it prints the last character.',
          starterCode: 'word = "LAGOS"\n# Fix the index below to safely access the last character\nlast_char = word[5]\nprint(last_char)',
          solutionCode: 'word = "LAGOS"\nlast_char = word[-1]\nprint(last_char)',
          testCases: [
            {
              id: 'tc-1',
              label: 'Prints letter S',
              setup: '',
              expected: 'S',
              hidden: false,
            },
          ],
          hints: [
            'Python 0-based indexing means length 5 has valid indices 0 to 4.',
            'You can also use negative index -1 for the last character.',
            'Solution: Change word[5] to word[-1] or word[4].',
          ],
        },
        {
          id: 'ex-gaps-1',
          type: 'fill-the-gaps',
          tier: 'standard',
          points: 10,
          prompt: 'Fill in the slicing bounds so the expression extracts the word "Visual" from "Python Visual Lab":',
          gaps: [
            {
              id: 'gap-start',
              beforeText: 'title = "Python Visual Lab"\nslice_result = title[',
              afterText: ':',
              correctAnswer: '7',
            },
            {
              id: 'gap-stop',
              beforeText: '',
              afterText: ']\nprint(slice_result)',
              correctAnswer: '13',
            },
          ],
          hints: [
            'Count the character position where "Visual" begins (index 7).',
            'Remember stop index is exclusive: length of "Visual" is 6, so 7 + 6 = 13.',
            'Solution: 7 and 13.',
          ],
        } as any,
      ],
      assess: [],
    },
    {
      id: 'tour-4',
      number: 4,
      title: 'Workspace Layouts & Appearance Customisation',
      summary: 'Explore the 3-zone Guided Workspace, reactive Notebook Lab, and custom design tokens.',
      estimatedMinutes: 5,
      introduce: {
        headline: 'Your Learning Laboratory, Customised for You',
        paragraphs: [
          'Python Visual Lab is built for total flexibility. Switch between Guided 3-Zone Workspace, reactive Notebook Lab with multi-column card cells, and Classroom Teaching Mode with one click.',
          'Open the Appearance Studio to customize any of 11 theme presets, test WCAG 2.2 contrast compliance, adjust interface rem scaling (80% to 160%), and choose from 6 CodeMirror editor themes.',
        ],
      },
      visualise: {
        type: 'truth-table',
        title: 'Boolean Switchboard & Truth Table',
        badge: 'simulation',
        description: 'Interactive Boolean logic switches calculating compound truth values.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Workspace Ready',
          code: `print("Python Visual Lab is ready.")\nprint("Proceed to Day 1 to begin your 30-day journey!")`,
          runMode: 'real',
          expectedOutput: 'Python Visual Lab is ready.\nProceed to Day 1 to begin your 30-day journey!',
        },
      ],
      explain: [],
      apply: {
        contextTitle: 'Personal Mastery',
        scenario: 'Beginning Day 1 with your preferred theme preset and comfortable text size.',
        code: 'days_ahead = 30\nprint(f"{days_ahead} days to mastery.")',
        outcome: '30 days to mastery.',
        domain: 'automation',
      },
      commonMistakes: [],
      practise: [
        {
          id: 'ex-write-1',
          type: 'write-code',
          tier: 'challenge',
          points: 15,
          prompt: 'Write a Python function named `greet_learner(name)` that returns the greeting string `"Welcome, <name> to Python Visual Lab!"`.',
          starterCode: 'def greet_learner(name):\n    # Return formatted greeting\n    pass\n',
          solutionCode: 'def greet_learner(name):\n    return f"Welcome, {name} to Python Visual Lab!"\n',
          testCases: [
            {
              id: 'tc-w1',
              label: 'Greet Ada',
              setup: 'print(greet_learner("Ada"))',
              expected: 'Welcome, Ada to Python Visual Lab!',
              hidden: false,
            },
            {
              id: 'tc-w2',
              label: 'Greet Tunde',
              setup: 'print(greet_learner("Tunde"))',
              expected: 'Welcome, Tunde to Python Visual Lab!',
              hidden: true,
            },
          ],
          hints: [
            'Use an f-string: f"Welcome, {name} to Python Visual Lab!"',
            'Remember to use the `return` statement instead of only `print`.',
            'Solution: return f"Welcome, {name} to Python Visual Lab!"',
          ],
        },
        {
          id: 'ex-theory-1',
          type: 'theory-reasoning',
          tier: 'standard',
          points: 10,
          prompt: 'Explain why Python strings are immutable whereas Python lists are mutable, and why modifying an aliased list changes both references.',
          modelAnswer: 'In Python, strings are immutable sequence objects whose memory contents cannot be changed after creation. In contrast, lists are mutable container objects that store pointers to elements. When two names reference the same list object (aliasing), in-place operations like append() or pop() modify the single underlying object in heap memory, causing the changes to be visible through both identifiers.',
          hints: [
            'Contrast how memory allocation works for strings versus lists.',
            'Discuss the role of object references in Python assignment.',
            'Review the model answer to self-assess your explanation.',
          ],
        } as any,
        {
          id: 'ex-trace-1',
          type: 'explain-the-trace',
          tier: 'foundation',
          points: 10,
          prompt: 'During execution of the following snippet, what occurs at line 2?',
          traceStepCode: '1: total = 100\n2: discount = total * 0.15\n3: final_price = total - discount',
          options: [
            {
              id: 'a',
              text: 'Python calculates 100 * 0.15 and binds the name "discount" to float object 15.0 in the global frame.',
              explanation: 'Correct! The arithmetic expression is evaluated and the resulting float is assigned.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'Python modifies the existing object 100 in place.',
              explanation: 'Incorrect. Integers are immutable in Python.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'A syntax error is raised.',
              explanation: 'Incorrect. The syntax is completely valid Python.',
              isCorrect: false,
            },
          ],
          hints: [
            'Look at the assignment operator (=) on line 2.',
            'What data type is produced by multiplying int and float?',
            'Solution: float object 15.0 is bound to name discount.',
          ],
        },
      ],
      assess: [],
    },
  ],
  realWorldLabs: [],
  miniProject: {
    id: 'mp-tour',
    title: 'Tour Verification',
    brief: 'Confirm understanding of the Python Visual Lab interface and execution engine.',
    requirements: ['Run a script in the editor', 'Inspect variables in the namespace'],
    rubric: [{ criterion: 'Execution understanding', weight: 100 }],
    starterCode: '# Ready to start\nprint("I am ready!")',
  },
  dayQuiz: {
    title: 'Welcome Tour Checkpoint',
    questions: [],
    passingScorePercentage: 80,
  },
  cheatSheet: [],
  sourceNotes: [
    'The Welcome Tour introduces the interface ergonomics and execution mechanisms of Python Visual Lab.',
  ],
};
