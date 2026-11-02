/**
 * Settings and Appearance Context
 * Manages live styling, tokens, layout presets, and theme profiles.
 */

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  AppearanceSettings,
  DEFAULT_APPEARANCE_SETTINGS,
  LayoutPreset,
  SurfaceStyle,
  Density,
  CornerRadius,
  ContentWidth,
  MotionMode,
} from '../design/tokens';
import {
  THEME_PRESETS,
  deriveAccentColors,
} from '../design/themes';
import { storage } from './storageAdapter';

interface AppearanceProfile {
  name: string;
  savedAt: string;
  settings: AppearanceSettings;
}

interface SettingsContextValue {
  settings: AppearanceSettings;
  updateSettings: (updater: (prev: AppearanceSettings) => AppearanceSettings) => void;
  setThemePreset: (presetId: string) => void;
  setAccentColor: (accentHex: string) => void;
  setTextSize: (scale: number) => void;
  stepTextSize: (direction: 'increase' | 'decrease') => void;
  setLayoutPreset: (layout: LayoutPreset) => void;
  setSurfaceStyle: (style: SurfaceStyle) => void;
  setDensity: (density: Density) => void;
  setCornerRadius: (radius: CornerRadius) => void;
  setContentWidth: (width: ContentWidth) => void;
  setMotionMode: (mode: MotionMode) => void;
  toggleReadingComfort: () => void;
  toggleSwapPanels: () => void;
  isAppearanceStudioOpen: boolean;
  setIsAppearanceStudioOpen: (open: boolean) => void;
  resetToDefault: () => void;
  profiles: AppearanceProfile[];
  saveCurrentProfile: (name: string) => void;
  loadProfile: (name: string) => void;
  deleteProfile: (name: string) => void;
  exportSettingsJson: () => string;
  importSettingsJson: (jsonStr: string) => boolean;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppearanceSettings>(() => {
    return storage.getItem<AppearanceSettings>('appearance_settings', DEFAULT_APPEARANCE_SETTINGS);
  });

  const [profiles, setProfiles] = useState<AppearanceProfile[]>(() => {
    return storage.getItem<AppearanceProfile[]>('appearance_profiles', [
      { name: 'Default Dark', savedAt: new Date().toISOString(), settings: DEFAULT_APPEARANCE_SETTINGS },
    ]);
  });

  const [isAppearanceStudioOpen, setIsAppearanceStudioOpen] = useState(false);

  // Sync settings with DOM and storage
  useEffect(() => {
    storage.setItem('appearance_settings', settings);

    const root = document.documentElement;
    const activePreset = THEME_PRESETS.find((p) => p.id === settings.themePresetId) || THEME_PRESETS[0];

    // Check system preference if mode is 'system'
    let isDark = activePreset.isDark;
    if (settings.colorMode === 'system') {
      isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Colors
    const bg = settings.customColors.background || activePreset.background;
    const surface = settings.customColors.surface || activePreset.surface;
    const textMain = settings.customColors.textMain || activePreset.textMain;
    const accent = settings.customColors.accent || activePreset.accent;
    const { hover, pressed, subtle, onAccent } = deriveAccentColors(accent);

    root.style.setProperty('--bg-app', bg);
    root.style.setProperty('--bg-surface', surface);
    root.style.setProperty('--bg-surface-elevated', isDark ? '#1f2937' : '#e2e8f0');
    root.style.setProperty('--bg-surface-subtle', isDark ? 'rgba(17, 24, 39, 0.75)' : 'rgba(255, 255, 255, 0.85)');
    
    root.style.setProperty('--text-main', textMain);
    root.style.setProperty('--text-muted', isDark ? '#9ca3af' : '#475569');
    root.style.setProperty('--text-dim', isDark ? '#6b7280' : '#64748b');

    root.style.setProperty('--border-subtle', isDark ? '#1f2937' : '#e2e8f0');
    root.style.setProperty('--border-strong', isDark ? '#374151' : '#cbd5e1');

    root.style.setProperty('--accent-primary', accent);
    root.style.setProperty('--accent-hover', hover);
    root.style.setProperty('--accent-pressed', pressed);
    root.style.setProperty('--accent-subtle', subtle);
    root.style.setProperty('--accent-on', onAccent);

    root.style.setProperty('--color-success', settings.customColors.success || activePreset.success);
    root.style.setProperty('--color-warning', settings.customColors.warning || activePreset.warning);
    root.style.setProperty('--color-error', settings.customColors.error || activePreset.error);

    // Typography
    root.style.setProperty('--text-scale', settings.textSize.toString());
    root.style.setProperty('--code-font-size', `${settings.codeFontSize}px`);

    let fontInterface = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    if (settings.interfaceFont === 'humanist') {
      fontInterface = "'Plus Jakarta Sans', sans-serif";
    } else if (settings.interfaceFont === 'serif') {
      fontInterface = "'Newsreader', Georgia, serif";
    } else if (settings.interfaceFont === 'system') {
      fontInterface = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    }
    root.style.setProperty('--font-interface', fontInterface);

    let fontCode = "'JetBrains Mono', monospace";
    if (settings.codeFont === 'fira') {
      fontCode = "'Fira Code', monospace";
    } else if (settings.codeFont === 'monospace') {
      fontCode = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    }
    root.style.setProperty('--font-code', fontCode);
    root.style.setProperty('--font-ligatures', settings.fontLigatures ? 'normal' : 'none');

    // Reading comfort
    if (settings.readingComfort) {
      root.style.setProperty('--reading-max-width', '65ch');
      root.style.setProperty('--line-height-mult', '1.8');
      root.style.setProperty('--letter-spacing', '0.015em');
    } else {
      const maxWidth = settings.readingWidth === 'narrow' ? '65ch' : settings.readingWidth === 'wide' ? '90ch' : '75ch';
      const lineH = settings.lineHeight === 'tight' ? '1.4' : settings.lineHeight === 'loose' ? '1.8' : '1.6';
      root.style.setProperty('--reading-max-width', maxWidth);
      root.style.setProperty('--line-height-mult', lineH);
      root.style.setProperty('--letter-spacing', 'normal');
    }

    // Corner Radii
    const cardRad = settings.cornerRadius === 'sharp' ? '0px' : settings.cornerRadius === 'extra-rounded' ? '18px' : '12px';
    const btnRad = settings.cornerRadius === 'sharp' ? '0px' : settings.cornerRadius === 'extra-rounded' ? '12px' : '8px';
    root.style.setProperty('--radius-card', cardRad);
    root.style.setProperty('--radius-btn', btnRad);

    // Spacing Density
    const densityMult = settings.density === 'compact' ? '0.85' : settings.density === 'spacious' ? '1.2' : '1.0';
    root.style.setProperty('--spacing-density', densityMult);

    // Body class for dark / light
    if (isDark) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [settings]);

  const updateSettings = useCallback((updater: (prev: AppearanceSettings) => AppearanceSettings) => {
    setSettings((prev) => updater(prev));
  }, []);

  const setThemePreset = useCallback((presetId: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    updateSettings((prev) => ({
      ...prev,
      themePresetId: presetId,
      colorMode: preset.isDark ? 'dark' : 'light',
      customColors: {
        background: preset.background,
        surface: preset.surface,
        textMain: preset.textMain,
        accent: preset.accent,
        success: preset.success,
        warning: preset.warning,
        error: preset.error,
      },
    }));
  }, [updateSettings]);

  const setAccentColor = useCallback((accentHex: string) => {
    updateSettings((prev) => ({
      ...prev,
      customColors: {
        ...prev.customColors,
        accent: accentHex,
      },
    }));
  }, [updateSettings]);

  const setTextSize = useCallback((scale: number) => {
    const bounded = Math.max(0.8, Math.min(1.6, Number(scale.toFixed(2))));
    updateSettings((prev) => ({ ...prev, textSize: bounded }));
  }, [updateSettings]);

  const stepTextSize = useCallback((direction: 'increase' | 'decrease') => {
    updateSettings((prev) => {
      const step = 0.08;
      const next = direction === 'increase' ? prev.textSize + step : prev.textSize - step;
      return { ...prev, textSize: Math.max(0.8, Math.min(1.6, Number(next.toFixed(2)))) };
    });
  }, [updateSettings]);

  const setLayoutPreset = useCallback((layout: LayoutPreset) => {
    updateSettings((prev) => ({ ...prev, layoutPreset: layout }));
  }, [updateSettings]);

  const setSurfaceStyle = useCallback((style: SurfaceStyle) => {
    updateSettings((prev) => ({ ...prev, surfaceStyle: style }));
  }, [updateSettings]);

  const setDensity = useCallback((density: Density) => {
    updateSettings((prev) => ({ ...prev, density }));
  }, [updateSettings]);

  const setCornerRadius = useCallback((radius: CornerRadius) => {
    updateSettings((prev) => ({ ...prev, cornerRadius: radius }));
  }, [updateSettings]);

  const setContentWidth = useCallback((width: ContentWidth) => {
    updateSettings((prev) => ({ ...prev, contentWidth: width }));
  }, [updateSettings]);

  const setMotionMode = useCallback((mode: MotionMode) => {
    updateSettings((prev) => ({ ...prev, motionMode: mode }));
  }, [updateSettings]);

  const toggleReadingComfort = useCallback(() => {
    updateSettings((prev) => ({ ...prev, readingComfort: !prev.readingComfort }));
  }, [updateSettings]);

  const toggleSwapPanels = useCallback(() => {
    updateSettings((prev) => ({ ...prev, swapPanels: !prev.swapPanels }));
  }, [updateSettings]);

  const resetToDefault = useCallback(() => {
    setSettings(DEFAULT_APPEARANCE_SETTINGS);
    storage.removeItem('appearance_settings');
  }, []);

  const saveCurrentProfile = useCallback((name: string) => {
    if (!name.trim()) return;
    const newProfiles = [
      ...profiles.filter((p) => p.name !== name),
      { name: name.trim(), savedAt: new Date().toISOString(), settings },
    ].slice(0, 5);
    setProfiles(newProfiles);
    storage.setItem('appearance_profiles', newProfiles);
  }, [profiles, settings]);

  const loadProfile = useCallback((name: string) => {
    const prof = profiles.find((p) => p.name === name);
    if (prof) {
      setSettings(prof.settings);
    }
  }, [profiles]);

  const deleteProfile = useCallback((name: string) => {
    const newProfiles = profiles.filter((p) => p.name !== name);
    setProfiles(newProfiles);
    storage.setItem('appearance_profiles', newProfiles);
  }, [profiles]);

  const exportSettingsJson = useCallback((): string => {
    return JSON.stringify({
      app: 'Python Visual Lab',
      type: 'appearance_profile',
      exportedAt: new Date().toISOString(),
      settings,
    }, null, 2);
  }, [settings]);

  const importSettingsJson = useCallback((jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.settings && parsed.settings.schemaVersion === 1) {
        setSettings(parsed.settings);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({
      settings,
      updateSettings,
      setThemePreset,
      setAccentColor,
      setTextSize,
      stepTextSize,
      setLayoutPreset,
      setSurfaceStyle,
      setDensity,
      setCornerRadius,
      setContentWidth,
      setMotionMode,
      toggleReadingComfort,
      toggleSwapPanels,
      isAppearanceStudioOpen,
      setIsAppearanceStudioOpen,
      resetToDefault,
      profiles,
      saveCurrentProfile,
      loadProfile,
      deleteProfile,
      exportSettingsJson,
      importSettingsJson,
    }),
    [
      settings,
      updateSettings,
      setThemePreset,
      setAccentColor,
      setTextSize,
      stepTextSize,
      setLayoutPreset,
      setSurfaceStyle,
      setDensity,
      setCornerRadius,
      setContentWidth,
      setMotionMode,
      toggleReadingComfort,
      toggleSwapPanels,
      isAppearanceStudioOpen,
      resetToDefault,
      profiles,
      saveCurrentProfile,
      loadProfile,
      deleteProfile,
      exportSettingsJson,
      importSettingsJson,
    ]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextValue => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
