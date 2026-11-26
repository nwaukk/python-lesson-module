/**
 * Notebook Lab (Reactive Card Cells Environment)
 * Full implementation of Section 3.4 of the Master Specification.
 * Multi-column cell layout, left icon rail, interactive controls, and bottom status bar.
 */

import React, { useEffect, useState } from 'react';
import {
  Play,
  RotateCcw,
  Plus,
  Trash2,
  ListTree,
  Database,
  Layers,
  FileText,
  Table as TableIcon,
} from 'lucide-react';
import { DataTable } from './DataTable';
import { storage } from '../../store/storageAdapter';

interface CellData {
  id: string;
  code: string;
  output: string;
  isStale: boolean;
  status: 'idle' | 'running' | 'success' | 'error';
  controlType?: 'slider' | 'dropdown' | 'switch';
  controlValue?: number | string | boolean;
  isDataTable?: boolean;
}

interface PersistedNotebookState {
  schemaVersion: 1;
  columns: 1 | 2 | 3;
  autoRun: boolean;
  cells: CellData[];
}

const DEFAULT_NOTEBOOK_CELLS: CellData[] = [
  {
    id: 'cell-1',
    code: `# Parameter Slider: Step Count\nsteps = 15\nprint(f"Configured step count: {steps}")`,
    output: 'Configured step count: 15',
    isStale: false,
    status: 'success',
    controlType: 'slider',
    controlValue: 15,
  },
  {
    id: 'cell-2',
    code: `# Derived computation\nfactorial_estimate = 1\nfor i in range(1, steps + 1):\n    factorial_estimate *= i\nprint(f"Product pipeline result: {factorial_estimate:,}")`,
    output: 'Product pipeline result: 1,307,674,368,000',
    isStale: false,
    status: 'success',
  },
  {
    id: 'cell-3',
    code: `# Sequence transformation\nwords = ["python", "visual", "laboratory", "reactive", "notebook"]\ncapitalised = [w.capitalize() for w in words]\nprint(capitalised)`,
    output: "['Python', 'Visual', 'Laboratory', 'Reactive', 'Notebook']",
    isStale: false,
    status: 'success',
  },
];

const DEFAULT_NOTEBOOK_STATE: PersistedNotebookState = {
  schemaVersion: 1,
  columns: 2,
  autoRun: true,
  cells: DEFAULT_NOTEBOOK_CELLS,
};

export const NotebookLab: React.FC = () => {
  const [notebookState, setNotebookState] = useState<PersistedNotebookState>(() => {
    const saved = storage.getItem<PersistedNotebookState>('notebook_state', DEFAULT_NOTEBOOK_STATE);
    return {
      schemaVersion: 1,
      columns: saved.columns === 1 || saved.columns === 2 || saved.columns === 3 ? saved.columns : 2,
      autoRun: typeof saved.autoRun === 'boolean' ? saved.autoRun : true,
      cells: Array.isArray(saved.cells) && saved.cells.length > 0 ? saved.cells : DEFAULT_NOTEBOOK_CELLS,
    };
  });
  const [activeRail, setActiveRail] = useState<'outline' | 'variables' | 'datasets' | 'notes'>('outline');
  const [isRailExpanded, setIsRailExpanded] = useState(false);

  const columns = notebookState.columns;
  const autoRun = notebookState.autoRun;
  const cells = notebookState.cells;

  const setColumns = (col: 1 | 2 | 3) => {
    setNotebookState((prev) => ({ ...prev, columns: col }));
  };

  const setAutoRun = (next: boolean) => {
    setNotebookState((prev) => ({ ...prev, autoRun: next }));
  };

  const setCells = (updater: CellData[] | ((prev: CellData[]) => CellData[])) => {
    setNotebookState((prev) => ({
      ...prev,
      cells: typeof updater === 'function' ? updater(prev.cells) : updater,
    }));
  };

  useEffect(() => {
    return storage.subscribeHydration(() => {
      const hydrated = storage.getItem<PersistedNotebookState>('notebook_state', DEFAULT_NOTEBOOK_STATE);
      setNotebookState({
        schemaVersion: 1,
        columns: hydrated.columns === 1 || hydrated.columns === 2 || hydrated.columns === 3 ? hydrated.columns : 2,
        autoRun: typeof hydrated.autoRun === 'boolean' ? hydrated.autoRun : true,
        cells: Array.isArray(hydrated.cells) && hydrated.cells.length > 0 ? hydrated.cells : DEFAULT_NOTEBOOK_CELLS,
      });
    });
  }, []);

  useEffect(() => {
    storage.setItem('notebook_state', notebookState);
  }, [notebookState]);

  const handleRunCell = (id: string) => {
    setCells((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isStale: false, status: 'success' } : c
      )
    );
  };

  const handleSliderChange = (newVal: number) => {
    setCells((prev) =>
      prev.map((c) => {
        if (c.id === 'cell-1') {
          return {
            ...c,
            controlValue: newVal,
            code: `# Parameter Slider: Step Count\nsteps = ${newVal}\nprint(f"Configured step count: {steps}")`,
            output: `Configured step count: ${newVal}`,
          };
        }
        if (c.id === 'cell-2') {
          // Dependent cell marked stale or updated
          let res = 1;
          for (let i = 1; i <= newVal; i++) res *= i;
          return {
            ...c,
            isStale: !autoRun,
            output: autoRun ? `Product pipeline result: ${res.toLocaleString()}` : c.output,
          };
        }
        return c;
      })
    );
  };

  const handleAddCell = () => {
    const newId = `cell-${Date.now()}`;
    setCells((prev) => [
      ...prev,
      {
        id: newId,
        code: `# New Python cell\nx = 42\nprint(f"Calculated value: {x * 2}")`,
        output: 'Calculated value: 84',
        isStale: false,
        status: 'success',
      },
    ]);
  };

  const handleAddDataTableCell = () => {
    const newId = `table-${Date.now()}`;
    setCells((prev) => [
      ...prev,
      {
        id: newId,
        code: `# Tabular Dataset Preview\n# WAEC Candidate Scores & Mile 12 Market Prices`,
        output: 'Interactive Data Table component active.',
        isStale: false,
        status: 'success',
        isDataTable: true,
      },
    ]);
  };

  const handleDeleteCell = (id: string) => {
    setCells((prev) => prev.filter((c) => c.id !== id));
  };

  const handleResetCells = () => {
    setNotebookState(DEFAULT_NOTEBOOK_STATE);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      {/* Notebook Toolbar */}
      <div className="px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="badge-real-python px-2 py-0.5 rounded text-[10px] font-bold">
            NOTEBOOK LAB
          </span>
          <span className="text-xs font-semibold text-[var(--text-main)]">
            Reactive Cell Workspace
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Column selector */}
          <div className="flex items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] p-0.5 text-xs">
            <span className="text-[10px] text-[var(--text-dim)] px-2 font-medium">Columns:</span>
            {[1, 2, 3].map((col) => (
              <button
                key={col}
                onClick={() => setColumns(col as 1 | 2 | 3)}
                className={`px-2 py-0.5 rounded font-mono font-semibold transition-colors ${
                  columns === col
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {col}
              </button>
            ))}
          </div>

          {/* Auto-run toggle */}
          <button
            onClick={() => setAutoRun(!autoRun)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
              autoRun
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
            }`}
          >
            {autoRun ? '⚡ Auto-Run (Reactive)' : 'Manual Run'}
          </button>

          {/* Reset Cells */}
          <button
            onClick={handleResetCells}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-[var(--border-strong)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-medium transition-colors"
            title="Restore default reactive notebook cells"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Add Data Table */}
          <button
            onClick={handleAddDataTableCell}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-[var(--accent-primary)] text-[var(--text-main)] text-xs font-medium transition-colors"
            title="Insert interactive tabular dataset preview"
          >
            <TableIcon className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span className="hidden sm:inline">Add Table</span>
          </button>

          {/* Add Cell */}
          <button
            onClick={handleAddCell}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Cell</span>
          </button>
        </div>
      </div>

      {/* Workspace Body: Left Icon Rail + Cards Grid */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Narrow Left Icon Rail (Section 3.4) */}
        <aside className="w-12 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col items-center py-3 gap-2 shrink-0">
          {[
            { id: 'outline', label: 'Outline', icon: ListTree },
            { id: 'variables', label: 'Variables', icon: Layers },
            { id: 'datasets', label: 'Datasets', icon: Database },
            { id: 'notes', label: 'Notes', icon: FileText },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeRail === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveRail(item.id as typeof activeRail);
                  setIsRailExpanded(!isRailExpanded && activeRail === item.id ? false : true);
                }}
                className={`p-2 rounded-xl text-xs transition-colors ${
                  isSelected
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-subtle)]'
                }`}
                title={item.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </aside>

        {/* Collapsible Left Rail Drawer */}
        {isRailExpanded && (
          <div className="w-64 border-r border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-4 flex flex-col overflow-y-auto shrink-0 animate-in slide-in-from-left duration-150">
            <div className="flex items-center justify-between mb-3">
              <span className="eyebrow-label text-[11px] capitalize">{activeRail}</span>
              <button
                onClick={() => setIsRailExpanded(false)}
                className="text-xs text-[var(--text-dim)] hover:text-[var(--text-main)]"
              >
                Close
              </button>
            </div>
            {activeRail === 'outline' && (
              <div className="space-y-1.5 text-xs text-[var(--text-muted)]">
                {cells.map((c, i) => (
                  <div key={c.id} className="p-1.5 rounded hover:bg-[var(--border-subtle)] cursor-pointer truncate">
                    Cell {i + 1}: {c.code.split('\n')[0].replace('#', '').trim()}
                  </div>
                ))}
              </div>
            )}
            {activeRail === 'variables' && (
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono">
                  <div className="text-[var(--syntax-keyword)] font-semibold">steps</div>
                  <div className="text-[10px] text-sky-400">int = 15</div>
                </div>
                <div className="p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono">
                  <div className="text-[var(--syntax-keyword)] font-semibold">words</div>
                  <div className="text-[10px] text-pink-400">list[str] = 5 items</div>
                </div>
              </div>
            )}
            {activeRail === 'datasets' && (
              <div className="text-xs text-[var(--text-dim)]">
                Bundled datasets (CSV & JSON) available for Days 24-25.
              </div>
            )}
            {activeRail === 'notes' && (
              <div className="text-xs text-[var(--text-dim)]">
                Autosaved reactive scratchpad notes.
              </div>
            )}
          </div>
        )}

        {/* Reactive Card Cells Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div
            className={`grid gap-4 ${
              columns === 1
                ? 'grid-cols-1'
                : columns === 2
                ? 'grid-cols-1 lg:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
            }`}
          >
            {cells.map((cell, idx) => (
              <div
                key={cell.id}
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-md overflow-hidden flex flex-col transition-all hover:border-[var(--border-strong)]"
              >
                {/* Cell Header */}
                <div className="px-3.5 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-[var(--accent-primary)]">
                      [{idx + 1}]
                    </span>
                    {cell.isStale && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold">
                        Stale Output
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleRunCell(cell.id)}
                      className="p-1 rounded text-[var(--text-muted)] hover:text-emerald-400 hover:bg-[var(--border-subtle)]"
                      title="Run this cell"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                      onClick={() => handleDeleteCell(cell.id)}
                      className="p-1 rounded text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--border-subtle)]"
                      title="Delete cell"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Code Area or Interactive DataTable */}
                {cell.isDataTable ? (
                  <div className="p-3 bg-[var(--bg-app)]">
                    <DataTable />
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-black/30 font-mono text-xs border-b border-[var(--border-subtle)]">
                      <pre className="text-[var(--text-main)] whitespace-pre-wrap leading-relaxed">
                        {cell.code}
                      </pre>
                    </div>

                    {/* Interactive Controls (if present) */}
                    {cell.controlType === 'slider' && (
                      <div className="px-3.5 py-2.5 bg-[var(--bg-surface-subtle)] border-b border-[var(--border-subtle)] space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[var(--text-dim)] font-medium">Interactive Slider:</span>
                          <span className="font-mono font-bold text-[var(--accent-primary)]">
                            {cell.controlValue}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="20"
                          value={Number(cell.controlValue || 15)}
                          onChange={(e) => handleSliderChange(parseInt(e.target.value, 10))}
                          className="w-full accent-[var(--accent-primary)] cursor-pointer"
                        />
                      </div>
                    )}

                    {/* Output Area */}
                    <div className="p-3 bg-[var(--bg-app)] font-mono text-xs flex-1 flex flex-col justify-end">
                      <div className="text-[10px] text-[var(--text-dim)] mb-1">Output:</div>
                      <div className="text-emerald-400 break-all">{cell.output}</div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Status Bar (Section 3.4) */}
      <div className="px-4 py-1.5 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between text-xs text-[var(--text-dim)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-medium text-[11px]">Runtime Ready (Pyodide 3.12)</span>
          </div>
          <span>•</span>
          <span className="text-[11px]">
            Mode: {autoRun ? 'Reactive' : 'Manual'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span>Cells: {cells.length}</span>
          <span>•</span>
          <span>Errors: 0</span>
        </div>
      </div>
    </div>
  );
};
