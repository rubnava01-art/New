import type { Project, ProjectMeta } from '../types';
import { toMeta } from '../types';
import type { StorageProvider } from './StorageProvider';

const DB_NAME = 'nest-forge-ai';
const DB_VERSION = 1;
const STORE = 'projects';

/**
 * IndexedDB-backed StorageProvider (local-first MVP).
 * Single object store keyed by project id; each record holds the full
 * project (files, messages, versions). Suitable for MVP-scale projects.
 */
export class IndexedDBStorage implements StorageProvider {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private open(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(STORE)) {
            db.createObjectStore(STORE, { keyPath: 'id' });
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
    run: (store: IDBObjectStore) => IDBRequest<T>,
  ): Promise<T> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE, mode);
      const store = transaction.objectStore(STORE);
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
    await this.tx('readwrite', (store) => store.put(record));
  }

  async getProject(id: string): Promise<Project | null> {
    const record = await this.tx('readonly', (store) => store.get(id));
    return (record as Project | undefined) ?? null;
  }

  async listProjects(): Promise<ProjectMeta[]> {
    const records = await this.tx('readonly', (store) => store.getAll());
    const projects = (records ?? []) as Project[];
    return projects
      .map(toMeta)
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }

  async deleteProject(id: string): Promise<void> {
    await this.tx('readwrite', (store) => store.delete(id));
  }
}
