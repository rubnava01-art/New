import type { ProjectFile } from '../types';
import type { FileOp } from './Provider';

/**
 * Operation validator — every FileOp passes through here before it is
 * applied to a project. Rejects path traversal, unexpected file types,
 * and oversized outputs. Invalid model output is rejected safely and
 * reported honestly to the user (never silently applied).
 */

const ALLOWED_EXTENSIONS = new Set([
  '.html',
  '.css',
  '.js',
  '.json',
  '.md',
  '.txt',
  '.svg',
]);

const PATH_RE = /^[A-Za-z0-9][A-Za-z0-9_.-]*$/;
const MAX_FILE_CHARS = 200_000;
const MAX_OPS = 50;

export interface ValidationReport {
  valid: boolean;
  errors: string[];
}

function extensionOf(path: string): string {
  const dot = path.lastIndexOf('.');
  return dot >= 0 ? path.slice(dot).toLowerCase() : '';
}

export function validateOps(ops: FileOp[], existing: ProjectFile[]): ValidationReport {
  const errors: string[] = [];

  if (ops.length > MAX_OPS) {
    errors.push(`Demasiadas operaciones (${ops.length}); el límite es ${MAX_OPS}.`);
  }

  const existingPaths = new Set(existing.map((f) => f.path));
  const createdPaths = new Set<string>();

  for (const op of ops) {
    const label = `${op.kind} ${op.path}`;

    // Path shape: flat file names only — no directories, no traversal.
    if (!PATH_RE.test(op.path) || op.path.includes('..')) {
      errors.push(`${label}: rechazada — la ruta debe ser un nombre de archivo simple (sin carpetas ni "..").`);
      continue;
    }
    const ext = extensionOf(op.path);
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      errors.push(
        `${label}: rechazada — extensión "${ext || '(ninguna)'}" no permitida. ` +
          `Permitidas: ${[...ALLOWED_EXTENSIONS].join(', ')}.`,
      );
      continue;
    }
    if (op.path.length > 120) {
      errors.push(`${label}: rechazada — nombre de archivo demasiado largo.`);
      continue;
    }

    if (op.kind === 'create_file') {
      if (existingPaths.has(op.path) || createdPaths.has(op.path)) {
        errors.push(`${label}: rechazada — el archivo ya existe (usa update_file).`);
        continue;
      }
      if (op.content.length > MAX_FILE_CHARS) {
        errors.push(`${label}: rechazada — archivo demasiado grande (${op.content.length} caracteres, límite ${MAX_FILE_CHARS}).`);
        continue;
      }
      createdPaths.add(op.path);
    } else if (op.kind === 'update_file') {
      if (!existingPaths.has(op.path) && !createdPaths.has(op.path)) {
        errors.push(`${label}: rechazada — el archivo no existe (usa create_file).`);
        continue;
      }
      if (op.content.length > MAX_FILE_CHARS) {
        errors.push(`${label}: rechazada — archivo demasiado grande (${op.content.length} caracteres, límite ${MAX_FILE_CHARS}).`);
        continue;
      }
    } else {
      // delete_file
      if (!existingPaths.has(op.path) && !createdPaths.has(op.path)) {
        errors.push(`${label}: rechazada — el archivo no existe.`);
        continue;
      }
      createdPaths.delete(op.path);
      existingPaths.delete(op.path);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Apply already-validated ops to a file list, returning the new list.
 * Callers must run validateOps first; this function trusts the ops.
 */
export function applyOps(files: ProjectFile[], ops: FileOp[], stamp: string): ProjectFile[] {
  const next = files.map((f) => ({ ...f }));
  for (const op of ops) {
    if (op.kind === 'create_file') {
      next.push({ path: op.path, content: op.content, updatedAt: stamp });
    } else if (op.kind === 'update_file') {
      const target = next.find((f) => f.path === op.path);
      if (target) {
        target.content = op.content;
        target.updatedAt = stamp;
      }
    } else {
      const idx = next.findIndex((f) => f.path === op.path);
      if (idx >= 0) next.splice(idx, 1);
    }
  }
  return next;
}
