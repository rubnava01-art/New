/**
 * Unsaved editor drafts, scoped per project.
 *
 * Before this module, drafts were keyed by file path alone and every
 * project switch, new project, version restore, or project delete wiped
 * the whole draft map — silently discarding edits the user had not saved
 * yet. Drafts are now keyed `${projectId}:${path}` (project ids are UUIDs
 * and file paths can never contain ':' per App's PATH_RE, so the key is
 * unambiguous), so switching projects preserves each project's drafts.
 *
 * Drafts also persist to IndexedDB (their own object store, via
 * StorageProvider.saveDrafts/getDrafts), so an unsaved edit survives a
 * page reload. They are deliberately kept out of the project record:
 * a draft must never be mistaken for saved content, and deleting a
 * project drops its drafts without touching other projects' drafts.
 */

export function draftKey(projectId: string, path: string): string {
  return `${projectId}:${path}`;
}

/**
 * Espejo SÍNCRONO de los borradores en localStorage.
 *
 * El guardado de borradores en IndexedDB lleva un debounce de 600 ms
 * (cada tecla es un cambio) y el vaciado asíncrono de `pagehide` no tiene
 * garantizado completarse: el navegador puede descartar la página con la
 * transacción a medias. Es la misma ventana que la corrección del
 * 14-11 cerró para el proyecto (guardado inmediato) pero que seguía
 * abierta para los borradores: cerrar la pestaña dentro de esos 600 ms
 * perdía lo último tecleado sin guardar, en silencio.
 *
 * localStorage.setItem SÍ es síncrono: el espejo se escribe en cada
 * cambio de borradores, en el mismo efecto que programa el debounce, así
 * que al cerrar la pestaña el último estado ya está en disco. IndexedDB
 * sigue siendo la fuente principal; el espejo solo rescata al arrancar
 * lo que IndexedDB no llegó a sincronizar.
 *
 * El espejo es una foto completa del mapa en memoria en cada cambio
 * (también cuando un borrador se guarda o se descarta), así que nunca va
 * por detrás de IndexedDB: para una clave presente en ambos, gana el
 * espejo. Si la escritura falla (cuota de localStorage), se borra el
 * espejo para que una foto vieja no resucite un borrador ya guardado o
 * descartado; IndexedDB sigue guardando el resto con normalidad.
 */
export const DRAFTS_MIRROR_KEY = 'nest-forge-ai:drafts-mirror';

export function readDraftsMirror(): Record<string, string> {
  try {
    const raw = localStorage.getItem(DRAFTS_MIRROR_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof v === 'string') out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export function writeDraftsMirror(drafts: Record<string, string>): void {
  try {
    localStorage.setItem(DRAFTS_MIRROR_KEY, JSON.stringify(drafts));
  } catch {
    try {
      localStorage.removeItem(DRAFTS_MIRROR_KEY);
    } catch {
      // Sin espejo, IndexedDB sigue siendo la fuente principal.
    }
  }
}

/**
 * Fusiona los borradores persistidos en IndexedDB con el espejo de
 * localStorage al arrancar. El espejo gana para las claves que trae
 * (es la foto síncrona más reciente) y aporta las que IndexedDB no llegó
 * a sincronizar antes de cerrar la pestaña; lo que solo está en
 * IndexedDB se conserva tal cual.
 */
export function mergeDrafts(
  stored: Record<string, string>,
  mirror: Record<string, string>,
): Record<string, string> {
  return { ...stored, ...mirror };
}

/** File paths that have an unsaved draft in the given project. */
export function pathsForProject(
  drafts: Record<string, string>,
  projectId: string,
): string[] {
  const prefix = `${projectId}:`;
  return Object.keys(drafts)
    .filter((k) => k.startsWith(prefix))
    .map((k) => k.slice(prefix.length));
}

/** Draft map without the draft for one file of one project. */
export function withoutDraft(
  drafts: Record<string, string>,
  projectId: string,
  path: string,
): Record<string, string> {
  const next = { ...drafts };
  delete next[draftKey(projectId, path)];
  return next;
}

/**
 * Draft map without the drafts for several files of one project. Used
 * when the demo engine modifies those files: a draft written before the
 * engine change is stale — keeping it would show old content in the
 * editor and, on save, silently overwrite the engine's new content.
 * Other files' drafts (and other projects') are untouched.
 */
export function withoutFiles(
  drafts: Record<string, string>,
  projectId: string,
  paths: string[],
): Record<string, string> {
  const doomed = new Set(paths.map((p) => draftKey(projectId, p)));
  const next: Record<string, string> = {};
  for (const [k, v] of Object.entries(drafts)) {
    if (!doomed.has(k)) next[k] = v;
  }
  return next;
}

/**
 * Mapa de borradores con los borradores de un proyecto copiados a otro
 * id. Se usa al duplicar un proyecto: los borradores viven fuera del
 * registro del proyecto (clave `${projectId}:${path}`), así que copiar
 * solo el registro dejaba la copia con el contenido GUARDADO y tiraba
 * los cambios sin guardar — que además se perdían del todo si luego se
 * borraba el original, porque borrar un proyecto borra sus borradores.
 * El original conserva sus borradores; la copia empieza con los mismos.
 */
export function copyProjectDrafts(
  drafts: Record<string, string>,
  sourceProjectId: string,
  targetProjectId: string,
): Record<string, string> {
  const prefix = `${sourceProjectId}:`;
  const next = { ...drafts };
  for (const [k, v] of Object.entries(drafts)) {
    if (k.startsWith(prefix)) {
      next[`${targetProjectId}:${k.slice(prefix.length)}`] = v;
    }
  }
  return next;
}

/**
 * Draft map without any draft of one project. Used when that project's
 * files are replaced wholesale (version restore) or the project is
 * deleted — in both cases its drafts no longer apply to anything.
 */
export function withoutProjectDrafts(
  drafts: Record<string, string>,
  projectId: string,
): Record<string, string> {
  const prefix = `${projectId}:`;
  const next: Record<string, string> = {};
  for (const [k, v] of Object.entries(drafts)) {
    if (!k.startsWith(prefix)) next[k] = v;
  }
  return next;
}
