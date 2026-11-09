/**
 * Global Search Modal (Ctrl/Cmd + K)
 * Fast navigation across Day 0 Welcome Tour, 30 days, subtopics, and glossary terms.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, ArrowRight, CornerDownLeft, Sparkles, HelpCircle } from 'lucide-react';
import { COURSE_DAYS_MANIFEST, DayManifestItem } from '../../data/manifest';
import { GLOSSARY_TERMS } from '../../data/glossary';
import { useNavigation } from '../../store/navigationContext';

interface SearchItem {
  id: string;
  type: 'day' | 'tour' | 'glossary';
  title: string;
  subtitle: string;
  badge: string;
  dayNumber?: number;
}

const TOUR_SEARCH_ITEM: SearchItem = {
  id: 'day-0-tour',
  type: 'tour',
  title: 'Day 0: Welcome Tour',
  subtitle: 'The 10-step visual journey, simulation primitives, and execution runtime.',
  badge: 'Tour',
  dayNumber: 0,
};

export const GlobalSearch: React.FC<Props> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { navigateTo, selectDay } = useNavigation();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const allSearchItems: SearchItem[] = [
    TOUR_SEARCH_ITEM,
    ...COURSE_DAYS_MANIFEST.map((d) => ({
      id: `day-${d.number}`,
      type: 'day' as const,
      title: `Day ${d.number.toString().padStart(2, '0')}: ${d.title}`,
      subtitle: d.summary,
      badge: d.level,
      dayNumber: d.number,
    })),
    ...GLOSSARY_TERMS.map((g) => ({
      id: `glossary-${g.term}`,
      type: 'glossary' as const,
      title: g.term,
      subtitle: g.definition,
      badge: g.category,
      dayNumber: g.introducedInDay,
    })),
  ];

  const filteredItems = allSearchItems.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.badge.toLowerCase().includes(q)
    );
  }).slice(0, 8);

  const handleSelect = (item: SearchItem) => {
    if (item.type === 'tour') {
      selectDay(0);
    } else if (item.type === 'day' && item.dayNumber !== undefined) {
      selectDay(item.dayNumber);
    } else if (item.type === 'glossary') {
      navigateTo('glossary');
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Search"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-[var(--bg-app)] border border-[var(--border-strong)] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <Search className="w-5 h-5 text-[var(--accent-primary)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search lessons, tour, subtopics, glossary terms (e.g. slicing, mutable, pvm, day 4)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-[var(--text-main)] placeholder:text-[var(--text-dim)] focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-dim)]">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[var(--border-subtle)]">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-[var(--text-dim)]">
              No matching Python topics or lessons found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-start justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[var(--accent-subtle)] border-l-4 border-[var(--accent-primary)]'
                      : 'hover:bg-[var(--bg-surface)]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-mono font-bold text-[var(--accent-primary)] shrink-0">
                      {item.type === 'tour' ? 'Tour' : item.type === 'glossary' ? 'Term' : `Day ${item.dayNumber}`}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[var(--text-main)]">{item.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md uppercase tracking-wider font-semibold border border-[var(--border-subtle)] text-[var(--text-dim)]">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-dim)] shrink-0 pt-1">
                    <ArrowRight className="w-4 h-4 text-[var(--accent-primary)]" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between text-[11px] text-[var(--text-dim)]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-surface-elevated)] border text-[10px]">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-surface-elevated)] border text-[10px]">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-surface-elevated)] border text-[10px]">Enter</kbd> to select
            </span>
          </div>
          <div className="flex items-center gap-1 text-[var(--accent-primary)] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Python Visual Lab</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
