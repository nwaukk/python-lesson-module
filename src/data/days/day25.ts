/**
 * Day 25: Pandas (Advanced Python)
 * Part A (Learn) conforming to Sections 10, 13.2, and 14 of the Master Specification.
 * Includes:
 *  - 9 Detailed Subtopics following the 10-step pedagogical structure
 *  - 3 Signature Simulations: dataframe-loc-iloc-sim, missing-data-sim, groupby-merge-sim
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_25_MODULE: DayModule = {
  schemaVersion: 1,
  number: 25,
  title: 'Pandas',
  level: 'advanced',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/25_Day_Pandas',
  estimatedMinutes: 95,
  prerequisites: [24],
  objectives: [
    'Understand Series (1D labeled) and DataFrame (2D heterogeneous tabular) anatomy and index alignment',
    'Load and inspect CSV/JSON tabular datasets using read_csv(), head(), info(), and describe()',
    'Select rows and columns accurately with label-based loc[] (inclusive) vs integer-position iloc[] (exclusive)',
    'Filter rows using boolean masks (&, |, ~) and avoid SettingWithCopyWarning via loc[] or .copy()',
    'Detect, drop, and impute missing data (NaN / None) with isna(), dropna(subset=...), and fillna()',
    'Transform columns using vectorised expressions, assign(), and understand apply() performance tradeoffs',
    'Aggregate grouped tabular data using groupby() Split-Apply-Combine and named agg()',
    'Combine multiple tables using pd.merge(how="inner" | "left") and pd.concat(ignore_index=True)',
    'Sort, deduplicate with drop_duplicates(), and export clean datasets to CSV/JSON',
  ],
  subtopics: [
    {
      id: 'day25-sub1',
      number: 1,
      title: 'Series & DataFrame Anatomy: Labeled Index & Typed Columns',
      summary: 'Distinguish 1D labeled Series from 2D heterogeneous DataFrames and index alignment.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Labeled Tabular Computing with Pandas',
        paragraphs: [
          'While NumPy excels at homogeneous numeric grids, real-world datasets mix strings, dates, booleans, and numbers with meaningful column names. Pandas builds on NumPy with two core structures: **`Series`** (a 1D labeled array) and **`DataFrame`** (a 2D table of aligned `Series` columns).',
          'A crucial superpower of Pandas is **index alignment**: adding two `Series` (`s1 + s2`) matches elements by their **index label**, not by raw positional offset. Any label missing in one `Series` produces **`NaN`**.',
        ],
        keyTerms: [
          {
            term: 'Series',
            definition: '1D labeled array holding a single dtype with an associated Index.',
          },
          {
            term: 'DataFrame',
            definition: '2D labeled table of columns, where each column is a Series sharing a common row Index.',
          },
        ],
        bulletPoints: [
          'Inspect dimensions with `df.shape`, column names with `df.columns`, and column types with `df.dtypes`.',
          'Think of a `DataFrame` as a dictionary mapping column names to equal-length `Series` objects.',
        ],
      },
      visualise: {
        type: 'dataframe-loc-iloc-sim',
        title: 'DataFrame loc / iloc & Index Alignment Inspector',
        badge: 'simulation',
        description: 'Select `Series Index Alignment` to see how labels match across Series.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Modeling Index-Aligned Series Addition in Python',
          runMode: 'real',
          code: `s1 = {"sku_a": 75.0, "sku_b": 12.0, "sku_c": 240.0}
s2 = {"sku_a": 5.0, "sku_c": 10.0}

all_labels = sorted(set(s1) | set(s2))
aligned_sum = {
    k: (s1[k] + s2[k] if k in s1 and k in s2 else None)
    for k in all_labels
}
print("Aligned sum:", aligned_sum)`,
          expectedOutput: "Aligned sum: {'sku_a': 80.0, 'sku_b': None, 'sku_c': 250.0}",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'sorted(set(s1) | set(s2))',
          internalEffect: 'Takes the union of index labels across both Series.',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 's1[k] + s2[k] if k in s1 and k in s2 else None',
          internalEffect: 'Adds matching labels and yields None (NaN in Pandas) where a label is missing.',
        },
      ],
      apply: {
        domain: 'Inventory Analytics',
        contextTitle: 'Building a Columnar Table Dictionary',
        scenario: 'Inspect shape and column names of a columnar product table.',
        code: `df_cols = {
    "item": ["Keyboard", "Notebook", "Monitor"],
    "price": [75.0, 12.0, 240.0],
}
print("Shape:", (len(df_cols["item"]), len(df_cols)))
print("Columns:", list(df_cols.keys()))`,
        outcome: `Shape: (3, 2)
Columns: ['item', 'price']`,
      },
      commonMistakes: [
        {
          label: 'Expecting Positional Addition on Unaligned Series',
          erroneousCode: `# s1 (index [0, 1]) + s2 (index [1, 2]) -> produces NaN at 0 and 2!`,
          errorMessage: 'Unexpected NaN values when indices do not match',
          explanation: 'Reset indices with `.reset_index(drop=True)` if you actually want positional alignment.',
          correctedCode: `# s1.reset_index(drop=True) + s2.reset_index(drop=True)`,
        },
      ],
      sourceNotes: 'Covers Series, DataFrame, and index alignment for Day 25.',
      practise: [
        {
          id: 'day25-ex1',
          title: 'Index Alignment in Warehouse Stock Reconciliation',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'A warehouse auditor adds `morning_stock` (indexed `["SKU-10", "SKU-20", "SKU-30"]`) and `restock_delta` (indexed `["SKU-20", "SKU-30", "SKU-40"]`) using `morning_stock + restock_delta`. What happens at `"SKU-10"` and `"SKU-40"`?',
          contextScenario: 'Two regional inventory Series have partially overlapping SKU labels.',
          options: [
            {
              id: 'a',
              text: 'Both "SKU-10" and "SKU-40" become NaN because Pandas aligns by index label, not position.',
              explanation: 'Correct! Pandas performs an outer union of index labels; any label absent in either Series yields NaN.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'Pandas raises a KeyError because the two Series do not share identical indices.',
              explanation: 'Incorrect. Arithmetic between Series does not raise KeyError on mismatched labels; it aligns and produces NaN.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '"SKU-10" keeps its morning_stock value and "SKU-40" keeps its restock_delta value.',
              explanation: 'Incorrect. Standard `+` does not default missing labels to 0; you would need `.add(restock_delta, fill_value=0)` for that.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Pandas adds elements positionally: index 0 with index 0, index 1 with index 1.',
              explanation: 'Incorrect. Positional addition is NumPy behavior; Pandas Series always align by index label.',
              isCorrect: false,
            },
          ],
          hints: [
            'Series arithmetic matches labels, not integer offsets.',
            'What is `value + missing` in floating-point Pandas?',
            'Use `.add(other, fill_value=0)` when missing labels should default to zero.',
          ],
          points: 10,
        },
        {
          id: 'day25-ex2',
          title: 'Predict Aligned Sensor Offset Output',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'What does this index-alignment simulation print for `"sensor_b"` and `"sensor_c"`?',
          contextScenario: 'Simulating `baseline + calibration` across two partially overlapping sensor dictionaries.',
          options: [
            {
              id: 'a',
              text: "{'sensor_a': 22.5, 'sensor_b': None, 'sensor_c': None}",
              explanation: 'Correct! Only sensor_a exists in both Series; sensor_b and sensor_c are missing in one side and become None/NaN.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: "{'sensor_a': 22.5, 'sensor_b': 18.0, 'sensor_c': 0.5}",
              explanation: 'Incorrect. Without fill_value=0, unaligned labels do not preserve single-sided values.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: "{'sensor_a': 22.5}",
              explanation: 'Incorrect. Series arithmetic takes the union of keys, not the intersection.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Raises KeyError: sensor_b',
              explanation: 'Incorrect. The comprehension guards with `if k in s1 and k in s2`.',
              isCorrect: false,
            },
          ],
          hints: [
            'Check `all_keys = sorted(set(s1) | set(s2))`.',
            'Only keys present in BOTH dictionaries get summed.',
            'Keys in only one dictionary map to None.',
          ],
          points: 10,
        },
        {
          id: 'day25-ex3',
          title: 'Build a Columnar DataFrame Shape & Alignment Helper',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Write `align_add_zero(s1, s2)` that models `s1.add(s2, fill_value=0)` by returning a dict of all sorted keys from `s1` and `s2`, treating any missing key as `0`.',
          contextScenario: 'Merging daily branch revenue Series where some branches were closed on Sunday.',
          starterCode: `def align_add_zero(s1, s2):
    # Return dict mapping each sorted key in s1 | s2 to s1.get(k, 0) + s2.get(k, 0)
    pass

print(align_add_zero({"north": 120, "south": 80}, {"south": 20, "west": 50}))`,
          solutionCode: `def align_add_zero(s1, s2):
    return {k: s1.get(k, 0) + s2.get(k, 0) for k in sorted(set(s1) | set(s2))}

print(align_add_zero({"north": 120, "south": 80}, {"south": 20, "west": 50}))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Union with fill_value=0',
              setup: 'res = align_add_zero({"north": 120, "south": 80}, {"south": 20, "west": 50})\nprint(res)',
              expected: "{'north': 120, 'south': 100, 'west': 50}",
              hidden: false,
            },
          ],
          hints: [
            'Compute `sorted(set(s1) | set(s2))` for the union of labels.',
            'Use `s1.get(k, 0) + s2.get(k, 0)` for each label `k`.',
            'Return a dictionary comprehension.',
          ],
          points: 15,
        },
        {
          id: 'day25-ex4',
          title: 'Why DataFrames Allow Mixed Dtypes Per Column',
          type: 'theory-reasoning',
          tier: 'standard',
          prompt: 'Explain why a Pandas `DataFrame` can store `int64`, `float64`, and `object`/`string` columns side by side, whereas a single NumPy `ndarray` forces a single homogeneous dtype.',
          contextScenario: 'Designing an energy-grid telemetry table with timestamp strings, substation IDs, and voltage floats.',
          modelAnswer: 'A DataFrame is a collection of 1D Series columns sharing a row Index. Each Series column is backed by its own homogeneous NumPy array, so column A can be string while column B is float64 without upcasting the entire table to string.',
          markingCriteria: [
            { id: 'mc1', label: 'Identifies that each column is an independent 1D Series', points: 5 },
            { id: 'mc2', label: 'Notes each Series has its own homogeneous backing array', points: 5 },
            { id: 'mc3', label: 'Contrasts with 2D NumPy ndarray upcasting all elements', points: 5 },
          ],
          hints: [
            'Think of a DataFrame as a dict of Series objects.',
            'What happens in NumPy if you put a string and a float in the same 2D array?',
            'Each column in Pandas maintains its own dtype.',
          ],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day25-sub2',
      number: 2,
      title: 'Reading & Inspecting Tabular Data (read_csv, head, info, describe)',
      summary: 'Parse CSV datasets cleanly, check schemas, and summarize numeric distributions.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'First-5-Minutes Data Inspection Workflow',
        paragraphs: [
          'Loading data with **`pd.read_csv("orders.csv")`** is only step one. Before writing transformations, experienced analysts always run four inspection checks: **`df.head()`** (preview top rows), **`df.shape`** (row/column counts), **`df.info()`** (dtypes + non-null counts), and **`df.describe()`** (count, mean, std, min, quartiles, max).',
          'In standard-library Python, **`csv.DictReader(io.StringIO(text))`** parses CSV headers into row dictionaries, while explicit casting (`float()`, `int()`) mirrors Pandas `dtype` inference.',
        ],
        keyTerms: [
          {
            term: 'df.info()',
            definition: 'Prints column names, non-null counts, dtypes, and memory usage.',
          },
          {
            term: 'df.describe()',
            definition: 'Computes count, mean, std, min, 25%/50%/75% percentiles, and max for numeric columns.',
          },
        ],
        bulletPoints: [
          'Always check `df.dtypes` after `read_csv()`: a single `"N/A"` string turns an entire numeric column into `object` (`str`).',
          'Pass `na_values=["N/A", "-"]` to `pd.read_csv()` so custom placeholders become proper `NaN`s.',
        ],
      },
      visualise: {
        type: 'dataframe-loc-iloc-sim',
        title: 'Tabular Schema & Row Inspection View',
        badge: 'simulation',
        description: 'Inspect how rows, column headers, and index labels organize tabular records.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Parsing CSV Text with csv.DictReader & Summary Inspection',
          runMode: 'real',
          code: `import csv
import io

csv_text = """city,temp_c
Oslo,4.5
Lisbon,18.0
Lima,21.5
"""

rows = list(csv.DictReader(io.StringIO(csv_text.strip())))
temps = [float(r["temp_c"]) for r in rows]
print("Rows:", len(rows), "Min/Max:", min(temps), max(temps))`,
          expectedOutput: 'Rows: 3 Min/Max: 4.5 21.5',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 10,
          instruction: 'csv.DictReader(io.StringIO(...))',
          internalEffect: 'Reads the header row and yields each subsequent row as a dict.',
        },
        {
          step: 2,
          codeLine: 11,
          instruction: 'float(r["temp_c"])',
          internalEffect: 'Casts string CSV fields into numeric floats for aggregation.',
        },
      ],
      apply: {
        domain: 'Data Ingestion',
        contextTitle: 'Converting Custom NA Placeholders on Load',
        scenario: 'Convert `"N/A"` strings in a CSV price column to `None` during ingestion.',
        code: `raw_prices = ["12.50", "N/A", "30.00"]
cleaned = [None if p == "N/A" else float(p) for p in raw_prices]
print("Cleaned prices:", cleaned)`,
        outcome: 'Cleaned prices: [12.5, None, 30.0]',
      },
      commonMistakes: [
        {
          label: 'Assuming Numeric Columns Parsed as Floats Without Checking',
          erroneousCode: `# df["price"].mean()  # TypeError if "N/A" made dtype=object!`,
          errorMessage: 'TypeError: Could not convert string to numeric',
          explanation: 'Pass `na_values=["N/A"]` to `read_csv()` or use `pd.to_numeric(..., errors="coerce")`.',
          correctedCode: `# df["price"] = pd.to_numeric(df["price"], errors="coerce")`,
        },
      ],
      sourceNotes: 'Covers CSV loading and inspection for Day 25.',
      practise: [
        {
          id: 'day25-ex5',
          title: 'Preserving Leading Zeros in Postal Codes',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'You load `customers.csv` with `pd.read_csv("customers.csv")`, and Boston zip code `"02138"` becomes integer `2138`. Which parameter prevents this data corruption at ingestion time?',
          contextScenario: 'Preparing shipping-label CSVs for an e-commerce fulfillment center.',
          options: [
            {
              id: 'a',
              text: 'dtype={"zip_code": str}',
              explanation: 'Correct! Specifying `dtype={"zip_code": str}` tells `read_csv` to keep leading zeros intact as strings.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'index_col="zip_code"',
              explanation: 'Incorrect. Setting zip_code as the index still infers integer dtype unless `dtype` is specified.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'na_values=["0"]',
              explanation: 'Incorrect. That would turn "0" into NaN, not preserve leading zeros.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'header=None',
              explanation: 'Incorrect. `header=None` disables reading column names from row 0.',
              isCorrect: false,
            },
          ],
          hints: [
            'Type inference happens during `read_csv` before your code runs.',
            'You can pass a per-column dtype mapping to `read_csv`.',
            'Use `dtype={"zip_code": str}`.',
          ],
          points: 10,
        },
        {
          id: 'day25-ex6',
          title: 'Complete the CSV Ingestion Parameters',
          type: 'fill-the-gaps',
          tier: 'foundation',
          prompt: 'Fill in the two `read_csv` keyword arguments to parse `created_at` as a datetime and treat `"N/A"` as missing.',
          contextScenario: 'Ingesting SaaS billing logs exported from a legacy ERP.',
          gaps: [
            {
              id: 'g1',
              beforeText: 'df = pd.read_csv("billing.csv", ',
              afterText: '=["created_at"], ',
              correctAnswer: 'parse_dates',
              options: ['parse_dates', 'date_cols', 'to_datetime', 'dtypes'],
            },
            {
              id: 'g2',
              beforeText: '',
              afterText: '=["N/A", "-"])',
              correctAnswer: 'na_values',
              options: ['na_values', 'missing_vals', 'fillna', 'null_tokens'],
            },
          ],
          hints: [
            'The parameter for automatic datetime parsing is plural: `parse_dates`.',
            'Custom sentinel strings for missing values are passed via `na_values`.',
            'Both accept a list of strings.',
          ],
          points: 10,
        },
        {
          id: 'day25-ex7',
          title: 'Fix Sentinel String Conversion During CSV Parse',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'This CSV parser crashes with `ValueError` when a row has `"N/A"` in the `kwh` column. Fix `parse_meter_csv` so `"N/A"` becomes `None` and valid numbers become `float`.',
          contextScenario: 'Smart-meter CSV ingestion in an energy utility pipeline.',
          starterCode: `import csv, io

raw = "meter_id,kwh\\nM1,42.5\\nM2,N/A\\nM3,19.0"

def parse_meter_csv(text):
    rows = []
    for row in csv.DictReader(io.StringIO(text)):
        row["kwh"] = float(row["kwh"])
        rows.append(row)
    return rows

print(parse_meter_csv(raw))`,
          solutionCode: `import csv, io

raw = "meter_id,kwh\\nM1,42.5\\nM2,N/A\\nM3,19.0"

def parse_meter_csv(text):
    rows = []
    for row in csv.DictReader(io.StringIO(text)):
        val = row["kwh"].strip()
        row["kwh"] = None if val in ("N/A", "") else float(val)
        rows.append(row)
    return rows

print(parse_meter_csv(raw))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Handles N/A as None',
              setup: 'out = parse_meter_csv("meter_id,kwh\\nM1,42.5\\nM2,N/A\\nM3,19.0")\nprint(out[1]["kwh"], out[0]["kwh"])',
              expected: 'None 42.5',
              hidden: false,
            },
          ],
          hints: [
            'Check `row["kwh"]` before calling `float(...)`.',
            'If the stripped string is `"N/A"` or `""`, assign `None`.',
            'Otherwise convert with `float(...)`.',
          ],
          points: 15,
        },
        {
          id: 'day25-ex8',
          title: 'Parse Tab-Separated Telemetry & Sum Valid Readings',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Write `sum_valid_readings(tsv_text)` that parses tab-separated (`delimiter="\\t"`) rows with columns `node,latency_ms`, skips `"TIMEOUT"` rows, and returns the rounded sum of `latency_ms`.',
          contextScenario: 'Ingesting CDN edge-node latency logs.',
          starterCode: `import csv, io

def sum_valid_readings(tsv_text):
    # Parse TSV with delimiter="\\t", skip "TIMEOUT", return round(total, 2)
    pass

sample = "node\\tlatency_ms\\nedge-1\\t12.4\\nedge-2\\tTIMEOUT\\nedge-3\\t8.1"
print(sum_valid_readings(sample))`,
          solutionCode: `import csv, io

def sum_valid_readings(tsv_text):
    total = 0.0
    for row in csv.DictReader(io.StringIO(tsv_text), delimiter="\\t"):
        if row["latency_ms"] != "TIMEOUT":
            total += float(row["latency_ms"])
    return round(total, 2)

sample = "node\\tlatency_ms\\nedge-1\\t12.4\\nedge-2\\tTIMEOUT\\nedge-3\\t8.1"
print(sum_valid_readings(sample))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Sums non-TIMEOUT rows',
              setup: 'print(sum_valid_readings("node\\tlatency_ms\\nedge-1\\t12.4\\nedge-2\\tTIMEOUT\\nedge-3\\t8.1"))',
              expected: '20.5',
              hidden: false,
            },
          ],
          hints: [
            'Pass `delimiter="\\t"` to `csv.DictReader`.',
            'Skip rows where `row["latency_ms"] == "TIMEOUT"`.',
            'Accumulate `float(row["latency_ms"])` and return `round(total, 2)`.',
          ],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day25-sub3',
      number: 3,
      title: 'Label vs. Position Indexing (loc[] vs. iloc[])',
      summary: 'Master inclusive label slicing with loc[] and exclusive integer slicing with iloc[].',
      estimatedMinutes: 11,
      introduce: {
        headline: 'The Most Important Distinction in Pandas Indexing',
        paragraphs: [
          'Pandas provides two explicit indexers so you never confuse row labels with integer positions: **`df.loc[row_label, col_label]`** (label-based) and **`df.iloc[row_pos, col_pos]`** (0-based integer position).',
          'Watch the slicing boundary rule: **`df.loc["sku_a":"sku_b"]` is INCLUSIVE** of `"sku_b"`, whereas **`df.iloc[0:2]` is EXCLUSIVE** of `2` (returning rows `0` and `1`, just like Python lists).',
        ],
        keyTerms: [
          {
            term: 'df.loc[]',
            definition: 'Label-based indexer; label slices include both the start and stop labels.',
          },
          {
            term: 'df.iloc[]',
            definition: 'Integer-position indexer; integer slices follow Python half-open [start, stop) rules.',
          },
        ],
        bulletPoints: [
          'If your DataFrame has an integer index `[0, 1, 2]`, `df.loc[0:2]` returns **3 rows** (`0, 1, 2`), whereas `df.iloc[0:2]` returns **2 rows** (`0, 1`)!',
          'Always prefer `.loc` or `.iloc` over bare `df[...]` when selecting both rows and columns.',
        ],
      },
      visualise: {
        type: 'dataframe-loc-iloc-sim',
        title: 'loc[] Inclusive vs. iloc[] Exclusive Highlighter',
        badge: 'simulation',
        description: 'Compare `df.loc["sku_a":"sku_b", "item":"dept"]` against `df.iloc[0:2, 1:3]`.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Comparing Inclusive loc Slice vs. Exclusive iloc Slice',
          runMode: 'real',
          code: `labels = ["sku_a", "sku_b", "sku_c"]
items = ["Keyboard", "Notebook", "Monitor"]

# loc["sku_a":"sku_b"] -> inclusive of stop label
start_i, stop_i = labels.index("sku_a"), labels.index("sku_b")
loc_slice = items[start_i:stop_i + 1]

# iloc[0:2] -> exclusive of stop integer
iloc_slice = items[0:2]

print("loc slice:", loc_slice)
print("iloc slice:", iloc_slice)`,
          expectedOutput: `loc slice: ['Keyboard', 'Notebook']
iloc slice: ['Keyboard', 'Notebook']`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 6,
          instruction: 'items[start_i:stop_i + 1]',
          internalEffect: 'Adds +1 because label-based loc slices include the stop label.',
        },
        {
          step: 2,
          codeLine: 9,
          instruction: 'items[0:2]',
          internalEffect: 'Standard Python half-open slice [0, 2) matching iloc[0:2].',
        },
      ],
      apply: {
        domain: 'Financial Reporting',
        contextTitle: 'Selecting Date-Range Slices by Label',
        scenario: 'Select inclusive quarterly records from `"Q1"` through `"Q3"`.',
        code: `quarters = ["Q1", "Q2", "Q3", "Q4"]
rev = [100, 120, 140, 160]
i0, i1 = quarters.index("Q1"), quarters.index("Q3")
print("Q1..Q3 inclusive:", rev[i0:i1 + 1])`,
        outcome: 'Q1..Q3 inclusive: [100, 120, 140]',
      },
      commonMistakes: [
        {
          label: 'Passing String Column Names to df.iloc[]',
          erroneousCode: `# df.iloc[0:2, "price"]  # IndexError / TypeError: iloc requires integer positions!`,
          errorMessage: 'ValueError: Location based indexing can only have integer types',
          explanation: 'Use `.loc[:, "price"]` for column names or `.iloc[:, 2]` for integer column positions.',
          correctedCode: `# df.loc[df.index[0:2], "price"]`,
        },
      ],
      sourceNotes: 'Covers loc[] vs iloc[] indexing for Day 25.',
      practise: [
        {
          id: 'day25-ex9',
          title: 'What Does df.describe() Exclude by Default?',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'A DataFrame has columns `["flight_id" (str), "delay_min" (int64), "fuel_kg" (float64), "on_time" (bool)]`. Which columns appear in `df.describe()` by default?',
          contextScenario: 'Quickly auditing an aviation operations table before modeling.',
          options: [
            {
              id: 'a',
              text: 'Only delay_min and fuel_kg (numeric columns).',
              explanation: 'Correct! By default, `df.describe()` summarizes numeric columns only; use `include="all"` to see string/bool counts.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'All four columns including flight_id and on_time.',
              explanation: 'Incorrect. Non-numeric columns are omitted unless `include="all"` or `include="object"` is passed.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'Only float64 columns (fuel_kg).',
              explanation: 'Incorrect. Both int64 and float64 are numeric and included.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Only columns with zero missing values.',
              explanation: 'Incorrect. `describe()` includes numeric columns even if they contain NaNs (and reports non-null `count`).',
              isCorrect: false,
            },
          ],
          hints: [
            'What does `describe()` compute (mean, std, min, quartiles, max)?',
            'Those statistics only make sense for numeric dtypes.',
            'Pass `include="all"` to inspect categorical columns too.',
          ],
          points: 10,
        },
        {
          id: 'day25-ex10',
          title: 'Order the First-Pass Data Audit Workflow',
          type: 'order-the-lines',
          tier: 'foundation',
          prompt: 'Order these Pandas inspection steps from initial shape/schema check to categorical distribution check.',
          contextScenario: 'Standardizing the 4-step exploratory audit for incoming retail POS files.',
          jumbledLines: [
            { id: 'l3', code: 'print(df.describe())  # numeric spread & outliers', indent: 0 },
            { id: 'l1', code: 'print(df.shape, df.columns.tolist())  # dimensions & headers', indent: 0 },
            { id: 'l4', code: 'print(df["payment_method"].value_counts(dropna=False))', indent: 0 },
            { id: 'l2', code: 'df.info()  # dtypes & non-null counts', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: [
            'Start with overall dimensions (`shape`) and column names.',
            'Next inspect dtypes and null counts (`info()`).',
            'Finish with `describe()` and `value_counts(dropna=False)`.',
          ],
          points: 10,
        },
        {
          id: 'day25-ex11',
          title: 'Trace Non-Null vs Value Counts with NaN',
          type: 'explain-the-trace',
          tier: 'standard',
          prompt: 'Given `regions = ["EU", "US", None, "EU", "APAC"]`, explain why `value_counts()` without `dropna=False` can hide data-quality gaps.',
          contextScenario: 'Auditing customer region coverage in a CRM export.',
          traceStepCode: `regions = ["EU", "US", None, "EU", "APAC"]
counts_default = {"EU": 2, "US": 1, "APAC": 1}
counts_with_na = {"EU": 2, "US": 1, "APAC": 1, None: 1}`,
          traceQuestion: 'Why does `dropna=False` matter during initial data profiling?',
          modelAnswer: 'By default, `value_counts()` drops NaN/None entries (`dropna=True`), so the missing 20% of rows (`None`) would be invisible in the frequency table. Passing `dropna=False` surfaces missingness alongside valid categories.',
          markingCriteria: [
            { id: 'mc1', label: 'Notes default dropna=True hides missing values', points: 5 },
            { id: 'mc2', label: 'Explains dropna=False reveals null count in the same summary', points: 5 },
          ],
          hints: [
            'Look at the sum of counts in `counts_default` (4) vs total rows (5).',
            'Default `value_counts()` omits `NaN` / `None`.',
          ],
          points: 15,
        },
        {
          id: 'day25-ex12',
          title: 'Compute Column Summary Stats Function',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Write `summarize_numeric(values)` that ignores `None`, and returns `{"count": n, "mean": round(mean, 2), "min": mn, "max": mx}`.',
          contextScenario: 'Building a lightweight `describe()` helper for battery-pack voltage readings.',
          starterCode: `def summarize_numeric(values):
    # Filter out None, compute count, rounded mean, min, max
    pass

print(summarize_numeric([3.7, None, 3.9, 3.8]))`,
          solutionCode: `def summarize_numeric(values):
    clean = [v for v in values if v is not None]
    return {
        "count": len(clean),
        "mean": round(sum(clean) / len(clean), 2),
        "min": min(clean),
        "max": max(clean),
    }

print(summarize_numeric([3.7, None, 3.9, 3.8]))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Ignores None and computes summary',
              setup: 'print(summarize_numeric([3.7, None, 3.9, 3.8]))',
              expected: "{'count': 3, 'mean': 3.8, 'min': 3.7, 'max': 3.9}",
              hidden: false,
            },
          ],
          hints: [
            'Filter with `[v for v in values if v is not None]`.',
            'Count is `len(clean)`.',
            'Mean is `round(sum(clean) / len(clean), 2)`.',
          ],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day25-sub4',
      number: 4,
      title: 'Boolean Filtering, Multi-Condition Masks & SettingWithCopy',
      summary: 'Filter rows with compound boolean masks and mutate safely without chained indexing.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Filtering Rows & Avoiding SettingWithCopyWarning',
        paragraphs: [
          'Just like NumPy, Pandas filters rows with boolean masks: **`df[(df["dept"] == "Tech") & (df["price"] >= 50)]`**. Always wrap each condition in parentheses and use **`&`** (and), **`|`** (or), **`~`** (not), or **`.isin([...])`**.',
          'When updating filtered rows, **never use chained indexing** like `df[mask]["price"] = 0`—it triggers **`SettingWithCopyWarning`** because Pandas cannot guarantee whether `df[mask]` returned a view or a copy. Instead, write **`df.loc[mask, "price"] = 0`**, or call **`.copy()`** when creating a subset DataFrame.',
        ],
        keyTerms: [
          {
            term: 'SettingWithCopyWarning',
            definition: 'Pandas warning raised when assigning to a chained slice (df[mask]["col"] = val).',
          },
          {
            term: '.isin([...])',
            definition: 'Vectorised membership test checking whether each cell belongs to a target collection.',
          },
        ],
        bulletPoints: [
          'Single-step `df.loc[mask, "col"] = new_val` is always safe and unambiguous.',
          'Use `.copy()` when deriving a filtered sub-table you plan to mutate later.',
        ],
      },
      visualise: {
        type: 'dataframe-loc-iloc-sim',
        title: '.copy() & Safe Mutation Inspector',
        badge: 'simulation',
        description: 'Select `.copy() vs SettingWithCopy` to inspect safe subset mutation.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Multi-Condition Filtering & Safe In-Place Update',
          runMode: 'real',
          code: `records = [
    {"item": "Keyboard", "dept": "Tech", "price": 75.0},
    {"item": "Notebook", "dept": "Office", "price": 12.0},
    {"item": "Monitor", "dept": "Tech", "price": 240.0},
]

# Equivalent to df.loc[(df["dept"] == "Tech") & (df["price"] >= 100), "price"] *= 0.9
for r in records:
    if r["dept"] == "Tech" and r["price"] >= 100:
        r["price"] = round(r["price"] * 0.9, 2)

print([r["price"] for r in records])`,
          expectedOutput: '[75.0, 12.0, 216.0]',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 9,
          instruction: 'r["dept"] == "Tech" and r["price"] >= 100',
          internalEffect: 'Matches only Monitor (Tech and >= 100).',
        },
        {
          step: 2,
          codeLine: 10,
          instruction: 'r["price"] = round(r["price"] * 0.9, 2)',
          internalEffect: 'Updates the matching record directly without creating an ambiguous copy.',
        },
      ],
      apply: {
        domain: 'Catalog Filtering',
        contextTitle: 'Using isin-Style Category Filtering',
        scenario: 'Keep rows whose department is in `{"Tech", "Audio"}`.',
        code: `items = [("Mic", "Audio"), ("Pen", "Office"), ("Mouse", "Tech")]
allowed = {"Tech", "Audio"}
matched = [name for name, dept in items if dept in allowed]
print("Matched:", matched)`,
        outcome: "Matched: ['Mic', 'Mouse']",
      },
      commonMistakes: [
        {
          label: 'Chained Indexing Assignment df[mask]["col"] = val',
          erroneousCode: `# df[df["dept"] == "Tech"]["price"] = 0  # SettingWithCopyWarning!`,
          errorMessage: 'Assignment may silently fail on a temporary copy',
          explanation: 'Combine row mask and column label inside a single `.loc[mask, "col"] = val`.',
          correctedCode: `# df.loc[df["dept"] == "Tech", "price"] = 0`,
        },
      ],
      sourceNotes: 'Covers boolean filtering and SettingWithCopyWarning for Day 25.',
      practise: [
        {
          id: 'day25-ex13',
          title: 'Inclusive Label Slice vs Exclusive Integer Slice',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'A DataFrame has custom index `["r1", "r2", "r3", "r4"]`. How many rows are returned by `df.loc["r1":"r3"]` vs `df.iloc[0:3]`?',
          contextScenario: 'Extracting quarterly ledger rows by quarter label vs integer position.',
          options: [
            {
              id: 'a',
              text: 'Both return 3 rows: loc is endpoint-inclusive ("r1","r2","r3"), iloc is endpoint-exclusive (0,1,2).',
              explanation: 'Correct! `loc` includes the stop label, while `iloc` follows Python 0-based half-open slicing `[start, stop)`.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'loc returns 2 rows and iloc returns 3 rows.',
              explanation: 'Incorrect. `loc` is inclusive of `"r3"`, so it returns 3 rows.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'loc returns 3 rows and iloc returns 4 rows.',
              explanation: 'Incorrect. `iloc[0:3]` excludes index 3, returning 3 rows (0, 1, 2).',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Both return 4 rows.',
              explanation: 'Incorrect. Neither includes row 4 ("r4" / position 3).',
              isCorrect: false,
            },
          ],
          hints: [
            '`loc` uses label-based inclusive slicing.',
            '`iloc` uses Python integer-position exclusive slicing.',
            'Count `"r1", "r2", "r3"` (3) and `0, 1, 2` (3).',
          ],
          points: 10,
        },
        {
          id: 'day25-ex14',
          title: 'Predict Label vs Position Selection on Integer-Indexed DataFrame',
          type: 'predict-output',
          tier: 'challenge',
          prompt: 'After dropping row `1`, `df.index` is `[0, 2, 3]`. What does `df.iloc[1]` return compared to `df.loc[1]`?',
          contextScenario: 'Debugging an off-by-one bug after filtering out cancelled orders.',
          options: [
            {
              id: 'a',
              text: 'df.iloc[1] returns the row with label 2; df.loc[1] raises KeyError.',
              explanation: 'Correct! Position 1 is now label 2, whereas label 1 no longer exists in the index.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'Both return the row with label 2.',
              explanation: 'Incorrect. `loc[1]` looks up label `1`, not position `1`.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'df.iloc[1] raises IndexError; df.loc[1] returns None.',
              explanation: 'Incorrect. There are 3 rows (positions 0, 1, 2), so `iloc[1]` is valid.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Both raise KeyError.',
              explanation: 'Incorrect. `iloc` uses positional offset and succeeds.',
              isCorrect: false,
            },
          ],
          hints: [
            'Filtering rows preserves original index labels unless you call `.reset_index(drop=True)`.',
            '`iloc[1]` asks for the 2nd row by position.',
            '`loc[1]` asks for the row whose index label is `1`.',
          ],
          points: 15,
        },
        {
          id: 'day25-ex15',
          title: 'Fix loc vs iloc Slice Semantics',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'Fix `slice_by_label` so it behaves like Pandas `loc[start_label:end_label]` (inclusive of `end_label`), instead of excluding the end row.',
          contextScenario: 'Implementing a report-range extractor for monthly closing balances.',
          starterCode: `labels = ["jan", "feb", "mar", "apr"]
values = [100, 120, 95, 140]

def slice_by_label(labels, values, start_lbl, end_lbl):
    i0 = labels.index(start_lbl)
    i1 = labels.index(end_lbl)
    return values[i0:i1]  # BUG: misses end_lbl!

print(slice_by_label(labels, values, "feb", "mar"))`,
          solutionCode: `labels = ["jan", "feb", "mar", "apr"]
values = [100, 120, 95, 140]

def slice_by_label(labels, values, start_lbl, end_lbl):
    i0 = labels.index(start_lbl)
    i1 = labels.index(end_lbl) + 1
    return values[i0:i1]

print(slice_by_label(labels, values, "feb", "mar"))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Includes end label',
              setup: 'print(slice_by_label(["jan", "feb", "mar", "apr"], [100, 120, 95, 140], "feb", "mar"))',
              expected: '[120, 95]',
              hidden: false,
            },
          ],
          hints: [
            'Python list slicing `values[i0:i1]` excludes `i1`.',
            'To make it inclusive like `loc`, add `+ 1` to `i1`.',
          ],
          points: 15,
        },
        {
          id: 'day25-ex16',
          title: 'Select Specific Rows and Columns via Label Lookup',
          type: 'write-code',
          tier: 'challenge',
          prompt: 'Write `select_loc(table, row_labels, cols)` where `table` is a dict mapping row labels to row dicts, returning a list of dicts containing only `cols` for each label in `row_labels`.',
          contextScenario: 'Projecting specific KPIs for selected regional hubs.',
          starterCode: `def select_loc(table, row_labels, cols):
    # Return [{c: table[r][c] for c in cols} for r in row_labels]
    pass

hubs = {
    "LON": {"orders": 420, "sla": 0.98, "cost": 1200},
    "NYC": {"orders": 610, "sla": 0.95, "cost": 1850},
}
print(select_loc(hubs, ["NYC"], ["orders", "sla"]))`,
          solutionCode: `def select_loc(table, row_labels, cols):
    return [{c: table[r][c] for c in cols} for r in row_labels]

hubs = {
    "LON": {"orders": 420, "sla": 0.98, "cost": 1200},
    "NYC": {"orders": 610, "sla": 0.95, "cost": 1850},
}
print(select_loc(hubs, ["NYC"], ["orders", "sla"]))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Selects rows and columns',
              setup: 'hubs = {"LON": {"orders": 420, "sla": 0.98, "cost": 1200}, "NYC": {"orders": 610, "sla": 0.95, "cost": 1850}}\nprint(select_loc(hubs, ["NYC"], ["orders", "sla"]))',
              expected: "[{'orders': 610, 'sla': 0.95}]",
              hidden: false,
            },
          ],
          hints: [
            'Iterate over `row_labels` in order.',
            'For each row label `r`, build a dict with `{c: table[r][c] for c in cols}`.',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day25-sub5',
      number: 5,
      title: 'Handling Missing Data: isna(), dropna() & fillna()',
      summary: 'Detect missing cells, drop selectively with subset=, and impute cleanly with fillna().',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Principled Missing-Data Pipelines',
        paragraphs: [
          'Missing values appear in Pandas as **`NaN`**, **`None`**, or **`pd.NA`**. Because **`NaN != NaN`** in IEEE 754 floating-point math, `df[df["price"] == np.nan]` always returns empty—always use **`df["price"].isna()`** (or `notna()`).',
          'You have two main strategies: **drop** incomplete rows with **`df.dropna(subset=["price"])`** (only dropping when critical columns are missing), or **impute** missing values with **`df.fillna({"city": "Unknown", "price": median_price})`**.',
        ],
        keyTerms: [
          {
            term: 'isna() / notna()',
            definition: 'Vectorised boolean masks detecting missing (NaN/None) vs present values.',
          },
          {
            term: 'dropna(subset=[...])',
            definition: 'Removes rows only where specified essential columns are missing.',
          },
        ],
        bulletPoints: [
          'Always compute imputation statistics (like `median()`) from training data only to avoid data leakage.',
          'Prefer `median()` over `mean()` when imputing skewed numeric columns.',
        ],
      },
      visualise: {
        type: 'missing-data-sim',
        title: 'Missing Data (NaN), dropna() & fillna() Pipeline',
        badge: 'simulation',
        description: 'Step through Raw DataFrame, isna() Mask, dropna(subset=...), and fillna(median).',
        initialConfig: {},
      },
      code: [
        {
          title: 'Median Imputation & Selective Missing-Row Filtering',
          runMode: 'real',
          code: `import statistics

prices = [120.0, None, 80.0, 100.0]
valid = [p for p in prices if p is not None]
med = statistics.median(valid)
imputed = [med if p is None else p for p in prices]

print("Missing count:", sum(1 for p in prices if p is None))
print("Imputed:", imputed)`,
          expectedOutput: `Missing count: 1
Imputed: [120.0, 100.0, 80.0, 100.0]`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: '[p for p in prices if p is not None]',
          internalEffect: 'Filters out missing entries before computing the median (100.0).',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: '[med if p is None else p for p in prices]',
          internalEffect: 'Replaces missing slots with 100.0 while keeping valid prices intact.',
        },
      ],
      apply: {
        domain: 'Healthcare Records',
        contextTitle: 'Dropping Rows Missing Required Patient IDs',
        scenario: 'Drop records missing `patient_id` while keeping records missing optional `notes`.',
        code: `rows = [{"id": "P1", "notes": None}, {"id": None, "notes": "ok"}, {"id": "P2", "notes": "ok"}]
kept = [r for r in rows if r["id"] is not None]
print("Kept IDs:", [r["id"] for r in kept])`,
        outcome: "Kept IDs: ['P1', 'P2']",
      },
      commonMistakes: [
        {
          label: 'Comparing Values Against float("nan") with ==',
          erroneousCode: `# [x for x in vals if x == float("nan")]  # Always [] because NaN != NaN!`,
          errorMessage: 'Silently misses all NaN values',
          explanation: 'Use `math.isnan(x)` in Python or `df.isna()` in Pandas.',
          correctedCode: `# [x for x in vals if math.isnan(x)]`,
        },
      ],
      sourceNotes: 'Covers isna, dropna, and fillna for Day 25.',
      practise: [
        {
          id: 'day25-ex17',
          title: 'Compound Boolean Mask Precedence',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Why does `df[df["amount"] > 100 & df["vip"] == True]` raise a `TypeError` or `ValueError` in Pandas?',
          contextScenario: 'Filtering high-value VIP transactions in a fintech fraud-review script.',
          options: [
            {
              id: 'a',
              text: 'Because `&` has higher operator precedence than `>` and `==`, so parentheses are required around each condition.',
              explanation: 'Correct! Without parentheses, Python evaluates `100 & df["vip"]` first. Always write `(df["amount"] > 100) & (df["vip"] == True)`.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'Because Pandas requires the Python keyword `and` instead of `&`.',
              explanation: 'Incorrect. Using `and` on Series raises `ValueError: The truth value of a Series is ambiguous`.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'Because boolean columns cannot be compared with `== True`.',
              explanation: 'Incorrect. Comparing a boolean Series with `== True` works, though `(df["vip"])` alone is cleaner.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Because `df[...]` only supports one condition at a time.',
              explanation: 'Incorrect. `df[...]` supports arbitrarily complex boolean masks when parenthesized.',
              isCorrect: false,
            },
          ],
          hints: [
            'Check Python operator precedence: bitwise `&` binds tighter than `<`, `>`, `==`.',
            'Wrap each comparison in parentheses: `(cond1) & (cond2)`.',
          ],
          points: 10,
        },
        {
          id: 'day25-ex18',
          title: 'Fix Chained Assignment That Loses Updates',
          type: 'fix-the-bug',
          tier: 'challenge',
          prompt: 'The function below mutates a copied slice instead of the original `rows` list (modeling `SettingWithCopyWarning`). Fix it so `"priority"` is updated in-place on `rows` for `"URGENT"` tickets.',
          contextScenario: 'Escalating SLA priority flags on support tickets.',
          starterCode: `tickets = [
    {"id": 1, "tag": "URGENT", "priority": 2},
    {"id": 2, "tag": "NORMAL", "priority": 3},
]

def escalate_urgent(rows):
    urgent_copy = [dict(r) for r in rows if r["tag"] == "URGENT"]
    for r in urgent_copy:
        r["priority"] = 1  # BUG: mutates copy, not original rows!

escalate_urgent(tickets)
print(tickets[0]["priority"])`,
          solutionCode: `tickets = [
    {"id": 1, "tag": "URGENT", "priority": 2},
    {"id": 2, "tag": "NORMAL", "priority": 3},
]

def escalate_urgent(rows):
    for r in rows:
        if r["tag"] == "URGENT":
            r["priority"] = 1

escalate_urgent(tickets)
print(tickets[0]["priority"])`,
          testCases: [
            {
              id: 'tc1',
              label: 'Updates original rows in place',
              setup: 't = [{"id": 1, "tag": "URGENT", "priority": 2}, {"id": 2, "tag": "NORMAL", "priority": 3}]\nescalate_urgent(t)\nprint(t[0]["priority"], t[1]["priority"])',
              expected: '1 3',
              hidden: false,
            },
          ],
          hints: [
            'Do not create a filtered copy if your goal is to mutate the original table.',
            'Iterate over `rows` directly and update when `r["tag"] == "URGENT"` (just like `df.loc[mask, "priority"] = 1`).',
          ],
          points: 20,
        },
        {
          id: 'day25-ex19',
          title: 'Filter Rows with Compound Mask & Exclusion',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Write `filter_eligible(records)` returning IDs where `(score >= 80 or referral == True) and not banned`.',
          contextScenario: 'Selecting eligible applicants for a fast-track credit line.',
          starterCode: `def filter_eligible(records):
    # Return list of ids matching (score >= 80 or referral) and not banned
    pass

apps = [
    {"id": "A1", "score": 82, "referral": False, "banned": False},
    {"id": "A2", "score": 65, "referral": True, "banned": True},
    {"id": "A3", "score": 70, "referral": True, "banned": False},
]
print(filter_eligible(apps))`,
          solutionCode: `def filter_eligible(records):
    return [
        r["id"]
        for r in records
        if (r["score"] >= 80 or r["referral"]) and not r["banned"]
    ]

apps = [
    {"id": "A1", "score": 82, "referral": False, "banned": False},
    {"id": "A2", "score": 65, "referral": True, "banned": True},
    {"id": "A3", "score": 70, "referral": True, "banned": False},
]
print(filter_eligible(apps))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Applies compound boolean mask',
              setup: 'apps = [{"id": "A1", "score": 82, "referral": False, "banned": False}, {"id": "A2", "score": 65, "referral": True, "banned": True}, {"id": "A3", "score": 70, "referral": True, "banned": False}]\nprint(filter_eligible(apps))',
              expected: "['A1', 'A3']",
              hidden: false,
            },
          ],
          hints: [
            'Use parentheses around `(r["score"] >= 80 or r["referral"])`.',
            'Combine with `and not r["banned"]`.',
          ],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day25-sub6',
      number: 6,
      title: 'Vectorised Column Transforms, assign() & apply() Tradeoffs',
      summary: 'Create derived columns cleanly with vectorised math and know when apply() slows down.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Vectorised Columns First, apply() Last',
        paragraphs: [
          'Creating a derived column in Pandas is clearest with vectorised column arithmetic (`df["total"] = df["qty"] * df["price"]`) or functional chaining via **`.assign(total=lambda d: d["qty"] * d["price"])`**.',
          'Avoid calling **`df.apply(func, axis=1)`** for simple arithmetic or string operations—`apply(axis=1)` runs a slow Python loop row by row! Reserve `apply()` only for complex custom Python logic that cannot be expressed vectorially (e.g., `df["name"].str.strip().str.lower()`).',
        ],
        keyTerms: [
          {
            term: '.assign(...)',
            definition: 'Returns a new DataFrame with added/overwritten columns, ideal for method chaining.',
          },
          {
            term: '.str Accessor',
            definition: 'Vectorised string methods on Series (e.g., df["email"].str.strip().str.lower()).',
          },
        ],
        bulletPoints: [
          'Use `df["col"].str.strip()` instead of `df["col"].apply(lambda s: s.strip())`.',
          'Use `np.where(cond, a, b)` for fast vectorised if-else column creation.',
        ],
      },
      visualise: {
        type: 'missing-data-sim',
        title: 'Columnar Transform & Imputation Pipeline',
        badge: 'simulation',
        description: 'Inspect how column transforms and fillna() produce clean analysis-ready tables.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Derived Column & String Normalization Pipeline',
          runMode: 'real',
          code: `orders = [
    {"sku": " a1 ", "qty": 2, "price": 15.0},
    {"sku": " b2 ", "qty": 3, "price": 10.0},
]

transformed = [
    {**o, "sku": o["sku"].strip().upper(), "total": o["qty"] * o["price"]}
    for o in orders
]
print(transformed)`,
          expectedOutput: "[{'sku': 'A1', 'qty': 2, 'price': 15.0, 'total': 30.0}, {'sku': 'B2', 'qty': 3, 'price': 10.0, 'total': 30.0}]",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 7,
          instruction: 'o["sku"].strip().upper()',
          internalEffect: 'Normalizes whitespace and casing (equivalent to .str.strip().str.upper()).',
        },
        {
          step: 2,
          codeLine: 7,
          instruction: '"total": o["qty"] * o["price"]',
          internalEffect: 'Computes derived revenue column without mutating the original list.',
        },
      ],
      apply: {
        domain: 'E-Commerce',
        contextTitle: 'Conditional Tier Labeling (np.where Pattern)',
        scenario: 'Tag orders >= $100 as `"VIP"` and others as `"Standard"`.',
        code: `totals = [45.0, 120.0, 99.0, 250.0]
tiers = ["VIP" if t >= 100 else "Standard" for t in totals]
print("Tiers:", tiers)`,
        outcome: "Tiers: ['Standard', 'VIP', 'Standard', 'VIP']",
      },
      commonMistakes: [
        {
          label: 'Using df.apply(..., axis=1) for Simple Arithmetic',
          erroneousCode: `# df["total"] = df.apply(lambda r: r["qty"] * r["price"], axis=1)  # 50x slower!`,
          errorMessage: 'Severe performance bottleneck on large DataFrames',
          explanation: 'Use direct vectorised column arithmetic `df["qty"] * df["price"]`.',
          correctedCode: `# df["total"] = df["qty"] * df["price"]`,
        },
      ],
      sourceNotes: 'Covers vectorised transforms, assign(), and apply() for Day 25.',
      practise: [
        {
          id: 'day25-ex20',
          title: 'Predict dropna(subset=...) Row Survival',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'A 4-row clinical table has `patient_id` (no nulls), `bp_systolic` (1 null in row 2), and `notes` (3 nulls in rows 0, 1, 3). How many rows remain after `df.dropna(subset=["bp_systolic"])` vs `df.dropna()`?',
          contextScenario: 'Cleaning patient vitals before running a blood-pressure regression.',
          options: [
            {
              id: 'a',
              text: 'dropna(subset=["bp_systolic"]) keeps 3 rows; bare dropna() keeps 0 rows.',
              explanation: 'Correct! Every row has a null in either bp_systolic or notes, so bare `dropna()` wipes out the entire table, while `subset=["bp_systolic"]` only drops row 2.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'Both keep 3 rows.',
              explanation: 'Incorrect. Bare `dropna()` checks all columns (`how="any"` by default).',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'dropna(subset=["bp_systolic"]) keeps 1 row; bare dropna() keeps 1 row.',
              explanation: 'Incorrect. Row 2 has non-null notes, and rows 0,1,3 have non-null bp_systolic.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'dropna(subset=["bp_systolic"]) drops the bp_systolic column.',
              explanation: 'Incorrect. `dropna` drops rows by default (`axis=0`), not columns.',
              isCorrect: false,
            },
          ],
          hints: [
            'Default `df.dropna()` drops a row if ANY column is NaN.',
            '`subset=["bp_systolic"]` restricts the null check to `bp_systolic` only.',
          ],
          points: 10,
        },
        {
          id: 'day25-ex21',
          title: 'Complete Group-Mean Imputation',
          type: 'fill-the-gaps',
          tier: 'challenge',
          prompt: 'Fill in the two Pandas methods to impute missing `price` values using each `category` group’s mean rather than the global mean.',
          contextScenario: 'Imputing missing catalog prices across Electronics ($400 avg) and Stationery ($8 avg).',
          gaps: [
            {
              id: 'g1',
              beforeText: 'group_means = df.',
              afterText: '("category")["price"].',
              correctAnswer: 'groupby',
              options: ['groupby', 'merge', 'pivot', 'agg'],
            },
            {
              id: 'g2',
              beforeText: '',
              afterText: '("mean")\ndf["price"] = df["price"].fillna(group_means)',
              correctAnswer: 'transform',
              options: ['transform', 'apply', 'mean', 'sum'],
            },
          ],
          hints: [
            'First partition rows by `"category"` using `groupby`.',
            'Use `transform("mean")` so the output aligns 1-to-1 with the original DataFrame index.',
          ],
          points: 20,
        },
        {
          id: 'day25-ex22',
          title: 'Implement Group-Mean Missing-Value Imputer',
          type: 'write-code',
          tier: 'challenge',
          prompt: 'Write `impute_by_group(rows, group_col, val_col)` that replaces `None` in `val_col` with the rounded mean (2 decimals) of non-null values in that same `group_col`.',
          contextScenario: 'Imputing missing sensor temperatures per climate zone.',
          starterCode: `from collections import defaultdict

def impute_by_group(rows, group_col, val_col):
    # Compute mean per group, then replace None in val_col with round(mean, 2)
    pass

data = [
    {"zone": "A", "temp": 20.0},
    {"zone": "A", "temp": None},
    {"zone": "A", "temp": 24.0},
    {"zone": "B", "temp": 10.0},
]
print(impute_by_group(data, "zone", "temp")[1]["temp"])`,
          solutionCode: `from collections import defaultdict

def impute_by_group(rows, group_col, val_col):
    buckets = defaultdict(list)
    for r in rows:
        if r[val_col] is not None:
            buckets[r[group_col]].append(r[val_col])
    means = {g: round(sum(vals) / len(vals), 2) for g, vals in buckets.items()}
    out = []
    for r in rows:
        copy = dict(r)
        if copy[val_col] is None:
            copy[val_col] = means[copy[group_col]]
        out.append(copy)
    return out

data = [
    {"zone": "A", "temp": 20.0},
    {"zone": "A", "temp": None},
    {"zone": "A", "temp": 24.0},
    {"zone": "B", "temp": 10.0},
]
print(impute_by_group(data, "zone", "temp")[1]["temp"])`,
          testCases: [
            {
              id: 'tc1',
              label: 'Imputes using group mean',
              setup: 'd = [{"zone": "A", "temp": 20.0}, {"zone": "A", "temp": None}, {"zone": "A", "temp": 24.0}, {"zone": "B", "temp": 10.0}]\nprint(impute_by_group(d, "zone", "temp")[1]["temp"])',
              expected: '22.0',
              hidden: false,
            },
          ],
          hints: [
            'Collect non-None values into `buckets[r[group_col]]`.',
            'Compute `means[g] = round(sum(vals) / len(vals), 2)`.',
            'Return new row dicts where `None` is replaced by `means[r[group_col]]`.',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day25-sub7',
      number: 7,
      title: 'GroupBy Split-Apply-Combine & Multi-Metric agg()',
      summary: 'Group rows by categorical keys and compute named summary metrics per group.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Split-Apply-Combine Aggregation',
        paragraphs: [
          'Pandas **`groupby()`** implements the classic **Split-Apply-Combine** pattern: (1) **Split** the DataFrame into sub-tables by unique key values (e.g., `"dept"`), (2) **Apply** an aggregation (`sum`, `mean`, `count`, `max`) to each group, and (3) **Combine** the results into a summary table.',
          'Modern Pandas named aggregation **`df.groupby("dept", as_index=False).agg(total=("amount", "sum"), avg=("amount", "mean"))`** produces clean, flat column names with no MultiIndex headaches.',
        ],
        keyTerms: [
          {
            term: 'Split-Apply-Combine',
            definition: 'Three-stage grouping model: partition by key, aggregate each partition, merge outputs.',
          },
          {
            term: 'as_index=False',
            definition: 'Keeps grouping keys as normal columns instead of turning them into the DataFrame Index.',
          },
        ],
        bulletPoints: [
          'Remember: `groupby().count()` counts non-null values, whereas `groupby().size()` counts all rows including `NaN`.',
          'Use named `.agg(col_out=("col_in", "func"))` for readable summary schemas.',
        ],
      },
      visualise: {
        type: 'groupby-merge-sim',
        title: 'GroupBy Split-Apply-Combine & Merge/Join Lab',
        badge: 'simulation',
        description: 'Inspect `groupby().agg()` output and compare it against merge/concat.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Split-Apply-Combine Aggregation with defaultdict',
          runMode: 'real',
          code: `from collections import defaultdict

rows = [
    {"dept": "Eng", "amount": 200.0},
    {"dept": "Sales", "amount": 120.0},
    {"dept": "Eng", "amount": 150.0},
]

groups = defaultdict(list)
for r in rows:
    groups[r["dept"]].append(r["amount"])

summary = {
    dept: {"total": sum(vals), "avg": sum(vals) / len(vals)}
    for dept, vals in sorted(groups.items())
}
print(summary)`,
          expectedOutput: "{'Eng': {'total': 350.0, 'avg': 175.0}, 'Sales': {'total': 120.0, 'avg': 120.0}}",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 10,
          instruction: 'groups[r["dept"]].append(r["amount"])',
          internalEffect: 'Split stage: partitions amounts by department key.',
        },
        {
          step: 2,
          codeLine: 14,
          instruction: '{"total": sum(vals), "avg": ...}',
          internalEffect: 'Apply & Combine stage: computes total and mean per group.',
        },
      ],
      apply: {
        domain: 'SaaS Billing',
        contextTitle: 'Monthly Recurring Revenue by Plan Tier',
        scenario: 'Sum subscription revenue per plan tier.',
        code: `from collections import defaultdict
subs = [("Pro", 49), ("Free", 0), ("Pro", 49), ("Team", 199)]
mrr = defaultdict(int)
for plan, amt in subs:
    mrr[plan] += amt
print(dict(sorted(mrr.items())))`,
        outcome: "{'Free': 0, 'Pro': 98, 'Team': 199}",
      },
      commonMistakes: [
        {
          label: 'Confusing GroupBy count() vs. size()',
          erroneousCode: `# df.groupby("dept")["bonus"].count()  # Skips rows where bonus is NaN!`,
          errorMessage: 'Under-counts group size when the target column has missing values',
          explanation: 'Use `.size()` (or `("id", "count")` on a non-null ID column) to count total rows per group.',
          correctedCode: `# df.groupby("dept", as_index=False).size()`,
        },
      ],
      sourceNotes: 'Covers groupby Split-Apply-Combine for Day 25.',
      practise: [
        {
          id: 'day25-ex23',
          title: 'Vectorised Arithmetic vs Row-Wise apply()',
          type: 'theory-reasoning',
          tier: 'standard',
          prompt: 'Why is `df["total"] = df["qty"] * df["unit_price"]` dramatically faster than `df.apply(lambda r: r["qty"] * r["unit_price"], axis=1)` on a 1-million-row DataFrame?',
          contextScenario: 'Optimizing a nightly invoice-line-item batch job that timed out.',
          modelAnswer: 'Vectorised column multiplication delegates directly to compiled C/NumPy loops over contiguous arrays, whereas `apply(..., axis=1)` constructs a Python Series object for each of the 1,000,000 rows and invokes a Python lambda 1,000,000 times.',
          markingCriteria: [
            { id: 'mc1', label: 'Identifies compiled C/NumPy vectorised loop for column arithmetic', points: 5 },
            { id: 'mc2', label: 'Explains row-wise apply() Python loop and per-row Series construction overhead', points: 5 },
          ],
          hints: [
            'Compare C-level array loops vs Python interpreter function calls.',
            'What object does `apply(axis=1)` pass to your lambda on every row?',
          ],
          points: 15,
        },
        {
          id: 'day25-ex24',
          title: 'Order the Method-Chaining Transformation Pipeline',
          type: 'order-the-lines',
          tier: 'standard',
          prompt: 'Order these lines to build a clean method-chained transformation using `.assign()` and `.sort_values()`.',
          contextScenario: 'Computing net margin and ranking top-performing SKUs.',
          jumbledLines: [
            { id: 'l2', code: '    .assign(net_margin=lambda d: d["revenue"] - d["cogs"])', indent: 0 },
            { id: 'l1', code: 'report = (df[df["units"] > 0]', indent: 0 },
            { id: 'l4', code: '    .reset_index(drop=True))', indent: 0 },
            { id: 'l3', code: '    .sort_values("net_margin", ascending=False)', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: [
            'Start by filtering `units > 0`.',
            'Compute `net_margin` with `.assign(...)` before sorting by it.',
            'Finish with `.reset_index(drop=True)`.',
          ],
          points: 10,
        },
        {
          id: 'day25-ex25',
          title: 'Add Derived Margin & Tier Columns',
          type: 'write-code',
          tier: 'project',
          prompt: 'Write `enrich_orders(rows)` that adds `"total": round(r["qty"] * r["price"], 2)` and `"tier": "bulk" if r["qty"] >= 10 else "retail"` to each copied row dict.',
          contextScenario: 'Enriching B2B/B2C order records for downstream pricing analytics.',
          starterCode: `def enrich_orders(rows):
    # Return new list of dicts with "total" and "tier" added
    pass

sample = [{"sku": "X1", "qty": 12, "price": 5.5}, {"sku": "X2", "qty": 2, "price": 10.0}]
print(enrich_orders(sample))`,
          solutionCode: `def enrich_orders(rows):
    return [
        {
            **r,
            "total": round(r["qty"] * r["price"], 2),
            "tier": "bulk" if r["qty"] >= 10 else "retail",
        }
        for r in rows
    ]

sample = [{"sku": "X1", "qty": 12, "price": 5.5}, {"sku": "X2", "qty": 2, "price": 10.0}]
print(enrich_orders(sample))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Enriches total and tier',
              setup: 's = [{"sku": "X1", "qty": 12, "price": 5.5}, {"sku": "X2", "qty": 2, "price": 10.0}]\nprint(enrich_orders(s))',
              expected: "[{'sku': 'X1', 'qty': 12, 'price': 5.5, 'total': 66.0, 'tier': 'bulk'}, {'sku': 'X2', 'qty': 2, 'price': 10.0, 'total': 20.0, 'tier': 'retail'}]",
              hidden: false,
            },
          ],
          hints: [
            'Use dictionary unpacking `{**r, "total": ..., "tier": ...}`.',
            'Round `qty * price` to 2 decimal places.',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day25-sub8',
      number: 8,
      title: 'Merging & Joining DataFrames (pd.merge & pd.concat)',
      summary: 'Combine relational tables by key (inner vs left join) and stack tables vertically.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Relational Joins & Vertical Stacking in Pandas',
        paragraphs: [
          'Real analytics pipelines rarely live in one table. **`pd.merge(left, right, on="cust_id", how="inner")`** joins two DataFrames on a shared key column, just like SQL.',
          'Choose **`how="inner"`** to keep only matching keys in both tables, or **`how="left"`** to preserve every row from the left table (filling unmatched right columns with **`NaN`**). To stack tables with identical columns vertically, use **`pd.concat([jan_df, feb_df], ignore_index=True)`**.',
        ],
        keyTerms: [
          {
            term: 'how="inner" vs. how="left"',
            definition: 'Inner keeps only intersecting keys; left preserves all left-table rows with NaN for unmatched right keys.',
          },
          {
            term: 'pd.concat(..., ignore_index=True)',
            definition: 'Stacks DataFrames vertically while resetting row index labels to 0..N-1.',
          },
        ],
        bulletPoints: [
          'Check for duplicate keys in lookup tables before merging—a many-to-many join multiplies row counts unexpectedly!',
          'Use `validate="many_to_one"` in `pd.merge()` to catch accidental duplicate lookup keys early.',
        ],
      },
      visualise: {
        type: 'groupby-merge-sim',
        title: 'Inner Join, Left Join & Concat Visualizer',
        badge: 'simulation',
        description: 'Toggle `merge(how="inner")`, `merge(how="left")`, and `pd.concat()` to inspect key matching.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Implementing Inner & Left Joins in Python',
          runMode: 'real',
          code: `orders = [{"oid": 101, "cid": "C1"}, {"oid": 102, "cid": "C9"}]
customers = {"C1": "Ada", "C2": "Grace"}

inner_join = [
    {**o, "name": customers[o["cid"]]}
    for o in orders if o["cid"] in customers
]
left_join = [
    {**o, "name": customers.get(o["cid"], None)}
    for o in orders
]

print("Inner:", inner_join)
print("Left:", left_join)`,
          expectedOutput: `Inner: [{'oid': 101, 'cid': 'C1', 'name': 'Ada'}]
Left: [{'oid': 101, 'cid': 'C1', 'name': 'Ada'}, {'oid': 102, 'cid': 'C9', 'name': None}]`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 6,
          instruction: 'if o["cid"] in customers',
          internalEffect: 'Inner join drops order 102 because C9 has no customer match.',
        },
        {
          step: 2,
          codeLine: 9,
          instruction: 'customers.get(o["cid"], None)',
          internalEffect: 'Left join retains order 102 with name=None (NaN in Pandas).',
        },
      ],
      apply: {
        domain: 'ETL Pipelines',
        contextTitle: 'Enriching Event Logs with User Metadata',
        scenario: 'Left-join click events against a user tier lookup table.',
        code: `events = [{"uid": 1, "page": "/home"}, {"uid": 3, "page": "/pricing"}]
tiers = {1: "Pro", 2: "Free"}
enriched = [{**e, "tier": tiers.get(e["uid"], "Guest")} for e in events]
print(enriched)`,
        outcome: "[{'uid': 1, 'page': '/home', 'tier': 'Pro'}, {'uid': 3, 'page': '/pricing', 'tier': 'Guest'}]",
      },
      commonMistakes: [
        {
          label: 'Forgetting ignore_index=True in pd.concat()',
          erroneousCode: `# pd.concat([df1, df2])  # Leaves duplicate index 0, 1, 0, 1!`,
          errorMessage: 'df.loc[0] unexpectedly returns 2 rows instead of 1',
          explanation: 'Pass `ignore_index=True` when stacking DataFrames vertically.',
          correctedCode: `# pd.concat([df1, df2], ignore_index=True)`,
        },
      ],
      sourceNotes: 'Covers pd.merge and pd.concat for Day 25.',
      practise: [
        {
          id: 'day25-ex26',
          title: 'Choosing Between agg() and transform() After groupby()',
          type: 'scenario-mcq',
          tier: 'standard',
          prompt: 'You want to add a new column `pct_of_dept` showing each employee’s salary divided by their department’s total salary, while keeping all employee rows. Which pattern works directly?',
          contextScenario: 'Computing compensation share within each engineering team.',
          options: [
            {
              id: 'a',
              text: 'df["salary"] / df.groupby("dept")["salary"].transform("sum")',
              explanation: 'Correct! `transform("sum")` broadcasts the group total back to every original row index so division aligns 1-to-1.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'df["salary"] / df.groupby("dept")["salary"].sum()',
              explanation: 'Incorrect. `.sum()` collapses to one row per department, so dividing by the full `df["salary"]` produces all NaNs.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'df.groupby("dept")["salary"].agg("sum")',
              explanation: 'Incorrect. `agg("sum")` also reduces to one row per group.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'df["salary"].value_counts()',
              explanation: 'Incorrect. `value_counts()` counts frequency of distinct salary numbers.',
              isCorrect: false,
            },
          ],
          hints: [
            'Does `.sum()` keep the original row count or reduce to 1 row per group?',
            'Which GroupBy method preserves the original DataFrame length?',
          ],
          points: 15,
        },
        {
          id: 'day25-ex27',
          title: 'Trace Split-Apply-Combine Named Aggregation',
          type: 'explain-the-trace',
          tier: 'challenge',
          prompt: 'Trace what `df.groupby("carrier").agg(shipments=("id", "count"), avg_days=("days", "mean"))` produces for 2 carriers.',
          contextScenario: 'Evaluating carrier SLA performance in a logistics dashboard.',
          traceStepCode: `rows = [
    {"id": 1, "carrier": "FastShip", "days": 2},
    {"id": 2, "carrier": "EcoPost", "days": 5},
    {"id": 3, "carrier": "FastShip", "days": 4},
]`,
          traceQuestion: 'What are the index labels, column names, and values of the resulting aggregated table?',
          modelAnswer: 'The result has carrier as the index ("EcoPost", "FastShip"), two columns named "shipments" and "avg_days", with EcoPost=(shipments: 1, avg_days: 5.0) and FastShip=(shipments: 2, avg_days: 3.0).',
          markingCriteria: [
            { id: 'mc1', label: 'Identifies carrier as the grouped index', points: 5 },
            { id: 'mc2', label: 'Reports exact named columns shipments and avg_days', points: 5 },
            { id: 'mc3', label: 'Computes EcoPost (1, 5.0) and FastShip (2, 3.0)', points: 5 },
          ],
          hints: [
            'Split the 3 rows by `"carrier"`.',
            'Apply `count` to `"id"` and `mean` to `"days"`.',
          ],
          points: 15,
        },
        {
          id: 'day25-ex28',
          title: 'GroupBy Multi-Metric Aggregation Engine',
          type: 'write-code',
          tier: 'project',
          prompt: 'Write `groupby_summary(rows, key_col, val_col)` returning a dict sorted by group key where each value is `{"count": n, "sum": round(s, 2), "mean": round(s / n, 2)}`.',
          contextScenario: 'Building a reusable revenue-by-region aggregator.',
          starterCode: `from collections import defaultdict

def groupby_summary(rows, key_col, val_col):
    # Return {group: {"count": n, "sum": ..., "mean": ...}} sorted by group
    pass

tx = [
    {"region": "EU", "rev": 100.0},
    {"region": "US", "rev": 250.0},
    {"region": "EU", "rev": 50.0},
]
print(groupby_summary(tx, "region", "rev"))`,
          solutionCode: `from collections import defaultdict

def groupby_summary(rows, key_col, val_col):
    buckets = defaultdict(list)
    for r in rows:
        buckets[r[key_col]].append(r[val_col])
    return {
        k: {
            "count": len(buckets[k]),
            "sum": round(sum(buckets[k]), 2),
            "mean": round(sum(buckets[k]) / len(buckets[k]), 2),
        }
        for k in sorted(buckets)
    }

tx = [
    {"region": "EU", "rev": 100.0},
    {"region": "US", "rev": 250.0},
    {"region": "EU", "rev": 50.0},
]
print(groupby_summary(tx, "region", "rev"))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Computes sorted group summary',
              setup: 'tx = [{"region": "EU", "rev": 100.0}, {"region": "US", "rev": 250.0}, {"region": "EU", "rev": 50.0}]\nprint(groupby_summary(tx, "region", "rev"))',
              expected: "{'EU': {'count': 2, 'sum': 150.0, 'mean': 75.0}, 'US': {'count': 1, 'sum': 250.0, 'mean': 250.0}}",
              hidden: false,
            },
          ],
          hints: [
            'Group values into `buckets[r[key_col]]`.',
            'Iterate `for k in sorted(buckets)` to build the output dict.',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day25-sub9',
      number: 9,
      title: 'Sorting, Deduplicating & Exporting Clean Datasets',
      summary: 'Sort multi-column tables, remove duplicates safely, and export without unwanted index columns.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Finalizing & Exporting Analysis-Ready Tables',
        paragraphs: [
          'Before exporting a cleaned DataFrame, sort deterministically with **`df.sort_values(by=["dept", "price"], ascending=[True, False])`** and remove duplicate records with **`df.drop_duplicates(subset=["order_id"], keep="last")`**.',
          'When writing CSVs, **always pass `index=False`** (`df.to_csv("clean.csv", index=False)`), otherwise Pandas writes an extra `Unnamed: 0` index column that pollutes downstream tools.',
        ],
        keyTerms: [
          {
            term: 'drop_duplicates(subset=..., keep=...)',
            definition: 'Removes duplicate rows based on key columns, keeping first, last, or dropping all.',
          },
          {
            term: 'to_csv(..., index=False)',
            definition: 'Exports DataFrame rows to CSV without writing the synthetic 0..N row index.',
          },
        ],
        bulletPoints: [
          'Use `keep="last"` after sorting by timestamp to retain the latest status per ID.',
          'Always pass `index=False` to `to_csv()` unless the row index is a meaningful domain key.',
        ],
      },
      visualise: {
        type: 'groupby-merge-sim',
        title: 'Clean Output Table & Export Preview',
        badge: 'simulation',
        description: 'Inspect clean summary tables ready for CSV/JSON export.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Deduplicating by ID (Keep Last) & Multi-Key Sorting',
          runMode: 'real',
          code: `events = [
    {"id": 1, "ts": 10, "status": "pending"},
    {"id": 2, "ts": 15, "status": "paid"},
    {"id": 1, "ts": 20, "status": "shipped"},
]

# Keep latest record per id (like drop_duplicates(subset=["id"], keep="last"))
latest_by_id = {}
for ev in sorted(events, key=lambda x: x["ts"]):
    latest_by_id[ev["id"]] = ev

result = sorted(latest_by_id.values(), key=lambda x: x["id"])
print(result)`,
          expectedOutput: "[{'id': 1, 'ts': 20, 'status': 'shipped'}, {'id': 2, 'ts': 15, 'status': 'paid'}]",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 9,
          instruction: 'sorted(events, key=lambda x: x["ts"])',
          internalEffect: 'Orders events chronologically so later statuses overwrite earlier ones.',
        },
        {
          step: 2,
          codeLine: 10,
          instruction: 'latest_by_id[ev["id"]] = ev',
          internalEffect: 'Deduplicates by id while keeping the most recent event.',
        },
      ],
      apply: {
        domain: 'Reporting Export',
        contextTitle: 'Serializing Cleaned Records to JSON',
        scenario: 'Sort products by descending price and export clean JSON.',
        code: `import json
items = [{"sku": "B", "price": 12}, {"sku": "A", "price": 75}]
ordered = sorted(items, key=lambda x: -x["price"])
print(json.dumps(ordered))`,
        outcome: '[{"sku": "A", "price": 75}, {"sku": "B", "price": 12}]',
      },
      commonMistakes: [
        {
          label: 'Exporting CSV Without index=False',
          erroneousCode: `# df.to_csv("report.csv")  # Writes extra ",0,1,2..." Unnamed: 0 column!`,
          errorMessage: 'Downstream CSV readers see an unexpected Unnamed: 0 column',
          explanation: 'Always pass `index=False` to `df.to_csv("report.csv", index=False)`.',
          correctedCode: `# df.to_csv("report.csv", index=False)`,
        },
      ],
      sourceNotes: 'Covers sorting, deduplication, and CSV/JSON export for Day 25.',
      practise: [
        {
          id: 'day25-ex29',
          title: 'Row Explosion on Many-to-Many Merge',
          type: 'predict-output',
          tier: 'challenge',
          prompt: 'Table `A` has 2 rows with `sku="X"`, and Table `B` has 3 rows with `sku="X"`. How many rows with `sku="X"` appear in `pd.merge(A, B, on="sku", how="inner")`?',
          contextScenario: 'Diagnosing why a warehouse-to-promotion join tripled revenue totals.',
          options: [
            {
              id: 'a',
              text: '6 rows (the 2 x 3 Cartesian product for matching key "X").',
              explanation: 'Correct! Duplicate keys on both sides of a merge multiply rows (`2 * 3 = 6`), which can silently inflate `sum()` aggregations.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: '3 rows (matching the larger table).',
              explanation: 'Incorrect. `merge` pairs every matching row on the left with every matching row on the right.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '2 rows (matching the left table).',
              explanation: 'Incorrect. Even a left join produces 6 rows when the right table has 3 matches per left row.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: '1 row (Pandas deduplicates join keys automatically).',
              explanation: 'Incorrect. Pandas never deduplicates join keys; pass `validate="many_to_one"` to catch unexpected duplicates.',
              isCorrect: false,
            },
          ],
          hints: [
            'Every match on the left pairs with every match on the right.',
            'Multiply 2 left rows by 3 right rows.',
          ],
          points: 15,
        },
        {
          id: 'day25-ex30',
          title: 'Fix Left-Join Missing Right-Key Lookup',
          type: 'fix-the-bug',
          tier: 'project',
          prompt: 'This `left_join` crashes with `KeyError` when a left row’s key is missing in `right_rows`. Fix it so unmatched left rows get `None` for right columns (like `how="left"`).',
          contextScenario: 'Enriching customer orders with optional loyalty-tier metadata.',
          starterCode: `def left_join(left_rows, right_rows, key, right_cols):
    right_map = {r[key]: r for r in right_rows}
    out = []
    for lr in left_rows:
        rr = right_map[lr[key]]  # BUG: KeyError if unmatched!
        merged = {**lr, **{c: rr[c] for c in right_cols}}
        out.append(merged)
    return out

orders = [{"cid": 1, "amt": 50}, {"cid": 2, "amt": 30}]
tiers = [{"cid": 1, "tier": "Gold"}]
print(left_join(orders, tiers, "cid", ["tier"]))`,
          solutionCode: `def left_join(left_rows, right_rows, key, right_cols):
    right_map = {r[key]: r for r in right_rows}
    out = []
    for lr in left_rows:
        rr = right_map.get(lr[key], {})
        merged = {**lr, **{c: rr.get(c) for c in right_cols}}
        out.append(merged)
    return out

orders = [{"cid": 1, "amt": 50}, {"cid": 2, "amt": 30}]
tiers = [{"cid": 1, "tier": "Gold"}]
print(left_join(orders, tiers, "cid", ["tier"]))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Preserves unmatched left rows with None',
              setup: 'orders = [{"cid": 1, "amt": 50}, {"cid": 2, "amt": 30}]\ntiers = [{"cid": 1, "tier": "Gold"}]\nprint(left_join(orders, tiers, "cid", ["tier"]))',
              expected: "[{'cid': 1, 'amt': 50, 'tier': 'Gold'}, {'cid': 2, 'amt': 30, 'tier': None}]",
              hidden: false,
            },
          ],
          hints: [
            'Use `right_map.get(lr[key], {})` instead of `right_map[...]`.',
            'Use `rr.get(c)` so missing columns default to `None`.',
          ],
          points: 20,
        },
        {
          id: 'day25-ex31',
          title: 'Deduplicate Keep-Last & Export Clean CSV',
          type: 'write-code',
          tier: 'project',
          prompt: 'Write `dedup_and_export(events)` that sorts `events` by `"ts"`, keeps only the latest event per `"id"` (`keep="last"`), sorts the final rows by `"id"`, and returns a CSV string without an extra index column.',
          contextScenario: 'Exporting final shipment statuses to an external warehouse CSV.',
          starterCode: `import csv, io

def dedup_and_export(events):
    # Keep latest ts per id, sort by id, export CSV with columns id,ts,status (no index)
    pass

evs = [
    {"id": 2, "ts": 10, "status": "packed"},
    {"id": 1, "ts": 5, "status": "created"},
    {"id": 1, "ts": 12, "status": "shipped"},
]
print(dedup_and_export(evs).strip())`,
          solutionCode: `import csv, io

def dedup_and_export(events):
    latest = {}
    for ev in sorted(events, key=lambda x: x["ts"]):
        latest[ev["id"]] = ev
    ordered = sorted(latest.values(), key=lambda x: x["id"])
    buf = io.StringIO()
    writer = csv.DictWriter(buf, fieldnames=["id", "ts", "status"], lineterminator="\\n")
    writer.writeheader()
    writer.writerows(ordered)
    return buf.getvalue()

evs = [
    {"id": 2, "ts": 10, "status": "packed"},
    {"id": 1, "ts": 5, "status": "created"},
    {"id": 1, "ts": 12, "status": "shipped"},
]
print(dedup_and_export(evs).strip())`,
          testCases: [
            {
              id: 'tc1',
              label: 'Deduplicates keep=last and exports clean CSV',
              setup: 'evs = [{"id": 2, "ts": 10, "status": "packed"}, {"id": 1, "ts": 5, "status": "created"}, {"id": 1, "ts": 12, "status": "shipped"}]\nprint(dedup_and_export(evs).strip())',
              expected: 'id,ts,status\n1,12,shipped\n2,10,packed',
              hidden: false,
            },
          ],
          hints: [
            'Sort chronologically by `ts` and overwrite `latest[ev["id"]] = ev`.',
            'Sort `latest.values()` by `id` and write with `csv.DictWriter`.',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
  ],
  realWorldLabs: [
    {
      id: 'day25-lab1',
      title: 'Clinical Trial Lab Results Normalization & Imputation',
      description: 'Parse raw clinical lab CSV records with sentinel missing values ("N/A", ""), drop rows missing patient_id, impute missing biomarker readings using cohort-arm means, and print the cohort summary.',
      domain: 'Healthcare Analytics',
      starterCode: `import csv, io
from collections import defaultdict

raw_csv = """patient_id,arm,biomarker
P01,control,4.2
P02,control,N/A
P03,control,4.8
,treatment,6.1
P04,treatment,6.0
P05,treatment,
P06,treatment,6.4"""

# 1. Parse CSV, treat "N/A" and "" in biomarker as None
# 2. Drop rows where patient_id is empty (like dropna(subset=["patient_id"]))
# 3. Impute missing biomarker with the arm mean (rounded to 2 decimals)
# 4. Print sorted cohort summary: arm -> count, mean
`,
      targetOutput: `control: count=3, mean=4.5
treatment: count=3, mean=6.2`,
    },
    {
      id: 'day25-lab2',
      title: 'Multi-Warehouse Shipment & Carrier SLA Join Pipeline',
      description: 'Deduplicate shipment status logs keeping the latest timestamp per shipment_id, left-join with carrier SLA targets, flag late deliveries, and print per-carrier on-time counts.',
      domain: 'Supply Chain & Logistics',
      starterCode: `shipments = [
    {"ship_id": "S1", "ts": 1, "carrier": "AirEx", "days": 3},
    {"ship_id": "S1", "ts": 2, "carrier": "AirEx", "days": 2},
    {"ship_id": "S2", "ts": 1, "carrier": "RoadCo", "days": 6},
    {"ship_id": "S3", "ts": 1, "carrier": "AirEx", "days": 4},
]
carrier_sla = {"AirEx": 3, "RoadCo": 5}

# 1. Keep latest ts per ship_id
# 2. Left-join sla_limit from carrier_sla and flag on_time = days <= sla_limit
# 3. Print sorted carrier counts: carrier -> on_time/total
`,
      targetOutput: `AirEx: 1/2 on_time
RoadCo: 0/1 on_time`,
    },
  ],
  miniProject: {
    id: 'day25-project',
    title: 'E-Commerce Order Reconciliation, Cohort Imputation & Revenue Aggregation Engine',
    brief: 'Build a complete tabular wrangling pipeline that ingests raw CSV order lines and a customer tier lookup table, deduplicates order updates (keep="last"), imputes missing shipping fees by region mean, left-joins customer tiers, and outputs a clean regional revenue summary.',
    requirements: [
      'Parse raw CSV order lines while converting sentinel strings ("N/A", "") to None',
      'Deduplicate order_id keeping the latest updated_at timestamp (keep="last")',
      'Drop rows missing order_id or amount (dropna subset semantics)',
      'Impute missing shipping_fee using the mean shipping_fee of each region',
      'Left-join customer_tier from the customers table without losing unmatched orders',
      'Aggregate total revenue and order count per region sorted alphabetically',
    ],
    rubric: [
      { criterion: 'Accurate CSV parsing & keep="last" deduplication', weight: 25 },
      { criterion: 'Subset-aware null dropping & group-mean imputation', weight: 25 },
      { criterion: 'Left-join enrichment without KeyError on unmatched keys', weight: 25 },
      { criterion: 'Correct GroupBy regional revenue & count summary', weight: 25 },
    ],
    starterCode: `import csv, io
from collections import defaultdict

orders_csv = """order_id,cust_id,region,amount,shipping_fee,updated_at
O101,C1,EU,120.0,10.0,1
O101,C1,EU,135.0,10.0,2
O102,C2,EU,80.0,N/A,1
O103,C3,US,200.0,15.0,1
O104,C4,US,,15.0,1"""

customers = {"C1": "Gold", "C2": "Silver"}

# Implement: parse -> dedup(keep="last") -> dropna(subset=["amount"]) ->
# group-mean impute shipping_fee -> left-join tier -> groupby region summary
`,
  },
  dayQuiz: {
    title: 'Day 25 Checkpoint Quiz',
    questions: [
      {
        id: 'day25-q1',
        scenario: 'Two Pandas Series `a` (index `["x", "y"]`) and `b` (index `["y", "z"]`) are added with `a + b`.',
        question: 'What are the resulting index labels and values?',
        options: [
          {
            id: 'a',
            text: 'Index ["x", "y", "z"] with NaN at "x" and "z", and a["y"] + b["y"] at "y".',
            explanation: 'Correct! Series arithmetic aligns by index label across the union of indices; unmatched labels produce NaN.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Index ["y"] only (inner intersection).',
            explanation: 'Incorrect. Arithmetic defaults to outer union, not inner intersection.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Index [0, 1] added positionally.',
            explanation: 'Incorrect. Pandas Series always align by label, never ignoring index labels.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Raises ValueError due to mismatched indices.',
            explanation: 'Incorrect. Mismatched indices align cleanly with NaN.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day25-q2',
        scenario: 'A CSV file contains 6-digit employee IDs such as `"004912"` that must keep their leading zeros.',
        question: 'How should you load the file with `pd.read_csv()`?',
        options: [
          {
            id: 'a',
            text: 'Pass dtype={"emp_id": str} to pd.read_csv().',
            explanation: 'Correct! Explicit column dtype prevents Pandas from inferring int64 and stripping leading zeros.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Call df["emp_id"].astype(str) after read_csv().',
            explanation: 'Incorrect. By the time `read_csv()` returns, `"004912"` has already become `4912`, so casting later yields `"4912"`.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Pass parse_dates=["emp_id"].',
            explanation: 'Incorrect. `parse_dates` parses timestamps, not string IDs.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Pass index_col=0.',
            explanation: 'Incorrect. Using column 0 as the index still infers int64.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day25-q3',
        scenario: 'A DataFrame has string index `["a", "b", "c", "d"]`.',
        question: 'Which statement accurately compares `df.loc["a":"c"]` and `df.iloc[0:2]`?',
        options: [
          {
            id: 'a',
            text: 'loc["a":"c"] returns 3 rows (inclusive of "c"); iloc[0:2] returns 2 rows (exclusive of 2).',
            explanation: 'Correct! Label slicing with `loc` is inclusive of both endpoints, while positional `iloc` is stop-exclusive.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Both return 2 rows.',
            explanation: 'Incorrect. `loc["a":"c"]` includes `"c"`, returning 3 rows.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'loc["a":"c"] returns 2 rows; iloc[0:2] returns 3 rows.',
            explanation: 'Incorrect. That reverses `loc` and `iloc` slicing rules.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Both raise TypeError because slices cannot use strings.',
            explanation: 'Incorrect. `loc` specifically supports label slices including strings.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day25-q4',
        scenario: 'You write `df[df["status"] == "open"]["priority"] = 1` and see `SettingWithCopyWarning`.',
        question: 'Which rewrite cleanly avoids chained assignment and reliably mutates `df`?',
        options: [
          {
            id: 'a',
            text: 'df.loc[df["status"] == "open", "priority"] = 1',
            explanation: 'Correct! Single-step `.loc[row_mask, col]` assignment writes directly to the underlying DataFrame.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'df["priority"][df["status"] == "open"] = 1',
            explanation: 'Incorrect. That is still chained indexing.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'df.iloc[df["status"] == "open", "priority"] = 1',
            explanation: 'Incorrect. `iloc` requires integer column positions, not `"priority"` or a Series mask.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'df.query("status == open")["priority"] = 1',
            explanation: 'Incorrect. `query()` returns a new DataFrame copy, so the mutation is lost.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day25-q5',
        scenario: 'A customer table has 10,000 rows; `email` is non-null everywhere, but an optional `referral_code` column is 90% `NaN`.',
        question: 'What happens if you run `df.dropna()` without `subset`?',
        options: [
          {
            id: 'a',
            text: '90% of the dataset is deleted because any row with NaN in referral_code is dropped.',
            explanation: 'Correct! Bare `dropna()` drops rows with a null in ANY column; use `dropna(subset=["critical_col"])` instead.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Only the referral_code column is dropped.',
            explanation: 'Incorrect. `dropna()` operates on rows (`axis=0`) by default.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'NaNs in referral_code are filled with empty strings.',
            explanation: 'Incorrect. `dropna()` removes data; `fillna()` replaces it.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'No rows are dropped because 90% is above the threshold.',
            explanation: 'Incorrect. `dropna()` has no automatic threshold unless `thresh=` is explicitly passed.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day25-q6',
        scenario: 'You need to filter rows where `country` is `"DE"` AND `spend > 500`.',
        question: 'Which Pandas boolean expression is syntactically valid?',
        options: [
          {
            id: 'a',
            text: 'df[(df["country"] == "DE") & (df["spend"] > 500)]',
            explanation: 'Correct! Element-wise `&` with parentheses around each comparison is the standard Pandas mask syntax.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'df[(df["country"] == "DE") and (df["spend"] > 500)]',
            explanation: 'Incorrect. Python `and` triggers `ValueError: The truth value of a Series is ambiguous`.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'df[df["country"] == "DE" & df["spend"] > 500]',
            explanation: 'Incorrect. Missing parentheses cause `&` to bind tighter than `==` and `>`.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'df.loc["country" == "DE", "spend" > 500]',
            explanation: 'Incorrect. `"country" == "DE"` evaluates to the Python bool `False`, not a Series mask.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day25-q7',
        scenario: 'You want to compute a new column `group_avg` equal to the mean `score` of each row’s `cohort`, keeping the original 500 rows.',
        question: 'Which expression produces a 500-element Series aligned to `df.index`?',
        options: [
          {
            id: 'a',
            text: 'df.groupby("cohort")["score"].transform("mean")',
            explanation: 'Correct! `transform("mean")` returns a Series with the exact same index and length as `df`.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'df.groupby("cohort")["score"].mean()',
            explanation: 'Incorrect. `.mean()` reduces to one row per unique cohort.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'df.groupby("cohort")["score"].agg("mean")',
            explanation: 'Incorrect. `agg("mean")` also collapses to one row per cohort.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'df["score"].describe()',
            explanation: 'Incorrect. `describe()` returns summary statistics indexed by count/mean/std/etc.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day25-q8',
        scenario: 'You merge `orders` (100 rows) with `customers` on `cust_id`, and 5 orders have `cust_id`s not yet present in `customers`.',
        question: 'Which join preserves all 100 orders while filling missing customer fields with `NaN`?',
        options: [
          {
            id: 'a',
            text: 'pd.merge(orders, customers, on="cust_id", how="left")',
            explanation: 'Correct! A left join retains every row from `orders` and places `NaN` for unmatched `customers` columns.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'pd.merge(orders, customers, on="cust_id", how="inner")',
            explanation: 'Incorrect. An inner join drops the 5 unmatched orders, leaving 95 rows.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'pd.merge(orders, customers, on="cust_id", how="right")',
            explanation: 'Incorrect. A right join drops the 5 unmatched orders and may add customer rows with no orders.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'pd.concat([orders, customers], axis=0)',
            explanation: 'Incorrect. `concat(..., axis=0)` stacks rows vertically rather than joining on `cust_id`.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day25-q9',
        scenario: 'You sort a status-history DataFrame by `updated_at` ascending, then call `df.drop_duplicates(subset=["ticket_id"], keep="last")`.',
        question: 'What does this sequence accomplish?',
        options: [
          {
            id: 'a',
            text: 'Retains only the most recent status record for each unique ticket_id.',
            explanation: 'Correct! Sorting chronologically ascending followed by `keep="last"` keeps the latest event per `ticket_id`.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Retains the oldest status record for each ticket_id.',
            explanation: 'Incorrect. `keep="first"` would retain the oldest after ascending sort.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Deletes all tickets that ever had more than one status update.',
            explanation: 'Incorrect. Deleting all duplicates requires `keep=False`.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Removes duplicate columns rather than rows.',
            explanation: 'Incorrect. `drop_duplicates` deduplicates rows.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day25-q10',
        scenario: 'After exporting `df.to_csv("output.csv")` and reloading it, you notice an unwanted column named `"Unnamed: 0"`.',
        question: 'How do you prevent that extra column when exporting?',
        options: [
          {
            id: 'a',
            text: 'Pass index=False: df.to_csv("output.csv", index=False).',
            explanation: 'Correct! `index=False` omits the synthetic 0..N row index from the CSV output.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Pass header=False to to_csv().',
            explanation: 'Incorrect. `header=False` removes column names, not the row index.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Pass columns=False to to_csv().',
            explanation: 'Incorrect. `columns` expects a list of column names to write, not a boolean.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Call df.dropna() before to_csv().',
            explanation: 'Incorrect. `dropna()` has nothing to do with writing the DataFrame index.',
            isCorrect: false,
          },
        ],
      },
    ],
    passingScorePercentage: 80,
  },
  cheatSheet: [
    {
      category: 'Series & Index Alignment',
      syntax: 's1.add(s2, fill_value=0)',
      description: 'Pandas Series align arithmetic by index label (outer union), producing NaN for unmatched labels unless fill_value is provided.',
      example: `s1 = pd.Series([10, 20], index=["a", "b"])
s2 = pd.Series([5, 15], index=["b", "c"])
aligned = s1.add(s2, fill_value=0)  # a:10, b:25, c:15`,
    },
    {
      category: 'DataFrame Creation & Schema (shape, dtypes)',
      syntax: 'df.shape, df.columns, df.dtypes',
      description: 'A DataFrame is a 2D table of typed 1D Series columns sharing a row Index. Inspect dimensions and per-column types immediately after loading.',
      example: `df = pd.DataFrame({"sku": ["A1", "B2"], "price": [19.5, 42.0]})
print(df.shape, df.dtypes.to_dict())`,
    },
    {
      category: 'CSV & JSON Ingestion (read_csv, dtype, parse_dates)',
      syntax: 'pd.read_csv(path, dtype=..., parse_dates=..., na_values=...)',
      description: 'Control type inference at ingestion time: preserve leading-zero IDs with dtype={col: str}, parse timestamps, and convert sentinel strings to NaN.',
      example: `df = pd.read_csv(
    "orders.csv",
    dtype={"zip_code": str},
    parse_dates=["created_at"],
    na_values=["N/A", "-"],
)`,
    },
    {
      category: 'Inspection & Profiling (head, info, describe, value_counts)',
      syntax: 'df.info(); df.describe(include="all"); s.value_counts(dropna=False)',
      description: 'Audit non-null counts, dtypes, numeric distributions, and categorical frequencies including missing values before transforming data.',
      example: `df.info()
print(df.describe())
print(df["region"].value_counts(dropna=False))`,
    },
    {
      category: 'Label vs. Positional Selection (loc vs. iloc)',
      syntax: 'df.loc[row_lbls, col_names]  |  df.iloc[row_pos, col_pos]',
      description: 'loc[] selects by index/column labels and is endpoint-inclusive on slices; iloc[] selects by 0-based integer positions and is endpoint-exclusive.',
      example: `sub_lbl = df.loc["r1":"r3", ["item", "price"]]  # includes r3
sub_pos = df.iloc[0:3, 0:2]  # rows 0,1,2; cols 0,1`,
    },
    {
      category: 'Boolean Filtering & Safe Mutation (.loc[mask, col])',
      syntax: 'df[(cond1) & (cond2)]  |  df.loc[mask, "col"] = val',
      description: 'Always wrap boolean conditions in parentheses with &, |, ~. Mutate filtered rows via single-step .loc[mask, col] to avoid SettingWithCopyWarning.',
      example: `mask = (df["status"] == "open") & (df["amount"] > 100)
df.loc[mask, "priority"] = 1`,
    },
    {
      category: 'Missing Data Handling (isna, dropna, fillna)',
      syntax: 'df.isna().sum(); df.dropna(subset=[...]); df["x"].fillna(val)',
      description: 'Quantify nulls per column first, restrict dropna() with subset= to critical fields, and impute domain values (constant, median, or group mean).',
      example: `df = df.dropna(subset=["patient_id"])
df["score"] = df["score"].fillna(df["score"].median())`,
    },
    {
      category: 'Vectorised Columns, assign() & apply() Tradeoffs',
      syntax: 'df.assign(total=lambda d: d["qty"] * d["price"])',
      description: 'Prefer vectorised arithmetic and .assign() over row-wise apply(axis=1), which runs a Python loop and constructs a Series per row.',
      example: `clean = (df[df["qty"] > 0]
    .assign(total=lambda d: d["qty"] * d["price"])
    .sort_values("total", ascending=False))`,
    },
    {
      category: 'Split-Apply-Combine (groupby, agg, transform)',
      syntax: 'df.groupby("k").agg(...)  |  df.groupby("k")["v"].transform("mean")',
      description: 'Use agg() with named tuples to collapse each group into summary rows; use transform() to broadcast group metrics back to the original row index.',
      example: `summary = df.groupby("carrier").agg(trips=("id", "count"), avg_d=("days", "mean"))
df["carrier_avg"] = df.groupby("carrier")["days"].transform("mean")`,
    },
    {
      category: 'Merging, Deduplicating & Clean Export (merge, drop_duplicates, to_csv)',
      syntax: 'pd.merge(a, b, on="id", how="left"); df.drop_duplicates(..., keep="last"); df.to_csv(p, index=False)',
      description: 'Use how="left" to preserve primary rows, sort + drop_duplicates(keep="last") to retain latest events, and pass index=False when exporting CSVs.',
      example: `latest = df.sort_values("ts").drop_duplicates(subset=["order_id"], keep="last")
enriched = pd.merge(latest, tiers, on="cust_id", how="left")
enriched.to_csv("clean_orders.csv", index=False)`,
    },
  ],
  sourceNotes: [
    'Curriculum reference: https://github.com/Asabeneh/30-Days-Of-Python/tree/master/25_Day_Pandas',
  ],
};
