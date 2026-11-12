import React, { useState } from 'react';
import { Database, Plus, Edit3, Trash2, Search } from 'lucide-react';

interface BsonDoc {
  _id: string;
  name: string;
  role: string;
  credits: number;
}

const INITIAL_DOCS: BsonDoc[] = [
  { _id: '65a1f0b2c1a001', name: 'Ada', role: 'analyst', credits: 120 },
  { _id: '65a1f0b2c1a002', name: 'Linus', role: 'admin', credits: 250 },
];

export const MongoDbCrudSim: React.FC = () => {
  const [docs, setDocs] = useState<BsonDoc[]>(INITIAL_DOCS);
  const [lastOp, setLastOp] = useState<string>('db.users.find({}) -> 2 documents');

  const handleInsert = () => {
    if (docs.some((d) => d.name === 'Grace')) {
      setLastOp('insert_one: Grace already exists in preview; click Reset or Delete.');
      return;
    }
    const newDoc: BsonDoc = {
      _id: '65a1f0b2c1a003',
      name: 'Grace',
      role: 'engineer',
      credits: 180,
    };
    setDocs([...docs, newDoc]);
    setLastOp(`insert_one({"name": "Grace", ...}) -> inserted_id="${newDoc._id}"`);
  };

  const handleUpdate = () => {
    setDocs(
      docs.map((d) =>
        d.name === 'Ada' ? { ...d, credits: d.credits + 50, role: 'lead' } : d
      )
    );
    setLastOp('update_one({"name": "Ada"}, {"$set": {"role": "lead"}, "$inc": {"credits": 50}}) -> matched=1, modified=1');
  };

  const handleDelete = () => {
    const existed = docs.some((d) => d.name === 'Linus');
    setDocs(docs.filter((d) => d.name !== 'Linus'));
    setLastOp(`delete_one({"name": "Linus"}) -> deleted_count=${existed ? 1 : 0}`);
  };

  const handleReset = () => {
    setDocs(INITIAL_DOCS);
    setLastOp('Collection reset to 2 initial BSON documents.');
  };

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-panel)] p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-bold text-[var(--text-main)]">
            PyMongo Collection &amp; BSON CRUD Inspector
          </h4>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="PyMongo CRUD operations">
          <button
            type="button"
            onClick={handleInsert}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border bg-emerald-500/20 text-emerald-300 border-emerald-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <Plus className="w-3.5 h-3.5" />
            insert_one
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border bg-sky-500/20 text-sky-300 border-sky-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <Edit3 className="w-3.5 h-3.5" />
            update_one ($set/$inc)
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border bg-rose-500/20 text-rose-300 border-rose-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <Trash2 className="w-3.5 h-3.5" />
            delete_one
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg border bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 flex items-center gap-2 font-mono text-xs text-emerald-300">
        <Search className="w-3.5 h-3.5 shrink-0" />
        <span className="break-all">{lastOp}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {docs.map((doc) => (
          <pre
            key={doc._id}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3 font-mono text-xs text-[var(--text-main)] overflow-x-auto"
          >
            {JSON.stringify(doc, null, 2)}
          </pre>
        ))}
      </div>
    </div>
  );
};
