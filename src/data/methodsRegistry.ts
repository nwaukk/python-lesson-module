/**
 * Python Methods Registry
 * Section 9: Dedicated, data-driven registry covering Python built-in types.
 * Each entry conforms to the schema in Section 9 & 182.
 */

export type PythonObjectType = 'str' | 'list' | 'tuple' | 'set' | 'dict';

export interface MethodParameter {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description: string;
}

export interface MethodComparison {
  counterpartName: string;
  counterpartType: PythonObjectType;
  comparisonTitle: string;
  keyDifference: string;
  exampleComparison: {
    input: string;
    methodACall: string;
    methodAResult: string;
    methodBCall: string;
    methodBResult: string;
  };
}

export interface MethodEntry {
  name: string;
  type: PythonObjectType;
  signature: string;
  purpose: string;
  parameters: MethodParameter[];
  mutates: boolean;
  returnsNew: boolean;
  returnType: string;
  defaultTarget: string;
  defaultArgs: string;
  examples: {
    description: string;
    target: string;
    args: string;
    code: string;
    returned: string;
    afterState: string;
  }[];
  edgeCases: string[];
  commonErrors: { error: string; cause: string; fix: string }[];
  relatedMethods: string[];
  comparison?: MethodComparison;
  introducedInDay: number;
}

export const METHODS_REGISTRY: MethodEntry[] = [
  // ==========================================
  // STR METHODS (Day 4) - Immutable
  // ==========================================
  {
    name: 'upper',
    type: 'str',
    signature: 'str.upper() -> str',
    purpose: 'Return a copy of the string with all cased characters converted to uppercase.',
    parameters: [],
    mutates: false,
    returnsNew: true,
    returnType: 'str',
    defaultTarget: '"python visual lab"',
    defaultArgs: '',
    examples: [
      {
        description: 'Convert lowercase letters to uppercase',
        target: '"python"',
        args: '',
        code: '"python".upper()',
        returned: '"PYTHON"',
        afterState: '"python" (strings are immutable)',
      },
      {
        description: 'Leaves numbers and symbols untouched',
        target: '"lagos 2026!"',
        args: '',
        code: '"lagos 2026!".upper()',
        returned: '"LAGOS 2026!"',
        afterState: '"lagos 2026!" (strings are immutable)',
      },
    ],
    edgeCases: ['Non-cased characters (digits, emojis, punctuation) remain unchanged.'],
    commonErrors: [
      {
        error: 'AttributeError: \'int\' object has no attribute \'upper\'',
        cause: 'Calling .upper() on an integer without converting to string first.',
        fix: 'Use str(number).upper()',
      },
    ],
    relatedMethods: ['lower', 'capitalize', 'title', 'swapcase'],
    introducedInDay: 4,
  },
  {
    name: 'lower',
    type: 'str',
    signature: 'str.lower() -> str',
    purpose: 'Return a copy of the string with all cased characters converted to lowercase.',
    parameters: [],
    mutates: false,
    returnsNew: true,
    returnType: 'str',
    defaultTarget: '"PYTHON VISUAL LAB"',
    defaultArgs: '',
    examples: [
      {
        description: 'Standard uppercase to lowercase conversion',
        target: '"HELLO WORLD"',
        args: '',
        code: '"HELLO WORLD".lower()',
        returned: '"hello world"',
        afterState: '"HELLO WORLD" (unchanged)',
      },
    ],
    edgeCases: ['German "ß" stays "ß" in lower(); casefold() converts to "ss".'],
    commonErrors: [],
    relatedMethods: ['upper', 'casefold', 'title'],
    introducedInDay: 4,
  },
  {
    name: 'capitalize',
    type: 'str',
    signature: 'str.capitalize() -> str',
    purpose: 'Return a copy of the string with its first character capitalized and the rest lowercased.',
    parameters: [],
    mutates: false,
    returnsNew: true,
    returnType: 'str',
    defaultTarget: '"python PROGRAMMING"',
    defaultArgs: '',
    examples: [
      {
        description: 'Capitalize sentence start and lower remainder',
        target: '"python PROGRAMMING"',
        args: '',
        code: '"python PROGRAMMING".capitalize()',
        returned: '"Python programming"',
        afterState: '"python PROGRAMMING" (unchanged)',
      },
    ],
    edgeCases: ['If the first character is a symbol or number, no letter is capitalised.'],
    commonErrors: [],
    relatedMethods: ['title', 'upper'],
    introducedInDay: 1,
  },
  {
    name: 'isidentifier',
    type: 'str',
    signature: 'str.isidentifier() -> bool',
    purpose: 'Return True if the string is a valid identifier according to the Python language definition.',
    parameters: [],
    mutates: false,
    returnsNew: true,
    returnType: 'bool',
    defaultTarget: '"student_score"',
    defaultArgs: '',
    examples: [
      {
        description: 'Check a valid snake_case variable identifier',
        target: '"student_score"',
        args: '',
        code: '"student_score".isidentifier()',
        returned: 'True',
        afterState: '"student_score" (unchanged)',
      },
      {
        description: 'Detect invalid leading digit',
        target: '"1st_place"',
        args: '',
        code: '"1st_place".isidentifier()',
        returned: 'False',
        afterState: '"1st_place" (unchanged)',
      },
    ],
    edgeCases: [
      'Returns True for reserved keywords (e.g. "def".isidentifier() is True), so always pair with keyword.iskeyword() to check if usable as a variable.',
    ],
    commonErrors: [
      {
        error: 'Expecting isidentifier() to reject keywords like "class" or "for"',
        cause: 'isidentifier() only checks syntax grammar structure, not keyword reservation.',
        fix: 'Use "name".isidentifier() and not keyword.iskeyword("name")',
      },
    ],
    relatedMethods: ['isalnum', 'isalpha', 'isascii'],
    introducedInDay: 2,
  },
  {
    name: 'strip',
    type: 'str',
    signature: 'str.strip([chars]) -> str',
    purpose: 'Return a copy of the string with leading and trailing whitespace (or specified chars) removed.',
    parameters: [
      {
        name: 'chars',
        type: 'str',
        required: false,
        defaultValue: 'whitespace',
        description: 'Characters to strip from ends.',
      },
    ],
    mutates: false,
    returnsNew: true,
    returnType: 'str',
    defaultTarget: '"   welcome to lagos   "',
    defaultArgs: '',
    examples: [
      {
        description: 'Trim padding spaces',
        target: '"   hello   "',
        args: '',
        code: '"   hello   ".strip()',
        returned: '"hello"',
        afterState: '"   hello   " (unchanged)',
      },
      {
        description: 'Strip specific punctuation',
        target: '"...data!..."',
        args: '".!"',
        code: '"...data!...".strip(".!")',
        returned: '"data"',
        afterState: '"...data!..." (unchanged)',
      },
    ],
    edgeCases: ['Does NOT remove whitespace or characters from the middle of the string.'],
    commonErrors: [
      {
        error: 'Misconception: Expecting substring removal',
        cause: 'chars is treated as a set of individual characters, not a prefix/suffix phrase.',
        fix: 'Use .removeprefix() or .removesuffix() for exact phrase removal.',
      },
    ],
    relatedMethods: ['lstrip', 'rstrip', 'replace'],
    comparison: {
      counterpartName: 'replace',
      counterpartType: 'str',
      comparisonTitle: 'strip vs replace',
      keyDifference: 'strip removes characters only from the outer ends; replace substitutes throughout the entire string.',
      exampleComparison: {
        input: '"  cat and dog  "',
        methodACall: '"  cat and dog  ".strip(" ")',
        methodAResult: '"cat and dog"',
        methodBCall: '"  cat and dog  ".replace(" ", "")',
        methodBResult: '"catanddog"',
      },
    },
    introducedInDay: 4,
  },
  {
    name: 'find',
    type: 'str',
    signature: 'str.find(sub[, start[, end]]) -> int',
    purpose: 'Return the lowest index in S where substring sub is found. Return -1 on failure.',
    parameters: [
      { name: 'sub', type: 'str', required: true, description: 'The substring to locate.' },
      { name: 'start', type: 'int', required: false, defaultValue: '0', description: 'Start index.' },
      { name: 'end', type: 'int', required: false, defaultValue: 'len(S)', description: 'End index.' },
    ],
    mutates: false,
    returnsNew: true,
    returnType: 'int',
    defaultTarget: '"python visual lab"',
    defaultArgs: '"visual"',
    examples: [
      {
        description: 'Find present substring',
        target: '"python visual lab"',
        args: '"visual"',
        code: '"python visual lab".find("visual")',
        returned: '7',
        afterState: '"python visual lab" (unchanged)',
      },
      {
        description: 'Substring absent returns -1',
        target: '"python visual lab"',
        args: '"rust"',
        code: '"python visual lab".find("rust")',
        returned: '-1',
        afterState: '"python visual lab" (unchanged)',
      },
    ],
    edgeCases: ['Returns -1 rather than raising an exception when missing.'],
    commonErrors: [
      {
        error: 'if string.find("x"): condition bug',
        cause: 'When "x" is at index 0, find() returns 0 which evaluates to False in Python conditionals.',
        fix: 'Use `if "x" in string:` or `if string.find("x") != -1:`',
      },
    ],
    relatedMethods: ['rfind', 'index', 'count'],
    comparison: {
      counterpartName: 'index',
      counterpartType: 'str',
      comparisonTitle: 'find vs index',
      keyDifference: 'find() returns -1 when the substring is not found; index() raises a ValueError.',
      exampleComparison: {
        input: '"apple"',
        methodACall: '"apple".find("z")',
        methodAResult: '-1 (safe sentinel value)',
        methodBCall: '"apple".index("z")',
        methodBResult: 'ValueError: substring not found',
      },
    },
    introducedInDay: 4,
  },
  {
    name: 'index',
    type: 'str',
    signature: 'str.index(sub[, start[, end]]) -> int',
    purpose: 'Like find(), but raises ValueError when the substring is not found.',
    parameters: [
      { name: 'sub', type: 'str', required: true, description: 'Substring to locate.' },
    ],
    mutates: false,
    returnsNew: true,
    returnType: 'int',
    defaultTarget: '"python visual lab"',
    defaultArgs: '"lab"',
    examples: [
      {
        description: 'Find matching index',
        target: '"python visual lab"',
        args: '"lab"',
        code: '"python visual lab".index("lab")',
        returned: '14',
        afterState: '"python visual lab" (unchanged)',
      },
    ],
    edgeCases: ['Raises ValueError on missing items.'],
    commonErrors: [
      {
        error: 'ValueError: substring not found',
        cause: 'The requested substring does not exist in the target string.',
        fix: 'Check presence with `if sub in text:` before calling index(), or use find().',
      },
    ],
    relatedMethods: ['find', 'rindex'],
    introducedInDay: 4,
  },
  {
    name: 'replace',
    type: 'str',
    signature: 'str.replace(old, new[, count]) -> str',
    purpose: 'Return a copy with all occurrences of substring old replaced by new.',
    parameters: [
      { name: 'old', type: 'str', required: true, description: 'Substring to replace.' },
      { name: 'new', type: 'str', required: true, description: 'Replacement string.' },
      { name: 'count', type: 'int', required: false, description: 'Maximum occurrences to replace.' },
    ],
    mutates: false,
    returnsNew: true,
    returnType: 'str',
    defaultTarget: '"Python 2 is great, Python 2 is classic"',
    defaultArgs: '"2", "3"',
    examples: [
      {
        description: 'Replace substring occurrences',
        target: '"Python 2 is great"',
        args: '"2", "3"',
        code: '"Python 2 is great".replace("2", "3")',
        returned: '"Python 3 is great"',
        afterState: '"Python 2 is great" (unchanged)',
      },
    ],
    edgeCases: ['If old is not found, returns an unchanged copy of the string without error.'],
    commonErrors: [],
    relatedMethods: ['strip', 'translate'],
    introducedInDay: 4,
  },
  {
    name: 'split',
    type: 'str',
    signature: 'str.split(sep=None, maxsplit=-1) -> list[str]',
    purpose: 'Return a list of the words in the string, using sep as the delimiter string.',
    parameters: [
      { name: 'sep', type: 'str', required: false, defaultValue: 'whitespace', description: 'Delimiter.' },
      { name: 'maxsplit', type: 'int', required: false, defaultValue: '-1', description: 'Max splits.' },
    ],
    mutates: false,
    returnsNew: true,
    returnType: 'list',
    defaultTarget: '"Lagos,Abuja,Kano,Ibadan"',
    defaultArgs: '","',
    examples: [
      {
        description: 'Split CSV string by comma',
        target: '"Lagos,Abuja,Kano"',
        args: '","',
        code: '"Lagos,Abuja,Kano".split(",")',
        returned: '[\'Lagos\', \'Abuja\', \'Kano\']',
        afterState: '"Lagos,Abuja,Kano" (unchanged)',
      },
      {
        description: 'Default split splits on any run of whitespace',
        target: '"learn   python\nvisual\tlab"',
        args: '',
        code: '"learn   python\\nvisual\\tlab".split()',
        returned: '[\'learn\', \'python\', \'visual\', \'lab\']',
        afterState: 'original string unchanged',
      },
    ],
    edgeCases: ['split() with no argument treats multiple consecutive spaces as a single delimiter.'],
    commonErrors: [],
    relatedMethods: ['join', 'rsplit', 'splitlines'],
    introducedInDay: 4,
  },
  {
    name: 'join',
    type: 'str',
    signature: 'str.join(iterable) -> str',
    purpose: 'Concatenate any number of strings in iterable with the separator string between each.',
    parameters: [
      { name: 'iterable', type: 'iterable[str]', required: true, description: 'Iterable of strings.' },
    ],
    mutates: false,
    returnsNew: true,
    returnType: 'str',
    defaultTarget: '" - "',
    defaultArgs: '["Python", "Visual", "Lab"]',
    examples: [
      {
        description: 'Join string list with hyphen separator',
        target: '" - "',
        args: '["Python", "Visual", "Lab"]',
        code: '" - ".join(["Python", "Visual", "Lab"])',
        returned: '"Python - Visual - Lab"',
        afterState: '" - " (unchanged)',
      },
    ],
    edgeCases: ['All elements in iterable must be strings, or TypeError is raised.'],
    commonErrors: [
      {
        error: 'TypeError: sequence item 0: expected str instance, int found',
        cause: 'Passing non-string elements (e.g. [1, 2, 3]) into .join().',
        fix: 'Convert items first: ", ".join(str(x) for x in numbers)',
      },
    ],
    relatedMethods: ['split'],
    introducedInDay: 4,
  },

  // ==========================================
  // LIST METHODS (Day 5) - Mutable
  // ==========================================
  {
    name: 'append',
    type: 'list',
    signature: 'list.append(object, /) -> None',
    purpose: 'Append object to the end of the list in place.',
    parameters: [
      { name: 'object', type: 'object', required: true, description: 'The item to append.' },
    ],
    mutates: true,
    returnsNew: false,
    returnType: 'None',
    defaultTarget: '["Abuja", "Lagos"]',
    defaultArgs: '"Kano"',
    examples: [
      {
        description: 'Append single element to list',
        target: '["Abuja", "Lagos"]',
        args: '"Kano"',
        code: 'cities = ["Abuja", "Lagos"]\ncities.append("Kano")',
        returned: 'None',
        afterState: '["Abuja", "Lagos", "Kano"] (modified in place)',
      },
    ],
    edgeCases: ['Appending a list appends the entire list as a single nested sub-element.'],
    commonErrors: [
      {
        error: 'x = my_list.append("item") -> x is None',
        cause: 'append() mutates in place and returns None. Storing the return value overwrites variable with None.',
        fix: 'Call my_list.append("item") without assignment.',
      },
    ],
    relatedMethods: ['extend', 'insert'],
    comparison: {
      counterpartName: 'extend',
      counterpartType: 'list',
      comparisonTitle: 'append vs extend',
      keyDifference: 'append adds its argument as a single element (even if it is a list); extend iterates over its argument and adds each element individually.',
      exampleComparison: {
        input: '[1, 2]',
        methodACall: '[1, 2].append([3, 4])',
        methodAResult: '[1, 2, [3, 4]] (nested list)',
        methodBCall: '[1, 2].extend([3, 4])',
        methodBResult: '[1, 2, 3, 4] (flattened)',
      },
    },
    introducedInDay: 5,
  },
  {
    name: 'extend',
    type: 'list',
    signature: 'list.extend(iterable, /) -> None',
    purpose: 'Extend the list by appending elements from the iterable in place.',
    parameters: [
      { name: 'iterable', type: 'iterable', required: true, description: 'Elements to append.' },
    ],
    mutates: true,
    returnsNew: false,
    returnType: 'None',
    defaultTarget: '[1, 2, 3]',
    defaultArgs: '[4, 5, 6]',
    examples: [
      {
        description: 'Extend list with another list',
        target: '[1, 2, 3]',
        args: '[4, 5, 6]',
        code: 'nums = [1, 2, 3]\nnums.extend([4, 5, 6])',
        returned: 'None',
        afterState: '[1, 2, 3, 4, 5, 6] (modified in place)',
      },
    ],
    edgeCases: ['Passing a string unpacks each individual character into the list.'],
    commonErrors: [],
    relatedMethods: ['append', 'insert'],
    introducedInDay: 5,
  },
  {
    name: 'pop',
    type: 'list',
    signature: 'list.pop(index=-1, /) -> object',
    purpose: 'Remove and return item at index (default last). Raises IndexError if empty.',
    parameters: [
      { name: 'index', type: 'int', required: false, defaultValue: '-1', description: 'Index to pop.' },
    ],
    mutates: true,
    returnsNew: true,
    returnType: 'object',
    defaultTarget: '["first", "second", "third"]',
    defaultArgs: '',
    examples: [
      {
        description: 'Pop default last element',
        target: '["first", "second", "third"]',
        args: '',
        code: 'items = ["first", "second", "third"]\nval = items.pop()',
        returned: '"third"',
        afterState: '["first", "second"] (modified in place)',
      },
    ],
    edgeCases: ['Both modifies the list AND returns the removed item.'],
    commonErrors: [
      {
        error: 'IndexError: pop from empty list',
        cause: 'Calling .pop() on a list with zero elements.',
        fix: 'Check `if items:` before popping.',
      },
    ],
    relatedMethods: ['remove', 'clear'],
    introducedInDay: 5,
  },
  {
    name: 'remove',
    type: 'list',
    signature: 'list.remove(value, /) -> None',
    purpose: 'Remove first occurrence of value. Raises ValueError if value is not present.',
    parameters: [
      { name: 'value', type: 'object', required: true, description: 'Value to remove.' },
    ],
    mutates: true,
    returnsNew: false,
    returnType: 'None',
    defaultTarget: '["apple", "banana", "apple"]',
    defaultArgs: '"apple"',
    examples: [
      {
        description: 'Remove first matching occurrence',
        target: '["apple", "banana", "apple"]',
        args: '"apple"',
        code: 'fruits = ["apple", "banana", "apple"]\nfruits.remove("apple")',
        returned: 'None',
        afterState: '["banana", "apple"] (first instance removed)',
      },
    ],
    edgeCases: ['Only removes the FIRST occurrence, not all occurrences.'],
    commonErrors: [
      {
        error: 'ValueError: list.remove(x): x not in list',
        cause: 'Attempting to remove a value that does not exist in the list.',
        fix: 'Check `if val in my_list:` before calling .remove(val).',
      },
    ],
    relatedMethods: ['pop', 'clear'],
    introducedInDay: 5,
  },
  {
    name: 'sort',
    type: 'list',
    signature: 'list.sort(*, key=None, reverse=False) -> None',
    purpose: 'Sort the list in ascending order and return None. The sort is in-place and stable.',
    parameters: [
      { name: 'key', type: 'function', required: false, defaultValue: 'None', description: 'Transform function.' },
      { name: 'reverse', type: 'bool', required: false, defaultValue: 'False', description: 'Reverse flag.' },
    ],
    mutates: true,
    returnsNew: false,
    returnType: 'None',
    defaultTarget: '[42, 12, 88, 5, 23]',
    defaultArgs: '',
    examples: [
      {
        description: 'In-place ascending sort',
        target: '[42, 12, 88, 5, 23]',
        args: '',
        code: 'nums = [42, 12, 88, 5, 23]\nnums.sort()',
        returned: 'None',
        afterState: '[5, 12, 23, 42, 88] (modified in place)',
      },
    ],
    edgeCases: ['Comparing non-comparable types (e.g. str and int) raises TypeError.'],
    commonErrors: [
      {
        error: 'sorted_list = my_list.sort()',
        cause: '.sort() returns None, so sorted_list becomes None.',
        fix: 'Either call `my_list.sort()` or use `sorted_list = sorted(my_list)`.',
      },
    ],
    relatedMethods: ['reverse'],
    comparison: {
      counterpartName: 'sorted',
      counterpartType: 'list',
      comparisonTitle: 'list.sort() vs sorted()',
      keyDifference: 'list.sort() modifies the list in place and returns None; the built-in sorted() returns a brand-new sorted list, leaving the original list untouched.',
      exampleComparison: {
        input: 'a = [3, 1, 2]',
        methodACall: 'a.sort()',
        methodAResult: 'returns None; a becomes [1, 2, 3]',
        methodBCall: 'b = sorted(a)',
        methodBResult: 'returns [1, 2, 3]; a remains [3, 1, 2]',
      },
    },
    introducedInDay: 5,
  },

  // ==========================================
  // TUPLE METHODS (Day 6) - Immutable
  // ==========================================
  {
    name: 'count',
    type: 'tuple',
    signature: 'tuple.count(value, /) -> int',
    purpose: 'Return number of occurrences of value in the tuple.',
    parameters: [
      { name: 'value', type: 'object', required: true, description: 'Target value.' },
    ],
    mutates: false,
    returnsNew: true,
    returnType: 'int',
    defaultTarget: '(1, 2, 3, 2, 4, 2)',
    defaultArgs: '2',
    examples: [
      {
        description: 'Count element frequency in tuple',
        target: '(1, 2, 3, 2, 4, 2)',
        args: '2',
        code: '(1, 2, 3, 2, 4, 2).count(2)',
        returned: '3',
        afterState: '(1, 2, 3, 2, 4, 2) (tuples are immutable)',
      },
    ],
    edgeCases: ['Returns 0 when the value is absent; never raises an error.'],
    commonErrors: [],
    relatedMethods: ['index'],
    introducedInDay: 6,
  },
  {
    name: 'index',
    type: 'tuple',
    signature: 'tuple.index(value[, start[, stop]], /) -> int',
    purpose: 'Return first index of value. Raises ValueError if the value is not present.',
    parameters: [
      { name: 'value', type: 'object', required: true, description: 'Target value.' },
    ],
    mutates: false,
    returnsNew: true,
    returnType: 'int',
    defaultTarget: '("Lagos", "Kano", "Abuja")',
    defaultArgs: '"Kano"',
    examples: [
      {
        description: 'Find index in tuple',
        target: '("Lagos", "Kano", "Abuja")',
        args: '"Kano"',
        code: '("Lagos", "Kano", "Abuja").index("Kano")',
        returned: '1',
        afterState: '("Lagos", "Kano", "Abuja") (unchanged)',
      },
    ],
    edgeCases: ['Tuples only have two methods in Python: count and index.'],
    commonErrors: [
      {
        error: 'ValueError: tuple.index(x): x not in tuple',
        cause: 'Element not present in tuple.',
        fix: 'Check `if x in my_tuple:` before calling index.',
      },
    ],
    relatedMethods: ['count'],
    introducedInDay: 6,
  },

  // ==========================================
  // SET METHODS (Day 7) - Mutable
  // ==========================================
  {
    name: 'add',
    type: 'set',
    signature: 'set.add(element, /) -> None',
    purpose: 'Add an element to a set. Has no effect if element already present.',
    parameters: [
      { name: 'element', type: 'hashable', required: true, description: 'Item to insert.' },
    ],
    mutates: true,
    returnsNew: false,
    returnType: 'None',
    defaultTarget: '{"python", "javascript"}',
    defaultArgs: '"rust"',
    examples: [
      {
        description: 'Add novel element to set',
        target: '{"python", "javascript"}',
        args: '"rust"',
        code: 's = {"python", "javascript"}\ns.add("rust")',
        returned: 'None',
        afterState: '{"javascript", "python", "rust"} (in place)',
      },
    ],
    edgeCases: ['Items must be hashable; adding a list raises TypeError: unhashable type.'],
    commonErrors: [
      {
        error: 'TypeError: unhashable type: \'list\'',
        cause: 'Attempting to add a mutable object into a set.',
        fix: 'Convert the list to a tuple before adding: s.add(tuple(my_list))',
      },
    ],
    relatedMethods: ['remove', 'discard', 'update'],
    introducedInDay: 7,
  },
  {
    name: 'discard',
    type: 'set',
    signature: 'set.discard(element, /) -> None',
    purpose: 'Remove an element from a set if it is a member. If element is not a member, do nothing.',
    parameters: [
      { name: 'element', type: 'object', required: true, description: 'Element to discard.' },
    ],
    mutates: true,
    returnsNew: false,
    returnType: 'None',
    defaultTarget: '{1, 2, 3}',
    defaultArgs: '99',
    examples: [
      {
        description: 'Safely discard missing element without error',
        target: '{1, 2, 3}',
        args: '99',
        code: 's = {1, 2, 3}\ns.discard(99)',
        returned: 'None',
        afterState: '{1, 2, 3} (safe silent completion)',
      },
    ],
    edgeCases: ['Does not raise KeyError when item is absent.'],
    commonErrors: [],
    relatedMethods: ['remove'],
    comparison: {
      counterpartName: 'remove',
      counterpartType: 'set',
      comparisonTitle: 'set.discard() vs set.remove()',
      keyDifference: 'discard() safely does nothing if the element is not found; remove() raises a KeyError.',
      exampleComparison: {
        input: 's = {1, 2}',
        methodACall: 's.discard(99)',
        methodAResult: 'None (no error raised)',
        methodBCall: 's.remove(99)',
        methodBResult: 'KeyError: 99',
      },
    },
    introducedInDay: 7,
  },

  // ==========================================
  // DICT METHODS (Day 8) - Mutable
  // ==========================================
  {
    name: 'get',
    type: 'dict',
    signature: 'dict.get(key, default=None, /) -> object',
    purpose: 'Return the value for key if key is in the dictionary, else default.',
    parameters: [
      { name: 'key', type: 'hashable', required: true, description: 'Lookup key.' },
      { name: 'default', type: 'object', required: false, defaultValue: 'None', description: 'Fallback.' },
    ],
    mutates: false,
    returnsNew: true,
    returnType: 'object',
    defaultTarget: '{"name": "Ada", "city": "Lagos"}',
    defaultArgs: '"score", 0',
    examples: [
      {
        description: 'Safe fallback for missing key',
        target: '{"name": "Ada", "city": "Lagos"}',
        args: '"score", 0',
        code: 'd = {"name": "Ada", "city": "Lagos"}\nd.get("score", 0)',
        returned: '0',
        afterState: '{"name": "Ada", "city": "Lagos"} (dictionary unchanged)',
      },
    ],
    edgeCases: ['Avoids KeyError when querying arbitrary or user-supplied dictionary keys.'],
    commonErrors: [],
    relatedMethods: ['setdefault', 'keys', 'values'],
    introducedInDay: 8,
  },
  {
    name: 'update',
    type: 'dict',
    signature: 'dict.update([other], **kwargs) -> None',
    purpose: 'Update the dictionary with the key/value pairs from other, overwriting existing keys.',
    parameters: [
      { name: 'other', type: 'dict | iterable', required: true, description: 'Key/value pairs to merge.' },
    ],
    mutates: true,
    returnsNew: false,
    returnType: 'None',
    defaultTarget: '{"a": 1, "b": 2}',
    defaultArgs: '{"b": 99, "c": 3}',
    examples: [
      {
        description: 'Merge and overwrite existing keys',
        target: '{"a": 1, "b": 2}',
        args: '{"b": 99, "c": 3}',
        code: 'd = {"a": 1, "b": 2}\nd.update({"b": 99, "c": 3})',
        returned: 'None',
        afterState: '{"a": 1, "b": 99, "c": 3} (modified in place)',
      },
    ],
    edgeCases: ['In-place modification; does not return the updated dictionary.'],
    commonErrors: [],
    relatedMethods: ['get', 'pop'],
    introducedInDay: 8,
  },
];
