/**
 * Find vs Index & Search Inspector Simulation Primitive
 * Section 8.4 & Day 4 Brief:
 * Dual comparison highlighting matched positions, showing find() returning -1 on not found
 * versus index() raising ValueError: substring not found, plus rfind, rindex, and count.
 */

import React, { useState } from 'react';
import {
  Search,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { SimulationController } from './SimulationController';

export const FindIndexSearchSim: React.FC = () => {
  const [text, setText] = useState<string>('coding in python is awesome and python is fun');
  const [searchQuery, setSearchQuery] = useState<string>('python');

  const textLower = text.toLowerCase();
  const queryLower = searchQuery.toLowerCase();

  // Find all matches
  const matchIndices: number[] = [];
  if (queryLower.length > 0) {
    let pos = 0;
    while ((pos = textLower.indexOf(queryLower, pos)) !== -1) {
      matchIndices.push(pos);
      pos += queryLower.length;
    }
  }

  const findResult = text.indexOf(searchQuery);
  const rfindResult = text.lastIndexOf(searchQuery);
  const isFound = findResult !== -1;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Find vs Index & Substring Search Inspector"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <span className="eyebrow-label text-xs">SOURCE STRING TO SEARCH IN</span>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-sm text-[var(--text-main)]"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                'coding in python is awesome and python is fun',
                'banana banana banana',
                'nigeria tech innovators in lagos',
                'hello world 2026',
              ].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setText(preset)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-app)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <span className="eyebrow-label text-xs">SEARCH SUBSTRING</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-sm text-[var(--text-main)]"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['python', 'awesome', 'ruby', 'is', '2026'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSearchQuery(sub)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-app)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                >
                  "{sub}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Character Highlight Ribbon */}
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 overflow-x-auto shadow-inner">
          <div className="flex items-center justify-between">
            <span className="eyebrow-label text-xs">VISUAL SUBSTRING MATCH HIGHLIGHT</span>
            <span className="text-xs font-mono text-[var(--text-dim)]">
              Occurrences: {matchIndices.length}
            </span>
          </div>

          <div className="inline-flex gap-1 py-2 font-mono text-xs">
            {text.split('').map((char, i) => {
              const isInMatch = matchIndices.some(
                (start) => i >= start && i < start + searchQuery.length
              );
              const isFirstOfMatch = matchIndices.includes(i);

              return (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-[9px] text-[var(--text-dim)] pb-0.5">{i}</span>
                  <div
                    className={`w-7 h-9 rounded-md flex items-center justify-center font-bold text-sm transition-all ${
                      isInMatch
                        ? 'bg-emerald-500 text-slate-950 shadow-md ring-1 ring-emerald-300'
                        : 'bg-[var(--bg-app)] text-[var(--text-main)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    {char === ' ' ? '␣' : char}
                  </div>
                  {isFirstOfMatch && (
                    <span className="text-[9px] text-emerald-400 font-bold pt-0.5">▲</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* The Fundamental Difference: find() vs index() Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* find() Panel */}
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-sky-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400 font-mono">1. text.find("{searchQuery}")</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                Safe: Never Raises Exception
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/50 border border-[var(--border-subtle)] font-mono text-sm">
              <span className="text-[var(--text-dim)]">Returned Value: </span>
              <span className={`font-bold ${isFound ? 'text-emerald-400' : 'text-amber-400'}`}>
                {findResult}
              </span>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {isFound
                ? `Found substring starting at index ${findResult}.`
                : 'Substring not found! find() gracefully returns -1 so your program can test `if text.find(...) != -1`.'}
            </p>

            <div className="pt-2 text-[11px] font-mono text-[var(--text-dim)] border-t border-[var(--border-subtle)] flex justify-between">
              <span>Right-most: text.rfind("{searchQuery}")</span>
              <span className="text-sky-300 font-bold">{rfindResult}</span>
            </div>
          </div>

          {/* index() Panel */}
          <div
            className={`p-5 rounded-2xl border space-y-3 transition-colors ${
              !isFound
                ? 'bg-red-500/10 border-red-500/40'
                : 'bg-[var(--bg-surface)] border-purple-500/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-bold font-mono ${
                  !isFound ? 'text-red-400' : 'text-purple-400'
                }`}
              >
                2. text.index("{searchQuery}")
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  !isFound
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                }`}
              >
                {!isFound ? 'FATAL ERROR' : 'Strict Index Search'}
              </span>
            </div>

            <div
              className={`p-3.5 rounded-xl font-mono text-sm border ${
                !isFound
                  ? 'bg-red-950/60 border-red-500/50 text-red-300 font-bold'
                  : 'bg-black/50 border-[var(--border-subtle)] text-emerald-400 font-bold'
              }`}
            >
              <span className="text-[var(--text-dim)]">Output: </span>
              {isFound ? (
                <span>{findResult}</span>
              ) : (
                <span>ValueError: substring not found</span>
              )}
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {isFound
                ? `Found substring at index ${findResult}.`
                : 'CRASH! index() throws a ValueError when the substring is missing. It halts the execution unless wrapped in a try/except block.'}
            </p>

            <div className="pt-2 text-[11px] font-mono text-[var(--text-dim)] border-t border-[var(--border-subtle)] flex justify-between">
              <span>Right-most: text.rindex("{searchQuery}")</span>
              <span className={isFound ? 'text-purple-300 font-bold' : 'text-red-400 font-bold'}>
                {isFound ? rfindResult : 'ValueError'}
              </span>
            </div>
          </div>
        </div>

        {/* Bonus: Membership and Count */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-around gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-dim)]">Membership in Operator:</span>
            <span className="text-sky-300 font-bold">"{searchQuery}" in text</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">
              {isFound ? 'True' : 'False'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[var(--text-dim)]">Occurrence Count:</span>
            <span className="text-sky-300 font-bold">text.count("{searchQuery}")</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 font-bold">
              {matchIndices.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
