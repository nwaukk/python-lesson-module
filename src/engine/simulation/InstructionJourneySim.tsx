/**
 * Instruction Journey Signature Simulation
 * Master Specification Section 8.4 & Day 1 Brief:
 * Visualises how Python source code moves through Lexing/Parsing -> Bytecode Compilation -> PVM Stack Execution -> Output.
 */

import React, { useState, useEffect } from 'react';
import {
  FileCode,
  Cpu,
  Layers,
  Terminal,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Sparkles,
} from 'lucide-react';
import { SimulationController } from './SimulationController';

interface Stage {
  id: number;
  title: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  internalDetail: string;
  dataTitle: string;
  dataContent: string[];
}

const STAGES: Stage[] = [
  {
    id: 1,
    title: 'Source Text (.py)',
    badge: 'HUMAN READABLE',
    icon: FileCode,
    description: 'You write high-level human-readable instructions in a UTF-8 text file.',
    internalDetail:
      'CPython loads the file into memory buffer. No execution occurs yet. Python checks for valid character encoding.',
    dataTitle: 'Source Script Buffer',
    dataContent: [
      '1 | greeting = "Hello, Nigeria!"',
      '2 | print(greeting)',
      '3 | # Ready to run',
    ],
  },
  {
    id: 2,
    title: 'Lexer & AST Parser',
    badge: 'SYNTAX ANALYSIS',
    icon: Layers,
    description: 'The tokenizer breaks text into tokens, and the parser builds an Abstract Syntax Tree (AST).',
    internalDetail:
      'Checks grammar rules and indentation. If parentheses or quotes are missing, SyntaxError or IndentationError is raised here before anything runs.',
    dataTitle: 'Token Stream & AST Nodes',
    dataContent: [
      'TOKEN: NAME("greeting")',
      'TOKEN: EQUAL("=")',
      'TOKEN: STRING("Hello, Nigeria!")',
      'AST: Assign(targets=[Name(id="greeting")], value=Constant(value="Hello, Nigeria!"))',
      'AST: Expr(value=Call(func=Name(id="print"), args=[Name(id="greeting")]))',
    ],
  },
  {
    id: 3,
    title: 'Bytecode Compiler (.pyc)',
    badge: 'INTERMEDIATE CODE',
    icon: Cpu,
    description: 'The AST is compiled into platform-neutral CPython bytecode opcodes stored in code objects.',
    internalDetail:
      'Bytecode instructions are compact numeric codes designed for a stack machine. Stored in __pycache__/*.pyc for fast subsequent loads.',
    dataTitle: 'Disassembled Opcodes (dis)',
    dataContent: [
      '0 LOAD_CONST     0 ("Hello, Nigeria!")',
      '2 STORE_NAME     0 (greeting)',
      '4 LOAD_NAME      1 (print)',
      '6 LOAD_NAME      0 (greeting)',
      '8 CALL_FUNCTION  1',
      '10 POP_TOP',
      '12 LOAD_CONST    1 (None)',
      '14 RETURN_VALUE',
    ],
  },
  {
    id: 4,
    title: 'Python Virtual Machine (PVM)',
    badge: 'STACK EXECUTION',
    icon: Cpu,
    description: 'The PVM runtime evaluation loop reads each opcode sequentially and executes it on the evaluation stack.',
    internalDetail:
      'The PVM is a giant C-loop switch statement (ceval.c). It maintains frame objects, heap object pointers, and reference counters.',
    dataTitle: 'PVM Evaluation Stack & Heap State',
    dataContent: [
      'Heap Object: str at 0x7f01: "Hello, Nigeria!" (ref count: 1)',
      'Global Namespace: {"greeting" -> &0x7f01}',
      'Frame: <module> at top of call stack',
      'Evaluation Stack: [ &print, &greeting ] -> CALL_FUNCTION',
      'C-Level standard library dispatched: PyFile_WriteString()',
    ],
  },
  {
    id: 5,
    title: 'Standard Output (sys.stdout)',
    badge: 'PROGRAM EFFECT',
    icon: Terminal,
    description: 'Formatted characters are written to the operating system standard output stream and rendered to your screen.',
    internalDetail:
      'Text is buffered and flushed to file descriptor 1 (stdout). The terminal or browser console catches and displays the characters.',
    dataTitle: 'Terminal Stream Output',
    dataContent: ['Hello, Nigeria!'],
  },
];

export const InstructionJourneySim: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      const delay = 2200 / speed;
      timer = setTimeout(() => {
        setCurrentStep((prev) => {
          if (prev >= STAGES.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, delay);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, currentStep, speed]);

  const activeStage = STAGES[currentStep - 1];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      <SimulationController
        title="Instruction Journey: Source to PVM Execution"
        badge="simulation"
        currentStep={currentStep}
        totalSteps={STAGES.length}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onStepNext={() => currentStep < STAGES.length && setCurrentStep(currentStep + 1)}
        onStepPrev={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
        onReset={() => {
          setIsPlaying(false);
          setCurrentStep(1);
        }}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Pipeline Stepper Navigation */}
        <div className="bg-[var(--bg-surface)] p-3 md:p-4 rounded-2xl border border-[var(--border-subtle)] shadow-xs">
          <div className="grid grid-cols-5 gap-1.5 md:gap-2">
            {STAGES.map((stage) => {
              const Icon = stage.icon;
              const isCurrent = stage.id === currentStep;
              const isPast = stage.id < currentStep;

              return (
                <button
                  key={stage.id}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStep(stage.id);
                  }}
                  className={`p-2 md:p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isCurrent
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] shadow-xs'
                      : isPast
                      ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isCurrent
                          ? 'text-[var(--accent-primary)]'
                          : isPast
                          ? 'text-emerald-400'
                          : 'text-[var(--text-dim)]'
                      }`}
                    >
                      0{stage.id}
                    </span>
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {isCurrent && <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />}
                  </div>
                  <div className="font-semibold text-xs text-[var(--text-main)] truncate">
                    {stage.title.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] truncate hidden sm:block">
                    {stage.badge}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Stage Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Cause & Architecture Explanation */}
          <div className="lg:col-span-5 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent-primary)]">
                <activeStage.icon className="w-5 h-5" />
              </span>
              <div>
                <div className="text-xs font-mono text-[var(--accent-primary)] uppercase tracking-wider">
                  Phase {activeStage.id} of {STAGES.length}
                </div>
                <h3 className="text-base font-bold text-[var(--text-main)]">{activeStage.title}</h3>
              </div>
            </div>

            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              {activeStage.description}
            </p>

            <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-1.5">
              <div className="text-[11px] font-bold text-[var(--text-main)] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                Under the Hood (CPython Internal)
              </div>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                {activeStage.internalDetail}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
              <button
                onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                disabled={currentStep <= 1}
                className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-30 transition-colors flex items-center gap-1"
              >
                <SkipBack className="w-3.5 h-3.5" /> Previous
              </button>
              <button
                onClick={() => currentStep < STAGES.length && setCurrentStep(currentStep + 1)}
                disabled={currentStep >= STAGES.length}
                className="px-3 py-1.5 rounded-lg bg-[var(--accent-primary)] text-[var(--accent-on)] text-xs font-semibold hover:bg-[var(--accent-hover)] disabled:opacity-30 transition-colors flex items-center gap-1"
              >
                Next Stage <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Concrete Internal Representation / Code */}
          <div className="lg:col-span-7 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[var(--text-main)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
                {activeStage.dataTitle}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-app)] text-[var(--text-dim)]">
                {activeStage.badge}
              </span>
            </div>

            <div className="p-4 flex-1 bg-[var(--bg-code)] overflow-x-auto font-mono text-xs leading-relaxed text-emerald-300">
              {activeStage.dataContent.map((line, idx) => (
                <div key={idx} className="py-0.5">
                  {line}
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[11px] text-[var(--text-muted)] flex items-center justify-between">
              <span>Simulation mode reflects standard CPython 3.12 architecture.</span>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-[var(--accent-primary)] hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Replay from start
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
