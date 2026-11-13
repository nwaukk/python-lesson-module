import React, { useState } from 'react';
import { Compass, AlertTriangle, CheckCircle2 } from 'lucide-react';

type PhaseKey = 'foundations' | 'core' | 'applied';

interface RevisionTopic {
  days: string;
  topic: string;
  mentalModel: string;
  commonTrap: string;
  diagnosticCheck: string;
}

const PHASES: Record<PhaseKey, { label: string; summary: string; items: RevisionTopic[] }> = {
  foundations: {
    label: 'Days 1–10: Foundations',
    summary: 'Variables bind names to objects; collections differ by mutability & uniqueness; functions isolate scope.',
    items: [
      {
        days: 'Days 1–4',
        topic: 'Object Binding, Mutability & Strings',
        mentalModel: 'Names point to heap objects; strings are immutable sequences so slice/method calls return new strings.',
        commonTrap: 'Assuming a = b copies a mutable list instead of aliasing the same object.',
        diagnosticCheck: 'Use .copy() or list(b) before mutating; test a is b vs a == b.',
      },
      {
        days: 'Days 5–8',
        topic: 'Lists, Tuples, Sets & Dictionaries',
        mentalModel: 'Lists preserve order & duplicates; tuples are immutable records; sets give O(1) uniqueness; dicts map hashable keys.',
        commonTrap: 'Calling d[missing_key] cleanly instead of d.get(missing_key, default).',
        diagnosticCheck: 'Verify mutable defaults are never placed in function signatures.',
      },
      {
        days: 'Days 9–10',
        topic: 'Conditionals, Loops & Iteration Protocol',
        mentalModel: 'Early guard returns flatten nested if/else trees; for loops consume any iterable via __iter__/__next__.',
        commonTrap: 'Mutating a list while iterating over it in a for loop skips elements.',
        diagnosticCheck: 'Build a filtered list via comprehension instead of in-place .remove() inside loops.',
      },
    ],
  },
  core: {
    label: 'Days 11–20: Core Engineering',
    summary: 'Closures capture lexical scopes; OOP models state & behavior; regex, files, and packaging harden I/O.',
    items: [
      {
        days: 'Days 11–14',
        topic: 'Functions, Comprehensions & Decorators',
        mentalModel: 'Functions are first-class objects; decorators wrap behavior cleanly when paired with @functools.wraps.',
        commonTrap: 'Forgetting def foo(items=None) and using mutable default args def foo(items=[]).',
        diagnosticCheck: 'Confirm wrapper functions preserve __name__ and __doc__.',
      },
      {
        days: 'Days 15–19',
        topic: 'Errors, Datetime, Regex & File I/O',
        mentalModel: 'Catch specific exceptions, keep datetimes timezone-aware UTC, and always open files with `with open(..., encoding="utf-8")`.',
        commonTrap: 'Using naive datetime.now() or bare except: clauses that swallow KeyboardInterrupt.',
        diagnosticCheck: 'Check all JSON/CSV file handles use context managers and explicit UTF-8 encoding.',
      },
      {
        days: 'Day 20',
        topic: 'Modules, pip & Packaging Mechanics',
        mentalModel: 'Guard executable entrypoints with `if __name__ == "__main__":` so imports never trigger side effects.',
        commonTrap: 'Circular imports or shadowing stdlib modules (naming a file json.py or requests.py).',
        diagnosticCheck: 'Verify imports are clean and __all__ / pyproject.toml metadata is declared.',
      },
    ],
  },
  applied: {
    label: 'Days 21–29: Applied Systems',
    summary: 'Combine OOP, isolated venvs, NumPy/Pandas pipelines, Flask/MongoDB persistence, and resilient REST APIs.',
    items: [
      {
        days: 'Days 21–23',
        topic: 'OOP, Web Scraping & Virtual Environments',
        mentalModel: 'Compose small collaborators over deep inheritance; isolate dependencies inside `.venv` with pinned versions.',
        commonTrap: 'Respect robots.txt & rate limits when scraping; never commit venv/ or .env secrets.',
        diagnosticCheck: 'Confirm `pip freeze` dependencies come cleanly from an isolated virtual environment.',
      },
      {
        days: 'Days 24–25',
        topic: 'NumPy Vectorisation & Pandas DataFrames',
        mentalModel: 'Replace Python loops with C-level vectorised array ops and `.loc`/`.iloc` indexing without chained assignment.',
        commonTrap: 'SettingWithCopyWarning from `df[mask]["col"] = val` instead of `df.loc[mask, "col"] = val`.',
        diagnosticCheck: 'Audit missing values (.isna().sum()) and merge cardinalities before summarizing.',
      },
      {
        days: 'Days 26–29',
        topic: 'Flask, MongoDB & Production REST APIs',
        mentalModel: 'Validate input boundaries (400/422), serialize ObjectId & datetime, enforce allowlists on PATCH, and clamp pagination.',
        commonTrap: 'Retrying non-idempotent POST without Idempotency-Key or passing `isinstance(True, int)`.',
        diagnosticCheck: 'Test 404 JSON error handlers, status codes (201/204/409), and env-based secrets.',
      },
    ],
  },
};

export const CurriculumRevisionRadarSim: React.FC = () => {
  const [phase, setPhase] = useState<PhaseKey>('applied');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const activePhase = PHASES[phase];
  const item = activePhase.items[selectedIndex] || activePhase.items[0];

  const handlePhaseChange = (nextPhase: PhaseKey) => {
    setPhase(nextPhase);
    setSelectedIndex(0);
  };

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
          <h4 className="text-sm font-bold text-[var(--text-main)]">
            30-Day Curriculum Revision &amp; Weak-Spot Diagnostic
          </h4>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Curriculum phase selector">
          {(Object.keys(PHASES) as PhaseKey[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={phase === key}
              onClick={() => handlePhaseChange(key)}
              className={`min-h-[40px] px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                phase === key
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] border-[var(--accent-primary)]'
                  : 'bg-[var(--bg-app)] text-[var(--text-main)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
              }`}
            >
              {PHASES[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Topic focus selector">
        {activePhase.items.map((entry, idx) => (
          <button
            key={entry.days}
            type="button"
            aria-pressed={selectedIndex === idx}
            onClick={() => setSelectedIndex(idx)}
            className={`min-h-[40px] px-3 py-2 text-xs font-semibold rounded-lg border transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
              selectedIndex === idx
                ? 'bg-[var(--accent-subtle)] text-[var(--text-main)] border-[var(--accent-primary)]'
                : 'bg-[var(--bg-app)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)] hover:border-[var(--border-strong)]'
            }`}
          >
            {entry.days} · {entry.topic}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3.5 space-y-2">
          <div className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)] shrink-0" aria-hidden="true" />
            <span>Core Mental Model ({item.days})</span>
          </div>
          <p className="text-xs text-[var(--text-main)] leading-relaxed">{item.mentalModel}</p>
          <div className="text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
            <span className="font-semibold text-[var(--text-main)]">Diagnostic Check: </span>
            {item.diagnosticCheck}
          </div>
        </div>

        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3.5 space-y-2">
          <div className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-[var(--color-warning)] shrink-0" aria-hidden="true" />
            <span>High-Frequency Pitfall to Audit</span>
          </div>
          <p className="text-xs text-[var(--text-main)] leading-relaxed">{item.commonTrap}</p>
          <div className="text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
            {activePhase.summary}
          </div>
        </div>
      </div>
    </div>
  );
};
