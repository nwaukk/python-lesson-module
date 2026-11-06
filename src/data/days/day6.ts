import { DayModule } from '../../engine/lesson/types';

export const DAY_6_MODULE: DayModule = {
  "schemaVersion": 1,
  "number": 6,
  "title": "Tuples",
  "level": "beginner",
  "sourceUrl": "https://github.com/Asabeneh/30-Days-Of-Python/tree/master/06_Day_Tuples",
  "estimatedMinutes": 65,
  "prerequisites": [
    5
  ],
  "objectives": [
    "Understand tuples as ordered, immutable sequence collections stored as contiguous pointer tables in CPython",
    "Master tuple literal syntax (), comma-delimited packing, and the critical single-element comma rule (x,)",
    "Traverse tuple elements using 0-based positive offsets and negative indexing from -1 to -len",
    "Slice tuples with [start:stop:step] and negative strides without risking IndexError",
    "Recognize strict immutability (TypeError on assignment) and diagnose the nested mutable container trap",
    "Execute conversion strategies between mutable lists and immutable tuples (list() <-> tuple())",
    "Deconstruct sequences with standard unpacking and PEP 3132 extended starred expressions (*rest)",
    "Leverage implicit tuple packing for atomic variable swapping (a, b = b, a) and multi-value returns",
    "Understand hashability rules and employ immutable tuples as composite dictionary keys and set members",
    "Utilize the minimal tuple method API (count() and index()) and measure CPython memory efficiency"
  ],
  "subtopics": [
    {
      "id": "day6-sub1",
      "number": 1,
      "title": "Tuple Creation, Syntax & The Single-Element Comma Rule",
      "summary": "Explore tuple literals, the difference between parentheses and commas, and why single-item tuples strictly require a trailing comma.",
      "estimatedMinutes": 7,
      "introduce": {
        "headline": "The Fixed Sequence: Commas Define Tuples, Not Parentheses",
        "paragraphs": [
          "A tuple is an ordered, immutable sequence of elements. In Python, tuples can store heterogeneous objects—integers, floats, strings, booleans, lists, and nested tuples.",
          "While tuples are conventionally enclosed in parentheses ( ), it is actually the comma (,) that syntactically constructs a tuple in Python! Parentheses are primarily used for syntactic grouping and disambiguation in expressions.",
          "Crucial Watch-out: A single value enclosed in parentheses without a comma—such as single = (\"Python\")—is simply an expression in parentheses; its type is str, NOT tuple! To create a single-element tuple, you MUST include a trailing comma: single = (\"Python\",) or single = \"Python\",.",
          "Empty tuples are constructed with an empty pair of parentheses () or the built-in constructor tuple(). When passed an iterable, tuple(iterable) creates a tuple from the items."
        ],
        "keyTerms": [
          {
            "term": "Tuple",
            "definition": "An ordered, immutable sequence container in Python."
          },
          {
            "term": "Trailing Comma",
            "definition": "The mandatory comma after a single item in parentheses required to construct a 1-tuple."
          },
          {
            "term": "Heterogeneous",
            "definition": "Capable of containing objects of multiple disparate data types within the same container."
          },
          {
            "term": "tuple()",
            "definition": "Built-in constructor that converts an iterable sequence into an immutable tuple."
          }
        ],
        "bulletPoints": [
          "empty = () or tuple() creates an empty tuple with 0 elements.",
          "single = (42,) requires a trailing comma; (42) is just the integer 42.",
          "Parentheses can often be omitted in simple assignments: t = 1, 2, 3.",
          "tuple(iterable) creates a tuple from strings, lists, ranges, or sets."
        ]
      },
      "visualise": {
        "type": "tuple-list-memory-inspector",
        "title": "Tuple vs List Memory Architecture",
        "badge": "simulation",
        "description": "Observe how CPython allocates a fixed contiguous pointer table for tuples with zero slack buffer.",
        "initialConfig": {
          "mode": "creation"
        }
      },
      "code": [
        {
          "title": "Creating Tuples & The Single-Element Comma Rule",
          "runMode": "real",
          "code": "# 1. Empty tuples\nempty_1 = ()\nempty_2 = tuple()\nprint(\"Empty:\", empty_1, \"Type:\", type(empty_1))\n\n# 2. Populated tuples (heterogeneous items)\nserver_config = (\"192.168.1.100\", 8080, True, 2.5)\nprint(\"Config:\", server_config)\nprint(\"Length:\", len(server_config))\n\n# 3. The Single-Element Comma Trap!\nnot_a_tuple = (\"Python\")\nis_a_tuple = (\"Python\",)\nprint(\"not_a_tuple type:\", type(not_a_tuple))\nprint(\"is_a_tuple type: \", type(is_a_tuple))\n\n# 4. Constructing from iterables\nvowels = tuple(\"aeiou\")\nnum_range = tuple(range(1, 6))\nprint(\"Vowels:\", vowels)\nprint(\"Range: \", num_range)",
          "expectedOutput": "Empty: () Type: <class 'tuple'>\nConfig: ('192.168.1.100', 8080, True, 2.5)\nLength: 4\nnot_a_tuple type: <class 'str'>\nis_a_tuple type:  <class 'tuple'>\nVowels: ('a', 'e', 'i', 'o', 'u')\nRange:  (1, 2, 3, 4, 5)"
        }
      ],
      "explain": [
        {
          "step": 1,
          "codeLine": 2,
          "instruction": "empty_1 = ()",
          "internalEffect": "Allocates an empty PyTupleObject. In CPython, empty tuples share a single cached singleton instance."
        },
        {
          "step": 2,
          "codeLine": 7,
          "instruction": "server_config = (\"192.168.1.100\", ...)",
          "internalEffect": "Allocates a 4-element PyTupleObject storing 64-bit pointers to the heap objects without over-allocation slack."
        },
        {
          "step": 3,
          "codeLine": 12,
          "instruction": "not_a_tuple = (\"Python\")",
          "internalEffect": "Parentheses act as expression grouping; assigns str reference directly without creating a tuple."
        },
        {
          "step": 4,
          "codeLine": 13,
          "instruction": "is_a_tuple = (\"Python\",)",
          "internalEffect": "Trailing comma triggers CPython parser tuple grammar; allocates 1-element PyTupleObject."
        }
      ],
      "apply": {
        "domain": "Data Center Infrastructure & Geospatial Config",
        "contextTitle": "Immutable Server Hardware Location Profile",
        "scenario": "Configuring fixed immutable geographical coordinates and hardware specs for Nigerian financial data centers that must not be altered at runtime."
      },
      "commonMistakes": [
        {
          "label": "Declaring a 1-item Tuple Without a Trailing Comma",
          "explanation": "Without the trailing comma, Python treats (100) as the integer 100 wrapped in mathematical grouping parentheses.",
          "erroneousCode": "val = (100)\nprint(type(val))  # <class 'int'>, NOT tuple!",
          "correctedCode": "val = (100,)\nprint(type(val))  # <class 'tuple'>"
        }
      ],
      "sourceNotes": "Derived from Asabeneh's 30 Days of Python: Day 6 Tuples (Creating a Tuple, Empty Tuple, Tuple with Items).",
      "practise": [
        {
          "id": "d6-s1-ex1",
          "title": "Identifying Single-Element Tuple Syntax",
          "type": "scenario-mcq",
          "tier": "foundation",
          "points": 10,
          "contextScenario": "Database Driver Configuration, Lagos",
          "prompt": "Which statement correctly creates a single-element tuple containing the string \"API_KEY\"?",
          "options": [
            {
              "id": "opt-1",
              "text": "token = (\"API_KEY\",)",
              "explanation": "Correct! The trailing comma tells Python this is a 1-element tuple, not mathematical grouping.",
              "isCorrect": true
            },
            {
              "id": "opt-2",
              "text": "token = (\"API_KEY\")",
              "explanation": "Incorrect. Without a trailing comma, (\"API_KEY\") is simply the string \"API_KEY\" wrapped in grouping parentheses.",
              "isCorrect": false
            },
            {
              "id": "opt-3",
              "text": "token = tuple \"API_KEY\"",
              "explanation": "Incorrect. tuple is a function/type constructor, not a keyword; it requires function call syntax tuple(\"API_KEY\").",
              "isCorrect": false
            },
            {
              "id": "opt-4",
              "text": "token = [\"API_KEY\"]",
              "explanation": "Incorrect. Square brackets create a mutable list, not an immutable tuple.",
              "isCorrect": false
            }
          ],
          "hints": [
            "In Python, commas make tuples, not parentheses.",
            "A single element enclosed in () without a comma evaluates to the inner object type.",
            "Add a comma after the item: (item,)."
          ]
        },
        {
          "id": "d6-s1-ex2",
          "title": "Fill Gaps: Tuple Literal and Constructor Grammar",
          "type": "fill-the-gaps",
          "tier": "standard",
          "points": 15,
          "contextScenario": "High-Integrity Financial Config",
          "prompt": "Complete the statements to construct an empty tuple, a single-item integer tuple, and a tuple converted from a range.",
          "gaps": [
            {
              "id": "g1",
              "beforeText": "empty_record = ",
              "afterText": "",
              "correctAnswer": "()",
              "options": [
                "()",
                "[]",
                "{}",
                "set()"
              ]
            },
            {
              "id": "g2",
              "beforeText": "tax_rate = (15",
              "afterText": ")",
              "correctAnswer": ",",
              "options": [
                ",",
                ";",
                ":",
                ""
              ]
            },
            {
              "id": "g3",
              "beforeText": "id_sequence = ",
              "afterText": "(range(1, 5))",
              "correctAnswer": "tuple",
              "options": [
                "tuple",
                "list",
                "dict",
                "str"
              ]
            }
          ],
          "hints": [
            "An empty tuple literal is represented by empty parentheses ().",
            "A 1-element tuple requires a trailing comma after the value.",
            "The built-in constructor for tuples is tuple()."
          ]
        }
      ]
    },
    {
      "id": "day6-sub2",
      "number": 2,
      "title": "Positive & Negative Indexing Offsets in Read-Only Memory",
      "summary": "Access tuple items using zero-based positive offsets from the head and negative offsets from the tail, while avoiding IndexError.",
      "estimatedMinutes": 6,
      "introduce": {
        "headline": "Random-Access Read: Constant O(1) Pointer Traversal",
        "paragraphs": [
          "Like strings and lists, tuples are ordered sequence collections supporting direct random access via indexing: item = t[index].",
          "Indexing uses zero-based positive indexing starting from 0 up to len(t) - 1 from the left, and negative indexing from -1 down to -len(t) from the right.",
          "Because a tuple is stored as a contiguous C array of 64-bit pointers (PyObject** ob_item), index lookups are constant time O(1). The CPU calculates the target memory address with pointer arithmetic: base_address + (index * 8 bytes).",
          "Crucial Watch-out: Accessing an index outside the valid range raises an IndexError: tuple index out of range. Always verify index boundaries with len(t) when offsets are computed dynamically."
        ],
        "keyTerms": [
          {
            "term": "Positive Indexing",
            "definition": "Zero-based offset from the left (0 to len(t) - 1)."
          },
          {
            "term": "Negative Indexing",
            "definition": "Negative offset counting backwards from the right (-1 to -len(t))."
          },
          {
            "term": "IndexError",
            "definition": "Exception raised when attempting to access a sequence offset outside valid bounds."
          },
          {
            "term": "O(1) Access",
            "definition": "Constant-time memory retrieval regardless of how many elements are in the tuple."
          }
        ],
        "bulletPoints": [
          "t[0] accesses the first element; t[-1] accesses the final element.",
          "Valid positive index range: 0 <= index < len(t).",
          "Valid negative index range: -len(t) <= index <= -1.",
          "Out-of-bounds index access raises IndexError: tuple index out of range."
        ]
      },
      "visualise": {
        "type": "string-index-slice",
        "title": "Tuple Indexing & Memory Offsets",
        "badge": "simulation",
        "description": "Inspect positive and negative index offsets across a fixed sequence.",
        "initialConfig": {
          "sequence": "(\"BTC\", \"ETH\", \"SOL\", \"USDT\")"
        }
      },
      "code": [
        {
          "title": "Positive and Negative Indexing on a Tuple",
          "runMode": "real",
          "code": "crypto_assets = (\"Bitcoin\", \"Ethereum\", \"Solana\", \"Cardano\", \"Ripple\")\n\n# 1. Positive indexing (0 to len - 1)\nfirst = crypto_assets[0]\nthird = crypto_assets[2]\nprint(\"First: \", first)\nprint(\"Third: \", third)\n\n# 2. Negative indexing (-1 to -len)\nlast = crypto_assets[-1]\nsecond_last = crypto_assets[-2]\nprint(\"Last:        \", last)\nprint(\"Second last: \", second_last)\n\n# 3. Defensive boundary inspection\ntarget_idx = 10\nif 0 <= target_idx < len(crypto_assets):\n    print(\"Found:\", crypto_assets[target_idx])\nelse:\n    print(f\"Index {target_idx} out of range! Valid range: [0, {len(crypto_assets)-1}]\")",
          "expectedOutput": "First:  Bitcoin\nThird:  Solana\nLast:         Ripple\nSecond last:  Cardano\nIndex 10 out of range! Valid range: [0, 4]"
        }
      ],
      "explain": [
        {
          "step": 1,
          "codeLine": 4,
          "instruction": "first = crypto_assets[0]",
          "internalEffect": "Reads the pointer stored at index 0 of the tuple buffer in O(1) time."
        },
        {
          "step": 2,
          "codeLine": 10,
          "instruction": "last = crypto_assets[-1]",
          "internalEffect": "CPython resolves negative index by adding len: 5 + (-1) = 4, retrieving Ripple."
        },
        {
          "step": 3,
          "codeLine": 16,
          "instruction": "if 0 <= target_idx < len(crypto_assets):",
          "internalEffect": "Evaluates bounded inequality to safely prevent an unhandled IndexError."
        }
      ],
      "apply": {
        "domain": "Time & Calendar Services",
        "contextTitle": "ISO Temporal Timestamp Extraction",
        "scenario": "Parsing an ISO timestamp tuple (year, month, day, hour, minute, second) returned from a time server to format human-readable audit timestamps."
      },
      "commonMistakes": [
        {
          "label": "Using 1-Based Indexing for the First Element",
          "explanation": "Python indices start at 0. t[1] accesses the second item in the tuple rather than the head.",
          "erroneousCode": "t = (\"Alpha\", \"Beta\", \"Gamma\")\nprint(\"First item:\", t[1])  # Prints 'Beta'!",
          "correctedCode": "t = (\"Alpha\", \"Beta\", \"Gamma\")\nprint(\"First item:\", t[0])  # Prints 'Alpha'"
        }
      ],
      "sourceNotes": "Derived from Asabeneh's 30 Days of Python: Day 6 Tuples (Accessing Tuple Items, Positive Indexing, Negative Indexing).",
      "practise": [
        {
          "id": "d6-s2-ex1",
          "title": "Predicting Head and Tail Tuple Indexing Offsets",
          "type": "predict-output",
          "tier": "foundation",
          "points": 10,
          "contextScenario": "Server Cluster Node Identification",
          "prompt": "What will be printed when executing the following positive and negative index operations?",
          "options": [
            {
              "id": "opt-1",
              "text": "Alpha Delta Gamma",
              "explanation": "Correct! nodes[0] is \"Alpha\", nodes[-1] is \"Delta\", and nodes[-2] is \"Gamma\".",
              "isCorrect": true
            },
            {
              "id": "opt-2",
              "text": "Beta Delta Delta",
              "explanation": "Incorrect. Index 0 is \"Alpha\", not \"Beta\".",
              "isCorrect": false
            },
            {
              "id": "opt-3",
              "text": "Alpha Delta Beta",
              "explanation": "Incorrect. nodes[-2] is the second-from-last item (\"Gamma\").",
              "isCorrect": false
            },
            {
              "id": "opt-4",
              "text": "IndexError: tuple index out of range",
              "explanation": "Incorrect. All three indices are well within the valid range [-4, 3].",
              "isCorrect": false
            }
          ],
          "starterCode": "nodes = (\"Alpha\", \"Beta\", \"Gamma\", \"Delta\")\nprint(nodes[0], nodes[-1], nodes[-2])",
          "hints": [
            "Positive indices start at 0 from the left.",
            "Negative indices start at -1 from the right.",
            "-2 refers to the second element from the right."
          ]
        },
        {
          "id": "d6-s2-ex2",
          "title": "Fix the Bug: Guarding Tuple Index Bounds",
          "type": "fix-the-bug",
          "tier": "standard",
          "points": 15,
          "contextScenario": "Network Packet Header Parser",
          "prompt": "The function extract_field attempts to access index len(header), raising IndexError. Fix the code to return header[idx] when valid, or None when out of range.",
          "starterCode": "def extract_field(header, idx):\n    # Bug: len(header) is out of bounds because tuples are 0-indexed!\n    if idx <= len(header):\n        return header[idx]\n    return None",
          "solutionCode": "def extract_field(header, idx):\n    if 0 <= idx < len(header):\n        return header[idx]\n    return None",
          "testCases": [
            {
              "id": "tc1",
              "label": "Valid index",
              "setup": "h = (\"GET\", \"/api/v1\", \"HTTP/1.1\")",
              "expected": "HTTP/1.1", "hidden": false
            },
            {
              "id": "tc2",
              "label": "Out of bounds index",
              "setup": "h = (\"GET\", \"/api/v1\", \"HTTP/1.1\")",
              "expected": "None", "hidden": false
            }
          ],
          "hints": [
            "In a 0-indexed sequence of length N, the maximum valid positive index is N - 1.",
            "Change idx <= len(header) to idx < len(header).",
            "Also ensure 0 <= idx to handle negative numbers if desired."
          ]
        }
      ]
    },
    {
      "id": "day6-sub3",
      "number": 3,
      "title": "Tuple Slicing & Defensive Sequence Extraction",
      "summary": "Extract sub-tuples using slice syntax [start:stop:step], leverage negative strides, and rely on automatic boundary clamping.",
      "estimatedMinutes": 7,
      "introduce": {
        "headline": "Sub-Sequences: Slicing Always Produces a New Tuple",
        "paragraphs": [
          "Slicing allows you to extract a range of elements from a tuple: sub_tuple = t[start:stop:step].",
          "Slicing a tuple follows the universal Python sequence slicing rules: start is inclusive, stop is exclusive, and step specifies the stride increment.",
          "Crucial Rule: Slicing a tuple ALWAYS produces a brand-new tuple object! Slicing never mutates the original tuple (which is impossible anyway due to immutability).",
          "Unlike single-element indexing, slicing NEVER raises IndexError! Out-of-bounds start or stop values are gracefully clamped to sequence boundaries. If start is beyond the end, an empty tuple () is returned.",
          "A negative stride, such as t[::-1], steps backwards through the sequence, producing a reversed clone of the tuple."
        ],
        "keyTerms": [
          {
            "term": "Slicing",
            "definition": "Extracting a contiguous or strided sub-sequence using [start:stop:step]."
          },
          {
            "term": "Exclusive Stop",
            "definition": "The element at the stop index is omitted from the resulting slice."
          },
          {
            "term": "Boundary Clamping",
            "definition": "CPython automatically truncates out-of-bounds slice indices to [0, len]."
          },
          {
            "term": "Negative Stride",
            "definition": "A negative step value (e.g. -1) that traverses the sequence in reverse order."
          }
        ],
        "bulletPoints": [
          "t[start:stop] extracts items from index start up to stop - 1.",
          "Omitted start defaults to 0; omitted stop defaults to len(t).",
          "t[::-1] creates a reversed copy of the tuple.",
          "Slicing never raises IndexError; out-of-bounds indices clamp safely."
        ]
      },
      "visualise": {
        "type": "string-index-slice",
        "title": "Tuple Slice Boundary Clamping",
        "badge": "simulation",
        "description": "Test start, stop, and step parameters and see boundary clamping in real time.",
        "initialConfig": {
          "sequence": "(\"NG\", \"GH\", \"KE\", \"ZA\", \"EG\", \"RW\")"
        }
      },
      "code": [
        {
          "title": "Slicing Tuples with Strides and Reversals",
          "runMode": "real",
          "code": "african_hubs = (\"Lagos\", \"Accra\", \"Nairobi\", \"Johannesburg\", \"Cairo\", \"Kigali\")\n\n# 1. Standard sub-slice [start:stop]\nwest_africa = african_hubs[0:2]\neast_africa = african_hubs[2:4]\nprint(\"West Africa hubs:\", west_africa)\nprint(\"Middle hubs:     \", east_africa)\n\n# 2. Omitted boundaries\nfirst_three = african_hubs[:3]\nfrom_third = african_hubs[3:]\nprint(\"First three:     \", first_three)\nprint(\"From third onward:\", from_third)\n\n# 3. Strided stepping [::step]\nalternate_hubs = african_hubs[::2]\nprint(\"Alternate hubs:  \", alternate_hubs)\n\n# 4. Reversed tuple via negative stride\nreversed_hubs = african_hubs[::-1]\nprint(\"Reversed hubs:   \", reversed_hubs)\n\n# 5. Boundary clamping (no IndexError!)\nclamped = african_hubs[4:999]\nprint(\"Clamped slice:   \", clamped)",
          "expectedOutput": "West Africa hubs: ('Lagos', 'Accra')\nMiddle hubs:      ('Nairobi', 'Johannesburg')\nFirst three:      ('Lagos', 'Accra', 'Nairobi')\nFrom third onward: ('Johannesburg', 'Cairo', 'Kigali')\nAlternate hubs:   ('Lagos', 'Nairobi', 'Cairo')\nReversed hubs:    ('Kigali', 'Cairo', 'Johannesburg', 'Nairobi', 'Accra', 'Lagos')\nClamped slice:    ('Cairo', 'Kigali')"
        }
      ],
      "explain": [
        {
          "step": 1,
          "codeLine": 4,
          "instruction": "west_africa = african_hubs[0:2]",
          "internalEffect": "Allocates a new 2-element PyTupleObject copying pointers for indices 0 and 1."
        },
        {
          "step": 2,
          "codeLine": 16,
          "instruction": "alternate_hubs = african_hubs[::2]",
          "internalEffect": "Steps through pointer table with stride=2 (indices 0, 2, 4) into a new tuple."
        },
        {
          "step": 3,
          "codeLine": 20,
          "instruction": "reversed_hubs = african_hubs[::-1]",
          "internalEffect": "Iterates backwards from index 5 to 0, producing a reversed tuple clone."
        }
      ],
      "apply": {
        "domain": "Database Records & Pagination",
        "contextTitle": "Immutable Record Paging Window",
        "scenario": "Paginating through an immutable tuple of transaction reference codes in chunks of 3 without risking IndexError on trailing pages."
      },
      "commonMistakes": [
        {
          "label": "Assuming Slicing a Tuple Produces a List",
          "explanation": "Slicing a sequence always produces an instance of the same type. Slicing a tuple produces another immutable tuple.",
          "erroneousCode": "t = (1, 2, 3)\nsub = t[0:2]\nsub.append(4)  # AttributeError: 'tuple' object has no attribute 'append'",
          "correctedCode": "sub = list(t[0:2])\nsub.append(4)  # Convert to list first!"
        }
      ],
      "sourceNotes": "Derived from Asabeneh's 30 Days of Python: Day 6 Tuples (Slicing Tuples, Positive Slicing, Negative Slicing).",
      "practise": [
        {
          "id": "d6-s3-ex1",
          "title": "Tuple Slice Step & Stride Properties",
          "type": "scenario-mcq",
          "tier": "standard",
          "points": 10,
          "contextScenario": "Signal Sampling Pipeline",
          "prompt": "Given sample = (10, 20, 30, 40, 50, 60), what is the value of sample[::-2]?",
          "options": [
            {
              "id": "opt-1",
              "text": "(60, 40, 20)",
              "explanation": "Correct! A step of -2 traverses backwards from the tail (index 5 -> 60), stepping back by 2 (index 3 -> 40, index 1 -> 20).",
              "isCorrect": true
            },
            {
              "id": "opt-2",
              "text": "(50, 30, 10)",
              "explanation": "Incorrect. Negative stride defaults to starting at the final element (index -1, which is 60).",
              "isCorrect": false
            },
            {
              "id": "opt-3",
              "text": "[60, 40, 20]",
              "explanation": "Incorrect. Slicing a tuple produces another tuple, not a list.",
              "isCorrect": false
            },
            {
              "id": "opt-4",
              "text": "(10, 30, 50)",
              "explanation": "Incorrect. That is sample[::2] (forward stride), not sample[::-2] (reverse stride).",
              "isCorrect": false
            }
          ],
          "hints": [
            "Negative step means reverse traversal starting from the last item.",
            "Stride of 2 skips every other item.",
            "The result is a tuple, maintaining container type."
          ]
        },
        {
          "id": "d6-s3-ex2",
          "title": "Write Code: Extracting Sub-Tuple Windows with Boundary Clamping",
          "type": "write-code",
          "tier": "challenge",
          "points": 20,
          "contextScenario": "Financial Ledger Chunking",
          "prompt": "Write a function slice_ledger(records, start, end) that returns a slice of records from start up to end. If start is greater than or equal to len(records), return an empty tuple ().\n\nVerify that slicing never raises IndexError.",
          "starterCode": "def slice_ledger(records, start, end):\n    # Return slice records[start:end] safely\n    pass",
          "solutionCode": "def slice_ledger(records, start, end):\n    return records[start:end]",
          "testCases": [
            {
              "id": "tc1",
              "label": "Normal slice",
              "setup": "r = (\"A\", \"B\", \"C\", \"D\", \"E\")",
              "expected": "('B', 'C', 'D')", "hidden": false
            },
            {
              "id": "tc2",
              "label": "Clamped slice",
              "setup": "r = (\"A\", \"B\", \"C\")",
              "expected": "('B', 'C')", "hidden": false
            }
          ],
          "hints": [
            "In Python, slicing records[start:end] automatically handles boundary clamping without exceptions.",
            "Directly return records[start:end].",
            "The result will always be a tuple."
          ]
        },
        {
          "id": "d6-s3-ex3",
          "title": "Project: Defensive Geospatial Waypoint Normalizer",
          "type": "write-code",
          "tier": "project",
          "points": 25,
          "contextScenario": "Drone Flight Path Geofencing, Abuja",
          "prompt": "Write a function normalize_waypoints(raw_coords) that takes a sequence of raw coordinate tuples and returns an immutable tuple of sanitized coordinates. Each coordinate must be a 2-tuple (lat, lon) rounded to 4 decimal places. If any coordinate has fewer than 2 elements, skip it.",
          "starterCode": "def normalize_waypoints(raw_coords):\n    # Return an immutable tuple of (round(lat, 4), round(lon, 4))\n    pass",
          "solutionCode": "def normalize_waypoints(raw_coords):\n    cleaned = []\n    for pt in raw_coords:\n        if len(pt) >= 2:\n            cleaned.append((round(float(pt[0]), 4), round(float(pt[1]), 4)))\n    return tuple(cleaned)",
          "testCases": [
            {
              "id": "tc1",
              "label": "Standard points",
              "setup": "pts = ((9.076472, 7.398574), (6.524379, 3.379206))",
              "expected": "((9.0765, 7.3986), (6.5244, 3.3792))", "hidden": false
            },
            {
              "id": "tc2",
              "label": "With malformed point",
              "setup": "pts = ((9.076472, 7.398574), (1.0,), (6.524379, 3.379206))",
              "expected": "((9.0765, 7.3986), (6.5244, 3.3792))", "hidden": false
            }
          ],
          "hints": [
            "Iterate through raw_coords and check len(pt) >= 2.",
            "Round lat and lon using round(float(pt[0]), 4).",
            "Freeze into an immutable tuple before returning: tuple(cleaned)."
          ]
        }
      ]
    },
    {
      "id": "day6-sub4",
      "number": 4,
      "title": "Strict Immutability & The Inner Mutable Container Trap",
      "summary": "Grasp why tuple container bindings are frozen, how nested mutable objects behave, and diagnose the augmented assignment paradox.",
      "estimatedMinutes": 8,
      "introduce": {
        "headline": "Container Immutability vs Object Immutability",
        "paragraphs": [
          "The defining guarantee of a Python tuple is immutability: once created, the sequence of references stored in the tuple cannot be modified, reordered, added to, or deleted.",
          "Attempting to reassign an element directly—such as t[0] = \"new\"—immediately raises TypeError: 'tuple' object does not support item assignment.",
          "The Critical Nuance: A tuple's immutability applies strictly to its OWN internal table of object references! If a tuple holds a reference to a MUTABLE object (such as a list), the contents of that list can still be mutated in place!",
          "The Augmented Assignment Paradox: Executing t[1] += [4] where t[1] is a list will actually append 4 to the list, AND THEN immediately raise a TypeError! This occurs because += evaluates INPLACE_ADD (which succeeds), and then evaluates STORE_SUBSCR to rebind t[1] (which the tuple rejects)."
        ],
        "keyTerms": [
          {
            "term": "Strict Immutability",
            "definition": "The tuple object pointer table cannot be altered after instantiation."
          },
          {
            "term": "Shallow Immutability",
            "definition": "Tuples freeze their own reference slots, but do not make referenced objects immutable."
          },
          {
            "term": "TypeError",
            "definition": "Exception raised when trying to overwrite a tuple item (t[0] = x)."
          },
          {
            "term": "STORE_SUBSCR",
            "definition": "CPython bytecode instruction that attempts to assign a value to a subscripted container."
          }
        ],
        "bulletPoints": [
          "t[0] = x raises TypeError: 'tuple' object does not support item assignment.",
          "Tuples do not support append(), extend(), insert(), remove(), pop(), or clear().",
          "If t[i] is a list, t[i].append(val) succeeds because the list object reference is unchanged.",
          "t[i] += [val] modifies the nested list AND raises TypeError (avoid augmented assignment on tuples!)."
        ]
      },
      "visualise": {
        "type": "tuple-immutability-trap",
        "title": "Tuple Immutability & Nested Mutability Inspector",
        "badge": "simulation",
        "description": "Interact with immutable slots and mutable nested list buffers to see exceptions and state changes.",
        "initialConfig": {
          "slot1Type": "list"
        }
      },
      "code": [
        {
          "title": "Direct Mutation Rejection vs Nested List Mutation",
          "runMode": "real",
          "code": "# 1. Direct item assignment raises TypeError\ncoordinates = (6.5244, 3.3792)\ntry:\n    coordinates[0] = 7.0000\nexcept TypeError as err:\n    print(\"Caught expected error:\", err)\n\n# 2. Tuple containing a mutable list\nuser_session = (\"USR-7721\", [\"AUTH_LOGIN\", \"VIEW_DASHBOARD\"], \"ACTIVE\")\nprint(\"Initial session:\", user_session)\nprint(\"Tuple id:       \", id(user_session))\n\n# Mutating the nested list in-place succeeds!\nuser_session[1].append(\"TRANSFER_FUNDS\")\nprint(\"Mutated session:\", user_session)\nprint(\"Tuple id unchanged:\", id(user_session))\n\n# 3. The Augmented Assignment Paradox\nsample_tuple = (10, [20, 30])\ntry:\n    sample_tuple[1] += [40]\nexcept TypeError as err:\n    print(\"Caught paradox error:\", err)\n\nprint(\"List was still modified:\", sample_tuple)",
          "expectedOutput": "Caught expected error: 'tuple' object does not support item assignment\nInitial session: ('USR-7721', ['AUTH_LOGIN', 'VIEW_DASHBOARD'], 'ACTIVE')\nTuple id:        140735512345600\nMutated session: ('USR-7721', ['AUTH_LOGIN', 'VIEW_DASHBOARD', 'TRANSFER_FUNDS'], 'ACTIVE')\nTuple id unchanged: 140735512345600\nCaught paradox error: 'tuple' object does not support item assignment\nList was still modified: (10, [20, 30, 40])"
        }
      ],
      "explain": [
        {
          "step": 1,
          "codeLine": 4,
          "instruction": "coordinates[0] = 7.0000",
          "internalEffect": "Raises TypeError because PyTupleObject is write-protected in memory."
        },
        {
          "step": 2,
          "codeLine": 14,
          "instruction": "user_session[1].append(\"TRANSFER_FUNDS\")",
          "internalEffect": "Retrieves the list pointer and calls PyList_Append. The tuple pointer address is unaffected."
        },
        {
          "step": 3,
          "codeLine": 21,
          "instruction": "sample_tuple[1] += [40]",
          "internalEffect": "INPLACE_ADD appends 40 to list in-place, then STORE_SUBSCR raises TypeError trying to rebind sample_tuple[1]."
        }
      ],
      "apply": {
        "domain": "Cybersecurity & Audit Logs",
        "contextTitle": "Tamper-Evident API Credential Configuration",
        "scenario": "Configuring defensive API credentials where endpoint URL and API secret key are immutable, but an internal audit list records incoming requests."
      },
      "commonMistakes": [
        {
          "label": "Using += on a Nested Mutable List Inside a Tuple",
          "explanation": "Executing t[1] += [...] raises a TypeError because Python tries to reassign the subscripted tuple slot, even though the list was mutated.",
          "erroneousCode": "t = (\"A\", [1, 2])\nt[1] += [3]  # Raises TypeError: 'tuple' object does not support item assignment!",
          "correctedCode": "t[1].extend([3])  # Or t[1].append(3) directly without assignment!"
        }
      ],
      "sourceNotes": "Derived from Asabeneh's 30 Days of Python: Day 6 Tuples (Changing Tuples to Lists, Immutability Semantics).",
      "practise": [
        {
          "id": "d6-s4-ex1",
          "title": "Theory: Container Immutability vs Nested Mutable Content",
          "type": "theory-reasoning",
          "tier": "challenge",
          "points": 15,
          "contextScenario": "CPython Memory Architecture Inspection",
          "prompt": "Given record = (\"KYC_OK\", [100, 200]), why does record[1].append(300) succeed while record[0] = \"KYC_REVOKED\" raises TypeError?",
          "options": [
            {
              "id": "opt-1",
              "text": "The tuple holds fixed pointers in its ob_item array; appending to the list mutates the list buffer in-place without changing the pointer stored in the tuple.",
              "explanation": "Correct! Shallow immutability means the tuple pointer table is write-protected, but the heap objects pointed to may themselves be mutable.",
              "isCorrect": true
            },
            {
              "id": "opt-2",
              "text": "Lists inside tuples are automatically cloned to prevent mutation.",
              "explanation": "Incorrect. Python does not clone objects placed in tuples; it stores direct object pointers.",
              "isCorrect": false
            },
            {
              "id": "opt-3",
              "text": "Strings are mutable in Python if enclosed in tuples.",
              "explanation": "Incorrect. Strings are strictly immutable in all contexts.",
              "isCorrect": false
            },
            {
              "id": "opt-4",
              "text": "Python permits mutation of any tuple element at index 1 or higher.",
              "explanation": "Incorrect. All tuple indices 0..len-1 are write-protected.",
              "isCorrect": false
            }
          ],
          "hints": [
            "Consider what a tuple physically stores in memory: an array of 64-bit object pointers.",
            "Does calling list.append() alter the memory address of the list itself?",
            "Does reassigning record[0] try to alter a pointer inside the tuple table?"
          ]
        },
        {
          "id": "d6-s4-ex2",
          "title": "Predict Output: The Augmented Assignment Paradox",
          "type": "predict-output",
          "tier": "challenge",
          "points": 15,
          "contextScenario": "CPython Bytecode Traps",
          "prompt": "What will be printed when running this code containing the famous tuple augmented assignment paradox?",
          "options": [
            {
              "id": "opt-1",
              "text": "Error: TypeError | t: (10, [20, 30, 40])",
              "explanation": "Correct! CPython evaluates += via INPLACE_ADD (which mutates the list in place) and then STORE_SUBSCR (which raises TypeError on the tuple). The list was modified despite the error!",
              "isCorrect": true
            },
            {
              "id": "opt-2",
              "text": "Error: TypeError | t: (10, [20, 30])",
              "explanation": "Incorrect. The list is mutated by the in-place addition before the assignment raises TypeError.",
              "isCorrect": false
            },
            {
              "id": "opt-3",
              "text": "No error | t: (10, [20, 30, 40])",
              "explanation": "Incorrect. An error IS raised because t[1] is an immutable subscript.",
              "isCorrect": false
            },
            {
              "id": "opt-4",
              "text": "AttributeError | t: (10, [20, 30])",
              "explanation": "Incorrect. The error is a TypeError, not AttributeError.",
              "isCorrect": false
            }
          ],
          "starterCode": "t = (10, [20, 30])\nerr_name = \"None\"\ntry:\n    t[1] += [40]\nexcept TypeError as e:\n    err_name = \"TypeError\"\n\nprint(f\"Error: {err_name} | t: {t}\")",
          "hints": [
            "+= does two operations: in-place addition, then assignment back to t[1].",
            "The in-place addition modifies the mutable list.",
            "The assignment to the tuple subscript raises TypeError."
          ]
        }
      ]
    },
    {
      "id": "day6-sub5",
      "number": 5,
      "title": "Converting Sequences: list() <-> tuple() Strategies",
      "summary": "Convert immutable tuples to mutable lists for modification, and freeze lists back into tuples for defensive integrity.",
      "estimatedMinutes": 6,
      "introduce": {
        "headline": "The Convert-Mutate-Freeze Pattern",
        "paragraphs": [
          "Because tuples cannot be modified in place, what should you do when you genuinely need to update, insert, or delete an item from an existing tuple?",
          "The standard Python idiom is the Convert-Mutate-Freeze pattern: 1) Convert the tuple to a mutable list using list(t); 2) Perform whatever modifications are needed (append, remove, insert, reassign); 3) Freeze the list back into an immutable tuple using tuple(lst).",
          "Similarly, when a mutable list has finished its dynamic construction phase, converting it to a tuple signals to other developers and modules that the data is now fixed and should not be mutated.",
          "Crucial Watch-out: Converting creates a brand-new object with a new memory ID. The original tuple remains untouched if referenced elsewhere."
        ],
        "keyTerms": [
          {
            "term": "Convert-Mutate-Freeze",
            "definition": "The idiomatic pattern of converting a tuple to a list, modifying it, and casting back to a tuple."
          },
          {
            "term": "list(t)",
            "definition": "Constructor creating a new mutable list shallow-copying items from tuple t."
          },
          {
            "term": "tuple(l)",
            "definition": "Constructor freezing elements of list l into a new immutable tuple."
          }
        ],
        "bulletPoints": [
          "Use list(tuple_obj) to convert a tuple into a mutable list.",
          "Mutate the list using standard list operations (.append, .insert, del).",
          "Use tuple(list_obj) to convert the modified list back into an immutable tuple.",
          "Each conversion allocates a new container; inner object references are shallow-copied."
        ]
      },
      "visualise": {
        "type": "type-conversion",
        "title": "Sequence Conversion Visualiser",
        "badge": "simulation",
        "description": "Observe sequence type conversion between tuple and list containers.",
        "initialConfig": {
          "from": "tuple",
          "to": "list"
        }
      },
      "code": [
        {
          "title": "The Convert-Mutate-Freeze Idiom",
          "runMode": "real",
          "code": "# Original immutable tuple\nallowed_currencies = (\"NGN\", \"USD\", \"GBP\", \"EUR\")\nprint(\"Original tuple: \", allowed_currencies)\n\n# Step 1: Convert to mutable list\ncurrency_list = list(allowed_currencies)\nprint(\"Mutable list:   \", currency_list)\n\n# Step 2: Mutate using list methods\ncurrency_list.append(\"CAD\")\ncurrency_list.insert(1, \"GHS\")\ncurrency_list.remove(\"EUR\")\nprint(\"Modified list:  \", currency_list)\n\n# Step 3: Freeze back into an immutable tuple\nupdated_currencies = tuple(currency_list)\nprint(\"Updated tuple:  \", updated_currencies)\nprint(\"Type:           \", type(updated_currencies))",
          "expectedOutput": "Original tuple:  ('NGN', 'USD', 'GBP', 'EUR')\nMutable list:    ['NGN', 'USD', 'GBP', 'EUR']\nModified list:   ['NGN', 'GHS', 'USD', 'GBP', 'CAD']\nUpdated tuple:   ('NGN', 'GHS', 'USD', 'GBP', 'CAD')\nType:            <class 'tuple'>"
        }
      ],
      "explain": [
        {
          "step": 1,
          "codeLine": 6,
          "instruction": "currency_list = list(allowed_currencies)",
          "internalEffect": "Allocates a new PyListObject and shallow-copies pointers from the tuple."
        },
        {
          "step": 2,
          "codeLine": 10,
          "instruction": "currency_list.append(\"CAD\")",
          "internalEffect": "Mutates the list in place using dynamic array over-allocation."
        },
        {
          "step": 3,
          "codeLine": 16,
          "instruction": "updated_currencies = tuple(currency_list)",
          "internalEffect": "Allocates a new PyTupleObject of exact size 5 and freezes the items."
        }
      ],
      "apply": {
        "domain": "Corporate Governance & Equity Registries",
        "contextTitle": "Immutable Board of Directors Registry Update",
        "scenario": "Updating an immutable board of directors registry safely by unfreezing, appending an approved member, and re-freezing into a permanent tuple."
      },
      "commonMistakes": [
        {
          "label": "Attempting to Call List Mutating Methods Directly on a Tuple",
          "explanation": "Tuples have no mutating methods. Attempting t.append() raises AttributeError.",
          "erroneousCode": "t = (\"a\", \"b\")\nt.append(\"c\")  # AttributeError: 'tuple' object has no attribute 'append'",
          "correctedCode": "lst = list(t)\nlst.append(\"c\")\nt = tuple(lst)"
        }
      ],
      "sourceNotes": "Derived from Asabeneh's 30 Days of Python: Day 6 Tuples (Changing Tuples to Lists and Lists to Tuples).",
      "practise": [
        {
          "id": "d6-s5-ex1",
          "title": "Order the Lines: The Convert-Mutate-Freeze Pattern",
          "type": "order-the-lines",
          "tier": "standard",
          "points": 15,
          "contextScenario": "Corporate Board Registry Update",
          "prompt": "Arrange the lines in logical sequence to take an immutable tuple of directors, append a new director, sort them alphabetically, and freeze them back into a tuple.",
          "jumbledLines": [
            {
              "id": "l1",
              "code": "directors = (\"Bello\", \"Adewale\", \"Chidi\")",
              "indent": 0
            },
            {
              "id": "l2",
              "code": "directors_list = list(directors)",
              "indent": 0
            },
            {
              "id": "l3",
              "code": "directors_list.append(\"Zainab\")",
              "indent": 0
            },
            {
              "id": "l4",
              "code": "directors_list.sort()",
              "indent": 0
            },
            {
              "id": "l5",
              "code": "directors = tuple(directors_list)",
              "indent": 0
            }
          ],
          "correctLineOrder": [
            "l1",
            "l2",
            "l3",
            "l4",
            "l5"
          ],
          "hints": [
            "First initialize the original tuple.",
            "Convert it to a list using list().",
            "Mutate the list (.append, .sort).",
            "Finally freeze back to a tuple with tuple()."
          ]
        },
        {
          "id": "d6-s5-ex2",
          "title": "Write Code: Immutable Record Insert Helper",
          "type": "write-code",
          "tier": "standard",
          "points": 20,
          "contextScenario": "Financial Routing Gateway",
          "prompt": "Write a function insert_into_tuple(tpl, index, item) that accepts an immutable tuple, inserts item at the specified index, and returns a new updated tuple.\n\nDo not mutate the original tuple.",
          "starterCode": "def insert_into_tuple(tpl, index, item):\n    # Convert to list, insert, and return frozen tuple\n    pass",
          "solutionCode": "def insert_into_tuple(tpl, index, item):\n    lst = list(tpl)\n    lst.insert(index, item)\n    return tuple(lst)",
          "testCases": [
            {
              "id": "tc1",
              "label": "Insert in middle",
              "setup": "t = (\"NGN\", \"USD\", \"EUR\")",
              "expected": "('NGN', 'GBP', 'USD', 'EUR')", "hidden": false
            },
            {
              "id": "tc2",
              "label": "Insert at head",
              "setup": "t = (2, 3)",
              "expected": "(1, 2, 3)", "hidden": false
            }
          ],
          "hints": [
            "Convert tpl to a list with list(tpl).",
            "Use lst.insert(index, item).",
            "Return tuple(lst)."
          ]
        }
      ]
    },
    {
      "id": "day6-sub6",
      "number": 6,
      "title": "Tuple Unpacking & Extended Starred Expressions (*rest)",
      "summary": "Deconstruct sequences with standard unpacking and PEP 3132 extended starred expressions (*rest) to collect intermediate items.",
      "estimatedMinutes": 8,
      "introduce": {
        "headline": "Destructuring: Clean Assignment Without Manual Indexing",
        "paragraphs": [
          "Tuple unpacking (destructuring) allows you to extract elements from a tuple directly into multiple variable names in a single assignment statement: a, b, c = (1, 2, 3).",
          "Standard Unpacking Rule: In 1-to-1 unpacking, the number of variable names on the left must exactly equal the number of elements in the tuple. If they do not match, Python raises ValueError: too many values to unpack (expected X) or ValueError: not enough values to unpack (expected X, got Y).",
          "Extended Starred Unpacking (PEP 3132): When dealing with sequences of unknown or variable length, prefixing a variable with an asterisk (*rest) instructs Python to gather all unassigned elements into a Python list! For example, head, *middle, tail = (1, 2, 3, 4, 5) assigns head=1, middle=[2, 3, 4], and tail=5.",
          "Syntactic Constraint: You may only have AT MOST ONE starred expression in an unpacking assignment statement; having two or more raises SyntaxError: multiple starred expressions in assignment."
        ],
        "keyTerms": [
          {
            "term": "Tuple Unpacking",
            "definition": "Deconstructing a sequence container into separate variables in a single assignment."
          },
          {
            "term": "Starred Expression (*rest)",
            "definition": "PEP 3132 syntax that captures residual sequence items into a Python list."
          },
          {
            "term": "ValueError",
            "definition": "Exception raised when the variable count does not match the tuple length in standard unpacking."
          },
          {
            "term": "SyntaxError",
            "definition": "Exception raised if more than one starred variable is used on the left-hand side."
          }
        ],
        "bulletPoints": [
          "x, y = (10, 20) unpacks items 1-to-1.",
          "Mismatched variable counts raise ValueError.",
          "head, *body, tail = seq captures middle elements into a list body.",
          "*prefix, last = seq captures leading elements into a list prefix.",
          "Only ONE starred expression is permitted per assignment statement."
        ]
      },
      "visualise": {
        "type": "tuple-unpacking-lab",
        "title": "Sequence Unpacking Studio",
        "badge": "simulation",
        "description": "Watch elements map to variables, starred rest gathering into lists, and error handling.",
        "initialConfig": {
          "preset": "starred-middle"
        }
      },
      "code": [
        {
          "title": "Standard and Extended Starred Unpacking",
          "runMode": "real",
          "code": "# 1. Standard 1-to-1 unpacking\nuser = (\"Amina\", 28, \"Fintech Lead\")\nname, age, role = user\nprint(f\"Name: {name}, Age: {age}, Role: {role}\")\n\n# 2. Extended starred unpacking: Middle collection\nscores = (98, 85, 91, 74, 88, 95)\nhighest, *middle_scores, lowest = scores\nprint(\"Highest: \", highest)\nprint(\"Middle:  \", middle_scores)\nprint(\"Lowest:  \", lowest)\n\n# 3. Starred prefix collection\nfile_path_parts = (\"var\", \"log\", \"nginx\", \"access.log\")\n*directories, filename = file_path_parts\nprint(\"Directories:\", directories)\nprint(\"Filename:   \", filename)\n\n# 4. Error demonstrations\ntry:\n    x, y = (1, 2, 3)\nexcept ValueError as err:\n    print(\"Caught ValueError (too many):\", err)\n\ntry:\n    a, b, c = (42,)\nexcept ValueError as err:\n    print(\"Caught ValueError (not enough):\", err)",
          "expectedOutput": "Name: Amina, Age: 28, Role: Fintech Lead\nHighest:  98\nMiddle:   [85, 91, 74, 88]\nLowest:   95\nDirectories: ['var', 'log', 'nginx']\nFilename:    access.log\nCaught ValueError (too many): too many values to unpack (expected 2)\nCaught ValueError (not enough): not enough values to unpack (expected 3, got 1)"
        }
      ],
      "explain": [
        {
          "step": 1,
          "codeLine": 3,
          "instruction": "name, age, role = user",
          "internalEffect": "Unpacks pointers from 3-element tuple directly into local variable table."
        },
        {
          "step": 2,
          "codeLine": 8,
          "instruction": "highest, *middle_scores, lowest = scores",
          "internalEffect": "Assigns scores[0] to highest, scores[-1] to lowest, and gathers scores[1:-1] into a new list middle_scores."
        },
        {
          "step": 3,
          "codeLine": 21,
          "instruction": "x, y = (1, 2, 3)",
          "internalEffect": "Detects sequence length 3 != 2 targets; raises ValueError: too many values to unpack."
        }
      ],
      "apply": {
        "domain": "Fintech Transaction Audit Logs",
        "contextTitle": "Multi-Tag Audit Record Deconstruction",
        "scenario": "Parsing a financial CSV audit log row containing a timestamp, user ID, an arbitrary number of security tags, and an amount."
      },
      "commonMistakes": [
        {
          "label": "Using Multiple Starred Expressions in One Statement",
          "explanation": "Python cannot determine how many elements to divide among multiple starred variables.",
          "erroneousCode": "*a, *b = (1, 2, 3)  # SyntaxError: multiple starred expressions in assignment",
          "correctedCode": "a, *b = (1, 2, 3)   # Only ONE star allowed!"
        }
      ],
      "sourceNotes": "Derived from Asabeneh's 30 Days of Python: Day 6 Tuples (Unpacking Tuples, Slicing Tuples).",
      "practise": [
        {
          "id": "d6-s6-ex1",
          "title": "Extended Starred Unpacking Type Inspection",
          "type": "scenario-mcq",
          "tier": "standard",
          "points": 10,
          "contextScenario": "Time-Series Data Ingestion",
          "prompt": "In the assignment: timestamp, *sensor_readings, status = (1730000000, 24.5, 25.0, 24.8, \"HEALTHY\"), what is the type and value of sensor_readings?",
          "options": [
            {
              "id": "opt-1",
              "text": "Type list with value [24.5, 25.0, 24.8]",
              "explanation": "Correct! PEP 3132 specifies that starred rest targets always collect elements into a Python list.",
              "isCorrect": true
            },
            {
              "id": "opt-2",
              "text": "Type tuple with value (24.5, 25.0, 24.8)",
              "explanation": "Incorrect. Starred expressions in unpacking always produce a list, not a tuple.",
              "isCorrect": false
            },
            {
              "id": "opt-3",
              "text": "A generator expression yielding sensor values.",
              "explanation": "Incorrect. Unpacking eagerly resolves values into a concrete list.",
              "isCorrect": false
            },
            {
              "id": "opt-4",
              "text": "A float with the average of the readings.",
              "explanation": "Incorrect. Starred unpacking collects the raw elements into a list container.",
              "isCorrect": false
            }
          ],
          "hints": [
            "Starred variables always collect unassigned items.",
            "The collected container type is always list.",
            "It preserves the order of intermediate elements."
          ]
        },
        {
          "id": "d6-s6-ex2",
          "title": "Write Code: Telemetry Packet Destructuring",
          "type": "write-code",
          "tier": "challenge",
          "points": 20,
          "contextScenario": "IoT Sensor Telemetry Gateway",
          "prompt": "Write a function summarize_packet(packet) that receives a tuple (device_id, *readings, checksum). It should unpack the components, compute the average of readings (or 0.0 if empty), and return a 3-tuple: (device_id, avg_reading, checksum).",
          "starterCode": "def summarize_packet(packet):\n    # Unpack device_id, *readings, checksum\n    # Return (device_id, average, checksum)\n    pass",
          "solutionCode": "def summarize_packet(packet):\n    device_id, *readings, checksum = packet\n    avg = sum(readings) / len(readings) if readings else 0.0\n    return (device_id, round(avg, 2), checksum)",
          "testCases": [
            {
              "id": "tc1",
              "label": "Multiple readings",
              "setup": "p = (\"DEV-01\", 10.0, 20.0, 30.0, \"0xAF\")",
              "expected": "('DEV-01', 20.0, '0xAF')", "hidden": false
            },
            {
              "id": "tc2",
              "label": "Single reading",
              "setup": "p = (\"DEV-02\", 50.0, \"0x00\")",
              "expected": "('DEV-02', 50.0, '0x00')", "hidden": false
            }
          ],
          "hints": [
            "Use device_id, *readings, checksum = packet.",
            "Calculate average as sum(readings) / len(readings).",
            "Return (device_id, round(avg, 2), checksum)."
          ]
        },
        {
          "id": "d6-s6-ex3",
          "title": "Project: High-Throughput Packet Header Destructuring Engine",
          "type": "write-code",
          "tier": "project",
          "points": 25,
          "contextScenario": "Fintech WebSocket Gateway, Lagos",
          "prompt": "Write a function process_network_packet(packet) that receives a variable-length tuple: (protocol_ver, client_id, *payload_chunks, checksum). It should unpack the components, combine the payload_chunks into a single joined string separated by \"|\", and return a dictionary with keys: \"version\", \"client\", \"payload\", and \"valid_checksum\" (True if checksum starts with \"0x\").",
          "starterCode": "def process_network_packet(packet):\n    # Unpack using starred rest and return structured telemetry dict\n    pass",
          "solutionCode": "def process_network_packet(packet):\n    ver, client, *payload, checksum = packet\n    return {\n        \"version\": ver,\n        \"client\": client,\n        \"payload\": \"|\".join(str(p) for p in payload),\n        \"valid_checksum\": str(checksum).startswith(\"0x\")\n    }",
          "testCases": [
            {
              "id": "tc1",
              "label": "Multi-chunk payload",
              "setup": "pkt = (\"v2\", \"CLI-901\", \"AUTH\", \"SESSION_OK\", \"TIER_1\", \"0xFA12\")",
              "expected": "{'version': 'v2', 'client': 'CLI-901', 'payload': 'AUTH|SESSION_OK|TIER_1', 'valid_checksum': True}", "hidden": false
            },
            {
              "id": "tc2",
              "label": "Invalid checksum",
              "setup": "pkt = (\"v1\", \"CLI-100\", \"PING\", \"ERR_SUM\")",
              "expected": "{'version': 'v1', 'client': 'CLI-100', 'payload': 'PING', 'valid_checksum': False}", "hidden": false
            }
          ],
          "hints": [
            "Use ver, client, *payload, checksum = packet.",
            "Join payload elements with \"|\".join(str(p) for p in payload).",
            "Check if checksum starts with \"0x\"."
          ]
        }
      ]
    },
    {
      "id": "day6-sub7",
      "number": 7,
      "title": "Tuple Packing & Idiomatic Multiple Function Returns",
      "summary": "Leverage implicit tuple packing for atomic variable swapping (a, b = b, a) and returning multiple values from functions.",
      "estimatedMinutes": 6,
      "introduce": {
        "headline": "Implicit Packing: Commas Power Multi-Value Operations",
        "paragraphs": [
          "Whenever you list multiple comma-separated values without enclosing brackets, Python automatically packs them into a tuple: coordinates = 6.5244, 3.3792 creates a 2-tuple.",
          "Atomic Variable Swapping: In other languages, swapping two variables requires a temporary third variable (temp = a; a = b; b = temp). In Python, a, b = b, a performs an atomic swap without any temporary variables! CPython packs the right-hand values into an anonymous tuple on the evaluation stack, and then unpacks into the left-hand targets.",
          "Returning Multiple Values: When a function executes return min_val, max_val, avg_val, Python does not actually return multiple separate items—it packs them into a single 3-tuple! The calling code can then immediately unpack the returned tuple.",
          "This dual packing/unpacking mechanism enables clean, expressive, and bug-free multi-value communication."
        ],
        "keyTerms": [
          {
            "term": "Tuple Packing",
            "definition": "The automatic grouping of comma-separated expressions into a single tuple object."
          },
          {
            "term": "Atomic Swap",
            "definition": "Swapping variables via a, b = b, a using the evaluation stack without a temp variable."
          },
          {
            "term": "Multi-Value Return",
            "definition": "Returning comma-separated values from a function, which implicitly returns a packed tuple."
          }
        ],
        "bulletPoints": [
          "t = 1, 2, 3 implicitly packs values into (1, 2, 3).",
          "a, b = b, a atomically swaps variables without temporary variables.",
          "return x, y, z returns a single 3-tuple (x, y, z).",
          "The caller can capture the packed tuple or unpack immediately: x, y, z = func()."
        ]
      },
      "visualise": {
        "type": "tuple-unpacking-lab",
        "title": "Atomic Variable Swapping Studio",
        "badge": "simulation",
        "description": "Inspect stack evaluation and simultaneous variable assignment during swapping.",
        "initialConfig": {
          "preset": "var-swap"
        }
      },
      "code": [
        {
          "title": "Tuple Packing and Returning Multiple Values",
          "runMode": "real",
          "code": "# 1. Implicit tuple packing\npoint = 10, 20, 30\nprint(\"Packed point:\", point, \"Type:\", type(point))\n\n# 2. Atomic variable swapping\ncurrency_a = \"USD\"\ncurrency_b = \"NGN\"\nprint(f\"Before swap: a={currency_a}, b={currency_b}\")\n\ncurrency_a, currency_b = currency_b, currency_a\nprint(f\"After swap:  a={currency_a}, b={currency_b}\")\n\n# 3. Returning multiple values from a function\ndef calculate_salary_breakdown(gross_pay):\n    pension = gross_pay * 0.08\n    tax = gross_pay * 0.15\n    net_pay = gross_pay - (pension + tax)\n    return pension, tax, net_pay\n\n# Capturing as a packed tuple\nbreakdown = calculate_salary_breakdown(1000000)\nprint(\"Packed return:  \", breakdown)\n\n# Unpacking immediately\npen, nhf, net = calculate_salary_breakdown(1000000)\nprint(f\"Unpacked: Pension=₦{pen:,.0f}, Tax=₦{nhf:,.0f}, Net=₦{net:,.0f}\")",
          "expectedOutput": "Packed point: (10, 20, 30) Type: <class 'tuple'>\nBefore swap: a=USD, b=NGN\nAfter swap:  a=NGN, b=USD\nPacked return:   (80000.0, 150000.0, 770000.0)\nUnpacked: Pension=₦80,000, Tax=₦150,000, Net=₦770,000"
        }
      ],
      "explain": [
        {
          "step": 1,
          "codeLine": 2,
          "instruction": "point = 10, 20, 30",
          "internalEffect": "CPython bytecode BUILD_TUPLE packs 3 elements from the stack into (10, 20, 30)."
        },
        {
          "step": 2,
          "codeLine": 10,
          "instruction": "currency_a, currency_b = currency_b, currency_a",
          "internalEffect": "Pushes old values to the evaluation stack, then reassigns atomically via ROT_TWO / UNPACK_SEQUENCE."
        },
        {
          "step": 3,
          "codeLine": 18,
          "instruction": "return pension, tax, net_pay",
          "internalEffect": "Returns a single 3-tuple containing pension, tax, and net_pay references."
        }
      ],
      "apply": {
        "domain": "Banking & Payroll Engineering",
        "contextTitle": "Multi-Value Payroll Breakdown Calculation",
        "scenario": "Computing comprehensive salary deductions (pension, PAYE tax, net salary) and returning them as an atomic tuple."
      },
      "commonMistakes": [
        {
          "label": "Assuming return a, b Returns Multiple Separate Variables",
          "explanation": "Python functions always return exactly one object. When multiple comma-separated items are listed, that object is a single tuple.",
          "erroneousCode": "def get_pt(): return 1, 2\nres = get_pt()\nprint(type(res))  # <class 'tuple'>, NOT 2 values!",
          "correctedCode": "x, y = get_pt()  # Unpack explicitly into individual variables"
        }
      ],
      "sourceNotes": "Derived from Asabeneh's 30 Days of Python: Day 6 Tuples (Tuple Packing and Unpacking).",
      "practise": [
        {
          "id": "d6-s7-ex1",
          "title": "Explain the Trace: Atomic Variable Swapping",
          "type": "explain-the-trace",
          "tier": "standard",
          "points": 15,
          "contextScenario": "Virtual Machine Evaluation Stack",
          "prompt": "Explain what happens internally in CPython when the statement a, b = b, a executes.",
          "traceStepCode": "a = \"primary\"\nb = \"secondary\"\na, b = b, a",
          "traceQuestion": "How does CPython perform this swap without overwriting a before b is assigned, and without requiring a named temporary variable in Python code?",
          "modelAnswer": "CPython evaluates the right-hand side first, pushing the values of b and a onto the evaluation stack as an anonymous 2-tuple. It then executes bytecode instructions (like ROT_TWO or UNPACK_SEQUENCE) to pop values into the target variables a and b simultaneously. Because all right-hand values are read before any assignment occurs, no user-space temporary variable is required.",
          "markingCriteria": [
            {
              "id": "c1",
              "label": "Mentions right-hand side is evaluated before assignment begins",
              "points": 5
            },
            {
              "id": "c2",
              "label": "Mentions values are pushed to the evaluation stack / packed as an anonymous tuple",
              "points": 5
            },
            {
              "id": "c3",
              "label": "Explains simultaneous unpacking prevents variable overwriting",
              "points": 5
            }
          ],
          "hints": [
            "Think about evaluation order: right-hand side vs left-hand side.",
            "The Python Virtual Machine uses an internal evaluation stack.",
            "Values are retrieved before targets are bound."
          ]
        },
        {
          "id": "d6-s7-ex2",
          "title": "Fill Gaps: Multiple Function Return Values",
          "type": "fill-the-gaps",
          "tier": "foundation",
          "points": 10,
          "contextScenario": "E-Commerce Cart Summary Engine",
          "prompt": "Complete the function to calculate subtotal and tax, returning them as a packed tuple, and unpack them into distinct variables.",
          "gaps": [
            {
              "id": "g1",
              "beforeText": "def calc_totals(items):\n    sub = sum(items)\n    tax = sub * 0.075\n    return ",
              "afterText": ", tax",
              "correctAnswer": "sub",
              "options": [
                "sub",
                "items",
                "total",
                "None"
              ]
            },
            {
              "id": "g2",
              "beforeText": "subtotal, tax_amt = ",
              "afterText": "([1000, 2000, 3000])",
              "correctAnswer": "calc_totals",
              "options": [
                "calc_totals",
                "sum",
                "tuple",
                "list"
              ]
            }
          ],
          "hints": [
            "In Python, return x, y packs x and y into a single 2-tuple.",
            "Call the function to retrieve and unpack the values."
          ]
        }
      ]
    },
    {
      "id": "day6-sub8",
      "number": 8,
      "title": "Hashability, Dictionary Keys & The Hash Invariant",
      "summary": "Understand hashability rules and employ immutable tuples as composite dictionary keys and set members.",
      "estimatedMinutes": 8,
      "introduce": {
        "headline": "Composite Keys: Tuples Enable Multi-Dimensional Lookups",
        "paragraphs": [
          "In Python dictionaries and sets, keys must be hashable. An object is hashable if it possesses a hash code that never changes during its lifetime (implemented via __hash__()) and can be compared to other objects (via __eq__()).",
          "Lists are mutable and therefore UNHASHABLE: attempting to use a list as a dictionary key or set element raises TypeError: unhashable type: 'list'.",
          "Tuples to the Rescue: Because tuples are immutable, a tuple IS hashable—provided that every element inside the tuple is also hashable! For example, hash((1, 2, \"abc\")) produces a 64-bit integer hash code.",
          "The Hash Rule: If a tuple contains even ONE mutable element (such as a list), the entire tuple immediately becomes UNHASHABLE, and attempting to hash it raises TypeError: unhashable type: 'list'.",
          "Composite Keys: Tuples are the standard way in Python to create multi-field dictionary keys, such as grid coordinates (x, y), date-currency pairs (date, currency), or user-permission pairs (user_id, resource)."
        ],
        "keyTerms": [
          {
            "term": "Hashable",
            "definition": "An object with an immutable hash value and equality comparison, eligible as a dict key or set member."
          },
          {
            "term": "Composite Key",
            "definition": "A multi-part key formed by a tuple (e.g. (lat, lon)) allowing multi-dimensional hash map lookup."
          },
          {
            "term": "TypeError: unhashable",
            "definition": "Exception raised when attempting to hash a mutable container or a tuple containing one."
          }
        ],
        "bulletPoints": [
          "Lists are mutable and cannot be used as dictionary keys.",
          "Tuples containing only immutable objects are hashable and valid as dictionary keys.",
          "If a tuple contains a nested list, it is unhashable and raises TypeError.",
          "Composite tuple keys enable multi-dimensional O(1) hash table lookups."
        ]
      },
      "visualise": {
        "type": "tuple-immutability-trap",
        "title": "Tuple Hashability & Dictionary Key Inspector",
        "badge": "simulation",
        "description": "Test hash() calculations on pure tuples vs tuples containing mutable lists.",
        "initialConfig": {
          "testHash": true
        }
      },
      "code": [
        {
          "title": "Using Tuples as Composite Dictionary Keys",
          "runMode": "real",
          "code": "# 1. Why lists fail as dictionary keys\ntry:\n    bad_dict = {[10, 20]: \"Value\"}\nexcept TypeError as err:\n    print(\"List key rejected:\", err)\n\n# 2. Pure tuples work perfectly as composite keys!\ngrid_terrain = {\n    (0, 0): \"Lagos Port Terminal\",\n    (0, 1): \"Marina Financial District\",\n    (1, 0): \"Victoria Island Hub\",\n    (1, 1): \"Lekki Tech Corridor\",\n}\n\ncoord = (1, 1)\nprint(f\"Terrain at {coord}: {grid_terrain[coord]}\")\n\n# 3. Currency cross-rate matrix using tuple keys\nfx_rates = {\n    (\"USD\", \"NGN\"): 1550.00,\n    (\"GBP\", \"NGN\"): 1980.50,\n    (\"EUR\", \"NGN\"): 1680.25,\n}\n\npair = (\"USD\", \"NGN\")\nprint(f\"FX Rate {pair[0]}/{pair[1]}: ₦{fx_rates[pair]}\")\n\n# 4. Hash inspection\npure_tuple = (\"NGN\", 2026, True)\nprint(\"Hash of pure tuple:\", hash(pure_tuple))\n\n# Unhashable tuple containing a list:\nmixed_tuple = (\"NGN\", [1, 2])\ntry:\n    hash(mixed_tuple)\nexcept TypeError as err:\n    print(\"Mixed tuple rejected:\", err)",
          "expectedOutput": "List key rejected: unhashable type: 'list'\nTerrain at (1, 1): Lekki Tech Corridor\nFX Rate USD/NGN: ₦1550.0\nHash of pure tuple: 140735512345678\nMixed tuple rejected: unhashable type: 'list'"
        }
      ],
      "explain": [
        {
          "step": 1,
          "codeLine": 3,
          "instruction": "bad_dict = {[10, 20]: \"Value\"}",
          "internalEffect": "CPython checks PyObject_Hash([10, 20]). Because list lacks __hash__, it raises TypeError."
        },
        {
          "step": 2,
          "codeLine": 8,
          "instruction": "grid_terrain = {(0, 0): ...}",
          "internalEffect": "Hashes the (0, 0) tuple using tuplehash algorithm; stores value in dictionary hash table bucket."
        },
        {
          "step": 3,
          "codeLine": 31,
          "instruction": "hash(mixed_tuple)",
          "internalEffect": "Tuplehash traverses items. When inspecting list [1, 2], it aborts with TypeError: unhashable type: list."
        }
      ],
      "apply": {
        "domain": "Fintech Multi-Tenant Security",
        "contextTitle": "Multi-Tenant Permission Cache Lookup",
        "scenario": "Caching multi-tenant customer permissions in a Nigerian neo-banking backend using (tenant_id, user_id) composite tuple keys for O(1) authorization lookups."
      },
      "commonMistakes": [
        {
          "label": "Using a Tuple Containing a Mutable List as a Dictionary Key",
          "explanation": "Even though the outer container is a tuple, having any nested mutable collection makes the entire tuple unhashable.",
          "erroneousCode": "key = (\"user_1\", [\"admin\", \"super\"])\ncache = {key: True}  # TypeError: unhashable type: 'list'",
          "correctedCode": "key = (\"user_1\", (\"admin\", \"super\"))\ncache = {key: True}  # Valid! All items immutable."
        }
      ],
      "sourceNotes": "Derived from Asabeneh's 30 Days of Python: Day 6 Tuples (Hashability & Immutability Guarantees).",
      "practise": [
        {
          "id": "d6-s8-ex1",
          "title": "Theory Reasoning: Composite Dictionary Key Hashability",
          "type": "theory-reasoning",
          "tier": "challenge",
          "points": 15,
          "contextScenario": "High-Performance Cache Architecture",
          "prompt": "Why does key_a = (10, \"Lagos\", (1, 2)) work as a dictionary key, while key_b = (10, \"Lagos\", [1, 2]) raises TypeError: unhashable type: \"list\"?",
          "options": [
            {
              "id": "opt-1",
              "text": "A tuple is only hashable if all of its constituent elements are also hashable; key_b contains a mutable list which has no __hash__ implementation.",
              "explanation": "Correct! The tuplehash algorithm computes hash codes recursively across all elements. If any child element is unhashable, the entire tuple is rejected with TypeError.",
              "isCorrect": true
            },
            {
              "id": "opt-2",
              "text": "Tuples cannot exceed 2 elements when used as dictionary keys.",
              "explanation": "Incorrect. Tuples of arbitrary length can be dictionary keys as long as all elements are hashable.",
              "isCorrect": false
            },
            {
              "id": "opt-3",
              "text": "Lists can be dictionary keys only if they contain integers.",
              "explanation": "Incorrect. Lists can never be dictionary keys in Python under any circumstances.",
              "isCorrect": false
            },
            {
              "id": "opt-4",
              "text": "key_b contains too many data types to compute a hash.",
              "explanation": "Incorrect. Heterogeneous tuples are fully supported; mutability is the sole determining factor.",
              "isCorrect": false
            }
          ],
          "hints": [
            "Hash table keys require an immutable hash value that never changes.",
            "Can a list change its contents after creation?",
            "If an inner list mutates, what would happen to its hash lookup bucket?"
          ]
        },
        {
          "id": "d6-s8-ex2",
          "title": "Write Code: Multi-Dimensional Grid Coordinate Lookup",
          "type": "write-code",
          "tier": "challenge",
          "points": 20,
          "contextScenario": "Geospatial Grid Routing Engine",
          "prompt": "Write a function lookup_location(grid_dict, row, col) that takes a dictionary keyed by (row, col) tuples and returns the location name, or \"UNKNOWN_SECTOR\" if the coordinate is not found.",
          "starterCode": "def lookup_location(grid_dict, row, col):\n    # Look up (row, col) in grid_dict\n    pass",
          "solutionCode": "def lookup_location(grid_dict, row, col):\n    return grid_dict.get((row, col), \"UNKNOWN_SECTOR\")",
          "testCases": [
            {
              "id": "tc1",
              "label": "Existing coordinate",
              "setup": "g = {(0, 0): \"HQ\", (1, 2): \"Depot\"}",
              "expected": "Depot",
              "hidden": false
            },
            {
              "id": "tc2",
              "label": "Missing coordinate",
              "setup": "g = {(0, 0): \"HQ\", (1, 2): \"Depot\"}",
              "expected": "UNKNOWN_SECTOR",
              "hidden": false
            }
          ],
          "hints": [
            "Use the tuple (row, col) as the key.",
            "Use the dictionary .get(key, default) method for safe fallback."
          ]
        }
      ]
    },
    {
      "id": "day6-sub9",
      "number": 9,
      "title": "Tuple Methods (count, index) & CPython Memory Footprint",
      "summary": "Master the minimal 2-method API of tuples (count, index), measure sys.getsizeof(), and understand small-tuple memory freelists.",
      "estimatedMinutes": 7,
      "introduce": {
        "headline": "Minimal Surface Area: High Speed and Low Memory Overhead",
        "paragraphs": [
          "Because tuples are immutable, they do not possess mutating methods like append, extend, pop, or sort. In fact, Python tuples have exactly TWO built-in methods: count() and index().",
          "t.count(value) returns the number of times value appears in the tuple (0 if absent) in linear O(N) time.",
          "t.index(value[, start[, stop]]) returns the zero-based index of the first occurrence of value. Crucial Watch-out: If value is not found, index() raises ValueError: tuple.index(x): x not in tuple! Always guard with value in t before calling index().",
          "Memory Efficiency: Because tuples cannot grow or shrink, CPython allocates zero extra buffer space (no over-allocation slack). sys.getsizeof(tuple) is smaller than sys.getsizeof(list) for the identical number of elements. Furthermore, CPython optimizes performance by caching deallocated small tuples (up to 20 items) in an internal freelist, avoiding expensive kernel malloc() syscalls."
        ],
        "keyTerms": [
          {
            "term": "count(x)",
            "definition": "Returns the frequency of occurrence of element x within the tuple."
          },
          {
            "term": "index(x)",
            "definition": "Returns the first index of element x; raises ValueError if x is not found."
          },
          {
            "term": "sys.getsizeof()",
            "definition": "Python standard library function returning memory consumption of an object in bytes."
          },
          {
            "term": "CPython Freelist",
            "definition": "Internal memory cache of deallocated small tuple objects reused to eliminate allocation overhead."
          }
        ],
        "bulletPoints": [
          "Tuples have only two methods: count() and index().",
          "t.count(x) counts occurrences in O(N) time without raising exceptions.",
          "t.index(x) returns the first matching index; raises ValueError if absent.",
          "Use x in t to verify presence before calling t.index(x).",
          "Tuples consume less memory than lists and avoid over-allocation slack."
        ]
      },
      "visualise": {
        "type": "tuple-list-memory-inspector",
        "title": "Memory Footprint & Freelist Inspector",
        "badge": "simulation",
        "description": "Compare sys.getsizeof() between lists and tuples as element counts scale.",
        "initialConfig": {
          "mode": "methods-memory"
        }
      },
      "code": [
        {
          "title": "Tuple Methods and Memory Comparison",
          "runMode": "real",
          "code": "import sys\n\n# 1. The two tuple methods: count() and index()\naudit_events = (\"LOGIN\", \"VIEW\", \"TRANSFER\", \"LOGIN\", \"LOGOUT\", \"LOGIN\")\n\nlogin_count = audit_events.count(\"LOGIN\")\nview_count = audit_events.count(\"VIEW\")\nmissing_count = audit_events.count(\"DELETE\")\n\nprint(\"LOGIN count:  \", login_count)\nprint(\"VIEW count:   \", view_count)\nprint(\"DELETE count: \", missing_count)\n\n# index() method with defensive guard\ntarget = \"TRANSFER\"\nif target in audit_events:\n    idx = audit_events.index(target)\n    print(f\"First '{target}' at index: {idx}\")\n\n# 2. Memory Footprint: Tuple vs List\nsample_items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\ntuple_version = tuple(sample_items)\nlist_version = list(sample_items)\n\ntuple_bytes = sys.getsizeof(tuple_version)\nlist_bytes = sys.getsizeof(list_version)\n\nprint(f\"Tuple memory (10 items): {tuple_bytes} bytes\")\nprint(f\"List memory  (10 items): {list_bytes} bytes\")\nprint(f\"List overhead: +{list_bytes - tuple_bytes} bytes ({(list_bytes/tuple_bytes - 1)*100:.1f}% larger)\")",
          "expectedOutput": "LOGIN count:   3\nVIEW count:    1\nDELETE count:  0\nFirst 'TRANSFER' at index: 2\nTuple memory (10 items): 120 bytes\nList memory  (10 items): 136 bytes\nList overhead: +16 bytes (13.3% larger)"
        }
      ],
      "explain": [
        {
          "step": 1,
          "codeLine": 6,
          "instruction": "login_count = audit_events.count(\"LOGIN\")",
          "internalEffect": "Linearly scans the 6 pointers in O(N) time and increments a counter for matches."
        },
        {
          "step": 2,
          "codeLine": 16,
          "instruction": "idx = audit_events.index(target)",
          "internalEffect": "Scans until the first matching pointer is found and returns its offset (2)."
        },
        {
          "step": 3,
          "codeLine": 24,
          "instruction": "tuple_bytes = sys.getsizeof(tuple_version)",
          "internalEffect": "Returns exact struct size: 48 base bytes + (10 * 8 bytes) = 120 bytes with 0 slack slots."
        }
      ],
      "apply": {
        "domain": "High-Throughput Web Networking",
        "contextTitle": "Immutable Protocol Header Specification",
        "scenario": "Storing immutable HTTP status code definitions in high-frequency web middleware to prevent memory bloat and accidental mutation."
      },
      "commonMistakes": [
        {
          "label": "Calling index() on an Element Absent from the Tuple",
          "explanation": "index() raises ValueError on absence rather than returning -1 like str.find(). Always guard with the in operator.",
          "erroneousCode": "t = (\"A\", \"B\", \"C\")\nidx = t.index(\"Z\")  # ValueError: tuple.index(x): x not in tuple",
          "correctedCode": "if \"Z\" in t:\n    idx = t.index(\"Z\")\nelse:\n    idx = -1"
        }
      ],
      "sourceNotes": "Derived from Asabeneh's 30 Days of Python: Day 6 Tuples (Tuple Methods, Deleting Tuples, Memory Overview).",
      "practise": [
        {
          "id": "d6-s9-ex1",
          "title": "Predict Output: count() and index() on Tuples",
          "type": "predict-output",
          "tier": "foundation",
          "points": 10,
          "contextScenario": "Audit Log Event Frequency",
          "prompt": "What will be printed when running this code using the only two tuple methods: count() and index()?",
          "options": [
            {
              "id": "opt-1",
              "text": "Count: 3 | Index: 1",
              "explanation": "Correct! \"OK\" appears 3 times (indices 0, 2, 4), and the first occurrence of \"ERR\" is at index 1.",
              "isCorrect": true
            },
            {
              "id": "opt-2",
              "text": "Count: 2 | Index: 3",
              "explanation": "Incorrect. \"OK\" appears 3 times, not 2.",
              "isCorrect": false
            },
            {
              "id": "opt-3",
              "text": "Count: 3 | Index: 3",
              "explanation": "Incorrect. index() returns the FIRST occurrence of the search value (index 1).",
              "isCorrect": false
            },
            {
              "id": "opt-4",
              "text": "ValueError: tuple.index(x) not found",
              "explanation": "Incorrect. \"ERR\" is present at index 1.",
              "isCorrect": false
            }
          ],
          "starterCode": "statuses = (\"OK\", \"ERR\", \"OK\", \"ERR\", \"OK\")\nprint(f\"Count: {statuses.count('OK')} | Index: {statuses.index('ERR')}\")",
          "hints": [
            "count(x) counts all occurrences of x.",
            "index(x) returns the first index where x appears."
          ]
        },
        {
          "id": "d6-s9-ex2",
          "title": "Fix the Bug: Guarding index() with Membership in Operator",
          "type": "fix-the-bug",
          "tier": "standard",
          "points": 15,
          "contextScenario": "Currency Code Validation",
          "prompt": "The function find_currency_rank crashes with ValueError when an unsupported currency is searched. Fix the code using the in operator to return -1 if the currency is absent.",
          "starterCode": "def find_currency_rank(supported_currencies, query):\n    # Bug: index() crashes with ValueError if query is not found!\n    return supported_currencies.index(query)",
          "solutionCode": "def find_currency_rank(supported_currencies, query):\n    if query in supported_currencies:\n        return supported_currencies.index(query)\n    return -1",
          "testCases": [
            {
              "id": "tc1",
              "label": "Supported currency",
              "setup": "c = (\"NGN\", \"USD\", \"GBP\", \"EUR\")",
              "expected": "1", "hidden": false
            },
            {
              "id": "tc2",
              "label": "Unsupported currency",
              "setup": "c = (\"NGN\", \"USD\", \"GBP\", \"EUR\")",
              "expected": "-1", "hidden": false
            }
          ],
          "hints": [
            "Use if query in supported_currencies: before calling .index().",
            "Return -1 if absent."
          ]
        }
      ]
    }
  ],
  "realWorldLabs": [
    {
      "id": "day6-lab1",
      "title": "Geospatial GPS Coordinate Polygon & Perimeter Engine",
      "description": "Process an immutable sequence of GPS latitude/longitude/elevation waypoint tuples, validate boundaries, calculate total path distance using the Euclidean approximation, and extract bounding coordinates using sequence unpacking.",
      "domain": "Geospatial Information Systems (GIS) & Logistics",
      "starterCode": "# Real-World Lab 1: Geospatial GPS Waypoint & Spatial Boundary Engine\nimport math\n\n# Immutable sequence of Nigerian delivery drone waypoints: (waypoint_name, lat, lon, altitude_m)\nflight_path = (\n    (\"Lagos_Depot\", 6.5244, 3.3792, 15.0),\n    (\"Victoria_Island_Hub\", 6.4281, 3.4219, 25.0),\n    (\"Lekki_Phase1_Drop\", 6.4474, 3.4723, 20.0),\n    (\"Ajah_Relay_Station\", 6.4698, 3.5852, 30.0),\n)\n\nprint(f\"Total Waypoints: {len(flight_path)}\")\n\n# 1. Unpack first and last waypoints for route summary\norigin_name, *middle_waypoints, dest_name = [wp[0] for wp in flight_path]\nprint(f\"Flight Route: {origin_name} -> {dest_name} (via {len(middle_waypoints)} relay hubs)\")\n\n# 2. Calculate approximate total 2D ground distance in km (1 deg lat ~= 111 km, 1 deg lon ~= 111 km * cos(lat))\ntotal_distance_km = 0.0\nfor i in range(len(flight_path) - 1):\n    wp1 = flight_path[i]\n    wp2 = flight_path[i + 1]\n    \n    # Destructure waypoints\n    name1, lat1, lon1, alt1 = wp1\n    name2, lat2, lon2, alt2 = wp2\n    \n    dlat = (lat2 - lat1) * 111.0\n    dlon = (lon2 - lon1) * 111.0 * math.cos(math.radians((lat1 + lat2) / 2))\n    leg_km = math.sqrt(dlat**2 + dlon**2)\n    total_distance_km += leg_km\n    print(f\"  Leg {i+1}: {name1} -> {name2} = {leg_km:.2f} km\")\n\nprint(f\"Total Path Distance: {total_distance_km:.2f} km\")\n\n# 3. Compute Bounding Box: (min_lat, max_lat, min_lon, max_lon)\nlats = tuple(wp[1] for wp in flight_path)\nlons = tuple(wp[2] for wp in flight_path)\nbounding_box = (min(lats), max(lats), min(lons), max(lons))\nprint(f\"Geofence Bounding Box (Lat/Lon): {bounding_box}\")",
      "targetOutput": "Total Waypoints: 4\nFlight Route: Lagos_Depot -> Ajah_Relay_Station (via 2 relay hubs)\n  Leg 1: Lagos_Depot -> Victoria_Island_Hub = 11.75 km\n  Leg 2: Victoria_Island_Hub -> Lekki_Phase1_Drop = 6.01 km\n  Leg 3: Lekki_Phase1_Drop -> Ajah_Relay_Station = 12.74 km\nTotal Path Distance: 30.50 km\nGeofence Bounding Box (Lat/Lon): (6.4281, 6.5244, 3.3792, 3.5852)"
    },
    {
      "id": "day6-lab2",
      "title": "Fintech Multi-Asset FX Matrix & Audited Settlement Pipeline",
      "description": "Construct a multi-currency foreign exchange cross-rate engine using composite tuple keys (base_curr, quote_curr), calculate settlement conversions, and record tamper-evident immutable audit log tuples.",
      "domain": "Fintech & Foreign Exchange Treasury",
      "starterCode": "# Real-World Lab 2: Fintech Multi-Asset FX Matrix & Audited Settlement Pipeline\n\n# 1. Composite Tuple Keys for FX Cross-Rate Matrix\nfx_rates = {\n    (\"USD\", \"NGN\"): 1550.00,\n    (\"GBP\", \"NGN\"): 1980.50,\n    (\"EUR\", \"NGN\"): 1680.25,\n    (\"USD\", \"GHS\"): 15.80,\n    (\"GBP\", \"USD\"): 1.28,\n}\n\n# 2. Immutable list of pending customer currency conversion requests\n# Each tuple: (request_id, customer_id, from_curr, to_curr, from_amount)\nrequests = (\n    (\"REQ-001\", \"CUST_901\", \"USD\", \"NGN\", 5000.0),\n    (\"REQ-002\", \"CUST_902\", \"GBP\", \"NGN\", 2500.0),\n    (\"REQ-003\", \"CUST_903\", \"EUR\", \"NGN\", 1200.0),\n    (\"REQ-004\", \"CUST_904\", \"USD\", \"GHS\", 1000.0),\n)\n\naudit_ledger = []\ntotal_ngn_settled = 0.0\n\nprint(\"=== FX TREASURY CONVERSION RUN ===\")\nfor req in requests:\n    # Unpack request tuple\n    req_id, cust_id, from_curr, to_curr, amount = req\n    \n    rate_key = (from_curr, to_curr)\n    if rate_key in fx_rates:\n        rate = fx_rates[rate_key]\n        settled_amt = amount * rate\n        if to_curr == \"NGN\":\n            total_ngn_settled += settled_amt\n        \n        # Create immutable settlement record tuple: (req_id, cust_id, rate, settled_amt, \"SETTLED\")\n        settlement_entry = (req_id, cust_id, rate, settled_amt, \"SETTLED\")\n        audit_ledger.append(settlement_entry)\n        print(f\"Processed {req_id}: {from_curr} {amount:,.2f} -> {to_curr} {settled_amt:,.2f} (Rate: {rate:,.2f})\")\n    else:\n        print(f\"Skipped {req_id}: No FX pair for {rate_key}\")\n\n# Freeze audit ledger into immutable tuple of tuples\nfinal_ledger = tuple(audit_ledger)\nprint(f\"Total Certified Settlements: {len(final_ledger)} records\")\nprint(f\"Total NGN Liquidity Settled: ₦{total_ngn_settled:,.2f}\")",
      "targetOutput": "=== FX TREASURY CONVERSION RUN ===\nProcessed REQ-001: USD 5,000.00 -> NGN 7,750,000.00 (Rate: 1,550.00)\nProcessed REQ-002: GBP 2,500.00 -> NGN 4,951,250.00 (Rate: 1,980.50)\nProcessed REQ-003: EUR 1,200.00 -> NGN 2,016,300.00 (Rate: 1,680.25)\nProcessed REQ-004: USD 1,000.00 -> GHS 15,800.00 (Rate: 15.80)\nTotal Certified Settlements: 4 records\nTotal NGN Liquidity Settled: ₦14,717,550.00"
    }
  ],
  "miniProject": {
    "id": "day6-project",
    "title": "High-Frequency Order Book & Telemetry Snapshot Processor",
    "brief": "Build an enterprise trading order book and telemetry snapshot processing engine that consumes raw streaming depth updates, isolates top-of-book levels and depth queues using sequence unpacking with starred expressions, enforces defensive immutability, and stores composite lookups for fast O(1) queries.",
    "requirements": [
      "Define immutable order book level entries as 3-tuples (price_kobo, volume_lots, order_count).",
      "Implement sequence unpacking with starred expressions to cleanly extract best_bid, *bid_depth, and worst_bid.",
      "Construct composite tuple keys (symbol, snapshot_hour) to index historical depth snapshots in an O(1) lookup dictionary.",
      "Implement the Convert-Mutate-Freeze pattern to apply cancel/replace modifications safely without corrupting historical snapshots.",
      "Validate strict hashability invariants and compute the aggregate top-of-book bid-ask spread in kobo."
    ],
    "rubric": [
      {
        "criterion": "Data Structure Integrity & Defensive Immutability",
        "weight": 35
      },
      {
        "criterion": "Sequence Unpacking & Starred Invariant Handling",
        "weight": 40
      },
      {
        "criterion": "Telemetry Processing & Error Handling",
        "weight": 25
      }
    ],
    "starterCode": "# Day 6 Capstone Mini-Project: High-Frequency Order Book & Telemetry Snapshot Processor\n\n# Raw Level-2 Order Book Snapshots for NGX Dual-Listed Equity (e.g. SEPLAT)\n# Bids: sorted high to low. Asks: sorted low to high.\nraw_bids = [\n    (345000, 15000, 42),  # 3,450.00 NGN, 15,000 lots, 42 orders (Top of Book)\n    (344900, 22000, 18),\n    (344800, 31000, 25),\n    (344500, 50000, 60),\n    (344000, 80000, 110), # Deepest bid\n]\n\nraw_asks = [\n    (345200, 12000, 35),  # 3,452.00 NGN (Top of Book)\n    (345300, 18000, 15),\n    (345500, 25000, 29),\n    (346000, 45000, 72),\n]\n\n# Requirement 1: Freeze depth into immutable tuples\nbids_snapshot = tuple(raw_bids)\nasks_snapshot = tuple(raw_asks)\n\n# Requirement 2: Unpack top-of-book and depth queues using starred expressions\nbest_bid, *bid_depth, worst_bid = bids_snapshot\nbest_ask, *ask_depth, worst_ask = asks_snapshot\n\nbid_price, bid_vol, _ = best_bid\nask_price, ask_vol, _ = best_ask\n\nspread_kobo = ask_price - bid_price\nspread_naira = spread_kobo / 100\n\nprint(\"=== ORDER BOOK SNAPSHOT TELEMETRY ===\")\nprint(f\"Top-of-Book Bid: ₦{bid_price/100:,.2f} ({bid_vol:,} lots)\")\nprint(f\"Top-of-Book Ask: ₦{ask_price/100:,.2f} ({ask_vol:,} lots)\")\nprint(f\"Bid-Ask Spread:  ₦{spread_naira:.2f} ({spread_kobo} kobo)\")\nprint(f\"Bid Depth Queue: {len(bid_depth)} intermediate levels\")\nprint(f\"Ask Depth Queue: {len(ask_depth)} intermediate levels\")\n\n# Requirement 3: Composite Tuple Key Dictionary for Hourly Cache\nsnapshot_cache = {\n    (\"SEPLAT\", 14): (best_bid, best_ask, spread_kobo),\n}\n\ncache_key = (\"SEPLAT\", 14)\nprint(f\"Hourly Cache Lookup for {cache_key}:\")\ncached_bid, cached_ask, cached_spread = snapshot_cache[cache_key]\nprint(f\"  Cached Best Bid: ₦{cached_bid[0]/100:,.2f} | Spread: {cached_spread} kobo\")\n\n# Requirement 4: Convert-Mutate-Freeze for order cancellation at top of book\ntemp_bids = list(bids_snapshot)\n# Simulate cancellation of 5,000 lots from best bid\nupdated_best_bid = (best_bid[0], best_bid[1] - 5000, best_bid[2] - 1)\ntemp_bids[0] = updated_best_bid\nrevised_bids = tuple(temp_bids)\n\nprint(\"\\nAfter Order Cancellation (Convert-Mutate-Freeze):\")\nprint(f\"Original Top Bid Volume: {bids_snapshot[0][1]:,} lots\")\nprint(f\"Revised Top Bid Volume:  {revised_bids[0][1]:,} lots (Integrity Preserved)\")"
  },
  "dayQuiz": {
    "title": "Day 6 Mastery Assessment Quiz: Tuples, Immutability & Memory Footprint",
    "passingScorePercentage": 80,
    "questions": [
      {
        "id": "d6-q1",
        "scenario": "Single-Element Tuple Literal Syntax in Python",
        "question": "What is the data type of the variable item after executing item = (\"Nigeria\")?",
        "options": [
          {
            "id": "q1-a",
            "text": "str — because without a comma, parentheses only denote mathematical/expression grouping.",
            "explanation": "Correct! Commas construct tuples in Python. (\"Nigeria\") is evaluated as the string literal \"Nigeria\". To create a tuple, you must write (\"Nigeria\",).",
            "isCorrect": true
          },
          {
            "id": "q1-b",
            "text": "tuple — because any value enclosed in round parentheses is a tuple.",
            "explanation": "Incorrect. Round parentheses alone without a comma denote grouping. Parentheses only create a tuple when empty () or when items are comma-separated.",
            "isCorrect": false
          },
          {
            "id": "q1-c",
            "text": "SyntaxError — single items cannot be placed in parentheses.",
            "explanation": "Incorrect. Placing a string in parentheses is valid Python expression syntax.",
            "isCorrect": false
          },
          {
            "id": "q1-d",
            "text": "list — single-element sequences default to lists.",
            "explanation": "Incorrect. Lists require square brackets [].",
            "isCorrect": false
          }
        ],
        "points": 10
      },
      {
        "id": "d6-q2",
        "scenario": "Negative Indexing on Fixed Contiguous Tuples",
        "question": "For a tuple t = (\"A\", \"B\", \"C\", \"D\"), what does t[-len(t)] evaluate to?",
        "options": [
          {
            "id": "q2-a",
            "text": "\"A\" — because negative indices count backward from -1 (last) down to -len(t) (first element).",
            "explanation": "Correct! t[-4] resolves to t[len(t) + (-4)] = t[0], which is the first element \"A\".",
            "isCorrect": true
          },
          {
            "id": "q2-b",
            "text": "\"D\" — negative indices count from left to right.",
            "explanation": "Incorrect. t[-1] is \"D\", while t[-len(t)] is the first element.",
            "isCorrect": false
          },
          {
            "id": "q2-c",
            "text": "IndexError: tuple index out of range.",
            "explanation": "Incorrect. -len(t) is the exact lower bound of valid negative indices.",
            "isCorrect": false
          },
          {
            "id": "q2-d",
            "text": "None — negative indexing wraps around to None.",
            "explanation": "Incorrect. Python does not return None on indexing.",
            "isCorrect": false
          }
        ],
        "points": 10
      },
      {
        "id": "d6-q3",
        "scenario": "Tuple Slicing Return Type and Boundary Clamping",
        "question": "Given t = (10, 20, 30), what is produced by t[1:100]?",
        "options": [
          {
            "id": "q3-a",
            "text": "(20, 30) — slicing a tuple always returns a tuple, and out-of-bounds stop indices clamp safely.",
            "explanation": "Correct! Slicing never raises IndexError and preserves the container type. The stop boundary 100 is clamped to len(t) = 3.",
            "isCorrect": true
          },
          {
            "id": "q3-b",
            "text": "[20, 30] — slicing returns a mutable list.",
            "explanation": "Incorrect. Sequence slicing always returns an instance of the same type as the original container.",
            "isCorrect": false
          },
          {
            "id": "q3-c",
            "text": "IndexError: tuple index out of range.",
            "explanation": "Incorrect. Direct indexing raises IndexError, but slicing clamps gracefully.",
            "isCorrect": false
          },
          {
            "id": "q3-d",
            "text": "() — an empty tuple because 100 exceeds the sequence length.",
            "explanation": "Incorrect. Python returns all available elements up to the clamped boundary.",
            "isCorrect": false
          }
        ],
        "points": 10
      },
      {
        "id": "d6-q4",
        "scenario": "Direct Tuple Item Assignment Rejection",
        "question": "What exception is raised when executing coordinates = (6.52, 3.37); coordinates[0] = 7.00?",
        "options": [
          {
            "id": "q4-a",
            "text": "TypeError: 'tuple' object does not support item assignment",
            "explanation": "Correct! Tuples are strictly immutable and do not implement __setitem__. Any direct index reassignment raises TypeError.",
            "isCorrect": true
          },
          {
            "id": "q4-b",
            "text": "AttributeError: 'tuple' object has no attribute 'set'",
            "explanation": "Incorrect. Python raises TypeError for subscript assignment on immutable containers.",
            "isCorrect": false
          },
          {
            "id": "q4-c",
            "text": "ValueError: assignment to constant sequence",
            "explanation": "Incorrect. The exception raised is TypeError.",
            "isCorrect": false
          },
          {
            "id": "q4-d",
            "text": "None — the assignment silently succeeds.",
            "explanation": "Incorrect. Python never silently ignores invalid assignments.",
            "isCorrect": false
          }
        ],
        "points": 10
      },
      {
        "id": "d6-q5",
        "scenario": "Nested Mutable Object Inside a Tuple",
        "question": "If t = (1, [2, 3]), what happens after executing t[1].append(4)?",
        "options": [
          {
            "id": "q5-a",
            "text": "The list is modified to [2, 3, 4], and t becomes (1, [2, 3, 4]).",
            "explanation": "Correct! The tuple holds a pointer to the list object. Appending to the list modifies the list buffer in-place without altering the pointer address stored in the tuple.",
            "isCorrect": true
          },
          {
            "id": "q5-b",
            "text": "TypeError: cannot append to a list inside an immutable tuple.",
            "explanation": "Incorrect. Tuples enforce shallow immutability; they do not freeze referenced mutable heap objects.",
            "isCorrect": false
          },
          {
            "id": "q5-c",
            "text": "The tuple is cloned into a new tuple object at a new memory address.",
            "explanation": "Incorrect. The tuple container retains its exact same memory address id(t).",
            "isCorrect": false
          },
          {
            "id": "q5-d",
            "text": "The list [2, 3] is replaced by a tuple (2, 3, 4).",
            "explanation": "Incorrect. The nested list remains a list.",
            "isCorrect": false
          }
        ],
        "points": 10
      },
      {
        "id": "d6-q6",
        "scenario": "The Augmented Assignment Paradox on a Tuple Subscript",
        "question": "When t = (1, [2, 3]) and you execute t[1] += [4], what is the result?",
        "options": [
          {
            "id": "q6-a",
            "text": "The list becomes [2, 3, 4], AND a TypeError is raised.",
            "explanation": "Correct! In CPython, += evaluates INPLACE_ADD (which mutates the list) followed by STORE_SUBSCR (which tries to reassign t[1]). The tuple raises TypeError AFTER the list has already mutated!",
            "isCorrect": true
          },
          {
            "id": "q6-b",
            "text": "The operation completes cleanly with no error.",
            "explanation": "Incorrect. Because t is a tuple, assigning back to t[1] raises TypeError.",
            "isCorrect": false
          },
          {
            "id": "q6-c",
            "text": "A TypeError is raised, and the list remains [2, 3] (transactionally rolled back).",
            "explanation": "Incorrect. Python does not provide transactional rollback for in-place operations.",
            "isCorrect": false
          },
          {
            "id": "q6-d",
            "text": "A SyntaxError is caught before execution.",
            "explanation": "Incorrect. The syntax is valid; the failure occurs at runtime.",
            "isCorrect": false
          }
        ],
        "points": 10
      },
      {
        "id": "d6-q7",
        "scenario": "Extended Starred Sequence Unpacking (PEP 3132)",
        "question": "Given values = (10, 20, 30, 40, 50), what is assigned to rest in first, *rest, last = values?",
        "options": [
          {
            "id": "q7-a",
            "text": "[20, 30, 40] — a Python list containing the intermediate items.",
            "explanation": "Correct! PEP 3132 extended unpacking always gathers residual elements into a standard Python list, even when unpacking from a tuple.",
            "isCorrect": true
          },
          {
            "id": "q7-b",
            "text": "(20, 30, 40) — a Python tuple containing the intermediate items.",
            "explanation": "Incorrect. Starred rest targets are always assigned as lists.",
            "isCorrect": false
          },
          {
            "id": "q7-c",
            "text": "[20, 30, 40, 50] — including the last item.",
            "explanation": "Incorrect. The variable last receives 50; rest only receives unassigned middle items.",
            "isCorrect": false
          },
          {
            "id": "q7-d",
            "text": "A generator yielding 20, 30, 40.",
            "explanation": "Incorrect. It is a concrete list.",
            "isCorrect": false
          }
        ],
        "points": 10
      },
      {
        "id": "d6-q8",
        "scenario": "Atomic Variable Swapping Mechanics",
        "question": "Why does a, b = b, a successfully swap variables without requiring a third temporary variable in Python code?",
        "options": [
          {
            "id": "q8-a",
            "text": "The right-hand side (b, a) is evaluated first and pushed to the evaluation stack as a tuple before unpacking into a and b.",
            "explanation": "Correct! Evaluation of the right-hand expressions completes before any assignment to the left-hand targets begins, guaranteeing that no values are overwritten prematurely.",
            "isCorrect": true
          },
          {
            "id": "q8-b",
            "text": "Python detects variable names and delays assigning a until b has completed.",
            "explanation": "Incorrect. The mechanism is a standard consequence of expression evaluation order and tuple packing/unpacking.",
            "isCorrect": false
          },
          {
            "id": "q8-c",
            "text": "Python variables are references to hardware registers.",
            "explanation": "Incorrect. Python variables are name bindings in namespaces.",
            "isCorrect": false
          },
          {
            "id": "q8-d",
            "text": "Variable swapping only works for immutable types like strings and numbers.",
            "explanation": "Incorrect. Atomic swapping works identically for any Python object regardless of type or mutability.",
            "isCorrect": false
          }
        ],
        "points": 10
      },
      {
        "id": "d6-q9",
        "scenario": "Hashability Conditions for Tuples as Dictionary Keys",
        "question": "Under what condition is a tuple eligible to be used as a dictionary key or set member in Python?",
        "options": [
          {
            "id": "q9-a",
            "text": "Every constituent element inside the tuple must also be hashable (immutable).",
            "explanation": "Correct! A tuple computes its hash by hashing each element. If a tuple contains even one unhashable element (such as a list), hash(t) raises TypeError: unhashable type: 'list'.",
            "isCorrect": true
          },
          {
            "id": "q9-b",
            "text": "All tuples are automatically hashable regardless of their contents.",
            "explanation": "Incorrect. A tuple containing a mutable object like a list is unhashable.",
            "isCorrect": false
          },
          {
            "id": "q9-c",
            "text": "The tuple must contain at most two elements.",
            "explanation": "Incorrect. Tuples of any length can be hashed as long as all elements are hashable.",
            "isCorrect": false
          },
          {
            "id": "q9-d",
            "text": "Tuples can only be dictionary keys if all elements are strings.",
            "explanation": "Incorrect. Integers, floats, booleans, frozensets, and nested immutable tuples are all hashable.",
            "isCorrect": false
          }
        ],
        "points": 10
      },
      {
        "id": "d6-q10",
        "scenario": "CPython Memory Overhead: PyTupleObject vs PyListObject",
        "question": "Why does sys.getsizeof(tuple) consume less memory than sys.getsizeof(list) for the identical number of elements in CPython?",
        "options": [
          {
            "id": "q10-a",
            "text": "Tuples have a smaller base C struct (48 vs 56 bytes) and allocate zero over-allocation slack buffer slots.",
            "explanation": "Correct! Because tuples are immutable, CPython allocates exactly the required number of pointer slots. Lists over-allocate buffer slots to achieve amortized O(1) appends.",
            "isCorrect": true
          },
          {
            "id": "q10-b",
            "text": "Tuples compress their elements using gzip in memory.",
            "explanation": "Incorrect. Tuples store raw 64-bit pointers just like lists; they are not compressed.",
            "isCorrect": false
          },
          {
            "id": "q10-c",
            "text": "Lists store 128-bit pointers while tuples store 64-bit pointers.",
            "explanation": "Incorrect. Both containers store standard 64-bit PyObject* pointers on 64-bit systems.",
            "isCorrect": false
          },
          {
            "id": "q10-d",
            "text": "Tuples store objects by value rather than by reference.",
            "explanation": "Incorrect. Everything in Python is stored and passed by reference.",
            "isCorrect": false
          }
        ],
        "points": 10
      }
    ]
  },
  "cheatSheet": [],
  "sourceNotes": [
    "Source attribution: Asabeneh Yetayeh's '30 Days of Python' (Day 6 - Tuples).",
    "Covers tuple creation, comma rule, indexing, slicing, immutability, sequence unpacking, starred expressions, packing, hashability, and memory efficiency."
  ]
};
