/**
 * Searchable Technical Glossary View
 * Section 1.3 & 3.2: Filterable, searchable repository of all technical terms and definitions.
 */

import React, { useState } from 'react';
import { BookOpen, Search, Filter, Sparkles, ArrowRight, Tag } from 'lucide-react';
import { GLOSSARY_TERMS, GlossaryTerm } from '../../data/glossary';
import { useNavigation } from '../../store/navigationContext';

export const GlossaryView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { navigateTo } = useNavigation();

  const categories = [
    { id: 'all', label: 'All Terms' },
    { id: 'core', label: 'Core Syntax' },
    { id: 'memory', label: 'Memory & Binding' },
    { id: 'types', label: 'Data Types' },
    { id: 'functions', label: 'Functions & Scope' },
    { id: 'execution', label: 'Runtime & PVM' },
    { id: 'advanced', label: 'Advanced & OOP' },
  ];

  const filtered = GLOSSARY_TERMS.filter((item) => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        item.term.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        item.relatedTerms?.some((r) => r.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-app)] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-[var(--accent-primary)]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-main)]">
              Python Technical Glossary
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Clear, plain British English definitions of every Python technical term with code examples.
          </p>
        </div>

        {/* Search input */}
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
          <input
            type="text"
            placeholder="Search glossary terms..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-dim)] focus:ring-1 focus:ring-[var(--accent-primary)]"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3 py-1.5 rounded-xl border font-semibold whitespace-nowrap transition-colors ${
              categoryFilter === cat.id
                ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.term}
            className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between space-y-3 shadow-xs hover:border-[var(--border-strong)] transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[var(--text-main)]">{item.term}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-md font-mono uppercase bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-dim)]">
                  {item.category}
                </span>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {item.definition}
              </p>

              {item.pythonExample && (
                <div className="p-2.5 rounded-xl bg-black/40 border border-[var(--border-subtle)] font-mono text-xs text-sky-300 whitespace-pre-wrap">
                  {item.pythonExample}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-dim)]">
              {item.introducedInDay ? (
                <button
                  onClick={() => navigateTo('lesson', { day: item.introducedInDay, subtopic: 0 })}
                  className="text-[var(--accent-primary)] font-semibold flex items-center gap-1 hover:underline"
                >
                  <span>Introduced in Day {item.introducedInDay}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span />
              )}

              {item.relatedTerms && (
                <div className="flex gap-1">
                  {item.relatedTerms.slice(0, 2).map((rt) => (
                    <span
                      key={rt}
                      onClick={() => setQuery(rt)}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-app)] text-[var(--text-dim)] hover:text-[var(--text-main)] cursor-pointer"
                    >
                      {rt}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
