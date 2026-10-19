import type { ProjectFile } from '../types';

/**
 * Structured file operations — the only way any provider may change
 * project files. Every operation is validated before it is applied.
 */
export type FileOp =
  | { kind: 'create_file'; path: string; content: string }
  | { kind: 'update_file'; path: string; content: string }
  | { kind: 'delete_file'; path: string };

export interface GenerationPlan {
  /** Human-readable steps the engine will actually perform. */
  steps: string[];
  /** Files the engine intends to create or touch. */
  manifest: string[];
}

export interface GenerationResult {
  plan: GenerationPlan;
  ops: FileOp[];
  /** Short summary shown after the change is applied. */
  summary: string;
  warnings: string[];
}

/**
 * AIProvider — Phase 3 seam.
 * The MVP ships DemoProvider (deterministic, no API key). A real provider
 * (Phase 3) implements this interface against a secure server-side endpoint
 * that holds the model API key — keys must NEVER reach the browser.
 */
export interface AIProvider {
  readonly id: string;
  readonly label: string;
  readonly isDemo: boolean;
  generate(prompt: string): Promise<GenerationResult>;
  modify(prompt: string, files: ProjectFile[]): Promise<GenerationResult>;
}

export function emptyResult(summary: string): GenerationResult {
  return { plan: { steps: [], manifest: [] }, ops: [], summary, warnings: [] };
}
