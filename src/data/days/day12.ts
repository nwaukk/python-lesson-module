/**
 * Day 12: Modules (Intermediate Python)
 * Part A (Learn) conforming to Sections 10, 13.2, and 14 of the Master Specification.
 * Includes:
 *  - 7 Detailed Subtopics following the 10-step pedagogical structure
 *  - 3 Signature Simulations: import-simulator, module-explorer, seeded-random-lab
 *  - Watch-outs: browser virtual filesystem / limited stdlib labeling; seeded random examples.
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_12_MODULE: DayModule = {
  schemaVersion: 1,
  number: 12,
  title: 'Modules',
  level: 'intermediate',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/12_Day_Modules',
  estimatedMinutes: 65,
  prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  objectives: [
    'Understand what a Python module is and how modules organize code into isolated namespaces',
    'Use import, from ... import, import ... as, and understand why star imports (from mod import *) should be avoided',
    'Apply core standard library modules: math, statistics, and datetime',
    'Generate reproducible pseudo-random outputs using random.seed()',
    'Inspect os and sys safely while understanding browser virtual filesystem and sandbox limits',
    'Create and import custom modules and guard runnable scripts with if __name__ == "__main__":',
    'Explore module attributes with dir() and navigate Python’s standard library',
  ],
  subtopics: [
    {
      id: 'day12-sub1',
      number: 1,
      title: 'What a Module Is & Namespace Isolation',
      summary: 'Organize Python code into reusable .py files with dedicated namespaces that prevent name collisions.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Modular Architecture: Files as Namespaces',
        paragraphs: [
          'A **module** in Python is simply any file ending in `.py` containing Python definitions (functions, classes, variables) and executable statements. Splitting a large application into focused modules—like `pricing.py`, `auth.py`, and `reports.py`—keeps codebases maintainable and testable.',
          'Crucially, every module has its own **namespace** (symbol table). A variable named `tax_rate` inside `pricing.py` does not collide with a `tax_rate` in `reports.py` unless you explicitly import them into the same scope.',
          'When Python imports a module for the first time, it executes the module’s top-level code once and caches the resulting module object in `sys.modules` so subsequent imports are instant.',
        ],
        keyTerms: [
          {
            term: 'Module',
            definition: 'A .py file containing Python code that can be imported and reused across other scripts.',
          },
          {
            term: 'Namespace',
            definition: 'An isolated mapping from names to objects that prevents identifier collisions between modules.',
          },
          {
            term: 'sys.modules',
            definition: 'Python’s internal cache dictionary of already-loaded modules.',
          },
        ],
        bulletPoints: [
          'Every .py file is a module whose name is the filename without .py.',
          'Modules encapsulate names in their own namespace.',
          'Python executes a module once on first import and caches it in sys.modules.',
        ],
      },
      visualise: {
        type: 'import-simulator',
        title: 'Virtual File Tree & Import Namespace Simulator',
        badge: 'simulation',
        description: 'Inspect how modules in a virtual project tree populate the caller namespace.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Inspecting Module Objects & Namespaces',
          runMode: 'real',
          code: `import math
import sys

print("Module name:", math.__name__)
print("Cached in sys.modules:", "math" in sys.modules)
print("math.sqrt(16):", math.sqrt(16))`,
          expectedOutput: `Module name: math
Cached in sys.modules: True
math.sqrt(16): 4.0`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'import math',
          internalEffect: 'Loads the built-in math module, caches it in sys.modules["math"], and binds name math in the current namespace.',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 'math.sqrt(16)',
          internalEffect: 'Looks up sqrt inside math’s namespace rather than globals(), avoiding collisions.',
        },
      ],
      apply: {
        domain: 'Backend Engineering',
        contextTitle: 'Checking Loaded Modules at Startup',
        scenario: 'Verify whether core standard modules are already loaded in sys.modules.',
        code: `import json
import sys

for mod in ("json", "math", "nonexistent_mod"):
    print(mod, "loaded:", mod in sys.modules)`,
        outcome: `json loaded: True
math loaded: True
nonexistent_mod loaded: False`,
      },
      commonMistakes: [
        {
          label: 'Naming Your Script the Same as a Standard Library Module',
          erroneousCode: `# Saving your file as random.py and running:
import random
print(random.randint(1, 6))`,
          errorMessage: "AttributeError: partially initialized module 'random' has no attribute 'randint'",
          explanation: 'Python searches the current directory before the standard library, so random.py imports itself instead of stdlib random.',
          correctedCode: `# Rename your file to dice_sim.py, then:
import random
random.seed(1)
print(random.randint(1, 6))`,
        },
      ],
      sourceNotes: 'Covers module fundamentals from Asabeneh Day 12.',
      practise: [
        {
          id: 'd12-s1-ex1',
          title: 'Scenario: Module Caching in sys.modules',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Application Boot Performance',
          prompt: 'If `auth.py` and `billing.py` both execute `import math`, how many times does Python load and execute `math`?',
          options: [
            { id: 'opt-1', text: 'Once — Python caches the module object in sys.modules and reuses it.', explanation: 'Correct! Subsequent imports look up sys.modules["math"] in O(1) time without re-executing.', isCorrect: true },
            { id: 'opt-2', text: 'Twice — once per importing file.', explanation: 'Incorrect. Modules are singletons per interpreter process.', isCorrect: false },
            { id: 'opt-3', text: 'Every time a math function is called.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'Raises ImportError on the second import.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Think about sys.modules.',
            'Does Python re-execute a module on every import?',
          ],
        },
        {
          id: 'd12-s1-ex2',
          title: 'Theory: Why Separate Files into Modules?',
          type: 'theory-reasoning',
          tier: 'standard',
          points: 10,
          contextScenario: 'Monolith Refactoring',
          prompt: 'What is the primary architectural benefit of splitting a 2,000-line script into focused `.py` modules?',
          options: [
            { id: 'opt-1', text: 'Each module provides an isolated namespace, clearer ownership, and reusable functions across multiple entrypoints.', explanation: 'Correct! Modules prevent name collisions and improve maintainability and testability.', isCorrect: true },
            { id: 'opt-2', text: 'Python forbids files longer than 500 lines.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'Splitting files disables garbage collection.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'It removes the need for function parameters.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Consider namespace isolation and code reuse.',
            'Think about how two files can both define helper() without colliding.',
          ],
        },
        {
          id: 'd12-s1-ex3',
          title: 'Predict Output: Module Attribute Access',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Namespace Verification',
          prompt: 'What does `print(math.__name__)` output after `import math`?',
          starterCode: `import math
print(math.__name__)`,
          options: [
            { id: 'opt-1', text: 'math', explanation: 'Correct! Imported modules store their module name in __name__.', isCorrect: true },
            { id: 'opt-2', text: '__main__', explanation: 'Incorrect. __main__ is only for the top-level script being executed.', isCorrect: false },
            { id: 'opt-3', text: '<module math>', explanation: 'Incorrect. That is str(math), not math.__name__.', isCorrect: false },
            { id: 'opt-4', text: 'AttributeError', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Was math imported or executed directly as the main script?',
            'Imported modules have __name__ equal to their module name.',
          ],
        },
      ],
    },
    {
      id: 'day12-sub2',
      number: 2,
      title: 'The import Forms (import, from, as & Why to Avoid *)',
      summary: 'Master all four Python import syntaxes and understand why wildcard star imports harm readability and safety.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Four Ways to Import — And One to Avoid',
        paragraphs: [
          'Python offers four primary import forms: `import mod` (keeps the `mod.` prefix), `from mod import name` (binds `name` directly), `import mod as alias` (shortens long module names like `import statistics as stats`), and `from mod import *` (star import).',
          'Using `import mod` or `from mod import name` makes every symbol’s origin crystal clear when reading code months later.',
          'Avoid `from mod import *` in production code: it dumps every public name from `mod` into your current namespace, silently overwriting any existing functions or built-ins with the same name and confusing static analyzers.',
        ],
        keyTerms: [
          {
            term: 'Qualified Import (import mod)',
            definition: 'Binds only the module object; attributes are accessed via mod.attr.',
          },
          {
            term: 'Aliased Import (import mod as m)',
            definition: 'Binds the module to a shorter local name while keeping attribute access qualified.',
          },
          {
            term: 'Star Import (from mod import *)',
            definition: 'Imports all non-underscore names into the caller’s namespace; discouraged due to collision risk.',
          },
        ],
        bulletPoints: [
          'Prefer import mod or from mod import specific_name.',
          'Use as for standard conventions (e.g., import datetime as dt).',
          'Never use from mod import * in production modules.',
        ],
      },
      visualise: {
        type: 'import-simulator',
        title: 'Import Forms & Collision Detector',
        badge: 'simulation',
        description: 'Toggle between import, from-import, alias, and star-import to inspect namespace bindings.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Comparing Qualified, Direct, and Aliased Imports',
          runMode: 'real',
          code: `import math
from math import factorial
import statistics as stats

print("ceil(4.2):", math.ceil(4.2))
print("5!:", factorial(5))
print("mean:", stats.mean([10, 20, 30]))`,
          expectedOutput: `ceil(4.2): 5
5!: 120
mean: 20`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'from math import factorial',
          internalEffect: 'Binds only factorial directly in globals(); math itself is not required for calling factorial(5).',
        },
        {
          step: 2,
          codeLine: 3,
          instruction: 'import statistics as stats',
          internalEffect: 'Binds the statistics module object under the local alias stats.',
        },
      ],
      apply: {
        domain: 'Data Engineering',
        contextTitle: 'Aliasing Standard Modules Cleanly',
        scenario: 'Combine datetime and math aliases in a timestamped metrics helper.',
        code: `from datetime import date
import math as m

today = date(2026, 11, 9)
print(f"{today.isoformat()} | log2(64)={int(m.log2(64))}")`,
        outcome: '2026-11-09 | log2(64)=6',
      },
      commonMistakes: [
        {
          label: 'Silently Shadowing Built-ins with Star Import',
          erroneousCode: `from math import *
# Suppose a custom helper also defined sum() or round():
# Star import silently overwrites built-ins!`,
          errorMessage: 'Silent Name Shadowing: unclear where functions originate',
          explanation: 'Wildcard imports pollute the local namespace and can overwrite existing functions without warning.',
          correctedCode: `from math import sqrt, pi
print(round(pi, 2), sqrt(9))`,
        },
      ],
      sourceNotes: 'Covers import forms and star-import caution from Section 14.',
      practise: [
        {
          id: 'd12-s2-ex1',
          title: 'Fill the Gaps: Aliased Import Syntax',
          type: 'fill-the-gaps',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Descriptive Statistics Helper',
          prompt: 'Complete the aliased import so `stats.mean([2, 4, 6])` returns `4`.',
          starterCode: `__GAP_1__ statistics __GAP_2__ stats
print(stats.__GAP_3__([2, 4, 6]))`,
          gaps: [
            { id: 'GAP_1', beforeText: '', afterText: 'statistics', correctAnswer: 'import', options: ['import', 'from', 'using'] },
            { id: 'GAP_2', beforeText: 'statistics', afterText: 'stats', correctAnswer: 'as', options: ['as', 'in', 'to'] },
            { id: 'GAP_3', beforeText: 'stats.', afterText: '([2, 4, 6])', correctAnswer: 'mean', options: ['mean', 'avg', 'sum'] },
          ],
          hints: [
            'Use import <module> as <alias>.',
            'The statistics module function for arithmetic average is mean().',
          ],
        },
        {
          id: 'd12-s2-ex2',
          title: 'Explain the Trace: Why Star Imports Cause Shadowing Bugs',
          type: 'explain-the-trace',
          tier: 'challenge',
          points: 15,
          contextScenario: 'Production Shadowing Incident',
          traceStepCode: `def sum(items):
    return "custom"

from builtins import *`,
          traceQuestion: 'Explain why `from mod import *` is dangerous when multiple modules define functions with common names like `open`, `round`, or `sum`.',
          prompt: 'Explain how star imports pollute namespaces and silently shadow existing bindings.',
          modelAnswer: 'from mod import * binds every public symbol from mod directly into the current namespace, overwriting any previously defined function or variable with the same name without raising an error, and making it unclear to readers which module a symbol came from.',
          markingCriteria: [
            { id: 'mc1', label: 'Explains silent overwriting (shadowing) of existing names', points: 5 },
            { id: 'mc2', label: 'Notes loss of explicit origin/readability', points: 5 },
            { id: 'mc3', label: 'Recommends explicit import mod or from mod import name', points: 5 },
          ],
          hints: [
            'What happens if two imported modules both export a function named parse()?',
            'Does Python warn you when * overwrites an existing name?',
          ],
        },
        {
          id: 'd12-s2-ex3',
          title: 'Fix the Bug: Unqualified Name After import math',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 10,
          contextScenario: 'Geometry Distance Calculation',
          prompt: 'Calling `sqrt(25)` raises `NameError` because only `math` was imported. Fix line 2 to qualify `math.sqrt(25)`.',
          starterCode: `import math
print(sqrt(25))`,
          solutionCode: `import math
print(math.sqrt(25))`,
          hints: [
            'import math binds math, not sqrt.',
            'Qualify the call as math.sqrt(25).',
          ],
        },
      ],
    },
    {
      id: 'day12-sub3',
      number: 3,
      title: 'The math, statistics & datetime Modules in Outline',
      summary: 'Leverage built-in math, statistics, and datetime modules for numeric precision, descriptive stats, and date arithmetic.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Essential Standard Library Tools: math, statistics, datetime',
        paragraphs: [
          'Python’s "batteries included" standard library ships with battle-tested modules so you don’t have to reinvent core utilities. `math` provides C-accelerated mathematical functions (`sqrt`, `ceil`, `floor`, `gcd`, `pi`).',
          '`statistics` computes descriptive statistics directly on numeric sequences: `mean()`, `median()`, `mode()`, and `stdev()`.',
          '`datetime` models calendar dates (`date`), wall-clock times (`time`), combined timestamps (`datetime`), and durations (`timedelta`) for clean date arithmetic.',
        ],
        keyTerms: [
          {
            term: 'math Module',
            definition: 'Provides mathematical constants (pi, e) and functions (sqrt, ceil, floor, log, gcd).',
          },
          {
            term: 'statistics Module',
            definition: 'Provides mean, median, mode, variance, and stdev for numeric data.',
          },
          {
            term: 'datetime.timedelta',
            definition: 'Represents a duration (days, seconds) that can be added to or subtracted from date/datetime objects.',
          },
        ],
        bulletPoints: [
          'math.ceil() rounds up; math.floor() rounds down.',
          'statistics.median() handles even-length lists by averaging the two middle values.',
          'Use timedelta(days=N) for safe calendar arithmetic across month/year boundaries.',
        ],
      },
      visualise: {
        type: 'module-explorer',
        title: 'Standard Library Module Explorer',
        badge: 'simulation',
        description: 'Inspect dir() exports and live usage for math, statistics, datetime, random, and sys.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Using math, statistics, and datetime Together',
          runMode: 'real',
          code: `import math
import statistics as stats
from datetime import date, timedelta

scores = [70, 85, 85, 92]
print("Ceiling:", math.ceil(4.1), "Floor:", math.floor(4.9))
print("Mean:", stats.mean(scores), "Median:", stats.median(scores))

start = date(2026, 11, 9)
due = start + timedelta(days=14)
print("Due date:", due.isoformat())`,
          expectedOutput: `Ceiling: 5 Floor: 4
Mean: 83 Median: 85.0
Due date: 2026-11-23`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 6,
          instruction: 'math.ceil(4.1), math.floor(4.9)',
          internalEffect: 'ceil returns smallest integer >= x (5); floor returns largest integer <= x (4).',
        },
        {
          step: 2,
          codeLine: 10,
          instruction: 'start + timedelta(days=14)',
          internalEffect: 'Adds 14 calendar days to 2026-11-09, returning date(2026, 11, 23).',
        },
      ],
      apply: {
        domain: 'FinTech Loan Scheduling',
        contextTitle: 'Computing Repayment Due Dates & Averages',
        scenario: 'Calculate average installment amount and the next 30-day repayment date.',
        code: `import statistics as stats
from datetime import date, timedelta

payments = [15000, 18000, 15000, 20000]
issued = date(2026, 11, 1)
print("Avg:", stats.mean(payments), "| Next:", issued + timedelta(days=30))`,
        outcome: 'Avg: 17000 | Next: 2026-12-01',
      },
      commonMistakes: [
        {
          label: 'Adding an Integer Directly to a date Object',
          erroneousCode: `from datetime import date
d = date(2026, 11, 9)
print(d + 7)`,
          errorMessage: "TypeError: unsupported operand type(s) for +: 'datetime.date' and 'int'",
          explanation: 'You must wrap day offsets in datetime.timedelta(days=7) before adding to a date.',
          correctedCode: `from datetime import date, timedelta
d = date(2026, 11, 9)
print(d + timedelta(days=7))`,
        },
      ],
      sourceNotes: 'Covers math, statistics, and datetime modules from Asabeneh Day 12 and Section 14.',
      practise: [
        {
          id: 'd12-s3-ex1',
          title: 'Write Code: Batch Pagination Page Count with math.ceil',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'REST API Paginator',
          prompt: 'Write a function `total_pages(items_count, page_size)` using `math.ceil` to return the integer number of pages needed.',
          starterCode: `import math

def total_pages(items_count, page_size):
    # Return ceiling of items_count / page_size
    pass`,
          solutionCode: `import math

def total_pages(items_count, page_size):
    return math.ceil(items_count / page_size)`,
          testCases: [
            { id: 'tc1', label: 'Remainder page', setup: 'assert total_pages(25, 10) == 3', expected: 'True', hidden: false },
            { id: 'tc2', label: 'Exact fit', setup: 'assert total_pages(20, 10) == 2', expected: 'True', hidden: false },
          ],
          hints: [
            'Divide items_count / page_size.',
            'Pass that float to math.ceil(...).',
          ],
        },
        {
          id: 'd12-s3-ex2',
          title: 'Order the Lines: Computing Invoice Expiry Date',
          type: 'order-the-lines',
          tier: 'foundation',
          points: 10,
          contextScenario: 'SaaS Invoice Generator',
          prompt: 'Order the lines to compute a date 30 days after `date(2026, 11, 1)` and print its ISO string.',
          jumbledLines: [
            { id: 'l1', code: 'from datetime import date, timedelta', indent: 0 },
            { id: 'l2', code: 'issued = date(2026, 11, 1)', indent: 0 },
            { id: 'l3', code: 'due = issued + timedelta(days=30)', indent: 0 },
            { id: 'l4', code: 'print(due.isoformat())', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: [
            'Import date and timedelta first.',
            'Create issued, add timedelta(days=30), then print due.isoformat().',
          ],
        },
        {
          id: 'd12-s3-ex3',
          title: 'Write Code: Latency Summary with statistics',
          type: 'write-code',
          tier: 'challenge',
          points: 15,
          contextScenario: 'API Latency Monitor',
          prompt: 'Write `latency_summary(samples)` returning `(round(statistics.mean(samples), 2), statistics.median(samples))`.',
          starterCode: `import statistics

def latency_summary(samples):
    # Return (mean_rounded_2, median)
    pass`,
          solutionCode: `import statistics

def latency_summary(samples):
    return (round(statistics.mean(samples), 2), statistics.median(samples))`,
          testCases: [
            { id: 'tc1', label: 'Sample latencies', setup: 'assert latency_summary([10, 20, 60]) == (30.0, 20)', expected: 'True', hidden: false },
          ],
          hints: [
            'Call statistics.mean(samples) and round to 2 decimals.',
            'Call statistics.median(samples) and return both in a tuple.',
          ],
        },
      ],
    },
    {
      id: 'day12-sub4',
      number: 4,
      title: 'The random Module & Deterministic Seeding (random.seed)',
      summary: 'Generate pseudo-random integers, selections, and samples—and use random.seed() for 100% reproducible outputs.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Controlled Randomness with random.seed()',
        paragraphs: [
          'Python’s `random` module implements a Mersenne Twister pseudo-random number generator (PRNG). Key functions include `random.random()` (float in `[0.0, 1.0)`), `random.randint(a, b)` (inclusive integer), `random.choice(seq)`, and `random.sample(seq, k)`.',
          'Because PRNGs are mathematical algorithms, their output is completely **deterministic** when initialized with the same starting **seed** via `random.seed(value)`.',
          'In automated tests, simulations, and reproducible curriculum examples, always call `random.seed(...)` first so every run produces the exact same sequence. (Note: `random` is for simulations/games, never for cryptographic passwords—use `secrets` for security.)',
        ],
        keyTerms: [
          {
            term: 'random.seed(n)',
            definition: 'Initializes the PRNG internal state so subsequent random calls produce a repeatable sequence.',
          },
          {
            term: 'randint(a, b)',
            definition: 'Returns a random integer N such that a <= N <= b (both endpoints inclusive).',
          },
          {
            term: 'random.sample(pop, k)',
            definition: 'Returns k unique elements chosen from population without replacement.',
          },
        ],
        bulletPoints: [
          'Always call random.seed(...) when reproducible output is required.',
          'randint(1, 6) includes both 1 and 6; randrange(1, 6) excludes 6.',
          'Never use random for security tokens; use secrets instead.',
        ],
      },
      visualise: {
        type: 'seeded-random-lab',
        title: 'Seeded Random Reproducibility Lab',
        badge: 'simulation',
        description: 'Compare two independent runs with the same seed to verify deterministic sequence reproduction.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Seeded Reproducible Sampling & Choice',
          runMode: 'real',
          code: `import random

random.seed(42)
roll = random.randint(1, 6)
pick = random.choice(["alpha", "beta", "gamma"])
pair = random.sample([10, 20, 30, 40], 2)

print("Roll:", roll, "| Pick:", pick, "| Sample:", pair)`,
          expectedOutput: `Roll: 6 | Pick: alpha | Sample: [10, 30]`,
          notes: 'Because random.seed(42) is set, this output is 100% deterministic.',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'random.seed(42)',
          internalEffect: 'Seeds the Mersenne Twister state to 42 so every subsequent call is reproducible.',
        },
        {
          step: 2,
          codeLine: 4,
          instruction: 'random.randint(1, 6)',
          internalEffect: 'Advances the seeded generator and returns 6.',
        },
      ],
      apply: {
        domain: 'QA & Load Testing',
        contextTitle: 'Reproducible Synthetic Test Data',
        scenario: 'Generate a deterministic 3-item sample of test user IDs using seed(101).',
        code: `import random

random.seed(101)
user_ids = [1001, 1002, 1003, 1004, 1005]
print("QA batch:", random.sample(user_ids, 3))`,
        outcome: 'QA batch: [1005, 1002, 1004]',
      },
      commonMistakes: [
        {
          label: 'Forgetting That random.shuffle() Mutates In-Place and Returns None',
          erroneousCode: `import random
random.seed(7)
cards = ["A", "K", "Q"]
shuffled = random.shuffle(cards)
print(shuffled)`,
          errorMessage: 'Prints None instead of the shuffled list',
          explanation: 'random.shuffle() sorts/shuffles the list in-place and returns None. Use random.sample(cards, len(cards)) for a new shuffled list.',
          correctedCode: `import random
random.seed(7)
cards = ["A", "K", "Q"]
random.shuffle(cards)
print(cards)`,
        },
      ],
      sourceNotes: 'Covers random module and deterministic seeding watch-out from Section 14.',
      practise: [
        {
          id: 'd12-s4-ex1',
          title: 'Scenario: Why Seed random in Tests?',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'CI/CD Unit Test Stability',
          prompt: 'Why should unit tests and curriculum examples that call `random.randint()` or `random.choice()` call `random.seed(42)` first?',
          options: [
            { id: 'opt-1', text: 'It initializes the PRNG to a fixed state so every run produces the exact same deterministic output.', explanation: 'Correct! Seeding guarantees reproducible results across runs.', isCorrect: true },
            { id: 'opt-2', text: 'It makes random numbers cryptographically secure.', explanation: 'Incorrect. Use secrets for cryptography; seeding actually makes outputs predictable.', isCorrect: false },
            { id: 'opt-3', text: 'It prevents ValueError on empty lists.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'It doubles execution speed.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Think about what happens in CI if a test asserts a specific random output without a seed.',
            'Seeding fixes the starting state of the Mersenne Twister.',
          ],
        },
        {
          id: 'd12-s4-ex2',
          title: 'Fix the Bug: random.shuffle() Returns None',
          type: 'fix-the-bug',
          tier: 'challenge',
          points: 15,
          contextScenario: 'Quiz Question Shuffler',
          prompt: '`random.shuffle(items)` mutates `items` in-place and returns `None`. Fix `seeded_shuffle(items, seed_val)` so it returns a new shuffled list without returning `None`.',
          starterCode: `import random

def seeded_shuffle(items, seed_val):
    random.seed(seed_val)
    return random.shuffle(items)`,
          solutionCode: `import random

def seeded_shuffle(items, seed_val):
    random.seed(seed_val)
    copy_items = list(items)
    random.shuffle(copy_items)
    return copy_items`,
          hints: [
            'random.shuffle() returns None.',
            'Copy items with list(items), shuffle the copy, and return copy_items.',
          ],
        },
        {
          id: 'd12-s4-ex3',
          title: 'Predict Output: Inclusive Bounds of randint',
          type: 'predict-output',
          tier: 'standard',
          points: 10,
          contextScenario: 'Dice Simulator Check',
          prompt: 'For `random.randint(1, 6)`, which values are possible?',
          starterCode: `import random
random.seed(1)
val = random.randint(1, 6)
print(1 <= val <= 6)`,
          options: [
            { id: 'opt-1', text: 'True — both 1 and 6 are inclusive in random.randint(1, 6).', explanation: 'Correct! Unlike range(1, 6), randint(1, 6) includes both endpoints.', isCorrect: true },
            { id: 'opt-2', text: 'False — 6 is excluded.', explanation: 'Incorrect. randrange(1, 6) excludes 6, but randint(1, 6) includes 6.', isCorrect: false },
            { id: 'opt-3', text: 'Returns a float between 1.0 and 6.0.', explanation: 'Incorrect. randint returns an int.', isCorrect: false },
            { id: 'opt-4', text: 'TypeError: seed must be a string.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Remember randint(a, b) is inclusive on both ends.',
            'Therefore 1 <= val <= 6 is always True.',
          ],
        },
      ],
    },
    {
      id: 'day12-sub5',
      number: 5,
      title: 'os & sys Safely (Browser Virtual Filesystem Awareness)',
      summary: 'Inspect interpreter metadata with sys and filesystem paths with os, while respecting browser sandbox boundaries.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Navigating sys & os Safely in Sandboxed Environments',
        paragraphs: [
          'The `sys` module exposes Python interpreter internals such as `sys.version`, `sys.platform`, `sys.path` (module search directories), and `sys.getrecursionlimit()`.',
          'The `os` module provides operating-system utilities like `os.getcwd()`, `os.listdir()`, and `os.path.join()` for building cross-platform paths.',
          '**Important Runtime Watch-Out**: In a browser-based Python runtime (like Pyodide / WebAssembly), there is **no direct access to your host computer’s hard drive**. `os` operates inside an isolated **in-memory virtual filesystem (VFS)**, and the available standard library is a curated browser-compatible subset. Always label filesystem operations clearly and avoid destructive OS calls.',
        ],
        keyTerms: [
          {
            term: 'Virtual Filesystem (VFS)',
            definition: 'An isolated in-memory filesystem used by browser Python runtimes instead of the host OS disk.',
          },
          {
            term: 'sys.path',
            definition: 'List of directory strings Python searches when resolving import statements.',
          },
          {
            term: 'os.path.join()',
            definition: 'Safely joins path segments using the active OS separator without hardcoded slashes.',
          },
        ],
        bulletPoints: [
          'Browser runtimes run inside a virtual filesystem with a limited standard library.',
          'Use os.path.join("dir", "file.py") instead of string concatenation.',
          'Inspect sys.version and sys.getrecursionlimit() safely without mutating host state.',
        ],
      },
      visualise: {
        type: 'module-explorer',
        title: 'sys & Standard Library Inspector',
        badge: 'simulation',
        description: 'Select sys in the explorer to inspect its runtime attributes and dir() output.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Safe Inspection of sys and os.path',
          runMode: 'real',
          code: `import os
import sys

joined = os.path.join("projects", "app", "main.py")
print("Joined path:", joined)
print("Recursion limit:", sys.getrecursionlimit())
print("Major version:", sys.version_info.major)`,
          expectedOutput: `Joined path: projects/app/main.py
Recursion limit: 1000
Major version: 3`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'os.path.join("projects", "app", "main.py")',
          internalEffect: 'Constructs a normalized POSIX path inside the virtual filesystem.',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 'sys.getrecursionlimit()',
          internalEffect: 'Reads the current interpreter recursion frame limit (1000) without side effects.',
        },
      ],
      apply: {
        domain: 'Cross-Platform Tooling',
        contextTitle: 'Building Portable Config Paths',
        scenario: 'Join workspace folder segments safely without hardcoded path separators.',
        code: `import os
config_path = os.path.join("etc", "service", "config.json")
print("Config:", config_path)`,
        outcome: 'Config: etc/service/config.json',
      },
      commonMistakes: [
        {
          label: 'Expecting Browser Python os.listdir("/") to Show Your Local Desktop Files',
          erroneousCode: `import os
# Expecting C:\\Users\\... or /Users/... from host OS:
print(os.listdir("/"))`,
          errorMessage: 'Sandbox Isolation: shows only virtual in-memory directories',
          explanation: 'Browser Python executes inside a WebAssembly sandbox with a virtual filesystem; it cannot access your physical hard drive.',
          correctedCode: `import os
print("Current VFS dir:", os.getcwd())`,
        },
      ],
      sourceNotes: 'Covers os/sys safety and browser virtual filesystem watch-out from Section 14.',
      practise: [
        {
          id: 'd12-s5-ex1',
          title: 'Theory: Browser Virtual Filesystem Boundaries',
          type: 'theory-reasoning',
          tier: 'standard',
          points: 10,
          contextScenario: 'WebAssembly Python Sandbox',
          prompt: 'When running `os.getcwd()` or `os.listdir()` in a browser-based Python runtime, what filesystem is being inspected?',
          options: [
            { id: 'opt-1', text: 'An isolated in-memory Virtual Filesystem (VFS) inside the browser sandbox, not the user’s physical hard drive.', explanation: 'Correct! Browser security prevents direct host disk access; os interacts with the VFS.', isCorrect: true },
            { id: 'opt-2', text: 'The user’s C:\\ or /Users/ home folder directly.', explanation: 'Incorrect. Browsers block direct disk access for security.', isCorrect: false },
            { id: 'opt-3', text: 'A remote FTP server.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'os raises SyntaxError in browsers.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Remember the Day 12 watch-out on browser runtimes.',
            'Browsers isolate code inside an in-memory Virtual Filesystem.',
          ],
        },
        {
          id: 'd12-s5-ex2',
          title: 'Write Code: Cross-Platform Log Path Builder',
          type: 'write-code',
          tier: 'project',
          points: 20,
          contextScenario: 'Portable Diagnostics Logger',
          prompt: 'Write `build_log_path(env, filename)` using `os.path.join` to join `"logs"`, `env`, and `filename`.',
          starterCode: `import os

def build_log_path(env, filename):
    # Join "logs", env, filename safely
    pass`,
          solutionCode: `import os

def build_log_path(env, filename):
    return os.path.join("logs", env, filename)`,
          testCases: [
            { id: 'tc1', label: 'Prod log path', setup: 'assert build_log_path("prod", "app.log") == "logs/prod/app.log"', expected: 'True', hidden: false },
          ],
          hints: [
            'Use os.path.join("logs", env, filename).',
            'Avoid manual "+" string concatenation with slashes.',
          ],
        },
      ],
    },
    {
      id: 'day12-sub6',
      number: 6,
      title: 'Creating Custom Modules & The if __name__ == "__main__": Guard',
      summary: 'Design reusable custom modules and use the __name__ == "__main__" guard so test code runs only when executed directly.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Dual-Purpose Files: Importable Module vs Runnable Script',
        paragraphs: [
          'Every Python module has a built-in `__name__` attribute. When you run a file directly (`python my_script.py`), Python sets `__name__` to `"__main__"`. When another file imports it (`import my_script`), Python sets `__name__` to the module’s name (`"my_script"`).',
          'If you put `print()` calls or test runs at the top level of a module without a guard, they will execute every time someone imports your module!',
          'Wrapping script entrypoints in `if __name__ == "__main__":` lets a `.py` file serve cleanly as both a reusable library (when imported) and a standalone runnable script (when executed directly).',
        ],
        keyTerms: [
          {
            term: '__name__',
            definition: 'Dunder string set to "__main__" when a file is run directly, or to the module name when imported.',
          },
          {
            term: 'Main-Script Guard',
            definition: 'The idiom if __name__ == "__main__": that prevents test/CLI code from running on import.',
          },
        ],
        bulletPoints: [
          'Run directly -> __name__ == "__main__".',
          'Imported -> __name__ == "<module_name>".',
          'Always guard top-level test or CLI execution with if __name__ == "__main__":.',
        ],
      },
      visualise: {
        type: 'import-simulator',
        title: 'Custom Module & Caller Namespace',
        badge: 'simulation',
        description: 'Inspect how main.py imports definitions from a custom math_utils.py module.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Inspecting __name__ in the Active Script',
          runMode: 'real',
          code: `import math

def greet_module():
    return "Custom helper ready"

print("math.__name__:", math.__name__)
print("current __name__:", __name__)

if __name__ == "__main__":
    print(greet_module())`,
          expectedOutput: `math.__name__: math
current __name__: __main__
Custom helper ready`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 6,
          instruction: 'print("math.__name__:", math.__name__)',
          internalEffect: 'Imported module math has __name__ == "math".',
        },
        {
          step: 2,
          codeLine: 9,
          instruction: 'if __name__ == "__main__":',
          internalEffect: 'True only in the top-level script; skipped if this file were imported by another module.',
        },
      ],
      apply: {
        domain: 'Library Packaging',
        contextTitle: 'Self-Testing Utility Module',
        scenario: 'Expose a slugify helper while keeping its self-check inside __main__.',
        code: `def slugify(text):
    return text.strip().lower().replace(" ", "-")

if __name__ == "__main__":
    print(slugify("Python Modules Lab"))`,
        outcome: 'python-modules-lab',
      },
      commonMistakes: [
        {
          label: 'Leaving Unconditional Top-Level Side Effects in a Reusable Module',
          erroneousCode: `# In billing.py:
def calc_vat(x): return x * 0.075
print("Running billing self-test...")  # Runs on EVERY import!`,
          errorMessage: 'Unwanted stdout side effect whenever another module does import billing',
          explanation: 'Top-level print() or input() statements execute during import unless wrapped in if __name__ == "__main__":.',
          correctedCode: `def calc_vat(x): return x * 0.075

if __name__ == "__main__":
    print("Running billing self-test...")`,
        },
      ],
      sourceNotes: 'Covers custom modules and the main-script check from Section 14.',
      practise: [
        {
          id: 'd12-s6-ex1',
          title: 'Explain the Trace: __name__ == "__main__" on Import vs Direct Run',
          type: 'explain-the-trace',
          tier: 'challenge',
          points: 15,
          contextScenario: 'Preventing Side Effects on Import',
          traceStepCode: `# utils.py
def clean(s):
    return s.strip()

if __name__ == "__main__":
    print("Self-test:", clean(" hi "))`,
          traceQuestion: 'Explain what happens when `utils.py` is run directly vs when `main.py` executes `import utils`.',
          prompt: 'Compare the value of `__name__` in both scenarios and whether `"Self-test: hi"` prints.',
          modelAnswer: 'When utils.py is run directly, __name__ is "__main__", so the guarded block runs and prints "Self-test: hi". When main.py runs import utils, __name__ inside utils.py is "utils", so the if condition is False and the self-test does not print.',
          markingCriteria: [
            { id: 'mc1', label: 'Direct run sets __name__ == "__main__" and prints self-test', points: 5 },
            { id: 'mc2', label: 'Import sets __name__ == "utils" and skips self-test', points: 5 },
            { id: 'mc3', label: 'Explains why this keeps library imports side-effect-free', points: 5 },
          ],
          hints: [
            'What is __name__ when a file is the main entrypoint?',
            'What is __name__ when a file is imported by another module?',
          ],
        },
        {
          id: 'd12-s6-ex2',
          title: 'Fix the Bug: Missing __main__ Guard in Helper Module',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 10,
          contextScenario: 'Reusable Formatter Module',
          prompt: 'Wrap the test `print(format_code("a1"))` inside an `if __name__ == "__main__":` block so importing this module stays silent.',
          starterCode: `def format_code(code):
    return code.upper()

print(format_code("a1"))`,
          solutionCode: `def format_code(code):
    return code.upper()

if __name__ == "__main__":
    print(format_code("a1"))`,
          hints: [
            'Add if __name__ == "__main__": above the print statement.',
            'Indent the print statement by 4 spaces.',
          ],
        },
      ],
    },
    {
      id: 'day12-sub7',
      number: 7,
      title: 'Listing Contents with dir() & Exploring the Standard Library',
      summary: 'Discover any module’s functions, classes, and constants dynamically using dir() and inspect public vs dunder names.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Introspecting Modules with dir()',
        paragraphs: [
          'You never need to memorize every function in a Python module. The built-in `dir(module)` function returns a sorted list of all attribute names defined inside that module.',
          'Names beginning and ending with double underscores (like `__name__`, `__doc__`, `__file__`) are Python **dunder** (special) metadata attributes. Filtering out names that start with `_` (`[n for n in dir(math) if not n.startswith("_")]`) reveals the clean public API.',
          'Combining `dir()` with `help(obj)` or `obj.__doc__` lets you explore any standard library or third-party module directly from Python.',
        ],
        keyTerms: [
          {
            term: 'dir(object)',
            definition: 'Built-in function returning a sorted list of valid attribute names on a module or object.',
          },
          {
            term: 'Public API Filtering',
            definition: 'Excluding underscore-prefixed internal/dunder names to view a module’s user-facing functions and constants.',
          },
        ],
        bulletPoints: [
          'dir(mod) lists every name in the module’s namespace.',
          'Filter out names starting with "_" to see public functions and constants.',
          'Use getattr(mod, name) or mod.__doc__ to inspect discovered attributes.',
        ],
      },
      visualise: {
        type: 'module-explorer',
        title: 'Live dir() Standard Library Explorer',
        badge: 'simulation',
        description: 'Browse public dir() attributes across math, random, statistics, datetime, and sys.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Filtering Public Attributes with dir()',
          runMode: 'real',
          code: `import math

all_names = dir(math)
public_names = [n for n in all_names if not n.startswith("_")]

print("Total names:", len(all_names))
print("First 5 public:", public_names[:5])
print("Has gcd:", "gcd" in public_names)`,
          expectedOutput: `Total names: 66
First 5 public: ['acos', 'acosh', 'asin', 'asinh', 'atan']
Has gcd: True`,
          notes: 'Total count may vary slightly across Python 3 minor releases, while public names remain consistent.',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'all_names = dir(math)',
          internalEffect: 'Retrieves sorted list of all keys in math.__dict__.',
        },
        {
          step: 2,
          codeLine: 4,
          instruction: '[n for n in all_names if not n.startswith("_")]',
          internalEffect: 'Filters out dunder metadata like __name__ and __doc__ to list only public math symbols.',
        },
      ],
      apply: {
        domain: 'Developer Tooling',
        contextTitle: 'Auditing Public Exports of statistics',
        scenario: 'List public statistical functions containing "mean" in their name.',
        code: `import statistics
mean_fns = [n for n in dir(statistics) if "mean" in n and not n.startswith("_")]
print("Mean functions:", mean_fns)`,
        outcome: "Mean functions: ['fmean', 'geometric_mean', 'harmonic_mean', 'mean']",
      },
      commonMistakes: [
        {
          label: 'Calling dir("math") with a String Instead of the Module Object',
          erroneousCode: `import math
print(dir("math"))  # Lists str methods, not math functions!`,
          errorMessage: 'Returns string methods (upper, split...) instead of math attributes',
          explanation: 'Passing a string "math" inspects the str class; pass the imported module object math without quotes.',
          correctedCode: `import math
print("sqrt" in dir(math))`,
        },
      ],
      sourceNotes: 'Covers dir() introspection and standard library exploration from Asabeneh Day 12.',
      practise: [
        {
          id: 'd12-s7-ex1',
          title: 'Write Code: Public Module API Lister',
          type: 'write-code',
          tier: 'project',
          points: 20,
          contextScenario: 'Interactive Docs Generator',
          prompt: 'Write `public_exports(mod)` that returns a list of attribute names in `dir(mod)` that do NOT start with `"_"`.',
          starterCode: `def public_exports(mod):
    # Return public names from dir(mod)
    pass`,
          solutionCode: `def public_exports(mod):
    return [name for name in dir(mod) if not name.startswith("_")]`,
          testCases: [
            { id: 'tc1', label: 'Inspect math', setup: 'import math; res = public_exports(math); assert "sqrt" in res and "__name__" not in res', expected: 'True', hidden: false },
          ],
          hints: [
            'Call dir(mod) to get all attribute names.',
            'Filter out any name where name.startswith("_").',
          ],
        },
        {
          id: 'd12-s7-ex2',
          title: 'Scenario: dir(mod) vs dir("mod")',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'REPL Introspection Mistake',
          prompt: 'A learner runs `dir("statistics")` after `import statistics` and sees `["upper", "lower", "split", ...]`. Why?',
          options: [
            { id: 'opt-1', text: 'Quotes turned "statistics" into a str object, so dir() listed string methods instead of the module.', explanation: 'Correct! Pass the module object statistics without quotes: dir(statistics).', isCorrect: true },
            { id: 'opt-2', text: 'statistics only contains string methods.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'dir() always returns string methods.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'statistics failed to import.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Notice the quotes around "statistics".',
            'What type is "statistics"?',
          ],
        },
      ],
    },
  ],
  realWorldLabs: [
    {
      id: 'day12-lab1',
      title: 'Deterministic QA Lottery & Audit Sampler',
      description: 'Use random.seed(2026), random.sample(), statistics.mean(), and math.ceil() to select a reproducible audit sample and compute its ceiling average.',
      domain: 'Quality Assurance & Compliance',
      starterCode: `import math
import random
import statistics as stats

random.seed(2026)
invoices = [120, 450, 310, 890, 240, 560]

# 1. Sample 3 invoices using random.sample(invoices, 3)
# 2. Compute mean with stats.mean(sample) and ceiling with math.ceil(...)
# 3. Print Sample and Ceiling Mean
`,
      targetOutput: `Sample: [310, 450, 240]
Ceiling Mean: 334`,
    },
    {
      id: 'day12-lab2',
      title: 'Subscription Renewal & VFS Path Configurator',
      description: 'Combine datetime.date, timedelta, os.path.join (inside browser VFS), and if __name__ == "__main__": to build a portable renewal report.',
      domain: 'SaaS Billing & VFS Tooling',
      starterCode: `import os
from datetime import date, timedelta

def next_renewal(start_date, days=30):
    return (start_date + timedelta(days=days)).isoformat()

if __name__ == "__main__":
    report_path = os.path.join("vfs", "billing", "renewal.txt")
    due = next_renewal(date(2026, 11, 9), 15)
    print(f"Path: {report_path} | Due: {due}")`,
      targetOutput: `Path: vfs/billing/renewal.txt | Due: 2026-11-24`,
    },
  ],
  miniProject: {
    id: 'day12-project',
    title: 'Standard Library Analytics & Diagnostics Toolkit',
    brief: 'Build a modular diagnostics script that combines math, statistics, seeded random, datetime, os.path, sys, and dir() introspection under an __name__ == "__main__" entrypoint.',
    requirements: [
      'Use explicit imports (import math, import statistics as stats, from datetime import date, timedelta) with zero star imports',
      'Seed random with random.seed(42) before sampling synthetic telemetry',
      'Compute mean, median, and ceiling/floor bounds using statistics and math',
      'Build a portable VFS output path with os.path.join and check sys.version_info.major',
      'Expose public module exports via dir() filtering and guard execution with if __name__ == "__main__":',
    ],
    rubric: [
      { criterion: 'Clean explicit/aliased imports & zero star imports', weight: 30 },
      { criterion: 'Seeded random + math/statistics/datetime accuracy', weight: 40 },
      { criterion: 'Safe VFS os.path/sys usage & __main__ guard', weight: 30 },
    ],
    starterCode: `# Standard Library Analytics & Diagnostics Toolkit
import math
import os
import random
import statistics as stats
import sys
from datetime import date, timedelta

if __name__ == "__main__":
    random.seed(42)
    # Build your diagnostics summary here
`,
  },
  dayQuiz: {
    title: 'Day 12 Mastery Checkpoint Quiz: Modules',
    passingScorePercentage: 80,
    questions: [
      {
        id: 'd12-q1',
        scenario: 'Star Imports',
        question: 'Why should `from module import *` be avoided in production Python?',
        options: [
          { id: 'q1-a', text: 'It pollutes the caller namespace and can silently overwrite existing functions or built-ins.', explanation: 'Correct! Explicit imports keep namespaces clean and origins clear.', isCorrect: true },
          { id: 'q1-b', text: 'It is a SyntaxError in Python 3.', explanation: 'Incorrect. It is legal syntax, just bad practice.', isCorrect: false },
          { id: 'q1-c', text: 'It only imports private underscore names.', explanation: 'Incorrect. It skips underscore names.', isCorrect: false },
          { id: 'q1-d', text: 'It deletes the source .py file.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd12-q2',
        scenario: 'Deterministic Randomness',
        question: 'What is the effect of calling `random.seed(10)` before `random.randint(1, 100)`?',
        options: [
          { id: 'q2-a', text: 'Every run starting with seed(10) produces the exact same sequence of numbers.', explanation: 'Correct! Seeding initializes the PRNG deterministically.', isCorrect: true },
          { id: 'q2-b', text: 'It restricts randint to return 10.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q2-c', text: 'It makes random cryptographically secure.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q2-d', text: 'It disables random.choice().', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd12-q3',
        scenario: '__name__ == "__main__"',
        question: 'When `helper.py` is imported via `import helper`, what is `__name__` inside `helper.py`?',
        options: [
          { id: 'q3-a', text: '"helper"', explanation: 'Correct! __name__ is "__main__" only when run directly; on import it is the module name.', isCorrect: true },
          { id: 'q3-b', text: '"__main__"', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q3-c', text: 'None', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q3-d', text: '"__init__"', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd12-q4',
        scenario: 'Browser Runtime Sandbox',
        question: 'In a browser-based Python runtime, what does the `os` module interact with?',
        options: [
          { id: 'q4-a', text: 'An isolated in-memory Virtual Filesystem (VFS), not the host computer’s hard drive.', explanation: 'Correct! Browser sandboxes isolate filesystem access to a VFS.', isCorrect: true },
          { id: 'q4-b', text: 'Your physical desktop filesystem directly.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q4-c', text: 'Only Windows registries.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q4-d', text: 'The browser’s GPU memory.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd12-q5',
        scenario: 'Module Introspection',
        question: 'Which built-in function returns a sorted list of attribute names defined in a module `m`?',
        options: [
          { id: 'q5-a', text: 'dir(m)', explanation: 'Correct! dir(m) lists all names in module m.', isCorrect: true },
          { id: 'q5-b', text: 'len(m)', explanation: 'Incorrect. Modules do not support len().', isCorrect: false },
          { id: 'q5-c', text: 'type(m)', explanation: 'Incorrect. Returns <class "module">.', isCorrect: false },
          { id: 'q5-d', text: 'list(m)', explanation: 'Incorrect. Modules are not iterable.', isCorrect: false },
        ],
      },
      {
        id: 'd12-q6',
        scenario: 'Date Arithmetic',
        question: 'Which object from `datetime` represents a duration you can add to a `date`?',
        options: [
          { id: 'q6-a', text: 'timedelta', explanation: 'Correct! date + timedelta(days=N) shifts the calendar date cleanly.', isCorrect: true },
          { id: 'q6-b', text: 'int', explanation: 'Incorrect. Adding an int to a date raises TypeError.', isCorrect: false },
          { id: 'q6-c', text: 'str', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q6-d', text: 'math.ceil', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd12-q7',
        scenario: 'Import Aliasing',
        question: 'After `import statistics as stats`, how do you call `mean([1, 2, 3])`?',
        options: [
          { id: 'q7-a', text: 'stats.mean([1, 2, 3])', explanation: 'Correct! The alias stats binds the module name in the current scope.', isCorrect: true },
          { id: 'q7-b', text: 'statistics.mean([1, 2, 3])', explanation: 'Incorrect. statistics is not bound when aliased with as stats.', isCorrect: false },
          { id: 'q7-c', text: 'mean([1, 2, 3])', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q7-d', text: 'as.mean([1, 2, 3])', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd12-q8',
        scenario: 'math.ceil vs math.floor',
        question: 'What does `math.ceil(3.01)` return?',
        options: [
          { id: 'q8-a', text: '4', explanation: 'Correct! ceil returns the smallest integer >= 3.01, which is 4.', isCorrect: true },
          { id: 'q8-b', text: '3', explanation: 'Incorrect. That is math.floor(3.01).', isCorrect: false },
          { id: 'q8-c', text: '3.0', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q8-d', text: '3.1', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd12-q9',
        scenario: 'Module Caching',
        question: 'Where does Python cache loaded modules to avoid re-executing them on repeated imports?',
        options: [
          { id: 'q9-a', text: 'sys.modules', explanation: 'Correct! sys.modules maps module names to cached module objects.', isCorrect: true },
          { id: 'q9-b', text: 'os.environ', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q9-c', text: 'math.cache', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q9-d', text: 'random.state', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd12-q10',
        scenario: 'In-Place Shuffle',
        question: 'What does `random.shuffle(my_list)` return?',
        options: [
          { id: 'q10-a', text: 'None (it shuffles my_list in-place).', explanation: 'Correct! Just like list.sort(), random.shuffle() mutates in-place and returns None.', isCorrect: true },
          { id: 'q10-b', text: 'A new shuffled list.', explanation: 'Incorrect. Use random.sample(my_list, len(my_list)) for a new list.', isCorrect: false },
          { id: 'q10-c', text: 'A tuple.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q10-d', text: 'The first shuffled element.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
    ],
  },
  cheatSheet: [
    {
      category: 'import Forms, Aliasing (as) & Avoiding Star Imports',
      syntax: 'import math\nimport statistics as stats\nfrom datetime import date, timedelta',
      description: 'Explicit imports bind either the module object or specific names without polluting your namespace. Always avoid from mod import * in production to prevent silent name collisions.',
      example: `import math
import statistics as stats

print(math.ceil(4.2), stats.mean([10, 20, 30]))`,
    },
    {
      category: 'Creating Modules, sys.modules & __name__ == "__main__"',
      syntax: 'if __name__ == "__main__":\n    run_cli()',
      description: 'Every .py file is a module cached in sys.modules on first import. Guard script entrypoints with __name__ == "__main__" so importing the module does not auto-run side effects.',
      example: `def greet(user):
    return f"Hello, {user}"

if __name__ == "__main__":
    print(greet("Ada"))`,
    },
    {
      category: 'math & statistics Standard Modules',
      syntax: 'math.ceil(x) / math.floor(x) / math.sqrt(x)\nstatistics.mean(data) / median(data)',
      description: 'math provides C-backed constants (pi, e) and floating-point/integer rounding; statistics computes descriptive summaries (mean, median, mode, stdev) over numeric iterables.',
      example: `import math, statistics

scores = [82, 90, 95, 88]
print(math.ceil(statistics.mean(scores)))  # 89`,
    },
    {
      category: 'random Module & Deterministic Seeding (random.seed)',
      syntax: 'random.seed(42)\nrandom.randint(a, b) / choice(seq) / sample(seq, k)',
      description: 'Call random.seed(n) for 100% reproducible PRNG sequences in tests and simulations. Note: random.shuffle(lst) mutates in-place and returns None; use random.sample(lst, len(lst)) for a copy.',
      example: `import random

random.seed(42)
print(random.randint(1, 6), random.sample([10, 20, 30], 2))`,
    },
    {
      category: 'datetime & timedelta Calendar Arithmetic',
      syntax: 'from datetime import date, datetime, timedelta\ndue = start + timedelta(days=30)',
      description: 'date and datetime represent calendar points; timedelta represents durations. Adding a timedelta handles month lengths and leap years automatically, and .strftime() formats output.',
      example: `from datetime import date, timedelta

issued = date(2026, 2, 28)
print((issued + timedelta(days=1)).isoformat())  # 2026-03-01`,
    },
    {
      category: 'os, sys & Browser Virtual Filesystem (VFS) Boundaries',
      syntax: 'os.path.join("logs", "app.log")\nsys.version_info.major / sys.modules',
      description: 'os.path.join builds portable file paths and sys exposes interpreter metadata and cached modules. In browser Python sandboxes, os operates on an isolated in-memory VFS, not the host OS disk.',
      example: `import os, sys

path = os.path.join("reports", "daily.txt")
print(path, sys.version_info.major)`,
    },
    {
      category: 'Packages, __init__.py & Third-Party Ecosystem (pip)',
      syntax: 'pkg/__init__.py\npip install requests==2.32.0\npip freeze > requirements.txt',
      description: 'Packages group related modules in directories with __init__.py. Use virtual environments (venv) and pinned requirements.txt files for reproducible third-party installs outside the browser.',
      example: `# Package layout:
# analytics/__init__.py
# analytics/metrics.py
# Imported as: from analytics.metrics import summarize`,
    },
  ],
  sourceNotes: [
    'Primary curriculum reference: Asabeneh Yetayeh, 30 Days of Python — Day 12: Modules (https://github.com/Asabeneh/30-Days-Of-Python/tree/master/12_Day_Modules).',
    'Enhanced with namespace isolation diagrams, seeded PRNG reproducibility, browser virtual filesystem labeling, and __name__ == "__main__" guard patterns.',
  ],
};
