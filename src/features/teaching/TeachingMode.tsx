/**
 * Teaching Mode (Classroom Projection Interface)
 * Section 11: High-visibility typography, simplified chrome, presenter navigation,
 * blank canvas toggle, and one-click exit.
 */

import React, { useState } from 'react';
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  Maximize2,
  X,
  Play,
} from 'lucide-react';
import { useNavigation } from '../../store/navigationContext';
import { useSettings } from '../../store/settingsContext';
import { COURSE_DAYS_MANIFEST } from '../../data/manifest';

export const TeachingMode: React.FC = () => {
  const { activeDay, activeSubtopicIndex, nextSubtopic, prevSubtopic, navigateTo } = useNavigation();
  const { setLayoutPreset } = useSettings();
  const [showAnswer, setShowAnswer] = useState(false);
  const [blankCanvas, setBlankCanvas] = useState(false);

  const manifest = COURSE_DAYS_MANIFEST.find((d) => d.number === activeDay) || COURSE_DAYS_MANIFEST[0];

  const handleExitTeaching = () => {
    setLayoutPreset('guided');
    navigateTo('lesson', { day: activeDay, subtopic: activeSubtopicIndex });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 text-slate-100 p-6 lg:p-10">
      {/* Presenter Top Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Presentation className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-amber-400 tracking-wider">
              TEACHING & CLASSROOM PROJECTOR MODE
            </div>
            <h1 className="text-2xl font-black text-white">
              Day {activeDay}: {manifest.title}
            </h1>
          </div>
        </div>

        {/* Presenter Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBlankCanvas(!blankCanvas)}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
              blankCanvas
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'border-slate-700 bg-slate-900 text-slate-300 hover:text-white'
            }`}
          >
            {blankCanvas ? 'Show Slide Content' : 'Blank Canvas Mode'}
          </button>

          <button
            onClick={handleExitTeaching}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Exit Teaching Mode</span>
          </button>
        </div>
      </div>

      {/* Main Slide Stage */}
      <div className="flex-1 flex items-center justify-center p-6">
        {blankCanvas ? (
          <div className="text-center space-y-3">
            <div className="text-6xl font-black text-slate-800">CLASSROOM WHITEBOARD</div>
            <p className="text-sm text-slate-600 font-mono">
              Projection surface cleared for instructor annotations and whiteboard drawing.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono font-bold px-3 py-1 rounded-md bg-sky-500/15 text-sky-400 border border-sky-500/30">
                Topic {activeSubtopicIndex + 1} of {manifest.subtopicsCount}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Classroom Focus
              </span>
            </div>

            <h2 className="text-3xl font-black text-white">
              Python Syntax & The Core Interpreter Loop
            </h2>

            {/* Big Code Block for Projector */}
            <div className="p-6 rounded-2xl bg-black/80 border border-slate-800 font-mono text-base text-slate-100 leading-relaxed shadow-inner">
              <div className="text-slate-500"># Interactive Lecture Demonstration</div>
              <div><span className="text-purple-400">subject</span> = <span className="text-emerald-400">"Python Visual Lab"</span></div>
              <div><span className="text-purple-400">learners</span> = <span className="text-amber-400">30</span></div>
              <div><span className="text-sky-400">print</span>(f<span className="text-emerald-400">"{'{'}subject{'}'}: {'{'}learners{'}'} students active"</span>)</div>
            </div>

            {/* Answer / Output Reveal on Demand */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md transition-colors"
              >
                {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showAnswer ? 'Hide Expected Output' : 'Reveal Expected Output'}</span>
              </button>

              {showAnswer && (
                <div className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-sm font-semibold animate-in fade-in">
                  Output: Python Visual Lab: 30 students active
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Presenter Bottom Bar Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={prevSubtopic}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold text-sm transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous Step</span>
        </button>

        <div className="text-xs font-mono text-slate-400">
          Slide {activeSubtopicIndex + 1} / {manifest.subtopicsCount}
        </div>

        <button
          onClick={nextSubtopic}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg transition-colors"
        >
          <span>Next Step</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
