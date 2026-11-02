/**
 * Indentation Lab Signature Simulation
 * Master Specification Section 8.4 & Day 1 Brief:
 * Interactive Indentation Lab: shift lines, watch visual 4-space guide columns,
 * observe block boundaries update, and see live IndentationError diagnostics.
 */

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Layers,
  RotateCcw,
  Sliders,
  Info,
} from 'lucide-react';
import { SimulationController } from './SimulationController';

interface CodeLine {
  id: string;
  indent: number; // number of leading spaces
  text: string;
  isBlockHeader?: boolean;
}

const PRESETS: Record<string, { label: string; lines: CodeLine[] }> = {
  valid: {
    label: 'Standard 4-Space Block (Valid)',
    lines: [
      { id: 'l1', indent: 0, text: 'def calculate_discount(price, is_student):', isBlockHeader: true },
      { id: 'l2', indent: 4, text: 'if is_student:', isBlockHeader: true },
      { id: 'l3', indent: 8, text: 'discount = price * 0.15' },
      { id: 'l4', indent: 8, text: 'return price - discount' },
      { id: 'l5', indent: 4, text: 'return price' },
    ],
  },
  missingIndent: {
    label: 'Bug: Missing Indented Block',
    lines: [
      { id: 'l1', indent: 0, text: 'if balance >= withdrawal_amount:', isBlockHeader: true },
      { id: 'l2', indent: 0, text: 'dispense_naira(withdrawal_amount)' },
      { id: 'l3', indent: 0, text: 'print("Transaction Approved")' },
    ],
  },
  unexpectedIndent: {
    label: 'Bug: Unexpected Indent',
    lines: [
      { id: 'l1', indent: 0, text: 'student_name = "Chinedu"' },
      { id: 'l2', indent: 4, text: 'print(f"Enrolled: {student_name}")' },
    ],
  },
  misaligned: {
    label: 'Bug: Misaligned (3 spaces vs 4 spaces)',
    lines: [
      { id: 'l1', indent: 0, text: 'if score >= 50:', isBlockHeader: true },
      { id: 'l2', indent: 4, text: 'print("Grade: Credit")' },
      { id: 'l3', indent: 3, text: 'status = "Passed"' },
    ],
  },
};

export const IndentationLabSim: React.FC = () => {
  const [activePreset, setActivePreset] = useState<string>('valid');
  const [lines, setLines] = useState<CodeLine[]>(PRESETS.valid.lines);
  const [showGuides, setShowGuides] = useState<boolean>(true);

  const loadPreset = (key: string) => {
    setActivePreset(key);
    setLines(JSON.parse(JSON.stringify(PRESETS[key].lines)));
  };

  const adjustIndent = (index: number, delta: number) => {
    setLines((prev) => {
      const copy = [...prev];
      const newIndent = Math.max(0, Math.min(16, copy[index].indent + delta));
      copy[index] = { ...copy[index], indent: newIndent };
      return copy;
    });
  };

  // Diagnostic checker
  const analyzeIndentation = (): { isValid: boolean; error?: string; errorLine?: number } => {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const prevLine = i > 0 ? lines[i - 1] : null;

      // Rule 1: First line cannot be indented
      if (i === 0 && line.indent > 0) {
        return {
          isValid: false,
          errorLine: 1,
          error: 'IndentationError: unexpected indent on line 1',
        };
      }

      // Rule 2: Line after a colon must have greater indentation
      if (prevLine && prevLine.text.trim().endsWith(':')) {
        if (line.indent <= prevLine.indent) {
          return {
            isValid: false,
            errorLine: i + 1,
            error: `IndentationError: expected an indented block after '${prevLine.text.trim().split(' ')[0]}' statement on line ${i}`,
          };
        }
      }

      // Rule 3: Line without previous block header cannot randomly indent deeper
      if (prevLine && !prevLine.text.trim().endsWith(':')) {
        if (line.indent > prevLine.indent) {
          return {
            isValid: false,
            errorLine: i + 1,
            error: `IndentationError: unexpected indent on line ${i + 1}`,
          };
        }
      }

      // Rule 4: Standard 4 spaces consistency warning/error
      if (line.indent % 4 !== 0) {
        return {
          isValid: false,
          errorLine: i + 1,
          error: `IndentationError: unindent does not match any outer indentation level (found ${line.indent} spaces, expected multiple of 4)`,
        };
      }
    }

    return { isValid: true };
  };

  const analysis = analyzeIndentation();

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Python Indentation & Block Scope Lab"
        badge="simulation"
        onReset={() => loadPreset('valid')}
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Preset Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--bg-surface)] p-3 rounded-2xl border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-xs font-bold text-[var(--text-main)]">Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(PRESETS).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => loadPreset(key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    activePreset === key
                      ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] font-bold'
                      : 'bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)]'
                  }`}
                >
                  {data.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-[var(--text-muted)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showGuides}
              onChange={(e) => setShowGuides(e.target.checked)}
              className="accent-[var(--accent-primary)] rounded"
            />
            <span>Show 4-Space Guides</span>
          </label>
        </div>

        {/* Live Diagnostics Card */}
        <div
          className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
            analysis.isValid
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          {analysis.isValid ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs space-y-1">
            <div className="font-bold">
              {analysis.isValid
                ? 'Valid Python Indentation: Block Structure Verified'
                : 'Python Syntax / Indentation Failure Detected'}
            </div>
            <div className="font-mono text-xs opacity-90">
              {analysis.isValid
                ? 'All statements align cleanly with Python PEP 8 (4 spaces per block level). No IndentationError.'
                : analysis.error}
            </div>
          </div>
        </div>

        {/* Interactive Indentation Editor Grid */}
        <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden shadow-xs">
          <div className="px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-between text-xs text-[var(--text-dim)] font-mono">
            <span>LINE # & INDENT CONTROLS</span>
            <span>PYTHON SOURCE CODE (4-SPACE COLUMNS)</span>
          </div>

          <div className="divide-y divide-[var(--border-subtle)] font-mono text-xs">
            {lines.map((line, idx) => {
              const isErrorLine = analysis.errorLine === idx + 1;
              const indentLevel = Math.floor(line.indent / 4);

              return (
                <div
                  key={line.id}
                  className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 transition-colors ${
                    isErrorLine
                      ? 'bg-red-500/15 border-l-4 border-l-red-500'
                      : 'hover:bg-[var(--bg-surface-elevated)]'
                  }`}
                >
                  {/* Left: Line Number and Shift Controls */}
                  <div className="flex items-center gap-2 w-44 shrink-0 justify-between sm:justify-start">
                    <span className="text-[var(--text-dim)] font-mono text-[11px] w-6 text-right select-none">
                      {idx + 1}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => adjustIndent(idx, -4)}
                        disabled={line.indent === 0}
                        className="px-1.5 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] text-[var(--text-main)] disabled:opacity-30 text-[10px] flex items-center"
                        title="Dedent 4 spaces"
                      >
                        <ChevronLeft className="w-3 h-3" /> -4
                      </button>
                      <button
                        onClick={() => adjustIndent(idx, -1)}
                        disabled={line.indent === 0}
                        className="px-1.5 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] text-[var(--text-muted)] disabled:opacity-30 text-[10px]"
                        title="Dedent 1 space"
                      >
                        -1
                      </button>
                      <span className="text-[11px] font-mono text-[var(--accent-primary)] px-1 w-6 text-center font-bold">
                        {line.indent}s
                      </span>
                      <button
                        onClick={() => adjustIndent(idx, 1)}
                        className="px-1.5 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] text-[var(--text-muted)] text-[10px]"
                        title="Indent 1 space"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => adjustIndent(idx, 4)}
                        className="px-1.5 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] text-[var(--text-main)] text-[10px] flex items-center"
                        title="Indent 4 spaces"
                      >
                        +4 <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Right: Code with Visual Space Guides */}
                  <div className="flex-1 overflow-x-auto bg-[var(--bg-code)] p-2 rounded-lg border border-[var(--border-subtle)] flex items-center relative min-h-[36px]">
                    {/* Visual 4-space vertical guide columns */}
                    {showGuides && (
                      <div className="absolute inset-0 pointer-events-none flex opacity-20">
                        <div className="w-8 border-r border-cyan-400 h-full" />
                        <div className="w-8 border-r border-cyan-400 h-full" />
                        <div className="w-8 border-r border-cyan-400 h-full" />
                        <div className="w-8 border-r border-cyan-400 h-full" />
                      </div>
                    )}

                    {/* Indentation Spaces Render */}
                    <div className="flex items-center text-[var(--text-dim)] select-none shrink-0 font-mono">
                      {Array.from({ length: line.indent }).map((_, i) => (
                        <span
                          key={i}
                          className={`w-2 text-center text-[9px] ${
                            (i + 1) % 4 === 0 ? 'text-cyan-400 font-bold' : 'text-slate-600'
                          }`}
                        >
                          ·
                        </span>
                      ))}
                    </div>

                    {/* Code Text */}
                    <span
                      className={`text-xs ${
                        line.isBlockHeader
                          ? 'text-sky-300 font-semibold'
                          : isErrorLine
                          ? 'text-red-300 font-bold'
                          : 'text-emerald-300'
                      }`}
                    >
                      {line.text}
                    </span>

                    {/* Block Scope Badge */}
                    <span className="ml-auto text-[10px] font-sans px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-dim)] shrink-0 border border-[var(--border-subtle)]">
                      Level {indentLevel} ({line.indent} spaces)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pedagogical Guidelines */}
        <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-4 text-xs space-y-2">
          <div className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[var(--accent-primary)]" />
            Rules of Python Indentation (PEP 8):
          </div>
          <ul className="list-disc list-inside space-y-1 text-[var(--text-muted)]">
            <li>
              Python does not use curly brackets <code className="text-amber-400 font-mono">&#123;&#125;</code> to define code blocks. Indentation <strong>is</strong> the block delimiter!
            </li>
            <li>
              The official standard is <strong>4 spaces per level</strong>. Never mix tabs and spaces.
            </li>
            <li>
              Every statement ending with a colon <code className="text-sky-300 font-mono">:</code> (such as <code className="font-mono">if</code>, <code className="font-mono">for</code>, <code className="font-mono">def</code>) introduces a new indented block.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
