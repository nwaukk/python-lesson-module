/**
 * Descriptive Statistics & Vectorised Normalization Simulator
 * Section 14 (Day 24 Signature Simulation):
 * Visualizes mean, median, mode, variance, standard deviation, and Z-score
 * vectorised normalization across balanced vs. outlier-skewed datasets.
 */

import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface StatsDataset {
  id: 'balanced' | 'outlier' | 'sensor';
  label: string;
  values: number[];
  mean: string;
  median: string;
  stdev: string;
  zScores: string;
  note: string;
}

const DATASETS: StatsDataset[] = [
  {
    id: 'balanced',
    label: 'Balanced Quiz Scores',
    values: [70, 75, 80, 85, 90],
    mean: '80.0',
    median: '80.0',
    stdev: '7.07 (population) / 7.91 (sample)',
    zScores: '[-1.41, -0.71, 0.00, 0.71, 1.41]',
    note: 'In a symmetric distribution, mean and median are equal, and Z-scores center around 0.0.',
  },
  {
    id: 'outlier',
    label: 'Outlier-Skewed Salaries',
    values: [40, 42, 45, 48, 225],
    mean: '80.0',
    median: '45.0',
    stdev: '72.55 (population)',
    zScores: '[-0.55, -0.52, -0.48, -0.44, 2.00]',
    note: 'A single extreme outlier (225) pulls the mean up to 80.0 while the median stays at 45.0—median is robust to outliers.',
  },
  {
    id: 'sensor',
    label: 'Constant Baseline Sensor',
    values: [22, 22, 22, 22, 22],
    mean: '22.0',
    median: '22.0',
    stdev: '0.00',
    zScores: '[0.0, 0.0, 0.0, 0.0, 0.0] (guard std == 0!)',
    note: 'When all values are identical, standard deviation is 0.0. Always guard against ZeroDivisionError before computing Z-scores.',
  },
];

export const VectorisedStatsSim: React.FC = () => {
  const [datasetId, setDatasetId] = useState<StatsDataset['id']>('outlier');
  const active = DATASETS.find((d) => d.id === datasetId) || DATASETS[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Descriptive Statistics & Vectorised Z-Score Lab" badge="simulation" />
      <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-5">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Dataset Profile Selector">
            {DATASETS.map((d) => (
              <button
                key={d.id}
                type="button"
                aria-pressed={datasetId === d.id}
                onClick={() => setDatasetId(d.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                  datasetId === d.id
                    ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                    : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
              <BarChart3 className="w-4 h-4" />
              <span>Summary Metrics &amp; Normalization</span>
            </div>

            <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-xs text-sky-300">
              data = {JSON.stringify(active.values)}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="text-[var(--text-muted)] font-semibold mb-1">Mean</div>
                <div className="font-mono font-bold text-[var(--text-main)]">{active.mean}</div>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="text-[var(--text-muted)] font-semibold mb-1">Median</div>
                <div className="font-mono font-bold text-emerald-400">{active.median}</div>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="text-[var(--text-muted)] font-semibold mb-1">Std Dev</div>
                <div className="font-mono font-bold text-[var(--text-main)]">{active.stdev}</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-[var(--border-subtle)] space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Vectorised Z-Scores: (x - mean) / std
              </div>
              <div className="font-mono text-xs text-emerald-300">{active.zScores}</div>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{active.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
