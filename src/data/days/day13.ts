/**
 * Day 13: List Comprehension and Lambda Functions (Intermediate Python)
 * Part A (Learn) conforming to Sections 10, 13.2, and 14 of the Master Specification.
 * Includes:
 *  - 7 Detailed Subtopics following the 10-step pedagogical structure
 *  - 3 Signature Simulations: comprehension-pipeline, lambda-evaluator, dict-set-comp-lab
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_13_MODULE: DayModule = {
  schemaVersion: 1,
  number: 13,
  title: 'List Comprehension and Lambda Functions',
  level: 'intermediate',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/13_Day_List_comprehension',
  estimatedMinutes: 75,
  prerequisites: [11],
  objectives: [
    'Write concise, Pythonic list comprehensions to transform sequences without boilerplate append loops',
    'Distinguish between trailing filter clauses ([x for x in seq if cond]) and inline ternary transforms ([a if cond else b for x in seq])',
    'Flatten 2D matrices and combine sequences using multi-clause nested comprehensions',
    'Construct set comprehensions for automatic deduplication and dictionary comprehensions for key-value mapping',
    'Understand generator expressions for memory-efficient lazy evaluation',
    'Write single-expression anonymous lambda functions and explain their limits compared to def',
    'Use lambda as a key function in sorted(), min(), and max() for custom ordering',
  ],
  subtopics: [
    {
      id: 'day13-sub1',
      number: 1,
      title: 'List Comprehension Syntax & Readability',
      summary: 'Build transformed lists in a single readable expression instead of multi-line for-loop + append boilerplate.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Declarative List Construction: [expr for item in iterable]',
        paragraphs: [
          'A **list comprehension** is a compact, expressive Python syntax for creating a new list by applying an expression to every item in an existing iterable (list, range, string, tuple, etc.).',
          'In traditional imperative code, you allocate an empty list `out = []`, write a `for` loop, and call `out.append(...)` on each iteration. A list comprehension `[expr for item in iterable]` expresses the exact same operation declaratively in one line—and runs slightly faster in CPython because the `append` bytecode is optimized internally.',
          'Read comprehensions from the `for` clause outward: "for each `item` in `iterable`, compute `expr` and place it into the new list." Always prioritize clarity—if a comprehension spans more than two clauses or becomes hard to read, prefer a regular `for` loop.',
        ],
        keyTerms: [
          {
            term: 'List Comprehension',
            definition: 'A bracketed expression [expr for x in iterable] that evaluates to a brand-new list.',
          },
          {
            term: 'Target Variable',
            definition: 'The loop variable (e.g., x) bound to each element of the iterable during comprehension evaluation.',
          },
          {
            term: 'Declarative Style',
            definition: 'Describing what values belong in the result rather than manually mutating an accumulator with .append().',
          },
        ],
        bulletPoints: [
          'Syntax: [transform_expr for item in iterable].',
          'Always returns a brand-new list without mutating the source iterable.',
          'In Python 3, the comprehension loop variable is scoped locally and does not leak into the outer scope.',
        ],
      },
      visualise: {
        type: 'comprehension-pipeline',
        title: 'List Comprehension Pipeline Visualizer',
        badge: 'simulation',
        description: 'Trace each element from source iterable through transform expression into the output list.',
        initialConfig: { mode: 'basic' },
      },
      code: [
        {
          title: 'Squares & Normalized Strings via Comprehension',
          runMode: 'real',
          code: `nums = [2, 3, 4, 5]
squares = [n * n for n in nums]
print("Squares:", squares)

raw_tags = ["  py ", "API", " cli "]
clean_tags = [t.strip().lower() for t in raw_tags]
print("Clean tags:", clean_tags)`,
          expectedOutput: `Squares: [4, 9, 16, 25]
Clean tags: ['py', 'api', 'cli']`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'squares = [n * n for n in nums]',
          internalEffect: 'Iterates n through [2, 3, 4, 5], computes n * n for each, and collects [4, 9, 16, 25].',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 'clean_tags = [t.strip().lower() for t in raw_tags]',
          internalEffect: 'Chains .strip() and .lower() on every string element without modifying raw_tags.',
        },
      ],
      apply: {
        domain: 'E-Commerce Pricing',
        contextTitle: 'Applying a 15% Promotional Discount',
        scenario: 'Convert a list of raw product prices into rounded discounted prices.',
        code: `prices = [20.0, 50.0, 120.0]
discounted = [round(p * 0.85, 2) for p in prices]
print("Discounted:", discounted)`,
        outcome: `Discounted: [17.0, 42.5, 102.0]`,
      },
      commonMistakes: [
        {
          label: 'Using Comprehensions Only for Side Effects (print)',
          erroneousCode: `# Anti-pattern: builds a useless list of None values!
result = [print(x) for x in [1, 2, 3]]
print("Result:", result)`,
          errorMessage: 'Logic anti-pattern: produces [None, None, None] in memory',
          explanation: 'Comprehensions are for building lists of values, not for running side effects like print(). Use a regular for loop when you do not need the resulting list.',
          correctedCode: `for x in [1, 2, 3]:
    print(x)`,
        },
      ],
      sourceNotes: 'Covers list comprehension fundamentals from Asabeneh Day 13.',
      practise: [
        {
          id: 'd13-s1-ex1',
          title: 'Scenario: Side-Effect Comprehension Anti-Pattern',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Build Script Code Review',
          prompt: 'A teammate writes `out = [print(svc) for svc in services]` to log 4 service names. Why does a reviewer flag this?',
          options: [
            { id: 'opt-1', text: 'It allocates a useless list of [None, None, None, None] in memory; a regular for loop is cleaner.', explanation: 'Correct! print() returns None, so the comprehension builds a list of Nones for no reason.', isCorrect: true },
            { id: 'opt-2', text: 'Comprehensions cannot call functions.', explanation: 'Incorrect. Comprehensions can call any expression, including functions.', isCorrect: false },
            { id: 'opt-3', text: 'It raises SyntaxError in Python 3.', explanation: 'Incorrect. It is valid syntax, just a memory/style anti-pattern.', isCorrect: false },
            { id: 'opt-4', text: 'It mutates services in-place.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'What value does print() return?',
            'What is the purpose of a list comprehension?',
            'Think about [None, None, None, None].',
          ],
        },
        {
          id: 'd13-s1-ex2',
          title: 'Theory: Comprehension Loop Variable Scope',
          type: 'theory-reasoning',
          tier: 'standard',
          points: 15,
          contextScenario: 'Variable Shadowing in Python 3',
          prompt: 'Suppose `x = 99` is defined before `squares = [x * x for x in [1, 2, 3]]`. What is the value of `x` after the comprehension finishes in Python 3, and why?',
          modelAnswer: 'x remains 99 because in Python 3, list comprehensions execute in their own isolated scope. The loop variable x inside the comprehension does not overwrite or leak into the enclosing scope.',
          markingCriteria: [
            { id: 'mc-1', label: 'States that x remains 99', points: 5 },
            { id: 'mc-2', label: 'Explains Python 3 comprehensions have their own local scope', points: 10 },
          ],
          hints: [
            'Compare a regular for loop vs a list comprehension in Python 3.',
            'Does the loop target x leak out of [...]?',
            'In Python 3, comprehensions create an implicit function-like scope.',
          ],
        },
        {
          id: 'd13-s1-ex3',
          title: 'Predict Output: Normalizing Sensor IDs',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'IoT Telemetry Ingestion',
          prompt: 'What does `ids = [s.strip().upper() for s in [" a1 ", "b2"]]; print(ids)` output?',
          options: [
            { id: 'opt-1', text: "['A1', 'B2']", explanation: 'Correct! strip() removes surrounding spaces and upper() capitalizes each string.', isCorrect: true },
            { id: 'opt-2', text: "[' a1 ', 'b2']", explanation: 'Incorrect. strip() and upper() both transform the strings.', isCorrect: false },
            { id: 'opt-3', text: "['a1', 'b2']", explanation: 'Incorrect. upper() is also called.', isCorrect: false },
            { id: 'opt-4', text: 'TypeError', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Trace s.strip() first, then .upper().',
            'Does strip() remove spaces from both ends?',
            'Check the casing of the final characters.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day13-sub2',
      number: 2,
      title: 'Conditional Filtering (if) vs Ternary Expressions (if-else)',
      summary: 'Filter elements with a trailing if clause, or transform every element conditionally with an inline if-else expression.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Two Positions for if: Gatekeeper vs Conditional Transform',
        paragraphs: [
          'Python comprehensions support two completely different conditional patterns depending on where `if` appears. Putting `if condition` **at the end** (`[x for x in seq if cond]`) acts as a **filter**: items failing the condition are skipped and omitted from the output list.',
          'Putting `a if cond else b` **before `for`** (`[a if cond else b for x in seq]`) is a **ternary conditional expression**: it never filters items out; instead, it maps every item to either `a` or `b`, so the output list always has the exact same length as the input.',
          'You can even combine both in one comprehension: `[a if cond1 else b for x in seq if cond2]`. Remember: trailing `if` has no `else`; leading `if` must always have an `else`.',
        ],
        keyTerms: [
          {
            term: 'Filter Clause (Trailing if)',
            definition: 'Placed after for x in seq; keeps only elements where the condition is truthy.',
          },
          {
            term: 'Ternary Expression (Leading if-else)',
            definition: 'Placed before for; chooses between two result expressions for every element.',
          },
        ],
        bulletPoints: [
          'Filter: [x * 10 for x in nums if x % 2 == 0] -> shorter or equal length.',
          'Transform: ["even" if x % 2 == 0 else "odd" for x in nums] -> same length.',
          'Putting else at the end after a trailing if raises a SyntaxError.',
        ],
      },
      visualise: {
        type: 'comprehension-pipeline',
        title: 'Filter vs Ternary Comprehension Pipeline',
        badge: 'simulation',
        description: 'Switch between Filter (if) and Ternary (if-else) to see how list length and elements differ.',
        initialConfig: { mode: 'filter' },
      },
      code: [
        {
          title: 'Filtering vs Ternary Labeling',
          runMode: 'real',
          code: `nums = [1, 2, 3, 4, 5, 6]

evens_times_ten = [n * 10 for n in nums if n % 2 == 0]
labels = ["even" if n % 2 == 0 else "odd" for n in nums]

print("Filtered:", evens_times_ten)
print("Labeled:", labels)`,
          expectedOutput: `Filtered: [20, 40, 60]
Labeled: ['odd', 'even', 'odd', 'even', 'odd', 'even']`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: '[n * 10 for n in nums if n % 2 == 0]',
          internalEffect: 'Trailing if skips 1, 3, 5 and transforms only 2, 4, 6 into [20, 40, 60].',
        },
        {
          step: 2,
          codeLine: 4,
          instruction: '["even" if n % 2 == 0 else "odd" for n in nums]',
          internalEffect: 'Leading ternary runs for all 6 items, producing a 6-element list of labels.',
        },
      ],
      apply: {
        domain: 'Telemetry & Alerting',
        contextTitle: 'Flagging High-Latency Requests',
        scenario: 'Extract only slow latencies (> 200ms) while also tagging every request as OK or SLOW.',
        code: `latencies = [95, 240, 180, 310]
alerts = [ms for ms in latencies if ms > 200]
statuses = ["SLOW" if ms > 200 else "OK" for ms in latencies]
print("Alerts:", alerts)
print("Statuses:", statuses)`,
        outcome: `Alerts: [240, 310]
Statuses: ['OK', 'SLOW', 'OK', 'SLOW']`,
      },
      commonMistakes: [
        {
          label: 'Putting if-else After the for Clause',
          erroneousCode: `nums = [1, 2, 3]
res = [n for n in nums if n % 2 == 0 else 0]`,
          errorMessage: 'SyntaxError: invalid syntax',
          explanation: 'A trailing if is a filter clause and cannot have an else. Move the if-else ternary expression before the for keyword.',
          correctedCode: `nums = [1, 2, 3]
res = [n if n % 2 == 0 else 0 for n in nums]
print(res)`,
        },
      ],
      sourceNotes: 'Covers conditional comprehensions from Asabeneh Day 13.',
      practise: [
        {
          id: 'd13-s2-ex1',
          title: 'Fill the Gaps: Filtering High-Value Refunds',
          type: 'fill-the-gaps',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Finance Audit Filter',
          prompt: 'Complete the list comprehension to keep only refund amounts strictly greater than 50.',
          gaps: [
            {
              id: 'gap-1',
              beforeText: 'large = [amt ',
              afterText: ' amt in refunds ',
              correctAnswer: 'for',
              options: ['for', 'in', 'if'],
            },
            {
              id: 'gap-2',
              beforeText: ' amt in refunds ',
              afterText: ' amt > 50]',
              correctAnswer: 'if',
              options: ['if', 'else', 'while'],
            },
          ],
          hints: [
            'First keyword introduces iteration over refunds.',
            'Second keyword introduces the trailing filter condition.',
            'Pattern: [x for x in seq if cond].',
          ],
        },
        {
          id: 'd13-s2-ex2',
          title: 'Explain Trace: Combined Filter & Ternary',
          type: 'explain-the-trace',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Exam Grading Pipeline',
          prompt: 'Trace `grades = ["PASS" if s >= 70 else "FAIL" for s in [85, -1, 60] if s > 0]`. Explain why `grades` has 2 elements instead of 3 and what each element is.',
          traceStepCode: `scores = [85, -1, 60]
grades = ["PASS" if s >= 70 else "FAIL" for s in scores if s > 0]
print(grades)`,
          traceQuestion: 'Which clause runs first for each element: the trailing `if s > 0` or the leading `"PASS" if s >= 70 else "FAIL"`?',
          modelAnswer: 'The trailing filter `if s > 0` runs first as a gatekeeper, skipping -1. For the remaining items (85 and 60), the leading ternary maps 85 to "PASS" and 60 to "FAIL", producing ["PASS", "FAIL"].',
          markingCriteria: [
            { id: 'mc-1', label: 'Identifies trailing if s > 0 filters out -1 first', points: 10 },
            { id: 'mc-2', label: 'Correctly derives ["PASS", "FAIL"]', points: 10 },
          ],
          hints: [
            'Check which items satisfy s > 0.',
            'Does -1 ever reach the ternary expression?',
            'Evaluate 85 >= 70 and 60 >= 70.',
          ],
        },
        {
          id: 'd13-s2-ex3',
          title: 'Fix the Bug: Misplaced else After Trailing if',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 15,
          contextScenario: 'Inventory Status Tagging',
          prompt: 'Fix the comprehension so quantities > 0 become `"IN_STOCK"` and 0 becomes `"OUT"`.',
          starterCode: `qty = [5, 0, 12]
tags = ["IN_STOCK" for q in qty if q > 0 else "OUT"]
print(tags)`,
          solutionCode: `qty = [5, 0, 12]
tags = ["IN_STOCK" if q > 0 else "OUT" for q in qty]
print(tags)`,
          testCases: [
            { id: 'tc-1', label: 'Tags match stock status', setup: '', expected: "['IN_STOCK', 'OUT', 'IN_STOCK']", hidden: false },
          ],
          hints: [
            'Trailing if cannot have an else.',
            'Move the if-else ternary expression before the for keyword.',
            '["IN_STOCK" if q > 0 else "OUT" for q in qty].',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day13-sub3',
      number: 3,
      title: 'Nested Loops & Flattening Matrix Structures',
      summary: 'Use multiple for clauses in a comprehension to flatten nested lists or build Cartesian pairs.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Multi-Clause Comprehensions: Left-to-Right Loop Order',
        paragraphs: [
          'A list comprehension can contain multiple `for` clauses, such as `[x for row in matrix for x in row]`. Beginners often get confused about which loop is the outer loop and which is the inner loop.',
          'The rule is simple: **the `for` clauses appear in the exact same left-to-right order as nested `for` statements**. The first `for` is the outer loop; the second `for` is the inner loop.',
          'You can also build nested 2D lists (a list of lists) by placing a comprehension *inside* the expression part of an outer comprehension: `[[r * c for c in cols] for r in rows]`.',
        ],
        keyTerms: [
          {
            term: 'Flattening',
            definition: 'Converting a nested sequence (like a 2D matrix [[1, 2], [3, 4]]) into a single 1D list [1, 2, 3, 4].',
          },
          {
            term: 'Cartesian Product',
            definition: 'All (a, b) combinations formed by pairing every element of iterable A with every element of iterable B.',
          },
        ],
        bulletPoints: [
          'Left-to-right order: [x for row in matrix for x in row] == for row in matrix: for x in row: ...',
          'Flattening produces a 1D list; nested brackets [[...] for ...] produce a 2D list.',
          'Keep nested comprehensions to at most two for clauses for readability.',
        ],
      },
      visualise: {
        type: 'comprehension-pipeline',
        title: 'Nested Matrix Flattening Pipeline',
        badge: 'simulation',
        description: 'Inspect how outer and inner for clauses iterate left-to-right to flatten a 2D matrix.',
        initialConfig: { mode: 'flatten' },
      },
      code: [
        {
          title: 'Flattening a Matrix & Building Pairs',
          runMode: 'real',
          code: `matrix = [[1, 2], [3, 4], [5, 6]]
flat = [num for row in matrix for num in row]
print("Flattened:", flat)

pairs = [(r, c) for r in ("A", "B") for c in (1, 2)]
print("Pairs:", pairs)`,
          expectedOutput: `Flattened: [1, 2, 3, 4, 5, 6]
Pairs: [('A', 1), ('A', 2), ('B', 1), ('B', 2)]`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: '[num for row in matrix for num in row]',
          internalEffect: 'Outer loop binds row to [1,2], then [3,4], then [5,6]; inner loop yields each num into flat.',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: '[(r, c) for r in ("A", "B") for c in (1, 2)]',
          internalEffect: 'Generates all 4 ordered coordinate tuples in row-major order.',
        },
      ],
      apply: {
        domain: 'Data Ingestion',
        contextTitle: 'Flattening Nested Batch Records',
        scenario: 'Combine user IDs from multiple regional shards into a single deduplicated list.',
        code: `shards = [[101, 102], [103], [104, 105]]
all_ids = [uid for shard in shards for uid in shard]
print("All IDs:", all_ids)`,
        outcome: `All IDs: [101, 102, 103, 104, 105]`,
      },
      commonMistakes: [
        {
          label: 'Reversing Outer and Inner Loops When Flattening',
          erroneousCode: `matrix = [[1, 2], [3, 4]]
# NameError: 'row' is referenced before 'for row in matrix'
flat = [num for num in row for row in matrix]`,
          errorMessage: "NameError: name 'row' is not defined",
          explanation: 'Python evaluates comprehension clauses left-to-right. The outer loop (for row in matrix) must come before the inner loop (for num in row).',
          correctedCode: `matrix = [[1, 2], [3, 4]]
flat = [num for row in matrix for num in row]
print(flat)`,
        },
      ],
      sourceNotes: 'Covers nested list comprehensions from Asabeneh Day 13.',
      practise: [
        {
          id: 'd13-s3-ex1',
          title: 'Write Code: Flatten & Filter Positive Readings',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'Sensor Batch Flattening',
          prompt: 'Given `batches = [[10, -2], [0, 25], [30]]`, use a single nested list comprehension to produce a flat list of all numbers strictly greater than 0, and print it.',
          starterCode: `batches = [[10, -2], [0, 25], [30]]
positives = []  # Replace with a nested comprehension
print(positives)`,
          solutionCode: `batches = [[10, -2], [0, 25], [30]]
positives = [n for batch in batches for n in batch if n > 0]
print(positives)`,
          testCases: [
            { id: 'tc-1', label: 'Flattens and filters > 0', setup: '', expected: '[10, 25, 30]', hidden: false },
          ],
          hints: [
            'Outer loop: for batch in batches.',
            'Inner loop: for n in batch.',
            'Add trailing filter: if n > 0.',
          ],
        },
        {
          id: 'd13-s3-ex2',
          title: 'Order the Lines: Matrix Flatten Script',
          type: 'order-the-lines',
          tier: 'foundation',
          points: 10,
          contextScenario: '2D Grid Flattening',
          prompt: 'Arrange the lines in the correct order to define `grid`, flatten it with a comprehension, and print the flattened list.',
          jumbledLines: [
            { id: 'l1', code: 'grid = [[1, 2], [3, 4]]', indent: 0 },
            { id: 'l2', code: 'flat = [cell for row in grid for cell in row]', indent: 0 },
            { id: 'l3', code: 'print(flat)', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3'],
          hints: [
            'Define grid before iterating over it.',
            'Compute flat next.',
            'Print flat last.',
          ],
        },
        {
          id: 'd13-s3-ex3',
          title: 'Write Code: Region-Tier Cartesian Matrix',
          type: 'write-code',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Cloud Deployment Matrix',
          prompt: 'Use a nested list comprehension over `regions = ["us", "eu"]` and `tiers = ["dev", "prod"]` to generate `["us-dev", "us-prod", "eu-dev", "eu-prod"]` and print it.',
          starterCode: `regions = ["us", "eu"]
tiers = ["dev", "prod"]
targets = []  # Replace with comprehension
print(targets)`,
          solutionCode: `regions = ["us", "eu"]
tiers = ["dev", "prod"]
targets = [f"{r}-{t}" for r in regions for t in tiers]
print(targets)`,
          testCases: [
            { id: 'tc-1', label: 'Generates all 4 region-tier strings', setup: '', expected: "['us-dev', 'us-prod', 'eu-dev', 'eu-prod']", hidden: false },
          ],
          hints: [
            'Put for r in regions first (outer loop).',
            'Put for t in tiers second (inner loop).',
            'Use f"{r}-{t}" as the output expression.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day13-sub4',
      number: 4,
      title: 'Set & Dictionary Comprehensions',
      summary: 'Use curly-brace comprehensions to build deduplicated sets {expr for x in seq} and dictionaries {k: v for k, v in items}.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Beyond Lists: Set {x} and Dict {k: v} Comprehensions',
        paragraphs: [
          'The same comprehension engine works for **sets** and **dictionaries** by replacing square brackets `[]` with curly braces `{}`.',
          'A **set comprehension** `{expr for x in iterable}` produces an unordered collection of **unique** elements—duplicates are automatically discarded as items are inserted.',
          'A **dictionary comprehension** `{key_expr: val_expr for item in iterable}` includes a colon `:` separating the key and value expressions. It is ideal for transforming existing dictionaries (filtering keys, adjusting values, or inverting `{v: k}`) and indexing lists by an ID.',
        ],
        keyTerms: [
          {
            term: 'Set Comprehension',
            definition: 'Curly-brace comprehension {expr for x in seq} without a colon, yielding a deduplicated set.',
          },
          {
            term: 'Dict Comprehension',
            definition: 'Curly-brace comprehension {k: v for ...} with a colon, yielding a dictionary.',
          },
        ],
        bulletPoints: [
          'Set comprehension: {w.lower() for w in words} removes case-insensitive duplicates.',
          'Dict comprehension: {k: v * 2 for k, v in prices.items() if v > 10}.',
          'Note: {} alone is an empty dict, not an empty set (use set() for an empty set).',
        ],
      },
      visualise: {
        type: 'dict-set-comp-lab',
        title: 'Set & Dictionary Comprehension Lab',
        badge: 'simulation',
        description: 'Inspect automatic deduplication in set comprehensions and key overwrites in dict comprehensions.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Set Deduplication & Dict Mapping',
          runMode: 'real',
          code: `tags = ["Python", "python", "API", "api", "CLI"]
unique_tags = sorted({t.lower() for t in tags})
print("Unique:", unique_tags)

scores = {"Ada": 92, "Lin": 68, "Kai": 85}
passing = {name: s for name, s in scores.items() if s >= 80}
print("Passing:", passing)`,
          expectedOutput: `Unique: ['api', 'cli', 'python']
Passing: {'Ada': 92, 'Kai': 85}`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: '{t.lower() for t in tags}',
          internalEffect: 'Builds a set of lowercased tags, automatically collapsing "Python"/"python" and "API"/"api".',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: '{name: s for name, s in scores.items() if s >= 80}',
          internalEffect: 'Unpacks (name, s) pairs from scores.items(), keeps entries >= 80, and constructs a new dict.',
        },
      ],
      apply: {
        domain: 'Configuration Management',
        contextTitle: 'Building a Fast Lookup Index by ID',
        scenario: 'Index a list of user tuples into an O(1) lookup dictionary.',
        code: `users = [(101, "Ada"), (102, "Grace"), (103, "Lin")]
by_id = {uid: name for uid, name in users}
print("User 102:", by_id[102])`,
        outcome: `User 102: Grace`,
      },
      commonMistakes: [
        {
          label: 'Forgetting .items() When Iterating a Dictionary in a Comprehension',
          erroneousCode: `scores = {"Ada": 92, "Kai": 85}
# Iterating scores directly yields only keys ("Ada"), not (k, v) pairs!
doubled = {k: v * 2 for k, v in scores}`,
          errorMessage: 'ValueError: too many values to unpack (expected 2)',
          explanation: 'Iterating a dict yields its keys only. Always call scores.items() when unpacking key-value pairs.',
          correctedCode: `scores = {"Ada": 92, "Kai": 85}
doubled = {k: v * 2 for k, v in scores.items()}
print(doubled)`,
        },
      ],
      sourceNotes: 'Expands Day 13 with set and dictionary comprehensions.',
      practise: [
        {
          id: 'd13-s4-ex1',
          title: 'Scenario: Set vs Dict Comprehension Braces',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Domain Deduplication',
          prompt: 'What type does `res = {d.lower() for d in ["A.com", "a.com", "B.com"]}` produce?',
          options: [
            { id: 'opt-1', text: 'A set containing {"a.com", "b.com"} because there is no colon (:).', explanation: 'Correct! Curly braces without key: value produce a set comprehension.', isCorrect: true },
            { id: 'opt-2', text: 'A dict with None values.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'A list of 3 strings.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'A tuple.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Look for a colon (:) inside the curly braces.',
            'No colon in {... for ...} means set comprehension.',
            'Sets automatically deduplicate equal items.',
          ],
        },
        {
          id: 'd13-s4-ex2',
          title: 'Fix the Bug: Dict Comprehension Missing .items()',
          type: 'fix-the-bug',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Price Markup Pipeline',
          prompt: 'Fix the dictionary comprehension so it increases every price in `menu` by 10 (e.g., `"tea": 13`).',
          starterCode: `menu = {"tea": 3, "cake": 5}
updated = {item: price + 10 for item, price in menu}
print(updated)`,
          solutionCode: `menu = {"tea": 3, "cake": 5}
updated = {item: price + 10 for item, price in menu.items()}
print(updated)`,
          testCases: [
            { id: 'tc-1', label: 'Marks up all menu items', setup: '', expected: "{'tea': 13, 'cake': 15}", hidden: false },
          ],
          hints: [
            'Iterating a dict directly yields keys only.',
            'How do you iterate (key, value) pairs of a dict?',
            'Use menu.items().',
          ],
        },
        {
          id: 'd13-s4-ex3',
          title: 'Predict Output: Dict Inversion Collision',
          type: 'predict-output',
          tier: 'standard',
          points: 15,
          contextScenario: 'Reverse Lookup Table',
          prompt: 'What does `inv = {v: k for k, v in [("x", 1), ("y", 1), ("z", 2)]}; print(inv)` output?',
          options: [
            { id: 'opt-1', text: "{1: 'y', 2: 'z'}", explanation: 'Correct! Key 1 is first mapped to "x", then overwritten by "y".', isCorrect: true },
            { id: 'opt-2', text: "{1: 'x', 2: 'z'}", explanation: 'Incorrect. Later keys overwrite earlier ones.', isCorrect: false },
            { id: 'opt-3', text: "{1: ['x', 'y'], 2: 'z'}", explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'KeyError', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Dict keys must be unique.',
            'When ("y", 1) is processed, key 1 already exists.',
            'The newer value overwrites the older value.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day13-sub5',
      number: 5,
      title: 'Generator Expressions & Lazy Evaluation',
      summary: 'Replace [] with () to create memory-efficient generator expressions that compute values on demand.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Parentheses () = Lazy Generator, Not Tuple Comprehension',
        paragraphs: [
          'What happens if you replace square brackets `[]` with parentheses `()` in `(x * x for x in range(1000))`? Python does **not** create a tuple comprehension—it creates a **generator expression**!',
          'Unlike a list comprehension, which computes and stores every single element in RAM immediately (eager evaluation), a generator expression computes **one item at a time on demand** (lazy evaluation) and uses O(1) constant memory regardless of sequence size.',
          'Generator expressions are ideal as arguments to reduction functions like `sum()`, `any()`, `all()`, `min()`, and `max()`. Remember one key rule: a generator is **single-pass**—once exhausted, iterating it a second time yields nothing.',
        ],
        keyTerms: [
          {
            term: 'Generator Expression',
            definition: 'A parenthesized comprehension (expr for x in iterable) that produces values lazily one at a time.',
          },
          {
            term: 'Lazy Evaluation',
            definition: 'Deferring computation until the consumer (such as sum() or next()) actually requests the next item.',
          },
        ],
        bulletPoints: [
          'sum(x * x for x in range(1000)) avoids allocating a 1000-element temporary list.',
          'Extra parentheses are optional when a generator is the sole argument to a function.',
          'Generators are exhausted after one full pass; convert with list(gen) if you need indexing or reuse.',
        ],
      },
      visualise: {
        type: 'comprehension-pipeline',
        title: 'Eager List vs Lazy Generator Pipeline',
        badge: 'simulation',
        description: 'Compare how comprehensions materialize all items at once vs streaming one item at a time.',
        initialConfig: { mode: 'basic' },
      },
      code: [
        {
          title: 'Memory-Efficient Aggregation with Generator Expressions',
          runMode: 'real',
          code: `total = sum(n * n for n in range(1, 6))
print("Sum of squares:", total)

nums = [4, 8, 12, 16]
all_even = all(n % 2 == 0 for n in nums)
print("All even:", all_even)`,
          expectedOutput: `Sum of squares: 55
All even: True`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'sum(n * n for n in range(1, 6))',
          internalEffect: 'Streams 1, 4, 9, 16, 25 one by one into sum() without allocating an intermediate list.',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: 'all(n % 2 == 0 for n in nums)',
          internalEffect: 'Short-circuits immediately if any element fails the condition, saving CPU and RAM.',
        },
      ],
      apply: {
        domain: 'Log Analytics',
        contextTitle: 'Scanning Large Telemetry Streams',
        scenario: 'Check if any error latency exceeds 500ms without materializing a filtered list.',
        code: `latencies = [120, 145, 520, 90]
has_spike = any(ms > 500 for ms in latencies)
print("Spike detected:", has_spike)`,
        outcome: `Spike detected: True`,
      },
      commonMistakes: [
        {
          label: 'Trying to Index or Reuse an Exhausted Generator',
          erroneousCode: `gen = (x * 2 for x in [1, 2, 3])
print(sum(gen))
print(list(gen))  # Empty! gen was already exhausted by sum()`,
          errorMessage: 'Logic bug: second pass prints [] instead of [2, 4, 6]',
          explanation: 'A generator yields its items once and then becomes exhausted. Use a list comprehension if you need to iterate multiple times or index with [0].',
          correctedCode: `items = [x * 2 for x in [1, 2, 3]]
print(sum(items))
print(items)`,
        },
      ],
      sourceNotes: 'Enrichment bridging comprehensions and memory-efficient iteration.',
      practise: [
        {
          id: 'd13-s5-ex1',
          title: 'Theory: Generator Expression Exhaustion',
          type: 'theory-reasoning',
          tier: 'standard',
          points: 15,
          contextScenario: 'Streaming Telemetry Pipeline',
          prompt: 'A developer writes `g = (x * 2 for x in [1, 2, 3])`, calls `sum(g)`, and then calls `list(g)` expecting `[2, 4, 6]`, but gets `[]`. Explain why.',
          modelAnswer: '(x * 2 for x in [1, 2, 3]) creates a lazy single-pass generator object, not a tuple or reusable list. Calling sum(g) consumes all yielded items to exhaustion, so a subsequent list(g) sees an exhausted iterator and returns [].',
          markingCriteria: [
            { id: 'mc-1', label: 'Identifies g as a lazy generator expression (not a tuple)', points: 7 },
            { id: 'mc-2', label: 'Explains generators are single-pass and exhausted after sum(g)', points: 8 },
          ],
          hints: [
            'What does (...) comprehension syntax create?',
            'Can a generator be iterated twice?',
            'sum(g) consumes every item from g.',
          ],
        },
        {
          id: 'd13-s5-ex2',
          title: 'Write Code: Lazy Sum & Threshold Check',
          type: 'write-code',
          tier: 'project',
          points: 20,
          contextScenario: 'Memory-Efficient Sensor Aggregator',
          prompt: 'Using generator expressions (no square brackets), compute `total_ok` as the sum of readings `< 100` in `readings = [40, 120, 60, 80]` and `has_high` using `any(...)` for readings `>= 100`. Print both.',
          starterCode: `readings = [40, 120, 60, 80]
total_ok = 0
has_high = False
print(total_ok, has_high)`,
          solutionCode: `readings = [40, 120, 60, 80]
total_ok = sum(r for r in readings if r < 100)
has_high = any(r >= 100 for r in readings)
print(total_ok, has_high)`,
          testCases: [
            { id: 'tc-1', label: 'Computes 180 and True', setup: '', expected: '180 True', hidden: false },
          ],
          hints: [
            'Pass (r for r in readings if r < 100) directly to sum().',
            'Pass (r >= 100 for r in readings) directly to any().',
            '40 + 60 + 80 = 180.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day13-sub6',
      number: 6,
      title: 'Anonymous lambda Functions & Single-Expression Rules',
      summary: 'Create compact inline functions with lambda args: expression and understand when def is required.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Inline Functions: lambda parameters: expression',
        paragraphs: [
          'A **lambda function** is a small, anonymous (unnamed) function defined inline with the `lambda` keyword: `lambda x, y: x + y`.',
          'Unlike `def`, a `lambda` body **cannot contain statements** (`return`, `if`/`else` blocks, `for` loops, `print` assignments, or multiple lines). It can contain **only a single expression**, whose evaluated value is returned implicitly (you never write `return` inside a `lambda`).',
          'According to PEP 8, you should **not** assign a lambda to a variable like `f = lambda x: x + 1` (use `def f(x): return x + 1` so tracebacks show a real function name). Instead, pass `lambda` directly as an inline callback argument to functions like `sorted()`, `min()`, or `max()`.',
        ],
        keyTerms: [
          {
            term: 'lambda',
            definition: 'Keyword that creates an anonymous single-expression function object.',
          },
          {
            term: 'Implicit Return',
            definition: 'The single expression after the colon is automatically evaluated and returned without writing return.',
          },
        ],
        bulletPoints: [
          'Syntax: lambda arg1, arg2: single_expression.',
          'Supports default parameters and *args/**kwargs just like def.',
          'Never write return inside a lambda—it is a SyntaxError.',
        ],
      },
      visualise: {
        type: 'lambda-evaluator',
        title: 'Lambda Expression Evaluator',
        badge: 'simulation',
        description: 'Inspect how an inline lambda evaluates a single expression per element.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Lambda Syntax & Inline Evaluation',
          runMode: 'real',
          code: `def add_def(a, b):
    return a + b

add_lam = lambda a, b: a + b

print("def:", add_def(3, 4))
print("lambda:", add_lam(3, 4))
print("IIFE:", (lambda x: x ** 3)(4))`,
          expectedOutput: `def: 7
lambda: 7
IIFE: 64`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'add_lam = lambda a, b: a + b',
          internalEffect: 'Creates a function object taking (a, b) and returning a + b.',
        },
        {
          step: 2,
          codeLine: 8,
          instruction: '(lambda x: x ** 3)(4)',
          internalEffect: 'Defines and immediately invokes an anonymous cube function with x=4, returning 64.',
        },
      ],
      apply: {
        domain: 'Formatting Pipelines',
        contextTitle: 'Inline Ternary Logic Inside a Lambda',
        scenario: 'Use a single-expression ternary inside a lambda to clamp negative readings to zero.',
        code: `clamp = lambda v: v if v >= 0 else 0
print([clamp(x) for x in (-5, 0, 12)])`,
        outcome: `[0, 0, 12]`,
      },
      commonMistakes: [
        {
          label: 'Writing return or Statements Inside a lambda',
          erroneousCode: `double = lambda x: return x * 2`,
          errorMessage: 'SyntaxError: invalid syntax',
          explanation: 'lambda only accepts a single expression and returns its result automatically. Remove the return keyword.',
          correctedCode: `double = lambda x: x * 2
print(double(5))`,
        },
      ],
      sourceNotes: 'Covers lambda syntax and constraints from Asabeneh Day 13.',
      practise: [
        {
          id: 'd13-s6-ex1',
          title: 'Explain Trace: Immediate Lambda Invocation',
          type: 'explain-the-trace',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Inline Expression Evaluation',
          prompt: 'Trace `print((lambda a, b: a * b + 1)(3, 4))`. Explain the order in which the lambda is created, bound, and evaluated.',
          traceStepCode: `result = (lambda a, b: a * b + 1)(3, 4)
print(result)`,
          traceQuestion: 'What value does `result` receive and why is no `return` keyword needed?',
          modelAnswer: 'Python first evaluates (lambda a, b: a * b + 1) to an anonymous function object, then immediately invokes it with a=3 and b=4. Because lambda implicitly returns its single expression value, 3 * 4 + 1 = 13 is assigned to result.',
          markingCriteria: [
            { id: 'mc-1', label: 'Explains creation of anonymous function followed by immediate call with (3, 4)', points: 10 },
            { id: 'mc-2', label: 'States implicit return yields 13', points: 10 },
          ],
          hints: [
            'Look at the two sets of parentheses: (lambda ...)(3, 4).',
            'Bind a=3 and b=4.',
            'Compute 3 * 4 + 1.',
          ],
        },
        {
          id: 'd13-s6-ex2',
          title: 'Fix the Bug: Illegal return in lambda',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 15,
          contextScenario: 'Unit Converter Callback',
          prompt: 'Fix the `SyntaxError` in this lambda expression that converts Celsius to Fahrenheit.',
          starterCode: `c_to_f = lambda c: return (c * 9 / 5) + 32
print(c_to_f(0))`,
          solutionCode: `c_to_f = lambda c: (c * 9 / 5) + 32
print(c_to_f(0))`,
          testCases: [
            { id: 'tc-1', label: 'Converts 0C to 32.0F', setup: '', expected: '32.0', hidden: false },
          ],
          hints: [
            'Can a lambda contain the return keyword?',
            'A lambda body is a single expression, not a statement.',
            'Remove the word return.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day13-sub7',
      number: 7,
      title: 'Keyed Sorting (sorted, min, max) & When to Use def',
      summary: 'Pass lambda as a key= function to sort complex records, find extrema, and know when to switch back to def.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'The Best Use Case for lambda: key= Callbacks',
        paragraphs: [
          'The single most common production use of `lambda` in Python is the `key=` parameter of `sorted()`, `list.sort()`, `min()`, and `max()`.',
          'When sorting a list of tuples or dictionaries, Python does not know which field you want to sort by (and comparing two dicts directly with `<` raises `TypeError`). Passing `key=lambda item: item["price"]` tells `sorted()` to compute a sort key for each element without modifying the original elements.',
          'Know when to graduate back to `def`: if your key logic needs multiple steps, error handling, a docstring, or reuse in two places, write a named `def` function and pass `key=my_func` (without parentheses).',
        ],
        keyTerms: [
          {
            term: 'key= Parameter',
            definition: 'A one-argument function passed to sorted(), min(), or max() that extracts the comparison value for each item.',
          },
          {
            term: 'PEP 8 E731',
            definition: 'Style rule advising against assigning a lambda to a variable name; always use def for named functions.',
          },
        ],
        bulletPoints: [
          'sorted(records, key=lambda r: r["score"], reverse=True) sorts descending by score.',
          'min(items, key=lambda x: x[1]) returns the full original item with the smallest key.',
          'Use def whenever logic needs >1 expression, a docstring, or reuse.',
        ],
      },
      visualise: {
        type: 'lambda-evaluator',
        title: 'Keyed Sorting & Extrema Visualizer',
        badge: 'simulation',
        description: 'Trace how key=lambda computes a rankable key for each tuple, dict, or string.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Sorting Records & Finding Extrema with key=lambda',
          runMode: 'real',
          code: `products = [
    {"sku": "B", "price": 12},
    {"sku": "A", "price": 45},
    {"sku": "C", "price": 19},
]

by_price = sorted(products, key=lambda p: p["price"])
priciest = max(products, key=lambda p: p["price"])
print("Sorted SKUs:", [p["sku"] for p in by_price])
print("Priciest:", priciest["sku"], priciest["price"])`,
          expectedOutput: `Sorted SKUs: ['B', 'C', 'A']
Priciest: A 45`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 7,
          instruction: 'sorted(products, key=lambda p: p["price"])',
          internalEffect: 'Calls the lambda on each dict to extract 12, 45, 19 and returns a new sorted list of the full dicts.',
        },
        {
          step: 2,
          codeLine: 8,
          instruction: 'max(products, key=lambda p: p["price"])',
          internalEffect: 'Finds the dictionary whose extracted price key is largest (45 -> SKU A).',
        },
      ],
      apply: {
        domain: 'Leaderboard Systems',
        contextTitle: 'Multi-Key Tie-Breaking Sort',
        scenario: 'Sort players by score descending, breaking ties by name ascending.',
        code: `players = [("Lin", 90), ("Ada", 90), ("Kai", 85)]
ranked = sorted(players, key=lambda p: (-p[1], p[0]))
print("Ranked:", ranked)`,
        outcome: `Ranked: [('Ada', 90), ('Lin', 90), ('Kai', 85)]`,
      },
      commonMistakes: [
        {
          label: 'Sorting Dictionaries Directly Without key=lambda',
          erroneousCode: `items = [{"a": 2}, {"a": 1}]
print(sorted(items))`,
          errorMessage: "TypeError: '<' not supported between instances of 'dict' and 'dict'",
          explanation: 'Python dictionaries have no natural < ordering. Always supply a key= function that returns a comparable value.',
          correctedCode: `items = [{"a": 2}, {"a": 1}]
print(sorted(items, key=lambda d: d["a"]))`,
        },
      ],
      sourceNotes: 'Covers lambda sorting patterns and PEP 8 best practices for Day 13.',
      practise: [
        {
          id: 'd13-s7-ex1',
          title: 'Write Code: Multi-Key Leaderboard Sort',
          type: 'write-code',
          tier: 'project',
          points: 20,
          contextScenario: 'Tournament Tie-Breaker',
          prompt: 'Sort `entries = [("Zed", 80), ("Ada", 95), ("Lin", 80)]` by score descending, breaking ties by name ascending, using `sorted(..., key=lambda ...)`. Print the sorted list.',
          starterCode: `entries = [("Zed", 80), ("Ada", 95), ("Lin", 80)]
ranked = []  # Replace using sorted() and key=lambda
print(ranked)`,
          solutionCode: `entries = [("Zed", 80), ("Ada", 95), ("Lin", 80)]
ranked = sorted(entries, key=lambda e: (-e[1], e[0]))
print(ranked)`,
          testCases: [
            { id: 'tc-1', label: 'Sorts descending score then ascending name', setup: '', expected: "[('Ada', 95), ('Lin', 80), ('Zed', 80)]", hidden: false },
          ],
          hints: [
            'Return a tuple (-e[1], e[0]) from the lambda.',
            'Negating the numeric score sorts it descending while keeping name ascending.',
            'sorted(entries, key=lambda e: (-e[1], e[0])).',
          ],
        },
        {
          id: 'd13-s7-ex2',
          title: 'Scenario: Choosing def Over lambda',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'PEP 8 Code Quality Review',
          prompt: 'When should you replace a `lambda` with a `def` function?',
          options: [
            { id: 'opt-1', text: 'When the function needs multiple statements, a docstring, error handling, or a clear name in tracebacks.', explanation: 'Correct! PEP 8 recommends def for anything beyond a simple one-off inline expression.', isCorrect: true },
            { id: 'opt-2', text: 'Whenever you pass a key= function to sorted().', explanation: 'Incorrect. Inline key= callbacks are the ideal use case for lambda.', isCorrect: false },
            { id: 'opt-3', text: 'Because lambda cannot accept more than one parameter.', explanation: 'Incorrect. lambda accepts any number of parameters.', isCorrect: false },
            { id: 'opt-4', text: 'Because def runs 100x faster than lambda.', explanation: 'Incorrect. Both compile to the same function object.', isCorrect: false },
          ],
          hints: [
            'Think about readability, docstrings, and multi-line logic.',
            'Remember PEP 8 E731.',
            'One-off key= callbacks are great for lambda; complex logic belongs in def.',
          ],
        },
      ],
      assess: [],
    },
  ],
  realWorldLabs: [
    {
      id: 'day13-lab1',
      title: 'Inventory Normalization & Deduplication Pipeline',
      description: 'Use list, set, and dict comprehensions to clean raw SKU tags, extract unique categories, and build a price lookup dictionary.',
      domain: 'E-Commerce Catalog Engineering',
      starterCode: `raw_items = [
    ("  sku-1 ", "Audio", 49),
    ("sku-2", "audio", 89),
    ("SKU-3 ", "Video", 120),
]

# 1. Build clean_skus list comprehension: strip() and upper()
# 2. Build unique_cats sorted set comprehension of lowercased categories
# 3. Build high_value dict comprehension of {sku.strip().upper(): price} for price >= 80
clean_skus = [s.strip().upper() for s, _, _ in raw_items]
unique_cats = sorted({c.lower() for _, c, _ in raw_items})
high_value = {s.strip().upper(): p for s, _, p in raw_items if p >= 80}

print("SKUs:", clean_skus)
print("Cats:", unique_cats)
print("High:", high_value)`,
      targetOutput: `SKUs: ['SKU-1', 'SKU-2', 'SKU-3']
Cats: ['audio', 'video']
High: {'SKU-2': 89, 'SKU-3': 120}`,
    },
    {
      id: 'day13-lab2',
      title: 'Multi-Criteria Incident Triage Sorter',
      description: 'Use sorted() with a lambda key function to prioritize incidents by severity descending, then age descending.',
      domain: 'Site Reliability Engineering',
      starterCode: `incidents = [
    {"id": "INC-1", "sev": 2, "age_min": 45},
    {"id": "INC-2", "sev": 1, "age_min": 10},
    {"id": "INC-3", "sev": 2, "age_min": 90},
]

# Sort by sev ascending (1 is highest priority), then age_min descending
ordered = sorted(incidents, key=lambda inc: (inc["sev"], -inc["age_min"]))
print("Triage:", [i["id"] for i in ordered])`,
      targetOutput: `Triage: ['INC-3', 'INC-1', 'INC-2']`,
    },
  ],
  miniProject: {
    id: 'day13-project',
    title: 'Data Transformation & Keyed Ranking Engine',
    brief: 'Build a declarative data pipeline that flattens nested batch records, deduplicates tags with a set comprehension, indexes records with a dict comprehension, and ranks items using lambda key= sorting.',
    requirements: [
      'Flatten a 2D list of transaction batches with a two-clause list comprehension',
      'Apply a conditional filter (if) and an inline ternary (if-else) comprehension',
      'Deduplicate normalized tags using a set comprehension {expr for ...}',
      'Build an ID-to-record lookup dictionary using a dict comprehension {k: v for ...}',
      'Sort records by multi-field criteria using sorted(..., key=lambda ...)',
    ],
    rubric: [
      { criterion: 'List, set, and dict comprehension accuracy & readability', weight: 40 },
      { criterion: 'Conditional filter vs ternary correctness', weight: 30 },
      { criterion: 'Lambda key= sorting & PEP 8 compliance', weight: 30 },
    ],
    starterCode: `# Data Transformation & Keyed Ranking Engine
batches = [
    [{"id": "T1", "amt": 120, "tag": " Web "}, {"id": "T2", "amt": 15, "tag": "mobile"}],
    [{"id": "T3", "amt": 240, "tag": "WEB"}],
]

# 1. Flatten batches into flat_tx
# 2. Extract unique lowercased tags into unique_tags
# 3. Build lookup dict by_id and sort high-value (>= 50) transactions descending
`,
  },
  dayQuiz: {
    title: 'Day 13 Mastery Checkpoint Quiz: Comprehensions & Lambdas',
    passingScorePercentage: 80,
    questions: [
      {
        id: 'd13-q1',
        scenario: 'List Comprehension Syntax',
        question: 'What does `[x * 2 for x in [1, 2, 3]]` evaluate to?',
        options: [
          { id: 'q1-a', text: '[2, 4, 6]', explanation: 'Correct! Each element is doubled into a new list.', isCorrect: true },
          { id: 'q1-b', text: '[1, 2, 3]', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q1-c', text: '(2, 4, 6)', explanation: 'Incorrect. Square brackets create a list.', isCorrect: false },
          { id: 'q1-d', text: '12', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd13-q2',
        scenario: 'Filter vs Ternary',
        question: 'Where must an `if-else` expression be placed in `[ ... for x in seq]`?',
        options: [
          { id: 'q2-a', text: 'Before the `for` keyword (e.g., `["even" if x % 2 == 0 else "odd" for x in seq]`).', explanation: 'Correct! Leading if-else chooses between two values for every element.', isCorrect: true },
          { id: 'q2-b', text: 'After `seq` (e.g., `[x for x in seq if cond else 0]`).', explanation: 'Incorrect. Trailing if cannot have an else.', isCorrect: false },
          { id: 'q2-c', text: 'Inside `seq`.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q2-d', text: 'Comprehensions do not support else.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd13-q3',
        scenario: 'Nested Loop Order',
        question: 'In `[x for row in matrix for x in row]`, which `for` clause is the outer loop?',
        options: [
          { id: 'q3-a', text: '`for row in matrix` (the leftmost clause).', explanation: 'Correct! Multiple for clauses in a comprehension read left-to-right, outer to inner.', isCorrect: true },
          { id: 'q3-b', text: '`for x in row` (the rightmost clause).', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q3-c', text: 'Both run in parallel.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q3-d', text: 'Python chooses randomly.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd13-q4',
        scenario: 'Set Comprehension',
        question: 'What is `len({x % 3 for x in range(10)})`?',
        options: [
          { id: 'q4-a', text: '3 (because the set deduplicates to {0, 1, 2}).', explanation: 'Correct! Remainders modulo 3 are only 0, 1, and 2.', isCorrect: true },
          { id: 'q4-b', text: '10', explanation: 'Incorrect. That would be a list comprehension.', isCorrect: false },
          { id: 'q4-c', text: '0', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q4-d', text: 'Raises TypeError.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd13-q5',
        scenario: 'Dictionary Comprehension',
        question: 'Which expression swaps keys and values of a dict `d`?',
        options: [
          { id: 'q5-a', text: '{v: k for k, v in d.items()}', explanation: 'Correct! d.items() yields (k, v) pairs and {v: k} swaps them.', isCorrect: true },
          { id: 'q5-b', text: '{v: k for k, v in d}', explanation: 'Incorrect. Iterating d without .items() yields keys only.', isCorrect: false },
          { id: 'q5-c', text: '[v: k for k, v in d.items()]', explanation: 'Incorrect. Dict comprehensions use {}, not [].', isCorrect: false },
          { id: 'q5-d', text: '{k, v for k, v in d.items()}', explanation: 'Incorrect. Missing colon makes it a set of tuples.', isCorrect: false },
        ],
      },
      {
        id: 'd13-q6',
        scenario: 'Generator Expressions',
        question: 'What does `(x * x for x in range(5))` create?',
        options: [
          { id: 'q6-a', text: 'A lazy generator object that yields values one at a time.', explanation: 'Correct! Parentheses around a comprehension create a generator expression, not a tuple.', isCorrect: true },
          { id: 'q6-b', text: 'A tuple (0, 1, 4, 9, 16).', explanation: 'Incorrect. Use tuple(...) for a tuple.', isCorrect: false },
          { id: 'q6-c', text: 'A list [0, 1, 4, 9, 16].', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q6-d', text: 'A SyntaxError.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd13-q7',
        scenario: 'Lambda Syntax',
        question: 'Which statement about `lambda` functions in Python is true?',
        options: [
          { id: 'q7-a', text: 'A lambda can only contain a single expression and returns its result implicitly without `return`.', explanation: 'Correct! Statements like return or multi-line blocks are not allowed in lambda.', isCorrect: true },
          { id: 'q7-b', text: 'A lambda must always end with `return`.', explanation: 'Incorrect. Writing return in lambda is a SyntaxError.', isCorrect: false },
          { id: 'q7-c', text: 'A lambda can only take one parameter.', explanation: 'Incorrect. lambda x, y: x + y takes two.', isCorrect: false },
          { id: 'q7-d', text: 'A lambda cannot have default parameter values.', explanation: 'Incorrect. lambda x, y=1: x + y is valid.', isCorrect: false },
        ],
      },
      {
        id: 'd13-q8',
        scenario: 'Keyed Sorting',
        question: 'How do you sort `words = ["pear", "fig", "apple"]` by string length shortest-first?',
        options: [
          { id: 'q8-a', text: 'sorted(words, key=lambda w: len(w))', explanation: 'Correct! key= extracts len(w) for each word.', isCorrect: true },
          { id: 'q8-b', text: 'sorted(words, lambda w: len(w))', explanation: 'Incorrect. key= is a keyword-only argument in sorted().', isCorrect: false },
          { id: 'q8-c', text: 'sorted(words, key=len(w))', explanation: 'Incorrect. That tries to call len(w) immediately.', isCorrect: false },
          { id: 'q8-d', text: 'words.sort(reverse=True)', explanation: 'Incorrect. That sorts reverse-alphabetically.', isCorrect: false },
        ],
      },
      {
        id: 'd13-q9',
        scenario: 'Comprehension Scope',
        question: 'In Python 3, if `i = 10` exists before `[i for i in range(3)]`, what is `i` afterward?',
        options: [
          { id: 'q9-a', text: '10 — comprehension loop variables are locally scoped and do not leak.', explanation: 'Correct! Unlike regular for loops, comprehensions do not overwrite outer variables.', isCorrect: true },
          { id: 'q9-b', text: '2', explanation: 'Incorrect. That was Python 2 behavior.', isCorrect: false },
          { id: 'q9-c', text: '3', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q9-d', text: 'NameError', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd13-q10',
        scenario: 'PEP 8 Best Practice',
        question: 'Why does PEP 8 discourage `sq = lambda x: x * x`?',
        options: [
          { id: 'q10-a', text: 'A def function gives the function a real __name__ for clearer tracebacks and debugging.', explanation: 'Correct! Use def for named functions and reserve lambda for inline callbacks.', isCorrect: true },
          { id: 'q10-b', text: 'Because lambda cannot be assigned to a variable.', explanation: 'Incorrect. It is legal syntax, just discouraged by PEP 8.', isCorrect: false },
          { id: 'q10-c', text: 'Because lambda raises DeprecationWarning.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q10-d', text: 'Because lambda cannot multiply numbers.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
    ],
  },
  cheatSheet: [
    {
      category: 'List Comprehension Syntax & Scope Isolation',
      syntax: '[expr for item in iterable]',
      description: 'Creates a brand-new list by evaluating expr for each item. In Python 3, the loop variable is locally scoped and never leaks into the enclosing namespace. Never use comprehensions solely for side effects like print().',
      example: `nums = [2, 3, 4]
squares = [n * n for n in nums]
print(squares)  # [4, 9, 16]`,
    },
    {
      category: 'Trailing Filter (if) vs Leading Ternary (if-else)',
      syntax: 'Filter:  [x for x in seq if cond]\nTernary: [a if cond else b for x in seq]',
      description: 'A trailing if filters out elements (shorter or equal list). A leading if-else transforms every element (same length). Never put else after a trailing if.',
      example: `nums = [1, 2, 3, 4]
evens = [n for n in nums if n % 2 == 0]
labels = ["E" if n % 2 == 0 else "O" for n in nums]`,
    },
    {
      category: 'Nested Loops & Matrix Flattening',
      syntax: '[x for row in matrix for x in row]',
      description: 'Multiple for clauses read left-to-right in the exact order of nested for loops (outer loop first, inner loop second). Use [[...] for ...] to build a 2D list.',
      example: `matrix = [[1, 2], [3, 4]]
flat = [x for row in matrix for x in row]
print(flat)  # [1, 2, 3, 4]`,
    },
    {
      category: 'Set {expr} & Dictionary {k: v} Comprehensions',
      syntax: 'Set:  {expr for x in seq}\nDict: {k: v for k, v in d.items()}',
      description: 'Curly braces without a colon build a deduplicated set; braces with a colon build a dict. Always call .items() when iterating key-value pairs of an existing dictionary.',
      example: `tags = ["Py", "py", "API"]
unique = {t.lower() for t in tags}
doubled = {k: v * 2 for k, v in {"a": 1, "b": 2}.items()}`,
    },
    {
      category: 'Generator Expressions & Lazy Evaluation',
      syntax: 'sum(x * x for x in range(1000))',
      description: 'Parentheses (...) around a comprehension create a lazy, single-pass generator expression—NOT a tuple comprehension. Ideal for sum(), any(), all(), min(), and max() with O(1) memory.',
      example: `nums = [10, 20, 30]
total = sum(n * 2 for n in nums)
print(total)  # 120`,
    },
    {
      category: 'Anonymous lambda Functions & Single-Expression Rule',
      syntax: 'lambda arg1, arg2: single_expression',
      description: 'Creates an inline, unnamed function object that implicitly returns its single expression. Statements (return, loops, assignments) are illegal inside lambda.',
      example: `clamp = lambda v: v if v >= 0 else 0
print(clamp(-5), clamp(12))  # 0 12`,
    },
    {
      category: 'Keyed Sorting (sorted, min, max) & PEP 8 def vs lambda',
      syntax: 'sorted(items, key=lambda x: (-x["score"], x["name"]))',
      description: 'Pass lambda to key= for one-off sorting or extrema without mutating elements. Follow PEP 8 E731: use def for named, multi-step, or reusable functions.',
      example: `players = [("Lin", 90), ("Ada", 90), ("Kai", 85)]
ranked = sorted(players, key=lambda p: (-p[1], p[0]))
print(ranked)`,
    },
  ],
  sourceNotes: [
    'Primary curriculum reference: Asabeneh Yetayeh, 30 Days of Python — Day 13: List Comprehension (https://github.com/Asabeneh/30-Days-Of-Python/tree/master/13_Day_List_comprehension).',
    'Enhanced with filter vs ternary disambiguation, set/dict comprehensions, lazy generator expressions, and PEP 8 lambda key= sorting.',
  ],
};
