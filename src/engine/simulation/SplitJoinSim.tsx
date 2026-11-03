/**
 * Split and Join Visualiser Primitive
 * Section 8.4 & Day 4 Brief:
 * Interactive visual breakdown of a string into token pieces (list of strings),
 * custom delimiter vs default whitespace runs, joiner with glue separator,
 * and type-safety check for join() (TypeError when list contains non-strings).
 */

import React, { useState } from 'react';
import {
  Scissors,
  Link,
  AlertTriangle,
  ArrowRight,
  Plus,
  Trash2,
  Sparkles,
  Info,
} from 'lucide-react';
import { SimulationController } from './SimulationController';

export const SplitJoinSim: React.FC = () => {
  const [mode, setMode] = useState<'split' | 'join'>('split');

  // Split state
  const [splitText, setSplitText] = useState<string>('Python   Visual   Lab   2026');
  const [splitDelimiterType, setSplitDelimiterType] = useState<'whitespace' | 'space' | 'comma' | 'custom'>('whitespace');
  const [customDelimiter, setCustomDelimiter] = useState<string>('-');
  const [maxsplit, setMaxsplit] = useState<number>(-1);

  // Join state
  const [glueSeparator, setGlueSeparator] = useState<string>(' | ');
  const [joinItems, setJoinItems] = useState<Array<{ id: number; text: string; isInt?: boolean }>>([
    { id: 1, text: 'Lagos' },
    { id: 2, text: 'Abuja' },
    { id: 3, text: 'Kano' },
    { id: 4, text: 'Port Harcourt' },
  ]);
  const [includeBadType, setIncludeBadType] = useState<boolean>(false);

  // Compute split pieces
  const computeSplit = (): { pieces: string[]; code: string; explanation: string } => {
    let pieces: string[] = [];
    let code = '';
    let explanation = '';

    if (splitDelimiterType === 'whitespace') {
      code = maxsplit >= 0 ? `"${splitText}".split(maxsplit=${maxsplit})` : `"${splitText}".split()`;
      // Python's .split() splits on runs of any whitespace and removes leading/trailing empty strings
      const trimmed = splitText.trim();
      if (!trimmed) {
        pieces = [];
      } else {
        const raw = trimmed.split(/\s+/);
        if (maxsplit >= 0 && maxsplit < raw.length) {
          const head = raw.slice(0, maxsplit);
          // Python joins the rest by whitespace
          const tail = raw.slice(maxsplit).join(' ');
          pieces = [...head, tail];
        } else {
          pieces = raw;
        }
      }
      explanation = 'split() with no delimiter collapses arbitrary runs of whitespace (spaces, tabs, newlines) and discards empty pieces.';
    } else if (splitDelimiterType === 'space') {
      const sep = ' ';
      code = maxsplit >= 0 ? `"${splitText}".split(' ', ${maxsplit})` : `"${splitText}".split(' ')`;
      pieces = splitText.split(' ');
      if (maxsplit >= 0 && maxsplit < pieces.length) {
        const head = pieces.slice(0, maxsplit);
        const tail = pieces.slice(maxsplit).join(' ');
        pieces = [...head, tail];
      }
      explanation = "split(' ') splits strictly on single spaces! Multiple consecutive spaces produce empty string elements ('').";
    } else {
      const sep = splitDelimiterType === 'comma' ? ',' : customDelimiter;
      code = maxsplit >= 0 ? `"${splitText}".split("${sep}", ${maxsplit})` : `"${splitText}".split("${sep}")`;
      pieces = splitText.split(sep);
      if (maxsplit >= 0 && maxsplit < pieces.length) {
        const head = pieces.slice(0, maxsplit);
        const tail = pieces.slice(maxsplit).join(sep);
        pieces = [...head, tail];
      }
      explanation = `split("${sep}") splits on exact occurrences of the delimiter string.`;
    }

    return { pieces, code, explanation };
  };

  const splitResult = computeSplit();

  // Compute join
  const computeJoin = (): { result: string; code: string; isError: boolean; errorMsg?: string } => {
    const listToJoin = includeBadType
      ? [...joinItems.map((i) => i.text), 2026]
      : joinItems.map((i) => i.text);

    if (includeBadType) {
      return {
        result: 'TypeError: sequence item 4: expected str instance, int found',
        code: `"${glueSeparator}".join(${JSON.stringify(listToJoin)})`,
        isError: true,
        errorMsg: 'join() strictly requires an iterable of STRINGS! Numbers or mixed objects crash with TypeError.',
      };
    }

    return {
      result: listToJoin.join(glueSeparator),
      code: `"${glueSeparator}".join(${JSON.stringify(listToJoin)})`,
      isError: false,
    };
  };

  const joinResult = computeJoin();

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Split & Join Visualiser"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {/* Switcher: Split vs Join */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode('split')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                mode === 'split'
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] shadow-sm'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Scissors className="w-4 h-4" />
              <span>1. String to List (.split())</span>
            </button>
            <button
              onClick={() => setMode('join')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                mode === 'join'
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] shadow-sm'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Link className="w-4 h-4" />
              <span>2. List to String (.join())</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-[var(--text-dim)] hidden sm:inline">
            Dual Inverse Operations
          </span>
        </div>

        {/* 1. SPLIT MODE */}
        {mode === 'split' && (
          <div className="space-y-6">
            {/* Input Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
                <span className="eyebrow-label text-xs">SOURCE STRING TO SPLIT</span>
                <input
                  type="text"
                  value={splitText}
                  onChange={(e) => setSplitText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-sm text-[var(--text-main)]"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'Python   Visual   Lab   2026',
                    'apple,banana,cherry,orange',
                    '2026-11-04-production-release',
                    'user:alice:admin:/home/alice',
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setSplitText(preset);
                        if (preset.includes(',')) setSplitDelimiterType('comma');
                        else if (preset.includes('-')) {
                          setSplitDelimiterType('custom');
                          setCustomDelimiter('-');
                        } else if (preset.includes(':')) {
                          setSplitDelimiterType('custom');
                          setCustomDelimiter(':');
                        } else {
                          setSplitDelimiterType('whitespace');
                        }
                      }}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-app)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delimiter Selection */}
              <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
                <span className="eyebrow-label text-xs">DELIMITER MODE</span>
                <select
                  value={splitDelimiterType}
                  onChange={(e) => setSplitDelimiterType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-main)]"
                >
                  <option value="whitespace">Default: None (Runs of Whitespace)</option>
                  <option value="space">Strict Single Space (' ')</option>
                  <option value="comma">Comma (',')</option>
                  <option value="custom">Custom Delimiter</option>
                </select>

                {splitDelimiterType === 'custom' && (
                  <input
                    type="text"
                    value={customDelimiter}
                    onChange={(e) => setCustomDelimiter(e.target.value)}
                    placeholder="Delimiter string..."
                    className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-main)]"
                  />
                )}

                <div className="pt-1">
                  <div className="flex justify-between text-[11px] font-mono text-[var(--text-dim)]">
                    <span>MAXSPLIT:</span>
                    <span>{maxsplit === -1 ? 'None (all)' : maxsplit}</span>
                  </div>
                  <input
                    type="range"
                    min={-1}
                    max={5}
                    value={maxsplit}
                    onChange={(e) => setMaxsplit(parseInt(e.target.value, 10))}
                    className="w-full accent-[var(--accent-primary)] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Generated Python Code & Delimiter Explanation */}
            <div className="p-4 rounded-2xl bg-black/60 border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-sky-400 font-mono">EXECUTED CODE:</span>
                <span className="text-[10px] font-mono text-[var(--text-dim)]">
                  Result: list with {splitResult.pieces.length} elements
                </span>
              </div>
              <div className="font-mono text-sm text-sky-300 font-bold">{splitResult.code}</div>
              <p className="text-xs text-[var(--text-muted)] flex items-start gap-1.5 pt-1">
                <Info className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>{splitResult.explanation}</span>
              </p>
            </div>

            {/* Visual Token Pieces Stage */}
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-inner">
              <span className="eyebrow-label text-xs">RESULTING LIST OF STRINGS</span>

              <div className="flex flex-wrap items-center gap-2.5 p-4 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] min-h-[90px]">
                <span className="font-mono text-2xl font-black text-slate-500">[</span>
                {splitResult.pieces.map((piece, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center p-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] shadow-xs animate-in zoom-in-95"
                  >
                    <span className="font-mono text-[10px] text-sky-400 font-bold">Index {idx}</span>
                    <span className="font-mono text-sm font-bold text-emerald-300">
                      "{piece}"
                    </span>
                    <span className="text-[9px] font-mono text-[var(--text-dim)]">{piece.length} chars</span>
                  </div>
                ))}
                <span className="font-mono text-2xl font-black text-slate-500">]</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. JOIN MODE */}
        {mode === 'join' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Glue Separator */}
              <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
                <span className="eyebrow-label text-xs">GLUE SEPARATOR STRING</span>
                <input
                  type="text"
                  value={glueSeparator}
                  onChange={(e) => setGlueSeparator(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-sm text-[var(--text-main)]"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[' | ', ', ', '-', ' / ', ''].map((sep) => (
                    <button
                      key={sep}
                      onClick={() => setGlueSeparator(sep)}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-app)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                    >
                      {sep === '' ? "'' (Empty)" : `"${sep}"`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items List Manager */}
              <div className="md:col-span-2 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="eyebrow-label text-xs">ITEMS TO GLUE TOGETHER</span>
                  <button
                    onClick={() => setIncludeBadType(!includeBadType)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                      includeBadType
                        ? 'border-red-500 bg-red-500/15 text-red-300'
                        : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {includeBadType ? 'Testing Bad Type: int in list' : 'Inject Non-String (TypeError Trap)'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {joinItems.map((item, i) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-main)]"
                    >
                      <span>"{item.text}"</span>
                      {joinItems.length > 2 && (
                        <button
                          onClick={() => setJoinItems(joinItems.filter((_, idx) => idx !== i))}
                          className="text-[var(--text-dim)] hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                  {includeBadType && (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500 text-red-300 font-mono text-xs font-bold animate-pulse">
                      <span>2026 (int)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Generated Join Python Code */}
            <div className="p-4 rounded-2xl bg-black/60 border border-[var(--border-subtle)] space-y-2">
              <span className="text-[10px] font-bold text-sky-400 font-mono">EXECUTED PYTHON CODE:</span>
              <div className="font-mono text-sm text-sky-300 font-bold">{joinResult.code}</div>
            </div>

            {/* Visual Glue Result Stage */}
            <div
              className={`p-6 rounded-3xl border space-y-3 shadow-inner ${
                joinResult.isError
                  ? 'bg-red-500/10 border-red-500/40'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`eyebrow-label text-xs ${
                    joinResult.isError ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {joinResult.isError ? 'PYTHON RUNTIME EXCEPTION' : 'GLUED SINGLE STRING OUTPUT'}
                </span>
                <span className="text-xs font-mono text-[var(--text-dim)]">
                  {joinResult.isError ? 'CRASH' : `Length: ${joinResult.result.length}`}
                </span>
              </div>

              <div
                className={`p-4 rounded-2xl font-mono text-base break-all border ${
                  joinResult.isError
                    ? 'bg-red-950/60 border-red-500/50 text-red-300 font-semibold'
                    : 'bg-black/50 border-emerald-500/30 text-emerald-300 font-bold'
                }`}
              >
                {joinResult.isError ? joinResult.result : `"${joinResult.result}"`}
              </div>

              {joinResult.errorMsg && (
                <div className="text-xs text-red-300 flex items-start gap-1.5 pt-1">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{joinResult.errorMsg}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
