/**
 * Day 17: Exception Handling, Packing, Unpacking, Enumerate and Zip (Intermediate Python)
 * Part A (Learn) conforming to Sections 10, 13.2, and 14 of the Master Specification.
 * Includes:
 *  - 8 Detailed Subtopics following the 10-step pedagogical structure
 *  - 3 Signature Simulations: try-except-flow-sim, packing-unpacking-sim, enumerate-zip-sim
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_17_MODULE: DayModule = {
  schemaVersion: 1,
  number: 17,
  title: 'Exception Handling, Packing, Unpacking, Enumerate and Zip',
  level: 'intermediate',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/17_Day_Exception_handling',
  estimatedMinutes: 75,
  prerequisites: [15],
  objectives: [
    'Handle runtime exceptions cleanly with targeted try/except blocks and exception tuples',
    'Use else for post-success logic and finally for guaranteed resource cleanup',
    'Raise built-in or custom domain exceptions and re-raise with bare raise',
    'Unpack sequences and iterables cleanly with starred expressions (head, *mid, tail)',
    'Pack and splat variable arguments using *args and **kwargs',
    'Iterate with automatic index-value pairs via enumerate(seq, start=1)',
    'Pair and transpose parallel iterables safely using zip(), strict=True, and zip(*pairs)',
    'Merge and spread dictionaries cleanly with {**a, **b} and the | operator',
  ],
  subtopics: [
    {
      id: 'day17-sub1',
      number: 1,
      title: 'try & except Basics (Specific Exceptions vs Bare except)',
      summary: 'Catch expected runtime failures with targeted exception types while letting unexpected bugs surface.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Graceful Recovery Without Swallowing Bugs',
        paragraphs: [
          'In Python, `try / except` lets your program recover from predictable runtime failures—such as malformed user input (`ValueError`), missing dictionary keys (`KeyError`), or division by zero (`ZeroDivisionError`)—without crashing the entire process.',
          'Always catch **specific** exception types (e.g., `except ValueError as err:` or a tuple `except (ValueError, TypeError) as err:`). Never write a bare `except:` or `except Exception: pass`, because that silently hides typos, `NameError`, and `KeyboardInterrupt`!',
          'Order matters when writing multiple `except` clauses: Python checks them top-to-bottom and runs only the **first** matching handler, so more specific subclasses (like `FileNotFoundError`) must appear before broader parents (`OSError`).',
        ],
        keyTerms: [
          {
            term: 'try / except',
            definition: 'Control structure that monitors a block of code and handles specified exception types if raised.',
          },
          {
            term: 'Exception Tuple',
            definition: 'Syntax `except (TypeA, TypeB) as err:` that handles multiple exception classes with one block.',
          },
        ],
        bulletPoints: [
          'Keep the `try` block as small as possible—wrap only the risky line.',
          'Bind the exception with `as err` to log or inspect `type(err).__name__` and `err`.',
        ],
      },
      visualise: {
        type: 'try-except-flow-sim',
        title: 'try / except / else / finally Flow Tracer',
        badge: 'simulation',
        description: 'Step through how Python routes control across try, except, else, and finally blocks.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Targeted Multi-Exception Handling',
          runMode: 'real',
          code: `def safe_divide(raw_a, raw_b):
    try:
        a = float(raw_a)
        b = float(raw_b)
        return round(a / b, 2)
    except (ValueError, TypeError) as err:
        return f"Bad input ({type(err).__name__})"
    except ZeroDivisionError:
        return "Cannot divide by zero"

print(safe_divide("10", "4"))
print(safe_divide("ten", "4"))
print(safe_divide("10", "0"))`,
          expectedOutput: `2.5
Bad input (ValueError)
Cannot divide by zero`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'a = float(raw_a); b = float(raw_b)',
          internalEffect: 'Converts raw inputs to float; raises ValueError on non-numeric strings or TypeError on None.',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 'except (ValueError, TypeError) as err:',
          internalEffect: 'Catches conversion failures and binds the exception object to err.',
        },
        {
          step: 3,
          codeLine: 8,
          instruction: 'except ZeroDivisionError:',
          internalEffect: 'Handles division by zero separately with a domain-specific message.',
        },
      ],
      apply: {
        domain: 'Configuration',
        contextTitle: 'Parsing Environment Port Numbers',
        scenario: 'Parse a string port setting safely with a fallback default on invalid input.',
        code: `def parse_port(raw_port, default=8000):
    try:
        return int(raw_port)
    except (ValueError, TypeError):
        return default

print(parse_port("9090"), parse_port("invalid"), parse_port(None))`,
        outcome: '9090 8000 8000',
      },
      commonMistakes: [
        {
          label: 'Using a Bare except: That Hides Real Bugs',
          erroneousCode: `try:
    total = int(user_inp) + bonus_typo
except:
    total = 0  # Silently hides NameError for bonus_typo!`,
          errorMessage: 'Silent bug: NameError is swallowed instead of reported',
          explanation: 'A bare except catches every BaseException, masking programmer typos like NameError.',
          correctedCode: `try:
    total = int(user_inp) + bonus
except ValueError:
    total = 0`,
        },
      ],
      sourceNotes: 'Covers targeted try/except blocks for Day 17.',
      practise: [
        {
          id: 'd17-s1-ex1',
          title: 'Scenario: Why Bare except: Is Dangerous',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Payment Webhook Handler',
          prompt: 'A teammate wraps a webhook parser in `except: return None`. Later, a typo (`payload_id` -> `paylod_id`) causes `NameError`, yet no error appears in logs. Why?',
          options: [
            { id: 'opt-1', text: 'A bare except: catches every BaseException—including NameError and KeyboardInterrupt—silently hiding bugs.', explanation: 'Correct! Always catch specific exception classes like (ValueError, KeyError).', isCorrect: true },
            { id: 'opt-2', text: 'Python ignores NameError inside functions.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'bare except only catches ValueError.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'return None suppresses SyntaxError.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'What exception hierarchy does a bare except: catch?',
            'Does it distinguish expected input errors from programmer typos?',
            'Catch specific exceptions such as ValueError or KeyError.',
          ],
        },
        {
          id: 'd17-s1-ex2',
          title: 'Write Code: Safe Integer Quantity Parser',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'Warehouse Cart API',
          prompt: 'Write `parse_qty(raw)` that returns `int(raw)` inside `try`, and catches `(ValueError, TypeError)` to return `0`. Print `parse_qty("15")`, `parse_qty("bad")`, and `parse_qty(None)`.',
          starterCode: `def parse_qty(raw):
    # Return int(raw) or 0 on ValueError/TypeError
    pass

print(parse_qty("15"), parse_qty("bad"), parse_qty(None))`,
          solutionCode: `def parse_qty(raw):
    try:
        return int(raw)
    except (ValueError, TypeError):
        return 0

print(parse_qty("15"), parse_qty("bad"), parse_qty(None))`,
          testCases: [
            { id: 'tc-1', label: 'Prints 15 0 0', setup: '', expected: '15 0 0', hidden: false },
          ],
          hints: [
            'Wrap return int(raw) in try.',
            'Use except (ValueError, TypeError): to catch both bad strings and None.',
            'Return 0 in the except block.',
          ],
        },
        {
          id: 'd17-s1-ex3',
          title: 'Fix the Bug: Exception Clause Ordering',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 15,
          contextScenario: 'File Loader Diagnostics',
          prompt: '`LookupError` is the parent of `KeyError`, so putting `except LookupError:` first shadows `except KeyError:`. Reorder the clauses so `KeyError` prints `"Missing key"` and other `LookupError`s print `"Lookup failed"`.',
          starterCode: `def lookup(data, key):
    try:
        return data[key]
    except LookupError:
        return "Lookup failed"
    except KeyError:
        return "Missing key"

print(lookup({"a": 1}, "b"))`,
          solutionCode: `def lookup(data, key):
    try:
        return data[key]
    except KeyError:
        return "Missing key"
    except LookupError:
        return "Lookup failed"

print(lookup({"a": 1}, "b"))`,
          testCases: [
            { id: 'tc-1', label: 'Prints Missing key', setup: '', expected: 'Missing key', hidden: false },
          ],
          hints: [
            'Python checks except clauses top-to-bottom.',
            'More specific subclasses (KeyError) must come before parent classes (LookupError).',
            'Swap the two except blocks.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day17-sub2',
      number: 2,
      title: 'else, finally & Resource Cleanup Guarantees',
      summary: 'Separate post-success logic with else and guarantee cleanup execution with finally.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'The Full Four-Clause Exception Structure',
        paragraphs: [
          'Python’s `try` statement supports two optional clauses beyond `except`: **`else`** and **`finally`**. The `else` block runs **only if the `try` block completed without raising an exception and without hitting a `return`/`break`**.',
          'Why use `else` instead of putting more code inside `try`? Putting post-success code in `else` prevents accidentally catching an exception from code that was *not* meant to be guarded by `except`.',
          'The **`finally`** block **always runs**—whether `try` succeeded, `except` caught an error, an unhandled exception is propagating upward, or `try` executed an early `return`. That makes `finally` essential for releasing locks, closing connections, or logging completion.',
        ],
        keyTerms: [
          {
            term: 'else clause',
            definition: 'Optional block after except that executes only when try finishes cleanly with no exception.',
          },
          {
            term: 'finally clause',
            definition: 'Cleanup block guaranteed to execute before leaving the try statement under all exit paths.',
          },
        ],
        bulletPoints: [
          'If `try` hits `return`, `else` is skipped, **but `finally` still runs** before the function returns.',
          'Use `else` to keep `try` narrow and avoid masking unrelated errors.',
        ],
      },
      visualise: {
        type: 'try-except-flow-sim',
        title: 'else vs finally Execution Inspector',
        badge: 'simulation',
        description: 'Compare Valid Input, Handled Error, Unhandled Error, and Early Return paths.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Observing try / except / else / finally Order',
          runMode: 'real',
          code: `def process_token(raw):
    try:
        num = int(raw)
    except ValueError:
        print("except: invalid integer")
    else:
        print("else: parsed", num * 2)
    finally:
        print("finally: cleanup done")

process_token("21")
print("---")
process_token("oops")`,
          expectedOutput: `else: parsed 42
finally: cleanup done
---
except: invalid integer
finally: cleanup done`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'num = int(raw)',
          internalEffect: 'Only the risky conversion sits inside try.',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 'else: print("else: parsed", num * 2)',
          internalEffect: 'Runs only when int("21") succeeds without raising ValueError.',
        },
        {
          step: 3,
          codeLine: 8,
          instruction: 'finally: print("finally: cleanup done")',
          internalEffect: 'Executes in both the success path and the ValueError path.',
        },
      ],
      apply: {
        domain: 'Concurrency',
        contextTitle: 'Releasing a Processing Lock',
        scenario: 'Ensure an in-memory lock flag is always reset even if a task fails.',
        code: `locked = False
def run_job(fail=False):
    global locked
    locked = True
    try:
        if fail:
            raise RuntimeError("boom")
        return "ok"
    except RuntimeError:
        return "recovered"
    finally:
        locked = False

print(run_job(True), "| locked:", locked)`,
        outcome: 'recovered | locked: False',
      },
      commonMistakes: [
        {
          label: 'Putting return Inside finally',
          erroneousCode: `def risky():
    try:
        return 1 / 0
    finally:
        return "swallowed!"  # Overrides ZeroDivisionError!`,
          errorMessage: 'Silent bug: return inside finally discards active exceptions',
          explanation: 'A return statement inside finally cancels any in-flight exception or earlier return value.',
          correctedCode: `def risky():
    try:
        return 10 / 2
    finally:
        pass  # Cleanup only, no return`,
        },
      ],
      sourceNotes: 'Covers else and finally semantics for Day 17.',
      practise: [
        {
          id: 'd17-s2-ex1',
          title: 'Predict Output: Early return with else and finally',
          type: 'predict-output',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Database Connection Guard',
          prompt: 'What does this function print when `probe()` is called?\n```python\ndef probe():\n    try:\n        return "ok"\n    except ValueError:\n        print("err")\n    else:\n        print("else")\n    finally:\n        print("finally")\nprint(probe())\n```',
          options: [
            { id: 'opt-1', text: 'finally\\nok', explanation: 'Correct! Early return in try skips else, but finally ALWAYS executes before returning "ok".', isCorrect: true },
            { id: 'opt-2', text: 'else\\nfinally\\nok', explanation: 'Incorrect. else is skipped when try exits via return.', isCorrect: false },
            { id: 'opt-3', text: 'ok\\nfinally', explanation: 'Incorrect. finally runs before probe() returns "ok" to print().', isCorrect: false },
            { id: 'opt-4', text: 'ok', explanation: 'Incorrect. finally still executes.', isCorrect: false },
          ],
          hints: [
            'Does else run if try executes a return statement?',
            'Does finally run before or after the function returns?',
            'finally prints first, then print(probe()) prints ok.',
          ],
        },
        {
          id: 'd17-s2-ex2',
          title: 'Order the Lines: Full try / except / else / finally',
          type: 'order-the-lines',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Sensor Frame Decoder',
          prompt: 'Order the clauses into a valid Python `try / except / else / finally` block.',
          jumbledLines: [
            { id: 'l4', code: 'finally:\n    print("done")', indent: 0 },
            { id: 'l2', code: 'except ValueError:\n    print("bad")', indent: 0 },
            { id: 'l1', code: 'try:\n    n = int("7")', indent: 0 },
            { id: 'l3', code: 'else:\n    print(n)', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: [
            'try always comes first.',
            'except must appear before else.',
            'finally is always last.',
          ],
        },
        {
          id: 'd17-s2-ex3',
          title: 'Theory: Why Use an else Clause After except?',
          type: 'theory-reasoning',
          tier: 'standard',
          points: 15,
          contextScenario: 'Clean Architecture Review',
          prompt: 'Why is it better to place post-success code in an `else:` block rather than appending it inside the `try:` block?',
          modelAnswer: 'Code in the else block runs only if try raised no exception, and it is NOT protected by the except clauses above it. This keeps the try block minimal and prevents except from accidentally catching unrelated errors from post-success logic.',
          markingCriteria: [
            { id: 'mc-1', label: 'Notes else runs only when try succeeds without exception', points: 7 },
            { id: 'mc-2', label: 'Explains else avoids accidentally catching errors in follow-up code', points: 8 },
          ],
          hints: [
            'What happens if a bug in post-success code raises ValueError inside try?',
            'Is the else block covered by the except handlers?',
            'Keeping try narrow prevents accidental exception masking.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day17-sub3',
      number: 3,
      title: 'raise, Re-Raising & Custom Exception Classes',
      summary: 'Signal invalid states explicitly with raise, preserve tracebacks with bare raise, and define custom Exception subclasses.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Raising Meaningful Domain Errors',
        paragraphs: [
          'Good functions fail loudly on invalid contracts rather than returning magic values like `-1` or `None`. Use `raise ValueError("...")` to signal an invalid value immediately.',
          'When you catch an exception to log it and want it to keep propagating, write a bare **`raise`** inside the `except` block—this preserves the original traceback frame. You can also define custom exception classes by subclassing `Exception`: `class InsufficientFundsError(Exception): pass`.',
          'For wrapping a low-level error in a higher-level domain error without losing history, Python supports exception chaining: `raise ConfigError("Bad port") from err`.',
        ],
        keyTerms: [
          {
            term: 'Bare raise',
            definition: 'Using `raise` with no arguments inside an except block to re-raise the active exception with its original traceback.',
          },
          {
            term: 'Custom Exception',
            definition: 'A class inheriting from `Exception` representing a specific domain failure.',
          },
        ],
        bulletPoints: [
          'Always inherit custom exceptions from `Exception` (never `BaseException`).',
          'Use bare `raise` (not `raise err`) when re-raising so the traceback stays intact.',
        ],
      },
      visualise: {
        type: 'try-except-flow-sim',
        title: 'Exception Propagation & Re-Raise Tracer',
        badge: 'simulation',
        description: 'Trace how unhandled or re-raised exceptions run finally cleanup before propagating.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Custom Exception & Validation with raise',
          runMode: 'real',
          code: `class InsufficientFundsError(Exception):
    pass

def withdraw(balance, amount):
    if amount <= 0:
        raise ValueError("Withdrawal amount must be positive")
    if amount > balance:
        raise InsufficientFundsError(f"Need {amount}, have {balance}")
    return balance - amount

try:
    withdraw(50, 120)
except InsufficientFundsError as err:
    print("Blocked:", err)`,
          expectedOutput: `Blocked: Need 120, have 50`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'class InsufficientFundsError(Exception): pass',
          internalEffect: 'Defines a distinct exception type callers can catch without catching unrelated ValueErrors.',
        },
        {
          step: 2,
          codeLine: 8,
          instruction: 'raise InsufficientFundsError(...)',
          internalEffect: 'Halts withdraw() immediately and unwinds the call stack to the matching except block.',
        },
      ],
      apply: {
        domain: 'Fintech',
        contextTitle: 'Enforcing Positive Transfer Amounts',
        scenario: 'Reject negative or over-limit transfers with explicit domain exceptions.',
        code: `class LimitExceededError(Exception):
    pass

def check_transfer(amount, limit=1000):
    if amount > limit:
        raise LimitExceededError(f"{amount} > {limit}")
    return True

try:
    check_transfer(1500)
except LimitExceededError as e:
    print("Denied:", e)`,
        outcome: 'Denied: 1500 > 1000',
      },
      commonMistakes: [
        {
          label: 'Raising a String Instead of an Exception Instance',
          erroneousCode: `raise "Invalid age"  # TypeError!`,
          errorMessage: 'TypeError: exceptions must derive from BaseException',
          explanation: 'Python requires raised objects to be instances or subclasses of BaseException (typically Exception).',
          correctedCode: `raise ValueError("Invalid age")`,
        },
      ],
      sourceNotes: 'Covers raise, re-raising, and custom Exception subclasses.',
      practise: [
        {
          id: 'd17-s3-ex1',
          title: 'Write Code: Custom Exception Class & Validation',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'Seat Reservation Service',
          prompt: 'Define `class SoldOutError(Exception): pass`. Write `book(seats_left, qty)` that raises `SoldOutError("No seats")` if `qty > seats_left`, otherwise returns `seats_left - qty`. Catch `SoldOutError` for `book(2, 5)` and print `"Caught: No seats"`.',
          starterCode: `class SoldOutError(Exception):
    pass

def book(seats_left, qty):
    # Raise SoldOutError if qty > seats_left
    pass

try:
    book(2, 5)
except SoldOutError as err:
    print("Caught:", err)`,
          solutionCode: `class SoldOutError(Exception):
    pass

def book(seats_left, qty):
    if qty > seats_left:
        raise SoldOutError("No seats")
    return seats_left - qty

try:
    book(2, 5)
except SoldOutError as err:
    print("Caught:", err)`,
          testCases: [
            { id: 'tc-1', label: 'Prints Caught: No seats', setup: '', expected: 'Caught: No seats', hidden: false },
          ],
          hints: [
            'Check if qty > seats_left inside book().',
            'Use raise SoldOutError("No seats").',
            'Return seats_left - qty otherwise.',
          ],
        },
        {
          id: 'd17-s3-ex2',
          title: 'Fill the Gaps: Preserving Original Traceback on Re-Raise',
          type: 'fill-the-gaps',
          tier: 'standard',
          points: 15,
          contextScenario: 'Audit Logger Middleware',
          prompt: 'Complete the `except` block to log the error and re-raise the active exception while preserving its original traceback.',
          gaps: [
            { id: 'g-1', beforeText: 'except ValueError as err:\n    print("Logged:", err)\n    ', afterText: '', correctAnswer: 'raise', options: ['raise', 'return err', 'throw err', 'pass'] },
          ],
          hints: [
            'Do not pass err if you want the cleanest bare re-raise.',
            'Python uses a single keyword inside except.',
            'bare raise.',
          ],
        },
        {
          id: 'd17-s3-ex3',
          title: 'Scenario: Inheriting Custom Exceptions',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'SDK Error Hierarchy',
          prompt: 'Which built-in class should custom application exceptions inherit from?',
          options: [
            { id: 'opt-1', text: 'Exception', explanation: 'Correct! Inherit from Exception (not BaseException) so normal except Exception: handlers can catch it without catching SystemExit.', isCorrect: true },
            { id: 'opt-2', text: 'BaseException', explanation: 'Incorrect. BaseException is reserved for SystemExit and KeyboardInterrupt.', isCorrect: false },
            { id: 'opt-3', text: 'object', explanation: 'Incorrect. Raises TypeError when raised.', isCorrect: false },
            { id: 'opt-4', text: 'str', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Why should you avoid BaseException directly?',
            'What is the standard base class for all non-exit exceptions?',
            'Exception.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day17-sub4',
      number: 4,
      title: 'Sequence & Extended * Unpacking (head, *mid, tail)',
      summary: 'Destructure tuples, lists, and any iterable cleanly using positional targets and starred rest targets.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Destructuring Iterables with Starred Targets',
        paragraphs: [
          'Python lets you unpack any iterable on the left side of `=`: `x, y = (10, 20)`. If the number of targets does not match the iterable length, Python raises `ValueError`.',
          'With **extended iterable unpacking** (PEP 3132), you can prefix one target with `*` to capture zero or more remaining items: `first, *middle, last = [1, 2, 3, 4, 5]`.',
          'Crucially, the starred target **always binds to a `list`**—even if the input was a `tuple` or `str`, and even if 0 or 1 elements remain (`first, *rest = [99]` sets `rest = []`). Only **one** starred target is allowed per assignment.',
        ],
        keyTerms: [
          {
            term: 'Extended Unpacking',
            definition: 'Using a single `*name` target in an assignment to capture all remaining items as a list.',
          },
        ],
        bulletPoints: [
          'Only one `*` target is allowed per unpacking expression (`SyntaxError` otherwise).',
          'A `*` target always produces a `list`, even when unpacking a `tuple` or `str`.',
        ],
      },
      visualise: {
        type: 'packing-unpacking-sim',
        title: 'Packing & Unpacking (* / **) Binding Lab',
        badge: 'simulation',
        description: 'Inspect how head, *middle, tail binds positional and starred variables.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Unpacking Fixed and Variable-Length Sequences',
          runMode: 'real',
          code: `record = ("Lagos", "NG", 2024, 2025, 2026)
city, country, *years = record
first, *mid, last = [10, 20]

print("City:", city, "| Years:", years, "| Type:", type(years).__name__)
print("First:", first, "| Mid:", mid, "| Last:", last)`,
          expectedOutput: `City: Lagos | Years: [2024, 2025, 2026] | Type: list
First: 10 | Mid: [] | Last: 20`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'city, country, *years = record',
          internalEffect: 'Binds city="Lagos", country="NG", and packs remaining tuple items into a list [2024, 2025, 2026].',
        },
        {
          step: 2,
          codeLine: 3,
          instruction: 'first, *mid, last = [10, 20]',
          internalEffect: 'Binds first=10, last=20, and mid=[] because 0 items remain between them.',
        },
      ],
      apply: {
        domain: 'Log Parsing',
        contextTitle: 'Splitting CSV Header from Data Rows',
        scenario: 'Separate the header row from all body rows in a single unpacking statement.',
        code: `lines = ["id,name,role", "1,Ada,Eng", "2,Tunde,PM"]
header, *rows = lines
print("Header:", header, "| Row count:", len(rows))`,
        outcome: 'Header: id,name,role | Row count: 2',
      },
      commonMistakes: [
        {
          label: 'Using Two Starred Targets in One Assignment',
          erroneousCode: `*left, *right = [1, 2, 3, 4]  # SyntaxError!`,
          errorMessage: 'SyntaxError: multiple starred expressions in assignment',
          explanation: 'Python cannot disambiguate how many items each * target should take; only one * target is permitted.',
          correctedCode: `first, *rest = [1, 2, 3, 4]`,
        },
      ],
      sourceNotes: 'Covers sequence unpacking and PEP 3132 starred targets.',
      practise: [
        {
          id: 'd17-s4-ex1',
          title: 'Predict Output: Type & Value of Starred Target',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Telemetry Packet Slicer',
          prompt: 'Given `head, *tail = ("SYNC",)`, what does `print(head, tail, type(tail).__name__)` output?',
          options: [
            { id: 'opt-1', text: 'SYNC [] list', explanation: 'Correct! A starred target always binds to a list, even when unpacking a tuple with 0 remaining items.', isCorrect: true },
            { id: 'opt-2', text: 'SYNC () tuple', explanation: 'Incorrect. *tail is always a list.', isCorrect: false },
            { id: 'opt-3', text: 'SYNC None NoneType', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'ValueError', explanation: 'Incorrect. 1 item satisfies head while *tail takes 0 items.', isCorrect: false },
          ],
          hints: [
            'How many items are left for *tail after head="SYNC"?',
            'What type does a starred unpacking target ALWAYS produce?',
            'An empty list [] of type list.',
          ],
        },
        {
          id: 'd17-s4-ex2',
          title: 'Write Code: Extract Header, Body, and Footer',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'Batch File Parser',
          prompt: 'Unpack `packet = ["HDR", 101, 102, 103, "EOF"]` into `hdr`, `*body`, `eof` and print `f"{hdr}:{len(body)}:{eof}"`.',
          starterCode: `packet = ["HDR", 101, 102, 103, "EOF"]
# Unpack into hdr, *body, eof
`,
          solutionCode: `packet = ["HDR", 101, 102, 103, "EOF"]
hdr, *body, eof = packet
print(f"{hdr}:{len(body)}:{eof}")`,
          testCases: [
            { id: 'tc-1', label: 'Prints HDR:3:EOF', setup: '', expected: 'HDR:3:EOF', hidden: false },
          ],
          hints: [
            'Use hdr, *body, eof = packet.',
            'len(body) is 3.',
            'Print f"{hdr}:{len(body)}:{eof}".',
          ],
        },
        {
          id: 'd17-s4-ex3',
          title: 'Explain the Trace: Why Multiple * Targets Fail',
          type: 'explain-the-trace',
          tier: 'standard',
          points: 15,
          contextScenario: 'Parser Grammar Check',
          prompt: 'Explain why `a, *b, *c = [1, 2, 3, 4]` fails at parse time.',
          traceStepCode: `a, *b, *c = [1, 2, 3, 4]`,
          traceQuestion: 'What error does Python raise and why?',
          modelAnswer: 'Python raises SyntaxError: multiple starred expressions in assignment because having two * targets is ambiguous—Python cannot decide how many elements belong to *b versus *c.',
          markingCriteria: [
            { id: 'mc-1', label: 'Identifies SyntaxError and explains the ambiguity of two * targets', points: 15 },
          ],
          hints: [
            'How many * targets are allowed in a single assignment?',
            'Could Python decide where *b ends and *c begins?',
            'SyntaxError: multiple starred expressions in assignment.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day17-sub5',
      number: 5,
      title: 'Function Packing & Unpacking (*args, **kwargs, Call-Site Splatting)',
      summary: 'Accept arbitrary positional/keyword arguments with *args and **kwargs, and unpack collections at call sites.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Packing at Definition vs Unpacking at Call Site',
        paragraphs: [
          'The `*` and `**` operators have two complementary roles in functions. At **function definition** (`def fn(*args, **kwargs):`), `*args` **packs** extra positional arguments into a `tuple`, and `**kwargs` **packs** extra keyword arguments into a `dict`.',
          'At a **function call site** (`fn(*items, **options)`), `*items` **unpacks** (splats) a sequence into separate positional arguments, and `**options` **unpacks** a dictionary into separate keyword arguments.',
          'Remember the parameter order rule in `def`: regular positional parameters come first, then `*args`, then keyword-only parameters, and finally `**kwargs`.',
        ],
        keyTerms: [
          {
            term: '*args',
            definition: 'Parameter that packs 0 or more extra positional arguments into a tuple.',
          },
          {
            term: '**kwargs',
            definition: 'Parameter that packs 0 or more extra keyword arguments into a dict.',
          },
        ],
        bulletPoints: [
          'The names `args` and `kwargs` are conventions; the `*` and `**` operators do the work.',
          'Call-site `fn(*[1, 2], **{"sep": "-"})` is equivalent to `fn(1, 2, sep="-")`.',
        ],
      },
      visualise: {
        type: 'packing-unpacking-sim',
        title: '*args & **kwargs Packing Inspector',
        badge: 'simulation',
        description: 'See how positional and keyword arguments pack into tuple and dict.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Packing in def and Splatting at Call Site',
          runMode: 'real',
          code: `def build_url(base, *segments, **query):
    path = "/".join(segments)
    qs = "&".join(f"{k}={v}" for k, v in query.items())
    return f"{base}/{path}?{qs}" if qs else f"{base}/{path}"

parts = ["api", "v2", "users"]
params = {"page": 1, "active": "true"}
print(build_url("https://example.com", *parts, **params))`,
          expectedOutput: `https://example.com/api/v2/users?page=1&active=true`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 8,
          instruction: 'build_url("https://example.com", *parts, **params)',
          internalEffect: 'Unpacks parts into 3 positional args and params into page=1, active="true" keyword args.',
        },
        {
          step: 2,
          codeLine: 1,
          instruction: 'def build_url(base, *segments, **query):',
          internalEffect: 'Packs the 3 positional args into segments=("api", "v2", "users") and keywords into query={"page": 1, "active": "true"}.',
        },
      ],
      apply: {
        domain: 'API Wrappers',
        contextTitle: 'Forwarding Options to a Helper',
        scenario: 'Forward arbitrary keyword configuration to an underlying formatter.',
        code: `def greet(name, greeting="Hello", punctuation="!"):
    return f"{greeting}, {name}{punctuation}"

opts = {"greeting": "Welcome", "punctuation": "."}
print(greet("Chidi", **opts))`,
        outcome: 'Welcome, Chidi.',
      },
      commonMistakes: [
        {
          label: 'Passing a Dict Without ** When Keyword Args Are Expected',
          erroneousCode: `def cfg(port=80): return port
d = {"port": 9000}
print(cfg(d))  # Returns the dict itself instead of 9000!`,
          errorMessage: 'Logic bug: d is bound as positional argument port={"port": 9000}',
          explanation: 'Without **, a dictionary is passed as a single positional argument.',
          correctedCode: `print(cfg(**d))  # 9000`,
        },
      ],
      sourceNotes: 'Covers *args, **kwargs, and call-site unpacking.',
      practise: [
        {
          id: 'd17-s5-ex1',
          title: 'Write Code: Flexible Metrics Aggregator (*args, **kwargs)',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'Observability Tagging',
          prompt: 'Write `summarize(label, *nums, **tags)` returning `f"{label}:{sum(nums)}:{tags.get(\'env\', \'prod\')}"`. Call it with `("cpu", *[10, 20, 30], **{"env": "staging"})` and print the result.',
          starterCode: `def summarize(label, *nums, **tags):
    # Return formatted summary
    pass

print(summarize("cpu", *[10, 20, 30], **{"env": "staging"}))`,
          solutionCode: `def summarize(label, *nums, **tags):
    return f"{label}:{sum(nums)}:{tags.get('env', 'prod')}"

print(summarize("cpu", *[10, 20, 30], **{"env": "staging"}))`,
          testCases: [
            { id: 'tc-1', label: 'Prints cpu:60:staging', setup: '', expected: 'cpu:60:staging', hidden: false },
          ],
          hints: [
            'nums is a tuple of positional numbers; sum(nums) adds them.',
            'tags is a dict of keyword args; use tags.get("env", "prod").',
            'Return f"{label}:{sum(nums)}:{tags.get(\'env\', \'prod\')}".',
          ],
        },
        {
          id: 'd17-s5-ex2',
          title: 'Fix the Bug: Call-Site Dictionary Splatting',
          type: 'fix-the-bug',
          tier: 'foundation',
          points: 10,
          contextScenario: 'HTTP Client Helper',
          prompt: 'Fix the call to `connect()` so `opts` unpacks into `host` and `port` keyword arguments instead of raising `TypeError`.',
          starterCode: `def connect(host="localhost", port=80):
    return f"{host}:{port}"

opts = {"host": "api.local", "port": 443}
print(connect(opts))`,
          solutionCode: `def connect(host="localhost", port=80):
    return f"{host}:{port}"

opts = {"host": "api.local", "port": 443}
print(connect(**opts))`,
          testCases: [
            { id: 'tc-1', label: 'Prints api.local:443', setup: '', expected: 'api.local:443', hidden: false },
          ],
          hints: [
            'Passing opts directly binds the whole dict to host.',
            'Use ** to unpack a dictionary into keyword arguments.',
            'connect(**opts).',
          ],
        },
        {
          id: 'd17-s5-ex3',
          title: 'Scenario: Parameter Types of *args and **kwargs',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Decorator Wrapper Design',
          prompt: 'Inside `def wrapper(*args, **kwargs):`, what are the runtime types of `args` and `kwargs`?',
          options: [
            { id: 'opt-1', text: 'args is a tuple and kwargs is a dict.', explanation: 'Correct!', isCorrect: true },
            { id: 'opt-2', text: 'args is a list and kwargs is a set.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'args is a list and kwargs is a dict.', explanation: 'Incorrect. In def, *args packs into a tuple.', isCorrect: false },
            { id: 'opt-4', text: 'Both are tuples.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Positional packing uses an immutable sequence.',
            'Keyword packing maps names to values.',
            'tuple and dict.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day17-sub6',
      number: 6,
      title: 'enumerate() for Clean Indexed Iteration',
      summary: 'Replace manual range(len(...)) counters with Pythonic enumerate(iterable, start=...).',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Never Write i = 0; i += 1 Again',
        paragraphs: [
          'When you need both the **index** and the **item** while looping, Python’s built-in `enumerate(iterable, start=0)` yields `(index, item)` pairs lazily one at a time.',
          'Pass `start=1` whenever displaying human-friendly 1-based numbering (like menu options, leaderboard ranks, or line numbers in a file) without ever writing `i + 1` everywhere.',
          'Because `enumerate()` is a lazy iterator, it works on **any** iterable (lists, tuples, strings, generators, files)—not just indexable sequences!',
        ],
        keyTerms: [
          {
            term: 'enumerate()',
            definition: 'Built-in lazy iterator yielding (index, value) tuples starting at `start` (default 0).',
          },
        ],
        bulletPoints: [
          'Unpack directly in the loop header: `for idx, item in enumerate(items, start=1):`.',
          'Works on generators and sets where `range(len(...))` would fail.',
        ],
      },
      visualise: {
        type: 'enumerate-zip-sim',
        title: 'enumerate() & zip() Pairing Visualizer',
        badge: 'simulation',
        description: 'Inspect how enumerate(seq, start=1) produces (index, value) tuples.',
        initialConfig: {},
      },
      code: [
        {
          title: '1-Based Numbering with enumerate(start=1)',
          runMode: 'real',
          code: `cities = ["Lagos", "Abuja", "Kano"]

for rank, city in enumerate(cities, start=1):
    print(f"#{rank}: {city}")`,
          expectedOutput: `#1: Lagos
#2: Abuja
#3: Kano`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'for rank, city in enumerate(cities, start=1):',
          internalEffect: 'Yields (1, "Lagos"), (2, "Abuja"), (3, "Kano") and unpacks each tuple into rank and city.',
        },
      ],
      apply: {
        domain: 'CLI Tools',
        contextTitle: 'Numbered Validation Error Report',
        scenario: 'Print line numbers alongside non-empty config lines.',
        code: `lines = ["host=localhost", "", "port=5432"]
for line_no, text in enumerate(lines, start=1):
    if text:
        print(f"Line {line_no}: {text}")`,
        outcome: `Line 1: host=localhost
Line 3: port=5432`,
      },
      commonMistakes: [
        {
          label: 'Forgetting to Unpack the (index, item) Tuple',
          erroneousCode: `for item in enumerate(["a", "b"]):
    print(item.upper())  # AttributeError: tuple has no attribute upper!`,
          errorMessage: "AttributeError: 'tuple' object has no attribute 'upper'",
          explanation: 'enumerate() yields a 2-tuple (index, value), so unpack it into two loop variables.',
          correctedCode: `for idx, item in enumerate(["a", "b"]):
    print(idx, item.upper())`,
        },
      ],
      sourceNotes: 'Covers enumerate() and start= parameter.',
      practise: [
        {
          id: 'd17-s6-ex1',
          title: 'Write Code: 1-Based Menu Rendering with enumerate()',
          type: 'write-code',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Interactive CLI Menu',
          prompt: 'Use `enumerate(["Sync", "Export"], start=1)` to print `1. Sync` and `2. Export` on separate lines.',
          starterCode: `actions = ["Sync", "Export"]
# Use enumerate with start=1
`,
          solutionCode: `actions = ["Sync", "Export"]
for idx, act in enumerate(actions, start=1):
    print(f"{idx}. {act}")`,
          testCases: [
            { id: 'tc-1', label: 'Prints numbered menu', setup: '', expected: '1. Sync\n2. Export', hidden: false },
          ],
          hints: [
            'Pass start=1 to enumerate(actions, start=1).',
            'Unpack idx, act in the for loop.',
            'Print f"{idx}. {act}".',
          ],
        },
        {
          id: 'd17-s6-ex2',
          title: 'Fix the Bug: Unpacking enumerate() Tuples',
          type: 'fix-the-bug',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Log Line Formatter',
          prompt: 'The loop raises `AttributeError` because `entry` is a tuple `(idx, line)`. Unpack it in the `for` header so it prints `1:OK` and `2:WARN`.',
          starterCode: `logs = ["ok", "warn"]
for entry in enumerate(logs, start=1):
    print(f"{entry[0]}:{entry.upper()}")`,
          solutionCode: `logs = ["ok", "warn"]
for idx, line in enumerate(logs, start=1):
    print(f"{idx}:{line.upper()}")`,
          testCases: [
            { id: 'tc-1', label: 'Prints 1:OK and 2:WARN', setup: '', expected: '1:OK\n2:WARN', hidden: false },
          ],
          hints: [
            'enumerate() yields (index, item) 2-tuples.',
            'Unpack into idx, line in the for header.',
            'Call line.upper().',
          ],
        },
        {
          id: 'd17-s6-ex3',
          title: 'Predict Output: enumerate() on a String',
          type: 'predict-output',
          tier: 'standard',
          points: 15,
          contextScenario: 'Token Scanner',
          prompt: 'What does `print(list(enumerate("PY", start=10)))` output?',
          options: [
            { id: 'opt-1', text: "[(10, 'P'), (11, 'Y')]", explanation: 'Correct! enumerate() works on any iterable and starts counting at 10.', isCorrect: true },
            { id: 'opt-2', text: "[(0, 'P'), (1, 'Y')]", explanation: 'Incorrect. start=10 overrides default 0.', isCorrect: false },
            { id: 'opt-3', text: "[('P', 10), ('Y', 11)]", explanation: 'Incorrect. Index comes first in (index, item).', isCorrect: false },
            { id: 'opt-4', text: 'TypeError', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Is index first or value first in enumerate()?',
            'What does start=10 do?',
            '[(10, "P"), (11, "Y")].',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day17-sub7',
      number: 7,
      title: 'zip(), strict=True & Unzipping with zip(*pairs)',
      summary: 'Iterate multiple iterables in lockstep, guard against unequal lengths with strict=True, and transpose pairs.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Lockstep Pairing & Transposition',
        paragraphs: [
          'Python’s `zip(a, b, ...)` pairs corresponding elements from two or more iterables into tuples lazily: `zip(["A", "B"], [1, 2])` yields `("A", 1)` then `("B", 2)`.',
          'By default (`strict=False`), `zip()` stops silently at the **shortest** iterable, which can hide missing data bugs. In **Python 3.10+**, pass `strict=True` (`zip(keys, vals, strict=True)`) to raise `ValueError` immediately if the iterables have unequal lengths!',
          'You can also **unzip** a list of pairs back into separate tuples using `zip(*pairs)`, and build dictionaries in one line with `dict(zip(keys, values, strict=True))`.',
        ],
        keyTerms: [
          {
            term: 'zip(..., strict=True)',
            definition: 'Python 3.10+ mode that raises ValueError if zipped iterables do not have identical lengths.',
          },
          {
            term: 'zip(*pairs)',
            definition: 'Unpacking idiom that transposes rows of pairs back into separate column tuples.',
          },
        ],
        bulletPoints: [
          '`zip()` returns a lazy iterator—it is exhausted after one pass.',
          'Use `itertools.zip_longest(..., fillvalue=None)` when you want to pad shorter iterables instead of truncating.',
        ],
      },
      visualise: {
        type: 'enumerate-zip-sim',
        title: 'zip() Default vs strict=True & Unzipper',
        badge: 'simulation',
        description: 'Compare default shortest truncation, strict=True ValueError, and zip(*pairs).',
        initialConfig: {},
      },
      code: [
        {
          title: 'Pairing, Dict Building, strict=True, and Unzipping',
          runMode: 'real',
          code: `headers = ["name", "role", "level"]
row = ["Ada", "Backend", "Senior"]

profile = dict(zip(headers, row, strict=True))
pairs = [("Ada", 95), ("Tunde", 88)]
names, scores = zip(*pairs)

print("Profile:", profile)
print("Names:", names, "| Scores:", scores)`,
          expectedOutput: `Profile: {'name': 'Ada', 'role': 'Backend', 'level': 'Senior'}
Names: ('Ada', 'Tunde') | Scores: (95, 88)`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'profile = dict(zip(headers, row, strict=True))',
          internalEffect: 'Pairs each header with its column value, verifying equal lengths, and constructs a dict.',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 'names, scores = zip(*pairs)',
          internalEffect: 'Unpacks pairs into two arguments to zip(), transposing them into two tuples.',
        },
      ],
      apply: {
        domain: 'Analytics',
        contextTitle: 'Computing Pairwise Deltas Between Quarters',
        scenario: 'Compare Q1 and Q2 revenue lists side by side with zip().',
        code: `q1 = [100, 250, 400]
q2 = [130, 240, 450]
deltas = [b - a for a, b in zip(q1, q2, strict=True)]
print("Quarterly deltas:", deltas)`,
        outcome: 'Quarterly deltas: [30, -10, 50]',
      },
      commonMistakes: [
        {
          label: 'Reusing an Exhausted zip() Iterator',
          erroneousCode: `z = zip([1, 2], ["a", "b"])
print(list(z))
print(list(z))  # Empty []!`,
          errorMessage: 'Logic bug: second list(z) is [] because zip is a one-shot iterator',
          explanation: 'Convert to list/tuple once if you need to iterate over zipped pairs multiple times.',
          correctedCode: `pairs = list(zip([1, 2], ["a", "b"]))
print(pairs)
print(pairs)`,
        },
      ],
      sourceNotes: 'Covers zip(), strict=True, and zip(*pairs).',
      practise: [
        {
          id: 'd17-s7-ex1',
          title: 'Scenario: Catching Mismatched Lengths with strict=True',
          type: 'scenario-mcq',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Payroll Batch Reconciliation',
          prompt: 'An employee list has 50 IDs, but the bonus list accidentally has 49 entries. What happens if you run `zip(emp_ids, bonuses, strict=True)` and convert it to a `list`?',
          options: [
            { id: 'opt-1', text: 'ValueError is raised when the shorter iterable runs out, preventing silent data truncation.', explanation: 'Correct! strict=True (Python 3.10+) enforces equal lengths.', isCorrect: true },
            { id: 'opt-2', text: 'It pads the 50th employee with None.', explanation: 'Incorrect. That requires itertools.zip_longest.', isCorrect: false },
            { id: 'opt-3', text: 'It silently drops the 50th employee.', explanation: 'Incorrect. That is strict=False (the default).', isCorrect: false },
            { id: 'opt-4', text: 'IndexError is raised before iteration starts.', explanation: 'Incorrect. zip raises ValueError when exhaustion mismatches.', isCorrect: false },
          ],
          hints: [
            'What does strict=True check in Python 3.10+?',
            'Does it pad, drop, or raise ValueError?',
            'Raises ValueError.',
          ],
        },
        {
          id: 'd17-s7-ex2',
          title: 'Write Code: Unzipping Columnar Pairs',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'Chart Series Extraction',
          prompt: 'Unzip `rows = [("Mon", 12), ("Tue", 18), ("Wed", 15)]` into `days` and `counts` using `zip(*rows)` and print `days` and `sum(counts)`.',
          starterCode: `rows = [("Mon", 12), ("Tue", 18), ("Wed", 15)]
# Unzip into days and counts
`,
          solutionCode: `rows = [("Mon", 12), ("Tue", 18), ("Wed", 15)]
days, counts = zip(*rows)
print(days, sum(counts))`,
          testCases: [
            { id: 'tc-1', label: "Prints ('Mon', 'Tue', 'Wed') 45", setup: '', expected: "('Mon', 'Tue', 'Wed') 45", hidden: false },
          ],
          hints: [
            'Splat rows into zip(*rows).',
            'Unpack into days, counts.',
            'Print days, sum(counts).',
          ],
        },
        {
          id: 'd17-s7-ex3',
          title: 'Fill the Gaps: Building a Dict from Two Lists',
          type: 'fill-the-gaps',
          tier: 'foundation',
          points: 10,
          contextScenario: 'CSV Row Mapping',
          prompt: 'Complete the expression to map `keys` to `vals` into a dictionary while enforcing equal lengths.',
          gaps: [
            { id: 'g-1', beforeText: 'record = dict(', afterText: '(keys, vals, strict=True))', correctAnswer: 'zip', options: ['zip', 'enumerate', 'map', 'pair'] },
          ],
          hints: [
            'Which built-in pairs elements from two iterables?',
            'It accepts strict=True.',
            'zip.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day17-sub8',
      number: 8,
      title: 'Spreading Dictionaries ({**a, **b}, |) & Idiomatic Pipelines',
      summary: 'Merge configuration dictionaries cleanly with ** spreading or | and combine exception handling with zip/enumerate.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Dictionary Merging & Clean Data Pipelines',
        paragraphs: [
          'Just as `*` spreads a list into another list (`[*a, *b]`), `**` spreads a dictionary into a new dictionary literal: `merged = {**defaults, **overrides}`.',
          'In **Python 3.9+**, the dictionary union operator `|` (`defaults | overrides`) does the exact same non-mutating merge with even cleaner syntax. In both forms, when keys collide, the **right-hand dictionary wins**.',
          'Combining `enumerate()`, `zip()`, `*` unpacking, and targeted `try/except` lets you build concise, readable data-processing pipelines where each record is numbered, paired, validated, and safely reported.',
        ],
        keyTerms: [
          {
            term: '{**a, **b} / a | b',
            definition: 'Non-mutating dictionary merge expressions where right-side keys overwrite left-side keys.',
          },
        ],
        bulletPoints: [
          'Neither `{**a, **b}` nor `a | b` mutates `a` or `b`—both return a brand-new `dict`.',
          'Use `a |= b` when you explicitly want to update `a` in-place.',
        ],
      },
      visualise: {
        type: 'packing-unpacking-sim',
        title: 'Dictionary Spread ({**defaults, **env}) Inspector',
        badge: 'simulation',
        description: 'Inspect how right-hand keys override left-hand defaults without mutating inputs.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Non-Mutating Config Merge & Safe Row Pipeline',
          runMode: 'real',
          code: `defaults = {"timeout": 5, "retries": 2, "region": "eu-west"}
overrides = {"timeout": 15, "debug": True}

config = {**defaults, **overrides}
config_pipe = defaults | overrides

print("Config:", config)
print("Same as | ?", config == config_pipe)
print("Defaults untouched:", defaults["timeout"])`,
          expectedOutput: `Config: {'timeout': 15, 'retries': 2, 'region': 'eu-west', 'debug': True}
Same as | ? True
Defaults untouched: 5`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'config = {**defaults, **overrides}',
          internalEffect: 'Copies defaults into a new dict and overwrites colliding keys ("timeout") with overrides.',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: 'config_pipe = defaults | overrides',
          internalEffect: 'Uses Python 3.9+ dict union operator to produce the identical merged dictionary.',
        },
      ],
      apply: {
        domain: 'ETL Pipelines',
        contextTitle: 'Validating Paired Records with Row Numbers',
        scenario: 'Pair names and raw scores with zip, track 1-based row numbers with enumerate, and catch ValueError per row.',
        code: `names = ["Ada", "Tunde", "Kemi"]
raw_scores = ["92", "bad", "85"]

for row_num, (name, raw) in enumerate(zip(names, raw_scores, strict=True), start=1):
    try:
        print(f"Row {row_num}: {name} -> {int(raw)}")
    except ValueError:
        print(f"Row {row_num}: {name} -> INVALID ({raw!r})")`,
        outcome: `Row 1: Ada -> 92
Row 2: Tunde -> INVALID ('bad')
Row 3: Kemi -> 85`,
      },
      commonMistakes: [
        {
          label: 'Expecting Left-Hand Keys to Win in {**a, **b}',
          erroneousCode: `a = {"x": 1}
b = {"x": 99}
res = {**a, **b}  # res["x"] is 99, NOT 1!`,
          errorMessage: 'Logic bug: later keys always overwrite earlier keys',
          explanation: 'Dictionary spreading evaluates left-to-right; put base defaults on the left and overrides on the right.',
          correctedCode: `res = {**b, **a}  # If a should win, put a on the right`,
        },
      ],
      sourceNotes: 'Covers dict spreading, | operator, and combined pipelines.',
      practise: [
        {
          id: 'd17-s8-ex1',
          title: 'Predict Output: Dictionary Spread Precedence',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Feature Flag Resolution',
          prompt: 'Given `base = {"dark": False, "beta": False}` and `user = {"beta": True}`, what does `print({**base, **user})` output?',
          options: [
            { id: 'opt-1', text: "{'dark': False, 'beta': True}", explanation: 'Correct! Right-hand keys overwrite left-hand keys.', isCorrect: true },
            { id: 'opt-2', text: "{'dark': False, 'beta': False}", explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: "{'beta': True}", explanation: 'Incorrect. Non-colliding keys from base are preserved.', isCorrect: false },
            { id: 'opt-4', text: 'TypeError', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Which dictionary wins on colliding key "beta"?',
            'Are non-colliding keys from base kept?',
            "{'dark': False, 'beta': True}.",
          ],
        },
        {
          id: 'd17-s8-ex2',
          title: 'Write Code: Safe Paired Record Pipeline',
          type: 'write-code',
          tier: 'project',
          points: 20,
          contextScenario: 'IoT Telemetry Ingestion',
          prompt: 'Iterate over `sensors = ["S1", "S2"]` and `readings = ["24", "err"]` using `enumerate(zip(sensors, readings, strict=True), start=1)`. Inside `try/except ValueError`, print `1:S1=24` or `2:S2=BAD`.',
          starterCode: `sensors = ["S1", "S2"]
readings = ["24", "err"]
# Combine enumerate, zip(..., strict=True), and try/except ValueError
`,
          solutionCode: `sensors = ["S1", "S2"]
readings = ["24", "err"]
for idx, (sid, raw) in enumerate(zip(sensors, readings, strict=True), start=1):
    try:
        val = int(raw)
        print(f"{idx}:{sid}={val}")
    except ValueError:
        print(f"{idx}:{sid}=BAD")`,
          testCases: [
            { id: 'tc-1', label: 'Prints 1:S1=24 and 2:S2=BAD', setup: '', expected: '1:S1=24\n2:S2=BAD', hidden: false },
          ],
          hints: [
            'Unpack idx, (sid, raw) from enumerate(zip(...), start=1).',
            'Convert int(raw) inside try.',
            'Catch ValueError and print f"{idx}:{sid}=BAD".',
          ],
        },
        {
          id: 'd17-s8-ex3',
          title: 'Scenario: Non-Mutating Dict Merge Operator (|)',
          type: 'scenario-mcq',
          tier: 'standard',
          points: 15,
          contextScenario: 'Immutable Config Pipeline',
          prompt: 'Which statement about `merged = defaults | overrides` in Python 3.9+ is TRUE?',
          options: [
            { id: 'opt-1', text: 'It returns a new dictionary without mutating defaults or overrides, with overrides winning on key collisions.', explanation: 'Correct! Use |= if you want in-place mutation.', isCorrect: true },
            { id: 'opt-2', text: 'It mutates defaults in-place.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'It raises KeyError if a key appears in both dicts.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'It only works on sets, not dicts.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Does | mutate its operands or return a new object?',
            'Which side wins when keys collide?',
            'New dict, right-hand wins.',
          ],
        },
      ],
      assess: [],
    },
  ],
  realWorldLabs: [
    {
      id: 'day17-lab1',
      title: 'Resilient Inventory CSV Batch Validator',
      description: 'Pair SKU codes with raw quantity strings using enumerate(zip(..., strict=True), start=1) and handle ValueError per row without halting the batch.',
      domain: 'Supply Chain & Inventory',
      starterCode: `skus = ["SKU-A", "SKU-B", "SKU-C"]
raw_qtys = ["12", "N/A", "8"]
valid_stock = {}

for row, (sku, raw) in enumerate(zip(skus, raw_qtys, strict=True), start=1):
    try:
        valid_stock[sku] = int(raw)
    except ValueError:
        print(f"Row {row} skipped ({sku}: {raw!r})")

print("Valid stock:", valid_stock)`,
      targetOutput: `Row 2 skipped (SKU-B: 'N/A')
Valid stock: {'SKU-A': 12, 'SKU-C': 8}`,
    },
    {
      id: 'day17-lab2',
      title: 'Multi-Tenant Config Merger & Call-Site Splatting',
      description: 'Merge base and tenant configuration dicts with | and unpack the resulting kwargs into a service initializer.',
      domain: 'Cloud Platform',
      starterCode: `def init_service(region="eu-west", timeout=5, retries=2):
    return f"region={region}, timeout={timeout}, retries={retries}"

base_cfg = {"region": "eu-west", "timeout": 5}
tenant_cfg = {"timeout": 20, "retries": 4}
merged = base_cfg | tenant_cfg

print(init_service(**merged))`,
      targetOutput: `region=eu-west, timeout=20, retries=4`,
    },
  ],
  miniProject: {
    id: 'day17-project',
    title: 'Resilient Batch Record & Config Merger',
    brief: 'Build a fault-tolerant batch ingestion utility that merges configuration overrides, pairs parallel columns with zip(strict=True), tracks 1-based row numbers with enumerate(), and isolates bad records with targeted try/except/else/finally.',
    requirements: [
      'Merge default and override config dictionaries non-destructively using {**a, **b} or |',
      'Pair parallel column lists with zip(..., strict=True) and enumerate(..., start=1)',
      'Handle ValueError and KeyError with targeted except blocks (never bare except:)',
      'Use else for post-validation success accounting and finally for batch summary/cleanup',
      'Raise a custom BatchValidationError when the entire batch is empty or structurally mismatched',
    ],
    rubric: [
      { criterion: 'Targeted try/except/else/finally and custom Exception design', weight: 40 },
      { criterion: 'Clean * / ** packing, unpacking, and non-mutating dict merging', weight: 30 },
      { criterion: 'Accurate enumerate(start=1) and zip(strict=True) usage', weight: 30 },
    ],
    starterCode: `# Resilient Batch Record & Config Merger
class BatchValidationError(Exception):
    pass

def ingest_batch(keys, values, **config_overrides):
    # Merge config, validate lengths, and process rows safely
    pass
`,
  },
  dayQuiz: {
    title: 'Day 17 Mastery Checkpoint Quiz: Exception Handling, Packing, Unpacking, Enumerate & Zip',
    passingScorePercentage: 80,
    questions: [
      {
        id: 'd17-q1',
        scenario: 'Bare Except',
        question: 'Why should you avoid writing a bare `except:` clause in production Python?',
        options: [
          { id: 'q1-a', text: 'It catches every BaseException, silently masking bugs like NameError and even KeyboardInterrupt.', explanation: 'Correct!', isCorrect: true },
          { id: 'q1-b', text: 'It is a SyntaxError in Python 3.12.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q1-c', text: 'It only catches ValueError.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q1-d', text: 'It prevents finally from running.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd17-q2',
        scenario: 'else Clause',
        question: 'When does the `else:` block in a `try / except / else / finally` statement execute?',
        options: [
          { id: 'q2-a', text: 'Only when try completes normally with zero exceptions and no early return/break.', explanation: 'Correct!', isCorrect: true },
          { id: 'q2-b', text: 'Only when an exception is caught by except.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q2-c', text: 'Always, just like finally.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q2-d', text: 'Only when finally fails.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd17-q3',
        scenario: 'finally Guarantee',
        question: 'If a `try` block executes `return 42`, does the `finally` block still run?',
        options: [
          { id: 'q3-a', text: 'Yes, finally always executes before the function returns 42.', explanation: 'Correct!', isCorrect: true },
          { id: 'q3-b', text: 'No, return exits immediately.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q3-c', text: 'Only if an exception was raised.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q3-d', text: 'Only if else also runs.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd17-q4',
        scenario: 'Re-Raising',
        question: 'Inside an `except` block, how do you re-raise the caught exception while preserving its original traceback?',
        options: [
          { id: 'q4-a', text: 'Use a bare raise statement.', explanation: 'Correct!', isCorrect: true },
          { id: 'q4-b', text: 'Use raise Exception("again").', explanation: 'Incorrect. Replaces the exception type and traceback.', isCorrect: false },
          { id: 'q4-c', text: 'Use return.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q4-d', text: 'Use continue.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd17-q5',
        scenario: 'Extended Unpacking',
        question: 'Given `a, *b, c = (10, 20, 30, 40)`, what is `b`?',
        options: [
          { id: 'q5-a', text: '[20, 30] (a list)', explanation: 'Correct! Starred targets always bind to a list.', isCorrect: true },
          { id: 'q5-b', text: '(20, 30) (a tuple)', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q5-c', text: '20', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q5-d', text: 'SyntaxError', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd17-q6',
        scenario: 'Function Packing',
        question: 'In `def fn(a, *args, **kwargs):`, what types do `args` and `kwargs` have?',
        options: [
          { id: 'q6-a', text: 'args is a tuple, kwargs is a dict.', explanation: 'Correct!', isCorrect: true },
          { id: 'q6-b', text: 'args is a list, kwargs is a dict.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q6-c', text: 'args is a dict, kwargs is a tuple.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q6-d', text: 'Both are lists.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd17-q7',
        scenario: 'enumerate()',
        question: 'What does `list(enumerate(["x", "y"], start=1))` produce?',
        options: [
          { id: 'q7-a', text: '[(1, "x"), (2, "y")]', explanation: 'Correct!', isCorrect: true },
          { id: 'q7-b', text: '[(0, "x"), (1, "y")]', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q7-c', text: '[("x", 1), ("y", 2)]', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q7-d', text: '{"x": 1, "y": 2}', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd17-q8',
        scenario: 'zip(strict=True)',
        question: 'What does `list(zip([1, 2, 3], ["a", "b"], strict=True))` do?',
        options: [
          { id: 'q8-a', text: 'Raises ValueError because the iterables have different lengths.', explanation: 'Correct!', isCorrect: true },
          { id: 'q8-b', text: 'Returns [(1, "a"), (2, "b")].', explanation: 'Incorrect. That happens when strict=False.', isCorrect: false },
          { id: 'q8-c', text: 'Pads with None.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q8-d', text: 'Raises KeyError.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd17-q9',
        scenario: 'Unzipping',
        question: 'If `pairs = [(1, "a"), (2, "b")]`, what does `nums, letters = zip(*pairs)` bind `nums` to?',
        options: [
          { id: 'q9-a', text: '(1, 2)', explanation: 'Correct! zip(*pairs) transposes pairs into column tuples.', isCorrect: true },
          { id: 'q9-b', text: '[1, 2]', explanation: 'Incorrect. zip yields tuples.', isCorrect: false },
          { id: 'q9-c', text: '(1, "a")', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q9-d', text: 'TypeError', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd17-q10',
        scenario: 'Dictionary Merging',
        question: 'What does `{"a": 1, "b": 2} | {"b": 99, "c": 3}` evaluate to?',
        options: [
          { id: 'q10-a', text: '{"a": 1, "b": 99, "c": 3}', explanation: 'Correct! Right-hand keys win on collision without mutating inputs.', isCorrect: true },
          { id: 'q10-b', text: '{"a": 1, "b": 2, "c": 3}', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q10-c', text: 'TypeError', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q10-d', text: '{"b": 99, "c": 3}', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
    ],
  },
  cheatSheet: [
    {
      category: 'Targeted try / except & Exception Tuples',
      syntax: 'try: ... except (ValueError, TypeError) as err: ...',
      description: 'Catch specific exception types (most specific subclass first) and bind with as err. Never use bare except: which hides NameError and KeyboardInterrupt.',
      example: `try:
    n = int("bad")
except (ValueError, TypeError) as err:
    print(type(err).__name__, "->", err)`,
    },
    {
      category: 'else & finally Control-Flow Guarantees',
      syntax: 'try: ... except E: ... else: ... finally: ...',
      description: 'else runs only if try finished with no exception and no early return/break. finally ALWAYS runs—even on unhandled exceptions or early return.',
      example: `try:
    val = int("42")
except ValueError:
    val = 0
else:
    print("Clean parse:", val)
finally:
    print("Cleanup complete")`,
    },
    {
      category: 'raise, Bare Re-Raise & Custom Exception Subclasses',
      syntax: 'class DomainError(Exception): pass | raise',
      description: 'Inherit custom errors from Exception (not BaseException). Use bare raise inside except to propagate an error with its original traceback intact.',
      example: `class QuotaError(Exception):
    pass
try:
    raise QuotaError("Limit reached")
except QuotaError as e:
    print("Handled:", e)`,
    },
    {
      category: 'Sequence & Extended * Unpacking (head, *mid, tail)',
      syntax: 'first, *middle, last = iterable',
      description: 'One * target captures 0 or more remaining items and ALWAYS binds to a list—even when unpacking a tuple or string.',
      example: `hdr, *body, eof = ("HDR", 10, 20, "EOF")
print(hdr, body, eof, "| type:", type(body).__name__)`,
    },
    {
      category: 'Function Packing (*args, **kwargs) & Call-Site Splatting',
      syntax: 'def fn(a, *args, **kwargs): ... | fn(*seq, **mapping)',
      description: 'In def, *args packs positional args into a tuple and **kwargs packs keywords into a dict. At a call site, * and ** unpack collections into arguments.',
      example: `def tag(name, *nums, **meta):
    return f"{name}:{sum(nums)}:{meta.get('env')}"
print(tag("api", *[2, 3], **{"env": "prod"}))`,
    },
    {
      category: 'enumerate(iterable, start=1)',
      syntax: 'for idx, item in enumerate(seq, start=1): ...',
      description: 'Yields (index, item) pairs lazily for any iterable, eliminating manual counter variables.',
      example: `for rank, city in enumerate(["Lagos", "Abuja"], start=1):
    print(f"#{rank}: {city}")`,
    },
    {
      category: 'zip(), strict=True & Unzipping with zip(*pairs)',
      syntax: 'zip(a, b, strict=True) | cols_a, cols_b = zip(*pairs)',
      description: 'Pairs iterables lazily. Pass strict=True (Python 3.10+) to raise ValueError on unequal lengths instead of silently truncating. Use zip(*pairs) to transpose.',
      example: `profile = dict(zip(["id", "role"], [1, "Eng"], strict=True))
names, scores = zip(*[("Ada", 95), ("Tunde", 88)])
print(profile, names, scores)`,
    },
    {
      category: 'Dictionary Spreading ({**a, **b}) & Union Operator (|)',
      syntax: 'merged = {**defaults, **overrides} | defaults | overrides',
      description: 'Non-mutating dictionary merges where right-hand keys overwrite colliding left-hand keys.',
      example: `base = {"timeout": 5, "retries": 2}
env = {"timeout": 15}
print(base | env, "| untouched:", base["timeout"])`,
    },
  ],
  sourceNotes: [
    'Curriculum reference: https://github.com/Asabeneh/30-Days-Of-Python/tree/master/17_Day_Exception_handling',
  ],
};
