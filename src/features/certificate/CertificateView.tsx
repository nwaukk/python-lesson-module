/**
 * Completion Certificate Preview & PDF Export View
 * Displays live personalized credential preview, 30-day progress breakdown,
 * and downloads a client-side 2-page PDF certificate & transcript.
 */

import React, { useMemo, useState } from 'react';
import {
  Award,
  Download,
  CheckCircle2,
  BookOpen,
  Layers,
  FileText,
  ArrowRight,
  User,
} from 'lucide-react';
import { useProgress } from '../../store/progressContext';
import { useNavigation } from '../../store/navigationContext';
import { storage } from '../../store/storageAdapter';
import {
  buildCertificateSummary,
  CERTIFICATE_TRACK_OPTIONS,
} from './certificateData';
import {
  CertificatePdfTheme,
  downloadCertificatePdf,
} from './pdfExporter';

export const CertificateView: React.FC = () => {
  const { progress } = useProgress();
  const { selectDay, navigateTo } = useNavigation();

  const [recipientName, setRecipientName] = useState<string>(() =>
    storage.getItem<string>('certificate_recipient_name', 'Python Visual Lab Learner')
  );
  const [trackFocus, setTrackFocus] = useState<string>(() =>
    storage.getItem<string>('certificate_track_focus', CERTIFICATE_TRACK_OPTIONS[0])
  );
  const [pdfTheme, setPdfTheme] = useState<CertificatePdfTheme>('ivory');
  const [includeTranscript, setIncludeTranscript] = useState<boolean>(true);
  const [exportStatus, setExportStatus] = useState<{
    filename: string;
    pageCount: number;
    timestamp: string;
  } | null>(null);

  const handleNameChange = (value: string) => {
    setRecipientName(value);
    storage.setItem('certificate_recipient_name', value);
  };

  const handleTrackChange = (value: string) => {
    setTrackFocus(value);
    storage.setItem('certificate_track_focus', value);
  };

  const summary = useMemo(
    () => buildCertificateSummary(progress, recipientName, trackFocus),
    [progress, recipientName, trackFocus]
  );

  const handleExportPdf = () => {
    const result = downloadCertificatePdf(summary, {
      theme: pdfTheme,
      includeTranscript,
    });
    setExportStatus({
      filename: result.filename,
      pageCount: result.pageCount,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-app)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header & Primary Export Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
              <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-main)]">
                Completion Certificate &amp; 30-Day Transcript
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Personalize your credential and export a multi-page PDF summarizing your verified progress across Days 1–30.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigateTo('roadmap')}
              className="min-h-[42px] px-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] text-[var(--text-main)] text-xs font-semibold transition-colors whitespace-nowrap"
            >
              30-Day Roadmap
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              className="min-h-[42px] flex items-center gap-2 px-5 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shadow-sm"
            >
              <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Export PDF Certificate</span>
            </button>
          </div>
        </div>

        {/* Inline Export Feedback Banner */}
        {exportStatus && (
          <div
            role="status"
            className="rounded-xl border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-main)]"
          >
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] shrink-0" aria-hidden="true" />
              <span>
                Downloaded <span className="font-mono">{exportStatus.filename}</span> ({exportStatus.pageCount}{' '}
                {exportStatus.pageCount === 1 ? 'page' : 'pages'}) at {exportStatus.timestamp}
              </span>
            </div>
            <span className="font-mono text-[var(--text-muted)]">{summary.certificateId}</span>
          </div>
        )}

        {/* Top Configuration + Live Certificate Preview Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Personalization Form */}
          <section
            aria-label="Certificate customization options"
            className="lg:col-span-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
              <User className="w-4 h-4 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
              <h2 className="text-sm font-bold text-[var(--text-main)]">Personalize Credential</h2>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="certificate-recipient-input"
                className="block text-xs font-semibold text-[var(--text-main)]"
              >
                Recipient Full Name
              </label>
              <input
                id="certificate-recipient-input"
                type="text"
                maxLength={48}
                value={recipientName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter your full name"
                className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] text-sm text-[var(--text-main)] placeholder:text-[var(--text-dim)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="certificate-track-select"
                className="block text-xs font-semibold text-[var(--text-main)]"
              >
                Specialization Track
              </label>
              <select
                id="certificate-track-select"
                value={trackFocus}
                onChange={(e) => handleTrackChange(e.target.value)}
                className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] text-xs font-medium text-[var(--text-main)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              >
                {CERTIFICATE_TRACK_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-semibold text-[var(--text-main)]">
                PDF Paper Style
              </span>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="PDF paper style">
                <button
                  type="button"
                  aria-pressed={pdfTheme === 'ivory'}
                  onClick={() => setPdfTheme('ivory')}
                  className={`min-h-[40px] px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${
                    pdfTheme === 'ivory'
                      ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] border-[var(--accent-primary)]'
                      : 'bg-[var(--bg-app)] text-[var(--text-main)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  Academic Ivory
                </button>
                <button
                  type="button"
                  aria-pressed={pdfTheme === 'midnight'}
                  onClick={() => setPdfTheme('midnight')}
                  className={`min-h-[40px] px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${
                    pdfTheme === 'midnight'
                      ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] border-[var(--accent-primary)]'
                      : 'bg-[var(--bg-app)] text-[var(--text-main)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  Midnight Navy
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 min-h-[40px] px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] cursor-pointer text-xs text-[var(--text-main)]">
              <input
                type="checkbox"
                checked={includeTranscript}
                onChange={(e) => setIncludeTranscript(e.target.checked)}
                className="w-4 h-4 accent-[var(--accent-primary)]"
              />
              <span>Include Page 2: 30-Day Detailed Transcript</span>
            </label>

            <div className="pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)] space-y-1">
              <div className="flex justify-between">
                <span>Credential ID</span>
                <span className="font-mono text-[var(--text-main)] tabular-nums">
                  {summary.certificateId}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Date Issued</span>
                <span className="text-[var(--text-main)]">{summary.issuedDateFormatted}</span>
              </div>
            </div>
          </section>

          {/* Live Certificate Preview Card */}
          <section
            aria-label="Certificate preview"
            className={`lg:col-span-8 rounded-2xl border-2 p-6 sm:p-8 space-y-6 transition-colors ${
              pdfTheme === 'ivory'
                ? 'bg-[#fcfaf4] text-[#0f172a] border-[#0f172a]'
                : 'bg-[#090d16] text-[#f8fafc] border-[#38bdf8]'
            }`}
          >
            <div
              className={`border p-5 sm:p-7 space-y-5 text-center ${
                pdfTheme === 'ivory' ? 'border-[#b4862c]' : 'border-[#d4a853]'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`px-3 py-1 rounded font-mono text-xs font-extrabold ${
                    pdfTheme === 'ivory'
                      ? 'bg-[#0284c7] text-white'
                      : 'bg-[#38bdf8] text-[#090d16]'
                  }`}
                >
                  Py · Python Visual Lab
                </div>
                <div
                  className={`text-[11px] font-bold tracking-widest uppercase ${
                    pdfTheme === 'ivory' ? 'text-[#0284c7]' : 'text-[#38bdf8]'
                  }`}
                >
                  30 Days of Visual Mastery
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold font-serif">
                  {summary.isFullCompletion
                    ? 'Certificate of Completion'
                    : 'Certificate of Progress & Achievement'}
                </h2>
                <p
                  className={`text-xs tracking-wider uppercase ${
                    pdfTheme === 'ivory' ? 'text-[#475569]' : 'text-[#94a3b8]'
                  }`}
                >
                  This credential certifies that
                </p>
                <div
                  className={`text-2xl sm:text-4xl font-bold font-serif italic pt-1 pb-2 border-b max-w-md mx-auto ${
                    pdfTheme === 'ivory' ? 'border-[#b4862c]' : 'border-[#d4a853]'
                  }`}
                >
                  {summary.recipientName}
                </div>
              </div>

              <p
                className={`text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed ${
                  pdfTheme === 'ivory' ? 'text-[#334155]' : 'text-[#cbd5e1]'
                }`}
              >
                {summary.isFullCompletion
                  ? 'has successfully completed all 30 days of interactive Python Visual Lab instruction,'
                  : `has completed ${summary.daysCompleted} of ${summary.daysTotal} days (${summary.overallCompletionPercentage}% curriculum mastery) in Python Visual Lab,`}{' '}
                focusing on <span className="font-semibold">{summary.trackFocus}</span> across
                foundations, OOP, data science, Flask, MongoDB, and REST APIs.
              </p>

              {/* 4 Certificate Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-1">
                <div
                  className={`rounded-lg border p-3 ${
                    pdfTheme === 'ivory'
                      ? 'bg-white border-[#cbd5e1]'
                      : 'bg-[#111827] border-[#334155]'
                  }`}
                >
                  <div
                    className={`text-[10px] font-bold uppercase ${
                      pdfTheme === 'ivory' ? 'text-[#475569]' : 'text-[#94a3b8]'
                    }`}
                  >
                    Days Completed
                  </div>
                  <div className="text-lg font-extrabold tabular-nums mt-0.5">
                    {summary.daysCompleted} / {summary.daysTotal}
                  </div>
                </div>
                <div
                  className={`rounded-lg border p-3 ${
                    pdfTheme === 'ivory'
                      ? 'bg-white border-[#cbd5e1]'
                      : 'bg-[#111827] border-[#334155]'
                  }`}
                >
                  <div
                    className={`text-[10px] font-bold uppercase ${
                      pdfTheme === 'ivory' ? 'text-[#475569]' : 'text-[#94a3b8]'
                    }`}
                  >
                    Subtopics
                  </div>
                  <div className="text-lg font-extrabold tabular-nums mt-0.5">
                    {summary.subtopicsCompleted} / {summary.subtopicsTotal}
                  </div>
                </div>
                <div
                  className={`rounded-lg border p-3 ${
                    pdfTheme === 'ivory'
                      ? 'bg-white border-[#cbd5e1]'
                      : 'bg-[#111827] border-[#334155]'
                  }`}
                >
                  <div
                    className={`text-[10px] font-bold uppercase ${
                      pdfTheme === 'ivory' ? 'text-[#475569]' : 'text-[#94a3b8]'
                    }`}
                  >
                    Exercises
                  </div>
                  <div className="text-lg font-extrabold tabular-nums mt-0.5">
                    {summary.exercisesCompleted} / {summary.exercisesTotal}
                  </div>
                </div>
                <div
                  className={`rounded-lg border p-3 ${
                    pdfTheme === 'ivory'
                      ? 'bg-white border-[#cbd5e1]'
                      : 'bg-[#111827] border-[#334155]'
                  }`}
                >
                  <div
                    className={`text-[10px] font-bold uppercase ${
                      pdfTheme === 'ivory' ? 'text-[#475569]' : 'text-[#94a3b8]'
                    }`}
                  >
                    Quiz Avg
                  </div>
                  <div className="text-lg font-extrabold tabular-nums mt-0.5">
                    {summary.averageQuizScore !== null ? `${summary.averageQuizScore}%` : '—'}
                  </div>
                </div>
              </div>

              <div
                className={`flex flex-wrap items-center justify-between gap-3 pt-4 border-t text-xs ${
                  pdfTheme === 'ivory'
                    ? 'border-[#cbd5e1] text-[#475569]'
                    : 'border-[#334155] text-[#94a3b8]'
                }`}
              >
                <span>Issued {summary.issuedDateFormatted}</span>
                <span>{summary.streakDays}-day streak</span>
                <span className="font-mono">{summary.certificateId}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Level Breakdown Cards */}
        <section aria-label="Curriculum stage summary" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summary.levelBreakdown.map((lvl) => (
            <div
              key={lvl.level}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
                  <h3 className="text-sm font-bold text-[var(--text-main)]">{lvl.label}</h3>
                </div>
                <span className="text-xs font-mono text-[var(--text-muted)]">{lvl.dayRange}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                <div className="rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] p-2">
                  <div className="text-[10px] text-[var(--text-dim)]">Days</div>
                  <div className="font-bold text-[var(--text-main)] tabular-nums">
                    {lvl.daysCompleted}/{lvl.daysTotal}
                  </div>
                </div>
                <div className="rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] p-2">
                  <div className="text-[10px] text-[var(--text-dim)]">Subtopics</div>
                  <div className="font-bold text-[var(--text-main)] tabular-nums">
                    {lvl.subtopicsCompleted}/{lvl.subtopicsTotal}
                  </div>
                </div>
                <div className="rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] p-2">
                  <div className="text-[10px] text-[var(--text-dim)]">Exercises</div>
                  <div className="font-bold text-[var(--text-main)] tabular-nums">
                    {lvl.exercisesCompleted}/{lvl.exercisesTotal}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Full 30-Day Transcript Preview */}
        <section
          aria-label="30-day progress transcript"
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
              <h2 className="text-sm font-bold text-[var(--text-main)]">
                Detailed 30-Day Progress Summary
              </h2>
            </div>
            <span className="text-xs text-[var(--text-muted)] tabular-nums">
              {summary.daysCompleted}/30 Days Completed · {summary.subtopicsCompleted}/{summary.subtopicsTotal} Subtopics
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)]">
                  <th className="py-2.5 px-4 font-semibold">Day</th>
                  <th className="py-2.5 px-4 font-semibold">Module Title</th>
                  <th className="py-2.5 px-4 font-semibold">Stage</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Subtopics</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Exercises</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Quiz</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Status</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {summary.days.map((row) => (
                  <tr
                    key={row.day}
                    className="hover:bg-[var(--bg-app)]/60 transition-colors"
                  >
                    <td className="py-2.5 px-4 font-mono font-bold text-[var(--accent-primary)] tabular-nums">
                      Day {row.day.toString().padStart(2, '0')}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-[var(--text-main)]">
                      {row.title}
                    </td>
                    <td className="py-2.5 px-4 capitalize text-[var(--text-muted)]">
                      {row.level}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[var(--text-main)]">
                      {row.subtopicsCompleted}/{row.subtopicsTotal}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[var(--text-muted)]">
                      {row.exercisesCompleted}/{row.exercisesTotal}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[var(--text-main)]">
                      {row.quizScore !== null ? `${row.quizScore}%` : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-semibold">
                      {row.status === 'completed' ? (
                        <span className="text-[var(--color-success)]">Completed</span>
                      ) : row.status === 'in-progress' ? (
                        <span className="text-[var(--accent-primary)]">In Progress</span>
                      ) : (
                        <span className="text-[var(--text-dim)]">Pending</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => selectDay(row.day)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-primary)] hover:underline whitespace-nowrap"
                      >
                        <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};
