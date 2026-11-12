/**
 * Day 27: Python with MongoDB (Advanced Python)
 * Part A (Learn) conforming to Sections 10, 13.2, and 14 of the Master Specification.
 * Includes:
 *  - 8 Detailed Subtopics following the 10-step pedagogical structure
 *  - 3 Signature Simulations: mongodb-crud-sim, mongodb-query-sim, mongodb-agg-schema-sim
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_27_MODULE: DayModule = {
  schemaVersion: 1,
  number: 27,
  title: 'Python with MongoDB',
  level: 'advanced',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/27_Day_Python_with_mongodb',
  estimatedMinutes: 75,
  prerequisites: [8, 19],
  objectives: [
    'Understand the NoSQL document model: databases, collections, BSON documents, and 12-byte ObjectId keys',
    'Connect Python to MongoDB safely using MongoClient with connection pooling and environment URIs',
    'Insert single and batch documents via insert_one() and insert_many() and inspect inserted_id',
    'Query documents with find_one(), lazy find() cursors, field projections, sort(), and limit()',
    'Filter nested and numeric fields using query operators ($gt, $gte, $in, $and, $or, $regex)',
    'Modify documents atomically with update_one(), update_many(), $set, $inc, and upsert=True',
    'Remove records safely with delete_one() and delete_many() while avoiding empty-filter wipes',
    'Build aggregation pipelines ($match -> $group -> $sort), create indexes, and choose Embedded vs Referenced schemas',
  ],
  subtopics: [
    {
      id: 'day27-sub1',
      number: 1,
      title: 'NoSQL Document Model, Collections, BSON & ObjectId',
      summary: 'Contrast flexible JSON-like BSON documents and collections with rigid relational tables.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Documents, Collections & BSON Anatomy',
        paragraphs: [
          'Unlike relational databases that enforce fixed column schemas across tables, **MongoDB** stores records as **BSON** (Binary JSON) documents inside **collections**. Each document is a flexible key-value map (very similar to a Python `dict`) supporting nested objects and arrays.',
          'Every document in a collection has a unique **`_id`** primary key. If you omit `_id` on insert, MongoDB/PyMongo automatically generates a 12-byte **`ObjectId`** (24 hex characters encoding timestamp, random value, and counter).',
        ],
        keyTerms: [
          {
            term: 'BSON',
            definition: 'Binary-encoded JSON supporting richer types such as ObjectId, datetime, and 64-bit ints.',
          },
          {
            term: 'ObjectId',
            definition: '12-byte unique primary key automatically assigned to `_id` when omitted.',
          },
        ],
        bulletPoints: [
          'Database -> Collection -> Document maps roughly to Schema -> Table -> Row, without rigid column locks.',
          'Maximum size of a single BSON document in MongoDB is **16 MB**.',
        ],
      },
      visualise: {
        type: 'mongodb-crud-sim',
        title: 'PyMongo Collection & BSON CRUD Inspector',
        badge: 'simulation',
        description: 'Inspect BSON documents and `_id` ObjectId keys inside a live collection.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Modeling a BSON Document & 24-Hex ObjectId in Python',
          runMode: 'real',
          code: `import uuid

def make_object_id():
    return uuid.uuid4().hex[:24]

doc = {
    "_id": make_object_id(),
    "username": "ada_lovelace",
    "skills": ["Python", "Statistics"],
    "profile": {"tier": "pro", "verified": True},
}
print("ID length:", len(doc["_id"]), "Verified:", doc["profile"]["verified"])`,
          expectedOutput: 'ID length: 24 Verified: True',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'uuid.uuid4().hex[:24]',
          internalEffect: 'Generates a 24-character hex identifier modeling a BSON ObjectId.',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 'doc = {"_id": ..., "skills": [...], "profile": {...}}',
          internalEffect: 'Stores nested arrays and subdocuments directly inside one record.',
        },
      ],
      apply: {
        domain: 'Catalog Modeling',
        contextTitle: 'Serializing Flexible Product Specs',
        scenario: 'Store heterogeneous product attributes in a single collection.',
        code: `import json
products = [
    {"sku": "LAP-1", "ram_gb": 16},
    {"sku": "MUG-2", "capacity_ml": 350},
]
print(json.dumps(products))`,
        outcome: '[{"sku": "LAP-1", "ram_gb": 16}, {"sku": "MUG-2", "capacity_ml": 350}]',
      },
      commonMistakes: [
        {
          label: 'Querying _id with a Plain String Instead of ObjectId',
          erroneousCode: `# db.users.find_one({"_id": "65a1f0b2c1a001..."})  # Returns None!`,
          errorMessage: 'Document not found even though _id hex matches',
          explanation: 'In PyMongo, auto-generated `_id` values are `bson.objectid.ObjectId` objects, not `str`. Wrap strings in `ObjectId(id_str)`.',
          correctedCode: `# from bson.objectid import ObjectId\n# db.users.find_one({"_id": ObjectId("65a1f0b2c1a001...")})`,
        },
      ],
      sourceNotes: 'Covers NoSQL document model, BSON, and ObjectId for Day 27.',
      practise: [
        {
          id: 'day27-ex1',
          title: 'ObjectId vs Plain String Lookup Mismatch',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'A Flask endpoint receives `user_id = "65a1f0b2c1a0010000000001"` from the URL and runs `db.users.find_one({"_id": user_id})`, which unexpectedly returns `None` even though the document exists. Why?',
          contextScenario: 'Debugging a user-profile endpoint backed by MongoDB.',
          options: [
            {
              id: 'a',
              text: 'Auto-generated _id values are bson.objectid.ObjectId instances, not plain str; you must wrap user_id in ObjectId(user_id).',
              explanation: 'Correct! BSON ObjectId and Python str are distinct types, so `{"_id": "65a..."}` will not match an ObjectId.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'find_one() cannot query by _id; you must use find_by_id().',
              explanation: 'Incorrect. PyMongo has no `find_by_id()`; `find_one({"_id": ObjectId(user_id)})` is the standard pattern.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '_id is excluded from all queries unless projected.',
              explanation: 'Incorrect. `_id` is always indexed and included by default.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'MongoDB requires uppercase hex strings for _id.',
              explanation: 'Incorrect. ObjectId hex strings are lowercase.',
              isCorrect: false,
            },
          ],
          hints: [
            'What Python/BSON type does MongoDB store in `_id` by default?',
            'Import `ObjectId` from `bson.objectid`.',
          ],
          points: 10,
        },
        {
          id: 'day27-ex2',
          title: 'Predict BSON Document Structure & Nested Access',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'Given `doc = {"_id": "oid_1", "meta": {"region": "eu", "flags": ["vip"]}}`, what does `doc["meta"]["flags"][0]` evaluate to?',
          contextScenario: 'Reading nested subdocument fields from a PyMongo query result.',
          options: [
            {
              id: 'a',
              text: "'vip'",
              explanation: 'Correct! PyMongo deserializes BSON subdocuments into Python dicts and arrays into Python lists.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: "['vip']",
              explanation: 'Incorrect. Indexing `[0]` extracts the first element `"vip"`.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'Raises TypeError because BSON objects are not subscriptable.',
              explanation: 'Incorrect. PyMongo returns standard Python `dict` and `list` objects.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'None',
              explanation: 'Incorrect. The key `"flags"` exists and has `"vip"` at index 0.',
              isCorrect: false,
            },
          ],
          hints: [
            'BSON subdocuments map to Python `dict`.',
            'BSON arrays map to Python `list`.',
          ],
          points: 10,
        },
        {
          id: 'day27-ex3',
          title: 'Validate 24-Hex ObjectId Format',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Write `is_valid_object_id(s)` that returns `True` if `s` is a 24-character hexadecimal string (`0-9`, `a-f`, `A-F`), else `False`.',
          contextScenario: 'Validating incoming URL IDs before calling `ObjectId(s)` in a Flask API.',
          starterCode: `import re

def is_valid_object_id(s):
    # Return True if s is exactly 24 hex characters
    pass

print(is_valid_object_id("65a1f0b2c1a0010000000001"))
print(is_valid_object_id("not-an-oid"))`,
          solutionCode: `import re

def is_valid_object_id(s):
    return bool(isinstance(s, str) and re.fullmatch(r"[0-9a-fA-F]{24}", s))

print(is_valid_object_id("65a1f0b2c1a0010000000001"))
print(is_valid_object_id("not-an-oid"))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Validates 24-hex ObjectId strings',
              setup: 'print(is_valid_object_id("65a1f0b2c1a0010000000001"), is_valid_object_id("bad"))',
              expected: 'True False',
              hidden: false,
            },
          ],
          hints: [
            'Use `re.fullmatch(r"[0-9a-fA-F]{24}", s)`.',
            'Guard with `isinstance(s, str)`.',
          ],
          points: 15,
        },
        {
          id: 'day27-ex4',
          title: 'Document Model Flexibility vs 16 MB BSON Limit',
          type: 'theory-reasoning',
          tier: 'standard',
          prompt: 'Explain why MongoDB collections can store documents with varying fields in the same collection, and why a 16 MB BSON size limit still requires careful schema boundaries.',
          contextScenario: 'Reviewing a NoSQL schema proposal for an IoT telemetry platform.',
          modelAnswer: 'MongoDB is schema-flexible at the collection level because each BSON document is self-describing with its own keys and types. However, every document must fit within 16 MB, so unbounded arrays (like millions of sensor ticks) must be stored in separate referenced documents rather than embedded.',
          markingCriteria: [
            { id: 'mc1', label: 'Explains self-describing per-document fields in a collection', points: 5 },
            { id: 'mc2', label: 'Explains 16 MB BSON limit prevents unbounded embedded arrays', points: 5 },
          ],
          hints: [
            'Each BSON document carries its own field names.',
            'What happens if a single document grows past 16 MB?',
          ],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day27-sub2',
      number: 2,
      title: 'Connecting with PyMongo (MongoClient), Databases & Collections',
      summary: 'Initialize a reusable MongoClient with environment URIs and access lazy databases and collections.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Connection Pooling with MongoClient',
        paragraphs: [
          'In Python, **`pymongo.MongoClient(uri)`** manages an internal thread-safe **connection pool**. Create one `MongoClient` at application startup rather than opening a new client on every HTTP request.',
          'Accessing a database (`db = client["analytics"]`) or collection (`users = db["users"]`) is **lazy**—MongoDB does not actually create the database or collection on disk until you insert the first document.',
        ],
        keyTerms: [
          {
            term: 'MongoClient',
            definition: 'Thread-safe PyMongo client managing TCP connection pools to MongoDB.',
          },
          {
            term: 'Lazy Creation',
            definition: 'Databases and collections are only materialized when the first document or index is written.',
          },
        ],
        bulletPoints: [
          'Store `MONGODB_URI` in environment variables—never hardcode database credentials in source code.',
          'Call `client.admin.command("ping")` at startup to verify connectivity.',
        ],
      },
      visualise: {
        type: 'mongodb-crud-sim',
        title: 'Collection Handle & Lazy Write Behavior',
        badge: 'simulation',
        description: 'Trigger `insert_one` to see how a collection materializes documents.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Modeling Safe MongoClient URI Validation',
          runMode: 'real',
          code: `def connect_db(env, db_name):
    uri = env.get("MONGODB_URI", "").strip()
    if not uri.startswith(("mongodb://", "mongodb+srv://")):
        raise ValueError("Invalid or missing MONGODB_URI")
    return {"db": db_name, "pool_ready": True}

print(connect_db({"MONGODB_URI": "mongodb+srv://cluster.example.net"}, "analytics"))`,
          expectedOutput: "{'db': 'analytics', 'pool_ready': True}",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'uri.startswith(("mongodb://", "mongodb+srv://"))',
          internalEffect: 'Validates that a real MongoDB connection string is provided via environment config.',
        },
      ],
      apply: {
        domain: 'Backend Startup',
        contextTitle: 'Lazy Collection Registry',
        scenario: 'Access `db[collection_name]` lazily without pre-creating empty collections.',
        code: `collections = {}
def get_collection(name):
    return collections.setdefault(name, [])

users = get_collection("users")
users.append({"name": "Ada"})
print(list(collections.keys()), len(users))`,
        outcome: "['users'] 1",
      },
      commonMistakes: [
        {
          label: 'Creating a New MongoClient() Inside Every Request Handler',
          erroneousCode: `# def get_user(): client = MongoClient(URI)  # Exhausts sockets!`,
          errorMessage: 'Connection pool exhaustion and high TLS handshake latency',
          explanation: 'Instantiate `MongoClient` once at module/app startup and reuse it across requests.',
          correctedCode: `# client = MongoClient(os.environ["MONGODB_URI"])  # module-level singleton`,
        },
      ],
      sourceNotes: 'Covers MongoClient and lazy database/collection handles for Day 27.',
      practise: [
        {
          id: 'day27-ex5',
          title: 'Reusing MongoClient Connection Pool Across Requests',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'A web service creates `client = MongoClient(URI)` inside every API route function and experiences socket exhaustion under load. What is the correct fix?',
          contextScenario: 'Fixing connection pool saturation in a production Flask + PyMongo API.',
          options: [
            {
              id: 'a',
              text: 'Instantiate a single MongoClient at module/app startup and reuse it across all requests.',
              explanation: 'Correct! `MongoClient` is thread-safe and manages its own internal connection pool.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'Create a new MongoClient per request and never close it.',
              explanation: 'Incorrect. That leaks sockets and defeats connection pooling.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'Disable TCP pooling completely.',
              explanation: 'Incorrect. Pooling is essential for low-latency reuse of authenticated connections.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Switch from client["db"] to client.get_database().',
              explanation: 'Incorrect. Both access the database on the same client; the issue is creating multiple `MongoClient` instances.',
              isCorrect: false,
            },
          ],
          hints: [
            'Is `MongoClient` thread-safe?',
            'Where should a connection pool live in a web application?',
          ],
          points: 10,
        },
        {
          id: 'day27-ex6',
          title: 'Complete the PyMongo Client & Collection Setup',
          type: 'fill-the-gaps',
          tier: 'foundation',
          prompt: 'Fill in the two PyMongo steps to connect via `os.environ["MONGODB_URI"]` and select the `"orders"` collection.',
          contextScenario: 'Bootstrapping a PyMongo repository module.',
          gaps: [
            {
              id: 'g1',
              beforeText: 'client = ',
              afterText: '(os.environ["MONGODB_URI"])',
              correctAnswer: 'MongoClient',
              options: ['MongoClient', 'connect', 'PyMongoDB', 'Cursor'],
            },
            {
              id: 'g2',
              beforeText: 'orders = client["shop"]',
              afterText: '',
              correctAnswer: '["orders"]',
              options: ['["orders"]', '.table("orders")', '.select("orders")', '("orders")'],
            },
          ],
          hints: [
            'The client class in `pymongo` is `MongoClient`.',
            'Databases and collections support dictionary-style subscripting `db["orders"]`.',
          ],
          points: 10,
        },
        {
          id: 'day27-ex7',
          title: 'Fix Missing URI Scheme Validation',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'Fix `validate_mongo_uri(uri)` so it accepts both `"mongodb://"` and `"mongodb+srv://"` prefixes and rejects empty or `http://` strings.',
          contextScenario: 'Hardening startup configuration checks.',
          starterCode: `def validate_mongo_uri(uri):
    return uri.startswith("http://")  # BUG: wrong scheme!

print(validate_mongo_uri("mongodb+srv://prod.example.net"))`,
          solutionCode: `def validate_mongo_uri(uri):
    return isinstance(uri, str) and uri.strip().startswith(("mongodb://", "mongodb+srv://"))

print(validate_mongo_uri("mongodb+srv://prod.example.net"))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Accepts mongodb:// and mongodb+srv://',
              setup: 'print(validate_mongo_uri("mongodb+srv://x"), validate_mongo_uri("mongodb://localhost"), validate_mongo_uri("http://x"))',
              expected: 'True True False',
              hidden: false,
            },
          ],
          hints: [
            'Pass a tuple `("mongodb://", "mongodb+srv://")` to `.startswith(...)`.',
          ],
          points: 15,
        },
        {
          id: 'day27-ex8',
          title: 'Implement Lazy Database & Collection Handle Registry',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Write `get_collection(cluster, db_name, col_name)` that lazily initializes `cluster[db_name][col_name]` as an empty list if absent and returns that list.',
          contextScenario: 'Modeling MongoDB’s lazy database and collection creation.',
          starterCode: `def get_collection(cluster, db_name, col_name):
    # Lazily create db_name dict and col_name list in cluster, then return it
    pass

c = {}
users = get_collection(c, "app", "users")
users.append({"name": "Ada"})
print(c)`,
          solutionCode: `def get_collection(cluster, db_name, col_name):
    db = cluster.setdefault(db_name, {})
    return db.setdefault(col_name, [])

c = {}
users = get_collection(c, "app", "users")
users.append({"name": "Ada"})
print(c)`,
          testCases: [
            {
              id: 'tc1',
              label: 'Lazily creates db and collection',
              setup: 'c = {}\nu = get_collection(c, "app", "users")\nu.append({"name": "Ada"})\nprint(c)',
              expected: "{'app': {'users': [{'name': 'Ada'}]}}",
              hidden: false,
            },
          ],
          hints: [
            'Use `cluster.setdefault(db_name, {})` for the database.',
            'Use `db.setdefault(col_name, [])` for the collection.',
          ],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day27-sub3',
      number: 3,
      title: 'Inserting Documents (insert_one, insert_many) & Auto _id',
      summary: 'Persist single documents or bulk batches and inspect InsertOneResult / InsertManyResult.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Single vs Bulk Document Insertion',
        paragraphs: [
          'Use **`collection.insert_one(doc)`** to insert a single dictionary; PyMongo returns an `InsertOneResult` whose **`.inserted_id`** holds the new `_id`.',
          'When loading hundreds or thousands of records, **`collection.insert_many(docs, ordered=False)`** sends batches in far fewer network round-trips. Setting `ordered=False` allows remaining valid documents to insert even if one hits a duplicate-key error.',
        ],
        keyTerms: [
          {
            term: 'insert_one(doc)',
            definition: 'Inserts one document and returns `InsertOneResult` with `.inserted_id`.',
          },
          {
            term: 'insert_many(docs, ordered=False)',
            definition: 'Batch-inserts a list of documents in minimal round-trips, continuing past single-doc errors when `ordered=False`.',
          },
        ],
        bulletPoints: [
          '`insert_one(doc)` mutates `doc` in-place to add `"_id"` if it was not already present.',
          'Return `str(result.inserted_id)` when serializing to JSON APIs.',
        ],
      },
      visualise: {
        type: 'mongodb-crud-sim',
        title: 'insert_one() & Auto-Generated _id',
        badge: 'simulation',
        description: 'Click `insert_one` to watch a new BSON document receive an auto-generated `_id`.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Simulating insert_one & insert_many with Auto _id',
          runMode: 'real',
          code: `collection = []
next_id = 1

def insert_many(docs):
    global next_id
    inserted_ids = []
    for d in docs:
        if "_id" not in d:
            d["_id"] = f"oid_{next_id}"
            next_id += 1
        collection.append(d)
        inserted_ids.append(d["_id"])
    return inserted_ids

ids = insert_many([{"sku": "A1"}, {"sku": "B2"}])
print("Inserted IDs:", ids)`,
          expectedOutput: "Inserted IDs: ['oid_1', 'oid_2']",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 7,
          instruction: 'if "_id" not in d: d["_id"] = ...',
          internalEffect: 'Assigns a unique `_id` automatically when the caller omits it.',
        },
      ],
      apply: {
        domain: 'IoT Ingestion',
        contextTitle: 'Batching Sensor Readings',
        scenario: 'Insert a batch of sensor payloads and report inserted count.',
        code: `batch = [{"sensor": "S1", "c": 22.1}, {"sensor": "S2", "c": 23.4}]
inserted = [{"_id": i + 1, **doc} for i, doc in enumerate(batch)]
print("Inserted count:", len(inserted))`,
        outcome: 'Inserted count: 2',
      },
      commonMistakes: [
        {
          label: 'JSON-Serializing ObjectId Directly',
          erroneousCode: `# json.dumps({"id": result.inserted_id})  # TypeError: Object of type ObjectId is not JSON serializable`,
          errorMessage: 'TypeError: Object of type ObjectId is not JSON serializable',
          explanation: 'Convert `ObjectId` to string with `str(result.inserted_id)` before returning JSON.',
          correctedCode: `# json.dumps({"id": str(result.inserted_id)})`,
        },
      ],
      sourceNotes: 'Covers insert_one and insert_many for Day 27.',
      practise: [
        {
          id: 'day27-ex9',
          title: 'Predict JSON Serialization Error with ObjectId',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'After `res = db.orders.insert_one({"item": "SSD"})`, you run `json.dumps({"id": res.inserted_id})`. What happens?',
          contextScenario: 'Returning the newly created document ID from a Flask JSON endpoint.',
          options: [
            {
              id: 'a',
              text: 'Raises TypeError: Object of type ObjectId is not JSON serializable (unless converted with str(...)).',
              explanation: 'Correct! Standard `json.dumps` does not know how to serialize `bson.objectid.ObjectId`; convert with `str(res.inserted_id)`.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'Automatically outputs {"id": "65a..."}.',
              explanation: 'Incorrect. Python’s stdlib `json.dumps` only handles str, int, float, bool, None, list, dict.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'Outputs {"id": null}.',
              explanation: 'Incorrect. `res.inserted_id` is an `ObjectId`, not `None`.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Converts ObjectId to an integer timestamp.',
              explanation: 'Incorrect. It raises `TypeError`.',
              isCorrect: false,
            },
          ],
          hints: [
            'Does Python’s built-in `json.dumps` support custom BSON types?',
            'How do you convert `ObjectId` to a JSON-safe string?',
          ],
          points: 10,
        },
        {
          id: 'day27-ex10',
          title: 'Order the Batch Ingestion Pipeline',
          type: 'order-the-lines',
          tier: 'foundation',
          prompt: 'Order these lines to batch-insert documents with `ordered=False` and print the count of inserted IDs.',
          contextScenario: 'Importing 500 telemetry records into MongoDB.',
          jumbledLines: [
            { id: 'l3', code: 'print("Inserted:", len(res.inserted_ids))', indent: 0 },
            { id: 'l1', code: 'docs = [{"sensor": "T1", "v": 22.4}, {"sensor": "T2", "v": 19.8}]', indent: 0 },
            { id: 'l2', code: 'res = db.readings.insert_many(docs, ordered=False)', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3'],
          hints: [
            'Define `docs` first.',
            'Call `insert_many(docs, ordered=False)` before reading `res.inserted_ids`.',
          ],
          points: 10,
        },
        {
          id: 'day27-ex11',
          title: 'Trace insert_one() In-Place _id Mutation',
          type: 'explain-the-trace',
          tier: 'standard',
          prompt: 'Explain why `doc` contains `"_id"` after `db.users.insert_one(doc)` even though `"_id"` was not in `doc` beforehand.',
          contextScenario: 'Reusing a request payload dict after inserting it into MongoDB.',
          traceStepCode: `doc = {"name": "Ada", "role": "analyst"}
res = db.users.insert_one(doc)
# Now doc == {"name": "Ada", "role": "analyst", "_id": ObjectId("...")}`,
          traceQuestion: 'What side effect does `insert_one(doc)` have on the passed dictionary, and why can this surprise `json.dumps(doc)`?',
          modelAnswer: '`insert_one(doc)` mutates `doc` in-place to attach `"_id": ObjectId(...)` before sending it to MongoDB. If you subsequently pass `doc` directly to `json.dumps(doc)`, it will raise `TypeError` unless `_id` is converted to `str` or omitted.',
          markingCriteria: [
            { id: 'mc1', label: 'Identifies in-place mutation adding _id ObjectId to doc', points: 5 },
            { id: 'mc2', label: 'Explains downstream JSON serialization TypeError if not converted', points: 5 },
          ],
          hints: [
            'PyMongo adds `"_id"` directly to the dictionary you pass in.',
            'What happens when you serialize `ObjectId` with `json.dumps`?',
          ],
          points: 15,
        },
        {
          id: 'day27-ex12',
          title: 'Batch Insert with Duplicate-_id Skip (ordered=False)',
          type: 'write-code',
          tier: 'challenge',
          prompt: 'Write `insert_many_unordered(store, docs)` where `store` is a dict `_id -> doc`. Insert each doc into `store` if `_id` is not already present (assigning `f"oid_{len(store)+1}"` if `_id` is omitted), and return `(inserted_ids, skipped_ids)`.',
          contextScenario: 'Modeling `insert_many(..., ordered=False)` resilience against duplicate keys.',
          starterCode: `def insert_many_unordered(store, docs):
    # Insert docs into store, skipping duplicate _id; return (inserted_ids, skipped_ids)
    pass

s = {"k1": {"_id": "k1", "v": 1}}
print(insert_many_unordered(s, [{"_id": "k1", "v": 2}, {"_id": "k2", "v": 3}]))`,
          solutionCode: `def insert_many_unordered(store, docs):
    inserted, skipped = [], []
    for d in docs:
        oid = d.get("_id")
        if oid is None:
            oid = f"oid_{len(store) + 1}"
            d["_id"] = oid
        if oid in store:
            skipped.append(oid)
        else:
            store[oid] = d
            inserted.append(oid)
    return (inserted, skipped)

s = {"k1": {"_id": "k1", "v": 1}}
print(insert_many_unordered(s, [{"_id": "k1", "v": 2}, {"_id": "k2", "v": 3}]))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Skips duplicate _id and inserts valid docs',
              setup: 's = {"k1": {"_id": "k1"}}\nprint(insert_many_unordered(s, [{"_id": "k1"}, {"_id": "k2"}]))',
              expected: "(['k2'], ['k1'])",
              hidden: false,
            },
          ],
          hints: [
            'Check `if oid in store:` to skip duplicates.',
            'Collect `inserted` and `skipped` lists.',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day27-sub4',
      number: 4,
      title: 'Querying (find_one, find), Cursors, Projections & Sorting',
      summary: 'Fetch single documents or iterate lazy cursors while projecting only needed fields.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Lazy Cursors & Field Projections',
        paragraphs: [
          '**`find_one(filter, projection)`** returns the first matching dictionary or **`None`**. **`find(filter, projection)`** returns a lazy **Cursor** that streams batches from MongoDB as you iterate—never loading 1,000,000 documents into RAM unless you call `list(cursor)`.',
          'Use **projections** like `{"_id": 0, "name": 1, "role": 1}` to return only the fields you need, and chain `.sort("age", -1).limit(10)` for server-side sorting and pagination.',
        ],
        keyTerms: [
          {
            term: 'Cursor',
            definition: 'Lazy iterable returned by `find()` that fetches result batches on demand.',
          },
          {
            term: 'Projection',
            definition: 'Second dict argument to `find()` specifying included (`1`) or excluded (`0`) fields.',
          },
        ],
        bulletPoints: [
          'In a projection, you cannot mix `1` and `0`—the only exception is `{"_id": 0, "name": 1}`.',
          'Always apply `.limit(n)` on unbounded user-facing queries.',
        ],
      },
      visualise: {
        type: 'mongodb-query-sim',
        title: 'MongoDB Query Operators & Projection Lab',
        badge: 'simulation',
        description: 'Toggle `_id: 0 (hidden)` vs `_id: 1 (shown)` to see how projections shape returned documents.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Filtering, Projecting & Sorting Documents in Python',
          runMode: 'real',
          code: `docs = [
    {"_id": 1, "name": "Ada", "score": 95},
    {"_id": 2, "name": "Bob", "score": 72},
    {"_id": 3, "name": "Clara", "score": 88},
]

top_two = sorted(docs, key=lambda d: -d["score"])[:2]
projected = [{"name": d["name"], "score": d["score"]} for d in top_two]
print(projected)`,
          expectedOutput: "[{'name': 'Ada', 'score': 95}, {'name': 'Clara', 'score': 88}]",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 7,
          instruction: 'sorted(docs, key=lambda d: -d["score"])[:2]',
          internalEffect: 'Models `.sort("score", -1).limit(2)` descending sort + limit.',
        },
        {
          step: 2,
          codeLine: 8,
          instruction: '[{"name": d["name"], "score": d["score"]} ...]',
          internalEffect: 'Models `{"_id": 0, "name": 1, "score": 1}` projection.',
        },
      ],
      apply: {
        domain: 'Leaderboard API',
        contextTitle: 'Paginating Top Players with Skip & Limit',
        scenario: 'Return page 2 (2 items per page) of sorted scores.',
        code: `scores = [{"user": "A", "pts": 50}, {"user": "B", "pts": 40}, {"user": "C", "pts": 30}]
page_2 = scores[2:4]  # .skip(2).limit(2)
print(page_2)`,
        outcome: "[{'user': 'C', 'pts': 30}]",
      },
      commonMistakes: [
        {
          label: 'Mixing Inclusion and Exclusion in a Projection',
          erroneousCode: `# db.users.find({}, {"name": 1, "password_hash": 0})  # OperationFailure!`,
          errorMessage: 'pymongo.errors.OperationFailure: Cannot do exclusion on field password_hash in inclusion projection',
          explanation: 'Either list only included fields (`{"_id": 0, "name": 1}`) or only excluded fields (`{"password_hash": 0}`).',
          correctedCode: `# db.users.find({}, {"password_hash": 0})`,
        },
      ],
      sourceNotes: 'Covers find_one, find cursors, projections, and sorting for Day 27.',
      practise: [
        {
          id: 'day27-ex13',
          title: 'Projection Mixing Rules in PyMongo',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Which projection dictionary is VALID in `db.users.find({}, projection)` without raising `OperationFailure`?',
          contextScenario: 'Returning public user profiles without leaking `password_hash`.',
          options: [
            {
              id: 'a',
              text: '{"_id": 0, "name": 1, "role": 1}',
              explanation: 'Correct! `_id: 0` is the one exclusion allowed alongside inclusion (`1`) fields.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: '{"name": 1, "password_hash": 0}',
              explanation: 'Incorrect. Mixing inclusion (`1`) and exclusion (`0`) on non-`_id` fields raises `OperationFailure`.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '{"role": 1, "secret": 0}',
              explanation: 'Incorrect. Same illegal mix of inclusion and exclusion.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: '{"_id": 1, "password_hash": 0}',
              explanation: 'Incorrect. `_id` is already included by default; mixing `1` and `0` still fails.',
              isCorrect: false,
            },
          ],
          hints: [
            'Can you mix `1` and `0` in a MongoDB projection?',
            'Which single field is the exception when set to `0`?',
          ],
          points: 10,
        },
        {
          id: 'day27-ex14',
          title: 'Predict Cursor Sort & Limit Output',
          type: 'predict-output',
          tier: 'standard',
          prompt: 'Given 3 scores `[40, 95, 72]`, what does `.sort("pts", -1).limit(2)` return?',
          contextScenario: 'Fetching the top 2 leaderboard entries.',
          options: [
            {
              id: 'a',
              text: '[95, 72]',
              explanation: 'Correct! `-1` sorts descending (95, 72, 40) and `.limit(2)` keeps the first 2.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: '[40, 72]',
              explanation: 'Incorrect. `1` is ascending; `-1` is descending.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '[72, 95]',
              explanation: 'Incorrect. Descending order puts 95 before 72.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: '[95, 72, 40]',
              explanation: 'Incorrect. `.limit(2)` caps the result at 2 documents.',
              isCorrect: false,
            },
          ],
          hints: [
            '`-1` means descending in PyMongo.',
            '`.limit(2)` takes only the first 2 documents.',
          ],
          points: 15,
        },
        {
          id: 'day27-ex15',
          title: 'Fix Ascending vs Descending Sort Direction',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'Fix `top_n_docs(docs, field, n)` so it sorts descending (highest first) like `.sort(field, -1).limit(n)`.',
          contextScenario: 'Returning the most expensive orders first.',
          starterCode: `def top_n_docs(docs, field, n):
    return sorted(docs, key=lambda d: d[field])[:n]  # BUG: ascending instead of descending!

orders = [{"id": 1, "amt": 20}, {"id": 2, "amt": 90}, {"id": 3, "amt": 50}]
print(top_n_docs(orders, "amt", 2))`,
          solutionCode: `def top_n_docs(docs, field, n):
    return sorted(docs, key=lambda d: d[field], reverse=True)[:n]

orders = [{"id": 1, "amt": 20}, {"id": 2, "amt": 90}, {"id": 3, "amt": 50}]
print(top_n_docs(orders, "amt", 2))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Sorts descending and limits to n',
              setup: 'o = [{"id": 1, "amt": 20}, {"id": 2, "amt": 90}, {"id": 3, "amt": 50}]\nprint([d["id"] for d in top_n_docs(o, "amt", 2)])',
              expected: '[2, 3]',
              hidden: false,
            },
          ],
          hints: [
            'Pass `reverse=True` to `sorted(...)`.',
          ],
          points: 15,
        },
        {
          id: 'day27-ex16',
          title: 'Implement Inclusion & Exclusion Projection Helper',
          type: 'write-code',
          tier: 'challenge',
          prompt: 'Write `project_doc(doc, fields, exclude_id=True)` returning a new dict containing only keys in `fields` (plus `"_id"` if `not exclude_id` and `"_id"` is in `doc`).',
          contextScenario: 'Implementing server-side field projection for a document store.',
          starterCode: `def project_doc(doc, fields, exclude_id=True):
    # Return projected dict with only keys in fields (and _id if not exclude_id)
    pass

d = {"_id": 1, "name": "Ada", "role": "admin", "secret": "xyz"}
print(project_doc(d, ["name", "role"], exclude_id=True))`,
          solutionCode: `def project_doc(doc, fields, exclude_id=True):
    allowed = set(fields)
    if not exclude_id and "_id" in doc:
        allowed.add("_id")
    return {k: v for k, v in doc.items() if k in allowed}

d = {"_id": 1, "name": "Ada", "role": "admin", "secret": "xyz"}
print(project_doc(d, ["name", "role"], exclude_id=True))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Projects allowed fields cleanly',
              setup: 'd = {"_id": 1, "name": "Ada", "role": "admin", "secret": "xyz"}\nprint(project_doc(d, ["name"], True), project_doc(d, ["name"], False))',
              expected: "{'name': 'Ada'} {'_id': 1, 'name': 'Ada'}",
              hidden: false,
            },
          ],
          hints: [
            'Build `allowed = set(fields)`.',
            'If `not exclude_id`, add `"_id"` to `allowed`.',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day27-sub5',
      number: 5,
      title: 'Query Operators ($gt, $gte, $in, $and, $or, $regex)',
      summary: 'Express rich range, membership, logical, and pattern filters in MongoDB query dicts.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Expressive Filter Predicates with $-Operators',
        paragraphs: [
          'MongoDB uses **`$`-prefixed operators** inside filter dictionaries: **`$gt` / `$gte` / `$lt` / `$lte`** for comparisons, **`$in` / `$nin`** for list membership, **`$and` / `$or`** for boolean combinations, and **`$regex`** for pattern matching.',
          'Multiple keys in the same filter dict (`{"age": {"$gte": 25}, "role": "analyst"}`) are combined with an **implicit `$and`**. Use explicit **`{"$or": [...]}`** when any condition can match.',
        ],
        keyTerms: [
          {
            term: '$in / $gte',
            definition: 'Membership (`{"role": {"$in": ["admin", "lead"]}}`) and range (`{"age": {"$gte": 25}}`) operators.',
          },
          {
            term: '$or',
            definition: 'Logical disjunction taking a list of sub-filter dicts.',
          },
        ],
        bulletPoints: [
          'In Python dicts, keys must be unique—use explicit `"$and": [...]` when applying two constraints to the same field or combining `$or` clauses.',
          'Use anchored regex `^prefix` so MongoDB can leverage an index.',
        ],
      },
      visualise: {
        type: 'mongodb-query-sim',
        title: 'Query Operators ($gte, $in, Implicit $and)',
        badge: 'simulation',
        description: 'Switch between `$gte: 25`, `$in: [admin, analyst]`, and `Implicit $and` presets.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Evaluating $gte and $in Query Predicates in Python',
          runMode: 'real',
          code: `users = [
    {"name": "Ada", "age": 29, "role": "admin"},
    {"name": "Bob", "age": 21, "role": "viewer"},
    {"name": "Clara", "age": 34, "role": "analyst"},
]

matches = [
    u["name"]
    for u in users
    if u["age"] >= 25 and u["role"] in ("admin", "analyst")
]
print("Matched:", matches)`,
          expectedOutput: "Matched: ['Ada', 'Clara']",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 9,
          instruction: 'u["age"] >= 25 and u["role"] in ("admin", "analyst")',
          internalEffect: 'Models `{"age": {"$gte": 25}, "role": {"$in": ["admin", "analyst"]}}`.',
        },
      ],
      apply: {
        domain: 'Log Search',
        contextTitle: 'Filtering Errors with $or Logic',
        scenario: 'Find events where `level == "CRITICAL"` or `latency_ms > 500`.',
        code: `logs = [{"id": 1, "level": "INFO", "ms": 600}, {"id": 2, "level": "INFO", "ms": 20}]
alerts = [l["id"] for l in logs if l["level"] == "CRITICAL" or l["ms"] > 500]
print("Alert IDs:", alerts)`,
        outcome: 'Alert IDs: [1]',
      },
      commonMistakes: [
        {
          label: 'Forgetting Quotes Around $ Operators in Python',
          erroneousCode: `# db.users.find({"age": {$gte: 25}})  # SyntaxError in Python!`,
          errorMessage: 'SyntaxError: invalid syntax',
          explanation: 'MongoDB query operators are Python dictionary string keys: `"$gte"`, `"$in"`, `"$or"`.',
          correctedCode: `# db.users.find({"age": {"$gte": 25}})`,
        },
      ],
      sourceNotes: 'Covers MongoDB query operators for Day 27.',
      practise: [
        {
          id: 'day27-ex17',
          title: 'Combining Multiple Constraints on the Same Field',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'You need to query `price >= 10` AND `price <= 50` in a single MongoDB filter dict. Which syntax is valid in Python?',
          contextScenario: 'Filtering e-commerce products by price range.',
          options: [
            {
              id: 'a',
              text: '{"price": {"$gte": 10, "$lte": 50}}',
              explanation: 'Correct! Multiple operators on the same field go inside the nested operator dict.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: '{"price": {"$gte": 10}, "price": {"$lte": 50}}',
              explanation: 'Incorrect. Duplicate `"price"` keys in a Python dict overwrite the first key!',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '{"price": ($gte 10 and $lte 50)}',
              explanation: 'Incorrect. Invalid Python syntax.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: '{"$between": ["price", 10, 50]}',
              explanation: 'Incorrect. MongoDB has no `$between` operator.',
              isCorrect: false,
            },
          ],
          hints: [
            'Python dicts cannot have two identical `"price"` keys.',
            'Nest both `"$gte"` and `"$lte"` inside `{"price": {...}}`.',
          ],
          points: 10,
        },
        {
          id: 'day27-ex18',
          title: 'Complete the $in and $or Query Filter',
          type: 'fill-the-gaps',
          tier: 'standard',
          prompt: 'Fill in the two MongoDB operators to match documents where `tier` is in `["gold", "platinum"]` OR `vip` is `True`.',
          contextScenario: 'Selecting priority customers for early feature access.',
          gaps: [
            {
              id: 'g1',
              beforeText: 'query = {"',
              afterText: '": [{"tier": {"',
              correctAnswer: '$or',
              options: ['$or', '$and', '$any', '$in'],
            },
            {
              id: 'g2',
              beforeText: '',
              afterText: '": ["gold", "platinum"]}}, {"vip": True}]}',
              correctAnswer: '$in',
              options: ['$in', '$contains', '$or', '$eq'],
            },
          ],
          hints: [
            'Disjunction across a list of sub-queries uses `"$or"`.',
            'List membership uses `"$in"`.',
          ],
          points: 15,
        },
        {
          id: 'day27-ex19',
          title: 'Order the MongoDB Query Evaluation Steps',
          type: 'order-the-lines',
          tier: 'foundation',
          prompt: 'Order the steps to filter `age >= 25` and `role in ["admin", "analyst"]`, then collect names.',
          contextScenario: 'Implementing a filtered user query in Python.',
          jumbledLines: [
            { id: 'l2', code: 'matched = [u for u in users if u["age"] >= 25 and u["role"] in ("admin", "analyst")]', indent: 0 },
            { id: 'l1', code: 'users = [{"name": "Ada", "age": 29, "role": "admin"}, {"name": "Bob", "age": 20, "role": "admin"}]', indent: 0 },
            { id: 'l3', code: 'print([u["name"] for u in matched])', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3'],
          hints: [
            'Define `users` first.',
            'Filter `matched` before printing names.',
          ],
          points: 10,
        },
        {
          id: 'day27-ex20',
          title: 'Implement Dynamic $gte / $in / $or Filter Evaluator',
          type: 'write-code',
          tier: 'challenge',
          prompt: 'Write `match_docs(docs, min_score, allowed_roles)` returning docs where `doc["score"] >= min_score and doc["role"] in allowed_roles`.',
          contextScenario: 'Evaluating MongoDB-style `$gte` and `$in` predicates in-memory.',
          starterCode: `def match_docs(docs, min_score, allowed_roles):
    # Return docs matching score >= min_score and role in allowed_roles
    pass

data = [{"id": 1, "score": 85, "role": "admin"}, {"id": 2, "score": 60, "role": "admin"}]
print(match_docs(data, 80, ["admin", "lead"]))`,
          solutionCode: `def match_docs(docs, min_score, allowed_roles):
    role_set = set(allowed_roles)
    return [d for d in docs if d["score"] >= min_score and d["role"] in role_set]

data = [{"id": 1, "score": 85, "role": "admin"}, {"id": 2, "score": 60, "role": "admin"}]
print(match_docs(data, 80, ["admin", "lead"]))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Filters by $gte and $in',
              setup: 'd = [{"id": 1, "score": 85, "role": "admin"}, {"id": 2, "score": 60, "role": "admin"}]\nprint(match_docs(d, 80, ["admin"]))',
              expected: "[{'id': 1, 'score': 85, 'role': 'admin'}]",
              hidden: false,
            },
          ],
          hints: [
            'Convert `allowed_roles` to a `set` for O(1) lookup.',
            'Filter with `d["score"] >= min_score and d["role"] in role_set`.',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day27-sub6',
      number: 6,
      title: 'Updating Documents (update_one, update_many, $set, $inc, upsert)',
      summary: 'Apply atomic field updates without overwriting entire documents and handle insert-or-update with upsert.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Atomic Updates with $set & $inc',
        paragraphs: [
          'In PyMongo, **`update_one(filter, update, upsert=False)`** and **`update_many(...)`** require an **update operator** such as **`$set`** (set specific fields) or **`$inc`** (increment numeric counters atomically).',
          'Passing `upsert=True` creates a new document if no document matches `filter`—ideal for idempotent counters or syncing external records.',
        ],
        keyTerms: [
          {
            term: '$set / $inc',
            definition: 'Update operators that modify specific fields or atomically add to numeric values.',
          },
          {
            term: 'upsert=True',
            definition: 'Updates the matching document if found, or inserts a new document if no match exists.',
          },
        ],
        bulletPoints: [
          'Modern PyMongo raises `ValueError` if you omit `$` update operators in `update_one()` (use `replace_one()` to replace a full doc).',
          'Inspect `result.matched_count` and `result.modified_count` to verify updates.',
        ],
      },
      visualise: {
        type: 'mongodb-crud-sim',
        title: 'Atomic update_one ($set & $inc)',
        badge: 'simulation',
        description: 'Click `update_one ($set/$inc)` to increment Ada’s credits by 50 and set role to `lead`.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Atomic $set, $inc, and upsert=True Simulation',
          runMode: 'real',
          code: `accounts = {"ada": {"user": "ada", "credits": 100}}

def upsert_inc(store, key, delta):
    if key not in store:
        store[key] = {"user": key, "credits": 0}
    store[key]["credits"] += delta

upsert_inc(accounts, "ada", 50)
upsert_inc(accounts, "grace", 25)
print(accounts["ada"]["credits"], accounts["grace"]["credits"])`,
          expectedOutput: '150 25',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'if key not in store: store[key] = ...',
          internalEffect: 'Implements `upsert=True` by creating the document if missing before incrementing.',
        },
      ],
      apply: {
        domain: 'Quota Tracking',
        contextTitle: 'Incrementing Daily API Usage Counters',
        scenario: 'Atomically increment `requests` for an API key.',
        code: `usage = {"key_1": {"requests": 9}}
usage["key_1"]["requests"] += 1
print("Updated requests:", usage["key_1"]["requests"])`,
        outcome: 'Updated requests: 10',
      },
      commonMistakes: [
        {
          label: 'Passing a Plain Dict Without $set to update_one()',
          erroneousCode: `# db.users.update_one({"name": "Ada"}, {"role": "lead"})`,
          errorMessage: 'ValueError: update only works with $ operators',
          explanation: 'Always wrap partial field updates in `{"$set": {...}}`.',
          correctedCode: `# db.users.update_one({"name": "Ada"}, {"$set": {"role": "lead"}})`,
        },
      ],
      sourceNotes: 'Covers update_one, update_many, $set, $inc, and upsert for Day 27.',
      practise: [
        {
          id: 'day27-ex21',
          title: 'Why update_one() Requires $set / $inc Operators',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'You run `db.users.update_one({"name": "Ada"}, {"credits": 200})` and PyMongo raises `ValueError: update only works with $ operators`. What is the fix?',
          contextScenario: 'Updating a customer credit balance in PyMongo.',
          options: [
            {
              id: 'a',
              text: 'Wrap the update fields in {"$set": {"credits": 200}} (or use {"$inc": ...} for increments).',
              explanation: 'Correct! `update_one()` requires `$` update operators so partial updates never accidentally wipe other fields.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'Use update_many() instead.',
              explanation: 'Incorrect. `update_many()` also requires `$` update operators.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'Pass upsert=True.',
              explanation: 'Incorrect. `upsert=True` still requires `$` update operators.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Use insert_one() to overwrite the document.',
              explanation: 'Incorrect. `insert_one()` raises `DuplicateKeyError` if `_id` already exists.',
              isCorrect: false,
            },
          ],
          hints: [
            'What operator sets specific fields without replacing the entire document?',
            'Check `{"$set": {...}}`.',
          ],
          points: 10,
        },
        {
          id: 'day27-ex22',
          title: 'Trace upsert=True Counter Behavior',
          type: 'explain-the-trace',
          tier: 'challenge',
          prompt: 'Trace `db.quotas.update_one({"tenant": "acme"}, {"$inc": {"calls": 1}}, upsert=True)` on both the 1st and 2nd API calls when `"acme"` does not initially exist.',
          contextScenario: 'Implementing idempotent rate-limit counters in MongoDB.',
          traceStepCode: `Call 1: db.quotas.update_one({"tenant": "acme"}, {"$inc": {"calls": 1}}, upsert=True)
Call 2: db.quotas.update_one({"tenant": "acme"}, {"$inc": {"calls": 1}}, upsert=True)`,
          traceQuestion: 'What document exists after Call 1 and after Call 2?',
          modelAnswer: 'On Call 1, no document matches `{"tenant": "acme"}`, so `upsert=True` creates `{"tenant": "acme", "calls": 1}` (initializing `calls` from 0 + 1). On Call 2, the document matches and `$inc` atomically increments `calls` to `2`.',
          markingCriteria: [
            { id: 'mc1', label: 'Explains Call 1 inserts new doc with tenant="acme" and calls=1', points: 5 },
            { id: 'mc2', label: 'Explains Call 2 matches existing doc and increments calls to 2', points: 5 },
          ],
          hints: [
            'What does `upsert=True` do when `matched_count == 0`?',
            'What value does `$inc` start from on a newly created field?',
          ],
          points: 15,
        },
        {
          id: 'day27-ex23',
          title: 'Fix Missing Upsert Initialization on Counter',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'Fix `inc_quota(store, tenant)` so it initializes missing tenants with `0` before incrementing (like `upsert=True`), instead of raising `KeyError`.',
          contextScenario: 'Tracking per-tenant API calls.',
          starterCode: `def inc_quota(store, tenant):
    store[tenant]["calls"] += 1  # BUG: KeyError if tenant not in store!

quotas = {}
inc_quota(quotas, "acme")
print(quotas["acme"]["calls"])`,
          solutionCode: `def inc_quota(store, tenant):
    if tenant not in store:
        store[tenant] = {"tenant": tenant, "calls": 0}
    store[tenant]["calls"] += 1

quotas = {}
inc_quota(quotas, "acme")
print(quotas["acme"]["calls"])`,
          testCases: [
            {
              id: 'tc1',
              label: 'Upserts missing tenant and increments',
              setup: 'q = {}\ninc_quota(q, "acme")\ninc_quota(q, "acme")\nprint(q["acme"]["calls"])',
              expected: '2',
              hidden: false,
            },
          ],
          hints: [
            'Check `if tenant not in store:` and create `{"tenant": tenant, "calls": 0}`.',
          ],
          points: 15,
        },
        {
          id: 'day27-ex24',
          title: 'Implement Atomic $set + $inc Update Engine',
          type: 'write-code',
          tier: 'challenge',
          prompt: 'Write `apply_update(doc, set_fields=None, inc_fields=None)` that updates a copy of `doc` by setting any keys in `set_fields` and incrementing any keys in `inc_fields` (defaulting missing numeric keys to 0).',
          contextScenario: 'Simulating MongoDB’s `$set` and `$inc` operators.',
          starterCode: `def apply_update(doc, set_fields=None, inc_fields=None):
    # Return updated copy applying $set and $inc
    pass

d = {"name": "Ada", "credits": 100}
print(apply_update(d, {"role": "lead"}, {"credits": 50, "bonus": 10}))`,
          solutionCode: `def apply_update(doc, set_fields=None, inc_fields=None):
    out = dict(doc)
    for k, v in (set_fields or {}).items():
        out[k] = v
    for k, delta in (inc_fields or {}).items():
        out[k] = out.get(k, 0) + delta
    return out

d = {"name": "Ada", "credits": 100}
print(apply_update(d, {"role": "lead"}, {"credits": 50, "bonus": 10}))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Applies $set and $inc cleanly',
              setup: 'd = {"name": "Ada", "credits": 100}\nprint(apply_update(d, {"role": "lead"}, {"credits": 50, "bonus": 10}))',
              expected: "{'name': 'Ada', 'credits': 150, 'role': 'lead', 'bonus': 10}",
              hidden: false,
            },
          ],
          hints: [
            'Copy `doc` with `out = dict(doc)`.',
            'Use `out.get(k, 0) + delta` for `$inc`.',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day27-sub7',
      number: 7,
      title: 'Deleting Documents (delete_one, delete_many) & Safe Filtering',
      summary: 'Remove single or bulk documents safely and inspect DeleteResult.deleted_count.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Targeted Deletion & Guarding Against Empty Filters',
        paragraphs: [
          'PyMongo provides **`delete_one(filter)`** (removes at most 1 matching document) and **`delete_many(filter)`** (removes all matching documents). Both return a `DeleteResult` with **`.deleted_count`**.',
          'Never pass an unvalidated empty dictionary `{}` to `delete_many({})`—that deletes **every document** in the collection! Always validate filter keys before running bulk deletes.',
        ],
        keyTerms: [
          {
            term: 'delete_one(filter)',
            definition: 'Deletes the first document matching `filter` and reports `deleted_count` (0 or 1).',
          },
          {
            term: 'delete_many(filter)',
            definition: 'Deletes all documents matching `filter`; `{}` wipes the entire collection.',
          },
        ],
        bulletPoints: [
          'Prefer `delete_one({"_id": obj_id})` when deleting a specific record.',
          'Consider soft-deletes (`$set: {"deleted_at": ...}`) for audit-sensitive financial or healthcare data.',
        ],
      },
      visualise: {
        type: 'mongodb-crud-sim',
        title: 'delete_one() & deleted_count Inspector',
        badge: 'simulation',
        description: 'Click `delete_one` to remove Linus and observe `deleted_count=1`.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Guarded delete_many() Helper Preventing Empty-Filter Wipes',
          runMode: 'real',
          code: `def safe_delete_by_status(docs, status):
    if not status:
        raise ValueError("Refusing empty delete filter")
    kept = [d for d in docs if d.get("status") != status]
    return kept, len(docs) - len(kept)

rows = [{"id": 1, "status": "expired"}, {"id": 2, "status": "active"}]
remaining, deleted = safe_delete_by_status(rows, "expired")
print("Deleted:", deleted, "Remaining:", remaining)`,
          expectedOutput: "Deleted: 1 Remaining: [{'id': 2, 'status': 'active'}]",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'if not status: raise ValueError(...)',
          internalEffect: 'Guards against accidental full-collection deletion.',
        },
      ],
      apply: {
        domain: 'Session Cleanup',
        contextTitle: 'Purging Expired Auth Tokens',
        scenario: 'Remove sessions with `ttl <= 0` and report deleted count.',
        code: `sessions = [{"sid": "s1", "ttl": 0}, {"sid": "s2", "ttl": 300}]
active = [s for s in sessions if s["ttl"] > 0]
print("Purged:", len(sessions) - len(active))`,
        outcome: 'Purged: 1',
      },
      commonMistakes: [
        {
          label: 'Passing {} to delete_many() When Filter Variable Is Empty',
          erroneousCode: `# db.orders.delete_many(user_filter)  # If user_filter == {}, wipes all orders!`,
          errorMessage: 'Catastrophic Data Loss: Entire collection deleted',
          explanation: 'Always assert `if not user_filter: raise ValueError(...)` before calling `delete_many`.',
          correctedCode: `# if not user_filter: raise ValueError("Empty filter")\n# db.orders.delete_many(user_filter)`,
        },
      ],
      sourceNotes: 'Covers delete_one and delete_many safety for Day 27.',
      practise: [
        {
          id: 'day27-ex25',
          title: 'Predict Consequence of delete_many({})',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'A cleanup script builds `flt = {}` when no query parameters are supplied and runs `db.invoices.delete_many(flt)`. What happens?',
          contextScenario: 'Auditing a dangerous bug in a maintenance script.',
          options: [
            {
              id: 'a',
              text: 'Every document in the invoices collection is deleted.',
              explanation: 'Correct! An empty filter `{}` matches all documents, so `delete_many({})` wipes the entire collection.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'PyMongo raises ValueError on an empty filter.',
              explanation: 'Incorrect. PyMongo executes `delete_many({})` unless your own code guards against empty filters.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'Zero documents are deleted.',
              explanation: 'Incorrect. `{}` matches everything, not nothing.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Only the oldest document is deleted.',
              explanation: 'Incorrect. `delete_many` deletes all matching documents.',
              isCorrect: false,
            },
          ],
          hints: [
            'What does `{}` match in `find({})`?',
            '`delete_many({})` uses the exact same filter matching.',
          ],
          points: 10,
        },
        {
          id: 'day27-ex26',
          title: 'Fix Empty Filter Guard Before Bulk Delete',
          type: 'fix-the-bug',
          tier: 'challenge',
          prompt: 'Fix `delete_matching(docs, key, val)` so it raises `ValueError` if `key` or `val` is empty/None instead of deleting records.',
          contextScenario: 'Preventing accidental bulk data loss in a repository helper.',
          starterCode: `def delete_matching(docs, key, val):
    kept = [d for d in docs if d.get(key) != val]  # BUG: no guard if key/val empty!
    return kept

print(delete_matching([{"id": 1, "status": "old"}], "status", "old"))`,
          solutionCode: `def delete_matching(docs, key, val):
    if not key or val is None or val == "":
        raise ValueError("Empty delete filter is not allowed")
    return [d for d in docs if d.get(key) != val]

print(delete_matching([{"id": 1, "status": "old"}], "status", "old"))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Deletes matching docs and rejects empty filter',
              setup: 'print(delete_matching([{"id": 1, "status": "old"}, {"id": 2, "status": "ok"}], "status", "old"))',
              expected: "[{'id': 2, 'status': 'ok'}]",
              hidden: false,
            },
          ],
          hints: [
            'Check `if not key or val is None or val == "": raise ValueError(...)`.',
          ],
          points: 15,
        },
        {
          id: 'day27-ex27',
          title: 'Soft-Delete vs Hard-Delete Audit Helper',
          type: 'write-code',
          tier: 'project',
          prompt: 'Write `soft_delete(docs, target_id, ts)` that marks the matching doc with `"deleted_at": ts` (without removing it from `docs`) and returns `1` if found else `0`.',
          contextScenario: 'Implementing audit-compliant soft-deletes for financial records.',
          starterCode: `def soft_delete(docs, target_id, ts):
    # Set deleted_at=ts on doc with _id == target_id; return 1 if found else 0
    pass

rows = [{"_id": "a1", "amt": 50}]
print(soft_delete(rows, "a1", 1700), rows[0])`,
          solutionCode: `def soft_delete(docs, target_id, ts):
    for d in docs:
        if d.get("_id") == target_id:
            d["deleted_at"] = ts
            return 1
    return 0

rows = [{"_id": "a1", "amt": 50}]
print(soft_delete(rows, "a1", 1700), rows[0])`,
          testCases: [
            {
              id: 'tc1',
              label: 'Marks deleted_at and returns modified count',
              setup: 'r = [{"_id": "a1", "amt": 50}]\nprint(soft_delete(r, "a1", 1700), r[0]["deleted_at"], soft_delete(r, "missing", 1700))',
              expected: '1 1700 0',
              hidden: false,
            },
          ],
          hints: [
            'Loop over `docs` and check `d.get("_id") == target_id`.',
            'Set `d["deleted_at"] = ts` and return `1`.',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day27-sub8',
      number: 8,
      title: 'Aggregation Pipelines ($match, $group, $sort), Indexes & Schema Design',
      summary: 'Aggregate analytics server-side, speed up queries with create_index(), and choose Embedded vs Referenced schemas.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Server-Side Aggregation & Document Schema Modeling',
        paragraphs: [
          'MongoDB’s **`collection.aggregate(pipeline)`** processes documents through ordered stages: filter early with **`$match`**, summarize with **`$group`** (`$sum`, `$avg`), and order with **`$sort`**—pushing computation to the database instead of pulling raw rows into Python.',
          'For performance, add **`create_index([("email", 1)], unique=True)`** on frequently queried fields. When designing schemas, **embed** 1-to-few subdocuments read together, and **reference** (`user_id`) 1-to-many unbounded logs to stay well below the 16 MB BSON limit.',
        ],
        keyTerms: [
          {
            term: 'Aggregation Pipeline',
            definition: 'List of stage dicts (`$match`, `$group`, `$sort`) executed sequentially on the MongoDB server.',
          },
          {
            term: 'Embedded vs Referenced',
            definition: 'Nesting bounded child data inside one doc vs linking by `_id` for unbounded 1-to-many growth.',
          },
        ],
        bulletPoints: [
          'Always place `$match` as early as possible in an aggregation pipeline so it can use indexes.',
          'Compound indexes follow the ESR rule: Equality, Sort, Range.',
        ],
      },
      visualise: {
        type: 'mongodb-agg-schema-sim',
        title: 'Aggregation Pipeline & Schema Design Lab',
        badge: 'simulation',
        description: 'Step through `$match -> $group -> $sort` stages and compare Embedded vs Referenced schemas.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Modeling $match -> $group -> $sort Aggregation in Python',
          runMode: 'real',
          code: `from collections import defaultdict

orders = [
    {"region": "EU", "status": "paid", "total": 120},
    {"region": "US", "status": "cancelled", "total": 90},
    {"region": "EU", "status": "paid", "total": 80},
    {"region": "US", "status": "paid", "total": 200},
]

# $match status=="paid" -> $group by region sum(total) -> $sort by region
totals = defaultdict(int)
for o in orders:
    if o["status"] == "paid":
        totals[o["region"]] += o["total"]

result = [{"_id": k, "revenue": totals[k]} for k in sorted(totals)]
print(result)`,
          expectedOutput: "[{'_id': 'EU', 'revenue': 200}, {'_id': 'US', 'revenue': 200}]",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 13,
          instruction: 'if o["status"] == "paid":',
          internalEffect: 'Stage 1 ($match) filters out cancelled orders before grouping.',
        },
        {
          step: 2,
          codeLine: 14,
          instruction: 'totals[o["region"]] += o["total"]',
          internalEffect: 'Stage 2 ($group) sums total revenue per region.',
        },
      ],
      apply: {
        domain: 'Schema Architecture',
        contextTitle: 'Enforcing Unique Index Constraints',
        scenario: 'Simulate `create_index([("email", 1)], unique=True)` duplicate rejection.',
        code: `emails_index = set()
for email in ["a@x.com", "b@x.com", "a@x.com"]:
    if email in emails_index:
        print("DuplicateKeyError:", email)
    else:
        emails_index.add(email)`,
        outcome: 'DuplicateKeyError: a@x.com',
      },
      commonMistakes: [
        {
          label: 'Embedding Unbounded Arrays Inside a Single Document',
          erroneousCode: `# user_doc["audit_events"].append(event)  # Grows past 16 MB BSON limit!`,
          errorMessage: 'DocumentTooLarge: BSON document exceeds 16777216 bytes',
          explanation: 'For unbounded 1-to-many streams (logs, comments, sensor ticks), store them in a separate collection referencing `user_id`.',
          correctedCode: `# db.audit_events.insert_one({"user_id": user_id, **event})`,
        },
      ],
      sourceNotes: 'Covers aggregation pipelines, indexes, and schema design for Day 27.',
      practise: [
        {
          id: 'day27-ex28',
          title: 'Embedded vs Referenced Schema Decision',
          type: 'theory-reasoning',
          tier: 'standard',
          prompt: 'Should an IoT platform embed millions of per-second sensor readings inside the `device` document, or store them in a separate `readings` collection referencing `device_id`? Explain why.',
          contextScenario: 'Designing a scalable MongoDB schema for 10,000 industrial sensors.',
          modelAnswer: 'Store sensor readings in a separate `readings` collection referencing `device_id`. Embedding unbounded per-second readings inside the `device` document would rapidly exceed MongoDB’s 16 MB BSON document limit and cause constant document relocation on every write.',
          markingCriteria: [
            { id: 'mc1', label: 'Chooses separate referenced readings collection', points: 5 },
            { id: 'mc2', label: 'Cites 16 MB BSON limit and unbounded growth', points: 5 },
          ],
          hints: [
            'Per-second readings grow without bound.',
            'What is the maximum size of a single BSON document?',
          ],
          points: 15,
        },
        {
          id: 'day27-ex29',
          title: 'Aggregation Pipeline $match -> $group -> $sort',
          type: 'write-code',
          tier: 'project',
          prompt: 'Write `aggregate_revenue(orders)` that filters `status == "paid"` (`$match`), sums `"total"` grouped by `"region"` (`$group`), and returns `[{"_id": region, "revenue": total}, ...]` sorted by descending revenue (`$sort`).',
          contextScenario: 'Computing regional revenue analytics via a 3-stage aggregation pipeline.',
          starterCode: `from collections import defaultdict

def aggregate_revenue(orders):
    # $match status=="paid" -> $group by region sum(total) -> $sort revenue desc
    pass

data = [
    {"region": "EU", "status": "paid", "total": 100},
    {"region": "US", "status": "paid", "total": 250},
    {"region": "EU", "status": "cancelled", "total": 999},
]
print(aggregate_revenue(data))`,
          solutionCode: `from collections import defaultdict

def aggregate_revenue(orders):
    totals = defaultdict(int)
    for o in orders:
        if o.get("status") == "paid":
            totals[o["region"]] += o["total"]
    grouped = [{"_id": reg, "revenue": rev} for reg, rev in totals.items()]
    return sorted(grouped, key=lambda x: (-x["revenue"], x["_id"]))

data = [
    {"region": "EU", "status": "paid", "total": 100},
    {"region": "US", "status": "paid", "total": 250},
    {"region": "EU", "status": "cancelled", "total": 999},
]
print(aggregate_revenue(data))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Filters paid, groups by region, sorts descending',
              setup: 'd = [{"region": "EU", "status": "paid", "total": 100}, {"region": "US", "status": "paid", "total": 250}, {"region": "EU", "status": "cancelled", "total": 999}]\nprint(aggregate_revenue(d))',
              expected: "[{'_id': 'US', 'revenue': 250}, {'_id': 'EU', 'revenue': 100}]",
              hidden: false,
            },
          ],
          hints: [
            'Filter `o.get("status") == "paid"` first.',
            'Sort grouped dicts by `(-x["revenue"], x["_id"])`.',
          ],
          points: 20,
        },
        {
          id: 'day27-ex30',
          title: 'Unique Index Enforcement on Collection Insert',
          type: 'write-code',
          tier: 'project',
          prompt: 'Write `insert_with_unique_email(docs, new_doc)` that checks if `new_doc["email"]` already exists in `docs`; if so raise `ValueError("DuplicateKeyError")`, else append `new_doc` and return `len(docs)`.',
          contextScenario: 'Modeling `create_index([("email", 1)], unique=True)` behavior.',
          starterCode: `def insert_with_unique_email(docs, new_doc):
    # Raise ValueError("DuplicateKeyError") if email exists, else append and return len(docs)
    pass

users = [{"email": "ada@py.org"}]
print(insert_with_unique_email(users, {"email": "bob@py.org"}))`,
          solutionCode: `def insert_with_unique_email(docs, new_doc):
    if any(d.get("email") == new_doc.get("email") for d in docs):
        raise ValueError("DuplicateKeyError")
    docs.append(new_doc)
    return len(docs)

users = [{"email": "ada@py.org"}]
print(insert_with_unique_email(users, {"email": "bob@py.org"}))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Enforces unique email index',
              setup: 'u = [{"email": "ada@py.org"}]\nprint(insert_with_unique_email(u, {"email": "bob@py.org"}))',
              expected: '2',
              hidden: false,
            },
          ],
          hints: [
            'Check `any(d.get("email") == new_doc.get("email") for d in docs)`.',
            'Raise `ValueError("DuplicateKeyError")` on collision.',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
  ],
  realWorldLabs: [
    {
      id: 'day27-lab1',
      title: 'Multi-Tenant SaaS Quota Upsert & Safe Purge Pipeline',
      description: 'Model PyMongo upsert=True atomic $inc quota tracking for multiple tenants, enforce non-empty delete_many guards, and purge only expired trial records.',
      domain: 'Cloud SaaS Operations',
      starterCode: `quotas = {
    "t1": {"tenant": "t1", "calls": 10, "status": "active"},
    "t2": {"tenant": "t2", "calls": 3, "status": "expired"},
}

# 1. Upsert + increment calls by 5 for "t1" and new tenant "t3" (status="active")
# 2. Safely purge documents where status == "expired"
# 3. Print sorted remaining tenant -> calls
`,
      targetOutput: `t1: 15
t3: 5`,
    },
    {
      id: 'day27-lab2',
      title: 'Order Event Stream $match -> $group -> $sort Aggregation',
      description: 'Execute a 3-stage MongoDB-style aggregation pipeline on raw order documents: match paid orders, group by category summing revenue and order count, and sort descending by revenue.',
      domain: 'E-Commerce Analytics',
      starterCode: `from collections import defaultdict

orders = [
    {"cat": "hardware", "status": "paid", "amt": 300},
    {"cat": "books", "status": "paid", "amt": 45},
    {"cat": "hardware", "status": "refunded", "amt": 500},
    {"cat": "books", "status": "paid", "amt": 55},
]

# Run $match(status=="paid") -> $group(by cat: count, revenue) -> $sort(revenue desc)
`,
      targetOutput: `[{'_id': 'hardware', 'count': 1, 'revenue': 300}, {'_id': 'books', 'count': 2, 'revenue': 100}]`,
    },
  ],
  miniProject: {
    id: 'day27-project',
    title: 'PyMongo Document Store, Query Operator & Aggregation Engine',
    brief: 'Build an in-memory PyMongo-compatible collection engine supporting auto-generated _id values, unique email indexes, $gte/$in/$or query filtering with projections, atomic $set/$inc upserts, guarded deletes, and $match/$group/$sort aggregation.',
    requirements: [
      'Auto-generate 24-hex _id values on insert_one/insert_many when omitted',
      'Enforce unique index constraints on designated fields like email',
      'Support query filters ($gte, $in, $or) and field projections (including _id: 0)',
      'Support atomic update_one with $set, $inc, and upsert=True',
      'Guard delete_many against empty filters to prevent accidental collection wipes',
      'Execute a 3-stage $match -> $group -> $sort aggregation pipeline',
    ],
    rubric: [
      { criterion: 'Document insertion, auto _id & unique index enforcement', weight: 25 },
      { criterion: 'Query operator ($gte, $in, $or) & projection accuracy', weight: 25 },
      { criterion: 'Atomic $set/$inc upserts & guarded delete operations', weight: 25 },
      { criterion: '3-stage aggregation pipeline ($match -> $group -> $sort)', weight: 25 },
    ],
    starterCode: `from collections import defaultdict
import uuid

# Build MiniMongoCollection with:
# - insert_one(doc)
# - find(flt, projection=None)
# - update_one(flt, update, upsert=False)
# - delete_many(flt)
# - aggregate(pipeline)
`,
  },
  dayQuiz: {
    title: 'Day 27 Checkpoint Quiz',
    questions: [
      {
        id: 'day27-q1',
        scenario: 'You pass `{"_id": "65a1f0b2c1a0010000000001"}` as a string to `db.users.find_one(...)`, and it returns `None` even though the hex matches.',
        question: 'Why did the lookup fail?',
        options: [
          {
            id: 'a',
            text: 'Auto-generated _id values are bson.objectid.ObjectId instances, not plain Python strings.',
            explanation: 'Correct! Wrap the hex string in `ObjectId(id_str)` before querying `_id`.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'MongoDB does not index _id by default.',
            explanation: 'Incorrect. `_id` always has a unique index automatically.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'find_one() only searches the first 100 documents.',
            explanation: 'Incorrect. `find_one()` searches the entire collection using indexes.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Strings must be uppercase hex.',
            explanation: 'Incorrect. Case is irrelevant when you pass `ObjectId(id_str)`.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day27-q2',
        scenario: 'A Flask + PyMongo API opens `MongoClient(URI)` inside every request handler.',
        question: 'What is the recommended PyMongo best practice?',
        options: [
          {
            id: 'a',
            text: 'Create one MongoClient at app startup and share its thread-safe connection pool across requests.',
            explanation: 'Correct! `MongoClient` manages a built-in thread-safe connection pool.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Open and close MongoClient on every single query.',
            explanation: 'Incorrect. Repeatedly opening TCP/TLS connections adds massive latency.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Create one MongoClient per collection.',
            explanation: 'Incorrect. One `MongoClient` serves all databases and collections on the cluster.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Store the MongoClient inside a browser cookie.',
            explanation: 'Incorrect. `MongoClient` is a server-side Python object.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day27-q3',
        scenario: 'You run `res = db.orders.insert_one({"item": "SSD"})` and return `jsonify({"id": res.inserted_id})` in Flask.',
        question: 'What happens unless you convert `res.inserted_id`?',
        options: [
          {
            id: 'a',
            text: 'JSON serialization raises TypeError because ObjectId is not JSON-serializable; use str(res.inserted_id).',
            explanation: 'Correct! `ObjectId` must be converted via `str(...)` for standard JSON.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Flask automatically converts ObjectId to an integer.',
            explanation: 'Incorrect. Standard JSON encoders raise `TypeError`.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'res.inserted_id is already a Python str.',
            explanation: 'Incorrect. `res.inserted_id` is an `ObjectId` instance.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'insert_one() returns None instead of an ID.',
            explanation: 'Incorrect. `insert_one()` returns `InsertOneResult` with `.inserted_id`.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day27-q4',
        scenario: 'You execute `cursor = db.logs.find({"level": "ERROR"})`.',
        question: 'What does `cursor` represent?',
        options: [
          {
            id: 'a',
            text: 'A lazy iterator that streams matching documents from MongoDB in batches as you loop over it.',
            explanation: 'Correct! `find()` does not load all documents into memory at once unless you call `list(cursor)`.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'A Python list containing every matching document immediately.',
            explanation: 'Incorrect. `find()` returns a `Cursor`, not a `list`.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'A single dictionary or None.',
            explanation: 'Incorrect. That is `find_one()`.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'An integer count of matching documents.',
            explanation: 'Incorrect. Use `count_documents(filter)` for counts.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day27-q5',
        scenario: 'You want `find()` to return only `"name"` and `"email"` while omitting `"_id"`.',
        question: 'Which projection dict is valid?',
        options: [
          {
            id: 'a',
            text: '{"_id": 0, "name": 1, "email": 1}',
            explanation: 'Correct! `_id: 0` is the sole exclusion allowed alongside inclusion (`1`) fields.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: '{"name": 1, "password": 0}',
            explanation: 'Incorrect. Mixing `1` and `0` on non-`_id` fields raises `OperationFailure`.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: '{"_id": 0, "password": 0, "name": 1}',
            explanation: 'Incorrect. Cannot mix `password: 0` with `name: 1`.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: '["name", "email"]',
            explanation: 'Incorrect. Projections in PyMongo use dictionaries with `1`/`0`, though lists are also accepted in some versions; `{"_id": 0, ...}` is the explicit standard to exclude `_id`.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day27-q6',
        scenario: 'You want to match users whose `role` is `"admin"` OR `"lead"`, AND whose `age` is at least `25`.',
        question: 'Which MongoDB filter dict expresses this cleanly?',
        options: [
          {
            id: 'a',
            text: '{"role": {"$in": ["admin", "lead"]}, "age": {"$gte": 25}}',
            explanation: 'Correct! Multiple top-level keys combine with implicit `$and`, while `$in` and `$gte` express membership and >=.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: '{"role": ["admin", "lead"], "age": ">=25"}',
            explanation: 'Incorrect. That looks for an exact array `["admin", "lead"]` and exact string `">=25"`.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: '{"$or": {"role": "admin", "age": 25}}',
            explanation: 'Incorrect. `$or` requires a list of dicts, and this changes the boolean logic.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: '{"role": {"$eq": ["admin", "lead"]}, "age": {"$gt": 25}}',
            explanation: 'Incorrect. `$gt: 25` excludes 25, and `$eq` checks exact array equality.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day27-q7',
        scenario: 'You want to atomically add `10` to `credits` for user `"ada"`, creating the document if `"ada"` does not exist yet.',
        question: 'Which PyMongo call accomplishes this?',
        options: [
          {
            id: 'a',
            text: 'db.users.update_one({"user": "ada"}, {"$inc": {"credits": 10}}, upsert=True)',
            explanation: 'Correct! `$inc` atomically increments `credits`, and `upsert=True` inserts the document if absent.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'db.users.update_one({"user": "ada"}, {"credits": 10})',
            explanation: 'Incorrect. Missing `$` operator raises `ValueError`, and it does not increment or upsert.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'db.users.insert_one({"user": "ada", "credits": 10})',
            explanation: 'Incorrect. `insert_one` fails or duplicates if `"ada"` already exists.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'db.users.update_one({"user": "ada"}, {"$set": {"credits": 10}})',
            explanation: 'Incorrect. `$set` overwrites `credits` to `10` instead of adding `10`.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day27-q8',
        scenario: 'A helper calls `db.sessions.delete_many(filter_dict)`.',
        question: 'What happens if `filter_dict` accidentally evaluates to `{}`?',
        options: [
          {
            id: 'a',
            text: 'All documents in the sessions collection are deleted.',
            explanation: 'Correct! `{}` matches every document, so always validate that `filter_dict` is non-empty.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'PyMongo refuses to run and deletes 0 documents.',
            explanation: 'Incorrect. PyMongo executes `delete_many({})` as requested.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Only the first document is deleted.',
            explanation: 'Incorrect. `delete_many` deletes all matching documents.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'The collection is converted to read-only.',
            explanation: 'Incorrect. It deletes all documents in the collection.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day27-q9',
        scenario: 'You are building an aggregation pipeline `[{"$match": ...}, {"$group": ...}, {"$sort": ...}]`.',
        question: 'Why should `$match` be placed at the start of the pipeline?',
        options: [
          {
            id: 'a',
            text: 'Filtering early reduces the number of documents entering $group and allows MongoDB to use collection indexes.',
            explanation: 'Correct! Early `$match` minimizes memory/CPU in downstream stages and can leverage indexes.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'MongoDB forbids $match after $group.',
            explanation: 'Incorrect. `$match` can appear after `$group` (like SQL `HAVING`), though early `$match` is faster.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: '$match automatically creates a unique index.',
            explanation: 'Incorrect. Indexes are created with `create_index()`.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: '$group cannot run without $sort.',
            explanation: 'Incorrect. `$sort` is optional.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'day27-q10',
        scenario: 'An application stores `users` and their `audit_events` (up to 5 million events per user over time).',
        question: 'Which MongoDB schema design is appropriate?',
        options: [
          {
            id: 'a',
            text: 'Store audit_events in a separate collection referencing user_id, avoiding the 16 MB BSON document limit.',
            explanation: 'Correct! Unbounded 1-to-many streams must be referenced rather than embedded in a single document.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Embed all 5 million audit_events inside an array on each user document.',
            explanation: 'Incorrect. That will exceed the 16 MB BSON document size limit.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Store each audit_event as a separate MongoDB database.',
            explanation: 'Incorrect. Creating millions of databases is an anti-pattern.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Disable _id on audit_events.',
            explanation: 'Incorrect. Every MongoDB document requires `_id`.',
            isCorrect: false,
          },
        ],
      },
    ],
    passingScorePercentage: 80,
  },
  cheatSheet: [
    {
      category: 'NoSQL Document Model, BSON & ObjectId',
      syntax: 'from bson.objectid import ObjectId\noid = ObjectId("65f1a2b3c4d5e6f708192a3b")',
      description:
        'MongoDB stores schema-flexible JSON-like documents serialized as Binary JSON (BSON), supporting native dates, binary blobs, and 12-byte ObjectId primary keys. Every document requires an immutable _id field; PyMongo converts string hex IDs with ObjectId(hex_str).',
      example: `from datetime import datetime, timezone
from bson.objectid import ObjectId

doc = {
    "_id": ObjectId(),
    "username": "aisha_dev",
    "created_at": datetime.now(timezone.utc),
    "roles": ["author", "reviewer"],
}
print(doc["_id"].generation_time)  # UTC timestamp embedded in ObjectId`,
    },
    {
      category: 'MongoClient Connection Pooling & Lazy Handles',
      syntax: 'client = MongoClient(uri, maxPoolSize=50, serverSelectionTimeoutMS=5000)\ndb = client["app_db"]\ncol = db["users"]',
      description:
        'Instantiate a single long-lived MongoClient per process so its internal thread-safe connection pool can reuse TCP sockets. Indexing client["db"] and db["collection"] creates lazy handles—no network I/O occurs until an actual command or client.admin.command("ping") runs.',
      example: `import os
from pymongo import MongoClient

client = MongoClient(
    os.environ["MONGODB_URI"],
    maxPoolSize=50,
    serverSelectionTimeoutMS=5000,
)
client.admin.command("ping")  # Verify reachable primary & credentials
users = client["analytics_db"]["users"]`,
    },
    {
      category: 'Inserting Documents (insert_one, insert_many)',
      syntax: 'res = col.insert_one(doc)\nres_many = col.insert_many(docs, ordered=False)',
      description:
        'insert_one() inserts a single dictionary and returns InsertOneResult with inserted_id (mutating _id onto the dict if omitted). insert_many() batches writes in one round-trip; pass ordered=False to continue inserting valid documents even if one fails a unique index.',
      example: `result = users.insert_one({"email": "tunde@example.com", "tier": "pro"})
print("Inserted ID:", result.inserted_id)

batch = [
    {"email": "lin@example.com", "tier": "free"},
    {"email": "mateo@example.com", "tier": "pro"},
]
many_res = users.insert_many(batch, ordered=False)
print("Inserted count:", len(many_res.inserted_ids))`,
    },
    {
      category: 'Querying, Cursors, Projections & Sorting',
      syntax: 'doc = col.find_one(filter, projection)\ncursor = col.find(filter, {"_id": 0, "name": 1}).sort("score", -1).skip(10).limit(5)',
      description:
        'find_one() returns a single matching dict or None. find() returns a lazy Cursor—apply projections (1 to include, 0 to exclude, without mixing except _id: 0), sort (1 ascending, -1 descending), skip, and limit before iterating or calling list().',
      example: `active_pro = (
    users.find({"tier": "pro"}, {"_id": 0, "email": 1, "score": 1})
    .sort([("score", -1), ("email", 1)])
    .skip(0)
    .limit(10)
)
for user in active_pro:
    print(user["email"], user.get("score", 0))`,
    },
    {
      category: 'Query Operators ($gte, $in, $and, $or, $regex)',
      syntax: 'col.find({"$or": [{"age": {"$gte": 18}}, {"role": {"$in": ["admin", "mod"]}}]})',
      description:
        'Use dollar-prefixed comparison ($gt, $gte, $lt, $lte, $ne), membership ($in, $nin), existence ($exists), logical ($and, $or, $not), and anchored regex ($regex with $options) operators to express rich filters cleanly in Python dicts.',
      example: `query = {
    "status": "active",
    "$or": [
        {"credits": {"$gte": 100}},
        {"plan": {"$in": ["enterprise", "team"]}},
    ],
    "email": {"$regex": r"@company\\.com$", "$options": "i"},
}
matches = list(users.find(query, {"_id": 0, "email": 1}))`,
    },
    {
      category: 'Atomic Updates ($set, $inc, upsert=True)',
      syntax: 'col.update_one(filter, {"$set": {...}, "$inc": {"visits": 1}}, upsert=True)',
      description:
        'Always wrap updates in atomic operators ($set, $unset, $inc, $push, $addToSet, $pull)—passing a bare dict to update_one raises ValueError, and replace_one overwrites the entire document. Add upsert=True to insert when no document matches the filter.',
      example: `res = users.update_one(
    {"email": "aisha@example.com"},
    {
        "$set": {"tier": "enterprise"},
        "$inc": {"login_count": 1},
        "$addToSet": {"badges": "early_adopter"},
    },
    upsert=True,
)
print(res.matched_count, res.modified_count, res.upserted_id)`,
    },
    {
      category: 'Safe Deletion (delete_one, delete_many)',
      syntax: 'res = col.delete_one({"_id": ObjectId(doc_id)})\nres_all = col.delete_many({"expired": True})',
      description:
        'delete_one() removes at most one matching document, while delete_many() removes all matches (passing {} wipes the entire collection!). Always validate non-empty filters and inspect res.deleted_count, or prefer soft deletes (archived_at) for auditability.',
      example: `from bson.objectid import ObjectId

target_id = ObjectId("65f1a2b3c4d5e6f708192a3b")
del_res = users.delete_one({"_id": target_id})
if del_res.deleted_count == 0:
    print("No document found with that _id")

purged = users.delete_many({"status": "pending", "age_days": {"$gt": 30}})
print(f"Purged {purged.deleted_count} stale records")`,
    },
    {
      category: 'Aggregation Pipelines ($match, $group, $sort)',
      syntax: 'col.aggregate([{"$match": {...}}, {"$group": {"_id": "$tier", "total": {"$sum": 1}}}, {"$sort": {"total": -1}}])',
      description:
        'Aggregation pipelines process documents through sequential server-side stages. Place $match and $project as early as possible to leverage indexes and shrink memory before $unwind, $group ($sum, $avg, $min, $max), and $sort.',
      example: `pipeline = [
    {"$match": {"status": "paid"}},
    {"$group": {
        "_id": "$region",
        "revenue": {"$sum": "$amount"},
        "order_count": {"$sum": 1},
    }},
    {"$sort": {"revenue": -1}},
]
summary = list(orders.aggregate(pipeline))`,
    },
    {
      category: 'Indexes & Unique Constraints (create_index)',
      syntax: 'col.create_index([("email", 1)], unique=True)\ncol.create_index([("tenant_id", 1), ("created_at", -1)])',
      description:
        'Indexes prevent slow full-collection scans (COLLSCAN -> IXSCAN) and enforce uniqueness at the database level. Follow the Equality-Sort-Range (ESR) rule for compound indexes and verify query plans with .explain().',
      example: `from pymongo import ASCENDING, DESCENDING

users.create_index([("email", ASCENDING)], unique=True)
orders.create_index([("customer_id", ASCENDING), ("created_at", DESCENDING)])
plan = orders.find({"customer_id": "c_42"}).sort("created_at", DESCENDING).explain()
print(plan["queryPlanner"]["winningPlan"]["stage"])`,
    },
    {
      category: 'Schema Design (Embedded vs. Referenced)',
      syntax: '# Embed bounded 1:few data; reference unbounded 1:many data by ObjectId',
      description:
        'Embed subdocuments that are read/written together and stay bounded well below MongoDB’s 16 MB BSON document limit (e.g., shipping address, small line-item list). Reference via ObjectId foreign keys when child arrays grow without bound (e.g., audit logs, comments).',
      example: `# Embedded: bounded shipping address & preferences
customer = {"_id": ObjectId(), "name": "Nadia", "address": {"city": "Lagos", "zip": "100001"}}

# Referenced: unbounded events stored in separate collection
event = {"_id": ObjectId(), "customer_id": customer["_id"], "action": "login"}
events.insert_one(event)`,
    },
  ],
  sourceNotes: [
    'Curriculum reference: https://github.com/Asabeneh/30-Days-Of-Python/tree/master/27_Day_Python_with_mongodb',
  ],
};
