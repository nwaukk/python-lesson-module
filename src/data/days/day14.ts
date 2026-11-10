/**
 * Day 14: Higher-Order Functions, Closures and Decorators (Intermediate Python)
 * Part A (Learn) conforming to Sections 10, 13.2, and 14 of the Master Specification.
 * Includes:
 *  - 8 Detailed Subtopics following the 10-step pedagogical structure
 *  - 3 Signature Simulations: map-filter-reduce-sim, closure-scope-sim, decorator-wrapper-sim
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_14_MODULE: DayModule = {
  schemaVersion: 1,
  number: 14,
  title: 'Higher-Order Functions, Closures and Decorators',
  level: 'intermediate',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/14_Day_Higher_order_functions',
  estimatedMinutes: 85,
  prerequisites: [11, 13],
  objectives: [
    'Treat functions as first-class objects: pass them as arguments and return them from other functions',
    'Build lazy data transformation pipelines using map(), filter(), and functools.reduce()',
    'Explain why map() and filter() return single-pass iterators rather than lists in Python 3',
    'Understand lexical closures and how inner functions retain enclosing __closure__ cell variables',
    'Mutate enclosing state safely with nonlocal and avoid the late-binding loop closure trap',
    'Write and apply @decorator functions using *args and **kwargs',
    'Preserve function metadata (__name__, __doc__) with @functools.wraps and stack multiple decorators',
  ],
  subtopics: [
    {
      id: 'day14-sub1',
      number: 1,
      title: 'Functions as First-Class Objects & Higher-Order Functions',
      summary: 'Pass functions as arguments, return functions from factories, and build composable higher-order pipelines.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Functions Are Objects Just Like Integers and Strings',
        paragraphs: [
          'In Python, functions are **first-class objects**: they can be assigned to variables, stored in lists or dictionaries, passed as arguments to other functions, and returned as results from functions.',
          'A **higher-order function (HOF)** is any function that does at least one of two things: accepts one or more functions as parameters, or returns a function as its output.',
          'Remember the golden rule when passing a function as data: **omit the parentheses `()`**. Writing `apply(double, 5)` passes the function object itself; writing `apply(double(), 5)` calls `double()` immediately.',
        ],
        keyTerms: [
          {
            term: 'First-Class Function',
            definition: 'A function treated as a regular value that can be referenced, stored, passed, and returned.',
          },
          {
            term: 'Higher-Order Function',
            definition: 'A function that takes a function as an argument and/or returns a function.',
          },
        ],
        bulletPoints: [
          'Pass fn without () to hand over the callable object.',
          'HOFs separate generic control flow (e.g., retry, timing, transformation) from specific business logic.',
          'Built-in HOFs include sorted(key=...), map(), filter(), min(), and max().',
        ],
      },
      visualise: {
        type: 'map-filter-reduce-sim',
        title: 'Higher-Order Function Pipeline',
        badge: 'simulation',
        description: 'Explore how higher-order functions apply a passed callable to each item.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Passing & Returning Functions',
          runMode: 'real',
          code: `def square(x):
    return x * x

def apply_twice(fn, value):
    return fn(fn(value))

print("apply_twice(square, 3):", apply_twice(square, 3))`,
          expectedOutput: `apply_twice(square, 3): 81`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 7,
          instruction: 'apply_twice(square, 3)',
          internalEffect: 'Binds parameter fn to function object square and value to 3.',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: 'return fn(fn(value))',
          internalEffect: 'Evaluates square(3) -> 9, then square(9) -> 81.',
        },
      ],
      apply: {
        domain: 'Workflow Engine',
        contextTitle: 'Configurable Formatter Dispatch',
        scenario: 'Pass a formatting function dynamically into a report printer.',
        code: `def shout(s):
    return s.upper() + "!"

def render(items, formatter):
    return [formatter(i) for i in items]

print(render(["ok", "ready"], shout))`,
        outcome: `['OK!', 'READY!']`,
      },
      commonMistakes: [
        {
          label: 'Accidentally Calling the Function With () When Passing It',
          erroneousCode: `def inc(x):
    return x + 1

def run(fn, v):
    return fn(v)

print(run(inc(), 5))`,
          errorMessage: "TypeError: inc() missing 1 required positional argument: 'x'",
          explanation: 'Writing inc() attempts to call inc immediately with zero arguments instead of passing the function object.',
          correctedCode: `def inc(x):
    return x + 1

def run(fn, v):
    return fn(v)

print(run(inc, 5))`,
        },
      ],
      sourceNotes: 'Covers higher-order function basics from Asabeneh Day 14.',
      practise: [
        {
          id: 'd14-s1-ex1',
          title: 'Scenario: Passing Callable vs Invoking Immediately',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Webhook Dispatch Table',
          prompt: 'A developer writes `dispatch(on_success())` instead of `dispatch(on_success)`. What happens?',
          options: [
            { id: 'opt-1', text: 'on_success() executes immediately and its return value (not the function object) is passed to dispatch.', explanation: 'Correct! Omit () when passing a function as a first-class object.', isCorrect: true },
            { id: 'opt-2', text: 'Python treats on_success() and on_success identically.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'dispatch automatically converts the return value back to a function.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'It raises SyntaxError.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'What do parentheses () after a function name do?',
            'Does dispatch expect a function object or its return value?',
            'Always omit () when handing a callable to a higher-order function.',
          ],
        },
        {
          id: 'd14-s1-ex2',
          title: 'Write Code: Higher-Order Pipeline Combinator',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'Text Normalizer Pipeline',
          prompt: 'Write `compose_two(f, g, value)` that returns `f(g(value))`. Test it with `str.upper` and `str.strip` on `"  hello  "` and print the result.',
          starterCode: `def compose_two(f, g, value):
    # Return f(g(value))
    pass

print(compose_two(str.upper, str.strip, "  hello  "))`,
          solutionCode: `def compose_two(f, g, value):
    return f(g(value))

print(compose_two(str.upper, str.strip, "  hello  "))`,
          testCases: [
            { id: 'tc-1', label: 'Applies g then f to produce HELLO', setup: '', expected: 'HELLO', hidden: false },
          ],
          hints: [
            'Call g(value) first.',
            'Pass that result directly into f(...).',
            'return f(g(value)).',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day14-sub2',
      number: 2,
      title: 'Functional Mapping with map(fn, iterable)',
      summary: 'Transform every element of one or more iterables lazily using map() and materialize with list().',
      estimatedMinutes: 10,
      introduce: {
        headline: '1-to-1 Lazy Transformation with map()',
        paragraphs: [
          'The built-in `map(fn, iterable)` applies `fn` to every element of `iterable` and yields the transformed results **lazily** via a `map` iterator object.',
          'In Python 3, printing `map(...)` directly displays `<map object at 0x...>`, not the values. Wrap it in `list(...)`, `tuple(...)`, or iterate over it in a `for` loop to consume the values. Like all iterators, a `map` object is **single-pass** and exhausted once consumed.',
          'You can also pass multiple iterables: `map(lambda a, b: a + b, xs, ys)` pairs elements in parallel and stops at the shortest iterable.',
        ],
        keyTerms: [
          {
            term: 'map(fn, iterable)',
            definition: 'Returns a lazy iterator that yields fn(item) for every item in iterable.',
          },
          {
            term: 'Lazy Iterator',
            definition: 'An object that computes elements one at a time on demand and becomes exhausted after one pass.',
          },
        ],
        bulletPoints: [
          'Always wrap in list(map(...)) if you need a concrete list.',
          'map(str.strip, lines) works cleanly with unbound methods or named functions.',
          'Compare with comprehensions: [fn(x) for x in seq] is often more readable when using a lambda.',
        ],
      },
      visualise: {
        type: 'map-filter-reduce-sim',
        title: 'map() Pipeline Visualizer',
        badge: 'simulation',
        description: 'Trace 1-to-1 element transformation through map(fn, seq).',
        initialConfig: {},
      },
      code: [
        {
          title: 'Single and Multi-Iterable map()',
          runMode: 'real',
          code: `nums = [3, 5, 8]
doubled = list(map(lambda x: x * 2, nums))
print("Doubled:", doubled)

a = [1, 2, 3]
b = [10, 20, 30]
sums = list(map(lambda x, y: x + y, a, b))
print("Pairwise sums:", sums)`,
          expectedOutput: `Doubled: [6, 10, 16]
Pairwise sums: [11, 22, 33]`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'list(map(lambda x: x * 2, nums))',
          internalEffect: 'Pulls 3, 5, 8 from the map iterator, applying x * 2 to each to build [6, 10, 16].',
        },
        {
          step: 2,
          codeLine: 7,
          instruction: 'list(map(lambda x, y: x + y, a, b))',
          internalEffect: 'Zips (1,10), (2,20), (3,30) into the 2-argument lambda.',
        },
      ],
      apply: {
        domain: 'Data Cleaning',
        contextTitle: 'Parsing CSV Numeric Fields',
        scenario: 'Convert a list of string numbers into floats cleanly.',
        code: `raw = ["12.5", "8.0", "19.25"]
floats = list(map(float, raw))
print("Floats:", floats)`,
        outcome: `Floats: [12.5, 8.0, 19.25]`,
      },
      commonMistakes: [
        {
          label: 'Forgetting That map() Returns a Single-Pass Iterator',
          erroneousCode: `m = map(lambda x: x + 1, [1, 2, 3])
print("First:", list(m))
print("Second:", list(m))  # Empty!`,
          errorMessage: 'Logic bug: second list(m) prints []',
          explanation: 'A map object is an iterator consumed on the first pass. Store list(map(...)) in a variable if you need to reuse it.',
          correctedCode: `res = list(map(lambda x: x + 1, [1, 2, 3]))
print("First:", res)
print("Second:", res)`,
        },
      ],
      sourceNotes: 'Covers map() from Asabeneh Day 14.',
      practise: [
        {
          id: 'd14-s2-ex1',
          title: 'Theory: Lazy map() Iterator Exhaustion',
          type: 'theory-reasoning',
          tier: 'standard',
          points: 15,
          contextScenario: 'ETL Batch Conversion',
          prompt: 'Why does `m = map(int, ["1", "2", "3"]); a = list(m); b = list(m)` leave `b` as `[]`?',
          modelAnswer: 'In Python 3, map() returns a lazy single-pass iterator, not a list. The first list(m) call consumes all elements from the iterator, leaving it exhausted so the second list(m) returns [].',
          markingCriteria: [
            { id: 'mc-1', label: 'Identifies map() returns a lazy iterator in Python 3', points: 7 },
            { id: 'mc-2', label: 'Explains iterators are single-pass and exhausted after first list(m)', points: 8 },
          ],
          hints: [
            'What type does map() return in Python 3?',
            'Can an iterator be traversed twice?',
            'list(m) drains the iterator on the first call.',
          ],
        },
        {
          id: 'd14-s2-ex2',
          title: 'Fill the Gaps: Pairwise map() Transformation',
          type: 'fill-the-gaps',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Line-Item Totals',
          prompt: 'Complete the `map()` call to multiply `prices` and `qtys` element-wise and materialize a list.',
          gaps: [
            {
              id: 'gap-1',
              beforeText: 'totals = ',
              afterText: '(map(lambda p, q: p * q, prices, qtys))',
              correctAnswer: 'list',
              options: ['list', 'dict', 'len'],
            },
          ],
          hints: [
            'map() returns a lazy iterator.',
            'Wrap it to materialize a concrete list.',
            'Use list(map(...)).',
          ],
        },
        {
          id: 'd14-s2-ex3',
          title: 'Predict Output: map() Stopping at Shortest Iterable',
          type: 'predict-output',
          tier: 'standard',
          points: 15,
          contextScenario: 'Mismatched Sensor Streams',
          prompt: 'What does `print(list(map(lambda a, b: a + b, [1, 2, 3], [10, 20])))` output?',
          options: [
            { id: 'opt-1', text: '[11, 22]', explanation: 'Correct! Multi-iterable map() stops as soon as the shortest iterable is exhausted.', isCorrect: true },
            { id: 'opt-2', text: '[11, 22, 3]', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'IndexError', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'ValueError', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'How many elements are in [10, 20]?',
            'Does map() raise an error or stop at the shortest iterable?',
            '1+10=11, 2+20=22.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day14-sub3',
      number: 3,
      title: 'Predicate Filtering with filter(pred, iterable)',
      summary: 'Retain elements matching a boolean predicate lazily with filter() and filter(None, iterable).',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Selective Retention with filter()',
        paragraphs: [
          '`filter(predicate, iterable)` constructs a lazy iterator yielding only those elements of `iterable` for which `predicate(element)` returns a **truthy** value.',
          'If you pass `None` as the first argument—`filter(None, iterable)`—Python uses the identity truthiness test, stripping out all falsy values (`0`, `""`, `None`, `False`, `[]`).',
          'Just like `map()`, `filter()` is lazy in Python 3 and must be materialized with `list(...)` or iterated once.',
        ],
        keyTerms: [
          {
            term: 'Predicate',
            definition: 'A function returning a boolean (or truthy/falsy value) used to decide whether to keep an item.',
          },
          {
            term: 'filter(None, seq)',
            definition: 'Idiomatic shorthand that removes all falsy values from seq.',
          },
        ],
        bulletPoints: [
          'filter(pred, seq) never modifies items; it only keeps or drops them.',
          'Combine filter() and map() for readable lazy pipelines, or compare with [f(x) for x in seq if pred(x)].',
        ],
      },
      visualise: {
        type: 'map-filter-reduce-sim',
        title: 'filter() Gatekeeper Visualizer',
        badge: 'simulation',
        description: 'Inspect how filter() drops falsy predicate results and keeps truthy items.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Filtering with a Predicate & filter(None, ...)',
          runMode: 'real',
          code: `scores = [4, 12, 7, 19]
passing = list(filter(lambda x: x >= 10, scores))
print("Passing:", passing)

mixed = ["ok", "", None, "ready", 0]
truthy = list(filter(None, mixed))
print("Truthy:", truthy)`,
          expectedOutput: `Passing: [12, 19]
Truthy: ['ok', 'ready']`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'list(filter(lambda x: x >= 10, scores))',
          internalEffect: 'Tests 4 (False), 12 (True), 7 (False), 19 (True), keeping [12, 19].',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 'list(filter(None, mixed))',
          internalEffect: 'Removes "", None, and 0 because their bool() is False.',
        },
      ],
      apply: {
        domain: 'Log Filtering',
        contextTitle: 'Extracting Non-Empty Error Lines',
        scenario: 'Strip blank lines and keep only ERROR entries from raw logs.',
        code: `logs = ["", "INFO boot", "ERROR disk", ""]
errors = list(filter(lambda s: s.startswith("ERROR"), logs))
print("Errors:", errors)`,
        outcome: `Errors: ['ERROR disk']`,
      },
      commonMistakes: [
        {
          label: 'Expecting filter() to Transform Values',
          erroneousCode: `# Trying to double numbers inside filter()!
res = list(filter(lambda x: x * 2, [0, 1, 2]))
print(res)`,
          errorMessage: 'Logic bug: prints [1, 2] instead of [0, 2, 4]',
          explanation: 'filter() only checks whether the predicate return value is truthy; it emits the original element (1, 2), not x * 2. Use map() to transform.',
          correctedCode: `res = list(map(lambda x: x * 2, [0, 1, 2]))
print(res)`,
        },
      ],
      sourceNotes: 'Covers filter() from Asabeneh Day 14.',
      practise: [
        {
          id: 'd14-s3-ex1',
          title: 'Scenario: filter(None, seq) Truthiness Stripping',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Form Payload Sanitization',
          prompt: 'What does `list(filter(None, ["ada", "", 0, "lin", None]))` return?',
          options: [
            { id: 'opt-1', text: "['ada', 'lin']", explanation: 'Correct! Passing None keeps only truthy elements, removing "", 0, and None.', isCorrect: true },
            { id: 'opt-2', text: "['ada', '', 0, 'lin']", explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: '[None]', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'TypeError', explanation: 'Incorrect. None is a valid first argument to filter().', isCorrect: false },
          ],
          hints: [
            'What does filter(None, seq) test on each element?',
            'Which values are falsy in Python?',
            '"" , 0, and None are all falsy.',
          ],
        },
        {
          id: 'd14-s3-ex2',
          title: 'Fix the Bug: Using filter() to Transform',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 15,
          contextScenario: 'Tax Calculation Pipeline',
          prompt: 'A teammate used `filter()` to add 1 to each number, but it returned `[1, 2, 3]` unchanged. Fix it to use `map()` so it prints `[2, 3, 4]`.',
          starterCode: `nums = [1, 2, 3]
plus_one = list(filter(lambda x: x + 1, nums))
print(plus_one)`,
          solutionCode: `nums = [1, 2, 3]
plus_one = list(map(lambda x: x + 1, nums))
print(plus_one)`,
          testCases: [
            { id: 'tc-1', label: 'Transforms each element to [2, 3, 4]', setup: '', expected: '[2, 3, 4]', hidden: false },
          ],
          hints: [
            'filter() only decides keep/drop; it never transforms values.',
            'Which built-in applies a transformation 1-to-1?',
            'Replace filter with map.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day14-sub4',
      number: 4,
      title: 'Cumulative Folding with functools.reduce()',
      summary: 'Collapse a sequence left-to-right into a single summary value using functools.reduce(fn, seq, initial).',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Folding Sequences Left-to-Right with reduce()',
        paragraphs: [
          'Unlike `map()` and `filter()`, `reduce()` is not a built-in in Python 3—it lives in the `functools` standard module (`from functools import reduce`).',
          '`reduce(fn, iterable[, initializer])` takes a **two-argument** function `fn(accumulator, current_item)` and applies it cumulatively from left to right, reducing the iterable to a single final value.',
          'Always consider whether a clearer built-in exists: use `sum()`, `min()`, `max()`, `any()`, `all()`, or `math.prod()` for standard reductions, and reserve `reduce()` for custom folding logic.',
        ],
        keyTerms: [
          {
            term: 'Accumulator',
            definition: 'The running result passed as the first argument to each step of reduce().',
          },
          {
            term: 'Initializer',
            definition: 'Optional 3rd argument to reduce() providing the starting accumulator value (also prevents TypeError on empty sequences).',
          },
        ],
        bulletPoints: [
          'Import via: from functools import reduce.',
          'Calling reduce(fn, []) without an initializer raises TypeError.',
          'Prefer sum() / math.prod() when applicable for readability.',
        ],
      },
      visualise: {
        type: 'map-filter-reduce-sim',
        title: 'functools.reduce() Accumulator Trace',
        badge: 'simulation',
        description: 'Step through left-to-right accumulator folding.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Product & Custom Dictionary Folding',
          runMode: 'real',
          code: `from functools import reduce

nums = [2, 3, 4, 5]
product = reduce(lambda acc, x: acc * x, nums)
print("Product:", product)

empty_safe = reduce(lambda acc, x: acc + x, [], 0)
print("Empty safe:", empty_safe)`,
          expectedOutput: `Product: 120
Empty safe: 0`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'reduce(lambda acc, x: acc * x, nums)',
          internalEffect: 'Computes ((2 * 3) * 4) * 5 = 120.',
        },
        {
          step: 2,
          codeLine: 7,
          instruction: 'reduce(lambda acc, x: acc + x, [], 0)',
          internalEffect: 'Returns initializer 0 immediately without raising TypeError on the empty list.',
        },
      ],
      apply: {
        domain: 'Configuration Merging',
        contextTitle: 'Chaining Nested Dictionary Lookups',
        scenario: 'Traverse a path of keys through nested config dicts using reduce().',
        code: `from functools import reduce

cfg = {"db": {"pool": {"size": 16}}}
path = ["db", "pool", "size"]
val = reduce(lambda d, k: d[k], path, cfg)
print("Pool size:", val)`,
        outcome: `Pool size: 16`,
      },
      commonMistakes: [
        {
          label: 'Calling reduce() on an Empty Iterable Without an Initializer',
          erroneousCode: `from functools import reduce
print(reduce(lambda a, b: a + b, []))`,
          errorMessage: 'TypeError: reduce() of empty iterable with no initial value',
          explanation: 'When the iterable may be empty, always pass a 3rd initial value argument.',
          correctedCode: `from functools import reduce
print(reduce(lambda a, b: a + b, [], 0))`,
        },
      ],
      sourceNotes: 'Covers functools.reduce() from Asabeneh Day 14.',
      practise: [
        {
          id: 'd14-s4-ex1',
          title: 'Order the Lines: Safe reduce() With Initializer',
          type: 'order-the-lines',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Invoice Totalizer',
          prompt: 'Arrange the lines to import `reduce`, fold `amounts` with an initial value of `0`, and print the total.',
          jumbledLines: [
            { id: 'l1', code: 'from functools import reduce', indent: 0 },
            { id: 'l2', code: 'amounts = [15, 25, 10]', indent: 0 },
            { id: 'l3', code: 'total = reduce(lambda acc, x: acc + x, amounts, 0)', indent: 0 },
            { id: 'l4', code: 'print(total)', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: [
            'Import reduce from functools first.',
            'Define amounts before calling reduce.',
            'Print total last.',
          ],
        },
        {
          id: 'd14-s4-ex2',
          title: 'Explain Trace: reduce() Accumulator Steps',
          type: 'explain-the-trace',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Nested Config Lookup',
          prompt: 'Trace `reduce(lambda d, k: d[k], ["api", "timeout"], {"api": {"timeout": 30}})`. State the accumulator value at each step.',
          traceStepCode: `from functools import reduce
cfg = {"api": {"timeout": 30}}
res = reduce(lambda d, k: d[k], ["api", "timeout"], cfg)
print(res)`,
          traceQuestion: 'What is `d` and `k` on step 1 and step 2?',
          modelAnswer: 'Step 1 starts with initializer d=cfg and k="api", returning {"timeout": 30}. Step 2 receives d={"timeout": 30} and k="timeout", returning 30.',
          markingCriteria: [
            { id: 'mc-1', label: 'States step 1: d=cfg, k="api" -> {"timeout": 30}', points: 10 },
            { id: 'mc-2', label: 'States step 2: d={"timeout": 30}, k="timeout" -> 30', points: 10 },
          ],
          hints: [
            'The 3rd argument cfg is the initial accumulator d.',
            'Step 1 accesses cfg["api"].',
            'Step 2 accesses that dict’s ["timeout"].',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day14-sub5',
      number: 5,
      title: 'Lexical Closures & __closure__ Cell Variables',
      summary: 'Return inner functions that remember variables from their enclosing scope even after the outer function returns.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Functions With Memory: How Closures Work',
        paragraphs: [
          'A **closure** occurs when a nested (inner) function references a variable defined in its **enclosing** (outer) function, and the outer function returns that inner function.',
          'Even though the outer function’s stack frame is popped when it returns, Python preserves the referenced enclosing variables inside **cell objects** attached to `inner.__closure__`.',
          'Each call to the outer factory function creates a brand-new closure with its own independent cell variables—making closures ideal for lightweight function factories like `make_multiplier(n)` or `make_validator(min_val)`.',
        ],
        keyTerms: [
          {
            term: 'Lexical Closure',
            definition: 'An inner function object paired with the retained enclosing variables it references.',
          },
          {
            term: 'Cell Variable (__closure__)',
            definition: 'A wrapper object holding a captured variable’s value across calls after the outer function returns.',
          },
        ],
        bulletPoints: [
          'Three conditions for a closure: nested function, references enclosing var, outer returns inner.',
          'Each factory call creates isolated closure state.',
          'Inspect captured values with fn.__closure__[0].cell_contents.',
        ],
      },
      visualise: {
        type: 'closure-scope-sim',
        title: 'Lexical Closure & __closure__ Inspector',
        badge: 'simulation',
        description: 'Call independent closure instances and watch their isolated cell variables update.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Function Factory Creating Independent Closures',
          runMode: 'real',
          code: `def make_multiplier(factor):
    def multiply(n):
        return n * factor
    return multiply

times3 = make_multiplier(3)
times5 = make_multiplier(5)

print("times3(10):", times3(10))
print("times5(10):", times5(10))
print("Captured factor:", times3.__closure__[0].cell_contents)`,
          expectedOutput: `times3(10): 30
times5(10): 50
Captured factor: 3`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 6,
          instruction: 'times3 = make_multiplier(3)',
          internalEffect: 'Creates a closure cell holding factor=3 and returns multiply.',
        },
        {
          step: 2,
          codeLine: 9,
          instruction: 'times3(10)',
          internalEffect: 'Reads factor=3 from its __closure__ cell and computes 10 * 3 = 30.',
        },
      ],
      apply: {
        domain: 'API Rate & Threshold Validation',
        contextTitle: 'Generating Configurable Threshold Checkers',
        scenario: 'Create reusable range-check predicates without repeating threshold constants.',
        code: `def min_threshold(limit):
    def check(val):
        return val >= limit
    return check

is_adult = min_threshold(18)
print("16:", is_adult(16), "| 21:", is_adult(21))`,
        outcome: `16: False | 21: True`,
      },
      commonMistakes: [
        {
          label: 'Returning inner() Instead of inner',
          erroneousCode: `def make_greeter(prefix):
    def greet(name):
        return f"{prefix} {name}"
    return greet()  # Missing argument & returns str, not function!`,
          errorMessage: "TypeError: greet() missing 1 required positional argument: 'name'",
          explanation: 'A closure factory must return the inner function object without parentheses (return greet), not call it.',
          correctedCode: `def make_greeter(prefix):
    def greet(name):
        return f"{prefix} {name}"
    return greet

hi = make_greeter("Hi")
print(hi("Ada"))`,
        },
      ],
      sourceNotes: 'Covers closures from Asabeneh Day 14.',
      practise: [
        {
          id: 'd14-s5-ex1',
          title: 'Write Code: Configurable Multiplier Factory',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'Currency Scaling Factory',
          prompt: 'Write `make_scaler(factor)` returning an inner closure `scale(x)` that returns `x * factor`. Create `to_cents = make_scaler(100)` and print `to_cents(4.5)`.',
          starterCode: `def make_scaler(factor):
    # Return a closure that multiplies by factor
    pass

to_cents = make_scaler(100)
print(to_cents(4.5))`,
          solutionCode: `def make_scaler(factor):
    def scale(x):
        return x * factor
    return scale

to_cents = make_scaler(100)
print(to_cents(4.5))`,
          testCases: [
            { id: 'tc-1', label: 'Prints 450.0', setup: '', expected: '450.0', hidden: false },
          ],
          hints: [
            'Define def scale(x): inside make_scaler.',
            'Return x * factor inside scale.',
            'Return scale (without parentheses) from make_scaler.',
          ],
        },
        {
          id: 'd14-s5-ex2',
          title: 'Predict Output: Independent Closure Cells',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Two Validator Instances',
          prompt: 'What does `f1 = make_adder(10); f2 = make_adder(20); print(f1(5), f2(5))` output if `make_adder(n)` returns `lambda x: x + n`?',
          options: [
            { id: 'opt-1', text: '15 25', explanation: 'Correct! Each call to make_adder creates an isolated closure cell for n.', isCorrect: true },
            { id: 'opt-2', text: '25 25', explanation: 'Incorrect. f2 does not overwrite f1’s cell.', isCorrect: false },
            { id: 'opt-3', text: '15 15', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'NameError', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Does f2 share state with f1?',
            'f1 captures n=10; f2 captures n=20.',
            'Compute 5+10 and 5+20.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day14-sub6',
      number: 6,
      title: 'Stateful Closures with nonlocal & Late-Binding Trap',
      summary: 'Use nonlocal to rebind enclosing variables inside closures, and avoid the classic loop late-binding pitfall.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Mutating Enclosing State & Avoiding Late-Binding Bugs',
        paragraphs: [
          'Reading an enclosing variable inside a closure works automatically, but **reassigning** it (e.g., `count += 1`) tells Python to treat `count` as a brand-new local variable—causing `UnboundLocalError: cannot access local variable "count" where it is not associated with a value`.',
          'To rebind an enclosing variable inside a nested function, declare `nonlocal count` at the top of the inner function. (`global` skips enclosing scopes and goes to module level; `nonlocal` targets the nearest enclosing function scope.)',
          'Also watch out for the **late-binding closure trap** in loops: `[lambda: i for i in range(3)]` creates 3 lambdas that all share the *same* cell `i`, so calling any of them after the loop returns `2`. Fix it by capturing the current value via a default parameter: `[lambda i=i: i for i in range(3)]`.',
        ],
        keyTerms: [
          {
            term: 'nonlocal',
            definition: 'Declaration allowing an inner function to rebind a variable in its nearest enclosing function scope.',
          },
          {
            term: 'Late Binding',
            definition: 'Closures look up the value of a captured variable at call time, not at definition time.',
          },
        ],
        bulletPoints: [
          'Always declare nonlocal var before var += 1 inside a closure.',
          'Capture loop variables eagerly with default arguments: lambda x=i: x.',
        ],
      },
      visualise: {
        type: 'closure-scope-sim',
        title: 'nonlocal State Mutation Simulator',
        badge: 'simulation',
        description: 'Observe how nonlocal count += 1 updates the retained cell on each call.',
        initialConfig: {},
      },
      code: [
        {
          title: 'nonlocal Counter & Fixing Late-Binding Loops',
          runMode: 'real',
          code: `def make_counter(start=0):
    count = start
    def step():
        nonlocal count
        count += 1
        return count
    return step

c = make_counter(10)
print("Calls:", c(), c())

funcs = [lambda i=i: i for i in range(3)]
print("Eagerly bound:", [f() for f in funcs])`,
          expectedOutput: `Calls: 11 12
Eagerly bound: [0, 1, 2]`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'nonlocal count',
          internalEffect: 'Tells Python that count += 1 mutates make_counter’s cell rather than creating a local variable.',
        },
        {
          step: 2,
          codeLine: 12,
          instruction: 'lambda i=i: i',
          internalEffect: 'Default argument i=i is evaluated at each loop iteration, freezing 0, 1, 2 per lambda.',
        },
      ],
      apply: {
        domain: 'Request Tracking',
        contextTitle: 'Per-Service Sequence ID Generator',
        scenario: 'Generate sequential request IDs without polluting module globals.',
        code: `def id_generator(prefix):
    seq = 0
    def next_id():
        nonlocal seq
        seq += 1
        return f"{prefix}-{seq}"
    return next_id

gen = id_generator("REQ")
print(gen(), gen())`,
        outcome: `REQ-1 REQ-2`,
      },
      commonMistakes: [
        {
          label: 'Reassigning an Enclosing Variable Without nonlocal',
          erroneousCode: `def counter():
    n = 0
    def inc():
        n += 1
        return n
    return inc

c = counter()
print(c())`,
          errorMessage: "UnboundLocalError: cannot access local variable 'n' where it is not associated with a value",
          explanation: 'n += 1 is an assignment, making n local to inc(). Add nonlocal n at the top of inc().',
          correctedCode: `def counter():
    n = 0
    def inc():
        nonlocal n
        n += 1
        return n
    return inc

c = counter()
print(c())`,
        },
      ],
      sourceNotes: 'Expands closures with nonlocal and late-binding safety.',
      practise: [
        {
          id: 'd14-s6-ex1',
          title: 'Fix the Bug: UnboundLocalError in Closure Counter',
          type: 'fix-the-bug',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Rate-Limit Hit Counter',
          prompt: 'Fix `make_hits()` so `hits += 1` updates the enclosing `hits` variable instead of raising `UnboundLocalError`.',
          starterCode: `def make_hits():
    hits = 0
    def record():
        hits += 1
        return hits
    return record

r = make_hits()
print(r(), r())`,
          solutionCode: `def make_hits():
    hits = 0
    def record():
        nonlocal hits
        hits += 1
        return hits
    return record

r = make_hits()
print(r(), r())`,
          testCases: [
            { id: 'tc-1', label: 'Increments 1 then 2', setup: '', expected: '1 2', hidden: false },
          ],
          hints: [
            'hits += 1 makes hits local to record() unless declared otherwise.',
            'Which keyword targets the nearest enclosing function scope?',
            'Add nonlocal hits inside record().',
          ],
        },
        {
          id: 'd14-s6-ex2',
          title: 'Theory: Late-Binding Loop Closure Trap',
          type: 'theory-reasoning',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Dynamic Button Callbacks',
          prompt: 'Why does `fns = [lambda: i for i in range(3)]; print([f() for f in fns])` print `[2, 2, 2]` instead of `[0, 1, 2]`, and how do you fix it?',
          modelAnswer: 'Closures bind variables by reference (late binding), not by value at definition time. All three lambdas share the same loop variable i, which equals 2 after the loop finishes. Fix it by capturing i eagerly via a default argument: [lambda i=i: i for i in range(3)].',
          markingCriteria: [
            { id: 'mc-1', label: 'Explains late binding: all lambdas reference the same i whose final value is 2', points: 10 },
            { id: 'mc-2', label: 'Provides default argument fix: lambda i=i: i', points: 10 },
          ],
          hints: [
            'When is i looked up: when the lambda is created or when f() is called?',
            'What is i’s value after range(3) finishes?',
            'Use a default parameter i=i to snapshot each iteration.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day14-sub7',
      number: 7,
      title: 'Decorators (@decorator Syntax & *args, **kwargs Wrappers)',
      summary: 'Wrap functions cleanly with @decorator syntactic sugar to add cross-cutting behavior without editing the original function.',
      estimatedMinutes: 12,
      introduce: {
        headline: 'Wrapping Behavior Without Editing Source: @decorator',
        paragraphs: [
          'A **decorator** is a higher-order function that takes a function `fn`, defines an inner `wrapper(*args, **kwargs)` function that adds behavior before and/or after calling `fn(*args, **kwargs)`, and returns `wrapper`.',
          'Python’s `@my_decorator` syntax above `def target():` is pure syntactic sugar for `target = my_decorator(target)` executed at **function definition time**.',
          'Always accept `*args, **kwargs` in `wrapper` and return `result = fn(*args, **kwargs)` so your decorator works on functions with any signature and never swallows the return value!',
        ],
        keyTerms: [
          {
            term: 'Decorator',
            definition: 'A callable that takes a function and returns a replacement (wrapped) function.',
          },
          {
            term: '@decorator Sugar',
            definition: 'Syntactic shorthand for fn = decorator(fn) evaluated immediately after def fn.',
          },
        ],
        bulletPoints: [
          'Accept (*args, **kwargs) inside wrapper so any target signature works.',
          'Always return the result of fn(*args, **kwargs) unless intentionally transforming it.',
          'Common uses: logging, timing, auth checks, caching, retries.',
        ],
      },
      visualise: {
        type: 'decorator-wrapper-sim',
        title: '@decorator Execution Flow',
        badge: 'simulation',
        description: 'Trace how @decorator wraps a function call in pre- and post-call hooks.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Generic Audit Decorator With *args, **kwargs',
          runMode: 'real',
          code: `def audit(fn):
    def wrapper(*args, **kwargs):
        print("Calling:", fn.__name__)
        result = fn(*args, **kwargs)
        return result
    return wrapper

@audit
def add(a, b):
    return a + b

print("Result:", add(4, 6))`,
          expectedOutput: `Calling: add
Result: 10`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 8,
          instruction: '@audit above def add(a, b):',
          internalEffect: 'Runs add = audit(add), replacing add with wrapper.',
        },
        {
          step: 2,
          codeLine: 12,
          instruction: 'add(4, 6)',
          internalEffect: 'Calls wrapper(4, 6), logs "Calling: add", invokes original add(4, 6) -> 10, and returns 10.',
        },
      ],
      apply: {
        domain: 'Backend Security',
        contextTitle: 'Uppercase Output Normalizer Decorator',
        scenario: 'Ensure a greeting endpoint always returns uppercase text.',
        code: `def force_upper(fn):
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs).upper()
    return wrapper

@force_upper
def greet(name):
    return f"hello, {name}"

print(greet("ada"))`,
        outcome: `HELLO, ADA`,
      },
      commonMistakes: [
        {
          label: 'Forgetting to Return the Wrapped Function’s Result',
          erroneousCode: `def log_call(fn):
    def wrapper(*args, **kwargs):
        print("Running", fn.__name__)
        fn(*args, **kwargs)  # Missing return!
    return wrapper

@log_call
def double(x):
    return x * 2

print(double(5))`,
          errorMessage: 'Logic bug: prints None instead of 10',
          explanation: 'If wrapper does not return fn(*args, **kwargs), the decorated function always returns None.',
          correctedCode: `def log_call(fn):
    def wrapper(*args, **kwargs):
        print("Running", fn.__name__)
        return fn(*args, **kwargs)
    return wrapper

@log_call
def double(x):
    return x * 2

print(double(5))`,
        },
      ],
      sourceNotes: 'Covers decorators from Asabeneh Day 14.',
      practise: [
        {
          id: 'd14-s7-ex1',
          title: 'Fix the Bug: Decorator Swallowing Return Value',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 15,
          contextScenario: 'Metrics Wrapper Bug',
          prompt: 'Fix `wrapper` so `compute(5)` returns `25` instead of `None`.',
          starterCode: `def trace(fn):
    def wrapper(*args, **kwargs):
        fn(*args, **kwargs)
    return wrapper

@trace
def compute(x):
    return x * x

print(compute(5))`,
          solutionCode: `def trace(fn):
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper

@trace
def compute(x):
    return x * x

print(compute(5))`,
          testCases: [
            { id: 'tc-1', label: 'Returns 25', setup: '', expected: '25', hidden: false },
          ],
          hints: [
            'Look at wrapper’s call to fn(*args, **kwargs).',
            'What does wrapper return right now?',
            'Add return before fn(*args, **kwargs).',
          ],
        },
        {
          id: 'd14-s7-ex2',
          title: 'Write Code: Uppercase Result Decorator',
          type: 'write-code',
          tier: 'project',
          points: 20,
          contextScenario: 'Response Formatting Middleware',
          prompt: 'Write a decorator `shout(fn)` whose `wrapper(*args, **kwargs)` calls `fn(*args, **kwargs)` and returns `.upper()` on its string result. Decorate `status()` returning `"healthy"` and print `status()`.',
          starterCode: `def shout(fn):
    # Define wrapper(*args, **kwargs) and return it
    pass

@shout
def status():
    return "healthy"

print(status())`,
          solutionCode: `def shout(fn):
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs).upper()
    return wrapper

@shout
def status():
    return "healthy"

print(status())`,
          testCases: [
            { id: 'tc-1', label: 'Prints HEALTHY', setup: '', expected: 'HEALTHY', hidden: false },
          ],
          hints: [
            'Define def wrapper(*args, **kwargs): inside shout.',
            'Return fn(*args, **kwargs).upper().',
            'Return wrapper from shout.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day14-sub8',
      number: 8,
      title: '@functools.wraps, Stacked & Parameterized Decorators',
      summary: 'Preserve __name__ and __doc__ with @functools.wraps, understand stacked decorator order, and build decorator factories.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Production-Grade Decorators: Metadata & Stacking',
        paragraphs: [
          'Without `@functools.wraps(fn)` on `wrapper`, decorating a function overwrites `target.__name__` with `"wrapper"` and erases `target.__doc__`—breaking debuggers, documentation tools, and frameworks like Flask/FastAPI.',
          'When you **stack** multiple decorators (`@outer` above `@inner` above `def f()`), Python applies them **bottom-up** at definition time (`f = outer(inner(f))`), so `outer`’s wrapper runs first at call time.',
          'To pass arguments to a decorator (e.g., `@repeat(3)`), add one extra outer factory layer: `repeat(n)` takes `n` and returns the actual decorator.',
        ],
        keyTerms: [
          {
            term: '@functools.wraps(fn)',
            definition: 'Decorator applied to wrapper that copies __name__, __doc__, and __annotations__ from fn.',
          },
          {
            term: 'Stacked Decorators',
            definition: 'Multiple @dec lines applied bottom-up at definition time and executed outside-in at call time.',
          },
        ],
        bulletPoints: [
          'Always decorate wrapper with @functools.wraps(fn).',
          '@A above @B above def f() equals f = A(B(f)).',
          'Parameterized decorator = 3 nested defs (factory -> decorator -> wrapper).',
        ],
      },
      visualise: {
        type: 'decorator-wrapper-sim',
        title: 'functools.wraps Metadata Preservation',
        badge: 'simulation',
        description: 'Toggle @functools.wraps(fn) to see how __name__ and __doc__ behave.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Preserving Metadata & Parameterized Decorator',
          runMode: 'real',
          code: `import functools

def repeat(times):
    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            return [fn(*args, **kwargs) for _ in range(times)]
        return wrapper
    return decorator

@repeat(3)
def ping():
    """Return pong."""
    return "pong"

print("Output:", ping())
print("Name:", ping.__name__, "| Doc:", ping.__doc__)`,
          expectedOutput: `Output: ['pong', 'pong', 'pong']
Name: ping | Doc: Return pong.`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 5,
          instruction: '@functools.wraps(fn)',
          internalEffect: 'Copies __name__="ping" and __doc__="Return pong." onto wrapper.',
        },
        {
          step: 2,
          codeLine: 11,
          instruction: '@repeat(3)',
          internalEffect: 'Calls repeat(3) to obtain decorator, then wraps ping with it.',
        },
      ],
      apply: {
        domain: 'API Middleware',
        contextTitle: 'Stacking Auth & Formatting Decorators',
        scenario: 'Apply two decorators and observe bottom-up wrapping order.',
        code: `import functools

def bracket(fn):
    @functools.wraps(fn)
    def w(*a, **kw):
        return f"[{fn(*a, **kw)}]"
    return w

def exclaim(fn):
    @functools.wraps(fn)
    def w(*a, **kw):
        return f"{fn(*a, **kw)}!"
    return w

@bracket
@exclaim
def msg():
    return "ok"

print(msg())`,
        outcome: `[ok!]`,
      },
      commonMistakes: [
        {
          label: 'Forgetting @functools.wraps(fn) in Reusable Decorators',
          erroneousCode: `def deco(fn):
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper

@deco
def my_task():
    """Run task."""
    return 1

print(my_task.__name__, my_task.__doc__)`,
          errorMessage: 'Metadata loss: prints "wrapper None" instead of "my_task Run task."',
          explanation: 'Without @functools.wraps(fn), wrapper replaces my_task’s __name__ and __doc__.',
          correctedCode: `import functools

def deco(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper

@deco
def my_task():
    """Run task."""
    return 1

print(my_task.__name__, my_task.__doc__)`,
        },
      ],
      sourceNotes: 'Covers functools.wraps, decorator stacking, and parameterized decorators for Day 14.',
      practise: [
        {
          id: 'd14-s8-ex1',
          title: 'Scenario: Why @functools.wraps(fn) Matters',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'FastAPI / Flask Route Registration',
          prompt: 'What happens if you decorate two route functions with a decorator that omits `@functools.wraps(fn)`?',
          options: [
            { id: 'opt-1', text: 'Both decorated functions appear to have __name__ == "wrapper" and lose their __doc__ strings.', explanation: 'Correct! @functools.wraps(fn) copies __name__, __doc__, and __annotations__ onto wrapper.', isCorrect: true },
            { id: 'opt-2', text: 'Python raises ImportError.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'The wrapped functions cannot accept *args.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'Decorators run twice at import time.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'What function object is actually returned by the decorator?',
            'What is wrapper.__name__ without @functools.wraps?',
            'Frameworks often inspect fn.__name__ and fn.__doc__.',
          ],
        },
        {
          id: 'd14-s8-ex2',
          title: 'Explain Trace: Stacked Decorator Order',
          type: 'explain-the-trace',
          tier: 'project',
          points: 20,
          contextScenario: 'Layered Output Formatting',
          prompt: 'Trace `@outer` stacked above `@inner` on `def msg(): return "hi"`. Which wrapper executes first when `msg()` is called, and what is printed?',
          traceStepCode: `import functools

def outer(fn):
    @functools.wraps(fn)
    def w(*a, **kw):
        return f"<{fn(*a, **kw)}>"
    return w

def inner(fn):
    @functools.wraps(fn)
    def w(*a, **kw):
        return f"[{fn(*a, **kw)}]"
    return w

@outer
@inner
def msg():
    return "hi"

print(msg())`,
          traceQuestion: 'In what order are `outer` and `inner` applied, and what does `msg()` return?',
          modelAnswer: 'At definition time, decorators apply bottom-up: msg = outer(inner(msg)). At call time, outer’s wrapper runs first, calls inner’s wrapper which returns "[hi]", and wraps it to return "<[hi]>".',
          markingCriteria: [
            { id: 'mc-1', label: 'Identifies bottom-up wrapping outer(inner(msg))', points: 10 },
            { id: 'mc-2', label: 'Derives exact output <[hi]>', points: 10 },
          ],
          hints: [
            'Rewrite @outer @inner def msg as nested calls.',
            'inner wraps msg first -> "[hi]".',
            'outer wraps that result -> "<[hi]>".',
          ],
        },
        {
          id: 'd14-s8-ex3',
          title: 'Write Code: Parameterized Prefix Decorator',
          type: 'write-code',
          tier: 'project',
          points: 20,
          contextScenario: 'Tagged Log Formatter',
          prompt: 'Write a parameterized decorator `tag(label)` using `@functools.wraps(fn)` that prepends `f"[{label}] "` to the string returned by the decorated function. Apply `@tag("API")` to `ping()` returning `"ok"` and print `ping()` and `ping.__name__`.',
          starterCode: `import functools

def tag(label):
    # 1. decorator(fn) -> 2. @functools.wraps(fn) wrapper(*args, **kwargs)
    pass

@tag("API")
def ping():
    return "ok"

print(ping(), ping.__name__)`,
          solutionCode: `import functools

def tag(label):
    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            return f"[{label}] {fn(*args, **kwargs)}"
        return wrapper
    return decorator

@tag("API")
def ping():
    return "ok"

print(ping(), ping.__name__)`,
          testCases: [
            { id: 'tc-1', label: 'Prints [API] ok ping', setup: '', expected: '[API] ok ping', hidden: false },
          ],
          hints: [
            'A parameterized decorator has 3 nested defs: tag -> decorator -> wrapper.',
            'Decorate wrapper with @functools.wraps(fn).',
            'Return f"[{label}] {fn(*args, **kwargs)}".',
          ],
        },
      ],
      assess: [],
    },
  ],
  realWorldLabs: [
    {
      id: 'day14-lab1',
      title: 'Lazy ETL Pipeline with map, filter & reduce',
      description: 'Chain filter(), map(), and functools.reduce() to keep valid positive readings, convert Celsius to Fahrenheit, and compute the total.',
      domain: 'Telemetry Data Engineering',
      starterCode: `from functools import reduce

readings_c = [-999, 0, 10, -5, 20]

# 1. Keep readings >= 0 with filter()
# 2. Convert to Fahrenheit (c * 9 / 5 + 32) with map()
# 3. Sum with reduce(..., 0)
valid = list(filter(lambda c: c >= 0, readings_c))
temps_f = list(map(lambda c: c * 9 / 5 + 32, valid))
total_f = reduce(lambda acc, t: acc + t, temps_f, 0)

print("Temps F:", temps_f)
print("Total F:", total_f)`,
      targetOutput: `Temps F: [32.0, 50.0, 68.0]
Total F: 150.0`,
    },
    {
      id: 'day14-lab2',
      title: 'Stateful Audit Decorator with Closure Counter',
      description: 'Combine @functools.wraps(fn) and nonlocal call counting inside a decorator to track how many times an endpoint is invoked.',
      domain: 'API Observability',
      starterCode: `import functools

def count_calls(fn):
    calls = 0
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        nonlocal calls
        calls += 1
        print(f"{fn.__name__} call #{calls}")
        return fn(*args, **kwargs)
    return wrapper

@count_calls
def fetch_user(uid):
    return f"user:{uid}"

print(fetch_user(101))
print(fetch_user(102))`,
      targetOutput: `fetch_user call #1
user:101
fetch_user call #2
user:102`,
    },
  ],
  miniProject: {
    id: 'day14-project',
    title: 'Composable Middleware & Functional Pipeline Engine',
    brief: 'Build a functional processing toolkit combining map/filter/reduce pipelines, a stateful nonlocal closure counter, and a @functools.wraps audit decorator.',
    requirements: [
      'Transform and filter a raw dataset using map() and filter()',
      'Aggregate the filtered values using functools.reduce() with an explicit initializer',
      'Build a stateful closure factory using nonlocal to track sequence numbers',
      'Implement a reusable @decorator accepting (*args, **kwargs) and returning the wrapped result',
      'Preserve target __name__ and __doc__ using @functools.wraps(fn)',
    ],
    rubric: [
      { criterion: 'map, filter, reduce pipeline accuracy', weight: 35 },
      { criterion: 'Closure isolation and nonlocal state handling', weight: 30 },
      { criterion: '@decorator wrapper & @functools.wraps metadata preservation', weight: 35 },
    ],
    starterCode: `import functools
from functools import reduce

# 1. Build @audit decorator with @functools.wraps(fn)
# 2. Build stateful closure id_gen(prefix) using nonlocal
# 3. Process scores via filter(), map(), and reduce()
`,
  },
  dayQuiz: {
    title: 'Day 14 Mastery Checkpoint Quiz: HOFs, Closures & Decorators',
    passingScorePercentage: 80,
    questions: [
      {
        id: 'd14-q1',
        scenario: 'First-Class Functions',
        question: 'How do you pass function `validate` as an argument to `run_check` without calling it first?',
        options: [
          { id: 'q1-a', text: 'run_check(validate)', explanation: 'Correct! Omitting () passes the function object itself.', isCorrect: true },
          { id: 'q1-b', text: 'run_check(validate())', explanation: 'Incorrect. Calling validate() passes its return value.', isCorrect: false },
          { id: 'q1-c', text: 'run_check("validate")', explanation: 'Incorrect. That passes a string.', isCorrect: false },
          { id: 'q1-d', text: 'run_check(&validate)', explanation: 'Incorrect. Invalid syntax in Python.', isCorrect: false },
        ],
      },
      {
        id: 'd14-q2',
        scenario: 'Lazy map() Behavior',
        question: 'What does `map(str.upper, ["a", "b"])` return in Python 3?',
        options: [
          { id: 'q2-a', text: 'A lazy map iterator object that yields values when iterated or wrapped in list().', explanation: 'Correct! map() is lazy in Python 3.', isCorrect: true },
          { id: 'q2-b', text: '["A", "B"] immediately.', explanation: 'Incorrect. That was Python 2 behavior.', isCorrect: false },
          { id: 'q2-c', text: '("A", "B")', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q2-d', text: 'None', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd14-q3',
        scenario: 'filter(None, seq)',
        question: 'What does `list(filter(None, [0, 1, "", "hi", False]))` return?',
        options: [
          { id: 'q3-a', text: "[1, 'hi']", explanation: 'Correct! filter(None, seq) removes all falsy items.', isCorrect: true },
          { id: 'q3-b', text: '[0, "", False]', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q3-c', text: '[0, 1, "", "hi", False]', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q3-d', text: 'TypeError', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd14-q4',
        scenario: 'functools.reduce()',
        question: 'Where is `reduce()` located in Python 3 and what happens if called on `[]` without an initializer?',
        options: [
          { id: 'q4-a', text: 'In module functools; calling reduce(fn, []) without an initializer raises TypeError.', explanation: 'Correct! Always import from functools and provide an initializer when input may be empty.', isCorrect: true },
          { id: 'q4-b', text: 'It is a built-in; returns None on [].', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q4-c', text: 'In module math; returns 0 on [].', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q4-d', text: 'In module itertools; returns [].', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd14-q5',
        scenario: 'Lexical Closures',
        question: 'Where does Python store variables captured by a nested closure after the outer function returns?',
        options: [
          { id: 'q5-a', text: 'In cell objects inside inner.__closure__.', explanation: 'Correct! Enclosing variables remain alive in __closure__ cells.', isCorrect: true },
          { id: 'q5-b', text: 'In sys.modules.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q5-c', text: 'In os.environ.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q5-d', text: 'They are garbage collected immediately.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd14-q6',
        scenario: 'nonlocal Keyword',
        question: 'Why is `nonlocal count` needed when an inner closure executes `count += 1`?',
        options: [
          { id: 'q6-a', text: 'Without nonlocal, count += 1 treats count as a new unassigned local variable and raises UnboundLocalError.', explanation: 'Correct! nonlocal allows rebinding the enclosing function’s variable.', isCorrect: true },
          { id: 'q6-b', text: 'Without nonlocal, count becomes a global constant.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q6-c', text: 'nonlocal makes count read-only.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q6-d', text: 'nonlocal is only for classes.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd14-q7',
        scenario: 'Late-Binding Loop Trap',
        question: 'How do you fix `[lambda: i for i in range(3)]` so the 3 functions return 0, 1, and 2?',
        options: [
          { id: 'q7-a', text: '[lambda i=i: i for i in range(3)]', explanation: 'Correct! Default arguments are evaluated at definition time, capturing each iteration’s value.', isCorrect: true },
          { id: 'q7-b', text: '[lambda: nonlocal i for i in range(3)]', explanation: 'Incorrect. Statements are illegal in lambda.', isCorrect: false },
          { id: 'q7-c', text: '[lambda: return i for i in range(3)]', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q7-d', text: 'Wrap range(3) in list().', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd14-q8',
        scenario: '@decorator Desugaring',
        question: 'What is `@audit` placed directly above `def process():` equivalent to?',
        options: [
          { id: 'q8-a', text: 'process = audit(process)', explanation: 'Correct! The decorator is called at definition time with process and replaces it with the returned wrapper.', isCorrect: true },
          { id: 'q8-b', text: 'audit = process(audit)', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q8-c', text: 'audit() is only called when process() raises an error.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q8-d', text: 'It creates a subclass of process.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd14-q9',
        scenario: '@functools.wraps(fn)',
        question: 'What does `@functools.wraps(fn)` do on a decorator’s `wrapper` function?',
        options: [
          { id: 'q9-a', text: 'Copies __name__, __doc__, and __annotations__ from fn onto wrapper.', explanation: 'Correct! It preserves the original function’s metadata for debugging and frameworks.', isCorrect: true },
          { id: 'q9-b', text: 'Caches the return values of fn.', explanation: 'Incorrect. That is @functools.lru_cache.', isCorrect: false },
          { id: 'q9-c', text: 'Forces fn to return a tuple.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q9-d', text: 'Removes *args and **kwargs.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd14-q10',
        scenario: 'Stacked Decorators',
        question: 'When `@A` is placed above `@B` above `def f():`, how are they applied at definition time?',
        options: [
          { id: 'q10-a', text: 'Bottom-up: f = A(B(f))', explanation: 'Correct! B wraps f first, then A wraps the result of B(f).', isCorrect: true },
          { id: 'q10-b', text: 'Top-down: f = B(A(f))', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q10-c', text: 'Only @A is applied.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q10-d', text: 'Python raises SyntaxError for multiple decorators.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
    ],
  },
  cheatSheet: [
    {
      category: 'First-Class & Higher-Order Functions',
      syntax: 'def apply(fn, val):\n    return fn(val)\napply(square, 5)  # omit ()',
      description: 'Functions are objects: store them in variables/dicts, pass them without () to higher-order functions, or return them from factory functions.',
      example: `def double(x):
    return x * 2

def apply_twice(fn, v):
    return fn(fn(v))

print(apply_twice(double, 3))  # 12`,
    },
    {
      category: 'Lazy Transformation with map(fn, iterable)',
      syntax: 'list(map(fn, seq))\nlist(map(lambda a, b: a + b, xs, ys))',
      description: 'map() applies fn lazily 1-to-1 and returns a single-pass iterator. Multi-iterable map() stops at the shortest iterable. Materialize with list() when reuse or indexing is needed.',
      example: `nums = [1, 2, 3]
doubled = list(map(lambda x: x * 2, nums))
print(doubled)  # [2, 4, 6]`,
    },
    {
      category: 'Predicate Filtering with filter(pred, iterable)',
      syntax: 'list(filter(pred, seq))\nlist(filter(None, seq))',
      description: 'filter() yields only elements where pred(x) is truthy. Passing None as pred strips all falsy values (0, "", None, False, []).',
      example: `mixed = ["ok", "", None, 0, "ready"]
print(list(filter(None, mixed)))  # ['ok', 'ready']`,
    },
    {
      category: 'Cumulative Folding with functools.reduce()',
      syntax: 'from functools import reduce\nreduce(lambda acc, x: acc + x, seq, 0)',
      description: 'Folds a sequence left-to-right into one value. Always pass a 3rd initializer argument when the input may be empty to avoid TypeError. Prefer sum() for simple addition.',
      example: `from functools import reduce

prod = reduce(lambda a, b: a * b, [2, 3, 4], 1)
print(prod)  # 24`,
    },
    {
      category: 'Lexical Closures & __closure__ Cell Variables',
      syntax: 'def outer(x):\n    def inner(y): return x + y\n    return inner',
      description: 'An inner function retains access to enclosing variables via cell objects in __closure__ even after the outer function returns. Each factory call creates isolated closure state.',
      example: `def make_mul(k):
    return lambda x: x * k

times3 = make_mul(3)
print(times3(10))  # 30`,
    },
    {
      category: 'Stateful Closures (nonlocal) & Late-Binding Trap',
      syntax: 'nonlocal count\ncount += 1\n[lambda i=i: i for i in range(3)]',
      description: 'Declare nonlocal var before rebinding an enclosing variable inside a closure (otherwise var += 1 raises UnboundLocalError). Capture loop variables eagerly with default args (i=i).',
      example: `def counter():
    n = 0
    def step():
        nonlocal n
        n += 1
        return n
    return step`,
    },
    {
      category: '@decorator Syntax & *args, **kwargs Wrappers',
      syntax: 'def dec(fn):\n    def wrapper(*args, **kwargs):\n        return fn(*args, **kwargs)\n    return wrapper',
      description: '@dec above def f() is syntactic sugar for f = dec(f) at definition time. Accept (*args, **kwargs) and return the result of fn(*args, **kwargs).',
      example: `def audit(fn):
    def wrapper(*args, **kwargs):
        print("Call:", fn.__name__)
        return fn(*args, **kwargs)
    return wrapper`,
    },
    {
      category: '@functools.wraps, Stacked & Parameterized Decorators',
      syntax: '@functools.wraps(fn)\n@outer\n@inner  # -> outer(inner(f))',
      description: 'Always decorate wrapper with @functools.wraps(fn) to preserve __name__ and __doc__. Stacked decorators wrap bottom-up. Parameterized decorators add a 3rd outer factory def.',
      example: `import functools

def deco(fn):
    @functools.wraps(fn)
    def w(*a, **kw):
        return fn(*a, **kw)
    return w`,
    },
  ],
  sourceNotes: [
    'Primary curriculum reference: Asabeneh Yetayeh, 30 Days of Python — Day 14: Higher Order Functions (https://github.com/Asabeneh/30-Days-Of-Python/tree/master/14_Day_Higher_order_functions).',
    'Enhanced with lazy iterator exhaustion, __closure__ cell mechanics, nonlocal & late-binding traps, and @functools.wraps.',
  ],
};
