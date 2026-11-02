/**
 * Variables & Memory Inspector Panel
 * Section 8.3: Live names bound to objects, friendly object IDs, types, values, and mutability.
 */

import React from 'react';
import { Layers, ArrowRight, Box } from 'lucide-react';
import { usePythonRuntime } from './runtimeContext';
import { DATA_TYPES } from '../../design/tokens';

export const VariablesPanel: React.FC = () => {
  const { activeTraceStep, traceResult } = usePythonRuntime();

  const variables = activeTraceStep?.variables || {};
  const varEntries = Object.entries(variables);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)] font-mono text-xs">
      <div className="px-3 py-1.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] flex items-center justify-between text-[11px] text-[var(--text-dim)] shrink-0">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          <span>OBJECT NAMESPACE &amp; MEMORY BINDINGS</span>
        </div>
        <span className="text-[10px]">
          Scope: {activeTraceStep?.scope || 'global'}
        </span>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {varEntries.length === 0 ? (
          <div className="py-6 text-center text-[var(--text-dim)] italic">
            No variables currently in scope. Click "Step" or "Trace" to inspect memory binding.
          </div>
        ) : (
          varEntries.map(([name, varObj]) => {
            const dt = DATA_TYPES[varObj.type] || {
              color: 'var(--accent-primary)',
              symbol: '•',
              mutable: varObj.isMutable,
            };

            return (
              <div
                key={name}
                className="p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col gap-1.5 hover:border-[var(--border-strong)] transition-colors shadow-xs"
              >
                {/* Identifier Name -> Object ID */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[var(--syntax-keyword)]">{name}</span>
                    <ArrowRight className="w-3 h-3 text-[var(--text-dim)]" />
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-[var(--bg-app)] text-[var(--text-dim)] border border-[var(--border-subtle)]">
                      #obj-{varObj.objectId}
                    </span>
                  </div>

                  {/* Type badge */}
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold border"
                    style={{
                      backgroundColor: `${dt.color}15`,
                      borderColor: `${dt.color}35`,
                      color: dt.color,
                    }}
                  >
                    {dt.symbol} {varObj.type}
                  </span>
                </div>

                {/* Representation & Mutability Indicator */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--border-subtle)]/50">
                  <span className="text-[var(--text-main)] truncate max-w-[220px]">
                    {varObj.repr}
                  </span>
                  <span className="text-[10px] text-[var(--text-dim)] shrink-0">
                    {dt.mutable ? 'mutable' : 'immutable'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
