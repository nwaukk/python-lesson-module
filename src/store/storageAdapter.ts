/**
 * Safe Storage Adapter with Automatic In-Memory Fallback
 * Complies with Section 7.4 of the Python Visual Lab Specification.
 * Handles sandboxed iframes where localStorage access is prohibited or throws a SecurityError.
 */

const STORAGE_VERSION = 1;
const STORAGE_PREFIX = 'pvl_v' + STORAGE_VERSION + '_';

class StorageAdapter {
  private inMemoryStore: Map<string, string> = new Map();
  private isStorageAvailable: boolean = true;
  private listeners: Set<(isFallback: boolean) => void> = new Set();

  constructor() {
    this.checkAvailability();
  }

  private checkAvailability(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        this.isStorageAvailable = false;
        return;
      }
      const testKey = '__pvl_storage_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      this.isStorageAvailable = true;
    } catch {
      this.isStorageAvailable = false;
      this.notifyListeners();
    }
  }

  public isUsingFallback(): boolean {
    return !this.isStorageAvailable;
  }

  public subscribeStatus(listener: (isFallback: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(!this.isStorageAvailable);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(!this.isStorageAvailable));
  }

  public getItem<T>(key: string, defaultValue: T): T {
    const fullKey = STORAGE_PREFIX + key;
    try {
      if (this.isStorageAvailable) {
        const raw = window.localStorage.getItem(fullKey);
        if (raw === null) return defaultValue;
        return JSON.parse(raw) as T;
      } else {
        const raw = this.inMemoryStore.get(fullKey);
        if (!raw) return defaultValue;
        return JSON.parse(raw) as T;
      }
    } catch {
      return defaultValue;
    }
  }

  public setItem<T>(key: string, value: T): boolean {
    const fullKey = STORAGE_PREFIX + key;
    try {
      const serialised = JSON.stringify(value);
      if (this.isStorageAvailable) {
        window.localStorage.setItem(fullKey, serialised);
      } else {
        this.inMemoryStore.set(fullKey, serialised);
      }
      return true;
    } catch (e) {
      // In case quota exceeded or sudden block, fall back to in-memory
      this.isStorageAvailable = false;
      this.notifyListeners();
      try {
        this.inMemoryStore.set(fullKey, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    }
  }

  public removeItem(key: string): void {
    const fullKey = STORAGE_PREFIX + key;
    try {
      if (this.isStorageAvailable) {
        window.localStorage.removeItem(fullKey);
      }
      this.inMemoryStore.delete(fullKey);
    } catch {
      this.inMemoryStore.delete(fullKey);
    }
  }

  public clear(): void {
    try {
      if (this.isStorageAvailable) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && key.startsWith(STORAGE_PREFIX)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => window.localStorage.removeItem(k));
      }
      this.inMemoryStore.clear();
    } catch {
      this.inMemoryStore.clear();
    }
  }

  public exportAll(): string {
    const dump: Record<string, unknown> = {};
    try {
      if (this.isStorageAvailable) {
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && key.startsWith(STORAGE_PREFIX)) {
            const shortKey = key.slice(STORAGE_PREFIX.length);
            const val = window.localStorage.getItem(key);
            try {
              dump[shortKey] = val ? JSON.parse(val) : null;
            } catch {
              dump[shortKey] = val;
            }
          }
        }
      } else {
        this.inMemoryStore.forEach((val, key) => {
          const shortKey = key.slice(STORAGE_PREFIX.length);
          try {
            dump[shortKey] = JSON.parse(val);
          } catch {
            dump[shortKey] = val;
          }
        });
      }
      return JSON.stringify({
        app: 'Python Visual Lab',
        version: STORAGE_VERSION,
        exportedAt: new Date().toISOString(),
        data: dump,
      }, null, 2);
    } catch {
      return '{}';
    }
  }

  public importAll(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed || typeof parsed !== 'object' || !parsed.data) return false;
      const data = parsed.data as Record<string, unknown>;
      Object.entries(data).forEach(([shortKey, val]) => {
        this.setItem(shortKey, val);
      });
      return true;
    } catch {
      return false;
    }
  }
}

export const storage = new StorageAdapter();
