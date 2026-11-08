import { DayModule } from '../../engine/lesson/types';

export const DAY_7_MODULE: DayModule = {
  schemaVersion: 1,
  number: 7,
  title: "Sets",
  level: "beginner",
  sourceUrl: "https://github.com/Asabeneh/30-Days-Of-Python/tree/master/07_Day_Sets",
  estimatedMinutes: 65,
  prerequisites: [1, 2, 3, 4, 5, 6],
  objectives: [
    "Understand sets as unordered collections of distinct, hashable objects backed by open-addressing hash tables",
    "Master set literal syntax {x, y} and overcome the critical empty set pitfall (empty = set(), not {})",
    "Leverage O(1) constant-time membership testing (x in s) over linear O(N) sequence scans",
    "Execute automatic deduplication patterns across strings, lists, and ranges (set() and list(set()))",
    "Dynamically modify set contents using add() for single items and update() for multi-iterable expansion",
    "Safely remove elements distinguishing strict remove() (KeyError) from idempotent discard(), pop(), and clear()",
    "Calculate mathematical unions (| / union()) and intersections (& / intersection()) across datasets",
    "Compute set differences (- / difference()) and symmetric differences (^ / symmetric_difference())",
    "Evaluate relational predicates: issubset() (<=), issuperset() (>=), isdisjoint(), and set equality (==)",
    "Harness frozenset() to construct immutable, hashable sets suitable as dictionary keys and set elements"
  ],
  subtopics: [
    {
      id: "day7-sub1",
      number: 1,
      title: "Set Creation, Syntax & The Empty Dict Pitfall",
      summary: "Master set literal syntax, explore homogeneous and heterogeneous elements, and understand why {} constructs an empty dict rather than a set.",
      estimatedMinutes: 7,
      introduce: {
        headline: "Curly Braces vs set(): The Empty Dictionary Trap",
        paragraphs: [
          "A set in Python is an unordered, mutable collection of unique, hashable items. Unlike lists and tuples, sets do NOT record element position or insertion order, and they forbid duplicate entries.",
          "Populated sets are constructed using curly braces containing comma-separated items: fruits = {'apple', 'banana', 'orange'}. Elements can be heterogeneous—integers, floats, strings, booleans, and tuples can coexist in the same set.",
          "The Critical Pitfall: In Python, an empty pair of curly braces {} creates an empty dictionary (dict), NOT an empty set! Because dictionaries were introduced to Python before sets, {} was historically reserved for empty mappings.",
          "To construct an empty set, you MUST call the built-in constructor set() with no arguments: empty_set = set(). Calling type({}) returns <class 'dict'>, while type(set()) returns <class 'set'>."
        ],
        keyTerms: [
          {
            term: "Set",
            definition: "An unordered collection of unique, hashable elements with no duplicate entries."
          },
          {
            term: "Empty Dict Trap",
            definition: "Writing {} creates an empty dict; an empty set must be instantiated using set()."
          },
          {
            term: "Hashable",
            definition: "An object with a fixed hash value across its lifetime (immutable objects like int, str, tuple)."
          },
          {
            term: "set()",
            definition: "The built-in constructor used to create an empty set or convert an iterable to a set."
          }
        ],
        bulletPoints: [
          "Populated sets use curly braces: s = {1, 2, 3}.",
          "Empty sets MUST use set(); writing {} creates a dictionary (dict).",
          "Set elements must be immutable and hashable; lists and dicts cannot be set members.",
          "Sets are unordered: items do not have positional indices (s[0] raises TypeError)."
        ]
      },
      visualise: {
        type: "hash-set-table-inspector",
        title: "Set Hash Table Inspector",
        badge: "simulation",
        description: "Observe how Python hashes elements into bucket slots and why empty braces {} default to dict.",
        initialConfig: {
          mode: "creation"
        }
      },
      code: [
        {
          title: "Creating Sets & Avoiding the Empty Dict Trap",
          runMode: "real",
          code: "# 1. The Empty Dict Ambiguity Trap!\nempty_mapping = {}\nempty_set = set()\nprint(\"type({})     ->\", type(empty_mapping))\nprint(\"type(set()) ->\", type(empty_set))\n\n# 2. Populated set with curly braces\ntech_stack = {\"Python\", \"TypeScript\", \"Docker\", \"PostgreSQL\"}\nprint(\"Tech stack: \", tech_stack)\nprint(\"Set length: \", len(tech_stack))\n\n# 3. Heterogeneous hashable items\nmixed_set = {42, 3.14, \"Lagos\", True, (9.0820, 8.6753)}\nprint(\"Heterogeneous set:\", mixed_set)\n\n# 4. Sets reject mutable elements (lists/dicts)\ntry:\n    invalid_set = {[1, 2, 3]}\nexcept TypeError as err:\n    print(\"Rejected mutable list:\", err)",
          expectedOutput: "type({})     -> <class 'dict'>\ntype(set()) -> <class 'set'>\nTech stack:  {'Docker', 'PostgreSQL', 'Python', 'TypeScript'}\nSet length:  4\nHeterogeneous set: {3.14, 42, True, 'Lagos', (9.082, 8.6753)}\nRejected mutable list: unhashable type: 'list'"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: "empty_mapping = {}",
          internalEffect: "Python bytecode allocates an empty PyDictObject; {} is reserved for dictionary literal grammar."
        },
        {
          step: 2,
          codeLine: 3,
          instruction: "empty_set = set()",
          internalEffect: "Invokes built-in set() constructor, allocating an 8-slot empty PySetObject."
        },
        {
          step: 3,
          codeLine: 8,
          instruction: "tech_stack = {\"Python\", ...}",
          internalEffect: "Computes 64-bit hashes for strings, assigns bucket slots, and discards any duplicate keys."
        },
        {
          step: 4,
          codeLine: 18,
          instruction: "invalid_set = {[1, 2, 3]}",
          internalEffect: "List is mutable; calling hash([1, 2, 3]) triggers TypeError: unhashable type: 'list'."
        }
      ],
      apply: {
        domain: "Cybersecurity & Identity Access Management (IAM)",
        contextTitle: "Active User Session Token Blacklist",
        scenario: "Maintaining a fast memory-resident blacklist of revoked JSON Web Tokens (JWT) for Lagos fintech authentication gateways."
      },
      commonMistakes: [
        {
          label: "Using {} to Initialize an Empty Set",
          explanation: "{} creates an empty dict. Calling set methods like .add() on {} raises AttributeError: 'dict' object has no attribute 'add'.",
          erroneousCode: "active_ips = {}\nactive_ips.add(\"192.168.1.1\")  # AttributeError!",
          correctedCode: "active_ips = set()\nactive_ips.add(\"192.168.1.1\")  # Valid set insertion"
        }
      ],
      sourceNotes: "Derived from Asabeneh's 30 Days of Python: Day 7 Sets (Creating a Set, Getting Set's Length).",
      practise: [
        {
          id: "d7-s1-ex1",
          title: "Identify Empty Set Syntax vs Empty Dictionary",
          type: "scenario-mcq",
          tier: "foundation",
          points: 10,
          contextScenario: "Payment Gateway Token Cache, Lagos",
          prompt: "A developer writes `revoked_tokens = {}` intending to create an empty set of revoked tokens. What is the actual type of `revoked_tokens` in Python?",
          options: [
            {
              id: "opt-1",
              text: "dict (dictionary)",
              explanation: "Correct! Empty curly braces {} denote an empty dictionary for historical backward compatibility. An empty set MUST be created using set().",
              isCorrect: true
            },
            {
              id: "opt-2",
              text: "set",
              explanation: "Incorrect. In Python, {} creates an empty dict, not a set.",
              isCorrect: false
            },
            {
              id: "opt-3",
              text: "tuple",
              explanation: "Incorrect. Empty tuples are created with () or tuple().",
              isCorrect: false
            },
            {
              id: "opt-4",
              text: "SyntaxError",
              explanation: "Incorrect. {} is completely valid syntax that creates an empty dictionary.",
              isCorrect: false
            }
          ],
          hints: [
            "Dictionaries were introduced into Python before sets existed.",
            "Curly braces with key:value pairs make dicts; curly braces with lone items make sets.",
            "When curly braces are completely empty, Python defaults to dict."
          ]
        },
        {
          id: "d7-s1-ex2",
          title: "Fill Gaps: Set Constructor and Literal Grammar",
          type: "fill-the-gaps",
          tier: "standard",
          points: 15,
          contextScenario: "Fintech Security Gateway",
          prompt: "Fill in the gaps to create an empty set of blacklisted IP addresses and a populated set of Nigerian currency codes.",
          gaps: [
            {
              id: "g1",
              beforeText: "blacklisted_ips = ",
              afterText: "()",
              correctAnswer: "set",
              options: ["set", "dict", "list", "tuple"]
            },
            {
              id: "g2",
              beforeText: "currency_codes = ",
              afterText: "'NGN', 'USD', 'GBP'}",
              correctAnswer: "{",
              options: ["{", "(", "[", "<"]
            }
          ],
          hints: [
            "An empty set requires calling the built-in constructor with parentheses.",
            "Populated sets are enclosed in curly braces {}.",
            "Writing {} creates a dictionary, so use set() for empty containers."
          ]
        }
      ]
    },
    {
      id: "day7-sub2",
      number: 2,
      title: "Hash Table Architecture & O(1) Fast Membership Testing",
      summary: "Explore the CPython PySetObject hash table, hash bitmasking, and why the 'in' operator achieves O(1) time complexity compared to O(N) lists.",
      estimatedMinutes: 8,
      introduce: {
        headline: "CPython PySetObject: Hash-Indexed Buckets & Instant Lookups",
        paragraphs: [
          "In CPython, a set is implemented as an open-addressing hash table (PySetObject). When an element is tested or stored, Python computes its 64-bit integer hash using hash(obj) and maps it to a bucket index using bitmasking: index = hash & mask.",
          "Because bucket index lookup takes constant arithmetic time, verifying whether an element exists in a set (item in my_set) runs in O(1) average time complexity!",
          "In stark contrast, testing membership in a list or tuple (item in my_list) requires a linear scan from index 0 to len - 1, running in O(N) time. For 1,000,000 items, a set performs the lookup in nanoseconds, while a list requires up to a million pointer comparisons.",
          "When two items share the same bucket index (a collision), CPython resolves it using a perturbation probe sequence: j = ((5 * j) + 1 + perturb) & mask. The table automatically resizes when it becomes 2/3 full to maintain O(1) performance."
        ],
        keyTerms: [
          {
            term: "PySetObject",
            definition: "The internal C structure representing a Python set containing a hash table of PySetEntry slots."
          },
          {
            term: "O(1) Time Complexity",
            definition: "Constant execution time that does not increase regardless of how large the collection grows."
          },
          {
            term: "Hash Collision",
            definition: "Occurs when two distinct objects produce identical bucket indices; resolved via perturbation probing."
          },
          {
            term: "Membership Test",
            definition: "The 'in' and 'not in' operators that check for element existence inside a container."
          }
        ],
        bulletPoints: [
          "Sets offer O(1) average lookup time via hash table bucket direct indexing.",
          "Lists and tuples require O(N) linear iteration for membership checks.",
          "Items must have an immutable, fixed hash value across their entire lifetime.",
          "Unordered nature: set elements do not support indexing s[i] or slicing s[a:b]."
        ]
      },
      visualise: {
        type: "hash-set-table-inspector",
        title: "Hash Table Bucket & Probe Inspector",
        badge: "simulation",
        description: "Inspect the 8-bucket CPython array, hash bitmasks, and collision probe steps.",
        initialConfig: {
          mode: "membership"
        }
      },
      code: [
        {
          title: "O(1) Fast Membership Testing vs O(N) Linear Search",
          runMode: "real",
          code: "# 1. Fast Membership testing with 'in' and 'not in'\nallowed_roles = {\"ADMIN\", \"AUDITOR\", \"TREASURY_OFFICER\"}\n\nuser_role = \"TREASURY_OFFICER\"\nprint(f\"Is '{user_role}' authorized?\", user_role in allowed_roles)\nprint(f\"Is 'GUEST' forbidden?        \", \"GUEST\" not in allowed_roles)\n\n# 2. Sets are unindexed and unsliceable\ntry:\n    first_role = allowed_roles[0]\nexcept TypeError as err:\n    print(\"Direct indexing rejected:\", err)\n\n# 3. Iteration over a set (order is non-deterministic)\nprint(\"\\nIterating through authorized roles:\")\nfor role in allowed_roles:\n    print(\" - Role:\", role)",
          expectedOutput: "Is 'TREASURY_OFFICER' authorized? True\nIs 'GUEST' forbidden?         True\nDirect indexing rejected: 'set' object is not subscriptable\n\nIterating through authorized roles:\n - Role: ADMIN\n - Role: AUDITOR\n - Role: TREASURY_OFFICER"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: "allowed_roles = {\"ADMIN\", ...}",
          internalEffect: "Allocates PySetObject with 8 buckets. Inserts hashes for 'ADMIN', 'AUDITOR', 'TREASURY_OFFICER'."
        },
        {
          step: 2,
          codeLine: 5,
          instruction: "user_role in allowed_roles",
          internalEffect: "Evaluates hash('TREASURY_OFFICER') & mask, checks bucket directly, finds pointer match in O(1)."
        },
        {
          step: 3,
          codeLine: 10,
          instruction: "first_role = allowed_roles[0]",
          internalEffect: "Raises TypeError because PySetObject does not implement the __getitem__ sequence protocol."
        },
        {
          step: 4,
          codeLine: 16,
          instruction: "for role in allowed_roles:",
          internalEffect: "Traverses populated buckets from index 0 to mask, yielding items in hash table storage order."
        }
      ],
      apply: {
        domain: "Fintech Risk & Sanctions Screening",
        contextTitle: "High-Frequency Sanctioned Entity Check",
        scenario: "Screening incoming Swift and NIBSS wire transfers against OFAC and CBN sanctioned entity sets in under 1 millisecond."
      },
      commonMistakes: [
        {
          label: "Attempting Positional Subscripting on a Set",
          explanation: "Sets are unordered collections and do not support 0-based indices. Accessing s[0] raises TypeError: 'set' object is not subscriptable.",
          erroneousCode: "s = {\"alpha\", \"beta\", \"gamma\"}\nfirst = s[0]  # TypeError!",
          correctedCode: "s = {\"alpha\", \"beta\", \"gamma\"}\nfirst = next(iter(s))  # Gets an arbitrary element, or convert with list(s)"
        }
      ],
      sourceNotes: "Derived from Asabeneh's 30 Days of Python: Day 7 Sets (Checking an Item in a Set).",
      practise: [
        {
          id: "d7-s2-ex1",
          title: "O(1) Hash Table Lookup vs O(N) Sequence Scan",
          type: "theory-reasoning",
          tier: "foundation",
          points: 10,
          contextScenario: "High-Throughput Card Payment Switch",
          prompt: "Explain why checking `card_token in blacklist_set` takes O(1) constant time, while `card_token in blacklist_list` takes O(N) linear time for 1,000,000 records.",
          modelAnswer: "A set is backed by an internal CPython hash table (PySetObject). When checking 'item in set', Python computes hash(item) & mask to jump directly to the target bucket index in constant arithmetic time O(1). In contrast, a list is a contiguous pointer array without an index by value; Python must linearly compare item against index 0, 1, 2 ... up to N-1, requiring O(N) pointer equality checks.",
          markingCriteria: [
            { id: "c1", label: "Mentions hash table bucket indexing for sets (O(1))", points: 5 },
            { id: "c2", label: "Mentions linear sequential scanning for lists (O(N))", points: 5 }
          ],
          hints: [
            "Think about how direct bucket indexing compares to looping through an array.",
            "What does hash(x) & mask compute in arithmetic steps?",
            "What must a list do when searching for an element at the very end?"
          ]
        },
        {
          id: "d7-s2-ex2",
          title: "Predict Output: Subscripting a Set",
          type: "predict-output",
          tier: "standard",
          points: 15,
          contextScenario: "API Route Dispatcher",
          prompt: "What will happen when running this code: `routes = {'/login', '/logout'}; print(routes[0])`?",
          options: [
            {
              id: "opt-1",
              text: "TypeError: 'set' object is not subscriptable",
              explanation: "Correct! Sets are unordered collections backed by hash tables; they do not implement __getitem__ and have no 0-based indices.",
              isCorrect: true
            },
            {
              id: "opt-2",
              text: "'/login'",
              explanation: "Incorrect. Sets do not maintain positional order, and direct index access s[0] is forbidden.",
              isCorrect: false
            },
            {
              id: "opt-3",
              text: "IndexError: set index out of range",
              explanation: "Incorrect. Python raises TypeError for unscriptable types, not IndexError.",
              isCorrect: false
            },
            {
              id: "opt-4",
              text: "None",
              explanation: "Incorrect. An exception is immediately raised.",
              isCorrect: false
            }
          ],
          hints: [
            "Do sets store elements at consecutive integer offsets like lists and tuples?",
            "What error does Python raise when you try to use [0] on an unindexed container?",
            "The error begins with 'TypeError: 'set' object is not...'."
          ]
        }
      ]
    },
    {
      id: "day7-sub3",
      number: 3,
      title: "Automatic Deduplication & Sequence Conversion Strategies",
      summary: "Understand how sets enforce unique element invariants, how duplicate items collapse, and how to convert between lists, tuples, strings, and sets.",
      estimatedMinutes: 7,
      introduce: {
        headline: "The Uniqueness Invariant: Deduplication via set() and list(set())",
        paragraphs: [
          "The defining characteristic of a set is element uniqueness: no element may appear more than once. When you construct a set with duplicate values—e.g. {1, 2, 2, 3, 3, 3}—Python evaluates each item's hash and silently ignores duplicates, leaving only {1, 2, 3}.",
          "Passing any iterable sequence to the set() constructor automatically deduplicates its contents: set([1, 2, 1, 3, 2]) produces {1, 2, 3}. When passed a string, set('banana') produces {'a', 'b', 'n'}.",
          "The Idiomatic Deduplication Pattern: To eliminate duplicates from a list, developers frequently write unique_list = list(set(raw_list)).",
          "Crucial Trade-off: Converting a list to a set strips the original sequence order! If preserving insertion order is mandatory, use list(dict.fromkeys(raw_list)) in Python 3.7+ instead."
        ],
        keyTerms: [
          {
            term: "Deduplication",
            definition: "The removal of repeated or redundant copies of identical data items from a collection."
          },
          {
            term: "Uniqueness Invariant",
            definition: "The mathematical rule that every element in a set occurs exactly once."
          },
          {
            term: "list(set(seq))",
            definition: "The standard Python idiom for rapid deduplication when element order does not matter."
          },
          {
            term: "dict.fromkeys()",
            definition: "An alternative deduplication method that preserves original sequence insertion order."
          }
        ],
        bulletPoints: [
          "Sets enforce strict uniqueness: duplicates are collapsed silently during insertion.",
          "set(iterable) converts strings, lists, tuples, or ranges into a deduplicated set.",
          "list(set(items)) strips duplicates in O(N) time but loses original ordering.",
          "Converting a set back to a list produces an arbitrarily ordered sequence."
        ]
      },
      visualise: {
        type: "hash-set-table-inspector",
        title: "Deduplication & Duplicate Collision Inspector",
        badge: "simulation",
        description: "Watch duplicate entries get rejected when inserting into already occupied matching hash buckets.",
        initialConfig: {
          mode: "dedup"
        }
      },
      code: [
        {
          title: "Deduplicating Sequences with set() and Sequence Conversion",
          runMode: "real",
          code: "# 1. Literal deduplication on construction\nraw_tags = {\"python\", \"fastapi\", \"docker\", \"python\", \"docker\", \"redis\"}\nprint(\"Deduplicated tag set:\", raw_tags)\nprint(\"Unique tag count:     \", len(raw_tags))\n\n# 2. Deduplicating a list of customer phone numbers\nraw_phones = [\"08011112222\", \"08033334444\", \"08011112222\", \"08055556666\", \"08033334444\"]\nunique_phones = list(set(raw_phones))\nprint(\"\\nOriginal count:\", len(raw_phones))\nprint(\"Unique phones: \", unique_phones)\n\n# 3. String deduplication: decomposing unique letters\nalphabet_sample = set(\"mississippi\")\nprint(\"\\nUnique characters in 'mississippi':\", sorted(alphabet_sample))\n\n# 4. Converting sets to sorted lists\nsorted_tags = sorted(raw_tags)\nprint(\"Sorted tags list:\", sorted_tags)",
          expectedOutput: "Deduplicated tag set: {'fastapi', 'redis', 'docker', 'python'}\nUnique tag count:      4\n\nOriginal count: 5\nUnique phones:  ['08011112222', '08033334444', '08055556666']\n\nUnique characters in 'mississippi': ['i', 'm', 'p', 's']\nSorted tags list: ['docker', 'fastapi', 'python', 'redis']"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: "raw_tags = {\"python\", ...}",
          internalEffect: "Python hashes each string literal. When 'python' is encountered a second time, key equality check finds existing entry and skips insertion."
        },
        {
          step: 2,
          codeLine: 8,
          instruction: "unique_phones = list(set(raw_phones))",
          internalEffect: "Constructs PySetObject in O(N) time collapsing duplicate phone numbers, then unpacks into a new PyListObject."
        },
        {
          step: 3,
          codeLine: 13,
          instruction: "alphabet_sample = set(\"mississippi\")",
          internalEffect: "Iterates through string characters; 11 letters collapse down to 4 unique characters ('i', 'm', 'p', 's')."
        },
        {
          step: 4,
          codeLine: 17,
          instruction: "sorted_tags = sorted(raw_tags)",
          internalEffect: "sorted() iterates over the set and returns a new ascending ordered list of strings."
        }
      ],
      apply: {
        domain: "Marketing Analytics & SMS Broadcasts",
        contextTitle: "Bulk SMS Recipient List Sanitization",
        scenario: "Deduplicating 500,000 raw subscriber phone numbers before triggering high-volume bulk SMS campaigns to avoid redundant telecom charges."
      },
      commonMistakes: [
        {
          label: "Expecting list(set(lst)) to Maintain Sequence Order",
          explanation: "Hash table bucket layout scrambles insertion order. If order preservation is required, use list(dict.fromkeys(lst)) instead.",
          erroneousCode: "items = [\"first\", \"second\", \"third\", \"first\"]\nordered_unique = list(set(items))  # Order is lost!",
          correctedCode: "items = [\"first\", \"second\", \"third\", \"first\"]\nordered_unique = list(dict.fromkeys(items))  # Preserves ['first', 'second', 'third']"
        }
      ],
      sourceNotes: "Derived from Asabeneh's 30 Days of Python: Day 7 Sets (Set Conversion & Uniqueness).",
      practise: [
        {
          id: "d7-s3-ex1",
          title: "Write Code: Deduplicate and Sort Customer Transaction Channels",
          type: "write-code",
          tier: "standard",
          points: 15,
          contextScenario: "Banking Omnichannel Analytics, Lagos",
          prompt: "Write a function `deduplicate_channels(channels)` that accepts a list of raw transaction channel strings (which contains duplicates), deduplicates them using a set, and returns a new list sorted in ascending alphabetical order.",
          starterCode: "def deduplicate_channels(channels):\n    # TODO: Deduplicate channels using set() and return sorted list\n    pass",
          solutionCode: "def deduplicate_channels(channels):\n    return sorted(set(channels))",
          testCases: [
            {
              id: "tc1",
              label: "Multiple duplicate channels",
              setup: "channels = ['USSD', 'POS', 'ATM', 'WEB', 'POS', 'USSD']",
              expected: "['ATM', 'POS', 'USSD', 'WEB']",
              hidden: false
            },
            {
              id: "tc2",
              label: "All identical items",
              setup: "channels = ['USSD', 'USSD', 'USSD']",
              expected: "['USSD']",
              hidden: false
            }
          ],
          hints: [
            "Convert the list to a set with set(channels) to collapse duplicates in O(N).",
            "Use the sorted() built-in function to return a sorted list from the set.",
            "A single line: return sorted(set(channels))."
          ]
        },
        {
          id: "d7-s3-ex2",
          title: "Explain the Trace: Deduplication and Order Scrambling",
          type: "explain-the-trace",
          tier: "challenge",
          points: 20,
          contextScenario: "Audit Trail Sanitization",
          prompt: "Analyze what happens to memory and element order when executing `raw = [30, 10, 20, 10, 30]; unique = list(set(raw))`.",
          traceStepCode: "raw = [30, 10, 20, 10, 30]\ns = set(raw)\nunique = list(s)",
          traceQuestion: "Why is the element order in 'unique' not guaranteed to be [30, 10, 20]?",
          modelAnswer: "When set(raw) is evaluated, CPython constructs an internal PySetObject hash table. Elements 30, 10, and 20 are placed into bucket slots based on their hash values (hash(x) & mask) and collision resolution probes. When list(s) is subsequently called, it iterates through the hash table buckets from index 0 upward, yielding elements in hash table slot order rather than the original insertion order.",
          markingCriteria: [
            { id: "c1", label: "Explains placement into hash table buckets based on hash values", points: 10 },
            { id: "c2", label: "Explains iteration over buckets from 0 upward destroying insertion order", points: 10 }
          ],
          hints: [
            "Sets do not record the order in which items were appended.",
            "What determines the slot where an integer is stored in a hash table?",
            "How does converting a set back to a list read items out of memory?"
          ]
        }
      ]
    },
    {
      id: "day7-sub4",
      number: 4,
      title: "Dynamic Set Modification: add() and update()",
      summary: "Learn how to expand sets using add() for single elements and update() for multi-iterable expansion, and distinguish string splitting behavior.",
      estimatedMinutes: 7,
      introduce: {
        headline: "Growing Sets: Single Item add() vs Multi-Iterable update()",
        paragraphs: [
          "Unlike immutable tuples and frozensets, standard Python sets are dynamic and mutable. You can add elements at runtime using two primary methods: add() and update().",
          "The add(item) method inserts a single hashable element into the set. If the element is already present, add() silently does nothing and returns None. It does NOT unpack iterables.",
          "The update(*iterables) method (and the in-place union operator |=) takes one or more iterables (lists, tuples, sets, strings, dicts) and inserts all their constituent elements into the set.",
          "The Classic String Trap: Calling s.add('apple') adds the complete string 'apple' as a single element. Calling s.update('apple') treats the string as an iterable of characters and inserts 'a', 'p', 'l', 'e' individually!"
        ],
        keyTerms: [
          {
            term: "add()",
            definition: "Mutating set method that inserts a single element into the set in-place."
          },
          {
            term: "update()",
            definition: "Mutating set method that accepts one or more iterables and unpacks all their elements into the set."
          },
          {
            term: "|=",
            definition: "In-place union assignment operator; equivalent to s.update(other_set)."
          },
          {
            term: "String Unpacking Trap",
            definition: "Passing a string to update() unpacks individual characters rather than the complete word."
          }
        ],
        bulletPoints: [
          "s.add(x) adds exactly ONE element; raises TypeError if x is mutable/unhashable.",
          "s.update(iter1, iter2) unpacks multiple collections into s in-place.",
          "s.add('cat') yields {'cat'}; s.update('cat') yields {'c', 'a', 't'}.",
          "Both methods return None; do not assign s = s.add(x) or s becomes None."
        ]
      },
      visualise: {
        type: "venn-diagram-simulator",
        title: "Dynamic Set Mutation Simulator",
        badge: "simulation",
        description: "Watch sets dynamically incorporate new members and iterables through add() and update().",
        initialConfig: {
          mode: "mutation"
        }
      },
      code: [
        {
          title: "Expanding Sets with add() and update()",
          runMode: "real",
          code: "# 1. Inserting single elements with add()\nactive_nodes = {\"node-01\", \"node-02\"}\nactive_nodes.add(\"node-03\")\nactive_nodes.add(\"node-01\")  # Duplicate: silently ignored\nprint(\"Nodes after add():\", active_nodes)\n\n# 2. Multi-collection expansion with update()\nbackup_nodes = [\"node-04\", \"node-05\"]\nfailover_nodes = (\"node-06\", \"node-02\")\nactive_nodes.update(backup_nodes, failover_nodes)\nprint(\"Nodes after update():\", active_nodes)\n\n# 3. The String Trap: add() vs update()\nset_a = set()\nset_b = set()\nset_a.add(\"LAGOS\")\nset_b.update(\"LAGOS\")\nprint(\"\\nadd('LAGOS'):   \", set_a)\nprint(\"update('LAGOS'):\", set_b)\n\n# 4. In-place union operator |=\nextra_cluster = {\"node-07\", \"node-08\"}\nactive_nodes |= extra_cluster\nprint(\"\\nNodes after |=:\", len(active_nodes))",
          expectedOutput: "Nodes after add(): {'node-01', 'node-02', 'node-03'}\nNodes after update(): {'node-01', 'node-02', 'node-03', 'node-04', 'node-05', 'node-06'}\n\nadd('LAGOS'):    {'LAGOS'}\nupdate('LAGOS'): {'A', 'G', 'L', 'O', 'S'}\n\nNodes after |=: 8"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: "active_nodes.add(\"node-03\")",
          internalEffect: "Computes hash for 'node-03', locates empty bucket, and writes pointer into PySetObject."
        },
        {
          step: 2,
          codeLine: 4,
          instruction: "active_nodes.add(\"node-01\")",
          internalEffect: "Finds existing pointer for 'node-01'; skips insertion maintaining uniqueness invariant."
        },
        {
          step: 3,
          codeLine: 10,
          instruction: "active_nodes.update(backup_nodes, failover_nodes)",
          internalEffect: "Iterates over list and tuple arguments sequentially, hashing and inserting each item."
        },
        {
          step: 4,
          codeLine: 16,
          instruction: "set_b.update(\"LAGOS\")",
          internalEffect: "Treats string as iterable of single-character strings ('L', 'A', 'G', 'O', 'S') and inserts each."
        }
      ],
      apply: {
        domain: "Cloud Infrastructure & Fleet Management",
        contextTitle: "Distributed Worker Node Registry",
        scenario: "Registering dynamic autoscaling virtual machines and health-check beacons into an active cluster registry."
      },
      commonMistakes: [
        {
          label: "Assigning the Result of add() Back to the Variable",
          explanation: "add() and update() modify the set in-place and return None. Reassigning s = s.add(x) overwrites the set with None.",
          erroneousCode: "s = {\"a\", \"b\"}\ns = s.add(\"c\")  # Bug: s is now None!",
          correctedCode: "s = {\"a\", \"b\"}\ns.add(\"c\")       # Mutates s in-place, s remains a set"
        }
      ],
      sourceNotes: "Derived from Asabeneh's 30 Days of Python: Day 7 Sets (Adding Items to a Set: add(), update()).",
      practise: [
        {
          id: "d7-s4-ex1",
          title: "Predict Output: String Trap with add() vs update()",
          type: "predict-output",
          tier: "foundation",
          points: 10,
          contextScenario: "Airport Hub Code Registry",
          prompt: "What will `len(s1)` and `len(s2)` evaluate to after running:\n`s1 = set(); s1.add('LOS')`\n`s2 = set(); s2.update('LOS')`?",
          options: [
            {
              id: "opt-1",
              text: "len(s1) == 1, len(s2) == 3",
              explanation: "Correct! add('LOS') inserts the entire string 'LOS' as a single element. update('LOS') iterates through the string characters, adding 'L', 'O', 'S' as 3 separate elements.",
              isCorrect: true
            },
            {
              id: "opt-2",
              text: "len(s1) == 1, len(s2) == 1",
              explanation: "Incorrect. update() iterates over string collections and unpacks their characters.",
              isCorrect: false
            },
            {
              id: "opt-3",
              text: "len(s1) == 3, len(s2) == 3",
              explanation: "Incorrect. add() never iterates through its argument.",
              isCorrect: false
            },
            {
              id: "opt-4",
              text: "TypeError on update()",
              explanation: "Incorrect. Strings are valid iterables in Python.",
              isCorrect: false
            }
          ],
          hints: [
            "add() puts the single item inside the set as one unit.",
            "update() expects an iterable and inserts every item produced by iteration.",
            "A string iterates character by character."
          ]
        },
        {
          id: "d7-s4-ex2",
          title: "Order the Lines: Cloud Node Cluster Expansion Sequence",
          type: "order-the-lines",
          tier: "standard",
          points: 15,
          contextScenario: "DevOps Cluster Auto-Scaler",
          prompt: "Arrange the lines of code in order to initialize an empty set of cluster nodes, add a primary gateway node, expand with a list of worker nodes, and print the total node count.",
          jumbledLines: [
            { id: "line-1", code: "cluster_nodes = set()", indent: 0 },
            { id: "line-2", code: "cluster_nodes.add('gateway-01')", indent: 0 },
            { id: "line-3", code: "workers = ['worker-01', 'worker-02', 'worker-03']", indent: 0 },
            { id: "line-4", code: "cluster_nodes.update(workers)", indent: 0 },
            { id: "line-5", code: "print(f'Total cluster nodes: {len(cluster_nodes)}')", indent: 0 }
          ],
          correctLineOrder: ["line-1", "line-2", "line-3", "line-4", "line-5"],
          hints: [
            "Start by initializing the empty set.",
            "Add the single gateway node using .add().",
            "Define the list of worker nodes before calling .update().",
            "Finally print the length."
          ]
        }
      ]
    },
    {
      id: "day7-sub5",
      number: 5,
      title: "Removal Operations: remove() vs discard(), pop() & clear()",
      summary: "Distinguish strict remove() which raises KeyError from idempotent discard(), explore arbitrary pop(), and reset sets with clear().",
      estimatedMinutes: 8,
      introduce: {
        headline: "Safe vs Strict Eviction: KeyError Traps and Random Pop",
        paragraphs: [
          "Python provides four distinct methods for removing items from a set: remove(), discard(), pop(), and clear(). Understanding their error handling is vital for robust code.",
          "s.remove(x) deletes element x from the set. If x is NOT present, remove() strictly raises a KeyError! Use remove() when the absence of the element indicates an unexpected or illegal application state.",
          "s.discard(x) deletes element x if present, but does NOTHING if x is absent. It never raises an error. Use discard() for idempotent cleanups where you simply want to guarantee x is gone.",
          "s.pop() removes and returns an arbitrary element from the set. Because sets are unordered, you cannot choose which element is popped! If the set is empty, s.pop() raises KeyError.",
          "s.clear() empties the set completely, leaving it as an empty set() with length 0."
        ],
        keyTerms: [
          {
            term: "remove()",
            definition: "Deletes an item from the set; raises KeyError if the item does not exist."
          },
          {
            term: "discard()",
            definition: "Safely deletes an item from the set without raising an error if it is missing."
          },
          {
            term: "pop()",
            definition: "Removes and returns an arbitrary element from the set; raises KeyError on empty sets."
          },
          {
            term: "clear()",
            definition: "Empties the set in-place, removing all elements."
          }
        ],
        bulletPoints: [
          "remove(x) raises KeyError if x is missing; always guard with 'if x in s' or use discard(x).",
          "discard(x) is idempotent: safely removes x without raising exceptions.",
          "pop() extracts an arbitrary item; do NOT assume LIFO or FIFO order.",
          "clear() empties the container without reallocating a new object address."
        ]
      },
      visualise: {
        type: "hash-set-table-inspector",
        title: "Set Eviction & Dummy Bucket Inspector",
        badge: "simulation",
        description: "See how CPython marks removed slots with dummy tombstones so probe chains remain intact.",
        initialConfig: {
          mode: "eviction"
        }
      },
      code: [
        {
          title: "Removing Items: remove() vs discard() vs pop()",
          runMode: "real",
          code: "# 1. Strict removal with remove()\ncart = {\"laptop\", \"mouse\", \"keyboard\", \"monitor\"}\ncart.remove(\"mouse\")\nprint(\"Cart after remove('mouse'):\", cart)\n\ntry:\n    cart.remove(\"headphones\")  # Missing item!\nexcept KeyError as err:\n    print(\"remove() raised KeyError for missing key:\", err)\n\n# 2. Defensive removal with discard()\ncart.discard(\"headphones\")  # Does not crash!\nprint(\"Cart after discard('headphones'):\", cart)\n\n# 3. Arbitrary element popping\npopped_item = cart.pop()\nprint(f\"Popped item: '{popped_item}', Remaining: {cart}\")\n\n# 4. Emptying set with clear()\ncart.clear()\nprint(\"Cart after clear():\", cart, \"Length:\", len(cart))",
          expectedOutput: "Cart after remove('mouse'): {'keyboard', 'laptop', 'monitor'}\nremove() raised KeyError for missing key: 'headphones'\nCart after discard('headphones'): {'keyboard', 'laptop', 'monitor'}\nPopped item: 'keyboard', Remaining: {'laptop', 'monitor'}\nCart after clear(): set() Length: 0"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: "cart.remove(\"mouse\")",
          internalEffect: "Finds bucket for 'mouse', sets entry key to dummy tombstone, and decrements set active count."
        },
        {
          step: 2,
          codeLine: 7,
          instruction: "cart.remove(\"headphones\")",
          internalEffect: "Probes table, encounters empty slot without match, and raises PyExc_KeyError."
        },
        {
          step: 3,
          codeLine: 12,
          instruction: "cart.discard(\"headphones\")",
          internalEffect: "Probes table, discovers absence, suppresses error, and returns Py_None gracefully."
        },
        {
          step: 4,
          codeLine: 16,
          instruction: "popped_item = cart.pop()",
          internalEffect: "Finds first non-empty bucket in hash table, retrieves object reference, replaces with dummy, returns item."
        }
      ],
      apply: {
        domain: "E-Commerce Shopping & Inventory Management",
        contextTitle: "Shopping Cart Item Eviction & Flash Sale Allocation",
        scenario: "Managing reserved inventory carts where item expiration cleanly discards items without triggering runtime exceptions."
      },
      commonMistakes: [
        {
          label: "Using remove() Without Checking Membership",
          explanation: "Calling remove() on an absent element crashes with KeyError. Prefer discard() or check with 'if item in my_set:' first.",
          erroneousCode: "active_sessions.remove(token)  # Crashes if already expired!",
          correctedCode: "active_sessions.discard(token)  # Idempotent and safe"
        }
      ],
      sourceNotes: "Derived from Asabeneh's 30 Days of Python: Day 7 Sets (Removing Items: remove, discard, pop, clear, del).",
      practise: [
        {
          id: "d7-s5-ex1",
          title: "Fix the Bug: Prevent KeyError on Session Token Revocation",
          type: "fix-the-bug",
          tier: "standard",
          points: 15,
          contextScenario: "Authentication Token Blacklist Gateway",
          prompt: "The function `revoke_session(active_sessions, token)` crashes with a KeyError when called with an expired or missing token. Fix the code to use the safe removal method so it runs idempotently without crashing.",
          starterCode: "def revoke_session(active_sessions, token):\n    # Bug: remove() raises KeyError when token is missing!\n    active_sessions.remove(token)\n    return len(active_sessions)",
          solutionCode: "def revoke_session(active_sessions, token):\n    active_sessions.discard(token)\n    return len(active_sessions)",
          testCases: [
            {
              id: "tc1",
              label: "Token present in sessions",
              setup: "s = {'tok-1', 'tok-2', 'tok-3'}; res = revoke_session(s, 'tok-2')",
              expected: "2",
              hidden: false
            },
            {
              id: "tc2",
              label: "Token absent from sessions",
              setup: "s = {'tok-1', 'tok-3'}; res = revoke_session(s, 'tok-999')",
              expected: "2",
              hidden: false
            }
          ],
          hints: [
            "Which set method deletes an element if present, but silently does nothing if absent?",
            "Replace .remove() with .discard().",
            "discard() never raises a KeyError."
          ]
        },
        {
          id: "d7-s5-ex2",
          title: "Set Removal Method Semantics",
          type: "scenario-mcq",
          tier: "foundation",
          points: 10,
          contextScenario: "Distributed Queue Processing",
          prompt: "Which set method removes and returns an arbitrary element from a populated set, but raises KeyError if the set is empty?",
          options: [
            {
              id: "opt-1",
              text: "pop()",
              explanation: "Correct! set.pop() removes and returns an arbitrary element. If called on an empty set, it raises KeyError.",
              isCorrect: true
            },
            {
              id: "opt-2",
              text: "discard()",
              explanation: "Incorrect. discard(x) takes an argument and returns None.",
              isCorrect: false
            },
            {
              id: "opt-3",
              text: "remove()",
              explanation: "Incorrect. remove(x) takes an argument and returns None.",
              isCorrect: false
            },
            {
              id: "opt-4",
              text: "clear()",
              explanation: "Incorrect. clear() removes all elements and returns None.",
              isCorrect: false
            }
          ],
          hints: [
            "Think of the method that both removes an element AND returns it to you.",
            "It takes no positional arguments.",
            "Lists have a method of the same name, but in sets the order is arbitrary."
          ]
        }
      ]
    },
    {
      id: "day7-sub6",
      number: 6,
      title: "Mathematical Set Operations: Union (|) and Intersection (&)",
      summary: "Compute mathematical unions and intersections using both symbolic operators (| and &) and built-in methods, understanding iterable compatibility.",
      estimatedMinutes: 8,
      introduce: {
        headline: "Combining & Isolating: Union (|) vs Intersection (&)",
        paragraphs: [
          "Sets excel at relational algebra. Python supports standard mathematical set operations via both overloaded bitwise operators and readable object methods.",
          "Union (A | B or A.union(B)): Returns a new set containing all distinct elements that exist in set A, set B, or both. It combines collections without duplicates.",
          "Intersection (A & B or A.intersection(B)): Returns a new set containing only elements that exist simultaneously in both set A AND set B.",
          "Operator vs Method Compatibility: The | and & operators strictly require BOTH operands to be sets (or frozensets). In contrast, methods like A.union(iterable) and A.intersection(iterable) accept ANY iterable (lists, tuples, strings, ranges).",
          "In-place variations: A |= B (or A.update(B)) mutates A with the union. A &= B (or A.intersection_update(B)) mutates A in-place, keeping only overlapping members."
        ],
        keyTerms: [
          {
            term: "Union (|)",
            definition: "Returns a new set with all unique elements present in either set A or set B."
          },
          {
            term: "Intersection (&)",
            definition: "Returns a new set with elements that appear in both set A and set B simultaneously."
          },
          {
            term: "A.union(iterable)",
            definition: "Set method that computes the union with any iterable, not just set instances."
          },
          {
            term: "intersection_update()",
            definition: "In-place mutation method (&=) that prunes a set down to only intersecting members."
          }
        ],
        bulletPoints: [
          "A | B combines all elements from A and B without duplicates.",
          "A & B isolates only elements common to both A and B.",
          "Operators (| and &) require set operands; methods (.union(), .intersection()) accept any iterable.",
          "In-place operators: |= expands with union; &= contracts to intersection."
        ]
      },
      visualise: {
        type: "venn-diagram-simulator",
        title: "Venn Diagram: Union & Intersection",
        badge: "simulation",
        description: "Interact with overlapping Venn sets A and B to visualize Union (A | B) and Intersection (A & B).",
        initialConfig: {
          mode: "union-intersection"
        }
      },
      code: [
        {
          title: "Union and Intersection with Operators & Methods",
          runMode: "real",
          code: "# Sets of developer skills\nfrontend_devs = {\"JavaScript\", \"TypeScript\", \"React\", \"CSS\", \"HTML\"}\nbackend_devs = {\"Python\", \"TypeScript\", \"PostgreSQL\", \"Docker\", \"React\"}\n\n# 1. Union: All skills required for fullstack projects\nall_skills_op = frontend_devs | backend_devs\nall_skills_meth = frontend_devs.union(backend_devs)\nprint(\"Total unique tech stack:\", len(all_skills_op))\nprint(\"Fullstack Union:        \", all_skills_op)\n\n# 2. Intersection: Common bridge skills\nbridge_skills = frontend_devs & backend_devs\nprint(\"\\nBridge skills (&):       \", bridge_skills)\n\n# 3. Method flexibility with non-set iterables\ncloud_skills = [\"Docker\", \"Kubernetes\", \"AWS\", \"Python\"]\nbackend_cloud = backend_devs.intersection(cloud_skills)  # List accepted by method!\nprint(\"Backend & Cloud skills: \", backend_cloud)\n\n# 4. In-place intersection with &=\nteam_skills = frontend_devs.copy()\nteam_skills &= {\"React\", \"Vue\", \"Svelte\"}\nprint(\"Filtered to frontend framework:\", team_skills)",
          expectedOutput: "Total unique tech stack: 8\nFullstack Union:         {'CSS', 'Docker', 'HTML', 'JavaScript', 'PostgreSQL', 'Python', 'React', 'TypeScript'}\n\nBridge skills (&):        {'React', 'TypeScript'}\nBackend & Cloud skills:  {'Docker', 'Python'}\nFiltered to frontend framework: {'React'}"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 6,
          instruction: "all_skills_op = frontend_devs | backend_devs",
          internalEffect: "Allocates a new PySetObject, copies all entries from frontend_devs, then updates with backend_devs."
        },
        {
          step: 2,
          codeLine: 12,
          instruction: "bridge_skills = frontend_devs & backend_devs",
          internalEffect: "Iterates through the smaller set, looks up each element in the larger set in O(1), and collects matches."
        },
        {
          step: 3,
          codeLine: 17,
          instruction: "backend_devs.intersection(cloud_skills)",
          internalEffect: "Accepts raw Python list cloud_skills, iterates items, and matches against backend_devs hash table."
        },
        {
          step: 4,
          codeLine: 22,
          instruction: "team_skills &= {\"React\", \"Vue\", \"Svelte\"}",
          internalEffect: "Evaluates in-place intersection; removes any element from team_skills not present in the right operand."
        }
      ],
      apply: {
        domain: "Human Resources & Talent Acquisition",
        contextTitle: "Applicant Tracking System (ATS) Skill Matching",
        scenario: "Matching job candidates' declared skills against mandatory role requirements to compute intersection match ratios."
      },
      commonMistakes: [
        {
          label: "Using the | or & Operator with Non-Set Iterables",
          explanation: "The operators | and & require both operands to be sets. Passing a list or tuple raises TypeError: unsupported operand type(s). Use .union() or .intersection() instead.",
          erroneousCode: "s = {1, 2, 3}\nres = s | [3, 4, 5]  # TypeError!",
          correctedCode: "s = {1, 2, 3}\nres = s.union([3, 4, 5])  # Valid, accepts any iterable"
        }
      ],
      sourceNotes: "Derived from Asabeneh's 30 Days of Python: Day 7 Sets (Union of Sets, Finding Intersection Items).",
      practise: [
        {
          id: "d7-s6-ex1",
          title: "Write Code: Cross-Bank Customer Account Overlap Calculator",
          type: "write-code",
          tier: "standard",
          points: 15,
          contextScenario: "Interswitch Open Banking Verification",
          prompt: "Write a function `analyze_accounts(bank_a_custs, bank_b_custs)` that takes two iterables (lists or sets) of BVNs, and returns a tuple containing: (1) the total count of unique individuals across both institutions, and (2) a sorted list of BVNs who hold accounts in both banks.",
          starterCode: "def analyze_accounts(bank_a_custs, bank_b_custs):\n    # TODO: Calculate union count and sorted intersection list\n    pass",
          solutionCode: "def analyze_accounts(bank_a_custs, bank_b_custs):\n    set_a = set(bank_a_custs)\n    set_b = set(bank_b_custs)\n    total_unique = len(set_a | set_b)\n    common = sorted(set_a & set_b)\n    return total_unique, common",
          testCases: [
            {
              id: "tc1",
              label: "Overlapping customer BVNs",
              setup: "a = ['BVN-101', 'BVN-102', 'BVN-103']; b = ['BVN-102', 'BVN-103', 'BVN-104']; res = analyze_accounts(a, b)",
              expected: "(4, ['BVN-102', 'BVN-103'])",
              hidden: false
            },
            {
              id: "tc2",
              label: "Completely disjoint customer lists",
              setup: "a = ['BVN-201']; b = ['BVN-301']; res = analyze_accounts(a, b)",
              expected: "(2, [])",
              hidden: false
            }
          ],
          hints: [
            "Convert both inputs to sets using set() so set operators can be safely applied.",
            "Use set_a | set_b for the union and len(...) for total count.",
            "Use sorted(set_a & set_b) for the sorted overlapping customers."
          ]
        },
        {
          id: "d7-s6-ex2",
          title: "Operator vs Method Iterable Compatibility",
          type: "scenario-mcq",
          tier: "challenge",
          points: 15,
          contextScenario: "Data Pipeline Performance Optimization",
          prompt: "Consider `s = {1, 2, 3}` and `data = [3, 4, 5]`. Why does `s.union(data)` succeed while `s | data` crashes with a TypeError?",
          options: [
            {
              id: "opt-1",
              text: "The | operator strictly requires both operands to be sets, whereas .union() accepts any iterable.",
              explanation: "Correct! The bitwise operator overloads (| and &) require both operands to be set types. Built-in methods like .union() convert any iterable on the fly.",
              isCorrect: true
            },
            {
              id: "opt-2",
              text: "The | operator is deprecated in Python 3.",
              explanation: "Incorrect. The | operator is fully supported and idiomatic when both sides are sets.",
              isCorrect: false
            },
            {
              id: "opt-3",
              text: "Lists cannot be converted to sets.",
              explanation: "Incorrect. Any list containing hashable items can be converted to a set.",
              isCorrect: false
            },
            {
              id: "opt-4",
              text: "The union() method mutates the list data in place.",
              explanation: "Incorrect. union() never mutates its arguments; it returns a new set.",
              isCorrect: false
            }
          ],
          hints: [
            "Look at the operator syntax `s | data` vs the method call `s.union(data)`.",
            "Does Python allow bitwise OR between a set and a list?",
            "Methods are more permissive regarding argument types than symbolic operators."
          ]
        }
      ]
    },
    {
      id: "day7-sub7",
      number: 7,
      title: "Mathematical Set Operations: Difference (-) & Symmetric Difference (^)",
      summary: "Master set difference (A - B) to isolate unique elements and symmetric difference (A ^ B) to find non-overlapping disjunctions.",
      estimatedMinutes: 7,
      introduce: {
        headline: "Subtraction & Exclusive Disjunction: A - B vs A ^ B",
        paragraphs: [
          "Two additional core mathematical operations allow you to isolate differences and discrepancies between collections: Difference and Symmetric Difference.",
          "Difference (A - B or A.difference(B)): Returns a new set containing elements that exist in A but NOT in B. Crucially, set difference is NOT commutative: A - B produces a completely different result than B - A!",
          "Symmetric Difference (A ^ B or A.symmetric_difference(B)): Returns a new set containing elements that are in either A or B, but NOT in both. It is mathematically equivalent to (A | B) - (A & B) and represents the exclusive disjunction (XOR).",
          "Unlike difference, symmetric difference IS commutative: A ^ B is always identical to B ^ A.",
          "In-place mutators: A -= B (difference_update) removes all elements of B from A in-place. A ^= B (symmetric_difference_update) mutates A to hold the XOR result."
        ],
        keyTerms: [
          {
            term: "Difference (-)",
            definition: "Elements that belong to set A but not to set B (non-commutative: A - B != B - A)."
          },
          {
            term: "Symmetric Difference (^)",
            definition: "Elements belonging to either set A or set B, but not both simultaneously (XOR)."
          },
          {
            term: "difference_update()",
            definition: "Mutates set A in-place by subtracting all elements found in collection B (-=)."
          },
          {
            term: "Commutative Property",
            definition: "Symmetric difference is commutative (A ^ B == B ^ A); difference is not (A - B != B - A)."
          }
        ],
        bulletPoints: [
          "A - B yields items in A that are missing in B.",
          "B - A yields items in B that are missing in A.",
          "A ^ B yields items unique to either set (excluding the intersection).",
          "A ^ B == (A | B) - (A & B) == (A - B) | (B - A)."
        ]
      },
      visualise: {
        type: "venn-diagram-simulator",
        title: "Venn Diagram: Difference & Symmetric Difference",
        badge: "simulation",
        description: "Toggle between Difference A - B, Difference B - A, and Symmetric Difference A ^ B.",
        initialConfig: {
          mode: "difference-symmetric"
        }
      },
      code: [
        {
          title: "Difference (-) and Symmetric Difference (^)",
          runMode: "real",
          code: "# Two warehouse inventory registries\nlagos_stock = {\"MacBook\", \"iPad\", \"iPhone\", \"AirPods\", \"AppleWatch\"}\nabuja_stock = {\"MacBook\", \"Dell XPS\", \"iPad\", \"Surface Pro\"}\n\n# 1. Difference: What is in Lagos but NOT in Abuja?\nonly_lagos = lagos_stock - abuja_stock\nprint(\"Only in Lagos (Lagos - Abuja):\", only_lagos)\n\n# 2. Difference: What is in Abuja but NOT in Lagos?\nonly_abuja = abuja_stock - lagos_stock\nprint(\"Only in Abuja (Abuja - Lagos):\", only_abuja)\n\n# 3. Symmetric Difference: Products stocked in exactly ONE location\nunique_to_one = lagos_stock ^ abuja_stock\nprint(\"\\nSymmetric Difference (^):      \", unique_to_one)\nprint(\"Commutative check (A^B == B^A):\", (lagos_stock ^ abuja_stock) == (abuja_stock ^ lagos_stock))\n\n# 4. In-place difference update (-=)\ncurrent_tasks = {\"Auth\", \"Database\", \"UI\", \"Billing\"}\ncompleted_tasks = {\"Auth\", \"Database\"}\ncurrent_tasks -= completed_tasks\nprint(\"\\nRemaining tasks after -=:\", current_tasks)",
          expectedOutput: "Only in Lagos (Lagos - Abuja): {'AirPods', 'AppleWatch', 'iPhone'}\nOnly in Abuja (Abuja - Lagos): {'Dell XPS', 'Surface Pro'}\n\nSymmetric Difference (^):       {'AirPods', 'AppleWatch', 'Dell XPS', 'iPhone', 'Surface Pro'}\nCommutative check (A^B == B^A): True\n\nRemaining tasks after -=: {'Billing', 'UI'}"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 6,
          instruction: "only_lagos = lagos_stock - abuja_stock",
          internalEffect: "Iterates through lagos_stock, checks membership in abuja_stock, and collects items where test returns False."
        },
        {
          step: 2,
          codeLine: 10,
          instruction: "only_abuja = abuja_stock - lagos_stock",
          internalEffect: "Demonstrates non-commutative behavior; filters abuja_stock for items absent from lagos_stock."
        },
        {
          step: 3,
          codeLine: 14,
          instruction: "unique_to_one = lagos_stock ^ abuja_stock",
          internalEffect: "Computes (A | B) - (A & B); builds set of items present in exactly one operand."
        },
        {
          step: 4,
          codeLine: 21,
          instruction: "current_tasks -= completed_tasks",
          internalEffect: "Mutates current_tasks in-place, evicting any key found in completed_tasks."
        }
      ],
      apply: {
        domain: "Database Replication & Data Synchronization",
        contextTitle: "Distributed Database Record Delta Sync",
        scenario: "Calculating data divergence deltas between primary cloud databases and edge replicas to schedule differential sync batches."
      },
      commonMistakes: [
        {
          label: "Assuming Set Difference is Commutative",
          explanation: "Unlike union, intersection, and symmetric difference, difference is directional: A - B is almost never equal to B - A.",
          erroneousCode: "diff1 = {1, 2, 3} - {2, 3, 4}  # {1}\ndiff2 = {2, 3, 4} - {1, 2, 3}  # {4} (Different!)",
          correctedCode: "symmetric = {1, 2, 3} ^ {2, 3, 4}  # {1, 4} (Commutative for both directions)"
        }
      ],
      sourceNotes: "Derived from Asabeneh's 30 Days of Python: Day 7 Sets (Difference Between Two Sets, Symmetric Difference).",
      practise: [
        {
          id: "d7-s7-ex1",
          title: "Predict Output: Difference Directionality vs Symmetric Difference",
          type: "predict-output",
          tier: "foundation",
          points: 10,
          contextScenario: "Feature Flag Rollout Comparison",
          prompt: "Given `v1 = {'auth', 'billing', 'reports'}` and `v2 = {'auth', 'billing', 'analytics'}`. What will `v1 - v2` and `v1 ^ v2` produce?",
          options: [
            {
              id: "opt-1",
              text: "v1 - v2 == {'reports'}, v1 ^ v2 == {'analytics', 'reports'}",
              explanation: "Correct! v1 - v2 isolates items in v1 absent from v2 ({'reports'}). Symmetric difference v1 ^ v2 isolates items present in exactly one set ({'reports', 'analytics'}).",
              isCorrect: true
            },
            {
              id: "opt-2",
              text: "v1 - v2 == {'analytics'}, v1 ^ v2 == {'auth', 'billing'}",
              explanation: "Incorrect. v1 - v2 cannot produce 'analytics' because 'analytics' was not in v1.",
              isCorrect: false
            },
            {
              id: "opt-3",
              text: "v1 - v2 == {'auth', 'billing'}, v1 ^ v2 == set()",
              explanation: "Incorrect. 'auth' and 'billing' are the intersection, not the difference.",
              isCorrect: false
            },
            {
              id: "opt-4",
              text: "v1 - v2 == set(), v1 ^ v2 == {'analytics'}",
              explanation: "Incorrect. 'reports' is in v1 and not in v2, so the difference is non-empty.",
              isCorrect: false
            }
          ],
          hints: [
            "Difference A - B keeps elements from A that are not in B.",
            "Can elements from B ever appear in A - B?",
            "Symmetric difference A ^ B includes unique items from BOTH sides."
          ]
        },
        {
          id: "d7-s7-ex2",
          title: "Write Code: Differential Synchronization Delta Engine",
          type: "write-code",
          tier: "challenge",
          points: 20,
          contextScenario: "Edge Server Offline Sync, Kano",
          prompt: "Write a function `calculate_sync_deltas(cloud_ids, edge_ids)` that accepts two sets of record IDs and returns a dictionary with three keys:\n- 'upload': elements in edge_ids but missing in cloud_ids (need to be uploaded to cloud)\n- 'download': elements in cloud_ids but missing in edge_ids (need to be downloaded to edge)\n- 'discrepancy_count': total count of records that exist in only one location (symmetric difference count)",
          starterCode: "def calculate_sync_deltas(cloud_ids, edge_ids):\n    # TODO: Calculate upload, download, and discrepancy count\n    pass",
          solutionCode: "def calculate_sync_deltas(cloud_ids, edge_ids):\n    upload = edge_ids - cloud_ids\n    download = cloud_ids - edge_ids\n    discrepancy_count = len(cloud_ids ^ edge_ids)\n    return {\n        'upload': upload,\n        'download': download,\n        'discrepancy_count': discrepancy_count\n    }",
          testCases: [
            {
              id: "tc1",
              label: "Standard divergent delta sync",
              setup: "cloud = {1, 2, 3, 4}; edge = {3, 4, 5, 6}; res = calculate_sync_deltas(cloud, edge)",
              expected: "{'upload': {5, 6}, 'download': {1, 2}, 'discrepancy_count': 4}",
              hidden: false
            },
            {
              id: "tc2",
              label: "Identical synchronized databases",
              setup: "cloud = {10, 20}; edge = {10, 20}; res = calculate_sync_deltas(cloud, edge)",
              expected: "{'upload': set(), 'download': set(), 'discrepancy_count': 0}",
              hidden: false
            }
          ],
          hints: [
            "What operation gives elements in edge but not in cloud? edge_ids - cloud_ids.",
            "What operation gives elements in cloud but not in edge? cloud_ids - edge_ids.",
            "Symmetric difference (cloud_ids ^ edge_ids) contains all items unique to one side."
          ]
        }
      ]
    },
    {
      id: "day7-sub8",
      number: 8,
      title: "Set Relational Predicates: issubset(), issuperset() & isdisjoint()",
      summary: "Evaluate boolean relationships between sets: test subset (<=), proper subset (<), superset (>=), disjointness, and value equality.",
      estimatedMinutes: 7,
      introduce: {
        headline: "Logical Set Comparisons: Subsets, Supersets, Disjointness & Equivalence",
        paragraphs: [
          "Python sets provide powerful predicate methods and relational operators that return boolean True or False to test structural relationships.",
          "Subset (A.issubset(B) or A <= B): Returns True if EVERY element of set A is also an element of set B. Proper subset (A < B) returns True if A is a subset of B and A != B (B has at least one extra item).",
          "Superset (A.issuperset(B) or A >= B): Returns True if set A contains EVERY element found in set B. Proper superset (A > B) requires A to contain all items of B plus additional items.",
          "Disjointness (A.isdisjoint(B)): Returns True if set A and set B share NO common elements at all—in other words, if their intersection A & B is an empty set set().",
          "Set Equality (A == B): Returns True if both sets contain the exact same unique elements, regardless of insertion order or internal memory bucket placement."
        ],
        keyTerms: [
          {
            term: "issubset() (<=)",
            definition: "Returns True if all elements of this set are present in the target collection."
          },
          {
            term: "issuperset() (>=)",
            definition: "Returns True if this set contains every element of the target collection."
          },
          {
            term: "isdisjoint()",
            definition: "Returns True if two sets have zero overlapping elements (their intersection is empty)."
          },
          {
            term: "Proper Subset (<)",
            definition: "A is a subset of B, and B contains at least one element not present in A."
          }
        ],
        bulletPoints: [
          "A.issubset(B) or A <= B: True if all items of A are inside B.",
          "A.issuperset(B) or A >= B: True if A encompasses all items of B.",
          "A.isdisjoint(B): True if A & B == set() (no mutual overlap).",
          "A == B: True if sets contain identical members, ignoring order."
        ]
      },
      visualise: {
        type: "venn-diagram-simulator",
        title: "Relational Set Predicates Simulator",
        badge: "simulation",
        description: "Test subset, superset, and disjoint states with interactive boolean evaluations.",
        initialConfig: {
          mode: "predicates"
        }
      },
      code: [
        {
          title: "Evaluating Subsets, Supersets, and Disjoint Sets",
          runMode: "real",
          code: "# Core permissions hierarchy\nall_permissions = {\"READ\", \"WRITE\", \"EXECUTE\", \"DELETE\", \"AUDIT\"}\nmanager_permissions = {\"READ\", \"WRITE\", \"AUDIT\"}\nintern_permissions = {\"READ\"}\nfinance_permissions = {\"WIRE_TRANSFER\", \"PAYROLL\"}\n\n# 1. Subset checks (<= and issubset)\nprint(\"Is intern subset of manager?  \", intern_permissions.issubset(manager_permissions))\nprint(\"Is intern <= all_permissions?  \", intern_permissions <= all_permissions)\nprint(\"Is manager a strict subset (<)?\", manager_permissions < all_permissions)\n\n# 2. Superset checks (>= and issuperset)\nprint(\"\\nDoes all_permissions superset intern?\", all_permissions.issuperset(intern_permissions))\nprint(\"Does manager >= all_permissions?    \", manager_permissions >= all_permissions)\n\n# 3. Disjoint check (isdisjoint)\nprint(\"\\nAre all_permissions and finance disjoint?\", all_permissions.isdisjoint(finance_permissions))\nprint(\"Are manager and intern disjoint?        \", manager_permissions.isdisjoint(intern_permissions))\n\n# 4. Equality check regardless of order\nset_one = {1, 2, 3, 4}\nset_two = {4, 3, 2, 1}\nprint(\"\\nSet equality (order independent):\", set_one == set_two)",
          expectedOutput: "Is intern subset of manager?   True\nIs intern <= all_permissions?   True\nIs manager a strict subset (<)? True\n\nDoes all_permissions superset intern? True\nDoes manager >= all_permissions?     False\n\nAre all_permissions and finance disjoint? True\nAre manager and intern disjoint?         False\n\nSet equality (order independent): True"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 8,
          instruction: "intern_permissions.issubset(manager_permissions)",
          internalEffect: "Iterates items of intern_permissions, verifying each exists in manager_permissions hash table in O(1)."
        },
        {
          step: 2,
          codeLine: 10,
          instruction: "manager_permissions < all_permissions",
          internalEffect: "Verifies manager <= all and len(manager) < len(all), confirming proper subset."
        },
        {
          step: 3,
          codeLine: 17,
          instruction: "all_permissions.isdisjoint(finance_permissions)",
          internalEffect: "Iterates smaller set finance_permissions; stops on first match. Finding none, returns True."
        },
        {
          step: 4,
          codeLine: 23,
          instruction: "set_one == set_two",
          internalEffect: "Compares sizes first (4 == 4), then verifies all keys in set_one exist in set_two."
        }
      ],
      apply: {
        domain: "Cloud Security & Role-Based Access Control (RBAC)",
        contextTitle: "Zero-Trust RBAC Privilege Auditor",
        scenario: "Verifying that temporary IAM access tokens are strict subsets of granted organizational security policies."
      },
      commonMistakes: [
        {
          label: "Confusing isdisjoint() with Empty Set Check",
          explanation: "isdisjoint() returns True when sets have NO overlap. Developers sometimes mistakenly expect it to mean both sets are empty.",
          erroneousCode: "if not s1.isdisjoint(s2):\n    print(\"They are disjoint!\")  # Bug: False means they DO overlap!",
          correctedCode: "if s1.isdisjoint(s2):\n    print(\"They have zero overlap!\")"
        }
      ],
      sourceNotes: "Derived from Asabeneh's 30 Days of Python: Day 7 Sets (Subset and Super Set, Disjoint Sets).",
      practise: [
        {
          id: "d7-s8-ex1",
          title: "Zero-Trust RBAC Privilege Scope Validation",
          type: "scenario-mcq",
          tier: "standard",
          points: 15,
          contextScenario: "Banking Microservice Security Mesh",
          prompt: "An API gateway verifies whether an incoming request's requested scopes are fully covered by the client's granted scopes. Which expression returns True if and only if EVERY requested scope is authorized in `granted_scopes`?",
          options: [
            {
              id: "opt-1",
              text: "requested_scopes.issubset(granted_scopes) or requested_scopes <= granted_scopes",
              explanation: "Correct! A subset check validates that every element in requested_scopes exists inside granted_scopes.",
              isCorrect: true
            },
            {
              id: "opt-2",
              text: "requested_scopes.issuperset(granted_scopes)",
              explanation: "Incorrect. That would verify that requested_scopes encompasses granted_scopes, allowing clients to request more permissions than granted.",
              isCorrect: false
            },
            {
              id: "opt-3",
              text: "requested_scopes.isdisjoint(granted_scopes)",
              explanation: "Incorrect. isdisjoint() returns True if they have NO permissions in common.",
              isCorrect: false
            },
            {
              id: "opt-4",
              text: "requested_scopes & granted_scopes == set()",
              explanation: "Incorrect. That is an alternative definition of disjointness.",
              isCorrect: false
            }
          ],
          hints: [
            "We want to ensure the requested scopes are contained within the granted scopes.",
            "If A is completely inside B, A is a subset of B.",
            "Look for .issubset() or <="
          ]
        },
        {
          id: "d7-s8-ex2",
          title: "Fill Gaps: Relational Predicate Expressions",
          type: "fill-the-gaps",
          tier: "foundation",
          points: 10,
          contextScenario: "Compliance Policy Validator",
          prompt: "Fill in the gaps to test if admin permissions contain all user permissions, and test if guest and admin roles share zero overlapping privileges.",
          gaps: [
            {
              id: "g1",
              beforeText: "is_covered = user_perms.",
              afterText: "(admin_perms)",
              correctAnswer: "issubset",
              options: ["issubset", "issuperset", "isdisjoint", "union"]
            },
            {
              id: "g2",
              beforeText: "zero_overlap = guest_perms.",
              afterText: "(admin_perms)",
              correctAnswer: "isdisjoint",
              options: ["isdisjoint", "issubset", "issuperset", "intersection"]
            }
          ],
          hints: [
            "user_perms is inside admin_perms -> issubset.",
            "zero overlap between guest and admin -> isdisjoint.",
            "Both methods return booleans (True or False)."
          ]
        }
      ]
    },
    {
      id: "day7-sub9",
      number: 9,
      title: "Immutable Sets: frozenset() & Hashable Set-of-Sets",
      summary: "Understand the limitations of mutable sets, learn how frozenset() creates immutable hashable sets, and nest sets as elements and dictionary keys.",
      estimatedMinutes: 7,
      introduce: {
        headline: "The Read-Only Set: frozenset() and Dictionary Key Eligibility",
        paragraphs: [
          "Standard Python sets are mutable: you can add, remove, and pop elements at runtime. Because their contents can change, standard sets do NOT implement a __hash__ method; calling hash(my_set) raises TypeError: unhashable type: 'set'.",
          "Consequence: You CANNOT place a standard set inside another set ({ {1, 2}, {3, 4} } fails!), nor can you use a set as a key in a dictionary.",
          "The Solution: Python provides the built-in frozenset() type. A frozenset is an immutable set whose elements cannot be altered once created. Because it is immutable, frozenset is hashable!",
          "A frozenset supports all read-only mathematical operations—union (|), intersection (&), difference (-), symmetric difference (^), issubset(), and len()—but lacks mutating methods like .add(), .remove(), .pop(), or .clear().",
          "Frozensets enable the creation of sets of sets, graphs with compound node sets, and dictionaries keyed by multi-tag groups."
        ],
        keyTerms: [
          {
            term: "frozenset",
            definition: "An immutable, hashable variant of a set whose elements cannot be modified after construction."
          },
          {
            term: "Hashability of Sets",
            definition: "Standard sets are unhashable; frozensets are hashable because their contents are fixed."
          },
          {
            term: "Set-of-Sets",
            definition: "A set containing frozenset instances as its members."
          },
          {
            term: "Dictionary Key Eligibility",
            definition: "Dictionary keys require hashable objects; frozensets are valid keys, mutable sets are not."
          }
        ],
        bulletPoints: [
          "Standard sets are mutable and unhashable; cannot be dict keys or set members.",
          "frozenset(iterable) creates an immutable, read-only hashable set.",
          "frozensets support |, &, -, ^, issubset() and len(), but forbid add() and remove().",
          "Use frozensets whenever you need sets of sets or multi-attribute dictionary keys."
        ]
      },
      visualise: {
        type: "hash-set-table-inspector",
        title: "Frozenset Immutability & Hash Inspector",
        badge: "simulation",
        description: "Compare mutable PySetObject vs immutable PyFrozenSetObject and inspect their hash eligibility.",
        initialConfig: {
          mode: "frozenset"
        }
      },
      code: [
        {
          title: "frozenset(): Immutable Sets & Composite Dictionary Keys",
          runMode: "real",
          code: "# 1. Mutable sets cannot be nested inside sets\ntry:\n    invalid_nested = {{1, 2}, {3, 4}}\nexcept TypeError as err:\n    print(\"Nested set rejected:\", err)\n\n# 2. frozenset: Immutable and hashable\nfs1 = frozenset([\"read\", \"write\"])\nfs2 = frozenset([\"execute\"])\nprint(\"frozenset 1:   \", fs1)\nprint(\"frozenset hash:\", hash(fs1))\n\n# 3. Set of frozensets (Valid!)\npermission_profiles = {fs1, fs2, frozenset([\"read\", \"admin\"])}\nprint(\"Set of sets count:\", len(permission_profiles))\n\n# 4. Using frozenset as a Dictionary Key\naccess_matrix = {\n    frozenset({\"DEV\", \"STAGING\"}): \"Standard Access\",\n    frozenset({\"PROD\", \"FINANCE\"}): \"MFA Required + Air-Gapped\",\n}\n\nquery_env = frozenset({\"STAGING\", \"DEV\"})\nprint(f\"Access policy for {query_env}:\", access_matrix[query_env])\n\n# 5. Immutability guarantee: no mutating methods\ntry:\n    fs1.add(\"admin\")\nexcept AttributeError as err:\n    print(\"frozenset is immutable:\", err)",
          expectedOutput: "Nested set rejected: unhashable type: 'set'\nfrozenset 1:    frozenset({'read', 'write'})\nfrozenset hash: <hash-integer>\nSet of sets count: 3\nAccess policy for frozenset({'DEV', 'STAGING'}): Standard Access\nfrozenset is immutable: 'frozenset' object has no attribute 'add'"
        }
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: "invalid_nested = {{1, 2}, ...}",
          internalEffect: "Python attempts to hash outer set element {1, 2}; raises TypeError: unhashable type: 'set'."
        },
        {
          step: 2,
          codeLine: 8,
          instruction: "fs1 = frozenset([\"read\", \"write\"])",
          internalEffect: "Allocates a PyFrozenSetObject with precomputed __hash__ code and frozen read-only slots."
        },
        {
          step: 3,
          codeLine: 14,
          instruction: "permission_profiles = {fs1, fs2, ...}",
          internalEffect: "Outer set successfully hashes each inner frozenset pointer and stores in hash table."
        },
        {
          step: 4,
          codeLine: 18,
          instruction: "access_matrix = { frozenset(...): ... }",
          internalEffect: "frozenset functions as a composite dict key; query_env matches key because set equality ignores order."
        }
      ],
      apply: {
        domain: "Game Theory & Network Graph Clustering",
        contextTitle: "Undirected Graph Edge Adjacency Matrix",
        scenario: "Representing undirected graph edges between nodes A and B as frozenset({A, B}) keys in a pathfinding routing dictionary."
      },
      commonMistakes: [
        {
          label: "Trying to Call Mutating Methods on a frozenset",
          explanation: "frozenset objects are strictly immutable. Calling .add(), .remove(), .update(), or .clear() raises AttributeError.",
          erroneousCode: "fs = frozenset([1, 2])\nfs.add(3)  # AttributeError: 'frozenset' object has no attribute 'add'",
          correctedCode: "fs = frozenset([1, 2])\nfs = fs | frozenset([3])  # Creates a new frozenset with union"
        }
      ],
      sourceNotes: "Derived from Asabeneh's 30 Days of Python: Day 7 Sets (Frozenset Immutability & Use Cases).",
      practise: [
        {
          id: "d7-s9-ex1",
          title: "Fix the Bug: Unhashable Set as Dictionary Key",
          type: "fix-the-bug",
          tier: "standard",
          points: 15,
          contextScenario: "Multi-Region Cloud Access Router",
          prompt: "The function `register_policy(policy_table, region_pair, policy_name)` crashes with `TypeError: unhashable type: 'set'` when using a mutable set as a dictionary key. Fix the code to use `frozenset()`.",
          starterCode: "def register_policy(policy_table, region_pair, policy_name):\n    # Bug: region_pair is a mutable set!\n    policy_table[region_pair] = policy_name\n    return policy_table",
          solutionCode: "def register_policy(policy_table, region_pair, policy_name):\n    policy_table[frozenset(region_pair)] = policy_name\n    return policy_table",
          testCases: [
            {
              id: "tc1",
              label: "Register and lookup unordered region pair",
              setup: "tbl = {}; register_policy(tbl, {'lagos', 'abuja'}, 'HIGH_BANDWIDTH_DIRECT'); key = frozenset({'abuja', 'lagos'}); res = tbl[key]",
              expected: "'HIGH_BANDWIDTH_DIRECT'",
              hidden: false
            }
          ],
          hints: [
            "Dictionary keys must be hashable.",
            "Standard sets are mutable and cannot be hashed.",
            "Wrap the regions in frozenset(region_pair)."
          ]
        },
        {
          id: "d7-s9-ex2",
          title: "Write Code: Undirected Fiber Cable Network Graph using frozenset",
          type: "write-code",
          tier: "project",
          points: 25,
          contextScenario: "Submarine Telecom Cables, West Africa",
          prompt: "Write a function `build_fiber_network(links)` that accepts a list of 3-tuples `(city_a, city_b, latency_ms)`. It should return a dictionary where each key is an undirected edge `frozenset({city_a, city_b})` and the value is the `latency_ms`. Because the edge is a frozenset, looking up either `frozenset({city_a, city_b})` or `frozenset({city_b, city_a})` must return the same latency.",
          starterCode: "def build_fiber_network(links):\n    # TODO: Build dictionary keyed by frozenset({city_a, city_b})\n    pass",
          solutionCode: "def build_fiber_network(links):\n    network = {}\n    for city_a, city_b, latency in links:\n        edge = frozenset({city_a, city_b})\n        network[edge] = latency\n    return network",
          testCases: [
            {
              id: "tc1",
              label: "Bidirectional latency retrieval",
              setup: "links = [('Lagos', 'Accra', 12.5), ('Lagos', 'London', 85.0)]; net = build_fiber_network(links); res = (net[frozenset({'Accra', 'Lagos'})], net[frozenset({'London', 'Lagos'})])",
              expected: "(12.5, 85.0)",
              hidden: false
            },
            {
              id: "tc2",
              label: "Total edge count",
              setup: "links = [('Lagos', 'Accra', 12.5), ('Accra', 'Lagos', 12.5)]; net = build_fiber_network(links); res = len(net)",
              expected: "1",
              hidden: false
            }
          ],
          hints: [
            "Iterate over each (city_a, city_b, latency) tuple in links.",
            "Construct a frozenset with frozenset({city_a, city_b}).",
            "Store latency under network[frozenset({city_a, city_b})]."
          ]
        }
      ]
    }
  ],
  realWorldLabs: [
    {
      id: "day7-lab1",
      title: "Multi-Channel Financial Customer Identity Graph & Transaction Deduplication Engine",
      description: "Ingest multi-source streaming transaction records from Lagos banking switches, deduplicate customer BVNs across channels (USSD, POS, Mobile, Web), isolate cross-institution customer accounts using set intersections, and detect unlinked accounts using set differences.",
      domain: "Fintech & Open Banking Identity Resolution",
      starterCode: `# Real-World Lab 1: Multi-Channel Customer Identity Resolution Engine

# 1. Raw multi-channel customer BVN feeds with duplicate transmissions
ussd_channel_bvns = ["BVN-001", "BVN-004", "BVN-002", "BVN-001", "BVN-005"]
pos_channel_bvns = ["BVN-002", "BVN-006", "BVN-003", "BVN-004", "BVN-006"]
mobile_app_bvns = ["BVN-001", "BVN-007", "BVN-003", "BVN-002", "BVN-008"]

# Step 1: Deduplicate channel feeds into sets
ussd_set = set(ussd_channel_bvns)
pos_set = set(pos_channel_bvns)
mobile_set = set(mobile_app_bvns)

print("=== RAW FEED DEDUPLICATION ===")
print(f"USSD Unique BVNs:   {len(ussd_set)} (from {len(ussd_channel_bvns)} raw events)")
print(f"POS Unique BVNs:    {len(pos_set)} (from {len(pos_channel_bvns)} raw events)")
print(f"Mobile Unique BVNs: {len(mobile_set)} (from {len(mobile_app_bvns)} raw events)")

# Step 2: Total unique customers across the entire institution (Union)
all_active_customers = ussd_set | pos_set | mobile_set
print(f"\\nTotal Unique Active Customers across all channels: {len(all_active_customers)}")
print("Customer Registry:", sorted(all_active_customers))

# Step 3: Omnichannel Power Users (Present in ALL 3 channels - Intersection)
omnichannel_power_users = ussd_set & pos_set & mobile_set
print(f"\\nOmnichannel Power Users (All 3 Channels): {omnichannel_power_users}")

# Step 4: Digital-Only vs Legacy-Only Analysis (Set Difference)
digital_channels = mobile_set
legacy_channels = ussd_set | pos_set
digital_exclusive = digital_channels - legacy_channels
legacy_exclusive = legacy_channels - digital_channels

print(f"Digital-Exclusive Users (Mobile only): {sorted(digital_exclusive)}")
print(f"Legacy-Exclusive Users (USSD/POS only): {sorted(legacy_exclusive)}")

# Step 5: Discrepancy Verification (Symmetric Difference between USSD and POS)
ussd_pos_divergence = ussd_set ^ pos_set
print(f"\\nUSSD vs POS Channel Divergence (^): {sorted(ussd_pos_divergence)}")`,
      targetOutput: `=== RAW FEED DEDUPLICATION ===
USSD Unique BVNs:   4 (from 5 raw events)
POS Unique BVNs:    4 (from 5 raw events)
Mobile Unique BVNs: 5 (from 5 raw events)

Total Unique Active Customers across all channels: 8
Customer Registry: ['BVN-001', 'BVN-002', 'BVN-003', 'BVN-004', 'BVN-005', 'BVN-006', 'BVN-007', 'BVN-008']

Omnichannel Power Users (All 3 Channels): {'BVN-002'}
Digital-Exclusive Users (Mobile only): ['BVN-007', 'BVN-008']
Legacy-Exclusive Users (USSD/POS only): ['BVN-005', 'BVN-006']

USSD vs POS Channel Divergence (^): ['BVN-001', 'BVN-003', 'BVN-005', 'BVN-006']`
    },
    {
      id: "day7-lab2",
      title: "Central Bank Regulatory Sanctions Screening & Dynamic RBAC Permission Matrix Engine",
      description: "Implement a high-performance regulatory compliance and zero-trust authorization pipeline: screen international Swift transfer parties against CBN/OFAC sanctioned entity sets, evaluate disjointness for clean audits, and enforce group access policies using immutable frozenset keys.",
      domain: "Regulatory Compliance & Information Security",
      starterCode: `# Real-World Lab 2: Sanctions Screening & Dynamic RBAC Matrix Engine

# 1. High-Priority Watchlists & Regulatory Sanctions Sets
cbn_sanctioned_bvns = {"BVN-9999", "BVN-8888", "BVN-7777"}
ofac_blocked_entities = {"ACME_CORP_OFFSHORE", "BLOCKED_HOLDINGS_LTD"}

# Pending wire transfer batches: (transfer_id, origin_bvn, destination_bvn, entity_name, amount_usd)
pending_transfers = [
    ("TRX-001", "BVN-1001", "BVN-2002", "LAGOS_IMPORT_LTD", 45000.0),
    ("TRX-002", "BVN-9999", "BVN-3003", "SWIFT_TRADING_CO", 120000.0), # Flagged!
    ("TRX-003", "BVN-1005", "BVN-4004", "BLOCKED_HOLDINGS_LTD", 80000.0), # Flagged!
    ("TRX-004", "BVN-1008", "BVN-5005", "DELTA_AGRO_SUPPLY", 15000.0),
]

approved_transfers = []
blocked_transfers = []

print("=== SCREENING TRANSACTIONS AGAINST REGULATORY WATCHLISTS ===")
for trx in pending_transfers:
    trx_id, origin, dest, entity, amount = trx
    
    # Check if any party intersects with sanctions (O(1) set membership)
    is_origin_sanctioned = origin in cbn_sanctioned_bvns
    is_dest_sanctioned = dest in cbn_sanctioned_bvns
    is_entity_sanctioned = entity in ofac_blocked_entities
    
    if is_origin_sanctioned or is_dest_sanctioned or is_entity_sanctioned:
        reason = []
        if is_origin_sanctioned: reason.append(f"Origin {origin} in CBN Watchlist")
        if is_dest_sanctioned: reason.append(f"Destination {dest} in CBN Watchlist")
        if is_entity_sanctioned: reason.append(f"Entity '{entity}' in OFAC Sanctions")
        blocked_transfers.append((trx_id, "; ".join(reason)))
        print(f"⛔ BLOCKED {trx_id}: {'; '.join(reason)}")
    else:
        approved_transfers.append(trx)
        print(f"✅ APPROVED {trx_id}: USD {amount:,.2f} for '{entity}'")

print(f"\\nSummary: {len(approved_transfers)} Approved, {len(blocked_transfers)} Blocked")

# 2. Immutable Zero-Trust RBAC Policy Matrix with frozenset keys
rbac_policy_table = {
    frozenset({"TREASURY_OFFICER", "RISK_MANAGER"}): "DUAL_AUTHORIZATION_REQUIRED",
    frozenset({"AUDITOR"}): "READ_ONLY_ACCESS",
    frozenset({"ADMIN", "SUPER_ADMIN"}): "UNRESTRICTED_ACCESS",
}

# Evaluate employee user role tokens
user_roles = frozenset({"RISK_MANAGER", "TREASURY_OFFICER"})
policy = rbac_policy_table.get(user_roles, "ACCESS_DENIED")
print(f"\\nAccess Policy for Roles {user_roles}: {policy}")

# Verify disjointness between Auditor and Treasury roles
auditor_roles = {"AUDITOR", "COMPLIANCE_ANALYST"}
treasury_roles = {"TREASURY_OFFICER", "FX_DEALER"}
print("Segregation of Duties Check (Disjoint):", auditor_roles.isdisjoint(treasury_roles))`,
      targetOutput: `=== SCREENING TRANSACTIONS AGAINST REGULATORY WATCHLISTS ===
✅ APPROVED TRX-001: USD 45,000.00 for 'LAGOS_IMPORT_LTD'
⛔ BLOCKED TRX-002: Origin BVN-9999 in CBN Watchlist
⛔ BLOCKED TRX-003: Entity 'BLOCKED_HOLDINGS_LTD' in OFAC Sanctions
✅ APPROVED TRX-004: USD 15,000.00 for 'DELTA_AGRO_SUPPLY'

Summary: 2 Approved, 2 Blocked

Access Policy for Roles frozenset({'RISK_MANAGER', 'TREASURY_OFFICER'}): DUAL_AUTHORIZATION_REQUIRED
Segregation of Duties Check (Disjoint): True`
    }
  ],
  miniProject: {
    id: "day7-project",
    title: "VennEngine: Relational Set Analytics & Compliance Intelligence System",
    brief: "Build an enterprise analytics and compliance engine that consumes multi-source transaction entities, deduplicates customer records, evaluates complex set intersections and differences, and enforces role-based security access matrices using frozensets.",
    requirements: [
      "Deduplicate raw multi-channel customer ID feeds into clean sets in O(N) time.",
      "Evaluate cross-institution account intersections using the & operator and .intersection().",
      "Calculate regulatory sanctions screening deltas using set difference (-).",
      "Validate role containment and segregation of duties with issubset() and isdisjoint().",
      "Construct immutable RBAC policy mapping with frozenset keys to support multi-role authentication."
    ],
    rubric: [
      { criterion: "Deduplication and Hash Invariants", weight: 35 },
      { criterion: "Mathematical Set Operations & Relational Predicates", weight: 40 },
      { criterion: "frozenset Composite Mapping & Error Handling", weight: 25 }
    ],
    starterCode: `# Day 7 Capstone Mini-Project: VennEngine Analytics & Compliance Intelligence System

class VennEngine:
    def __init__(self):
        self.customers = set()
        self.sanctioned_entities = set()
        self.role_policies = {}

    def register_sanctioned_entities(self, entities):
        """Update sanctions list with any iterable collection of IDs."""
        self.sanctioned_entities.update(entities)

    def ingest_customer_feed(self, raw_feed):
        """Deduplicate raw customer feed in-place and return count of newly added users."""
        incoming_set = set(raw_feed)
        new_users = incoming_set - self.customers
        self.customers.update(new_users)
        return len(new_users)

    def screen_transaction(self, party_a, party_b):
        """Check if parties intersect with sanctions list using set intersection."""
        tx_parties = {party_a, party_b}
        flagged = tx_parties & self.sanctioned_entities
        is_clean = len(flagged) == 0
        return is_clean, flagged

    def compute_overlap_metrics(self, group_a, group_b):
        """Return union, intersection, and symmetric difference between two groups."""
        s_a = set(group_a)
        s_b = set(group_b)
        return {
            "total_unique": len(s_a | s_b),
            "common_members": sorted(s_a & s_b),
            "exclusive_disjunction": sorted(s_a ^ s_b)
        }

    def register_access_policy(self, required_roles, policy_level):
        """Store immutable access policy using frozenset keys."""
        self.role_policies[frozenset(required_roles)] = policy_level

    def evaluate_access(self, user_roles):
        """Lookup policy for an arbitrary role collection."""
        return self.role_policies.get(frozenset(user_roles), "DENIED")

# Run Demonstration Run
engine = VennEngine()
engine.register_sanctioned_entities(["ENT-999", "ENT-888"])

# 1. Ingest customer batches
batch1 = ["CUST-01", "CUST-02", "CUST-01", "CUST-03"]
batch2 = ["CUST-03", "CUST-04", "CUST-05"]
print(f"Batch 1 new users: {engine.ingest_customer_feed(batch1)}")
print(f"Batch 2 new users: {engine.ingest_customer_feed(batch2)}")
print(f"Total customers:   {len(engine.customers)}")

# 2. Sanctions Screening
clean, violations = engine.screen_transaction("CUST-01", "ENT-999")
print(f"\\nTransaction 1 Clean: {clean} (Violations: {violations})")

clean2, violations2 = engine.screen_transaction("CUST-01", "CUST-02")
print(f"Transaction 2 Clean: {clean2} (Violations: {violations2})")

# 3. RBAC Policy Mapping with frozenset
engine.register_access_policy(["FINANCE", "AUDIT"], "HIGH_SECURITY_APPROVED")
current_roles = ["AUDIT", "FINANCE"]
print(f"\\nPolicy Evaluation for {current_roles}: {engine.evaluate_access(current_roles)}")
`
  },
  dayQuiz: {
    title: "Day 7 Comprehensive Mastery Quiz: Sets & Relational Algebra",
    passingScorePercentage: 80,
    questions: [
      {
        id: "d7-q1",
        scenario: "Empty Set Construction in Python",
        question: "What is the result of executing `val = {}; print(type(val))`?",
        options: [
          {
            id: "q1-a",
            text: "<class 'dict'> — because empty curly braces denote an empty dictionary.",
            explanation: "Correct! Dictionaries were added to Python first, so {} creates an empty dict. Empty sets MUST be created with set().",
            isCorrect: true
          },
          {
            id: "q1-b",
            text: "<class 'set'> — curly braces always create a set.",
            explanation: "Incorrect. Curly braces only create a set when populated with lone items {1, 2}.",
            isCorrect: false
          },
          {
            id: "q1-c",
            text: "SyntaxError — empty containers must specify their type.",
            explanation: "Incorrect. {} is completely valid dictionary syntax.",
            isCorrect: false
          },
          {
            id: "q1-d",
            text: "<class 'tuple'> — empty containers default to immutable tuples.",
            explanation: "Incorrect. Empty tuples use ().",
            isCorrect: false
          }
        ],
        points: 10
      },
      {
        id: "d7-q2",
        scenario: "CPython Hash Table Lookup Time Complexity",
        question: "Why does the membership check `item in data_set` execute in O(1) average time, while `item in data_list` executes in O(N) time?",
        options: [
          {
            id: "q2-a",
            text: "Sets use hash bitmasking to directly index hash table buckets, whereas lists perform a sequential linear scan.",
            explanation: "Correct! hash(x) & mask computes the bucket index directly in arithmetic time, whereas a list must iterate sequentially through elements.",
            isCorrect: true
          },
          {
            id: "q2-b",
            text: "Sets sort their elements in memory using quicksort.",
            explanation: "Incorrect. Sets are unordered and unindexed hash tables; they are not sorted.",
            isCorrect: false
          },
          {
            id: "q2-c",
            text: "Lists compress items using Huffman encoding.",
            explanation: "Incorrect. Lists store standard 64-bit PyObject pointers.",
            isCorrect: false
          },
          {
            id: "q2-d",
            text: "Sets only store integers, which are faster to compare than strings.",
            explanation: "Incorrect. Sets store any hashable type (strings, floats, tuples, frozensets).",
            isCorrect: false
          }
        ],
        points: 10
      },
      {
        id: "d7-q3",
        scenario: "Sequence Deduplication and Order Invariant",
        question: "What happens to the order of elements when executing `clean_items = list(set(raw_items))`?",
        options: [
          {
            id: "q3-a",
            text: "Duplicates are removed in O(N) time, but original sequence order is lost due to hash table bucket placement.",
            explanation: "Correct! The hash table layout is governed by hash values, not insertion order. Use list(dict.fromkeys(raw_items)) if order preservation is required.",
            isCorrect: true
          },
          {
            id: "q3-b",
            text: "Elements are guaranteed to remain in their original sequence order.",
            explanation: "Incorrect. Standard sets do not preserve sequence order.",
            isCorrect: false
          },
          {
            id: "q3-c",
            text: "Elements are automatically sorted in ascending alphabetical order.",
            explanation: "Incorrect. Hash table layout is pseudo-random based on hash bits and seed; it is not sorted.",
            isCorrect: false
          },
          {
            id: "q3-d",
            text: "Python raises a ValueError if elements are out of order.",
            explanation: "Incorrect. Set conversion accepts any iterable without error.",
            isCorrect: false
          }
        ],
        points: 10
      },
      {
        id: "d7-q4",
        scenario: "Set add() vs update() String Behavior",
        question: "If `s = set()` and you execute `s.update('CAT')`, what will `len(s)` be?",
        options: [
          {
            id: "q4-a",
            text: "3 — because update() iterates over the string, adding 'C', 'A', and 'T' as separate elements.",
            explanation: "Correct! update() unpacks iterables. To add the string 'CAT' as a single element, use s.add('CAT').",
            isCorrect: true
          },
          {
            id: "q4-b",
            text: "1 — update() inserts the complete string 'CAT'.",
            explanation: "Incorrect. add() inserts the whole string; update() unpacks it.",
            isCorrect: false
          },
          {
            id: "q4-c",
            text: "0 — strings are ignored by update().",
            explanation: "Incorrect. Strings are valid iterables.",
            isCorrect: false
          },
          {
            id: "q4-d",
            text: "TypeError: string is not a set.",
            explanation: "Incorrect. update() accepts any iterable, including strings.",
            isCorrect: false
          }
        ],
        points: 10
      },
      {
        id: "d7-q5",
        scenario: "Safe vs Strict Element Eviction",
        question: "What is the difference between `s.remove(x)` and `s.discard(x)` when `x` is absent from set `s`?",
        options: [
          {
            id: "q5-a",
            text: "remove(x) raises a KeyError, whereas discard(x) silently does nothing.",
            explanation: "Correct! discard() is idempotent and safe for cleanups, while remove() strictly signals unexpected absence with KeyError.",
            isCorrect: true
          },
          {
            id: "q5-b",
            text: "discard(x) raises a KeyError, whereas remove(x) does nothing.",
            explanation: "Incorrect. The behavior is the reverse.",
            isCorrect: false
          },
          {
            id: "q5-c",
            text: "Both methods raise a KeyError.",
            explanation: "Incorrect. discard() never raises KeyError.",
            isCorrect: false
          },
          {
            id: "q5-d",
            text: "Both methods silently return None without error.",
            explanation: "Incorrect. remove() raises KeyError on absent items.",
            isCorrect: false
          }
        ],
        points: 10
      },
      {
        id: "d7-q6",
        scenario: "Set Operator vs Method Operand Compatibility",
        question: "Given `s = {1, 2}` and `lst = [2, 3]`, what is the result of `s & lst` versus `s.intersection(lst)`?",
        options: [
          {
            id: "q6-a",
            text: "`s & lst` raises TypeError, while `s.intersection(lst)` successfully returns {2}.",
            explanation: "Correct! Operators (&, |, -, ^) require set operands on both sides. Methods (.intersection, .union, etc.) accept any iterable.",
            isCorrect: true
          },
          {
            id: "q6-b",
            text: "Both expressions successfully return {2}.",
            explanation: "Incorrect. The & operator raises TypeError: unsupported operand type(s) for &: 'set' and 'list'.",
            isCorrect: false
          },
          {
            id: "q6-c",
            text: "Both expressions raise TypeError.",
            explanation: "Incorrect. The method .intersection() happily accepts lists, tuples, or ranges.",
            isCorrect: false
          },
          {
            id: "q6-d",
            text: "`s.intersection(lst)` mutates lst in place.",
            explanation: "Incorrect. intersection() returns a new set and does not mutate its argument.",
            isCorrect: false
          }
        ],
        points: 10
      },
      {
        id: "d7-q7",
        scenario: "Set Difference Directionality",
        question: "If `A = {1, 2, 3}` and `B = {3, 4, 5}`, what are `A - B` and `B - A`?",
        options: [
          {
            id: "q7-a",
            text: "A - B is {1, 2}, while B - A is {4, 5}.",
            explanation: "Correct! Set difference is non-commutative: A - B keeps elements unique to A; B - A keeps elements unique to B.",
            isCorrect: true
          },
          {
            id: "q7-b",
            text: "Both evaluate to {1, 2, 4, 5}.",
            explanation: "Incorrect. {1, 2, 4, 5} is the symmetric difference A ^ B.",
            isCorrect: false
          },
          {
            id: "q7-c",
            text: "Both evaluate to {3}.",
            explanation: "Incorrect. {3} is the intersection A & B.",
            isCorrect: false
          },
          {
            id: "q7-d",
            text: "A - B is {4, 5}, while B - A is {1, 2}.",
            explanation: "Incorrect. The sets are reversed.",
            isCorrect: false
          }
        ],
        points: 10
      },
      {
        id: "d7-q8",
        scenario: "Set Disjointness Evaluation",
        question: "When does `s1.isdisjoint(s2)` return `True`?",
        options: [
          {
            id: "q8-a",
            text: "When `s1 & s2 == set()` (they share zero common elements).",
            explanation: "Correct! Disjoint sets have an empty intersection with no mutual overlap.",
            isCorrect: true
          },
          {
            id: "q8-b",
            text: "When `s1` and `s2` have identical elements.",
            explanation: "Incorrect. That is equality `s1 == s2`.",
            isCorrect: false
          },
          {
            id: "q8-c",
            text: "When `s1` is a proper subset of `s2`.",
            explanation: "Incorrect. If s1 is a subset of s2, they have maximum overlap.",
            isCorrect: false
          },
          {
            id: "q8-d",
            text: "Only when both `s1` and `s2` are empty sets.",
            explanation: "Incorrect. Non-empty sets with distinct items like {1, 2} and {3, 4} are disjoint.",
            isCorrect: false
          }
        ],
        points: 10
      },
      {
        id: "d7-q9",
        scenario: "Hashability and frozenset Requirements",
        question: "Why does Python raise `TypeError: unhashable type: 'set'` when executing `my_dict[{'admin', 'user'}] = True`?",
        options: [
          {
            id: "q9-a",
            text: "Standard sets are mutable and do not have a __hash__ method; using frozenset({'admin', 'user'}) fixes this.",
            explanation: "Correct! Dictionary keys must be immutable and hashable. Standard sets can be mutated, so Python forbids them as dictionary keys or set members. frozenset provides an immutable, hashable set.",
            isCorrect: true
          },
          {
            id: "q9-b",
            text: "Dictionary keys cannot contain strings.",
            explanation: "Incorrect. Strings are the most common dictionary key type.",
            isCorrect: false
          },
          {
            id: "q9-c",
            text: "Dictionaries only allow integers as keys.",
            explanation: "Incorrect. Any hashable object can be a dictionary key.",
            isCorrect: false
          },
          {
            id: "q9-d",
            text: "Python does not support collections as dictionary keys.",
            explanation: "Incorrect. Tuples and frozensets are collections that make valid keys.",
            isCorrect: false
          }
        ],
        points: 10
      },
      {
        id: "d7-q10",
        scenario: "frozenset Method Availability",
        question: "Which of the following operations is INVALID and will raise an AttributeError on a `frozenset` instance `fs`?",
        options: [
          {
            id: "q10-a",
            text: "fs.add(10)",
            explanation: "Correct! frozenset objects are strictly immutable and have no .add(), .remove(), .discard(), .pop(), or .clear() mutating methods.",
            isCorrect: true
          },
          {
            id: "q10-b",
            text: "fs.union({10, 20})",
            explanation: "Incorrect. union() is a read-only method that returns a new frozenset without mutating fs.",
            isCorrect: false
          },
          {
            id: "q10-c",
            text: "fs.issubset({1, 2, 3})",
            explanation: "Incorrect. issubset() is a read-only predicate supported by frozenset.",
            isCorrect: false
          },
          {
            id: "q10-d",
            text: "len(fs)",
            explanation: "Incorrect. len() works on all collections, including frozenset.",
            isCorrect: false
          }
        ],
        points: 10
      }
    ]
  },
  cheatSheet: [
    {
      category: "Set Creation, Literals & The Empty Set Trap",
      syntax: "s = {item1, item2} | empty_s = set() | empty_d = {}  # dict!",
      description: "Sets are unordered, mutable collections of unique, hashable items. Populated sets use curly braces {1, 2, 3}. Crucial Watch-out: Writing {} creates an empty dictionary (dict), NOT a set! To create an empty set, you MUST use the built-in constructor set(). Sets reject mutable elements (lists/dicts) with TypeError: unhashable type.",
      example: `# 1. Empty set vs empty dict
empty_dict = {}
empty_set = set()
print("type({}):    ", type(empty_dict))  # <class 'dict'>
print("type(set()):", type(empty_set))   # <class 'set'>

# 2. Populated heterogeneous set
profile = {42, "Lagos", 3.14, True, ("NGN", 2026)}
print("Populated set:", profile)

# 3. Rejecting unhashable mutable types
try:
    invalid = {[1, 2, 3]}
except TypeError as err:
    print("Rejected list:", err)`
    },
    {
      category: "Hash Table Architecture & O(1) Fast Membership Testing",
      syntax: "item in s | item not in s | s[0]  # Raises TypeError!",
      description: "CPython implements sets as open-addressing hash tables (PySetObject). The 'in' operator computes hash(item) & mask to jump directly to the memory bucket in O(1) constant time, outperforming O(N) list iteration. Because sets are unordered, direct indexing s[i] and slicing s[a:b] are forbidden and raise TypeError: 'set' object is not subscriptable.",
      example: `authorized_roles = {"ADMIN", "AUDITOR", "TREASURY_OFFICER"}

# Fast O(1) membership testing
user_role = "AUDITOR"
print(f"Is {user_role} authorized?", user_role in authorized_roles)
print("Is GUEST forbidden?       ", "GUEST" not in authorized_roles)

# Sets are unindexed and unsliceable!
try:
    first_role = authorized_roles[0]
except TypeError as err:
    print("Indexing rejected:", err)  # 'set' object is not subscriptable`
    },
    {
      category: "Automatic Deduplication & Sequence Conversion",
      syntax: "unique_set = set(iterable) | unique_list = list(set(raw_list))",
      description: "Sets strictly enforce element uniqueness: duplicates are silently collapsed upon insertion or conversion. Passing any iterable to set() extracts unique elements in O(N) time. Converting a set back to a list with list(set(x)) strips duplicates but scrambles sequence order. To deduplicate while preserving insertion order in Python 3.7+, use list(dict.fromkeys(seq)).",
      example: `raw_phones = ["0801", "0802", "0801", "0803", "0802"]

# Fast O(N) deduplication via set
unique_set = set(raw_phones)
unique_list = list(unique_set)
print("Original count:", len(raw_phones))
print("Unique count:  ", len(unique_set))
print("Deduplicated:  ", unique_list)

# Order-preserving deduplication (Python 3.7+)
ordered_unique = list(dict.fromkeys(raw_phones))
print("Preserved order:", ordered_unique)

# String character deduplication
letters = sorted(set("mississippi"))
print("Unique letters:", letters)`
    },
    {
      category: "Dynamic Element Modification: add() vs update()",
      syntax: "s.add(elem) | s.update(*iterables) | s |= other",
      description: "s.add(x) inserts a single hashable element into the set in-place. If the item already exists, add() has no effect. s.update(*iterables) takes one or more collections and unpacks all their elements into the set. The String Trap: s.add('CAT') adds the single 3-letter word; s.update('CAT') unpacks individual characters 'C', 'A', 'T'. Both methods return None.",
      example: `nodes = {"node-01", "node-02"}

# 1. add() inserts a single item
nodes.add("node-03")
nodes.add("node-01")  # Duplicate: silently ignored
print("After add():", nodes)

# 2. update() unpacks multiple collections
nodes.update(["node-04"], ("node-05", "node-06"))
print("After update():", nodes)

# 3. String Trap: add vs update
s1 = set()
s2 = set()
s1.add("LAGOS")       # {'LAGOS'}
s2.update("LAGOS")    # {'A', 'G', 'L', 'O', 'S'}
print("s1 (add):   ", s1)
print("s2 (update):", s2)`
    },
    {
      category: "Safe vs Strict Eviction: remove() vs discard(), pop() & clear()",
      syntax: "s.remove(x) | s.discard(x) | item = s.pop() | s.clear()",
      description: "s.remove(x) removes x or raises KeyError if x is missing. s.discard(x) deletes x if present, but does nothing if absent (idempotent, never crashes). s.pop() removes and returns an arbitrary element (raises KeyError on empty sets). s.clear() empties the set in-place to set().",
      example: `cart = {"laptop", "mouse", "keyboard"}

# 1. Strict removal with remove()
cart.remove("mouse")
try:
    cart.remove("headphones")  # Missing!
except KeyError as err:
    print("remove() KeyError:", err)

# 2. Idempotent safe removal with discard()
cart.discard("headphones")  # Safe: does nothing
print("After discard:", cart)

# 3. Arbitrary element popping
popped = cart.pop()
print(f"Popped '{popped}', remaining: {cart}")

# 4. Clear in-place
cart.clear()
print("After clear():", cart)`
    },
    {
      category: "Mathematical Operations: Union (|) & Intersection (&)",
      syntax: "u = A | B | u = A.union(*others) | i = A & B | i = A.intersection(*others)",
      description: "Union (|) returns all distinct elements present in either set A, set B, or both. Intersection (&) isolates elements present simultaneously in all participating collections. Crucial distinction: operators (| and &) strictly require both operands to be set types, whereas methods (.union() and .intersection()) accept any iterable (lists, tuples, strings).",
      example: `frontend = {"JS", "TS", "React", "HTML"}
backend = {"Python", "TS", "PostgreSQL", "Docker"}

# 1. Union: all tech skills (| or .union())
all_tech = frontend | backend
print("Union (|):", all_tech)

# 2. Intersection: shared bridge skills (& or .intersection())
bridge_skills = frontend & backend
print("Intersection (&):", bridge_skills)

# 3. Method accepts non-set iterables
devops_list = ["Docker", "Kubernetes", "AWS"]
infra_overlap = backend.intersection(devops_list)
print("Backend & DevOps List:", infra_overlap)`
    },
    {
      category: "Mathematical Operations: Difference (-) & Symmetric Difference (^)",
      syntax: "d = A - B | d = A.difference(B) | xor = A ^ B | xor = A.symmetric_difference(B)",
      description: "Difference (A - B) returns elements in A that are NOT in B. Difference is non-commutative: A - B != B - A. Symmetric Difference (A ^ B) returns elements present in A or B, but NOT in both (exclusive disjunction XOR). Unlike difference, symmetric difference is commutative: A ^ B == B ^ A == (A | B) - (A & B).",
      example: `lagos = {"MacBook", "iPhone", "AirPods", "AppleWatch"}
abuja = {"MacBook", "Dell XPS", "AirPods", "Surface Pro"}

# 1. Directional Difference (Non-commutative)
only_lagos = lagos - abuja
only_abuja = abuja - lagos
print("Only Lagos (Lagos - Abuja):", only_lagos)
print("Only Abuja (Abuja - Lagos):", only_abuja)

# 2. Symmetric Difference (Commutative XOR)
unique_to_one = lagos ^ abuja
print("Symmetric Difference (^):  ", unique_to_one)
print("Commutative check (A^B == B^A):", (lagos ^ abuja) == (abuja ^ lagos))`
    },
    {
      category: "In-Place Augmented Set Algebra",
      syntax: "A |= B (update) | A &= B (intersection_update) | A -= B (difference_update) | A ^= B (symmetric_difference_update)",
      description: "Augmented assignment operators mutate the left-hand set in-place without allocating a new set object. A |= B adds elements of B; A &= B prunes A down to intersecting elements; A -= B evicts all elements of B from A; A ^= B updates A with the symmetric difference. In-place operators require sets; corresponding update methods accept any iterable.",
      example: `s = {1, 2, 3, 4}

# In-place union (|=)
s |= {5, 6}
print("After |=:", s)

# In-place intersection (&=)
s &= {2, 3, 5, 8}
print("After &=:", s)

# In-place difference (-=)
s -= {5}
print("After -=:", s)

# In-place symmetric difference (^=)
s ^= {3, 9}
print("After ^=:", s)`
    },
    {
      category: "Relational Set Predicates: Subsets, Supersets & Disjointness",
      syntax: "A.issubset(B) (A <= B) | A.issuperset(B) (A >= B) | A.isdisjoint(B) | A == B",
      description: "Predicates evaluate boolean relationships between collections. A.issubset(B) (or A <= B) is True if every item in A is in B (proper subset A < B). A.issuperset(B) (or A >= B) is True if A encompasses all items of B (proper superset A > B). A.isdisjoint(B) is True if A & B == set() (zero overlapping items). A == B tests identical content regardless of insertion order.",
      example: `all_perms = {"READ", "WRITE", "DELETE", "AUDIT"}
manager_perms = {"READ", "WRITE"}
guest_perms = {"ANONYMOUS"}

# 1. Subset checks (<= and issubset)
print("Is manager <= all_perms?   ", manager_perms.issubset(all_perms))
print("Is manager proper subset?  ", manager_perms < all_perms)

# 2. Superset checks (>= and issuperset)
print("Does all_perms >= manager? ", all_perms.issuperset(manager_perms))

# 3. Disjoint check (zero mutual overlap)
print("Are manager and guest disjoint?", manager_perms.isdisjoint(guest_perms))

# 4. Equality (order-independent)
print("{1, 2} == {2, 1}:", {1, 2} == {2, 1})`
    },
    {
      category: "Immutable Sets: frozenset() & Composite Dictionary Keys",
      syntax: "fs = frozenset(iterable) | hash(fs) | d[frozenset({a, b})] = val",
      description: "Standard sets are mutable and unhashable (TypeError: unhashable type: 'set'). The frozenset() constructor creates an immutable, read-only set that implements __hash__. Frozensets can be nested inside other sets (sets of sets) and used as composite dictionary keys for multi-tag routing and undirected network graphs. Frozensets support all non-mutating operations (|,-,&,^,issubset).",
      example: `# 1. Mutable set cannot be nested
try:
    nested = {{1, 2}, {3, 4}}
except TypeError as err:
    print("Nested mutable set rejected:", err)

# 2. frozenset is immutable and hashable
fs1 = frozenset(["AUTH", "WRITE"])
fs2 = frozenset(["READ"])
print("frozenset hash:", hash(fs1))

# 3. Set of frozensets (Valid!)
role_matrix = {fs1, fs2}
print("Set of sets length:", len(role_matrix))

# 4. Composite dictionary keys with frozenset
routes = {
    frozenset({"Lagos", "Abuja"}): 45.0,  # 45ms latency
    frozenset({"Lagos", "London"}): 85.0,
}
# Lookup works in either direction!
print("Latency Lagos-Abuja:", routes[frozenset({"Abuja", "Lagos"})])`
    }
  ],
  sourceNotes: [
    "Source attribution: Asabeneh Yetayeh's '30 Days of Python' (Day 7 - Sets).",
    "Covers set creation, empty set syntax vs dict, hash table internals, fast O(1) membership testing, deduplication, add/update, remove/discard/pop/clear, union, intersection, difference, symmetric difference, issubset, issuperset, isdisjoint, and frozenset."
  ]
};
