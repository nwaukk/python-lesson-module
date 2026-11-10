/**
 * Day 11: Functions (Intermediate Python)
 * Part A (Learn) conforming to Sections 10, 13.2, and 14 of the Master Specification.
 * Includes:
 *  - 10 Detailed Subtopics following the 10-step pedagogical structure
 *  - 4 Signature Simulations: call-stack-frames, scope-finder, print-vs-return, argument-matcher
 *  - Watch-outs: mutable default argument trap, implicit None return, rare use of global,
 *    and safe RecursionError demonstration.
 *  - Enrichment: first look at Python type hints (beyond source).
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_11_MODULE: DayModule = {
  schemaVersion: 1,
  number: 11,
  title: 'Functions',
  level: 'intermediate',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/11_Day_Functions',
  estimatedMinutes: 90,
  prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  objectives: [
    'Define and invoke reusable functions using def, colon headers, and indented bodies',
    'Distinguish formal parameters in a signature from runtime arguments passed by a caller',
    'Contrast print() side effects with return values and understand why omitting return yields None',
    'Use positional, keyword, and default arguments while avoiding the mutable default argument trap',
    'Accept flexible argument counts using *args (tuple) and **kwargs (dictionary)',
    'Document functions with PEP 257 docstrings and inspect __doc__',
    'Trace variable resolution using the LEGB rule (Local, Enclosing, Global, Built-in) and use global sparingly',
    'Treat functions as first-class objects: assign to variables, store in collections, and pass as arguments',
    'Understand recursion, base cases, and Python’s recursion depth limit (RecursionError)',
    'Annotate function signatures with Python type hints (Enrichment)',
  ],
  subtopics: [
    {
      id: 'day11-sub1',
      number: 1,
      title: 'Defining & Calling Functions (def & Call Stack Frames)',
      summary: 'Package reusable logic into named functions with def, and trace how each invocation pushes a fresh stack frame.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Modularizing Logic with def and Call Frames',
        paragraphs: [
          'A **function** is a named, reusable block of code designed to perform a specific task. Instead of copying and pasting the same calculation across a codebase, you define it once with the `def` keyword and call it whenever needed.',
          'Defining a function (`def greet(): ...`) only creates the function object and binds its name in the current namespace—the body does **not** run until you invoke it with parentheses (`greet()`).',
          'Each time a function is called, Python pushes a brand-new **stack frame** onto the call stack to hold that call’s local variables. When the function finishes, its frame is popped and discarded, keeping every call cleanly isolated.',
        ],
        keyTerms: [
          {
            term: 'def Keyword',
            definition: 'Creates a function object and binds it to a name in the current scope.',
          },
          {
            term: 'Function Invocation',
            definition: 'Executing a function by appending parentheses () to its name, e.g., square(3).',
          },
          {
            term: 'Call Stack Frame',
            definition: 'An isolated runtime record created per function call to store local variables and the return address.',
          },
        ],
        bulletPoints: [
          'Defining a function does not execute its body; calling it with () does.',
          'Every call allocates its own local stack frame and destroys it on return.',
          'Forgetting () after a function name evaluates to the function object itself, not its result.',
        ],
      },
      visualise: {
        type: 'call-stack-frames',
        title: 'Call Stack Frames & Local Isolation',
        badge: 'simulation',
        description: 'Step through nested function calls to watch stack frames push on call and pop on return.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Defining and Calling Reusable Functions',
          runMode: 'real',
          code: `def square(n):
    res = n * n
    return res

def hypotenuse_sq(a, b):
    sa = square(a)
    sb = square(b)
    return sa + sb

ans = hypotenuse_sq(3, 4)
print("Sum of squares:", ans)`,
          expectedOutput: `Sum of squares: 25`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'def square(n):',
          internalEffect: 'Compiles function body and binds name square to a function object without running it.',
        },
        {
          step: 2,
          codeLine: 10,
          instruction: 'ans = hypotenuse_sq(3, 4)',
          internalEffect: 'Pushes hypotenuse_sq frame (a=3, b=4), which pushes square(3) then square(4), popping each on return.',
          outputEffect: 'Prints Sum of squares: 25.',
        },
      ],
      apply: {
        domain: 'Logistics & Geometry',
        contextTitle: 'Reusable Warehouse Packaging Volume Helper',
        scenario: 'Define a box_volume helper and call it for two different crate dimensions.',
        code: `def box_volume(length, width, height):
    return length * width * height

print("Small crate:", box_volume(2, 3, 4))
print("Large crate:", box_volume(5, 4, 3))`,
        outcome: `Small crate: 24
Large crate: 60`,
      },
      commonMistakes: [
        {
          label: 'Referencing a Function Without Parentheses',
          erroneousCode: `def greet():
    return "Hello!"

msg = greet  # Missing ()!
print(msg)`,
          errorMessage: 'Prints <function greet at 0x...> instead of "Hello!"',
          explanation: 'Without parentheses, greet refers to the function object itself rather than invoking it.',
          correctedCode: `def greet():
    return "Hello!"

msg = greet()
print(msg)`,
        },
      ],
      sourceNotes: 'Covers function definition and calling from Asabeneh Day 11, paired with CPython call stack frame mechanics.',
      practise: [
        {
          id: 'd11-s1-ex1',
          title: 'Predict Output: Function Reference vs Call',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Sensor Calibration Utility',
          prompt: 'What happens when `ping` is invoked with `()` vs referenced without `()`?',
          starterCode: `def ping():
    return "OK"

a = ping()
print(a)`,
          options: [
            { id: 'opt-1', text: 'OK', explanation: 'Correct! ping() invokes the function and binds its return value "OK" to a.', isCorrect: true },
            { id: 'opt-2', text: '<function ping>', explanation: 'Incorrect. That would happen only if () were omitted.', isCorrect: false },
            { id: 'opt-3', text: 'None', explanation: 'Incorrect. ping() explicitly returns "OK".', isCorrect: false },
            { id: 'opt-4', text: 'NameError: ping is not defined', explanation: 'Incorrect. ping was defined on line 1 before being called on line 4.', isCorrect: false },
          ],
          hints: [
            'Check whether line 4 includes parentheses ().',
            'ping() executes the body and returns "OK".',
            'print(a) prints the returned string.',
          ],
        },
        {
          id: 'd11-s1-ex2',
          title: 'Order the Lines: Stack Frame Push & Return',
          type: 'order-the-lines',
          tier: 'standard',
          points: 10,
          contextScenario: 'Shipping Weight Converter',
          prompt: 'Order the lines to define `kg_to_grams(kg)` and print the converted weight for `2.5` kg.',
          jumbledLines: [
            { id: 'l1', code: 'def kg_to_grams(kg):', indent: 0 },
            { id: 'l2', code: 'grams = kg * 1000', indent: 1 },
            { id: 'l3', code: 'return grams', indent: 1 },
            { id: 'l4', code: 'result = kg_to_grams(2.5)', indent: 0 },
            { id: 'l5', code: 'print(result)', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4', 'l5'],
          hints: [
            'Define def kg_to_grams(kg): before calling it.',
            'Compute grams = kg * 1000 and return grams inside the indented body.',
            'Call kg_to_grams(2.5) at top level, then print(result).',
          ],
        },
      ],
    },
    {
      id: 'day11-sub2',
      number: 2,
      title: 'Parameters vs Arguments',
      summary: 'Understand the distinction between formal parameters in a def header and actual arguments passed at call time.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Parameters (Placeholders) vs Arguments (Actual Values)',
        paragraphs: [
          'Although developers often use the terms informally, Python makes a clear distinction: **parameters** are the variable names listed inside the parentheses of a `def` statement, while **arguments** are the actual runtime values passed into the function when it is called.',
          'When you call `calculate_tax(1000, 0.075)`, Python binds the argument `1000` to the first parameter and `0.075` to the second parameter in the new call frame.',
          'If the number of arguments provided by the caller does not match the required parameters, Python immediately raises a `TypeError` before executing a single line of the function body.',
        ],
        keyTerms: [
          {
            term: 'Parameter',
            definition: 'A named local variable in a function’s def signature that receives an incoming value.',
          },
          {
            term: 'Argument',
            definition: 'The concrete value or expression supplied by the caller at invocation time.',
          },
        ],
        bulletPoints: [
          'Parameters live in the def header; arguments live in the call expression.',
          'Missing or extra positional arguments raise TypeError.',
          'Use Argument Matcher to inspect how Python binds arguments to parameters.',
        ],
      },
      visualise: {
        type: 'argument-matcher',
        title: 'Parameter & Argument Binding Matcher',
        badge: 'simulation',
        description: 'Inspect how positional, keyword, and default arguments bind to parameters—and what triggers TypeError.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Matching Parameters and Arguments',
          runMode: 'real',
          code: `def format_invoice(customer, amount):
    return f"Invoice for {customer}: NGN {amount:,.2f}"

print(format_invoice("Zainab", 45000))
print(format_invoice("Tunde", 12500.5))`,
          expectedOutput: `Invoice for Zainab: NGN 45,000.00
Invoice for Tunde: NGN 12,500.50`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'def format_invoice(customer, amount):',
          internalEffect: 'Declares two required formal parameters: customer and amount.',
        },
        {
          step: 2,
          codeLine: 4,
          instruction: 'format_invoice("Zainab", 45000)',
          internalEffect: 'Binds customer="Zainab" and amount=45000 in the call frame.',
        },
      ],
      apply: {
        domain: 'Healthcare Scheduling',
        contextTitle: 'Clinic Appointment Confirmation',
        scenario: 'Pass patient name and slot time arguments into a confirmation formatter.',
        code: `def confirm_slot(patient, time_slot):
    return f"Confirmed: {patient} at {time_slot}"

print(confirm_slot("Chidi", "09:30"))`,
        outcome: 'Confirmed: Chidi at 09:30',
      },
      commonMistakes: [
        {
          label: 'Passing Wrong Argument Count',
          erroneousCode: `def add(a, b):
    return a + b

print(add(5))  # Missing b!`,
          errorMessage: "TypeError: add() missing 1 required positional argument: 'b'",
          explanation: 'Every parameter without a default value must receive an argument at call time.',
          correctedCode: `def add(a, b):
    return a + b

print(add(5, 3))`,
        },
      ],
      sourceNotes: 'Covers parameters and arguments from Asabeneh Day 11.',
      practise: [
        {
          id: 'd11-s2-ex1',
          title: 'Scenario: Parameter vs Argument Terminology',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Code Review Terminology Check',
          prompt: 'In `def send_alert(channel, level): ...` called via `send_alert("sms", "HIGH")`, which are the parameters and which are the arguments?',
          options: [
            {
              id: 'opt-1',
              text: 'channel and level are parameters; "sms" and "HIGH" are arguments.',
              explanation: 'Correct! Formal names in the def signature are parameters; values passed in the call are arguments.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: '"sms" and "HIGH" are parameters; channel and level are arguments.',
              explanation: 'Incorrect. That reverses the definitions.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'Both pairs are called parameters in Python.',
              explanation: 'Incorrect. Python distinguishes formal parameters from call-site arguments.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'channel is a parameter and level is an argument.',
              explanation: 'Incorrect. Both channel and level are in the def header, so both are parameters.',
              isCorrect: false,
            },
          ],
          hints: [
            'Parameters appear in the def header.',
            'Arguments are the concrete values supplied when calling the function.',
            'Match channel/level to def and "sms"/"HIGH" to the call.',
          ],
        },
        {
          id: 'd11-s2-ex2',
          title: 'Fix the Bug: Missing Required Positional Argument',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 10,
          contextScenario: 'Flight Baggage Fee Calculator',
          prompt: 'The call `baggage_fee(25)` raises `TypeError` because `rate_per_kg` is missing. Fix the call by passing `1200` as the second argument.',
          starterCode: `def baggage_fee(weight_kg, rate_per_kg):
    return weight_kg * rate_per_kg

fee = baggage_fee(25)
print(fee)`,
          solutionCode: `def baggage_fee(weight_kg, rate_per_kg):
    return weight_kg * rate_per_kg

fee = baggage_fee(25, 1200)
print(fee)`,
          hints: [
            'Count the required parameters in def baggage_fee(weight_kg, rate_per_kg):.',
            'The call baggage_fee(25) only supplies 1 argument.',
            'Pass 1200 as the second argument: baggage_fee(25, 1200).',
          ],
        },
      ],
    },
    {
      id: 'day11-sub3',
      number: 3,
      title: 'Return Values & print() vs return (Implicit None)',
      summary: 'Understand how return sends a value back to the caller, while print() only writes text to the console and returns None.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Sending Values Back to the Caller: return vs print()',
        paragraphs: [
          'One of the most common beginner mistakes in Python is confusing `print()` with `return`. `print()` writes human-readable text to `sys.stdout` (the terminal) and produces **no usable value** for the calling code.',
          '`return`, on the other hand, immediately exits the function and hands a Python object back to the caller, where it can be stored in a variable, used in math, or passed to another function.',
          'If a function reaches the end of its body without hitting a `return` statement—or uses a bare `return` with no expression—Python automatically returns `None`.',
        ],
        keyTerms: [
          {
            term: 'return Statement',
            definition: 'Terminates the current function call and passes the specified object back to the caller.',
          },
          {
            term: 'Implicit None',
            definition: 'The default value returned by any Python function that finishes without returning an explicit value.',
          },
        ],
        bulletPoints: [
          'print() displays text on screen; return sends a value back to the caller.',
          'A function with no return statement always returns None.',
          'return immediately exits the function—any lines after return in the same path never run.',
        ],
      },
      visualise: {
        type: 'print-vs-return',
        title: 'Print vs Return: What Reaches the Caller?',
        badge: 'simulation',
        description: 'Compare sys.stdout output against the actual value received by the caller.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Comparing Implicit None vs Explicit return',
          runMode: 'real',
          code: `def log_double(x):
    print("Inside log_double:", x * 2)

def calc_double(x):
    return x * 2

a = log_double(5)
b = calc_double(5)
print("a is:", a)
print("b + 1 is:", b + 1)`,
          expectedOutput: `Inside log_double: 10
a is: None
b + 1 is: 11`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 7,
          instruction: 'a = log_double(5)',
          internalEffect: 'Prints 10 to stdout, reaches end of function with no return, so binds a = None.',
        },
        {
          step: 2,
          codeLine: 8,
          instruction: 'b = calc_double(5)',
          internalEffect: 'Returns integer 10 to caller, binding b = 10 so b + 1 evaluates to 11.',
        },
      ],
      apply: {
        domain: 'FinTech Fee Calculation',
        contextTitle: 'Composable Transaction Fee Pipeline',
        scenario: 'Return the computed fee from a helper so the checkout function can add it to the subtotal.',
        code: `def compute_fee(amount):
    return round(amount * 0.015, 2)

subtotal = 2000
total = subtotal + compute_fee(subtotal)
print("Total payable:", total)`,
        outcome: 'Total payable: 2030.0',
      },
      commonMistakes: [
        {
          label: 'Trying to Do Arithmetic on a Function That Only Prints',
          erroneousCode: `def add_print(x, y):
    print(x + y)

result = add_print(3, 4) * 2`,
          errorMessage: "TypeError: unsupported operand type(s) for *: 'NoneType' and 'int'",
          explanation: 'add_print returns None, and None * 2 raises TypeError.',
          correctedCode: `def add_return(x, y):
    return x + y

result = add_return(3, 4) * 2
print(result)`,
        },
      ],
      sourceNotes: 'Covers return values and the no-return-gives-None watch-out from Section 14.',
      practise: [
        {
          id: 'd11-s3-ex1',
          title: 'Predict Output: Implicit None from print()-Only Function',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'POS Receipt Subtotal Bug',
          prompt: 'What does this snippet output?',
          starterCode: `def show_tax(price):
    print(price * 0.1)

val = show_tax(200)
print("val =", val)`,
          options: [
            {
              id: 'opt-1',
              text: '20.0\nval = None',
              explanation: 'Correct! show_tax prints 20.0 to stdout, has no return statement, and therefore returns None to val.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: '20.0\nval = 20.0',
              explanation: 'Incorrect. print() writes to stdout; it does not return a value to the caller.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'val = 20.0',
              explanation: 'Incorrect. Both print calls execute, and val is None.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'TypeError: cannot print None',
              explanation: 'Incorrect. print("val =", None) is valid and prints val = None.',
              isCorrect: false,
            },
          ],
          hints: [
            'What does show_tax(200) print while running?',
            'Does show_tax have a return statement?',
            'Functions without return implicitly return None.',
          ],
        },
        {
          id: 'd11-s3-ex2',
          title: 'Write Code: Composable Net Salary Helper',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'HR Payroll Engine',
          prompt: 'Write a function `net_pay(gross, tax_rate)` that **returns** `gross * (1 - tax_rate)` rounded to 2 decimal places (do not just print it).',
          starterCode: `def net_pay(gross, tax_rate):
    # Return net pay rounded to 2 decimals
    pass`,
          solutionCode: `def net_pay(gross, tax_rate):
    return round(gross * (1 - tax_rate), 2)`,
          testCases: [
            { id: 'tc1', label: '10% tax', setup: 'assert net_pay(5000, 0.1) == 4500.0', expected: 'True', hidden: false },
            { id: 'tc2', label: 'Zero tax', setup: 'assert net_pay(1200, 0.0) == 1200.0', expected: 'True', hidden: false },
          ],
          hints: [
            'Use return instead of print.',
            'Compute gross * (1 - tax_rate).',
            'Wrap the result in round(..., 2).',
          ],
        },
      ],
    },
    {
      id: 'day11-sub4',
      number: 4,
      title: 'Default, Keyword, Positional Arguments & The Mutable Default Trap',
      summary: 'Master argument ordering rules, default parameters, and why mutable defaults like [] are shared across calls.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Flexible Signatures & The Mutable Default Argument Trap',
        paragraphs: [
          'Python lets you assign **default values** to parameters (`def connect(host, port=8080):`). Callers can omit parameters that have defaults, pass arguments by **position**, or pass them by **keyword** (`port=443, host="api.dev"`). In any signature or call, positional arguments must come *before* keyword arguments.',
          'Watch out for Python’s most famous function gotcha: **the Mutable Default Argument Trap**. Default parameter values are evaluated **once** when the `def` statement executes—NOT each time the function is called!',
          'If you write `def add_item(x, bag=[]):`, that single list `[]` is created once at definition time and **shared across every subsequent call** that omits `bag`. Always default to `None` (`bag=None`) and create a fresh list inside the body (`if bag is None: bag = []`).',
        ],
        keyTerms: [
          {
            term: 'Default Parameter',
            definition: 'A parameter with a fallback value evaluated once at function definition time.',
          },
          {
            term: 'Keyword Argument',
            definition: 'Passing an argument by parameter name (e.g., role="admin"), allowing any order after positional arguments.',
          },
          {
            term: 'Mutable Default Trap',
            definition: 'Using a mutable object like [] or {} as a default value, causing state to leak between separate calls.',
          },
        ],
        bulletPoints: [
          'Positional arguments must precede keyword arguments in calls and defaults must follow non-defaults in def.',
          'Default values are evaluated ONCE at def time, not per call.',
          'Use param=None and initialize a fresh list/dict inside the function body.',
        ],
      },
      visualise: {
        type: 'argument-matcher',
        title: 'Positional, Keyword & Default Argument Matcher',
        badge: 'simulation',
        description: 'Test positional, keyword-reordered, and error call patterns against a signature with defaults.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Safe None Default vs Mutable Default Trap',
          runMode: 'real',
          code: `def add_tag(tag, tags=None):
    if tags is None:
        tags = []
    tags.append(tag)
    return tags

print("Call 1:", add_tag("python"))
print("Call 2:", add_tag("loops"))`,
          expectedOutput: `Call 1: ['python']
Call 2: ['loops']`,
          notes: 'Had we written tags=[], Call 2 would have printed ["python", "loops"]!',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'def add_tag(tag, tags=None):',
          internalEffect: 'Binds immutable None as the default for tags at def time.',
        },
        {
          step: 2,
          codeLine: 2,
          instruction: 'if tags is None: tags = []',
          internalEffect: 'Allocates a brand-new empty list inside each call frame when tags is omitted.',
        },
      ],
      apply: {
        domain: 'E-Commerce Cart Service',
        contextTitle: 'Building Isolated Shopping Baskets',
        scenario: 'Ensure new customer carts never accidentally share items from previous customers.',
        code: `def create_cart(item, cart=None):
    if cart is None:
        cart = []
    cart.append(item)
    return cart

print("User A:", create_cart("Laptop"))
print("User B:", create_cart("Mouse"))`,
        outcome: `User A: ['Laptop']
User B: ['Mouse']`,
      },
      commonMistakes: [
        {
          label: 'Using [] as a Default Parameter Value',
          erroneousCode: `def append_log(msg, logs=[]):
    logs.append(msg)
    return logs

print(append_log("init"))
print(append_log("boot"))  # Leaks "init"!`,
          errorMessage: 'Unexpected shared state: prints ["init", "boot"]',
          explanation: 'The default list [] is created once when def runs and mutated across calls.',
          correctedCode: `def append_log(msg, logs=None):
    if logs is None:
        logs = []
    logs.append(msg)
    return logs`,
        },
      ],
      sourceNotes: 'Covers default/keyword/positional arguments and the mutable default argument trap from Section 14.',
      practise: [
        {
          id: 'd11-s4-ex1',
          title: 'Fix the Bug: Mutable Default Argument Trap',
          type: 'fix-the-bug',
          tier: 'challenge',
          points: 15,
          contextScenario: 'Multi-Tenant Notification Queue',
          prompt: 'Because `queue=[]` is a mutable default, calling `enqueue("A")` and then `enqueue("B")` leaks `"A"` into the second list! Fix `enqueue` using `queue=None`.',
          starterCode: `def enqueue(item, queue=[]):
    queue.append(item)
    return queue`,
          solutionCode: `def enqueue(item, queue=None):
    if queue is None:
        queue = []
    queue.append(item)
    return queue`,
          hints: [
            'Default values are evaluated once when def executes.',
            'Change queue=[] to queue=None.',
            'Inside the function, add if queue is None: queue = [].',
          ],
        },
        {
          id: 'd11-s4-ex2',
          title: 'Fill the Gaps: Safe Default Initialization',
          type: 'fill-the-gaps',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Audit Trail Builder',
          prompt: 'Complete the safe default pattern so every call gets an isolated list when `entries` is omitted.',
          starterCode: `def record_entry(msg, entries=__GAP_1__):
    if entries __GAP_2__ None:
        entries = __GAP_3__
    entries.append(msg)
    return entries`,
          gaps: [
            { id: 'GAP_1', beforeText: 'entries=', afterText: '):', correctAnswer: 'None', options: ['None', '[]', '()'] },
            { id: 'GAP_2', beforeText: 'if entries', afterText: 'None:', correctAnswer: 'is', options: ['is', 'in', '!='] },
            { id: 'GAP_3', beforeText: 'entries =', afterText: '', correctAnswer: '[]', options: ['[]', 'None', '{}'] },
          ],
          hints: [
            'Use None as the immutable sentinel default.',
            'Check identity with is None.',
            'Assign a fresh empty list [] inside the if block.',
          ],
        },
      ],
    },
    {
      id: 'day11-sub5',
      number: 5,
      title: 'Arbitrary Arguments (*args and **kwargs)',
      summary: 'Accept any number of positional arguments as a tuple (*args) and keyword arguments as a dictionary (**kwargs).',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Variadic Functions with *args and **kwargs',
        paragraphs: [
          'Sometimes a function needs to accept an unknown number of arguments—like `print()` or `max()`. Prefixing a parameter with a single asterisk (`*args`) collects all extra positional arguments into a **tuple**.',
          'Prefixing a parameter with two asterisks (`**kwargs`) collects all extra keyword arguments (`key=value`) into a **dictionary**.',
          'The names `args` and `kwargs` are strong PEP 8 conventions, though the `*` and `**` operators are what actually do the packing. When combining parameter kinds in one signature, Python enforces the order: `(regular, *args, **kwargs)`.',
        ],
        keyTerms: [
          {
            term: '*args',
            definition: 'Packs arbitrary extra positional arguments into a tuple inside the function.',
          },
          {
            term: '**kwargs',
            definition: 'Packs arbitrary extra keyword arguments into a dict inside the function.',
          },
        ],
        bulletPoints: [
          '*args receives a tuple of extra positional arguments (empty tuple () if none passed).',
          '**kwargs receives a dict of extra keyword arguments (empty dict {} if none passed).',
          'Standard parameter order: (positional, *args, keyword_only, **kwargs).',
        ],
      },
      visualise: {
        type: 'argument-matcher',
        title: 'Argument Packing & Signature Binding',
        badge: 'simulation',
        description: 'Inspect how positional and keyword arguments bind to function parameters.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Combining *args and **kwargs',
          runMode: 'real',
          code: `def log_event(level, *messages, **metadata):
    print(f"[{level}]", " | ".join(messages))
    for k, v in metadata.items():
        print(f"  {k}: {v}")

log_event("INFO", "Server started", "Port 3000", env="prod", region="eu-west")`,
          expectedOutput: `[INFO] Server started | Port 3000
  env: prod
  region: eu-west`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 6,
          instruction: 'log_event("INFO", "Server started", "Port 3000", env="prod", region="eu-west")',
          internalEffect: 'Binds level="INFO", packs ("Server started", "Port 3000") into messages, and {"env": "prod", "region": "eu-west"} into metadata.',
        },
      ],
      apply: {
        domain: 'Analytics & Telemetry',
        contextTitle: 'Flexible Metric Aggregator',
        scenario: 'Sum any number of numeric measurements passed positionally.',
        code: `def average_metric(*values):
    if not values:
        return 0.0
    return sum(values) / len(values)

print("Avg:", average_metric(10, 20, 30, 40))`,
        outcome: 'Avg: 25.0',
      },
      commonMistakes: [
        {
          label: 'Putting **kwargs Before *args in a Function Header',
          erroneousCode: `def bad_sig(**kwargs, *args):
    pass`,
          errorMessage: 'SyntaxError: invalid syntax',
          explanation: '**kwargs must always appear at the very end of the parameter list, after *args.',
          correctedCode: `def good_sig(*args, **kwargs):
    pass`,
        },
      ],
      sourceNotes: 'Covers *args and **kwargs from Asabeneh Day 11.',
      practise: [
        {
          id: 'd11-s5-ex1',
          title: 'Write Code: Variadic Tag Formatter (*args & **kwargs)',
          type: 'write-code',
          tier: 'challenge',
          points: 15,
          contextScenario: 'Telemetry Tagging Middleware',
          prompt: 'Write a function `count_args(*args, **kwargs)` that returns a tuple `(len(args), len(kwargs))` counting positional and keyword arguments.',
          starterCode: `def count_args(*args, **kwargs):
    # Return (positional_count, keyword_count)
    pass`,
          solutionCode: `def count_args(*args, **kwargs):
    return (len(args), len(kwargs))`,
          testCases: [
            { id: 'tc1', label: 'Mixed args', setup: 'assert count_args(1, 2, 3, env="prod", v=2) == (3, 2)', expected: 'True', hidden: false },
            { id: 'tc2', label: 'No args', setup: 'assert count_args() == (0, 0)', expected: 'True', hidden: false },
          ],
          hints: [
            'args is a tuple of all extra positional arguments.',
            'kwargs is a dict of all extra keyword arguments.',
            'Return (len(args), len(kwargs)).',
          ],
        },
        {
          id: 'd11-s5-ex2',
          title: 'Scenario: Types of *args and **kwargs',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'API Wrapper Signature Inspection',
          prompt: 'Inside `def handle(*args, **kwargs):`, what are the runtime types of `args` and `kwargs`?',
          options: [
            { id: 'opt-1', text: 'args is a tuple; kwargs is a dict.', explanation: 'Correct! * packs positional arguments into a tuple and ** packs keyword arguments into a dict.', isCorrect: true },
            { id: 'opt-2', text: 'args is a list; kwargs is a set.', explanation: 'Incorrect. *args produces a tuple, not a list.', isCorrect: false },
            { id: 'opt-3', text: 'args is a dict; kwargs is a tuple.', explanation: 'Incorrect. That reverses them.', isCorrect: false },
            { id: 'opt-4', text: 'Both are lists.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Single asterisk * collects positional arguments.',
            'Double asterisk ** collects key=value keyword arguments.',
            'Match positional -> tuple, keyword -> dict.',
          ],
        },
      ],
    },
    {
      id: 'day11-sub6',
      number: 6,
      title: 'Docstrings (__doc__) & Function Documentation',
      summary: 'Write clear PEP 257 docstrings as the first statement of a function so tools and help() can inspect its contract.',
      estimatedMinutes: 7,
      introduce: {
        headline: 'Self-Documenting Functions with Docstrings',
        paragraphs: [
          'A **docstring** (documentation string) is a string literal—typically enclosed in triple double-quotes `"""..."""`—placed as the **very first statement** inside a function body.',
          'Unlike `#` comments, which Python’s compiler strips out, docstrings are preserved at runtime and stored on the function object’s `.__doc__` attribute. Tools like `help()`, IDE tooltips, and automated documentation generators read `.__doc__` directly.',
          'Following PEP 257, a good docstring starts with a concise one-line summary of what the function does, and optionally describes its parameters, return value, and raised exceptions.',
        ],
        keyTerms: [
          {
            term: 'Docstring',
            definition: 'A string literal appearing as the first statement in a function, class, or module, stored in __doc__.',
          },
          {
            term: '__doc__',
            definition: 'The dunder attribute on a function object holding its runtime docstring (or None if omitted).',
          },
        ],
        bulletPoints: [
          'Place the docstring as the very first statement inside def.',
          'Inspect it at runtime via func.__doc__ or help(func).',
          'Use triple double-quotes """...""" per PEP 257 convention.',
        ],
      },
      visualise: {
        type: 'call-stack-frames',
        title: 'Function Object & Execution Frame',
        badge: 'simulation',
        description: 'Trace how compiled function objects execute when called.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Writing and Reading __doc__',
          runMode: 'real',
          code: `def celsius_to_fahrenheit(c):
    """Convert temperature from Celsius to Fahrenheit."""
    return (c * 9 / 5) + 32

print("Temp:", celsius_to_fahrenheit(25))
print("Doc:", celsius_to_fahrenheit.__doc__)`,
          expectedOutput: `Temp: 77.0
Doc: Convert temperature from Celsius to Fahrenheit.`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: '"""Convert temperature from Celsius to Fahrenheit."""',
          internalEffect: 'Compiler attaches the string literal to celsius_to_fahrenheit.__doc__.',
        },
      ],
      apply: {
        domain: 'SDK & API Design',
        contextTitle: 'Documenting a Currency Converter',
        scenario: 'Attach a clear contract docstring and verify it via __doc__.',
        code: `def ngn_to_usd(amount_ngn, rate=1500.0):
    """Return USD equivalent of amount_ngn at the given exchange rate."""
    return round(amount_ngn / rate, 2)

print(ngn_to_usd.__doc__)`,
        outcome: 'Return USD equivalent of amount_ngn at the given exchange rate.',
      },
      commonMistakes: [
        {
          label: 'Putting Code or Comments Assignment Before the Docstring',
          erroneousCode: `def double(x):
    y = x * 2
    """Doubles x."""  # Not the first statement!
    return y`,
          errorMessage: 'double.__doc__ evaluates to None',
          explanation: 'A string literal is only treated as __doc__ if it is the very first statement in the function body.',
          correctedCode: `def double(x):
    """Doubles x."""
    return x * 2`,
        },
      ],
      sourceNotes: 'Covers docstrings and PEP 257 metadata for Day 11.',
      practise: [
        {
          id: 'd11-s6-ex1',
          title: 'Predict Output: Reading Function __doc__',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'CLI Help Generator',
          prompt: 'What does `print(area.__doc__)` output for the function below?',
          starterCode: `def area(w, h):
    """Compute rectangle area."""
    return w * h

print(area.__doc__)`,
          options: [
            { id: 'opt-1', text: 'Compute rectangle area.', explanation: 'Correct! The first string literal inside def is stored in area.__doc__.', isCorrect: true },
            { id: 'opt-2', text: 'None', explanation: 'Incorrect. None is returned only when no docstring is present as the first statement.', isCorrect: false },
            { id: 'opt-3', text: 'return w * h', explanation: 'Incorrect. __doc__ stores only the docstring, not the source code.', isCorrect: false },
            { id: 'opt-4', text: 'AttributeError', explanation: 'Incorrect. All Python functions have a __doc__ attribute.', isCorrect: false },
          ],
          hints: [
            'Is the triple-quoted string the first statement in area?',
            'Python attaches that string to area.__doc__.',
            'print(area.__doc__) displays its text.',
          ],
        },
        {
          id: 'd11-s6-ex2',
          title: 'Theory: Docstrings vs # Comments',
          type: 'theory-reasoning',
          tier: 'standard',
          points: 10,
          contextScenario: 'Library API Documentation Standards',
          prompt: 'Why does PEP 257 recommend docstrings (`"""..."""`) instead of `#` comments for describing a function’s contract?',
          options: [
            {
              id: 'opt-1',
              text: 'Docstrings are preserved at runtime in __doc__ so help(), IDEs, and doc generators can inspect them; # comments are stripped by the compiler.',
              explanation: 'Correct! Comments are ignored during compilation, whereas docstrings become runtime metadata.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'Docstrings make functions execute faster in CPython.',
              explanation: 'Incorrect. Docstrings are documentation metadata, not performance optimizations.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'Python forbids # comments inside function bodies.',
              explanation: 'Incorrect. # comments are allowed anywhere for implementation notes.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'Docstrings automatically validate argument types at runtime.',
              explanation: 'Incorrect. Docstrings do not perform runtime type validation.',
              isCorrect: false,
            },
          ],
          hints: [
            'What happens to # comments when Python compiles bytecode?',
            'Where is a docstring stored at runtime?',
            'Think about help(fn) and IDE tooltips.',
          ],
        },
      ],
    },
    {
      id: 'day11-sub7',
      number: 7,
      title: 'Local, Enclosing, Global & Built-in Scope (LEGB Rule)',
      summary: 'Trace how Python resolves variable names across Local, Enclosing, Global, and Built-in scopes, and why global should be used rarely.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'How Python Finds Names: The LEGB Lookup Rule',
        paragraphs: [
          'When you reference a variable inside a function, Python searches four scopes in strict **LEGB** order: **L**ocal (inside the current function) -> **E**nclosing (any outer nested functions) -> **G**lobal (module top level) -> **B**uilt-in (`len`, `print`, `range`).',
          'If you assign to a variable inside a function (`x = 10`), Python treats `x` as **Local** by default—even if a global variable named `x` already exists! Trying to read and then reassign a global variable without declaring `global x` raises `UnboundLocalError`.',
          'Although the `global` keyword lets a function mutate module-level variables, **you should use `global` rarely**. Functions that mutate global state create hidden coupling and hard-to-trace bugs; prefer passing parameters in and returning new values out.',
        ],
        keyTerms: [
          {
            term: 'LEGB Rule',
            definition: 'Python’s four-tier name resolution order: Local, Enclosing, Global, Built-in.',
          },
          {
            term: 'UnboundLocalError',
            definition: 'Raised when a function reads a local variable before its local assignment has executed.',
          },
          {
            term: 'global Keyword',
            definition: 'Declares that assignments to a name inside a function target the module-level variable instead of creating a local.',
          },
        ],
        bulletPoints: [
          'Reads search L -> E -> G -> B and stop at the first match (or raise NameError).',
          'Assignments inside def create local variables unless declared global or nonlocal.',
          'Avoid global in production code: pass arguments and return results instead.',
        ],
      },
      visualise: {
        type: 'scope-finder',
        title: 'LEGB Scope Finder & Lookup Order',
        badge: 'simulation',
        description: 'Click symbols to trace Python’s L -> E -> G -> B lookup path and NameError fallback.',
        initialConfig: {},
      },
      code: [
        {
          title: 'LEGB Lookup vs Pure Return Pattern',
          runMode: 'real',
          code: `APP_NAME = "PyLab"  # Global

def outer():
    prefix = ">>"   # Enclosing
    def inner(msg):
        label = f"{prefix} [{APP_NAME}] {msg}"  # Local
        return label
    return inner("Ready")

print(outer())`,
          expectedOutput: `>> [PyLab] Ready`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 6,
          instruction: 'label = f"{prefix} [{APP_NAME}] {msg}"',
          internalEffect: 'Resolves msg in L, prefix in E (outer), APP_NAME in G (module), and binds label in L.',
        },
      ],
      apply: {
        domain: 'State Management',
        contextTitle: 'Replacing global Mutation with Pure Return',
        scenario: 'Update a score cleanly via parameter + return instead of mutating a global counter.',
        code: `def add_points(current_score, delta):
    return current_score + delta

score = 100
score = add_points(score, 25)
print("Score:", score)`,
        outcome: 'Score: 125',
      },
      commonMistakes: [
        {
          label: 'Modifying a Global Variable Inside a Function Without Parameter Passing',
          erroneousCode: `count = 0
def bump():
    count += 1  # UnboundLocalError!

bump()`,
          errorMessage: 'UnboundLocalError: cannot access local variable "count" where it is not associated with a value',
          explanation: 'Because count += 1 assigns to count, Python marks count as local to bump(), then fails when reading it before assignment.',
          correctedCode: `def bump(count):
    return count + 1

count = 0
count = bump(count)
print(count)`,
        },
      ],
      sourceNotes: 'Covers local/global scope and the rare-use-of-global watch-out from Section 14.',
      practise: [
        {
          id: 'd11-s7-ex1',
          title: 'Explain the Trace: LEGB Shadowing & UnboundLocalError',
          type: 'explain-the-trace',
          tier: 'challenge',
          points: 15,
          contextScenario: 'Configuration Counter Bug',
          traceStepCode: `limit = 10
def increase():
    limit = limit + 1
    return limit`,
          traceQuestion: 'Why does calling `increase()` raise `UnboundLocalError` even though `limit = 10` is defined globally?',
          prompt: 'Explain how Python’s compile-time scope rule causes `UnboundLocalError` in `increase()`.',
          modelAnswer: 'Because limit is assigned inside increase() (limit = limit + 1), Python marks limit as a local variable for the entire function body. When evaluating the right-hand side limit + 1, the local limit has not been assigned yet, raising UnboundLocalError.',
          markingCriteria: [
            { id: 'mc1', label: 'Identifies assignment marks limit as Local in the function', points: 5 },
            { id: 'mc2', label: 'Explains RHS reads local limit before it is bound', points: 5 },
            { id: 'mc3', label: 'Notes passing limit as a parameter + returning limit + 1 is preferred over global', points: 5 },
          ],
          hints: [
            'Does Python decide if a name is local at compile time or only at the assignment line?',
            'Because limit = ... appears in increase(), limit is local everywhere in increase().',
            'Reading an unassigned local variable raises UnboundLocalError.',
          ],
        },
        {
          id: 'd11-s7-ex2',
          title: 'Theory: Why global Should Be Used Rarely',
          type: 'theory-reasoning',
          tier: 'standard',
          points: 10,
          contextScenario: 'Modular Architecture Review',
          prompt: 'Why do experienced Python engineers avoid using the `global` keyword inside functions?',
          options: [
            {
              id: 'opt-1',
              text: 'Mutating global state creates hidden side effects, makes functions harder to test in isolation, and causes coupling bugs.',
              explanation: 'Correct! Pure functions that take parameters and return new values are predictable, thread-safe, and easy to unit test.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'Because global variables cannot hold integers or strings.',
              explanation: 'Incorrect. Global variables can hold any Python object.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'Because Python 3 deprecated the global keyword.',
              explanation: 'Incorrect. global still exists in Python 3, though it is discouraged for general state.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'Because global disables recursion.',
              explanation: 'Incorrect.',
              isCorrect: false,
            },
          ],
          hints: [
            'Think about unit testing a function that secretly mutates module-level variables.',
            'Compare hidden side effects vs explicit inputs and return outputs.',
          ],
        },
      ],
    },
    {
      id: 'day11-sub8',
      number: 8,
      title: 'Functions as First-Class Objects',
      summary: 'Assign functions to variables, store them in dictionaries or lists, and pass them as arguments to other functions.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Functions Are Objects Too',
        paragraphs: [
          'In Python, functions are **first-class objects**, meaning they can be treated just like integers, strings, or lists. You can bind a function to another variable name, store functions inside a list or dictionary, or pass a function as an argument into another function.',
          'Notice the key syntax rule: when passing a function as data (for example, `apply_op(5, square)`), omit the parentheses `()`. Adding parentheses calls the function immediately instead of passing the function object itself.',
          'A classic real-world pattern is a **dispatch dictionary** mapping command strings (`"add"`, `"mul"`) directly to handler functions—replacing long `if...elif...else` chains.',
        ],
        keyTerms: [
          {
            term: 'First-Class Object',
            definition: 'An entity that can be assigned to variables, stored in data structures, passed as an argument, and returned from functions.',
          },
          {
            term: 'Dispatch Table',
            definition: 'A dictionary mapping keys (like command names) to function objects for clean O(1) lookup.',
          },
        ],
        bulletPoints: [
          'Omit () when passing or storing a function object; include () only to invoke it.',
          'Dispatch dicts cleanly map operation names to handler functions.',
        ],
      },
      visualise: {
        type: 'call-stack-frames',
        title: 'Passing and Invoking Function Objects',
        badge: 'simulation',
        description: 'Inspect how function calls push frames onto the stack when invoked.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Function Dispatch Table & Higher-Order Call',
          runMode: 'real',
          code: `def double(x):
    return x * 2

def triple(x):
    return x * 3

ops = {"double": double, "triple": triple}
print("Via dict:", ops["triple"](10))

def apply_twice(fn, val):
    return fn(fn(val))

print("Twice:", apply_twice(double, 3))`,
          expectedOutput: `Via dict: 30
Twice: 12`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 7,
          instruction: 'ops["triple"](10)',
          internalEffect: 'Looks up the triple function object in ops, then invokes it with 10 -> 30.',
        },
        {
          step: 2,
          codeLine: 13,
          instruction: 'apply_twice(double, 3)',
          internalEffect: 'Binds fn=double, val=3; calls double(3) -> 6, then double(6) -> 12.',
        },
      ],
      apply: {
        domain: 'CLI & Command Routing',
        contextTitle: 'Plugin Formatter Pipeline',
        scenario: 'Pass a formatting function into a report publisher.',
        code: `def shout(s):
    return s.upper() + "!"

def publish(text, formatter):
    print(formatter(text))

publish("deploy complete", shout)`,
        outcome: 'DEPLOY COMPLETE!',
      },
      commonMistakes: [
        {
          label: 'Accidentally Calling a Function While Registering It',
          erroneousCode: `def ping():
    return "pong"

handlers = {"ping": ping()}  # Stores "pong" string, not function!`,
          errorMessage: 'TypeError: "str" object is not callable when invoking handlers["ping"]()',
          explanation: 'Adding () calls ping immediately and stores its return value instead of the function object.',
          correctedCode: `def ping():
    return "pong"

handlers = {"ping": ping}
print(handlers["ping"]())`,
        },
      ],
      sourceNotes: 'Covers functions as objects from Asabeneh Day 11 and Section 14.',
      practise: [
        {
          id: 'd11-s8-ex1',
          title: 'Write Code: Higher-Order Pipeline Runner',
          type: 'write-code',
          tier: 'project',
          points: 20,
          contextScenario: 'Data Transformation Pipeline',
          prompt: 'Write a function `run_pipeline(value, fn_a, fn_b)` that passes `value` into `fn_a`, then passes that result into `fn_b`, and returns the final result.',
          starterCode: `def run_pipeline(value, fn_a, fn_b):
    # Apply fn_a then fn_b
    pass`,
          solutionCode: `def run_pipeline(value, fn_a, fn_b):
    return fn_b(fn_a(value))`,
          testCases: [
            { id: 'tc1', label: 'Numeric chain', setup: 'assert run_pipeline(3, lambda x: x + 2, lambda x: x * 10) == 50', expected: 'True', hidden: false },
            { id: 'tc2', label: 'String chain', setup: 'assert run_pipeline(" hi ", str.strip, str.upper) == "HI"', expected: 'True', hidden: false },
          ],
          hints: [
            'Call fn_a(value) first to get the intermediate value.',
            'Pass that intermediate value into fn_b(...).',
            'Return fn_b(fn_a(value)).',
          ],
        },
        {
          id: 'd11-s8-ex2',
          title: 'Fix the Bug: Calling Function Instead of Passing Object',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 10,
          contextScenario: 'Event Hook Registration',
          prompt: 'The `apply_formatter("hello", shout())` call below fails because `shout()` is called immediately with 0 arguments. Fix the call so the `shout` function object itself is passed.',
          starterCode: `def shout(s):
    return s.upper()

def apply_formatter(text, fn):
    return fn(text)

print(apply_formatter("hello", shout()))`,
          solutionCode: `def shout(s):
    return s.upper()

def apply_formatter(text, fn):
    return fn(text)

print(apply_formatter("hello", shout))`,
          hints: [
            'Look at the second argument in apply_formatter("hello", shout()).',
            'Removing () passes the function object instead of calling it.',
            'Change shout() to shout.',
          ],
        },
      ],
    },
    {
      id: 'day11-sub9',
      number: 9,
      title: 'Recursion Basics & Recursion Depth Limit (RecursionError)',
      summary: 'Solve self-similar problems with a base case and recursive step, and safely guard against RecursionError.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Functions Calling Themselves: Recursion & Stack Limits',
        paragraphs: [
          '**Recursion** occurs when a function calls itself to solve a smaller instance of the same problem. Every valid recursive function has two parts: a **base case** that stops the recursion without making another call, and a **recursive step** that moves closer to the base case.',
          'Because every recursive call pushes a new frame onto the call stack, deep or unbounded recursion consumes stack memory. To prevent crashing the interpreter, Python enforces a maximum recursion depth (typically `1000` frames, inspectable via `sys.getrecursionlimit()`).',
          'If a recursive function misses its base case or recurses deeper than the limit, Python raises a `RecursionError`. You can catch `RecursionError` cleanly in tests or prefer an iterative loop for large inputs.',
        ],
        keyTerms: [
          {
            term: 'Base Case',
            definition: 'The terminating condition in a recursive function that returns a result without recursing further.',
          },
          {
            term: 'RecursionError',
            definition: 'Exception raised when the call stack exceeds Python’s maximum recursion depth (default ~1000).',
          },
        ],
        bulletPoints: [
          'Always write and test the base case first.',
          'Each recursive call must make measurable progress toward the base case.',
          'Unbounded recursion raises RecursionError: maximum recursion depth exceeded.',
        ],
      },
      visualise: {
        type: 'call-stack-frames',
        title: 'Recursive & Nested Call Stack Frames',
        badge: 'simulation',
        description: 'Observe how each call adds a frame to the stack until the base case returns and unwinds.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Factorial Recursion & Safe RecursionError Demo',
          runMode: 'real',
          code: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print("5! =", factorial(5))

def infinite_rec(n):
    return infinite_rec(n + 1)

try:
    infinite_rec(1)
except RecursionError:
    print("Caught RecursionError safely: depth limit reached!")`,
          expectedOutput: `5! = 120
Caught RecursionError safely: depth limit reached!`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'if n <= 1: return 1',
          internalEffect: 'Base case stops recursion when n reaches 1 and unwinds 5 * 4 * 3 * 2 * 1 = 120.',
        },
        {
          step: 2,
          codeLine: 12,
          instruction: 'except RecursionError:',
          internalEffect: 'Python halts infinite_rec at the stack limit (~1000 frames) and raises RecursionError, caught cleanly.',
        },
      ],
      apply: {
        domain: 'File Systems & Trees',
        contextTitle: 'Recursive Sum of Nested Sub-List Sizes',
        scenario: 'Sum integers in a flat list recursively by splitting head + tail.',
        code: `def rec_sum(nums):
    if not nums:
        return 0
    return nums[0] + rec_sum(nums[1:])

print("Total:", rec_sum([4, 6, 10]))`,
        outcome: 'Total: 20',
      },
      commonMistakes: [
        {
          label: 'Missing or Unreachable Base Case',
          erroneousCode: `def countdown(n):
    print(n)
    countdown(n - 1)  # Never stops!`,
          errorMessage: 'RecursionError: maximum recursion depth exceeded',
          explanation: 'Without if n <= 0: return, countdown keeps calling itself past 0 until the stack limit is hit.',
          correctedCode: `def countdown(n):
    if n <= 0:
        return
    print(n)
    countdown(n - 1)`,
        },
      ],
      sourceNotes: 'Covers recursion basics and safe RecursionError demonstration from Section 14.',
      practise: [
        {
          id: 'd11-s9-ex1',
          title: 'Explain the Trace: Recursive Stack Unwinding',
          type: 'explain-the-trace',
          tier: 'challenge',
          points: 15,
          contextScenario: 'Recursive Sum Trace',
          traceStepCode: `def rec_sum(n):
    if n <= 0:
        return 0
    return n + rec_sum(n - 1)

print(rec_sum(3))`,
          traceQuestion: 'Trace the stack frames pushed and popped for `rec_sum(3)` until `6` is printed.',
          prompt: 'Describe each recursive call frame, the base case hit, and how the frames unwind to produce `6`.',
          modelAnswer: 'rec_sum(3) pushes frame n=3 and calls rec_sum(2), which pushes n=2 and calls rec_sum(1), which pushes n=1 and calls rec_sum(0). At n=0, the base case returns 0. Frames unwind: 1 + 0 = 1, 2 + 1 = 3, 3 + 3 = 6.',
          markingCriteria: [
            { id: 'mc1', label: 'Lists frames pushed for n=3, 2, 1, 0', points: 5 },
            { id: 'mc2', label: 'Identifies base case n <= 0 returning 0', points: 5 },
            { id: 'mc3', label: 'Shows unwinding additions 1+0 -> 2+1 -> 3+3 = 6', points: 5 },
          ],
          hints: [
            'Start at rec_sum(3) and trace down to rec_sum(0).',
            'What does the base case return?',
            'Work back up through each pending addition.',
          ],
        },
        {
          id: 'd11-s9-ex2',
          title: 'Write Code: Safe Recursive Power Function',
          type: 'write-code',
          tier: 'project',
          points: 20,
          contextScenario: 'Mathematical Recursion Module',
          prompt: 'Write a recursive function `power(base, exp)` where `exp >= 0` (base case `exp == 0` returns `1`; recursive step returns `base * power(base, exp - 1)`).',
          starterCode: `def power(base, exp):
    # Base case and recursive step
    pass`,
          solutionCode: `def power(base, exp):
    if exp == 0:
        return 1
    return base * power(base, exp - 1)`,
          testCases: [
            { id: 'tc1', label: '2^4 = 16', setup: 'assert power(2, 4) == 16', expected: 'True', hidden: false },
            { id: 'tc2', label: '5^0 = 1', setup: 'assert power(5, 0) == 1', expected: 'True', hidden: false },
          ],
          hints: [
            'Handle the base case first: if exp == 0: return 1.',
            'For exp > 0, multiply base by power(base, exp - 1).',
          ],
        },
      ],
    },
    {
      id: 'day11-sub10',
      number: 10,
      title: 'A First Look at Type Hints (Enrichment)',
      summary: 'Annotate function parameters and return types with Python type hints to improve readability and catch bugs early.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Enrichment (Beyond Source): Function Type Hints',
        paragraphs: [
          'Modern Python (3.5+) supports **type hints** (PEP 484) directly in function signatures: `def greet(name: str, times: int = 1) -> str:`. The `: str` and `: int` annotate parameter types, and `-> str` annotates the return type.',
          'Important: Python remains dynamically typed at runtime! Type hints do **not** crash your program if someone passes the wrong type; instead, they power IDE autocomplete, static type checkers (like `mypy` or `pyright`), and clear team documentation.',
          'You can inspect a function’s type annotations at runtime via its `.__annotations__` dictionary.',
        ],
        keyTerms: [
          {
            term: 'Type Hint (Annotation)',
            definition: 'Optional metadata on parameters (x: int) and return values (-> str) documenting expected types.',
          },
          {
            term: '__annotations__',
            definition: 'Dictionary attribute storing a function’s parameter and return type hints.',
          },
        ],
        bulletPoints: [
          'Syntax: def fn(param: Type = default) -> ReturnType:',
          'Type hints are checked by static tools and IDEs, not enforced at runtime.',
          'Enrichment topic (beyond Asabeneh Day 11 source) for modern Python readiness.',
        ],
      },
      visualise: {
        type: 'argument-matcher',
        title: 'Function Signature & Parameter Binding',
        badge: 'simulation',
        description: 'Inspect how parameters and defaults align with caller arguments.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Type-Annotated Signature & __annotations__',
          runMode: 'real',
          code: `def apply_discount(price: float, rate: float = 0.1) -> float:
    return round(price * (1 - rate), 2)

print("Discounted:", apply_discount(250.0, 0.2))
print("Annotations:", apply_discount.__annotations__)`,
          expectedOutput: `Discounted: 200.0
Annotations: {'price': <class 'float'>, 'rate': <class 'float'>, 'return': <class 'float'>}`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'def apply_discount(price: float, rate: float = 0.1) -> float:',
          internalEffect: 'Stores type objects in apply_discount.__annotations__ without altering runtime execution.',
        },
      ],
      apply: {
        domain: 'API Contracts & Data Validation',
        contextTitle: 'Self-Documenting User Badge Formatter',
        scenario: 'Use type hints to clarify expected str, int, and bool types on a formatter.',
        code: `def badge(username: str, level: int, verified: bool = True) -> str:
    mark = "V" if verified else "U"
    return f"[{mark}] {username} (Lv.{level})"

print(badge("ada", 7))`,
        outcome: '[V] ada (Lv.7)',
      },
      commonMistakes: [
        {
          label: 'Assuming Type Hints Raise TypeError Automatically at Runtime',
          erroneousCode: `def repeat(text: str, n: int) -> str:
    return text * n

# Calling repeat(5, 3) returns 15 without a TypeError!`,
          errorMessage: 'No runtime TypeError: Python does not enforce type hints at runtime',
          explanation: 'Type hints are metadata for static analyzers (mypy/pyright) and IDEs, not runtime guards.',
          correctedCode: `def repeat(text: str, n: int) -> str:
    if not isinstance(text, str):
        raise TypeError("text must be str")
    return text * n`,
        },
      ],
      sourceNotes: 'Enrichment (beyond source): PEP 484 function type hints per Section 14 Day 11 brief.',
      practise: [
        {
          id: 'd11-s10-ex1',
          title: 'Fill the Gaps: Type-Hinted Function Signature',
          type: 'fill-the-gaps',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Typed Microservice Helper',
          prompt: 'Complete the PEP 484 type hints so `name` is `str`, `count` is `int`, and the return type is `str`.',
          starterCode: `def repeat_label(name: __GAP_1__, count: __GAP_2__) -> __GAP_3__:
    return name * count`,
          gaps: [
            { id: 'GAP_1', beforeText: 'name:', afterText: ',', correctAnswer: 'str', options: ['str', 'int', 'bool'] },
            { id: 'GAP_2', beforeText: 'count:', afterText: ')', correctAnswer: 'int', options: ['int', 'str', 'float'] },
            { id: 'GAP_3', beforeText: '->', afterText: ':', correctAnswer: 'str', options: ['str', 'None', 'list'] },
          ],
          hints: [
            'name holds text, so its type is str.',
            'count is a whole number multiplier, so its type is int.',
            'Multiplying str * int returns a str.',
          ],
        },
        {
          id: 'd11-s10-ex2',
          title: 'Theory: Runtime Behavior of Python Type Hints',
          type: 'theory-reasoning',
          tier: 'project',
          points: 15,
          contextScenario: 'Static Analysis vs Runtime Execution',
          prompt: 'If a function is defined as `def add(a: int, b: int) -> int: return a + b`, what happens at runtime when someone calls `add("Py", "Lab")`?',
          options: [
            {
              id: 'opt-1',
              text: 'It returns "PyLab" without raising a TypeError because Python does not enforce type hints at runtime.',
              explanation: 'Correct! Type hints populate __annotations__ for IDEs and static checkers (mypy/pyright), not runtime enforcement.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'Python raises TypeError immediately before entering add().',
              explanation: 'Incorrect. Python remains dynamically typed at runtime.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'Python converts "Py" and "Lab" to integers automatically.',
              explanation: 'Incorrect. Type hints never perform automatic casting.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'SyntaxError during compilation.',
              explanation: 'Incorrect. PEP 484 annotations are valid Python 3 syntax.',
              isCorrect: false,
            },
          ],
          hints: [
            'Are PEP 484 type hints enforced by the CPython runtime?',
            'What does "Py" + "Lab" evaluate to in Python?',
          ],
        },
      ],
    },
  ],
  realWorldLabs: [
    {
      id: 'day11-lab1',
      title: 'Cloud Microservice Pricing & Tax Calculator',
      description: 'Build composable pure functions with default tax rates and return values (not print) to calculate itemized cloud hosting bills.',
      domain: 'Cloud FinOps & Billing',
      starterCode: `def compute_compute_cost(hours, rate_per_hour=0.05):
    return round(hours * rate_per_hour, 2)

def apply_tax(subtotal, tax_rate=0.075):
    # Return subtotal + tax rounded to 2 decimal places
    pass

# Compute 100 hours at default rate, apply default tax, and print Total
`,
      targetOutput: `Subtotal: 5.0
Total with tax: 5.38`,
    },
    {
      id: 'day11-lab2',
      title: 'Configurable Webhook Event Logger',
      description: 'Use *args and **kwargs plus a dispatch dictionary of formatter functions to emit structured event logs.',
      domain: 'Observability & DevOps',
      starterCode: `def fmt_upper(msg):
    return msg.upper()

def emit_log(level, *tags, **fields):
    # Format tags joined by ',' and key=value pairs sorted by key
    pass

emit_log("WARN", "auth", "retry", user="ada", code=429)`,
      targetOutput: `[WARN] tags=auth,retry | code=429 user=ada`,
    },
  ],
  miniProject: {
    id: 'day11-project',
    title: 'Modular Payroll & Deductions Engine',
    brief: 'Architect a clean, pure-function payroll engine with docstrings, type hints, safe None defaults, *args bonus aggregation, and a dispatch dictionary for deduction strategies.',
    requirements: [
      'Define pure functions with PEP 257 docstrings and PEP 484 type hints (gross_pay, tax_deduction, net_pay)',
      'Use *args in sum_bonuses(*bonuses) to aggregate variable bonus payouts',
      'Use param=None safe default initialization when appending payslip audit entries',
      'Use a dispatch dictionary mapping employee tier ("junior", "senior") to allowance functions',
      'Avoid global state entirely—pass parameters in and return computed values out',
    ],
    rubric: [
      { criterion: 'Pure composable functions with docstrings and type hints', weight: 40 },
      { criterion: 'Safe None default & *args variadic handling', weight: 30 },
      { criterion: 'First-class function dispatch table & zero global mutation', weight: 30 },
    ],
    starterCode: `# Modular Payroll & Deductions Engine
def sum_bonuses(*bonuses: float) -> float:
    """Return total of all positional bonus amounts."""
    return float(sum(bonuses))

# Implement tier allowance functions, dispatch dict, and net_pay()
`,
  },
  dayQuiz: {
    title: 'Day 11 Mastery Checkpoint Quiz: Functions',
    passingScorePercentage: 80,
    questions: [
      {
        id: 'd11-q1',
        scenario: 'Implicit Return Value',
        question: 'What does a Python function return if it finishes without executing a `return` statement?',
        options: [
          { id: 'q1-a', text: 'None', explanation: 'Correct! Every Python function without an explicit return value implicitly returns None.', isCorrect: true },
          { id: 'q1-b', text: '0', explanation: 'Incorrect. Python does not return 0 by default.', isCorrect: false },
          { id: 'q1-c', text: 'False', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q1-d', text: 'Raises ValueError', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd11-q2',
        scenario: 'Mutable Default Argument Trap',
        question: 'Why is `def add(x, items=[]): items.append(x); return items` considered a bug?',
        options: [
          { id: 'q2-a', text: 'The default list [] is created once at def time and shared across all calls that omit items.', explanation: 'Correct! Use items=None and create a fresh list inside the function body.', isCorrect: true },
          { id: 'q2-b', text: 'Python raises SyntaxError for [] in a parameter list.', explanation: 'Incorrect. Python allows it syntactically, making the shared state bug subtle.', isCorrect: false },
          { id: 'q2-c', text: 'The list is frozen as a tuple.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q2-d', text: 'items is deleted after the first call.', explanation: 'Incorrect. It persists on the function object.', isCorrect: false },
        ],
      },
      {
        id: 'd11-q3',
        scenario: 'print() vs return',
        question: 'If `def f(x): print(x + 1)` is called via `y = f(4)`, what is `y`?',
        options: [
          { id: 'q3-a', text: 'None (while 5 is printed to stdout).', explanation: 'Correct! print() writes 5 to the console, and f returns None.', isCorrect: true },
          { id: 'q3-b', text: '5', explanation: 'Incorrect. Only return sends 5 back to y.', isCorrect: false },
          { id: 'q3-c', text: '"5"', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q3-d', text: 'TypeError', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd11-q4',
        scenario: 'LEGB Scope Order',
        question: 'In what order does Python search scopes when resolving a variable name?',
        options: [
          { id: 'q4-a', text: 'Local -> Enclosing -> Global -> Built-in (LEGB)', explanation: 'Correct! Python checks Local first, then Enclosing functions, then Global module, then Built-in.', isCorrect: true },
          { id: 'q4-b', text: 'Global -> Local -> Built-in -> Enclosing', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q4-c', text: 'Built-in -> Global -> Enclosing -> Local', explanation: 'Incorrect. Local overrides Global/Built-in, not the reverse.', isCorrect: false },
          { id: 'q4-d', text: 'Enclosing -> Local -> Global -> Built-in', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd11-q5',
        scenario: 'Call Stack Frames',
        question: 'What happens to a function’s local variables when that function returns?',
        options: [
          { id: 'q5-a', text: 'Its stack frame is popped and its local variable bindings are destroyed.', explanation: 'Correct! Each call gets a fresh stack frame that is removed on return.', isCorrect: true },
          { id: 'q5-b', text: 'They remain permanently in global scope.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q5-c', text: 'They are automatically saved to disk.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q5-d', text: 'They are merged into the caller’s locals.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd11-q6',
        scenario: 'Variadic Arguments',
        question: 'In `def log(*args, **kwargs):`, what does `**kwargs` collect?',
        options: [
          { id: 'q6-a', text: 'Extra keyword arguments as a dictionary.', explanation: 'Correct! **kwargs packs key=value arguments into a dict.', isCorrect: true },
          { id: 'q6-b', text: 'Extra positional arguments as a tuple.', explanation: 'Incorrect. That is *args.', isCorrect: false },
          { id: 'q6-c', text: 'Only integer arguments.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q6-d', text: 'Docstring metadata.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd11-q7',
        scenario: 'Docstrings',
        question: 'Where must a function’s docstring be placed to populate `fn.__doc__`?',
        options: [
          { id: 'q7-a', text: 'As the very first statement inside the function body.', explanation: 'Correct! Python binds the first string literal in def to __doc__.', isCorrect: true },
          { id: 'q7-b', text: 'Immediately above the def line as a # comment.', explanation: 'Incorrect. # comments are stripped by the compiler.', isCorrect: false },
          { id: 'q7-c', text: 'After the return statement.', explanation: 'Incorrect. Any statement after code is not __doc__.', isCorrect: false },
          { id: 'q7-d', text: 'Inside the parentheses of def.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd11-q8',
        scenario: 'First-Class Functions',
        question: 'How do you pass a function `transform` as an argument to `apply_to_list(data, ...)`?',
        options: [
          { id: 'q8-a', text: 'apply_to_list(data, transform) — without parentheses.', explanation: 'Correct! Omitting () passes the function object itself.', isCorrect: true },
          { id: 'q8-b', text: 'apply_to_list(data, transform()) — with parentheses.', explanation: 'Incorrect. Adding () calls transform immediately.', isCorrect: false },
          { id: 'q8-c', text: 'apply_to_list(data, "transform")', explanation: 'Incorrect. That passes a string.', isCorrect: false },
          { id: 'q8-d', text: 'Functions cannot be passed as arguments in Python.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd11-q9',
        scenario: 'Recursion Depth Limit',
        question: 'What exception does Python raise if a recursive function lacks a reachable base case?',
        options: [
          { id: 'q9-a', text: 'RecursionError: maximum recursion depth exceeded', explanation: 'Correct! Python protects the C stack by raising RecursionError at the depth limit (~1000).', isCorrect: true },
          { id: 'q9-b', text: 'SyntaxError', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q9-c', text: 'KeyError', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q9-d', text: 'StopIteration', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd11-q10',
        scenario: 'Type Hints (PEP 484)',
        question: 'What does `def f(x: int) -> str:` do at runtime in Python 3?',
        options: [
          { id: 'q10-a', text: 'Stores type metadata in f.__annotations__ for static tools and IDEs without enforcing types at runtime.', explanation: 'Correct! Type hints are non-enforcing metadata at runtime.', isCorrect: true },
          { id: 'q10-b', text: 'Automatically converts x to int and the return value to str.', explanation: 'Incorrect. Type hints never cast values.', isCorrect: false },
          { id: 'q10-c', text: 'Raises TypeError if x is not an int.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q10-d', text: 'Compiles the function to C.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
    ],
  },
  cheatSheet: [
    {
      category: 'Defining & Calling Functions (def & Call Stack Frames)',
      syntax: 'def func_name(params):\n    return value\nresult = func_name(args)',
      description: 'def creates a function object without executing it. Each call pushes a fresh stack frame with isolated local variables and pops it when returning. Always include () to invoke.',
      example: `def square(n):
    return n * n

print(square(5))  # 25`,
    },
    {
      category: 'Parameters vs Arguments (Positional & Keyword)',
      syntax: 'def fn(a, b): ...  |  fn(1, 2)  |  fn(b=2, a=1)',
      description: 'Parameters are formal names in def; arguments are values passed at call time. Positional arguments must precede keyword arguments in any call.',
      example: `def greet(name, role="member"):
    return f"{name} ({role})"

print(greet(role="admin", name="Ada"))`,
    },
    {
      category: 'return Values vs print() & Implicit None',
      syntax: 'return expression  # vs print(expression) -> None',
      description: 'print() writes to sys.stdout and returns None. return exits the function immediately and hands a value back to the caller. Omitting return yields None.',
      example: `def add(x, y):
    return x + y

total = add(3, 4) * 2  # 14`,
    },
    {
      category: 'Default Parameters & The Mutable Default Trap',
      syntax: 'def add_item(x, bag=None):\n    if bag is None:\n        bag = []',
      description: 'Default values are evaluated ONCE when def runs, not per call. Never use [] or {} as a default—use None and initialize a fresh container inside the body.',
      example: `def append_safe(x, items=None):
    if items is None:
        items = []
    items.append(x)
    return items`,
    },
    {
      category: 'Arbitrary Arguments (*args Tuple & **kwargs Dict)',
      syntax: 'def fn(req, *args, **kwargs):',
      description: '*args collects extra positional arguments into a tuple; **kwargs collects extra keyword arguments into a dict. Keep *args before **kwargs.',
      example: `def log(level, *tags, **meta):
    print(level, tags, meta)

log("INFO", "auth", code=200)`,
    },
    {
      category: 'Docstrings (__doc__ & PEP 257)',
      syntax: 'def fn():\n    """Concise summary."""\n    ...',
      description: 'A string literal as the very first statement inside def becomes fn.__doc__ at runtime for help() and IDEs, unlike # comments which are stripped.',
      example: `def area(w, h):
    """Return rectangle area."""
    return w * h

print(area.__doc__)`,
    },
    {
      category: 'LEGB Scope Order & Avoiding global State',
      syntax: 'Local -> Enclosing -> Global -> Built-in',
      description: 'Reads search L -> E -> G -> B. Assignments inside def create local variables (reading before assigning raises UnboundLocalError). Avoid global; pass parameters and return values.',
      example: `def bump(count):
    return count + 1

score = bump(10)  # 11`,
    },
    {
      category: 'First-Class Functions & Dispatch Dictionaries',
      syntax: 'ops = {"double": double}\nops["double"](5)',
      description: 'Functions are objects: assign them to variables, store them in dicts/lists, and pass them without () to higher-order functions.',
      example: `def double(x):
    return x * 2

def apply(fn, val):
    return fn(val)

print(apply(double, 7))  # 14`,
    },
    {
      category: 'Recursion Basics, Base Cases & RecursionError Limit',
      syntax: 'if base_case: return base_val\nreturn step(fn(smaller))',
      description: 'Every recursive function needs a reachable base case and a step moving toward it. Unbounded recursion exceeds the stack limit (~1000) and raises RecursionError.',
      example: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,
    },
    {
      category: 'Function Type Hints (PEP 484 — Enrichment)',
      syntax: 'def fn(x: int, y: float = 1.0) -> float:',
      description: 'Enrichment (beyond source): Type hints document expected parameter and return types in __annotations__ for IDEs and static checkers (mypy/pyright) without enforcing types at runtime.',
      example: `def discount(price: float, rate: float = 0.1) -> float:
    return round(price * (1 - rate), 2)`,
    },
  ],
  sourceNotes: [
    'Primary curriculum reference: Asabeneh Yetayeh, 30 Days of Python — Day 11: Functions (https://github.com/Asabeneh/30-Days-Of-Python/tree/master/11_Day_Functions).',
    'Enhanced with CPython call stack frame mechanics, LEGB scope resolution, mutable default argument trap, safe RecursionError demonstration, and PEP 484 type hints enrichment.',
  ],
};
