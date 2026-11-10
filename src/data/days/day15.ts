/**
 * Day 15: Python Type Errors (Intermediate Python)
 * Part A (Learn) conforming to Sections 10, 13.2, and 14 of the Master Specification.
 * Includes:
 *  - 7 Detailed Subtopics following the 10-step pedagogical structure
 *  - 3 Signature Simulations: traceback-anatomy-sim, error-classifier-sim, debugging-workflow-sim
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_15_MODULE: DayModule = {
  schemaVersion: 1,
  number: 15,
  title: 'Python Type Errors',
  level: 'intermediate',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/15_Day_Python_type_errors',
  estimatedMinutes: 60,
  prerequisites: [2, 11],
  objectives: [
    'Read Python tracebacks bottom-up from the exception line to the root cause frame',
    'Distinguish compile-time errors (SyntaxError, IndentationError) from runtime exceptions',
    'Diagnose and fix NameError, UnboundLocalError, TypeError, and ValueError quickly',
    'Prevent IndexError, KeyError, AttributeError, ZeroDivisionError, and ImportError',
    'Apply a systematic 5-step debugging workflow using repr(), type(), and assert',
  ],
  subtopics: [
    {
      id: 'day15-sub1',
      number: 1,
      title: 'Reading Python Tracebacks (most recent call last)',
      summary: 'Decode Python traceback frames bottom-up to separate where an error surfaced from where bad data entered.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Every Traceback Is a Map, Not a Failure',
        paragraphs: [
          'When an unhandled exception occurs, Python prints a **traceback** starting with `Traceback (most recent call last):`. That header tells you the exact order of the frames: the **oldest call** (entry point) is at the top, and the **most recent call** (where the exception actually raised) is at the **bottom**.',
          'Always read a traceback **bottom-up**: start at the final `ExceptionType: message` line, look at the bottom frame’s file, line number, and `^^^` caret indicator, and then trace upward to see how invalid data arrived there.',
          'Remember: the line that crashes is often *downstream* from the real bug (for example, passing a string `"99.50"` from `main.py` into `apply_tax()`).',
        ],
        keyTerms: [
          {
            term: 'Traceback',
            definition: 'A report of active call stack frames printed when an unhandled exception occurs.',
          },
          {
            term: 'Most Recent Call Last',
            definition: 'Python’s convention of placing the newest (crashing) stack frame at the bottom of the traceback.',
          },
        ],
        bulletPoints: [
          'Read bottom-up: Exception message first, then bottom frame, then callers above.',
          'Python 3.11+ highlights the exact sub-expression with ~~~^^^ carets.',
        ],
      },
      visualise: {
        type: 'traceback-anatomy-sim',
        title: 'Traceback Anatomy & Stack Frame Reader',
        badge: 'simulation',
        description: 'Click through stack frames to trace how a bug propagates from caller to crashing line.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Inspecting Exception Type & Message Safely',
          runMode: 'real',
          code: `def apply_tax(amount):
    return amount * 1.08

try:
    apply_tax("99.50")
except TypeError as err:
    print("Caught:", type(err).__name__, "->", err)`,
          expectedOutput: `Caught: TypeError -> can't multiply sequence by non-int of type 'float'`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 5,
          instruction: 'apply_tax("99.50")',
          internalEffect: 'Passes a str into apply_tax, where amount * 1.08 fails at runtime.',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 'except TypeError as err:',
          internalEffect: 'Captures the exception object so we can inspect type(err).__name__ and its message.',
        },
      ],
      apply: {
        domain: 'Observability',
        contextTitle: 'Logging Structured Error Context',
        scenario: 'Log both the exception class name and detail message when parsing fails.',
        code: `raw = "not_a_number"
try:
    val = int(raw)
except ValueError as e:
    print(f"Error [{type(e).__name__}]: {e}")`,
        outcome: `Error [ValueError]: invalid literal for int() with base 10: 'not_a_number'`,
      },
      commonMistakes: [
        {
          label: 'Reading Only the Top Line of a Traceback',
          erroneousCode: `# Ignoring the bottom frame and blaming main.py line 1!
# Traceback (most recent call last):
#   File "main.py", line 1, in <module>
#   File "math_ops.py", line 14, in divide -> ZeroDivisionError`,
          errorMessage: 'Misdiagnosis: wastes time debugging line 1 instead of math_ops.py line 14',
          explanation: 'The top frame is just where execution started; the bottom frame is where the exception actually occurred.',
          correctedCode: `# Always start at the bottom:
# ZeroDivisionError in math_ops.py line 14`,
        },
      ],
      sourceNotes: 'Covers traceback reading for Day 15.',
      practise: [
        {
          id: 'd15-s1-ex1',
          title: 'Scenario: Bottom-Up Traceback Reading',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Production Crash Triage',
          prompt: 'A traceback lists `app.py:40` at the top, `service.py:18` in the middle, and `parser.py:7` at the bottom above `ValueError: invalid literal`. Where did the exception actually raise?',
          options: [
            { id: 'opt-1', text: 'In parser.py at line 7 (the bottommost frame).', explanation: 'Correct! "most recent call last" puts the crashing frame at the bottom.', isCorrect: true },
            { id: 'opt-2', text: 'In app.py at line 40.', explanation: 'Incorrect. That is the oldest entry frame.', isCorrect: false },
            { id: 'opt-3', text: 'In service.py at line 18.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'Python prints frames in random order.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Remember the header: Traceback (most recent call last).',
            'Where is the most recent call placed?',
            'Always read from the bottom exception line upward.',
          ],
        },
        {
          id: 'd15-s1-ex2',
          title: 'Theory: Crash Site vs Root Cause',
          type: 'theory-reasoning',
          tier: 'standard',
          points: 15,
          contextScenario: 'Upstream Bad Input',
          prompt: 'Why is the bottommost line in a traceback sometimes *not* where the bug was introduced?',
          modelAnswer: 'The bottommost frame is where an invalid operation finally failed (e.g., dividing or multiplying a string), whereas the bad value (like "99.50" instead of 99.50) may have been passed in by an earlier caller frame higher up in the traceback.',
          markingCriteria: [
            { id: 'mc-1', label: 'Distinguishes crash site (bottom frame) from origin of bad data (caller frame above)', points: 15 },
          ],
          hints: [
            'Can a string travel through two functions before failing?',
            'Think about main() -> checkout("10") -> apply_tax().',
            'Where did the wrong type enter?',
          ],
        },
        {
          id: 'd15-s1-ex3',
          title: 'Predict Output: Formatting Caught Exception Type',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Structured Error Logger',
          prompt: 'What does `try: int("x")\nexcept Exception as e: print(type(e).__name__)` output?',
          options: [
            { id: 'opt-1', text: 'ValueError', explanation: 'Correct! type(e).__name__ returns the exception class name string.', isCorrect: true },
            { id: 'opt-2', text: 'TypeError', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'Exception', explanation: 'Incorrect. e’s runtime class is ValueError.', isCorrect: false },
            { id: 'opt-4', text: 'SyntaxError', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'What exception does int("x") raise?',
            'What does type(e).__name__ return?',
            'ValueError.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day15-sub2',
      number: 2,
      title: 'SyntaxError & IndentationError (Parse-Time Errors)',
      summary: 'Recognize grammar and whitespace errors caught by Python’s parser before any line of code runs.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Caught Before Execution: SyntaxError & IndentationError',
        paragraphs: [
          'Before Python executes a single instruction, its parser compiles your source text into bytecode. If your code violates Python grammar—missing a colon `:`, unclosed parenthesis `(`, mismatched quotes, or using `=` instead of `==` in an `if`—Python raises **`SyntaxError`**.',
          '**`IndentationError`** (and its subclass `TabError`) is a specialized `SyntaxError` raised when block indentation is inconsistent, missing after a colon, or mixes tabs and spaces.',
          'Because parse-time errors happen *before* runtime, **`try/except SyntaxError:` in the same file cannot catch them**! Also, if Python points to line N, always check **line N-1** for an unclosed bracket or parenthesis.',
        ],
        keyTerms: [
          {
            term: 'SyntaxError',
            definition: 'A compile-time grammar error preventing Python from parsing the source file.',
          },
          {
            term: 'IndentationError',
            definition: 'A SyntaxError subclass caused by unexpected, missing, or inconsistent block indentation.',
          },
        ],
        bulletPoints: [
          'Common triggers: missing :, unclosed (, = instead of ==, reserved keyword as variable.',
          'If SyntaxError points to line 10, check line 9 for an unclosed ( or [.',
        ],
      },
      visualise: {
        type: 'error-classifier-sim',
        title: 'Compile-Time vs Runtime Error Classifier',
        badge: 'simulation',
        description: 'Compare SyntaxError parse-time failures against runtime exceptions.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Inspecting SyntaxError via compile()',
          runMode: 'real',
          code: `bad_snippet = "if True\\n    print('ok')"
try:
    compile(bad_snippet, "<demo>", "exec")
except SyntaxError as e:
    print(type(e).__name__, "at line", e.lineno, ":", e.msg)`,
          expectedOutput: `SyntaxError at line 1 : expected ':'`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'compile(bad_snippet, "<demo>", "exec")',
          internalEffect: 'Invokes Python’s parser on the string, raising SyntaxError for the missing colon on line 1.',
        },
      ],
      apply: {
        domain: 'Code Quality Tooling',
        contextTitle: 'Pre-Flight Syntax Validation',
        scenario: 'Validate a dynamically generated Python snippet before executing it.',
        code: `src = "x = (1 + 2)"
compile(src, "<check>", "exec")
print("Syntax valid!")`,
        outcome: `Syntax valid!`,
      },
      commonMistakes: [
        {
          label: 'Forgetting a Closing Parenthesis on the Previous Line',
          erroneousCode: `total = sum([1, 2, 3]
print(total)`,
          errorMessage: "SyntaxError: '(' was never closed",
          explanation: 'An unclosed ( or [ on line 1 causes the parser to fail on line 2. Always check the line above.',
          correctedCode: `total = sum([1, 2, 3])
print(total)`,
        },
      ],
      sourceNotes: 'Covers SyntaxError & IndentationError from Asabeneh Day 15.',
      practise: [
        {
          id: 'd15-s2-ex1',
          title: 'Scenario: Why try/except Cannot Catch SyntaxError in Same File',
          type: 'scenario-mcq',
          tier: 'standard',
          points: 15,
          contextScenario: 'Parser vs Runtime Phases',
          prompt: 'If a script contains `try:\n    if True print("hi")\nexcept SyntaxError:\n    print("caught")`, what happens when you run it?',
          options: [
            { id: 'opt-1', text: 'Python fails with SyntaxError at compile/parse time before the try block ever runs.', explanation: 'Correct! The entire file must parse cleanly before runtime execution begins.', isCorrect: true },
            { id: 'opt-2', text: 'It prints "caught".', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'It prints "hi".', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'It raises NameError.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'When does Python check syntax: before running or during try?',
            'Can try/except intercept parse-time errors in the same module?',
            'The file fails to compile before line 1 executes.',
          ],
        },
        {
          id: 'd15-s2-ex2',
          title: 'Fix the Bug: Unclosed Parenthesis & Missing Colon',
          type: 'fix-the-bug',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Config Guard Script',
          prompt: 'Fix both syntax errors so the snippet prints `Ready`.',
          starterCode: `ports = list((80, 443)
if 443 in ports
    print("Ready")`,
          solutionCode: `ports = list((80, 443))
if 443 in ports:
    print("Ready")`,
          testCases: [
            { id: 'tc-1', label: 'Prints Ready', setup: '', expected: 'Ready', hidden: false },
          ],
          hints: [
            'Count opening and closing parentheses on line 1.',
            'Check the end of the if header on line 2.',
            'Add ) on line 1 and : on line 2.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day15-sub3',
      number: 3,
      title: 'NameError & UnboundLocalError (Scope & Naming)',
      summary: 'Diagnose undefined identifiers, misspelled names, and local-before-assignment scoping errors.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Missing or Shadowed Bindings: NameError & UnboundLocalError',
        paragraphs: [
          '**`NameError`** occurs at runtime when Python looks up an identifier across LEGB scopes (Local -> Enclosing -> Global -> Built-in) and finds nothing bound to that name. Common causes are typos (`usrname`), forgetting an `import`, or referencing a variable defined only inside an `if` branch that did not run.',
          '**`UnboundLocalError`** is a subclass of `NameError` inside a function: it happens when you read a variable and *also* assign to it later in the same function body (`count += 1` without `global` or `nonlocal`).',
        ],
        keyTerms: [
          {
            term: 'NameError',
            definition: 'Raised when an identifier cannot be found in any accessible LEGB scope.',
          },
          {
            term: 'UnboundLocalError',
            definition: 'Raised when a local variable inside a function is referenced before its assignment executes.',
          },
        ],
        bulletPoints: [
          'Check spelling and capitalization (Python is case-sensitive).',
          'Initialize variables before conditional branches so all paths bind them.',
        ],
      },
      visualise: {
        type: 'error-classifier-sim',
        title: 'NameError Diagnostic Inspector',
        badge: 'simulation',
        description: 'Inspect NameError triggers and fixes.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Catching NameError & Fixing UnboundLocalError',
          runMode: 'real',
          code: `try:
    print(undefined_var)
except NameError as e:
    print("Caught:", e)

def safe_bump(val):
    return val + 1

print("Bumped:", safe_bump(10))`,
          expectedOutput: `Caught: name 'undefined_var' is not defined
Bumped: 11`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'print(undefined_var)',
          internalEffect: 'LEGB lookup fails to find undefined_var and raises NameError.',
        },
      ],
      apply: {
        domain: 'Defensive Coding',
        contextTitle: 'Initializing Conditional Variables',
        scenario: 'Avoid NameError when an if-branch does not execute.',
        code: `status = "unknown"
code = 200
if code == 200:
    status = "ok"
print("Status:", status)`,
        outcome: `Status: ok`,
      },
      commonMistakes: [
        {
          label: 'Using a Variable Before Assignment Inside a Function',
          erroneousCode: `total = 10
def add_five():
    total += 5
    return total
add_five()`,
          errorMessage: "UnboundLocalError: cannot access local variable 'total' where it is not associated with a value",
          explanation: 'total += 5 marks total as local to add_five(). Pass total as a parameter instead.',
          correctedCode: `def add_five(total):
    return total + 5
print(add_five(10))`,
        },
      ],
      sourceNotes: 'Covers NameError from Asabeneh Day 15.',
      practise: [
        {
          id: 'd15-s3-ex1',
          title: 'Explain Trace: UnboundLocalError Inside Function',
          type: 'explain-the-trace',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Counter Scope Bug',
          prompt: 'Explain why `count = 0\ndef inc():\n    count += 1\ninc()` raises `UnboundLocalError` instead of incrementing global `count`.',
          traceStepCode: `count = 0
def inc():
    count += 1
inc()`,
          traceQuestion: 'Why does Python classify `count` as local inside `inc()`?',
          modelAnswer: 'Because count += 1 is an assignment inside inc(), Python compiles count as a local variable for the entire function body. When inc() runs, it tries to read local count before any local value was assigned, raising UnboundLocalError.',
          markingCriteria: [
            { id: 'mc-1', label: 'Explains assignment (count += 1) marks count as local at compile time', points: 10 },
            { id: 'mc-2', label: 'Explains reading before local assignment causes UnboundLocalError', points: 10 },
          ],
          hints: [
            'Is count += 1 an assignment inside inc()?',
            'How does Python decide if a variable is local?',
            'Pass count as a parameter and return count + 1.',
          ],
        },
        {
          id: 'd15-s3-ex2',
          title: 'Fill the Gaps: Preventing NameError on Conditional Branch',
          type: 'fill-the-gaps',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Default Role Assignment',
          prompt: 'Initialize `role` before the `if` statement so `print(role)` never raises `NameError`.',
          gaps: [
            {
              id: 'gap-1',
              beforeText: '',
              afterText: ' = "guest"\nif is_admin:\n    role = "admin"\nprint(role)',
              correctAnswer: 'role',
              options: ['role', 'admin', 'guest'],
            },
          ],
          hints: [
            'Which variable name is printed on the last line?',
            'Bind it to "guest" before the if block.',
            'role = "guest".',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day15-sub4',
      number: 4,
      title: 'TypeError vs ValueError (Incompatible Type vs Bad Value)',
      summary: 'Master the crucial distinction between wrong object type (TypeError) and unparseable content (ValueError).',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Wrong Type vs Right Type With Invalid Content',
        paragraphs: [
          '**`TypeError`** means an operation or function was given an object of the **wrong type**—for example, `"25" + 5` (cannot add `str` and `int`), calling a non-callable like `len = 5; len([1])`, or passing the wrong number of arguments to a function.',
          '**`ValueError`** means the argument has the **right type**, but its **specific value is invalid**—for example, `int("abc")` (`"abc"` *is* a `str`, which `int()` accepts, but `"abc"` is not base-10 digits) or `math.sqrt(-1)`.',
          'Keeping this distinction sharp lets you write targeted `except TypeError:` vs `except ValueError:` handlers and diagnose bugs immediately.',
        ],
        keyTerms: [
          {
            term: 'TypeError',
            definition: 'Raised when an operation is applied to an object of an inappropriate type.',
          },
          {
            term: 'ValueError',
            definition: 'Raised when an argument has the correct type but an inappropriate value.',
          },
        ],
        bulletPoints: [
          'int(None) -> TypeError (wrong type).',
          'int("abc") -> ValueError (right type str, bad content).',
          'Shadowing built-ins (list = [1, 2]) causes TypeError: "list" object is not callable.',
        ],
      },
      visualise: {
        type: 'error-classifier-sim',
        title: 'TypeError vs ValueError Comparator',
        badge: 'simulation',
        description: 'Compare TypeError and ValueError side-by-side.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Contrasting TypeError and ValueError',
          runMode: 'real',
          code: `for sample in (None, "abc", "42"):
    try:
        print("Parsed:", int(sample))
    except (TypeError, ValueError) as e:
        print(repr(sample), "->", type(e).__name__)`,
          expectedOutput: `None -> TypeError
'abc' -> ValueError
Parsed: 42`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'int(None)',
          internalEffect: 'int() does not accept NoneType -> raises TypeError.',
        },
        {
          step: 2,
          codeLine: 3,
          instruction: 'int("abc")',
          internalEffect: 'int() accepts str, but "abc" cannot be parsed -> raises ValueError.',
        },
      ],
      apply: {
        domain: 'Input Validation',
        contextTitle: 'Safe Integer Parsing Helper',
        scenario: 'Convert user input safely with a fallback on ValueError.',
        code: `def parse_int(text, default=0):
    try:
        return int(text)
    except ValueError:
        return default

print(parse_int("15"), parse_int("oops"))`,
        outcome: `15 0`,
      },
      commonMistakes: [
        {
          label: 'Shadowing Built-in Names Like list or str',
          erroneousCode: `str = "hello"
print(str(123))`,
          errorMessage: "TypeError: 'str' object is not callable",
          explanation: 'Assigning to str overwrites the built-in str() constructor with a string object.',
          correctedCode: `greeting = "hello"
print(str(123))`,
        },
      ],
      sourceNotes: 'Covers TypeError & ValueError from Asabeneh Day 15.',
      practise: [
        {
          id: 'd15-s4-ex1',
          title: 'Scenario: TypeError vs ValueError Classification',
          type: 'scenario-mcq',
          tier: 'standard',
          points: 15,
          contextScenario: 'CLI Flag Parser',
          prompt: 'Which pair of calls raises `(TypeError, ValueError)` in that exact order?',
          options: [
            { id: 'opt-1', text: 'int(None) and int("abc")', explanation: 'Correct! None is the wrong type (TypeError); "abc" is a str with invalid content (ValueError).', isCorrect: true },
            { id: 'opt-2', text: 'int("abc") and int(None)', explanation: 'Incorrect. That order is (ValueError, TypeError).', isCorrect: false },
            { id: 'opt-3', text: 'int("10") and int("20")', explanation: 'Incorrect. Both succeed.', isCorrect: false },
            { id: 'opt-4', text: 'int([]) and int({})', explanation: 'Incorrect. Both raise TypeError.', isCorrect: false },
          ],
          hints: [
            'TypeError = incompatible type (like None or list).',
            'ValueError = right type (str), unparseable value.',
            'Check the order: TypeError first, ValueError second.',
          ],
        },
        {
          id: 'd15-s4-ex2',
          title: 'Fix the Bug: Built-in Name Shadowing TypeError',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 15,
          contextScenario: 'List Conversion Bug',
          prompt: 'Fix the code so `list("abc")` does not raise `TypeError: \'list\' object is not callable`.',
          starterCode: `list = [1, 2, 3]
chars = list("abc")
print(chars)`,
          solutionCode: `nums = [1, 2, 3]
chars = list("abc")
print(chars)`,
          testCases: [
            { id: 'tc-1', label: "Prints ['a', 'b', 'c']", setup: '', expected: "['a', 'b', 'c']", hidden: false },
          ],
          hints: [
            'Line 1 overwrites the built-in list constructor.',
            'Rename the variable on line 1 to nums.',
            'nums = [1, 2, 3].',
          ],
        },
        {
          id: 'd15-s4-ex3',
          title: 'Write Code: Safe Integer Parser',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'API Query Param Parser',
          prompt: 'Write `safe_int(val, default=0)` that returns `int(val)` and catches `(ValueError, TypeError)` to return `default`. Print `safe_int("42")`, `safe_int("x")`, and `safe_int(None, -1)`.',
          starterCode: `def safe_int(val, default=0):
    # Catch ValueError and TypeError
    pass

print(safe_int("42"), safe_int("x"), safe_int(None, -1))`,
          solutionCode: `def safe_int(val, default=0):
    try:
        return int(val)
    except (ValueError, TypeError):
        return default

print(safe_int("42"), safe_int("x"), safe_int(None, -1))`,
          testCases: [
            { id: 'tc-1', label: 'Prints 42 0 -1', setup: '', expected: '42 0 -1', hidden: false },
          ],
          hints: [
            'Wrap return int(val) in a try block.',
            'Catch except (ValueError, TypeError):.',
            'Return default in the except block.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day15-sub5',
      number: 5,
      title: 'IndexError, KeyError & AttributeError (Lookup Faults)',
      summary: 'Prevent out-of-range sequence indexing, missing dictionary keys, and invalid attribute lookups.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Missing Positions, Missing Keys, Missing Attributes',
        paragraphs: [
          '**`IndexError`** occurs when you index a sequence (`list`, `tuple`, `str`) with an integer outside `[-len, len - 1]`—most often off-by-one errors (`items[len(items)]`).',
          '**`KeyError`** occurs when accessing `my_dict[missing_key]`. Prevent it with `my_dict.get(key, default)` or `key in my_dict`.',
          '**`AttributeError`** occurs when accessing `.method` or `.attr` on an object that does not have it—most famously `\'NoneType\' object has no attribute ...` when a function returned `None` unexpectedly (such as `list.sort()`).',
        ],
        keyTerms: [
          {
            term: 'IndexError',
            definition: 'Raised when a sequence subscript is out of valid index bounds.',
          },
          {
            term: 'KeyError',
            definition: 'Raised when a mapping (dictionary) key is not found.',
          },
          {
            term: 'AttributeError',
            definition: 'Raised when an attribute reference or assignment fails on an object.',
          },
        ],
        bulletPoints: [
          'Use d.get(key, default) instead of d[key] for optional keys.',
          'AttributeError on NoneType usually means you chained onto an in-place method like .sort() or .append().',
        ],
      },
      visualise: {
        type: 'error-classifier-sim',
        title: 'Lookup & Attribute Error Inspector',
        badge: 'simulation',
        description: 'Inspect KeyError, IndexError, and AttributeError triggers.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Safe Dictionary & List Access Patterns',
          runMode: 'real',
          code: `cfg = {"port": 8080}
print("Host:", cfg.get("host", "localhost"))

items = ["a", "b"]
last = items[-1] if items else None
print("Last:", last)`,
          expectedOutput: `Host: localhost
Last: b`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'cfg.get("host", "localhost")',
          internalEffect: 'Returns fallback "localhost" instead of raising KeyError.',
        },
      ],
      apply: {
        domain: 'API Client Parsing',
        contextTitle: 'Chaining Safe .get() Calls on JSON Payloads',
        scenario: 'Avoid KeyError and AttributeError when optional nested fields are missing.',
        code: `payload = {"user": {"name": "Ada"}}
role = payload.get("user", {}).get("role", "viewer")
print("Role:", role)`,
        outcome: `Role: viewer`,
      },
      commonMistakes: [
        {
          label: 'Chaining onto In-Place Methods That Return None',
          erroneousCode: `nums = [3, 1, 2]
nums.sort().reverse()`,
          errorMessage: "AttributeError: 'NoneType' object has no attribute 'reverse'",
          explanation: 'list.sort() sorts in-place and returns None. Call sorted() or sort on its own line.',
          correctedCode: `nums = [3, 1, 2]
nums.sort()
nums.reverse()
print(nums)`,
        },
      ],
      sourceNotes: 'Covers IndexError, KeyError, and AttributeError from Asabeneh Day 15.',
      practise: [
        {
          id: 'd15-s5-ex1',
          title: 'Predict Output: AttributeError on NoneType',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'In-Place Sort Chaining',
          prompt: 'What happens when you run `res = [3, 1, 2].sort(); print(res[0])`?',
          options: [
            { id: 'opt-1', text: 'Raises TypeError: \'NoneType\' object is not subscriptable (because .sort() returns None).', explanation: 'Correct! list.sort() mutates in-place and returns None.', isCorrect: true },
            { id: 'opt-2', text: 'Prints 1.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'Prints 3.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'Raises KeyError.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'What does list.sort() return?',
            'It returns None, not the sorted list.',
            'Indexing None[0] fails.',
          ],
        },
        {
          id: 'd15-s5-ex2',
          title: 'Order the Lines: Safe Nested Dict Lookup',
          type: 'order-the-lines',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Optional Config Extraction',
          prompt: 'Arrange the lines to safely read `theme` with `.get()` without raising `KeyError` and print it.',
          jumbledLines: [
            { id: 'l1', code: 'cfg = {"ui": {}}', indent: 0 },
            { id: 'l2', code: 'theme = cfg.get("ui", {}).get("theme", "dark")', indent: 0 },
            { id: 'l3', code: 'print(theme)', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3'],
          hints: [
            'Define cfg first.',
            'Use .get() to extract theme next.',
            'Print theme last.',
          ],
        },
        {
          id: 'd15-s5-ex3',
          title: 'Fix the Bug: Off-by-One IndexError',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 15,
          contextScenario: 'Last Element Access',
          prompt: 'Fix the indexing bug so the code prints the last item `"z"` instead of raising `IndexError`.',
          starterCode: `letters = ["x", "y", "z"]
print(letters[len(letters)])`,
          solutionCode: `letters = ["x", "y", "z"]
print(letters[-1])`,
          testCases: [
            { id: 'tc-1', label: 'Prints z', setup: '', expected: 'z', hidden: false },
          ],
          hints: [
            'Valid indices for length 3 are 0, 1, 2 (or -1).',
            'len(letters) is 3, which is out of range.',
            'Use letters[-1] or letters[len(letters) - 1].',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day15-sub6',
      number: 6,
      title: 'ZeroDivisionError, ImportError & ModuleNotFoundError',
      summary: 'Guard against division by zero and understand import resolution failures.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Arithmetic & Module Resolution Faults',
        paragraphs: [
          '**`ZeroDivisionError`** is raised whenever `/` (true division), `//` (floor division), or `%` (modulo) has a right-hand operand of `0` or `0.0`. Always guard denominators (`if count == 0: return 0.0`) before dividing.',
          '**`ModuleNotFoundError`** (a subclass of **`ImportError`**) is raised when Python cannot locate the module you tried to import—due to a typo (`import mathh`), a missing third-party package, or a module unavailable in the browser sandbox.',
          '**`ImportError`** is raised when the module *exists*, but the specific symbol in `from mod import missing_name` does not exist inside it.',
        ],
        keyTerms: [
          {
            term: 'ZeroDivisionError',
            definition: 'Raised when dividing or taking modulo by zero.',
          },
          {
            term: 'ModuleNotFoundError',
            definition: 'ImportError subclass raised when the requested module cannot be found on sys.path.',
          },
        ],
        bulletPoints: [
          'Guard averages with `if not items: return 0.0`.',
          'ModuleNotFoundError = module missing; ImportError = symbol missing inside found module.',
        ],
      },
      visualise: {
        type: 'error-classifier-sim',
        title: 'Arithmetic & Import Error Inspector',
        badge: 'simulation',
        description: 'Inspect division and import error patterns.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Guarding Division & Handling Import Errors',
          runMode: 'real',
          code: `def safe_avg(nums):
    return sum(nums) / len(nums) if nums else 0.0

print("Empty avg:", safe_avg([]))

try:
    import nonexistent_pkg_xyz
except ModuleNotFoundError as e:
    print("Missing module:", e.name)`,
          expectedOutput: `Empty avg: 0.0
Missing module: nonexistent_pkg_xyz`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'if nums else 0.0',
          internalEffect: 'Short-circuits before len(nums) == 0 can trigger ZeroDivisionError.',
        },
      ],
      apply: {
        domain: 'Analytics Dashboards',
        contextTitle: 'Computing Conversion Rate Safely',
        scenario: 'Prevent ZeroDivisionError when a campaign has 0 visits.',
        code: `visits, signups = 0, 0
rate = (signups / visits * 100) if visits > 0 else 0.0
print(f"Rate: {rate:.1f}%")`,
        outcome: `Rate: 0.0%`,
      },
      commonMistakes: [
        {
          label: 'Dividing by len(items) Without Checking for Empty List',
          erroneousCode: `def mean(xs):
    return sum(xs) / len(xs)
print(mean([]))`,
          errorMessage: 'ZeroDivisionError: division by zero',
          explanation: 'An empty list has len([]) == 0. Always check if not xs before dividing.',
          correctedCode: `def mean(xs):
    return sum(xs) / len(xs) if xs else 0.0
print(mean([]))`,
        },
      ],
      sourceNotes: 'Covers ZeroDivisionError, ImportError, and ModuleNotFoundError from Asabeneh Day 15.',
      practise: [
        {
          id: 'd15-s6-ex1',
          title: 'Scenario: ImportError vs ModuleNotFoundError',
          type: 'scenario-mcq',
          tier: 'standard',
          points: 15,
          contextScenario: 'Dependency Diagnostics',
          prompt: 'When does Python raise `ImportError` (specifically not `ModuleNotFoundError`)?',
          options: [
            { id: 'opt-1', text: 'When the module file is found, but the requested symbol in `from mod import missing_name` does not exist.', explanation: 'Correct! ModuleNotFoundError means the module itself could not be located; ImportError means a symbol inside it failed to import.', isCorrect: true },
            { id: 'opt-2', text: 'When a file has a missing colon.', explanation: 'Incorrect. That is SyntaxError.', isCorrect: false },
            { id: 'opt-3', text: 'When dividing by zero.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'When a dictionary key is missing.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'ModuleNotFoundError is a subclass of ImportError.',
            'What if `math` exists, but you write `from math import foo`?',
            'The module exists, the symbol does not.',
          ],
        },
        {
          id: 'd15-s6-ex2',
          title: 'Write Code: Zero-Safe Percentage Calculator',
          type: 'write-code',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Funnel Conversion Metrics',
          prompt: 'Write `pct(part, total)` that returns `round(part / total * 100, 1)` when `total != 0`, and `0.0` when `total == 0`. Print `pct(3, 4)` and `pct(5, 0)`.',
          starterCode: `def pct(part, total):
    # Guard against ZeroDivisionError
    pass

print(pct(3, 4), pct(5, 0))`,
          solutionCode: `def pct(part, total):
    if total == 0:
        return 0.0
    return round(part / total * 100, 1)

print(pct(3, 4), pct(5, 0))`,
          testCases: [
            { id: 'tc-1', label: 'Prints 75.0 0.0', setup: '', expected: '75.0 0.0', hidden: false },
          ],
          hints: [
            'Check if total == 0 first and return 0.0.',
            'Otherwise return round(part / total * 100, 1).',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day15-sub7',
      number: 7,
      title: 'Systematic Debugging Workflow (repr, type, assert)',
      summary: 'Apply a repeatable 5-step debugging loop using repr(), type(), and assert invariants.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Debug Like a Senior Engineer: Inspect, Don’t Guess',
        paragraphs: [
          'Randomly editing lines when code breaks wastes hours. Follow a **5-step debugging loop**: (1) Reproduce deterministically, (2) Isolate the failing frame bottom-up, (3) Inspect actual runtime state with `repr()` and `type()`, (4) Apply the minimal root-cause fix, and (5) Verify with edge cases.',
          'Why use `print(repr(x), type(x))` instead of `print(x)`? Because `print("42")` and `print(42)` both display `42`! `repr("42")` prints `\'42\'` with quotes, immediately exposing string-vs-int bugs and hidden trailing whitespace like `"42\\n"`.',
          'Use `assert condition, "helpful message"` during development to catch broken assumptions early at function boundaries.',
        ],
        keyTerms: [
          {
            term: 'repr(obj)',
            definition: 'Returns an unambiguous string representation of obj (showing quotes on strings and escape chars).',
          },
          {
            term: 'assert',
            definition: 'Statement that raises AssertionError if a condition is falsy, verifying internal invariants.',
          },
        ],
        bulletPoints: [
          'print(repr(x), type(x)) reveals hidden quotes, spaces, and wrong types.',
          'Never hide bugs with bare `except: pass`.',
        ],
      },
      visualise: {
        type: 'debugging-workflow-sim',
        title: 'Systematic 5-Step Debugging Workflow',
        badge: 'simulation',
        description: 'Step through Reproduce -> Isolate -> Inspect -> Fix -> Verify.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Using repr() & type() to Expose Hidden Type Mismatches',
          runMode: 'real',
          code: `a = 42
b = "42 "
print("Plain:", a, "|", b)
print("repr :", repr(a), type(a).__name__, "|", repr(b), type(b).__name__)`,
          expectedOutput: `Plain: 42 | 42 
repr : 42 int | '42 ' str`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'repr(b), type(b).__name__',
          internalEffect: "Displays '42 ' str, revealing both string type and trailing space that plain print() hid.",
        },
      ],
      apply: {
        domain: 'Test Automation',
        contextTitle: 'Boundary Invariant Checks with assert',
        scenario: 'Verify a discount percentage is within [0, 100] before applying it.',
        code: `def apply_discount(price, pct):
    assert 0 <= pct <= 100, f"Invalid pct: {pct}"
    return round(price * (1 - pct / 100), 2)

print("Final:", apply_discount(80, 25))`,
        outcome: `Final: 60.0`,
      },
      commonMistakes: [
        {
          label: 'Swallowing All Exceptions With Bare except: pass',
          erroneousCode: `try:
    result = 10 / 0
except:
    pass  # Silently hides the bug!`,
          errorMessage: 'Silent failure anti-pattern: hides ZeroDivisionError and even KeyboardInterrupt',
          explanation: 'Never use bare except: pass. Catch specific exception types and handle or log them explicitly.',
          correctedCode: `try:
    result = 10 / 0
except ZeroDivisionError:
    result = 0.0
print(result)`,
        },
      ],
      sourceNotes: 'Enrichment on systematic debugging for Day 15.',
      practise: [
        {
          id: 'd15-s7-ex1',
          title: 'Explain Trace: Why repr() Beats Plain print()',
          type: 'explain-the-trace',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Whitespace & String-vs-Int Bug',
          prompt: 'Explain why `print(repr(x), type(x).__name__)` is superior to `print(x)` when debugging why `x == 42` evaluates to `False`.',
          traceStepCode: `x = "42 "
print("plain:", x)
print("debug:", repr(x), type(x).__name__)`,
          traceQuestion: 'What does `repr(x)` reveal that plain `print(x)` hides?',
          modelAnswer: 'Plain print("42 ") outputs 42 with an invisible trailing space, looking identical to integer 42. repr(x) prints \'42 \', immediately revealing both the surrounding quotes (str type) and the trailing space.',
          markingCriteria: [
            { id: 'mc-1', label: 'Explains plain print hides quotes and trailing whitespace', points: 10 },
            { id: 'mc-2', label: 'Explains repr() shows quotes and exact characters', points: 10 },
          ],
          hints: [
            'Compare the output of print(42) vs print("42 ").',
            'How does repr("42 ") format the string?',
            'Quotes + visible whitespace.',
          ],
        },
        {
          id: 'd15-s7-ex2',
          title: 'Write Code: Defensive Assert & Type Guard',
          type: 'write-code',
          tier: 'project',
          points: 20,
          contextScenario: 'Invoice Line-Item Validator',
          prompt: 'Write `calc_total(price, qty)` that asserts `qty >= 0` and raises `TypeError` if `price` is not `(int, float)`, returning `round(price * qty, 2)`. Print `calc_total(12.5, 3)`.',
          starterCode: `def calc_total(price, qty):
    # Validate price type and qty >= 0
    pass

print(calc_total(12.5, 3))`,
          solutionCode: `def calc_total(price, qty):
    if not isinstance(price, (int, float)):
        raise TypeError("price must be numeric")
    assert qty >= 0, "qty must be non-negative"
    return round(price * qty, 2)

print(calc_total(12.5, 3))`,
          testCases: [
            { id: 'tc-1', label: 'Prints 37.5', setup: '', expected: '37.5', hidden: false },
          ],
          hints: [
            'Use isinstance(price, (int, float)).',
            'Use assert qty >= 0.',
            'Return round(price * qty, 2).',
          ],
        },
        {
          id: 'd15-s7-ex3',
          title: 'Scenario: Avoiding Bare except: pass',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Code Review Standards',
          prompt: 'Why is a bare `except: pass` considered a dangerous anti-pattern?',
          options: [
            { id: 'opt-1', text: 'It silently swallows every exception—including bugs, TypeErrors, and KeyboardInterrupt—making failures invisible.', explanation: 'Correct! Always catch specific exception types and handle or log them.', isCorrect: true },
            { id: 'opt-2', text: 'It is a SyntaxError in Python 3.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'It doubles memory usage.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'It only catches SyntaxError.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'What happens if a real bug occurs inside a bare except: pass?',
            'Does it catch KeyboardInterrupt too?',
            'Silent failures make debugging impossible.',
          ],
        },
      ],
      assess: [],
    },
  ],
  realWorldLabs: [
    {
      id: 'day15-lab1',
      title: 'Defensive Telemetry Parser & Error Classifier',
      description: 'Parse mixed raw payloads while catching ValueError, TypeError, and KeyError cleanly and reporting structured diagnostics.',
      domain: 'Data Ingestion Reliability',
      starterCode: `records = [{"val": "42"}, {"val": "bad"}, {"val": None}, {}]
parsed = []

for rec in records:
    try:
        parsed.append(int(rec["val"]))
    except (KeyError, ValueError, TypeError) as err:
        print(f"Skipped ({type(err).__name__})")

print("Parsed:", parsed)`,
      targetOutput: `Skipped (ValueError)
Skipped (TypeError)
Skipped (KeyError)
Parsed: [42]`,
    },
    {
      id: 'day15-lab2',
      title: 'Zero-Safe Metrics & Invariant Checker',
      description: 'Compute safe averages guarding against ZeroDivisionError and validate inputs with repr() diagnostics.',
      domain: 'Analytics & QA',
      starterCode: `def safe_mean(nums):
    if not nums:
        return 0.0
    return round(sum(nums) / len(nums), 2)

print("Empty:", safe_mean([]))
print("Valid:", safe_mean([10, 20, 35]))`,
      targetOutput: `Empty: 0.0
Valid: 21.67`,
    },
  ],
  miniProject: {
    id: 'day15-project',
    title: 'Traceback Diagnostic & Defensive Validator Suite',
    brief: 'Build a defensive data validator that diagnoses and safely handles TypeError, ValueError, KeyError, IndexError, and ZeroDivisionError with clear repr() diagnostics.',
    requirements: [
      'Parse numeric inputs while distinguishing TypeError vs ValueError',
      'Access optional dictionary keys safely with .get() to prevent KeyError',
      'Guard sequence indexing against IndexError on empty or short lists',
      'Guard division operations against ZeroDivisionError',
      'Log unambiguous error diagnostics using type(err).__name__ and repr()',
    ],
    rubric: [
      { criterion: 'Targeted exception handling (no bare except)', weight: 40 },
      { criterion: 'Defensive guards for KeyError, IndexError, ZeroDivisionError', weight: 30 },
      { criterion: 'Diagnostic clarity with repr() and type()', weight: 30 },
    ],
    starterCode: `# Traceback Diagnostic & Defensive Validator Suite
def process_batch(records):
    # Validate and summarize records safely
    pass
`,
  },
  dayQuiz: {
    title: 'Day 15 Mastery Checkpoint Quiz: Python Type Errors',
    passingScorePercentage: 80,
    questions: [
      {
        id: 'd15-q1',
        scenario: 'Traceback Order',
        question: 'In a Python traceback (`most recent call last`), where is the frame that raised the exception?',
        options: [
          { id: 'q1-a', text: 'At the bottom, just above the ExceptionType: message line.', explanation: 'Correct! Read tracebacks bottom-up.', isCorrect: true },
          { id: 'q1-b', text: 'At the very top.', explanation: 'Incorrect. That is the oldest entry frame.', isCorrect: false },
          { id: 'q1-c', text: 'In the middle.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q1-d', text: 'Python omits the crashing frame.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd15-q2',
        scenario: 'Compile-Time Errors',
        question: 'Which error is caught by Python’s parser before any line in the file executes?',
        options: [
          { id: 'q2-a', text: 'SyntaxError (and IndentationError)', explanation: 'Correct! Grammar/indentation errors happen at parse time.', isCorrect: true },
          { id: 'q2-b', text: 'KeyError', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q2-c', text: 'ZeroDivisionError', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q2-d', text: 'ValueError', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd15-q3',
        scenario: 'NameError',
        question: 'What causes `NameError: name "usr" is not defined`?',
        options: [
          { id: 'q3-a', text: 'Python searched LEGB scopes and found no binding for usr.', explanation: 'Correct! Usually a typo or missing assignment/import.', isCorrect: true },
          { id: 'q3-b', text: 'usr is a string instead of an int.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q3-c', text: 'usr is missing from a dictionary.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q3-d', text: 'Indentation is wrong.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd15-q4',
        scenario: 'TypeError vs ValueError',
        question: 'What exception does `int("hello")` raise?',
        options: [
          { id: 'q4-a', text: 'ValueError (str is the right type, but "hello" is not a valid base-10 integer).', explanation: 'Correct!', isCorrect: true },
          { id: 'q4-b', text: 'TypeError', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q4-c', text: 'SyntaxError', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q4-d', text: 'KeyError', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd15-q5',
        scenario: 'TypeError',
        question: 'What exception does `"5" + 2` raise?',
        options: [
          { id: 'q5-a', text: 'TypeError', explanation: 'Correct! str and int cannot be added with +.', isCorrect: true },
          { id: 'q5-b', text: 'ValueError', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q5-c', text: 'NameError', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q5-d', text: 'IndexError', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd15-q6',
        scenario: 'KeyError Prevention',
        question: 'Which method safely looks up an optional key in a dictionary `d` without raising `KeyError`?',
        options: [
          { id: 'q6-a', text: 'd.get("key", default)', explanation: 'Correct! .get() returns default if the key is absent.', isCorrect: true },
          { id: 'q6-b', text: 'd["key"]', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q6-c', text: 'd.index("key")', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q6-d', text: 'd.pop("key")', explanation: 'Incorrect. pop without default also raises KeyError.', isCorrect: false },
        ],
      },
      {
        id: 'd15-q7',
        scenario: 'IndexError',
        question: 'If `items = [10, 20]`, what does `items[2]` raise?',
        options: [
          { id: 'q7-a', text: 'IndexError: list index out of range', explanation: 'Correct! Valid indices are 0 and 1.', isCorrect: true },
          { id: 'q7-b', text: 'KeyError: 2', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q7-c', text: 'ValueError', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q7-d', text: 'None', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd15-q8',
        scenario: 'AttributeError on NoneType',
        question: 'Why does `[3, 1].sort().append(2)` raise `AttributeError: "NoneType" object has no attribute "append"`?',
        options: [
          { id: 'q8-a', text: 'list.sort() mutates the list in-place and returns None.', explanation: 'Correct! Never chain onto in-place methods that return None.', isCorrect: true },
          { id: 'q8-b', text: 'Lists do not have an append method.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q8-c', text: 'sort() only works on tuples.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q8-d', text: 'append() only accepts strings.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd15-q9',
        scenario: 'ModuleNotFoundError vs ImportError',
        question: 'What is raised if `math` exists, but you run `from math import not_a_func`?',
        options: [
          { id: 'q9-a', text: 'ImportError: cannot import name "not_a_func" from "math"', explanation: 'Correct! The module exists, but the symbol does not.', isCorrect: true },
          { id: 'q9-b', text: 'ModuleNotFoundError', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q9-c', text: 'SyntaxError', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q9-d', text: 'ZeroDivisionError', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd15-q10',
        scenario: 'Debugging with repr()',
        question: 'Why is `print(repr(val), type(val))` better than `print(val)` when debugging?',
        options: [
          { id: 'q10-a', text: 'repr() shows quotes around strings and escape/whitespace characters, exposing type mismatches.', explanation: 'Correct! "42" and 42 look identical with plain print().', isCorrect: true },
          { id: 'q10-b', text: 'repr() automatically fixes TypeError.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q10-c', text: 'repr() converts strings to integers.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q10-d', text: 'print() cannot print numbers.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
    ],
  },
  cheatSheet: [],
  sourceNotes: [
    'Primary curriculum reference: Asabeneh Yetayeh, 30 Days of Python — Day 15: Python Type Errors (https://github.com/Asabeneh/30-Days-Of-Python/tree/master/15_Day_Python_type_errors).',
    'Enhanced with bottom-up traceback reading, compile-time vs runtime classification, TypeError vs ValueError contrast, and repr()/type() debugging.',
  ],
};
