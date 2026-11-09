/**
 * Python Visual Lab Primary Top Bar
 * Follows Section 3.3 specification with responsive adaptation.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Sliders,
  Flame,
  Menu,
  X,
  BookOpen,
  Map,
  Code2,
  Terminal,
  Layers,
  GraduationCap,
  AlertCircle,
  HelpCircle,
  FolderGit2,
} from 'lucide-react';
import { useNavigation, AppRoute } from '../store/navigationContext';
import { useSettings } from '../store/settingsContext';
import { useProgress } from '../store/progressContext';

interface Props {
  onOpenSearch: () => void;
}

export const TopBar: React.FC<Props> = ({ onOpenSearch }) => {
  const { route, navigateTo, activeDay } = useNavigation();
  const { setIsAppearanceStudioOpen, stepTextSize, settings } = useSettings();
  const { progress, isFallbackStorage, totalSubtopicsCompleted, completionPercentage } = useProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: AppRoute; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'lesson', label: 'Lessons', icon: BookOpen },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'methods', label: 'Methods', icon: Layers },
    { id: 'notebook', label: 'Notebook Lab', icon: Code2 },
    { id: 'playground', label: 'Playground', icon: Terminal },
    { id: 'glossary', label: 'Glossary', icon: HelpCircle },
  ];

  const handleNavClick = (navId: AppRoute) => {
    navigateTo(navId, { day: activeDay });
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] backdrop-blur-md">
      {/* Storage fallback notice banner if localStorage blocked */}
      {isFallbackStorage && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-1 text-xs text-amber-300 flex items-center justify-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>
            Storage is running in-memory because local disk access is restricted in this frame. Session notes & progress will remain active during your visit.
          </span>
        </div>
      )}

      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            aria-label="Python Visual Lab Home"
          >
            {/* Custom Laboratory Emblem */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 p-0.5 shadow-md flex items-center justify-center text-slate-950 font-black">
              <div className="w-full h-full bg-[var(--bg-app)] rounded-[10px] flex items-center justify-center text-[var(--accent-primary)] group-hover:scale-105 transition-transform">
                <span className="font-mono text-base font-extrabold tracking-tighter">Py</span>
              </div>
            </div>
            <div className="hidden xs:block">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="font-bold text-sm tracking-tight text-[var(--text-main)]">
                  Python Visual Lab
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
                  v2.0
                </span>
              </div>
              <div className="text-[10px] font-medium text-[var(--text-dim)]">
                30 Days of Visual Mastery
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 ml-4 pl-4 border-l border-[var(--border-subtle)]" aria-label="Main Navigation">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = route === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Center / Right: Search Bar Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex-1 max-w-xs hidden sm:flex items-center justify-between px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] text-xs text-[var(--text-dim)] hover:border-[var(--border-strong)] transition-colors"
          aria-label="Search lessons and topics (Ctrl+K)"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span className="truncate">Search topics & methods...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[10px] font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Right Tools: Text Zoom, Appearance, Streak, Progress & Mobile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Search on mobile */}
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]"
            aria-label="Open search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Text Resizing Buttons (Section 3.3: A- and A+) */}
          <div className="hidden md:flex items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] p-0.5" title="Interface text scale">
            <button
              onClick={() => stepTextSize('decrease')}
              disabled={settings.textSize <= 0.8}
              className="px-2 py-0.5 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-40"
              aria-label="Decrease text size"
            >
              A−
            </button>
            <span className="text-[10px] font-mono px-1 text-[var(--text-dim)] border-x border-[var(--border-subtle)]">
              {Math.round(settings.textSize * 100)}%
            </span>
            <button
              onClick={() => stepTextSize('increase')}
              disabled={settings.textSize >= 1.6}
              className="px-2 py-0.5 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-40"
              aria-label="Increase text size"
            >
              A+
            </button>
          </div>

          {/* Progress Chip */}
          <button
            onClick={() => handleNavClick('roadmap')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-[var(--accent-primary)]/40 transition-colors text-xs"
            title="Course Progress"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-[var(--text-main)]">{completionPercentage}%</span>
            <span className="text-[10px] text-[var(--text-dim)]">({totalSubtopicsCompleted}/240)</span>
          </button>

          {/* Streak Badge */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold"
            title={`${progress.streakDays} Day Learning Streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{progress.streakDays}d</span>
          </div>

          {/* Appearance Studio Button */}
          <button
            onClick={() => setIsAppearanceStudioOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-strong)] text-[var(--text-main)] text-xs font-semibold transition-all group"
            aria-label="Open Appearance Studio"
          >
            <span
              className="w-2.5 h-2.5 rounded-full ring-2 ring-white/20 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: settings.customColors.accent }}
            />
            <span className="hidden sm:inline">Appearance</span>
            <Sliders className="w-3.5 h-3.5 text-[var(--text-dim)] group-hover:text-[var(--text-main)]" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = route === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold border ${
                    isActive
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
            <button
              onClick={() => {
                handleNavClick('teaching');
              }}
              className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Teaching Mode</span>
            </button>
            <button
              onClick={() => {
                handleNavClick('credits');
              }}
              className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Curriculum Credits</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
