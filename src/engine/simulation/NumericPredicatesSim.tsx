/**
 * Digit / Decimal / Numeric Inspector Simulation Primitive
 * Section 8.4 & Day 4 Brief:
 * Side-by-side comparison of isdigit(), isdecimal(), isnumeric(), isalpha(), isalnum(), and isidentifier()
 * on standard digits ("123"), superscripts ("²"), fractions ("½"), Roman numerals ("Ⅻ"),
 * negative numbers ("-5"), and floats ("3.14").
 */

import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  Info,
  HelpCircle,
} from 'lucide-react';
import { SimulationController } from './SimulationController';

interface PresetItem {
  label: string;
  value: string;
  category: string;
  note: string;
}

const PRESETS: PresetItem[] = [
  { label: 'Standard Digit "123"', value: '123', category: 'Standard', note: 'Standard ASCII base-10 digits: all 3 predicates evaluate to True.' },
  { label: 'Superscript "²"', value: '²', category: 'Superscript', note: 'Exponents/superscripts are digits and numeric, but NOT strict decimal digits!' },
  { label: 'Subscript "₂"', value: '₂', category: 'Subscript', note: 'Subscripts behave like superscripts: isdigit=True, isdecimal=False.' },
  { label: 'Fraction "½"', value: '½', category: 'Fraction', note: 'Vulgar fractions are numeric (represent a number), but NOT digits or decimals!' },
  { label: 'Roman Numeral Symbol "Ⅻ"', value: 'Ⅻ', category: 'Unicode Numeral', note: 'Unicode Roman numeral glyphs are numeric, but not digits or decimals.' },
  { label: 'ASCII Roman "XII"', value: 'XII', category: 'ASCII Letters', note: 'ASCII letters X, I are alphabetic! isalpha=True, but all numeric tests are False.' },
  { label: 'Negative Integer "-42"', value: '-42', category: 'Edge Case', note: 'The minus sign "-" is not a digit! In Python, "-42".isdigit() evaluates to False.' },
  { label: 'Float String "3.14"', value: '3.14', category: 'Edge Case', note: 'The decimal point "." is punctuation! In Python, "3.14".isdigit() evaluates to False.' },
  { label: 'Identifier "user_2026"', value: 'user_2026', category: 'Identifier', note: 'Valid Python identifier starting with letter/underscore and containing alphanumerics.' },
  { label: 'Invalid Identifier "2026_user"', value: '2026_user', category: 'Identifier', note: 'Cannot start a Python variable identifier with a numeric digit!' },
];

export const NumericPredicatesSim: React.FC = () => {
  const [testString, setTestString] = useState<string>('²');

  // Exact Python character classification rules
  const testPredicates = (val: string) => {
    if (!val || val.length === 0) {
      return {
        isdecimal: false,
        isdigit: false,
        isnumeric: false,
        isalpha: false,
        isalnum: false,
        isidentifier: false,
      };
    }

    // Python isdecimal: True if all characters are strict Unicode decimal digits (Nd category, e.g. 0-9)
    const isdecimal = /^[0-9]+$/.test(val);

    // Python isdigit: True if all chars are digits (Nd, No categories like superscripts/subscripts)
    const isdigit = /^[0-9²³¹⁰⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]+$/.test(val);

    // Python isnumeric: True if all chars are numeric (Nd, Nl, No: includes fractions, Roman glyphs)
    const isnumeric = /^[0-9²³¹⁰⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫ]+$/.test(val);

    const isalpha = /^[a-zA-Z]+$/.test(val);
    const isalnum = isalpha || isnumeric || /^[a-zA-Z0-9]+$/.test(val);
    const isidentifier = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(val);

    return { isdecimal, isdigit, isnumeric, isalpha, isalnum, isidentifier };
  };

  const results = testPredicates(testString);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Digit / Decimal / Numeric Character Inspector"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {/* String Tester Input */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="eyebrow-label text-xs">TEST STRING TO INSPECT</span>
            <span className="text-xs font-mono text-[var(--text-dim)]">Length: {testString.length}</span>
          </div>
          <input
            type="text"
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-base font-bold text-[var(--text-main)]"
            placeholder="Type any character or number..."
          />

          {/* Quick Presets */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] uppercase font-mono text-[var(--text-dim)]">
              PRESET ARCHETYPES (CLICK TO TEST):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setTestString(p.value)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors ${
                    testString === p.value
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* The Tri-Predicate Matrix Table */}
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="eyebrow-label text-xs">PYTHON STRING PREDICATE EVALUATION MATRIX</span>
            <span className="text-xs font-mono text-sky-400">text = "{testString}"</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* isdecimal() */}
            <div
              className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
                results.isdecimal
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-red-500/10 border-red-500/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-sky-300">.isdecimal()</span>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      results.isdecimal
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {results.isdecimal ? 'True' : 'False'}
                  </span>
                </div>
                <div className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  Strict decimal radix-10 characters only (0, 1, 2, ... 9). Subscripts and fractions are rejected.
                </div>
              </div>
              <div className="p-2 rounded-lg bg-black/40 font-mono text-[11px] text-slate-300">
                "{testString}".isdecimal() == {results.isdecimal ? 'True' : 'False'}
              </div>
            </div>

            {/* isdigit() */}
            <div
              className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
                results.isdigit
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-red-500/10 border-red-500/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-purple-300">.isdigit()</span>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      results.isdigit
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {results.isdigit ? 'True' : 'False'}
                  </span>
                </div>
                <div className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  Decimals PLUS compatibility digits like superscripts (²) and circled numbers. Fractions are rejected.
                </div>
              </div>
              <div className="p-2 rounded-lg bg-black/40 font-mono text-[11px] text-slate-300">
                "{testString}".isdigit() == {results.isdigit ? 'True' : 'False'}
              </div>
            </div>

            {/* isnumeric() */}
            <div
              className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
                results.isnumeric
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-red-500/10 border-red-500/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-amber-300">.isnumeric()</span>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      results.isnumeric
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {results.isnumeric ? 'True' : 'False'}
                  </span>
                </div>
                <div className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  Broadest category: includes decimals, digits, vulgar fractions (½), and Unicode Roman glyphs.
                </div>
              </div>
              <div className="p-2 rounded-lg bg-black/40 font-mono text-[11px] text-slate-300">
                "{testString}".isnumeric() == {results.isnumeric ? 'True' : 'False'}
              </div>
            </div>
          </div>

          {/* Secondary Predicates Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--text-dim)]">.isalpha()</span>
              <span className={results.isalpha ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {results.isalpha ? 'True' : 'False'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--text-dim)]">.isalnum()</span>
              <span className={results.isalnum ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {results.isalnum ? 'True' : 'False'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--text-dim)]">.isidentifier()</span>
              <span className={results.isidentifier ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {results.isidentifier ? 'True' : 'False'}
              </span>
            </div>
          </div>
        </div>

        {/* Diagnostic Explanation Banner */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-[var(--text-main)]">Predicate Hierarchy Rule</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            In Python: <code className="text-sky-300">isdecimal()</code> ⊂ <code className="text-purple-300">isdigit()</code> ⊂ <code className="text-amber-300">isnumeric()</code>.
            Every decimal is a digit and a numeric. But a fraction like <code className="text-amber-300">'½'</code> is numeric without being a digit or a decimal!
            Notice also that negative numbers like <code className="text-red-400">"-5"</code> and floats like <code className="text-red-400">"3.14"</code> return <code className="text-red-400">False</code> across all three methods because the symbols <code className="text-red-400">'-'</code> and <code className="text-red-400">'.'</code> are punctuation characters.
          </p>
        </div>
      </div>
    </div>
  );
};
