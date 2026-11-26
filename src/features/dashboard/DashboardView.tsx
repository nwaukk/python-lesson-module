/**
 * Python Visual Lab Dashboard
 * Section 11: Progress metrics, level overviews, continue learning action, and manifest cards.
 */

import React, { useEffect, useState } from 'react';
import {
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  Download,
  Upload,
  HardDrive,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useProgress } from '../../store/progressContext';
import { useNavigation } from '../../store/navigationContext';
import { COURSE_DAYS_MANIFEST } from '../../data/manifest';
import { storage, StorageBackendType } from '../../store/storageAdapter';
import { useOnlineStatus } from '../../store/useOnlineStatus';
import { downloadProgressBackupFile, importProgressBackupJson } from '../../store/backupManager';

export const DashboardView: React.FC = () => {
  const { progress, completionPercentage, totalSubtopicsCompleted, totalCourseSubtopics } = useProgress();
  const { navigateTo, selectDay } = useNavigation();
  const { isOnline } = useOnlineStatus();
  const [storageBackend, setStorageBackend] = useState<StorageBackendType>(() => storage.getStorageBackend());
  const [backupFeedback, setBackupFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    let active = true;
    void storage.ready().then(() => {
      if (active) setStorageBackend(storage.getStorageBackend());
    });
    const unsub = storage.subscribeStatus(() => {
      setStorageBackend(storage.getStorageBackend());
    });
    return () => {
      active = false;
      unsub();
    };
  }, []);

  const handleExportFullProgress = () => {
    const { filename } = downloadProgressBackupFile();
    setBackupFeedback({ ok: true, text: `Exported complete workspace backup to ${filename}.` });
  };

  const handleImportFullProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = String(event.target?.result ?? '');
      const result = importProgressBackupJson(content);
      setBackupFeedback({ ok: result.ok, text: result.message });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const backendLabel =
    storageBackend === 'indexeddb'
      ? 'IndexedDB (Persistent Local Database)'
      : storageBackend === 'localstorage'
      ? 'Local Storage Mirror'
      : 'In-Memory Session Fallback';

  const notesCount = Object.keys(progress.notes || {}).filter((k) => Boolean(progress.notes[k]?.trim())).length;

  const beginnerDays = COURSE_DAYS_MANIFEST.filter((d) => d.level === 'beginner');
  const intermediateDays = COURSE_DAYS_MANIFEST.filter((d) => d.level === 'intermediate');
  const advancedDays = COURSE_DAYS_MANIFEST.filter((d) => d.level === 'advanced');

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-app)] p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Hero / Overview Banner */}
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--bg-surface)] via-[var(--bg-surface)] to-[var(--accent-subtle)] p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="eyebrow-label text-[11px] text-[var(--accent-primary)] font-bold">
              INTERACTIVE 30 DAYS OF PYTHON
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold">
              v2.0 Visual Lab
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-main)] leading-tight">
            See how Python works internally. Don't just read code.
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            Welcome to the laboratory edition of the acclaimed <em>30 Days of Python</em> curriculum. Experience real execution, step-by-step memory inspections, responsive notebooks, and tactile simulations.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => selectDay(0)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] text-sm font-bold shadow-lg transition-transform hover:scale-102"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Take Welcome Tour</span>
            </button>
            <button
              onClick={() => selectDay(1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-main)] text-sm font-semibold transition-colors"
            >
              <span>Start Day 1</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo('roadmap')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-main)] text-sm font-semibold transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[var(--text-dim)]" />
              <span>Explore 30-Day Roadmap</span>
            </button>
            <button
              onClick={() => navigateTo('certificate')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-main)] text-sm font-semibold transition-colors"
            >
              <Award className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>PDF Certificate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Completion */}
        <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[var(--text-dim)]">
              <span className="eyebrow-label text-[10px]">COURSE PROGRESS</span>
              <Award className="w-4 h-4 text-[var(--accent-primary)]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tabular-nums">
              {completionPercentage}%
            </div>
            <div className="w-full bg-[var(--bg-app)] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[var(--accent-primary)] h-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="text-[11px] text-[var(--text-dim)] tabular-nums">
              {totalSubtopicsCompleted} of {totalCourseSubtopics} subtopics completed
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('certificate')}
            className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-primary)] hover:underline text-left"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>Export PDF Certificate</span>
          </button>
        </div>

        {/* Metric 2: Streak */}
        <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-dim)]">
            <span className="eyebrow-label text-[10px]">DAILY STREAK</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">
            {progress.streakDays} {progress.streakDays === 1 ? 'Day' : 'Days'}
          </div>
          <div className="text-[11px] text-amber-400 font-medium">
            Active session today • Keep learning
          </div>
        </div>

        {/* Metric 3: Active Stage */}
        <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-dim)]">
            <span className="eyebrow-label text-[10px]">CURRENT LEVEL</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] capitalize">
            Beginner
          </div>
          <div className="text-[11px] text-[var(--text-dim)]">
            Days 1–8: Foundations & Core Types
          </div>
        </div>

        {/* Metric 4: Runtime Engine */}
        <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-dim)]">
            <span className="eyebrow-label text-[10px]">EXECUTION RUNTIME</span>
            <Sparkles className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">
            Client-Side
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">
            Pyodide Worker • 100% Private & Free
          </div>
        </div>
      </div>

      {/* Offline Storage & Single-File Progress Backup */}
      <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-[var(--text-dim)]">
            <HardDrive className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
            <span className="font-semibold text-[var(--text-main)]">Local Progress &amp; Offline Backup</span>
            <span aria-hidden="true">·</span>
            <span>{backendLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 text-[var(--text-muted)]">
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
              {isOnline ? 'Online' : 'Offline Ready'}
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] tabular-nums">
            Automatically saves completed days ({progress.completedDays.length}), subtopics ({totalSubtopicsCompleted}), saved notes ({notesCount}), code snippets, appearance preferences, and your last position.
          </p>
          {backupFeedback && (
            <p
              role="status"
              className={`text-xs font-medium ${backupFeedback.ok ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {backupFeedback.text}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportFullProgress}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] text-xs font-semibold transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>Export Progress (.json)</span>
          </button>
          <label className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] hover:bg-[var(--bg-surface-elevated)] text-xs font-semibold text-[var(--text-main)] cursor-pointer transition-colors whitespace-nowrap">
            <Upload className="w-4 h-4" />
            <span>Import Progress (.json)</span>
            <input type="file" accept=".json" onChange={handleImportFullProgress} className="hidden" />
          </label>
        </div>
      </div>

      {/* Curriculum Levels Sections */}
      <div className="space-y-6">
        {/* Level 1: Beginner */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)]">
                Level 1: Beginner Foundations (Days 1–8)
              </h2>
              <p className="text-xs text-[var(--text-dim)]">
                Variables, objects, memory binding, operators, strings, lists, tuples, sets, and dictionaries.
              </p>
            </div>
            <span className="text-xs font-semibold text-[var(--accent-primary)]">8 Days</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {beginnerDays.map((day) => (
              <div
                key={day.number}
                onClick={() => selectDay(day.number)}
                className="group p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)]/60 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[var(--accent-primary)]">
                      Day {day.number.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-dim)]">
                      {day.estimatedMinutes} mins
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[var(--text-main)] group-hover:text-[var(--accent-primary)] transition-colors">
                    {day.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                    {day.summary}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-dim)]">
                  <span>{day.subtopicsCount} topics</span>
                  <ChevronRight className="w-4 h-4 text-[var(--accent-primary)] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level 2: Intermediate */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)]">
                Level 2: Intermediate Python (Days 9–20)
              </h2>
              <p className="text-xs text-[var(--text-dim)]">
                Conditionals, loops, functions, closures, decorators, regex, error handling, and files.
              </p>
            </div>
            <span className="text-xs font-semibold text-[var(--accent-primary)]">12 Days</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {intermediateDays.slice(0, 4).map((day) => (
              <div
                key={day.number}
                onClick={() => selectDay(day.number)}
                className="group p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)]/60 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[var(--accent-primary)]">
                      Day {day.number}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-dim)]">
                      {day.estimatedMinutes} mins
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[var(--text-main)] group-hover:text-[var(--accent-primary)] transition-colors">
                    {day.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                    {day.summary}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-dim)]">
                  <span>{day.subtopicsCount} topics</span>
                  <ChevronRight className="w-4 h-4 text-[var(--accent-primary)] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level 3: Advanced */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)]">
                Level 3: Advanced & Applied (Days 21–30)
              </h2>
              <p className="text-xs text-[var(--text-dim)]">
                OOP, web scraping, NumPy, Pandas, Flask web development, MongoDB, and REST APIs.
              </p>
            </div>
            <span className="text-xs font-semibold text-[var(--accent-primary)]">10 Days</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {advancedDays.slice(0, 4).map((day) => (
              <div
                key={day.number}
                onClick={() => selectDay(day.number)}
                className="group p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)]/60 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[var(--accent-primary)]">
                      Day {day.number}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-dim)]">
                      {day.estimatedMinutes} mins
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[var(--text-main)] group-hover:text-[var(--accent-primary)] transition-colors">
                    {day.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                    {day.summary}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-dim)]">
                  <span>{day.subtopicsCount} topics</span>
                  <ChevronRight className="w-4 h-4 text-[var(--accent-primary)] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
