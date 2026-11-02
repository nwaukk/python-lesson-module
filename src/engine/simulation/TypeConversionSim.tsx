/**
 * Type Conversion & Casting Simulation Primitive
 * Section 8.4 & 14 (Day 2): Dissects type conversion across int, float, str, bool, and list.
 * Explains successful transformations, truncation rules, and explicit ValueError exception mechanics.
 */

import React, { useState } from 'react';
import { ArrowRight, AlertTriangle, CheckCircle, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface ConversionPreset {
  id: string;
  label: string;
  inputVal: string;
  fromType: string;
  targetFunc: 'int' | 'float' | 'str' | 'bool' | 'list';
  success: boolean;
  outputVal: string;
  outputType: string;
  explanation: string;
  cpythonRule: string;
}

const PRESETS: ConversionPreset[] = [
  {
    id: 'p1',
    label: 'Float to Int Truncation',
    inputVal: '3.9',
    fromType: 'float',
    targetFunc: 'int',
    success: true,
    outputVal: '3',
    outputType: 'int',
    explanation: 'int(3.9) truncates towards zero. It does NOT round to 4; the decimal portion is discarded.',
    cpythonRule: 'Calls float.__int__() which performs direct C-level truncation.',
  },
  {
    id: 'p2',
    label: 'String Float to Int Trap',
    inputVal: '"3.5"',
    fromType: 'str',
    targetFunc: 'int',
    success: false,
    outputVal: 'ValueError: invalid literal for int() with base 10: \'3.5\'',
    outputType: 'ValueError',
    explanation: 'int("3.5") fails because int() string parser expects whole digits. Fix: int(float("3.5")).',
    cpythonRule: 'PyLong_FromString rejects "." characters under base 10 parsing.',
  },
  {
    id: 'p3',
    label: 'String Text to Float Trap',
    inputVal: '"abc"',
    fromType: 'str',
    targetFunc: 'float',
    success: false,
    outputVal: 'ValueError: could not convert string to float: \'abc\'',
    outputType: 'ValueError',
    explanation: 'Alphabetic characters cannot be parsed as numeric IEEE 754 representations.',
    cpythonRule: 'PyOS_string_to_double fails on non-numeric ASCII characters.',
  },
  {
    id: 'p4',
    label: 'String to Character List',
    inputVal: '"Lagos"',
    fromType: 'str',
    targetFunc: 'list',
    success: true,
    outputVal: "['L', 'a', 'g', 'o', 's']",
    outputType: 'list',
    explanation: 'Passing a string to list() iterates over the Unicode sequence, creating a list of 1-character strings.',
    cpythonRule: 'Invokes the string iterator __iter__ and unpacks each element into a new dynamic array.',
  },
  {
    id: 'p5',
    label: 'String "False" Truthiness Trap',
    inputVal: '"False"',
    fromType: 'str',
    targetFunc: 'bool',
    success: true,
    outputVal: 'True',
    outputType: 'bool',
    explanation: 'bool("False") evaluates to True! In Python, any non-empty string is truthy regardless of what word it contains. Only bool("") is False.',
    cpythonRule: 'bool(x) delegates to len(x) > 0 for strings.',
  },
  {
    id: 'p6',
    label: 'Boolean to Integer',
    inputVal: 'True',
    fromType: 'bool',
    targetFunc: 'int',
    success: true,
    outputVal: '1',
    outputType: 'int',
    explanation: 'int(True) is 1, and int(False) is 0. In Python, bool is an explicit subclass of int.',
    cpythonRule: 'PyBool_Type inherits directly from PyLong_Type; True evaluates to integer 1 in arithmetic.',
  },
];

export const TypeConversionSim: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('p1');
  const [customInput, setCustomInput] = useState<string>('3.9');
  const [targetFunction, setTargetFunction] = useState<'int' | 'float' | 'str' | 'bool' | 'list'>('int');

  const activePreset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];

  const handleSelectPreset = (p: ConversionPreset) => {
    setSelectedPresetId(p.id);
    setCustomInput(p.inputVal);
    setTargetFunction(p.targetFunc);
  };

  // Compute live conversion
  const computeLiveConversion = () => {
    const raw = customInput.trim();
    try {
      if (targetFunction === 'str') {
        return {
          success: true,
          result: `"${raw.replace(/^["']|["']$/g, '')}"`,
          resultType: 'str',
          explanation: `Converted input to string format representation.`,
        };
      }
      if (targetFunction === 'bool') {
        const unquoted = raw.replace(/^["']|["']$/g, '');
        const isTruthy = raw === '0' || raw === 'False' || raw === '""' || raw === "''" || raw === 'None' || raw === '[]' || raw === '{}' ? false : unquoted.length > 0;
        return {
          success: true,
          result: isTruthy ? 'True' : 'False',
          resultType: 'bool',
          explanation: `bool() evaluates truthiness: empty containers, 0, and None are False; everything else is True.`,
        };
      }
      if (targetFunction === 'list') {
        const cleanStr = raw.replace(/^["']|["']$/g, '');
        const chars = Array.from(cleanStr);
        return {
          success: true,
          result: `[${chars.map((c) => `'${c}'`).join(', ')}]`,
          resultType: 'list',
          explanation: `Deconstructed string sequence into ${chars.length} individual character elements.`,
        };
      }
      if (targetFunction === 'float') {
        const cleanStr = raw.replace(/^["']|["']$/g, '');
        if (cleanStr === 'True') return { success: true, result: '1.0', resultType: 'float', explanation: 'True converts to float 1.0.' };
        if (cleanStr === 'False') return { success: true, result: '0.0', resultType: 'float', explanation: 'False converts to float 0.0.' };
        const num = Number(cleanStr);
        if (isNaN(num)) {
          return {
            success: false,
            result: `ValueError: could not convert string to float: '${cleanStr}'`,
            resultType: 'ValueError',
            explanation: `String contains non-numeric characters that cannot be converted to a float.`,
          };
        }
        return {
          success: true,
          result: num.toFixed(1).includes('.') ? String(num) : `${num}.0`,
          resultType: 'float',
          explanation: `Converted numeric literal to 64-bit IEEE 754 floating-point.`,
        };
      }
      if (targetFunction === 'int') {
        const cleanStr = raw.replace(/^["']|["']$/g, '');
        if (cleanStr === 'True') return { success: true, result: '1', resultType: 'int', explanation: 'True converts to integer 1.' };
        if (cleanStr === 'False') return { success: true, result: '0', resultType: 'int', explanation: 'False converts to integer 0.' };
        if (cleanStr.includes('.')) {
          // If raw input had quotes, it was a string with dot: ValueError!
          if (raw.startsWith('"') || raw.startsWith("'")) {
            return {
              success: false,
              result: `ValueError: invalid literal for int() with base 10: '${cleanStr}'`,
              resultType: 'ValueError',
              explanation: `Direct string int("${cleanStr}") fails on decimal dots. Must use int(float("${cleanStr}")).`,
            };
          }
          // Raw numeric literal float truncates
          const truncated = Math.trunc(Number(cleanStr));
          return {
            success: true,
            result: String(truncated),
            resultType: 'int',
            explanation: `Float ${cleanStr} truncated towards zero to integer ${truncated}.`,
          };
        }
        const num = Number(cleanStr);
        if (isNaN(num)) {
          return {
            success: false,
            result: `ValueError: invalid literal for int() with base 10: '${cleanStr}'`,
            resultType: 'ValueError',
            explanation: `String contains non-integer characters.`,
          };
        }
        return {
          success: true,
          result: String(Math.trunc(num)),
          resultType: 'int',
          explanation: `Converted to whole integer object.`,
        };
      }
      return { success: true, result: raw, resultType: 'unknown', explanation: '' };
    } catch (e) {
      return {
        success: false,
        result: `ConversionError: ${e}`,
        resultType: 'Error',
        explanation: 'Failed to convert.',
      };
    }
  };

  const liveResult = computeLiveConversion();

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Python Type Conversion Simulator"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {/* Presets Strip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="eyebrow-label text-[10px] text-[var(--accent-primary)]">
              CRITICAL TYPE CASTING PRESETS &amp; TRAPS
            </span>
            <span className="text-[11px] text-[var(--text-dim)]">Section 14 Watch-outs</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                  selectedPresetId === p.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--text-main)] shadow-xs'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-[11px]">{p.label}</span>
                  {p.success ? (
                    <span className="text-emerald-400 font-bold text-[10px]">✓ OK</span>
                  ) : (
                    <span className="text-rose-400 font-bold text-[10px]">⚠ TRAP</span>
                  )}
                </div>
                <div className="font-mono text-[10px] text-[var(--text-dim)] truncate">
                  {p.targetFunc}({p.inputVal})
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Transformation Visualizer Card */}
        <div className="p-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="eyebrow-label text-xs">TYPE CASTING PIPELINE</span>
            <span className="font-mono text-xs text-[var(--accent-primary)] font-bold">
              {targetFunction}({customInput})
            </span>
          </div>

          {/* Pipeline Graphic: Input -> Converter Function -> Output */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Input Box */}
            <div className="p-4 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-2">
              <span className="eyebrow-label text-[10px] text-[var(--text-dim)]">SOURCE VALUE</span>
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] font-mono text-xs text-[var(--text-main)] focus:ring-1 focus:ring-[var(--accent-primary)]"
                placeholder="Enter value..."
              />
              <span className="text-[10px] text-[var(--text-dim)] block">
                Type quotes for strings: e.g. <code className="text-sky-300">"3.5"</code>
              </span>
            </div>

            {/* Target Converter Function Selector */}
            <div className="p-4 rounded-2xl bg-[var(--accent-subtle)]/40 border border-[var(--accent-primary)]/30 space-y-2 text-center">
              <span className="eyebrow-label text-[10px] text-[var(--accent-primary)]">
                TARGET CAST FUNCTION
              </span>
              <div className="grid grid-cols-5 gap-1 pt-1">
                {(['int', 'float', 'str', 'bool', 'list'] as const).map((fn) => (
                  <button
                    key={fn}
                    onClick={() => setTargetFunction(fn)}
                    className={`py-1.5 px-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      targetFunction === fn
                        ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] shadow-xs'
                        : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {fn}()
                  </button>
                ))}
              </div>
            </div>

            {/* Output Result Box */}
            <div
              className={`p-4 rounded-2xl border-2 space-y-2 transition-all ${
                liveResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="eyebrow-label text-[10px]">
                  {liveResult.success ? 'RESULT OBJECT' : 'EXCEPTION RAISED'}
                </span>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--bg-app)]">
                  {liveResult.resultType}
                </span>
              </div>
              <div className="font-mono text-xs font-bold break-all p-2 rounded-lg bg-[var(--bg-app)]">
                {liveResult.result}
              </div>
            </div>
          </div>

          {/* Explanation Box */}
          <div className="p-4 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-1.5 text-xs">
            <div className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Conversion Insight &amp; Language Rule</span>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              {liveResult.explanation}
            </p>
            {activePreset.id === selectedPresetId && (
              <p className="text-[11px] font-mono text-[var(--text-dim)] pt-1 border-t border-[var(--border-subtle)]">
                CPython rule: {activePreset.cpythonRule}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
