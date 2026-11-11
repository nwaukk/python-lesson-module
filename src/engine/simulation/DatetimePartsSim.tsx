/**
 * Datetime, Date & Time Component Anatomy Simulator
 * Section 14 (Day 16 Signature Simulation):
 * Visualizes datetime, date, and time objects, their attributes (.year, .month,
 * .day, .hour, .minute, .second), and .isoformat().
 */

import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface TemporalType {
  id: 'datetime' | 'date' | 'time';
  label: string;
  constructorCode: string;
  iso: string;
  attributes: { name: string; val: string }[];
  note: string;
}

const TYPES: TemporalType[] = [
  {
    id: 'datetime',
    label: 'datetime.datetime',
    constructorCode: 'dt = datetime(2026, 11, 10, 14, 30, 0)',
    iso: '2026-11-10T14:30:00',
    attributes: [
      { name: 'dt.year', val: '2026' },
      { name: 'dt.month', val: '11' },
      { name: 'dt.day', val: '10' },
      { name: 'dt.hour', val: '14' },
      { name: 'dt.minute', val: '30' },
      { name: 'dt.date()', val: 'date(2026, 11, 10)' },
    ],
    note: 'Combines both calendar date and wall-clock time in one immutable object.',
  },
  {
    id: 'date',
    label: 'datetime.date',
    constructorCode: 'd = date(2026, 11, 10)',
    iso: '2026-11-10',
    attributes: [
      { name: 'd.year', val: '2026' },
      { name: 'd.month', val: '11' },
      { name: 'd.day', val: '10' },
      { name: 'd.weekday()', val: '1 (Tuesday: Mon=0)' },
      { name: 'd.isoweekday()', val: '2 (Tuesday: Mon=1)' },
    ],
    note: 'Represents a calendar date (year, month, day) with no time-of-day or timezone.',
  },
  {
    id: 'time',
    label: 'datetime.time',
    constructorCode: 't = time(14, 30, 45)',
    iso: '14:30:45',
    attributes: [
      { name: 't.hour', val: '14' },
      { name: 't.minute', val: '30' },
      { name: 't.second', val: '45' },
      { name: 't.microsecond', val: '0' },
    ],
    note: 'Represents an idealized time of day independent of any specific calendar date.',
  },
];

export const DatetimePartsSim: React.FC = () => {
  const [typeId, setTypeId] = useState<'datetime' | 'date' | 'time'>('datetime');
  const active = TYPES.find((t) => t.id === typeId) || TYPES[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="datetime / date / time Object Anatomy" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">TEMPORAL CLASS</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Temporal Class Selector">
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={typeId === t.id}
                onClick={() => setTypeId(t.id)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors ${
                  typeId === t.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
          <pre className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--accent-primary)] overflow-x-auto">
            {active.constructorCode}
          </pre>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            {typeId === 'time' ? <Clock className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
            <span>.isoformat() -&gt; &quot;{active.iso}&quot;</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {active.attributes.map((a) => (
            <div
              key={a.name}
              className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs"
            >
              <span className="text-[var(--text-muted)]">{a.name}</span>
              <span className="font-bold text-[var(--text-main)]">{a.val}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-[var(--text-muted)] p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          {active.note}
        </p>
      </div>
    </div>
  );
};
