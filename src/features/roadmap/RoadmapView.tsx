/**
 * Course Roadmap View
 * Displays all 30 days of the curriculum grouped by level with search & status filters.
 */

import React, { useState } from 'react';
import {
  Map,
  Clock,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Filter,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { COURSE_DAYS_MANIFEST } from '../../data/manifest';
import { useNavigation } from '../../store/navigationContext';
import { useProgress } from '../../store/progressContext';

export const RoadmapView: React.FC = () => {
  const { selectDay } = useNavigation();
  const { isSubtopicCompleted } = useProgress();
  const [filterLevel, setFilterLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const filteredDays = COURSE_DAYS_MANIFEST.filter((day) => {
    if (filterLevel === 'all') return true;
    return day.level === filterLevel;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-app)] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Map className="w-5 h-5 text-[var(--accent-primary)]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-main)]">
              30 Days of Python Roadmap
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            A comprehensive, visual progression from absolute beginner to production-grade applications.
          </p>
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-semibold self-start sm:self-auto">
          {[
            { id: 'all', label: 'All 30 Days' },
            { id: 'beginner', label: 'Beginner (1-8)' },
            { id: 'intermediate', label: 'Intermediate (9-20)' },
            { id: 'advanced', label: 'Advanced (21-30)' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterLevel(f.id as typeof filterLevel)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterLevel === f.id
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-on)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 30 Days */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDays.map((day) => {
          return (
            <div
              key={day.number}
              onClick={() => selectDay(day.number)}
              className="group p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)]/70 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent-primary)]">
                      Day {day.number.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[var(--text-dim)] tracking-wider">
                      {day.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[var(--text-dim)]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{day.estimatedMinutes}m</span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-[var(--text-main)] group-hover:text-[var(--accent-primary)] transition-colors">
                  {day.title}
                </h3>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {day.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {day.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-dim)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-dim)]">
                <span>{day.subtopicsCount} topics</span>
                <span className="flex items-center gap-1 text-[var(--accent-primary)] font-semibold group-hover:translate-x-1 transition-transform">
                  Open Lesson <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
