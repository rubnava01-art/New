import type { ProjectFile } from '../types';

/**
 * Content Security Policy injected into every generated preview document as a
 * <meta> tag. The preview inlines the project's own scripts/styles, so those
 * still run (inline is allowed); everything else is tightened down:
 * - no plugins/objects, no nested frames, no workers
 * - no form submissions, no <base> URL hijacking
 * - network for generated code is limited to plain fetches/images/media/fonts
 *
 * This matters most for the "open in new tab" view, which — unlike the
 * sandboxed iframe — runs without the iframe sandbox. If the project already
 * ships its own Content-Security-Policy meta tag, it is left untouched.
 */
export const PREVIEW_CSP = [
  "default-src 'none'",
  "script-src 'unsafe-inline'",
  "style-src 'unsafe-inline'",
  'img-src data: blob: https: http:',
  'font-src data: https: http:',
  'media-src data: blob: https: http:',
  'connect-src https: http:',
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-src 'none'",
  "worker-src 'none'",
].join('; ');

/**
 * Insert the CSP <meta> as early as possible in <head> (CSP meta tags only
 * govern resources parsed after them), or at the top of the document when
 * there is no <head> / <html> tag at all.
 */
export function injectPreviewCsp(html: string): string {
  if (/http-equiv\s*=\s*["']?content-security-policy/gi.test(html)) {
    return html; // project already sets its own policy; respect it
  }
  const meta = `<meta http-equiv="Content-Security-Policy" content="${PREVIEW_CSP}" />`;
  const headMatch = /<head\b[^>]*>/i.exec(html);
  if (headMatch) {
    const at = headMatch.index + headMatch[0].length;
    return html.slice(0, at) + '\n' + meta + html.slice(at);
  }
  const htmlMatch = /<html\b[^>]*>/i.exec(html);
  if (htmlMatch) {
    const at = htmlMatch.index + htmlMatch[0].length;
    return html.slice(0, at) + `\n<head>\n${meta}\n</head>` + html.slice(at);
  }
  return meta + '\n' + html;
}

/**
 * Message type posted by the in-preview error reporter (see
 * injectErrorReporter) to the app window. The parent PreviewPanel listens
 * for it and verifies the message came from its own preview iframe.
 */
export const PREVIEW_ERROR_MESSAGE_TYPE = 'nest-forge-preview-error';

/**
 * Message type posted by the in-preview heartbeat (see injectErrorReporter)
 * every 2 seconds while the preview's main thread is alive. PreviewPanel
 * uses it as a watchdog: if heartbeats stop, the preview is treated as
 * unresponsive (e.g. a synchronous infinite loop froze it) and the panel
 * offers to reload the iframe, which kills the loop.
 */
export const PREVIEW_HEARTBEAT_MESSAGE_TYPE = 'nest-forge-preview-heartbeat';

/** Shape of one runtime error reported from inside the preview iframe. */
export interface PreviewError {
  kind: 'error' | 'promise';
  message: string;
  lineno: number;
  colno: number;
}

/**
 * Marker comment inside the injected reporter script; used to keep
 * re-processing idempotent.
 */
const REPORTER_MARKER = 'nest-forge-preview-reporter';

/**
 * Inline script that runs inside the preview document and forwards runtime
 * JS errors (window 'error' events and unhandled promise rejections) to the
 * parent app via postMessage, so the preview panel can show diagnostics.
 *
 * Why postMessage: the preview iframe is sandboxed without
 * allow-same-origin, so the app cannot read into it (opaque origin) — but
 * the iframe itself is allowed to postMessage out to its parent.
 *
 * The reporter installs before any project script runs (it is injected at
 * the end of <head>, before the inlined project scripts that
 * buildPreviewHtml appends later in the body), so syntax-time failures in
 * the document are still caught. It only posts when it is actually inside
 * an iframe (window.parent !== window), so "open in new tab" views are not
 * affected. Reporting is capped at 20 errors to survive runaway loops.
 *
 * Heartbeat: the reporter also posts a small heartbeat every 2 seconds.
 * A synchronous infinite loop blocks the preview's main thread, so
 * intervals stop firing — that silence is exactly what PreviewPanel's
 * watchdog detects. (A loop that yields, e.g. via setTimeout recursion,
 * keeps the thread alive and is NOT caught; it also does not freeze the
 * preview, so the user can still hit "Actualizar" manually.)
 */
const REPORTER_SCRIPT =
  `<script>\n` +
  `/* ${REPORTER_MARKER} */\n` +
  `(function () {\n` +
  `  if (window.__nestForgeReporter) return;\n` +
  `  window.__nestForgeReporter = true;\n` +
  `  var errors = [];\n` +
  `  function send() {\n` +
  `    try {\n` +
  `      if (window.parent && window.parent !== window) {\n` +
  `        window.parent.postMessage({ type: '${PREVIEW_ERROR_MESSAGE_TYPE}', errors: errors.slice() }, '*');\n` +
  `      }\n` +
  `    } catch (e) { /* never break the preview itself */ }\n` +
  `  }\n` +
  `  function report(kind, message, lineno, colno) {\n` +
  `    if (errors.length >= 20) return;\n` +
  `    errors.push({ kind: kind, message: String(message).slice(0, 500), lineno: lineno || 0, colno: colno || 0 });\n` +
  `    send();\n` +
  `  }\n` +
  `  window.addEventListener('error', function (ev) {\n` +
  `    report('error', ev.message || 'Error de JavaScript desconocido', ev.lineno, ev.colno);\n` +
  `  });\n` +
  `  window.addEventListener('unhandledrejection', function (ev) {\n` +
  `    var r = ev.reason;\n` +
  `    var msg = r && (r.stack || r.message) ? String(r.stack || r.message) : String(r);\n` +
  `    report('promise', msg, 0, 0);\n` +
  `  });\n` +
  `  setInterval(function () {\n` +
  `    try {\n` +
  `      if (window.parent && window.parent !== window) {\n` +
  `        window.parent.postMessage({ type: '${PREVIEW_HEARTBEAT_MESSAGE_TYPE}' }, '*');\n` +
  `      }\n` +
  `    } catch (e) { /* never break the preview itself */ }\n` +
  `  }, 2000);\n` +
  `})();\n` +
  `</script>`;

/**
 * Insert the error reporter at the end of <head> (after the CSP meta tag,
 * which injectPreviewCsp places at the top of <head> — CSP meta tags only
 * govern scripts parsed after them, and inline scripts are allowed by the
 * preview policy). Falls back to before </body>, then to the end of the
 * document. Skips injection when the marker is already present, and the
 * caller skips the "No index.html" fallback document entirely.
 */
export function injectErrorReporter(html: string): string {
  if (html.includes(REPORTER_MARKER)) return html;
  const headClose = /<\/head\s*>/i.exec(html);
  if (headClose) {
    const at = headClose.index;
    return html.slice(0, at) + '\n' + REPORTER_SCRIPT + '\n' + html.slice(at);
  }
  const bodyClose = /<\/body\s*>/i.exec(html);
  if (bodyClose) {
    const at = bodyClose.index;
    return html.slice(0, at) + '\n' + REPORTER_SCRIPT + '\n' + html.slice(at);
  }
  return html + '\n' + REPORTER_SCRIPT + '\n';
}

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

  const fallback = '<!DOCTYPE html><html><body style="background:#101114;color:#a7abb6;font-family:sans-serif;padding:40px"><p>No index.html in this project yet — generate or create one to see a preview.</p></body></html>';
  if (!html.trim()) {
    return fallback;
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

  // Runtime error diagnostics: the sandboxed iframe cannot be read from the
  // outside (opaque origin), so the preview document itself reports JS errors
  // back to the app via postMessage (see injectErrorReporter). The "No
  // index.html" fallback document above gets neither CSP nor a reporter —
  // there is no project code in it to diagnose.
  return injectErrorReporter(injectPreviewCsp(html));
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
