/**
 * Day 9: Conditionals (Intermediate Python)
 * Full implementation of Part A (Learn) and Part B (Practise) conforming to Sections 10, 13.2, 13.5 & 14.
 * Includes:
 *  - 9 Detailed Subtopics following the 10-step pedagogical structure
 *  - 18 Reasoning & Scenario Practice Exercises across all 4 tiers (Foundation, Standard, Challenge, Project)
 *    and all 8 interaction types (scenario-mcq, predict-output, fix-the-bug, order-the-lines, fill-the-gaps,
 *    write-code, theory-reasoning, explain-the-trace)
 *  - 2 Enterprise Real-World Labs (Tiered KYC Compliance Pipeline & E-Commerce Checkout Rules Engine)
 *  - Capstone Mini-Project (ApexScholar Multi-Criteria Admissions Decision Engine)
 *  - 10-Question Comprehensive Checkpoint Mastery Quiz (80% passing threshold)
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_9_MODULE: DayModule = {
  schemaVersion: 1,
  number: 9,
  title: "Conditionals",
  level: "intermediate",
  sourceUrl: "https://github.com/Asabeneh/30-Days-Of-Python/tree/master/09_Day_Conditionals",
  estimatedMinutes: 80,
  prerequisites: [1, 2, 3, 4, 5, 6, 7, 8],
  objectives: [
    "Master the if statement syntax, boolean expression evaluation, and colon-indentation block rules",
    "Implement binary mutually exclusive decisions using if and else branches",
    "Construct multi-way decision trees using sequential if, elif, and else ladders",
    "Diagnose and prevent overlapping range bugs and elif ordering mistakes (WAEC grade boundaries)",
    "Write elegant single-line ternary conditional expressions (x if condition else y)",
    "Navigate nested conditional blocks, guard clauses, and control cyclomatic complexity",
    "Harness logical operators (and, or, not), operator precedence, and short-circuit evaluation optimizations",
    "Master Python truth value testing protocol: distinguish truthy from falsy across all data types",
    "Explore Python 3.10+ structural pattern matching with match and case statements (enrichment)"
  ],
  subtopics: [
    {
      id: "day9-sub1",
      number: 1,
      title: "The if Statement & Boolean Expression Evaluation",
      summary: "Understand how Python executes conditional code blocks when a test expression evaluates to True, and skips execution when False.",
      estimatedMinutes: 7,
      introduce: {
        headline: "Directing Program Flow: The if Statement",
        paragraphs: [
          "In programming, programs rarely execute in a purely linear top-to-bottom sequence. Real-world applications—from financial fraud detection to automated grading—require decision-making capabilities: executing specific blocks of instructions only when designated conditions hold true.",
          "The foundational tool for decision-making in Python is the `if` statement. The syntax consists of the keyword `if`, followed by a conditional expression (a test that resolves to a boolean `True` or `False`), a mandatory terminating colon `:`, and an indented suite (block) of code.",
          "Indentation defines block scope: unlike languages that use curly braces `{ }`, Python's compiler relies strictly on uniform whitespace (typically 4 spaces) to identify instructions belonging to the conditional block. When the test evaluates to `True`, the indented statements execute; when `False`, Python skips the block entirely and continues with the next statement at the outer indentation level."
        ],
        keyTerms: [
          {
            term: "Conditional Statement",
            definition: "A language construct that branches program execution based on the boolean result of an expression."
          },
          {
            term: "Indented Suite",
            definition: "The block of statements indented by 4 spaces following a colon that executes only if the condition evaluates to True."
          },
          {
            term: "Boolean Test Expression",
            definition: "Any expression yielding True or False, typically formulated with comparison operators (==, !=, <, <=, >, >=)."
          }
        ],
        bulletPoints: [
          "The if statement evaluates a test expression; if True, its indented block executes.",
          "A colon (:) after the test expression is required syntax.",
          "Python uses 4-space indentation to determine which lines belong to the conditional block.",
          "If the expression evaluates to False, the indented body is bypassed completely."
        ]
      },
      visualise: {
        type: "flowchart-tracer",
        title: "Flowchart & Branch Tracer",
        badge: "simulation",
        description: "Observe execution flow branch through conditional blocks as score values change.",
        initialConfig: {
          testValue: 75
        }
      },
      code: [
        {
          title: "Simple if Statements in Action",
          runMode: "real",
          code: "# 1. Basic if condition testing temperature in Nairobi\ntemperature_celsius = 28\n\nprint(\"Checking atmospheric conditions...\")\nif temperature_celsius > 25:\n    print(f\"Alert: High temperature detected ({temperature_celsius}°C).\")\n    print(\"Activate server cooling fans.\")\n\nprint(\"Monitoring routine complete.\")\n\n# 2. Testing when condition is False\nserver_load = 0.42  # 42% CPU utilization\nif server_load > 0.85:\n    print(\"Warning: High server load! Triggering auto-scale.\")\n\nprint(f\"Current server load is stable at {server_load * 100:.1f}%.\")",
          expectedOutput: "Checking atmospheric conditions...\nAlert: High temperature detected (28°C).\nActivate server cooling fans.\nMonitoring routine complete.\nCurrent server load is stable at 42.0%."
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: "temperature_celsius = 28",
          internalEffect: "Binds identifier 'temperature_celsius' to int object 28 in local frame."
        },
        {
          step: 2,
          codeLine: 5,
          instruction: "if temperature_celsius > 25:",
          internalEffect: "Computes comparison 28 > 25 -> True. PVM branches to line 6."
        },
        {
          step: 3,
          codeLine: 6,
          instruction: "print(...)",
          internalEffect: "Executes indented block: prints alert and cooling fan instructions."
        },
        {
          step: 4,
          codeLine: 12,
          instruction: "if server_load > 0.85:",
          internalEffect: "Computes 0.42 > 0.85 -> False. PVM skips lines 13 and jumps directly to line 15."
        }
      ],
      apply: {
        domain: "Fintech & Banking Systems",
        contextTitle: "ATM Withdrawal Balance Guard",
        scenario: "Verify that an ATM withdrawal request does not exceed the customer's available checking account balance before dispensing cash.",
        code: "account_balance = 85000.00\nwithdrawal_amount = 20000.00\natm_fee = 100.00\ntotal_deduction = withdrawal_amount + atm_fee\n\nif total_deduction <= account_balance:\n    account_balance -= total_deduction\n    print(f\"Dispensing: NGN {withdrawal_amount:,.2f}\")",
        outcome: "Dispensing: NGN 20,000.00"
      },
      commonMistakes: [
        {
          label: "Using Single Equals (=) Instead of Double Equals (==)",
          erroneousCode: "user_role = 'staff'\nif user_role = 'admin':  # SyntaxError!\n    print('Access granted')",
          errorMessage: "SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?",
          explanation: "In Python, '=' is assignment, not equality. Inside an if header, '=' triggers a compile-time SyntaxError.",
          correctedCode: "user_role = 'staff'\nif user_role == 'admin':\n    print('Access granted')"
        },
        {
          label: "Omitting the Mandatory Colon (:)",
          erroneousCode: "age = 20\nif age >= 18\n    print('Eligible to vote')",
          errorMessage: "SyntaxError: expected ':'",
          explanation: "Every conditional compound statement header must conclude with a colon ':' to open an indented suite.",
          correctedCode: "age = 20\nif age >= 18:\n    print('Eligible to vote')"
        }
      ],
      sourceNotes: "Covers the fundamental if statement from Asabeneh's 30 Days of Python Day 9, enhanced with memory execution tracing and syntax error diagnostics.",
      practise: [
        {
          id: "d9-s1-ex1",
          title: "Syntax Validation: The Equality vs Assignment Trap",
          type: "scenario-mcq",
          tier: "foundation",
          points: 10,
          contextScenario: "Payment Gateway Webhook Dispatcher",
          prompt: "A software engineer writes the following header to verify a transaction status: `if tx_status = 'COMPLETED':`. What happens when Python interprets this script?",
          options: [
            {
              id: "opt-1",
              text: "Python raises a compile-time SyntaxError because single '=' is the assignment operator, not an equality test.",
              explanation: "Correct! Python strictly disallows statement assignments with '=' inside an if expression to prevent silent assignment bugs.",
              isCorrect: true
            },
            {
              id: "opt-2",
              text: "Python binds 'COMPLETED' to tx_status and always executes the block because non-empty strings are truthy.",
              explanation: "Incorrect. While C/C++ permits this bug, Python's grammar explicitly rejects single '=' assignment in statement headers.",
              isCorrect: false
            },
            {
              id: "opt-3",
              text: "Python raises TypeError: boolean expected, got string.",
              explanation: "Incorrect. The code fails at the lexical parsing stage with SyntaxError before any type checking occurs.",
              isCorrect: false
            },
            {
              id: "opt-4",
              text: "Python executes normally if tx_status was already defined as a string.",
              explanation: "Incorrect. '=' is illegal regardless of whether tx_status exists.",
              isCorrect: false
            }
          ],
          hints: [
            "Remember that single '=' assigns a value, while double '==' tests for equality.",
            "In Python, an assignment statement does not evaluate to a value inside standard if headers.",
            "Look for a SyntaxError indicating an invalid token."
          ]
        },
        {
          id: "d9-s1-ex2",
          title: "Predict Output: Atmospheric Sensor Alert",
          type: "predict-output",
          tier: "standard",
          points: 10,
          prompt: "What is the exact terminal output when executing the following atmospheric monitoring script?",
          traceStepCode: `humidity = 68
pressure_hpa = 1012

if humidity > 70:
    print("Alert: High humidity detected.")
print(f"Current pressure: {pressure_hpa} hPa.")`,
          options: [
            {
              id: "opt-1",
              text: "Current pressure: 1012 hPa.",
              explanation: "Correct! The condition 68 > 70 evaluates to False, so the indented alert is skipped entirely. Execution continues at line 6.",
              isCorrect: true
            },
            {
              id: "opt-2",
              text: "Alert: High humidity detected.\nCurrent pressure: 1012 hPa.",
              explanation: "Incorrect. 68 > 70 is False; the alert does not print.",
              isCorrect: false
            },
            {
              id: "opt-3",
              text: "Alert: High humidity detected.",
              explanation: "Incorrect. The condition is False and the subsequent print statement is outside the if block.",
              isCorrect: false
            },
            {
              id: "opt-4",
              text: "No output is produced.",
              explanation: "Incorrect. The second print statement is unindented and runs unconditionally.",
              isCorrect: false
            }
          ],
          hints: [
            "Evaluate 68 > 70: does it evaluate to True or False?",
            "Notice which print statement is indented by 4 spaces and which is aligned at the root level.",
            "Unindented code executes sequentially regardless of whether the preceding if block ran."
          ]
        }
      ]
    },
    {
      id: "day9-sub2",
      number: 2,
      title: "Binary Branching: if and else with Mutual Exclusion",
      summary: "Implement two-way decision bifurcations where exactly one of two alternative code paths is guaranteed to execute.",
      estimatedMinutes: 8,
      introduce: {
        headline: "Mutual Exclusion: The if-else Duality",
        paragraphs: [
          "While a solitary `if` statement executes code only when a condition is met (doing nothing otherwise), many real-world scenarios require an alternative response when the condition fails. For example: a password is either valid OR rejected; an account is either active OR suspended.",
          "The `else` statement pairs with an `if` to provide a fallback branch. Together, `if...else` forms a mutually exclusive binary fork: if the condition is `True`, the `if` body runs and the `else` body is skipped; if `False`, the `if` body is bypassed and the `else` body runs.",
          "An `else` clause never takes an independent conditional expression—it acts as an exhaustive catch-all for whenever the preceding `if` condition evaluates to `False`. The `else` keyword must align vertically at the exact same indentation level as its matching `if`."
        ],
        keyTerms: [
          {
            term: "Binary Branching",
            definition: "Dividing program flow into two mutually exclusive paths where one path is guaranteed to execute."
          },
          {
            term: "Mutual Exclusion",
            definition: "The architectural guarantee that under no circumstances can both the if block and the else block execute together."
          },
          {
            term: "Fallback Catch-All",
            definition: "The else block that executes whenever the preceding test evaluates to False."
          }
        ],
        bulletPoints: [
          "if-else provides two mutually exclusive execution branches.",
          "The else clause has no condition of its own; it catches all False evaluations.",
          "Exactly one branch is guaranteed to execute—never both, never neither.",
          "The else keyword must align with the corresponding if at the same indentation level."
        ]
      },
      visualise: {
        type: "flowchart-tracer",
        title: "Binary Branching Flowchart Tracer",
        badge: "simulation",
        description: "Trace binary bifurcations through if and else blocks as test inputs vary.",
        initialConfig: {
          score: 65
        }
      },
      code: [
        {
          title: "Binary if-else Decision Making",
          runMode: "real",
          code: "# 1. Driving license eligibility check in Lagos\napplicant_age = 17\nlegal_driving_age = 18\n\nif applicant_age >= legal_driving_age:\n    print(f\"Status: Approved. You are {applicant_age} years old and eligible to drive.\")\nelse:\n    years_needed = legal_driving_age - applicant_age\n    print(f\"Status: Denied. You are {applicant_age} years old.\")\n    print(f\"Please wait {years_needed} year(s) until you turn {legal_driving_age}.\")\n\n# 2. Number parity testing (Even vs Odd)\nnumber = 47\nif number % 2 == 0:\n    print(f\"{number} is an even integer.\")\nelse:\n    print(f\"{number} is an odd integer.\")",
          expectedOutput: "Status: Denied. You are 17 years old.\nPlease wait 1 year(s) until you turn 18.\n47 is an odd integer."
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 5,
          instruction: "if applicant_age >= legal_driving_age:",
          internalEffect: "Evaluates 17 >= 18 -> False. Skips line 6."
        },
        {
          step: 2,
          codeLine: 7,
          instruction: "else:",
          internalEffect: "Because test was False, control passes unconditionally into the else block."
        },
        {
          step: 3,
          codeLine: 8,
          instruction: "years_needed = legal_driving_age - applicant_age",
          internalEffect: "Calculates 18 - 17 = 1 and prints guidance message."
        },
        {
          step: 4,
          codeLine: 14,
          instruction: "if number % 2 == 0:",
          internalEffect: "Calculates 47 % 2 = 1. Tests 1 == 0 -> False. Branches to else and prints odd."
        }
      ],
      apply: {
        domain: "Cloud Infrastructure",
        contextTitle: "API Rate-Limit Quota Gatekeeper",
        scenario: "Enforce a request quota per minute for a cloud REST API client.",
        code: "requests_made = 58\nrate_limit_per_minute = 60\n\nif requests_made < rate_limit_per_minute:\n    print(f\"HTTP 200 OK: Quota remaining: {rate_limit_per_minute - requests_made}\")\nelse:\n    print(\"HTTP 429 Too Many Requests: Rate limit exceeded.\")",
        outcome: "HTTP 200 OK: Quota remaining: 2"
      },
      commonMistakes: [
        {
          label: "Putting a Condition on an Else Statement",
          erroneousCode: "score = 45\nif score >= 50:\n    print('Pass')\nelse score < 50:  # SyntaxError!\n    print('Fail')",
          errorMessage: "SyntaxError: invalid syntax",
          explanation: "The else keyword does not accept an expression or condition. If you need a secondary condition, use 'elif'.",
          correctedCode: "score = 45\nif score >= 50:\n    print('Pass')\nelse:\n    print('Fail')"
        },
        {
          label: "Misaligned Indentation of else Clause",
          erroneousCode: "if score >= 50:\n    print('Pass')\n    else:  # IndentationError!\n        print('Fail')",
          errorMessage: "IndentationError: unexpected indent",
          explanation: "The 'else' keyword must align exactly with the opening 'if' at the same indentation level, not inside the if block.",
          correctedCode: "if score >= 50:\n    print('Pass')\nelse:\n    print('Fail')"
        }
      ],
      sourceNotes: "Covers binary if-else decision flow from Asabeneh's 30 Days of Python Day 9, enhanced with arithmetic modulo parity testing.",
      practise: [
        {
          id: "d9-s2-ex1",
          title: "Fix the Bug: Condition on Else Statement",
          type: "fix-the-bug",
          tier: "standard",
          points: 10,
          contextScenario: "User Access Control Guard",
          prompt: "The following code raises a SyntaxError because the developer attached a condition to the else keyword. Fix the code so it properly checks if user age is at least 18 or older.",
          starterCode: `age = 16
if age >= 18:
    status = "Adult"
else age < 18:
    status = "Minor"
print(status)`,
          solutionCode: `age = 16
if age >= 18:
    status = "Adult"
else:
    status = "Minor"
print(status)`,
          hints: [
            "Look at line 4: what is attached to the 'else' keyword?",
            "Remember that 'else' is an exhaustive fallback that never takes a condition.",
            "Remove 'age < 18' from line 4 so that it reads simply 'else:'."
          ]
        },
        {
          id: "d9-s2-ex2",
          title: "Write Code: Banking Overdraft Fee Decision",
          type: "write-code",
          tier: "challenge",
          points: 15,
          contextScenario: "Core Banking Ledger Overdraft Guard",
          prompt: "Write a function `evaluate_withdrawal(balance, amount)` that checks if `amount <= balance`. If True, subtract amount and return `('APPROVED', balance - amount)`. If False, return `('DECLINED', balance)`.",
          starterCode: `def evaluate_withdrawal(balance, amount):
    # Write your mutually exclusive if-else logic here
    pass`,
          solutionCode: `def evaluate_withdrawal(balance, amount):
    if amount <= balance:
        return ("APPROVED", balance - amount)
    else:
        return ("DECLINED", balance)`,
          testCases: [
            {
              id: "tc1",
              label: "Sufficient funds",
              setup: "assert evaluate_withdrawal(50000, 20000) == ('APPROVED', 30000)",
              expected: "True",
              hidden: false
            },
            {
              id: "tc2",
              label: "Exact balance",
              setup: "assert evaluate_withdrawal(15000, 15000) == ('APPROVED', 0)",
              expected: "True",
              hidden: false
            },
            {
              id: "tc3",
              label: "Insufficient balance",
              setup: "assert evaluate_withdrawal(10000, 25000) == ('DECLINED', 10000)",
              expected: "True",
              hidden: false
            }
          ],
          hints: [
            "Use 'if amount <= balance:' to check whether the customer has enough funds.",
            "Return a 2-tuple: ('APPROVED', balance - amount) inside the if block.",
            "Use an 'else:' block to return ('DECLINED', balance) when funds are insufficient."
          ]
        }
      ]
    },
    {
      id: "day9-sub3",
      number: 3,
      title: "Multi-Way Sequential Branching: if, elif, and else",
      summary: "Construct multi-path decision ladders where Python evaluates conditions in strict sequential order from top to bottom.",
      estimatedMinutes: 9,
      introduce: {
        headline: "Multi-Way Decisions: The elif Keyword",
        paragraphs: [
          "When decision logic requires choosing among three or more mutually exclusive alternatives, nesting multiple `if...else` statements quickly becomes cumbersome and excessively indented. Python provides the `elif` keyword (a contraction of 'else if') to cleanly chain multiple conditions.",
          "The `if...elif...else` ladder evaluates conditions sequentially from top to bottom. As soon as Python encounters a condition that evaluates to `True`, it executes that branch's block and immediately exits the entire chain—skipping all subsequent `elif` and `else` clauses without testing them.",
          "If none of the `if` or `elif` conditions evaluate to `True`, the optional final `else` clause executes. You can chain as many `elif` statements as your logic requires (e.g. handling dozens of commands, status codes, or categorizations)."
        ],
        keyTerms: [
          {
            term: "elif (Else If)",
            definition: "A chained conditional clause evaluated only if all preceding if and elif conditions were False."
          },
          {
            term: "Sequential Evaluation",
            definition: "The top-down evaluation of conditions in the order written, stopping at the first True expression."
          },
          {
            term: "Short-Circuit Branch Exit",
            definition: "The automatic termination of the entire conditional chain once any single branch executes."
          }
        ],
        bulletPoints: [
          "elif allows multi-way branching without deep, unreadable nesting.",
          "Conditions are tested strictly in top-to-bottom sequence.",
          "The first condition evaluating to True executes its block; all subsequent branches are skipped.",
          "The trailing else clause is optional and acts as a universal fallback."
        ]
      },
      visualise: {
        type: "flowchart-tracer",
        title: "Multi-Way elif Ladder Tracer",
        badge: "simulation",
        description: "Watch sequential evaluation halt on the first truthful branch in an elif ladder.",
        initialConfig: {
          testValue: 55
        }
      },
      code: [
        {
          title: "Multi-Way HTTP Status Code Classifier",
          runMode: "real",
          code: "# Classify server response code using an if-elif-else ladder\nhttp_status = 404\n\nif http_status == 200:\n    category = \"Success: Resource retrieved successfully\"\nelif http_status == 201:\n    category = \"Created: Resource created successfully\"\nelif http_status == 400:\n    category = \"Client Error: Bad request payload\"\nelif http_status == 401:\n    category = \"Client Error: Authentication token required\"\nelif http_status == 403:\n    category = \"Client Error: Forbidden access to resource\"\nelif http_status == 404:\n    category = \"Client Error: Endpoint or entity not found\"\nelif http_status == 500:\n    category = \"Server Error: Internal server exception\"\nelse:\n    category = f\"Unknown status code ({http_status})\"\n\nprint(f\"HTTP Status {http_status} -> {category}\")",
          expectedOutput: "HTTP Status 404 -> Client Error: Endpoint or entity not found"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: "if http_status == 200:",
          internalEffect: "Tests 404 == 200 -> False. Proceeds to first elif."
        },
        {
          step: 2,
          codeLine: 14,
          instruction: "elif http_status == 404:",
          internalEffect: "Tests 404 == 404 -> True! Assigns category string to local variable."
        },
        {
          step: 3,
          codeLine: 16,
          instruction: "elif http_status == 500: ... else: ...",
          internalEffect: "Bypassed completely! Ladder short-circuits and jumps directly to line 21."
        },
        {
          step: 4,
          codeLine: 21,
          instruction: "print(...)",
          internalEffect: "Outputs the matched category string."
        }
      ],
      apply: {
        domain: "Meteorology & Seasons",
        contextTitle: "Season Identifier from Month",
        scenario: "Map a given calendar month name to its corresponding climate season in temperate zones.",
        code: "month = \"October\"\nmonth_lower = month.lower()\n\nif month_lower in [\"december\", \"january\", \"february\"]:\n    season = \"Winter\"\nelif month_lower in [\"march\", \"april\", \"may\"]:\n    season = \"Spring\"\nelif month_lower in [\"june\", \"july\", \"august\"]:\n    season = \"Summer\"\nelif month_lower in [\"september\", \"october\", \"november\"]:\n    season = \"Autumn\"\nelse:\n    season = \"Invalid month\"\n\nprint(f\"{month} falls in {season}.\")",
        outcome: "October falls in Autumn."
      },
      commonMistakes: [
        {
          label: "Writing Multiple Independent if Statements Instead of elif",
          erroneousCode: "score = 85\nif score >= 75:\n    grade = 'A'\nif score >= 50:  # Runs regardless! Overwrites grade!\n    grade = 'C'",
          explanation: "Independent 'if' statements are ALL evaluated unconditionally. Using 'elif' ensures that once a higher-priority branch matches, lower branches are skipped.",
          correctedCode: "score = 85\nif score >= 75:\n    grade = 'A'\nelif score >= 50:\n    grade = 'C'"
        }
      ],
      sourceNotes: "Covers if-elif-else chaining from Asabeneh's 30 Days of Python Day 9, enhanced with HTTP status classification and season mapping.",
      practise: [
        {
          id: "d9-s3-ex1",
          title: "Order the Lines: Parsons HTTP Status Classifier",
          type: "order-the-lines",
          tier: "standard",
          points: 10,
          contextScenario: "REST API Response Status Handler",
          prompt: "Reorder these jumbled lines to form a clean if-elif-else ladder classifying an HTTP status code.",
          jumbledLines: [
            { id: "line-1", code: "if code == 200:", indent: 0 },
            { id: "line-2", code: '    return "OK"', indent: 1 },
            { id: "line-3", code: "elif code == 404:", indent: 0 },
            { id: "line-4", code: '    return "Not Found"', indent: 1 },
            { id: "line-5", code: "else:", indent: 0 },
            { id: "line-6", code: '    return "Other"', indent: 1 }
          ],
          correctLineOrder: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6"],
          hints: [
            "Start with the primary 'if code == 200:' statement at 0 indentation.",
            "Follow each branch header with its indented return statement.",
            "End with 'else:' and its fallback return 'Other'."
          ]
        },
        {
          id: "d9-s3-ex2",
          title: "Fill the Gaps: Traffic Light Controller",
          type: "fill-the-gaps",
          tier: "challenge",
          points: 10,
          contextScenario: "Autonomous Vehicle Vision Pipeline",
          prompt: "Complete the traffic light decision logic by filling in the missing conditional keywords and comparison operators.",
          gaps: [
            { id: "gap-1", beforeText: "", afterText: " color == 'green':", correctAnswer: "if", options: ["if", "elif", "else", "when"] },
            { id: "gap-2", beforeText: "    action = 'GO'\n", afterText: " color == 'yellow':", correctAnswer: "elif", options: ["elif", "else", "if", "or"] },
            { id: "gap-3", beforeText: "    action = 'SLOW'\n", afterText: " color == 'red':", correctAnswer: "elif", options: ["elif", "else", "if", "not"] },
            { id: "gap-4", beforeText: "    action = 'STOP'\n", afterText: ":\n    action = 'FLASH_YELLOW'", correctAnswer: "else", options: ["else", "elif", "if", "default"] }
          ],
          hints: [
            "The initial test of a conditional ladder always begins with 'if'.",
            "Subsequent alternate tests use 'elif'.",
            "The final catch-all branch that has no condition is 'else:'."
          ]
        }
      ]
    },
    {
      id: "day9-sub4",
      number: 4,
      title: "Order of Conditions & Overlapping Thresholds: The WAEC Grade Boundaries Trap",
      summary: "Understand why order matters in sequential decision chains, and diagnose how ascending conditions cause catastrophic misgrading bugs.",
      estimatedMinutes: 9,
      introduce: {
        headline: "Sequential Branching & Range Overlap Pitfalls",
        paragraphs: [
          "Because Python evaluates `if...elif...else` ladders from top to bottom and exits at the first `True` condition, the logical order in which you write conditions is critical whenever numerical ranges overlap.",
          "Consider checking whether a student achieved an A, B, C, or Pass on an exam. If a student scored 90%, they technically satisfy `score >= 40` (Pass), `score >= 50` (Credit), AND `score >= 75` (Distinction). If you place the lowest threshold `score >= 40` at the top of your ladder, every single student scoring 40 or higher will receive a Pass, and the Distinction branch will become unreachable dead code!",
          "Rule for Numerical Thresholds: When testing inclusive minimum thresholds (`>=` or `>`), you MUST order conditions from most restrictive to least restrictive (descending order). Conversely, when testing upper ceilings (`<=` or `<`), you MUST order conditions from lowest ceiling to highest ceiling (ascending order)."
        ],
        keyTerms: [
          {
            term: "Range Overlap",
            definition: "A scenario where a single input value satisfies the boolean conditions of multiple branches simultaneously."
          },
          {
            term: "Dead Code (Unreachable Branch)",
            definition: "Code that can never execute because an earlier, broader condition always intercepts execution first."
          },
          {
            term: "Descending Threshold Rule",
            definition: "The requirement to test highest >= thresholds first (e.g. 75, then 70, then 60) so specific cases match before general fallbacks."
          }
        ],
        bulletPoints: [
          "Python halts at the FIRST matching condition; later branches are ignored.",
          "When using >=, conditions must descend from highest threshold to lowest.",
          "Testing score >= 40 before score >= 75 incorrectly classifies high achievers as barely passing.",
          "Always test edge boundary values (e.g. 39, 40, 74, 75) when verifying grade ladders."
        ]
      },
      visualise: {
        type: "grade-boundaries",
        title: "WAEC Grade Boundaries & Elif Order Inspector",
        badge: "simulation",
        description: "Compare correct descending order vs broken ascending order on candidate exam scores.",
        initialConfig: {
          score: 85,
          mode: "correct"
        }
      },
      code: [
        {
          title: "WAEC Grade Calculator: Correct vs Broken Ordering",
          runMode: "real",
          code: "# WAEC West African Examinations Council Grading Scale:\n# 75-100: A1 (Excellent) | 70-74: B2 | 65-69: B3 | 60-64: C4\n# 55-59: C5 | 50-54: C6 | 45-49: D7 | 40-44: E8 | 0-39: F9 (Fail)\n\nscore = 88\n\n# 1. CORRECT IMPLEMENTATION: Descending order (Highest first)\ndef grade_student_correct(s):\n    if s >= 75:\n        return \"A1 (Excellent)\"\n    elif s >= 70:\n        return \"B2 (Very Good)\"\n    elif s >= 65:\n        return \"B3 (Good)\"\n    elif s >= 50:\n        return \"C6 (Credit)\"\n    elif s >= 40:\n        return \"E8 (Pass)\"\n    else:\n        return \"F9 (Fail)\"\n\n# 2. BROKEN BUGGY IMPLEMENTATION: Ascending order (Lowest first)\ndef grade_student_buggy(s):\n    if s >= 40:\n        return \"E8 (Pass)\"  # TRAP! 88 >= 40 is True!\n    elif s >= 50:\n        return \"C6 (Credit)\"\n    elif s >= 75:\n        return \"A1 (Excellent)\"  # DEAD CODE!\n    else:\n        return \"F9 (Fail)\"\n\nprint(f\"Candidate Score: {score}\")\nprint(\"Correct System: \", grade_student_correct(score))\nprint(\"Buggy System:   \", grade_student_buggy(score))",
          expectedOutput: "Candidate Score: 88\nCorrect System:  A1 (Excellent)\nBuggy System:    E8 (Pass)"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 8,
          instruction: "def grade_student_correct(s): if s >= 75: return 'A1'",
          internalEffect: "Correct ladder checks 88 >= 75 first -> True. Immediately returns 'A1 (Excellent)'."
        },
        {
          step: 2,
          codeLine: 23,
          instruction: "def grade_student_buggy(s): if s >= 40: return 'E8'",
          internalEffect: "Buggy ladder tests 88 >= 40 first. Because 88 is >= 40, returns 'E8'!"
        },
        {
          step: 3,
          codeLine: 26,
          instruction: "elif s >= 75: return 'A1'",
          internalEffect: "Because the earlier branch returned, line 27 can NEVER execute for any score >= 75."
        }
      ],
      apply: {
        domain: "E-Commerce Wholesale",
        contextTitle: "Tiered Volume Discount Calculator",
        scenario: "Award tiered volume discounts to wholesale retail buyers based on total order valuation.",
        code: "order_total = 125000.00\nif order_total >= 100000.00:\n    rate = 0.20\nelif order_total >= 50000.00:\n    rate = 0.10\nelse:\n    rate = 0.00\nprint(f\"Discount: {rate * 100:.0f}%\")",
        outcome: "Discount: 20%"
      },
      commonMistakes: [
        {
          label: "Inverted Threshold Order Creating Dead Code",
          erroneousCode: "if score >= 0:\n    grade = 'F'\nelif score >= 50:\n    grade = 'C'  # Unreachable!",
          explanation: "Since every valid non-negative test score is >= 0, the first branch always triggers, preventing higher grades from ever being reached.",
          correctedCode: "if score >= 50:\n    grade = 'C'\nelif score >= 0:\n    grade = 'F'"
        }
      ],
      sourceNotes: "Implements the signature WAEC Grade Boundaries simulation specified in Section 14 of the Master Specification.",
      practise: [
        {
          id: "d9-s4-ex1",
          title: "Explain the Trace: The Misgraded WAEC Candidate",
          type: "explain-the-trace",
          tier: "standard",
          points: 10,
          contextScenario: "Examination Board Software Audit",
          prompt: "A candidate scores 94 on their Physics paper. Explain why the following code returns 'Pass' instead of 'A1 Distinction'.",
          traceStepCode: `def grade(score):
    if score >= 40:
        return "Pass"
    elif score >= 75:
        return "A1 Distinction"
    return "Fail"`,
          traceQuestion: "Why did the function return 'Pass' for score 94?",
          options: [
            {
              id: "opt-1",
              text: "Because Python tests score >= 40 first; 94 >= 40 is True, so it returns 'Pass' and exits without ever checking 94 >= 75.",
              explanation: "Correct! Python stops at the first True branch in an if-elif ladder. Since 94 >= 40 is True, 'Pass' is returned immediately.",
              isCorrect: true
            },
            {
              id: "opt-2",
              text: "Because the compiler automatically defaults to the branch with the lowest threshold value.",
              explanation: "Incorrect. Python does not choose branches based on threshold values; it evaluates in chronological top-to-bottom order.",
              isCorrect: false
            },
            {
              id: "opt-3",
              text: "Because 'A1 Distinction' contains a space, causing a string parse error.",
              explanation: "Incorrect. Strings can contain any arbitrary characters.",
              isCorrect: false
            },
            {
              id: "opt-4",
              text: "Because there is no else clause before return 'Fail'.",
              explanation: "Incorrect. The top-level return 'Fail' is syntactically valid as an implicit fallback.",
              isCorrect: false
            }
          ],
          hints: [
            "Step through line 2: does 94 satisfy 'score >= 40'?",
            "What happens once a function executes a 'return' statement inside an if block?",
            "Does execution continue to the elif on line 4 after line 3 returns?"
          ]
        },
        {
          id: "d9-s4-ex2",
          title: "Scenario Analysis: Fixing Broken Loyalty Tier Order",
          type: "scenario-mcq",
          tier: "challenge",
          points: 15,
          contextScenario: "Fintech Cash-Back Rewards Pipeline",
          prompt: "A digital wallet rewards users based on monthly spend. A junior developer ordered the tiers as: `spend >= 10000: 1%`, `spend >= 50000: 3%`, `spend >= 100000: 5%`. How should this ladder be refactored to ensure high spenders receive 5% cash-back?",
          options: [
            {
              id: "opt-1",
              text: "Reverse the order descending: check spend >= 100000 first (5%), then spend >= 50000 (3%), and finally spend >= 10000 (1%).",
              explanation: "Correct! Testing >= conditions in descending order ensures that a user spending 150,000 matches 100000 first, receiving the proper 5% tier.",
              isCorrect: true
            },
            {
              id: "opt-2",
              text: "Change all 'elif' keywords to independent 'if' statements.",
              explanation: "Incorrect. That would cause all matching conditions to run, and the last 1% check would overwrite the 5% reward!",
              isCorrect: false
            },
            {
              id: "opt-3",
              text: "Add an 'and spend <= 10000' constraint to the highest branch.",
              explanation: "Incorrect. That would prevent spends over 10000 from matching.",
              isCorrect: false
            },
            {
              id: "opt-4",
              text: "Invert the comparison to spend < 10000.",
              explanation: "Incorrect. Inverting to < without restructuring alters the entire business rule.",
              isCorrect: false
            }
          ],
          hints: [
            "Remember the Golden Rule of >= thresholds: most restrictive (highest number) first.",
            "If someone spends 150,000, which branch do we want them to enter?",
            "Descending order allows specific top tiers to claim their values before general fallbacks."
          ]
        }
      ]
    },
    {
      id: "day9-sub5",
      number: 5,
      title: "Short-Hand Conditional Expressions: The Ternary Operator",
      summary: "Write concise, inline conditional expressions using Python's 'value_if_true if condition else value_if_false' syntax.",
      estimatedMinutes: 7,
      introduce: {
        headline: "Compact Decisions: The Ternary Expression",
        paragraphs: [
          "Often, a conditional statement is used merely to assign a single variable or return a value based on a condition. Writing a full 4-line `if...else` block for a simple assignment can feel verbose and interrupt the visual flow of clean code.",
          "Python provides a compact syntax known as a **conditional expression** (often referred to as the ternary operator): `x = true_value if condition else false_value`. Note the distinct English-like word order: the expression to evaluate when `True` comes FIRST, followed by `if condition`, followed by `else false_value`.",
          "Unlike an `if` statement (which is a statement and does not produce a value), a conditional expression is an expression—meaning it evaluates to an object and can be placed on the right-hand side of assignments, inside return statements, or inside f-strings and list comprehensions."
        ],
        keyTerms: [
          {
            term: "Conditional Expression",
            definition: "An inline expression with syntax 'true_val if condition else false_val' that resolves directly to an object."
          },
          {
            term: "Ternary Operator",
            definition: "An operator taking three operands: the True value, the condition, and the False value."
          },
          {
            term: "Statement vs Expression",
            definition: "A statement performs an action (e.g. if:), whereas an expression computes and evaluates to a value."
          }
        ],
        bulletPoints: [
          "Syntax: result = value_if_true if condition else value_if_false.",
          "The else clause is strictly mandatory in conditional expressions.",
          "Can be embedded directly inside function arguments, f-strings, and return statements.",
          "Reserve for simple single-condition assignments to maintain high readability."
        ]
      },
      visualise: {
        type: "expression-tree",
        title: "Ternary Conditional Expression Visualizer",
        badge: "simulation",
        description: "Visualize how Python evaluates the central condition before branching to the left or right operand.",
        initialConfig: {
          expression: "approved if score >= 50 else rejected"
        }
      },
      code: [
        {
          title: "Ternary Conditional Expressions vs Traditional if-else",
          runMode: "real",
          code: "# 1. Traditional 4-line if-else assignment\naccount_balance = -250.00\nif account_balance >= 0:\n    status = \"In Good Standing\"\nelse:\n    status = \"Overdrawn\"\nprint(\"Standard if-else status: \", status)\n\n# 2. Pythonic inline conditional expression (Ternary)\nstatus_inline = \"In Good Standing\" if account_balance >= 0 else \"Overdrawn\"\nprint(\"Inline ternary status:    \", status_inline)\n\n# 3. Direct embedding inside f-strings and function calls\nitems_count = 1\nprint(f\"You have {items_count} item{'s' if items_count != 1 else ''} in your cart.\")\n\nitems_count = 3\nprint(f\"You have {items_count} item{'s' if items_count != 1 else ''} in your cart.\")\n\n# 4. Defensive division avoiding ZeroDivisionError\ntotal_revenue = 450000\ncustomers = 0\narpu = total_revenue / customers if customers > 0 else 0.0\nprint(f\"Average Revenue Per User: NGN {arpu:,.2f}\")",
          expectedOutput: "Standard if-else status:  Overdrawn\nInline ternary status:     Overdrawn\nYou have 1 item in your cart.\nYou have 3 items in your cart.\nAverage Revenue Per User: NGN 0.00"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 10,
          instruction: "status_inline = 'In Good Standing' if account_balance >= 0 else 'Overdrawn'",
          internalEffect: "Evaluates middle condition (-250.00 >= 0) -> False. Selects right-hand operand 'Overdrawn'."
        },
        {
          step: 2,
          codeLine: 15,
          instruction: "f\"... item{'s' if items_count != 1 else ''} ...\"",
          internalEffect: "Because items_count == 1, 1 != 1 is False; returns empty string, printing singular 'item'."
        },
        {
          step: 3,
          codeLine: 23,
          instruction: "arpu = total_revenue / customers if customers > 0 else 0.0",
          internalEffect: "Tests customers > 0 -> False. Bypasses division, safely assigning 0.0 without ZeroDivisionError."
        }
      ],
      apply: {
        domain: "Logistics & Delivery",
        contextTitle: "Express Delivery Surcharge Router",
        scenario: "Apply an express delivery surcharge if delivery distance exceeds 10 km.",
        code: "delivery_km = 14.5\nbase_fee = 1500.00\nsurcharge = 800.00 if delivery_km > 10.0 else 0.00\ntotal_fee = base_fee + surcharge\nprint(f\"Total: NGN {total_fee:,.2f}\")",
        outcome: "Total: NGN 2,300.00"
      },
      commonMistakes: [
        {
          label: "Omitting the Mandatory Else Clause in Ternary Syntax",
          erroneousCode: "is_admin = True\nrole = 'Admin' if is_admin  # SyntaxError!",
          errorMessage: "SyntaxError: expected 'else' after conditional expression",
          explanation: "In Python, a conditional expression MUST include an 'else' clause. Without 'else', the compiler cannot determine what value to assign if False.",
          correctedCode: "is_admin = True\nrole = 'Admin' if is_admin else 'Guest'"
        },
        {
          label: "Over-nesting Ternary Expressions into Unreadable Soup",
          erroneousCode: "grade = 'A' if s >= 75 else 'B' if s >= 65 else 'C' if s >= 50 else 'F'",
          explanation: "While chaining ternaries is syntactically legal, PEP 8 advises against it for complex multi-branch logic because it severely degrades readability.",
          correctedCode: "if s >= 75:\n    grade = 'A'\nelif s >= 65:\n    grade = 'B'\nelif s >= 50:\n    grade = 'C'\nelse:\n    grade = 'F'"
        }
      ],
      sourceNotes: "Covers short-hand conditional expressions (ternary operators) from Asabeneh's 30 Days of Python Day 9.",
      practise: [
        {
          id: "d9-s5-ex1",
          title: "Refactor: Convert if-else Block to Inline Ternary",
          type: "scenario-mcq",
          tier: "foundation",
          points: 10,
          contextScenario: "E-Commerce Shipping Calculator",
          prompt: "A developer writes:\n```python\nif cart_total >= 50000:\n    shipping = 0\nelse:\n    shipping = 2500\n```\nWhich of the following is the valid, idiomatic Python ternary expression equivalent?",
          options: [
            {
              id: "opt-1",
              text: "shipping = 0 if cart_total >= 50000 else 2500",
              explanation: "Correct! The syntax is: <value_if_true> if <condition> else <value_if_false>.",
              isCorrect: true
            },
            {
              id: "opt-2",
              text: "shipping = if cart_total >= 50000: 0 else: 2500",
              explanation: "Incorrect. Statements cannot be placed on the right-hand side of assignments.",
              isCorrect: false
            },
            {
              id: "opt-3",
              text: "shipping = cart_total >= 50000 ? 0 : 2500",
              explanation: "Incorrect. Python does not support the '?:' syntax from C/JavaScript.",
              isCorrect: false
            },
            {
              id: "opt-4",
              text: "shipping = 0 if cart_total >= 50000",
              explanation: "Incorrect. The 'else' clause is strictly mandatory in Python conditional expressions.",
              isCorrect: false
            }
          ],
          hints: [
            "Remember the order: value if condition else fallback.",
            "Colons are NOT used in conditional expressions.",
            "An 'else' clause is mandatory."
          ]
        },
        {
          id: "d9-s5-ex2",
          title: "Write Code: Zero-Division Defensive Metric",
          type: "write-code",
          tier: "standard",
          points: 10,
          contextScenario: "SaaS Analytics Dashboard",
          prompt: "Write a function `calculate_click_through_rate(clicks, impressions)` that returns `round((clicks / impressions) * 100, 2)` if `impressions > 0`, and `0.0` otherwise, using a single inline conditional expression.",
          starterCode: `def calculate_click_through_rate(clicks, impressions):
    # Return the metric using a ternary conditional expression
    pass`,
          solutionCode: `def calculate_click_through_rate(clicks, impressions):
    return round((clicks / impressions) * 100, 2) if impressions > 0 else 0.0`,
          testCases: [
            {
              id: "tc1",
              label: "Normal impression volume",
              setup: "assert calculate_click_through_rate(25, 500) == 5.0",
              expected: "True",
              hidden: false
            },
            {
              id: "tc2",
              label: "Zero impressions defensive guard",
              setup: "assert calculate_click_through_rate(0, 0) == 0.0",
              expected: "True",
              hidden: false
            },
            {
              id: "tc3",
              label: "Fractional rate rounding",
              setup: "assert calculate_click_through_rate(3, 70) == 4.29",
              expected: "True",
              hidden: false
            }
          ],
          hints: [
            "Use the format: return <calculated_rate> if impressions > 0 else 0.0",
            "Be sure to multiply by 100 and round to 2 decimal places in the true branch.",
            "Testing impressions > 0 guarantees ZeroDivisionError is never raised."
          ]
        }
      ]
    },
    {
      id: "day9-sub6",
      number: 6,
      title: "Nested Conditionals, Indentation Architecture & Cyclomatic Complexity",
      summary: "Understand nested decision trees, manage multi-level indentation scopes, and refactor deeply nested logic using guard clauses.",
      estimatedMinutes: 9,
      introduce: {
        headline: "Hierarchical Decisions & Guard Clauses",
        paragraphs: [
          "A conditional statement placed inside the block of another conditional statement is called a **nested conditional**. Nesting allows you to model multi-stage validation workflows—for example, verifying whether a user exists, then verifying their password, and finally checking if their account has admin privileges.",
          "Each nested level requires an additional 4 spaces of indentation. While nesting is powerful, deep nesting (3 or more levels, colloquially known as the 'Arrow Anti-Pattern' or the 'Pyramid of Doom') makes code difficult to trace, test, and maintain by increasing its cyclomatic complexity.",
          "Professional Python developers combat excessive nesting using **Guard Clauses**: testing failure or invalid conditions early and exiting immediately (via `return`, `raise`, or `break`), leaving the happy path unindented at the top level of the function."
        ],
        keyTerms: [
          {
            term: "Nested Conditional",
            definition: "An if or else statement located within the indented body of an outer conditional statement."
          },
          {
            term: "Cyclomatic Complexity",
            definition: "A software metric measuring the number of linearly independent paths through program source code."
          },
          {
            term: "Guard Clause",
            definition: "A defensive check at the start of a routine that rejects invalid conditions early to avoid deep nesting."
          }
        ],
        bulletPoints: [
          "Conditionals can be nested inside other conditionals to model multi-stage decisions.",
          "Each nesting level adds 4 spaces of indentation.",
          "Deep nesting ('Pyramid of Doom') hurts readability and increases bug likelihood.",
          "Use guard clauses (early returns or early rejection) to flatten nested structures."
        ]
      },
      visualise: {
        type: "indentation-lab",
        title: "Indentation & Nested Block Scope Lab",
        badge: "simulation",
        description: "Inspect how indentation defines parent-child relationships in nested conditional trees.",
        initialConfig: {
          preset: "nested-conditions"
        }
      },
      code: [
        {
          title: "Nested Conditionals vs Flat Guard Clauses",
          runMode: "real",
          code: "# 1. Deeply Nested Implementation (Arrow Anti-Pattern)\ndef process_transfer_nested(has_account, is_kyc_verified, balance, transfer_amount):\n    if has_account:\n        if is_kyc_verified:\n            if balance >= transfer_amount:\n                return f\"SUCCESS: NGN {transfer_amount:,.2f} transferred.\"\n            else:\n                return \"ERROR: Insufficient funds.\"\n        else:\n            return \"ERROR: KYC verification required.\"\n    else:\n        return \"ERROR: Account does not exist.\"\n\n# 2. Clean Flat Implementation with Guard Clauses (Pythonic)\ndef process_transfer_clean(has_account, is_kyc_verified, balance, transfer_amount):\n    if not has_account:\n        return \"ERROR: Account does not exist.\"\n    if not is_kyc_verified:\n        return \"ERROR: KYC verification required.\"\n    if balance < transfer_amount:\n        return \"ERROR: Insufficient funds.\"\n    \n    # Happy path: Clean, flat, and unnested!\n    return f\"SUCCESS: NGN {transfer_amount:,.2f} transferred.\"\n\nprint(\"Nested result:\", process_transfer_nested(True, True, 50000, 15000))\nprint(\"Clean result: \", process_transfer_clean(True, True, 50000, 15000))\nprint(\"Failed KYC:    \", process_transfer_clean(True, False, 50000, 15000))",
          expectedOutput: "Nested result: SUCCESS: NGN 15,000.00 transferred.\nClean result:  SUCCESS: NGN 15,000.00 transferred.\nFailed KYC:     ERROR: KYC verification required."
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: "if has_account: if is_kyc_verified: ...",
          internalEffect: "Each nested if pushes a new lexical scope level and increases indentation depth by 4 spaces."
        },
        {
          step: 2,
          codeLine: 16,
          instruction: "if not has_account: return ...",
          internalEffect: "Guard clause inverts condition; immediately returns error if account is absent, terminating function."
        },
        {
          step: 3,
          codeLine: 23,
          instruction: "return f\"SUCCESS: NGN {transfer_amount:,.2f} transferred.\"",
          internalEffect: "Guaranteed to execute only when all preceding guards have passed, requiring zero indentation."
        }
      ],
      apply: {
        domain: "Cybersecurity & Identity",
        contextTitle: "Multi-Factor Authentication Verification Engine",
        scenario: "Authenticate a banking user requiring valid password, active SMS OTP, and device authorization.",
        code: "password_valid = True\nsms_otp_matched = True\nuser_role = \"SuperAdmin\"\n\nif password_valid:\n    if sms_otp_matched:\n        print(\"Access Granted: Vault session initiated.\")",
        outcome: "Access Granted: Vault session initiated."
      },
      commonMistakes: [
        {
          label: "Accidental Misaligned Indentation Inside Nested Blocks",
          erroneousCode: "if user_active:\n    if balance > 0:\n        print('Active with balance')\n    print('Inside first if')\n      print('Broken indentation!')  # IndentationError!",
          errorMessage: "IndentationError: unindent does not match any outer indentation level",
          explanation: "In Python, mixing indentation depths within the same block triggers an IndentationError.",
          correctedCode: "if user_active:\n    if balance > 0:\n        print('Active with balance')\n    print('Inside first if')\n    print('Aligned indentation')"
        }
      ],
      sourceNotes: "Covers nested conditionals from Asabeneh's 30 Days of Python Day 9, enhanced with cyclomatic complexity refactoring and guard clause patterns.",
      practise: [
        {
          id: "d9-s6-ex1",
          title: "Theory & Architecture: Guard Clauses vs Arrow Anti-Pattern",
          type: "theory-reasoning",
          tier: "challenge",
          points: 15,
          contextScenario: "Software Architecture Code Review",
          prompt: "A code reviewer flags a 5-level nested `if` statement for refactoring. Why is replacing nested blocks with guard clauses preferred in professional Python codebases?",
          options: [
            {
              id: "opt-1",
              text: "Guard clauses invert edge/error conditions to exit early, reducing indentation depth, lowering cyclomatic complexity, and isolating the happy path.",
              explanation: "Correct! Guard clauses reject invalid inputs immediately, preventing the 'Pyramid of Doom' and making code substantially easier to read and test.",
              isCorrect: true
            },
            {
              id: "opt-2",
              text: "Guard clauses force Python to run in multi-threaded asynchronous mode.",
              explanation: "Incorrect. Guard clauses are purely a software architectural pattern and have nothing to do with threading.",
              isCorrect: false
            },
            {
              id: "opt-3",
              text: "Python's compiler throws a warning if indentation exceeds 3 levels.",
              explanation: "Incorrect. The Python compiler allows arbitrary nesting depths without warning; it is human cognitive load that suffers.",
              isCorrect: false
            },
            {
              id: "opt-4",
              text: "Guard clauses automatically catch unhandled exceptions.",
              explanation: "Incorrect. Guard clauses check conditions; they are not try/except blocks.",
              isCorrect: false
            }
          ],
          hints: [
            "Think about how easy it is to read code that stays near the left margin versus code indented 20 spaces.",
            "Consider what happens when you return early: do you need an 'else' block for the rest of the function?",
            "Focus on readability and cyclomatic complexity."
          ]
        },
        {
          id: "d9-s6-ex2",
          title: "Project: Clean Guard-Based Loan Eligibility Validator",
          type: "write-code",
          tier: "project",
          points: 20,
          contextScenario: "Digital Micro-Lending Risk Engine",
          prompt: "Write a function `validate_loan_application(applicant)` using clean **guard clauses** (no nesting greater than 1 level). Requirements:\n1. If applicant['age'] < 21: return 'REJECTED: Underage'\n2. If applicant['credit_score'] < 600: return 'REJECTED: Low credit score'\n3. If applicant['monthly_income'] < 100000: return 'REJECTED: Insufficient income'\n4. If all pass: return 'APPROVED: Eligible for loan'",
          starterCode: `def validate_loan_application(applicant):
    # Implement using early return guard clauses
    pass`,
          solutionCode: `def validate_loan_application(applicant):
    if applicant.get('age', 0) < 21:
        return 'REJECTED: Underage'
    if applicant.get('credit_score', 0) < 600:
        return 'REJECTED: Low credit score'
    if applicant.get('monthly_income', 0) < 100000:
        return 'REJECTED: Insufficient income'
    return 'APPROVED: Eligible for loan'`,
          testCases: [
            {
              id: "tc1",
              label: "Valid applicant approved",
              setup: "app = {'age': 25, 'credit_score': 720, 'monthly_income': 250000}; assert validate_loan_application(app) == 'APPROVED: Eligible for loan'",
              expected: "True",
              hidden: false
            },
            {
              id: "tc2",
              label: "Underage rejection",
              setup: "app = {'age': 19, 'credit_score': 750, 'monthly_income': 300000}; assert validate_loan_application(app) == 'REJECTED: Underage'",
              expected: "True",
              hidden: false
            },
            {
              id: "tc3",
              label: "Low credit score rejection",
              setup: "app = {'age': 30, 'credit_score': 540, 'monthly_income': 400000}; assert validate_loan_application(app) == 'REJECTED: Low credit score'",
              expected: "True",
              hidden: false
            },
            {
              id: "tc4",
              label: "Low income rejection",
              setup: "app = {'age': 28, 'credit_score': 680, 'monthly_income': 85000}; assert validate_loan_application(app) == 'REJECTED: Insufficient income'",
              expected: "True",
              hidden: false
            }
          ],
          hints: [
            "Write three independent 'if' checks at the root indentation level.",
            "Each check tests a failure condition and immediately returns the respective rejection string.",
            "Place the 'APPROVED: Eligible for loan' return statement at the bottom without any 'else' wrapping."
          ]
        }
      ]
    },
    {
      id: "day9-sub7",
      number: 7,
      title: "Combining Conditions: and, or, not & Short-Circuit Optimization",
      summary: "Combine complex boolean logic using logical operators, master operator precedence, and leverage short-circuiting to prevent crashes.",
      estimatedMinutes: 9,
      introduce: {
        headline: "Compound Logic & Short-Circuiting",
        paragraphs: [
          "Real-world business rules rarely hinge on a single test. Python provides three boolean logical operators to compose compound expressions: `and`, `or`, and `not`.",
          "`and` requires BOTH operands to be true. `or` requires AT LEAST ONE operand to be true. `not` inverts boolean truth (turning `True` into `False` and vice versa). Operator precedence in Python is strictly: `not` first, then `and`, and finally `or`. You should always use parentheses `( )` to make compound evaluation order unambiguous.",
          "The Power of Short-Circuit Evaluation: Python evaluates logical expressions from left to right and stops the moment the overall outcome is mathematically determined. For `and`, if the left operand is `False`, the right operand is NEVER evaluated (because `False and anything` is always `False`). For `or`, if the left operand is `True`, the right operand is NEVER evaluated (because `True or anything` is always `True`). This allows you to place defensive guard checks on the left to safely prevent `ZeroDivisionError`, `IndexError`, or `KeyError` on the right!"
        ],
        keyTerms: [
          {
            term: "Logical and",
            definition: "Returns True only if both left and right expressions evaluate to truthy values."
          },
          {
            term: "Logical or",
            definition: "Returns True if either the left, right, or both expressions evaluate to truthy values."
          },
          {
            term: "Logical not",
            definition: "Unary boolean operator that inverts truth value (not True -> False, not False -> True)."
          },
          {
            term: "Short-Circuit Evaluation",
            definition: "Halting expression evaluation as soon as the definitive boolean result is established."
          }
        ],
        bulletPoints: [
          "Logical operators: and (both True), or (either True), not (inverts truth).",
          "Precedence order: not > and > or (always disambiguate with parentheses).",
          "Short-circuit and: stops if left is False (right is skipped).",
          "Short-circuit or: stops if left is True (right is skipped).",
          "Use short-circuiting defensively: if data and data[0] == 10 prevents IndexError!"
        ]
      },
      visualise: {
        type: "truth-table",
        title: "Boolean Truth Table & Short-Circuit Simulator",
        badge: "simulation",
        description: "Examine truth tables for and, or, and not, and watch right-hand evaluations short-circuit.",
        initialConfig: {
          operator: "and"
        }
      },
      code: [
        {
          title: "Short-Circuit Guarding Against Fatal Errors",
          runMode: "real",
          code: "# 1. Short-circuit and preventing ZeroDivisionError\ntotal_sum = 100\ncount = 0\n\n# Because count != 0 evaluates to False, Python NEVER evaluates total_sum / count!\nif count != 0 and total_sum / count > 10:\n    print(\"Average is greater than 10\")\nelse:\n    print(\"Count is zero; division bypassed safely via short-circuit!\")\n\n# 2. Short-circuit and preventing IndexError on empty lists\nrecords = []\n# records evaluates to False because empty list is falsy; records[0] is never accessed!\nif len(records) > 0 and records[0] == \"ADMIN\":\n    print(\"First record is Admin\")\nelse:\n    print(\"No records found; index lookup bypassed safely.\")\n\n# 3. Compound condition with precedence (not > and > or)\nis_weekend = False\nis_holiday = True\nhas_emergency_ticket = False\n\nif (is_weekend or is_holiday) and not has_emergency_ticket:\n    print(\"Office closed: No emergency ticket on file.\")\nelse:\n    print(\"Operations active.\")",
          expectedOutput: "Count is zero; division bypassed safely via short-circuit!\nNo records found; index lookup bypassed safely.\nOffice closed: No emergency ticket on file."
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 6,
          instruction: "if count != 0 and total_sum / count > 10:",
          internalEffect: "Computes count != 0 -> False. Because operator is 'and', result MUST be False; skips division."
        },
        {
          step: 2,
          codeLine: 14,
          instruction: "if len(records) > 0 and records[0] == 'ADMIN':",
          internalEffect: "Computes 0 > 0 -> False. Halts immediately; prevents IndexError: list index out of range."
        },
        {
          step: 3,
          codeLine: 24,
          instruction: "if (is_weekend or is_holiday) and not has_emergency_ticket:",
          internalEffect: "Evaluates (False or True) -> True. Evaluates not False -> True. True and True -> True; enters block."
        }
      ],
      apply: {
        domain: "Fintech Fraud Prevention",
        contextTitle: "Credit Card Anti-Fraud Velocity Engine",
        scenario: "Flag transaction for biometric step-up authentication if suspicious velocity or international IP occurs.",
        code: "amount = 450000.00\nis_intl = True\nis_new_device = True\ntrans_count = 6\n\nis_flagged = (amount > 200000.00 and is_intl) or (is_new_device and trans_count > 3)\nif is_flagged:\n    print(\"SECURITY ACTION: Step-up biometric challenge required.\")",
        outcome: "SECURITY ACTION: Step-up biometric challenge required."
      },
      commonMistakes: [
        {
          label: "Chaining Or Conditions Without Repeating the Variable",
          erroneousCode: "role = 'editor'\nif role == 'admin' or 'superadmin':  # TRAP! Always True!\n    print('Full access granted')",
          explanation: "In 'role == admin or superadmin', Python evaluates 'superadmin' on its own. Any non-empty string is truthy, so the entire condition is ALWAYS True regardless of role!",
          correctedCode: "role = 'editor'\nif role == 'admin' or role == 'superadmin':\n    print('Full access granted')"
        }
      ],
      sourceNotes: "Covers logical operators and, or, not from Asabeneh's 30 Days of Python Day 9, enhanced with short-circuit error-guarding patterns.",
      practise: [
        {
          id: "d9-s7-ex1",
          title: "Explain the Trace: Short-Circuit Division Protection",
          type: "explain-the-trace",
          tier: "standard",
          points: 10,
          contextScenario: "Financial Math Computation Engine",
          prompt: "Analyze what happens when `denominator = 0` and Python evaluates `if denominator != 0 and (numerator / denominator) > 1.0:`.",
          traceStepCode: `numerator = 500
denominator = 0

if denominator != 0 and (numerator / denominator) > 1.0:
    print("Safe division performed")
else:
    print("Division bypassed cleanly")`,
          traceQuestion: "Why does line 4 NOT raise ZeroDivisionError?",
          options: [
            {
              id: "opt-1",
              text: "Because 'denominator != 0' evaluates to False, causing the 'and' operator to short-circuit and completely skip evaluating the right-hand division.",
              explanation: "Correct! The 'and' operator halts as soon as any operand is False. The right-hand division expression is never evaluated by the PVM.",
              isCorrect: true
            },
            {
              id: "opt-2",
              text: "Because Python's '/' operator automatically returns 0.0 when dividing by zero in conditional expressions.",
              explanation: "Incorrect. Python's division operator strictly raises ZeroDivisionError unless prevented by short-circuiting.",
              isCorrect: false
            },
            {
              id: "opt-3",
              text: "Because parentheses around '(numerator / denominator)' suppress runtime exceptions.",
              explanation: "Incorrect. Parentheses only specify precedence; they do not catch exceptions.",
              isCorrect: false
            },
            {
              id: "opt-4",
              text: "Because 500 is greater than 0.",
              explanation: "Incorrect. The numerator value is irrelevant because the division was never executed.",
              isCorrect: false
            }
          ],
          hints: [
            "Evaluate the left operand: does (0 != 0) equal True or False?",
            "If the left side of 'and' is False, can the overall expression ever be True?",
            "What does Python do with the right operand when the left is False?"
          ]
        },
        {
          id: "d9-s7-ex2",
          title: "Fix the Bug: The Silent 'or string' Truthiness Trap",
          type: "fix-the-bug",
          tier: "challenge",
          points: 15,
          contextScenario: "Access Gatekeeper RBAC Engine",
          prompt: "The following authorization code grants admin rights to EVERY user because of an improper `or` expression. Fix the bug so that only users with role 'admin' or 'superadmin' are granted access.",
          starterCode: `role = "guest"
# Buggy check: grants access even to guest!
if role == "admin" or "superadmin":
    access = "GRANTED"
else:
    access = "DENIED"
print(access)`,
          solutionCode: `role = "guest"
if role == "admin" or role == "superadmin":
    access = "GRANTED"
else:
    access = "DENIED"
print(access)`,
          hints: [
            "Look closely at 'or \"superadmin\"'. What is the boolean value of a non-empty string in Python?",
            "Any non-empty string is truthy, so False or True evaluates to True!",
            "You must explicitly repeat the variable: 'role == \"admin\" or role == \"superadmin\"' (or use 'role in (\"admin\", \"superadmin\")')."
          ]
        }
      ]
    },
    {
      id: "day9-sub8",
      number: 8,
      title: "Python Truth Value Testing: Truthiness, Falsiness & the bool() Protocol",
      summary: "Master Python's built-in truth value testing protocol, understanding why empty containers and zeroes are falsy while populated structures are truthy.",
      estimatedMinutes: 9,
      introduce: {
        headline: "Truth Value Testing: Beyond True and False",
        paragraphs: [
          "In Python, an `if` condition does not require an explicit boolean object (`True` or `False`). Any Python object can be tested for truth value inside an `if` statement or passed to the built-in function `bool()`.",
          "Python classifies every object as either **truthy** or **falsy**. The rules governing truth value testing are codified in Python's official data model protocol:",
          "Falsy Objects: By default, an object is considered True UNLESS its class defines a `__bool__()` method returning False or a `__len__()` method returning 0. Specifically, the following are fundamentally falsy in Python: `None`, `False`, zero in any numeric format (`0`, `0.0`, `0j`), empty sequences (`\"\"`, `()`, `[]`, `range(0)`), and empty mappings (`{}`, `set()`).",
          "Truthy Objects: Everything else is truthy! This includes all non-zero numbers (including negative numbers like `-1`), non-empty strings (including `\" \"` and even the string `\"False\"`!), and any collection containing at least one item (including `[0]`, `(False,)`, and `{None}`)."
        ],
        keyTerms: [
          {
            term: "Truthy",
            definition: "Any object that evaluates to True when passed to bool() or tested in a conditional statement."
          },
          {
            term: "Falsy",
            definition: "An object that evaluates to False in a boolean context (None, 0, False, empty containers)."
          },
          {
            term: "Truth Value Testing Protocol",
            definition: "Python's internal algorithm checking __bool__() and __len__() to determine an object's boolean value."
          }
        ],
        bulletPoints: [
          "Falsy values: None, False, 0, 0.0, '', (), [], {}, set(), range(0).",
          "Truthy values: Any non-zero number (-1, 42), any non-empty string, any non-empty container.",
          "Trap alert: The string 'False' is truthy because len('False') == 5 > 0!",
          "Trap alert: The list [0] is truthy because len([0]) == 1 > 0!",
          "Pythonic style: Use 'if items:' to test for non-empty collections instead of 'if len(items) > 0:'."
        ]
      },
      visualise: {
        type: "truthiness-sorter",
        title: "Python Truth Value Testing & bool() Protocol Sorter",
        badge: "simulation",
        description: "Sort diverse Python values into Truthy and Falsy containers and verify using the bool() protocol.",
        initialConfig: {
          itemsCount: 18
        }
      },
      code: [
        {
          title: "Truthiness in Idiomatic Python",
          runMode: "real",
          code: "# 1. Idiomatic container emptiness checks (PEP 8)\ncart_items = []\n\n# Non-pythonic verbose check:\nif len(cart_items) == 0:\n    print(\"Verbose: Cart is currently empty.\")\n\n# Idiomatic Pythonic check (relying on falsiness of empty list):\nif not cart_items:\n    print(\"Pythonic: Cart is empty (not [] evaluated to True).\")\n\n# 2. Common traps: Strings and populated zero-lists\nstring_zero = \"0\"\nstring_false = \"False\"\nlist_with_zero = [0]\n\nprint(f\"bool('0'):       {bool(string_zero)} (Non-empty string has length 1!)\")\nprint(f\"bool('False'):   {bool(string_false)} (String is not empty!)\")\nprint(f\"bool([0]):       {bool(list_with_zero)} (List has 1 item!)\")\nprint(f\"bool(None):      {bool(None)} (None is always falsy)\")\nprint(f\"bool(-42):       {bool(-42)} (Non-zero integers are always truthy)\")\n\n# 3. Default fallback idioms with 'or'\nuser_nickname = \"\"\ndisplay_name = user_nickname or \"Valued Customer\"\nprint(\"Display name:\", display_name)",
          expectedOutput: "Verbose: Cart is currently empty.\nPythonic: Cart is empty (not [] evaluated to True).\nbool('0'):       True (Non-empty string has length 1!)\nbool('False'):   True (String is not empty!)\nbool([0]):       True (List has 1 item!)\nbool(None):      False (None is always falsy)\nbool(-42):       True (Non-zero integers are always truthy)\nDisplay name: Valued Customer"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 9,
          instruction: "if not cart_items:",
          internalEffect: "Calls cart_items.__len__() -> 0. Evaluates as False. 'not False' -> True; block runs."
        },
        {
          step: 2,
          codeLine: 17,
          instruction: "bool('False')",
          internalEffect: "String has length 5. Because length > 0, bool() returns True."
        },
        {
          step: 3,
          codeLine: 24,
          instruction: "display_name = user_nickname or 'Valued Customer'",
          internalEffect: "Empty string is falsy; 'or' operator evaluates and returns the right operand 'Valued Customer'."
        }
      ],
      apply: {
        domain: "Search Engine Architecture",
        contextTitle: "Defensive Query Parameter Normalizer",
        scenario: "Sanitize optional search query parameters received from an HTTP GET request.",
        code: "raw_search_query = \"   \"\ncleaned_query = raw_search_query.strip()\n\nif cleaned_query:\n    print(f\"Searching for: '{cleaned_query}'\")\nelse:\n    print(\"Empty search parameter. Returning trending topics.\")",
        outcome: "Empty search parameter. Returning trending topics."
      },
      commonMistakes: [
        {
          label: "Expecting 'False' or '0' String Literals to be Falsy",
          erroneousCode: "user_input = 'False'\nif not user_input:\n    print('User opted out')  # NEVER RUNS!\nelse:\n    print('User opted in!')  # Runs unexpectedly!",
          explanation: "In Python, ANY non-empty string is truthy. Even the string '0' or 'False' evaluates to True because len > 0.",
          correctedCode: "user_input = 'False'\nis_opted_in = user_input.strip().lower() in ('true', '1', 'yes')\nif is_opted_in:\n    print('User opted in')\nelse:\n    print('User opted out')"
        }
      ],
      sourceNotes: "Implements the signature Truthiness Sorter simulation specified in Section 14 of the Master Specification.",
      practise: [
        {
          id: "d9-s8-ex1",
          title: "Predict Output: Truthiness Assessment Matrix",
          type: "predict-output",
          tier: "foundation",
          points: 10,
          prompt: "What is the exact printed output of the following truthiness tests?",
          traceStepCode: `items = [bool(""), bool(" "), bool([0]), bool([]), bool(None)]
print([int(x) for x in items])`,
          options: [
            {
              id: "opt-1",
              text: "[0, 1, 1, 0, 0]",
              explanation: "Correct! bool(\"\") is False (0), bool(\" \") is True (1), bool([0]) is True (1), bool([]) is False (0), and bool(None) is False (0).",
              isCorrect: true
            },
            {
              id: "opt-2",
              text: "[0, 0, 0, 0, 0]",
              explanation: "Incorrect. \" \" and [0] are non-empty and therefore truthy (1).",
              isCorrect: false
            },
            {
              id: "opt-3",
              text: "[1, 1, 1, 0, 0]",
              explanation: "Incorrect. The empty string \"\" is falsy (0).",
              isCorrect: false
            },
            {
              id: "opt-4",
              text: "[0, 1, 0, 0, 0]",
              explanation: "Incorrect. [0] is a list containing one element (length 1), so it is truthy (1).",
              isCorrect: false
            }
          ],
          hints: [
            "Empty containers (like \"\" and []) evaluate to False (0).",
            "Any string with at least one character—including a space \" \"—evaluates to True (1).",
            "A list containing elements—even if the element is 0—has length > 0 and is True (1)."
          ]
        },
        {
          id: "d9-s8-ex2",
          title: "Scenario Analysis: Why bool('0') Evaluates to True",
          type: "scenario-mcq",
          tier: "standard",
          points: 10,
          contextScenario: "HTML Form Checkbox Processing",
          prompt: "A web developer reads a checkbox value from an HTML form as `user_consent = '0'`. Why does `if user_consent:` treat this as True?",
          options: [
            {
              id: "opt-1",
              text: "'0' is a string object with len('0') == 1; Python's truth testing protocol checks __len__() on strings, and since 1 > 0, it evaluates to True.",
              explanation: "Correct! Python does not inspect the numeric meaning of characters inside a string during truth testing. Any non-empty string is truthy.",
              isCorrect: true
            },
            {
              id: "opt-2",
              text: "Because Python converts '0' to integer 0, which is truthy in web frameworks.",
              explanation: "Incorrect. Integer 0 is falsy, and Python never implicitly converts strings to integers in if conditions.",
              isCorrect: false
            },
            {
              id: "opt-3",
              text: "Because the string quotes are stripped at runtime.",
              explanation: "Incorrect. Python preserves string types throughout runtime.",
              isCorrect: false
            },
            {
              id: "opt-4",
              text: "Because '0' is an ASCII control character.",
              explanation: "Incorrect. Character semantics have no bearing on container truth testing.",
              isCorrect: false
            }
          ],
          hints: [
            "How does Python determine the truth value of a sequence like str or list?",
            "It checks whether len(obj) > 0.",
            "What is the length of the string '0'?"
          ]
        }
      ]
    },
    {
      id: "day9-sub9",
      number: 9,
      title: "Beyond the Basics Enrichment: Structural Pattern Matching (match / case)",
      summary: "Explore Python 3.10+ structural pattern matching, combining branch selection with sequence destructuring, guards, and wildcards.",
      estimatedMinutes: 8,
      introduce: {
        headline: "Beyond the Basics: Structural Pattern Matching (PEP 634)",
        paragraphs: [
          "Python 3.10 introduced a powerful control flow feature known as **Structural Pattern Matching** via the `match` and `case` statements. While conceptually similar to the `switch / case` found in C or JavaScript, Python's pattern matching goes far beyond simple value comparison: it matches the structure and shape of data while simultaneously destructuring and binding variables.",
          "A `match` block inspects a subject expression against several candidate `case` patterns. Patterns can match literal values (e.g. `case 200:`), sequences and tuples (e.g. `case [x, y]:`), and wildcards (the underscore `case _:` acts as the default fallback, equivalent to `else`).",
          "Pattern matching also supports conditional guards via `if`: a pattern only matches if the structural shape matches AND the trailing `if` guard evaluates to `True`. Because this feature was introduced in Python 3.10, it is presented here as an enrichment topic extending beyond the original 30 Days of Python curriculum."
        ],
        keyTerms: [
          {
            term: "match / case Statement",
            definition: "Python 3.10+ control flow construct for structural pattern matching and sequence destructuring."
          },
          {
            term: "Wildcard Pattern (_)",
            definition: "The underscore case _: that matches any value as an exhaustive fallback."
          },
          {
            term: "Pattern Guard",
            definition: "An optional trailing 'if condition' on a case branch that must hold true for the match to succeed."
          }
        ],
        bulletPoints: [
          "match / case was introduced in Python 3.10 (PEP 634/635/636).",
          "Matches literal values, types, and sequence structures simultaneously.",
          "The wildcard case _: serves as the default fallback branch.",
          "Guards allow combining pattern shapes with boolean logic: case [x, y] if x > 0:.",
          "Unlike C switch statements, Python match does NOT fall through—break is unnecessary."
        ]
      },
      visualise: {
        type: "flowchart-tracer",
        title: "Structural Pattern Matching Decision Matrix",
        badge: "simulation",
        description: "Trace pattern matching routes through literal cases, destructuring tuples, and wildcard fallbacks.",
        initialConfig: {
          mode: "pattern-matching"
        }
      },
      code: [
        {
          title: "Structural Pattern Matching with Guards & Destructuring",
          runMode: "real",
          code: "# Python 3.10+ match/case demonstration\ndef handle_command(command):\n    match command:\n        case [\"QUIT\"]:\n            return \"Shutting down server cleanly.\"\n        case [\"MOVE\", direction] if direction in (\"NORTH\", \"SOUTH\", \"EAST\", \"WEST\"):\n            return f\"Moving character {direction}.\"\n        case [\"TELEPORT\", x, y] if isinstance(x, (int, float)) and isinstance(y, (int, float)):\n            return f\"Warping to coordinates ({x}, {y}).\"\n        case [\"ALERT\", *messages]:\n            return f\"Broadcasting message: {' '.join(messages)}\"\n        case _:\n            return f\"Invalid or unrecognized command: {command}\"\n\nprint(handle_command([\"QUIT\"]))\nprint(handle_command([\"MOVE\", \"NORTH\"]))\nprint(handle_command([\"TELEPORT\", 100, 250]))\nprint(handle_command([\"ALERT\", \"System\", \"rebooting\", \"in\", \"5\", \"mins\"]))\nprint(handle_command([\"DESTROY\", \"ALL\"]))",
          expectedOutput: "Shutting down server cleanly.\nMoving character NORTH.\nWarping to coordinates (100, 250).\nBroadcasting message: System rebooting in 5 mins\nInvalid or unrecognized command: ['DESTROY', 'ALL']"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 5,
          instruction: "case ['QUIT']:",
          internalEffect: "Matches a 1-element list containing exact string 'QUIT'."
        },
        {
          step: 2,
          codeLine: 7,
          instruction: "case ['MOVE', direction] if direction in ...:",
          internalEffect: "Matches 2-element list starting with 'MOVE', binds second item to 'direction', and checks guard."
        },
        {
          step: 3,
          codeLine: 11,
          instruction: "case ['ALERT', *messages]:",
          internalEffect: "Matches list starting with 'ALERT' and collects arbitrary remaining items into 'messages' slice."
        },
        {
          step: 4,
          codeLine: 13,
          instruction: "case _:",
          internalEffect: "Wildcard pattern captures any unmatched command structure, acting as default fallback."
        }
      ],
      apply: {
        domain: "Payment Gateway Integration",
        contextTitle: "API Webhook Event Router",
        scenario: "Route incoming JSON-decoded webhook events from an automated payment gateway.",
        code: "webhook = {\"event\": \"payment.success\", \"amount\": 75000}\nmatch webhook.get(\"event\"):\n    case \"payment.success\":\n        print(\"Fulfill Order: Confirmed payment.\")\n    case _:\n        print(\"Ignored event.\")",
        outcome: "Fulfill Order: Confirmed payment."
      },
      commonMistakes: [
        {
          label: "Expecting Fallthrough Like C/Java Switch Statements",
          erroneousCode: "match val:\n    case 1:\n        print('One')\n        break  # SyntaxError: 'break' outside loop!",
          errorMessage: "SyntaxError: 'break' outside loop",
          explanation: "Python match statements DO NOT fall through to the next case. Each matching case block executes and automatically terminates the match structure.",
          correctedCode: "match val:\n    case 1:\n        print('One')  # Automatically terminates match block!\n    case 2:\n        print('Two')"
        }
      ],
      sourceNotes: "Enrichment topic covering PEP 634 Structural Pattern Matching (Python 3.10+), explicitly identified as extending beyond the source material per Section 14.",
      practise: [
        {
          id: "d9-s9-ex1",
          title: "Pattern Matching Architecture: Fallthrough and Wildcards",
          type: "scenario-mcq",
          tier: "standard",
          points: 10,
          contextScenario: "Modern Python 3.10 Code Migration",
          prompt: "How does Python 3.10's `match/case` statement differ from a C-style `switch` statement regarding branch execution?",
          options: [
            {
              id: "opt-1",
              text: "Python match statements never fall through to subsequent cases; once a case matches, its block runs and the match statement exits immediately without needing 'break'.",
              explanation: "Correct! Python match/case executes strictly the first matching case and never falls through, making 'break' both unnecessary and illegal outside of loops.",
              isCorrect: true
            },
            {
              id: "opt-2",
              text: "Python requires an explicit 'break' statement on every case, otherwise every following case executes.",
              explanation: "Incorrect. That is the behavior of C/C++ and JavaScript, not Python.",
              isCorrect: false
            },
            {
              id: "opt-3",
              text: "Python match/case statements only support integer values, not sequences or strings.",
              explanation: "Incorrect. Python match supports literals, sequences, mappings, class patterns, and guards.",
              isCorrect: false
            },
            {
              id: "opt-4",
              text: "Python evaluates all matching cases simultaneously in parallel.",
              explanation: "Incorrect. Python evaluates cases sequentially from top to bottom.",
              isCorrect: false
            }
          ],
          hints: [
            "Does Python require 'break' inside a case block?",
            "What happens after a matching case finishes executing?",
            "Remember that Python was designed to avoid the accidental fallthrough bugs common in C."
          ]
        },
        {
          id: "d9-s9-ex2",
          title: "Write Code: Command Tuple Pattern Matcher",
          type: "write-code",
          tier: "challenge",
          points: 15,
          contextScenario: "Drone Navigation Control Stream",
          prompt: "Write a function `parse_drone_command(cmd)` using `match/case`:\n- If cmd is `('LAND',)`: return 'LANDING'\n- If cmd matches `('FLY', altitude)` with guard `altitude > 0`: return f'CLIMBING TO {altitude}M'\n- Otherwise: return 'UNKNOWN COMMAND'",
          starterCode: `def parse_drone_command(cmd):
    # Use Python 3.10+ match/case to destructure cmd
    pass`,
          solutionCode: `def parse_drone_command(cmd):
    match cmd:
        case ('LAND',):
            return 'LANDING'
        case ('FLY', altitude) if altitude > 0:
            return f'CLIMBING TO {altitude}M'
        case _:
            return 'UNKNOWN COMMAND'`,
          testCases: [
            {
              id: "tc1",
              label: "Land command",
              setup: "assert parse_drone_command(('LAND',)) == 'LANDING'",
              expected: "True",
              hidden: false
            },
            {
              id: "tc2",
              label: "Fly positive altitude with guard",
              setup: "assert parse_drone_command(('FLY', 150)) == 'CLIMBING TO 150M'",
              expected: "True",
              hidden: false
            },
            {
              id: "tc3",
              label: "Fly non-positive altitude triggers wildcard",
              setup: "assert parse_drone_command(('FLY', -10)) == 'UNKNOWN COMMAND'",
              expected: "True",
              hidden: false
            },
            {
              id: "tc4",
              label: "Unrecognized command",
              setup: "assert parse_drone_command(('HOVER', 5)) == 'UNKNOWN COMMAND'",
              expected: "True",
              hidden: false
            }
          ],
          hints: [
            "Start with 'match cmd:' at 0 indent.",
            "Write 'case ('LAND',): return 'LANDING''.",
            "Write 'case ('FLY', altitude) if altitude > 0: return f'CLIMBING TO {altitude}M''.",
            "End with the wildcard fallback 'case _: return 'UNKNOWN COMMAND''."
          ]
        }
      ]
    }
  ],
  realWorldLabs: [
    {
      id: "day9-lab1",
      title: "Automated Digital Identity & Tiered KYC Compliance Engine",
      description: "Implement a production-grade Know Your Customer (KYC) decision pipeline that processes heterogeneous citizen records, evaluates biometric/age gates, screens international PEP/sanctions watchlists with short-circuit guards, and assigns tiered banking transaction limits using clean if-elif ladders.",
      domain: "Fintech Risk Engineering & Regulatory Compliance",
      starterCode: `# Real-World Lab 1: Automated Digital Identity & Tiered KYC Compliance Engine
# Objective: Classify account tier and transaction limits using guard clauses and compound logic.

applicants = [
    {
        "id": "APP-101",
        "name": "Ngozi Adeleke",
        "age": 24,
        "bvn": "22233344455",
        "nin": "11122233344",
        "is_pep": False,  # Politically Exposed Person
        "proof_of_address": True,
        "biometrics_verified": True
    },
    {
        "id": "APP-102",
        "name": "Tariq Mansoor",
        "age": 17,  # Underage guard
        "bvn": "33344455566",
        "nin": None,
        "is_pep": False,
        "proof_of_address": False,
        "biometrics_verified": False
    },
    {
        "id": "APP-103",
        "name": "Chief Victor Danladi",
        "age": 52,
        "bvn": "44455566677",
        "nin": "99988877766",
        "is_pep": True,  # High risk flag
        "proof_of_address": True,
        "biometrics_verified": True
    },
    {
        "id": "APP-104",
        "name": "Amina Bello",
        "age": 29,
        "bvn": "55566677788",
        "nin": "88877766655",
        "is_pep": False,
        "proof_of_address": False,  # Partial KYC
        "biometrics_verified": True
    }
]

print("=== AUTOMATED KYC COMPLIANCE PIPELINE ===")

def process_kyc_application(app):
    """Processes applicant data using defensive guard clauses and tiered rules."""
    # Guard 1: Legal age check
    if app.get("age", 0) < 18:
        return {
            "id": app["id"],
            "name": app["name"],
            "status": "REJECTED",
            "tier": "NONE",
            "daily_limit": 0.0,
            "reason": f"Underage applicant ({app['age']} yrs). Legal threshold is 18."
        }

    # Guard 2: High-risk Sanctions / PEP watchlist guard
    if app.get("is_pep", False):
        return {
            "id": app["id"],
            "name": app["name"],
            "status": "FLAGGED",
            "tier": "ENHANCED_DUE_DILIGENCE",
            "daily_limit": 0.0,
            "reason": "Politically Exposed Person flag triggered; manual compliance audit required."
        }

    # Guard 3: Minimum BVN identity requirement
    bvn = app.get("bvn")
    if not bvn or len(bvn) != 11:
        return {
            "id": app["id"],
            "name": app["name"],
            "status": "REJECTED",
            "tier": "NONE",
            "daily_limit": 0.0,
            "reason": "Invalid or missing 11-digit Bank Verification Number."
        }

    # Tiered Qualification Ladder (Descending Order)
    has_nin = bool(app.get("nin"))
    has_address = bool(app.get("proof_of_address"))
    has_bio = bool(app.get("biometrics_verified"))

    if has_nin and has_address and has_bio:
        tier = "TIER_3_FULL_KYC"
        daily_limit = 5000000.0  # NGN 5M
        status = "APPROVED"
        reason = "All identity, utility, and biometric checks verified."
    elif has_nin and has_bio:
        tier = "TIER_2_SEMI_VERIFIED"
        daily_limit = 500000.0   # NGN 500k
        status = "APPROVED"
        reason = "NIN and biometric verified; proof of address pending."
    else:
        tier = "TIER_1_BASIC"
        daily_limit = 50000.0    # NGN 50k
        status = "APPROVED"
        reason = "Basic phone/BVN profile only."

    return {
        "id": app["id"],
        "name": app["name"],
        "status": status,
        "tier": tier,
        "daily_limit": daily_limit,
        "reason": reason
    }

for candidate in applicants:
    res = process_kyc_application(candidate)
    print(f"[{res['status']}] {res['id']} - {res['name']}")
    print(f"  Tier: {res['tier']} | Limit: NGN {res['daily_limit']:,.2f}")
    print(f"  Audit Note: {res['reason']}")
`,
      targetOutput: `=== AUTOMATED KYC COMPLIANCE PIPELINE ===
[APPROVED] APP-101 - Ngozi Adeleke
  Tier: TIER_3_FULL_KYC | Limit: NGN 5,000,000.00
  Audit Note: All identity, utility, and biometric checks verified.
[REJECTED] APP-102 - Tariq Mansoor
  Tier: NONE | Limit: NGN 0.00
  Audit Note: Underage applicant (17 yrs). Legal threshold is 18.
[FLAGGED] APP-103 - Chief Victor Danladi
  Tier: ENHANCED_DUE_DILIGENCE | Limit: NGN 0.00
  Audit Note: Politically Exposed Person flag triggered; manual compliance audit required.
[APPROVED] APP-104 - Amina Bello
  Tier: TIER_2_SEMI_VERIFIED | Limit: NGN 500,000.00
  Audit Note: NIN and biometric verified; proof of address pending.`
    },
    {
      id: "day9-lab2",
      title: "E-Commerce Dynamic Checkout & Promotional Rules Engine",
      domain: "E-Commerce Logistics & Price Calculation Engine",
      description: "Build an automated checkout pricing engine that cascades promo vouchers, calculates volume-based freight rates, awards tiered customer loyalty discounts, and determines state tax exemption using short-hand ternary logic and compound conditionals.",
      starterCode: `# Real-World Lab 2: E-Commerce Dynamic Checkout & Promotional Rules Engine
# Calculate cart subtotal, voucher discounts, freight fees, and tax using compound conditions.

cart = {
    "order_id": "ORD-8821",
    "customer": {
        "name": "Kofi Mensah",
        "tier": "GOLD",  # STANDARD, SILVER, GOLD, PLATINUM
        "is_first_order": False,
        "destination_zone": "LAGOS_MAINLAND"
    },
    "items": [
        {"sku": "SKU-LAP-01", "name": "ThinkPad P16", "price": 420000.0, "qty": 1},
        {"sku": "SKU-MOU-02", "name": "Logitech MX Master 3S", "price": 45000.0, "qty": 2},
        {"sku": "SKU-USB-03", "name": "Thunderbolt 4 Cable", "price": 18000.0, "qty": 3}
    ],
    "voucher_code": "BLACKFRIDAY20",
    "delivery_type": "EXPRESS"  # STANDARD vs EXPRESS
}

print("=== CHECKOUT PRICING & PROMOTIONAL ENGINE ===")

# 1. Compute raw items subtotal
subtotal = sum(item["price"] * item["qty"] for item in cart["items"])
print(f"Gross Items Subtotal:   NGN {subtotal:,.2f}")

# 2. Customer Tier Loyalty Discount Rate
cust_tier = cart["customer"].get("tier", "STANDARD")
if cust_tier == "PLATINUM":
    tier_discount_pct = 0.15
elif cust_tier == "GOLD":
    tier_discount_pct = 0.10
elif cust_tier == "SILVER":
    tier_discount_pct = 0.05
else:
    tier_discount_pct = 0.00

tier_discount_amt = subtotal * tier_discount_pct

# 3. Voucher Redemption via Compound Validation
voucher = cart.get("voucher_code", "").strip().upper()
voucher_discount_amt = 0.0

if voucher == "BLACKFRIDAY20" and subtotal >= 200000.0:
    voucher_discount_amt = subtotal * 0.20
elif voucher == "WELCOME50" and cart["customer"].get("is_first_order", False):
    voucher_discount_amt = min(subtotal * 0.50, 25000.0)
elif voucher:
    print(f"Notice: Voucher '{voucher}' does not meet minimum order requirements.")

# Take the higher of tier discount vs voucher discount (cannot stack)
promotional_savings = max(tier_discount_amt, voucher_discount_amt)
promo_source = "BLACKFRIDAY20 (20%)" if voucher_discount_amt > tier_discount_amt else f"Loyalty {cust_tier} ({tier_discount_pct * 100:.0f}%)"
net_items_price = subtotal - promotional_savings

# 4. Delivery Fee Calculation with Free Shipping Threshold
is_express = cart.get("delivery_type") == "EXPRESS"
zone = cart["customer"].get("destination_zone", "LAGOS_MAINLAND")

# Free standard shipping on orders over NGN 250,000
base_freight = 0.0 if (net_items_price >= 250000.0 and not is_express) else (3500.0 if zone == "LAGOS_MAINLAND" else 6500.0)
express_surcharge = 5000.0 if is_express else 0.0
total_freight = base_freight + express_surcharge

# 5. Value Added Tax (VAT 7.5%)
vat_rate = 0.075
vat_amount = net_items_price * vat_rate
final_order_total = net_items_price + total_freight + vat_amount

print(f"Promotional Savings:    -NGN {promotional_savings:,.2f} [{promo_source}]")
print(f"Net Items Payable:      NGN {net_items_price:,.2f}")
print(f"Freight & Logistics:    +NGN {total_freight:,.2f} ({cart['delivery_type']})")
print(f"VAT (7.5%):             +NGN {vat_amount:,.2f}")
print(f"==========================================")
print(f"Final Amount Payable:   NGN {final_order_total:,.2f}")
`,
      targetOutput: `=== CHECKOUT PRICING & PROMOTIONAL ENGINE ===
Gross Items Subtotal:   NGN 564,000.00
Promotional Savings:    -NGN 112,800.00 [BLACKFRIDAY20 (20%)]
Net Items Payable:      NGN 451,200.00
Freight & Logistics:    +NGN 8,500.00 (EXPRESS)
VAT (7.5%):             +NGN 33,840.00
==========================================
Final Amount Payable:   NGN 493,540.00`
    }
  ],
  miniProject: {
    id: "day9-project",
    title: "ApexScholar: Multi-Criteria Scholarship & Admissions Decision Engine",
    brief: "Build an enterprise university admissions and scholarship qualification engine that evaluates applicants across JAMB/WAEC scores, age, disciplinary flags, and state-of-origin quotas using nested conditionals, guard clauses, and compound short-circuit logic.",
    requirements: [
      "Implement multi-stage applicant qualification pipelines using guard clauses to eliminate invalid candidates early.",
      "Calculate WAEC aggregate points using strict descending order to prevent misgrading bugs.",
      "Enforce compound qualification criteria (JAMB score >= 280 and WAEC aggregate >= 30 and age >= 16).",
      "Apply tier-based scholarship awards (Full Merit, Partial Tuition, Community Grant) using clean if-elif ladders.",
      "Support structural pattern matching (Python 3.10+) to parse application command payloads."
    ],
    rubric: [
      { criterion: "Conditional Logic Architecture & Boundary Ordering", weight: 40 },
      { criterion: "Guard Clauses & Defensive Short-Circuit Handling", weight: 35 },
      { criterion: "Pattern Matching & Truthiness Verification", weight: 25 }
    ],
    starterCode: `# ApexScholar: University Admissions & Scholarship Decision Engine
# Day 9 Capstone Mini-Project Implementation

class AdmissionsEngine:
    def __init__(self, institution_name="University of Lagos"):
        self.institution = institution_name
        self.min_age = 16
        self.jamb_cutoff = 200

    def evaluate_applicant(self, applicant):
        """Evaluates an applicant dictionary using guard clauses and compound conditionals."""
        # 1. Guard Clause: Age verification
        if applicant.get("age", 0) < self.min_age:
            return {"status": "REJECTED", "reason": f"Underage: Minimum age is {self.min_age}."}

        # 2. Guard Clause: Disciplinary record
        if applicant.get("has_disciplinary_record", False):
            return {"status": "REJECTED", "reason": "Disciplinary flag on record."}

        # 3. UTME / JAMB Score Evaluation
        jamb = applicant.get("jamb_score", 0)
        if jamb < self.jamb_cutoff:
            return {"status": "REJECTED", "reason": f"JAMB score below cutoff ({self.jamb_cutoff})."}

        # 4. Scholarship Tier Award (Descending Order)
        if jamb >= 320:
            scholarship = "Presidential Full Merit (100% Tuition + Stipend)"
        elif jamb >= 280:
            scholarship = "Dean's Excellence Award (50% Tuition)"
        elif jamb >= 250:
            scholarship = "Faculty Merit Grant (25% Tuition)"
        else:
            scholarship = "Standard Admission (No Scholarship)"

        return {
            "status": "ADMITTED",
            "applicant": applicant.get("name"),
            "jamb": jamb,
            "scholarship": scholarship
        }

# Verification
engine = AdmissionsEngine()
candidate = {"name": "Ngozi Okafor", "age": 18, "jamb_score": 325, "has_disciplinary_record": False}
print("Evaluation Result:", engine.evaluate_applicant(candidate))
`
  },
  dayQuiz: {
    title: "Day 9 Comprehensive Mastery Quiz: Conditionals & Boolean Flow Control",
    passingScorePercentage: 80,
    questions: [
      {
        id: "d9-q1",
        scenario: "Sequential elif Ordering",
        question: "In an exam grading program, a developer writes `if score >= 40: return 'Pass'` before `elif score >= 75: return 'Distinction'`. What grade does a student with score 92 receive?",
        options: [
          {
            id: "q1-a",
            text: "'Pass' — because Python evaluates conditions from top to bottom and exits immediately on the first True condition.",
            explanation: "Correct! Because 92 >= 40 evaluates to True first, the ladder returns 'Pass' and never evaluates the Distinction branch.",
            isCorrect: true
          },
          {
            id: "q1-b",
            text: "'Distinction' — because Python automatically matches the most specific threshold.",
            explanation: "Incorrect. Python does not rank or sort conditions; it tests them sequentially in source order.",
            isCorrect: false
          },
          {
            id: "q1-c",
            text: "SyntaxError: overlapping condition boundaries.",
            explanation: "Incorrect. Overlapping condition boundaries are a logical bug, not a syntax error.",
            isCorrect: false
          },
          {
            id: "q1-d",
            text: "RuntimeError: multiple branches satisfied.",
            explanation: "Incorrect. Python executes only the first matching branch.",
            isCorrect: false
          }
        ]
      },
      {
        id: "d9-q2",
        scenario: "Python Truthiness Protocol",
        question: "What is the result of `bool('False')` and `bool([0])`?",
        options: [
          {
            id: "q2-a",
            text: "True and True — because 'False' is a non-empty string (length 5) and [0] is a non-empty list (length 1).",
            explanation: "Correct! In Python, any non-empty container or non-empty string is truthy regardless of what value it contains.",
            isCorrect: true
          },
          {
            id: "q2-b",
            text: "False and False — because 'False' represents the boolean False and [0] contains 0.",
            explanation: "Incorrect. 'False' is a string object, not a boolean, and [0] is a populated list.",
            isCorrect: false
          },
          {
            id: "q2-c",
            text: "False and True.",
            explanation: "Incorrect. Both evaluate to True.",
            isCorrect: false
          },
          {
            id: "q2-d",
            text: "TypeError: cannot convert container with zero to boolean.",
            explanation: "Incorrect. bool() accepts all Python objects.",
            isCorrect: false
          }
        ]
      },
      {
        id: "d9-q3",
        scenario: "Short-Circuit Evaluation",
        question: "Given `numbers = []`, why does `if numbers and numbers[0] > 10:` NOT raise an IndexError?",
        options: [
          {
            id: "q3-a",
            text: "Because 'numbers' is an empty list (falsy), causing the 'and' operator to short-circuit and never evaluate numbers[0].",
            explanation: "Correct! In 'A and B', if A is falsy, Python halts evaluation immediately without evaluating B.",
            isCorrect: true
          },
          {
            id: "q3-b",
            text: "Because Python automatically handles empty list index lookups by returning None.",
            explanation: "Incorrect. Accessing [0] on an empty list directly raises IndexError: list index out of range.",
            isCorrect: false
          },
          {
            id: "q3-c",
            text: "Because the compiler checks list lengths at compile time.",
            explanation: "Incorrect. Python is dynamically evaluated at runtime.",
            isCorrect: false
          },
          {
            id: "q3-d",
            text: "Because > 10 suppresses IndexErrors.",
            explanation: "Incorrect. Comparison operators do not catch exceptions.",
            isCorrect: false
          }
        ]
      },
      {
        id: "d9-q4",
        scenario: "Ternary Conditional Expression Syntax",
        question: "Which of the following is the valid Python syntax for a conditional expression assigning status?",
        options: [
          {
            id: "q4-a",
            text: "status = 'Active' if balance > 0 else 'Suspended'",
            explanation: "Correct! Python's ternary syntax is: value_if_true if condition else value_if_false.",
            isCorrect: true
          },
          {
            id: "q4-b",
            text: "status = balance > 0 ? 'Active' : 'Suspended'",
            explanation: "Incorrect. The '? :' ternary syntax is used in C, Java, and JavaScript, but does not exist in Python.",
            isCorrect: false
          },
          {
            id: "q4-c",
            text: "status = if balance > 0 then 'Active' else 'Suspended'",
            explanation: "Incorrect. Python does not have a 'then' keyword.",
            isCorrect: false
          },
          {
            id: "q4-d",
            text: "status = (balance > 0) -> 'Active' | 'Suspended'",
            explanation: "Incorrect. This is not valid Python syntax.",
            isCorrect: false
          }
        ]
      },
      {
        id: "d9-q5",
        scenario: "Logical Operator Precedence",
        question: "How does Python group the expression `is_staff or is_admin and has_token` without parentheses?",
        options: [
          {
            id: "q5-a",
            text: "is_staff or (is_admin and has_token) — because 'and' has higher precedence than 'or'.",
            explanation: "Correct! In Python's operator precedence table, 'not' binds highest, followed by 'and', followed by 'or'.",
            isCorrect: true
          },
          {
            id: "q5-b",
            text: "(is_staff or is_admin) and has_token — because operators evaluate strictly left-to-right.",
            explanation: "Incorrect. 'and' takes precedence over 'or', regardless of order of appearance.",
            isCorrect: false
          },
          {
            id: "q5-c",
            text: "SyntaxError: mixed logical operators require mandatory parentheses.",
            explanation: "Incorrect. While PEP 8 recommends parentheses for clarity, Python parses precedence unambiguously.",
            isCorrect: false
          },
          {
            id: "q5-d",
            text: "The expression is evaluated randomly depending on bytecode optimization.",
            explanation: "Incorrect. Python operator precedence is fully deterministic.",
            isCorrect: false
          }
        ]
      },
      {
        id: "d9-q6",
        scenario: "Assignment vs Equality Comparison",
        question: "What happens when executing `if status = 'active': print('OK')` in Python 3?",
        options: [
          {
            id: "q6-a",
            text: "SyntaxError: invalid syntax — because single '=' is the assignment statement, not an equality test.",
            explanation: "Correct! Assignment with '=' is a statement, not an expression, and is forbidden in an if condition.",
            isCorrect: true
          },
          {
            id: "q6-b",
            text: "status is assigned 'active' and the print statement runs because 'active' is truthy.",
            explanation: "Incorrect. This behavior occurs in C/C++, but Python deliberately raises a SyntaxError to prevent this bug.",
            isCorrect: false
          },
          {
            id: "q6-c",
            text: "TypeError: boolean expected, got string.",
            explanation: "Incorrect. The error is a compile-time SyntaxError.",
            isCorrect: false
          },
          {
            id: "q6-d",
            text: "NameError: status is undefined.",
            explanation: "Incorrect. The syntax error is caught during parsing before execution starts.",
            isCorrect: false
          }
        ]
      },
      {
        id: "d9-q7",
        scenario: "Guard Clause Architecture",
        question: "What is the primary architectural benefit of using guard clauses (early returns) over deeply nested if statements?",
        options: [
          {
            id: "q7-a",
            text: "It reduces cyclomatic complexity, flattens indentation levels, and keeps the happy path visible at the top level.",
            explanation: "Correct! Guard clauses eliminate the 'Arrow Anti-Pattern' and make functions significantly easier to read and test.",
            isCorrect: true
          },
          {
            id: "q7-b",
            text: "It increases CPython bytecode execution speed by 10x.",
            explanation: "Incorrect. While it avoids some branch jumps, the primary benefit is software architecture and readability.",
            isCorrect: false
          },
          {
            id: "q7-c",
            text: "It allows functions to execute without allocating a stack frame.",
            explanation: "Incorrect. Every function call allocates a stack frame.",
            isCorrect: false
          },
          {
            id: "q7-d",
            text: "It disables garbage collection during conditional checks.",
            explanation: "Incorrect. Guard clauses have no relationship with the garbage collector.",
            isCorrect: false
          }
        ]
      },
      {
        id: "d9-q8",
        scenario: "Compound Or Trap",
        question: "Why does `if role == 'admin' or 'superadmin':` evaluate to True even when `role = 'guest'`?",
        options: [
          {
            id: "q8-a",
            text: "Because Python evaluates ('superadmin') independently as a non-empty string, which is always truthy.",
            explanation: "Correct! The expression parses as (role == 'admin') or ('superadmin'). Since 'superadmin' is non-empty, False or True evaluates to True.",
            isCorrect: true
          },
          {
            id: "q8-b",
            text: "Because Python automatically distributes the '==' operator across the 'or' operator.",
            explanation: "Incorrect. Python does not distribute comparison operators across boolean operators.",
            isCorrect: false
          },
          {
            id: "q8-c",
            text: "Because 'guest' inherits permissions from 'admin'.",
            explanation: "Incorrect. There is no inheritance in raw string equality checks.",
            isCorrect: false
          },
          {
            id: "q8-d",
            text: "Because 'or' has higher precedence than '=='.",
            explanation: "Incorrect. '==' has higher precedence than 'or'.",
            isCorrect: false
          }
        ]
      },
      {
        id: "d9-q9",
        scenario: "Structural Pattern Matching (Python 3.10+)",
        question: "How does Python's `match/case` statement differ from a C-style switch statement regarding fallthrough?",
        options: [
          {
            id: "q9-a",
            text: "Python match statements never fall through to subsequent cases; the break statement is unnecessary and illegal inside case blocks.",
            explanation: "Correct! In Python match/case, the matched block executes and control immediately leaves the match statement.",
            isCorrect: true
          },
          {
            id: "q9-b",
            text: "Python requires an explicit 'break' statement at the end of every case block to prevent fallthrough.",
            explanation: "Incorrect. 'break' is only valid inside loops; using it in a case block raises SyntaxError.",
            isCorrect: false
          },
          {
            id: "q9-c",
            text: "Python match statements only support integer cases.",
            explanation: "Incorrect. Python match supports structural pattern matching, tuples, sequences, mappings, and guards.",
            isCorrect: false
          },
          {
            id: "q9-d",
            text: "Python fallthrough occurs unless the case ends with a return statement.",
            explanation: "Incorrect. Python never falls through regardless of return statements.",
            isCorrect: false
          }
        ]
      },
      {
        id: "d9-q10",
        scenario: "Truthiness in Idiomatic Python",
        question: "According to PEP 8, which is the idiomatic Pythonic way to test if a list `users` is non-empty?",
        options: [
          {
            id: "q10-a",
            text: "if users: — relying directly on the truthiness of non-empty collections.",
            explanation: "Correct! PEP 8 states: 'For sequences, (strings, lists, tuples), use the fact that empty sequences are false: if not seq / if seq'.",
            isCorrect: true
          },
          {
            id: "q10-b",
            text: "if len(users) > 0:",
            explanation: "Incorrect. While functionally working, it is verbose and discouraged by PEP 8 when 'if users:' suffices.",
            isCorrect: false
          },
          {
            id: "q10-c",
            text: "if users != []:",
            explanation: "Incorrect. Comparing to an empty literal allocates an unnecessary object and is non-idiomatic.",
            isCorrect: false
          },
          {
            id: "q10-d",
            text: "if bool(users) == True:",
            explanation: "Incorrect. Explicitly comparing to True is an anti-pattern in Python.",
            isCorrect: false
          }
        ]
      }
    ]
  },
  cheatSheet: [
    {
      category: "Basic if Statement & Indented Suite",
      syntax: "if condition:\n    statement_1\n    statement_2",
      description: "Evaluates a boolean test expression. If True, the 4-space indented suite executes. If False, the block is skipped entirely. Single '=' assignment is forbidden inside if headers (SyntaxError); always use '==' for equality.",
      example: `# 1. Standard equality and comparison
temperature = 29
if temperature > 25:
    print("High temperature alert")

# 2. Mandatory colon and 4-space indentation
role = "admin"
if role == "admin":
    print("Admin dashboard unlocked")`
    },
    {
      category: "Binary Branching (if ... else) & Mutual Exclusion",
      syntax: "if condition:\n    true_branch()\nelse:\n    false_branch()",
      description: "Guarantees mutually exclusive binary execution: exactly one branch runs (never both, never neither). The 'else:' clause takes no condition and must align vertically with its matching 'if'.",
      example: `balance = 12000.0
withdrawal = 15000.0

if withdrawal <= balance:
    print("Approved")
else:
    print("Declined: Insufficient funds")`
    },
    {
      category: "Multi-Way Sequential Branching (if ... elif ... else)",
      syntax: "if cond_1:\n    ...\nelif cond_2:\n    ...\nelse:\n    ...",
      description: "Evaluates conditions strictly from top to bottom. The moment any branch evaluates to True, its block executes and the rest of the ladder is short-circuited and skipped.",
      example: `http_status = 404

if http_status == 200:
    msg = "OK"
elif http_status == 404:
    msg = "Not Found"
elif http_status == 500:
    msg = "Server Error"
else:
    msg = "Unknown"`
    },
    {
      category: "Sequential Order & Overlapping Thresholds (WAEC Rule)",
      syntax: "if x >= 75: ... elif x >= 70: ... elif x >= 40: ...",
      description: "When testing inclusive minimum thresholds (>= or >), order conditions descending from highest to lowest. Placing lower thresholds first (e.g., >= 40 before >= 75) intercepts high scores and creates unreachable dead code.",
      example: `# CORRECT: Descending thresholds
score = 88
if score >= 75:
    grade = "A1"
elif score >= 65:
    grade = "B3"
elif score >= 40:
    grade = "E8"
else:
    grade = "F9"`
    },
    {
      category: "Ternary Conditional Expressions (Inline Short-Hand)",
      syntax: "result = value_if_true if condition else value_if_false",
      description: "An inline expression (not a statement) that evaluates to a value. The 'else' clause is strictly mandatory. Ideal for concise variable assignments, f-strings, and safe division.",
      example: `balance = -50.0
status = "Active" if balance >= 0 else "Overdrawn"

# Safe division guard
count = 0
avg = 100 / count if count > 0 else 0.0`
    },
    {
      category: "Nested Conditionals & Flat Guard Clauses",
      syntax: "if not valid_1: return error_1\nif not valid_2: return error_2\nreturn success()",
      description: "Deeply nested if blocks ('Pyramid of Doom') increase cyclomatic complexity. Refactor by inverting failure conditions into early-return guard clauses so the happy path remains unindented.",
      example: `def transfer(has_acct, kyc_ok, bal, amt):
    if not has_acct:
        return "ERROR: No account"
    if not kyc_ok:
        return "ERROR: KYC required"
    if bal < amt:
        return "ERROR: Insufficient funds"
    return "SUCCESS"`
    },
    {
      category: "Logical Operators (and, or, not) & Precedence",
      syntax: "not > and > or  |  (cond_a or cond_b) and not cond_c",
      description: "Combines boolean expressions. Precedence order is 'not' highest, then 'and', then 'or'. Always repeat the variable in 'or' checks (x == 'a' or x == 'b', never x == 'a' or 'b') and use parentheses for clarity.",
      example: `role = "editor"
# Correct: explicit variable or membership test
is_privileged = role == "admin" or role == "superadmin"
is_privileged_alt = role in ("admin", "superadmin")

# Explicit precedence grouping
if (is_weekend or is_holiday) and not has_ticket:
    print("Closed")`
    },
    {
      category: "Short-Circuit Evaluation & Defensive Guarding",
      syntax: "if guard_check and risky_operation: ...",
      description: "Python evaluates 'and' / 'or' left-to-right and stops once the result is determined. In 'A and B', if A is falsy, B is never evaluated—protecting against ZeroDivisionError, IndexError, or KeyError.",
      example: `items = []
# Safe: len(items) > 0 is False, so items[0] is never accessed!
if items and items[0] == "ADMIN":
    print("Admin first")

count = 0
if count != 0 and (100 / count) > 5:
    print("Safe division")`
    },
    {
      category: "Python Truth Value Testing (bool() Protocol)",
      syntax: "Falsy: None, False, 0, 0.0, '', (), [], {}, set(), range(0)",
      description: "Any object can be tested in an if statement via __bool__() and __len__(). Empty containers and numeric zeros are falsy; all non-zero numbers and non-empty containers (including '0', 'False', and [0]) are truthy.",
      example: `cart = []
if not cart:          # Idiomatic PEP 8 check
    print("Cart empty")

# Classic truthiness traps:
print(bool("False"))  # True (non-empty str)
print(bool([0]))      # True (1 element)
print(bool(" "))      # True (1 whitespace char)`
    },
    {
      category: "Structural Pattern Matching (match / case — Python 3.10+)",
      syntax: "match subject:\n    case ['CMD', arg] if arg > 0:\n        ...\n    case _:\n        ...",
      description: "Enrichment (beyond source): Python 3.10+ structural pattern matching destructures sequences, binds variables, and supports 'if' guards. Never falls through—'break' is unnecessary and illegal.",
      example: `def route(cmd):
    match cmd:
        case ["QUIT"]:
            return "Exiting"
        case ["FLY", alt] if alt > 0:
            return f"Climbing to {alt}m"
        case _:
            return "Unknown command"`
    }
  ],
  sourceNotes: [
    "Source attribution: Asabeneh Yetayeh's '30 Days of Python' (Day 9 - Conditionals).",
    "Covers if, if-else, if-elif-else, conditional expressions (ternary), nested blocks, logical operators (and, or, not), truth value testing (bool protocol), WAEC grade boundaries simulation, and Python 3.10+ match/case enrichment."
  ]
};
