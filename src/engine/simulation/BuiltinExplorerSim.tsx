/**
 * Built-in Function Explorer Simulation Primitive
 * Section 8.4 & 14 (Day 2): Interactive laboratory for Python's core standard built-in functions.
 * Covers: print, len, type, int, float, str, input, list, dict, min, max, sum, sorted, open, help, dir.
 * Distinguishes printed standard output (sys.stdout) from the returned value (None vs object).
 */

import React, { useState } from 'react';
import { Play, RotateCcw, Info, Terminal, CornerDownLeft, Sparkles, BookOpen } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface BuiltinDefinition {
  name: string;
  signature: string;
  category: 'I/O' | 'Inspection' | 'Type Casting' | 'Collection Math' | 'System';
  defaultArg: string;
  description: string;
  returnsValue: boolean;
  returnType: string;
  sampleReturn: string;
  sampleOutput: string;
  cpythonNote: string;
}

const BUILTIN_FUNCTIONS: BuiltinDefinition[] = [
  {
    name: 'print',
    signature: 'print(*objects, sep=" ", end="\\n")',
    category: 'I/O',
    defaultArg: '"Hello from Lagos", 2026',
    description: 'Writes string representations of objects to standard output (sys.stdout).',
    returnsValue: false,
    returnType: 'None',
    sampleReturn: 'None',
    sampleOutput: 'Hello from Lagos 2026',
    cpythonNote: 'print() returns None. The text visible on screen is a side-effect sent to standard output stream.',
  },
  {
    name: 'len',
    signature: 'len(s) -> int',
    category: 'Inspection',
    defaultArg: '"Federal Republic of Nigeria"',
    description: 'Returns the number of items in a sequence (string, list, tuple) or collection (dict, set).',
    returnsValue: true,
    returnType: 'int',
    sampleReturn: '28',
    sampleOutput: '',
    cpythonNote: 'Calls the C-level ob_size attribute on objects for constant O(1) time complexity.',
  },
  {
    name: 'type',
    signature: 'type(object) -> class',
    category: 'Inspection',
    defaultArg: '42.5',
    description: 'Returns the exact runtime type/class of the specified object.',
    returnsValue: true,
    returnType: 'type',
    sampleReturn: "<class 'float'>",
    sampleOutput: '',
    cpythonNote: 'Inspects the ob_type pointer in the PyObject struct header.',
  },
  {
    name: 'int',
    signature: 'int(x=0) -> int',
    category: 'Type Casting',
    defaultArg: '19.99',
    description: 'Converts a number or string to an integer, truncating decimal values.',
    returnsValue: true,
    returnType: 'int',
    sampleReturn: '19',
    sampleOutput: '',
    cpythonNote: 'Truncates towards zero; string inputs must contain whole decimal digits.',
  },
  {
    name: 'float',
    signature: 'float(x=0.0) -> float',
    category: 'Type Casting',
    defaultArg: '"1450.50"',
    description: 'Converts a numeric value or valid numeric string into a 64-bit IEEE 754 floating point.',
    returnsValue: true,
    returnType: 'float',
    sampleReturn: '1450.5',
    sampleOutput: '',
    cpythonNote: 'Creates a PyFloatObject containing a 64-bit C double.',
  },
  {
    name: 'str',
    signature: 'str(object="") -> str',
    category: 'Type Casting',
    defaultArg: 'True',
    description: 'Returns the human-readable string representation of an object.',
    returnsValue: true,
    returnType: 'str',
    sampleReturn: "'True'",
    sampleOutput: '',
    cpythonNote: 'Calls object.__str__() or falls back to object.__repr__().',
  },
  {
    name: 'input',
    signature: 'input(prompt="") -> str',
    category: 'I/O',
    defaultArg: '"Enter student name: "',
    description: 'Reads a line from standard input, strips the trailing newline, and ALWAYS returns a string.',
    returnsValue: true,
    returnType: 'str',
    sampleReturn: "'Amina Bello'",
    sampleOutput: 'Enter student name: ',
    cpythonNote: 'Even if the user types a number like 42, input() returns the string "42". Type casting is required for arithmetic.',
  },
  {
    name: 'list',
    signature: 'list(iterable=()) -> list',
    category: 'Type Casting',
    defaultArg: '"Kano"',
    description: 'Constructs a new mutable list object from an iterable sequence.',
    returnsValue: true,
    returnType: 'list',
    sampleReturn: "['K', 'a', 'n', 'o']",
    sampleOutput: '',
    cpythonNote: 'Allocates a brand new list in heap memory. Modifying it will not affect the source.',
  },
  {
    name: 'dict',
    signature: 'dict(**kwargs) -> dict',
    category: 'Type Casting',
    defaultArg: 'city="Abuja", code=900001',
    description: 'Creates a new key-value dictionary mapping.',
    returnsValue: true,
    returnType: 'dict',
    sampleReturn: "{'city': 'Abuja', 'code': 900001}",
    sampleOutput: '',
    cpythonNote: 'Creates a hash table preserving insertion order.',
  },
  {
    name: 'min',
    signature: 'min(iterable, *[, default=obj, key=func])',
    category: 'Collection Math',
    defaultArg: '45, 12, 89, 3',
    description: 'Returns the smallest item in an iterable or among two or more arguments.',
    returnsValue: true,
    returnType: 'number',
    sampleReturn: '3',
    sampleOutput: '',
    cpythonNote: 'Iterates through items performing pairwise "<" comparison.',
  },
  {
    name: 'max',
    signature: 'max(iterable, *[, default=obj, key=func])',
    category: 'Collection Math',
    defaultArg: '45, 12, 89, 3',
    description: 'Returns the largest item in an iterable or among two or more arguments.',
    returnsValue: true,
    returnType: 'number',
    sampleReturn: '89',
    sampleOutput: '',
    cpythonNote: 'Iterates through items performing pairwise ">" comparison.',
  },
  {
    name: 'sum',
    signature: 'sum(iterable, /, start=0)',
    category: 'Collection Math',
    defaultArg: '[1500, 2500, 4000]',
    description: 'Sums the items of an iterable from left to right and returns the total.',
    returnsValue: true,
    returnType: 'int/float',
    sampleReturn: '8000',
    sampleOutput: '',
    cpythonNote: 'Default start value is 0. Does not concatenate strings (use str.join instead).',
  },
  {
    name: 'sorted',
    signature: 'sorted(iterable, /, *, key=None, reverse=False)',
    category: 'Collection Math',
    defaultArg: '[85, 42, 99, 12]',
    description: 'Returns a brand NEW sorted list from the items in iterable without modifying the original.',
    returnsValue: true,
    returnType: 'list',
    sampleReturn: '[12, 42, 85, 99]',
    sampleOutput: '',
    cpythonNote: 'Uses Timsort (adaptive mergesort/insertionsort with guaranteed O(N log N) worst-case).',
  },
  {
    name: 'open',
    signature: 'open(file, mode="r", encoding=None)',
    category: 'I/O',
    defaultArg: '"sample.txt", "r"',
    description: 'Opens file and returns a corresponding file stream object (previewed in Day 2, detailed in Day 19).',
    returnsValue: true,
    returnType: 'TextIOWrapper',
    sampleReturn: "<_io.TextIOWrapper name='sample.txt' mode='r' encoding='UTF-8'>",
    sampleOutput: '',
    cpythonNote: 'In browser runtime, operates against a virtual in-memory filesystem.',
  },
  {
    name: 'help',
    signature: 'help([object])',
    category: 'Inspection',
    defaultArg: 'len',
    description: 'Invokes the built-in interactive help system and prints docstring documentation.',
    returnsValue: false,
    returnType: 'None',
    sampleReturn: 'None',
    sampleOutput: 'Help on built-in function len in module builtins:\n\nlen(obj, /)\n    Return the number of items in a container.',
    cpythonNote: 'Reads the __doc__ string attribute of the target function or class.',
  },
  {
    name: 'dir',
    signature: 'dir([object]) -> list[str]',
    category: 'Inspection',
    defaultArg: 'str',
    description: 'Returns the list of valid attribute and method names for the given object.',
    returnsValue: true,
    returnType: 'list[str]',
    sampleReturn: "['__add__', '__class__', '__contains__', 'capitalize', 'count', 'endswith', 'find', 'format', 'index', 'isalnum', 'isalpha', 'isdigit', 'islower', 'isupper', 'join', 'lower', 'replace', 'split', 'startswith', 'strip', 'title', 'upper']",
    sampleOutput: '',
    cpythonNote: 'Returns sorted list of keys from the object __dict__ and class type hierarchy.',
  },
];

export const BuiltinExplorerSim: React.FC = () => {
  const [selectedName, setSelectedName] = useState<string>('print');
  const [argInput, setArgInput] = useState<string>('"Hello from Lagos", 2026');

  const activeFn = BUILTIN_FUNCTIONS.find((f) => f.name === selectedName) || BUILTIN_FUNCTIONS[0];

  const handleSelectFn = (fn: BuiltinDefinition) => {
    setSelectedName(fn.name);
    setArgInput(fn.defaultArg);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Built-in Function Explorer"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {/* Built-in Function Grid Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="eyebrow-label text-[10px] text-[var(--accent-primary)]">
              SELECT STANDARD BUILT-IN FUNCTION
            </span>
            <span className="text-[11px] text-[var(--text-dim)]">16 Essential Built-ins</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
            {BUILTIN_FUNCTIONS.map((fn) => (
              <button
                key={fn.name}
                onClick={() => handleSelectFn(fn)}
                className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold transition-all text-center border ${
                  selectedName === fn.name
                    ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] border-[var(--accent-primary)] shadow-sm'
                    : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)] hover:border-[var(--border-strong)]'
                }`}
              >
                {fn.name}()
              </button>
            ))}
          </div>
        </div>

        {/* Function Signature & Metadata Card */}
        <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-mono text-[var(--text-main)]">
                  {activeFn.name}()
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[var(--bg-app)] text-[var(--accent-primary)] border border-[var(--border-subtle)]">
                  {activeFn.category}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">{activeFn.description}</p>
            </div>

            <div className="font-mono text-xs text-sky-400 p-2 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] self-start sm:self-auto">
              {activeFn.signature}
            </div>
          </div>

          {/* Argument Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="eyebrow-label text-[10px] text-[var(--text-dim)]">
                SUPPLIED ARGUMENT(S)
              </span>
              <span className="text-[10px] text-[var(--text-dim)] font-mono">
                &gt;&gt;&gt; {activeFn.name}({argInput})
              </span>
            </div>
            <input
              type="text"
              value={argInput}
              onChange={(e) => setArgInput(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] font-mono text-xs text-[var(--text-main)] focus:ring-1 focus:ring-[var(--accent-primary)]"
              placeholder="Arguments..."
            />
          </div>

          {/* CRITICAL COMPARISON: Return Value vs Standard Output */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Box 1: RETURN VALUE (What reaches caller in assignment or REPL) */}
            <div className="p-4 rounded-2xl border-2 border-purple-500/30 bg-purple-500/5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-purple-300 font-bold text-xs">
                  <CornerDownLeft className="w-4 h-4" />
                  <span>RETURNED VALUE</span>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--bg-app)] text-purple-300 border border-purple-500/30">
                  {activeFn.returnType}
                </span>
              </div>
              <div className="font-mono text-xs font-bold text-[var(--text-main)] p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] break-all min-h-[44px] flex items-center">
                {activeFn.sampleReturn}
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                {activeFn.returnsValue
                  ? `Can be captured in a variable: x = ${activeFn.name}(...)`
                  : `Returns None! Capturing in a variable produces None.`}
              </p>
            </div>

            {/* Box 2: STANDARD OUTPUT (What appears on terminal screen) */}
            <div className="p-4 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs">
                  <Terminal className="w-4 h-4" />
                  <span>PRINTED OUTPUT (sys.stdout)</span>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--bg-app)] text-emerald-300 border border-emerald-500/30">
                  Stream
                </span>
              </div>
              <div className="font-mono text-xs font-bold text-emerald-400 p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] whitespace-pre-wrap min-h-[44px] flex items-center">
                {activeFn.sampleOutput || <span className="text-[var(--text-dim)] font-normal italic">(Nothing printed to stdout)</span>}
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                {activeFn.sampleOutput
                  ? `Side-effect written to terminal console screen.`
                  : `Pure function call: operates in memory without printing.`}
              </p>
            </div>
          </div>

          {/* CPython Note */}
          <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-xs space-y-1">
            <div className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span>Language Mechanic Note</span>
            </div>
            <p className="text-[var(--text-muted)] text-[11px]">{activeFn.cpythonNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
