/**
 * Day 1 Module: Introduction to Python
 * Master Specification Section 14 (Day 1 Build Brief), Section 13.2 (Part A & Part B), Section 10.2
 * Source attribution: Asabeneh Yetayeh's "30 Days of Python"
 */

import { DayModule } from '../../engine/lesson/types';

export const DAY_1_MODULE: DayModule = {
  schemaVersion: 1,
  number: 1,
  title: 'Introduction to Python',
  level: 'beginner',
  sourceUrl: 'https://github.com/Asabeneh/30-Days-Of-Python/blob/master/01_Day_Introduction/01_day_introduction.md',
  estimatedMinutes: 75,
  prerequisites: [],
  objectives: [
    'Understand what Python is, its history, design philosophy, and widespread real-world applications.',
    'Set up and verify a Python installation on Windows, macOS, or Linux, and understand the role of modern code editors.',
    'Distinguish between the interactive shell (REPL) and script files (.py), understanding automatic expression echo versus explicit print().',
    'Master core Python syntax rules, statement separation, and significant 4-space indentation (PEP 8).',
    'Write single-line and multiline comments effectively to document intent.',
    'Identify fundamental Python data types (int, float, str, bool, list) and use print() and type().',
    'Read tracebacks from bottom to top and diagnose common beginner syntax and indentation errors.',
  ],
  sourceNotes: [
    'Original concepts adapted from Day 1 of "30 Days of Python" by Asabeneh Yetayeh (MIT License).',
    'Extended with CPython virtual machine internals, interactive instruction journey, indentation visualizer, and Nigerian industry application scenarios.',
  ],
  subtopics: [
    // ==========================================
    // Subtopic 1: What Python Is
    // ==========================================
    {
      id: 'day1-sub1',
      number: 1,
      title: 'What Python Is',
      summary: 'High-level, interpreted programming designed for human readability and high developer velocity.',
      estimatedMinutes: 6,
      introduce: {
        headline: 'An Interpreted, Readability-First Language',
        paragraphs: [
          'Python is an open-source, high-level, general-purpose programming language created by Guido van Rossum and first released in February 1991. Its core philosophy emphasizes code readability, clean typography, and a "batteries included" standard library.',
          'Unlike languages that compile directly to raw machine code (such as C or C++), standard Python (CPython) is interpreted: your source code is translated on the fly into an Abstract Syntax Tree (AST), compiled into intermediate bytecode (.pyc), and executed inside the Python Virtual Machine (PVM).',
          'Python supports multiple programming paradigms—procedural, object-oriented, and functional—allowing beginners to start with simple linear scripts and scale up to enterprise-grade architectures.',
        ],
        keyTerms: [
          { term: 'Interpreted Language', definition: 'A language whose instructions are executed directly or via virtual machine without prior manual compilation to CPU machine code.' },
          { term: 'CPython', definition: 'The reference implementation of Python written in C, which compiles Python source into bytecode and runs it on the PVM.' },
          { term: 'PVM', definition: 'Python Virtual Machine: the runtime engine loop that executes compiled bytecode instructions.' },
        ],
      },
      visualise: {
        type: 'instruction-journey',
        title: 'Instruction Journey: Source to PVM Execution',
        badge: 'simulation',
        description: 'Watch how your written code is tokenized, parsed into an AST, compiled into bytecode opcodes, and executed on the virtual machine stack.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Welcome Script',
          code: `message = "Welcome to 30 Days of Python!"\nprint(message)\nprint("Let's build with Python.")`,
          runMode: 'real',
          expectedOutput: "Welcome to 30 Days of Python!\nLet's build with Python.",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'message = "Welcome to 30 Days of Python!"',
          internalEffect: 'Allocates a string object in heap memory with value "Welcome to 30 Days of Python!" and binds the name "message" in the global namespace.',
        },
        {
          step: 2,
          codeLine: 2,
          instruction: 'print(message)',
          internalEffect: 'Looks up the built-in function print, retrieves the string object bound to "message", and writes its contents to sys.stdout.',
          outputEffect: 'Welcome to 30 Days of Python!',
        },
        {
          step: 3,
          codeLine: 3,
          instruction: 'print("Let\'s build with Python.")',
          internalEffect: 'Directly passes literal string constant to print() and flushes newline to stdout.',
          outputEffect: "Let's build with Python.",
        },
      ],
      apply: {
        contextTitle: 'Tech Hub Orientation',
        scenario: 'A developer onboarding script at a technology innovation hub in Yaba, Lagos.',
        code: `hub_name = "CcHUB Yaba"\ncohort = "2026 Developer Fellowship"\nprint(f"Welcome to {hub_name}!")\nprint(f"Enrolled Cohort: {cohort}")`,
        outcome: 'CcHUB Yaba - Welcome to 2026 Developer Fellowship',
        domain: 'school',
      },
      commonMistakes: [
        {
          label: 'Case Sensitivity in Function Names',
          erroneousCode: 'Print("Hello World")',
          errorMessage: "NameError: name 'Print' is not defined. Did you mean: 'print'?",
          explanation: 'Python identifiers are strictly case-sensitive. The built-in printing function is lowercase print(), not Print() or PRINT().',
          correctedCode: 'print("Hello World")',
        },
      ],
      practise: [
        {
          id: 'd1-s1-ex1',
          title: 'Foundation: The CPython Pipeline',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          prompt: 'A software engineering fellow at a technology incubator in Yaba writes a Python program. What exact transformation happens before their code executes on the processor?',
          contextScenario: 'Engineering Onboarding in Lagos',
          hints: [
            'Python does not compile straight to binary machine code like C or Rust.',
            'CPython generates an intermediate, platform-neutral representation (.pyc).',
            'This intermediate format is called bytecode, evaluated by the PVM.',
          ],
          options: [
            {
              id: 'opt-1',
              text: 'Source code is compiled into intermediate bytecode (.pyc), which is then interpreted by the Python Virtual Machine (PVM).',
              explanation: 'Correct! CPython translates AST into bytecode opcodes, which the PVM loop runs on a virtual evaluation stack.',
              isCorrect: true,
            },
            {
              id: 'opt-2',
              text: 'Source code is compiled directly into hardware-specific binary assembly by an ahead-of-time compiler.',
              explanation: 'Incorrect. That describes natively compiled languages like C, C++, or Go.',
              isCorrect: false,
            },
            {
              id: 'opt-3',
              text: 'The operating system kernel directly reads the plain text file line by line without any tokenization or bytecode.',
              explanation: 'Incorrect. Operating system kernels cannot parse Python text without the Python runtime interpreter.',
              isCorrect: false,
            },
            {
              id: 'opt-4',
              text: 'The text is converted into JavaScript and executed in the local browser engine.',
              explanation: 'Incorrect. While Pyodide allows Python to run in WebAssembly in this lab, standard CPython runs directly on the OS via the PVM.',
              isCorrect: false,
            },
          ],
        },
        {
          id: 'd1-s1-ex2',
          title: 'Standard: Interpreted vs Compiled Trade-offs',
          type: 'theory-reasoning',
          tier: 'standard',
          points: 15,
          prompt: 'A financial payment gateway in Lagos is deciding whether to write automated daily reconciliation scripts in Python or C++. Explain why Python is preferred for developer velocity and rapid iteration, and identify one scenario where C++ would be chosen instead.',
          contextScenario: 'Fintech Architecture Review in Marina, Lagos',
          hints: [
            'Consider the time required to write, test, and modify scripts without a manual compile-link cycle.',
            'Think about memory safety and dynamic typing versus manual pointer management.',
            'Consider extreme low-latency environments like high-frequency algorithmic trade matching.',
          ],
          modelAnswer: 'Python is preferred for reconciliation scripts because it offers rapid developer velocity: no manual compilation or linking steps, concise expressive syntax, dynamic typing, and built-in standard libraries for CSV, JSON, and database connectivity. Developers can write, test, and adapt business rules in minutes. However, C++ would be chosen for ultra-low latency scenarios (such as microsecond-level algorithmic order matching or direct hardware NIC packet capture) where raw CPU execution speed and deterministic memory management outweigh developer iteration speed.',
          markingCriteria: [
            { id: 'crit-1', label: 'Mentions developer iteration velocity and absence of compile-link wait cycles', points: 5 },
            { id: 'crit-2', label: 'Identifies standard library richness and expressive syntax for data processing', points: 5 },
            { id: 'crit-3', label: 'Accurately identifies ultra-low latency / high-frequency execution as the domain for C++', points: 5 },
          ],
        },
      ],
      assess: [],
    },

    // ==========================================
    // Subtopic 2: Why It Is Useful
    // ==========================================
    {
      id: 'day1-sub2',
      number: 2,
      title: 'Why Python Is Useful',
      summary: 'Batteries included, readable English-like syntax, massive ecosystem, and rapid development cycles.',
      estimatedMinutes: 6,
      introduce: {
        headline: 'Designed for Developer Productivity',
        paragraphs: [
          'Python is among the world\'s most popular programming languages because it minimizes cognitive overhead. Where other languages require boilerplate setup—such as class definitions, type declarations, or memory management—Python lets you express complex ideas in fewer, cleaner lines of code.',
          'The "Zen of Python" (accessible by running import this) captures this philosophy: "Beautiful is better than ugly. Explicit is better than implicit. Simple is better than complex. Readability counts."',
          'Its "batteries included" philosophy means Python comes out of the box with modules for math, file manipulation, cryptography, networking, data compression, and web protocols, eliminating the need to install third-party libraries for standard tasks.',
        ],
        keyTerms: [
          { term: 'Zen of Python', definition: 'A collection of nineteen software design guiding principles written by Tim Peters.' },
          { term: 'Batteries Included', definition: 'The philosophy that the standard library should provide comprehensive built-in tools for everyday tasks.' },
        ],
      },
      visualise: {
        type: 'instruction-journey',
        title: 'Python Expressiveness vs Low-Level Boilerplate',
        badge: 'simulation',
        description: 'Observe how Python abstracts memory allocation and pointers into intuitive high-level operations.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Expressive Readability',
          code: `# Demonstrating clean Python readability\nname = "Amaka"\nskills = ["Python", "Data", "Automation"]\nprint(f"Developer: {name}")\nprint(f"Core Skills: {len(skills)} tools mastered")`,
          runMode: 'real',
          expectedOutput: 'Developer: Amaka\nCore Skills: 3 tools mastered',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 2,
          instruction: 'name = "Amaka"',
          internalEffect: 'CPython creates an immutable str object in heap memory.',
        },
        {
          step: 2,
          codeLine: 3,
          instruction: 'skills = ["Python", "Data", "Automation"]',
          internalEffect: 'Creates a mutable list array containing 3 pointers to string constants.',
        },
        {
          step: 3,
          codeLine: 4,
          instruction: 'print(f"Developer: {name}")',
          internalEffect: 'Evaluates the f-string template by substituting the value of "name" and writes to stdout.',
          outputEffect: 'Developer: Amaka',
        },
        {
          step: 4,
          codeLine: 5,
          instruction: 'print(f"Core Skills: {len(skills)} tools mastered")',
          internalEffect: 'Calls built-in len() which reads the ob_size field of the list in O(1) constant time, then prints the formatted string.',
          outputEffect: 'Core Skills: 3 tools mastered',
        },
      ],
      apply: {
        contextTitle: 'SME Invoice Header',
        scenario: 'A retail invoicing tool for an electronics distributor in Alaba International Market.',
        code: `business = "Alaba Electrics Ltd"\ninvoice_num = 1042\nstatus = "PAID"\nprint(f"[{status}] Invoice #{invoice_num} - {business}")`,
        outcome: '[PAID] Invoice #1042 - Alaba Electrics Ltd',
        domain: 'finance',
      },
      commonMistakes: [
        {
          label: 'Forgetting Parentheses in print',
          erroneousCode: 'print "Hello Nigeria"',
          errorMessage: "SyntaxError: Missing parentheses in call to 'print'. Did you mean print(...)?",
          explanation: 'In Python 2, print was a statement. In modern Python 3, print() is a function and requires parentheses around its arguments.',
          correctedCode: 'print("Hello Nigeria")',
        },
      ],
      practise: [
        {
          id: 'd1-s2-ex1',
          title: 'Foundation: Predict Output with Built-ins',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          prompt: 'Predict the exact output of this student verification snippet in an Abuja computer lab:',
          contextScenario: 'School Computer Lab User Profile',
          starterCode: `user = "Chidi"\ngrade = 11\nprint("Student:", user)\nprint(f"Class Level: SS{grade - 9}")`,
          hints: [
            'Notice that print() with commas automatically separates arguments with a single space.',
            'The f-string evaluates {grade - 9} before formatting: 11 - 9 = 2.',
          ],
          options: [
            {
              id: 'opt-a',
              text: 'Student: Chidi\nClass Level: SS2',
              explanation: 'Correct! print("Student:", user) prints with a space separator, and {11 - 9} evaluates to 2.',
              isCorrect: true,
            },
            {
              id: 'opt-b',
              text: 'Student:Chidi\nClass Level: SS11',
              explanation: 'Incorrect. print with a comma adds an automatic space separator, and {grade - 9} evaluates to 2, not 11.',
              isCorrect: false,
            },
            {
              id: 'opt-c',
              text: 'Student: Chidi\nClass Level: SS{grade - 9}',
              explanation: 'Incorrect. An f-string evaluates expressions inside curly brackets rather than printing them literally.',
              isCorrect: false,
            },
          ],
        },
        {
          id: 'd1-s2-ex2',
          title: 'Standard: Zen of Python Principles',
          type: 'fill-the-gaps',
          tier: 'standard',
          points: 15,
          prompt: 'Complete the famous aphorisms from Tim Peters\' "The Zen of Python" (import this):',
          contextScenario: 'Software Engineering Best Practices Seminar',
          gaps: [
            {
              id: 'gap-1',
              beforeText: 'Beautiful is better than ',
              afterText: '.',
              correctAnswer: 'ugly',
              options: ['ugly', 'complex', 'slow', 'verbose'],
            },
            {
              id: 'gap-2',
              beforeText: 'Explicit is better than ',
              afterText: '.',
              correctAnswer: 'implicit',
              options: ['implicit', 'hidden', 'manual', 'dynamic'],
            },
            {
              id: 'gap-3',
              beforeText: 'Simple is better than ',
              afterText: '.',
              correctAnswer: 'complex',
              options: ['complex', 'complicated', 'nested', 'difficult'],
            },
          ],
          hints: [
            'The Zen of Python prefers readable and honest code over clever or obfuscated tricks.',
            'Think about clarity and obviousness.',
          ],
        },
      ],
      assess: [],
    },

    // ==========================================
    // Subtopic 3: Where It Is Used
    // ==========================================
    {
      id: 'day1-sub3',
      number: 3,
      title: 'Where Python Is Used',
      summary: 'Web engineering, data science, artificial intelligence, scripting, fintech, and education.',
      estimatedMinutes: 6,
      introduce: {
        headline: 'The Lingua Franca of Modern Computing',
        paragraphs: [
          'Python is not a single-purpose tool; it dominates numerous multi-billion dollar industries:',
          '1. Web Development: High-performance backends and REST APIs powered by Django, Flask, and FastAPI (Instagram, Spotify, Netflix).',
          '2. Data Science & Machine Learning: The undisputed standard for data analysis and AI models using NumPy, Pandas, PyTorch, and TensorFlow.',
          '3. Automation & DevOps: System scripting, cloud infrastructure management, and robotic process automation (RPA).',
          '4. Fintech & Banking: Transaction processing, fraud detection algorithms, and automated reconciliation systems across African and global banking networks.',
          '5. Education & Scientific Research: Academic computing, bioinformatics, astronomy, and physics simulations.',
        ],
        keyTerms: [
          { term: 'Web Framework', definition: 'A library such as FastAPI or Django providing routing, authentication, and database access for web apps.' },
          { term: 'Machine Learning', definition: 'Algorithms that learn patterns from training data, implemented predominantly in Python.' },
        ],
      },
      visualise: {
        type: 'instruction-journey',
        title: 'Python Across Industrial Domains',
        badge: 'simulation',
        description: 'Explore the vast ecosystem of libraries that power modern industry applications.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Iterating Through Domains',
          code: `domains = ["Web Development", "Artificial Intelligence", "Data Science", "Automation"]\nfor domain in domains:\n    print(f"• Python powers: {domain}")`,
          runMode: 'real',
          expectedOutput: '• Python powers: Web Development\n• Python powers: Artificial Intelligence\n• Python powers: Data Science\n• Python powers: Automation',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'domains = [...]',
          internalEffect: 'Instantiates a list object holding string references to four industrial domain names.',
        },
        {
          step: 2,
          codeLine: 2,
          instruction: 'for domain in domains:',
          internalEffect: 'Creates an internal iterator over the list, binding the name "domain" to each item in sequence.',
        },
        {
          step: 3,
          codeLine: 3,
          instruction: 'print(f"• Python powers: {domain}")',
          internalEffect: 'Prints each domain bullet item sequentially across four loop iterations.',
          outputEffect: 'Outputs 4 bullet lines to stdout.',
        },
      ],
      apply: {
        contextTitle: 'Fintech Transaction Router',
        scenario: 'Categorizing payment channels in an automated Lagos payment gateway.',
        code: `channels = ["USSD", "Bank Transfer", "Debit Card", "QR Pay"]\nprint(f"Active Gateways: {len(channels)}")\nprint("Primary:", channels[1])`,
        outcome: 'Active Gateways: 4\nPrimary: Bank Transfer',
        domain: 'finance',
      },
      commonMistakes: [
        {
          label: 'Unclosed String Quotes',
          erroneousCode: 'print("Fintech Gateway)',
          errorMessage: 'SyntaxError: unterminated string literal (detected at line 1)',
          explanation: 'Strings must start and end with matching quotation marks (either single \' or double ").',
          correctedCode: 'print("Fintech Gateway")',
        },
      ],
      practise: [
        {
          id: 'd1-s3-ex1',
          title: 'Foundation: Library Selection for Industry',
          type: 'scenario-mcq',
          tier: 'foundation',
          points: 10,
          prompt: 'An agriculture technology cooperative in Kaduna wants to build: (1) a computer vision model to detect cassava leaf diseases, and (2) a high-speed REST API for farmers to query diagnoses via mobile phones. Which pair of Python technologies is most standard for these tasks?',
          contextScenario: 'AgriTech Disease Diagnosis System in Northern Nigeria',
          hints: [
            'Look for the leading deep learning framework alongside a modern, async REST API framework.',
            'PyTorch / TensorFlow power vision models, while FastAPI / Django power modern APIs.',
          ],
          options: [
            {
              id: 'opt-agri-1',
              text: 'PyTorch for the vision model, and FastAPI for the REST API.',
              explanation: 'Correct! PyTorch is industry-standard for deep learning computer vision, and FastAPI is optimized for asynchronous, type-annotated web APIs.',
              isCorrect: true,
            },
            {
              id: 'opt-agri-2',
              text: 'Pygame for the vision model, and SQLite for the REST API.',
              explanation: 'Incorrect. Pygame is designed for 2D game loops, and SQLite is an embedded relational database engine, not an HTTP API framework.',
              isCorrect: false,
            },
            {
              id: 'opt-agri-3',
              text: 'Tkinter for the vision model, and sys.stdout for the REST API.',
              explanation: 'Incorrect. Tkinter is an old desktop GUI toolkit, and sys.stdout is standard console output stream.',
              isCorrect: false,
            },
          ],
        },
      ],
      assess: [],
    },

    // ==========================================
    // Subtopic 4: Installing Python & An Editor
    // ==========================================
    {
      id: 'day1-sub4',
      number: 4,
      title: 'Installing Python and an Editor',
      summary: 'Guided setup for Windows, macOS, and Linux, version check, and configuring VS Code.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Setting Up Your Local Development Environment',
        paragraphs: [
          'While the Python Visual Lab runs a complete Python runtime directly inside your browser, professional developers write and execute Python code locally on their computers.',
          'To set up Python on your own machine:',
          '• Windows: Download the official installer from python.org. CRITICAL: Check the box "Add python.exe to PATH" at the bottom of the first setup screen! Without this, the terminal will not recognize the python command.',
          '• macOS: macOS comes with system utilities, but you should install modern Python 3 via python.org or Homebrew (brew install python). In macOS terminals, the command is usually python3.',
          '• Linux (Ubuntu/Debian): Run sudo apt update && sudo apt install python3 python3-pip in your terminal.',
          'For your editor, Visual Studio Code (VS Code) with Microsoft\'s official "Python" extension is the world standard, providing syntax highlighting, autocomplete (IntelliSense), and built-in debugging.',
        ],
        keyTerms: [
          { term: 'PATH', definition: 'An operating system environment variable specifying directories where executable programs live.' },
          { term: 'IDE / Code Editor', definition: 'Integrated Development Environment (like VS Code or PyCharm) with specialized tools for writing code.' },
        ],
      },
      visualise: {
        type: 'terminal-console',
        title: 'Terminal & Python Console Environment (SIMULATION)',
        badge: 'simulation',
        description: 'Simulated terminal console: run python, python3, python --version, python -V, and script commands safely in your browser.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Environment Verification Script',
          code: `version_info = "Python 3.12+ Standard Environment"\nprint(version_info)\nprint("Editor configured: VS Code with Python extension")`,
          runMode: 'real',
          expectedOutput: 'Python 3.12+ Standard Environment\nEditor configured: VS Code with Python extension',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'version_info = "Python 3.12+ Standard Environment"',
          internalEffect: 'Binds variable version_info in current frame.',
        },
        {
          step: 2,
          codeLine: 2,
          instruction: 'print(version_info)',
          internalEffect: 'Sends string to stdout.',
          outputEffect: 'Python 3.12+ Standard Environment',
        },
      ],
      apply: {
        contextTitle: 'Developer Setup Audit',
        scenario: 'A computer laboratory technician in Ibadan checking lab workstation readiness.',
        code: `os_name = "Ubuntu Linux"\npy_command = "python3"\nprint(f"Workstation verified for {os_name} using '{py_command}'")`,
        outcome: "Workstation verified for Ubuntu Linux using 'python3'",
        domain: 'school',
      },
      commonMistakes: [
        {
          label: 'Forgetting "Add to PATH" on Windows',
          erroneousCode: '# Running "python" in PowerShell results in:\n# "python is not recognized as an internal or external command"',
          errorMessage: "CommandNotFoundException: The term 'python' is not recognized",
          explanation: 'Re-run the python.exe installer, select "Modify", and make sure "Add python.exe to PATH" is ticked.',
          correctedCode: '# After fixing PATH, running:\n# python --version\n# outputs: Python 3.12.x',
        },
      ],
      practise: [
        {
          id: 'd1-s4-ex1',
          title: 'Foundation: Diagnosing Terminal Path Errors',
          type: 'fix-the-bug',
          tier: 'foundation',
          points: 10,
          prompt: 'A trainee in Jos just downloaded Python on Windows 11. When they type "python" in Command Prompt, they get "\'python\' is not recognized as an internal or external command". Which action will fix the root cause?',
          contextScenario: 'IT Support Clinic at University of Jos',
          hints: [
            'The operating system searches directories listed in the PATH environment variable.',
            'If the installer was run with default settings, the PATH checkbox was likely missed.',
          ],
          options: [
            {
              id: 'fix-path-1',
              text: 'Re-run the Python installer, choose "Modify", and ensure "Add python.exe to PATH" is checked (or add C:\\Python312 to User Environment Variables).',
              explanation: 'Correct! The operating system cannot find the executable until its installation directory is added to PATH.',
              isCorrect: true,
            },
            {
              id: 'fix-path-2',
              text: 'Delete the terminal app and use Microsoft Word to write code instead.',
              explanation: 'Incorrect. Word is a rich-text word processor, not a terminal or code editor.',
              isCorrect: false,
            },
            {
              id: 'fix-path-3',
              text: 'Rename the file python.exe to windows.exe.',
              explanation: 'Incorrect. Arbitrary renaming breaks internal tools and standard library hooks.',
              isCorrect: false,
            },
          ],
        },
      ],
      assess: [],
    },

    // ==========================================
    // Subtopic 5: The Interactive Shell (REPL)
    // ==========================================
    {
      id: 'day1-sub5',
      number: 5,
      title: 'The Interactive Shell (REPL)',
      summary: 'Immediate experimentation loop: Read, Eval, Print, Loop with the primary >>> prompt.',
      estimatedMinutes: 6,
      introduce: {
        headline: 'The Read-Eval-Print Loop',
        paragraphs: [
          'When you launch Python in your terminal by typing python or python3 without specifying a file, you enter the Interactive Shell, known as the REPL (Read-Eval-Print Loop).',
          'The shell displays the primary prompt >>>, waiting for you to type an instruction. Once you press Enter, Python immediately reads the line, evaluates the expression, prints the returned value to your screen (if any), and loops back to prompt for the next instruction.',
          'The REPL is ideal for quick experiments, testing mathematical formulas, inspecting objects, or checking how a function behaves before putting it into a permanent script file.',
          'To exit the interactive shell, type exit() or quit() and press Enter (or press Ctrl+D on Mac/Linux, Ctrl+Z then Enter on Windows).',
        ],
        keyTerms: [
          { term: 'REPL', definition: 'Read-Eval-Print Loop: an interactive programming environment taking single user inputs and returning immediate results.' },
          { term: 'Primary Prompt (>>>)', definition: 'The standard prompt indicator in the Python REPL indicating readiness for a new command.' },
          { term: 'Secondary Prompt (...)', definition: 'The continuation prompt indicator shown when writing multiline compound statements (like if or def).' },
        ],
      },
      visualise: {
        type: 'shell-vs-script',
        title: 'Shell versus Script Comparison',
        badge: 'simulation',
        description: 'See why typing an expression in REPL auto-echoes the answer, whereas running a script requires explicit print().',
        initialConfig: {},
      },
      code: [
        {
          title: 'Immediate Evaluation in Shell',
          code: `x = 250\ny = 4\nresult = x * y\nprint("Calculation Result:", result)`,
          runMode: 'real',
          expectedOutput: 'Calculation Result: 1000',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'x = 250',
          internalEffect: 'Evaluated silently: variable x bound to int(250).',
        },
        {
          step: 2,
          codeLine: 2,
          instruction: 'y = 4',
          internalEffect: 'Evaluated silently: variable y bound to int(4).',
        },
        {
          step: 3,
          codeLine: 3,
          instruction: 'result = x * y',
          internalEffect: 'Performs integer multiplication 250 * 4 = 1000, binds result.',
        },
        {
          step: 4,
          codeLine: 4,
          instruction: 'print("Calculation Result:", result)',
          internalEffect: 'Prints joined arguments separated by a space.',
          outputEffect: 'Calculation Result: 1000',
        },
      ],
      apply: {
        contextTitle: 'Fuel Price Calculation',
        scenario: 'A quick terminal calculation for fueling a delivery van in Port Harcourt.',
        code: `litres = 45\nprice_per_litre = 850\ntotal_naira = litres * price_per_litre\nprint(f"Fuel Cost: N{total_naira}")`,
        outcome: 'Fuel Cost: N38250',
        domain: 'transport',
      },
      commonMistakes: [
        {
          label: 'Typing exit without Parentheses',
          erroneousCode: '>>> exit',
          errorMessage: 'Use exit() or Ctrl-D (i.e. EOF) to exit',
          explanation: 'In Python, exit is a callable object. You must invoke it with parentheses: exit().',
          correctedCode: '>>> exit()',
        },
      ],
      practise: [
        {
          id: 'd1-s5-ex1',
          title: 'Standard: REPL Echo vs Script Behavior',
          type: 'predict-output',
          tier: 'standard',
          points: 15,
          prompt: 'A logistics dispatcher in Onitsha types the following two lines in the Python interactive shell (REPL):\n>>> fuel_rate = 950\n>>> fuel_rate * 5\nWhat will the REPL display immediately after the second line is submitted?',
          contextScenario: 'Haulage Logistics Terminal in Onitsha',
          hints: [
            'In the interactive REPL, unassigned expression results are automatically printed to the terminal.',
            'No print() statement is needed in the REPL for expression evaluation.',
          ],
          options: [
            {
              id: 'repl-opt-1',
              text: '4750',
              explanation: 'Correct! The REPL evaluates 950 * 5 and automatically echoes 4750 to stdout without needing an explicit print().',
              isCorrect: true,
            },
            {
              id: 'repl-opt-2',
              text: 'Nothing, because print() was not called.',
              explanation: 'Incorrect. While a script file would print nothing, the interactive REPL specifically auto-echoes expression results.',
              isCorrect: false,
            },
            {
              id: 'repl-opt-3',
              text: 'NameError: name "fuel_rate" is not defined',
              explanation: 'Incorrect. The first line successfully bound fuel_rate to 950 in the interactive session namespace.',
              isCorrect: false,
            },
          ],
        },
        {
          id: 'd1-s5-ex2',
          title: 'Challenge: Explain the Trace of REPL State',
          type: 'explain-the-trace',
          tier: 'challenge',
          points: 20,
          prompt: 'Examine this sequence of commands typed into an active interactive Python REPL session:\n\n>>> balance = 5000\n>>> balance = balance + 2500\n>>> balance\n\nExplain step by step what Python does internally at each prompt, why line 2 updates the value, and what object representation is printed at line 3.',
          contextScenario: 'Microfinance Ledger Audit in Warri',
          hints: [
            'Remember that Python creates a new int object when performing arithmetic.',
            'The identifier "balance" is rebound to the new object.',
            'Line 3 evaluates the identifier and the REPL prints its repr.',
          ],
          modelAnswer: 'Step 1: Python creates an int object with value 5000 in heap memory and binds the identifier "balance" to it in the global namespace. Because assignment has no return value, the REPL prints nothing.\nStep 2: Python evaluates the right-hand expression "balance + 2500". It looks up the current object (5000), adds 2500, creates a new int object with value 7500, and rebinds the name "balance" to point to this new object. The previous object (5000) is marked for garbage collection if unreferenced.\nStep 3: When "balance" is evaluated as a standalone expression, the REPL evaluates the name, retrieves the integer 7500, calls its __repr__(), and prints "7500" to stdout.',
          markingCriteria: [
            { id: 'crit-trace-1', label: 'Explains initial object allocation and identifier binding in step 1', points: 7 },
            { id: 'crit-trace-2', label: 'Explains right-hand side evaluation and name rebinding in step 2', points: 7 },
            { id: 'crit-trace-3', label: 'Explains automatic REPL expression evaluation and repr output in step 3', points: 6 },
          ],
        },
      ],
      assess: [],
    },

    // ==========================================
    // Subtopic 6: Writing and Running a Script File
    // ==========================================
    {
      id: 'day1-sub6',
      number: 6,
      title: 'Writing and Running a Script File',
      summary: 'Saving reusable code in .py files and running them from the command line.',
      estimatedMinutes: 7,
      introduce: {
        headline: 'From Ephemeral Shell to Persistent Programs',
        paragraphs: [
          'While the interactive shell is great for scratchpad calculations, any code typed into the REPL vanishes as soon as the session closes. To build real software, you save your instructions into a plain text file with a .py extension, known as a script or module.',
          'To run a script named receipt.py, you open your terminal, navigate to the folder containing the file, and pass the filename as an argument to the interpreter:',
          'python receipt.py   (or python3 receipt.py)',
          'The Python interpreter opens the file, reads it from top to bottom in one batch, executes each statement in order, and exits back to your terminal when finished.',
        ],
        keyTerms: [
          { term: 'Script (.py)', definition: 'A text file containing Python statements saved for repeated batch execution.' },
          { term: 'Batch Execution', definition: 'Running an entire sequence of commands from start to finish without interactive user pauses.' },
        ],
      },
      visualise: {
        type: 'shell-vs-script',
        title: 'Script File vs Interactive Shell Execution',
        badge: 'simulation',
        description: 'Observe line 4 evaluating silently in a script, while print() produces visible output.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Store Receipt Script',
          code: `unit_price = 450\nquantity = 3\ntotal = unit_price * quantity\nprint("--- Supermarket Receipt ---")\nprint(f"Items: {quantity} units @ N{unit_price}")\nprint(f"Total Due: N{total}")`,
          runMode: 'real',
          expectedOutput: '--- Supermarket Receipt ---\nItems: 3 units @ N450\nTotal Due: N1350',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'unit_price = 450',
          internalEffect: 'Initializes variable unit_price with integer 450.',
        },
        {
          step: 2,
          codeLine: 3,
          instruction: 'total = unit_price * quantity',
          internalEffect: 'Computes product 450 * 3 and stores 1350 in total.',
        },
        {
          step: 3,
          codeLine: 4,
          instruction: 'print("--- Supermarket Receipt ---")',
          internalEffect: 'Writes header banner to stdout.',
          outputEffect: '--- Supermarket Receipt ---',
        },
        {
          step: 4,
          codeLine: 5,
          instruction: 'print(f"Items: {quantity} units @ N{unit_price}")',
          internalEffect: 'Interpolates quantity and unit price into formatted text.',
          outputEffect: 'Items: 3 units @ N450',
        },
        {
          step: 5,
          codeLine: 6,
          instruction: 'print(f"Total Due: N{total}")',
          internalEffect: 'Prints grand total string.',
          outputEffect: 'Total Due: N1350',
        },
      ],
      apply: {
        contextTitle: 'Bakery Batch Output',
        scenario: 'A batch inventory calculation for an artisanal bakery in Kano.',
        code: `loaves = 120\nprice_per_loaf = 900\nprojected_sales = loaves * price_per_loaf\nprint(f"Kano Bakery Batch: {loaves} loaves produced.")\nprint(f"Projected Revenue: N{projected_sales:,}")`,
        outcome: 'Kano Bakery Batch: 120 loaves produced.\nProjected Revenue: N108,000',
        domain: 'ecommerce',
      },
      commonMistakes: [
        {
          label: 'Forgetting print in a Script File',
          erroneousCode: '# In a file script.py:\nprice = 500\nprice * 2  # Missing print()!',
          errorMessage: '# No error is raised, but NOTHING appears on the screen!',
          explanation: 'Unlike the REPL, a script file will not display the result of an expression unless you wrap it in print().',
          correctedCode: 'price = 500\nprint(price * 2)',
        },
      ],
      practise: [
        {
          id: 'd1-s6-ex1',
          title: 'Standard: Supermarket POS Receipt Script',
          type: 'write-code',
          tier: 'standard',
          points: 15,
          prompt: 'Write a Python script that defines two variables: item_price = 1500 and item_count = 4. Calculate total_cost, then print two lines:\nLine 1: Purchased: 4 items @ N1500\nLine 2: Total Due: N6000',
          contextScenario: 'Supermarket Checkout Terminal in Lekki Phase 1',
          starterCode: `# Write your supermarket receipt script below:
item_price = 1500
item_count = 4
total_cost = item_price * item_count

`,
          solutionCode: `item_price = 1500
item_count = 4
total_cost = item_price * item_count
print(f"Purchased: {item_count} items @ N{item_price}")
print(f"Total Due: N{total_cost}")`,
          testCases: [
            {
              id: 'tc-pos-1',
              label: 'Standard Output Check',
              setup: '',
              expected: 'Purchased: 4 items @ N1500\nTotal Due: N6000',
              hidden: false,
            },
          ],
          hints: [
            'Use f-strings: f"Purchased: {item_count} items @ N{item_price}".',
            'Ensure your second print statement outputs: f"Total Due: N{total_cost}".',
          ],
        },
        {
          id: 'd1-s6-ex2',
          title: 'Challenge: Order the Statements of a Script',
          type: 'order-the-lines',
          tier: 'challenge',
          points: 15,
          prompt: 'Arrange these scrambled Python lines into a logically sound, executable script that calculates and prints a delivery dispatch report without raising a NameError:',
          contextScenario: 'Dispatch Courier Logistics in Ikeja',
          jumbledLines: [
            { id: 'jl-3', code: 'print(f"Order #{order_id} dispatch to {customer}")', indent: 0 },
            { id: 'jl-1', code: 'order_id = "LAG-8891"', indent: 0 },
            { id: 'jl-4', code: 'print(f"Delivery Fee: N{delivery_fee}")', indent: 0 },
            { id: 'jl-2', code: 'customer = "Folake Adebayo"', indent: 0 },
            { id: 'jl-5', code: 'delivery_fee = 2500', indent: 0 },
          ],
          correctLineOrder: ['jl-1', 'jl-2', 'jl-3', 'jl-5', 'jl-4'],
          hints: [
            'Variables must be bound before they are referenced in print statements.',
            'Define order_id and customer before the first print.',
            'Define delivery_fee before the second print.',
          ],
        },
      ],
      assess: [],
    },

    // ==========================================
    // Subtopic 7: Python Syntax
    // ==========================================
    {
      id: 'day1-sub7',
      number: 7,
      title: 'Python Syntax',
      summary: 'Rules of the grammar: newlines as statement terminators, identifiers, and clean structure.',
      estimatedMinutes: 7,
      introduce: {
        headline: 'The Grammar of Python',
        paragraphs: [
          'Syntax refers to the formal rules governing how statements must be structured for the Python interpreter to understand them.',
          'Key rules of Python syntax:',
          '1. End of line ends the statement: Unlike C, Java, or JavaScript, Python does not require semicolons (;) at the end of statements. A standard newline completes the statement.',
          '2. Identifiers: Variable and function names can contain letters (a-z, A-Z), digits (0-9), and underscores (_), but cannot start with a digit or use reserved Python keywords (such as if, for, class, def).',
          '3. Case Sensitivity: Nigeria, nigeria, and NIGERIA are three completely distinct identifiers to Python.',
          '4. Quotes for Strings: You can use single quotes (\') or double quotes (") interchangeably, as long as the opening and closing quotes match.',
        ],
        keyTerms: [
          { term: 'Syntax', definition: 'The grammatical rules governing valid statement construction in a programming language.' },
          { term: 'Identifier', definition: 'A user-defined name given to a variable, function, class, or module.' },
          { term: 'Reserved Keywords', definition: 'Special words (e.g. if, else, while, import, def) reserved by Python for language syntax.' },
        ],
      },
      visualise: {
        type: 'syntax-repair',
        title: 'Syntax Repair Clinic (Real Pyodide Execution)',
        badge: 'real',
        description: 'Diagnose and fix broken statements, unclosed quotes, and invalid syntax in the real Python compiler.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Clean Syntax Example',
          code: `country = "Nigeria"\ncapital = "Abuja"\npopulation_millions = 220\nprint(f"{country}'s capital is {capital}.")\nprint(f"Estimated population: {population_millions}M")`,
          runMode: 'real',
          expectedOutput: "Nigeria's capital is Abuja.\nEstimated population: 220M",
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'country = "Nigeria"',
          internalEffect: 'Creates variable "country" bound to string "Nigeria".',
        },
        {
          step: 2,
          codeLine: 4,
          instruction: 'print(f"{country}\'s capital is {capital}.")',
          internalEffect: 'Handles apostrophe inside double-quoted string safely without escaping.',
          outputEffect: "Nigeria's capital is Abuja.",
        },
        {
          step: 3,
          codeLine: 5,
          instruction: 'print(f"Estimated population: {population_millions}M")',
          internalEffect: 'Interpolates integer 220 into string.',
          outputEffect: 'Estimated population: 220M',
        },
      ],
      apply: {
        contextTitle: 'Civil Aviation Flight Tag',
        scenario: 'Formatting a domestic flight boarding record at Murtala Muhammed Airport, Lagos.',
        code: `airline = "Air Peace"\nflight_no = "APK7124"\ndestination = "Enugu (ENU)"\nprint(f"Flight: {airline} {flight_no} -> {destination}")`,
        outcome: 'Flight: Air Peace APK7124 -> Enugu (ENU)',
        domain: 'transport',
      },
      commonMistakes: [
        {
          label: 'Using Semicolons Unnecessarily',
          erroneousCode: 'name = "Kemi";\nprint(name);',
          errorMessage: '# While valid, semicolons are considered unpythonic and bad practice',
          explanation: 'Python uses newlines to separate statements. Do not add semicolons to the end of your lines.',
          correctedCode: 'name = "Kemi"\nprint(name)',
        },
      ],
      practise: [
        {
          id: 'd1-s7-ex1',
          title: 'Foundation: Fix Unclosed String Literal',
          type: 'fix-the-bug',
          tier: 'foundation',
          points: 10,
          prompt: 'Repair the syntax error in this boarding gate broadcast program so it prints "Gate 4 Open for Calabar Flight":',
          contextScenario: 'Airport Terminal Information Board in Calabar',
          starterCode: `print("Gate 4 Open for Calabar Flight)`,
          solutionCode: `print("Gate 4 Open for Calabar Flight")`,
          hints: [
            'Notice the opening quotation mark before Gate.',
            'Every string opened with a double quote must be closed with a matching double quote before the parenthesis.',
          ],
          testCases: [
            {
              id: 'tc-syntax-1',
              label: 'Properly Terminated String',
              setup: '',
              expected: 'Gate 4 Open for Calabar Flight',
              hidden: false,
            },
          ],
        },
        {
          id: 'd1-s7-ex2',
          title: 'Standard: Identifier Naming Rules',
          type: 'scenario-mcq',
          tier: 'standard',
          points: 15,
          prompt: 'A programmer is creating variable names for a power grid telemetry database in Port Harcourt. Which of the following is a completely LEGAL and valid Python identifier?',
          contextScenario: 'Transmission Company Power Substation in Rivers State',
          hints: [
            'Python identifiers cannot start with a digit.',
            'Python identifiers cannot contain hyphens (-), spaces, or reserved keywords (like def or class).',
            'Underscores (_) are valid anywhere.',
          ],
          options: [
            {
              id: 'ident-opt-1',
              text: 'substation_voltage_kv',
              explanation: 'Correct! Uses letters and underscores; does not begin with a digit or collide with a keyword.',
              isCorrect: true,
            },
            {
              id: 'ident-opt-2',
              text: '2nd_transformer_load',
              explanation: 'Incorrect. Identifiers in Python cannot start with a digit (2nd).',
              isCorrect: false,
            },
            {
              id: 'ident-opt-3',
              text: 'power-grid-frequency',
              explanation: 'Incorrect. Hyphens (-) are interpreted as subtraction operators in Python grammar.',
              isCorrect: false,
            },
            {
              id: 'ident-opt-4',
              text: 'def',
              explanation: 'Incorrect. "def" is a reserved Python keyword used to define functions.',
              isCorrect: false,
            },
          ],
        },
      ],
      assess: [],
    },

    // ==========================================
    // Subtopic 8: Indentation
    // ==========================================
    {
      id: 'day1-sub8',
      number: 8,
      title: 'Indentation',
      summary: 'Significant whitespace: using 4 spaces per block level instead of curly braces.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Indentation Creates Structure',
        paragraphs: [
          'In most programming languages (C, Java, JavaScript), curly brackets { } define blocks of code, and indentation is purely cosmetic. In Python, indentation is syntactically significant: whitespace determines which block of code a statement belongs to.',
          'Whenever you write a compound statement ending with a colon (:)—such as an if condition, a for loop, or a function definition def—the statements that follow must be indented to form the body of that block.',
          'The official Python Style Guide (PEP 8) specifies exactly 4 spaces per indentation level. Never use tabs, and never mix spaces and tabs in the same file.',
          'If indentation is inconsistent or missing, Python will immediately halt with an IndentationError before running your program.',
        ],
        keyTerms: [
          { term: 'Significant Whitespace', definition: 'The design feature where leading spaces on a line define code hierarchy and block nesting.' },
          { term: 'PEP 8', definition: 'Python Enhancement Proposal 8: the official style guide for writing readable, standardized Python code.' },
          { term: 'IndentationError', definition: 'A syntax error raised when indentation levels do not match the expected grammatical block structure.' },
        ],
      },
      visualise: {
        type: 'indentation-lab',
        title: 'Python Indentation & Block Scope Lab',
        badge: 'simulation',
        description: 'Shift lines left and right, inspect 4-space guide columns, and observe live IndentationError diagnostics.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Condition Block with 4 Spaces',
          code: `score = 85\nif score >= 70:\n    print("Grade: Distinction")\n    print("Status: Passed with honors")\nprint("Evaluation Complete")`,
          runMode: 'real',
          expectedOutput: 'Grade: Distinction\nStatus: Passed with honors\nEvaluation Complete',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'score = 85',
          internalEffect: 'Evaluates at base indentation level (0 spaces).',
        },
        {
          step: 2,
          codeLine: 2,
          instruction: 'if score >= 70:',
          internalEffect: 'Colon indicates start of a child block. Condition evaluates to True.',
        },
        {
          step: 3,
          codeLine: 3,
          instruction: '    print("Grade: Distinction")',
          internalEffect: '4 spaces indent: executed because if condition was True.',
          outputEffect: 'Grade: Distinction',
        },
        {
          step: 4,
          codeLine: 4,
          instruction: '    print("Status: Passed with honors")',
          internalEffect: 'Still inside the 4-space indented block.',
          outputEffect: 'Status: Passed with honors',
        },
        {
          step: 5,
          codeLine: 5,
          instruction: 'print("Evaluation Complete")',
          internalEffect: 'Dedent back to 0 spaces: executes unconditionally after the if block finishes.',
          outputEffect: 'Evaluation Complete',
        },
      ],
      apply: {
        contextTitle: 'Automated Loan Qualifier',
        scenario: 'A micro-lending eligibility check for small businesses in Onitsha Main Market.',
        code: `monthly_revenue = 450000\ncredit_score = 720\nif monthly_revenue >= 300000 and credit_score >= 650:\n    print("Application Status: Eligible for N1,000,000 Working Capital")\n    print("Processing Fast-Track Approval...")\nprint("System audit logged.")`,
        outcome: 'Application Status: Eligible for N1,000,000 Working Capital\nProcessing Fast-Track Approval...\nSystem audit logged.',
        domain: 'finance',
      },
      commonMistakes: [
        {
          label: 'Missing Indent after Colon',
          erroneousCode: 'if True:\nprint("Missing Indent!")',
          errorMessage: "IndentationError: expected an indented block after 'if' statement on line 1",
          explanation: 'Any line immediately following a colon (:) must be indented by at least 1 space (standard: 4 spaces).',
          correctedCode: 'if True:\n    print("Properly indented!")',
        },
      ],
      practise: [
        {
          id: 'd1-s8-ex1',
          title: 'Standard: Repairing an Indentation Block',
          type: 'fix-the-bug',
          tier: 'standard',
          points: 15,
          prompt: 'Fix the IndentationError in this scholarship award announcement script so it executes cleanly:',
          contextScenario: 'University Scholarship Committee in Zaria',
          starterCode: `student_cgpa = 4.85
if student_cgpa >= 4.50:
print("Award: First Class Vice Chancellor Scholarship")
print("Status: Tuition Waived 100%")
print("Review Finished")`,
          solutionCode: `student_cgpa = 4.85
if student_cgpa >= 4.50:
    print("Award: First Class Vice Chancellor Scholarship")
    print("Status: Tuition Waived 100%")
print("Review Finished")`,
          hints: [
            'Statements belonging to the if condition must be indented by exactly 4 spaces.',
            'The final "Review Finished" line should remain at zero indentation level so it runs after the if block.',
          ],
          testCases: [
            {
              id: 'tc-indent-1',
              label: 'Indented scholarship block',
              setup: '',
              expected: 'Award: First Class Vice Chancellor Scholarship\nStatus: Tuition Waived 100%\nReview Finished',
              hidden: false,
            },
          ],
        },
        {
          id: 'd1-s8-ex2',
          title: 'Challenge: Reconstructing a Nested Indented Block',
          type: 'order-the-lines',
          tier: 'challenge',
          points: 20,
          prompt: 'Order and align these lines to construct a valid verification script where attendance is checked inside an enrollment verification block:',
          contextScenario: 'JAMB CBT Examination Centre in Enugu',
          jumbledLines: [
            { id: 'ind-3', code: 'print("Candidate Admitted to Exam Hall")', indent: 2 },
            { id: 'ind-1', code: 'is_registered = True', indent: 0 },
            { id: 'ind-4', code: 'print("Verification Audit Complete")', indent: 0 },
            { id: 'ind-2', code: 'if is_registered:', indent: 0 },
            { id: 'ind-5', code: 'if has_biometric_match:', indent: 1 },
          ],
          correctLineOrder: ['ind-1', 'ind-2', 'ind-5', 'ind-3', 'ind-4'],
          hints: [
            'Start with variable definition at level 0.',
            'Outer if statement comes next.',
            'Nested if statement is indented 4 spaces (level 1).',
            'Action print is indented 8 spaces (level 2).',
          ],
        },
      ],
      assess: [],
    },

    // ==========================================
    // Subtopic 9: Comments
    // ==========================================
    {
      id: 'day1-sub9',
      number: 9,
      title: 'Comments',
      summary: 'Documenting code intent using single-line # and multiline docstrings.',
      estimatedMinutes: 5,
      introduce: {
        headline: 'Writing Code for Humans First',
        paragraphs: [
          'Comments are human-readable explanations embedded directly inside source code. The Python interpreter completely ignores comments during tokenization and bytecode compilation.',
          'Types of comments in Python:',
          '1. Single-line comments: Start with a hash symbol (#). Everything from the # to the end of that line is ignored by Python.',
          '2. Inline comments: A comment placed at the end of an executable statement, separated by at least two spaces: x = 10  # Initial counter.',
          '3. Multiline comments & Docstrings: Triple quotes (\'\'\' or """) can span multiple lines. When placed at the top of a function or module, they become official docstrings.',
          'Best practice: Good comments explain why something is done (the intent or business rule), not what is done (which the code already says).',
        ],
        keyTerms: [
          { term: 'Comment (#)', definition: 'Text in source code intended for human readers that the interpreter completely ignores.' },
          { term: 'Docstring', definition: 'A string literal occurring as the first statement in a module, function, class, or method definition used for documentation.' },
        ],
      },
      visualise: {
        type: 'instruction-journey',
        title: 'How Comments Are Stripped During Tokenization',
        badge: 'simulation',
        description: 'Watch the tokenizer encounter # characters and discard them before bytecode compilation.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Single-line & Inline Comments',
          code: `# Single-line comment explaining calculation\ndaily_sales = 150000  # POS daily revenue in Naira\nexpenses = 45000      # Staff and fuel expenses\nnet_profit = daily_sales - expenses\nprint(f"Daily Net Profit: N{net_profit}")`,
          runMode: 'real',
          expectedOutput: 'Daily Net Profit: N105000',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: '# Single-line comment explaining calculation',
          internalEffect: 'Tokenizer skips the entire line. No AST node or bytecode opcode generated.',
        },
        {
          step: 2,
          codeLine: 2,
          instruction: 'daily_sales = 150000  # POS daily revenue in Naira',
          internalEffect: 'Evaluates daily_sales = 150000; ignores everything after the # symbol.',
        },
        {
          step: 3,
          codeLine: 4,
          instruction: 'net_profit = daily_sales - expenses',
          internalEffect: 'Computes 150000 - 45000 = 105000.',
        },
        {
          step: 4,
          codeLine: 5,
          instruction: 'print(f"Daily Net Profit: N{net_profit}")',
          internalEffect: 'Outputs net profit to stdout.',
          outputEffect: 'Daily Net Profit: N105000',
        },
      ],
      apply: {
        contextTitle: 'Solar Inverter Telemetry',
        scenario: 'A renewable energy monitoring script for a solar installation in Kaduna.',
        code: `# Calculate battery backup reserve percentage\nbattery_voltage = 48.6  # Volts DC\nrated_max = 54.0        # Float absorption voltage\nreserve_pct = (battery_voltage / rated_max) * 100\nprint(f"Kaduna Site Solar Reserve: {reserve_pct:.1f}%")`,
        outcome: 'Kaduna Site Solar Reserve: 90.0%',
        domain: 'science',
      },
      commonMistakes: [
        {
          label: 'Using // for Comments (C/Java Habit)',
          erroneousCode: '// This is a C-style comment\nprint("Hello")',
          errorMessage: 'SyntaxError: invalid syntax',
          explanation: 'In Python, // is the floor-division arithmetic operator, not a comment delimiter! Use # for comments.',
          correctedCode: '# This is a Python comment\nprint("Hello")',
        },
      ],
      practise: [
        {
          id: 'd1-s9-ex1',
          title: 'Foundation: Predict Output with Comments',
          type: 'predict-output',
          tier: 'foundation',
          points: 10,
          prompt: 'What will be printed when this script runs?\n\n# daily_rate = 5000\ndaily_rate = 7500  # Updated rate for festival season\n# print(daily_rate * 2)\nprint(daily_rate)',
          contextScenario: 'Hotel Room Booking System in Calabar Carnival',
          hints: [
            'Any line starting with # is completely skipped by the interpreter.',
            'Inline comments after # are also stripped.',
          ],
          options: [
            {
              id: 'comment-opt-1',
              text: '7500',
              explanation: 'Correct! The lines with # daily_rate = 5000 and # print(...) are ignored; only print(daily_rate) executes with value 7500.',
              isCorrect: true,
            },
            {
              id: 'comment-opt-2',
              text: '5000\n15000\n7500',
              explanation: 'Incorrect. Commented lines never execute.',
              isCorrect: false,
            },
            {
              id: 'comment-opt-3',
              text: '7500  # Updated rate for festival season',
              explanation: 'Incorrect. The comment text is discarded during tokenization and never appears in print output.',
              isCorrect: false,
            },
          ],
        },
      ],
      assess: [],
    },

    // ==========================================
    // Subtopic 10: First Look at Data Types
    // ==========================================
    {
      id: 'day1-sub10',
      number: 10,
      title: 'First Look at Data Types',
      summary: 'The building blocks of data: integers, floats, strings, booleans, and lists.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'Everything in Python Is an Object',
        paragraphs: [
          'Every piece of data processed by a Python program has a specific data type that defines what operations can be performed on it. Python is dynamically typed: you do not declare types explicitly; Python infers the type at runtime based on the value assigned.',
          'The five core data types you will meet immediately:',
          '1. int (Integer): Whole numbers without decimal points, both positive and negative (e.g. 42, -7, 0).',
          '2. float (Floating-Point): Numbers containing a decimal point, representing real numbers (e.g. 3.14159, -0.05).',
          '3. str (String): Sequences of Unicode characters enclosed in quotation marks (e.g. "Lagos", \'Python\').',
          '4. bool (Boolean): Logical truth values, strictly either True or False (capitalized!).',
          '5. list (List): An ordered, mutable collection of items enclosed in square brackets (e.g. ["Apple", "Banana", "Orange"]).',
          'You can inspect the type of any value or variable using the built-in type() function.',
        ],
        keyTerms: [
          { term: 'Dynamic Typing', definition: 'A language feature where variable types are checked and bound at runtime, not compile time.' },
          { term: 'type()', definition: 'A built-in function returning the class or type of the object passed as an argument.' },
          { term: 'bool', definition: 'A data type representing truth values: True or False (a subclass of int in Python).' },
        ],
      },
      visualise: {
        type: 'instruction-journey',
        title: 'Memory Representation of Core Types',
        badge: 'simulation',
        description: 'Inspect how CPython allocates PyObject structures with ob_refcnt, ob_type, and value fields for int, float, str, and bool.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Core Data Types Overview',
          code: `age = 24                # int\nheight = 1.78           # float\nfirst_name = "Emeka"    # str\nis_student = False      # bool\nlanguages = ["Hausa", "Igbo", "Yoruba"]  # list\n\nprint(first_name, "is", age, "years old.")\nprint("Is student:", is_student)\nprint("Spoken languages count:", len(languages))`,
          runMode: 'real',
          expectedOutput: 'Emeka is 24 years old.\nIs student: False\nSpoken languages count: 3',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'age = 24',
          internalEffect: 'Creates an int object holding 24 and binds the name "age".',
        },
        {
          step: 2,
          codeLine: 2,
          instruction: 'height = 1.78',
          internalEffect: 'Creates an IEEE 754 double-precision float object.',
        },
        {
          step: 3,
          codeLine: 4,
          instruction: 'is_student = False',
          internalEffect: 'Binds to the singleton False bool object.',
        },
        {
          step: 4,
          codeLine: 5,
          instruction: 'languages = ["Hausa", "Igbo", "Yoruba"]',
          internalEffect: 'Allocates a list holding pointers to 3 string objects.',
        },
        {
          step: 5,
          codeLine: 7,
          instruction: 'print(first_name, "is", age, "years old.")',
          internalEffect: 'Prints values separated by space.',
          outputEffect: 'Emeka is 24 years old.',
        },
      ],
      apply: {
        contextTitle: 'Student Admission Profile',
        scenario: 'A student enrollment record at the University of Ibadan.',
        code: `matric_no = 20260491\ngpa = 4.72\nname = "Zainab Bello"\nis_enrolled = True\nprint(f"Student: {name} (Matric: {matric_no})")\nprint(f"First Year GPA: {gpa} | Status Active: {is_enrolled}")`,
        outcome: 'Student: Zainab Bello (Matric: 20260491)\nFirst Year GPA: 4.72 | Status Active: True',
        domain: 'school',
      },
      commonMistakes: [
        {
          label: 'Lowercase boolean values',
          erroneousCode: 'is_active = true',
          errorMessage: "NameError: name 'true' is not defined. Did you mean: 'True'?",
          explanation: 'In Python, Booleans must be capitalized: True and False (unlike JavaScript or C++ which use lowercase true/false).',
          correctedCode: 'is_active = True',
        },
      ],
      practise: [
        {
          id: 'd1-s10-ex1',
          title: 'Standard: Type Identification for Patient Vitals',
          type: 'predict-output',
          tier: 'standard',
          points: 15,
          prompt: 'Predict the output of the built-in type() calls in this clinic record snippet:\n\npatient = "Aisha"\nage = 32\ntemp = 37.4\nis_admitted = False\nprint(type(patient).__name__, type(temp).__name__, type(is_admitted).__name__)',
          contextScenario: 'General Hospital Outpatient Record in Minna',
          hints: [
            'type(x).__name__ returns the simple name of the class: "str", "float", "bool", or "int".',
            '37.4 has a decimal point so it is a float.',
          ],
          options: [
            {
              id: 'types-opt-1',
              text: 'str float bool',
              explanation: 'Correct! "Aisha" is str, 37.4 is float, and False is bool.',
              isCorrect: true,
            },
            {
              id: 'types-opt-2',
              text: 'string decimal boolean',
              explanation: 'Incorrect. In Python, the type names are str, float, and bool, not string, decimal, or boolean.',
              isCorrect: false,
            },
            {
              id: 'types-opt-3',
              text: 'object number int',
              explanation: 'Incorrect. Python reports specific types (str, float, bool) rather than generic root classes.',
              isCorrect: false,
            },
          ],
        },
        {
          id: 'd1-s10-ex2',
          title: 'Challenge: Telemetry Data Record Script',
          type: 'write-code',
          tier: 'challenge',
          points: 20,
          prompt: 'Write a Python program for a solar mini-grid in Sokoto. Define four variables with exact types:\n- station_name = "Sokoto Solar Hub" (str)\n- panels_online = 48 (int)\n- output_kw = 144.5 (float)\n- grid_connected = True (bool)\n\nPrint exactly these two lines:\nLine 1: Station: Sokoto Solar Hub | Grid Connected: True\nLine 2: 48 panels generating 144.5 kW',
          contextScenario: 'Solar Micro-Grid Monitoring Station in Sokoto State',
          starterCode: `# Define your telemetry variables and print statements below:
station_name = "Sokoto Solar Hub"
panels_online = 48
output_kw = 144.5
grid_connected = True

`,
          solutionCode: `station_name = "Sokoto Solar Hub"
panels_online = 48
output_kw = 144.5
grid_connected = True
print(f"Station: {station_name} | Grid Connected: {grid_connected}")
print(f"{panels_online} panels generating {output_kw} kW")`,
          testCases: [
            {
              id: 'tc-telemetry-1',
              label: 'Exact Formatted Telemetry Output',
              setup: '',
              expected: 'Station: Sokoto Solar Hub | Grid Connected: True\n48 panels generating 144.5 kW',
              hidden: false,
            },
          ],
          hints: [
            'Use f-strings to interpolate variables cleanly into the target sentences.',
            'Watch character casing: "Station:", "Grid Connected:", "panels generating".',
          ],
        },
      ],
      assess: [],
    },

    // ==========================================
    // Subtopic 11: Debugging
    // ==========================================
    {
      id: 'day1-sub11',
      number: 11,
      title: 'Debugging',
      summary: 'Reading tracebacks from bottom to top and resolving early syntax errors.',
      estimatedMinutes: 8,
      introduce: {
        headline: 'The Detective Art of Debugging',
        paragraphs: [
          'Bugs are a normal, everyday part of programming. Learning how to read and interpret Python error reports calmly is one of the most empowering skills a software engineer develops.',
          'When Python encounters an error it cannot recover from, it prints a traceback. The Golden Rule of reading Python tracebacks:',
          'Always read the traceback from the BOTTOM first! The very last line gives the specific exception name (e.g. SyntaxError, NameError) and a plain-English message explaining what went wrong.',
          'The lines directly above tell you the exact file and line number where Python encountered the issue.',
          'Common categories of early errors:',
          '• SyntaxError: Python\'s parser could not understand your code because it broke grammar rules (e.g. missing quote, missing parenthesis).',
          '• IndentationError: Leading whitespace is uneven or missing after a colon.',
          '• NameError: You referenced a variable or function that has not been defined or was misspelled.',
        ],
        keyTerms: [
          { term: 'Traceback', definition: 'A report showing the active call stack frames and line numbers when an unhandled exception halts execution.' },
          { term: 'SyntaxError', definition: 'An exception raised by the parser when source code violates Python grammatical grammar rules.' },
          { term: 'Print Debugging', definition: 'The technique of placing temporary print() statements to inspect variable values and flow of control.' },
        ],
      },
      visualise: {
        type: 'syntax-repair',
        title: 'Interactive Bug Repair Clinic',
        badge: 'real',
        description: 'Test your debugging intuition by repairing 4 real-world broken beginner programs and running them in Pyodide.',
        initialConfig: {},
      },
      code: [
        {
          title: 'Clean Verified Program',
          code: `debug_message = "Debugging test: no syntax errors"\nstatus_code = 200\nprint(f"Status: {status_code}")\nprint(f"Detail: {debug_message}")`,
          runMode: 'real',
          expectedOutput: 'Status: 200\nDetail: Debugging test: no syntax errors',
        },
      ],
      explain: [
        {
          step: 1,
          codeLine: 1,
          instruction: 'debug_message = "Debugging test: no syntax errors"',
          internalEffect: 'String bound to debug_message identifier.',
        },
        {
          step: 2,
          codeLine: 2,
          instruction: 'status_code = 200',
          internalEffect: 'Integer bound to status_code identifier.',
        },
        {
          step: 3,
          codeLine: 3,
          instruction: 'print(f"Status: {status_code}")',
          internalEffect: 'Prints formatted status code.',
          outputEffect: 'Status: 200',
        },
        {
          step: 4,
          codeLine: 4,
          instruction: 'print(f"Detail: {debug_message}")',
          internalEffect: 'Prints formatted detail message.',
          outputEffect: 'Detail: Debugging test: no syntax errors',
        },
      ],
      apply: {
        contextTitle: 'Warehouse Inventory Diagnostics',
        scenario: 'A diagnostic print-debugging sequence in an e-commerce fulfillment hub in Ikeja.',
        code: `sku_count = 1420\nreorder_threshold = 200\nprint(f"DEBUG: Checking warehouse stock...")\nprint(f"Stock: {sku_count} units | Safe Margin: {sku_count > reorder_threshold}")`,
        outcome: 'DEBUG: Checking warehouse stock...\nStock: 1420 units | Safe Margin: True',
        domain: 'automation',
      },
      commonMistakes: [
        {
          label: 'Reading Tracebacks from Top to Bottom',
          erroneousCode: '# Learner gets overwhelmed by dozens of internal traceback lines',
          errorMessage: 'Traceback (most recent call last):\n  File "main.py", line 4, in <module>\nNameError: name "count" is not defined',
          explanation: 'Always jump straight to the bottom line first! NameError tells you immediately what failed ("count" is not defined), and line 4 tells you where.',
          correctedCode: '# Define the variable before using it:\ncount = 1\nprint(count)',
        },
      ],
      practise: [
        {
          id: 'd1-s11-ex1',
          title: 'Challenge: Diagnosing from a Real Traceback',
          type: 'fix-the-bug',
          tier: 'challenge',
          points: 20,
          prompt: 'A logistics engineer receives this traceback in production:\n\nTraceback (most recent call last):\n  File "dispatch.py", line 3, in <module>\n    print(f"Dispatch to: {destinaton}")\nNameError: name "destinaton" is not defined. Did you mean: "destination"?\n\nRepair the code so it executes cleanly and prints "Dispatch to: Owerri":',
          contextScenario: 'Logistics Fleet Dispatch in Imo State',
          starterCode: `destination = "Owerri"
print(f"Dispatch to: {destinaton}")`,
          solutionCode: `destination = "Owerri"
print(f"Dispatch to: {destination}")`,
          hints: [
            'Notice the spelling suggested on the bottom line of the traceback: "destination" vs "destinaton".',
            'Fix the typo inside the f-string curly brackets on line 2.',
          ],
          testCases: [
            {
              id: 'tc-debug-1',
              label: 'Clean Execution after Typo Fix',
              setup: '',
              expected: 'Dispatch to: Owerri',
              hidden: false,
            },
          ],
        },
        {
          id: 'd1-s11-ex2',
          title: 'Project Tier: Welcome Message Program Generator',
          type: 'write-code',
          tier: 'project',
          points: 30,
          prompt: 'Build the foundational Welcome Message Program specified in Section 14:\n1. Define establishment_name = "Grand Square Supermarket"\n2. Define city = "Abuja"\n3. Define daily_shoppers = 1250\n4. Define is_open = True\n5. Output exactly these 3 lines:\nLine 1: ========================================\nLine 2: Welcome to Grand Square Supermarket (Abuja)\nLine 3: Status Open: True | Daily Capacity: 1250',
          contextScenario: 'Retail Store Entry Banner Display in Central Business District, Abuja',
          starterCode: `# Build your welcome message program below:
establishment_name = "Grand Square Supermarket"
city = "Abuja"
daily_shoppers = 1250
is_open = True

`,
          solutionCode: `establishment_name = "Grand Square Supermarket"
city = "Abuja"
daily_shoppers = 1250
is_open = True
print("========================================")
print(f"Welcome to {establishment_name} ({city})")
print(f"Status Open: {is_open} | Daily Capacity: {daily_shoppers}")`,
          testCases: [
            {
              id: 'tc-proj-1',
              label: 'Welcome Message Formatted Verification',
              setup: '',
              expected: '========================================\nWelcome to Grand Square Supermarket (Abuja)\nStatus Open: True | Daily Capacity: 1250',
              hidden: false,
            },
          ],
          hints: [
            'Line 1 is 40 equal signs: "========================================".',
            'Line 2 combines establishment_name and city: f"Welcome to {establishment_name} ({city})".',
            'Line 3 combines boolean is_open and integer daily_shoppers.',
          ],
        },
      ],
      assess: [],
    },
  ],

  // ==========================================
  // REAL-WORLD LABS (Section 14 & 13.2)
  // ==========================================
  realWorldLabs: [
    {
      id: 'd1-lab-pos',
      title: 'Lab 1: Eko Market POS Terminal Daily Onboarding Banner',
      domain: 'ecommerce',
      description: 'Program an automated POS startup banner for a merchant at Balogun Market, Lagos. The script calculates total cash in drawer after opening float plus initial sales.',
      starterCode: `# Balogun Market Merchant POS Terminal Initialization
merchant_name = "Eko Fashion & Fabrics"
terminal_id = "POS-LAG-4019"
opening_float = 25000
morning_sales = 48500
total_drawer = opening_float + morning_sales

print("------------------------------------------")
print(f"MERCHANT: {merchant_name} [{terminal_id}]")
print(f"Opening Float: N{opening_float:,} | Morning Sales: N{morning_sales:,}")
print(f"Cash in Drawer: N{total_drawer:,}")
print("System Status: Online & Ready for Transactions")
print("------------------------------------------")
`,
      targetOutput: `------------------------------------------
MERCHANT: Eko Fashion & Fabrics [POS-LAG-4019]
Opening Float: N25,000 | Morning Sales: N48,500
Cash in Drawer: N73,500
System Status: Online & Ready for Transactions
------------------------------------------`,
    },
    {
      id: 'd1-lab-school',
      title: 'Lab 2: Secondary School Morning Assembly Announcement Generator',
      domain: 'school',
      description: 'Generate dynamic morning assembly announcements for a secondary school in Abuja, calculating term week progress and student attendance.',
      starterCode: `# Loyola Academy Daily Morning Assembly Script
school_name = "Loyola Academy"
city = "Abuja"
current_term = "First Term 2026/2027"
current_week = 4
total_weeks = 13
enrolled_students = 640
present_today = 618

weeks_remaining = total_weeks - current_week
absent_count = enrolled_students - present_today

print(f"=== {school_name}, {city} ===")
print(f"Session: {current_term} (Week {current_week} of {total_weeks})")
print(f"Weeks Remaining: {weeks_remaining}")
print(f"Today's Attendance: {present_today}/{enrolled_students} ({absent_count} absent)")
print("Word of the Day: Diligence and Consistency")
`,
      targetOutput: `=== Loyola Academy, Abuja ===
Session: First Term 2026/2027 (Week 4 of 13)
Weeks Remaining: 9
Today's Attendance: 618/640 (22 absent)
Word of the Day: Diligence and Consistency`,
    },
  ],

  // ==========================================
  // MINI PROJECT (Section 14)
  // ==========================================
  miniProject: {
    id: 'day1-miniproject',
    title: 'School or Retail Shop Welcome Message Program',
    brief: 'Create a complete customized welcoming and onboarding script for a Nigerian secondary school, supermarket, or medical clinic. The program must store essential profile attributes in variables of different types (str, int, float, bool), calculate a summary statistic, and print a formatted multi-line welcome banner with zero syntax or indentation errors.',
    requirements: [
      'Define at least 4 variables representing establishment name (str), location (str), capacity or student count (int), and operating status (bool).',
      'Perform at least one arithmetic calculation (e.g. remaining capacity, total revenue, or years active).',
      'Format and display a multi-line greeting banner using print() and f-strings.',
      'Include single-line comments (#) explaining the business logic.',
      'Strictly adhere to PEP 8 standards (lowercase_with_underscores variable names, 4 spaces indentation).',
    ],
    rubric: [
      { criterion: 'Valid Python syntax and flawless execution in CPython/Pyodide', weight: 35 },
      { criterion: 'Correct use of multiple core data types (str, int, float, bool)', weight: 25 },
      { criterion: 'Formatted f-string output and clean terminal presentation', weight: 20 },
      { criterion: 'Meaningful comments and PEP 8 indentation discipline', weight: 20 },
    ],
    starterCode: `# Day 1 Mini Project: Welcome Message Program
# Customize this script for your chosen school or shop:

establishment = "Kano Heritage Craft Market"
state = "Kano"
total_booths = 85
occupied_booths = 72
is_open_today = True

# Calculate vacant booths
vacant_booths = total_booths - occupied_booths

# Display formatted welcome banner
print("************************************************")
print(f"   WELCOME TO {establishment.upper()}   ")
print(f"   Location: {state} State, Nigeria   ")
print("************************************************")
print(f"Operating Status: Open ({is_open_today})")
print(f"Capacity: {occupied_booths}/{total_booths} artisan booths occupied")
print(f"Available Spaces Today: {vacant_booths}")
print("Thank you for supporting indigenous craftsmanship!")
print("************************************************")
`,
  },

  // ==========================================
  // DAY CHECKPOINT QUIZ (Section 10.2 & 13.5: Exactly 10 Scenario Questions)
  // ==========================================
  dayQuiz: {
    title: 'Day 1 Checkpoint Assessment',
    passingScorePercentage: 80,
    questions: [
      {
        id: 'd1-q1',
        scenario: 'Lagos Traffic Telemetry System',
        question: 'A programmer enters the instruction: print("Third Mainland Bridge Speed Limit: 80km/h) but forgets the closing double quote. At which phase of execution does Python reject the program?',
        options: [
          {
            id: 'q1-a',
            text: 'During tokenization and parsing (raising a SyntaxError before any code executes).',
            explanation: 'Correct! The lexer/parser cannot form a valid string token, so CPython raises SyntaxError before bytecode compilation or PVM execution.',
            isCorrect: true,
          },
          {
            id: 'q1-b',
            text: 'While the Python Virtual Machine is evaluating the print statement on the stack.',
            explanation: 'Incorrect. Code with invalid syntax never reaches the bytecode compiler or the PVM.',
            isCorrect: false,
          },
          {
            id: 'q1-c',
            text: 'Only when the operating system writes characters to the terminal buffer.',
            explanation: 'Incorrect. The operating system only receives text after successful execution.',
            isCorrect: false,
          },
          {
            id: 'q1-d',
            text: 'It is not rejected; Python automatically adds missing quotes at runtime.',
            explanation: 'Incorrect. Python never guesses or alters incomplete code syntax.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd1-q2',
        scenario: 'Kano Grain Market POS Billing',
        question: 'A developer writes a script file pos_bill.py containing the single line: 4500 * 3. When they run "python3 pos_bill.py" in their terminal, what happens on the screen?',
        options: [
          {
            id: 'q2-a',
            text: 'Nothing is displayed on the screen.',
            explanation: 'Correct! In a script file, expressions evaluate in memory but are immediately discarded unless passed to print(). Only the interactive shell auto-echoes expressions.',
            isCorrect: true,
          },
          {
            id: 'q2-b',
            text: 'The number 13500 is printed automatically.',
            explanation: 'Incorrect. Automatic echoing only occurs in the interactive shell (REPL), never in script files.',
            isCorrect: false,
          },
          {
            id: 'q2-c',
            text: 'Python raises a SyntaxError because an expression cannot stand alone.',
            explanation: 'Incorrect. Standalone expressions are valid statements in Python (Expr AST nodes), but their return value is discarded without print.',
            isCorrect: false,
          },
          {
            id: 'q2-d',
            text: 'The terminal prompts the user to save the result into a variable.',
            explanation: 'Incorrect. Python does not prompt interactively when running a script.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd1-q3',
        scenario: 'Abuja Secondary School Grade Evaluator',
        question: 'Consider this code:\n\nscore = 78\nif score >= 50:\nprint("Credit Pass")\n\nWhy does Python halt with an IndentationError?',
        options: [
          {
            id: 'q3-a',
            text: 'A colon (:) indicates the start of a compound block, requiring subsequent lines to be indented (typically 4 spaces).',
            explanation: 'Correct! In Python grammar, an indented block is mandatory immediately after a compound header ending in a colon.',
            isCorrect: true,
          },
          {
            id: 'q3-b',
            text: 'The variable name "score" was not typed as an integer.',
            explanation: 'Incorrect. Python is dynamically typed; no type declarations are needed.',
            isCorrect: false,
          },
          {
            id: 'q3-c',
            text: 'An if condition must always be accompanied by an else clause.',
            explanation: 'Incorrect. else is optional in Python if statements.',
            isCorrect: false,
          },
          {
            id: 'q3-d',
            text: 'Curly brackets { } were required around print("Credit Pass").',
            explanation: 'Incorrect. Python does not use curly brackets to define blocks.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd1-q4',
        scenario: 'Port Harcourt Logistics Fleet System',
        question: 'An engineer accidentally writes: Print("Vehicle Dispatched") with an uppercase "P". What does Python do and why?',
        options: [
          {
            id: 'q4-a',
            text: 'Raises NameError because Python is strictly case-sensitive and "Print" is not defined.',
            explanation: 'Correct! Python treats Print, print, and PRINT as completely distinct identifiers. Built-in functions are always lowercase.',
            isCorrect: true,
          },
          {
            id: 'q4-b',
            text: 'Executes normally because built-in functions ignore casing in modern Python.',
            explanation: 'Incorrect. Python is strictly case-sensitive in all versions.',
            isCorrect: false,
          },
          {
            id: 'q4-c',
            text: 'Prints the text but issues a DeprecationWarning.',
            explanation: 'Incorrect. Case mistakes are fatal NameErrors, not warnings.',
            isCorrect: false,
          },
          {
            id: 'q4-d',
            text: 'Opens the physical printer dialog on the operating system.',
            explanation: 'Incorrect. print() writes to standard console output, not hardware printers.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd1-q5',
        scenario: 'Fintech USSD Session Gateway',
        question: 'When a bank USSD script executes: step = 1; step = "CONFIRM_PIN", what happens in CPython memory?',
        options: [
          {
            id: 'q5-a',
            text: 'An int object (1) is allocated, then a new str object ("CONFIRM_PIN") is allocated, and the name "step" is rebound to the new string.',
            explanation: 'Correct! Python variables are names bound to objects. Reassignment rebinds the name to a new object; the old int object is freed if unreferenced.',
            isCorrect: true,
          },
          {
            id: 'q5-a2',
            text: 'Python raises a TypeError because a variable declared as int cannot be reassigned to a string.',
            explanation: 'Incorrect. Python is dynamically typed; variables can be rebound to objects of any type.',
            isCorrect: false,
          },
          {
            id: 'q5-c',
            text: 'The integer 1 is mutated in place and its memory bytes are rewritten as characters.',
            explanation: 'Incorrect. Integers in Python are immutable objects.',
            isCorrect: false,
          },
          {
            id: 'q5-d',
            text: 'The program halts with a ReassignmentException.',
            explanation: 'Incorrect. Python has no such exception; variable reassignment is standard.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd1-q6',
        scenario: 'Ibadan Agro-Meteorological Sensor',
        question: 'A weather monitoring station records: rainfall_mm = 14.5. Which data type does Python assign to rainfall_mm, and why?',
        options: [
          {
            id: 'q6-a',
            text: 'float, because the number contains a decimal point representing a real number.',
            explanation: 'Correct! Numbers with decimal points are represented as 64-bit IEEE 754 double precision floats.',
            isCorrect: true,
          },
          {
            id: 'q6-b',
            text: 'int, because Python rounds all numbers during assignment.',
            explanation: 'Incorrect. Python never silently rounds numbers during variable assignment.',
            isCorrect: false,
          },
          {
            id: 'q6-c',
            text: 'str, because all numeric inputs from variables default to characters.',
            explanation: 'Incorrect. Bare numbers in source code are parsed as numeric literals, not strings.',
            isCorrect: false,
          },
          {
            id: 'q6-d',
            text: 'decimal, because all financial and weather numbers in Python default to the Decimal class.',
            explanation: 'Incorrect. The Decimal class lives in the decimal module and must be imported explicitly.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd1-q7',
        scenario: 'Onitsha Electronics Market Inventory',
        question: 'What is the primary difference between how the Python interpreter handles comments (#) versus docstrings (""" """)?',
        options: [
          {
            id: 'q7-a',
            text: 'Comments are stripped completely during tokenization and do not exist at runtime, while docstrings are stored in the __doc__ attribute of objects.',
            explanation: 'Correct! Hash comments are discarded during lexing, whereas docstrings are preserved in object metadata for help() and introspection.',
            isCorrect: true,
          },
          {
            id: 'q7-b',
            text: 'Docstrings execute at half speed, while hash comments execute at full speed.',
            explanation: 'Incorrect. Neither comments nor docstrings represent executable instructions.',
            isCorrect: false,
          },
          {
            id: 'q7-c',
            text: 'Comments can only be placed at the top of a file, while docstrings can only be at the bottom.',
            explanation: 'Incorrect. Hash comments can be placed anywhere in source code.',
            isCorrect: false,
          },
          {
            id: 'q7-d',
            text: 'There is no difference; Python converts hash comments into docstrings automatically.',
            explanation: 'Incorrect. Hash comments and docstrings are handled completely differently by the compiler.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd1-q8',
        scenario: 'Cross River National Park Wildlife Monitoring',
        question: 'A research assistant encounters an unfamiliar error with 25 lines of traceback output. What is the Golden Rule of reading Python tracebacks?',
        options: [
          {
            id: 'q8-a',
            text: 'Read from the BOTTOM line first to see the exact exception type and message, then check the line number directly above it.',
            explanation: 'Correct! In Python tracebacks, the most recent call and the fatal exception are always printed at the very bottom.',
            isCorrect: true,
          },
          {
            id: 'q8-b',
            text: 'Read from line 1 of the traceback, because the first line always contains the ultimate root cause.',
            explanation: 'Incorrect. The top of a traceback is the entry point (e.g. module level), not the point of failure.',
            isCorrect: false,
          },
          {
            id: 'q8-c',
            text: 'Count how many lines of error there are to determine how many files must be deleted.',
            explanation: 'Incorrect. Traceback height reflects call stack depth, not file damage.',
            isCorrect: false,
          },
          {
            id: 'q8-d',
            text: 'Ignore the text and reinstall the Python interpreter from scratch.',
            explanation: 'Incorrect. Tracebacks describe user code errors, not corrupted interpreter installations.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd1-q9',
        scenario: 'Kaduna Solar Micro-grid Inverter',
        question: 'An energy engineer writes:\n\nis_active = True\nis_active = False\nprint("Active:", is_active)\n\nWhat prints and why?',
        options: [
          {
            id: 'q9-a',
            text: 'Active: False — because the variable was reassigned to the boolean singleton False before print() was called.',
            explanation: 'Correct! Sequential execution updates the binding of is_active to False before the print statement runs.',
            isCorrect: true,
          },
          {
            id: 'q9-b',
            text: 'Active: True — because variables in Python are constant and cannot change after first assignment.',
            explanation: 'Incorrect. Variables in Python are mutable bindings by default; Python has no const keyword.',
            isCorrect: false,
          },
          {
            id: 'q9-c',
            text: 'Active: [True, False] — because reassignment appends to a history list.',
            explanation: 'Incorrect. Reassignment replaces the object reference; it does not create a list.',
            isCorrect: false,
          },
          {
            id: 'q9-d',
            text: 'NameError: cannot reassign boolean.',
            explanation: 'Incorrect. Boolean values can be freely rebound to identifiers.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
      {
        id: 'd1-q10',
        scenario: 'Benin Electricity Distribution Billing',
        question: 'A billing notification script needs to print the text: Customer\'s Meter Credited. Which syntax is valid in Python without requiring a backslash escape?',
        options: [
          {
            id: 'q10-a',
            text: 'print("Customer\'s Meter Credited")',
            explanation: 'Correct! Enclosing the string in double quotes (") allows single quotes/apostrophes (\') inside without escaping.',
            isCorrect: true,
          },
          {
            id: 'q10-b',
            text: 'print(\'Customer\'s Meter Credited\')',
            explanation: 'Incorrect. The apostrophe terminates the single-quoted string early, causing a SyntaxError.',
            isCorrect: false,
          },
          {
            id: 'q10-c',
            text: 'print([Customer\'s Meter Credited])',
            explanation: 'Incorrect. Square brackets define a list, and unquoted words are treated as invalid identifiers.',
            isCorrect: false,
          },
          {
            id: 'q10-d',
            text: 'Python does not allow apostrophes inside strings under any circumstances.',
            explanation: 'Incorrect. Python fully supports Unicode strings containing apostrophes.',
            isCorrect: false,
          },
        ],
        points: 10,
      },
    ],
  },
  cheatSheet: [
    {
      category: 'Output & Printing',
      syntax: "print(*objects, sep=' ', end='\\n')",
      description: 'Prints objects to standard output. sep specifies the delimiter between items (default single space). end specifies the trailing character (default newline).',
      example: `print("Welcome", "to", "Python", sep=" - ")
print("Status: Active", end=" | ")
print("Ready")`,
    },
    {
      category: 'String Formatting (f-strings)',
      syntax: 'f"Text {variable_or_expression}"',
      description: 'Formatted string literal (Python 3.6+). Evaluates variables and expressions inside curly braces {} directly within the string.',
      example: `city = "Abuja"
daily_temp = 32.4
print(f"Weather alert for {city}: Temperature is {daily_temp}°C")`,
    },
    {
      category: 'Execution Environments',
      syntax: 'python3 (REPL) vs python3 script.py',
      description: 'The interactive shell (REPL) executes code line-by-line with automatic echoing. Script execution compiles the whole file to bytecode and runs it sequentially via the PVM.',
      example: `# In Terminal:
# $ python3           -> Launches interactive REPL (>>> prompt)
# $ python3 app.py    -> Runs file in batch mode`,
    },
    {
      category: 'Core Primitive Types',
      syntax: 'type(object) -> class',
      description: 'Inspect dynamic data types: int (whole numbers), float (decimals), str (text), bool (True or False), and list (ordered sequences).',
      example: `print(type(42))         # <class 'int'>
print(type(3.14))       # <class 'float'>
print(type("Lagos"))    # <class 'str'>
print(type(True))       # <class 'bool'>
print(type([1, 2, 3]))  # <class 'list'>`,
    },
    {
      category: 'Indentation & Code Blocks',
      syntax: '4 spaces per block level (PEP 8)',
      description: 'Python uses significant whitespace to define block structure following colons (:). Never mix tabs and spaces. Inconsistent indentation triggers IndentationError.',
      example: `is_registered = True
if is_registered:
    # 4 spaces indentation indent this block
    print("User verified.")
    print("Granting system access.")`,
    },
    {
      category: 'Comments & Documentation',
      syntax: '# single-line or """ docstring """',
      description: 'Hash comments (#) are ignored by the Python compiler. Triple-quoted strings (""") at the start of modules or functions serve as docstrings stored in __doc__.',
      example: `# Calculate cashier float in Balogun Market
opening_float = 25000
sales = 14500
total = opening_float + sales  # inline comment

"""
Module Docstring:
This script handles cashier drawer reconciliation.
"""`,
    },
    {
      category: 'Basic Arithmetic Operators',
      syntax: '+ , - , * , / , // , % , **',
      description: 'Standard arithmetic operators: / always returns a float. // performs floor division (rounds down), % computes remainder (modulus), and ** is exponentiation.',
      example: `print(17 / 5)    # 3.4  (float division)
print(17 // 5)   # 3    (floor division)
print(17 % 5)    # 2    (modulus/remainder)
print(2 ** 4)    # 16   (exponentiation 2^4)`,
    },
    {
      category: 'Variables & Assignment',
      syntax: 'identifier = value',
      description: 'Creates a name that references an object in memory. Identifiers are case-sensitive, must begin with a letter or underscore, and cannot be a reserved keyword.',
      example: `market_stall = "Shop 12"
item_count = 150
# Sequential reassignment rebinds the identifier:
item_count = 155
print(f"{market_stall} inventory: {item_count}")`,
    },
    {
      category: 'Debugging & Tracebacks',
      syntax: 'Traceback Golden Rule: Read bottom-to-top',
      description: 'In Python tracebacks, the fatal exception type and message are printed on the very last line. The line number and offending statement appear directly above it.',
      example: `# Traceback (most recent call last):
#   File "app.py", line 4, in <module>
#     print(total_cost)
# NameError: name 'total_cost' is not defined
# -> Step 1: Read bottom line (NameError)
# -> Step 2: Check line 4 (variable was not assigned before use)`,
    },
    {
      category: 'String Quotes & Escaping',
      syntax: '\'single\', "double", or \\ (escape)',
      description: 'Enclose strings with single or double quotes. If your text contains apostrophes, use double quotes to avoid backslash escaping.',
      example: `clean_text = "Learner's Python Notebook"  # Double quotes prevent apostrophe collision
escaped_text = 'Learner\\'s Notebook'      # Backslash escape
quote_in_text = 'She said, "Keep coding!"' # Single quotes around double quotes`,
    },
  ],
};
