import React, { useState } from 'react';
import { Rocket, Award, Code2 } from 'lucide-react';

type HorizonKey = 'typing-async' | 'backend-fastapi' | 'data-ml' | 'testing-devops';

interface HorizonSpec {
  label: string;
  bridgeFrom: string;
  nextTools: string;
  snippet: string;
  milestone: string;
}

const HORIZONS: Record<HorizonKey, HorizonSpec> = {
  'typing-async': {
    label: 'Type Hints & Asyncio',
    bridgeFrom: 'Built on Days 11–18 (Functions, Decorators & Concurrency concepts)',
    nextTools: 'typing, dataclasses, mypy/pyright, asyncio, httpx',
    snippet: `from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Metric:\n    service: str\n    latency_ms: float`,
    milestone: 'Add PEP 484 type annotations and immutable dataclasses to catch bugs before runtime.',
  },
  'backend-fastapi': {
    label: 'Backend APIs & Services',
    bridgeFrom: 'Built on Days 26–29 (Flask, MongoDB & REST API Engineering)',
    nextTools: 'FastAPI, Pydantic, SQLAlchemy / Postgres, Gunicorn, Docker',
    snippet: `# Declarative schema + automatic OpenAPI docs\nclass StudentIn(BaseModel):\n    name: str\n    age: int = Field(ge=0)`,
    milestone: 'Graduate from hand-written dict validation to declarative Pydantic schemas and OpenAPI specs.',
  },
  'data-ml': {
    label: 'Data Engineering & ML',
    bridgeFrom: 'Built on Days 24–25 (NumPy Vectorisation & Pandas DataFrames)',
    nextTools: 'Polars, DuckDB, scikit-learn, Matplotlib, Jupyter',
    snippet: `# Vectorised split -> fit -> score workflow\n# X_train, X_test, y_train, y_test = train_test_split(X, y)\n# model.fit(X_train, y_train)`,
    milestone: 'Combine clean Pandas preprocessing pipelines with statistical modeling and reproducible notebooks.',
  },
  'testing-devops': {
    label: 'Testing, Packaging & CI',
    bridgeFrom: 'Built on Days 20 & 23 (pip, Modules & Virtual Environments)',
    nextTools: 'pytest, ruff, GitHub Actions, uv / pyproject.toml',
    snippet: `# .github/workflows/ci.yml core steps\n# 1. pip install -e ".[dev]"\n# 2. ruff check src tests\n# 3. pytest -q`,
    milestone: 'Automate linting, type checking, and test suites on every pull request.',
  },
};

export const FutureHorizonsRoadmapSim: React.FC = () => {
  const [horizon, setHorizon] = useState<HorizonKey>('typing-async');
  const spec = HORIZONS[horizon];

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Rocket className="w-4 h-4 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
          <h4 className="text-sm font-bold text-[var(--text-main)]">
            Post-Day-30 Python Specialization Horizons
          </h4>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Future horizon selector">
          {(Object.keys(HORIZONS) as HorizonKey[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={horizon === key}
              onClick={() => setHorizon(key)}
              className={`min-h-[40px] px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                horizon === key
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] border-[var(--accent-primary)]'
                  : 'bg-[var(--bg-app)] text-[var(--text-main)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
              }`}
            >
              {HORIZONS[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3.5 space-y-2">
          <div className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[var(--color-success)] shrink-0" aria-hidden="true" />
            <span>Curriculum Bridge &amp; Ecosystem</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">{spec.bridgeFrom}</p>
          <div className="text-xs font-mono text-[var(--text-main)] bg-[var(--bg-surface)] rounded-md p-2.5 border border-[var(--border-subtle)]">
            {spec.nextTools}
          </div>
        </div>

        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3.5 space-y-2">
          <div className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
            <span>Idiomatic Next Step Preview</span>
          </div>
          <pre className="text-xs font-mono text-[var(--text-main)] whitespace-pre-wrap overflow-x-auto">
            {spec.snippet}
          </pre>
        </div>
      </div>

      <div className="text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-2.5">
        {spec.milestone}
      </div>
    </div>
  );
};
