/**
 * Python Visual Lab Primary Application Shell
 * Glues together TopBar, DaySubtopicStrip, Views, ErrorBoundaries, and Appearance Drawer.
 */

import React, { useState } from 'react';
import { TopBar } from './TopBar';
import { DaySubtopicStrip } from './DaySubtopicStrip';
import { AppearanceStudio } from '../design/AppearanceStudio';
import { GlobalSearch } from '../features/search/GlobalSearch';
import { useNavigation } from '../store/navigationContext';
import { useSettings } from '../store/settingsContext';
import { ErrorBoundary } from './ErrorBoundary';

// Lazy/direct views
import { DashboardView } from '../features/dashboard/DashboardView';
import { RoadmapView } from '../features/roadmap/RoadmapView';
import { GuidedWorkspace } from '../engine/lesson/GuidedWorkspace';
import { NotebookLab } from '../features/notebook/NotebookLab';
import { PlaygroundView } from '../features/playground/PlaygroundView';
import { MethodsExplorer } from '../features/methods/MethodsExplorer';
import { NotesView } from '../features/notes/NotesView';
import { TeachingMode } from '../features/teaching/TeachingMode';
import { CreditsView } from '../features/credits/CreditsView';
import { GlossaryView } from '../features/glossary/GlossaryView';
import { SelfTestView } from '../dev/SelfTestView';

export const AppShell: React.FC = () => {
  const { route } = useNavigation();
  const { settings } = useSettings();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // In teaching layout preset, render full TeachingMode directly
  if (settings.layoutPreset === 'teaching') {
    return (
      <div className="w-full h-screen flex flex-col bg-[var(--bg-app)] overflow-hidden">
        <ErrorBoundary fallbackTitle="Teaching Mode Error">
          <TeachingMode />
        </ErrorBoundary>
        <AppearanceStudio />
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-[var(--bg-app)] overflow-hidden select-text">
      {/* Top Bar (Section 3.3) */}
      <TopBar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Day and Subtopic Strip (shown for Lessons, Notebook, and Playground) */}
      {(route === 'lesson' || route === 'notebook' || route === 'playground') && (
        <DaySubtopicStrip />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <ErrorBoundary fallbackTitle="Application View Error">
          {route === 'dashboard' && <DashboardView />}
          {route === 'roadmap' && <RoadmapView />}
          {route === 'lesson' && (
            settings.layoutPreset === 'notebook' ? <NotebookLab /> : <GuidedWorkspace />
          )}
          {route === 'notebook' && <NotebookLab />}
          {route === 'playground' && <PlaygroundView />}
          {route === 'methods' && <MethodsExplorer />}
          {route === 'notes' && <NotesView />}
          {route === 'glossary' && <GlossaryView />}
          {route === 'teaching' && <TeachingMode />}
          {route === 'credits' && <CreditsView />}
          {route === 'selftest' && <SelfTestView />}
        </ErrorBoundary>
      </main>

      {/* Global Modals & Drawers */}
      <AppearanceStudio />
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};
