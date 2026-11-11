/**
 * Day 19: File Handling (Intermediate Python)
 * Part A (Learn) conforming to Sections 10, 13.2, and 14 of the Master Specification.
 * Includes:
 *  - 8 Detailed Subtopics following the 10-step pedagogical structure
 *  - 3 Signature Simulations: file-modes-sim, file-cursor-sim, structured-io-sim
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_19_MODULE: DayModule = {
  schemaVersion: 1,
  number: 19,
  title: 'File Handling',
  level: 'intermediate',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/19_Day_File_handling',
  estimatedMinutes: 75,
  prerequisites: [8, 17],
  objectives: [
    'Select the correct file open mode (r, w, a, x, b) and always specify encoding="utf-8" for text files',
    'Use `with open(...) as f:` context managers to guarantee automatic file closure',
    'Read files efficiently with read(), readline(), readlines(), and memory-safe line iteration',
    'Write and append text cleanly without accidentally truncating existing files in "w" mode',
    'Inspect and rewind file stream positions using tell() and seek(0)',
    'Serialize and deserialize structured data with Python’s json module (load, dump, loads, dumps)',
    'Process tabular CSV files using csv.reader, csv.DictReader, and csv.writer with newline=""',
    'Use modern object-oriented filesystem paths with pathlib.Path',
  ],
  subtopics: [
    {
      id: 'day19-sub1',
      number: 1,
      title: 'File Open Modes (r, w, a, x, b) & encoding="utf-8"',
      summary: 'Choose the right open() mode for reading, overwriting, appending, exclusive creation, or binary I/O.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Understanding open(path, mode, encoding="utf-8")',
        paragraphs: [
          'Python’s built-in `open()` function opens a file on disk and returns a file object. The `mode` string controls what operations are permitted and what happens if the file already exists or is missing.',
          'The four core text modes are **`"r"`** (read-only, default; raises `FileNotFoundError` if missing), **`"w"`** (write; **truncates** existing file to 0 bytes immediately or creates a new file), **`"a"`** (append; preserves existing content and writes at the end), and **`"x"`** (exclusive create; raises `FileExistsError` if the file already exists).',
          'For text files, always pass **`encoding="utf-8"`** so emojis, accented names, and currency symbols (`₦`, `€`) behave identically on Windows, macOS, and Linux. Add `"b"` (`"rb"`, `"wb"`) for raw binary files like images—and never pass `encoding=` in binary mode.',
        ],
        keyTerms: [
          {
            term: 'Mode "w" vs "a" vs "x"',
            definition: '"w" overwrites/truncates; "a" appends at EOF; "x" fails safely with FileExistsError if the file exists.',
          },
          {
            term: 'encoding="utf-8"',
            definition: 'Explicit character encoding preventing platform-dependent UnicodeDecodeError bugs.',
          },
        ],
        bulletPoints: [
          'Never pass `encoding=` with binary modes (`"rb"`, `"wb"`), or Python raises `ValueError`.',
          'Use `"x"` when generating unique exports that must not overwrite an existing file.',
        ],
      },
      visualise: {
        type: 'file-modes-sim',
        title: 'File Open Modes (r / w / a / x / rb) Inspector',
        badge: 'simulation',
        description: 'Compare how each open() mode handles existing files, missing files, and cursor start positions.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Safe Exclusive Creation & Missing File Handling',
          runMode: 'real',
          code: `try:
    with open("/tmp/missing_demo_19.txt", "r", encoding="utf-8") as f:
        print(f.read())
except FileNotFoundError as err:
    print("Missing:", type(err).__name__)`,
          expectedOutput: `Missing: FileNotFoundError`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'open("/tmp/missing_demo_19.txt", "r", encoding="utf-8")',
          internalEffect: 'Attempts to open a non-existent file in read mode, raising FileNotFoundError.',
        },
        {
          step: 2,
          codeLine: 4,
          instruction: 'except FileNotFoundError as err:',
          internalEffect: 'Catches the missing-file error cleanly without crashing.',
        },
      ],
      apply: {
        domain: 'Export Pipelines',
        contextTitle: 'Guarding Against Overwriting Daily Reports',
        scenario: 'Use "x" mode so re-running an export script never clobbers an already-generated report.',
        code: `import os
path = "/tmp/report_d19_unique.txt"
if os.path.exists(path):
    os.remove(path)

with open(path, "x", encoding="utf-8") as f:
    f.write("Report v1\\n")

try:
    open(path, "x", encoding="utf-8")
except FileExistsError:
    print("Protected: report already exists")`,
        outcome: 'Protected: report already exists',
      },
      commonMistakes: [
        {
          label: 'Passing encoding= to Binary Mode',
          erroneousCode: `open("photo.png", "rb", encoding="utf-8")`,
          errorMessage: 'ValueError: binary mode does not take an encoding argument',
          explanation: 'Binary mode reads raw bytes without decoding text, so encoding= is invalid.',
          correctedCode: `open("photo.png", "rb")`,
        },
      ],
      sourceNotes: 'Covers open() modes and UTF-8 encoding for Day 19.',
      practise: [
        {
          id: 'd19-s1-ex1',
          title: 'Scenario: Binary Mode & Encoding Clash',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Invoice PDF Exporter',
          prompt: 'A teammate writes `open("/tmp/invoice.pdf", "wb", encoding="utf-8")` and Python immediately raises `ValueError`. Why?',
          options: [
            { id: 'opt-1', text: 'Binary mode ("wb") writes raw bytes without text encoding, so passing encoding= is forbidden.', explanation: 'Correct! Omit encoding= whenever "b" is in the mode string.', isCorrect: true },
            { id: 'opt-2', text: 'PDF files require "utf-16" instead of "utf-8".', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: '"wb" only works on Windows.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'You must pass newline="" with "wb".', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'What does the "b" in "wb" stand for?',
            'Does Python encode or decode characters in binary mode?',
            'Binary mode takes no encoding= argument.',
          ],
        },
        {
          id: 'd19-s1-ex2',
          title: 'Fix the Bug: Prevent Overwriting an Existing Snapshot',
          type: 'fix-the-bug',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Audit Snapshot Guard',
          prompt: 'Change the open mode on the second `open()` call so it raises `FileExistsError` instead of overwriting the existing snapshot.',
          starterCode: `path = "/tmp/d19_ex_guard.txt"
with open(path, "w", encoding="utf-8") as f:
    f.write("v1")

try:
    with open(path, "w", encoding="utf-8") as f:
        f.write("v2")
    print("Overwritten!")
except FileExistsError:
    print("Protected")`,
          solutionCode: `path = "/tmp/d19_ex_guard.txt"
with open(path, "w", encoding="utf-8") as f:
    f.write("v1")

try:
    with open(path, "x", encoding="utf-8") as f:
        f.write("v2")
    print("Overwritten!")
except FileExistsError:
    print("Protected")`,
          testCases: [
            { id: 'tc-1', label: 'Prints Protected', setup: '', expected: 'Protected', hidden: false },
          ],
          hints: [
            '"w" truncates existing files silently.',
            'Which mode performs exclusive creation and fails if the file exists?',
            'Use "x".',
          ],
        },
        {
          id: 'd19-s1-ex3',
          title: 'Write Code: UTF-8 Currency Receipt',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'Cross-Platform POS Receipt',
          prompt: 'Write `"Total: ₦4,500"` to `"/tmp/d19_ex_utf8.txt"` using `encoding="utf-8"`, then read it back and print it.',
          starterCode: `path = "/tmp/d19_ex_utf8.txt"
# Write "Total: ₦4,500" with encoding="utf-8", then read and print it
`,
          solutionCode: `path = "/tmp/d19_ex_utf8.txt"
with open(path, "w", encoding="utf-8") as f:
    f.write("Total: ₦4,500")

with open(path, "r", encoding="utf-8") as f:
    print(f.read())`,
          testCases: [
            { id: 'tc-1', label: 'Prints Total: ₦4,500', setup: '', expected: 'Total: ₦4,500', hidden: false },
          ],
          hints: [
            'Use with open(path, "w", encoding="utf-8") as f:',
            'Then open in "r" mode with encoding="utf-8".',
            'print(f.read()).',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day19-sub2',
      number: 2,
      title: 'Context Managers (with open(...) as f:) & Automatic Cleanup',
      summary: 'Guarantee file handles are flushed and closed automatically—even if an exception occurs mid-block.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Why with open(...) Is Non-Negotiable',
        paragraphs: [
          'If you call `f = open(...)` without a `with` block and an exception happens before `f.close()`, the file handle stays open! Buffered writes may never reach disk, and long-running servers eventually hit OS file-descriptor limits (`OSError: Too many open files`).',
          'Python’s **`with open(...) as f:`** syntax uses the **context manager protocol** (`__enter__` and `__exit__`). When execution exits the indented `with` block—whether normally, via `return`, or via an exception—Python **automatically flushes and closes `f`**.',
          'You can even open multiple files in one `with` statement: `with open("in.txt", encoding="utf-8") as src, open("out.txt", "w", encoding="utf-8") as dst:`.',
        ],
        keyTerms: [
          {
            term: 'Context Manager (with)',
            definition: 'Protocol that guarantees setup (__enter__) and cleanup (__exit__, closing the file) even on exceptions.',
          },
        ],
        bulletPoints: [
          'Verify closure with `f.closed`—it is `False` inside the `with` block and `True` immediately after.',
          'Never manually call `open()` and `close()` when `with` can do it safely.',
        ],
      },
      visualise: {
        type: 'file-cursor-sim',
        title: 'with Context Manager & Cursor Lifecycle',
        badge: 'simulation',
        description: 'Step through opening, reading, and automatic handle closure on exit.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Automatic Closure Verified via f.closed',
          runMode: 'real',
          code: `with open("/tmp/d19_ctx.txt", "w", encoding="utf-8") as f:
    f.write("line 1\\n")
    print("Inside with, closed?", f.closed)

print("Outside with, closed?", f.closed)`,
          expectedOutput: `Inside with, closed? False
Outside with, closed? True`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'with open("/tmp/d19_ctx.txt", "w", encoding="utf-8") as f:',
          internalEffect: 'Calls __enter__(), returning the open file object bound to f.',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: 'Outside with, closed? True',
          internalEffect: 'Exiting the block triggers __exit__(), flushing buffers and closing f automatically.',
        },
      ],
      apply: {
        domain: 'Log Processing',
        contextTitle: 'Transforming Input File to Output File Safely',
        scenario: 'Open source and destination files together in one with statement.',
        code: `with open("/tmp/d19_src.txt", "w", encoding="utf-8") as f:
    f.write("alpha\\nbeta\\n")

with open("/tmp/d19_src.txt", "r", encoding="utf-8") as src, open("/tmp/d19_dst.txt", "w", encoding="utf-8") as dst:
    dst.write(src.read().upper())

with open("/tmp/d19_dst.txt", "r", encoding="utf-8") as check:
    print(check.read().strip())`,
        outcome: `ALPHA
BETA`,
      },
      commonMistakes: [
        {
          label: 'Reading From f Outside the with Block',
          erroneousCode: `with open("/tmp/d19_ctx.txt", "r", encoding="utf-8") as f:
    pass
print(f.read())  # ValueError: I/O operation on closed file!`,
          errorMessage: 'ValueError: I/O operation on closed file',
          explanation: 'As soon as the with block ends, f is closed and can no longer be read.',
          correctedCode: `with open("/tmp/d19_ctx.txt", "r", encoding="utf-8") as f:
    content = f.read()
print(content.strip())`,
        },
      ],
      sourceNotes: 'Covers with context managers for Day 19.',
      practise: [
        {
          id: 'd19-s2-ex1',
          title: 'Theory: Why Manual open()/close() Leaks Handles',
          type: 'theory-reasoning',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Long-Running Webhook Worker',
          prompt: 'A worker service calls `f = open(path, "w")` and `f.close()` without a `with` block. What happens when an unexpected `ValueError` occurs between `open` and `close`?',
          options: [
            { id: 'opt-1', text: 'f.close() is skipped, leaking an OS file descriptor and risking lost buffered writes.', explanation: 'Correct! A with block guarantees __exit__() closes the file even on exceptions.', isCorrect: true },
            { id: 'opt-2', text: 'Python automatically rolls back the file creation.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'The OS immediately deletes the file.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'ValueError cannot be raised while a file is open.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'When an exception is raised, do lines after it in the same try/function run?',
            'What guarantees cleanup even when an exception unwinds the stack?',
            'with open(...) as f: calls __exit__() automatically.',
          ],
        },
        {
          id: 'd19-s2-ex2',
          title: 'Predict Output: File Handle Closure State',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Config File Lifecycle',
          prompt: 'What does this code print?\n```python\nwith open("/tmp/d19_ex_lc.txt", "w", encoding="utf-8") as f:\n    f.write("ok")\n    a = f.closed\nb = f.closed\nprint(a, b)\n```',
          options: [
            { id: 'opt-1', text: 'False True', explanation: 'Correct! f is open inside the with block (False) and closed upon exit (True).', isCorrect: true },
            { id: 'opt-2', text: 'True True', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'False False', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'Raises ValueError', explanation: 'Incorrect. Checking f.closed is valid on a closed file.', isCorrect: false },
          ],
          hints: [
            'Is f closed while still inside the indented with block?',
            'What happens the moment execution leaves the with block?',
            'False True.',
          ],
        },
        {
          id: 'd19-s2-ex3',
          title: 'Order the Lines: Dual-File Context Manager',
          type: 'order-the-lines',
          tier: 'standard',
          points: 15,
          contextScenario: 'Dual-Stream Log Filter',
          prompt: 'Arrange the lines to seed a source file, copy only `"ERR"` lines using a single multi-file `with` statement, and verify the output.',
          jumbledLines: [
            { id: 'l3', code: 'dst.writelines(line for line in src if "ERR" in line)', indent: 1 },
            { id: 'l1', code: 'with open("/tmp/d19_ex_in.txt", "w", encoding="utf-8") as s: s.write("OK\\nERR disk\\n")', indent: 0 },
            { id: 'l5', code: 'print(check.read().strip())', indent: 1 },
            { id: 'l2', code: 'with open("/tmp/d19_ex_in.txt", encoding="utf-8") as src, open("/tmp/d19_ex_out.txt", "w", encoding="utf-8") as dst:', indent: 0 },
            { id: 'l4', code: 'with open("/tmp/d19_ex_out.txt", encoding="utf-8") as check:', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4', 'l5'],
          hints: [
            'First seed /tmp/d19_ex_in.txt.',
            'Then open both src and dst in one with statement.',
            'Finally read back and print check.read().strip().',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day19-sub3',
      number: 3,
      title: 'Reading Files (read(), readline(), readlines(), Line Iteration)',
      summary: 'Choose between loading whole files, reading line-by-line, or streaming huge files lazily with for line in f.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Four Ways to Read Text From a File',
        paragraphs: [
          'Python gives you four primary ways to read text: **`f.read()`** (returns the entire remaining file as one `str`), **`f.readline()`** (reads a single line including its trailing `\\n`), **`f.readlines()`** (returns a `list` of all remaining lines), and **`for line in f:`** (streams one line at a time lazily).',
          'For large log files (gigabytes in size), **`for line in f:`** is the gold standard because it keeps memory usage constant—only one line is held in RAM at a time, unlike `f.read()` or `f.readlines()`.',
          'Remember that `readline()`, `readlines()`, and `for line in f:` **preserve the trailing `\\n`** at the end of each line, so call `.strip()` or `.rstrip("\\n")` when comparing or parsing.',
        ],
        keyTerms: [
          {
            term: 'for line in f:',
            definition: 'Memory-efficient lazy iteration yielding one line at a time from an open file.',
          },
          {
            term: 'f.read() vs f.readlines()',
            definition: 'read() returns a single str; readlines() returns a list of line strings.',
          },
        ],
        bulletPoints: [
          'Strip trailing newlines with `line.rstrip("\\n")` or `line.strip()`.',
          'Avoid `f.read()` on multi-gigabyte files; iterate with `for line in f:`.',
        ],
      },
      visualise: {
        type: 'file-cursor-sim',
        title: 'File Reading Methods & EOF Behavior',
        badge: 'simulation',
        description: 'Inspect how read() and readline() advance the cursor through the file.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Comparing read(), readline(), and Lazy Line Iteration',
          runMode: 'real',
          code: `with open("/tmp/d19_lines.txt", "w", encoding="utf-8") as f:
    f.write("first\\nsecond\\nthird\\n")

with open("/tmp/d19_lines.txt", "r", encoding="utf-8") as f:
    first = f.readline().strip()
    rest = [line.strip() for line in f]

print("First:", first)
print("Rest:", rest)`,
          expectedOutput: `First: first
Rest: ['second', 'third']`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 5,
          instruction: 'first = f.readline().strip()',
          internalEffect: 'Reads "first\\n", advances cursor to line 2, and strips the newline.',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 'rest = [line.strip() for line in f]',
          internalEffect: 'Streams the remaining lines lazily from the current cursor position.',
        },
      ],
      apply: {
        domain: 'Log Filtering',
        contextTitle: 'Counting Matching Lines Without Loading File Into RAM',
        scenario: 'Stream a log file line by line and count lines containing "ERROR".',
        code: `import io
stream = io.StringIO("INFO ok\\nERROR disk\\nINFO done\\nERROR net\\n")
err_count = sum(1 for line in stream if "ERROR" in line)
print("Errors:", err_count)`,
        outcome: 'Errors: 2',
      },
      commonMistakes: [
        {
          label: 'Forgetting Trailing \\n When Comparing Lines',
          erroneousCode: `line = "OK\\n"
print(line == "OK")  # False!`,
          errorMessage: 'Logic bug: trailing newline causes equality check to fail',
          explanation: 'File lines retain their trailing \\n; strip it before comparing.',
          correctedCode: `print(line.rstrip("\\n") == "OK")  # True`,
        },
      ],
      sourceNotes: 'Covers read(), readline(), readlines(), and lazy iteration.',
      practise: [
        {
          id: 'd19-s3-ex1',
          title: 'Scenario: Reading a 4 GB Telemetry Log',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: '4 GB Telemetry Log Analyzer',
          prompt: 'You need to count `"TIMEOUT"` occurrences in a 4 GB server log on a container with 512 MB RAM. Which approach is memory-safe?',
          options: [
            { id: 'opt-1', text: 'Iterate lazily with `for line in f:` inside `with open(...) as f:`.', explanation: 'Correct! Lazy iteration holds only one line at a time in memory.', isCorrect: true },
            { id: 'opt-2', text: 'Call `f.readlines()` and loop over the list.', explanation: 'Incorrect. readlines() loads the entire 4 GB file into RAM.', isCorrect: false },
            { id: 'opt-3', text: 'Call `f.read().splitlines()`.', explanation: 'Incorrect. That allocates both the 4 GB string and a list of all lines.', isCorrect: false },
            { id: 'opt-4', text: 'Open the file in "w" mode first.', explanation: 'Incorrect. That would erase the log!', isCorrect: false },
          ],
          hints: [
            'Which reading method streams one line at a time without loading the whole file?',
            'for line in f:',
            'Lazy iteration keeps memory O(1) per line.',
          ],
        },
        {
          id: 'd19-s3-ex2',
          title: 'Fill the Gaps: Skip Header & Count Warnings',
          type: 'fill-the-gaps',
          tier: 'standard',
          points: 15,
          contextScenario: 'Sensor Alert Counter',
          prompt: 'Complete the code to skip the first header line and count lines starting with `"WARN"`.',
          gaps: [
            { id: 'g-1', beforeText: '_header = stream.', afterText: '()', correctAnswer: 'readline', options: ['readline', 'readlines', 'read', 'seek'] },
            { id: 'g-2', beforeText: 'warns = sum(1 for line in stream if line.', afterText: '("\\n").startswith("WARN"))', correctAnswer: 'rstrip', options: ['rstrip', 'split', 'replace', 'join'] },
          ],
          hints: [
            'Which method reads a single line (the header)?',
            'Which string method strips trailing "\\n"?',
            'readline and rstrip.',
          ],
        },
        {
          id: 'd19-s3-ex3',
          title: 'Write Code: Clean Non-Empty Lines',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'Batch Manifest Reader',
          prompt: 'Read `"/tmp/d19_ex_manifest.txt"`, strip whitespace from each line, skip blank lines, and print the resulting list.',
          starterCode: `path = "/tmp/d19_ex_manifest.txt"
with open(path, "w", encoding="utf-8") as f:
    f.write("svc-a\\n\\n  svc-b  \\n\\nsvc-c\\n")

# Read lines, strip whitespace, skip empty lines, and print the list
`,
          solutionCode: `path = "/tmp/d19_ex_manifest.txt"
with open(path, "w", encoding="utf-8") as f:
    f.write("svc-a\\n\\n  svc-b  \\n\\nsvc-c\\n")

with open(path, "r", encoding="utf-8") as f:
    items = [line.strip() for line in f if line.strip()]
print(items)`,
          testCases: [
            { id: 'tc-1', label: "Prints ['svc-a', 'svc-b', 'svc-c']", setup: '', expected: "['svc-a', 'svc-b', 'svc-c']", hidden: false },
          ],
          hints: [
            'Iterate with for line in f.',
            'Filter with if line.strip() and transform with line.strip().',
            "Prints ['svc-a', 'svc-b', 'svc-c'].",
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day19-sub4',
      number: 4,
      title: 'Writing, Appending & Flushing (write(), writelines(), w Trap)',
      summary: 'Write strings safely, avoid the writelines() missing-newline trap, and append without overwriting.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Writing & Appending Text Cleanly',
        paragraphs: [
          '**`f.write(text)`** writes a string to the file and returns the number of characters written. Unlike `print()`, `f.write()` does **not** add a newline `\\n` automatically!',
          'Similarly, **`f.writelines(list_of_strings)`** does **not** insert newlines between items—if you pass `["a", "b"]`, it writes `"ab"`. Always include `"\\n"` on each line or use `"\\n".join(lines)` with `f.write()`.',
          'Remember the `"w"` truncation trap: opening an existing file in `"w"` mode **erases its contents immediately**. When you want to add new entries to an existing log, always open in **`"a"`** (append) mode.',
        ],
        keyTerms: [
          {
            term: 'f.writelines()',
            definition: 'Writes an iterable of strings to a file without automatically inserting newline characters.',
          },
        ],
        bulletPoints: [
          '`f.write()` returns the character count written and does not add `\\n`.',
          'Use `"a"` mode to append; `"w"` erases existing content immediately upon `open()`.',
        ],
      },
      visualise: {
        type: 'file-modes-sim',
        title: '"w" Truncation vs "a" Append Inspector',
        badge: 'simulation',
        description: 'Compare how "w" and "a" affect existing file contents.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Writing and Appending Lines Cleanly',
          runMode: 'real',
          code: `path = "/tmp/d19_append.txt"
with open(path, "w", encoding="utf-8") as f:
    f.write("\\n".join(["entry 1", "entry 2"]) + "\\n")

with open(path, "a", encoding="utf-8") as f:
    f.write("entry 3\\n")

with open(path, "r", encoding="utf-8") as f:
    print(f.read().splitlines())`,
          expectedOutput: `['entry 1', 'entry 2', 'entry 3']`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'f.write("\\n".join(["entry 1", "entry 2"]) + "\\n")',
          internalEffect: 'Writes both lines separated by newlines in "w" mode.',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 'f.write("entry 3\\n")',
          internalEffect: 'Opens in "a" mode so entry 3 is appended after entry 2 without erasing earlier lines.',
        },
      ],
      apply: {
        domain: 'Audit Trails',
        contextTitle: 'Appending Timestamped Events',
        scenario: 'Append a new audit line to an existing log without overwriting prior entries.',
        code: `import io
buf = io.StringIO("boot\\n")
buf.seek(0, 2)  # Jump to end like 'a' mode
buf.write("ready\\n")
print(buf.getvalue().splitlines())`,
        outcome: "['boot', 'ready']",
      },
      commonMistakes: [
        {
          label: 'Expecting writelines() to Add Newlines Automatically',
          erroneousCode: `with open("/tmp/d19_wl.txt", "w", encoding="utf-8") as f:
    f.writelines(["a", "b"])  # Writes "ab" on one line!`,
          errorMessage: 'Formatting bug: "a" and "b" are concatenated without a newline',
          explanation: 'writelines() writes each string verbatim without adding \\n.',
          correctedCode: `with open("/tmp/d19_wl.txt", "w", encoding="utf-8") as f:
    f.writelines(item + "\\n" for item in ["a", "b"])`,
        },
      ],
      sourceNotes: 'Covers write(), writelines(), and append mode.',
      practise: [
        {
          id: 'd19-s4-ex1',
          title: 'Explain the Trace: The "w" Truncation Incident',
          type: 'explain-the-trace',
          tier: 'standard',
          points: 15,
          contextScenario: 'Daily Ledger Overwrite Incident',
          prompt: 'A script opens an existing 500-line ledger with `open("ledger.txt", "w", encoding="utf-8")` and crashes on line 2 before calling `f.write()`. Why is `ledger.txt` now 0 bytes?',
          options: [
            { id: 'opt-1', text: 'Mode "w" truncates an existing file to 0 bytes immediately upon open(), before any write() call runs.', explanation: 'Correct! Use "a" to append without truncating.', isCorrect: true },
            { id: 'opt-2', text: 'The context manager deletes the file whenever an exception happens.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'encoding="utf-8" clears non-ASCII files.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'Only f.writelines() preserves existing content.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'When does "w" mode erase an existing file?',
            'Does truncation wait for write() or happen during open()?',
            'Immediately upon open().',
          ],
        },
        {
          id: 'd19-s4-ex2',
          title: 'Fix the Bug: writelines() Missing Newlines',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 15,
          contextScenario: 'Batch Label Printer',
          prompt: 'Fix the `writelines()` call so `"A1"` and `"B2"` are written on separate lines and `.splitlines()` returns `[\'A1\', \'B2\']`.',
          starterCode: `path = "/tmp/d19_ex_labels.txt"
labels = ["A1", "B2"]
with open(path, "w", encoding="utf-8") as f:
    f.writelines(labels)

with open(path, "r", encoding="utf-8") as f:
    print(f.read().splitlines())`,
          solutionCode: `path = "/tmp/d19_ex_labels.txt"
labels = ["A1", "B2"]
with open(path, "w", encoding="utf-8") as f:
    f.writelines(label + "\\n" for label in labels)

with open(path, "r", encoding="utf-8") as f:
    print(f.read().splitlines())`,
          testCases: [
            { id: 'tc-1', label: "Prints ['A1', 'B2']", setup: '', expected: "['A1', 'B2']", hidden: false },
          ],
          hints: [
            'writelines() does not insert newlines between strings.',
            'Append "\\n" to each item or use "\\n".join(labels).',
            "['A1', 'B2'].",
          ],
        },
        {
          id: 'd19-s4-ex3',
          title: 'Write Code: Append-Only Event Log',
          type: 'write-code',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Append-Only Event Log',
          prompt: 'Create `"/tmp/d19_ex_events.txt"` with `"init\\n"` in `"w"` mode, then open it in `"a"` mode to append `"sync\\n"`, and print `.splitlines()`.',
          starterCode: `path = "/tmp/d19_ex_events.txt"
# Write "init\\n", append "sync\\n", then print read().splitlines()
`,
          solutionCode: `path = "/tmp/d19_ex_events.txt"
with open(path, "w", encoding="utf-8") as f:
    f.write("init\\n")

with open(path, "a", encoding="utf-8") as f:
    f.write("sync\\n")

with open(path, "r", encoding="utf-8") as f:
    print(f.read().splitlines())`,
          testCases: [
            { id: 'tc-1', label: "Prints ['init', 'sync']", setup: '', expected: "['init', 'sync']", hidden: false },
          ],
          hints: [
            'First with open(path, "w", encoding="utf-8") as f: f.write("init\\n").',
            'Second with open(path, "a", encoding="utf-8") as f: f.write("sync\\n").',
            'Read back and print f.read().splitlines().',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day19-sub5',
      number: 5,
      title: 'File Cursor Mechanics (tell(), seek(0), EOF Exhaustion)',
      summary: 'Track stream position with tell(), understand why a second read() returns "", and rewind with seek(0).',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Navigating the File Stream Cursor',
        paragraphs: [
          'Every open file maintains an internal **cursor** (byte/character offset). As you read or write, the cursor advances forward. You can inspect the current offset at any time with **`f.tell()`**.',
          'Once `f.read()` reaches the end of the file (EOF), the cursor sits at the final byte. Calling `f.read()` a **second time** without rewinding returns an **empty string `""`**—not an error, and not the file contents again!',
          'To rewind back to the beginning of the file, call **`f.seek(0)`**. In text mode, only `seek(0)` (start) or offsets previously returned by `tell()` are safe because multi-byte UTF-8 characters can span 1–4 bytes.',
        ],
        keyTerms: [
          {
            term: 'f.tell()',
            definition: 'Returns the current integer stream position of the file cursor.',
          },
          {
            term: 'f.seek(0)',
            definition: 'Moves the file cursor back to byte 0 (beginning of the file).',
          },
        ],
        bulletPoints: [
          'A second `f.read()` at EOF returns `""` unless you call `f.seek(0)` first.',
          'In text mode, avoid arbitrary `seek(n)` offsets—only `seek(0)` or `seek(saved_tell)` is safe with UTF-8.',
        ],
      },
      visualise: {
        type: 'file-cursor-sim',
        title: 'tell() & seek(0) Rewind Simulator',
        badge: 'simulation',
        description: 'Observe cursor byte offsets across read(), EOF, and seek(0).',
        initialConfig: {},
      },
      code: [
        {
          title: 'Observing EOF Exhaustion and Rewinding with seek(0)',
          runMode: 'real',
          code: `import io

f = io.StringIO("Hello\\nWorld")
print("Pos start:", f.tell())
first = f.read()
print("Pos after read:", f.tell(), "| second read:", repr(f.read()))
f.seek(0)
print("After seek(0), line 1:", repr(f.readline()))`,
          expectedOutput: `Pos start: 0
Pos after read: 11 | second read: ''
After seek(0), line 1: 'Hello\\n'`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 5,
          instruction: 'first = f.read()',
          internalEffect: 'Reads all 11 characters and leaves the cursor at EOF (position 11).',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 'f.read()',
          internalEffect: 'Returns "" immediately because cursor is already at EOF.',
        },
        {
          step: 3,
          codeLine: 7,
          instruction: 'f.seek(0)',
          internalEffect: 'Rewinds cursor to 0 so readline() reads "Hello\\n".',
        },
      ],
      apply: {
        domain: 'Data Validation',
        contextTitle: 'Two-Pass File Inspection',
        scenario: 'Count lines in a stream, rewind with seek(0), and then parse the header.',
        code: `import io
buf = io.StringIO("id,name\\n1,Ada\\n2,Tunde\\n")
line_count = sum(1 for _ in buf)
buf.seek(0)
header = buf.readline().strip()
print(f"Lines={line_count}, Header={header}")`,
        outcome: 'Lines=3, Header=id,name',
      },
      commonMistakes: [
        {
          label: 'Calling f.read() Twice Without seek(0)',
          erroneousCode: `import io
f = io.StringIO("data")
a = f.read()
b = f.read()  # b is ""!`,
          errorMessage: 'Logic bug: b is empty string because cursor is at EOF',
          explanation: 'Save the result of f.read() in a variable or call f.seek(0) before reading again.',
          correctedCode: `f.seek(0)
b = f.read()  # "data"`,
        },
      ],
      sourceNotes: 'Covers tell(), seek(0), and EOF exhaustion.',
      practise: [
        {
          id: 'd19-s5-ex1',
          title: 'Predict Output: EOF Exhaustion & tell()',
          type: 'predict-output',
          tier: 'standard',
          points: 15,
          contextScenario: 'Two-Pass Stream Check',
          prompt: 'What does this code print?\n```python\nimport io\nf = io.StringIO("ABC")\na = f.read()\npos = f.tell()\nb = f.read()\nprint(a, pos, repr(b))\n```',
          options: [
            { id: 'opt-1', text: "ABC 3 ''", explanation: 'Correct! After reading 3 chars, tell() is 3 (EOF), and a second read() returns "".', isCorrect: true },
            { id: 'opt-2', text: 'ABC 3 ABC', explanation: 'Incorrect. File streams do not auto-rewind.', isCorrect: false },
            { id: 'opt-3', text: "ABC 0 ''", explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'Raises EOFError', explanation: 'Incorrect. read() at EOF returns "", not an exception.', isCorrect: false },
          ],
          hints: [
            'Where is the cursor after f.read() consumes "ABC"?',
            'What does a second f.read() return at EOF?',
            "ABC 3 ''.",
          ],
        },
        {
          id: 'd19-s5-ex2',
          title: 'Fix the Bug: Rewind Before Reading Header',
          type: 'fix-the-bug',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Header + Row Count Validator',
          prompt: 'Fix the bug so `header` captures `"id,name"` instead of `""` after counting the lines.',
          starterCode: `import io
buf = io.StringIO("id,name\\n1,Ada\\n")
count = sum(1 for _ in buf)
header = buf.readline().strip()
print(count, header)`,
          solutionCode: `import io
buf = io.StringIO("id,name\\n1,Ada\\n")
count = sum(1 for _ in buf)
buf.seek(0)
header = buf.readline().strip()
print(count, header)`,
          testCases: [
            { id: 'tc-1', label: 'Prints 2 id,name', setup: '', expected: '2 id,name', hidden: false },
          ],
          hints: [
            'Iterating over buf leaves the cursor at EOF.',
            'Call buf.seek(0) before buf.readline().',
            'Prints 2 id,name.',
          ],
        },
        {
          id: 'd19-s5-ex3',
          title: 'Write Code: Byte Offset Bookmarking',
          type: 'write-code',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Protocol Frame Re-Reader',
          prompt: 'On `f = io.StringIO("HDR12_PAYLOAD")`, read 6 chars, save `pos = f.tell()`, read the rest, call `f.seek(pos)`, and print `f.read()`.',
          starterCode: `import io
f = io.StringIO("HDR12_PAYLOAD")
# Read 6 chars, save tell(), read rest, seek(pos), print f.read()
`,
          solutionCode: `import io
f = io.StringIO("HDR12_PAYLOAD")
_ = f.read(6)
pos = f.tell()
_ = f.read()
f.seek(pos)
print(f.read())`,
          testCases: [
            { id: 'tc-1', label: 'Prints PAYLOAD', setup: '', expected: 'PAYLOAD', hidden: false },
          ],
          hints: [
            'f.read(6) reads "HDR12_".',
            'pos = f.tell() is 6.',
            'f.seek(pos) returns to "PAYLOAD".',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day19-sub6',
      number: 6,
      title: 'JSON File I/O (json.load(), json.dump(), indent=2)',
      summary: 'Serialize Python dicts and lists to JSON files and parse JSON back into native Python objects.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Working with JSON Strings & Files',
        paragraphs: [
          'Python’s standard-library **`json`** module provides four functions: **`json.dumps(obj)`** / **`json.loads(s)`** (with **`s`** for **string**) and **`json.dump(obj, f)`** / **`json.load(f)`** (for **file** objects).',
          'When writing JSON files for humans or version control, pass **`indent=2`** and **`ensure_ascii=False`** (with `encoding="utf-8"`) so Unicode characters like `₦` or `é` stay readable instead of turning into `\\u20a6`.',
          'Note that JSON only supports `dict` (with `str` keys), `list`, `str`, `int`, `float`, `bool`, and `None`. Sets, tuples (converted to JSON arrays), and `datetime` objects require conversion before `json.dump()`.',
        ],
        keyTerms: [
          {
            term: 'load/dump vs loads/dumps',
            definition: 'load/dump read and write file objects; loads/dumps convert to and from Python strings.',
          },
        ],
        bulletPoints: [
          'Mnemonic: `s` at the end (`loads`, `dumps`) means **string**; no `s` (`load`, `dump`) means **file**.',
          'Invalid JSON raises `json.JSONDecodeError` (a subclass of `ValueError`).',
        ],
      },
      visualise: {
        type: 'structured-io-sim',
        title: 'JSON, CSV & pathlib.Path Format Inspector',
        badge: 'simulation',
        description: 'Inspect how Python types map to JSON and how indent=2 formats output.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Writing and Reading JSON Files with json.dump / json.load',
          runMode: 'real',
          code: `import json

payload = {"service": "auth", "port": 8080, "active": True, "notes": None}
with open("/tmp/d19_cfg.json", "w", encoding="utf-8") as f:
    json.dump(payload, f, indent=2)

with open("/tmp/d19_cfg.json", "r", encoding="utf-8") as f:
    loaded = json.load(f)

print("Loaded port:", loaded["port"], "| active:", loaded["active"])`,
          expectedOutput: `Loaded port: 8080 | active: True`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 5,
          instruction: 'json.dump(payload, f, indent=2)',
          internalEffect: 'Serializes payload to JSON (True -> true, None -> null) and writes it directly to f.',
        },
        {
          step: 2,
          codeLine: 8,
          instruction: 'loaded = json.load(f)',
          internalEffect: 'Parses the JSON file back into a native Python dict.',
        },
      ],
      apply: {
        domain: 'API Configuration',
        contextTitle: 'Handling Corrupt JSON Safely',
        scenario: 'Catch json.JSONDecodeError when parsing untrusted configuration text.',
        code: `import json

try:
    cfg = json.loads("{bad json}")
except json.JSONDecodeError as err:
    print("Caught:", type(err).__name__)`,
        outcome: 'Caught: JSONDecodeError',
      },
      commonMistakes: [
        {
          label: 'Confusing json.load(f) with json.loads(str)',
          erroneousCode: `import json
json.load('{"a": 1}')  # AttributeError: str has no .read()!`,
          errorMessage: "AttributeError: 'str' object has no attribute 'read'",
          explanation: 'json.load() expects a file-like object with .read(); use json.loads() for a string.',
          correctedCode: `json.loads('{"a": 1}')`,
        },
      ],
      sourceNotes: 'Covers json.load(), json.dump(), json.loads(), json.dumps().',
      practise: [
        {
          id: 'd19-s6-ex1',
          title: 'Scenario: json.load() vs json.loads()',
          type: 'scenario-mcq',
          tier: 'standard',
          points: 15,
          contextScenario: 'Feature Flag Loader',
          prompt: 'You receive a JSON payload as a Python `str` from an HTTP response and call `json.load(body)`. Python raises `AttributeError: \'str\' object has no attribute \'read\'`. What is the fix?',
          options: [
            { id: 'opt-1', text: 'Call `json.loads(body)` instead (`s` for string); `json.load()` is only for file-like objects.', explanation: 'Correct!', isCorrect: true },
            { id: 'opt-2', text: 'Pass `encoding="utf-8"` to `json.load()`.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'Call `json.dump(body)` first.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'Wrap `body` in a list.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'What does the "s" in json.loads() stand for?',
            'json.load() expects an object with .read().',
            'Use json.loads(body).',
          ],
        },
        {
          id: 'd19-s6-ex2',
          title: 'Fill the Gaps: Pretty-Printed Unicode JSON',
          type: 'fill-the-gaps',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Pretty-Printed API Cache',
          prompt: 'Complete the code to dump `data` to `f` with 2-space indentation and readable Unicode, then load it back.',
          gaps: [
            { id: 'g-1', beforeText: 'json.', afterText: '(data, f, indent=2, ensure_ascii=False)', correctAnswer: 'dump', options: ['dump', 'dumps', 'load', 'loads'] },
            { id: 'g-2', beforeText: 'loaded = json.', afterText: '(f)', correctAnswer: 'load', options: ['load', 'loads', 'dump', 'dumps'] },
          ],
          hints: [
            'Writing to a file object uses dump (no s).',
            'Reading from a file object uses load (no s).',
            'dump and load.',
          ],
        },
        {
          id: 'd19-s6-ex3',
          title: 'Write Code: Resilient Settings Deserializer',
          type: 'write-code',
          tier: 'project',
          points: 25,
          contextScenario: 'User Preferences Store',
          prompt: 'Write `{"theme": "dark", "retries": 3}` to `"/tmp/d19_ex_prefs.json"`, load it back with `json.load()`, and print `loaded["retries"]`.',
          starterCode: `import json

prefs = {"theme": "dark", "retries": 3}
path = "/tmp/d19_ex_prefs.json"
# Write with json.dump, read back with json.load, print retries
`,
          solutionCode: `import json

prefs = {"theme": "dark", "retries": 3}
path = "/tmp/d19_ex_prefs.json"
with open(path, "w", encoding="utf-8") as f:
    json.dump(prefs, f, indent=2)

with open(path, "r", encoding="utf-8") as f:
    loaded = json.load(f)

print(loaded["retries"])`,
          testCases: [
            { id: 'tc-1', label: 'Prints 3', setup: '', expected: '3', hidden: false },
          ],
          hints: [
            'Use json.dump(prefs, f, indent=2).',
            'Then open in "r" mode and call json.load(f).',
            'print(loaded["retries"]).',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day19-sub7',
      number: 7,
      title: 'CSV Processing (csv.reader, csv.DictReader, csv.writer, newline="")',
      summary: 'Read and write tabular CSV data cleanly using Python’s csv module without naive .split(",") bugs.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Why csv.DictReader Beats line.split(",")',
        paragraphs: [
          'Splitting CSV lines with `line.split(",")` breaks immediately when a field contains a quoted comma like `"Lagos, Nigeria"`. Python’s **`csv`** module handles RFC 4180 quoting, escaping, and headers automatically.',
          '**`csv.DictReader(f)`** uses the first row as dictionary keys, yielding one `dict` per row (e.g., `{"name": "Ada", "score": "95"}`). Remember that **every value from `csv.reader` and `csv.DictReader` is a `str`**—cast numbers explicitly with `int()` or `float()`.',
          'When opening a CSV file for reading or writing with `csv`, **always pass `newline=""`** to `open(..., newline="", encoding="utf-8")`. Without `newline=""`, Windows writes extra blank rows between every record!',
        ],
        keyTerms: [
          {
            term: 'csv.DictReader',
            definition: 'CSV reader that maps each row to a dict keyed by the header column names.',
          },
          {
            term: 'newline=""',
            definition: 'Required open() argument for the csv module so it manages line endings itself.',
          },
        ],
        bulletPoints: [
          'Always pass `newline=""` to `open()` when using `csv.reader` or `csv.writer`.',
          'Cast numeric CSV columns explicitly—`row["age"]` is always a `str`.',
        ],
      },
      visualise: {
        type: 'structured-io-sim',
        title: 'CSV DictReader & newline="" Inspector',
        badge: 'simulation',
        description: 'Inspect how csv.DictReader maps headers and handles quoted commas.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Writing and Reading CSV with csv.writer and csv.DictReader',
          runMode: 'real',
          code: `import csv

path = "/tmp/d19_users.csv"
with open(path, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "city", "score"])
    writer.writerow(["Ada", "Lagos, NG", 95])

with open(path, "r", newline="", encoding="utf-8") as f:
    rows = list(csv.DictReader(f))

print("Count:", len(rows), "| City:", rows[0]["city"], "| Score:", int(rows[0]["score"]))`,
          expectedOutput: `Count: 1 | City: Lagos, NG | Score: 95`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'open(path, "w", newline="", encoding="utf-8")',
          internalEffect: 'Opens CSV with newline="" so csv.writer controls \\r\\n / \\n cleanly.',
        },
        {
          step: 2,
          codeLine: 10,
          instruction: 'rows = list(csv.DictReader(f))',
          internalEffect: 'Reads header ["name", "city", "score"] and yields dict rows with "Lagos, NG" intact.',
        },
      ],
      apply: {
        domain: 'Data Analytics',
        contextTitle: 'Summing Numeric CSV Column Values',
        scenario: 'Stream a CSV file with DictReader and sum the "amount" column.',
        code: `import csv, io
csv_data = io.StringIO("id,amount\\n1,250\\n2,150\\n")
total = sum(int(row["amount"]) for row in csv.DictReader(csv_data))
print("Total:", total)`,
        outcome: 'Total: 400',
      },
      commonMistakes: [
        {
          label: 'Treating CSV DictReader Values as Integers Without Casting',
          erroneousCode: `# row = {"score": "95"}
# bonus = row["score"] + 5  # TypeError: can only concatenate str to str!`,
          errorMessage: 'TypeError: can only concatenate str (not "int") to str',
          explanation: 'CSV files store text; csv.DictReader always yields string values until you call int() or float().',
          correctedCode: `bonus = int("95") + 5  # 100`,
        },
      ],
      sourceNotes: 'Covers csv.reader, csv.DictReader, csv.writer, and newline="".',
      practise: [
        {
          id: 'd19-s7-ex1',
          title: 'Theory: Why csv Needs newline=""',
          type: 'theory-reasoning',
          tier: 'standard',
          points: 15,
          contextScenario: 'Billing Export Blank-Row Bug',
          prompt: 'Why should you always pass `newline=""` to `open()` when using `csv.writer` or `csv.reader`?',
          options: [
            { id: 'opt-1', text: 'So Python does not double-translate line endings, letting the csv module handle \\r\\n / \\n cleanly without extra blank rows.', explanation: 'Correct!', isCorrect: true },
            { id: 'opt-2', text: 'Because newline="" strips all commas from fields.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'Because csv.DictReader raises TypeError without it.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'To convert string numbers into integers automatically.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'What happens on Windows if open() translates \\n to \\r\\n on top of csv.writer?',
            'Extra blank rows appear between records.',
            'newline="" disables universal newline translation so csv manages it.',
          ],
        },
        {
          id: 'd19-s7-ex2',
          title: 'Fix the Bug: CSV Numeric Casting',
          type: 'fix-the-bug',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Payroll Sum TypeError',
          prompt: 'Fix the bug so `total` sums the `"salary"` column from `csv.DictReader` as integers (`300`).',
          starterCode: `import csv, io
raw = io.StringIO("emp,salary\\nAda,120\\nTunde,180\\n")
total = sum(row["salary"] for row in csv.DictReader(raw))
print(total)`,
          solutionCode: `import csv, io
raw = io.StringIO("emp,salary\\nAda,120\\nTunde,180\\n")
total = sum(int(row["salary"]) for row in csv.DictReader(raw))
print(total)`,
          testCases: [
            { id: 'tc-1', label: 'Prints 300', setup: '', expected: '300', hidden: false },
          ],
          hints: [
            'csv.DictReader yields string values for every cell.',
            'Wrap row["salary"] in int(...).',
            'Prints 300.',
          ],
        },
        {
          id: 'd19-s7-ex3',
          title: 'Write Code: Quoted-Comma CSV Aggregator',
          type: 'write-code',
          tier: 'project',
          points: 25,
          contextScenario: 'Regional Revenue Report',
          prompt: 'Use `csv.DictReader` on `raw` (which contains quoted commas like `"Lagos, NG"`) and print the total `"rev"` as an integer (`800`).',
          starterCode: `import csv, io
raw = io.StringIO('city,rev\\n"Lagos, NG",500\\n"Accra, GH",300\\n')
# Parse with csv.DictReader and print integer sum of "rev"
`,
          solutionCode: `import csv, io
raw = io.StringIO('city,rev\\n"Lagos, NG",500\\n"Accra, GH",300\\n')
total = sum(int(row["rev"]) for row in csv.DictReader(raw))
print(total)`,
          testCases: [
            { id: 'tc-1', label: 'Prints 800', setup: '', expected: '800', hidden: false },
          ],
          hints: [
            'csv.DictReader(raw) handles quoted commas automatically.',
            'Sum int(row["rev"]) across all rows.',
            'Prints 800.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day19-sub8',
      number: 8,
      title: 'Modern Path Handling with pathlib.Path',
      summary: 'Build cross-platform file paths with the / operator and perform concise I/O with read_text() and write_text().',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Object-Oriented Filesystem Paths',
        paragraphs: [
          'Instead of concatenating path strings with `"/"` or `"\\\\"`, Python 3’s **`pathlib.Path`** models filesystem paths as clean, cross-platform objects. You join segments using the **`/`** operator: `Path("/tmp") / "exports" / "data.json"`.',
          '`Path` objects expose expressive metadata properties: `.name` (filename with extension), `.stem` (filename without extension), `.suffix` (`.json`), `.parent` (parent directory), and `.exists()` / `.is_file()` / `.mkdir(parents=True, exist_ok=True)`.',
          'For quick small-file reads and writes, `Path` even provides one-liners: `p.write_text("hello", encoding="utf-8")` and `p.read_text(encoding="utf-8")`.',
        ],
        keyTerms: [
          {
            term: 'pathlib.Path',
            definition: 'Standard-library class representing filesystem paths with / joining and built-in read_text/write_text.',
          },
        ],
        bulletPoints: [
          'Use `p.mkdir(parents=True, exist_ok=True)` to create nested directories safely without `FileExistsError`.',
          'Prefer `Path` over `os.path.join()` in modern Python 3 codebases.',
        ],
      },
      visualise: {
        type: 'structured-io-sim',
        title: 'pathlib.Path Properties & One-Line I/O',
        badge: 'simulation',
        description: 'Inspect Path joining (/), .name, .stem, .suffix, and .read_text()/.write_text().',
        initialConfig: {},
      },
      code: [
        {
          title: 'Joining, Inspecting, and Writing with pathlib.Path',
          runMode: 'real',
          code: `from pathlib import Path

p = Path("/tmp") / "d19_report.csv"
p.write_text("col1,col2\\n1,2\\n", encoding="utf-8")

print("Exists:", p.exists(), "| Name:", p.name, "| Stem:", p.stem, "| Suffix:", p.suffix)
print("Lines:", len(p.read_text(encoding="utf-8").splitlines()))`,
          expectedOutput: `Exists: True | Name: d19_report.csv | Stem: d19_report | Suffix: .csv
Lines: 2`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'p = Path("/tmp") / "d19_report.csv"',
          internalEffect: 'Overloads / to join path components using the OS separator.',
        },
        {
          step: 2,
          codeLine: 4,
          instruction: 'p.write_text(..., encoding="utf-8")',
          internalEffect: 'Opens, writes, and closes the file in one atomic call.',
        },
      ],
      apply: {
        domain: 'Artifact Management',
        contextTitle: 'Deriving Output Filenames from Input Paths',
        scenario: 'Given an input CSV path, derive a sibling JSON path using .with_suffix(".json").',
        code: `from pathlib import Path

src = Path("/data/sales_2026.csv")
out = src.with_suffix(".json")
print(out.as_posix())`,
        outcome: '/data/sales_2026.json',
      },
      commonMistakes: [
        {
          label: 'Calling mkdir() Without exist_ok=True',
          erroneousCode: `from pathlib import Path
Path("/tmp").mkdir()  # FileExistsError!`,
          errorMessage: 'FileExistsError: [Errno 17] File exists',
          explanation: 'By default, mkdir() raises FileExistsError if the directory already exists.',
          correctedCode: `Path("/tmp").mkdir(parents=True, exist_ok=True)`,
        },
      ],
      sourceNotes: 'Covers pathlib.Path for Day 19.',
      practise: [
        {
          id: 'd19-s8-ex1',
          title: 'Predict Output: pathlib.Path Properties',
          type: 'predict-output',
          tier: 'standard',
          points: 15,
          contextScenario: 'Artifact Path Anatomy',
          prompt: 'What does this code print?\n```python\nfrom pathlib import Path\np = Path("/var/log/app.log")\nprint(p.name, p.stem, p.suffix, p.with_suffix(".bak").name)\n```',
          options: [
            { id: 'opt-1', text: 'app.log app .log app.bak', explanation: 'Correct! .name is full filename, .stem is without suffix, .suffix includes the dot.', isCorrect: true },
            { id: 'opt-2', text: 'app.log app log app.bak', explanation: 'Incorrect. .suffix includes the leading dot (.log).', isCorrect: false },
            { id: 'opt-3', text: '/var/log/app.log app .log app.bak', explanation: 'Incorrect. .name omits the parent directory.', isCorrect: false },
            { id: 'opt-4', text: 'app.log app.log .log app.log.bak', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Does .suffix include the leading dot?',
            'Does .with_suffix(".bak") replace .log?',
            'app.log app .log app.bak.',
          ],
        },
        {
          id: 'd19-s8-ex2',
          title: 'Order the Lines: Safe Directory & Text Export',
          type: 'order-the-lines',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Artifact Directory Writer',
          prompt: 'Arrange the lines to create `/tmp/d19_ex_dir` safely, write `"ok"` to `note.txt`, and print its contents.',
          jumbledLines: [
            { id: 'l4', code: 'target = out_dir / "note.txt"', indent: 0 },
            { id: 'l1', code: 'from pathlib import Path', indent: 0 },
            { id: 'l6', code: 'print(target.read_text(encoding="utf-8"))', indent: 0 },
            { id: 'l3', code: 'out_dir.mkdir(parents=True, exist_ok=True)', indent: 0 },
            { id: 'l2', code: 'out_dir = Path("/tmp") / "d19_ex_dir"', indent: 0 },
            { id: 'l5', code: 'target.write_text("ok", encoding="utf-8")', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'],
          hints: [
            'Import Path and construct out_dir first.',
            'Call mkdir(parents=True, exist_ok=True) before writing.',
            'Write with write_text() and read back with read_text().',
          ],
        },
        {
          id: 'd19-s8-ex3',
          title: 'Write Code: Path-Based Config Roundtrip',
          type: 'write-code',
          tier: 'project',
          points: 25,
          contextScenario: 'Path-Based Note Roundtrip',
          prompt: 'Create `p = Path("/tmp/d19_ex_path.txt")`, write `"alpha\\nbeta\\n"` using `write_text(..., encoding="utf-8")`, and print `p.stem` and the line count (`2`).',
          starterCode: `from pathlib import Path

p = Path("/tmp/d19_ex_path.txt")
# Write "alpha\\nbeta\\n", then print p.stem and line count
`,
          solutionCode: `from pathlib import Path

p = Path("/tmp/d19_ex_path.txt")
p.write_text("alpha\\nbeta\\n", encoding="utf-8")
lines = p.read_text(encoding="utf-8").splitlines()
print(p.stem, len(lines))`,
          testCases: [
            { id: 'tc-1', label: 'Prints d19_ex_path 2', setup: '', expected: 'd19_ex_path 2', hidden: false },
          ],
          hints: [
            'Call p.write_text("alpha\\nbeta\\n", encoding="utf-8").',
            'Read back with p.read_text(encoding="utf-8").splitlines().',
            'print(p.stem, len(lines)).',
          ],
        },
      ],
      assess: [],
    },
  ],
  realWorldLabs: [
    {
      id: 'day19-lab1',
      title: 'E-Commerce CSV Order Aggregator & JSON Summary Exporter',
      description: 'Read regional order rows with csv.DictReader (including quoted city names), aggregate revenue by region, and export a pretty-printed JSON summary file.',
      domain: 'Retail Analytics',
      starterCode: `import csv, io, json

csv_text = """order_id,city,amount
101,"Lagos, NG",450
102,"Accra, GH",300
103,"Lagos, NG",250
"""

totals = {}
for row in csv.DictReader(io.StringIO(csv_text)):
    city = row["city"]
    totals[city] = totals.get(city, 0) + int(row["amount"])

with open("/tmp/d19_lab1_summary.json", "w", encoding="utf-8") as f:
    json.dump(totals, f, indent=2)

with open("/tmp/d19_lab1_summary.json", "r", encoding="utf-8") as f:
    loaded = json.load(f)

print("Summary:", loaded)`,
      targetOutput: `Summary: {'Lagos, NG': 700, 'Accra, GH': 300}`,
    },
    {
      id: 'day19-lab2',
      title: 'Application Log Rotator & Cursor-Safe Inspector',
      description: 'Use pathlib.Path to write initial logs, append new events in "a" mode, rewind with seek(0) after measuring tell(), and extract ERROR lines.',
      domain: 'Platform Observability',
      starterCode: `from pathlib import Path

log_path = Path("/tmp/d19_lab2_app.log")
log_path.write_text("INFO boot\\nERROR db_timeout\\n", encoding="utf-8")

with open(log_path, "a", encoding="utf-8") as f:
    f.write("ERROR auth_fail\\n")

with open(log_path, "r", encoding="utf-8") as f:
    full = f.read()
    size = f.tell()
    f.seek(0)
    errors = [line.strip() for line in f if line.startswith("ERROR")]

print("Bytes:", size, "| Errors:", len(errors))`,
      targetOutput: `Bytes: 48 | Errors: 2`,
    },
  ],
  miniProject: {
    id: 'day19-project',
    title: 'CSV-to-JSON Pipeline & Log Archiver',
    brief: 'Build a file-processing utility that reads a CSV dataset with csv.DictReader, validates and aggregates numeric fields, writes a formatted JSON report via pathlib.Path, and appends an audit entry to a log file.',
    requirements: [
      'Use `with open(..., encoding="utf-8")` for all text file operations',
      'Pass `newline=""` when reading or writing CSV files with the `csv` module',
      'Cast CSV string values explicitly before arithmetic aggregation',
      'Export structured results with `json.dump(..., indent=2, ensure_ascii=False)`',
      'Use `pathlib.Path` for path construction and `"a"` mode for append-only audit logs',
    ],
    rubric: [
      { criterion: 'Safe context-managed file I/O with UTF-8 encoding and newline=""', weight: 40 },
      { criterion: 'Accurate CSV parsing and type-safe JSON serialization', weight: 35 },
      { criterion: 'Clean pathlib.Path usage and non-destructive append logging', weight: 25 },
    ],
    starterCode: `# CSV-to-JSON Pipeline & Log Archiver
import csv
import json
from pathlib import Path

def export_sales_summary(csv_path: Path, json_path: Path, log_path: Path) -> dict:
    # Read csv_path with DictReader, aggregate totals, write json_path, append to log_path
    pass
`,
  },
  dayQuiz: {
    title: 'Day 19 Mastery Checkpoint Quiz: File Handling',
    passingScorePercentage: 80,
    questions: [
      {
        id: 'd19-q1',
        scenario: 'Open Modes',
        question: 'Which `open()` mode creates a new file and raises `FileExistsError` if the file already exists?',
        options: [
          { id: 'q1-a', text: '"x" (exclusive creation)', explanation: 'Correct!', isCorrect: true },
          { id: 'q1-b', text: '"w" (write)', explanation: 'Incorrect. "w" overwrites/truncates existing files.', isCorrect: false },
          { id: 'q1-c', text: '"a" (append)', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q1-d', text: '"r+" (read/write)', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd19-q2',
        scenario: 'Binary Mode',
        question: 'What happens if you call `open("img.png", "rb", encoding="utf-8")`?',
        options: [
          { id: 'q2-a', text: 'Python raises ValueError because binary mode does not accept encoding=.', explanation: 'Correct!', isCorrect: true },
          { id: 'q2-b', text: 'Python decodes the PNG into a UTF-8 string.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q2-c', text: 'It silently ignores encoding="utf-8".', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q2-d', text: 'It raises FileNotFoundError.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd19-q3',
        scenario: 'Context Manager',
        question: 'What is the primary guarantee of `with open("data.txt", encoding="utf-8") as f:`?',
        options: [
          { id: 'q3-a', text: 'The file is automatically flushed and closed when exiting the block, even if an exception occurs.', explanation: 'Correct!', isCorrect: true },
          { id: 'q3-b', text: 'It prevents FileNotFoundError from ever being raised.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q3-c', text: 'It loads the file twice as fast.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q3-d', text: 'It keeps f open after the block ends.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd19-q4',
        scenario: 'Memory-Safe Reading',
        question: 'Which pattern reads a multi-gigabyte text file with constant (line-by-line) memory usage?',
        options: [
          { id: 'q4-a', text: 'for line in f:', explanation: 'Correct!', isCorrect: true },
          { id: 'q4-b', text: 'f.readlines()', explanation: 'Incorrect. Loads all lines into a list in RAM.', isCorrect: false },
          { id: 'q4-c', text: 'f.read().split("\\n")', explanation: 'Incorrect. Loads entire file into RAM.', isCorrect: false },
          { id: 'q4-d', text: 'list(f)', explanation: 'Incorrect. Materializes all lines in RAM.', isCorrect: false },
        ],
      },
      {
        id: 'd19-q5',
        scenario: 'Writing Lines',
        question: 'What does `f.writelines(["one", "two"])` write to the file?',
        options: [
          { id: 'q5-a', text: '"onetwo" (no newlines are added automatically).', explanation: 'Correct!', isCorrect: true },
          { id: 'q5-b', text: '"one\\ntwo\\n"', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q5-c', text: '"one,two"', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q5-d', text: 'Raises TypeError.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd19-q6',
        scenario: 'Cursor & EOF',
        question: 'If `f.read()` has just read the entire file, what does calling `f.read()` a second time return?',
        options: [
          { id: 'q6-a', text: 'An empty string "" unless you call f.seek(0) first.', explanation: 'Correct!', isCorrect: true },
          { id: 'q6-b', text: 'The full file contents again.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q6-c', text: 'None.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q6-d', text: 'Raises EOFError.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd19-q7',
        scenario: 'JSON API',
        question: 'Which `json` function parses a JSON **string** into a Python dict/list?',
        options: [
          { id: 'q7-a', text: 'json.loads()', explanation: 'Correct! "s" stands for string.', isCorrect: true },
          { id: 'q7-b', text: 'json.load()', explanation: 'Incorrect. load() reads from a file object.', isCorrect: false },
          { id: 'q7-c', text: 'json.dumps()', explanation: 'Incorrect. dumps() serializes to a JSON string.', isCorrect: false },
          { id: 'q7-d', text: 'json.dump()', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd19-q8',
        scenario: 'CSV Processing',
        question: 'What Python type are all field values returned by `csv.DictReader`?',
        options: [
          { id: 'q8-a', text: 'str (numbers must be cast with int() or float()).', explanation: 'Correct!', isCorrect: true },
          { id: 'q8-b', text: 'Auto-detected int, float, or str.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q8-c', text: 'bytes.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q8-d', text: 'tuple.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd19-q9',
        scenario: 'CSV Newlines',
        question: 'Which `open()` keyword argument is recommended whenever opening a CSV file for `csv.reader` or `csv.writer`?',
        options: [
          { id: 'q9-a', text: 'newline=""', explanation: 'Correct!', isCorrect: true },
          { id: 'q9-b', text: 'buffering=0', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q9-c', text: 'errors="ignore"', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q9-d', text: 'closefd=False', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd19-q10',
        scenario: 'pathlib.Path',
        question: 'How do you create a directory and any missing parents with `pathlib.Path` without failing if it already exists?',
        options: [
          { id: 'q10-a', text: 'p.mkdir(parents=True, exist_ok=True)', explanation: 'Correct!', isCorrect: true },
          { id: 'q10-b', text: 'p.mkdir()', explanation: 'Incorrect. Raises FileExistsError if it exists.', isCorrect: false },
          { id: 'q10-c', text: 'p.touch(exist_ok=True)', explanation: 'Incorrect. touch() creates a file, not a directory.', isCorrect: false },
          { id: 'q10-d', text: 'p.makedirs()', explanation: 'Incorrect. makedirs() is in os, not Path.', isCorrect: false },
        ],
      },
    ],
  },
  cheatSheet: [
    {
      category: 'File Open Modes (r, w, a, x, b) & encoding="utf-8"',
      syntax: 'open(path, mode="r", encoding="utf-8")',
      description: '"r" reads (error if missing); "w" truncates immediately; "a" appends at EOF; "x" fails with FileExistsError if present; "rb"/"wb" read/write raw bytes without encoding=.',
      example: `with open("/tmp/notes.txt", "a", encoding="utf-8") as f:
    f.write("Total: ₦4,500\\n")`,
    },
    {
      category: 'Context Managers (with open(...) as f:)',
      syntax: 'with open(path, "r", encoding="utf-8") as f:',
      description: 'Automatically flushes buffers and closes the file handle upon exiting the block, even if an exception occurs mid-block.',
      example: `with open("/tmp/in.txt", encoding="utf-8") as src, open("/tmp/out.txt", "w", encoding="utf-8") as dst:
    dst.write(src.read().upper())`,
    },
    {
      category: 'Reading Files (read, readline, readlines, Lazy Iteration)',
      syntax: 'for line in f:  # memory-safe streaming',
      description: 'read() loads the whole file; readline() reads one line; readlines() returns a list; for line in f: streams one line at a time in constant memory.',
      example: `with open("/tmp/app.log", "r", encoding="utf-8") as f:
    errors = [line.rstrip("\\n") for line in f if "ERROR" in line]`,
    },
    {
      category: 'Writing & Appending (write, writelines)',
      syntax: 'f.write(text) / f.writelines(lines)',
      description: 'Neither write() nor writelines() adds newlines automatically. Include "\\n" explicitly and use "a" mode when preserving existing content.',
      example: `lines = ["alpha", "beta"]
with open("/tmp/out.txt", "w", encoding="utf-8") as f:
    f.write("\\n".join(lines) + "\\n")`,
    },
    {
      category: 'File Cursor Mechanics (tell, seek(0), EOF)',
      syntax: 'pos = f.tell(); f.seek(0)',
      description: 'tell() returns the current stream offset. Once read() hits EOF, subsequent read() calls return "" until seek(0) rewinds the cursor.',
      example: `with open("/tmp/data.txt", "r", encoding="utf-8") as f:
    total_lines = sum(1 for _ in f)
    f.seek(0)
    header = f.readline().strip()`,
    },
    {
      category: 'JSON Serialization (load, dump, loads, dumps)',
      syntax: 'json.dump(obj, f, indent=2) / json.load(f)',
      description: 'load/dump operate on file objects; loads/dumps operate on JSON strings. Invalid JSON raises json.JSONDecodeError.',
      example: `import json
with open("/tmp/cfg.json", "w", encoding="utf-8") as f:
    json.dump({"port": 8080, "ok": True}, f, indent=2, ensure_ascii=False)`,
    },
    {
      category: 'CSV Processing (DictReader, writer, newline="")',
      syntax: 'open(path, "r", newline="", encoding="utf-8")',
      description: 'Always pass newline="" to open() with the csv module. csv.DictReader maps headers to dict keys and returns all values as strings.',
      example: `import csv
with open("/tmp/sales.csv", "r", newline="", encoding="utf-8") as f:
    total = sum(int(row["amount"]) for row in csv.DictReader(f))`,
    },
    {
      category: 'Modern Paths with pathlib.Path',
      syntax: 'p = Path("/tmp") / "reports" / "q1.json"',
      description: 'Join paths cross-platform with /, inspect .name/.stem/.suffix, create dirs with mkdir(parents=True, exist_ok=True), and use read_text()/write_text().',
      example: `from pathlib import Path
p = Path("/tmp") / "exports" / "summary.txt"
p.parent.mkdir(parents=True, exist_ok=True)
p.write_text("ready\\n", encoding="utf-8")`,
    },
  ],
  sourceNotes: [
    'Curriculum reference: https://github.com/Asabeneh/30-Days-Of-Python/tree/master/19_Day_File_handling',
  ],
};
