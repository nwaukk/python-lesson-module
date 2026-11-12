/**
 * Day 29: Building APIs (Advanced Python)
 * Part A (Learn) conforming to Sections 10, 13.2, and 14 of the Master Specification.
 * Includes:
 *  - 8 Detailed Subtopics following the 10-step pedagogical structure
 *  - 3 Signature Simulations: api-builder-router-sim, api-validation-serialization-sim, api-idempotency-pagination-sim
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_29_MODULE: DayModule = {
  schemaVersion: 1,
  number: 29,
  title: 'Building APIs',
  level: 'advanced',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/29_Day_Building_API',
  estimatedMinutes: 85,
  prerequisites: [26, 28],
  objectives: [
    'Design clean RESTful resource hierarchies, versioned prefixes, and JSON response envelopes',
    'Implement GET collection and single-resource endpoints with explicit 404 handling',
    'Serialize BSON ObjectId and datetime objects safely into JSON',
    'Validate incoming JSON payloads and return structured 400/422 error envelopes',
    'Handle POST creation with 201 Created and Location headers',
    'Implement full PUT replacement, partial PATCH updates, and 204 No Content DELETE routes',
    'Protect POST mutations against duplicate retries using Idempotency-Key headers',
    'Add bounded offset pagination, sorting, and global JSON error handlers',
  ],
  subtopics: [
    {
      id: 'day29-sub1',
      number: 1,
      title: 'Resource Modeling & RESTful API Contract Design',
      summary: 'Design versioned URI hierarchies, plural resource nouns, and consistent JSON envelopes.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Designing a Predictable API Contract',
        paragraphs: [
          'Building a maintainable API starts with **resource modeling**: grouping domain entities into plural noun endpoints under a versioned prefix such as `/api/v1/students` and `/api/v1/students/<student_id>`. Versioning in the URL path protects existing clients when breaking schema changes are introduced in `/api/v2/`.',
          'Equally important is a consistent **JSON response envelope**—for example, returning `{"count": N, "items": [...]}` for collections and `{"error": "...", "details": [...]}` for failures—so client SDKs never have to guess response shapes.',
        ],
        keyTerms: [
          {
            term: 'API Versioning',
            definition: 'Prefixing routes with /api/v1/ so breaking changes can ship on /api/v2/ without breaking existing clients.',
          },
          {
            term: 'Response Envelope',
            definition: 'A standardized top-level JSON structure wrapping collection items, metadata, or error details.',
          },
        ],
        bulletPoints: [
          'Keep URIs lowercase with hyphens (`/api/v1/study-plans`), never camelCase or database table names.',
          'Expose `id` as a clean string rather than leaking internal `_id` BSON wrappers.',
        ],
      },
      visualise: {
        type: 'api-builder-router-sim',
        title: 'RESTful API Route & Handler Builder',
        badge: 'simulation',
        description: 'Explore how versioned REST endpoints map HTTP methods to Python route handlers.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Building a Consistent Collection Envelope Helper',
          runMode: 'real',
          code: `import json

def collection_response(items):
    return json.dumps({"count": len(items), "items": items})

students = [{"id": "101", "name": "Ada"}, {"id": "102", "name": "Tunde"}]
print(collection_response(students))`,
          expectedOutput: '{"count": 2, "items": [{"id": "101", "name": "Ada"}, {"id": "102", "name": "Tunde"}]}',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'def collection_response(items):',
          internalEffect: 'Wraps any list of serialized records in a predictable {"count", "items"} envelope.',
        },
      ],
      apply: {
        domain: 'Backend Architecture',
        contextTitle: 'Versioned Route Prefixing',
        scenario: 'Generate versioned resource paths for a multi-resource API.',
        code: `API_PREFIX = "/api/v1"
print(f"{API_PREFIX}/students", f"{API_PREFIX}/students/101")`,
        outcome: '/api/v1/students /api/v1/students/101',
      },
      commonMistakes: [
        {
          label: 'Returning Raw Top-Level JSON Arrays Without Metadata',
          erroneousCode: `# return jsonify(students)  # Hard to add pagination or total_count later without breaking clients`,
          errorMessage: 'Breaking API change required when adding pagination metadata',
          explanation: 'Wrapping collections in `{"items": [...], "count": N}` lets you add `page` or `next_cursor` later in a backwards-compatible way.',
          correctedCode: `# return jsonify({"count": len(students), "items": students}), 200`,
        },
      ],
      sourceNotes: 'Covers resource modeling and API contracts for Day 29.',
      practise: [
        {
          id: 'day29-ex1',
          title: 'Backwards-Compatible Response Envelope',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Your team ships `GET /api/v1/courses` returning a bare JSON array `[...]`. Six months later, mobile clients need `total` and `next_page` metadata. Why was returning a top-level object `{"count": N, "items": [...]}` from day one a better contract?',
          options: [
            { id: 'a', text: 'Adding new metadata keys to a top-level JSON object is backwards-compatible, whereas changing a top-level array to an object breaks existing clients.', explanation: 'Correct! Top-level JSON objects allow additive, non-breaking fields.', isCorrect: true },
            { id: 'b', text: 'JSON arrays cannot hold more than 100 items in HTTP.', explanation: 'Incorrect. JSON arrays have no 100-item limit.', isCorrect: false },
            { id: 'c', text: 'Python json.dumps() cannot serialize top-level lists.', explanation: 'Incorrect. json.dumps([1, 2]) works fine.', isCorrect: false },
            { id: 'd', text: 'Browsers reject top-level arrays with 400 Bad Request.', explanation: 'Incorrect. Browsers parse valid JSON arrays.', isCorrect: false },
          ],
          hints: ['Think about adding pagination fields later.', 'Can you add a key like "next_page" to a list?', 'Objects support additive fields without breaking parsers.'],
          points: 10,
        },
        {
          id: 'day29-ex2',
          title: 'Predict Collection Envelope Output',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'What does this REST envelope builder output?',
          contextScenario: 'import json\ndef wrap(items):\n    return json.dumps({"count": len(items), "items": items})\nprint(wrap(["API", "REST"]))',
          options: [
            { id: 'a', text: '{"count": 2, "items": ["API", "REST"]}', explanation: 'Correct!', isCorrect: true },
            { id: 'b', text: '{"count": 2, "items": (\'API\', \'REST\')}', explanation: 'Incorrect. JSON uses double quotes and square brackets.', isCorrect: false },
            { id: 'c', text: '["API", "REST"]', explanation: 'Incorrect. wrap() returns an object envelope.', isCorrect: false },
            { id: 'd', text: 'TypeError', explanation: 'Incorrect. All values are JSON-serializable.', isCorrect: false },
          ],
          hints: ['len(["API", "REST"]) is 2.', 'json.dumps uses double quotes.', 'Lists serialize as JSON arrays.'],
          points: 10,
        },
        {
          id: 'day29-ex3',
          title: 'Why Version APIs with /api/v1/',
          type: 'theory-reasoning',
          tier: 'standard',
          prompt: 'Explain why production REST APIs include a version prefix such as `/api/v1/` in their route paths.',
          modelAnswer: 'Version prefixes allow backend teams to introduce breaking schema or behavior changes under /api/v2/ while keeping /api/v1/ running for existing mobile apps and third-party integrations until they migrate.',
          markingCriteria: [
            { id: 'mc1', label: 'Explains coexistence of v1 and v2 during breaking changes', points: 5 },
            { id: 'mc2', label: 'Protects existing clients from unexpected breakage', points: 5 },
          ],
          hints: ['What happens when you rename a required JSON field?', 'Old mobile app versions cannot update instantly.', 'v1 and v2 can run side-by-side.'],
          points: 10,
        },
        {
          id: 'day29-ex4',
          title: 'Build a Versioned Route Registry Helper',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Write `route_path(version, resource, item_id=None)` that returns `"/api/v{version}/{resource}"` when `item_id` is `None`, or `"/api/v{version}/{resource}/{item_id}"` otherwise.',
          starterCode: `def route_path(version, resource, item_id=None):
    pass
`,
          solutionCode: `def route_path(version, resource, item_id=None):
    base = f"/api/v{version}/{resource}"
    return f"{base}/{item_id}" if item_id is not None else base
`,
          testCases: [
            { id: 'tc1', label: 'Collection route', setup: 'print(route_path(1, "students"))', expected: '/api/v1/students', hidden: false },
            { id: 'tc2', label: 'Single resource route', setup: 'print(route_path(2, "orders", 42))', expected: '/api/v2/orders/42', hidden: true },
          ],
          hints: ['Format base = f"/api/v{version}/{resource}".', 'Check if item_id is not None.', 'Append /{item_id} when provided.'],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day29-sub2',
      number: 2,
      title: 'Implementing GET Collection & Single-Resource Endpoints',
      summary: 'Serve resource lists with 200 OK and handle missing resource IDs with 404 JSON.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Read Endpoints: 200 OK vs. 404 Not Found',
        paragraphs: [
          'A REST API typically exposes two read endpoints per resource: **`GET /api/v1/students`** (returns `200 OK` with a list, even when empty `[]`) and **`GET /api/v1/students/<student_id>`** (returns `200 OK` with the single object, or **`404 Not Found`** if the ID does not exist).',
          'In Flask + PyMongo, always validate the incoming `<student_id>` format first (e.g., checking `ObjectId.is_valid(student_id)`). If an invalid 5-character string is passed directly to `ObjectId()`, PyMongo raises `InvalidId` and crashes with `500` instead of returning `400` or `404`.',
        ],
        keyTerms: [
          {
            term: 'Empty Collection 200',
            definition: 'GET /students returns 200 OK with items: [] when no records match, never 404.',
          },
          {
            term: 'ObjectId.is_valid()',
            definition: 'PyMongo guard checking whether a string is a valid 24-hex ObjectId before querying.',
          },
        ],
        bulletPoints: [
          'Collection GET = `200 OK` even when empty; Single-resource GET = `404` when missing.',
          'Return JSON `{"error": "..."}` on 404, never Flask’s default HTML 404 page.',
        ],
      },
      visualise: {
        type: 'api-builder-router-sim',
        title: 'RESTful API Route & Handler Builder',
        badge: 'simulation',
        description: 'Compare GET /students (200 OK) with GET /students/<id> (404 Not Found).',
        initialConfig: {},
      },
      code: [
        {
          title: 'Simulating GET Collection & Single-Resource Lookup',
          runMode: 'real',
          code: `DB = {"s1": {"id": "s1", "name": "Ada"}}

def get_student(student_id):
    doc = DB.get(student_id)
    if not doc:
        return {"error": "Student not found"}, 404
    return doc, 200

print(get_student("s1"))
print(get_student("missing"))`,
          expectedOutput: "({'id': 's1', 'name': 'Ada'}, 200)\n({'error': 'Student not found'}, 404)",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'doc = DB.get(student_id)',
          internalEffect: 'Looks up the resource by ID without raising KeyError.',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: 'if not doc: return {"error": "Student not found"}, 404',
          internalEffect: 'Returns a JSON error body and explicit 404 status tuple.',
        },
      ],
      apply: {
        domain: 'Catalog APIs',
        contextTitle: 'Validating 24-Hex IDs Before Querying',
        scenario: 'Reject malformed IDs cleanly before hitting the database.',
        code: `def is_hex24(val):
    return len(val) == 24 and all(c in "0123456789abcdef" for c in val.lower())

print(is_hex24("65f1a2b3c4d5e6f708192a3b"), is_hex24("bad-id"))`,
        outcome: 'True False',
      },
      commonMistakes: [
        {
          label: 'Returning 404 on an Empty Collection Search',
          erroneousCode: `# if len(results) == 0: return jsonify({"error": "No students"}), 404`,
          errorMessage: 'Clients treat 404 as a broken endpoint rather than an empty list',
          explanation: 'A collection endpoint exists even when zero records match a filter—return `200 OK` with `{"count": 0, "items": []}`.',
          correctedCode: `# return jsonify({"count": len(results), "items": results}), 200`,
        },
      ],
      sourceNotes: 'Covers GET collection and single-resource endpoints for Day 29.',
      practise: [
        {
          id: 'day29-ex5',
          title: 'Empty Collection vs Missing Resource Status Code',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'A client requests `GET /api/v1/students?track=quantum` and zero students match that filter. Which HTTP status code and body should your API return?',
          options: [
            { id: 'a', text: '200 OK with {"count": 0, "items": []}', explanation: 'Correct! The collection endpoint exists and simply has zero matching items.', isCorrect: true },
            { id: 'b', text: '404 Not Found with {"error": "No students"}', explanation: 'Incorrect. 404 is for a missing single resource ID or unknown route, not an empty search result.', isCorrect: false },
            { id: 'c', text: '204 No Content with an empty body', explanation: 'Incorrect. Collection GETs should return a consistent JSON envelope.', isCorrect: false },
            { id: 'd', text: '500 Internal Server Error', explanation: 'Incorrect. An empty query result is not a server error.', isCorrect: false },
          ],
          hints: ['Does the /students endpoint exist?', 'Empty search results are normal.', 'Single resource missing -> 404; empty list -> 200.'],
          points: 10,
        },
        {
          id: 'day29-ex6',
          title: 'Validate 24-Hex ObjectId Strings',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Write `is_valid_hex_id(value)` returning `True` if `value` is a 24-character string containing only hexadecimal characters (`0-9`, `a-f`, `A-F`), and `False` otherwise.',
          starterCode: `def is_valid_hex_id(value):
    pass
`,
          solutionCode: `def is_valid_hex_id(value):
    if not isinstance(value, str) or len(value) != 24:
        return False
    return all(ch in "0123456789abcdefABCDEF" for ch in value)
`,
          testCases: [
            { id: 'tc1', label: 'Valid 24-hex ObjectId', setup: 'print(is_valid_hex_id("65f1a2b3c4d5e6f708192a3b"))', expected: 'True', hidden: false },
            { id: 'tc2', label: 'Rejects short or non-hex strings', setup: 'print(is_valid_hex_id("123"), is_valid_hex_id("z" * 24))', expected: 'False False', hidden: true },
          ],
          hints: ['Check isinstance(value, str) and len(value) == 24.', 'Use all(ch in "0123456789abcdefABCDEF" for ch in value).', 'Return False if invalid.'],
          points: 15,
        },
        {
          id: 'day29-ex7',
          title: 'Fix Missing 404 Guard in Single-Resource GET',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'This `get_book(db, book_id)` handler crashes with `TypeError` when `book_id` is not in `db`. Fix it to return `({"error": "Book not found"}, 404)` when missing.',
          starterCode: `def get_book(db, book_id):
    doc = db.get(book_id)
    return {"id": doc["id"], "title": doc["title"]}, 200
`,
          solutionCode: `def get_book(db, book_id):
    doc = db.get(book_id)
    if not doc:
        return {"error": "Book not found"}, 404
    return {"id": doc["id"], "title": doc["title"]}, 200
`,
          testCases: [
            { id: 'tc1', label: 'Missing ID returns 404', setup: 'print(get_book({}, "b99"))', expected: "({'error': 'Book not found'}, 404)", hidden: false },
            { id: 'tc2', label: 'Existing ID returns 200', setup: 'print(get_book({"b1": {"id": "b1", "title": "API"}}, "b1"))', expected: "({'id': 'b1', 'title': 'API'}, 200)", hidden: true },
          ],
          hints: ['Check `if not doc:` before indexing `doc["id"]`.', 'Return `{"error": "Book not found"}, 404`.', 'Keep the 200 tuple when found.'],
          points: 15,
        },
        {
          id: 'day29-ex8',
          title: 'GET Handler Contract',
          type: 'fill-the-gaps',
          tier: 'foundation',
          prompt: 'Complete the single-resource GET status rules.',
          gaps: [
            { id: 'g1', beforeText: 'Return ', afterText: ' when the requested resource ID exists,', correctAnswer: '200', options: ['200', '201', '204'] },
            { id: 'g2', beforeText: ' and return ', afterText: ' JSON when the ID is not found.', correctAnswer: '404', options: ['404', '500', '302'] },
          ],
          hints: ['Found = 200 OK.', 'Missing = 404 Not Found.', 'Always return JSON, not HTML.'],
          points: 10,
        },
      ],
      assess: [],
    },
    {
      id: 'day29-sub3',
      number: 3,
      title: 'JSON Serialization & BSON ObjectId / Datetime Conversion',
      summary: 'Transform MongoDB ObjectId and Python datetime values into clean JSON-serializable fields.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Why Raw Database Documents Crash json.dumps()',
        paragraphs: [
          'When building an API backed by MongoDB or SQL, database records often contain types that standard `json.dumps()` cannot serialize—most notably BSON **`ObjectId`** and Python **`datetime`** objects. Passing them directly to `json.dumps()` raises `TypeError: Object of type ObjectId is not JSON serializable`.',
          'The cleanest solution is an explicit **serializer function** (e.g., `serialize_student(doc)`) that maps `doc["_id"]` to `"id": str(doc["_id"])` and formats timestamps using `.isoformat()`. Explicit serializers also act as a security allowlist, preventing internal fields like `password_hash` from ever leaking.',
        ],
        keyTerms: [
          {
            term: 'Serializer Function',
            definition: 'A pure function mapping an internal DB record into a safe, JSON-compatible dictionary.',
          },
          {
            term: 'ISO 8601 (.isoformat())',
            definition: 'Standard string timestamp format (e.g., 2026-11-11T18:45:00+00:00) for JSON APIs.',
          },
        ],
        bulletPoints: [
          'Explicit serializers double as an allowlist so sensitive fields (`password_hash`) are never exposed.',
          'Always store and serialize timestamps in UTC with timezone offset (`+00:00` or `Z`).',
        ],
      },
      visualise: {
        type: 'api-validation-serialization-sim',
        title: 'Payload Validation & BSON-to-JSON Serializer',
        badge: 'simulation',
        description: 'Inspect how raw ObjectId causes TypeError unless converted via a serializer.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Writing an Explicit Document Serializer',
          runMode: 'real',
          code: `import json
from datetime import datetime, timezone

def serialize_student(doc):
    return {
        "id": str(doc["_id"]),
        "name": doc["name"],
        "created_at": doc["created_at"].isoformat(),
    }

raw = {"_id": 9001, "name": "Nadia", "password_hash": "secret", "created_at": datetime(2026, 11, 11, 12, 0, tzinfo=timezone.utc)}
print(json.dumps(serialize_student(raw)))`,
          expectedOutput: '{"id": "9001", "name": "Nadia", "created_at": "2026-11-11T12:00:00+00:00"}',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 6,
          instruction: '"id": str(doc["_id"])',
          internalEffect: 'Converts the database primary key to a JSON-safe string named "id".',
        },
        {
          step: 2,
          codeLine: 8,
          instruction: '"created_at": doc["created_at"].isoformat()',
          internalEffect: 'Formats the UTC datetime into an ISO 8601 string while omitting password_hash.',
        },
      ],
      apply: {
        domain: 'User Profiles',
        contextTitle: 'Allowlist Field Projection',
        scenario: 'Ensure sensitive fields are stripped when serializing user records.',
        code: `PUBLIC_FIELDS = ("id", "username", "tier")
user = {"id": "u1", "username": "ada", "tier": "pro", "secret_key": "xyz"}
safe = {k: user[k] for k in PUBLIC_FIELDS}
print(safe)`,
        outcome: "{'id': 'u1', 'username': 'ada', 'tier': 'pro'}",
      },
      commonMistakes: [
        {
          label: 'Passing Raw PyMongo Cursor Docs Directly to jsonify()',
          erroneousCode: `# return jsonify(list(db.students.find()))  # Crashes on ObjectId!`,
          errorMessage: 'TypeError: Object of type ObjectId is not JSON serializable',
          explanation: 'Map each document through a serializer function `[serialize_student(d) for d in cursor]` before calling `jsonify()`.',
          correctedCode: `# return jsonify([serialize_student(d) for d in db.students.find()]), 200`,
        },
      ],
      sourceNotes: 'Covers JSON serialization and BSON/datetime conversion for Day 29.',
      practise: [
        {
          id: 'day29-ex9',
          title: 'Why Raw ObjectId Crashes jsonify()',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'A Flask route runs `return jsonify(list(db.students.find()))` and fails with `TypeError: Object of type ObjectId is not JSON serializable`. What is the cleanest fix?',
          options: [
            { id: 'a', text: 'Map each document through a serializer function that converts _id to str(doc["_id"]) and datetimes to .isoformat().', explanation: 'Correct! Explicit serializers handle non-JSON types and act as a field allowlist.', isCorrect: true },
            { id: 'b', text: 'Delete _id from MongoDB before inserting.', explanation: 'Incorrect. Every MongoDB document requires _id.', isCorrect: false },
            { id: 'c', text: 'Change the HTTP method from GET to POST.', explanation: 'Incorrect. HTTP method does not affect JSON serialization.', isCorrect: false },
            { id: 'd', text: 'Use str(list(cursor)) instead of jsonify().', explanation: 'Incorrect. str(list) produces Python repr with single quotes, not valid JSON.', isCorrect: false },
          ],
          hints: ['json.dumps() only supports str, int, float, bool, None, list, dict.', 'Cast ObjectId with str().', 'Format datetime with .isoformat().'],
          points: 10,
        },
        {
          id: 'day29-ex10',
          title: 'Write a Safe Document Serializer',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Write `serialize_order(doc)` that takes `{"_id": ..., "total": ..., "created_at": datetime, "internal_note": ...}` and returns `{"id": str(doc["_id"]), "total": doc["total"], "created_at": doc["created_at"].isoformat()}` (omitting `internal_note`).',
          starterCode: `def serialize_order(doc):
    pass
`,
          solutionCode: `def serialize_order(doc):
    return {
        "id": str(doc["_id"]),
        "total": doc["total"],
        "created_at": doc["created_at"].isoformat(),
    }
`,
          testCases: [
            { id: 'tc1', label: 'Converts _id and datetime, strips internal_note', setup: 'from datetime import datetime, timezone\nd = {"_id": 55, "total": 99.5, "created_at": datetime(2026, 1, 2, 3, 4, tzinfo=timezone.utc), "internal_note": "secret"}\nres = serialize_order(d)\nprint(res["id"], res["total"], res["created_at"], "internal_note" in res)', expected: '55 99.5 2026-01-02T03:04:00+00:00 False', hidden: false },
          ],
          hints: ['Convert _id with str(doc["_id"]).', 'Format created_at with .isoformat().', 'Only include id, total, and created_at.'],
          points: 15,
        },
        {
          id: 'day29-ex11',
          title: 'Order Serialization Pipeline Steps',
          type: 'order-the-lines',
          tier: 'standard',
          prompt: 'Order the lines to safely serialize a database record containing a datetime into a JSON string.',
          jumbledLines: [
            { id: 'l1', code: 'import json', indent: 0 },
            { id: 'l2', code: 'from datetime import datetime, timezone', indent: 0 },
            { id: 'l3', code: 'doc = {"id": "1", "ts": datetime(2026, 5, 1, tzinfo=timezone.utc).isoformat()}', indent: 0 },
            { id: 'l4', code: 'print(json.dumps(doc))', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: ['Imports come first.', 'Convert datetime with .isoformat() inside doc.', 'Call json.dumps(doc) last.'],
          points: 10,
        },
        {
          id: 'day29-ex12',
          title: 'Trace Allowlist Security Benefit',
          type: 'explain-the-trace',
          tier: 'challenge',
          prompt: 'Why is an explicit allowlist serializer safer than doing `doc["id"] = str(doc.pop("_id"))` and returning the whole `doc`?',
          traceStepCode: `def serialize_user(doc):\n    return {"id": str(doc["_id"]), "username": doc["username"]}`,
          traceQuestion: 'What security risk does an explicit allowlist prevent?',
          modelAnswer: 'If a future migration adds sensitive fields like password_hash, reset_token, or internal_flags to the database document, mutating _id and returning the full dict would accidentally leak those secrets in the API response. An allowlist serializer guarantees only approved fields are ever exposed.',
          markingCriteria: [
            { id: 'mc1', label: 'Identifies accidental leakage of sensitive/future DB fields', points: 5 },
            { id: 'mc2', label: 'Explains allowlist only exposes explicitly listed keys', points: 5 },
          ],
          hints: ['What happens if a new secret field is added to the DB later?', 'Returning the whole dict exposes everything by default.', 'Allowlists fail closed.'],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day29-sub4',
      number: 4,
      title: 'Request Payload Validation & Structured 400/422 Errors',
      summary: 'Validate required fields, types, and value ranges before mutating database state.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Defensive Input Validation & Machine-Readable Errors',
        paragraphs: [
          'Never trust incoming JSON from `request.get_json()`. Clients can send malformed JSON, an empty body (`None`), missing required fields, or wrong types (e.g., `"age": "twenty"` instead of an integer).',
          'Validate payloads at the API boundary before calling the database. Return **`400 Bad Request`** when JSON syntax is missing/malformed, and **`422 Unprocessable Entity`** (or `400`) with a structured `{"error": "ValidationError", "details": [{"field": ..., "message": ...}]}` body when field rules fail.',
        ],
        keyTerms: [
          {
            term: '400 vs 422',
            definition: '400 Bad Request for malformed JSON/missing body; 422 Unprocessable Entity for valid JSON failing schema/type rules.',
          },
          {
            term: 'request.get_json(silent=True)',
            definition: 'Returns None instead of throwing an HTML 400 page when the request body is not valid JSON.',
          },
        ],
        bulletPoints: [
          'Collect all field errors in one pass so clients can fix multiple fields at once.',
          'Check `isinstance(val, int) and not isinstance(val, bool)` in Python because `bool` is a subclass of `int`!',
        ],
      },
      visualise: {
        type: 'api-validation-serialization-sim',
        title: 'Payload Validation & BSON-to-JSON Serializer',
        badge: 'simulation',
        description: 'Test missing fields and type mismatches to inspect structured 400 and 422 error envelopes.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Writing a Pure Python Payload Validator',
          runMode: 'real',
          code: `def validate_student(payload):
    errors = []
    if not isinstance(payload, dict):
        return [{"field": "_body", "message": "Expected JSON object"}]
    name = payload.get("name")
    if not isinstance(name, str) or not name.strip():
        errors.append({"field": "name", "message": "Non-empty string required"})
    age = payload.get("age")
    if isinstance(age, bool) or not isinstance(age, int) or age < 0:
        errors.append({"field": "age", "message": "Non-negative integer required"})
    return errors

print(validate_student({"name": "", "age": True}))`,
          expectedOutput: "[{'field': 'name', 'message': 'Non-empty string required'}, {'field': 'age', 'message': 'Non-negative integer required'}]",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 9,
          instruction: 'if isinstance(age, bool) or not isinstance(age, int)',
          internalEffect: 'Explicitly rejects booleans (`True`/`False`) since `isinstance(True, int)` is True in Python.',
        },
      ],
      apply: {
        domain: 'Checkout APIs',
        contextTitle: 'Returning Structured Error Lists',
        scenario: 'Check multiple required fields in one validation pass.',
        code: `REQUIRED = ("email", "plan")
body = {"email": "a@b.com"}
missing = [f for f in REQUIRED if f not in body]
print("Missing:", missing)`,
        outcome: "Missing: ['plan']",
      },
      commonMistakes: [
        {
          label: 'Accepting Python Booleans as Integers in isinstance(x, int)',
          erroneousCode: `isinstance(True, int)  # Evaluates to True!`,
          errorMessage: 'age=True passes integer validation silently',
          explanation: 'In Python, `bool` subclasses `int`. Always check `not isinstance(val, bool) and isinstance(val, int)`.',
          correctedCode: `not isinstance(val, bool) and isinstance(val, int)`,
        },
      ],
      sourceNotes: 'Covers payload validation and 400/422 error envelopes for Day 29.',
      practise: [
        {
          id: 'day29-ex13',
          title: 'Python bool Is a Subclass of int Trap',
          type: 'predict-output',
          tier: 'standard',
          prompt: 'What does this naive type check print when a client sends `{"age": True}` in JSON?',
          contextScenario: 'payload = {"age": True}\nprint(isinstance(payload["age"], int))',
          options: [
            { id: 'a', text: 'True', explanation: 'Correct! In Python bool subclasses int, so isinstance(True, int) is True—always guard with `not isinstance(x, bool)`.', isCorrect: true },
            { id: 'b', text: 'False', explanation: 'Incorrect. bool inherits from int in Python.', isCorrect: false },
            { id: 'c', text: 'TypeError', explanation: 'Incorrect. isinstance() never raises TypeError here.', isCorrect: false },
            { id: 'd', text: 'None', explanation: 'Incorrect. isinstance() returns a bool.', isCorrect: false },
          ],
          hints: ['Recall Python class hierarchy: bool inherits from int.', 'True == 1 in Python.', 'Use `isinstance(x, int) and not isinstance(x, bool)`.'],
          points: 10,
        },
        {
          id: 'day29-ex14',
          title: 'Fix Boolean Passing Integer Validation',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'This `validate_age(payload)` helper accidentally accepts `{"age": True}` as a valid integer. Fix it so booleans and negative numbers are rejected.',
          starterCode: `def validate_age(payload):
    age = payload.get("age")
    return isinstance(age, int) and age >= 0
`,
          solutionCode: `def validate_age(payload):
    age = payload.get("age")
    return not isinstance(age, bool) and isinstance(age, int) and age >= 0
`,
          testCases: [
            { id: 'tc1', label: 'Rejects bool True', setup: 'print(validate_age({"age": True}), validate_age({"age": -1}))', expected: 'False False', hidden: false },
            { id: 'tc2', label: 'Accepts valid int', setup: 'print(validate_age({"age": 21}))', expected: 'True', hidden: true },
          ],
          hints: ['Add `not isinstance(age, bool)` before `isinstance(age, int)`.', 'Keep `age >= 0`.', 'Test with True and 21.'],
          points: 15,
        },
        {
          id: 'day29-ex15',
          title: 'Write a Multi-Field Payload Validator',
          type: 'write-code',
          tier: 'challenge',
          prompt: 'Write `validate_book(payload)` returning a list of error dicts `{"field": ..., "message": ...}`: require non-empty string `"title"` and `int` (not `bool`) `"pages"` > 0.',
          starterCode: `def validate_book(payload):
    pass
`,
          solutionCode: `def validate_book(payload):
    errors = []
    if not isinstance(payload, dict):
        return [{"field": "_body", "message": "Expected dict"}]
    title = payload.get("title")
    if not isinstance(title, str) or not title.strip():
        errors.append({"field": "title", "message": "Required non-empty string"})
    pages = payload.get("pages")
    if isinstance(pages, bool) or not isinstance(pages, int) or pages <= 0:
        errors.append({"field": "pages", "message": "Must be positive integer"})
    return errors
`,
          testCases: [
            { id: 'tc1', label: 'Collects both errors', setup: 'print(len(validate_book({"title": " ", "pages": False})))', expected: '2', hidden: false },
            { id: 'tc2', label: 'Valid payload returns empty list', setup: 'print(validate_book({"title": "Python", "pages": 250}))', expected: '[]', hidden: true },
          ],
          hints: ['Check title is str and title.strip() is non-empty.', 'Check pages is int, not bool, and > 0.', 'Append both errors instead of returning early.'],
          points: 20,
        },
        {
          id: 'day29-ex16',
          title: '400 Bad Request vs 422 Unprocessable Entity',
          type: 'theory-reasoning',
          tier: 'standard',
          prompt: 'When building a JSON API, when should you return `400 Bad Request` vs `422 Unprocessable Entity`?',
          modelAnswer: 'Return 400 Bad Request when the request is syntactically malformed (e.g., invalid JSON body or missing Content-Type). Return 422 Unprocessable Entity when the JSON syntax is valid, but semantic validation fails (e.g., missing required fields or age < 0).',
          markingCriteria: [
            { id: 'mc1', label: '400 = syntactically malformed JSON/request', points: 5 },
            { id: 'mc2', label: '422 = valid JSON failing semantic/schema validation', points: 5 },
          ],
          hints: ['Syntax error vs semantic schema error.', 'Broken JSON -> 400.', 'Valid JSON with wrong field types -> 422.'],
          points: 10,
        },
      ],
      assess: [],
    },
    {
      id: 'day29-sub5',
      number: 5,
      title: 'POST Creation, Location Headers & 201 Created',
      summary: 'Persist validated resources, return 201 Created, and include a Location header.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Crafting Proper Resource Creation Endpoints',
        paragraphs: [
          'When a `POST /api/v1/students` request passes validation and is inserted into the database, the server should return **`201 Created`** (not `200 OK`) along with the newly created resource representation—including its server-generated `id`.',
          'Following HTTP standards, include a **`Location`** response header pointing to the canonical URI of the new resource (e.g., `Location: /api/v1/students/65f1a03`).',
        ],
        keyTerms: [
          {
            term: '201 Created',
            definition: 'HTTP status code confirming that a POST request created a new server resource.',
          },
          {
            term: 'Location Header',
            definition: 'Response header containing the canonical URL of the newly created resource.',
          },
        ],
        bulletPoints: [
          'Never let clients supply their own primary key `_id` unless the API explicitly uses client-generated UUIDs.',
          'Return `409 Conflict` if a unique constraint (like duplicate email) is violated.',
        ],
      },
      visualise: {
        type: 'api-builder-router-sim',
        title: 'RESTful API Route & Handler Builder',
        badge: 'simulation',
        description: 'Select POST /students to inspect 201 Created and the Location response header.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Simulating POST Creation with 201 & Location Header',
          runMode: 'real',
          code: `def create_student(store, payload):
    new_id = f"s_{len(store) + 1}"
    record = {"id": new_id, "name": payload["name"]}
    store.append(record)
    headers = {"Location": f"/api/v1/students/{new_id}"}
    return record, 201, headers

db = []
print(create_student(db, {"name": "Nadia"}))`,
          expectedOutput: "({'id': 's_1', 'name': 'Nadia'}, 201, {'Location': '/api/v1/students/s_1'})",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 5,
          instruction: 'headers = {"Location": f"/api/v1/students/{new_id}"}',
          internalEffect: 'Attaches the canonical resource URI in the Location response header.',
        },
      ],
      apply: {
        domain: 'User Registration',
        contextTitle: 'Handling Duplicate Key Conflicts (409)',
        scenario: 'Return 409 Conflict when an email already exists.',
        code: `existing_emails = {"ada@dev.io"}
email = "ada@dev.io"
status = 409 if email in existing_emails else 201
print("Status:", status)`,
        outcome: 'Status: 409',
      },
      commonMistakes: [
        {
          label: 'Returning 200 OK Without the Created Resource ID',
          erroneousCode: `# return jsonify({"ok": True}), 200`,
          errorMessage: 'Client has no idea what ID was assigned to the newly created record',
          explanation: 'Return the serialized object (with `id`), status `201`, and `Location` header.',
          correctedCode: `# return jsonify(created_doc), 201, {"Location": f"/api/v1/students/{created_doc['id']}"}`,
        },
      ],
      sourceNotes: 'Covers POST creation, 201 Created, and Location headers for Day 29.',
      practise: [
        {
          id: 'day29-ex17',
          title: 'POST Creation Status & Location Header',
          type: 'fill-the-gaps',
          tier: 'foundation',
          prompt: 'Complete the standard REST response for a successful `POST /api/v1/students` creation.',
          gaps: [
            { id: 'g1', beforeText: 'Return HTTP status ', afterText: ' Created', correctAnswer: '201', options: ['201', '200', '204'] },
            { id: 'g2', beforeText: ' along with the ', afterText: ' header pointing to /api/v1/students/<id>.', correctAnswer: 'Location', options: ['Location', 'Accept', 'User-Agent'] },
          ],
          hints: ['Resource created = 201.', 'Canonical URI header = Location.', 'Also return the created JSON object in the body.'],
          points: 10,
        },
        {
          id: 'day29-ex18',
          title: 'Duplicate Email Conflict Status Code',
          type: 'scenario-mcq',
          tier: 'standard',
          prompt: 'A client sends `POST /api/v1/users` with `{"email": "ada@dev.io"}`, which violates a unique email index in the database. Which HTTP status code best communicates this duplicate conflict?',
          options: [
            { id: 'a', text: '409 Conflict', explanation: 'Correct! 409 Conflict signals that the request conflicts with the current state of the target resource (e.g., unique key collision).', isCorrect: true },
            { id: 'b', text: '201 Created', explanation: 'Incorrect. The user was not created.', isCorrect: false },
            { id: 'c', text: '502 Bad Gateway', explanation: 'Incorrect. 502 is for upstream proxy failures.', isCorrect: false },
            { id: 'd', text: '204 No Content', explanation: 'Incorrect. 204 indicates success.', isCorrect: false },
          ],
          hints: ['Duplicate unique constraint = resource state conflict.', '409 Conflict is the standard REST code.', 'Do not let DuplicateKeyError bubble up as a 500!'],
          points: 10,
        },
        {
          id: 'day29-ex19',
          title: 'Implement POST Creation Handler with Conflict Guard',
          type: 'write-code',
          tier: 'challenge',
          prompt: 'Write `create_user(users_by_email, email, name)`: if `email` is already in `users_by_email`, return `({"error": "Email exists"}, 409, {})`. Otherwise store `{"id": f"u_{len(users_by_email)+1}", "email": email, "name": name}` and return `(record, 201, {"Location": f"/api/v1/users/{record[\'id\']}"})`.',
          starterCode: `def create_user(users_by_email, email, name):
    pass
`,
          solutionCode: `def create_user(users_by_email, email, name):
    if email in users_by_email:
        return {"error": "Email exists"}, 409, {}
    uid = f"u_{len(users_by_email) + 1}"
    record = {"id": uid, "email": email, "name": name}
    users_by_email[email] = record
    return record, 201, {"Location": f"/api/v1/users/{uid}"}
`,
          testCases: [
            { id: 'tc1', label: 'Creates new user with 201 and Location', setup: 'db = {}\nrec, status, hdrs = create_user(db, "a@b.com", "Ada")\nprint(status, hdrs["Location"], rec["id"])', expected: '201 /api/v1/users/u_1 u_1', hidden: false },
            { id: 'tc2', label: 'Duplicate email returns 409', setup: 'db = {}\ncreate_user(db, "a@b.com", "Ada")\n_, status, _ = create_user(db, "a@b.com", "Ada")\nprint(status)', expected: '409', hidden: true },
          ],
          hints: ['Check `if email in users_by_email:` first.', 'Generate `uid = f"u_{len(users_by_email) + 1}"`.', 'Return `(record, 201, {"Location": ...})`.'],
          points: 20,
        },
        {
          id: 'day29-ex20',
          title: 'Predict Location Header Value',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'What Location header does this snippet print?',
          contextScenario: 'new_id = "65f1a09"\nhdrs = {"Location": f"/api/v1/students/{new_id}"}\nprint(hdrs["Location"])',
          options: [
            { id: 'a', text: '/api/v1/students/65f1a09', explanation: 'Correct!', isCorrect: true },
            { id: 'b', text: '/api/v1/students', explanation: 'Incorrect. Location points to the specific newly created resource.', isCorrect: false },
            { id: 'c', text: '65f1a09', explanation: 'Incorrect. It includes the full resource path.', isCorrect: false },
            { id: 'd', text: 'KeyError', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: ['Evaluate the f-string with new_id = "65f1a09".'],
          points: 10,
        },
      ],
      assess: [],
    },
    {
      id: 'day29-sub6',
      number: 6,
      title: 'PUT vs PATCH Updates & Safe DELETE Endpoints',
      summary: 'Implement full PUT replacement, partial PATCH updates, and 204 No Content deletions.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Updating & Deleting Resources Cleanly',
        paragraphs: [
          'Use **`PUT /api/v1/students/<id>`** when the client sends a complete replacement representation (all required fields must be present). Use **`PATCH /api/v1/students/<id>`** when the client sends only the fields to modify, filtering against an explicit allowlist of updatable fields so immutable fields like `id` or `created_at` cannot be overwritten.',
          'For **`DELETE /api/v1/students/<id>`**, return **`204 No Content`** with an empty body `""` on success, or **`404 Not Found`** if the resource does not exist.',
        ],
        keyTerms: [
          {
            term: 'Updatable Field Allowlist',
            definition: 'A set of field names permitted in PATCH/PUT bodies to prevent mass-assignment vulnerabilities.',
          },
          {
            term: '204 No Content',
            definition: 'Standard HTTP status for successful DELETE with no response body.',
          },
        ],
        bulletPoints: [
          'Never pass `request.get_json()` directly into `db.update_one(..., {"$set": payload})`—always filter by allowlist!',
          'Mass assignment (allowing clients to send `{"role": "admin"}` in a profile PATCH) is a classic security bug.',
        ],
      },
      visualise: {
        type: 'api-builder-router-sim',
        title: 'RESTful API Route & Handler Builder',
        badge: 'simulation',
        description: 'Inspect PATCH partial updates (200 OK) and DELETE (204 No Content) handlers.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Allowlist-Guarded PATCH Update',
          runMode: 'real',
          code: `ALLOWED_PATCH = {"name", "track"}

def patch_student(record, updates):
    clean = {k: v for k, v in updates.items() if k in ALLOWED_PATCH}
    record.update(clean)
    return record

student = {"id": "s1", "name": "Ada", "track": "Web", "role": "student"}
print(patch_student(student, {"track": "Systems", "role": "admin"}))`,
          expectedOutput: "{'id': 's1', 'name': 'Ada', 'track': 'Systems', 'role': 'student'}",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'clean = {k: v for k, v in updates.items() if k in ALLOWED_PATCH}',
          internalEffect: 'Strips disallowed keys like `role` before applying the partial update.',
        },
      ],
      apply: {
        domain: 'Access Control',
        contextTitle: 'Preventing Mass Assignment',
        scenario: 'Block unauthorized field mutations in a profile update endpoint.',
        code: `ALLOWED = {"bio", "city"}
incoming = {"city": "Lagos", "is_verified": True}
filtered = {k: v for k, v in incoming.items() if k in ALLOWED}
print(filtered)`,
        outcome: "{'city': 'Lagos'}",
      },
      commonMistakes: [
        {
          label: 'Passing Unfiltered JSON Into $set (Mass Assignment)',
          erroneousCode: `# db.users.update_one({"_id": oid}, {"$set": request.get_json()})`,
          errorMessage: 'Attackers can overwrite role, is_admin, or account_balance',
          explanation: 'Always filter incoming update dicts against an explicit allowlist of mutable fields.',
          correctedCode: `# updates = {k: v for k, v in payload.items() if k in ALLOWED_FIELDS}`,
        },
      ],
      sourceNotes: 'Covers PUT, PATCH allowlists, and DELETE 204 for Day 29.',
      practise: [
        {
          id: 'day29-ex21',
          title: 'Preventing Mass-Assignment Vulnerabilities',
          type: 'scenario-mcq',
          tier: 'standard',
          prompt: 'Your `PATCH /api/v1/users/<id>` handler passes `request.get_json()` directly into `db.users.update_one({"_id": oid}, {"$set": payload})`. An attacker sends `{"bio": "hi", "role": "admin"}` and becomes an admin. How do you prevent this?',
          options: [
            { id: 'a', text: 'Filter incoming update keys against an explicit allowlist of mutable fields (e.g., ALLOWED_PATCH = {"bio", "city"}).', explanation: 'Correct! An allowlist strips privileged fields like role or is_admin before updating.', isCorrect: true },
            { id: 'b', text: 'Switch the route from PATCH to POST.', explanation: 'Incorrect. Passing unfiltered JSON on POST/PUT has the same mass-assignment risk.', isCorrect: false },
            { id: 'c', text: 'Return 204 No Content instead of 200 OK.', explanation: 'Incorrect. Status code does not prevent the DB write.', isCorrect: false },
            { id: 'd', text: 'Use json.dumps() before $set.', explanation: 'Incorrect. $set expects a dict, not a JSON string.', isCorrect: false },
          ],
          hints: ['This vulnerability is called Mass Assignment.', 'Never trust arbitrary keys from client JSON.', 'Filter keys with `if k in ALLOWED_FIELDS`.'],
          points: 15,
        },
        {
          id: 'day29-ex22',
          title: 'Write an Allowlisted PATCH Filter',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Write `filter_patch(updates, allowed)` returning a new dict containing only `(k, v)` pairs from `updates` where `k in allowed`.',
          starterCode: `def filter_patch(updates, allowed):
    pass
`,
          solutionCode: `def filter_patch(updates, allowed):
    return {k: v for k, v in updates.items() if k in allowed}
`,
          testCases: [
            { id: 'tc1', label: 'Strips disallowed role key', setup: 'print(filter_patch({"name": "Ada", "role": "admin"}, {"name", "track"}))', expected: "{'name': 'Ada'}", hidden: false },
            { id: 'tc2', label: 'Empty when nothing allowed', setup: 'print(filter_patch({"is_admin": True}, {"name"}))', expected: '{}', hidden: true },
          ],
          hints: ['Use a dictionary comprehension.', 'Iterate over `updates.items()`.', 'Keep only `if k in allowed`.'],
          points: 15,
        },
        {
          id: 'day29-ex23',
          title: 'Fix DELETE Handler Status Code',
          type: 'fix-the-bug',
          tier: 'foundation',
          prompt: 'This `delete_item(db, item_id)` handler returns `200` with a dict on success instead of `("", 204)`. Fix it so successful deletion returns `("", 204)` and missing ID returns `({"error": "Not found"}, 404)`.',
          starterCode: `def delete_item(db, item_id):
    if item_id not in db:
        return {"error": "Not found"}, 404
    del db[item_id]
    return {"deleted": True}, 200
`,
          solutionCode: `def delete_item(db, item_id):
    if item_id not in db:
        return {"error": "Not found"}, 404
    del db[item_id]
    return "", 204
`,
          testCases: [
            { id: 'tc1', label: 'Returns empty body and 204', setup: 'd = {"x": 1}\nprint(delete_item(d, "x"), "x" in d)', expected: "('', 204) False", hidden: false },
            { id: 'tc2', label: 'Missing returns 404', setup: 'print(delete_item({}, "y"))', expected: "({'error': 'Not found'}, 404)", hidden: true },
          ],
          hints: ['Replace `{"deleted": True}, 200` with `"", 204`.'],
          points: 10,
        },
        {
          id: 'day29-ex24',
          title: 'PUT vs PATCH Payload Requirements',
          type: 'theory-reasoning',
          tier: 'standard',
          prompt: 'Why does `PUT /api/v1/students/12` require all required fields in the request body whereas `PATCH /api/v1/students/12` allows sending just `{"track": "ML"}`?',
          modelAnswer: 'PUT represents full resource replacement—any omitted optional fields are cleared or reset to defaults, so all required fields must be present. PATCH represents a partial delta update that modifies only the specified fields while leaving other fields untouched.',
          markingCriteria: [
            { id: 'mc1', label: 'Explains PUT is full resource replacement', points: 5 },
            { id: 'mc2', label: 'Explains PATCH is partial field-level update', points: 5 },
          ],
          hints: ['PUT = replace entire document.', 'PATCH = apply partial delta.', 'Omitting a field in PUT vs PATCH behaves differently.'],
          points: 10,
        },
      ],
      assess: [],
    },
    {
      id: 'day29-sub7',
      number: 7,
      title: 'Idempotency Keys for Safe Mutation Retries',
      summary: 'Use Idempotency-Key headers on POST endpoints to prevent duplicate side effects.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Making POST Endpoints Safe to Retry',
        paragraphs: [
          'Because `POST` is not naturally idempotent, mobile apps or flaky networks that retry a timed-out `POST /api/v1/payments` can accidentally create duplicate orders or charges.',
          'Production APIs solve this with an **`Idempotency-Key`** request header (typically a client-generated UUID). The server stores `(idempotency_key -> cached_response, status_code)` in Redis or a database. If the same key arrives again, the server skips re-executing the mutation and replays the exact cached response.',
        ],
        keyTerms: [
          {
            term: 'Idempotency-Key',
            definition: 'A unique client-generated header enabling servers to deduplicate retried POST requests.',
          },
          {
            term: 'Response Replay',
            definition: 'Returning the previously stored response for a repeated Idempotency-Key without re-running side effects.',
          },
        ],
        bulletPoints: [
          'Scope idempotency keys per authenticated user/tenant so two users cannot collide.',
          'Return `409 Conflict` or `422` if a client reuses the same key with a different request payload.',
        ],
      },
      visualise: {
        type: 'api-idempotency-pagination-sim',
        title: 'Idempotency-Key & Pagination Engine',
        badge: 'simulation',
        description: 'Compare retrying a POST with and without an Idempotency-Key header.',
        initialConfig: {},
      },
      code: [
        {
          title: 'In-Memory Idempotency-Key Store',
          runMode: 'real',
          code: `cache = {}
orders = []

def create_order(idem_key, item):
    if idem_key in cache:
        return cache[idem_key]
    order = {"id": f"ord_{len(orders) + 1}", "item": item}
    orders.append(order)
    cache[idem_key] = (order, 201)
    return cache[idem_key]

print(create_order("k-100", "Book"))
print(create_order("k-100", "Book"))
print("Total orders:", len(orders))`,
          expectedOutput: "({'id': 'ord_1', 'item': 'Book'}, 201)\n({'id': 'ord_1', 'item': 'Book'}, 201)\nTotal orders: 1",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 5,
          instruction: 'if idem_key in cache: return cache[idem_key]',
          internalEffect: 'Detects the retry and replays the original (order, 201) without appending a second order.',
        },
      ],
      apply: {
        domain: 'Fintech',
        contextTitle: 'Deduplicating Payment Retries',
        scenario: 'Ensure repeated transfer requests with the same key execute only once.',
        code: `seen = {"tx-9": {"status": "settled"}}
print("Replay:", seen.get("tx-9"))`,
        outcome: "Replay: {'status': 'settled'}",
      },
      commonMistakes: [
        {
          label: 'Ignoring Payload Mismatch on Reused Idempotency Keys',
          erroneousCode: `# Same key, different amount ($100 vs $500) -> silently returns $100 receipt`,
          errorMessage: 'Silent data mismatch masks client bugs',
          explanation: 'Hash the request body alongside the key and return `422`/`409` if the same key is reused with a different payload.',
          correctedCode: `# if stored_hash != payload_hash: return {"error": "Idempotency key reused with different payload"}, 422`,
        },
      ],
      sourceNotes: 'Covers Idempotency-Key headers and mutation deduplication for Day 29.',
      practise: [
        {
          id: 'day29-ex25',
          title: 'Deduplicating Retried POST Payments',
          type: 'scenario-mcq',
          tier: 'standard',
          prompt: 'A client sends `POST /api/v1/charges` with `Idempotency-Key: chg_991` and times out waiting for the response, then retries with the same `Idempotency-Key`. What should the server do on the second request?',
          options: [
            { id: 'a', text: 'Skip creating a new charge and replay the cached response from the first request.', explanation: 'Correct! Replaying the cached response guarantees the customer is charged only once.', isCorrect: true },
            { id: 'b', text: 'Create a second charge so the retry succeeds.', explanation: 'Incorrect. That double-charges the customer.', isCorrect: false },
            { id: 'c', text: 'Return 500 Internal Server Error.', explanation: 'Incorrect. Retries should succeed transparently with the cached result.', isCorrect: false },
            { id: 'd', text: 'Delete the first charge and create a new one.', explanation: 'Incorrect. Replaying the original result is atomic and safe.', isCorrect: false },
          ],
          hints: ['Why do clients send Idempotency-Key?', 'The first request already succeeded on the server.', 'Replay the stored response without re-running the side effect.'],
          points: 15,
        },
        {
          id: 'day29-ex26',
          title: 'Implement an Idempotent POST Handler',
          type: 'write-code',
          tier: 'project',
          prompt: 'Write `idempotent_create(cache, orders, key, item)`: if `key` is in `cache`, return `cache[key]`. Otherwise append `{"id": f"o{len(orders)+1}", "item": item}` to `orders`, store `(order, 201)` in `cache[key]`, and return `(order, 201)`.',
          starterCode: `def idempotent_create(cache, orders, key, item):
    pass
`,
          solutionCode: `def idempotent_create(cache, orders, key, item):
    if key in cache:
        return cache[key]
    order = {"id": f"o{len(orders) + 1}", "item": item}
    orders.append(order)
    cache[key] = (order, 201)
    return cache[key]
`,
          testCases: [
            { id: 'tc1', label: 'Retry replays cached order without duplicate', setup: 'c, o = {}, []\nr1 = idempotent_create(c, o, "k1", "Pen")\nr2 = idempotent_create(c, o, "k1", "Pen")\nprint(r1 == r2, len(o))', expected: 'True 1', hidden: false },
            { id: 'tc2', label: 'Distinct keys create distinct orders', setup: 'c, o = {}, []\nidempotent_create(c, o, "k1", "Pen")\nidempotent_create(c, o, "k2", "Book")\nprint(len(o))', expected: '2', hidden: true },
          ],
          hints: ['Check `if key in cache:` first.', 'Create order dict and append to orders.', 'Cache `(order, 201)` under `cache[key]`.'],
          points: 20,
        },
        {
          id: 'day29-ex27',
          title: 'Detecting Payload Mismatch on Reused Idempotency Key',
          type: 'explain-the-trace',
          tier: 'challenge',
          prompt: 'Why should an API server compare a hash of the request payload when an `Idempotency-Key` is reused?',
          traceStepCode: `POST /charges (Idempotency-Key: k1, amount=10)\nPOST /charges (Idempotency-Key: k1, amount=99) -> 422`,
          traceQuestion: 'What bug does comparing payload hashes catch?',
          modelAnswer: 'If a client accidentally reuses an old Idempotency-Key for a brand-new operation with different parameters (amount=99 instead of 10), silently replaying the old amount=10 receipt would hide a serious client bug. Comparing payload hashes catches this mismatch and returns 422/409.',
          markingCriteria: [
            { id: 'mc1', label: 'Explains silent mismatch if key is reused with different data', points: 5 },
            { id: 'mc2', label: 'Recommends 422/409 error on payload mismatch', points: 5 },
          ],
          hints: ['What if a client forgets to generate a fresh UUID for a new purchase?', 'Replaying $10 when they asked for $99 is misleading.', 'Fail with 422/409 on payload mismatch.'],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day29-sub8',
      number: 8,
      title: 'Pagination, Filtering, Sorting & Standardized Error Handlers',
      summary: 'Implement bounded offset pagination and register global JSON error handlers.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Scaling Collection Endpoints & Global JSON Errors',
        paragraphs: [
          'Returning an entire database table from `GET /api/v1/orders` will eventually exhaust server memory and time out. Always paginate collection endpoints using `?page=1&limit=20`, **clamping** `page >= 1` and `1 <= limit <= 100` on the server so no client can request `limit=1000000`.',
          'Finally, register global Flask error handlers (`@app.errorhandler(404)`, `@app.errorhandler(500)`) so every unexpected route miss or unhandled exception returns clean JSON instead of HTML stack traces.',
        ],
        keyTerms: [
          {
            term: 'Clamped Pagination',
            definition: 'Enforcing server-side bounds (e.g., page >= 1, 1 <= limit <= 100) on query parameters.',
          },
          {
            term: 'Global Error Handler',
            definition: 'Framework hook (@app.errorhandler) converting HTTP/server errors into consistent JSON responses.',
          },
        ],
        bulletPoints: [
          'Offset formula: `skip = (page - 1) * limit`.',
          'Include `total`, `page`, `limit`, and `has_next` in the paginated response envelope.',
        ],
      },
      visualise: {
        type: 'api-idempotency-pagination-sim',
        title: 'Idempotency-Key & Pagination Engine',
        badge: 'simulation',
        description: 'Step through paginated API envelopes and inspect total, total_pages, and has_next.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Clamped Offset Pagination Helper',
          runMode: 'real',
          code: `def paginate(items, page=1, limit=5, max_limit=100):
    page = max(1, page)
    limit = max(1, min(limit, max_limit))
    start = (page - 1) * limit
    sliced = items[start:start + limit]
    return {
        "page": page,
        "limit": limit,
        "total": len(items),
        "has_next": start + limit < len(items),
        "items": sliced,
    }

data = [f"o{i}" for i in range(1, 8)]
print(paginate(data, page=2, limit=3))`,
          expectedOutput: "{'page': 2, 'limit': 3, 'total': 7, 'has_next': True, 'items': ['o4', 'o5', 'o6']}",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'limit = max(1, min(limit, max_limit))',
          internalEffect: 'Clamps client-supplied limit between 1 and 100 to protect memory and DB.',
        },
        {
          step: 2,
          codeLine: 4,
          instruction: 'start = (page - 1) * limit',
          internalEffect: 'Computes the 0-based slice offset from 1-based page number.',
        },
      ],
      apply: {
        domain: 'Reporting APIs',
        contextTitle: 'Allowlisted Sort Fields',
        scenario: 'Prevent arbitrary column sorting injection by checking an allowlist.',
        code: `ALLOWED_SORTS = {"created_at", "amount"}
req_sort = "amount"
sort_field = req_sort if req_sort in ALLOWED_SORTS else "created_at"
print("Sorting by:", sort_field)`,
        outcome: 'Sorting by: amount',
      },
      commonMistakes: [
        {
          label: 'Trusting Client limit=9999999 Without Clamping',
          erroneousCode: `# limit = int(request.args.get("limit", 20))`,
          errorMessage: 'Denial-of-service / OOM crash when a client passes limit=10000000',
          explanation: 'Always clamp `limit = max(1, min(limit, 100))` and `page = max(1, page)`.',
          correctedCode: `# limit = max(1, min(int(request.args.get("limit", 20)), 100))`,
        },
      ],
      sourceNotes: 'Covers pagination, sorting allowlists, and global JSON error handlers for Day 29.',
      practise: [
        {
          id: 'day29-ex28',
          title: 'Clamping Pagination Bounds to Prevent DoS',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'This `parse_pagination(page, limit)` helper allows `page=-5` or `limit=1000000`. Fix it so `page >= 1` and `1 <= limit <= 100`.',
          starterCode: `def parse_pagination(page, limit):
    return page, limit
`,
          solutionCode: `def parse_pagination(page, limit):
    safe_page = max(1, page)
    safe_limit = max(1, min(limit, 100))
    return safe_page, safe_limit
`,
          testCases: [
            { id: 'tc1', label: 'Clamps negative page and huge limit', setup: 'print(parse_pagination(-3, 50000))', expected: '(1, 100)', hidden: false },
            { id: 'tc2', label: 'Clamps zero limit to 1', setup: 'print(parse_pagination(2, 0))', expected: '(2, 1)', hidden: true },
          ],
          hints: ['Use `max(1, page)` for page.', 'Use `max(1, min(limit, 100))` for limit.', 'Return `(safe_page, safe_limit)`.'],
          points: 15,
        },
        {
          id: 'day29-ex29',
          title: 'Build a Paginated Slice & Metadata Envelope',
          type: 'write-code',
          tier: 'project',
          prompt: 'Write `paginate_items(items, page, limit)` (clamping `page >= 1` and `1 <= limit <= 100`) returning `{"page": page, "limit": limit, "total": len(items), "has_next": bool, "items": slice}`.',
          starterCode: `def paginate_items(items, page=1, limit=10):
    pass
`,
          solutionCode: `def paginate_items(items, page=1, limit=10):
    page = max(1, page)
    limit = max(1, min(limit, 100))
    start = (page - 1) * limit
    sliced = items[start:start + limit]
    return {
        "page": page,
        "limit": limit,
        "total": len(items),
        "has_next": start + limit < len(items),
        "items": sliced,
    }
`,
          testCases: [
            { id: 'tc1', label: 'Page 2 of 5 items with limit 2', setup: 'res = paginate_items([1,2,3,4,5], 2, 2)\nprint(res["items"], res["has_next"])', expected: '[3, 4] True', hidden: false },
            { id: 'tc2', label: 'Last page has_next is False', setup: 'res = paginate_items([1,2,3,4,5], 3, 2)\nprint(res["items"], res["has_next"])', expected: '[5] False', hidden: true },
          ],
          hints: ['Compute `start = (page - 1) * limit`.', 'Slice `items[start:start + limit]`.', '`has_next` is `start + limit < len(items)`.'],
          points: 20,
        },
        {
          id: 'day29-ex30',
          title: 'Global JSON Error Handlers in Flask',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Why should a REST API register `@app.errorhandler(404)` and `@app.errorhandler(500)` returning `jsonify({"error": ...})`?',
          options: [
            { id: 'a', text: 'So API clients always receive parseable JSON error responses instead of default HTML error pages.', explanation: 'Correct! Clients calling .json() crash if the server returns HTML on 404/500.', isCorrect: true },
            { id: 'b', text: 'Because Flask refuses to start without errorhandler(500).', explanation: 'Incorrect. Flask starts fine, but returns HTML by default.', isCorrect: false },
            { id: 'c', text: 'To convert 500 errors into 200 OK.', explanation: 'Incorrect. You still return the 404/500 status code alongside JSON.', isCorrect: false },
            { id: 'd', text: 'To disable CORS preflight.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: ['What does Flask return on 404 by default?', 'API clients expect application/json, not text/html.', 'Global errorhandlers enforce consistent JSON errors.'],
          points: 10,
        },
      ],
      assess: [],
    },
  ],
  realWorldLabs: [
    {
      id: 'day29-lab1',
      title: 'Lab 1: Student Resource Serializer & Input Validator',
      description: 'Validate incoming student JSON payloads (rejecting bools as ints) and serialize internal records with ISO timestamps.',
      domain: 'EdTech API Backend',
      starterCode: `from datetime import datetime, timezone

def validate_and_serialize(payload):
    if not isinstance(payload.get("name"), str) or not payload["name"].strip():
        return {"error": "Invalid name"}, 422
    age = payload.get("age")
    if isinstance(age, bool) or not isinstance(age, int) or age < 0:
        return {"error": "Invalid age"}, 422
    doc = {
        "id": "stu_101",
        "name": payload["name"].strip(),
        "age": age,
        "created_at": datetime(2026, 11, 11, 18, 0, tzinfo=timezone.utc).isoformat(),
    }
    return doc, 201

print(validate_and_serialize({"name": "Ada", "age": True})[1])
res, code = validate_and_serialize({"name": " Ada ", "age": 22})
print(code, res["name"], res["id"])
`,
      targetOutput: '422\n201 Ada stu_101',
    },
    {
      id: 'day29-lab2',
      title: 'Lab 2: Idempotent Order API & Bounded Pagination',
      description: 'Combine Idempotency-Key deduplication for POST orders with clamped offset pagination for GET orders.',
      domain: 'E-Commerce API',
      starterCode: `cache = {}
orders = []

def post_order(key, sku):
    if key in cache:
        return cache[key]
    rec = {"id": f"ord_{len(orders)+1}", "sku": sku}
    orders.append(rec)
    cache[key] = (rec, 201)
    return cache[key]

def get_orders(page=1, limit=2):
    page = max(1, page)
    limit = max(1, min(limit, 100))
    start = (page - 1) * limit
    return {"page": page, "total": len(orders), "items": orders[start:start+limit]}

post_order("k1", "KB-1")
post_order("k1", "KB-1")
post_order("k2", "MS-2")
print(len(orders), get_orders(page=1, limit=1)["items"][0]["sku"])
`,
      targetOutput: '2 KB-1',
    },
  ],
  miniProject: {
    id: 'day29-project',
    title: 'Production-Ready REST API Service (Validation, Idempotency & Pagination)',
    brief: 'Build a complete RESTful API service layer with BSON/datetime serialization, 400/422 validation, allowlisted PATCH, Idempotency-Key deduplication, and clamped pagination.',
    requirements: [
      'Serialize internal records into JSON-safe dicts with string id and ISO 8601 timestamps',
      'Validate required fields and types with structured error details',
      'Guard PATCH updates with an explicit field allowlist',
      'Deduplicate retried POST requests via Idempotency-Key',
      'Return bounded offset pagination envelopes with has_next metadata',
    ],
    rubric: [
      { criterion: 'Serialization & Validation Rigor', weight: 35 },
      { criterion: 'Allowlist Security & Idempotency', weight: 35 },
      { criterion: 'Clamped Pagination & Error Envelopes', weight: 30 },
    ],
    starterCode: `ALLOWED_PATCH = {"name", "track"}

def patch_record(record, updates):
    clean = {k: v for k, v in updates.items() if k in ALLOWED_PATCH}
    record.update(clean)
    return record, 200

def paginate(items, page=1, limit=5):
    page = max(1, page)
    limit = max(1, min(limit, 100))
    start = (page - 1) * limit
    return {"page": page, "total": len(items), "has_next": start + limit < len(items), "items": items[start:start+limit]}

rec = {"id": "s1", "name": "Ada", "track": "Web", "role": "student"}
updated, status = patch_record(rec, {"track": "Systems", "role": "admin"})
print(status, updated["track"], updated["role"])
print(paginate(["a", "b", "c"], page=1, limit=2))
`,
  },
  dayQuiz: {
    title: 'Day 29 Checkpoint Quiz: Building APIs',
    questions: [
      {
        id: 'day29-q1',
        scenario: 'Structuring a collection endpoint response.',
        question: 'Why wrap collection items in `{"count": N, "items": [...]}` instead of returning a bare JSON list?',
        options: [
          { id: 'a', text: 'It allows adding pagination or metadata keys later without breaking existing clients.', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: 'JSON does not support top-level arrays.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'c', text: 'Flask cannot jsonify lists.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'd', text: 'It automatically encrypts the payload.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'day29-q2',
        scenario: 'Handling GET /api/v1/students/<id> when ID does not exist.',
        question: 'What should the endpoint return?',
        options: [
          { id: 'a', text: 'JSON error object with HTTP 404 Not Found.', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: '200 OK with null.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'c', text: '500 Internal Server Error.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'd', text: '302 Redirect to homepage.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'day29-q3',
        scenario: 'Serializing MongoDB documents in Python.',
        question: 'Why does `json.dumps(doc)` fail on a raw PyMongo document?',
        options: [
          { id: 'a', text: 'BSON ObjectId and datetime are not natively JSON-serializable.', explanation: 'Correct! Convert _id with str() and dates with .isoformat().', isCorrect: true },
          { id: 'b', text: 'PyMongo documents are tuples.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'c', text: 'json.dumps() only accepts strings.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'd', text: 'MongoDB keys use single quotes.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'day29-q4',
        scenario: 'Validating an integer field in Python.',
        question: 'Why must you check `not isinstance(val, bool)` alongside `isinstance(val, int)`?',
        options: [
          { id: 'a', text: 'Because bool is a subclass of int in Python, so isinstance(True, int) is True.', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: 'Because bool raises SyntaxError in JSON.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'c', text: 'Because int is a subclass of str.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'd', text: 'Because booleans are negative numbers.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'day29-q5',
        scenario: 'Returning a response after POST /api/v1/students creates a record.',
        question: 'Which status code and header follow REST best practices?',
        options: [
          { id: 'a', text: '201 Created with a Location header pointing to the new resource URI.', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: '200 OK with no body.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'c', text: '204 No Content with Location.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'd', text: '404 Not Found.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'day29-q6',
        scenario: 'A user registration POST collides with an existing unique email.',
        question: 'Which HTTP status code should be returned?',
        options: [
          { id: 'a', text: '409 Conflict', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: '201 Created', explanation: 'Incorrect.', isCorrect: false },
          { id: 'c', text: '204 No Content', explanation: 'Incorrect.', isCorrect: false },
          { id: 'd', text: '503 Service Unavailable', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'day29-q7',
        scenario: 'Securing a PATCH /api/v1/users/<id> endpoint.',
        question: 'How do you prevent mass-assignment attacks (e.g., client sending `{"role": "admin"}`)?',
        options: [
          { id: 'a', text: 'Filter incoming keys against an explicit allowlist of updatable fields.', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: 'Allow all keys and check them after saving.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'c', text: 'Use GET instead of PATCH.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'd', text: 'Disable JSON parsing.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'day29-q8',
        scenario: 'Implementing DELETE /api/v1/students/<id>.',
        question: 'What is the standard success response?',
        options: [
          { id: 'a', text: '204 No Content with an empty body.', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: '201 Created.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'c', text: '409 Conflict.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'd', text: '301 Moved Permanently.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'day29-q9',
        scenario: 'Protecting POST /api/v1/payments from duplicate retries.',
        question: 'What does an `Idempotency-Key` header enable?',
        options: [
          { id: 'a', text: 'The server caches the first result and replays it on retries without re-executing the charge.', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: 'It encrypts the credit card number.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'c', text: 'It bypasses authentication.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'd', text: 'It disables rate limiting.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'day29-q10',
        scenario: 'Implementing offset pagination `?page=1&limit=20`.',
        question: 'Why must the server clamp `page` and `limit`?',
        options: [
          { id: 'a', text: 'To prevent clients from passing negative pages or huge limits (e.g., limit=10000000) that exhaust memory.', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: 'Because Python slices raise SyntaxError on large numbers.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'c', text: 'To turn GET into POST.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'd', text: 'To disable sorting.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
    ],
    passingScorePercentage: 80,
  },
  cheatSheet: [],
  sourceNotes: [
    'Curriculum reference: https://github.com/Asabeneh/30-Days-Of-Python/tree/master/29_Day_Building_API',
  ],
};
