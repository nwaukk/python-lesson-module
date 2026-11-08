import { DayModule } from '../../engine/lesson/types';

export const DAY_8_MODULE: DayModule = {
  schemaVersion: 1,
  number: 8,
  title: "Dictionaries",
  level: "beginner",
  sourceUrl: "https://github.com/Asabeneh/30-Days-Of-Python/tree/master/08_Day_Dictionaries",
  estimatedMinutes: 80,
  prerequisites: [1, 2, 3, 4, 5, 6, 7],
  objectives: [
    "Master dictionary literals {key: value}, the dict() constructor, and empty dict syntax {}",
    "Understand key hashability invariants and diagnose why mutable types trigger TypeError: unhashable type",
    "Explore CPython 3.6+ compact dict architecture (dk_indices & dk_entries) and insertion order guarantees",
    "Safely retrieve values distinguishing direct subscripting d[k] (KeyError) from defensive d.get(k, default)",
    "Perform in-place key mutation, value overwriting, and conditional default initialization with setdefault()",
    "Safely evict keys using strict del / pop(k) vs defensive pop(k, default), LIFO popitem(), and clear()",
    "Merge and update mappings using .update(), dictionary unpacking (**), and Python 3.9+ merge operators (| and |=)",
    "Inspect dynamic view objects (.keys(), .values(), .items()) and leverage set-like operations on dict_keys",
    "Model complex real-world hierarchical JSON structures and navigate nested multi-level dictionaries",
    "Construct and invert mappings concisely using dictionary comprehensions and key-value filtering expressions"
  ],
  subtopics: [
    {
      id: "day8-sub1",
      number: 1,
      title: "Dictionary Literals, Key-Value Architecture & Hashability Invariants",
      summary: "Understand dictionaries as associative key-value mappings, master literal syntax, and recognize why dictionary keys must be hashable and immutable.",
      estimatedMinutes: 8,
      introduce: {
        headline: "Associative Mappings: Keys, Values & Hash Invariants",
        paragraphs: [
          "A dictionary in Python (`dict`) is a mutable, associative collection of key-value pairs. While lists and tuples index elements using consecutive integers (0, 1, 2...), dictionaries allow you to index data using meaningful, arbitrary keys such as strings, integers, or tuples.",
          "Populated dictionaries are written with curly braces containing colon-separated pairs: `user = {'name': 'Amina', 'role': 'Admin', 'active': True}`. An empty dictionary is constructed using `{}` or the built-in constructor `dict()`.",
          "The Key Hashability Rule: Every dictionary key MUST be hashable and immutable across its entire lifetime (e.g. strings, integers, floats, booleans, tuples, frozensets). If you attempt to use a mutable container like a list, dictionary, or set as a key, Python immediately raises `TypeError: unhashable type: 'list'`.",
          "Values have zero restrictions: values can be of any data type, mutable or immutable, homogeneous or heterogeneous, including nested lists and sub-dictionaries."
        ],
        keyTerms: [
          {
            term: "Dictionary (dict)",
            definition: "An associative hash map mapping unique, hashable keys to arbitrary values."
          },
          {
            term: "Key-Value Pair",
            definition: "A single associative entry consisting of an immutable lookup key and its associated value object."
          },
          {
            term: "Key Hashability Invariant",
            definition: "The fundamental rule that dictionary keys must be immutable objects with fixed hash codes."
          },
          {
            term: "dict() Constructor",
            definition: "Built-in constructor that builds dictionaries from keyword arguments or key-value sequence pairs."
          }
        ],
        bulletPoints: [
          "Dictionary syntax uses curly braces with colons: d = {key: value}.",
          "Empty dictionaries are created with {} or dict().",
          "Keys must be immutable and hashable (str, int, float, tuple); lists and dicts are forbidden as keys.",
          "Values can be any Python object, including duplicate and deeply nested mutable structures."
        ]
      },
      visualise: {
        type: "compact-dict-memory-inspector",
        title: "Compact Dict Memory Inspector",
        badge: "simulation",
        description: "Inspect the split architecture of CPython dictionaries and see how keys map to values.",
        initialConfig: {
          mode: "literals"
        }
      },
      code: [
        {
          title: "Creating Dictionaries & Enforcing Key Hashability",
          runMode: "real",
          code: "# 1. Constructing dictionaries with literals and dict()\nempty_record = {}\naccount = {\n    \"account_number\": \"0123456789\",\n    \"bank\": \"Access Bank Lagos\",\n    \"balance\": 150000.75,\n    \"is_active\": True,\n}\nprint(\"Account dictionary:\", account)\nprint(\"Length (key count):\", len(account))\n\n# 2. Using dict() constructor with keyword arguments & pair sequences\nconfig = dict(host=\"127.0.0.1\", port=8000, timeout=30)\ncurrency_pairs = dict([(\"USD\", 1550.0), (\"GBP\", 1980.5), (\"EUR\", 1680.2)])\nprint(\"Config from kwargs:\", config)\nprint(\"FX from pairs:     \", currency_pairs)\n\n# 3. Valid composite immutable keys (tuples)\ncoordinates_map = {(6.5244, 3.3792): \"Lagos Central Hub\"}\nprint(\"Tuple key lookup:  \", coordinates_map[(6.5244, 3.3792)])\n\n# 4. Hashability violation: lists cannot be keys!\ntry:\n    invalid_dict = {[\"role\", \"level\"]: \"Admin\"}\nexcept TypeError as err:\n    print(\"Rejected mutable list key:\", err)",
          expectedOutput: "Account dictionary: {'account_number': '0123456789', 'bank': 'Access Bank Lagos', 'balance': 150000.75, 'is_active': True}\nLength (key count): 4\nConfig from kwargs: {'host': '127.0.0.1', 'port': 8000, 'timeout': 30}\nFX from pairs:      {'USD': 1550.0, 'GBP': 1980.5, 'EUR': 1680.2}\nTuple key lookup:   Lagos Central Hub\nRejected mutable list key: unhashable type: 'list'"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: "account = { \"account_number\": ... }",
          internalEffect: "Allocates a PyDictObject in CPython heap, computing 64-bit hashes for string keys and writing pointers to values."
        },
        {
          step: 2,
          codeLine: 12,
          instruction: "currency_pairs = dict([(\"USD\", 1550.0), ...])",
          internalEffect: "Iterates through 2-tuples, extracting first element as key and second as value into new dictionary."
        },
        {
          step: 3,
          codeLine: 17,
          instruction: "coordinates_map = {(6.5244, 3.3792): ...}",
          internalEffect: "Tuples containing immutable floats are hashable; computes tuple hash and stores successfully."
        },
        {
          step: 4,
          codeLine: 22,
          instruction: "invalid_dict = {[\"role\", \"level\"]: ...}",
          internalEffect: "Evaluates hash(['role', 'level']); list raises TypeError: unhashable type: 'list' before dictionary allocation."
        }
      ],
      apply: {
        domain: "Fintech & Core Banking Ledger",
        contextTitle: "Customer Account Profile State Storage",
        scenario: "Storing structured customer bank account metadata, KYC verification flags, and currency balances for Lagos digital banking gateways."
      },
      commonMistakes: [
        {
          label: "Using a Mutable List as a Dictionary Key",
          explanation: "Dictionary keys must remain constant so their hash code never changes. Lists are mutable and unhashable, raising TypeError.",
          erroneousCode: "routes = {}\nroutes[[\"Lagos\", \"Abuja\"]] = 45.0  # TypeError: unhashable type: 'list'!",
          correctedCode: "routes = {}\nroutes[(\"Lagos\", \"Abuja\")] = 45.0  # Use an immutable tuple instead"
        }
      ],
      practise: [
        {
          id: "d8-s1-ex1",
          title: "Hashability Violation: Mutable List as Dict Key",
          type: "scenario-mcq",
          tier: "foundation",
          points: 10,
          contextScenario: "Pan-African Cross-Border Remittance Switch",
          prompt: "A fintech backend engineer attempts to cache foreign exchange rates using currency pair lists: `fx_rates = {}; pair = ['NGN', 'GHS']; fx_rates[pair] = 0.0094`. What happens at runtime, and what is the idiomatic architectural fix?",
          options: [
            {
              id: "s1-opt1",
              text: "Raises TypeError: unhashable type: 'list'. Fix: Use an immutable tuple ('NGN', 'GHS') as the dictionary key.",
              explanation: "Correct! Python dict keys must implement __hash__ and be immutable across their lifetime. Lists are mutable and unhashable. Using a tuple ('NGN', 'GHS') is the standard Pythonic pattern.",
              isCorrect: true
            },
            {
              id: "s1-opt2",
              text: "Python automatically coerces the list to a string key \"['NGN', 'GHS']\" and stores it without error.",
              explanation: "Incorrect. Python is strongly typed and never performs implicit container-to-string type coercion for dictionary keys.",
              isCorrect: false
            },
            {
              id: "s1-opt3",
              text: "Raises KeyError: ['NGN', 'GHS'] because the key does not already exist in the mapping.",
              explanation: "Incorrect. Assigning to a non-existent key creates it; KeyError only occurs during retrieval subscripting d[k]. The error here is TypeError.",
              isCorrect: false
            },
            {
              id: "s1-opt4",
              text: "The assignment succeeds, but subsequent mutations with pair.append('KES') silently delete the entry.",
              explanation: "Incorrect. Python prevents this at assignment time by raising TypeError: unhashable type: 'list'.",
              isCorrect: false
            }
          ],
          hints: [
            "Recall Python's key hashability requirement: only objects with fixed, immutable hash values can be keys.",
            "Lists are mutable and do not implement __hash__, raising a fatal TypeError when passed as keys.",
            "Tuples containing immutable items (like strings) are hashable and ideal for composite keys."
          ]
        },
        {
          id: "d8-s1-ex2",
          title: "Dict Constructor and Composite Tuple Coordinates",
          type: "fill-the-gaps",
          tier: "standard",
          points: 15,
          contextScenario: "Nairobi Logistics Waypoint Registry",
          prompt: "Fill in the missing tokens to construct a dictionary from 2-tuples using the built-in constructor, and register a delivery hub keyed by an immutable GPS coordinate tuple.",
          starterCode: "# 1. Construct hub dictionary from sequence of pairs\nhubs = ___1___([('Mombasa', 'MBA-01'), ('Kisumu', 'KSM-02')])\n\n# 2. Register hub with composite GPS coordinate tuple\nhubs[___2___] = 'Jomo Kenyatta International Cargo'\n\n# 3. Retrieve using coordinate key\nhub_name = hubs[___3___]",
          solutionCode: "hubs = dict([('Mombasa', 'MBA-01'), ('Kisumu', 'KSM-02')])\nhubs[(-1.3192, 36.9278)] = 'Jomo Kenyatta International Cargo'\nhub_name = hubs[(-1.3192, 36.9278)]",
          testCases: [
            {
              id: "tc1",
              label: "Constructor creates valid dict",
              setup: "hubs = dict([('Mombasa', 'MBA-01'), ('Kisumu', 'KSM-02')]); assert len(hubs) == 2",
              expected: "True",
              hidden: false
            },
            {
              id: "tc2",
              label: "Tuple key stores and retrieves correctly",
              setup: "hubs = {(-1.3192, 36.9278): 'JKIA Cargo'}; assert hubs[(-1.3192, 36.9278)] == 'JKIA Cargo'",
              expected: "True",
              hidden: false
            }
          ],
          hints: [
            "Use the built-in constructor 'dict' to convert a list of (key, value) pairs into a dictionary.",
            "Enclose the latitude and longitude in parentheses (-1.3192, 36.9278) to form an immutable tuple key.",
            "Subscript with the exact same coordinate tuple to retrieve the hub name."
          ]
        }
      ]
    },
    {
      id: "day8-sub2",
      number: 2,
      title: "CPython 3.6+ Compact Dict Architecture & Insertion Order Preservation",
      summary: "Understand the split-table memory layout (dk_indices & dk_entries), 25% memory reduction, and how insertion order became a language guarantee in Python 3.7+.",
      estimatedMinutes: 9,
      introduce: {
        headline: "The Split-Table Revolution: dk_indices & Dense dk_entries",
        paragraphs: [
          "Historically (Python 3.5 and earlier), dictionaries stored a sparse array where every single bucket slot held an 8-byte hash, an 8-byte key pointer, and an 8-byte value pointer (24 bytes per slot). Because hash tables require a 2/3 maximum load factor to prevent collisions, over 60% of these large 24-byte slots sat empty, wasting vast amounts of memory.",
          "In Python 3.6 (designed by Raymond Hettinger) and made an official language specification in Python 3.7 (PEP 468), CPython completely redesigned dictionaries into a compact, split-table architecture.",
          "How it works: A small, sparse array called `dk_indices` stores simple 1-byte integer offsets (e.g. `[-1, 0, -1, 1, 2]`). The actual data is appended into a dense, contiguous array called `dk_entries` storing `(hash, key, value)` in exact chronological order.",
          "Two Major Benefits: First, it reduces dictionary memory consumption by 20% to 25%! Second, because entries are appended to `dk_entries` sequentially, dictionaries in Python 3.7+ are GUARANTEED to preserve insertion order during iteration, unpacking, and serialization!"
        ],
        keyTerms: [
          {
            term: "Compact Dict (PEP 468)",
            definition: "The modern CPython split-table architecture separating sparse bucket indices from dense ordered entries."
          },
          {
            term: "dk_indices",
            definition: "The small sparse hash table array storing integer offsets into the dense entries table."
          },
          {
            term: "dk_entries",
            definition: "The dense contiguous array storing (hash, key, value) tuples in chronological insertion order."
          },
          {
            term: "Insertion Order Guarantee",
            definition: "The language guarantee in Python 3.7+ that iterating over a dict yields keys in the exact order they were inserted."
          }
        ],
        bulletPoints: [
          "Python 3.7+ dictionaries are guaranteed to maintain insertion order.",
          "Compact dict layout: dk_indices (sparse 8-bit table) + dk_entries (dense ordered array).",
          "Overwriting a key updates the value in-place without resetting its insertion order position.",
          "Saves 20% to 25% memory compared to legacy sparse dictionary implementations."
        ]
      },
      visualise: {
        type: "compact-dict-memory-inspector",
        title: "CPython Split-Table Memory Architecture",
        badge: "simulation",
        description: "Inspect the interaction between dk_indices sparse offsets and dense dk_entries chronological rows.",
        initialConfig: {
          mode: "compact-architecture"
        }
      },
      code: [
        {
          title: "Demonstrating Guaranteed Insertion Order & Key Overwrites",
          runMode: "real",
          code: "# 1. Insertion order is preserved exactly as inserted\naudit_log = {}\naudit_log[\"step_1\"] = \"AUTH_SUCCESS\"\naudit_log[\"step_2\"] = \"OTP_VERIFIED\"\naudit_log[\"step_3\"] = \"TOKEN_ISSUED\"\naudit_log[\"step_4\"] = \"SESSION_OPENED\"\n\nprint(\"Chronological iteration order:\")\nfor step, status in audit_log.items():\n    print(f\"  {step} -> {status}\")\n\n# 2. Overwriting a key modifies the value in place\n# Crucial Invariant: Overwriting does NOT move the key to the end!\naudit_log[\"step_2\"] = \"BIOMETRIC_VERIFIED\"\nprint(\"\\nAfter overwriting step_2 (Position preserved):\")\nprint(\"Keys list:\", list(audit_log.keys()))\nprint(\"step_2 value:\", audit_log[\"step_2\"])",
          expectedOutput: "Chronological iteration order:\n  step_1 -> AUTH_SUCCESS\n  step_2 -> OTP_VERIFIED\n  step_3 -> TOKEN_ISSUED\n  step_4 -> SESSION_OPENED\n\nAfter overwriting step_2 (Position preserved):\nKeys list: ['step_1', 'step_2', 'step_3', 'step_4']\nstep_2 value: BIOMETRIC_VERIFIED"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: "audit_log[\"step_1\"] = \"AUTH_SUCCESS\"",
          internalEffect: "Computes hash('step_1') & 7, stores entry pointer #0 into dk_indices, appends record into dk_entries[0]."
        },
        {
          step: 2,
          codeLine: 4,
          instruction: "audit_log[\"step_2\"] = \"OTP_VERIFIED\"",
          internalEffect: "Appends into dk_entries[1]. Preserves exact insertion order in dense entries array."
        },
        {
          step: 3,
          codeLine: 14,
          instruction: "audit_log[\"step_2\"] = \"BIOMETRIC_VERIFIED\"",
          internalEffect: "Locates existing key at dk_entries[1], replaces value pointer in-place without moving row position."
        },
        {
          step: 4,
          codeLine: 16,
          instruction: "list(audit_log.keys())",
          internalEffect: "Iterates through dense dk_entries array from index 0 to len-1, yielding keys in original order."
        }
      ],
      apply: {
        domain: "Data Pipelines & Telemetry Logging",
        contextTitle: "Deterministic Audit Event Pipeline",
        scenario: "Constructing JSON audit logs where field ordering must be 100% deterministic and match business execution sequence for compliance audits."
      },
      commonMistakes: [
        {
          label: "Assuming Overwriting a Key Moves It to the End of the Dict",
          explanation: "In CPython's compact dict, overwriting `d[k] = new_v` modifies the value in its existing slot. The key remains at its original insertion index.",
          erroneousCode: "d = {'a': 1, 'b': 2}\nd['a'] = 99  # Does NOT move 'a' after 'b'!",
          correctedCode: "# If you need to move a key to the end, delete and reinsert it:\nval = d.pop('a')\nd['a'] = val  # Now 'a' is at the end"
        }
      ],
      practise: [
        {
          id: "d8-s2-ex1",
          title: "Compact Dict Memory Architecture & Sparse Indices",
          type: "theory-reasoning",
          tier: "foundation",
          points: 10,
          contextScenario: "Low-Latency FinTech Microservice Profiling",
          prompt: "Why did CPython 3.6+ split the internal dict implementation into a sparse `dk_indices` array of 1-byte integers and a dense `dk_entries` array of 24-byte entries, rather than a single sparse table?",
          options: [
            {
              id: "s2-opt1",
              text: "It replaces unused 24-byte empty slots with tiny 1-byte indices, saving 20-30% RAM while making iteration cache-friendly and linear.",
              explanation: "Correct! In the legacy dict, sparse unoccupied buckets wasted 24 bytes (hash + key_ptr + val_ptr) each. The compact design makes the sparse array tiny (bytes/ints) while packing actual entries densely, preserving insertion order as a natural byproduct.",
              isCorrect: true
            },
            {
              id: "s2-opt2",
              text: "It disables hash-collision resolution so key lookups become O(log N) rather than O(1).",
              explanation: "Incorrect. Compact dict maintains O(1) average lookup time using the same open-addressing perturbation algorithm.",
              isCorrect: false
            },
            {
              id: "s2-opt3",
              text: "It limits all Python dictionaries to a maximum capacity of 256 keys to prevent stack overflows.",
              explanation: "Incorrect. CPython dynamically resizes dk_indices to 2-byte (int16), 4-byte (int32), or 8-byte (int64) integers as dict size grows.",
              isCorrect: false
            },
            {
              id: "s2-opt4",
              text: "It moves all dictionary values to disk swap space to conserve virtual memory.",
              explanation: "Incorrect. All dictionary structures reside entirely in CPython heap memory.",
              isCorrect: false
            }
          ],
          hints: [
            "Consider the memory size difference between an empty 24-byte slot (hash + key + val) and a 1-byte integer index.",
            "Dense dk_entries stores entries in consecutive insertion sequence, allowing fast iteration without scanning empty buckets.",
            "This split architecture was pioneered by PyPy and adopted in CPython 3.6 by Raymond Hettinger."
          ]
        },
        {
          id: "d8-s2-ex2",
          title: "Predict Output: In-Place Mutation and Key Insertion Order",
          type: "predict-output",
          tier: "standard",
          points: 15,
          contextScenario: "Central Bank Audit Trail Event Sequence",
          prompt: "What is printed by this Python script? Notice which keys are overwritten and which new keys are appended.",
          starterCode: "audit = {'event': 'LOGIN', 'status': 'PENDING', 'user': 'kofi_mensah'}\naudit['event'] = 'KYC_VERIFIED'\naudit['timestamp'] = 1718000000\naudit['status'] = 'APPROVED'\nprint(list(audit.keys()))",
          solutionCode: "['event', 'status', 'user', 'timestamp']",
          testCases: [
            {
              id: "tc1",
              label: "Audit log keys preserve insertion order",
              setup: "audit = {'event': 'LOGIN', 'status': 'PENDING', 'user': 'kofi_mensah'}; audit['event'] = 'KYC_VERIFIED'; audit['timestamp'] = 1718000000; audit['status'] = 'APPROVED'; res = list(audit.keys())",
              expected: "['event', 'status', 'user', 'timestamp']",
              hidden: false
            }
          ],
          hints: [
            "Overwriting an existing key (like 'event' or 'status') updates the value in-place without altering its slot in dk_entries.",
            "Newly inserted keys ('timestamp') are appended to the next free slot in dk_entries.",
            "The keys list will reflect the original insertion sequence with 'timestamp' at the end."
          ]
        }
      ]
    },
    {
      id: "day8-sub3",
      number: 3,
      title: "Key Access & Safe Retrieval: Subscripts vs .get() and KeyError Prevention",
      summary: "Compare direct subscript access d[k] with defensive retrieval via .get(k, default), and learn how to prevent unhandled KeyError crashes.",
      estimatedMinutes: 8,
      introduce: {
        headline: "Direct Subscripting vs Defensive Retrieval: The KeyError Trap",
        paragraphs: [
          "Python provides two primary ways to read values from a dictionary: direct subscript bracket notation (`d[key]`) and the `.get(key, default=None)` method.",
          "Direct Subscripting (`d[key]`): Looks up the key in the hash table and returns its value in O(1) time. However, if the key does NOT exist in the dictionary, direct subscripting immediately raises a `KeyError`!",
          "Defensive Retrieval (`d.get(key, default)`): Safely queries the dictionary. If the key exists, it returns the value. If the key is missing, it returns `default` (which defaults to `None`) instead of crashing!",
          "When to use which: Use `d[key]` when the key's presence is mandatory and missing keys indicate an illegal application state. Use `d.get(key, fallback)` for optional attributes, query parameters, or configurations."
        ],
        keyTerms: [
          {
            term: "KeyError",
            definition: "The built-in exception raised when attempting to access a non-existent dictionary key via bracket notation d[k]."
          },
          {
            term: "dict.get()",
            definition: "Defensive retrieval method that returns an optional fallback value instead of raising KeyError when a key is absent."
          },
          {
            term: "Membership Check (in)",
            definition: "The 'key in d' operator testing whether a key exists in the dictionary in O(1) time."
          },
          {
            term: "Default Value",
            definition: "The fallback object returned by .get(k, default) when k is missing (defaults to None)."
          }
        ],
        bulletPoints: [
          "d[k] raises KeyError if k is missing; always verify with 'if k in d:' or use .get().",
          "d.get(k, default) returns default (or None) when k is missing, never crashing.",
          "Testing 'k in d' checks KEYS only in O(1) time (not values).",
          "To test values, use 'v in d.values()' which runs in O(N) linear time."
        ]
      },
      visualise: {
        type: "dict-mutation-flow-sim",
        title: "Key Access & KeyError Prevention Flow",
        badge: "simulation",
        description: "Compare the execution paths of direct bracket access d[k] vs defensive .get(k, fallback).",
        initialConfig: {
          mode: "get_vs_bracket"
        }
      },
      code: [
        {
          title: "Direct Access vs Defensive Retrieval with .get()",
          runMode: "real",
          code: "user_session = {\n    \"user_id\": \"USR-9021\",\n    \"role\": \"MERCHANT\",\n    \"tier\": \"GOLD\",\n}\n\n# 1. Direct access on existing key\nprint(\"User Role:\", user_session[\"role\"])  # 'MERCHANT'\n\n# 2. Direct access on missing key: The KeyError Trap!\ntry:\n    location = user_session[\"city\"]\nexcept KeyError as err:\n    print(\"Direct access crashed with KeyError:\", err)\n\n# 3. Defensive retrieval with .get()\n# Returns None if default is omitted, or the specified fallback value\nphone = user_session.get(\"phone\")\nlimit = user_session.get(\"daily_limit_ngn\", 500000.0)\nprint(\"Phone (missing):\", phone)  # None\nprint(\"Limit (fallback):\", limit)  # 500000.0\n\n# 4. Membership testing with in operator (O(1) time)\nif \"tier\" in user_session:\n    print(f\"Account tier is {user_session['tier']}\")",
          expectedOutput: "User Role: MERCHANT\nDirect access crashed with KeyError: 'city'\nPhone (missing): None\nLimit (fallback): 500000.0\nAccount tier is GOLD"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 8,
          instruction: "user_session[\"role\"]",
          internalEffect: "Computes hash('role') & mask, jumps to bucket, verifies key pointer match, returns 'MERCHANT' in O(1)."
        },
        {
          step: 2,
          codeLine: 12,
          instruction: "location = user_session[\"city\"]",
          internalEffect: "Probes table, encounters empty slot (-1), raises PyExc_KeyError."
        },
        {
          step: 3,
          codeLine: 18,
          instruction: "limit = user_session.get(\"daily_limit_ngn\", 500000.0)",
          internalEffect: "Key absent in hash table; suppresses error and returns the fallback parameter 500000.0."
        },
        {
          step: 4,
          codeLine: 23,
          instruction: "if \"tier\" in user_session:",
          internalEffect: "Executes hash table probe for 'tier'; finding key, returns True in constant O(1) time."
        }
      ],
      apply: {
        domain: "Web Development & API Gateway Routing",
        contextTitle: "HTTP Request Header Parsing",
        scenario: "Extracting optional HTTP request headers (Authorization, User-Agent, X-Request-ID) safely without throwing 500 Internal Server Errors on missing headers."
      },
      commonMistakes: [
        {
          label: "Using d[k] on Optional Query Parameters",
          explanation: "Accessing optional keys directly with brackets causes unexpected production outages when clients omit non-mandatory fields. Use .get(k, default) instead.",
          erroneousCode: "def get_page(params):\n    page = params['page']  # Crashes with KeyError if user visits without ?page=!",
          correctedCode: "def get_page(params):\n    page = params.get('page', 1)  # Gracefully falls back to 1"
        }
      ],
      practise: [
        {
          id: "d8-s3-ex1",
          title: "Fix the Bug: Defensive Webhook Parameter Retrieval",
          type: "fix-the-bug",
          tier: "standard",
          points: 15,
          contextScenario: "Interswitch Payment Webhook Processor",
          prompt: "The checkout processor below crashes with `KeyError` when optional voucher codes or shipping fee overrides are missing from incoming customer payloads. Fix the function using `.get()` so optional fields fall back safely.",
          starterCode: "def process_checkout(payload):\n    # BUG: Direct subscripting crashes when optional keys are absent\n    discount = payload['discount_code']\n    shipping = payload['shipping_fee']\n    return {'discount': discount, 'shipping': shipping}",
          solutionCode: "def process_checkout(payload):\n    discount = payload.get('discount_code', None)\n    shipping = payload.get('shipping_fee', 0.0)\n    return {'discount': discount, 'shipping': shipping}",
          testCases: [
            {
              id: "tc1",
              label: "Handles payload missing optional discount and shipping",
              setup: "res = process_checkout({'order_id': 'TX-901', 'amount': 15000})",
              expected: "{'discount': None, 'shipping': 0.0}",
              hidden: false
            },
            {
              id: "tc2",
              label: "Respects explicitly provided optional fields",
              setup: "res = process_checkout({'order_id': 'TX-902', 'discount_code': 'PROMO10', 'shipping_fee': 1500.0})",
              expected: "{'discount': 'PROMO10', 'shipping': 1500.0}",
              hidden: false
            }
          ],
          hints: [
            "Replace direct square bracket indexing payload['discount_code'] with payload.get('discount_code', None).",
            "Replace payload['shipping_fee'] with payload.get('shipping_fee', 0.0) to provide a numerical zero fallback.",
            "Using .get() prevents KeyError crashes while returning valid defaults for missing keys."
          ]
        },
        {
          id: "d8-s3-ex2",
          title: "Complexity Trap: Key Membership vs Value Search",
          type: "scenario-mcq",
          tier: "challenge",
          points: 20,
          contextScenario: "High-Throughput FX Trading Engine Order Matching",
          prompt: "An order book contains 500,000 active trade records: `orders = {'ORD-1': 1500.0, 'ORD-2': 1800.0, ...}`. An engineer benchmarks two operations: `op_a = 'ORD-250000' in orders` versus `op_b = 1800.0 in orders.values()`. What are their respective time complexities?",
          options: [
            {
              id: "s3-opt1",
              text: "op_a is O(1) average time; op_b is O(N) linear time because values do not have a hash table index and require a sequential scan.",
              explanation: "Correct! Checking key membership (key in d) hashes the key and probes the hash table directly in constant O(1) time. In contrast, values() is an unindexed view, so (val in d.values()) must iterate through every entry sequentially in O(N) time.",
              isCorrect: true
            },
            {
              id: "s3-opt2",
              text: "Both op_a and op_b are O(1) constant time because CPython indexes both keys and values automatically.",
              explanation: "Incorrect. CPython only hashes and indexes keys. Values are arbitrary objects with no reverse index.",
              isCorrect: false
            },
            {
              id: "s3-opt3",
              text: "op_a is O(N) and op_b is O(1) because floats are faster to search than strings.",
              explanation: "Incorrect. Key lookups leverage the hash table (O(1)), while value lookups require a full linear scan (O(N)).",
              isCorrect: false
            },
            {
              id: "s3-opt4",
              text: "Both operations are O(log N) because dictionaries use self-balancing red-black binary search trees.",
              explanation: "Incorrect. Python dictionaries use open-addressing hash tables, not binary search trees.",
              isCorrect: false
            }
          ],
          hints: [
            "Recall how hash tables work: keys are hashed and mapped to table buckets in O(1) time.",
            "Does the dictionary build a reverse index for values? What must Python do to find a value?",
            "Linear scans across 500,000 items require inspecting up to 500,000 elements in the worst case (O(N))."
          ]
        }
      ]
    },
    {
      id: "day8-sub4",
      number: 4,
      title: "Dynamic Mutation: Inserting, Overwriting & .setdefault() Mechanics",
      summary: "Learn how to insert new pairs, update existing keys, and master .setdefault() for atomic grouping and missing key initialization.",
      estimatedMinutes: 8,
      introduce: {
        headline: "In-Place Mutation: Assignment, Overwrite Invariants & setdefault()",
        paragraphs: [
          "Dictionaries are mutable: you can add new key-value pairs or alter existing values dynamically at runtime using simple assignment: `d[key] = value`.",
          "Assignment Semantics: If `key` is absent from `d`, Python creates a new entry and appends it to the dictionary. If `key` is already present, Python overwrites the old value in-place without altering the key's position in the insertion order sequence.",
          "The .setdefault(key, default) Pattern: A powerful method that performs a dual role: (1) If `key` is present, it returns the existing value and leaves the dictionary untouched. (2) If `key` is missing, it inserts `key: default` into the dictionary and returns `default`.",
          "Grouping Patterns: `setdefault()` is the classic Python idiom for grouping items into lists: `groups.setdefault(category, []).append(item)`."
        ],
        keyTerms: [
          {
            term: "Key Assignment (d[k] = v)",
            definition: "Inserts a new key-value pair or overwrites the existing value associated with key k in-place."
          },
          {
            term: "dict.setdefault()",
            definition: "Retrieves the value for key if present; otherwise inserts key with specified default and returns default."
          },
          {
            term: "Grouping Idiom",
            definition: "Using d.setdefault(k, []).append(v) to group collections of items under categorical keys."
          },
          {
            term: "In-Place Mutation",
            definition: "Modifying the dictionary's internal memory structures directly without creating a new dictionary object."
          }
        ],
        bulletPoints: [
          "d[k] = v adds a new key or overwrites the existing value in-place.",
          "d.setdefault(k, default) sets key to default ONLY if k is absent.",
          "If k already exists, setdefault() does NOT overwrite the value.",
          "Classic pattern: d.setdefault(category, []).append(item) builds categorical lists cleanly."
        ]
      },
      visualise: {
        type: "dict-mutation-flow-sim",
        title: "Dynamic Mutation & setdefault() Simulator",
        badge: "simulation",
        description: "Watch how setdefault() conditionally initializes missing keys while preserving existing data.",
        initialConfig: {
          mode: "setdefault"
        }
      },
      code: [
        {
          title: "Inserting, Overwriting and Categorical Grouping with setdefault()",
          runMode: "real",
          code: "# 1. Inserting and overwriting key-value pairs\nmerchant = {\"name\": \"Lekki Electronics\", \"city\": \"Lagos\"}\n\n# Insert new key\nmerchant[\"rating\"] = 4.8\nmerchant[\"verified\"] = True\n\n# Overwrite existing key\nmerchant[\"city\"] = \"Victoria Island, Lagos\"\nprint(\"Updated Merchant:\", merchant)\n\n# 2. setdefault() on existing key: Does NOT overwrite!\nexisting_rating = merchant.setdefault(\"rating\", 1.0)\nprint(\"setdefault on rating (unchanged):\", existing_rating, \"->\", merchant[\"rating\"])\n\n# 3. setdefault() on missing key: Inserts default!\ncurrency = merchant.setdefault(\"currency\", \"NGN\")\nprint(\"setdefault on currency (inserted):\", currency, \"->\", merchant[\"currency\"])\n\n# 4. Categorical grouping idiom with setdefault()\ntransactions = [\n    (\"GROCERY\", 12000),\n    (\"UTILITIES\", 8500),\n    (\"GROCERY\", 4500),\n    (\"TECH\", 350000),\n    (\"UTILITIES\", 14000),\n]\n\ncategory_totals = {}\nfor cat, amount in transactions:\n    category_totals.setdefault(cat, []).append(amount)\n\nprint(\"\\nGrouped Transactions by Category:\")\nfor cat, amounts in category_totals.items():\n    print(f\"  {cat}: {amounts} (Sum: ₦{sum(amounts):,})\")",
          expectedOutput: "Updated Merchant: {'name': 'Lekki Electronics', 'city': 'Victoria Island, Lagos', 'rating': 4.8, 'verified': True}\nsetdefault on rating (unchanged): 4.8 -> 4.8\nsetdefault on currency (inserted): NGN -> NGN\n\nGrouped Transactions by Category:\n  GROCERY: [12000, 4500] (Sum: ₦16,500)\n  UTILITIES: [8500, 14000] (Sum: ₦22,500)\n  TECH: [350000] (Sum: ₦350,000)"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 5,
          instruction: "merchant[\"rating\"] = 4.8",
          internalEffect: "Finds slot in dk_indices, appends new row (hash, 'rating', 4.8) to dk_entries array."
        },
        {
          step: 2,
          codeLine: 9,
          instruction: "merchant[\"city\"] = \"Victoria Island, Lagos\"",
          internalEffect: "Finds existing entry index for 'city', updates pointer to new string object in-place."
        },
        {
          step: 3,
          codeLine: 13,
          instruction: "merchant.setdefault(\"rating\", 1.0)",
          internalEffect: "Key 'rating' exists; ignores 1.0 parameter and returns active value 4.8."
        },
        {
          step: 4,
          codeLine: 29,
          instruction: "category_totals.setdefault(cat, []).append(amount)",
          internalEffect: "Initializes empty list [] on first encounter of category; subsequent calls retrieve existing list and append."
        }
      ],
      apply: {
        domain: "E-Commerce & Financial Transaction Grouping",
        contextTitle: "Category Expense Breakdown Engine",
        scenario: "Aggregating raw debit card transaction feeds into categorical expense buckets for mobile personal finance management apps."
      },
      commonMistakes: [
        {
          label: "Assuming setdefault() Overwrites Existing Values",
          explanation: "Unlike d[k] = v, setdefault() only assigns the value if the key does NOT already exist. If the key is present, it returns the existing value.",
          erroneousCode: "d = {'status': 'PENDING'}\nd.setdefault('status', 'COMPLETED')  # Does NOT change 'status' to 'COMPLETED'!",
          correctedCode: "d['status'] = 'COMPLETED'  # Direct assignment reliably overwrites"
        }
      ],
      practise: [
        {
          id: "d8-s4-ex1",
          title: "Write Code: Categorical Grouping with setdefault()",
          type: "write-code",
          tier: "standard",
          points: 15,
          contextScenario: "Mobile Money P2P Transaction Categorizer",
          prompt: "Write a function `group_transactions_by_category(records)` that takes a list of `(category, amount)` tuples and returns a dictionary mapping each category string to a list of its amounts. Use `.setdefault()` to dynamically initialize missing category lists.",
          starterCode: "def group_transactions_by_category(records):\n    grouped = {}\n    # TODO: Group amounts using .setdefault()\n    return grouped",
          solutionCode: "def group_transactions_by_category(records):\n    grouped = {}\n    for cat, amount in records:\n        grouped.setdefault(cat, []).append(amount)\n    return grouped",
          testCases: [
            {
              id: "tc1",
              label: "Groups multiple transactions per category",
              setup: "txs = [('AIRTIME', 500), ('UTILITY', 2000), ('AIRTIME', 1000)]; res = group_transactions_by_category(txs)",
              expected: "{'AIRTIME': [500, 1000], 'UTILITY': [2000]}",
              hidden: false
            },
            {
              id: "tc2",
              label: "Handles empty transaction list",
              setup: "res = group_transactions_by_category([])",
              expected: "{}",
              hidden: false
            }
          ],
          hints: [
            "Iterate over each (cat, amount) tuple in records.",
            "Call grouped.setdefault(cat, []) to return either the existing list or create a fresh empty list.",
            "Chain .append(amount) directly to the returned list."
          ]
        },
        {
          id: "d8-s4-ex2",
          title: "Predict Output: setdefault() Non-Overwrite Invariant",
          type: "predict-output",
          tier: "foundation",
          points: 10,
          contextScenario: "Fintech Wallet Tier Registration & Default Limits",
          prompt: "What is printed by this Python snippet? Pay close attention to how setdefault() behaves on existing versus absent keys.",
          starterCode: "wallet = {'tier': 'TIER_3', 'daily_limit': 5000000}\nres1 = wallet.setdefault('tier', 'TIER_1')\nres2 = wallet.setdefault('currency', 'KES')\nwallet['daily_limit'] = 10000000\nprint(res1, res2, wallet['daily_limit'])",
          solutionCode: "TIER_3 KES 10000000",
          testCases: [
            {
              id: "tc1",
              label: "setdefault does not overwrite existing key",
              setup: "wallet = {'tier': 'TIER_3', 'daily_limit': 5000000}; res1 = wallet.setdefault('tier', 'TIER_1'); res2 = wallet.setdefault('currency', 'KES'); wallet['daily_limit'] = 10000000; res = f'{res1} {res2} {wallet[\"daily_limit\"]}'",
              expected: "'TIER_3 KES 10000000'",
              hidden: false
            }
          ],
          hints: [
            "Because 'tier' is already in wallet with value 'TIER_3', setdefault('tier', 'TIER_1') ignores 'TIER_1' and returns 'TIER_3'.",
            "Because 'currency' is missing, setdefault('currency', 'KES') inserts 'KES' and returns 'KES'.",
            "Direct assignment wallet['daily_limit'] = 10000000 overwrites 5000000."
          ]
        }
      ]
    },
    {
      id: "day8-sub5",
      number: 5,
      title: "Key Eviction Strategies: .pop(), .popitem(), del & .clear()",
      summary: "Explore dictionary deletion methods, distinguish strict del and pop() from safe fallback pop(), and understand LIFO removal via popitem().",
      estimatedMinutes: 8,
      introduce: {
        headline: "Safe vs Strict Eviction: KeyError Traps and LIFO Popitem",
        paragraphs: [
          "Python provides multiple mechanisms to remove key-value pairs from a dictionary: the `del` keyword, `.pop()`, `.popitem()`, and `.clear()`.",
          "The `del d[key]` Statement: Strictly removes the key and its value from the dictionary. If the key does not exist, `del` crashes with a `KeyError`.",
          "The `d.pop(key, [default])` Method: Removes the key and returns its value. If the key is missing and `default` is provided, it returns `default`. If `default` is omitted and the key is missing, `pop()` raises a `KeyError`.",
          "The `d.popitem()` Method: Removes and returns the LAST inserted `(key, value)` pair in LIFO (Last-In, First-Out) order. In empty dictionaries, `popitem()` raises a `KeyError`.",
          "The `d.clear()` Method: Empties the dictionary completely in-place, resetting `len(d)` to 0."
        ],
        keyTerms: [
          {
            term: "del Statement",
            definition: "Python keyword that deletes a key-value pair from a dictionary, raising KeyError if absent."
          },
          {
            term: "dict.pop()",
            definition: "Removes key and returns its value; accepts an optional fallback to avoid raising KeyError."
          },
          {
            term: "dict.popitem()",
            definition: "Removes and returns the most recently inserted (key, value) pair in LIFO order."
          },
          {
            term: "LIFO (Last-In, First-Out)",
            definition: "Removal order where the newest entry added to the dictionary is evicted first."
          }
        ],
        bulletPoints: [
          "del d[k] deletes key k; raises KeyError if missing.",
          "d.pop(k) removes and returns value; raises KeyError if missing unless default fallback is given.",
          "d.popitem() removes and returns (key, value) of the latest inserted item in LIFO order.",
          "d.clear() removes all pairs in-place, leaving an empty dictionary {}."
        ]
      },
      visualise: {
        type: "dict-mutation-flow-sim",
        title: "Dictionary Eviction Simulator",
        badge: "simulation",
        description: "Watch key-value pairs get popped, marked with dummy tombstones, and returned in LIFO order.",
        initialConfig: {
          mode: "pop"
        }
      },
      code: [
        {
          title: "Deleting Items: pop(), popitem(), del and clear()",
          runMode: "real",
          code: "# Sample active user session\nsession = {\n    \"user\": \"Kelechi\",\n    \"role\": \"SUPPORT\",\n    \"temp_token\": \"TOK-98721\",\n    \"ip\": \"197.210.64.12\",\n    \"status\": \"ACTIVE\",\n}\n\n# 1. Safe extraction with pop(key, default)\ntoken = session.pop(\"temp_token\")\nprint(f\"Extracted token: '{token}'\")\nprint(\"Keys after token pop:\", list(session.keys()))\n\n# Safe pop on missing key with fallback\nmissing_code = session.pop(\"promo_code\", \"NO_PROMO\")\nprint(\"Promo code fallback:\", missing_code)\n\n# 2. Strict deletion with del\ndel session[\"ip\"]\nprint(\"Keys after del session['ip']:\", list(session.keys()))\n\n# 3. LIFO eviction with popitem()\nlast_key, last_val = session.popitem()\nprint(f\"popitem() evicted last item: '{last_key}': '{last_val}'\")\nprint(\"Remaining keys:\", list(session.keys()))\n\n# 4. Empty dictionary in-place with clear()\nsession.clear()\nprint(\"After clear():\", session, \"Length:\", len(session))",
          expectedOutput: "Extracted token: 'TOK-98721'\nKeys after token pop: ['user', 'role', 'ip', 'status']\nPromo code fallback: NO_PROMO\nKeys after del session['ip']: ['user', 'role', 'status']\npopitem() evicted last item: 'status': 'ACTIVE'\nRemaining keys: ['user', 'role']\nAfter clear(): {} Length: 0"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 11,
          instruction: "token = session.pop(\"temp_token\")",
          internalEffect: "Finds 'temp_token' in dk_entries, marks index as dummy tombstone (-2), retrieves value pointer, and decrements size."
        },
        {
          step: 2,
          codeLine: 16,
          instruction: "session.pop(\"promo_code\", \"NO_PROMO\")",
          internalEffect: "Searches table; key absent. Detects default argument and returns 'NO_PROMO' without raising error."
        },
        {
          step: 3,
          codeLine: 24,
          instruction: "last_key, last_val = session.popitem()",
          internalEffect: "Reads the final valid entry in dk_entries, removes it, and unpacks the 2-tuple into variables."
        },
        {
          step: 4,
          codeLine: 29,
          instruction: "session.clear()",
          internalEffect: "Frees all key-value references in dk_entries and resets dk_indices array to all -1 slots."
        }
      ],
      apply: {
        domain: "Security Engineering & Session Cleanups",
        contextTitle: "Single-Use One-Time Password (OTP) Cache Eviction",
        scenario: "Consuming and evicting transient verification tokens from in-memory session caches to ensure OTP codes cannot be replayed."
      },
      commonMistakes: [
        {
          label: "Using pop() Without a Default on Unverified Keys",
          explanation: "Calling d.pop(key) raises KeyError if key is missing. Always provide a default fallback (e.g. d.pop(key, None)) for defensive deletion.",
          erroneousCode: "token = session.pop('temp_code')  # Crashes if code was already consumed!",
          correctedCode: "token = session.pop('temp_code', None)  # Gracefully returns None if absent"
        }
      ],
      practise: [
        {
          id: "d8-s5-ex1",
          title: "Predict Output: LIFO popitem() vs Targeted pop()",
          type: "predict-output",
          tier: "standard",
          points: 15,
          contextScenario: "Distributed Task Queue & Worker State Eviction",
          prompt: "What is printed by this task queue dispatcher? Trace the LIFO eviction of popitem() versus targeted key removal with pop().",
          starterCode: "queue = {'job_1': 'INGEST', 'job_2': 'TRANSFORM', 'job_3': 'LOAD'}\nlast_job = queue.popitem()\ningest_job = queue.pop('job_1')\nremaining = list(queue.keys())\nprint(last_job, ingest_job, remaining)",
          solutionCode: "('job_3', 'LOAD') INGEST ['job_2']",
          testCases: [
            {
              id: "tc1",
              label: "Traces popitem and pop removals accurately",
              setup: "queue = {'job_1': 'INGEST', 'job_2': 'TRANSFORM', 'job_3': 'LOAD'}; last_job = queue.popitem(); ingest_job = queue.pop('job_1'); remaining = list(queue.keys()); res = f'{last_job} {ingest_job} {remaining}'",
              expected: "\"('job_3', 'LOAD') INGEST ['job_2']\"",
              hidden: false
            }
          ],
          hints: [
            "popitem() always evicts and returns the most recently inserted (last) key-value pair as a 2-tuple ('job_3', 'LOAD').",
            "pop('job_1') looks up 'job_1', removes it, and returns its value 'INGEST'.",
            "Only 'job_2' remains in the dictionary, so list(queue.keys()) produces ['job_2']."
          ]
        },
        {
          id: "d8-s5-ex2",
          title: "Safe Token Eviction: pop(k, default) vs Strict del",
          type: "scenario-mcq",
          tier: "foundation",
          points: 10,
          contextScenario: "OAuth2 Token Revocation Endpoint",
          prompt: "An API gateway handles token revocation. If a client submits a token that may have already expired or been revoked, which one-line idiom cleanly removes it without risking an unhandled KeyError?",
          options: [
            {
              id: "s5-opt1",
              text: "sessions.pop(token, None) — safely removes the token or returns None if absent without raising KeyError.",
              explanation: "Correct! By supplying a fallback argument (None) to .pop(), Python suppresses KeyError and returns the fallback if the key is absent. This is the idiomatic, crash-free deletion pattern in Python.",
              isCorrect: true
            },
            {
              id: "s5-opt2",
              text: "del sessions[token] — Python automatically ignores missing keys in del statements.",
              explanation: "Incorrect. del raises a fatal KeyError if the target key does not exist.",
              isCorrect: false
            },
            {
              id: "s5-opt3",
              text: "sessions.popitem(token) — removes the named key using LIFO order.",
              explanation: "Incorrect. popitem() takes zero arguments in Python. Passing an argument raises TypeError.",
              isCorrect: false
            },
            {
              id: "s5-opt4",
              text: "sessions.clear(token) — deletes the token in-place.",
              explanation: "Incorrect. clear() takes zero arguments and empties the entire dictionary.",
              isCorrect: false
            }
          ],
          hints: [
            "del raises KeyError if the key is missing.",
            "popitem() and clear() do not accept target key arguments.",
            "pop(k, default) handles both existing and absent keys cleanly in a single expression."
          ]
        }
      ]
    },
    {
      id: "day8-sub6",
      number: 6,
      title: "Bulk Merging & Dictionary Expansion: .update() and PEP 584 Merge (| and |=)",
      summary: "Explore dictionary merging via .update(), double-star dictionary unpacking (**), and modern Python 3.9+ union operators (| and |=).",
      estimatedMinutes: 8,
      introduce: {
        headline: "Merging Mappings: .update(), Dict Unpacking (**) & The Merge Operator (|)",
        paragraphs: [
          "Combining data from multiple dictionaries is a daily operational requirement. Python offers three distinct patterns for merging mappings: `.update()`, dictionary unpacking (`**`), and the modern PEP 584 merge operators (`|` and `|=`).",
          "The `.update(other)` Method: Modifies the target dictionary in-place by copying all pairs from `other`. If keys collide, the values from `other` overwrite the existing values. Returns `None`.",
          "Dictionary Unpacking (`{**d1, **d2}`): Creates a brand-new dictionary combining entries from `d1` and `d2`. If keys overlap, entries from `d2` overwrite `d1`.",
          "Python 3.9+ Merge Operators (PEP 584): `merged = d1 | d2` constructs a new combined dictionary using clear binary operator syntax. The in-place operator `d1 |= d2` updates `d1` in-place, equivalent to `d1.update(d2)`."
        ],
        keyTerms: [
          {
            term: "dict.update()",
            definition: "In-place method that copies key-value pairs from other mappings, overwriting matching keys."
          },
          {
            term: "Dict Unpacking (**)",
            definition: "Syntax operator that unpacks a dictionary's key-value pairs into a new dictionary literal."
          },
          {
            term: "Merge Operator (|)",
            definition: "Python 3.9+ binary operator (PEP 584) returning a new merged dictionary combining both operands."
          },
          {
            term: "Update Operator (|=)",
            definition: "Python 3.9+ augmented assignment operator that merges the right dictionary into the left in-place."
          }
        ],
        bulletPoints: [
          "d1.update(d2) mutates d1 in-place and returns None.",
          "d1 | d2 (Python 3.9+) returns a brand-new dictionary without mutating d1 or d2.",
          "In all merging patterns, right-hand operands take precedence on key collisions.",
          "d1 |= d2 performs an in-place merge, identical to d1.update(d2)."
        ]
      },
      visualise: {
        type: "dict-mutation-flow-sim",
        title: "Dictionary Merge & Collision Simulator",
        badge: "simulation",
        description: "Observe key collisions during dictionary merge and watch right-hand values take precedence.",
        initialConfig: {
          mode: "update"
        }
      },
      code: [
        {
          title: "Merging Dictionaries with .update(), **, and PEP 584 (|)",
          runMode: "real",
          code: "# Default server settings\ndefault_config = {\"host\": \"0.0.0.0\", \"port\": 8080, \"debug\": False, \"workers\": 4}\nuser_overrides = {\"port\": 9000, \"debug\": True, \"env\": \"STAGING\"}\n\n# 1. In-place merge with .update()\nruntime_config = default_config.copy()\nruntime_config.update(user_overrides)\nprint(\"1. Merged via .update():\", runtime_config)\n\n# 2. Creating new merged dict via double-star unpacking (**)\nunpacked_merge = {**default_config, **user_overrides, \"log_level\": \"INFO\"}\nprint(\"2. Merged via ** unpacking:\", unpacked_merge)\n\n# 3. Modern Python 3.9+ Merge Operator (|)\n# Returns a brand-new dict; right operand wins on collision!\npipe_merged = default_config | user_overrides\nprint(\"3. Merged via operator (|):\", pipe_merged)\n\n# 4. Modern Python 3.9+ In-place Merge Operator (|=)\nactive_settings = {\"theme\": \"dark\", \"font_size\": 14}\nactive_settings |= {\"font_size\": 16, \"high_contrast\": True}\nprint(\"4. In-place via (|=):      \", active_settings)",
          expectedOutput: "1. Merged via .update(): {'host': '0.0.0.0', 'port': 9000, 'debug': True, 'workers': 4, 'env': 'STAGING'}\n2. Merged via ** unpacking: {'host': '0.0.0.0', 'port': 9000, 'debug': True, 'workers': 4, 'env': 'STAGING', 'log_level': 'INFO'}\n3. Merged via operator (|): {'host': '0.0.0.0', 'port': 9000, 'debug': True, 'workers': 4, 'env': 'STAGING'}\n4. In-place via (|=):       {'theme': 'dark', 'font_size': 16, 'high_contrast': True}"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 7,
          instruction: "runtime_config.update(user_overrides)",
          internalEffect: "Iterates through user_overrides, overwrites 'port' and 'debug', and appends novel key 'env'."
        },
        {
          step: 2,
          codeLine: 11,
          instruction: "unpacked_merge = {**default_config, ...}",
          internalEffect: "Unpacks keys and values onto evaluation stack; right-hand pairs overwrite left-hand duplicates."
        },
        {
          step: 3,
          codeLine: 16,
          instruction: "pipe_merged = default_config | user_overrides",
          internalEffect: "Invokes PyNumber_Or on dict types (PEP 584); allocates new PyDictObject with combined pairs."
        },
        {
          step: 4,
          codeLine: 21,
          instruction: "active_settings |= {\"font_size\": 16, ...}",
          internalEffect: "Invokes PyNumber_InPlaceOr; mutates active_settings directly without reallocating container."
        }
      ],
      apply: {
        domain: "Application Configuration & Cloud Microservices",
        contextTitle: "Hierarchical Configuration Cascading",
        scenario: "Cascading base system default configurations with environment variable overrides and CLI flags in microservice bootstrapping."
      },
      commonMistakes: [
        {
          label: "Assigning the Result of d.update() to a Variable",
          explanation: "d.update() mutates the dictionary in-place and returns None. Reassigning d = d.update(...) erases the dictionary, setting it to None.",
          erroneousCode: "settings = {'a': 1}\nsettings = settings.update({'b': 2})  # Bug: settings is now None!",
          correctedCode: "settings = {'a': 1}\nsettings.update({'b': 2})  # Mutates settings in-place"
        }
      ],
      practise: [
        {
          id: "d8-s6-ex1",
          title: "Write Code: Microservice Configuration Cascader",
          type: "write-code",
          tier: "standard",
          points: 15,
          contextScenario: "Microservice Environment Config Cascader",
          prompt: "Write a function `cascade_config(base_defaults, env_overrides, cli_flags)` that merges three dictionaries using Python 3.9+ dictionary union operators (`|`) so that CLI flags override environment variables, which in turn override base defaults. The function must not mutate any input dictionaries.",
          starterCode: "def cascade_config(base_defaults, env_overrides, cli_flags):\n    # TODO: Merge dictionaries with PEP 584 | operator\n    pass",
          solutionCode: "def cascade_config(base_defaults, env_overrides, cli_flags):\n    return base_defaults | env_overrides | cli_flags",
          testCases: [
            {
              id: "tc1",
              label: "Correct precedence cascading",
              setup: "base = {'port': 8000, 'debug': False, 'env': 'prod'}; env = {'debug': True}; cli = {'port': 9000}; res = cascade_config(base, env, cli)",
              expected: "{'port': 9000, 'debug': True, 'env': 'prod'}",
              hidden: false
            },
            {
              id: "tc2",
              label: "Preserves base when overrides are empty",
              setup: "res = cascade_config({'timeout': 30}, {}, {})",
              expected: "{'timeout': 30}",
              hidden: false
            }
          ],
          hints: [
            "In Python 3.9+, dict_a | dict_b produces a new dictionary where right-hand values overwrite left-hand duplicates.",
            "Chain the union: base_defaults | env_overrides | cli_flags.",
            "Because cli_flags is rightmost, its values take ultimate precedence."
          ]
        },
        {
          id: "d8-s6-ex2",
          title: "Order the Lines: API Gateway Header Builder",
          type: "order-the-lines",
          tier: "standard",
          points: 15,
          contextScenario: "API Gateway Request Header Assembly",
          prompt: "Arrange the lines in logical execution sequence to assemble an HTTP header dictionary using double-star unpacking (`**`) and in-place PEP 584 expansion (`|=`).",
          starterCode: "consolidated |= {'X-Correlation-ID': 'REQ-9999', 'Accept': 'application/vnd.api+json'}\nbase_headers = {'Accept': 'application/json', 'User-Agent': 'FinGateway/2.0'}\nprint(consolidated['Accept'], consolidated['X-Correlation-ID'])\nauth_payload = {'Authorization': 'Bearer tok_xyz', 'X-Client-ID': 'CLI-88'}\nconsolidated = {**base_headers, **auth_payload}",
          solutionCode: "base_headers = {'Accept': 'application/json', 'User-Agent': 'FinGateway/2.0'}\nauth_payload = {'Authorization': 'Bearer tok_xyz', 'X-Client-ID': 'CLI-88'}\nconsolidated = {**base_headers, **auth_payload}\nconsolidated |= {'X-Correlation-ID': 'REQ-9999', 'Accept': 'application/vnd.api+json'}\nprint(consolidated['Accept'], consolidated['X-Correlation-ID'])",
          testCases: [
            {
              id: "tc1",
              label: "Produces expected merged output",
              setup: "base_headers = {'Accept': 'application/json', 'User-Agent': 'FinGateway/2.0'}; auth_payload = {'Authorization': 'Bearer tok_xyz', 'X-Client-ID': 'CLI-88'}; consolidated = {**base_headers, **auth_payload}; consolidated |= {'X-Correlation-ID': 'REQ-9999', 'Accept': 'application/vnd.api+json'}; res = f\"{consolidated['Accept']} {consolidated['X-Correlation-ID']}\"",
              expected: "'application/vnd.api+json REQ-9999'",
              hidden: false
            }
          ],
          hints: [
            "First define the two source dictionaries: base_headers and auth_payload.",
            "Next, combine them into consolidated using {**base_headers, **auth_payload}.",
            "Then, apply the in-place update using consolidated |= {...} before printing."
          ]
        }
      ]
    },
    {
      id: "day8-sub7",
      number: 7,
      title: "Dynamic View Objects: .keys(), .values() & .items()",
      summary: "Understand dynamic view objects (dict_keys, dict_values, dict_items), how they reflect dictionary mutations live, and perform set algebra on keys.",
      estimatedMinutes: 8,
      introduce: {
        headline: "Dynamic Memory Windows: Dictionary Views & Set-like Keys",
        paragraphs: [
          "In Python 3, calling `d.keys()`, `d.values()`, or `d.items()` does NOT create or return static lists of data. Instead, they return dynamic, memory-efficient collection view objects: `dict_keys`, `dict_values`, and `dict_items`.",
          "Dynamic Reflection: A dictionary view does not copy data; it provides a live, zero-copy window into the dictionary's internal memory. If you add, delete, or modify a key in `d`, all existing view objects reflect the change instantly!",
          "Set-Like Behavior of dict_keys & dict_items: Because dictionary keys are guaranteed to be unique and hashable, `dict_keys` and `dict_items` implement the mathematical set protocol! You can perform set operations directly on them: `d1.keys() & d2.keys()` computes key intersections without creating temporary sets.",
          "Iteration Pattern: The most idiomatic way to loop through both keys and values simultaneously is unpacking `d.items()`: `for key, value in d.items(): ...`."
        ],
        keyTerms: [
          {
            term: "Dictionary Views",
            definition: "Dynamic, memory-efficient collection views (dict_keys, dict_values, dict_items) that reflect changes live."
          },
          {
            term: "dict.keys()",
            definition: "Returns a view of all keys in the dictionary; implements set-like operations (&, |, -, ^)."
          },
          {
            term: "dict.values()",
            definition: "Returns a view of all values in the dictionary (may contain duplicates)."
          },
          {
            term: "dict.items()",
            definition: "Returns a view of (key, value) 2-tuples for sequence unpacking."
          }
        ],
        bulletPoints: [
          "d.keys(), d.values(), d.items() return live views, not static lists.",
          "Views reflect subsequent mutations to the dictionary instantly.",
          "dict_keys support set operations: keys1 & keys2 (intersection), keys1 - keys2 (difference).",
          "Convert to a list with list(d.keys()) only when static snapshots or indexing are required."
        ]
      },
      visualise: {
        type: "compact-dict-memory-inspector",
        title: "Dictionary View Dynamic Reflection Inspector",
        badge: "simulation",
        description: "Watch dict_keys and dict_values views update in real time when underlying dictionary keys are modified.",
        initialConfig: {
          mode: "views"
        }
      },
      code: [
        {
          title: "Inspecting Dictionary Views and Set Algebra on Keys",
          runMode: "real",
          code: "inventory = {\"laptops\": 25, \"monitors\": 40, \"keyboards\": 100}\n\n# 1. Obtaining live views\nkeys_view = inventory.keys()\nvalues_view = inventory.values()\nitems_view = inventory.items()\n\nprint(\"Initial keys view:\", keys_view)\n\n# 2. Dynamic reflection: mutating inventory updates views instantly!\ninventory[\"mice\"] = 85\nprint(\"Keys view after adding 'mice':\", keys_view)\n\n# 3. Iterating with d.items() unpacking\nprint(\"\\nInventory Itemization:\")\nfor product, qty in inventory.items():\n    print(f\"  Product: {product:10} | In Stock: {qty}\")\n\n# 4. Set algebra on dictionary keys\nwarehouse_a_keys = {\"laptops\": 10, \"monitors\": 15, \"tablets\": 30}.keys()\nwarehouse_b_keys = {\"monitors\": 20, \"tablets\": 12, \"phones\": 50}.keys()\n\ncommon_products = warehouse_a_keys & warehouse_b_keys\nexclusive_to_a = warehouse_a_keys - warehouse_b_keys\nprint(\"\\nCommon products in both warehouses (&):\", common_products)\nprint(\"Exclusive to Warehouse A (-):           \", exclusive_to_a)",
          expectedOutput: "Initial keys view: dict_keys(['laptops', 'monitors', 'keyboards'])\nKeys view after adding 'mice': dict_keys(['laptops', 'monitors', 'keyboards', 'mice'])\n\nInventory Itemization:\n  Product: laptops    | In Stock: 25\n  Product: monitors   | In Stock: 40\n  Product: keyboards  | In Stock: 100\n  Product: mice       | In Stock: 85\n\nCommon products in both warehouses (&): {'tablets', 'monitors'}\nExclusive to Warehouse A (-):            {'laptops'}"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: "keys_view = inventory.keys()",
          internalEffect: "Allocates a lightweight PyDictViewObject pointing directly to the internal dict table without copying keys."
        },
        {
          step: 2,
          codeLine: 11,
          instruction: "inventory[\"mice\"] = 85",
          internalEffect: "Appends 'mice' to dictionary. Because keys_view reads directly from dict memory, it reflects 'mice' immediately."
        },
        {
          step: 3,
          codeLine: 16,
          instruction: "for product, qty in inventory.items():",
          internalEffect: "Iterates through entries array, unpacking each (key, value) pointer pair directly into loop variables."
        },
        {
          step: 4,
          codeLine: 24,
          instruction: "warehouse_a_keys & warehouse_b_keys",
          internalEffect: "Executes set intersection directly between two dict_keys views in O(min(len_a, len_b)) time."
        }
      ],
      apply: {
        domain: "Inventory Management & Logistics",
        contextTitle: "Multi-Warehouse Stock Catalog Reconciler",
        scenario: "Comparing catalog product keys across regional supply fulfillment centers using set algebra on dict_keys without copying data into memory."
      },
      commonMistakes: [
        {
          label: "Attempting to Index a Dictionary View",
          explanation: "Dictionary views do not support indexing d.keys()[0]. Accessing by index raises TypeError: 'dict_keys' object is not subscriptable. Convert to list(d.keys()) if indexing is required.",
          erroneousCode: "first_key = d.keys()[0]  # TypeError!",
          correctedCode: "first_key = next(iter(d))  # Or list(d.keys())[0]"
        }
      ],
      practise: [
        {
          id: "d8-s7-ex1",
          title: "Write Code: Multi-Store Catalog Reconciliation via dict_keys Set Algebra",
          type: "write-code",
          tier: "standard",
          points: 15,
          contextScenario: "Multi-Store Inventory Catalog Reconciliation",
          prompt: "Write a function `reconcile_catalogs(warehouse_a, warehouse_b)` that takes two dictionary catalogs mapping `sku -> quantity`. Use set algebra directly on `dict_keys` views to return a 3-tuple: (1) set of SKUs common to both warehouses, (2) set of SKUs exclusive to Warehouse A, and (3) set of SKUs exclusive to either warehouse (symmetric difference).",
          starterCode: "def reconcile_catalogs(warehouse_a, warehouse_b):\n    # TODO: Return (common, only_a, exclusive_xor) using keys() set operators\n    pass",
          solutionCode: "def reconcile_catalogs(warehouse_a, warehouse_b):\n    keys_a = warehouse_a.keys()\n    keys_b = warehouse_b.keys()\n    return (keys_a & keys_b, keys_a - keys_b, keys_a ^ keys_b)",
          testCases: [
            {
              id: "tc1",
              label: "Reconciles overlapping catalogs accurately",
              setup: "wh_a = {'SKU-1': 10, 'SKU-2': 5, 'SKU-3': 8}; wh_b = {'SKU-2': 15, 'SKU-3': 2, 'SKU-4': 20}; res = reconcile_catalogs(wh_a, wh_b)",
              expected: "({'SKU-2', 'SKU-3'}, {'SKU-1'}, {'SKU-1', 'SKU-4'})",
              hidden: false
            },
            {
              id: "tc2",
              label: "Handles completely disjoint catalogs",
              setup: "res = reconcile_catalogs({'A': 1}, {'B': 2})",
              expected: "(set(), {'A'}, {'A', 'B'})",
              hidden: false
            }
          ],
          hints: [
            "Access keys views using warehouse_a.keys() and warehouse_b.keys().",
            "dict_keys views directly support set operators: & (intersection), - (difference), and ^ (symmetric difference).",
            "Return the tuple: (keys_a & keys_b, keys_a - keys_b, keys_a ^ keys_b)."
          ]
        },
        {
          id: "d8-s7-ex2",
          title: "Explain the Trace: Dynamic Zero-Copy View Reflection",
          type: "explain-the-trace",
          tier: "challenge",
          points: 20,
          contextScenario: "Dynamic Telemetry Cache Monitor",
          prompt: "An engineer creates a view: `cache = {'A': 1, 'B': 2}; view = cache.keys(); cache['C'] = 3; del cache['A']`. When they inspect `list(view)`, the result is `['B', 'C']`. Why did the view reflect changes made AFTER it was created?",
          options: [
            {
              id: "s7-opt1",
              text: "dict_keys is a dynamic proxy window into the underlying hash table, not a static snapshot, so any mutation to the dict is reflected in real time without extra memory allocation.",
              explanation: "Correct! In Python 3, .keys(), .values(), and .items() return view objects that maintain an active pointer to the dictionary's internal table. They reflect additions, overwrites, and deletions immediately without copying data.",
              isCorrect: true
            },
            {
              id: "s7-opt2",
              text: "Python triggers an implicit callback hook that re-evaluates view = cache.keys() whenever the dict is modified.",
              explanation: "Incorrect. There are no background callbacks; the view object simply references the dictionary object directly.",
              isCorrect: false
            },
            {
              id: "s7-opt3",
              text: "Python 3 automatically sorts all dictionary views on iteration.",
              explanation: "Incorrect. Views iterate in insertion order, not sorted order.",
              isCorrect: false
            },
            {
              id: "s7-opt4",
              text: "del cache['A'] creates a new dictionary and updates all existing variable references in the global scope.",
              explanation: "Incorrect. del mutates the existing dictionary in-place; it never creates a new dictionary.",
              isCorrect: false
            }
          ],
          hints: [
            "In Python 2, d.keys() returned a static copy list. Python 3 replaced this with dynamic view objects.",
            "Views do not copy data; they provide a live window directly into the dictionary's dk_entries structure.",
            "Because no data was copied, whatever is currently in the dictionary is what the view reads upon iteration."
          ]
        }
      ]
    },
    {
      id: "day8-sub8",
      number: 8,
      title: "Nested Dictionaries & Hierarchical JSON Data Modeling",
      summary: "Model complex structured data using nested dictionaries, navigate multi-level keys, and master safe chained retrieval for nested API documents.",
      estimatedMinutes: 9,
      introduce: {
        headline: "Multi-Dimensional State: Hierarchical Records & Deep Navigation",
        paragraphs: [
          "In real-world software, data is rarely flat. Python dictionaries can contain other dictionaries as values, forming deeply nested hierarchical structures that mirror JSON documents, MongoDB records, and web API payloads.",
          "Chained Subscripting: You traverse nested dictionaries by chaining square brackets from the outer container inwards: `user['profile']['addresses']['work']['city']`.",
          "The Deep KeyError Trap: If any intermediate key in the chain is missing (or is `None`), chained subscripting crashes immediately with a `KeyError` or `TypeError: 'NoneType' object is not subscriptable`.",
          "Safe Chained Retrieval: To navigate deep structures safely, developers use chained `.get()` with empty fallback dictionaries: `user.get('profile', {}).get('address', {}).get('city', 'Unknown')`."
        ],
        keyTerms: [
          {
            term: "Nested Dictionary",
            definition: "A dictionary that contains one or more other dictionaries as its value objects."
          },
          {
            term: "Chained Subscripting",
            definition: "Accessing nested elements using sequential bracket notations: d[outer][inner][sub]."
          },
          {
            term: "Defensive Chaining",
            definition: "Using d.get(k, {}).get(...) with empty dictionary fallbacks to prevent nested KeyErrors."
          },
          {
            term: "JSON Mapping",
            definition: "The 1-to-1 correspondence between JavaScript Object Notation (JSON) objects and Python dictionaries."
          }
        ],
        bulletPoints: [
          "Nested dicts model hierarchical real-world structures like JSON and API responses.",
          "Access deep values with chained brackets: record['company']['address']['city'].",
          "If any intermediate key is missing, chained brackets raise KeyError.",
          "Use d.get('key', {}).get('sub_key') for crash-free defensive navigation."
        ]
      },
      visualise: {
        type: "dict-mutation-flow-sim",
        title: "Nested JSON Hierarchy Navigator",
        badge: "simulation",
        description: "Navigate multi-level nested dictionaries and trace chained subscript vs defensive .get() evaluation.",
        initialConfig: {
          mode: "nested"
        }
      },
      code: [
        {
          title: "Navigating & Mutating Nested Hierarchical Dictionaries",
          runMode: "real",
          code: "# Nested employee record modeling a microservice API payload\nemployee = {\n    \"id\": \"EMP-1042\",\n    \"personal\": {\n        \"first_name\": \"Chidi\",\n        \"last_name\": \"Okeke\",\n        \"contact\": {\n            \"email\": \"chidi.okeke@fintech.ng\",\n            \"phone\": \"08031234567\",\n            \"city\": \"Lagos\"\n        }\n    },\n    \"roles\": [\"FINANCE_ANALYST\", \"AUDITOR\"],\n    \"status\": {\"active\": True, \"suspended\": False}\n}\n\n# 1. Chained direct subscript access\ncity = employee[\"personal\"][\"contact\"][\"city\"]\nprint(f\"Employee City: {city}\")\n\n# 2. Mutating a nested dictionary attribute in-place\nemployee[\"personal\"][\"contact\"][\"city\"] = \"Victoria Island, Lagos\"\nprint(\"Updated City: \", employee[\"personal\"][\"contact\"][\"city\"])\n\n# 3. Adding a new nested field dynamically\nemployee[\"personal\"][\"contact\"][\"state\"] = \"Lagos State\"\n\n# 4. Safe defensive navigation with chained .get()\n# Accessing an optional nested path that may not exist\nzip_code = employee.get(\"personal\", {}).get(\"contact\", {}).get(\"zip_code\", \"100001\")\nprint(\"Postal Code (safe fallback):\", zip_code)",
          expectedOutput: "Employee City: Lagos\nUpdated City:  Victoria Island, Lagos\nPostal Code (safe fallback): 100001"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 18,
          instruction: "city = employee[\"personal\"][\"contact\"][\"city\"]",
          internalEffect: "Sequentially dereferences pointers: employee -> 'personal' dict -> 'contact' dict -> 'city' string in O(1) total time."
        },
        {
          step: 2,
          codeLine: 22,
          instruction: "employee[\"personal\"][\"contact\"][\"city\"] = \"Victoria Island, Lagos\"",
          internalEffect: "Traverses to inner 'contact' dict and mutates the 'city' slot in-place; outer references remain intact."
        },
        {
          step: 3,
          codeLine: 26,
          instruction: "employee[\"personal\"][\"contact\"][\"state\"] = \"Lagos State\"",
          internalEffect: "Inserts new key 'state' into the inner 'contact' dictionary."
        },
        {
          step: 4,
          codeLine: 30,
          instruction: "zip_code = employee.get(\"personal\", {}).get(...) ...",
          internalEffect: "Each .get() provides an empty dict {} fallback, ensuring subsequent .get() calls never fail on NoneType."
        }
      ],
      apply: {
        domain: "Fintech & Open Banking APIs",
        contextTitle: "Open Banking Customer Payload Parser",
        scenario: "Parsing deeply nested JSON payloads from Nigerian Inter-Bank Settlement System (NIBSS) APIs containing customer accounts, BVN profiles, and KYC records."
      },
      commonMistakes: [
        {
          label: "Chaining .get() Without Default Empty Dictionaries",
          explanation: "Writing d.get('a').get('b') crashes with AttributeError: 'NoneType' object has no attribute 'get' if 'a' is missing. Always use d.get('a', {}).get('b').",
          erroneousCode: "city = user.get('address').get('city')  # Crashes if user has no 'address'!",
          correctedCode: "city = user.get('address', {}).get('city', 'Unknown')  # Safe"
        }
      ],
      practise: [
        {
          id: "d8-s8-ex1",
          title: "Write Code: Safe Multi-Level Nested Dictionary Navigator",
          type: "write-code",
          tier: "challenge",
          points: 20,
          contextScenario: "Open Banking Identity Verification Engine",
          prompt: "Write a defensive traversal utility `safe_nested_get(record, path, default=None)` that takes a nested dictionary `record` and an iterable of string keys `path`. Step through the keys sequentially. If any intermediate key is missing or references a non-dictionary object (such as `None`), gracefully return `default` without throwing an exception.",
          starterCode: "def safe_nested_get(record, path, default=None):\n    # TODO: Defensively traverse keys in path\n    pass",
          solutionCode: "def safe_nested_get(record, path, default=None):\n    curr = record\n    for k in path:\n        if not isinstance(curr, dict) or k not in curr:\n            return default\n        curr = curr[k]\n    return curr",
          testCases: [
            {
              id: "tc1",
              label: "Retrieves deeply nested valid key",
              setup: "rec = {'user': {'kyc': {'tier': 'TIER_3'}}}; res = safe_nested_get(rec, ['user', 'kyc', 'tier'])",
              expected: "'TIER_3'",
              hidden: false
            },
            {
              id: "tc2",
              label: "Handles missing key cleanly",
              setup: "rec = {'user': {'kyc': {}}}; res = safe_nested_get(rec, ['user', 'kyc', 'tier'], 'DEFAULT_TIER')",
              expected: "'DEFAULT_TIER'",
              hidden: false
            },
            {
              id: "tc3",
              label: "Safely handles intermediate None value",
              setup: "rec = {'user': None}; res = safe_nested_get(rec, ['user', 'kyc', 'tier'], 'UNVERIFIED')",
              expected: "'UNVERIFIED'",
              hidden: false
            }
          ],
          hints: [
            "Initialize a pointer curr = record.",
            "In each loop step, check if isinstance(curr, dict) and k in curr before subscripting.",
            "If the check fails at any point, immediately return default."
          ]
        },
        {
          id: "d8-s8-ex2",
          title: "The None Trap in Chained .get() Invocations",
          type: "scenario-mcq",
          tier: "standard",
          points: 15,
          contextScenario: "Payment Gateway Webhook Payload Parsing",
          prompt: "Given `payload = {'customer': None}`, what happens when executing `city = payload.get('customer', {}).get('city', 'Unknown')`?",
          options: [
            {
              id: "s8-opt1",
              text: "Raises AttributeError: 'NoneType' object has no attribute 'get' because payload.get('customer', {}) returns None, not the empty dictionary fallback.",
              explanation: "Correct! The default argument in .get(key, default) is only used if the key is completely missing. Because 'customer' is present with the value None, .get() returns None. Then calling .get('city') on None raises an AttributeError.",
              isCorrect: true
            },
            {
              id: "s8-opt2",
              text: "Returns 'Unknown' because Python automatically substitutes the fallback for falsy values like None.",
              explanation: "Incorrect. .get() checks for key presence, not truthiness.",
              isCorrect: false
            },
            {
              id: "s8-opt3",
              text: "Raises KeyError: 'customer'.",
              explanation: "Incorrect. .get() never raises KeyError.",
              isCorrect: false
            },
            {
              id: "s8-opt4",
              text: "Returns None because city defaults to None.",
              explanation: "Incorrect. The code crashes with an AttributeError before evaluating the second fallback.",
              isCorrect: false
            }
          ],
          hints: [
            "Does .get('customer', {}) check if 'customer' exists or if its value is truthy?",
            "Because 'customer' is in payload, payload.get('customer', {}) evaluates to None.",
            "What happens when you call None.get('city')?"
          ]
        }
      ]
    },
    {
      id: "day8-sub9",
      number: 9,
      title: "Dictionary Comprehensions & Inversion Strategies",
      summary: "Construct and transform dictionaries concisely using dictionary comprehensions, apply conditional filters, and invert key-value mappings safely.",
      estimatedMinutes: 8,
      introduce: {
        headline: "Concise Transforms: Comprehensions, Inverting & Key Filtering",
        paragraphs: [
          "Just like list comprehensions, Python supports Dictionary Comprehensions. A dictionary comprehension provides an expressive, concise syntax to construct or transform dictionaries from any iterable in a single line.",
          "Syntax: `{key_expr: value_expr for item in iterable if condition}`.",
          "Common Applications: (1) Transforming existing dictionary values (e.g. converting prices from USD to NGN); (2) Filtering keys or values based on predicates (e.g. extracting only active accounts); (3) Creating mappings from enumerations or paired zip collections.",
          "The Inversion Pattern: To invert a dictionary (swap keys and values so lookups can happen in reverse), write `{v: k for k, v in d.items()}`. Crucial Watch-out: If original values contain duplicates, the last key processed will overwrite earlier keys!"
        ],
        keyTerms: [
          {
            term: "Dict Comprehension",
            definition: "Concise syntactic expression {k: v for item in iter if cond} that creates a new dictionary."
          },
          {
            term: "Dictionary Inversion",
            definition: "The pattern {v: k for k, v in d.items()} that swaps keys and values for reverse lookups."
          },
          {
            term: "Key Inversion Collision",
            definition: "Occurs when original dictionary values have duplicates; the inverted dictionary collapses duplicates to the final key."
          },
          {
            term: "Conditional Filtering",
            definition: "Using the 'if condition' clause in a comprehension to filter out unwanted dictionary entries."
          }
        ],
        bulletPoints: [
          "Dict comprehension syntax: {k_expr: v_expr for item in iterable if cond}.",
          "Filter entries dynamically: {k: v for k, v in d.items() if v > threshold}.",
          "Invert mappings: {v: k for k, v in d.items()} enables reverse O(1) lookups.",
          "Ensure values are unique and hashable before inverting a dictionary."
        ]
      },
      visualise: {
        type: "compact-dict-memory-inspector",
        title: "Dictionary Comprehension & Inversion Inspector",
        badge: "simulation",
        description: "Watch a dictionary comprehension transform and invert mappings into a newly allocated compact dictionary.",
        initialConfig: {
          mode: "comprehensions"
        }
      },
      code: [
        {
          title: "Transforming, Filtering and Inverting Dictionaries",
          runMode: "real",
          code: "# 1. Basic comprehension: Number squaring map\nsquares = {x: x**2 for x in range(1, 6)}\nprint(\"1. Squares map:\", squares)\n\n# 2. Transforming values: Currency conversion (USD to NGN at ₦1,500/USD)\nusd_prices = {\"laptop\": 1200, \"phone\": 800, \"tablet\": 450, \"monitor\": 250}\nngn_prices = {item: price * 1500 for item, price in usd_prices.items()}\nprint(\"\\n2. NGN Prices:\", ngn_prices)\n\n# 3. Conditional filtering: High-value assets (> ₦1,000,000)\nhigh_value = {item: price for item, price in ngn_prices.items() if price >= 1000000}\nprint(\"\\n3. High-Value Assets (>= ₦1,000,000):\", high_value)\n\n# 4. Inverting a dictionary: Swapping keys and values for reverse lookup\nuser_to_id = {\"amina\": 101, \"chidi\": 102, \"bello\": 103}\nid_to_user = {uid: name for name, uid in user_to_id.items()}\nprint(\"\\n4. Original (Name -> ID):\", user_to_id)\nprint(\"   Inverted (ID -> Name):\", id_to_user)\nprint(f\"   Reverse lookup ID 102: {id_to_user[102]}\")",
          expectedOutput: "1. Squares map: {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}\n\n2. NGN Prices: {'laptop': 1800000, 'phone': 1200000, 'tablet': 675000, 'monitor': 375000}\n\n3. High-Value Assets (>= ₦1,000,000): {'laptop': 1800000, 'phone': 1200000}\n\n4. Original (Name -> ID): {'amina': 101, 'chidi': 102, 'bello': 103}\n   Inverted (ID -> Name): {101: 'amina', 102: 'chidi', 103: 'bello'}\n   Reverse lookup ID 102: chidi"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: "squares = {x: x**2 for x in range(1, 6)}",
          internalEffect: "Iterates range 1 to 5, computes key x and value x**2, inserting pairs sequentially into a new PyDictObject."
        },
        {
          step: 2,
          codeLine: 7,
          instruction: "ngn_prices = {item: price * 1500 ...}",
          internalEffect: "Iterates usd_prices.items(), multiplies values by 1500, preserving original string keys."
        },
        {
          step: 3,
          codeLine: 11,
          instruction: "high_value = {item: price ... if price >= 1000000}",
          internalEffect: "Evaluates predicate filter; entries with prices below 1,000,000 are skipped during iteration."
        },
        {
          step: 4,
          codeLine: 16,
          instruction: "id_to_user = {uid: name for name, uid in user_to_id.items()}",
          internalEffect: "Swaps keys and values; integer uid becomes dictionary key, string name becomes associated value."
        }
      ],
      apply: {
        domain: "Data Engineering & Reverse Indexing",
        contextTitle: "Two-Way Cache Index Builder",
        scenario: "Constructing bidirectional in-memory caches mapping customer usernames to internal database integer IDs and vice versa."
      },
      commonMistakes: [
        {
          label: "Inverting Dictionaries with Non-Unique or Unhashable Values",
          explanation: "When inverting with {v: k for k, v in d.items()}, if values are mutable (like lists) Python raises TypeError. If values are not unique, duplicate keys overwrite each other silently.",
          erroneousCode: "d = {'a': [1, 2], 'b': [3, 4]}\ninv = {v: k for k, v in d.items()}  # TypeError: unhashable type: 'list'!",
          correctedCode: "# Convert lists to tuples before inverting:\ninv = {tuple(v): k for k, v in d.items()}"
        }
      ],
      practise: [
        {
          id: "d8-s9-ex1",
          title: "Write Code: FX Rate Currency Conversion Dict Comprehension",
          type: "write-code",
          tier: "standard",
          points: 15,
          contextScenario: "Bureau De Change FX Rate Transformer",
          prompt: "Write a function `convert_catalog_prices(usd_catalog, fx_rate, min_threshold_ngn)` that takes a catalog dictionary mapping `item_name -> price_usd`. Use a dictionary comprehension to convert each price to NGN (`round(price_usd * fx_rate, 2)`), filtering to keep only items whose converted price is greater than or equal to `min_threshold_ngn`.",
          starterCode: "def convert_catalog_prices(usd_catalog, fx_rate, min_threshold_ngn):\n    # TODO: Dict comprehension with price conversion and threshold filter\n    pass",
          solutionCode: "def convert_catalog_prices(usd_catalog, fx_rate, min_threshold_ngn):\n    return {item: round(usd * fx_rate, 2) for item, usd in usd_catalog.items() if round(usd * fx_rate, 2) >= min_threshold_ngn}",
          testCases: [
            {
              id: "tc1",
              label: "Converts and filters items correctly",
              setup: "catalog = {'USB Cable': 5.0, 'Monitor': 250.0, 'Keyboard': 45.0}; res = convert_catalog_prices(catalog, 1500.0, 50000.0)",
              expected: "{'Monitor': 375000.0, 'Keyboard': 67500.0}",
              hidden: false
            },
            {
              id: "tc2",
              label: "Returns empty dict when no items satisfy threshold",
              setup: "res = convert_catalog_prices({'Pen': 1.0}, 1500.0, 10000.0)",
              expected: "{}",
              hidden: false
            }
          ],
          hints: [
            "Use dict comprehension syntax: {k: v for k, v in usd_catalog.items() if ...}.",
            "In the value expression, multiply usd by fx_rate and round to 2 decimals.",
            "In the if condition, ensure the computed NGN price is >= min_threshold_ngn."
          ]
        },
        {
          id: "d8-s9-ex2",
          title: "Fix the Bug: Collision-Safe & Hashable Reverse Registry Inversion",
          type: "fix-the-bug",
          tier: "project",
          points: 25,
          contextScenario: "Central Identity Registry Two-Way Inverted Index",
          prompt: "The reverse indexer below crashes with `TypeError: unhashable type: 'list'` whenever a customer record contains a list of regulatory tags, and silently drops customer accounts when two accounts share a national ID. Fix `build_safe_inverted_index(registry)` to: (1) convert list values to hashable tuples, and (2) group all account keys under the same identifier in a list.",
          starterCode: "def build_safe_inverted_index(registry):\n    # BUG: Crashes on list values and silently overwrites shared IDs\n    return {val: key for key, val in registry.items()}",
          solutionCode: "def build_safe_inverted_index(registry):\n    inverted = {}\n    for acc, ident in registry.items():\n        key = tuple(ident) if isinstance(ident, list) else ident\n        inverted.setdefault(key, []).append(acc)\n    return inverted",
          testCases: [
            {
              id: "tc1",
              label: "Groups accounts sharing the same national ID",
              setup: "reg = {'ACC-101': 'NIN-99', 'ACC-102': 'NIN-99', 'ACC-103': 'NIN-77'}; res = build_safe_inverted_index(reg)",
              expected: "{'NIN-99': ['ACC-101', 'ACC-102'], 'NIN-77': ['ACC-103']}",
              hidden: false
            },
            {
              id: "tc2",
              label: "Converts mutable list values to hashable tuple keys",
              setup: "reg = {'ACC-201': ['TIER_1', 'RETAIL']}; res = build_safe_inverted_index(reg)",
              expected: "{('TIER_1', 'RETAIL'): ['ACC-201']}",
              hidden: false
            }
          ],
          hints: [
            "Do not use a naive one-line inversion because duplicate values will overwrite each other.",
            "Check if isinstance(ident, list), and if so, cast with tuple(ident) to make it hashable.",
            "Use inverted.setdefault(key, []).append(acc) to group all accounts under the target ID."
          ]
        }
      ]
    }
  ],
  realWorldLabs: [
    {
      id: "day8-lab1",
      title: "High-Volume E-Commerce Flash-Sale Cart & Inventory Ledger Engine",
      description: "Build a high-volume shopping cart checkout and inventory management engine for Jumia/Konga flash-sales in Lagos: validate stock availability with defensive .get(), reserve items with setdefault(), apply tiered voucher discounts with dictionary merging, and evict expired holds using popitem().",
      domain: "E-Commerce & Flash-Sale Inventory Systems",
      starterCode: `# Real-World Lab 1: Flash-Sale Cart & Inventory Ledger Engine

# 1. Warehouse Inventory Catalog: {sku: {name, unit_price, stock}}
warehouse_catalog = {
    "SKU-PHN-01": {"name": "Infinix Zero 30", "price": 185000.0, "stock": 12},
    "SKU-LAP-02": {"name": "MacBook Air M2", "price": 1450000.0, "stock": 4},
    "SKU-AUD-03": {"name": "Oraimo FreePods 4", "price": 28500.0, "stock": 35},
    "SKU-ACC-04": {"name": "Fast Charger 65W", "price": 14000.0, "stock": 50},
}

# 2. Incoming Flash-Sale Shopping Cart: {sku: requested_quantity}
customer_cart = {
    "SKU-PHN-01": 2,
    "SKU-AUD-03": 3,
    "SKU-ACC-04": 1,
    "SKU-UNKNOWN-99": 1,  # Non-existent item
}

# 3. Base Checkout Config and Promo Overrides (PEP 584 Merge)
base_checkout_config = {"vat_rate": 0.075, "shipping_flat": 3500.0, "discount_pct": 0.0}
flash_promo_override = {"discount_pct": 0.10, "shipping_flat": 0.0}  # Free shipping & 10% off
applied_config = base_checkout_config | flash_promo_override

print("=== FLASH SALE CHECKOUT & INVENTORY AUDIT ===")
print("Applied Checkout Config:", applied_config)

subtotal = 0.0
verified_items = {}
rejected_items = []

for sku, qty in customer_cart.items():
    # Defensive lookup with .get()
    item_info = warehouse_catalog.get(sku)
    if not item_info:
        rejected_items.append((sku, "SKU Not Found in Catalog"))
        continue
    
    current_stock = item_info.get("stock", 0)
    if current_stock < qty:
        rejected_items.append((sku, f"Insufficient stock: requested {qty}, available {current_stock}"))
        continue
    
    # Reserve stock and compute item line
    item_info["stock"] -= qty
    line_total = item_info["price"] * qty
    subtotal += line_total
    verified_items[sku] = {
        "name": item_info["name"],
        "qty": qty,
        "unit_price": item_info["price"],
        "line_total": line_total
    }

discount_amount = subtotal * applied_config["discount_pct"]
tax_amount = (subtotal - discount_amount) * applied_config["vat_rate"]
grand_total = (subtotal - discount_amount) + tax_amount + applied_config["shipping_flat"]

print(f"\\nSubtotal:        ₦{subtotal:,.2f}")
print(f"Promo Discount: -₦{discount_amount:,.2f} ({int(applied_config['discount_pct']*100)}% off)")
print(f"VAT (7.5%):      ₦{tax_amount:,.2f}")
print(f"Shipping Fee:    ₦{applied_config['shipping_flat']:,.2f}")
print(f"Grand Total:     ₦{grand_total:,.2f}")
print(f"\\nVerified Items: {len(verified_items)}")
for sku, details in verified_items.items():
    print(f"  [{sku}] {details['name']} x{details['qty']} @ ₦{details['unit_price']:,} = ₦{details['line_total']:,}")

if rejected_items:
    print(f"\\nRejected Items ({len(rejected_items)}):")
    for sku, reason in rejected_items:
        print(f"  [{sku}] REJECTED: {reason}")

# 4. Invalidate Temporary Hold via popitem() LIFO
active_holds = {"HOLD-101": "USER_A", "HOLD-102": "USER_B", "HOLD-103": "USER_C"}
expired_hold = active_holds.popitem()
print(f"\\nEvicted Expired Hold (LIFO): {expired_hold}")
print(f"Remaining Active Holds: {list(active_holds.keys())}")`,
      targetOutput: `=== FLASH SALE CHECKOUT & INVENTORY AUDIT ===
Applied Checkout Config: {'vat_rate': 0.075, 'shipping_flat': 0.0, 'discount_pct': 0.1}

Subtotal:        ₦469,500.00
Promo Discount: -₦46,950.00 (10% off)
VAT (7.5%):      ₦31,691.25
Shipping Fee:    ₦0.00
Grand Total:     ₦454,241.25

Verified Items: 3
  [SKU-PHN-01] Infinix Zero 30 x2 @ ₦185,000.0 = ₦370,000.0
  [SKU-AUD-03] Oraimo FreePods 4 x3 @ ₦28,500.0 = ₦85,500.0
  [SKU-ACC-04] Fast Charger 65W x1 @ ₦14,000.0 = ₦14,000.0

Rejected Items (1):
  [SKU-UNKNOWN-99] REJECTED: SKU Not Found in Catalog

Evicted Expired Hold (LIFO): ('HOLD-103', 'USER_C')
Remaining Active Holds: ['HOLD-101', 'HOLD-102']`
    },
    {
      id: "day8-lab2",
      title: "Open Banking KYC Tiering & Multi-Source Credit Scoring Pipeline",
      description: "Implement an automated credit decision pipeline consuming heterogeneous customer profiles: extract multi-level nested customer KYC attributes with safe traversal, reconcile identity tokens using dict_keys set operations, compute debt-to-income and repayment ratios, and cascade regulatory risk policies using PEP 584 dictionary union operators.",
      domain: "Fintech Risk Engineering & Credit Scoring",
      starterCode: `# Real-World Lab 2: Open Banking KYC Tiering & Credit Scoring Pipeline

# 1. Multi-Tier Raw Customer Records from Central Bank API
customers_raw = {
    "CUST-001": {
        "profile": {"name": "Chidi Okonkwo", "bvn": "22233344455", "nin": "11122233344"},
        "kyc": {"tier": "TIER_3", "verified": True, "bvn_match": True},
        "financials": {"monthly_inflow": 850000.0, "active_loans_count": 0, "credit_history_months": 36},
    },
    "CUST-002": {
        "profile": {"name": "Halima Bello", "bvn": "33344455566"},
        "kyc": {"tier": "TIER_1", "verified": False},  # Incomplete KYC
        "financials": {"monthly_inflow": 120000.0, "active_loans_count": 2, "credit_history_months": 6},
    },
    "CUST-003": {
        "profile": {"name": "Babatunde Adebayo"},  # Missing KYC and financials
    }
}

# 2. Risk Policy Settings with Regional Regulatory Overrides (PEP 584 |)
base_risk_policy = {"min_history_months": 12, "max_active_loans": 1, "tier3_bonus": 150}
cbn_strict_overrides = {"min_history_months": 18, "max_active_loans": 0}
active_policy = base_risk_policy | cbn_strict_overrides

print("=== CREDIT SCORING PIPELINE EVALUATION ===")
print("Effective Risk Policy:", active_policy)

def safe_get(d, keys, fallback=None):
    curr = d
    for k in keys:
        if not isinstance(curr, dict) or k not in curr:
            return fallback
        curr = curr[k]
    return curr

scored_customers = {}

for cust_id, record in customers_raw.items():
    name = safe_get(record, ["profile", "name"], "Unknown")
    tier = safe_get(record, ["kyc", "tier"], "UNVERIFIED")
    verified = safe_get(record, ["kyc", "verified"], False)
    inflow = safe_get(record, ["financials", "monthly_inflow"], 0.0)
    loans = safe_get(record, ["financials", "active_loans_count"], 99)
    history = safe_get(record, ["financials", "credit_history_months"], 0)
    
    score = 300  # Base credit score
    if verified:
        score += 100
    if tier == "TIER_3":
        score += active_policy["tier3_bonus"]
    if history >= active_policy["min_history_months"]:
        score += 150
    if loans <= active_policy["max_active_loans"]:
        score += 100
    
    # Determine credit decision
    decision = "APPROVED" if score >= 650 else "REJECTED"
    scored_customers[cust_id] = {
        "name": name,
        "score": score,
        "tier": tier,
        "decision": decision
    }

print("\\nCredit Decision Results:")
for cid, res in scored_customers.items():
    print(f"  {cid} ({res['name']}): Score {res['score']} -> {res['decision']} [KYC: {res['tier']}]")

# 3. Two-Way Inverted Index (BVN -> Customer ID) using Dict Comprehension
bvn_index = {
    safe_get(rec, ["profile", "bvn"]): cid
    for cid, rec in customers_raw.items()
    if safe_get(rec, ["profile", "bvn"]) is not None
}
print(f"\\nInverted BVN Index ({len(bvn_index)} registered BVNs):")
for bvn, cid in bvn_index.items():
    print(f"  BVN {bvn} -> {cid}")`,
      targetOutput: `=== CREDIT SCORING PIPELINE EVALUATION ===
Effective Risk Policy: {'min_history_months': 18, 'max_active_loans': 0, 'tier3_bonus': 150}

Credit Decision Results:
  CUST-001 (Chidi Okonkwo): Score 800 -> APPROVED [KYC: TIER_3]
  CUST-002 (Halima Bello): Score 300 -> REJECTED [KYC: TIER_1]
  CUST-003 (Babatunde Adebayo): Score 300 -> REJECTED [KYC: UNVERIFIED]

Inverted BVN Index (2 registered BVNs):
  BVN 22233344455 -> CUST-001
  BVN 33344455566 -> CUST-002`
    }
  ],
  miniProject: {
    id: "day8-project",
    title: "OmniLedger: Real-Time Multi-Currency Core Banking Account Registry",
    brief: "Build an enterprise core banking account registry and multi-currency ledger engine that stores account state, supports safe key-value mutations, cascades hierarchical branch settings, and manages customer transactions using CPython dictionary primitives.",
    requirements: [
      "Model customer accounts as structured dictionaries with KYC, balances by currency, and transaction history.",
      "Implement safe balance operations (deposit, withdraw, transfer) using .get() and .setdefault() to eliminate KeyError risks.",
      "Cascade branch defaults and corporate customer tier configurations using modern PEP 584 union operators (| and |=).",
      "Construct and maintain bidirectional lookup indexes mapping national ID / BVN to internal account IDs using dictionary comprehensions.",
      "Provide audit reconciliation functions comparing active account keys against regulatory watchlists using dict_keys set algebra."
    ],
    rubric: [
      { criterion: "Data Modeling & Hashability Invariants", weight: 35 },
      { criterion: "Safe Retrieval, Mutation & Error Handling", weight: 40 },
      { criterion: "Dictionary Comprehensions & View Operations", weight: 25 }
    ],
    starterCode: `# OmniLedger: Real-Time Multi-Currency Core Banking Registry
# Day 8 Capstone Mini-Project Implementation

class OmniLedger:
    def __init__(self, institution_name="OmniBank Lagos"):
        self.institution = institution_name
        self.accounts = {}       # {account_id: account_dict}
        self.branch_defaults = {
            "overdraft_allowed": False,
            "daily_transfer_limit": 5000000.0,
            "currency": "NGN",
            "fee_rate": 0.005
        }

    def register_account(self, account_id, bvn, name, branch_overrides=None, initial_deposit=0.0):
        """Registers a new customer account, cascading branch config with defaults using PEP 584."""
        overrides = branch_overrides or {}
        # Merge configuration using PEP 584 union (|)
        config = self.branch_defaults | overrides
        
        self.accounts[account_id] = {
            "account_id": account_id,
            "bvn": bvn,
            "name": name,
            "config": config,
            "balances": {config["currency"]: float(initial_deposit)},
            "ledger": [("INITIAL_DEPOSIT", config["currency"], float(initial_deposit))] if initial_deposit > 0 else []
        }
        return self.accounts[account_id]

    def deposit(self, account_id, currency, amount):
        """Safely deposits funds using setdefault to initialize currency balances."""
        acc = self.accounts.get(account_id)
        if not acc:
            raise KeyError(f"Account {account_id} not found")
        
        # Initialize currency if absent using setdefault
        acc["balances"].setdefault(currency, 0.0)
        acc["balances"][currency] += amount
        acc["ledger"].append(("DEPOSIT", currency, amount))
        return acc["balances"][currency]

    def transfer(self, from_id, to_id, currency, amount):
        """Executes inter-account transfer with safe balance verification."""
        from_acc = self.accounts.get(from_id)
        to_acc = self.accounts.get(to_id)
        if not from_acc:
            raise KeyError(f"Source account {from_id} not found")
        if not to_acc:
            raise KeyError(f"Destination account {to_id} not found")

        curr_balance = from_acc["balances"].get(currency, 0.0)
        limit = from_acc["config"].get("daily_transfer_limit", 1000000.0)

        if amount > limit:
            return False, f"Transfer amount {amount} exceeds daily limit {limit}"
        if curr_balance < amount:
            return False, f"Insufficient funds: available {curr_balance} {currency}"

        # Atomic debit and credit
        from_acc["balances"][currency] -= amount
        from_acc["ledger"].append(("TRANSFER_OUT", currency, -amount, f"To: {to_id}"))

        to_acc["balances"].setdefault(currency, 0.0)
        to_acc["balances"][currency] += amount
        to_acc["ledger"].append(("TRANSFER_IN", currency, amount, f"From: {from_id}"))
        return True, "SUCCESS"

    def get_bvn_index(self):
        """Builds a reverse index mapping BVN -> Account ID using dict comprehension."""
        return {acc["bvn"]: acc_id for acc_id, acc in self.accounts.items() if acc.get("bvn")}

    def reconcile_with_watchlist(self, watchlist_bvns):
        """Leverages dict_keys set algebra to find intersecting watchlisted BVNs."""
        bvn_idx = self.get_bvn_index()
        # View set intersection between BVN keys and watchlist set
        overlap = bvn_idx.keys() & set(watchlist_bvns)
        return {bvn: bvn_idx[bvn] for bvn in overlap}


# === DEMONSTRATION & VERIFICATION RUN ===
if __name__ == "__main__":
    ledger = OmniLedger()
    print(f"Initialized {ledger.institution} Ledger Engine\\n")

    # 1. Register accounts with branch overrides
    ledger.register_account("ACC-101", "BVN-998877", "Adaeze Chukwu", {"daily_transfer_limit": 10000000.0}, initial_deposit=500000.0)
    ledger.register_account("ACC-102", "BVN-112233", "Olumide Bakare", initial_deposit=50000.0)
    print(f"Active Accounts Count: {len(ledger.accounts)}")

    # 2. Multi-currency deposits using setdefault()
    ledger.deposit("ACC-101", "USD", 2500.0)
    ledger.deposit("ACC-101", "NGN", 250000.0)
    print(f"ACC-101 Balances: {ledger.accounts['ACC-101']['balances']}")

    # 3. Inter-account transfer
    ok, msg = ledger.transfer("ACC-101", "ACC-102", "NGN", 150000.0)
    print(f"Transfer ACC-101 -> ACC-102: {msg}")
    print(f"ACC-101 NGN Balance: ₦{ledger.accounts['ACC-101']['balances']['NGN']:,.2f}")
    print(f"ACC-102 NGN Balance: ₦{ledger.accounts['ACC-102']['balances']['NGN']:,.2f}")

    # 4. Reverse BVN index
    bvn_map = ledger.get_bvn_index()
    print(f"\\nReverse BVN Index: {bvn_map}")

    # 5. Sanctions Watchlist Reconciliation using set algebra
    sanctioned = {"BVN-998877", "BVN-000000"}
    flagged = ledger.reconcile_with_watchlist(sanctioned)
    print(f"Watchlist Violations: {flagged}")
`
  },
  dayQuiz: {
    title: "Day 8 Comprehensive Mastery Quiz: Dictionaries & Hash Maps",
    passingScorePercentage: 80,
    questions: [
      {
        id: "d8-q1",
        scenario: "Dictionary Key Hashability Invariant",
        question: "What error is raised when executing `d = {}; d[['role', 'id']] = 'admin'`?",
        options: [
          {
            id: "q1-a",
            text: "TypeError: unhashable type: 'list' — because lists are mutable and do not implement __hash__.",
            explanation: "Correct! Python dict keys must be hashable and immutable across their lifetime. Lists are mutable and unhashable.",
            isCorrect: true
          },
          {
            id: "q1-b",
            text: "KeyError: ['role', 'id'] — because the key does not exist yet.",
            explanation: "Incorrect. Subscript assignment creates new keys; KeyError only occurs when accessing missing keys with d[k].",
            isCorrect: false
          },
          {
            id: "q1-c",
            text: "ValueError: cannot convert list to dictionary key.",
            explanation: "Incorrect. The error is TypeError, not ValueError.",
            isCorrect: false
          },
          {
            id: "q1-d",
            text: "IndexError: list index out of range.",
            explanation: "Incorrect. Dictionaries are associative mappings, not sequence indices.",
            isCorrect: false
          }
        ],
        points: 10
      },
      {
        id: "d8-q2",
        scenario: "Subscripting d[k] vs Defensive d.get(k, default)",
        question: "What is the key functional difference between `d['status']` and `d.get('status', 'PENDING')` when 'status' is absent?",
        options: [
          {
            id: "q2-a",
            text: "d['status'] raises a fatal KeyError, while .get('status', 'PENDING') suppresses the error and returns 'PENDING'.",
            explanation: "Correct! Direct bracket access requires the key to exist or it crashes with KeyError. .get() provides safe fallback retrieval.",
            isCorrect: true
          },
          {
            id: "q2-b",
            text: "d['status'] creates the key with value None, while .get() does not mutate the dict.",
            explanation: "Incorrect. Neither method inserts the key into the dictionary.",
            isCorrect: false
          },
          {
            id: "q2-c",
            text: "d['status'] executes in O(N) time while .get() executes in O(1) time.",
            explanation: "Incorrect. Both operations execute in O(1) average time.",
            isCorrect: false
          },
          {
            id: "q2-d",
            text: ".get() converts the value to a string automatically.",
            explanation: "Incorrect. .get() returns the exact stored object without type conversion.",
            isCorrect: false
          }
        ],
        points: 10
      },
      {
        id: "d8-q3",
        scenario: "CPython Compact Dict Architecture",
        question: "How does CPython 3.6+ achieve both a 20-30% memory reduction and guaranteed insertion order in dictionaries?",
        options: [
          {
            id: "q3-a",
            text: "By splitting the table into a sparse array of small integer indices (dk_indices) pointing into a dense, sequentially appended entries table (dk_entries).",
            explanation: "Correct! The compact dict design stores small byte/int indices in the sparse hash table, while entry rows (hash, key, val) are stored consecutively in insertion sequence in dk_entries.",
            isCorrect: true
          },
          {
            id: "q3-b",
            text: "By replacing hash tables with binary search trees.",
            explanation: "Incorrect. Dictionaries remain open-addressing hash tables.",
            isCorrect: false
          },
          {
            id: "q3-c",
            text: "By compressing all string keys using gzip compression in memory.",
            explanation: "Incorrect. Keys are not gzipped.",
            isCorrect: false
          },
          {
            id: "q3-d",
            text: "By converting all dictionaries to read-only tuples.",
            explanation: "Incorrect. Dictionaries remain fully mutable.",
            isCorrect: false
          }
        ],
        points: 10
      },
      {
        id: "d8-q4",
        scenario: "Overwriting an Existing Key and Insertion Order",
        question: "If `d = {'a': 1, 'b': 2}` and you execute `d['a'] = 99`, what happens to the position of 'a' in `list(d.keys())`?",
        options: [
          {
            id: "q4-a",
            text: "'a' remains at index 0 because updating an existing key mutates the value in-place in dk_entries without changing its position.",
            explanation: "Correct! In CPython's compact dict, overwriting updates the value pointer in the existing dk_entries row. The key does NOT move to the end.",
            isCorrect: true
          },
          {
            id: "q4-b",
            text: "'a' moves to the end of the dictionary, so keys become ['b', 'a'].",
            explanation: "Incorrect. Overwriting does not re-insert the key at the end.",
            isCorrect: false
          },
          {
            id: "q4-c",
            text: "The dictionary sorts its keys alphabetically.",
            explanation: "Incorrect. Dictionaries preserve insertion order, not sorted order.",
            isCorrect: false
          },
          {
            id: "q4-d",
            text: "Python raises a RuntimeError for mutating an established key.",
            explanation: "Incorrect. Overwriting existing keys is completely valid.",
            isCorrect: false
          }
        ],
        points: 10
      },
      {
        id: "d8-q5",
        scenario: "setdefault() Behavior on Existing Keys",
        question: "If `d = {'role': 'ADMIN'}` and you call `val = d.setdefault('role', 'GUEST')`, what will `val` and `d['role']` be?",
        options: [
          {
            id: "q5-a",
            text: "val is 'ADMIN' and d['role'] remains 'ADMIN' — setdefault never overwrites an existing key.",
            explanation: "Correct! If the key exists, setdefault() ignores the default argument and returns the currently stored value.",
            isCorrect: true
          },
          {
            id: "q5-b",
            text: "val is 'GUEST' and d['role'] becomes 'GUEST'.",
            explanation: "Incorrect. setdefault() only assigns the default if the key is absent.",
            isCorrect: false
          },
          {
            id: "q5-c",
            text: "Raises a KeyError because the key already exists.",
            explanation: "Incorrect. setdefault() never raises KeyError on valid keys.",
            isCorrect: false
          },
          {
            id: "q5-d",
            text: "val is None and d['role'] is deleted.",
            explanation: "Incorrect. setdefault() never deletes items.",
            isCorrect: false
          }
        ],
        points: 10
      },
      {
        id: "d8-q6",
        scenario: "Safe Key Eviction with pop(k, default)",
        question: "Why is `d.pop(token, None)` preferred over `del d[token]` when deleting unverified session tokens?",
        options: [
          {
            id: "q6-a",
            text: "Because d.pop(token, None) safely returns None if token is absent, whereas del d[token] crashes with a KeyError.",
            explanation: "Correct! Providing a default to pop() makes key deletion safe and idempotent, avoiding KeyError crashes.",
            isCorrect: true
          },
          {
            id: "q6-b",
            text: "Because del is deprecated in Python 3.10+.",
            explanation: "Incorrect. del is fully supported.",
            isCorrect: false
          },
          {
            id: "q6-c",
            text: "Because pop() is O(1) but del is O(N).",
            explanation: "Incorrect. Both operations execute in O(1) average time.",
            isCorrect: false
          },
          {
            id: "q6-d",
            text: "Because pop() zeroes out memory for security compliance.",
            explanation: "Incorrect. Python's garbage collector handles memory deallocation.",
            isCorrect: false
          }
        ],
        points: 10
      },
      {
        id: "d8-q7",
        scenario: "popitem() LIFO Semantics",
        question: "What does `d.popitem()` do in Python 3.7+?",
        options: [
          {
            id: "q7-a",
            text: "Removes and returns the most recently inserted (last) key-value pair as a 2-tuple (key, value).",
            explanation: "Correct! Since Python 3.7 guarantees insertion order, popitem() operates as a deterministic LIFO (last-in, first-out) stack pop.",
            isCorrect: true
          },
          {
            id: "q7-b",
            text: "Removes an arbitrary pseudo-random key-value pair.",
            explanation: "Incorrect. In Python 2 / early 3, popitem was arbitrary; since 3.7 it is strictly LIFO.",
            isCorrect: false
          },
          {
            id: "q7-c",
            text: "Removes the smallest key in sorted order.",
            explanation: "Incorrect. popitem() follows insertion sequence, not sorted order.",
            isCorrect: false
          },
          {
            id: "q7-d",
            text: "Removes and returns only the value of the first key.",
            explanation: "Incorrect. popitem() returns a (key, value) 2-tuple from the end of the dictionary.",
            isCorrect: false
          }
        ],
        points: 10
      },
      {
        id: "d8-q8",
        scenario: "PEP 584 Dictionary Merge Precedence",
        question: "What is the result of `{'a': 1, 'b': 2} | {'b': 99, 'c': 3}`?",
        options: [
          {
            id: "q8-a",
            text: "{'a': 1, 'b': 99, 'c': 3} — right-operand values take precedence for overlapping keys.",
            explanation: "Correct! PEP 584 specifies that the right-hand operand's values overwrite the left-hand operand's values for any shared keys.",
            isCorrect: true
          },
          {
            id: "q8-b",
            text: "{'a': 1, 'b': 2, 'c': 3} — left-operand values take precedence.",
            explanation: "Incorrect. The right-hand operand takes precedence.",
            isCorrect: false
          },
          {
            id: "q8-c",
            text: "{'b': 99} — the union operator performs an intersection.",
            explanation: "Incorrect. | performs a union, not an intersection.",
            isCorrect: false
          },
          {
            id: "q8-d",
            text: "TypeError: unsupported operand type for dict.",
            explanation: "Incorrect. PEP 584 added | and |= support for dictionaries in Python 3.9+.",
            isCorrect: false
          }
        ],
        points: 10
      },
      {
        id: "d8-q9",
        scenario: "Dynamic Dictionary Views Zero-Copy Reflection",
        question: "Why does iterating over `d.keys()` immediately reflect subsequent additions to `d` without calling `.keys()` again?",
        options: [
          {
            id: "q9-a",
            text: "dict_keys is a dynamic proxy view into the underlying hash table rather than a static copy list.",
            explanation: "Correct! Dictionary views maintain a reference to the dictionary itself, reading entries directly upon iteration with zero copying.",
            isCorrect: true
          },
          {
            id: "q9-b",
            text: "Python re-executes the script from the beginning when the dictionary changes.",
            explanation: "Incorrect. Python does not re-execute script code.",
            isCorrect: false
          },
          {
            id: "q9-c",
            text: "Views use shared memory sockets to sync with OS background processes.",
            explanation: "Incorrect. Views are standard in-process CPython objects.",
            isCorrect: false
          },
          {
            id: "q9-d",
            text: "d.keys() creates an immutable frozen snapshot that never changes.",
            explanation: "Incorrect. Views are dynamic and reflect dictionary mutations immediately.",
            isCorrect: false
          }
        ],
        points: 10
      },
      {
        id: "d8-q10",
        scenario: "Dictionary Comprehension Inversion Collisions",
        question: "Given `d = {'a': 1, 'b': 1, 'c': 2}`, what is the result of `{v: k for k, v in d.items()}`?",
        options: [
          {
            id: "q10-a",
            text: "{1: 'b', 2: 'c'} — because the duplicate value 1 for 'b' overwrote the earlier key 1 for 'a'.",
            explanation: "Correct! When inverting a dictionary with non-unique values, later keys with duplicate values overwrite earlier ones in the new dictionary.",
            isCorrect: true
          },
          {
            id: "q10-b",
            text: "{1: ['a', 'b'], 2: ['c']}.",
            explanation: "Incorrect. A naive dict comprehension does not automatically group values into lists.",
            isCorrect: false
          },
          {
            id: "q10-c",
            text: "ValueError: dictionary values must be unique to invert.",
            explanation: "Incorrect. Python does not check for value uniqueness during comprehension evaluation; overwriting happens silently.",
            isCorrect: false
          },
          {
            id: "q10-d",
            text: "{1: 'a', 2: 'c'} — the first key is always preserved.",
            explanation: "Incorrect. Python processes entries in insertion order; later entries overwrite earlier ones.",
            isCorrect: false
          }
        ],
        points: 10
      }
    ]
  },
  cheatSheet: [
    {
      category: "Dictionary Creation & Hashability Invariants",
      syntax: "d = {k: v} | d = dict(pairs) | d = dict.fromkeys(keys, val)",
      description: "Dictionaries map unique, immutable, and hashable keys (str, int, float, tuple, frozenset) to arbitrary values. Mutable types (list, dict, set) cannot be keys and raise TypeError: unhashable type. Empty dicts are created with {} or dict().",
      example: `# 1. Literals and constructor
user = {"id": 101, "name": "Amina", "active": True}
config = dict(host="localhost", port=8000)

# 2. Composite tuple keys (Valid)
routes = {("LOS", "ABV"): 45.0, ("LOS", "ACC"): 70.0}

# 3. Unhashable mutable keys (Fatal)
try:
    bad = {[1, 2]: "invalid"}
except TypeError as e:
    print("Rejected:", e)  # unhashable type: 'list'`
    },
    {
      category: "Safe vs Strict Value Access: Subscripts vs .get()",
      syntax: "val = d[key] | val = d.get(key, default=None)",
      description: "Direct subscripting d[k] accesses values in O(1) time but raises KeyError if the key is missing. Defensive retrieval d.get(k, default) returns the specified fallback (or None) if absent without crashing.",
      example: `profile = {"username": "kofi_m", "tier": "PRO"}

# Strict access (raises KeyError on missing)
tier = profile["tier"]

# Safe access with fallback
discount = profile.get("discount", 0.0)  # 0.0
role = profile.get("role")  # None`
    },
    {
      category: "Key Insertion, Mutation & Atomic Defaults with setdefault()",
      syntax: "d[key] = val | val = d.setdefault(key, default)",
      description: "d[k] = val inserts a new key or overwrites an existing value in-place. d.setdefault(k, default) checks if key exists: if present, it returns the existing value (no overwrite); if absent, it inserts key: default and returns default.",
      example: `wallet = {"balance": 50000.0}

# Direct overwrite
wallet["balance"] = 75000.0

# setdefault: Does not overwrite existing key!
b = wallet.setdefault("balance", 0.0)  # 75000.0

# setdefault: Inserts missing key
c = wallet.setdefault("currency", "NGN")  # 'NGN'

# Categorical grouping idiom
groups = {}
for cat, item in [("A", 1), ("B", 2), ("A", 3)]:
    groups.setdefault(cat, []).append(item)`
    },
    {
      category: "Key Eviction: del, pop(), popitem() & clear()",
      syntax: "del d[k] | val = d.pop(k, default) | pair = d.popitem() | d.clear()",
      description: "del d[k] strictly removes a key (KeyError if absent). d.pop(k, default) safely removes and returns the value or fallback. d.popitem() removes and returns the last inserted (key, value) pair in LIFO order (Python 3.7+). d.clear() empties the dict.",
      example: `cache = {"a": 1, "b": 2, "c": 3}

# Safe pop with fallback
val = cache.pop("z", None)  # Safe: returns None

# LIFO eviction (last inserted)
last_pair = cache.popitem()  # ('c', 3)

# Strict del
del cache["a"]

# Clear in-place
cache.clear()  # {}`
    },
    {
      category: "Merging & Updating: .update(), Unpacking & PEP 584 (| and |=)",
      syntax: "d.update(other) | merged = {**d1, **d2} | merged = d1 | d2 | d1 |= d2",
      description: "d.update(other) mutates d in-place and returns None. Double-star {**d1, **d2} unpacks and creates a new dict. Python 3.9+ PEP 584 operators: d1 | d2 creates a new combined dict (right operand overwrites left); d1 |= d2 mutates d1 in-place.",
      example: `base = {"env": "prod", "debug": False, "port": 8000}
override = {"debug": True, "port": 9000}

# PEP 584 Union (creates new dict)
active = base | override
print("Merged:", active)  # {'env': 'prod', 'debug': True, 'port': 9000}

# In-place augmented update
base |= {"timeout": 60}`
    },
    {
      category: "Dynamic View Objects & Set Operations on dict_keys",
      syntax: "d.keys() | d.values() | d.items() | k1 & k2 | k1 - k2 | k1 ^ k2",
      description: "Python 3 dictionary views are dynamic zero-copy windows into the underlying hash table that reflect dictionary mutations live. dict_keys views behave like mathematical sets, supporting intersection (&), difference (-), and symmetric difference (^).",
      example: `catalog_a = {"laptop": 5, "phone": 12, "charger": 20}
catalog_b = {"tablet": 8, "phone": 15, "charger": 10}

# Dynamic live reflection
keys_view = catalog_a.keys()
catalog_a["monitor"] = 2  # View updates automatically!

# Set operations on dict_keys
common = catalog_a.keys() & catalog_b.keys()      # {'phone', 'charger'}
exclusive = catalog_a.keys() ^ catalog_b.keys()   # {'laptop', 'monitor', 'tablet'}`
    },
    {
      category: "Nested Dictionaries & Safe Multi-Level Traversal",
      syntax: "d[outer][inner] | d.get(outer, {}).get(inner, default)",
      description: "Nested dictionaries model hierarchical JSON structures. Chained bracket access d[a][b] crashes if any parent key is missing. Defensive chaining d.get(a, {}).get(b, default) prevents crashes by using empty dictionary fallbacks.",
      example: `customer = {
    "id": "C-101",
    "kyc": {"tier": "TIER_3", "address": {"city": "Lagos"}}
}

# Deep safe retrieval
city = customer.get("kyc", {}).get("address", {}).get("city", "Unknown")

# The None Trap: if kyc is None, customer.get('kyc', {}) returns None!
# Safe helper:
def deep_get(d, keys, default=None):
    curr = d
    for k in keys:
        if not isinstance(curr, dict) or k not in curr:
            return default
        curr = curr[k]
    return curr`
    },
    {
      category: "Dictionary Comprehensions & Inversion Strategies",
      syntax: "{k_expr: v_expr for item in iter if cond} | {v: k for k, v in d.items()}",
      description: "Dictionary comprehensions provide concise expressions to transform, filter, and invert mappings in a single line. When inverting with {v: k for k, v in d.items()}, ensure values are hashable; non-unique values will collapse to the last key processed.",
      example: `rates = {"USD": 1.0, "EUR": 0.92, "GBP": 0.79, "KES": 130.0}

# 1. Transform and filter
strong_currencies = {curr: rate for curr, rate in rates.items() if rate < 2.0}

# 2. Reverse lookup index (Inversion)
user_to_id = {"ada": 101, "kofi": 102, "bello": 103}
id_to_user = {uid: name for name, uid in user_to_id.items()}`
    },
    {
      category: "CPython Compact Dict Architecture & Insertion Order Guarantees",
      syntax: "sys.getsizeof(d) | list(d.keys()) | dk_indices -> dk_entries",
      description: "CPython 3.6+ split-table architecture stores a compact sparse array of small 1-byte indices (dk_indices) referencing dense 24-byte entry rows (dk_entries: hash, key, val) appended in sequence. This delivers 20-30% memory savings and guarantees deterministic insertion order (language standard in Python 3.7+). Overwriting an existing key mutates its value in-place without altering its slot in dk_entries.",
      example: `# 1. Insertion order is preserved
event_log = {"INIT": 1, "LOGIN": 2, "FETCH": 3}
print("Keys order:", list(event_log.keys()))  # ['INIT', 'LOGIN', 'FETCH']

# 2. In-place overwrite maintains position
event_log["INIT"] = 99
print("Overwritten order:", list(event_log.keys()))  # ['INIT', 'LOGIN', 'FETCH']

# 3. New key appends to the end
event_log["LOGOUT"] = 4
print("Appended order:", list(event_log.keys()))     # ['INIT', 'LOGIN', 'FETCH', 'LOGOUT']`
    },
    {
      category: "Lookup Time Complexity: O(1) Key Probes vs O(N) Value Scans",
      syntax: "k in d (O(1) Average) | v in d.values() (O(N) Linear)",
      description: "Key lookups (k in d, d[k], d.get(k)) execute in O(1) average time by computing hash(k) & mask to jump directly to table buckets. In contrast, value lookups (v in d.values()) require a sequential linear scan (O(N)) because Python hash tables only index keys, never values.",
      example: `# 1. Fast O(1) key membership test
users = {"UID_101": "Ada", "UID_102": "Kofi", "UID_103": "Bello"}
is_registered = "UID_102" in users  # O(1) instantaneous probe

# 2. Linear O(N) value scan
has_name = "Kofi" in users.values()  # O(N) iterates every value

# 3. Fast two-way lookup via reverse index
id_lookup = {name: uid for uid, name in users.items()}
is_registered_fast = "Kofi" in id_lookup  # O(1) via inverted index!`
    }
  ],
  sourceNotes: [
    "Source attribution: Asabeneh Yetayeh's '30 Days of Python' (Day 8 - Dictionaries).",
    "Covers dictionary creation, key hashability, CPython compact dict architecture, safe retrieval vs d[k], setdefault, pop/del/clear, update/merge operators, views, nested JSON structures, and dict comprehensions."
  ]
};

