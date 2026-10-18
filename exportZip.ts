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

Generated with NEST Forge AI (demo mode) on ${new Date(project.updatedAt).toLocaleDateString()}.

## Run it

This is a static website — no build step needed:

\`\`\`bash
# Option 1: open index.html directly in your browser
# Option 2: serve it locally
npx serve .
# or
python3 -m http.server 8000
\`\`\`

## Files

${fileList}

## Notes

- Edit the files with any code editor; refresh the browser to see changes.
- Forms in the demo templates confirm locally in the browser (no backend).
  Connect your own backend or form service before collecting real submissions.
- \`package.json\` is included for convenience (\`npm start\` serves the site
  after \`npm install\`, which fetches the tiny \`serve\` package).
`;
}

function exportPackageJson(project: Project): string {
  return (
    JSON.stringify(
      {
        name: slugify(project.name),
        version: '1.0.0',
        private: true,
        description: `${project.name} — generated with NEST Forge AI (demo mode)`,
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
    throw new Error('Cannot export: the project has no index.html.');
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
