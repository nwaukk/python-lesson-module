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
      practise: [],
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
        badge: 'interactive',
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
      practise: [],
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
        badge: 'interactive',
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
      practise: [],
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
      practise: [],
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
      practise: [],
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
      practise: [],
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
      practise: [],
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
      practise: [],
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
      practise: [],
    },
  ],

  realWorldLabs: [],
  dayQuiz: {
    title: 'Day 3 Checkpoint Quiz: Operators & Expression Evaluation',
    passingScorePercentage: 80,
    questions: [],
  },

  cheatSheet: [],

  sourceNotes: [
    'Derived from Asabeneh Yetayeh\'s 30 Days of Python Day 3 curriculum with modern Python 3.12 visual enhancements.',
    'Section 14 Watch-out: Standard division (/) always returns a float in Python 3+.',
    'Section 14 Watch-out: Floor division (//) rounds down towards negative infinity (e.g. -7 // 2 is -4).',
    'Section 14 Watch-out: Exponentiation (**) is right-associative (2 ** 3 ** 2 == 512).',
    'Section 14 Watch-out: Logical operators and/or return operand values, not strict booleans.',
    'Section 14 Watch-out: Always use "is" and "is not" when testing for None (PEP 8).',
  ],
};
