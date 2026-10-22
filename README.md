# NEST Forge AI

Browser-based AI application builder (MVP). Describe a web application in natural
language, get working source code, preview it live, iterate through chat, keep
version history, and export the project as a ZIP.

**Status: demo mode.** Generation is deterministic and template-based — no API key
needed, no model calls. The provider abstraction is ready for a real AI backend
(Phase 3).

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev      # dev server with hot reload
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build locally
```

## Deploy to GitHub Pages (free)

`vite.config.ts` already sets `base: './'` so assets use relative paths and the
app works from `https://<username>.github.io/<repo>/`.

**Option A — GitHub Actions (recommended, already wired):**

1. Push this repo to GitHub.
2. Go to *Settings → Pages* and set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually). The included workflow
   (`.github/workflows/deploy.yml`) builds the app and publishes `dist/`.

**Option B — manual `gh-pages` branch:**

```bash
npm run build
# publish the dist/ folder to the gh-pages branch, e.g.:
npx gh-pages -d dist
```

Then set *Settings → Pages → Source* to the `gh-pages` branch.

## What the MVP includes

- **3-panel workspace** — projects sidebar, AI chat, live preview; collapsible /
  tabbed layout on mobile.
- **Project management** — create, rename, duplicate, delete (with confirmation),
  search, modification dates.
- **Demo generation engine** — 4 real multi-file templates (marketing agency,
  portfolio, restaurant, SaaS landing); predictable chat modifications
  (hero title, pricing/testimonials sections, accent color, rename, delete file)
  via validated structured operations (`create_file` / `update_file` / `delete_file`).
- **Validation** — every operation is checked before applying: flat file names
  only (no path traversal), extension allowlist
  (`.html .css .js .json .md .txt .svg`), per-file size limit. Invalid output is
  rejected and reported, never applied.
- **Sandboxed preview** — generated pages render in an
  `iframe sandbox="allow-scripts"` (no `allow-same-origin`); project CSS/JS is
  inlined so relative references work. Desktop / tablet / mobile viewports.
- **File explorer + editor** — create/delete files, dirty indicators, Ctrl+S.
- **Version history** — a snapshot is saved before every engine change; restore
  any version (restore itself creates a new snapshot).
- **ZIP export** — source files + `README.md` + `package.json`; secret-like
  files are excluded.
- **Local-first persistence** — projects live in IndexedDB via the
  `StorageProvider` interface.

## Architecture

```
src/
  types.ts                 Project / ProjectFile / Message / Version types
  storage/
    StorageProvider.ts     persistence interface (swap for cloud later)
    IndexedDBStorage.ts    local-first implementation
  providers/
    Provider.ts            AIProvider interface + FileOp types
    DemoProvider.ts        deterministic demo engine (no API key)
    validateOps.ts         operation validation + application
  templates/               4 real templates (index.html + styles.css + app.js)
  preview/
    buildPreviewHtml.ts    inlines project CSS/JS for the sandboxed iframe
  export/
    exportZip.ts           ZIP export with jszip (excludes secrets)
  components/              Sidebar, ChatPanel, PreviewPanel, FileExplorer,
                           CodeEditor, VersionsPanel, Modal
  App.tsx                  state orchestration + responsive layout
```

### Honesty rules baked in

- The UI carries a visible **“Modo demo”** badge; simulated activity is labeled.
- No fake progress: the chat shows the real steps the engine performed.
- Errors (invalid operations, storage failures, export failures) are shown
  plainly; nothing is silently applied.

## Phase 3+ (not implemented)

- **Real AI provider** — implement `AIProvider` against a *server-side* endpoint
  that holds the model API key. Never expose keys in browser code, storage, or
  generated projects. Add rate limiting on the endpoint.
- **React/TypeScript output** — demo templates are static HTML/CSS/JS so the
  sandboxed preview works with no build service. Real React+Vite generation
  needs a preview build service (Phase 4).
- **Cloud persistence** — implement `StorageProvider` for Supabase:
  `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, with row-level security per user.
- **Secure preview hardening** — resource limits and build diagnostics are still
  pending; CSP is already in: every generated preview document gets a
  `<meta http-equiv="Content-Security-Policy">` tag injected by
  `buildPreviewHtml` (inline project scripts/styles allowed; objects, frames,
  workers, form posts, `<base>` and nested frames blocked).
- **Open preview in new tab** — omitted in the MVP because a top-level tab
  cannot be sandboxed the way the iframe is.
- **Credit system** — the free-first MVP has no billing; design any usage
  counter server-side when it arrives.
