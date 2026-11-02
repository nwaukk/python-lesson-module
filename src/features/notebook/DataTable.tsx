/**
 * Notebook Lab Interactive Data Table Component
 * Section 3.4, 24 & 25: Column types, distribution summaries,
 * interactive sorting, filtering, pagination, and local CSV export.
 */

import React, { useState, useMemo } from 'react';
import {
  Download,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  BarChart2,
  Table,
  Sparkles,
} from 'lucide-react';

export interface ColumnDef {
  key: string;
  label: string;
  type: 'str' | 'int' | 'float' | 'bool';
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  columns: ColumnDef[];
  rows: Record<string, any>[];
}

export const SAMPLE_DATASETS: Dataset[] = [
  {
    id: 'waec-scores',
    name: 'WAEC Lagos Student Exam Scores',
    description: 'Mathematics and Science scores across high school candidates in Lagos State.',
    columns: [
      { key: 'studentId', label: 'Student ID', type: 'str' },
      { key: 'name', label: 'Candidate Name', type: 'str' },
      { key: 'gender', label: 'Gender', type: 'str' },
      { key: 'mathScore', label: 'Mathematics', type: 'int' },
      { key: 'physicsScore', label: 'Physics', type: 'int' },
      { key: 'grade', label: 'Letter Grade', type: 'str' },
    ],
    rows: [
      { studentId: 'WAEC-01', name: 'Amina Bello', gender: 'F', mathScore: 92, physicsScore: 88, grade: 'A1' },
      { studentId: 'WAEC-02', name: 'Chukwudi Okafor', gender: 'M', mathScore: 78, physicsScore: 82, grade: 'B2' },
      { studentId: 'WAEC-03', name: 'Emeka Nwosu', gender: 'M', mathScore: 64, physicsScore: 70, grade: 'C4' },
      { studentId: 'WAEC-04', name: 'Folake Adeyemi', gender: 'F', mathScore: 89, physicsScore: 94, grade: 'A1' },
      { studentId: 'WAEC-05', name: 'Zainab Danjuma', gender: 'F', mathScore: 85, physicsScore: 79, grade: 'B3' },
      { studentId: 'WAEC-06', name: 'Babajide Sanwo', gender: 'M', mathScore: 72, physicsScore: 68, grade: 'B3' },
      { studentId: 'WAEC-07', name: 'Ngozi Okonjo', gender: 'F', mathScore: 96, physicsScore: 98, grade: 'A1' },
      { studentId: 'WAEC-08', name: 'Tunde Bakare', gender: 'M', mathScore: 58, physicsScore: 62, grade: 'C5' },
    ],
  },
  {
    id: 'lagos-market',
    name: 'Mile 12 Market Prices (Naira)',
    description: 'Weekly commodity prices per standard measure in Lagos food terminals.',
    columns: [
      { key: 'item', label: 'Commodity', type: 'str' },
      { key: 'category', label: 'Category', type: 'str' },
      { key: 'priceNaira', label: 'Price (NGN)', type: 'int' },
      { key: 'stockQuantity', label: 'Bags Available', type: 'int' },
      { key: 'inStock', label: 'In Stock', type: 'bool' },
    ],
    rows: [
      { item: 'Rice (50kg Bag)', category: 'Grain', priceNaira: 78000, stockQuantity: 120, inStock: true },
      { item: 'Beans (Oloyin)', category: 'Legume', priceNaira: 65000, stockQuantity: 45, inStock: true },
      { item: 'Garri (White, 50kg)', category: 'Root', priceNaira: 32000, stockQuantity: 80, inStock: true },
      { item: 'Yam Tubers (Per 100)', category: 'Root', priceNaira: 145000, stockQuantity: 15, inStock: true },
      { item: 'Palm Oil (25L Jerrycan)', category: 'Oil', priceNaira: 42000, stockQuantity: 60, inStock: true },
      { item: 'Fresh Tomatoes (Basket)', category: 'Vegetable', priceNaira: 28000, stockQuantity: 0, inStock: false },
    ],
  },
];

interface Props {
  initialDatasetId?: string;
}

export const DataTable: React.FC<Props> = ({ initialDatasetId = 'waec-scores' }) => {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(initialDatasetId);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  const dataset = SAMPLE_DATASETS.find((d) => d.id === selectedDatasetId) || SAMPLE_DATASETS[0];

  // Column Summary Statistics
  const columnSummaries = useMemo(() => {
    const summaries: Record<
      string,
      { min?: number; max?: number; avg?: number; uniqueCount?: number }
    > = {};

    dataset.columns.forEach((col) => {
      if (col.type === 'int' || col.type === 'float') {
        const values = dataset.rows
          .map((r) => Number(r[col.key]))
          .filter((v) => !isNaN(v));
        if (values.length > 0) {
          const min = Math.min(...values);
          const max = Math.max(...values);
          const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
          summaries[col.key] = { min, max, avg };
        }
      } else {
        const unique = new Set(dataset.rows.map((r) => String(r[col.key]))).size;
        summaries[col.key] = { uniqueCount: unique };
      }
    });

    return summaries;
  }, [dataset]);

  // Sorting
  const handleSort = (colKey: string) => {
    if (sortKey === colKey) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(colKey);
      setSortOrder('asc');
    }
  };

  // Filtered & Sorted Rows
  const processedRows = useMemo(() => {
    let rows = [...dataset.rows];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter((r) =>
        Object.values(r).some((v) => String(v).toLowerCase().includes(q))
      );
    }

    if (sortKey) {
      rows.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }
        return sortOrder === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return rows;
  }, [dataset.rows, searchQuery, sortKey, sortOrder]);

  const totalPages = Math.ceil(processedRows.length / pageSize) || 1;
  const paginatedRows = processedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Local Client-side CSV Export
  const handleDownloadCsv = () => {
    const headers = dataset.columns.map((c) => c.label).join(',');
    const rows = processedRows.map((r) =>
      dataset.columns.map((c) => JSON.stringify(r[c.key] ?? '')).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${dataset.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5 space-y-4 shadow-xs">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-[var(--accent-primary)]" />
          <select
            value={selectedDatasetId}
            onChange={(e) => {
              setSelectedDatasetId(e.target.value);
              setCurrentPage(1);
              setSortKey(null);
            }}
            className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] text-xs font-bold text-[var(--text-main)]"
          >
            {SAMPLE_DATASETS.map((ds) => (
              <option key={ds.id} value={ds.id}>
                {ds.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[var(--text-dim)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search table..."
              className="pl-8 pr-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] text-xs text-[var(--text-main)] focus:ring-1 focus:ring-[var(--accent-primary)] w-36 sm:w-48"
            />
          </div>

          {/* CSV Download Button */}
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-[var(--accent-primary)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            title="Download CSV file (runs client-side)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      <p className="text-[11px] text-[var(--text-dim)]">{dataset.description}</p>

      {/* Main Table View */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)]">
        <table className="w-full text-left border-collapse text-xs font-mono">
          {/* Table Header with Data Type Badges & Sort Buttons */}
          <thead>
            <tr className="bg-[var(--bg-surface-elevated)] border-b border-[var(--border-subtle)]">
              {dataset.columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="p-3 font-semibold text-[var(--text-main)] cursor-pointer hover:bg-[var(--border-subtle)] transition-colors select-none"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-sans">{col.label}</span>
                        <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-black/30 border border-white/5 text-[var(--text-dim)]">
                          {col.type}
                        </span>
                      </div>
                      {isSorted && (
                        sortOrder === 'asc' ? (
                          <ChevronUp className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                        )
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Data Rows */}
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {paginatedRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-[var(--bg-surface)] transition-colors">
                {dataset.columns.map((col) => {
                  const val = row[col.key];
                  const isNumeric = col.type === 'int' || col.type === 'float';
                  const summary = columnSummaries[col.key];

                  // Distribution bar percentage for numeric columns
                  const percentage =
                    isNumeric && summary?.max && summary?.max > 0
                      ? Math.min(100, Math.round((Number(val) / summary.max) * 100))
                      : 0;

                  return (
                    <td key={col.key} className="p-3 text-[var(--text-main)] relative">
                      <div className="flex items-center justify-between gap-3">
                        <span>
                          {typeof val === 'boolean'
                            ? val ? 'True' : 'False'
                            : typeof val === 'number'
                            ? val.toLocaleString()
                            : String(val)}
                        </span>

                        {isNumeric && (
                          <div className="w-12 h-1.5 rounded-full bg-[var(--border-subtle)] overflow-hidden shrink-0">
                            <div
                              className="h-full bg-[var(--accent-primary)]"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Row Footers (Section 24 requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-[10px] font-mono">
        {dataset.columns.map((col) => {
          const sum = columnSummaries[col.key];
          return (
            <div
              key={col.key}
              className="p-2 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-0.5"
            >
              <div className="font-sans font-bold text-[var(--text-dim)] truncate">{col.label}</div>
              {sum?.avg !== undefined ? (
                <div className="text-[var(--text-main)]">
                  <span>avg: {sum.avg}</span>
                  <span className="text-[var(--text-dim)] block text-[9px]">
                    [{sum.min} - {sum.max}]
                  </span>
                </div>
              ) : (
                <div className="text-[var(--text-main)]">{sum?.uniqueCount} distinct</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between text-xs text-[var(--text-dim)] pt-2 border-t border-[var(--border-subtle)] font-mono">
        <span>
          Showing {(currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, processedRows.length)} of {processedRows.length} rows
        </span>

        <div className="flex items-center gap-1 font-sans">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] disabled:opacity-30 hover:text-[var(--text-main)]"
          >
            Previous
          </button>
          <span className="px-2">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] disabled:opacity-30 hover:text-[var(--text-main)]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
