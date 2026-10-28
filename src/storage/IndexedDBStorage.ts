import type { Project, ProjectMeta } from '../types';
import { toMeta } from '../types';
import type { StorageProvider } from './StorageProvider';

const DB_NAME = 'nest-forge-ai';
const DB_VERSION = 2;
const PROJECT_STORE = 'projects';
const DRAFT_STORE = 'drafts';

/** One record per unsaved draft, keyed `${projectId}:${path}` (see editor/drafts.ts). */
interface DraftRecord {
  key: string;
  content: string;
}

/**
 * IndexedDB-backed StorageProvider (local-first MVP).
 * Two object stores: `projects` (full project records, keyed by id) and
 * `drafts` (one record per unsaved editor draft). Drafts live in their own
 * store — not inside the project record — so an unsaved edit is never
 * mistaken for saved content, and deleting a project can drop its drafts
 * without touching other projects' drafts.
 *
 * DB_VERSION 2 adds the `drafts` store; onupgradeneeded creates whichever
 * store is missing, so existing v1 databases upgrade in place.
 */
export class IndexedDBStorage implements StorageProvider {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private open(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(PROJECT_STORE)) {
            db.createObjectStore(PROJECT_STORE, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(DRAFT_STORE)) {
            db.createObjectStore(DRAFT_STORE, { keyPath: 'key' });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error ?? new Error('IndexedDB open failed'));
      });
    }
    return this.dbPromise;
  }

  private async tx<T>(
    mode: IDBTransactionMode,
    storeName: string,
    run: (store: IDBObjectStore) => IDBRequest<T>,
  ): Promise<T> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      let result: T | undefined;
      try {
        const req = run(store);
        req.onsuccess = () => {
          result = req.result;
        };
        req.onerror = () => reject(req.error ?? new Error('IndexedDB request failed'));
      } catch (err) {
        reject(err);
        return;
      }
      transaction.oncomplete = () => resolve(result as T);
      transaction.onerror = () =>
        reject(transaction.error ?? new Error('IndexedDB transaction failed'));
    });
  }

  async saveProject(project: Project): Promise<void> {
    // Structured clone keeps only plain data (no functions / class instances).
    const record = JSON.parse(JSON.stringify(project)) as Project;
    await this.tx('readwrite', PROJECT_STORE, (store) => store.put(record));
  }

  async getProject(id: string): Promise<Project | null> {
    const record = await this.tx('readonly', PROJECT_STORE, (store) => store.get(id));
    return (record as Project | undefined) ?? null;
  }

  async listProjects(): Promise<ProjectMeta[]> {
    const records = await this.tx('readonly', PROJECT_STORE, (store) => store.getAll());
    const projects = (records ?? []) as Project[];
    return projects
      .map(toMeta)
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }

  async deleteProject(id: string): Promise<void> {
    await this.tx('readwrite', PROJECT_STORE, (store) => store.delete(id));
    // The project's drafts go with it; other projects' drafts are untouched.
    // If this cleanup fails, the orphan keys are pruned by the next
    // saveDrafts sync (it writes exactly the in-memory map), so the
    // failure is not fatal — but surface it so the UI can warn.
    await this.deleteDraftsForProject(id);
  }

  /**
   * Replace the persisted draft set with exactly the given map: keys no
   * longer present are deleted, so a saved or discarded draft never
   * resurrects on the next page load.
   */
  async saveDrafts(drafts: Record<string, string>): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(DRAFT_STORE, 'readwrite');
      const store = transaction.objectStore(DRAFT_STORE);
      const keysReq = store.getAllKeys();
      keysReq.onsuccess = () => {
        const wanted = new Set(Object.keys(drafts));
        for (const key of keysReq.result as IDBValidKey[]) {
          if (typeof key === 'string' && !wanted.has(key)) {
            store.delete(key);
          }
        }
        for (const [key, content] of Object.entries(drafts)) {
          store.put({ key, content } satisfies DraftRecord);
        }
      };
      keysReq.onerror = () => reject(keysReq.error ?? new Error('IndexedDB request failed'));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () =>
        reject(transaction.error ?? new Error('IndexedDB transaction failed'));
    });
  }

  async getDrafts(): Promise<Record<string, string>> {
    const records = await this.tx('readonly', DRAFT_STORE, (store) => store.getAll());
    const drafts: Record<string, string> = {};
    for (const record of (records ?? []) as DraftRecord[]) {
      if (typeof record.key === 'string' && typeof record.content === 'string') {
        drafts[record.key] = record.content;
      }
    }
    return drafts;
  }

  private async deleteDraftsForProject(projectId: string): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(DRAFT_STORE, 'readwrite');
      const store = transaction.objectStore(DRAFT_STORE);
      // Draft keys are `${projectId}:${path}`; the range covers exactly
      // this project's keys (':' sorts before any path character, and
      // '\uffff' bounds the prefix).
      const range = IDBKeyRange.bound(`${projectId}:`, `${projectId}:\uffff`);
      const keysReq = store.getAllKeys(range);
      keysReq.onsuccess = () => {
        for (const key of keysReq.result) {
          store.delete(key);
        }
      };
      keysReq.onerror = () => reject(keysReq.error ?? new Error('IndexedDB request failed'));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () =>
        reject(transaction.error ?? new Error('IndexedDB transaction failed'));
    });
  }
}
