/**
 * Python Visual Lab Design Tokens & Definitions
 * Follows Section 4 of the Master Specification
 */

export interface ThemeColors {
  id: string;
  name: string;
  isDark: boolean;
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceSubtle: string;
  textMain: string;
  textMuted: string;
  textDim: string;
  borderSubtle: string;
  borderStrong: string;
  accent: string;
  accentHover: string;
  accentPressed: string;
  accentSubtle: string;
  accentOn: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface SemanticDataType {
  key: string;
  label: string;
  symbol: string;
  color: string;
  description: string;
  mutable: boolean;
}

export const DATA_TYPES: Record<string, SemanticDataType> = {
  int: { key: 'int', label: 'int', symbol: '#', color: '#38bdf8', description: 'Whole number without fractional part', mutable: false },
  float: { key: 'float', label: 'float', symbol: '.', color: '#06b6d4', description: 'Number with floating decimal point', mutable: false },
  complex: { key: 'complex', label: 'complex', symbol: 'j', color: '#818cf8', description: 'Number with real and imaginary parts', mutable: false },
  str: { key: 'str', label: 'str', symbol: '""', color: '#34d399', description: 'Immutable sequence of Unicode characters', mutable: false },
  bool: { key: 'bool', label: 'bool', symbol: '✓', color: '#fbbf24', description: 'Truth value: True or False (subclass of int)', mutable: false },
  None: { key: 'None', label: 'None', symbol: '∅', color: '#94a3b8', description: 'Absence of value (NoneType object)', mutable: false },
  list: { key: 'list', label: 'list', symbol: '[]', color: '#f472b6', description: 'Mutable ordered collection of elements', mutable: true },
  tuple: { key: 'tuple', label: 'tuple', symbol: '()', color: '#c084fc', description: 'Immutable ordered collection of elements', mutable: false },
  set: { key: 'set', label: 'set', symbol: '{}', color: '#fb923c', description: 'Mutable unordered collection of unique hashable items', mutable: true },
  dict: { key: 'dict', label: 'dict', symbol: '{:}', color: '#a78bfa', description: 'Key-value mapping with insertion order preserved', mutable: true },
  function: { key: 'function', label: 'function', symbol: 'λ', color: '#60a5fa', description: 'Callable object with parameters and return value', mutable: false },
  object: { key: 'object', label: 'object', symbol: '📦', color: '#e879f9', description: 'Instance of a Python class', mutable: true },
};

export interface SyntaxTokens {
  keyword: string;
  builtin: string;
  string: string;
  number: string;
  comment: string;
  operator: string;
  identifier: string;
}

export interface EditorTheme {
  id: string;
  name: string;
  isDark: boolean;
  bg: string;
  fg: string;
  selection: string;
  cursor: string;
  lineHighlight: string;
  syntax: SyntaxTokens;
}

export const EDITOR_THEMES: EditorTheme[] = [
  {
    id: 'one-dark',
    name: 'One Dark',
    isDark: true,
    bg: '#282c34',
    fg: '#abb2bf',
    selection: '#3e4451',
    cursor: '#528bff',
    lineHighlight: '#2c313a',
    syntax: {
      keyword: '#c678dd',
      builtin: '#e5c07b',
      string: '#98c379',
      number: '#d19a66',
      comment: '#5c6370',
      operator: '#56b6c2',
      identifier: '#61afef',
    },
  },
  {
    id: 'monokai',
    name: 'Monokai Pro',
    isDark: true,
    bg: '#272822',
    fg: '#f8f8f2',
    selection: '#49483e',
    cursor: '#f8f8f0',
    lineHighlight: '#3e3d32',
    syntax: {
      keyword: '#f92672',
      builtin: '#66d9ef',
      string: '#e6db74',
      number: '#ae81ff',
      comment: '#75715e',
      operator: '#fd971f',
      identifier: '#a6e22e',
    },
  },
  {
    id: 'dracula',
    name: 'Dracula',
    isDark: true,
    bg: '#282a36',
    fg: '#f8f8f2',
    selection: '#44475a',
    cursor: '#f8f8f0',
    lineHighlight: '#343746',
    syntax: {
      keyword: '#ff79c6',
      builtin: '#8be9fd',
      string: '#f1fa8c',
      number: '#bd93f9',
      comment: '#6272a4',
      operator: '#ffb86c',
      identifier: '#50fa7b',
    },
  },
  {
    id: 'nord',
    name: 'Nord',
    isDark: true,
    bg: '#2e3440',
    fg: '#d8dee9',
    selection: '#434c5e',
    cursor: '#88c0d0',
    lineHighlight: '#3b4252',
    syntax: {
      keyword: '#81a1c1',
      builtin: '#88c0d0',
      string: '#a3be8c',
      number: '#b48ead',
      comment: '#4c566a',
      operator: '#81a1c1',
      identifier: '#d8dee9',
    },
  },
  {
    id: 'github-light',
    name: 'GitHub Light',
    isDark: false,
    bg: '#ffffff',
    fg: '#24292e',
    selection: '#c8e1ff',
    cursor: '#24292e',
    lineHighlight: '#f6f8fa',
    syntax: {
      keyword: '#d73a49',
      builtin: '#6f42c1',
      string: '#032f62',
      number: '#005cc5',
      comment: '#6a737d',
      operator: '#d73a49',
      identifier: '#24292e',
    },
  },
  {
    id: 'solarized-light',
    name: 'Solarized Light',
    isDark: false,
    bg: '#fdf6e3',
    fg: '#657b83',
    selection: '#eee8d5',
    cursor: '#586e75',
    lineHighlight: '#f7f1df',
    syntax: {
      keyword: '#859900',
      builtin: '#268bd2',
      string: '#2aa198',
      number: '#d33682',
      comment: '#93a1a1',
      operator: '#cb4b16',
      identifier: '#b58900',
    },
  },
];

export const ACCENT_SWATCHES = [
  { name: 'Sky Blue', hex: '#38bdf8' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Sapphire', hex: '#3b82f6' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Crimson', hex: '#ef4444' },
  { name: 'Amethyst', hex: '#8b5cf6' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Coral', hex: '#f97316' },
];

export type LayoutPreset = 'guided' | 'notebook' | 'focus' | 'side-by-side' | 'stacked' | 'teaching';
export type SurfaceStyle = 'flat' | 'soft' | 'glass';
export type Density = 'compact' | 'comfortable' | 'spacious';
export type CornerRadius = 'sharp' | 'rounded' | 'extra-rounded';
export type ContentWidth = 'fit' | 'contained' | 'ultra-wide';
export type MotionMode = 'system' | 'full' | 'reduced' | 'off';

export interface AppearanceSettings {
  schemaVersion: 1;
  themePresetId: string;
  colorMode: 'dark' | 'light' | 'system';
  customColors: {
    background: string;
    surface: string;
    textMain: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };
  editorThemeId: string;
  surfaceStyle: SurfaceStyle;
  // Typography
  textSize: number; // 0.8 to 1.6
  codeFontSize: number; // 11 to 28
  interfaceFont: 'system' | 'inter' | 'humanist' | 'serif';
  codeFont: 'jetbrains' | 'fira' | 'monospace';
  fontLigatures: boolean;
  lineHeight: 'tight' | 'comfortable' | 'loose';
  readingComfort: boolean;
  readingWidth: 'narrow' | 'comfortable' | 'wide';
  // Layout
  layoutPreset: LayoutPreset;
  density: Density;
  cornerRadius: CornerRadius;
  contentWidth: ContentWidth;
  swapPanels: boolean; // left and right
  sidebarPosition: 'left' | 'right';
  // Motion
  motionMode: MotionMode;
  simulationSpeed: number; // 0.5 to 2.0
  autoplaySimulations: boolean;
  // Editor
  lineNumbers: boolean;
  wordWrap: boolean;
  indentGuides: boolean;
  bracketMatching: boolean;
  autoCloseBrackets: boolean;
  activeLineHighlight: boolean;
  // Profiles
  profileName: string;
}

export const DEFAULT_APPEARANCE_SETTINGS: AppearanceSettings = {
  schemaVersion: 1,
  themePresetId: 'midnight',
  colorMode: 'dark',
  customColors: {
    background: '#0f172a',
    surface: '#1e293b',
    textMain: '#f8fafc',
    accent: '#38bdf8',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  editorThemeId: 'one-dark',
  surfaceStyle: 'soft',
  textSize: 1.0,
  codeFontSize: 13.5,
  interfaceFont: 'inter',
  codeFont: 'jetbrains',
  fontLigatures: true,
  lineHeight: 'comfortable',
  readingComfort: false,
  readingWidth: 'comfortable',
  layoutPreset: 'guided',
  density: 'comfortable',
  cornerRadius: 'rounded',
  contentWidth: 'contained',
  swapPanels: false,
  sidebarPosition: 'left',
  motionMode: 'system',
  simulationSpeed: 1.0,
  autoplaySimulations: true,
  lineNumbers: true,
  wordWrap: true,
  indentGuides: true,
  bracketMatching: true,
  autoCloseBrackets: true,
  activeLineHighlight: true,
  profileName: 'Default',
};
