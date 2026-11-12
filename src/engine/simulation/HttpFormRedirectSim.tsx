import React, { useState } from 'react';
import { RefreshCw, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

export const HttpFormRedirectSim: React.FC = () => {
  const [pattern, setPattern] = useState<'prg' | 'direct'>('prg');
  const [step, setStep] = useState<number>(0);

  const prgSteps = [
    {
      label: '1. GET /contact -> 200 OK',
      detail: 'Browser loads empty HTML form from Flask GET handler.',
      dbCount: 0,
    },
    {
      label: '2. POST /contact -> 302 Found (Location: /thanks)',
      detail: 'Flask validates form["email"], saves 1 record, and responds with a 302 redirect instead of HTML.',
      dbCount: 1,
    },
    {
      label: '3. GET /thanks -> 200 OK',
      detail: 'Browser automatically follows redirect with a safe GET request.',
      dbCount: 1,
    },
    {
      label: '4. User Presses F5 (Refresh) -> GET /thanks',
      detail: 'Refreshing only repeats GET /thanks. Zero duplicate form submissions!',
      dbCount: 1,
    },
  ];

  const directSteps = [
    {
      label: '1. GET /contact -> 200 OK',
      detail: 'Browser loads empty HTML form from Flask GET handler.',
      dbCount: 0,
    },
    {
      label: '2. POST /contact -> 200 OK (Renders HTML directly)',
      detail: 'Flask saves 1 record and returns render_template("thanks.html") directly on the POST response.',
      dbCount: 1,
    },
    {
      label: '3. User Presses F5 (Refresh) -> Browser Re-sends POST!',
      detail: 'Because the last request was POST, refreshing re-submits the form and inserts a DUPLICATE record!',
      dbCount: 2,
    },
  ];

  const steps = pattern === 'prg' ? prgSteps : directSteps;
  const activeStep = steps[Math.min(step, steps.length - 1)];
  const hasDuplicate = activeStep.dbCount > 1;

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-panel)] p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-bold text-[var(--text-main)]">
            Form Handling &amp; Post / Redirect / Get (PRG) Simulator
          </h4>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Select form response pattern">
          <button
            type="button"
            onClick={() => {
              setPattern('prg');
              setStep(0);
            }}
            aria-pressed={pattern === 'prg'}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              pattern === 'prg'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)]'
            }`}
          >
            PRG Pattern (redirect + url_for)
          </button>
          <button
            type="button"
            onClick={() => {
              setPattern('direct');
              setStep(0);
            }}
            aria-pressed={pattern === 'direct'}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
              pattern === 'direct'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)]'
            }`}
          >
            Direct POST Render (Anti-pattern)
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Lifecycle step">
        {steps.map((s, idx) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setStep(idx)}
            aria-pressed={step === idx}
            className={`px-2.5 py-1.5 text-xs font-mono rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
              step === idx
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 font-bold'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
            }`}
          >
            Step {idx + 1}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--text-main)]">
            <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
            <span>{activeStep.label}</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">{activeStep.detail}</p>
        </div>
        <div
          className={`shrink-0 px-3 py-2 rounded-lg border font-mono text-xs font-bold flex items-center gap-1.5 ${
            hasDuplicate
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}
        >
          {hasDuplicate ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>DB Rows: {activeStep.dbCount}</span>
        </div>
      </div>
    </div>
  );
};
