/**
 * Versioned Progress & Workspace Backup Manager
 * Exports and imports a single .json file capturing all user state stored in IndexedDB:
 * completed days/subtopics, quiz/exercise scores, notes, code snippets, appearance settings, and last position.
 */

import { storage, STORAGE_VERSION } from './storageAdapter';
import { DEFAULT_APPEARANCE_SETTINGS, AppearanceSettings } from '../design/tokens';

export const BACKUP_SCHEMA_VERSION = 1;

export interface SavedCodeSnippet {
  id: string;
  name: string;
  code: string;
  updatedAt: string;
}

export interface PersistedPlaygroundState {
  schemaVersion: 1;
  activeCode: string;
  activeFilePath?: string;
  activeFileName?: string;
  savedSnippets: SavedCodeSnippet[];
}

export interface PersistedLastPosition {
  schemaVersion: 1;
  route: string;
  day: number;
  subtopic: number;
  mobileTab?: 'concept' | 'visualise' | 'code' | 'output' | 'practise';
  updatedAt: string;
}

export interface FullProgressBackupPayload {
  app: 'Python Visual Lab';
  backupType: 'full_progress_backup';
  schemaVersion: number;
  storageVersion: number;
  exportedAt: string;
  data: Record<string, unknown>;
}

export interface ImportBackupResult {
  ok: boolean;
  message: string;
  restoredKeys: string[];
}

function mergeProgressData(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const today = new Date().toISOString().slice(0, 10);
  return {
    schemaVersion: 1,
    completedDays: Array.isArray(obj.completedDays) ? obj.completedDays : [],
    completedSubtopics: Array.isArray(obj.completedSubtopics) ? obj.completedSubtopics : [],
    bookmarks: Array.isArray(obj.bookmarks) ? obj.bookmarks : [],
    notes: obj.notes && typeof obj.notes === 'object' ? obj.notes : {},
    streakDays: typeof obj.streakDays === 'number' ? obj.streakDays : 1,
    lastStudiedDate: typeof obj.lastStudiedDate === 'string' ? obj.lastStudiedDate : today,
    exerciseScores: obj.exerciseScores && typeof obj.exerciseScores === 'object' ? obj.exerciseScores : {},
    quizScores: obj.quizScores && typeof obj.quizScores === 'object' ? obj.quizScores : {},
  };
}

function mergeAppearanceSettings(raw: unknown): AppearanceSettings | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Partial<AppearanceSettings>;
  return {
    ...DEFAULT_APPEARANCE_SETTINGS,
    ...obj,
    schemaVersion: 1,
    customColors: {
      ...DEFAULT_APPEARANCE_SETTINGS.customColors,
      ...(obj.customColors || {}),
    },
  };
}

export function exportProgressBackupJson(): string {
  const entries = storage.getAllEntries();
  const payload: FullProgressBackupPayload = {
    app: 'Python Visual Lab',
    backupType: 'full_progress_backup',
    schemaVersion: BACKUP_SCHEMA_VERSION,
    storageVersion: STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
    data: entries,
  };
  return JSON.stringify(payload, null, 2);
}

export function downloadProgressBackupFile(): { filename: string; bytes: number } {
  const json = exportProgressBackupJson();
  const dateTag = new Date().toISOString().slice(0, 10);
  const filename = `python-visual-lab-progress-${dateTag}.json`;
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  return { filename, bytes: blob.size };
}

export function importProgressBackupJson(rawJson: string): ImportBackupResult {
  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== 'object') {
      return { ok: false, message: 'Invalid JSON file structure.', restoredKeys: [] };
    }

    const restoredKeys: string[] = [];

    // 1. Unified full backup format (or storageAdapter.exportAll format)
    if (parsed.data && typeof parsed.data === 'object') {
      const data = parsed.data as Record<string, unknown>;
      Object.entries(data).forEach(([key, val]) => {
        if (key === 'user_progress') {
          const merged = mergeProgressData(val);
          if (merged) {
            storage.setItem(key, merged);
            restoredKeys.push(key);
          }
        } else if (key === 'appearance_settings') {
          const merged = mergeAppearanceSettings(val);
          if (merged) {
            storage.setItem(key, merged);
            restoredKeys.push(key);
          }
        } else if (val !== undefined) {
          storage.setItem(key, val);
          restoredKeys.push(key);
        }
      });

      if (restoredKeys.length === 0) {
        return {
          ok: false,
          message: 'Backup file contained no recognizable Python Visual Lab entries.',
          restoredKeys: [],
        };
      }

      storage.triggerHydration();
      return {
        ok: true,
        message: `Restored ${restoredKeys.length} data section(s) from backup.`,
        restoredKeys,
      };
    }

    // 2. Legacy single-domain progress backup ({ progress: ... })
    if (parsed.progress) {
      const merged = mergeProgressData(parsed.progress);
      if (merged) {
        storage.setItem('user_progress', merged);
        storage.triggerHydration();
        return {
          ok: true,
          message: 'Restored user progress from backup.',
          restoredKeys: ['user_progress'],
        };
      }
    }

    // 3. Legacy appearance settings backup ({ settings: ... })
    if (parsed.settings) {
      const merged = mergeAppearanceSettings(parsed.settings);
      if (merged) {
        storage.setItem('appearance_settings', merged);
        storage.triggerHydration();
        return {
          ok: true,
          message: 'Restored appearance settings from backup.',
          restoredKeys: ['appearance_settings'],
        };
      }
    }

    return {
      ok: false,
      message: 'Unrecognized backup format. Please select a Python Visual Lab .json export file.',
      restoredKeys: [],
    };
  } catch {
    return {
      ok: false,
      message: 'Failed to parse JSON file. Please verify the file is valid JSON.',
      restoredKeys: [],
    };
  }
}
