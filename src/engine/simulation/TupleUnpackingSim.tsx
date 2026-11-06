import React, { useState } from 'react';
import { ArrowDown, Layers, Sparkles, CheckCircle2, AlertTriangle, Play, RefreshCw } from 'lucide-react';

interface Preset {
  id: string;
  name: string;
  code: string;
  sourceTuple: string[];
  targetVars: { name: string; isStarred?: boolean }[];
  explanation: string;
  isError?: boolean;
  errorMessage?: string;
}

const PRESETS: Preset[] = [
  {
    id: 'coords-1to1',
    name: '1-to-1 Exact Unpacking',
    code: 'lat, lon = (6.5244, 3.3792)',
    sourceTuple: ['6.5244', '3.3792'],
    targetVars: [{ name: 'lat' }, { name: 'lon' }],
    explanation: 'Both the tuple length (2) and variable count (2) match identically. Each value assigns directly to its corresponding target.',
  },
  {
    id: 'starred-middle',
    name: 'Starred Middle (*rest)',
    code: 'head, *middle, tail = (10, 20, 30, 40, 50)',
    sourceTuple: ['10', '20', '30', '40', '50'],
    targetVars: [{ name: 'head' }, { name: '*middle', isStarred: true }, { name: 'tail' }],
    explanation: 'head takes the first item (10), tail takes the final item (50), and *middle gathers all remaining elements into a Python list [20, 30, 40].',
  },
  {
    id: 'starred-prefix',
    name: 'Starred Prefix (*prefix, last)',
    code: '*prefix, last = ("alpha", "beta", "gamma", "delta")',
    sourceTuple: ['"alpha"', '"beta"', '"gamma"', '"delta"'],
    targetVars: [{ name: '*prefix', isStarred: true }, { name: 'last' }],
    explanation: '*prefix collects all leading items into a list ["alpha", "beta", "gamma"], while last receives the single final item "delta".',
  },
  {
    id: 'var-swap',
    name: 'Atomic Variable Swapping',
    code: 'a, b = b, a  # where a="USD", b="NGN"',
    sourceTuple: ['"NGN" (old b)', '"USD" (old a)'],
    targetVars: [{ name: 'a' }, { name: 'b' }],
    explanation: 'The right-hand side first packs ("NGN", "USD") into an anonymous tuple on the evaluation stack, then unpacks into a and b simultaneously without temporary variables.',
  },
  {
    id: 'error-too-many',
    name: 'Trap: Too Many Values',
    code: 'x, y = (100, 200, 300)',
    sourceTuple: ['100', '200', '300'],
    targetVars: [{ name: 'x' }, { name: 'y' }],
    explanation: 'Python raises ValueError because the source sequence contains 3 items, but only 2 variables are provided.',
    isError: true,
    errorMessage: 'ValueError: too many values to unpack (expected 2)',
  },
  {
    id: 'error-not-enough',
    name: 'Trap: Not Enough Values',
    code: 'x, y, z = (42,)',
    sourceTuple: ['42'],
    targetVars: [{ name: 'x' }, { name: 'y' }, { name: 'z' }],
    explanation: 'Python raises ValueError because 3 targets were expected, but the tuple only contains 1 element.',
    isError: true,
    errorMessage: 'ValueError: not enough values to unpack (expected 3, got 1)',
  },
];

export const TupleUnpackingSim: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('starred-middle');
  const [step, setStep] = useState<number>(1); // 0: packed, 1: unpacked

  const preset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    setStep(1);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[var(--accent-primary)]" />
            <h3 className="font-extrabold text-sm text-[var(--text-main)]">
              Interactive Tuple Packing &amp; Sequence Unpacking Studio
            </h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Visualize how Python maps sequence items to variables, collects residual items with starred <code className="font-mono text-emerald-400">*</code> expressions, and guards value counts.
          </p>
        </div>

        <button
          onClick={() => setStep(step === 0 ? 1 : 0)}
          className="self-start sm:self-auto px-3 py-1.5 text-xs rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] font-bold flex items-center gap-1.5 transition-colors"
        >
          {step === 0 ? <Play className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
          <span>{step === 0 ? 'Trigger Unpack' : 'Reset Packing'}</span>
        </button>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectPreset(p.id)}
            className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors ${
              selectedPresetId === p.id
                ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)]/30 text-[var(--accent-primary)] font-bold'
                : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Code Snippet Box */}
      <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-main)] flex items-center justify-between">
        <span className="text-emerald-400 font-bold">{preset.code}</span>
        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-sans">
          {preset.isError ? 'FAILS WITH EXCEPTION' : 'VALID UNPACK'}
        </span>
      </div>

      {/* Visual Unpacking Journey */}
      <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-6">
        {/* Step 1: Source Tuple */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              1. Source Sequence in Memory (Tuple)
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              Length: {preset.sourceTuple.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-mono font-bold text-[var(--text-muted)]">(</span>
            {preset.sourceTuple.map((val, idx) => (
              <div
                key={idx}
                className="px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs font-bold text-[var(--text-main)] shadow-sm flex flex-col items-center min-w-[3.5rem]"
              >
                <span>{val}</span>
                <span className="text-[9px] font-mono text-[var(--text-muted)] font-normal mt-0.5">
                  [{idx}]
                </span>
              </div>
            ))}
            <span className="text-lg font-mono font-bold text-[var(--text-muted)]">)</span>
          </div>
        </div>

        {/* Direction Arrows */}
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center text-[var(--accent-primary)]">
            <ArrowDown className="w-5 h-5 animate-bounce" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              {step === 1 ? 'Unpacking into Target Variables' : 'Packed awaiting assignment'}
            </span>
          </div>
        </div>

        {/* Step 2: Target Variables / Error Outcome */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              2. Target Variable Names &amp; Values Assigned
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              Targets: {preset.targetVars.length}
            </span>
          </div>

          {preset.isError ? (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-1 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold font-mono text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>{preset.errorMessage}</span>
              </div>
              <p className="text-[11px] text-rose-200/80 leading-relaxed pl-6">
                {preset.explanation}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {preset.targetVars.map((v, idx) => {
                let assignedVal = '';
                let valType = 'str';

                if (v.isStarred) {
                  // Starred rest collects remaining items into a list!
                  if (preset.id === 'starred-middle') {
                    assignedVal = `[${preset.sourceTuple.slice(1, -1).join(', ')}]`;
                    valType = 'list';
                  } else if (preset.id === 'starred-prefix') {
                    assignedVal = `[${preset.sourceTuple.slice(0, -1).join(', ')}]`;
                    valType = 'list';
                  }
                } else if (idx === 0) {
                  assignedVal = preset.sourceTuple[0];
                } else if (idx === preset.targetVars.length - 1) {
                  assignedVal = preset.sourceTuple[preset.sourceTuple.length - 1];
                } else {
                  assignedVal = preset.sourceTuple[idx];
                }

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                      v.isStarred
                        ? 'bg-emerald-500/10 border-emerald-500/40'
                        : 'bg-[var(--bg-surface)] border-[var(--border-subtle)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[var(--text-main)]">
                        {v.name}
                      </span>
                      {v.isStarred ? (
                        <span className="text-[10px] font-mono font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/20">
                          LIST (starred)
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          SCALAR
                        </span>
                      )}
                    </div>

                    <div className="font-mono text-sm font-extrabold text-[var(--accent-primary)] my-2 truncate">
                      {step === 1 ? assignedVal : '...'}
                    </div>

                    <div className="text-[10px] text-[var(--text-muted)] font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{v.isStarred ? 'Gathers rest into list' : 'Exact match assigned'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Explanatory Note */}
      <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] leading-relaxed">
        <strong className="text-[var(--text-main)]">Key Insight:</strong> Sequence unpacking works identically across tuples, lists, and strings. However, tuples are the default syntax representation: omitting parentheses in <code className="font-mono text-emerald-400">x, y = 1, 2</code> implicitly packs a tuple <code className="font-mono text-emerald-400">(1, 2)</code> on the right before unpacking into <code className="font-mono">x</code> and <code className="font-mono">y</code>.
      </div>
    </div>
  );
};
