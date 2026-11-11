/**
 * Day 22: Web Scraping (Advanced Python)
 * Part A (Learn) conforming to Sections 10, 13.2, and 14 of the Master Specification.
 * Includes:
 *  - 7 Detailed Subtopics following the 10-step pedagogical structure
 *  - 3 Signature Simulations: dom-tree-sim, css-selector-sim, scraping-ethics-sim
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_22_MODULE: DayModule = {
  schemaVersion: 1,
  number: 22,
  title: 'Web Scraping',
  level: 'advanced',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/22_Day_Web_scraping',
  estimatedMinutes: 70,
  prerequisites: [19],
  objectives: [
    'Evaluate scraping legality, ethics, and robots.txt rules using urllib.robotparser',
    'Fetch HTML pages safely with User-Agent headers, timeouts, and HTTP status checks',
    'Understand HTML DOM tree structure and parse tags with Python’s html.parser',
    'Use BeautifulSoup(html, "html.parser") with find() and find_all() safely',
    'Query elements precisely using CSS selectors (select(), select_one(), classes, IDs, attributes)',
    'Extract tables, resolve relative links with urllib.parse.urljoin(), and clean scraped text',
    'Handle pagination, rate limiting (time.sleep), deduplication, and JSON/CSV export',
  ],
  subtopics: [
    {
      id: 'day22-sub1',
      number: 1,
      title: 'Web Scraping Workflow, Ethics & robots.txt',
      summary: 'Check APIs first, respect Terms of Service, and parse /robots.txt with urllib.robotparser.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Responsible Web Scraping & robots.txt',
        paragraphs: [
          '**Web scraping** extracts structured data from HTML web pages when no official JSON API exists. Before writing a scraper, always check whether the site offers a public API or downloadable CSV/JSON dataset—APIs are faster, cleaner, and officially supported.',
          'Next, inspect the site’s **`/robots.txt`** file. The Robots Exclusion Protocol specifies which paths crawlers may (`Allow:`) or may not (`Disallow:`) access, plus optional `Crawl-delay:` hints.',
          'Python’s standard library includes **`urllib.robotparser.RobotFileParser`**, which parses `robots.txt` rules and answers `rp.can_fetch(user_agent, url)` with `True` or `False`.',
        ],
        keyTerms: [
          {
            term: 'robots.txt',
            definition: 'Standard site-root file declaring allowed and disallowed crawler paths per User-Agent.',
          },
          {
            term: 'RobotFileParser',
            definition: 'Standard-library parser in urllib.robotparser for checking can_fetch(agent, url).',
          },
        ],
        bulletPoints: [
          'Always prefer an official API over HTML scraping when one is available.',
          'Never scrape behind logins/paywalls without explicit authorization or violate copyright/privacy laws.',
        ],
      },
      visualise: {
        type: 'scraping-ethics-sim',
        title: 'robots.txt & Responsible Scraping Pipeline',
        badge: 'simulation',
        description: 'Inspect robots.txt directives, headers, rate limits, and urljoin pagination.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Checking robots.txt Rules with urllib.robotparser',
          runMode: 'real',
          code: `from urllib.robotparser import RobotFileParser

rp = RobotFileParser()
rp.parse([
    "User-agent: *",
    "Disallow: /admin/",
    "Allow: /public/",
])

print("Public allowed?", rp.can_fetch("*", "https://example.com/public/books"))
print("Admin allowed?", rp.can_fetch("*", "https://example.com/admin/users"))`,
          expectedOutput: `Public allowed? True
Admin allowed? False`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'rp.parse([...])',
          internalEffect: 'Loads robots.txt directives into the RobotFileParser rule engine.',
        },
        {
          step: 2,
          codeLine: 10,
          instruction: 'rp.can_fetch("*", "https://example.com/admin/users")',
          internalEffect: 'Matches Disallow: /admin/ and returns False.',
        },
      ],
      apply: {
        domain: 'Crawler Compliance',
        contextTitle: 'Filtering Target URLs Against robots.txt',
        scenario: 'Filter a list of candidate URLs to only those permitted by robots.txt.',
        code: `from urllib.robotparser import RobotFileParser

rp = RobotFileParser()
rp.parse(["User-agent: *", "Disallow: /private/"])
urls = ["https://site.com/catalog", "https://site.com/private/keys", "https://site.com/about"]
allowed = [u for u in urls if rp.can_fetch("EduBot", u)]
print("Allowed count:", len(allowed))`,
        outcome: 'Allowed count: 2',
      },
      commonMistakes: [
        {
          label: 'Ignoring robots.txt and Scraping Disallowed Admin Paths',
          erroneousCode: `# Blindly fetching /admin/ or /api/private/ without checking robots.txt`,
          errorMessage: 'Policy violation and immediate IP ban / 403 Forbidden',
          explanation: 'Check RobotFileParser.can_fetch() before queueing URLs for scraping.',
          correctedCode: `# if rp.can_fetch(USER_AGENT, url): fetch(url)`,
        },
      ],
      sourceNotes: 'Covers web scraping ethics and urllib.robotparser for Day 22.',
      practise: [
        {
          id: 'd22-ex1',
          title: 'API-First vs. HTML Scraping Decision',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Which data acquisition strategy should you choose first for a production price-monitoring pipeline?',
          contextScenario: 'A regional bookstore lists 12,000 titles on HTML pages, but network inspection reveals an undocumented public JSON endpoint `/api/v1/books.json` and a documented `/feeds/catalog.csv` export.',
          options: [
            {
              id: 'a',
              text: 'Use the documented `/feeds/catalog.csv` export (or official API) before attempting HTML scraping.',
              explanation: 'Correct! Official feeds and APIs are structured, faster, less brittle than DOM selectors, and explicitly intended for automated consumption.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'Scrape the rendered HTML product cards with 16 concurrent threads to stay ahead of layout changes.',
              explanation: 'High-concurrency HTML scraping is brittle and risks overloading the server when an official feed already exists.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'Ignore the CSV feed and parse inline `<script>` tags with regular expressions.',
              explanation: 'Parsing inline scripts with regex is fragile and unnecessary when a clean CSV feed is provided.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Bypass rate limits by rotating residential proxies against the HTML checkout pages.',
              explanation: 'Evading rate limits and touching checkout pages violates responsible scraping ethics.',
              isCorrect: false,
            },
          ],
          hints: [
            'Consider which source is officially supported and least likely to break on a CSS redesign.',
            'Structured exports like CSV or JSON eliminate HTML parsing overhead.',
            'Always prefer documented feeds/APIs over scraping HTML.',
          ],
          points: 10,
        },
        {
          id: 'd22-ex2',
          title: 'Trace RobotFileParser Agent Precedence',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'What does this `RobotFileParser` check print for `ResearchBot`?',
          contextScenario: 'A university archive configures stricter rules for general bots than for `ResearchBot`.',
          starterCode: `from urllib.robotparser import RobotFileParser

rp = RobotFileParser()
rp.parse([
    "User-agent: *",
    "Disallow: /archive/",
    "User-agent: ResearchBot",
    "Allow: /archive/open/",
    "Disallow: /archive/restricted/",
])

print(rp.can_fetch("ResearchBot", "https://uni.edu/archive/open/paper1"))
print(rp.can_fetch("ResearchBot", "https://uni.edu/archive/restricted/draft"))`,
          options: [
            {
              id: 'a',
              text: 'True\nFalse',
              explanation: 'Correct! `ResearchBot` matches its specific block: `/archive/open/` is allowed (`True`), while `/archive/restricted/` is disallowed (`False`).',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'False\nFalse',
              explanation: 'The `ResearchBot`-specific rules override the wildcard `User-agent: *` block.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'True\nTrue',
              explanation: '`/archive/restricted/` is explicitly disallowed for `ResearchBot`.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'False\nTrue',
              explanation: 'The first URL is explicitly allowed and the second is explicitly disallowed.',
              isCorrect: false,
            },
          ],
          hints: [
            'Look at which `User-agent:` section matches `"ResearchBot"`.',
            'Specific agent rules take precedence over the wildcard `*` section.',
            'Check `/archive/open/` against `Allow:` and `/archive/restricted/` against `Disallow:`.',
          ],
          points: 10,
        },
        {
          id: 'd22-ex3',
          title: 'Filter URLs with RobotFileParser',
          type: 'fill-the-gaps',
          tier: 'standard',
          prompt: 'Complete the `RobotFileParser` filter so only URLs permitted for `"CatalogBot"` are kept.',
          contextScenario: 'Your crawler receives a list of candidate URLs from a sitemap and must discard disallowed paths before fetching.',
          gaps: [
            {
              id: 'g1',
              beforeText: 'from urllib.robotparser import ',
              afterText: '\n',
              correctAnswer: 'RobotFileParser',
              options: ['RobotFileParser', 'RequestParser', 'UrlMatcher', 'RobotsClient'],
            },
            {
              id: 'g2',
              beforeText: 'rp = RobotFileParser()\nrp.',
              afterText: '(["User-agent: *", "Disallow: /checkout/"])\n',
              correctAnswer: 'parse',
              options: ['parse', 'loads', 'compile', 'read_lines'],
            },
            {
              id: 'g3',
              beforeText: 'allowed = [u for u in urls if rp.',
              afterText: '("CatalogBot", u)]',
              correctAnswer: 'can_fetch',
              options: ['can_fetch', 'is_allowed', 'match_url', 'permit'],
            },
          ],
          hints: [
            'The standard-library class is in `urllib.robotparser`.',
            'When feeding a list of lines in memory, use `.parse(lines)`.',
            'The permission check method is `.can_fetch(user_agent, url)`.',
          ],
          points: 15,
        },
        {
          id: 'd22-ex4',
          title: 'Why robots.txt Is Not a Security Boundary',
          type: 'theory-reasoning',
          tier: 'challenge',
          prompt: 'Explain why `robots.txt` is an advisory coordination protocol rather than a security mechanism, and what a site owner must do to actually protect private routes.',
          contextScenario: 'A startup places `Disallow: /internal-metrics/` in `robots.txt` assuming this prevents anyone from viewing the dashboard.',
          modelAnswer: 'robots.txt is a publicly readable plain-text file that relies on voluntary compliance by well-behaved crawlers; it does not enforce access control. In fact, listing sensitive paths in Disallow can advertise their existence. To protect private routes, the server must enforce authentication and authorization (e.g., session tokens, RBAC, or HTTP 401/403 checks) on every request.',
          markingCriteria: [
            { id: 'c1', label: 'Identifies robots.txt as voluntary/advisory rather than enforced access control', points: 10 },
            { id: 'c2', label: 'Notes that robots.txt is public and can expose hidden paths', points: 5 },
            { id: 'c3', label: 'Recommends server-side authentication/authorization (401/403)', points: 5 },
          ],
          hints: [
            'Can an HTTP client ignore `robots.txt` and still send a GET request?',
            'Who can read `https://example.com/robots.txt`?',
            'What server-side mechanism actually blocks unauthorized requests?',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day22-sub2',
      number: 2,
      title: 'Fetching HTML Safely (User-Agent, Timeouts & Status Checks)',
      summary: 'Configure polite User-Agent headers, enforce timeouts, and validate HTTP status codes.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Making Polite, Reliable HTTP Requests',
        paragraphs: [
          'When fetching web pages with `requests.get(url, headers=headers, timeout=10)`, always send a descriptive **`User-Agent`** header (e.g., `{"User-Agent": "StudyBot/1.0 (+mailto:you@example.com)"}`). Many servers reject the default `python-requests/...` agent with `403 Forbidden`.',
          'Always pass **`timeout=`** (e.g., `timeout=10`) so a slow server cannot freeze your scraper, and call **`resp.raise_for_status()`** (or check `resp.status_code == 200`) before passing `resp.text` to a parser.',
          'Also inspect `resp.encoding` or `resp.apparent_encoding` if non-ASCII characters (`₦`, `é`) look garbled (“mojibake”).',
        ],
        keyTerms: [
          {
            term: 'User-Agent Header',
            definition: 'HTTP request header identifying the client software making the request.',
          },
          {
            term: 'raise_for_status()',
            definition: 'Raises an HTTPError if the response status code is 4xx or 5xx.',
          },
        ],
        bulletPoints: [
          'Never parse `resp.text` without checking `resp.status_code`—otherwise you end up scraping an HTML 404/429 error page!',
          'Note that `requests` only fetches static HTML; JavaScript-rendered SPAs require Playwright/Selenium or inspecting the network JSON API.',
        ],
      },
      visualise: {
        type: 'scraping-ethics-sim',
        title: 'HTTP Headers, Timeouts & Status Handling',
        badge: 'simulation',
        description: 'Inspect how User-Agent, timeout, and status codes protect your scraper.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Validating HTTP Status & Building Polite Request Headers',
          runMode: 'real',
          code: `headers = {"User-Agent": "PythonLabBot/1.0 (+edu@example.com)"}

def should_parse(status_code: int, content_type: str) -> bool:
    return status_code == 200 and "text/html" in content_type

print("200 HTML:", should_parse(200, "text/html; charset=utf-8"))
print("429 JSON:", should_parse(429, "application/json"))`,
          expectedOutput: `200 HTML: True
429 JSON: False`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'status_code == 200 and "text/html" in content_type',
          internalEffect: 'Guards the HTML parser from error pages (404/429) and non-HTML binary downloads.',
        },
      ],
      apply: {
        domain: 'HTTP Clients',
        contextTitle: 'Classifying HTTP Fetch Outcomes',
        scenario: 'Route 200, 429, and 404 responses into fetch, backoff, or skip actions.',
        code: `def classify_status(code: int) -> str:
    if code == 200:
        return "parse"
    if code == 429:
        return "backoff"
    return "skip"

print([classify_status(c) for c in (200, 429, 404)])`,
        outcome: "['parse', 'backoff', 'skip']",
      },
      commonMistakes: [
        {
          label: 'Parsing HTML Without Checking status_code',
          erroneousCode: `# resp = requests.get(url, timeout=10)
# soup = BeautifulSoup(resp.text, "html.parser")  # Silently parses 403/404/500 pages!`,
          errorMessage: 'Silent failure: scraper extracts empty lists from an error page',
          explanation: 'Call resp.raise_for_status() or check resp.status_code == 200 first.',
          correctedCode: `# resp.raise_for_status()`,
        },
      ],
      sourceNotes: 'Covers HTTP headers, timeouts, and status checks for Day 22.',
      practise: [
        {
          id: 'd22-ex5',
          title: 'Diagnosing HTTP 403 on Automated Requests',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Your script gets `403 Forbidden` while your browser loads the exact same public article. What is the most appropriate first fix?',
          contextScenario: 'A public municipal events page loads cleanly in Chrome, but `requests.get(url)` without custom headers immediately returns HTTP 403.',
          options: [
            {
              id: 'a',
              text: 'Set a descriptive `User-Agent` header with contact info and respect a `timeout` and `time.sleep` delay.',
              explanation: 'Correct! Many servers block default library User-Agent strings like `python-requests/2.x` to deter unidentifiable bots.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'Remove `raise_for_status()` so the script ignores the 403 error.',
              explanation: 'Ignoring 403 would pass an error page into your HTML parser instead of article data.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'Retry the same request in a tight `while True:` loop with zero delay.',
              explanation: 'A tight retry loop without backoff will worsen rate limiting or trigger an IP ban.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Switch from `GET` to `POST` on the article URL.',
              explanation: 'Fetching a static article page requires `GET`, not `POST`.',
              isCorrect: false,
            },
          ],
          hints: [
            'Compare what headers Chrome sends versus bare `requests.get(url)`.',
            'Servers often reject generic library `User-Agent` strings.',
            'Identify your scraper responsibly via the `User-Agent` header.',
          ],
          points: 10,
        },
        {
          id: 'd22-ex6',
          title: 'Order a Safe HTTP Fetch Function',
          type: 'order-the-lines',
          tier: 'standard',
          prompt: 'Arrange the lines to define a safe `fetch_html(url)` helper with headers, timeout, and status validation.',
          contextScenario: 'A weather-archive collector needs a reusable fetch helper that never hangs indefinitely or silently parses a 404 page.',
          jumbledLines: [
            { id: 'l3', code: 'resp.raise_for_status()', indent: 1 },
            { id: 'l1', code: 'def fetch_html(url, client):', indent: 0 },
            { id: 'l4', code: 'return resp.text', indent: 1 },
            { id: 'l2', code: 'resp = client.get(url, headers={"User-Agent": "ArchiveBot/1.0"}, timeout=10)', indent: 1 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: [
            'Start with the function signature `def fetch_html(...)`.',
            'Perform the `GET` request with `headers` and `timeout` before checking status.',
            'Call `raise_for_status()` before returning `resp.text`.',
          ],
          points: 15,
        },
        {
          id: 'd22-ex7',
          title: 'Fix Unchecked Status & Missing Timeout',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'Fix `safe_fetch` so it passes `timeout=5` to `client.get` and raises a `ValueError` if `status_code != 200`.',
          contextScenario: 'A simulated HTTP client passes a `404` HTML error page into the parser because `safe_fetch` ignores `status_code`.',
          starterCode: `class MockClient:
    def get(self, url, timeout=None):
        self.last_timeout = timeout
        if "missing" in url:
            return {"status_code": 404, "text": "<h1>Not Found</h1>"}
        return {"status_code": 200, "text": "<h1>Catalog</h1>"}

def safe_fetch(client, url):
    resp = client.get(url)
    return resp["text"]

client = MockClient()
try:
    print(safe_fetch(client, "https://site.com/missing"))
except ValueError as err:
    print("Caught:", err)
print("Timeout used:", client.last_timeout)`,
          solutionCode: `class MockClient:
    def get(self, url, timeout=None):
        self.last_timeout = timeout
        if "missing" in url:
            return {"status_code": 404, "text": "<h1>Not Found</h1>"}
        return {"status_code": 200, "text": "<h1>Catalog</h1>"}

def safe_fetch(client, url):
    resp = client.get(url, timeout=5)
    if resp["status_code"] != 200:
        raise ValueError(f"HTTP {resp['status_code']}")
    return resp["text"]

client = MockClient()
try:
    print(safe_fetch(client, "https://site.com/missing"))
except ValueError as err:
    print("Caught:", err)
print("Timeout used:", client.last_timeout)`,
          testCases: [
            {
              id: 'tc1',
              label: 'Raises ValueError on 404 and sets timeout=5',
              setup: '',
              expected: 'Caught: HTTP 404\nTimeout used: 5',
              hidden: false,
            },
          ],
          hints: [
            'Pass `timeout=5` as a keyword argument to `client.get(url, timeout=5)`.',
            'Check `if resp["status_code"] != 200:` before returning.',
            'Raise `ValueError(f"HTTP {resp[\'status_code\']}")` on non-200 responses.',
          ],
          points: 15,
        },
        {
          id: 'd22-ex8',
          title: 'Trace Encoding Mismatch on Scraped Text',
          type: 'explain-the-trace',
          tier: 'challenge',
          prompt: 'Explain why `resp.text` displays mojibake (`CafÃ©`) when an HTTP server omits `charset=utf-8` in `Content-Type: text/html`, and how setting `resp.encoding` fixes it.',
          contextScenario: 'A European museum catalog serves UTF-8 HTML bytes (`b"Caf\\xc3\\xa9"`) with header `Content-Type: text/html` (no charset).',
          traceStepCode: `raw = b"Caf\\xc3\\xa9"
print("Default ISO-8859-1:", raw.decode("iso-8859-1"))
print("Explicit UTF-8:", raw.decode("utf-8"))`,
          traceQuestion: 'Why did the first decode produce `CafÃ©` while the second produced `Café`?',
          modelAnswer: 'Under older HTTP/1.1 defaults, requests falls back to ISO-8859-1 for text/* responses lacking an explicit charset parameter. In ISO-8859-1, the two UTF-8 bytes 0xC3 and 0xA9 are decoded as two separate characters (Ã and ©). Setting resp.encoding = "utf-8" (or resp.apparent_encoding) before reading resp.text decodes the multi-byte sequence properly as é.',
          markingCriteria: [
            { id: 'c1', label: 'Identifies ISO-8859-1 fallback when Content-Type lacks charset', points: 10 },
            { id: 'c2', label: 'Explains 0xC3 0xA9 being decoded as two characters vs one UTF-8 character', points: 5 },
            { id: 'c3', label: 'Identifies setting resp.encoding = "utf-8" or apparent_encoding as the fix', points: 5 },
          ],
          hints: [
            'What encoding does `requests` default to for `text/html` without `charset=`?',
            'How many bytes is `é` in UTF-8?',
            'What happens when you set `resp.encoding = "utf-8"` before accessing `resp.text`?',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day22-sub3',
      number: 3,
      title: 'HTML Structure, DOM Tree & Python’s html.parser',
      summary: 'Understand nested HTML tags, attributes, and Python’s built-in HTMLParser.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'How Browsers and Scrapers See HTML',
        paragraphs: [
          'An HTML document is a **tree** of nested elements (the **DOM**): `<html>` contains `<body>`, which contains `<main>`, `<article class="card">`, `<h2>`, `<a href="...">`, and text nodes.',
          'Every element has a **tag name** (`a`, `span`, `h2`), optional **attributes** (`href="/books/1"`, `class="price"`), and **text/children**.',
          'Python’s standard library provides **`html.parser.HTMLParser`**, an event-driven parser (`handle_starttag`, `handle_data`, `handle_endtag`) that requires zero external packages and also serves as BeautifulSoup’s default built-in parser (`"html.parser"`).',
        ],
        keyTerms: [
          {
            term: 'DOM Tree',
            definition: 'Hierarchical tree of HTML elements, attributes, and text nodes.',
          },
          {
            term: 'html.parser.HTMLParser',
            definition: 'Standard-library streaming HTML parser triggering callbacks on start tags, data, and end tags.',
          },
        ],
        bulletPoints: [
          'Never parse arbitrary HTML with regex (`<.*?>`)—nested tags and malformed markup break regexes quickly.',
          'Use a real HTML parser (`html.parser`, `BeautifulSoup`, or `lxml`).',
        ],
      },
      visualise: {
        type: 'dom-tree-sim',
        title: 'HTML DOM Tree & Element Anatomy Inspector',
        badge: 'simulation',
        description: 'Inspect tag names, attrs dictionaries, and cleaned text extraction.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Extracting Links & Text with stdlib HTMLParser',
          runMode: 'real',
          code: `from html.parser import HTMLParser

class LinkExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            attr_dict = dict(attrs)
            if "href" in attr_dict:
                self.links.append(attr_dict["href"])

parser = LinkExtractor()
parser.feed('<nav><a href="/home">Home</a><a href="/books">Books</a></nav>')
print("Links:", parser.links)`,
          expectedOutput: `Links: ['/home', '/books']`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 8,
          instruction: 'def handle_starttag(self, tag, attrs):',
          internalEffect: 'Invoked for every opening tag with tag name and list of (name, value) attribute tuples.',
        },
        {
          step: 2,
          codeLine: 15,
          instruction: 'parser.feed(...)',
          internalEffect: 'Streams the HTML string through the parser, collecting both href values.',
        },
      ],
      apply: {
        domain: 'DOM Inspection',
        contextTitle: 'Collecting Heading Text Using HTMLParser',
        scenario: 'Capture text inside <h2> tags from an HTML snippet.',
        code: `from html.parser import HTMLParser

class H2Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_h2 = False
        self.titles = []
    def handle_starttag(self, tag, attrs):
        if tag == "h2": self.in_h2 = True
    def handle_endtag(self, tag):
        if tag == "h2": self.in_h2 = False
    def handle_data(self, data):
        if self.in_h2 and data.strip(): self.titles.append(data.strip())

p = H2Parser()
p.feed("<div><h2>Python</h2><p>Ignore</p><h2>Flask</h2></div>")
print(p.titles)`,
        outcome: "['Python', 'Flask']",
      },
      commonMistakes: [
        {
          label: 'Using Regex Instead of an HTML Parser',
          erroneousCode: `import re
# re.findall(r"<div>(.*?)</div>", "<div><div>nested</div></div>")  # Breaks on nested tags!`,
          errorMessage: 'Logic bug: regex fails on nested HTML tags and multiline attributes',
          explanation: 'HTML is not a regular language; always use HTMLParser or BeautifulSoup.',
          correctedCode: `# Use HTMLParser or BeautifulSoup(html, "html.parser")`,
        },
      ],
      sourceNotes: 'Covers DOM structure and stdlib html.parser for Day 22.',
      practise: [
        {
          id: 'd22-ex9',
          title: 'Trace DOM Tree Child Extraction',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'What does this `ElementTree` DOM traversal print?',
          contextScenario: 'Inspecting a parsed `<section>` element to distinguish direct children from nested descendants.',
          starterCode: `import xml.etree.ElementTree as ET

root = ET.fromstring("<section><h2>News</h2><div><p>Lead</p><p>Body</p></div></section>")
print("Direct children:", len(list(root)))
print("All p tags:", [p.text for p in root.findall(".//p")])`,
          options: [
            {
              id: 'a',
              text: "Direct children: 2\nAll p tags: ['Lead', 'Body']",
              explanation: 'Correct! `root` has 2 direct children (`<h2>` and `<div>`), while `.//p` searches all descendants and finds both `<p>` tags.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: "Direct children: 4\nAll p tags: ['Lead', 'Body']",
              explanation: '`list(root)` only counts direct children (`<h2>` and `<div>`), not grandchildren.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: "Direct children: 2\nAll p tags: []",
              explanation: '`.//p` searches recursively through descendants, so it finds both `<p>` tags inside `<div>`.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: "Direct children: 1\nAll p tags: ['Lead']",
              explanation: 'Both `<h2>` and `<div>` are direct children of `<section>`.',
              isCorrect: false,
            },
          ],
          hints: [
            'Count the tags immediately inside `<section>...</section>`.',
            '`.//p` is a descendant XPath query that looks inside `<div>` as well.',
            '`[p.text for p in ...]` collects the text of every matched `<p>`.',
          ],
          points: 10,
        },
        {
          id: 'd22-ex10',
          title: 'Collect Anchor href Attributes with HTMLParser',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Complete `LinkCollector` using `html.parser.HTMLParser` so it appends every `href` value from `<a>` tags into `self.links` and prints the list.',
          contextScenario: 'Extracting outbound citation links from a static academic bibliography page using only Python’s standard library.',
          starterCode: `from html.parser import HTMLParser

class LinkCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        # TODO: if tag == "a", find "href" in attrs and append to self.links
        pass

html = '<nav><a href="/home">Home</a><a href="/papers/1">Paper</a></nav>'
parser = LinkCollector()
parser.feed(html)
print(parser.links)`,
          solutionCode: `from html.parser import HTMLParser

class LinkCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            for name, value in attrs:
                if name == "href" and value:
                    self.links.append(value)

html = '<nav><a href="/home">Home</a><a href="/papers/1">Paper</a></nav>'
parser = LinkCollector()
parser.feed(html)
print(parser.links)`,
          testCases: [
            {
              id: 'tc1',
              label: 'Collects both href strings',
              setup: '',
              expected: "['/home', '/papers/1']",
              hidden: false,
            },
          ],
          hints: [
            '`attrs` is a list of `(name, value)` tuples.',
            'Check `if tag == "a":` and then loop or convert `dict(attrs).get("href")`.',
            'Append each non-empty `href` string to `self.links`.',
          ],
          points: 15,
        },
        {
          id: 'd22-ex11',
          title: 'Capture data-sku Attributes in HTMLParser',
          type: 'fill-the-gaps',
          tier: 'standard',
          prompt: 'Fill in the gaps so `SkuParser` extracts `data-sku` values from `<div class="card">` elements.',
          contextScenario: 'An inventory page stores SKU identifiers inside `data-sku` attributes on product card containers.',
          gaps: [
            {
              id: 'g1',
              beforeText: 'class SkuParser(',
              afterText: '):\n',
              correctAnswer: 'HTMLParser',
              options: ['HTMLParser', 'DOMNode', 'BeautifulSoup', 'TagReader'],
            },
            {
              id: 'g2',
              beforeText: '    def ',
              afterText: '(self, tag, attrs):\n',
              correctAnswer: 'handle_starttag',
              options: ['handle_starttag', 'on_open_tag', 'start_element', 'parse_tag'],
            },
            {
              id: 'g3',
              beforeText: '        attr_map = ',
              afterText: '(attrs)\n        if tag == "div" and "data-sku" in attr_map:\n            self.skus.append(attr_map["data-sku"])',
              correctAnswer: 'dict',
              options: ['dict', 'list', 'set', 'tuple'],
            },
          ],
          hints: [
            'Subclass `HTMLParser` from `html.parser`.',
            'The callback for opening tags is `handle_starttag`.',
            '`dict(attrs)` converts `[(k, v), ...]` into a lookup dictionary.',
          ],
          points: 15,
        },
        {
          id: 'd22-ex12',
          title: 'Why Regex Fails on Nested HTML',
          type: 'theory-reasoning',
          tier: 'challenge',
          prompt: 'Explain why regular expressions are unreliable for parsing arbitrary nested HTML compared to a DOM parser like BeautifulSoup or `html.parser`.',
          contextScenario: 'A teammate suggests replacing BeautifulSoup with `re.findall(r"<div>(.*?)</div>", html)` to extract product cards.',
          modelAnswer: 'HTML is a context-free nested structure, not a regular language. A non-greedy regex like `<div>(.*?)</div>` stops at the first closing `</div>` of an inner child tag, truncating the outer card. Regex also breaks on attributes in varying order, comments, self-closing tags, and whitespace variations, whereas a DOM parser builds a proper parent-child tree.',
          markingCriteria: [
            { id: 'c1', label: 'Explains nested tag matching failure (early match on inner </div>)', points: 10 },
            { id: 'c2', label: 'Notes sensitivity to attribute ordering, comments, or whitespace', points: 5 },
            { id: 'c3', label: 'Contrasts with DOM tree construction by a real HTML parser', points: 5 },
          ],
          hints: [
            'What happens if a `<div class="card">` contains an inner `<div>badge</div>`?',
            'Where does non-greedy `.*?</div>` stop?',
            'How does a DOM parser track opening and closing tag depth?',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day22-sub4',
      number: 4,
      title: 'BeautifulSoup Basics (find(), find_all(), class_)',
      summary: 'Query HTML elements cleanly with BeautifulSoup’s find() and find_all() methods.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Navigating the DOM with BeautifulSoup',
        paragraphs: [
          'The third-party **`beautifulsoup4`** package (`from bs4 import BeautifulSoup`) wraps `html.parser` into an intuitive tree API: `soup = BeautifulSoup(html, "html.parser")`.',
          '**`soup.find(tag, ...)`** returns the **first** matching `Tag` object (or `None` if not found). Always guard against `None` (`if title_tag:`) before reading `.text` or `.get_text()`, otherwise `None.text` raises `AttributeError`.',
          '**`soup.find_all(tag, ...)`** returns a `list` of all matching `Tag` objects. Because `class` is a reserved Python keyword, filter by CSS class using **`class_="price"`** (with a trailing underscore)!',
        ],
        keyTerms: [
          {
            term: 'find() vs find_all()',
            definition: 'find() returns the first Tag or None; find_all() returns a list of all matching Tags.',
          },
          {
            term: 'class_ Parameter',
            definition: 'Keyword argument in BeautifulSoup used to filter HTML class attributes without colliding with Python’s class keyword.',
          },
        ],
        bulletPoints: [
          'Always check `if tag is not None:` after `soup.find(...)`.',
          'Use `tag.get("href")` instead of `tag["href"]` when an attribute may be optional.',
        ],
      },
      visualise: {
        type: 'css-selector-sim',
        title: 'BeautifulSoup find() & find_all() Inspector',
        badge: 'simulation',
        description: 'Compare find(), find_all(), and CSS selector results.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Safe Element Lookup Pattern (None Guard + XML/HTML Tree)',
          runMode: 'real',
          code: `import xml.etree.ElementTree as ET

root = ET.fromstring('<catalog><item price="1200">Book</item><item price="800">Pen</item></catalog>')
first = root.find("item")
print("First:", first.text if first is not None else "Missing")
print("All prices:", [el.attrib.get("price") for el in root.findall("item")])`,
          expectedOutput: `First: Book
All prices: ['1200', '800']`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'first = root.find("item")',
          internalEffect: 'Returns the first matching element or None, mirroring BeautifulSoup.find().',
        },
        {
          step: 2,
          codeLine: 5,
          instruction: 'first.text if first is not None else "Missing"',
          internalEffect: 'Guards against AttributeError when an expected element is absent.',
        },
      ],
      apply: {
        domain: 'Catalog Extraction',
        contextTitle: 'Handling Missing Optional Badges Gracefully',
        scenario: 'Extract optional "badge" text from product nodes without crashing when missing.',
        code: `import xml.etree.ElementTree as ET

doc = ET.fromstring("<list><card><name>A</name><badge>New</badge></card><card><name>B</name></card></list>")
for card in doc.findall("card"):
    name = card.find("name").text
    badge_el = card.find("badge")
    badge = badge_el.text if badge_el is not None else "None"
    print(name, badge)`,
        outcome: `A New
B None`,
      },
      commonMistakes: [
        {
          label: 'Using class= Instead of class_= in BeautifulSoup',
          erroneousCode: `# soup.find_all("span", class="price")  # SyntaxError: invalid syntax!`,
          errorMessage: 'SyntaxError: invalid syntax (class is a Python reserved keyword)',
          explanation: 'BeautifulSoup uses class_="price" (with a trailing underscore) or attrs={"class": "price"}.',
          correctedCode: `# soup.find_all("span", class_="price")`,
        },
      ],
      sourceNotes: 'Covers BeautifulSoup find(), find_all(), and class_ for Day 22.',
      practise: [
        {
          id: 'd22-ex13',
          title: 'Why BeautifulSoup Uses class_',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Why must you write `soup.find_all("span", class_="price")` instead of `class="price"` in Python?',
          contextScenario: 'A beginner writes `soup.find_all("span", class="price")` and immediately hits a `SyntaxError`.',
          options: [
            {
              id: 'a',
              text: '`class` is a reserved Python keyword, so BeautifulSoup uses `class_` as the parameter name.',
              explanation: 'Correct! Python forbids using `class` as a keyword argument name, so BeautifulSoup maps `class_` to the HTML `class` attribute.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'HTML5 renamed the `class` attribute to `class_` in 2020.',
              explanation: 'HTML still uses `class="..."`; `class_` is purely a Python keyword-argument convention.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '`class_` matches both `id` and `class` simultaneously.',
              explanation: '`class_` only matches the HTML `class` attribute.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Using `class` is allowed only inside `find()`, not `find_all()`.',
              explanation: '`class` is a reserved keyword everywhere in Python syntax.',
              isCorrect: false,
            },
          ],
          hints: [
            'Think about Python’s reserved keywords (`def`, `class`, `return`, `import`).',
            'Can `class="price"` be parsed as a Python keyword argument?',
            'BeautifulSoup appends an underscore (`class_`) to avoid the keyword collision.',
          ],
          points: 10,
        },
        {
          id: 'd22-ex14',
          title: 'Predict Missing Tag Guard Behavior',
          type: 'predict-output',
          tier: 'standard',
          prompt: 'What does this safe extraction helper print for the two HTML cards?',
          contextScenario: 'Some product cards include an optional `<span class="badge">Sale</span>`, while others omit it.',
          starterCode: `import xml.etree.ElementTree as ET

def get_badge(card_html):
    card = ET.fromstring(card_html)
    badge = card.find(".//span[@class='badge']")
    return badge.text.strip() if badge is not None and badge.text else "Regular"

print(get_badge('<div><h3>Mug</h3><span class="badge"> Sale </span></div>'))
print(get_badge('<div><h3>Notebook</h3></div>'))`,
          options: [
            {
              id: 'a',
              text: 'Sale\nRegular',
              explanation: 'Correct! The first card finds the badge and strips whitespace (`"Sale"`); the second returns `None` from `find()`, triggering the `"Regular"` fallback.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: ' Sale \nNone',
              explanation: '`.strip()` removes surrounding spaces and the ternary returns `"Regular"`, not `None`.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'AttributeError',
              explanation: 'The `if badge is not None` guard prevents calling `.text` on `None`.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Regular\nRegular',
              explanation: 'The first card does contain `<span class="badge">`.',
              isCorrect: false,
            },
          ],
          hints: [
            'Trace the first call: `badge` is found and `.strip()` is applied.',
            'Trace the second call: `card.find(...)` returns `None`.',
            'What does the ternary expression return when `badge is None`?',
          ],
          points: 15,
        },
        {
          id: 'd22-ex15',
          title: 'Fix NoneType AttributeError on Optional Elements',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'Fix `extract_subtitle` so missing `<p class="sub">` tags return `"N/A"` instead of raising `AttributeError`.',
          contextScenario: 'A news scraper crashes halfway through a feed because opinion articles lack a `<p class="sub">` subtitle.',
          starterCode: `import xml.etree.ElementTree as ET

def extract_subtitle(html):
    root = ET.fromstring(html)
    sub = root.find(".//p[@class='sub']")
    return sub.text.strip()

articles = [
    '<article><h2>City Budget</h2><p class="sub">  Council votes Friday </p></article>',
    '<article><h2>Editorial Note</h2></article>',
]
for art in articles:
    print(extract_subtitle(art))`,
          solutionCode: `import xml.etree.ElementTree as ET

def extract_subtitle(html):
    root = ET.fromstring(html)
    sub = root.find(".//p[@class='sub']")
    if sub is None or not sub.text:
        return "N/A"
    return sub.text.strip()

articles = [
    '<article><h2>City Budget</h2><p class="sub">  Council votes Friday </p></article>',
    '<article><h2>Editorial Note</h2></article>',
]
for art in articles:
    print(extract_subtitle(art))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Returns cleaned subtitle and N/A fallback',
              setup: '',
              expected: 'Council votes Friday\nN/A',
              hidden: false,
            },
          ],
          hints: [
            'When `.find(...)` finds no match, `sub` is `None`.',
            'Check `if sub is None or not sub.text:` before accessing `sub.text.strip()`.',
            'Return `"N/A"` in the fallback branch.',
          ],
          points: 15,
        },
        {
          id: 'd22-ex16',
          title: 'Extract Product Cards with Optional Discount Fallback',
          type: 'write-code',
          tier: 'project',
          prompt: 'Parse the HTML catalog and print each item as `"Name | Price | Status"`, using `"Full Price"` when `<span class="tag">` is absent.',
          contextScenario: 'Building a structured product parser resilient to missing promotional badges.',
          starterCode: `import xml.etree.ElementTree as ET

html = """
<div class="catalog">
  <div class="item"><h3>Lamp</h3><span class="price">$35</span><span class="tag">20% Off</span></div>
  <div class="item"><h3>Desk</h3><span class="price">$190</span></div>
</div>
"""

root = ET.fromstring(html)
# TODO: iterate over .//div[@class='item'], extract h3, price, and optional tag`,
          solutionCode: `import xml.etree.ElementTree as ET

html = """
<div class="catalog">
  <div class="item"><h3>Lamp</h3><span class="price">$35</span><span class="tag">20% Off</span></div>
  <div class="item"><h3>Desk</h3><span class="price">$190</span></div>
</div>
"""

root = ET.fromstring(html)
for item in root.findall(".//div[@class='item']"):
    name = item.find("h3").text.strip()
    price = item.find(".//span[@class='price']").text.strip()
    tag_el = item.find(".//span[@class='tag']")
    status = tag_el.text.strip() if tag_el is not None and tag_el.text else "Full Price"
    print(f"{name} | {price} | {status}")`,
          testCases: [
            {
              id: 'tc1',
              label: 'Prints formatted Lamp and Desk rows',
              setup: '',
              expected: 'Lamp | $35 | 20% Off\nDesk | $190 | Full Price',
              hidden: false,
            },
          ],
          hints: [
            'Use `root.findall(".//div[@class=\'item\']")` to loop through each card.',
            'Guard `tag_el` with `if tag_el is not None and tag_el.text`.',
            'Print using `f"{name} | {price} | {status}"`.',
          ],
          points: 25,
        },
      ],
      assess: [],
    },
    {
      id: 'day22-sub5',
      number: 5,
      title: 'CSS Selectors (select(), select_one(), Classes, IDs & Attributes)',
      summary: 'Target deeply nested DOM elements concisely using CSS selector syntax.',
      estimatedMinutes: 10,
      introduce: {
        headline: 'Precision Targeting with CSS Selectors',
        paragraphs: [
          'Instead of chaining multiple `.find()` calls, BeautifulSoup’s **`soup.select("...")`** and **`soup.select_one("...")`** accept standard CSS selectors—the exact same selectors you use in browser DevTools!',
          'Key selector patterns: **`.price`** (class), **`#main`** (ID), **`div.card > a`** (direct child `a` inside `div.card`), **`article span`** (any descendant `span` inside `article`), and **`a[href^="https"]`** (attribute starts with `"https"`).',
          '`soup.select()` always returns a `list` (even if 0 or 1 elements match), whereas `soup.select_one()` returns the first `Tag` or `None`.',
        ],
        keyTerms: [
          {
            term: 'soup.select() / select_one()',
            definition: 'BeautifulSoup methods that match elements using CSS selector strings.',
          },
          {
            term: 'Combinators (> vs space)',
            definition: 'A > B matches direct children only; A B matches any nested descendant.',
          },
        ],
        bulletPoints: [
          'Inspect elements in Chrome/Firefox DevTools to verify selectors before coding.',
          'Prefer semantic classes/IDs over brittle deep paths like `body > div:nth-child(4) > table > tr`.',
        ],
      },
      visualise: {
        type: 'css-selector-sim',
        title: 'CSS Selector Matching (select & select_one)',
        badge: 'simulation',
        description: 'Test CSS class, child (>), and attribute ([href^=...]) selectors.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Filtering Attribute-Based Links with Pure Python',
          runMode: 'real',
          code: `links = [
    {"href": "https://python.org", "class": ["ext"]},
    {"href": "/docs/intro.pdf", "class": ["doc"]},
    {"href": "https://pypi.org", "class": ["ext"]},
]

# Equivalent to soup.select('a.ext[href^="https"]')
ext_https = [a["href"] for a in links if "ext" in a["class"] and a["href"].startswith("https")]
print("Matched:", ext_https)`,
          expectedOutput: `Matched: ['https://python.org', 'https://pypi.org']`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 8,
          instruction: '"ext" in a["class"] and a["href"].startswith("https")',
          internalEffect: 'Demonstrates the exact predicate evaluated by CSS selector a.ext[href^="https"].',
        },
      ],
      apply: {
        domain: 'Document Harvesting',
        contextTitle: 'Selecting PDF Download Links',
        scenario: 'Filter anchor records whose href ends with ".pdf" (equivalent to a[href$=".pdf"]).',
        code: `anchors = ["/a.html", "/report.pdf", "/guide.pdf", "/img.png"]
pdfs = [href for href in anchors if href.endswith(".pdf")]
print("PDFs:", pdfs)`,
        outcome: "PDFs: ['/report.pdf', '/guide.pdf']",
      },
      commonMistakes: [
        {
          label: 'Expecting soup.select() to Return a Single Tag',
          erroneousCode: `# title = soup.select("h1.title").get_text()  # AttributeError: 'list' object has no attribute 'get_text'!`,
          errorMessage: "AttributeError: 'ResultSet' / 'list' object has no attribute 'get_text'",
          explanation: 'soup.select() always returns a list; use soup.select_one() for a single element.',
          correctedCode: `# el = soup.select_one("h1.title"); title = el.get_text(strip=True) if el else ""`,
        },
      ],
      sourceNotes: 'Covers CSS selectors select() and select_one() for Day 22.',
      practise: [
        {
          id: 'd22-ex17',
          title: 'Descendant vs. Direct-Child CSS Combinator',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Which CSS selector matches ONLY `<p>` tags that are immediate children of `<div class="summary">` and skips `<p>` tags nested inside inner `<blockquote>` elements?',
          contextScenario: 'An article summary block contains a top-level `<p>` and a nested `<blockquote><p>...</p></blockquote>` quote you want to exclude.',
          options: [
            {
              id: 'a',
              text: '`div.summary > p`',
              explanation: 'Correct! The `>` child combinator restricts matches to direct children of `div.summary`.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: '`div.summary p`',
              explanation: 'A space is the descendant combinator, which matches `<p>` at any nesting depth.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '`div.summary + p`',
              explanation: '`+` is the adjacent sibling combinator, matching a `<p>` immediately after `div.summary`.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: '`div.summary ~ p`',
              explanation: '`~` is the general sibling combinator, matching following sibling `<p>` elements.',
              isCorrect: false,
            },
          ],
          hints: [
            'Space means "any descendant at any depth".',
            'Which symbol means "direct child only"?',
            'Look for the `>` combinator.',
          ],
          points: 10,
        },
        {
          id: 'd22-ex18',
          title: 'Order a CSS Selector Extraction Pipeline',
          type: 'order-the-lines',
          tier: 'standard',
          prompt: 'Order these BeautifulSoup lines to select all HTTPS links inside `#sidebar` and print their `href` strings.',
          contextScenario: 'Filtering external HTTPS resource links from a documentation sidebar.',
          jumbledLines: [
            { id: 'l3', code: 'for link in links:', indent: 0 },
            { id: 'l1', code: 'soup = BeautifulSoup(html, "html.parser")', indent: 0 },
            { id: 'l4', code: 'print(link.get("href"))', indent: 1 },
            { id: 'l2', code: 'links = soup.select(\'#sidebar a[href^="https://"]\')', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: [
            'First parse the HTML into `soup`.',
            'Next run `soup.select(...)` to get the list of matching tags.',
            'Finally iterate over `links` and print `link.get("href")`.',
          ],
          points: 15,
        },
        {
          id: 'd22-ex19',
          title: 'Complete CSS Attribute Prefix & Suffix Selectors',
          type: 'fill-the-gaps',
          tier: 'standard',
          prompt: 'Fill in the CSS attribute operators to match PDF download links (`href` ending in `.pdf`) and external links (`href` starting with `https://`).',
          contextScenario: 'A research portal lists mixed internal HTML pages and downloadable PDF datasets.',
          gaps: [
            {
              id: 'g1',
              beforeText: 'pdfs = soup.select(\'a[href',
              afterText: '".pdf"]\')\n',
              correctAnswer: '$=',
              options: ['$=', '^=', '*=', '~='],
            },
            {
              id: 'g2',
              beforeText: 'external = soup.select(\'a[href',
              afterText: '"https://"]\')\n',
              correctAnswer: '^=',
              options: ['^=', '$=', '*=', '|='],
            },
            {
              id: 'g3',
              beforeText: 'first_title = soup.',
              afterText: '("h1.main-title")',
              correctAnswer: 'select_one',
              options: ['select_one', 'select_first', 'find_css', 'query_one'],
            },
          ],
          hints: [
            'In CSS selectors, `$=` means "ends with" (think regex `$`).',
            '`^=` means "starts with" (think regex `^`).',
            'BeautifulSoup’s single-element CSS selector method is `select_one`.',
          ],
          points: 15,
        },
        {
          id: 'd22-ex20',
          title: 'Trace select() vs. select_one() Return Types',
          type: 'explain-the-trace',
          tier: 'challenge',
          prompt: 'Explain why calling `.get_text()` directly on `soup.select("h2")` raises an `AttributeError`, whereas calling it on `soup.select_one("h2")` works when an `<h2>` exists.',
          contextScenario: 'A developer switches from `find("h2")` to `select("h2")` and hits `AttributeError: ResultSet object has no attribute \'get_text\'`.',
          traceStepCode: `# Broken:
# title = soup.select("h2").get_text(strip=True)
# Fixed:
# node = soup.select_one("h2")
# title = node.get_text(strip=True) if node else ""`,
          traceQuestion: 'What does `soup.select()` return compared to `soup.select_one()`?',
          modelAnswer: '`soup.select("h2")` always returns a `ResultSet` (a list-like collection of Tag objects), even when only one element matches, and lists do not have `.get_text()`. `soup.select_one("h2")` returns a single `Tag` object (or `None` if no match is found), so `.get_text(strip=True)` can be called directly after a `None` check.',
          markingCriteria: [
            { id: 'c1', label: 'Identifies select() as returning a list/ResultSet of Tags', points: 10 },
            { id: 'c2', label: 'Identifies select_one() as returning a single Tag or None', points: 5 },
            { id: 'c3', label: 'Notes checking for None before calling .get_text()', points: 5 },
          ],
          hints: [
            'How many elements can `select()` return?',
            'Does a Python list / `ResultSet` have a `.get_text()` method?',
            'What does `select_one()` return when nothing matches?',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day22-sub6',
      number: 6,
      title: 'Extracting Tables, Links (urljoin) & Cleaning Text',
      summary: 'Resolve relative URLs with urljoin(), normalize whitespace, and parse HTML tables into dicts.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Turning Messy HTML Into Clean Structured Records',
        paragraphs: [
          'Scraped HTML text often contains stray newlines, non-breaking spaces (`\\xa0`), and extra indentation. Calling **`tag.get_text(" ", strip=True)`** joins child text with single spaces and trims outer whitespace; follow with `re.sub(r"\\s+", " ", text)` for spotless strings.',
          'HTML links (`<a href="...">`) are frequently **relative** (e.g., `"/items/42"` or `"../next"`). Never concatenate strings like `base + href`—use **`urllib.parse.urljoin(base_url, href)`**, which handles leading slashes and `..` segments per RFC 3986.',
          'For HTML `<table>` elements, iterate over `<tr>` rows, extract `<th>` headers from the first row, and zip each subsequent row’s `<td>` cells into a Python `dict`.',
        ],
        keyTerms: [
          {
            term: 'urllib.parse.urljoin()',
            definition: 'Resolves a relative href against a page’s base URL into a valid absolute URL.',
          },
          {
            term: 'get_text(" ", strip=True)',
            definition: 'BeautifulSoup method that extracts and trims all nested text cleanly.',
          },
        ],
        bulletPoints: [
          'Always use `urljoin(base_url, href)` instead of `base_url + href`.',
          'Normalize whitespace and strip currency symbols before casting scraped prices to `float`/`int`.',
        ],
      },
      visualise: {
        type: 'dom-tree-sim',
        title: 'Text Cleaning & urljoin Link Resolution',
        badge: 'simulation',
        description: 'Inspect how raw HTML attributes and whitespace are normalized into clean Python values.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Resolving Relative Links & Cleaning Scraped Text',
          runMode: 'real',
          code: `import re
from urllib.parse import urljoin

base = "https://shop.example.com/books/page1.html"
rel_links = ["/books/101", "page2.html", "../about"]
abs_links = [urljoin(base, href) for href in rel_links]

raw_text = "  Python\\n   Mastery\\xa0Edition  "
clean_text = re.sub(r"\\s+", " ", raw_text).strip()

print("Absolute:", abs_links)
print("Clean:", repr(clean_text))`,
          expectedOutput: `Absolute: ['https://shop.example.com/books/101', 'https://shop.example.com/books/page2.html', 'https://shop.example.com/about']
Clean: 'Python Mastery Edition'`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 6,
          instruction: 'urljoin(base, href)',
          internalEffect: 'Resolves root-relative (/books/101), sibling (page2.html), and parent (../about) links accurately.',
        },
        {
          step: 2,
          codeLine: 9,
          instruction: 're.sub(r"\\s+", " ", raw_text).strip()',
          internalEffect: 'Collapses newlines, tabs, and non-breaking spaces (\\xa0) into single spaces.',
        },
      ],
      apply: {
        domain: 'Financial Data',
        contextTitle: 'Parsing Scraped HTML Table Rows into Dicts',
        scenario: 'Zip table headers with row cells into structured Python dictionaries.',
        code: `headers = ["Symbol", "Price"]
rows = [["AAPL", "$225.50"], ["MSFT", "$420.00"]]
records = [dict(zip(headers, r)) for r in rows]
print(records)`,
        outcome: "[{'Symbol': 'AAPL', 'Price': '$225.50'}, {'Symbol': 'MSFT', 'Price': '$420.00'}]",
      },
      commonMistakes: [
        {
          label: 'Joining Base URLs With + Instead of urljoin()',
          erroneousCode: `base = "https://site.com/catalog/"
href = "/item/5"
print(base + href)  # "https://site.com/catalog//item/5" — broken!`,
          errorMessage: 'Malformed URL with double slash and wrong path',
          explanation: 'A leading / in href means site root, not append; urljoin() handles this per RFC 3986.',
          correctedCode: `from urllib.parse import urljoin
print(urljoin(base, href))  # "https://site.com/item/5"`,
        },
      ],
      sourceNotes: 'Covers table extraction, urljoin, and text cleaning for Day 22.',
      practise: [
        {
          id: 'd22-ex21',
          title: 'Trace urllib.parse.urljoin Resolution',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'What URLs does `urljoin` produce for these two relative `href` values?',
          contextScenario: 'Resolving pagination and sibling links from `https://books.example.com/catalog/page1.html`.',
          starterCode: `from urllib.parse import urljoin

base = "https://books.example.com/catalog/page1.html"
print(urljoin(base, "page2.html"))
print(urljoin(base, "/about"))`,
          options: [
            {
              id: 'a',
              text: 'https://books.example.com/catalog/page2.html\nhttps://books.example.com/about',
              explanation: 'Correct! A relative filename replaces `page1.html` within `/catalog/`, while a root-relative `/about` resolves from the domain root.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'https://books.example.com/catalog/page1.htmlpage2.html\nhttps://books.example.com/catalog/about',
              explanation: '`urljoin` follows RFC 3986 path resolution rather than raw string concatenation.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'https://books.example.com/page2.html\nhttps://books.example.com/about',
              explanation: '`page2.html` without a leading `/` preserves the `/catalog/` directory.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'https://books.example.com/catalog/page2.html\nhttps://books.example.com/catalog/about',
              explanation: 'A leading `/` in `/about` anchors the path to the domain root.',
              isCorrect: false,
            },
          ],
          hints: [
            'Compare `"page2.html"` (relative to current directory) vs `"/about"` (relative to domain root).',
            '`urljoin` strips `page1.html` when joining `"page2.html"`.',
            'Leading `/` resets the path to the host root.',
          ],
          points: 10,
        },
        {
          id: 'd22-ex22',
          title: 'Scrape an HTML Table into Dictionaries',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Parse the HTML `<table>` rows into a list of `{"city": ..., "temp": ...}` dictionaries and print it.',
          contextScenario: 'Ingesting a daily regional weather summary published as an HTML table.',
          starterCode: `import xml.etree.ElementTree as ET

table_html = """
<table>
  <tr><th>City</th><th>Temp</th></tr>
  <tr><td>Oslo</td><td>4C</td></tr>
  <tr><td>Lisbon</td><td>18C</td></tr>
</table>
"""

root = ET.fromstring(table_html)
records = []
# TODO: skip header row and append {"city": ..., "temp": ...} for each data row
print(records)`,
          solutionCode: `import xml.etree.ElementTree as ET

table_html = """
<table>
  <tr><th>City</th><th>Temp</th></tr>
  <tr><td>Oslo</td><td>4C</td></tr>
  <tr><td>Lisbon</td><td>18C</td></tr>
</table>
"""

root = ET.fromstring(table_html)
records = []
for row in root.findall(".//tr"):
    cells = [td.text.strip() for td in row.findall("td") if td.text]
    if len(cells) == 2:
        records.append({"city": cells[0], "temp": cells[1]})
print(records)`,
          testCases: [
            {
              id: 'tc1',
              label: 'Produces list of two city-temp dicts',
              setup: '',
              expected: "[{'city': 'Oslo', 'temp': '4C'}, {'city': 'Lisbon', 'temp': '18C'}]",
              hidden: false,
            },
          ],
          hints: [
            'Loop over `root.findall(".//tr")`.',
            'Use `row.findall("td")` so the `<th>` header row yields an empty list.',
            'Check `if len(cells) == 2:` before appending the dictionary.',
          ],
          points: 15,
        },
        {
          id: 'd22-ex23',
          title: 'Fix Broken Relative URL Concatenation',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'Fix `resolve_links` by replacing manual string concatenation with `urllib.parse.urljoin`.',
          contextScenario: 'A scraper concatenates `base + href`, producing broken URLs like `https://docs.org/guide/intro.html/guide/setup.html`.',
          starterCode: `def resolve_links(base_url, hrefs):
    return [base_url + href for href in hrefs]

base = "https://docs.org/guide/intro.html"
print(resolve_links(base, ["setup.html", "/api"]))`,
          solutionCode: `from urllib.parse import urljoin

def resolve_links(base_url, hrefs):
    return [urljoin(base_url, href) for href in hrefs]

base = "https://docs.org/guide/intro.html"
print(resolve_links(base, ["setup.html", "/api"]))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Resolves both relative and root-relative URLs',
              setup: '',
              expected: "['https://docs.org/guide/setup.html', 'https://docs.org/api']",
              hidden: false,
            },
          ],
          hints: [
            'Import `urljoin` from `urllib.parse`.',
            'Replace `base_url + href` with `urljoin(base_url, href)`.',
            'Verify that `/api` resolves to `https://docs.org/api`.',
          ],
          points: 15,
        },
        {
          id: 'd22-ex24',
          title: 'Handling Irregular HTML Tables (colspan / th)',
          type: 'theory-reasoning',
          tier: 'challenge',
          prompt: 'Explain two pitfalls when scraping real-world HTML `<table>` elements that use `colspan` or mixed `<th>`/`<td>` cells, and how to defend against them.',
          contextScenario: 'A financial filings table has section-divider rows (`<td colspan="4">Q1 Summary</td>`) and row headers using `<th>` inside `<tbody>`.',
          modelAnswer: 'First, `row.findall("td")` alone misses row-label cells marked as `<th>`, and `colspan` rows have fewer cells than the header count, causing IndexError if accessed by fixed index (`cells[3]`). To defend against this, query both `th` and `td` cells when needed, check `len(cells) == expected_columns` to skip divider/summary rows, and normalize header names before zipping.',
          markingCriteria: [
            { id: 'c1', label: 'Identifies IndexError / column misalignment from colspan divider rows', points: 10 },
            { id: 'c2', label: 'Identifies missed data when <th> is used inside tbody rows', points: 5 },
            { id: 'c3', label: 'Proposes column-length validation and header normalization', points: 5 },
          ],
          hints: [
            'What happens if a divider row has only 1 `<td>` with `colspan="4"` and your code reads `cells[2]`?',
            'What if the first cell of every data row is a `<th>` instead of `<td>`?',
            'How can you safely skip non-data rows?',
          ],
          points: 20,
        },
        {
          id: 'd22-ex25',
          title: 'Normalize Messy Currency Text & Relative Links',
          type: 'write-code',
          tier: 'project',
          prompt: 'Parse the HTML product list, clean currency strings (e.g. `"  $1,249.50 \\n"` -> `1249.5`), resolve each `href` with `urljoin`, and print the JSON string.',
          contextScenario: 'Preparing raw scraped catalog items for insertion into a pricing database.',
          starterCode: `import json
import xml.etree.ElementTree as ET
from urllib.parse import urljoin

base = "https://shop.example.com/items/index.html"
html = """
<ul>
  <li><a href="lamp.html">Desk Lamp</a><span>  $49.00 \n</span></li>
  <li><a href="/deals/chair.html">Ergo Chair</a><span> $1,249.50 </span></li>
</ul>
"""

# TODO: parse, clean prices to float, resolve urls, print json.dumps(items)`,
          solutionCode: `import json
import xml.etree.ElementTree as ET
from urllib.parse import urljoin

base = "https://shop.example.com/items/index.html"
html = """
<ul>
  <li><a href="lamp.html">Desk Lamp</a><span>  $49.00 \n</span></li>
  <li><a href="/deals/chair.html">Ergo Chair</a><span> $1,249.50 </span></li>
</ul>
"""

root = ET.fromstring(html)
items = []
for li in root.findall(".//li"):
    a = li.find("a")
    span = li.find("span")
    price_str = span.text.strip().replace("$", "").replace(",", "")
    items.append({
        "title": a.text.strip(),
        "url": urljoin(base, a.get("href", "")),
        "price": float(price_str),
    })

print(json.dumps(items))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Outputs normalized JSON array',
              setup: '',
              expected: '[{"title": "Desk Lamp", "url": "https://shop.example.com/items/lamp.html", "price": 49.0}, {"title": "Ergo Chair", "url": "https://shop.example.com/deals/chair.html", "price": 1249.5}]',
              hidden: false,
            },
          ],
          hints: [
            'Use `.strip().replace("$", "").replace(",", "")` before `float(...)`.',
            'Use `urljoin(base, a.get("href", ""))` to resolve both `lamp.html` and `/deals/chair.html`.',
            'Serialize with `json.dumps(items)`.',
          ],
          points: 25,
        },
      ],
      assess: [],
    },
    {
      id: 'day22-sub7',
      number: 7,
      title: 'Pagination, Rate Limiting (time.sleep) & Exporting Results',
      summary: 'Follow "Next" page links safely with visited-URL deduplication, polite delays, and JSON export.',
      estimatedMinutes: 11,
      introduce: {
        headline: 'Scaling Scrapers Without Getting Blocked',
        paragraphs: [
          'Multi-page catalogs require **pagination**: follow `<a rel="next">` or `a.next` links until no next link exists (or a `max_pages` safety cap is reached). Always track a **`visited = set()`** of normalized URLs so circular links cannot trap your crawler in an infinite loop.',
          'Insert **`time.sleep(1.0)`** (or `random.uniform(1.0, 2.5)`) between requests so you never hammer a target server. If the server returns **`429 Too Many Requests`**, honor its `Retry-After` header with exponential backoff.',
          'Finally, persist scraped records cleanly to **JSON** (`json.dump(..., indent=2, ensure_ascii=False)`) or **CSV** (`csv.DictWriter` with `newline=""`) so downstream analysis doesn’t have to re-scrape the site.',
        ],
        keyTerms: [
          {
            term: 'Visited Set Deduplication',
            definition: 'Tracking already-fetched URLs in a Python set to prevent duplicate fetches and infinite loops.',
          },
          {
            term: 'Rate Limiting (time.sleep)',
            definition: 'Pausing between HTTP requests to respect server capacity and avoid 429/IP bans.',
          },
        ],
        bulletPoints: [
          'Always set a `max_pages` guard in pagination loops.',
          'Deduplicate URLs in a `set` before enqueueing.',
        ],
      },
      visualise: {
        type: 'scraping-ethics-sim',
        title: 'Rate Limiting, 429 Backoff & Pagination',
        badge: 'simulation',
        description: 'Inspect polite crawl delays, 429 Retry-After handling, and pagination.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Pagination Deduplication & JSON Export',
          runMode: 'real',
          code: `import json

pages = [
    {"url": "/p1", "next": "/p2", "items": ["A"]},
    {"url": "/p2", "next": "/p1", "items": ["B"]},  # Circular link!
]
page_map = {p["url"]: p for p in pages}

visited = set()
collected = []
cur = "/p1"
while cur and cur not in visited:
    visited.add(cur)
    collected.extend(page_map[cur]["items"])
    cur = page_map[cur]["next"]

print("Collected:", json.dumps(collected))`,
          expectedOutput: `Collected: ["A", "B"]`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 11,
          instruction: 'while cur and cur not in visited:',
          internalEffect: 'Stops immediately when /p2 points back to already-visited /p1.',
        },
      ],
      apply: {
        domain: 'Data Engineering',
        contextTitle: 'Persisting Scraped Records to JSON',
        scenario: 'Write scraped item dictionaries to /tmp/d22_scraped.json and read back count.',
        code: `import json

records = [{"title": "Book A", "price": 1200}, {"title": "Book B", "price": 850}]
with open("/tmp/d22_scraped.json", "w", encoding="utf-8") as f:
    json.dump(records, f, indent=2)

with open("/tmp/d22_scraped.json", "r", encoding="utf-8") as f:
    print("Saved records:", len(json.load(f)))`,
        outcome: 'Saved records: 2',
      },
      commonMistakes: [
        {
          label: 'Infinite Pagination Loop Without visited Set',
          erroneousCode: `# while next_url:
#     next_url = fetch_next(next_url)  # Loops forever if last page links to page 1!`,
          errorMessage: 'Infinite crawl loop and accidental server DoS',
          explanation: 'Maintain a visited = set() and a max_pages cap on every crawler loop.',
          correctedCode: `# while next_url and next_url not in visited and len(visited) < max_pages:`,
        },
      ],
      sourceNotes: 'Covers pagination, rate limiting, and JSON/CSV export for Day 22.',
      practise: [
        {
          id: 'd22-ex26',
          title: 'Responding to HTTP 429 Too Many Requests',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Your scraper receives HTTP `429 Too Many Requests` with header `Retry-After: 12`. What is the correct response?',
          contextScenario: 'A paginated directory API/HTML endpoint enforces a strict per-minute request budget.',
          options: [
            {
              id: 'a',
              text: 'Pause for at least 12 seconds (plus small jitter) before retrying, and increase your inter-request delay.',
              explanation: 'Correct! Honoring `Retry-After` and backing off prevents IP bans and respects server capacity.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'Immediately resend the request 5 times in a tight loop.',
              explanation: 'Immediate retries amplify load and usually extend the rate-limit window.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'Treat 429 as an empty page and save `[]` as the final dataset.',
              explanation: 'Silently treating 429 as empty data corrupts your dataset.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Remove the `User-Agent` header so the server cannot count your requests.',
              explanation: 'Rate limiting is typically keyed by IP address; removing `User-Agent` makes your bot look more suspicious.',
              isCorrect: false,
            },
          ],
          hints: [
            'What does the `Retry-After` HTTP response header communicate?',
            'Respect the server-specified cooldown before retrying.',
            'Adjust your crawler pace to avoid hitting 429 again.',
          ],
          points: 10,
        },
        {
          id: 'd22-ex27',
          title: 'Order a Polite Paginated Crawler Loop',
          type: 'order-the-lines',
          tier: 'standard',
          prompt: 'Arrange the lines to build a polite, bounded pagination loop with deduplication.',
          contextScenario: 'Crawling sequential catalog pages while preventing duplicate visits and server overload.',
          jumbledLines: [
            { id: 'l3', code: 'visited.add(url)', indent: 1 },
            { id: 'l1', code: 'while url and url not in visited and len(visited) < max_pages:', indent: 0 },
            { id: 'l4', code: 'html = fetch_page(url)', indent: 1 },
            { id: 'l2', code: 'if not rp.can_fetch(AGENT, url): break', indent: 1 },
            { id: 'l5', code: 'url = extract_next_url(html); time.sleep(1.0)', indent: 1 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4', 'l5'],
          hints: [
            'Begin with the bounded `while` condition checking `visited` and `max_pages`.',
            'Verify `rp.can_fetch(...)` before marking `visited` and fetching.',
            'Extract `next_url` and `time.sleep` after fetching the page.',
          ],
          points: 15,
        },
        {
          id: 'd22-ex28',
          title: 'Fix Infinite Pagination Cycle',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'Fix `crawl_pages` by adding a `visited` set and `max_pages=5` guard so cyclic links do not loop forever.',
          contextScenario: 'Page 3’s "Next" button mistakenly links back to Page 1, causing an infinite crawl.',
          starterCode: `SITE = {
    "/p1": "/p2",
    "/p2": "/p3",
    "/p3": "/p1",  # Cycle!
}

def crawl_pages(start):
    url = start
    order = []
    while url:
        order.append(url)
        url = SITE.get(url)
    return order

# print(crawl_pages("/p1"))`,
          solutionCode: `SITE = {
    "/p1": "/p2",
    "/p2": "/p3",
    "/p3": "/p1",  # Cycle!
}

def crawl_pages(start, max_pages=5):
    url = start
    visited = set()
    order = []
    while url and url not in visited and len(visited) < max_pages:
        visited.add(url)
        order.append(url)
        url = SITE.get(url)
    return order

print(crawl_pages("/p1"))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Terminates cleanly after visiting /p1, /p2, /p3',
              setup: '',
              expected: "['/p1', '/p2', '/p3']",
              hidden: false,
            },
          ],
          hints: [
            'Create `visited = set()` before the `while` loop.',
            'Guard the loop with `url not in visited and len(visited) < max_pages`.',
            'Add `url` to `visited` on each iteration.',
          ],
          points: 15,
        },
        {
          id: 'd22-ex29',
          title: 'Trace Cycle Detection in Paginated Crawlers',
          type: 'explain-the-trace',
          tier: 'challenge',
          prompt: 'Explain why checking `url not in visited` BEFORE fetching prevents both duplicate HTTP traffic and infinite loops on cyclic pagination.',
          contextScenario: 'A site’s pagination widget wraps around from the last page back to page 1.',
          traceStepCode: `visited = {"/p1", "/p2", "/p3"}
next_url = "/p1"
# Loop condition: while next_url and next_url not in visited:`,
          traceQuestion: 'What happens on the 4th iteration when `next_url` is `"/p1"`?',
          modelAnswer: 'Because `"/p1"` is already in `visited`, `next_url not in visited` evaluates to `False`. The `while` loop exits immediately before issuing a redundant 4th HTTP request, preventing both duplicate records and an infinite cycle.',
          markingCriteria: [
            { id: 'c1', label: 'Identifies that "/p1" is already in visited so the loop terminates', points: 10 },
            { id: 'c2', label: 'Explains that no redundant HTTP request is made on the cycle edge', points: 5 },
            { id: 'c3', label: 'Notes prevention of duplicate scraped records', points: 5 },
          ],
          hints: [
            'Evaluate `"/p1" not in {"/p1", "/p2", "/p3"}`.',
            'Does the loop body run when the `while` condition is `False`?',
            'What would happen if `visited` were checked only after `fetch()`?',
          ],
          points: 20,
        },
        {
          id: 'd22-ex30',
          title: 'Bounded Multi-Page HTML Scraper Simulator',
          type: 'write-code',
          tier: 'project',
          prompt: 'Implement `scrape_all(pages, start_url, max_pages=10)` to follow `<a class="next">` links, avoid cycles with `visited`, collect `<h2>` titles, and print the list.',
          contextScenario: 'End-to-end simulation of a paginated HTML scraper with cycle protection.',
          starterCode: `import xml.etree.ElementTree as ET
from urllib.parse import urljoin

PAGES = {
    "https://ex.com/p1": '<page><h2>Alpha</h2><a class="next" href="p2">Next</a></page>',
    "https://ex.com/p2": '<page><h2>Beta</h2><a class="next" href="p1">Wrap</a></page>',
}

def scrape_all(pages, start_url, max_pages=10):
    # TODO: traverse pages, collect h2.text, follow a[@class='next'], avoid cycles
    pass

print(scrape_all(PAGES, "https://ex.com/p1"))`,
          solutionCode: `import xml.etree.ElementTree as ET
from urllib.parse import urljoin

PAGES = {
    "https://ex.com/p1": '<page><h2>Alpha</h2><a class="next" href="p2">Next</a></page>',
    "https://ex.com/p2": '<page><h2>Beta</h2><a class="next" href="p1">Wrap</a></page>',
}

def scrape_all(pages, start_url, max_pages=10):
    url = start_url
    visited = set()
    titles = []
    while url and url not in visited and len(visited) < max_pages:
        visited.add(url)
        root = ET.fromstring(pages[url])
        h2 = root.find("h2")
        if h2 is not None and h2.text:
            titles.append(h2.text.strip())
        nxt = root.find(".//a[@class='next']")
        url = urljoin(url, nxt.get("href")) if nxt is not None and nxt.get("href") else None
    return titles

print(scrape_all(PAGES, "https://ex.com/p1"))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Collects Alpha and Beta without looping',
              setup: '',
              expected: "['Alpha', 'Beta']",
              hidden: false,
            },
          ],
          hints: [
            'Track `visited = set()` and loop while `url and url not in visited and len(visited) < max_pages`.',
            'Use `ET.fromstring(pages[url])` to extract `<h2>` and `<a class="next">`.',
            'Resolve the next `href` with `urljoin(url, nxt.get("href"))`.',
          ],
          points: 25,
        },
      ],
      assess: [],
    },
  ],
  realWorldLabs: [
    {
      id: 'day22-lab-1',
      title: 'Municipal Open-Data HTML Table Harvester',
      domain: 'Civic Data Engineering',
      description: 'Parse a municipal transit HTML table using xml.etree.ElementTree, skip header/divider rows, normalize numeric ridership strings, and compute total daily boardings.',
      starterCode: `import json
import xml.etree.ElementTree as ET

HTML_TABLE = """
<table id="transit-stats">
  <tr><th>Route</th><th>Zone</th><th>Boardings</th></tr>
  <tr><td colspan="3">Metro Bus Lines</td></tr>
  <tr><td>Line 12</td><td>North</td><td>1,420</td></tr>
  <tr><td>Line 45</td><td>Central</td><td>2,850</td></tr>
  <tr><td>Line 88</td><td>South</td><td>930</td></tr>
</table>
"""

# TODO: Extract valid 3-cell rows into records = [{"route": ..., "zone": ..., "boardings": int}]
# Compute total_boardings and print JSON summary: {"count": 3, "total": 5200}
`,
      targetOutput: '{"count": 3, "total": 5200}',
    },
    {
      id: 'day22-lab-2',
      title: 'Compliant Multi-Page Catalog Crawler & Link Resolver',
      domain: 'E-Commerce Intelligence',
      description: 'Combine RobotFileParser compliance, urljoin link resolution, visited deduplication, and HTML parsing to crawl allowed catalog pages while skipping disallowed admin paths.',
      starterCode: `from urllib.robotparser import RobotFileParser
from urllib.parse import urljoin
import xml.etree.ElementTree as ET

ROBOTS = ["User-agent: *", "Disallow: /admin/"]
PAGES = {
    "https://store.example.com/catalog": '<div class="p"><h2>Tea</h2><a href="p2">Next</a></div>',
    "https://store.example.com/p2": '<div class="p"><h2>Coffee</h2><a href="/admin/secret">Admin</a></div>',
    "https://store.example.com/admin/secret": '<div class="p"><h2>Hidden</h2></div>',
}

# TODO: Initialize RobotFileParser, crawl from https://store.example.com/catalog
# Only fetch URLs allowed by rp.can_fetch("CatalogBot", url)
# Print extracted product names list: ['Tea', 'Coffee']
`,
      targetOutput: "['Tea', 'Coffee']",
    },
  ],
  miniProject: {
    id: 'day22-project',
    title: 'Catalog Scraper & Structured JSON Exporter',
    brief: 'Build a complete, compliant multi-page HTML catalog scraper that checks robots.txt, resolves relative pagination links with urljoin, prevents infinite loops with a visited set, cleans currency strings, and exports normalized JSON.',
    requirements: [
      'Validate every target URL against urllib.robotparser.RobotFileParser before fetching.',
      'Resolve relative pagination links using urllib.parse.urljoin.',
      'Prevent duplicate visits and infinite cycles using a visited set and max_pages cap.',
      'Handle missing optional HTML elements (e.g., discount badges) gracefully without crashing.',
      'Clean whitespace and currency symbols into numeric floats and export valid JSON via json.dumps.',
    ],
    rubric: [
      { criterion: 'robots.txt compliance & bounded cycle-safe pagination', weight: 35 },
      { criterion: 'Resilient HTML parsing & optional field fallbacks', weight: 35 },
      { criterion: 'Text/currency normalization & clean JSON serialization', weight: 30 },
    ],
    starterCode: `import json
import xml.etree.ElementTree as ET
from urllib.parse import urljoin
from urllib.robotparser import RobotFileParser

ROBOTS_TXT = [
    "User-agent: *",
    "Disallow: /private/",
]

MOCK_WEB = {
    "https://books.local/page1": """
    <section>
      <article class="book"><h3>Python Core</h3><span class="price"> $29.50 </span><span class="badge">New</span></article>
      <a class="next" href="page2">Next</a>
    </section>
    """,
    "https://books.local/page2": """
    <section>
      <article class="book"><h3>Web Scraping</h3><span class="price"> $1,040.00 </span></article>
      <a class="next" href="/private/drafts">Drafts</a>
    </section>
    """,
}

# TODO: Build run_scraper(start_url, max_pages=5) and print json.dumps(results)
`,
  },
  dayQuiz: {
    title: 'Day 22 Mastery Checkpoint: Web Scraping',
    passingScorePercentage: 80,
    questions: [
      {
        id: 'd22-q1',
        scenario: 'You are tasked with collecting daily currency exchange rates from a central bank website that offers both an HTML table and a documented `/api/rates.json` endpoint.',
        question: 'Which approach should you choose first?',
        options: [
          {
            id: 'a',
            text: 'Use the official `/api/rates.json` endpoint.',
            explanation: 'Correct! Official APIs provide clean structured data, lower overhead, and explicit support.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Scrape the HTML table with regex so you do not need `json.loads`.',
            explanation: 'HTML + regex is far more brittle than an official JSON endpoint.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Launch a headless browser for every currency row.',
            explanation: 'Headless browsers are unnecessary and slow when a JSON API exists.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Ignore both and scrape third-party blogs instead.',
            explanation: 'Primary official APIs are always preferable.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd22-q2',
        scenario: 'A site’s `/robots.txt` contains `User-agent: *` followed by `Disallow: /checkout/`.',
        question: 'Which Python standard-library class checks whether your bot may fetch `/checkout/cart`?',
        options: [
          {
            id: 'a',
            text: '`urllib.robotparser.RobotFileParser` using `.can_fetch()`',
            explanation: 'Correct! `RobotFileParser.can_fetch(user_agent, url)` evaluates `robots.txt` rules.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: '`html.parser.HTMLParser` using `.feed()`',
            explanation: '`HTMLParser` parses HTML tags, not `robots.txt`.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: '`urllib.parse.urljoin` using `.resolve()`',
            explanation: '`urljoin` resolves relative URLs.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: '`json.JSONDecoder` using `.raw_decode()`',
            explanation: '`JSONDecoder` parses JSON text.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd22-q3',
        scenario: 'Your HTTP GET request hangs indefinitely when a remote server stalls before sending headers.',
        question: 'Which parameter prevents your scraper from hanging forever?',
        options: [
          {
            id: 'a',
            text: 'Passing `timeout=10` to `requests.get(url, timeout=10)`',
            explanation: 'Correct! Always specify a `timeout` on network requests.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Passing `allow_redirects=True`',
            explanation: 'Redirects do not bound socket wait time.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Calling `soup.prettify()`',
            explanation: '`prettify()` formats already-fetched HTML.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Omitting the `User-Agent` header',
            explanation: 'Omitting `User-Agent` does not prevent socket hangs.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd22-q4',
        scenario: 'You write `soup.find_all("div", class="card")` in Python.',
        question: 'Why does Python raise a `SyntaxError`?',
        options: [
          {
            id: 'a',
            text: '`class` is a reserved Python keyword; BeautifulSoup requires `class_="card"`.',
            explanation: 'Correct! `class_` avoids the Python keyword collision.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: '`find_all` only accepts CSS selectors.',
            explanation: '`find_all` accepts tag names and keyword/dict attribute filters.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'HTML `<div>` elements cannot have classes.',
            explanation: 'HTML `<div>` elements routinely use `class` attributes.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: '`class` must be passed as an integer.',
            explanation: 'Class names are strings.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd22-q5',
        scenario: 'An optional `<span class="discount">` tag is missing on half of the product cards in a page.',
        question: 'What happens if you run `card.find("span", class_="discount").get_text()` without checking for `None`?',
        options: [
          {
            id: 'a',
            text: 'It raises `AttributeError: \'NoneType\' object has no attribute \'get_text\'`.',
            explanation: 'Correct! `.find()` returns `None` when no element matches.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'It returns an empty string `""` automatically.',
            explanation: '`None` does not have `.get_text()`.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'It returns the parent card’s text instead.',
            explanation: 'It raises `AttributeError` on `None`.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'It skips the current loop iteration automatically.',
            explanation: 'Python raises an unhandled exception unless guarded.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd22-q6',
        scenario: 'You want to match ONLY `<li>` items that are immediate children of `ul.menu`, ignoring nested sub-lists.',
        question: 'Which CSS selector should you pass to `soup.select(...)`?',
        options: [
          {
            id: 'a',
            text: '`ul.menu > li`',
            explanation: 'Correct! The `>` child combinator selects only direct children.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: '`ul.menu li`',
            explanation: 'The space combinator matches descendants at any depth.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: '`ul#menu + li`',
            explanation: '`+` matches an adjacent sibling, not a child.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: '`li[parent="menu"]`',
            explanation: '`parent` is not a standard HTML attribute.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd22-q7',
        scenario: 'You are on `https://archive.org/2026/index.html` and scrape `<a href="/datasets/q1.csv">`.',
        question: 'What does `urllib.parse.urljoin("https://archive.org/2026/index.html", "/datasets/q1.csv")` return?',
        options: [
          {
            id: 'a',
            text: '`https://archive.org/datasets/q1.csv`',
            explanation: 'Correct! A leading `/` resolves from the domain root.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: '`https://archive.org/2026/datasets/q1.csv`',
            explanation: 'Only a relative path without a leading `/` stays inside `/2026/`.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: '`https://archive.org/2026/index.html/datasets/q1.csv`',
            explanation: '`urljoin` never appends onto the filename.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: '`/datasets/q1.csv`',
            explanation: '`urljoin` produces a full absolute URL.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd22-q8',
        scenario: 'A scraper calls `soup.select("h1.title").get_text(strip=True)` and crashes.',
        question: 'Why did `.get_text()` fail here?',
        options: [
          {
            id: 'a',
            text: '`select()` returns a list (`ResultSet`), whereas `select_one()` returns a single `Tag` (or `None`).',
            explanation: 'Correct! Use `select_one()` (with a `None` check) to call `.get_text()` on a single element.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: '`get_text()` is deprecated in BeautifulSoup 4.',
            explanation: '`get_text()` is standard on `Tag` objects.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'CSS selectors cannot match `<h1>` tags.',
            explanation: 'CSS selectors match any valid HTML tag.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: '`strip=True` is only valid on `find_all()`.',
            explanation: '`strip=True` is a valid argument to `Tag.get_text()`.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd22-q9',
        scenario: 'Your paginated scraper discovers that page 10’s "Next" link points back to page 1.',
        question: 'Which two safeguards prevent an infinite crawl loop?',
        options: [
          {
            id: 'a',
            text: 'Track crawled URLs in a `visited = set()` and enforce a `max_pages` cap.',
            explanation: 'Correct! Both `url not in visited` and `len(visited) < max_pages` guarantee termination.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Use `time.sleep(0.1)` without tracking visited URLs.',
            explanation: 'Sleeping slows down the infinite loop without stopping it.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Disable `raise_for_status()` on every request.',
            explanation: 'Status checks do not detect URL cycles.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Sort the HTML tags alphabetically before parsing.',
            explanation: 'Tag sorting has no effect on pagination cycles.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd22-q10',
        scenario: 'Your scraper receives HTTP `429 Too Many Requests` with header `Retry-After: 15`.',
        question: 'What is the responsible engineering action?',
        options: [
          {
            id: 'a',
            text: 'Wait at least 15 seconds before retrying and increase your inter-request delay.',
            explanation: 'Correct! Honoring `Retry-After` and backing off keeps your scraper polite and avoids IP bans.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Open 10 parallel threads to finish before the ban takes effect.',
            explanation: 'Parallelizing after a 429 violates rate limits and triggers bans.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Parse the 429 response body as if it were product data.',
            explanation: 'The 429 body is an error message, not data.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Switch the request method from `GET` to `DELETE`.',
            explanation: '`DELETE` is not for reading pages.',
            isCorrect: false,
          },
        ],
      },
    ],
  },
  cheatSheet: [
    {
      category: 'Scraping Ethics & robots.txt',
      syntax: 'RobotFileParser().can_fetch(agent, url)',
      description: 'Check official APIs/feeds first, then parse /robots.txt with urllib.robotparser before queueing URLs.',
      example: `from urllib.robotparser import RobotFileParser
rp = RobotFileParser()
rp.parse(["User-agent: *", "Disallow: /admin/"])
allowed = rp.can_fetch("EduBot", "https://site.com/catalog")`,
    },
    {
      category: 'Safe HTTP Fetching & Headers',
      syntax: 'requests.get(url, headers=..., timeout=10)',
      description: 'Always identify your bot with a descriptive User-Agent, set a socket timeout, and validate status codes.',
      example: `headers = {"User-Agent": "ResearchBot/1.0 (+mailto:team@org.edu)"}
resp = requests.get(url, headers=headers, timeout=10)
resp.raise_for_status()`,
    },
    {
      category: 'Encoding & Text Normalization',
      syntax: 'resp.encoding = resp.apparent_encoding',
      description: 'Override ISO-8859-1 fallback when Content-Type lacks charset=utf-8, and strip whitespace from extracted text.',
      example: `resp.encoding = resp.apparent_encoding
clean_price = float(raw_price.strip().replace("$", "").replace(",", ""))`,
    },
    {
      category: 'Stdlib HTMLParser & ElementTree',
      syntax: 'HTMLParser.handle_starttag(tag, attrs)',
      description: 'Use html.parser.HTMLParser for streaming tag/attribute extraction or xml.etree.ElementTree for well-formed fragments.',
      example: `from html.parser import HTMLParser
class Links(HTMLParser):
    def handle_starttag(self, tag, attrs):
        if tag == "a": self.hrefs.append(dict(attrs).get("href"))`,
    },
    {
      category: 'BeautifulSoup DOM Parsing',
      syntax: 'BeautifulSoup(html, "html.parser")',
      description: 'Parse real-world HTML into a navigable DOM tree with built-in tolerance for unclosed tags.',
      example: `from bs4 import BeautifulSoup
soup = BeautifulSoup(html, "html.parser")
title = soup.title.get_text(strip=True)`,
    },
    {
      category: 'Tag & Attribute Lookup (find / find_all)',
      syntax: 'soup.find("span", class_="price")',
      description: 'Use class_ (trailing underscore) to avoid Python keyword collision; guard find() against None before reading .text.',
      example: `badge = card.find("span", class_="badge")
label = badge.get_text(strip=True) if badge else "Regular"`,
    },
    {
      category: 'CSS Selectors (select & select_one)',
      syntax: 'soup.select("div.card > a[href^=\'https://\']")',
      description: 'Use > for direct children, space for descendants, ^= for prefix, $= for suffix; select_one returns Tag | None.',
      example: `links = soup.select('#sidebar a[href$=".pdf"]')
first_h1 = soup.select_one("main > h1")`,
    },
    {
      category: 'HTML Table Extraction & Guards',
      syntax: 'for row in table.findall(".//tr"):',
      description: 'Separate <th> headers from <td> data cells and validate len(cells) to skip colspan divider rows safely.',
      example: `for row in root.findall(".//tr"):
    cells = [td.text.strip() for td in row.findall("td") if td.text]
    if len(cells) == 3: records.append(dict(zip(headers, cells)))`,
    },
    {
      category: 'Relative URL Resolution (urljoin)',
      syntax: 'urllib.parse.urljoin(base_url, href)',
      description: 'Resolve relative paths ("page2.html") and root-relative paths ("/about") reliably instead of string concatenation.',
      example: `from urllib.parse import urljoin
abs_url = urljoin("https://books.example.com/catalog/p1", "../about")`,
    },
    {
      category: 'Cycle-Safe Pagination & Rate Limiting',
      syntax: 'while url and url not in visited and len(visited) < max_pages:',
      description: 'Track visited URLs in a set, cap total pages, honor Retry-After on HTTP 429, and sleep between requests.',
      example: `visited = set()
while url and url not in visited and len(visited) < 20:
    visited.add(url); time.sleep(1.0)
    url = next_page_url(url)`,
    },
  ],
  sourceNotes: [
    'Curriculum reference: https://github.com/Asabeneh/30-Days-Of-Python/tree/master/22_Day_Web_scraping',
  ],
};
