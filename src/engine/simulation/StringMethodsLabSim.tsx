/**
 * String Methods Laboratory Simulation Primitive
 * Section 8.4 & Day 4 Brief:
 * Interactive before-and-after string transformation laboratory covering all 26 required methods
 * plus 7 enrichment methods, live argument modification, generated Python code, returned result,
 * immutability demonstration, and side-by-side watch-out comparisons.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  RefreshCw,
  Search,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { SimulationController } from './SimulationController';

interface MethodDef {
  name: string;
  category: 'case' | 'search' | 'predicates' | 'clean' | 'split-join' | 'format';
  summary: string;
  isEnrichment?: boolean;
  argType: 'none' | 'sub' | 'replace' | 'strip' | 'split' | 'join' | 'width' | 'tabsize' | 'format';
  defaultArg1?: string;
  defaultArg2?: string;
  returnsType: 'str' | 'bool' | 'int' | 'list';
}

const ALL_METHODS: MethodDef[] = [
  // Case & Capitalization
  { name: 'capitalize', category: 'case', summary: 'Capitalize only the first character; rest become lowercase.', argType: 'none', returnsType: 'str' },
  { name: 'lower', category: 'case', summary: 'Convert all cased characters to lowercase.', argType: 'none', returnsType: 'str' },
  { name: 'upper', category: 'case', summary: 'Convert all cased characters to uppercase.', argType: 'none', returnsType: 'str' },
  { name: 'title', category: 'case', summary: 'Convert words to titlecase (watch out for apostrophes!).', argType: 'none', returnsType: 'str' },
  { name: 'swapcase', category: 'case', summary: 'Swap uppercase to lowercase and vice versa.', argType: 'none', returnsType: 'str' },
  { name: 'casefold', category: 'case', isEnrichment: true, summary: 'Aggressive Unicode caseless matching (e.g. ß -> ss).', argType: 'none', returnsType: 'str' },

  // Search & Inspection
  { name: 'count', category: 'search', summary: 'Count non-overlapping occurrences of substring.', argType: 'sub', defaultArg1: 'a', returnsType: 'int' },
  { name: 'find', category: 'search', summary: 'Find lowest index of substring. Returns -1 if absent.', argType: 'sub', defaultArg1: 'days', returnsType: 'int' },
  { name: 'rfind', category: 'search', summary: 'Find highest index of substring. Returns -1 if absent.', argType: 'sub', defaultArg1: 'o', returnsType: 'int' },
  { name: 'index', category: 'search', summary: 'Find lowest index of substring. Raises ValueError if absent!', argType: 'sub', defaultArg1: 'days', returnsType: 'int' },
  { name: 'rindex', category: 'search', summary: 'Find highest index of substring. Raises ValueError if absent!', argType: 'sub', defaultArg1: 'o', returnsType: 'int' },
  { name: 'startswith', category: 'search', summary: 'Check if string starts with given prefix.', argType: 'sub', defaultArg1: 'thirty', returnsType: 'bool' },
  { name: 'endswith', category: 'search', summary: 'Check if string ends with given suffix.', argType: 'sub', defaultArg1: 'PYTHON', returnsType: 'bool' },

  // Content Predicates
  { name: 'isalnum', category: 'predicates', summary: 'True if all characters are alphanumeric and not empty.', argType: 'none', returnsType: 'bool' },
  { name: 'isalpha', category: 'predicates', summary: 'True if all characters are alphabetic and not empty.', argType: 'none', returnsType: 'bool' },
  { name: 'isdecimal', category: 'predicates', summary: 'True if all characters are strict decimal digits (0-9).', argType: 'none', returnsType: 'bool' },
  { name: 'isdigit', category: 'predicates', summary: 'True if all characters are digits (includes superscripts like ²).', argType: 'none', returnsType: 'bool' },
  { name: 'isnumeric', category: 'predicates', summary: 'True if all characters are numeric (includes fractions like ½).', argType: 'none', returnsType: 'bool' },
  { name: 'isidentifier', category: 'predicates', summary: 'True if string is a valid Python variable/keyword identifier.', argType: 'none', returnsType: 'bool' },
  { name: 'islower', category: 'predicates', summary: 'True if all cased characters are lowercase.', argType: 'none', returnsType: 'bool' },
  { name: 'isupper', category: 'predicates', summary: 'True if all cased characters are uppercase.', argType: 'none', returnsType: 'bool' },

  // Cleanup, Padding & Alignment
  { name: 'strip', category: 'clean', summary: 'Strip leading and trailing characters (defaults to whitespace).', argType: 'strip', defaultArg1: '', returnsType: 'str' },
  { name: 'lstrip', category: 'clean', isEnrichment: true, summary: 'Strip leading characters from the left.', argType: 'strip', defaultArg1: '', returnsType: 'str' },
  { name: 'rstrip', category: 'clean', isEnrichment: true, summary: 'Strip trailing characters from the right.', argType: 'strip', defaultArg1: '', returnsType: 'str' },
  { name: 'replace', category: 'clean', summary: 'Replace all occurrences of old substring with new.', argType: 'replace', defaultArg1: 'PYTHON', defaultArg2: 'TypeScript', returnsType: 'str' },
  { name: 'center', category: 'clean', isEnrichment: true, summary: 'Center string inside padding of specified width.', argType: 'width', defaultArg1: '30', defaultArg2: '*', returnsType: 'str' },
  { name: 'zfill', category: 'clean', isEnrichment: true, summary: 'Pad string on left with ASCII zeros to total width.', argType: 'width', defaultArg1: '25', returnsType: 'str' },
  { name: 'expandtabs', category: 'clean', summary: 'Expand tabs to spaces (default 8 spaces).', argType: 'tabsize', defaultArg1: '4', returnsType: 'str' },

  // Splitting & Joining
  { name: 'split', category: 'split-join', summary: 'Split into list on delimiter (default: runs of whitespace).', argType: 'split', defaultArg1: ' ', returnsType: 'list' },
  { name: 'rsplit', category: 'split-join', isEnrichment: true, summary: 'Split into list starting from the right.', argType: 'split', defaultArg1: ' ', returnsType: 'list' },
  { name: 'splitlines', category: 'split-join', isEnrichment: true, summary: 'Split on newline boundaries.', argType: 'none', returnsType: 'list' },
  { name: 'join', category: 'split-join', summary: 'Concatenate iterable of strings with separator.', argType: 'join', defaultArg1: 'Python,Data,Science', returnsType: 'str' },

  // Formatting
  { name: 'format', category: 'format', summary: 'Insert values into placeholder braces {}.', argType: 'format', defaultArg1: '30, Python', returnsType: 'str' },
];

export const StringMethodsLabSim: React.FC = () => {
  const [inputText, setInputText] = useState<string>('  thirty days of PYTHON  ');
  const [selectedMethodName, setSelectedMethodName] = useState<string>('strip');
  const [arg1, setArg1] = useState<string>('');
  const [arg2, setArg2] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [viewTab, setViewTab] = useState<'transform' | 'immutability' | 'pitfalls'>('transform');

  const activeMethod = ALL_METHODS.find((m) => m.name === selectedMethodName) || ALL_METHODS[0];

  // Live evaluation of Python method simulation
  const evaluateMethod = (): { result: string | boolean | number | string[]; code: string; isError?: boolean; errorMsg?: string } => {
    const text = inputText;
    const m = activeMethod.name;

    try {
      switch (m) {
        case 'capitalize':
          return {
            result: text.length > 0 ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '',
            code: `"${text}".capitalize()`,
          };
        case 'lower':
          return { result: text.toLowerCase(), code: `"${text}".lower()` };
        case 'upper':
          return { result: text.toUpperCase(), code: `"${text}".upper()` };
        case 'title':
          // Replicate Python title() (which notoriously capitalises after apostrophes too!)
          return {
            result: text.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/'\w/g, (c) => c.toUpperCase()),
            code: `"${text}".title()`,
          };
        case 'swapcase':
          return {
            result: text
              .split('')
              .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
              .join(''),
            code: `"${text}".swapcase()`,
          };
        case 'casefold':
          return { result: text.toLowerCase(), code: `"${text}".casefold()` };

        case 'count': {
          const sub = arg1 || 'a';
          let count = 0;
          let pos = 0;
          while ((pos = text.indexOf(sub, pos)) !== -1) {
            count++;
            pos += sub.length;
          }
          return { result: count, code: `"${text}".count("${sub}")` };
        }

        case 'find': {
          const sub = arg1 || 'days';
          const idx = text.indexOf(sub);
          return { result: idx, code: `"${text}".find("${sub}")` };
        }

        case 'rfind': {
          const sub = arg1 || 'o';
          const idx = text.lastIndexOf(sub);
          return { result: idx, code: `"${text}".rfind("${sub}")` };
        }

        case 'index': {
          const sub = arg1 || 'days';
          const idx = text.indexOf(sub);
          if (idx === -1) {
            return {
              result: 'ValueError: substring not found',
              code: `"${text}".index("${sub}")`,
              isError: true,
              errorMsg: 'index() crashes the program when substring is absent! (find() returns -1 instead)',
            };
          }
          return { result: idx, code: `"${text}".index("${sub}")` };
        }

        case 'rindex': {
          const sub = arg1 || 'o';
          const idx = text.lastIndexOf(sub);
          if (idx === -1) {
            return {
              result: 'ValueError: substring not found',
              code: `"${text}".rindex("${sub}")`,
              isError: true,
              errorMsg: 'rindex() raises ValueError when substring is absent!',
            };
          }
          return { result: idx, code: `"${text}".rindex("${sub}")` };
        }

        case 'startswith': {
          const sub = arg1 || 'thirty';
          return { result: text.startsWith(sub), code: `"${text}".startswith("${sub}")` };
        }

        case 'endswith': {
          const sub = arg1 || 'PYTHON';
          return { result: text.endsWith(sub), code: `"${text}".endswith("${sub}")` };
        }

        case 'isalnum':
          return {
            result: text.length > 0 && /^[a-zA-Z0-9]+$/.test(text),
            code: `"${text}".isalnum()`,
          };
        case 'isalpha':
          return {
            result: text.length > 0 && /^[a-zA-Z]+$/.test(text),
            code: `"${text}".isalpha()`,
          };
        case 'isdecimal':
          return {
            result: text.length > 0 && /^[0-9]+$/.test(text),
            code: `"${text}".isdecimal()`,
          };
        case 'isdigit':
          return {
            result: text.length > 0 && /^[0-9²³¹]+$/.test(text),
            code: `"${text}".isdigit()`,
          };
        case 'isnumeric':
          return {
            result: text.length > 0 && /^[0-9²³¹½¼¾]+$/.test(text),
            code: `"${text}".isnumeric()`,
          };
        case 'isidentifier':
          return {
            result: /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(text),
            code: `"${text}".isidentifier()`,
          };
        case 'islower':
          return {
            result: /[a-z]/.test(text) && !/[A-Z]/.test(text),
            code: `"${text}".islower()`,
          };
        case 'isupper':
          return {
            result: /[A-Z]/.test(text) && !/[a-z]/.test(text),
            code: `"${text}".isupper()`,
          };

        case 'strip': {
          if (!arg1) return { result: text.trim(), code: `"${text}".strip()` };
          const chars = arg1.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
          const reg = new RegExp(`^[${chars}]+|[${chars}]+$`, 'g');
          return { result: text.replace(reg, ''), code: `"${text}".strip("${arg1}")` };
        }

        case 'lstrip': {
          if (!arg1) return { result: text.trimStart(), code: `"${text}".lstrip()` };
          const chars = arg1.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
          const reg = new RegExp(`^[${chars}]+`, 'g');
          return { result: text.replace(reg, ''), code: `"${text}".lstrip("${arg1}")` };
        }

        case 'rstrip': {
          if (!arg1) return { result: text.trimEnd(), code: `"${text}".rstrip()` };
          const chars = arg1.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
          const reg = new RegExp(`[${chars}]+$`, 'g');
          return { result: text.replace(reg, ''), code: `"${text}".rstrip("${arg1}")` };
        }

        case 'replace': {
          const oldSub = arg1 || 'PYTHON';
          const newSub = arg2 !== undefined ? arg2 : 'TypeScript';
          return {
            result: text.split(oldSub).join(newSub),
            code: `"${text}".replace("${oldSub}", "${newSub}")`,
          };
        }

        case 'center': {
          const w = parseInt(arg1, 10) || 30;
          const fill = (arg2 || '*').charAt(0) || ' ';
          if (text.length >= w) return { result: text, code: `"${text}".center(${w}, '${fill}')` };
          const padTotal = w - text.length;
          const padLeft = Math.floor(padTotal / 2);
          const padRight = padTotal - padLeft;
          return {
            result: fill.repeat(padLeft) + text + fill.repeat(padRight),
            code: `"${text}".center(${w}, '${fill}')`,
          };
        }

        case 'zfill': {
          const w = parseInt(arg1, 10) || 25;
          return {
            result: text.padStart(w, '0'),
            code: `"${text}".zfill(${w})`,
          };
        }

        case 'expandtabs': {
          const tab = parseInt(arg1, 10) || 4;
          return {
            result: text.replace(/\t/g, ' '.repeat(tab)),
            code: `"${text}".expandtabs(${tab})`,
          };
        }

        case 'split': {
          const sep = arg1 === undefined || arg1 === '' ? null : arg1;
          if (sep === null) {
            return {
              result: text.trim().split(/\s+/).filter(Boolean),
              code: `"${text}".split()`,
            };
          }
          return {
            result: text.split(sep),
            code: `"${text}".split("${sep}")`,
          };
        }

        case 'rsplit': {
          const sep = arg1 || ' ';
          return {
            result: text.split(sep),
            code: `"${text}".rsplit("${sep}")`,
          };
        }

        case 'splitlines':
          return {
            result: text.split(/\r?\n/),
            code: `"""${text}""".splitlines()`,
          };

        case 'join': {
          const glue = text;
          const items = (arg1 || 'Python,Data,Science').split(',');
          return {
            result: items.join(glue),
            code: `"${glue}".join(${JSON.stringify(items)})`,
          };
        }

        case 'format': {
          const args = (arg1 || '30, Python').split(',').map((s) => s.trim());
          let fmt = text;
          args.forEach((val) => {
            fmt = fmt.replace('{}', val);
          });
          return {
            result: fmt,
            code: `"${text}".format(${args.map((a) => `"${a}"`).join(', ')})`,
          };
        }

        default:
          return { result: text, code: `"${text}"` };
      }
    } catch (e: any) {
      return { result: 'Error', code: '', isError: true, errorMsg: e.message };
    }
  };

  const evalResult = evaluateMethod();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(evalResult.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="String Methods Laboratory"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {/* Navigation Tabs for Lab Modes */}
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2">
          <button
            onClick={() => setViewTab('transform')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              viewTab === 'transform'
                ? 'bg-[var(--accent-primary)] text-[var(--accent-on)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Method Transformer
          </button>
          <button
            onClick={() => setViewTab('immutability')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              viewTab === 'immutability'
                ? 'bg-[var(--accent-primary)] text-[var(--accent-on)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Immutability Proof
          </button>
          <button
            onClick={() => setViewTab('pitfalls')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              viewTab === 'pitfalls'
                ? 'bg-[var(--accent-primary)] text-[var(--accent-on)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Classic Pitfalls (title / strip)
          </button>
        </div>

        {viewTab === 'transform' && (
          <>
            {/* Input String & Method Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* String Input */}
              <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="eyebrow-label text-xs">SOURCE STRING (INPUT)</span>
                  <span className="text-[10px] font-mono text-[var(--text-dim)]">
                    Length: {inputText.length}
                  </span>
                </div>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-sm text-[var(--text-main)] focus:ring-1 focus:ring-[var(--accent-primary)]"
                  placeholder="Enter test string..."
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    '  thirty days of PYTHON  ',
                    'Nigeria,Ghana,Kenya,Egypt',
                    'they\'re bill\'s friends',
                    '2026_account_id',
                    '₦250,000.00',
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setInputText(preset)}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-app)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] transition-colors border border-[var(--border-subtle)]"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Method Selector */}
              <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="eyebrow-label text-xs">SELECT STRING METHOD</span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent-primary)]">
                    Returns: {activeMethod.returnsType}
                  </span>
                </div>
                <select
                  value={selectedMethodName}
                  onChange={(e) => {
                    setSelectedMethodName(e.target.value);
                    const found = ALL_METHODS.find((m) => m.name === e.target.value);
                    if (found) {
                      setArg1(found.defaultArg1 || '');
                      setArg2(found.defaultArg2 || '');
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-sm text-[var(--text-main)] focus:ring-1 focus:ring-[var(--accent-primary)]"
                >
                  <optgroup label="Case & Capitalization">
                    {ALL_METHODS.filter((m) => m.category === 'case').map((m) => (
                      <option key={m.name} value={m.name}>
                        .{m.name}() {m.isEnrichment ? '★ Enrichment' : ''}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Search & Inspection">
                    {ALL_METHODS.filter((m) => m.category === 'search').map((m) => (
                      <option key={m.name} value={m.name}>
                        .{m.name}()
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Content Predicates">
                    {ALL_METHODS.filter((m) => m.category === 'predicates').map((m) => (
                      <option key={m.name} value={m.name}>
                        .{m.name}()
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Cleanup & Padding">
                    {ALL_METHODS.filter((m) => m.category === 'clean').map((m) => (
                      <option key={m.name} value={m.name}>
                        .{m.name}() {m.isEnrichment ? '★ Enrichment' : ''}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Splitting & Joining">
                    {ALL_METHODS.filter((m) => m.category === 'split-join').map((m) => (
                      <option key={m.name} value={m.name}>
                        .{m.name}() {m.isEnrichment ? '★ Enrichment' : ''}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Formatting">
                    {ALL_METHODS.filter((m) => m.category === 'format').map((m) => (
                      <option key={m.name} value={m.name}>
                        .{m.name}()
                      </option>
                    ))}
                  </optgroup>
                </select>
                <p className="text-xs text-[var(--text-muted)] italic">
                  {activeMethod.summary}
                </p>
              </div>
            </div>

            {/* Dynamic Arguments Box */}
            {activeMethod.argType !== 'none' && (
              <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
                <span className="eyebrow-label text-xs">METHOD ARGUMENTS</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  {activeMethod.argType === 'replace' ? (
                    <>
                      <div className="space-y-1">
                        <span className="text-[var(--text-dim)]">OLD SUBSTRING:</span>
                        <input
                          type="text"
                          value={arg1}
                          onChange={(e) => setArg1(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-main)]"
                          placeholder="old..."
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[var(--text-dim)]">NEW REPLACEMENT:</span>
                        <input
                          type="text"
                          value={arg2}
                          onChange={(e) => setArg2(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-main)]"
                          placeholder="new..."
                        />
                      </div>
                    </>
                  ) : activeMethod.argType === 'strip' ? (
                    <div className="sm:col-span-2 space-y-1">
                      <span className="text-[var(--text-dim)]">CHARS TO STRIP (Leave blank for whitespace):</span>
                      <input
                        type="text"
                        value={arg1}
                        onChange={(e) => setArg1(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-main)]"
                        placeholder="e.g. ' .,!' or blank"
                      />
                    </div>
                  ) : activeMethod.argType === 'join' ? (
                    <div className="sm:col-span-2 space-y-1">
                      <span className="text-[var(--text-dim)]">ITEMS TO JOIN (Comma-separated iterable):</span>
                      <input
                        type="text"
                        value={arg1}
                        onChange={(e) => setArg1(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-main)]"
                        placeholder="item1, item2, item3"
                      />
                    </div>
                  ) : activeMethod.argType === 'width' ? (
                    <>
                      <div className="space-y-1">
                        <span className="text-[var(--text-dim)]">TOTAL TARGET WIDTH:</span>
                        <input
                          type="number"
                          value={arg1}
                          onChange={(e) => setArg1(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-main)]"
                          placeholder="30"
                        />
                      </div>
                      {activeMethod.name === 'center' && (
                        <div className="space-y-1">
                          <span className="text-[var(--text-dim)]">FILL CHARACTER:</span>
                          <input
                            type="text"
                            maxLength={1}
                            value={arg2}
                            onChange={(e) => setArg2(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-main)]"
                            placeholder="*"
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="sm:col-span-2 space-y-1">
                      <span className="text-[var(--text-dim)]">SUBSTRING ARGUMENT:</span>
                      <input
                        type="text"
                        value={arg1}
                        onChange={(e) => setArg1(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-main)]"
                        placeholder="substring..."
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Generated Code & Transformation Stage */}
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="eyebrow-label text-xs">LIVE PYTHON CODE &amp; RESULT</span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Code snippet */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-[var(--border-subtle)] font-mono text-xs sm:text-sm text-sky-300">
                {evalResult.code}
              </div>

              {/* Before and After Visual Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* BEFORE (Original) */}
                <div className="p-4 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      Original String (Immutable)
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-dim)]">id: str@0x4001</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-surface)] font-mono text-sm text-[var(--text-main)] break-all border border-dashed border-[var(--border-subtle)]">
                    "{inputText}"
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Original string remains completely unchanged in memory.
                  </p>
                </div>

                {/* AFTER (Returned Value) */}
                <div
                  className={`p-4 rounded-2xl border space-y-2 ${
                    evalResult.isError
                      ? 'bg-red-500/10 border-red-500/40'
                      : 'bg-emerald-500/10 border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        evalResult.isError ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {evalResult.isError ? 'Runtime Exception' : 'Returned New Object'}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-dim)]">
                      {evalResult.isError ? 'EXCEPTION' : `Type: ${activeMethod.returnsType}`}
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-xl font-mono text-sm break-all border ${
                      evalResult.isError
                        ? 'bg-red-950/60 border-red-500/40 text-red-300'
                        : 'bg-black/40 border-emerald-500/30 text-emerald-300 font-bold'
                    }`}
                  >
                    {Array.isArray(evalResult.result)
                      ? JSON.stringify(evalResult.result)
                      : typeof evalResult.result === 'boolean'
                      ? evalResult.result
                        ? 'True'
                        : 'False'
                      : typeof evalResult.result === 'string' && !evalResult.isError
                      ? `"${evalResult.result}"`
                      : String(evalResult.result)}
                  </div>

                  {evalResult.errorMsg && (
                    <div className="text-[11px] text-red-300 flex items-start gap-1.5 pt-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{evalResult.errorMsg}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {viewTab === 'immutability' && (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5 shadow-inner">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-[var(--text-main)]">
                The Immutability Guarantee in Python
              </h3>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Strings in Python are strictly <strong>immutable</strong>. Once a string object is created in memory,
              its characters can never be mutated, updated, or deleted in place. Every string method returns a{' '}
              <strong>brand-new string object</strong> at a distinct memory address.
            </p>

            <div className="p-4 rounded-2xl bg-black/60 border border-red-500/30 space-y-2">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
                Illegal Operation: Direct Item Assignment
              </span>
              <pre className="font-mono text-xs text-red-300 whitespace-pre-wrap">
{`message = "Python"
message[0] = "J"  # ❌ CRASH!

# Traceback (most recent call last):
#   File "<stdin>", line 1, in <module>
# TypeError: 'str' object does not support item assignment`}
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                The Correct Pythonic Approach
              </span>
              <pre className="font-mono text-xs text-emerald-300 whitespace-pre-wrap">
{`# Create a new string via slicing and concatenation:
message = "Python"
updated = "J" + message[1:]  # updated is "Jython"

# Or use .replace() which returns a fresh string:
updated = message.replace("P", "J")`}
              </pre>
            </div>
          </div>
        )}

        {viewTab === 'pitfalls' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pitfall 1: title() and apostrophes */}
            <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-[var(--text-main)]">
                  The .title() Apostrophe Trap
                </h4>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Python's built-in <code className="text-amber-400">str.title()</code> considers any non-letter as a word boundary,
                including apostrophes in English contractions!
              </p>
              <div className="p-3 rounded-xl bg-black/60 border border-[var(--border-subtle)] font-mono text-xs space-y-1">
                <div className="text-[var(--text-dim)]"># Unexpected behavior:</div>
                <div className="text-sky-300">"they're here".title()</div>
                <div className="text-red-400 font-bold">=&gt; "They'Re Here"  # Notice capital 'R'!</div>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Fix: For proper titlecasing that respects contractions, use regex or the <code className="text-sky-300">string.capwords</code> standard library function.
              </p>
            </div>

            {/* Pitfall 2: strip() character set vs substring */}
            <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-[var(--text-main)]">
                  .strip() Strips Characters, NOT Substrings!
                </h4>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Beginners frequently assume <code className="text-amber-400">text.strip(".com")</code> removes the sequence ".com".
                In fact, it strips <em>any combination</em> of 'c', 'o', 'm', and '.' from both ends!
              </p>
              <div className="p-3 rounded-xl bg-black/60 border border-[var(--border-subtle)] font-mono text-xs space-y-1">
                <div className="text-[var(--text-dim)]"># Trap in action:</div>
                <div className="text-sky-300">"comic.com".strip(".com")</div>
                <div className="text-red-400 font-bold">=&gt; "i"  # 'c', 'o', 'm' stripped from left too!</div>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Fix: In Python 3.9+, use <code className="text-emerald-400">str.removesuffix(".com")</code> to safely remove an exact ending.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
