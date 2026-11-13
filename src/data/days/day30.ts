/**
 * Day 30: Conclusions, Revision and Final Projects (Advanced Python)
 * Part A (Learn) conforming to Sections 10, 13.2, and 14 of the Master Specification.
 * Includes:
 *  - 8 Detailed Subtopics following the 10-step pedagogical structure
 *  - 3 Signature Simulations: curriculum-revision-radar-sim, capstone-architecture-sim, future-horizons-roadmap-sim
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_30_MODULE: DayModule = {
  schemaVersion: 1,
  number: 30,
  title: 'Conclusions, Revision and Final Projects',
  level: 'advanced',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/30_Day_Conclusions',
  estimatedMinutes: 120,
  prerequisites: [1, 5, 8, 11, 21, 25, 29],
  objectives: [
    'Synthesize core Python foundations: object binding, mutability, collections, and control flow',
    'Unify functional Python tools: comprehensions, generators, closures, decorators, and higher-order pipelines',
    'Architect clean Object-Oriented modules favoring composition, clear invariants, and dataclasses',
    'Manage files, regex patterns, isolated virtual environments, and installable package layouts',
    'Write automated unit tests, edge-case assertions, and deterministic error guards before shipping',
    'Integrate web scraping, Flask routes, MongoDB persistence, and resilient REST APIs end-to-end',
    'Plan, structure, document, and deliver a portfolio-grade Python capstone project',
    'Chart post-Day-30 growth horizons across static typing, asyncio, FastAPI, Data/ML, and DevOps',
  ],
  subtopics: [
    {
      id: 'day30-sub1',
      number: 1,
      title: 'Foundations Synthesis: Types, Collections & Reference Semantics',
      summary: 'Review object identity vs equality, shallow vs deep copying, and choosing the right collection.',
      estimatedMinutes: 14,
      introduce: {
        headline: 'Mastering Python’s Core Data & Memory Mental Model',
        paragraphs: [
          'Everything in Python is an object accessed through name bindings. Understanding **mutability** (`list`, `dict`, `set`) versus **immutability** (`int`, `str`, `tuple`, `frozenset`) prevents the most common bugs in production Python—accidental aliasing (`b = a`), mutable default arguments (`def f(x=[])`), and `KeyError` crashes.',
          'Choosing the right collection in `O(1)` vs `O(n)` matters at scale: use **`set`** or **`dict`** for membership checks (`x in seen`), **`tuple`** for fixed heterogeneous records, and **`list`** for ordered sequences.',
        ],
        keyTerms: [
          {
            term: 'Aliasing vs Copying',
            definition: 'Assignment (`b = a`) binds two names to the same object; `.copy()` or `copy.deepcopy()` allocates an independent copy.',
          },
          {
            term: 'O(1) Hash Lookup',
            definition: 'Sets and dict keys locate items in constant average time, avoiding slow O(n) linear list scans.',
          },
        ],
        bulletPoints: [
          'Always write `def add_tag(tag, tags=None):` instead of `tags=[]`.',
          'Use `dict.get(key, default)` or `collections.Counter` when aggregating unknown keys.',
        ],
      },
      visualise: {
        type: 'curriculum-revision-radar-sim',
        title: '30-Day Curriculum Revision & Weak-Spot Diagnostic',
        badge: 'simulation',
        description: 'Inspect mental models and high-frequency pitfalls across Days 1–10 foundations.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Defensive Copy & Safe Default Aggregation',
          runMode: 'real',
          code: `def append_safe(item, target=None):
    if target is None:
        target = []
    else:
        target = target.copy()
    target.append(item)
    return target

base = ["py"]
res1 = append_safe("api", base)
res2 = append_safe("ml")
print("Base untouched:", base, "| res1:", res1, "| res2:", res2)`,
          expectedOutput: "Base untouched: ['py'] | res1: ['py', 'api'] | res2: ['ml']",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'if target is None: target = [] else: target = target.copy()',
          internalEffect: 'Avoids sharing one default list across calls and shields the caller list from mutation.',
        },
      ],
      apply: {
        domain: 'Deduplication',
        contextTitle: 'Preserving Order While Deduplicating with a Set',
        scenario: 'Filter duplicate user IDs in O(n) time instead of O(n^2) list scanning.',
        code: `ids = ["u2", "u1", "u2", "u3", "u1"]
seen, unique = set(), []
for uid in ids:
    if uid not in seen:
        seen.add(uid)
        unique.append(uid)
print(unique)`,
        outcome: "['u2', 'u1', 'u3']",
      },
      commonMistakes: [
        {
          label: 'Mutable Default Arguments Shared Across Calls',
          erroneousCode: `def add_item(x, bucket=[]):\n    bucket.append(x)\n    return bucket`,
          errorMessage: 'Subsequent calls inherit items from previous calls unexpectedly',
          explanation: 'Default argument objects are evaluated once at `def` time. Use `bucket=None` and initialize `bucket = []` inside the function.',
          correctedCode: `def add_item(x, bucket=None):\n    bucket = [] if bucket is None else list(bucket)\n    bucket.append(x)\n    return bucket`,
        },
      ],
      sourceNotes: 'Synthesizes Days 1–10 core Python foundations.',
      practise: [
        {
          id: 'day30-ex1',
          title: 'Mutable Default Argument Bug',
          type: 'fix-the-bug',
          tier: 'foundation',
          prompt: 'This `record_tag(tag, tags=[])` helper leaks tags across independent calls because of a mutable default list. Fix it so omitting `tags` starts with a fresh list every time.',
          starterCode: `def record_tag(tag, tags=[]):
    tags.append(tag)
    return tags
`,
          solutionCode: `def record_tag(tag, tags=None):
    if tags is None:
        tags = []
    tags.append(tag)
    return tags
`,
          testCases: [
            { id: 'tc1', label: 'Independent calls do not share list', setup: 'print(record_tag("a"), record_tag("b"))', expected: "['a'] ['b']", hidden: false },
            { id: 'tc2', label: 'Appends to explicit list', setup: 'lst = ["x"]\nprint(record_tag("y", lst))', expected: "['x', 'y']", hidden: true },
          ],
          hints: ['Change default parameter from `tags=[]` to `tags=None`.', 'Check `if tags is None: tags = []` inside the function.', 'Append tag and return tags.'],
          points: 10,
        },
        {
          id: 'day30-ex2',
          title: 'Predict List Aliasing vs Copy Behavior',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'What does this Python snippet print when `b = a` and `c = a.copy()`?',
          contextScenario: 'a = [1, 2]\nb = a\nc = a.copy()\nb.append(3)\nprint(len(a), len(c))',
          options: [
            { id: 'a', text: '3 2', explanation: 'Correct! b aliases a so appending to b mutates a (len 3), while c is a shallow copy (len 2).', isCorrect: true },
            { id: 'b', text: '2 2', explanation: 'Incorrect. b and a point to the exact same list object.', isCorrect: false },
            { id: 'c', text: '3 3', explanation: 'Incorrect. c is an independent list allocated by .copy().', isCorrect: false },
            { id: 'd', text: '2 3', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: ['b = a creates an alias, not a copy.', 'c = a.copy() allocates a new list.', 'Mutating b changes a, not c.'],
          points: 10,
        },
        {
          id: 'day30-ex3',
          title: 'Choosing Set vs List for Membership Lookups',
          type: 'scenario-mcq',
          tier: 'standard',
          prompt: 'A fraud-detection service checks whether each of 100,000 incoming user IDs appears in a blocklist of 50,000 banned IDs. Why does storing the blocklist as a `set` outperform a `list` by orders of magnitude?',
          options: [
            { id: 'a', text: 'set membership (`x in blocked`) uses O(1) hash table lookups, whereas list membership scans up to O(N) elements per check.', explanation: 'Correct! Hashing drops total complexity from O(M * N) to O(M).', isCorrect: true },
            { id: 'b', text: 'Sets compress strings using gzip in RAM.', explanation: 'Incorrect. Sets use hash tables, not compression.', isCorrect: false },
            { id: 'c', text: 'Lists cannot store more than 10,000 strings.', explanation: 'Incorrect. Lists can hold millions of items, just with O(N) lookup.', isCorrect: false },
            { id: 'd', text: 'Sets automatically run on GPU cores.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: ['Compare linear search vs hash table lookup.', 'O(N) vs O(1) per lookup.', '100,000 * 50,000 = 5 billion steps for a list!'],
          points: 10,
        },
        {
          id: 'day30-ex4',
          title: 'Order-Preserving Deduplication',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Write `dedupe_preserve_order(items)` returning a new list with duplicates removed while preserving the original first-seen order.',
          starterCode: `def dedupe_preserve_order(items):
    pass
`,
          solutionCode: `def dedupe_preserve_order(items):
    seen = set()
    out = []
    for item in items:
        if item not in seen:
            seen.add(item)
            out.append(item)
    return out
`,
          testCases: [
            { id: 'tc1', label: 'Preserves first occurrence order', setup: 'print(dedupe_preserve_order(["b", "a", "b", "c", "a"]))', expected: "['b', 'a', 'c']", hidden: false },
            { id: 'tc2', label: 'Handles empty list', setup: 'print(dedupe_preserve_order([]))', expected: '[]', hidden: true },
          ],
          hints: ['Track seen items in a `set()`.', 'Append to `out` only if `item not in seen`.', 'Add `item` to `seen` at the same time.'],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day30-sub2',
      number: 2,
      title: 'Functional Synthesis: Comprehensions, Generators & Decorators',
      summary: 'Combine readable comprehensions, lazy generator pipelines, and @functools.wraps decorators.',
      estimatedMinutes: 14,
      introduce: {
        headline: 'Writing Expressive, Memory-Light Python Pipelines',
        paragraphs: [
          'Python’s functional tools shine when composing data transformations: **list/dict comprehensions** replace verbose `append` loops, while **generator expressions** (`(x for x in stream)`) and **`yield`** process large datasets lazily without materializing huge intermediate lists in RAM.',
          'At the architecture level, **closures** and **decorators** attach cross-cutting behavior (logging, timing, retry, auth checks) cleanly around functions—provided you always include `@functools.wraps(fn)` so metadata stays intact.',
        ],
        keyTerms: [
          {
            term: 'Lazy Generator',
            definition: 'An iterator producing one value at a time on demand via yield, keeping memory O(1).',
          },
          {
            term: 'functools.wraps',
            definition: 'Decorator helper copying __name__, __doc__, and __wrapped__ onto the wrapper function.',
          },
        ],
        bulletPoints: [
          'Readability rule: if a comprehension needs more than two `for`/`if` clauses, split it into helper steps.',
          'A generator iterator exhausts after one pass—convert to `list` only when random indexing or reuse is needed.',
        ],
      },
      visualise: {
        type: 'curriculum-revision-radar-sim',
        title: '30-Day Curriculum Revision & Weak-Spot Diagnostic',
        badge: 'simulation',
        description: 'Review functional Python pitfalls across Days 11–14.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Decorator with wraps + Lazy Generator Pipeline',
          runMode: 'real',
          code: `from functools import wraps

def audit_call(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper

@audit_call
def top_scores(rows, threshold=80):
    return sorted(r["score"] for r in rows if r["score"] >= threshold)

data = [{"score": 72}, {"score": 95}, {"score": 84}]
print(top_scores.__name__, top_scores(data))`,
          expectedOutput: 'top_scores [84, 95]',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: '@wraps(fn)',
          internalEffect: 'Preserves top_scores.__name__ as "top_scores" instead of "wrapper".',
        },
        {
          step: 2,
          codeLine: 11,
          instruction: 'sorted(r["score"] for r in rows if r["score"] >= threshold)',
          internalEffect: 'Feeds a memory-efficient generator directly into sorted().',
        },
      ],
      apply: {
        domain: 'Streaming ETL',
        contextTitle: 'Single-Pass Generator Sum',
        scenario: 'Compute total bytes from filtered log lines without storing intermediate lists.',
        code: `lines = ["200 120", "404 40", "200 380"]
total_200 = sum(int(line.split()[1]) for line in lines if line.startswith("200"))
print("200 bytes:", total_200)`,
        outcome: '200 bytes: 500',
      },
      commonMistakes: [
        {
          label: 'Re-Iterating an Already Exhausted Generator',
          erroneousCode: `gen = (x * 2 for x in [1, 2, 3])\nprint(sum(gen), list(gen))  # Second pass prints []!`,
          errorMessage: 'Second consumption silently yields zero items',
          explanation: 'Generators are single-use iterators. Materialize into a tuple/list first if you need multiple passes.',
          correctedCode: `vals = [x * 2 for x in [1, 2, 3]]\nprint(sum(vals), vals)`,
        },
      ],
      sourceNotes: 'Synthesizes Days 11–14 functional Python & decorators.',
      practise: [
        {
          id: 'day30-ex5',
          title: 'Preserving Function Metadata in Decorators',
          type: 'fill-the-gaps',
          tier: 'foundation',
          prompt: 'Complete the decorator definition so wrapped functions retain their original `__name__` and docstring.',
          gaps: [
            { id: 'g1', beforeText: 'from functools import ', afterText: ' def my_dec(fn):', correctAnswer: 'wraps', options: ['wraps', 'partial', 'lru_cache'] },
            { id: 'g2', beforeText: '    @', afterText: '(fn) def wrapper(*args, **kwargs):', correctAnswer: 'wraps', options: ['wraps', 'staticmethod', 'property'] },
          ],
          hints: ['Import wraps from functools.', 'Decorate wrapper with @wraps(fn).', 'Protects __name__ and __doc__.'],
          points: 10,
        },
        {
          id: 'day30-ex6',
          title: 'Single-Use Exhausted Generator Trap',
          type: 'predict-output',
          tier: 'standard',
          prompt: 'What does this code print when iterating a generator expression twice?',
          contextScenario: 'nums = (n * 10 for n in [1, 2, 3])\nfirst = sum(nums)\nsecond = list(nums)\nprint(first, second)',
          options: [
            { id: 'a', text: '60 []', explanation: 'Correct! sum(nums) exhausts the generator iterator, leaving second pass empty [].', isCorrect: true },
            { id: 'b', text: '60 [10, 20, 30]', explanation: 'Incorrect. Generators do not rewind after exhaustion.', isCorrect: false },
            { id: 'c', text: 'StopIteration', explanation: 'Incorrect. list() catches StopIteration cleanly and returns [].', isCorrect: false },
            { id: 'd', text: '0 []', explanation: 'Incorrect. The first pass sums 10 + 20 + 30 = 60.', isCorrect: false },
          ],
          hints: ['Parentheses create a generator expression.', 'sum(nums) consumes all yielded values.', 'A second list(nums) finds an exhausted iterator.'],
          points: 10,
        },
        {
          id: 'day30-ex7',
          title: 'Write a Timing/Audit Wrapper with wraps',
          type: 'write-code',
          tier: 'challenge',
          prompt: 'Write a decorator `uppercase_result(fn)` using `@wraps(fn)` that calls `fn(*args, **kwargs)` and returns `.upper()` on its string result.',
          starterCode: `from functools import wraps

def uppercase_result(fn):
    pass
`,
          solutionCode: `from functools import wraps

def uppercase_result(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs).upper()
    return wrapper
`,
          testCases: [
            { id: 'tc1', label: 'Uppercases output and preserves __name__', setup: '@uppercase_result\ndef greet(n): return f"hi {n}"\nprint(greet.__name__, greet("ada"))', expected: 'greet HI ADA', hidden: false },
          ],
          hints: ['Define `wrapper(*args, **kwargs)` decorated with `@wraps(fn)`.', 'Return `fn(*args, **kwargs).upper()`.', 'Return `wrapper`.'],
          points: 15,
        },
        {
          id: 'day30-ex8',
          title: 'Generator Memory vs List Materialization',
          type: 'theory-reasoning',
          tier: 'standard',
          prompt: 'Why is `(line for line in open("big.log") if "ERROR" in line)` far safer for a 5 GB log file than `[line for line in open("big.log") if "ERROR" in line]`?',
          modelAnswer: 'A list comprehension loads every matching line into RAM all at once, risking an Out-Of-Memory crash on a multi-gigabyte file. A generator expression streams one line at a time lazily in O(1) memory.',
          markingCriteria: [
            { id: 'mc1', label: 'Explains list comprehension buffers matching lines in RAM', points: 5 },
            { id: 'mc2', label: 'Explains generator streams one item at a time lazily', points: 5 },
          ],
          hints: ['Compare [] vs ().', 'Think about peak RAM usage on a 5 GB log.', 'Lazy iteration yields one element per step.'],
          points: 10,
        },
      ],
      assess: [],
    },
    {
      id: 'day30-sub3',
      number: 3,
      title: 'Object-Oriented Architecture & Composition Patterns',
      summary: 'Design clean domain classes using composition, invariants, and dataclasses.',
      estimatedMinutes: 15,
      introduce: {
        headline: 'Modeling Real-World Systems Without Inheritance Bloat',
        paragraphs: [
          'Good Object-Oriented Python models **invariants** cleanly: validate state in `__init__` (or `__post_init__`), hide internal storage behind properties (`@property`), and implement meaningful `__repr__` so debugging is effortless.',
          'Favor **composition over deep inheritance**: inject small collaborator objects (such as a `StorageBackend` or `Notifier`) into your service class rather than building rigid 4-level class hierarchies. Composition makes swapping real databases for fast test fakes trivial.',
        ],
        keyTerms: [
          {
            term: 'Composition Over Inheritance',
            definition: 'Building complex behavior by holding collaborator objects ("has-a") rather than subclassing ("is-a").',
          },
          {
            term: 'dataclass',
            definition: 'Standard library decorator auto-generating __init__, __repr__, and __eq__ for data-centric classes.',
          },
        ],
        bulletPoints: [
          'Use `@dataclass(frozen=True)` for immutable value objects (Money, Coordinate, Config).',
          'Keep `__repr__` unambiguous and developer-friendly for tracebacks and logs.',
        ],
      },
      visualise: {
        type: 'curriculum-revision-radar-sim',
        title: '30-Day Curriculum Revision & Weak-Spot Diagnostic',
        badge: 'simulation',
        description: 'Inspect OOP design invariants and dependency injection patterns.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Composition with a Swappable Notification Collaborator',
          runMode: 'real',
          code: `from dataclasses import dataclass

@dataclass(frozen=True)
class Alert:
    recipient: str
    message: str

class MemoryNotifier:
    def __init__(self):
        self.sent = []
    def send(self, alert):
        self.sent.append(alert)

class OrderService:
    def __init__(self, notifier):
        self.notifier = notifier
    def complete(self, email, order_id):
        self.notifier.send(Alert(email, f"Order {order_id} confirmed"))

notifier = MemoryNotifier()
OrderService(notifier).complete("ada@dev.io", 42)
print(len(notifier.sent), notifier.sent[0].message)`,
          expectedOutput: '1 Order 42 confirmed',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 15,
          instruction: 'def __init__(self, notifier): self.notifier = notifier',
          internalEffect: 'Injects the notifier dependency via composition so tests can pass MemoryNotifier.',
        },
      ],
      apply: {
        domain: 'Domain Modeling',
        contextTitle: 'Enforcing Positive Money Invariants',
        scenario: 'Guard immutable value objects in __post_init__.',
        code: `from dataclasses import dataclass

@dataclass(frozen=True)
class Price:
    cents: int
    def __post_init__(self):
        if self.cents < 0:
            raise ValueError("cents must be >= 0")

print(Price(1999))`,
        outcome: 'Price(cents=1999)',
      },
      commonMistakes: [
        {
          label: 'Storing Mutable State on Class Attributes Instead of self',
          erroneousCode: `class Cart:\n    items = []  # Shared across ALL Cart instances!`,
          errorMessage: 'Adding an item to user A cart mutates user B cart',
          explanation: 'Initialize per-instance mutable collections inside `__init__` (`self.items = []`) or `@dataclass field(default_factory=list)`.',
          correctedCode: `class Cart:\n    def __init__(self):\n        self.items = []`,
        },
      ],
      sourceNotes: 'Synthesizes Day 21 OOP, invariants, and composition.',
      practise: [
        {
          id: 'day30-ex9',
          title: 'Shared Class Attribute vs Instance Attribute Bug',
          type: 'fix-the-bug',
          tier: 'foundation',
          prompt: 'This `TodoList` class shares `items = []` across every instance! Fix `__init__` so each `TodoList` owns an independent list.',
          starterCode: `class TodoList:
    items = []
    def add(self, task):
        self.items.append(task)
`,
          solutionCode: `class TodoList:
    def __init__(self):
        self.items = []
    def add(self, task):
        self.items.append(task)
`,
          testCases: [
            { id: 'tc1', label: 'Two instances stay isolated', setup: 'a, b = TodoList(), TodoList()\na.add("ship")\nprint(a.items, b.items)', expected: "['ship'] []", hidden: false },
          ],
          hints: ['Remove the class-level `items = []`.', 'Initialize `self.items = []` inside `def __init__(self):`.'],
          points: 10,
        },
        {
          id: 'day30-ex10',
          title: 'Composition vs Deep Inheritance',
          type: 'scenario-mcq',
          tier: 'standard',
          prompt: 'Your billing service currently sends alerts via email, and next month you also need Slack alerts and fast unit tests without hitting real SMTP servers. Which OOP pattern makes this cleanest?',
          options: [
            { id: 'a', text: 'Composition: inject a notifier collaborator into BillingService.__init__(self, notifier).', explanation: 'Correct! Swapping EmailNotifier, SlackNotifier, or FakeNotifier requires zero changes to BillingService.', isCorrect: true },
            { id: 'b', text: 'Create a 4-level multiple-inheritance tree inheriting from Email, Slack, Mock, and Service.', explanation: 'Incorrect. Deep multiple inheritance creates brittle MRO conflicts.', isCorrect: false },
            { id: 'c', text: 'Use global variables inside BillingService methods.', explanation: 'Incorrect. Global state hinders test isolation.', isCorrect: false },
            { id: 'd', text: 'Hardcode smtplib inside every method.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: ['Think "has-a" collaborator vs "is-a" hierarchy.', 'Dependency injection enables easy test fakes.', 'Prefer composition over inheritance.'],
          points: 10,
        },
        {
          id: 'day30-ex11',
          title: 'Write a Validated Frozen Dataclass',
          type: 'write-code',
          tier: 'challenge',
          prompt: 'Create a `@dataclass(frozen=True)` class `Quantity` with field `amount: int` that raises `ValueError` in `__post_init__` if `amount <= 0`.',
          starterCode: `from dataclasses import dataclass

@dataclass(frozen=True)
class Quantity:
    amount: int
`,
          solutionCode: `from dataclasses import dataclass

@dataclass(frozen=True)
class Quantity:
    amount: int
    def __post_init__(self):
        if self.amount <= 0:
            raise ValueError("amount must be > 0")
`,
          testCases: [
            { id: 'tc1', label: 'Valid quantity instantiates', setup: 'print(Quantity(3).amount)', expected: '3', hidden: false },
            { id: 'tc2', label: 'Rejects zero or negative amount', setup: 'try:\n    Quantity(0)\nexcept ValueError:\n    print("caught")', expected: 'caught', hidden: true },
          ],
          hints: ['Add `def __post_init__(self):` inside Quantity.', 'Check `if self.amount <= 0:` and raise `ValueError(...)`.'],
          points: 15,
        },
        {
          id: 'day30-ex12',
          title: 'Trace Value Object Invariant Benefits',
          type: 'explain-the-trace',
          tier: 'standard',
          prompt: 'Why does enforcing validation in `__post_init__` on a `@dataclass(frozen=True)` guarantee that no invalid instance can exist anywhere downstream?',
          traceStepCode: `@dataclass(frozen=True)\nclass Email:\n    value: str\n    def __post_init__(self):\n        if "@" not in self.value: raise ValueError()`,
          traceQuestion: 'How do frozen + __post_init__ work together?',
          modelAnswer: '__post_init__ rejects invalid values at construction time, and frozen=True prevents any later attribute reassignment (obj.value = "bad"). Together they guarantee the invariant holds for the entire lifetime of the object.',
          markingCriteria: [
            { id: 'mc1', label: 'Notes __post_init__ validates on construction', points: 5 },
            { id: 'mc2', label: 'Notes frozen=True prevents post-construction mutation', points: 5 },
          ],
          hints: ['Check happens at creation.', 'frozen=True blocks attribute reassignment.', 'Invariant holds forever.'],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day30-sub4',
      number: 4,
      title: 'Files, Regex, Virtual Environments & Clean Packaging',
      summary: 'Review UTF-8 streaming I/O, regex safety, .venv isolation, and pyproject.toml packaging.',
      estimatedMinutes: 14,
      introduce: {
        headline: 'Hardening Files, Dependencies & Reproducible Builds',
        paragraphs: [
          'Reliable Python utilities respect operating-system boundaries: join paths with **`pathlib.Path`**, open files with `with open(..., encoding="utf-8")`, compile reused regular expressions with `re.compile()`, and avoid catastrophic regex backtracking by keeping quantifiers unambiguous.',
          'For deployment and sharing, every project belongs in its own **`.venv`**, declares exact dependencies (`requirements.txt` or **`pyproject.toml`**), and guards CLI execution inside `if __name__ == "__main__":` so modules remain cleanly importable by tests.',
        ],
        keyTerms: [
          {
            term: 'pyproject.toml',
            definition: 'Modern PEP 518/621 standard file declaring package metadata, dependencies, and CLI entrypoints.',
          },
          {
            term: '__main__ Guard',
            definition: 'Condition ensuring CLI/script execution runs only directly, not when another module imports the file.',
          },
        ],
        bulletPoints: [
          'Never name a local script `re.py`, `json.py`, or `requests.py`—it shadows the real package.',
          'Always commit `.env.example` and `.gitignore` (excluding `.venv/` and `.env`).',
        ],
      },
      visualise: {
        type: 'capstone-architecture-sim',
        title: 'Final Capstone Architecture & Portfolio Blueprint',
        badge: 'simulation',
        description: 'Inspect pyproject.toml, .env.example, src/, and tests/ directory structures.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Compiled Regex Log Extractor + Pathlib Safe Joining',
          runMode: 'real',
          code: `import re
from pathlib import PurePosixPath

LOG_RE = re.compile(r"^(?P<level>INFO|ERROR)\s+(?P<msg>.+)$")
line = "ERROR Database timeout"
m = LOG_RE.match(line)
log_path = PurePosixPath("logs") / "app.log"
print(m.group("level"), m.group("msg"), str(log_path))`,
          expectedOutput: 'ERROR Database timeout logs/app.log',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'LOG_RE = re.compile(...)',
          internalEffect: 'Pre-compiles the regex once with named capture groups for fast repeated matching.',
        },
        {
          step: 2,
          codeLine: 7,
          instruction: 'PurePosixPath("logs") / "app.log"',
          internalEffect: 'Composes cross-platform paths safely using `/` operator without fragile string concatenation.',
        },
      ],
      apply: {
        domain: 'DevOps',
        contextTitle: 'Validating Environment Hygiene',
        scenario: 'Verify sensitive files are covered by .gitignore.',
        code: `IGNORED = {".venv/", ".env", "__pycache__/"}
candidates = [".env", "README.md", ".venv/"]
untracked = [c for c in candidates if c in IGNORED]
print("Excluded from git:", untracked)`,
        outcome: "Excluded from git: ['.env', '.venv/']",
      },
      commonMistakes: [
        {
          label: 'Running Side Effects at Module Import Time',
          erroneousCode: `# helpers.py\nconnect_db()  # Runs even when pytest imports a single utility function!`,
          errorMessage: 'Unit tests fail or hang during import before mocking can run',
          explanation: 'Wrap script entrypoints inside `if __name__ == "__main__":` and initialize clients inside factory functions.',
          correctedCode: `def main():\n    connect_db()\n\nif __name__ == "__main__":\n    main()`,
        },
      ],
      sourceNotes: 'Synthesizes Days 18–23 file I/O, regex, modules, and virtual environments.',
      practise: [
        {
          id: 'day30-ex13',
          title: 'Shadowing Standard Library Module Names',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'A developer names their practice script `json.py` in the project root, then runs `import json; json.dumps({})` and crashes with `AttributeError: module "json" has no attribute "dumps"`. Why?',
          options: [
            { id: 'a', text: 'Python searches the current directory first on sys.path, so `import json` imported the local script instead of the standard library.', explanation: 'Correct! Never shadow stdlib or third-party module names like json.py, re.py, or requests.py.', isCorrect: true },
            { id: 'b', text: 'json.dumps was removed in Python 3.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'c', text: 'Virtual environments disable the standard library.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'd', text: 'Strings cannot be serialized in root directories.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: ['Look at sys.path resolution order.', 'Where does Python look first when importing?', 'Rename the file so it does not collide with stdlib names.'],
          points: 10,
        },
        {
          id: 'day30-ex14',
          title: 'Order Module Entrypoint Guard Steps',
          type: 'order-the-lines',
          tier: 'foundation',
          prompt: 'Order the lines so helper functions can be safely imported by unit tests without executing `main()` at import time.',
          jumbledLines: [
            { id: 'l1', code: 'def compute_report(): return "ok"', indent: 0 },
            { id: 'l2', code: 'def main(): print(compute_report())', indent: 0 },
            { id: 'l3', code: 'if __name__ == "__main__":', indent: 0 },
            { id: 'l4', code: '    main()', indent: 1 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: ['Define helper functions first.', 'Define main() next.', 'Put main() inside if __name__ == "__main__":.'],
          points: 10,
        },
        {
          id: 'day30-ex15',
          title: 'Extract Structured Log Fields with Named Regex Groups',
          type: 'write-code',
          tier: 'challenge',
          prompt: 'Write `parse_metric(line)` using `re.compile(r"^(?P<service>[a-z_]+):(?P<ms>\\d+)ms$")`. If matched, return `(m.group("service"), int(m.group("ms")))`, else `None`.',
          starterCode: `import re

METRIC_RE = re.compile(r"^(?P<service>[a-z_]+):(?P<ms>\\d+)ms$")

def parse_metric(line):
    pass
`,
          solutionCode: `import re

METRIC_RE = re.compile(r"^(?P<service>[a-z_]+):(?P<ms>\\d+)ms$")

def parse_metric(line):
    m = METRIC_RE.match(line)
    if not m:
        return None
    return m.group("service"), int(m.group("ms"))
`,
          testCases: [
            { id: 'tc1', label: 'Extracts service and ms', setup: 'print(parse_metric("auth_api:42ms"))', expected: "('auth_api', 42)", hidden: false },
            { id: 'tc2', label: 'Rejects malformed line', setup: 'print(parse_metric("bad-input"))', expected: 'None', hidden: true },
          ],
          hints: ['Call `m = METRIC_RE.match(line)`.', 'Return `None` if `not m`.', 'Cast `m.group("ms")` to `int`.'],
          points: 15,
        },
        {
          id: 'day30-ex16',
          title: 'Environment Secrets & .gitignore',
          type: 'fill-the-gaps',
          tier: 'foundation',
          prompt: 'Complete the repository configuration hygiene rule.',
          gaps: [
            { id: 'g1', beforeText: 'Exclude local virtual environments and ', afterText: ' files via .gitignore,', correctAnswer: '.env', options: ['.env', 'README.md', 'pyproject.toml'] },
            { id: 'g2', beforeText: ' and commit a secret-free ', afterText: ' template instead.', correctAnswer: '.env.example', options: ['.env.example', 'secrets.py', '.venv'] },
          ],
          hints: ['Real secrets stay in untracked .env.', 'Placeholder keys go in tracked .env.example.'],
          points: 10,
        },
      ],
      assess: [],
    },
    {
      id: 'day30-sub5',
      number: 5,
      title: 'Automated Testing, Edge-Case Verification & Mocking',
      summary: 'Verify behavior systematically using assertions, boundary inputs, and dependency fakes.',
      estimatedMinutes: 15,
      introduce: {
        headline: 'Confidence Through Automated Tests & Edge Cases',
        paragraphs: [
          'Code without tests is an assumption. Following the **Arrange–Act–Assert (AAA)** pattern, every core function should have automated tests covering: (1) the happy path, (2) empty/boundary inputs (`0`, `""`, `[]`, `None`), and (3) expected exceptions (`ValueError`, `404`).',
          'When testing functions that call external APIs or databases, inject **fakes** or **`unittest.mock.Mock`** collaborators so unit tests run in milliseconds, deterministically, without touching live networks or production databases.',
        ],
        keyTerms: [
          {
            term: 'Arrange-Act-Assert',
            definition: 'Standard 3-part test structure: set up inputs, invoke target unit, assert expected output/side effects.',
          },
          {
            term: 'Test Double / Fake',
            definition: 'Lightweight in-memory replacement for a slow external dependency (DB, HTTP API, clock).',
          },
        ],
        bulletPoints: [
          'Test behaviors and outputs, not private implementation details.',
          'Always test invalid inputs (`bool` passed as `int`, negative pagination bounds, missing dict keys).',
        ],
      },
      visualise: {
        type: 'capstone-architecture-sim',
        title: 'Final Capstone Architecture & Portfolio Blueprint',
        badge: 'simulation',
        description: 'Compare production quality gates and test suite coverage across capstone tracks.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Arrange–Act–Assert Unit Test Suite with Boundary Cases',
          runMode: 'real',
          code: `def discount_price(cents, pct):
    if cents < 0 or not (0 <= pct <= 100):
        raise ValueError("Invalid price or discount")
    return round(cents * (100 - pct) / 100)

assert discount_price(1000, 20) == 800
assert discount_price(0, 50) == 0
try:
    discount_price(-10, 10)
    assert False, "Expected ValueError"
except ValueError:
    print("All assertions passed!")`,
          expectedOutput: 'All assertions passed!',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 6,
          instruction: 'assert discount_price(1000, 20) == 800',
          internalEffect: 'Verifies standard behavior and boundary zero cents before checking error paths.',
        },
      ],
      apply: {
        domain: 'QA Engineering',
        contextTitle: 'Injecting a Deterministic Clock for Tests',
        scenario: 'Avoid flaky time-dependent tests by passing a `now_fn` parameter.',
        code: `def is_expired(expires_ts, now_fn):
    return now_fn() > expires_ts

print("Expired:", is_expired(100, lambda: 105))`,
        outcome: 'Expired: True',
      },
      commonMistakes: [
        {
          label: 'Making Live HTTP Calls Inside Unit Tests',
          erroneousCode: `# def test_weather(): assert fetch_weather("London")["temp"] > -50  # Fails offline or on rate limits!`,
          errorMessage: 'Flaky CI builds caused by network latency or 429 rate limits',
          explanation: 'Mock the HTTP transport or inject a stub response so unit tests stay fast and hermetic.',
          correctedCode: `# Inject FakeSession returning {"temp": 18} cleanly in tests`,
        },
      ],
      sourceNotes: 'Covers automated testing, AAA structure, boundary cases, and test doubles.',
      practise: [
        {
          id: 'day30-ex17',
          title: 'Why Unit Tests Mock External HTTP APIs',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Your `pytest` suite fails randomly in CI whenever a partner sandbox API returns `429` or goes offline. What is the standard fix?',
          options: [
            { id: 'a', text: 'Inject a fake/mock HTTP client in unit tests so tests verify your logic deterministically without network calls.', explanation: 'Correct! Unit tests should be fast, deterministic, and isolated from external network flakiness.', isCorrect: true },
            { id: 'b', text: 'Delete the tests from CI.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'c', text: 'Add time.sleep(60) before every test.', explanation: 'Incorrect. Makes CI slow and still fragile offline.', isCorrect: false },
            { id: 'd', text: 'Ignore all assertions in pytest.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: ['Unit tests should never rely on public internet availability.', 'Replace live HTTP transport with an in-memory stub/mock.'],
          points: 10,
        },
        {
          id: 'day30-ex18',
          title: 'Fix Missing Edge-Case Guard in Divider',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'This `safe_rate(success, total)` function crashes with `ZeroDivisionError` when `total == 0`. Fix it to return `0.0` when `total <= 0`, otherwise `round(success / total, 4)`.',
          starterCode: `def safe_rate(success, total):
    return round(success / total, 4)
`,
          solutionCode: `def safe_rate(success, total):
    if total <= 0:
        return 0.0
    return round(success / total, 4)
`,
          testCases: [
            { id: 'tc1', label: 'Handles zero denominator', setup: 'print(safe_rate(0, 0))', expected: '0.0', hidden: false },
            { id: 'tc2', label: 'Computes rounded rate', setup: 'print(safe_rate(3, 4))', expected: '0.75', hidden: true },
          ],
          hints: ['Guard `if total <= 0: return 0.0` before dividing.'],
          points: 10,
        },
        {
          id: 'day30-ex19',
          title: 'Deterministic Clock Dependency Injection',
          type: 'write-code',
          tier: 'challenge',
          prompt: 'Write `seconds_remaining(deadline_ts, now_fn)` that computes `max(0, deadline_ts - now_fn())`.',
          starterCode: `def seconds_remaining(deadline_ts, now_fn):
    pass
`,
          solutionCode: `def seconds_remaining(deadline_ts, now_fn):
    return max(0, deadline_ts - now_fn())
`,
          testCases: [
            { id: 'tc1', label: 'Future deadline', setup: 'print(seconds_remaining(150, lambda: 120))', expected: '30', hidden: false },
            { id: 'tc2', label: 'Expired deadline clamps to 0', setup: 'print(seconds_remaining(100, lambda: 140))', expected: '0', hidden: true },
          ],
          hints: ['Call `now_fn()` to get current time.', 'Clamp negative differences with `max(0, ...)`.'],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day30-sub6',
      number: 6,
      title: 'Full-Stack Synthesis: Data, Flask, MongoDB & REST APIs',
      summary: 'Connect scraping/Pandas data ingestion cleanly to MongoDB storage and RESTful endpoints.',
      estimatedMinutes: 16,
      introduce: {
        headline: 'Connecting the Full Python Ecosystem End-to-End',
        paragraphs: [
          'Days 24–29 taught you each layer of a modern Python stack: **NumPy/Pandas** for fast vectorised data transformation, **Flask** for web routing & Jinja2 templates, **MongoDB/PyMongo** for flexible document persistence & aggregation pipelines, and **REST APIs** for both consuming external services (`requests.Session`, retries) and building validated JSON endpoints.',
          'In production systems, **clean boundaries** glue these layers together: ingestion modules validate external API data before persisting to MongoDB, and Flask route handlers delegate validation, serialization (`str(_id)`), and allowlisted updates cleanly rather than stuffing database queries into templates.',
        ],
        keyTerms: [
          {
            term: 'Separation of Concerns',
            definition: 'Splitting HTTP routing, validation/serialization, and database access into distinct testable modules.',
          },
          {
            term: 'End-to-End Contract',
            definition: 'Coherent flow ensuring types validated at ingestion match MongoDB indexes and JSON API responses.',
          },
        ],
        bulletPoints: [
          'Never trust HTML scraped or external JSON data without schema validation first.',
          'Create MongoDB indexes matching your API query & sort fields (Equality–Sort–Range).',
        ],
      },
      visualise: {
        type: 'curriculum-revision-radar-sim',
        title: '30-Day Curriculum Revision & Weak-Spot Diagnostic',
        badge: 'simulation',
        description: 'Switch to Days 21–29 Applied Systems to inspect full-stack integration diagnostics.',
        initialConfig: {},
      },
      code: [
        {
          title: 'End-to-End Ingest -> Aggregate -> Serialize Mini Pipeline',
          runMode: 'real',
          code: `raw_events = [
    {"region": "eu", "amount": 40},
    {"region": "af", "amount": 75},
    {"region": "eu", "amount": 60},
]
totals = {}
for ev in raw_events:
    r = ev["region"]
    totals[r] = totals.get(r, 0) + ev["amount"]

api_response = {"count": len(totals), "totals": totals}
print(api_response)`,
          expectedOutput: "{'count': 2, 'totals': {'eu': 100, 'af': 75}}",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 8,
          instruction: 'totals[r] = totals.get(r, 0) + ev["amount"]',
          internalEffect: 'Aggregates numeric amounts per region cleanly before wrapping in a REST envelope.',
        },
      ],
      apply: {
        domain: 'Analytics Backend',
        contextTitle: 'Pipeline Validation Before Persistence',
        scenario: 'Drop malformed incoming records while tracking reject counts.',
        code: `records = [{"sku": "A1", "qty": 3}, {"sku": "B2", "qty": -1}]
valid = [r for r in records if r["qty"] > 0]
print("Accepted:", len(valid), "Rejected:", len(records) - len(valid))`,
        outcome: 'Accepted: 1 Rejected: 1',
      },
      commonMistakes: [
        {
          label: 'Mixing Database Queries Directly Inside Jinja2 Templates',
          erroneousCode: `# {{ db.orders.find({"user": user.id}) }}  # Tightly couples DB to HTML rendering!`,
          errorMessage: 'Impossible to unit-test templates and causes N+1 database round-trips',
          explanation: 'Fetch and serialize required data in the Python view/service layer, then pass clean plain dicts to `render_template()`.',
          correctedCode: `# rows = service.get_orders(user.id); return render_template("orders.html", orders=rows)`,
        },
      ],
      sourceNotes: 'Synthesizes Days 24–29 Data Science, Web, MongoDB, and API layers.',
      practise: [
        {
          id: 'day30-ex20',
          title: 'Chained Assignment vs .loc Assignment in Pandas',
          type: 'scenario-mcq',
          tier: 'standard',
          prompt: 'A data pipeline filters active users and writes `df[df["age"] >= 18]["adult"] = True`, triggering `SettingWithCopyWarning` and dropping updates silently. Which pattern avoids this?',
          options: [
            { id: 'a', text: 'Use single-step label indexing: df.loc[df["age"] >= 18, "adult"] = True', explanation: 'Correct! Single-step .loc guarantees mutation occurs on df itself rather than an intermediate slice copy.', isCorrect: true },
            { id: 'b', text: 'Suppress all warnings and ignore the silent data loss.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'c', text: 'Switch from Pandas to JSON dumps inside loops.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'd', text: 'Use double square brackets everywhere.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: ['Avoid df[mask][col] = val.', 'Use df.loc[row_mask, col] = val.'],
          points: 15,
        },
        {
          id: 'day30-ex21',
          title: 'Compound ESR Index Order in MongoDB',
          type: 'scenario-mcq',
          tier: 'challenge',
          prompt: 'An API endpoint queries MongoDB for `{"tenant_id": tid, "credits": {"$gte": 100}}` sorted by `created_at` descending. Using the ESR (Equality–Sort–Range) rule, what is the optimal compound index key order?',
          options: [
            { id: 'a', text: '[("tenant_id", 1), ("created_at", -1), ("credits", 1)]', explanation: 'Correct! Equality (tenant_id) first, Sort (created_at) second, Range ($gte credits) last.', isCorrect: true },
            { id: 'b', text: '[("credits", 1), ("tenant_id", 1), ("created_at", -1)]', explanation: 'Incorrect. Putting Range before Sort prevents using the index for in-order sorting.', isCorrect: false },
            { id: 'c', text: '[("created_at", -1), ("credits", 1), ("tenant_id", 1)]', explanation: 'Incorrect. Equality should come before Sort/Range.', isCorrect: false },
            { id: 'd', text: 'No index is needed on collections under 10 GB.', explanation: 'Incorrect. Full COLLSCAN kills latency even at 100k documents.', isCorrect: false },
          ],
          hints: ['E = Equality (tenant_id).', 'S = Sort (created_at).', 'R = Range ($gte credits).'],
          points: 15,
        },
        {
          id: 'day30-ex22',
          title: 'Serialize & Aggregate Records for a JSON Endpoint',
          type: 'write-code',
          tier: 'project',
          prompt: 'Write `summarize_sales(records)` where each record is `{"region": str, "amount": int, "valid": bool}`. Skip invalid (`valid` is False) records, sum `amount` per `region`, and return `{"count": len(totals), "totals": totals}`.',
          starterCode: `def summarize_sales(records):
    pass
`,
          solutionCode: `def summarize_sales(records):
    totals = {}
    for rec in records:
        if rec.get("valid"):
            reg = rec["region"]
            totals[reg] = totals.get(reg, 0) + rec["amount"]
    return {"count": len(totals), "totals": totals}
`,
          testCases: [
            { id: 'tc1', label: 'Filters invalid and aggregates totals', setup: 'rows = [{"region": "eu", "amount": 50, "valid": True}, {"region": "eu", "amount": 99, "valid": False}, {"region": "af", "amount": 30, "valid": True}]\nprint(summarize_sales(rows))', expected: "{'count': 2, 'totals': {'eu': 50, 'af': 30}}", hidden: false },
          ],
          hints: ['Only process records where rec.get("valid") is truthy.', 'Accumulate into `totals[reg] = totals.get(reg, 0) + rec["amount"]`.', 'Wrap in {"count": len(totals), "totals": totals}.'],
          points: 20,
        },
        {
          id: 'day30-ex23',
          title: 'Flask & API End-to-End Flow',
          type: 'theory-reasoning',
          tier: 'standard',
          prompt: 'Why is Post/Redirect/Get (PRG) important after handling an HTML form `POST`, and how does that differ from returning `201 Created` in a JSON REST API?',
          modelAnswer: 'In HTML browser forms, PRG redirects (302/303) after POST to a GET view so refreshing the browser repeats the safe GET instead of resubmitting the POST form. In a JSON REST API consumed programmatically, clients parse status codes directly so returning 201 Created with a Location header is standard.',
          markingCriteria: [
            { id: 'mc1', label: 'Explains PRG prevents duplicate browser refresh submissions', points: 5 },
            { id: 'mc2', label: 'Distinguishes HTML browser redirects from JSON 201 + Location', points: 5 },
          ],
          hints: ['What happens if a user presses F5 right after submitting a POST HTML form?', 'JSON clients do not render HTML pages or press F5.'],
          points: 10,
        },
      ],
      assess: [],
    },
    {
      id: 'day30-sub7',
      number: 7,
      title: 'Capstone Project Architecture, Documentation & Delivery',
      summary: 'Structure a portfolio-grade repository with clean modules, README, and reproducible setup.',
      estimatedMinutes: 16,
      introduce: {
        headline: 'Turning Practice Code into a Portfolio-Ready Repository',
        paragraphs: [
          'What separates a tutorial script from a compelling **engineering portfolio project** is reproducibility and clarity. A strong Python capstone repository includes: a focused problem statement in `README.md`, clear installation steps (`python -m venv .venv && pip install -e .`), `.env.example` documenting required config vars without secrets, clean module separation, and passing automated tests.',
          'Before presenting a capstone project, run a release checklist: verify zero hardcoded credentials, confirm edge-case handling on invalid inputs, include sample input/output screenshots or terminal logs, and explain your architectural trade-offs concisely.',
        ],
        keyTerms: [
          {
            term: 'Reproducible Quickstart',
            definition: 'Exact setup commands enabling any reviewer to clone, install deps, and run tests in minutes.',
          },
          {
            term: '.env.example',
            definition: 'Tracked template listing required environment variable names (with placeholder values, never real secrets).',
          },
        ],
        bulletPoints: [
          'Document *why* you chose an architecture (e.g., embedded vs referenced MongoDB schema), not just *what* files exist.',
          'Small, well-tested projects beat sprawling half-broken repos every time.',
        ],
      },
      visualise: {
        type: 'capstone-architecture-sim',
        title: 'Final Capstone Architecture & Portfolio Blueprint',
        badge: 'simulation',
        description: 'Explore four turnkey capstone tracks and their production quality gates.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Automated Portfolio Readiness Checklist Validator',
          runMode: 'real',
          code: `required_files = {"README.md", "pyproject.toml", ".env.example", "tests/test_app.py"}
repo_files = {"README.md", "pyproject.toml", ".env.example", "tests/test_app.py", "src/app.py"}
missing = sorted(required_files - repo_files)
print("Ready:", len(missing) == 0, "Missing:", missing)`,
          expectedOutput: 'Ready: True Missing: []',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'missing = sorted(required_files - repo_files)',
          internalEffect: 'Uses set difference to verify every essential portfolio artifact is present.',
        },
      ],
      apply: {
        domain: 'Release Engineering',
        contextTitle: 'Secret Scanning Before Git Commit',
        scenario: 'Flag accidental hardcoded API keys before pushing.',
        code: `lines = ['URI = os.environ["MONGODB_URI"]', 'TOKEN = "sk_live_hardcoded"']
flagged = [ln for ln in lines if "sk_live_" in ln]
print("Secret warnings:", len(flagged))`,
        outcome: 'Secret warnings: 1',
      },
      commonMistakes: [
        {
          label: 'Committing .env Files or API Keys to Git History',
          erroneousCode: `# git add .env && git commit -m "config"`,
          errorMessage: 'Credentials remain in Git history even if deleted in a later commit',
          explanation: 'Add `.env` and `.venv/` to `.gitignore` immediately at repo creation, and track only `.env.example`.',
          correctedCode: `# .gitignore contains .env and .venv/`,
        },
      ],
      sourceNotes: 'Covers capstone architecture, documentation, and delivery standards.',
      practise: [
        {
          id: 'day30-ex24',
          title: 'Portfolio Repository Readiness Audit',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Write `audit_repo(present_files, required_files)` returning a sorted list of missing filenames (`required_files - present_files`).',
          starterCode: `def audit_repo(present_files, required_files):
    pass
`,
          solutionCode: `def audit_repo(present_files, required_files):
    return sorted(set(required_files) - set(present_files))
`,
          testCases: [
            { id: 'tc1', label: 'Returns sorted missing files', setup: 'print(audit_repo(["README.md"], ["README.md", "tests/test_app.py", ".env.example"]))', expected: "['.env.example', 'tests/test_app.py']", hidden: false },
            { id: 'tc2', label: 'Complete repo returns empty list', setup: 'print(audit_repo(["a", "b"], ["a", "b"]))', expected: '[]', hidden: true },
          ],
          hints: ['Convert both inputs to `set`.', 'Compute `set(required_files) - set(present_files)`.', 'Wrap with `sorted(...)`.'],
          points: 15,
        },
        {
          id: 'day30-ex25',
          title: 'Secret Scanning Before Git Push',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'This secret scanner only checks lowercase `"sk_live_"` and misses `"SK_LIVE_"` or `"MONGODB_URI=mongodb+srv://"`. Fix `has_secret_leak(line)` to detect either `"sk_live_"` (case-insensitive) or `"mongodb+srv://"` (case-insensitive).',
          starterCode: `def has_secret_leak(line):
    return "sk_live_" in line
`,
          solutionCode: `def has_secret_leak(line):
    low = line.lower()
    return "sk_live_" in low or "mongodb+srv://" in low
`,
          testCases: [
            { id: 'tc1', label: 'Detects uppercase SK_LIVE_ and mongodb+srv', setup: 'print(has_secret_leak("KEY=SK_LIVE_123"), has_secret_leak("URI=mongodb+srv://user:pw@cluster"))', expected: 'True True', hidden: false },
            { id: 'tc2', label: 'Allows env lookup', setup: 'print(has_secret_leak("os.environ[\'API_KEY\']"))', expected: 'False', hidden: true },
          ],
          hints: ['Lowercase `line` once into `low = line.lower()`.', 'Check `"sk_live_" in low or "mongodb+srv://" in low`.'],
          points: 15,
        },
        {
          id: 'day30-ex26',
          title: 'Why Small Well-Tested Repos Beat Sprawling Prototypes',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'When evaluating a developer’s GitHub capstone portfolio project, what signals engineering maturity most clearly?',
          options: [
            { id: 'a', text: 'Clean modular layout, clear README quickstart, .env.example (no committed secrets), and passing unit tests on edge cases.', explanation: 'Correct! Reproducibility, clarity, and verified behavior demonstrate real engineering discipline.', isCorrect: true },
            { id: 'b', text: 'A single 2,000-line script containing hardcoded API keys and zero tests.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'c', text: 'Committing the entire .venv/ folder so the repo has 20,000 files.', explanation: 'Incorrect. .venv/ should always be excluded via .gitignore.', isCorrect: false },
            { id: 'd', text: 'Omitting requirements.txt/pyproject.toml.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: ['Can another engineer clone and run tests in 2 minutes?', 'Are secrets protected and dependencies pinned?'],
          points: 10,
        },
      ],
      assess: [],
    },
    {
      id: 'day30-sub8',
      number: 8,
      title: 'Certificate Readiness & Future Python Horizons',
      summary: 'Explore next-stage Python ecosystems: static typing, asyncio, FastAPI, ML, and CI/CD.',
      estimatedMinutes: 16,
      introduce: {
        headline: 'Graduating from Fundamentals to Production Specialization',
        paragraphs: [
          'Completing 30 Days of Python equips you with the full foundational and applied toolkit—from variables and recursion to Pandas, Flask, MongoDB, and REST API engineering. From here, you can specialize cleanly along four high-leverage Python horizons:',
          '1. **Static Typing & Modern Python** (`typing`, `dataclasses`, `mypy`/`pyright`, `asyncio` + `httpx` for concurrent I/O).\n2. **Backend & Distributed APIs** (FastAPI, Pydantic validation, PostgreSQL/SQLAlchemy, Redis, Docker).\n3. **Data Science & Machine Learning** (Polars, DuckDB, `scikit-learn`, PyTorch, reproducible ML pipelines).\n4. **Tooling, Testing & Automation** (`pytest` fixtures, `ruff` linting, GitHub Actions CI/CD).',
        ],
        keyTerms: [
          {
            term: 'PEP 484 Type Hints',
            definition: 'Optional static type annotations checked offline by tools like mypy or pyright.',
          },
          {
            term: 'asyncio',
            definition: 'Python’s cooperative concurrency library for high-throughput non-blocking network I/O.',
          },
        ],
        bulletPoints: [
          'Continuous mastery comes from building, reading open-source Python code, and shipping small well-tested tools.',
          'Next milestones: complete Day 30 Part B labs, final capstone, and mastery assessment for certification.',
        ],
      },
      visualise: {
        type: 'future-horizons-roadmap-sim',
        title: 'Post-Day-30 Python Specialization Horizons',
        badge: 'simulation',
        description: 'Navigate four specialization tracks showing how Days 1–29 connect to your next stack.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Typed Dataclass Service Config Summary',
          runMode: 'real',
          code: `from dataclasses import dataclass

@dataclass(frozen=True)
class GraduateSummary:
    days_completed: int
    track: str

grad = GraduateSummary(days_completed=30, track="Backend & APIs")
print(f"Completed {grad.days_completed} days -> Next: {grad.track}")`,
          expectedOutput: 'Completed 30 days -> Next: Backend & APIs',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: '@dataclass(frozen=True)',
          internalEffect: 'Creates an immutable, type-annotated value object representing a Day 30 specialization plan.',
        },
      ],
      apply: {
        domain: 'Career Planning',
        contextTitle: 'Mapping Completed Skills to Specializations',
        scenario: 'Recommend a next-step framework based on mastered prerequisite tracks.',
        code: `mastered = {"flask", "mongodb", "apis"}
next_step = "FastAPI + Pydantic + Docker" if {"flask", "apis"} <= mastered else "Core Review"
print("Recommended track:", next_step)`,
        outcome: 'Recommended track: FastAPI + Pydantic + Docker',
      },
      commonMistakes: [
        {
          label: 'Jumping Straight to Complex Frameworks Without Core Fundamentals',
          erroneousCode: `# Trying to debug FastAPI/PyTorch errors without understanding decorators, mutability, or HTTP`,
          errorMessage: 'Every framework abstraction feels like magic and becomes impossible to debug',
          explanation: 'Because you mastered object references, decorators, HTTP status codes, BSON, and serializers across Days 1–29, frameworks like FastAPI and PyTorch will click naturally.',
          correctedCode: `# Connect each framework feature back to its underlying Python mechanism`,
        },
      ],
      sourceNotes: 'Covers Day 30 graduation readiness and future Python horizons.',
      practise: [
        {
          id: 'day30-ex27',
          title: 'Capstone Certificate Eligibility Gate',
          type: 'write-code',
          tier: 'project',
          prompt: 'Write `is_certified(days_done, quiz_score, project_passed)` returning `True` only when `days_done >= 30`, `quiz_score >= 80`, and `project_passed` is `True`.',
          starterCode: `def is_certified(days_done, quiz_score, project_passed):
    pass
`,
          solutionCode: `def is_certified(days_done, quiz_score, project_passed):
    return days_done >= 30 and quiz_score >= 80 and bool(project_passed)
`,
          testCases: [
            { id: 'tc1', label: 'All criteria met returns True', setup: 'print(is_certified(30, 85, True))', expected: 'True', hidden: false },
            { id: 'tc2', label: 'Fails if quiz below 80 or project incomplete', setup: 'print(is_certified(30, 79, True), is_certified(30, 95, False))', expected: 'False False', hidden: true },
          ],
          hints: ['Combine all three boolean conditions with `and`.'],
          points: 15,
        },
        {
          id: 'day30-ex28',
          title: 'Predict Frozen Config Dataclass Immutability',
          type: 'predict-output',
          tier: 'standard',
          prompt: 'What happens when code tries to mutate a field on a `@dataclass(frozen=True)` instance?',
          contextScenario: 'from dataclasses import dataclass\n@dataclass(frozen=True)\nclass Cfg:\n    port: int\nc = Cfg(3000)\ntry:\n    c.port = 8080\nexcept Exception as e:\n    print(type(e).__name__)',
          options: [
            { id: 'a', text: 'FrozenInstanceError', explanation: 'Correct! Frozen dataclasses raise dataclasses.FrozenInstanceError (a subclass of AttributeError) on mutation.', isCorrect: true },
            { id: 'b', text: '8080', explanation: 'Incorrect. Frozen dataclasses disallow attribute assignment.', isCorrect: false },
            { id: 'c', text: 'SyntaxError', explanation: 'Incorrect. It fails at runtime.', isCorrect: false },
            { id: 'd', text: 'KeyError', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: ['Think of what `frozen=True` enforces at runtime.', 'It raises FrozenInstanceError.'],
          points: 10,
        },
        {
          id: 'day30-ex29',
          title: 'Choosing the Right Next-Stage Python Ecosystem',
          type: 'scenario-mcq',
          tier: 'standard',
          prompt: 'After mastering Flask + REST API contracts + dict validation in Days 26–29, which next-step stack automates request/response schema validation and generates OpenAPI docs using Python type hints?',
          options: [
            { id: 'a', text: 'FastAPI + Pydantic', explanation: 'Correct! FastAPI builds on Python type hints and Pydantic models for automatic validation and OpenAPI generation.', isCorrect: true },
            { id: 'b', text: 'BeautifulSoup4 alone', explanation: 'Incorrect. BeautifulSoup parses HTML, not REST schemas.', isCorrect: false },
            { id: 'c', text: 'csv.DictReader', explanation: 'Incorrect.', isCorrect: false },
            { id: 'd', text: 'venv', explanation: 'Incorrect. venv isolates packages.', isCorrect: false },
          ],
          hints: ['Which web framework uses Python type annotations + Pydantic?'],
          points: 10,
        },
        {
          id: 'day30-ex30',
          title: 'End-to-End API + Pipeline Capstone Integrator',
          type: 'write-code',
          tier: 'project',
          prompt: 'Write `build_capstone_summary(title, tests_passed, tests_total, tags)`: validate `tests_total > 0` and `0 <= tests_passed <= tests_total` (else raise `ValueError`), compute `pass_rate = round(100 * tests_passed / tests_total, 1)`, deduplicate `tags` preserving order, and return `{"title": title.strip(), "pass_rate": pass_rate, "tags": clean_tags}`.',
          starterCode: `def build_capstone_summary(title, tests_passed, tests_total, tags):
    pass
`,
          solutionCode: `def build_capstone_summary(title, tests_passed, tests_total, tags):
    if tests_total <= 0 or not (0 <= tests_passed <= tests_total):
        raise ValueError("Invalid test counts")
    pass_rate = round(100 * tests_passed / tests_total, 1)
    seen, clean_tags = set(), []
    for t in tags:
        if t not in seen:
            seen.add(t)
            clean_tags.append(t)
    return {"title": title.strip(), "pass_rate": pass_rate, "tags": clean_tags}
`,
          testCases: [
            { id: 'tc1', label: 'Summarizes capstone and dedupes tags', setup: 'print(build_capstone_summary(" Study API ", 9, 10, ["api", "flask", "api"]))', expected: "{'title': 'Study API', 'pass_rate': 90.0, 'tags': ['api', 'flask']}", hidden: false },
            { id: 'tc2', label: 'Rejects invalid test totals', setup: 'try:\n    build_capstone_summary("X", 5, 4, [])\nexcept ValueError:\n    print("invalid")', expected: 'invalid', hidden: true },
          ],
          hints: ['Check `tests_total <= 0 or not (0 <= tests_passed <= tests_total)` first.', 'Use `round(100 * tests_passed / tests_total, 1)`.', 'Deduplicate `tags` with a `seen` set.'],
          points: 20,
        },
      ],
      assess: [],
    },
  ],
  realWorldLabs: [
    {
      id: 'day30-lab1',
      title: 'Lab 1: Full-Stack ETL -> Validation -> API Envelope Pipeline',
      description: 'Ingest raw JSON event strings, validate positive amounts, aggregate totals per region with O(1) dicts, and wrap in a standardized API response envelope.',
      domain: 'Full-Stack Data Systems',
      starterCode: `import json

RAW_BATCH = [
    '{"region": "eu", "amount": 120, "valid": true}',
    '{"region": "af", "amount": -5, "valid": true}',
    '{"region": "eu", "amount": 80, "valid": true}',
    '{"region": "af", "amount": 95, "valid": true}',
]

def run_pipeline(raw_items):
    totals = {}
    rejected = 0
    for raw in raw_items:
        row = json.loads(raw)
        if not row.get("valid") or not isinstance(row.get("amount"), int) or row["amount"] <= 0:
            rejected += 1
            continue
        reg = row["region"]
        totals[reg] = totals.get(reg, 0) + row["amount"]
    return {"count": len(totals), "rejected": rejected, "totals": totals}

print(run_pipeline(RAW_BATCH))
`,
      targetOutput: "{'count': 2, 'rejected': 1, 'totals': {'eu': 200, 'af': 95}}",
    },
    {
      id: 'day30-lab2',
      title: 'Lab 2: Capstone Release Gate & Secret Audit Suite',
      description: 'Run automated pre-release checks covering required portfolio files, accidental secret leaks, and certificate readiness thresholds.',
      domain: 'Release Engineering',
      starterCode: `REQUIRED = {"README.md", "pyproject.toml", ".env.example", "tests/test_app.py"}

def verify_release(repo_files, env_lines, days_done, quiz_score):
    missing = sorted(REQUIRED - set(repo_files))
    leaks = [ln for ln in env_lines if "sk_live_" in ln.lower() or "mongodb+srv://" in ln.lower()]
    certified = days_done >= 30 and quiz_score >= 80 and not missing and not leaks
    return {"missing": missing, "leaks": len(leaks), "certified": certified}

print(verify_release(["README.md", "pyproject.toml", ".env.example", "tests/test_app.py"], ['URI=os.environ["MONGODB_URI"]'], 30, 90))
`,
      targetOutput: "{'missing': [], 'leaks': 0, 'certified': True}",
    },
  ],
  miniProject: {
    id: 'day30-project',
    title: '30-Day Capstone Portfolio Project & Automated Verification Suite',
    brief: 'Architect, implement, and verify an end-to-end Python application synthesizing core foundations, clean OOP/functional design, safe file/API I/O, and automated test assertions.',
    requirements: [
      'Structure clean modular code with separation of concerns and __main__ guard',
      'Enforce defensive input validation and explicit error handling',
      'Process or persist structured records cleanly (JSON/CSV/document model)',
      'Verify core logic and boundary conditions with automated assertions',
      'Document architecture, setup commands, and future extension hooks cleanly',
    ],
    rubric: [
      { criterion: 'Modular Architecture & Clean Design', weight: 35 },
      { criterion: 'Defensive Validation, Security & I/O Hygiene', weight: 35 },
      { criterion: 'Automated Test Coverage & Documentation', weight: 30 },
    ],
    starterCode: `from dataclasses import dataclass

@dataclass(frozen=True)
class ProjectCheck:
    name: str
    passed: bool

def evaluate_capstone(checks):
    total = len(checks)
    passed = sum(1 for c in checks if c.passed)
    pct = round(100 * passed / total, 1) if total else 0.0
    return {"passed": passed, "total": total, "percent": pct, "ready": pct == 100.0}

checks = [
    ProjectCheck("Modular Architecture", True),
    ProjectCheck("Input Validation", True),
    ProjectCheck("Automated Tests", True),
]
if __name__ == "__main__":
    print(evaluate_capstone(checks))
`,
  },
  dayQuiz: {
    title: 'Day 30 Final Mastery Checkpoint Quiz',
    questions: [
      {
        id: 'day30-q1',
        scenario: 'Avoiding subtle Python mutation bugs in functions.',
        question: 'Why should function signatures use `items=None` instead of `items=[]`?',
        options: [
          { id: 'a', text: 'Default mutable arguments are evaluated once at function definition time and shared across all calls.', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: 'Python raises SyntaxError on `items=[]`.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'c', text: 'None is automatically converted to a tuple.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'd', text: 'Empty lists cannot be appended to.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'day30-q2',
        scenario: 'Fast membership testing across 50,000 IDs.',
        question: 'Which built-in collection provides O(1) average membership checks?',
        options: [
          { id: 'a', text: 'set', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: 'list', explanation: 'Incorrect. list is O(N).', isCorrect: false },
          { id: 'c', text: 'tuple', explanation: 'Incorrect. tuple is O(N).', isCorrect: false },
          { id: 'd', text: 'str', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'day30-q3',
        scenario: 'Writing decorators cleanly.',
        question: 'Why apply `@functools.wraps(fn)` inside a decorator wrapper?',
        options: [
          { id: 'a', text: 'To preserve the decorated function’s original __name__, __doc__, and metadata.', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: 'To make the function run asynchronously.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'c', text: 'To bypass type checking.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'd', text: 'To cache database queries.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'day30-q4',
        scenario: 'Streaming a 5 GB text file without running out of RAM.',
        question: 'Which approach keeps memory usage O(1)?',
        options: [
          { id: 'a', text: 'Iterating line by line with a generator expression inside `with open(...)`.', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: 'Calling `f.read().splitlines()` first.', explanation: 'Incorrect. Loads entire 5 GB file into RAM.', isCorrect: false },
          { id: 'c', text: 'Loading into a Python list comprehension.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'd', text: 'Converting to json.loads() in memory.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'day30-q5',
        scenario: 'Architecting extensible Object-Oriented services.',
        question: 'Why favor composition (`self.notifier = notifier`) over deep inheritance?',
        options: [
          { id: 'a', text: 'It decouples collaborators cleanly and allows swapping real implementations for test fakes.', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: 'Python does not support class inheritance.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'c', text: 'Composition deletes private attributes.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'd', text: 'Inheritance cannot define __init__.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'day30-q6',
        scenario: 'Preventing side effects when unit tests import a module.',
        question: 'Where should CLI script execution be placed?',
        options: [
          { id: 'a', text: 'Inside `if __name__ == "__main__":`.', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: 'At line 1 before imports.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'c', text: 'Inside __init__.py top-level loop.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'd', text: 'Inside README.md.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'day30-q7',
        scenario: 'Mutating filtered rows in Pandas.',
        question: 'Which syntax avoids `SettingWithCopyWarning`?',
        options: [
          { id: 'a', text: 'df.loc[mask, "col"] = value', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: 'df[mask]["col"] = value', explanation: 'Incorrect. Chained assignment.', isCorrect: false },
          { id: 'c', text: 'df.iloc["col"] = value', explanation: 'Incorrect.', isCorrect: false },
          { id: 'd', text: 'df.append(value)', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'day30-q8',
        scenario: 'Returning MongoDB documents from a REST API.',
        question: 'What must happen to `_id` (`ObjectId`) and `created_at` (`datetime`) before `json.dumps()` / `jsonify()`?',
        options: [
          { id: 'a', text: 'Convert _id with str() and datetime with .isoformat() in an explicit allowlist serializer.', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: 'Pass raw PyMongo dicts directly.', explanation: 'Incorrect. Raises TypeError.', isCorrect: false },
          { id: 'c', text: 'Delete _id from MongoDB.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'd', text: 'Encode with base64 in HTML.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'day30-q9',
        scenario: 'Securing PATCH endpoints and POST retries in production APIs.',
        question: 'Which pair protects against mass assignment and duplicate POST charges?',
        options: [
          { id: 'a', text: 'Field allowlists on PATCH + Idempotency-Key caching on POST.', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: 'Passing request.get_json() straight to $set + retrying POST blindly.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'c', text: 'Returning HTML 500 pages.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'd', text: 'Putting API keys in query strings.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'day30-q10',
        scenario: 'Preparing a portfolio repository for engineering review.',
        question: 'Which artifact pair belongs in every reproducible Python repository?',
        options: [
          { id: 'a', text: '.env.example + automated tests alongside README quickstart instructions.', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: 'Committed .env secrets + .venv/ folder.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'c', text: 'Hardcoded database passwords in app.py.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'd', text: 'A single untested script with no dependencies listed.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
    ],
    passingScorePercentage: 80,
  },
  cheatSheet: [
    {
      category: 'Foundations Synthesis: Reference Semantics & Collections',
      syntax: 'def add_item(x, items=None): items = [] if items is None else items.copy()',
      description:
        'Names bind to heap objects rather than copying memory. Never place mutable objects (`[]`, `{}`) in default arguments; choose `set`/`dict` for O(1) membership lookups and `list` for ordered sequences.',
      example: `def record_unique(tag, seen=None, out=None):
    seen = set() if seen is None else set(seen)
    out = [] if out is None else list(out)
    if tag not in seen:
        seen.add(tag)
        out.append(tag)
    return out

print(record_unique("python"), record_unique("api"))`,
    },
    {
      category: 'Functions, Closures & @functools.wraps Decorators',
      syntax: '@functools.wraps(fn)\ndef wrapper(*args, **kwargs): return fn(*args, **kwargs)',
      description:
        'Comprehensions express clean transformations in one pass, generator expressions stream lazily with O(1) memory, and `@functools.wraps` preserves the wrapped function’s `__name__`, `__doc__`, and signature metadata.',
      example: `from functools import wraps

def audit_call(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper

@audit_call
def square(n):
    return n * n

print(square.__name__, square(6))`,
    },
    {
      category: 'OOP Composition, Dataclasses & Special Methods',
      syntax: '@dataclass(frozen=True)\nclass CheckResult:\n    name: str\n    passed: bool',
      description:
        'Favor composition (injecting small collaborator classes via `__init__`) over brittle multi-level inheritance. Use `@dataclass(frozen=True)` for immutable value records with generated `__repr__` and `__eq__`.',
      example: `from dataclasses import dataclass

@dataclass(frozen=True)
class Milestone:
    day: int
    passed: bool

m = Milestone(day=30, passed=True)
print(m)`,
    },
    {
      category: 'Files, Context Managers & Regex Validation',
      syntax: 'with open(path, "r", encoding="utf-8") as fh:\n    data = json.load(fh)',
      description:
        'Always open files via `with` context managers and explicit UTF-8 encoding so handles flush and close even on exceptions. Pre-compile repeated `re.compile()` patterns and read CSV/JSON safely.',
      example: `import re

SLUG_RE = re.compile(r"^[a-z0-9-]+$")
print(bool(SLUG_RE.match("day-30-capstone")), bool(SLUG_RE.match("Bad Slug!")))`,
    },
    {
      category: 'Packaging, .venv Isolation & __main__ Entrypoints',
      syntax: 'python -m venv .venv && pip install -r requirements.txt\nif __name__ == "__main__": main()',
      description:
        'Isolate third-party packages per project inside `.venv` (`venv/` in `.gitignore`) and declare metadata in `pyproject.toml`. Wrap CLI runners under `if __name__ == "__main__":` so importing modules in tests stays side-effect free.',
      example: `def greet(user):
    return f"Ready: {user}"

if __name__ == "__main__":
    print(greet("Day 30 Engineer"))`,
    },
    {
      category: 'Vectorised Pipelines: NumPy & Pandas .loc Hygiene',
      syntax: 'df.loc[df["score"] >= 80, "status"] = "pass"',
      description:
        'Replace nested Python loops with C-level NumPy vectorisation (`np.where`, boolean masks) and update DataFrame slices cleanly with `.loc[row_mask, col]` to avoid `SettingWithCopyWarning`.',
      example: `scores = [72, 85, 91, 64]
statuses = ["pass" if s >= 80 else "review" for s in scores]
print(statuses)`,
    },
    {
      category: 'Resilient HTTP Clients, Retries & Timeouts',
      syntax: 'resp = session.get(url, timeout=(3.0, 10.0))\nresp.raise_for_status()',
      description:
        'Always attach `(connect, read)` timeouts to every outbound request, reuse TCP connections with `requests.Session()`, validate `resp.raise_for_status()`, and honor HTTP `429 Retry-After` headers with jittered exponential backoff.',
      example: `def compute_backoff(attempt, base=0.5, cap=8.0):
    return min(cap, base * (2 ** attempt))

print([compute_backoff(i) for i in range(4)])`,
    },
    {
      category: 'REST APIs, Allowlist PATCH & Idempotency',
      syntax: 'clean = {k: v for k, v in payload.items() if k in ALLOWED_FIELDS}',
      description:
        'Serialize BSON `ObjectId`/`datetime` cleanly, enforce explicit PATCH field allowlists to stop mass assignment, validate payloads (400 vs 422), deduplicate POST retries via `Idempotency-Key`, and clamp `page`/`limit` server-side.',
      example: `ALLOWED = {"name", "track"}
incoming = {"track": "Systems", "role": "admin"}
safe = {k: v for k, v in incoming.items() if k in ALLOWED}
print(safe)`,
    },
    {
      category: 'Automated Testing, Edge Cases & Secret Hygiene',
      syntax: 'URI = os.environ["MONGODB_URI"]  # Never hardcode secrets in source',
      description:
        'Pair happy-path tests with boundary assertions (empty collections, `isinstance(True, int)` booleans, missing keys, mocked HTTP 500s). Keep `.env` untracked and document variables in `.env.example`.',
      example: `def is_valid_int(val):
    return not isinstance(val, bool) and isinstance(val, int)

assert is_valid_int(30) is True
assert is_valid_int(True) is False
print("All edge assertions passed")`,
    },
    {
      category: 'Portfolio Readiness & Post-Day-30 Specializations',
      syntax: 'README.md + pyproject.toml + .env.example + tests/ + clean git history',
      description:
        'Package your 30-day capstone with reproducible setup steps, automated tests, and architectural notes. Branch forward into FastAPI/Pydantic APIs, typed `asyncio`/`httpx`, Polars/scikit-learn ML, or automated CI pipelines.',
      example: `REQUIRED = {"README.md", "pyproject.toml", ".env.example", "tests"}
repo = {"README.md", "pyproject.toml", ".env.example", "tests"}
print("Portfolio ready:", REQUIRED.issubset(repo))`,
    },
  ],
  sourceNotes: [
    'Curriculum reference: https://github.com/Asabeneh/30-Days-Of-Python/tree/master/30_Day_Conclusions',
  ],
};
