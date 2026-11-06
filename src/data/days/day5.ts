/**
 * Day 5: Lists (Ordered, Mutable Sequences & Dynamic Array Internals)
 * Comprehensive Day Module following Section 7.3 and the 10-step pedagogical journey.
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_5_MODULE: DayModule = {
  schemaVersion: 1,
  number: 5,
  title: 'Lists',
  level: 'beginner',
  estimatedMinutes: 85,
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/05_Day_Lists',
  prerequisites: [1, 2, 3, 4],
  objectives: [
    'Understand lists as ordered, mutable sequences implemented as dynamic pointer arrays (PyListObject) in CPython.',
    'Access elements safely using zero-based positive (0 to n-1) and negative (-1 to -n) indexing, diagnosing IndexError.',
    'Extract and manipulate sub-sequences using slicing [start:stop:step] and perform in-place slice assignment (splicing).',
    'Contrast list in-place item mutability (id() unchanged) with string immutability (reallocation required).',
    'Master CPython list over-allocation growth and understand O(1) amortized append() vs O(N) insert().',
    'Apply 11 essential list methods: append, extend, insert, remove, pop, clear, index, count, sort, reverse, copy.',
    'Avoid the critical "sort() returns None" beginner pitfall, distinguishing in-place mutation from pure sorted() / reversed().',
    'Distinguish assignment aliasing (b = a), shallow copies (a.copy(), a[:]), and deep copies (copy.deepcopy(a)).',
  ],
  subtopics: [
    // ==========================================
    // Subtopic 1: What is a List? Creation & Dynamic Array Structure
    // ==========================================
    {
      id: 'day5-sub1',
      number: 1,
      title: 'What is a List? Creation & Dynamic Array Structure',
      summary: 'Explore Python lists as ordered, mutable sequences of object pointers, and understand how [] and list() allocate contiguous memory in CPython.',
      estimatedMinutes: 8,
      introduce: {
        headline: "Python's Workhorse Collection: The Dynamic Array",
        paragraphs: [
          "In Days 1 to 4, we worked with single values (integers, floats, booleans) and strings. However, real-world software must process collections of items: lists of bank transactions, user profiles, temperature readings, or inventory orders.",
          "A list in Python is an ordered, mutable collection of items enclosed in square brackets []. Unlike arrays in lower-level languages (like C or Java) which require a fixed size and homogenous types, Python lists can dynamically grow or shrink and can store elements of completely heterogeneous data types simultaneously.",
          "Under the hood in CPython, a list is not a linked list; it is a contiguous array of pointer references (PyObject** ob_item). Each slot in the list contains a 64-bit memory address pointing to the actual data object stored elsewhere in the heap.",
          "You can construct lists using square bracket syntax [] (the standard idiomatic approach) or the built-in constructor list() (which converts any iterable—such as a string or range—into a list).",
        ],
        keyTerms: [
          { term: 'List (PyListObject)', definition: 'An ordered, mutable sequence of object references stored contiguously in memory.' },
          { term: 'Heterogeneous', definition: 'The ability to hold elements of diverse types (int, str, float, bool, or nested lists) in the same container.' },
          { term: 'Dynamic Array', definition: 'A resizable data structure that allocates extra buffer slots in memory to allow O(1) amortized append operations.' },
          { term: 'list() Constructor', definition: 'Built-in type constructor that transforms any iterable into a newly allocated list.' },
        ],
        bulletPoints: [
          'Lists are declared with square brackets: fruits = ["mango", "orange", "banana"].',
          'Empty lists can be created with [] or list().',
          'Lists maintain insertion order: elements remain in the exact order they were inserted.',
          'Lists are heterogeneous: mix integers, strings, floats, booleans, or other lists freely.',
          'len(my_list) returns the number of elements in O(1) time by reading ob_size directly.',
        ],
      },
      visualise: {
        type: 'dynamic-array-allocator',
        title: 'CPython Dynamic Array Allocator & Capacity Growth',
        badge: 'simulation',
        description: 'Inspect the internal PyListObject pointer array, observing current size vs over-allocated buffer slots.',
        initialConfig: { items: ['Lagos', 'Abuja', 2026] },
      },
      code: [
        {
          title: 'Creating Empty and Populated Python Lists',
          runMode: 'real',
          code: `# 1. Creating empty lists
empty_a = []
empty_b = list()
print("empty_a:", empty_a, "type:", type(empty_a))
print("empty_b:", empty_b, "type:", type(empty_b))

# 2. Homogeneous list of strings (Nigerian tech hubs)
tech_hubs = ["Yaba", "Ikeja", "Lekki", "Garki", "Bodija"]
print("\\nTech Hubs:", tech_hubs)
print("Hub count:", len(tech_hubs))

# 3. Heterogeneous list (mixed data types)
customer_profile = ["Bello Musa", 28, 485000.75, True, ["Lagos", "Kano"]]
print("\\nCustomer Profile (heterogeneous):", customer_profile)
print("Name:        ", customer_profile[0], "(type:", type(customer_profile[0]).__name__, ")")
print("Age:         ", customer_profile[1], "(type:", type(customer_profile[1]).__name__, ")")
print("Balance:    ₦", customer_profile[2], "(type:", type(customer_profile[2]).__name__, ")")
print("Verified:    ", customer_profile[3], "(type:", type(customer_profile[3]).__name__, ")")
print("Locations:   ", customer_profile[4], "(type:", type(customer_profile[4]).__name__, ")")

# 4. Converting iterables to lists using list()
letters = list("PYTHON")
digits = list(range(1, 6))
print("\\nString to list:", letters)
print("Range to list: ", digits)`,
          expectedOutput: `empty_a: [] type: <class 'list'>
empty_b: [] type: <class 'list'>

Tech Hubs: ['Yaba', 'Ikeja', 'Lekki', 'Garki', 'Bodija']
Hub count: 5

Customer Profile (heterogeneous): ['Bello Musa', 28, 485000.75, True, ['Lagos', 'Kano']]
Name:         Bello Musa (type: str )
Age:          28 (type: int )
Balance:    ₦ 485000.75 (type: float )
Verified:     True (type: bool )
Locations:    ['Lagos', 'Kano'] (type: list )

String to list: ['P', 'Y', 'T', 'H', 'O', 'N']
Range to list:  [1, 2, 3, 4, 5]`,
        },
      ],
      explain: [
        { step: 1, codeLine: 2, instruction: 'empty_a = []', internalEffect: 'Allocates PyListObject with ob_size=0 and an initial allocated buffer of 0 slots.' },
        { step: 2, codeLine: 7, instruction: 'tech_hubs = ["Yaba", ...]', internalEffect: 'Allocates contiguous array of 5 pointers to heap string objects.' },
        { step: 3, codeLine: 12, instruction: 'customer_profile = [...]', internalEffect: 'Constructs heterogeneous list storing pointers to str, int, float, bool, and inner list.' },
        { step: 4, codeLine: 21, instruction: 'letters = list("PYTHON")', internalEffect: 'Iterates through string characters and stores individual 1-character strings in newly allocated list.' },
      ],
      apply: {
        domain: 'Fintech & Customer Accounts',
        contextTitle: 'Customer KYC Profile Representation',
        scenario: 'A fintech onboarding engine encapsulates raw customer records into a structured list containing customer ID, full name, wallet balance in kobo, verification status, and registered BVN phone numbers.',
      },
      commonMistakes: [
        {
          label: 'Using list as a Variable Identifier',
          explanation: 'Naming a variable list shadows the built-in constructor list(), causing subsequent list("abc") calls to fail with TypeError: \'list\' object is not callable.',
          erroneousCode: 'list = [1, 2, 3]  # Shadows built-in!\nnums = list("456") # TypeError: \'list\' object is not callable',
          correctedCode: 'my_list = [1, 2, 3]\nnums = list("456")  # Works properly!',
        },
        {
          label: 'Confusing Parentheses () with Square Brackets []',
          explanation: 'Using parentheses coordinates a tuple, which is immutable. Lists must use square brackets [].',
          erroneousCode: 'items = (10, 20, 30)\nitems[0] = 99  # TypeError: \'tuple\' object does not support item assignment',
          correctedCode: 'items = [10, 20, 30]\nitems[0] = 99  # Modifies list in-place!',
        },
      ],
      practise: [
        {
          id: 'd5-s1-ex1',
          title: 'Identifying List Creation Semantics',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Data Engineering Pipeline, Lagos',
          prompt: 'Which of the following statements correctly produces a list containing four integer elements [1, 2, 3, 4]?',
          options: [
            {
              id: 'opt-1',
              text: 'nums = list(range(1, 5))',
              explanation: 'Correct! range(1, 5) generates integers 1, 2, 3, 4 (excluding upper bound 5), and list() converts the range into a populated list [1, 2, 3, 4].',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'nums = list(1, 2, 3, 4)',
              explanation: 'Incorrect. list() accepts at most 1 argument (an iterable). Passing 4 positional arguments raises TypeError: list expected at most 1 argument, got 4.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'nums = [1..4]',
              explanation: 'Incorrect. [1..4] is invalid syntax in Python and raises a SyntaxError.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'nums = (1, 2, 3, 4)',
              explanation: 'Incorrect. Parentheses create a tuple, not a list.',
              isCorrect: false,
            },
          ],
          hints: [
            'list() takes a single iterable argument.',
            'range(start, stop) generates numbers from start up to stop - 1.',
            'Square brackets [] define list literals.',
          ],
        },
        {
          id: 'd5-s1-ex2',
          title: 'Fill Gaps: Heterogeneous List Initialization',
          type: 'fill-the-gaps',
          tier: 'standard',
          points: 15,
          contextScenario: 'Fintech User Account Data Model',
          prompt: 'Complete the code to convert a range of user IDs into a list and construct a customer profile holding heterogeneous types.',
          gaps: [
            {
              id: 'g1',
              beforeText: 'user_ids = ',
              afterText: '(range(1001, 1005))',
              correctAnswer: 'list',
              options: ['list', 'tuple', 'set', 'dict'],
            },
            {
              id: 'g2',
              beforeText: 'profile = ',
              afterText: '"Amina", 29, 75000.50, True]',
              correctAnswer: '[',
              options: ['[', '(', '{', '<'],
            },
          ],
          hints: [
            'Use the built-in type constructor to convert the range to a list.',
            'Lists are declared with square bracket delimiters.',
          ],
        }
      ],
      sourceNotes: "Derived from Asabeneh's 30 Days of Python: Day 5 Lists (Introduction and Creation sections).",
    },

    // ==========================================
    // Subtopic 2: Indexing & Sequence Boundaries
    // ==========================================
    {
      id: 'day5-sub2',
      number: 2,
      title: 'Indexing & Sequence Boundaries: Positive, Negative & IndexError',
      summary: 'Access individual elements using 0-based positive and negative offsets, and learn how Python checks bounds to raise IndexError.',
      estimatedMinutes: 7,
      introduce: {
        headline: 'Direct Item Access: Zero-Based Offsets & Negative Counting',
        paragraphs: [
          'Because Python lists are ordered sequences, each element occupies a distinct positional slot identified by an integer index.',
          'Python uses zero-based positive indexing: the first item is at index 0, the second item is at index 1, and the last item is at index len(my_list) - 1. This offset represents the distance from the memory starting pointer of the array.',
          'Python also features negative indexing, counting backwards from the end of the list: index -1 refers to the last element, -2 refers to the second-to-last, down to -len(my_list) for the very first element.',
          'Crucial Watch-out: Accessing an index that does not exist (e.g. index 5 on a 3-element list, or index -4 on a 3-element list) raises a fatal IndexError: list index out of range. Always verify the list length before attempting direct indexing.',
        ],
        keyTerms: [
          { term: 'Positive Index', definition: 'Zero-based positional offset ranging from 0 (first element) to len(lst) - 1 (last element).' },
          { term: 'Negative Index', definition: 'Backward positional offset ranging from -1 (last element) to -len(lst) (first element).' },
          { term: 'IndexError', definition: 'Exception raised when attempting to access a list slot outside the valid range [-len(lst), len(lst) - 1].' },
        ],
        bulletPoints: [
          'First element: lst[0] or lst[-len(lst)].',
          'Last element: lst[-1] or lst[len(lst) - 1].',
          'Middle element formula: lst[len(lst) // 2].',
          'Direct indexing is an O(1) constant-time memory pointer dereference.',
          'Accessing an index >= len(lst) raises IndexError: list index out of range.',
        ],
      },
      visualise: {
        type: 'sequence-grid',
        title: 'List Index Grid: Positive & Negative Memory Offsets',
        badge: 'simulation',
        description: 'Interactive index grid displaying positive and negative indices alongside item values.',
        initialConfig: { items: ['Python', 'Django', 'FastAPI', 'Flask', 'Tornado'] },
      },
      code: [
        {
          title: 'Positive, Negative, and Boundary Indexing',
          runMode: 'real',
          code: `# Nigerian banking institutions
banks = ["Access Bank", "Zenith Bank", "GTCO", "First Bank", "UBA"]
n = len(banks)

print(f"Total Banks: {n}\\n")

# Positive indexing: 0 to n - 1
print("Positive Indexing:")
print("First bank  (banks[0]):", banks[0])
print("Second bank (banks[1]):", banks[1])
print("Middle bank (banks[2]):", banks[2])
print("Last bank   (banks[4]):", banks[4])

# Negative indexing: -1 to -n
print("\\nNegative Indexing:")
print("Last bank         (banks[-1]):", banks[-1])
print("Penultimate bank  (banks[-2]):", banks[-2])
print("First bank        (banks[-5]):", banks[-5])

# Middle element index calculation
mid_index = n // 2
print(f"\\nCalculated middle bank at index {mid_index}: {banks[mid_index]}")

# Safe boundary guard against IndexError
target_index = 10
if target_index < len(banks):
    print("Found:", banks[target_index])
else:
    print(f"Guard triggered: Index {target_index} is out of bounds (max valid index is {n - 1})")`,
          expectedOutput: `Total Banks: 5

Positive Indexing:
First bank  (banks[0]): Access Bank
Second bank (banks[1]): Zenith Bank
Middle bank (banks[2]): GTCO
Last bank   (banks[4]): UBA

Negative Indexing:
Last bank         (banks[-1]): UBA
Penultimate bank  (banks[-2]): First Bank
First bank        (banks[-5]): Access Bank

Calculated middle bank at index 2: GTCO
Guard triggered: Index 10 is out of bounds (max valid index is 4)`,
        },
      ],
      explain: [
        { step: 1, codeLine: 8, instruction: 'banks[0]', internalEffect: 'Dereferences memory pointer at base_address + 0 * 8 bytes, returning Access Bank.' },
        { step: 2, codeLine: 15, instruction: 'banks[-1]', internalEffect: 'CPython resolves negative index by calculating n + (-1) = 4, returning UBA in O(1) time.' },
        { step: 3, codeLine: 20, instruction: 'mid_index = n // 2', internalEffect: 'Performs integer floor division: 5 // 2 = 2 (GTCO).' },
        { step: 4, codeLine: 24, instruction: 'target_index < len(banks)', internalEffect: 'Guards against fatal IndexError by checking upper bound before dereferencing.' },
      ],
      apply: {
        domain: 'Telecom & Billing Records',
        contextTitle: 'Accessing Network Call Records',
        scenario: 'A telecom billing server processes daily call records stored in a list. The first record lst[0] provides session initialization time, while lst[-1] gives the final call termination timestamp.',
      },
      commonMistakes: [
        {
          label: 'Off-by-One Error: Accessing lst[len(lst)]',
          explanation: 'Since indices run from 0 to len(lst) - 1, accessing lst[len(lst)] always raises an IndexError.',
          erroneousCode: 'fruits = ["apple", "banana", "cherry"]\nlast = fruits[len(fruits)]  # IndexError: list index out of range',
          correctedCode: 'fruits = ["apple", "banana", "cherry"]\nlast = fruits[len(fruits) - 1]  # or simply fruits[-1]',
        },
      ],
      practise: [
        {
          id: 'd5-s2-ex1',
          title: 'Predicting Index Access Outputs',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'E-commerce Cart Processing',
          prompt: 'What is printed when running this script?\n\n```python\nitems = ["Laptop", "Monitor", "Keyboard", "Mouse"]\nprint(f"{items[1]}, {items[-1]}")\n```',
          options: [
            {
              id: 'opt-1',
              text: 'Monitor, Mouse',
              explanation: 'Correct! items[1] retrieves the second element ("Monitor"), and items[-1] retrieves the last element ("Mouse").',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'Laptop, Mouse',
              explanation: 'Incorrect. Indexing is zero-based: items[0] is "Laptop", so items[1] is "Monitor".',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'Monitor, Keyboard',
              explanation: 'Incorrect. items[-1] is the last item ("Mouse"), not "Keyboard".',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'Laptop, Keyboard',
              explanation: 'Incorrect. Both indices are misinterpreted.',
              isCorrect: false,
            },
          ],
          hints: [
            'Remember: 0 is the first item, 1 is the second item.',
            'Negative index -1 is always the final item of the sequence.',
          ],
        },
        {
          id: 'd5-s2-ex2',
          title: 'Order Lines: Safe Negative Boundary Retrieval',
          type: 'order-the-lines',
          tier: 'standard',
          points: 15,
          contextScenario: 'Payment Gateway Response Handler',
          prompt: 'Arrange the code lines to check if a response list has elements, extract the status using negative index -1, and print the outcome.',
          starterCode: '# Order lines to safely retrieve status\n',
          solutionCode: `responses = ["AUTH_OK", "SETTLE_PENDING", "SUCCESS"]
if len(responses) > 0:
    final_status = responses[-1]
    print(f"Final: {final_status}")`,
          jumbledLines: [
            { id: 'l1', code: 'responses = ["AUTH_OK", "SETTLE_PENDING", "SUCCESS"]', indent: 0 },
            { id: 'l2', code: 'if len(responses) > 0:', indent: 0 },
            { id: 'l3', code: '    final_status = responses[-1]', indent: 1 },
            { id: 'l4', code: '    print(f"Final: {final_status}")', indent: 1 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: [
            'Initialize the responses list first.',
            'Check length > 0 to guard against IndexError.',
            'Use negative index -1 to retrieve the final element.',
          ],
        }
      ],
      sourceNotes: "Derived from Asabeneh's 30 Days of Python: Day 5 Lists (Accessing List Items section).",
    },

    // ==========================================
    // Subtopic 3: Slicing Lists & Subsequence Extraction
    // ==========================================
    {
      id: 'day5-sub3',
      number: 3,
      title: 'Slicing Lists & Subsequence Extraction: [start:stop:step]',
      summary: 'Extract sub-lists with slicing notation, master omitted defaults, negative steps, and understand why slicing never raises IndexError.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Sub-List Extraction: The Elegant Slicing Syntax',
        paragraphs: [
          'While indexing extracts a single item from a list, slicing extracts a range of items and packages them into a brand-new list object.',
          'The slicing syntax is lst[start:stop:step]: start is the inclusive starting index (defaults to 0), stop is the exclusive ending index (defaults to len(lst)), and step is the stride interval (defaults to 1).',
          'Crucial Slicing Rule: Slicing NEVER raises an IndexError! When indices fall outside the boundaries of the list (e.g. lst[0:100] on a 4-item list), Python silently clamps the indices to the valid range [0, len(lst)].',
          'A negative step traverses the list backwards: lst[::-1] produces a reversed shallow copy of the entire list, stepping backward from the last element to the first.',
        ],
        keyTerms: [
          { term: 'Slicing', definition: 'Extracting a sub-sequence of elements using lst[start:stop:step], returning a newly allocated list.' },
          { term: 'Half-Open Interval', definition: 'The range [start, stop) where start is included but stop is excluded.' },
          { term: 'Index Clamping', definition: "Python's behavior of automatically adjusting out-of-bounds slice indices to valid boundaries without raising errors." },
          { term: 'Stride (step)', definition: 'The increment between element indices during sequence traversal.' },
        ],
        bulletPoints: [
          'lst[start:stop] extracts items from index start up to stop - 1.',
          'Omitted start defaults to 0: lst[:3] extracts the first 3 items.',
          'Omitted stop defaults to len(lst): lst[3:] extracts from index 3 to the end.',
          'lst[:] creates a shallow copy of the entire list.',
          'lst[::-1] creates a reversed copy of the list.',
          'Slicing returns a new list; the original list remains completely unchanged.',
        ],
      },
      visualise: {
        type: 'list-slicing-splicing',
        title: 'List Slicing & Slice Assignment Studio',
        badge: 'simulation',
        description: 'Interactive sliders to test start, stop, and step parameters and see extracted sub-lists in real-time.',
        initialConfig: { items: ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf'] },
      },
      code: [
        {
          title: 'List Slicing, Defaults, Strides, and Reversals',
          runMode: 'real',
          code: `# West African capital cities
cities = ["Lagos", "Abuja", "Accra", "Dakar", "Freetown", "Monrovia", "Lome"]

# 1. Standard slice: [start:stop] (stop is exclusive)
first_three = cities[0:3]
middle_three = cities[2:5]
print("Full list:    ", cities)
print("cities[0:3]:  ", first_three)
print("cities[2:5]:  ", middle_three)

# 2. Omitted defaults
prefix = cities[:4]   # From index 0 up to 3
suffix = cities[4:]   # From index 4 to the end
print("\\ncities[:4]:   ", prefix)
print("cities[4:]:   ", suffix)

# 3. Negative bounds
last_three = cities[-3:]
middle_cut = cities[1:-1] # Discard first and last items
print("\\ncities[-3:]:  ", last_three)
print("cities[1:-1]: ", middle_cut)

# 4. Strides (step)
every_second = cities[::2]
print("\\ncities[::2]:  ", every_second)

# 5. Negative step: reversal
reversed_copy = cities[::-1]
print("cities[::-1]: ", reversed_copy)

# 6. Slicing never raises IndexError (graceful clamping)
out_of_bounds = cities[2:1000]
print("\\ncities[2:1000] (clamped):", out_of_bounds)`,
          expectedOutput: `Full list:     ['Lagos', 'Abuja', 'Accra', 'Dakar', 'Freetown', 'Monrovia', 'Lome']
cities[0:3]:   ['Lagos', 'Abuja', 'Accra']
cities[2:5]:   ['Accra', 'Dakar', 'Freetown']

cities[:4]:    ['Lagos', 'Abuja', 'Accra', 'Dakar']
cities[4:]:    ['Freetown', 'Monrovia', 'Lome']

cities[-3:]:   ['Freetown', 'Monrovia', 'Lome']
cities[1:-1]:  ['Abuja', 'Accra', 'Dakar', 'Freetown', 'Monrovia']

cities[::2]:   ['Lagos', 'Accra', 'Freetown', 'Lome']
cities[::-1]:  ['Lome', 'Monrovia', 'Freetown', 'Dakar', 'Accra', 'Abuja', 'Lagos']

cities[2:1000] (clamped): ['Accra', 'Dakar', 'Freetown', 'Monrovia', 'Lome']`,
        },
      ],
      explain: [
        { step: 1, codeLine: 5, instruction: 'cities[0:3]', internalEffect: 'Allocates new list and copies pointers for indices 0, 1, 2.' },
        { step: 2, codeLine: 18, instruction: 'cities[-3:]', internalEffect: 'Resolves start to 7 - 3 = 4, extracting indices 4, 5, 6.' },
        { step: 3, codeLine: 26, instruction: 'cities[::-1]', internalEffect: 'Traverses in reverse order with step -1, returning reversed shallow copy.' },
        { step: 4, codeLine: 30, instruction: 'cities[2:1000]', internalEffect: 'Clamps upper bound 1000 to len(cities)=7 without throwing an IndexError.' },
      ],
      apply: {
        domain: 'Data Science & Batch Processing',
        contextTitle: 'Batch Pagination in Database Queries',
        scenario: 'An API endpoint paginates transaction feeds by slicing: page_records = all_records[offset : offset + page_size]. Slicing handles the final page gracefully even when fewer records remain.',
      },
      commonMistakes: [
        {
          label: 'Expecting the stop Index to be Included',
          explanation: 'Slicing uses half-open intervals [start, stop). lst[0:3] includes indices 0, 1, and 2, but NOT index 3.',
          erroneousCode: 'nums = [10, 20, 30, 40]\nfirst_three = nums[0:2] # Returns only 2 items [10, 20]!',
          correctedCode: 'nums = [10, 20, 30, 40]\nfirst_three = nums[0:3] # Returns 3 items [10, 20, 30]',
        },
      ],
      practise: [
        {
          id: 'd5-s3-ex1',
          title: 'Predicting Slice Output with Stride',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Audit Log Down-sampling',
          prompt: 'What is printed by this slice expression?\n\n```python\nnums = [10, 20, 30, 40, 50, 60]\nprint(nums[1:5:2])\n```',
          options: [
            {
              id: 'opt-1',
              text: '[20, 40]',
              explanation: 'Correct! The slice starts at index 1 (20), stops before index 5, and steps by 2, picking index 1 (20) and index 3 (40).',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: '[20, 30, 40, 50]',
              explanation: 'Incorrect. The step parameter is 2, so every second item is selected, not every item.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: '[10, 30, 50]',
              explanation: 'Incorrect. Slicing starts at index 1, not index 0.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: '[20, 40, 60]',
              explanation: 'Incorrect. Index 5 is exclusive, so index 5 (60) is not reached.',
              isCorrect: false,
            },
          ],
          hints: [
            'Identify index 1 value: 20.',
            'Step by 2: index 1 + 2 = index 3 (40).',
            'Next index 3 + 2 = 5, which is equal to stop and therefore excluded.',
          ],
        },
        {
          id: 'd5-s3-ex2',
          title: 'Write Code: Extract Even Indices and Reversed Sequence',
          type: 'write-code',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Downsampling Sensor Measurements',
          prompt: 'Given a list of sensor readings, extract every second reading using stride ::2, and reverse the entire reading series using negative stride ::-1.',
          starterCode: `readings = [102, 105, 108, 112, 115, 119]

# 1. Extract every second item starting from index 0 using stride ::2
sampled = readings[::2]

# 2. Create a reversed copy of readings using negative stride ::-1
rev = readings[::-1]

print("Sampled:", sampled)
print("Reversed:", rev)`,
          solutionCode: `readings = [102, 105, 108, 112, 115, 119]

sampled = readings[::2]
rev = readings[::-1]

print("Sampled:", sampled)
print("Reversed:", rev)`,
          testCases: [
            {
              id: 'tc-1',
              label: 'Verify slicing strides',
              setup: '',
              expected: 'Sampled: [102, 108, 115]\nReversed: [119, 115, 112, 108, 105, 102]',
              hidden: false,
            },
          ],
          hints: [
            'Use readings[::2] to step by 2 through the list.',
            'Use readings[::-1] with negative step -1 to reverse the sequence.',
          ],
        }
      ],
      sourceNotes: "Derived from Asabeneh's 30 Days of Python: Day 5 Lists (Slicing Items from a List section).",
    },

    // ==========================================
    // Subtopic 4: Modifying Lists & True In-Place Mutability
    // ==========================================
    {
      id: 'day5-sub4',
      number: 4,
      title: 'Modifying Lists & True In-Place Mutability: Item Assignment vs Slicing',
      summary: 'Understand true in-place mutability (id() unchanged), modify individual elements, and contrast with string immutability.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Mutable Sequences: Updating Values In-Place',
        paragraphs: [
          'The fundamental architectural difference between Python strings and lists is mutability. While a string is an immutable sequence of characters, a list is a mutable sequence of object pointers.',
          'When you execute lst[0] = "New Value", Python does not allocate a new list. It simply overwrites the pointer in slot 0 to point to the new value object in heap memory. The list object itself remains at the exact same memory address (id(lst) is completely unchanged).',
          'In contrast, attempting word[0] = "N" on a string raises TypeError: \'str\' object does not support item assignment. Modifying a string requires constructing a brand-new string object at a different memory address.',
          'You can also perform slice assignment (splicing): lst[1:3] = ["X", "Y", "Z"]. This replaces a sub-slice with an arbitrary number of items, dynamically shifting subsequent elements and resizing the list in-place.',
        ],
        keyTerms: [
          { term: 'In-Place Mutability', definition: 'The property where an object can be altered internally without changing its memory identity (id()).' },
          { term: 'Item Assignment', definition: 'Syntax lst[i] = new_val replacing the pointer at index i with a pointer to new_val.' },
          { term: 'Slice Assignment (Splicing)', definition: 'Syntax lst[start:stop] = iterable replacing a slice with an arbitrary-length collection.' },
        ],
        bulletPoints: [
          'lst[i] = val updates slot i in O(1) time without changing id(lst).',
          'Strings raise TypeError on item assignment; lists accept item assignment.',
          'Slice assignment lst[1:3] = ["a", "b", "c"] resizes the list in-place.',
          'lst[1:3] = [] deletes the slice in-place (equivalent to del lst[1:3]).',
        ],
      },
      visualise: {
        type: 'list-mutability-lab',
        title: 'List Mutability vs String Immutability Inspector',
        badge: 'simulation',
        description: 'Interactive comparison demonstrating list pointer updates in-place vs string TypeError and reallocation.',
        initialConfig: { listItems: ['Lekki', 'Ikeja', 'Yaba'], stringValue: 'Lagos' },
      },
      code: [
        {
          title: 'Mutating List Items and Slice Splicing In-Place',
          runMode: 'real',
          code: `# 1. In-place single item reassignment
fruits = ["apple", "banana", "mango", "lemon"]
initial_id = id(fruits)
print("Initial fruits:      ", fruits)
print("Initial memory id:   ", hex(initial_id))

# Modify item at index 0 and index -1
fruits[0] = "avocado"
fruits[-1] = "lime"
after_id = id(fruits)

print("\\nModified fruits:     ", fruits)
print("After memory id:     ", hex(after_id))
print("Memory ID identical? ", initial_id == after_id) # True!

# 2. Slice assignment (splicing with different length)
# Replace 2 items ("banana", "mango") with 3 items ("blueberry", "guava", "orange")
print("\\nBefore slice assignment: len =", len(fruits), fruits)
fruits[1:3] = ["blueberry", "guava", "orange"]
print("After slice assignment:  len =", len(fruits), fruits)
print("Memory ID still same?   ", id(fruits) == initial_id) # Still True!

# 3. Deleting slice via empty assignment
fruits[1:4] = []
print("\\nAfter deleting slice [1:4]:", fruits)`,
          expectedOutput: `Initial fruits:       ['apple', 'banana', 'mango', 'lemon']
Initial memory id:    0x7f88d400

Modified fruits:      ['avocado', 'banana', 'mango', 'lime']
After memory id:      0x7f88d400
Memory ID identical?  True

Before slice assignment: len = 4 ['avocado', 'banana', 'mango', 'lime']
After slice assignment:  len = 5 ['avocado', 'blueberry', 'guava', 'orange', 'lime']
Memory ID still same?    True

After deleting slice [1:4]: ['avocado', 'lime']`,
        },
      ],
      explain: [
        { step: 1, codeLine: 3, instruction: 'initial_id = id(fruits)', internalEffect: 'Inspects heap pointer address of the PyListObject container.' },
        { step: 2, codeLine: 8, instruction: 'fruits[0] = "avocado"', internalEffect: 'Overwrites pointer slot 0 to point to new string "avocado"; list container is not reallocated.' },
        { step: 3, codeLine: 18, instruction: 'fruits[1:3] = ["blueberry", ...]', internalEffect: 'CPython shifts subsequent pointers and inserts 3 items in-place, dynamically expanding buffer.' },
        { step: 4, codeLine: 23, instruction: 'fruits[1:4] = []', internalEffect: 'Deletes 3 pointers and shifts subsequent elements leftward in contiguous memory.' },
      ],
      apply: {
        domain: 'Inventory & Stock Management',
        contextTitle: 'Warehouse Inventory Replenishment',
        scenario: 'A warehouse tracking system updates item quantities in-place: stock_counts[bin_id] = new_qty. In-place modification allows multiple modules referencing the shared inventory list to see live updates immediately.',
      },
      commonMistakes: [
        {
          label: 'Attempting Slicing Assignment with a Non-Iterable',
          explanation: 'Slice assignment requires an iterable on the right-hand side. Assigning a single integer raises TypeError: can only assign an iterable.',
          erroneousCode: 'nums = [1, 2, 3, 4]\nnums[1:3] = 99  # TypeError: can only assign an iterable',
          correctedCode: 'nums = [1, 2, 3, 4]\nnums[1:3] = [99]  # Works: replaces slice with [99]',
        },
      ],
      practise: [
        {
          id: 'd5-s4-ex1',
          title: 'Predicting Slice Splicing Expansion',
          type: 'predict-output',
          tier: 'standard',
          points: 15,
          contextScenario: 'Server Cluster Node Rebalancing',
          prompt: 'What is the value of nodes after executing this slice assignment?\n\n```python\nnodes = ["srv-1", "srv-2", "srv-3"]\nnodes[1:2] = ["srv-2A", "srv-2B"]\nprint(nodes)\n```',
          options: [
            {
              id: 'opt-1',
              text: "['srv-1', 'srv-2A', 'srv-2B', 'srv-3']",
              explanation: 'Correct! The single item at index 1 ("srv-2") is replaced by the two items ["srv-2A", "srv-2B"], expanding the list length from 3 to 4.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: "['srv-1', ['srv-2A', 'srv-2B'], 'srv-3']",
              explanation: 'Incorrect. Slice assignment flattens the iterable into the slice range; it does not nest the list.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: "['srv-1', 'srv-2A', 'srv-3']",
              explanation: 'Incorrect. Both replacement elements are inserted.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'TypeError: can only assign matching slice length',
              explanation: 'Incorrect. Python slice assignment dynamically expands or shrinks the list; lengths do not need to match.',
              isCorrect: false,
            },
          ],
          hints: [
            'Slice [1:2] isolates exactly one element: "srv-2".',
            'Slice assignment replaces the range with the items inside the iterable.',
            'The list expands to accommodate the extra item.',
          ],
        },
        {
          id: 'd5-s4-ex2',
          title: 'Explain Trace: Memory ID and In-Place Splicing',
          type: 'explain-the-trace',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Memory Profiler Audit, Paystack Engineering',
          prompt: 'Analyze the execution trace when performing slice assignment items[1:3] = ["X", "Y", "Z"] on a list vs string reassignment.',
          traceStepCode: `items = ["A", "B", "C", "D"]
addr_before = id(items)
items[1:3] = ["X", "Y", "Z"]
addr_after = id(items)`,
          traceQuestion: 'Why does addr_before == addr_after evaluate to True despite the length changing from 4 to 5?',
          options: [
            {
              id: 'opt-1',
              text: 'Lists are mutable dynamic pointer arrays; slice assignment resizes the buffer in-place without changing the container identity.',
              explanation: 'Correct! CPython updates the internal ob_item pointer buffer and ob_size in-place; the PyListObject container identity (id()) never changes.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'Python uses a small list cache that forces all lists to share the same ID.',
              explanation: 'Incorrect. Python does not cache lists.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'Slice assignment allocates a new list and updates the global pointer automatically.',
              explanation: 'Incorrect. No new list container is allocated.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'addr_before == addr_after is actually False.',
              explanation: 'Incorrect. The container identity remains identical.',
              isCorrect: false,
            },
          ],
          hints: [
            'Consider what a list actually stores: an array of pointers to objects.',
            'Does mutating elements inside a list allocate a new list container?',
          ],
        }
      ],
      sourceNotes: "Derived from Asabeneh's 30 Days of Python: Day 5 Lists (Modifying List section).",
    },

    // ==========================================
    // Subtopic 5: Checking Membership & Iteration Primitives
    // ==========================================
    {
      id: 'day5-sub5',
      number: 5,
      title: 'Checking Membership & Iteration Primitives: in, not in & len()',
      summary: 'Test for element containment using in and not in operators, and understand why membership testing in lists takes O(N) linear time.',
      estimatedMinutes: 6,
      introduce: {
        headline: 'Membership Testing: The in and not in Operators',
        paragraphs: [
          'Before operating on a list, you frequently need to check whether a specific element exists in the list (e.g. checking if a user ID is authorized, or checking if an item is already in the cart).',
          'Python provides the intuitive in and not in membership operators. Expression item in my_list scans the list from left to right, comparing each item using equality (==), and returns True as soon as a match is found, or False if the end is reached.',
          'Crucial Complexity Insight: Because Python lists are unsorted contiguous pointer arrays, checking membership using in requires an O(N) linear scan in the worst case (searching through all elements). If you need O(1) instantaneous membership testing for millions of items, Python sets or dictionaries should be preferred.',
        ],
        keyTerms: [
          { term: 'Membership Operator (in)', definition: 'Returns True if a matching value exists in the sequence, performing an O(N) linear scan.' },
          { term: 'not in Operator', definition: 'Returns True if the target value does not exist in the sequence.' },
          { term: 'Linear Search (O(N))', definition: 'Sequential scanning of elements from start to finish until a match is found or the list terminates.' },
        ],
        bulletPoints: [
          'x in lst returns True if any item == x.',
          'x not in lst returns True if no item == x.',
          'Membership testing on lists takes O(N) linear time.',
          'Always guard index() and remove() with in to prevent ValueError exceptions.',
        ],
      },
      visualise: {
        type: 'builtin-explorer',
        title: 'Membership & Containment Inspector',
        badge: 'simulation',
        description: 'Visual demonstration of linear scan checking element equality item by item.',
        initialConfig: { items: ['MTN', 'Airtel', 'Glo', '9mobile'] },
      },
      code: [
        {
          title: 'Testing List Containment with in and not in',
          runMode: 'real',
          code: `# Nigerian telecommunication carriers
active_telcos = ["MTN", "Airtel", "Glo", "9mobile"]

# 1. in operator
query_1 = "MTN"
if query_1 in active_telcos:
    print(f"✓ '{query_1}' is a certified Nigerian telecom operator.")

# 2. not in operator
query_2 = "Vodafone"
if query_2 not in active_telcos:
    print(f"✗ '{query_2}' is NOT in active Nigerian telco registry.")

# 3. Defensive programming: Guarding index() and remove()
candidate = "Starlink"
if candidate in active_telcos:
    idx = active_telcos.index(candidate)
    print(f"Found {candidate} at index {idx}")
else:
    print(f"Safe guard: '{candidate}' not found. Prevented ValueError exception!")`,
          expectedOutput: `✓ 'MTN' is a certified Nigerian telecom operator.
✗ 'Vodafone' is NOT in active Nigerian telco registry.
Safe guard: 'Starlink' not found. Prevented ValueError exception!`,
        },
      ],
      explain: [
        { step: 1, codeLine: 5, instruction: 'if query_1 in active_telcos:', internalEffect: 'Scans slot 0 ("MTN"), finds match, halts scan immediately and evaluates to True.' },
        { step: 2, codeLine: 10, instruction: 'if query_2 not in active_telcos:', internalEffect: 'Scans all 4 elements, finds no match, and returns True in O(N) time.' },
        { step: 3, codeLine: 15, instruction: 'if candidate in active_telcos:', internalEffect: 'Defensively guards against ValueError before calling index() or remove().' },
      ],
      apply: {
        domain: 'Access Control & Authentication',
        contextTitle: 'Role-Based Access Control (RBAC)',
        scenario: 'An authorization middleware verifies whether user_role in allowed_roles before permitting access to sensitive administrative endpoints.',
      },
      commonMistakes: [
        {
          label: 'Assuming in Checks Memory Identity Instead of Equality',
          explanation: 'The in operator tests value equality (item == target), not identity (is). [1, 2] in [[1, 2]] is True even if they are distinct objects in memory.',
          erroneousCode: 'a = [10, 20]\nlst = [[10, 20]]\n# in checks equality, so this evaluates to True!',
          correctedCode: 'print(a in lst)  # True',
        },
      ],
      practise: [
        {
          id: 'd5-s5-ex1',
          title: 'Membership Evaluation Logic',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'User Permission Audit',
          prompt: 'Given roles = ["viewer", "editor"], what do ("admin" in roles) and ("viewer" not in roles) evaluate to?',
          options: [
            {
              id: 'opt-1',
              text: 'False, False',
              explanation: 'Correct! "admin" is not in roles so the first expression is False. "viewer" IS in roles, so ("viewer" not in roles) is also False.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'False, True',
              explanation: 'Incorrect. "viewer" is inside the list, so "viewer" not in roles is False.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'True, False',
              explanation: 'Incorrect. "admin" is not present in the list.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'True, True',
              explanation: 'Incorrect. Both expressions evaluate to False.',
              isCorrect: false,
            },
          ],
          hints: [
            'Check if "admin" equals any element in ["viewer", "editor"].',
            'Check if "viewer" is absent from ["viewer", "editor"].',
          ],
        },
      ],
      sourceNotes: "Derived from Asabeneh's 30 Days of Python: Day 5 Lists (Checking Items in a List section).",
    },

    // ==========================================
    // Subtopic 6: Appending & Inserting: Growth Methods
    // ==========================================
    {
      id: 'day5-sub6',
      number: 6,
      title: 'Appending & Inserting: append() vs insert() and Amortized O(1) Growth',
      summary: 'Grow lists dynamically with append() and insert(), and understand CPython over-allocation geometry and time complexities.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Dynamic Growth: Appending at the Tail vs Inserting Arbitrarily',
        paragraphs: [
          'Lists are dynamic collections that can grow as elements arrive. Python provides two primary methods for adding single items: append() and insert().',
          'lst.append(item) adds item to the very end of the list. Because CPython pre-allocates spare buffer slots, append() runs in O(1) amortized constant time—one of the most optimized operations in Python.',
          'In contrast, lst.insert(index, item) inserts item before the specified index. To make room for the new element, Python must shift all subsequent pointers one position to the right in memory. Consequently, insert(0, item) runs in O(N) linear time! For frequent additions at the front of a sequence, collections.deque should be used instead.',
          'Crucial Watch-out: Both append() and insert() mutate the list in-place and return None. Never write my_list = my_list.append("item")—this overwrites your list variable with None!',
        ],
        keyTerms: [
          { term: 'append(x)', definition: 'Adds element x to the end of the list in O(1) amortized time, returning None.' },
          { term: 'insert(i, x)', definition: 'Inserts element x before index i, shifting subsequent pointers rightward in O(N) time, returning None.' },
          { term: 'Amortized O(1)', definition: 'Average time complexity where occasional resizing costs are spread across many cheap constant-time insertions.' },
        ],
        bulletPoints: [
          'append() places an item at the end of the list in O(1) amortized time.',
          'insert(0, item) inserts at the beginning, requiring O(N) pointer shifts.',
          'Both append() and insert() mutate in-place and return None.',
          'Never reassign: my_list = my_list.append(x) wipes out the list with None.',
        ],
      },
      visualise: {
        type: 'dynamic-array-allocator',
        title: 'Appending & Inserting: Growth & Over-Allocation',
        badge: 'simulation',
        description: 'Observe CPython over-allocation during append() and pointer shifts during insert().',
        initialConfig: { items: ['HTML', 'CSS', 'JavaScript'] },
      },
      code: [
        {
          title: 'Using append() and insert() to Grow Lists',
          runMode: 'real',
          code: `# Software engineering stack
stack = ["Python", "PostgreSQL", "React"]
print("Initial stack:    ", stack, "(len =", len(stack), ")")

# 1. append(): Adds element to the end in O(1) amortized time
res_append = stack.append("Docker")
print("\\nAfter append:     ", stack)
print("append() returned:", res_append) # None!

# 2. insert(): Inserts before specified index in O(N) time
# Insert "FastAPI" between "Python" and "PostgreSQL" (at index 1)
res_insert = stack.insert(1, "FastAPI")
print("\\nAfter insert(1):  ", stack)
print("insert() returned:", res_insert) # None!

# 3. insert(0, item): Prepends to front (shifts all elements)
stack.insert(0, "Linux")
print("\\nAfter insert(0):  ", stack)

# 4. Demonstrating the beginner None overwrite trap
demo_list = [1, 2, 3]
demo_list = demo_list.append(4)  # BUG!
print("\\nBeginner trap demonstration: demo_list is now ->", demo_list)`,
          expectedOutput: `Initial stack:     ['Python', 'PostgreSQL', 'React'] (len = 3 )

After append:      ['Python', 'PostgreSQL', 'React', 'Docker']
append() returned: None

After insert(1):   ['Python', 'FastAPI', 'PostgreSQL', 'React', 'Docker']
insert() returned: None

After insert(0):   ['Linux', 'Python', 'FastAPI', 'PostgreSQL', 'React', 'Docker']

Beginner trap demonstration: demo_list is now -> None`,
        },
      ],
      explain: [
        { step: 1, codeLine: 6, instruction: 'stack.append("Docker")', internalEffect: 'Places pointer to "Docker" at slot 3 in O(1) time and returns None.' },
        { step: 2, codeLine: 12, instruction: 'stack.insert(1, "FastAPI")', internalEffect: 'Shifts slots 1..3 one position rightward and inserts "FastAPI" at slot 1 in O(N) time.' },
        { step: 3, codeLine: 21, instruction: 'demo_list = demo_list.append(4)', internalEffect: 'Overwrites demo_list with the return value of append() which is None!' },
      ],
      apply: {
        domain: 'Transaction Processing & Queues',
        contextTitle: 'Event Log Ingestion',
        scenario: 'A transaction ingestion worker continuously appends incoming payment events to a processing buffer: event_queue.append(raw_payload). O(1) append ensures high-throughput log ingestion.',
      },
      commonMistakes: [
        {
          label: 'Overwriting List Variable with append() Return Value (None)',
          explanation: 'Because append() mutates in-place and returns None, assigning the result back to the variable destroys the list.',
          erroneousCode: 'numbers = [1, 2, 3]\nnumbers = numbers.append(4)  # numbers is now None!',
          correctedCode: 'numbers = [1, 2, 3]\nnumbers.append(4)  # Correct! numbers is [1, 2, 3, 4]',
        },
      ],
      practise: [
        {
          id: 'd5-s6-ex1',
          title: 'Detecting the append() None Reassignment Bug',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 15,
          contextScenario: 'Shopping Cart Checkout Script',
          prompt: 'Fix the bug where cart is erroneously overwritten with None when adding a coupon code.',
          starterCode: `cart = ["Book", "Pen"]
# Bug: reassigning return value of append()
cart = cart.append("COUPON_2026")
print("Cart:", cart)`,
          solutionCode: `cart = ["Book", "Pen"]
# Fixed: append() mutates in-place without reassignment
cart.append("COUPON_2026")
print("Cart:", cart)`,
          hints: [
            'In Python, list.append() returns None, not the modified list.',
            'Do not assign the result of cart.append() back to cart.',
            'Simply call cart.append("COUPON_2026") on its own line.',
          ],
        },
        {
          id: 'd5-s6-ex2',
          title: 'Theory Reasoning: Amortized O(1) vs Linear O(N)',
          type: 'theory-reasoning',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Algorithm Design & High-Throughput Log Processing',
          prompt: 'Why is lst.append(x) considered O(1) amortized, while lst.insert(0, x) is strictly O(N)?',
          options: [
            {
              id: 'opt-1',
              text: 'append() places the pointer into a pre-allocated buffer slot at the end, while insert(0) must shift all existing N pointers to the right in memory.',
              explanation: 'Correct! CPython over-allocates spare capacity so append() does not reallocate every time. insert(0) always requires shifting all N pointers.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'append() uses binary search to find an empty slot.',
              explanation: 'Incorrect. Appending always targets slot index ob_size directly.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'insert(0) creates a linked list node under the hood.',
              explanation: 'Incorrect. Python lists are contiguous arrays, not linked lists.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'Both methods have identical O(1) performance in modern Python 3.12.',
              explanation: 'Incorrect. insert(0) is always O(N).',
              isCorrect: false,
            },
          ],
          hints: [
            'Think about contiguous array layout in physical RAM.',
            'To make room at index 0, where do indices 0..N-1 have to move?',
          ],
        }
      ],
      sourceNotes: "Derived from Asabeneh's 30 Days of Python: Day 5 Lists (Adding Items to a List section).",
    },

    // ==========================================
    // Subtopic 7: Removing Elements: remove(), pop(), clear(), del
    // ==========================================
    {
      id: 'day5-sub7',
      number: 7,
      title: 'Removing Elements: remove(), pop(), clear(), and del',
      summary: 'Master element removal strategies: by value with remove(), by index with pop() and del, and buffer reset with clear().',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Pruning Lists: Removing by Value vs Removing by Position',
        paragraphs: [
          'Python provides four distinct mechanisms to remove elements from a list, each designed for a specific scenario: remove(), pop(), del, and clear().',
          '1. remove(x): Searches for the first occurrence of value x and removes it in-place. If x is not in the list, Python raises a ValueError: list.remove(x): x not in list. It returns None.',
          '2. pop([index]): Removes and returns the item at index. If no index is specified, it removes and returns the last item (lst[-1]) in O(1) time. Popping from index 0 (lst.pop(0)) shifts all remaining elements leftward, taking O(N) time.',
          '3. del lst[index] / del lst[start:stop]: A Python statement (not a method) that deletes an item or entire slice by index in-place without returning a value.',
          '4. clear(): Removes all elements from the list, resetting its length to 0 while maintaining the same list object in memory.',
        ],
        keyTerms: [
          { term: 'remove(x)', definition: 'Removes first element equal to x; raises ValueError if not found; returns None.' },
          { term: 'pop([i])', definition: 'Removes and returns item at index i (default -1); raises IndexError if list is empty.' },
          { term: 'del statement', definition: 'Python keyword that deletes variable names, list items, or slices by index.' },
          { term: 'clear()', definition: 'Empties the list in-place, resetting ob_size to 0; returns None.' },
        ],
        bulletPoints: [
          'remove(val) removes by value (raises ValueError if absent).',
          'pop(idx) removes by index and returns the removed item (raises IndexError if invalid).',
          'pop() with no argument removes the last item in O(1) time (ideal for stacks).',
          'del lst[i] deletes by index without returning anything.',
          'clear() removes all items, leaving an empty list [].',
        ],
      },
      visualise: {
        type: 'list-methods-lab',
        title: 'List Element Removal Laboratory',
        badge: 'simulation',
        description: 'Interactive execution of remove(), pop(), clear(), and del observing return values vs mutations.',
        initialConfig: { items: ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Lagos'] },
      },
      code: [
        {
          title: 'Comparing remove(), pop(), del, and clear()',
          runMode: 'real',
          code: `# Candidate cities for regional office
cities = ["Lagos", "Abuja", "Kano", "Ibadan", "Lagos", "Enugu"]
print("Initial list: ", cities)

# 1. remove(val): Removes FIRST matching value
cities.remove("Lagos")
print("\\nAfter remove('Lagos'): ", cities) # Only the first "Lagos" was removed!

# 2. pop(): Removes and RETURNS the last item in O(1) time
last_city = cities.pop()
print("\\nPopped last city:       ", last_city)
print("After pop():            ", cities)

# 3. pop(index): Removes and returns item at specific index in O(N) time
popped_mid = cities.pop(1) # Removes "Kano" at index 1
print("\\nPopped index 1 city:    ", popped_mid)
print("After pop(1):           ", cities)

# 4. del statement: Deletes by index or slice
del cities[0] # Deletes "Abuja"
print("\\nAfter del cities[0]:    ", cities)

# 5. clear(): Empties list in-place
cities.clear()
print("\\nAfter cities.clear():   ", cities)
print("List length:            ", len(cities))`,
          expectedOutput: `Initial list:  ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Lagos', 'Enugu']

After remove('Lagos'):  ['Abuja', 'Kano', 'Ibadan', 'Lagos', 'Enugu']

Popped last city:        Enugu
After pop():             ['Abuja', 'Kano', 'Ibadan', 'Lagos']

Popped index 1 city:     Kano
After pop(1):            ['Abuja', 'Ibadan', 'Lagos']

After del cities[0]:     ['Ibadan', 'Lagos']

After cities.clear():    []
List length:             0`,
        },
      ],
      explain: [
        { step: 1, codeLine: 6, instruction: 'cities.remove("Lagos")', internalEffect: 'Scans from index 0, matches "Lagos", deletes slot 0, and shifts remaining pointers left in O(N) time.' },
        { step: 2, codeLine: 10, instruction: 'last_city = cities.pop()', internalEffect: 'Pops slot 4 ("Enugu") in O(1) time without pointer shifts and returns the popped string.' },
        { step: 3, codeLine: 15, instruction: 'popped_mid = cities.pop(1)', internalEffect: 'Pops slot 1 ("Kano"), shifts subsequent slots left, and returns "Kano".' },
        { step: 4, codeLine: 24, instruction: 'cities.clear()', internalEffect: 'Resets ob_size to 0 and clears pointer references while keeping list container alive.' },
      ],
      apply: {
        domain: 'Task Scheduling & Stacks',
        contextTitle: 'LIFO Call Stack & Task Processing',
        scenario: 'A job processing worker uses tasks.pop() to retrieve and execute the most recently scheduled job in O(1) time, implementing a Last-In, First-Out (LIFO) stack.',
      },
      commonMistakes: [
        {
          label: 'Calling remove() with a Non-Existent Value (ValueError)',
          explanation: 'Calling remove(x) when x does not exist in the list raises a fatal ValueError. Always check with in first.',
          erroneousCode: 'nums = [1, 2, 3]\nnums.remove(99) # ValueError: list.remove(x): x not in list',
          correctedCode: 'nums = [1, 2, 3]\nif 99 in nums:\n    nums.remove(99)',
        },
      ],
      practise: [
        {
          id: 'd5-s7-ex1',
          title: 'Predicting pop() vs remove() Behavior',
          type: 'predict-output',
          tier: 'standard',
          points: 15,
          contextScenario: 'Call Center Priority Queue',
          prompt: 'What will be printed when running this code?\n\n```python\nqueue = ["A", "B", "C", "B"]\nx = queue.pop(1)\nqueue.remove("B")\nprint(f"{x}, {queue}")\n```',
          options: [
            {
              id: 'opt-1',
              text: "B, ['A', 'C']",
              explanation: 'Correct! queue.pop(1) removes the first "B" at index 1 and assigns it to x. Then queue.remove("B") finds the remaining "B" and removes it, leaving ["A", "C"].',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: "B, ['A', 'C', 'B']",
              explanation: 'Incorrect. queue.remove("B") successfully removes the second "B".',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: "A, ['B', 'C']",
              explanation: 'Incorrect. pop(1) removes index 1 ("B"), not index 0 ("A").',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: "None, ['A', 'C']",
              explanation: 'Incorrect. pop() returns the removed element, not None.',
              isCorrect: false,
            },
          ],
          hints: [
            'pop(1) targets index 1: what value is at index 1?',
            'pop() returns the removed value.',
            'remove("B") removes the next "B" encountered.',
          ],
        },
        {
          id: 'd5-s7-ex2',
          title: 'Write Code: Safe Pruning of Cancelled Orders',
          type: 'write-code',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Order Fulfillment Pipeline',
          prompt: 'Given a list of orders, check if "CANCELLED" is present; if so, remove it. Then pop the expedited order from index 0 and print the final queue.',
          starterCode: `orders = ["ORD_101", "CANCELLED", "ORD_102", "ORD_103"]

# 1. Defensively remove "CANCELLED" if present
if "CANCELLED" in orders:
    orders.remove("CANCELLED")

# 2. Pop the first order (expedited) from index 0
expedited = orders.pop(0)

print("Expedited:", expedited)
print("Remaining:", orders)`,
          solutionCode: `orders = ["ORD_101", "CANCELLED", "ORD_102", "ORD_103"]

if "CANCELLED" in orders:
    orders.remove("CANCELLED")

expedited = orders.pop(0)

print("Expedited:", expedited)
print("Remaining:", orders)`,
          testCases: [
            {
              id: 'tc-1',
              label: 'Verify remove and pop(0)',
              setup: '',
              expected: "Expedited: ORD_101\nRemaining: ['ORD_102', 'ORD_103']",
              hidden: false,
            },
          ],
          hints: [
            'Check with in before calling remove() to avoid ValueError.',
            'pop(0) removes and returns the first element.',
          ],
        }
      ],
      sourceNotes: "Derived from Asabeneh's 30 Days of Python: Day 5 Lists (Removing Items from a List section).",
    },

    // ==========================================
    // Subtopic 8: Concatenation, Repetition & Extending
    // ==========================================
    {
      id: 'day5-sub8',
      number: 8,
      title: 'Concatenation, Repetition & Extending: +, *, and extend()',
      summary: 'Combine lists using +, replicate with *, and master in-place extend() vs concatenation memory differences.',
      estimatedMinutes: 7,
      introduce: {
        headline: 'Merging and Multiplying Sequences',
        paragraphs: [
          'Python provides three distinct techniques for combining multiple lists: the concatenation operator (+), the sequence repetition operator (*), and the in-place method extend().',
          'The + operator joins two lists into a brand-new list object: list_a + list_b. Crucial Watch-out: + allocates a third list in memory and copies all pointers from both operands. If you are adding elements in a loop, list_a = list_a + list_b produces severe O(N²) quadratic performance!',
          'The extend(iterable) method appends all elements from an iterable to the existing list in-place. It does not allocate a new list and returns None. This is significantly faster and memory-efficient.',
          'The * operator repeats a list N times: [0] * 5 produces [0, 0, 0, 0, 0]. Crucial Watch-out: Multiplying a list containing mutable objects (e.g. [[0] * 3] * 3) creates shared references (aliases) to the same inner list! Modifying one row modifies all rows.',
        ],
        keyTerms: [
          { term: 'Concatenation (+)', definition: 'Allocates a new list containing elements from both operands.' },
          { term: 'extend(iterable)', definition: 'Mutates the list in-place by appending all items from the iterable; returns None.' },
          { term: 'Repetition (*)', definition: 'Replicates elements of a list N times.' },
          { term: 'Matrix Aliasing Trap', definition: 'The pitfall of creating nested lists with [[0]*cols]*rows where all rows share identical pointers.' },
        ],
        bulletPoints: [
          'a + b creates a new list (both a and b unchanged).',
          'a.extend(b) appends items from b directly into a in-place (returns None).',
          '[0] * n quickly initializes a list of n zeros.',
          'Never use [[0] * 3] * 3 to create a 2D matrix; use a list comprehension instead.',
        ],
      },
      visualise: {
        type: 'list-methods-lab',
        title: 'Concatenation (+) vs In-Place extend()',
        badge: 'simulation',
        description: 'Visual demonstration showing new list allocation with + versus in-place buffer expansion with extend().',
        initialConfig: { listA: [1, 2, 3], listB: [4, 5] },
      },
      code: [
        {
          title: 'Concatenation (+), extend(), and List Repetition (*)',
          runMode: 'real',
          code: `# 1. Concatenation operator (+): Creates a NEW list
front_end = ["HTML", "CSS", "JS", "React"]
back_end = ["Node", "Python", "MongoDB"]
full_stack = front_end + back_end

print("front_end: ", front_end)
print("back_end:  ", back_end)
print("full_stack:", full_stack)
print("New object?", id(full_stack) != id(front_end)) # True!

# 2. extend() method: Mutates IN-PLACE (returns None)
frameworks = ["Django", "FastAPI"]
frameworks.extend(["Flask", "Tornado"])
print("\\nAfter extend():", frameworks)

# 3. Repetition operator (*) with primitives
zero_vector = [0] * 5
print("\\nZero vector:    ", zero_vector)

# 4. Crucial Trap: Nested Matrix Aliasing with *
buggy_matrix = [[0] * 3] * 3
buggy_matrix[0][0] = 99
print("\\nBuggy matrix with * repetition (all rows mutated!):")
for row in buggy_matrix:
    print(row)

# Correct way to build 2D matrix: List Comprehension
safe_matrix = [[0] * 3 for _ in range(3)]
safe_matrix[0][0] = 99
print("\\nSafe matrix with comprehension (only row 0 mutated):")
for row in safe_matrix:
    print(row)`,
          expectedOutput: `front_end:  ['HTML', 'CSS', 'JS', 'React']
back_end:   ['Node', 'Python', 'MongoDB']
full_stack: ['HTML', 'CSS', 'JS', 'React', 'Node', 'Python', 'MongoDB']
New object? True

After extend(): ['Django', 'FastAPI', 'Flask', 'Tornado']

Zero vector:     [0, 0, 0, 0, 0]

Buggy matrix with * repetition (all rows mutated!):
[99, 0, 0]
[99, 0, 0]
[99, 0, 0]

Safe matrix with comprehension (only row 0 mutated):
[99, 0, 0]
[0, 0, 0]
[0, 0, 0]`,
        },
      ],
      explain: [
        { step: 1, codeLine: 5, instruction: 'full_stack = front_end + back_end', internalEffect: 'Allocates brand-new list with capacity 7 and copies pointers from both lists.' },
        { step: 2, codeLine: 13, instruction: 'frameworks.extend(...)', internalEffect: 'Over-allocates existing list and appends 2 pointers in-place, returning None.' },
        { step: 3, codeLine: 21, instruction: 'buggy_matrix = [[0] * 3] * 3', internalEffect: 'Creates 3 pointers all targeting the EXACT SAME inner list in heap memory!' },
        { step: 4, codeLine: 29, instruction: 'safe_matrix = [[0]*3 for _ in range(3)]', internalEffect: 'Executes list comprehension 3 times, allocating 3 distinct inner lists.' },
      ],
      apply: {
        domain: 'Data Aggregation & Microservices',
        contextTitle: 'Consolidating Paged API Results',
        scenario: 'A microservice worker fetches paged transaction records from Paystack. Instead of allocating new lists with page_1 + page_2, it calls all_transactions.extend(page_batch) in-place for maximum efficiency.',
      },
      commonMistakes: [
        {
          label: 'Using append() Instead of extend() to Add Multiple Items',
          explanation: 'Calling lst.append([1, 2]) appends the entire list as a single nested element [[1, 2]]. Use extend([1, 2]) to add individual elements.',
          erroneousCode: 'nums = [1, 2]\nnums.append([3, 4])  # Results in [1, 2, [3, 4]]!',
          correctedCode: 'nums = [1, 2]\nnums.extend([3, 4])  # Results in [1, 2, 3, 4]!',
        },
      ],
      practise: [
        {
          id: 'd5-s8-ex1',
          title: 'Distinguishing append() vs extend() Result',
          type: 'predict-output',
          tier: 'standard',
          points: 15,
          contextScenario: 'Data Collection Ingestion',
          prompt: 'What is the length of letters after running this snippet?\n\n```python\nletters = ["a", "b"]\nletters.append(["c", "d"])\nprint(len(letters))\n```',
          options: [
            {
              id: 'opt-1',
              text: '3',
              explanation: 'Correct! append() adds the list ["c", "d"] as a single nested element at index 2, resulting in ["a", "b", ["c", "d"]] with length 3.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: '4',
              explanation: 'Incorrect. If letters.extend(["c", "d"]) were used, length would be 4. append() adds it as 1 item.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: '2',
              explanation: 'Incorrect. append() successfully adds an element.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'TypeError: cannot append list to list',
              explanation: 'Incorrect. Python lists can hold any data type, including other lists.',
              isCorrect: false,
            },
          ],
          hints: [
            'Notice the method used: append() vs extend().',
            'append() treats its argument as a single object.',
            'What is the type of the item at index 2?',
          ],
        },
        {
          id: 'd5-s8-ex2',
          title: 'Fix the Bug: Multi-Dimensional Matrix Aliasing',
          type: 'fix-the-bug',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Tic-Tac-Toe Game Board Generator',
          prompt: 'Fix the bug where modifying board[0][0] corrupts all 3 rows because the board was created using [[0] * 3] * 3.',
          starterCode: `# Buggy matrix creation: all 3 rows alias the same list!
board = [[0] * 3] * 3

board[0][0] = 1
print("Row 0:", board[0])
print("Row 1:", board[1])`,
          solutionCode: `# Fixed: List comprehension allocates 3 independent row lists
board = [[0] * 3 for _ in range(3)]

board[0][0] = 1
print("Row 0:", board[0])
print("Row 1:", board[1])`,
          hints: [
            'Using [[0] * 3] * 3 creates 3 references to the SAME inner list.',
            'Use a list comprehension to allocate distinct lists for each row.',
            'Write: board = [[0] * 3 for _ in range(3)].',
          ],
        }
      ],
      sourceNotes: "Derived from Asabeneh's 30 Days of Python: Day 5 Lists (Joining Lists section).",
    },

    // ==========================================
    // Subtopic 9: Counting & Searching: count() and index()
    // ==========================================
    {
      id: 'day5-sub9',
      number: 9,
      title: 'Counting & Searching: count(), index() and Search Boundaries',
      summary: 'Count element frequency with count(), find positional offsets with index(), and handle absence safely without ValueError.',
      estimatedMinutes: 6,
      introduce: {
        headline: 'Locating and Measuring Elements in Lists',
        paragraphs: [
          'When analyzing data stored in a list, two fundamental inspection operations are measuring frequency (how many times an item appears) and locating positions (where an item is located).',
          'lst.count(value) iterates through the list and returns the integer count of elements matching value (using ==). If the value is absent, it returns 0. It never raises an error and runs in O(N) linear time.',
          'lst.index(value, [start, [stop]]) returns the zero-based index of the first occurrence of value. You can optionally supply search boundaries [start, stop] to limit the scan window.',
          'Crucial Watch-out: Unlike string find() which returns -1 when a substring is missing, list index() raises a fatal ValueError: value is not in list! Always check if value in lst before calling index().',
        ],
        keyTerms: [
          { term: 'count(x)', definition: 'Returns the integer frequency of item x in the list (0 if absent).' },
          { term: 'index(x)', definition: 'Returns the index of the first occurrence of x; raises ValueError if absent.' },
          { term: 'Search Boundaries', definition: 'Optional parameters lst.index(x, start, stop) limiting the search window.' },
        ],
        bulletPoints: [
          'count() returns integer frequency (>= 0); never throws.',
          'index() returns the index of the FIRST match.',
          'index() raises ValueError if the item is missing (unlike str.find() which returns -1).',
          'Always guard index() with in or a try/except ValueError block.',
        ],
      },
      visualise: {
        type: 'find-index',
        title: 'Linear Search: count() vs index() Inspection',
        badge: 'simulation',
        description: 'Interactive step-through of linear search locating matching indices and counting duplicates.',
        initialConfig: { items: ['Python', 'Java', 'Python', 'C++', 'Python'] },
      },
      code: [
        {
          title: 'Using count() and index() Safely',
          runMode: 'real',
          code: `# Customer survey responses
ratings = ["Satisfied", "Neutral", "Satisfied", "Dissatisfied", "Satisfied"]

# 1. count(): Measuring frequency (never throws)
satisfied_count = ratings.count("Satisfied")
excellent_count = ratings.count("Excellent")
print("Total ratings:        ", len(ratings))
print("'Satisfied' count:    ", satisfied_count)
print("'Excellent' count:    ", excellent_count) # 0 (safe!)

# 2. index(): Locating first occurrence
first_satisfied_idx = ratings.index("Satisfied")
first_dissatisfied_idx = ratings.index("Dissatisfied")
print("\\nFirst 'Satisfied' at:    index", first_satisfied_idx)
print("First 'Dissatisfied' at: index", first_dissatisfied_idx)

# 3. index() with search boundary [start, stop]
# Find SECOND 'Satisfied' by starting search after index 0
second_satisfied_idx = ratings.index("Satisfied", 1)
print("Second 'Satisfied' at:   index", second_satisfied_idx)

# 4. Safe index lookup guarding against ValueError
query = "Delighted"
if query in ratings:
    print(f"Found {query} at index {ratings.index(query)}")
else:
    print(f"\\nSafe guard: '{query}' not in list. Avoided fatal ValueError!")`,
          expectedOutput: `Total ratings:         5
'Satisfied' count:     3
'Excellent' count:     0

First 'Satisfied' at:    index 0
First 'Dissatisfied' at: index 3
Second 'Satisfied' at:   index 2

Safe guard: 'Delighted' not in list. Avoided fatal ValueError!`,
        },
      ],
      explain: [
        { step: 1, codeLine: 5, instruction: 'ratings.count("Satisfied")', internalEffect: 'Scans all 5 elements, counts 3 matches using ==, and returns integer 3.' },
        { step: 2, codeLine: 12, instruction: 'ratings.index("Satisfied")', internalEffect: 'Finds match at index 0 and halts scan immediately, returning 0.' },
        { step: 3, codeLine: 18, instruction: 'ratings.index("Satisfied", 1)', internalEffect: 'Begins linear scan from index 1, finds match at index 2, returning 2.' },
        { step: 4, codeLine: 23, instruction: 'if query in ratings:', internalEffect: 'Guards against fatal ValueError exception before calling index().' },
      ],
      apply: {
        domain: 'Data Analytics & Voting',
        contextTitle: 'Election Poll Ballot Tally',
        scenario: 'An election tally system counts candidate votes using votes.count("Candidate A") and locates the ballot ID of contentious votes using ballot_ids.index(flagged_id).',
      },
      commonMistakes: [
        {
          label: 'Assuming list.index() Returns -1 on Absence',
          explanation: 'Unlike str.find() which returns -1 when missing, list.index() raises ValueError: x is not in list.',
          erroneousCode: 'nums = [10, 20, 30]\npos = nums.index(99)  # Crashes with ValueError!',
          correctedCode: 'nums = [10, 20, 30]\npos = nums.index(99) if 99 in nums else -1',
        },
      ],
      practise: [
        {
          id: 'd5-s9-ex1',
          title: 'Predicting index() with Start Offset',
          type: 'predict-output',
          tier: 'standard',
          points: 15,
          contextScenario: 'Telecom SIM Inventory Tracker',
          prompt: 'What is printed by this code?\n\n```python\nitems = ["SIM", "Modem", "Router", "SIM", "Phone"]\nprint(items.index("SIM", 1))\n```',
          options: [
            {
              id: 'opt-1',
              text: '3',
              explanation: 'Correct! The search starts at index 1, skipping the first "SIM" at index 0 and finding the second "SIM" at index 3.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: '0',
              explanation: 'Incorrect. The start parameter 1 instructs Python to begin scanning from index 1 onward.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: '1',
              explanation: 'Incorrect. Index 1 contains "Modem", not "SIM".',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: '2',
              explanation: 'Incorrect. There is no "SIM" at index 2 ("Router").',
              isCorrect: false,
            },
          ],
          hints: [
            'Notice the second argument to index(): index("SIM", 1).',
            'Start scanning from index 1 ("Modem").',
            'At what index is the next "SIM" found?',
          ],
        },
      ],
      sourceNotes: "Derived from Asabeneh's 30 Days of Python: Day 5 Lists (Counting and Finding Index sections).",
    },

    // ==========================================
    // Subtopic 10: Sorting & Reversing: sort() vs sorted()
    // ==========================================
    {
      id: 'day5-sub10',
      number: 10,
      title: 'Sorting & Reversing: In-Place sort() vs Pure sorted() and reverse() vs reversed()',
      summary: 'Master Timsort with sort() and sorted(), custom key functions, and understand the difference between in-place mutation and pure functions.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Ordering Sequences: In-Place Mutation vs Pure Functions',
        paragraphs: [
          'Ordering data is one of the most essential tasks in programming. In Python, there are two distinct ways to sort a sequence: the list method lst.sort() and the built-in function sorted(iterable).',
          'lst.sort(key=None, reverse=False) sorts the list in-place using Timsort (an adaptive stable merge/insertion hybrid algorithm). Because it mutates the list in-place, it returns None. Crucial Beginner Trap: Writing my_list = my_list.sort() wipes out your list with None!',
          'sorted(iterable, key=None, reverse=False) is a pure built-in function. It does NOT mutate the original list; instead, it returns a brand-new sorted list. It can sort any iterable (strings, tuples, sets, dictionaries).',
          'Similarly, lst.reverse() reverses the list in-place returning None, while reversed(seq) returns an iterator yielding elements in reverse order without mutating the original.',
          'Both sort() and sorted() support a key parameter (such as key=len or key=str.lower) to define custom sorting criteria.',
        ],
        keyTerms: [
          { term: 'lst.sort()', definition: 'In-place sorting method using Timsort; returns None; mutates original list.' },
          { term: 'sorted()', definition: 'Pure built-in function returning a brand-new sorted list; leaves input unchanged.' },
          { term: 'Timsort', definition: "Python's O(N log N) stable hybrid sorting algorithm derived from merge sort and insertion sort." },
          { term: 'key Function', definition: 'A callable passed to sort() or sorted() that extracts a comparison key from each element.' },
        ],
        bulletPoints: [
          'lst.sort() mutates in-place and returns None.',
          'sorted(lst) returns a new sorted list without mutating lst.',
          'lst.reverse() reverses in-place and returns None.',
          'lst[::-1] or reversed(lst) produces a reversed copy without mutating.',
          'Use reverse=True for descending order.',
          'Use key=len or key=abs for custom sorting criteria.',
        ],
      },
      visualise: {
        type: 'list-methods-lab',
        title: 'Sorting & Reversing Laboratory: In-Place vs Pure Functions',
        badge: 'simulation',
        description: 'Interactive execution of sort() vs sorted() and reverse() vs reversed(), highlighting return values.',
        initialConfig: { items: ['Kano', 'Abuja', 'Lagos', 'Ibadan', 'Enugu'] },
      },
      code: [
        {
          title: 'Comparing sort() vs sorted() and reverse() vs reversed()',
          runMode: 'real',
          code: `# Nigerian cities
cities_original = ["Kano", "Abuja", "Lagos", "Ibadan", "Enugu"]
print("Original cities:    ", cities_original)

# 1. Built-in sorted(): PURE function (returns new list, original intact)
sorted_asc = sorted(cities_original)
sorted_desc = sorted(cities_original, reverse=True)
print("\\nsorted() ascending: ", sorted_asc)
print("sorted() descending:", sorted_desc)
print("Original unchanged: ", cities_original) # Still original order!

# 2. Custom key sorting with sorted(): Sort by word length
by_length = sorted(cities_original, key=len)
print("\\nSorted by length:   ", by_length)

# 3. List method .sort(): IN-PLACE mutation (returns None!)
cities_to_mutate = ["Kano", "Abuja", "Lagos", "Ibadan", "Enugu"]
res = cities_to_mutate.sort()
print("\\nAfter .sort():      ", cities_to_mutate)
print(".sort() returned:   ", res) # None!

# 4. In-place .reverse() vs slicing [::-1]
cities_to_reverse = ["One", "Two", "Three"]
res_rev = cities_to_reverse.reverse()
print("\\nAfter .reverse():   ", cities_to_reverse)
print(".reverse() returned:", res_rev) # None!

# Reversal without mutation using slice [::-1]
nums = [10, 20, 30]
reversed_nums = nums[::-1]
print("\\nOriginal nums:      ", nums)
print("Reversed copy:      ", reversed_nums)`,
          expectedOutput: `Original cities:     ['Kano', 'Abuja', 'Lagos', 'Ibadan', 'Enugu']

sorted() ascending:  ['Abuja', 'Enugu', 'Ibadan', 'Kano', 'Lagos']
sorted() descending: ['Lagos', 'Kano', 'Ibadan', 'Enugu', 'Abuja']
Original unchanged:  ['Kano', 'Abuja', 'Lagos', 'Ibadan', 'Enugu']

Sorted by length:    ['Kano', 'Abuja', 'Lagos', 'Enugu', 'Ibadan']

After .sort():       ['Abuja', 'Enugu', 'Ibadan', 'Kano', 'Lagos']
.sort() returned:    None

After .reverse():    ['Three', 'Two', 'One']
.reverse() returned: None

Original nums:       [10, 20, 30]
Reversed copy:       [30, 20, 10]`,
        },
      ],
      explain: [
        { step: 1, codeLine: 6, instruction: 'sorted_asc = sorted(cities_original)', internalEffect: 'Allocates new list, sorts pointers alphabetically in O(N log N) time, leaves original untouched.' },
        { step: 2, codeLine: 13, instruction: 'by_length = sorted(cities, key=len)', internalEffect: 'Passes each string to len() and sorts elements based on integer character counts.' },
        { step: 3, codeLine: 18, instruction: 'res = cities_to_mutate.sort()', internalEffect: 'Sorts pointer array in-place without allocating new list and returns None.' },
        { step: 4, codeLine: 24, instruction: 'res_rev = cities_to_reverse.reverse()', internalEffect: 'Swaps pointer pairs from ends inward in-place and returns None.' },
      ],
      apply: {
        domain: 'Fintech & Transaction Ledgers',
        contextTitle: 'Sorting Financial Transactions by Timestamp',
        scenario: 'A transaction reporting dashboard sorts raw transaction records by timestamp using transactions.sort(key=lambda x: x["timestamp"], reverse=True) to display the most recent activity first.',
      },
      commonMistakes: [
        {
          label: 'Assigning the Result of sort() to a Variable',
          explanation: 'Since lst.sort() mutates in-place and returns None, my_list = my_list.sort() destroys the list variable, turning it into None.',
          erroneousCode: 'scores = [85, 92, 78]\nscores = scores.sort()  # scores is now None!',
          correctedCode: 'scores = [85, 92, 78]\nscores.sort()  # Correct: scores is [78, 85, 92]',
        },
      ],
      practise: [
        {
          id: 'd5-s10-ex1',
          title: 'Predicting sort() vs sorted() Output',
          type: 'predict-output',
          tier: 'standard',
          points: 15,
          contextScenario: 'Leaderboard Ranking System',
          prompt: 'What is printed by this code?\n\n```python\nnums = [3, 1, 4]\na = nums.sort()\nb = sorted([3, 1, 4])\nprint(f"{a}, {b}")\n```',
          options: [
            {
              id: 'opt-1',
              text: 'None, [1, 3, 4]',
              explanation: 'Correct! nums.sort() mutates in-place and returns None (so a is None). sorted() returns a brand new sorted list [1, 3, 4] (so b is [1, 3, 4]).',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: '[1, 3, 4], [1, 3, 4]',
              explanation: 'Incorrect. Remember that list.sort() always returns None.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: '[1, 3, 4], None',
              explanation: 'Incorrect. The outputs are reversed.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'None, None',
              explanation: 'Incorrect. sorted() is a pure function that returns the sorted list.',
              isCorrect: false,
            },
          ],
          hints: [
            'What is the return value of an in-place list method like .sort()?',
            'What is the return value of a pure built-in function like sorted()?',
          ],
        },
        {
          id: 'd5-s10-ex2',
          title: 'Order Lines: Sort Transactions by Value Descending',
          type: 'order-the-lines',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Fintech Anti-Money Laundering (AML) Filter',
          prompt: 'Order the lines to extract amounts, sort in descending order in-place without creating a None trap, and print the top transaction.',
          starterCode: '# Order lines to sort amounts in descending order\n',
          solutionCode: `amounts = [45000, 1200000, 7500, 350000]
amounts.sort(reverse=True)
top_tx = amounts[0]
print(f"Top: ₦{top_tx:,}")`,
          jumbledLines: [
            { id: 'l1', code: 'amounts = [45000, 1200000, 7500, 350000]', indent: 0 },
            { id: 'l2', code: 'amounts.sort(reverse=True)', indent: 0 },
            { id: 'l3', code: 'top_tx = amounts[0]', indent: 0 },
            { id: 'l4', code: 'print(f"Top: ₦{top_tx:,}")', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: [
            'Define the raw amounts list first.',
            'Call amounts.sort(reverse=True) on its own line.',
            'Extract index 0 for the highest transaction.',
          ],
        }
      ],
      sourceNotes: "Derived from Asabeneh's 30 Days of Python: Day 5 Lists (Sorting and Reversing sections).",
    },

    // ==========================================
    // Subtopic 11: Copying Lists: Aliasing, Shallow Copies & Deep Copies
    // ==========================================
    {
      id: 'day5-sub11',
      number: 11,
      title: 'Copying Lists: Aliasing (b = a), Shallow Copies (copy(), [:]) & Deep Copies',
      summary: 'Master the three levels of copying in Python, diagnose unintended mutation traps, and use copy.deepcopy() for nested structures.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'The #1 Python Data Pitfall: Aliasing vs Cloning',
        paragraphs: [
          'One of the most frequent sources of subtle, catastrophic bugs in Python software is confusing variable assignment with copying.',
          '1. Assignment Aliasing (b = a): In Python, variables are names bound to memory addresses. Writing b = a does NOT copy the list! It merely binds the name b to the EXACT SAME list object in memory (id(a) == id(b)). Mutating b (e.g. b.append(99)) will mutate a as well!',
          '2. Shallow Copy (b = a.copy() or b = a[:] or b = list(a)): Creates a new outer list container at a different memory address (id(a) != id(b)). Top-level modifications to b do not affect a. However, if the list contains nested mutable objects (e.g. inner lists or dictionaries), the inner references are STILL SHARED! Modifying b[0].append(x) will mutate a[0]!',
          '3. Deep Copy (import copy; b = copy.deepcopy(a)): Recursively duplicates both the outer container and all nested child objects, producing a 100% independent clone. Changes to any level of b will never affect a.',
        ],
        keyTerms: [
          { term: 'Aliasing', definition: 'Multiple variable identifiers referencing the exact same memory address (id(a) == id(b)).' },
          { term: 'Shallow Copy', definition: 'A new outer container with copied pointer references; nested mutable objects remain shared.' },
          { term: 'Deep Copy (copy.deepcopy)', definition: 'A recursive clone duplicating both the container and all nested child structures.' },
        ],
        bulletPoints: [
          'b = a creates an alias (shared memory address); mutating b mutates a!',
          'b = a.copy() or b = a[:] creates a shallow copy (outer container is cloned).',
          'Shallow copies still share nested mutable child objects.',
          'b = copy.deepcopy(a) creates a completely decoupled recursive clone.',
        ],
      },
      visualise: {
        type: 'copy-aliasing-inspector',
        title: 'Shallow Copy vs Deep Copy & Aliasing Inspector',
        badge: 'simulation',
        description: 'Interactive diagram testing pointer sharing in b = a, b = a.copy(), and copy.deepcopy(a).',
        initialConfig: { items: ['Alpha', 'Beta', [10, 20]] },
      },
      code: [
        {
          title: 'Aliasing vs Shallow Copy vs Deep Copy Demonstration',
          runMode: 'real',
          code: `import copy

# ==========================================
# 1. Assignment Aliasing: b = a (Shared Memory!)
# ==========================================
original = [1, 2, 3]
alias = original  # Zero copying occurs!

print("--- 1. ASSIGNMENT ALIASING ---")
print("id(original):", hex(id(original)))
print("id(alias):   ", hex(id(alias)))
print("Pointers match?", original is alias) # True!

alias.append(99)
print("After alias.append(99):")
print("alias:   ", alias)
print("original:", original) # Original was mutated!

# ==========================================
# 2. Shallow Copy: copy() or [:] (Shared Nested Lists!)
# ==========================================
matrix_a = ["Admin", [10, 20]]
matrix_b = matrix_a.copy() # Shallow copy

print("\\n--- 2. SHALLOW COPY ---")
print("id(matrix_a):", hex(id(matrix_a)))
print("id(matrix_b):", hex(id(matrix_b)))
print("Outer containers match?", matrix_a is matrix_b) # False (Good!)
print("Inner list match?      ", matrix_a[1] is matrix_b[1]) # True (Shared!)

# Mutating outer element is safe:
matrix_b[0] = "SuperAdmin"
print("After matrix_b[0] change -> matrix_a[0] is still:", matrix_a[0])

# BUT mutating inner nested list affects matrix_a!
matrix_b[1].append(30)
print("After matrix_b[1].append(30) -> matrix_a[1] mutated!:", matrix_a[1])

# ==========================================
# 3. Deep Copy: copy.deepcopy() (100% Isolated)
# ==========================================
deep_a = ["User", [100, 200]]
deep_b = copy.deepcopy(deep_a)

print("\\n--- 3. DEEP COPY ---")
print("Inner list match?", deep_a[1] is deep_b[1]) # False (Independent!)

deep_b[1].append(300)
print("After deep_b[1].append(300):")
print("deep_b: ", deep_b)
print("deep_a: ", deep_a) # Completely protected!`,
          expectedOutput: `--- 1. ASSIGNMENT ALIASING ---
id(original): 0x7fa100
id(alias):    0x7fa100
Pointers match? True
After alias.append(99):
alias:    [1, 2, 3, 99]
original: [1, 2, 3, 99]

--- 2. SHALLOW COPY ---
id(matrix_a): 0x7fa100
id(matrix_b): 0x7fb200
Outer containers match? False
Inner list match?       True
After matrix_b[0] change -> matrix_a[0] is still: Admin
After matrix_b[1].append(30) -> matrix_a[1] mutated!: [10, 20, 30]

--- 3. DEEP COPY ---
Inner list match? False
After deep_b[1].append(300):
deep_b:  ['User', [100, 200, 300]]
deep_a:  ['User', [100, 200]]`,
        },
      ],
      explain: [
        { step: 1, codeLine: 7, instruction: 'alias = original', internalEffect: 'Binds variable alias to the identical PyListObject memory address; no memory is copied.' },
        { step: 2, codeLine: 24, instruction: 'matrix_b = matrix_a.copy()', internalEffect: 'Allocates new outer list container, but copies identical pointers to the inner list [10, 20].' },
        { step: 3, codeLine: 35, instruction: 'matrix_b[1].append(30)', internalEffect: 'Mutates the shared inner list object, which is visible through both matrix_a and matrix_b.' },
        { step: 4, codeLine: 43, instruction: 'deep_b = copy.deepcopy(deep_a)', internalEffect: 'Recursively allocates new outer list AND new inner list, ensuring 100% memory isolation.' },
      ],
      apply: {
        domain: 'Financial Simulators & Risk Modeling',
        contextTitle: 'What-If Portfolio Simulation',
        scenario: 'A portfolio risk engine deep-copies an account portfolio: simulated = copy.deepcopy(live_portfolio). It then applies stress-test mutations to the simulated portfolio without corrupting the live account state.',
      },
      commonMistakes: [
        {
          label: 'Using b = a Expecting a Copy',
          explanation: 'Assignment binds an alias to the same object. Any mutation through b modifies a.',
          erroneousCode: 'a = [1, 2]\nb = a\nb.append(3) # a is now [1, 2, 3]!',
          correctedCode: 'a = [1, 2]\nb = a.copy() # or a[:]\nb.append(3) # a remains [1, 2]',
        },
      ],
      practise: [
        {
          id: 'd5-s11-ex1',
          title: 'Predicting Aliasing Mutation Outcome',
          type: 'predict-output',
          tier: 'standard',
          points: 15,
          contextScenario: 'Database Cache Aliasing Bug',
          prompt: 'What will be printed when running this script?\n\n```python\na = [1, 2, 3]\nb = a\nb.append(4)\nprint(len(a))\n```',
          options: [
            {
              id: 'opt-1',
              text: '4',
              explanation: 'Correct! b = a creates an alias referencing the exact same list in memory. Calling b.append(4) mutates the list, so len(a) is now 4.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: '3',
              explanation: 'Incorrect. b = a does NOT copy the list; it aliases the same list, so modifying b modifies a.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: '0',
              explanation: 'Incorrect. The list has 4 elements.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'TypeError: cannot alias mutable list',
              explanation: 'Incorrect. Aliasing is the fundamental behavior of assignment in Python.',
              isCorrect: false,
            },
          ],
          hints: [
            'Does b = a create a new list or point to the same list?',
            'What is the memory relationship between a and b?',
            'b is a; therefore mutating b mutates a.',
          ],
        },
        {
          id: 'd5-s11-ex2',
          title: 'Write Code: Financial Portfolio Deep Copy Isolation',
          type: 'write-code',
          tier: 'project',
          points: 25,
          contextScenario: 'Risk Simulation Engine',
          prompt: 'Using copy.deepcopy(), create a completely isolated duplicate of account_data = ["Client_A", [50000, 20000]]. Add 15000 to the simulated portfolio inner list without altering the original account.',
          starterCode: `import copy

account_data = ["Client_A", [50000, 20000]]

# 1. Create a deep copy of account_data
simulated = copy.deepcopy(account_data)

# 2. Add 15000 to the nested list of simulated
simulated[1].append(15000)

print("Original:", account_data)
print("Simulated:", simulated)`,
          solutionCode: `import copy

account_data = ["Client_A", [50000, 20000]]

simulated = copy.deepcopy(account_data)
simulated[1].append(15000)

print("Original:", account_data)
print("Simulated:", simulated)`,
          testCases: [
            {
              id: 'tc-1',
              label: 'Verify deepcopy isolation',
              setup: '',
              expected: "Original: ['Client_A', [50000, 20000]]\nSimulated: ['Client_A', [50000, 20000, 15000]]",
              hidden: false,
            },
          ],
          hints: [
            'Use copy.deepcopy(account_data) to recursively clone both outer and inner lists.',
            'simulated[1].append(15000) will now only mutate the cloned inner list.',
          ],
        }
      ],
      sourceNotes: "Derived from Asabeneh's 30 Days of Python: Day 5 Lists (Copying a List section).",
    },
  ],
  realWorldLabs: [
    {
      id: 'day5-lab1',
      title: 'E-Commerce Shopping Cart & Promotional Splicing Engine',
      description: 'Process a multi-item customer shopping cart: append new arrivals, merge bulk orders with extend(), insert expedited shipping at index 0, apply promotional bundle replacement using slice assignment, remove an out-of-stock item, and calculate subtotal and VAT in Nigerian Naira.',
      domain: 'e-commerce',
      starterCode: `# Day 5 - Lab 1: E-Commerce Shopping Cart & Splicing Engine
cart = [
    ["Mechanical Keyboard", 45000],
    ["USB-C Hub", 18000],
    ["Wireless Mouse", 22000],
]

# 1. Append a single accessory item
cart.append(["Mousepad", 6000])

# 2. Extend cart with bulk warehouse items
bulk_items = [["HDMI Cable", 4500], ["Desk Lamp", 15000]]
cart.extend(bulk_items)

# 3. Insert Priority Shipping item at index 0
cart.insert(0, ["Priority Express Shipping", 5000])

# 4. Remove out-of-stock item ("Desk Lamp")
for item in cart:
    if item[0] == "Desk Lamp":
        cart.remove(item)
        break

# 5. Apply promotional bundle replacement:
# Replace items at index 1 and 2 with bundled "Ergo Office Pack" (price: 55000)
cart[1:3] = [["Ergo Office Pack (Keyboard+Hub)", 55000]]

# 6. Sort cart by price descending
cart.sort(key=lambda x: x[1], reverse=True)

# 7. Compute total and VAT (7.5%)
subtotal = sum(item[1] for item in cart)
vat = subtotal * 0.075
grand_total = subtotal + vat

print("=== FINAL RECONCILED CART ===")
for name, price in cart:
    print(f"- {name:<35} ₦{price:>8,}")
print("=" * 47)
print(f"Subtotal:                             ₦{subtotal:>8,}")
print(f"VAT (7.5%):                           ₦{vat:>8,.2f}")
print(f"Grand Total:                          ₦{grand_total:>8,.2f}")`,
      targetOutput: `=== FINAL RECONCILED CART ===
- Ergo Office Pack (Keyboard+Hub)     ₦  55,000
- Wireless Mouse                      ₦  22,000
- Mousepad                            ₦   6,000
- Priority Express Shipping           ₦   5,000
- HDMI Cable                          ₦   4,500
===============================================
Subtotal:                             ₦  92,500
VAT (7.5%):                           ₦6,937.50
Grand Total:                          ₦ 99,437.50`,
    },
    {
      id: 'day5-lab2',
      title: 'Fintech Transaction Ledger & Audited In-Place Reconciliation',
      description: 'Parse delimited financial transaction feeds into a structured 2D matrix, filter out cancelled records in-place, reconcile pending transactions, sort by transaction volume descending in-place, and generate an audited reconciliation summary.',
      domain: 'fintech',
      starterCode: `# Day 5 - Lab 2: Fintech Transaction Ledger & In-Place Reconciliation
raw_feeds = [
    "TXN_701,Lagos,850000,SUCCESS",
    "TXN_702,Abuja,42000,FAILED",
    "TXN_703,Kano,310000,SUCCESS",
    "TXN_704,Ibadan,95000,PENDING",
    "TXN_705,Enugu,1250000,SUCCESS",
]

# 1. Parse raw feeds into a 2D matrix: [txn_id, city, amount, status]
ledger = []
for feed in raw_feeds:
    parts = feed.split(",")
    ledger.append([parts[0], parts[1], int(parts[2]), parts[3]])

# 2. In-place filter: Remove all FAILED transactions
ledger = [entry for entry in ledger if entry[3] != "FAILED"]

# 3. Update PENDING transaction TXN_704 to SUCCESS in-place
for entry in ledger:
    if entry[0] == "TXN_704":
        entry[3] = "SUCCESS"

# 4. In-place sort by amount descending
ledger.sort(key=lambda x: x[2], reverse=True)

# 5. Extract top transaction using pop(0) as highest volume
highest_txn = ledger.pop(0)

# Compute reconciled volume
reconciled_volume = highest_txn[2] + sum(entry[2] for entry in ledger)

print("=== RECONCILED TRANSACTION AUDIT ===")
print(f"Top High-Value Audit: {highest_txn[0]} ({highest_txn[1]}) - ₦{highest_txn[2]:,}")
print("Standard Ledger Entries:")
for txn_id, city, amt, status in ledger:
    print(f"  {txn_id}: {city:<8} ₦{amt:>9,} [{status}]")
print(f"Total Reconciled Settlement Volume: ₦{reconciled_volume:,}")`,
      targetOutput: `=== RECONCILED TRANSACTION AUDIT ===
Top High-Value Audit: TXN_705 (Enugu) - ₦1,250,000
Standard Ledger Entries:
  TXN_701: Lagos    ₦  850,000 [SUCCESS]
  TXN_703: Kano     ₦  310,000 [SUCCESS]
  TXN_704: Ibadan   ₦   95,000 [SUCCESS]
Total Reconciled Settlement Volume: ₦2,505,000`,
    },
  ],
  miniProject: {
    id: 'day5-project',
    title: 'Multi-Currency Banking Ledger & Account Reconciliation System',
    brief: 'Build an enterprise financial ledger processing pipeline that accepts heterogeneous raw transaction streams, parses them into structured 2D matrices, applies in-place status mutations, calculates multi-currency running balances, and performs audited deep-copy risk simulations.',
    requirements: [
      'Parse raw delimited transaction strings into a 2D list matrix [txn_id, account_num, currency, amount_kobo, status].',
      'Implement in-place status mutations to settle pending transactions without reallocating list containers.',
      'Support dynamic ledger insertions using insert() and extend() for batch clearing cycles.',
      'Implement stable in-place sorting (.sort(key=...)) by amount descending and by currency group.',
      'Use copy.deepcopy() to create an isolated sandbox for what-if interest stress testing, proving the original ledger remains unchanged.',
    ],
    rubric: [
      { criterion: 'Matrix Ledger Construction & Dynamic Resizing', weight: 35 },
      { criterion: 'In-Place Manipulation & Splicing Accuracy', weight: 40 },
      { criterion: 'Safe Copying & Pure Sorting Hygiene', weight: 25 },
    ],
    starterCode: `# Day 5 Capstone Mini-Project: Multi-Currency Banking Ledger & Reconciliation
import copy

raw_transactions = [
    "TXN_901,ACC_1001,NGN,45000000,SETTLED",     # 450,000 NGN
    "TXN_902,ACC_1002,USD,125000,SETTLED",       # 1,250 USD
    "TXN_903,ACC_1001,NGN,8500000,PENDING",      # 85,000 NGN
    "TXN_904,ACC_1003,EUR,75000,FAILED",         # 750 EUR
    "TXN_905,ACC_1002,USD,300000,SETTLED",       # 3,000 USD
]

# Requirement 1: Parse into 2D ledger matrix
ledger = []
for entry in raw_transactions:
    tid, acc, curr, amt_kobo, status = entry.split(",")
    ledger.append([tid, acc, curr, int(amt_kobo), status])

# Requirement 2: In-place filter out FAILED transactions
ledger = [t for t in ledger if t[4] != "FAILED"]

# Requirement 3: In-place settle PENDING transactions
for t in ledger:
    if t[4] == "PENDING":
        t[4] = "SETTLED"

# Requirement 4: In-place sort by amount descending
ledger.sort(key=lambda x: x[3], reverse=True)

# Requirement 5: Risk stress-test with copy.deepcopy()
audit_sandbox = copy.deepcopy(ledger)
for record in audit_sandbox:
    if record[2] == "USD":
        record[3] = int(record[3] * 1.15)  # Apply 15% stress test

print(f"Active Reconciled Ledger ({len(ledger)} entries):")
for t in ledger:
    amt_formatted = f"{t[3] / 100:,.2f}"
    print(f"  {t[0]}: {t[1]} | {t[2]} {amt_formatted:>12} [{t[4]}]")`,
  },
  dayQuiz: {
    title: 'Day 5 Mastery Assessment Quiz',
    passingScorePercentage: 80,
    questions: [
      {
        id: 'd5-q1',
        scenario: 'Internal Memory Architecture of PyListObject in CPython',
        question: 'How is a Python list physically represented in memory by CPython?',
        options: [
          {
            id: 'q1-a',
            text: 'A contiguous array of 64-bit memory pointers referencing objects on the heap, with an over-allocated spare buffer.',
            explanation: 'Correct! CPython implements lists as PyListObject containing a contiguous array of PyObject* pointers, over-allocating buffer slots to guarantee O(1) amortized appends.',
            isCorrect: true,
          },
          {
            id: 'q1-b',
            text: 'A doubly-linked list where each node contains pointers to the next and previous elements.',
            explanation: 'Incorrect. Python lists are contiguous arrays, not linked lists. collections.deque is closer to a linked structure.',
            isCorrect: false,
          },
          {
            id: 'q1-c',
            text: 'A contiguous block of raw binary data where all elements must be identical byte sizes.',
            explanation: 'Incorrect. Python lists hold object pointers and can be heterogeneous; C arrays or NumPy arrays hold raw typed bytes.',
            isCorrect: false,
          },
          {
            id: 'q1-d',
            text: 'A hash table mapping integer keys 0..N-1 to arbitrary memory locations.',
            explanation: 'Incorrect. Dictionaries and sets use hash tables; lists use direct array indexing via pointer arithmetic.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd5-q2',
        scenario: 'In-Place Method Return Value Trap (.sort())',
        question: 'What is the value of result after evaluating result = [3, 1, 2].sort()?',
        options: [
          {
            id: 'q2-a',
            text: 'None — because list.sort() mutates the list in-place and does not return the sorted list.',
            explanation: 'Correct! In Python, in-place mutating list methods like .sort(), .reverse(), and .append() return None to prevent confusing in-place modification with pure transformation.',
            isCorrect: true,
          },
          {
            id: 'q2-b',
            text: '[1, 2, 3] — the sorted list.',
            explanation: 'Incorrect. list.sort() mutates the list in-place and returns None. To get a new sorted list, use sorted([3, 1, 2]).',
            isCorrect: false,
          },
          {
            id: 'q2-c',
            text: '[3, 1, 2] — the original list.',
            explanation: 'Incorrect. The method call mutates the list and returns None.',
            isCorrect: false,
          },
          {
            id: 'q2-d',
            text: 'A TypeError because sort cannot be called on a list literal.',
            explanation: 'Incorrect. Calling .sort() on a list literal is valid syntax, but returns None.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd5-q3',
        scenario: 'List Slicing Boundary Clamping Behavior',
        question: 'Given letters = ["a", "b", "c"], what does the slice expression letters[1:100] produce?',
        options: [
          {
            id: 'q3-a',
            text: '["b", "c"] — slicing never raises IndexError and clamps the stop bound to len(letters).',
            explanation: 'Correct! In Python, slicing never raises an IndexError; out-of-bounds start or stop boundaries are gracefully clamped to valid list bounds.',
            isCorrect: true,
          },
          {
            id: 'q3-b',
            text: 'IndexError: list slice index out of range.',
            explanation: 'Incorrect. Indexing (letters[100]) raises IndexError, but slicing (letters[1:100]) never raises IndexError.',
            isCorrect: false,
          },
          {
            id: 'q3-c',
            text: '["b", "c", None, ...] padded with 97 None elements.',
            explanation: 'Incorrect. Python slicing does not pad missing elements.',
            isCorrect: false,
          },
          {
            id: 'q3-d',
            text: '[] — an empty list because the stop boundary is invalid.',
            explanation: 'Incorrect. Slicing returns all available elements within the clamped range.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd5-q4',
        scenario: 'In-Place Item Assignment vs Memory Identity',
        question: 'When executing cities[0] = "Abuja" on an existing list cities = ["Lagos", "Kano"], how is memory affected?',
        options: [
          {
            id: 'q4-a',
            text: 'The pointer at slot 0 updates to reference "Abuja"; the list container id(cities) remains completely unchanged.',
            explanation: 'Correct! Lists are mutable containers of pointers. Overwriting an index updates only the internal pointer slot; the list container retains its original memory address.',
            isCorrect: true,
          },
          {
            id: 'q4-b',
            text: 'A brand-new list object is allocated at a new memory address, and cities is rebound.',
            explanation: 'Incorrect. That describes string reassignment or concatenation, not list in-place item assignment.',
            isCorrect: false,
          },
          {
            id: 'q4-c',
            text: 'The string "Lagos" in heap memory is overwritten byte-by-byte with "Abuja".',
            explanation: 'Incorrect. Strings are immutable and cannot be overwritten in place.',
            isCorrect: false,
          },
          {
            id: 'q4-d',
            text: 'A TypeError is raised because Python sequences cannot be modified by index.',
            explanation: 'Incorrect. Lists support item assignment; only immutable sequences like strings and tuples raise TypeError.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd5-q5',
        scenario: 'append() vs extend() with Nested Collections',
        question: 'What is the resulting length of nums after executing nums = [1, 2]; nums.append([3, 4])?',
        options: [
          {
            id: 'q5-a',
            text: '3 — append() adds the list [3, 4] as a single nested sub-element: [1, 2, [3, 4]].',
            explanation: 'Correct! append() adds its argument as a single element, resulting in length 3. If nums.extend([3, 4]) had been called, the length would be 4.',
            isCorrect: true,
          },
          {
            id: 'q5-b',
            text: '4 — append() unpacks the elements 3 and 4 into the list.',
            explanation: 'Incorrect. extend() unpacks iterables; append() always adds its argument as a single object.',
            isCorrect: false,
          },
          {
            id: 'q5-c',
            text: '2 — append() ignores collections and only adds primitive integers.',
            explanation: 'Incorrect. Lists can hold any Python object, including other lists.',
            isCorrect: false,
          },
          {
            id: 'q5-d',
            text: 'TypeError: cannot append list to list.',
            explanation: 'Incorrect. Python lists are heterogeneous and fully support nested lists.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd5-q6',
        scenario: 'Duplicate Element Handling in remove()',
        question: 'If items = ["apple", "banana", "apple"], what does items.remove("apple") do?',
        options: [
          {
            id: 'q6-a',
            text: 'Removes ONLY the first occurrence of "apple" at index 0, leaving ["banana", "apple"].',
            explanation: 'Correct! remove(x) scans from index 0 and deletes only the first matching element. It does NOT delete all matching occurrences.',
            isCorrect: true,
          },
          {
            id: 'q6-b',
            text: 'Removes all occurrences of "apple", leaving ["banana"].',
            explanation: 'Incorrect. remove() stops after finding and removing the first match.',
            isCorrect: false,
          },
          {
            id: 'q6-c',
            text: 'Removes the last occurrence of "apple" at index 2.',
            explanation: 'Incorrect. remove() searches from left to right (index 0).',
            isCorrect: false,
          },
          {
            id: 'q6-d',
            text: 'Raises ValueError because duplicate values are ambiguous.',
            explanation: 'Incorrect. Duplicates are fully supported and remove() targets the first match.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd5-q7',
        scenario: 'Multi-Dimensional Matrix Repetition Pitfall',
        question: 'Why does modifying matrix[0][0] = 1 in matrix = [[0] * 3] * 3 change column 0 in all three rows?',
        options: [
          {
            id: 'q7-a',
            text: 'The repetition operator * replicated the inner list pointer three times; all rows reference the exact same list in memory.',
            explanation: 'Correct! [[0]*3]*3 creates an outer list with 3 pointers all referencing the identical inner list object. Modifying any row modifies all rows.',
            isCorrect: true,
          },
          {
            id: 'q7-b',
            text: 'Python automatically synchronizes 2D matrices across rows.',
            explanation: 'Incorrect. Python does not automatically synchronize lists; it is a direct consequence of pointer aliasing.',
            isCorrect: false,
          },
          {
            id: 'q7-c',
            text: 'Integers 0 and 1 are immutable singletons in CPython.',
            explanation: 'Incorrect. While small integers are singletons, the bug is caused by the outer list containing duplicate references to the same mutable inner list.',
            isCorrect: false,
          },
          {
            id: 'q7-d',
            text: 'matrix[0][0] is invalid syntax in Python.',
            explanation: 'Incorrect. Multi-dimensional indexing matrix[0][0] is standard Python syntax.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd5-q8',
        scenario: 'Negative Indexing Traversal on Lists',
        question: 'For a list lst of length N, which expression accesses the first element using negative indexing?',
        options: [
          {
            id: 'q8-a',
            text: 'lst[-len(lst)]',
            explanation: 'Correct! Negative indices count backward from -1 (last element) to -len(lst) (first element, equivalent to lst[0]).',
            isCorrect: true,
          },
          {
            id: 'q8-b',
            text: 'lst[-0]',
            explanation: 'Incorrect. -0 is equivalent to 0, which accesses the first element via positive indexing, not negative offset.',
            isCorrect: false,
          },
          {
            id: 'q8-c',
            text: 'lst[-(len(lst) - 1)]',
            explanation: 'Incorrect. -(len(lst) - 1) accesses the second element (index 1).',
            isCorrect: false,
          },
          {
            id: 'q8-d',
            text: 'lst[-1]',
            explanation: 'Incorrect. lst[-1] accesses the LAST element of the list.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd5-q9',
        scenario: 'Shallow Copy vs Deep Copy with Nested Sublists',
        question: 'Given a = [1, [2, 3]] and b = a.copy(), what happens if you execute b[1].append(4)?',
        options: [
          {
            id: 'q9-a',
            text: 'Both a and b are modified because shallow copies only duplicate the outer container; nested mutable lists remain shared.',
            explanation: 'Correct! a.copy() or a[:] creates a shallow copy. Outer containers have distinct IDs, but inner pointers still point to the same nested list [2, 3]. Use copy.deepcopy() to isolate nested lists.',
            isCorrect: true,
          },
          {
            id: 'q9-b',
            text: 'Only b is modified because copy() creates a completely independent recursive clone.',
            explanation: 'Incorrect. copy() is shallow; copy.deepcopy() is required for recursive independence.',
            isCorrect: false,
          },
          {
            id: 'q9-c',
            text: 'TypeError: cannot append to nested element in shallow copy.',
            explanation: 'Incorrect. The inner element is a standard mutable list and appending succeeds.',
            isCorrect: false,
          },
          {
            id: 'q9-d',
            text: 'Only a is modified because b was copied by value.',
            explanation: 'Incorrect. b is modified, and because the inner list is shared, the mutation is visible through a as well.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd5-q10',
        scenario: 'Time Complexity of append() vs insert(0)',
        question: 'Why should collections.deque be preferred over list if you frequently insert or pop from the beginning of a sequence?',
        options: [
          {
            id: 'q10-a',
            text: 'insert(0) and pop(0) on lists require O(N) linear time to shift all subsequent pointers, while deque supports O(1) operations at both ends.',
            explanation: 'Correct! Lists are contiguous dynamic arrays, so prepending requires shifting all existing N pointers in memory (O(N)). collections.deque is a doubly-linked list of blocks supporting O(1) appends and pops on both ends.',
            isCorrect: true,
          },
          {
            id: 'q10-b',
            text: 'Python lists do not support inserting at index 0.',
            explanation: 'Incorrect. Lists support insert(0, x), but it takes O(N) linear time.',
            isCorrect: false,
          },
          {
            id: 'q10-c',
            text: 'collections.deque uses less memory than a list for small sequences.',
            explanation: 'Incorrect. deque actually has higher memory overhead per element due to block pointers.',
            isCorrect: false,
          },
          {
            id: 'q10-d',
            text: 'Lists raise IndexError if inserted at index 0 when full.',
            explanation: 'Incorrect. Lists dynamically resize and never raise IndexError on insert.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
    ],
  },
  cheatSheet: [
    {
      category: 'List Creation & Heterogeneous Structure',
      syntax: 'lst = [] | lst = [item1, item2, ...] | lst = list(iterable)',
      description: 'Lists are ordered, mutable, heterogeneous sequence containers stored as contiguous CPython pointer tables. They can store any mixture of data types including integers, strings, booleans, floats, and nested collections. Empty lists are created with [] or list(). list(iterable) constructs a list from any iterable sequence (such as a string, range, or tuple).',
      example: `# Empty and populated lists
empty_cart = []
empty_via_ctor = list()

# Heterogeneous types in a single contiguous list
user_record = ["USR-9481", "Amina Bello", 29, 450000.50, True, ["KYC_VERIFIED", "TIER_3"]]
print("User record length:", len(user_record))
print("Primary account status:", user_record[5][0])

# Constructing from iterables
digits = list("Python")  # ['P', 'y', 't', 'h', 'o', 'n']
countdown = list(range(5, 0, -1))  # [5, 4, 3, 2, 1]
print("Digits:", digits)
print("Countdown:", countdown)`,
    },
    {
      category: 'Positive & Negative Indexing Offsets',
      syntax: 'item = lst[i] | last = lst[-1]',
      description: 'Lists use zero-based positive indexing (0 to len(lst) - 1) from the left and negative indexing (-1 to -len(lst)) from the right. Crucial Watch-out: Accessing an index outside this range raises IndexError: list index out of range. Always verify 0 <= idx < len(lst) or use len() guards before direct item access.',
      example: `portfolio = ["MTN", "Dangote Cement", "Zenith Bank", "GTCO", "Nestle"]

# Positive indexing (left-to-right)
print("First stock:  ", portfolio[0])   # 'MTN'
print("Third stock:  ", portfolio[2])   # 'Zenith Bank'

# Negative indexing (right-to-left)
print("Last stock:   ", portfolio[-1])  # 'Nestle'
print("Second to last:", portfolio[-2]) # 'GTCO'

# IndexError guard:
idx = 10
if 0 <= idx < len(portfolio):
    print("Found:", portfolio[idx])
else:
    print(f"Index {idx} out of range! Valid range: [-{len(portfolio)}, {len(portfolio) - 1}]")`,
    },
    {
      category: 'Sequence Slicing & Boundary Clamping',
      syntax: 'sub = lst[start:stop[:step]] | reversed_lst = lst[::-1]',
      description: 'Slicing extracts a new shallow list containing elements from start (inclusive) to stop (exclusive) advancing by step. Default values: start=0, stop=len(lst), step=1. Unlike single-item indexing, slicing never raises IndexError — out-of-bounds indices are gracefully clamped to sequence boundaries. A negative step (e.g. [::-1]) traverses the sequence in reverse order.',
      example: `server_nodes = ["node-01", "node-02", "node-03", "node-04", "node-05", "node-06"]

# Sub-slice extraction (exclusive stop)
primary_cluster = server_nodes[0:3]   # ['node-01', 'node-02', 'node-03']
secondary_cluster = server_nodes[3:6] # ['node-04', 'node-05', 'node-06']

# Stride stepping (alternate nodes)
odd_nodes = server_nodes[::2]         # ['node-01', 'node-03', 'node-05']

# Reversal via negative stride (allocates new list)
reversed_nodes = server_nodes[::-1]

# Graceful clamping (never raises IndexError!)
wild_slice = server_nodes[2:999]      # ['node-03', 'node-04', 'node-05', 'node-06']
print("Clamped slice:", wild_slice)
print("Reversed nodes:", reversed_nodes)`,
    },
    {
      category: 'In-Place Item & Slice Splicing',
      syntax: 'lst[i] = new_val | lst[start:stop] = iterable | del lst[start:stop]',
      description: 'Because lists are mutable, single items can be reassigned in-place (lst[i] = x). Slice splicing (lst[start:stop] = iterable) replaces a target sub-range with any iterable, dynamically expanding, contracting, or completely deleting elements within the existing list buffer without altering the outer list identity (id(lst) remains constant).',
      example: `ledger = [100, 200, 300, 400, 500]
print("Initial id:", id(ledger))

# Single element in-place replacement
ledger[0] = 150
print("After item reassignment:", ledger)  # [150, 200, 300, 400, 500]

# Slice splicing: replace 2 elements ([200, 300]) with 4 elements
ledger[1:3] = [210, 220, 230, 240]
print("After expansion splicing:", ledger) # [150, 210, 220, 230, 240, 400, 500]

# Slice splicing: delete a sub-range by assigning empty list
ledger[1:5] = []
print("After shrinkage splicing:", ledger) # [150, 400, 500]
print("Final id (unchanged!):", id(ledger))`,
    },
    {
      category: 'Membership Testing & Containment',
      syntax: 'is_present = item in lst | is_absent = item not in lst',
      description: 'The in and not in operators perform linear O(N) sequential scans across the list buffer checking equality (item == target). Always use in before calling .index() or .remove() to prevent unhandled ValueError exceptions.',
      example: `supported_currencies = ["NGN", "USD", "GBP", "EUR", "GHS", "KES"]

currency_input = "ZAR"
if currency_input in supported_currencies:
    print(f"Supported currency: {currency_input}")
else:
    print(f"Currency {currency_input} is not supported. Please select from {supported_currencies}")

# Safe search pattern
target = "JPY"
if target in supported_currencies:
    idx = supported_currencies.index(target)
    print(f"{target} at index {idx}")
else:
    print(f"{target} is absent; index lookup skipped safely.")`,
    },
    {
      category: 'Dynamic Growth Methods',
      syntax: 'lst.append(x) | lst.extend(iterable) | lst.insert(index, x)',
      description: 'append(x) adds x as a single element to the end in amortized O(1) time using CPython over-allocation. extend(iterable) unpacks each element of the iterable and appends them sequentially (in-place O(K)). insert(index, x) inserts x before index, requiring an O(N) shift of all subsequent elements. Crucial Watch-out: All three methods mutate in-place and return None! Reassigning lst = lst.append(x) overwrites lst with None.',
      example: `inventory = ["MacBook Pro", "Dell XPS"]

# append(): adds single element (O(1) amortized)
inventory.append("ThinkPad X1")
print("After append:", inventory)

# Common trap: appending a list creates a nested sublist!
# inventory.append(["Keyboard", "Mouse"]) -> creates ['ThinkPad X1', ['Keyboard', 'Mouse']]

# extend(): unpacks iterable elements into the list
peripherals = ["Mechanical Keyboard", "Wireless Mouse"]
inventory.extend(peripherals)
print("After extend:", inventory)

# insert(): adds at arbitrary index (O(N) pointer shift)
inventory.insert(0, "Apple Mac Studio")
print("After insert at 0:", inventory)`,
    },
    {
      category: 'Removal & Deletion Operations',
      syntax: 'lst.remove(x) | item = lst.pop([index]) | lst.clear() | del lst[index]',
      description: 'remove(x) removes the first occurrence of value x in O(N) time (raises ValueError if absent). pop([index]) removes and returns the element at index (defaults to -1, which is O(1); pop(0) requires an O(N) shift). clear() empties the list entirely in-place. del lst[i] is a Python statement that deletes by index or slice without returning a value.',
      example: `queue = ["cust_1", "cust_2", "cust_3", "cust_4", "cust_2"]

# remove(): removes FIRST matching value only
queue.remove("cust_2")
print("After remove('cust_2'):", queue)  # ['cust_1', 'cust_3', 'cust_4', 'cust_2']

# pop(): removes and RETURNS element
last_served = queue.pop()       # O(1) pop from end
first_served = queue.pop(0)     # O(N) pop from head
print(f"Popped last: {last_served}, popped first: {first_served}")
print("Remaining queue:", queue)

# del statement for index or slice
del queue[0]
print("After del queue[0]:", queue)

# clear() resets buffer in-place
queue.clear()
print("After clear():", queue, "len:", len(queue))`,
    },
    {
      category: 'Concatenation, Repetition & Extending',
      syntax: 'new_lst = a + b | repeated = a * n | a += b',
      description: '+ concatenates two lists into a brand-new list object. * repeats elements n times in a new list. a += b is equivalent to a.extend(b), mutating a in-place. Crucial Watch-out: Repeating a list containing mutable sublists (e.g. [[0]*3]*3) duplicates the inner list reference across rows! Mutating one cell alters every row. Always use a list comprehension [[0 for _ in range(cols)] for _ in range(rows)] for 2D matrices.',
      example: `# Pure concatenation vs in-place +=
front = [1, 2]
back = [3, 4]
combined = front + back  # Allocates new list
print("Concatenated:", combined)

front += [5, 6]          # In-place extend (id preserved)
print("Extended front:", front)

# The Matrix Aliasing Trap:
faulty_grid = [[0] * 3] * 3
faulty_grid[0][0] = 99
print("Faulty grid (all rows affected!):", faulty_grid)

# Correct 2D matrix allocation:
safe_grid = [[0] * 3 for _ in range(3)]
safe_grid[0][0] = 99
print("Safe grid (isolated row):", safe_grid)`,
    },
    {
      category: 'Searching & Frequency Counting',
      syntax: 'idx = lst.index(x[, start[, stop]]) | count = lst.count(x)',
      description: 'index(x) returns the zero-based offset of the first element equal to x. Crucial Watch-out: If x is not found, index() raises ValueError (unlike str.find() which returns -1). Always test x in lst first. count(x) counts non-overlapping occurrences of x in linear O(N) time (returns 0 if absent).',
      example: `transactions = ["CR", "DR", "CR", "CR", "DR", "CR", "REV"]

# Frequency counting
credit_count = transactions.count("CR")
debit_count = transactions.count("DR")
reversal_count = transactions.count("REV")
print(f"Credits: {credit_count}, Debits: {debit_count}, Reversals: {reversal_count}")

# Safe search pattern using in guard:
query = "REV"
if query in transactions:
    first_idx = transactions.index(query)
    print(f"First '{query}' transaction found at index: {first_idx}")

# Range-bounded index lookup:
second_cr = transactions.index("CR", 1)  # Search starting from index 1
print(f"Second 'CR' at index: {second_cr}")`,
    },
    {
      category: 'In-Place vs Pure Sorting & Reversing',
      syntax: 'lst.sort(key=None, reverse=False) | sorted_copy = sorted(iterable) | lst.reverse() | reversed(lst)',
      description: 'lst.sort() sorts the list strictly in-place using Timsort (O(N log N)) and returns None! Reassigning lst = lst.sort() is a catastrophic bug that wipes the variable to None. sorted(iterable) is a pure built-in function that leaves the original untouched and returns a new sorted list. Similarly, lst.reverse() reverses in-place returning None, while reversed(lst) returns an iterator.',
      example: `scores = [88, 42, 95, 71, 63, 100]

# Pure sorting: returns new list, leaves original intact
sorted_scores = sorted(scores, reverse=True)
print("Original scores:", scores)        # [88, 42, 95, 71, 63, 100]
print("New sorted list:", sorted_scores) # [100, 95, 88, 71, 63, 42]

# In-place sorting with custom key:
companies = [("Flutterwave", 2016), ("Paystack", 2015), ("Kuda", 2019), ("Moniepoint", 2015)]
companies.sort(key=lambda c: (c[1], c[0]))  # Sort by year, then name
print("Sorted companies in-place:")
for name, year in companies:
    print(f"  {year} — {name}")

# In-place reversal:
letters = ["a", "b", "c", "d"]
letters.reverse()  # Returns None!
print("Reversed in-place:", letters)  # ['d', 'c', 'b', 'a']`,
    },
    {
      category: 'Copying Semantics & Nested Aliasing',
      syntax: 'b = a (alias) | b = a.copy() (shallow) | b = copy.deepcopy(a) (deep)',
      description: 'Assignment (b = a) creates a reference alias pointing to the identical PyListObject; mutations via b immediately reflect in a. Shallow copy (b = a.copy() or b = a[:]) creates a new outer list container, but nested mutable objects remain shared pointers. Deep copy (copy.deepcopy(a)) recursively clones both outer and all inner mutable objects, providing complete memory isolation.',
      example: `import copy

# 1. Aliasing (Shared Identity)
orig = [1, [2, 3]]
alias = orig
alias[0] = 999
print("Aliased orig[0] mutated:", orig[0])  # 999 (same list!)
print("id(orig) == id(alias):", id(orig) == id(alias))  # True

# 2. Shallow Copy (.copy() or [:])
orig = [1, [2, 3]]
shallow = orig.copy()
shallow[0] = 42       # Outer item is isolated
shallow[1].append(4)  # Inner mutable list is SHARED!
print("Shallow orig:", orig)       # [1, [2, 3, 4]] -> inner list mutated!
print("Shallow copy:", shallow)    # [42, [2, 3, 4]]

# 3. Deep Copy (copy.deepcopy)
orig = [1, [2, 3]]
deep = copy.deepcopy(orig)
deep[1].append(99)
print("Deep orig (intact!):", orig) # [1, [2, 3]]
print("Deep copy (isolated):", deep) # [1, [2, 3, 99]]`,
    },
  ],
  sourceNotes: [
    "Source attribution: Asabeneh Yetayeh's '30 Days of Python' (Day 5 - Lists).",
    "Covers dynamic array internals, mutability, indexing, slicing, 11 core methods, and copying semantics.",
  ],
};
