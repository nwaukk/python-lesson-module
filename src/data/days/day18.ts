/**
 * Day 18: Regular Expressions (Intermediate Python)
 * Part A (Learn) conforming to Sections 10, 13.2, and 14 of the Master Specification.
 * Includes:
 *  - 8 Detailed Subtopics following the 10-step pedagogical structure
 *  - 3 Signature Simulations: regex-methods-sim, regex-quantifier-sim, regex-groups-sim
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_18_MODULE: DayModule = {
  schemaVersion: 1,
  number: 18,
  title: 'Regular Expressions',
  level: 'intermediate',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/18_Day_Regular_expressions',
  estimatedMinutes: 80,
  prerequisites: [4],
  objectives: [
    'Write regex patterns cleanly with Python raw strings (r"...") to avoid backslash escaping bugs',
    'Distinguish re.match() (index-0 anchored) from re.search(), re.findall(), re.finditer(), re.sub(), and re.split()',
    'Use metacharacters and shorthand character classes (\\d, \\w, \\s) along with their negated forms (\\D, \\W, \\S)',
    'Build custom character sets ([a-z], [^0-9]), alternation (|), and anchors (^, $, \\b)',
    'Control repetition with quantifiers (*, +, ?, {m,n}) and choose between greedy (.*) and lazy (.*?) matching',
    'Extract structured fields with capturing groups (...), named groups (?P<name>...), and non-capturing groups (?:...)',
    'Pre-compile reusable patterns with re.compile() and configure flags (re.IGNORECASE, re.MULTILINE, re.DOTALL)',
    'Apply regex to real-world email extraction, phone number validation, and messy log cleaning',
  ],
  subtopics: [
    {
      id: 'day18-sub1',
      number: 1,
      title: 'Raw Strings (r"..."), re.match() vs re.search()',
      summary: 'Avoid backslash traps with raw strings and understand why re.match() only checks index 0 while re.search() scans anywhere.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Always Prefix Patterns with r"..."',
        paragraphs: [
          'Python’s standard-library **`re`** module lets you search, validate, and transform text using **regular expressions**. Because regexes rely heavily on backslashes (`\\d`, `\\b`, `\\s`), always write patterns as **raw strings** (`r"\\d+"`). Without `r`, Python interprets `\\b` as an ASCII backspace character instead of a word boundary!',
          'A classic beginner trap is confusing `re.match()` with `re.search()`. **`re.match(pattern, text)` only checks at index 0** of `text`. If the pattern appears at index 5, `re.match()` returns `None`!',
          '**`re.search(pattern, text)`** scans left-to-right across the entire string and returns the **first** `re.Match` object (with `.group()` and `.span()`), or `None` if no match exists.',
        ],
        keyTerms: [
          {
            term: 'Raw String (r"...")',
            definition: 'String literal that passes backslashes directly to the regex engine without Python escape processing.',
          },
          {
            term: 're.match() vs re.search()',
            definition: 'match() is anchored at index 0; search() scans anywhere in the string for the first match.',
          },
        ],
        bulletPoints: [
          'Always check `if m:` before calling `m.group()`—both `match()` and `search()` return `None` on failure.',
          'Prefer `re.search(r"^...", text)` over `re.match()` for explicit start-of-string intent.',
        ],
      },
      visualise: {
        type: 'regex-methods-sim',
        title: 're.match() vs re.search() vs re.findall() vs re.sub()',
        badge: 'simulation',
        description: 'Compare how each re function behaves on the same target text.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Raw Strings and match() vs search()',
          runMode: 'real',
          code: `import re

text = "Order #402 shipped"
m_match = re.match(r"\\d+", text)
m_search = re.search(r"\\d+", text)

print("match:", m_match)
print("search:", m_search.group(), "| span:", m_search.span())`,
          expectedOutput: `match: None
search: 402 | span: (7, 10)`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'm_match = re.match(r"\\d+", text)',
          internalEffect: 'Checks index 0 ("O"); since "O" is not a digit, returns None immediately.',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: 'm_search = re.search(r"\\d+", text)',
          internalEffect: 'Scans forward to index 7 and matches "402" (span 7..10).',
        },
      ],
      apply: {
        domain: 'Ticket Triage',
        contextTitle: 'Detecting Ticket IDs Anywhere in Subject Lines',
        scenario: 'Extract the first ticket number from an email subject line regardless of prefix text.',
        code: `import re

subject = "Re: Urgent [TKT-8841] Login failure"
m = re.search(r"TKT-\\d+", subject)
print("Found:", m.group() if m else "None")`,
        outcome: 'Found: TKT-8841',
      },
      commonMistakes: [
        {
          label: 'Forgetting r"..." on Word Boundaries (\\b)',
          erroneousCode: `import re
print(re.search("\\bcat\\b", "the cat sat"))  # \\b is ASCII backspace!`,
          errorMessage: 'Silent bug: returns None because "\\b" became ASCII 0x08',
          explanation: 'Without the r prefix, Python turns \\b into a backspace character before re ever sees it.',
          correctedCode: `print(re.search(r"\\bcat\\b", "the cat sat").group())  # cat`,
        },
      ],
      sourceNotes: 'Covers raw strings, re.match(), and re.search() for Day 18.',
      practise: [
        {
          id: 'd18-s1-ex1',
          title: 'Scenario: re.match() vs re.search()',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Invoice Reference Scanner',
          prompt: 'You run `re.match(r"INV-\\d+", "Fwd: INV-904")` and get `None`, even though `"INV-904"` is clearly in the string. Why?',
          options: [
            { id: 'opt-1', text: 're.match() only checks at index 0; use re.search() to scan anywhere in the string.', explanation: 'Correct! "Fwd: " occupies index 0..4, so match() fails immediately.', isCorrect: true },
            { id: 'opt-2', text: 'r"\\d+" only matches single digits.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'Hyphens are illegal in re.match().', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 're.match() is case-insensitive.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Where does re.match() start and stop checking?',
            'Which function scans the entire string for the first match?',
            're.search().',
          ],
        },
        {
          id: 'd18-s1-ex2',
          title: 'Fix the Bug: Missing Raw String Prefix',
          type: 'fix-the-bug',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Word Boundary Filter',
          prompt: 'Fix the pattern string so `re.search()` matches the standalone word `"pin"` and prints `"pin"`.',
          starterCode: `import re

m = re.search("\\bpin\\b", "enter pin code")
print(m.group() if m else "None")`,
          solutionCode: `import re

m = re.search(r"\\bpin\\b", "enter pin code")
print(m.group() if m else "None")`,
          testCases: [
            { id: 'tc-1', label: 'Prints pin', setup: '', expected: 'pin', hidden: false },
          ],
          hints: [
            'Without r, Python treats \\b as an ASCII backspace character.',
            'Prefix the pattern string with r.',
            'r"\\bpin\\b".',
          ],
        },
        {
          id: 'd18-s1-ex3',
          title: 'Write Code: Extract First Order ID with re.search()',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'Dispatch Notification Parser',
          prompt: 'Use `re.search()` with `r"ORD-\\d+"` on `"Status: ORD-7712 ready"` and print the matched string.',
          starterCode: `import re

msg = "Status: ORD-7712 ready"
# Search for ORD- followed by digits and print .group()
`,
          solutionCode: `import re

msg = "Status: ORD-7712 ready"
m = re.search(r"ORD-\\d+", msg)
print(m.group())`,
          testCases: [
            { id: 'tc-1', label: 'Prints ORD-7712', setup: '', expected: 'ORD-7712', hidden: false },
          ],
          hints: [
            'Call re.search(r"ORD-\\d+", msg).',
            'Call .group() on the Match object.',
            'Prints ORD-7712.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day18-sub2',
      number: 2,
      title: 'Extracting & Transforming with re.findall(), re.finditer(), re.sub() & re.split()',
      summary: 'Collect all matches with findall/finditer, redact or normalize text with sub, and tokenize with split.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Four Workhorse Functions in re',
        paragraphs: [
          'When you want **every** match rather than just the first, **`re.findall(pattern, text)`** returns a list of all non-overlapping matches. If you also need each match’s character positions (`.start()`, `.end()`, `.span()`), use **`re.finditer(pattern, text)`**, which yields `Match` objects lazily.',
          '**`re.sub(pattern, repl, text, count=0)`** replaces every match (or up to `count` matches) with `repl`—either a replacement string (supporting backreferences like `r"\\1"`) or a callback function `lambda m: ...`.',
          '**`re.split(pattern, text)`** splits a string wherever the regex matches, making it far more flexible than `str.split()` when delimiters vary (e.g., splitting on commas, semicolons, or whitespace).',
        ],
        keyTerms: [
          {
            term: 're.findall() vs re.finditer()',
            definition: 'findall returns a list of strings/tuples; finditer lazily yields Match objects with span metadata.',
          },
          {
            term: 're.sub()',
            definition: 'Returns a new string with regex matches replaced by a string or function result.',
          },
        ],
        bulletPoints: [
          'Pass `count=1` to `re.sub()` if you only want to replace the first match.',
          'Note: `re.findall()` changes its return shape to tuples when the pattern contains capturing groups `(...)`.',
        ],
      },
      visualise: {
        type: 'regex-methods-sim',
        title: 'findall() & sub() Transformation Preview',
        badge: 'simulation',
        description: 'Inspect how findall() extracts all matches and sub() masks sensitive tokens.',
        initialConfig: {},
      },
      code: [
        {
          title: 'findall, sub, and split in Action',
          runMode: 'real',
          code: `import re

raw = "Items: 12, 45; 108  units"
nums = re.findall(r"\\d+", raw)
redacted = re.sub(r"\\d+", "#", raw)
tokens = re.split(r"[,;:\\s]+", "alpha, beta; gamma  delta")

print("Nums:", nums)
print("Redacted:", redacted)
print("Tokens:", tokens)`,
          expectedOutput: `Nums: ['12', '45', '108']
Redacted: Items: #, #; #  units
Tokens: ['alpha', 'beta', 'gamma', 'delta']`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'nums = re.findall(r"\\d+", raw)',
          internalEffect: 'Scans the entire string and collects all 3 digit sequences into a list of strings.',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: 'redacted = re.sub(r"\\d+", "#", raw)',
          internalEffect: 'Produces a new string with every digit run replaced by "#".',
        },
        {
          step: 3,
          codeLine: 6,
          instruction: 're.split(r"[,;:\\s]+", ...)',
          internalEffect: 'Splits on any run of commas, semicolons, colons, or whitespace.',
        },
      ],
      apply: {
        domain: 'Privacy & Compliance',
        contextTitle: 'Masking Credit Card Digits in Logs',
        scenario: 'Mask all digits except the last 4 in a support chat log.',
        code: `import re

msg = "Card 4111-2222-3333-4444 declined"
masked = re.sub(r"\\d{4}-\\d{4}-\\d{4}-(\\d{4})", r"****-****-****-\\1", msg)
print(masked)`,
        outcome: 'Card ****-****-****-4444 declined',
      },
      commonMistakes: [
        {
          label: 'Expecting re.sub() to Mutate a String In-Place',
          erroneousCode: `import re
s = "port=8080"
re.sub(r"\\d+", "9000", s)  # Return value discarded!
print(s)`,
          errorMessage: 'Logic bug: s is still "port=8080" because strings are immutable',
          explanation: 're.sub() returns a new string; always assign the result back to a variable.',
          correctedCode: `s = re.sub(r"\\d+", "9000", s)
print(s)  # port=9000`,
        },
      ],
      sourceNotes: 'Covers re.findall(), re.finditer(), re.sub(), and re.split().',
      practise: [
        {
          id: 'd18-s2-ex1',
          title: 'Write Code: Masking Digits with re.sub()',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'PII Redaction Filter',
          prompt: 'Use `re.sub()` to replace every digit in `"Code: 4829, Pin: 11"` with `"*"` and print the result.',
          starterCode: `import re

text = "Code: 4829, Pin: 11"
# Replace every digit with *
`,
          solutionCode: `import re

text = "Code: 4829, Pin: 11"
print(re.sub(r"\\d", "*", text))`,
          testCases: [
            { id: 'tc-1', label: 'Prints Code: ****, Pin: **', setup: '', expected: 'Code: ****, Pin: **', hidden: false },
          ],
          hints: [
            'Use r"\\d" (without +) so each digit is replaced by one *.',
            'Call re.sub(r"\\d", "*", text).',
            'Print the returned string.',
          ],
        },
        {
          id: 'd18-s2-ex2',
          title: 'Predict Output: re.split() on Mixed Delimiters',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Tag Tokenizer',
          prompt: 'What does `print(re.split(r"[,;\\s]+", "py, go; rust"))` output?',
          options: [
            { id: 'opt-1', text: "['py', 'go', 'rust']", explanation: 'Correct! [,;\\s]+ matches any run of commas, semicolons, or spaces.', isCorrect: true },
            { id: 'opt-2', text: "['py', ' go', ' rust']", explanation: 'Incorrect. \\s is inside the delimiter class.', isCorrect: false },
            { id: 'opt-3', text: "['py, go; rust']", explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'TypeError', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'What does [,;\\s]+ match?',
            'Does it consume the spaces after commas and semicolons?',
            "['py', 'go', 'rust'].",
          ],
        },
        {
          id: 'd18-s2-ex3',
          title: 'Fill the Gaps: Collecting All Numbers',
          type: 'fill-the-gaps',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Metrics Scraper',
          prompt: 'Complete the call to return a list of all digit runs in `line`.',
          gaps: [
            { id: 'g-1', beforeText: 'nums = re.', afterText: '(r"\\d+", line)', correctAnswer: 'findall', options: ['findall', 'match', 'search', 'sub'] },
          ],
          hints: [
            'Which re function returns a list of all matches?',
            'It starts with find...',
            'findall.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day18-sub3',
      number: 3,
      title: 'Metacharacters, Shorthand Classes (\\d, \\w, \\s) & Negation',
      summary: 'Match digits, word characters, whitespace, and any character (.) cleanly, and escape literal metacharacters.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Building Blocks of Pattern Matching',
        paragraphs: [
          'Regex gives special meaning to **metacharacters** such as `.` (any character except newline `\\n`), `\\d` (digit `0–9`), `\\w` (word character: letters, digits, underscore `_`), and `\\s` (whitespace: space, tab `\\t`, newline `\\n`).',
          'Each shorthand class has an **uppercase negated twin**: `\\D` (non-digit), `\\W` (non-word character), and `\\S` (non-whitespace). This makes stripping punctuation or isolating non-digits effortless.',
          'When you need to match a **literal** metacharacter—such as a dot `.` in an IP address or domain name, or a `+` in a phone code—escape it with a backslash (`r"\\."`, `r"\\+"`).',
        ],
        keyTerms: [
          {
            term: '\\d / \\w / \\s',
            definition: 'Shorthand classes for digits, word characters ([a-zA-Z0-9_]), and whitespace.',
          },
          {
            term: 'Escaping (\\.)',
            definition: 'Prefixing a metacharacter with \\ so it matches literally instead of acting as a wildcard.',
          },
        ],
        bulletPoints: [
          '`.` matches any single character EXCEPT `\\n` (unless `re.DOTALL` is enabled).',
          'Uppercase `\\D`, `\\W`, `\\S` match the exact complement of `\\d`, `\\w`, `\\s`.',
        ],
      },
      visualise: {
        type: 'regex-quantifier-sim',
        title: 'Metacharacters & Quantifier Workbench',
        badge: 'simulation',
        description: 'Explore how shorthand classes, boundaries, and quantifiers match target text.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Shorthand Classes, Negation, and Literal Escaping',
          runMode: 'real',
          code: `import re

sample = "ID: A_99 | IP: 10.0.0.1"
print("Word tokens:", re.findall(r"\\w+", sample))
print("Non-digits:", re.sub(r"\\D", "", "Tel: +234-803-555"))
print("Literal dot match:", bool(re.search(r"10\\.0\\.0\\.1", sample)))`,
          expectedOutput: `Word tokens: ['ID', 'A_99', 'IP', '10', '0', '0', '1']
Non-digits: 234803555
Literal dot match: True`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 're.findall(r"\\w+", sample)',
          internalEffect: 'Matches runs of letters, digits, and underscores (so A_99 stays together).',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: 're.sub(r"\\D", "", "Tel: +234-803-555")',
          internalEffect: 'Removes every non-digit character, leaving only the digits 234803555.',
        },
        {
          step: 3,
          codeLine: 6,
          instruction: 're.search(r"10\\.0\\.0\\.1", sample)',
          internalEffect: 'Escapes dots with \\. so it matches literal 10.0.0.1 rather than 10X0Y0Z1.',
        },
      ],
      apply: {
        domain: 'Data Cleaning',
        contextTitle: 'Stripping Punctuation from Phone Inputs',
        scenario: 'Normalize a user-entered phone string by stripping all non-digit characters.',
        code: `import re

raw_phone = "(+234) 809-123-4567"
digits_only = re.sub(r"\\D", "", raw_phone)
print("Normalized:", digits_only)`,
        outcome: 'Normalized: 2348091234567',
      },
      commonMistakes: [
        {
          label: 'Unescaped Dot (.) Matching Any Character in Domain Checks',
          erroneousCode: `import re
print(bool(re.search(r"v1.2", "v1X2")))  # True! Unintended match!`,
          errorMessage: 'Logic bug: . matches "X" because it was not escaped as \\.',
          explanation: 'Outside character classes [...], . is a wildcard for any non-newline character.',
          correctedCode: `print(bool(re.search(r"v1\\.2", "v1X2")))  # False`,
        },
      ],
      sourceNotes: 'Covers metacharacters and shorthand character classes.',
      practise: [
        {
          id: 'd18-s3-ex1',
          title: 'Write Code: Strip Non-Digits with \\D',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'Phone Number Normalizer',
          prompt: 'Use `re.sub(r"\\D", "", raw)` on `"(+234) 803-000-1234"` and print the normalized digits.',
          starterCode: `import re

raw = "(+234) 803-000-1234"
# Remove all non-digit characters
`,
          solutionCode: `import re

raw = "(+234) 803-000-1234"
print(re.sub(r"\\D", "", raw))`,
          testCases: [
            { id: 'tc-1', label: 'Prints 2348030001234', setup: '', expected: '2348030001234', hidden: false },
          ],
          hints: [
            'Uppercase \\D matches any non-digit character.',
            'Replace \\D with "".',
            '2348030001234.',
          ],
        },
        {
          id: 'd18-s3-ex2',
          title: 'Scenario: Escaping Literal Dots',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Semantic Version Checker',
          prompt: 'Why does `re.search(r"2.0", "2X0")` return a match even though there is no dot in `"2X0"`?',
          options: [
            { id: 'opt-1', text: 'An unescaped dot (.) is a wildcard matching any single non-newline character; use r"2\\.0" for a literal dot.', explanation: 'Correct!', isCorrect: true },
            { id: 'opt-2', text: 're.search() ignores punctuation.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'X is treated as 0.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'Raw strings disable dots.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'What does . mean in regex outside [...]?',
            'How do you match a literal period?',
            'Escape it with \\.',
          ],
        },
        {
          id: 'd18-s3-ex3',
          title: 'Predict Output: \\w+ Tokenization',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Identifier Extractor',
          prompt: 'What does `print(re.findall(r"\\w+", "user_1 = 42;"))` output?',
          options: [
            { id: 'opt-1', text: "['user_1', '42']", explanation: 'Correct! \\w matches letters, digits, and underscores.', isCorrect: true },
            { id: 'opt-2', text: "['user', '1', '42']", explanation: 'Incorrect. Underscore is part of \\w.', isCorrect: false },
            { id: 'opt-3', text: "['user_1']", explanation: 'Incorrect. Digits are also in \\w.', isCorrect: false },
            { id: 'opt-4', text: "['user_1', '=', '42']", explanation: 'Incorrect. = is not a word char.', isCorrect: false },
          ],
          hints: [
            'Does \\w include underscore _ and digits 0-9?',
            'Is = included in \\w?',
            "['user_1', '42'].",
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day18-sub4',
      number: 4,
      title: 'Custom Character Sets ([a-z], [^0-9]), Alternation (|) & Anchors (^, $, \\b)',
      summary: 'Define exact character ranges, negated sets, OR branches, and full-string or word-boundary anchors.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Precision Matching with Sets and Anchors',
        paragraphs: [
          'Square brackets `[...]` define a **custom character class** matching any **one** character inside: `[aeiou]` matches a vowel, `[A-Fa-f0-9]` matches a hex digit. Placing `^` right after `[` negates the set: `[^0-9]` matches any single non-digit.',
          'The pipe `|` provides **alternation** (logical OR): `r"cat|dog"` matches `"cat"` or `"dog"`. Wrap alternation in parentheses when combined with surrounding text: `r"\\b(GET|POST)\\b"`.',
          '**Anchors** match **positions**, not characters: `^` (start of string), `$` (end of string), and `\\b` (word boundary between `\\w` and `\\W`). Always use `^...$` when validating an entire input string!',
        ],
        keyTerms: [
          {
            term: 'Negated Set [^...]',
            definition: 'Character class matching any single character NOT listed inside the brackets.',
          },
          {
            term: 'Anchors (^, $, \\b)',
            definition: 'Zero-width assertions matching start of string, end of string, or word boundaries.',
          },
        ],
        bulletPoints: [
          'Inside `[...]`, most metacharacters like `.` and `+` are literal (no escaping needed).',
          'Without `^` and `$`, `re.search(r"[a-z]{3}", "abc123")` succeeds even though `"abc123"` has digits!',
        ],
      },
      visualise: {
        type: 'regex-quantifier-sim',
        title: 'Anchors (^, $, \\b) & Character Set Validator',
        badge: 'simulation',
        description: 'Compare unanchored substring search against ^...$ full-string validation.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Validating Hex Codes & HTTP Verbs with Anchors',
          runMode: 'real',
          code: `import re

hex_re = r"^#[0-9A-Fa-f]{6}$"
print("Valid #1A2B3C:", bool(re.match(hex_re, "#1A2B3C")))
print("Valid #1A2B3Z:", bool(re.match(hex_re, "#1A2B3Z")))
print("HTTP verbs:", re.findall(r"\\b(GET|POST)\\b", "GET /users, POSTED, POST /login"))`,
          expectedOutput: `Valid #1A2B3C: True
Valid #1A2B3Z: False
HTTP verbs: ['GET', 'POST']`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'hex_re = r"^#[0-9A-Fa-f]{6}$"',
          internalEffect: 'Requires # at start (^), exactly 6 hex chars, and immediate end ($).',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 're.findall(r"\\b(GET|POST)\\b", ...)',
          internalEffect: 'Word boundaries \\b ensure "POSTED" is NOT matched as "POST".',
        },
      ],
      apply: {
        domain: 'Input Validation',
        contextTitle: 'Validating Product SKU Format',
        scenario: 'Ensure a SKU string consists strictly of 3 uppercase letters, a hyphen, and 4 digits.',
        code: `import re

sku_ok = lambda s: bool(re.search(r"^[A-Z]{3}-\\d{4}$", s))
print(sku_ok("NGN-2026"), sku_ok("NGN-20269"))`,
        outcome: 'True False',
      },
      commonMistakes: [
        {
          label: 'Omitting $ When Validating Entire Input Strings',
          erroneousCode: `import re
print(bool(re.match(r"\\d{4}", "2026abc")))  # True! Trailing letters allowed!`,
          errorMessage: 'Validation bypass: re.match only anchors the start, not the end',
          explanation: 're.match() checks index 0 but does NOT require the match to reach the end of the string.',
          correctedCode: `print(bool(re.match(r"^\\d{4}$", "2026abc")))  # False`,
        },
      ],
      sourceNotes: 'Covers custom character sets, alternation, and anchors.',
      practise: [
        {
          id: 'd18-s4-ex1',
          title: 'Fix the Bug: Anchoring Full-String Validation',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 15,
          contextScenario: 'Coupon Code Validator',
          prompt: '`re.match(r"[A-Z]{3}\\d{2}", "ABC12EXTRA")` returns a match! Add `$` so only exact 5-character codes match, and print `False` for `"ABC12EXTRA"`.',
          starterCode: `import re

def valid_coupon(code):
    return bool(re.match(r"[A-Z]{3}\\d{2}", code))

print(valid_coupon("ABC12EXTRA"))`,
          solutionCode: `import re

def valid_coupon(code):
    return bool(re.match(r"^[A-Z]{3}\\d{2}$", code))

print(valid_coupon("ABC12EXTRA"))`,
          testCases: [
            { id: 'tc-1', label: 'Prints False', setup: '', expected: 'False', hidden: false },
          ],
          hints: [
            're.match() anchors the start, not the end.',
            'Add $ at the end of the pattern.',
            'r"^[A-Z]{3}\\d{2}$".',
          ],
        },
        {
          id: 'd18-s4-ex2',
          title: 'Write Code: Negated Character Set [^0-9]',
          type: 'write-code',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Text Filter',
          prompt: 'Use `re.findall(r"[^0-9\\s]+", "A1 B22 C")` to extract runs of characters that are neither digits nor whitespace, and print the list.',
          starterCode: `import re

s = "A1 B22 C"
# Extract non-digit, non-whitespace runs
`,
          solutionCode: `import re

s = "A1 B22 C"
print(re.findall(r"[^0-9\\s]+", s))`,
          testCases: [
            { id: 'tc-1', label: "Prints ['A', 'B', 'C']", setup: '', expected: "['A', 'B', 'C']", hidden: false },
          ],
          hints: [
            '^ inside [...] negates the character class.',
            'Use re.findall(r"[^0-9\\s]+", s).',
            "['A', 'B', 'C'].",
          ],
        },
        {
          id: 'd18-s4-ex3',
          title: 'Order the Lines: Word-Boundary Alternation Check',
          type: 'order-the-lines',
          tier: 'foundation',
          points: 10,
          contextScenario: 'SQL Keyword Scanner',
          prompt: 'Order the lines to find standalone `"WARN"` or `"ERR"` tokens using `\\b`.',
          jumbledLines: [
            { id: 'l3', code: 'print(re.findall(pat, "WARN: low disk, ERROR"))', indent: 0 },
            { id: 'l1', code: 'import re', indent: 0 },
            { id: 'l2', code: 'pat = r"\\b(?:WARN|ERR)\\b"', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3'],
          hints: [
            'Import re first.',
            'Define pat next.',
            'Call re.findall(pat, ...) last.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day18-sub5',
      number: 5,
      title: 'Quantifiers (*, +, ?, {m,n}) & Greedy vs Lazy (.*?) Matching',
      summary: 'Control repetition counts and avoid over-matching HTML/quotes by switching from greedy to lazy quantifiers.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'How Much Text Should a Quantifier Consume?',
        paragraphs: [
          'Quantifiers specify how many times the preceding token can repeat: **`*`** (0 or more), **`+`** (1 or more), **`?`** (0 or 1, optional), **`{m}`** (exact `m`), and **`{m,n}`** (between `m` and `n`).',
          'By default, all Python quantifiers are **greedy**—they match as many characters as possible while still allowing the overall pattern to succeed. On `"<b>hi</b><i>bye</i>"`, `r"<.*>"` stretches from the first `<` all the way to the very last `>`!',
          'Appending `?` after any quantifier (**`*?`**, **`+?`**, **`??`**, **`{m,n}?`**) makes it **lazy** (non-greedy): it matches as **few** characters as possible, stopping at the first `>`.',
        ],
        keyTerms: [
          {
            term: 'Greedy Quantifier (*, +)',
            definition: 'Default matching mode that consumes the longest possible substring.',
          },
          {
            term: 'Lazy Quantifier (*?, +?)',
            definition: 'Non-greedy mode that consumes the shortest possible substring.',
          },
        ],
        bulletPoints: [
          '`*` allows 0 matches (empty string); `+` requires at least 1 match.',
          'Use `.*?` or negated character classes like `[^"]+` when extracting delimited tokens.',
        ],
      },
      visualise: {
        type: 'regex-quantifier-sim',
        title: 'Greedy (<.*>) vs Lazy (<.*?>) Stepper',
        badge: 'simulation',
        description: 'Toggle between greedy and lazy matching to see why <.*> swallows multiple tags.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Greedy vs Lazy Extraction',
          runMode: 'real',
          code: `import re

html = "<b>hi</b> and <i>bye</i>"
print("Greedy:", re.findall(r"<.*>", html))
print("Lazy:", re.findall(r"<.*?>", html))
print("Optional s:", re.findall(r"https?://\\S+", "http://a.io https://b.io"))`,
          expectedOutput: `Greedy: ['<b>hi</b> and <i>bye</i>']
Lazy: ['<b>', '</b>', '<i>', '</i>']
Optional s: ['http://a.io', 'https://b.io']`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 're.findall(r"<.*>", html)',
          internalEffect: 'Greedy .* eats everything from the first < to the final >, returning 1 huge match.',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: 're.findall(r"<.*?>", html)',
          internalEffect: 'Lazy .*? stops at each closing >, returning all 4 individual tags.',
        },
      ],
      apply: {
        domain: 'Text Extraction',
        contextTitle: 'Extracting Quoted Strings from Logs',
        scenario: 'Extract every double-quoted value from a structured log line without spanning across quotes.',
        code: `import re

log = 'user="ada" action="login" status="ok"'
print(re.findall(r'"(.*?)"', log))`,
        outcome: "['ada', 'login', 'ok']",
      },
      commonMistakes: [
        {
          label: 'Using Greedy .* Between Delimiters',
          erroneousCode: `import re
s = 'a="1" b="2"'
print(re.findall(r'"(.*)"', s))  # ['1" b="2']!`,
          errorMessage: 'Over-match bug: greedy .* spans from first quote to last quote',
          explanation: 'Greedy .* matches across the closing quote of the first field.',
          correctedCode: `print(re.findall(r'"(.*?)"', s))  # ['1', '2']`,
        },
      ],
      sourceNotes: 'Covers quantifiers and greedy vs lazy matching.',
      practise: [
        {
          id: 'd18-s5-ex1',
          title: 'Theory: Greedy .* vs Lazy .*?',
          type: 'theory-reasoning',
          tier: 'challenge',
          points: 20,
          contextScenario: 'HTML Tag Scraper Bug',
          prompt: 'Why does `re.findall(r"<.*>", "<a>1</a><b>2</b>")` return a single string instead of four tags, and how does `.*?` fix it?',
          modelAnswer: 'By default, * is greedy: it consumes as many characters as possible from the first < to the very last >. Adding ? (r"<.*?>") makes it lazy (non-greedy), so it stops at the earliest closing > for each tag.',
          markingCriteria: [
            { id: 'mc-1', label: 'Explains greedy * stretches to the last >', points: 10 },
            { id: 'mc-2', label: 'Explains lazy *? stops at the first closing >', points: 10 },
          ],
          hints: [
            'What is the default behavior of * in Python regex?',
            'Where does greedy .* stop?',
            'Adding ? switches to lazy matching.',
          ],
        },
        {
          id: 'd18-s5-ex2',
          title: 'Write Code: Lazy Quoted Value Extraction',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'Config Attribute Parser',
          prompt: 'Use `re.findall()` with a lazy quantifier on `\'k1="v1" k2="v2"\'` to print `[\'v1\', \'v2\']`.',
          starterCode: `import re

cfg = 'k1="v1" k2="v2"'
# Extract quoted values lazily
`,
          solutionCode: `import re

cfg = 'k1="v1" k2="v2"'
print(re.findall(r'"(.*?)"', cfg))`,
          testCases: [
            { id: 'tc-1', label: "Prints ['v1', 'v2']", setup: '', expected: "['v1', 'v2']", hidden: false },
          ],
          hints: [
            'Use a capturing group inside quotes: "(.*?)".',
            'The ? after * prevents spanning across quotes.',
            're.findall(r\'"(.*?)"\', cfg).',
          ],
        },
        {
          id: 'd18-s5-ex3',
          title: 'Predict Output: + vs * Quantifiers',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Prefix Matcher',
          prompt: 'What does `print(bool(re.match(r"a+b", "b")), bool(re.match(r"a*b", "b")))` output?',
          options: [
            { id: 'opt-1', text: 'False True', explanation: 'Correct! + requires 1 or more "a"s, while * allows 0 "a"s.', isCorrect: true },
            { id: 'opt-2', text: 'True True', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'False False', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'True False', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'How many "a"s are in "b"?',
            'Does + allow 0 repetitions?',
            'False True.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day18-sub6',
      number: 6,
      title: 'Capturing Groups (...), Named Groups (?P<name>...) & Non-Capturing (?:...)',
      summary: 'Extract sub-fields from matches cleanly by index or by name without polluting findall() output.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Structured Extraction with Groups',
        paragraphs: [
          'Parentheses `(...)` create a **capturing group**. On a `Match` object `m`, `m.group(0)` is the full match, while `m.group(1)`, `m.group(2)`, etc., return each captured sub-expression.',
          '**Named capturing groups** `(?P<name>...)` make complex patterns self-documenting: you can read `m.group("user")` or call `m.groupdict()` to get a Python dictionary of all named captures!',
          'Sometimes you only need parentheses for grouping alternation or a quantifier (like `(?:http|https)://`) and do **not** want to capture it. Use **`(?:...)`** (non-capturing group) so `re.findall()` and `m.group(1)` stay clean.',
        ],
        keyTerms: [
          {
            term: 'Named Group (?P<name>...)',
            definition: 'Capturing group accessible by name via m.group("name") or m.groupdict().',
          },
          {
            term: 'Non-Capturing Group (?:...)',
            definition: 'Groups tokens for quantifiers or | alternation without creating a capture group.',
          },
        ],
        bulletPoints: [
          'Remember: if a pattern has 1+ capturing groups, `re.findall()` returns only the captured group strings/tuples, not the full match.',
          'Use `(?:...)` whenever grouping `|` or `+` without wanting an extra capture.',
        ],
      },
      visualise: {
        type: 'regex-groups-sim',
        title: 'Capturing, Named & Non-Capturing Groups Inspector',
        badge: 'simulation',
        description: 'Inspect group(0), group(1), groupdict(), and non-capturing (?:...) behavior.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Named Groups & Non-Capturing Groups',
          runMode: 'real',
          code: `import re

pat = r"(?P<user>\\w+)@(?P<domain>[\\w.-]+)"
m = re.search(pat, "Contact: ada@example.org")
print("Dict:", m.groupdict())

urls = "http://a.com https://b.org"
print("Hosts:", re.findall(r"(?:https?://)([\\w.-]+)", urls))`,
          expectedOutput: `Dict: {'user': 'ada', 'domain': 'example.org'}
Hosts: ['a.com', 'b.org']`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'm.groupdict()',
          internalEffect: 'Maps each (?P<name>...) group name to its matched substring.',
        },
        {
          step: 2,
          codeLine: 8,
          instruction: 're.findall(r"(?:https?://)([\\w.-]+)", urls)',
          internalEffect: '(?:https?://) is non-capturing, so findall() returns only the captured hostname.',
        },
      ],
      apply: {
        domain: 'Log Analytics',
        contextTitle: 'Parsing Structured HTTP Log Lines',
        scenario: 'Extract method, path, and status code into a dictionary using named groups.',
        code: `import re

line = "POST /api/orders 201"
m = re.match(r"(?P<method>\\w+) (?P<path>\\S+) (?P<status>\\d{3})", line)
print(m.groupdict())`,
        outcome: "{'method': 'POST', 'path': '/api/orders', 'status': '201'}",
      },
      commonMistakes: [
        {
          label: 'Unexpected Tuple Output from re.findall() Due to Capturing Group',
          erroneousCode: `import re
print(re.findall(r"(cat|dog)s?", "cat dogs"))  # Drops the trailing "s"!`,
          errorMessage: 'Logic bug: findall returns ["cat", "dog"] instead of ["cat", "dogs"]',
          explanation: 'A capturing group (...) makes findall() return only what is inside the parentheses.',
          correctedCode: `print(re.findall(r"(?:cat|dog)s?", "cat dogs"))  # ['cat', 'dogs']`,
        },
      ],
      sourceNotes: 'Covers capturing, named, and non-capturing groups.',
      practise: [
        {
          id: 'd18-s6-ex1',
          title: 'Write Code: Named Groups & .groupdict()',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'SemVer Release Parser',
          prompt: 'Use `re.match(r"v(?P<major>\\d+)\\.(?P<minor>\\d+)", "v3.12")` and print `m.groupdict()`.',
          starterCode: `import re

tag = "v3.12"
# Match with named groups major and minor and print groupdict()
`,
          solutionCode: `import re

tag = "v3.12"
m = re.match(r"v(?P<major>\\d+)\\.(?P<minor>\\d+)", tag)
print(m.groupdict())`,
          testCases: [
            { id: 'tc-1', label: "Prints {'major': '3', 'minor': '12'}", setup: '', expected: "{'major': '3', 'minor': '12'}", hidden: false },
          ],
          hints: [
            'Named group syntax is (?P<name>...).',
            'Escape the literal dot as \\.',
            'Print m.groupdict().',
          ],
        },
        {
          id: 'd18-s6-ex2',
          title: 'Explain the Trace: Why (?:...) Fixes findall()',
          type: 'explain-the-trace',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Plural Noun Extractor',
          prompt: 'Explain why `re.findall(r"(cat|dog)s?", "cat dogs")` returns `["cat", "dog"]` instead of `["cat", "dogs"]`, and how `(?:...)` fixes it.',
          traceStepCode: `import re
print(re.findall(r"(cat|dog)s?", "cat dogs"))
print(re.findall(r"(?:cat|dog)s?", "cat dogs"))`,
          traceQuestion: 'Why does the first call drop the trailing "s" while the second keeps "dogs"?',
          modelAnswer: 'When a regex contains a capturing group (...), re.findall() returns only the captured group contents rather than the full match, dropping the trailing s?. Switching to a non-capturing group (?:cat|dog) removes the capture group so findall() returns the full matched strings ["cat", "dogs"].',
          markingCriteria: [
            { id: 'mc-1', label: 'Explains capturing groups cause findall() to return only group text', points: 10 },
            { id: 'mc-2', label: 'Explains (?:...) groups alternation without capturing', points: 10 },
          ],
          hints: [
            'What does re.findall() return when capturing groups are present?',
            'What does (?:...) do?',
            'Non-capturing groups let findall() return the full match.',
          ],
        },
        {
          id: 'd18-s6-ex3',
          title: 'Fill the Gaps: Accessing Group 1',
          type: 'fill-the-gaps',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Path Parameter Extraction',
          prompt: 'Complete the expression to read the first captured group from Match object `m`.',
          gaps: [
            { id: 'g-1', beforeText: 'user_id = m.', afterText: '(1)', correctAnswer: 'group', options: ['group', 'groups', 'match', 'span'] },
          ],
          hints: [
            'Which method on a Match object takes a group index?',
            'Singular, not plural.',
            'm.group(1).',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day18-sub7',
      number: 7,
      title: 'Compiling Patterns (re.compile()) & Flags (IGNORECASE, MULTILINE, DOTALL)',
      summary: 'Pre-compile frequently used regexes and tune matching behavior across case and newlines with flags.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Reusable Compiled Patterns & Engine Flags',
        paragraphs: [
          'If you run the same regex inside a loop or across thousands of records, call **`re.compile(pattern, flags=0)`** once at module or function setup. It returns a reusable `re.Pattern` object with `.search()`, `.match()`, `.findall()`, and `.sub()` methods.',
          'Flags customize how the engine interprets characters: **`re.IGNORECASE`** (`re.I`) makes letter matching case-insensitive; **`re.MULTILINE`** (`re.M`) makes `^` and `$` match the start and end of *each line* (not just the whole string); and **`re.DOTALL`** (`re.S`) lets `.` match newline `\\n` characters.',
          'You can combine multiple flags using the bitwise OR operator `|`: `re.compile(r"^warn:", re.IGNORECASE | re.MULTILINE)`.',
        ],
        keyTerms: [
          {
            term: 're.compile()',
            definition: 'Pre-compiles a regex string and flags into a reusable Pattern object.',
          },
          {
            term: 're.MULTILINE / re.DOTALL',
            definition: 'MULTILINE makes ^/$ match per-line; DOTALL makes . match newlines.',
          },
        ],
        bulletPoints: [
          'Combine multiple flags with `|` (e.g., `re.I | re.M`), never `+`.',
          'Use `re.VERBOSE` (`re.X`) for multi-line commented regexes in complex parsers.',
        ],
      },
      visualise: {
        type: 'regex-groups-sim',
        title: 'Compiled Pattern & Flags Inspector',
        badge: 'simulation',
        description: 'Inspect how re.compile() and flags like re.IGNORECASE alter matching.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Compiled Pattern with IGNORECASE | MULTILINE',
          runMode: 'real',
          code: `import re

log_text = "INFO: started\\nerror: disk full\\nERROR: timeout"
err_pat = re.compile(r"^error:\\s+(.+)$", re.IGNORECASE | re.MULTILINE)

print("Errors:", err_pat.findall(log_text))`,
          expectedOutput: `Errors: ['disk full', 'timeout']`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 're.compile(r"^error:\\s+(.+)$", re.IGNORECASE | re.MULTILINE)',
          internalEffect: 'Compiles a case-insensitive pattern where ^ and $ match each line boundary.',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 'err_pat.findall(log_text)',
          internalEffect: 'Finds both "error: disk full" and "ERROR: timeout", returning the captured messages.',
        },
      ],
      apply: {
        domain: 'Configuration',
        contextTitle: 'Case-Insensitive Header Extraction',
        scenario: 'Extract a Bearer token regardless of whether the header says "Authorization:" or "authorization:".',
        code: `import re

auth_re = re.compile(r"^authorization:\\s*bearer\\s+(\\S+)$", re.I | re.M)
headers = "Host: api.io\\nauthorization: Bearer tok_991"
print("Token:", auth_re.search(headers).group(1))`,
        outcome: 'Token: tok_991',
      },
      commonMistakes: [
        {
          label: 'Forgetting re.MULTILINE on Multi-Line Text with ^',
          erroneousCode: `import re
text = "ok\\nERR: fail"
print(re.findall(r"^ERR:.*", text))  # [] because ^ only checks index 0!`,
          errorMessage: 'Logic bug: ^ only matches the start of the whole string without re.MULTILINE',
          explanation: 'Add re.MULTILINE so ^ matches right after every \\n.',
          correctedCode: `print(re.findall(r"^ERR:.*", text, flags=re.MULTILINE))  # ['ERR: fail']`,
        },
      ],
      sourceNotes: 'Covers re.compile() and regex flags.',
      practise: [
        {
          id: 'd18-s7-ex1',
          title: 'Write Code: Pre-Compiled Case-Insensitive Multi-Line Search',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'CI/CD Build Log Scanner',
          prompt: 'Compile `r"^fail:\\s*(\\w+)"` with `re.IGNORECASE | re.MULTILINE` and print `.findall()` on `"OK: lint\\nFAIL: tests\\nfail: build"`.',
          starterCode: `import re

log = "OK: lint\\nFAIL: tests\\nfail: build"
# Compile pattern with IGNORECASE | MULTILINE and print findall(log)
`,
          solutionCode: `import re

log = "OK: lint\\nFAIL: tests\\nfail: build"
pat = re.compile(r"^fail:\\s*(\\w+)", re.IGNORECASE | re.MULTILINE)
print(pat.findall(log))`,
          testCases: [
            { id: 'tc-1', label: "Prints ['tests', 'build']", setup: '', expected: "['tests', 'build']", hidden: false },
          ],
          hints: [
            'Combine flags using bitwise OR: re.IGNORECASE | re.MULTILINE.',
            'Use pat = re.compile(...).',
            'Call pat.findall(log).',
          ],
        },
        {
          id: 'd18-s7-ex2',
          title: 'Scenario: What re.DOTALL Changes',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Multi-Line Comment Stripper',
          prompt: 'By default, `.` matches any character except `\\n`. Which flag allows `.` to match newline `\\n` characters as well?',
          options: [
            { id: 'opt-1', text: 're.DOTALL (re.S)', explanation: 'Correct!', isCorrect: true },
            { id: 'opt-2', text: 're.MULTILINE (re.M)', explanation: 'Incorrect. MULTILINE changes ^ and $, not .', isCorrect: false },
            { id: 'opt-3', text: 're.IGNORECASE (re.I)', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 're.VERBOSE (re.X)', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'MULTILINE affects ^ and $.',
            'Which flag literally means "dot matches all"?',
            're.DOTALL.',
          ],
        },
        {
          id: 'd18-s7-ex3',
          title: 'Fix the Bug: Combining Flags with | Instead of +',
          type: 'fix-the-bug',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Header Matcher',
          prompt: 'Fix the flag combination to use bitwise OR `|` (standard Python idiom) so `"ERROR: 500"` matches on line 2.',
          starterCode: `import re

pat = re.compile(r"^error: \\d+", re.I)
print(pat.findall("ok\\nERROR: 500"))`,
          solutionCode: `import re

pat = re.compile(r"^error: \\d+", re.I | re.M)
print(pat.findall("ok\\nERROR: 500"))`,
          testCases: [
            { id: 'tc-1', label: "Prints ['ERROR: 500']", setup: '', expected: "['ERROR: 500']", hidden: false },
          ],
          hints: [
            'Right now ^ only matches start of the whole string.',
            'Add re.M with |.',
            're.I | re.M.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day18-sub8',
      number: 8,
      title: 'Real-World Extraction & Validation (Emails, Phones, Log Cleaning)',
      summary: 'Combine character classes, quantifiers, groups, and re.sub() to extract emails/phones and sanitize messy text.',
      estimatedMinutes: 12,
      introduce: {
        headline: 'Applying Regex to Messy Real-World Text',
        paragraphs: [
          'In production Python, regex shines at **extracting structured entities** (emails, phone numbers, URLs, semantic versions) from unstructured text and **cleaning** scraped or user-submitted strings.',
          'For practical email extraction, a pattern like `r"[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}"` captures standard local parts, `@`, domain labels, and top-level domains (`2+` letters).',
          'For text sanitization, chaining `re.sub()`—for example stripping non-alphanumeric noise (`r"[^\\w\\s]"`) and collapsing repeated whitespace (`r"\\s+"` -> `" "`)—turns messy logs into clean, tokenizable sentences.',
        ],
        keyTerms: [
          {
            term: 'Text Sanitization',
            definition: 'Using re.sub() to strip noise characters and collapse irregular whitespace.',
          },
        ],
        bulletPoints: [
          'Always test real-world regexes against edge cases (subdomains, `+` in emails, leading/trailing spaces).',
          'Never use regex to parse nested HTML/JSON—use dedicated parsers like `json` or `html.parser` for nested grammars.',
        ],
      },
      visualise: {
        type: 'regex-groups-sim',
        title: 'Email & Structured Entity Extraction Lab',
        badge: 'simulation',
        description: 'Inspect how email patterns capture user and domain components cleanly.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Extracting Emails & Sanitizing Messy Logs',
          runMode: 'real',
          code: `import re

messy = "  Reach  ada.lovelace+py@uni-lagos.edu.ng  or  ops@cloud.io!!  "
emails = re.findall(r"[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+", messy)
cleaned = re.sub(r"\\s+", " ", re.sub(r"[!]+", "", messy)).strip()

print("Emails:", emails)
print("Cleaned:", cleaned)`,
          expectedOutput: `Emails: ['ada.lovelace+py@uni-lagos.edu.ng', 'ops@cloud.io']
Cleaned: Reach ada.lovelace+py@uni-lagos.edu.ng or ops@cloud.io`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 're.findall(r"[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+", messy)',
          internalEffect: 'Matches multi-segment domains like uni-lagos.edu.ng using a non-capturing group (?:\\.[\\w-]+)+.',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: 're.sub(r"\\s+", " ", ...).strip()',
          internalEffect: 'Collapses multiple spaces into a single space and trims leading/trailing whitespace.',
        },
      ],
      apply: {
        domain: 'NLP Preprocessing',
        contextTitle: 'Cleaning Scraped Product Reviews',
        scenario: 'Remove punctuation symbols and normalize whitespace before counting word frequencies.',
        code: `import re

review = "Great!!   Fast   delivery...   10/10."
clean = re.sub(r"\\s+", " ", re.sub(r"[^\\w\\s/]", "", review)).strip()
print(clean)`,
        outcome: 'Great Fast delivery 10/10',
      },
      commonMistakes: [
        {
          label: 'Forgetting + in Email Local-Part or Multi-Dot Domains',
          erroneousCode: `import re
print(re.findall(r"\\w+@\\w+\\.\\w+", "ada+1@uni.edu.ng"))  # []!`,
          errorMessage: 'Missed match: + and multi-dot .edu.ng are not matched by simple \\w+@\\w+\\.\\w+',
          explanation: 'Real emails often contain dots, hyphens, or + tags in the local part and multiple domain segments.',
          correctedCode: `print(re.findall(r"[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+", "ada+1@uni.edu.ng"))`,
        },
      ],
      sourceNotes: 'Covers email/phone extraction and text sanitization.',
      practise: [
        {
          id: 'd18-s8-ex1',
          title: 'Write Code: Extract Emails & Normalize Whitespace',
          type: 'write-code',
          tier: 'project',
          points: 20,
          contextScenario: 'Support Inbox Cleaner',
          prompt: 'Given `raw = "  Ping  ada@dev.io   or  tunde.b@uni.edu.ng! "`, extract all emails with `r"[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+"` and print them.',
          starterCode: `import re

raw = "  Ping  ada@dev.io   or  tunde.b@uni.edu.ng! "
# Extract and print all emails
`,
          solutionCode: `import re

raw = "  Ping  ada@dev.io   or  tunde.b@uni.edu.ng! "
print(re.findall(r"[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+", raw))`,
          testCases: [
            { id: 'tc-1', label: "Prints ['ada@dev.io', 'tunde.b@uni.edu.ng']", setup: '', expected: "['ada@dev.io', 'tunde.b@uni.edu.ng']", hidden: false },
          ],
          hints: [
            'Use re.findall(r"[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+", raw).',
            'The non-capturing group ensures full emails are returned.',
            'Print the resulting list.',
          ],
        },
        {
          id: 'd18-s8-ex2',
          title: 'Write Code: Collapse Repeated Spaces & Punctuation',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'Search Query Sanitizer',
          prompt: 'Clean `q = "  python   regex!!  guide?? "` by removing `!` and `?`, collapsing multiple spaces with `re.sub(r"\\s+", " ", ...)`, stripping edges, and printing the result.',
          starterCode: `import re

q = "  python   regex!!  guide?? "
# Remove ! and ?, collapse whitespace, strip, and print
`,
          solutionCode: `import re

q = "  python   regex!!  guide?? "
clean = re.sub(r"\\s+", " ", re.sub(r"[!?]+", "", q)).strip()
print(clean)`,
          testCases: [
            { id: 'tc-1', label: 'Prints python regex guide', setup: '', expected: 'python regex guide', hidden: false },
          ],
          hints: [
            'First remove [!?]+ with re.sub().',
            'Then collapse \\s+ to " ".',
            'Call .strip() at the end.',
          ],
        },
        {
          id: 'd18-s8-ex3',
          title: 'Scenario: When NOT to Use Regex',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Architecture Review',
          prompt: 'A teammate suggests writing a single regex to parse arbitrarily nested JSON payloads. Why is that an anti-pattern?',
          options: [
            { id: 'opt-1', text: 'Nested structures are not regular languages; use json.loads() instead of fragile regexes.', explanation: 'Correct! Use dedicated parsers for nested JSON, XML, or HTML.', isCorrect: true },
            { id: 'opt-2', text: 'Python re cannot match curly braces.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'Regex only works on numbers.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'json.loads() uses regex internally.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Can standard regex reliably match arbitrary nesting depth?',
            'What standard library module parses JSON?',
            'Use json.loads() for nested JSON.',
          ],
        },
      ],
      assess: [],
    },
  ],
  realWorldLabs: [
    {
      id: 'day18-lab1',
      title: 'Support Ticket Email & Phone Extractor',
      description: 'Extract contact emails and normalized 11-digit/international phone numbers from an unstructured customer support ticket.',
      domain: 'CRM Automation',
      starterCode: `import re

ticket = "From: ada.o+vip@fintech.ng | Alt: ops@fintech.ng | Tel: +234-803-555-0199"
emails = re.findall(r"[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+", ticket)
phones = re.findall(r"\\+?\\d[\\d-]{7,}\\d", ticket)

print("Emails:", emails)
print("Phones:", phones)`,
      targetOutput: `Emails: ['ada.o+vip@fintech.ng', 'ops@fintech.ng']
Phones: ['+234-803-555-0199']`,
    },
    {
      id: 'day18-lab2',
      title: 'Multi-Line Server Log Redactor & Error Summarizer',
      description: 'Redact IPv4 addresses with re.sub() and extract all ERROR messages across multiple lines using re.compile() with IGNORECASE | MULTILINE.',
      domain: 'Observability & Security',
      starterCode: `import re

logs = "INFO 10.0.1.4 started\\nerror 10.0.1.4 timeout\\nERROR 192.168.1.9 disk_full"
redacted = re.sub(r"\\b\\d{1,3}(?:\\.\\d{1,3}){3}\\b", "[IP]", logs)
err_pat = re.compile(r"^error\\s+\\[IP\\]\\s+(\\w+)$", re.IGNORECASE | re.MULTILINE)

print("Errors:", err_pat.findall(redacted))`,
      targetOutput: `Errors: ['timeout', 'disk_full']`,
    },
  ],
  miniProject: {
    id: 'day18-project',
    title: 'Log Sanitizer & Contact Extractor',
    brief: 'Build a reusable regex toolkit that sanitizes messy text, masks PII (IPs/cards), validates SKUs with ^...$ anchors, and extracts structured entities using named groups (?P<name>...).',
    requirements: [
      'Pre-compile reusable patterns with re.compile() and appropriate flags',
      'Use raw strings (r"...") and non-capturing groups (?:...) cleanly',
      'Extract structured fields into dicts using named groups (?P<name>...) and .groupdict()',
      'Use lazy quantifiers (.*?) when extracting delimited tokens without over-matching',
      'Sanitize whitespace and mask sensitive digits using re.sub()',
    ],
    rubric: [
      { criterion: 'Accurate regex patterns with raw strings and ^...$ anchoring', weight: 40 },
      { criterion: 'Clean named/non-capturing groups and lazy quantifiers', weight: 30 },
      { criterion: 'Safe PII masking and whitespace sanitization with re.sub()', weight: 30 },
    ],
    starterCode: `# Log Sanitizer & Contact Extractor
import re

def analyze_ticket(text: str) -> dict:
    # Extract emails, mask numbers, and return summary dict
    pass
`,
  },
  dayQuiz: {
    title: 'Day 18 Mastery Checkpoint Quiz: Regular Expressions',
    passingScorePercentage: 80,
    questions: [
      {
        id: 'd18-q1',
        scenario: 'Raw Strings',
        question: 'Why should Python regex patterns always use raw strings (`r"..."`)?',
        options: [
          { id: 'q1-a', text: 'So backslashes like \\b, \\d, and \\s reach the regex engine literally instead of being interpreted as Python string escapes.', explanation: 'Correct!', isCorrect: true },
          { id: 'q1-b', text: 'Raw strings make regexes run 100x faster.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q1-c', text: 're.search() raises SyntaxError without r.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q1-d', text: 'Raw strings automatically enable re.IGNORECASE.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd18-q2',
        scenario: 'match vs search',
        question: 'What is the key difference between `re.match()` and `re.search()`?',
        options: [
          { id: 'q2-a', text: 're.match() only checks at index 0, whereas re.search() scans anywhere in the string for the first match.', explanation: 'Correct!', isCorrect: true },
          { id: 'q2-b', text: 're.match() returns all matches; re.search() returns one.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q2-c', text: 're.search() returns a list of strings.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q2-d', text: 'There is no difference.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd18-q3',
        scenario: 'Shorthand Classes',
        question: 'What does `\\D` match in a regular expression?',
        options: [
          { id: 'q3-a', text: 'Any single non-digit character (complement of \\d).', explanation: 'Correct!', isCorrect: true },
          { id: 'q3-b', text: 'Any decimal digit 0–9.', explanation: 'Incorrect. That is \\d.', isCorrect: false },
          { id: 'q3-c', text: 'End of string.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q3-d', text: 'Any whitespace character.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd18-q4',
        scenario: 'Anchors',
        question: 'Which pattern validates that an entire string consists of exactly 4 digits (and nothing before or after)?',
        options: [
          { id: 'q4-a', text: 'r"^\\d{4}$"', explanation: 'Correct! ^ and $ anchor both ends.', isCorrect: true },
          { id: 'q4-b', text: 'r"\\d{4}"', explanation: 'Incorrect. Matches "12345" or "a1234b".', isCorrect: false },
          { id: 'q4-c', text: 'r"^\\d{4}"', explanation: 'Incorrect. Allows trailing characters.', isCorrect: false },
          { id: 'q4-d', text: 'r"\\d+"', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd18-q5',
        scenario: 'Greedy vs Lazy',
        question: 'What does `re.findall(r"<.*?>", "<a><b>")` return?',
        options: [
          { id: 'q5-a', text: "['<a>', '<b>']", explanation: 'Correct! .*? is lazy and stops at the first >.', isCorrect: true },
          { id: 'q5-b', text: "['<a><b>']", explanation: 'Incorrect. That is greedy <.*>.', isCorrect: false },
          { id: 'q5-c', text: '[]', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q5-d', text: "['a', 'b']", explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd18-q6',
        scenario: 'Named Groups',
        question: 'How do you define a named capturing group called `year` in Python regex?',
        options: [
          { id: 'q6-a', text: '(?P<year>\\d{4})', explanation: 'Correct!', isCorrect: true },
          { id: 'q6-b', text: '(:year:\\d{4})', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q6-c', text: '(?<year>\\d{4})', explanation: 'Incorrect. Python requires ?P<name>.', isCorrect: false },
          { id: 'q6-d', text: '(?:year:\\d{4})', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd18-q7',
        scenario: 'Non-Capturing Groups',
        question: 'Why would you use `(?:...)` instead of `(...)`?',
        options: [
          { id: 'q7-a', text: 'To group alternation or quantifiers without creating a capture group that alters group(1) or findall().', explanation: 'Correct!', isCorrect: true },
          { id: 'q7-b', text: 'To make the pattern case-insensitive.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q7-c', text: 'To match across newlines.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q7-d', text: 'To negate a character class.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd18-q8',
        scenario: 'Flags',
        question: 'Which flag makes `^` and `$` match the start and end of each line in a multi-line string?',
        options: [
          { id: 'q8-a', text: 're.MULTILINE (re.M)', explanation: 'Correct!', isCorrect: true },
          { id: 'q8-b', text: 're.DOTALL (re.S)', explanation: 'Incorrect. DOTALL makes . match \\n.', isCorrect: false },
          { id: 'q8-c', text: 're.IGNORECASE (re.I)', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q8-d', text: 're.ASCII (re.A)', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd18-q9',
        scenario: 're.sub()',
        question: 'What does `re.sub(r"\\s+", " ", "a   b\\tc")` return?',
        options: [
          { id: 'q9-a', text: '"a b c"', explanation: 'Correct! \\s+ collapses any run of spaces/tabs into a single space.', isCorrect: true },
          { id: 'q9-b', text: '"a   b c"', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q9-c', text: "['a', 'b', 'c']", explanation: 'Incorrect. That would be re.split().', isCorrect: false },
          { id: 'q9-d', text: '"abc"', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd18-q10',
        scenario: 'Literal Escaping',
        question: 'Which pattern matches a literal `$5.00` without treating `$` or `.` as metacharacters?',
        options: [
          { id: 'q10-a', text: 'r"\\$5\\.00"', explanation: 'Correct! Both $ and . are escaped.', isCorrect: true },
          { id: 'q10-b', text: 'r"$5.00"', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q10-c', text: 'r"$5\\.00"', explanation: 'Incorrect. $ is still an end-of-string anchor.', isCorrect: false },
          { id: 'q10-d', text: 'r"\\$5.00"', explanation: 'Incorrect. . still matches any character.', isCorrect: false },
        ],
      },
    ],
  },
  cheatSheet: [
    {
      category: 'Raw Strings (r"...") & re.match() vs re.search()',
      syntax: 're.match(r"...", s) | re.search(r"...", s)',
      description: 'Always prefix regexes with r"..." so backslashes pass literally to re. match() only checks index 0; search() scans the whole string for the first match.',
      example: `import re
text = "Order #402"
print("match:", re.match(r"\\d+", text))
print("search:", re.search(r"\\d+", text).group())`,
    },
    {
      category: 're.findall(), re.finditer(), re.sub() & re.split()',
      syntax: 're.findall(p, s) | re.sub(p, repl, s) | re.split(p, s)',
      description: 'findall() returns all non-overlapping matches; finditer() yields Match objects lazily; sub() returns a replaced string; split() splits on regex delimiters.',
      example: `import re
print(re.findall(r"\\d+", "a1 b22"))
print(re.sub(r"\\d+", "#", "a1 b22"))
print(re.split(r"[,;\\s]+", "x, y; z"))`,
    },
    {
      category: 'Shorthand Classes (\\d, \\w, \\s), Negation (\\D, \\W, \\S) & Escaping',
      syntax: 'r"\\d+" | r"\\w+" | r"\\s+" | r"\\D" | r"\\."',
      description: '\\d (digit), \\w (letter/digit/_), \\s (whitespace) and uppercase negated twins \\D, \\W, \\S. Escape literal metacharacters like \\. or \\$.',
      example: `import re
print(re.sub(r"\\D", "", "(+234) 803-555"))
print(bool(re.search(r"v1\\.2", "v1.2")))`,
    },
    {
      category: 'Character Sets ([a-z], [^0-9]), Alternation (|) & Anchors (^, $, \\b)',
      syntax: 'r"^[A-Z]{3}-\\d{4}$" | r"\\b(GET|POST)\\b"',
      description: 'Use [...] for custom character sets, [^...] for negation, | for OR, \\b for word boundaries, and ^...$ to validate an entire string.',
      example: `import re
print(bool(re.match(r"^[A-Z]{3}-\\d{4}$", "NGN-2026")))
print(re.findall(r"\\b(?:GET|POST)\\b", "GET / POSTED POST /"))`,
    },
    {
      category: 'Quantifiers (*, +, ?, {m,n}) & Greedy vs Lazy (.*?)',
      syntax: 'r"<.*>" (greedy) vs r"<.*?>" (lazy)',
      description: '* (0+), + (1+), ? (0/1), {m,n} are greedy by default. Append ? (*?, +?, ??) for lazy (shortest) matching.',
      example: `import re
html = "<a>1</a><b>2</b>"
print("Greedy:", re.findall(r"<.*>", html))
print("Lazy:", re.findall(r"<.*?>", html))`,
    },
    {
      category: 'Capturing (...), Named (?P<name>...) & Non-Capturing (?:...) Groups',
      syntax: 'r"(?P<user>\\w+)@(?P<host>[\\w.-]+)" | r"(?:https?://)([\\w.-]+)"',
      description: 'Use (?P<name>...) with .groupdict() for readable extraction, and (?:...) to group without capturing in findall().',
      example: `import re
m = re.search(r"(?P<user>\\w+)@(?P<host>[\\w.-]+)", "ada@dev.io")
print(m.groupdict())`,
    },
    {
      category: 're.compile() & Engine Flags (IGNORECASE, MULTILINE, DOTALL)',
      syntax: 'pat = re.compile(r"^err:\\s*(\\w+)", re.I | re.M)',
      description: 'Pre-compile repeated patterns with re.compile(). Combine flags with |: re.I (case-insensitive), re.M (^/$ per line), re.S (. matches \\n).',
      example: `import re
pat = re.compile(r"^err:\\s*(\\w+)", re.IGNORECASE | re.MULTILINE)
print(pat.findall("ok\\nERR: timeout"))`,
    },
    {
      category: 'Email, Phone & Text Sanitization Patterns',
      syntax: 're.sub(r"\\s+", " ", text).strip()',
      description: 'Extract emails with [\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+ and normalize whitespace with re.sub(r"\\s+", " ", ...). Never parse nested JSON/HTML with regex.',
      example: `import re
raw = "  Ping  ada+1@uni.edu.ng!!  "
print(re.findall(r"[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+", raw))
print(re.sub(r"\\s+", " ", re.sub(r"[!]+", "", raw)).strip())`,
    },
  ],
  sourceNotes: [
    'Curriculum reference: https://github.com/Asabeneh/30-Days-Of-Python/tree/master/18_Day_Regular_expressions',
  ],
};
