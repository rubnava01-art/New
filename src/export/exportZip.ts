import JSZip from 'jszip';
import type { Project, ProjectFile } from '../types';
import { draftKey } from '../editor/drafts';

/** File names that must never leave the app inside an export. */
const SECRET_PATTERNS = [/^\.env/i, /secret/i, /token/i, /private[_-]?key/i, /\.pem$/i];

/**
 * Whether a file may leave the app in a ZIP. `includeSecrets` lifts the
 * filter: it exists only for the delete-rescue backup (see
 * exportProjectZip), where excluding a file means losing it forever —
 * a user export that will be shared keeps the filter, so a stray
 * `token.txt` never leaks into a ZIP that leaves the machine.
 */
function isExportable(path: string, includeSecrets = false): boolean {
  return includeSecrets || !SECRET_PATTERNS.some((re) => re.test(path));
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'nest-forge-project'
  );
}

function exportReadme(project: Project, includeSecrets = false): string {
  const fileList = project.files
    .filter((f) => isExportable(f.path, includeSecrets))
    .map((f) => `- \`${f.path}\``)
    .join('\n');
  return `# ${project.name}

Generado con NEST Forge AI (modo demo) el ${new Date(project.updatedAt).toLocaleDateString()}.

## C\u00f3mo verlo

Es un sitio web est\u00e1tico \u2014 no necesita compilaci\u00f3n:

\`\`\`bash
# Opci\u00f3n 1: abre index.html directamente en tu navegador
# Opci\u00f3n 2: s\u00edrvelo localmente
npx serve .
# o
python3 -m http.server 8000
\`\`\`

## Archivos

${fileList}

## Notas

- Edita los archivos con cualquier editor de c\u00f3digo; recarga el navegador para ver los cambios.
- Los formularios de las plantillas demo confirman localmente en el navegador (sin backend).
  Conecta tu propio backend o servicio de formularios antes de recibir env\u00edos reales.
- \`package.json\` se incluye por conveniencia (\`npm start\` sirve el sitio
  despu\u00e9s de \`npm install\`, que descarga el peque\u00f1o paquete \`serve\`).
`;
}

function exportPackageJson(project: Project): string {
  return (
    JSON.stringify(
      {
        name: slugify(project.name),
        version: '1.0.0',
        private: true,
        description: `${project.name} — generado con NEST Forge AI (modo demo)`,
        scripts: {
          start: 'npx serve .',
        },
      },
      null,
      2,
    ) + '\n'
  );
}

/**
 * Files as the user currently sees them in the editor: any unsaved draft
 * for this project replaces the saved content of its file. Drafts of
 * other projects, and drafts for paths that no longer exist in the
 * project (e.g. a file deleted after the draft was written), are
 * ignored — they must never invent a file in the export. The input
 * array and its file objects are never mutated.
 */
export function overlayDrafts(
  files: ProjectFile[],
  drafts: Record<string, string>,
  projectId: string,
): ProjectFile[] {
  return files.map((f) => {
    const key = draftKey(projectId, f.path);
    if (!(key in drafts)) return f;
    return { ...f, content: drafts[key] };
  });
}

/**
 * Build a ZIP archive of the project: source files + README + package.json.
 * Secret-like files are excluded. Returns the archive as a Blob.
 *
 * `drafts` is the app's unsaved-draft map (same shape as App's state).
 * Without it, an export made with unsaved edits silently shipped the
 * old saved content instead of what the editor was showing — the ZIP
 * left the app looking like the user's latest work while containing
 * the previous version. Passing the drafts makes the export match
 * the editor; exporting does not save the drafts themselves, so the
 * dirty indicators stay until the user saves.
 *
 * By default the export refuses a project without index.html (a ZIP
 * without an entry page is not a usable site). `requireIndex: false`
 * lifts that rule for rescue backups: a project being deleted may
 * legitimately have no index.html, and its remaining files are still
 * worth preserving.
 *
 * `includeSecrets: true` lifts the secret-name filter as well, and is
 * meant ONLY for that same rescue backup: the delete flow downloads
 * the ZIP as the project's last copy before wiping it from IndexedDB,
 * so a file the filter would drop (e.g. `token.txt`, `secret.md`,
 * `private-key.json` — all creatable from the file explorer) would be
 * lost forever with nothing left to restore from. A rescue backup goes
 * to the user's own machine, not to anyone else, so completeness beats
 * the leak protection that a shareable export keeps.
 */
export async function exportProjectZip(
  project: Project,
  drafts: Record<string, string> = {},
  options: { requireIndex?: boolean; includeSecrets?: boolean } = {},
): Promise<Blob> {
  const effectiveProject = { ...project, files: overlayDrafts(project.files, drafts, project.id) };
  const zip = new JSZip();
  const seen = new Set<string>();

  const addFile = (path: string, content: string) => {
    if (!isExportable(path, options.includeSecrets) || seen.has(path)) return;
    seen.add(path);
    zip.file(path, content);
  };

  const files: ProjectFile[] = [...effectiveProject.files].sort((a, b) =>
    a.path.localeCompare(b.path),
  );
  for (const f of files) addFile(f.path, f.content);

  if (options.requireIndex !== false && !seen.has('index.html')) {
    throw new Error('No se puede exportar: el proyecto no tiene index.html.');
  }

  addFile('README.md', exportReadme(effectiveProject, options.includeSecrets));
  addFile('package.json', exportPackageJson(effectiveProject));

  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}
