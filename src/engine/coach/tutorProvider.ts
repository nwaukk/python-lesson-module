/**
 * Learning Coach & Tutor Provider Architecture
 * Section 10.4 of Master Specification:
 * Decoupled TutorProvider interface. Default implementation is an offline,
 * rule-based tutor powered by runtime traces, the error dictionary,
 * and the glossary. Requires NO paid APIs or network access.
 */

import { ParsedPythonError, TraceStep } from '../runtime/types';
import { GLOSSARY_TERMS, GlossaryTerm } from '../../data/glossary';

export interface TutorContext {
  dayNumber: number;
  subtopicTitle: string;
  activeCode?: string;
  lastError?: ParsedPythonError | null;
  activeTraceStep?: TraceStep | null;
  exerciseId?: string;
  hintLevel?: number;
}

export interface TutorResponse {
  headline: string;
  diagnosis?: string;
  suggestions: string[];
  relevantGlossaryTerms: GlossaryTerm[];
  whatJustHappened?: string;
  nextStepPrompt?: string;
}

export interface TutorProvider {
  name: string;
  isOffline: boolean;
  getGuidance(context: TutorContext): Promise<TutorResponse>;
}

/**
 * Offline Rule-Based Tutor
 * Default, zero-cost, instant client-side tutor.
 */
export class OfflineRuleBasedTutor implements TutorProvider {
  name = 'Offline Pedagogical Coach';
  isOffline = true;

  async getGuidance(context: TutorContext): Promise<TutorResponse> {
    const { dayNumber, subtopicTitle, lastError, activeTraceStep } = context;

    // 1. If an active runtime error occurred
    if (lastError) {
      const matchingTerms = GLOSSARY_TERMS.filter((t) =>
        lastError.name.toLowerCase().includes(t.term.toLowerCase()) ||
        lastError.traceback.toLowerCase().includes(t.term.toLowerCase())
      ).slice(0, 2);

      return {
        headline: `Diagnosis: ${lastError.name}`,
        diagnosis: lastError.friendlyExplanation,
        suggestions:
          lastError.fixSuggestions.length > 0
            ? lastError.fixSuggestions
            : ['Check spelling of variable names', 'Ensure matching brackets and quotes'],
        relevantGlossaryTerms: matchingTerms,
        whatJustHappened: `Python encountered an unhandled ${lastError.name} on the executing line. Execution paused safely.`,
        nextStepPrompt: 'Review the highlighted code line and apply the suggested correction above.',
      };
    }

    // 2. If stepping through an active trace
    if (activeTraceStep) {
      const varCount = Object.keys(activeTraceStep.variables).length;
      const varNames = Object.keys(activeTraceStep.variables).slice(0, 4).join(', ');

      return {
        headline: `Step ${activeTraceStep.stepNumber}: Executing Line ${activeTraceStep.line}`,
        whatJustHappened: `Python evaluated the instruction in function ${activeTraceStep.functionName}(). There are currently ${varCount} active bound variables (${varNames || 'none'}).`,
        suggestions: [
          'Inspect the Variables panel to observe memory binding changes',
          'Step forward to observe the next bytecode instruction',
        ],
        relevantGlossaryTerms: GLOSSARY_TERMS.filter((t) =>
          ['Variable', 'Bytecode', 'Scope', 'CPython'].includes(t.term)
        ).slice(0, 2),
      };
    }

    // 3. Default subtopic pedagogical guidance
    const topicTerms = GLOSSARY_TERMS.filter((t) =>
      subtopicTitle.toLowerCase().includes(t.term.toLowerCase()) ||
      t.introducedInDay === dayNumber
    ).slice(0, 2);

    return {
      headline: `Topic Guidance: ${subtopicTitle}`,
      whatJustHappened:
        'The Python interpreter parses your code into an Abstract Syntax Tree (AST), compiles it to bytecode, and dispatches instructions through the evaluation loop.',
      suggestions: [
        'Run the starter snippet to observe live output in the console',
        'Use Step-Through Trace to inspect memory and variable bindings at each line',
        'Experiment with modifying values in the editor to see Python reactions',
      ],
      relevantGlossaryTerms: topicTerms.length > 0 ? topicTerms : GLOSSARY_TERMS.slice(0, 2),
      nextStepPrompt: 'Try completing the practice challenges below this subtopic.',
    };
  }
}

export const defaultTutor = new OfflineRuleBasedTutor();
