import React, { useState } from 'react';
import { Repeat, Layers } from 'lucide-react';

type Mode = 'idempotency-hit' | 'no-idempotency' | 'pagination';

export const ApiIdempotencyPaginationSim: React.FC = () => {
  const [mode, setMode] = useState<Mode>('idempotency-hit');
  const [page, setPage] = useState<number>(1);

  const totalItems = 14;
  const limit = 5;
  const totalPages = Math.ceil(totalItems / limit);
  const start = (page - 1) * limit + 1;
  const end = Math.min(totalItems, page * limit);

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-panel)] p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Repeat className="w-4 h-4 text-purple-400" />
          <h4 className="text-sm font-bold text-[var(--text-main)]">
            Idempotency-Key &amp; Pagination Engine
          </h4>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Idempotency and pagination modes">
          {([
            ['idempotency-hit', 'Idempotency-Key Retry'],
            ['no-idempotency', 'Missing Key (Duplicate)'],
            ['pagination', 'Offset Pagination'],
          ] as [Mode, string][]).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={mode === key}
              onClick={() => setMode(key)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                mode === key
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'pagination' ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3">
            <div className="font-mono text-xs text-[var(--text-main)]">
              GET /api/v1/orders?page={page}&amp;limit={limit}
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={page === p}
                  onClick={() => setPage(p)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                    page === p
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)]'
                  }`}
                >
                  Page {p}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-main)]">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              Paginated Envelope (Showing items {start}–{end} of {totalItems})
            </div>
            <pre className="text-xs font-mono text-[var(--text-main)] whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(
                {
                  page,
                  limit,
                  total: totalItems,
                  total_pages: totalPages,
                  has_next: page < totalPages,
                  items: Array.from({ length: end - start + 1 }, (_, i) => `order_${start + i}`),
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[var(--text-main)]">
              {mode === 'idempotency-hit'
                ? 'POST /api/v1/payments (Idempotency-Key: pay_89f1)'
                : 'POST /api/v1/payments (No Idempotency-Key)'}
            </span>
            <span className={`font-mono font-bold ${mode === 'idempotency-hit' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {mode === 'idempotency-hit' ? '1 Record Created' : '2 Duplicate Records!'}
            </span>
          </div>
          <pre className="text-xs font-mono text-[var(--text-main)] whitespace-pre-wrap overflow-x-auto">
            {mode === 'idempotency-hit'
              ? `Attempt 1: Key "pay_89f1" unseen -> Execute charge & cache {"id": "ch_101"} (201)\nAttempt 2 (Retry): Key "pay_89f1" found -> Skip charge, replay {"id": "ch_101"} (201)`
              : `Attempt 1: Execute charge -> Created {"id": "ch_101"} (201)\nAttempt 2 (Retry): No key -> Execute charge AGAIN -> Created {"id": "ch_102"} (201)`}
          </pre>
        </div>
      )}

      <div className="text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-2.5">
        {mode === 'pagination'
          ? 'Clamp page >= 1 and limit <= 100 on the server so clients cannot request millions of rows in one query.'
          : 'Storing Idempotency-Key results in Redis/DB makes POST mutations safe to retry after network timeouts.'}
      </div>
    </div>
  );
};
