import type { ProjectFile } from '../types';
import type { AIProvider, FileOp, GenerationResult } from './Provider';
import { emptyResult } from './Provider';
import {
  extractBusinessName,
  instantiate,
  matchTemplate,
} from '../templates';

/**
 * DemoProvider — deterministic, template-based generation engine.
 * Requires no API key. Every response is derived from built-in templates
 * and predictable text operations, and the UI labels all of it as DEMO.
 *
 * Phase 3 will add a real provider (server-side model endpoint) behind the
 * same AIProvider interface; nothing else changes.
 */

const SUPPORTED_MODS = [
  '“change the hero title to …”',
  '“add a pricing section”',
  '“add a testimonials section”',
  '“change the accent color to #7c5cff”',
  '“rename the business to …”',
  '“delete the file app.js”',
];

function supportedList(): string {
  return (
    'I did not understand that as a demo modification. In demo mode I can:\n' +
    SUPPORTED_MODS.map((s) => `• ${s}`).join('\n')
  );
}

function findFile(files: ProjectFile[], path: string): ProjectFile | undefined {
  return files.find((f) => f.path === path);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function insertBeforeAnchor(html: string, snippet: string): { html: string; where: string } {
  const anchors: Array<[RegExp, string]> = [
    [/<footer[\s>]/i, 'before the footer'],
    [/<\/main>/i, 'at the end of the main content'],
    [/<\/body>/i, 'at the end of the page'],
  ];
  for (const [re, where] of anchors) {
    const m = html.match(re);
    if (m && m.index !== undefined) {
      return {
        html: html.slice(0, m.index) + snippet + '\n' + html.slice(m.index),
        where,
      };
    }
  }
  return { html: html + '\n' + snippet, where: 'at the end of the page' };
}

const SNIPPET_CSS = `
/* Added by NEST Forge AI (demo engine) */
.nf-section { padding: 56px 0; }
.nf-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 24px; }
.nf-card {
  background: var(--surface, #17181d); border: 1px solid var(--line, #2a2d36);
  border-radius: 14px; padding: 24px; color: var(--text, #f5f6f8);
}
.nf-card h3 { margin: 0 0 8px; color: var(--text, #f5f6f8); }
.nf-card p { color: var(--muted, #a7abb6); margin: 0 0 10px; }
.nf-price { font-size: 1.8rem; font-weight: 800; color: var(--accent-soft, #9a82ff); margin: 8px 0 12px; }
.nf-quote { font-style: italic; color: var(--text, #f5f6f8); }
.nf-who { color: var(--muted, #a7abb6); font-size: 0.9rem; margin-top: 10px; }
@media (max-width: 860px) { .nf-grid { grid-template-columns: 1fr; } }
`;

function pricingSnippet(): string {
  return `
    <section class="nf-section" id="pricing">
      <div class="container">
        <p class="eyebrow">Pricing</p>
        <h2>Simple, honest pricing.</h2>
        <div class="nf-grid">
          <article class="nf-card"><h3>Basic</h3><p class="nf-price">$29/mo</p><p>Everything you need to get started.</p></article>
          <article class="nf-card"><h3>Pro</h3><p class="nf-price">$79/mo</p><p>For growing teams that need more power.</p></article>
          <article class="nf-card"><h3>Enterprise</h3><p class="nf-price">Custom</p><p>Dedicated support and custom limits.</p></article>
        </div>
      </div>
    </section>`;
}

function testimonialsSnippet(): string {
  return `
    <section class="nf-section" id="testimonials">
      <div class="container">
        <p class="eyebrow">Testimonials</p>
        <h2>Loved by customers.</h2>
        <div class="nf-grid">
          <article class="nf-card"><p class="nf-quote">"Exactly what we needed — up and running in a day."</p><p class="nf-who">— Alex M., Founder</p></article>
          <article class="nf-card"><p class="nf-quote">"The support team is fantastic and the product just works."</p><p class="nf-who">— Priya S., COO</p></article>
          <article class="nf-card"><p class="nf-quote">"We switched from a competitor and never looked back."</p><p class="nf-who">— Jordan L., Marketing Lead</p></article>
        </div>
      </div>
    </section>`;
}

export class DemoProvider implements AIProvider {
  readonly id = 'demo';
  readonly label = 'Demo Engine (no API key)';
  readonly isDemo = true;

  async generate(prompt: string): Promise<GenerationResult> {
    const template = matchTemplate(prompt);
    const name = extractBusinessName(prompt);
    const files = instantiate(template, name);

    const ops: FileOp[] = files.map((f) => ({
      kind: 'create_file' as const,
      path: f.path,
      content: f.content,
    }));

    return {
      plan: {
        steps: [
          `Analyzed the request and matched the "${template.name}" template (deterministic keyword match).`,
          `Personalized the template for "${name}".`,
          `Generated ${files.length} files: ${files.map((f) => f.path).join(', ')}.`,
          'Validated every file operation (paths, extensions, sizes).',
        ],
        manifest: files.map((f) => f.path),
      },
      ops,
      summary:
        `Created "${name}" from the ${template.name} template (${files.length} files). ` +
        `DEMO output: template-based, not model-generated. Try ${SUPPORTED_MODS[0]} or ${SUPPORTED_MODS[1]}.`,
      warnings: [
        'Demo mode: designs come from built-in templates. A real AI provider arrives in Phase 3.',
      ],
    };
  }

  async modify(prompt: string, files: ProjectFile[]): Promise<GenerationResult> {
    const text = prompt.trim();

    // 1. Change hero title
    let m = text.match(/change\s+(?:the\s+)?hero\s+(?:title|heading)\s+to\s+["“]?([^"”\n]+)["”]?/i);
    if (m) {
      const title = m[1].trim().slice(0, 120);
      const html = findFile(files, 'index.html');
      if (!html) return emptyResult('There is no index.html in this project, so I cannot change the hero title.');
      if (!/<h1[\s>]/i.test(html.content)) {
        return emptyResult('I could not find an <h1> hero title in index.html.');
      }
      const updated = html.content.replace(
        /(<h1[^>]*>)([\s\S]*?)(<\/h1>)/i,
        `$1${escapeHtml(title)}$3`,
      );
      return {
        plan: {
          steps: ['Located the <h1> hero title in index.html.', 'Replaced its text (HTML-escaped).', 'Validated the operation.'],
          manifest: ['index.html'],
        },
        ops: [{ kind: 'update_file', path: 'index.html', content: updated }],
        summary: `Hero title changed to "${title}".`,
        warnings: [],
      };
    }

    // 2. Add a pricing section
    if (/add\s+(?:a\s+)?pricing(\s+section)?/i.test(text)) {
      const html = findFile(files, 'index.html');
      const css = findFile(files, 'styles.css');
      if (!html || !css) return emptyResult('This project needs index.html and styles.css for me to add a section.');
      if (/id=["']pricing["']/i.test(html.content)) {
        return emptyResult('This project already has a pricing section (id="pricing").');
      }
      const { html: withSection, where } = insertBeforeAnchor(html.content, pricingSnippet());
      const ops: FileOp[] = [
        { kind: 'update_file', path: 'index.html', content: withSection },
        { kind: 'update_file', path: 'styles.css', content: css.content + '\n' + SNIPPET_CSS },
      ];
      return {
        plan: {
          steps: ['Built a 3-tier pricing section from the demo snippet library.', `Inserted it ${where} in index.html.`, 'Appended the matching styles to styles.css.', 'Validated both operations.'],
          manifest: ['index.html', 'styles.css'],
        },
        ops,
        summary: `Pricing section added ${where}. Edit the tiers and prices directly in the editor to make them yours.`,
        warnings: [],
      };
    }

    // 3. Add a testimonials section
    if (/add\s+(?:a\s+)?testimonials?(\s+section)?/i.test(text)) {
      const html = findFile(files, 'index.html');
      const css = findFile(files, 'styles.css');
      if (!html || !css) return emptyResult('This project needs index.html and styles.css for me to add a section.');
      if (/id=["']testimonials["']/i.test(html.content)) {
        return emptyResult('This project already has a testimonials section (id="testimonials").');
      }
      const { html: withSection, where } = insertBeforeAnchor(html.content, testimonialsSnippet());
      const ops: FileOp[] = [
        { kind: 'update_file', path: 'index.html', content: withSection },
        { kind: 'update_file', path: 'styles.css', content: css.content + '\n' + SNIPPET_CSS },
      ];
      return {
        plan: {
          steps: ['Built a testimonials section from the demo snippet library.', `Inserted it ${where} in index.html.`, 'Appended the matching styles to styles.css.', 'Validated both operations.'],
          manifest: ['index.html', 'styles.css'],
        },
        ops,
        summary: `Testimonials section added ${where}. Replace the sample quotes with real ones in the editor.`,
        warnings: [],
      };
    }

    // 4. Change accent color
    m = text.match(/change\s+(?:the\s+)?(?:accent|primary|brand)\s+colou?r\s+to\s+(#[0-9a-f]{3,8}|[a-z]+)/i);
    if (m) {
      const color = m[1].toLowerCase();
      const css = findFile(files, 'styles.css');
      if (!css) return emptyResult('There is no styles.css in this project.');
      if (!/--accent\s*:/.test(css.content)) {
        return emptyResult('I could not find an --accent variable in styles.css.');
      }
      const updated = css.content.replace(/--accent\s*:\s*[^;]+;/, `--accent: ${color};`);
      return {
        plan: {
          steps: ['Located the --accent CSS variable in styles.css.', `Set it to ${color}.`, 'Validated the operation.'],
          manifest: ['styles.css'],
        },
        ops: [{ kind: 'update_file', path: 'styles.css', content: updated }],
        summary: `Accent color changed to ${color}. (The softer --accent-soft highlight was left untouched.)`,
        warnings: [],
      };
    }

    // 5. Rename the business
    m = text.match(/(?:rename|change)\s+(?:the\s+)?(?:business|brand|company|site)(?:\s+name)?\s+to\s+["“]?([^"”\n]+)["”]?/i);
    if (m) {
      const next = m[1].trim().slice(0, 60);
      const html = findFile(files, 'index.html');
      if (!html) return emptyResult('There is no index.html in this project.');
      const titleMatch = html.content.match(/<title>\s*([^<—–\-|]+)/i);
      const current = titleMatch ? titleMatch[1].trim() : '';
      if (!current) {
        return emptyResult('I could not detect the current business name from the <title> tag.');
      }
      const ops: FileOp[] = [];
      for (const f of files) {
        if (!/\.html?$/i.test(f.path)) continue;
        if (f.content.includes(current)) {
          ops.push({ kind: 'update_file', path: f.path, content: f.content.split(current).join(next) });
        }
      }
      if (ops.length === 0) {
        return emptyResult(`The name "${current}" does not appear in any HTML file.`);
      }
      return {
        plan: {
          steps: [`Detected the current name "${current}" from the page title.`, `Replaced it with "${next}" across ${ops.length} HTML file(s).`, 'Validated the operations.'],
          manifest: ops.map((o) => o.path),
        },
        ops,
        summary: `Business renamed from "${current}" to "${next}".`,
        warnings: [],
      };
    }

    // 6. Delete a file
    m = text.match(/delete\s+(?:the\s+)?file\s+([A-Za-z0-9_.-]+)/i);
    if (m) {
      const target = m[1];
      if (target.toLowerCase() === 'index.html') {
        return emptyResult('I will not delete index.html — the live preview needs it. Delete it manually in the file explorer if you really mean it.');
      }
      const exists = findFile(files, target);
      if (!exists) {
        return emptyResult(`There is no file named "${target}" in this project.`);
      }
      return {
        plan: {
          steps: [`Verified "${target}" exists.`, 'Queued a delete_file operation.', 'Validated the operation.'],
          manifest: [target],
        },
        ops: [{ kind: 'delete_file', path: target }],
        summary: `Deleted "${target}". Your previous version is still in version history if you need it back.`,
        warnings: target === 'styles.css' || target === 'app.js'
          ? [`"${target}" is referenced by index.html — the preview may look broken until you fix the reference.`]
          : [],
      };
    }

    // 7. Help
    if (/^(help|what can you do|commands)/i.test(text)) {
      return emptyResult(
        'Demo mode works with built-in templates and predictable edits.\n' + supportedList(),
      );
    }

    // 8. Dark mode is already the default
    if (/dark\s*mode/i.test(text)) {
      return emptyResult('All demo templates are already dark-first, so there is nothing to change. (A light theme is not part of the demo engine.)');
    }

    return emptyResult(supportedList());
  }
}
