/**
 * Day 4 Module: Strings ★ (Beginner)
 * Master Specification Section 14 (Day 4 Build Brief), Section 13.2 (Part A), Section 10.1 & 10.2
 * Source attribution: Asabeneh Yetayeh's "30 Days of Python" (Day 4 - Strings)
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_4_MODULE: DayModule = {
  schemaVersion: 1,
  number: 4,
  title: 'Strings',
  level: 'beginner',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/blob/master/04_Day_Strings/04_strings.md',
  estimatedMinutes: 90,
  prerequisites: [2, 3],
  objectives: [
    'Understand strings as ordered sequences of Unicode codepoints and master single, double, and triple-quoted syntax.',
    'Employ escape sequences (\\n, \\t, \\\\, \\\', \\") and raw string literals (r"...") safely in file paths and regex.',
    'Perform string concatenation (+), repetition (*), and leverage the in and not in membership operators.',
    'Format text using %, str.format(), and modern f-strings with format specifiers (e.g. ₦{val:,.2f}, padding, alignment).',
    'Navigate dual 0-indexed positive (0..n-1) and negative (-n..-1) memory addresses and prevent IndexError crashes.',
    'Slice strings using [start:stop:step], reverse sequences idiomatically with [::-1], and master boundary clamping.',
    'Internalize string immutability in memory and recognize why all string methods return fresh object instances.',
    'Search strings accurately using find(), rfind(), index(), rindex(), count(), startswith(), and endswith().',
    'Transform text case (upper, lower, title, capitalize, swapcase, casefold) and navigate the .title() apostrophe trap.',
    'Split strings into lists and glue string iterables with join() without triggering TypeError.',
    'Sanitize data using strip(), replace(), center(), zfill(), and classify characters using isdecimal(), isdigit(), and isnumeric().',
  ],
  subtopics: [
    // ==========================================
    // Subtopic 1: Strings as Sequences & Literal Syntax
    // ==========================================
    {
      id: 'day4-sub1',
      number: 1,
      title: 'Strings as Sequences & Literal Syntax',
      summary: 'Explore strings as ordered sequences of Unicode characters, literal quotation styles, and multiline strings.',
      estimatedMinutes: 7,
      introduce: {
        headline: 'Text as Ordered Codepoint Sequences',
        paragraphs: [
          'In Python, any textual data is represented by the built-in str type. Conceptually, a string is an ordered, immutable sequence of Unicode characters. Because Python 3 natively encodes strings in Unicode (UTF-8 by default), strings can hold any script, accent, mathematical symbol, or emoji.',
          'Python provides three distinct quotation delimiters for creating string literals: single quotes (\'...\'), double quotes ("..."), and triple quotes (\'\'\'...\'\'\' or """..."""). Single and double quotes are semantically identical in Python; choosing between them allows you to embed one type of quotation mark inside another without escape backslashes.',
          'Triple quotes create multiline strings that preserve all internal newline characters and indentation verbatim. They are widely used for multi-sentence descriptions and Python docstrings (documentation attached to modules, classes, and functions). The built-in len() function returns the exact character count of any string.',
        ],
        keyTerms: [
          { term: 'str', definition: 'The built-in immutable Python type representing ordered sequences of Unicode characters.' },
          { term: 'Sequence', definition: 'An iterable data structure where items are ordered linearly and accessible by integer index.' },
          { term: 'Multiline String', definition: 'A string literal enclosed in triple quotes that spans multiple lines and preserves whitespace.' },
          { term: 'len()', definition: 'A built-in Python function that returns the total count of elements or characters in a sequence.' },
        ],
        bulletPoints: [
          'Single and double quotes are interchangeable: \'Python\' == "Python".',
          'Use alternate quotes to embed quotes naturally: "He said \'Welcome\' to the lab".',
          'Triple quotes preserve linebreaks: """Line 1\\nLine 2""".',
          'len() counts every character, including spaces, tabs, and punctuation.',
        ],
      },
      visualise: {
        type: 'string-index-slice',
        title: 'Sequence Memory Strip Visualiser',
        badge: 'simulation',
        description: 'Inspect characters arranged linearly in memory and verify sequence length.',
        initialConfig: { text: 'PYTHON' },
      },
      code: [
        {
          title: 'Creating and Measuring String Literals',
          runMode: 'real',
          code: `# Single, double, and triple-quoted string literals
language = 'Python'
framework = "Visual Lab"
quote = 'He said, "Python strings are clean and versatile."'

# Multiline string preserving linebreaks
manifesto = """Welcome to Python Visual Lab:
1. Interactive Simulations
2. Real CPython Execution
3. Deep Mental Models"""

print("Language:", language)
print("Framework:", framework)
print("Quote:", quote)
print("Length of language:", len(language))
print("Manifesto character count:", len(manifesto))
print("Manifesto preview:")
print(manifesto)`,
          expectedOutput: `Language: Python
Framework: Visual Lab
Quote: He said, "Python strings are clean and versatile."
Length of language: 6
Manifesto character count: 83
Manifesto preview:
Welcome to Python Visual Lab:
1. Interactive Simulations
2. Real CPython Execution
3. Deep Mental Models`,
        },
      ],
      explain: [
        { step: 1, codeLine: 2, instruction: "language = 'Python'", internalEffect: 'Allocates a str object in memory holding 6 characters and binds name language to it.' },
        { step: 2, codeLine: 4, instruction: "quote = '...'", internalEffect: 'Single outer quotes permit unescaped double quotes inside the string body.' },
        { step: 3, codeLine: 7, instruction: 'manifesto = """..."""', internalEffect: 'Compiles newline characters into \\n escape codepoints inside the heap string object.' },
        { step: 4, codeLine: 16, instruction: 'len(language)', internalEffect: 'Queries the internal ob_size C-struct field in O(1) constant time, yielding 6.' },
      ],
      apply: {
        domain: 'Data Engineering & Document Parsing',
        contextTitle: 'Multi-line SQL Query Construction',
        scenario: 'Database engineers write complex multi-table SQL queries spanning multiple lines using Python triple quotes. This keeps the SQL query readable without clumsy string joins.',
      },
      commonMistakes: [
        {
          label: 'Mismatched Closing Quotes',
          explanation: 'Opening a string with double quotes and trying to close it with single quotes raises a SyntaxError: unterminated string literal.',
          erroneousCode: 'title = "Python Lab\'  # SyntaxError: unterminated string literal',
        },
        {
          label: 'Unescaped Same-Quote Embedding',
          explanation: 'Using the same quote delimiter inside the string prematurely terminates the literal, confusing the parser.',
          erroneousCode: 'quote = \'It\'s a wonderful day\'  # SyntaxError: invalid syntax at \'s\'',
        },
      ],
      practise: [
        {
          id: 'd4-s1-ex1',
          title: 'Quotation Syntax in University News Feed',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'University of Ibadan Campus News Automation Portal',
          prompt: 'A reporter needs to output the following text verbatim: The Vice Chancellor said, "Welcome to Ibadan." Which Python string declaration is valid without backslash escaping?',
          options: [
            {
              id: 'opt-1',
              text: '\'The Vice Chancellor said, "Welcome to Ibadan."\'',
              explanation: 'Correct! Enclosing the string in single quotes allows double quotes to be embedded directly without backslash escaping.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: '"The Vice Chancellor said, "Welcome to Ibadan.""',
              explanation: 'Incorrect. Reusing unescaped double quotes inside the string causes a SyntaxError: invalid syntax.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: '\'The Vice Chancellor said, \'Welcome to Ibadan.\'\'',
              explanation: 'Incorrect. Reusing unescaped single quotes inside causes a premature string termination SyntaxError.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'str(The Vice Chancellor said, "Welcome to Ibadan.")',
              explanation: 'Incorrect. Bare text without quotes is treated as invalid Python variable identifiers.',
              isCorrect: false,
            },
          ],
          hints: [
            'Look for alternating quote styles between the outer delimiter and inner quotes.',
            'Single quotes outside can enclose double quotes inside without escapes.',
            'Option 1 uses single quotes on the outside and double quotes on the inside.',
          ],
        },
        {
          id: 'd4-s1-ex2',
          title: 'Constructing a Multiline SQL Query String',
          type: 'order-the-lines',
          tier: 'standard',
          points: 15,
          contextScenario: 'FinTech Database Transaction Auditing',
          prompt: 'Arrange the lines to create a valid multiline SQL query string using triple quotes and print its character length using len().',
          starterCode: '# Order the lines to construct and measure the multiline query\n',
          solutionCode: `query = """SELECT id, amount, recipient
FROM transactions
WHERE status = 'SUCCESS'"""
print("Query length:", len(query))`,
          jumbledLines: [
            { id: 'l1', code: 'query = """SELECT id, amount, recipient', indent: 0 },
            { id: 'l2', code: 'FROM transactions', indent: 0 },
            { id: 'l3', code: 'WHERE status = \'SUCCESS\'"""', indent: 0 },
            { id: 'l4', code: 'print("Query length:", len(query))', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: [
            'Start by assigning triple quotes to the query variable.',
            'Include the FROM and WHERE clauses on subsequent lines.',
            'Close the triple quotes at the end of the query and call len(query).',
          ],
        },
      ],
      sourceNotes: 'Derived from Asabeneh\'s 30 Days of Python: Day 4 Strings (Creating a String & Multiline String sections).',
    },

    // ==========================================
    // Subtopic 2: Escape Sequences & Character Codes
    // ==========================================
    {
      id: 'day4-sub2',
      number: 2,
      title: 'Escape Sequences & Character Codes (ord & chr)',
      summary: 'Master escape characters (\\n, \\t, \\\\), raw string literals (r"..."), and character codepoint translation with ord() and chr().',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Controlling Characters: Escapes, Raw Strings, and Unicode Codepoints',
        paragraphs: [
          'Often you must embed special non-printable control characters—such as a line break, a tab space, or a literal backslash—inside a string. In Python, the backslash (\\) serves as an escape character, signaling that the character immediately following has a special interpretation.',
          'Common escape sequences include: \\n (line feed / new line), \\t (horizontal tab, standard 8 spaces), \\\\ (a literal backslash), \\\' (single quote), and \\" (double quote). When working with file paths (e.g. C:\\new_folder\\test) or regular expressions where backslashes are abundant, you can prefix the literal with r or R (e.g. r"C:\\new_folder") to create a raw string, which disables all escape sequence processing.',
          'Every character in a modern system corresponds to an integer codepoint in the Universal Coded Character Set. Python provides two reciprocal built-in functions: ord() takes a single-character string and returns its Unicode integer value (e.g. ord("A") is 65), while chr() takes an integer and returns the corresponding character string (e.g. chr(65) is "A", chr(0x20A6) is the Nigerian Naira symbol "₦").',
        ],
        keyTerms: [
          { term: 'Escape Sequence', definition: 'A combination of characters beginning with \\ that translates into a non-printable or special character.' },
          { term: 'Raw String', definition: 'A string literal prefixed with r or R where backslashes are treated as literal characters rather than escape triggers.' },
          { term: 'ord()', definition: 'Built-in function returning the Unicode integer codepoint of a single character.' },
          { term: 'chr()', definition: 'Built-in function returning the character string corresponding to an integer Unicode codepoint.' },
        ],
        bulletPoints: [
          '\\n inserts a newline; \\t inserts an indentation tab.',
          '\\\\ produces a single literal backslash.',
          'Raw strings: r"C:\\path\\notes" prevents \\n from becoming a newline.',
          'ord("A") == 65 and chr(65) == "A".',
          'chr(0x20A6) == "₦" represents the Nigerian Naira symbol.',
        ],
      },
      visualise: {
        type: 'string-methods-lab',
        title: 'Escape Sequence & Character Code Lab',
        badge: 'simulation',
        description: 'Inspect character codepoints and verify how escape sequences are parsed.',
        initialConfig: { inputText: 'Tab\\tNewline\\nNaira:₦' },
      },
      code: [
        {
          title: 'Demonstrating Escape Sequences and Character Codes',
          runMode: 'real',
          code: `# Escape sequences in formatted terminal output
formatted = "Item\\tPrice\\tCategory\\nApple\\t₦500\\tFruit\\nRice\\t₦3,500\\tGrain"
print("=== Formatted Table ===")
print(formatted)

# Raw strings for file paths and regex patterns
regular_path = "C:\\\\new_workspace\\\\test.py"
raw_path = r"C:\\new_workspace\\test.py"
print("\\nPaths match:", regular_path == raw_path)
print("Raw path display:", raw_path)

# Character codes: ord() and chr()
print("\\n=== Character Codes ===")
print("ord('A'):", ord('A'))
print("ord('a'):", ord('a'))
print("ord('₦'):", ord('₦'))
print("chr(65):", chr(65))
print("chr(8358):", chr(8358))  # 8358 is 0x20A6 in decimal (₦)`,
          expectedOutput: `=== Formatted Table ===
Item\tPrice\tCategory
Apple\t₦500\tFruit
Rice\t₦3,500\tGrain

Paths match: True
Raw path display: C:\\new_workspace\\test.py

=== Character Codes ===
ord('A'): 65
ord('a'): 97
ord('₦'): 8358
chr(65): A
chr(8358): ₦`,
        },
      ],
      explain: [
        { step: 1, codeLine: 2, instruction: 'formatted = "Item\\tPrice..."', internalEffect: 'Substitutes \\t with ASCII 9 (horizontal tab) and \\n with ASCII 10 (line feed).' },
        { step: 2, codeLine: 9, instruction: 'raw_path = r"C:\\new_workspace..."', internalEffect: 'Prefix r suppresses escape processing; backslashes remain literal characters.' },
        { step: 3, codeLine: 16, instruction: "ord('₦')", internalEffect: 'Looks up the Unicode scalar value for the Naira currency sign, returning decimal 8358.' },
        { step: 4, codeLine: 19, instruction: 'chr(8358)', internalEffect: 'Encodes integer 8358 into the UTF-8 bytes for "₦".' },
      ],
      apply: {
        domain: 'System Administration & File Automation',
        contextTitle: 'Windows Path Handling and RegEx Sanitisation',
        scenario: 'System scripts scanning directory trees like r"C:\\users\\admin\\notes" use raw strings to prevent accidental \\u or \\n triggers in file path strings.',
      },
      commonMistakes: [
        {
          label: 'Unescaped Backslash in Windows Paths',
          explanation: 'Writing "C:\\november\\files" turns \\n into a line break, splitting your file path across two lines.',
          erroneousCode: 'path = "C:\\november\\notes"  # \\n triggers newline, \\n becomes linebreak!',
        },
        {
          label: 'Passing Multi-character String to ord()',
          explanation: 'ord() strictly expects a string of length exactly 1. Passing a longer string raises TypeError.',
          erroneousCode: 'code = ord("Python")  # TypeError: ord() expected a character, but string of length 6 found',
        },
      ],
      practise: [
        {
          id: 'd4-s2-ex1',
          title: 'Predicting Escape Characters in Raw Strings',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Backend Script Path Routing on Windows Server',
          prompt: 'What will be printed when running this line of code?\n\n```python\npath = r"C:\\new_folder\\test"\nprint(len(path))\n```',
          options: [
            {
              id: 'opt-1',
              text: '17',
              explanation: 'Correct! In a raw string, backslashes are literal characters. "C:\\new_folder\\test" contains exactly 17 characters (including the two backslashes).',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: '15',
              explanation: 'Incorrect. If \\n and \\t were evaluated as escapes, it would be 15, but prefix r prevents escape processing.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'SyntaxError',
              explanation: 'Incorrect. Raw strings are valid Python syntax.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: '19',
              explanation: 'Incorrect. The string does not contain 19 characters.',
              isCorrect: false,
            },
          ],
          hints: [
            'Notice the leading r prefix designating a raw string.',
            'In raw strings, \\n does NOT turn into a newline and \\t does NOT turn into a tab.',
            'Count each character: C, :, \\, n, e, w, _, f, o, l, d, e, r, \\, t, e, s, t (17 characters).',
          ],
        },
        {
          id: 'd4-s2-ex2',
          title: 'Generating Currency Tag with ord() and chr()',
          type: 'write-code',
          tier: 'standard',
          points: 20,
          contextScenario: 'Central Bank of Nigeria (CBN) Multi-Currency Tagging',
          prompt: 'Write Python code that retrieves the Unicode codepoint of the Naira sign "₦" using ord(), converts codepoint 8358 back into a character using chr(), and prints them in the specified format.',
          starterCode: `# Write your character code solution below
naira_char = "₦"
# 1. Compute codepoint with ord()
# 2. Reconstruct character with chr()
# 3. Print: "Naira Code: <codepoint> | Char: <char>"
`,
          solutionCode: `naira_char = "₦"
code = ord(naira_char)
reconstructed = chr(code)
print(f"Naira Code: {code} | Char: {reconstructed}")`,
          testCases: [
            {
              id: 'tc-1',
              label: 'Naira Unicode Codepoint Verification',
              setup: '',
              expected: 'Naira Code: 8358 | Char: ₦',
              hidden: false,
            },
          ],
          hints: [
            'Use ord("₦") to get the integer 8358.',
            'Use chr(8358) to reconstruct the "₦" string.',
            'Format the print statement with an f-string: f"Naira Code: {code} | Char: {reconstructed}".',
          ],
        },
      ],
      sourceNotes: 'Derived from Asabeneh\'s 30 Days of Python: Day 4 Strings (Escape Sequences in Strings section).',
    },

    // ==========================================
    // Subtopic 3: Concatenation, Repetition & Immutability
    // ==========================================
    {
      id: 'day4-sub3',
      number: 3,
      title: 'Concatenation, Repetition & Immutability',
      summary: 'Combine strings with +, repeat with *, test membership with in, and prove string immutability in memory.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Building Strings and The Fundamental Law of Immutability',
        paragraphs: [
          'Python allows you to combine existing strings through two sequence operators: concatenation using + and repetition using *. Concatenation creates a new string containing the characters of the left operand followed by the right operand. Repetition takes a string and an integer n, creating a new string with the original repeated n times (e.g. "=" * 30).',
          'Adjacent string literals written together without an operator are automatically merged by the Python compiler: "Hello " "World" becomes "Hello World". To check whether a specific character or substring exists inside a string, Python provides the boolean membership operators in and not in.',
          'The most critical architectural property of Python strings is immutability. Once allocated in memory, a string object cannot be modified, resized, or mutated in place. Attempting to assign a new character to an existing index (e.g. s[0] = "X") immediately halts execution with TypeError: \'str\' object does not support item assignment. Every string method returns a brand-new string object.',
        ],
        keyTerms: [
          { term: 'Concatenation', definition: 'The operation of joining two sequence objects end-to-end using the + operator.' },
          { term: 'Repetition', definition: 'The operation of duplicating a sequence n times using the * operator.' },
          { term: 'Immutability', definition: 'The invariant that an object\'s state or contents cannot be modified after it is created in memory.' },
          { term: 'in Operator', definition: 'A membership test evaluating to True if the left substring exists inside the right string.' },
        ],
        bulletPoints: [
          'Concatenation: "Python " + "Lab" produces "Python Lab".',
          'Repetition: "-" * 10 produces "----------".',
          'Membership: "Lab" in "Python Visual Lab" evaluates to True.',
          'Immutability: text[0] = "J" raises TypeError. You must construct a new string.',
        ],
      },
      visualise: {
        type: 'string-methods-lab',
        title: 'String Immutability & Memory Inspector',
        badge: 'simulation',
        description: 'Verify that operations create new objects while the original string in memory remains unchanged.',
        initialConfig: { inputText: 'Python' },
      },
      code: [
        {
          title: 'Concatenation, Repetition, and Immutability Workaround',
          runMode: 'real',
          code: `# Concatenation and repetition
first_name = "Ada"
last_name = "Lovelace"
full_name = first_name + " " + last_name
divider = "=" * 30

print(divider)
print("Developer:", full_name)
print(divider)

# Membership testing with in and not in
course = "Python 30 Days Masterclass"
print("'Python' in course:", "Python" in course)
print("'Java' not in course:", "Java" not in course)

# Demonstrating immutability:
# Attempting full_name[0] = "O" would crash with TypeError.
# Instead, construct a new string:
modified_name = "Dr. " + full_name
print("Original name:", full_name)
print("Modified name:", modified_name)`,
          expectedOutput: `==============================
Developer: Ada Lovelace
==============================
'Python' in course: True
'Java' not in course: True
Original name: Ada Lovelace
Modified name: Dr. Ada Lovelace`,
        },
      ],
      explain: [
        { step: 1, codeLine: 4, instruction: 'full_name = first_name + " " + last_name', internalEffect: 'Allocates a new str object of length 12 in memory and points full_name to it.' },
        { step: 2, codeLine: 5, instruction: 'divider = "=" * 30', internalEffect: 'Allocates a contiguous block of 30 equal sign characters in memory.' },
        { step: 3, codeLine: 13, instruction: '"Python" in course', internalEffect: 'Executes an optimized Boyer-Moore substring search algorithm, returning True.' },
        { step: 4, codeLine: 20, instruction: 'modified_name = "Dr. " + full_name', internalEffect: 'Leaves full_name untouched in memory and creates a distinct new str object.' },
      ],
      apply: {
        domain: 'FinTech & Transaction Security',
        contextTitle: 'Immutable Account Number Masking',
        scenario: 'Banking software sanitizes customer account numbers for display (e.g. "*******1234"). Because strings are immutable, the original raw account number cannot be corrupted by display formatting code.',
      },
      commonMistakes: [
        {
          label: 'Direct Character Assignment (TypeError)',
          explanation: 'Strings cannot be mutated in place. Assigning to an index raises TypeError.',
          erroneousCode: 'language = "Python"\nlanguage[0] = "J"  # TypeError: \'str\' object does not support item assignment',
        },
        {
          label: 'Concatenating Non-String Without Casting',
          explanation: 'Using + between a string and an integer raises TypeError. You must explicitly convert numbers with str().',
          erroneousCode: 'msg = "Day: " + 4  # TypeError: can only concatenate str (not "int") to str',
        },
      ],
      practise: [
        {
          id: 'd4-s3-ex1',
          title: 'Fixing Illegal String Item Assignment & Casting Bug',
          type: 'fix-the-bug',
          tier: 'foundation',
          points: 15,
          contextScenario: 'Federal Road Safety Corps (FRSC) License Plate Formatter',
          prompt: 'A junior developer attempted to mutate a vehicle plate number by direct indexing and concatenate a state code integer. Fix the bugs so it outputs the corrected plate string.',
          starterCode: `# Buggy license plate builder
plate = "LND-100-AB"
# Learner attempted: plate[0] = "K"
# Learner attempted: final_code = plate + 2026
corrected_plate = "K" + plate[1:]
final_code = corrected_plate + "-" + 2026
print("Plate:", final_code)`,
          solutionCode: `plate = "LND-100-AB"
corrected_plate = "K" + plate[1:]
final_code = corrected_plate + "-" + str(2026)
print("Plate:", final_code)`,
          testCases: [
            {
              id: 'tc-1',
              label: 'Clean Plate String Generation',
              setup: '',
              expected: 'Plate: KND-100-AB-2026',
              hidden: false,
            },
          ],
          hints: [
            'Strings cannot be modified in place: create a new string using "K" + plate[1:].',
            'You cannot concatenate an int directly to a str using +; cast 2026 using str(2026).',
            'Ensure the print statement prints "Plate: KND-100-AB-2026".',
          ],
        },
        {
          id: 'd4-s3-ex2',
          title: 'Architectural Rationale of String Immutability',
          type: 'theory-reasoning',
          tier: 'challenge',
          points: 25,
          contextScenario: 'CPython Core Architecture & High-Concurrency Web Servers',
          prompt: 'Why are Python strings designed to be immutable? Contrast the benefits of string immutability (hashability, dictionary keys, thread safety) against the performance pitfall of repeated string concatenation with += inside loops.',
          modelAnswer: 'Python strings are immutable for three primary architectural reasons:\n1. Hashability: Because string contents never change, their hash value (hash(s)) is calculated once and cached. This makes strings extremely fast and secure as dictionary keys and set members.\n2. Thread Safety: Immutable objects can be freely shared across threads without locks or data corruption races.\n3. Memory Optimization: CPython can intern strings (like identifiers and small strings) so multiple variables share one physical object in memory.\n\nThe performance trade-off is that concatenating with += inside a loop (s += item) is O(N²) quadratic because each operation allocates a new string and copies all previous characters. The linear O(N) standard is to collect items in a list and call "".join(list).',
          markingCriteria: [
            { id: 'c1', label: 'Mentions hashability and reliability as dictionary keys / set members', points: 10 },
            { id: 'c2', label: 'Mentions thread safety and memory interning/caching', points: 8 },
            { id: 'c3', label: 'Identifies O(N²) loop concatenation penalty and recommends "".join() for O(N)', points: 7 },
          ],
          hints: [
            'Think about dictionary lookups: what would happen if a dictionary key could change its text while stored?',
            'Consider multi-threading: can multiple threads read the same immutable object simultaneously without locks?',
            'Recall why "".join(list) is preferred over repeated s += x inside loops.',
          ],
        },
      ],
      sourceNotes: 'Derived from Asabeneh\'s 30 Days of Python: Day 4 Strings (String Concatenation section).',
    },

    // ==========================================
    // Subtopic 4: String Indexing & Dual-Index Memory Layout
    // ==========================================
    {
      id: 'day4-sub4',
      number: 4,
      title: 'String Indexing & Dual-Index Memory Layout',
      summary: 'Access characters using positive 0-based indexing and negative reverse indexing, and master IndexError safety.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Dual-Index Memory Geometry: 0-Indexed and Negative Offsets',
        paragraphs: [
          'Because a string is an ordered sequence of characters, every character occupies a fixed numerical position called an index. Python implements a dual-indexing system that allows access from both ends of the string with equal efficiency.',
          'From left to right, indexing is 0-based: the first character is at index 0, the second at index 1, and the last character of a string of length n is at index n - 1. From right to left, Python supports negative indexing: the last character is at index -1, the second to last is at index -2, and the first character is at index -n.',
          'Crucial Watch-out: Squeezing past the boundaries of a string using indexing raises an IndexError: string index out of range. For instance, in a string of length 6, accessing index 6 or index -7 immediately crashes the Python program. Always remember that the maximum valid positive index is len(s) - 1.',
        ],
        keyTerms: [
          { term: '0-Based Indexing', definition: 'A numbering scheme where the initial element of a sequence is assigned index 0.' },
          { term: 'Negative Indexing', definition: 'Python\'s convention of accessing elements from the tail of a sequence using negative numbers (-1 is last).' },
          { term: 'IndexError', definition: 'The built-in exception raised when attempting to access an index outside sequence bounds.' },
        ],
        bulletPoints: [
          'Positive indices: 0 <= index < len(s).',
          'Negative indices: -len(s) <= index <= -1.',
          's[0] is the first character; s[-1] is the last character.',
          'Out-of-range indexing raises IndexError: string index out of range.',
        ],
      },
      visualise: {
        type: 'string-index-slice',
        title: 'Dual Index Character Memory Grid',
        badge: 'simulation',
        description: 'Click characters to inspect both positive (+i) and negative (-n+i) index expressions.',
        initialConfig: { text: 'PYTHON' },
      },
      code: [
        {
          title: 'Accessing Characters with Positive and Negative Indices',
          runMode: 'real',
          code: `company = "PythonLab"
n = len(company)
print("String:", company)
print("Length:", n)

# Accessing first and last characters
first_char_pos = company[0]
first_char_neg = company[-n]
last_char_pos = company[n - 1]
last_char_neg = company[-1]

print("First char via [0]:", first_char_pos)
print("First char via [-n]:", first_char_neg)
print("Last char via [n-1]:", last_char_pos)
print("Last char via [-1]:", last_char_neg)

# Character inspection at arbitrary index
middle_char = company[3]
print("Character at index 3:", middle_char)`,
          expectedOutput: `String: PythonLab
Length: 9
First char via [0]: P
First char via [-n]: P
Last char via [n-1]: b
Last char via [-1]: b
Character at index 3: h`,
        },
      ],
      explain: [
        { step: 1, codeLine: 1, instruction: 'company = "PythonLab"', internalEffect: 'Allocates a sequence of 9 characters: P(0), y(1), t(2), h(3), o(4), n(5), L(6), a(7), b(8).' },
        { step: 2, codeLine: 7, instruction: 'first_char_pos = company[0]', internalEffect: 'Computes memory offset 0 * sizeof(char) from base pointer and extracts "P".' },
        { step: 3, codeLine: 10, instruction: 'last_char_neg = company[-1]', internalEffect: 'Python adds length 9 to negative index -1: 9 + (-1) = index 8, returning "b".' },
        { step: 4, codeLine: 18, instruction: 'middle_char = company[3]', internalEffect: 'Directly retrieves the character at offset 3, yielding "h".' },
      ],
      apply: {
        domain: 'Data Validation & Telecommunications',
        contextTitle: 'Checking Telephone Prefix and Suffix Codes',
        scenario: 'Telecom scripts inspect the first character phone[0] to determine if a Nigerian telephone number starts with "0" or "+" and inspect phone[-4:] to confirm network routing.',
      },
      commonMistakes: [
        {
          label: 'Off-By-One Indexing at Length (IndexError)',
          explanation: 'Because indexing begins at 0, the last element is at len(s) - 1. Attempting s[len(s)] crashes.',
          erroneousCode: 'word = "Python"\nlast = word[len(word)]  # IndexError: string index out of range (len is 6, valid indices are 0..5)',
        },
      ],
      practise: [
        {
          id: 'd4-s4-ex1',
          title: 'Tracing Character Offsets in Airline Booking PNR',
          type: 'explain-the-trace',
          tier: 'standard',
          points: 20,
          contextScenario: 'Air Peace Flight Reservation PNR Verification',
          prompt: 'Trace the character lookups on booking reference PNR code "LOS246". Explain why code[0] yields "L" while code[-1] yields "6", and calculate the positive index equivalent to code[-3].',
          traceStepCode: `pnr = "LOS246"
# Length is 6: indices 0..5 or -6..-1
first = pnr[0]
last = pnr[-1]
target = pnr[-3]  # -3 corresponds to length 6 - 3 = index 3 ('2')
print(f"First: {first}, Last: {last}, Middle: {target}")`,
          traceQuestion: 'What character is extracted by pnr[-3], and what is its 0-based positive index?',
          options: [
            {
              id: 'opt-1',
              text: 'Character "2" at positive index 3.',
              explanation: 'Correct! pnr has length 6. Index -3 translates to 6 + (-3) = index 3, which holds character "2".',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'Character "S" at positive index 2.',
              explanation: 'Incorrect. "S" is at index 2 (negative index -4).',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'Character "4" at positive index 4.',
              explanation: 'Incorrect. "4" is at index 4 (negative index -2).',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'IndexError because negative indices cannot be used with integers.',
              explanation: 'Incorrect. Negative indices are standard and fully supported in Python.',
              isCorrect: false,
            },
          ],
          hints: [
            'Write down the 6 characters of "LOS246": L(0, -6), O(1, -5), S(2, -4), 2(3, -3), 4(4, -2), 6(5, -1).',
            'Find the column with negative index -3.',
            'It holds character "2" at positive index 3.',
          ],
        },
        {
          id: 'd4-s4-ex2',
          title: 'Defensive Index Lookup & Boundary Guarding',
          type: 'scenario-mcq',
          tier: 'challenge',
          points: 15,
          contextScenario: 'Access Bank NIBSS Instant Payment Routing Engine',
          prompt: 'A payment gateway processes a customer account string. What happens if the code executes account[10] when account has length 10 (e.g. account = "0123456789")?',
          options: [
            {
              id: 'opt-1',
              text: 'IndexError: string index out of range is raised immediately.',
              explanation: 'Correct! For a string of length 10, valid positive indices are 0 through 9. Index 10 is out of bounds and raises an IndexError.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'It returns an empty string "" gracefully.',
              explanation: 'Incorrect. Slicing returns "" when out of range, but indexing always raises IndexError.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'It wraps around and returns the first character at index 0.',
              explanation: 'Incorrect. Python indices do not automatically wrap around modulo length.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'It returns None.',
              explanation: 'Incorrect. Out-of-bounds indexing in Python raises IndexError rather than returning None.',
              isCorrect: false,
            },
          ],
          hints: [
            'Remember: indexing is strict, while slicing is forgiving.',
            'A string of length 10 has indices 0, 1, 2, 3, 4, 5, 6, 7, 8, 9.',
            'Accessing index 10 is past the end of the string, causing IndexError.',
          ],
        },
      ],
      sourceNotes: 'Derived from Asabeneh\'s 30 Days of Python: Day 4 Strings (Accessing Characters in Strings by Index section).',
    },

    // ==========================================
    // Subtopic 5: String Slicing Mechanics & Stride
    // ==========================================
    {
      id: 'day4-sub5',
      number: 5,
      title: 'String Slicing Mechanics & Stride ([start:stop:step])',
      summary: 'Extract substrings using slice notation, understand half-open intervals, stride steps, idiomatic reversal ([::-1]), and graceful clamping.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Carving Substrings: Slices, Strides, Reversals, and Boundary Clamping',
        paragraphs: [
          'While indexing extracts a single character, slicing extracts a continuous or stepped range of characters to form a new substring. The full Python slice syntax is: sequence[start:stop:step]. In Python convention, intervals are half-open: start is inclusive, but stop is strictly exclusive.',
          'Each part of the slice syntax is optional and provides sensible defaults: start defaults to 0 (the beginning of the string), stop defaults to len(s) (the end of the string), and step defaults to 1. For example, s[:3] grabs characters from index 0 through 2, while s[3:] grabs everything from index 3 to the end.',
          'The step argument (stride) dictates the increment between characters. A step of 2 (s[::2]) selects every second character. A negative step strides backward through the string; the idiomatic Python expression to reverse any string is s[::-1].',
          'Crucial Watch-out: Unlike indexing (which crashes with an IndexError when out of bounds), slicing gracefully clamps to the string boundaries without error! Slicing "Python"[2:100] simply returns "thon" rather than crashing.',
        ],
        keyTerms: [
          { term: 'Slicing', definition: 'Extracting a subset of a sequence using the syntax [start:stop:step].' },
          { term: 'Half-Open Interval', definition: 'The [start, stop) mathematical convention where start is included but stop is excluded.' },
          { term: 'Stride (Step)', definition: 'The integer step count between items in a slice; negative stride reverses direction.' },
          { term: 'Boundary Clamping', definition: 'Python\'s automatic adjustment of out-of-range slice indices to sequence boundaries without raising IndexError.' },
        ],
        bulletPoints: [
          's[start:stop] extracts characters from index start up to (but not including) stop.',
          's[:n] extracts the first n characters; s[-n:] extracts the last n characters.',
          's[::2] selects every alternating character.',
          's[::-1] creates a reversed copy of the string.',
          'Out-of-range slices NEVER raise IndexError—they gracefully clamp.',
        ],
      },
      visualise: {
        type: 'string-index-slice',
        title: 'Interactive Slice Slider & Boundary Clamper',
        badge: 'simulation',
        description: 'Drag start, stop, and step sliders to watch substring selection and verify out-of-range clamping.',
        initialConfig: { text: 'DEVELOPER' },
      },
      code: [
        {
          title: 'Mastering Slicing, Strides, and Boundary Clamping',
          runMode: 'real',
          code: `text = "PythonLab2026"
print("Full string:", text)

# Basic slicing [start:stop]
prefix = text[0:6]      # indices 0 through 5
suffix = text[6:]       # index 6 to end
print("Prefix (0:6):", prefix)
print("Suffix (6:):", suffix)

# Negative slicing
last_four = text[-4:]
middle_cut = text[6:-4]
print("Last four characters (-4:):", last_four)
print("Middle slice (6:-4):", middle_cut)

# Stride and reversing
every_second = text[::2]
reversed_text = text[::-1]
print("Every second character (::2):", every_second)
print("Reversed string (::-1):", reversed_text)

# Out-of-range slice clamping (NO IndexError!)
clamped_slice = text[6:100]
print("Out-of-range slice [6:100]:", clamped_slice)`,
          expectedOutput: `Full string: PythonLab2026
Prefix (0:6): Python
Suffix (6:): Lab2026
Last four characters (-4:): 2026
Middle slice (6:-4): Lab
Every second character (::2): PtoLbe2
Reversed string (::-1): 6202baLnohtyP
Out-of-range slice [6:100]: Lab2026`,
        },
      ],
      explain: [
        { step: 1, codeLine: 5, instruction: 'prefix = text[0:6]', internalEffect: 'Iterates through indices 0, 1, 2, 3, 4, 5 (stopping before 6) and constructs "Python".' },
        { step: 2, codeLine: 11, instruction: 'last_four = text[-4:]', internalEffect: 'Interprets -4 as index len(text) - 4 = 9; slices from index 9 to the end: "2026".' },
        { step: 3, codeLine: 17, instruction: 'reversed_text = text[::-1]', internalEffect: 'Walks backwards from index 12 down to 0 with step -1, creating a reversed copy.' },
        { step: 4, codeLine: 22, instruction: 'clamped_slice = text[6:100]', internalEffect: 'Clamps stop index 100 to len(text) = 13 without error, returning "Lab2026".' },
      ],
      apply: {
        domain: 'Cryptography & Data Security',
        contextTitle: 'Checking Palindromes & Masking Payment Cards',
        scenario: 'Security utilities test whether a passphrase or word is a palindrome using word == word[::-1], and mask customer card numbers via "****" + card_number[-4:].',
      },
      commonMistakes: [
        {
          label: 'Expecting the Stop Index to be Included',
          explanation: 'Because slices are half-open [start:stop), the character at index stop is omitted.',
          erroneousCode: 's = "Python"\nsub = s[0:3]  # Learners expect "Pyt", which is correct! But s[0:2] gives only "Py".',
        },
        {
          label: 'Using Step 0 (ValueError)',
          explanation: 'A step of 0 makes no logical sense in sequence traversal and immediately raises ValueError: slice step cannot be zero.',
          erroneousCode: 's = "Python"\ninvalid = s[::0]  # ValueError: slice step cannot be zero',
        },
      ],
      practise: [
        {
          id: 'd4-s5-ex1',
          title: 'Fill-the-Gaps: Slicing Substrings and Reversal',
          type: 'fill-the-gaps',
          tier: 'standard',
          points: 15,
          contextScenario: 'Cybersecurity Packet Inspection & Suffix Extraction',
          prompt: 'Fill in the slice parameters to extract the last 4 characters of a payment reference and reverse a verification token.',
          gaps: [
            {
              id: 'gap-1',
              beforeText: 'reference = "TX-99884422"\nlast_four = reference[',
              afterText: ']',
              correctAnswer: '-4:',
              options: ['-4:', '0:4', '4:', ':-4'],
            },
            {
              id: 'gap-2',
              beforeText: 'token = "SECURE2026"\nreversed_token = token[',
              afterText: ']',
              correctAnswer: '::-1',
              options: ['::-1', ':0:-1', '-1::', '::1'],
            },
          ],
          hints: [
            'To extract the trailing 4 characters, use negative slice [-4:].',
            'To reverse any string in Python idiomatically, leave start and stop blank with step -1: [::-1].',
            'Select "-4:" for gap 1 and "::-1" for gap 2.',
          ],
        },
        {
          id: 'd4-s5-ex2',
          title: 'Credit Card Masker & Palindrome Checker',
          type: 'write-code',
          tier: 'challenge',
          points: 25,
          contextScenario: 'FinTech Secure Payment Card Display Module',
          prompt: 'Write Python code that masks a 16-digit payment card keeping only the last 4 digits visible with 12 asterisks, and checks whether the secret security passphrase is a palindrome.',
          starterCode: `# Card masking & Palindrome verification
card_num = "5399882211004455"
passphrase = "madam"

# 1. Produce masked_card with 12 asterisks followed by the last 4 digits of card_num
# 2. Check if passphrase equals its reverse
# 3. Print results in the exact format shown
`,
          solutionCode: `card_num = "5399882211004455"
passphrase = "madam"

masked_card = "*" * 12 + card_num[-4:]
is_palindrome = passphrase == passphrase[::-1]

print(f"Masked Card: {masked_card}")
print(f"Passphrase Palindrome: {is_palindrome}")`,
          testCases: [
            {
              id: 'tc-1',
              label: 'Card Mask and Palindrome Test',
              setup: '',
              expected: 'Masked Card: ************4455\nPassphrase Palindrome: True',
              hidden: false,
            },
          ],
          hints: [
            'Use "*" * 12 to generate 12 asterisks.',
            'Use card_num[-4:] to extract the trailing 4 digits.',
            'Use passphrase == passphrase[::-1] to test for palindrome.',
          ],
        },
      ],
      sourceNotes: 'Derived from Asabeneh\'s 30 Days of Python: Day 4 Strings (Slicing Strings & Reversing a String sections).',
    },

    // ==========================================
    // Subtopic 6: String Formatting: %, str.format(), and Modern f-Strings
    // ==========================================
    {
      id: 'day4-sub6',
      number: 6,
      title: 'String Formatting (%, str.format(), and Modern f-strings)',
      summary: 'Compare old % style, str.format(), and modern f-strings with format specifiers (currency, decimal rounding, and alignment).',
      estimatedMinutes: 9,
      introduce: {
        headline: 'The Evolution of String Formatting: From % to f-Strings',
        paragraphs: [
          'Python has evolved through three primary generations of string formatting: old-style printf % formatting (Python 1 & 2), the str.format() method (Python 2.6+), and modern formatted string literals (f-strings, introduced in Python 3.6).',
          'In old-style formatting, %s represents a string, %d an integer, and %f a float (e.g. "Price: %.2f" % 12.5). While functional, this style is error-prone when passing tuples and lacks readability.',
          'The str.format() method replaced % with curly braces {} as placeholders: "{} has {} tokens".format(name, count). It allowed positional indexing ({0}, {1}) and keyword arguments ({user}, {amount}).',
          'Modern f-strings are prefixed with f or F before the opening quote. Any valid Python expression inside {expression} is evaluated at runtime in its local scope. Crucially, f-strings support powerful format specifiers: :.2f rounds floating-point numbers to two decimal places, :, adds thousands comma separators (e.g. f"₦{val:,.2f}"), and :<15, :>15, :^15 align text to specified widths.',
        ],
        keyTerms: [
          { term: 'f-string', definition: 'Formatted string literal prefixed with f that evaluates Python expressions enclosed in {} at runtime.' },
          { term: 'str.format()', definition: 'String method that inserts arguments into placeholder braces {} within a template string.' },
          { term: 'Format Specifier', definition: 'Formatting rules following a colon inside braces (e.g. :.2f, :,) dictating precision, padding, or type.' },
        ],
        bulletPoints: [
          'Old style: "%s costs %d" % ("Book", 500).',
          'str.format(): "{} costs {}".format("Book", 500).',
          'Modern f-strings: f"{item} costs {price}".',
          'Format specifiers: f"₦{salary:,.2f}" produces "₦250,000.00".',
          'Alignment: f"{name:<15}" left-aligns name inside 15 spaces.',
        ],
      },
      visualise: {
        type: 'string-methods-lab',
        title: 'String Formatting & Specifiers Visualiser',
        badge: 'simulation',
        description: 'Test string formatting methods and format specifiers interactively.',
        initialConfig: { inputText: '30, Python' },
      },
      code: [
        {
          title: 'Comparing Formatting Styles and Formatting Financial Figures',
          runMode: 'real',
          code: `# Variables for demonstration
developer = "Chidi"
completed_days = 4
total_days = 30
allowance = 350000.758

# 1. Old style % formatting
old_msg = "%s has completed %d of %d days." % (developer, completed_days, total_days)
print("1. Old % style:", old_msg)

# 2. str.format() method
fmt_msg = "{name} has completed {done}/{total} days.".format(
    name=developer, done=completed_days, total=total_days
)
print("2. str.format():", fmt_msg)

# 3. Modern f-strings (Pythonic standard)
modern_msg = f"{developer} has completed {completed_days}/{total_days} days ({(completed_days/total_days)*100:.1f}%)."
print("3. f-string:   ", modern_msg)

# Financial and table formatting with specifiers
formatted_fin = f"Monthly Stipend: ₦{allowance:,.2f}"
print("\\n" + formatted_fin)

# Column alignment table
print("\\n--- Developer Summary Table ---")
print(f"{'DEVELOPER':<12} | {'PROGRESS':<10} | {'ALLOWANCE':>15}")
print("-" * 43)
print(f"{developer:<12} | {f'{completed_days}/{total_days}':<10} | {f'₦{allowance:,.2f}':>15}")`,
          expectedOutput: `1. Old % style: Chidi has completed 4 of 30 days.
2. str.format(): Chidi has completed 4/30 days.
3. f-string:    Chidi has completed 4/30 days (13.3%).

Monthly Stipend: ₦350,000.76

--- Developer Summary Table ---
DEVELOPER    | PROGRESS   |       ALLOWANCE
-------------------------------------------
Chidi        | 4/30       |     ₦350,000.76`,
        },
      ],
      explain: [
        { step: 1, codeLine: 8, instruction: 'old_msg = "%s has completed %d..." % (...)', internalEffect: 'Evaluates C-style printf interpolation using format specifiers %s and %d.' },
        { step: 2, codeLine: 12, instruction: 'fmt_msg = "{name}...".format(...)', internalEffect: 'Constructs a template parser and binds kwargs to named placeholder braces.' },
        { step: 3, codeLine: 18, instruction: 'modern_msg = f"{developer}..."', internalEffect: 'CPython compiles f-string expressions directly into FORMAT_VALUE bytecode instructions.' },
        { step: 4, codeLine: 22, instruction: 'f"Monthly Stipend: ₦{allowance:,.2f}"', internalEffect: 'Applies round-half-to-even float rounding to 2 decimals and inserts comma grouping.' },
      ],
      apply: {
        domain: 'FinTech & Invoicing Systems',
        contextTitle: 'Automated Invoice Generation and Payroll Dispatches',
        scenario: 'FinTech payment systems use f-strings with format specifiers f"₦{amount:,.2f}" to generate legally compliant transaction receipts with thousands separators and 2-decimal kobo accuracy.',
      },
      commonMistakes: [
        {
          label: 'Forgetting the Leading f in f-strings',
          explanation: 'Omitting the leading f before quotes causes Python to treat the text as a plain literal string, leaving {expressions} unparsed.',
          erroneousCode: 'name = "Kemi"\nmsg = "{name} is learning"  # Outputs literal "{name} is learning" without f!',
        },
        {
          label: 'Syntax Error with Backslash inside f-string Expressions',
          explanation: 'In Python versions before 3.12, backslashes (like \\n) cannot be placed directly inside the curly braces of an f-string.',
          erroneousCode: 'items = ["a", "b"]\n# msg = f"Items: {\\n.join(items)}"  # SyntaxError in Python < 3.12',
        },
      ],
      practise: [
        {
          id: 'd4-s6-ex1',
          title: 'Financial Invoice Row Formatter with Currency Specifiers',
          type: 'write-code',
          tier: 'standard',
          points: 20,
          contextScenario: 'Paystack Automated B2B Billing Notification Engine',
          prompt: 'Write Python code that takes client_name and total_kobo, converts to Naira (total_kobo / 100), and outputs a formatted invoice line item using modern f-strings with a 2-decimal rounded amount, comma separator, and column alignment.',
          starterCode: `# Format invoice line item
client = "Interswitch Ltd"
total_kobo = 18545025  # In kobo (185,450.25 Naira)

# 1. Calculate amount in Naira
# 2. Print: "Client: <client:<18> | Total: ₦<amount:,.2f>"
`,
          solutionCode: `client = "Interswitch Ltd"
total_kobo = 18545025
amount = total_kobo / 100
print(f"Client: {client:<18} | Total: ₦{amount:,.2f}")`,
          testCases: [
            {
              id: 'tc-1',
              label: 'Invoice Specifier Output Verification',
              setup: '',
              expected: 'Client: Interswitch Ltd    | Total: ₦185,450.25',
              hidden: false,
            },
          ],
          hints: [
            'Divide total_kobo by 100 to get the floating-point Naira amount.',
            'Use format specifier :<18 to left-align the client name in 18 character columns.',
            'Use format specifier :,.2f to format the currency with comma separators and 2 decimal points.',
          ],
        },
        {
          id: 'd4-s6-ex2',
          title: 'Impact of Missing f Prefix in String Templates',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Student Portal Results Notification Dispatch',
          prompt: 'A programmer writes:\n\n```python\nstudent = "Zainab"\ngpa = 4.85\nmsg = "Student {student} graduated with First Class ({gpa:.2f})"\nprint(msg)\n```\nWhat will be displayed on the console?',
          options: [
            {
              id: 'opt-1',
              text: 'Student {student} graduated with First Class ({gpa:.2f})',
              explanation: 'Correct! Without the leading "f" prefix before the opening quote, Python treats the curly braces and specifiers as raw literal characters without evaluating them.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'Student Zainab graduated with First Class (4.85)',
              explanation: 'Incorrect. This would only happen if msg had an f prefix (f"Student {student}...").',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'NameError: name "student" is not defined.',
              explanation: 'Incorrect. Python does not attempt variable lookup on non-f-string literals.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'SyntaxError: invalid format specifier.',
              explanation: 'Incorrect. Plain strings can contain curly braces and colons without raising errors.',
              isCorrect: false,
            },
          ],
          hints: [
            'Check the opening quotation mark on the msg line.',
            'Notice there is no f or F prefix before the opening double quote.',
            'Without the f prefix, it remains a literal string containing {student}.',
          ],
        },
      ],
      sourceNotes: 'Derived from Asabeneh\'s 30 Days of Python: Day 4 Strings (String Formatting sections: %, format, and f-strings).',
    },

    // ==========================================
    // Subtopic 7: Search & Locate Methods: find(), rfind(), index(), rindex(), count()
    // ==========================================
    {
      id: 'day4-sub7',
      number: 7,
      title: 'Search & Locate: find(), rfind(), index(), rindex(), count()',
      summary: 'Search for substrings, navigate the critical difference between find() returning -1 versus index() raising ValueError, and count occurrences.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Locating Substrings: find() Returning -1 vs index() Raising ValueError',
        paragraphs: [
          'Python strings offer dedicated methods to search for substrings and count occurrences: find(), rfind(), index(), rindex(), and count().',
          'Crucial Watch-out: The fundamental difference between find() and index() is their error behavior when a substring is absent! s.find(sub) returns -1 when the substring cannot be found. In stark contrast, s.index(sub) raises a fatal ValueError: substring not found, crashing your program if unhandled. Therefore, use find() when you want to safely inspect presence without exception handling, or check with in first before calling index().',
          'The rfind() and rindex() methods perform the exact same lookup but search from the right-hand end of the string, returning the highest matching index.',
          'The count(sub, start, end) method counts non-overlapping occurrences of a substring. The prefix and suffix methods startswith(prefix) and endswith(suffix) return boolean True or False, and both accept a tuple of prefixes/suffixes to check multiple candidates simultaneously.',
        ],
        keyTerms: [
          { term: 'find()', definition: 'Returns the lowest index of a substring, or -1 if the substring is not found.' },
          { term: 'index()', definition: 'Returns the lowest index of a substring, but raises ValueError if the substring is absent.' },
          { term: 'rfind() / rindex()', definition: 'Right-to-left counterparts searching for the highest matching index of a substring.' },
          { term: 'count()', definition: 'Returns the number of non-overlapping occurrences of a substring.' },
        ],
        bulletPoints: [
          'find(sub) returns -1 if not found: never crashes.',
          'index(sub) raises ValueError if not found: crashes if unhandled.',
          'rfind(sub) and rindex(sub) return the highest matching index.',
          'count(sub) returns total non-overlapping matches.',
          'startswith() and endswith() accept single strings or tuples of strings.',
        ],
      },
      visualise: {
        type: 'find-index',
        title: 'Find vs Index & Search Inspector',
        badge: 'simulation',
        description: 'Compare find() returning -1 against index() raising ValueError, and inspect match highlights.',
        initialConfig: { text: 'coding in python is awesome and python is fun', searchQuery: 'python' },
      },
      code: [
        {
          title: 'Demonstrating Substring Search and Error Handling',
          runMode: 'real',
          code: `sentence = "thirty days of python - python is powerful"
print("Target Sentence:", sentence)

# 1. find() vs index() when substring is present
print("\\n--- Substring Present ---")
print("find('python'):", sentence.find("python"))
print("index('python'):", sentence.index("python"))

# 2. rfind() and rindex() from the right
print("\\n--- Search from Right ---")
print("rfind('python'):", sentence.rfind("python"))
print("rindex('python'):", sentence.rindex("python"))

# 3. Behavior when substring is ABSENT
print("\\n--- Substring Absent ---")
print("find('java'):", sentence.find("java"))  # Returns -1 gracefully!

try:
    print("index('java'):", sentence.index("java"))
except ValueError as e:
    print("index('java') raised ValueError:", e)

# 4. Counting occurrences and checking affixes
print("\\n--- Count & Affix Checking ---")
print("Count of 'python':", sentence.count("python"))
print("Starts with 'thirty':", sentence.startswith("thirty"))
print("Ends with 'powerful':", sentence.endswith("powerful"))
# Checking multiple extensions with a tuple:
filename = "report.pdf"
print("Is valid doc:", filename.endswith((".pdf", ".docx", ".txt")))`,
          expectedOutput: `Target Sentence: thirty days of python - python is powerful

--- Substring Present ---
find('python'): 15
index('python'): 15

--- Search from Right ---
rfind('python'): 24
rindex('python'): 24

--- Substring Absent ---
find('java'): -1
index('java') raised ValueError: substring not found

--- Count & Affix Checking ---
Count of 'python': 2
Starts with 'thirty': True
Ends with 'powerful': True
Is valid doc: True`,
        },
      ],
      explain: [
        { step: 1, codeLine: 7, instruction: 'sentence.find("python")', internalEffect: 'Scans left-to-right, locates the first match starting at character index 15.' },
        { step: 2, codeLine: 12, instruction: 'sentence.rfind("python")', internalEffect: 'Scans right-to-left, locates the second match starting at character index 24.' },
        { step: 3, codeLine: 17, instruction: 'sentence.find("java")', internalEffect: 'Determines "java" is absent and safely returns sentinel integer -1.' },
        { step: 4, codeLine: 20, instruction: 'sentence.index("java")', internalEffect: 'Determines "java" is absent and raises ValueError("substring not found").' },
      ],
      apply: {
        domain: 'Web Development & File Uploads',
        contextTitle: 'MIME Type & Document Suffix Verification',
        scenario: 'Secure file upload endpoints verify document authenticity using filename.endswith((".pdf", ".png", ".jpg")) to prevent malicious executable files from being uploaded.',
      },
      commonMistakes: [
        {
          label: 'Using index() without try/except or in Check',
          explanation: 'Calling s.index("target") when "target" is absent crashes the script with ValueError: substring not found.',
          erroneousCode: 'query = "user_email"\npos = query.index("@")  # If "@" is missing, script crashes immediately!',
        },
        {
          label: 'Confusing -1 with a Valid Index',
          explanation: 's.find() returns -1 on not found. In Python, s[-1] is the last character! If you do s[s.find("missing")], you grab the last character rather than handling the failure!',
          erroneousCode: 'idx = text.find("not_there")  # returns -1\nchar = text[idx]  # Accidentally extracts text[-1]!',
        },
      ],
      practise: [
        {
          id: 'd4-s7-ex1',
          title: 'Choosing Between find() and index() in Error Log Parsing',
          type: 'scenario-mcq',
          tier: 'standard',
          points: 15,
          contextScenario: 'Server Log Error Monitoring Pipeline',
          prompt: 'A log parsing script inspects incoming HTTP request logs to check if the error token "[ERROR]" is present. If the script should check for existence without needing a try/except block to handle crashes, what should it do?',
          options: [
            {
              id: 'opt-1',
              text: 'Use `if "[ERROR]" in line:` or `if line.find("[ERROR]") != -1:`',
              explanation: 'Correct! The in operator or find() returning -1 handles absence gracefully without raising an unhandled exception.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'Use `if line.index("[ERROR]") >= 0:`',
              explanation: 'Incorrect. If "[ERROR]" is absent, line.index() raises ValueError and crashes the program.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'Use `line.count("[ERROR]") == True`',
              explanation: 'Incorrect. line.count() returns an integer (which can be 2, 3, etc.), not a boolean.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'Use `line.rindex("[ERROR]")`',
              explanation: 'Incorrect. rindex() also raises ValueError when the substring is missing.',
              isCorrect: false,
            },
          ],
          hints: [
            'Remember: index() raises ValueError when the substring is absent.',
            'find() returns -1 when absent, which never crashes.',
            'Using `in` or `find() != -1` is safe and pythonic.',
          ],
        },
        {
          id: 'd4-s7-ex2',
          title: 'Predicting Results of rfind() and Substring Counting',
          type: 'predict-output',
          tier: 'standard',
          points: 15,
          contextScenario: 'URL Routing and Path Tokenizer',
          prompt: 'What will be printed when running this script?\n\n```python\nurl = "https://portal.unilag.edu.ng/student/portal/login"\nfirst = url.find("portal")\nlast = url.rfind("portal")\nprint(f"{first}, {last}")\n```',
          options: [
            {
              id: 'opt-1',
              text: '8, 38',
              explanation: 'Correct! The first "portal" begins at character offset 8 ("https://portal..."). The right-most "portal" begins at character offset 38 ("...student/portal...").',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: '8, 8',
              explanation: 'Incorrect. rfind() searches from the right and finds the second occurrence at index 38.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: '0, 44',
              explanation: 'Incorrect. Offsets start at character index 8, not 0.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'ValueError',
              explanation: 'Incorrect. find() and rfind() do not raise ValueError.',
              isCorrect: false,
            },
          ],
          hints: [
            'Count the characters before the first "portal": "https://" is 8 characters (0..7), so the first match is at index 8.',
            'rfind() finds the last occurrence in the string.',
            'The second occurrence is at "...student/portal/login", which starts at index 38.',
          ],
        },
      ],
      sourceNotes: 'Derived from Asabeneh\'s 30 Days of Python: Day 4 Strings (find, rfind, index, rindex, count, startswith, endswith sections).',
    },

    // ==========================================
    // Subtopic 8: Case Transformations & Text Modification Methods
    // ==========================================
    {
      id: 'day4-sub8',
      number: 8,
      title: 'Case Transformations & Text Modification Methods',
      summary: 'Transform text case, understand the .title() apostrophe trap, clean whitespace with strip(), and replace substrings.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Transforming Text: Case, Trimming, and The .title() Apostrophe Trap',
        paragraphs: [
          'Python provides a rich suite of methods for altering character casing: upper() converts all letters to uppercase, lower() converts to lowercase, capitalize() capitalizes only the very first character of the entire string (making the rest lowercase), swapcase() reverses casing, and casefold() (Enrichment) performs aggressive Unicode normalization for case-insensitive comparisons (e.g. German "ß" folds to "ss").',
          'Crucial Watch-out: Python\'s str.title() converts the first character of each word to uppercase. However, it defines a word boundary as any non-letter character—including English apostrophes! Consequently, "they\'re".title() becomes "They\'Re" (with a capital R), which is grammatically incorrect. For robust titlecasing of English text, use regular expressions or the standard library string.capwords.',
          'To clean extraneous characters from boundaries, Python provides strip([chars]), lstrip([chars]), and rstrip([chars]). When called with no arguments, strip() trims leading and trailing whitespace. When passed a string of characters (e.g. s.strip(". ,")), it removes any character present in that set, NOT a fixed sequence substring.',
          'The replace(old, new, count) method swaps occurrences of a substring with another. Because strings are immutable, replace() always returns a new string and leaves the original untouched.',
        ],
        keyTerms: [
          { term: 'title()', definition: 'Capitalizes the first character of every word (watch out for apostrophes!).' },
          { term: 'casefold()', definition: 'Enrichment method for aggressive Unicode caseless matching, stronger than lower().' },
          { term: 'strip()', definition: 'Removes leading and trailing whitespace, or any characters matching a given character set.' },
          { term: 'replace()', definition: 'Returns a new string where occurrences of an old substring are replaced by a new substring.' },
        ],
        bulletPoints: [
          'upper() and lower() convert entire strings to uppercase/lowercase.',
          'capitalize() capitalizes only the first letter of the string.',
          'title() pitfall: "they\'re".title() -> "They\'Re".',
          'strip() removes matching characters in any order from both ends.',
          'replace(old, new) produces a brand-new string without modifying original.',
        ],
      },
      visualise: {
        type: 'string-methods-lab',
        title: 'String Methods Laboratory: Transformations',
        badge: 'simulation',
        description: 'Explore live transformations across capitalize, upper, lower, title, strip, and replace.',
        initialConfig: { inputText: '  thirty days of PYTHON  ', selectedMethodName: 'strip' },
      },
      code: [
        {
          title: 'Case Conversions, Trimming, and Replacement',
          runMode: 'real',
          code: `# Case conversion methods
phrase = "thirty DAYS of python"
print("Original:   ", phrase)
print("upper():    ", phrase.upper())
print("lower():    ", phrase.lower())
print("capitalize():", phrase.capitalize())
print("swapcase():  ", phrase.swapcase())

# The .title() apostrophe trap
contraction = "they're learning python at bill's lab"
print("\\nContraction title():", contraction.title())
# Notice "They'Re" and "Bill'S"!

# Trimming whitespace and punctuation with strip()
raw_input = "  \\t  user_admin_2026   \\n"
clean_input = raw_input.strip()
print("\\nRaw input length:", len(raw_input))
print("Clean input:     ", f"'{clean_input}'")
print("Clean length:    ", len(clean_input))

# strip() with custom character sets
url_slug = "...clean-slug-name...!!!"
print("Stripped slug:   ", url_slug.strip(".!"))

# Replacing substrings
template = "Welcome to Abuja. Abuja is beautiful."
updated = template.replace("Abuja", "Lagos")
print("\\nReplaced string:", updated)
print("Original string:", template)  # Unmodified!`,
          expectedOutput: `Original:    thirty DAYS of python
upper():     THIRTY DAYS OF PYTHON
lower():     thirty days of python
capitalize(): Thirty days of python
swapcase():   THIRTY days OF PYTHON

Contraction title(): They'Re Learning Python At Bill'S Lab

Raw input length: 26
Clean input:      'user_admin_2026'
Clean length:     15
Stripped slug:    clean-slug-name

Replaced string: Welcome to Lagos. Lagos is beautiful.
Original string: Welcome to Abuja. Abuja is beautiful.`,
        },
      ],
      explain: [
        { step: 1, codeLine: 6, instruction: 'phrase.capitalize()', internalEffect: 'Turns character 0 ("t") into "T" and coerces all remaining characters to lowercase.' },
        { step: 2, codeLine: 11, instruction: 'contraction.title()', internalEffect: 'Treats the apostrophe as a word boundary, incorrectly capitalizing "R" in "They\'Re".' },
        { step: 3, codeLine: 16, instruction: 'raw_input.strip()', internalEffect: 'Iterates inward from both ends, stripping spaces, tabs, and newlines.' },
        { step: 4, codeLine: 28, instruction: 'template.replace("Abuja", "Lagos")', internalEffect: 'Allocates a new string with "Abuja" substituted by "Lagos", leaving template unchanged.' },
      ],
      apply: {
        domain: 'Data Cleansing & Customer CRM',
        contextTitle: 'Sanitizing User Registration Inputs',
        scenario: 'Web sign-up pipelines clean messy user inputs by running email.strip().lower() to ensure duplicates with stray spaces or capital letters are normalized.',
      },
      commonMistakes: [
        {
          label: 'Assuming strip() Removes an Exact Sequence',
          explanation: 'strip("abc") strips any characters \'a\', \'b\', or \'c\' from the margins, not the exact sequence "abc".',
          erroneousCode: 'domain = "apple.com"\ncleaned = domain.strip(".com")  # Also strips \'a\', \'p\', \'l\', \'e\' if in the set!',
        },
        {
          label: 'Expecting in-Place Mutation with Methods',
          explanation: 'Calling text.lower() without capturing its return value discards the result because strings cannot be mutated in place.',
          erroneousCode: 'name = "PYTHON"\nname.lower()  # Discarded! name is still "PYTHON". Must do: name = name.lower()',
        },
      ],
      practise: [
        {
          id: 'd4-s8-ex1',
          title: 'Fixing the Titlecase Apostrophe & Strip Traps',
          type: 'fix-the-bug',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Editorial Publishing Platform for Nigerian Literature',
          prompt: 'A publishing engine processes author names and URL slugs. The current code incorrectly uses .title() on contractions (yielding "They\'Re" instead of "They\'re") and uses .strip(".ng") which inadvertently eats letters. Fix both issues.',
          starterCode: `# Fix editorial text formatting bugs
text = "they're author's notes"
slug = "lagos-tech-hub.ng"

# Learner's buggy code:
# title_text = text.title()  # Produces "They'Re Author'S Notes"
# clean_slug = slug.strip(".ng")  # Eats 'g', 'n' from slug text!

# Fix 1: Capitalize the first letter and keep contractions lowercase
title_text = text.capitalize()

# Fix 2: Remove exact suffix ".ng" using slicing or replacement
if slug.endswith(".ng"):
    clean_slug = slug[:-3]
else:
    clean_slug = slug

print("Title:", title_text)
print("Slug:", clean_slug)`,
          solutionCode: `text = "they're author's notes"
slug = "lagos-tech-hub.ng"

title_text = text.capitalize()
clean_slug = slug[:-3] if slug.endswith(".ng") else slug

print("Title:", title_text)
print("Slug:", clean_slug)`,
          testCases: [
            {
              id: 'tc-1',
              label: 'Editorial Format Verification',
              setup: '',
              expected: "Title: They're author's notes\nSlug: lagos-tech-hub",
              hidden: false,
            },
          ],
          hints: [
            'Do not use .title() because apostrophes trigger uppercase letters after them ("They\'Re").',
            'Do not use .strip(".ng") because strip treats ".ng" as a set of characters ({".", "n", "g"}).',
            'Use slicing slug[:-3] when slug.endswith(".ng") to remove the exact 3-character suffix.',
          ],
        },
      ],
      sourceNotes: 'Derived from Asabeneh\'s 30 Days of Python: Day 4 Strings (capitalize, lower, upper, title, swapcase, strip, replace sections).',
    },

    // ==========================================
    // Subtopic 9: Splitting & Joining: split(), rsplit(), splitlines(), join()
    // ==========================================
    {
      id: 'day4-sub9',
      number: 9,
      title: 'Splitting & Joining: split(), rsplit(), splitlines(), and join()',
      summary: 'Deconstruct strings into lists with split() and rsplit(), understand default whitespace runs, and glue iterables safely with join().',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Deconstruction and Assembly: The Split and Join Synergy',
        paragraphs: [
          'Text processing frequently involves breaking a long sentence or data record into individual pieces (splitting) or assembling a list of strings into a single formatted document (joining).',
          'Crucial Watch-out: Python\'s split() behaves dramatically differently depending on whether you provide an argument: s.split() with NO delimiter automatically splits on runs of any whitespace (multiple spaces, tabs, newlines) and discards all empty string tokens. In contrast, s.split(" ") splits strictly on single spaces, so two consecutive spaces produce an empty string element (\'\') in the resulting list!',
          'The rsplit(sep, maxsplit) method splits starting from the right-hand side, which is indispensable when you only want to extract the final field of a delimited record. For multiline strings, splitlines() splits on newline boundaries.',
          'The inverse operation of split is join(): separator.join(iterable). The separator string acts as the glue. Crucial Watch-out: join() requires an iterable of pure strings! Passing a list containing integers or floats raises a TypeError: sequence item N: expected str instance, int found. Convert non-strings with str() before joining.',
        ],
        keyTerms: [
          { term: 'split()', definition: 'Splits a string into a list of strings using a delimiter (defaults to any whitespace run).' },
          { term: 'rsplit()', definition: 'Enrichment method that splits starting from the right-hand end of the string.' },
          { term: 'splitlines()', definition: 'Enrichment method that splits a string at line breaks, returning a list of lines.' },
          { term: 'join()', definition: 'Concatenates an iterable of string elements with a specified glue separator string.' },
        ],
        bulletPoints: [
          'split() with no argument collapses multiple spaces and discards empty tokens.',
          'split(" ") splits on single spaces and keeps empty strings.',
          'separator.join(list) glues list items together with separator.',
          'join() raises TypeError if the iterable contains any non-string item.',
          'rsplit(sep, maxsplit=1) is ideal for isolating file extensions.',
        ],
      },
      visualise: {
        type: 'split-join',
        title: 'Split and Join Visualiser',
        badge: 'simulation',
        description: 'Watch a string break into a list of cards, and see list items glued back together with a separator.',
        initialConfig: { splitText: 'Python   Visual   Lab   2026' },
      },
      code: [
        {
          title: 'Splitting Strings and Joining Iterables',
          runMode: 'real',
          code: `# 1. split() whitespace vs split(' ') single space
messy_text = "Python   Visual    Lab   2026"
default_split = messy_text.split()
space_split = messy_text.split(' ')

print("Original text:        ", f"'{messy_text}'")
print("split() [whitespace]: ", default_split)
print("split(' ') [spaces]:  ", space_split)

# 2. Delimiter splitting with comma-separated values (CSV)
csv_line = "Ada,Lovelace,Computer Science,London,1815"
fields = csv_line.split(',')
print("\\nCSV parsed fields:   ", fields)

# 3. rsplit() to extract last element
filepath = "projects/visual_lab/engine/runtime.py"
path_parts = filepath.rsplit('/', 1)
print("Directory & Filename:", path_parts)

# 4. join() operation with separator
tech_stack = ["Python", "TypeScript", "React", "Tailwind"]
csv_output = ", ".join(tech_stack)
pipe_output = " | ".join(tech_stack)
print("\\nJoined with comma:   ", csv_output)
print("Joined with pipe:    ", pipe_output)

# Safe join of numbers using generator or list comprehension
scores = [98, 85, 92, 100]
scores_str = " - ".join(str(s) for s in scores)
print("Joined numbers safely:", scores_str)`,
          expectedOutput: `Original text:         'Python   Visual    Lab   2026'
split() [whitespace]:  ['Python', 'Visual', 'Lab', '2026']
split(' ') [spaces]:   ['Python', '', '', 'Visual', '', '', '', 'Lab', '', '', '2026']

CSV parsed fields:    ['Ada', 'Lovelace', 'Computer Science', 'London', '1815']
Directory & Filename: ['projects/visual_lab/engine', 'runtime.py']

Joined with comma:    Python, TypeScript, React, Tailwind
Joined with pipe:     Python | TypeScript | React | Tailwind
Joined numbers safely: 98 - 85 - 92 - 100`,
        },
      ],
      explain: [
        { step: 1, codeLine: 3, instruction: 'messy_text.split()', internalEffect: 'Recognizes continuous whitespace runs and returns exactly 4 clean token strings.' },
        { step: 2, codeLine: 4, instruction: "messy_text.split(' ')", internalEffect: 'Strictly splits on each single space, producing multiple empty string elements \'\'.' },
        { step: 3, codeLine: 16, instruction: "filepath.rsplit('/', 1)", internalEffect: 'Scans from the right, performs exactly 1 split at the last slash, separating folder from file.' },
        { step: 4, codeLine: 21, instruction: '", ".join(tech_stack)', internalEffect: 'Allocates a single buffer, writes each string separated by ", ", completing in O(N) time.' },
      ],
      apply: {
        domain: 'Data Pipelines & CSV File Processing',
        contextTitle: 'Parsing Delimited Bank Statement Feeds',
        scenario: 'Financial data import scripts read raw CSV transaction lines, split on comma lines.split(","), extract date and amount fields, and join clean records with standard delimiters.',
      },
      commonMistakes: [
        {
          label: 'Passing Non-String Elements to join() (TypeError)',
          explanation: 'join() requires all items to be strings. Passing numbers raises TypeError.',
          erroneousCode: 'nums = [1, 2, 3]\nres = "-".join(nums)  # TypeError: sequence item 0: expected str instance, int found',
        },
        {
          label: 'Inverting join() Caller and Argument',
          explanation: 'In Python, the separator is the string object calling .join(list), not list.join(separator).',
          erroneousCode: 'words = ["hello", "world"]\nres = words.join(" ")  # AttributeError: \'list\' object has no attribute \'join\'',
        },
      ],
      practise: [
        {
          id: 'd4-s9-ex1',
          title: 'Predicting Default Whitespace vs Literal Space Split',
          type: 'predict-output',
          tier: 'standard',
          points: 15,
          contextScenario: 'Data Cleaning Script for Multi-Space Survey Responses',
          prompt: 'What will be printed when running this script?\n\n```python\ntext = "Abuja   Kano   Ibadan"\na = len(text.split())\nb = len(text.split(" "))\nprint(f"{a}, {b}")\n```',
          options: [
            {
              id: 'opt-1',
              text: '3, 7',
              explanation: 'Correct! text.split() collapses arbitrary runs of whitespace and yields 3 items ([\'Abuja\', \'Kano\', \'Ibadan\']). text.split(" ") splits strictly on single spaces, producing empty strings for the consecutive spaces, resulting in 7 items!',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: '3, 3',
              explanation: 'Incorrect. text.split(" ") does not collapse multiple spaces.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: '7, 3',
              explanation: 'Incorrect. The outputs are reversed.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: '3, 5',
              explanation: 'Incorrect. Count the exact spaces: there are 3 spaces between each word, so two sets of 3 spaces produce 7 tokens.',
              isCorrect: false,
            },
          ],
          hints: [
            'Remember: split() with no argument treats consecutive spaces as ONE delimiter.',
            'split(" ") strictly splits on every single space character, creating empty string tokens.',
            'There are 3 tokens from split(), and 7 tokens from split(" ").',
          ],
        },
        {
          id: 'd4-s9-ex2',
          title: 'Order Lines: Clean & Pipe-Delimit Student Data',
          type: 'order-the-lines',
          tier: 'challenge',
          points: 20,
          contextScenario: 'JAMB Central Admissions Processing System (CAPS)',
          prompt: 'Arrange the lines to split a messy raw comma-delimited record, strip whitespace from each field, and rejoin the tokens using a pipe (" | ") separator.',
          starterCode: '# Order the lines to clean and rejoin the record\n',
          solutionCode: `raw_data = "  Bello Musa , 285 , Medicine , UNILAG  "
tokens = [field.strip() for field in raw_data.split(",")]
clean_record = " | ".join(tokens)
print("Sanitized:", clean_record)`,
          jumbledLines: [
            { id: 'l1', code: 'raw_data = "  Bello Musa , 285 , Medicine , UNILAG  "', indent: 0 },
            { id: 'l2', code: 'tokens = [field.strip() for field in raw_data.split(",")]', indent: 0 },
            { id: 'l3', code: 'clean_record = " | ".join(tokens)', indent: 0 },
            { id: 'l4', code: 'print("Sanitized:", clean_record)', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: [
            'Start by defining the raw_data string.',
            'Use list comprehension with field.strip() after splitting on comma.',
            'Join the clean tokens using " | ".join(tokens).',
          ],
        },
      ],
      sourceNotes: 'Derived from Asabeneh\'s 30 Days of Python: Day 4 Strings (split and join sections).',
    },

    // ==========================================
    // Subtopic 10: Character Predicates & Type Inspection (is...() Methods)
    // ==========================================
    {
      id: 'day4-sub10',
      number: 10,
      title: 'Character Predicates & Type Inspection (is...() Methods)',
      summary: 'Inspect character contents with isalpha(), isalnum(), isidentifier(), and master the isdecimal() vs isdigit() vs isnumeric() hierarchy.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Character Classification: The isdecimal() vs isdigit() vs isnumeric() Hierarchy',
        paragraphs: [
          'Python provides a rich collection of boolean predicate methods starting with is... that return True if all characters in the string meet a specific criteria and the string is not empty.',
          'Common predicates include: isalpha() (all alphabetic letters), isalnum() (letters or numbers), islower() (all cased characters are lowercase), isupper() (all uppercase), isspace() (whitespace only), and isidentifier() (valid Python variable name).',
          'Crucial Watch-out: Python has THREE distinct numeric inspection methods with a strict subset relationship: isdecimal() ⊂ isdigit() ⊂ isnumeric().',
          '1. isdecimal(): Strict base-10 Unicode decimal characters (0 through 9). Subscripts and fractions are rejected.',
          '2. isdigit(): Decimals PLUS compatibility digits like superscripts (e.g. "²", "³") and circled numbers. Fractions are rejected.',
          '3. isnumeric(): Decimals + digits + any Unicode numeric symbol, including vulgar fractions (e.g. "½", "¾") and Roman numeral symbols (e.g. "Ⅻ").',
          'Note that negative numbers like "-5" and floats like "3.14" return False across all three methods because "-" and "." are punctuation characters!',
        ],
        keyTerms: [
          { term: 'isdecimal()', definition: 'Returns True if all characters are strict Unicode decimal digits (0-9).' },
          { term: 'isdigit()', definition: 'Returns True if all characters are digits (includes superscripts like ²).' },
          { term: 'isnumeric()', definition: 'Returns True if all characters are numeric (includes fractions like ½ and Roman numeral glyphs).' },
          { term: 'isidentifier()', definition: 'Returns True if the string is a valid Python variable or identifier name.' },
        ],
        bulletPoints: [
          'Hierarchy: isdecimal() ⊂ isdigit() ⊂ isnumeric().',
          '"123" is True for all three.',
          '"²" is isdigit() and isnumeric(), but NOT isdecimal().',
          '"½" is isnumeric(), but NOT isdigit() or isdecimal().',
          '"-5" and "3.14" evaluate to False on all three (contain non-digit symbols).',
        ],
      },
      visualise: {
        type: 'numeric-predicates',
        title: 'Digit, Decimal & Numeric Inspector',
        badge: 'simulation',
        description: 'Test "123", "²", "½", "Ⅻ", "-5", and "3.14" side-by-side to verify predicate evaluation.',
        initialConfig: { testString: '²' },
      },
      code: [
        {
          title: 'Comparing isdecimal, isdigit, isnumeric, and Predicates',
          runMode: 'real',
          code: `# The Tri-Predicate Numeric Comparison
test_cases = [
    ("123", "Standard ASCII Digits"),
    ("²",   "Superscript Two"),
    ("½",   "Vulgar Fraction"),
    ("-42", "Negative Integer"),
    ("3.14","Floating Point String"),
]

print(f"{'VALUE':<8} | {'isdecimal()':<11} | {'isdigit()':<9} | {'isnumeric()':<11} | {'CATEGORY'}")
print("-" * 65)

for val, label in test_cases:
    dec = val.isdecimal()
    dig = val.isdigit()
    num = val.isnumeric()
    print(f"{val:<8} | {str(dec):<11} | {str(dig):<9} | {str(num):<11} | {label}")

# Additional predicate methods
print("\\n--- General Predicates ---")
print("'Python3'.isalnum():      ", "Python3".isalnum())
print("'Python'.isalpha():       ", "Python".isalpha())
print("'user_account'.isidentifier():", "user_account".isidentifier())
print("'2026_user'.isidentifier():    ", "2026_user".isidentifier())  # Cannot start with number!
print("'   \\t\\n'.isspace():         ", "   \t\n".isspace())`,
          expectedOutput: `VALUE    | isdecimal() | isdigit() | isnumeric() | CATEGORY
-----------------------------------------------------------------
123      | True        | True      | True        | Standard ASCII Digits
²        | False       | True      | True        | Superscript Two
½        | False       | False     | True        | Vulgar Fraction
-42      | False       | False     | False       | Negative Integer
3.14     | False       | False     | False       | Floating Point String

--- General Predicates ---
'Python3'.isalnum():       True
'Python'.isalpha():        True
'user_account'.isidentifier(): True
'2026_user'.isidentifier():     False
'   \t\n'.isspace():          True`,
        },
      ],
      explain: [
        { step: 1, codeLine: 13, instruction: 'val.isdecimal()', internalEffect: 'Checks if codepoints belong strictly to Unicode general category Nd (decimal numbers).' },
        { step: 2, codeLine: 14, instruction: 'val.isdigit()', internalEffect: 'Includes Nd plus category No (compatibility digits with special formatting like ²).' },
        { step: 3, codeLine: 15, instruction: 'val.isnumeric()', internalEffect: 'Includes Nd, No, and Nl (all Unicode numeric representations like fractions).' },
        { step: 4, codeLine: 24, instruction: '"2026_user".isidentifier()', internalEffect: 'Fails because Python identifiers cannot begin with an ASCII digit.' },
      ],
      apply: {
        domain: 'Form Validation & KYC Compliance',
        contextTitle: 'Nigerian BVN & National ID Number Validation',
        scenario: 'FinTech customer identity verification checks if a Bank Verification Number (BVN) consists strictly of 11 decimal digits using bvn.isdecimal() and len(bvn) == 11.',
      },
      commonMistakes: [
        {
          label: 'Using isdigit() to Validate User Floats or Negative Numbers',
          explanation: '"3.14".isdigit() returns False because "." is not a digit. To test for floats, wrap float() in a try/except block.',
          erroneousCode: 'age = "-5"\nif age.isdigit():  # False! "-" causes isdigit to fail, skipping valid negative numbers',
        },
      ],
      practise: [
        {
          id: 'd4-s10-ex1',
          title: 'Deciphering the isdecimal vs isdigit vs isnumeric Hierarchy',
          type: 'scenario-mcq',
          tier: 'standard',
          points: 15,
          contextScenario: 'Unicode Character Parser in Math Equation Parser',
          prompt: 'Which of the following statements accurately characterizes Python\'s behavior for the string "²" (superscript two)?',
          options: [
            {
              id: 'opt-1',
              text: '"²".isdecimal() is False, but "²".isdigit() and "²".isnumeric() are both True.',
              explanation: 'Correct! "²" is a compatibility digit (category No), so it is a digit and numeric, but not a strict base-10 decimal digit.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: '"²".isdecimal(), "²".isdigit(), and "²".isnumeric() are all True.',
              explanation: 'Incorrect. isdecimal() strictly requires standard digits 0 through 9.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: '"²".isnumeric() is True, but "²".isdigit() is False.',
              explanation: 'Incorrect. "²" is accepted by isdigit() because it is an exponent/digit.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'All three methods return False because "²" is a non-ASCII symbol.',
              explanation: 'Incorrect. Python 3 string predicate methods natively support the full Unicode database.',
              isCorrect: false,
            },
          ],
          hints: [
            'Remember the inclusion hierarchy: isdecimal() ⊂ isdigit() ⊂ isnumeric().',
            'Superscripts are digits, but not base-10 decimal digits.',
            'Option 1 correctly identifies isdecimal as False and the other two as True.',
          ],
        },
      ],
      sourceNotes: 'Derived from Asabeneh\'s 30 Days of Python: Day 4 Strings (isalnum, isalpha, isdecimal, isdigit, isnumeric, isidentifier sections).',
    },

    // ==========================================
    // Subtopic 11: Practical String Engineering & Pipelines
    // ==========================================
    {
      id: 'day4-sub11',
      number: 11,
      title: 'Practical String Engineering & Clean Data Pipelines',
      summary: 'Synthesize all string capabilities into an end-to-end data pipeline cleaning phone numbers, currency, and receipts.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Production String Engineering: Building High-Performance Data Pipelines',
        paragraphs: [
          'In production software engineering, text is rarely clean or uniform. User inputs, API payloads, and database exports arrive with erratic whitespace, inconsistent letter casing, missing country codes, and non-standard currency symbols.',
          'A reliable string engineering pipeline applies a clear sequence of transformations: 1. Strip external whitespace, 2. Normalize casing, 3. Validate character predicates (e.g. length and digits), 4. Deconstruct delimited components with split, and 5. Reconstruct standardized representations using f-strings or join.',
          'Performance consideration: Repeatedly concatenating strings with + inside a loop (e.g. s += item) incurs an O(N²) time complexity because each concatenation creates and copies an entirely new string in memory. The Pythonic, O(N) linear-time standard is to append items to a list and join them all at once: "".join(pieces).',
        ],
        keyTerms: [
          { term: 'Data Pipeline', definition: 'A sequence of processing stages where the output of each text transformation step feeds into the next.' },
          { term: 'O(N) String Accumulation', definition: 'The practice of collecting string fragments in a list and calling "".join(list) rather than repeated + concatenation.' },
          { term: 'Sanitization', definition: 'The process of cleaning, trimming, and normalizing raw input into safe, predictable formats.' },
        ],
        bulletPoints: [
          'Step 1: Trim margins with strip().',
          'Step 2: Normalize casing with lower() or upper().',
          'Step 3: Validate digit counts with isdecimal().',
          'Step 4: Use "".join(list) for high-performance string accumulation.',
          'Step 5: Format final output with modern f-strings.',
        ],
      },
      visualise: {
        type: 'string-methods-lab',
        title: 'Production String Pipeline Inspector',
        badge: 'simulation',
        description: 'Verify sequential transformations across real-world messy data.',
        initialConfig: { inputText: '  +234 803 123 4567  ', selectedMethodName: 'strip' },
      },
      code: [
        {
          title: 'End-to-End Nigerian Phone Number and Financial Sanitizer',
          runMode: 'real',
          code: `# Real-world raw customer dataset
raw_records = [
    "  +234 803 456 7890 | chidi@tech.ng | ₦150,000.50  ",
    "  0812-987-6543 | AISHA@LAGOS.IO | 45000  ",
    "  +2348021112233 | Ngozi@Abuja.Dev | ₦2,500,000.00  ",
]

def clean_record(raw_line: str) -> dict:
    # 1. Split into fields and trim margins
    parts = [p.strip() for p in raw_line.split('|')]
    raw_phone, raw_email, raw_amount = parts

    # 2. Standardize Nigerian telephone number to E.164 (+234...)
    clean_digits = "".join(c for c in raw_phone if c.isdigit())
    if clean_digits.startswith("234"):
        standard_phone = "+" + clean_digits
    elif clean_digits.startswith("0"):
        standard_phone = "+234" + clean_digits[1:]
    else:
        standard_phone = "+234" + clean_digits

    # 3. Clean email
    standard_email = raw_email.lower()

    # 4. Standardize currency amount to float
    clean_amount_str = raw_amount.replace("₦", "").replace(",", "").strip()
    amount_val = float(clean_amount_str)

    return {
        "phone": standard_phone,
        "email": standard_email,
        "amount": amount_val,
        "formatted_display": f"Customer {standard_email} ({standard_phone}) -> ₦{amount_val:,.2f}"
    }

print("=== Sanitized Customer Database Records ===")
for rec in raw_records:
    cleaned = clean_record(rec)
    print(cleaned["formatted_display"])`,
          expectedOutput: `=== Sanitized Customer Database Records ===
Customer chidi@tech.ng (+2348034567890) -> ₦150,000.50
Customer aisha@lagos.io (+2348129876543) -> ₦45,000.00
Customer ngozi@abuja.dev (+2348021112233) -> ₦2,500,000.00`,
        },
      ],
      explain: [
        { step: 1, codeLine: 10, instruction: '[p.strip() for p in raw_line.split(\'|\')]', internalEffect: 'Splits on pipe delimiter and trims leading/trailing whitespace from each field.' },
        { step: 2, codeLine: 14, instruction: '"".join(c for c in raw_phone if c.isdigit())', internalEffect: 'Filters out spaces, dashes, and plus symbols in O(N) time, keeping pure digits.' },
        { step: 3, codeLine: 23, instruction: 'standard_email = raw_email.lower()', internalEffect: 'Normalizes mixed casing in email addresses for case-insensitive lookup.' },
        { step: 4, codeLine: 26, instruction: 'raw_amount.replace("₦", "").replace(",", "")', internalEffect: 'Strips currency glyph and comma grouping so string can be safely parsed by float().' },
      ],
      apply: {
        domain: 'Data Warehousing & ETL Automation',
        contextTitle: 'High-Volume Stream Cleansing',
        scenario: 'ETL pipelines processing millions of payment records clean and structure disparate raw text records into normalized PostgreSQL database rows.',
      },
      commonMistakes: [
        {
          label: 'Using += to Accumulate Strings inside Tight Loops (O(N²))',
          explanation: 'Using s += char repeatedly reallocates the entire string in memory. Collect items in a list and call "".join(list) instead.',
          erroneousCode: 'res = ""\nfor c in big_text:\n    res += c.lower()  # Inefficient O(N²) reallocation in CPython!',
        },
      ],
      practise: [
        {
          id: 'd4-s11-ex1',
          title: 'Automated SMS Alert Builder & E.164 Phone Normalizer',
          type: 'write-code',
          tier: 'project',
          points: 30,
          contextScenario: 'FinTech Transaction SMS Notification Engine',
          prompt: 'Write Python code that normalizes a raw Nigerian phone number into canonical E.164 format (+234...) and generates an SMS debit alert message with the account masked and amount formatted with Naira symbol and commas.',
          starterCode: `# Build SMS Alert
raw_phone = " 0803-456-7890 "
account = "0123456789"
amount = 45000.0

# 1. Clean raw_phone to digits only
# 2. Convert to E.164 (+234...)
# 3. Mask account: 6 asterisks + last 4 digits
# 4. Generate message: "Alert: Debit ₦<amount:,.2f> from Acct <masked> sent to <phone>"
`,
          solutionCode: `raw_phone = " 0803-456-7890 "
account = "0123456789"
amount = 45000.0

digits = "".join(c for c in raw_phone if c.isdigit())
if digits.startswith("0"):
    phone = "+234" + digits[1:]
elif digits.startswith("234"):
    phone = "+" + digits
else:
    phone = "+234" + digits

masked = "*" * 6 + account[-4:]
message = f"Alert: Debit ₦{amount:,.2f} from Acct {masked} sent to {phone}"
print(message)`,
          testCases: [
            {
              id: 'tc-1',
              label: 'SMS Alert Notification Verification',
              setup: '',
              expected: 'Alert: Debit ₦45,000.00 from Acct ******6789 sent to +2348034567890',
              hidden: false,
            },
          ],
          hints: [
            'Filter non-digits with "".join(c for c in raw_phone if c.isdigit()).',
            'Replace the leading "0" with "+234".',
            'Mask the account with "*" * 6 + account[-4:].',
            'Format the amount with : , . 2 f inside an f-string.',
          ],
        },
      ],
      sourceNotes: 'Derived from Asabeneh\'s 30 Days of Python: Day 4 Strings (Exercises & String Processing sections).',
    },
  ],
  realWorldLabs: [
    {
      id: 'day4-lab1',
      title: 'E.164 Telecom Phone Number Normalizer & Carrier Tagger',
      description: 'Clean varied raw user input phone numbers, standardize them into international E.164 (+234...) format, and classify telecom carrier network based on carrier dialing prefixes.',
      domain: 'Telecommunications & SMS Gateway Services',
      starterCode: `# E.164 Telecom Phone Number Normalizer & Carrier Tagger
raw_contacts = [
    ("Ngozi Eze", "0803 123 4567"),
    ("Babajide Sanwo", "+234 812-345-6789"),
    ("Musa Danjuma", "07065551212"),
    ("Kemi Adeyemi", "0809 999 8877"),
]

def tag_carrier(e164_number: str) -> str:
    # Dialing prefixes after +234:
    # MTN: 803, 806, 703, 706, 813, 816, 810, 814, 903, 906
    # Airtel: 802, 808, 708, 812, 701, 902, 904, 901, 907
    # Glo: 805, 807, 705, 815, 811, 905
    # 9mobile: 809, 817, 818, 909, 908
    prefix = e164_number[4:7]
    if prefix in ("803", "806", "703", "706", "813", "816", "810", "814", "903", "906"):
        return "MTN Nigeria"
    elif prefix in ("802", "808", "708", "812", "701", "902", "904", "901", "907"):
        return "Airtel Nigeria"
    elif prefix in ("805", "807", "705", "815", "811", "905"):
        return "Globacom (Glo)"
    elif prefix in ("809", "817", "818", "909", "908"):
        return "9mobile"
    return "Other Network"

print("=================================================================")
print(f"{'CONTACT NAME':<16} | {'E.164 NUMBER':<16} | {'CARRIER'}")
print("=================================================================")

for name, raw in raw_contacts:
    digits = "".join(c for c in raw if c.isdigit())
    if digits.startswith("0"):
        clean_num = "+234" + digits[1:]
    elif digits.startswith("234"):
        clean_num = "+" + digits
    else:
        clean_num = "+234" + digits

    carrier = tag_carrier(clean_num)
    print(f"{name:<16} | {clean_num:<16} | {carrier}")
`,
      targetOutput: `=================================================================
CONTACT NAME     | E.164 NUMBER     | CARRIER
=================================================================
Ngozi Eze        | +2348031234567   | MTN Nigeria
Babajide Sanwo   | +2348123456789   | Airtel Nigeria
Musa Danjuma     | +2347065551212   | MTN Nigeria
Kemi Adeyemi     | +2348099998877   | 9mobile`,
    },
    {
      id: 'day4-lab2',
      title: 'Point-of-Sale (POS) Multi-Currency Receipt Parser & Kobo Formatter',
      description: 'Ingest raw semicolon-delimited point-of-sale receipt records, extract item quantities, prices, and tax rates, and generate a formatted, aligned retail purchase receipt.',
      domain: 'FinTech & Retail POS Engineering',
      starterCode: `# POS Multi-Item Receipt Parser
raw_receipt_data = """ITEM: Golden Penny Flour ; QTY: 2 ; PRICE: ₦4,500.00
ITEM: Peak Evaporated Milk ; QTY: 6 ; PRICE: ₦750.50
ITEM: Dangote Granulated Sugar ; QTY: 3 ; PRICE: ₦2,200.00"""

lines = raw_receipt_data.strip().splitlines()
grand_total = 0.0

print("==========================================================")
print("              E-COMMERCE SUPERSTORE LAGOS                 ")
print("                     OFFICIAL RECEIPT                     ")
print("----------------------------------------------------------")
print(f"{'ITEM DESCRIPTION':<25} | {'QTY':>4} | {'UNIT (₦)':>10} | {'SUBTOTAL (₦)':>12}")
print("----------------------------------------------------------")

for line in lines:
    parts = [p.strip() for p in line.split(';')]
    item_name = parts[0].replace("ITEM:", "").strip()
    qty = int(parts[1].replace("QTY:", "").strip())
    raw_price = parts[2].replace("PRICE:", "").replace("₦", "").replace(",", "").strip()
    unit_price = float(raw_price)
    subtotal = qty * unit_price
    grand_total += subtotal

    print(f"{item_name:<25} | {qty:>4} | {unit_price:>10,.2f} | {subtotal:>12,.2f}")

print("----------------------------------------------------------")
vat_7_5 = grand_total * 0.075
final_bill = grand_total + vat_7_5
print(f"{'SUBTOTAL:':<43} | ₦{grand_total:>11,.2f}")
print(f"{'VAT (7.5%):':<43} | ₦{vat_7_5:>11,.2f}")
print("==========================================================")
print(f"{'TOTAL PAYABLE:':<43} | ₦{final_bill:>11,.2f}")
print("==========================================================")
`,
      targetOutput: `==========================================================
              E-COMMERCE SUPERSTORE LAGOS                 
                     OFFICIAL RECEIPT                     
----------------------------------------------------------
ITEM DESCRIPTION          |  QTY |   UNIT (₦) | SUBTOTAL (₦)
----------------------------------------------------------
Golden Penny Flour        |    2 |   4,500.00 |     9,000.00
Peak Evaporated Milk      |    6 |     750.50 |     4,503.00
Dangote Granulated Sugar  |    3 |   2,200.00 |     6,600.00
----------------------------------------------------------
SUBTOTAL:                                   | ₦  20,103.00
VAT (7.5%):                                 | ₦   1,507.73
==========================================================
TOTAL PAYABLE:                              | ₦  21,610.73
==========================================================`,
    },
  ],
  miniProject: {
    id: 'day4-project',
    title: 'Bank Verification Number & Financial Receipt Parser',
    brief: 'Implement a comprehensive text processing pipeline that ingests dirty multi-source bank verification records, normalizes telephone numbers into E.164 format, validates 11-digit BVN strings with isdecimal(), masks payment card numbers, and renders an aligned customer audit report.',
    requirements: [
      'Parse dirty multi-line, pipe-delimited records and strip whitespace from every field.',
      'Validate 11-digit BVN strings using isdecimal() and len(bvn) == 11, flagging invalid non-digit records.',
      'Standardize diverse phone formats ("080...", "+234...", "234...") into canonical E.164 (+234...).',
      'Mask 16-digit card numbers into "************1234" format using slicing and concatenation.',
      'Format financial balances with thousand comma separators and 2 decimal places (₦{val:,.2f}) in an aligned report table.',
    ],
    rubric: [
      { criterion: 'Data Sanitization: Correctly splits pipe fields and trims leading/trailing whitespace.', weight: 35 },
      { criterion: 'Format Compliance: Validates 11-digit BVNs with isdecimal() and normalizes phone numbers to E.164.', weight: 35 },
      { criterion: 'Security Masking & Table Presentation: Accurately masks card numbers and formats currency with ₦ and commas.', weight: 30 },
    ],
    starterCode: `# Capstone Project: Bank Verification Number (BVN) & Financial Audit Engine
raw_records = [
    "  Chidi Okafor | 22114455667 | 08031234567 | 5399882211004455 | ₦450,000.75  ",
    "  Amina Bello | 229988X4400 | +234 812-345-6789 | 4111222233334444 | 1250000  ",
    "  Emeka Nwosu | 22334455667 | 07065551212 | 5123456789012345 | ₦89,250.00  ",
]

print("=========================================================================================")
print(f"{'CUSTOMER NAME':<14} | {'BVN (STATUS)':<15} | {'PHONE (E.164)':<15} | {'CARD (MASKED)':<17} | {'BALANCE'}")
print("=========================================================================================")

for line in raw_records:
    # 1. Clean fields
    name, bvn, phone_raw, card_raw, balance_raw = [x.strip() for x in line.split('|')]

    # 2. Validate BVN
    is_valid_bvn = len(bvn) == 11 and bvn.isdecimal()
    bvn_display = bvn if is_valid_bvn else f"{bvn} (INVALID)"

    # 3. Normalize phone to E.164
    digits = "".join(c for c in phone_raw if c.isdigit())
    if digits.startswith("0"):
        phone_e164 = "+234" + digits[1:]
    elif digits.startswith("234"):
        phone_e164 = "+" + digits
    else:
        phone_e164 = "+234" + digits

    # 4. Mask card: 12 asterisks + last 4 digits
    card_masked = "*" * 12 + card_raw[-4:]

    # 5. Format balance
    clean_bal = float(balance_raw.replace("₦", "").replace(",", "").strip())
    bal_display = f"₦{clean_bal:,.2f}"

    print(f"{name:<14} | {bvn_display:<15} | {phone_e164:<15} | {card_masked:<17} | {bal_display:>12}")

print("=========================================================================================")
`,
  },
  dayQuiz: {
    title: 'Day 4 Strings Mastery Assessment',
    passingScorePercentage: 80,
    questions: [
      {
        id: 'd4-q1',
        scenario: 'String Memory Immutability and Item Assignment',
        question: 'A junior developer executes the code: word = "Python"; word[0] = "J". What happens in CPython?',
        options: [
          {
            id: 'q1-a',
            text: 'TypeError: \'str\' object does not support item assignment is raised.',
            explanation: 'Correct! Strings in Python are immutable; once allocated in memory, their individual characters cannot be overwritten or modified in place.',
            isCorrect: true,
          },
          {
            id: 'q1-b',
            text: 'word becomes "Jython" without error.',
            explanation: 'Incorrect. Python strings are strictly immutable and do not allow item assignment.',
            isCorrect: false,
          },
          {
            id: 'q1-c',
            text: 'IndexError: string index out of range is raised.',
            explanation: 'Incorrect. Index 0 is within bounds; the error is a TypeError due to immutability.',
            isCorrect: false,
          },
          {
            id: 'q1-d',
            text: 'A warning is issued and word is converted into a list.',
            explanation: 'Incorrect. Python never silently converts types on illegal assignment.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd4-q2',
        scenario: 'Out-of-Bounds Indexing vs Slicing Invariant',
        question: 'Given s = "Python", what is the outcome of evaluating s[10] versus evaluating s[2:10]?',
        options: [
          {
            id: 'q2-a',
            text: 's[10] raises IndexError, whereas s[2:10] gracefully returns "thon".',
            explanation: 'Correct! Direct indexing past the sequence boundary raises IndexError. Slicing gracefully clamps out-of-range indices to sequence boundaries without error.',
            isCorrect: true,
          },
          {
            id: 'q2-b',
            text: 'Both expressions raise an IndexError: string index out of range.',
            explanation: 'Incorrect. Slicing never raises an IndexError when indices exceed length; it clamps.',
            isCorrect: false,
          },
          {
            id: 'q2-c',
            text: 'Both expressions return empty strings without error.',
            explanation: 'Incorrect. Indexing s[10] crashes with an IndexError.',
            isCorrect: false,
          },
          {
            id: 'q2-d',
            text: 's[10] returns None, while s[2:10] returns "thon".',
            explanation: 'Incorrect. Python indexing raises an exception rather than returning None.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd4-q3',
        scenario: 'Log Searching Error Handling with find() and index()',
        question: 'What is the fundamental behavioral difference between s.find("abc") and s.index("abc") when "abc" is absent from string s?',
        options: [
          {
            id: 'q3-a',
            text: 'find() returns -1, while index() raises a ValueError: substring not found.',
            explanation: 'Correct! find() safely returns sentinel integer -1, whereas index() crashes unless wrapped in a try/except block.',
            isCorrect: true,
          },
          {
            id: 'q3-b',
            text: 'find() raises a KeyError, while index() returns None.',
            explanation: 'Incorrect. Neither method raises KeyError or returns None.',
            isCorrect: false,
          },
          {
            id: 'q3-c',
            text: 'find() searches from the left, while index() searches from the right.',
            explanation: 'Incorrect. Both search from the left; rfind() and rindex() search from the right.',
            isCorrect: false,
          },
          {
            id: 'q3-d',
            text: 'They are identical aliases of the same C function in CPython.',
            explanation: 'Incorrect. They differ fundamentally in their absent substring error behavior.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd4-q4',
        scenario: 'Whitespace Runs in Delimiter Splitting',
        question: 'How does text.split() differ from text.split(" ") when text contains multiple consecutive spaces (e.g. "A   B")?',
        options: [
          {
            id: 'q4-a',
            text: 'split() treats runs of whitespace as a single separator and discards empty tokens, while split(" ") splits on each space and produces empty strings.',
            explanation: 'Correct! split() with no argument collapses runs of any whitespace, whereas split(" ") strictly splits on single spaces, yielding [\'A\', \'\', \'\', \'B\'].',
            isCorrect: true,
          },
          {
            id: 'q4-b',
            text: 'They produce identical lists in all scenarios.',
            explanation: 'Incorrect. split(" ") retains empty string tokens between consecutive spaces.',
            isCorrect: false,
          },
          {
            id: 'q4-c',
            text: 'split() raises ValueError if there are consecutive spaces.',
            explanation: 'Incorrect. split() handles multiple spaces seamlessly.',
            isCorrect: false,
          },
          {
            id: 'q4-d',
            text: 'split(" ") automatically removes punctuation characters.',
            explanation: 'Incorrect. split(" ") does not touch punctuation.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd4-q5',
        scenario: 'Type Safety in String Joining Operations',
        question: 'What occurs when executing: "-".join(["Lagos", 2026, "Abuja"])?',
        options: [
          {
            id: 'q5-a',
            text: 'TypeError: sequence item 1: expected str instance, int found is raised.',
            explanation: 'Correct! join() strictly requires all elements of the iterable to be string objects. Integers must be explicitly cast with str().',
            isCorrect: true,
          },
          {
            id: 'q5-b',
            text: 'It automatically coerces 2026 into a string and returns "Lagos-2026-Abuja".',
            explanation: 'Incorrect. Python does not perform implicit type coercion inside str.join().',
            isCorrect: false,
          },
          {
            id: 'q5-c',
            text: 'It skips the integer and returns "Lagos-Abuja".',
            explanation: 'Incorrect. join() aborts execution immediately with a TypeError.',
            isCorrect: false,
          },
          {
            id: 'q5-d',
            text: 'ValueError is raised.',
            explanation: 'Incorrect. The exception raised is TypeError, not ValueError.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd4-q6',
        scenario: 'Character Classification Hierarchy for Superscript and Fraction',
        question: 'Which statement accurately describes the evaluation of the tri-predicate methods on "²" and "½"?',
        options: [
          {
            id: 'q6-a',
            text: '"²" is isdigit() and isnumeric() but NOT isdecimal(); "½" is isnumeric() but NOT isdigit() or isdecimal().',
            explanation: 'Correct! The hierarchy is isdecimal() ⊂ isdigit() ⊂ isnumeric(). Superscripts are digits and numeric; fractions are numeric only.',
            isCorrect: true,
          },
          {
            id: 'q6-b',
            text: 'Both "²" and "½" evaluate to True across all three methods.',
            explanation: 'Incorrect. isdecimal() rejects both superscripts and fractions.',
            isCorrect: false,
          },
          {
            id: 'q6-c',
            text: 'Neither character is recognized by any of the numeric predicates.',
            explanation: 'Incorrect. Python 3 supports full Unicode categories Nd, No, and Nl.',
            isCorrect: false,
          },
          {
            id: 'q6-d',
            text: '"½" is isdecimal() because it represents a mathematical number.',
            explanation: 'Incorrect. Decimal digits must strictly be base-10 radix digits 0-9.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd4-q7',
        scenario: 'The .title() Method and English Apostrophe Pitfall',
        question: 'What is the output of "they\'re bill\'s friends".title() in Python, and why is it considered a pitfall?',
        options: [
          {
            id: 'q7-a',
            text: '"They\'Re Bill\'S Friends" — because title() treats non-letter apostrophes as word boundaries.',
            explanation: 'Correct! Python defines word boundaries as any non-letter character, so the letters following apostrophes are incorrectly capitalized.',
            isCorrect: true,
          },
          {
            id: 'q7-b',
            text: '"They\'re Bill\'s Friends" — because title() correctly recognizes English grammatical contractions.',
            explanation: 'Incorrect. Built-in title() does not parse grammar rules and capitalizes after apostrophes.',
            isCorrect: false,
          },
          {
            id: 'q7-c',
            text: 'SyntaxError: apostrophes cannot be used with title().',
            explanation: 'Incorrect. The method executes without syntax error.',
            isCorrect: false,
          },
          {
            id: 'q7-d',
            text: '"THEY\'RE BILL\'S FRIENDS" — all letters are capitalized.',
            explanation: 'Incorrect. That is the behavior of .upper().',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd4-q8',
        scenario: 'Character Set vs Substring Behavior in strip()',
        question: 'What is the result of evaluating "comic.com".strip(".com") in Python?',
        options: [
          {
            id: 'q8-a',
            text: '"i" — because strip removes any character in the set {\'.\', \'c\', \'o\', \'m\'} from both ends.',
            explanation: 'Correct! strip() removes any matching characters from the margins. "c", "o", "m" on the left and ".com" on the right are all stripped, leaving only "i"!',
            isCorrect: true,
          },
          {
            id: 'q8-b',
            text: '"comic" — removing the exact suffix ".com".',
            explanation: 'Incorrect. To remove an exact suffix, use str.removesuffix(".com") in Python 3.9+.',
            isCorrect: false,
          },
          {
            id: 'q8-c',
            text: '"" — the entire string is removed.',
            explanation: 'Incorrect. "i" is not in the set {\'.\', \'c\', \'o\', \'m\'}, so it remains.',
            isCorrect: false,
          },
          {
            id: 'q8-d',
            text: '"comic." — only "com" is removed.',
            explanation: 'Incorrect. "." is in the strip set so it is removed as well.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd4-q9',
        scenario: 'Negative Stride Sequence Reversal',
        question: 'How does Python evaluate the slice expression word[::-1] on any string word?',
        options: [
          {
            id: 'q9-a',
            text: 'It constructs a brand-new string with all characters in reversed order from end to start.',
            explanation: 'Correct! Slicing with a negative step of -1 steps backwards from the end of the sequence to index 0, producing a reversed copy.',
            isCorrect: true,
          },
          {
            id: 'q9-b',
            text: 'It mutates the word variable in place to reverse its letters.',
            explanation: 'Incorrect. Strings are immutable; slicing always returns a new string object.',
            isCorrect: false,
          },
          {
            id: 'q9-c',
            text: 'It returns an IndexError because step cannot be negative.',
            explanation: 'Incorrect. Negative steps are standard and fully supported in Python slices.',
            isCorrect: false,
          },
          {
            id: 'q9-d',
            text: 'It returns only the last character of the string.',
            explanation: 'Incorrect. word[-1] returns the last character; word[::-1] traverses the entire string.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd4-q10',
        scenario: 'Modern f-String Currency and Alignment Formatting',
        question: 'What does the expression f"Total: ₦{250000.5:,.2f}" evaluate to?',
        options: [
          {
            id: 'q1-a',
            text: '"Total: ₦250,000.50"',
            explanation: 'Correct! The format specifier :, adds a comma thousands grouping separator, and .2f rounds to two decimal places with trailing zero.',
            isCorrect: true,
          },
          {
            id: 'q10-b',
            text: '"Total: ₦250000.5"',
            explanation: 'Incorrect. The specifiers :, and .2f format commas and force 2 decimal digits.',
            isCorrect: false,
          },
          {
            id: 'q10-c',
            text: '"Total: ₦250,000.5"',
            explanation: 'Incorrect. .2f guarantees exactly two digits after the decimal point (.50).',
            isCorrect: false,
          },
          {
            id: 'q10-d',
            text: 'SyntaxError: currency symbols are not supported inside format specifiers.',
            explanation: 'Incorrect. The currency symbol "₦" is outside the braces and part of the string literal template.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
    ],
  },
  cheatSheet: [
    {
      category: 'String Literals, Delimiters & Multiline Docstrings',
      syntax: "'...' | \"...\" | '''...''' | \"\"\"...\"\"\"",
      description: 'Single and double quotes define single-line strings and allow embedding opposite quotes without backslash escaping. Triple quotes preserve literal line breaks and whitespace, ideal for multiline docstrings, prompt templates, and multiline text blocks.',
      example: `# Delimiter alternation eliminates backslash escaping:
msg1 = 'She said, "Python strings are immutable!"'
msg2 = "He replied, 'Indeed, they allocate brand-new memory!'"

# Triple quotes retain exact newlines and indentation:
docstring = """Financial Transaction Normalizer
Version: 2026.4
Enforces E.164 phone formats and POS receipts."""

print(msg1)
print(docstring)`,
    },
    {
      category: 'Escape Sequences & Raw String Literals',
      syntax: '\\n, \\t, \\\\, \\\', \\", r"..."',
      description: 'Escape sequences represent non-printable or reserved characters. Backslash introduces an escape. Prepending r or R defines a raw string literal, which suppresses escape sequence interpretation and treats backslashes as literal characters (essential for regular expressions and Windows file paths).',
      example: `# Standard escape sequences:
table = "Item\\tPrice\\nRice\\t₦85,000\\nOil\\t₦42,000"
print(table)

# Raw strings for Regex and file paths:
regex_pattern = r"^(\\+234|0)[789][01]\\d{8}$"
win_path = r"C:\\Users\\Nnamdi\\Documents\\PythonLab"
print("Pattern:", regex_pattern)
print("Path:   ", win_path)`,
    },
    {
      category: 'String Concatenation & Sequence Multiplication',
      syntax: 'str1 + str2 (Concatenation) | str * count (Multiplication)',
      description: 'The + operator concatenates two strings into a newly allocated string. Crucial Watch-out: Concatenating a string with a non-string raises TypeError: can only concatenate str to str. Explicitly convert with str(). The * operator repeats a string N times; multiplying by <= 0 yields an empty string "".',
      example: `# Safe concatenation with explicit type conversion:
carrier = "MTN Nigeria"
code = 703
prefix = carrier + " (" + str(code) + ")"
print(prefix)

# Repeating banners and dividers:
divider = "=" * 35
print(divider)
print("   CENTRAL BANK OF NIGERIA   ")
print(divider)`,
    },
    {
      category: 'Character Indexing & Memory Offsets',
      syntax: 's[0] (First) | s[-1] (Last) | s[i] (Offset)',
      description: 'Strings are ordered, zero-indexed sequences of Unicode characters. Positive indices range from 0 to len(s) - 1. Negative indices count backward from -1 (last character) to -len(s) (first character). Crucial Watch-out: Accessing an index outside valid range raises IndexError: string index out of range.',
      example: `word = "PYTHON"
# Positive:  P: 0,  Y: 1,  T: 2,  H: 3,  O: 4,  N: 5
# Negative:  P:-6,  Y:-5,  T:-4,  H:-3,  O:-2,  N:-1

print("First char (0):  ", word[0])   # 'P'
print("Last char (-1):  ", word[-1])  # 'N'
print("Penultimate (-2):", word[-2])  # 'O'

# Bound verification:
# word[6] -> IndexError: string index out of range`,
    },
    {
      category: 'Sequence Slicing & Negative Strides',
      syntax: 's[start:stop:step] | s[::-1] (Reverse)',
      description: 'Extracts a slice from start up to but excluding stop, advancing by step. Defaults: start=0, stop=len(s), step=1. Slicing never raises IndexError; out-of-bounds indices clamp silently. A negative step strides backwards; s[::-1] produces a reversed copy of the string.',
      example: `token = "PAYSTACK-2026-TXN"

print("Prefix (0:8):     ", token[:8])       # 'PAYSTACK'
print("Suffix (-3:):     ", token[-3:])      # 'TXN'
print("Middle (9:13):    ", token[9:13])     # '2026'
print("Every 2nd char:   ", token[::2])      # 'PSTC-06TN'
print("Reversed (::-1):  ", token[::-1])     # 'NXT-6202-KCATSYAP'`,
    },
    {
      category: 'Modern String Formatting & f-Strings',
      syntax: 'f"{value:format_spec}" | str.format() | %',
      description: 'PEP 498 f-strings (Python 3.6+) evaluate expressions dynamically at runtime. Format specifiers follow a colon : inside the braces. Common specifiers include :.2f (fixed decimal precision), :, (comma thousands separator), :<10 (left align), :>10 (right align), and :^10 (center align).',
      example: `amount = 1250890.654
rate = 0.075

# Financial currency formatting:
print(f"Subtotal: ₦{amount:,.2f}")          # ₦1,250,890.65
print(f"VAT (7.5%): ₦{amount * rate:,.2f}")  # ₦93,816.80

# Column alignment table:
print(f"{'Item':<12} | {'Qty':^5} | {'Unit Price':>12}")
print(f"{'-'*12} | {'-'*5} | {'-'*12}")
print(f"{'POS Terminal':<12} | {3:^5} | {f'₦{45000:,.2f}':>12}")`,
    },
    {
      category: 'String Immutability & Safe Construction',
      syntax: "TypeError on s[i] = val | Construct with join() or slicing",
      description: "Strings in Python are strictly immutable. Once created in memory, individual characters cannot be overwritten or deleted. Attempting item assignment raises TypeError: 'str' object does not support item assignment. Safe updates require constructing a new string using slicing or ''.join().",
      example: `city = "Lekki"
# city[0] = "P"  # Raises TypeError: 'str' object does not support item assignment!

# Safe pattern 1: Slicing + concatenation
updated_city = "P" + city[1:]  # 'Pekki'
print(updated_city)

# Safe pattern 2: List mutation + join
chars = list("Flutterwave")
chars[0] = "f"
clean_brand = "".join(chars)
print("Joined brand:", clean_brand)  # 'flutterwave'`,
    },
    {
      category: 'Case Manipulation & Whitespace Stripping',
      syntax: 's.lower() | s.upper() | s.capitalize() | s.title() | s.swapcase() | s.strip([chars])',
      description: 'Case transformations return new strings without mutating the original. strip(), lstrip(), rstrip() remove outer characters (defaults to whitespace). Crucial Watch-out: strip(chars) treats chars as an unordered set of characters, NOT an exact substring! Use slicing or removesuffix() for exact suffix stripping.',
      example: `raw_input = "   DR. ALIKO DANGOTE, GCON   \\n"
clean = raw_input.strip()
print("Clean:      ", clean)
print("Title case: ", clean.title())
print("Lower case: ", clean.lower())

# strip set watchout:
slug = "lagos-state.ng"
print("strip (set): ", slug.strip(".ng"))  # 'lagos-state' (safe here, but dangerous!)
url = "comic.com"
print("comic.com:   ", url.strip(".com"))   # 'i' (strips all chars in set {'.', 'c', 'o', 'm'}!)`,
    },
    {
      category: 'Splitting & Joining Operations',
      syntax: 's.split([sep, maxsplit]) | s.rsplit() | s.splitlines() | sep.join(iterable)',
      description: 'split() with no argument collapses consecutive whitespace runs and discards empty tokens. split(sep) splits strictly on the literal delimiter sep. rsplit() splits from the right. sep.join(list) glues elements together with sep. Crucial Watch-out: join() raises TypeError if the iterable contains non-strings.',
      example: `# split() whitespace collapse vs split(' ') literal space:
raw_log = "2026-11-02   ERROR    ConnectionTimeout"
print("split() [run]:  ", raw_log.split())      # ['2026-11-02', 'ERROR', 'ConnectionTimeout']
print("split(' '):     ", raw_log.split(' '))  # Contains multiple '' empty strings

# Joining string lists:
tags = ["fintech", "nigeria", "payments", "python"]
csv_line = ", ".join(tags)
print("Joined CSV:     ", csv_line)

# Safe numeric join with generator expression:
pin_digits = [9, 4, 1, 8]
pin_str = "".join(str(d) for d in pin_digits)
print("PIN string:     ", pin_str)`,
    },
    {
      category: 'Searching & Substring Inspection',
      syntax: 's.find(sub) | s.index(sub) | s.count(sub) | s.startswith(sub) | s.endswith(sub) | sub in s',
      description: 'sub in s returns a boolean. find(sub) returns the index of the first occurrence or -1 if absent. Crucial Watch-out: index(sub) raises ValueError: substring not found when absent! Use find() when absence is expected. rfind() and rindex() search from the right. count() counts non-overlapping matches.',
      example: `email = "support@moniepoint.com.ng"

print("Is support?: ", email.startswith("support"))  # True
print("Has .ng?:     ", email.endswith(".ng"))         # True
print("Has @?:       ", "@" in email)                  # True

# find vs index:
at_idx = email.find("@")
print("At index:    ", at_idx)       # 7
missing = email.find("pay")
print("Missing find:", missing)      # -1 (safe!)

# email.index("pay")  # ValueError: substring not found!`,
    },
    {
      category: 'Character Classification & Validation Predicates',
      syntax: 's.isdecimal() | s.isdigit() | s.isnumeric() | s.isalnum() | s.isalpha() | s.isidentifier()',
      description: 'Boolean inspection methods checking character classes. isdecimal() strictly checks base-10 ASCII/Unicode digits (0-9, safe for int()). isdigit() includes exponents/superscripts like ² (which fail int()). isnumeric() includes fractions like ½. isidentifier() validates Python identifier syntax.',
      example: `# Nigerian Bank Verification Number (BVN) validation:
bvn_candidate = "22194830192"
is_valid_bvn = len(bvn_candidate) == 11 and bvn_candidate.isdecimal()
print(f"BVN '{bvn_candidate}' valid: {is_valid_bvn}")  # True

# Digit classification hierarchy:
print("'123'.isdecimal():  ", "123".isdecimal())   # True
print("'²'.isdecimal():    ", "²".isdecimal())     # False (superscript)
print("'²'.isdigit():      ", "²".isdigit())       # True
print("'½'.isnumeric():    ", "½".isnumeric())     # True

# Python identifier validation:
print("'valid_var_1'.isidentifier():", "valid_var_1".isidentifier())  # True
print("'2_invalid'.isidentifier():  ", "2_invalid".isidentifier())    # False`,
    },
  ],
  sourceNotes: [
    "Source attribution: Asabeneh Yetayeh's '30 Days of Python' (Day 4 - Strings).",
    "Covers all 26 required methods plus 7 enrichment methods.",
  ],
};
