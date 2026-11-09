/**
 * Truthiness Sorter Simulation Primitive
 * Section 14 (Day 9 Signature Simulation):
 * Drag/sort values into Truthy and Falsy bins and verify with Python's bool() protocol.
 */

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Sparkles, HelpCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { SimulationController } from './SimulationController';

interface ValueItem {
  id: string;
  display: string;
  type: string;
  isTruthy: boolean;
  explanation: string;
}

const INITIAL_ITEMS: ValueItem[] = [
  { id: '1', display: '0', type: 'int', isTruthy: false, explanation: 'Numeric zero is falsy according to Python truth testing protocol.' },
  { id: '2', display: '42', type: 'int', isTruthy: true, explanation: 'Any non-zero integer evaluates to True.' },
  { id: '3', display: '""', type: 'str', isTruthy: false, explanation: 'Empty string has len() == 0, hence falsy.' },
  { id: '4', display: '" "', type: 'str', isTruthy: true, explanation: 'String contains one whitespace character (len == 1), hence truthy!' },
  { id: '5', display: '"0"', type: 'str', isTruthy: true, explanation: 'Trap! "0" is a non-empty string of length 1, so bool("0") is True!' },
  { id: '6', display: '"False"', type: 'str', isTruthy: true, explanation: 'Trap! "False" is a non-empty string, not a boolean, so it evaluates to True!' },
  { id: '7', display: '[]', type: 'list', isTruthy: false, explanation: 'Empty list contains no elements (len == 0), hence falsy.' },
  { id: '8', display: '[0]', type: 'list', isTruthy: true, explanation: 'List contains one element (len == 1). Even though element is 0, the container is non-empty!' },
  { id: '9', display: '()', type: 'tuple', isTruthy: false, explanation: 'Empty tuple has len == 0, hence falsy.' },
  { id: '10', display: '(0,)', type: 'tuple', isTruthy: true, explanation: 'Single-element tuple has len == 1, hence truthy.' },
  { id: '11', display: '{}', type: 'dict', isTruthy: false, explanation: 'Empty dictionary has no key-value pairs, hence falsy.' },
  { id: '12', display: '{"k": 0}', type: 'dict', isTruthy: true, explanation: 'Non-empty dictionary with 1 pair evaluates to True.' },
  { id: '13', display: 'set()', type: 'set', isTruthy: false, explanation: 'Empty set constructed via set() is falsy.' },
  { id: '14', display: '{None}', type: 'set', isTruthy: true, explanation: 'Set contains 1 element (None), so len == 1 and bool is True.' },
  { id: '15', display: 'None', type: 'NoneType', isTruthy: false, explanation: 'The singleton None is fundamentally falsy in Python.' },
  { id: '16', display: '0.0', type: 'float', isTruthy: false, explanation: 'Floating-point zero 0.0 evaluates to False.' },
  { id: '17', display: '-1', type: 'int', isTruthy: true, explanation: 'Negative numbers are non-zero, hence bool(-1) is True.' },
  { id: '18', display: 'False', type: 'bool', isTruthy: false, explanation: 'The boolean literal False is inherently False.' },
];

export const TruthinessSorterSim: React.FC = () => {
  const [unplaced, setUnplaced] = useState<ValueItem[]>(INITIAL_ITEMS);
  const [truthyBin, setTruthyBin] = useState<ValueItem[]>([]);
  const [falsyBin, setFalsyBin] = useState<ValueItem[]>([]);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ValueItem | null>(null);

  const placeItem = (item: ValueItem, target: 'truthy' | 'falsy') => {
    setUnplaced((prev) => prev.filter((i) => i.id !== item.id));
    if (target === 'truthy') {
      setTruthyBin((prev) => [...prev.filter((i) => i.id !== item.id), item]);
      setFalsyBin((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      setFalsyBin((prev) => [...prev.filter((i) => i.id !== item.id), item]);
      setTruthyBin((prev) => prev.filter((i) => i.id !== item.id));
    }
    setIsVerified(false);
  };

  const returnToUnplaced = (item: ValueItem) => {
    setTruthyBin((prev) => prev.filter((i) => i.id !== item.id));
    setFalsyBin((prev) => prev.filter((i) => i.id !== item.id));
    setUnplaced((prev) => [...prev, item]);
    setIsVerified(false);
  };

  const handleReset = () => {
    setUnplaced(INITIAL_ITEMS);
    setTruthyBin([]);
    setFalsyBin([]);
    setIsVerified(false);
    setSelectedItem(null);
  };

  const handleAutoSolve = () => {
    setTruthyBin(INITIAL_ITEMS.filter((i) => i.isTruthy));
    setFalsyBin(INITIAL_ITEMS.filter((i) => !i.isTruthy));
    setUnplaced([]);
    setIsVerified(true);
  };

  // Evaluation stats
  const totalPlaced = truthyBin.length + falsyBin.length;
  const correctTruthy = truthyBin.filter((i) => i.isTruthy).length;
  const correctFalsy = falsyBin.filter((i) => !i.isTruthy).length;
  const totalCorrect = correctTruthy + correctFalsy;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Python Truth Value Testing & bool() Protocol Sorter"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div>
            <div className="text-xs font-bold text-[var(--text-main)]">
              Truthiness Classification Challenge
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">
              Click any value card to route it to the Truthy or Falsy container, then click Verify.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-app)] transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={() => setIsVerified(true)}
              disabled={totalPlaced === 0}
              className="px-4 py-1.5 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verify with bool()</span>
            </button>
            <button
              type="button"
              onClick={handleAutoSolve}
              className="px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold hover:bg-purple-500/20 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Show Verified Bins</span>
            </button>
          </div>
        </div>

        {/* Verification Summary Banner */}
        {isVerified && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-sans transition-all ${
              totalCorrect === totalPlaced && unplaced.length === 0
                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                : 'border-amber-500/40 bg-amber-500/15 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {totalCorrect === totalPlaced && unplaced.length === 0 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
              )}
              <div>
                <span className="font-bold">
                  Score: {totalCorrect} / {totalPlaced} Classified Correctly
                </span>
                {unplaced.length > 0 && (
                  <span className="opacity-80 ml-2">({unplaced.length} items remain unplaced)</span>
                )}
                <p className="mt-0.5 text-[11px] opacity-90">
                  {totalCorrect === totalPlaced && unplaced.length === 0
                    ? 'Perfect classification! You have fully mastered Python truth value testing: numerical zeroes and empty containers evaluate to False; non-empty containers and non-zero numbers evaluate to True.'
                    : 'Some values were misclassified. Review the red items below and see their bool() evaluations.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Unplaced Values Bank */}
        {unplaced.length > 0 && (
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="eyebrow-label text-xs">UNCLASSIFIED PYTHON VALUES ({unplaced.length})</span>
              <span className="text-[10px] text-[var(--text-dim)] font-mono">
                Click a tag then choose Truthy or Falsy
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {unplaced.map((item) => (
                <div key={item.id} className="relative group">
                  <div className="flex items-center gap-1 p-1 pl-2.5 pr-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-[var(--accent-primary)] transition-all">
                    <span className="font-mono text-xs font-bold text-[var(--text-main)]">
                      {item.display}
                    </span>
                    <span className="text-[9px] font-mono text-[var(--text-dim)] ml-1">
                      ({item.type})
                    </span>

                    <button
                      type="button"
                      onClick={() => placeItem(item, 'truthy')}
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/30 transition-colors ml-1"
                      title="Classify as Truthy"
                    >
                      +T
                    </button>
                    <button
                      type="button"
                      onClick={() => placeItem(item, 'falsy')}
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-300 hover:bg-rose-500/30 transition-colors"
                      title="Classify as Falsy"
                    >
                      +F
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* The Two Sorter Bins */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Truthy Bin */}
          <div className="p-5 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 space-y-3 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-sm text-emerald-300">
                    Truthy Bin (bool(x) == True)
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {truthyBin.length} items
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Non-empty collections, non-zero numbers, and non-empty strings.
              </p>
            </div>

            <div className="flex-1 flex flex-wrap content-start gap-2 p-3 rounded-xl bg-[var(--bg-app)] border border-emerald-500/20 min-h-[120px]">
              {truthyBin.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-xs text-[var(--text-dim)] italic">
                  No items placed in Truthy bin yet
                </div>
              ) : (
                truthyBin.map((item) => {
                  const isCorrect = item.isTruthy;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      onDoubleClick={() => returnToUnplaced(item)}
                      className={`p-2 rounded-xl border font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isVerified
                          ? isCorrect
                            ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                            : 'border-rose-500 bg-rose-500/20 text-rose-300 ring-2 ring-rose-500/50'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] hover:border-emerald-500'
                      }`}
                    >
                      <span>{item.display}</span>
                      {isVerified && (
                        isCorrect ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        )
                      )}
                    </button>
                  );
                })
              )}
            </div>

            <div className="text-[10px] text-[var(--text-dim)] text-center">
              Double-click any item to remove it back to unclassified
            </div>
          </div>

          {/* Falsy Bin */}
          <div className="p-5 rounded-2xl border-2 border-rose-500/30 bg-rose-500/5 space-y-3 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <span className="font-bold text-sm text-rose-300">
                    Falsy Bin (bool(x) == False)
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-rose-400">
                  {falsyBin.length} items
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Empty collections, zero in any numeric type, None, and False.
              </p>
            </div>

            <div className="flex-1 flex flex-wrap content-start gap-2 p-3 rounded-xl bg-[var(--bg-app)] border border-rose-500/20 min-h-[120px]">
              {falsyBin.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-xs text-[var(--text-dim)] italic">
                  No items placed in Falsy bin yet
                </div>
              ) : (
                falsyBin.map((item) => {
                  const isCorrect = !item.isTruthy;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      onDoubleClick={() => returnToUnplaced(item)}
                      className={`p-2 rounded-xl border font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isVerified
                          ? isCorrect
                            ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                            : 'border-rose-500 bg-rose-500/20 text-rose-300 ring-2 ring-rose-500/50'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] hover:border-rose-500'
                      }`}
                    >
                      <span>{item.display}</span>
                      {isVerified && (
                        isCorrect ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        )
                      )}
                    </button>
                  );
                })
              )}
            </div>

            <div className="text-[10px] text-[var(--text-dim)] text-center">
              Double-click any item to remove it back to unclassified
            </div>
          </div>
        </div>

        {/* Selected Item Inspector Panel */}
        {selectedItem && (
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="eyebrow-label text-xs">TRUTH EVALUATION INSPECTOR</span>
              <span className="font-mono text-xs text-[var(--accent-primary)] font-bold">
                bool({selectedItem.display}) === {selectedItem.isTruthy ? 'True' : 'False'}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-sm font-bold text-sky-300 shrink-0">
                {selectedItem.display}
              </div>
              <div className="text-xs text-[var(--text-muted)] leading-relaxed">
                <span className="font-semibold text-[var(--text-main)] block mb-0.5">
                  Type: <code className="font-mono text-amber-300">{selectedItem.type}</code> • Status:{' '}
                  <span className={selectedItem.isTruthy ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {selectedItem.isTruthy ? 'TRUTHY' : 'FALSY'}
                  </span>
                </span>
                {selectedItem.explanation}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
