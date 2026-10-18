import type { ProjectFile } from '../types';

/**
 * Assemble project files into a single self-contained HTML document for the
 * sandboxed preview iframe.
 *
 * Relative references (<link href="*.css"> and <script src="*.js">) that
 * point at files inside the project are inlined, because a sandboxed
 * iframe (no allow-same-origin) cannot resolve relative URLs.
 *
 * Only files that actually exist in the project are inlined; external
 * references are left untouched.
 *
 * Inlined content is escaped so it cannot terminate its own container:
 * a `</script` sequence inside inlined JS (e.g. a string like
 * `"<script>"` written by the user) would otherwise end the script block
 * early and corrupt or inject markup into the preview document; the same
 * holds for `</style` inside inlined CSS.
 */
export function buildPreviewHtml(files: ProjectFile[]): string {
  const byPath = new Map(files.map((f) => [f.path, f.content]));
  let html = byPath.get('index.html') ?? '';

  if (!html.trim()) {
    return '<!DOCTYPE html><html><body style="background:#101114;color:#a7abb6;font-family:sans-serif;padding:40px"><p>No index.html in this project yet — generate or create one to see a preview.</p></body></html>';
  }

  // Inline <link rel="stylesheet" href="..."> for project CSS files.
  html = html.replace(
    /<link\b[^>]*href=["']([^"']+)["'][^>]*>/gi,
    (tag, href: string) => {
      const name = href.split('/').pop() ?? href;
      const css = byPath.get(name);
      if (css === undefined || !/rel=["']?stylesheet/i.test(tag)) return tag;
      return `<style>\n/* inlined from ${escapeComment(name)} */\n${escapeInlineCss(css)}\n</style>`;
    },
  );

  // Inline <script src="..."></script> for project JS files.
  html = html.replace(
    /<script\b[^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>/gi,
    (_tag, src: string) => {
      const name = src.split('/').pop() ?? src;
      const js = byPath.get(name);
      if (js === undefined) return _tag;
      return `<script>\n/* inlined from ${escapeComment(name)} */\n${escapeInlineJs(js)}\n</script>`;
    },
  );

  return html;
}

function escapeComment(s: string): string {
  return s.replace(/\*\//g, '* /');
}

/**
 * Neutralize a `</script` sequence inside inlined JS so the inlined code
 * cannot terminate the surrounding <script> block. Replacing `</` with
 * `<\/` is the standard escape: inside a string literal it evaluates back
 * to the original `</script…` text at runtime (`\/` is a valid escape for
 * `/`), inside a comment it is harmless text, and outside strings/comments
 * valid JS never contains `</script` in the first place. The match's
 * original casing is preserved so the runtime string value is unchanged.
 */
function escapeInlineJs(js: string): string {
  return js.replace(/<\/script/gi, (m) => `<\\/${m.slice(2)}`);
}

/**
 * Same protection for inlined CSS against `</style`: `<\/` is a valid
 * escape inside CSS strings and harmless inside comments.
 */
function escapeInlineCss(css: string): string {
  return css.replace(/<\/style/gi, (m) => `<\\/${m.slice(2)}`);
}
