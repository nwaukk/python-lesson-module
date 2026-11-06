/**
 * True In-Place Mutability vs String Immutability Simulator
 * Demonstrates how Python list items can be mutated in-place while keeping the list's
 * memory address (id()) strictly constant, compared to strings where any modification
 * requires allocating a new object in memory.
 */

import React, { useState } from 'react';
import { SimulationController } from './SimulationController';
import { AlertCircle, CheckCircle2, RefreshCw, Edit3, ArrowRight, Layers, ShieldAlert } from 'lucide-react';

export const ListMutabilitySim: React.FC = () => {
  const [listId] = useState('0x7f88d400');
  const [stringId, setStringId] = useState('0x7f11c200');
  const [stringValue, setStringValue] = useState('Lagos');
  const [stringAttemptError, setStringAttemptError] = useState<string | null>(null);

  const [listItems, setListItems] = useState([
    { index: 0, value: "'Lekki'", id: '0x7f2001' },
    { index: 1, value: "'Ikeja'", id: '0x7f2002' },
    { index: 2, value: "'Yaba'", id: '0x7f2003' },
  ]);

  const [selectedSlot, setSelectedSlot] = useState<number>(0);
  const [newValueInput, setNewValueInput] = useState("'Victoria Island'");
  const [mutationCount, setMutationCount] = useState(0);

  const handleMutateListSlot = () => {
    const trimmed = newValueInput.trim() || `'Updated_${selectedSlot}'`;
    const newItems = [...listItems];
    const newAddress = `0x7f${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;

    newItems[selectedSlot] = {
      ...newItems[selectedSlot],
      value: trimmed,
      id: newAddress,
    };

    setListItems(newItems);
    setMutationCount((c) => c + 1);
  };

  const handleAttemptStringMutation = () => {
    setStringAttemptError("TypeError: 'str' object does not support item assignment");
  };

  const handleRecreateString = () => {
    const newAddress = `0x7f${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;
    setStringId(newAddress);
    setStringValue((prev) => (prev === 'Lagos' ? 'Kanos' : 'Lagos'));
    setStringAttemptError(null);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="List Mutability Lab: In-Place Mutation vs String Immutability"
        badge="simulation"
      />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 max-w-5xl mx-auto w-full">
        {/* Core Pedagogical Header */}
        <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[var(--accent-primary)]" />
            <h2 className="text-sm font-bold text-[var(--text-main)]">
              Pointer Container vs Primitive Immutable Sequences
            </h2>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            In Python, a <code className="text-purple-300 font-mono">list</code> is a mutable container of pointers.
            Reassigning an element (<code className="text-[var(--accent-primary)] font-mono">my_list[i] = val</code>)
            swaps only the pointer reference at that slot; the list container retains the <strong>exact same memory address</strong> (<code className="text-amber-300 font-mono">id(my_list)</code>).
            In contrast, a <code className="text-sky-300 font-mono">str</code> is strictly immutable; attempting item assignment raises a fatal <code className="text-red-400 font-mono">TypeError</code>!
          </p>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* LEFT: List True In-Place Mutability */}
          <div className="p-4 sm:p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Python List: True In-Place Mutability
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--bg-app)] border border-emerald-500/30 text-emerald-300 font-bold">
                  id(cities): {listId}
                </span>
              </div>

              {/* Slot Cards */}
              <div className="space-y-2">
                <div className="text-[11px] text-[var(--text-dim)]">
                  Click a slot to inspect and modify its value in-place:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {listItems.map((slot) => {
                    const isSelected = selectedSlot === slot.index;
                    return (
                      <button
                        key={slot.index}
                        onClick={() => {
                          setSelectedSlot(slot.index);
                          setNewValueInput(slot.value);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-500/15 shadow-sm'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-emerald-500/40'
                        }`}
                      >
                        <div className="text-[10px] font-mono text-[var(--text-dim)]">[{slot.index}]</div>
                        <div className="font-mono text-xs font-bold text-[var(--text-main)] truncate my-1">
                          {slot.value}
                        </div>
                        <div className="text-[10px] font-mono text-emerald-400/80 truncate">
                          ptr: {slot.id}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mutation Control */}
              <div className="mt-4 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
                <div className="text-[11px] font-semibold text-[var(--text-muted)] flex items-center justify-between">
                  <span>Mutate cities[{selectedSlot}] In-Place</span>
                  <span className="text-[10px] font-mono text-[var(--text-dim)]">
                    Mutations: {mutationCount}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newValueInput}
                    onChange={(e) => setNewValueInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] font-mono text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                  <button
                    onClick={handleMutateListSlot}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Assign</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-emerald-500/20 text-xs text-emerald-300/90 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Container Address Intact
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                The list at <code className="text-emerald-300 font-mono">{listId}</code> was mutated {mutationCount} times.
                Its memory address never changed. Only slot [{selectedSlot}] now points to a new value.
              </p>
            </div>
          </div>

          {/* RIGHT: String Immutability Trap */}
          <div className="p-4 sm:p-5 rounded-2xl border border-red-500/30 bg-red-500/5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  Python String: Strict Immutability
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--bg-app)] border border-red-500/30 text-red-300 font-bold">
                  id(city): {stringId}
                </span>
              </div>

              {/* String Character Grid */}
              <div className="space-y-2">
                <div className="text-[11px] text-[var(--text-dim)]">
                  Characters in <code className="text-sky-300 font-mono">city = "{stringValue}"</code>:
                </div>
                <div className="flex items-center gap-1.5">
                  {stringValue.split('').map((char, i) => (
                    <div
                      key={i}
                      className="flex-1 p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-center"
                    >
                      <div className="text-[10px] font-mono text-[var(--text-dim)]">[{i}]</div>
                      <div className="font-mono text-sm font-bold text-[var(--text-main)] my-0.5">
                        '{char}'
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attempt Mutation Actions */}
              <div className="mt-4 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
                <div className="text-[11px] font-semibold text-[var(--text-muted)]">
                  Attempt: <code className="text-red-300 font-mono">city[0] = 'K'</code>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAttemptStringMutation}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-bold transition-colors"
                  >
                    Execute city[0] = 'K'
                  </button>
                  <button
                    onClick={handleRecreateString}
                    className="flex items-center gap-1 py-1.5 px-3 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] text-xs text-[var(--text-muted)] transition-colors"
                    title="Allocate new string object"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reallocate</span>
                  </button>
                </div>
              </div>

              {/* Error Output Box */}
              {stringAttemptError && (
                <div className="mt-3 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono space-y-1 animate-in fade-in duration-200">
                  <div className="font-bold flex items-center gap-1.5 text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Traceback (most recent call last):</span>
                  </div>
                  <div className="pl-5 text-[11px] text-red-200">
                    File "&lt;stdin&gt;", line 1, in &lt;module&gt;
                  </div>
                  <div className="pl-5 text-[11px] font-bold text-red-300">
                    {stringAttemptError}
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-red-500/20 text-xs text-red-300/90 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <span className="text-red-400">✕</span> Cannot Modify In-Place
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Strings have no pointer buffer. Any update requires slicing and allocating a brand-new string object at a different memory address.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
