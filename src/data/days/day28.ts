/**
 * Day 28: Application Programming Interfaces (APIs) (Advanced Python)
 * Part A (Learn) conforming to Sections 10, 13.2, and 14 of the Master Specification.
 * Includes:
 *  - 8 Detailed Subtopics following the 10-step pedagogical structure
 *  - 3 Signature Simulations: api-http-lifecycle-sim, api-requests-client-sim, api-auth-cors-sim
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_28_MODULE: DayModule = {
  schemaVersion: 1,
  number: 28,
  title: 'Application Programming Interfaces (APIs)',
  level: 'advanced',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/28_Day_API',
  estimatedMinutes: 75,
  prerequisites: [19, 26],
  objectives: [
    'Understand how RESTful APIs expose structured resources over stateless HTTP',
    'Choose the correct HTTP verb (GET, POST, PUT, PATCH, DELETE) and reason about safety and idempotency',
    'Construct clean URLs with path parameters and URL-encoded query strings',
    'Interpret HTTP status code families (2xx, 3xx, 4xx, 5xx) and handle errors explicitly',
    'Consume JSON APIs in Python using requests patterns, raise_for_status(), and response.json()',
    'Configure Accept, Content-Type, and custom request headers for content negotiation',
    'Authenticate API calls securely with API keys and Bearer tokens from environment variables',
    'Build resilient API clients using explicit timeouts, 429 exponential backoff, and CORS awareness',
  ],
  subtopics: [
    {
      id: 'day28-sub1',
      number: 1,
      title: 'What Is an API & REST Architecture',
      summary: 'Understand the client-server contract, endpoints, resources, and stateless HTTP communication.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'APIs as Typed Contracts Over HTTP',
        paragraphs: [
          'An **Application Programming Interface (API)** is a formal contract that lets two software systems exchange data without exposing internal database tables or implementation details. On the web, most services expose **REST** (Representational State Transfer) APIs over HTTP.',
          'In a RESTful architecture, nouns represent **resources** (such as `/api/v1/books` or `/api/v1/users/42`), and every request is **stateless**: the server does not rely on hidden session memory between calls, so each request carries all needed context (URL, verb, headers, and body).',
        ],
        keyTerms: [
          {
            term: 'Endpoint',
            definition: 'A specific URL path where an API exposes operations on a resource or collection.',
          },
          {
            term: 'Stateless',
            definition: 'Each HTTP request contains full context; the server stores no client session state between calls.',
          },
        ],
        bulletPoints: [
          'Resources are named with plural nouns (`/books`, `/orders`), not action verbs (`/getBooks`).',
          'JSON (`application/json`) is the standard wire format for modern REST APIs.',
        ],
      },
      visualise: {
        type: 'api-http-lifecycle-sim',
        title: 'HTTP Request & REST Endpoint Lifecycle',
        badge: 'simulation',
        description: 'Inspect how REST endpoints pair HTTP verbs with resource URLs and JSON payloads.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Modeling a Stateless REST Response Envelope in Python',
          runMode: 'real',
          code: `import json

response = {
    "status": 200,
    "headers": {"Content-Type": "application/json"},
    "body": {"resource": "books", "count": 2, "items": ["Fluent Python", "Effective Python"]},
}
payload = json.dumps(response["body"])
decoded = json.loads(payload)
print("Count:", decoded["count"], "First:", decoded["items"][0])`,
          expectedOutput: 'Count: 2 First: Fluent Python',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 8,
          instruction: 'json.dumps(response["body"])',
          internalEffect: 'Serializes the Python dictionary into a UTF-8 JSON string for transport.',
        },
        {
          step: 2,
          codeLine: 9,
          instruction: 'json.loads(payload)',
          internalEffect: 'Parses the JSON wire string back into native Python dicts and lists.',
        },
      ],
      apply: {
        domain: 'Microservices',
        contextTitle: 'Versioned Resource Naming',
        scenario: 'Construct versioned REST endpoint URLs for a bookstore service.',
        code: `BASE = "https://api.example.com/api/v1"
book_url = f"{BASE}/books/101"
print(book_url)`,
        outcome: 'https://api.example.com/api/v1/books/101',
      },
      commonMistakes: [
        {
          label: 'Putting Action Verbs in REST Endpoint Paths',
          erroneousCode: `# GET /api/v1/getAllBooks?delete=false`,
          errorMessage: 'Inconsistent RPC-style URLs instead of resource-oriented REST paths',
          explanation: 'HTTP verbs already express the action (`GET`, `POST`, `DELETE`). Keep the URL focused on the resource noun (`/api/v1/books`).',
          correctedCode: `# GET /api/v1/books`,
        },
      ],
      sourceNotes: 'Covers REST architecture, endpoints, and statelessness for Day 28.',
      practise: [
        {
          id: 'day28-ex1',
          title: 'Designing Resource-Oriented REST Endpoints',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'A logistics team is designing a RESTful API for tracking shipments. Which endpoint design follows REST resource-naming best practices?',
          options: [
            { id: 'a', text: 'GET /api/v1/getAllShipments?action=list', explanation: 'Incorrect. REST URLs name resources with nouns; the HTTP verb GET already expresses the action.', isCorrect: false },
            { id: 'b', text: 'GET /api/v1/shipments and GET /api/v1/shipments/42', explanation: 'Correct! Plural nouns represent collections and nested IDs identify individual resources.', isCorrect: true },
            { id: 'c', text: 'POST /api/v1/fetchShipmentById', explanation: 'Incorrect. POST is for creation/mutation, and fetchShipmentById is an RPC verb.', isCorrect: false },
            { id: 'd', text: 'GET /api/v1/shipment_table_rows', explanation: 'Incorrect. APIs abstract away internal database table names.', isCorrect: false },
          ],
          hints: ['Use plural nouns for collections.', 'Let the HTTP verb represent the action.', 'Avoid exposing internal DB table names.'],
          points: 10,
        },
        {
          id: 'day28-ex2',
          title: 'JSON Wire Serialization Round-Trip',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'What does this Python snippet print when serializing and parsing a REST API response envelope?',
          contextScenario: 'import json\nenv = {"status": 200, "data": {"items": [10, 20], "active": True}}\nwire = json.dumps(env)\nparsed = json.loads(wire)\nprint(type(parsed["data"]["active"]).__name__, sum(parsed["data"]["items"]))',
          options: [
            { id: 'a', text: 'str 30', explanation: 'Incorrect. json.loads converts JSON true back into Python bool True.', isCorrect: false },
            { id: 'b', text: 'bool 30', explanation: 'Correct! JSON true deserializes to Python bool, and sum([10, 20]) is 30.', isCorrect: true },
            { id: 'c', text: 'bool 1020', explanation: 'Incorrect. items is a list of ints, not strings.', isCorrect: false },
            { id: 'd', text: 'KeyError: active', explanation: 'Incorrect. active is present inside parsed["data"].', isCorrect: false },
          ],
          hints: ['JSON true maps to Python bool.', 'json.loads restores lists of integers.', 'Sum [10, 20] = 30.'],
          points: 10,
        },
        {
          id: 'day28-ex3',
          title: 'Stateless Request Context',
          type: 'theory-reasoning',
          tier: 'standard',
          prompt: 'Why does REST require every HTTP request to be stateless rather than relying on server-side in-memory session variables across API nodes?',
          modelAnswer: 'In a stateless REST API, each request carries its own authentication token, parameters, and resource ID. Any backend server behind a load balancer can handle any request independently, enabling horizontal scaling and resilience if a server restarts.',
          markingCriteria: [
            { id: 'mc1', label: 'Explains each request carries full context/credentials', points: 5 },
            { id: 'mc2', label: 'Connects statelessness to load balancing / horizontal scaling', points: 5 },
          ],
          hints: ['Think about multiple API servers behind a load balancer.', 'What happens if server A holds session state and the next request hits server B?', 'Self-contained requests enable horizontal scaling.'],
          points: 10,
        },
        {
          id: 'day28-ex4',
          title: 'Build a JSON Response Envelope Helper',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Write a function `make_envelope(resource, items)` that returns a JSON string containing `{"resource": resource, "count": len(items), "items": items}`.',
          starterCode: `import json

def make_envelope(resource, items):
    # Return JSON string with resource, count, and items
    pass
`,
          solutionCode: `import json

def make_envelope(resource, items):
    return json.dumps({"resource": resource, "count": len(items), "items": items})
`,
          testCases: [
            { id: 'tc1', label: 'Two books envelope', setup: 'import json\nd = json.loads(make_envelope("books", ["A", "B"]))\nprint(d["resource"], d["count"], d["items"])', expected: 'books 2 [\'A\', \'B\']', hidden: false },
            { id: 'tc2', label: 'Empty list envelope', setup: 'import json\nd = json.loads(make_envelope("users", []))\nprint(d["count"])', expected: '0', hidden: true },
          ],
          hints: ['Use json.dumps(...).', 'Include keys "resource", "count", and "items".', 'Compute count with len(items).'],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day28-sub2',
      number: 2,
      title: 'HTTP Verbs & Idempotency (GET, POST, PUT, PATCH, DELETE)',
      summary: 'Distinguish safe vs. idempotent HTTP methods so retries never corrupt data.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Choosing the Right HTTP Verb & Reasoning About Retries',
        paragraphs: [
          'HTTP defines standard verbs with strict semantics: **`GET`** reads data, **`POST`** creates a new resource, **`PUT`** replaces an entire resource, **`PATCH`** applies a partial update, and **`DELETE`** removes a resource.',
          'A method is **safe** if it never mutates server state (`GET`, `HEAD`). A method is **idempotent** if calling it once or ten times leaves the server in the exact same final state (`GET`, `PUT`, `DELETE`). `POST` is neither safe nor idempotent—retrying a timed-out `POST /orders` without an idempotency key can create duplicate charges!',
        ],
        keyTerms: [
          {
            term: 'Safe Method',
            definition: 'A read-only HTTP method (GET, HEAD) that does not alter server state.',
          },
          {
            term: 'Idempotent Method',
            definition: 'An operation whose repeated identical execution produces the same final server state (GET, PUT, DELETE).',
          },
        ],
        bulletPoints: [
          '`PUT /users/7` replaces the full user representation; `PATCH /users/7` updates only specified fields.',
          'Never use `GET` to trigger state changes like deletions or payments.',
        ],
      },
      visualise: {
        type: 'api-http-lifecycle-sim',
        title: 'HTTP Request & REST Endpoint Lifecycle',
        badge: 'simulation',
        description: 'Switch between GET, POST, PUT, and DELETE to compare status codes and idempotency.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Verifying Idempotency Across PUT vs POST',
          runMode: 'real',
          code: `store = {}

def handle_put(item_id, name):
    store[item_id] = {"id": item_id, "name": name}
    return 200

handle_put(10, "Keyboard")
handle_put(10, "Keyboard")
print("Store size after 2 PUTs:", len(store), store[10]["name"])`,
          expectedOutput: 'Store size after 2 PUTs: 1 Keyboard',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'def handle_put(item_id, name): store[item_id] = ...',
          internalEffect: 'Overwrites the resource at key `item_id` deterministically.',
        },
        {
          step: 2,
          codeLine: 8,
          instruction: 'Calling handle_put(10, "Keyboard") twice',
          internalEffect: 'Leaves exactly 1 record in `store`, demonstrating idempotency.',
        },
      ],
      apply: {
        domain: 'Payments & Orders',
        contextTitle: 'Safe Retry Policy',
        scenario: 'Allow automatic client retries only for idempotent HTTP verbs.',
        code: `IDEMPOTENT_VERBS = {"GET", "HEAD", "PUT", "DELETE"}
for verb in ("GET", "POST", "PUT"):
    print(verb, "retry_safe =", verb in IDEMPOTENT_VERBS)`,
        outcome: 'GET retry_safe = True\nPOST retry_safe = False\nPUT retry_safe = True',
      },
      commonMistakes: [
        {
          label: 'Using GET for State-Changing Operations',
          erroneousCode: `# GET /api/v1/users/42/delete`,
          errorMessage: 'Web crawlers, link prefetchers, or browser reloads accidentally delete data',
          explanation: 'Always use `DELETE /api/v1/users/42` or `POST` for mutations so caches and prefetchers never trigger destructive side effects.',
          correctedCode: `# DELETE /api/v1/users/42`,
        },
      ],
      sourceNotes: 'Covers HTTP verbs, safety, and idempotency for Day 28.',
      practise: [
        {
          id: 'day28-ex5',
          title: 'Safe Retry After Network Timeout',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'A mobile client sends `POST /api/v1/payments` and the TCP connection drops before the response arrives. Why is blindly retrying the exact same `POST` dangerous without an idempotency key?',
          options: [
            { id: 'a', text: 'POST is not idempotent, so the server may process the payment twice and double-charge the customer.', explanation: 'Correct! POST creates a new resource/transaction on each execution unless guarded by an idempotency key.', isCorrect: true },
            { id: 'b', text: 'POST requests cannot carry JSON bodies on a retry.', explanation: 'Incorrect. POST bodies can be resent, which is why duplicate processing occurs.', isCorrect: false },
            { id: 'c', text: 'HTTP forbids sending more than one POST per minute.', explanation: 'Incorrect. HTTP has no built-in per-minute POST ban.', isCorrect: false },
            { id: 'd', text: 'POST always returns 204 No Content on retry.', explanation: 'Incorrect. Status code depends on server handling.', isCorrect: false },
          ],
          hints: ['Recall which HTTP verbs are idempotent.', 'GET, PUT, and DELETE are idempotent; POST is not.', 'Duplicate POSTs can create duplicate charges.'],
          points: 10,
        },
        {
          id: 'day28-ex6',
          title: 'PUT vs PATCH Semantics',
          type: 'fill-the-gaps',
          tier: 'foundation',
          prompt: 'Complete the sentence distinguishing full replacement from partial update in REST.',
          gaps: [
            { id: 'g1', beforeText: 'Use ', afterText: ' to replace an entire resource representation,', correctAnswer: 'PUT', options: ['PUT', 'GET', 'HEAD'] },
            { id: 'g2', beforeText: ' and use ', afterText: ' to modify only a subset of fields.', correctAnswer: 'PATCH', options: ['PATCH', 'DELETE', 'OPTIONS'] },
          ],
          hints: ['Full replacement = PUT.', 'Partial update = PATCH.', 'Both target a specific resource URL like /users/42.'],
          points: 10,
        },
        {
          id: 'day28-ex7',
          title: 'Fix Idempotent PUT Handler',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'This simulated API handler accidentally appends a duplicate item on every `PUT` instead of replacing by `item_id`. Fix `put_item(store, item_id, name)` so repeated calls remain idempotent.',
          starterCode: `def put_item(store, item_id, name):
    store.append({"id": item_id, "name": name})
    return len(store)
`,
          solutionCode: `def put_item(store, item_id, name):
    for item in store:
        if item["id"] == item_id:
            item["name"] = name
            return len(store)
    store.append({"id": item_id, "name": name})
    return len(store)
`,
          testCases: [
            { id: 'tc1', label: 'Repeated PUT stays size 1', setup: 's = []\nput_item(s, 7, "Mouse")\nput_item(s, 7, "Trackball")\nprint(len(s), s[0]["name"])', expected: '1 Trackball', hidden: false },
            { id: 'tc2', label: 'Distinct IDs add new entries', setup: 's = []\nput_item(s, 1, "A")\nput_item(s, 2, "B")\nprint(len(s))', expected: '2', hidden: true },
          ],
          hints: ['Search store for an existing dict with item["id"] == item_id.', 'If found, update item["name"] in place and return len(store).', 'Only append when item_id does not exist yet.'],
          points: 15,
        },
        {
          id: 'day28-ex8',
          title: 'Trace Safe vs Idempotent Verb Classification',
          type: 'explain-the-trace',
          tier: 'standard',
          prompt: 'Explain why `DELETE /api/v1/carts/99` is idempotent even though the first call may return `204 No Content` and the second call returns `404 Not Found`.',
          traceStepCode: `DELETE /carts/99 -> 204 No Content (cart removed)\nDELETE /carts/99 -> 404 Not Found (cart still absent)`,
          traceQuestion: 'Why does idempotency still hold despite different status codes?',
          modelAnswer: 'Idempotency is defined by the resulting server state, not the HTTP response status code. After both the first and second DELETE calls, cart 99 does not exist on the server—the final state is identical.',
          markingCriteria: [
            { id: 'mc1', label: 'Distinguishes server state from response status code', points: 5 },
            { id: 'mc2', label: 'Confirms resource remains absent after repeated DELETE', points: 5 },
          ],
          hints: ['Idempotency is about server state, not status code.', 'After call 1, cart 99 is gone.', 'After call 2, cart 99 is still gone.'],
          points: 10,
        },
      ],
      assess: [],
    },
    {
      id: 'day28-sub3',
      number: 3,
      title: 'URL Anatomy, Path Parameters & Query Strings',
      summary: 'Parse and build URLs safely with path segments and URL-encoded query parameters.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Path Parameters vs. Query Strings',
        paragraphs: [
          'A URL consists of `scheme://host:port/path?query#fragment`. In REST APIs, **path parameters** (`/users/42/orders`) identify a specific resource, whereas **query strings** (`?status=paid&limit=20`) filter, sort, or paginate a collection.',
          'Never concatenate user input directly into query strings with f-strings! Special characters like spaces, `&`, or `=` corrupt the query. Always pass a dictionary to `requests.get(url, params={...})` or encode with `urllib.parse.urlencode()`.',
        ],
        keyTerms: [
          {
            term: 'Path Parameter',
            definition: 'A variable segment inside the URL path (e.g., `/books/103`) that identifies a single resource.',
          },
          {
            term: 'Query String',
            definition: 'Key-value pairs after `?` separated by `&` used for filtering, sorting, and pagination.',
          },
        ],
        bulletPoints: [
          '`urllib.parse.urlparse()` splits any URL into scheme, netloc, path, and query.',
          '`urllib.parse.urlencode({"q": "python & api"})` safely percent-encodes `q=python+%26+api`.',
        ],
      },
      visualise: {
        type: 'api-http-lifecycle-sim',
        title: 'HTTP Request & REST Endpoint Lifecycle',
        badge: 'simulation',
        description: 'Toggle query string parameters on GET requests to see how URLs are assembled.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Safe URL Construction & Parsing with urllib.parse',
          runMode: 'real',
          code: `from urllib.parse import urlencode, urlparse, parse_qs

params = {"topic": "python & web", "page": 2}
url = f"https://api.example.com/books?{urlencode(params)}"
parsed = urlparse(url)
print("Path:", parsed.path)
print("Parsed query:", parse_qs(parsed.query))`,
          expectedOutput: "Path: /books\nParsed query: {'topic': ['python & web'], 'page': ['2']}",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'urlencode(params)',
          internalEffect: 'Percent-encodes `&` and spaces so `topic` stays a single parameter.',
        },
        {
          step: 2,
          codeLine: 7,
          instruction: 'parse_qs(parsed.query)',
          internalEffect: 'Decodes the query string back into a dictionary of parameter lists.',
        },
      ],
      apply: {
        domain: 'Search APIs',
        contextTitle: 'Building Paginated Search URLs',
        scenario: 'Encode a multi-word search query without breaking URL delimiters.',
        code: `from urllib.parse import urlencode
print(urlencode({"q": "REST API 101", "limit": 10}))`,
        outcome: 'q=REST+API+101&limit=10',
      },
      commonMistakes: [
        {
          label: 'Interpolating Unescaped Query Values with f-strings',
          erroneousCode: `q = "C++ & Python"\nurl = f"https://api.example.com/search?q={q}"`,
          errorMessage: 'The unescaped & splits the query into q="C++ " and an empty parameter " Python"',
          explanation: 'Always use `urllib.parse.urlencode(params)` or `requests.get(url, params=params)` so reserved characters are percent-encoded.',
          correctedCode: `from urllib.parse import urlencode\nurl = f"https://api.example.com/search?{urlencode({'q': 'C++ & Python'})}"`,
        },
      ],
      sourceNotes: 'Covers URL anatomy, path parameters, and query encoding for Day 28.',
      practise: [
        {
          id: 'day28-ex9',
          title: 'Order URL Construction Steps',
          type: 'order-the-lines',
          tier: 'foundation',
          prompt: 'Arrange the lines to safely build and parse a query-encoded search URL.',
          jumbledLines: [
            { id: 'l1', code: 'from urllib.parse import urlencode, urlparse', indent: 0 },
            { id: 'l2', code: 'qs = urlencode({"q": "api & rest", "page": 2})', indent: 0 },
            { id: 'l3', code: 'url = f"https://api.example.com/items?{qs}"', indent: 0 },
            { id: 'l4', code: 'print(urlparse(url).query)', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: ['Import urlencode and urlparse first.', 'Encode params into qs before building url.', 'Parse url.query last.'],
          points: 10,
        },
        {
          id: 'day28-ex10',
          title: 'Predict Query String Encoding Output',
          type: 'predict-output',
          tier: 'standard',
          prompt: 'What does `urlencode` output for a parameter value containing `&` and spaces?',
          contextScenario: 'from urllib.parse import urlencode\nprint(urlencode({"tag": "c++ & python", "limit": 5}))',
          options: [
            { id: 'a', text: 'tag=c++ & python&limit=5', explanation: 'Incorrect. Unescaped & and + would corrupt the query string.', isCorrect: false },
            { id: 'b', text: 'tag=c%2B%2B+%26+python&limit=5', explanation: 'Correct! + becomes %2B, & becomes %26, and spaces become +.', isCorrect: true },
            { id: 'c', text: 'tag=c%2B%2B%20%26%20python?limit=5', explanation: 'Incorrect. Parameters are joined by &, not ?, and urlencode uses + for spaces.', isCorrect: false },
            { id: 'd', text: 'ValueError: invalid character &', explanation: 'Incorrect. urlencode safely escapes & instead of raising.', isCorrect: false },
          ],
          hints: ['urlencode percent-encodes reserved characters.', '+ -> %2B and & -> %26.', 'Spaces become + in application/x-www-form-urlencoded.'],
          points: 10,
        },
        {
          id: 'day28-ex11',
          title: 'Fix Broken F-String Query Builder',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'This `build_search_url` function uses raw f-string interpolation, breaking queries that contain `&`. Fix it using `urllib.parse.urlencode`.',
          starterCode: `from urllib.parse import urlencode

def build_search_url(base, query, page):
    return f"{base}?q={query}&page={page}"
`,
          solutionCode: `from urllib.parse import urlencode

def build_search_url(base, query, page):
    qs = urlencode({"q": query, "page": page})
    return f"{base}?{qs}"
`,
          testCases: [
            { id: 'tc1', label: 'Escapes ampersand in query', setup: 'from urllib.parse import urlparse, parse_qs\nu = build_search_url("https://api.dev/search", "a & b", 3)\nprint(parse_qs(urlparse(u).query)["q"][0])', expected: 'a & b', hidden: false },
            { id: 'tc2', label: 'Includes page param', setup: 'from urllib.parse import urlparse, parse_qs\nu = build_search_url("https://api.dev/search", "test", 4)\nprint(parse_qs(urlparse(u).query)["page"][0])', expected: '4', hidden: true },
          ],
          hints: ['Pass {"q": query, "page": page} to urlencode().', 'Join base and qs with "?".', 'Verify with parse_qs().'],
          points: 15,
        },
        {
          id: 'day28-ex12',
          title: 'Path Parameter vs Query String Choice',
          type: 'scenario-mcq',
          tier: 'challenge',
          prompt: 'You are designing an endpoint to fetch a specific invoice (`INV-882`) and another endpoint to filter invoices by `status=overdue` and `currency=EUR`. Which URL pair is idiomatic REST?',
          options: [
            { id: 'a', text: 'GET /invoices/INV-882 and GET /invoices?status=overdue&currency=EUR', explanation: 'Correct! Resource identity belongs in the path; optional filters belong in the query string.', isCorrect: true },
            { id: 'b', text: 'GET /invoices?id=INV-882 and GET /invoices/overdue/EUR', explanation: 'Incorrect. Filters should not be rigid positional path segments.', isCorrect: false },
            { id: 'c', text: 'POST /invoices/INV-882 and POST /invoices/filter', explanation: 'Incorrect. Reading invoices should use GET, not POST.', isCorrect: false },
            { id: 'd', text: 'GET /invoices#INV-882 and GET /invoices#overdue', explanation: 'Incorrect. URL fragments (#) are never sent to the server in HTTP requests.', isCorrect: false },
          ],
          hints: ['Path parameters identify a specific resource.', 'Query strings filter or paginate a collection.', 'URL fragments (#) stay in the browser.'],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day28-sub4',
      number: 4,
      title: 'HTTP Status Codes & Error Semantics',
      summary: 'Interpret 2xx, 3xx, 4xx, and 5xx status codes and handle client vs. server failures.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Decoding Status Code Families',
        paragraphs: [
          'Every HTTP response begins with a 3-digit **status code** grouped into five families: `2xx` (Success: `200 OK`, `201 Created`, `204 No Content`), `3xx` (Redirection: `301`, `304`), `4xx` (Client Error: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `429 Too Many Requests`), and `5xx` (Server Error: `500`, `502`, `503`).',
          'In Python `requests`, receiving a `404` or `500` does **not** raise an exception automatically—`requests.get()` still returns a `Response` object. You must inspect `response.status_code` or call `response.raise_for_status()` to turn `4xx`/`5xx` into an `HTTPError`.',
        ],
        keyTerms: [
          {
            term: '401 vs 403',
            definition: '401 Unauthorized means missing/invalid credentials; 403 Forbidden means authenticated but lacking permission.',
          },
          {
            term: 'raise_for_status()',
            definition: 'Pythons requests method that raises HTTPError if status_code is between 400 and 599.',
          },
        ],
        bulletPoints: [
          '`201 Created` confirms a new resource was persisted (typically from `POST`).',
          '`204 No Content` succeeds with an intentionally empty body (common for `DELETE`).',
        ],
      },
      visualise: {
        type: 'api-requests-client-sim',
        title: 'Python requests Client & Status Inspector',
        badge: 'simulation',
        description: 'Inspect how 200 OK, 404 Not Found, Timeouts, and 502 HTML errors behave in Python.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Classifying HTTP Status Codes in a Client Helper',
          runMode: 'real',
          code: `def classify_status(code):
    if 200 <= code < 300:
        return "success"
    if 400 <= code < 500:
        return "client_error"
    if 500 <= code < 600:
        return "server_error"
    return "other"

for code in (201, 401, 429, 503):
    print(code, "->", classify_status(code))`,
          expectedOutput: '201 -> success\n401 -> client_error\n429 -> client_error\n503 -> server_error',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'if 200 <= code < 300:',
          internalEffect: 'Recognizes all 2xx codes (200, 201, 204) as successful outcomes.',
        },
        {
          step: 2,
          codeLine: 4,
          instruction: 'if 400 <= code < 500:',
          internalEffect: 'Identifies client-side errors (bad input, auth, rate limit) that usually should not be blindly retried.',
        },
      ],
      apply: {
        domain: 'API Integration',
        contextTitle: 'Explicit Error Guard',
        scenario: 'Prevent parsing an error page as JSON when a status code is 4xx/5xx.',
        code: `status = 404
if status >= 400:
    print(f"Abort JSON parse: HTTP {status}")`,
        outcome: 'Abort JSON parse: HTTP 404',
      },
      commonMistakes: [
        {
          label: 'Assuming requests.get() Raises on 404 or 500',
          erroneousCode: `# resp = requests.get(url)\n# data = resp.json()  # Crashes with JSONDecodeError if 502 HTML returned!`,
          errorMessage: 'JSONDecodeError instead of clear HTTP error handling',
          explanation: '`requests` only raises automatically on network/DNS failures. Call `resp.raise_for_status()` before `resp.json()`.',
          correctedCode: `# resp = requests.get(url, timeout=5)\n# resp.raise_for_status()\n# data = resp.json()`,
        },
      ],
      sourceNotes: 'Covers HTTP status code families and raise_for_status() for Day 28.',
      practise: [
        {
          id: 'day28-ex13',
          title: 'Distinguishing 401 Unauthorized vs 403 Forbidden',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'A user logs in with a valid Bearer token (`role="viewer"`), then calls `DELETE /api/v1/projects/5` which requires `role="admin"`. Which status code should the API return?',
          options: [
            { id: 'a', text: '401 Unauthorized', explanation: 'Incorrect. 401 means credentials are missing or invalid.', isCorrect: false },
            { id: 'b', text: '403 Forbidden', explanation: 'Correct! The caller is authenticated, but lacks permission for this action.', isCorrect: true },
            { id: 'c', text: '404 Not Found', explanation: 'Incorrect. The project exists; the issue is authorization.', isCorrect: false },
            { id: 'd', text: '429 Too Many Requests', explanation: 'Incorrect. 429 is for rate limiting.', isCorrect: false },
          ],
          hints: ['401 = Who are you? (authentication).', '403 = I know who you are, but you cannot do that (authorization).', 'The user has a valid token but insufficient role.'],
          points: 10,
        },
        {
          id: 'day28-ex14',
          title: 'Write a Status Code Classifier',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Write `is_retryable(status_code)` returning `True` only for transient rate-limit or gateway/server errors `(429, 502, 503, 504)`, and `False` otherwise.',
          starterCode: `def is_retryable(status_code):
    pass
`,
          solutionCode: `def is_retryable(status_code):
    return status_code in (429, 502, 503, 504)
`,
          testCases: [
            { id: 'tc1', label: 'Transient codes return True', setup: 'print(is_retryable(429), is_retryable(503))', expected: 'True True', hidden: false },
            { id: 'tc2', label: 'Client errors return False', setup: 'print(is_retryable(400), is_retryable(401), is_retryable(404))', expected: 'False False False', hidden: true },
          ],
          hints: ['Use membership check `in (429, 502, 503, 504)`.', '400/401/404 are non-retryable client errors.', 'Return a boolean.'],
          points: 15,
        },
        {
          id: 'day28-ex15',
          title: 'Why requests.get() Does Not Throw on 404',
          type: 'theory-reasoning',
          tier: 'standard',
          prompt: 'Explain why calling `resp = requests.get(url)` followed immediately by `resp.json()` without `resp.raise_for_status()` can crash with `JSONDecodeError` during a `502 Bad Gateway` outage.',
          modelAnswer: 'requests only raises exceptions automatically for network/transport failures, not HTTP 4xx/5xx status codes. During a 502 outage, a reverse proxy often returns an HTML error page instead of JSON, so calling resp.json() without raise_for_status() attempts to parse HTML as JSON and raises JSONDecodeError.',
          markingCriteria: [
            { id: 'mc1', label: 'States requests does not raise on 4xx/5xx by default', points: 5 },
            { id: 'mc2', label: 'Explains HTML error body causes JSONDecodeError', points: 5 },
          ],
          hints: ['Does requests.get() raise on 502?', 'What body does a proxy return on 502?', 'What does raise_for_status() do?'],
          points: 15,
        },
        {
          id: 'day28-ex16',
          title: 'Match Status Codes to Semantics',
          type: 'fill-the-gaps',
          tier: 'foundation',
          prompt: 'Fill in the standard HTTP status codes for resource creation and empty deletion.',
          gaps: [
            { id: 'g1', beforeText: 'Successful POST creation returns ', afterText: ' Created,', correctAnswer: '201', options: ['201', '204', '301'] },
            { id: 'g2', beforeText: ' and successful DELETE with an empty body returns ', afterText: ' No Content.', correctAnswer: '204', options: ['204', '200', '404'] },
          ],
          hints: ['POST creation -> 201.', 'DELETE empty body -> 204.', 'Both are in the 2xx family.'],
          points: 10,
        },
      ],
      assess: [],
    },
    {
      id: 'day28-sub5',
      number: 5,
      title: 'Consuming APIs in Python (requests & urllib.request)',
      summary: 'Make GET/POST calls, pass query dicts, and decode JSON responses cleanly.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'The Python API Client Workflow',
        paragraphs: [
          'Python ships with `urllib.request` in the standard library, while the third-party **`requests`** package provides a concise, human-friendly API (`requests.get()`, `requests.post()`, `requests.Session()`).',
          'A production `requests` call follows a four-step pattern: (1) pass `params=` or `json=` instead of manual string building, (2) always set `timeout=`, (3) call `resp.raise_for_status()`, and (4) decode with `resp.json()`. For multiple calls to the same host, reuse a `requests.Session()` to pool TCP/TLS connections.',
        ],
        keyTerms: [
          {
            term: 'requests.Session()',
            definition: 'Client object that reuses underlying TCP/TLS connections and shares default headers across requests.',
          },
          {
            term: 'response.json()',
            definition: 'Decodes a JSON response body into Python dicts/lists (raising JSONDecodeError if invalid).',
          },
        ],
        bulletPoints: [
          '`resp.text` returns decoded string content; `resp.content` returns raw `bytes` (for images/PDFs).',
          'Reusing `Session()` avoids repeated TLS handshakes when calling an API in a loop.',
        ],
      },
      visualise: {
        type: 'api-requests-client-sim',
        title: 'Python requests Client & Status Inspector',
        badge: 'simulation',
        description: 'Step through requests.get() calls and inspect status codes, headers, and JSON output.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Parsing a Simulated API JSON Response Safely',
          runMode: 'real',
          code: `import json

raw_bytes = b'{"repo": "30-Days-Of-Python", "stars": 42000}'
data = json.loads(raw_bytes.decode("utf-8"))
print(data["repo"], data["stars"])`,
          expectedOutput: '30-Days-Of-Python 42000',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'raw_bytes = b\'...\'',
          internalEffect: 'Models the raw UTF-8 byte stream received over an HTTP socket.',
        },
        {
          step: 2,
          codeLine: 4,
          instruction: 'json.loads(raw_bytes.decode("utf-8"))',
          internalEffect: 'Mirrors what `response.json()` performs internally after verifying encoding.',
        },
      ],
      apply: {
        domain: 'Data Ingestion',
        contextTitle: 'Extracting Nested Fields with .get()',
        scenario: 'Safely read optional fields from an API JSON payload without KeyError.',
        code: `user = {"login": "ada", "bio": None}
bio = user.get("bio") or "No bio provided"
print(user["login"], "-", bio)`,
        outcome: 'ada - No bio provided',
      },
      commonMistakes: [
        {
          label: 'Omitting timeout= in requests.get()',
          erroneousCode: `# resp = requests.get("https://api.example.com/data")`,
          errorMessage: 'Worker thread hangs forever if the remote server stops responding',
          explanation: 'By default `requests` has `timeout=None`. Always pass `timeout=5` or `timeout=(3, 10)` in production code.',
          correctedCode: `# resp = requests.get("https://api.example.com/data", timeout=(3, 10))`,
        },
      ],
      sourceNotes: 'Covers Python requests and urllib.request client patterns for Day 28.',
      practise: [
        {
          id: 'day28-ex17',
          title: 'Safe Extraction from Optional API Fields',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'What does this Python snippet print when an API returns `null` (Python `None`) for an optional field?',
          contextScenario: 'payload = {"id": 12, "nickname": None}\nname = payload.get("nickname") or "anonymous"\nprint(name)',
          options: [
            { id: 'a', text: 'None', explanation: 'Incorrect. None is falsy, so `or "anonymous"` evaluates to "anonymous".', isCorrect: false },
            { id: 'b', text: 'anonymous', explanation: 'Correct! payload.get("nickname") returns None, and `None or "anonymous"` evaluates to "anonymous".', isCorrect: true },
            { id: 'c', text: 'KeyError', explanation: 'Incorrect. .get() never raises KeyError and the key exists anyway.', isCorrect: false },
            { id: 'd', text: 'True', explanation: 'Incorrect. `or` returns the operand value, not a boolean.', isCorrect: false },
          ],
          hints: ['JSON null becomes Python None.', 'None is falsy in Python.', '`None or "anonymous"` returns "anonymous".'],
          points: 10,
        },
        {
          id: 'day28-ex18',
          title: 'Why requests.Session() Beats Repeated requests.get()',
          type: 'scenario-mcq',
          tier: 'standard',
          prompt: 'A script fetches 500 user profiles sequentially from `https://api.example.com/users/{id}`. Switching from `requests.get()` to `with requests.Session() as s: s.get(...)` cuts runtime by 60%. Why?',
          options: [
            { id: 'a', text: 'Session() reuses underlying TCP/TLS connections via HTTP Keep-Alive instead of handshaking 500 times.', explanation: 'Correct! Connection pooling eliminates repeated TCP + TLS handshakes.', isCorrect: true },
            { id: 'b', text: 'Session() automatically parallelizes all 500 calls across 500 CPU threads.', explanation: 'Incorrect. requests.Session() is still synchronous.', isCorrect: false },
            { id: 'c', text: 'Session() skips SSL certificate verification.', explanation: 'Incorrect. Session() still verifies TLS certificates by default.', isCorrect: false },
            { id: 'd', text: 'Session() caches all 500 responses on disk.', explanation: 'Incorrect. requests.Session() does not cache responses on disk.', isCorrect: false },
          ],
          hints: ['Think about TCP + TLS handshakes per request.', 'HTTP Keep-Alive reuses sockets.', 'Session() pools connections to the same host.'],
          points: 10,
        },
        {
          id: 'day28-ex19',
          title: 'Parse Paginated API Records',
          type: 'write-code',
          tier: 'challenge',
          prompt: 'Write `collect_active_emails(pages)` where `pages` is a list of API page dicts `{"results": [{"email": ..., "active": bool}, ...]}`. Return a sorted list of emails where `active` is `True`.',
          starterCode: `def collect_active_emails(pages):
    pass
`,
          solutionCode: `def collect_active_emails(pages):
    emails = [
        item["email"]
        for page in pages
        for item in page.get("results", [])
        if item.get("active")
    ]
    return sorted(emails)
`,
          testCases: [
            { id: 'tc1', label: 'Filters active and sorts', setup: 'p = [{"results": [{"email": "z@a.com", "active": True}, {"email": "x@a.com", "active": False}]}, {"results": [{"email": "a@a.com", "active": True}]}]\nprint(collect_active_emails(p))', expected: "['a@a.com', 'z@a.com']", hidden: false },
            { id: 'tc2', label: 'Handles missing results key', setup: 'print(collect_active_emails([{}]))', expected: '[]', hidden: true },
          ],
          hints: ['Iterate over each page in pages, then page.get("results", []).', 'Check item.get("active") is truthy.', 'Return sorted(emails).'],
          points: 20,
        },
        {
          id: 'day28-ex20',
          title: 'Trace Timeout Tuple (connect, read)',
          type: 'explain-the-trace',
          tier: 'challenge',
          prompt: 'Explain the difference between the two numbers in `requests.get(url, timeout=(2.0, 8.0))`.',
          traceStepCode: `timeout=(2.0, 8.0)  # (connect_timeout, read_timeout)`,
          traceQuestion: 'When does ConnectTimeout vs ReadTimeout trigger?',
          modelAnswer: '2.0s is the connect timeout—the maximum time allowed to establish the TCP/TLS connection. 8.0s is the read timeout—the maximum time the client waits for bytes from the server after connecting.',
          markingCriteria: [
            { id: 'mc1', label: 'Identifies first value as TCP/TLS connect timeout', points: 5 },
            { id: 'mc2', label: 'Identifies second value as server response read timeout', points: 5 },
          ],
          hints: ['First number = establishing connection.', 'Second number = waiting for response bytes.', 'Both prevent hanging workers.'],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day28-sub6',
      number: 6,
      title: 'Headers, Content Negotiation & JSON Payloads',
      summary: 'Send Accept, Content-Type, and User-Agent headers and distinguish json= from data=.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'HTTP Headers & json= vs. data= in requests',
        paragraphs: [
          'HTTP **headers** carry metadata alongside the request or response. Clients send `Accept: application/json` to ask for JSON, `Content-Type: application/json` to declare the format of an outgoing request body, and `User-Agent` to identify the client application.',
          'In `requests.post(url, json=payload)`, passing `json=payload` automatically serializes the Python dict to JSON **and** sets `Content-Type: application/json`. Passing `data=payload` instead sends URL-encoded form data (`application/x-www-form-urlencoded`), which many JSON APIs reject with `400` or `415 Unsupported Media Type`.',
        ],
        keyTerms: [
          {
            term: 'Content-Type',
            definition: 'Header declaring the media type of the message body (e.g., application/json).',
          },
          {
            term: 'Accept',
            definition: 'Header telling the server which response media types the client can parse.',
          },
        ],
        bulletPoints: [
          'HTTP header names are case-insensitive (`content-type` == `Content-Type`).',
          'Use `json=dict_obj` for JSON APIs; reserve `data=` for HTML form submissions.',
        ],
      },
      visualise: {
        type: 'api-http-lifecycle-sim',
        title: 'HTTP Request & REST Endpoint Lifecycle',
        badge: 'simulation',
        description: 'Inspect Accept and Content-Type headers on POST and PUT JSON requests.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Comparing json= vs data= Serialization',
          runMode: 'real',
          code: `import json
from urllib.parse import urlencode

payload = {"title": "API Guide", "published": True}
json_body = json.dumps(payload)
form_body = urlencode(payload)
print("JSON:", json_body)
print("Form:", form_body)`,
          expectedOutput: 'JSON: {"title": "API Guide", "published": true}\nForm: title=API+Guide&published=True',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 5,
          instruction: 'json.dumps(payload)',
          internalEffect: 'Produces `application/json` format with lowercase `true` booleans.',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 'urlencode(payload)',
          internalEffect: 'Produces `application/x-www-form-urlencoded` key=value pairs—not valid JSON.',
        },
      ],
      apply: {
        domain: 'Webhooks',
        contextTitle: 'Building Standard JSON Request Headers',
        scenario: 'Assemble case-insensitive headers for an outbound webhook POST.',
        code: `headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "User-Agent": "PythonLabClient/1.0",
}
print(headers["Content-Type"])`,
        outcome: 'application/json',
      },
      commonMistakes: [
        {
          label: 'Passing data=dict Instead of json=dict to a JSON Endpoint',
          erroneousCode: `# requests.post(url, data={"name": "Ada"})  # Sends form-encoded body!`,
          errorMessage: '415 Unsupported Media Type or 400 Bad Request from JSON API',
          explanation: 'Use `json={"name": "Ada"}` so `requests` serializes JSON and sets `Content-Type: application/json`.',
          correctedCode: `# requests.post(url, json={"name": "Ada"}, timeout=5)`,
        },
      ],
      sourceNotes: 'Covers HTTP headers, content negotiation, and json= vs data= for Day 28.',
      practise: [
        {
          id: 'day28-ex21',
          title: '415 Unsupported Media Type from data= vs json=',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'You call `requests.post(url, data={"price": 19.99})` against a JSON REST API and receive `415 Unsupported Media Type`. What caused this?',
          options: [
            { id: 'a', text: 'Passing data= sends application/x-www-form-urlencoded instead of application/json.', explanation: 'Correct! Use json={"price": 19.99} so requests serializes JSON and sets Content-Type: application/json.', isCorrect: true },
            { id: 'b', text: 'Floats like 19.99 are illegal in HTTP POST requests.', explanation: 'Incorrect. JSON numbers support floats.', isCorrect: false },
            { id: 'c', text: 'requests.post() requires PUT for numeric fields.', explanation: 'Incorrect. POST accepts any JSON types.', isCorrect: false },
            { id: 'd', text: '415 means the server is out of disk space.', explanation: 'Incorrect. 415 specifically means the request Content-Type is unsupported.', isCorrect: false },
          ],
          hints: ['Check what Content-Type `data=` sets vs `json=`.', 'JSON APIs expect `Content-Type: application/json`.', '415 = Unsupported Media Type.'],
          points: 10,
        },
        {
          id: 'day28-ex22',
          title: 'Case-Insensitive Header Lookup',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Write `get_header(headers, name)` that performs a case-insensitive lookup in a Python dict `headers` and returns the value or `None` if absent.',
          starterCode: `def get_header(headers, name):
    pass
`,
          solutionCode: `def get_header(headers, name):
    target = name.lower()
    for k, v in headers.items():
        if k.lower() == target:
            return v
    return None
`,
          testCases: [
            { id: 'tc1', label: 'Matches mixed-case header', setup: 'h = {"Content-Type": "application/json"}\nprint(get_header(h, "content-type"))', expected: 'application/json', hidden: false },
            { id: 'tc2', label: 'Returns None when missing', setup: 'print(get_header({"Accept": "*/*"}, "X-Missing"))', expected: 'None', hidden: true },
          ],
          hints: ['Compare `k.lower() == name.lower()`.', 'Return `v` on match.', 'Return `None` after the loop if not found.'],
          points: 15,
        },
        {
          id: 'day28-ex23',
          title: 'Predict JSON vs Form Body Output',
          type: 'predict-output',
          tier: 'standard',
          prompt: 'What does `json.dumps({"ok": True, "n": None})` produce?',
          contextScenario: 'import json\nprint(json.dumps({"ok": True, "n": None}))',
          options: [
            { id: 'a', text: '{"ok": true, "n": null}', explanation: 'Correct! Python True/None serialize to JSON lowercase true/null.', isCorrect: true },
            { id: 'b', text: '{"ok": True, "n": None}', explanation: 'Incorrect. That is Python dict repr, not valid JSON.', isCorrect: false },
            { id: 'c', text: 'ok=True&n=None', explanation: 'Incorrect. That is urlencode output.', isCorrect: false },
            { id: 'd', text: 'TypeError: None is not serializable', explanation: 'Incorrect. None maps directly to JSON null.', isCorrect: false },
          ],
          hints: ['JSON uses lowercase `true` and `false`.', 'Python `None` maps to JSON `null`.', 'Keys use double quotes.'],
          points: 10,
        },
        {
          id: 'day28-ex24',
          title: 'Accept vs Content-Type Role',
          type: 'fill-the-gaps',
          tier: 'foundation',
          prompt: 'Complete the content-negotiation header roles.',
          gaps: [
            { id: 'g1', beforeText: 'The ', afterText: ' header tells the server what format the client wants back,', correctAnswer: 'Accept', options: ['Accept', 'Host', 'Referer'] },
            { id: 'g2', beforeText: ' while ', afterText: ' declares the format of the body being sent.', correctAnswer: 'Content-Type', options: ['Content-Type', 'User-Agent', 'ETag'] },
          ],
          hints: ['Client preference for response = Accept.', 'Format of sent body = Content-Type.', 'Both commonly use application/json.'],
          points: 10,
        },
      ],
      assess: [],
    },
    {
      id: 'day28-sub7',
      number: 7,
      title: 'API Authentication (API Keys, Bearer Tokens & OAuth Concepts)',
      summary: 'Pass credentials in Authorization headers and manage secrets safely via environment variables.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Securing API Credentials in Headers & Environment Variables',
        paragraphs: [
          'Protected APIs verify identity via **API keys** (`X-API-Key: <key>`) or **Bearer tokens** (`Authorization: Bearer <jwt_or_oauth_token>`). API keys typically identify an application or project, whereas OAuth 2.0 / JWT Bearer tokens represent scoped, time-limited user or service permissions.',
          'Never hardcode API keys or tokens in `.py` files or pass them in URL query strings (where they leak into server access logs and browser history). Load secrets from `os.environ` and send them over HTTPS inside request headers.',
        ],
        keyTerms: [
          {
            term: 'Bearer Token',
            definition: 'An opaque or JWT credential sent in the Authorization: Bearer <token> header.',
          },
          {
            term: '401 vs 403',
            definition: '401 indicates missing/expired auth; 403 indicates valid auth without sufficient scope.',
          },
        ],
        bulletPoints: [
          'Always mask tokens in logs (e.g., show only the last 4 characters).',
          'Use `os.environ.get("API_TOKEN")` and fail fast if the variable is missing.',
        ],
      },
      visualise: {
        type: 'api-auth-cors-sim',
        title: 'API Auth, Rate Limits & CORS Preflight Inspector',
        badge: 'simulation',
        description: 'Compare unauthenticated 401 responses with API Key and Bearer JWT headers.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Loading an API Token from Environment & Masking for Logs',
          runMode: 'real',
          code: `import os

os.environ["DEMO_API_TOKEN"] = "sk_live_9876543210abcd"
token = os.environ.get("DEMO_API_TOKEN", "")
headers = {"Authorization": f"Bearer {token}"}
masked = f"Bearer ****{token[-4:]}" if len(token) >= 4 else "missing"
print("Header key:", list(headers.keys())[0], "| Log:", masked)`,
          expectedOutput: 'Header key: Authorization | Log: Bearer ****abcd',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'os.environ.get("DEMO_API_TOKEN", "")',
          internalEffect: 'Reads the secret from process environment rather than hardcoding it.',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 'masked = f"Bearer ****{token[-4:]}"',
          internalEffect: 'Redacts sensitive token characters before writing diagnostic logs.',
        },
      ],
      apply: {
        domain: 'Security',
        contextTitle: 'Guard Against Missing Credentials',
        scenario: 'Validate that required API credentials exist before making network calls.',
        code: `def build_auth_header(token):
    if not token:
        raise ValueError("Missing API token")
    return {"Authorization": f"Bearer {token}"}

print(build_auth_header("tok_123")["Authorization"])`,
        outcome: 'Bearer tok_123',
      },
      commonMistakes: [
        {
          label: 'Passing API Keys in URL Query Parameters',
          erroneousCode: `# requests.get(f"https://api.example.com/data?api_key={SECRET}")`,
          errorMessage: 'Secret key leaks into proxy logs, browser history, and Referer headers',
          explanation: 'Send credentials in `headers={"Authorization": f"Bearer {SECRET}"}` over HTTPS so they stay encrypted and out of URLs.',
          correctedCode: `# requests.get("https://api.example.com/data", headers={"Authorization": f"Bearer {SECRET}"}, timeout=5)`,
        },
      ],
      sourceNotes: 'Covers API keys, Bearer tokens, and secret hygiene for Day 28.',
      practise: [
        {
          id: 'day28-ex25',
          title: 'Securing API Credentials Out of URLs',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Why should an API Bearer token be sent in the `Authorization` header rather than `?token=...` in the URL?',
          options: [
            { id: 'a', text: 'URLs are logged in plain text by proxies, load balancers, and browser history, whereas headers over HTTPS are encrypted.', explanation: 'Correct! Keeping secrets in headers prevents accidental credential leaks in access logs.', isCorrect: true },
            { id: 'b', text: 'URLs cannot contain strings longer than 16 characters.', explanation: 'Incorrect. URLs support thousands of characters.', isCorrect: false },
            { id: 'c', text: 'Python requests strips query parameters on HTTPS.', explanation: 'Incorrect. requests sends query parameters on HTTPS.', isCorrect: false },
            { id: 'd', text: 'Headers bypass TLS encryption for faster parsing.', explanation: 'Incorrect. Both headers and query strings are encrypted by TLS, but proxies/servers log full URLs.', isCorrect: false },
          ],
          hints: ['Think about server access logs and Referer headers.', 'Headers are not saved in browser history.', 'Always prefer Authorization: Bearer <token>.'],
          points: 10,
        },
        {
          id: 'day28-ex26',
          title: 'Mask Sensitive Tokens for Logging',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Write `mask_token(token)` that returns `"****" + token[-4:]` if `len(token) >= 4`, otherwise `"****"`.',
          starterCode: `def mask_token(token):
    pass
`,
          solutionCode: `def mask_token(token):
    if len(token) >= 4:
        return "****" + token[-4:]
    return "****"
`,
          testCases: [
            { id: 'tc1', label: 'Masks long token', setup: 'print(mask_token("sk_live_987654"))', expected: '****7654', hidden: false },
            { id: 'tc2', label: 'Masks short token safely', setup: 'print(mask_token("ab"))', expected: '****', hidden: true },
          ],
          hints: ['Check len(token) >= 4.', 'Slice the last 4 characters with token[-4:].', 'Prefix with "****".'],
          points: 15,
        },
        {
          id: 'day28-ex27',
          title: 'Order Safe Credential Loading',
          type: 'order-the-lines',
          tier: 'challenge',
          prompt: 'Order the lines to safely load an API token from `os.environ`, fail fast if missing, and build the `Authorization` header.',
          jumbledLines: [
            { id: 'l1', code: 'import os', indent: 0 },
            { id: 'l2', code: 'token = os.environ.get("API_TOKEN")', indent: 0 },
            { id: 'l3', code: 'if not token: raise RuntimeError("Missing API_TOKEN")', indent: 0 },
            { id: 'l4', code: 'headers = {"Authorization": f"Bearer {token}"}', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: ['Import os first.', 'Read token from os.environ.get().', 'Validate before building headers.'],
          points: 15,
        },
      ],
      assess: [],
    },
    {
      id: 'day28-sub8',
      number: 8,
      title: 'Timeouts, Retries, Rate Limiting & CORS',
      summary: 'Handle 429 rate limits with exponential backoff and understand browser CORS preflight.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Resilient API Clients & Cross-Origin Resource Sharing',
        paragraphs: [
          'Public APIs enforce **rate limits** (e.g., 60 requests/minute) and return **`429 Too Many Requests`** with a `Retry-After` header or `X-RateLimit-Remaining: 0`. Resilient clients inspect `Retry-After` and apply **exponential backoff** (`delay = base * 2 ** attempt`) rather than hammering the server in a tight loop.',
          'When a browser frontend calls an API on a different origin (scheme + host + port), the browser enforces **CORS** (Cross-Origin Resource Sharing) by sending an `OPTIONS` preflight request and checking `Access-Control-Allow-Origin`. Note that CORS is a **browser** security policy—server-side Python `requests` scripts are not blocked by CORS.',
        ],
        keyTerms: [
          {
            term: 'Exponential Backoff',
            definition: 'Doubling wait time between retries (e.g., 1s, 2s, 4s) to let overloaded servers recover.',
          },
          {
            term: 'CORS Preflight',
            definition: 'Browser-initiated OPTIONS request verifying Access-Control-Allow-Origin before sending cross-origin requests.',
          },
        ],
        bulletPoints: [
          'Honor `Retry-After` header seconds whenever present on `429` or `503` responses.',
          'Only retry transient errors (`429`, `502`, `503`, `504`, or network timeouts), never `400` or `401`.',
        ],
      },
      visualise: {
        type: 'api-auth-cors-sim',
        title: 'API Auth, Rate Limits & CORS Preflight Inspector',
        badge: 'simulation',
        description: 'Inspect CORS OPTIONS preflight headers and 429 Too Many Requests rate-limit responses.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Computing Exponential Backoff Delays',
          runMode: 'real',
          code: `def backoff_schedule(attempts, base=1.0, cap=16.0):
    return [min(cap, base * (2 ** i)) for i in range(attempts)]

print("Delays (s):", backoff_schedule(5))`,
          expectedOutput: 'Delays (s): [1.0, 2.0, 4.0, 8.0, 16.0]',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'min(cap, base * (2 ** i))',
          internalEffect: 'Doubles the wait interval each retry while capping maximum sleep at `cap` seconds.',
        },
      ],
      apply: {
        domain: 'Distributed Systems',
        contextTitle: 'Respecting Retry-After Headers',
        scenario: 'Choose the larger of Retry-After or computed backoff delay.',
        code: `retry_after = 6
computed = 4
wait_seconds = max(retry_after, computed)
print("Sleeping:", wait_seconds, "seconds")`,
        outcome: 'Sleeping: 6 seconds',
      },
      commonMistakes: [
        {
          label: 'Retrying 400/401 Client Errors in a Loop',
          erroneousCode: `# for _ in range(5): resp = requests.get(url)  # Retries 401 Unauthorized 5 times!`,
          errorMessage: 'Wastes rate-limit quota and may trigger IP bans',
          explanation: 'Only retry transient `429` and `5xx` errors with exponential backoff; fail immediately on `400`, `401`, `403`, and `404`.',
          correctedCode: `# if resp.status_code in (429, 502, 503, 504): backoff_and_retry()`,
        },
      ],
      sourceNotes: 'Covers timeouts, 429 rate limiting, exponential backoff, and CORS for Day 28.',
      practise: [
        {
          id: 'day28-ex28',
          title: 'Why Python Scripts Ignore Browser CORS',
          type: 'scenario-mcq',
          tier: 'standard',
          prompt: 'A React frontend receives a CORS error when calling `https://api.partner.com/data`, yet a Python `requests.get()` script on your laptop succeeds with `200 OK`. Why?',
          options: [
            { id: 'a', text: 'CORS is enforced by web browsers to protect user sessions; server-side Python clients are not subject to Same-Origin Policy.', explanation: 'Correct! Browsers enforce CORS preflight/origin checks; Python scripts do not.', isCorrect: true },
            { id: 'b', text: 'Python requests automatically spoofs Access-Control-Allow-Origin.', explanation: 'Incorrect. Access-Control-Allow-Origin is a server response header.', isCorrect: false },
            { id: 'c', text: 'HTTPS disables CORS for PythonUser-Agent.', explanation: 'Incorrect. CORS applies regardless of HTTPS in browsers.', isCorrect: false },
            { id: 'd', text: 'React strips Authorization headers on GET.', explanation: 'Incorrect. The browser blocks cross-origin reads without CORS headers.', isCorrect: false },
          ],
          hints: ['Who enforces Same-Origin Policy?', 'Browsers send OPTIONS preflight; Python scripts do not.', 'Server-to-server calls bypass browser CORS.'],
          points: 15,
        },
        {
          id: 'day28-ex29',
          title: 'Compute Retry Delay with Retry-After & Backoff',
          type: 'write-code',
          tier: 'project',
          prompt: 'Write `compute_wait(attempt, retry_after=None, base=1.0, cap=30.0)` that computes `min(cap, base * (2 ** attempt))` and returns `max(computed, float(retry_after))` if `retry_after` is not `None`.',
          starterCode: `def compute_wait(attempt, retry_after=None, base=1.0, cap=30.0):
    pass
`,
          solutionCode: `def compute_wait(attempt, retry_after=None, base=1.0, cap=30.0):
    computed = min(cap, base * (2 ** attempt))
    if retry_after is not None:
        return max(computed, float(retry_after))
    return computed
`,
          testCases: [
            { id: 'tc1', label: 'Honors larger Retry-After', setup: 'print(compute_wait(1, retry_after=5))', expected: '5.0', hidden: false },
            { id: 'tc2', label: 'Caps exponential backoff', setup: 'print(compute_wait(10, retry_after=None, base=1.0, cap=30.0))', expected: '30.0', hidden: true },
          ],
          hints: ['Compute min(cap, base * (2 ** attempt)).', 'If retry_after is not None, return max(computed, float(retry_after)).', 'Otherwise return computed.'],
          points: 20,
        },
        {
          id: 'day28-ex30',
          title: 'Fix Tight-Loop 429 Retry Bug',
          type: 'fix-the-bug',
          tier: 'project',
          prompt: 'This backoff helper uses linear addition (`base + attempt`) and forgets to cap at `cap`. Fix `backoff_delay(attempt, base=1.0, cap=16.0)` to use capped exponential backoff `min(cap, base * (2 ** attempt))`.',
          starterCode: `def backoff_delay(attempt, base=1.0, cap=16.0):
    return base + attempt
`,
          solutionCode: `def backoff_delay(attempt, base=1.0, cap=16.0):
    return min(cap, base * (2 ** attempt))
`,
          testCases: [
            { id: 'tc1', label: 'Exponential growth', setup: 'print([backoff_delay(i) for i in range(4)])', expected: '[1.0, 2.0, 4.0, 8.0]', hidden: false },
            { id: 'tc2', label: 'Respects cap', setup: 'print(backoff_delay(6))', expected: '16.0', hidden: true },
          ],
          hints: ['Multiply base by 2 ** attempt.', 'Wrap with min(cap, ...).', 'Verify attempt=6 returns 16.0.'],
          points: 20,
        },
      ],
      assess: [],
    },
  ],
  realWorldLabs: [
    {
      id: 'day28-lab1',
      title: 'Lab 1: Paginated Weather & Air-Quality API Normalizer',
      description: 'Parse simulated paginated JSON API responses, safely extract optional nested metrics, and output normalized city readings.',
      domain: 'Environmental Telemetry',
      starterCode: `import json

PAGES = [
    '{"results": [{"city": "Lagos", "aqi": 68, "meta": {"unit": "US"}}, {"city": "Nairobi", "aqi": 42}]}',
    '{"results": [{"city": "Accra", "aqi": 55, "meta": {"unit": "US"}}]}',
]

def normalize_readings(raw_pages):
    output = []
    for raw in raw_pages:
        data = json.loads(raw)
        for row in data.get("results", []):
            unit = row.get("meta", {}).get("unit", "US")
            output.append(f"{row['city']}: {row['aqi']} ({unit})")
    return output

print(" | ".join(normalize_readings(PAGES)))
`,
      targetOutput: 'Lagos: 68 (US) | Nairobi: 42 (US) | Accra: 55 (US)',
    },
    {
      id: 'day28-lab2',
      title: 'Lab 2: Webhook Payload & Rate-Limit Backoff Engine',
      description: 'Construct JSON webhook headers, classify HTTP status codes, and compute exponential backoff schedules with Retry-After.',
      domain: 'Platform Reliability',
      starterCode: `def classify(code):
    if 200 <= code < 300:
        return "ok"
    if code in (429, 502, 503, 504):
        return "retry"
    return "fail"

def next_delay(attempt, retry_after=None):
    exp = min(16.0, 1.0 * (2 ** attempt))
    return max(exp, float(retry_after)) if retry_after is not None else exp

print(classify(201), classify(429), classify(401), next_delay(2, retry_after=6))
`,
      targetOutput: 'ok retry fail 6.0',
    },
  ],
  miniProject: {
    id: 'day28-project',
    title: 'Resilient GitHub/REST API Client & Rate-Limit Inspector',
    brief: 'Build a reusable API client with query encoding, Bearer auth headers, status classification, and 429 exponential backoff.',
    requirements: [
      'Encode query parameters safely without raw string concatenation',
      'Attach Authorization: Bearer and Accept: application/json headers',
      'Classify 2xx, 4xx, and 5xx status codes explicitly',
      'Compute capped exponential backoff delays for 429 responses',
      'Redact sensitive tokens in diagnostic output',
    ],
    rubric: [
      { criterion: 'Safe URL & Header Construction', weight: 35 },
      { criterion: 'Explicit Status & Error Handling', weight: 35 },
      { criterion: 'Rate-Limit Backoff & Token Masking', weight: 30 },
    ],
    starterCode: `from urllib.parse import urlencode

def build_request(base_url, params, token):
    qs = urlencode(params)
    url = f"{base_url}?{qs}" if qs else base_url
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {token}",
    }
    return url, headers

def mask_auth(headers):
    auth = headers.get("Authorization", "")
    return f"Bearer ****{auth[-4:]}" if len(auth) >= 4 else "missing"

url, hdrs = build_request("https://api.github.com/search/repositories", {"q": "python & api", "per_page": 5}, "ghp_secret1234")
print(url)
print(mask_auth(hdrs))
`,
  },
  dayQuiz: {
    title: 'Day 28 Checkpoint Quiz: Application Programming Interfaces (APIs)',
    questions: [
      {
        id: 'day28-q1',
        scenario: 'Designing a REST endpoint for customer invoices.',
        question: 'Which endpoint follows REST resource-naming conventions?',
        options: [
          { id: 'a', text: 'GET /api/v1/getInvoices', explanation: 'Incorrect. Avoid verbs in REST paths.', isCorrect: false },
          { id: 'b', text: 'GET /api/v1/invoices', explanation: 'Correct! Plural nouns represent collections.', isCorrect: true },
          { id: 'c', text: 'POST /api/v1/readInvoices', explanation: 'Incorrect. POST is not for reading.', isCorrect: false },
          { id: 'd', text: 'GET /api/v1/invoice_sql_table', explanation: 'Incorrect. Do not expose internal DB tables.', isCorrect: false },
        ],
      },
      {
        id: 'day28-q2',
        scenario: 'Handling network retries in a client library.',
        question: 'Which HTTP verb is NOT idempotent?',
        options: [
          { id: 'a', text: 'GET', explanation: 'Incorrect. GET is safe and idempotent.', isCorrect: false },
          { id: 'b', text: 'PUT', explanation: 'Incorrect. PUT is idempotent.', isCorrect: false },
          { id: 'c', text: 'POST', explanation: 'Correct! Repeating POST can create duplicate resources.', isCorrect: true },
          { id: 'd', text: 'DELETE', explanation: 'Incorrect. DELETE is idempotent.', isCorrect: false },
        ],
      },
      {
        id: 'day28-q3',
        scenario: 'Constructing a search URL with user input.',
        question: 'Why should you use `params={...}` in `requests.get()` or `urllib.parse.urlencode()` instead of f-strings?',
        options: [
          { id: 'a', text: 'It automatically percent-encodes reserved characters like & and spaces.', explanation: 'Correct! Prevents query parameter corruption.', isCorrect: true },
          { id: 'b', text: 'It compresses the URL using gzip.', explanation: 'Incorrect. URLs are not gzipped.', isCorrect: false },
          { id: 'c', text: 'It converts GET into POST.', explanation: 'Incorrect. The verb remains GET.', isCorrect: false },
          { id: 'd', text: 'It bypasses DNS lookup.', explanation: 'Incorrect. DNS still resolves the host.', isCorrect: false },
        ],
      },
      {
        id: 'day28-q4',
        scenario: 'A user with a valid JWT tries to access an admin-only endpoint.',
        question: 'Which HTTP status code is most appropriate?',
        options: [
          { id: 'a', text: '401 Unauthorized', explanation: 'Incorrect. 401 is for missing/invalid authentication.', isCorrect: false },
          { id: 'b', text: '403 Forbidden', explanation: 'Correct! Authenticated, but lacks required permission.', isCorrect: true },
          { id: 'c', text: '201 Created', explanation: 'Incorrect. 201 indicates resource creation.', isCorrect: false },
          { id: 'd', text: '304 Not Modified', explanation: 'Incorrect. 304 is for HTTP caching.', isCorrect: false },
        ],
      },
      {
        id: 'day28-q5',
        scenario: 'Calling an external REST API in Python requests.',
        question: 'What happens if a server returns `500 Internal Server Error` and you do NOT call `resp.raise_for_status()`?',
        options: [
          { id: 'a', text: 'requests still returns a Response object without raising an exception.', explanation: 'Correct! You must check status_code or call raise_for_status().', isCorrect: true },
          { id: 'b', text: 'requests automatically retries 10 times.', explanation: 'Incorrect. No automatic retries happen by default.', isCorrect: false },
          { id: 'c', text: 'Python raises ConnectionError immediately.', explanation: 'Incorrect. ConnectionError is only for network failures.', isCorrect: false },
          { id: 'd', text: 'resp.json() returns an empty dict automatically.', explanation: 'Incorrect. If the body is HTML, resp.json() raises JSONDecodeError.', isCorrect: false },
        ],
      },
      {
        id: 'day28-q6',
        scenario: 'Sending a JSON payload via requests.post().',
        question: 'What is the difference between `json=payload` and `data=payload`?',
        options: [
          { id: 'a', text: 'json= serializes JSON and sets Content-Type: application/json; data= sends form-encoded data.', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: 'data= is encrypted while json= is plain text.', explanation: 'Incorrect. TLS encrypts both over HTTPS.', isCorrect: false },
          { id: 'c', text: 'json= only works with GET requests.', explanation: 'Incorrect. json= is used on POST/PUT/PATCH.', isCorrect: false },
          { id: 'd', text: 'There is no difference.', explanation: 'Incorrect. The Content-Type and body format differ.', isCorrect: false },
        ],
      },
      {
        id: 'day28-q7',
        scenario: 'Configuring authentication for a Python API client.',
        question: 'Where should a Bearer token be placed?',
        options: [
          { id: 'a', text: 'In the Authorization: Bearer <token> request header.', explanation: 'Correct! Keeps credentials out of URLs and access logs.', isCorrect: true },
          { id: 'b', text: 'Hardcoded in the URL query string.', explanation: 'Incorrect. Leaks secrets into logs and history.', isCorrect: false },
          { id: 'c', text: 'Committed to README.md.', explanation: 'Incorrect. Never commit secrets to version control.', isCorrect: false },
          { id: 'd', text: 'In the User-Agent header.', explanation: 'Incorrect. User-Agent identifies client software.', isCorrect: false },
        ],
      },
      {
        id: 'day28-q8',
        scenario: 'Preventing hung worker threads in production.',
        question: 'Why should every `requests` call specify `timeout=`?',
        options: [
          { id: 'a', text: 'Because requests defaults to timeout=None, which can hang forever on a stalled socket.', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: 'Because timeout= enables HTTP/3.', explanation: 'Incorrect. timeout controls socket wait limits.', isCorrect: false },
          { id: 'c', text: 'Because Python raises SyntaxError without timeout=.', explanation: 'Incorrect. It is optional syntactically, but critical operationally.', isCorrect: false },
          { id: 'd', text: 'Because timeout= caches DNS for 24 hours.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'day28-q9',
        scenario: 'Handling 429 Too Many Requests.',
        question: 'What is the recommended client retry strategy when receiving `429` with `Retry-After: 5`?',
        options: [
          { id: 'a', text: 'Retry immediately in a tight while-True loop.', explanation: 'Incorrect. Worsens rate-limit throttling.', isCorrect: false },
          { id: 'b', text: 'Sleep at least Retry-After seconds and apply exponential backoff.', explanation: 'Correct!', isCorrect: true },
          { id: 'c', text: 'Switch from GET to POST.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'd', text: 'Delete the Authorization header.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'day28-q10',
        scenario: 'Debugging a cross-origin browser fetch vs Python script.',
        question: 'Which statement about CORS is true?',
        options: [
          { id: 'a', text: 'CORS is enforced by web browsers (via OPTIONS preflight and Access-Control-Allow-Origin), not by Python requests.', explanation: 'Correct!', isCorrect: true },
          { id: 'b', text: 'CORS blocks all Python urllib calls unless a browser is open.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'c', text: 'CORS replaces HTTPS encryption.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'd', text: 'CORS only applies to 204 No Content.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
    ],
    passingScorePercentage: 80,
  },
  cheatSheet: [
    {
      category: 'REST Architecture, Resources & Statelessness',
      syntax: 'GET /api/v1/resources          # Collection\nGET /api/v1/resources/{id}     # Single resource',
      description:
        'REST APIs model domain entities as plural noun resources over stateless HTTP. Each request carries all required auth, parameters, and payload context so any backend server behind a load balancer can process it independently.',
      example: `BASE_URL = "https://api.example.com/api/v1"
collection_url = f"{BASE_URL}/shipments"
item_url = f"{BASE_URL}/shipments/42"
print(collection_url, item_url)`,
    },
    {
      category: 'HTTP Verbs, Safety & Idempotency',
      syntax: 'GET (safe, idempotent) | POST (unsafe, non-idempotent)\nPUT / DELETE (idempotent) | PATCH (partial update)',
      description:
        'Safe methods (GET, HEAD) never mutate state. Idempotent methods (GET, PUT, DELETE) yield the exact same server state even if retried after a network drop. POST is non-idempotent—use an Idempotency-Key header before retrying mutations.',
      example: `IDEMPOTENT = {"GET", "HEAD", "PUT", "DELETE"}
for method in ("GET", "POST", "PUT", "DELETE"):
    print(method, "safe_to_retry:", method in IDEMPOTENT)`,
    },
    {
      category: 'URL Anatomy, Path Params & Query Encoding',
      syntax: 'from urllib.parse import urlencode, urlparse, parse_qs\nrequests.get(url, params={"q": "python & api", "page": 2})',
      description:
        'Use path parameters (/users/42) to identify a resource and query strings (?q=...&page=2) for filtering, sorting, and pagination. Always pass a dict to params= or urllib.parse.urlencode() so reserved characters (&, =, spaces) are percent-encoded.',
      example: `from urllib.parse import urlencode, urlparse, parse_qs

qs = urlencode({"q": "python & api", "page": 2})
url = f"https://api.example.com/search?{qs}"
print(url)
print(parse_qs(urlparse(url).query))`,
    },
    {
      category: 'HTTP Status Code Families (2xx, 3xx, 4xx, 5xx)',
      syntax: '200 OK | 201 Created | 204 No Content\n400 Bad Request | 401 Unauth | 403 Forbidden | 404 Not Found | 429 Rate Limit\n500 / 502 / 503 Server Errors',
      description:
        '2xx confirms success, 3xx redirects/caches, 4xx signals client errors (401 = missing/bad credentials, 403 = authenticated but forbidden), and 5xx signals server failures. Only retry transient 429 and 502/503/504 errors.',
      example: `def is_transient(status_code):
    return status_code in (429, 502, 503, 504)

print(is_transient(401), is_transient(429), is_transient(503))`,
    },
    {
      category: 'Consuming APIs with requests & Session()',
      syntax: 'with requests.Session() as s:\n    resp = s.get(url, params=..., timeout=(3, 10))',
      description:
        'Use requests.Session() when making multiple calls to the same host so TCP/TLS sockets are pooled via HTTP Keep-Alive. Always specify timeout=(connect, read) because requests defaults to timeout=None (infinite wait).',
      example: `import requests

with requests.Session() as session:
    session.headers.update({"Accept": "application/json"})
    resp = session.get("https://api.example.com/books", params={"limit": 10}, timeout=(3, 10))`,
    },
    {
      category: 'Response Handling (raise_for_status, .json())',
      syntax: 'resp.raise_for_status()\ndata = resp.json()',
      description:
        'requests does NOT throw exceptions on 4xx/5xx responses by default. Call resp.raise_for_status() first so HTTP errors raise HTTPError instead of crashing with JSONDecodeError on HTML error pages.',
      example: `import requests

try:
    resp = requests.get("https://api.example.com/users/42", timeout=5)
    resp.raise_for_status()
    user = resp.json()
except requests.exceptions.HTTPError as err:
    print("HTTP failure:", err)`,
    },
    {
      category: 'Headers, Content Negotiation & json= vs data=',
      syntax: 'requests.post(url, json={"name": "Ada"}, headers={"Accept": "application/json"}, timeout=5)',
      description:
        'Accept tells the server what format the client expects back; Content-Type declares the outgoing body format. Passing json=dict serializes JSON and sets Content-Type: application/json automatically, whereas data=dict sends form-encoded pairs.',
      example: `import json
from urllib.parse import urlencode

payload = {"title": "API Guide", "active": True}
print("json=:", json.dumps(payload))
print("data=:", urlencode(payload))`,
    },
    {
      category: 'API Authentication (API Keys & Bearer Tokens)',
      syntax: 'headers = {"Authorization": f"Bearer {os.environ[\'API_TOKEN\']}"}',
      description:
        'Send API keys (X-API-Key) and OAuth/JWT Bearer tokens inside HTTPS request headers, never in URL query strings or committed source files. Load secrets from os.environ and mask all but the last 4 characters in logs.',
      example: `import os

token = os.environ.get("API_TOKEN", "sk_live_987654")
headers = {"Authorization": f"Bearer {token}"}
print("Log safe:", f"Bearer ****{token[-4:]}")`,
    },
    {
      category: 'Timeouts, Rate Limits (429) & Exponential Backoff',
      syntax: 'delay = max(float(retry_after or 0), min(cap, base * (2 ** attempt)))',
      description:
        'When an API returns 429 Too Many Requests, honor the Retry-After header and sleep using capped exponential backoff (doubling wait times each attempt) rather than retrying in a tight loop.',
      example: `def compute_backoff(attempt, retry_after=None, base=1.0, cap=30.0):
    exp = min(cap, base * (2 ** attempt))
    return max(exp, float(retry_after)) if retry_after is not None else exp

print([compute_backoff(i) for i in range(4)])`,
    },
    {
      category: 'CORS Preflight (OPTIONS & Allow-Origin)',
      syntax: 'OPTIONS /api/v1/orders -> 204 No Content\nAccess-Control-Allow-Origin: https://app.frontend.dev',
      description:
        'Cross-Origin Resource Sharing (CORS) is a browser security policy. Browsers send an OPTIONS preflight before cross-origin JSON/Auth calls and check Access-Control-Allow-Origin; server-side Python requests scripts are not subject to CORS.',
      example: `cors_response_headers = {
    "Access-Control-Allow-Origin": "https://app.frontend.dev",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
}
print(cors_response_headers["Access-Control-Allow-Origin"])`,
    },
  ],
  sourceNotes: [
    'Curriculum reference: https://github.com/Asabeneh/30-Days-Of-Python/tree/master/28_Day_API',
  ],
};
