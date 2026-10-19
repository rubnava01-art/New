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
  '“cambia el título principal a …”',
  '“agrega una sección de precios”',
  '“agrega una sección de testimonios”',
  '“cambia el color a #7c5cff”',
  '“cambia el nombre del negocio a …”',
  '“elimina el archivo app.js”',
];

function supportedList(): string {
  return (
    'No entendí eso como una modificación del demo. En modo demo puedo:\n' +
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
    [/<footer[\s>]/i, 'antes del pie de página'],
    [/<\/main>/i, 'al final del contenido principal'],
    [/<\/body>/i, 'al final de la página'],
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
  return { html: html + '\n' + snippet, where: 'al final de la página' };
}

const SNIPPET_CSS = `
/* Agregado por NEST Forge AI (motor demo) */
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
        <p class="eyebrow">Precios</p>
        <h2>Precios simples y honestos.</h2>
        <div class="nf-grid">
          <article class="nf-card"><h3>Básico</h3><p class="nf-price">$29/mes</p><p>Todo lo que necesitas para empezar.</p></article>
          <article class="nf-card"><h3>Pro</h3><p class="nf-price">$79/mes</p><p>Para equipos en crecimiento que necesitan más potencia.</p></article>
          <article class="nf-card"><h3>Empresarial</h3><p class="nf-price">Personalizado</p><p>Soporte dedicado y límites a medida.</p></article>
        </div>
      </div>
    </section>`;
}

function testimonialsSnippet(): string {
  return `
    <section class="nf-section" id="testimonials">
      <div class="container">
        <p class="eyebrow">Testimonios</p>
        <h2>Lo que dicen nuestros clientes.</h2>
        <div class="nf-grid">
          <article class="nf-card"><p class="nf-quote">"Justo lo que necesitábamos — funcionando en un día."</p><p class="nf-who">— Alex M., Fundador</p></article>
          <article class="nf-card"><p class="nf-quote">"El equipo de soporte es fantástico y el producto simplemente funciona."</p><p class="nf-who">— Priya S., Directora de operaciones</p></article>
          <article class="nf-card"><p class="nf-quote">"Cambiamos desde un competidor y no hemos mirado atrás."</p><p class="nf-who">— Jordan L., Líder de marketing</p></article>
        </div>
      </div>
    </section>`;
}

export class DemoProvider implements AIProvider {
  readonly id = 'demo';
  readonly label = 'Motor demo (sin API key)';
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
          `Analicé tu pedido y elegí la plantilla "${template.name}" (coincidencia determinista por palabras clave).`,
          `Personalicé la plantilla para "${name}".`,
          `Generé ${files.length} archivos: ${files.map((f) => f.path).join(', ')}.`,
          'Validé cada operación de archivo (rutas, extensiones, tamaños).',
        ],
        manifest: files.map((f) => f.path),
      },
      ops,
      summary:
        `Creé "${name}" con la plantilla ${template.name} (${files.length} archivos). ` +
        `Salida DEMO: basada en plantillas, no generada por un modelo. Prueba ${SUPPORTED_MODS[0]} o ${SUPPORTED_MODS[1]}.`,
      warnings: [
        'Modo demo: los diseños vienen de plantillas integradas. Un proveedor de IA real llega en la Fase 3.',
      ],
    };
  }

  async modify(prompt: string, files: ProjectFile[]): Promise<GenerationResult> {
    const text = prompt.trim();

    // 1. Change hero title (EN + ES)
    let m = text.match(/change\s+(?:the\s+)?hero\s+(?:title|heading)\s+to\s+["“]?([^"”\n]+)["”]?/i)
      ?? text.match(/cambia\s+(?:el\s+)?(?:t[ií]tulo|encabezado)(?:\s+principal|\s+del\s+hero)?\s+a\s+["“]?([^"”\n]+)["”]?/i);
    if (m) {
      const title = m[1].trim().slice(0, 120);
      const html = findFile(files, 'index.html');
      if (!html) return emptyResult('No hay un index.html en este proyecto, así que no puedo cambiar el título principal.');
      if (!/<h1[\s>]/i.test(html.content)) {
        return emptyResult('No encontré un título <h1> en index.html.');
      }
      const updated = html.content.replace(
        /(<h1[^>]*>)([\s\S]*?)(<\/h1>)/i,
        `$1${escapeHtml(title)}$3`,
      );
      return {
        plan: {
          steps: ['Localicé el título <h1> en index.html.', 'Reemplacé su texto (con escape HTML).', 'Validé la operación.'],
          manifest: ['index.html'],
        },
        ops: [{ kind: 'update_file', path: 'index.html', content: updated }],
        summary: `Título principal cambiado a "${title}".`,
        warnings: [],
      };
    }

    // 2. Add a pricing section (EN + ES)
    if (/add\s+(?:a\s+)?pricing(\s+section)?/i.test(text)
      || /(?:agrega|añade)\s+(?:una\s+)?secci[óo]n\s+de\s+precios/i.test(text)) {
      const html = findFile(files, 'index.html');
      const css = findFile(files, 'styles.css');
      if (!html || !css) return emptyResult('Este proyecto necesita index.html y styles.css para agregar una sección.');
      if (/id=["']pricing["']/i.test(html.content)) {
        return emptyResult('Este proyecto ya tiene una sección de precios (id="pricing").');
      }
      const { html: withSection, where } = insertBeforeAnchor(html.content, pricingSnippet());
      const ops: FileOp[] = [
        { kind: 'update_file', path: 'index.html', content: withSection },
        { kind: 'update_file', path: 'styles.css', content: css.content + '\n' + SNIPPET_CSS },
      ];
      return {
        plan: {
          steps: ['Construí una sección de precios de 3 niveles desde la librería demo.', `La inserté ${where} en index.html.`, 'Agregué los estilos correspondientes a styles.css.', 'Validé ambas operaciones.'],
          manifest: ['index.html', 'styles.css'],
        },
        ops,
        summary: `Sección de precios agregada ${where}. Edita los planes y precios directamente en el editor para hacerlos tuyos.`,
        warnings: [],
      };
    }

    // 3. Add a testimonials section (EN + ES)
    if (/add\s+(?:a\s+)?testimonials?(\s+section)?/i.test(text)
      || /(?:agrega|añade)\s+(?:una\s+)?secci[óo]n\s+de\s+(?:testimonios|opiniones|rese[ñn]as)/i.test(text)) {
      const html = findFile(files, 'index.html');
      const css = findFile(files, 'styles.css');
      if (!html || !css) return emptyResult('Este proyecto necesita index.html y styles.css para agregar una sección.');
      if (/id=["']testimonials["']/i.test(html.content)) {
        return emptyResult('Este proyecto ya tiene una sección de testimonios (id="testimonials").');
      }
      const { html: withSection, where } = insertBeforeAnchor(html.content, testimonialsSnippet());
      const ops: FileOp[] = [
        { kind: 'update_file', path: 'index.html', content: withSection },
        { kind: 'update_file', path: 'styles.css', content: css.content + '\n' + SNIPPET_CSS },
      ];
      return {
        plan: {
          steps: ['Construí una sección de testimonios desde la librería demo.', `La inserté ${where} en index.html.`, 'Agregué los estilos correspondientes a styles.css.', 'Validé ambas operaciones.'],
          manifest: ['index.html', 'styles.css'],
        },
        ops,
        summary: `Sección de testimonios agregada ${where}. Reemplaza las opiniones de ejemplo con reales en el editor.`,
        warnings: [],
      };
    }

    // 4. Change accent color (EN + ES)
    m = text.match(/change\s+(?:the\s+)?(?:accent|primary|brand)\s+colou?r\s+to\s+(#[0-9a-f]{3,8}|[a-z]+)/i)
      ?? text.match(/cambia\s+(?:el\s+)?color(?:\s+(?:principal|de\s+acento|de\s+la\s+marca))?\s+a\s+(#[0-9a-f]{3,8}|[a-záéíóúñ]+)/i);
    if (m) {
      const color = m[1].toLowerCase();
      const css = findFile(files, 'styles.css');
      if (!css) return emptyResult('No hay un styles.css en este proyecto.');
      if (!/--accent\s*:/.test(css.content)) {
        return emptyResult('No encontré la variable --accent en styles.css.');
      }
      const updated = css.content.replace(/--accent\s*:\s*[^;]+;/, `--accent: ${color};`);
      return {
        plan: {
          steps: ['Localicé la variable CSS --accent en styles.css.', `La cambié a ${color}.`, 'Validé la operación.'],
          manifest: ['styles.css'],
        },
        ops: [{ kind: 'update_file', path: 'styles.css', content: updated }],
        summary: `Color de acento cambiado a ${color}. (El tono suave --accent-soft quedó intacto.)`,
        warnings: [],
      };
    }

    // 5. Rename the business (EN + ES)
    m = text.match(/(?:rename|change)\s+(?:the\s+)?(?:business|brand|company|site)(?:\s+name)?\s+to\s+["“]?([^"”\n]+)["”]?/i)
      ?? text.match(/(?:cambia|renombra)\s+el\s+nombre(?:\s+(?:del\s+negocio|de\s+la\s+empresa|de\s+la\s+marca|del\s+sitio))?\s+a\s+["“]?([^"”\n]+)["”]?/i);
    if (m) {
      const next = m[1].trim().slice(0, 60);
      const html = findFile(files, 'index.html');
      if (!html) return emptyResult('No hay un index.html en este proyecto.');
      const titleMatch = html.content.match(/<title>\s*([^<—–\-|]+)/i);
      const current = titleMatch ? titleMatch[1].trim() : '';
      if (!current) {
        return emptyResult('No pude detectar el nombre actual del negocio desde la etiqueta <title>.');
      }
      const ops: FileOp[] = [];
      for (const f of files) {
        if (!/\.html?$/i.test(f.path)) continue;
        if (f.content.includes(current)) {
          ops.push({ kind: 'update_file', path: f.path, content: f.content.split(current).join(next) });
        }
      }
      if (ops.length === 0) {
        return emptyResult(`El nombre "${current}" no aparece en ningún archivo HTML.`);
      }
      return {
        plan: {
          steps: [`Detecté el nombre actual "${current}" desde el título de la página.`, `Lo reemplacé por "${next}" en ${ops.length} archivo(s) HTML.`, 'Validé las operaciones.'],
          manifest: ops.map((o) => o.path),
        },
        ops,
        summary: `Negocio renombrado de "${current}" a "${next}".`,
        warnings: [],
      };
    }

    // 6. Delete a file (EN + ES)
    m = text.match(/delete\s+(?:the\s+)?file\s+([A-Za-z0-9_.-]+)/i)
      ?? text.match(/elimina\s+(?:el\s+)?archivo\s+([A-Za-z0-9_.-]+)/i);
    if (m) {
      const target = m[1];
      if (target.toLowerCase() === 'index.html') {
        return emptyResult('No voy a eliminar index.html — la vista previa en vivo lo necesita. Elimínalo manualmente en el explorador de archivos si de verdad lo quieres.');
      }
      const exists = findFile(files, target);
      if (!exists) {
        return emptyResult(`No hay ningún archivo llamado "${target}" en este proyecto.`);
      }
      return {
        plan: {
          steps: [`Verifiqué que "${target}" existe.`, 'Preparé una operación delete_file.', 'Validé la operación.'],
          manifest: [target],
        },
        ops: [{ kind: 'delete_file', path: target }],
        summary: `Eliminé "${target}". Tu versión anterior sigue en el historial por si la necesitas.`,
        warnings: target === 'styles.css' || target === 'app.js'
          ? [`"${target}" está referenciado por index.html — la vista previa puede verse rota hasta que corrijas la referencia.`]
          : [],
      };
    }

    // 7. Help (EN + ES)
    if (/^(help|what can you do|commands)/i.test(text)
      || /^(ayuda|qu[eé]\s+puedes\s+hacer|comandos)/i.test(text)) {
      return emptyResult(
        'El modo demo funciona con plantillas integradas y ediciones predecibles.\n' + supportedList(),
      );
    }

    // 8. Dark mode is already the default (EN + ES)
    if (/dark\s*mode/i.test(text) || /modo\s+oscuro/i.test(text)) {
      return emptyResult('Todas las plantillas demo ya son oscuras por defecto, así que no hay nada que cambiar. (Un tema claro no es parte del motor demo.)');
    }

    return emptyResult(supportedList());
  }
}
