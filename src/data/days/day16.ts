/**
 * Day 16: Date and Time (Intermediate Python)
 * Part A (Learn) conforming to Sections 10, 13.2, and 14 of the Master Specification.
 * Includes:
 *  - 7 Detailed Subtopics following the 10-step pedagogical structure
 *  - 3 Signature Simulations: datetime-parts-sim, strftime-strptime-sim, timezone-timedelta-sim
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_16_MODULE: DayModule = {
  schemaVersion: 1,
  number: 16,
  title: 'Date and Time',
  level: 'intermediate',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/16_Day_Python_date_time',
  estimatedMinutes: 60,
  prerequisites: [12],
  objectives: [
    'Construct and inspect immutable datetime, date, and time objects from Python’s datetime module',
    'Retrieve current timestamps safely using datetime.now(timezone.utc) without deprecated utcnow()',
    'Format temporal objects into human-readable or ISO 8601 strings with strftime()',
    'Parse external date strings into structured datetime objects with strptime() and fromisoformat()',
    'Perform calendar and duration arithmetic using timedelta and difference subtraction',
    'Distinguish naive vs timezone-aware datetimes and convert cleanly between UTC and WAT (UTC+1)',
    'Convert between Unix epoch timestamps and datetime objects following UTC-first storage practices',
  ],
  subtopics: [
    {
      id: 'day16-sub1',
      number: 1,
      title: 'datetime, date & time Objects',
      summary: 'Model calendar dates, wall-clock times, and combined timestamps as immutable Python objects.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Three Specialized Types in the datetime Module',
        paragraphs: [
          'Python’s standard-library `datetime` module separates temporal data into three immutable value classes: `date(year, month, day)` for calendar dates, `time(hour, minute, second, microsecond)` for wall-clock times, and `datetime(year, month, day, hour, minute, second)` for a combined point on the timeline.',
          'Because `date`, `time`, and `datetime` objects are **immutable** (just like tuples or strings), you never mutate `.year` or `.hour` in place. Instead, you call `.replace(hour=9)` to produce a new object, and you can use them as dictionary keys or set members.',
          'A `datetime` instance also exposes `.date()` and `.time()` extractor methods, or `datetime.combine(d, t)` to assemble a full timestamp from separate `date` and `time` parts.',
        ],
        keyTerms: [
          {
            term: 'datetime.date',
            definition: 'An immutable Gregorian calendar date storing year, month (1–12), and day (1–31).',
          },
          {
            term: 'datetime.time',
            definition: 'An immutable time of day storing hour (0–23), minute, second, microsecond, and optional tzinfo.',
          },
          {
            term: 'datetime.datetime',
            definition: 'An immutable combination of date and time attributes representing a single timestamp.',
          },
        ],
        bulletPoints: [
          'Always distinguish the module `import datetime` from the class `from datetime import datetime`.',
          'Use `.replace(...)` to derive a modified copy without mutating the original timestamp.',
        ],
      },
      visualise: {
        type: 'datetime-parts-sim',
        title: 'Datetime Anatomy & Attribute Inspector',
        badge: 'simulation',
        description: 'Inspect how year, month, day, hour, minute, second, microsecond, and tzinfo compose a datetime object.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Creating, Inspecting, and Combining date, time, and datetime',
          runMode: 'real',
          code: `from datetime import date, time, datetime

launch_date = date(2026, 11, 10)
standup_time = time(9, 30, 0)
combined = datetime.combine(launch_date, standup_time)
shifted = combined.replace(hour=14)

print("Date:", launch_date, "| Weekday (0=Mon):", launch_date.weekday())
print("Time:", standup_time)
print("Combined:", combined)
print("Shifted:", shifted)`,
          expectedOutput: `Date: 2026-11-10 | Weekday (0=Mon): 1
Time: 09:30:00
Combined: 2026-11-10 09:30:00
Shifted: 2026-11-10 14:30:00`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'launch_date = date(2026, 11, 10)',
          internalEffect: 'Validates calendar bounds (e.g., rejects month=13 or Feb 30 with ValueError) and constructs an immutable date.',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: 'combined = datetime.combine(launch_date, standup_time)',
          internalEffect: 'Merges date and time fields into a single naive datetime object.',
        },
        {
          step: 3,
          codeLine: 6,
          instruction: 'shifted = combined.replace(hour=14)',
          internalEffect: 'Returns a brand-new datetime with hour=14 while leaving combined untouched at 09:30:00.',
        },
      ],
      apply: {
        domain: 'Scheduling',
        contextTitle: 'Building a Recurring Meeting Slot',
        scenario: 'Combine a calendar date from a booking form with a fixed clinic opening time.',
        code: `from datetime import date, time, datetime

booking_day = date(2026, 12, 1)
slot = datetime.combine(booking_day, time(10, 15))
print("Appointment:", slot.isoformat())`,
        outcome: 'Appointment: 2026-12-01T10:15:00',
      },
      commonMistakes: [
        {
          label: 'Confusing Module Name with Class Name',
          erroneousCode: `import datetime
now = datetime.now()  # AttributeError!`,
          errorMessage: "AttributeError: module 'datetime' has no attribute 'now'",
          explanation: 'When you write `import datetime`, `datetime` refers to the module, so the class inside it is `datetime.datetime`.',
          correctedCode: `from datetime import datetime
now = datetime.now()`,
        },
      ],
      sourceNotes: 'Covers datetime, date, and time fundamentals for Day 16.',
      practise: [
        {
          id: 'd16-s1-ex1',
          title: 'Scenario: Immutability of datetime Objects',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Clinic Shift Scheduling',
          prompt: 'A developer writes `shift = datetime(2026, 11, 10, 8, 0)` and then tries `shift.hour = 9` to move the shift forward by one hour. What happens?',
          options: [
            { id: 'opt-1', text: 'AttributeError is raised because datetime objects are immutable; use shift.replace(hour=9).', explanation: 'Correct! date, time, and datetime are immutable value objects.', isCorrect: true },
            { id: 'opt-2', text: 'shift mutates in-place to 09:00.', explanation: 'Incorrect. Temporal objects cannot be mutated in-place.', isCorrect: false },
            { id: 'opt-3', text: 'ValueError is raised.', explanation: 'Incorrect. AttributeError is raised for read-only attributes.', isCorrect: false },
            { id: 'opt-4', text: 'shift becomes None.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Are datetime instances mutable like lists or immutable like tuples?',
            'Which method returns a modified copy of a datetime?',
            'Try .replace(hour=9).',
          ],
        },
        {
          id: 'd16-s1-ex2',
          title: 'Write Code: Combine Date & Time and Shift Hour',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'Airport Gate Assignment',
          prompt: 'Combine `date(2026, 12, 15)` and `time(6, 45)` using `datetime.combine()`, then use `.replace(hour=8)` to create `boarding` and print `boarding.isoformat()`.',
          starterCode: `from datetime import date, time, datetime

flight_day = date(2026, 12, 15)
gate_open = time(6, 45)
# Combine and replace hour to 8
`,
          solutionCode: `from datetime import date, time, datetime

flight_day = date(2026, 12, 15)
gate_open = time(6, 45)
boarding = datetime.combine(flight_day, gate_open).replace(hour=8)
print(boarding.isoformat())`,
          testCases: [
            { id: 'tc-1', label: 'Prints 2026-12-15T08:45:00', setup: '', expected: '2026-12-15T08:45:00', hidden: false },
          ],
          hints: [
            'Call datetime.combine(flight_day, gate_open).',
            'Chain .replace(hour=8) on the combined datetime.',
            'Print boarding.isoformat().',
          ],
        },
        {
          id: 'd16-s1-ex3',
          title: 'Predict Output: Weekday Indexing',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Payroll Calendar Check',
          prompt: 'Given `date(2026, 11, 9)` is a Monday, what does `print(date(2026, 11, 9).weekday(), date(2026, 11, 9).isoweekday())` output?',
          options: [
            { id: 'opt-1', text: '0 1', explanation: 'Correct! .weekday() uses 0=Monday..6=Sunday, while .isoweekday() uses 1=Monday..7=Sunday.', isCorrect: true },
            { id: 'opt-2', text: '1 1', explanation: 'Incorrect. .weekday() is zero-based.', isCorrect: false },
            { id: 'opt-3', text: '0 0', explanation: 'Incorrect. .isoweekday() is 1-based.', isCorrect: false },
            { id: 'opt-4', text: '1 2', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'What index does .weekday() assign to Monday?',
            'What index does .isoweekday() assign to Monday?',
            '0 for weekday(), 1 for isoweekday().',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day16-sub2',
      number: 2,
      title: 'Getting Current Time (now(), today(), utcnow() Deprecation)',
      summary: 'Capture the current local or UTC clock safely and understand why utcnow() is deprecated in Python 3.12+.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Reading the System Clock Safely',
        paragraphs: [
          'To read the current clock in Python, you use `date.today()` for today’s calendar date or `datetime.now()` for the current date and time. Without arguments, `datetime.now()` returns a **naive** local datetime—it has no timezone tag attached (`tzinfo is None`).',
          'In older tutorials you will often see `datetime.utcnow()`. However, `utcnow()` was a notorious source of production bugs because it returned a **naive** datetime whose numbers happened to be UTC, tricking Python into treating it as local time during conversions.',
          'Starting in **Python 3.12**, `datetime.utcnow()` and `datetime.utcfromtimestamp()` are **deprecated**. The modern, bug-free replacement is `datetime.now(timezone.utc)`, which returns a **timezone-aware** UTC datetime.',
        ],
        keyTerms: [
          {
            term: 'datetime.now(timezone.utc)',
            definition: 'The recommended way in Python 3.12+ to obtain an aware UTC timestamp.',
          },
          {
            term: 'date.today()',
            definition: 'Returns the current local calendar date as a date object.',
          },
        ],
        bulletPoints: [
          'Avoid `datetime.utcnow()`—it emits a DeprecationWarning in Python 3.12+ and returns a naive object.',
          'Pass `timezone.utc` to `datetime.now()` whenever recording logs, database events, or API timestamps.',
        ],
      },
      visualise: {
        type: 'datetime-parts-sim',
        title: 'Local Naive vs Aware UTC Clock Inspector',
        badge: 'simulation',
        description: 'Compare naive local timestamps against timezone-aware UTC timestamps.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Modern Current Time Retrieval (Python 3.12+)',
          runMode: 'real',
          code: `from datetime import date, datetime, timezone

today_date = date.today()
utc_now = datetime.now(timezone.utc)

print("Today is:", today_date.isoformat())
print("UTC Year:", utc_now.year, "| tzinfo:", utc_now.tzinfo)
print("Is aware?", utc_now.tzinfo is not None and utc_now.utcoffset() is not None)`,
          expectedOutput: `Today is: 2026-11-10
UTC Year: 2026 | tzinfo: UTC
Is aware? True`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'today_date = date.today()',
          internalEffect: 'Queries the system local clock and constructs a date(year, month, day) instance.',
        },
        {
          step: 2,
          codeLine: 4,
          instruction: 'utc_now = datetime.now(timezone.utc)',
          internalEffect: 'Queries the system clock in UTC and attaches timezone.utc to tzinfo, creating an aware datetime.',
        },
        {
          step: 3,
          codeLine: 8,
          instruction: 'utc_now.tzinfo is not None and utc_now.utcoffset() is not None',
          internalEffect: 'Verifies Python’s official criterion for a timezone-aware datetime object.',
        },
      ],
      apply: {
        domain: 'Backend APIs',
        contextTitle: 'Stamping Audit Log Events',
        scenario: 'Attach a canonical UTC timestamp to every server audit record.',
        code: `from datetime import datetime, timezone

def make_audit_entry(actor, action):
    ts = datetime.now(timezone.utc).replace(microsecond=0)
    return f"[{ts.isoformat()}] {actor}: {action}"

entry = make_audit_entry("ada", "DEPLOY")
print("Has +00:00 suffix:", entry.endswith("ada: DEPLOY") and "+00:00" in entry)`,
        outcome: 'Has +00:00 suffix: True',
      },
      commonMistakes: [
        {
          label: 'Using Deprecated datetime.utcnow() in New Code',
          erroneousCode: `from datetime import datetime
ts = datetime.utcnow()  # Naive + deprecated in 3.12!`,
          errorMessage: 'DeprecationWarning: datetime.datetime.utcnow() is deprecated',
          explanation: 'utcnow() produces a naive object without tzinfo, causing TypeError when compared to aware datetimes.',
          correctedCode: `from datetime import datetime, timezone
ts = datetime.now(timezone.utc)`,
        },
      ],
      sourceNotes: 'Covers current-time retrieval and Python 3.12 utcnow() deprecation.',
      practise: [
        {
          id: 'd16-s2-ex1',
          title: 'Theory: Why datetime.utcnow() Was Deprecated',
          type: 'theory-reasoning',
          tier: 'standard',
          points: 15,
          contextScenario: 'Python 3.12 Migration Audit',
          prompt: 'Explain why `datetime.utcnow()` is deprecated in Python 3.12+ and why `datetime.now(timezone.utc)` is safer.',
          modelAnswer: 'datetime.utcnow() returns a naive datetime (tzinfo=None) whose clock numbers are UTC, which causes silent local-timezone bugs or TypeError when mixed with aware datetimes. datetime.now(timezone.utc) returns a timezone-aware UTC datetime with tzinfo set.',
          markingCriteria: [
            { id: 'mc-1', label: 'Identifies that utcnow() returns a naive datetime (tzinfo is None)', points: 8 },
            { id: 'mc-2', label: 'Explains that datetime.now(timezone.utc) returns an aware UTC datetime', points: 7 },
          ],
          hints: [
            'What is .tzinfo on the result of datetime.utcnow()?',
            'What happens if you compare a naive UTC object with an aware one?',
            'datetime.now(timezone.utc) attaches tzinfo=timezone.utc.',
          ],
        },
        {
          id: 'd16-s2-ex2',
          title: 'Fix the Bug: Module vs Class Import',
          type: 'fix-the-bug',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Telemetry Heartbeat Script',
          prompt: 'Fix the import or attribute access so the script prints `"Aware UTC: True"` without raising `AttributeError`.',
          starterCode: `import datetime

now_utc = datetime.now(datetime.timezone.utc)
print("Aware UTC:", now_utc.tzinfo is not None)`,
          solutionCode: `from datetime import datetime, timezone

now_utc = datetime.now(timezone.utc)
print("Aware UTC:", now_utc.tzinfo is not None)`,
          testCases: [
            { id: 'tc-1', label: 'Prints Aware UTC: True', setup: '', expected: 'Aware UTC: True', hidden: false },
          ],
          hints: [
            'import datetime binds the module, not the datetime class.',
            'Either use datetime.datetime.now(...) or from datetime import datetime, timezone.',
            'from datetime import datetime, timezone is cleanest.',
          ],
        },
        {
          id: 'd16-s2-ex3',
          title: 'Fill the Gaps: Aware UTC Timestamp',
          type: 'fill-the-gaps',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Distributed Event Logging',
          prompt: 'Complete the expression to capture an aware UTC timestamp.',
          gaps: [
            { id: 'g-1', beforeText: 'from datetime import datetime, timezone\nstamp = datetime.', afterText: '(timezone.utc)', correctAnswer: 'now', options: ['now', 'today', 'utcnow', 'combine'] },
          ],
          hints: [
            'date.today() takes no timezone.',
            'utcnow() is deprecated and takes no arguments.',
            'Use datetime.now(timezone.utc).',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day16-sub3',
      number: 3,
      title: 'Formatting Dates to Strings with strftime()',
      summary: 'Convert datetime, date, and time objects into custom human-readable or ISO strings using format codes.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'strftime(): String Format Time',
        paragraphs: [
          'The `.strftime(format_string)` method (**str**ing **f**ormat **time**) renders a `date`, `time`, or `datetime` into a formatted string using `%` directives.',
          'Memorize the core directives: `%Y` (4-digit year, e.g., `2026`), `%m` (zero-padded month `01`–`12`), `%d` (zero-padded day `01`–`31`), `%H` (24-hour `00`–`23`), `%I` (12-hour `01`–`12`), `%M` (minute `00`–`59`), `%S` (second `00`–`59`), `%p` (`AM`/`PM`), `%A` (full weekday), and `%B` (full month name).',
          'Notice the common trap: `%m` is **month** whereas `%M` is **minute**, and `%Y` is 4-digit year (`2026`) whereas `%y` is 2-digit year (`26`).',
        ],
        keyTerms: [
          {
            term: 'strftime()',
            definition: 'Method on date/time/datetime that formats temporal fields into a string using % directives.',
          },
          {
            term: 'ISO 8601',
            definition: 'International standard date-time format YYYY-MM-DDTHH:MM:SS, produced directly by .isoformat().',
          },
        ],
        bulletPoints: [
          '`%Y-%m-%d %H:%M:%S` is the classic sortable timestamp format.',
          'Use `.isoformat()` when you need standard ISO 8601 output without writing format codes manually.',
        ],
      },
      visualise: {
        type: 'strftime-strptime-sim',
        title: 'strftime() & strptime() Format Token Workbench',
        badge: 'simulation',
        description: 'Compose format strings token by token and preview live formatted output and parsed tokens.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Formatting a Datetime for Reports, Invoices, and Logs',
          runMode: 'real',
          code: `from datetime import datetime

dt = datetime(2026, 11, 10, 15, 7, 45)

print("ISO 8601:", dt.isoformat())
print("Sortable:", dt.strftime("%Y-%m-%d %H:%M:%S"))
print("Readable:", dt.strftime("%A, %d %B %Y at %I:%M %p"))`,
          expectedOutput: `ISO 8601: 2026-11-10T15:07:45
Sortable: 2026-11-10 15:07:45
Readable: Tuesday, 10 November 2026 at 03:07 PM`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 5,
          instruction: 'dt.isoformat()',
          internalEffect: 'Produces canonical ISO 8601 string with a T separator between date and time.',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 'dt.strftime("%Y-%m-%d %H:%M:%S")',
          internalEffect: 'Substitutes 4-digit year, 2-digit month, 2-digit day, and 24-hour clock fields.',
        },
        {
          step: 3,
          codeLine: 7,
          instruction: 'dt.strftime("%A, %d %B %Y at %I:%M %p")',
          internalEffect: 'Formats full weekday (%A), month name (%B), 12-hour clock (%I), and AM/PM (%p).',
        },
      ],
      apply: {
        domain: 'Reporting',
        contextTitle: 'Generating Dated Export Filenames',
        scenario: 'Create a filesystem-safe CSV filename stamped with the report date and hour.',
        code: `from datetime import datetime

generated_at = datetime(2026, 11, 10, 8, 5)
filename = f"sales_report_{generated_at.strftime('%Y%m%d_%H%M')}.csv"
print(filename)`,
        outcome: 'sales_report_20261110_0805.csv',
      },
      commonMistakes: [
        {
          label: 'Swapping %m (Month) and %M (Minute)',
          erroneousCode: `from datetime import datetime
dt = datetime(2026, 11, 10, 14, 5)
print(dt.strftime("%Y-%M-%d"))  # Prints minute 05 instead of month 11!`,
          errorMessage: 'Silent logic bug: prints 2026-05-10 instead of 2026-11-10',
          explanation: 'In strftime, lowercase %m is month and uppercase %M is minute.',
          correctedCode: `print(dt.strftime("%Y-%m-%d"))  # 2026-11-10`,
        },
      ],
      sourceNotes: 'Covers strftime() formatting directives and ISO 8601 output.',
      practise: [
        {
          id: 'd16-s3-ex1',
          title: 'Predict Output: %m vs %M in strftime()',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Invoice Filename Generator',
          prompt: 'What does `datetime(2026, 3, 15, 9, 42).strftime("%Y-%m-%d_%H%M")` print?',
          options: [
            { id: 'opt-1', text: '2026-03-15_0942', explanation: 'Correct! %m is month (03) and %M is minute (42).', isCorrect: true },
            { id: 'opt-2', text: '2026-42-15_0903', explanation: 'Incorrect. You swapped %m and %M.', isCorrect: false },
            { id: 'opt-3', text: '2026-3-15_942', explanation: 'Incorrect. %m, %d, %H, %M are zero-padded.', isCorrect: false },
            { id: 'opt-4', text: '26-03-15_0942', explanation: 'Incorrect. %Y is 4-digit year.', isCorrect: false },
          ],
          hints: [
            '%m is zero-padded month; %M is zero-padded minute.',
            '%H is 24-hour zero-padded hour.',
            '2026-03-15_0942.',
          ],
        },
        {
          id: 'd16-s3-ex2',
          title: 'Write Code: Custom Shipping Label Timestamp',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'Warehouse Dispatch Labels',
          prompt: 'Format `dt = datetime(2026, 7, 4, 16, 5, 9)` using `.strftime()` to print `04/07/2026 04:05 PM`.',
          starterCode: `from datetime import datetime

dt = datetime(2026, 7, 4, 16, 5, 9)
# Print DD/MM/YYYY HH:MM AM/PM
`,
          solutionCode: `from datetime import datetime

dt = datetime(2026, 7, 4, 16, 5, 9)
print(dt.strftime("%d/%m/%Y %I:%M %p"))`,
          testCases: [
            { id: 'tc-1', label: 'Prints 04/07/2026 04:05 PM', setup: '', expected: '04/07/2026 04:05 PM', hidden: false },
          ],
          hints: [
            'Use %d/%m/%Y for DD/MM/YYYY.',
            'Use %I for 12-hour clock and %p for AM/PM.',
            'dt.strftime("%d/%m/%Y %I:%M %p").',
          ],
        },
        {
          id: 'd16-s3-ex3',
          title: 'Fill the Gaps: ISO 8601 Shortcut',
          type: 'fill-the-gaps',
          tier: 'foundation',
          points: 10,
          contextScenario: 'REST API Serialization',
          prompt: 'Complete the call to serialize `dt` as a standard ISO 8601 string.',
          gaps: [
            { id: 'g-1', beforeText: 'payload_time = dt.', afterText: '()', correctAnswer: 'isoformat', options: ['isoformat', 'strftime', 'strptime', 'to_iso'] },
          ],
          hints: [
            'Which method outputs YYYY-MM-DDTHH:MM:SS with no format string?',
            'It starts with iso...',
            'isoformat().',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day16-sub4',
      number: 4,
      title: 'Parsing Strings to Datetimes with strptime() & fromisoformat()',
      summary: 'Turn raw text dates from CSVs, APIs, and user forms into validated datetime objects.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'strptime(): String Parse Time',
        paragraphs: [
          'The class method `datetime.strptime(date_string, format_string)` (**str**ing **p**arse **time**) is the exact inverse of `strftime()`. You provide the raw text and a format template that matches its structure character-for-character.',
          'If the input string does not match the format template—for example, passing `"10/11/2026"` with `"%Y-%m-%d"`—Python raises a `ValueError`. Every literal character (hyphens, slashes, commas, spaces) in the format string must match the input.',
          'For standard ISO 8601 strings (like `"2026-11-10T14:30:00+01:00"` or `"2026-11-10"`), prefer `datetime.fromisoformat()` or `date.fromisoformat()`—it is faster, cleaner, and handles timezone offsets automatically in Python 3.11+.',
        ],
        keyTerms: [
          {
            term: 'datetime.strptime()',
            definition: 'Class method that parses a date string into a datetime using an explicit % format pattern.',
          },
          {
            term: 'datetime.fromisoformat()',
            definition: 'Fast built-in parser for standard ISO 8601 date and datetime strings.',
          },
        ],
        bulletPoints: [
          '`strptime()` requires an exact structural match—extra characters or wrong separators raise `ValueError`.',
          'Use `fromisoformat()` for JSON/API timestamps instead of hand-writing `%Y-%m-%dT%H:%M:%S` patterns.',
        ],
      },
      visualise: {
        type: 'strftime-strptime-sim',
        title: 'strptime() Pattern Matcher',
        badge: 'simulation',
        description: 'Test format strings against raw date inputs and see how each directive extracts a field.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Parsing Custom Strings with strptime() and ISO Strings with fromisoformat()',
          runMode: 'real',
          code: `from datetime import datetime

raw_log = "10-Nov-2026 14:35"
parsed = datetime.strptime(raw_log, "%d-%b-%Y %H:%M")

iso_text = "2026-11-10T14:35:00+01:00"
iso_dt = datetime.fromisoformat(iso_text)

print("Parsed:", parsed, "| Type:", type(parsed).__name__)
print("ISO:", iso_dt, "| Offset:", iso_dt.utcoffset())`,
          expectedOutput: `Parsed: 2026-11-10 14:35:00 | Type: datetime
ISO: 2026-11-10 14:35:00+01:00 | Offset: 1:00:00`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'parsed = datetime.strptime(raw_log, "%d-%b-%Y %H:%M")',
          internalEffect: 'Matches day (%d=10), abbreviated month (%b=Nov), 4-digit year (%Y=2026), and 24-hour time.',
        },
        {
          step: 2,
          codeLine: 7,
          instruction: 'iso_dt = datetime.fromisoformat(iso_text)',
          internalEffect: 'Parses the ISO 8601 string and automatically creates a fixed-offset timezone(+01:00).',
        },
      ],
      apply: {
        domain: 'Data Ingestion',
        contextTitle: 'Normalizing Mixed CSV Date Formats',
        scenario: 'Parse a US-style invoice date string and convert it to canonical ISO format.',
        code: `from datetime import datetime

csv_date = "11/10/2026"
normalized = datetime.strptime(csv_date, "%m/%d/%Y").date().isoformat()
print("Normalized:", normalized)`,
        outcome: 'Normalized: 2026-11-10',
      },
      commonMistakes: [
        {
          label: 'Mismatched Separators or Directives in strptime()',
          erroneousCode: `from datetime import datetime
datetime.strptime("2026/11/10", "%Y-%m-%d")`,
          errorMessage: "ValueError: time data '2026/11/10' does not match format '%Y-%m-%d'",
          explanation: 'The input uses slashes (/) while the format pattern expects hyphens (-).',
          correctedCode: `datetime.strptime("2026/11/10", "%Y/%m/%d")`,
        },
      ],
      sourceNotes: 'Covers strptime() and fromisoformat() parsing.',
      practise: [
        {
          id: 'd16-s4-ex1',
          title: 'Order the Lines: Parse CSV Date and Reformat',
          type: 'order-the-lines',
          tier: 'standard',
          points: 15,
          contextScenario: 'Banking Statement Importer',
          prompt: 'Order the lines to parse `"15/08/2026"` with `strptime()` and print its ISO date string.',
          jumbledLines: [
            { id: 'l3', code: 'print(parsed.date().isoformat())', indent: 0 },
            { id: 'l1', code: 'from datetime import datetime', indent: 0 },
            { id: 'l2', code: 'parsed = datetime.strptime("15/08/2026", "%d/%m/%Y")', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3'],
          hints: [
            'Import datetime first.',
            'Parse the string into parsed.',
            'Print parsed.date().isoformat().',
          ],
        },
        {
          id: 'd16-s4-ex2',
          title: 'Fix the Bug: Mismatched strptime() Separator',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 15,
          contextScenario: 'Webhook Payload Parser',
          prompt: 'The parser crashes with `ValueError`. Fix the format string in `strptime()` so it prints `2026-11-10 09:30:00`.',
          starterCode: `from datetime import datetime

raw = "2026/11/10 09:30"
dt = datetime.strptime(raw, "%Y-%m-%d %H:%M")
print(dt)`,
          solutionCode: `from datetime import datetime

raw = "2026/11/10 09:30"
dt = datetime.strptime(raw, "%Y/%m/%d %H:%M")
print(dt)`,
          testCases: [
            { id: 'tc-1', label: 'Prints 2026-11-10 09:30:00', setup: '', expected: '2026-11-10 09:30:00', hidden: false },
          ],
          hints: [
            'Look at the separators in raw: "2026/11/10".',
            'The format string currently uses hyphens instead of slashes.',
            'Change "%Y-%m-%d %H:%M" to "%Y/%m/%d %H:%M".',
          ],
        },
        {
          id: 'd16-s4-ex3',
          title: 'Scenario: Parsing ISO 8601 Strings with Offsets',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Microservice Event Consumer',
          prompt: 'You receive JSON timestamps like `"2026-11-10T18:45:00+01:00"`. Which built-in parser handles this directly in Python 3.11+ without writing a format string?',
          options: [
            { id: 'opt-1', text: 'datetime.fromisoformat(ts)', explanation: 'Correct! fromisoformat() parses ISO 8601 strings including timezone offsets.', isCorrect: true },
            { id: 'opt-2', text: 'datetime.strftime(ts)', explanation: 'Incorrect. strftime() formats datetimes into strings, not the reverse.', isCorrect: false },
            { id: 'opt-3', text: 'datetime.today(ts)', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'datetime.combine(ts)', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'What is the inverse of .isoformat()?',
            'It is a class method on datetime starting with from...',
            'datetime.fromisoformat().',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day16-sub5',
      number: 5,
      title: 'Date & Time Arithmetic with timedelta',
      summary: 'Add and subtract durations using timedelta and compute elapsed time between two timestamps.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Measuring Durations vs Points in Time',
        paragraphs: [
          'A `datetime` represents a **point** on the timeline, whereas a `timedelta` represents a **duration** (elapsed time). You can construct a `timedelta` with `days`, `seconds`, `microseconds`, `milliseconds`, `minutes`, `hours`, and `weeks`.',
          'Subtracting two `date` or `datetime` objects (`end - start`) produces a `timedelta`. Adding or subtracting a `timedelta` from a `datetime` (`start + timedelta(days=7)`) shifts the timestamp cleanly across month and year boundaries, including leap years.',
          'Internally, `timedelta` normalizes every duration into three fields: `.days`, `.seconds` (0 to 86399), and `.microseconds`. To get the complete duration as floating-point seconds, always call `.total_seconds()` rather than reading `.seconds` alone.',
        ],
        keyTerms: [
          {
            term: 'timedelta',
            definition: 'An immutable duration object representing the difference between two dates or times.',
          },
          {
            term: 'total_seconds()',
            definition: 'Method returning the entire timedelta duration converted into total seconds as a float.',
          },
        ],
        bulletPoints: [
          '`.seconds` only holds the remainder within a single day (0–86,399); use `.total_seconds()` for full duration.',
          'Note that `timedelta` does not accept `months=` or `years=` because months have variable lengths (28–31 days).',
        ],
      },
      visualise: {
        type: 'timezone-timedelta-sim',
        title: 'Timedelta Arithmetic & Timezone Shift Lab',
        badge: 'simulation',
        description: 'Step through duration arithmetic and see how days, seconds, and total_seconds() behave.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Duration Arithmetic and total_seconds()',
          runMode: 'real',
          code: `from datetime import datetime, timedelta

sprint_start = datetime(2026, 11, 2, 9, 0)
sprint_end = sprint_start + timedelta(weeks=2, hours=3)
elapsed = sprint_end - sprint_start

print("Sprint ends:", sprint_end)
print("Elapsed:", elapsed)
print("elapsed.days:", elapsed.days, "| elapsed.seconds:", elapsed.seconds)
print("Total hours:", elapsed.total_seconds() / 3600)`,
          expectedOutput: `Sprint ends: 2026-11-16 12:00:00
Elapsed: 14 days, 3:00:00
elapsed.days: 14 | elapsed.seconds: 10800
Total hours: 339.0`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'sprint_end = sprint_start + timedelta(weeks=2, hours=3)',
          internalEffect: 'Shifts sprint_start forward by 14 days and 3 hours, returning a new datetime.',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: 'elapsed = sprint_end - sprint_start',
          internalEffect: 'Computes the difference between two datetimes, producing a timedelta(days=14, seconds=10800).',
        },
        {
          step: 3,
          codeLine: 10,
          instruction: 'elapsed.total_seconds() / 3600',
          internalEffect: 'Converts all 14 days + 3 hours into seconds (1,220,400.0) and divides by 3600 to get 339.0 hours.',
        },
      ],
      apply: {
        domain: 'E-Commerce',
        contextTitle: 'Calculating Subscription Renewal & Countdown',
        scenario: 'Determine how many days and hours remain until a trial expires.',
        code: `from datetime import datetime, timedelta

trial_started = datetime(2026, 11, 1, 10, 0)
expires_at = trial_started + timedelta(days=14)
now = datetime(2026, 11, 10, 16, 0)
remaining = expires_at - now
print(f"Remaining: {remaining.days}d {remaining.seconds // 3600}h")`,
        outcome: 'Remaining: 4d 18h',
      },
      commonMistakes: [
        {
          label: 'Reading .seconds Instead of .total_seconds()',
          erroneousCode: `from datetime import timedelta
d = timedelta(days=2)
print(d.seconds)  # Prints 0, NOT 172800!`,
          errorMessage: 'Logic bug: d.seconds is 0 because 2 days are stored in d.days',
          explanation: 'timedelta.seconds only stores the sub-day remainder (0 to 86399). Always use d.total_seconds() for the full duration.',
          correctedCode: `print(int(d.total_seconds()))  # 172800`,
        },
      ],
      sourceNotes: 'Covers timedelta arithmetic and total_seconds().',
      practise: [
        {
          id: 'd16-s5-ex1',
          title: 'Predict Output: timedelta.seconds vs .total_seconds()',
          type: 'predict-output',
          tier: 'challenge',
          points: 20,
          contextScenario: 'SLA Duration Monitoring',
          prompt: 'What does `d = timedelta(days=1, hours=2); print(d.seconds, int(d.total_seconds()))` print?',
          options: [
            { id: 'opt-1', text: '7200 93600', explanation: 'Correct! d.seconds is only the 2-hour sub-day remainder (7200), whereas total_seconds() includes the 1 day (86400 + 7200 = 93600).', isCorrect: true },
            { id: 'opt-2', text: '93600 93600', explanation: 'Incorrect. .seconds excludes .days.', isCorrect: false },
            { id: 'opt-3', text: '2 26', explanation: 'Incorrect. Units are seconds, not hours.', isCorrect: false },
            { id: 'opt-4', text: '86400 93600', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'How many seconds are in 2 hours?',
            'Does .seconds include .days?',
            '7200 for .seconds, 93600 for .total_seconds().',
          ],
        },
        {
          id: 'd16-s5-ex2',
          title: 'Explain the Trace: Leap-Year & Month Rollover with timedelta',
          type: 'explain-the-trace',
          tier: 'standard',
          points: 15,
          contextScenario: 'Billing Cycle Rollover',
          prompt: 'Explain step by step what Python computes when adding `timedelta(days=5)` to `date(2026, 11, 28)`.',
          traceStepCode: `from datetime import date, timedelta
start = date(2026, 11, 28)
due = start + timedelta(days=5)
print(due)`,
          traceQuestion: 'Why does `due` become `2026-12-03` instead of `2026-11-33`?',
          modelAnswer: 'timedelta addition uses Gregorian calendar arithmetic: November has 30 days, so adding 2 days reaches 2026-11-30 and the remaining 3 days roll over into December, yielding date(2026, 12, 3).',
          markingCriteria: [
            { id: 'mc-1', label: 'Notes November has 30 days and date arithmetic rolls over month boundaries', points: 15 },
          ],
          hints: [
            'How many days are in November?',
            '28 + 5 = 33; 33 - 30 = 3.',
            'It rolls over to 2026-12-03.',
          ],
        },
        {
          id: 'd16-s5-ex3',
          title: 'Write Code: Days Until Project Deadline',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'Release Readiness Tracker',
          prompt: 'Compute the number of whole days between `today = date(2026, 11, 10)` and `deadline = date(2026, 12, 1)` and print `"Days left: 21"`.',
          starterCode: `from datetime import date

today = date(2026, 11, 10)
deadline = date(2026, 12, 1)
# Subtract dates and print Days left: <days>
`,
          solutionCode: `from datetime import date

today = date(2026, 11, 10)
deadline = date(2026, 12, 1)
delta = deadline - today
print(f"Days left: {delta.days}")`,
          testCases: [
            { id: 'tc-1', label: 'Prints Days left: 21', setup: '', expected: 'Days left: 21', hidden: false },
          ],
          hints: [
            'Subtract today from deadline to get a timedelta.',
            'Access .days on the timedelta.',
            'Print f"Days left: {delta.days}".',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day16-sub6',
      number: 6,
      title: 'Naive vs Timezone-Aware Datetimes (timezone, UTC, WAT UTC+1)',
      summary: 'Prevent timezone comparison crashes and convert timestamps accurately between UTC and West Africa Time (WAT).',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Why Naive and Aware Datetimes Cannot Mix',
        paragraphs: [
          'Python classifies every `datetime` as either **naive** (`tzinfo is None`, no knowledge of its geographic offset) or **aware** (`tzinfo` is set to a `timezone` or `ZoneInfo` object).',
          'Trying to subtract or compare a naive datetime with an aware datetime raises `TypeError: can\'t compare offset-naive and offset-aware datetimes`. Python refuses to guess what timezone a naive timestamp belongs to.',
          'Using `timezone(timedelta(hours=1), name="WAT")`, we can model **West Africa Time (WAT, UTC+1)**—used in Lagos, Abuja, and across West/Central Africa—and convert any UTC timestamp with `.astimezone(wat)`. Notice that `.astimezone()` shifts the clock **and** preserves the exact same instant in time (`utc_dt == wat_dt` is `True`!).',
        ],
        keyTerms: [
          {
            term: 'Aware Datetime',
            definition: 'A datetime with non-None tzinfo and utcoffset(), unambiguously tied to a point in universal time.',
          },
          {
            term: 'astimezone()',
            definition: 'Method that converts an aware datetime to another timezone while representing the exact same instant.',
          },
          {
            term: 'WAT (UTC+1)',
            definition: 'West Africa Time, a fixed UTC+01:00 offset used year-round without daylight saving changes.',
          },
        ],
        bulletPoints: [
          'Use `.replace(tzinfo=...)` only to attach a timezone to a naive datetime; use `.astimezone(...)` to convert an aware datetime.',
          'Two aware datetimes in different timezones representing the same instant compare equal (`utc_dt == wat_dt` is `True`).',
        ],
      },
      visualise: {
        type: 'timezone-timedelta-sim',
        title: 'UTC to WAT (UTC+1) Timezone Converter',
        badge: 'simulation',
        description: 'Convert instants across UTC, WAT (+01:00), and other offsets while observing instant equality.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Converting Between UTC and WAT (UTC+1)',
          runMode: 'real',
          code: `from datetime import datetime, timezone, timedelta

WAT = timezone(timedelta(hours=1), name="WAT")
utc_kickoff = datetime(2026, 11, 10, 18, 30, tzinfo=timezone.utc)
wat_kickoff = utc_kickoff.astimezone(WAT)

print("UTC:", utc_kickoff.isoformat())
print("WAT:", wat_kickoff.isoformat())
print("Same instant?", utc_kickoff == wat_kickoff)
print("Difference:", wat_kickoff - utc_kickoff)`,
          expectedOutput: `UTC: 2026-11-10T18:30:00+00:00
WAT: 2026-11-10T19:30:00+01:00
Same instant? True
Difference: 0:00:00`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'WAT = timezone(timedelta(hours=1), name="WAT")',
          internalEffect: 'Creates a fixed-offset tzinfo object representing UTC+01:00.',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: 'wat_kickoff = utc_kickoff.astimezone(WAT)',
          internalEffect: 'Adjusts the wall clock forward by +1 hour (18:30 -> 19:30) and tags it +01:00.',
        },
        {
          step: 3,
          codeLine: 9,
          instruction: 'utc_kickoff == wat_kickoff',
          internalEffect: 'Normalizes both aware datetimes to UTC and confirms they represent the exact same moment (difference is 0:00:00).',
        },
      ],
      apply: {
        domain: 'Global Operations',
        contextTitle: 'Displaying Lagos Local Time from UTC Logs',
        scenario: 'Convert a UTC deployment timestamp to West Africa Time (WAT) for the Lagos engineering team.',
        code: `from datetime import datetime, timezone, timedelta

WAT = timezone(timedelta(hours=1), name="WAT")
deploy_utc = datetime.fromisoformat("2026-11-10T23:15:00+00:00")
deploy_wat = deploy_utc.astimezone(WAT)
print("Lagos time:", deploy_wat.strftime("%Y-%m-%d %H:%M %Z"))`,
        outcome: 'Lagos time: 2026-11-11 00:15 WAT',
      },
      commonMistakes: [
        {
          label: 'Using .replace(tzinfo=WAT) Instead of .astimezone(WAT)',
          erroneousCode: `from datetime import datetime, timezone, timedelta
WAT = timezone(timedelta(hours=1), name="WAT")
utc_dt = datetime(2026, 11, 10, 18, 30, tzinfo=timezone.utc)
wrong = utc_dt.replace(tzinfo=WAT)  # Keeps 18:30 instead of 19:30!`,
          errorMessage: 'Silent bug: relabels 18:30 UTC as 18:30 WAT, shifting the instant by 1 hour!',
          explanation: '.replace(tzinfo=...) swaps the label without adjusting the hour. Always use .astimezone() to convert.',
          correctedCode: `correct = utc_dt.astimezone(WAT)  # 19:30:00+01:00`,
        },
      ],
      sourceNotes: 'Covers naive vs aware datetimes, UTC, and WAT (UTC+1).',
      practise: [
        {
          id: 'd16-s6-ex1',
          title: 'Fix the Bug: Mixing Naive and Aware Datetimes',
          type: 'fix-the-bug',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Cross-Region Server Sync',
          prompt: 'Subtracting `naive_local` from `utc_now` raises `TypeError`. Make `naive_local` aware in `WAT (UTC+1)` using `.replace(tzinfo=WAT)` and print the difference in seconds (`0`).',
          starterCode: `from datetime import datetime, timezone, timedelta

WAT = timezone(timedelta(hours=1), name="WAT")
utc_now = datetime(2026, 11, 10, 12, 0, tzinfo=timezone.utc)
naive_local = datetime(2026, 11, 10, 13, 0)

diff = utc_now - naive_local
print(int(diff.total_seconds()))`,
          solutionCode: `from datetime import datetime, timezone, timedelta

WAT = timezone(timedelta(hours=1), name="WAT")
utc_now = datetime(2026, 11, 10, 12, 0, tzinfo=timezone.utc)
aware_wat = datetime(2026, 11, 10, 13, 0, tzinfo=WAT)

diff = utc_now - aware_wat
print(int(diff.total_seconds()))`,
          testCases: [
            { id: 'tc-1', label: 'Prints 0', setup: '', expected: '0', hidden: false },
          ],
          hints: [
            'You cannot subtract a naive datetime from an aware datetime.',
            'Attach tzinfo=WAT to the 13:00 datetime.',
            '12:00 UTC and 13:00 WAT are the same instant, so diff is 0.',
          ],
        },
        {
          id: 'd16-s6-ex2',
          title: 'Scenario: .replace(tzinfo=...) vs .astimezone(...)',
          type: 'scenario-mcq',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Lagos Payment Gateway',
          prompt: 'You have an aware UTC timestamp `t = datetime(2026, 11, 10, 23, 30, tzinfo=timezone.utc)`. Which call correctly converts it to West Africa Time (`WAT`, UTC+1) as `2026-11-11 00:30:00+01:00`?',
          options: [
            { id: 'opt-1', text: 't.astimezone(WAT)', explanation: 'Correct! .astimezone() shifts the clock by +1 hour and preserves the exact universal instant.', isCorrect: true },
            { id: 'opt-2', text: 't.replace(tzinfo=WAT)', explanation: 'Incorrect. .replace() keeps 23:30 and only swaps the timezone label, shifting the instant by 1 hour.', isCorrect: false },
            { id: 'opt-3', text: 't + timedelta(hours=1)', explanation: 'Incorrect. That keeps tzinfo as UTC instead of WAT.', isCorrect: false },
            { id: 'opt-4', text: 'datetime.combine(t, WAT)', explanation: 'Incorrect. TypeError.', isCorrect: false },
          ],
          hints: [
            'Which method converts an already-aware datetime to a new timezone?',
            '.replace() only swaps metadata without adjusting the hour.',
            'Use t.astimezone(WAT).',
          ],
        },
        {
          id: 'd16-s6-ex3',
          title: 'Write Code: Convert UTC Event to WAT',
          type: 'write-code',
          tier: 'project',
          points: 20,
          contextScenario: 'West Africa Broadcast Schedule',
          prompt: 'Create `WAT = timezone(timedelta(hours=1), name="WAT")`, convert `datetime(2026, 11, 10, 20, 0, tzinfo=timezone.utc)` to WAT, and print its `.strftime("%Y-%m-%d %H:%M %Z")`.',
          starterCode: `from datetime import datetime, timezone, timedelta

WAT = timezone(timedelta(hours=1), name="WAT")
utc_show = datetime(2026, 11, 10, 20, 0, tzinfo=timezone.utc)
# Convert to WAT and format
`,
          solutionCode: `from datetime import datetime, timezone, timedelta

WAT = timezone(timedelta(hours=1), name="WAT")
utc_show = datetime(2026, 11, 10, 20, 0, tzinfo=timezone.utc)
wat_show = utc_show.astimezone(WAT)
print(wat_show.strftime("%Y-%m-%d %H:%M %Z"))`,
          testCases: [
            { id: 'tc-1', label: 'Prints 2026-11-10 21:00 WAT', setup: '', expected: '2026-11-10 21:00 WAT', hidden: false },
          ],
          hints: [
            'Call utc_show.astimezone(WAT).',
            'Format with .strftime("%Y-%m-%d %H:%M %Z").',
            '20:00 UTC becomes 21:00 WAT.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day16-sub7',
      number: 7,
      title: 'Epoch Timestamps & Temporal Best Practices',
      summary: 'Convert between Unix epoch seconds and aware UTC datetimes, and follow production UTC-first guidelines.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'The Unix Epoch & Production Time Rules',
        paragraphs: [
          'A **Unix epoch timestamp** is the number of seconds elapsed since `1970-01-01 00:00:00 UTC`. You can convert an aware `datetime` to epoch seconds with `.timestamp()`, and convert epoch seconds back into an aware UTC datetime with `datetime.fromtimestamp(ts, tz=timezone.utc)`.',
          'Watch out for a subtle trap: calling `.timestamp()` on a **naive** datetime assumes the naive datetime is in the **machine’s local timezone**, which produces different numbers on a server in London vs a laptop in Lagos!',
          'Golden rule for production systems: **store and compute in aware UTC** (`datetime.now(timezone.utc)` or ISO 8601 `+00:00` strings), and convert to local timezones (like `WAT`) only at the UI display boundary.',
        ],
        keyTerms: [
          {
            term: 'Unix Epoch',
            definition: 'The reference instant 1970-01-01T00:00:00Z from which POSIX timestamps count seconds.',
          },
          {
            term: 'datetime.fromtimestamp(ts, tz=timezone.utc)',
            definition: 'Converts numeric epoch seconds into an aware UTC datetime without deprecation warnings.',
          },
        ],
        bulletPoints: [
          'Always pass `tz=timezone.utc` to `datetime.fromtimestamp()`—never use the deprecated `utcfromtimestamp()`.',
          'Store UTC in databases and APIs; convert to user timezone only when rendering.',
        ],
      },
      visualise: {
        type: 'datetime-parts-sim',
        title: 'Epoch Timestamp & UTC Round-Trip Inspector',
        badge: 'simulation',
        description: 'Inspect how an aware UTC datetime maps to a numeric Unix epoch timestamp and back.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Round-Tripping Between Aware UTC Datetime and Unix Epoch',
          runMode: 'real',
          code: `from datetime import datetime, timezone

epoch_start = datetime(1970, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
event_utc = datetime(2026, 11, 10, 12, 0, 0, tzinfo=timezone.utc)

ts = event_utc.timestamp()
restored = datetime.fromtimestamp(ts, tz=timezone.utc)

print("Epoch start ts:", epoch_start.timestamp())
print("Event ts:", ts)
print("Restored:", restored.isoformat())
print("Exact round-trip:", restored == event_utc)`,
          expectedOutput: `Epoch start ts: 0.0
Event ts: 1794312000.0
Restored: 2026-11-10T12:00:00+00:00
Exact round-trip: True`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 6,
          instruction: 'ts = event_utc.timestamp()',
          internalEffect: 'Computes exact elapsed seconds since 1970-01-01T00:00:00Z as a float.',
        },
        {
          step: 2,
          codeLine: 7,
          instruction: 'restored = datetime.fromtimestamp(ts, tz=timezone.utc)',
          internalEffect: 'Reconstructs an aware UTC datetime from the numeric epoch timestamp.',
        },
      ],
      apply: {
        domain: 'Distributed Systems',
        contextTitle: 'Checking JWT Token Expiration',
        scenario: 'Compare a numeric JWT `exp` epoch claim against the current aware UTC time.',
        code: `from datetime import datetime, timezone

jwt_exp = 1794315600
exp_dt = datetime.fromtimestamp(jwt_exp, tz=timezone.utc)
now_utc = datetime(2026, 11, 10, 12, 30, tzinfo=timezone.utc)
print("Expired?", now_utc >= exp_dt, "| Expires at:", exp_dt.isoformat())`,
        outcome: 'Expired? False | Expires at: 2026-11-10T13:00:00+00:00',
      },
      commonMistakes: [
        {
          label: 'Calling .fromtimestamp() Without tz=timezone.utc',
          erroneousCode: `from datetime import datetime
dt = datetime.fromtimestamp(0)  # Local naive time, varies by server region!`,
          errorMessage: 'Portability bug: returns 1970-01-01 01:00:00 in WAT instead of 00:00:00 UTC',
          explanation: 'Omitting tz= produces a naive local datetime that shifts depending on where the code runs.',
          correctedCode: `from datetime import datetime, timezone
dt = datetime.fromtimestamp(0, tz=timezone.utc)`,
        },
      ],
      sourceNotes: 'Covers Unix epoch timestamps and UTC-first best practices.',
      practise: [
        {
          id: 'd16-s7-ex1',
          title: 'Write Code: Epoch Seconds to Aware UTC ISO',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'JWT Token Expiry Inspector',
          prompt: 'Convert Unix epoch `1794312000` into an aware UTC datetime using `datetime.fromtimestamp(..., tz=timezone.utc)` and print its `.isoformat()`.',
          starterCode: `from datetime import datetime, timezone

epoch_ts = 1794312000
# Convert to aware UTC datetime and print isoformat()
`,
          solutionCode: `from datetime import datetime, timezone

epoch_ts = 1794312000
dt_utc = datetime.fromtimestamp(epoch_ts, tz=timezone.utc)
print(dt_utc.isoformat())`,
          testCases: [
            { id: 'tc-1', label: 'Prints 2026-11-10T12:00:00+00:00', setup: '', expected: '2026-11-10T12:00:00+00:00', hidden: false },
          ],
          hints: [
            'Pass tz=timezone.utc as the second argument to datetime.fromtimestamp().',
            'Call .isoformat() on the resulting datetime.',
            '2026-11-10T12:00:00+00:00.',
          ],
        },
        {
          id: 'd16-s7-ex2',
          title: 'Theory: Why Naive .timestamp() Is Dangerous',
          type: 'theory-reasoning',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Multi-Region Cloud Deployment',
          prompt: 'Why can calling `.timestamp()` on a **naive** `datetime` produce different numbers on a developer laptop in Lagos (WAT) versus a cloud server in UTC?',
          modelAnswer: 'When .timestamp() is called on a naive datetime (tzinfo=None), Python assumes the naive datetime is in the host operating system’s local timezone. A server in UTC and a laptop in WAT (UTC+1) will interpret the same naive clock reading as two instants 3600 seconds apart.',
          markingCriteria: [
            { id: 'mc-1', label: 'Explains Python assumes naive datetimes are in the host OS local timezone during .timestamp()', points: 12 },
            { id: 'mc-2', label: 'Concludes this produces a 3600-second discrepancy between UTC and WAT machines', points: 8 },
          ],
          hints: [
            'What timezone does Python assume when tzinfo is None?',
            'Does a UTC server have the same local offset as a WAT laptop?',
            'Always attach tzinfo=timezone.utc before calling .timestamp().',
          ],
        },
        {
          id: 'd16-s7-ex3',
          title: 'Scenario: Production Temporal Storage Standard',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Database Schema Design',
          prompt: 'What is the industry best practice for storing timestamps in a backend database used by customers across multiple timezones?',
          options: [
            { id: 'opt-1', text: 'Store timezone-aware UTC timestamps (or UTC epoch seconds) and convert to the user’s local timezone at display time.', explanation: 'Correct! UTC-first storage prevents ambiguity and daylight-saving bugs.', isCorrect: true },
            { id: 'opt-2', text: 'Store formatted local strings like "03:07 PM" without timezone info.', explanation: 'Incorrect. Ambiguous and unsortable.', isCorrect: false },
            { id: 'opt-3', text: 'Store naive datetime.now() from whichever server handled the request.', explanation: 'Incorrect. Different servers may have different local timezones.', isCorrect: false },
            { id: 'opt-4', text: 'Store only the day of the week.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Which timezone is universal and never has daylight saving jumps?',
            'When should conversion to WAT or other local zones happen?',
            'Store UTC; convert at the UI boundary.',
          ],
        },
      ],
      assess: [],
    },
  ],
  realWorldLabs: [
    {
      id: 'day16-lab1',
      title: 'Flight Dispatch UTC-to-WAT Arrival Calculator',
      description: 'Parse a UTC departure ISO string, add a flight duration with timedelta, and display the arrival time in West Africa Time (WAT, UTC+1).',
      domain: 'Aviation & Logistics',
      starterCode: `from datetime import datetime, timezone, timedelta

WAT = timezone(timedelta(hours=1), name="WAT")
dep_utc = datetime.fromisoformat("2026-11-10T21:15:00+00:00")
flight_duration = timedelta(hours=6, minutes=25)

arr_utc = dep_utc + flight_duration
arr_wat = arr_utc.astimezone(WAT)

print("Arrival UTC:", arr_utc.strftime("%Y-%m-%d %H:%M UTC"))
print("Arrival WAT:", arr_wat.strftime("%Y-%m-%d %H:%M %Z"))`,
      targetOutput: `Arrival UTC: 2026-11-11 03:40 UTC
Arrival WAT: 2026-11-11 04:40 WAT`,
    },
    {
      id: 'day16-lab2',
      title: 'Invoice Aging & SLA Breach Reporter',
      description: 'Parse invoice issue dates with strptime(), compute 14-day due dates with timedelta, and flag overdue invoices.',
      domain: 'Fintech Operations',
      starterCode: `from datetime import datetime, timedelta

as_of = datetime(2026, 11, 20)
invoices = [("INV-101", "2026-11-01"), ("INV-102", "2026-11-12")]

for inv_id, issued_str in invoices:
    issued = datetime.strptime(issued_str, "%Y-%m-%d")
    due = issued + timedelta(days=14)
    overdue_days = (as_of - due).days
    status = f"OVERDUE ({overdue_days}d)" if overdue_days > 0 else "ON_TIME"
    print(f"{inv_id}: due {due.date()} -> {status}")`,
      targetOutput: `INV-101: due 2026-11-15 -> OVERDUE (5d)
INV-102: due 2026-11-26 -> ON_TIME`,
    },
  ],
  miniProject: {
    id: 'day16-project',
    title: 'Temporal Operations & WAT Scheduler',
    brief: 'Build a timezone-aware scheduling utility that parses ISO/custom timestamps, computes SLA deadlines with timedelta, converts UTC schedules to WAT (UTC+1), and exports Unix epoch checkpoints.',
    requirements: [
      'Parse incoming ISO 8601 and custom strptime() event strings cleanly',
      'Use aware UTC datetimes (datetime.now(timezone.utc) or +00:00) throughout calculations',
      'Calculate deadlines and elapsed durations using timedelta and .total_seconds()',
      'Convert UTC timestamps to West Africa Time (WAT, UTC+1) using .astimezone()',
      'Round-trip aware UTC datetimes to Unix epoch seconds via .timestamp() and .fromtimestamp(..., tz=timezone.utc)',
    ],
    rubric: [
      { criterion: 'Aware UTC-first temporal arithmetic without naive/aware TypeError', weight: 40 },
      { criterion: 'Accurate strptime()/strftime() formatting and WAT conversion', weight: 30 },
      { criterion: 'Clean timedelta duration and epoch round-trip logic', weight: 30 },
    ],
    starterCode: `# Temporal Operations & WAT Scheduler
from datetime import datetime, timezone, timedelta

WAT = timezone(timedelta(hours=1), name="WAT")

def schedule_summary(iso_start: str, duration_hours: int) -> str:
    # Parse start, add duration, convert to WAT, and return formatted summary
    pass
`,
  },
  dayQuiz: {
    title: 'Day 16 Mastery Checkpoint Quiz: Date and Time',
    passingScorePercentage: 80,
    questions: [
      {
        id: 'd16-q1',
        scenario: 'Immutability',
        question: 'How do you change the hour of an existing datetime `dt` without raising an error?',
        options: [
          { id: 'q1-a', text: 'dt = dt.replace(hour=10)', explanation: 'Correct! datetime objects are immutable; .replace() returns a new instance.', isCorrect: true },
          { id: 'q1-b', text: 'dt.hour = 10', explanation: 'Incorrect. Raises AttributeError.', isCorrect: false },
          { id: 'q1-c', text: 'dt.set_hour(10)', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q1-d', text: 'dt.update(hour=10)', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd16-q2',
        scenario: 'Python 3.12+ Clock',
        question: 'Which expression is the recommended Python 3.12+ way to get the current aware UTC datetime?',
        options: [
          { id: 'q2-a', text: 'datetime.now(timezone.utc)', explanation: 'Correct! Returns an aware UTC datetime.', isCorrect: true },
          { id: 'q2-b', text: 'datetime.utcnow()', explanation: 'Incorrect. Deprecated in Python 3.12 and returns a naive datetime.', isCorrect: false },
          { id: 'q2-c', text: 'date.today()', explanation: 'Incorrect. Returns only a naive date.', isCorrect: false },
          { id: 'q2-d', text: 'datetime.now()', explanation: 'Incorrect. Returns a naive local datetime.', isCorrect: false },
        ],
      },
      {
        id: 'd16-q3',
        scenario: 'strftime Directives',
        question: 'In `strftime()`, what is the difference between `%m` and `%M`?',
        options: [
          { id: 'q3-a', text: '%m is zero-padded month (01–12), while %M is zero-padded minute (00–59).', explanation: 'Correct!', isCorrect: true },
          { id: 'q3-b', text: '%m is minute and %M is month.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q3-c', text: '%m is abbreviated month name and %M is full month name.', explanation: 'Incorrect. Those are %b and %B.', isCorrect: false },
          { id: 'q3-d', text: 'They are identical.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd16-q4',
        scenario: 'Parsing Strings',
        question: 'What happens if you call `datetime.strptime("2026/11/10", "%Y-%m-%d")`?',
        options: [
          { id: 'q4-a', text: 'ValueError is raised because "/" does not match "-".', explanation: 'Correct! strptime() requires an exact structural match.', isCorrect: true },
          { id: 'q4-b', text: 'It automatically normalizes slashes to hyphens.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q4-c', text: 'It returns None.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q4-d', text: 'TypeError is raised.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd16-q5',
        scenario: 'ISO Parsing',
        question: 'Which method parses `"2026-11-10T14:30:00+01:00"` directly without a custom format string?',
        options: [
          { id: 'q5-a', text: 'datetime.fromisoformat()', explanation: 'Correct!', isCorrect: true },
          { id: 'q5-b', text: 'datetime.isoformat()', explanation: 'Incorrect. That formats a datetime into a string.', isCorrect: false },
          { id: 'q5-c', text: 'datetime.combine()', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q5-d', text: 'datetime.fromtimestamp()', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd16-q6',
        scenario: 'timedelta Fields',
        question: 'If `d = timedelta(days=3, hours=1)`, what does `d.seconds` return?',
        options: [
          { id: 'q6-a', text: '3600 (only the sub-day remainder; use d.total_seconds() for 262800.0).', explanation: 'Correct!', isCorrect: true },
          { id: 'q6-b', text: '262800', explanation: 'Incorrect. That is int(d.total_seconds()).', isCorrect: false },
          { id: 'q6-c', text: '1', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q6-d', text: '86400', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd16-q7',
        scenario: 'Naive vs Aware',
        question: 'What exception is raised if you compare `datetime(2026, 11, 10) < datetime(2026, 11, 10, tzinfo=timezone.utc)`?',
        options: [
          { id: 'q7-a', text: 'TypeError: can\'t compare offset-naive and offset-aware datetimes', explanation: 'Correct!', isCorrect: true },
          { id: 'q7-b', text: 'ValueError', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q7-c', text: 'False', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q7-d', text: 'KeyError', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd16-q8',
        scenario: 'Timezone Conversion',
        question: 'Given `utc_dt = datetime(2026, 11, 10, 12, 0, tzinfo=timezone.utc)` and `WAT = timezone(timedelta(hours=1), "WAT")`, what is `utc_dt == utc_dt.astimezone(WAT)`?',
        options: [
          { id: 'q8-a', text: 'True (they represent the exact same instant in time).', explanation: 'Correct! 12:00+00:00 and 13:00+01:00 are the same instant.', isCorrect: true },
          { id: 'q8-b', text: 'False (their hour numbers differ).', explanation: 'Incorrect. Aware equality compares universal instants.', isCorrect: false },
          { id: 'q8-c', text: 'TypeError', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q8-d', text: 'None', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd16-q9',
        scenario: 'Epoch Conversion',
        question: 'What is the modern, non-deprecated way to convert a Unix epoch float `ts` into an aware UTC datetime?',
        options: [
          { id: 'q9-a', text: 'datetime.fromtimestamp(ts, tz=timezone.utc)', explanation: 'Correct!', isCorrect: true },
          { id: 'q9-b', text: 'datetime.utcfromtimestamp(ts)', explanation: 'Incorrect. Deprecated in Python 3.12 and returns a naive datetime.', isCorrect: false },
          { id: 'q9-c', text: 'datetime.fromtimestamp(ts)', explanation: 'Incorrect. Returns a naive local datetime.', isCorrect: false },
          { id: 'q9-d', text: 'timedelta(seconds=ts)', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd16-q10',
        scenario: 'Weekday Methods',
        question: 'Which method on `date` returns `1` for Monday and `7` for Sunday?',
        options: [
          { id: 'q10-a', text: '.isoweekday()', explanation: 'Correct! .weekday() is 0–6, while .isoweekday() is 1–7.', isCorrect: true },
          { id: 'q10-b', text: '.weekday()', explanation: 'Incorrect. Returns 0 for Monday.', isCorrect: false },
          { id: 'q10-c', text: '.day()', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q10-d', text: '.toordinal()', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
    ],
  },
  cheatSheet: [
    {
      category: 'datetime, date & time Construction & .replace()',
      syntax: 'from datetime import date, time, datetime; dt.replace(hour=9)',
      description: 'date, time, and datetime are immutable value objects. Use .replace() to derive modified copies and datetime.combine(d, t) to merge date and time.',
      example: `from datetime import date, time, datetime
d = date(2026, 11, 10)
t = time(9, 30)
dt = datetime.combine(d, t).replace(hour=14)
print(dt.isoformat(), "| weekday:", d.weekday())`,
    },
    {
      category: 'Current Clock: now(timezone.utc) vs Deprecated utcnow()',
      syntax: 'datetime.now(timezone.utc)  # Python 3.12+ standard',
      description: 'datetime.utcnow() is deprecated in Python 3.12+ because it returns a naive datetime. Always use datetime.now(timezone.utc) for an aware UTC timestamp.',
      example: `from datetime import date, datetime, timezone
today = date.today()
utc_now = datetime.now(timezone.utc)
print(today.isoformat(), "| aware:", utc_now.tzinfo is not None)`,
    },
    {
      category: 'Formatting with strftime() & isoformat()',
      syntax: 'dt.strftime("%Y-%m-%d %H:%M:%S") | dt.isoformat()',
      description: 'Render temporal objects to strings using %Y (4-digit year), %m (month), %d (day), %H (24h), %I (12h), %M (minute), %S (second), %p (AM/PM).',
      example: `from datetime import datetime
dt = datetime(2026, 11, 10, 15, 7, 45)
print(dt.strftime("%A, %d %b %Y %I:%M %p"))
print(dt.isoformat())`,
    },
    {
      category: 'Parsing with strptime() & fromisoformat()',
      syntax: 'datetime.strptime(s, fmt) | datetime.fromisoformat(iso_str)',
      description: 'strptime() parses custom strings with an exact structural pattern (raising ValueError on mismatch). Use fromisoformat() for ISO 8601 strings.',
      example: `from datetime import datetime
a = datetime.strptime("10-Nov-2026 14:35", "%d-%b-%Y %H:%M")
b = datetime.fromisoformat("2026-11-10T14:35:00+01:00")
print(a, "|", b.utcoffset())`,
    },
    {
      category: 'Duration Arithmetic with timedelta & total_seconds()',
      syntax: 'delta = end - start; delta.total_seconds()',
      description: 'timedelta models elapsed duration. .seconds only returns the sub-day remainder (0–86399); always call .total_seconds() for full duration in seconds.',
      example: `from datetime import datetime, timedelta
start = datetime(2026, 11, 2, 9, 0)
end = start + timedelta(days=2, hours=3)
delta = end - start
print("days:", delta.days, "| total_sec:", int(delta.total_seconds()))`,
    },
    {
      category: 'Naive vs Aware Datetimes & WAT (UTC+1) Conversion',
      syntax: 'WAT = timezone(timedelta(hours=1), "WAT"); utc_dt.astimezone(WAT)',
      description: 'Comparing naive and aware datetimes raises TypeError. Use .astimezone(WAT) to shift wall-clock time while preserving the exact universal instant.',
      example: `from datetime import datetime, timezone, timedelta
WAT = timezone(timedelta(hours=1), name="WAT")
utc_dt = datetime(2026, 11, 10, 18, 30, tzinfo=timezone.utc)
wat_dt = utc_dt.astimezone(WAT)
print(wat_dt.isoformat(), "| same instant:", utc_dt == wat_dt)`,
    },
    {
      category: 'Unix Epoch Timestamps & UTC-First Storage',
      syntax: 'dt.timestamp() | datetime.fromtimestamp(ts, tz=timezone.utc)',
      description: 'Store and compute in aware UTC. Convert epoch seconds using tz=timezone.utc (never deprecated utcfromtimestamp() or naive fromtimestamp()).',
      example: `from datetime import datetime, timezone
ts = 1794312000
dt = datetime.fromtimestamp(ts, tz=timezone.utc)
print(dt.isoformat(), "| round-trip:", int(dt.timestamp()) == ts)`,
    },
  ],
  sourceNotes: [
    'Curriculum reference: https://github.com/Asabeneh/30-Days-Of-Python/tree/master/16_Day_Python_date_time',
  ],
};
