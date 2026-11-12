import React, { useState } from 'react';
import { Layers, ArrowRight } from 'lucide-react';

export const MongoDbAggSchemaSim: React.FC = () => {
  const [mode, setMode] = useState<'pipeline' | 'schema'>('pipeline');
  const [stage, setStage] = useState<number>(2);

  const rawOrders = [
    { region: 'EU', status: 'paid', total: 120 },
    { region: 'US', status: 'cancelled', total: 90 },
    { region: 'EU', status: 'paid', total: 80 },
    { region: 'US', status: 'paid', total: 200 },
  ];

  const matched = rawOrders.filter((o) => o.status === 'paid');
  const grouped = [
    { _id: 'EU', revenue: 200, count: 2 },
    { _id: 'US', revenue: 200, count: 1 },
  ];
  const sorted = [
    { _id: 'EU', revenue: 200, count: 2 },
    { _id: 'US', revenue: 200, count: 1 },
  ];

  const stageOutputs = [
    { label: 'Input Collection (4 docs)', data: rawOrders },
    { label: 'Stage 1: {"$match": {"status": "paid"}}', data: matched },
    { label: 'Stage 2: {"$group": {"_id": "$region", "revenue": {"$sum": "$total"}}}', data: grouped },
    { label: 'Stage 3: {"$sort": {"revenue": -1, "_id": 1}}', data: sorted },
  ];

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-panel)] p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <h4 className="text-sm font-bold text-[var(--text-main)]">
            Aggregation Pipeline &amp; Schema Design Lab
          </h4>
        </div>
        <div className="flex gap-2" role="group" aria-label="Select mode">
          <button
            type="button"
            onClick={() => setMode('pipeline')}
            aria-pressed={mode === 'pipeline'}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              mode === 'pipeline'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)]'
            }`}
          >
            Aggregation Pipeline
          </button>
          <button
            type="button"
            onClick={() => setMode('schema')}
            aria-pressed={mode === 'schema'}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              mode === 'schema'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)]'
            }`}
          >
            Embedded vs Referenced
          </button>
        </div>
      </div>

      {mode === 'pipeline' ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Pipeline stage">
            {stageOutputs.map((st, idx) => (
              <button
                key={st.label}
                type="button"
                onClick={() => setStage(idx)}
                aria-pressed={stage === idx}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  stage === idx
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                    : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)]'
                }`}
              >
                {idx === 0 ? 'Input' : `Stage ${idx}`}
              </button>
            ))}
          </div>
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 space-y-2">
            <div className="flex items-center gap-1.5 font-mono text-xs text-amber-300">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>{stageOutputs[stage].label}</span>
            </div>
            <pre className="font-mono text-xs text-[var(--text-main)] bg-[var(--bg-app)] p-2.5 rounded-md border border-[var(--border-subtle)] overflow-x-auto">
              {JSON.stringify(stageOutputs[stage].data, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 space-y-1.5">
            <div className="text-xs font-bold text-emerald-300">Embedded (1-to-Few)</div>
            <p className="text-xs text-[var(--text-muted)]">
              Store shipping addresses or order line items inside the parent document when read together and bounded (&lt;16 MB BSON limit).
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 space-y-1.5">
            <div className="text-xs font-bold text-sky-300">Referenced (1-to-Many / Unbounded)</div>
            <p className="text-xs text-[var(--text-muted)]">
              Store <code className="text-sky-300">user_id</code> references when child records grow unboundedly (e.g., millions of IoT sensor logs).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
