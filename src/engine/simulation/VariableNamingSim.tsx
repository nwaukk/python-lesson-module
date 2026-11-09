/**
 * Variable Naming Rules & Invalid Names Checker
 * Section 8.4 & 14 (Day 2): Interactive validator testing identifiers against Python 3 grammar rules
 * and the official 35-keyword list (keyword.kwlist). Evaluates PEP 8 conventions.
 */

import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, ShieldCheck, Sparkles, Info } from 'lucide-react';
import { SimulationController } from './SimulationController';

// Official Python 3.12 keyword.kwlist (35 keywords)
const PYTHON_KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await',
  'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
  'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is',
  'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return',
  'try', 'while', 'with', 'yield'
]);

interface NamingAnalysis {
  isValid: boolean;
  status: 'valid' | 'syntax_error' | 'keyword_conflict' | 'pep8_warning';
  title: string;
  explanation: string;
  pep8Suggestion?: string;
  ruleViolated?: string;
}

export const VariableNamingSim: React.FC = () => {
  const [candidateName, setCandidateName] = useState<string>('student_score');

  const analyzeName = (name: string): NamingAnalysis => {
    const trimmed = name.trim();

    if (!trimmed) {
      return {
        isValid: false,
        status: 'syntax_error',
        title: 'Empty Identifier',
        explanation: 'Variable names cannot be empty.',
      };
    }

    // 1. Keyword check
    if (PYTHON_KEYWORDS.has(trimmed)) {
      return {
        isValid: false,
        status: 'keyword_conflict',
        title: 'Reserved Keyword Conflict',
        explanation: `"${trimmed}" is one of Python's 35 reserved keywords. Using it as a variable causes a SyntaxError: invalid syntax.`,
        pep8Suggestion: `${trimmed}_val or my_${trimmed}`,
        ruleViolated: 'Rule: Identifiers cannot match Python keywords (keyword.kwlist).',
      };
    }

    // 2. Starts with digit
    if (/^[0-9]/.test(trimmed)) {
      return {
        isValid: false,
        status: 'syntax_error',
        title: 'Starts with a Number',
        explanation: `Variable names cannot begin with a number ("${trimmed}"). Python interprets leading digits as numeric literals, causing SyntaxError: invalid decimal literal.`,
        pep8Suggestion: `item_${trimmed} or num_${trimmed}`,
        ruleViolated: 'Rule: The first character must be an ASCII letter (a-z, A-Z) or underscore (_).',
      };
    }

    // 3. Contains spaces or hyphens
    if (trimmed.includes(' ')) {
      return {
        isValid: false,
        status: 'syntax_error',
        title: 'Contains Spaces',
        explanation: `Variable names cannot contain spaces. Python parses spaces as separators between different tokens.`,
        pep8Suggestion: trimmed.replace(/\s+/g, '_').toLowerCase(),
        ruleViolated: 'Rule: Variable names must be a single contiguous token without whitespace.',
      };
    }

    if (trimmed.includes('-')) {
      return {
        isValid: false,
        status: 'syntax_error',
        title: 'Contains Hyphen / Minus Sign',
        explanation: `Variable names cannot contain hyphens ("-"). Python interprets "-" as the subtraction operator!`,
        pep8Suggestion: trimmed.replace(/-/g, '_').toLowerCase(),
        ruleViolated: 'Rule: Hyphens are arithmetic subtraction operators, not identifier characters.',
      };
    }

    // 4. Invalid special characters
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
      return {
        isValid: false,
        status: 'syntax_error',
        title: 'Contains Invalid Symbols',
        explanation: `"${trimmed}" contains symbols not permitted in Python identifiers (e.g., @, $, %, !, ?, .).`,
        pep8Suggestion: trimmed.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase(),
        ruleViolated: 'Rule: Only alphanumeric letters, numbers, and underscores are allowed.',
      };
    }

    // 5. PEP 8 convention checks (Valid syntax, but stylistic suggestions)
    if (trimmed.startsWith('__') && trimmed.endsWith('__')) {
      return {
        isValid: true,
        status: 'pep8_warning',
        title: 'Dunder (Special) Name Warning',
        explanation: `"${trimmed}" is syntactically valid, but double-underscore names like __name__ are reserved for Python internal magic methods.`,
        pep8Suggestion: trimmed.replace(/^__/, '').replace(/__$/, ''),
      };
    }

    if (/[A-Z]/.test(trimmed) && /[a-z]/.test(trimmed) && !trimmed.includes('_')) {
      return {
        isValid: true,
        status: 'pep8_warning',
        title: 'CamelCase Style Warning',
        explanation: `"${trimmed}" is syntactically valid in Python, but PEP 8 recommends snake_case (lowercase with underscores) for variable and function names. CamelCase is reserved for classes.`,
        pep8Suggestion: trimmed.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
      };
    }

    if (trimmed === 'l' || trimmed === 'O' || trimmed === 'I') {
      return {
        isValid: true,
        status: 'pep8_warning',
        title: 'Ambiguous Single Character',
        explanation: `Single characters 'l' (lowercase L), 'O' (uppercase O), and 'I' (uppercase I) are strongly discouraged by PEP 8 because they are easily confused with numerals 1 and 0 in most fonts.`,
      };
    }

    // Completely valid snake_case
    return {
      isValid: true,
      status: 'valid',
      title: 'Valid Python Identifier (PEP 8 Compliant)',
      explanation: `"${trimmed}" is a pristine, syntactically valid Python variable name following PEP 8 snake_case conventions.`,
    };
  };

  const analysis = analyzeName(candidateName);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Python Variable Naming &amp; Keyword Checker"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {/* Candidate Input Bar */}
        <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="eyebrow-label text-[10px] text-[var(--accent-primary)]">
              TEST A VARIABLE NAME
            </span>
            <span className="text-[11px] text-[var(--text-dim)]">Real-time Syntax &amp; PEP 8 Check</span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g. user_age, 1st_rank, class, total-price"
              className="w-full p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] font-mono text-sm text-[var(--text-main)] focus:ring-1 focus:ring-[var(--accent-primary)]"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[11px]">
            <span className="text-[var(--text-dim)] shrink-0">Try test cases:</span>
            {[
              'student_name',
              'first-name',
              '2nd_position',
              'class',
              'user age',
              'price_in_naira',
              'TotalScore',
              '__init__',
              'is_verified',
            ].map((p) => (
              <button
                key={p}
                onClick={() => setCandidateName(p)}
                className="px-2 py-0.5 rounded-md bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] font-mono text-[10px] shrink-0"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Diagnostic Verdict Card */}
        <div
          className={`p-6 rounded-3xl border-2 space-y-4 shadow-sm transition-all ${
            analysis.status === 'valid'
              ? 'border-emerald-500/40 bg-emerald-500/5'
              : analysis.status === 'pep8_warning'
              ? 'border-amber-500/40 bg-amber-500/5'
              : 'border-rose-500/40 bg-rose-500/5'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {analysis.status === 'valid' ? (
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              ) : analysis.status === 'pep8_warning' ? (
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-400" />
              )}
              <div>
                <span className="eyebrow-label text-[10px] block opacity-70">
                  {analysis.isValid ? 'SYNTAX VERDICT: VALID' : 'SYNTAX VERDICT: INVALID'}
                </span>
                <h4 className="text-base font-bold text-[var(--text-main)]">{analysis.title}</h4>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-md text-xs font-bold uppercase font-mono border ${
                analysis.status === 'valid'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : analysis.status === 'pep8_warning'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}
            >
              {analysis.status === 'valid'
                ? 'PASSED'
                : analysis.status === 'pep8_warning'
                ? 'STYLE WARNING'
                : 'SYNTAX ERROR'}
            </span>
          </div>

          <p className="text-xs text-[var(--text-muted)] leading-relaxed">{analysis.explanation}</p>

          {analysis.ruleViolated && (
            <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-xs text-rose-300 font-mono">
              {analysis.ruleViolated}
            </div>
          )}

          {analysis.pep8Suggestion && (
            <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Recommended PEP 8 identifier:</span>
              <code className="text-emerald-400 font-bold font-mono">{analysis.pep8Suggestion}</code>
            </div>
          )}
        </div>

        {/* Python 35 Reserved Keywords Reference Drawer */}
        <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span className="eyebrow-label text-xs">PYTHON 3 KEYWORD REGISTER (35 RESERVED WORDS)</span>
            </div>
            <span className="text-[11px] font-mono text-[var(--text-dim)]">keyword.kwlist</span>
          </div>

          <p className="text-xs text-[var(--text-muted)]">
            These words have special syntactic meaning in Python grammar and can NEVER be used as variable, function, or class names:
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {Array.from(PYTHON_KEYWORDS).map((kw) => {
              const isMatch = candidateName.trim() === kw;
              return (
                <span
                  key={kw}
                  className={`px-2 py-0.5 rounded font-mono text-xs transition-colors border ${
                    isMatch
                      ? 'bg-rose-500 text-white font-bold border-rose-400 shadow-sm'
                      : 'bg-[var(--bg-app)] text-[var(--text-dim)] border-[var(--border-subtle)]'
                  }`}
                >
                  {kw}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
