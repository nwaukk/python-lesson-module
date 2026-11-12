import React, { useState } from 'react';
import { FileCheck2, AlertCircle, CheckCircle2 } from 'lucide-react';

type PayloadCase = 'valid' | 'missing-field' | 'bad-type' | 'bson-unserialized';

interface ValidationScenario {
  label: string;
  inputCode: string;
  status: string;
  isError: boolean;
  output: string;
  explanation: string;
}

const CASES: Record<PayloadCase, ValidationScenario> = {
  valid: {
    label: 'Valid Payload -> 201',
    inputCode: `{"name": "Nadia", "age": 24, "skills": ["Python", "SQL"]}`,
    status: '201 Created',
    isError: false,
    output: `{\n  "id": "65f1a2b3c4d5e6f708192a3b",\n  "name": "Nadia",\n  "age": 24,\n  "skills": ["Python", "SQL"],\n  "created_at": "2026-11-11T18:45:00+00:00"\n}`,
    explanation: 'All required fields pass type checks, ObjectId is cast to str, and datetime is formatted with .isoformat().',
  },
  'missing-field': {
    label: 'Missing Field -> 400',
    inputCode: `{"age": 24}`,
    status: '400 Bad Request',
    isError: true,
    output: `{\n  "error": "ValidationError",\n  "details": [\n    { "field": "name", "message": "Field is required" }\n  ]\n}`,
    explanation: 'Validate required keys before touching the database and return a structured 400 error envelope.',
  },
  'bad-type': {
    label: 'Wrong Type -> 422',
    inputCode: `{"name": "Nadia", "age": "twenty-four"}`,
    status: '422 Unprocessable Entity',
    isError: true,
    output: `{\n  "error": "ValidationError",\n  "details": [\n    { "field": "age", "message": "Expected integer >= 0" }\n  ]\n}`,
    explanation: 'Syntax is valid JSON, but semantic type validation fails (age must be int, not str) -> 422 Unprocessable Entity.',
  },
  'bson-unserialized': {
    label: 'Raw ObjectId -> TypeError',
    inputCode: `doc = {"_id": ObjectId("65f1a2b3c4d5e6f708192a3b"), "name": "Nadia"}\njson.dumps(doc)  # Forgot str(doc["_id"])!`,
    status: '500 Internal Server Error',
    isError: true,
    output: `TypeError: Object of type ObjectId is not JSON serializable`,
    explanation: 'Standard json.dumps() cannot serialize BSON ObjectId or datetime directly—always map _id to str and dates to .isoformat().',
  },
};

export const ApiValidationSerializationSim: React.FC = () => {
  const [selected, setSelected] = useState<PayloadCase>('valid');
  const scenario = CASES[selected];

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-panel)] p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-bold text-[var(--text-main)]">
            Payload Validation &amp; BSON-to-JSON Serializer
          </h4>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Validation test cases">
          {(Object.keys(CASES) as PayloadCase[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={selected === key}
              onClick={() => setSelected(key)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                selected === key
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
              }`}
            >
              {CASES[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3">
        <div className="text-xs font-semibold text-[var(--text-muted)] mb-1.5">Incoming Request / Server Document</div>
        <pre className="text-xs font-mono text-[var(--text-main)] whitespace-pre-wrap overflow-x-auto">
          {scenario.inputCode}
        </pre>
      </div>

      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[var(--text-main)] flex items-center gap-1.5">
            {scenario.isError ? (
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
            Serialization &amp; Validation Output
          </span>
          <span className={`font-mono font-bold tabular-nums ${scenario.isError ? 'text-amber-400' : 'text-emerald-400'}`}>
            {scenario.status}
          </span>
        </div>
        <pre className="text-xs font-mono text-[var(--text-main)] whitespace-pre-wrap overflow-x-auto">
          {scenario.output}
        </pre>
      </div>

      <div className="text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-2.5">
        {scenario.explanation}
      </div>
    </div>
  );
};
