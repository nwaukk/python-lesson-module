/**
 * Credits and Attribution View
 * Section 1.5 requirement: Clear attribution to Asabeneh Yetayeh with repository links.
 */

import React, { useState } from 'react';
import { ExternalLink, Heart, FolderGit2, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../store/useOnlineStatus';

export const CreditsView: React.FC = () => {
  const { isOffline } = useOnlineStatus();
  const [offlineLinkNotice, setOfflineLinkNotice] = useState(false);

  const handleExternalClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isOffline) {
      e.preventDefault();
      setOfflineLinkNotice(true);
    } else {
      setOfflineLinkNotice(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-app)] p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FolderGit2 className="w-6 h-6 text-[var(--accent-primary)]" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">
            Curriculum Attribution & Credits
          </h1>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          Honouring the open educational source that inspired this interactive laboratory.
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
        <h2 className="text-lg font-bold text-[var(--text-main)]">
          The 30 Days of Python Curriculum
        </h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          The pedagogical roadmap, scope, and day-by-day learning structure of <strong>Python Visual Lab</strong> is founded upon the renowned open-source project created by <strong>Asabeneh Yetayeh</strong>:
        </p>
        <div className="space-y-2">
          <a
            href="https://github.com/Asabeneh/30-Days-Of-Python"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleExternalClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] text-sm font-semibold hover:bg-[var(--accent-primary)] hover:text-[var(--accent-on)] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>https://github.com/Asabeneh/30-Days-Of-Python</span>
          </a>
          {(isOffline || offlineLinkNotice) && (
            <div
              role="status"
              className="flex items-start gap-2.5 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300"
            >
              <WifiOff className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                You are currently offline. External GitHub repository links require an active internet connection, while all 30 lessons, labs, simulations, and local backups continue working locally.
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3">
        <h3 className="font-bold text-base text-[var(--text-main)]">
          Visual Laboratory Enhancements
        </h3>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          Python Visual Lab reconstructs this curriculum into an interactive visual experience with:
        </p>
        <ul className="text-sm space-y-2 text-[var(--text-muted)] list-disc pl-5">
          <li>Browser-based Web Worker real Python runtime (Pyodide 3.12) with zero cloud server dependency.</li>
          <li>Tactile memory visualisers, sequence index grids, call-stack frames, and AST instruction journey animations.</li>
          <li>Live WCAG 2.2 accessibility contrasting engine with 11 theme presets.</li>
          <li>Full responsive layouts including Guided 3-zone workspace, reactive Notebook Lab, and Classroom Teaching Mode.</li>
          <li>Original pedagogical explanations, practical African and international real-world scenarios, and British English spelling.</li>
        </ul>
      </div>

      <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] text-xs text-[var(--text-dim)] flex items-center justify-between">
        <span>Curriculum licensed under MIT / Creative Commons by the original author.</span>
        <div className="flex items-center gap-1 text-[var(--accent-primary)]">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Free and Open for Learners Worldwide</span>
        </div>
      </div>
    </div>
  );
};
