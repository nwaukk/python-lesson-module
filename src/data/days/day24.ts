/**
 * Day 24: Statistics and NumPy (Advanced Python)
 * Part A (Learn) conforming to Sections 10, 13.2, and 14 of the Master Specification.
 * Includes:
 *  - 9 Detailed Subtopics following the 10-step pedagogical structure
 *  - 3 Signature Simulations: ndarray-shape-sim, broadcasting-axis-sim, vectorised-stats-sim
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_24_MODULE: DayModule = {
  schemaVersion: 1,
  number: 24,
  title: 'Statistics and NumPy',
  level: 'advanced',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/24_Day_Statistics',
  estimatedMinutes: 90,
  prerequisites: [5, 12],
  objectives: [
    'Compute descriptive statistics (mean, median, mode, variance, standard deviation) and interpret outlier sensitivity',
    'Contrast NumPy contiguous typed ndarray memory with Python list pointer arrays',
    'Create arrays with np.array, zeros, ones, arange, and linspace without off-by-one errors',
    'Inspect and transform shape, ndim, size, dtype, and zero-copy reshape() views',
    'Perform 2D/3D slicing and boolean masking cleanly without unintended view mutations',
    'Replace slow Python loops with vectorised element-wise operations and ufuncs',
    'Apply NumPy broadcasting rules across scalars, row vectors, and column vectors',
    'Aggregate multidimensional data along axis=0 (columns) and axis=1 (rows)',
    'Compute dot products, matrix multiplication (@), and seeded random sampling',
  ],
  subtopics: [
    {
      id: 'day24-sub1',
      number: 1,
      title: 'Descriptive Statistics: Mean, Median, Mode, Variance & Stdev',
      summary: 'Measure central tendency and spread using Python’s statistics module and understand outlier impact.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Summarizing Data Before Modeling',
        paragraphs: [
          '**Descriptive statistics** condense raw numeric arrays into interpretable summaries. **Central tendency** measures (`mean`, `median`, `mode`) tell you where values cluster, while **dispersion** measures (`variance`, `stdev`) tell you how widely values spread around the center.',
          'The arithmetic **mean** is sensitive to extreme outliers (a single billionaire skews average income), whereas the **median** (middle sorted value) is robust against outliers. Python’s standard-library **`statistics`** module provides `mean()`, `median()`, `mode()`, `pstdev()` (population), and `stdev()` (sample, dividing by `n - 1`).',
        ],
        keyTerms: [
          {
            term: 'Mean vs. Median',
            definition: 'Mean sums and divides by count (outlier-sensitive); median picks the middle sorted value (outlier-robust).',
          },
          {
            term: 'Standard Deviation',
            definition: 'Square root of variance, measuring average spread in the same units as the original data.',
          },
        ],
        bulletPoints: [
          'Use `statistics.pstdev()` for a full population (`N`) and `statistics.stdev()` for a sample (`N - 1`, Bessel’s correction).',
          'In NumPy, `np.std(arr)` defaults to `ddof=0` (population), while `ddof=1` computes sample standard deviation.',
        ],
      },
      visualise: {
        type: 'vectorised-stats-sim',
        title: 'Descriptive Statistics & Vectorised Z-Score Lab',
        badge: 'simulation',
        description: 'Compare mean, median, stdev, and Z-scores across balanced vs. outlier-skewed datasets.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Computing Central Tendency & Spread with statistics',
          runMode: 'real',
          code: `import statistics

scores = [72, 75, 80, 80, 93]
print("Mean:", statistics.mean(scores))
print("Median:", statistics.median(scores))
print("Mode:", statistics.mode(scores))
print("Pop Stdev:", round(statistics.pstdev(scores), 2))`,
          expectedOutput: `Mean: 80
Median: 80
Mode: 80
Pop Stdev: 7.24`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'statistics.mean(scores)',
          internalEffect: 'Sums all 5 integers (400) and divides by 5 to yield 80.',
        },
        {
          step: 2,
          codeLine: 7,
          instruction: 'statistics.pstdev(scores)',
          internalEffect: 'Computes population standard deviation dividing squared deviations by N=5.',
        },
      ],
      apply: {
        domain: 'Data Quality',
        contextTitle: 'Detecting Skewed Telemetry with Mean vs. Median',
        scenario: 'Compare mean and median API latency when one request spikes to 500ms.',
        code: `import statistics

latencies_ms = [12, 14, 15, 16, 500]
print("Mean ms:", statistics.mean(latencies_ms))
print("Median ms:", statistics.median(latencies_ms))`,
        outcome: `Mean ms: 111.4
Median ms: 15`,
      },
      commonMistakes: [
        {
          label: 'Confusing Population (ddof=0) vs Sample (ddof=1) Stdev',
          erroneousCode: `# Treating np.std(sample) and statistics.stdev(sample) as identical`,
          errorMessage: 'Subtle numerical mismatch between NumPy default (N) and statistics.stdev (N-1)',
          explanation: 'Pass `ddof=1` in `np.std(arr, ddof=1)` when matching `statistics.stdev()`.',
          correctedCode: `# np.std(arr, ddof=1) == statistics.stdev(arr)`,
        },
      ],
      sourceNotes: 'Covers descriptive statistics for Day 24.',
      practise: [
        {
          id: 'd24-ex1',
          title: 'Mean vs. Median Under Extreme Outliers',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'A neighborhood has 9 households earning $45k and 1 household earning $2,045k. Which metric best represents a typical household’s income?',
          contextScenario: 'Reporting typical resident income for a municipal housing grant.',
          options: [
            {
              id: 'a',
              text: 'The median ($45k), because it is robust against the single extreme outlier.',
              explanation: 'Correct! The mean jumps to $245k due to one outlier, whereas the median remains $45k.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'The mean ($245k), because it weights the billionaire equally.',
              explanation: 'Weighting an extreme outlier pulls the mean far above 90% of households.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'The variance, because it is measured in squared dollars.',
              explanation: 'Variance measures spread, not central tendency.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'The maximum ($2,045k), because it captures the full range.',
              explanation: 'The maximum is an extreme bound, not a typical value.',
              isCorrect: false,
            },
          ],
          hints: [
            'Compute both the mean and the median mentally.',
            'Which metric ignores how extreme the single largest value is?',
          ],
          points: 10,
        },
        {
          id: 'd24-ex2',
          title: 'Trace Population vs. Sample Standard Deviation',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'What does this `statistics` comparison print?',
          contextScenario: 'Comparing `pstdev` (dividing by N) against `stdev` (dividing by N-1).',
          starterCode: `import statistics

vals = [10, 20, 30]
print("pstdev:", round(statistics.pstdev(vals), 2))
print("stdev:", round(statistics.stdev(vals), 2))`,
          options: [
            {
              id: 'a',
              text: 'pstdev: 8.16\nstdev: 10.0',
              explanation: 'Correct! `pstdev` divides `200 / 3` (`sqrt(66.67) = 8.16`), while `stdev` divides `200 / 2` (`sqrt(100) = 10.0`).',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'pstdev: 10.0\nstdev: 8.16',
              explanation: 'Sample `stdev` uses `N - 1` in the denominator, making it larger than `pstdev`.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'pstdev: 10.0\nstdev: 10.0',
              explanation: 'They use different denominators (`N` vs `N - 1`).',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'pstdev: 8.16\nstdev: 8.16',
              explanation: '`stdev` applies Bessel’s correction (`N - 1`).',
              isCorrect: false,
            },
          ],
          hints: [
            'Mean is 20; squared deviations are `(-10)^2 + 0^2 + 10^2 = 200`.',
            '`pstdev` divides 200 by 3; `stdev` divides 200 by 2.',
          ],
          points: 10,
        },
        {
          id: 'd24-ex3',
          title: 'Summarize Sensor Batch Statistics',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Complete `summarize(nums)` using `statistics` to return `{"mean": ..., "median": ..., "pstdev": ...}` rounded to 2 decimals.',
          contextScenario: 'Building a telemetry summary helper for an IoT dashboard.',
          starterCode: `import statistics

def summarize(nums):
    # TODO: return rounded mean, median, and pstdev
    pass

print(summarize([12, 15, 18, 21, 24]))`,
          solutionCode: `import statistics

def summarize(nums):
    return {
        "mean": round(statistics.mean(nums), 2),
        "median": round(statistics.median(nums), 2),
        "pstdev": round(statistics.pstdev(nums), 2),
    }

print(summarize([12, 15, 18, 21, 24]))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Returns mean=18, median=18, pstdev=4.24',
              setup: '',
              expected: "{'mean': 18, 'median': 18, 'pstdev': 4.24}",
              hidden: false,
            },
          ],
          hints: [
            'Use `statistics.mean`, `statistics.median`, and `statistics.pstdev`.',
            'Wrap each value in `round(..., 2)`.',
          ],
          points: 15,
        },
        {
          id: 'd24-ex4',
          title: 'Why ddof=1 Matters for Small Samples',
          type: 'theory-reasoning',
          tier: 'challenge',
          prompt: 'Explain why `statistics.stdev()` (and `np.std(arr, ddof=1)`) divides by `N - 1` rather than `N` when estimating spread from a sample.',
          contextScenario: 'A lab measures 5 blood-pressure readings from a larger patient population.',
          modelAnswer: 'Sample deviations are measured around the sample mean rather than the true unknown population mean. Because the sample mean is fitted to those same N points, squared deviations around it systematically underestimate the true population variance. Dividing by N - 1 (Bessel’s correction) removes that downward bias.',
          markingCriteria: [
            { id: 'c1', label: 'Identifies underestimation bias when using sample mean', points: 10 },
            { id: 'c2', label: 'Names Bessel’s correction (N - 1 degrees of freedom)', points: 10 },
          ],
          hints: [
            'Is the sample mean closer to the sample points than the true population mean?',
            'What happens to the variance estimate if you divide by `N` on a small sample?',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day24-sub2',
      number: 2,
      title: 'Why NumPy ndarray? Contiguous Memory & Homogeneous dtype',
      summary: 'Understand why typed contiguous arrays outperform Python lists of object pointers.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Python list vs. NumPy ndarray Memory Model',
        paragraphs: [
          'A Python `list` is an array of **pointers** to separate `PyObject` structs scattered across the heap—so `[1, 2, 3]` can hold an `int`, a `str`, and a `dict`, at the cost of pointer indirection and ~28 bytes per integer.',
          'A NumPy **`ndarray`** stores **homogeneous** values of a single fixed **`dtype`** (such as `int64` or `float64`) in one **contiguous C-style memory block**. Because every element has the exact same byte width, CPUs can stream elements through SIMD vector registers 10x–100x faster.',
          'Python’s standard-library **`array.array`** demonstrates this same contiguous typed-buffer principle (`"i"` for signed ints, `"d"` for 64-bit floats).',
        ],
        keyTerms: [
          {
            term: 'ndarray',
            definition: 'NumPy’s N-dimensional homogeneous, contiguous, fixed-dtype array structure.',
          },
          {
            term: 'dtype',
            definition: 'Fixed binary data type (e.g., int64, float64, bool) shared by every element in an ndarray.',
          },
        ],
        bulletPoints: [
          'Mixing an `int` and a `float` in `np.array([1, 2.5])` upcasts all elements to `float64`.',
          'Homogeneous typed buffers allow C-level vectorised loops with zero Python type checking per element.',
        ],
      },
      visualise: {
        type: 'ndarray-shape-sim',
        title: 'ndarray Shape, Memory Buffer & Slicing Inspector',
        badge: 'simulation',
        description: 'Inspect contiguous memory buffers, dtype byte widths, and logical grid views.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Typed Contiguous Buffers with stdlib array.array',
          runMode: 'real',
          code: `from array import array
import sys

py_list = [10, 20, 30, 40]
typed_buf = array("d", [10, 20, 30, 40])  # contiguous float64-style buffer

print("Typecode:", typed_buf.typecode, "Itemsize:", typed_buf.itemsize, "bytes")
print("Buffer bytes:", len(typed_buf) * typed_buf.itemsize)
print("List container bytes:", sys.getsizeof(py_list))`,
          expectedOutput: `Typecode: d Itemsize: 8 bytes
Buffer bytes: 32
List container bytes: 88`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 5,
          instruction: 'array("d", [10, 20, 30, 40])',
          internalEffect: 'Packs 4 64-bit doubles into 32 contiguous bytes with no per-element PyObject header.',
        },
        {
          step: 2,
          codeLine: 7,
          instruction: 'typed_buf.itemsize',
          internalEffect: 'Reports fixed 8-byte width per element (equivalent to float64 dtype).',
        },
      ],
      apply: {
        domain: 'Numerical Engineering',
        contextTitle: 'Enforcing Homogeneous Type Promotion',
        scenario: 'Demonstrate how mixed ints and floats promote to a common float representation.',
        code: `raw = [1, 2, 3.5, 4]
promoted = [float(x) for x in raw]
print("Promoted:", promoted)`,
        outcome: 'Promoted: [1.0, 2.0, 3.5, 4.0]',
      },
      commonMistakes: [
        {
          label: 'Accidentally Creating dtype=object Arrays with Mixed Strings & Numbers',
          erroneousCode: `# np.array([1, "two", 3])  -> dtype='<U21' or object!`,
          errorMessage: 'Silently turns all numbers into strings or loses C-level vectorisation speed',
          explanation: 'Keep numeric arrays purely numeric (`int64` / `float64`) before performing math.',
          correctedCode: `# np.array([1, 2, 3], dtype="float64")`,
        },
      ],
      sourceNotes: 'Covers ndarray contiguous memory and dtype for Day 24.',
      practise: [
        {
          id: 'd24-ex5',
          title: 'Contiguous ndarray vs. Python list Memory',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Why is a NumPy `float64` `ndarray` of 1,000,000 numbers dramatically faster for vector math than a Python `list` of 1,000,000 floats?',
          contextScenario: 'Benchmarking a Monte Carlo pricing simulation in Python vs. NumPy.',
          options: [
            {
              id: 'a',
              text: '`ndarray` stores homogeneous raw 8-byte floats contiguously in memory, enabling tight C/SIMD loops without per-element type checks.',
              explanation: 'Correct! Contiguous homogeneous buffers eliminate pointer chasing and Python object boxing.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'Python `list` stores numbers on disk instead of RAM.',
              explanation: 'Both `list` and `ndarray` live in RAM.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'NumPy skips floating-point arithmetic and approximates results.',
              explanation: 'NumPy performs exact IEEE 754 floating-point arithmetic.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: '`ndarray` automatically runs on a remote cloud GPU.',
              explanation: 'Standard NumPy runs on the local CPU.',
              isCorrect: false,
            },
          ],
          hints: [
            'Compare a list of `PyObject*` pointers vs a contiguous `double[]` buffer.',
            'What overhead does Python incur on every iteration of a `for` loop?',
          ],
          points: 10,
        },
        {
          id: 'd24-ex6',
          title: 'Compute Typed Buffer Byte Footprint',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'What does this `array.array` memory footprint calculation print?',
          contextScenario: 'Estimating RAM usage for a contiguous 64-bit float buffer.',
          starterCode: `from array import array

buf = array("d", [1.0, 2.0, 3.0, 4.0, 5.0])
print("Elements:", len(buf), "Bytes:", len(buf) * buf.itemsize)`,
          options: [
            {
              id: 'a',
              text: 'Elements: 5 Bytes: 40',
              explanation: 'Correct! Typecode `"d"` (float64) uses 8 bytes per element (`5 * 8 = 40` bytes).',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'Elements: 5 Bytes: 20',
              explanation: '`"d"` is 64-bit (8 bytes), not 32-bit (4 bytes).',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'Elements: 5 Bytes: 5',
              explanation: 'Each double takes 8 bytes, not 1 byte.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Elements: 8 Bytes: 40',
              explanation: 'There are 5 elements in the list.',
              isCorrect: false,
            },
          ],
          hints: [
            'How many bytes is a 64-bit double (`"d"`)?',
            'Multiply `len(buf)` by `buf.itemsize`.',
          ],
          points: 10,
        },
        {
          id: 'd24-ex7',
          title: 'Enforce Homogeneous Float Promotion',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'Fix `to_float_buffer(values)` so mixed ints/numeric strings are converted into a contiguous `array("d", ...)` without raising `TypeError`.',
          contextScenario: 'Cleaning raw CSV sensor strings into a typed numeric buffer.',
          starterCode: `from array import array

def to_float_buffer(values):
    return array("d", values)

print(list(to_float_buffer([1, "2.5", 3])))`,
          solutionCode: `from array import array

def to_float_buffer(values):
    return array("d", [float(v) for v in values])

print(list(to_float_buffer([1, "2.5", 3])))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Converts mixed numeric values to float64 buffer',
              setup: '',
              expected: '[1.0, 2.5, 3.0]',
              hidden: false,
            },
          ],
          hints: [
            '`array("d", ...)` requires floats/ints, not strings.',
            'Convert each item with `[float(v) for v in values]`.',
          ],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day24-sub3',
      number: 3,
      title: 'Creating Arrays: zeros, ones, arange & linspace',
      summary: 'Generate structured numeric grids and evenly spaced sequences accurately.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Factory Functions for Numeric Sequences',
        paragraphs: [
          'In NumPy, you rarely type large arrays by hand. Instead, you use factory helpers: **`np.zeros((rows, cols))`**, **`np.ones((rows, cols))`**, **`np.arange(start, stop, step)`**, and **`np.linspace(start, stop, num)`**.',
          'Watch the critical difference between `arange` and `linspace`: **`arange(0, 10, 2)`** excludes the `stop` value (`[0, 2, 4, 6, 8]`), just like Python’s `range()`, whereas **`linspace(0, 1, 5)`** *includes both endpoints* and generates exactly `5` evenly spaced floats (`[0.0, 0.25, 0.5, 0.75, 1.0]`).',
        ],
        keyTerms: [
          {
            term: 'np.arange(start, stop, step)',
            definition: 'Half-open interval [start, stop) stepping by a fixed increment.',
          },
          {
            term: 'np.linspace(start, stop, num)',
            definition: 'Closed interval [start, stop] divided into exactly num evenly spaced points.',
          },
        ],
        bulletPoints: [
          'Always pass shape as a tuple to `np.zeros((3, 4))`, not two separate arguments `np.zeros(3, 4)`.',
          'Prefer `linspace` over `arange` for floating-point steps to avoid floating-point rounding surprises at the endpoint.',
        ],
      },
      visualise: {
        type: 'ndarray-shape-sim',
        title: 'Array Factory & Shape Layout Inspector',
        badge: 'simulation',
        description: 'Explore 1D, 2D, and 3D array shapes and contiguous element ordering.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Implementing arange & linspace Logic in Pure Python',
          runMode: 'real',
          code: `def linspace(start, stop, num):
    if num == 1:
        return [float(start)]
    step = (stop - start) / (num - 1)
    return [round(start + i * step, 4) for i in range(num)]

print("arange-style:", list(range(0, 10, 2)))
print("linspace(0, 1, 5):", linspace(0, 1, 5))`,
          expectedOutput: `arange-style: [0, 2, 4, 6, 8]
linspace(0, 1, 5): [0.0, 0.25, 0.5, 0.75, 1.0]`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'step = (stop - start) / (num - 1)',
          internalEffect: 'Divides by num - 1 so both start (i=0) and stop (i=num-1) are included.',
        },
        {
          step: 2,
          codeLine: 7,
          instruction: 'list(range(0, 10, 2))',
          internalEffect: 'Stops before 10, yielding [0, 2, 4, 6, 8].',
        },
      ],
      apply: {
        domain: 'Signal Sampling',
        contextTitle: 'Generating Time-Axis Samples',
        scenario: 'Create 5 evenly spaced timestamps from 0.0s to 2.0s.',
        code: `num = 5
times = [round(0.0 + i * (2.0 / (num - 1)), 2) for i in range(num)]
print("Sample timestamps (s):", times)`,
        outcome: 'Sample timestamps (s): [0.0, 0.5, 1.0, 1.5, 2.0]',
      },
      commonMistakes: [
        {
          label: 'Passing Two Separate Integers to np.zeros(3, 4)',
          erroneousCode: `# np.zeros(3, 4)  # TypeError: Cannot interpret '4' as a data type!`,
          errorMessage: 'TypeError because the 2nd positional argument is dtype, not columns',
          explanation: 'Wrap multi-dimensional shapes in a tuple: `np.zeros((3, 4))`.',
          correctedCode: `# np.zeros((3, 4))`,
        },
      ],
      sourceNotes: 'Covers array creation helpers for Day 24.',
      practise: [
        {
          id: 'd24-ex8',
          title: 'arange vs. linspace Endpoint Behavior',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Which NumPy call produces `[0.0, 0.25, 0.5, 0.75, 1.0]` including both `0.0` and `1.0`?',
          contextScenario: 'Generating normalized percentage ticks from 0% to 100% for a chart axis.',
          options: [
            {
              id: 'a',
              text: '`np.linspace(0.0, 1.0, 5)`',
              explanation: 'Correct! `linspace` includes both `start` and `stop` and divides into `num=5` points.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: '`np.arange(0.0, 1.0, 0.25)`',
              explanation: '`arange` is half-open `[0.0, 1.0)` and excludes `1.0`.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '`np.zeros((1, 5))`',
              explanation: '`zeros` fills the array with `0.0`.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: '`np.ones(5)`',
              explanation: '`ones` fills the array with `1.0`.',
              isCorrect: false,
            },
          ],
          hints: [
            'Remember: `arange` excludes `stop`, while `linspace` includes `stop`.',
            'Count how many points are in `[0.0, 0.25, 0.5, 0.75, 1.0]`.',
          ],
          points: 10,
        },
        {
          id: 'd24-ex9',
          title: 'Complete linspace Generator',
          type: 'fill-the-gaps',
          tier: 'standard',
          prompt: 'Fill in the gaps so `make_grid(start, stop, num)` returns `num` evenly spaced floats including both endpoints.',
          contextScenario: 'Implementing a lightweight `np.linspace` equivalent in pure Python.',
          gaps: [
            {
              id: 'g1',
              beforeText: 'step = (stop - start) / (',
              afterText: ')\n',
              correctAnswer: 'num - 1',
              options: ['num - 1', 'num', 'num + 1', '2'],
            },
            {
              id: 'g2',
              beforeText: 'return [round(start + i * step, 4) for i in ',
              afterText: '(num)]',
              correctAnswer: 'range',
              options: ['range', 'len', 'enumerate', 'list'],
            },
          ],
          hints: [
            'With `num` points, there are `num - 1` intervals between `start` and `stop`.',
            'Iterate `i` from `0` to `num - 1` with `range(num)`.',
          ],
          points: 15,
        },
        {
          id: 'd24-ex10',
          title: 'Build a 2D Zero-Initialized Matrix Factory',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Implement `zeros_2d(rows, cols)` returning a `rows x cols` nested list of `0.0` floats, and print `zeros_2d(2, 3)`.',
          contextScenario: 'Pre-allocating a 2D accumulator grid.',
          starterCode: `def zeros_2d(rows, cols):
    # TODO: return rows x cols list of 0.0 (avoid shared row aliasing!)
    pass

grid = zeros_2d(2, 3)
grid[0][1] = 9.0
print(grid)`,
          solutionCode: `def zeros_2d(rows, cols):
    return [[0.0 for _ in range(cols)] for _ in range(rows)]

grid = zeros_2d(2, 3)
grid[0][1] = 9.0
print(grid)`,
          testCases: [
            {
              id: 'tc1',
              label: 'Mutating row 0 does not alias row 1',
              setup: '',
              expected: '[[0.0, 9.0, 0.0], [0.0, 0.0, 0.0]]',
              hidden: false,
            },
          ],
          hints: [
            'Use a nested list comprehension: `[[0.0 for _ in range(cols)] for _ in range(rows)]`.',
            'Never use `[[0.0] * cols] * rows` because it aliases every row!',
          ],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day24-sub4',
      number: 4,
      title: 'Shape, ndim, size, reshape() & Flattening',
      summary: 'Transform array dimensions with zero-copy views and infer unknown axes with -1.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Reshaping Without Copying Memory',
        paragraphs: [
          'Every `ndarray` exposes three core structural attributes: **`shape`** (a tuple of lengths per axis, e.g., `(2, 3)`), **`ndim`** (number of axes, equal to `len(shape)`), and **`size`** (total element count, equal to the product of `shape`).',
          'Calling **`arr.reshape(new_shape)`** reorganizes how those elements are indexed without changing `size`. You can pass **`-1`** for one dimension (e.g., `arr.reshape(3, -1)`), and NumPy automatically computes the missing length (`size // 3`).',
          'To collapse a multidimensional array back to 1D, use **`ravel()`** (returns a zero-copy view when possible) or **`flatten()`** (always returns a safe independent copy).',
        ],
        keyTerms: [
          {
            term: 'reshape(r, -1)',
            definition: 'Changes logical dimensions while preserving total element count; -1 auto-infers one axis.',
          },
          {
            term: 'ravel() vs. flatten()',
            definition: 'ravel() prefers a zero-copy view; flatten() always allocates an independent 1D copy.',
          },
        ],
        bulletPoints: [
          'The product of the target `reshape` dimensions must equal `arr.size`, or NumPy raises `ValueError`.',
          'A 1D array of shape `(6,)` is different from a 2D column vector `(6, 1)` or row vector `(1, 6)`.',
        ],
      },
      visualise: {
        type: 'ndarray-shape-sim',
        title: 'Reshape & Zero-Copy View Inspector',
        badge: 'simulation',
        description: 'Switch between 1D (4,), 2D (2, 3), and 3D (2, 2, 2) shapes over the same flat buffer.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Reshaping a Flat Sequence into 2D Rows',
          runMode: 'real',
          code: `def reshape_2d(flat, rows, cols):
    if cols == -1:
        cols = len(flat) // rows
    if rows * cols != len(flat):
        raise ValueError("Incompatible reshape dimensions")
    return [flat[r * cols:(r + 1) * cols] for r in range(rows)]

mat = reshape_2d([1, 2, 3, 4, 5, 6], 2, -1)
print("Shape:", (len(mat), len(mat[0])))
print("Matrix:", mat)`,
          expectedOutput: `Shape: (2, 3)
Matrix: [[1, 2, 3], [4, 5, 6]]`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'cols = len(flat) // rows',
          internalEffect: 'Mimics NumPy -1 dimension inference: 6 // 2 = 3 columns.',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 'flat[r * cols:(r + 1) * cols]',
          internalEffect: 'Slices contiguous chunks of length 3 for each row.',
        },
      ],
      apply: {
        domain: 'Image Processing',
        contextTitle: 'Flattening a 2D Pixel Grid for Feature Extraction',
        scenario: 'Flatten a 2x3 grayscale patch into a 1D feature vector.',
        code: `patch = [[120, 140, 160], [200, 210, 220]]
flat = [px for row in patch for px in row]
print("1D vector:", flat, "size:", len(flat))`,
        outcome: '1D vector: [120, 140, 160, 200, 210, 220] size: 6',
      },
      commonMistakes: [
        {
          label: 'Reshaping to an Incompatible Element Count',
          erroneousCode: `# np.arange(6).reshape(2, 4)  # ValueError: cannot reshape array of size 6 into shape (2,4)`,
          errorMessage: 'ValueError because 2 * 4 = 8 != 6',
          explanation: 'Ensure the product of all target dimensions equals `arr.size`.',
          correctedCode: `# np.arange(6).reshape(2, 3)`,
        },
      ],
      sourceNotes: 'Covers shape, ndim, size, and reshape(-1) for Day 24.',
      practise: [
        {
          id: 'd24-ex11',
          title: 'Inferring -1 in reshape()',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'If a 1D array has `size = 12`, what is the resulting shape of `arr.reshape(3, -1)`?',
          contextScenario: 'Reshaping a 12-month sales vector into quarterly rows.',
          starterCode: `size = 12
rows = 3
cols = size // rows
print((rows, cols))`,
          options: [
            {
              id: 'a',
              text: '(3, 4)',
              explanation: 'Correct! NumPy computes `12 // 3 = 4`, producing shape `(3, 4)`.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: '(3, -1)',
              explanation: '`-1` is replaced by the inferred positive integer `4`.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '(4, 3)',
              explanation: 'Rows is `3`, so shape is `(3, 4)`.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: '(3, 12)',
              explanation: '`3 * 12 = 36 != 12`.',
              isCorrect: false,
            },
          ],
          hints: [
            'Divide total `size` (12) by the known axis (3).',
          ],
          points: 10,
        },
        {
          id: 'd24-ex12',
          title: 'Order Reshape & Metadata Inspection',
          type: 'order-the-lines',
          tier: 'standard',
          prompt: 'Order the lines to reshape a 6-element list into `(2, 3)` and print its shape.',
          contextScenario: 'Validating matrix dimensions before a linear algebra step.',
          jumbledLines: [
            { id: 'l3', code: 'mat = [flat[r * cols:(r + 1) * cols] for r in range(rows)]', indent: 0 },
            { id: 'l1', code: 'flat = [1, 2, 3, 4, 5, 6]', indent: 0 },
            { id: 'l4', code: 'print((len(mat), len(mat[0])))', indent: 0 },
            { id: 'l2', code: 'rows, cols = 2, len(flat) // 2', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: [
            'Define `flat` first, then compute `rows, cols`.',
            'Build `mat` before printing its `(rows, cols)` shape.',
          ],
          points: 15,
        },
        {
          id: 'd24-ex13',
          title: 'ravel() Zero-Copy View vs. flatten() Copy',
          type: 'theory-reasoning',
          tier: 'challenge',
          prompt: 'Explain the memory and mutation difference between `arr.ravel()` and `arr.flatten()` when collapsing a 2D NumPy array to 1D.',
          contextScenario: 'A developer modifies `flat = arr.ravel(); flat[0] = 999` and is surprised that `arr[0, 0]` also changed.',
          modelAnswer: '`ravel()` returns a 1D view of the original array whenever the memory layout allows it, avoiding allocation and sharing the underlying buffer—so mutating `ravel()` mutates `arr`. `flatten()` always allocates and returns an independent 1D copy, so mutating it never affects `arr`.',
          markingCriteria: [
            { id: 'c1', label: 'Identifies ravel() as returning a zero-copy view when possible', points: 10 },
            { id: 'c2', label: 'Identifies flatten() as always returning an independent copy', points: 10 },
          ],
          hints: [
            'Which one shares memory with `arr`?',
            'Which one guarantees safety against accidental parent mutation?',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day24-sub5',
      number: 5,
      title: 'Multidimensional Slicing, Views vs. Copies & Boolean Masking',
      summary: 'Index 2D matrices with [row, col], avoid view mutation bugs, and filter with boolean masks.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Precision Subsetting in 2D & Beyond',
        paragraphs: [
          'In NumPy, 2D indexing uses a single pair of brackets with comma-separated slices: **`arr[row_slice, col_slice]`**. For example, `arr[:, 1:]` selects all rows and columns from index `1` onward.',
          'Crucially, **basic slicing returns a view** (sharing memory with the original array), whereas **boolean masking** (`arr[arr > 50]`) returns a **new 1D copy** containing only the elements where the condition is `True`.',
          'If you need to modify a slice without altering the parent array, explicitly call **`.copy()`** (`sub = arr[:, 1:].copy()`).',
        ],
        keyTerms: [
          {
            term: 'Slice View',
            definition: 'A window into the parent array’s buffer; writing to a slice mutates the parent.',
          },
          {
            term: 'Boolean Mask',
            definition: 'A boolean array of matching shape used to filter elements (e.g., scores[scores >= 80]).',
          },
        ],
        bulletPoints: [
          'Combine boolean masks using bitwise `&` (and), `|` (or), and `~` (not) with parentheses: `(arr > 10) & (arr < 50)`.',
          'Never use Python `and`/`or` on NumPy boolean arrays—they raise `ValueError: The truth value of an array is ambiguous`.',
        ],
      },
      visualise: {
        type: 'ndarray-shape-sim',
        title: '2D Slice View vs. Parent Buffer Inspector',
        badge: 'simulation',
        description: 'Select `2D Slice arr[:, 1:]` to see how a slice maps onto the parent contiguous buffer.',
        initialConfig: {},
      },
      code: [
        {
          title: '2D Slicing & Boolean Mask Filtering',
          runMode: 'real',
          code: `matrix = [
    [10, 25, 30],
    [45, 60, 75],
]

# Equivalent of matrix[:, 1:]
right_cols = [row[1:] for row in matrix]
# Equivalent of boolean mask (val > 25) & (val < 70)
filtered = [v for row in matrix for v in row if 25 < v < 70]

print("Slice [:, 1:]:", right_cols)
print("Masked (25 < v < 70):", filtered)`,
          expectedOutput: `Slice [:, 1:]: [[25, 30], [60, 75]]
Masked (25 < v < 70): [30, 45, 60]`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 7,
          instruction: '[row[1:] for row in matrix]',
          internalEffect: 'Selects columns 1 and 2 across every row, matching NumPy’s matrix[:, 1:].',
        },
        {
          step: 2,
          codeLine: 9,
          instruction: '25 < v < 70',
          internalEffect: 'Filters matching elements into a flat 1D result list.',
        },
      ],
      apply: {
        domain: 'Sensor Filtering',
        contextTitle: 'Clamping Out-of-Range Readings',
        scenario: 'Filter valid temperatures between 0°C and 40°C.',
        code: `readings = [-5, 18, 22, 45, 31]
valid = [t for t in readings if 0 <= t <= 40]
print("Valid readings:", valid)`,
        outcome: 'Valid readings: [18, 22, 31]',
      },
      commonMistakes: [
        {
          label: 'Using Python `and` Instead of `&` in NumPy Masks',
          erroneousCode: `# arr[(arr > 10) and (arr < 50)]  # ValueError: truth value is ambiguous`,
          errorMessage: 'ValueError because Python `and` tries to coerce an entire array to a single bool',
          explanation: 'Use element-wise `&` with parentheses around each comparison.',
          correctedCode: `# arr[(arr > 10) & (arr < 50)]`,
        },
      ],
      sourceNotes: 'Covers 2D slicing, views vs copies, and boolean masking for Day 24.',
      practise: [
        {
          id: 'd24-ex14',
          title: '2D Slice View Mutation Trap',
          type: 'explain-the-trace',
          tier: 'challenge',
          prompt: 'Explain why setting `sub[0, 0] = -1` after `sub = arr[:, 1:]` modifies `arr[0, 1]` in NumPy, and how `.copy()` prevents it.',
          contextScenario: 'Debugging an unexpected mutation in an image-cropping pipeline.',
          traceStepCode: `# arr = np.array([[1, 2, 3], [4, 5, 6]])
# sub = arr[:, 1:]
# sub[0, 0] = -1
# arr[0, 1] is now -1!`,
          traceQuestion: 'Why did mutating `sub` alter `arr`?',
          modelAnswer: 'In NumPy, basic slicing (`arr[:, 1:]`) creates a view that points to the exact same underlying data buffer as `arr` using adjusted offset and strides. Writing to `sub[0, 0]` writes directly to `arr[0, 1]`. Calling `sub = arr[:, 1:].copy()` allocates a separate buffer so `arr` stays untouched.',
          markingCriteria: [
            { id: 'c1', label: 'Explains basic slicing returns a shared-memory view', points: 10 },
            { id: 'c2', label: 'Identifies .copy() as the fix to decouple buffers', points: 10 },
          ],
          hints: [
            'Does `arr[:, 1:]` copy data in NumPy?',
            'What method forces an independent buffer?',
          ],
          points: 20,
        },
        {
          id: 'd24-ex15',
          title: 'Fix Boolean Mask Filtering Logic',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'Fix `filter_band(nums, low, high)` so it keeps values strictly between `low` and `high` (`low < x < high`).',
          contextScenario: 'Filtering valid acoustic frequencies between 20 Hz and 20,000 Hz.',
          starterCode: `def filter_band(nums, low, high):
    return [x for x in nums if x > low or x < high]

print(filter_band([10, 50, 500, 25000], 20, 20000))`,
          solutionCode: `def filter_band(nums, low, high):
    return [x for x in nums if low < x < high]

print(filter_band([10, 50, 500, 25000], 20, 20000))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Keeps only 50 and 500',
              setup: '',
              expected: '[50, 500]',
              hidden: false,
            },
          ],
          hints: [
            '`x > low or x < high` is True for almost every number!',
            'Use `and` (or chained `low < x < high`).',
          ],
          points: 15,
        },
        {
          id: 'd24-ex16',
          title: 'Extract 2D Submatrix Slice',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Implement `slice_2d(mat, r_start, r_end, c_start, c_end)` equivalent to NumPy `mat[r_start:r_end, c_start:c_end]`.',
          contextScenario: 'Cropping a region of interest from a 2D grid.',
          starterCode: `def slice_2d(mat, r_start, r_end, c_start, c_end):
    # TODO: slice rows then columns
    pass

grid = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
print(slice_2d(grid, 0, 2, 1, 3))`,
          solutionCode: `def slice_2d(mat, r_start, r_end, c_start, c_end):
    return [row[c_start:c_end] for row in mat[r_start:r_end]]

grid = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
print(slice_2d(grid, 0, 2, 1, 3))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Returns [[2, 3], [6, 7]]',
              setup: '',
              expected: '[[2, 3], [6, 7]]',
              hidden: false,
            },
          ],
          hints: [
            'First slice rows with `mat[r_start:r_end]`.',
            'Then slice each row with `row[c_start:c_end]`.',
          ],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day24-sub6',
      number: 6,
      title: 'Vectorised Operations & UFuncs vs. Python Loops',
      summary: 'Apply element-wise arithmetic and universal functions across entire arrays without explicit loops.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Think in Whole Arrays, Not Individual Elements',
        paragraphs: [
          'In standard Python, scaling a list of numbers requires a `for` loop or list comprehension. In NumPy, arithmetic operators (`+`, `-`, `*`, `/`, `**`) and universal functions (**ufuncs** like `np.sqrt`, `np.exp`, `np.log`) are **vectorised**: `prices * 1.15` multiplies every element in compiled C code.',
          'Vectorised code is both **dramatically faster** (no Python interpreter loop overhead per element) and **cleaner to read** (e.g., Z-score normalization `(arr - arr.mean()) / arr.std()`).',
        ],
        keyTerms: [
          {
            term: 'Vectorisation',
            definition: 'Executing element-wise operations over whole arrays in compiled C loops instead of Python for-loops.',
          },
          {
            term: 'UFunc (Universal Function)',
            definition: 'A NumPy function (e.g., np.sqrt, np.abs, np.clip) that operates element-by-element on ndarrays.',
          },
        ],
        bulletPoints: [
          'Watch out for `std == 0` when normalizing constant arrays to avoid `ZeroDivisionError` / `NaN`.',
          'In NumPy, `a * b` is element-wise multiplication, NOT matrix multiplication (`a @ b`).',
        ],
      },
      visualise: {
        type: 'vectorised-stats-sim',
        title: 'Vectorised Z-Score Normalization Lab',
        badge: 'simulation',
        description: 'Inspect how (x - mean) / std transforms raw arrays element-wise.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Vectorised Z-Score Normalization Helper',
          runMode: 'real',
          code: `import statistics

def z_normalize(vals):
    mu = statistics.mean(vals)
    sd = statistics.pstdev(vals)
    if sd == 0:
        return [0.0 for _ in vals]
    return [round((x - mu) / sd, 2) for x in vals]

print("Normalized:", z_normalize([70, 75, 80, 85, 90]))`,
          expectedOutput: 'Normalized: [-1.41, -0.71, 0.0, 0.71, 1.41]',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 6,
          instruction: 'if sd == 0: return [0.0 for _ in vals]',
          internalEffect: 'Guards against division by zero on constant-valued arrays.',
        },
        {
          step: 2,
          codeLine: 8,
          instruction: '(x - mu) / sd',
          internalEffect: 'Centers values at 0.0 and scales spread to unit standard deviation.',
        },
      ],
      apply: {
        domain: 'E-Commerce Pricing',
        contextTitle: 'Applying Element-Wise Tax & Rounding',
        scenario: 'Apply an 8% tax rate across a price vector.',
        code: `prices = [10.0, 25.0, 50.0]
taxed = [round(p * 1.08, 2) for p in prices]
print("With 8% tax:", taxed)`,
        outcome: 'With 8% tax: [10.8, 27.0, 54.0]',
      },
      commonMistakes: [
        {
          label: 'Using * Expecting Matrix Multiplication',
          erroneousCode: `# A * B  # Performs element-wise Hadamard product, not matrix product!`,
          errorMessage: 'Wrong mathematical result or broadcast shape error',
          explanation: 'Use `@` (or `np.matmul`) for matrix multiplication and `*` for element-wise multiplication.',
          correctedCode: `# A @ B`,
        },
      ],
      sourceNotes: 'Covers vectorised operations and ufuncs for Day 24.',
      practise: [
        {
          id: 'd24-ex17',
          title: 'Complete Safe Z-Score Normalization',
          type: 'fill-the-gaps',
          tier: 'standard',
          prompt: 'Fill in the gaps so `z_score(vals)` guards against zero standard deviation.',
          contextScenario: 'Normalizing ML feature columns before training.',
          gaps: [
            {
              id: 'g1',
              beforeText: 'if sd == ',
              afterText: ':\n    return [0.0 for _ in vals]\n',
              correctAnswer: '0',
              options: ['0', '1', '-1', 'None'],
            },
            {
              id: 'g2',
              beforeText: 'return [round((x - mu) / ',
              afterText: ', 2) for x in vals]',
              correctAnswer: 'sd',
              options: ['sd', 'mu', 'len(vals)', 'max(vals)'],
            },
          ],
          hints: [
            'Division by zero occurs when `sd == 0`.',
            'Z-score divides `(x - mu)` by `sd`.',
          ],
          points: 15,
        },
        {
          id: 'd24-ex18',
          title: 'Element-Wise * vs. Matrix @ in NumPy',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'In NumPy, what does `A * B` compute for two `(2, 2)` matrices `A` and `B`?',
          contextScenario: 'Reviewing a linear algebra PR where a teammate wrote `A * B`.',
          options: [
            {
              id: 'a',
              text: 'Element-wise (Hadamard) multiplication, NOT matrix multiplication (`A @ B`).',
              explanation: 'Correct! `*` multiplies corresponding cells; `@` (or `np.matmul`) performs matrix multiplication.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'Matrix multiplication identical to `A @ B`.',
              explanation: '`*` is element-wise on `ndarray`s.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'The scalar dot product.',
              explanation: '`np.dot` on 2D matrices is matmul, whereas `*` is element-wise.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'A `TypeError` because `*` only works on scalars.',
              explanation: '`*` is overloaded for element-wise array multiplication.',
              isCorrect: false,
            },
          ],
          hints: [
            'How does NumPy overload `+`, `-`, `*`, `/`?',
            'Which operator is dedicated to matrix multiplication since Python 3.5?',
          ],
          points: 10,
        },
        {
          id: 'd24-ex19',
          title: 'Vectorised Min-Max Scaling [0, 1]',
          type: 'write-code',
          tier: 'project',
          prompt: 'Implement `min_max_scale(vals)` scaling values into `[0.0, 1.0]` via `(x - min_v) / (max_v - min_v)`, returning `[0.0, ...]` if `max_v == min_v`.',
          contextScenario: 'Normalizing pixel intensities or sensor ranges into `[0.0, 1.0]`.',
          starterCode: `def min_max_scale(vals):
    # TODO: handle constant array edge case and scale to [0.0, 1.0]
    pass

print(min_max_scale([10, 20, 30, 50]))
print(min_max_scale([5, 5, 5]))`,
          solutionCode: `def min_max_scale(vals):
    lo, hi = min(vals), max(vals)
    span = hi - lo
    if span == 0:
        return [0.0 for _ in vals]
    return [round((x - lo) / span, 2) for x in vals]

print(min_max_scale([10, 20, 30, 50]))
print(min_max_scale([5, 5, 5]))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Scales [10,20,30,50] and handles constant [5,5,5]',
              setup: '',
              expected: '[0.0, 0.25, 0.5, 1.0]\n[0.0, 0.0, 0.0]',
              hidden: false,
            },
          ],
          hints: [
            'Compute `lo = min(vals)` and `hi = max(vals)`.',
            'If `hi - lo == 0`, return `[0.0 for _ in vals]`.',
          ],
          points: 25,
        },
      ],
      assess: [],
    },
    {
      id: 'day24-sub7',
      number: 7,
      title: 'Broadcasting Rules Across Compatible Shapes',
      summary: 'Align arrays of different shapes right-to-left without duplicating memory.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'How NumPy Aligns Differing Shapes',
        paragraphs: [
          '**Broadcasting** lets NumPy perform arithmetic on arrays of different shapes without copying data. NumPy compares shapes **from right to left** (trailing dimension first).',
          'Two dimensions are **compatible** if: (1) they are **equal**, or (2) **one of them is `1`** (which stretches virtually to match the other). If one array has fewer dimensions, NumPy pads its shape with `1`s on the **left**.',
          'For example, adding a `(2, 3)` matrix and a `(3,)` row vector pads `(3,)` to `(1, 3)`, then stretches the `1` to `2` so the row vector is added to every row. Adding `(2, 3)` and `(2,)` fails because trailing `3 != 2`—you must reshape `(2,)` to `(2, 1)` first!',
        ],
        keyTerms: [
          {
            term: 'Right-to-Left Alignment',
            definition: 'Broadcasting compares trailing dimensions first and pads missing leading axes with 1.',
          },
          {
            term: 'Broadcastable Dimension',
            definition: 'Pair of axis sizes that are either identical (d1 == d2) or where at least one equals 1.',
          },
        ],
        bulletPoints: [
          '`(2, 3) + (1, 3)` -> valid -> `(2, 3)` (row broadcast).',
          '`(2, 3) + (2, 1)` -> valid -> `(2, 3)` (column broadcast).',
          '`(2, 3) + (2,)` -> `ValueError` because trailing `3 != 2`!',
        ],
      },
      visualise: {
        type: 'broadcasting-axis-sim',
        title: 'Broadcasting Alignment & Axis Reduction Lab',
        badge: 'simulation',
        description: 'Step through scalar, row (1, 3), and column (2, 1) broadcasting onto a (2, 3) matrix.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Implementing NumPy’s Broadcast Shape Validator',
          runMode: 'real',
          code: `def broadcast_shape(shape_a, shape_b):
    max_len = max(len(shape_a), len(shape_b))
    a = (1,) * (max_len - len(shape_a)) + shape_a
    b = (1,) * (max_len - len(shape_b)) + shape_b
    out = []
    for da, db in zip(a, b):
        if da != db and da != 1 and db != 1:
            raise ValueError(f"Incompatible shapes {shape_a} and {shape_b}")
        out.append(max(da, db))
    return tuple(out)

print("(2, 3) + (3,):", broadcast_shape((2, 3), (3,)))
print("(2, 3) + (2, 1):", broadcast_shape((2, 3), (2, 1)))`,
          expectedOutput: `(2, 3) + (3,): (2, 3)
(2, 3) + (2, 1): (2, 3)`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: '(1,) * (max_len - len(shape_a)) + shape_a',
          internalEffect: 'Left-pads the shorter shape tuple with 1s so both have equal length.',
        },
        {
          step: 2,
          codeLine: 7,
          instruction: 'if da != db and da != 1 and db != 1:',
          internalEffect: 'Raises ValueError if neither dimension matches nor equals 1.',
        },
      ],
      apply: {
        domain: 'Feature Scaling',
        contextTitle: 'Centering Columns by Subtracting Column Means',
        scenario: 'Subtract a `(3,)` column-mean vector from every row of a `(2, 3)` matrix.',
        code: `matrix = [[10, 20, 30], [14, 26, 36]]
col_means = [12, 23, 33]
centered = [[val - m for val, m in zip(row, col_means)] for row in matrix]
print("Centered:", centered)`,
        outcome: 'Centered: [[-2, -3, -3], [2, 3, 3]]',
      },
      commonMistakes: [
        {
          label: 'Subtracting a (2,) Vector Directly from a (2, 3) Matrix',
          erroneousCode: `# mat_2x3 - vec_2  # ValueError: operands could not be broadcast together with shapes (2,3) (2,)`,
          errorMessage: 'Trailing dimensions 3 and 2 do not match and neither is 1',
          explanation: 'Reshape the `(2,)` vector to a column vector `(2, 1)` using `vec[:, None]` or `.reshape(-1, 1)`.',
          correctedCode: `# mat_2x3 - vec_2.reshape(2, 1)`,
        },
      ],
      sourceNotes: 'Covers NumPy broadcasting rules for Day 24.',
      practise: [
        {
          id: 'd24-ex20',
          title: 'Checking Broadcast Compatibility',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Which pair of shapes CANNOT be broadcast together in NumPy without reshaping?',
          contextScenario: 'Validating tensor shapes before an element-wise addition.',
          options: [
            {
              id: 'a',
              text: '`(2, 3)` and `(2,)`',
              explanation: 'Correct! Right-aligning gives `(2, 3)` and `(1, 2)`. Trailing `3 != 2` and neither is `1`, so NumPy raises `ValueError`.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: '`(2, 3)` and `(3,)`',
              explanation: '`(3,)` pads to `(1, 3)`, which broadcasts cleanly with `(2, 3)`.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '`(2, 3)` and `(2, 1)`',
              explanation: 'Dimension `1` stretches to `3`.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: '`(2, 3)` and `()` (scalar)',
              explanation: 'Scalars broadcast to any shape.',
              isCorrect: false,
            },
          ],
          hints: [
            'Align shapes from the RIGHT (trailing axis first).',
            'Which pair has `3` aligned with `2`?',
          ],
          points: 10,
        },
        {
          id: 'd24-ex21',
          title: 'Trace Broadcast Shape Result',
          type: 'predict-output',
          tier: 'standard',
          prompt: 'What resulting shape does `broadcast_shape((4, 1, 3), (1, 5, 3))` return?',
          contextScenario: 'Combining a batch of column vectors with a batch of row vectors.',
          starterCode: `a = (4, 1, 3)
b = (1, 5, 3)
res = tuple(max(x, y) for x, y in zip(a, b))
print(res)`,
          options: [
            {
              id: 'a',
              text: '(4, 5, 3)',
              explanation: 'Correct! Each axis takes `max(da, db)`: `(max(4,1), max(1,5), max(3,3)) = (4, 5, 3)`.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: '(4, 1, 3)',
              explanation: 'Axis 1 stretches from `1` to `5`.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '(1, 5, 3)',
              explanation: 'Axis 0 stretches from `1` to `4`.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'ValueError',
              explanation: 'Every axis pair is either equal or has a `1`, so broadcasting succeeds.',
              isCorrect: false,
            },
          ],
          hints: [
            'Compare each axis pair: `(4, 1)`, `(1, 5)`, `(3, 3)`.',
          ],
          points: 15,
        },
        {
          id: 'd24-ex22',
          title: 'Order Broadcast Shape Validator',
          type: 'order-the-lines',
          tier: 'standard',
          prompt: 'Order the lines to pad the shorter shape on the left and validate trailing dimensions.',
          contextScenario: 'Implementing a shape-checking utility.',
          jumbledLines: [
            { id: 'l3', code: 'if da != db and da != 1 and db != 1: raise ValueError("Mismatch")', indent: 1 },
            { id: 'l1', code: 'a = (1,) * (max_len - len(sa)) + sa', indent: 0 },
            { id: 'l4', code: 'out.append(max(da, db))', indent: 1 },
            { id: 'l2', code: 'for da, db in zip(a, b):', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: [
            'Pad `sa` first before looping with `zip(a, b)`.',
            'Validate compatibility before appending `max(da, db)`.',
          ],
          points: 15,
        },
        {
          id: 'd24-ex23',
          title: 'Subtract Column Means Across a 2D Matrix',
          type: 'write-code',
          tier: 'project',
          prompt: 'Implement `center_columns(mat)` that computes each column’s mean and subtracts it from every row (matching `mat - mat.mean(axis=0)`).',
          contextScenario: 'Zero-centering feature columns prior to Principal Component Analysis (PCA).',
          starterCode: `def center_columns(mat):
    # TODO: compute column means and subtract from each row
    pass

data = [[10, 20], [20, 40], [30, 60]]
print(center_columns(data))`,
          solutionCode: `def center_columns(mat):
    n_rows = len(mat)
    n_cols = len(mat[0])
    col_means = [sum(mat[r][c] for r in range(n_rows)) / n_rows for c in range(n_cols)]
    return [[round(val - m, 2) for val, m in zip(row, col_means)] for row in mat]

data = [[10, 20], [20, 40], [30, 60]]
print(center_columns(data))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Zero-centers both columns',
              setup: '',
              expected: '[[-10.0, -20.0], [0.0, 0.0], [10.0, 20.0]]',
              hidden: false,
            },
          ],
          hints: [
            'Compute `col_means` across `r in range(len(mat))` for each column `c`.',
            'Subtract `col_means` from each row using `zip(row, col_means)`.',
          ],
          points: 25,
        },
      ],
      assess: [],
    },
    {
      id: 'day24-sub8',
      number: 8,
      title: 'Axis-Aware Aggregations (axis=0 vs. axis=1)',
      summary: 'Collapse rows or columns intentionally using axis parameters in sum, mean, min, and max.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Which Axis Disappears?',
        paragraphs: [
          'Beginners often confuse `axis=0` and `axis=1`. The clearest mental rule is: **the `axis` you specify is the axis that gets collapsed (summed away)**.',
          'In a 2D `(rows, cols)` matrix: **`axis=0`** collapses the **rows** (moving vertically down each column), returning one result per **column** of shape `(cols,)`. **`axis=1`** collapses the **columns** (moving horizontally across each row), returning one result per **row** of shape `(rows,)`.',
          'Pass **`keepdims=True`** in NumPy when you want `(rows, 1)` instead of `(rows,)` so you can broadcast the row totals right back against the original matrix!',
        ],
        keyTerms: [
          {
            term: 'axis=0',
            definition: 'Collapses axis 0 (rows), producing column-wise aggregates of shape (cols,).',
          },
          {
            term: 'axis=1',
            definition: 'Collapses axis 1 (columns), producing row-wise aggregates of shape (rows,).',
          },
        ],
        bulletPoints: [
          '`arr.sum()` with no `axis` collapses all dimensions to a single scalar.',
          '`keepdims=True` preserves `(2, 1)` or `(1, 3)` for immediate broadcasting.',
        ],
      },
      visualise: {
        type: 'broadcasting-axis-sim',
        title: 'axis=0 (Column) vs axis=1 (Row) Aggregations',
        badge: 'simulation',
        description: 'Toggle `sum(axis=0)` and `sum(axis=1)` to observe which dimension collapses.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Computing axis=0 and axis=1 Sums on a 2D Matrix',
          runMode: 'real',
          code: `matrix = [
    [1, 2, 3],
    [4, 5, 6],
]

sum_axis0 = [sum(matrix[r][c] for r in range(len(matrix))) for c in range(len(matrix[0]))]
sum_axis1 = [sum(row) for row in matrix]

print("axis=0 (col totals):", sum_axis0)
print("axis=1 (row totals):", sum_axis1)`,
          expectedOutput: `axis=0 (col totals): [5, 7, 9]
axis=1 (row totals): [6, 15]`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 6,
          instruction: 'sum(matrix[r][c] for r in range(...))',
          internalEffect: 'Collapses row index r for each column c -> [1+4, 2+5, 3+6] = [5, 7, 9].',
        },
        {
          step: 2,
          codeLine: 7,
          instruction: '[sum(row) for row in matrix]',
          internalEffect: 'Collapses columns within each row -> [1+2+3, 4+5+6] = [6, 15].',
        },
      ],
      apply: {
        domain: 'Gradebook Analytics',
        contextTitle: 'Per-Student vs. Per-Exam Averages',
        scenario: 'Rows are students, columns are exams; compute exam averages (`axis=0`) and student averages (`axis=1`).',
        code: `grades = [[80, 90], [70, 80], [90, 100]]
exam_avgs = [sum(grades[r][c] for r in range(3)) / 3 for c in range(2)]
student_avgs = [sum(row) / 2 for row in grades]
print("Exam avgs (axis=0):", exam_avgs)
print("Student avgs (axis=1):", student_avgs)`,
        outcome: `Exam avgs (axis=0): [80.0, 90.0]
Student avgs (axis=1): [85.0, 75.0, 95.0]`,
      },
      commonMistakes: [
        {
          label: 'Swapping axis=0 and axis=1',
          erroneousCode: `# Dividing a (3, 2) matrix by arr.sum(axis=1) without keepdims=True`,
          errorMessage: 'Row-sum shape (3,) fails to broadcast against (3, 2)',
          explanation: 'Use `arr.sum(axis=1, keepdims=True)` so the shape is `(3, 1)` and broadcasts cleanly across columns.',
          correctedCode: `# arr / arr.sum(axis=1, keepdims=True)`,
        },
      ],
      sourceNotes: 'Covers axis=0 and axis=1 aggregations for Day 24.',
      practise: [
        {
          id: 'd24-ex24',
          title: 'axis=0 vs. axis=1 Collapse Direction',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Given a `(4, 3)` matrix of 4 stores (rows) and 3 months (columns), what does `sales.sum(axis=1)` return?',
          contextScenario: 'Computing quarterly revenue per store.',
          options: [
            {
              id: 'a',
              text: 'A 1D array of shape `(4,)` containing the total 3-month revenue for each of the 4 stores.',
              explanation: 'Correct! `axis=1` collapses the 3 columns across each row, leaving 4 store totals.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'A 1D array of shape `(3,)` containing monthly totals across all stores.',
              explanation: 'Monthly totals across rows would use `axis=0`.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'A single scalar total across all 12 cells.',
              explanation: 'Calling `.sum()` with no `axis` returns a single scalar.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'A `(3, 4)` transposed matrix.',
              explanation: '`.sum(axis=1)` reduces dimension count, it does not transpose.',
              isCorrect: false,
            },
          ],
          hints: [
            'Which axis is collapsed when `axis=1`?',
            'Collapsing columns (3) leaves the rows (4).',
          ],
          points: 10,
        },
        {
          id: 'd24-ex25',
          title: 'Fix Row vs. Column Aggregation Bug',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'Fix `col_totals(mat)` so it sums down each column (`axis=0`) instead of across each row (`axis=1`).',
          contextScenario: 'A reporting script accidentally sums each student’s grades instead of each exam’s total.',
          starterCode: `def col_totals(mat):
    return [sum(row) for row in mat]

print(col_totals([[1, 2, 3], [4, 5, 6]]))`,
          solutionCode: `def col_totals(mat):
    return [sum(mat[r][c] for r in range(len(mat))) for c in range(len(mat[0]))]

print(col_totals([[1, 2, 3], [4, 5, 6]]))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Returns column sums [5, 7, 9]',
              setup: '',
              expected: '[5, 7, 9]',
              hidden: false,
            },
          ],
          hints: [
            'Iterate over column index `c in range(len(mat[0]))`.',
            'Sum `mat[r][c]` across all row indices `r`.',
          ],
          points: 15,
        },
        {
          id: 'd24-ex26',
          title: 'Why keepdims=True Enables Row Normalization',
          type: 'explain-the-trace',
          tier: 'challenge',
          prompt: 'Explain why `probs = counts / counts.sum(axis=1)` fails for a `(3, 2)` matrix, and how `keepdims=True` fixes it.',
          contextScenario: 'Converting a `(3, 2)` matrix of event counts into per-row probabilities.',
          traceStepCode: `# counts.shape == (3, 2)
# counts.sum(axis=1).shape == (3,)       -> ValueError! (3, 2) vs (3,)
# counts.sum(axis=1, keepdims=True).shape == (3, 1) -> Broadcasts cleanly!`,
          traceQuestion: 'Why does `(3, 2) / (3,)` fail while `(3, 2) / (3, 1)` succeeds?',
          modelAnswer: '`counts.sum(axis=1)` collapses axis 1, producing a 1D array of shape `(3,)`. Right-aligning `(3, 2)` with `(3,)` compares `2` against `3`, raising ValueError. Passing `keepdims=True` retains the collapsed axis as size `1`, giving `(3, 1)`, which broadcasts across both columns.',
          markingCriteria: [
            { id: 'c1', label: 'Explains (3,) right-aligns to (1, 3) and clashes with (3, 2)', points: 10 },
            { id: 'c2', label: 'Explains keepdims=True yields (3, 1) which broadcasts across axis 1', points: 10 },
          ],
          hints: [
            'Right-align `(3, 2)` with `(3,)`.',
            'What shape does `keepdims=True` preserve?',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day24-sub9',
      number: 9,
      title: 'Dot Product, Matrix Multiplication (@) & Seeded Randomness',
      summary: 'Compute inner products, matrix products, and reproducible random simulations.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Linear Algebra Foundations & Reproducible RNG',
        paragraphs: [
          'The **dot product** of two equal-length vectors `a` and `b` multiplies corresponding pairs and sums the results: `sum(x * y for x, y in zip(a, b))`. It powers weighted averages, cosine similarity, and neural network layers.',
          'For 2D matrices `A` of shape `(m, k)` and `B` of shape `(k, n)`, **matrix multiplication (`A @ B`)** requires the inner dimensions to match (`k == k`) and produces shape `(m, n)`.',
          'For Monte Carlo simulations and train/test splits, always use a **seeded** random generator (`np.random.default_rng(seed)` in modern NumPy, or `random.Random(seed)` in stdlib) so experiments are reproducible.',
        ],
        keyTerms: [
          {
            term: 'Dot Product (A @ B)',
            definition: 'Sum of element-wise products; requires matching inner dimensions (m, k) @ (k, n) -> (m, n).',
          },
          {
            term: 'default_rng(seed)',
            definition: 'Modern NumPy isolated random generator instance for reproducible sampling.',
          },
        ],
        bulletPoints: [
          'Check inner dimensions before multiplying: `(2, 3) @ (3, 4)` -> `(2, 4)`, whereas `(2, 3) @ (2, 3)` raises `ValueError`.',
          'Prefer `np.random.default_rng(42)` over legacy global `np.random.seed(42)`.',
        ],
      },
      visualise: {
        type: 'vectorised-stats-sim',
        title: 'Vectorised Metrics & Seeded Sampling Lab',
        badge: 'simulation',
        description: 'Inspect summary statistics and normalized feature vectors.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Dot Product & 2x2 Matrix Multiplication in Python',
          runMode: 'real',
          code: `def dot(u, v):
    return sum(a * b for a, b in zip(u, v))

def matmul(A, B):
    cols_b = list(zip(*B))
    return [[dot(row_a, col_b) for col_b in cols_b] for row_a in A]

print("Dot:", dot([2, 3, 4], [10, 20, 30]))
A = [[1, 2], [3, 4]]
B = [[5, 6], [7, 8]]
print("A @ B:", matmul(A, B))`,
          expectedOutput: `Dot: 200
A @ B: [[19, 22], [43, 50]]`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'sum(a * b for a, b in zip(u, v))',
          internalEffect: 'Computes 2*10 + 3*20 + 4*30 = 200.',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: 'list(zip(*B))',
          internalEffect: 'Transposes B so each column of B can be dotted with each row of A.',
        },
      ],
      apply: {
        domain: 'Machine Learning',
        contextTitle: 'Weighted Feature Scoring with Dot Product',
        scenario: 'Score a candidate profile `[experience, projects, tests]` against weights `[0.4, 0.35, 0.25]`.',
        code: `features = [90, 80, 100]
weights = [0.4, 0.35, 0.25]
score = sum(f * w for f, w in zip(features, weights))
print("Weighted score:", score)`,
        outcome: 'Weighted score: 89.0',
      },
      commonMistakes: [
        {
          label: 'Mismatched Inner Dimensions in Matrix Multiplication',
          erroneousCode: `# (2, 3) @ (2, 3)  # ValueError: matmul: Input operand 1 has a mismatch in its core dimension`,
          errorMessage: 'ValueError because inner dimensions 3 != 2',
          explanation: 'Transpose the second matrix (`A @ B.T`) so `(2, 3) @ (3, 2)` yields `(2, 2)`.',
          correctedCode: `# A @ B.T`,
        },
      ],
      sourceNotes: 'Covers dot product, matmul, and seeded RNG for Day 24.',
      practise: [
        {
          id: 'd24-ex27',
          title: 'Matrix Multiplication Dimension Rule',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Matrix `A` has shape `(3, 4)` and matrix `B` has shape `(4, 2)`. What is the shape of `A @ B`?',
          contextScenario: 'Checking neural network linear layer dimensions.',
          options: [
            {
              id: 'a',
              text: '`(3, 2)`',
              explanation: 'Correct! Inner dimensions `4 == 4` match and contract, leaving outer dimensions `(3, 2)`.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: '`(4, 4)`',
              explanation: 'The inner dimension `4` contracts away.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '`(3, 4)`',
              explanation: 'The output takes columns from `B` (`2`), not `A` (`4`).',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Raises `ValueError`',
              explanation: 'Inner dimensions match (`4 == 4`), so `A @ B` is valid.',
              isCorrect: false,
            },
          ],
          hints: [
            'Rule: `(m, k) @ (k, n) -> (m, n)`.',
          ],
          points: 10,
        },
        {
          id: 'd24-ex28',
          title: 'Trace Seeded Random Sampling Reproducibility',
          type: 'predict-output',
          tier: 'standard',
          prompt: 'What does this seeded `random.Random(7)` comparison print?',
          contextScenario: 'Verifying deterministic Monte Carlo simulation draws.',
          starterCode: `import random

rng1 = random.Random(7)
rng2 = random.Random(7)
print(rng1.randint(1, 100) == rng2.randint(1, 100))`,
          options: [
            {
              id: 'a',
              text: 'True',
              explanation: 'Correct! Two independent generators initialized with the same seed (`7`) produce the exact same sequence.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'False',
              explanation: 'Seeded PRNGs are deterministic when given identical seeds.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'TypeError',
              explanation: '`random.Random(7)` is valid standard-library Python.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'None',
              explanation: '`==` evaluates to a boolean.',
              isCorrect: false,
            },
          ],
          hints: [
            'Both `rng1` and `rng2` start from seed `7`.',
          ],
          points: 15,
        },
        {
          id: 'd24-ex29',
          title: 'Complete Dot Product Implementation',
          type: 'fill-the-gaps',
          tier: 'standard',
          prompt: 'Fill in the gaps to compute the dot product of two equal-length vectors.',
          contextScenario: 'Computing cosine similarity numerator between two embedding vectors.',
          gaps: [
            {
              id: 'g1',
              beforeText: 'return ',
              afterText: '(a * b for a, b in ',
              correctAnswer: 'sum',
              options: ['sum', 'len', 'max', 'all'],
            },
            {
              id: 'g2',
              beforeText: 'return sum(a * b for a, b in ',
              afterText: '(u, v))',
              correctAnswer: 'zip',
              options: ['zip', 'enumerate', 'map', 'range'],
            },
          ],
          hints: [
            'Pair elements from `u` and `v` using `zip(u, v)`.',
            'Add the products with `sum(...)`.',
          ],
          points: 15,
        },
        {
          id: 'd24-ex30',
          title: 'Matrix Multiplication (A @ B) with Shape Guard',
          type: 'write-code',
          tier: 'project',
          prompt: 'Implement `matmul(A, B)` that raises `ValueError` if `len(A[0]) != len(B)` and otherwise returns the matrix product `A @ B`.',
          contextScenario: 'Building a dimension-safe matrix multiplier.',
          starterCode: `def matmul(A, B):
    # TODO: validate inner dimensions, transpose B, and compute dot products
    pass

print(matmul([[1, 2, 3], [4, 5, 6]], [[7, 8], [9, 10], [11, 12]]))`,
          solutionCode: `def matmul(A, B):
    if len(A[0]) != len(B):
        raise ValueError("Incompatible matrix shapes")
    cols_b = list(zip(*B))
    return [[sum(x * y for x, y in zip(row_a, col_b)) for col_b in cols_b] for row_a in A]

print(matmul([[1, 2, 3], [4, 5, 6]], [[7, 8], [9, 10], [11, 12]]))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Computes (2,3) @ (3,2) -> [[58, 64], [139, 154]]',
              setup: '',
              expected: '[[58, 64], [139, 154]]',
              hidden: false,
            },
          ],
          hints: [
            'Check `if len(A[0]) != len(B): raise ValueError(...)`.',
            'Transpose `B` with `list(zip(*B))` and dot each row of `A` with each column of `B`.',
          ],
          points: 25,
        },
      ],
      assess: [],
    },
  ],
  realWorldLabs: [
    {
      id: 'day24-lab-1',
      title: 'Telemetry Outlier & Z-Score Anomaly Detector',
      domain: 'Observability Engineering',
      description: 'Compute mean, median, and population stdev for API latency samples, flag values with |Z| > 2.0 as anomalies, and output a JSON diagnostic summary.',
      starterCode: `import json
import statistics

LATENCIES = [18, 20, 19, 21, 22, 17, 20, 95]

# TODO: compute mean, median, pstdev, and anomalies (|x - mean| / pstdev > 2.0)
# Print JSON: {"median": 20.0, "anomalies": [95]}
`,
      targetOutput: '{"median": 20.0, "anomalies": [95]}',
    },
    {
      id: 'day24-lab-2',
      title: 'Axis-Aware Feature Matrix Normalizer & Dot Scorer',
      domain: 'Machine Learning Pipelines',
      description: 'Compute column means (axis=0) on a 2D feature matrix, zero-center every row via broadcasting, and dot-product each centered row against a weight vector.',
      starterCode: `import json

FEATURES = [[10, 100], [20, 200], [30, 300]]
WEIGHTS = [0.5, 0.1]

# TODO: Compute col_means (axis=0), center FEATURES, and compute dot(row, WEIGHTS) for each row
# Print JSON: {"col_means": [20.0, 200.0], "scores": [-15.0, 0.0, 15.0]}
`,
      targetOutput: '{"col_means": [20.0, 200.0], "scores": [-15.0, 0.0, 15.0]}',
    },
  ],
  miniProject: {
    id: 'day24-project',
    title: 'Vectorised Matrix & Statistical Analytics Engine',
    brief: 'Build a complete numerical analytics engine supporting descriptive statistics (mean, median, pstdev), broadcast shape validation, axis=0/axis=1 aggregations, Z-score normalization with zero-variance protection, and dimension-checked matrix multiplication.',
    requirements: [
      'Compute mean, median, and population standard deviation accurately using statistics.',
      'Validate broadcasting compatibility for arbitrary shape tuples right-to-left.',
      'Support axis=0 (column) and axis=1 (row) sum aggregations on 2D matrices.',
      'Implement Z-score normalization that guards against std == 0.',
      'Implement dimension-checked matrix multiplication (A @ B) raising ValueError on mismatch.',
    ],
    rubric: [
      { criterion: 'Statistical accuracy & zero-variance safety', weight: 30 },
      { criterion: 'Broadcasting validator & axis-aware aggregations', weight: 40 },
      { criterion: 'Dimension-safe matrix multiplication & clean JSON output', weight: 30 },
    ],
    starterCode: `import json
import statistics

def analyze_matrix(matrix, weights):
    # TODO: compute axis=0 means, axis=1 sums, and matmul against weights
    pass

DATA = [[2, 4], [6, 8], [10, 12]]
WEIGHTS = [[1], [2]]
print(analyze_matrix(DATA, WEIGHTS))
`,
  },
  dayQuiz: {
    title: 'Day 24 Mastery Checkpoint: Statistics and NumPy',
    passingScorePercentage: 80,
    questions: [
      {
        id: 'd24-q1',
        scenario: 'A dataset of 10 home prices has 9 homes around $300k and 1 mansion at $10M.',
        question: 'Which central-tendency metric is least distorted by the $10M mansion?',
        options: [
          {
            id: 'a',
            text: 'Median',
            explanation: 'Correct! The median depends only on the middle rank, not extreme magnitudes.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Mean',
            explanation: 'The mean is heavily pulled upward by the $10M outlier.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Variance',
            explanation: 'Variance measures squared spread and explodes with outliers.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Range',
            explanation: 'Range (`max - min`) is directly determined by the $10M outlier.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd24-q2',
        scenario: 'You compare `np.std(sample)` (default `ddof=0`) with `statistics.stdev(sample)`.',
        question: 'Which argument makes `np.std` match `statistics.stdev`?',
        options: [
          {
            id: 'a',
            text: '`ddof=1`',
            explanation: 'Correct! `ddof=1` divides by `N - 1` (sample standard deviation).',
            isCorrect: true,
          },
          {
            id: 'b',
            text: '`axis=1`',
            explanation: '`axis` selects the reduction dimension, not Bessel’s correction.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: '`dtype=int`',
            explanation: 'Truncating to `int` loses precision.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: '`keepdims=True`',
            explanation: '`keepdims` preserves array rank, not `N - 1`.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd24-q3',
        scenario: 'You need 5 evenly spaced points from `0.0` to `1.0` inclusive.',
        question: 'Which NumPy function includes both endpoints?',
        options: [
          {
            id: 'a',
            text: '`np.linspace(0.0, 1.0, 5)`',
            explanation: 'Correct! `linspace` includes both `start` and `stop`.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: '`np.arange(0.0, 1.0, 0.25)`',
            explanation: '`arange` excludes the `stop` value `1.0`.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: '`np.zeros(5)`',
            explanation: '`zeros` creates five `0.0` values.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: '`np.eye(5)`',
            explanation: '`eye` creates a 5x5 identity matrix.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd24-q4',
        scenario: 'An array `arr` has `size = 24`. You call `arr.reshape(4, -1)`.',
        question: 'What shape does NumPy produce?',
        options: [
          {
            id: 'a',
            text: '`(4, 6)`',
            explanation: 'Correct! `-1` is automatically inferred as `24 // 4 = 6`.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: '`(6, 4)`',
            explanation: 'The first dimension is fixed at `4`.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: '`(4, 24)`',
            explanation: '`4 * 24 = 96 != 24`.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: '`(4, -1)`',
            explanation: '`-1` is resolved to `6`.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd24-q5',
        scenario: 'You create `sub = arr[:, 1:]` and run `sub[0, 0] = 999`.',
        question: 'Why does `arr[0, 1]` also become `999`?',
        options: [
          {
            id: 'a',
            text: 'Basic NumPy slicing returns a view sharing the parent’s memory buffer; use `.copy()` for an independent array.',
            explanation: 'Correct! Views share memory with the parent array.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'NumPy variables are always global constants.',
            explanation: 'They are mutable objects, and views share buffers.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Because `999` is an integer literal.',
            explanation: 'Any value written to a view modifies the parent buffer.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Because `:` means deep copy in NumPy.',
            explanation: '`:` creates a slice view, not a deep copy.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd24-q6',
        scenario: 'You want to filter `arr` for values strictly between `10` and `50` using boolean masking.',
        question: 'Which syntax is valid in NumPy?',
        options: [
          {
            id: 'a',
            text: '`arr[(arr > 10) & (arr < 50)]`',
            explanation: 'Correct! Element-wise `&` with parentheses combines boolean masks.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: '`arr[(arr > 10) and (arr < 50)]`',
            explanation: 'Python `and` raises `ValueError: The truth value of an array is ambiguous`.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: '`arr[10 < arr < 50]`',
            explanation: 'Chained comparisons fail on NumPy arrays for the same reason.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: '`arr[arr > 10 && arr < 50]`',
            explanation: '`&&` is not a Python operator.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd24-q7',
        scenario: 'You attempt to add a `(2, 3)` matrix to a `(2,)` vector directly.',
        question: 'Why does NumPy raise a broadcasting `ValueError`?',
        options: [
          {
            id: 'a',
            text: 'Right-aligning `(2, 3)` and `(1, 2)` pits trailing dimension `3` against `2`, which are unequal and neither is `1`.',
            explanation: 'Correct! Reshape `(2,)` to `(2, 1)` so trailing `1` stretches to `3`.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'NumPy cannot add 2D and 1D arrays.',
            explanation: 'It can whenever trailing dimensions are compatible, such as `(2, 3) + (3,)`.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Broadcasting only works with multiplication, not addition.',
            explanation: 'Broadcasting works with all element-wise ufuncs.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'A `(2,)` vector has too many elements.',
            explanation: 'The issue is trailing axis alignment, not element count.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd24-q8',
        scenario: 'A `(5, 3)` matrix stores 5 students (rows) and 3 exams (columns).',
        question: 'Which call computes the average score for each of the 3 exams?',
        options: [
          {
            id: 'a',
            text: '`scores.mean(axis=0)`',
            explanation: 'Correct! `axis=0` collapses the 5 student rows, returning 3 exam averages.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: '`scores.mean(axis=1)`',
            explanation: '`axis=1` collapses the 3 exams, returning 5 student averages.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: '`scores.mean()`',
            explanation: 'With no `axis`, it returns one overall scalar mean.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: '`scores.mean(axis=2)`',
            explanation: 'A 2D array only has axes `0` and `1`.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd24-q9',
        scenario: 'Matrix `A` has shape `(2, 5)` and matrix `B` has shape `(5, 3)`.',
        question: 'Which expression computes their matrix product of shape `(2, 3)`?',
        options: [
          {
            id: 'a',
            text: '`A @ B`',
            explanation: 'Correct! `@` performs matrix multiplication (`(2, 5) @ (5, 3) -> (2, 3)`).',
            isCorrect: true,
          },
          {
            id: 'b',
            text: '`A * B`',
            explanation: '`*` is element-wise and raises a shape mismatch error here.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: '`A + B`',
            explanation: '`+` is element-wise addition.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: '`B @ A`',
            explanation: '`(5, 3) @ (2, 5)` fails because `3 != 2`.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd24-q10',
        scenario: 'You want your Monte Carlo simulation in NumPy to produce identical random draws on every run.',
        question: 'What is the modern best practice?',
        options: [
          {
            id: 'a',
            text: 'Create an isolated generator with `rng = np.random.default_rng(42)` and sample from `rng`.',
            explanation: 'Correct! `default_rng(seed)` provides an isolated, reproducible generator.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Set `seed=0` inside `np.zeros()`.',
            explanation: '`np.zeros` has no `seed` parameter.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Sort the random array after generating it.',
            explanation: 'Sorting changes the distribution order and does not make draws reproducible.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Pass `ddof=1` to `np.random.rand()`.',
            explanation: '`np.random.rand` does not accept `ddof`.',
            isCorrect: false,
          },
        ],
      },
    ],
  },
  cheatSheet: [
    {
      category: 'Descriptive Statistics (mean, median, stdev)',
      syntax: 'statistics.mean(x) | statistics.median(x) | statistics.stdev(x)',
      description: 'Use median for outlier-skewed data; use pstdev() / ddof=0 for populations and stdev() / ddof=1 for samples.',
      example: `import statistics
vals = [12, 14, 15, 16, 500]
print(statistics.mean(vals), statistics.median(vals))`,
    },
    {
      category: 'Contiguous Memory & dtype',
      syntax: 'np.array([1, 2, 3], dtype="float64")',
      description: 'ndarrays pack homogeneous typed numbers contiguously in RAM, eliminating Python object-pointer overhead.',
      example: `from array import array
buf = array("d", [1.0, 2.0, 3.0])
print(len(buf) * buf.itemsize)  # 24 contiguous bytes`,
    },
    {
      category: 'Array Factories (zeros, ones, arange, linspace)',
      syntax: 'np.arange(0, 10, 2) vs np.linspace(0, 1, 5)',
      description: 'arange excludes stop [start, stop); linspace includes both endpoints [start, stop] with exact count.',
      example: `# arange(0, 10, 2)  -> [0, 2, 4, 6, 8]
# linspace(0, 1, 5) -> [0.0, 0.25, 0.5, 0.75, 1.0]
# np.zeros((3, 4))  -> tuple shape!`,
    },
    {
      category: 'Shape, ndim, size & reshape(-1)',
      syntax: 'arr.shape | arr.ndim | arr.size | arr.reshape(3, -1)',
      description: 'reshape() creates a zero-copy view when layout permits; -1 auto-infers one dimension from arr.size.',
      example: `# arr = np.arange(12).reshape(3, -1)  # shape (3, 4)
# ravel() -> view | flatten() -> independent copy`,
    },
    {
      category: '2D Slicing & Views vs. Copies',
      syntax: 'sub = arr[:, 1:].copy()',
      description: 'Basic slices return shared-memory views; call .copy() before mutating a slice independently.',
      example: `mat = [[1, 2, 3], [4, 5, 6]]
sub = [row[1:] for row in mat]  # [[2, 3], [5, 6]]`,
    },
    {
      category: 'Boolean Masking (&, |, ~)',
      syntax: 'arr[(arr > 10) & (arr < 50)]',
      description: 'Combine NumPy boolean masks with bitwise &, |, ~ and parentheses—never Python `and`/`or`.',
      example: `readings = [-5, 18, 22, 45]
valid = [t for t in readings if 0 <= t <= 40]`,
    },
    {
      category: 'Vectorisation & Z-Score Normalization',
      syntax: '(arr - arr.mean()) / arr.std()',
      description: 'Operate across whole arrays without Python loops; guard against std == 0 before dividing.',
      example: `def z_norm(v, mu, sd):
    return [0.0 for _ in v] if sd == 0 else [(x - mu) / sd for x in v]`,
    },
    {
      category: 'Broadcasting Rules (Right-to-Left)',
      syntax: '(2, 3) + (3,) -> (2, 3) | (2, 3) + (2, 1) -> (2, 3)',
      description: 'Compare trailing axes first; dimensions match when equal or when one is 1 (left-pad shorter shapes with 1s).',
      example: `# (2, 3) + (2,) -> ValueError (3 != 2)
# Fix: vec.reshape(2, 1) -> broadcasts across columns`,
    },
    {
      category: 'Axis Aggregations (axis=0 vs. axis=1)',
      syntax: 'arr.sum(axis=0) | arr.sum(axis=1, keepdims=True)',
      description: 'The specified axis collapses: axis=0 aggregates down columns, axis=1 aggregates across rows.',
      example: `# (4, 3).sum(axis=0) -> (3,) column totals
# (4, 3).sum(axis=1, keepdims=True) -> (4, 1) row totals`,
    },
    {
      category: 'Dot Product, Matrix @ & Seeded RNG',
      syntax: 'A @ B | np.random.default_rng(42)',
      description: 'Use @ for matrix multiplication (m, k) @ (k, n) -> (m, n), * for element-wise, and default_rng(seed) for reproducibility.',
      example: `import random
rng = random.Random(42)
dot = sum(a * b for a, b in zip([2, 3], [10, 20]))`,
    },
  ],
  sourceNotes: [
    'Curriculum reference: https://github.com/Asabeneh/30-Days-Of-Python/tree/master/24_Day_Statistics',
  ],
};
