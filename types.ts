/**
 * Core domain types for NEST Forge AI.
 * A Project is the unit of work: files + conversation + version history,
 * persisted locally via a StorageProvider (IndexedDB for the MVP).
 */

export interface ProjectFile {
  path: string;
  content: string;
  updatedAt: string; // ISO timestamp
}

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  /** 'plan' | 'summary' | 'error' marks engine-generated structured messages */
  kind?: 'plan' | 'summary' | 'error' | 'info';
}

export interface ProjectVersion {
  id: string;
  versionNumber: number;
  files: ProjectFile[];
  createdAt: string;
  changeSummary: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  templateId?: string;
  files: ProjectFile[];
  messages: ChatMessage[];
  versions: ProjectVersion[];
  generationStatus: 'idle' | 'working' | 'error';
}

/** Lightweight projection for the project list (no file contents). */
export interface ProjectMeta {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  fileCount: number;
  templateId?: string;
}

export function toMeta(p: Project): ProjectMeta {
  return {
    id: p.id,
    name: p.name,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    fileCount: p.files.length,
    templateId: p.templateId,
  };
}

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}
