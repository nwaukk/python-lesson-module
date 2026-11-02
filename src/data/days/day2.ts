/**
 * Day 2 Curriculum Module: Variables and Built-in Functions ★
 * Strict compliance with Section 2, Section 7.3, Section 10.1, Section 10.2, and Section 14 (Day 2 Build Brief).
 * Covers: names bound to objects, assignment/reassignment, aliasing, multiple assignment,
 * naming rules & keywords, 10 core data types, type(), type conversion, built-in functions,
 * print vs return, mutable vs immutable shared references, 2 real-world labs,
 * 21 tiered practice exercises across all 8 question types, and a 10-question scenario checkpoint quiz.
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_2_MODULE: DayModule = {
  schemaVersion: 1,
  number: 2,
  title: 'Variables and Built-in Functions',
  level: 'beginner',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/02_Day_Variables_builtin_functions',
  estimatedMinutes: 90,
  prerequisites: [1],
  objectives: [
    'Understand variables as names bound to objects in heap memory (references, not static storage boxes).',
    'Master assignment, reassignment, and multiple assignment with parallel tuple unpacking.',
    'Validate identifiers against Python 3 syntax rules, the 35 reserved keywords, and PEP 8 snake_case style.',
    'Identify and differentiate Python\'s 10 core data types (int, float, complex, str, bool, list, tuple, set, dict, None).',
    'Execute runtime type inspection with type() and understand why bool is an explicit subclass of int.',
    'Perform safe type casting across int, float, str, bool, and list, diagnosing truncation and ValueError causes.',
    'Harness standard built-in functions (len, min, max, sum, sorted, input), distinguishing stdout from returned values.',
    'Dissect mutable vs immutable objects and predict the exact behaviour of shared references (aliasing).',
  ],

  subtopics: [
    // -------------------------------------------------------------
    // SUBTOPIC 1: Variables as Names Bound to Objects
    // -------------------------------------------------------------
    {
      id: 'd2-s1',
      number: 1,
      title: 'Variables as Names Bound to Objects',
      summary: 'In Python, a variable is not a static box that holds a value; it is a name tag bound by an arrow reference to an object residing in heap memory.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'The Python Object Model: Names and References',
        paragraphs: [
          'Many programming languages teach variables as "labelled boxes" where a value is physically placed inside a memory location. In Python, this mental model is completely wrong and leads to confusion when working with lists, functions, and objects.',
          'In Python, everything is an object living in heap memory. When you write an assignment statement such as city = "Lagos", Python first creates a string object containing "Lagos" in memory, and then binds the name tag "city" to that object. The variable is simply a pointer pointing to the object.',
          'Every object in Python has three fundamental properties: an identity (its memory address, inspectable via id()), a type (which dictates what operations it supports, inspectable via type()), and a value (the actual data it represents).',
        ],
        keyTerms: [
          {
            term: 'Object',
            definition: 'A discrete entity in Python memory possessing an identity, a type, and a value. In Python, all data (numbers, strings, functions) are objects.',
          },
          {
            term: 'Binding / Reference',
            definition: 'An association connecting an identifier (variable name) to an object in memory. Assignment (=) creates or moves this reference.',
          },
          {
            term: 'id()',
            definition: 'A built-in function that returns the unique integer identity of an object in memory (in CPython, this corresponds to its memory address).',
          },
        ],
        bulletPoints: [
          'Variables do not have types in Python; the objects they point to have types.',
          'Multiple variable names can point to the exact same object in memory simultaneously.',
          'The identity of an object never changes once created in memory.',
        ],
      },
      visualise: {
        type: 'memory-binding',
        title: 'Name-to-Object Binding Visualization',
        badge: 'simulation',
        description: 'See the namespace on the left point arrow references to objects stored in heap memory on the right.',
        initialConfig: { scenario: 'int-rebinding' },
      },
      code: [
        {
          title: 'Creating Variables and Inspecting Memory Identity',
          code: `# Creating variable bindings
state = "Kano"
population_millions = 14

print("Variable state points to:", state)
print("Variable population points to:", population_millions)

# Inspect unique object identity in CPython memory
print("Memory ID of state object:", id(state))
print("Memory ID of population object:", id(population_millions))`,
          runMode: 'real',
          expectedOutput: `Variable state points to: Kano
Variable population points to: 14
Memory ID of state object: [CPython Integer ID]
Memory ID of population object: [CPython Integer ID]`,
          notes: 'Notice that id() returns a large integer representing the object location in memory.',
          highlightLines: [2, 3, 9, 10],
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'state = "Kano"',
          internalEffect: 'CPython allocates a PyUnicodeObject containing "Kano" in heap memory and records the pointer in the local namespace under "state".',
          outputEffect: 'No output on stdout; pointer is stored.',
        },
        {
          step: 2,
          codeLine: 3,
          instruction: 'population_millions = 14',
          internalEffect: 'CPython checks small integer cache (-5 to 256), finds cached object for 14, and binds "population_millions" to it.',
          outputEffect: 'No output on stdout; pointer is stored.',
        },
        {
          step: 3,
          codeLine: 5,
          instruction: 'print("Variable state points to:", state)',
          internalEffect: 'Dereferences name "state", reads object value "Kano", and writes to stdout.',
          outputEffect: 'Variable state points to: Kano',
        },
      ],
      apply: {
        contextTitle: 'Logistics Fleet Tracking in Imo State',
        scenario: 'A transport logistics dispatch company assigns radio call-signs (variable names) to heavy-duty haulage trucks (memory objects) moving goods between Owerri and Onitsha.',
        code: `# Logistics Dispatch Asset Binding
truck_callsign = "TRUCK-EAST-401"
cargo_weight_kg = 28500
driver_name = "Chidi Okafor"

print(f"Active Dispatch: {truck_callsign}")
print(f"Driver Assigned: {driver_name} | Cargo Load: {cargo_weight_kg:,} kg")`,
        outcome: 'Active Dispatch: TRUCK-EAST-401\nDriver Assigned: Chidi Okafor | Cargo Load: 28,500 kg',
        domain: 'transport',
      },
      commonMistakes: [
        {
          label: 'The "Static Box" Misconception',
          erroneousCode: `# Learner assumes variable 'a' is a physical box
a = 10
# Expecting that altering a box somehow modifies the number 10 itself`,
          errorMessage: 'No error, but causes catastrophic confusion when working with mutable lists later.',
          explanation: 'Variables in Python are pointers, not storage boxes. The number 10 is an independent object in memory.',
          correctedCode: `# Correct mental model:
a = 10  # Name 'a' points to object 10
a = 20  # Name 'a' now points to object 20 (10 is left behind)`,
        },
      ],
      practise: [
        {
          id: 'd2-s1-ex1',
          title: 'Predict Output: Shared Identity of Cached Numbers',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Port Harcourt Refinery Pipe Valve Pressure Monitoring',
          prompt: 'An instrumentation technician writes the following code to calibrate two pressure sensor readings:\n\nvalve_a = 400\nvalve_b = valve_a\nprint(valve_a == valve_b, valve_a is valve_b)\n\nWhat prints to the console and why?',
          options: [
            {
              id: 'opt-1',
              text: 'True True — because both variables point to the exact same object in memory, so both their values (==) and identities (is) are identical.',
              explanation: 'Correct! valve_b was directly assigned valve_a, copying the pointer. Both evaluate to the identical memory address.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'True False — because the variables hold the same value, but assignment creates a duplicate copy in RAM.',
              explanation: 'Incorrect. In Python, assignment never copies objects; it only binds references.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'False False — because valve_a and valve_b are different identifier names.',
              explanation: 'Incorrect. Identifier names do not affect object equality or identity comparison.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'SyntaxError: cannot compare using both == and is on one line.',
              explanation: 'Incorrect. Passing two boolean expressions to print() separated by commas is completely valid syntax.',
              isCorrect: false,
            },
          ],
          hints: [
            'valve_b = valve_a creates an alias pointing to the identical object in memory.',
            'The == operator tests value equality (400 == 400).',
            'The is operator tests memory identity (id(valve_a) == id(valve_b)).',
          ],
        },
        {
          id: 'd2-s1-ex2',
          title: 'Theory Reasoning: Names vs Storage Boxes in CPython',
          type: 'theory-reasoning',
          tier: 'standard',
          points: 15,
          contextScenario: 'CPython Memory Architecture Seminar at University of Lagos',
          prompt: 'Explain why the "name tag bound to an object" mental model in Python differs fundamentally from the "value stored in a labelled box" model used in languages like C. Describe what happens in heap memory when a = 10 is executed.',
          modelAnswer: 'In C, declaring a variable allocates a fixed memory block of fixed size and type where bits are directly stored. In Python, variables do not have types or storage capacity; all values are independent PyObject structs allocated in heap memory containing type pointers and reference counts. Executing a = 10 creates or reuses an integer object 10 in heap memory and records a pointer from the name "a" in the local namespace dictionary to that object.',
          markingCriteria: [
            { id: 'crit-1', label: 'Distinguishes static memory buckets from heap PyObject pointers', points: 5 },
            { id: 'crit-2', label: 'Explains that types belong to objects, not variable names', points: 5 },
            { id: 'crit-3', label: 'Accurately describes namespace binding of identifier "a" to object 10', points: 5 },
          ],
          hints: [
            'Think about where the type information lives: in the variable or in the object?',
            'Consider what happens when multiple names point to the same object simultaneously.',
            'Mention how CPython uses pointers from namespaces to heap memory.',
          ],
        },
      ],
      assess: [],
    },

    // -------------------------------------------------------------
    // SUBTOPIC 2: Assignment and Reassignment
    // -------------------------------------------------------------
    {
      id: 'd2-s2',
      number: 2,
      title: 'Assignment and Reassignment',
      summary: 'Assignment in Python evaluates the right-hand side expression first, then binds the name on the left. Reassignment simply redirects the reference arrow to a new object.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Dynamic Rebinding: How Names Move',
        paragraphs: [
          'In mathematics, the statement x = x + 1 is an impossible contradiction. In Python, however, the single equals sign (=) is not an assertion of mathematical equality—it is the assignment operator.',
          'When Python executes an assignment statement, it always operates in two strict chronological phases: First, it evaluates the entire expression on the right-hand side (RHS) to produce an object. Second, it binds the identifier on the left-hand side (LHS) to that resulting object.',
          'Reassignment means binding an existing name to a different object. The previous object remains untouched in memory. If no other names point to that old object, CPython\'s automatic Garbage Collector (GC) will eventually reclaim its memory through reference counting.',
        ],
        keyTerms: [
          {
            term: 'Assignment Operator (=)',
            definition: 'The operator that binds an identifier on the left to the object evaluated on the right.',
          },
          {
            term: 'Reassignment',
            definition: 'Changing the binding of an existing variable name so that it points to a new or different object in memory.',
          },
          {
            term: 'Reference Counting',
            definition: 'CPython\'s memory management mechanism: every object tracks how many names point to it. When count reaches zero, memory is freed.',
          },
        ],
        bulletPoints: [
          'Python executes the right-hand side completely before modifying the left-hand side name.',
          'Reassigning a variable does NOT destroy the old object immediately if other variables still point to it.',
          'Python has no "const" keyword; all variable bindings can be reassigned unless protected by encapsulation.',
        ],
      },
      visualise: {
        type: 'memory-binding',
        title: 'Reassignment Pointer Movement',
        badge: 'simulation',
        description: 'Observe how reassignment redirects the variable arrow from one object to another.',
        initialConfig: { scenario: 'int-rebinding' },
      },
      code: [
        {
          title: 'Sequential Variable Reassignment',
          code: `# Initial assignment
account_balance = 25000
print("Opening Balance:", account_balance)

# Deposit transaction: RHS evaluates first (25000 + 15000 = 40000)
account_balance = account_balance + 15000
print("Balance after deposit:", account_balance)

# Withdrawal transaction
account_balance = account_balance - 8500
print("Closing Balance:", account_balance)`,
          runMode: 'real',
          expectedOutput: `Opening Balance: 25000
Balance after deposit: 40000
Closing Balance: 31500`,
          notes: 'Notice how account_balance is sequentially rebound to new integer objects.',
          highlightLines: [2, 6, 10],
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'account_balance = 25000',
          internalEffect: 'Binds identifier "account_balance" to integer object 25000.',
          outputEffect: 'Opening Balance: 25000',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 'account_balance = account_balance + 15000',
          internalEffect: 'Evaluates RHS: reads current 25000, adds 15000, creates new object 40000. Rebinds "account_balance" to 40000.',
          outputEffect: 'Balance after deposit: 40000',
        },
        {
          step: 3,
          codeLine: 10,
          instruction: 'account_balance = account_balance - 8500',
          internalEffect: 'Evaluates RHS: 40000 - 8500 = 31500. Rebinds identifier to new object 31500.',
          outputEffect: 'Closing Balance: 31500',
        },
      ],
      apply: {
        contextTitle: 'Balogun Market Daily Sales Accumulator',
        scenario: 'A retail fabric merchant at Balogun Market, Lagos records morning, afternoon, and evening sales sequentially into a daily total.',
        code: `# Daily Sales Ledger Reassignment
daily_sales = 0
daily_sales = daily_sales + 45000  # Morning textile sales
daily_sales = daily_sales + 62500  # Afternoon lace materials
daily_sales = daily_sales + 18000  # Evening accessories

print(f"Balogun Merchant Daily Total: N{daily_sales:,}")`,
        outcome: 'Balogun Merchant Daily Total: N125,500',
        domain: 'ecommerce',
      },
      commonMistakes: [
        {
          label: 'Using Equality (==) Instead of Assignment (=)',
          erroneousCode: `score == 100
print(score)`,
          errorMessage: 'NameError: name "score" is not defined',
          explanation: 'Double equals (==) is a comparison test for equality, not an assignment. The variable "score" was never created.',
          correctedCode: `score = 100  # Single equals (=) assigns
print(score)`,
        },
      ],
      practise: [
        {
          id: 'd2-s2-ex1',
          title: 'Predict Output: Sequential Inventory Reassignment',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Alaba International Electronics Market Wholesale Warehouse',
          prompt: 'A merchant tallies solar inverter stock across three deliveries:\n\nstock = 50\nstock = stock + 25\nstock = stock - 10\nprint(stock)\n\nWhat value is printed?',
          options: [
            {
              id: 'opt-1',
              text: '65 — because 50 + 25 = 75, then 75 - 10 = 65.',
              explanation: 'Correct! Sequential rebinding evaluates the right-hand side step by step.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: '50 — because variables in Python are immutable constants.',
              explanation: 'Incorrect. Variables in Python can be reassigned freely; they are not constants.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: '75 — because only the first reassignment takes effect.',
              explanation: 'Incorrect. Each assignment sequentially updates the variable binding.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: '15 — because 25 - 10 = 15.',
              explanation: 'Incorrect. The previous stock value of 50 was added in line 2.',
              isCorrect: false,
            },
          ],
          hints: [
            'Follow execution sequentially line by line.',
            'Line 2 updates stock from 50 to 75.',
            'Line 3 updates stock from 75 to 65.',
          ],
        },
        {
          id: 'd2-s2-ex2',
          title: 'Explain the Trace: Rebinding and Garbage Collection',
          type: 'explain-the-trace',
          tier: 'standard',
          points: 15,
          contextScenario: 'Kaduna Telecom Base Transceiver Station Ping Monitor',
          traceStepCode: `ping = 45
ping = 82
print(ping)`,
          traceQuestion: 'What happened to the integer object 45 when line 2 (ping = 82) executed?',
          prompt: 'A network engineer monitors latency pings. When ping = 82 is executed, what happens to the integer object 45 in memory?',
          options: [
            {
              id: 'opt-1',
              text: 'The reference count of object 45 drops to 0, making it eligible for garbage collection (or remaining in the small-int cache), while "ping" binds to 82.',
              explanation: 'Correct! Reassigning the identifier redirects the reference pointer. Object 45 loses its binding.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'The number 45 inside the memory cell is physically overwritten with the number 82.',
              explanation: 'Incorrect. Integers are immutable in Python; the object itself cannot be overwritten.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'Python raises a ReassignmentError because integers cannot change values.',
              explanation: 'Incorrect. Variables can be freely rebound to new objects.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'Object 45 is converted into an empty string.',
              explanation: 'Incorrect. Objects are not converted upon rebinding.',
              isCorrect: false,
            },
          ],
          hints: [
            'Recall that integers are immutable in Python.',
            'Assignment moves the name pointer from one object to another.',
            'Think about CPython\'s reference counting mechanism.',
          ],
        },
      ],
      assess: [],
    },

    // -------------------------------------------------------------
    // SUBTOPIC 3: Assigning One Variable to Another (b = a)
    // -------------------------------------------------------------
    {
      id: 'd2-s3',
      number: 3,
      title: 'Assigning One Variable to Another',
      summary: 'When you execute b = a, Python does NOT duplicate the data in memory. It creates a second reference arrow pointing to the exact same object.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Shared Object References: Two Names, One Object',
        paragraphs: [
          'A cornerstone of Python\'s speed and memory efficiency is that assignment never implicitly copies an object. When you write b = a, Python looks up what object "a" is pointing to, and makes "b" point to that identical object.',
          'Both identifiers now share ownership of the same object in heap memory. In programming terms, we say that "b" is an alias of "a".',
          'You can verify whether two variables point to the exact same object using Python\'s identity operator: is. The expression a is b returns True if and only if both variables point to the exact same memory address (id(a) == id(b)).',
        ],
        keyTerms: [
          {
            term: 'Aliasing',
            definition: 'A situation where two or more variable names reference the exact same object in memory simultaneously.',
          },
          {
            term: 'is Operator',
            definition: 'The identity comparison operator in Python. Evaluates to True if two variables point to the exact same object in memory.',
          },
          {
            term: 'Equality (==) vs Identity (is)',
            definition: '== checks if two objects have equal values; is checks if two variables point to the exact same object in memory.',
          },
        ],
        bulletPoints: [
          'b = a copies the memory address/pointer, NOT the underlying object.',
          'If the shared object is immutable (like an int or str), subsequent reassignment of one variable simply breaks the alias without affecting the other.',
          'If the shared object is mutable (like a list), modifying the object through one name is immediately visible through the other.',
        ],
      },
      visualise: {
        type: 'memory-binding',
        title: 'Aliasing and Shared Reference Visualization',
        badge: 'simulation',
        description: 'See two variable names point arrows to the identical heap object in memory.',
        initialConfig: { scenario: 'shared-list' },
      },
      code: [
        {
          title: 'Verifying Shared Object Identity with is and id()',
          code: `# Assign initial object
primary_city = "Enugu"

# Assign second variable to first
sister_city = primary_city

print("primary_city:", primary_city)
print("sister_city:", sister_city)

# Test whether they share the exact same object in memory
print("Do they point to the same object (is)?", primary_city is sister_city)
print("Memory ID primary:", id(primary_city))
print("Memory ID sister: ", id(sister_city))`,
          runMode: 'real',
          expectedOutput: `primary_city: Enugu
sister_city: Enugu
Do they point to the same object (is)? True
Memory ID primary: [Same Integer ID]
Memory ID sister:  [Same Integer ID]`,
          notes: 'Notice that id(primary_city) and id(sister_city) are 100% identical.',
          highlightLines: [2, 5, 11],
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'primary_city = "Enugu"',
          internalEffect: 'Allocates string "Enugu" at address X; binds "primary_city" to X.',
          outputEffect: 'No output on stdout.',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: 'sister_city = primary_city',
          internalEffect: 'Reads address X from "primary_city"; binds "sister_city" to address X. Reference count of "Enugu" increments to 2.',
          outputEffect: 'No output on stdout.',
        },
        {
          step: 3,
          codeLine: 11,
          instruction: 'print("Do they point to the same object (is)?", primary_city is sister_city)',
          internalEffect: 'Evaluates primary_city is sister_city by comparing memory pointers. They match, so returns True.',
          outputEffect: 'Do they point to the same object (is)? True',
        },
      ],
      apply: {
        contextTitle: 'Secondary School Student Record Synchronization',
        scenario: 'An administrative officer and a guidance counsellor at King\'s College, Lagos look up the same student profile card from different terminals.',
        code: `# Shared student record reference
admin_view_student = "Kelechi Nwachukwu (ID: KC-2024-88)"
counsellor_view_student = admin_view_student

print("Admin View:     ", admin_view_student)
print("Counsellor View:", counsellor_view_student)
print("Confirm Shared Identity:", admin_view_student is counsellor_view_student)`,
        outcome: 'Admin View:      Kelechi Nwachukwu (ID: KC-2024-88)\nCounsellor View: Kelechi Nwachukwu (ID: KC-2024-88)\nConfirm Shared Identity: True',
        domain: 'school',
      },
      commonMistakes: [
        {
          label: 'Assuming b = a Creates an Independent Copy',
          erroneousCode: `# Learner assumes modifying shared list 'b' won't touch 'a'
a = [10, 20]
b = a
b.append(30)
print(a)  # Learner expects [10, 20], but gets [10, 20, 30]!`,
          errorMessage: 'No error, but causes unintended data corruption because both names share one list.',
          explanation: 'Assignment binds references. To create a real independent copy of a list, use a.copy() or list(a).',
          correctedCode: `a = [10, 20]
b = a.copy()  # Creates a distinct, independent new list
b.append(30)
print("Original a:", a)  # [10, 20]
print("Copy b:    ", b)  # [10, 20, 30]`,
        },
      ],
      practise: [
        {
          id: 'd2-s3-ex1',
          title: 'Scenario MCQ: String Aliasing and Reassignment',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Kenneth Dike Library Catalog System, University of Ibadan',
          prompt: 'A cataloguer writes:\n\nbook_a = "Things Fall Apart"\nbook_b = book_a\nbook_a = "Arrow of God"\nprint(book_b)\n\nWhat prints to the console and why?',
          options: [
            {
              id: 'opt-1',
              text: '"Things Fall Apart" — because strings are immutable; reassigning book_a moved its pointer to a new string, leaving book_b pointing to the original.',
              explanation: 'Correct! Rebinding book_a does not alter book_b because strings cannot be mutated in place.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: '"Arrow of God" — because book_b is linked to book_a and always reflects its newest value.',
              explanation: 'Incorrect. Variables are not linked dynamically; each holds an independent pointer to an object.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'None — because reassigning book_a invalidates all aliases.',
              explanation: 'Incorrect. CPython keeps the original object alive as long as book_b still references it.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'SyntaxError: duplicate assignment to book_a.',
              explanation: 'Incorrect. Reassigning variables is standard Python.',
              isCorrect: false,
            },
          ],
          hints: [
            'Strings in Python are immutable.',
            'book_b = book_a bound book_b to "Things Fall Apart".',
            'book_a = "Arrow of God" only changed where book_a points.',
          ],
        },
        {
          id: 'd2-s3-ex2',
          title: 'Fix the Bug: Preventing Unintended List Mutation via .copy()',
          type: 'fix-the-bug',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Kano Leather Tannery Dispatch Registry',
          prompt: 'A logistics manager wanted to prepare a test dispatch list by taking a copy of the master roster. However, because they wrote dispatch_test = master_roster, adding "Batch-303" to dispatch_test accidentally corrupted master_roster! Repair the code using .copy() so master_roster remains ["Batch-101", "Batch-202"] while dispatch_test receives "Batch-303":',
          starterCode: `master_roster = ["Batch-101", "Batch-202"]
dispatch_test = master_roster
dispatch_test.append("Batch-303")

print("Master:", master_roster)
print("Test:  ", dispatch_test)`,
          solutionCode: `master_roster = ["Batch-101", "Batch-202"]
dispatch_test = master_roster.copy()
dispatch_test.append("Batch-303")

print("Master:", master_roster)
print("Test:  ", dispatch_test)`,
          testCases: [
            {
              id: 'tc-d2-copy',
              label: 'Verify Independent Master and Test Lists',
              setup: '',
              expected: `Master: ['Batch-101', 'Batch-202']\nTest:   ['Batch-101', 'Batch-202', 'Batch-303']`,
              hidden: false,
            },
          ],
          hints: [
            'Direct assignment dispatch_test = master_roster creates an alias to the same list.',
            'Use master_roster.copy() or list(master_roster) on line 2.',
            'Ensure master_roster retains only the original two batches.',
          ],
        },
      ],
      assess: [],
    },

    // -------------------------------------------------------------
    // SUBTOPIC 4: Multiple Assignment and Variable Swapping
    // -------------------------------------------------------------
    {
      id: 'd2-s4',
      number: 4,
      title: 'Multiple Assignment & Variable Swapping',
      summary: 'Python allows assigning multiple variables in a single elegant line through tuple unpacking, enabling atomic variable swaps like a, b = b, a without temporary storage.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Tuple Unpacking and Atomic Variable Swaps',
        paragraphs: [
          'Python allows you to assign values to multiple variables simultaneously on a single line: x, y, z = 10, 20, 30. This is not merely a shorthand trick—it is powered by Python\'s fundamental tuple packing and unpacking engine.',
          'When Python sees comma-separated values on the right-hand side, it implicitly packs them into a temporary tuple. It then unpacks each element sequentially into the corresponding variable names on the left-hand side.',
          'Because the entire right-hand side is evaluated before any binding occurs on the left-hand side, Python can swap two variables in a single atomic instruction: a, b = b, a. In languages like C, Java, or JavaScript, swapping two variables requires declaring an intermediate temporary variable (temp = a; a = b; b = temp). Python does this effortlessly.',
        ],
        keyTerms: [
          {
            term: 'Multiple Assignment',
            definition: 'Assigning values to multiple variables in a single statement (e.g. x, y = 1, 2).',
          },
          {
            term: 'Tuple Unpacking',
            definition: 'The process where elements of a sequence (tuple or list) are automatically distributed to individual target variables.',
          },
          {
            term: 'Atomic Swap (a, b = b, a)',
            definition: 'Exchanging the values of two variables in one step without needing a third temporary variable.',
          },
        ],
        bulletPoints: [
          'The number of variables on the left must exactly match the number of elements on the right.',
          'Mismatched counts trigger a ValueError: too many values to unpack or not enough values to unpack.',
          'Chained assignment (x = y = z = 0) binds multiple names to the exact same starting object.',
        ],
      },
      visualise: {
        type: 'memory-binding',
        title: 'Multiple Assignment & Swap Visualization',
        badge: 'simulation',
        description: 'Watch Python evaluate the right-hand side tuple and swap the references atomically.',
        initialConfig: { scenario: 'multiple-assignment' },
      },
      code: [
        {
          title: 'Multiple Assignment and Atomic Variable Swap',
          code: `# Multiple assignment in one line
first_name, last_name, state_origin = "Amina", "Danjuma", "Kaduna"
print(f"Name: {first_name} {last_name} | State: {state_origin}")

# Swapping two variables without a temporary variable
a = "Gold Medal"
b = "Silver Medal"
print(f"Before swap -> Competitor 1: {a}, Competitor 2: {b}")

# Atomic swap!
a, b = b, a
print(f"After swap  -> Competitor 1: {a}, Competitor 2: {b}")`,
          runMode: 'real',
          expectedOutput: `Name: Amina Danjuma | State: Kaduna
Before swap -> Competitor 1: Gold Medal, Competitor 2: Silver Medal
After swap  -> Competitor 1: Silver Medal, Competitor 2: Gold Medal`,
          notes: 'Notice how cleanly a, b = b, a exchanges the bindings without temp variables.',
          highlightLines: [2, 10],
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'first_name, last_name, state_origin = "Amina", "Danjuma", "Kaduna"',
          internalEffect: 'Constructs temporary tuple ("Amina", "Danjuma", "Kaduna") and unpacks elements into first_name, last_name, and state_origin.',
          outputEffect: 'Variables bound in namespace.',
        },
        {
          step: 2,
          codeLine: 10,
          instruction: 'a, b = b, a',
          internalEffect: 'Evaluates RHS (b, a) into temporary tuple ("Silver Medal", "Gold Medal"). Then binds LHS "a" to "Silver Medal" and "b" to "Gold Medal".',
          outputEffect: 'References swapped.',
        },
      ],
      apply: {
        contextTitle: 'Flight Navigation Waypoint Coordinates Swap',
        scenario: 'An air traffic controller in Abuja updates flight plan waypoints for an aircraft diverting between Port Harcourt and Calabar.',
        code: `# Air Traffic Route Waypoints Swap
waypoint_alpha = "Port Harcourt (DNPO)"
waypoint_bravo = "Calabar (DNCA)"

print(f"Original Route: {waypoint_alpha} -> {waypoint_bravo}")

# Invert route sequence for return flight
waypoint_alpha, waypoint_bravo = waypoint_bravo, waypoint_alpha

print(f"Return Route:   {waypoint_alpha} -> {waypoint_bravo}")`,
        outcome: 'Original Route: Port Harcourt (DNPO) -> Calabar (DNCA)\nReturn Route:   Calabar (DNCA) -> Port Harcourt (DNPO)',
        domain: 'transport',
      },
      commonMistakes: [
        {
          label: 'Unpacking Count Mismatch (ValueError)',
          erroneousCode: `x, y = 10, 20, 30`,
          errorMessage: 'ValueError: too many values to unpack (expected 2)',
          explanation: 'There are 3 values on the right, but only 2 variables on the left. Python requires an exact 1:1 match.',
          correctedCode: `# Match the exact number of targets:
x, y, z = 10, 20, 30
# Or use list/tuple directly:
coordinates = (10, 20, 30)`,
        },
      ],
      practise: [
        {
          id: 'd2-s4-ex1',
          title: 'Order the Lines: Currency Stall Cashier Swap',
          type: 'order-the-lines',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Onitsha Main Market Bureau De Change',
          prompt: 'Arrange the jumbled code lines to initialize currency balances, display the initial holdings, execute an atomic swap, and display the swapped result:',
          jumbledLines: [
            { id: 'line-3', code: 'print(f"Before: NGN={naira_drawer}, USD={dollar_drawer}")', indent: 0 },
            { id: 'line-1', code: 'naira_drawer = 750000', indent: 0 },
            { id: 'line-4', code: 'naira_drawer, dollar_drawer = dollar_drawer, naira_drawer', indent: 0 },
            { id: 'line-2', code: 'dollar_drawer = 500', indent: 0 },
            { id: 'line-5', code: 'print(f"After:  NGN={naira_drawer}, USD={dollar_drawer}")', indent: 0 },
          ],
          correctLineOrder: ['line-1', 'line-2', 'line-3', 'line-4', 'line-5'],
          hints: [
            'First initialize naira_drawer and dollar_drawer.',
            'Print the "Before:" line next.',
            'Perform the atomic swap naira_drawer, dollar_drawer = dollar_drawer, naira_drawer.',
          ],
        },
        {
          id: 'd2-s4-ex2',
          title: 'Fill the Gaps: Geological GPS Coordinates Unpacking',
          type: 'fill-the-gaps',
          tier: 'standard',
          points: 15,
          contextScenario: 'Jos Plateau Mineral Survey Expedition',
          prompt: 'Fill in the code tokens to unpack latitude and longitude coordinates and swap them using Python tuple unpacking:',
          gaps: [
            {
              id: 'gap-1',
              beforeText: 'latitude, longitude = 9.8965, 8.8583\n# Atomic swap without temp variable:\nlatitude, longitude = ',
              afterText: '',
              correctAnswer: 'longitude, latitude',
              options: ['longitude, latitude', 'latitude, longitude', 'temp, latitude', 'swap(latitude, longitude)'],
            },
          ],
          hints: [
            'In Python, a, b = b, a swaps two variables.',
            'On the right-hand side, write the variables in reversed order: longitude, latitude.',
          ],
        },
      ],
      assess: [],
    },

    // -------------------------------------------------------------
    // SUBTOPIC 5: Naming Rules, Conventions & Python Keywords
    // -------------------------------------------------------------
    {
      id: 'd2-s5',
      number: 5,
      title: 'Naming Rules, Conventions & Keywords',
      summary: 'Learn the strict syntax rules that govern Python identifiers, why hyphens cause subtraction errors, and how to avoid conflicting with Python\'s 35 reserved keywords.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Valid Identifiers, PEP 8 snake_case, and Reserved Keywords',
        paragraphs: [
          'In Python, the names you give to variables, functions, and classes are called identifiers. While Python gives you great freedom, identifiers must strictly obey Python grammar rules or the compiler will reject your code with a SyntaxError.',
          'The three core grammar rules are: 1. Identifiers can only contain ASCII letters (a-z, A-Z), digits (0-9), and underscores (_). 2. An identifier cannot begin with a digit. 3. An identifier cannot be one of Python\'s 35 reserved keywords (such as if, for, def, class, return).',
          'Python is strictly case-sensitive: age, Age, and AGE are three completely distinct variable names pointing to three separate objects in memory. For clean professional code, Python\'s official style guide (PEP 8) mandates snake_case (all lowercase words separated by underscores) for variables.',
        ],
        keyTerms: [
          {
            term: 'Identifier',
            definition: 'A sequence of characters used to name a variable, function, class, module, or other object in Python.',
          },
          {
            term: 'PEP 8',
            definition: 'Python Enhancement Proposal 8: the official style guide for Python code, recommending snake_case for variables.',
          },
          {
            term: 'keyword.kwlist',
            definition: 'The standard library module list containing all 35 reserved words that cannot be used as identifiers.',
          },
        ],
        bulletPoints: [
          'Never use hyphens (-) in variable names; Python interprets hyphens as minus/subtraction signs.',
          'Never use spaces; variable names must be single contiguous tokens.',
          'Keywords like True, False, None, class, def, import, and for cannot be re-assigned as variable names.',
        ],
      },
      visualise: {
        type: 'naming-rules',
        title: 'Python Variable Naming & Keyword Checker',
        badge: 'simulation',
        description: 'Type any candidate identifier to test it against Python 3 grammar and the 35 reserved keywords.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Valid Identifiers vs Syntax Rules Demonstration',
          code: `# Valid PEP 8 snake_case variable names
student_first_name = "Chinedu"
daily_revenue_ngn = 450000
is_terminal_online = True
_internal_counter = 1

print(student_first_name, daily_revenue_ngn, is_terminal_online)

# Case sensitivity demonstration: these are 3 DISTINCT variables!
city = "Ibadan"
City = "Abuja"
CITY = "Kano"

print(f"city: {city} | City: {City} | CITY: {CITY}")`,
          runMode: 'real',
          expectedOutput: `Chinedu 450000 True
city: Ibadan | City: Abuja | CITY: Kano`,
          notes: 'Notice how city, City, and CITY exist concurrently without overwriting each other.',
          highlightLines: [2, 3, 4, 10, 11, 12],
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'student_first_name = "Chinedu"',
          internalEffect: 'Lexer parses identifier "student_first_name", confirms all characters are alphanumeric + underscore, binds name.',
          outputEffect: 'No output on stdout.',
        },
        {
          step: 2,
          codeLine: 10,
          instruction: 'city = "Ibadan"; City = "Abuja"; CITY = "Kano"',
          internalEffect: 'CPython hashes string names by exact case. Hashes for "city", "City", and "CITY" are unique entries in namespace dict.',
          outputEffect: 'Three separate bindings created.',
        },
      ],
      apply: {
        contextTitle: 'Supermarket Inventory Code Convention',
        scenario: 'A database developer sets up clean, compliant identifiers for an inventory system tracking Nigerian consumer packaged goods.',
        code: `# Clean Inventory Identifiers (PEP 8 Compliant)
product_sku = "SKU-BEV-992"
unit_price_kobo = 75000
stock_quantity = 144
is_refrigerated = False

print(f"Product: {product_sku} | Stock: {stock_quantity} units")
print(f"Price: N{unit_price_kobo / 100:.2f} | Cold Storage: {is_refrigerated}")`,
        outcome: 'Product: SKU-BEV-992 | Stock: 144 units\nPrice: N750.00 | Cold Storage: False',
        domain: 'ecommerce',
      },
      commonMistakes: [
        {
          label: 'Using Hyphens in Variable Names',
          erroneousCode: `first-name = "Emeka"`,
          errorMessage: 'SyntaxError: cannot assign to expression here. Maybe you meant \'==\'?',
          explanation: 'Python interprets "-" as the subtraction operator. It parses this as "first minus name = ...", which is invalid syntax.',
          correctedCode: `first_name = "Emeka"  # Use underscores instead of hyphens`,
        },
        {
          label: 'Naming a Variable After a Python Keyword',
          erroneousCode: `class = "Grade 10"`,
          errorMessage: 'SyntaxError: invalid syntax',
          explanation: '"class" is a reserved Python keyword used to define object classes. It cannot be used as an identifier.',
          correctedCode: `school_class = "Grade 10"  # Prepend or append context`,
        },
      ],
      practise: [
        {
          id: 'd2-s5-ex1',
          title: 'Scenario MCQ: Identifying the Illegal Identifier',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Owerri Community Pharmacy Dispensing Software',
          prompt: 'A junior pharmacy programmer needs to name a variable storing patient prescription counts. Which of the following names will trigger an immediate SyntaxError in Python?',
          options: [
            {
              id: 'opt-1',
              text: '2nd_prescription — because Python identifiers can never begin with a digit.',
              explanation: 'Correct! Leading digits cause SyntaxError: invalid decimal literal.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'prescription_count — because underscores are prohibited.',
              explanation: 'Incorrect. Underscores are completely legal and recommended by PEP 8.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: '_dosage_mg — because leading underscores are reserved for the operating system.',
              explanation: 'Incorrect. Leading underscores are valid Python identifiers often used to indicate private/internal use.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'drugName — because capital letters are illegal in variables.',
              explanation: 'Incorrect. Capital letters are legal, though PEP 8 prefers snake_case for variables.',
              isCorrect: false,
            },
          ],
          hints: [
            'Check Rule 2 of Python identifiers: what character can NEVER be at index 0?',
            'Digits (0-9) are allowed anywhere except the very first character.',
          ],
        },
        {
          id: 'd2-s5-ex2',
          title: 'Fix the Bug: Repairing Keyword and Hyphen Syntax Errors',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 15,
          contextScenario: 'Warri Maritime Cargo Terminal Container Yard',
          prompt: 'A port logistics intern wrote code with two syntax errors: container-id uses a hyphen (which Python sees as subtraction), and class is a reserved keyword. Fix both identifiers to valid PEP 8 snake_case names (container_id and container_class) so the script runs cleanly:',
          starterCode: `container-id = "CONT-WRI-8802"
class = "Refrigerated"

print(f"Container: {container-id} | Class: {class}")`,
          solutionCode: `container_id = "CONT-WRI-8802"
container_class = "Refrigerated"

print(f"Container: {container_id} | Class: {container_class}")`,
          testCases: [
            {
              id: 'tc-d2-naming',
              label: 'Clean Execution with Valid Identifiers',
              setup: '',
              expected: 'Container: CONT-WRI-8802 | Class: Refrigerated',
              hidden: false,
            },
          ],
          hints: [
            'Replace the hyphen in container-id with an underscore: container_id.',
            'Rename class to something that is not a reserved keyword, such as container_class.',
            'Update the f-string references on line 4 to match the new names.',
          ],
        },
      ],
      assess: [],
    },

    // -------------------------------------------------------------
    // SUBTOPIC 6: The 10 Core Data Types
    // -------------------------------------------------------------
    {
      id: 'd2-s6',
      number: 6,
      title: 'The 10 Core Data Types',
      summary: 'Inspect Python\'s 10 primary built-in data types spanning numbers, text sequences, collections, truth values, and the singleton None.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Overview of Python\'s Fundamental Data Types',
        paragraphs: [
          'Python provides 10 essential built-in data types that serve as the building blocks for virtually all programs. Because Python is dynamically typed, you do not declare types when creating variables—Python automatically assigns the appropriate type to the object when you create it.',
          'The 10 core types can be grouped into clear functional categories: 1. Numeric (int, float, complex). 2. Sequences (str, list, tuple). 3. Sets (set). 4. Mappings (dict). 5. Boolean (bool). 6. Null type (NoneType).',
          'A vital distinction to master early is mutability: Mutable objects (list, set, dict) can be altered in place after creation, while immutable objects (int, float, complex, str, tuple, bool, None) can never have their contents changed in memory.',
        ],
        keyTerms: [
          {
            term: 'Dynamic Typing',
            definition: 'A language characteristic where variable types are determined at runtime based on the object assigned, not explicitly declared.',
          },
          {
            term: 'Mutability',
            definition: 'Whether an object\'s internal value can be altered in memory after it has been created (mutable vs immutable).',
          },
          {
            term: 'None',
            definition: 'Python\'s unique singleton object representing the absence of a value, uninitialized data, or a function with no explicit return.',
          },
        ],
        bulletPoints: [
          'Integers in Python 3 have unlimited precision; they never overflow.',
          'Floating-point numbers are 64-bit IEEE 754 representations.',
          'None is a singleton: exactly one None object exists in Python\'s runtime memory.',
        ],
      },
      visualise: {
        type: 'data-types-visualizer',
        title: 'Python 10 Core Data Types Visualiser',
        badge: 'simulation',
        description: 'Explore descriptions, syntax, mutability badges, and CPython memory notes for all 10 core data types.',
        initialConfig: { selectedTag: 'int' },
      },
      code: [
        {
          title: 'Declaring the 10 Core Python Data Types',
          code: `# 1. Integer (int)
student_count = 45

# 2. Floating-point (float)
fuel_price = 850.50

# 3. Complex number (complex)
ac_impedance = 4 + 3j

# 4. String (str)
state_name = "Cross River"

# 5. Boolean (bool)
is_valid = True

# 6. List (list - mutable sequence)
staples = ["Yam", "Cassava", "Plantain"]

# 7. Tuple (tuple - immutable sequence)
gps_coords = (9.0765, 7.3986)

# 8. Set (set - unique unordered items)
unique_user_ids = {101, 102, 103}

# 9. Dictionary (dict - key-value mapping)
user_profile = {"username": "zainab_k", "role": "admin"}

# 10. NoneType (None)
pending_response = None

print("All 10 core types created successfully!")`,
          runMode: 'real',
          expectedOutput: 'All 10 core types created successfully!',
          notes: 'Every variable here is bound to a distinct object type in memory.',
          highlightLines: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29],
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 17,
          instruction: 'staples = ["Yam", "Cassava", "Plantain"]',
          internalEffect: 'Allocates PyListObject containing pointers to 3 string objects. Lists are mutable and can be resized.',
          outputEffect: 'No output on stdout.',
        },
        {
          step: 2,
          codeLine: 20,
          instruction: 'gps_coords = (9.0765, 7.3986)',
          internalEffect: 'Allocates PyTupleObject containing 2 float pointers. Tuples are immutable and fixed-length.',
          outputEffect: 'No output on stdout.',
        },
        {
          step: 3,
          codeLine: 29,
          instruction: 'pending_response = None',
          internalEffect: 'Binds identifier "pending_response" to the global _Py_NoneStruct singleton object.',
          outputEffect: 'No output on stdout.',
        },
      ],
      apply: {
        contextTitle: 'Federal Road Safety Commission Vehicle Registration',
        scenario: 'A transportation software engineer models vehicle registration data using Python\'s core primitive and container data types.',
        code: `# Vehicle Registration Profile
plate_number = "ABC-123-XY"           # str
model_year = 2022                      # int
engine_displacement = 2.4              # float
is_commercial = True                   # bool
inspection_defects = []                # list (mutable)
registered_owner = {                   # dict (mapping)
    "name": "Babatunde Adeleke",
    "state": "Oyo"
}

print(f"Vehicle: {plate_number} ({model_year}) | Engine: {engine_displacement}L")
print(f"Owner: {registered_owner['name']} | Commercial: {is_commercial}")`,
        outcome: 'Vehicle: ABC-123-XY (2022) | Engine: 2.4L\nOwner: Babatunde Adeleke | Commercial: True',
        domain: 'transport',
      },
      commonMistakes: [
        {
          label: 'Creating an Empty Set with {} Instead of set()',
          erroneousCode: `my_set = {}
print(type(my_set))  # Prints <class 'dict'>!`,
          errorMessage: 'No error, but my_set is a dictionary, NOT a set!',
          explanation: 'Curly braces {} default to creating an empty dictionary. To create an empty set, you MUST write set().',
          correctedCode: `my_set = set()  # Correct empty set
print(type(my_set))  # <class 'set'>`,
        },
      ],
      practise: [
        {
          id: 'd2-s6-ex1',
          title: 'Fill the Gaps: Classifying Literals to Python Types',
          type: 'fill-the-gaps',
          tier: 'standard',
          points: 15,
          contextScenario: 'Cross River National Park Wildlife Sensor Telemetry',
          prompt: 'Fill in the correct Python data type names for each sensor literal:',
          gaps: [
            {
              id: 'gap-1',
              beforeText: 'sensor_reading = 36.5  # Type is: ',
              afterText: '',
              correctAnswer: 'float',
              options: ['float', 'int', 'decimal', 'number'],
            },
            {
              id: 'gap-2',
              beforeText: '\ntag_id = "CRNP-901"   # Type is: ',
              afterText: '',
              correctAnswer: 'str',
              options: ['str', 'char', 'string', 'text'],
            },
            {
              id: 'gap-3',
              beforeText: '\ngps_fixed = (6.21, 8.85)  # Type is: ',
              afterText: '',
              correctAnswer: 'tuple',
              options: ['tuple', 'list', 'set', 'array'],
            },
          ],
          hints: [
            'Numbers with decimal points are float.',
            'Text in quotes is str.',
            'Comma-separated values in parentheses are tuple.',
          ],
        },
        {
          id: 'd2-s6-ex2',
          title: 'Predict Output: The Empty Curly Braces Trap',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Benin Bronze Foundry Quality Control Register',
          prompt: 'An apprentice enters the following command:\n\nregistry = {}\nprint(type(registry))\n\nWhat exact type is printed to the console?',
          options: [
            {
              id: 'opt-1',
              text: "<class 'dict'> — because Python syntax defaults empty curly braces {} to creating an empty dictionary, NOT a set.",
              explanation: 'Correct! Historically, dictionaries came before sets in Python, so {} is reserved for dict. Empty sets must use set().',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: "<class 'set'> — because sets use curly braces in Python.",
              explanation: 'Incorrect. While non-empty sets use {1, 2}, empty {} creates a dictionary.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: "<class 'NoneType'> — because nothing was put inside the braces.",
              explanation: 'Incorrect. {} creates a valid, empty dictionary container object.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'SyntaxError: empty braces are invalid syntax.',
              explanation: 'Incorrect. {} is completely valid syntax.',
              isCorrect: false,
            },
          ],
          hints: [
            'Remember Section 14 watch-out: {} creates a dictionary, not a set.',
            'To create an empty set in Python, you must call set().',
          ],
        },
      ],
      assess: [],
    },

    // -------------------------------------------------------------
    // SUBTOPIC 7: Inspecting Types with type()
    // -------------------------------------------------------------
    {
      id: 'd2-s7',
      number: 7,
      title: 'Inspecting Types with type()',
      summary: 'Use the built-in type() function to examine runtime object classes, and discover why Python\'s bool type is an explicit subclass of int.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Runtime Type Inspection and the Boolean Subclass',
        paragraphs: [
          'Because Python does not enforce static type declarations, you often need to inspect what kind of object a variable is referencing at runtime. Python provides the built-in type() function for this purpose.',
          'Calling type(x) returns the type object (written in output as <class \'typename\'>). For example, type(42) produces <class \'int\'> and type("Lagos") produces <class \'str\'>.',
          'An extraordinary feature of Python\'s type hierarchy that catches many beginners by surprise is that bool is an explicit subclass of int! In Python, issubclass(bool, int) is True. The boolean singleton True evaluates numerically as 1, and False evaluates as 0 in arithmetic operations.',
        ],
        keyTerms: [
          {
            term: 'type()',
            definition: 'A built-in function that returns the class type of any Python object passed to it.',
          },
          {
            term: 'isinstance(object, class)',
            definition: 'A built-in function that checks if an object is an instance of a specified class or any of its subclasses (recommended over type() == class).',
          },
          {
            term: 'bool as int subclass',
            definition: 'In Python, bool inherits directly from int. True == 1 and False == 0 in mathematical comparisons.',
          },
        ],
        bulletPoints: [
          'type(obj) directly inspects the object\'s internal type pointer.',
          'isinstance(True, int) returns True because bool inherits from int.',
          'In production code, isinstance() is preferred over type() == class because it respects inheritance.',
        ],
      },
      visualise: {
        type: 'data-types-visualizer',
        title: 'Live type() Evaluator Lab',
        badge: 'simulation',
        description: 'Input any custom literal or expression to see type() evaluated in real time.',
        initialConfig: { customInput: 'True' },
      },
      code: [
        {
          title: 'Inspecting Types and Verifying bool Inheritance',
          code: `# Inspecting core types
print("type(100):          ", type(100))
print("type(3.14):         ", type(3.14))
print("type('Hello'):      ", type('Hello'))
print("type([1, 2, 3]):    ", type([1, 2, 3]))
print("type(None):         ", type(None))

# Exploring the Boolean-Integer relationship (Section 14 Watch-out)
print("\\n--- Boolean Inheritance Inspection ---")
print("type(True):         ", type(True))
print("isinstance(True, int):", isinstance(True, int))
print("issubclass(bool, int):", issubclass(bool, int))
print("Arithmetic with bool:  True + True =", True + True)
print("Numeric comparison:    True == 1 is", True == 1)`,
          runMode: 'real',
          expectedOutput: `type(100):           <class 'int'>
type(3.14):          <class 'float'>
type('Hello'):       <class 'str'>
type([1, 2, 3]):     <class 'list'>
type(None):          <class 'NoneType'>

--- Boolean Inheritance Inspection ---
type(True):          <class 'bool'>
isinstance(True, int): True
issubclass(bool, int): True
Arithmetic with bool:  True + True = 2
Numeric comparison:    True == 1 is True`,
          notes: 'Notice how True + True evaluates to 2 because bool inherits from int!',
          highlightLines: [9, 10, 11, 12],
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'print("type(100):", type(100))',
          internalEffect: 'Passes 100 to type(); reads ob_type pointer from PyObject struct header; returns <class "int">.',
          outputEffect: 'type(100): <class \'int\'>',
        },
        {
          step: 2,
          codeLine: 10,
          instruction: 'isinstance(True, int)',
          internalEffect: 'Checks PyBool_Type method resolution order (MRO); finds PyLong_Type in base classes; returns True.',
          outputEffect: 'isinstance(True, int): True',
        },
        {
          step: 3,
          codeLine: 12,
          instruction: 'True + True',
          internalEffect: 'No custom addition on bool; falls back to int.__add__(1, 1); returns integer 2.',
          outputEffect: 'Arithmetic with bool: True + True = 2',
        },
      ],
      apply: {
        contextTitle: 'Secure Banking API Payload Data Sanitizer',
        scenario: 'A fintech developer at a payment gateway in Victoria Island, Lagos sanitizes incoming JSON payload fields to ensure account numbers are integers and amounts are numeric.',
        code: `# Inbound API Payload Type Verification
account_number = 1029384756
transfer_amount = 75000.00
is_biometric_verified = True

print("Account field valid integer?", isinstance(account_number, int))
print("Amount field valid numeric? ", isinstance(transfer_amount, (int, float)))
print("Biometric flag valid bool?  ", isinstance(is_biometric_verified, bool))`,
        outcome: 'Account field valid integer? True\nAmount field valid numeric?  True\nBiometric flag valid bool?   True',
        domain: 'finance',
      },
      commonMistakes: [
        {
          label: 'Checking Types by String Comparison',
          erroneousCode: `user_age = 25
if str(type(user_age)) == "<class 'int'>":
    print("Valid age")`,
          errorMessage: 'Brittle code: converting type object to string is inefficient and unpythonic.',
          explanation: 'Always use isinstance(user_age, int) or user_age is int instead of parsing strings.',
          correctedCode: `user_age = 25
if isinstance(user_age, int):
    print("Valid age")`,
        },
      ],
      practise: [
        {
          id: 'd2-s7-ex1',
          title: 'Scenario MCQ: Arithmetic on Boolean Types',
          type: 'scenario-mcq',
          tier: 'standard',
          points: 15,
          contextScenario: 'Calabar Carnival Cultural Float Participation Registry',
          prompt: 'An event organizer tracks carnival band participation flags:\n\nband_a_registered = True\nband_b_registered = True\nband_c_registered = False\n\ntotal = band_a_registered + band_b_registered + band_c_registered\nprint(total, isinstance(band_a_registered, int))\n\nWhat prints to the console and why?',
          options: [
            {
              id: 'opt-1',
              text: '2 True — because in Python, bool is an explicit subclass of int where True == 1 and False == 0.',
              explanation: 'Correct! True is 1 and False is 0, so 1 + 1 + 0 = 2. Furthermore, isinstance(True, int) is True because bool inherits from int.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'True False — because booleans cannot be added arithmetically.',
              explanation: 'Incorrect. Booleans in Python are integers and support full arithmetic.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'TypeError: unsupported operand for +: bool and bool.',
              explanation: 'Incorrect. Python allows adding booleans without any error.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: '3 True — because all three variables are boolean objects.',
              explanation: 'Incorrect. False has numerical value 0, so 1 + 1 + 0 = 2.',
              isCorrect: false,
            },
          ],
          hints: [
            'Remember that True acts like 1 and False acts like 0 in arithmetic.',
            'issubclass(bool, int) is True in Python.',
          ],
        },
        {
          id: 'd2-s7-ex2',
          title: 'Theory Reasoning: type(x) == T vs isinstance(x, T)',
          type: 'theory-reasoning',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Fintech Payment Gateway Architecture Review',
          prompt: 'Why do Python guidelines and PEP 8 strongly recommend using isinstance(x, int) instead of type(x) == int when checking data types? What happens when x is a boolean in both checks?',
          modelAnswer: 'isinstance(x, T) checks whether x is an instance of class T or any subclass derived from T, properly supporting object-oriented polymorphism and inheritance. In contrast, type(x) == T performs an exact identity check that rejects valid subclasses. When x is True, isinstance(True, int) evaluates to True because bool inherits from int, whereas type(True) == int evaluates to False because type(True) is specifically <class "bool">.',
          markingCriteria: [
            { id: 'crit-1', label: 'Explains that isinstance() supports class inheritance and subclasses', points: 7 },
            { id: 'crit-2', label: 'Explains that type(x) == T rejects valid subclasses', points: 6 },
            { id: 'crit-3', label: 'Contrasts the outcome when x = True for both checks', points: 7 },
          ],
          hints: [
            'Consider inheritance: does a subclass count as an instance of its parent?',
            'Test both checks mentally with x = True.',
          ],
        },
      ],
      assess: [],
    },

    // -------------------------------------------------------------
    // SUBTOPIC 8: Type Conversion and Type Casting
    // -------------------------------------------------------------
    {
      id: 'd2-s8',
      number: 8,
      title: 'Type Conversion and Type Casting',
      summary: 'Master explicit conversion using int(), float(), str(), bool(), and list(), and learn how to avoid common conversion pitfalls like decimal string parsing errors.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Explicit Type Casting and Error Diagnostics',
        paragraphs: [
          'Python is strongly typed: it will not silently convert data between incompatible types for you. If you attempt to add an integer to a string ("42" + 10), Python raises a TypeError instead of guessing what you meant.',
          'To transform data from one type to another, Python provides constructor functions: int(), float(), str(), bool(), and list(). Understanding how these functions convert data—and where they fail—is critical for processing user input and file data.',
          'Key watch-outs from Section 14: 1. int(3.9) truncates toward zero to 3; it does not round! 2. int("3.5") fails with a ValueError because int() expects whole digit characters; you must write int(float("3.5")). 3. float("abc") fails with a ValueError. 4. list("Lagos") splits the text into individual characters. 5. bool("False") is True because any non-empty string is truthy!',
        ],
        keyTerms: [
          {
            term: 'Type Casting',
            definition: 'Explicitly converting an object from one data type to another using constructor functions like int(), float(), str().',
          },
          {
            term: 'Truncation',
            definition: 'Discarding the fractional decimal part of a number without rounding (e.g., int(3.99) yields 3).',
          },
          {
            term: 'ValueError',
            definition: 'An exception raised when a function receives an argument of correct type but inappropriate value (e.g., int("abc")).',
          },
        ],
        bulletPoints: [
          'int(3.9) gives 3 (truncates toward zero, does not round).',
          'int("3.5") raises ValueError; use int(float("3.5")) to convert decimal strings.',
          'bool("") is False; bool("False") is True because non-empty strings are always truthy.',
        ],
      },
      visualise: {
        type: 'type-conversion',
        title: 'Python Type Conversion Simulator',
        badge: 'simulation',
        description: 'Explore successful type conversions and examine exact ValueError traceback mechanics.',
        initialConfig: { selectedPresetId: 'p2' },
      },
      code: [
        {
          title: 'Safe Type Conversion and Edge Cases',
          code: `# 1. Float to Int Truncation
pi_val = 3.999
int_pi = int(pi_val)
print(f"int({pi_val}) -> {int_pi} (truncated, not rounded)")

# 2. String Decimal to Integer Two-Step Conversion
decimal_str = "14.75"
# int(decimal_str) would raise ValueError!
safe_int = int(float(decimal_str))
print(f"int(float('{decimal_str}')) -> {safe_int}")

# 3. String to Character List
city = "Kano"
char_list = list(city)
print(f"list('{city}') -> {char_list}")

# 4. String Truthiness Trap
empty_bool = bool("")
word_bool = bool("False")
print(f"bool('')      -> {empty_bool}")
print(f"bool('False') -> {word_bool} (any non-empty string is truthy!)")`,
          runMode: 'real',
          expectedOutput: `int(3.999) -> 3 (truncated, not rounded)
int(float('14.75')) -> 14
list('Kano') -> ['K', 'a', 'n', 'o']
bool('')      -> False
bool('False') -> True (any non-empty string is truthy!)`,
          notes: 'Notice that bool("False") is True! In Python, truthiness checks length > 0 for strings.',
          highlightLines: [3, 9, 14, 18, 19],
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'int_pi = int(pi_val)',
          internalEffect: 'Calls float.__int__() on 3.999; discards fractional portion .999; returns integer 3.',
          outputEffect: 'int(3.999) -> 3',
        },
        {
          step: 2,
          codeLine: 9,
          instruction: 'safe_int = int(float(decimal_str))',
          internalEffect: 'float("14.75") parses decimal string to float 14.75. Then int(14.75) truncates to integer 14.',
          outputEffect: 'int(float(\'14.75\')) -> 14',
        },
        {
          step: 3,
          codeLine: 19,
          instruction: 'word_bool = bool("False")',
          internalEffect: 'Calls str.__bool__() which evaluates len("False") > 0. Length is 5, so returns singleton True.',
          outputEffect: 'bool(\'False\') -> True',
        },
      ],
      apply: {
        contextTitle: 'WAEC Examination Score Parser and Validator',
        scenario: 'A school exam records coordinator reads student test scores entered as strings and safely casts them into integers for GPA calculation.',
        code: `# Exam Score Form Input Processing
score_input_str = "88"
raw_percentage_str = "88.6"

math_score = int(score_input_str)
overall_score = int(float(raw_percentage_str))

total = math_score + overall_score
print(f"Parsed Scores: Math={math_score}, Overall={overall_score}")
print(f"Combined Total: {total} points")`,
        outcome: 'Parsed Scores: Math=88, Overall=88\nCombined Total: 176 points',
        domain: 'school',
      },
      commonMistakes: [
        {
          label: 'Directly Passing Decimal String to int()',
          erroneousCode: `price_str = "45.50"
price_int = int(price_str)`,
          errorMessage: 'ValueError: invalid literal for int() with base 10: \'45.50\'',
          explanation: 'int() cannot parse strings containing decimal points directly. Convert to float first, then int.',
          correctedCode: `price_str = "45.50"
price_int = int(float(price_str))  # Produces 45 cleanly`,
        },
      ],
      practise: [
        {
          id: 'd2-s8-ex1',
          title: 'Fix the Bug: Converting a Decimal String to an Integer',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 15,
          contextScenario: 'Eko Electricity Distribution (EKEDC) Prepaid Bill Parser',
          prompt: 'A utility billing parser crashed in production with ValueError: invalid literal for int() with base 10: "49.99" because it passed a string containing a decimal point directly to int(). Fix the code so it safely parses unit_cost_str to an integer (truncating the kobo fractional amount to 49):',
          starterCode: `unit_cost_str = "49.99"
# This line crashes with ValueError:
naira_units = int(unit_cost_str)

print(f"Units credited: {naira_units}")`,
          solutionCode: `unit_cost_str = "49.99"
# Safely convert via float first:
naira_units = int(float(unit_cost_str))

print(f"Units credited: {naira_units}")`,
          testCases: [
            {
              id: 'tc-d2-bill',
              label: 'Clean Execution with Two-Step Cast',
              setup: '',
              expected: 'Units credited: 49',
              hidden: false,
            },
          ],
          hints: [
            'int() cannot directly parse strings that contain decimal dots.',
            'Wrap unit_cost_str in float() first: float(unit_cost_str).',
            'Then pass that float to int(): int(float(unit_cost_str)).',
          ],
        },
        {
          id: 'd2-s8-ex2',
          title: 'Scenario MCQ: The String Truthiness Trap',
          type: 'scenario-mcq',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Abuja Satellite Ground Station Telemetry Downlink',
          prompt: 'A ground station engineer inspects an authentication response string:\n\nis_authenticated_str = "False"\nstatus = bool(is_authenticated_str)\nprint(status)\n\nWhat prints and why?',
          options: [
            {
              id: 'opt-1',
              text: 'True — because in Python, any non-empty string is truthy regardless of what word it contains. Only bool("") is False.',
              explanation: 'Correct! bool(s) checks whether len(s) > 0. The string "False" has 5 characters, so it is True.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'False — because Python recognizes the English word "False" and converts it to the boolean False.',
              explanation: 'Incorrect. Python does not parse English words inside strings during bool() casting.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'ValueError: cannot convert string to boolean.',
              explanation: 'Incorrect. bool() never raises a ValueError on strings.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'None — because the string is invalid.',
              explanation: 'Incorrect. bool() always returns True or False.',
              isCorrect: false,
            },
          ],
          hints: [
            'bool(x) delegates to bool(len(x)) for sequence types like strings.',
            'The only string that converts to False is the empty string "".',
          ],
        },
      ],
      assess: [],
    },

    // -------------------------------------------------------------
    // SUBTOPIC 9: Essential Built-in Functions
    // -------------------------------------------------------------
    {
      id: 'd2-s9',
      number: 9,
      title: 'Essential Built-in Functions',
      summary: 'Explore Python\'s standard built-in functions including len(), min(), max(), sum(), sorted(), and understand the input() string guarantee.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'The Standard Built-in Toolkit',
        paragraphs: [
          'Python comes pre-packaged with dozens of built-in functions available immediately without requiring any import statements. These functions handle common fundamental operations including measurement, collection mathematics, sorting, and user interaction.',
          'Among the most essential are: len() to measure sequence lengths; min() and max() to find extreme values; sum() to calculate arithmetic totals; and sorted() to produce a brand new ordered list without modifying the source.',
          'Two critical rules from Section 14: 1. input() ALWAYS returns a string, even if the user types numeric digits. Arithmetic on user input always requires explicit type casting. 2. sorted() returns a brand NEW list, unlike list.sort() which sorts in place and returns None.',
        ],
        keyTerms: [
          {
            term: 'Built-in Function',
            definition: 'A function provided directly by Python\'s builtins module that is always accessible in the global scope without importing.',
          },
          {
            term: 'sorted()',
            definition: 'Returns a brand new sorted list from any iterable sequence, leaving the original sequence unchanged.',
          },
          {
            term: 'input() Guarantee',
            definition: 'input() reads terminal text and always returns a string (type str), never an integer or float.',
          },
        ],
        bulletPoints: [
          'len() operates in O(1) constant time on built-in collections by reading the internal ob_size field.',
          'sum() works on numeric collections; do not use sum() to join strings (use str.join()).',
          'sorted() produces a new list; the original collection remains in its original order.',
        ],
      },
      visualise: {
        type: 'builtin-explorer',
        title: 'Built-in Function Explorer',
        badge: 'simulation',
        description: 'Explore 16 standard built-in functions, comparing supplied arguments with returned values and printed output.',
        initialConfig: { selectedName: 'sorted' },
      },
      code: [
        {
          title: 'Using len(), min(), max(), sum(), and sorted()',
          code: `# Student scores dataset
test_scores = [85, 92, 78, 64, 99, 88]

# 1. Measure count of students
total_students = len(test_scores)

# 2. Extreme scores
lowest_score = min(test_scores)
highest_score = max(test_scores)

# 3. Sum and average calculation
score_sum = sum(test_scores)
average_score = score_sum / total_students

# 4. Sorting without mutating original
ranked_scores = sorted(test_scores, reverse=True)

print(f"Total Students: {total_students}")
print(f"Lowest: {lowest_score} | Highest: {highest_score}")
print(f"Sum: {score_sum} | Average: {average_score:.1f}")
print(f"Original Scores: {test_scores} (unchanged!)")
print(f"Ranked Scores:   {ranked_scores}")`,
          runMode: 'real',
          expectedOutput: `Total Students: 6
Lowest: 64 | Highest: 99
Sum: 506 | Average: 84.3
Original Scores: [85, 92, 78, 64, 99, 88] (unchanged!)
Ranked Scores:   [99, 92, 88, 85, 78, 64]`,
          notes: 'Notice that test_scores remained completely unchanged after sorted() was called.',
          highlightLines: [5, 8, 9, 12, 16],
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 5,
          instruction: 'total_students = len(test_scores)',
          internalEffect: 'Reads ob_size attribute of test_scores list. Length is 6; binds to total_students.',
          outputEffect: 'No output on stdout.',
        },
        {
          step: 2,
          codeLine: 12,
          instruction: 'score_sum = sum(test_scores)',
          internalEffect: 'Iterates through the 6 integer objects, adds values sequentially starting from 0, returns integer 506.',
          outputEffect: 'No output on stdout.',
        },
        {
          step: 3,
          codeLine: 16,
          instruction: 'ranked_scores = sorted(test_scores, reverse=True)',
          internalEffect: 'Allocates a brand new list, copies items, applies Timsort in reverse order, and returns the new list.',
          outputEffect: 'No output on stdout.',
        },
      ],
      apply: {
        contextTitle: 'Naira Savings Club Monthly Contribution Tracker',
        scenario: 'An Esusu/Ajo thrift savings group in Ibadan calculates total monthly pool, minimum contribution, and ranked payout order.',
        code: `# Thrift Savings Pool Calculations
contributions = [25000, 50000, 15000, 30000, 45000]

pool_total = sum(contributions)
member_count = len(contributions)
lowest_deposit = min(contributions)
highest_deposit = max(contributions)
payout_roster = sorted(contributions, reverse=True)

print(f"Total Esusu Pool: N{pool_total:,} from {member_count} members")
print(f"Deposit Range: N{lowest_deposit:,} to N{highest_deposit:,}")
print(f"Priority Payout Order: {payout_roster}")`,
        outcome: 'Total Esusu Pool: N165,000 from 5 members\nDeposit Range: N15,000 to N50,000\nPriority Payout Order: [50000, 45000, 30000, 25000, 15000]',
        domain: 'finance',
      },
      commonMistakes: [
        {
          label: 'Forgetting That input() Always Returns a String',
          erroneousCode: `# Simulating user entering 15 and 25
# input() returns strings "15" and "25"
a = "15"
b = "25"
total = a + b
print(total)  # Prints "1525" instead of 40!`,
          errorMessage: 'No error, but string concatenation occurs instead of mathematical addition.',
          explanation: 'input() always returns text. To perform arithmetic, cast the input with int() or float().',
          correctedCode: `a = int("15")  # Explicitly cast to integer
b = int("25")
total = a + b
print(total)  # 40`,
        },
      ],
      practise: [
        {
          id: 'd2-s9-ex1',
          title: 'Write Code: Classroom Grade Summary Calculator',
          type: 'write-code',
          tier: 'standard',
          points: 20,
          contextScenario: 'Federal Government College, Enugu Examination Board',
          prompt: 'Given the list exam_scores = [72, 85, 91, 64, 88], compute and print:\nLine 1: Students: <count>\nLine 2: Range: <lowest> to <highest>\nLine 3: Total: <sum>',
          starterCode: `exam_scores = [72, 85, 91, 64, 88]

# Calculate using len(), min(), max(), sum():

`,
          solutionCode: `exam_scores = [72, 85, 91, 64, 88]

count = len(exam_scores)
lowest = min(exam_scores)
highest = max(exam_scores)
total = sum(exam_scores)

print(f"Students: {count}")
print(f"Range: {lowest} to {highest}")
print(f"Total: {total}")`,
          testCases: [
            {
              id: 'tc-d2-scores',
              label: 'Accurate Grade Statistics Output',
              setup: '',
              expected: 'Students: 5\nRange: 64 to 91\nTotal: 400',
              hidden: false,
            },
          ],
          hints: [
            'Use len(exam_scores) to find student count.',
            'Use min(exam_scores) and max(exam_scores) for the range.',
            'Use sum(exam_scores) for the total.',
          ],
        },
        {
          id: 'd2-s9-ex2',
          title: 'Predict Output: sorted() Non-Mutating Behaviour',
          type: 'predict-output',
          tier: 'standard',
          points: 15,
          contextScenario: 'Sokoto Grain Silo Commodity Dispatch',
          prompt: 'A warehouse manager writes:\n\nbag_weights = [50, 45, 55, 48]\nnew_weights = sorted(bag_weights)\nprint(bag_weights, new_weights)\n\nWhat prints?',
          options: [
            {
              id: 'opt-1',
              text: '[50, 45, 55, 48] [45, 48, 50, 55] — because sorted() returns a brand NEW list, leaving bag_weights unchanged.',
              explanation: 'Correct! Unlike list.sort() which mutates the original in-place, sorted() guarantees non-destructive output.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: '[45, 48, 50, 55] None — because sorting always sorts in place.',
              explanation: 'Incorrect. list.sort() returns None, but sorted() returns the sorted list.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: '[45, 48, 50, 55] [45, 48, 50, 55] — because both lists are sorted.',
              explanation: 'Incorrect. bag_weights is never modified by sorted().',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'TypeError: cannot sort list without reverse parameter.',
              explanation: 'Incorrect. reverse is an optional parameter defaulting to False.',
              isCorrect: false,
            },
          ],
          hints: [
            'Remember Section 14 watch-out: sorted() returns a new list.',
            'The original collection remains in its original order.',
          ],
        },
      ],
      assess: [],
    },

    // -------------------------------------------------------------
    // SUBTOPIC 10: print() versus return
    // -------------------------------------------------------------
    {
      id: 'd2-s10',
      number: 10,
      title: 'print() versus return',
      summary: 'Understand the critical difference between writing characters to the terminal screen (stdout) and passing a value back to the program (return).',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Side Effects vs Value Production: The print() vs return Divide',
        paragraphs: [
          'One of the most universal stumbling blocks for beginning programmers is confusing print() with return. In an interactive shell or educational playground, both appear to produce text on the screen, but their internal mechanisms are polar opposites.',
          'print() is a function that produces a side effect: it converts objects into characters and writes them to the standard output stream (sys.stdout) so human eyes can read them on a monitor. Crucially, print() returns None! If you write x = print(5), the variable x is bound to None, not 5.',
          'return, on the other hand, is a Python keyword used inside functions to hand a data value back to the caller. That returned value can be stored in a variable, passed to another function, or used in mathematical expressions.',
        ],
        keyTerms: [
          {
            term: 'Side Effect',
            definition: 'Any observable change outside a function\'s execution, such as printing to the console, modifying a file, or displaying a screen alert.',
          },
          {
            term: 'Return Value',
            definition: 'The actual data object that a function delivers back to the calling statement upon completion.',
          },
          {
            term: 'sys.stdout',
            definition: 'The system standard output stream where print() writes textual characters.',
          },
        ],
        bulletPoints: [
          'print() writes characters to the console; its return value is always None.',
          'Capturing print() in a variable (val = print("Hi")) always binds val to None.',
          'Built-in functions like len(), min(), and sorted() return objects; they do not print to the console on their own.',
        ],
      },
      visualise: {
        type: 'builtin-explorer',
        title: 'Return Value vs stdout Stream Explorer',
        badge: 'simulation',
        description: 'Toggle between print() and computation functions to see the return value contrasted against stdout.',
        initialConfig: { selectedName: 'print' },
      },
      code: [
        {
          title: 'Proving that print() Returns None',
          code: `# Call print() and capture what it returns
captured_result = print("This text is printed to stdout!")

# Inspect what captured_result actually holds
print("Value of captured_result:", captured_result)
print("Type of captured_result: ", type(captured_result))
print("Is captured_result None? ", captured_result is None)

# Contrast with a function that returns a real value
captured_length = len("Federal Republic of Nigeria")
print("\\nCaptured length value:   ", captured_length)
print("Type of captured length: ", type(captured_length))`,
          runMode: 'real',
          expectedOutput: `This text is printed to stdout!
Value of captured_result: None
Type of captured_result:  <class 'NoneType'>
Is captured_result None?  True

Captured length value:    27
Type of captured length:  <class 'int'>`,
          notes: 'Notice that captured_result is None! print() does not return the string it prints.',
          highlightLines: [2, 5, 10],
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'captured_result = print("This text is printed to stdout!")',
          internalEffect: 'Writes characters to sys.stdout stream. The print function terminates and returns singleton None. Binds captured_result to None.',
          outputEffect: 'This text is printed to stdout!',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: 'print("Value of captured_result:", captured_result)',
          internalEffect: 'Reads captured_result (None), formats as string "None", and writes to stdout.',
          outputEffect: 'Value of captured_result: None',
        },
        {
          step: 3,
          codeLine: 10,
          instruction: 'captured_length = len("Federal Republic of Nigeria")',
          internalEffect: 'len() calculates 27 and returns integer object 27. Binds captured_length to 27.',
          outputEffect: 'No output on stdout until printed.',
        },
      ],
      apply: {
        contextTitle: 'Customer SMS Notification Dispatcher Pipeline',
        scenario: 'A microfinance loan management platform prints a debug log to the terminal console while returning the status confirmation code to the billing pipeline.',
        code: `# Distinguishing Console Logging from Transaction Output
def process_loan_installment(account_id, amount_ngn):
    # Side-effect: logging to system console for admin visibility
    print(f"[AUDIT LOG] Processing N{amount_ngn:,} for account {account_id}...")
    
    # Return value: data handed back to calling system for database storage
    new_balance = 120000 - amount_ngn
    return new_balance

# Calling the function and saving its returned data
remaining_balance = process_loan_installment("ACC-9041", 35000)
print(f"Remaining Customer Balance: N{remaining_balance:,}")`,
        outcome: '[AUDIT LOG] Processing N35,000 for account ACC-9041...\nRemaining Customer Balance: N85,000',
        domain: 'finance',
      },
      commonMistakes: [
        {
          label: 'Saving print() Output into a Calculation Variable',
          erroneousCode: `subtotal = 5000
tax = print(subtotal * 0.075)
total = subtotal + tax`,
          errorMessage: 'TypeError: unsupported operand type(s) for +: \'int\' and \'NoneType\'',
          explanation: 'tax received the return value of print(), which is None! You cannot add None to an integer.',
          correctedCode: `subtotal = 5000
tax = subtotal * 0.075  # Calculate and store the value
print(f"Tax: N{tax}")   # Print separately
total = subtotal + tax   # Clean arithmetic`,
        },
      ],
      practise: [
        {
          id: 'd2-s10-ex1',
          title: 'Fix the Bug: Eliminating the print() NoneType Trap',
          type: 'fix-the-bug',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Makurdi Benue River Fruit Harvest Invoice',
          prompt: 'A cashier wrote the following invoicing program, but it crashed with TypeError: unsupported operand type(s) for +: "int" and "NoneType" because line 2 assigned the return value of print() to tax. Fix the bug so tax holds the computed integer 750, prints the tax, and computes the grand total 10750:',
          starterCode: `subtotal = 10000
# Bug: tax receives None because print() returns None!
tax = print(int(subtotal * 0.075))
grand_total = subtotal + tax

print(f"Grand Total: N{grand_total}")`,
          solutionCode: `subtotal = 10000
tax = int(subtotal * 0.075)
print(tax)
grand_total = subtotal + tax

print(f"Grand Total: N{grand_total}")`,
          testCases: [
            {
              id: 'tc-d2-invoice',
              label: 'Successful Grand Total Calculation',
              setup: '',
              expected: '750\nGrand Total: N10750',
              hidden: false,
            },
          ],
          hints: [
            'Separate the calculation from the print() statement.',
            'Assign the math result to tax first: tax = int(subtotal * 0.075).',
            'Then call print(tax) on its own line.',
          ],
        },
      ],
      assess: [],
    },

    // -------------------------------------------------------------
    // SUBTOPIC 11: Mutable vs Immutable Objects with Shared References
    // -------------------------------------------------------------
    {
      id: 'd2-s11',
      number: 11,
      title: 'Mutable vs Immutable Shared References',
      summary: 'Explore why mutating a shared list through one variable alters what both see, whereas rebinding an integer simply moves a reference arrow.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'The Grand Divide: In-Place Mutation vs Rebinding',
        paragraphs: [
          'Now that you understand that variables are names bound to objects in memory, we can demystify Python\'s most famous behavior: why modifying a shared list affects all variables pointing to it, while modifying an integer never does.',
          'Immutable objects (numbers, strings, tuples, booleans) cannot be changed in place. When you perform an operation like x = x + 1, Python does not change the number in memory—it calculates a new number (x + 1) and moves the reference arrow "x" to point to that new object. Any other variable that was pointing to the old number remains undisturbed.',
          'Mutable objects (lists, dictionaries, sets), by contrast, have internal contents that can be modified in place without changing the object\'s identity or memory address. If variables "a" and "b" both point to the same list object (#obj-101), calling b.append(99) mutates that single list in place. Because "a" is looking at #obj-101, "a" sees the change immediately!',
        ],
        keyTerms: [
          {
            term: 'In-Place Mutation',
            definition: 'Modifying the internal contents of an existing mutable object in memory without creating a new object or changing its memory address.',
          },
          {
            term: 'Immutability Guarantee',
            definition: 'Objects whose state cannot be modified after creation. Operations on immutable objects always produce brand new objects.',
          },
          {
            term: 'Shallow Copy vs Shared Reference',
            definition: 'b = a shares the same reference; b = a.copy() creates a distinct second list object with identical starting elements.',
          },
        ],
        bulletPoints: [
          'Numbers, strings, and tuples can NEVER be changed in place.',
          'Lists, dictionaries, and sets CAN be changed in place using methods like append, extend, or key assignment.',
          'To prevent shared mutation bugs on lists, always create an explicit copy using list.copy() or list(original).',
        ],
      },
      visualise: {
        type: 'memory-binding',
        title: 'Shared List Mutation vs Integer Rebinding',
        badge: 'simulation',
        description: 'Step through shared list mutation where b.append() alters what both a and b see.',
        initialConfig: { scenario: 'shared-list' },
      },
      code: [
        {
          title: 'Comparing Shared List Mutation with Integer Rebinding',
          code: `# Part 1: Immutable Integer Rebinding
x = 100
y = x      # y and x share object 100
x = x + 1  # x is rebound to 101. Does y change?
print(f"Immutable Integers -> x: {x}, y: {y} (y is unchanged!)")

# Part 2: Mutable List In-Place Mutation
list_a = ["Lagos", "Abuja"]
list_b = list_a  # list_b and list_a point to the EXACT SAME list object
list_b.append("Kano")  # Mutates the shared list in place!

print(f"\\nMutable Lists -> list_b: {list_b}")
print(f"Mutable Lists -> list_a: {list_a} (list_a sees Kano too!)")
print(f"Confirm same identity: list_a is list_b -> {list_a is list_b}")`,
          runMode: 'real',
          expectedOutput: `Immutable Integers -> x: 101, y: 100 (y is unchanged!)

Mutable Lists -> list_b: ['Lagos', 'Abuja', 'Kano']
Mutable Lists -> list_a: ['Lagos', 'Abuja', 'Kano'] (list_a sees Kano too!)
Confirm same identity: list_a is list_b -> True`,
          notes: 'Notice how list_a and list_b share the exact same object in heap memory.',
          highlightLines: [4, 10, 14],
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'x = x + 1',
          internalEffect: 'Evaluates 100 + 1 = 101. Rebinds "x" to new object 101. "y" still points to original 100.',
          outputEffect: 'x: 101, y: 100',
        },
        {
          step: 2,
          codeLine: 10,
          instruction: 'list_b.append("Kano")',
          internalEffect: 'Invokes PyList_Append on the shared list object in heap memory. Adds pointer to "Kano" at index 2. No new list is created.',
          outputEffect: 'Shared list modified.',
        },
        {
          step: 3,
          codeLine: 14,
          instruction: 'print(f"Confirm same identity: list_a is list_b -> {list_a is list_b}")',
          internalEffect: 'Compares memory address of list_a and list_b. They are identical, returns True.',
          outputEffect: 'Confirm same identity: list_a is list_b -> True',
        },
      ],
      apply: {
        contextTitle: 'Joint Account Shared Transaction Ledger',
        scenario: 'A married couple in Port Harcourt shares a joint household budget list. When the husband adds a utility expense, the wife\'s ledger updates immediately because both point to the same ledger.',
        code: `# Joint Household Budget Shared List
husband_ledger = ["Groceries: N35,000", "Fuel: N20,000"]
wife_ledger = husband_ledger  # Shared joint reference

# Wife logs an electricity token purchase
wife_ledger.append("Electricity: N15,000")

print("Wife's Ledger entries:   ", len(wife_ledger))
print("Husband's Ledger entries:", len(husband_ledger))
print("Husband sees latest expense:", husband_ledger[-1])`,
        outcome: 'Wife\'s Ledger entries:    3\nHusband\'s Ledger entries: 3\nHusband sees latest expense: Electricity: N15,000',
        domain: 'finance',
      },
      commonMistakes: [
        {
          label: 'Unintentional Aliasing on Function Arguments',
          erroneousCode: `def add_bonus(scores):
    scores.append(10)  # Modifies caller's list directly!

original = [80, 90]
add_bonus(original)
print(original)  # [80, 90, 10]`,
          errorMessage: 'Unintended side effect: the caller\'s original list was mutated in place.',
          explanation: 'Passing a mutable list to a function passes the reference. If you want to leave the caller\'s list untouched, copy it first.',
          correctedCode: `def add_bonus_safe(scores):
    new_scores = scores.copy()  # Create independent copy
    new_scores.append(10)
    return new_scores

original = [80, 90]
result = add_bonus_safe(original)
print("Original:", original)  # [80, 90] (clean!)
print("Result:  ", result)    # [80, 90, 10]`,
        },
      ],
      practise: [
        {
          id: 'd2-s11-ex1',
          title: 'Predict Output: Mutable Modification vs Rebinding',
          type: 'predict-output',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Enugu Urban Transit Route Dispatch Station',
          prompt: 'An engineer executes this script:\n\nroute_a = ["Coal Camp", "New Haven"]\nroute_b = route_a\nroute_b.append("Independence Layout")\nroute_a = ["Ogbete"]\nprint(route_b)\n\nWhat is printed?',
          options: [
            {
              id: 'opt-1',
              text: "['Coal Camp', 'New Haven', 'Independence Layout'] — because line 3 mutated the shared list, and line 4 only rebound route_a to a new list, leaving route_b pointing to the 3-stop list.",
              explanation: 'Correct! Rebinding route_a in line 4 moves route_a\'s pointer to ["Ogbete"]. route_b remains bound to the mutated list.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: "['Ogbete'] — because reassigning route_a overwrites route_b.",
              explanation: 'Incorrect. Reassigning route_a does not affect route_b.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: "['Coal Camp', 'New Haven'] — because line 4 cancelled the append.",
              explanation: 'Incorrect. Python executes sequentially; line 3 mutated the list in place.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: "['Coal Camp', 'New Haven', 'Ogbete'] — because the lists merged.",
              explanation: 'Incorrect. Assignment does not merge lists.',
              isCorrect: false,
            },
          ],
          hints: [
            'Step 1: route_b and route_a both point to the 2-item list.',
            'Step 2: route_b.append(...) mutates that list in place (now 3 items).',
            'Step 3: route_a = ["Ogbete"] only moves route_a\'s pointer.',
          ],
        },
        {
          id: 'd2-s11-ex2',
          title: 'Project Tier: Student Profile Card Program Generator',
          type: 'write-code',
          tier: 'project',
          points: 30,
          contextScenario: 'University Admissions Portal, Zaria, Kaduna State',
          prompt: 'Build the foundational Student Profile Card program specified in Section 14:\n1. Define student_name = "Fatima Aliyu"\n2. Define birth_year_str = "2006"\n3. Define gpa_str = "4.85"\n4. Define state_origin = "Kano"\n5. Define is_admitted = True\n6. Convert birth_year_str to int and compute age for the current academic year 2026 (age = 2026 - birth_year).\n7. Convert gpa_str to float.\n8. Print exactly this 4-line credential card:\nLine 1: ========================================\nLine 2: STUDENT CREDENTIAL: Fatima Aliyu (Kano)\nLine 3: Age: 20 | Admitted: True | CGPA: 4.85\nLine 4: ========================================',
          starterCode: `# Build your Student Profile Card Generator below:
student_name = "Fatima Aliyu"
birth_year_str = "2006"
gpa_str = "4.85"
state_origin = "Kano"
is_admitted = True

`,
          solutionCode: `student_name = "Fatima Aliyu"
birth_year_str = "2006"
gpa_str = "4.85"
state_origin = "Kano"
is_admitted = True

birth_year = int(birth_year_str)
age = 2026 - birth_year
gpa = float(gpa_str)

print("========================================")
print(f"STUDENT CREDENTIAL: {student_name} ({state_origin})")
print(f"Age: {age} | Admitted: {is_admitted} | CGPA: {gpa}")
print("========================================")`,
          testCases: [
            {
              id: 'tc-d2-proj',
              label: 'Verified Formatted Student Credential Card',
              setup: '',
              expected: `========================================\nSTUDENT CREDENTIAL: Fatima Aliyu (Kano)\nAge: 20 | Admitted: True | CGPA: 4.85\n========================================`,
              hidden: false,
            },
          ],
          hints: [
            'Use int(birth_year_str) to convert the year before subtraction: age = 2026 - int(birth_year_str).',
            'Use float(gpa_str) for the CGPA.',
            'Format the output with exact 40 equal signs on Lines 1 and 4.',
          ],
        },
      ],
      assess: [],
    },
  ],

  // ==========================================
  // REAL-WORLD LABS (Section 14 & 13.2)
  // ==========================================
  realWorldLabs: [
    {
      id: 'd2-lab-student-profile',
      title: 'Lab 1: University Student Profile Card Generator',
      description: 'Program a dynamic student profile card using Python variable bindings, type casting from string inputs, and built-in formatting functions.',
      domain: 'school',
      starterCode: `# University Matriculation Student Profile Generator
student_name = "Chiamaka Eze"
matric_number = "UNN/2026/49102"
faculty = "Engineering"
department = "Electrical Engineering"
jamb_score = 312
cgpa = 4.75
is_enrolled = True

print("========================================")
print(f"UNIVERSITY OF NIGERIA, NSUKKA")
print(f"STUDENT: {student_name} [{matric_number}]")
print(f"FACULTY: {faculty} | DEPT: {department}")
print(f"JAMB Score: {jamb_score} | Current CGPA: {cgpa:.2f}")
print(f"Status: Enrolled ({is_enrolled})")
print("========================================")
`,
      targetOutput: `========================================
UNIVERSITY OF NIGERIA, NSUKKA
STUDENT: Chiamaka Eze [UNN/2026/49102]
FACULTY: Engineering | DEPT: Electrical Engineering
JAMB Score: 312 | Current CGPA: 4.75
Status: Enrolled (True)
========================================`,
    },
    {
      id: 'd2-lab-brt-fare',
      title: 'Lab 2: Lagos BRT Smart Card Fare Rebalance & Trip Audit',
      description: 'Calculate commuter smart card deductions across multiple BRT routes (TBS to Ikorodu), computing remaining balance and ride eligibility.',
      domain: 'transport',
      starterCode: `# Lagos State Bus Rapid Transit (BRT) Smart Card Fare Rebalance
card_id = "BRT-LAG-9081"
passenger_name = "Olumide Bakare"
opening_balance_ngn = 5000.00
fare_trip_1 = 850.00   # TBS to Maryland
fare_trip_2 = 1200.00  # Maryland to Ikorodu

# Calculate new balance and trips
total_fare = fare_trip_1 + fare_trip_2
closing_balance = opening_balance_ngn - total_fare
has_minimum_balance = closing_balance >= 500.00

print("------------------------------------------")
print(f"LAGOS BRT SMART CARD: {card_id}")
print(f"Passenger: {passenger_name}")
print(f"Opening Balance: N{opening_balance_ngn:,.2f}")
print(f"Total Trips Deducted: N{total_fare:,.2f}")
print(f"Closing Balance: N{closing_balance:,.2f}")
print(f"Eligible for Next Trip: {has_minimum_balance}")
print("------------------------------------------")
`,
      targetOutput: `------------------------------------------
LAGOS BRT SMART CARD: BRT-LAG-9081
Passenger: Olumide Bakare
Opening Balance: N5,000.00
Total Trips Deducted: N2,050.00
Closing Balance: N2,950.00
Eligible for Next Trip: True
------------------------------------------`,
    },
  ],

  // ==========================================
  // MINI PROJECT (Section 14 & 13.2)
  // ==========================================
  miniProject: {
    id: 'mp-d2-profile-card',
    title: 'Student Profile Card using Input Queue',
    brief: 'Build an interactive Student Profile Card program that takes user details, validates types, calculates age from birth year, and displays an official formatted credential.',
    requirements: [
      'Store student name, birth year, state of origin, and high school GPA in typed variables.',
      'Perform type casting from string input to integer for birth year and float for GPA.',
      'Calculate current age using arithmetic subtraction (2026 - birth_year).',
      'Format output with clear decorative separators, uppercase headers, and boolean enrollment status.',
    ],
    rubric: [
      { criterion: 'Correct variable bindings and naming conventions', weight: 30 },
      { criterion: 'Safe type conversion without ValueError crashes', weight: 30 },
      { criterion: 'Accurate arithmetic and clean formatted output', weight: 40 },
    ],
    starterCode: `# Build your Student Profile Card program below:
first_name = "Fatima"
last_name = "Aliyu"
birth_year_str = "2006"
gpa_str = "4.85"
state = "Kano"
is_active = True

# 1. Cast birth_year_str to int and compute age (current year 2026)
# 2. Cast gpa_str to float
# 3. Print formatted student credential card:
print("========================================")
print(f"STUDENT CREDENTIAL: {first_name} {last_name} ({state})")
print(f"Age: {2026 - int(birth_year_str)} | Admitted: {is_active} | CGPA: {float(gpa_str)}")
print("========================================")
`,
  },

  // ==========================================
  // DAY 2 COMPREHENSIVE QUIZ (10 Questions)
  // ==========================================
  dayQuiz: {
    title: 'Day 2 Checkpoint Assessment: Variables & Built-in Functions',
    passingScorePercentage: 80,
    questions: [
      {
        id: 'd2-q1',
        scenario: 'CPython Memory Heap Inspection, Ikeja Software Hub',
        question: 'When Python executes the statement city = "Abuja", what happens internally in CPython memory?',
        options: [
          {
            id: 'q1-a',
            text: 'CPython allocates an immutable string object in heap memory, and binds the identifier "city" in the namespace dictionary to point to that object\'s memory address.',
            explanation: 'Correct! Variables in Python are pointers in a namespace dictionary pointing to heap objects.',
            isCorrect: true,
          },
          {
            id: 'q1-b',
            text: 'A variable bucket named "city" of fixed size is created on the call stack, and the letters A-B-U-J-A are placed directly inside it.',
            explanation: 'Incorrect. This describes C-style value variables, not Python\'s reference-based object model.',
            isCorrect: false,
          },
          {
            id: 'q1-c',
            text: 'Python creates two duplicate copies of the string in case one is corrupted.',
            explanation: 'Incorrect. Python creates a single object and manages references via reference counting.',
            isCorrect: false,
          },
          {
            id: 'q1-d',
            text: 'The variable name is permanently locked and cannot point to any other object.',
            explanation: 'Incorrect. Variables in Python are mutable bindings by default.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd2-q2',
        scenario: 'Kaduna Grain Silo Sensor Weight Calibration',
        question: 'An agricultural sensor engineer writes:\n\nweight = 100\nbackup_weight = weight\nweight = 250\nprint(backup_weight)\n\nWhat value prints and why?',
        options: [
          {
            id: 'q2-a',
            text: '100 — because integers are immutable. Reassigning weight = 250 rebound the name "weight" to a new integer, leaving "backup_weight" pointing to 100.',
            explanation: 'Correct! Rebinding weight does not mutate the number 100 or alter backup_weight.',
            isCorrect: true,
          },
          {
            id: 'q2-b',
            text: '250 — because backup_weight was linked to weight and mirrors all future updates.',
            explanation: 'Incorrect. Variable assignment binds current references; it does not establish dynamic linkages.',
            isCorrect: false,
          },
          {
            id: 'q2-c',
            text: '350 — because the weights are added together upon reassignment.',
            explanation: 'Incorrect. Reassignment replaces references, it does not accumulate values.',
            isCorrect: false,
          },
          {
            id: 'q2-d',
            text: 'None — because reassigning weight destroys backup_weight.',
            explanation: 'Incorrect. Object 100 remains in memory as long as backup_weight references it.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd2-q3',
        scenario: 'Enugu Urban Transit Route Swapping',
        question: 'Which syntax in Python swaps two variables alpha and beta in a single atomic instruction without declaring an intermediate temporary variable?',
        options: [
          {
            id: 'q3-a',
            text: 'alpha, beta = beta, alpha',
            explanation: 'Correct! Python evaluates the RHS tuple (beta, alpha) first, then unpacks into alpha and beta.',
            isCorrect: true,
          },
          {
            id: 'q3-b',
            text: 'swap(alpha, beta)',
            explanation: 'Incorrect. Python does not have a built-in swap() function.',
            isCorrect: false,
          },
          {
            id: 'q3-c',
            text: 'alpha == beta and beta == alpha',
            explanation: 'Incorrect. == is comparison, not assignment.',
            isCorrect: false,
          },
          {
            id: 'q3-d',
            text: 'alpha <-> beta',
            explanation: 'Incorrect. <-> is not valid Python syntax.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd2-q4',
        scenario: 'Federal Ministry of Education Data Standards Audit',
        question: 'Which of the following identifier names is completely LEGAL according to Python 3 syntax rules?',
        options: [
          {
            id: 'q4-a',
            text: 'student_score_2026',
            explanation: 'Correct! It contains only letters, underscores, and digits, and does not start with a digit or keyword.',
            isCorrect: true,
          },
          {
            id: 'q4-b',
            text: '2026_student_score',
            explanation: 'Incorrect. Identifiers cannot begin with a digit.',
            isCorrect: false,
          },
          {
            id: 'q4-c',
            text: 'student-score',
            explanation: 'Incorrect. Hyphens are interpreted as the minus/subtraction operator.',
            isCorrect: false,
          },
          {
            id: 'q4-d',
            text: 'class',
            explanation: 'Incorrect. "class" is a reserved Python keyword.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd2-q5',
        scenario: 'Benin Bronze Quality Control Data Entry',
        question: 'An apprentice creates an empty collection by writing sample = {}. What is the exact data type of sample?',
        options: [
          {
            id: 'q5-a',
            text: "<class 'dict'> — empty curly braces default to creating a dictionary.",
            explanation: 'Correct! In Python, {} creates an empty dictionary. To create an empty set, you must write set().',
            isCorrect: true,
          },
          {
            id: 'q5-b',
            text: "<class 'set'> — because sets use curly braces.",
            explanation: 'Incorrect. Empty {} always creates a dict for backward compatibility.',
            isCorrect: false,
          },
          {
            id: 'q5-c',
            text: "<class 'list'> — because it is a collection.",
            explanation: 'Incorrect. Lists use square brackets [].',
            isCorrect: false,
          },
          {
            id: 'q5-d',
            text: "<class 'NoneType'> — because it is empty.",
            explanation: 'Incorrect. {} is an instantiated empty dictionary object.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd2-q6',
        scenario: 'Fintech Boolean Logic Verification, Victoria Island',
        question: 'What is the evaluated result of the expression True + True in modern Python, and why?',
        options: [
          {
            id: 'q6-a',
            text: '2 — because in Python, bool is an explicit subclass of int, where True evaluates numerically as 1.',
            explanation: 'Correct! issubclass(bool, int) is True, so 1 + 1 = 2.',
            isCorrect: true,
          },
          {
            id: 'q6-b',
            text: 'True — because logical OR combines booleans.',
            explanation: 'Incorrect. The + operator performs addition, not logical OR.',
            isCorrect: false,
          },
          {
            id: 'q6-c',
            text: 'TypeError — because booleans cannot be added mathematically.',
            explanation: 'Incorrect. Booleans inherit all int arithmetic operations.',
            isCorrect: false,
          },
          {
            id: 'q6-d',
            text: '"TrueTrue" — because Python concatenates them as text.',
            explanation: 'Incorrect. Booleans are not strings.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd2-q7',
        scenario: 'Port Harcourt Fuel Pump Telemetry Decimal Parsing',
        question: 'A programmer attempts to cast a price string: int("3.5"). What happens?',
        options: [
          {
            id: 'q7-a',
            text: 'Python raises ValueError: invalid literal for int() with base 10: "3.5", because int() expects only whole decimal digits in string arguments.',
            explanation: 'Correct! int() cannot directly parse strings with decimal dots. You must use int(float("3.5")).',
            isCorrect: true,
          },
          {
            id: 'q7-b',
            text: 'It returns integer 3 by automatically truncating the decimal.',
            explanation: 'Incorrect. int(3.5) on a float truncates to 3, but int("3.5") on a string raises ValueError.',
            isCorrect: false,
          },
          {
            id: 'q7-c',
            text: 'It returns integer 4 by rounding up.',
            explanation: 'Incorrect. Python never rounds up during integer conversion.',
            isCorrect: false,
          },
          {
            id: 'q7-d',
            text: 'It returns 3.5 without changing type.',
            explanation: 'Incorrect. int() never returns a float.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd2-q8',
        scenario: 'Abuja Civil Service Exam Score Analytics',
        question: 'A teacher writes: scores = [80, 65, 95]; sorted_scores = sorted(scores). Which statement is TRUE?',
        options: [
          {
            id: 'q8-a',
            text: 'sorted_scores is a brand NEW list [65, 80, 95], while scores remains [80, 65, 95] completely unmodified.',
            explanation: 'Correct! sorted() is a pure function that returns a new sorted list without modifying the source.',
            isCorrect: true,
          },
          {
            id: 'q8-b',
            text: 'sorted_scores is None, because sorting always happens in place.',
            explanation: 'Incorrect. list.sort() returns None, but built-in sorted() returns the new list.',
            isCorrect: false,
          },
          {
            id: 'q8-c',
            text: 'Both scores and sorted_scores now point to the same sorted list.',
            explanation: 'Incorrect. sorted() allocates a brand new list in heap memory.',
            isCorrect: false,
          },
          {
            id: 'q8-d',
            text: 'scores is reversed while sorted_scores is sorted.',
            explanation: 'Incorrect. sorted() leaves the original collection untouched.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd2-q9',
        scenario: 'Retail Billing Register, Balogun Market',
        question: 'A cashier script runs: tax = print(1500 * 0.075). What is the value and type of variable tax?',
        options: [
          {
            id: 'q9-a',
            text: 'Value is None, type is <class \'NoneType\'> — because print() produces a console side effect and always returns None.',
            explanation: 'Correct! print() writes text to sys.stdout and its return value is always None.',
            isCorrect: true,
          },
          {
            id: 'q9-b',
            text: 'Value is 112.5, type is <class \'float\'>.',
            explanation: 'Incorrect. print() does NOT return the value it prints.',
            isCorrect: false,
          },
          {
            id: 'q9-c',
            text: 'Value is "112.5", type is <class \'str\'>.',
            explanation: 'Incorrect. print() returns None, not a string.',
            isCorrect: false,
          },
          {
            id: 'q9-d',
            text: 'SyntaxError: print() cannot be used on the right side of an assignment.',
            explanation: 'Incorrect. Any function call can be assigned to a variable; print() simply returns None.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd2-q10',
        scenario: 'Shared Dispatch Roster, Kano Transport Authority',
        question: 'A transport coordinator executes:\n\nroster_a = ["Truck 1", "Truck 2"]\nroster_b = roster_a\nroster_b.append("Truck 3")\nprint(roster_a)\n\nWhat prints and why?',
        options: [
          {
            id: 'q10-a',
            text: "['Truck 1', 'Truck 2', 'Truck 3'] — because lists are mutable, and roster_b = roster_a aliased both variables to the exact same list in heap memory.",
            explanation: 'Correct! Because lists are mutable, modifying the object via roster_b changes what roster_a sees.',
            isCorrect: true,
          },
          {
            id: 'q10-b',
            text: "['Truck 1', 'Truck 2'] — because roster_b was a separate duplicate copy of the list.",
            explanation: 'Incorrect. Assignment (=) copies references, not list objects. To copy, roster_a.copy() is required.',
            isCorrect: false,
          },
          {
            id: 'q10-c',
            text: "['Truck 3'] — because append overwrites previous list elements.",
            explanation: 'Incorrect. append() adds elements to the end of the list.',
            isCorrect: false,
          },
          {
            id: 'q10-d',
            text: 'TypeError: cannot append to aliased variable.',
            explanation: 'Incorrect. Aliased mutable objects can be modified through any reference.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
    ],
  },

  cheatSheet: [
    {
      category: 'Variables & Memory Binding',
      syntax: 'identifier = expression',
      description: 'In Python, variables are named pointer tags bound to objects residing in heap memory, not memory boxes. Assignment evaluates the right-hand expression first, instantiates or references the object, and points the identifier to its memory address (inspectable via id()).',
      example: `# Variables bind names to heap objects
city = "Kano"
print(f"city is bound to '{city}' at memory address {id(city)}")

# Reassigning rebinds the pointer to a new object
city = "Ibadan"
print(f"city rebound to '{city}' at memory address {id(city)}")`,
    },
    {
      category: 'Shared References & Aliasing',
      syntax: 'var_b = var_a',
      description: 'Assigning one variable to another creates a shared reference (alias)—it does not duplicate or clone the underlying object. Both identifiers point to the identical memory address (id(a) == id(b)). For mutable objects like lists, mutating via one reference alters what the other sees.',
      example: `# Shared reference (aliasing)
primary_list = ["Lekki", "Ikoyi"]
secondary_list = primary_list  # Points to SAME list in memory

# Mutating secondary_list affects primary_list:
secondary_list.append("Victoria Island")
print(primary_list)  # ['Lekki', 'Ikoyi', 'Victoria Island']
print(id(primary_list) == id(secondary_list))  # True`,
    },
    {
      category: 'Multiple Assignment & Atomic Swap',
      syntax: 'a, b = b, a  |  x, y, z = 10, 20, 30',
      description: 'Python supports simultaneous multi-variable assignment via tuple packing and unpacking. All right-hand expressions evaluate completely into an ephemeral tuple before any left-hand binding occurs, enabling atomic variable swaps without temporary variables.',
      example: `# Atomic variable swap without temp variable
sender_balance = 25000
receiver_balance = 8500

sender_balance, receiver_balance = receiver_balance, sender_balance
print(f"Sender: ₦{sender_balance:,} | Receiver: ₦{receiver_balance:,}")
# Output: Sender: ₦8,500 | Receiver: ₦25,000`,
    },
    {
      category: 'Identifier Naming Rules & Keywords',
      syntax: 'snake_case_names  |  keyword.iskeyword(name)',
      description: 'Python identifiers must begin with a letter (a-z, A-Z) or underscore (_), followed by letters, digits, or underscores. They are case-sensitive and cannot be any of Python\'s 35 reserved keywords. PEP 8 mandates snake_case for variables and functions.',
      example: `import keyword

# Check identifier validity and keyword reservations
print("class".isidentifier())              # True (valid syntactic structure)
print(keyword.iskeyword("class"))          # True (RESERVED -> invalid variable name!)
print("account_balance".isidentifier())     # True
print(keyword.iskeyword("account_balance")) # False (safe to use!)`,
    },
    {
      category: 'Core Data Types & Mutability',
      syntax: 'int, float, complex, str, bool, list, tuple, set, dict, NoneType',
      description: 'Python has 10 core built-in types. Immutable types (int, float, complex, str, tuple, bool, NoneType) cannot be altered after instantiation—operations return new objects. Mutable types (list, dict, set) can have items added, removed, or modified in place without changing memory id.',
      example: `# Immutable vs Mutable
immutable_str = "Python"
# immutable_str[0] = "J"  # TypeError: 'str' object does not support item assignment

mutable_dict = {"currency": "NGN", "rate": 1500}
mutable_dict["rate"] = 1520  # In-place mutation allowed!
print(mutable_dict)`,
    },
    {
      category: 'Runtime Type Inspection',
      syntax: 'type(obj)  |  isinstance(obj, class_or_tuple)',
      description: 'type(obj) returns the exact runtime class of an object. isinstance(obj, Class) checks if an object is an instance of a class or any subclass. In Python, bool is an explicit subclass of int (issubclass(bool, int) is True), so isinstance(True, int) returns True.',
      example: `matric_no = "ENG/2026/042"
score = 88.5
is_registered = True

print(type(matric_no))                  # <class 'str'>
print(isinstance(score, (int, float)))  # True (matches either type)
print(isinstance(is_registered, int))   # True (bool is subclass of int!)
print(True + True + 5)                  # 7 (1 + 1 + 5)`,
    },
    {
      category: 'Type Casting & Truncation Traps',
      syntax: 'int(x), float(x), str(x), bool(x)',
      description: 'Explicit type casting converts objects across types. Critical rules: 1) int(float_val) truncates towards zero (does NOT round; int(3.9) is 3). 2) int(str_val) requires whole digits; int("3.5") raises ValueError—use int(float("3.5")). 3) bool(str) is False only for empty string \'\'; bool("False") is True!',
      example: `# Truncation vs Two-step string float conversion
print(int(3.99))              # 3 (truncated towards zero, not rounded)

price_str = "1500.75"
# int(price_str)              # ValueError: invalid literal for int()
safe_int = int(float(price_str))
print(f"Converted: ₦{safe_int}") # Converted: ₦1500

# String truthiness trap:
print(bool(""))               # False (empty string)
print(bool("False"))          # True! (non-empty string has truthiness)`,
    },
    {
      category: 'Core Built-in Functions',
      syntax: 'len(), min(), max(), sum(), abs(), round()',
      description: 'Python includes built-in functions available globally without imports. len() returns item count. min() and max() return extremes. sum() sums numerical iterables. round(val, n) uses round-half-to-even (banker\'s rounding).',
      example: `daily_sales = [12500, 34000, 8900, 45200, 18000]

print(f"Days counted: {len(daily_sales)}")      # 5
print(f"Lowest sale: ₦{min(daily_sales):,}")    # ₦8,900
print(f"Highest sale: ₦{max(daily_sales):,}")   # ₦45,200
print(f"Total revenue: ₦{sum(daily_sales):,}")  # ₦118,600
print(f"Average: ₦{round(sum(daily_sales)/len(daily_sales), 2):,}")`,
    },
    {
      category: 'Pure Sorting vs In-Place Mutation',
      syntax: 'sorted(iterable, reverse=False) vs list.sort()',
      description: 'The built-in function sorted() is a pure function that returns a brand new sorted list without modifying the original sequence. In contrast, list.sort() mutates the list in place and returns None. Never assign list = list.sort()!',
      example: `scores = [78, 92, 64, 88]

# Built-in sorted() -> Pure function (returns new list)
ranked = sorted(scores, reverse=True)
print(f"Original scores intact: {scores}")  # [78, 92, 64, 88]
print(f"New sorted list: {ranked}")         # [92, 88, 78, 64]

# In-place sort method -> returns None
scores.sort()
print(f"Original now mutated: {scores}")    # [64, 78, 88, 92]`,
    },
    {
      category: 'print() vs Return Value (stdout vs None)',
      syntax: 'print(*values, sep=\' \', end=\'\\n\') -> None',
      description: 'print() is designed specifically for side effects: it formats and transmits text to sys.stdout. It does NOT return the printed value; its return value is always None. Storing result = print("Text") binds result to None.',
      example: `# print() has a console side-effect and returns None
val = print("Calculating interest rate...")  # Prints to terminal
print(f"Captured return value: {val}")       # Captured return value: None
print(f"Type of return value: {type(val)}")  # <class 'NoneType'>

# Correct pattern: store the computation, then print
interest = 150000 * 0.12
print(f"Calculated interest: ₦{interest:,.2f}")`,
    },
    {
      category: 'Interactive User Input & Type Coercion',
      syntax: 'input(prompt) -> always returns str',
      description: 'The built-in input(prompt) pauses execution, prints the prompt string, and reads user input from standard input strictly as a string (str), even if digits were typed. To use input in math or calculations, explicitly cast it with int() or float().',
      example: `# In interactive REPL:
# raw_input = input("Enter top-up amount (₦): ")  # E.g. user enters "5000"
raw_amount = "5000"  # Simulating input() return value
print(f"Type from input(): {type(raw_amount)}")   # <class 'str'>

# Must cast before mathematical operations:
top_up = int(raw_amount)
new_balance = 12500 + top_up
print(f"Updated Wallet: ₦{new_balance:,}")`,
    },
  ],

  sourceNotes: [
    'Derived from Asabeneh Yetayeh\'s 30 Days of Python Day 2 curriculum with modern Python 3.12 visual enhancements.',
    'Section 14 Watch-out: input() always returns a string; type casting to int or float is required for calculation.',
    'Section 14 Watch-out: bool is an explicit subclass of int in Python (issubclass(bool, int) is True).',
    'Section 14 Watch-out: int(3.9) truncates to 3, while int("3.5") raises ValueError because direct decimal string conversion is disallowed.',
    'Section 14 Watch-out: sorted() returns a brand new list without modifying the original iterable.',
  ],
};
