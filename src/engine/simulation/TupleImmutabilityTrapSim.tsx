import React, { useState } from 'react';
import { Lock, AlertTriangle, ShieldCheck, Flame, RefreshCw, KeyRound, Terminal } from 'lucide-react';

export const TupleImmutabilityTrapSim: React.FC = () => {
  const [nestedList, setNestedList] = useState<string[]>(['"lagos"', '"abuja"']);
  const [isInnerListTuple, setIsInnerListTuple] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    type: 'success' | 'error' | 'paradox';
    message: string;
    details: string;
  } | null>(null);

  const tupleId = '0x7fff_cafe_0001';
  const innerId = '0x7fff_list_0099';

  const handleReassignSlot0 = () => {
    setLastAction('t[0] = 200');
    setLastResult({
      success: false,
      type: 'error',
      message: "TypeError: 'tuple' object does not support item assignment",
      details: 'The tuple pointer array is write-protected in memory. You cannot overwrite any of its slot pointers.',
    });
  };

  const handleAppendInner = () => {
    if (isInnerListTuple) {
      setLastAction('t[1].append("kano")');
      setLastResult({
        success: false,
        type: 'error',
        message: "AttributeError: 'tuple' object has no attribute 'append'",
        details: 'Because the inner collection is now an immutable tuple, calling append() raises AttributeError.',
      });
      return;
    }

    const city = nestedList.length === 2 ? '"kano"' : nestedList.length === 3 ? '"ibadan"' : `"${nestedList.length}"`;
    setNestedList([...nestedList, city]);
    setLastAction(`t[1].append(${city})`);
    setLastResult({
      success: true,
      type: 'success',
      message: `Success! t[1] appended ${city}. Length is now ${nestedList.length + 1}.`,
      details: `The tuple's pointer to slot 1 (${innerId}) remained unchanged. The inner list object was mutated in place at that same address!`,
    });
  };

  const handleAugmentedAssignTrap = () => {
    if (isInnerListTuple) {
      setLastAction('t[1] += ("enugu",)');
      setLastResult({
        success: false,
        type: 'error',
        message: "TypeError: 'tuple' object does not support item assignment",
        details: 'With an inner tuple, t[1] + (...) constructs a new tuple and attempts t[1] = new_tuple, which fails without mutating anything.',
      });
      return;
    }

    // The legendary CPython augmented assignment trap:
    // It actually mutates the list, and THEN raises TypeError!
    const city = '"enugu"';
    setNestedList([...nestedList, city]);
    setLastAction('t[1] += ["enugu"]');
    setLastResult({
      success: false,
      type: 'paradox',
      message: "PARADOX: TypeError: 'tuple' object does not support item assignment (YET 'enugu' WAS ADDED!)",
      details: 'CPython opcode execution: 1) INPLACE_ADD modifies the inner list in-place. 2) STORE_SUBSCR tries to write the result pointer back to t[1]. The tuple rejects the assignment and raises TypeError AFTER the list has already been mutated!',
    });
  };

  const handleHashCheck = () => {
    setLastAction('hash(t)');
    if (isInnerListTuple) {
      setLastResult({
        success: true,
        type: 'success',
        message: 'hash(t) == 8421094832019482 (Success!)',
        details: 'Because every element in the tuple (int, tuple, str) is strictly immutable, the entire tuple is hashable and can serve as a dictionary key or set element!',
      });
    } else {
      setLastResult({
        success: false,
        type: 'error',
        message: "TypeError: unhashable type: 'list'",
        details: 'A tuple is ONLY hashable if all of its constituent elements are also hashable. Because slot 1 contains a mutable list, hash(t) raises TypeError.',
      });
    }
  };

  const handleReset = () => {
    setNestedList(['"lagos"', '"abuja"']);
    setIsInnerListTuple(false);
    setLastAction(null);
    setLastResult(null);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-sm text-[var(--text-main)]">
              The Tuple Immutability &amp; Nested Mutability Inspector
            </h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Understand why tuple container identity is frozen, how nested mutable objects mutate, and why <code className="font-mono text-amber-400">t[1] += [...]</code> raises an exception yet modifies the list.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="self-start sm:self-auto px-2.5 py-1 text-xs rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Lab</span>
        </button>
      </div>

      {/* Tuple Memory Diagram */}
      <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[var(--accent-primary)]">
              t = (100, {isInnerListTuple ? `(${nestedList.join(', ')})` : `[${nestedList.join(', ')}]`}, "active")
            </span>
          </div>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            id(t) = {tupleId}
          </span>
        </div>

        {/* Pointer Slots */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Slot 0 */}
          <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-emerald-500/30 flex flex-col justify-between">
            <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono">
              <span>t[0]</span>
              <span className="text-emerald-400 font-bold">IMMUTABLE (int)</span>
            </div>
            <div className="font-mono text-base font-extrabold text-[var(--text-main)] my-2">
              100
            </div>
            <div className="text-[10px] font-mono text-[var(--text-muted)]">
              Pointer: 0x7fff_0001
            </div>
          </div>

          {/* Slot 1: Nested Collection */}
          <div
            className={`p-3 rounded-xl border flex flex-col justify-between transition-colors ${
              isInnerListTuple
                ? 'bg-emerald-500/10 border-emerald-500/40'
                : 'bg-amber-500/10 border-amber-500/40'
            }`}
          >
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[var(--text-muted)]">t[1]</span>
              <span
                className={`font-bold ${isInnerListTuple ? 'text-emerald-400' : 'text-amber-400'}`}
              >
                {isInnerListTuple ? 'IMMUTABLE (tuple)' : 'MUTABLE (list) ⚠️'}
              </span>
            </div>

            <div className="font-mono text-xs font-bold text-[var(--text-main)] my-2 truncate">
              {isInnerListTuple ? `(${nestedList.join(', ')})` : `[${nestedList.join(', ')}]`}
            </div>

            <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
              <span>Pointer: {innerId}</span>
              <span>{nestedList.length} items</span>
            </div>
          </div>

          {/* Slot 2 */}
          <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-emerald-500/30 flex flex-col justify-between">
            <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono">
              <span>t[2]</span>
              <span className="text-emerald-400 font-bold">IMMUTABLE (str)</span>
            </div>
            <div className="font-mono text-base font-extrabold text-[var(--text-main)] my-2">
              "active"
            </div>
            <div className="text-[10px] font-mono text-[var(--text-muted)]">
              Pointer: 0x7fff_0002
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
        <button
          onClick={handleReassignSlot0}
          className="p-2.5 rounded-xl bg-[var(--bg-app)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-left flex flex-col gap-1 transition-colors"
        >
          <div className="font-mono font-bold text-rose-400">1. t[0] = 200</div>
          <div className="text-[10px] text-[var(--text-muted)]">Direct slot reassignment (fails)</div>
        </button>

        <button
          onClick={handleAppendInner}
          className="p-2.5 rounded-xl bg-[var(--bg-app)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-left flex flex-col gap-1 transition-colors"
        >
          <div className="font-mono font-bold text-emerald-400">2. t[1].append(...)</div>
          <div className="text-[10px] text-[var(--text-muted)]">In-place mutation of inner container</div>
        </button>

        <button
          onClick={handleAugmentedAssignTrap}
          className="p-2.5 rounded-xl bg-[var(--bg-app)] hover:bg-[var(--bg-surface)] border border-amber-500/30 bg-amber-500/5 text-left flex flex-col gap-1 transition-colors"
        >
          <div className="font-mono font-bold text-amber-300 flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" />
            <span>3. t[1] += [...]</span>
          </div>
          <div className="text-[10px] text-[var(--text-muted)]">The augmented assignment paradox</div>
        </button>

        <button
          onClick={handleHashCheck}
          className="p-2.5 rounded-xl bg-[var(--bg-app)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-left flex flex-col gap-1 transition-colors"
        >
          <div className="font-mono font-bold text-blue-400 flex items-center gap-1">
            <KeyRound className="w-3 h-3 text-blue-400" />
            <span>4. hash(t) Check</span>
          </div>
          <div className="text-[10px] text-[var(--text-muted)]">Dictionary key eligibility test</div>
        </button>
      </div>

      {/* Toggle inner type */}
      <div className="flex items-center gap-2 pt-1 text-xs">
        <button
          onClick={() => {
            setIsInnerListTuple(!isInnerListTuple);
            setLastResult(null);
          }}
          className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
            isInnerListTuple
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          Toggle Slot 1 Type: {isInnerListTuple ? 'Immutable Tuple ()' : 'Mutable List []'}
        </button>
        <span className="text-[11px] text-[var(--text-muted)]">
          (See how hashability and mutability change when slot 1 is converted)
        </span>
      </div>

      {/* Result Card */}
      {lastResult && (
        <div
          className={`p-3.5 rounded-xl border space-y-1.5 animate-fadeIn ${
            lastResult.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : lastResult.type === 'paradox'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2 font-mono text-xs font-bold">
            <Terminal className="w-4 h-4 shrink-0" />
            <span>{lastAction}</span>
            <span className="font-sans text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/30 ml-auto">
              {lastResult.type}
            </span>
          </div>

          <div className="font-mono text-xs font-bold pl-6">
            {lastResult.message}
          </div>

          <p className="text-[11px] opacity-90 pl-6 leading-relaxed">
            {lastResult.details}
          </p>
        </div>
      )}
    </div>
  );
};
