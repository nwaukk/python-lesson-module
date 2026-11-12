import React, { useState } from 'react';
import { Filter, Eye } from 'lucide-react';

interface UserRecord {
  _id: string;
  name: string;
  age: number;
  role: string;
}

const COLLECTION: UserRecord[] = [
  { _id: 'id_1', name: 'Ada', age: 29, role: 'admin' },
  { _id: 'id_2', name: 'Bob', age: 21, role: 'viewer' },
  { _id: 'id_3', name: 'Clara', age: 34, role: 'analyst' },
  { _id: 'id_4', name: 'Dan', age: 25, role: 'analyst' },
];

type QueryPreset = 'all' | 'gte25' | 'in_roles' | 'and_combo';

export const MongoDbQuerySim: React.FC = () => {
  const [preset, setPreset] = useState<QueryPreset>('gte25');
  const [hideId, setHideId] = useState<boolean>(true);

  const matched = COLLECTION.filter((doc) => {
    if (preset === 'gte25') return doc.age >= 25;
    if (preset === 'in_roles') return doc.role === 'admin' || doc.role === 'analyst';
    if (preset === 'and_combo') return doc.age >= 25 && doc.role === 'analyst';
    return true;
  });

  const queryText: Record<QueryPreset, string> = {
    all: '{}',
    gte25: '{"age": {"$gte": 25}}',
    in_roles: '{"role": {"$in": ["admin", "analyst"]}}',
    and_combo: '{"age": {"$gte": 25}, "role": "analyst"}',
  };

  const projected = matched.map((d) =>
    hideId ? { name: d.name, age: d.age, role: d.role } : d
  );

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-panel)] p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-sky-400" />
          <h4 className="text-sm font-bold text-[var(--text-main)]">
            MongoDB Query Operators &amp; Projection Lab
          </h4>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Select MongoDB query filter">
          {(
            [
              ['all', 'All ({})'],
              ['gte25', '$gte: 25'],
              ['in_roles', '$in: [admin, analyst]'],
              ['and_combo', 'Implicit $and'],
            ] as [QueryPreset, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setPreset(id)}
              aria-pressed={preset === id}
              className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                preset === id
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)]'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setHideId(!hideId)}
            aria-pressed={hideId}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-semibold rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
              hideId
                ? 'bg-violet-500/20 text-violet-300 border-violet-500/50'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            _id: {hideId ? '0 (hidden)' : '1 (shown)'}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 font-mono text-xs text-[var(--text-main)]">
        db.users.find({queryText[preset]}, {hideId ? '{"_id": 0, "name": 1, "age": 1, "role": 1}' : '{}'})
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Matched Documents ({projected.length} / {COLLECTION.length})
          </div>
          <pre className="font-mono text-xs text-emerald-300 whitespace-pre-wrap bg-[var(--bg-app)] p-2.5 rounded-md border border-[var(--border-subtle)]">
            {JSON.stringify(projected, null, 2)}
          </pre>
        </div>
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Rule Notes
          </div>
          <ul className="text-xs text-[var(--text-muted)] space-y-1.5 list-disc pl-4">
            <li>Multiple keys in the same filter dict combine with an implicit <code className="text-sky-300">$and</code>.</li>
            <li>Projections cannot mix inclusion (<code className="text-sky-300">1</code>) and exclusion (<code className="text-sky-300">0</code>), except for <code className="text-sky-300">_id: 0</code>.</li>
            <li><code>find()</code> returns a lazy <strong>Cursor</strong>; iterate or wrap in <code>list(...)</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
