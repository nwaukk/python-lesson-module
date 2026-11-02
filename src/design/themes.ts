/**
 * Python Visual Lab Themes & WCAG Accessibility Engine
 * Implements Section 4: 11 Theme presets and live WCAG contrast analyzer with auto-fix.
 */

import { ThemeColors } from './tokens';

export const THEME_PRESETS: ThemeColors[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    isDark: true,
    background: '#090d16',
    surface: '#111827',
    surfaceElevated: '#1f2937',
    surfaceSubtle: 'rgba(17, 24, 39, 0.75)',
    textMain: '#f9fafb',
    textMuted: '#9ca3af',
    textDim: '#6b7280',
    borderSubtle: '#1f2937',
    borderStrong: '#374151',
    accent: '#38bdf8',
    accentHover: '#0284c7',
    accentPressed: '#0369a1',
    accentSubtle: 'rgba(56, 189, 248, 0.15)',
    accentOn: '#090d16',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
  },
  {
    id: 'graphite',
    name: 'Graphite',
    isDark: true,
    background: '#121212',
    surface: '#1e1e1e',
    surfaceElevated: '#2a2a2a',
    surfaceSubtle: 'rgba(30, 30, 30, 0.8)',
    textMain: '#e0e0e0',
    textMuted: '#a0a0a0',
    textDim: '#707070',
    borderSubtle: '#2c2c2c',
    borderStrong: '#3d3d3d',
    accent: '#10b981',
    accentHover: '#059669',
    accentPressed: '#047857',
    accentSubtle: 'rgba(16, 185, 129, 0.15)',
    accentOn: '#121212',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#14b8a6',
  },
  {
    id: 'daylight',
    name: 'Daylight',
    isDark: false,
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceElevated: '#f1f5f9',
    surfaceSubtle: 'rgba(255, 255, 255, 0.85)',
    textMain: '#0f172a',
    textMuted: '#475569',
    textDim: '#64748b',
    borderSubtle: '#e2e8f0',
    borderStrong: '#cbd5e1',
    accent: '#0284c7',
    accentHover: '#0369a1',
    accentPressed: '#075985',
    accentSubtle: 'rgba(2, 132, 199, 0.12)',
    accentOn: '#ffffff',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#0891b2',
  },
  {
    id: 'paper',
    name: 'Paper (Editorial)',
    isDark: false,
    background: '#fcfbf7',
    surface: '#f6f3eb',
    surfaceElevated: '#ece7db',
    surfaceSubtle: 'rgba(246, 243, 235, 0.85)',
    textMain: '#2b2723',
    textMuted: '#5d554d',
    textDim: '#7e756b',
    borderSubtle: '#e4decf',
    borderStrong: '#d1c8b4',
    accent: '#b45309',
    accentHover: '#92400e',
    accentPressed: '#78350f',
    accentSubtle: 'rgba(180, 83, 9, 0.12)',
    accentOn: '#ffffff',
    success: '#2e7d32',
    warning: '#b45309',
    error: '#c62828',
    info: '#0284c7',
  },
  {
    id: 'ocean',
    name: 'Ocean Deep',
    isDark: true,
    background: '#04131f',
    surface: '#0b2034',
    surfaceElevated: '#132f4c',
    surfaceSubtle: 'rgba(11, 32, 52, 0.8)',
    textMain: '#e2f1fc',
    textMuted: '#93b9d8',
    textDim: '#6289ab',
    borderSubtle: '#173b5f',
    borderStrong: '#23507d',
    accent: '#00c4e6',
    accentHover: '#00a3bf',
    accentPressed: '#008399',
    accentSubtle: 'rgba(0, 196, 230, 0.15)',
    accentOn: '#04131f',
    success: '#10b981',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#38bdf8',
  },
  {
    id: 'forest',
    name: 'Forest Pine',
    isDark: true,
    background: '#07160f',
    surface: '#0f241a',
    surfaceElevated: '#173628',
    surfaceSubtle: 'rgba(15, 36, 26, 0.8)',
    textMain: '#e8f5e9',
    textMuted: '#9ec4ab',
    textDim: '#6c967a',
    borderSubtle: '#1b4332',
    borderStrong: '#2d6a4f',
    accent: '#4ade80',
    accentHover: '#22c55e',
    accentPressed: '#16a34a',
    accentSubtle: 'rgba(74, 222, 128, 0.15)',
    accentOn: '#07160f',
    success: '#4ade80',
    warning: '#facc15',
    error: '#f87171',
    info: '#2dd4bf',
  },
  {
    id: 'violet-night',
    name: 'Violet Night',
    isDark: true,
    background: '#120b22',
    surface: '#1c1333',
    surfaceElevated: '#281c47',
    surfaceSubtle: 'rgba(28, 19, 51, 0.8)',
    textMain: '#f3e8ff',
    textMuted: '#c084fc',
    textDim: '#8b5cf6',
    borderSubtle: '#33235b',
    borderStrong: '#4c3585',
    accent: '#d8b4fe',
    accentHover: '#c084fc',
    accentPressed: '#a855f7',
    accentSubtle: 'rgba(216, 180, 254, 0.15)',
    accentOn: '#120b22',
    success: '#34d399',
    warning: '#fcd34d',
    error: '#f87171',
    info: '#818cf8',
  },
  {
    id: 'solar',
    name: 'Solar Obsidian',
    isDark: true,
    background: '#14100b',
    surface: '#211c15',
    surfaceElevated: '#31291f',
    surfaceSubtle: 'rgba(33, 28, 21, 0.8)',
    textMain: '#fef3c7',
    textMuted: '#d97706',
    textDim: '#92400e',
    borderSubtle: '#3d3224',
    borderStrong: '#574632',
    accent: '#f59e0b',
    accentHover: '#d97706',
    accentPressed: '#b45309',
    accentSubtle: 'rgba(245, 158, 11, 0.15)',
    accentOn: '#14100b',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#f97316',
  },
  {
    id: 'high-contrast-dark',
    name: 'High-contrast Dark (AAA)',
    isDark: true,
    background: '#000000',
    surface: '#0a0a0a',
    surfaceElevated: '#1a1a1a',
    surfaceSubtle: '#0a0a0a',
    textMain: '#ffffff',
    textMuted: '#e0e0e0',
    textDim: '#cccccc',
    borderSubtle: '#444444',
    borderStrong: '#ffffff',
    accent: '#ffff00',
    accentHover: '#ffee00',
    accentPressed: '#dddd00',
    accentSubtle: 'rgba(255, 255, 0, 0.2)',
    accentOn: '#000000',
    success: '#00ff66',
    warning: '#ffff00',
    error: '#ff3333',
    info: '#00ffff',
  },
  {
    id: 'high-contrast-light',
    name: 'High-contrast Light (AAA)',
    isDark: false,
    background: '#ffffff',
    surface: '#f4f4f4',
    surfaceElevated: '#e8e8e8',
    surfaceSubtle: '#f4f4f4',
    textMain: '#000000',
    textMuted: '#1a1a1a',
    textDim: '#333333',
    borderSubtle: '#767676',
    borderStrong: '#000000',
    accent: '#0033cc',
    accentHover: '#002299',
    accentPressed: '#001166',
    accentSubtle: 'rgba(0, 51, 204, 0.15)',
    accentOn: '#ffffff',
    success: '#006600',
    warning: '#7a4500',
    error: '#b30000',
    info: '#0033cc',
  },
  {
    id: 'colour-blind-safe',
    name: 'Colour-Blind Safe (Okabe-Ito)',
    isDark: true,
    background: '#0e1726',
    surface: '#172338',
    surfaceElevated: '#243550',
    surfaceSubtle: 'rgba(23, 35, 56, 0.8)',
    textMain: '#f0f4f8',
    textMuted: '#a5b4c9',
    textDim: '#6b7d99',
    borderSubtle: '#2c4060',
    borderStrong: '#445f8a',
    accent: '#e69f00', // Vermilion/Amber compliant
    accentHover: '#cc8c00',
    accentPressed: '#b37b00',
    accentSubtle: 'rgba(230, 159, 0, 0.18)',
    accentOn: '#0e1726',
    success: '#0072b2', // Cobalt blue
    warning: '#e69f00',
    error: '#d55e00', // Vermilion
    info: '#56b4e9', // Sky blue
  },
];

/* WCAG Contrast Engine (Formula from W3C WCAG 2.1) */

function parseHex(hex: string): { r: number; g: number; b: number } | null {
  let cleaned = hex.trim().replace('#', '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map((c) => c + c).join('');
  }
  if (cleaned.length !== 6) return null;
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function channelLuminance(value: number): number {
  const norm = value / 255;
  return norm <= 0.03928 ? norm / 12.92 : Math.pow((norm + 0.055) / 1.055, 2.4);
}

export function calculateRelativeLuminance(hex: string): number {
  const rgb = parseHex(hex);
  if (!rgb) return 0.5;
  const r = channelLuminance(rgb.r);
  const g = channelLuminance(rgb.g);
  const b = channelLuminance(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(fgHex: string, bgHex: string): number {
  const l1 = calculateRelativeLuminance(fgHex);
  const l2 = calculateRelativeLuminance(bgHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Number(ratio.toFixed(2));
}

export function getWcagRating(ratio: number): {
  badge: 'AAA' | 'AA' | 'Fail';
  color: string;
  isAccessible: boolean;
  label: string;
} {
  if (ratio >= 7.0) {
    return { badge: 'AAA', color: '#10b981', isAccessible: true, label: 'Superb (AAA)' };
  } else if (ratio >= 4.5) {
    return { badge: 'AA', color: '#22c55e', isAccessible: true, label: 'Compliant (AA)' };
  } else if (ratio >= 3.0) {
    return { badge: 'Fail', color: '#f59e0b', isAccessible: false, label: 'Large Text Only (3:1)' };
  } else {
    return { badge: 'Fail', color: '#ef4444', isAccessible: false, label: 'Fails WCAG AA (<4.5:1)' };
  }
}

/**
 * Suggests an automated color adjustment to meet WCAG AA (>= 4.5:1)
 */
export function suggestContrastFix(fgHex: string, bgHex: string): string {
  const bgLum = calculateRelativeLuminance(bgHex);
  // If background is dark, brighten fg; if light, darken fg
  const shouldBrighten = bgLum < 0.5;
  const rgb = parseHex(fgHex);
  if (!rgb) return shouldBrighten ? '#ffffff' : '#000000';

  let current = { ...rgb };
  for (let step = 0; step < 20; step++) {
    if (shouldBrighten) {
      current.r = Math.min(255, current.r + 15);
      current.g = Math.min(255, current.g + 15);
      current.b = Math.min(255, current.b + 15);
    } else {
      current.r = Math.max(0, current.r - 15);
      current.g = Math.max(0, current.g - 15);
      current.b = Math.max(0, current.b - 15);
    }
    const testHex = `#${current.r.toString(16).padStart(2, '0')}${current.g.toString(16).padStart(2, '0')}${current.b.toString(16).padStart(2, '0')}`;
    if (getContrastRatio(testHex, bgHex) >= 4.5) {
      return testHex;
    }
  }
  return shouldBrighten ? '#ffffff' : '#000000';
}

/**
 * Derives hover, pressed, subtle and contrast-on color for an accent
 */
export function deriveAccentColors(accentHex: string): {
  hover: string;
  pressed: string;
  subtle: string;
  onAccent: string;
} {
  const rgb = parseHex(accentHex) || { r: 56, g: 189, b: 248 };
  const lum = calculateRelativeLuminance(accentHex);
  const onAccent = lum > 0.4 ? '#090d16' : '#ffffff';
  
  // Hover & pressed (darker by 12% and 24%)
  const hoverR = Math.max(0, Math.floor(rgb.r * 0.88));
  const hoverG = Math.max(0, Math.floor(rgb.g * 0.88));
  const hoverB = Math.max(0, Math.floor(rgb.b * 0.88));
  const hover = `#${hoverR.toString(16).padStart(2, '0')}${hoverG.toString(16).padStart(2, '0')}${hoverB.toString(16).padStart(2, '0')}`;

  const pressR = Math.max(0, Math.floor(rgb.r * 0.76));
  const pressG = Math.max(0, Math.floor(rgb.g * 0.76));
  const pressB = Math.max(0, Math.floor(rgb.b * 0.76));
  const pressed = `#${pressR.toString(16).padStart(2, '0')}${pressG.toString(16).padStart(2, '0')}${pressB.toString(16).padStart(2, '0')}`;

  const subtle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.16)`;

  return { hover, pressed, subtle, onAccent };
}
