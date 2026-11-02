/**
 * Cheat Sheet & Quick Reference Modal
 * Section 13.2 & 13.5: Accessible, searchable quick-reference viewer for Day Cheat Sheet blocks.
 * Supports category filtering, real-time query search, clipboard copying, and workspace code loading.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, Copy, Check, FileCode, BookOpen, Layers } from 'lucide-react';
import { CheatSheetBlock } from './types';

interface Props {
  dayNumber: number;
  dayTitle: string;
  blocks: CheatSheetBlock[];
  isOpen: boolean;
  onClose: () => void;
  onLoadCode?: (code: string) => void;
}

export const CheatSheetModal: React.FC<Props> = ({
  dayNumber,
  dayTitle,
  blocks,
  isOpen,
  onClose,
  onLoadCode,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    blocks.forEach((b) => set.add(b.category));
    return ['All', ...Array.from(set)];
  }, [blocks]);

  // Filter blocks
  const filteredBlocks = useMemo(() => {
    return blocks.filter((b) => {
      const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        b.category.toLowerCase().includes(q) ||
        b.syntax.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.example.toLowerCase().includes(q)
      );
    });
  }, [blocks, selectedCategory, query]);

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard?.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cheatsheet-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent-primary)]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="eyebrow-label text-[10px] text-[var(--accent-primary)]">
                DAY {dayNumber} REFERENCE
              </div>
              <h2 id="cheatsheet-title" className="text-base sm:text-lg font-bold text-[var(--text-main)]">
                {dayTitle} — Cheat Sheet
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close Cheat Sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search syntax, concepts, keywords, or examples..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-dim)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] font-bold shadow-xs'
                    : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredBlocks.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-muted)] text-xs">
              <Layers className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>No cheat sheet items match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBlocks.map((block, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex flex-col justify-between hover:border-[var(--border-strong)] transition-all shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[var(--bg-app)] text-[var(--accent-primary)] border border-[var(--border-subtle)]">
                        {block.category}
                      </span>
                      <button
                        onClick={() => copyToClipboard(block.example, idx)}
                        title="Copy example code"
                        className="p-1 rounded-md text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors flex items-center gap-1 text-[11px]"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="font-mono text-xs font-bold text-[var(--text-main)] bg-[var(--bg-app)] p-2 rounded-lg border border-[var(--border-subtle)] break-all">
                      {block.syntax}
                    </div>

                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {block.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-[var(--text-dim)] tracking-wider">
                        Example
                      </span>
                      {onLoadCode && (
                        <button
                          onClick={() => {
                            onLoadCode(block.example);
                            onClose();
                          }}
                          className="text-[11px] text-[var(--accent-primary)] hover:underline flex items-center gap-1 font-semibold"
                        >
                          <FileCode className="w-3 h-3" />
                          <span>Load into Editor</span>
                        </button>
                      )}
                    </div>
                    <pre className="p-2.5 rounded-lg bg-[var(--bg-code)] text-[11px] font-mono text-[var(--text-code)] overflow-x-auto whitespace-pre-wrap border border-[var(--border-subtle)]">
                      {block.example}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] flex items-center justify-between text-xs text-[var(--text-dim)] shrink-0">
          <span>Showing {filteredBlocks.length} of {blocks.length} reference cards</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-[var(--border-subtle)] font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
