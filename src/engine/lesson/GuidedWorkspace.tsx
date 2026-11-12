/**
 * Guided Workspace Framework (Primary Lesson Layout)
 * Full implementation of Phase 0C:
 * Dynamically binds active DayModule & Subtopics to LessonRenderer,
 * routes signature simulation primitives, CodeMirror 6 editor, and Coach.
 */

import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Eye,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  Bookmark,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Square,
  ListOrdered,
  FileCode,
} from 'lucide-react';
import { useNavigation } from '../../store/navigationContext';
import { useProgress } from '../../store/progressContext';
import { useSettings } from '../../store/settingsContext';
import { usePythonRuntime } from '../runtime/runtimeContext';
import { getDayModule } from './dayLoader';
import { LessonRenderer } from './LessonRenderer';
import { ErrorBoundary } from '../../app/ErrorBoundary';
import { CodeMirrorEditor } from '../editor/CodeMirrorEditor';
import { ConsolePanel } from '../runtime/ConsolePanel';
import { VariablesPanel } from '../runtime/VariablesPanel';
import { TraceTimeline } from '../runtime/TraceTimeline';
import { RunInsightsPanel } from '../runtime/RunInsightsPanel';
import { InputQueuePanel } from '../runtime/InputQueuePanel';

import { MemoryBindingSim } from '../simulation/MemoryBindingSim';
import { SequenceGridSim } from '../simulation/SequenceGridSim';
import { TruthTableSim } from '../simulation/TruthTableSim';
import { ExpressionTreeSim } from '../simulation/ExpressionTreeSim';
import { FlowchartTracerSim } from '../simulation/FlowchartTracerSim';
import { InstructionJourneySim } from '../simulation/InstructionJourneySim';
import { ShellVsScriptSim } from '../simulation/ShellVsScriptSim';
import { TerminalConsoleSim } from '../simulation/TerminalConsoleSim';
import { IndentationLabSim } from '../simulation/IndentationLabSim';
import { SyntaxRepairSim } from '../simulation/SyntaxRepairSim';
import { DataTypesVisualizerSim } from '../simulation/DataTypesVisualizerSim';
import { TypeConversionSim } from '../simulation/TypeConversionSim';
import { BuiltinExplorerSim } from '../simulation/BuiltinExplorerSim';
import { VariableNamingSim } from '../simulation/VariableNamingSim';
import { ArithmeticVisualizerSim } from '../simulation/ArithmeticVisualizerSim';
import { IdentityEqualitySim } from '../simulation/IdentityEqualitySim';
import { StringMethodsLabSim } from '../simulation/StringMethodsLabSim';
import { SplitJoinSim } from '../simulation/SplitJoinSim';
import { FindIndexSearchSim } from '../simulation/FindIndexSearchSim';
import { NumericPredicatesSim } from '../simulation/NumericPredicatesSim';
import { DynamicArrayAllocatorSim } from '../simulation/DynamicArrayAllocatorSim';
import { ListMutabilitySim } from '../simulation/ListMutabilitySim';
import { ListMethodsLabSim } from '../simulation/ListMethodsLabSim';
import { ListSlicingSplicingSim } from '../simulation/ListSlicingSplicingSim';
import { CopyAliasingSim } from '../simulation/CopyAliasingSim';
import { TupleListMemorySim } from '../simulation/TupleListMemorySim';
import { TupleUnpackingSim } from '../simulation/TupleUnpackingSim';
import { TupleImmutabilityTrapSim } from '../simulation/TupleImmutabilityTrapSim';
import { VennDiagramSim } from '../simulation/VennDiagramSim';
import { HashSetTableSim } from '../simulation/HashSetTableSim';
import { CompactDictMemorySim } from '../simulation/CompactDictMemorySim';
import { DictMutationFlowSim } from '../simulation/DictMutationFlowSim';
import { GradeBoundariesSim } from '../simulation/GradeBoundariesSim';
import { TruthinessSorterSim } from '../simulation/TruthinessSorterSim';
import { IterationTimelineSim } from '../simulation/IterationTimelineSim';
import { RangeSliderSim } from '../simulation/RangeSliderSim';
import { NestedLoopGridSim } from '../simulation/NestedLoopGridSim';
import { InfiniteLoopSafetySim } from '../simulation/InfiniteLoopSafetySim';
import { CallStackFramesSim } from '../simulation/CallStackFramesSim';
import { ScopeFinderSim } from '../simulation/ScopeFinderSim';
import { PrintVsReturnSim } from '../simulation/PrintVsReturnSim';
import { ArgumentMatcherSim } from '../simulation/ArgumentMatcherSim';
import { ImportSimulatorSim } from '../simulation/ImportSimulatorSim';
import { ModuleExplorerSim } from '../simulation/ModuleExplorerSim';
import { SeededRandomLabSim } from '../simulation/SeededRandomLabSim';
import { ComprehensionPipelineSim } from '../simulation/ComprehensionPipelineSim';
import { LambdaEvaluatorSim } from '../simulation/LambdaEvaluatorSim';
import { DictSetCompLabSim } from '../simulation/DictSetCompLabSim';
import { MapFilterReduceSim } from '../simulation/MapFilterReduceSim';
import { ClosureScopeSim } from '../simulation/ClosureScopeSim';
import { DecoratorWrapperSim } from '../simulation/DecoratorWrapperSim';
import { TracebackAnatomySim } from '../simulation/TracebackAnatomySim';
import { ErrorClassifierSim } from '../simulation/ErrorClassifierSim';
import { DebuggingWorkflowSim } from '../simulation/DebuggingWorkflowSim';
import { DatetimePartsSim } from '../simulation/DatetimePartsSim';
import { StrftimeStrptimeSim } from '../simulation/StrftimeStrptimeSim';
import { TimezoneTimedeltaSim } from '../simulation/TimezoneTimedeltaSim';
import { TryExceptFlowSim } from '../simulation/TryExceptFlowSim';
import { PackingUnpackingSim } from '../simulation/PackingUnpackingSim';
import { EnumerateZipSim } from '../simulation/EnumerateZipSim';
import { RegexMethodsSim } from '../simulation/RegexMethodsSim';
import { RegexQuantifierSim } from '../simulation/RegexQuantifierSim';
import { RegexGroupsSim } from '../simulation/RegexGroupsSim';
import { FileModesSim } from '../simulation/FileModesSim';
import { FileCursorSim } from '../simulation/FileCursorSim';
import { StructuredIoSim } from '../simulation/StructuredIoSim';
import { PipLifecycleSim } from '../simulation/PipLifecycleSim';
import { SemverResolverSim } from '../simulation/SemverResolverSim';
import { PackageAnatomySim } from '../simulation/PackageAnatomySim';
import { ClassInstanceSim } from '../simulation/ClassInstanceSim';
import { InheritanceMroSim } from '../simulation/InheritanceMroSim';
import { DunderPropertySim } from '../simulation/DunderPropertySim';
import { DomTreeSim } from '../simulation/DomTreeSim';
import { CssSelectorSim } from '../simulation/CssSelectorSim';
import { ScrapingEthicsSim } from '../simulation/ScrapingEthicsSim';
import { VenvIsolationSim } from '../simulation/VenvIsolationSim';
import { VenvActivationSim } from '../simulation/VenvActivationSim';
import { FreezeWorkflowSim } from '../simulation/FreezeWorkflowSim';
import { NdarrayShapeSim } from '../simulation/NdarrayShapeSim';
import { BroadcastingAxisSim } from '../simulation/BroadcastingAxisSim';
import { VectorisedStatsSim } from '../simulation/VectorisedStatsSim';
import { DataFrameLocIlocSim } from '../simulation/DataFrameLocIlocSim';
import { MissingDataSim } from '../simulation/MissingDataSim';
import { GroupByMergeSim } from '../simulation/GroupByMergeSim';
import { FlaskRoutingSim } from '../simulation/FlaskRoutingSim';
import { JinjaTemplateSim } from '../simulation/JinjaTemplateSim';
import { HttpFormRedirectSim } from '../simulation/HttpFormRedirectSim';
import { MongoDbCrudSim } from '../simulation/MongoDbCrudSim';
import { MongoDbQuerySim } from '../simulation/MongoDbQuerySim';
import { MongoDbAggSchemaSim } from '../simulation/MongoDbAggSchemaSim';
import { ApiHttpLifecycleSim } from '../simulation/ApiHttpLifecycleSim';
import { ApiRequestsClientSim } from '../simulation/ApiRequestsClientSim';
import { ApiAuthCorsSim } from '../simulation/ApiAuthCorsSim';
import { ApiBuilderRouterSim } from '../simulation/ApiBuilderRouterSim';
import { ApiValidationSerializationSim } from '../simulation/ApiValidationSerializationSim';
import { ApiIdempotencyPaginationSim } from '../simulation/ApiIdempotencyPaginationSim';
import { SimulationController } from '../simulation/SimulationController';
import { defaultTutor, TutorResponse } from '../coach/tutorProvider';

export const GuidedWorkspace: React.FC = () => {
  const { activeDay, activeSubtopicIndex, mobileTab, setMobileTab } = useNavigation();
  const { isSubtopicCompleted, toggleSubtopicCompleted, isSubtopicBookmarked, toggleBookmark } = useProgress();
  const { settings } = useSettings();

  const {
    runCode,
    traceCode,
    stopExecution,
    isExecuting,
    runtimeMode,
    status,
    loadProgress,
    activeTraceStep,
    lastError,
    inputQueue,
  } = usePythonRuntime();

  // Load day module & subtopic
  const dayModule = getDayModule(activeDay);
  const totalSubtopics = dayModule.subtopics.length;
  const currentSubtopic = dayModule.subtopics[activeSubtopicIndex] || dayModule.subtopics[0];

  // Panel collapse states
  const [isLessonCollapsed, setIsLessonCollapsed] = useState(false);
  const [isCoachCollapsed, setIsCoachCollapsed] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState<'console' | 'variables' | 'trace' | 'insights' | 'inputs'>('console');
  const [editorCode, setEditorCode] = useState<string>('');
  const [activeHintLevel, setActiveHintLevel] = useState<number>(0);
  const [tutorGuidance, setTutorGuidance] = useState<TutorResponse | null>(null);

  // Synchronise tutor guidance dynamically
  useEffect(() => {
    let isCancelled = false;
    defaultTutor
      .getGuidance({
        dayNumber: activeDay,
        subtopicTitle: currentSubtopic?.title || 'Welcome Tour',
        activeCode: editorCode,
        lastError,
        activeTraceStep,
        hintLevel: activeHintLevel,
      })
      .then((res) => {
        if (!isCancelled) setTutorGuidance(res);
      });
    return () => {
      isCancelled = true;
    };
  }, [activeDay, currentSubtopic?.title, lastError, activeTraceStep, activeHintLevel]);

  // Synchronise starter code when subtopic changes
  useEffect(() => {
    if (currentSubtopic && currentSubtopic.code && currentSubtopic.code[0]) {
      setEditorCode(currentSubtopic.code[0].code);
    } else {
      setEditorCode(`# ${dayModule.title}\nprint("Day ${dayModule.number} loaded.")`);
    }
  }, [activeDay, activeSubtopicIndex, dayModule.title, dayModule.number, currentSubtopic]);

  const isCompleted = isSubtopicCompleted(activeDay, activeSubtopicIndex);
  const isBookmarked = isSubtopicBookmarked(activeDay, activeSubtopicIndex);

  const handleRun = async () => {
    setActiveResultTab('console');
    await runCode(editorCode);
  };

  const handleTrace = async () => {
    setActiveResultTab('trace');
    await traceCode(editorCode);
  };

  // Helper to render active simulation primitive
  const renderVisualStage = () => {
    const simType = currentSubtopic.visualise?.type;
    switch (simType) {
      case 'memory-binding':
        return <MemoryBindingSim />;
      case 'sequence-grid':
        return <SequenceGridSim />;
      case 'truth-table':
        return <TruthTableSim />;
      case 'expression-tree':
        return <ExpressionTreeSim />;
      case 'flowchart-tracer':
        return <FlowchartTracerSim />;
      case 'instruction-journey':
        return <InstructionJourneySim />;
      case 'shell-vs-script':
        return <ShellVsScriptSim />;
      case 'terminal-console':
        return <TerminalConsoleSim />;
      case 'indentation-lab':
        return <IndentationLabSim />;
      case 'syntax-repair':
        return <SyntaxRepairSim />;
      case 'data-types-visualizer':
        return <DataTypesVisualizerSim />;
      case 'type-conversion':
        return <TypeConversionSim />;
      case 'builtin-explorer':
        return <BuiltinExplorerSim />;
      case 'naming-rules':
        return <VariableNamingSim />;
      case 'arithmetic-lab':
        return <ArithmeticVisualizerSim />;
      case 'identity-equality':
        return <IdentityEqualitySim />;
      case 'string-index-slice':
        return <SequenceGridSim />;
      case 'string-methods-lab':
        return <StringMethodsLabSim />;
      case 'split-join':
        return <SplitJoinSim />;
      case 'find-index':
        return <FindIndexSearchSim />;
      case 'numeric-predicates':
        return <NumericPredicatesSim />;
      case 'dynamic-array-allocator':
        return <DynamicArrayAllocatorSim />;
      case 'list-mutability-lab':
        return <ListMutabilitySim />;
      case 'list-methods-lab':
        return <ListMethodsLabSim />;
      case 'list-slicing-splicing':
        return <ListSlicingSplicingSim />;
      case 'copy-aliasing-inspector':
        return <CopyAliasingSim />;
      case 'tuple-list-memory-inspector':
        return <TupleListMemorySim />;
      case 'tuple-unpacking-lab':
        return <TupleUnpackingSim />;
      case 'tuple-immutability-trap':
        return <TupleImmutabilityTrapSim />;
      case 'venn-diagram-simulator':
        return <VennDiagramSim />;
      case 'hash-set-table-inspector':
        return <HashSetTableSim />;
      case 'compact-dict-memory-inspector':
        return <CompactDictMemorySim />;
      case 'dict-mutation-flow-sim':
        return <DictMutationFlowSim />;
      case 'grade-boundaries':
        return <GradeBoundariesSim />;
      case 'truthiness-sorter':
        return <TruthinessSorterSim />;
      case 'iteration-timeline':
        return <IterationTimelineSim />;
      case 'range-slider':
        return <RangeSliderSim />;
      case 'nested-loop-grid':
        return <NestedLoopGridSim />;
      case 'infinite-loop-safety':
        return <InfiniteLoopSafetySim />;
      case 'call-stack-frames':
        return <CallStackFramesSim />;
      case 'scope-finder':
        return <ScopeFinderSim />;
      case 'print-vs-return':
        return <PrintVsReturnSim />;
      case 'argument-matcher':
        return <ArgumentMatcherSim />;
      case 'import-simulator':
        return <ImportSimulatorSim />;
      case 'module-explorer':
        return <ModuleExplorerSim />;
      case 'seeded-random-lab':
        return <SeededRandomLabSim />;
      case 'comprehension-pipeline':
        return <ComprehensionPipelineSim />;
      case 'lambda-evaluator':
        return <LambdaEvaluatorSim />;
      case 'dict-set-comp-lab':
        return <DictSetCompLabSim />;
      case 'map-filter-reduce-sim':
        return <MapFilterReduceSim />;
      case 'closure-scope-sim':
        return <ClosureScopeSim />;
      case 'decorator-wrapper-sim':
        return <DecoratorWrapperSim />;
      case 'traceback-anatomy-sim':
        return <TracebackAnatomySim />;
      case 'error-classifier-sim':
        return <ErrorClassifierSim />;
      case 'debugging-workflow-sim':
        return <DebuggingWorkflowSim />;
      case 'datetime-parts-sim':
        return <DatetimePartsSim />;
      case 'strftime-strptime-sim':
        return <StrftimeStrptimeSim />;
      case 'timezone-timedelta-sim':
        return <TimezoneTimedeltaSim />;
      case 'try-except-flow-sim':
        return <TryExceptFlowSim />;
      case 'packing-unpacking-sim':
        return <PackingUnpackingSim />;
      case 'enumerate-zip-sim':
        return <EnumerateZipSim />;
      case 'regex-methods-sim':
        return <RegexMethodsSim />;
      case 'regex-quantifier-sim':
        return <RegexQuantifierSim />;
      case 'regex-groups-sim':
        return <RegexGroupsSim />;
      case 'file-modes-sim':
        return <FileModesSim />;
      case 'file-cursor-sim':
        return <FileCursorSim />;
      case 'structured-io-sim':
        return <StructuredIoSim />;
      case 'pip-lifecycle-sim':
        return <PipLifecycleSim />;
      case 'semver-resolver-sim':
        return <SemverResolverSim />;
      case 'package-anatomy-sim':
        return <PackageAnatomySim />;
      case 'class-instance-sim':
        return <ClassInstanceSim />;
      case 'inheritance-mro-sim':
        return <InheritanceMroSim />;
      case 'dunder-property-sim':
        return <DunderPropertySim />;
      case 'dom-tree-sim':
        return <DomTreeSim />;
      case 'css-selector-sim':
        return <CssSelectorSim />;
      case 'scraping-ethics-sim':
        return <ScrapingEthicsSim />;
      case 'venv-isolation-sim':
        return <VenvIsolationSim />;
      case 'venv-activation-sim':
        return <VenvActivationSim />;
      case 'freeze-workflow-sim':
        return <FreezeWorkflowSim />;
      case 'ndarray-shape-sim':
        return <NdarrayShapeSim />;
      case 'broadcasting-axis-sim':
        return <BroadcastingAxisSim />;
      case 'vectorised-stats-sim':
        return <VectorisedStatsSim />;
      case 'dataframe-loc-iloc-sim':
        return <DataFrameLocIlocSim />;
      case 'missing-data-sim':
        return <MissingDataSim />;
      case 'groupby-merge-sim':
        return <GroupByMergeSim />;
      case 'flask-routing-sim':
        return <FlaskRoutingSim />;
      case 'jinja-template-sim':
        return <JinjaTemplateSim />;
      case 'http-form-redirect-sim':
        return <HttpFormRedirectSim />;
      case 'mongodb-crud-sim':
        return <MongoDbCrudSim />;
      case 'mongodb-query-sim':
        return <MongoDbQuerySim />;
      case 'mongodb-agg-schema-sim':
        return <MongoDbAggSchemaSim />;
      case 'api-http-lifecycle-sim':
        return <ApiHttpLifecycleSim />;
      case 'api-requests-client-sim':
        return <ApiRequestsClientSim />;
      case 'api-auth-cors-sim':
        return <ApiAuthCorsSim />;
      case 'api-builder-router-sim':
        return <ApiBuilderRouterSim />;
      case 'api-validation-serialization-sim':
        return <ApiValidationSerializationSim />;
      case 'api-idempotency-pagination-sim':
        return <ApiIdempotencyPaginationSim />;
      default:
        return (
          <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
            <SimulationController
              title={currentSubtopic.visualise?.title || 'Python Instruction Journey'}
              badge="simulation"
            />
            <div className="flex-1 p-6 overflow-auto flex items-center justify-center">
              <div className="w-full max-w-2xl bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] p-6 shadow-inner space-y-4">
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-3 rounded-2xl border border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold">
                    <div className="text-[10px] opacity-70">01. SOURCE</div>
                    <div>Text (.py)</div>
                  </div>
                  <div className="p-3 rounded-2xl border border-sky-500/40 bg-sky-500/10 text-sky-300 font-bold">
                    <div className="text-[10px] opacity-70">02. COMPILER</div>
                    <div>Bytecode (.pyc)</div>
                  </div>
                  <div className="p-3 rounded-2xl border border-purple-500/40 bg-purple-500/10 text-purple-300 font-bold">
                    <div className="text-[10px] opacity-70">03. RUNTIME</div>
                    <div>PVM Loop</div>
                  </div>
                  <div className="p-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-bold">
                    <div className="text-[10px] opacity-70">04. OUTPUT</div>
                    <div>sys.stdout</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-app)] text-xs text-[var(--text-muted)] text-center">
                  {currentSubtopic.visualise?.description || 'Compiled bytecode executed by Python Virtual Machine.'}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]">
      {/* Phone View: Mobile Segmented Bar (<768px) */}
      <div className="md:hidden border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-1.5 flex items-center justify-around text-xs font-semibold shrink-0">
        {[
          { id: 'concept', label: 'Concept', icon: BookOpen },
          { id: 'visualise', label: 'Visualise', icon: Eye },
          { id: 'code', label: 'Code', icon: FileCode },
          { id: 'output', label: 'Output', icon: Terminal },
          { id: 'practise', label: 'Coach', icon: Lightbulb },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = mobileTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setMobileTab(tab.id as typeof mobileTab)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'text-[var(--accent-primary)] bg-[var(--accent-subtle)]'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Workspace Frame (Three Zones on desktop, adapted on tablet & mobile) */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* ============================================================== */}
        {/* ZONE 1: LESSON PANEL (Left by default, swappable to Right) */}
        {/* ============================================================== */}
        <div
          className={`border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col transition-all duration-200 ${
            settings.swapPanels ? 'order-3 border-l border-r-0' : 'order-1'
          } ${
            isLessonCollapsed
              ? 'w-12 shrink-0 overflow-hidden'
              : 'w-full md:w-80 lg:w-96 xl:w-[420px] shrink-0'
          } ${mobileTab !== 'concept' ? 'hidden md:flex' : 'flex'}`}
        >
          {/* Lesson Header */}
          <div className="px-4 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface-elevated)] shrink-0">
            {isLessonCollapsed ? (
              <button
                onClick={() => setIsLessonCollapsed(false)}
                className="w-full flex justify-center text-[var(--text-muted)] hover:text-[var(--text-main)]"
                title="Expand Lesson"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="eyebrow-label text-[11px]">LESSON GUIDE</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-dim)]">
                    Topic {activeSubtopicIndex + 1}/{totalSubtopics}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleBookmark(activeDay, activeSubtopicIndex)}
                    className={`p-1.5 rounded-md hover:bg-[var(--border-subtle)] transition-colors ${
                      isBookmarked ? 'text-amber-400' : 'text-[var(--text-dim)]'
                    }`}
                    title={isBookmarked ? 'Bookmarked' : 'Add bookmark'}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                  <button
                    onClick={() => toggleSubtopicCompleted(activeDay, activeSubtopicIndex)}
                    className={`p-1.5 rounded-md hover:bg-[var(--border-subtle)] transition-colors ${
                      isCompleted ? 'text-emerald-400' : 'text-[var(--text-dim)]'
                    }`}
                    title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsLessonCollapsed(true)}
                    className="hidden md:flex p-1.5 rounded-md text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--border-subtle)]"
                    title="Collapse Lesson panel"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Lesson Dynamic Content via LessonRenderer */}
          {!isLessonCollapsed && (
            <LessonRenderer
              dayModule={dayModule}
              subtopic={currentSubtopic}
              subtopicIndex={activeSubtopicIndex}
              totalSubtopics={totalSubtopics}
              onLoadCode={(code) => setEditorCode(code)}
            />
          )}
        </div>

        {/* ============================================================== */}
        {/* ZONE 2: CENTRE WORKSPACE (Visual Stage + Code Editor + Results) */}
        {/* ============================================================== */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 order-2 bg-[var(--bg-app)]">
          {/* Top Half: Visual Stage */}
          <div
            className={`border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col ${
              mobileTab === 'visualise' ? 'flex flex-1' : mobileTab === 'concept' ? 'hidden md:flex md:h-1/2' : 'flex md:h-1/2'
            }`}
          >
            <ErrorBoundary isSimulation={true}>
              {renderVisualStage()}
            </ErrorBoundary>
          </div>

          {/* Bottom Half: Code Editor & Results Tabs */}
          <div
            className={`flex-1 flex flex-col min-h-0 ${
              mobileTab === 'code' || mobileTab === 'output' ? 'flex' : mobileTab === 'concept' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Editor Toolbar with REAL PYTHON / TRACE / SIMULATION Badges */}
            <div className="px-3.5 py-1.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    runtimeMode === 'real'
                      ? 'badge-real-python'
                      : runtimeMode === 'trace'
                      ? 'badge-trace'
                      : 'badge-simulation'
                  }`}
                >
                  {runtimeMode === 'real' ? 'REAL PYTHON' : runtimeMode === 'trace' ? 'TRACE' : 'SIMULATION'}
                </span>

                <span className="text-[11px] font-mono text-[var(--text-dim)] hidden sm:inline">
                  {status === 'loading'
                    ? `Loading Pyodide (${loadProgress}%)...`
                    : status === 'ready'
                    ? 'Pyodide 3.12 Ready'
                    : status === 'running'
                    ? 'Running...'
                    : 'Ready'}
                </span>

                {inputQueue.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                    {inputQueue.length} inputs queued
                  </span>
                )}
              </div>

              {/* Execution Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    if (currentSubtopic.code && currentSubtopic.code[0]) {
                      setEditorCode(currentSubtopic.code[0].code);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] text-xs text-[var(--text-muted)] transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleTrace}
                  disabled={isExecuting}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] text-xs font-semibold text-[var(--text-main)] transition-colors disabled:opacity-50"
                  title="Step through code line by line with variables inspector"
                >
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                  <span>Step</span>
                </button>
                {isExecuting ? (
                  <button
                    onClick={stopExecution}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop</span>
                  </button>
                ) : (
                  <button
                    onClick={handleRun}
                    className="flex items-center gap-1.5 px-4 py-1 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] text-xs font-bold shadow-md transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Code</span>
                  </button>
                )}
              </div>
            </div>

            {/* CodeMirror 6 Editor & Results Split */}
            <div className="flex-1 flex flex-col md:flex-row min-h-0">
              <div className="flex-1 h-full min-h-[160px] border-r border-[var(--border-subtle)] overflow-hidden">
                <CodeMirrorEditor
                  value={editorCode}
                  onChange={setEditorCode}
                  highlightLine={activeTraceStep?.line}
                />
              </div>

              {/* Execution Results Tabs */}
              <div className="w-full md:w-80 lg:w-96 flex flex-col bg-[var(--bg-app)] shrink-0">
                <div className="flex items-center border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-2 overflow-x-auto text-xs font-medium">
                  {[
                    { id: 'console', label: 'Console' },
                    { id: 'variables', label: 'Variables' },
                    { id: 'trace', label: 'Trace' },
                    { id: 'insights', label: 'Insights' },
                    { id: 'inputs', label: `Inputs (${inputQueue.length})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveResultTab(tab.id as typeof activeResultTab)}
                      className={`px-3 py-2 border-b-2 font-medium transition-colors ${
                        activeResultTab === tab.id
                          ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] font-semibold'
                          : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Pane Body */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  {activeResultTab === 'console' && <ConsolePanel />}
                  {activeResultTab === 'variables' && <VariablesPanel />}
                  {activeResultTab === 'trace' && <TraceTimeline />}
                  {activeResultTab === 'insights' && <RunInsightsPanel />}
                  {activeResultTab === 'inputs' && (
                    <div className="p-3 overflow-y-auto">
                      <InputQueuePanel />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* ZONE 3: COACH PANEL (Right by default, swappable to Left) */}
        {/* ============================================================== */}
        <div
          className={`border-l border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col transition-all duration-200 ${
            settings.swapPanels ? 'order-1 border-r border-l-0' : 'order-3'
          } ${
            isCoachCollapsed
              ? 'w-12 shrink-0 overflow-hidden'
              : 'w-full md:w-72 lg:w-80 shrink-0'
          } ${mobileTab !== 'practise' ? 'hidden md:flex' : 'flex'}`}
        >
          {/* Coach Header */}
          <div className="px-4 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface-elevated)] shrink-0">
            {isCoachCollapsed ? (
              <button
                onClick={() => setIsCoachCollapsed(false)}
                className="w-full flex justify-center text-[var(--text-muted)] hover:text-[var(--text-main)]"
                title="Expand Coach"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span className="eyebrow-label text-[11px] text-[var(--text-main)]">LEARNING COACH</span>
                </div>
                <button
                  onClick={() => setIsCoachCollapsed(true)}
                  className="hidden md:flex p-1.5 rounded-md text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--border-subtle)]"
                  title="Collapse Coach panel"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Coach Content */}
          {!isCoachCollapsed && (
            <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
              {/* Dynamic Error Diagnosis if present */}
              {lastError && (
                <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 space-y-2">
                  <div className="flex items-center gap-2 text-red-400 font-bold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Error Diagnosis: {lastError.name}</span>
                  </div>
                  <p className="text-[11px] text-red-100/90 leading-relaxed">
                    {lastError.friendlyExplanation}
                  </p>
                  {lastError.fixSuggestions.length > 0 && (
                    <div className="pt-1 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-red-300">Suggested Action:</span>
                      <ul className="list-disc pl-4 text-[11px] space-y-0.5 text-red-200/80">
                        {lastError.fixSuggestions.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Graduated Hints (Section 10.2: 3 progressive hints) */}
              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-2.5">
                <span className="eyebrow-label text-[10px] block text-[var(--accent-primary)]">
                  GRADUATED HINTS
                </span>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setActiveHintLevel(lvl)}
                      className={`flex-1 py-1 rounded text-xs font-semibold border ${
                        activeHintLevel === lvl
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                          : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                      }`}
                    >
                      Hint {lvl}
                    </button>
                  ))}
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-muted)] leading-relaxed">
                  {activeHintLevel === 0 && 'Select a hint level above when you need gentle guidance.'}
                  {activeHintLevel === 1 && 'Look closely at the print statement. Did you enclose text in matching quotes?'}
                  {activeHintLevel === 2 && 'In Python, string literals require single or double quotes. Variables do not use quotes.'}
                  {activeHintLevel === 3 && 'Solution: Ensure `message = "text"` and pass `print(message)` without extra quotes around the variable name.'}
                </div>
              </div>

              {/* What Just Happened Explainer connected to trace & tutor */}
              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-2">
                <span className="eyebrow-label text-[10px] block text-emerald-400">
                  WHAT JUST HAPPENED?
                </span>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  {tutorGuidance?.whatJustHappened || (
                    activeTraceStep ? (
                      <>
                        At step {activeTraceStep.stepNumber} (line {activeTraceStep.line}): Python evaluated the instruction in <code className="text-[var(--syntax-keyword)]">{activeTraceStep.functionName}()</code>. {Object.keys(activeTraceStep.variables).length} objects are currently bound in memory.
                      </>
                    ) : (
                      'The Python interpreter bound the string object to the name in global scope, then called print() to stream characters to stdout.'
                    )
                  )}
                </p>
              </div>

              {/* Quick Glossary Lookup */}
              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-2">
                <span className="eyebrow-label text-[10px] block text-[var(--text-dim)]">
                  TOPIC GLOSSARY LOOKUP
                </span>
                <div className="space-y-1.5">
                  {(tutorGuidance?.relevantGlossaryTerms && tutorGuidance.relevantGlossaryTerms.length > 0) ? (
                    tutorGuidance.relevantGlossaryTerms.map((gt) => (
                      <div key={gt.term} className="p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                        <div className="font-semibold text-[var(--text-main)]">{gt.term}</div>
                        <div className="text-[11px] text-[var(--text-dim)]">{gt.definition}</div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                        <div className="font-semibold text-[var(--text-main)]">Bytecode</div>
                        <div className="text-[11px] text-[var(--text-dim)]">
                          Platform-independent intermediate code executed by the Python Virtual Machine.
                        </div>
                      </div>
                      <div className="p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                        <div className="font-semibold text-[var(--text-main)]">REPL</div>
                        <div className="text-[11px] text-[var(--text-dim)]">
                          Read-Eval-Print Loop: the interactive terminal shell for rapid Python experimentation.
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
