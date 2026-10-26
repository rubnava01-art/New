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
 * Drafts are still in-memory only: they do not survive a page reload.
 * That pre-existing limit is unchanged — only the silent loss on
 * project switch is fixed.
 */

export function draftKey(projectId: string, path: string): string {
  return `${projectId}:${path}`;
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
