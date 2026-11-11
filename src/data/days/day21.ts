/**
 * Day 21: Classes and Objects (Advanced Python)
 * Part A (Learn) conforming to Sections 10, 13.2, and 14 of the Master Specification.
 * Includes:
 *  - 10 Detailed Subtopics following the 10-step pedagogical structure
 *  - 3 Signature Simulations: class-instance-sim, inheritance-mro-sim, dunder-property-sim
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_21_MODULE: DayModule = {
  schemaVersion: 1,
  number: 21,
  title: 'Classes and Objects',
  level: 'advanced',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/21_Day_Classes_and_objects',
  estimatedMinutes: 95,
  prerequisites: [11],
  objectives: [
    'Define Python classes, instantiate objects, and understand how `self` binds to the current instance',
    'Initialize per-instance state cleanly inside `__init__` with default and required parameters',
    'Distinguish class attributes from instance attributes and avoid the mutable class-attribute trap',
    'Use instance methods, `@classmethod` factory constructors, and `@staticmethod` helpers appropriately',
    'Apply encapsulation conventions (`_protected`, `__mangled`) and `@property` getters/setters',
    'Build class hierarchies using single inheritance, method overriding, and `super()`',
    'Predict multiple-inheritance lookup order using C3 Method Resolution Order (`__mro__`)',
    'Design polymorphic interfaces using duck typing and `abc.ABC` abstract base classes',
    'Implement `__str__`, `__repr__`, `__len__`, and `__eq__` for Pythonic objects',
    'Overload operators (`__add__`, `__lt__`) and use `@dataclass` for concise data containers',
  ],
  subtopics: [
    {
      id: 'day21-sub1',
      number: 1,
      title: 'Defining Classes, Instantiating Objects & self',
      summary: 'Model real-world entities as classes and understand how `self` binds methods to each object.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Classes as Blueprints, Objects as Instances',
        paragraphs: [
          'A **class** is a blueprint that bundles data (attributes) and behavior (methods) together. By PEP 8 convention, class names use **`PascalCase`** (e.g., `BankAccount`, `OrderItem`). Calling the class like a function—`acc = BankAccount()`—creates a distinct **instance** (object) in memory.',
          'Every instance method takes **`self`** as its first parameter. When you call `acc.deposit(100)`, Python automatically translates that into `BankAccount.deposit(acc, 100)`, passing `acc` as `self`.',
          'Forgetting `self` in a method signature raises `TypeError: method() takes 0 positional arguments but 1 was given` because Python always passes the instance automatically.',
        ],
        keyTerms: [
          {
            term: 'Class vs Instance',
            definition: 'A class is the blueprint; an instance is a concrete object created from that class.',
          },
          {
            term: 'self',
            definition: 'First parameter of an instance method, bound automatically to the calling object.',
          },
        ],
        bulletPoints: [
          'Use `isinstance(obj, MyClass)` to check if an object is an instance of a class (or subclass).',
          'Each instance has its own `id(obj)` and `__dict__` namespace.',
        ],
      },
      visualise: {
        type: 'class-instance-sim',
        title: 'Class Blueprint & self Binding Inspector',
        badge: 'simulation',
        description: 'Inspect how instances get separate __dict__ namespaces and how self binds on method calls.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Defining a Class and Binding self',
          runMode: 'real',
          code: `class Greeter:
    def greet(self, name: str) -> str:
        return f"Hello, {name}!"

g1 = Greeter()
g2 = Greeter()
print(g1.greet("Ada"))
print("Same object?", g1 is g2, "| isinstance:", isinstance(g1, Greeter))`,
          expectedOutput: `Hello, Ada!
Same object? False | isinstance: True`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 5,
          instruction: 'g1 = Greeter(); g2 = Greeter()',
          internalEffect: 'Allocates two independent Greeter instances in memory.',
        },
        {
          step: 2,
          codeLine: 7,
          instruction: 'g1.greet("Ada")',
          internalEffect: 'Calls Greeter.greet(g1, "Ada"), returning "Hello, Ada!".',
        },
      ],
      apply: {
        domain: 'Domain Modeling',
        contextTitle: 'Modeling a Stateless Tax Calculator',
        scenario: 'Create a simple class with a method that computes VAT on a price.',
        code: `class TaxCalc:
    def add_vat(self, amount: float) -> float:
        return round(amount * 1.075, 2)

calc = TaxCalc()
print("With VAT:", calc.add_vat(1000))`,
        outcome: 'With VAT: 1075.0',
      },
      commonMistakes: [
        {
          label: 'Omitting self from Method Definition',
          erroneousCode: `class Counter:
    def ping():
        return "pong"
# Counter().ping()  # TypeError: takes 0 positional arguments but 1 was given!`,
          errorMessage: 'TypeError: Counter.ping() takes 0 positional arguments but 1 was given',
          explanation: 'Python passes the instance as the first argument to every instance method.',
          correctedCode: `class Counter:
    def ping(self):
        return "pong"`,
        },
      ],
      sourceNotes: 'Covers class definitions, instantiation, and self for Day 21.',
      practise: [
        {
          id: 'd21-s1-ex1',
          title: 'Scenario: Missing self in Method Signature',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'POS Terminal Ping',
          prompt: 'Calling `Terminal().ping()` raises `TypeError: Terminal.ping() takes 0 positional arguments but 1 was given`. Why?',
          options: [
            { id: 'opt-1', text: 'Python automatically passes the instance as the first argument (`self`), but `def ping():` omitted `self`.', explanation: 'Correct!', isCorrect: true },
            { id: 'opt-2', text: 'Terminal() cannot be called without arguments.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'Methods must be decorated with @property.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'Python 3 requires return type hints on methods.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'What does Terminal().ping() translate to internally?',
            'Terminal.ping(instance).',
            'Add self as the first parameter.',
          ],
        },
        {
          id: 'd21-s1-ex2',
          title: 'Fix the Bug: Add self to Instance Method',
          type: 'fix-the-bug',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Warehouse Scanner',
          prompt: 'Fix `Scanner.label` so `Scanner().label("SKU-9")` prints `"SCAN:SKU-9"`.',
          starterCode: `class Scanner:
    def label(code: str) -> str:
        return f"SCAN:{code}"

print(Scanner().label("SKU-9"))`,
          solutionCode: `class Scanner:
    def label(self, code: str) -> str:
        return f"SCAN:{code}"

print(Scanner().label("SKU-9"))`,
          testCases: [
            { id: 'tc-1', label: 'Prints SCAN:SKU-9', setup: '', expected: 'SCAN:SKU-9', hidden: false },
          ],
          hints: [
            'Add self before code.',
            'def label(self, code: str) -> str:',
            'Prints SCAN:SKU-9.',
          ],
        },
        {
          id: 'd21-s1-ex3',
          title: 'Write Code: Distinct Instances Check',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'Session Factory',
          prompt: 'Define an empty `Session` class, create `s1 = Session()` and `s2 = Session()`, and print `s1 is s2, isinstance(s1, Session)`.',
          starterCode: `# Define Session, instantiate s1 and s2, print (s1 is s2, isinstance(s1, Session))
`,
          solutionCode: `class Session:
    pass

s1 = Session()
s2 = Session()
print(s1 is s2, isinstance(s1, Session))`,
          testCases: [
            { id: 'tc-1', label: 'Prints False True', setup: '', expected: 'False True', hidden: false },
          ],
          hints: [
            'class Session: pass',
            'print(s1 is s2, isinstance(s1, Session)).',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day21-sub2',
      number: 2,
      title: 'The __init__ Constructor & Instance Attributes',
      summary: 'Initialize per-object state automatically when an instance is created via __init__.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Initializing State with __init__',
        paragraphs: [
          'The special dunder method **`__init__(self, ...)`** is Python’s initializer. Python calls it automatically right after creating a new object so you can attach per-instance attributes via `self.attr = value`.',
          'Just like regular functions, `__init__` supports positional arguments, keyword arguments, type hints, and default values (e.g., `balance: float = 0.0`).',
          'Note that `__init__` must **return `None`** (do not `return self` or any value, or Python raises `TypeError: __init__() should return None`).',
        ],
        keyTerms: [
          {
            term: '__init__(self, ...)',
            definition: 'Initializer method invoked automatically upon instantiation to set instance attributes.',
          },
        ],
        bulletPoints: [
          '`__init__` must not return a non-`None` value.',
          'Validate constructor arguments inside `__init__` to prevent invalid objects from ever being created.',
        ],
      },
      visualise: {
        type: 'class-instance-sim',
        title: '__init__ & Instance __dict__ State',
        badge: 'simulation',
        description: 'Inspect how __init__ populates separate __dict__ state per object.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Initializing Independent Instance State in __init__',
          runMode: 'real',
          code: `class Wallet:
    def __init__(self, owner: str, balance: float = 0.0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount: float) -> None:
        self.balance += amount

w1 = Wallet("Ada", 500)
w2 = Wallet("Tunde")
w1.deposit(250)
print(w1.owner, w1.balance, "|", w2.owner, w2.balance)`,
          expectedOutput: `Ada 750 | Tunde 0.0`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'def __init__(self, owner: str, balance: float = 0.0):',
          internalEffect: 'Sets owner and defaults balance to 0.0 if omitted.',
        },
        {
          step: 2,
          codeLine: 11,
          instruction: 'w1.deposit(250)',
          internalEffect: 'Mutates w1.balance to 750 while w2.balance stays 0.0.',
        },
      ],
      apply: {
        domain: 'E-Commerce',
        contextTitle: 'Order Line Item with Computed Subtotal',
        scenario: 'Initialize sku, qty, and unit_price in __init__ and compute line total.',
        code: `class LineItem:
    def __init__(self, sku: str, qty: int, price: float):
        self.sku = sku
        self.qty = qty
        self.price = price

    def total(self) -> float:
        return self.qty * self.price

item = LineItem("BOOK-01", 3, 15.0)
print("Total:", item.total())`,
        outcome: 'Total: 45.0',
      },
      commonMistakes: [
        {
          label: 'Returning a Value from __init__',
          erroneousCode: `class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y
        return self  # TypeError!`,
          errorMessage: 'TypeError: __init__() should return None, not "Point"',
          explanation: '__init__ mutates self in place and must implicitly or explicitly return None.',
          correctedCode: `class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y`,
        },
      ],
      sourceNotes: 'Covers __init__ and instance attributes for Day 21.',
      practise: [
        {
          id: 'd21-s2-ex1',
          title: 'Theory: Why __init__ Must Return None',
          type: 'theory-reasoning',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Constructor Return Error',
          prompt: 'A developer writes `return self` at the end of `__init__` and gets `TypeError: __init__() should return None`. Why?',
          options: [
            { id: 'opt-1', text: '__init__ initializes an already-created object in place and is required by Python to return None.', explanation: 'Correct!', isCorrect: true },
            { id: 'opt-2', text: 'self does not exist inside __init__.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: '__init__ is a staticmethod.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'Only @dataclass can return self.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Does __init__ create the object or initialize self in place?',
            'Python rejects any non-None return value from __init__.',
          ],
        },
        {
          id: 'd21-s2-ex2',
          title: 'Predict Output: Independent Instance Balances',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Ledger Account Isolation',
          prompt: 'What does this code print?\n```python\nclass Ledger:\n    def __init__(self, bal=10):\n        self.bal = bal\na = Ledger(50)\nb = Ledger()\na.bal += 25\nprint(a.bal, b.bal)\n```',
          options: [
            { id: 'opt-1', text: '75 10', explanation: 'Correct! a and b have separate self.bal attributes.', isCorrect: true },
            { id: 'opt-2', text: '75 75', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: '50 10', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'Raises TypeError', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'b uses default bal=10.',
            'Mutating a.bal does not affect b.bal.',
            '75 10.',
          ],
        },
        {
          id: 'd21-s2-ex3',
          title: 'Write Code: Meter Reading Tracker',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'Smart Meter Billing',
          prompt: 'Create `Meter` with `__init__(self, unit_id: str, kwh: int = 0)` and `add(self, delta: int)`. Instantiate `m = Meter("M1", 100)`, call `m.add(45)`, and print `m.unit_id, m.kwh`.',
          starterCode: `# Define Meter with __init__ and add, then print m.unit_id, m.kwh
`,
          solutionCode: `class Meter:
    def __init__(self, unit_id: str, kwh: int = 0):
        self.unit_id = unit_id
        self.kwh = kwh

    def add(self, delta: int) -> None:
        self.kwh += delta

m = Meter("M1", 100)
m.add(45)
print(m.unit_id, m.kwh)`,
          testCases: [
            { id: 'tc-1', label: 'Prints M1 145', setup: '', expected: 'M1 145', hidden: false },
          ],
          hints: [
            'Store self.unit_id and self.kwh in __init__.',
            'Increment self.kwh += delta in add().',
            'Prints M1 145.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day21-sub3',
      number: 3,
      title: 'Class Attributes vs. Instance Attributes & the Mutable Trap',
      summary: 'Share constants across instances safely and avoid accidental mutable state sharing.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Namespace Lookup Order & Shared State',
        paragraphs: [
          'Attributes defined directly in the class body (outside `__init__`) are **class attributes**—they live on the class itself and are shared by all instances. When you read `obj.attr`, Python checks `obj.__dict__` first, and only falls back to `Class.__dict__` if not found.',
          'Assigning `obj.attr = new_val` creates or updates an **instance attribute** on `obj` alone, shadowing the class attribute without changing it for other instances.',
          'Watch out for the **mutable class attribute trap**: if you write `items = []` on the class body and call `self.items.append(x)`, every instance mutates the **exact same list**! Always initialize mutable collections (`self.items = []`) inside `__init__`.',
        ],
        keyTerms: [
          {
            term: 'Class Attribute',
            definition: 'Attribute defined in the class body and shared by all instances unless shadowed.',
          },
          {
            term: 'Mutable Class Attribute Trap',
            definition: 'Defining a list/dict on the class body causes all instances to share and mutate the same collection.',
          },
        ],
        bulletPoints: [
          'Class attributes are great for constants (`TAX_RATE = 0.075`) or instance counters (`User.count += 1`).',
          'Never initialize per-object lists or dicts on the class body.',
        ],
      },
      visualise: {
        type: 'class-instance-sim',
        title: 'Shadowing & Mutable Class Attribute Trap',
        badge: 'simulation',
        description: 'Inspect how class vs instance lookup works and why mutable class lists leak across instances.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Class Counter vs Per-Instance Mutable List',
          runMode: 'real',
          code: `class Cart:
    discount_rate = 0.10  # Shared immutable constant
    total_carts = 0

    def __init__(self, user: str):
        self.user = user
        self.items = []  # Fresh list per instance!
        Cart.total_carts += 1

c1 = Cart("Ada")
c2 = Cart("Tunde")
c1.items.append("Laptop")
print("c1 items:", c1.items, "| c2 items:", c2.items, "| total:", Cart.total_carts)`,
          expectedOutput: `c1 items: ['Laptop'] | c2 items: [] | total: 2`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 7,
          instruction: 'self.items = []',
          internalEffect: 'Creates a distinct list inside each Cart instance’s __dict__.',
        },
        {
          step: 2,
          codeLine: 8,
          instruction: 'Cart.total_carts += 1',
          internalEffect: 'Increments the shared class-level counter on Cart itself.',
        },
      ],
      apply: {
        domain: 'Configuration',
        contextTitle: 'Per-Instance Override of a Default Class Setting',
        scenario: 'Override a class-level timeout for one specific client instance.',
        code: `class ApiClient:
    timeout = 5

fast = ApiClient()
slow = ApiClient()
slow.timeout = 30
print("fast:", fast.timeout, "| slow:", slow.timeout, "| class:", ApiClient.timeout)`,
        outcome: 'fast: 5 | slow: 30 | class: 5',
      },
      commonMistakes: [
        {
          label: 'Putting a Mutable List Directly on the Class Body',
          erroneousCode: `class Team:
    members = []  # Shared across ALL Team instances!
a = Team(); b = Team()
a.members.append("Ada")
print(b.members)  # ['Ada'] — unintended leak!`,
          errorMessage: 'State leak bug: mutating a.members also mutates b.members',
          explanation: 'Move `self.members = []` inside `__init__` so each Team gets its own list.',
          correctedCode: `class Team:
    def __init__(self):
        self.members = []`,
        },
      ],
      sourceNotes: 'Covers class vs instance attributes and mutable trap.',
      practise: [
        {
          id: 'd21-s3-ex1',
          title: 'Explain the Trace: Mutable Class Attribute Leak',
          type: 'explain-the-trace',
          tier: 'standard',
          points: 15,
          contextScenario: 'Shopping Cart Cross-User Leak',
          prompt: 'In `class Bag: items = []`, `b1 = Bag(); b2 = Bag(); b1.items.append("pen")` causes `b2.items` to become `["pen"]`. Why?',
          options: [
            { id: 'opt-1', text: '`items` is a class attribute pointing to one shared list; `.append()` mutates that single list in place for all instances.', explanation: 'Correct! Initialize `self.items = []` inside `__init__`.', isCorrect: true },
            { id: 'opt-2', text: 'b1 and b2 are aliases to the same Bag instance.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'append() always broadcasts to all objects.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'Lists cannot be stored on instances.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Where does `items` live if defined on the class body?',
            'Does `.append()` rebind `b1.items` or mutate `Bag.items`?',
            'Shared class list.',
          ],
        },
        {
          id: 'd21-s3-ex2',
          title: 'Fix the Bug: Isolate Per-Instance Queue',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 15,
          contextScenario: 'Job Queue Isolation',
          prompt: 'Fix `Worker` so `w1.jobs` and `w2.jobs` are independent lists and `print(w1.jobs, w2.jobs)` outputs `[\'task1\'] []`.',
          starterCode: `class Worker:
    jobs = []

w1 = Worker()
w2 = Worker()
w1.jobs.append("task1")
print(w1.jobs, w2.jobs)`,
          solutionCode: `class Worker:
    def __init__(self):
        self.jobs = []

w1 = Worker()
w2 = Worker()
w1.jobs.append("task1")
print(w1.jobs, w2.jobs)`,
          testCases: [
            { id: 'tc-1', label: "Prints ['task1'] []", setup: '', expected: "['task1'] []", hidden: false },
          ],
          hints: [
            'Move jobs into __init__ as self.jobs = [].',
            "['task1'] [].",
          ],
        },
        {
          id: 'd21-s3-ex3',
          title: 'Write Code: Class Instance Counter',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'Active Connection Counter',
          prompt: 'Create `Conn` with a class attribute `count = 0` that increments in `__init__`. Instantiate 3 `Conn()` objects and print `Conn.count`.',
          starterCode: `# Define Conn with class attribute count = 0 incremented in __init__
`,
          solutionCode: `class Conn:
    count = 0
    def __init__(self):
        Conn.count += 1

for _ in range(3):
    Conn()
print(Conn.count)`,
          testCases: [
            { id: 'tc-1', label: 'Prints 3', setup: '', expected: '3', hidden: false },
          ],
          hints: [
            'Increment Conn.count += 1 inside __init__.',
            'Prints 3.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day21-sub4',
      number: 4,
      title: 'Instance Methods, @classmethod & @staticmethod',
      summary: 'Choose between instance methods (self), class methods (cls), and stateless static methods.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Three Kinds of Methods on a Class',
        paragraphs: [
          '**Instance methods** receive `self` and read or mutate a specific object’s state. **`@classmethod`** receives **`cls`** (the class itself) as its first argument—making it ideal for **alternative factory constructors** like `Date.from_iso("2026-11-10")` that still work cleanly with subclasses.',
          '**`@staticmethod`** receives neither `self` nor `cls`. It behaves like a plain utility function namespaced inside the class because it logically belongs to that domain (e.g., `Date.is_leap_year(2024)`).',
        ],
        keyTerms: [
          {
            term: '@classmethod',
            definition: 'Method receiving `cls` instead of `self`; commonly used for factory constructors.',
          },
          {
            term: '@staticmethod',
            definition: 'Utility function attached to a class namespace that takes neither `self` nor `cls`.',
          },
        ],
        bulletPoints: [
          'Use `cls(...)` inside `@classmethod` instead of hardcoding the class name so inheritance works automatically.',
          'Both `@classmethod` and `@staticmethod` can be called directly on the class (`MyClass.helper()`).',
        ],
      },
      visualise: {
        type: 'dunder-property-sim',
        title: '@classmethod & @staticmethod Inspector',
        badge: 'simulation',
        description: 'Compare how instance, class, and static methods receive arguments.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Factory @classmethod and Helper @staticmethod',
          runMode: 'real',
          code: `class Record:
    def __init__(self, name: str, score: int):
        self.name = name
        self.score = score

    @classmethod
    def from_csv_row(cls, row: str):
        name, score = row.split(",")
        return cls(name.strip(), int(score))

    @staticmethod
    def is_passing(score: int) -> bool:
        return score >= 70

r = Record.from_csv_row("Ada, 92")
print(r.name, r.score, "| Passing:", Record.is_passing(r.score))`,
          expectedOutput: `Ada 92 | Passing: True`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 7,
          instruction: 'def from_csv_row(cls, row: str):',
          internalEffect: 'Receives Record as cls, parses the CSV string, and returns cls(...).',
        },
        {
          step: 2,
          codeLine: 12,
          instruction: 'def is_passing(score: int) -> bool:',
          internalEffect: 'Pure utility check needing neither self nor cls.',
        },
      ],
      apply: {
        domain: 'Data Parsing',
        contextTitle: 'Constructing Config Objects from Dicts',
        scenario: 'Add a from_dict @classmethod constructor to a ServiceConfig class.',
        code: `class ServiceConfig:
    def __init__(self, host: str, port: int):
        self.host, self.port = host, port

    @classmethod
    def from_dict(cls, d: dict):
        return cls(d["host"], int(d["port"]))

cfg = ServiceConfig.from_dict({"host": "localhost", "port": "8080"})
print(cfg.host, cfg.port)`,
        outcome: 'localhost 8080',
      },
      commonMistakes: [
        {
          label: 'Forgetting @staticmethod When Omitting self',
          erroneousCode: `class MathBox:
    def double(x):  # Missing @staticmethod!
        return x * 2
# MathBox().double(5)  # TypeError: takes 1 positional argument but 2 were given`,
          errorMessage: 'TypeError: MathBox.double() takes 1 positional argument but 2 were given',
          explanation: 'Calling an undecorated method on an instance passes self automatically; add @staticmethod.',
          correctedCode: `class MathBox:
    @staticmethod
    def double(x):
        return x * 2`,
        },
      ],
      sourceNotes: 'Covers instance, classmethod, and staticmethod.',
      practise: [
        {
          id: 'd21-s4-ex1',
          title: 'Fill the Gaps: Factory @classmethod & Utility @staticmethod',
          type: 'fill-the-gaps',
          tier: 'standard',
          points: 15,
          contextScenario: 'Token Parser',
          prompt: 'Complete the decorators for the factory constructor `from_str` and stateless helper `is_valid`.',
          gaps: [
            { id: 'g-1', beforeText: '@', afterText: '\ndef from_str(cls, raw): return cls(raw.strip())', correctAnswer: 'classmethod', options: ['classmethod', 'staticmethod', 'property', 'dataclass'] },
            { id: 'g-2', beforeText: '@', afterText: '\ndef is_valid(s): return len(s) > 0', correctAnswer: 'staticmethod', options: ['staticmethod', 'classmethod', 'property', 'abstractmethod'] },
          ],
          hints: [
            'from_str receives cls -> @classmethod.',
            'is_valid receives neither self nor cls -> @staticmethod.',
          ],
        },
        {
          id: 'd21-s4-ex2',
          title: 'Predict Output: Subclass Calling Inherited @classmethod',
          type: 'predict-output',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Polymorphic Factory Method',
          prompt: 'What does this code print?\n```python\nclass Base:\n    @classmethod\n    def create(cls):\n        return cls.__name__\nclass Sub(Base):\n    pass\nprint(Sub.create())\n```',
          options: [
            { id: 'opt-1', text: 'Sub', explanation: 'Correct! @classmethod receives the actual subclass `Sub` as `cls`.', isCorrect: true },
            { id: 'opt-2', text: 'Base', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'object', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'Raises TypeError', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'What is `cls` when Sub.create() is called?',
            'Sub.',
          ],
        },
        {
          id: 'd21-s4-ex3',
          title: 'Write Code: Parsing Pair with @classmethod',
          type: 'write-code',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Key-Value Pair Loader',
          prompt: 'Create `Setting(key, val)` with `@classmethod def parse(cls, raw: str)` splitting on `"="`. Call `s = Setting.parse("PORT=9000")` and print `s.key, s.val`.',
          starterCode: `# Define Setting with __init__ and @classmethod parse(cls, raw)
`,
          solutionCode: `class Setting:
    def __init__(self, key: str, val: str):
        self.key = key
        self.val = val

    @classmethod
    def parse(cls, raw: str):
        k, v = raw.split("=")
        return cls(k.strip(), v.strip())

s = Setting.parse("PORT=9000")
print(s.key, s.val)`,
          testCases: [
            { id: 'tc-1', label: 'Prints PORT 9000', setup: '', expected: 'PORT 9000', hidden: false },
          ],
          hints: [
            'Split raw on "=" and return cls(k.strip(), v.strip()).',
            'Prints PORT 9000.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day21-sub5',
      number: 5,
      title: 'Encapsulation, Name Mangling (__attr) & @property',
      summary: 'Protect internal invariants using _private conventions, __name mangling, and @property validation.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Pythonic Encapsulation with @property',
        paragraphs: [
          'Python trusts developers with a single leading underscore **`_attr`** (“internal/protected by convention”). A double leading underscore **`__attr`** (without trailing underscores) triggers **name mangling** to `_ClassName__attr`, helping avoid accidental attribute collisions in subclasses.',
          'Rather than writing Java-style `get_balance()` / `set_balance()` methods, Python uses **`@property`** and **`@attr.setter`**. Callers keep clean dot-access (`acc.balance = 500`), while your setter validates invariants behind the scenes.',
          'If you define `@property` without a setter, the attribute becomes **read-only**—trying to assign to it raises `AttributeError`.',
        ],
        keyTerms: [
          {
            term: '@property',
            definition: 'Decorator turning a getter method into a computed or validated attribute.',
          },
          {
            term: 'Name Mangling (__attr)',
            definition: 'Rewrites __attr inside ClassName to _ClassName__attr to prevent subclass collisions.',
          },
        ],
        bulletPoints: [
          'Store the backing value in `self._attr` (not `self.attr`) inside `@property` to avoid infinite recursion!',
          'Use `@property` without `@attr.setter` for read-only computed attributes like `rect.area`.',
        ],
      },
      visualise: {
        type: 'dunder-property-sim',
        title: '@property Getter & Setter Validation',
        badge: 'simulation',
        description: 'See how @property intercepts attribute reads and writes for validation.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Validated Balance via @property and @balance.setter',
          runMode: 'real',
          code: `class BankAccount:
    def __init__(self, balance: float):
        self.balance = balance  # Goes through setter!

    @property
    def balance(self) -> float:
        return self._balance

    @balance.setter
    def balance(self, value: float) -> None:
        if value < 0:
            raise ValueError("Balance cannot be negative")
        self._balance = value

acc = BankAccount(100)
try:
    acc.balance = -50
except ValueError as err:
    print("Blocked:", err, "| Current:", acc.balance)`,
          expectedOutput: `Blocked: Balance cannot be negative | Current: 100`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'self.balance = balance',
          internalEffect: 'Triggers @balance.setter even during __init__ so negative initial balances are also rejected.',
        },
        {
          step: 2,
          codeLine: 13,
          instruction: 'self._balance = value',
          internalEffect: 'Stores the validated number in the internal _balance backing attribute.',
        },
      ],
      apply: {
        domain: 'Geometry',
        contextTitle: 'Read-Only Computed Property',
        scenario: 'Expose area as a read-only @property on a Circle class.',
        code: `class Circle:
    def __init__(self, radius: float):
        self.radius = radius

    @property
    def area(self) -> float:
        return round(3.14159 * self.radius ** 2, 2)

c = Circle(10)
print("Area:", c.area)`,
        outcome: 'Area: 314.16',
      },
      commonMistakes: [
        {
          label: 'Infinite Recursion in @property Getter/Setter',
          erroneousCode: `class Box:
    @property
    def size(self):
        return self.size  # Calls getter recursively -> RecursionError!`,
          errorMessage: 'RecursionError: maximum recursion depth exceeded',
          explanation: 'Inside a @property getter or setter, always read/write the backing attribute `self._size`.',
          correctedCode: `class Box:
    @property
    def size(self):
        return self._size`,
        },
      ],
      sourceNotes: 'Covers encapsulation, name mangling, and @property.',
      practise: [
        {
          id: 'd21-s5-ex1',
          title: 'Fix the Bug: Infinite Recursion in @property',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 15,
          contextScenario: 'Sensor Threshold Property',
          prompt: 'Fix `Sensor` so `self._limit` is used as the backing attribute, avoiding `RecursionError`, and `Sensor(50).limit` prints `50`.',
          starterCode: `class Sensor:
    def __init__(self, limit: int):
        self.limit = limit

    @property
    def limit(self) -> int:
        return self.limit

    @limit.setter
    def limit(self, v: int) -> None:
        self.limit = v

print(Sensor(50).limit)`,
          solutionCode: `class Sensor:
    def __init__(self, limit: int):
        self.limit = limit

    @property
    def limit(self) -> int:
        return self._limit

    @limit.setter
    def limit(self, v: int) -> None:
        self._limit = v

print(Sensor(50).limit)`,
          testCases: [
            { id: 'tc-1', label: 'Prints 50', setup: '', expected: '50', hidden: false },
          ],
          hints: [
            'Reading/writing self.limit inside the property calls the property itself!',
            'Use self._limit as the backing field.',
            'Prints 50.',
          ],
        },
        {
          id: 'd21-s5-ex2',
          title: 'Scenario: Read-Only Computed @property',
          type: 'scenario-mcq',
          tier: 'standard',
          points: 15,
          contextScenario: 'Invoice Total Protection',
          prompt: 'You define `@property def area(self): return self.w * self.h` without an `@area.setter`. What happens if a caller runs `rect.area = 100`?',
          options: [
            { id: 'opt-1', text: 'Python raises `AttributeError` because the property has no setter (read-only).', explanation: 'Correct!', isCorrect: true },
            { id: 'opt-2', text: 'Python silently creates an instance attribute `area` shadowing the property.', explanation: 'Incorrect. Properties are data descriptors.', isCorrect: false },
            { id: 'opt-3', text: 'Python updates `self.w` automatically.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'Python raises `ValueError`.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'What happens when assigning to a @property with no @setter?',
            'AttributeError.',
          ],
        },
        {
          id: 'd21-s5-ex3',
          title: 'Write Code: Validated Percentage @property',
          type: 'write-code',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Discount Rate Validator',
          prompt: 'Create `Promo(pct)` with a `@property` `pct` whose setter raises `ValueError` if `not (0 <= v <= 100)`. Print `Promo(20).pct`.',
          starterCode: `# Define Promo with validated @property pct (0..100)
`,
          solutionCode: `class Promo:
    def __init__(self, pct: int):
        self.pct = pct

    @property
    def pct(self) -> int:
        return self._pct

    @pct.setter
    def pct(self, v: int) -> None:
        if not (0 <= v <= 100):
            raise ValueError("Out of range")
        self._pct = v

print(Promo(20).pct)`,
          testCases: [
            { id: 'tc-1', label: 'Prints 20', setup: '', expected: '20', hidden: false },
          ],
          hints: [
            'Assign self.pct = pct in __init__ so validation runs on construction.',
            'Store in self._pct inside @pct.setter.',
            'Prints 20.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day21-sub6',
      number: 6,
      title: 'Single Inheritance, Method Overriding & super()',
      summary: 'Reuse and extend parent class behavior cleanly using inheritance and super().',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Extending Behavior Without Copy-Pasting',
        paragraphs: [
          'A **subclass** inherits all attributes and methods from its **parent (base) class**: `class Manager(Employee):`. When the subclass defines a method with the same name as the parent, it **overrides** the parent’s implementation.',
          'To extend—rather than completely replace—the parent’s `__init__` or method, call **`super().method(...)`**. `super()` delegates to the parent class cleanly without hardcoding the parent’s name.',
          'Use `issubclass(Manager, Employee)` to check class hierarchy relationships and `isinstance(m, Employee)` (which returns `True` for subclass instances too).',
        ],
        keyTerms: [
          {
            term: 'super()',
            definition: 'Returns a proxy object delegating method calls to the next class in the MRO.',
          },
          {
            term: 'Method Overriding',
            definition: 'Redefining an inherited method in a subclass to customize its behavior.',
          },
        ],
        bulletPoints: [
          'Always call `super().__init__(...)` when overriding `__init__` so parent attributes get initialized.',
          'Prefer composition (“has-a”) over inheritance (“is-a”) when there is no true subtype relationship.',
        ],
      },
      visualise: {
        type: 'inheritance-mro-sim',
        title: 'Single Inheritance & super() Chaining',
        badge: 'simulation',
        description: 'Trace how method overriding and super().__init__() execute across parent and child classes.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Extending Parent __init__ and Methods with super()',
          runMode: 'real',
          code: `class Employee:
    def __init__(self, name: str, base_pay: int):
        self.name = name
        self.base_pay = base_pay

    def total_pay(self) -> int:
        return self.base_pay

class Manager(Employee):
    def __init__(self, name: str, base_pay: int, bonus: int):
        super().__init__(name, base_pay)
        self.bonus = bonus

    def total_pay(self) -> int:
        return super().total_pay() + self.bonus

m = Manager("Ada", 5000, 1200)
print(m.name, m.total_pay(), "| is Employee?", isinstance(m, Employee))`,
          expectedOutput: `Ada 6200 | is Employee? True`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 11,
          instruction: 'super().__init__(name, base_pay)',
          internalEffect: 'Initializes self.name and self.base_pay via Employee.__init__.',
        },
        {
          step: 2,
          codeLine: 15,
          instruction: 'return super().total_pay() + self.bonus',
          internalEffect: 'Reuses Employee.total_pay() (5000) and adds Manager’s bonus (1200).',
        },
      ],
      apply: {
        domain: 'Logging',
        contextTitle: 'Specialized Timestamped Logger Subclass',
        scenario: 'Override format() in a subclass while reusing the base formatter via super().',
        code: `class BaseLogger:
    def format(self, msg: str) -> str:
        return f"[LOG] {msg}"

class TagLogger(BaseLogger):
    def format(self, msg: str) -> str:
        return f"{super().format(msg)} #prod"

print(TagLogger().format("started"))`,
        outcome: '[LOG] started #prod',
      },
      commonMistakes: [
        {
          label: 'Forgetting super().__init__() in Subclass',
          erroneousCode: `class Animal:
    def __init__(self, name): self.name = name
class Dog(Animal):
    def __init__(self, name, breed):
        self.breed = breed  # Forgot super().__init__(name)!
# Dog("Rex", "Lab").name  # AttributeError: 'Dog' object has no attribute 'name'`,
          errorMessage: "AttributeError: 'Dog' object has no attribute 'name'",
          explanation: 'Overriding __init__ replaces the parent’s __init__; call super().__init__(name) explicitly.',
          correctedCode: `class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)
        self.breed = breed`,
        },
      ],
      sourceNotes: 'Covers single inheritance, overriding, and super().',
      practise: [
        {
          id: 'd21-s6-ex1',
          title: 'Order the Lines: Subclass with super().__init__()',
          type: 'order-the-lines',
          tier: 'standard',
          points: 15,
          contextScenario: 'Vehicle Hierarchy',
          prompt: 'Arrange the lines so `EV(Vehicle)` initializes `brand` via `super().__init__()` and adds `kwh`.',
          jumbledLines: [
            { id: 'l3', code: 'class EV(Vehicle):', indent: 0 },
            { id: 'l1', code: 'class Vehicle:', indent: 0 },
            { id: 'l5', code: '        super().__init__(brand)', indent: 0 },
            { id: 'l2', code: '    def __init__(self, brand): self.brand = brand', indent: 0 },
            { id: 'l4', code: '    def __init__(self, brand, kwh):', indent: 0 },
            { id: 'l6', code: '        self.kwh = kwh', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'],
          hints: [
            'Define Vehicle first.',
            'Then define EV(Vehicle) and its __init__.',
            'Call super().__init__(brand) before self.kwh = kwh.',
          ],
        },
        {
          id: 'd21-s6-ex2',
          title: 'Predict Output: Method Overriding + super()',
          type: 'predict-output',
          tier: 'standard',
          points: 15,
          contextScenario: 'Fee Pipeline',
          prompt: 'What does this code print?\n```python\nclass Base:\n    def fee(self): return 10\nclass Vip(Base):\n    def fee(self): return super().fee() + 5\nprint(Vip().fee())\n```',
          options: [
            { id: 'opt-1', text: '15', explanation: 'Correct! super().fee() returns 10, plus 5 equals 15.', isCorrect: true },
            { id: 'opt-2', text: '10', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: '5', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'RecursionError', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'super().fee() calls Base.fee().',
            '10 + 5 = 15.',
          ],
        },
        {
          id: 'd21-s6-ex3',
          title: 'Write Code: Extending Parent Method with super()',
          type: 'write-code',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Audit Prefix Formatter',
          prompt: 'Create `BaseFmt` with `fmt(self, s)` returning `s.upper()`, and `BracketFmt(BaseFmt)` overriding `fmt(self, s)` to return `f"[{super().fmt(s)}]"` . Print `BracketFmt().fmt("ok")`.',
          starterCode: `# Define BaseFmt and BracketFmt using super().fmt(s)
`,
          solutionCode: `class BaseFmt:
    def fmt(self, s: str) -> str:
        return s.upper()

class BracketFmt(BaseFmt):
    def fmt(self, s: str) -> str:
        return f"[{super().fmt(s)}]"

print(BracketFmt().fmt("ok"))`,
          testCases: [
            { id: 'tc-1', label: 'Prints [OK]', setup: '', expected: '[OK]', hidden: false },
          ],
          hints: [
            'Call super().fmt(s) inside BracketFmt.fmt.',
            'Prints [OK].',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day21-sub7',
      number: 7,
      title: 'Multiple Inheritance & Method Resolution Order (__mro__)',
      summary: 'Understand how Python linearizes diamond hierarchies with C3 MRO and cooperative super().',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Navigating Diamond Hierarchies with C3 MRO',
        paragraphs: [
          'Python supports **multiple inheritance** (`class D(B, C):`), often used for small **mixin** classes (like `JsonMixin`, `LoggingMixin`). When `B` and `C` both inherit from `A`, you get a **diamond hierarchy**.',
          'Python determines method lookup order using **C3 Linearization**, accessible via **`D.__mro__`** or **`D.mro()`**. The key rules: subclasses always come before parents, and base classes stay in left-to-right order (`D -> B -> C -> A -> object`).',
          'Because `super()` follows `__mro__` (not just the direct parent), using `super()` cooperatively across `B` and `C` ensures shared base `A` is called **only once**.',
        ],
        keyTerms: [
          {
            term: '__mro__ (Method Resolution Order)',
            definition: 'Tuple of classes Python searches left-to-right when resolving an attribute or method.',
          },
        ],
        bulletPoints: [
          'Inspect any class’s lookup order with `[c.__name__ for c in MyClass.__mro__]`.',
          'Keep mixins small and focused on one capability to avoid complex diamond graphs.',
        ],
      },
      visualise: {
        type: 'inheritance-mro-sim',
        title: 'Diamond Hierarchy & C3 MRO Visualizer',
        badge: 'simulation',
        description: 'Inspect how C3 linearization orders D(B, C) when both B and C inherit from A.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Inspecting __mro__ on a Diamond Hierarchy',
          runMode: 'real',
          code: `class A:
    def who(self): return "A"

class B(A):
    def who(self): return "B"

class C(A):
    def who(self): return "C"

class D(B, C):
    pass

print("MRO:", [cls.__name__ for cls in D.__mro__])
print("D().who():", D().who())`,
          expectedOutput: `MRO: ['D', 'B', 'C', 'A', 'object']
D().who(): B`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 13,
          instruction: '[cls.__name__ for cls in D.__mro__]',
          internalEffect: 'Shows C3 linearization order: D, then B, then C, then A, then object.',
        },
        {
          step: 2,
          codeLine: 14,
          instruction: 'D().who()',
          internalEffect: 'Finds who() on B first because B precedes C in D(B, C).',
        },
      ],
      apply: {
        domain: 'Mixins',
        contextTitle: 'Adding Serialization via a Reusable Mixin',
        scenario: 'Combine a DictMixin with a User model using multiple inheritance.',
        code: `class DictMixin:
    def to_dict(self) -> dict:
        return dict(self.__dict__)

class User(DictMixin):
    def __init__(self, username: str):
        self.username = username

print(User("ada").to_dict())`,
        outcome: "{'username': 'ada'}",
      },
      commonMistakes: [
        {
          label: 'Inconsistent MRO Base Ordering',
          erroneousCode: `class X: pass
class Y(X): pass
# class Bad(X, Y): pass  # TypeError: Cannot create a consistent MRO!`,
          errorMessage: 'TypeError: Cannot create a consistent method resolution order (MRO) for bases X, Y',
          explanation: 'A subclass (Y) cannot appear after its own parent (X) in the base list; put Y before X.',
          correctedCode: `class Good(Y, X): pass`,
        },
      ],
      sourceNotes: 'Covers multiple inheritance and C3 MRO for Day 21.',
      practise: [
        {
          id: 'd21-s7-ex1',
          title: 'Predict Output: Diamond MRO Lookup',
          type: 'predict-output',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Mixin Priority Order',
          prompt: 'What does this code print?\n```python\nclass A:\n    tag = "A"\nclass B(A):\n    pass\nclass C(A):\n    tag = "C"\nclass D(B, C):\n    pass\nprint(D().tag)\n```',
          options: [
            { id: 'opt-1', text: 'C', explanation: 'Correct! D.__mro__ is (D, B, C, A, object), so C is checked before A.', isCorrect: true },
            { id: 'opt-2', text: 'A', explanation: 'Incorrect! C3 MRO checks C before shared parent A.', isCorrect: false },
            { id: 'opt-3', text: 'B', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'Raises AttributeError', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'What is D.__mro__?',
            '(D, B, C, A, object).',
            'B has no tag, so Python checks C next and finds "C".',
          ],
        },
        {
          id: 'd21-s7-ex2',
          title: 'Scenario: Inconsistent MRO Error',
          type: 'scenario-mcq',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Base Class Ordering Bug',
          prompt: 'Given `class Y(X): pass`, why does `class Z(X, Y): pass` raise `TypeError: Cannot create a consistent MRO`?',
          options: [
            { id: 'opt-1', text: 'Because parent X was listed before its own subclass Y, violating C3 linearization.', explanation: 'Correct! Put subclass Y before parent X: `class Z(Y, X):`.', isCorrect: true },
            { id: 'opt-2', text: 'Python only allows 1 base class.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'Y has no __init__.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'X and Y must be dataclasses.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'In MRO, subclasses must always precede their parents.',
            'Listing (X, Y) asks for X before Y, which contradicts Y(X).',
          ],
        },
        {
          id: 'd21-s7-ex3',
          title: 'Write Code: Inspecting MRO Chain',
          type: 'write-code',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Mixin Architecture Audit',
          prompt: 'Define `class A: pass`, `class B(A): pass`, `class C(A): pass`, `class D(B, C): pass`, and print `[c.__name__ for c in D.__mro__[:-1]]`.',
          starterCode: `# Define diamond A, B(A), C(A), D(B, C) and print MRO names excluding object
`,
          solutionCode: `class A: pass
class B(A): pass
class C(A): pass
class D(B, C): pass

print([c.__name__ for c in D.__mro__[:-1]])`,
          testCases: [
            { id: 'tc-1', label: "Prints ['D', 'B', 'C', 'A']", setup: '', expected: "['D', 'B', 'C', 'A']", hidden: false },
          ],
          hints: [
            'D.__mro__[:-1] slices off object.',
            "Prints ['D', 'B', 'C', 'A'].",
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day21-sub8',
      number: 8,
      title: 'Polymorphism, Duck Typing & Abstract Base Classes (abc)',
      summary: 'Write flexible code using duck typing and enforce required interfaces with abc.ABC.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Duck Typing vs Formal Interfaces',
        paragraphs: [
          'In Python, **polymorphism** often relies on **duck typing**: “If it walks like a duck and quacks like a duck, it’s a duck.” Any two unrelated classes that both implement `.send(msg)` can be passed to the same `notify_all()` function.',
          'When building larger frameworks where you want to **enforce** that every subclass implements specific methods before instantiation, use Python’s **`abc`** module: inherit from **`ABC`** and mark required methods with **`@abstractmethod`**.',
          'Attempting to instantiate an `ABC` subclass that forgot to implement an `@abstractmethod` raises **`TypeError: Can\'t instantiate abstract class ...`** immediately.',
        ],
        keyTerms: [
          {
            term: 'Duck Typing',
            definition: 'Polymorphism based on what methods an object supports rather than its inheritance hierarchy.',
          },
          {
            term: 'ABC & @abstractmethod',
            definition: 'Standard-library mechanism that prevents instantiating subclasses missing required methods.',
          },
        ],
        bulletPoints: [
          'An `ABC` cannot be instantiated directly if it has at least one unimplemented `@abstractmethod`.',
          'Duck typing keeps small scripts simple; `abc.ABC` prevents contract bugs in larger teams.',
        ],
      },
      visualise: {
        type: 'inheritance-mro-sim',
        title: 'Polymorphic Dispatch Visualizer',
        badge: 'simulation',
        description: 'Inspect how polymorphic dispatch works across diverse implementations.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Enforcing an Interface with abc.ABC',
          runMode: 'real',
          code: `from abc import ABC, abstractmethod

class Exporter(ABC):
    @abstractmethod
    def export(self, data: str) -> str:
        pass

class CsvExporter(Exporter):
    def export(self, data: str) -> str:
        return f"csv:{data}"

print(CsvExporter().export("1,2"))`,
          expectedOutput: `csv:1,2`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'class Exporter(ABC):',
          internalEffect: 'Declares an abstract base class requiring subclasses to implement export().',
        },
        {
          step: 2,
          codeLine: 8,
          instruction: 'class CsvExporter(Exporter):',
          internalEffect: 'Implements export(), allowing CsvExporter() to be instantiated.',
        },
      ],
      apply: {
        domain: 'Payment Gateways',
        contextTitle: 'Polymorphic Payment Processor Dispatch',
        scenario: 'Process payments through Card and Transfer adapters using a single function.',
        code: `class CardPay:
    def charge(self, amt): return f"Card:{amt}"

class BankPay:
    def charge(self, amt): return f"Bank:{amt}"

results = [gw.charge(100) for gw in (CardPay(), BankPay())]
print(results)`,
        outcome: "['Card:100', 'Bank:100']",
      },
      commonMistakes: [
        {
          label: 'Instantiating an Incomplete ABC Subclass',
          erroneousCode: `from abc import ABC, abstractmethod
class Base(ABC):
    @abstractmethod
    def run(self): pass
class Broken(Base):
    pass
# Broken()  # TypeError: Can't instantiate abstract class Broken!`,
          errorMessage: "TypeError: Can't instantiate abstract class Broken without an implementation for abstract method 'run'",
          explanation: 'Every @abstractmethod must be implemented in the concrete subclass.',
          correctedCode: `class Fixed(Base):
    def run(self): return "running"`,
        },
      ],
      sourceNotes: 'Covers polymorphism, duck typing, and abc.ABC.',
      practise: [
        {
          id: 'd21-s8-ex1',
          title: 'Theory: Duck Typing vs abc.ABC',
          type: 'theory-reasoning',
          tier: 'standard',
          points: 15,
          contextScenario: 'Plugin Architecture Design',
          prompt: 'When should a Python team use `abc.ABC` + `@abstractmethod` instead of pure duck typing?',
          options: [
            { id: 'opt-1', text: 'When they want Python to raise TypeError immediately at instantiation if a subclass forgets to implement a required method.', explanation: 'Correct!', isCorrect: true },
            { id: 'opt-2', text: 'Because duck typing is deprecated in Python 3.12.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'Because abc.ABC makes loops 10x faster.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'Because duck typing cannot call methods.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'When does duck typing fail vs abc.ABC?',
            'abc.ABC fails fast at instantiation time.',
          ],
        },
        {
          id: 'd21-s8-ex2',
          title: 'Fill the Gaps: Enforcing Abstract Method',
          type: 'fill-the-gaps',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Storage Backend Contract',
          prompt: 'Complete the abstract base class `Store` requiring subclasses to implement `save`.',
          gaps: [
            { id: 'g-1', beforeText: 'from abc import ', afterText: ', abstractmethod', correctAnswer: 'ABC', options: ['ABC', 'ABCMeta', 'Protocol', 'Any'] },
            { id: 'g-2', beforeText: '@', afterText: '\ndef save(self, key: str): pass', correctAnswer: 'abstractmethod', options: ['abstractmethod', 'staticmethod', 'classmethod', 'property'] },
          ],
          hints: [
            'Inherit from ABC and decorate with @abstractmethod.',
          ],
        },
        {
          id: 'd21-s8-ex3',
          title: 'Write Code: Polymorphic Notifier Dispatch',
          type: 'write-code',
          tier: 'project',
          points: 25,
          contextScenario: 'Multi-Channel Alerting',
          prompt: 'Create `Email` and `Sms` classes each with `send(self, msg)` returning `f"email:{msg}"` and `f"sms:{msg}"`. Print `[c.send("hi") for c in (Email(), Sms())]`.',
          starterCode: `# Define Email and Sms with send(self, msg), then print dispatch list
`,
          solutionCode: `class Email:
    def send(self, msg: str) -> str:
        return f"email:{msg}"

class Sms:
    def send(self, msg: str) -> str:
        return f"sms:{msg}"

print([c.send("hi") for c in (Email(), Sms())])`,
          testCases: [
            { id: 'tc-1', label: "Prints ['email:hi', 'sms:hi']", setup: '', expected: "['email:hi', 'sms:hi']", hidden: false },
          ],
          hints: [
            'Both classes implement send(self, msg).',
            "Prints ['email:hi', 'sms:hi'].",
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day21-sub9',
      number: 9,
      title: 'Dunder Methods (__str__, __repr__, __len__, __eq__)',
      summary: 'Make custom objects print cleanly, report lengths, and compare by value.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Integrating with Python’s Built-In Protocols',
        paragraphs: [
          'Double-underscore (“**dunder**”) methods let your classes plug into Python’s built-in syntax. **`__str__`** controls human-friendly output for `print(obj)` and `f"{obj}"`, while **`__repr__`** controls developer/debug output for `repr(obj)` and elements inside a `list`.',
          'Implementing **`__len__(self)`** lets callers run `len(obj)` (and also makes `bool(obj)` `False` when length is `0`).',
          'By default, `a == b` on custom objects compares **identity** (`a is b`), not contents! Implementing **`__eq__(self, other)`** enables value-based equality.',
        ],
        keyTerms: [
          {
            term: '__repr__ vs __str__',
            definition: '__repr__ is unambiguous for developers; __str__ is readable for end users.',
          },
          {
            term: '__eq__(self, other)',
            definition: 'Defines value equality for ==; return NotImplemented for unrelated types.',
          },
        ],
        bulletPoints: [
          'If you only implement one string dunder, implement `__repr__`—Python falls back to it when `__str__` is absent.',
          'Return `NotImplemented` (do not raise `TypeError`) in `__eq__` when `other` is an incompatible type.',
        ],
      },
      visualise: {
        type: 'dunder-property-sim',
        title: '__str__, __repr__, __len__ & __eq__ Inspector',
        badge: 'simulation',
        description: 'Inspect how dunder methods power print(), repr(), len(), and ==.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Implementing __repr__, __str__, __len__, and __eq__',
          runMode: 'real',
          code: `class Playlist:
    def __init__(self, title: str, tracks: list[str]):
        self.title = title
        self.tracks = tracks

    def __repr__(self) -> str:
        return f"Playlist({self.title!r}, {len(self.tracks)} tracks)"

    def __len__(self) -> int:
        return len(self.tracks)

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Playlist):
            return NotImplemented
        return self.title == other.title and self.tracks == other.tracks

p1 = Playlist("Focus", ["t1", "t2"])
p2 = Playlist("Focus", ["t1", "t2"])
print(repr(p1), "| len:", len(p1), "| equal:", p1 == p2)`,
          expectedOutput: `Playlist('Focus', 2 tracks) | len: 2 | equal: True`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 9,
          instruction: 'def __len__(self) -> int:',
          internalEffect: 'Enables len(p1) to return 2.',
        },
        {
          step: 2,
          codeLine: 12,
          instruction: 'def __eq__(self, other: object) -> bool:',
          internalEffect: 'Compares title and tracks so p1 == p2 evaluates to True.',
        },
      ],
      apply: {
        domain: 'Domain Entities',
        contextTitle: 'Value Equality on Coordinate Objects',
        scenario: 'Compare two GeoPoint objects by latitude and longitude.',
        code: `class GeoPoint:
    def __init__(self, lat: float, lon: float):
        self.lat, self.lon = lat, lon

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, GeoPoint):
            return NotImplemented
        return (self.lat, self.lon) == (other.lat, other.lon)

print(GeoPoint(6.5, 3.3) == GeoPoint(6.5, 3.3))`,
        outcome: 'True',
      },
      commonMistakes: [
        {
          label: 'Forgetting __eq__ and Expecting Value Equality',
          erroneousCode: `class Box:
    def __init__(self, v): self.v = v
print(Box(5) == Box(5))  # False! Default == checks identity (is).`,
          errorMessage: 'Logic bug: distinct instances with identical data compare False',
          explanation: 'Implement __eq__ (or use @dataclass) to compare attributes by value.',
          correctedCode: `# Implement __eq__ or decorate with @dataclass`,
        },
      ],
      sourceNotes: 'Covers __str__, __repr__, __len__, and __eq__.',
      practise: [
        {
          id: 'd21-s9-ex1',
          title: 'Scenario: __str__ vs __repr__ Inside Lists',
          type: 'scenario-mcq',
          tier: 'standard',
          points: 15,
          contextScenario: 'Debug Logging Output',
          prompt: 'You implement `__str__` on `Order`, so `print(order)` looks clean, yet `print([order])` prints `[<__main__.Order object at 0x...>]`. Why?',
          options: [
            { id: 'opt-1', text: 'Containers like `list` call `__repr__()` on their elements, not `__str__()`.', explanation: 'Correct! Always implement `__repr__` for clean debugging.', isCorrect: true },
            { id: 'opt-2', text: 'Lists ignore dunder methods.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: '__str__ only works on subclasses.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'You must implement __len__ first.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Which dunder does repr() and list.__repr__() call on items?',
            '__repr__.',
          ],
        },
        {
          id: 'd21-s9-ex2',
          title: 'Fix the Bug: Value Equality with __eq__',
          type: 'fix-the-bug',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Deduplicating Tag Objects',
          prompt: 'Add `__eq__` to `Tag` so `Tag("py") == Tag("py")` prints `True`.',
          starterCode: `class Tag:
    def __init__(self, name: str):
        self.name = name

print(Tag("py") == Tag("py"))`,
          solutionCode: `class Tag:
    def __init__(self, name: str):
        self.name = name

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Tag):
            return NotImplemented
        return self.name == other.name

print(Tag("py") == Tag("py"))`,
          testCases: [
            { id: 'tc-1', label: 'Prints True', setup: '', expected: 'True', hidden: false },
          ],
          hints: [
            'Define def __eq__(self, other: object) -> bool:',
            'Check isinstance(other, Tag) and compare self.name == other.name.',
            'Prints True.',
          ],
        },
        {
          id: 'd21-s9-ex3',
          title: 'Write Code: Custom Container __len__ & __repr__',
          type: 'write-code',
          tier: 'project',
          points: 25,
          contextScenario: 'Batch Queue Wrapper',
          prompt: 'Define `Batch(items)` implementing `__len__` and `__repr__` returning `f"Batch({len(self.items)})"`. Create `b = Batch([1, 2, 3])` and print `repr(b), len(b)`.',
          starterCode: `# Define Batch with __len__ and __repr__
`,
          solutionCode: `class Batch:
    def __init__(self, items: list):
        self.items = items

    def __len__(self) -> int:
        return len(self.items)

    def __repr__(self) -> str:
        return f"Batch({len(self.items)})"

b = Batch([1, 2, 3])
print(repr(b), len(b))`,
          testCases: [
            { id: 'tc-1', label: 'Prints Batch(3) 3', setup: '', expected: 'Batch(3) 3', hidden: false },
          ],
          hints: [
            '__len__ returns len(self.items).',
            'Prints Batch(3) 3.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day21-sub10',
      number: 10,
      title: 'Operator Overloading (__add__, __lt__) & @dataclass Overview',
      summary: 'Support + and < operators on custom types and eliminate boilerplate with @dataclass.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Arithmetic Dunders & Modern @dataclass',
        paragraphs: [
          'You can overload operators like `+` (`__add__`) and `<` (`__lt__`) so domain objects such as `Money`, `Vector`, or `Duration` behave like native numbers and sort cleanly with `sorted()`.',
          'For data-centric classes where you mostly store fields and want `__init__`, `__repr__`, and `__eq__` generated automatically, Python 3.7+ provides **`@dataclass`** in `dataclasses`.',
          'Remember: inside `@dataclass`, never write `items: list = []` as a default—use **`field(default_factory=list)`** so each instance gets its own fresh list!',
        ],
        keyTerms: [
          {
            term: '@dataclass',
            definition: 'Standard-library decorator that auto-generates __init__, __repr__, and __eq__ from type-annotated fields.',
          },
          {
            term: '__add__ / __lt__',
            definition: 'Dunder methods implementing the + and < operators on custom classes.',
          },
        ],
        bulletPoints: [
          'Use `@dataclass(frozen=True)` to make immutable, hashable value objects.',
          'Always use `field(default_factory=list)` for mutable defaults in `@dataclass`.',
        ],
      },
      visualise: {
        type: 'dunder-property-sim',
        title: 'Operator Overloading (__add__, __eq__) Inspector',
        badge: 'simulation',
        description: 'Explore how __add__ and __eq__ enable native + and == expressions.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Using @dataclass and __add__ Together',
          runMode: 'real',
          code: `from dataclasses import dataclass, field

@dataclass
class Money:
    amount: int
    currency: str = "NGN"
    tags: list[str] = field(default_factory=list)

    def __add__(self, other: "Money") -> "Money":
        if self.currency != other.currency:
            raise ValueError("Currency mismatch")
        return Money(self.amount + other.amount, self.currency)

m1 = Money(1500)
m2 = Money(500)
print(m1 + m2)`,
          expectedOutput: `Money(amount=2000, currency='NGN', tags=[])`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: '@dataclass',
          internalEffect: 'Auto-generates __init__, __repr__, and __eq__ for Money.',
        },
        {
          step: 2,
          codeLine: 9,
          instruction: 'def __add__(self, other: "Money") -> "Money":',
          internalEffect: 'Allows m1 + m2 to return a new Money(2000, "NGN") after checking currency.',
        },
      ],
      apply: {
        domain: 'Scheduling',
        contextTitle: 'Sorting Tasks with @dataclass(order=True)',
        scenario: 'Sort Task objects by priority using @dataclass(order=True).',
        code: `from dataclasses import dataclass

@dataclass(order=True)
class Task:
    priority: int
    title: str

tasks = [Task(3, "Docs"), Task(1, "Hotfix"), Task(2, "Tests")]
print([t.title for t in sorted(tasks)])`,
        outcome: "['Hotfix', 'Tests', 'Docs']",
      },
      commonMistakes: [
        {
          label: 'Mutable Default Directly in @dataclass',
          erroneousCode: `from dataclasses import dataclass
@dataclass
class Bag:
    items: list = []  # ValueError: mutable default <class 'list'> for field items!`,
          errorMessage: 'ValueError: mutable default <class "list"> for field items is not allowed: use default_factory',
          explanation: '@dataclass actively blocks bare mutable defaults; use field(default_factory=list).',
          correctedCode: `from dataclasses import dataclass, field
@dataclass
class Bag:
    items: list = field(default_factory=list)`,
        },
      ],
      sourceNotes: 'Covers operator overloading and @dataclass for Day 21.',
      practise: [
        {
          id: 'd21-s10-ex1',
          title: 'Fix the Bug: @dataclass Mutable Default',
          type: 'fix-the-bug',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Dataclass List Field',
          prompt: 'Fix `Bucket` so `@dataclass` does not raise `ValueError: mutable default` and `Bucket("A")` prints `Bucket(name=\'A\', items=[])`.',
          starterCode: `from dataclasses import dataclass

@dataclass
class Bucket:
    name: str
    items: list = []

print(Bucket("A"))`,
          solutionCode: `from dataclasses import dataclass, field

@dataclass
class Bucket:
    name: str
    items: list = field(default_factory=list)

print(Bucket("A"))`,
          testCases: [
            { id: 'tc-1', label: "Prints Bucket(name='A', items=[])", setup: '', expected: "Bucket(name='A', items=[])", hidden: false },
          ],
          hints: [
            'Import field from dataclasses.',
            'Use field(default_factory=list).',
          ],
        },
        {
          id: 'd21-s10-ex2',
          title: 'Order the Lines: Operator Overloading __add__',
          type: 'order-the-lines',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Vector Addition',
          prompt: 'Arrange the lines to define `Vec(x, y)` with `__add__` and print `(Vec(1, 2) + Vec(3, 4)).x`.',
          jumbledLines: [
            { id: 'l3', code: '    def __add__(self, o): return Vec(self.x + o.x, self.y + o.y)', indent: 0 },
            { id: 'l1', code: 'class Vec:', indent: 0 },
            { id: 'l4', code: 'print((Vec(1, 2) + Vec(3, 4)).x)', indent: 0 },
            { id: 'l2', code: '    def __init__(self, x, y): self.x, self.y = x, y', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: [
            'Define class Vec and __init__ first.',
            'Add __add__, then print the sum.',
          ],
        },
        {
          id: 'd21-s10-ex3',
          title: 'Write Code: Sortable @dataclass(order=True)',
          type: 'write-code',
          tier: 'project',
          points: 25,
          contextScenario: 'Priority Job Queue',
          prompt: 'Define `@dataclass(order=True) class Job` with `priority: int` and `name: str`. Sort `[Job(2, "B"), Job(1, "A")]` and print `[j.name for j in sorted_jobs]`.',
          starterCode: `from dataclasses import dataclass

# Define @dataclass(order=True) Job and print sorted names
`,
          solutionCode: `from dataclasses import dataclass

@dataclass(order=True)
class Job:
    priority: int
    name: str

sorted_jobs = sorted([Job(2, "B"), Job(1, "A")])
print([j.name for j in sorted_jobs])`,
          testCases: [
            { id: 'tc-1', label: "Prints ['A', 'B']", setup: '', expected: "['A', 'B']", hidden: false },
          ],
          hints: [
            'Decorate Job with @dataclass(order=True).',
            'Put priority first so sorting compares priority first.',
            "Prints ['A', 'B'].",
          ],
        },
      ],
      assess: [],
    },
  ],
  realWorldLabs: [
    {
      id: 'day21-lab1',
      title: 'Fintech Account Hierarchy with @property & super()',
      description: 'Build a base Account class with validated @property balance and a SavingsAccount subclass that adds interest via super().',
      domain: 'Fintech Core Banking',
      starterCode: `class Account:
    def __init__(self, owner: str, balance: float):
        self.owner = owner
        self.balance = balance

    @property
    def balance(self) -> float:
        return self._balance

    @balance.setter
    def balance(self, value: float) -> None:
        if value < 0:
            raise ValueError("Negative balance")
        self._balance = value

class SavingsAccount(Account):
    def __init__(self, owner: str, balance: float, rate: float):
        super().__init__(owner, balance)
        self.rate = rate

    def apply_interest(self) -> float:
        self.balance = round(self.balance * (1 + self.rate), 2)
        return self.balance

acc = SavingsAccount("Ada", 1000, 0.05)
print(acc.owner, acc.apply_interest())`,
      targetOutput: `Ada 1050.0`,
    },
    {
      id: 'day21-lab2',
      title: 'Polymorphic Order Pipeline with @dataclass & Dunders',
      description: 'Combine @dataclass, __add__ operator overloading, and __len__ to aggregate cart items cleanly.',
      domain: 'E-Commerce Checkout',
      starterCode: `from dataclasses import dataclass

@dataclass
class Money:
    amount: int
    currency: str = "NGN"

    def __add__(self, other: "Money") -> "Money":
        if self.currency != other.currency:
            raise ValueError("Currency mismatch")
        return Money(self.amount + other.amount, self.currency)

class Cart:
    def __init__(self):
        self.prices: list[Money] = []

    def add(self, m: Money) -> None:
        self.prices.append(m)

    def __len__(self) -> int:
        return len(self.prices)

    def total(self) -> Money:
        return sum(self.prices, Money(0))

c = Cart()
c.add(Money(1200))
c.add(Money(800))
print("Items:", len(c), "| Total:", c.total())`,
      targetOutput: `Items: 2 | Total: Money(amount=2000, currency='NGN')`,
    },
  ],
  miniProject: {
    id: 'day21-project',
    title: 'Bank Ledger & Account Hierarchy System',
    brief: 'Design an OOP banking ledger with an Account base class (@property balance validation), CheckingAccount and SavingsAccount subclasses using super(), @classmethod factory constructors, and dunder methods (__repr__, __eq__).',
    requirements: [
      'Use `__init__` to initialize independent per-instance state (never mutable class attributes)',
      'Enforce non-negative balance invariants via `@property` and `@balance.setter`',
      'Implement subclass specialization (`SavingsAccount`, `CheckingAccount`) using `super().__init__()`',
      'Provide a `@classmethod` constructor (e.g., `from_dict`) and clean `__repr__` / `__eq__` dunders',
      'Support polymorphic `monthly_update()` dispatch across a list of mixed account types',
    ],
    rubric: [
      { criterion: 'Clean encapsulation, @property validation, and zero mutable class-attr leaks', weight: 35 },
      { criterion: 'Proper inheritance, super() chaining, and polymorphic dispatch', weight: 35 },
      { criterion: 'Idiomatic @classmethod factory and dunder methods (__repr__, __eq__)', weight: 30 },
    ],
    starterCode: `# Bank Ledger & Account Hierarchy System
class Account:
    def __init__(self, owner: str, balance: float = 0.0):
        self.owner = owner
        self.balance = balance
`,
  },
  dayQuiz: {
    title: 'Day 21 Mastery Checkpoint Quiz: Classes and Objects',
    passingScorePercentage: 80,
    questions: [
      {
        id: 'd21-q1',
        scenario: 'Instance Methods',
        question: 'What does `self` represent inside a Python instance method?',
        options: [
          { id: 'q1-a', text: 'The specific instance on which the method was called.', explanation: 'Correct!', isCorrect: true },
          { id: 'q1-b', text: 'The parent class.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q1-c', text: 'A reserved Python keyword for global scope.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q1-d', text: 'The module filename.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd21-q2',
        scenario: '__init__ Return Value',
        question: 'What must `__init__` return?',
        options: [
          { id: 'q2-a', text: 'None (returning any other value raises TypeError).', explanation: 'Correct!', isCorrect: true },
          { id: 'q2-b', text: 'self.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q2-c', text: 'A dictionary of attributes.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q2-d', text: 'True.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd21-q3',
        scenario: 'Class vs Instance Attributes',
        question: 'Why is defining `items = []` directly in the class body usually a bug?',
        options: [
          { id: 'q3-a', text: 'All instances share that single list, so mutating it on one instance affects every other instance.', explanation: 'Correct!', isCorrect: true },
          { id: 'q3-b', text: 'Python forbids lists in classes.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q3-c', text: 'It raises SyntaxError.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q3-d', text: 'It makes the list read-only.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd21-q4',
        scenario: '@classmethod vs @staticmethod',
        question: 'What is the first parameter passed to a `@classmethod`?',
        options: [
          { id: 'q4-a', text: 'cls (the class itself, enabling subclass-friendly factory constructors).', explanation: 'Correct!', isCorrect: true },
          { id: 'q4-b', text: 'self (an instance).', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q4-c', text: 'No automatic parameter.', explanation: 'Incorrect. That is @staticmethod.', isCorrect: false },
          { id: 'q4-d', text: 'super.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd21-q5',
        scenario: '@property',
        question: 'Inside `@property def age(self):`, why should you return `self._age` instead of `self.age`?',
        options: [
          { id: 'q5-a', text: 'Returning `self.age` calls the property getter recursively, causing `RecursionError`.', explanation: 'Correct!', isCorrect: true },
          { id: 'q5-b', text: 'self.age is always None.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q5-c', text: '_age is faster than age.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q5-d', text: 'Python forbids accessing self.age.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd21-q6',
        scenario: 'Inheritance & super()',
        question: 'When a subclass overrides `__init__`, how should it ensure parent attributes are initialized?',
        options: [
          { id: 'q6-a', text: 'Call `super().__init__(...)` inside the subclass `__init__`.', explanation: 'Correct!', isCorrect: true },
          { id: 'q6-b', text: 'Python calls parent __init__ automatically even when overridden.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q6-c', text: 'Use `@staticmethod` on `__init__`.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q6-d', text: 'Delete the parent class.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd21-q7',
        scenario: 'Multiple Inheritance MRO',
        question: 'For `class A: pass`, `class B(A): pass`, `class C(A): pass`, `class D(B, C): pass`, what is `D.__mro__`?',
        options: [
          { id: 'q7-a', text: '(D, B, C, A, object)', explanation: 'Correct! C3 linearization visits B then C before shared base A.', isCorrect: true },
          { id: 'q7-b', text: '(D, B, A, C, object)', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q7-c', text: '(D, C, B, A, object)', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q7-d', text: '(A, B, C, D, object)', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd21-q8',
        scenario: 'Abstract Base Classes',
        question: 'What happens if you instantiate a subclass of `abc.ABC` that did not implement an `@abstractmethod`?',
        options: [
          { id: 'q8-a', text: 'Python raises `TypeError` immediately at instantiation.', explanation: 'Correct!', isCorrect: true },
          { id: 'q8-b', text: 'Python runs the method as a no-op.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q8-c', text: 'Python raises `SyntaxError` at import time.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q8-d', text: 'It succeeds and returns None.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd21-q9',
        scenario: 'Dunder Methods',
        question: 'Which dunder method is called when `print([my_obj])` formats elements inside a list?',
        options: [
          { id: 'q9-a', text: '__repr__', explanation: 'Correct!', isCorrect: true },
          { id: 'q9-b', text: '__str__', explanation: 'Incorrect. Lists call __repr__ on elements.', isCorrect: false },
          { id: 'q9-c', text: '__len__', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q9-d', text: '__eq__', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd21-q10',
        scenario: '@dataclass',
        question: 'How do you safely declare a mutable list default on a `@dataclass` field?',
        options: [
          { id: 'q10-a', text: 'items: list = field(default_factory=list)', explanation: 'Correct!', isCorrect: true },
          { id: 'q10-b', text: 'items: list = []', explanation: 'Incorrect. Raises ValueError in @dataclass.', isCorrect: false },
          { id: 'q10-c', text: 'items: list = list()', explanation: 'Incorrect. Also evaluates to a single list instance.', isCorrect: false },
          { id: 'q10-d', text: 'items = @property(list)', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
    ],
  },
  cheatSheet: [
    {
      category: 'Classes, Objects & self',
      syntax: 'class MyClass: def method(self): ...',
      description: 'Classes use PascalCase. Calling `obj.method()` passes `obj` automatically as `self`. Check type with `isinstance(obj, MyClass)`.',
      example: `class Greeter:
    def greet(self, name: str) -> str:
        return f"Hello, {name}!"`,
    },
    {
      category: '__init__ Constructor & Instance Attributes',
      syntax: 'def __init__(self, ...): self.attr = ...',
      description: 'Initializes per-instance state right after creation. `__init__` must return `None`.',
      example: `class Wallet:
    def __init__(self, owner: str, bal: float = 0.0):
        self.owner = owner
        self.bal = bal`,
    },
    {
      category: 'Class vs Instance Attributes & Mutable Trap',
      syntax: 'Class.shared vs self.unique',
      description: 'Class attributes are shared by all instances. Never put a mutable list/dict on the class body—initialize `self.items = []` inside `__init__`.',
      example: `class Cart:
    tax_rate = 0.075
    def __init__(self):
        self.items = []`,
    },
    {
      category: 'Instance, @classmethod & @staticmethod',
      syntax: '@classmethod (cls) / @staticmethod ()',
      description: '`@classmethod` receives `cls` (ideal for factory constructors). `@staticmethod` receives neither `self` nor `cls`.',
      example: `class Record:
    @classmethod
    def from_csv(cls, row: str):
        return cls(*row.split(","))`,
    },
    {
      category: 'Encapsulation & @property Validation',
      syntax: '@property / @attr.setter',
      description: 'Use `_attr` for internal backing fields (avoiding recursion in properties) and `@property` for read-only or validated attributes.',
      example: `@property
def balance(self) -> float:
    return self._balance
@balance.setter
def balance(self, v: float) -> None:
    if v < 0: raise ValueError("Negative")
    self._balance = v`,
    },
    {
      category: 'Single Inheritance, Overriding & super()',
      syntax: 'class Child(Parent): super().__init__(...)',
      description: 'Subclasses inherit and override parent methods. Always call `super().__init__(...)` when extending `__init__`.',
      example: `class Manager(Employee):
    def __init__(self, name, pay, bonus):
        super().__init__(name, pay)
        self.bonus = bonus`,
    },
    {
      category: 'Multiple Inheritance & C3 MRO (__mro__)',
      syntax: 'class D(B, C): pass  # D.__mro__',
      description: 'Python resolves methods left-to-right using C3 linearization (`D -> B -> C -> A -> object`). Subclasses always precede parents.',
      example: `print([c.__name__ for c in D.__mro__])`,
    },
    {
      category: 'Polymorphism, Duck Typing & abc.ABC',
      syntax: 'class Base(ABC): @abstractmethod',
      description: 'Duck typing dispatches on shared method names; `abc.ABC` + `@abstractmethod` enforces implementation at instantiation time.',
      example: `from abc import ABC, abstractmethod
class Exporter(ABC):
    @abstractmethod
    def export(self, data: str) -> str: ...`,
    },
    {
      category: 'Dunder Protocols (__str__, __repr__, __len__, __eq__)',
      syntax: 'def __repr__(self) / def __eq__(self, other)',
      description: '`__repr__` formats debug/container output; `__str__` formats `print()`; `__len__` powers `len()`; `__eq__` enables value equality.',
      example: `def __eq__(self, other: object) -> bool:
    if not isinstance(other, Tag): return NotImplemented
    return self.name == other.name`,
    },
    {
      category: 'Operator Overloading (__add__, __lt__) & @dataclass',
      syntax: '@dataclass(order=True) / field(default_factory=list)',
      description: '`__add__` and `__lt__` customize `+` and `<`. `@dataclass` auto-generates `__init__`, `__repr__`, and `__eq__`.',
      example: `from dataclasses import dataclass, field
@dataclass
class Bucket:
    name: str
    items: list = field(default_factory=list)`,
    },
  ],
  sourceNotes: [
    'Curriculum reference: https://github.com/Asabeneh/30-Days-Of-Python/tree/master/21_Day_Classes_and_objects',
  ],
};
