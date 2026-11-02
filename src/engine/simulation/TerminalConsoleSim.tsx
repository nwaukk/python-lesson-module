/**
 * Terminal and Python Console Signature Simulation
 * Master Specification Section 8.4 & Day 1 Brief:
 * Clearly labelled SIMULATION with a safe, responsive command set:
 * python, python3, python --version, python -V, exit(), help(), clear, and running scripts.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Command,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { SimulationController } from './SimulationController';

interface OutputLine {
  id: string;
  type: 'cmd' | 'system' | 'stdout' | 'stderr' | 'repl-cmd' | 'repl-out';
  text: string;
}

const SAMPLE_FILES: Record<string, string> = {
  'welcome.py': `# welcome.py
name = "Ifeanyi"
city = "Enugu"
print(f"Kedu! Welcome {name} from {city} to Python.")
`,
  'calc.py': `# calc.py
price = 1200
tax = 0.075
total = price * (1 + tax)
print(f"Total: N{total:.2f}")
`,
};

export const TerminalConsoleSim: React.FC = () => {
  const [lines, setLines] = useState<OutputLine[]>([
    {
      id: 'init-1',
      type: 'system',
      text: '★ SIMULATED TERMINAL ENVIRONMENT (Safe Browser Sandbox) ★',
    },
    {
      id: 'init-2',
      type: 'system',
      text: 'Type "help", "python --version", or "python3" to get started.',
    },
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [mode, setMode] = useState<'shell' | 'python'>('shell');
  const [replVars, setReplVars] = useState<Record<string, any>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    if (mode === 'shell') {
      // Shell mode ($)
      const newLines: OutputLine[] = [
        ...lines,
        { id: String(Date.now()), type: 'cmd', text: `$ ${trimmed}` },
      ];

      const parts = trimmed.split(' ');
      const mainCmd = parts[0].toLowerCase();
      const arg1 = parts[1];

      if (mainCmd === 'clear' || mainCmd === 'cls') {
        setLines([]);
        setInputValue('');
        return;
      }

      if (mainCmd === 'help') {
        newLines.push({
          id: String(Date.now() + 1),
          type: 'stdout',
          text: `Simulated Terminal Commands:
  • python, python3           : Launch interactive Python 3.12 REPL
  • python --version, -V       : Check installed Python version
  • python3 welcome.py        : Execute a Python script file
  • ls, dir                   : List files in current directory
  • cat <filename>            : View file contents
  • clear                     : Clear screen
  • exit                      : Exit simulation`,
        });
      } else if (
        trimmed === 'python --version' ||
        trimmed === 'python -V' ||
        trimmed === 'python3 --version' ||
        trimmed === 'python3 -V'
      ) {
        newLines.push({
          id: String(Date.now() + 1),
          type: 'stdout',
          text: 'Python 3.12.8 (default, modern standard build)',
        });
      } else if (trimmed === 'python' || trimmed === 'python3') {
        setMode('python');
        newLines.push({
          id: String(Date.now() + 1),
          type: 'stdout',
          text: `Python 3.12.8 (main, simulated terminal) [GCC 11.2.0] on linux
Type "help()", "copyright()", "credits()" or "license()" for more info.
Type "exit()" or "quit()" to return to terminal.`,
        });
      } else if (
        (mainCmd === 'python' || mainCmd === 'python3') &&
        arg1 &&
        SAMPLE_FILES[arg1]
      ) {
        if (arg1 === 'welcome.py') {
          newLines.push({
            id: String(Date.now() + 1),
            type: 'stdout',
            text: 'Kedu! Welcome Ifeanyi from Enugu to Python.',
          });
        } else if (arg1 === 'calc.py') {
          newLines.push({
            id: String(Date.now() + 1),
            type: 'stdout',
            text: 'Total: N1290.00',
          });
        }
      } else if (mainCmd === 'ls' || mainCmd === 'dir') {
        newLines.push({
          id: String(Date.now() + 1),
          type: 'stdout',
          text: 'welcome.py    calc.py    notes.txt',
        });
      } else if (mainCmd === 'cat' && arg1 && SAMPLE_FILES[arg1]) {
        newLines.push({
          id: String(Date.now() + 1),
          type: 'stdout',
          text: SAMPLE_FILES[arg1],
        });
      } else {
        newLines.push({
          id: String(Date.now() + 1),
          type: 'stderr',
          text: `bash: ${trimmed}: command not recognized in this simulation. Try "python3", "python --version", or "help".`,
        });
      }

      setLines(newLines);
    } else {
      // Python REPL mode (>>>)
      const newLines: OutputLine[] = [
        ...lines,
        { id: String(Date.now()), type: 'repl-cmd', text: `>>> ${trimmed}` },
      ];

      if (trimmed === 'exit()' || trimmed === 'quit()') {
        setMode('shell');
        newLines.push({
          id: String(Date.now() + 1),
          type: 'stdout',
          text: 'Exited Python REPL. Back in bash shell.',
        });
      } else if (trimmed === 'exit' || trimmed === 'quit') {
        newLines.push({
          id: String(Date.now() + 1),
          type: 'stderr',
          text: 'Use exit() or Ctrl-D (i.e. EOF) to exit',
        });
      } else if (trimmed === 'help()') {
        newLines.push({
          id: String(Date.now() + 1),
          type: 'stdout',
          text: 'Welcome to Python 3.12 Help Utility. In real Python, this starts interactive help.',
        });
      } else if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
        const inside = trimmed.slice(6, -1).trim();
        // remove outer quotes if string
        const clean = inside.replace(/^["']|["']$/g, '');
        newLines.push({
          id: String(Date.now() + 1),
          type: 'stdout',
          text: clean,
        });
      } else if (trimmed.includes('=')) {
        const [varName, valStr] = trimmed.split('=').map((s) => s.trim());
        setReplVars((prev) => ({ ...prev, [varName]: valStr }));
        // assignment in Python REPL displays nothing
      } else if (replVars[trimmed]) {
        newLines.push({
          id: String(Date.now() + 1),
          type: 'repl-out',
          text: replVars[trimmed],
        });
      } else if (/^[\d\s+\-*/%()]+$/.test(trimmed)) {
        try {
          // evaluate safe arithmetic
          // eslint-disable-next-line no-eval
          const res = Function(`"use strict"; return (${trimmed})`)();
          newLines.push({
            id: String(Date.now() + 1),
            type: 'repl-out',
            text: String(res),
          });
        } catch {
          newLines.push({
            id: String(Date.now() + 1),
            type: 'stderr',
            text: 'SyntaxError: invalid syntax',
          });
        }
      } else {
        newLines.push({
          id: String(Date.now() + 1),
          type: 'stderr',
          text: `NameError: name '${trimmed}' is not defined`,
        });
      }

      setLines(newLines);
    }

    setInputValue('');
  };

  const handleChipClick = (cmd: string) => {
    handleCommand(cmd);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Terminal & Python Console Walkthrough"
        badge="simulation"
        onReset={() => {
          setMode('shell');
          setLines([
            {
              id: 'init-1',
              type: 'system',
              text: '★ SIMULATED TERMINAL ENVIRONMENT (Safe Browser Sandbox) ★',
            },
            {
              id: 'init-2',
              type: 'system',
              text: 'Type "help", "python --version", or "python3" to get started.',
            },
          ]);
        }}
      />

      <div className="flex-1 flex flex-col p-4 md:p-6 space-y-4 overflow-hidden">
        {/* Safe Sandbox Notification */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Simulation Mode:</strong> This console simulates a real Unix/Windows terminal. No commands leave your browser.
            </span>
          </div>
          <span className="font-mono text-[10px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">
            MODE: {mode.toUpperCase()}
          </span>
        </div>

        {/* Quick Click Shortcut Chips */}
        <div className="flex flex-wrap gap-1.5 items-center text-xs">
          <span className="text-[11px] text-[var(--text-dim)] font-medium flex items-center gap-1">
            <Command className="w-3.5 h-3.5" /> Quick Try:
          </span>
          {mode === 'shell' ? (
            <>
              <button
                onClick={() => handleChipClick('python3 --version')}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] font-mono text-[11px] transition-colors"
              >
                python3 --version
              </button>
              <button
                onClick={() => handleChipClick('python -V')}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] font-mono text-[11px] transition-colors"
              >
                python -V
              </button>
              <button
                onClick={() => handleChipClick('python3')}
                className="px-2.5 py-1 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/40 font-mono text-[11px] font-bold transition-colors"
              >
                python3 (Start REPL)
              </button>
              <button
                onClick={() => handleChipClick('python3 welcome.py')}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] font-mono text-[11px] transition-colors"
              >
                python3 welcome.py
              </button>
              <button
                onClick={() => handleChipClick('ls')}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] font-mono text-[11px] transition-colors"
              >
                ls
              </button>
              <button
                onClick={() => handleChipClick('clear')}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:text-red-400 font-mono text-[11px] transition-colors"
              >
                clear
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleChipClick('print("Hello Nigeria!")')}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] font-mono text-[11px] transition-colors"
              >
                print("Hello Nigeria!")
              </button>
              <button
                onClick={() => handleChipClick('1500 * 3')}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] font-mono text-[11px] transition-colors"
              >
                1500 * 3
              </button>
              <button
                onClick={() => handleChipClick('help()')}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] font-mono text-[11px] transition-colors"
              >
                help()
              </button>
              <button
                onClick={() => handleChipClick('exit()')}
                className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 font-mono text-[11px] font-bold transition-colors"
              >
                exit()
              </button>
            </>
          )}
        </div>

        {/* Terminal Screen Frame */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="flex-1 bg-[var(--bg-code)] rounded-2xl border border-[var(--border-subtle)] p-4 font-mono text-xs text-[var(--text-code)] overflow-y-auto flex flex-col shadow-inner cursor-text"
        >
          {lines.map((line) => {
            if (line.type === 'system') {
              return (
                <div key={line.id} className="text-amber-400/90 py-0.5 font-bold">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'cmd') {
              return (
                <div key={line.id} className="text-sky-300 font-bold pt-1">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'repl-cmd') {
              return (
                <div key={line.id} className="text-emerald-300 font-bold pt-1">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'repl-out') {
              return (
                <div key={line.id} className="text-amber-300 pl-4">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'stderr') {
              return (
                <div key={line.id} className="text-red-400 pl-4 py-0.5">
                  {line.text}
                </div>
              );
            }
            return (
              <div key={line.id} className="text-[var(--text-code)] whitespace-pre-wrap pl-2 py-0.5">
                {line.text}
              </div>
            );
          })}

          {/* Active Command Input Line */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCommand(inputValue);
            }}
            className="flex items-center gap-2 mt-1.5"
          >
            <span
              className={`select-none font-bold ${
                mode === 'shell' ? 'text-sky-400' : 'text-amber-400'
              }`}
            >
              {mode === 'shell' ? '$' : '>>>'}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                mode === 'shell'
                  ? 'Try "python3 --version" or "python3"...'
                  : 'Type Python code or "exit()"...'
              }
              className="flex-1 bg-transparent text-[var(--text-code)] outline-hidden font-mono text-xs"
              autoFocus
            />
          </form>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};
