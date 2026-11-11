/**
 * Timezone & Timedelta Arithmetic Simulator
 * Section 14 (Day 16 Signature Simulation):
 * Visualizes UTC vs WAT (UTC+1) / EST (UTC-5) / JST (UTC+9) conversions
 * and timedelta arithmetic on aware datetimes.
 */

import React, { useState } from 'react';
import { Globe, Clock } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface TzOption {
  id: string;
  label: string;
  offsetHours: number;
  localIso: string;
  note: string;
}

const ZONES: TzOption[] = [
  {
    id: 'utc',
    label: 'UTC (UTC+00:00)',
    offsetHours: 0,
    localIso: '2026-11-10T12:00:00+00:00',
    note: 'Coordinated Universal Time — store timestamps in UTC in databases and APIs.',
  },
  {
    id: 'wat',
    label: 'WAT / Lagos (UTC+01:00)',
    offsetHours: 1,
    localIso: '2026-11-10T13:00:00+01:00',
    note: 'West Africa Time (WAT) is fixed at UTC+1 year-round (no Daylight Saving Time).',
  },
  {
    id: 'est',
    label: 'EST / New York (UTC-05:00)',
    offsetHours: -5,
    localIso: '2026-11-10T07:00:00-05:00',
    note: 'Same instant in time as 12:00 UTC, displayed 5 hours earlier.',
  },
  {
    id: 'jst',
    label: 'JST / Tokyo (UTC+09:00)',
    offsetHours: 9,
    localIso: '2026-11-10T21:00:00+09:00',
    note: 'Japan Standard Time is 9 hours ahead of UTC.',
  },
];

export const TimezoneTimedeltaSim: React.FC = () => {
  const [zoneId, setZoneId] = useState<string>('wat');
  const active = ZONES.find((z) => z.id === zoneId) || ZONES[1];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController title="Timezone-Aware Datetime & WAT Converter" badge="simulation" />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <span className="eyebrow-label text-xs">TARGET TIMEZONE</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Target Timezone Selector">
            {ZONES.map((z) => (
              <button
                key={z.id}
                type="button"
                aria-pressed={zoneId === z.id}
                onClick={() => setZoneId(z.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                  zoneId === z.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {z.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)]">
            <Globe className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>Base Instant: 2026-11-10T12:00:00+00:00 (UTC)</span>
          </div>
          <pre className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--accent-primary)] overflow-x-auto">
            {`target_tz = timezone(timedelta(hours=${active.offsetHours}))\ndt_utc.astimezone(target_tz).isoformat()`}
          </pre>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-emerald-500/30 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <Clock className="w-4 h-4" />
            <span>Converted Aware Timestamp</span>
          </div>
          <div className="font-mono text-sm font-bold text-[var(--text-main)]">{active.localIso}</div>
          <p className="text-xs text-[var(--text-muted)]">{active.note}</p>
        </div>
      </div>
    </div>
  );
};
