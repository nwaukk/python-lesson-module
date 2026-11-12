/**
 * Day 23: Virtual Environments (Advanced Python)
 * Part A (Learn) conforming to Sections 10, 13.2, and 14 of the Master Specification.
 * Includes:
 *  - 6 Detailed Subtopics following the 10-step pedagogical structure
 *  - 3 Signature Simulations: venv-isolation-sim, venv-activation-sim, freeze-workflow-sim
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_23_MODULE: DayModule = {
  schemaVersion: 1,
  number: 23,
  title: 'Virtual Environments',
  level: 'advanced',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/tree/master/23_Day_Virtual_environment',
  estimatedMinutes: 50,
  prerequisites: [20],
  objectives: [
    'Explain why global Python package installations cause dependency conflicts across projects',
    'Create isolated environments with python -m venv .venv and inspect pyvenv.cfg',
    'Activate and deactivate virtual environments on macOS, Linux, Windows PowerShell, and CMD',
    'Verify environment isolation at runtime using sys.prefix, sys.base_prefix, and sys.path',
    'Capture and reproduce exact dependency graphs with pip freeze > requirements.txt and pip install -r',
    'Apply .gitignore hygiene, clean environment recreation, and dependency upgrade practices',
  ],
  subtopics: [
    {
      id: 'day23-sub1',
      number: 1,
      title: 'Why Virtual Environments Exist: Dependency Isolation',
      summary: 'Prevent version collisions and keep the global Python interpreter clean.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Solving "It Works on My Machine" & Version Collisions',
        paragraphs: [
          'Suppose **Project A** (an older billing service) requires `requests==2.28.1`, while **Project B** (a modern data scraper) requires `requests==2.32.3`. If you install packages into the **global system Python**, only one version of `requests` can exist in global `site-packages` at a time.',
          'A **virtual environment** (`venv`) is a lightweight, self-contained directory containing its own Python binary link, `pip`, and isolated `site-packages` folder. Each project gets its own dependency sandbox.',
          'Keeping the global Python clean also protects your operating system’s own Python tools (such as `apt` or `dnf` utilities on Linux) from accidental package overwrites.',
        ],
        keyTerms: [
          {
            term: 'Virtual Environment',
            definition: 'An isolated directory tree with its own site-packages and interpreter prefix, separate from global Python.',
          },
          {
            term: 'Dependency Conflict',
            definition: 'A clash where two projects or libraries require incompatible versions of the same package.',
          },
        ],
        bulletPoints: [
          'One virtual environment per project is the standard Python engineering rule.',
          'Never use `sudo pip install` into system Python; use a project-local `venv` instead.',
        ],
      },
      visualise: {
        type: 'venv-isolation-sim',
        title: 'Virtual Environment & sys.prefix Isolation Inspector',
        badge: 'simulation',
        description: 'Compare Global Python against isolated Project A and Project B virtual environments.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Simulating Two Isolated Project Dependency Maps',
          runMode: 'real',
          code: `global_env = {"pip": "24.0"}
project_a_venv = {"requests": "2.28.1", "flask": "2.2.5"}
project_b_venv = {"requests": "2.32.3", "beautifulsoup4": "4.12.3"}

print("Global packages:", list(global_env.keys()))
print("Project A requests:", project_a_venv["requests"])
print("Project B requests:", project_b_venv["requests"])`,
          expectedOutput: `Global packages: ['pip']
Project A requests: 2.28.1
Project B requests: 2.32.3`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'global_env = {"pip": "24.0"}',
          internalEffect: 'Global site-packages stays minimal and untouched by project libraries.',
        },
        {
          step: 2,
          codeLine: 2,
          instruction: 'project_a_venv / project_b_venv',
          internalEffect: 'Each project resolves its own version of requests independently without conflict.',
        },
      ],
      apply: {
        domain: 'Dependency Management',
        contextTitle: 'Detecting Incompatible Version Requirements',
        scenario: 'Check whether two project manifests conflict if forced into a single global environment.',
        code: `proj_a = {"urllib3": "1.26.18"}
proj_b = {"urllib3": "2.2.2"}
conflicts = {k: (proj_a[k], proj_b[k]) for k in proj_a if k in proj_b and proj_a[k] != proj_b[k]}
print("Conflicts if global:", conflicts)`,
        outcome: "Conflicts if global: {'urllib3': ('1.26.18', '2.2.2')}",
      },
      commonMistakes: [
        {
          label: 'Installing All Project Packages Globally',
          erroneousCode: `# pip install django==4.2   (in global Python)
# pip install django==5.1   (overwrites 4.2 and breaks Project A!)`,
          errorMessage: 'Silent breakage of older projects on the same machine',
          explanation: 'Global `pip install` overwrites the single shared `site-packages` directory.',
          correctedCode: `# Create a separate .venv inside each project directory`,
        },
      ],
      sourceNotes: 'Covers dependency isolation motivation for Day 23.',
      practise: [
        {
          id: 'd23-ex1',
          title: 'Preventing Dependency Collisions Across Projects',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Your laptop runs an internal payroll tool requiring `pandas==1.5.3` and a new analytics prototype requiring `pandas==2.2.2`. What is the cleanest engineering solution?',
          contextScenario: 'Both projects live on the same developer workstation and must remain runnable at any time.',
          options: [
            {
              id: 'a',
              text: 'Create a separate virtual environment (`.venv`) inside each project directory and install each project’s pinned version there.',
              explanation: 'Correct! Virtual environments isolate `site-packages` per project so incompatible package versions never collide.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'Install `pandas==2.2.2` globally with `pip install --force-reinstall` whenever you switch projects.',
              explanation: 'Reinstalling globally on every context switch is slow, error-prone, and breaks automated scripts.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'Use `sudo pip install` so both versions are merged into `/usr/lib/python3`.',
              explanation: 'A single `site-packages` directory cannot hold two different versions of `pandas` simultaneously.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Rename the `pandas` folder manually inside global `site-packages`.',
              explanation: 'Manually renaming installed packages breaks internal imports and metadata.',
              isCorrect: false,
            },
          ],
          hints: [
            'Can one global `site-packages` directory hold two different versions of `pandas`?',
            'Think about how per-project isolation solves version conflicts.',
            'Each project should own its own `.venv`.',
          ],
          points: 10,
        },
        {
          id: 'd23-ex2',
          title: 'Trace Conflict Detection Across Manifests',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'What does this dependency conflict checker print?',
          contextScenario: 'Auditing two service manifests before deciding whether they can share an environment.',
          starterCode: `svc_a = {"httpx": "0.24.1", "pydantic": "1.10.12"}
svc_b = {"httpx": "0.27.0", "pydantic": "1.10.12"}

clashes = [k for k in svc_a if k in svc_b and svc_a[k] != svc_b[k]]
print("Clashes:", clashes)`,
          options: [
            {
              id: 'a',
              text: "Clashes: ['httpx']",
              explanation: 'Correct! `pydantic` matches (`1.10.12`), while `httpx` differs (`0.24.1` vs `0.27.0`).',
              isCorrect: true,
            },
            {
              id: 'b',
              text: "Clashes: ['httpx', 'pydantic']",
              explanation: '`pydantic` has the exact same version in both services.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'Clashes: []',
              explanation: '`httpx` has two different version strings.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: "Clashes: ['pydantic']",
              explanation: '`pydantic` matches; `httpx` is the mismatched dependency.',
              isCorrect: false,
            },
          ],
          hints: [
            'Compare the version strings for `"httpx"` and `"pydantic"`.',
            'Which key satisfies `svc_a[k] != svc_b[k]`?',
            'The list comprehension collects only keys with differing versions.',
          ],
          points: 10,
        },
        {
          id: 'd23-ex3',
          title: 'Detect Shared-Package Version Conflicts',
          type: 'write-code',
          tier: 'standard',
          prompt: 'Implement `find_conflicts(env_a, env_b)` returning a sorted list of package names that exist in both dicts with different versions.',
          contextScenario: 'Building a pre-flight validator that warns engineers when two microservices cannot share a single Python environment.',
          starterCode: `def find_conflicts(env_a, env_b):
    # TODO: return sorted list of conflicting package names
    pass

a = {"uvicorn": "0.22.0", "fastapi": "0.100.0", "click": "8.1.7"}
b = {"uvicorn": "0.29.0", "fastapi": "0.110.0", "click": "8.1.7"}
print(find_conflicts(a, b))`,
          solutionCode: `def find_conflicts(env_a, env_b):
    return sorted(k for k in env_a if k in env_b and env_a[k] != env_b[k])

a = {"uvicorn": "0.22.0", "fastapi": "0.100.0", "click": "8.1.7"}
b = {"uvicorn": "0.29.0", "fastapi": "0.110.0", "click": "8.1.7"}
print(find_conflicts(a, b))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Returns sorted conflicting packages',
              setup: '',
              expected: "['fastapi', 'uvicorn']",
              hidden: false,
            },
          ],
          hints: [
            'Iterate over keys in `env_a` that also appear in `env_b`.',
            'Keep only keys where `env_a[k] != env_b[k]`.',
            'Wrap the result in `sorted(...)`.',
          ],
          points: 15,
        },
        {
          id: 'd23-ex4',
          title: 'Why sudo pip install Is Dangerous on Linux',
          type: 'theory-reasoning',
          tier: 'challenge',
          prompt: 'Explain two risks of running `sudo pip install` into the operating system’s Python on Linux/macOS instead of using a virtual environment.',
          contextScenario: 'A developer runs `sudo pip install requests==2.32.3` on an Ubuntu server to fix a `ModuleNotFoundError`.',
          modelAnswer: 'First, OS package managers (like apt or dnf) rely on specific system Python package versions; overwriting them with sudo pip can break critical OS utilities. Second, running pip as root executes setup scripts with full system privileges and pollutes the global environment for all users and projects, which modern distros block via PEP 668 (externally-managed-environment).',
          markingCriteria: [
            { id: 'c1', label: 'Identifies risk of breaking OS/distro Python tools (PEP 668)', points: 10 },
            { id: 'c2', label: 'Notes security/privilege risk of running pip as root and global pollution', points: 10 },
          ],
          hints: [
            'Who else uses `/usr/bin/python3` on an Ubuntu or Fedora system?',
            'What happens when `pip` runs with `root` privileges?',
            'Why do modern Linux distributions show `error: externally-managed-environment`?',
          ],
          points: 20,
        },
        {
          id: 'd23-ex5',
          title: 'Trace Transitive Dependency Breakage',
          type: 'explain-the-trace',
          tier: 'challenge',
          prompt: 'Explain why upgrading `urllib3` globally for Project B can silently break Project A even if Project A never imported `urllib3` directly.',
          contextScenario: 'Project A pins `botocore==1.29.0` (which requires `urllib3<1.27`), while Project B installs `requests==2.32.3` (which pulls `urllib3==2.2.2`).',
          traceStepCode: `# Global site-packages before: urllib3==1.26.18
# Project B runs: pip install requests==2.32.3 -> upgrades global urllib3 to 2.2.2
# Project A imports botocore -> ImportError / VersionConflict!`,
          traceQuestion: 'How does a transitive dependency upgrade break an unrelated project?',
          modelAnswer: 'Libraries depend on other libraries (transitive dependencies). Installing requests 2.32.3 globally replaces the shared urllib3 1.26.18 with 2.2.2. When Project A runs, botocore imports the newly overwritten urllib3 2.2.2 and fails compatibility checks because both projects share one global site-packages.',
          markingCriteria: [
            { id: 'c1', label: 'Explains transitive dependency replacement in shared site-packages', points: 10 },
            { id: 'c2', label: 'Connects the failure to Project A’s indirect dependency (botocore -> urllib3)', points: 10 },
          ],
          hints: [
            'What is a transitive dependency?',
            'How many versions of `urllib3` can exist in one `site-packages` folder?',
            'What happens when Project A’s `botocore` imports `urllib3` after Project B’s install?',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day23-sub2',
      number: 2,
      title: 'Creating Environments with python -m venv & Anatomy',
      summary: 'Use the standard-library venv module and understand pyvenv.cfg and site-packages.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Inside python -m venv .venv',
        paragraphs: [
          'Since Python 3.3, the standard library includes the **`venv`** module—no third-party `virtualenv` install is needed. Running **`python -m venv .venv`** (or `python3 -m venv .venv` on macOS/Linux) creates a hidden `.venv` directory in your project root.',
          'Inside `.venv`, Python creates three key items: **`pyvenv.cfg`** (configuration pointing back to the base interpreter and setting `include-system-site-packages = false`), a **`bin/`** (POSIX) or **`Scripts/`** (Windows) directory for executables, and **`lib/.../site-packages/`** for third-party packages.',
          'Why `.venv` with a leading dot? Naming the folder `.venv` keeps it tidy in editors like VS Code, which automatically detect `.venv` as your workspace interpreter.',
        ],
        keyTerms: [
          {
            term: 'pyvenv.cfg',
            definition: 'Marker configuration file at the root of a venv linking it to the base Python installation.',
          },
          {
            term: 'include-system-site-packages',
            definition: 'Setting in pyvenv.cfg (false by default) that prevents global packages from leaking into the venv.',
          },
        ],
        bulletPoints: [
          'Always invoke `python -m venv .venv` with the exact Python version you want the environment to use.',
          'Python’s standard library also exposes `venv.EnvBuilder` for programmatic environment creation.',
        ],
      },
      visualise: {
        type: 'venv-activation-sim',
        title: 'Cross-Platform venv Creation & Activation Lab',
        badge: 'simulation',
        description: 'Inspect .venv directory layout and creation commands across macOS/Linux and Windows.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Inspecting pyvenv.cfg Structure with ConfigParser-Style Parsing',
          runMode: 'real',
          code: `pyvenv_cfg = """
home = /usr/local/bin
include-system-site-packages = false
version = 3.12.4
"""

config = {}
for line in pyvenv_cfg.strip().splitlines():
    key, value = [part.strip() for part in line.split("=", 1)]
    config[key] = value

print("Isolated from global?", config["include-system-site-packages"] == "false")
print("Base version:", config["version"])`,
          expectedOutput: `Isolated from global? True
Base version: 3.12.4`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 3,
          instruction: 'include-system-site-packages = false',
          internalEffect: 'Prevents the venv from seeing packages installed in global site-packages.',
        },
        {
          step: 2,
          codeLine: 9,
          instruction: 'line.split("=", 1)',
          internalEffect: 'Parses key-value pairs from pyvenv.cfg cleanly.',
        },
      ],
      apply: {
        domain: 'Dev Tooling',
        contextTitle: 'Building Cross-Platform venv Executable Paths',
        scenario: 'Resolve the expected Python executable path inside `.venv` for POSIX vs. Windows.',
        code: `from pathlib import PurePosixPath, PureWindowsPath

posix_py = PurePosixPath(".venv") / "bin" / "python"
win_py = PureWindowsPath(".venv") / "Scripts" / "python.exe"
print("POSIX:", posix_py)
print("Windows:", win_py)`,
        outcome: `POSIX: .venv/bin/python
Windows: .venv\\Scripts\\python.exe`,
      },
      commonMistakes: [
        {
          label: 'Passing --system-site-packages by Accident',
          erroneousCode: `# python -m venv .venv --system-site-packages`,
          errorMessage: 'Global packages leak into your project and hide missing requirements.txt entries',
          explanation: 'Unless you have a specific OS-library reason, omit `--system-site-packages` so isolation stays strict.',
          correctedCode: `# python -m venv .venv`,
        },
      ],
      sourceNotes: 'Covers python -m venv anatomy and pyvenv.cfg for Day 23.',
      practise: [
        {
          id: 'd23-ex6',
          title: 'Standard Library Module for Virtual Environments',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Which command creates a new virtual environment named `.venv` using Python 3’s built-in standard library?',
          contextScenario: 'Setting up a fresh project on a clean machine with only Python 3.12 installed.',
          options: [
            {
              id: 'a',
              text: '`python -m venv .venv` (or `python3 -m venv .venv`)',
              explanation: 'Correct! The `venv` module is built into Python 3.3+ and creates an isolated `.venv` directory.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: '`pip create venv .venv`',
              explanation: '`pip` does not have a `create` subcommand for virtual environments.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '`python --new-env .venv`',
              explanation: '`--new-env` is not a valid Python CLI flag.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: '`mkdir .venv && cd .venv`',
              explanation: 'An empty directory lacks `pyvenv.cfg`, executables, and `site-packages`.',
              isCorrect: false,
            },
          ],
          hints: [
            'Python runs standard-library modules as scripts with `-m`.',
            'The built-in module name is `venv`.',
            'Target folder name `.venv` follows `-m venv`.',
          ],
          points: 10,
        },
        {
          id: 'd23-ex7',
          title: 'Complete pyvenv.cfg Isolation Check',
          type: 'fill-the-gaps',
          tier: 'standard',
          prompt: 'Fill in the gaps to parse `pyvenv.cfg` and verify that global packages are excluded.',
          contextScenario: 'Writing an environment auditor that reads `.venv/pyvenv.cfg`.',
          gaps: [
            {
              id: 'g1',
              beforeText: 'key, val = [p.strip() for p in line.',
              afterText: '("=", 1)]\n',
              correctAnswer: 'split',
              options: ['split', 'partition', 'join', 'strip'],
            },
            {
              id: 'g2',
              beforeText: 'isolated = cfg.get("',
              afterText: '") == "false"',
              correctAnswer: 'include-system-site-packages',
              options: ['include-system-site-packages', 'use-global-pip', 'system-prefix', 'allow-root-packages'],
            },
          ],
          hints: [
            'Split each `key = value` line once using `.split("=", 1)`.',
            'The standard `pyvenv.cfg` key controlling global package visibility is `include-system-site-packages`.',
          ],
          points: 15,
        },
        {
          id: 'd23-ex8',
          title: 'Fix Cross-Platform venv Executable Path',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'Fix `get_venv_python(os_name)` so `"windows"` returns `.venv\\Scripts\\python.exe` and `"posix"` returns `.venv/bin/python`.',
          contextScenario: 'A build script fails on Windows CI runners because it hardcodes `.venv/bin/python`.',
          starterCode: `def get_venv_python(os_name):
    return ".venv/bin/python"

print(get_venv_python("posix"))
print(get_venv_python("windows"))`,
          solutionCode: `def get_venv_python(os_name):
    if os_name.lower() == "windows":
        return ".venv\\\\Scripts\\\\python.exe"
    return ".venv/bin/python"

print(get_venv_python("posix"))
print(get_venv_python("windows"))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Returns OS-specific Python executable paths',
              setup: '',
              expected: '.venv/bin/python\n.venv\\Scripts\\python.exe',
              hidden: false,
            },
          ],
          hints: [
            'Check `if os_name.lower() == "windows":`.',
            'Windows virtual environments store executables in `Scripts\\python.exe`.',
            'POSIX (macOS/Linux) stores executables in `bin/python`.',
          ],
          points: 15,
        },
        {
          id: 'd23-ex9',
          title: 'Order venv Creation & Verification Steps',
          type: 'order-the-lines',
          tier: 'standard',
          prompt: 'Arrange the terminal workflow to create `.venv`, inspect its config, and upgrade `pip` inside it.',
          contextScenario: 'Bootstrapping a clean Python workspace.',
          jumbledLines: [
            { id: 'l3', code: 'python -m pip install --upgrade pip', indent: 0 },
            { id: 'l1', code: 'python3 -m venv .venv', indent: 0 },
            { id: 'l2', code: 'source .venv/bin/activate', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3'],
          hints: [
            'First create the `.venv` directory.',
            'Activate `.venv` before running `python -m pip`.',
            'Upgrade `pip` inside the newly activated environment.',
          ],
          points: 15,
        },
        {
          id: 'd23-ex10',
          title: 'Why Moving or Renaming .venv Breaks Scripts',
          type: 'theory-reasoning',
          tier: 'challenge',
          prompt: 'Explain why renaming a project folder or moving `.venv` to another path breaks console scripts and `activate`, and what you should do instead.',
          contextScenario: 'A developer renames `~/old_app` to `~/new_app` and suddenly `pytest` fails with `bad interpreter: No such file or directory`.',
          modelAnswer: 'Virtual environments embed absolute paths in `activate` (`VIRTUAL_ENV=...`) and in the `#!` (shebang) line of executable scripts inside `bin/` or `Scripts/`. Moving or renaming the directory leaves those hardcoded paths pointing to the old location. Because `.venv` is disposable, you should delete `.venv`, recreate it with `python -m venv .venv`, and reinstall from `requirements.txt`.',
          markingCriteria: [
            { id: 'c1', label: 'Identifies hardcoded absolute paths in activate / script shebangs', points: 10 },
            { id: 'c2', label: 'Recommends deleting and recreating .venv from requirements.txt', points: 10 },
          ],
          hints: [
            'What does the first line (`#!...`) of `.venv/bin/pytest` contain?',
            'Are virtual environments meant to be relocated or recreated?',
            'How do you rebuild `.venv` cleanly?',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day23-sub3',
      number: 3,
      title: 'Activating & Deactivating Across macOS, Linux & Windows',
      summary: 'Modify shell PATH safely with activate scripts and return to global with deactivate.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'What "Activating" Actually Does in Your Shell',
        paragraphs: [
          'Creating `.venv` only places files on disk. **Activating** it runs a small shell script that prepends `.venv/bin` (or `.venv\\Scripts` on Windows) to your terminal’s **`PATH`** environment variable and sets **`VIRTUAL_ENV`**.',
          'Because `PATH` is searched left-to-right, typing `python` or `pip` now resolves to the `.venv` executable first, and your terminal prompt displays `(.venv)` as a visual reminder.',
          'When you finish working, run **`deactivate`** to restore your original `PATH`. Note that activation only affects the *current terminal tab*—opening a new terminal requires activating again (or invoking `.venv/bin/python` directly).',
        ],
        keyTerms: [
          {
            term: 'source .venv/bin/activate',
            definition: 'POSIX command that executes the activation script in the current shell rather than a subshell.',
          },
          {
            term: 'deactivate',
            definition: 'Shell function injected by activate that restores PATH and removes the (.venv) prompt prefix.',
          },
        ],
        bulletPoints: [
          'macOS / Linux (`bash`/`zsh`): `source .venv/bin/activate`',
          'Windows PowerShell: `.venv\\Scripts\\Activate.ps1` (CMD uses `.venv\\Scripts\\activate.bat`)',
        ],
      },
      visualise: {
        type: 'venv-activation-sim',
        title: 'Shell Activation & PATH Switching Simulator',
        badge: 'simulation',
        description: 'Toggle between Activated and Deactivated states across bash/zsh, PowerShell, and CMD.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Simulating PATH Prepending During Activation',
          runMode: 'real',
          code: `import os

base_path = ["/usr/local/bin", "/usr/bin"]
venv_bin = "/project/.venv/bin"

activated_path = [venv_bin] + base_path
print("Active python resolves from:", activated_path[0])

deactivated_path = [p for p in activated_path if p != venv_bin]
print("Deactivated python resolves from:", deactivated_path[0])`,
          expectedOutput: `Active python resolves from: /project/.venv/bin
Deactivated python resolves from: /usr/local/bin`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 6,
          instruction: 'activated_path = [venv_bin] + base_path',
          internalEffect: 'Prepending .venv/bin to PATH makes `python` and `pip` hit the venv first.',
        },
        {
          step: 2,
          codeLine: 9,
          instruction: 'deactivated_path = [...]',
          internalEffect: 'Deactivate strips the venv bin directory and restores the original PATH.',
        },
      ],
      apply: {
        domain: 'CLI Automation',
        contextTitle: 'Detecting Active VIRTUAL_ENV in Python Scripts',
        scenario: 'Check `os.environ.get("VIRTUAL_ENV")` to warn if a script was launched outside a virtual environment.',
        code: `import os

mock_env = {"VIRTUAL_ENV": "/home/dev/app/.venv"}
venv_dir = mock_env.get("VIRTUAL_ENV")
print("Venv active?", bool(venv_dir))
print("Env path:", venv_dir)`,
        outcome: `Venv active? True
Env path: /home/dev/app/.venv`,
      },
      commonMistakes: [
        {
          label: 'Running ./venv/bin/activate Without source',
          erroneousCode: `# .venv/bin/activate   (runs in a subshell and exits immediately!)`,
          errorMessage: 'Prompt does not change to (.venv) and PATH remains global',
          explanation: 'Executing the script without `source` (or `.`) modifies a temporary child shell instead of your current terminal.',
          correctedCode: `# source .venv/bin/activate`,
        },
      ],
      sourceNotes: 'Covers cross-platform activation and deactivation for Day 23.',
      practise: [
        {
          id: 'd23-ex11',
          title: 'Why source Is Required on macOS/Linux',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'You run `./.venv/bin/activate` in bash, but your prompt does NOT show `(.venv)` and `which python` still points globally. Why?',
          contextScenario: 'Running the activate script directly instead of sourcing it.',
          options: [
            {
              id: 'a',
              text: 'Executing it directly spawns a temporary subshell; `source .venv/bin/activate` is required to update the current shell’s `PATH`.',
              explanation: 'Correct! A child process cannot modify its parent shell’s environment variables; `source` (or `.`) executes in the current shell.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'The `activate` script only works on Windows.',
              explanation: '`bin/activate` is specifically for POSIX shells like bash and zsh.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: 'You must reboot your machine after creating `.venv`.',
              explanation: 'No reboot is ever needed for virtual environments.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Python 3.12 removed the `activate` script.',
              explanation: '`activate` is still created by `python -m venv`.',
              isCorrect: false,
            },
          ],
          hints: [
            'Can a child process change the parent terminal’s `PATH`?',
            'What shell builtin runs a script inside the current shell?',
            'Compare `./.venv/bin/activate` vs `source .venv/bin/activate`.',
          ],
          points: 10,
        },
        {
          id: 'd23-ex12',
          title: 'Trace PATH Prepending & Deactivation',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'What does this simulated shell `PATH` activation/deactivation snippet print?',
          contextScenario: 'Visualizing how `activate` and `deactivate` change executable resolution order.',
          starterCode: `path = ["/usr/bin", "/bin"]
venv_bin = "/repo/.venv/bin"

path.insert(0, venv_bin)
print("1:", path[0])

path.remove(venv_bin)
print("2:", path[0])`,
          options: [
            {
              id: 'a',
              text: '1: /repo/.venv/bin\n2: /usr/bin',
              explanation: 'Correct! Activation prepends `.venv/bin` to index 0; deactivation removes it and restores `/usr/bin` as the first entry.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: '1: /usr/bin\n2: /repo/.venv/bin',
              explanation: '`insert(0, venv_bin)` places `venv_bin` at the front of `path`.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '1: /repo/.venv/bin\n2: /repo/.venv/bin',
              explanation: '`path.remove(venv_bin)` removes the venv entry.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: '1: /bin\n2: /usr/bin',
              explanation: '`venv_bin` is inserted at index 0.',
              isCorrect: false,
            },
          ],
          hints: [
            '`insert(0, ...)` puts the item at the very start of the list.',
            'What is `path[0]` after `path.remove(venv_bin)`?',
          ],
          points: 10,
        },
        {
          id: 'd23-ex13',
          title: 'Complete Windows PowerShell Activation & Deactivation',
          type: 'fill-the-gaps',
          tier: 'standard',
          prompt: 'Fill in the missing Windows PowerShell commands to activate and deactivate `.venv`.',
          contextScenario: 'Onboarding a Windows teammate onto a Python repository.',
          gaps: [
            {
              id: 'g1',
              beforeText: '# Activate in PowerShell:\n.venv\\',
              afterText: '\\Activate.ps1\n',
              correctAnswer: 'Scripts',
              options: ['Scripts', 'bin', 'lib', 'env'],
            },
            {
              id: 'g2',
              beforeText: '# Return to global shell:\n',
              afterText: '',
              correctAnswer: 'deactivate',
              options: ['deactivate', 'exit-venv', 'source deactivate', 'venv --stop'],
            },
          ],
          hints: [
            'Windows uses `Scripts\\` instead of `bin/`.',
            'The command to exit any active venv is `deactivate`.',
          ],
          points: 15,
        },
        {
          id: 'd23-ex14',
          title: 'Simulate Shell Activation State Manager',
          type: 'write-code',
          tier: 'project',
          prompt: 'Implement `ShellEnv` with `activate(venv_bin)` and `deactivate()` methods that update `self.path` and `self.virtual_env`, then print the final state.',
          contextScenario: 'Modeling how terminal activation modifies `PATH` and `VIRTUAL_ENV` without mutating the base system paths.',
          starterCode: `class ShellEnv:
    def __init__(self, base_path):
        self.path = list(base_path)
        self.virtual_env = None

    def activate(self, venv_bin):
        # TODO: prepend venv_bin to self.path and set self.virtual_env
        pass

    def deactivate(self):
        # TODO: remove active venv_bin from self.path and reset self.virtual_env = None
        pass

shell = ShellEnv(["/usr/local/bin", "/usr/bin"])
shell.activate("/app/.venv/bin")
print("Active:", shell.virtual_env, shell.path[0])
shell.deactivate()
print("Restored:", shell.virtual_env, shell.path[0])`,
          solutionCode: `class ShellEnv:
    def __init__(self, base_path):
        self.path = list(base_path)
        self.virtual_env = None

    def activate(self, venv_bin):
        if venv_bin not in self.path:
            self.path.insert(0, venv_bin)
        self.virtual_env = venv_bin

    def deactivate(self):
        if self.virtual_env and self.virtual_env in self.path:
            self.path.remove(self.virtual_env)
        self.virtual_env = None

shell = ShellEnv(["/usr/local/bin", "/usr/bin"])
shell.activate("/app/.venv/bin")
print("Active:", shell.virtual_env, shell.path[0])
shell.deactivate()
print("Restored:", shell.virtual_env, shell.path[0])`,
          testCases: [
            {
              id: 'tc1',
              label: 'Activates and restores PATH cleanly',
              setup: '',
              expected: 'Active: /app/.venv/bin /app/.venv/bin\nRestored: None /usr/local/bin',
              hidden: false,
            },
          ],
          hints: [
            'In `activate`, use `self.path.insert(0, venv_bin)` and store `self.virtual_env = venv_bin`.',
            'In `deactivate`, remove `self.virtual_env` from `self.path` and set `self.virtual_env = None`.',
          ],
          points: 25,
        },
        {
          id: 'd23-ex15',
          title: 'Running Scripts Without Activating (Cron / CI)',
          type: 'theory-reasoning',
          tier: 'challenge',
          prompt: 'Explain how a scheduled cron job or CI step can run a Python script inside `.venv` WITHOUT running `source .venv/bin/activate` first.',
          contextScenario: 'A Linux cron job fails with `ModuleNotFoundError` because cron runs with a minimal non-interactive `PATH`.',
          modelAnswer: 'Activation is only a convenience for interactive shells. Invoking the venv’s Python executable directly by absolute path (e.g., `/srv/app/.venv/bin/python /srv/app/job.py`) automatically sets `sys.prefix` and `sys.path` to that venv’s isolated `site-packages` without needing `source activate`.',
          markingCriteria: [
            { id: 'c1', label: 'Identifies calling .venv/bin/python (or Scripts\\python.exe) directly', points: 10 },
            { id: 'c2', label: 'Explains that Python derives sys.prefix and site-packages from its executable path', points: 10 },
          ],
          hints: [
            'Does Python need `PATH` modified if you invoke `.venv/bin/python` directly?',
            'How does Python find `pyvenv.cfg` on startup?',
          ],
          points: 20,
        },
      ],
      assess: [],
    },
    {
      id: 'day23-sub4',
      number: 4,
      title: 'Inspecting Isolation at Runtime (sys.prefix & sys.path)',
      summary: 'Verify which Python interpreter and site-packages directory your running script uses.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Proving Isolation from Inside Python',
        paragraphs: [
          'Sometimes an IDE or cron job runs the global Python even though you thought `.venv` was active. You can verify isolation inside Python itself using the **`sys`** module.',
          'Compare **`sys.prefix`** (the active environment root) against **`sys.base_prefix`** (the underlying base Python installation). Inside an active virtual environment, **`sys.prefix != sys.base_prefix`**.',
          'You can also inspect **`sys.executable`** (the exact binary running your script) and **`sys.path`** (the ordered list of directories Python searches when you `import` a module).',
        ],
        keyTerms: [
          {
            term: 'sys.prefix',
            definition: 'Root directory of the currently active Python environment (points to .venv when active).',
          },
          {
            term: 'sys.base_prefix',
            definition: 'Root directory of the underlying base Python installation that created the venv.',
          },
        ],
        bulletPoints: [
          'Use `in_venv = sys.prefix != sys.base_prefix` as the canonical runtime check.',
          'Prefer `python -m pip install ...` over bare `pip install ...` so `pip` always targets the same interpreter as `python`.',
        ],
      },
      visualise: {
        type: 'venv-isolation-sim',
        title: 'Runtime sys.prefix vs sys.base_prefix Inspector',
        badge: 'simulation',
        description: 'Inspect how sys.prefix, sys.base_prefix, and site-packages change across environments.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Canonical Runtime Virtual Environment Check',
          runMode: 'real',
          code: `import sys

def is_virtual_env(prefix, base_prefix):
    return prefix != base_prefix

print("Runtime prefix type:", type(sys.prefix).__name__)
print("Global match:", is_virtual_env("/usr/local/py312", "/usr/local/py312"))
print("Venv match:", is_virtual_env("/app/.venv", "/usr/local/py312"))`,
          expectedOutput: `Runtime prefix type: str
Global match: False
Venv match: True`,
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 4,
          instruction: 'return prefix != base_prefix',
          internalEffect: 'Returns True only when sys.prefix points to a different root than sys.base_prefix.',
        },
        {
          step: 2,
          codeLine: 6,
          instruction: 'sys.prefix',
          internalEffect: 'Standard Python attribute exposing the active environment root string.',
        },
      ],
      apply: {
        domain: 'Runtime Diagnostics',
        contextTitle: 'Startup Environment Preflight Helper',
        scenario: 'Write a preflight diagnostic that reports interpreter isolation status and executable path.',
        code: `def env_report(executable, prefix, base_prefix):
    isolated = prefix != base_prefix
    return {"executable": executable, "isolated": isolated}

print(env_report("/app/.venv/bin/python", "/app/.venv", "/usr/bin/python3"))`,
        outcome: "{'executable': '/app/.venv/bin/python', 'isolated': True}",
      },
      commonMistakes: [
        {
          label: 'Running Bare pip When python Points to a Different Env',
          erroneousCode: `# pip install requests   (might belong to global Python while python3 is .venv!)`,
          errorMessage: 'ModuleNotFoundError: No module named "requests" inside .venv',
          explanation: 'Using `python -m pip install requests` guarantees `pip` installs into the exact interpreter running `python`.',
          correctedCode: `# python -m pip install requests`,
        },
      ],
      sourceNotes: 'Covers sys.prefix, sys.base_prefix, and python -m pip for Day 23.',
      practise: [
        {
          id: 'd23-ex16',
          title: 'Canonical Runtime Check for Virtual Environment',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Which expression reliably detects inside Python code whether a virtual environment is currently active?',
          contextScenario: 'Adding a startup assertion to a deployment script so it refuses to run under global Python.',
          options: [
            {
              id: 'a',
              text: '`sys.prefix != sys.base_prefix`',
              explanation: 'Correct! Inside a `venv`, `sys.prefix` points to `.venv` while `sys.base_prefix` points to the base Python installation.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: '`sys.version == "3.12"`',
              explanation: '`sys.version` reports the Python release, not whether a venv is active.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '`os.getcwd().endswith(".venv")`',
              explanation: 'Your working directory is normally the project root, not inside `.venv`.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: '`len(sys.path) == 0`',
              explanation: '`sys.path` is never empty in a running interpreter.',
              isCorrect: false,
            },
          ],
          hints: [
            'Which `sys` attributes compare the active environment root against the base installation?',
            'Look for `sys.prefix` and `sys.base_prefix`.',
          ],
          points: 10,
        },
        {
          id: 'd23-ex17',
          title: 'Fix Bare pip Mismatch with python -m pip',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'Fix `install_command(py_exec, pkg)` so it uses `python -m pip install` instead of bare `pip install`.',
          contextScenario: 'A teammate’s `pip` points to Python 3.10 globally while `python` points to `.venv` (Python 3.12), causing `ModuleNotFoundError`.',
          starterCode: `def install_command(py_exec, pkg):
    return f"pip install {pkg}"

print(install_command(".venv/bin/python", "httpx"))`,
          solutionCode: `def install_command(py_exec, pkg):
    return f"{py_exec} -m pip install {pkg}"

print(install_command(".venv/bin/python", "httpx"))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Uses target python -m pip install',
              setup: '',
              expected: '.venv/bin/python -m pip install httpx',
              hidden: false,
            },
          ],
          hints: [
            'Use `py_exec` at the start of the command.',
            'Invoke `pip` as a module with `-m pip install`.',
          ],
          points: 15,
        },
        {
          id: 'd23-ex18',
          title: 'Trace sys.prefix vs sys.base_prefix Diagnostics',
          type: 'explain-the-trace',
          tier: 'challenge',
          prompt: 'Explain what `sys.prefix == sys.base_prefix` reveals when debugging a script that unexpectedly raises `ModuleNotFoundError` for a package you already installed in `.venv`.',
          contextScenario: 'You installed `beautifulsoup4` in `.venv`, then ran `python scraper.py` from a fresh terminal tab and got `ModuleNotFoundError`.',
          traceStepCode: `import sys
print("executable:", sys.executable)    # /usr/local/bin/python3
print("prefix == base_prefix:", sys.prefix == sys.base_prefix)  # True`,
          traceQuestion: 'Why did `prefix == base_prefix` evaluate to `True` and cause `ModuleNotFoundError`?',
          modelAnswer: '`sys.prefix == sys.base_prefix` being True proves the script ran under the global Python interpreter (`/usr/local/bin/python3`) rather than `.venv`. Because `beautifulsoup4` was installed only in `.venv/lib/.../site-packages`, the global interpreter cannot see it. Activating `.venv` or running `.venv/bin/python scraper.py` fixes it.',
          markingCriteria: [
            { id: 'c1', label: 'Identifies that True means global Python is running, not .venv', points: 10 },
            { id: 'c2', label: 'Explains that .venv site-packages is invisible to global Python', points: 10 },
          ],
          hints: [
            'What does `sys.executable` point to in the trace?',
            'If `prefix == base_prefix`, is `.venv` active?',
          ],
          points: 20,
        },
        {
          id: 'd23-ex19',
          title: 'Order a Runtime Isolation Preflight Check',
          type: 'order-the-lines',
          tier: 'standard',
          prompt: 'Order the lines to build a function that verifies `sys.prefix != sys.base_prefix` and raises `RuntimeError` if not isolated.',
          contextScenario: 'Guarding an internal CLI tool against accidental global execution.',
          jumbledLines: [
            { id: 'l3', code: 'raise RuntimeError("Activate .venv before running!")', indent: 2 },
            { id: 'l1', code: 'def require_venv(prefix, base_prefix):', indent: 0 },
            { id: 'l4', code: 'return True', indent: 1 },
            { id: 'l2', code: 'if prefix == base_prefix:', indent: 1 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: [
            'Start with `def require_venv(...)`.',
            'Check `if prefix == base_prefix:` and raise `RuntimeError` inside the `if` block.',
            'Return `True` if isolated.',
          ],
          points: 15,
        },
        {
          id: 'd23-ex20',
          title: 'Build an Environment Inspector Helper',
          type: 'write-code',
          tier: 'project',
          prompt: 'Implement `inspect_env(executable, prefix, base_prefix, sys_path)` returning a dict with `"isolated"` (bool), `"executable"`, and `"has_site_packages"` (True if any entry in `sys_path` contains `"site-packages"`).',
          contextScenario: 'Creating a diagnostic endpoint for a Python worker process.',
          starterCode: `def inspect_env(executable, prefix, base_prefix, sys_path):
    # TODO: return {"isolated": ..., "executable": ..., "has_site_packages": ...}
    pass

res = inspect_env(
    "/app/.venv/bin/python",
    "/app/.venv",
    "/usr/local/py312",
    ["/app", "/app/.venv/lib/python3.12/site-packages"],
)
print(res)`,
          solutionCode: `def inspect_env(executable, prefix, base_prefix, sys_path):
    return {
        "isolated": prefix != base_prefix,
        "executable": executable,
        "has_site_packages": any("site-packages" in p for p in sys_path),
    }

res = inspect_env(
    "/app/.venv/bin/python",
    "/app/.venv",
    "/usr/local/py312",
    ["/app", "/app/.venv/lib/python3.12/site-packages"],
)
print(res)`,
          testCases: [
            {
              id: 'tc1',
              label: 'Reports isolated=True and has_site_packages=True',
              setup: '',
              expected: "{'isolated': True, 'executable': '/app/.venv/bin/python', 'has_site_packages': True}",
              hidden: false,
            },
          ],
          hints: [
            'Use `prefix != base_prefix` for `"isolated"`.',
            'Use `any("site-packages" in p for p in sys_path)` for `"has_site_packages"`.',
          ],
          points: 25,
        },
      ],
      assess: [],
    },
    {
      id: 'day23-sub5',
      number: 5,
      title: 'Reproducible Dependencies with pip freeze & requirements.txt',
      summary: 'Pin exact versions with pip freeze and recreate environments with pip install -r.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Pinning & Reproducing Your Environment',
        paragraphs: [
          'Once your project works inside `.venv`, how does a teammate or deployment server install the exact same package versions? Run **`pip freeze > requirements.txt`**.',
          '`pip freeze` lists every installed package in the active virtual environment with exact **`==`** version pins (including transitive dependencies). Your teammate then runs **`python -m venv .venv`**, activates it, and runs **`pip install -r requirements.txt`**.',
          'Compare `pip list` (human-readable table) with `pip freeze` (machine-parseable `package==version` format ready for `requirements.txt`).',
        ],
        keyTerms: [
          {
            term: 'pip freeze',
            definition: 'Outputs all installed packages in the active environment in pinned package==version format.',
          },
          {
            term: 'requirements.txt',
            definition: 'Standard plain-text manifest listing Python dependencies for reproducible installation.',
          },
        ],
        bulletPoints: [
          'Always activate `.venv` *before* running `pip freeze > requirements.txt`, or you will freeze your global Python packages.',
          'Separate optional dev tools (like `pytest`, `black`) into `requirements-dev.txt` for cleaner production builds.',
        ],
      },
      visualise: {
        type: 'freeze-workflow-sim',
        title: 'pip freeze & Reproducible Build Workflow',
        badge: 'simulation',
        description: 'Step through installing packages, freezing requirements.txt, and reproducing in CI.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Parsing & Comparing requirements.txt Pins in Python',
          runMode: 'real',
          code: `req_text = """
# Core web scraping dependencies
requests==2.32.3
beautifulsoup4==4.12.3
"""

pinned = {}
for raw in req_text.splitlines():
    line = raw.strip()
    if line and not line.startswith("#") and "==" in line:
        name, version = line.split("==", 1)
        pinned[name] = version

print("Pinned packages:", pinned)`,
          expectedOutput: "Pinned packages: {'requests': '2.32.3', 'beautifulsoup4': '4.12.3'}",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 10,
          instruction: 'if line and not line.startswith("#")',
          internalEffect: 'Skips blank lines and comments when parsing requirements.txt.',
        },
        {
          step: 2,
          codeLine: 11,
          instruction: 'line.split("==", 1)',
          internalEffect: 'Extracts the package name and exact pinned version string.',
        },
      ],
      apply: {
        domain: 'Release Engineering',
        contextTitle: 'Generating Sorted requirements.txt Output',
        scenario: 'Format an environment dictionary into deterministic, alphabetically sorted `pip freeze` lines.',
        code: `installed = {"urllib3": "2.2.2", "certifi": "2024.7.4", "requests": "2.32.3"}
freeze_output = "\\n".join(f"{pkg}=={ver}" for pkg, ver in sorted(installed.items()))
print(freeze_output)`,
        outcome: `certifi==2024.7.4
requests==2.32.3
urllib3==2.2.2`,
      },
      commonMistakes: [
        {
          label: 'Running pip freeze Without Activating .venv',
          erroneousCode: `# (No .venv active) -> pip freeze > requirements.txt`,
          errorMessage: 'Bloats requirements.txt with 80 unrelated global packages',
          explanation: 'Check for the `(.venv)` prompt or `sys.prefix != sys.base_prefix` before freezing.',
          correctedCode: `# source .venv/bin/activate && pip freeze > requirements.txt`,
        },
      ],
      sourceNotes: 'Covers pip freeze and requirements.txt workflows for Day 23.',
      practise: [
        {
          id: 'd23-ex21',
          title: 'pip freeze vs pip list Output Format',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Why do we redirect `pip freeze > requirements.txt` instead of `pip list > requirements.txt`?',
          contextScenario: 'Preparing a dependency manifest that `pip install -r requirements.txt` can parse cleanly.',
          options: [
            {
              id: 'a',
              text: '`pip freeze` outputs machine-parseable `package==version` lines, whereas `pip list` outputs a human-readable ASCII table.',
              explanation: 'Correct! `pip install -r` expects `package==version` requirements syntax, which `pip freeze` produces.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: '`pip list` only shows standard-library modules.',
              explanation: '`pip list` shows installed third-party packages, just in a table format.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '`pip freeze` automatically uploads packages to PyPI.',
              explanation: '`pip freeze` only prints installed packages and versions to stdout.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: '`pip list` deletes unused packages.',
              explanation: '`pip list` is read-only.',
              isCorrect: false,
            },
          ],
          hints: [
            'Compare the output format of `pip list` (columns/dashes) vs `pip freeze` (`pkg==ver`).',
            'Which format can `pip install -r` read directly?',
          ],
          points: 10,
        },
        {
          id: 'd23-ex22',
          title: 'Trace requirements.txt Diff Comparison',
          type: 'predict-output',
          tier: 'foundation',
          prompt: 'What does this manifest diff check print?',
          contextScenario: 'Checking which packages were added between two `pip freeze` snapshots.',
          starterCode: `old_reqs = {"requests==2.31.0", "certifi==2024.2.2"}
new_reqs = {"requests==2.32.3", "certifi==2024.2.2", "soupsieve==2.5"}

added_or_changed = sorted(new_reqs - old_reqs)
print(added_or_changed)`,
          options: [
            {
              id: 'a',
              text: "['requests==2.32.3', 'soupsieve==2.5']",
              explanation: 'Correct! `certifi==2024.2.2` is unchanged, while `requests==2.32.3` and `soupsieve==2.5` are in `new_reqs` but not `old_reqs`.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: "['soupsieve==2.5']",
              explanation: 'Because `requests` changed version (`2.31.0` -> `2.32.3`), the string `"requests==2.32.3"` is also in `new_reqs - old_reqs`.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: "['requests==2.31.0']",
              explanation: '`new_reqs - old_reqs` keeps items from `new_reqs`, not `old_reqs`.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: "['certifi==2024.2.2']",
              explanation: '`certifi==2024.2.2` is identical in both sets, so set difference removes it.',
              isCorrect: false,
            },
          ],
          hints: [
            'Evaluate set difference `new_reqs - old_reqs`.',
            'Sort the resulting strings alphabetically.',
          ],
          points: 10,
        },
        {
          id: 'd23-ex23',
          title: 'Complete Reproducible Setup Commands',
          type: 'fill-the-gaps',
          tier: 'standard',
          prompt: 'Fill in the missing `pip` flags to export pinned dependencies and install from a manifest.',
          contextScenario: 'Handing off a Python project to a CI/CD pipeline.',
          gaps: [
            {
              id: 'g1',
              beforeText: '# Export active venv packages:\npip ',
              afterText: ' > requirements.txt\n',
              correctAnswer: 'freeze',
              options: ['freeze', 'export', 'dump', 'lock'],
            },
            {
              id: 'g2',
              beforeText: '# Install from manifest:\npip install ',
              afterText: ' requirements.txt',
              correctAnswer: '-r',
              options: ['-r', '-f', '-m', '-i'],
            },
          ],
          hints: [
            'Use `pip freeze` to output `package==version` lines.',
            'Use `-r` (requirements file) with `pip install`.',
          ],
          points: 15,
        },
        {
          id: 'd23-ex24',
          title: 'Order a Teammate Onboarding Workflow',
          type: 'order-the-lines',
          tier: 'standard',
          prompt: 'Order the steps for a teammate cloning a repository with `requirements.txt` for the first time.',
          contextScenario: 'First-time local setup after `git clone`.',
          jumbledLines: [
            { id: 'l3', code: 'pip install -r requirements.txt', indent: 0 },
            { id: 'l1', code: 'python3 -m venv .venv', indent: 0 },
            { id: 'l4', code: 'python app.py', indent: 0 },
            { id: 'l2', code: 'source .venv/bin/activate', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: [
            'Create `.venv`, then activate it.',
            'Install `requirements.txt` before running `python app.py`.',
          ],
          points: 15,
        },
        {
          id: 'd23-ex25',
          title: 'Build a requirements.txt Parser & Validator',
          type: 'write-code',
          tier: 'project',
          prompt: 'Implement `parse_requirements(text)` that ignores blank lines and `#` comments, parses `name==version` lines into a dict, and prints it.',
          contextScenario: 'Validating that every dependency in `requirements.txt` is strictly pinned with `==`.',
          starterCode: `req_file = """
# Production dependencies
fastapi==0.111.0

uvicorn==0.30.1
"""

def parse_requirements(text):
    # TODO: return dict mapping package name -> pinned version
    pass

print(parse_requirements(req_file))`,
          solutionCode: `req_file = """
# Production dependencies
fastapi==0.111.0

uvicorn==0.30.1
"""

def parse_requirements(text):
    result = {}
    for raw in text.splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if "==" in line:
            name, ver = line.split("==", 1)
            result[name.strip()] = ver.strip()
    return result

print(parse_requirements(req_file))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Parses pinned packages and ignores comments/blanks',
              setup: '',
              expected: "{'fastapi': '0.111.0', 'uvicorn': '0.30.1'}",
              hidden: false,
            },
          ],
          hints: [
            'Strip each line and skip if empty or starting with `"#"`.',
            'Split on `"=="` with `maxsplit=1`.',
          ],
          points: 25,
        },
      ],
      assess: [],
    },
    {
      id: 'day23-sub6',
      number: 6,
      title: '.gitignore Hygiene, Recreating & Deleting Environments',
      summary: 'Keep .venv out of Git, upgrade safely, and recreate corrupted environments cleanly.',
      estimatedMinutes: 9,
      introduce: {
        headline: 'Virtual Environments Are Disposable; requirements.txt Is Forever',
        paragraphs: [
          'A golden rule of Python project hygiene: **never commit `.venv/` or `venv/` to Git**. Virtual environments contain thousands of files and OS-specific binaries/symlinks that will not work on a teammate’s different OS.',
          'Instead, add `.venv/` and `venv/` to **`.gitignore`**, and commit **`requirements.txt`** (or `pyproject.toml`).',
          'Because `.venv` is completely self-contained and disposable, if an environment ever gets cluttered or broken, you can simply **`deactivate`**, delete the `.venv` folder (`rm -rf .venv` or `rmdir /s .venv`), and recreate it cleanly from `requirements.txt`.',
        ],
        keyTerms: [
          {
            term: '.gitignore',
            definition: 'Git configuration file listing untracked patterns like .venv/ and __pycache__/ to exclude from commits.',
          },
          {
            term: 'Disposable Environment',
            definition: 'Treating .venv as a reproducible build artifact that can be deleted and rebuilt anytime from requirements.txt.',
          },
        ],
        bulletPoints: [
          'Never rename or move an existing `.venv` folder—hardcoded shebang paths inside `bin/` will break. Delete and recreate it instead.',
          'Upgrade `pip` inside a fresh venv with `python -m pip install --upgrade pip`.',
        ],
      },
      visualise: {
        type: 'freeze-workflow-sim',
        title: '.gitignore & Clean Environment Recreation',
        badge: 'simulation',
        description: 'Review .gitignore exclusions and clean rebuild steps from requirements.txt.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Auditing Project Files Against .gitignore Rules',
          runMode: 'real',
          code: `ignored_prefixes = (".venv/", "venv/", "__pycache__/")
repo_candidates = ["app.py", "requirements.txt", ".venv/bin/python", "__pycache__/app.pyc"]

tracked = [f for f in repo_candidates if not f.startswith(ignored_prefixes)]
print("Safe to commit:", tracked)`,
          expectedOutput: "Safe to commit: ['app.py', 'requirements.txt']",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'ignored_prefixes = (".venv/", "venv/", "__pycache__/")',
          internalEffect: 'Defines environment and bytecode folders that must stay out of version control.',
        },
        {
          step: 2,
          codeLine: 4,
          instruction: 'not f.startswith(ignored_prefixes)',
          internalEffect: 'Filters out .venv and cache artifacts, keeping only source code and requirements.txt.',
        },
      ],
      apply: {
        domain: 'Repository Hygiene',
        contextTitle: 'Validating Required .gitignore Entries',
        scenario: 'Verify that a project’s `.gitignore` includes `.venv/` and `__pycache__/`.',
        code: `gitignore_lines = {".venv/", "__pycache__/", "*.pyc", ".env"}
required = {".venv/", "__pycache__/"}
missing = required - gitignore_lines
print("Missing ignore rules:", missing)`,
        outcome: 'Missing ignore rules: set()',
      },
      commonMistakes: [
        {
          label: 'Committing .venv/ to GitHub',
          erroneousCode: `# git add .   (without .venv/ in .gitignore)`,
          errorMessage: 'Huge repository bloat (5,000+ files) and broken symlinks on other OSes',
          explanation: 'Always add `.venv/` and `venv/` to `.gitignore` before your first `git add`.',
          correctedCode: `# echo ".venv/" >> .gitignore && git add requirements.txt`,
        },
      ],
      sourceNotes: 'Covers .gitignore hygiene and disposable venv rebuilds for Day 23.',
      practise: [
        {
          id: 'd23-ex26',
          title: 'Why .venv Must Be Listed in .gitignore',
          type: 'scenario-mcq',
          tier: 'foundation',
          prompt: 'Why should `.venv/` always be added to `.gitignore` instead of being committed to Git?',
          contextScenario: 'A junior developer runs `git add .` and accidentally stages 4,800 files from `.venv/`.',
          options: [
            {
              id: 'a',
              text: '`.venv/` contains thousands of OS-specific binaries and absolute paths; commit `requirements.txt` instead so anyone can rebuild `.venv` cleanly.',
              explanation: 'Correct! Virtual environments are local, OS-specific, and disposable, while `requirements.txt` is portable.',
              isCorrect: true,
            },
            {
              id: 'b',
              text: 'GitHub rejects repositories containing Python `.py` files.',
              explanation: 'GitHub hosts Python source files; only the generated `.venv/` folder should be ignored.',
              isCorrect: false,
            },
            {
              id: 'c',
              text: '`.gitignore` automatically installs packages on `git pull`.',
              explanation: '`.gitignore` only tells Git which untracked paths to exclude.',
              isCorrect: false,
            },
            {
              id: 'd',
              text: 'Committing `.venv/` deletes `requirements.txt`.',
              explanation: 'It does not delete `requirements.txt`, it bloats the repo and breaks cross-OS portability.',
              isCorrect: false,
            },
          ],
          hints: [
            'Does a macOS `.venv/bin/python` symlink work on Windows?',
            'What lightweight text file replaces committing `.venv/`?',
          ],
          points: 10,
        },
        {
          id: 'd23-ex27',
          title: 'Fix Repository Hygiene Filter',
          type: 'fix-the-bug',
          tier: 'standard',
          prompt: 'Fix `filter_committable(files)` so paths inside `.venv/`, `venv/`, or `__pycache__/` are excluded.',
          contextScenario: 'A pre-commit hook checks that no virtual environment or bytecode artifacts are staged.',
          starterCode: `def filter_committable(files):
    return [f for f in files if not f.startswith("__pycache__/")]

paths = ["main.py", ".venv/pyvenv.cfg", "venv/bin/python", "__pycache__/main.pyc", "requirements.txt"]
print(filter_committable(paths))`,
          solutionCode: `def filter_committable(files):
    ignored = (".venv/", "venv/", "__pycache__/")
    return [f for f in files if not f.startswith(ignored)]

paths = ["main.py", ".venv/pyvenv.cfg", "venv/bin/python", "__pycache__/main.pyc", "requirements.txt"]
print(filter_committable(paths))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Excludes .venv/, venv/, and __pycache__/',
              setup: '',
              expected: "['main.py', 'requirements.txt']",
              hidden: false,
            },
          ],
          hints: [
            '`str.startswith()` accepts a tuple of prefixes: `(".venv/", "venv/", "__pycache__/")`.',
            'Keep only files that do NOT start with any ignored prefix.',
          ],
          points: 15,
        },
        {
          id: 'd23-ex28',
          title: 'Order a Clean Environment Rebuild',
          type: 'order-the-lines',
          tier: 'standard',
          prompt: 'Arrange the commands to safely tear down a corrupted `.venv` and rebuild it from `requirements.txt`.',
          contextScenario: 'Recovering from a broken dependency upgrade inside `.venv`.',
          jumbledLines: [
            { id: 'l3', code: 'python3 -m venv .venv', indent: 0 },
            { id: 'l1', code: 'deactivate', indent: 0 },
            { id: 'l4', code: 'source .venv/bin/activate && pip install -r requirements.txt', indent: 0 },
            { id: 'l2', code: 'rm -rf .venv', indent: 0 },
          ],
          correctLineOrder: ['l1', 'l2', 'l3', 'l4'],
          hints: [
            'Always `deactivate` before deleting the active `.venv` directory.',
            'Delete `.venv`, recreate it, then activate and install `requirements.txt`.',
          ],
          points: 15,
        },
        {
          id: 'd23-ex29',
          title: 'Trace What Happens When Deleting .venv',
          type: 'explain-the-trace',
          tier: 'challenge',
          prompt: 'Explain why deleting `.venv` (`rm -rf .venv`) does NOT delete your Python source code (`app.py`, `requirements.txt`) or your system Python installation.',
          contextScenario: 'A learner hesitates to delete a broken `.venv` folder for fear of losing their code or breaking Python.',
          traceStepCode: `# Project layout:
# my_app/
#   ├── app.py
#   ├── requirements.txt
#   └── .venv/   <-- self-contained copy/symlink + site-packages`,
          traceQuestion: 'Why is removing `.venv/` safe for both your project code and global Python?',
          modelAnswer: '`.venv/` only holds environment-specific executables/symlinks, `pyvenv.cfg`, and downloaded third-party `site-packages`. Your own source files (`app.py`, `requirements.txt`) live outside `.venv/`, and the global base Python lives in its OS installation directory. Deleting `.venv/` leaves both untouched and can be rebuilt from `requirements.txt`.',
          markingCriteria: [
            { id: 'c1', label: 'Clarifies that .venv only holds isolated packages and symlinks', points: 10 },
            { id: 'c2', label: 'Confirms source files and base Python remain untouched', points: 10 },
          ],
          hints: [
            'Where do `app.py` and `requirements.txt` live relative to `.venv/`?',
            'Does deleting a symlink inside `.venv/bin/` delete the base Python binary?',
          ],
          points: 20,
        },
        {
          id: 'd23-ex30',
          title: 'Audit Project Hygiene Readiness',
          type: 'write-code',
          tier: 'project',
          prompt: 'Implement `audit_repo(files, gitignore_rules)` returning `"READY"` if `"requirements.txt"` is in `files`, `".venv/"` is in `gitignore_rules`, and no `.venv/` path is in `files`; otherwise return `"ISSUES"`.',
          contextScenario: 'Automated CI repository hygiene gate for Python microservices.',
          starterCode: `def audit_repo(files, gitignore_rules):
    # TODO: verify requirements.txt present, .venv/ ignored, and no .venv/ files tracked
    pass

print(audit_repo(["app.py", "requirements.txt"], {".venv/", "__pycache__/"}))
print(audit_repo(["app.py", ".venv/bin/python"], {".venv/"}))`,
          solutionCode: `def audit_repo(files, gitignore_rules):
    has_reqs = "requirements.txt" in files
    ignores_venv = ".venv/" in gitignore_rules
    no_tracked_venv = not any(f.startswith(".venv/") for f in files)
    return "READY" if (has_reqs and ignores_venv and no_tracked_venv) else "ISSUES"

print(audit_repo(["app.py", "requirements.txt"], {".venv/", "__pycache__/"}))
print(audit_repo(["app.py", ".venv/bin/python"], {".venv/"}))`,
          testCases: [
            {
              id: 'tc1',
              label: 'Passes clean repo and flags tracked .venv/',
              setup: '',
              expected: 'READY\nISSUES',
              hidden: false,
            },
          ],
          hints: [
            'Check `"requirements.txt" in files` and `".venv/" in gitignore_rules`.',
            'Check `not any(f.startswith(".venv/") for f in files)`.',
          ],
          points: 25,
        },
      ],
      assess: [],
    },
  ],
  realWorldLabs: [
    {
      id: 'day23-lab-1',
      title: 'Multi-Service Dependency Conflict & Isolation Auditor',
      domain: 'Platform Engineering',
      description: 'Compare two microservice dependency manifests, detect conflicting pinned versions that forbid a shared global environment, and output a JSON isolation report.',
      starterCode: `import json

SERVICE_A = {"requests": "2.28.1", "pydantic": "1.10.12", "click": "8.1.7"}
SERVICE_B = {"requests": "2.32.3", "pydantic": "2.7.1", "click": "8.1.7"}

# TODO: Identify conflicting keys, compute sorted list, and print JSON:
# {"needs_separate_venvs": true, "conflicts": ["pydantic", "requests"]}
`,
      targetOutput: '{"needs_separate_venvs": true, "conflicts": ["pydantic", "requests"]}',
    },
    {
      id: 'day23-lab-2',
      title: 'CI/CD Environment & requirements.txt Preflight Validator',
      domain: 'DevOps Automation',
      description: 'Verify runtime isolation (prefix != base_prefix), parse requirements.txt ignoring comments/blank lines, and confirm .venv/ is excluded in .gitignore.',
      starterCode: `import json

ENV_STATE = {"prefix": "/ci/job/.venv", "base_prefix": "/usr/local/python3.12"}
REQ_TXT = """
# API deps
httpx==0.27.0
pydantic==2.7.1
"""
GITIGNORE = {".venv/", "__pycache__/", "*.pyc"}

# TODO: Validate isolated = (prefix != base_prefix), parse pinned count, check .venv/ in GITIGNORE
# Print JSON: {"isolated": true, "pinned_count": 2, "gitignore_ok": true}
`,
      targetOutput: '{"isolated": true, "pinned_count": 2, "gitignore_ok": true}',
    },
  ],
  miniProject: {
    id: 'day23-project',
    title: 'Environment Isolation & Reproducible Manifest Auditor',
    brief: 'Build a complete Python environment & repository hygiene auditor that validates runtime venv isolation (sys.prefix != sys.base_prefix), parses and sorts pinned requirements.txt entries, flags unpinned dependencies, and verifies .gitignore excludes .venv/.',
    requirements: [
      'Verify runtime isolation by comparing prefix against base_prefix.',
      'Parse requirements.txt while skipping blank lines and # comments.',
      'Flag any dependency line lacking an exact == pin.',
      'Confirm .venv/ and __pycache__/ are present in .gitignore rules.',
      'Export a clean JSON audit summary via json.dumps.',
    ],
    rubric: [
      { criterion: 'Runtime isolation & .gitignore hygiene checks', weight: 35 },
      { criterion: 'Accurate requirements.txt parsing & unpinned detection', weight: 35 },
      { criterion: 'Clean JSON audit output & edge-case handling', weight: 30 },
    ],
    starterCode: `import json

def run_env_audit(prefix, base_prefix, req_text, gitignore_set):
    # TODO: implement full environment & manifest audit
    pass

SAMPLE_REQS = """
# Core
requests==2.32.3
beautifulsoup4==4.12.3
"""
print(run_env_audit("/app/.venv", "/usr/bin/py312", SAMPLE_REQS, {".venv/", "__pycache__/"}))
`,
  },
  dayQuiz: {
    title: 'Day 23 Mastery Checkpoint: Virtual Environments',
    passingScorePercentage: 80,
    questions: [
      {
        id: 'd23-q1',
        scenario: 'Project A requires `django==4.2` and Project B requires `django==5.1` on the same laptop.',
        question: 'How do virtual environments solve this?',
        options: [
          {
            id: 'a',
            text: 'Each project gets its own `.venv` with an isolated `site-packages` directory.',
            explanation: 'Correct! Separate `site-packages` directories allow incompatible versions side by side.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Python automatically downloads both versions into global `site-packages`.',
            explanation: 'Global `site-packages` can only hold one version of a package.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Using `sudo pip install` isolates both projects.',
            explanation: '`sudo pip install` pollutes global system Python.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Renaming `django` inside `site-packages` fixes it.',
            explanation: 'Renaming breaks imports and metadata.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd23-q2',
        scenario: 'You have Python 3.12 installed and want to create a new virtual environment named `.venv`.',
        question: 'Which standard-library command creates it?',
        options: [
          {
            id: 'a',
            text: '`python -m venv .venv`',
            explanation: 'Correct! `venv` is built into Python’s standard library.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: '`pip venv create .venv`',
            explanation: '`pip` does not create virtual environments.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: '`python --venv-init .venv`',
            explanation: '`--venv-init` is not a valid flag.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: '`git init .venv`',
            explanation: '`git init` creates a Git repository, not a Python venv.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd23-q3',
        scenario: 'You inspect `.venv/pyvenv.cfg` after creating an environment.',
        question: 'What does `include-system-site-packages = false` guarantee?',
        options: [
          {
            id: 'a',
            text: 'Packages installed in global Python will not leak into `.venv`.',
            explanation: 'Correct! Setting it to `false` (the default) enforces strict isolation.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'The standard library (`sys`, `json`) is disabled.',
            explanation: 'The standard library is always available.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: '`pip` cannot install any packages.',
            explanation: '`pip` installs into `.venv`’s own `site-packages`.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Git will ignore `.venv` automatically.',
            explanation: 'Git uses `.gitignore`, not `pyvenv.cfg`.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd23-q4',
        scenario: 'You are on macOS or Linux using `bash` or `zsh` and want to activate `.venv`.',
        question: 'Which command activates `.venv` in your current terminal session?',
        options: [
          {
            id: 'a',
            text: '`source .venv/bin/activate`',
            explanation: 'Correct! `source` updates `PATH` and `VIRTUAL_ENV` in the active shell.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: '`.venv/Scripts/Activate.ps1`',
            explanation: '`Scripts\\Activate.ps1` is for Windows PowerShell.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: '`python .venv/activate.py`',
            explanation: 'There is no `activate.py` script.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: '`pip activate .venv`',
            explanation: '`pip` has no `activate` subcommand.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd23-q5',
        scenario: 'On Windows PowerShell, you created `.venv` in your project root.',
        question: 'Where are `python.exe` and `Activate.ps1` located?',
        options: [
          {
            id: 'a',
            text: 'Inside `.venv\\Scripts\\`',
            explanation: 'Correct! Windows virtual environments use `Scripts\\` instead of `bin/`.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Inside `.venv\\bin\\`',
            explanation: '`bin/` is used on macOS and Linux.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Inside `.venv\\lib\\`',
            explanation: '`lib/` holds `site-packages`, not activation scripts.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Inside `C:\\Windows\\System32\\`',
            explanation: 'Venv executables live inside the `.venv` folder.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd23-q6',
        scenario: 'Inside a running Python script, you check `sys.prefix != sys.base_prefix` and get `True`.',
        question: 'What does `True` confirm?',
        options: [
          {
            id: 'a',
            text: 'The script is currently executing inside an active virtual environment.',
            explanation: 'Correct! `sys.prefix` points to `.venv` while `sys.base_prefix` points to base Python.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'The script is running in global Python.',
            explanation: 'Global Python has `sys.prefix == sys.base_prefix`.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Your `requirements.txt` is out of date.',
            explanation: '`sys.prefix` does not inspect `requirements.txt`.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'A syntax error occurred during import.',
            explanation: 'It is a normal boolean check.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd23-q7',
        scenario: 'Running bare `pip install flask` installs Flask into Python 3.10 globally, while `python` runs `.venv` (Python 3.12).',
        question: 'Which command guarantees `pip` installs into the exact interpreter running `python`?',
        options: [
          {
            id: 'a',
            text: '`python -m pip install flask`',
            explanation: 'Correct! Invoking `pip` via `python -m pip` binds `pip` to that exact Python interpreter.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: '`pip --global install flask`',
            explanation: 'That would target global Python.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: '`pip install --user flask`',
            explanation: '`--user` installs into user-global site-packages, not `.venv`.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: '`flask --install`',
            explanation: 'Not a valid command.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd23-q8',
        scenario: 'You want to save exact `package==version` pins from your active `.venv` so a teammate can reproduce it.',
        question: 'Which command generates the manifest?',
        options: [
          {
            id: 'a',
            text: '`pip freeze > requirements.txt`',
            explanation: 'Correct! `pip freeze` outputs pinned `package==version` lines.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: '`pip list > requirements.txt`',
            explanation: '`pip list` outputs a formatted table that `pip install -r` cannot parse.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: '`python -m venv requirements.txt`',
            explanation: 'That would try to create a venv directory named `requirements.txt`.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: '`pip show * > requirements.txt`',
            explanation: '`pip show` outputs multi-line metadata.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd23-q9',
        scenario: 'You are preparing your first Git commit for a new Python project.',
        question: 'Which pair of actions follows industry best practice?',
        options: [
          {
            id: 'a',
            text: 'Add `.venv/` to `.gitignore` and commit `requirements.txt`.',
            explanation: 'Correct! Never commit `.venv/`; commit `requirements.txt` so others can rebuild it.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Commit `.venv/` and add `requirements.txt` to `.gitignore`.',
            explanation: 'This is backwards—commit `requirements.txt`, ignore `.venv/`.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Commit both `.venv/` and `__pycache__/`.',
            explanation: 'Both are generated artifacts that bloat Git history.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Delete `requirements.txt` after creating `.venv/`.',
            explanation: 'Keep `requirements.txt` in version control.',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'd23-q10',
        scenario: 'You accidentally renamed your project folder and scripts inside `.venv/bin/` fail with `bad interpreter`.',
        question: 'What is the cleanest fix?',
        options: [
          {
            id: 'a',
            text: '`deactivate`, delete `.venv`, recreate it with `python -m venv .venv`, and run `pip install -r requirements.txt`.',
            explanation: 'Correct! Virtual environments are disposable and should be rebuilt rather than manually patched.',
            isCorrect: true,
          },
          {
            id: 'b',
            text: 'Reinstall your operating system.',
            explanation: 'Completely unnecessary.',
            isCorrect: false,
          },
          {
            id: 'c',
            text: 'Copy `.venv` into `/usr/bin/`.',
            explanation: 'Never copy a project venv into `/usr/bin/`.',
            isCorrect: false,
          },
          {
            id: 'd',
            text: 'Delete `app.py` and keep `.venv`.',
            explanation: 'Never delete your source code!',
            isCorrect: false,
          },
        ],
      },
    ],
  },
  cheatSheet: [
    {
      category: 'Dependency Isolation & Conflicts',
      syntax: 'One .venv per project directory',
      description: 'Prevent version collisions between projects and avoid polluting global system Python (PEP 668).',
      example: `# Project A: .venv with requests==2.28.1
# Project B: .venv with requests==2.32.3
# Both coexist cleanly on the same machine`,
    },
    {
      category: 'Creating Virtual Environments (venv)',
      syntax: 'python -m venv .venv',
      description: 'Use Python’s built-in venv module to create an isolated .venv folder with its own site-packages.',
      example: `python3 -m venv .venv
# Programmatic creation:
import venv; venv.create(".venv", with_pip=True)`,
    },
    {
      category: 'pyvenv.cfg & Directory Anatomy',
      syntax: 'include-system-site-packages = false',
      description: 'pyvenv.cfg links .venv to base Python while keeping global packages excluded by default.',
      example: `# .venv/pyvenv.cfg
home = /usr/local/bin
include-system-site-packages = false
version = 3.12.4`,
    },
    {
      category: 'Activation on macOS & Linux',
      syntax: 'source .venv/bin/activate',
      description: 'Source the POSIX activate script to prepend .venv/bin to PATH in your current shell.',
      example: `source .venv/bin/activate
which python   # -> /project/.venv/bin/python`,
    },
    {
      category: 'Activation on Windows (PowerShell / CMD)',
      syntax: '.venv\\Scripts\\Activate.ps1',
      description: 'Windows stores executables in Scripts\\; use Activate.ps1 in PowerShell or activate.bat in CMD.',
      example: `# PowerShell: .venv\\Scripts\\Activate.ps1
# CMD:        .venv\\Scripts\\activate.bat`,
    },
    {
      category: 'Deactivation & Direct Execution',
      syntax: 'deactivate | .venv/bin/python script.py',
      description: 'Run deactivate to restore original PATH, or invoke .venv/bin/python directly in cron/CI.',
      example: `deactivate
# Or run without activating in cron/CI:
/srv/app/.venv/bin/python /srv/app/job.py`,
    },
    {
      category: 'Runtime Isolation Check (sys.prefix)',
      syntax: 'sys.prefix != sys.base_prefix',
      description: 'Verify inside Python that the interpreter is running inside an active virtual environment.',
      example: `import sys
in_venv = sys.prefix != sys.base_prefix
print("Isolated:", in_venv, "Exec:", sys.executable)`,
    },
    {
      category: 'Safe Package Installation (python -m pip)',
      syntax: 'python -m pip install <package>',
      description: 'Always invoke pip via python -m pip so packages install into the exact active interpreter.',
      example: `python -m pip install --upgrade pip
python -m pip install requests==2.32.3`,
    },
    {
      category: 'Pinning & Reproducing (pip freeze)',
      syntax: 'pip freeze > requirements.txt',
      description: 'Capture exact package==version pins and reproduce them on any machine with pip install -r.',
      example: `pip freeze > requirements.txt
# On teammate / CI machine:
pip install -r requirements.txt`,
    },
    {
      category: '.gitignore Hygiene & Disposable Rebuilds',
      syntax: 'echo ".venv/" >> .gitignore',
      description: 'Never commit .venv/ to Git; commit requirements.txt and delete/recreate .venv whenever needed.',
      example: `# .gitignore: .venv/  venv/  __pycache__/
deactivate && rm -rf .venv
python3 -m venv .venv && pip install -r requirements.txt`,
    },
  ],
  sourceNotes: [
    'Curriculum reference: https://github.com/Asabeneh/30-Days-Of-Python/tree/master/23_Day_Virtual_environment',
  ],
};
