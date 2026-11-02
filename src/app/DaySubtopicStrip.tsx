/**
 * Day and Subtopic Strip
 * Section 3.3: Day selector dropdown, horizontal subtopic pills with status marks,
 * previous/next arrows, and workspace layout switcher.
 * Supports Day 0 (Welcome Tour) and Days 1–30.
 */

import React, { useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  LayoutGrid,
  Columns,
  Maximize2,
  Square,
  SlidersHorizontal,
  Presentation,
  Compass,
} from 'lucide-react';
import { useNavigation } from '../store/navigationContext';
import { useProgress } from '../store/progressContext';
import { useSettings } from '../store/settingsContext';
import { COURSE_DAYS_MANIFEST } from '../data/manifest';
import { getDayModule } from '../engine/lesson/dayLoader';
import { LayoutPreset } from '../design/tokens';

export const DaySubtopicStrip: React.FC = () => {
  const {
    activeDay,
    activeSubtopicIndex,
    selectDay,
    selectSubtopic,
    nextSubtopic,
    prevSubtopic,
  } = useNavigation();

  const { isSubtopicCompleted } = useProgress();
  const { settings, setLayoutPreset } = useSettings();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const dayModule = getDayModule(activeDay);
  const subtopicCount = dayModule.subtopics.length;

  const layoutIcons: Record<LayoutPreset, React.ComponentType<{ className?: string }>> = {
    guided: Columns,
    notebook: LayoutGrid,
    focus: Maximize2,
    'side-by-side': Square,
    stacked: SlidersHorizontal,
    teaching: Presentation,
  };

  return (
    <div className="w-full border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] px-3 sm:px-4 py-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 shrink-0">
      {/* Left: Day Selector Dropdown & Level Pill */}
      <div className="flex items-center gap-2 shrink-0">
        <label htmlFor="day-selector-select" className="sr-only">Select Python Day</label>
        <div className="relative">
          <select
            id="day-selector-select"
            value={activeDay}
            onChange={(e) => selectDay(parseInt(e.target.value, 10))}
            className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-bold text-[var(--text-main)] hover:border-[var(--border-strong)] focus:ring-1 focus:ring-[var(--accent-primary)] cursor-pointer"
          >
            <option value={0}>✨ Day 0: Welcome Tour</option>
            <optgroup label="Beginner (Days 1–8)">
              {COURSE_DAYS_MANIFEST.filter((d) => d.level === 'beginner').map((d) => (
                <option key={d.number} value={d.number}>
                  Day {d.number.toString().padStart(2, '0')}: {d.title}
                </option>
              ))}
            </optgroup>
            <optgroup label="Intermediate (Days 9–20)">
              {COURSE_DAYS_MANIFEST.filter((d) => d.level === 'intermediate').map((d) => (
                <option key={d.number} value={d.number}>
                  Day {d.number.toString().padStart(2, '0')}: {d.title}
                </option>
              ))}
            </optgroup>
            <optgroup label="Advanced (Days 21–30)">
              {COURSE_DAYS_MANIFEST.filter((d) => d.level === 'advanced').map((d) => (
                <option key={d.number} value={d.number}>
                  Day {d.number.toString().padStart(2, '0')}: {d.title}
                </option>
              ))}
            </optgroup>
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-dim)] text-[10px]">
            ▼
          </div>
        </div>

        <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-dim)]">
          {dayModule.level}
        </span>
      </div>

      {/* Center: Scrollable Subtopic Pills with Stepper Arrows */}
      <div className="flex-1 flex items-center min-w-0 gap-1">
        <button
          onClick={prevSubtopic}
          title="Previous subtopic ([)"
          className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] shrink-0 transition-colors"
          aria-label="Previous subtopic"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5"
          style={{ scrollbarWidth: 'none' }}
        >
          {dayModule.subtopics.map((st, idx) => {
            const isSelected = idx === activeSubtopicIndex;
            const completed = isSubtopicCompleted(activeDay, idx);

            return (
              <button
                key={st.id}
                onClick={() => selectSubtopic(idx)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 border ${
                  isSelected
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-semibold shadow-xs'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-strong)]'
                }`}
              >
                {completed ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-2.5 h-2.5 text-[var(--text-dim)] shrink-0" />
                )}
                <span>
                  {idx + 1}. {st.title}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={nextSubtopic}
          title="Next subtopic (])"
          className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] shrink-0 transition-colors"
          aria-label="Next subtopic"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Quick Layout Preset Switcher */}
      <div className="hidden xl:flex items-center gap-1 p-0.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] shrink-0">
        {(['guided', 'notebook', 'side-by-side', 'focus', 'teaching'] as LayoutPreset[]).map((layout) => {
          const Icon = layoutIcons[layout];
          const isSelected = settings.layoutPreset === layout;
          return (
            <button
              key={layout}
              onClick={() => setLayoutPreset(layout)}
              title={`Switch to ${layout} layout`}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                isSelected
                  ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                  : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
