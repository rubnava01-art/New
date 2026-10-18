import type { Project, ProjectMeta } from '../types';

/**
 * StorageProvider — persistence abstraction (Phase 2 requirement).
 *
 * The MVP ships IndexedDBStorage (local-first, no account needed).
 * Phase 5 (cloud) implements this same interface against Supabase:
 *   - VITE_SUPABASE_URL
 *   - VITE_SUPABASE_ANON_KEY
 * with row-level security keyed on the authenticated user id.
 * Swapping providers requires no changes to the UI or the engine.
 */
export interface StorageProvider {
  /** Persist a full project (upsert by id). */
  saveProject(project: Project): Promise<void>;
  /** Load a full project, or null when it does not exist. */
  getProject(id: string): Promise<Project | null>;
  /** List project metadata, newest first. */
  listProjects(): Promise<ProjectMeta[]>;
  /** Delete a project and all its data. */
  deleteProject(id: string): Promise<void>;
}
