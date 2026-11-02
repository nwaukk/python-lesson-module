/**
 * Appearance Studio Drawer & Live Preview Engine
 * Full implementation of Section 4 of the Master Specification.
 */

import React, { useState } from 'react';
import {
  X,
  RotateCcw,
  Sun,
  Moon,
  Laptop,
  Check,
  Type,
  Layout,
  Palette,
  Sliders,
  Sparkles,
  Download,
  Upload,
  Bookmark,
  Eye,
  AlertCircle,
  Wand2,
} from 'lucide-react';
import { useSettings } from '../store/settingsContext';
import { THEME_PRESETS, getContrastRatio, getWcagRating, suggestContrastFix } from './themes';
import {
  ACCENT_SWATCHES,
  DATA_TYPES,
  EDITOR_THEMES,
  LayoutPreset,
  SurfaceStyle,
  Density,
  CornerRadius,
  ContentWidth,
  MotionMode,
} from './tokens';

export const AppearanceStudio: React.FC = () => {
  const {
    settings,
    updateSettings,
    setThemePreset,
    setAccentColor,
    setTextSize,
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
  } = useSettings();

  const [activeTab, setActiveTab] = useState<'themes' | 'custom-colors' | 'typography' | 'layout' | 'motion' | 'profiles'>('themes');
  const [newProfileName, setNewProfileName] = useState('');
  const [importFeedback, setImportFeedback] = useState<string | null>(null);

  if (!isAppearanceStudioOpen) return null;

  // Live WCAG contrast checks
  const textOnBgContrast = getContrastRatio(settings.customColors.textMain, settings.customColors.background);
  const textOnBgRating = getWcagRating(textOnBgContrast);

  const textOnSurfaceContrast = getContrastRatio(settings.customColors.textMain, settings.customColors.surface);
  const textOnSurfaceRating = getWcagRating(textOnSurfaceContrast);

  const accentOnBgContrast = getContrastRatio(settings.customColors.accent, settings.customColors.background);
  const accentOnBgRating = getWcagRating(accentOnBgContrast);

  const handleFixTextContrast = () => {
    const fixed = suggestContrastFix(settings.customColors.textMain, settings.customColors.surface);
    updateSettings((prev) => ({
      ...prev,
      customColors: { ...prev.customColors, textMain: fixed },
    }));
  };

  const handleFixAccentContrast = () => {
    const fixed = suggestContrastFix(settings.customColors.accent, settings.customColors.background);
    updateSettings((prev) => ({
      ...prev,
      customColors: { ...prev.customColors, accent: fixed },
    }));
  };

  const handleExport = () => {
    const json = exportSettingsJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pvl-appearance-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = importSettingsJson(content);
      if (ok) {
        setImportFeedback('Settings imported successfully!');
      } else {
        setImportFeedback('Invalid appearance profile JSON.');
      }
      setTimeout(() => setImportFeedback(null), 3500);
    };
    reader.readAsText(file);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="appearance-studio-title"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end"
    >
      <div className="w-full max-w-xl h-full bg-[var(--bg-app)] border-l border-[var(--border-strong)] flex flex-col shadow-2xl transition-transform animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent-primary)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="appearance-studio-title" className="font-bold text-base text-[var(--text-main)]">
                Appearance Studio
              </h2>
              <p className="text-xs text-[var(--text-dim)]">Real-time design token customization</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={resetToDefault}
              title="Reset all settings to default"
              className="p-2 rounded-lg hover:bg-[var(--border-subtle)] text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={() => setIsAppearanceStudioOpen(false)}
              className="p-2 rounded-lg hover:bg-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              aria-label="Close Appearance Studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] flex items-center gap-1 overflow-x-auto text-xs font-medium">
          {[
            { id: 'themes', label: 'Presets & Color', icon: Palette },
            { id: 'custom-colors', label: 'WCAG Palette', icon: Sliders },
            { id: 'typography', label: 'Typography', icon: Type },
            { id: 'layout', label: 'Layout & Editor', icon: Layout },
            { id: 'motion', label: 'Motion', icon: Sparkles },
            { id: 'profiles', label: 'Profiles', icon: Bookmark },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[var(--accent-primary)] text-[var(--accent-on)] font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-subtle)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB 1: THEMES & COLOR */}
          {activeTab === 'themes' && (
            <div className="space-y-6">
              {/* Color Mode */}
              <div>
                <span className="eyebrow-label block mb-2">Display Mode</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'system', label: 'System', icon: Laptop },
                  ].map((mode) => {
                    const Icon = mode.icon;
                    const isSelected = settings.colorMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => updateSettings((p) => ({ ...p, colorMode: mode.id as 'dark' | 'light' | 'system' }))}
                        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--text-main)] ring-1 ring-[var(--accent-primary)]'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {mode.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Theme Presets */}
              <div>
                <span className="eyebrow-label block mb-2">Curated Theme Presets (11 Available)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {THEME_PRESETS.map((preset) => {
                    const isSelected = settings.themePresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => setThemePreset(preset.id)}
                        className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                          isSelected
                            ? 'border-[var(--accent-primary)] bg-[var(--bg-surface-elevated)] ring-1 ring-[var(--accent-primary)]'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[var(--text-main)]">{preset.name}</span>
                            {preset.id === 'midnight' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold">
                                Default
                              </span>
                            )}
                          </div>
                          {/* Mini palette dots */}
                          <div className="flex items-center gap-1.5 pt-1">
                            <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: preset.background }} />
                            <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: preset.surface }} />
                            <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: preset.textMain }} />
                            <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: preset.accent }} />
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accent Color Swatches */}
              <div>
                <span className="eyebrow-label block mb-2">Accent Colour</span>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {ACCENT_SWATCHES.map((swatch) => {
                    const isSelected = settings.customColors.accent.toLowerCase() === swatch.hex.toLowerCase();
                    return (
                      <button
                        key={swatch.name}
                        onClick={() => setAccentColor(swatch.hex)}
                        title={swatch.name}
                        className={`w-8 h-8 rounded-full border-2 transition-transform flex items-center justify-center ${
                          isSelected ? 'scale-115 border-white shadow-md' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-slate-900 stroke-[3]" />}
                      </button>
                    );
                  })}
                  {/* Custom Hex Picker */}
                  <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs cursor-pointer">
                    <input
                      type="color"
                      value={settings.customColors.accent}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-4 h-4 rounded cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <span className="font-mono text-[11px] text-[var(--text-muted)]">{settings.customColors.accent}</span>
                  </label>
                </div>
              </div>

              {/* Code Editor Themes */}
              <div>
                <span className="eyebrow-label block mb-2">Code Editor Theme (6 Options)</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EDITOR_THEMES.map((th) => {
                    const isSelected = settings.editorThemeId === th.id;
                    return (
                      <button
                        key={th.id}
                        onClick={() => updateSettings((p) => ({ ...p, editorThemeId: th.id }))}
                        className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          isSelected
                            ? 'border-[var(--accent-primary)] bg-[var(--bg-surface-elevated)] ring-1 ring-[var(--accent-primary)]'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'
                        }`}
                      >
                        <span className="text-xs font-medium text-[var(--text-main)] mb-1">{th.name}</span>
                        <div className="flex items-center gap-1 p-1 rounded" style={{ backgroundColor: th.bg }}>
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: th.syntax.keyword }} />
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: th.syntax.string }} />
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: th.syntax.identifier }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Surface Style */}
              <div>
                <span className="eyebrow-label block mb-2">Surface Finish</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['flat', 'soft', 'glass'] as SurfaceStyle[]).map((style) => (
                    <button
                      key={style}
                      onClick={() => setSurfaceStyle(style)}
                      className={`py-2 px-3 rounded-xl border text-xs capitalize font-medium ${
                        settings.surfaceStyle === style
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--text-main)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)]'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WCAG PALETTE & CONTRAST ANALYZER */}
          {activeTab === 'custom-colors' && (
            <div className="space-y-6">
              {/* WCAG Contrast Health Check */}
              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="eyebrow-label">WCAG 2.2 Contrast Health</span>
                  <Eye className="w-4 h-4 text-[var(--text-dim)]" />
                </div>

                {/* Text on Surface */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-main)]">Primary Text on Surface</div>
                    <div className="text-[11px] text-[var(--text-dim)]">Ratio: {textOnSurfaceContrast}:1</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold"
                      style={{ backgroundColor: `${textOnSurfaceRating.color}20`, color: textOnSurfaceRating.color }}
                    >
                      {textOnSurfaceRating.badge}
                    </span>
                    {!textOnSurfaceRating.isAccessible && (
                      <button
                        onClick={handleFixTextContrast}
                        className="p-1 rounded bg-[var(--accent-primary)] text-[var(--accent-on)] text-[10px] flex items-center gap-1 font-semibold"
                        title="Auto-adjust text color for WCAG AA compliance"
                      >
                        <Wand2 className="w-3 h-3" /> Auto-Fix
                      </button>
                    )}
                  </div>
                </div>

                {/* Accent on Background */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-main)]">Accent on Canvas</div>
                    <div className="text-[11px] text-[var(--text-dim)]">Ratio: {accentOnBgContrast}:1</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold"
                      style={{ backgroundColor: `${accentOnBgRating.color}20`, color: accentOnBgRating.color }}
                    >
                      {accentOnBgRating.badge}
                    </span>
                    {!accentOnBgRating.isAccessible && (
                      <button
                        onClick={handleFixAccentContrast}
                        className="p-1 rounded bg-[var(--accent-primary)] text-[var(--accent-on)] text-[10px] flex items-center gap-1 font-semibold"
                        title="Auto-adjust accent color for WCAG AA compliance"
                      >
                        <Wand2 className="w-3 h-3" /> Auto-Fix
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Custom Individual Hex Editors */}
              <div>
                <span className="eyebrow-label block mb-2">Palette Editor</span>
                <div className="space-y-2">
                  {[
                    { key: 'background', label: 'Background Canvas', val: settings.customColors.background },
                    { key: 'surface', label: 'Card Surface', val: settings.customColors.surface },
                    { key: 'textMain', label: 'Body Text', val: settings.customColors.textMain },
                    { key: 'accent', label: 'Brand & Action Accent', val: settings.customColors.accent },
                    { key: 'success', label: 'Success Signal', val: settings.customColors.success },
                    { key: 'warning', label: 'Warning Signal', val: settings.customColors.warning },
                    { key: 'error', label: 'Error Signal', val: settings.customColors.error },
                  ].map((field) => (
                    <div
                      key={field.key}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]"
                    >
                      <span className="text-xs font-medium text-[var(--text-main)]">{field.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[var(--text-muted)]">{field.val}</span>
                        <input
                          type="color"
                          value={field.val}
                          onChange={(e) => {
                            const newHex = e.target.value;
                            updateSettings((prev) => ({
                              ...prev,
                              customColors: { ...prev.customColors, [field.key]: newHex },
                            }));
                          }}
                          className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semantic Python Types Chips */}
              <div>
                <span className="eyebrow-label block mb-2">Semantic Data Type Representation</span>
                <p className="text-xs text-[var(--text-dim)] mb-2">
                  Every Python type uses a consistent symbol, label and colour:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.values(DATA_TYPES).map((dt) => (
                    <span
                      key={dt.key}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium border"
                      style={{
                        backgroundColor: `${dt.color}18`,
                        borderColor: `${dt.color}40`,
                        color: dt.color,
                      }}
                      title={`${dt.label}: ${dt.description} (${dt.mutable ? 'Mutable' : 'Immutable'})`}
                    >
                      <span className="font-bold opacity-80">{dt.symbol}</span>
                      <span>{dt.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TYPOGRAPHY */}
          {activeTab === 'typography' && (
            <div className="space-y-6">
              {/* Text Size Slider & Presets */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="eyebrow-label">Interface Text Size</span>
                  <span className="text-xs font-mono font-semibold text-[var(--accent-primary)]">
                    {Math.round(settings.textSize * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.6"
                  step="0.05"
                  value={settings.textSize}
                  onChange={(e) => setTextSize(parseFloat(e.target.value))}
                  className="w-full accent-[var(--accent-primary)] mb-2 cursor-pointer"
                />
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: 'Small', val: 0.85 },
                    { label: 'Default', val: 1.0 },
                    { label: 'Large', val: 1.15 },
                    { label: 'Extra L', val: 1.3 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => setTextSize(preset.val)}
                      className={`py-1 rounded-lg text-xs font-medium border ${
                        Math.abs(settings.textSize - preset.val) < 0.03
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--text-main)]'
                          : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Font Size */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="eyebrow-label">Code & Console Font Size</span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">{settings.codeFontSize} px</span>
                </div>
                <input
                  type="range"
                  min="11"
                  max="26"
                  step="0.5"
                  value={settings.codeFontSize}
                  onChange={(e) => updateSettings((p) => ({ ...p, codeFontSize: parseFloat(e.target.value) }))}
                  className="w-full accent-[var(--accent-primary)] cursor-pointer"
                />
              </div>

              {/* Interface Font Choice */}
              <div>
                <span className="eyebrow-label block mb-2">Interface Typeface</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'inter', label: 'Inter (Standard)', sample: 'Clean modern sans' },
                    { id: 'humanist', label: 'Plus Jakarta', sample: 'Humanist friendly' },
                    { id: 'serif', label: 'Newsreader (Serif)', sample: 'Editorial long-form' },
                    { id: 'system', label: 'System UI', sample: 'Native OS font' },
                  ].map((font) => (
                    <button
                      key={font.id}
                      onClick={() => updateSettings((p) => ({ ...p, interfaceFont: font.id as typeof settings.interfaceFont }))}
                      className={`p-2.5 rounded-xl border text-left ${
                        settings.interfaceFont === font.id
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] ring-1 ring-[var(--accent-primary)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'
                      }`}
                    >
                      <div className="text-xs font-semibold text-[var(--text-main)]">{font.label}</div>
                      <div className="text-[11px] text-[var(--text-dim)]">{font.sample}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Font & Ligatures */}
              <div>
                <span className="eyebrow-label block mb-2">Code Monospace Font</span>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { id: 'jetbrains', label: 'JetBrains Mono' },
                    { id: 'fira', label: 'Fira Code' },
                    { id: 'monospace', label: 'System Mono' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => updateSettings((p) => ({ ...p, codeFont: f.id as typeof settings.codeFont }))}
                      className={`py-2 px-2 rounded-xl border text-xs font-mono text-center ${
                        settings.codeFont === f.id
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--text-main)]'
                          : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <label className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] cursor-pointer">
                  <span className="text-xs font-medium text-[var(--text-main)]">Enable Code Font Ligatures (=&gt;, !=)</span>
                  <input
                    type="checkbox"
                    checked={settings.fontLigatures}
                    onChange={(e) => updateSettings((p) => ({ ...p, fontLigatures: e.target.checked }))}
                    className="w-4 h-4 accent-[var(--accent-primary)]"
                  />
                </label>
              </div>

              {/* Reading Comfort Mode */}
              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-main)]">Reading Comfort Mode</div>
                    <div className="text-[11px] text-[var(--text-dim)]">Generous line height, optimal line width & soothing tone</div>
                  </div>
                  <button
                    onClick={toggleReadingComfort}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      settings.readingComfort
                        ? 'bg-[var(--accent-primary)] text-[var(--accent-on)]'
                        : 'border border-[var(--border-subtle)] text-[var(--text-muted)]'
                    }`}
                  >
                    {settings.readingComfort ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LAYOUT & EDITOR */}
          {activeTab === 'layout' && (
            <div className="space-y-6">
              {/* Workspace Layout Presets */}
              <div>
                <span className="eyebrow-label block mb-2">Workspace Layout Preset</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'guided', label: 'Guided', desc: 'Default 3-Zone Workspace' },
                    { id: 'notebook', label: 'Notebook', desc: 'Reactive card cells' },
                    { id: 'focus', label: 'Focus', desc: 'One panel at a time' },
                    { id: 'side-by-side', label: 'Side-by-Side', desc: 'Visual & code split' },
                    { id: 'stacked', label: 'Stacked', desc: 'Tablet & phone column' },
                    { id: 'teaching', label: 'Teaching', desc: 'Projector mode' },
                  ].map((preset) => {
                    const isSelected = settings.layoutPreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => setLayoutPreset(preset.id as LayoutPreset)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] ring-1 ring-[var(--accent-primary)]'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'
                        }`}
                      >
                        <div className="text-xs font-semibold text-[var(--text-main)]">{preset.label}</div>
                        <div className="text-[11px] text-[var(--text-dim)]">{preset.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Panel Swap */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <div>
                  <div className="text-xs font-semibold text-[var(--text-main)]">Swap Left and Right Panels</div>
                  <div className="text-[11px] text-[var(--text-dim)]">Place Lesson content on right, Coach on left</div>
                </div>
                <button
                  onClick={toggleSwapPanels}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                    settings.swapPanels
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--text-main)]'
                      : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                  }`}
                >
                  {settings.swapPanels ? 'Swapped' : 'Standard'}
                </button>
              </div>

              {/* Density & Radius */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="eyebrow-label block mb-1.5">Density</span>
                  <div className="space-y-1">
                    {(['compact', 'comfortable', 'spacious'] as Density[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDensity(d)}
                        className={`w-full py-1.5 px-2 rounded-lg text-xs capitalize text-left border ${
                          settings.density === d
                            ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--text-main)] font-semibold'
                            : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="eyebrow-label block mb-1.5">Corner Radius</span>
                  <div className="space-y-1">
                    {(['sharp', 'rounded', 'extra-rounded'] as CornerRadius[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => setCornerRadius(r)}
                        className={`w-full py-1.5 px-2 rounded-lg text-xs capitalize text-left border ${
                          settings.cornerRadius === r
                            ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--text-main)] font-semibold'
                            : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                        }`}
                      >
                        {r.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Code Editor Configuration */}
              <div>
                <span className="eyebrow-label block mb-2">Editor Ergonomics</span>
                <div className="space-y-2">
                  {[
                    { key: 'lineNumbers', label: 'Show Line Numbers' },
                    { key: 'wordWrap', label: 'Soft Word Wrap' },
                    { key: 'indentGuides', label: 'Indentation Guides (4 spaces)' },
                    { key: 'bracketMatching', label: 'Highlight Matching Brackets' },
                    { key: 'autoCloseBrackets', label: 'Auto-Close Quotes & Brackets' },
                    { key: 'activeLineHighlight', label: 'Active Line Highlight' },
                  ].map((ed) => (
                    <label
                      key={ed.key}
                      className="flex items-center justify-between p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs cursor-pointer"
                    >
                      <span className="text-[var(--text-main)]">{ed.label}</span>
                      <input
                        type="checkbox"
                        checked={Boolean(settings[ed.key as keyof typeof settings])}
                        onChange={(e) =>
                          updateSettings((prev) => ({
                            ...prev,
                            [ed.key]: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 accent-[var(--accent-primary)]"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MOTION & ANIMATION */}
          {activeTab === 'motion' && (
            <div className="space-y-6">
              <div>
                <span className="eyebrow-label block mb-2">Animation & Motion Mode</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'system', label: 'Follow System', desc: 'Honor OS reduce motion' },
                    { id: 'full', label: 'Full Animation', desc: 'Silky smooth transitions' },
                    { id: 'reduced', label: 'Reduced', desc: 'Minimal essential motion' },
                    { id: 'off', label: 'Motion Off', desc: 'Instant snappy transitions' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMotionMode(m.id as MotionMode)}
                      className={`p-3 rounded-xl border text-left ${
                        settings.motionMode === m.id
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] ring-1 ring-[var(--accent-primary)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'
                      }`}
                    >
                      <div className="text-xs font-semibold text-[var(--text-main)]">{m.label}</div>
                      <div className="text-[11px] text-[var(--text-dim)]">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="eyebrow-label">Simulation Speed Multiplier</span>
                  <span className="text-xs font-mono font-semibold text-[var(--accent-primary)]">
                    {settings.simulationSpeed}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.25"
                  value={settings.simulationSpeed}
                  onChange={(e) =>
                    updateSettings((prev) => ({ ...prev, simulationSpeed: parseFloat(e.target.value) }))
                  }
                  className="w-full accent-[var(--accent-primary)] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[var(--text-dim)] mt-1">
                  <span>0.5x (Deliberate)</span>
                  <span>1.0x (Standard)</span>
                  <span>2.0x (Fast)</span>
                </div>
              </div>

              <label className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs cursor-pointer">
                <div>
                  <div className="font-semibold text-[var(--text-main)]">Auto-play Simulations</div>
                  <div className="text-[11px] text-[var(--text-dim)]">Play visual simulations automatically when reaching step</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoplaySimulations}
                  onChange={(e) =>
                    updateSettings((prev) => ({ ...prev, autoplaySimulations: e.target.checked }))
                  }
                  className="w-4 h-4 accent-[var(--accent-primary)]"
                />
              </label>
            </div>
          )}

          {/* TAB 6: PROFILES & PORTABILITY */}
          {activeTab === 'profiles' && (
            <div className="space-y-6">
              <div>
                <span className="eyebrow-label block mb-2">Save Current Look as Profile</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Classroom Projector, Night Focus"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-dim)]"
                  />
                  <button
                    onClick={() => {
                      saveCurrentProfile(newProfileName);
                      setNewProfileName('');
                    }}
                    disabled={!newProfileName.trim()}
                    className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-[var(--accent-on)] text-xs font-semibold disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div>
                <span className="eyebrow-label block mb-2">Saved Profiles ({profiles.length}/5)</span>
                <div className="space-y-2">
                  {profiles.map((p) => (
                    <div
                      key={p.name}
                      className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-semibold text-[var(--text-main)]">{p.name}</div>
                        <div className="text-[10px] text-[var(--text-dim)]">
                          Theme: {p.settings.themePresetId} • Layout: {p.settings.layoutPreset}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => loadProfile(p.name)}
                          className="px-2.5 py-1 rounded bg-[var(--accent-subtle)] text-[var(--accent-primary)] text-xs font-semibold hover:opacity-80"
                        >
                          Apply
                        </button>
                        {profiles.length > 1 && (
                          <button
                            onClick={() => deleteProfile(p.name)}
                            className="p-1 text-[var(--text-dim)] hover:text-red-400"
                            title="Delete profile"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Import / Export JSON */}
              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3">
                <span className="eyebrow-label block">Backup & Portability</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleExport}
                    className="flex-1 py-2 px-3 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-elevated)] text-xs font-semibold text-[var(--text-main)] flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Export JSON
                  </button>
                  <label className="flex-1 py-2 px-3 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-elevated)] text-xs font-semibold text-[var(--text-main)] flex items-center justify-center gap-1.5 cursor-pointer">
                    <Upload className="w-4 h-4" /> Import JSON
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                  </label>
                </div>
                {importFeedback && (
                  <div className="p-2 rounded bg-[var(--accent-subtle)] text-[var(--accent-primary)] text-xs text-center font-medium">
                    {importFeedback}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ALWAYS VISIBLE LIVE PREVIEW PANEL (Section 4 requirement) */}
          <div className="mt-8 pt-5 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between mb-3">
              <span className="eyebrow-label">Live Appearance Preview</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold">
                Dynamic
              </span>
            </div>

            {/* Sample Lesson Card */}
            <div className="p-4 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="eyebrow-label text-[10px]">CONCEPT DEMONSTRATION</span>
                <span className="badge-real-python px-2 py-0.5 rounded text-[10px] font-bold">
                  REAL PYTHON
                </span>
              </div>

              <h4 className="text-sm font-bold text-[var(--text-main)]">
                Variables as Name-to-Object Bindings
              </h4>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                In Python, a variable is not a labelled storage box. It is an identifier bound by a pointer to a distinct value object in memory.
              </p>

              {/* Sample Code Block with syntax highlight preview */}
              <div className="p-3 rounded-lg bg-black/40 border border-[var(--border-subtle)] font-mono text-xs space-y-1">
                <div>
                  <span className="text-[var(--syntax-comment)]"># Create variable and inspect type</span>
                </div>
                <div>
                  <span className="text-[var(--syntax-keyword)]">message</span>{' '}
                  <span className="text-[var(--syntax-operator)]">=</span>{' '}
                  <span className="text-[var(--syntax-string)]">"Hello Python Visual Lab"</span>
                </div>
                <div>
                  <span className="text-[var(--syntax-builtin)]">print</span>
                  <span className="text-[var(--syntax-identifier)]">(</span>
                  <span className="text-[var(--syntax-builtin)]">len</span>
                  <span className="text-[var(--syntax-identifier)]">(message))</span>
                </div>
              </div>

              {/* Sample Type Badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/30">
                  str: 23 chars
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  int: 23
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between">
          <div className="text-[11px] text-[var(--text-dim)]">
            All appearance changes save instantly to browser storage.
          </div>
          <button
            onClick={() => setIsAppearanceStudioOpen(false)}
            className="px-4 py-2 rounded-[var(--radius-btn)] bg-[var(--accent-primary)] text-[var(--accent-on)] text-xs font-bold hover:opacity-90 transition-opacity"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
