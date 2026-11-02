/**
 * Python Plain-Language Error Translator
 * Sections 8.2 & 10.4: Translates Python tracebacks and exceptions into actionable, friendly guidance.
 */

import { ParsedPythonError } from './types';

export function parsePythonError(rawError: string | Error): ParsedPythonError {
  const fullText = typeof rawError === 'string' ? rawError : rawError.message || String(rawError);

  // Extract error name and message from the bottom of standard traceback
  // e.g.: "TypeError: can only concatenate str (not "int") to str"
  const lines = fullText.trim().split('\n');
  const lastLine = lines[lines.length - 1] || '';
  
  // Match e.g. "NameError: name 'x' is not defined" or "SyntaxError: invalid syntax"
  const errorMatch = lastLine.match(/^([A-Za-z_][A-Za-z0-9_]*(?:Error|Exception|Warning|Interrupt)):\s*(.*)$/);
  
  let errorName = 'PythonError';
  let errorMessage = lastLine;

  if (errorMatch) {
    errorName = errorMatch[1];
    errorMessage = errorMatch[2];
  } else if (fullText.includes('TimeoutError') || fullText.includes('timed out')) {
    errorName = 'TimeoutError';
    errorMessage = 'Script execution exceeded time limit (possible infinite loop).';
  } else if (fullText.includes('EOFError') || fullText.includes('ran out of input')) {
    errorName = 'EOFError';
    errorMessage = 'input() requested data but the Input Queue is empty.';
  }

  // Extract line number if present (e.g. "File "<stdin>", line 4")
  let lineNum: number | undefined;
  for (let i = lines.length - 1; i >= 0; i--) {
    const lineMatch = lines[i].match(/line\s+(\d+)/i);
    if (lineMatch) {
      lineNum = parseInt(lineMatch[1], 10);
      break;
    }
  }

  const { friendlyExplanation, fixSuggestions } = generatePlainLanguageExplanation(errorName, errorMessage);

  return {
    name: errorName,
    message: errorMessage,
    line: lineNum,
    traceback: fullText,
    friendlyExplanation,
    fixSuggestions,
  };
}

function generatePlainLanguageExplanation(
  errorName: string,
  message: string
): { friendlyExplanation: string; fixSuggestions: string[] } {
  switch (errorName) {
    case 'SyntaxError':
      return {
        friendlyExplanation:
          'Python could not understand your code grammar. There is a grammatical mistake in how characters or words were written before execution could begin.',
        fixSuggestions: [
          'Check for unclosed quotes (" or \') or mismatched brackets (, [, {.',
          'Ensure colons (:) are placed at the end of if, for, while, def, and class headers.',
          'Verify that operators or variable names do not contain typos or illegal characters.',
        ],
      };

    case 'IndentationError':
      return {
        friendlyExplanation:
          'Python uses indentation (spaces) to delineate code blocks. A line has either too many or too few spaces at its start.',
        fixSuggestions: [
          'Consistently use 4 spaces for each level of indentation.',
          'Never mix tabs and spaces in the same file.',
          'Make sure code inside if, for, while, or def is indented one level further than the header.',
        ],
      };

    case 'NameError':
      return {
        friendlyExplanation:
          `Python encountered an identifier (${message}) that it does not recognise in the current scope.`,
        fixSuggestions: [
          'Check the spelling of your variable or function name.',
          'Ensure the variable was created BEFORE the line where it is accessed.',
          'Remember Python is case-sensitive: my_var, My_var, and MY_VAR are different names.',
          'If you intended to print a text literal, wrap it in quotation marks.',
        ],
      };

    case 'TypeError':
      return {
        friendlyExplanation:
          'An operation or function was applied to an object of an incompatible data type.',
        fixSuggestions: [
          'If concatenating text and numbers, convert the number with str(x) or use an f-string: f"{x}".',
          'Verify that you are not calling a non-function as if it were a function (e.g. x() when x is an int).',
          'Check that you passed the exact number of required arguments to the function.',
        ],
      };

    case 'ValueError':
      return {
        friendlyExplanation:
          'A function received an argument of the right type, but an invalid value (e.g. converting "hello" into an integer).',
        fixSuggestions: [
          'Ensure strings passed to int() or float() only contain valid numerical digits.',
          'Check that input values fall within the expected domain of the function.',
        ],
      };

    case 'KeyError':
      return {
        friendlyExplanation:
          'You attempted to access a key in a dictionary that does not exist.',
        fixSuggestions: [
          'Verify that the key exists using `if key in my_dict:` before accessing.',
          'Use the safer lookup method: `my_dict.get(key, default_value)` to avoid KeyError.',
          'Inspect the dictionary keys by printing `my_dict.keys()`.',
        ],
      };

    case 'IndexError':
      return {
        friendlyExplanation:
          'You attempted to access a sequence item at an index position outside its boundaries (an off-by-one mistake).',
        fixSuggestions: [
          'Remember Python sequence indexing starts at 0, so the last item in a list of length n is at index n-1.',
          'Check the length of the list with `len(my_list)` before indexing.',
          'Use negative indexing like `my_list[-1]` to safely access the last item.',
        ],
      };

    case 'AttributeError':
      return {
        friendlyExplanation:
          'You tried to access an attribute or call a method that this object type does not have.',
        fixSuggestions: [
          'Check the type of your variable using `type(my_var)`.',
          'Verify the method name in the Methods Explorer (e.g. .append() exists on lists, but not on tuples).',
          'Check for typos in the method or property name.',
        ],
      };

    case 'ZeroDivisionError':
      return {
        friendlyExplanation:
          'A mathematical operation attempted to divide or take the modulo (%) of a number by zero, which is mathematically undefined.',
        fixSuggestions: [
          'Ensure the divisor is checked before dividing: `if divisor != 0: ...`',
          'Check formulas where an accumulator or counter might start at 0.',
        ],
      };

    case 'ModuleNotFoundError':
    case 'ImportError':
      return {
        friendlyExplanation:
          'Python could not find or import the specified module name.',
        fixSuggestions: [
          'Check the spelling of the module in your import statement.',
          'Verify whether the module is part of the standard library or needs to be installed.',
        ],
      };

    case 'UnboundLocalError':
      return {
        friendlyExplanation:
          'A local variable was referenced before a value was assigned to it inside a function.',
        fixSuggestions: [
          'Assign a value to the variable before using it in the function body.',
          'If you intended to modify a global variable, declare `global my_var` at the top of the function.',
        ],
      };

    case 'EOFError':
      return {
        friendlyExplanation:
          'The `input()` function asked for user input, but the Input Queue has run out of items.',
        fixSuggestions: [
          'Open the Input Queue panel and add lines of input before running.',
          'Provide enough input lines to satisfy every `input()` call in your program.',
        ],
      };

    case 'TimeoutError':
      return {
        friendlyExplanation:
          'Execution timed out after exceeding the safety limit (5 seconds). This usually happens when a `while` loop condition never becomes False.',
        fixSuggestions: [
          'Check your while loops to confirm that the loop variable is updated on every pass (e.g. `count += 1`).',
          'Make sure the loop has an achievable termination condition or a `break` statement.',
          'If your calculation is intentionally heavy, adjust the time limit in settings.',
        ],
      };

    case 'RecursionError':
      return {
        friendlyExplanation:
          'A recursive function called itself repeatedly without reaching a base case, hitting the call stack limit.',
        fixSuggestions: [
          'Verify your recursive function has a base condition that returns without calling itself.',
          'Check that function arguments move closer to the base case with every call.',
        ],
      };

    default:
      return {
        friendlyExplanation:
          `An unexpected exception occurred during execution (${errorName}). Examine the traceback details below.`,
        fixSuggestions: [
          'Review the traceback line number to locate where the issue occurred.',
          'Use print statements to inspect the values of variables right before the error.',
        ],
      };
  }
}
