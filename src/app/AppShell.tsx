/**
 * Python Visual Lab Primary Application Shell
 * Glues together TopBar, DaySubtopicStrip, Views, ErrorBoundaries, and Appearance Drawer.
 */

import React, { useEffect, useState } from 'react';
import { TopBar } from './TopBar';
import { DaySubtopicStrip } from './DaySubtopicStrip';
import { AppearanceStudio } from '../design/AppearanceStudio';
import { GlobalSearch } from '../features/search/GlobalSearch';
import { useNavigation, AppRoute } from '../store/navigationContext';
import { useSettings } from '../store/settingsContext';
import { ErrorBoundary } from './ErrorBoundary';
import {
  downloadProgressBackupFile,
  importProgressBackupJson,
  PersistedPlaygroundState,
} from '../store/backupManager';
import { storage } from '../store/storageAdapter';
import {
  DesktopUpdateStatus,
  openExternalSafeUrl,
  savePythonFileDialog,
  subscribeDesktopMenuActions,
  subscribeDesktopUpdateStatus,
} from '../platform/desktopBridge';

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
import { CertificateView } from '../features/certificate/CertificateView';
import { SelfTestView } from '../dev/SelfTestView';

export const AppShell: React.FC = () => {
  const { route, navigateTo } = useNavigation();
  const { settings, setIsAppearanceStudioOpen } = useSettings();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [availableUpdate, setAvailableUpdate] = useState<DesktopUpdateStatus | null>(null);

  useEffect(() => {
    return subscribeDesktopUpdateStatus((info) => {
      if (info.status === 'update-available' && info.latestVersion && info.releaseUrl) {
        setAvailableUpdate(info);
      }
    });
  }, []);

  useEffect(() => {
    return subscribeDesktopMenuActions((event) => {
      if (event.action === 'navigate' && event.payload?.route) {
        navigateTo(event.payload.route as AppRoute);
      } else if (event.action === 'open-search') {
        setIsSearchOpen(true);
      } else if (event.action === 'open-appearance') {
        setIsAppearanceStudioOpen(true);
      } else if (event.action === 'export-backup') {
        downloadProgressBackupFile();
      } else if (event.action === 'import-backup') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) return;
          const text = await file.text();
          importProgressBackupJson(text);
        };
        input.click();
      } else if (event.action === 'open-py' && event.payload && !event.payload.canceled) {
        const current = storage.getItem<PersistedPlaygroundState>('code_snippets', {
          schemaVersion: 1,
          activeCode: '',
          savedSnippets: [],
        });
        storage.setItem('code_snippets', {
          ...current,
          schemaVersion: 1,
          activeCode: typeof event.payload.content === 'string' ? event.payload.content : '',
          activeFilePath: event.payload.filePath,
          activeFileName: event.payload.fileName,
        });
        storage.triggerHydration();
        navigateTo('playground');
      } else if (event.action === 'save-py' && route !== 'playground') {
        const current = storage.getItem<PersistedPlaygroundState>('code_snippets', {
          schemaVersion: 1,
          activeCode: '# Python Visual Lab Script\nprint("Hello, Python!")\n',
          savedSnippets: [],
        });
        void savePythonFileDialog({
          content: current.activeCode || '',
          filePath: current.activeFilePath,
          defaultName: current.activeFileName || 'playground_script.py',
          saveAs: Boolean(event.payload?.saveAs),
        }).then((res) => {
          if (!res.canceled && res.filePath) {
            storage.setItem('code_snippets', {
              ...current,
              activeFilePath: res.filePath,
              activeFileName: res.fileName,
            });
            storage.triggerHydration();
          }
        });
      }
    });
  }, [navigateTo, route, setIsAppearanceStudioOpen]);

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

      {/* Optional Online-Only GitHub Release Notification */}
      {availableUpdate && availableUpdate.releaseUrl && (
        <div
          role="status"
          className="px-4 py-1.5 border-b border-emerald-500/30 bg-emerald-500/10 text-emerald-200 text-xs flex items-center justify-center gap-3 shrink-0"
        >
          <span>
            A new desktop release (<strong>v{availableUpdate.latestVersion}</strong>) is available on GitHub Releases.
          </span>
          <button
            type="button"
            onClick={() => void openExternalSafeUrl(availableUpdate.releaseUrl!)}
            className="px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
          >
            Download Update
          </button>
          <button
            type="button"
            onClick={() => setAvailableUpdate(null)}
            className="text-emerald-300/80 hover:text-emerald-100 underline"
          >
            Dismiss
          </button>
        </div>
      )}

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
          {route === 'certificate' && <CertificateView />}
          {route === 'selftest' && <SelfTestView />}
        </ErrorBoundary>
      </main>

      {/* Global Modals & Drawers */}
      <AppearanceStudio />
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};
