import JSZip from 'jszip';
import type { Project, ProjectFile } from '../types';

/** File names that must never leave the app inside an export. */
const SECRET_PATTERNS = [/^\.env/i, /secret/i, /token/i, /private[_-]?key/i, /\.pem$/i];

function isExportable(path: string): boolean {
  return !SECRET_PATTERNS.some((re) => re.test(path));
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

function exportReadme(project: Project): string {
  const fileList = project.files
    .filter((f) => isExportable(f.path))
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
 * Build a ZIP archive of the project: source files + README + package.json.
 * Secret-like files are excluded. Returns the archive as a Blob.
 */
export async function exportProjectZip(project: Project): Promise<Blob> {
  const zip = new JSZip();
  const seen = new Set<string>();

  const addFile = (path: string, content: string) => {
    if (!isExportable(path) || seen.has(path)) return;
    seen.add(path);
    zip.file(path, content);
  };

  const files: ProjectFile[] = [...project.files].sort((a, b) =>
    a.path.localeCompare(b.path),
  );
  for (const f of files) addFile(f.path, f.content);

  if (!seen.has('index.html')) {
    throw new Error('No se puede exportar: el proyecto no tiene index.html.');
  }

  addFile('README.md', exportReadme(project));
  addFile('package.json', exportPackageJson(project));

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
