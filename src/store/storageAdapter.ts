/**
 * Safe Versioned IndexedDB + LocalStorage + In-Memory Storage Adapter
 * Primary durable storage: IndexedDB ('python_visual_lab_db' -> 'kv_store').
 * Synchronous mirror & fallback: localStorage -> in-memory Map.
 * Preserves synchronous initial reads while hydrating/persisting asynchronously in IndexedDB
 * so desktop launches and web sessions never lose user progress, notes, snippets, settings, or position.
 */

export const STORAGE_VERSION = 1;
const STORAGE_PREFIX = `pvl_v${STORAGE_VERSION}_`;
const IDB_NAME = 'python_visual_lab_db';
const IDB_VERSION = 1;
const IDB_STORE = 'kv_store';

export type StorageBackendType = 'indexeddb' | 'localstorage' | 'memory';

interface StoredEnvelope<T = unknown> {
  key: string;
  version: number;
  value: T;
  updatedAt: string;
}

class StorageAdapter {
  private inMemoryStore: Map<string, string> = new Map();
  private isLocalStorageAvailable: boolean = true;
  private isIndexedDbAvailable: boolean = false;
  private statusListeners: Set<(isFallback: boolean) => void> = new Set();
  private hydrationListeners: Set<() => void> = new Set();
  private hydrationPromise: Promise<void>;

  constructor() {
    this.checkLocalStorageAvailability();
    this.seedMemoryFromLocalStorage();
    this.hydrationPromise = this.hydrateFromIndexedDB();
  }

  private checkLocalStorageAvailability(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        this.isLocalStorageAvailable = false;
        return;
      }
      const testKey = '__pvl_storage_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      this.isLocalStorageAvailable = true;
    } catch {
      this.isLocalStorageAvailable = false;
    }
  }

  private seedMemoryFromLocalStorage(): void {
    if (!this.isLocalStorageAvailable) return;
    try {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          const val = window.localStorage.getItem(key);
          if (val !== null) {
            this.inMemoryStore.set(key, val);
          }
        }
      }
    } catch {
      // Ignore partial read failures
    }
  }

  private openDatabase(): Promise<IDBDatabase | null> {
    return new Promise((resolve) => {
      try {
        if (typeof window === 'undefined' || !window.indexedDB) {
          resolve(null);
          return;
        }
        const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(IDB_STORE)) {
            db.createObjectStore(IDB_STORE, { keyPath: 'key' });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
        request.onblocked = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  private async hydrateFromIndexedDB(): Promise<void> {
    const db = await this.openDatabase();
    if (!db) {
      this.isIndexedDbAvailable = false;
      this.notifyStatusListeners();
      return;
    }

    try {
      const records = await new Promise<StoredEnvelope[]>((resolve) => {
        try {
          const tx = db.transaction(IDB_STORE, 'readonly');
          const store = tx.objectStore(IDB_STORE);
          const req = store.getAll();
          req.onsuccess = () => resolve((req.result as StoredEnvelope[]) || []);
          req.onerror = () => resolve([]);
        } catch {
          resolve([]);
        }
      });

      this.isIndexedDbAvailable = true;
      this.notifyStatusListeners();

      if (records.length > 0) {
        let updatedAny = false;
        records.forEach((record) => {
          if (!record || !record.key || !record.key.startsWith(STORAGE_PREFIX)) return;
          const serialised = JSON.stringify(record.value);
          const currentMem = this.inMemoryStore.get(record.key);
          if (currentMem !== serialised) {
            this.inMemoryStore.set(record.key, serialised);
            updatedAny = true;
          }
          if (this.isLocalStorageAvailable) {
            try {
              window.localStorage.setItem(record.key, serialised);
            } catch {
              // Ignore quota errors on localStorage mirror
            }
          }
        });
        if (updatedAny) {
          this.triggerHydration();
        }
      } else if (this.inMemoryStore.size > 0) {
        // Migrate existing localStorage entries into IndexedDB seamlessly
        const entries = Array.from(this.inMemoryStore.entries());
        await this.writeBatchToIdb(db, entries);
      }
    } catch {
      this.isIndexedDbAvailable = false;
      this.notifyStatusListeners();
    } finally {
      try {
        db.close();
      } catch {
        // Ignore close error
      }
    }
  }

  private async writeBatchToIdb(
    existingDb: IDBDatabase | null,
    entries: [string, string][]
  ): Promise<void> {
    const db = existingDb || (await this.openDatabase());
    if (!db) return;
    try {
      await new Promise<void>((resolve) => {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        const now = new Date().toISOString();
        entries.forEach(([fullKey, raw]) => {
          try {
            store.put({
              key: fullKey,
              version: STORAGE_VERSION,
              value: JSON.parse(raw),
              updatedAt: now,
            } satisfies StoredEnvelope);
          } catch {
            // Skip malformed JSON
          }
        });
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch {
      // Ignore write error
    } finally {
      if (!existingDb) {
        try {
          db.close();
        } catch {
          // Ignore close error
        }
      }
    }
  }

  private async idbPut(fullKey: string, value: unknown): Promise<void> {
    const db = await this.openDatabase();
    if (!db) return;
    try {
      await new Promise<void>((resolve) => {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        store.put({
          key: fullKey,
          version: STORAGE_VERSION,
          value,
          updatedAt: new Date().toISOString(),
        } satisfies StoredEnvelope);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
      if (!this.isIndexedDbAvailable) {
        this.isIndexedDbAvailable = true;
        this.notifyStatusListeners();
      }
    } catch {
      // Fall back silently to synchronous mirror
    } finally {
      try {
        db.close();
      } catch {
        // Ignore
      }
    }
  }

  private async idbDelete(fullKey: string): Promise<void> {
    const db = await this.openDatabase();
    if (!db) return;
    try {
      await new Promise<void>((resolve) => {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).delete(fullKey);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch {
      // Ignore
    } finally {
      try {
        db.close();
      } catch {
        // Ignore
      }
    }
  }

  private async idbClear(): Promise<void> {
    const db = await this.openDatabase();
    if (!db) return;
    try {
      await new Promise<void>((resolve) => {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch {
      // Ignore
    } finally {
      try {
        db.close();
      } catch {
        // Ignore
      }
    }
  }

  public ready(): Promise<void> {
    return this.hydrationPromise;
  }

  public getStorageBackend(): StorageBackendType {
    if (this.isIndexedDbAvailable) return 'indexeddb';
    if (this.isLocalStorageAvailable) return 'localstorage';
    return 'memory';
  }

  public isUsingFallback(): boolean {
    return !this.isIndexedDbAvailable && !this.isLocalStorageAvailable;
  }

  public subscribeStatus(listener: (isFallback: boolean) => void): () => void {
    this.statusListeners.add(listener);
    listener(this.isUsingFallback());
    return () => this.statusListeners.delete(listener);
  }

  private notifyStatusListeners(): void {
    const fallback = this.isUsingFallback();
    this.statusListeners.forEach((listener) => listener(fallback));
  }

  public subscribeHydration(listener: () => void): () => void {
    this.hydrationListeners.add(listener);
    return () => this.hydrationListeners.delete(listener);
  }

  public triggerHydration(): void {
    this.hydrationListeners.forEach((listener) => listener());
  }

  public getItem<T>(key: string, defaultValue: T): T {
    const fullKey = STORAGE_PREFIX + key;
    try {
      const cached = this.inMemoryStore.get(fullKey);
      if (cached !== undefined) {
        return JSON.parse(cached) as T;
      }
      if (this.isLocalStorageAvailable) {
        const raw = window.localStorage.getItem(fullKey);
        if (raw === null) return defaultValue;
        this.inMemoryStore.set(fullKey, raw);
        return JSON.parse(raw) as T;
      }
      return defaultValue;
    } catch {
      return defaultValue;
    }
  }

  public setItem<T>(key: string, value: T): boolean {
    const fullKey = STORAGE_PREFIX + key;
    try {
      const serialised = JSON.stringify(value);
      this.inMemoryStore.set(fullKey, serialised);
      if (this.isLocalStorageAvailable) {
        try {
          window.localStorage.setItem(fullKey, serialised);
        } catch {
          this.isLocalStorageAvailable = false;
          this.notifyStatusListeners();
        }
      }
      void this.idbPut(fullKey, value);
      return true;
    } catch {
      return false;
    }
  }

  public removeItem(key: string): void {
    const fullKey = STORAGE_PREFIX + key;
    this.inMemoryStore.delete(fullKey);
    if (this.isLocalStorageAvailable) {
      try {
        window.localStorage.removeItem(fullKey);
      } catch {
        // Ignore
      }
    }
    void this.idbDelete(fullKey);
  }

  public clear(): void {
    this.inMemoryStore.clear();
    if (this.isLocalStorageAvailable) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && key.startsWith(STORAGE_PREFIX)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => window.localStorage.removeItem(k));
      } catch {
        // Ignore
      }
    }
    void this.idbClear();
  }

  public getAllEntries(): Record<string, unknown> {
    const dump: Record<string, unknown> = {};
    if (this.isLocalStorageAvailable) {
      try {
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && key.startsWith(STORAGE_PREFIX) && !this.inMemoryStore.has(key)) {
            const val = window.localStorage.getItem(key);
            if (val !== null) this.inMemoryStore.set(key, val);
          }
        }
      } catch {
        // Ignore
      }
    }
    this.inMemoryStore.forEach((val, key) => {
      if (!key.startsWith(STORAGE_PREFIX)) return;
      const shortKey = key.slice(STORAGE_PREFIX.length);
      try {
        dump[shortKey] = JSON.parse(val);
      } catch {
        dump[shortKey] = val;
      }
    });
    return dump;
  }

  public exportAll(): string {
    try {
      const dump = this.getAllEntries();
      return JSON.stringify(
        {
          app: 'Python Visual Lab',
          version: STORAGE_VERSION,
          exportedAt: new Date().toISOString(),
          data: dump,
        },
        null,
        2
      );
    } catch {
      return '{}';
    }
  }

  public importAll(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed || typeof parsed !== 'object' || !parsed.data || typeof parsed.data !== 'object') {
        return false;
      }
      const data = parsed.data as Record<string, unknown>;
      Object.entries(data).forEach(([shortKey, val]) => {
        this.setItem(shortKey, val);
      });
      this.triggerHydration();
      return true;
    } catch {
      return false;
    }
  }
}

export const storage = new StorageAdapter();
