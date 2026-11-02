/**
 * Personal Notes & Bookmarks Registry
 * Section 11: Per-subtopic notes with autosave, bookmarks list, and global search.
 */

import React, { useState } from 'react';
import { Bookmark, FileText, ArrowRight, Trash2, Download, Search } from 'lucide-react';
import { useProgress } from '../../store/progressContext';
import { useNavigation } from '../../store/navigationContext';
import { COURSE_DAYS_MANIFEST } from '../../data/manifest';

export const NotesView: React.FC = () => {
  const { progress, saveNote, toggleBookmark } = useProgress();
  const { navigateTo } = useNavigation();
  const [filterMode, setFilterMode] = useState<'all' | 'notes' | 'bookmarks'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Collect notes and bookmarks entries
  const allKeys = Array.from(
    new Set([...Object.keys(progress.notes), ...progress.bookmarks])
  );

  const entries = allKeys
    .map((key) => {
      const [dayStr, subtopicStr] = key.split('_');
      const day = parseInt(dayStr, 10);
      const subtopic = parseInt(subtopicStr, 10);
      const manifest = COURSE_DAYS_MANIFEST.find((d) => d.number === day);
      const note = progress.notes[key] || '';
      const isBookmarked = progress.bookmarks.includes(key);

      return {
        key,
        day,
        subtopic,
        dayTitle: manifest ? manifest.title : `Day ${day}`,
        note,
        isBookmarked,
      };
    })
    .filter((entry) => {
      if (filterMode === 'notes' && !entry.note.trim()) return false;
      if (filterMode === 'bookmarks' && !entry.isBookmarked) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          entry.dayTitle.toLowerCase().includes(q) ||
          entry.note.toLowerCase().includes(q) ||
          `day ${entry.day}`.includes(q)
        );
      }
      return true;
    });

  const handleExportNotes = () => {
    let md = '# Python Visual Lab — Personal Notes & Bookmarks\n\n';
    entries.forEach((e) => {
      md += `## Day ${e.day}: ${e.dayTitle} (Topic ${e.subtopic + 1})\n`;
      if (e.isBookmarked) md += `*Bookmarked*\n`;
      if (e.note) md += `\n${e.note}\n`;
      md += '\n---\n\n';
    });
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pvl-notes-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-app)] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-5 h-5 text-[var(--accent-primary)]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-main)]">
              Personal Notes & Bookmarks
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Review your reflections, study bookmarks, and highlighted topics across the curriculum.
          </p>
        </div>

        {entries.length > 0 && (
          <button
            onClick={handleExportNotes}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] text-xs font-semibold text-[var(--text-main)] transition-colors self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Export Notes (.md)</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-semibold">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'notes', label: 'Written Notes' },
            { id: 'bookmarks', label: 'Bookmarks Only' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setFilterMode(mode.id as typeof filterMode)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterMode === mode.id
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-on)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
          <input
            type="text"
            placeholder="Search notes & bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-dim)] focus:ring-1 focus:ring-[var(--accent-primary)]"
          />
        </div>
      </div>

      {/* Entries List */}
      {entries.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3">
          <Bookmark className="w-8 h-8 text-[var(--text-dim)] mx-auto opacity-50" />
          <div className="text-sm font-semibold text-[var(--text-main)]">No notes or bookmarks yet</div>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            While studying in the Guided Workspace, click the bookmark icon or type in the "My Personal Notes" box to collect study notes here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entries.map((entry) => (
            <div
              key={entry.key}
              className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--accent-primary)]">
                      Day {entry.day} • Topic {entry.subtopic + 1}
                    </span>
                    {entry.isBookmarked && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                        Bookmarked
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      navigateTo('lesson', { day: entry.day, subtopic: entry.subtopic })
                    }
                    className="p-1 rounded text-[var(--text-dim)] hover:text-[var(--accent-primary)]"
                    title="Jump to this subtopic"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-sm text-[var(--text-main)]">{entry.dayTitle}</h3>

                {entry.note ? (
                  <p className="text-xs text-[var(--text-muted)] whitespace-pre-wrap bg-[var(--bg-app)] p-3 rounded-xl border border-[var(--border-subtle)]">
                    {entry.note}
                  </p>
                ) : (
                  <div className="text-[11px] text-[var(--text-dim)] italic">No written note attached.</div>
                )}
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                <button
                  onClick={() => toggleBookmark(entry.day, entry.subtopic)}
                  className="text-[var(--text-dim)] hover:text-amber-400"
                >
                  {entry.isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                </button>
                <button
                  onClick={() =>
                    navigateTo('lesson', { day: entry.day, subtopic: entry.subtopic })
                  }
                  className="text-[var(--accent-primary)] font-semibold flex items-center gap-1"
                >
                  <span>Open Lesson</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
