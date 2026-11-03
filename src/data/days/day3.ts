/**
 * Day 3 Module: Operators
 * Master Specification Section 14 (Day 3 Build Brief), Section 13.2 (Part A), Section 10.2
 * Source attribution: Asabeneh Yetayeh's "30 Days of Python"
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_3_MODULE: DayModule = {
  schemaVersion: 1,
  number: 3,
  title: 'Operators',
  level: 'beginner',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/blob/master/03_Day_Operators/03_operators.md',
  estimatedMinutes: 60,
  prerequisites: [1, 2],
  objectives: [
    'Master Boolean literals (True, False), comparison evaluation, and truthy vs falsy object casting.',
    'Execute all 7 arithmetic operators (+, -, *, /, //, %, **) and understand why / always yields a float.',
    'Differentiate floor division (//) rounding towards negative infinity from truncation, and master modulus (%) remainder algebra.',
    'Calculate powers using ** and navigate right-to-left associativity in exponentiation.',
    'Use comparison operators (==, !=, <, >, <=, >=), chained comparisons, and string lexicographical ordering.',
    'Apply logical operators (and, or, not) using formal truth tables and construct compound conditional expressions.',
    'Analyze short-circuit evaluation mechanics and harness non-boolean return value idioms for default values.',
    'Distinguish memory object identity (is) from value equality (==) and apply PEP 8 singleton checks for None.',
    'Implement practical geometry, physics, and financial formulas adhering to Python operator precedence (PEMDAS).',
  ],
  subtopics: [
    // ==========================================
    // Subtopic 1: Boolean Values & Truthiness
    // ==========================================
    {
      id: 'day3-sub1',
      number: 1,
      title: 'Boolean Values & Truthiness',
      summary: 'Understand Python\'s boolean primitives (True, False), comparison evaluation, and truthy versus falsy object casting.',
      estimatedMinutes: 6,
      introduce: {
        headline: 'Truth Values: The Binary Bedrock of Computation',
        paragraphs: [
          'In computer science and Python programming, every decision path ultimately branches on a truth value. Python represents boolean logic with the built-in type bool, which contains exactly two immutable singleton values: True and False (both capitalized keywords).',
          'Whenever you compare numbers, inspect string contents, or check collection sizes, Python generates a boolean object. Furthermore, every single Python object possesses an inherent "truthiness"—it evaluates to either True or False when converted via bool() or tested inside conditional control structures.',
          'In Python, the following objects are inherently falsy: False, None, numeric zero of any type (0, 0.0, 0j), empty sequences and collections ("", (), [], {}, set(), range(0)). Virtually all other objects—including any non-empty string like "False" or "0", and non-empty collections like [0]—are truthy.',
        ],
        keyTerms: [
          { term: 'bool', definition: 'The built-in Python type for boolean truth values (True or False), which is an explicit subclass of int.' },
          { term: 'Truthiness', definition: 'The inherent boolean evaluation of an object when cast with bool() or used in conditional logic.' },
          { term: 'Falsy', definition: 'An object that evaluates to False in boolean context (e.g. 0, None, empty string, empty collection).' },
        ],
      },
      visualise: {
        type: 'truth-table',
        title: 'Boolean Truth Matrix & Evaluation',
        badge: 'simulation',
        description: 'Toggle operand states to inspect live boolean logic outputs across and, or, not, and truth tables.',
        initialConfig: { valA: true, valB: false },
      },
      code: [
        {
          title: 'Inspecting Booleans and Truthiness',
          code: `# Boolean literals and type inspection
is_active = True
has_overdraft = False

print(f"is_active: {is_active} -> {type(is_active)}")
print(f"has_overdraft: {has_overdraft} -> {type(has_overdraft)}")

# Inherited integer nature (issubclass(bool, int) is True)
print(f"True as int: {int(True)}, False as int: {int(False)}")
print(f"True + True + 5 = {True + True + 5}")

# Falsy objects evaluation
print(f"bool(0): {bool(0)}")
print(f"bool(''): {bool('')}")
print(f"bool([]): {bool([])}")
print(f"bool(None): {bool(None)}")

# Non-empty strings and collections are truthy!
print(f"bool('False'): {bool('False')}")  # Non-empty string is True!
print(f"bool([0]): {bool([0])}")          # Non-empty list is True!`,
          runMode: 'real',
          expectedOutput: `is_active: True -> <class 'bool'>
has_overdraft: False -> <class 'bool'>
True as int: 1, False as int: 0
True + True + 5 = 7
bool(0): False
bool(''): False
bool([]): False
bool(None): False
bool('False'): True
bool([0]): True`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'is_active = True',
          internalEffect: 'CPython assigns the name is_active to the global singleton True object of type bool.',
        },
        {
          step: 2,
          codeLine: 10,
          instruction: 'True + True + 5',
          internalEffect: 'Because bool inherits from int, True evaluates numerically as 1, yielding 1 + 1 + 5 = 7.',
        },
        {
          step: 3,
          codeLine: 19,
          instruction: "bool('False')",
          internalEffect: 'CPython checks if the string length len() is non-zero. Since length is 5, it evaluates to True regardless of text contents.',
        },
      ],
      apply: {
        contextTitle: 'Fintech Micro-Loan Credit Scoring, Marina Lagos',
        scenario: 'Verify customer account qualification by testing truthiness of bank verification number (BVN) and credit history flag.',
        domain: 'finance',
        code: `customer_name = "Ngozi Okafor"
bvn_registered = "22198472910"  # Non-empty string -> Truthy
overdue_loans = 0               # Zero integer -> Falsy
has_collateral = False

# Evaluate qualification booleans
is_identity_verified = bool(bvn_registered)
is_clean_credit = not bool(overdue_loans)

is_eligible = is_identity_verified and is_clean_credit
print(f"Applicant: {customer_name}")
print(f"Identity Verified: {is_identity_verified}")
print(f"Clean Credit Record: {is_clean_credit}")
print(f"Loan Approval Status: {'APPROVED' if is_eligible else 'REJECTED'}")`,
        outcome: `Applicant: Ngozi Okafor
Identity Verified: True
Clean Credit Record: True
Loan Approval Status: APPROVED`,
      },
      commonMistakes: [
        {
          label: 'Using lowercase true or false',
          erroneousCode: `is_verified = true  # Lowercase`,
          errorMessage: "NameError: name 'true' is not defined. Did you mean: 'True'?",
          explanation: 'In Python, Boolean literals must be capitalized (True and False). Lowercase true is treated as an undefined variable name.',
          correctedCode: `is_verified = True  # Capitalised`,
        },
        {
          label: 'Assuming string "False" evaluates to False',
          erroneousCode: `user_opt_in = "False"
if bool(user_opt_in):
    print("User opted in!")  # Prints incorrectly!`,
          errorMessage: 'Logic Bug: bool("False") evaluates to True because the string is non-empty.',
          explanation: 'bool() on any non-empty string always returns True. To check for string equality, use user_opt_in == "True".',
          correctedCode: `user_opt_in = "False"
is_opted_in = user_opt_in == "True"  # Evaluates to False`,
        },
      ],
      practise: [
        {
          id: 'd3-s1-ex1',
          title: 'Truthy vs Falsy Evaluation in Admission Queue',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Federal University of Technology Minna (FUTMINNA) admissions portal',
          prompt: 'Which of the following expressions evaluates to False in Python?',
          options: [
            {
              id: 'opt-1',
              text: 'bool("False")',
              explanation: 'Incorrect. "False" is a non-empty string of length 5, so bool() evaluates to True.',
              isCorrect: false,
            },
            {
              id: 'opt-2',
              text: 'bool([0])',
              explanation: 'Incorrect. [0] is a non-empty list containing one element, so bool() evaluates to True.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'bool(0.0)',
              explanation: 'Correct! Numeric zero of any type (0, 0.0, 0j) is inherently falsy in Python.',
              isCorrect: true,
            },
            {
              id: 'opt-4',
              text: 'bool(" ")',
              explanation: 'Incorrect. A single space string has a length of 1 and is non-empty, evaluating to True.',
              isCorrect: false,
            },
          ],
          hints: [
            'Recall that non-empty sequences (strings, lists) always evaluate to True regardless of their text or numbers.',
            'Look for the numerical zero representation among the choices.',
            '0.0 is a floating-point zero, which evaluates to False.',
          ],
        },
        {
          id: 'd3-s1-ex2',
          title: 'CPython Subclassing: bool is an int',
          type: 'theory-reasoning',
          tier: 'standard',
          points: 15,
          contextScenario: 'CPython Core Object Hierarchy Seminar at University of Ibadan',
          prompt: 'Explain why issubclass(bool, int) returns True in Python, and describe the mathematical implications when evaluating expressions like True + True + 10.',
          modelAnswer: 'In Python, the bool type was implemented as an explicit subclass of int for backward compatibility with older code where integers 1 and 0 were used for truth values. The singletons True and False behave numerically as 1 and 0 in mathematical operations. Therefore, True + True + 10 evaluates as 1 + 1 + 10 = 12.',
          markingCriteria: [
            { id: 'crit-1', label: 'Mentions that bool inherits from int and True/False correspond to 1/0', points: 5 },
            { id: 'crit-2', label: 'Explains numerical arithmetic behavior (e.g. True + True + 10 = 12)', points: 5 },
            { id: 'crit-3', label: 'Identifies backward compatibility with pre-bool Python as the architectural rationale', points: 5 },
          ],
          hints: [
            'Think about how Python 2 and early Python handled booleans before True and False were keywords.',
            'What integer values do True and False convert to when passed into int()?',
            'Demonstrate how arithmetic operators treat boolean operands as integers.',
          ],
        },
      ],
      assess: [],
    },

    // ==========================================
    // Subtopic 2: Arithmetic Operators & Standard Division
    // ==========================================
    {
      id: 'day3-sub2',
      number: 2,
      title: 'Arithmetic Operators & Standard Division',
      summary: 'Master addition, subtraction, multiplication, and understand why standard division (/) always returns a float.',
      estimatedMinutes: 6,
      introduce: {
        headline: 'Fundamental Arithmetic & The Float Division Guarantee',
        paragraphs: [
          'Python provides standard mathematical operators for numerical computation: addition (+), subtraction (-), multiplication (*), and standard division (/). These operators behave predictably across both integer and floating-point operands.',
          'One of the most consequential architectural changes introduced in Python 3 is the behavior of the forward-slash division operator (/). In Python 2, dividing two integers performed integer truncation (e.g. 5 / 2 resulted in 2). In Python 3+, / is guaranteed to perform true floating-point division.',
          'Even if the numerator divides evenly into the denominator (such as 8 / 4 or 100 / 10), Python 3 always returns a float (2.0 and 10.0 respectively). If an operation mixes an int with a float (e.g. 10 + 2.5), Python implicitly coerces the result to a float.',
        ],
        keyTerms: [
          { term: 'Float Division (/)', definition: 'Standard division in Python 3+ that always produces a floating-point result, even for evenly divisible numbers.' },
          { term: 'Type Coercion', definition: 'The automatic conversion of a numeric operand to a higher precision type (e.g. int to float during mixed arithmetic).' },
          { term: 'ZeroDivisionError', definition: 'The fatal runtime exception raised when attempting to divide any number by zero.' },
        ],
      },
      visualise: {
        type: 'arithmetic-lab',
        title: 'Arithmetic & Division Operations Visualiser',
        badge: 'simulation',
        description: 'Explore live addition, subtraction, multiplication, and floating-point division across customizable operands.',
        initialConfig: { valA: 17, valB: 5 },
      },
      code: [
        {
          title: 'Basic Arithmetic and Float Division Behavior',
          code: `# Standard Arithmetic Operators
opening_balance = 50000
deposit = 15000
withdrawal = 8200

# Addition and Subtraction
current_balance = opening_balance + deposit - withdrawal
print(f"Current Balance: ₦{current_balance:,}")

# Multiplication
unit_price = 1200
quantity = 4
subtotal = unit_price * quantity
print(f"Subtotal: ₦{subtotal:,}")

# True Float Division (/) ALWAYS returns float
print(f"17 / 5 = {17 / 5} (type: {type(17 / 5).__name__})")
print(f"8 / 4 = {8 / 4} (type: {type(8 / 4).__name__})")
print(f"100 / 10 = {100 / 10} (type: {type(100 / 10).__name__})")

# Mixed int and float arithmetic
total_with_tax = subtotal * 1.075  # 7.5% VAT
print(f"Total with VAT: ₦{total_with_tax:,.2f} (type: {type(total_with_tax).__name__})")`,
          runMode: 'real',
          expectedOutput: `Current Balance: ₦56,800
Subtotal: ₦4,800
17 / 5 = 3.4 (type: float)
8 / 4 = 2.0 (type: float)
100 / 10 = 10.0 (type: float)
Total with VAT: ₦5,160.00 (type: float)`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 7,
          instruction: 'current_balance = opening_balance + deposit - withdrawal',
          internalEffect: 'Evaluates addition and subtraction from left to right, storing integer 56800.',
        },
        {
          step: 2,
          codeLine: 17,
          instruction: 'print(f"8 / 4 = {8 / 4}")',
          internalEffect: 'Invokes PyNumber_TrueDivide. Even though 8 is evenly divisible by 4, it allocates and returns float 2.0.',
        },
        {
          step: 3,
          codeLine: 22,
          instruction: 'total_with_tax = subtotal * 1.075',
          internalEffect: 'Coerces int subtotal to float before multiplying, returning float 5160.0.',
        },
      ],
      apply: {
        contextTitle: 'Lekki Supermarket POS Checkout Register',
        scenario: 'Calculate invoice subtotal, apply a 10% promotional discount, and compute per-item split among roommates.',
        domain: 'ecommerce',
        code: `cart_items_cost = 45000
discount_rate = 0.10  # 10% discount
num_roommates = 3

discount_amount = cart_items_cost * discount_rate
payable_amount = cart_items_cost - discount_amount
per_person_split = payable_amount / num_roommates

print(f"Original Cart: ₦{cart_items_cost:,.2f}")
print(f"Discount (10%): -₦{discount_amount:,.2f}")
print(f"Payable Amount: ₦{payable_amount:,.2f}")
print(f"Split among {num_roommates} people: ₦{per_person_split:,.2f} each")`,
        outcome: `Original Cart: ₦45,000.00
Discount (10%): -₦4,500.00
Payable Amount: ₦40,500.00
Split among 3 people: ₦13,500.00 each`,
      },
      commonMistakes: [
        {
          label: 'Division by zero',
          erroneousCode: `average_score = total_score / student_count  # when student_count == 0`,
          errorMessage: 'ZeroDivisionError: division by zero',
          explanation: 'Dividing any number by 0 raises an unhandled ZeroDivisionError. Always validate denominator != 0 before division.',
          correctedCode: `if student_count > 0:
    average_score = total_score / student_count
else:
    average_score = 0.0`,
        },
        {
          label: 'Mixing strings with numbers in addition',
          erroneousCode: `total = "₦" + 5000  # Attempting to add number to string`,
          errorMessage: 'TypeError: can only concatenate str (not "int") to str',
          explanation: 'Python is strongly typed and will not implicitly coerce integers into strings during addition. Use f-strings or str().',
          correctedCode: `total = f"₦{5000}"  # Or "₦" + str(5000)`,
        },
      ],
      practise: [
        {
          id: 'd3-s2-ex1',
          title: 'Floating-Point Division Guarantee',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Victoria Island Restaurant Bill Split',
          prompt: 'What is the output of the following Python code snippet?\n\ntotal = 5000\nguests = 2\nshare = total / guests\nprint(type(share), share)',
          options: [
            {
              id: 'opt-1',
              text: "<class 'float'> 2500.0",
              explanation: 'Correct! In Python 3, the standard division operator (/) always returns a float object, even when the division is exact.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: "<class 'int'> 2500",
              explanation: 'Incorrect. Standard division in Python 3 never returns an int.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: "<class 'float'> 2500",
              explanation: 'Incorrect. Floating point numbers in Python are printed with a decimal point (2500.0).',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'TypeError: unsupported operand types for /',
              explanation: 'Incorrect. Both total and guests are integers, which support division.',
              isCorrect: false,
            },
          ],
          hints: [
            'Remember Python 3\'s rule for the single forward slash (/) operator.',
            'Standard division always produces a floating-point result, never an integer.',
            'Floats print with at least one fractional digit (e.g. .0).',
          ],
        },
        {
          id: 'd3-s2-ex2',
          title: 'Fix Airtime Top-Up Balance Calculation Bug',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 15,
          contextScenario: 'MTN Airtime and Data Bundle Recharge Service, Lagos',
          prompt: 'A customer care script attempts to add a promotional bonus string "1500" to an existing wallet balance of 3000, triggering a TypeError. Fix the bug to cast the bonus appropriately and print the updated balance: "Updated Balance: ₦4500".',
          starterCode: `# Current balance and bonus
balance = 3000
bonus_str = "1500"

# Fix the bug below to safely calculate total balance
total_balance = balance + bonus_str
print(f"Updated Balance: ₦{total_balance}")`,
          solutionCode: `# Current balance and bonus
balance = 3000
bonus_str = "1500"

# Fix the bug below to safely calculate total balance
total_balance = balance + int(bonus_str)
print(f"Updated Balance: ₦{total_balance}")`,
          hints: [
            'Notice that bonus_str is of type str, while balance is an int.',
            'Python does not automatically convert strings to numbers during addition.',
            'Use int(bonus_str) to convert the string literal into an integer before adding.',
          ],
        },
      ],
      assess: [],
    },

    // ==========================================
    // Subtopic 3: Floor Division & Modulus Operations
    // ==========================================
    {
      id: 'day3-sub3',
      number: 3,
      title: 'Floor Division & Modulus Operations',
      summary: 'Dissect integer floor division (//) rounding towards negative infinity, and modulus (%) remainder mathematics.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Floor Division & The Formal Python Modulus Law',
        paragraphs: [
          'When working with discrete units—such as allocating full passenger seats, packaging physical goods into crates, or calculating elapsed hours—standard floating-point division is insufficient. Python provides two companion operators: floor division (//) and modulus (%).',
          'Floor division (//) divides two numbers and rounds down to the nearest integer. Crucially, Python rounds towards negative infinity (-∞), NOT towards zero. For positive numbers, 17 // 5 gives 3. But for negative numbers, -7 // 2 gives -4 (because -3.5 rounded down towards -∞ is -4, not -3!). This differs fundamentally from language families like C, Java, or JavaScript.',
          'Modulus (%) computes the remainder. In Python, modulus is mathematically bound to floor division by the identity: r = a - (a // b) * b. Because floor division rounds down, the sign of (a % b) always matches the sign of the divisor b. Modulus is widely used for parity checks (x % 2 == 0) and clock cycle wrap-arounds.',
        ],
        keyTerms: [
          { term: 'Floor Division (//)', definition: 'Division operator that rounds the quotient down to the nearest integer towards negative infinity.' },
          { term: 'Modulus (%)', definition: 'Operator computing the remainder of division, adhering strictly to r = a - (a // b) * b.' },
          { term: 'Negative Rounding', definition: 'The architectural behavior where negative quotients round further negative (e.g. -7 // 2 == -4).' },
        ],
      },
      visualise: {
        type: 'arithmetic-lab',
        title: 'Floor Division & Modulus Architecture',
        badge: 'simulation',
        description: 'Inspect floor division number lines and watch how negative quotients round towards negative infinity.',
        initialConfig: { valA: -7, valB: 2 },
      },
      code: [
        {
          title: 'Comparing / vs // and Computing Modulus',
          code: `# Positive numbers comparison
print("--- POSITIVE OPERANDS (17, 5) ---")
print(f"Float division (17 / 5):  {17 / 5}")
print(f"Floor division (17 // 5): {17 // 5}")
print(f"Modulus remainder (17 % 5): {17 % 5}")

# Mathematical proof: a == (a // b) * b + (a % b)
a, b = 17, 5
print(f"Verification: {b} * ({a // b}) + ({a % b}) == {b * (a // b) + (a % b)}")

# CRITICAL PYTHON NUANCE: Negative floor division
print("\\n--- NEGATIVE OPERANDS (-7, 2) ---")
print(f"Float division (-7 / 2):  {-7 / 2}")     # -3.5
print(f"Floor division (-7 // 2): {-7 // 2}")    # -4 (rounds towards -∞!)
print(f"Modulus remainder (-7 % 2): {-7 % 2}")   # 1

# Clock wraparound calculation (24-hour cycle)
current_hour = 22
hours_elapsed = 7
alarm_hour = (current_hour + hours_elapsed) % 24
print(f"\\nCurrent: {current_hour}:00 + {hours_elapsed}h -> Alarm: {alarm_hour}:00")`,
          runMode: 'real',
          expectedOutput: `--- POSITIVE OPERANDS (17, 5) ---
Float division (17 / 5):  3.4
Floor division (17 // 5): 3
Modulus remainder (17 % 5): 2
Verification: 5 * (3) + (2) == 17

--- NEGATIVE OPERANDS (-7, 2) ---
Float division (-7 / 2):  -3.5
Floor division (-7 // 2): -4
Modulus remainder (-7 % 2): 1

Current: 22:00 + 7h -> Alarm: 5:00`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: '17 // 5',
          internalEffect: 'Calculates 17 / 5 = 3.4. Rounds down towards -∞ to the integer 3.',
        },
        {
          step: 2,
          codeLine: 14,
          instruction: '-7 // 2',
          internalEffect: 'Calculates -7 / 2 = -3.5. Rounds down towards -∞, producing -4 (not -3!).',
        },
        {
          step: 3,
          codeLine: 15,
          instruction: '-7 % 2',
          internalEffect: 'Evaluates formula: r = -7 - (-7 // 2) * 2 = -7 - (-4 * 2) = -7 - (-8) = 1.',
        },
      ],
      apply: {
        contextTitle: 'Dangote Cement Distribution Warehouse, Sagamu',
        scenario: 'Calculate how many full 50-bag shipping pallets can be loaded into an articulated haulage lorry and the loose bags remaining.',
        domain: 'transport',
        code: `total_bags_ordered = 1845
bags_per_pallet = 50

# Calculate whole pallets loaded and remainder
full_pallets = total_bags_ordered // bags_per_pallet
loose_bags_remaining = total_bags_ordered % bags_per_pallet

print(f"Total Bags Ordered: {total_bags_ordered}")
print(f"Full Pallets Prepared: {full_pallets} pallets ({full_pallets * bags_per_pallet} bags)")
print(f"Loose Bags Remaining for Manual Stacking: {loose_bags_remaining} bags")`,
        outcome: `Total Bags Ordered: 1845
Full Pallets Prepared: 36 pallets (1800 bags)
Loose Bags Remaining for Manual Stacking: 45 bags`,
      },
      commonMistakes: [
        {
          label: 'Assuming // truncates towards zero on negative numbers',
          erroneousCode: `offset = -7 // 2  # Expecting -3`,
          errorMessage: 'Semantic Bug: offset evaluates to -4, not -3.',
          explanation: 'In Python, floor division always rounds towards negative infinity. If you need truncation towards zero, use int(-7 / 2).',
          correctedCode: `offset = int(-7 / 2)  # Returns -3 (truncates towards zero)`,
        },
        {
          label: 'Modulus with zero divisor',
          erroneousCode: `parity = x % 0`,
          errorMessage: 'ZeroDivisionError: integer modulo by zero',
          explanation: 'Just like standard division, modulo by zero is mathematically undefined and raises ZeroDivisionError.',
          correctedCode: `if divisor != 0:
    remainder = x % divisor`,
        },
      ],
      practise: [
        {
          id: 'd3-s3-ex1',
          title: 'Euler Floor Division & Modulus with Negative Numbers',
          type: 'predict-output',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Subsea Petroleum Valve Reverse Angle Calibration, Niger Delta',
          prompt: 'What exact numbers are printed by Python when running the following line?\n\nprint(-7 // 2, -7 % 2)',
          options: [
            {
              id: 'opt-1',
              text: '-4 1',
              explanation: 'Correct! -7 / 2 = -3.5. Floor division rounds down towards negative infinity to -4. Then by Python modulus law r = a - (a // b) * b: r = -7 - (-4 * 2) = -7 - (-8) = 1.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: '-3 -1',
              explanation: 'Incorrect. This is C-style truncation towards zero, not Python floor division.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: '-3 1',
              explanation: 'Incorrect. -7 // 2 yields -4, not -3.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: '-4 -1',
              explanation: 'Incorrect. Modulus with a positive divisor b=2 always produces a positive remainder r in [0, b-1].',
              isCorrect: false,
            },
          ],
          hints: [
            'Floor division // always rounds down towards negative infinity (the number line to the left).',
            'Between -3 and -4, which number is more negative?',
            'Use the formal modulus invariant: a = (a // b) * b + (a % b).',
          ],
        },
        {
          id: 'd3-s3-ex2',
          title: '12-Hour Shift Clock Arithmetic',
          type: 'order-the-lines',
          tier: 'standard',
          points: 15,
          contextScenario: 'Lagos Emergency Medical Services 12-Hour Shift Roster',
          prompt: 'Reorder the lines of code to compute the resulting clock hour after adding 14 hours to a 9:00 AM shift start time using modulo arithmetic.',
          jumbledLines: [
            { id: 'line-1', code: 'start_hour = 9', indent: 0 },
            { id: 'line-2', code: 'shift_duration = 14', indent: 0 },
            { id: 'line-3', code: 'raw_hour = (start_hour + shift_duration) % 12', indent: 0 },
            { id: 'line-4', code: 'final_hour = 12 if raw_hour == 0 else raw_hour', indent: 0 },
            { id: 'line-5', code: 'print(f"Shift handover at: {final_hour}:00")', indent: 0 },
          ],
          correctLineOrder: ['line-1', 'line-2', 'line-3', 'line-4', 'line-5'],
          hints: [
            'Initialize start_hour and shift_duration first.',
            'Compute raw_hour using addition inside parentheses, then apply modulo 12.',
            'Handle the 12-o\'clock edge case where 0 % 12 represents 12, then print the result.',
          ],
        },
      ],
      assess: [],
    },

    // ==========================================
    // Subtopic 4: Exponentiation & Power Calculations
    // ==========================================
    {
      id: 'day3-sub4',
      number: 4,
      title: 'Exponentiation & Power Calculations',
      summary: 'Calculate powers using ** and master right-to-left associativity in nested power expressions.',
      estimatedMinutes: 6,
      introduce: {
        headline: 'Exponentiation: Powering Through Python Calculations',
        paragraphs: [
          'Python uses the double-asterisk operator (**) for exponentiation. Writing base ** exponent raises the base to the specified power (for example, 2 ** 8 evaluates to 256).',
          'Exponentiation supports all numerical types: integers, negative powers (which automatically return floats, e.g. 2 ** -2 evaluates to 0.25), and fractional powers. A fractional power allows you to calculate roots directly without importing the math module: 16 ** 0.5 computes the square root of 16 (4.0), and 27 ** (1/3) computes the cube root of 27 (3.0).',
          'Crucially, exponentiation has two unique properties: 1) It has higher precedence than multiplication, division, addition, and subtraction. 2) Unlike almost all other Python operators which evaluate left-to-right, exponentiation is right-associative! The expression 2 ** 3 ** 2 is parsed from right to left as 2 ** (3 ** 2) = 2 ** 9 = 512, NOT as (2 ** 3) ** 2 = 64.',
        ],
        keyTerms: [
          { term: 'Exponentiation (**)', definition: 'The power operator raising a base number to an exponent (e.g. 3 ** 2 == 9).' },
          { term: 'Right-Associativity', definition: 'The grouping rule where nested operators evaluate from right to left (e.g. a ** b ** c == a ** (b ** c)).' },
          { term: 'Fractional Exponent', definition: 'Using decimal powers to compute roots (e.g. x ** 0.5 for square root).' },
        ],
      },
      visualise: {
        type: 'expression-tree',
        title: 'Exponentiation & Right-Associativity Stepper',
        badge: 'simulation',
        description: 'Explore right-to-left evaluation order and compare 2 ** 3 ** 2 against (2 ** 3) ** 2 step-by-step.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Power Calculations and Right-Associativity',
          code: `# Basic power calculations
print(f"2 ** 3 = {2 ** 3}")        # 8
print(f"5 ** 4 = {5 ** 4}")        # 625
print(f"10 ** 6 = {10 ** 6:,}")    # 1,000,000

# Negative exponents return floats
print(f"2 ** -1 = {2 ** -1}")      # 0.5
print(f"2 ** -3 = {2 ** -3}")      # 0.125

# Fractional exponents compute roots
print(f"64 ** 0.5 (square root): {64 ** 0.5}")      # 8.0
print(f"27 ** (1/3) (cube root): {27 ** (1/3):.1f}") # 3.0

# RIGHT-ASSOCIATIVITY DEMONSTRATION
# 2 ** 3 ** 2 evaluates as 2 ** (3 ** 2) -> 2 ** 9 -> 512
print(f"2 ** 3 ** 2 = {2 ** 3 ** 2}")
print(f"2 ** (3 ** 2) = {2 ** (3 ** 2)} (Identical)")
print(f"(2 ** 3) ** 2 = {(2 ** 3) ** 2} (Different when forced left-to-right!)")`,
          runMode: 'real',
          expectedOutput: `2 ** 3 = 8
5 ** 4 = 625
10 ** 6 = 1,000,000
2 ** -1 = 0.5
2 ** -3 = 0.125
64 ** 0.5 (square root): 8.0
27 ** (1/3) (cube root): 3.0
2 ** 3 ** 2 = 512
2 ** (3 ** 2) = 512 (Identical)
(2 ** 3) ** 2 = 64 (Different when forced left-to-right!)`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 12,
          instruction: '64 ** 0.5',
          internalEffect: 'Evaluates fractional power, delegating to C pow() function and returning float 8.0.',
        },
        {
          step: 2,
          codeLine: 17,
          instruction: '2 ** 3 ** 2',
          internalEffect: 'AST parser detects right-associative ** chain. It groups the rightmost pair first: 3 ** 2 = 9, then 2 ** 9 = 512.',
        },
      ],
      apply: {
        contextTitle: 'Nigerian Real Estate Compound Interest Investment',
        scenario: 'Calculate the compound future value of a land development treasury bond over 5 years.',
        domain: 'finance',
        code: `principal = 5_000_000  # ₦5 Million principal
annual_rate = 0.14     # 14% annual interest
years = 5

# Compound interest formula: A = P * (1 + r) ** t
future_value = principal * ((1 + annual_rate) ** years)
total_interest_earned = future_value - principal

print(f"Initial Investment: ₦{principal:,.2f}")
print(f"Annual Interest Rate: {annual_rate * 100:.0f}%")
print(f"Investment Duration: {years} years")
print(f"Future Value at Maturity: ₦{future_value:,.2f}")
print(f"Total Wealth Created: ₦{total_interest_earned:,.2f}")`,
        outcome: `Initial Investment: ₦5,000,000.00
Annual Interest Rate: 14%
Investment Duration: 5 years
Future Value at Maturity: ₦9,627,073.92
Total Wealth Created: ₦4,627,073.92`,
      },
      commonMistakes: [
        {
          label: 'Using caret (^) instead of ** for exponentiation',
          erroneousCode: `squared = 5 ^ 2  # Intending 25`,
          errorMessage: 'Logic Bug: 5 ^ 2 evaluates to 7 (Bitwise XOR), not 25.',
          explanation: 'In Python, the caret symbol (^) is the bitwise XOR operator, not power. Always use ** for exponentiation.',
          correctedCode: `squared = 5 ** 2  # Evaluates to 25`,
        },
        {
          label: 'Assuming left-to-right grouping in nested powers',
          erroneousCode: `result = 2 ** 3 ** 2  # Expecting 64`,
          errorMessage: 'Logic Bug: Evaluates to 512 due to right-associativity.',
          explanation: 'Exponentiation groups right-to-left. To force left-to-right evaluation, use explicit parentheses: (2 ** 3) ** 2.',
          correctedCode: `result = (2 ** 3) ** 2  # Evaluates to 64`,
        },
      ],
      practise: [
        {
          id: 'd3-s4-ex1',
          title: 'Right-to-Left Exponentiation Associativity',
          type: 'predict-output',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Supercomputing Cluster Processor Core Allocation',
          prompt: 'What exact number does Python calculate and display for the following expression?\n\nresult = 2 ** 3 ** 2\nprint(result)',
          options: [
            {
              id: 'opt-1',
              text: '512',
              explanation: 'Correct! Unlike most Python operators which evaluate left-to-right, the ** operator is right-associative. Python groups this expression as 2 ** (3 ** 2) = 2 ** 9 = 512.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: '64',
              explanation: 'Incorrect. (2 ** 3) ** 2 = 8 ** 2 = 64, but ** associates from right to left.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: '36',
              explanation: 'Incorrect. This would be (2 * 3) ** 2, which confuses multiplication with exponentiation.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: '18',
              explanation: 'Incorrect. Exponentiation is repeated multiplication, not simple factor multiplication.',
              isCorrect: false,
            },
          ],
          hints: [
            'Check operator associativity: does ** evaluate left-to-right or right-to-left?',
            'Right-associativity means evaluate 3 ** 2 first.',
            'Now compute 2 raised to that resulting exponent.',
          ],
        },
        {
          id: 'd3-s4-ex2',
          title: 'Solar Energy Capacitor Stored Joules Calculator',
          type: 'write-code',
          tier: 'standard',
          points: 20,
          contextScenario: 'Solar Microgrid Battery Inverter Lab, Kano State',
          prompt: 'Write Python code that calculates the electrostatic energy stored in a high-capacity capacitor using the formula E = 0.5 * C * (V ** 2). Given capacitance c = 0.002 farads and voltage v = 240.0 volts, compute the energy in joules and print the formatted string: "Stored Energy: 57.60 J".',
          starterCode: `# Capacitance in farads and voltage in volts
c = 0.002
v = 240.0

# Calculate stored energy E = 0.5 * c * (v ** 2)
# Print formatted: "Stored Energy: 57.60 J"
`,
          solutionCode: `c = 0.002
v = 240.0

energy = 0.5 * c * (v ** 2)
print(f"Stored Energy: {energy:.2f} J")`,
          testCases: [
            {
              id: 'tc-1',
              label: 'Standard Inverter Capacitor: 0.002F at 240V',
              setup: 'c = 0.002\nv = 240.0',
              expected: 'Stored Energy: 57.60 J',
              hidden: false,
            },
            {
              id: 'tc-2',
              label: 'Supercapacitor Bank: 0.05F at 48V',
              setup: 'c = 0.05\nv = 48.0',
              expected: 'Stored Energy: 57.60 J',
              hidden: true,
            },
          ],
          hints: [
            'Use the exponentiation operator ** to square the voltage: (v ** 2).',
            'Multiply 0.5 by c and by (v ** 2).',
            'Format the output using f-string specification {energy:.2f} J.',
          ],
        },
      ],
      assess: [],
    },

    // ==========================================
    // Subtopic 5: Comparison Operators & Chained Comparisons
    // ==========================================
    {
      id: 'day3-sub5',
      number: 5,
      title: 'Comparison Operators & Chained Comparisons',
      summary: 'Compare values using ==, !=, <, >, <=, >=, and leverage Python\'s chained comparisons.',
      estimatedMinutes: 7,
      introduce: {
        headline: 'Relational Logic & Python\'s Elegant Chained Comparisons',
        paragraphs: [
          'Comparison (relational) operators test the relationship between two operands and always produce a boolean result: True or False. Python provides six standard comparison operators: equal to (==), not equal to (!=), strictly greater than (>), strictly less than (<), greater than or equal to (>=), and less than or equal to (<=).',
          'One of Python\'s cleanest language features is chained comparison. In mathematical writing, you frequently see intervals expressed as 18 <= age <= 65. In languages like C or Java, this must be awkwardly written as age >= 18 && age <= 65. Python natively supports chained comparisons: 18 <= age <= 65 evaluates both conditions with short-circuit efficiency, evaluating the middle operand only once.',
          'String comparison in Python operates lexicographically based on Unicode code points (inspectable via the built-in ord() function). Because uppercase ASCII letters (A=65) precede lowercase letters (a=97), "Z" < "a" evaluates to True.',
        ],
        keyTerms: [
          { term: 'Comparison Operators', definition: 'The set of 6 operators (==, !=, <, >, <=, >=) that evaluate relative value and return a boolean.' },
          { term: 'Chained Comparison', definition: 'Evaluating multiple comparisons in a single expression (e.g. 0 < x < 100).' },
          { term: 'Lexicographical Order', definition: 'Alphabetical sorting based on the numeric Unicode code point ord() of each character.' },
        ],
      },
      visualise: {
        type: 'truth-table',
        title: 'Comparison & Logic Evaluator',
        badge: 'simulation',
        description: 'Observe comparison results and see how relational expressions evaluate dynamically.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Relational Operators and Chained Comparison Examples',
          code: `# Numeric Comparisons
score = 85
pass_mark = 50

print(f"score == 85: {score == 85}")
print(f"score != 100: {score != 100}")
print(f"score > pass_mark: {score > pass_mark}")
print(f"score <= 85: {score <= 85}")

# PYTHON CHAINED COMPARISONS
# Test if score lies within distinction range [80, 100]
is_distinction = 80 <= score <= 100
print(f"\\nIs score in [80, 100]? {is_distinction}")

# Equivalent compound expression:
print(f"Expanded equivalent: {score >= 80 and score <= 100}")

# Lexicographical String Comparisons
print("\\n--- STRING COMPARISONS ---")
print(f"'Abuja' < 'Lagos': {'Abuja' < 'Lagos'}")
print(f"'apple' == 'Apple': {'apple' == 'Apple'}")  # False (case-sensitive)
print(f"'Z' < 'a': {'Z' < 'a'}")  # True! ord('Z')=90 < ord('a')=97
print(f"ord('Z')={ord('Z')}, ord('a')={ord('a')}")`,
          runMode: 'real',
          expectedOutput: `score == 85: True
score != 100: True
score > pass_mark: True
score <= 85: True

Is score in [80, 100]? True
Expanded equivalent: True

--- STRING COMPARISONS ---
'Abuja' < 'Lagos': True
'apple' == 'Apple': False
'Z' < 'a': True
ord('Z')=90, ord('a')=97`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 11,
          instruction: 'is_distinction = 80 <= score <= 100',
          internalEffect: 'Evaluates 80 <= score (True), then score <= 100 (True), returning True without re-evaluating score.',
        },
        {
          step: 2,
          codeLine: 20,
          instruction: "'Z' < 'a'",
          internalEffect: 'Compares Unicode code point ord("Z") = 90 against ord("a") = 97. 90 < 97 yields True.',
        },
      ],
      apply: {
        contextTitle: 'JAMB / University Admissions Board Cut-off Screener',
        scenario: 'Screen candidates based on minimum age (16) and UTME score threshold between 200 and 400.',
        domain: 'school',
        code: `candidate_name = "Chukwuemeka Obi"
candidate_age = 17
utme_score = 284

# Verify candidate credentials via chained comparisons
meets_age_requirement = candidate_age >= 16
valid_score_range = 200 <= utme_score <= 400

is_qualified = meets_age_requirement and valid_score_range

print(f"Candidate: {candidate_name}")
print(f"Age Check (>= 16): {meets_age_requirement} ({candidate_age} years)")
print(f"UTME Score in [200, 400]: {valid_score_range} ({utme_score} marks)")
print(f"Admission Screening Status: {'ELIGIBLE FOR POST-UTME' if is_qualified else 'DISQUALIFIED'}")`,
        outcome: `Candidate: Chukwuemeka Obi
Age Check (>= 16): True (17 years)
UTME Score in [200, 400]: True (284 marks)
Admission Screening Status: ELIGIBLE FOR POST-UTME`,
      },
      commonMistakes: [
        {
          label: 'Using single = instead of double == for comparison',
          erroneousCode: `if target_score = 100:\n    print("Perfect score!")`,
          errorMessage: 'SyntaxError: invalid syntax. Maybe you meant "==" or ":=" instead of "="?',
          explanation: 'Single equal (=) is assignment. Double equal (==) is equality comparison. In Python, assignment cannot be placed directly inside an if statement.',
          correctedCode: `if target_score == 100:\n    print("Perfect score!")`,
        },
        {
          label: 'Comparing incompatible types with relational operators',
          erroneousCode: `is_valid = "42" > 10`,
          errorMessage: "TypeError: '>' not supported between instances of 'str' and 'int'",
          explanation: 'Python prevents implicit cross-type relational comparisons between strings and numbers. You must explicitly cast int("42") > 10.',
          correctedCode: `is_valid = int("42") > 10  # True`,
        },
      ],
      practise: [
        {
          id: 'd3-s5-ex1',
          title: 'Chained UTME Admission Score Range Validation',
          type: 'fill-the-gaps',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Joint Admissions and Matriculation Board (JAMB) Cutoff Verification',
          prompt: 'Complete the Python condition using chained comparisons to verify that candidate score is between 180 and 400 inclusive.',
          gaps: [
            {
              id: 'gap-1',
              beforeText: 'is_qualified = 180 ',
              afterText: ' score ',
              correctAnswer: '<=',
              options: ['<=', '<', '==', '>='],
            },
            {
              id: 'gap-2',
              beforeText: 'score ',
              afterText: ' 400',
              correctAnswer: '<=',
              options: ['<=', '<', '==', '>='],
            },
          ],
          hints: [
            'In Python, chained comparisons allow you to write mathematical ranges like min <= x <= max.',
            'The minimum threshold is 180, so 180 <= score.',
            'The maximum score is 400, so score <= 400.',
          ],
        },
        {
          id: 'd3-s5-ex2',
          title: 'Unicode Lexicographical String Comparisons',
          type: 'scenario-mcq',
          tier: 'standard',
          points: 15,
          contextScenario: 'Abuja Electoral Register Alphabetical Sorting',
          prompt: 'What is the evaluated boolean result of the expression "Abuja" < "abuja" in Python, and why?',
          options: [
            {
              id: 'opt-1',
              text: "True — because uppercase 'A' has an ASCII/Unicode code point (65) less than lowercase 'a' (97).",
              explanation: "Correct! Python compares strings character-by-character according to Unicode ordinals. ord('A') is 65 while ord('a') is 97.",
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'False — because lowercase letters always come before uppercase letters in computer alphabets.',
              explanation: 'Incorrect. In standard ASCII and Unicode, uppercase letters (65-90) precede lowercase letters (97-122).',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'False — because both strings have the exact same spelling ignoring case.',
              explanation: 'Incorrect. Python string comparisons are strictly case-sensitive.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'TypeError — strings cannot be compared using inequality operators (<, >).',
              explanation: 'Incorrect. Strings support lexicographical comparisons with <, <=, >, >=.',
              isCorrect: false,
            },
          ],
          hints: [
            'String comparisons in Python compare ASCII / Unicode numeric values (ord()).',
            'Does uppercase "A" have a smaller or larger numerical value than lowercase "a"?',
            'ord("A") is 65 and ord("a") is 97. 65 < 97 is True.',
          ],
        },
      ],
      assess: [],
    },

    // ==========================================
    // Subtopic 6: Logical Operators: and, or, not
    // ==========================================
    {
      id: 'day3-sub6',
      number: 6,
      title: 'Logical Operators: and, or, not',
      summary: 'Combine multiple conditions with Boolean logic and explore formal truth tables.',
      estimatedMinutes: 7,
      introduce: {
        headline: 'Boolean Operators: Composing Complex Decisions',
        paragraphs: [
          'Logical operators allow you to combine or invert boolean expressions to model real-world business logic and decision trees. Python uses three English keyword operators: and, or, and not (never &&, ||, or ! like in C/Java).',
          'The and operator returns True if and only if both operands are truthy. If either operand is falsy, the result is False. The or operator returns True if at least one operand is truthy; it is False only when both operands are falsy. The unary not operator inverts the truth value: not True is False, and not False is True.',
          'Understanding logical operator precedence is vital when writing compound expressions: not has the highest precedence, followed by and, with or having the lowest precedence. In the expression A or B and C, Python evaluates B and C first before performing the or operation.',
        ],
        keyTerms: [
          { term: 'and', definition: 'Conjunction operator that evaluates to True only if both operands are truthy.' },
          { term: 'or', definition: 'Disjunction operator that evaluates to True if at least one operand is truthy.' },
          { term: 'not', definition: 'Unary negation operator that inverts the truth value of its operand.' },
        ],
      },
      visualise: {
        type: 'truth-table',
        title: 'Boolean Logic & Truth-Table Engine',
        badge: 'simulation',
        description: 'Interactive truth-table switches for Boolean algebra (and, or, not) with glowing active row and live evaluations.',
        initialConfig: { valA: true, valB: false },
      },
      code: [
        {
          title: 'Boolean Logic and Precedence in Action',
          code: `# Boolean logic primitives
is_authenticated = True
has_admin_role = False
is_suspended = False

# Logical AND (both must be True)
can_access_dashboard = is_authenticated and not is_suspended
print(f"Can access dashboard: {can_access_dashboard}")

# Logical OR (at least one must be True)
is_vip_customer = False
order_total = 75000
qualifies_for_free_shipping = is_vip_customer or order_total > 50000
print(f"Qualifies for free shipping: {qualifies_for_free_shipping}")

# Operator Precedence: 'not' > 'and' > 'or'
# In: True or False and False
# 'False and False' evaluates first to False, then 'True or False' evaluates to True
print(f"\\nPrecedence test: True or False and False = {True or False and False}")
# Explicit parentheses enforce readable developer intent:
print(f"With explicit grouping: (True or False) and False = {(True or False) and False}")`,
          runMode: 'real',
          expectedOutput: `Can access dashboard: True
Qualifies for free shipping: True

Precedence test: True or False and False = True
With explicit grouping: (True or False) and False = False`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 7,
          instruction: 'can_access_dashboard = is_authenticated and not is_suspended',
          internalEffect: 'Evaluates not is_suspended first (not False -> True). Then evaluates True and True -> True.',
        },
        {
          step: 2,
          codeLine: 18,
          instruction: 'True or False and False',
          internalEffect: 'Because and binds tighter than or, it evaluates False and False = False first. Then True or False = True.',
        },
      ],
      apply: {
        contextTitle: 'GTBank Automated ATM Cash Dispenser Controller',
        scenario: 'Authorize cash withdrawal only if card is active, PIN entered matches, and requested cash does not exceed account balance or ATM vault reserve.',
        domain: 'finance',
        code: `card_is_active = True
pin_verified = True
account_balance = 85000
atm_vault_cash = 250000
requested_withdrawal = 40000

# Compound authorization logic
has_credentials = card_is_active and pin_verified
has_sufficient_funds = account_balance >= requested_withdrawal
vault_can_dispense = atm_vault_cash >= requested_withdrawal

is_authorized = has_credentials and has_sufficient_funds and vault_can_dispense

print(f"Requested Cash: ₦{requested_withdrawal:,}")
print(f"Credentials Verified: {has_credentials}")
print(f"Customer Balance Sufficient: {has_sufficient_funds}")
print(f"ATM Vault Sufficient: {vault_can_dispense}")
print(f"Dispense Action: {'DISPENSING CASH...' if is_authorized else 'TRANSACTION DECLINED'}")`,
        outcome: `Requested Cash: ₦40,000
Credentials Verified: True
Customer Balance Sufficient: True
ATM Vault Sufficient: True
Dispense Action: DISPENSING CASH...`,
      },
      commonMistakes: [
        {
          label: 'Writing if x == 1 or 2 instead of if x == 1 or x == 2',
          erroneousCode: `status_code = 500
if status_code == 200 or 201:
    print("Success!")  # Always executes!`,
          errorMessage: 'Logic Bug: 201 is evaluated as a standalone operand, which is always truthy (non-zero int).',
          explanation: 'In Python, or separates two complete boolean conditions. "or 201" does not compare status_code to 201; it checks bool(201) which is True.',
          correctedCode: `if status_code == 200 or status_code == 201:\n    print("Success!")  # Or: if status_code in (200, 201):`,
        },
        {
          label: 'Using symbols && and || instead of and and or',
          erroneousCode: `if is_admin && is_active:`,
          errorMessage: 'SyntaxError: invalid syntax',
          explanation: 'Python uses the natural English words and, or, and not. The symbols && and || do not exist in Python.',
          correctedCode: `if is_admin and is_active:`,
        },
      ],
      practise: [
        {
          id: 'd3-s6-ex1',
          title: 'Trace ATM Cash Dispense Authorization Conditions',
          type: 'explain-the-trace',
          tier: 'standard',
          points: 15,
          contextScenario: 'FirstBank Lagos ATM Authorization Pipeline',
          prompt: 'Inspect the ATM transaction variables and compound authorization condition. Trace step-by-step how Python evaluates can_dispense and determine the final outcome.',
          traceStepCode: `balance = 45000
requested = 20000
pin_valid = True
daily_limit = 100000

can_dispense = pin_valid and (requested <= balance) and (requested <= daily_limit)`,
          traceQuestion: 'What is the boolean evaluation sequence for can_dispense?',
          options: [
            {
              id: 'opt-1',
              text: 'pin_valid evaluates to True -> (20000 <= 45000) evaluates to True -> (20000 <= 100000) evaluates to True -> can_dispense is True',
              explanation: 'Correct! In a chain of and operators, Python evaluates left-to-right. Since all three expressions are True, none trigger early exit and the final result is True.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'Python evaluates all three expressions concurrently without any guaranteed order.',
              explanation: 'Incorrect. Python specifies strict left-to-right evaluation order.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'Python stops at pin_valid and ignores the balance check.',
              explanation: 'Incorrect. Because pin_valid is True, and requires testing subsequent conditions.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'can_dispense evaluates to 100000 because and returns the last operand.',
              explanation: 'Incorrect. The operands here are boolean comparisons (<=), not integers.',
              isCorrect: false,
            },
          ],
          hints: [
            'Trace the variables: pin_valid is True, requested (20000) <= balance (45000) is True.',
            'Is 20000 <= 100000 also True?',
            'When every condition in an and chain evaluates to True, the result is True.',
          ],
        },
        {
          id: 'd3-s6-ex2',
          title: 'The Classic "or 201" Truthiness Trap',
          type: 'fix-the-bug',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Flutterwave Payment Gateway Webhook Verification',
          prompt: 'A junior developer wrote: if status == 200 or 201:, expecting to match HTTP status 200 or 201. However, when status is 404, the condition incorrectly evaluates as truthy! Fix the code so it properly checks if status is either 200 or 201.',
          starterCode: `status = 404

# Buggy condition: evaluates "201" as a truthy integer!
if status == 200 or 201:
    print("Payment Verified")
else:
    print("Payment Failed")`,
          solutionCode: `status = 404

# Corrected condition: explicitly check status against both values
if status == 200 or status == 201:
    print("Payment Verified")
else:
    print("Payment Failed")`,
          hints: [
            'In Python, "or 201" does not link back to "status =="; it evaluates bool(201) independently.',
            'Because 201 is non-zero, bool(201) is always True, making the entire condition always succeed.',
            'Fix it by writing "status == 200 or status == 201" (or "status in (200, 201)").',
          ],
        },
      ],
      assess: [],
    },

    // ==========================================
    // Subtopic 7: Short-Circuit Evaluation & Non-Boolean Returns
    // ==========================================
    {
      id: 'day3-sub7',
      number: 7,
      title: 'Short-Circuit Evaluation & Non-Boolean Returns',
      summary: 'Understand how Python stops evaluation early and why and/or return operand values rather than booleans.',
      estimatedMinutes: 7,
      introduce: {
        headline: 'Short-Circuiting & The Non-Boolean Return Idiom',
        paragraphs: [
          'Python\'s logical operators execute with short-circuit evaluation: evaluation proceeds from left to right and stops the instant the final outcome is mathematically resolved. In the expression A and B, if A is falsy, Python returns A immediately without evaluating B. In A or B, if A is truthy, Python returns A immediately without evaluating B.',
          'This provides an essential defensive programming tool known as guard expressions: you can check if a reference is valid before dereferencing it, e.g. count != 0 and (total / count) > 50. If count is 0, the second operand is never evaluated, completely preventing a ZeroDivisionError.',
          'Moreover, Python\'s and and or operators do NOT convert their operands to booleans! They return the actual operand object that decided the expression. A or B returns A if A is truthy, otherwise B. This allows elegant fallback patterns like username = input_name or "Guest".',
        ],
        keyTerms: [
          { term: 'Short-Circuiting', definition: 'Stopping expression evaluation as soon as the outcome is determined (skipping subsequent operands).' },
          { term: 'Guard Expression', definition: 'Placing a safety check on the left of an and operator to prevent runtime errors in the right operand.' },
          { term: 'Default Value Idiom', definition: 'Using A or B to provide fallback value B when A is empty, zero, or None.' },
        ],
      },
      visualise: {
        type: 'truth-table',
        title: 'Short-Circuit Execution Pipeline',
        badge: 'simulation',
        description: 'Step through short-circuit execution pipelines and inspect exact non-boolean return values.',
        initialConfig: { valA: true, valB: false },
      },
      code: [
        {
          title: 'Short-Circuit Guards and Non-Boolean Returns',
          code: `# Defensive Guard Expression (Prevents ZeroDivisionError)
items_sold = 0
total_revenue = 0

# items_sold != 0 is False, so the right-side division is NEVER executed!
has_high_average = items_sold != 0 and (total_revenue / items_sold) > 5000
print(f"Has high average: {has_high_average}")

# NON-BOOLEAN RETURN VALUES IN ACTION
# 'or' returns the first truthy operand, or the last operand
print("\\n--- 'or' RETURNS OPERAND VALUES ---")
print(f"'Lagos' or 'Abuja' -> {'Lagos' or 'Abuja'!r}")
print(f"'' or 'Default User' -> {'' or 'Default User'!r}")
print(f"None or 'Fallback' -> {None or 'Fallback'!r}")
print(f"0 or 0.0 or 42 -> {0 or 0.0 or 42!r}")

# 'and' returns the first falsy operand, or the last operand
print("\\n--- 'and' RETURNS OPERAND VALUES ---")
print(f"0 and 'Premium' -> {0 and 'Premium'!r}")
print(f"'Active' and 'Verified' -> {'Active' and 'Verified'!r}")
print(f"[] and [1, 2] -> {[] and [1, 2]!r}")`,
          runMode: 'real',
          expectedOutput: `Has high average: False

--- 'or' RETURNS OPERAND VALUES ---
'Lagos' or 'Abuja' -> 'Lagos'
'' or 'Default User' -> 'Default User'
None or 'Fallback' -> 'Fallback'
0 or 0.0 or 42 -> 42

--- 'and' RETURNS OPERAND VALUES ---
0 and 'Premium' -> 0
'Active' and 'Verified' -> 'Verified'
[] and [1, 2] -> []`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 6,
          instruction: 'has_high_average = items_sold != 0 and (total_revenue / items_sold) > 5000',
          internalEffect: 'Evaluates items_sold != 0 (False). Short-circuits immediately; (total_revenue / items_sold) is never executed, avoiding ZeroDivisionError.',
        },
        {
          step: 2,
          codeLine: 12,
          instruction: "'' or 'Default User'",
          internalEffect: "Tests truthiness of ''. It is falsy, so or proceeds to second operand and returns the string 'Default User'.",
        },
        {
          step: 3,
          codeLine: 18,
          instruction: "0 and 'Premium'",
          internalEffect: "Tests truthiness of 0. It is falsy, so and halts immediately and returns the integer 0 directly.",
        },
      ],
      apply: {
        contextTitle: 'SaaS Platform User Profile Fallback Generator',
        scenario: 'Generate display names using fallback chain: preferred nickname -> full name -> default "Anonymous Learner".',
        domain: 'automation',
        code: `submitted_nickname = ""       # User left blank
registered_fullname = "Aminu Kano"

# Fallback pattern using 'or' chaining
display_title = submitted_nickname or registered_fullname or "Anonymous Learner"
print(f"Display Name: {display_title}")

# Guarded configuration loader
custom_timeout = None
effective_timeout = custom_timeout or 30  # Default to 30 seconds
print(f"Effective Timeout: {effective_timeout}s")`,
        outcome: `Display Name: Aminu Kano
Effective Timeout: 30s`,
      },
      commonMistakes: [
        {
          label: 'Falsy valid values bypassed in or fallbacks (e.g. 0 as legitimate input)',
          erroneousCode: `user_score = 0  # 0 is a valid score!
final_score = user_score or 50  # Overwrites 0 to 50!`,
          errorMessage: 'Logic Bug: final_score becomes 50 even though the user legitimately scored 0.',
          explanation: 'Because 0 is falsy, or skips it. When 0 or False are valid inputs, check explicitly against None using: final_score = 50 if user_score is None else user_score.',
          correctedCode: `user_score = 0
final_score = 50 if user_score is None else user_score  # Preserves 0`,
        },
      ],
      practise: [
        {
          id: 'd3-s7-ex1',
          title: 'Predict Non-Boolean Return Values in Short-Circuiting',
          type: 'predict-output',
          tier: 'standard',
          points: 15,
          contextScenario: 'Logistics App Default Dispatch Hub Fallback',
          prompt: 'What exact string is printed by the following Python program?\n\nhub = None or "" or "Ikeja Dispatch" or "Lekki Dispatch"\nprint(hub)',
          options: [
            {
              id: 'opt-1',
              text: 'Ikeja Dispatch',
              explanation: 'Correct! The or operator evaluates operands from left to right and immediately returns the FIRST truthy operand encountered without converting it to a boolean.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'True',
              explanation: 'Incorrect. Python\'s or operator does not convert its operands to booleans; it returns the actual truthy object.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'Lekki Dispatch',
              explanation: 'Incorrect. Short-circuiting stops immediately at the first truthy value ("Ikeja Dispatch") and never evaluates subsequent operands.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'None',
              explanation: 'Incorrect. None is falsy, so or moves on to evaluate subsequent operands.',
              isCorrect: false,
            },
          ],
          hints: [
            'Python or returns the first truthy value it encounters.',
            'None is falsy. The empty string "" is also falsy.',
            '"Ikeja Dispatch" is a non-empty string, making it the first truthy value.',
          ],
        },
        {
          id: 'd3-s7-ex2',
          title: 'Short-Circuiting as a ZeroDivisionError Shield',
          type: 'theory-reasoning',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Automated Stock Inventory Rate of Sale, Onitsha Main Market',
          prompt: 'Explain why the guard expression `b != 0 and (total / b) > 10` executes safely without crashing when b = 0, whereas `(total / b) > 10 and b != 0` immediately crashes with ZeroDivisionError.',
          modelAnswer: 'Python evaluates and expressions strictly from left to right with short-circuiting. In `b != 0 and (total / b) > 10`, when b = 0, the first operand `0 != 0` evaluates to False. Because False and anything is always False, Python terminates evaluation immediately without ever executing the right operand `(total / b)`. In contrast, in `(total / b) > 10 and b != 0`, Python evaluates the division first, dividing by zero before reaching the safety check.',
          markingCriteria: [
            { id: 'crit-1', label: 'Explains left-to-right evaluation order and short-circuit termination on False', points: 7 },
            { id: 'crit-2', label: 'Identifies that the right operand (total / b) is never executed when the guard is False', points: 7 },
            { id: 'crit-3', label: 'Contrasts with the reversed expression where division by zero triggers before the check', points: 6 },
          ],
          hints: [
            'Consider what short-circuiting means when the left operand of and is False.',
            'Does Python evaluate the second operand if the first operand is already False?',
            'What happens when the order is reversed?',
          ],
        },
      ],
      assess: [],
    },

    // ==========================================
    // Subtopic 8: Identity (is) vs Equality (==) & Singletons
    // ==========================================
    {
      id: 'day3-sub8',
      number: 8,
      title: 'Identity (is) vs Equality (==) & Singletons',
      summary: 'Distinguish object memory identity (is) from value equality (==) and master singleton None comparisons.',
      estimatedMinutes: 7,
      introduce: {
        headline: 'Identity vs Equality: Pointer vs Value Semantics',
        paragraphs: [
          'One of the most essential conceptual distinctions in Python is the difference between value equality (==) and object identity (is). Novice programmers frequently confuse the two because they often produce the same outcome for small numbers.',
          'Value equality (==) invokes an object\'s __eq__() method to verify whether two objects contain equivalent data contents. In contrast, object identity (is) checks whether two identifiers point to the exact same physical memory address in RAM (id(a) == id(b)). Two distinct list objects [1, 2] and [1, 2] are equal in value (== is True), but they are distinct memory containers (is is False).',
          'CPython optimizes memory by pre-allocating small integers in the range [-5, 256]. For this cached range, separate assignments point to the same memory object. For larger numbers outside this range, separate instances are allocated. Finally, the PEP 8 Python Style Guide mandates using is or is not exclusively when testing for the singleton None.',
        ],
        keyTerms: [
          { term: 'Equality (==)', definition: 'Comparison operator testing if two objects hold equivalent value data contents.' },
          { term: 'Identity (is)', definition: 'Operator testing if two variables point to the identical memory address (id(a) == id(b)).' },
          { term: 'Small Integer Cache', definition: 'CPython optimization pre-allocating integer objects from -5 to 256 as shared singletons.' },
        ],
      },
      visualise: {
        type: 'identity-equality',
        title: 'Identity vs Equality Memory Inspector',
        badge: 'simulation',
        description: 'Inspect memory slot allocations (id), CPython small integer caching, and distinct list allocations.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Demonstrating is vs == with Lists and Cached Integers',
          code: `# 1. Mutable objects: Two distinct lists with identical elements
list_a = [10, 20, 30]
list_b = [10, 20, 30]
list_c = list_a  # Shared alias

print(f"list_a == list_b: {list_a == list_b} (Values match)")
print(f"list_a is list_b: {list_a is list_b} (Distinct heap objects!)")
print(f"id(list_a)={hex(id(list_a))}, id(list_b)={hex(id(list_b))}")
print(f"list_a is list_c: {list_a is list_c} (Same pointer reference!)")

# 2. CPython Small Integer Caching [-5, 256]
x = 250
y = 250
print(f"\\n250 == 250: {x == y}")
print(f"250 is 250: {x is y} (Within [-5, 256] small integer cache)")

# 3. Singleton None comparison (PEP 8 standard)
database_record = None
print(f"\\nrecord is None: {database_record is None}")
print(f"record is not None: {database_record is not None}")`,
          runMode: 'real',
          expectedOutput: `list_a == list_b: True (Values match)
list_a is list_b: False (Distinct heap objects!)
list_a is list_c: True (Same pointer reference!)

250 == 250: True
250 is 250: True (Within [-5, 256] small integer cache)

record is None: True
record is not None: False`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'list_a = [10, 20, 30]; list_b = [10, 20, 30]',
          internalEffect: 'Allocates two separate PyListObject containers in heap memory at different memory addresses.',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 'list_a == list_b vs list_a is list_b',
          internalEffect: '== compares contents and finds them matching (True). is compares pointer addresses and finds them different (False).',
        },
        {
          step: 3,
          codeLine: 18,
          instruction: 'database_record is None',
          internalEffect: 'Compares pointer directly against the unique Py_None singleton without calling __eq__.',
        },
      ],
      apply: {
        contextTitle: 'Payment Gateway Webhook Idempotency Guard',
        scenario: 'Guard against processing duplicate webhooks or uninitialized transaction states.',
        domain: 'finance',
        code: `transaction_id = "TXN_9847291"
cached_response = None  # Not yet processed

# PEP 8 idiomatic check for uninitialized state
if cached_response is None:
    print(f"Transaction {transaction_id}: First-time event. Processing payment...")
    cached_response = {"status": "SUCCESS", "amount": 25000}
else:
    print(f"Transaction {transaction_id}: Already processed (Idempotent replay).")

print(f"Final State: {cached_response['status']} (₦{cached_response['amount']:,})")`,
        outcome: `Transaction TXN_9847291: First-time event. Processing payment...
Final State: SUCCESS (₦25,000)`,
      },
      commonMistakes: [
        {
          label: 'Using == to check for None',
          erroneousCode: `if status == None:  # Unidiomatic`,
          errorMessage: 'PEP 8 Style Violation: Comparison to None should always be "if cond is None:".',
          explanation: 'Classes can override __eq__() and return misleading results. The is operator tests pointer identity directly against the None singleton.',
          correctedCode: `if status is None:  # PEP 8 standard`,
        },
        {
          label: 'Using is to compare numbers or strings',
          erroneousCode: `user_guess = int(input())
if user_guess is 1000:  # Fails for integers outside cache!`,
          errorMessage: 'SyntaxWarning: "is" with a literal. Did you mean "=="?',
          explanation: 'Never use is for value comparisons. Integers outside [-5, 256] or dynamic strings are not guaranteed to share memory addresses.',
          correctedCode: `if user_guess == 1000:`,
        },
      ],
      practise: [
        {
          id: 'd3-s8-ex1',
          title: 'List Equality vs Memory Identity',
          type: 'scenario-mcq',
          tier: 'standard',
          points: 15,
          contextScenario: 'Fintech Database Record Fingerprinting, Lagos',
          prompt: 'Given the following list definitions:\n\nlist_a = [10, 20, 30]\nlist_b = [10, 20, 30]\n\nWhat do (list_a == list_b) and (list_a is list_b) evaluate to, respectively?',
          options: [
            {
              id: 'opt-1',
              text: 'True, False — because == tests equivalent contents, while is tests distinct memory addresses.',
              explanation: 'Correct! The lists contain identical values so list_a == list_b is True. However, lists are mutable objects, so Python allocates two distinct heap memory containers, meaning list_a is list_b is False.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'True, True — because Python caches lists with identical contents automatically.',
              explanation: 'Incorrect. Python never caches mutable collections like lists.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'False, False — because variable names are different.',
              explanation: 'Incorrect. == compares element values regardless of identifier names.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'False, True — because pointers match even when contents differ.',
              explanation: 'Incorrect. Memory pointers are distinct for independently created lists.',
              isCorrect: false,
            },
          ],
          hints: [
            'Remember: == checks value contents (__eq__), while is checks memory identity (id()).',
            'Are lists mutable or immutable? (Lists are mutable).',
            'Python does not cache or alias separately declared mutable objects.',
          ],
        },
        {
          id: 'd3-s8-ex2',
          title: 'Fix Singleton None Comparison per PEP 8',
          type: 'fix-the-bug',
          tier: 'foundation',
          points: 10,
          contextScenario: 'PEP 8 Automated Linter Code Review, Paystack Lagos',
          prompt: 'A code review bot flagged: "Comparison to None should be \'if cond is None:\'". Fix the condition to use the identity operator is instead of ==.',
          starterCode: `def get_user_status(role):
    # Buggy PEP 8 violation: using == with None
    if role == None:
        return "Unassigned Guest"
    return f"Role: {role}"

print(get_user_status(None))`,
          solutionCode: `def get_user_status(role):
    # Corrected PEP 8 pattern: using 'is None'
    if role is None:
        return "Unassigned Guest"
    return f"Role: {role}"

print(get_user_status(None))`,
          hints: [
            'PEP 8 specifies that comparisons to singletons, like None, should always be done with "is" or "is not".',
            'Replace "role == None" with "role is None".',
            'This guarantees testing the CPython memory singleton directly.',
          ],
        },
      ],
      assess: [],
    },

    // ==========================================
    // Subtopic 9: Operator Precedence & Practical Formulas
    // ==========================================
    {
      id: 'day3-sub9',
      number: 9,
      title: 'Operator Precedence & Practical Formulas',
      summary: 'Master PEMDAS order of operations, explicit parentheses discipline, and implement real-world formulas.',
      estimatedMinutes: 6,
      introduce: {
        headline: 'Operator Precedence & Engineering Formulas',
        paragraphs: [
          'When an expression contains multiple operators, Python relies on a strict precedence hierarchy (similar to mathematical PEMDAS/BODMAS) to determine which operation executes first. Operators with higher precedence are evaluated before operators with lower precedence.',
          'The fundamental hierarchy from highest to lowest precedence is: 1) Parentheses () 2) Exponentiation ** 3) Unary positive/negative (+x, -x) 4) Multiplication, division, floor division, modulus (*, /, //, %) 5) Addition and subtraction (+, -) 6) Comparisons and identity/membership (<, <=, >, >=, ==, !=, is, in) 7) Logical not 8) Logical and 9) Logical or.',
          'The Zen of Python reminds us: "Readability counts." Even when Python\'s precedence rules would produce the correct answer, PEP 8 strongly encourages adding explicit parentheses to eliminate ambiguity and prevent costly engineering bugs.',
        ],
        keyTerms: [
          { term: 'Operator Precedence', definition: 'The set of rules dictating the order in which different operators are evaluated in an expression.' },
          { term: 'PEMDAS / BODMAS', definition: 'Mnemonic for operator hierarchy: Parentheses, Exponent, Multiplication/Division, Addition/Subtraction.' },
          { term: 'Explicit Parentheses', definition: 'Using parentheses to clarify developer intent and override default precedence.' },
        ],
      },
      visualise: {
        type: 'expression-tree',
        title: 'Operator Precedence & Formula Calculators',
        badge: 'simulation',
        description: 'Interactive expression parser breaking formulas into step-by-step evaluated precedence stages.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Precedence Hierarchy and Engineering Calculations',
          code: `# Precedence test: 2 + 3 * 4 ** 2
# 1. Power first: 4 ** 2 = 16
# 2. Multiplication next: 3 * 16 = 48
# 3. Addition last: 2 + 48 = 50
result = 2 + 3 * 4 ** 2
print(f"2 + 3 * 4 ** 2 = {result}")

# Forcing alternate order with parentheses: (2 + 3) * 4 ** 2 = 5 * 16 = 80
forced_result = (2 + 3) * (4 ** 2)
print(f"(2 + 3) * (4 ** 2) = {forced_result}")

# PRACTICAL FORMULA: Euclidean Distance between two points (x1, y1) and (x2, y2)
# d = sqrt((x2 - x1)**2 + (y2 - y1)**2)
x1, y1 = 2, 3
x2, y2 = 6, 6
distance = (((x2 - x1) ** 2) + ((y2 - y1) ** 2)) ** 0.5
print(f"\\nEuclidean Distance between ({x1}, {y1}) and ({x2}, {y2}): {distance}")

# PRACTICAL FORMULA: Circle Area (A = pi * r**2)
pi = 3.141592653589793
radius = 7
circle_area = pi * (radius ** 2)
print(f"Area of circle (radius={radius}m): {circle_area:.2f} sq meters")`,
          runMode: 'real',
          expectedOutput: `2 + 3 * 4 ** 2 = 50
(2 + 3) * (4 ** 2) = 80

Euclidean Distance between (2, 3) and (6, 6): 5.0
Area of circle (radius=7m): 153.94 sq meters`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 5,
          instruction: 'result = 2 + 3 * 4 ** 2',
          internalEffect: 'Evaluates ** first (4**2=16), then * (3*16=48), then + (2+48=50).',
        },
        {
          step: 2,
          codeLine: 16,
          instruction: 'distance = (((x2 - x1) ** 2) + ((y2 - y1) ** 2)) ** 0.5',
          internalEffect: 'Parentheses resolve differences (4 and 3), exponents square them (16 and 9), addition sums to 25, and fractional exponent computes square root: 5.0.',
        },
      ],
      apply: {
        contextTitle: 'Civil Engineering Road Gradient & Slope Calculator',
        scenario: 'Calculate the percentage gradient slope m = (y2 - y1) / (x2 - x1) * 100 for a highway in Jos Plateau.',
        domain: 'science',
        code: `elevation_start_m = 1200   # y1: starting altitude
elevation_end_m = 1350     # y2: destination altitude
horizontal_dist_m = 2500   # (x2 - x1): horizontal run

# Formula: slope = (rise / run) * 100
rise = elevation_end_m - elevation_start_m
run = horizontal_dist_m
slope_percentage = (rise / run) * 100

print(f"Highway Elevation Gain (Rise): {rise}m")
print(f"Horizontal Run: {run}m")
print(f"Road Gradient Slope: {slope_percentage:.1f}%")
print(f"Gradient Warning: {'STEEP CLIMB - LOW GEAR' if slope_percentage >= 5.0 else 'STANDARD ROAD'}")`,
        outcome: `Highway Elevation Gain (Rise): 150m
Horizontal Run: 2500m
Road Gradient Slope: 6.0%
Gradient Warning: STEEP CLIMB - LOW GEAR`,
      },
      commonMistakes: [
        {
          label: 'Omitting parentheses in division of compound expressions',
          erroneousCode: `fahrenheit = 98.6\ncelsius = fahrenheit - 32 * 5 / 9  # Incorrect!`,
          errorMessage: 'Logic Bug: 32 * 5 / 9 evaluates first due to operator precedence.',
          explanation: 'Without parentheses around (fahrenheit - 32), multiplication and division take precedence over subtraction.',
          correctedCode: `celsius = (fahrenheit - 32) * 5 / 9  # Correct formula`,
        },
      ],
      practise: [
        {
          id: 'd3-s9-ex1',
          title: "Heron's Formula for Triangle Area",
          type: 'order-the-lines',
          tier: 'standard',
          points: 15,
          contextScenario: 'Surveying Triangular Farmland in Ogun State',
          prompt: "Reorder the lines of code to calculate the area of a triangle with side lengths a = 3, b = 4, and c = 5 using Heron's formula: s = (a + b + c) / 2 and area = (s * (s - a) * (s - b) * (s - c)) ** 0.5.",
          jumbledLines: [
            { id: 'line-1', code: 'a, b, c = 3.0, 4.0, 5.0', indent: 0 },
            { id: 'line-2', code: 's = (a + b + c) / 2', indent: 0 },
            { id: 'line-3', code: 'radicand = s * (s - a) * (s - b) * (s - c)', indent: 0 },
            { id: 'line-4', code: 'area = radicand ** 0.5', indent: 0 },
            { id: 'line-5', code: 'print(f"Triangle Area: {area:.2f} sq units")', indent: 0 },
          ],
          correctLineOrder: ['line-1', 'line-2', 'line-3', 'line-4', 'line-5'],
          hints: [
            'Initialize the three side lengths (a, b, c) first.',
            'Compute the semi-perimeter s with parentheses around (a + b + c).',
            'Calculate the product inside the square root before taking the power of 0.5.',
          ],
        },
        {
          id: 'd3-s9-ex2',
          title: 'Civil Engineering 2D Euclidean Distance and Road Slope',
          type: 'write-code',
          tier: 'project',
          points: 30,
          contextScenario: 'Abuja to Kaduna Highway Realignment Telemetry',
          prompt: 'Write Python code that calculates the 2D Euclidean distance d between coordinates (x1, y1) = (0, 0) and (x2, y2) = (300, 400) using d = (((x2 - x1)**2) + ((y2 - y1)**2)) ** 0.5. Then, given vertical elevation_gain = 25.0 meters, compute the road gradient slope percentage as (elevation_gain / d) * 100. Print the formatted output: "Distance: 500.00m | Slope: 5.00%".',
          starterCode: `# Coordinate inputs (in meters)
x1, y1 = 0, 0
x2, y2 = 300, 400
elevation_gain = 25.0

# 1. Compute 2D Euclidean distance d using ** 2 and ** 0.5
# 2. Compute road gradient slope = (elevation_gain / d) * 100
# 3. Print: "Distance: 500.00m | Slope: 5.00%"
`,
          solutionCode: `x1, y1 = 0, 0
x2, y2 = 300, 400
elevation_gain = 25.0

d = (((x2 - x1) ** 2) + ((y2 - y1) ** 2)) ** 0.5
slope = (elevation_gain / d) * 100
print(f"Distance: {d:.2f}m | Slope: {slope:.2f}%")`,
          testCases: [
            {
              id: 'tc-1',
              label: 'Standard 300x400 run with 25m rise',
              setup: 'x1, y1 = 0, 0\nx2, y2 = 300, 400\nelevation_gain = 25.0',
              expected: 'Distance: 500.00m | Slope: 5.00%',
              hidden: false,
            },
            {
              id: 'tc-2',
              label: 'Extended 600x800 run with 50m rise',
              setup: 'x1, y1 = 0, 0\nx2, y2 = 600, 800\nelevation_gain = 50.0',
              expected: 'Distance: 1000.00m | Slope: 5.00%',
              hidden: true,
            },
          ],
          hints: [
            'Use parentheses to ensure subtraction happens before squaring: (x2 - x1) ** 2.',
            'Sum the squared deltas and raise the total sum to 0.5 to find the square root.',
            'Divide elevation_gain by distance and multiply by 100, then format with .2f.',
          ],
        },
      ],
      assess: [],
    },
  ],

  realWorldLabs: [
    {
      id: 'd3-lab-geometry',
      title: 'Lab 1: Land Survey & Geometric Property Calculator',
      description: 'Perform high-precision survey calculations for a triangular land parcel in Lekki Phase 1 and a circular borehole, calculating perimeter, Heron\'s area, circle circumference, and cross-sectional area.',
      domain: 'science',
      starterCode: `# Lekki Phase 1 Triangular Land Parcel Dimensions (meters)
side_a = 45.0
side_b = 60.0
side_c = 75.0

# 1. Triangle Calculations using Heron's Formula
perimeter_triangle = side_a + side_b + side_c
s = perimeter_triangle / 2.0  # Semi-perimeter
area_triangle = (s * (s - side_a) * (s - side_b) * (s - side_c)) ** 0.5

# 2. Circular Water Borehole Dimensions (meters)
radius_borehole = 3.5
pi_approx = 3.141592653589793
circumference_circle = 2 * pi_approx * radius_borehole
area_circle = pi_approx * (radius_borehole ** 2)

print("========================================")
print("LEKKI LAND SURVEY & HYDROLOGY AUDIT")
print(f"Triangle Perimeter: {perimeter_triangle:.2f} m")
print(f"Triangle Area (Heron): {area_triangle:.2f} sq.m")
print(f"Borehole Circumference: {circumference_circle:.2f} m")
print(f"Borehole Cross-Section Area: {area_circle:.2f} sq.m")
print("========================================")
`,
      targetOutput: `========================================
LEKKI LAND SURVEY & HYDROLOGY AUDIT
Triangle Perimeter: 180.00 m
Triangle Area (Heron): 1350.00 sq.m
Borehole Circumference: 21.99 m
Borehole Cross-Section Area: 38.48 sq.m
========================================`,
    },
    {
      id: 'd3-lab-payroll',
      title: 'Lab 2: Nigerian Payroll, Overtime Multiplier & Statutory Deductions',
      description: 'Compute gross monthly salary, overtime pay with a 1.5x multiplier, statutory 8% pension deduction, 5% PAYE tax withholding, and net take-home pay for an offshore petroleum operations technician.',
      domain: 'finance',
      starterCode: `# Offshore Petroleum Operations Staff Payroll
employee_name = "Tunde Adeleke"
employee_id = "NNPC-OFF-4029"
hourly_rate = 3500.00      # ₦3,500/hour
regular_hours = 160.0      # Standard monthly hours
overtime_hours = 24.0      # Extra offshore turnaround hours
overtime_multiplier = 1.5  # Time-and-a-half

# 1. Gross Earnings Calculation
regular_pay = regular_hours * hourly_rate
overtime_pay = overtime_hours * (hourly_rate * overtime_multiplier)
gross_salary = regular_pay + overtime_pay

# 2. Statutory Deductions (Section 14 Nigerian Labour Act)
pension_rate = 0.08       # 8% Employee Contributory Pension Scheme (PENCOM)
paye_tax_rate = 0.05      # 5% Basic PAYE withholding
pension_deduction = gross_salary * pension_rate
paye_deduction = gross_salary * paye_tax_rate
total_deductions = pension_deduction + paye_deduction

# 3. Net Take-Home Pay
net_salary = gross_salary - total_deductions

print("------------------------------------------")
print(f"MONTHLY PAYSLIP: {employee_name} [{employee_id}]")
print(f"Regular Pay (160h @ ₦{hourly_rate:,.2f}): ₦{regular_pay:,.2f}")
print(f"Overtime Pay (24h @ 1.5x): ₦{overtime_pay:,.2f}")
print(f"Gross Earnings: ₦{gross_salary:,.2f}")
print(f"Pension Contribution (8%): -₦{pension_deduction:,.2f}")
print(f"PAYE Tax Withholding (5%): -₦{paye_deduction:,.2f}")
print(f"Total Statutory Deductions: -₦{total_deductions:,.2f}")
print(f"Net Take-Home Pay: ₦{net_salary:,.2f}")
print("------------------------------------------")
`,
      targetOutput: `------------------------------------------
MONTHLY PAYSLIP: Tunde Adeleke [NNPC-OFF-4029]
Regular Pay (160h @ ₦3,500.00): ₦560,000.00
Overtime Pay (24h @ 1.5x): ₦126,000.00
Gross Earnings: ₦686,000.00
Pension Contribution (8%): -₦54,880.00
PAYE Tax Withholding (5%): -₦34,300.00
Total Statutory Deductions: -₦89,180.00
Net Take-Home Pay: ₦596,820.00
------------------------------------------`,
    },
  ],
  miniProject: {
    id: 'd3-project-geometric-calculator',
    title: 'Multi-Formula Geometric & Engineering Calculator',
    brief: 'Construct a command-line engineering calculation utility that computes triangle area, perimeter, circle properties, and slope distance using Python arithmetic operators.',
    requirements: [
      'Implement triangle area and perimeter calculations from dimensions using Heron\'s formula.',
      'Calculate Euclidean distance between two 2D coordinates using the Pythagorean theorem with fractional exponent ** 0.5.',
      'Compute weekly earnings including overtime multiplier with 1.5x hourly rate.',
      'Format all numeric outputs to 2 decimal places using modern f-strings.',
    ],
    rubric: [
      { criterion: 'Formula Accuracy: Uses correct arithmetic operators and operator precedence.', weight: 40 },
      { criterion: 'Zero & Negative Guards: Validates non-zero denominators before division.', weight: 30 },
      { criterion: 'Output Formatting: Clean string presentation with currency and measurement units.', weight: 30 },
    ],
    starterCode: `# Multi-Formula Geometric & Engineering Calculator
# Part 1: Triangle Geometry
base = 12.0
height = 8.0
triangle_area = 0.5 * base * height

# Part 2: Circle Geometry
radius = 7.0
pi = 3.14159
circle_area = pi * (radius ** 2)
circle_circumference = 2 * pi * radius

# Part 3: Euclidean Coordinate Distance
x1, y1 = 10.0, 15.0
x2, y2 = 40.0, 55.0
distance = (((x2 - x1) ** 2) + ((y2 - y1) ** 2)) ** 0.5

# Part 4: Display Summary Results
print("========================================")
print("GEOMETRIC & ENGINEERING REPORT")
print(f"Triangle Area: {triangle_area:.2f} sq.m")
print(f"Circle Area: {circle_area:.2f} sq.m | Circumference: {circle_circumference:.2f} m")
print(f"Euclidean Distance: {distance:.2f} m")
print("========================================")
`,
  },
  dayQuiz: {
    title: 'Day 3 Checkpoint Quiz: Operators & Expression Evaluation',
    passingScorePercentage: 80,
    questions: [
      {
        id: 'd3-q1',
        scenario: 'Python 3 Standard Division Invariant Inspection',
        question: 'When evaluating the expression result = 10 / 2 in Python 3, what is the exact data type and value assigned to result?',
        options: [
          {
            id: 'q1-a',
            text: "<class 'float'> with value 5.0",
            explanation: 'Correct! Standard division (/) in Python 3 always returns a float, even if the division divides evenly without a remainder.',
            isCorrect: true,
          },
          {
            id: 'q1-b',
            text: "<class 'int'> with value 5",
            explanation: 'Incorrect. Python 2 performed integer division on ints, but Python 3 guarantees that / always yields a float.',
            isCorrect: false,
          },
          {
            id: 'q1-c',
            text: "<class 'float'> with value 5",
            explanation: 'Incorrect. Floating point representations in Python display with a trailing decimal digit (5.0).',
            isCorrect: false,
          },
          {
            id: 'q1-d',
            text: "<class 'int'> if both operands are ints, else <class 'float'>",
            explanation: 'Incorrect. Standard division returns a float regardless of operand integer types.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd3-q2',
        scenario: 'Subsea Navigation Negative Coordinate Translation',
        question: 'An oceanographic probe calculates a grid offset using integer floor division: offset = -11 // 3. What is the value of offset in Python?',
        options: [
          {
            id: 'q2-a',
            text: '-4 — because Python floor division rounds down towards negative infinity.',
            explanation: 'Correct! -11 / 3 is approximately -3.667. Rounding down towards negative infinity yields -4.',
            isCorrect: true,
          },
          {
            id: 'q2-b',
            text: '-3 — because integer division truncates decimal digits towards zero.',
            explanation: 'Incorrect. Truncation towards zero is C behavior. Python strictly rounds towards negative infinity.',
            isCorrect: false,
          },
          {
            id: 'q2-c',
            text: '-3.0 — floor division returns a float when operating on negative integers.',
            explanation: 'Incorrect. When both operands are integers, // returns an integer.',
            isCorrect: false,
          },
          {
            id: 'q2-d',
            text: 'TypeError — floor division cannot be applied to negative numbers.',
            explanation: 'Incorrect. Negative numbers are fully supported in floor division.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd3-q3',
        scenario: 'Cryptographic Hash Buffer Remainder Algebra',
        question: 'According to Python\'s mathematical modulo invariant a = (a // b) * b + (a % b), what does -11 % 3 evaluate to?',
        options: [
          {
            id: 'q3-a',
            text: '1 — because -11 = (-4 * 3) + 1.',
            explanation: 'Correct! By definition, r = a - (a // b) * b. With a = -11 and b = 3: -11 - (-4 * 3) = -11 - (-12) = 1.',
            isCorrect: true,
          },
          {
            id: 'q3-b',
            text: '-2 — because remainder takes the negative sign of the dividend.',
            explanation: 'Incorrect. In Python, the remainder shares the sign of the divisor b. Since divisor 3 is positive, remainder must be >= 0.',
            isCorrect: false,
          },
          {
            id: 'q3-c',
            text: '-1 — calculated by taking -11 modulo 3 directly.',
            explanation: 'Incorrect. -1 would violate the invariant (-11 != -3 * 3 - 1).',
            isCorrect: false,
          },
          {
            id: 'q3-d',
            text: '2 — calculated as the absolute remainder.',
            explanation: 'Incorrect. 1 is the unique remainder satisfying the invariant with non-negative sign.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd3-q4',
        scenario: 'High-Performance Supercomputing Exponentiation Pipeline',
        question: 'What is the evaluated result of the nested exponentiation expression: 2 ** 2 ** 3?',
        options: [
          {
            id: 'q4-a',
            text: '256 — because ** is right-associative, evaluating 2 ** (2 ** 3) = 2 ** 8 = 256.',
            explanation: 'Correct! Exponentiation groups right-to-left in Python, meaning 2 ** 3 is calculated first.',
            isCorrect: true,
          },
          {
            id: 'q4-b',
            text: '64 — because operators evaluate from left to right as (2 ** 2) ** 3 = 4 ** 3 = 64.',
            explanation: 'Incorrect. Exponentiation is right-associative; it does not group left-to-right.',
            isCorrect: false,
          },
          {
            id: 'q4-c',
            text: '512 — because 2 ** (3 ** 2).',
            explanation: 'Incorrect. The operands are 2, 2, 3, which yields 2 ** (2 ** 3) = 2 ** 8 = 256.',
            isCorrect: false,
          },
          {
            id: 'q4-d',
            text: '12 — because the powers are added together.',
            explanation: 'Incorrect. Powers are not added when exponentiating power expressions.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd3-q5',
        scenario: 'Air Quality Index Telemetry Threshold Validation',
        question: 'A telemetry script checks sensor readings using: 3 < 5 > 2. How does Python evaluate this chained comparison?',
        options: [
          {
            id: 'q5-a',
            text: 'As (3 < 5) and (5 > 2), evaluating to True.',
            explanation: 'Correct! Chained comparisons in Python implicitly join the relational conditions with an logical and.',
            isCorrect: true,
          },
          {
            id: 'q5-b',
            text: 'As (3 < 5) > 2, which becomes True > 2 -> 1 > 2 -> False.',
            explanation: 'Incorrect. Python does NOT treat comparisons as left-associative boolean reductions like C or JavaScript.',
            isCorrect: false,
          },
          {
            id: 'q5-c',
            text: 'It raises a SyntaxError because multiple inequalities cannot be chained.',
            explanation: 'Incorrect. Chained comparisons are standard, idiomatic Python syntax.',
            isCorrect: false,
          },
          {
            id: 'q5-d',
            text: 'It evaluates only the first comparison (3 < 5) and ignores the second.',
            explanation: 'Incorrect. Both comparisons are evaluated unless short-circuiting stops on a False.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd3-q6',
        scenario: 'Microservices Default Configuration Resolver',
        question: 'Consider the expression: title = "Python" or "Default". What is the exact value bound to title, and why?',
        options: [
          {
            id: 'q6-a',
            text: '"Python" — because or returns the first truthy operand without converting it to a bool.',
            explanation: 'Correct! In Python, or returns the operand that determined truthiness; since "Python" is non-empty (truthy), it is returned immediately.',
            isCorrect: true,
          },
          {
            id: 'q6-b',
            text: 'True — because logical or always returns a boolean True or False.',
            explanation: 'Incorrect. Python\'s and and or operators return operand values, not strict booleans.',
            isCorrect: false,
          },
          {
            id: 'q6-c',
            text: '"Default" — because or returns the last truthy operand.',
            explanation: 'Incorrect. or terminates on the first truthy value encountered.',
            isCorrect: false,
          },
          {
            id: 'q6-d',
            text: '"PythonDefault" — because strings are concatenated across logical operators.',
            explanation: 'Incorrect. Logical operators do not concatenate strings.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd3-q7',
        scenario: 'Fintech Account Ledger Fingerprint Comparison',
        question: 'Two ledger transactions are created independently: tx1 = [1000, "NGN"] and tx2 = [1000, "NGN"]. What do tx1 == tx2 and tx1 is tx2 evaluate to?',
        options: [
          {
            id: 'q7-a',
            text: 'True, False — == compares element values, while is tests memory identity.',
            explanation: 'Correct! The lists have identical contents so tx1 == tx2 is True. Because lists are mutable, they are allocated at distinct memory addresses so tx1 is tx2 is False.',
            isCorrect: true,
          },
          {
            id: 'q7-b',
            text: 'True, True — because Python interns all collections with identical elements.',
            explanation: 'Incorrect. Mutable objects like lists are never interned or shared across independent declarations.',
            isCorrect: false,
          },
          {
            id: 'q7-c',
            text: 'False, False — because tx1 and tx2 have different variable names.',
            explanation: 'Incorrect. Variable names do not determine value equality.',
            isCorrect: false,
          },
          {
            id: 'q7-d',
            text: 'False, True — values differ but memory addresses are reused.',
            explanation: 'Incorrect. The values are completely identical, but memory addresses are distinct.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd3-q8',
        scenario: 'CPython Memory Architecture Optimization Seminar',
        question: 'Why does a = 256; b = 256; a is b evaluate to True in CPython, but a = 1000; b = 1000; a is b may evaluate to False in the interactive REPL?',
        options: [
          {
            id: 'q8-a',
            text: 'CPython pre-allocates and caches small integers in the range [-5, 256] as shared singletons in heap memory.',
            explanation: 'Correct! CPython maintains a global array of singleton integer objects for integers between -5 and 256 inclusive to boost performance.',
            isCorrect: true,
          },
          {
            id: 'q8-b',
            text: 'Numbers larger than 256 cannot be compared with is because of 8-bit integer overflow.',
            explanation: 'Incorrect. Python supports arbitrarily large integers without overflow; this is purely an internal caching optimization.',
            isCorrect: false,
          },
          {
            id: 'q8-c',
            text: '1000 is a floating-point number in CPython memory, which is not hashable.',
            explanation: 'Incorrect. 1000 is an integer, and integers are hashable.',
            isCorrect: false,
          },
          {
            id: 'q8-d',
            text: 'The REPL randomly frees variables with values over 256 to conserve RAM.',
            explanation: 'Incorrect. CPython garbage collection operates on reference counting, not value thresholds.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd3-q9',
        scenario: 'PEP 8 Style Guide Compliance and Sentinel Inspection',
        question: 'According to the official PEP 8 style guide, how should you test whether a variable token is bound to None?',
        options: [
          {
            id: 'q9-a',
            text: 'Using "if token is None:" because None is a singleton object in Python.',
            explanation: 'Correct! PEP 8 states that comparisons to singletons like None should always be done with is or is not, never equality operators.',
            isCorrect: true,
          },
          {
            id: 'q9-b',
            text: 'Using "if token == None:" because == is more readable than is.',
            explanation: 'Incorrect. Classes can override __eq__() and return misleading results; is guarantees testing the singleton directly.',
            isCorrect: false,
          },
          {
            id: 'q9-c',
            text: 'Using "if bool(token) == None:" to convert token first.',
            explanation: 'Incorrect. bool(None) returns False, and False == None is False.',
            isCorrect: false,
          },
          {
            id: 'q9-d',
            text: 'Using "if type(token) == None:" to check its type.',
            explanation: 'Incorrect. type(None) is NoneType, not None.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd3-q10',
        scenario: 'Algebraic Order of Operations Precedence Bug',
        question: 'What is the evaluated output of the expression: print(-3 ** 2)?',
        options: [
          {
            id: 'q1-a',
            text: '-9 — because ** has higher precedence than unary -, evaluating as -(3 ** 2).',
            explanation: 'Correct! In Python\'s operator precedence table, exponentiation (**) binds tighter than the unary negation (-) operator. Thus, 3 ** 2 is 9, and unary - negates it to -9.',
            isCorrect: true,
          },
          {
            id: 'q10-b',
            text: '9 — because squaring any negative number always results in a positive number.',
            explanation: 'Incorrect. To square -3, parentheses are required: (-3) ** 2 = 9.',
            isCorrect: false,
          },
          {
            id: 'q10-c',
            text: 'TypeError — unary minus cannot be directly applied to a power expression.',
            explanation: 'Incorrect. The expression is completely valid syntax.',
            isCorrect: false,
          },
          {
            id: 'q10-d',
            text: '-6 — because -3 multiplied by 2 is -6.',
            explanation: 'Incorrect. ** is exponentiation, not multiplication.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
    ],
  },

  cheatSheet: [
    {
      category: 'Arithmetic Operators & Float Division',
      syntax: '+ , - , * , / , // , % , **',
      description: 'Standard arithmetic operations. In Python 3+, true division (/) ALWAYS returns a float (e.g. 10 / 2 yields 5.0). Floor division (//) rounds down towards negative infinity (-7 // 2 yields -4). Modulo (%) calculates the remainder r = a - (b * (a // b)) and retains the sign of divisor b.',
      example: `# True division always returns float:
print(10 / 2)    # 5.0 (float, not int)
print(7 / 2)     # 3.5

# Floor division rounds towards negative infinity:
print(7 // 2)    # 3
print(-7 // 2)   # -4 (not -3! rounds down)

# Modulo: sign matches divisor:
print(7 % 2)     # 1
print(-7 % 2)    # 1 (divisor 2 is positive)
print(7 % -2)    # -1 (divisor -2 is negative)`,
    },
    {
      category: 'Exponentiation & Right-Associativity',
      syntax: 'base ** exponent (right-to-left evaluation)',
      description: 'Python\'s power operator (**) is right-associative, evaluating right-to-left: 2 ** 3 ** 2 is 2 ** (3 ** 2) = 512, not (2 ** 3) ** 2 = 64. Furthermore, ** binds tighter than unary minus (-), so -3 ** 2 evaluates as -(3 ** 2) = -9. Use parentheses (-3) ** 2 to square negative numbers.',
      example: `# Right-associative exponentiation:
print(2 ** 3 ** 2)   # 512 (2 ** 9), NOT 64 ((2**3)**2)

# Unary minus precedence trap:
print(-3 ** 2)       # -9 (unary - has lower precedence than **)
print((-3) ** 2)     # 9  (explicit parentheses override precedence)`,
    },
    {
      category: 'Compound Assignment Operators',
      syntax: '+= , -= , *= , /= , //= , %= , **=',
      description: 'Compound assignment evaluates the right-hand expression first and updates the variable in-place. For immutable types (int, float, str), this creates and rebinds a new object. For mutable types (list), += invokes __iadd__() mutating in-place.',
      example: `# Accumulating sales in Balogun Market:
daily_sales = 120_000
daily_sales += 45_000     # daily_sales = daily_sales + 45_000
print(f"Total: ₦{daily_sales:,}")  # ₦165,000

# Division compound assignment always casts to float:
units = 20
units /= 4
print(units, type(units)) # 5.0 <class 'float'>`,
    },
    {
      category: 'Comparison Operators & Lexicographical Ordering',
      syntax: '== , != , < , > , <= , >=',
      description: 'Compares operands and returns a strict boolean (True or False). Strings are compared character-by-character based on their Unicode code points (ord()). Python 3 strictly prohibits un-cast comparisons between incompatible types (e.g. "5" > 3 raises TypeError).',
      example: `# Numeric comparisons:
print(10 >= 10)       # True
print(5.0 == 5)       # True (numeric values match)

# Unicode lexicographical order:
print("Apple" < "apple") # True (ord('A')=65 < ord('a')=97)
print("Lagos" < "Kano")  # False ('L' > 'K')

# Incompatible types raise TypeError:
# print("5" > 3)        # TypeError: '>' not supported between 'str' and 'int'`,
    },
    {
      category: 'Chained Comparisons (Short-Circuit Evaluation)',
      syntax: 'low <= val <= high',
      description: 'Python supports natural mathematical chaining such as a < b < c. CPython evaluates this internally as (a < b) and (b < c), but evaluates the middle term b exactly once. If the first comparison is False, subsequent comparisons short-circuit and are never evaluated.',
      example: `jamb_score = 245

# Elegant chained range check (evaluates score once):
if 180 <= jamb_score <= 400:
    print("Candidate qualifies for university admissions screening.")

# Multi-step chained comparisons:
x = 15
print(10 < x < 20 < 100)  # True
print(10 < x > 50)        # False (15 > 50 is False)`,
    },
    {
      category: 'Logical Operators & Non-Boolean Returns',
      syntax: 'and , or , not',
      description: 'Logical operators in Python evaluate truthiness and return the determining operand, not necessarily True or False. "and" returns the first falsy operand, or the last operand if all are truthy. "or" returns the first truthy operand, or the last operand if all are falsy. "not" always returns a strict boolean.',
      example: `# 'or' returns first truthy operand:
print("Lagos" or "Default")    # 'Lagos'
print("" or "Default")         # 'Default' (empty string is falsy)

# 'and' returns first falsy operand or last operand:
print(0 and "Nigeria")         # 0 (falsy)
print("Amina" and 250)         # 250 (both truthy, returns last)

# 'not' always returns strict boolean:
print(not "Hello")             # False
print(not 0)                   # True`,
    },
    {
      category: 'Short-Circuit Evaluation & Guard Idioms',
      syntax: 'guard and action() or value or fallback',
      description: 'Short-circuit evaluation means Python stops evaluating logical expressions as soon as the outcome is certain. In A and B, if A is False, B is never executed. In A or B, if A is True, B is never executed. This enables clean guard expressions against ZeroDivisionError and NoneType errors.',
      example: `# ZeroDivisionError guard idiom:
count = 0
total = 1500
# Safe: (total / count) is never evaluated when count == 0
avg = count != 0 and (total / count)
print(avg)  # False (no ZeroDivisionError raised!)

# Configuration fallback idiom:
custom_port = None
server_port = custom_port or 8080
print(server_port)  # 8080`,
    },
    {
      category: 'Identity (is) vs Equality (==)',
      syntax: 'x == y (value equality) vs x is y (memory identity)',
      description: 'Equality (==) invokes __eq__() to test whether two objects contain the same values. Identity (is) checks whether two variables reference the exact same memory address on the CPython heap (id(a) == id(b)). Two distinct mutable collections can be equal in value while having different identities.',
      example: `# Mutable lists with identical contents:
tx1 = ["TX-101", 5000]
tx2 = ["TX-101", 5000]

print(tx1 == tx2)  # True  (identical values)
print(tx1 is tx2)  # False (distinct memory locations on heap)
print(id(tx1) != id(tx2)) # True

# Aliased reference points to identical address:
tx3 = tx1
print(tx3 is tx1)  # True  (same object identity)`,
    },
    {
      category: 'CPython Small Integer Cache & Singletons',
      syntax: '[-5, 256] cached integers & is None (PEP 8)',
      description: 'CPython maintains a global pre-allocated array of singleton integer objects for numbers in the range [-5, 256]. Within this range, identical integers share memory addresses. Beyond this range, distinct objects may be allocated. Always use "is" or "is not" when checking for singletons like None, True, and False.',
      example: `# CPython small integer cache [-5, 256]:
a = 256
b = 256
print(a is b)  # True (interned singleton in CPython)

# Outside cache (in REPL):
large_a = 1000
large_b = 1000
print(large_a == large_b)  # True (equal values)
# large_a is large_b may evaluate to False depending on code block

# PEP 8 Sentinel check rule:
user_session = None
if user_session is None:   # ALWAYS use 'is None', never '== None'
    print("No active session detected.")`,
    },
    {
      category: 'Bitwise Operators & Binary Flags',
      syntax: '& (AND), | (OR), ^ (XOR), ~ (NOT), << (Left Shift), >> (Right Shift)',
      description: 'Bitwise operators manipulate the underlying binary representation of integers using two\'s complement arithmetic. << n shifts bits left (multiplying by 2**n). >> n shifts bits right (floor dividing by 2**n). Widely used for permission masks, network packet flags, and cryptographic primitives.',
      example: `PERM_READ    = 0b100  # 4
PERM_WRITE   = 0b010  # 2
PERM_EXECUTE = 0b001  # 1

# Combine permissions using bitwise OR:
user_perms = PERM_READ | PERM_WRITE  # 0b110 (6)

# Test permission using bitwise AND:
can_write = bool(user_perms & PERM_WRITE)
print(f"Write permission granted: {can_write}")  # True

# Bit shifting:
print(7 << 2)   # 28 (7 * 2^2)
print(28 >> 2)  # 7  (28 // 2^2)`,
    },
    {
      category: 'Operator Precedence & Grouping Hierarchy',
      syntax: '() > ** > unary +,-,~ > *,/,//,% > +,- > <<,>> > & > ^ > | > comparisons > not > and > or',
      description: 'Python resolves multi-operator expressions using a rigorous precedence hierarchy. Parentheses () have highest priority. Exponentiation (**) is right-associative. Arithmetic precedes comparisons, and comparisons precede logical operators. PEP 8 strongly recommends using explicit parentheses to avoid ambiguity.',
      example: `# Multi-operator evaluation:
# 1. 3 ** 2 = 9
# 2. 4 * 9 = 36
# 3. 10 + 36 = 46
# 4. 46 - 6 = 40
result = 10 + 4 * 3 ** 2 - 6
print(result)  # 40

# PEP 8 clarity: explicit parentheses clarify intent
clean_result = 10 + (4 * (3 ** 2)) - 6
print(clean_result == result)  # True`,
    },
  ],

  sourceNotes: [
    'Derived from Asabeneh Yetayeh\'s 30 Days of Python Day 3 curriculum with modern Python 3.12 visual enhancements.',
    'Section 14 Watch-out: Standard division (/) always returns a float in Python 3+.',
    'Section 14 Watch-out: Floor division (//) rounds down towards negative infinity (e.g. -7 // 2 is -4).',
    'Section 14 Watch-out: Exponentiation (**) is right-associative (2 ** 3 ** 2 == 512).',
    'Section 14 Watch-out: Logical operators and/or return operand values, not strict booleans.',
    'Section 14 Watch-out: Always use "is" and "is not" when testing for None (PEP 8).',
  ],
};
