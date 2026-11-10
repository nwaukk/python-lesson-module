/**
 * Day 10: Loops (Intermediate Python)
 * Part A (Learn) conforming to Sections 10, 13.2, and 14 of the Master Specification.
 * Includes:
 *  - 9 Detailed Subtopics following the 10-step pedagogical structure
 *  - 4 Signature Simulations: iteration-timeline, range-slider, nested-loop-grid, infinite-loop-safety
 *  - Authentic source notes, runnable examples, step-by-step CPython explanations,
 *    fresh practical applications, and common mistake diagnostics.
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_10_MODULE: DayModule = {
  schemaVersion: 1,
  number: 10,
  title: 'Loops',
  level: 'intermediate',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/10_Day_Loops',
  estimatedMinutes: 85,
  prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  objectives: [
    'Control condition-driven repetition with while loops and prevent non-terminating loops',
    'Iterate cleanly over sequences and iterables using for-in loops and accumulator variables',
    'Generate lazy integer progressions with range(start, stop, step), including exclusive stop and negative steps',
    'Traverse strings, lists, tuples, sets, and dictionaries (keys, values, and .items() pairs)',
    'Alter loop control flow using break for early exit and continue to skip to the next pass',
    'Use pass as a syntactic no-op placeholder and master the loop else clause (runs only when no break occurs)',
    'Build and trace nested loops for 2D grids, matrices, and multiplication tables',
    'Diagnose loop variable persistence after loop exit, off-by-one range errors, and mutating-while-iterating bugs',
  ],
  subtopics: [
    {
      id: 'day10-sub1',
      number: 1,
      title: 'while Loops & Condition-Controlled Repetition',
      summary: 'Execute a block repeatedly while a boolean condition remains True, and advance state on every pass so the loop terminates.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Repeating Until a Condition Turns False: The while Loop',
        paragraphs: [
          'Programs frequently need to repeat an action not a fixed number of times, but until a condition changes—such as retrying a network request until it succeeds or draining a queue until it is empty. Python’s `while` loop evaluates a boolean condition before each pass; if it is `True`, the indented body runs, and control jumps back to re-test the condition.',
          'Unlike a `for` loop that pulls items from an iterable, a `while` loop relies entirely on state changes inside its body (such as `count += 1` or updating a flag). If nothing inside the loop ever makes the condition `False`, the loop runs forever—creating an infinite loop.',
          'Because the condition is tested at the top of every iteration, if the condition is `False` on the very first check, the `while` body executes zero times.',
        ],
        keyTerms: [
          {
            term: 'while Loop',
            definition: 'A condition-controlled loop that repeats its indented suite as long as its header expression evaluates to True.',
          },
          {
            term: 'Loop Condition',
            definition: 'The boolean expression evaluated before every iteration (including the first) to decide whether to enter the body.',
          },
          {
            term: 'Loop State Update',
            definition: 'The statement inside the loop body (e.g., count += 1) that moves the program closer to terminating the loop.',
          },
        ],
        bulletPoints: [
          'The while header ends with a colon (:) and its body is indented by 4 spaces.',
          'Condition is checked before every pass; a False initial condition runs 0 times.',
          'Always ensure at least one execution path modifies the condition variable toward False.',
        ],
      },
      visualise: {
        type: 'iteration-timeline',
        title: 'while Loop & Accumulator Timeline',
        badge: 'simulation',
        description: 'Step through each pass of a while loop and inspect the condition test, loop variable, and accumulator.',
        initialConfig: { preset: 'while-countdown' },
      },
      code: [
        {
          title: 'Countdown & Running Total with while',
          runMode: 'real',
          code: `count = 3
total = 0

while count > 0:
    total += count
    print(f"count={count}, total={total}")
    count -= 1

print("Finished! Final count:", count)`,
          expectedOutput: `count=3, total=3
count=2, total=5
count=1, total=6
Finished! Final count: 0`,
          notes: 'Notice count is 0 after the loop exits because the final test 0 > 0 evaluated to False.',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'count = 3; total = 0',
          internalEffect: 'Binds integer objects 3 and 0 to count and total in the current frame.',
        },
        {
          step: 2,
          codeLine: 4,
          instruction: 'while count > 0:',
          internalEffect: 'Evaluates count > 0 (3 > 0 -> True) and enters the loop body.',
        },
        {
          step: 3,
          codeLine: 7,
          instruction: 'count -= 1',
          internalEffect: 'Rebinds count to count - 1; after three passes count reaches 0, causing 0 > 0 -> False.',
          outputEffect: 'Loop exits to line 9 and prints Finished! Final count: 0.',
        },
      ],
      apply: {
        domain: 'Payment Gateways & FinTech',
        contextTitle: 'Exponential Backoff Retry Counter',
        scenario: 'Simulate a payment webhook dispatcher that retries up to 3 attempts while tracking wait delay.',
        code: `attempt = 1
delay_sec = 2
while attempt <= 3:
    print(f"Retry #{attempt}: waiting {delay_sec}s")
    delay_sec *= 2
    attempt += 1`,
        outcome: `Retry #1: waiting 2s
Retry #2: waiting 4s
Retry #3: waiting 8s`,
      },
      commonMistakes: [
        {
          label: 'Forgetting to Update the Loop Variable (Infinite Loop)',
          erroneousCode: `n = 1
while n <= 3:
    print("Processing", n)
    # Missing n += 1!`,
          errorMessage: 'Infinite Loop / Timeout: n remains 1 forever',
          explanation: 'Without modifying n inside the loop body, n <= 3 stays True on every pass.',
          correctedCode: `n = 1
while n <= 3:
    print("Processing", n)
    n += 1`,
        },
      ],
      sourceNotes: 'Inspired by Asabeneh 30 Days of Python Day 10 (while loop section), expanded with state-update invariants.',
      practise: [
        {
          id: 'd10-s1-ex1',
          title: 'Scenario: Water Reservoir Drain Controller',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Automated Irrigation Tank Control',
          prompt: 'A tank starts at `liters = 150`. Each pump cycle drains `40` liters using `while liters > 0: liters -= 40`. How many cycles execute and what is `liters` after the loop stops?',
          options: [
            {
              id: 'opt-1',
              text: '4 cycles execute; liters finishes at -10.',
              explanation: 'Correct! Passes start at 150 -> 110 -> 70 -> 30 -> -10. On the 5th check, -10 > 0 is False, so the loop exits with liters = -10.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: '3 cycles execute; liters finishes at 30.',
              explanation: 'Incorrect. At 30 liters, 30 > 0 is still True, so a 4th cycle runs.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: '4 cycles execute; liters is clamped to 0.',
              explanation: 'Incorrect. Python does not clamp subtraction automatically; 30 - 40 yields -10.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'Infinite loop because liters skips 0.',
              explanation: 'Incorrect. The condition is liters > 0 (not liters != 0), so -10 terminates the loop.',
              isCorrect: false,
            },
          ],
          hints: [
            'Trace liters after each subtraction: 150 - 40 = 110, then 70, then 30...',
            'Check whether 30 > 0 is True before the 4th subtraction.',
            'After 30 - 40 = -10, test -10 > 0.',
          ],
        },
        {
          id: 'd10-s1-ex2',
          title: 'Fix the Bug: Telemetry Battery Poll',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 10,
          contextScenario: 'Drone Battery Charging Monitor',
          prompt: 'The charging loop below never terminates because `charge` is never updated inside the `while` block. Fix it so `charge` increases by `20` per cycle until it reaches `100`.',
          starterCode: `charge = 40
cycles = 0
while charge < 100:
    cycles += 1
print(f"Charged in {cycles} cycles")`,
          solutionCode: `charge = 40
cycles = 0
while charge < 100:
    charge += 20
    cycles += 1
print(f"Charged in {cycles} cycles")`,
          hints: [
            'Look at the while condition: charge < 100.',
            'Does anything inside the loop modify charge?',
            'Add charge += 20 inside the while loop body.',
          ],
        },
      ],
    },
    {
      id: 'day10-sub2',
      number: 2,
      title: 'for Loops & Iterable Traversal',
      summary: 'Iterate directly over elements of any iterable using Python’s iterator protocol without manual index bookkeeping.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Traversing Sequences Cleanly with for-in',
        paragraphs: [
          'In Python, `for` loops are collection-based rather than C-style counter loops. When you write `for item in iterable:`, Python calls `iter(iterable)` once to obtain an iterator, and then repeatedly calls `next()` on that iterator until `StopIteration` is raised.',
          'On each pass, the loop variable (such as `item`) is bound to the next element yielded by the iterator. You can accumulate totals, filter values, or transform items inside the loop body.',
          'A subtle Python behaviour to remember: the loop variable is NOT scoped to the loop block. After the `for` loop finishes, the loop variable remains in the enclosing scope holding the last value it was assigned.',
        ],
        keyTerms: [
          {
            term: 'Iterable',
            definition: 'Any Python object capable of returning its members one at a time (e.g., list, tuple, str, dict, set, range).',
          },
          {
            term: 'Accumulator Pattern',
            definition: 'Initializing a variable (e.g., total = 0 or results = []) before a loop and updating it on each pass.',
          },
          {
            term: 'StopIteration',
            definition: 'The internal signal raised by an iterator when no more elements remain, causing the for loop to exit cleanly.',
          },
        ],
        bulletPoints: [
          'for item in collection: visits each element in order without needing index counters.',
          'Use an accumulator initialized before the loop to compute sums, counts, or new lists.',
          'The loop variable persists in scope after the loop ends with its final bound value.',
        ],
      },
      visualise: {
        type: 'iteration-timeline',
        title: 'for-in Loop Pass & Accumulator Tracer',
        badge: 'simulation',
        description: 'Watch each pass bind the loop variable and update the accumulator step by step.',
        initialConfig: { preset: 'sum-list' },
      },
      code: [
        {
          title: 'Summing & Inspecting Post-Loop Variable Persistence',
          runMode: 'real',
          code: `scores = [15, 20, 10, 25]
total = 0

for s in scores:
    total += s
    print(f"Added {s} -> total={total}")

print("Final total:", total)
print("Last loop variable s:", s)`,
          expectedOutput: `Added 15 -> total=15
Added 20 -> total=35
Added 10 -> total=45
Added 25 -> total=70
Final total: 70
Last loop variable s: 25`,
          notes: 'Notice s still equals 25 after the loop finishes.',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'for s in scores:',
          internalEffect: 'Calls iter(scores) to create a list_iterator object.',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: 'total += s',
          internalEffect: 'Rebinds total to total + s on each pass until StopIteration ends the loop.',
        },
        {
          step: 3,
          codeLine: 9,
          instruction: 'print("Last loop variable s:", s)',
          internalEffect: 'Demonstrates that Python for-loops bind s in the enclosing scope; s remains 25.',
          outputEffect: 'Prints Last loop variable s: 25.',
        },
      ],
      apply: {
        domain: 'E-Commerce Analytics',
        contextTitle: 'Computing Daily Cart Revenue',
        scenario: 'Sum line-item prices from a checkout basket while counting items above 5,000 NGN.',
        code: `prices = [2500, 7200, 1800, 9500]
revenue = 0
premium_count = 0

for price in prices:
    revenue += price
    if price > 5000:
        premium_count += 1

print(f"Revenue: {revenue}, Premium items: {premium_count}")`,
        outcome: 'Revenue: 21000, Premium items: 2',
      },
      commonMistakes: [
        {
          label: 'Initializing the Accumulator Inside the Loop',
          erroneousCode: `for num in [10, 20, 30]:
    total = 0  # Resets on every pass!
    total += num
print(total)`,
          errorMessage: 'Logic Error: prints 30 instead of 60',
          explanation: 'Placing total = 0 inside the loop wipes out previous additions on each iteration.',
          correctedCode: `total = 0
for num in [10, 20, 30]:
    total += num
print(total)`,
        },
      ],
      sourceNotes: 'Based on Asabeneh 30 Days of Python Day 10 (for loop section) and Python iterator protocol.',
      practise: [
        {
          id: 'd10-s2-ex1',
          title: 'Predict Output: Loop Variable Persistence',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Warehouse SKU Scanner',
          prompt: 'What does the following code print after the `for` loop finishes iterating over `skus`?',
          starterCode: `skus = ["A10", "B20", "C30"]
for sku in skus:
    pass
print("Last:", sku)`,
          options: [
            {
              id: 'opt-1',
              text: 'Last: C30',
              explanation: 'Correct! Python does not scope loop variables to the loop block; sku retains its final bound element ("C30").',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'NameError: name "sku" is not defined',
              explanation: 'Incorrect. In Python, for-loop variables persist in the enclosing scope after the loop ends.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'Last: A10',
              explanation: 'Incorrect. sku is rebound on every pass until the final element "C30".',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'Last: None',
              explanation: 'Incorrect. StopIteration exits the loop without resetting sku to None.',
              isCorrect: false,
            },
          ],
          hints: [
            'Does Python destroy the loop variable when a for loop ends?',
            'What is the final element of skus?',
            'pass does nothing, so sku stays bound to the last item yielded.',
          ],
        },
        {
          id: 'd10-s2-ex2',
          title: 'Write Code: Solar Panel Output Accumulator',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'Renewable Microgrid Telemetry',
          prompt: 'Write a function `total_high_output(readings, threshold)` that uses a `for` loop and an accumulator to sum only the readings strictly greater than `threshold`.',
          starterCode: `def total_high_output(readings, threshold):
    # Accumulate readings > threshold
    pass`,
          solutionCode: `def total_high_output(readings, threshold):
    total = 0
    for r in readings:
        if r > threshold:
            total += r
    return total`,
          testCases: [
            {
              id: 'tc1',
              label: 'Mixed readings',
              setup: 'assert total_high_output([10, 55, 30, 80], 40) == 135',
              expected: 'True',
              hidden: false,
            },
            {
              id: 'tc2',
              label: 'None above threshold',
              setup: 'assert total_high_output([5, 10, 15], 20) == 0',
              expected: 'True',
              hidden: false,
            },
          ],
          hints: [
            'Initialize total = 0 before the for loop.',
            'Inside for r in readings:, check if r > threshold.',
            'Add r to total when the condition holds, then return total.',
          ],
        },
      ],
    },
    {
      id: 'day10-sub3',
      number: 3,
      title: 'The range(start, stop, step) Generator & Negative Stepping',
      summary: 'Generate arithmetic integer sequences lazily with range(), remembering that stop is exclusive and step=0 raises ValueError.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Counting Sequences with range(start, stop, step)',
        paragraphs: [
          'Python’s built-in `range()` function produces an immutable sequence of integers on demand (lazily, using O(1) memory regardless of length). It accepts one, two, or three integer arguments: `range(stop)`, `range(start, stop)`, or `range(start, stop, step)`.',
          'The most important rule of `range()` is that `start` is **inclusive**, while `stop` is **exclusive**. Thus `range(5)` yields `0, 1, 2, 3, 4` (stopping before 5), and `range(1, 6)` yields `1, 2, 3, 4, 5`.',
          'When `step` is negative (e.g., `range(10, 0, -2)`), the sequence counts downward and stops before reaching or passing `stop` (`10, 8, 6, 4, 2`). If the step direction moves away from `stop`—such as `range(1, 10, -1)`—`range()` produces an empty sequence. Passing `step=0` raises a `ValueError`.',
        ],
        keyTerms: [
          {
            term: 'Exclusive Stop',
            definition: 'The stop boundary in range(start, stop, step) is never included in the generated sequence.',
          },
          {
            term: 'Lazy Range Object',
            definition: 'range() stores only start, stop, and step in memory and computes each integer on demand.',
          },
          {
            term: 'Negative Step',
            definition: 'A negative third argument that decrements from start toward stop (requires start > stop to yield items).',
          },
        ],
        bulletPoints: [
          'range(n) defaults to start=0, stop=n, step=1.',
          'stop is always exclusive: range(0, 5) produces 0, 1, 2, 3, 4.',
          'Negative steps count down: range(5, 0, -1) produces 5, 4, 3, 2, 1.',
          'range(..., 0) raises ValueError: range() arg 3 must not be zero.',
        ],
      },
      visualise: {
        type: 'range-slider',
        title: 'Interactive range(start, stop, step) Explorer',
        badge: 'simulation',
        description: 'Adjust start, stop, and step sliders to see exact generated integers, exclusive stop boundary, and ValueError / empty-range guards.',
        initialConfig: { start: 0, stop: 10, step: 2 },
      },
      code: [
        {
          title: 'Positive, Negative, and Empty Ranges',
          runMode: 'real',
          code: `print("1-arg:", list(range(5)))
print("2-arg:", list(range(2, 7)))
print("Step 2:", list(range(0, 10, 2)))
print("Countdown:", list(range(5, 0, -1)))
print("Mismatch:", list(range(1, 5, -1)))`,
          expectedOutput: `1-arg: [0, 1, 2, 3, 4]
2-arg: [2, 3, 4, 5, 6]
Step 2: [0, 2, 4, 6, 8]
Countdown: [5, 4, 3, 2, 1]
Mismatch: []`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'list(range(5))',
          internalEffect: 'Creates range(0, 5, 1) and materializes 0, 1, 2, 3, 4 (stop=5 excluded).',
        },
        {
          step: 2,
          codeLine: 4,
          instruction: 'list(range(5, 0, -1))',
          internalEffect: 'Starts at 5, adds -1 each step while current > 0; stops before 0.',
        },
        {
          step: 3,
          codeLine: 5,
          instruction: 'list(range(1, 5, -1))',
          internalEffect: 'With negative step, condition is current > stop (1 > 5 is False immediately) -> empty.',
          outputEffect: 'Prints Mismatch: [].',
        },
      ],
      apply: {
        domain: 'Scheduling & Pagination',
        contextTitle: 'Generating Batch Offsets for API Pagination',
        scenario: 'Compute page start offsets for 100 records fetched in batches of 25.',
        code: `for offset in range(0, 100, 25):
    print(f"Fetching records {offset} to {offset + 24}")`,
        outcome: `Fetching records 0 to 24
Fetching records 25 to 49
Fetching records 50 to 74
Fetching records 75 to 99`,
      },
      commonMistakes: [
        {
          label: 'Expecting stop to be Included & Passing step=0',
          erroneousCode: `# Expecting 1..5 inclusive, or using step=0
nums = list(range(1, 5))
zero_step = range(0, 5, 0)`,
          errorMessage: 'ValueError: range() arg 3 must not be zero',
          explanation: 'range(1, 5) stops at 4 because stop is exclusive; use range(1, 6) for 1..5, and never pass 0 as step.',
          correctedCode: `nums = list(range(1, 6))
print(nums)`,
        },
      ],
      sourceNotes: 'Covers range(start, stop, step) from Asabeneh Day 10, highlighting exclusive stop and negative step rules.',
      practise: [
        {
          id: 'd10-s3-ex1',
          title: 'Fill the Gaps: Even Countdown Sequence',
          type: 'fill-the-gaps',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Rocket Pre-Launch T-Minus Timer',
          prompt: 'Complete the `range()` call so it prints `10, 8, 6, 4, 2` (stopping before `0`).',
          starterCode: `for t in range(__GAP_1__, __GAP_2__, __GAP_3__):
    print(t, end=" ")`,
          gaps: [
            { id: 'GAP_1', beforeText: 'range(', afterText: ',', correctAnswer: '10', options: ['10', '9', '12'] },
            { id: 'GAP_2', beforeText: ',', afterText: ',', correctAnswer: '0', options: ['0', '2', '-1'] },
            { id: 'GAP_3', beforeText: ',', afterText: ')', correctAnswer: '-2', options: ['-2', '2', '-1'] },
          ],
          hints: [
            'Start at 10.',
            'Because stop is exclusive, stop=0 stops at 2 when stepping by -2.',
            'Use step=-2 to count down by twos.',
          ],
        },
        {
          id: 'd10-s3-ex2',
          title: 'Scenario: Direction Mismatch in range()',
          type: 'scenario-mcq',
          tier: 'challenge',
          points: 15,
          contextScenario: 'Batch Scheduler Offset Bug',
          prompt: 'A developer writes `list(range(10, 20, -2))` expecting descending numbers. What does Python actually return?',
          options: [
            {
              id: 'opt-1',
              text: '[] (an empty list) because a negative step requires start > stop.',
              explanation: 'Correct! With step=-2, Python checks current > stop (10 > 20), which is immediately False, yielding an empty range.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: '[20, 18, 16, 14, 12]',
              explanation: 'Incorrect. range() never swaps start and stop automatically.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'ValueError: step sign does not match bounds.',
              explanation: 'Incorrect. Only step=0 raises ValueError; mismatched directions return an empty range.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: '[10, 12, 14, 16, 18]',
              explanation: 'Incorrect. A negative step will not step upward.',
              isCorrect: false,
            },
          ],
          hints: [
            'Check whether start (10) is greater than stop (20).',
            'When step is negative, range() continues only while current > stop.',
            'Does Python raise an error or return an empty sequence?',
          ],
        },
      ],
    },
    {
      id: 'day10-sub4',
      number: 4,
      title: 'Looping Over Strings, Lists, Tuples, Sets & Dictionaries',
      summary: 'Iterate cleanly over every built-in Python collection, including dictionary keys, .values(), and .items() unpacking.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'One for-in Syntax Across Every Python Container',
        paragraphs: [
          'Because strings, lists, tuples, sets, and dictionaries all implement Python’s iterable protocol, the same `for` loop syntax works across all of them. Looping over a `str` yields one character at a time; looping over a `list` or `tuple` yields elements in order; looping over a `set` yields unique elements (in hash order, not guaranteed insertion order).',
          'When you loop directly over a `dict` (`for k in my_dict:`), Python yields its **keys** by default. To iterate over values, use `my_dict.values()`. To access both key and value together cleanly, use `for key, value in my_dict.items():` with tuple unpacking.',
          'When you need both the index and the value of a sequence (like a list or string), prefer `enumerate(seq)` over `range(len(seq))`—it is more readable and less error-prone.',
        ],
        keyTerms: [
          {
            term: 'dict.items()',
            definition: 'Returns a dynamic view of (key, value) tuples ideal for unpacking in a for loop.',
          },
          {
            term: 'enumerate(iterable)',
            definition: 'Built-in wrapper that yields (index, element) pairs during iteration.',
          },
          {
            term: 'Tuple Unpacking in Loops',
            definition: 'Assigning multiple loop variables directly in the for header, e.g., for k, v in d.items():.',
          },
        ],
        bulletPoints: [
          'for ch in "Py": yields "P", then "y".',
          'for k in d: iterates keys; use d.values() for values and d.items() for (key, value) pairs.',
          'Sets yield unique elements in internal hash-table order.',
          'Use enumerate(items, start=1) when you need 1-based or 0-based indices.',
        ],
      },
      visualise: {
        type: 'iteration-timeline',
        title: 'Container Traversal Timeline',
        badge: 'simulation',
        description: 'Trace how the loop variable binds to elements across iterable passes.',
        initialConfig: { preset: 'sum-list' },
      },
      code: [
        {
          title: 'Iterating Over Str, Tuple, Set, and Dict',
          runMode: 'real',
          code: `for ch in "AI":
    print("char:", ch)

coords = (10, 20)
for c in coords:
    print("coord:", c)

config = {"host": "localhost", "port": 8080}
for key, val in config.items():
    print(f"{key} => {val}")`,
          expectedOutput: `char: A
char: I
coord: 10
coord: 20
host => localhost
port => 8080`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'for ch in "AI":',
          internalEffect: 'Iterates over the Unicode code points of "AI", binding ch to "A" then "I".',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: 'for c in coords:',
          internalEffect: 'Iterates over tuple (10, 20) in index order 0, 1.',
        },
        {
          step: 3,
          codeLine: 9,
          instruction: 'for key, val in config.items():',
          internalEffect: 'Unpacks each (key, value) 2-tuple yielded by dict_items view into key and val.',
        },
      ],
      apply: {
        domain: 'DevOps & Configuration Auditing',
        contextTitle: 'Validating Microservice Port Allocations',
        scenario: 'Iterate over a dictionary of service names and ports to report active endpoints.',
        code: `services = {"auth": 8001, "billing": 8002, "search": 8003}
for idx, (name, port) in enumerate(services.items(), start=1):
    print(f"[{idx}] {name.upper()} -> :{port}")`,
        outcome: `[1] AUTH -> :8001
[2] BILLING -> :8002
[3] SEARCH -> :8003`,
      },
      commonMistakes: [
        {
          label: 'Unpacking Two Variables Directly from a Dict Without .items()',
          erroneousCode: `user = {"name": "Ada", "role": "admin"}
for k, v in user:
    print(k, v)`,
          errorMessage: 'ValueError: too many values to unpack (expected 2)',
          explanation: 'Looping over user directly yields string keys ("name", "role"), not (key, value) pairs. Python tries to unpack the 4-character string "name" into 2 variables.',
          correctedCode: `user = {"name": "Ada", "role": "admin"}
for k, v in user.items():
    print(k, v)`,
        },
      ],
      sourceNotes: 'Covers iterating over strings, lists, tuples, sets, and dictionaries from Asabeneh Day 10.',
      practise: [
        {
          id: 'd10-s4-ex1',
          title: 'Order the Lines: Inventory Valuation Loop',
          type: 'order-the-lines',
          tier: 'standard',
          points: 10,
          contextScenario: 'Retail Warehouse Stock Valuation',
          prompt: 'Arrange the lines in the correct order to compute the total inventory value from `stock = {"laptop": (5, 400), "mouse": (20, 15)}` where each tuple is `(qty, unit_price)`.',
          jumbledLines: [
            { id: 'l1', code: 'stock = {"laptop": (5, 400), "mouse": (20, 15)}', indent: 0 },
            { id: 'l2', code: 'total_value = 0', indent: 0 },
            { id: 'l3', code: 'for item, (qty, price) in stock.items():', indent: 0 },
            { id: 'l4', code: 'total_value += qty * price', indent: 1 },
            { id: 'l5', code: 'print(total_value)', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4', 'l5'],
          hints: [
            'Define stock and initialize total_value = 0 before the loop.',
            'Unpack each (key, (qty, price)) pair using stock.items().',
            'Accumulate qty * price inside the loop, then print total_value after.',
          ],
        },
        {
          id: 'd10-s4-ex2',
          title: 'Write Code: Vowel Counter in String',
          type: 'write-code',
          tier: 'challenge',
          points: 15,
          contextScenario: 'Linguistic Text Analyzer',
          prompt: 'Write a function `count_vowels(text)` that loops over every character in `text` and returns the count of vowels (`"aeiouAEIOU"`).',
          starterCode: `def count_vowels(text):
    # Loop over characters and count vowels
    pass`,
          solutionCode: `def count_vowels(text):
    vowels = "aeiouAEIOU"
    count = 0
    for ch in text:
        if ch in vowels:
            count += 1
    return count`,
          testCases: [
            {
              id: 'tc1',
              label: 'Mixed case phrase',
              setup: 'assert count_vowels("Python Loops") == 3',
              expected: 'True',
              hidden: false,
            },
            {
              id: 'tc2',
              label: 'No vowels',
              setup: 'assert count_vowels("rhythm") == 0',
              expected: 'True',
              hidden: false,
            },
          ],
          hints: [
            'Iterate directly over text with for ch in text:.',
            'Check membership using if ch in "aeiouAEIOU":.',
            'Increment count and return it after the loop.',
          ],
        },
      ],
    },
    {
      id: 'day10-sub5',
      number: 5,
      title: 'Loop Control: break (Early Exit) & continue (Skip Iteration)',
      summary: 'Terminate a loop immediately with break when a target is found, or skip the rest of the current pass with continue.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Short-Circuiting Loops with break and continue',
        paragraphs: [
          'Sometimes a loop does not need to process every remaining item. The `break` statement immediately terminates the innermost enclosing loop and transfers execution to the first statement after the loop.',
          'The `continue` statement, by contrast, does NOT exit the loop. Instead, it aborts only the **current** iteration, skips any remaining lines in the loop body, and jumps straight back to the loop header for the next pass.',
          'In `while` loops, be extra careful with `continue`: if your loop counter increment (`i += 1`) appears *after* `continue`, skipping to the top of the loop will bypass the increment and cause an infinite loop!',
        ],
        keyTerms: [
          {
            term: 'break',
            definition: 'Control-flow statement that immediately exits the innermost enclosing for or while loop.',
          },
          {
            term: 'continue',
            definition: 'Control-flow statement that skips the rest of the current loop body and proceeds to the next iteration.',
          },
        ],
        bulletPoints: [
          'break exits the innermost loop completely.',
          'continue skips the rest of the current pass and jumps to the next iteration.',
          'In while loops, update the loop counter before any continue statement.',
        ],
      },
      visualise: {
        type: 'flowchart-tracer',
        title: 'break vs continue Branch Flow',
        badge: 'simulation',
        description: 'Inspect how conditional branches inside a loop divert execution to early exit or next pass.',
        initialConfig: { preset: 'loop-control' },
      },
      code: [
        {
          title: 'Filtering with continue and Stopping with break',
          runMode: 'real',
          code: `transactions = [120, -50, 300, 0, 9999, 45]

for amount in transactions:
    if amount <= 0:
        continue  # Skip refunds/zero entries
    if amount >= 5000:
        print("ALERT: High-value stop at", amount)
        break
    print("Approved:", amount)`,
          expectedOutput: `Approved: 120
Approved: 300
ALERT: High-value stop at 9999`,
          notes: '45 is never reached because break terminated the loop at 9999.',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 5,
          instruction: 'if amount <= 0: continue',
          internalEffect: 'For -50 and 0, continue jumps immediately back to the for header, skipping print("Approved:", ...).',
        },
        {
          step: 2,
          codeLine: 8,
          instruction: 'break',
          internalEffect: 'When amount is 9999, break exits the for loop immediately; 45 is never visited.',
        },
      ],
      apply: {
        domain: 'Log Scanning & Security',
        contextTitle: 'First Error Locator in Server Logs',
        scenario: 'Scan log entries, ignore DEBUG lines with continue, and stop on the first CRITICAL line.',
        code: `logs = ["DEBUG: init", "INFO: ready", "CRITICAL: disk full", "INFO: ignored"]
for entry in logs:
    if entry.startswith("DEBUG"):
        continue
    print("Inspecting:", entry)
    if entry.startswith("CRITICAL"):
        break`,
        outcome: `Inspecting: INFO: ready
Inspecting: CRITICAL: disk full`,
      },
      commonMistakes: [
        {
          label: 'Placing while Counter Update After continue',
          erroneousCode: `i = 0
while i < 5:
    if i == 2:
        continue  # i stays 2 forever!
    print(i)
    i += 1`,
          errorMessage: 'Infinite Loop: i += 1 is skipped whenever i == 2',
          explanation: 'When i reaches 2, continue jumps back to while i < 5 before i += 1 executes.',
          correctedCode: `i = 0
while i < 5:
    i += 1
    if i == 2:
        continue
    print(i)`,
        },
      ],
      sourceNotes: 'Covers break and continue from Asabeneh Day 10, including the while-continue infinite loop trap.',
      practise: [
        {
          id: 'd10-s5-ex1',
          title: 'Explain the Trace: Quality Gate break vs continue',
          type: 'explain-the-trace',
          tier: 'challenge',
          points: 15,
          contextScenario: 'Manufacturing Sensor Quality Filter',
          traceStepCode: `batches = [98, -1, 95, 0, 99]
valid = 0
for score in batches:
    if score < 0:
        continue
    if score == 0:
        break
    valid += 1
print(valid)`,
          traceQuestion: 'Trace why `valid` prints `2` instead of `3` or `4`, explaining the exact effect of both `continue` and `break`.',
          prompt: 'Explain step by step how `continue` and `break` affect `valid` across `[98, -1, 95, 0, 99]`.',
          modelAnswer: 'For 98, valid becomes 1. For -1, continue skips valid += 1 and moves to 95, where valid becomes 2. For 0, break immediately exits the entire for loop, so 99 is never visited and valid prints 2.',
          markingCriteria: [
            { id: 'mc1', label: 'Identifies continue skips -1 without exiting', points: 5 },
            { id: 'mc2', label: 'Identifies break exits completely at 0', points: 5 },
            { id: 'mc3', label: 'States 99 is never reached and valid == 2', points: 5 },
          ],
          hints: [
            'Trace each element in order: 98, -1, 95, 0, 99.',
            'continue skips only the current pass; break terminates the loop.',
            'Check whether 99 is ever reached after 0 triggers break.',
          ],
        },
        {
          id: 'd10-s5-ex2',
          title: 'Fix the Bug: while + continue Infinite Loop',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 10,
          contextScenario: 'Ticket Queue Skipper',
          prompt: 'The loop below hangs infinitely when `ticket == 3` because `ticket += 1` is placed after `continue`. Fix the ordering so it prints `1, 2, 4, 5`.',
          starterCode: `ticket = 1
while ticket <= 5:
    if ticket == 3:
        continue
    print(ticket)
    ticket += 1`,
          solutionCode: `ticket = 0
while ticket < 5:
    ticket += 1
    if ticket == 3:
        continue
    print(ticket)`,
          hints: [
            'When ticket == 3, continue jumps back to the while header.',
            'Because ticket += 1 is at the bottom, ticket stays 3 forever.',
            'Increment ticket before the if ticket == 3: continue check (starting at 0 with while ticket < 5).',
          ],
        },
      ],
    },
    {
      id: 'day10-sub6',
      number: 6,
      title: 'Placeholder pass & The Loop else Clause (for...else / while...else)',
      summary: 'Use pass as a syntactic placeholder and understand when Python’s loop else block executes (only when no break occurred).',
      estimatedMinutes: 9,
      introduce: {
        headline: 'The Syntactic pass & Search-Completion else Clause',
        paragraphs: [
          'Because Python requires every `for` or `while` header to have at least one indented statement in its body, you cannot leave a loop body empty while sketching code. The `pass` statement is a null operation—when executed, nothing happens, keeping the syntax valid.',
          'Python also supports an optional `else:` clause attached directly to a `for` or `while` loop. Despite its name, the loop `else` block does **not** mean "if the loop never ran." Instead, think of it as **"no-break"**: the `else` block executes if and only if the loop completed normally without hitting a `break` statement.',
          'This makes `for...else` ideal for search patterns: loop through candidates, `break` as soon as you find a match, and handle the "not found" case in the `else:` block without needing a separate `found = False` flag variable.',
        ],
        keyTerms: [
          {
            term: 'pass',
            definition: 'A no-op placeholder statement required when syntax demands an indented block but no action is needed yet.',
          },
          {
            term: 'Loop else Clause',
            definition: 'An optional block after a for or while loop that runs only when the loop terminates naturally without executing break.',
          },
        ],
        bulletPoints: [
          'pass does nothing at runtime; use it for stub loops or explicit no-op branches.',
          'Loop else runs when the iterable is exhausted (for) or condition becomes False (while), provided no break ran.',
          'If break executes, Python skips the loop else block completely.',
        ],
      },
      visualise: {
        type: 'iteration-timeline',
        title: 'Loop Completion & else Clause Flow',
        badge: 'simulation',
        description: 'Trace loop passes to see how natural exhaustion leads into the post-loop completion path.',
        initialConfig: { preset: 'sum-list' },
      },
      code: [
        {
          title: 'for...else Prime / Target Search Without Flag Variables',
          runMode: 'real',
          code: `ports = [22, 80, 443]
target = 8080

for p in ports:
    if p == target:
        print("Found port:", p)
        break
else:
    print(f"Port {target} not found in allowlist.")

# pass placeholder example
for _ in range(3):
    pass`,
          expectedOutput: `Port 8080 not found in allowlist.`,
          notes: 'Change target to 80 and the else block will be skipped because break runs.',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'for p in ports:',
          internalEffect: 'Checks 22, 80, and 443 against target (8080); none match, so break never executes.',
        },
        {
          step: 2,
          codeLine: 8,
          instruction: 'else:',
          internalEffect: 'Since StopIteration ended the loop normally (no break), Python enters the else suite.',
          outputEffect: 'Prints Port 8080 not found in allowlist.',
        },
      ],
      apply: {
        domain: 'Cybersecurity & Access Control',
        contextTitle: 'API Key Allowlist Verification',
        scenario: 'Scan active tokens for a match; if none matches, log a security rejection in the else block.',
        code: `valid_keys = ["key_live_a1", "key_live_b2"]
incoming = "key_test_z9"

for k in valid_keys:
    if k == incoming:
        print("Authorized")
        break
else:
    print("403 Forbidden: Invalid API key")`,
        outcome: '403 Forbidden: Invalid API key',
      },
      commonMistakes: [
        {
          label: 'Assuming Loop else Runs Only When the Loop Body Runs Zero Times',
          erroneousCode: `for x in [1, 2, 3]:
    print(x)
else:
    print("Loop did not run?")  # Misconception!`,
          errorMessage: 'Prints 1, 2, 3 AND "Loop did not run?"',
          explanation: 'Loop else means "no break occurred", NOT "loop never ran". Because [1, 2, 3] finished without break, else always executes.',
          correctedCode: `for x in [1, 2, 3]:
    if x == 2:
        break
else:
    print("Only prints if 2 was never found")`,
        },
      ],
      sourceNotes: 'Covers pass and loop else from Asabeneh Day 10; emphasizes the "no-break" mental model.',
      practise: [
        {
          id: 'd10-s6-ex1',
          title: 'Predict Output: for...else When break Executes',
          type: 'predict-output',
          tier: 'challenge',
          points: 15,
          contextScenario: 'Security Blocklist Lookup',
          prompt: 'What does the following `for...else` snippet output?',
          starterCode: `ips = ["10.0.0.1", "10.0.0.5", "10.0.0.9"]
for ip in ips:
    if ip == "10.0.0.5":
        print("Blocked")
        break
else:
    print("Clean")`,
          options: [
            {
              id: 'opt-1',
              text: 'Blocked',
              explanation: 'Correct! Because break executed when ip == "10.0.0.5", the loop else clause is skipped.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'Blocked\nClean',
              explanation: 'Incorrect. The else block only runs if the loop finishes without hitting break.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'Clean',
              explanation: 'Incorrect. "10.0.0.5" is present in ips, so the if branch matches.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'SyntaxError: else cannot follow for',
              explanation: 'Incorrect. Python supports else on both for and while loops.',
              isCorrect: false,
            },
          ],
          hints: [
            'Remember the mental model for loop else: "if no break occurred".',
            'Does "10.0.0.5" trigger break?',
            'If break runs, the else suite is bypassed.',
          ],
        },
        {
          id: 'd10-s6-ex2',
          title: 'Theory: Why Use for...else Over a Boolean Flag?',
          type: 'theory-reasoning',
          tier: 'standard',
          points: 10,
          contextScenario: 'Clean Code Review in Search Algorithms',
          prompt: 'Why is `for...else` often cleaner than setting `found = False` before a search loop?',
          options: [
            {
              id: 'opt-1',
              text: 'It eliminates manual flag state (found = False / True) by directly tying the fallback block to whether break was reached.',
              explanation: 'Correct! The else block expresses "not found / no break" natively without extra state variables.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'Because for...else runs the loop in parallel across CPU cores.',
              explanation: 'Incorrect. for...else is sequential control flow.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'Because boolean flags cannot be modified inside a for loop.',
              explanation: 'Incorrect. Flags can be modified, they are just extra boilerplate.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'Because else automatically sorts the iterable before searching.',
              explanation: 'Incorrect. else does not alter or sort the iterable.',
              isCorrect: false,
            },
          ],
          hints: [
            'Think about how many extra variables you need without for...else.',
            'What triggers the else block in Python?',
            'It directly handles the "search exhausted without break" case.',
          ],
        },
      ],
    },
    {
      id: 'day10-sub7',
      number: 7,
      title: 'Nested Loops & 2D Matrix / Multiplication Grid Traversal',
      summary: 'Combine outer and inner loops to process 2D grids, combinations, and multiplication tables cell by cell.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Loops Inside Loops: Row-by-Column Execution',
        paragraphs: [
          'A **nested loop** is a loop placed inside the body of another loop. For every single iteration of the **outer loop**, the **inner loop** runs through its entire sequence from start to finish.',
          'If an outer loop runs `M` times and an inner loop runs `N` times, the innermost body executes `M × N` times in total. This pattern is essential for working with 2D lists (matrices), generating coordinate pairs, comparing every item against every other item, or building multiplication tables.',
          'Remember that `break` or `continue` inside an inner loop affects **only the inner loop**—the outer loop continues on to its next pass.',
        ],
        keyTerms: [
          {
            term: 'Outer Loop',
            definition: 'The enclosing loop that advances once per complete cycle of the inner loop (typically represents rows).',
          },
          {
            term: 'Inner Loop',
            definition: 'The nested loop that runs all its iterations for each single step of the outer loop (typically represents columns).',
          },
          {
            term: 'M x N Complexity',
            definition: 'Total inner-body executions equal the product of outer and inner iteration counts.',
          },
        ],
        bulletPoints: [
          'Outer loop fixes i while inner loop cycles through all values of j.',
          'A 4 x 4 nested loop executes the inner body 16 times.',
          'break inside an inner loop exits only the inner loop, not the outer loop.',
        ],
      },
      visualise: {
        type: 'nested-loop-grid',
        title: 'Nested Loop Multiplication Grid',
        badge: 'simulation',
        description: 'Step through outer i and inner j loops as the multiplication matrix fills cell by cell.',
        initialConfig: { size: 4 },
      },
      code: [
        {
          title: 'Generating a 3x3 Multiplication Table',
          runMode: 'real',
          code: `for i in range(1, 4):
    row = []
    for j in range(1, 4):
        row.append(i * j)
    print(f"Row {i}:", row)`,
          expectedOutput: `Row 1: [1, 2, 3]
Row 2: [2, 4, 6]
Row 3: [3, 6, 9]`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'for i in range(1, 4):',
          internalEffect: 'Outer loop binds i = 1, 2, 3 across 3 outer passes.',
        },
        {
          step: 2,
          codeLine: 3,
          instruction: 'for j in range(1, 4):',
          internalEffect: 'For each i, inner loop resets j to 1 and runs 1, 2, 3, appending i * j to row.',
          outputEffect: 'Prints 3 formatted rows.',
        },
      ],
      apply: {
        domain: 'Logistics & Seat Allocation',
        contextTitle: 'Generating Aircraft Cabin Seat Labels',
        scenario: 'Combine numeric rows (1..3) with seat letters ("A", "B") using nested loops.',
        code: `seats = []
for row in range(1, 4):
    for col in ("A", "B"):
        seats.append(f"{row}{col}")
print(seats)`,
        outcome: "['1A', '1B', '2A', '2B', '3A', '3B']",
      },
      commonMistakes: [
        {
          label: 'Reusing the Same Loop Variable Name in Outer and Inner Loops',
          erroneousCode: `for i in range(1, 3):
    for i in range(1, 4):  # Shadows outer i!
        print(i)`,
          errorMessage: 'Logic Error: inner loop overwrites outer loop variable i',
          explanation: 'Using i for both loops causes the inner loop to overwrite i, making outer-loop values unavailable inside the inner body.',
          correctedCode: `for i in range(1, 3):
    for j in range(1, 4):
        print(i, j)`,
        },
      ],
      sourceNotes: 'Covers nested loops from Asabeneh Day 10, paired with matrix cell-by-cell execution.',
      practise: [
        {
          id: 'd10-s7-ex1',
          title: 'Write Code: 2D Matrix Row-Sum Aggregator',
          type: 'write-code',
          tier: 'project',
          points: 20,
          contextScenario: 'Spreadsheet Grid Row Totals',
          prompt: 'Write a function `row_sums(matrix)` that uses nested `for` loops to return a list containing the sum of each row in a 2D list `matrix`.',
          starterCode: `def row_sums(matrix):
    # Return a list of sums, one per row
    pass`,
          solutionCode: `def row_sums(matrix):
    totals = []
    for row in matrix:
        row_total = 0
        for val in row:
            row_total += val
        totals.append(row_total)
    return totals`,
          testCases: [
            {
              id: 'tc1',
              label: '2x3 matrix',
              setup: 'assert row_sums([[1, 2, 3], [4, 5, 6]]) == [6, 15]',
              expected: 'True',
              hidden: false,
            },
            {
              id: 'tc2',
              label: 'Empty matrix',
              setup: 'assert row_sums([]) == []',
              expected: 'True',
              hidden: false,
            },
          ],
          hints: [
            'Initialize totals = [] before the outer loop.',
            'For each row in matrix, initialize row_total = 0.',
            'Sum each val in row with an inner loop, then totals.append(row_total).',
          ],
        },
        {
          id: 'd10-s7-ex2',
          title: 'Explain the Trace: Inner break Scope',
          type: 'explain-the-trace',
          tier: 'challenge',
          points: 15,
          contextScenario: '2D Grid Target Search',
          traceStepCode: `count = 0
for i in range(3):
    for j in range(3):
        if j == 1:
            break
        count += 1
print(count)`,
          traceQuestion: 'Explain why `count` prints `3` even though `break` is executed.',
          prompt: 'Trace how many times `count += 1` executes and explain which loop `break` exits.',
          modelAnswer: 'break inside the inner loop exits only the inner loop (j), not the outer loop (i). For each of i = 0, 1, 2, j = 0 increments count once, and j = 1 breaks out of the inner loop, resulting in count == 3.',
          markingCriteria: [
            { id: 'mc1', label: 'States break exits only the inner j loop', points: 5 },
            { id: 'mc2', label: 'Shows outer loop i still runs all 3 passes (0, 1, 2)', points: 5 },
            { id: 'mc3', label: 'Confirms final count is 3', points: 5 },
          ],
          hints: [
            'Does break exit all enclosing loops or only the innermost one?',
            'Trace j=0 and j=1 for i=0, then check what i does next.',
            'Outer loop runs 3 times; each outer pass increments count once at j=0.',
          ],
        },
      ],
    },
    {
      id: 'day10-sub8',
      number: 8,
      title: 'Loop Variable Persistence, Off-by-One & Mutating-While-Iterating Traps',
      summary: 'Avoid the three most frequent loop bugs in Python: off-by-one range bounds, leaked loop variables, and mutating a list during iteration.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Three Classic Python Loop Pitfalls & How to Fix Them',
        paragraphs: [
          'Even experienced developers hit subtle loop traps. First, **Off-by-One Errors** occur when forgetting that `range(start, stop)` excludes `stop`—for instance, writing `range(1, 10)` when you meant `1` through `10` inclusive (`range(1, 11)`).',
          'Second, **Loop Variable Persistence**: in Python, `for x in items:` binds `x` in the enclosing function or module scope. If `items` is empty (`[]`), `x` is never bound at all (raising `NameError` if referenced later); if `items` is non-empty, `x` retains the final item.',
          'Third, **Mutating a List While Iterating Over It**: calling `items.remove(x)` inside `for x in items:` shifts subsequent elements left while the internal list iterator advances its index forward, causing Python to silently skip elements! Instead, iterate over a shallow copy (`items[:]`) or build a new filtered list.',
        ],
        keyTerms: [
          {
            term: 'Off-by-One Error',
            definition: 'Iterating one time too many or too few, commonly from forgetting range() stop is exclusive.',
          },
          {
            term: 'Iterator Skipping',
            definition: 'Silently missing elements when removing items in-place from a list currently being iterated.',
          },
        ],
        bulletPoints: [
          'Use range(1, n + 1) when n itself must be included.',
          'Never remove() from a list while iterating over it directly; iterate over items[:] or build a new list.',
          'Guard against empty iterables if you ever inspect the loop variable after the loop.',
        ],
      },
      visualise: {
        type: 'range-slider',
        title: 'Boundary & Off-by-One Range Inspector',
        badge: 'simulation',
        description: 'Experiment with start and stop values to verify exact inclusive vs exclusive boundaries.',
        initialConfig: { start: 1, stop: 10, step: 1 },
      },
      code: [
        {
          title: 'Safe List Filtering vs Mutating-While-Iterating',
          runMode: 'real',
          code: `nums = [1, 2, 3, 4, 5, 6]

# Safe: build a new list of odd numbers
odds = []
for n in nums:
    if n % 2 != 0:
        odds.append(n)

print("Original:", nums)
print("Filtered odds:", odds)`,
          expectedOutput: `Original: [1, 2, 3, 4, 5, 6]
Filtered odds: [1, 3, 5]`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 5,
          instruction: 'for n in nums:',
          internalEffect: 'Iterates over nums without mutating it, so internal iterator index stays aligned with every element.',
        },
        {
          step: 2,
          codeLine: 7,
          instruction: 'odds.append(n)',
          internalEffect: 'Appends matching odd integers into a separate result list.',
        },
      ],
      apply: {
        domain: 'Data Cleaning Pipelines',
        contextTitle: 'Purging Invalid Sensor Readings Safely',
        scenario: 'Filter out negative sensor readings without skipping adjacent invalid entries.',
        code: `readings = [22.5, -1.0, -3.5, 24.0, -0.5]
clean = []
for r in readings:
    if r >= 0:
        clean.append(r)
print("Clean readings:", clean)`,
        outcome: 'Clean readings: [22.5, 24.0]',
      },
      commonMistakes: [
        {
          label: 'Calling list.remove() Inside a for Loop Over the Same List',
          erroneousCode: `nums = [1, 2, 3, 4]
for n in nums:
    if n % 2 == 0:
        nums.remove(n)
# Removing 2 shifts 3 into index 1, then iterator moves to index 2 (4) - works by luck here,
# but fails on consecutive matches like [2, 4, 6]!`,
          errorMessage: 'Silent Bug: [2, 4, 6] leaves [4] behind!',
          explanation: 'Removing an element shifts remaining elements left while the loop index advances right, skipping the element immediately after each deleted item.',
          correctedCode: `nums = [2, 4, 6]
nums = [n for n in nums if n % 2 != 0]
print(nums)`,
        },
      ],
      sourceNotes: 'Highlights the Day 10 watch-outs from the Master Specification: exclusive stop, loop variable persistence, and safe iteration.',
      practise: [
        {
          id: 'd10-s8-ex1',
          title: 'Fix the Bug: Mutating a List While Iterating',
          type: 'fix-the-bug',
          tier: 'project',
          points: 20,
          contextScenario: 'Log Cleanup Utility',
          prompt: 'Removing items directly from `items` during `for x in items:` skips consecutive matches (`[2, 4, 6]` leaves `[4]`). Fix `remove_evens(nums)` so it safely returns only odd numbers without skipping.',
          starterCode: `def remove_evens(nums):
    for n in nums:
        if n % 2 == 0:
            nums.remove(n)
    return nums`,
          solutionCode: `def remove_evens(nums):
    result = []
    for n in nums:
        if n % 2 != 0:
            result.append(n)
    return result`,
          hints: [
            'Never call nums.remove(n) while iterating over nums directly.',
            'Create a new list result = [] and append odd numbers (n % 2 != 0).',
            'Alternatively, iterate over a copy nums[:] if mutating in place.',
          ],
        },
        {
          id: 'd10-s8-ex2',
          title: 'Predict Output: Off-by-One range() Sum',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Invoice Line Numbering',
          prompt: 'What does `sum(range(1, 5))` evaluate to?',
          starterCode: `total = 0
for n in range(1, 5):
    total += n
print(total)`,
          options: [
            {
              id: 'opt-1',
              text: '10',
              explanation: 'Correct! range(1, 5) yields 1, 2, 3, 4 (5 is exclusive), and 1 + 2 + 3 + 4 = 10.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: '15',
              explanation: 'Incorrect. 15 would require range(1, 6) so that 5 is included.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: '9',
              explanation: 'Incorrect. 1 is inclusive, so 1 + 2 + 3 + 4 = 10.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: '14',
              explanation: 'Incorrect. Check the sum of 1, 2, 3, 4.',
              isCorrect: false,
            },
          ],
          hints: [
            'List the integers produced by range(1, 5).',
            'Remember start=1 is inclusive and stop=5 is exclusive.',
            'Add 1 + 2 + 3 + 4.',
          ],
        },
      ],
    },
    {
      id: 'day10-sub9',
      number: 9,
      title: 'Infinite Loop Safety, Sentinel Patterns & Bounded Iteration',
      summary: 'Understand why infinite loops happen, when intentional while True + break sentinel loops are idiomatic, and how safety step limits protect systems.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Taming Infinite Loops & Using Sentinel Patterns Safely',
        paragraphs: [
          'An **infinite loop** occurs when a `while` condition never becomes `False`. Common causes include forgetting to increment a counter, updating the counter in the wrong direction (`count += 1` when waiting for `count <= 0`), or placing `continue` before the counter update.',
          'Occasionally, programmers *intentionally* write `while True:` for event loops or **sentinel-controlled input loops**—loops that keep reading commands until a special sentinel value (like `"quit"`) triggers `break`.',
          'In production systems and interactive sandboxes, defensive engineering adds a **maximum iteration guard** (e.g., `max_steps = 1000`) alongside `while` loops so a logic bug cannot hang a server or browser tab indefinitely.',
        ],
        keyTerms: [
          {
            term: 'Infinite Loop',
            definition: 'A loop whose termination condition never becomes False and never hits a break statement.',
          },
          {
            term: 'Sentinel Value',
            definition: 'A special input value (such as "quit" or None) that signals a loop to exit via break.',
          },
          {
            term: 'Bounded Iteration Guard',
            definition: 'A safety counter cap ensuring a while loop cannot exceed a maximum number of passes.',
          },
        ],
        bulletPoints: [
          'Verify every while loop moves monotonically toward its exit condition.',
          'Use while True: with a clear if sentinel: break only when exit is checked mid-body.',
          'Add a max_attempts safety cap in retry or polling loops.',
        ],
      },
      visualise: {
        type: 'infinite-loop-safety',
        title: 'Infinite Loop Safety & Termination Guard',
        badge: 'simulation',
        description: 'Compare an un-updated while loop stopped by a safety step limit against a properly bounded loop.',
        initialConfig: { mode: 'buggy' },
      },
      code: [
        {
          title: 'Sentinel Loop with Bounded Safety Cap',
          runMode: 'real',
          code: `commands = ["status", "ping", "quit", "ignored"]
idx = 0
max_steps = 10

while idx < len(commands) and idx < max_steps:
    cmd = commands[idx]
    idx += 1
    if cmd == "quit":
        print("Sentinel 'quit' received. Exiting.")
        break
    print("Executed:", cmd)`,
          expectedOutput: `Executed: status
Executed: ping
Sentinel 'quit' received. Exiting.`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 5,
          instruction: 'while idx < len(commands) and idx < max_steps:',
          internalEffect: 'Combines bounds check with a hard max_steps safety cap.',
        },
        {
          step: 2,
          codeLine: 8,
          instruction: 'if cmd == "quit": break',
          internalEffect: 'Detects the sentinel string and exits before reaching "ignored".',
        },
      ],
      apply: {
        domain: 'Distributed Systems & Polling',
        contextTitle: 'Bounded Job Status Poller',
        scenario: 'Poll a background job status list with a hard maximum of 4 checks so polling never hangs.',
        code: `statuses = ["PENDING", "RUNNING", "COMPLETE", "COMPLETE"]
step = 0
while step < 4:
    state = statuses[step]
    print(f"Poll {step + 1}: {state}")
    if state == "COMPLETE":
        break
    step += 1`,
        outcome: `Poll 1: PENDING
Poll 2: RUNNING
Poll 3: COMPLETE`,
      },
      commonMistakes: [
        {
          label: 'Updating a Counter in the Wrong Direction',
          erroneousCode: `n = 5
while n > 0:
    print(n)
    n += 1  # Moves AWAY from 0!`,
          errorMessage: 'Infinite Loop: n grows 5, 6, 7... and is always > 0',
          explanation: 'Incrementing n when testing n > 0 moves further away from the termination threshold.',
          correctedCode: `n = 5
while n > 0:
    print(n)
    n -= 1`,
        },
      ],
      sourceNotes: 'Covers infinite loop prevention and bounded sentinel patterns for Day 10 Part A.',
      practise: [
        {
          id: 'd10-s9-ex1',
          title: 'Order the Lines: Bounded Sentinel Loop',
          type: 'order-the-lines',
          tier: 'foundation',
          points: 10,
          contextScenario: 'CLI Command Processor',
          prompt: 'Order the lines to process commands until `"STOP"` is seen or `idx` reaches `len(cmds)`.',
          jumbledLines: [
            { id: 'l1', code: 'cmds = ["RUN", "STOP", "SKIP"]', indent: 0 },
            { id: 'l2', code: 'idx = 0', indent: 0 },
            { id: 'l3', code: 'while idx < len(cmds) and cmds[idx] != "STOP":', indent: 0 },
            { id: 'l4', code: 'print(cmds[idx])', indent: 1 },
            { id: 'l5', code: 'idx += 1', indent: 1 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4', 'l5'],
          hints: [
            'Initialize cmds and idx = 0 first.',
            'Place the while condition with both bounds and sentinel check.',
            'Print cmds[idx] and increment idx += 1 inside the loop.',
          ],
        },
        {
          id: 'd10-s9-ex2',
          title: 'Theory: Fault-Tolerant Polling Loops',
          type: 'theory-reasoning',
          tier: 'project',
          points: 20,
          contextScenario: 'Distributed Payment Settlement Worker',
          prompt: 'Why should a production `while` loop polling an external API always include a `max_attempts` cap in addition to checking `status != "SETTLED"`?',
          options: [
            {
              id: 'opt-1',
              text: 'If the external API stalls or never returns "SETTLED", the max_attempts cap guarantees bounded termination instead of an infinite hang.',
              explanation: 'Correct! Combining a domain condition with a hard step bound prevents runaway CPU usage and hung workers.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'Because Python forbids while loops that test string inequality.',
              explanation: 'Incorrect. String inequality is valid in while loops.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'Because max_attempts automatically caches HTTP responses.',
              explanation: 'Incorrect. It is a termination guard, not a cache.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'Because while loops in Python are capped at 10 iterations by default.',
              explanation: 'Incorrect. Python does not cap while iterations by default.',
              isCorrect: false,
            },
          ],
          hints: [
            'What happens if the remote server stays in "PENDING" forever?',
            'Think about how a safety limit protects system availability.',
            'Bounded iteration guarantees finite execution time.',
          ],
        },
      ],
    },
  ],
  realWorldLabs: [
    {
      id: 'day10-lab1',
      title: 'Telecom Call Detail Record (CDR) Batch Scanner',
      description: 'Process a batch of call duration records: skip negative/corrupt entries with continue, stop scanning if a sentinel -999 emergency halt appears, and compute total billable minutes.',
      domain: 'Telecommunications Billing',
      starterCode: `cdr_minutes = [12, -5, 8, 25, -999, 40]
billable_total = 0
valid_calls = 0

# Loop over cdr_minutes:
# - if m == -999: print "HALT" and break
# - if m <= 0: continue
# - otherwise add to billable_total and increment valid_calls

print(f"Valid calls: {valid_calls}, Billable minutes: {billable_total}")`,
      targetOutput: `HALT
Valid calls: 3, Billable minutes: 45`,
    },
    {
      id: 'day10-lab2',
      title: 'Cold-Chain Warehouse Sensor Grid Audit',
      description: 'Use nested loops over a 2D temperature matrix to count how many zones exceed the 4.0C threshold and report row-by-row alerts.',
      domain: 'Logistics & IoT Telemetry',
      starterCode: `zones = [
    [2.1, 4.5, 3.8],
    [5.2, 3.0, 4.1],
]
alerts = 0

# Use nested loops with enumerate() or indices to count readings > 4.0
# Print each alert as "Zone (r, c): <temp>C"
# Print final "Total alerts: <alerts>"`,
      targetOutput: `Zone (0, 1): 4.5C
Zone (1, 0): 5.2C
Zone (1, 2): 4.1C
Total alerts: 3`,
    },
  ],
  miniProject: {
    id: 'day10-project',
    title: 'Multi-Pass Logistics & Fleet Dispatch Engine',
    brief: 'Build an iterative dispatch engine that processes delivery manifests, applies range()-based retry windows, detects anomalies with for...else, and summarizes route loads with nested loops.',
    requirements: [
      'Iterate over a dictionary of route_id -> package_weights using .items() to compute per-route total weight',
      'Use continue to skip zero-weight cancelled parcels and break if a hazardous weight (> 100kg) is encountered',
      'Use a for...else search to verify whether a priority parcel ID exists in the manifest',
      'Use a bounded while loop (max 3 attempts) to simulate dispatch confirmation',
      'Use nested loops to generate a 2D bay-by-slot loading schedule',
    ],
    rubric: [
      { criterion: 'Correct for/while/range iteration and .items() unpacking', weight: 40 },
      { criterion: 'Proper break, continue, and for...else no-break logic', weight: 30 },
      { criterion: 'Nested loop schedule & bounded safety guard', weight: 30 },
    ],
    starterCode: `# Multi-Pass Logistics & Fleet Dispatch Engine
routes = {
    "R1": [12, 0, 25, 18],
    "R2": [30, 15, 10],
}

# 1. Compute per-route totals skipping 0kg cancelled parcels
# 2. Search priority IDs using for...else
# 3. Generate a 2x3 bay-slot loading grid with nested loops
`,
  },
  dayQuiz: {
    title: 'Day 10 Mastery Checkpoint Quiz: Loops',
    passingScorePercentage: 80,
    questions: [
      {
        id: 'd10-q1',
        scenario: 'range(start, stop, step) Boundaries',
        question: 'Which list is produced by `list(range(2, 10, 3))`?',
        options: [
          { id: 'q1-a', text: '[2, 5, 8]', explanation: 'Correct! Starts at 2, adds 3 -> 5, adds 3 -> 8; next would be 11 >= 10, so it stops.', isCorrect: true },
          { id: 'q1-b', text: '[2, 5, 8, 10]', explanation: 'Incorrect. 8 + 3 = 11, not 10, and stop=10 is exclusive.', isCorrect: false },
          { id: 'q1-c', text: '[3, 6, 9]', explanation: 'Incorrect. start is 2, not 3.', isCorrect: false },
          { id: 'q1-d', text: '[2, 4, 6, 8]', explanation: 'Incorrect. step is 3, not 2.', isCorrect: false },
        ],
      },
      {
        id: 'd10-q2',
        scenario: 'Negative Step Counting',
        question: 'What is the output of `list(range(6, 0, -2))`?',
        options: [
          { id: 'q2-a', text: '[6, 4, 2]', explanation: 'Correct! Starts at 6, steps by -2 while > 0, stopping before 0.', isCorrect: true },
          { id: 'q2-b', text: '[6, 4, 2, 0]', explanation: 'Incorrect. stop=0 is exclusive.', isCorrect: false },
          { id: 'q2-c', text: '[]', explanation: 'Incorrect. start=6 > stop=0 with negative step=-2 is valid.', isCorrect: false },
          { id: 'q2-d', text: '[6, 5, 4, 3, 2, 1]', explanation: 'Incorrect. step is -2, not -1.', isCorrect: false },
        ],
      },
      {
        id: 'd10-q3',
        scenario: 'Zero Step Guard',
        question: 'What happens when Python evaluates `range(0, 10, 0)`?',
        options: [
          { id: 'q3-a', text: 'Raises ValueError: range() arg 3 must not be zero.', explanation: 'Correct! A step of 0 cannot advance toward stop, so Python raises ValueError immediately.', isCorrect: true },
          { id: 'q3-b', text: 'Produces an infinite sequence of zeros.', explanation: 'Incorrect. Python rejects step=0 up front with ValueError.', isCorrect: false },
          { id: 'q3-c', text: 'Returns an empty range.', explanation: 'Incorrect. Empty ranges occur on direction mismatch, not step=0.', isCorrect: false },
          { id: 'q3-d', text: 'Defaults step to 1.', explanation: 'Incorrect. Passing 0 explicitly raises ValueError.', isCorrect: false },
        ],
      },
      {
        id: 'd10-q4',
        scenario: 'Loop Variable Persistence',
        question: 'After `for i in range(4): pass` finishes, what is `i`?',
        options: [
          { id: 'q4-a', text: '3', explanation: 'Correct! range(4) yields 0, 1, 2, 3, and i remains bound to 3 after the loop.', isCorrect: true },
          { id: 'q4-b', text: '4', explanation: 'Incorrect. 4 is the exclusive stop and is never assigned to i.', isCorrect: false },
          { id: 'q4-c', text: 'NameError: i is not defined', explanation: 'Incorrect. Python loop variables persist in the enclosing scope.', isCorrect: false },
          { id: 'q4-d', text: 'None', explanation: 'Incorrect. i keeps its last assigned value (3).', isCorrect: false },
        ],
      },
      {
        id: 'd10-q5',
        scenario: 'Loop else Clause Semantics',
        question: 'When does the `else:` block attached to a `for` or `while` loop execute?',
        options: [
          { id: 'q5-a', text: 'Only when the loop finishes normally without executing a break statement.', explanation: 'Correct! Loop else means "no break occurred".', isCorrect: true },
          { id: 'q5-b', text: 'Only when the loop body executes zero times.', explanation: 'Incorrect. Even if the loop runs 100 times, else runs as long as break was not hit.', isCorrect: false },
          { id: 'q5-c', text: 'Only when a break statement is executed.', explanation: 'Incorrect. Executing break skips the else block.', isCorrect: false },
          { id: 'q5-d', text: 'Always, regardless of break or return.', explanation: 'Incorrect. break and return both bypass the loop else block.', isCorrect: false },
        ],
      },
      {
        id: 'd10-q6',
        scenario: 'break vs continue',
        question: 'How does `continue` differ from `break` inside a loop?',
        options: [
          { id: 'q6-a', text: 'continue skips only the rest of the current iteration; break exits the loop entirely.', explanation: 'Correct! continue jumps to the next pass, while break terminates the innermost loop.', isCorrect: true },
          { id: 'q6-b', text: 'continue exits all nested loops; break exits only the inner loop.', explanation: 'Incorrect. Neither exits outer loops; continue stays in the same loop.', isCorrect: false },
          { id: 'q6-c', text: 'continue is only for while loops; break is only for for loops.', explanation: 'Incorrect. Both work in both for and while loops.', isCorrect: false },
          { id: 'q6-d', text: 'They are identical aliases in Python 3.', explanation: 'Incorrect. They have opposite effects on loop continuation.', isCorrect: false },
        ],
      },
      {
        id: 'd10-q7',
        scenario: 'Iterating Over a Dictionary',
        question: 'What does `for x in {"a": 1, "b": 2}:` bind `x` to on each pass?',
        options: [
          { id: 'q7-a', text: 'The dictionary keys ("a", then "b").', explanation: 'Correct! Iterating directly over a dict yields its keys; use .items() for (key, value) pairs.', isCorrect: true },
          { id: 'q7-b', text: 'The dictionary values (1, then 2).', explanation: 'Incorrect. Use .values() to iterate over values.', isCorrect: false },
          { id: 'q7-c', text: 'Tuples ("a", 1) and ("b", 2).', explanation: 'Incorrect. Use .items() to get (key, value) tuples.', isCorrect: false },
          { id: 'q7-d', text: 'Integer indices 0 and 1.', explanation: 'Incorrect. Dictionaries are not indexed by position.', isCorrect: false },
        ],
      },
      {
        id: 'd10-q8',
        scenario: 'Nested Loop Execution Count',
        question: 'How many times does `print("*")` run in `for i in range(4): for j in range(3): print("*")`?',
        options: [
          { id: 'q8-a', text: '12 times (4 x 3)', explanation: 'Correct! For each of the 4 outer passes, the inner loop runs 3 times: 4 * 3 = 12.', isCorrect: true },
          { id: 'q8-b', text: '7 times (4 + 3)', explanation: 'Incorrect. Nested loops multiply, not add.', isCorrect: false },
          { id: 'q8-c', text: '4 times', explanation: 'Incorrect. The inner loop runs 3 times per outer pass.', isCorrect: false },
          { id: 'q8-d', text: '3 times', explanation: 'Incorrect. That ignores the outer loop.', isCorrect: false },
        ],
      },
      {
        id: 'd10-q9',
        scenario: 'pass Statement Purpose',
        question: 'What does the `pass` statement do at runtime inside a loop?',
        options: [
          { id: 'q9-a', text: 'Nothing (it is a syntactic no-op placeholder so an empty block is valid Python).', explanation: 'Correct! pass performs no action and lets execution continue normally.', isCorrect: true },
          { id: 'q9-b', text: 'Skips to the next iteration like continue.', explanation: 'Incorrect. pass does NOT jump to the next iteration; any code after pass in the same block still runs.', isCorrect: false },
          { id: 'q9-c', text: 'Exits the loop like break.', explanation: 'Incorrect. pass does not exit the loop.', isCorrect: false },
          { id: 'q9-d', text: 'Raises NotImplementedError.', explanation: 'Incorrect. pass succeeds silently.', isCorrect: false },
        ],
      },
      {
        id: 'd10-q10',
        scenario: 'Safe List Removal During Iteration',
        question: 'Why should you avoid calling `items.remove(x)` inside `for x in items:`?',
        options: [
          { id: 'q10-a', text: 'Mutating the list shifts remaining elements left while the iterator advances, causing elements to be skipped.', explanation: 'Correct! Build a new filtered list or iterate over a copy items[:] instead.', isCorrect: true },
          { id: 'q10-b', text: 'Python raises a SyntaxError if .remove() appears inside a loop.', explanation: 'Incorrect. Python allows it syntactically, which makes the silent skipping bug dangerous.', isCorrect: false },
          { id: 'q10-c', text: 'remove() deletes the entire list.', explanation: 'Incorrect. remove() deletes only the first matching item.', isCorrect: false },
          { id: 'q10-d', text: 'for loops cannot iterate over mutable lists.', explanation: 'Incorrect. for loops iterate over lists routinely.', isCorrect: false },
        ],
      },
    ],
  },
  cheatSheet: [
    {
      category: 'while Loops & State Advancement Invariant',
      syntax: 'while condition:\n    do_work()\n    advance_state()',
      description: 'Repeats as long as condition evaluates to True before each pass. Always ensure at least one variable in the condition advances toward False (or use a bounded max_attempts guard) to avoid infinite loops.',
      example: `retries = 1
while retries <= 3:
    print("Attempt", retries)
    retries += 1`,
    },
    {
      category: 'for-in Loops, Iterators & Accumulator Pattern',
      syntax: 'total = 0\nfor item in iterable:\n    total += item',
      description: 'Iterates cleanly over any iterable via iter() and next() until StopIteration. Initialize accumulators BEFORE the loop, never inside it.',
      example: `scores = [15, 20, 10]
total = 0
for s in scores:
    total += s
print(total)  # 45`,
    },
    {
      category: 'range(start, stop, step) & Exclusive Stop Rule',
      syntax: 'range(stop) | range(start, stop) | range(start, stop, step)',
      description: 'Generates lazy O(1)-memory integer sequences. start is inclusive, stop is strictly exclusive, and step=0 raises ValueError.',
      example: `print(list(range(5)))        # [0, 1, 2, 3, 4]
print(list(range(1, 6)))     # [1, 2, 3, 4, 5]
print(list(range(0, 10, 2))) # [0, 2, 4, 6, 8]`,
    },
    {
      category: 'Negative Stepping & Empty Direction Mismatch',
      syntax: 'range(high, low, -step)  # requires high > low',
      description: 'Negative steps count downward. If start <= stop with a negative step (or start >= stop with a positive step), range() returns an empty sequence rather than raising an error.',
      example: `print(list(range(5, 0, -1)))  # [5, 4, 3, 2, 1]
print(list(range(1, 5, -1)))  # [] (direction mismatch)`,
    },
    {
      category: 'Iterating Over Strings, Lists, Tuples, Sets & Dictionaries',
      syntax: 'for ch in text: | for k in d: | for k, v in d.items():',
      description: 'All built-in collections are iterable. Looping over a dict directly yields keys; use .values() for values and .items() for (key, value) pairs.',
      example: `cfg = {"host": "localhost", "port": 8080}
for k, v in cfg.items():
    print(f"{k}={v}")`,
    },
    {
      category: 'enumerate() & Indexed Sequence Traversal',
      syntax: 'for idx, val in enumerate(seq, start=0):',
      description: 'Pairs each element with its running index cleanly, avoiding manual range(len(seq)) index bookkeeping.',
      example: `tasks = ["build", "test", "deploy"]
for i, task in enumerate(tasks, start=1):
    print(f"{i}. {task}")`,
    },
    {
      category: 'Loop Control: break (Early Exit) & continue (Skip Pass)',
      syntax: 'if stop_cond: break\nif skip_cond: continue',
      description: 'break exits the innermost enclosing loop immediately; continue aborts only the current pass and jumps to the next iteration. In while loops, update counters BEFORE continue.',
      example: `for n in [1, -2, 3, 99, 4]:
    if n < 0:
        continue
    if n == 99:
        break
    print(n)  # prints 1, 3`,
    },
    {
      category: 'Syntactic pass & The Loop else Clause (No-Break Rule)',
      syntax: 'for x in seq:\n    if match(x): break\nelse:\n    handle_not_found()',
      description: 'pass is a no-op placeholder for empty blocks. A loop else block runs ONLY when the loop finishes naturally without executing break.',
      example: `for p in [22, 80, 443]:
    if p == 8080:
        break
else:
    print("Port not found")`,
    },
    {
      category: 'Nested Loops & 2D Matrix / Grid Traversal',
      syntax: 'for i in outer:\n    for j in inner:\n        process(i, j)',
      description: 'The inner loop completes all its iterations for each single pass of the outer loop (M x N total steps). break inside an inner loop exits only the inner loop.',
      example: `for i in range(1, 4):
    for j in range(1, 4):
        print(i * j, end=" ")
    print()`,
    },
    {
      category: 'Loop Variable Persistence & Safe Filtering',
      syntax: 'filtered = [x for x in items if keep(x)]',
      description: 'for-loop variables persist in scope after the loop ends with their final value. Never call items.remove(x) while iterating over items directly—build a new list or iterate over a copy items[:].',
      example: `nums = [2, 4, 5, 6]
odds = [n for n in nums if n % 2 != 0]
print(odds)  # [5]`,
    },
  ],
  sourceNotes: [
    'Primary curriculum reference: Asabeneh Yetayeh, 30 Days of Python — Day 10: Loops (https://github.com/Asabeneh/30-Days-Of-Python/tree/master/10_Day_Loops).',
    'Enhanced with CPython iterator protocol notes, range() lazy O(1) semantics, loop-else no-break mental model, and bounded loop safety patterns.',
  ],
};
