/**
 * Day 20: Python Package Manager (Intermediate Python)
 * Part A (Learn) conforming to Sections 10, 13.2, and 14 of the Master Specification.
 * Includes:
 *  - 6 Detailed Subtopics following the 10-step pedagogical structure
 *  - 3 Signature Simulations: pip-lifecycle-sim, semver-resolver-sim, package-anatomy-sim
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_20_MODULE: DayModule = {
  schemaVersion: 1,
  number: 20,
  title: 'Python Package Manager',
  level: 'intermediate',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/20_Day_Python_package_manager',
  estimatedMinutes: 50,
  prerequisites: [12],
  objectives: [
    'Install, upgrade, inspect, and uninstall third-party PyPI packages using python -m pip',
    'Isolate project dependencies cleanly using virtual environments (python -m venv)',
    'Read and apply Semantic Versioning (MAJOR.MINOR.PATCH) and version specifiers (==, >=, ~=)',
    'Generate and consume pinned dependency manifests with pip freeze and requirements.txt',
    'Inspect installed package metadata and versions at runtime with pip show and importlib.metadata',
    'Consume external HTTP/data packages (such as requests) safely with timeouts and ImportError handling',
  ],
  subtopics: [
    {
      id: 'day20-sub1',
      number: 1,
      title: 'PyPI & Installing Packages with pip (install, uninstall, list, --upgrade)',
      summary: 'Use PyPI and python -m pip to install, upgrade, list, and remove third-party libraries.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'The Python Package Index (PyPI) & pip',
        paragraphs: [
          'Python’s standard library is rich, but real-world projects rely on hundreds of thousands of community packages hosted on **PyPI** (the Python Package Index, `pypi.org`). **`pip`** is Python’s built-in package installer that downloads wheels (`.whl`) or source distributions from PyPI and resolves their transitive dependencies.',
          'Always prefer **`python -m pip install <package>`** over bare `pip install <package>`. Running `pip` as a module via `python -m` guarantees you install into the exact Python interpreter you are running.',
          'Key lifecycle commands include **`pip list`** (view installed packages), **`pip install --upgrade pkg`** (update an already-installed package), and **`pip uninstall pkg`** (remove a package without automatically removing shared transitive dependencies).',
        ],
        keyTerms: [
          {
            term: 'PyPI (pypi.org)',
            definition: 'The official central repository for third-party Python packages and wheels.',
          },
          {
            term: 'python -m pip',
            definition: 'Runs pip bound to a specific Python interpreter, preventing cross-environment install mismatches.',
          },
        ],
        bulletPoints: [
          '`pip install pkg` does nothing if `pkg` is already installed unless you pass `--upgrade` (`-U`).',
          'Check `pip list --outdated` to audit stale packages before upgrading.',
        ],
      },
      visualise: {
        type: 'pip-lifecycle-sim',
        title: 'PyPI & pip Command Lifecycle Inspector',
        badge: 'simulation',
        description: 'Step through pip install, upgrade, uninstall, show, and freeze commands.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Inspecting Python Runtime & Active Package Search Paths',
          runMode: 'real',
          code: `import sys
import importlib.util

print("Python:", sys.version.split()[0])
for mod in ["json", "csv", "pathlib", "nonexistent_pkg"]:
    found = importlib.util.find_spec(mod) is not None
    print(f"{mod}: installed={found}")`,
          expectedOutput: `Python: 3.12.7
json: installed=True
csv: installed=True
pathlib: installed=True
nonexistent_pkg: installed=False`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 5,
          instruction: 'importlib.util.find_spec(mod) is not None',
          internalEffect: 'Probes sys.path and site-packages without importing the module, returning True if available.',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 'print(f"{mod}: installed={found}")',
          internalEffect: 'Reports standard-library modules as True and missing third-party packages as False.',
        },
      ],
      apply: {
        domain: 'Developer Tooling',
        contextTitle: 'Building a Pre-Flight Dependency Checker',
        scenario: 'Verify required packages are importable before starting a CLI workflow.',
        code: `import importlib.util

required = ["json", "csv", "sqlite3"]
missing = [pkg for pkg in required if importlib.util.find_spec(pkg) is None]
print("Missing:", missing)`,
        outcome: 'Missing: []',
      },
      commonMistakes: [
        {
          label: 'Installing Into Wrong Python With Bare pip',
          erroneousCode: `# System pip installs to Python 3.10 while project runs Python 3.12
# pip install requests`,
          errorMessage: 'ModuleNotFoundError: No module named "requests" when running python3.12 app.py',
          explanation: 'Bare `pip` may point to a different Python binary than `python`. Always run `python -m pip`.',
          correctedCode: `python -m pip install requests`,
        },
      ],
      sourceNotes: 'Covers PyPI and core pip CLI commands for Day 20.',
      practise: [
        {
          id: 'd20-s1-ex1',
          title: 'Scenario: Multi-Python Workstation Mismatch',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Multi-Python Workstation',
          prompt: 'You run `pip install httpx` in your terminal and it succeeds, yet running `python3.12 app.py` raises `ModuleNotFoundError: No module named "httpx"`. What is the most reliable fix?',
          options: [
            { id: 'opt-1', text: 'Run `python3.12 -m pip install httpx` so pip installs into the exact Python 3.12 interpreter.', explanation: 'Correct! Bare `pip` may belong to a different Python version on your PATH.', isCorrect: true },
            { id: 'opt-2', text: 'Reinstall Python 3.12 from scratch.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'Rename `app.py` to `httpx.py`.', explanation: 'Incorrect—that would shadow the module!', isCorrect: false },
            { id: 'opt-4', text: 'Add `encoding="utf-8"` to the import statement.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Could `pip` and `python3.12` point to different Python installations?',
            'How do you bind pip to a specific Python executable?',
            'python3.12 -m pip install httpx.',
          ],
        },
        {
          id: 'd20-s1-ex2',
          title: 'Fill the Gaps: Pre-Flight Module Probe',
          type: 'fill-the-gaps',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Pre-Flight Dependency Check',
          prompt: 'Complete the code to check if `"json"` is importable without importing it.',
          gaps: [
            { id: 'g-1', beforeText: 'import importlib.', afterText: '', correctAnswer: 'util', options: ['util', 'metadata', 'abc', 'machinery'] },
            { id: 'g-2', beforeText: 'available = importlib.util.', afterText: '("json") is not None', correctAnswer: 'find_spec', options: ['find_spec', 'version', 'reload', 'import_module'] },
          ],
          hints: [
            'Which submodule of importlib contains find_spec()?',
            'find_spec() returns None if the module cannot be found.',
            'util and find_spec.',
          ],
        },
        {
          id: 'd20-s1-ex3',
          title: 'Write Code: Required Dependency Gate',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          contextScenario: 'CLI Startup Checker',
          prompt: 'Use `importlib.util.find_spec` to check `["csv", "json", "fake_pkg"]` and print the list of missing packages (`[\'fake_pkg\']`).',
          starterCode: `import importlib.util

required = ["csv", "json", "fake_pkg"]
# Build and print list of missing package names
`,
          solutionCode: `import importlib.util

required = ["csv", "json", "fake_pkg"]
missing = [pkg for pkg in required if importlib.util.find_spec(pkg) is None]
print(missing)`,
          testCases: [
            { id: 'tc-1', label: "Prints ['fake_pkg']", setup: '', expected: "['fake_pkg']", hidden: false },
          ],
          hints: [
            'Check importlib.util.find_spec(pkg) is None.',
            'Use a list comprehension over required.',
            "Prints ['fake_pkg'].",
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day20-sub2',
      number: 2,
      title: 'Virtual Environments (python -m venv) & Dependency Isolation',
      summary: 'Isolate per-project dependencies using virtual environments so projects never collide.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Why Global site-packages Breaks Real Projects',
        paragraphs: [
          'Suppose Project A requires `django==4.2` and Project B requires `django==5.1`. If both install into your global Python `site-packages`, whichever you install second overwrites the first and breaks the other project!',
          'A **virtual environment** (`python -m venv .venv`) creates a lightweight, isolated directory inside your project containing its own `python` executable and `site-packages`. Once activated (`source .venv/bin/activate` on macOS/Linux, or `.venv\\Scripts\\activate` on Windows), `python` and `pip` operate strictly inside `.venv`.',
          'Never commit `.venv/` to Git—add `.venv/` to `.gitignore` and commit `requirements.txt` or `pyproject.toml` instead so collaborators can recreate the environment cleanly.',
        ],
        keyTerms: [
          {
            term: 'python -m venv .venv',
            definition: 'Creates an isolated virtual environment directory named .venv in the current project.',
          },
          {
            term: 'sys.prefix vs sys.base_prefix',
            definition: 'Inside an active venv, sys.prefix points to .venv while sys.base_prefix points to the system Python.',
          },
        ],
        bulletPoints: [
          'Always add `.venv/` to `.gitignore`—never commit thousands of third-party files to source control.',
          'You can detect an active venv in Python with `sys.prefix != sys.base_prefix`.',
        ],
      },
      visualise: {
        type: 'pip-lifecycle-sim',
        title: 'Virtual Environment Isolation Visualizer',
        badge: 'simulation',
        description: 'Inspect how python -m venv .venv isolates site-packages from global Python.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Detecting Virtual Environment Isolation via sys.prefix',
          runMode: 'real',
          code: `import sys

in_venv = sys.prefix != sys.base_prefix
print("In virtual env?", in_venv)
print("Prefix matches base?", sys.prefix == sys.base_prefix)`,
          expectedOutput: `In virtual env? False
Prefix matches base? True`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'in_venv = sys.prefix != sys.base_prefix',
          internalEffect: 'Compares active environment prefix against the base Python installation prefix.',
        },
      ],
      apply: {
        domain: 'CI/CD & DevOps',
        contextTitle: 'Validating Environment Activation in Setup Scripts',
        scenario: 'Warn developers if they run a setup script outside an active virtual environment.',
        code: `import sys

def env_label() -> str:
    return "isolated-venv" if sys.prefix != sys.base_prefix else "global-runtime"

print("Mode:", env_label())`,
        outcome: 'Mode: global-runtime',
      },
      commonMistakes: [
        {
          label: 'Committing .venv/ to Git Repository',
          erroneousCode: `# git add .venv/  # Commits OS-specific binaries & thousands of files!`,
          errorMessage: 'Broken cross-platform paths and bloated Git history',
          explanation: 'Virtual environments contain OS-specific symlinks/binaries. Ignore .venv/ and share requirements.txt instead.',
          correctedCode: `# Add ".venv/" to .gitignore and share requirements.txt`,
        },
      ],
      sourceNotes: 'Covers python -m venv and isolation mechanics for Day 20.',
      practise: [
        {
          id: 'd20-s2-ex1',
          title: 'Theory: Why Virtual Environments Prevent Dependency Clashes',
          type: 'theory-reasoning',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Microservice Dependency Clash',
          prompt: 'Service A requires `pydantic==1.10` while Service B requires `pydantic==2.8` on the same machine. Why does a single global `site-packages` fail here?',
          options: [
            { id: 'opt-1', text: 'Global site-packages can only hold one version of `pydantic` at a time; separate `.venv` directories give each service isolated dependencies.', explanation: 'Correct!', isCorrect: true },
            { id: 'opt-2', text: 'PyPI blocks downloading two versions of the same package.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'Python 3.12 cannot import pydantic v1.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'Virtual environments encrypt `site-packages`.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Can one site-packages folder have two different versions of the same package name?',
            'What does python -m venv .venv create for each project?',
            'Isolated site-packages per project.',
          ],
        },
        {
          id: 'd20-s2-ex2',
          title: 'Predict Output: Detecting Virtual Environment State',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          contextScenario: 'Environment Guard Script',
          prompt: 'When `sys.prefix` and `sys.base_prefix` are equal, what does this code print?\n```python\nimport sys\nis_isolated = sys.prefix != sys.base_prefix\nprint("isolated:", is_isolated)\n```',
          options: [
            { id: 'opt-1', text: 'isolated: False', explanation: 'Correct! Equal prefixes mean no virtual environment is active.', isCorrect: true },
            { id: 'opt-2', text: 'isolated: True', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'Raises AttributeError', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'isolated: None', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'If sys.prefix == sys.base_prefix, what is sys.prefix != sys.base_prefix?',
            'False.',
          ],
        },
        {
          id: 'd20-s2-ex3',
          title: 'Order the Lines: Clean Project Bootstrap Workflow',
          type: 'order-the-lines',
          tier: 'standard',
          points: 15,
          contextScenario: 'Onboarding New Developer',
          prompt: 'Arrange the terminal commands in the proper order to bootstrap a cloned Python project.',
          jumbledLines: [
            { id: 'l3', code: 'python -m pip install -r requirements.txt', indent: 0 },
            { id: 'l1', code: 'python -m venv .venv', indent: 0 },
            { id: 'l4', code: 'python app.py', indent: 0 },
            { id: 'l2', code: 'source .venv/bin/activate', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: [
            'Create .venv first.',
            'Activate .venv before installing dependencies.',
            'Install requirements.txt, then run app.py.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day20-sub3',
      number: 3,
      title: 'Semantic Versioning (MAJOR.MINOR.PATCH) & Version Specifiers',
      summary: 'Interpret SemVer numbers and write safe pip version constraints (==, >=, ~=, <).',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Reading Version Numbers & Specifiers',
        paragraphs: [
          'Most PyPI packages follow **Semantic Versioning (SemVer)**: **`MAJOR.MINOR.PATCH`** (for example, `2.31.4`). **MAJOR** increments for breaking API changes, **MINOR** increments for backward-compatible new features, and **PATCH** increments for backward-compatible bug fixes.',
          '`pip` supports expressive version specifiers: **`==2.31.4`** (exact pin), **`>=2.30.0,<3.0.0`** (range blocking breaking MAJOR 3), and **`~=2.31.4`** (compatible release—equivalent to `>=2.31.4, ==2.31.*`, allowing patch updates only).',
          'Avoid leaving production dependencies completely unpinned (just `requests`) because a future MAJOR release could break your code overnight.',
        ],
        keyTerms: [
          {
            term: 'SemVer (MAJOR.MINOR.PATCH)',
            definition: 'Versioning scheme where MAJOR=breaking, MINOR=features, PATCH=bugfixes.',
          },
          {
            term: '~= (Compatible Release)',
            definition: 'Allows increments in the last specified digit only (e.g., ~=2.31.0 allows 2.31.x, not 2.32.0).',
          },
        ],
        bulletPoints: [
          'Never compare version strings alphabetically (`"2.10.0" < "2.9.0"` is `True` lexicographically!). Parse into integer tuples first.',
          'Use `~=X.Y.Z` for libraries/apps wanting safe patch updates without minor/major surprises.',
        ],
      },
      visualise: {
        type: 'semver-resolver-sim',
        title: 'SemVer & pip Specifier Resolver',
        badge: 'simulation',
        description: 'Compare exact pinning (==), compatible release (~=), and bounded ranges (>=,<).',
        initialConfig: {},
      },
      code: [
        {
          title: 'Comparing SemVer Versions Correctly as Integer Tuples',
          runMode: 'real',
          code: `def parse_ver(v: str) -> tuple[int, ...]:
    return tuple(int(part) for part in v.split("."))

print("String compare '2.10.0' > '2.9.0':", "2.10.0" > "2.9.0")
print("Tuple compare 2.10.0 > 2.9.0:", parse_ver("2.10.0") > parse_ver("2.9.0"))`,
          expectedOutput: `String compare '2.10.0' > '2.9.0': False
Tuple compare 2.10.0 > 2.9.0: True`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'tuple(int(part) for part in v.split("."))',
          internalEffect: 'Converts "2.10.0" into (2, 10, 0) so 10 > 9 compares numerically instead of alphabetically.',
        },
      ],
      apply: {
        domain: 'Release Engineering',
        contextTitle: 'Filtering Compatible Patch Releases (~=2.31.0)',
        scenario: 'Filter candidate PyPI versions matching ~=2.31.0 (>=2.31.0 and <2.32.0).',
        code: `def parse_ver(v: str) -> tuple[int, ...]:
    return tuple(int(p) for p in v.split("."))

candidates = ["2.30.9", "2.31.0", "2.31.5", "2.32.0", "3.0.0"]
compat = [v for v in candidates if (2, 31, 0) <= parse_ver(v) < (2, 32, 0)]
print("Compatible:", compat)`,
        outcome: "Compatible: ['2.31.0', '2.31.5']",
      },
      commonMistakes: [
        {
          label: 'Comparing Version Strings Lexicographically',
          erroneousCode: `print("1.10.0" >= "1.2.0")  # False because '1' < '2'!`,
          errorMessage: 'Logic bug: string comparison treats "10" as smaller than "2"',
          explanation: 'Always split on "." and convert segments to int tuples before comparing versions.',
          correctedCode: `print(tuple(map(int, "1.10.0".split("."))) >= tuple(map(int, "1.2.0".split("."))))`,
        },
      ],
      sourceNotes: 'Covers SemVer and version specifiers for Day 20.',
      practise: [
        {
          id: 'd20-s3-ex1',
          title: 'Explain the Trace: Why "2.10.0" > "2.9.0" Is False',
          type: 'explain-the-trace',
          tier: 'standard',
          points: 15,
          contextScenario: 'Version String Comparison Bug',
          prompt: 'A deployment check runs `"2.10.0" > "2.9.0"` and gets `False`, blocking a newer release. Why?',
          options: [
            { id: 'opt-1', text: 'Python compares strings lexicographically character-by-character, and "1" < "9" at index 2.', explanation: 'Correct! Convert version parts to integer tuples like (2, 10, 0) > (2, 9, 0).', isCorrect: true },
            { id: 'opt-2', text: 'Python treats "." as a decimal point.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'SemVer forbids double-digit minor versions.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'Strings cannot be compared with >.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'At index 0..1 both strings are "2.".',
            'At index 2, Python compares character "1" vs "9".',
            'Lexicographical string comparison.',
          ],
        },
        {
          id: 'd20-s3-ex2',
          title: 'Fix the Bug: SemVer Tuple Comparison',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 15,
          contextScenario: 'Release Gate Version Check',
          prompt: 'Fix `parse_ver` so it returns a tuple of integers and `parse_ver("2.10.0") > parse_ver("2.9.0")` prints `True`.',
          starterCode: `def parse_ver(v: str):
    return tuple(v.split("."))

print(parse_ver("2.10.0") > parse_ver("2.9.0"))`,
          solutionCode: `def parse_ver(v: str):
    return tuple(int(p) for p in v.split("."))

print(parse_ver("2.10.0") > parse_ver("2.9.0"))`,
          testCases: [
            { id: 'tc-1', label: 'Prints True', setup: '', expected: 'True', hidden: false },
          ],
          hints: [
            'v.split(".") returns strings, not ints.',
            'Convert each segment with int(p).',
            'Prints True.',
          ],
        },
        {
          id: 'd20-s3-ex3',
          title: 'Write Code: Compatible Release Filter (~=2.4.0)',
          type: 'write-code',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Package Resolver Simulation',
          prompt: 'Filter `candidates = ["2.3.9", "2.4.0", "2.4.3", "2.5.0", "3.0.0"]` to versions matching `~=2.4.0` (`>= (2, 4, 0)` and `< (2, 5, 0)`) and print the list.',
          starterCode: `candidates = ["2.3.9", "2.4.0", "2.4.3", "2.5.0", "3.0.0"]
# Filter to versions matching ~=2.4.0 and print
`,
          solutionCode: `candidates = ["2.3.9", "2.4.0", "2.4.3", "2.5.0", "3.0.0"]
parse = lambda v: tuple(int(x) for x in v.split("."))
matched = [v for v in candidates if (2, 4, 0) <= parse(v) < (2, 5, 0)]
print(matched)`,
          testCases: [
            { id: 'tc-1', label: "Prints ['2.4.0', '2.4.3']", setup: '', expected: "['2.4.0', '2.4.3']", hidden: false },
          ],
          hints: [
            'Convert each version string to a 3-int tuple.',
            'Check (2, 4, 0) <= parse(v) < (2, 5, 0).',
            "Prints ['2.4.0', '2.4.3'].",
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day20-sub4',
      number: 4,
      title: 'Reproducible Builds with requirements.txt & pip freeze',
      summary: 'Lock and restore exact project dependencies across machines using pip freeze and requirements.txt.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Locking Dependencies for Teammates & Production',
        paragraphs: [
          'When your app works on your laptop, how do you guarantee it installs the exact same package versions on a teammate’s machine or a cloud server? You export your environment with **`python -m pip freeze > requirements.txt`**.',
          'Teammates then recreate the environment in two commands: `python -m venv .venv` followed by **`python -m pip install -r requirements.txt`**.',
          'Note that `pip freeze` lists **every** installed package (including transitive dependencies), whereas **`pyproject.toml`** lists only your **direct** top-level dependencies with clean ranges.',
        ],
        keyTerms: [
          {
            term: 'pip freeze > requirements.txt',
            definition: 'Snapshots all installed packages and exact versions in == format.',
          },
          {
            term: 'pip install -r requirements.txt',
            definition: 'Installs every dependency listed in a requirements manifest file.',
          },
        ],
        bulletPoints: [
          'Run `pip freeze` inside an activated `.venv`—otherwise it dumps every global package on your machine!',
          'Lines starting with `#` in `requirements.txt` are comments and ignored by `pip`.',
        ],
      },
      visualise: {
        type: 'semver-resolver-sim',
        title: 'requirements.txt Pinning vs Ranges',
        badge: 'simulation',
        description: 'Inspect how pinned == entries in requirements.txt guarantee deterministic builds.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Parsing a requirements.txt Manifest in Python',
          runMode: 'real',
          code: `import io

req_file = io.StringIO("""# Core dependencies
requests==2.32.3

pydantic>=2.7,<3.0
""")

pkgs = [
    line.strip()
    for line in req_file
    if line.strip() and not line.strip().startswith("#")
]
print("Parsed requirements:", pkgs)`,
          expectedOutput: `Parsed requirements: ['requests==2.32.3', 'pydantic>=2.7,<3.0']`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 11,
          instruction: 'if line.strip() and not line.strip().startswith("#")',
          internalEffect: 'Skips blank lines and comment lines just as pip does when reading requirements.txt.',
        },
      ],
      apply: {
        domain: 'Dependency Auditing',
        contextTitle: 'Detecting Unpinned Packages in requirements.txt',
        scenario: 'Flag any requirement line that lacks an exact == pin.',
        code: `reqs = ["requests==2.32.3", "flask", "rich>=13.0"]
unpinned = [r for r in reqs if "==" not in r]
print("Unpinned:", unpinned)`,
        outcome: "Unpinned: ['flask', 'rich>=13.0']",
      },
      commonMistakes: [
        {
          label: 'Running pip freeze Outside a Virtual Environment',
          erroneousCode: `# Running pip freeze globally dumps 100+ unrelated OS/dev packages into requirements.txt`,
          errorMessage: 'Bloated requirements.txt with unrelated global packages',
          explanation: 'Always create and activate a clean .venv before installing project packages and running pip freeze.',
          correctedCode: `python -m venv .venv && source .venv/bin/activate && python -m pip freeze > requirements.txt`,
        },
      ],
      sourceNotes: 'Covers pip freeze and requirements.txt for Day 20.',
      practise: [
        {
          id: 'd20-s4-ex1',
          title: 'Scenario: Bloated Global pip freeze',
          type: 'scenario-mcq',
          tier: 'standard',
          points: 15,
          contextScenario: 'Bloated Global Freeze',
          prompt: 'A developer runs `pip freeze > requirements.txt` and discovers 110 unrelated packages in `requirements.txt` even though their project only uses `requests`. Why did this happen?',
          options: [
            { id: 'opt-1', text: 'They ran `pip freeze` in the global Python environment instead of inside an activated project `.venv`.', explanation: 'Correct!', isCorrect: true },
            { id: 'opt-2', text: '`requests` has 110 transitive dependencies.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'pip freeze includes Python standard library modules.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'The > operator duplicates lines.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'What does pip freeze output?',
            'It outputs every package installed in the currently active environment.',
            'Activate a clean .venv first.',
          ],
        },
        {
          id: 'd20-s4-ex2',
          title: 'Fix the Bug: Requirements Manifest Parser',
          type: 'fix-the-bug',
          tier: 'challenge',
          points: 20,
          contextScenario: 'CI Dependency Scanner',
          prompt: 'Fix the filter so comment lines (`# ...`) and blank lines are excluded, printing `[\'requests==2.32.3\', \'rich>=13.7\']`.',
          starterCode: `lines = ["# base deps", "", "requests==2.32.3", "  # inline", "rich>=13.7"]
pkgs = [ln.strip() for ln in lines]
print(pkgs)`,
          solutionCode: `lines = ["# base deps", "", "requests==2.32.3", "  # inline", "rich>=13.7"]
pkgs = [ln.strip() for ln in lines if ln.strip() and not ln.strip().startswith("#")]
print(pkgs)`,
          testCases: [
            { id: 'tc-1', label: "Prints ['requests==2.32.3', 'rich>=13.7']", setup: '', expected: "['requests==2.32.3', 'rich>=13.7']", hidden: false },
          ],
          hints: [
            'Strip whitespace before checking for empty or "#".',
            'if ln.strip() and not ln.strip().startswith("#").',
            "['requests==2.32.3', 'rich>=13.7'].",
          ],
        },
        {
          id: 'd20-s4-ex3',
          title: 'Write Code: Unpinned Dependency Auditor',
          type: 'write-code',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Production Lock Audit',
          prompt: 'Given `reqs = ["fastapi==0.115.0", "uvicorn", "httpx>=0.27"]`, print a list of all requirements that do NOT have an exact `"=="` pin.',
          starterCode: `reqs = ["fastapi==0.115.0", "uvicorn", "httpx>=0.27"]
# Print list of unpinned entries
`,
          solutionCode: `reqs = ["fastapi==0.115.0", "uvicorn", "httpx>=0.27"]
unpinned = [r for r in reqs if "==" not in r]
print(unpinned)`,
          testCases: [
            { id: 'tc-1', label: "Prints ['uvicorn', 'httpx>=0.27']", setup: '', expected: "['uvicorn', 'httpx>=0.27']", hidden: false },
          ],
          hints: [
            'Check if "==" not in r.',
            'Use a list comprehension.',
            "Prints ['uvicorn', 'httpx>=0.27'].",
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day20-sub5',
      number: 5,
      title: 'Inspecting Installed Packages (pip show, importlib.metadata, __version__)',
      summary: 'Inspect package versions, dependencies, and metadata both from the CLI and inside Python.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Auditing What Is Installed in Your Environment',
        paragraphs: [
          'From the terminal, **`python -m pip show <pkg>`** prints a package’s installed version, summary, author/license, install path (`Location`), its dependencies (`Requires`), and which packages depend on it (`Required-by`).',
          'Inside Python code (Python 3.8+), the standard-library **`importlib.metadata`** module lets you query installed distributions programmatically using **`version("pkg")`** or **`metadata("pkg")`**, without relying on non-standard `pkg.__version__` attributes (not every package defines `__version__`).',
          'If a package is not installed, `importlib.metadata.version("missing")` raises **`importlib.metadata.PackageNotFoundError`**.',
        ],
        keyTerms: [
          {
            term: 'importlib.metadata',
            definition: 'Standard-library module for reading installed package versions and metadata at runtime.',
          },
          {
            term: 'PackageNotFoundError',
            definition: 'Exception raised by importlib.metadata.version() when a package is not installed.',
          },
        ],
        bulletPoints: [
          'Prefer `importlib.metadata.version("pkg")` over `pkg.__version__` because `__version__` is optional.',
          'Use `pip show pkg` to check `Required-by` before uninstalling a library.',
        ],
      },
      visualise: {
        type: 'package-anatomy-sim',
        title: 'importlib.metadata & pyproject.toml Inspector',
        badge: 'simulation',
        description: 'Inspect runtime package metadata, pyproject.toml manifests, and HTTP client patterns.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Querying Installed Packages via importlib.metadata',
          runMode: 'real',
          code: `import importlib.metadata as meta

try:
    meta.version("definitely_not_installed_xyz")
except meta.PackageNotFoundError as err:
    print("Caught:", type(err).__name__)

installed_count = len(list(meta.distributions()))
print("Distributions visible >= 0:", installed_count >= 0)`,
          expectedOutput: `Caught: PackageNotFoundError
Distributions visible >= 0: True`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'meta.version("definitely_not_installed_xyz")',
          internalEffect: 'Looks up package distribution metadata and raises PackageNotFoundError when absent.',
        },
        {
          step: 2,
          codeLine: 8,
          instruction: 'list(meta.distributions())',
          internalEffect: 'Enumerates all installed distributions in the current Python environment.',
        },
      ],
      apply: {
        domain: 'Diagnostics',
        contextTitle: 'Safe Runtime Version Lookup Helper',
        scenario: 'Return a package version string or "not-installed" without crashing.',
        code: `import importlib.metadata as meta

def get_pkg_version(name: str) -> str:
    try:
        return meta.version(name)
    except meta.PackageNotFoundError:
        return "not-installed"

print(get_pkg_version("nonexistent-lib"))`,
        outcome: 'not-installed',
      },
      commonMistakes: [
        {
          label: 'Assuming Every Package Exposes __version__',
          erroneousCode: `# import some_pkg
# print(some_pkg.__version__)  # AttributeError if package omits __version__!`,
          errorMessage: 'AttributeError: module has no attribute "__version__"',
          explanation: 'Not all packages define __version__. Use importlib.metadata.version("some_pkg") instead.',
          correctedCode: `import importlib.metadata; print(importlib.metadata.version("pip"))`,
        },
      ],
      sourceNotes: 'Covers pip show and importlib.metadata for Day 20.',
      practise: [
        {
          id: 'd20-s5-ex1',
          title: 'Scenario: Missing __version__ Attribute',
          type: 'scenario-mcq',
          tier: 'standard',
          points: 15,
          contextScenario: 'Runtime Diagnostics Endpoint',
          prompt: 'Your `/health` endpoint checks `some_lib.__version__` and crashes with `AttributeError` because the library does not define `__version__`. What is the standard-library solution?',
          options: [
            { id: 'opt-1', text: 'Use `importlib.metadata.version("some_lib")`, which reads the package distribution metadata directly.', explanation: 'Correct!', isCorrect: true },
            { id: 'opt-2', text: 'Call `pip.version("some_lib")` inside the web handler.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'Read `sys.version`.', explanation: 'Incorrect. sys.version is the Python interpreter version.', isCorrect: false },
            { id: 'opt-4', text: 'Call `some_lib.__name__`.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'Which standard-library module inspects installed distribution metadata?',
            'importlib.metadata.',
            'importlib.metadata.version("some_lib").',
          ],
        },
        {
          id: 'd20-s5-ex2',
          title: 'Fill the Gaps: Safe Metadata Lookup',
          type: 'fill-the-gaps',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Plugin Version Probe',
          prompt: 'Complete the helper to look up a package version via `importlib.metadata` and catch the missing-package error.',
          gaps: [
            { id: 'g-1', beforeText: 'import importlib.', afterText: ' as meta', correctAnswer: 'metadata', options: ['metadata', 'util', 'resources', 'abc'] },
            { id: 'g-2', beforeText: 'except meta.', afterText: ':', correctAnswer: 'PackageNotFoundError', options: ['PackageNotFoundError', 'FileNotFoundError', 'KeyError', 'ImportError'] },
          ],
          hints: [
            'importlib.metadata holds version() and PackageNotFoundError.',
            'metadata and PackageNotFoundError.',
          ],
        },
        {
          id: 'd20-s5-ex3',
          title: 'Write Code: Runtime Package Version Reporter',
          type: 'write-code',
          tier: 'project',
          points: 25,
          contextScenario: 'Health Check Reporter',
          prompt: 'Write `safe_version(name)` using `importlib.metadata.version(name)` that returns `"missing"` on `PackageNotFoundError`, and print `safe_version("no_such_pkg_20")`.',
          starterCode: `import importlib.metadata as meta

def safe_version(name: str) -> str:
    # Return meta.version(name) or "missing" on PackageNotFoundError
    pass

print(safe_version("no_such_pkg_20"))`,
          solutionCode: `import importlib.metadata as meta

def safe_version(name: str) -> str:
    try:
        return meta.version(name)
    except meta.PackageNotFoundError:
        return "missing"

print(safe_version("no_such_pkg_20"))`,
          testCases: [
            { id: 'tc-1', label: 'Prints missing', setup: '', expected: 'missing', hidden: false },
          ],
          hints: [
            'Wrap meta.version(name) in try / except meta.PackageNotFoundError.',
            'Return "missing" in the except block.',
            'Prints missing.',
          ],
        },
      ],
      assess: [],
    },
    {
      id: 'day20-sub6',
      number: 6,
      title: 'Consuming External Packages (requests HTTP APIs & Safe Imports)',
      summary: 'Use third-party packages like requests safely with timeouts, status checks, and ImportError guards.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'From pip install to Production Code',
        paragraphs: [
          'The most famous third-party PyPI package for HTTP is **`requests`**. After installing it (`python -m pip install requests`), you fetch JSON APIs cleanly: `resp = requests.get(url, timeout=5)`, validate HTTP success with **`resp.raise_for_status()`**, and parse JSON with **`resp.json()`**.',
          'Always pass **`timeout=`** (e.g., `timeout=5`) to `requests.get()` / `requests.post()`. By default, `requests` has **no timeout**, meaning a stalled server can hang your Python script forever!',
          'When writing reusable scripts or optional integrations, wrap third-party imports in `try ... except ModuleNotFoundError:` so users get a helpful message (`Run: python -m pip install requests`) instead of a raw traceback.',
        ],
        keyTerms: [
          {
            term: 'timeout=5 in requests',
            definition: 'Prevents network calls from hanging indefinitely when a remote server is unresponsive.',
          },
          {
            term: 'resp.raise_for_status()',
            definition: 'Raises requests.HTTPError if the HTTP status code is 4xx or 5xx.',
          },
        ],
        bulletPoints: [
          'Never call `requests.get(url)` in production without `timeout=`.',
          'Remember `ModuleNotFoundError` is a subclass of `ImportError`.',
        ],
      },
      visualise: {
        type: 'package-anatomy-sim',
        title: 'requests HTTP Pattern & Optional Import Guard',
        badge: 'simulation',
        description: 'Inspect requests.get(url, timeout=5), raise_for_status(), and resp.json().',
        initialConfig: {},
      },
      code: [
        {
          title: 'Graceful Optional Dependency Guard with ModuleNotFoundError',
          runMode: 'real',
          code: `try:
    import nonexistent_http_client as client
    HAS_CLIENT = True
except ModuleNotFoundError:
    HAS_CLIENT = False

print("Client available:", HAS_CLIENT)`,
          expectedOutput: `Client available: False`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'import nonexistent_http_client as client',
          internalEffect: 'Attempts to import a third-party package that is not installed.',
        },
        {
          step: 2,
          codeLine: 4,
          instruction: 'except ModuleNotFoundError:',
          internalEffect: 'Catches the missing-package error cleanly so the program can fall back or guide the user.',
        },
      ],
      apply: {
        domain: 'API Integration',
        contextTitle: 'Validating HTTP JSON Payloads Safely',
        scenario: 'Parse a JSON API response body and verify the HTTP status before extracting fields.',
        code: `import json

def parse_api_payload(status_code: int, body: str) -> dict:
    if status_code >= 400:
        raise RuntimeError(f"HTTP error {status_code}")
    return json.loads(body)

print(parse_api_payload(200, '{"currency": "NGN", "rate": 1580}')["currency"])`,
        outcome: 'NGN',
      },
      commonMistakes: [
        {
          label: 'Calling requests.get() Without timeout=',
          erroneousCode: `# resp = requests.get("https://api.example.com/data")  # Can hang forever!`,
          errorMessage: 'Reliability bug: thread/worker hangs indefinitely on stalled socket',
          explanation: 'Always pass timeout= (in seconds) to requests calls.',
          correctedCode: `# resp = requests.get("https://api.example.com/data", timeout=5)`,
        },
      ],
      sourceNotes: 'Covers consuming external packages (requests) and ImportError handling.',
      practise: [
        {
          id: 'd20-s6-ex1',
          title: 'Theory: Why requests.get() Needs timeout=',
          type: 'theory-reasoning',
          tier: 'standard',
          points: 15,
          contextScenario: 'Hung API Worker Incident',
          prompt: 'A background worker calls `requests.get("https://partner.example.com/hook")` without `timeout=`. Why did all worker threads eventually freeze?',
          options: [
            { id: 'opt-1', text: 'By default `requests` has no timeout, so an unresponsive server keeps the TCP connection waiting indefinitely.', explanation: 'Correct! Always pass timeout=5 (or similar) to requests calls.', isCorrect: true },
            { id: 'opt-2', text: 'requests automatically retries infinitely on 200 OK.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-3', text: 'requests requires encoding="utf-8" to close sockets.', explanation: 'Incorrect.', isCorrect: false },
            { id: 'opt-4', text: 'raise_for_status() blocks forever.', explanation: 'Incorrect.', isCorrect: false },
          ],
          hints: [
            'What is the default timeout in Python’s requests library?',
            'None (infinite wait).',
            'Always pass timeout=seconds.',
          ],
        },
        {
          id: 'd20-s6-ex2',
          title: 'Order the Lines: Safe HTTP JSON Fetch Pattern',
          type: 'order-the-lines',
          tier: 'challenge',
          points: 20,
          contextScenario: 'Exchange Rate Fetcher',
          prompt: 'Arrange the lines to fetch a URL with a timeout, verify the HTTP status, parse JSON, and print `"NGN"`.',
          jumbledLines: [
            { id: 'l3', code: 'data = resp.json()', indent: 0 },
            { id: 'l1', code: 'resp = requests.get("https://api.example.com/rates", timeout=5)', indent: 0 },
            { id: 'l4', code: 'print(data["NGN"])', indent: 0 },
            { id: 'l2', code: 'resp.raise_for_status()', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: [
            'Call requests.get(..., timeout=5) first.',
            'Validate status with raise_for_status() before calling .json().',
            'Print data["NGN"] last.',
          ],
        },
        {
          id: 'd20-s6-ex3',
          title: 'Write Code: Optional Dependency & Payload Guard',
          type: 'write-code',
          tier: 'project',
          points: 25,
          contextScenario: 'Resilient SDK Adapter',
          prompt: 'Try importing `nonexistent_sdk_20`; on `ModuleNotFoundError`, set `mode = "fallback"`. Then print `mode`.',
          starterCode: `# Try importing nonexistent_sdk_20 and fall back cleanly on ModuleNotFoundError
`,
          solutionCode: `try:
    import nonexistent_sdk_20
    mode = "sdk"
except ModuleNotFoundError:
    mode = "fallback"

print(mode)`,
          testCases: [
            { id: 'tc-1', label: 'Prints fallback', setup: '', expected: 'fallback', hidden: false },
          ],
          hints: [
            'Use try: import nonexistent_sdk_20',
            'Catch except ModuleNotFoundError: and set mode = "fallback".',
            'Prints fallback.',
          ],
        },
      ],
      assess: [],
    },
  ],
  realWorldLabs: [
    {
      id: 'day20-lab1',
      title: 'Requirements Lockfile Auditor & SemVer Validator',
      description: 'Parse a requirements.txt manifest, flag unpinned dependencies, and verify which candidate versions satisfy ~=2.31.0.',
      domain: 'Release Engineering',
      starterCode: `import io

manifest = io.StringIO("""# Production dependencies
requests==2.32.3
pydantic>=2.7,<3.0
rich
""")

reqs = [ln.strip() for ln in manifest if ln.strip() and not ln.strip().startswith("#")]
pinned = [r for r in reqs if "==" in r]
unpinned = [r for r in reqs if "==" not in r]

print("Pinned:", pinned)
print("Unpinned:", unpinned)`,
      targetOutput: `Pinned: ['requests==2.32.3']
Unpinned: ['pydantic>=2.7,<3.0', 'rich']`,
    },
    {
      id: 'day20-lab2',
      title: 'Runtime Environment & Package Metadata Inspector',
      description: 'Inspect Python version, virtual environment isolation status (sys.prefix vs sys.base_prefix), and safe importlib.metadata lookups.',
      domain: 'Platform Diagnostics',
      starterCode: `import sys
import importlib.util
import importlib.metadata as meta

def probe(pkg: str) -> str:
    if importlib.util.find_spec(pkg) is None:
        return "missing"
    try:
        return meta.version(pkg)
    except meta.PackageNotFoundError:
        return "stdlib"

print("Isolated:", sys.prefix != sys.base_prefix)
print("json:", probe("json"), "| fake:", probe("fake_pkg_20"))`,
      targetOutput: `Isolated: False
json: stdlib | fake: missing`,
    },
  ],
  miniProject: {
    id: 'day20-project',
    title: 'Dependency Auditor & Requirements Lock Validator',
    brief: 'Build a Python CLI utility that parses requirements.txt, separates exact pins (==) from range specifiers (~=, >=), validates SemVer tuples numerically, and checks runtime availability via importlib.util and importlib.metadata.',
    requirements: [
      'Parse `requirements.txt` lines while skipping blank lines and `#` comments',
      'Classify dependencies into exact-pinned (`==`) vs range/unpinned entries',
      'Parse `MAJOR.MINOR.PATCH` strings into integer tuples for accurate SemVer comparison',
      'Evaluate compatible release ranges (`~=X.Y.Z`) cleanly',
      'Probe installed modules safely with `importlib.util.find_spec()` and `importlib.metadata.version()`',
    ],
    rubric: [
      { criterion: 'Accurate requirements.txt parsing and pin classification', weight: 40 },
      { criterion: 'Correct SemVer integer-tuple comparison and ~= range logic', weight: 35 },
      { criterion: 'Safe runtime metadata probing without uncaught PackageNotFoundError', weight: 25 },
    ],
    starterCode: `# Dependency Auditor & Requirements Lock Validator
import importlib.util
import importlib.metadata as meta

def audit_requirements(lines: list[str]) -> dict:
    # Return {"pinned": [...], "unpinned": [...]} ignoring comments and blanks
    pass
`,
  },
  dayQuiz: {
    title: 'Day 20 Mastery Checkpoint Quiz: Python Package Manager',
    passingScorePercentage: 80,
    questions: [
      {
        id: 'd20-q1',
        scenario: 'Running pip Safely',
        question: 'Why is `python -m pip install requests` preferred over bare `pip install requests`?',
        options: [
          { id: 'q1-a', text: 'It guarantees pip installs into the exact Python interpreter you invoked.', explanation: 'Correct!', isCorrect: true },
          { id: 'q1-b', text: 'It skips downloading from PyPI.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q1-c', text: 'It automatically creates a Git commit.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q1-d', text: 'Bare pip cannot install wheels.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd20-q2',
        scenario: 'Upgrading Packages',
        question: 'What happens if `requests` 2.31.0 is installed and you run `python -m pip install requests` without `--upgrade`?',
        options: [
          { id: 'q2-a', text: 'pip reports "Requirement already satisfied" and leaves 2.31.0 installed.', explanation: 'Correct!', isCorrect: true },
          { id: 'q2-b', text: 'pip always downloads the latest version anyway.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q2-c', text: 'pip uninstalls requests.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q2-d', text: 'pip raises an error.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd20-q3',
        scenario: 'Virtual Environments',
        question: 'Which command creates a new virtual environment in a folder named `.venv`?',
        options: [
          { id: 'q3-a', text: 'python -m venv .venv', explanation: 'Correct!', isCorrect: true },
          { id: 'q3-b', text: 'pip create .venv', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q3-c', text: 'python -m pip venv .venv', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q3-d', text: 'python --venv .venv', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd20-q4',
        scenario: 'Git & .venv',
        question: 'Should you commit the `.venv/` directory to Git?',
        options: [
          { id: 'q4-a', text: 'No—add `.venv/` to `.gitignore` and commit `requirements.txt` or `pyproject.toml` instead.', explanation: 'Correct!', isCorrect: true },
          { id: 'q4-b', text: 'Yes, so teammates do not need Python installed.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q4-c', text: 'Yes, Git requires `.venv/`.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q4-d', text: 'Only on Linux.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd20-q5',
        scenario: 'Semantic Versioning',
        question: 'In SemVer (`MAJOR.MINOR.PATCH`), what does a `MAJOR` version bump (e.g., `1.8.2` -> `2.0.0`) signify?',
        options: [
          { id: 'q5-a', text: 'Breaking API changes that may not be backward-compatible.', explanation: 'Correct!', isCorrect: true },
          { id: 'q5-b', text: 'A minor documentation typo fix.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q5-c', text: 'A backward-compatible bugfix only.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q5-d', text: 'The package was deleted from PyPI.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd20-q6',
        scenario: 'Compatible Release Specifier',
        question: 'Which versions are allowed by `requests~=2.31.0`?',
        options: [
          { id: 'q6-a', text: '>=2.31.0 and <2.32.0 (patch updates 2.31.x only).', explanation: 'Correct!', isCorrect: true },
          { id: 'q6-b', text: 'Any 2.x version including 2.99.0.', explanation: 'Incorrect. That would be ~=2.31 (2 components).', isCorrect: false },
          { id: 'q6-c', text: 'Only 2.31.0 exactly.', explanation: 'Incorrect. That is ==2.31.0.', isCorrect: false },
          { id: 'q6-d', text: '3.0.0 and above.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd20-q7',
        scenario: 'requirements.txt',
        question: 'Which command installs all dependencies listed in `requirements.txt`?',
        options: [
          { id: 'q7-a', text: 'python -m pip install -r requirements.txt', explanation: 'Correct!', isCorrect: true },
          { id: 'q7-b', text: 'python -m pip freeze requirements.txt', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q7-c', text: 'python -m pip show -r requirements.txt', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q7-d', text: 'python -m venv requirements.txt', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd20-q8',
        scenario: 'Inspecting Metadata',
        question: 'Which standard-library function safely returns an installed package’s version string without relying on `pkg.__version__`?',
        options: [
          { id: 'q8-a', text: 'importlib.metadata.version("pkg")', explanation: 'Correct!', isCorrect: true },
          { id: 'q8-b', text: 'sys.package_version("pkg")', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q8-c', text: 'os.version("pkg")', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q8-d', text: 'pip.show("pkg")', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd20-q9',
        scenario: 'Modern Packaging Manifest',
        question: 'Which file is the modern PEP 517/621 standard for declaring Python package metadata and direct dependencies?',
        options: [
          { id: 'q9-a', text: 'pyproject.toml', explanation: 'Correct!', isCorrect: true },
          { id: 'q9-b', text: 'package.json', explanation: 'Incorrect. That is Node.js.', isCorrect: false },
          { id: 'q9-c', text: 'pom.xml', explanation: 'Incorrect. That is Java Maven.', isCorrect: false },
          { id: 'q9-d', text: '.venv.ini', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
      {
        id: 'd20-q10',
        scenario: 'HTTP Requests',
        question: 'Why should you always pass `timeout=5` (or similar) to `requests.get(url, timeout=5)`?',
        options: [
          { id: 'q10-a', text: 'Because requests has no default timeout and can hang indefinitely on an unresponsive server.', explanation: 'Correct!', isCorrect: true },
          { id: 'q10-b', text: 'Because requests refuses to send GET requests without timeout=.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q10-c', text: 'Because timeout=5 enables JSON parsing.', explanation: 'Incorrect.', isCorrect: false },
          { id: 'q10-d', text: 'Because timeout=5 caches the response for 5 days.', explanation: 'Incorrect.', isCorrect: false },
        ],
      },
    ],
  },
  cheatSheet: [
    {
      category: 'PyPI & pip CLI (install, --upgrade, uninstall, list)',
      syntax: 'python -m pip install <pkg>',
      description: 'Always run pip via `python -m pip` so packages install into the active interpreter. Use `--upgrade` (`-U`) to update, `list` to view, and `uninstall` to remove.',
      example: `python -m pip install --upgrade requests
python -m pip list --outdated`,
    },
    {
      category: 'Virtual Environments (python -m venv)',
      syntax: 'python -m venv .venv && source .venv/bin/activate',
      description: 'Isolates project dependencies in a local `.venv/` folder. Add `.venv/` to `.gitignore`; verify isolation in Python via `sys.prefix != sys.base_prefix`.',
      example: `import sys
print("Isolated:", sys.prefix != sys.base_prefix)`,
    },
    {
      category: 'Semantic Versioning (MAJOR.MINOR.PATCH) & Specifiers',
      syntax: 'pkg==2.31.0 / pkg~=2.31.0 / pkg>=2.30,<3.0',
      description: 'MAJOR=breaking, MINOR=features, PATCH=bugfixes. `~=` allows patch increments only (`~=2.31.0` -> `>=2.31.0, <2.32.0`). Compare versions as int tuples, never strings.',
      example: `parse = lambda v: tuple(int(p) for p in v.split("."))
print(parse("2.10.0") > parse("2.9.0"))  # True`,
    },
    {
      category: 'Reproducible Builds (pip freeze & requirements.txt)',
      syntax: 'python -m pip freeze > requirements.txt',
      description: 'Exports exact pinned versions from an active `.venv`. Recreate environments on any machine with `python -m pip install -r requirements.txt`.',
      example: `python -m pip freeze > requirements.txt
python -m pip install -r requirements.txt`,
    },
    {
      category: 'Package Metadata (pip show & importlib.metadata)',
      syntax: 'importlib.metadata.version("pkg")',
      description: 'Use `pip show pkg` on the CLI or `importlib.metadata.version()` in Python 3.8+ instead of assuming `pkg.__version__` exists. Catch `PackageNotFoundError`.',
      example: `import importlib.metadata as meta
try:
    print(meta.version("requests"))
except meta.PackageNotFoundError:
    print("missing")`,
    },
    {
      category: 'Consuming External Packages (requests & Safe Imports)',
      syntax: 'requests.get(url, timeout=5)',
      description: 'Always pass `timeout=` to `requests` calls, validate HTTP codes with `resp.raise_for_status()`, parse with `resp.json()`, and guard optional imports with `ModuleNotFoundError`.',
      example: `try:
    import requests
except ModuleNotFoundError:
    requests = None`,
    },
  ],
  sourceNotes: [
    'Curriculum reference: https://github.com/Asabeneh/30-Days-Of-Python/tree/master/20_Day_Python_package_manager',
  ],
};
