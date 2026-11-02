/**
 * Data Types Visualiser Simulation Primitive
 * Section 8.4 & 14 (Day 2): Interactive exploration of Python's 10 core data types.
 * Allows learners to inspect types, mutability, syntax, and test arbitrary values with type().
 */

import React, { useState } from 'react';
import { Box, Check, Sparkles, AlertCircle, Info, ArrowRight } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface DataTypeInfo {
  name: string;
  typeTag: string;
  category: 'Numeric' | 'Sequence' | 'Mapping' | 'Set' | 'Boolean' | 'Null';
  isMutable: boolean;
  example: string;
  syntax: string;
  description: string;
  cpythonNote: string;
  realWorldUse: string;
}

const CORE_DATA_TYPES: DataTypeInfo[] = [
  {
    name: 'Integer',
    typeTag: 'int',
    category: 'Numeric',
    isMutable: false,
    example: 'student_count = 45\ntemperature = -5',
    syntax: 'x = 42',
    description: 'Whole positive or negative numbers with arbitrary precision (no maximum limit in Python 3).',
    cpythonNote: 'CPython pre-allocates small integer objects from -5 to 256 for memory performance.',
    realWorldUse: 'Counting items, school enrollment, inventory units, indices.',
  },
  {
    name: 'Float',
    typeTag: 'float',
    category: 'Numeric',
    isMutable: false,
    example: 'exchange_rate = 1450.75\npi_val = 3.14159',
    syntax: 'x = 3.14',
    description: 'Double-precision 64-bit IEEE 754 floating-point numbers containing fractional values.',
    cpythonNote: 'Binary floating-point approximation applies: 0.1 + 0.2 is 0.30000000000000004.',
    realWorldUse: 'Financial currency rates, GPS latitude/longitude, sensor temperatures.',
  },
  {
    name: 'Complex',
    typeTag: 'complex',
    category: 'Numeric',
    isMutable: false,
    example: 'impedance = 3 + 4j\nz = complex(2, -5)',
    syntax: 'x = 2 + 5j',
    description: 'Numbers with real and imaginary parts denoted by the j or J suffix.',
    cpythonNote: 'Stored as two 64-bit C doubles: one for real, one for imag.',
    realWorldUse: 'Electrical alternating current (AC) engineering, quantum physics, signal processing.',
  },
  {
    name: 'String',
    typeTag: 'str',
    category: 'Sequence',
    isMutable: false,
    example: 'city = "Lagos"\nquote = \'Code is craft\'',
    syntax: 's = "Hello"',
    description: 'Immutable sequence of Unicode code points (characters). Enclosed in single, double, or triple quotes.',
    cpythonNote: 'CPython interns common ASCII strings and short identifiers to save memory.',
    realWorldUse: 'Customer names, addresses, API payloads, SMS messages.',
  },
  {
    name: 'Boolean',
    typeTag: 'bool',
    category: 'Boolean',
    isMutable: false,
    example: 'is_active = True\nhas_passed = False',
    syntax: 'flag = True',
    description: 'Represents truth values: exactly two singleton objects exist in memory: True and False.',
    cpythonNote: 'bool is a subclass of int: issubclass(bool, int) is True; True == 1 and False == 0.',
    realWorldUse: 'Authorization status, conditional switches, validation checks.',
  },
  {
    name: 'List',
    typeTag: 'list',
    category: 'Sequence',
    isMutable: true,
    example: 'cities = ["Abuja", "Kano", "Ibadan"]\nscores = [88, 92, 79]',
    syntax: 'items = [1, 2, 3]',
    description: 'Ordered, mutable sequence of arbitrary objects. Elements can be added, updated, or removed.',
    cpythonNote: 'Implemented as dynamic over-allocated arrays of C pointers for O(1) append.',
    realWorldUse: 'Shopping carts, daily sales queues, registered attendee rosters.',
  },
  {
    name: 'Tuple',
    typeTag: 'tuple',
    category: 'Sequence',
    isMutable: false,
    example: 'dimensions = (1920, 1080)\nrgb = (255, 128, 0)',
    syntax: 'coords = (x, y)',
    description: 'Ordered, immutable collection. Once created, elements cannot be modified or appended.',
    cpythonNote: 'Lightweight memory footprint compared to lists; can be used as dictionary keys if hashable.',
    realWorldUse: 'Database records, geographic coordinates, fixed configuration constants.',
  },
  {
    name: 'Set',
    typeTag: 'set',
    category: 'Set',
    isMutable: true,
    example: 'tags = {"python", "education", "code"}\nids = set([101, 102, 101])',
    syntax: 'unique = {1, 2, 3}',
    description: 'Unordered collection of unique, hashable objects. Automatically eliminates duplicates.',
    cpythonNote: 'Implemented via hash tables giving average O(1) membership testing with "in".',
    realWorldUse: 'Unique visitor IDs, tag filtering, mathematical intersections.',
  },
  {
    name: 'Dictionary',
    typeTag: 'dict',
    category: 'Mapping',
    isMutable: true,
    example: 'merchant = {"name": "Balogun Traders", "state": "Lagos", "tier": 1}',
    syntax: 'd = {"key": "val"}',
    description: 'Mutable key-value mapping. Keys must be immutable/hashable; preserves insertion order (Python 3.7+).',
    cpythonNote: 'Uses compact hash tables with combined index arrays for high memory efficiency.',
    realWorldUse: 'User accounts, JSON data APIs, lookup tables, product catalogues.',
  },
  {
    name: 'NoneType',
    typeTag: 'None',
    category: 'Null',
    isMutable: false,
    example: 'current_user = None\nresult = print("hello")',
    syntax: 'x = None',
    description: 'The singleton object None representing the absence of a value or default return of functions.',
    cpythonNote: 'There is only one None object in memory. Identity comparison "x is None" is standard.',
    realWorldUse: 'Optional parameters, uninitialized states, functions without explicit return.',
  },
];

export const DataTypesVisualizerSim: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('int');
  const [customInput, setCustomInput] = useState<string>('42');
  const [inspectResult, setInspectResult] = useState<{
    inferredType: string;
    isMutable: boolean;
    explanation: string;
    objectNumber: number;
  } | null>(null);

  const activeType = CORE_DATA_TYPES.find((t) => t.typeTag === selectedTag) || CORE_DATA_TYPES[0];

  const handleInspect = () => {
    const raw = customInput.trim();
    if (raw === '') {
      setInspectResult({
        inferredType: 'None',
        isMutable: false,
        explanation: 'Empty input defaults to None.',
        objectNumber: 100,
      });
      return;
    }

    if (raw === 'None') {
      setInspectResult({
        inferredType: 'NoneType',
        isMutable: false,
        explanation: 'The singleton None object representing absence of value.',
        objectNumber: 101,
      });
      return;
    }

    if (raw === 'True' || raw === 'False') {
      setInspectResult({
        inferredType: 'bool',
        isMutable: false,
        explanation: 'Boolean singleton object (subclass of int).',
        objectNumber: raw === 'True' ? 102 : 103,
      });
      return;
    }

    if (/^-?\d+$/.test(raw)) {
      setInspectResult({
        inferredType: 'int',
        isMutable: false,
        explanation: 'Whole integer value with arbitrary precision.',
        objectNumber: 104,
      });
      return;
    }

    if (/^-?\d+\.\d+$/.test(raw)) {
      setInspectResult({
        inferredType: 'float',
        isMutable: false,
        explanation: '64-bit IEEE 754 floating-point decimal.',
        objectNumber: 105,
      });
      return;
    }

    if (/^-?\d+(\.\d+)?[+-]\d+(\.\d+)?[jJ]$/.test(raw) || /^-?\d+[jJ]$/.test(raw)) {
      setInspectResult({
        inferredType: 'complex',
        isMutable: false,
        explanation: 'Complex number with real and imaginary parts.',
        objectNumber: 106,
      });
      return;
    }

    if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
      setInspectResult({
        inferredType: 'str',
        isMutable: false,
        explanation: 'Immutable Unicode character sequence.',
        objectNumber: 107,
      });
      return;
    }

    if (raw.startsWith('[') && raw.endsWith(']')) {
      setInspectResult({
        inferredType: 'list',
        isMutable: true,
        explanation: 'Ordered, mutable list of items.',
        objectNumber: 108,
      });
      return;
    }

    if (raw.startsWith('(') && raw.endsWith(')')) {
      setInspectResult({
        inferredType: 'tuple',
        isMutable: false,
        explanation: 'Ordered, immutable tuple sequence.',
        objectNumber: 109,
      });
      return;
    }

    if (raw.startsWith('{') && raw.endsWith('}')) {
      if (raw.includes(':')) {
        setInspectResult({
          inferredType: 'dict',
          isMutable: true,
          explanation: 'Key-value mapping dictionary.',
          objectNumber: 110,
        });
      } else {
        setInspectResult({
          inferredType: 'set',
          isMutable: true,
          explanation: 'Unordered collection of unique items.',
          objectNumber: 111,
        });
      }
      return;
    }

    // Default string literal fallback if unquoted text
    setInspectResult({
      inferredType: 'str (unquoted literal)',
      isMutable: false,
      explanation: `In standard Python, bare word "${raw}" would be evaluated as a variable identifier. If intended as text, wrap in quotes: "${raw}".`,
      objectNumber: 112,
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Python Data Types Visualiser"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {/* Type Selector Horizontal Strip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="eyebrow-label text-[10px] text-[var(--accent-primary)]">
              SELECT PYTHON CORE TYPE
            </span>
            <span className="text-[11px] text-[var(--text-dim)]">10 Standard Types</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {CORE_DATA_TYPES.map((t) => (
              <button
                key={t.typeTag}
                onClick={() => setSelectedTag(t.typeTag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 border ${
                  selectedTag === t.typeTag
                    ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] border-[var(--accent-primary)] shadow-sm'
                    : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)] hover:border-[var(--border-strong)]'
                }`}
              >
                {t.typeTag}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Type Detail Card */}
        <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[var(--text-main)]">
                  {activeType.name} (<code className="text-[var(--accent-primary)]">{activeType.typeTag}</code>)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-dim)]">
                  {activeType.category}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">{activeType.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                  activeType.isMutable
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {activeType.isMutable ? '⚡ Mutable (Can Change)' : '🔒 Immutable (Fixed)'}
              </span>
            </div>
          </div>

          {/* Syntax and Code Example */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="eyebrow-label text-[10px] text-[var(--text-dim)]">SYNTAX &amp; DECLARATION</span>
              <pre className="p-3 rounded-xl bg-[var(--bg-code)] font-mono text-xs text-[var(--text-code)] border border-[var(--border-subtle)]">
                {activeType.syntax}
              </pre>
            </div>

            <div className="space-y-1.5">
              <span className="eyebrow-label text-[10px] text-[var(--text-dim)]">REAL EXAMPLE</span>
              <pre className="p-3 rounded-xl bg-[var(--bg-code)] font-mono text-xs text-emerald-400 border border-[var(--border-subtle)]">
                {activeType.example}
              </pre>
            </div>
          </div>

          {/* CPython Note & Real World Application */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-1">
              <div className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-sky-400" />
                <span>CPython Implementation Detail</span>
              </div>
              <p className="text-[var(--text-muted)] text-[11px]">{activeType.cpythonNote}</p>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-1">
              <div className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Real-World Domain Use</span>
              </div>
              <p className="text-[var(--text-muted)] text-[11px]">{activeType.realWorldUse}</p>
            </div>
          </div>
        </div>

        {/* Live Type Inspector Experiment Stage */}
        <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-[var(--accent-primary)]" />
            <span className="eyebrow-label text-xs">LIVE type() INSPECTION EXPERIMENT</span>
          </div>

          <p className="text-xs text-[var(--text-muted)]">
            Type any literal or expression below to evaluate its Python type and inspect its runtime representation:
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-[var(--text-dim)]">
                type(
              </span>
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g. 42, 3.14, 'Lagos', [1, 2], True, None"
                className="w-full pl-14 pr-6 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] font-mono text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-[var(--text-dim)]">
                )
              </span>
            </div>

            <button
              onClick={handleInspect}
              className="px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] text-xs font-bold transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Inspect Object</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Presets for Learner Exploration */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[11px]">
            <span className="text-[var(--text-dim)] shrink-0">Try presets:</span>
            {[
              '42',
              '3.14159',
              '2 + 3j',
              '"Balogun Market"',
              'True',
              '["Abuja", "Enugu"]',
              '(1920, 1080)',
              '{"apple", "orange"}',
              '{"name": "Amina"}',
              'None',
            ].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setCustomInput(p);
                  setTimeout(handleInspect, 50);
                }}
                className="px-2 py-0.5 rounded-md bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] font-mono text-[10px] shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Inspection Result Card */}
          {inspectResult && (
            <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-500/5 space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sky-400">
                    type({customInput}) -&gt; &lt;class '{inspectResult.inferredType}'&gt;
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[var(--text-dim)]">
                  Friendly ID: #obj-{inspectResult.objectNumber}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">{inspectResult.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
