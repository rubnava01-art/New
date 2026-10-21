import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChatMessage, Project, ProjectMeta, ProjectVersion } from './types';
import { newId, nowIso, toMeta } from './types';
import { IndexedDBStorage } from './storage/IndexedDBStorage';
import { DemoProvider } from './providers/DemoProvider';
import { applyOps, validateOps } from './providers/validateOps';
import { extractBusinessName } from './templates';
import { buildPreviewHtml } from './preview/buildPreviewHtml';
import { downloadBlob, exportProjectZip } from './export/exportZip';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import PreviewPanel from './components/PreviewPanel';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/CodeEditor';
import VersionsPanel from './components/VersionsPanel';
import Modal from './components/Modal';

type CenterTab = 'chat' | 'files' | 'versions';
type MobileView = 'projects' | 'chat' | 'code' | 'preview';

const PATH_RE = /^[A-Za-z0-9][A-Za-z0-9_.-]*$/;
const ALLOWED_EXT = ['.html', '.css', '.js', '.json', '.md', '.txt', '.svg'];

function starterFor(name: string): string {
  if (name.endsWith('.html')) {
    return '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>New page</title>\n</head>\n<body>\n  <h1>Hello</h1>\n</body>\n</html>\n';
  }
  if (name.endsWith('.css')) return '/* styles */\n';
  if (name.endsWith('.js')) return '// scripts\n';
  return '';
}

function welcomeMessage(): ChatMessage {
  return {
    id: newId(),
    role: 'assistant',
    createdAt: nowIso(),
    kind: 'info',
    content:
      'Bienvenido a NEST Forge AI (modo demo). Describe el sitio web que quieres — por ejemplo "Crea el sitio de un restaurante llamado Casa Verde" — y lo construyo con plantillas reales. Después pide cambios como "cambia el título principal a …" o "agrega una sección de precios".',
  };
}

export default function App() {
  const storageRef = useRef(new IndexedDBStorage());
  const providerRef = useRef(new DemoProvider());
  const readyRef = useRef(false);
  const saveTimerRef = useRef<number | null>(null);
  const projectRef = useRef<Project | null>(null);

  const [metas, setMetas] = useState<ProjectMeta[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [activePath, setActivePath] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [centerTab, setCenterTab] = useState<CenterTab>('chat');
  const [mobileView, setMobileView] = useState<MobileView>('chat');
  const [working, setWorking] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [booted, setBooted] = useState(false);

  const refreshMetas = useCallback(async () => {
    try {
      setMetas(await storageRef.current.listProjects());
    } catch (err) {
      setStorageError(err instanceof Error ? err.message : 'Error de almacenamiento');
    }
  }, []);

  // Initial load: newest project, if any.
  useEffect(() => {
    (async () => {
      try {
        const list = await storageRef.current.listProjects();
        setMetas(list);
        if (list.length > 0) {
          const full = await storageRef.current.getProject(list[0].id);
          if (full) {
            setProject(full);
            setActivePath(full.files.some((f) => f.path === 'index.html') ? 'index.html' : (full.files[0]?.path ?? null));
          }
        }
      } catch (err) {
        setStorageError(err instanceof Error ? err.message : 'Error de almacenamiento');
      } finally {
        readyRef.current = true;
        setBooted(true);
      }
    })();
  }, []);

  // Debounced persistence of the active project, with a flush path.
  // The 600ms debounce alone can lose the latest changes if the tab is
  // closed or backgrounded before the timer fires, so the latest project is
  // also pushed to IndexedDB immediately on pagehide / when the tab hides.
  const persistNow = useCallback(() => {
    const latest = projectRef.current;
    if (!readyRef.current || !latest) return;
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    storageRef.current
      .saveProject(latest)
      .then(() => {
        setMetas((prev) => {
          const meta = toMeta(latest);
          const next = [meta, ...prev.filter((m) => m.id !== meta.id)];
          next.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
          return next;
        });
      })
      .catch((err) =>
        setStorageError(err instanceof Error ? err.message : 'No se pudo guardar'),
      );
  }, []);

  // Always have the latest project available for the flush path.
  useEffect(() => {
    projectRef.current = project;
  }, [project]);

  // Flush pending changes when the page is hidden or unloaded so the last
  // 600ms of work is never silently lost.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') persistNow();
    };
    window.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', persistNow);
    return () => {
      window.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', persistNow);
    };
  }, [persistNow]);

  // Debounced persistence of the active project.
  useEffect(() => {
    if (!readyRef.current || !project) return;
    saveTimerRef.current = window.setTimeout(persistNow, 600);
    return () => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [project, persistNow]);

  const selectProject = useCallback(async (id: string) => {
    try {
      const full = await storageRef.current.getProject(id);
      if (!full) return;
      setProject(full);
      setDrafts({});
      setActivePath(full.files.some((f) => f.path === 'index.html') ? 'index.html' : (full.files[0]?.path ?? null));
      setCenterTab('chat');
    } catch (err) {
      setStorageError(err instanceof Error ? err.message : 'Error de almacenamiento');
    }
  }, []);

  const newProject = useCallback(() => {
    const stamp = nowIso();
    const p: Project = {
      id: newId(),
      name: 'Proyecto sin título',
      createdAt: stamp,
      updatedAt: stamp,
      files: [],
      messages: [welcomeMessage()],
      versions: [],
      generationStatus: 'idle',
    };
    setProject(p);
    setActivePath(null);
    setDrafts({});
    setCenterTab('chat');
    setMobileView('chat');
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!project || working) return;
      const clean = text.trim();
      if (!clean) return;

      let p: Project = {
        ...project,
        messages: [...project.messages, { id: newId(), role: 'user', content: clean, createdAt: nowIso() }],
        generationStatus: 'working',
      };
      setProject(p);
      setWorking(true);

      try {
        const isNew = p.files.length === 0;
        const result = isNew
          ? await providerRef.current.generate(clean)
          : await providerRef.current.modify(clean, p.files);
        const report = validateOps(result.ops, p.files);
        const stamp = nowIso();

        if (!report.valid) {
          const errMsg: ChatMessage = {
            id: newId(),
            role: 'assistant',
            createdAt: stamp,
            kind: 'error',
            content:
              'El motor demo produjo operaciones inválidas, así que no se cambió nada:\n' +
              report.errors.map((e) => `• ${e}`).join('\n'),
          };
          p = { ...p, messages: [...p.messages, errMsg], generationStatus: 'error', updatedAt: stamp };
        } else if (result.ops.length === 0) {
          // Informational answer (e.g. help, "already dark") — no file change, no version.
          const infoMsg: ChatMessage = {
            id: newId(),
            role: 'assistant',
            createdAt: stamp,
            kind: 'info',
            content: result.summary,
          };
          p = { ...p, messages: [...p.messages, infoMsg], generationStatus: 'idle', updatedAt: stamp };
        } else {
          const nextFiles = applyOps(p.files, result.ops, stamp);
          const version: ProjectVersion = {
            id: newId(),
            versionNumber: p.versions.length + 1,
            files: p.files.map((f) => ({ ...f })),
            createdAt: stamp,
            changeSummary: result.summary.slice(0, 220),
          };
          const planMsg: ChatMessage = {
            id: newId(),
            role: 'assistant',
            createdAt: stamp,
            kind: 'plan',
            content: 'Plan:\n' + result.plan.steps.map((s, i) => `${i + 1}. ${s}`).join('\n'),
          };
          const summaryMsg: ChatMessage = {
            id: newId(),
            role: 'assistant',
            createdAt: stamp,
            kind: 'summary',
            content: result.summary + (result.warnings.length > 0 ? '\n\nNote: ' + result.warnings.join(' ') : ''),
          };
          let name = p.name;
          if (isNew && name === 'Proyecto sin título') {
            name = `Sitio de ${extractBusinessName(clean)}`.slice(0, 80);
          }
          p = {
            ...p,
            name,
            files: nextFiles,
            versions: [...p.versions, version],
            messages: [...p.messages, planMsg, summaryMsg],
            generationStatus: 'idle',
            updatedAt: stamp,
          };
          const firstCreated = result.ops.find((o) => o.kind === 'create_file');
          if (firstCreated) setActivePath(firstCreated.path);
          setCenterTab('chat');
          // On phones/tablets jump straight to the preview so the result is visible.
          if (window.matchMedia('(max-width: 1023px)').matches) {
            setMobileView('preview');
          }
        }
      } catch (err) {
        const stamp = nowIso();
        p = {
          ...p,
          messages: [
            ...p.messages,
            {
              id: newId(),
              role: 'assistant',
              createdAt: stamp,
              kind: 'error',
              content: `Algo salió mal al ejecutar el motor demo: ${err instanceof Error ? err.message : 'error desconocido'}. No se cambió nada.`,
            },
          ],
          generationStatus: 'error',
          updatedAt: stamp,
        };
      }

      setProject(p);
      setWorking(false);
    },
    [project, working],
  );

  // ---- File editing ----
  const activeFile = project?.files.find((f) => f.path === activePath) ?? null;
  const editorValue = activePath && activePath in drafts ? drafts[activePath] : (activeFile?.content ?? '');
  const editorDirty = !!activePath && activePath in drafts;
  const dirtyPaths = Object.keys(drafts);

  const saveFile = useCallback(() => {
    if (!project || !activePath || !(activePath in drafts)) return;
    const stamp = nowIso();
    setProject({
      ...project,
      files: project.files.map((f) =>
        f.path === activePath ? { ...f, content: drafts[activePath], updatedAt: stamp } : f,
      ),
      updatedAt: stamp,
    });
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[activePath];
      return next;
    });
  }, [project, activePath, drafts]);

  const createFile = useCallback(
    (name: string): string | null => {
      if (!project) return 'Ningún proyecto seleccionado.';
      if (!PATH_RE.test(name) || name.includes('..')) {
        return 'Usa un nombre de archivo simple (letras, números, guiones, puntos) — sin carpetas.';
      }
      const ext = name.slice(name.lastIndexOf('.')).toLowerCase();
      if (!ALLOWED_EXT.includes(ext)) {
        return `Extensión "${ext || '(ninguna)'}" no permitida. Usa: ${ALLOWED_EXT.join(', ')}.`;
      }
      if (project.files.some((f) => f.path === name)) return 'Ese archivo ya existe.';
      const stamp = nowIso();
      setProject({
        ...project,
        files: [...project.files, { path: name, content: starterFor(name), updatedAt: stamp }],
        updatedAt: stamp,
      });
      setActivePath(name);
      return null;
    },
    [project],
  );

  const deleteFile = useCallback(
    (path: string) => {
      if (!project) return;
      const stamp = nowIso();
      const files = project.files.filter((f) => f.path !== path);
      setProject({ ...project, files, updatedAt: stamp });
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[path];
        return next;
      });
      if (activePath === path) {
        setActivePath(files.some((f) => f.path === 'index.html') ? 'index.html' : (files[0]?.path ?? null));
      }
    },
    [project, activePath],
  );

  // ---- Versions ----
  const restoreVersion = useCallback(
    (versionId: string) => {
      if (!project) return;
      const v = project.versions.find((x) => x.id === versionId);
      if (!v) return;
      const stamp = nowIso();
      const snapshot: ProjectVersion = {
        id: newId(),
        versionNumber: project.versions.length + 1,
        files: project.files.map((f) => ({ ...f })),
        createdAt: stamp,
        changeSummary: `Copia de seguridad antes de restaurar la v${v.versionNumber}`,
      };
      const msg: ChatMessage = {
        id: newId(),
        role: 'assistant',
        createdAt: stamp,
        kind: 'summary',
        content: `Restauré la versión v${v.versionNumber} ("${v.changeSummary}"). El estado anterior quedó guardado como v${snapshot.versionNumber}.`,
      };
      setProject({
        ...project,
        files: v.files.map((f) => ({ ...f })),
        versions: [...project.versions, snapshot],
        messages: [...project.messages, msg],
        updatedAt: stamp,
      });
      setDrafts({});
      setActivePath(v.files.some((f) => f.path === 'index.html') ? 'index.html' : (v.files[0]?.path ?? null));
      setCenterTab('chat');
    },
    [project],
  );

  // ---- Project management ----
  const renameProject = useCallback(
    async (id: string, name: string) => {
      const full = await storageRef.current.getProject(id);
      if (!full) return;
      const updated = { ...full, name, updatedAt: nowIso() };
      await storageRef.current.saveProject(updated);
      if (project?.id === id) setProject(updated);
      refreshMetas();
    },
    [project, refreshMetas],
  );

  const duplicateProject = useCallback(
    async (id: string) => {
      const full = await storageRef.current.getProject(id);
      if (!full) return;
      const stamp = nowIso();
      const copy: Project = {
        ...full,
        id: newId(),
        name: `${full.name} (copy)`.slice(0, 80),
        createdAt: stamp,
        updatedAt: stamp,
      };
      await storageRef.current.saveProject(copy);
      refreshMetas();
      selectProject(copy.id);
    },
    [refreshMetas, selectProject],
  );

  const confirmDeleteProject = useCallback(
    async (id: string) => {
      await storageRef.current.deleteProject(id);
      setPendingDeleteId(null);
      const remaining = metas.filter((m) => m.id !== id);
      setMetas(remaining);
      if (project?.id === id) {
        if (remaining.length > 0) {
          selectProject(remaining[0].id);
        } else {
          setProject(null);
          setActivePath(null);
          setDrafts({});
        }
      }
    },
    [metas, project, selectProject],
  );

  // ---- Export ----
  const handleExport = useCallback(async () => {
    if (!project || exporting) return;
    setExporting(true);
    setExportError(null);
    try {
      const blob = await exportProjectZip(project);
      const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'project';
      downloadBlob(blob, `${slug}.zip`);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Falló la exportación');
    } finally {
      setExporting(false);
    }
  }, [project, exporting]);

  // ---- Preview ----
  const previewHtml = useMemo(
    () => (project ? buildPreviewHtml(project.files) : ''),
    [project],
  );
  const hasIndex = !!project?.files.some((f) => f.path === 'index.html');

  const centerTabs: Array<{ id: CenterTab; label: string }> = [
    { id: 'chat', label: 'Chat' },
    { id: 'files', label: `Archivos${dirtyPaths.length > 0 ? ` (${dirtyPaths.length})` : ''}` },
    { id: 'versions', label: `Versiones${project ? ` (${project.versions.length})` : ''}` },
  ];

  const mobileTabs: Array<{ id: MobileView; label: string }> = [
    { id: 'projects', label: 'Proyectos' },
    { id: 'chat', label: 'Chat' },
    { id: 'code', label: 'Código' },
    { id: 'preview', label: 'Vista previa' },
  ];

  if (!booted) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-[#101114] text-white">
        <span className="inline-block h-12 w-12 animate-pulse rounded-2xl bg-gradient-to-br from-[#7c5cff] to-[#9a82ff]" />
        <p className="text-sm font-semibold text-[#a7abb6]">Cargando NEST Forge AI…</p>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-[#101114] text-white">
      {/* Mobile top bar */}
      <div className="border-b border-[#2a2d36] lg:hidden">
        <div className="flex items-center gap-2 px-4 py-2.5">
          <span className="inline-block h-6 w-6 rounded-lg bg-gradient-to-br from-[#7c5cff] to-[#9a82ff]" />
          <span className="font-extrabold tracking-tight">NEST Forge AI</span>
          <span className="rounded-md border border-[#7c5cff]/50 bg-[#7c5cff]/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#9a82ff]">
            Demo
          </span>
          <button
            onClick={handleExport}
            disabled={!project || exporting}
            className="ml-auto rounded-lg border border-[#2a2d36] bg-[#1d1f26] px-3 py-1.5 text-xs font-semibold text-[#a7abb6] disabled:opacity-40"
          >
            {exporting ? 'Exportando…' : 'Exportar ZIP'}
          </button>
        </div>
        <nav className="flex px-2 pb-2">
          {mobileTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setMobileView(t.id)}
              className={`flex-1 rounded-lg px-2 py-2 text-xs font-bold ${
                mobileView === t.id ? 'bg-[#7c5cff] text-white' : 'text-[#a7abb6]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {storageError && (
        <div className="border-b border-red-900 bg-red-950/60 px-4 py-2 text-xs text-red-200">
          Error de almacenamiento: {storageError} — es posible que los cambios no se guarden.
          <button onClick={() => setStorageError(null)} className="ml-2 underline">Descartar</button>
        </div>
      )}
      {exportError && (
        <div className="border-b border-red-900 bg-red-950/60 px-4 py-2 text-xs text-red-200">
          Falló la exportación: {exportError}
          <button onClick={() => setExportError(null)} className="ml-2 underline">Descartar</button>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        {/* Left: projects */}
        <div
          className={`${mobileView === 'projects' ? 'flex' : 'hidden'} w-full shrink-0 border-r border-[#2a2d36] lg:flex lg:w-72`}
        >
          <Sidebar
            projects={metas}
            activeId={project?.id ?? null}
            onNew={newProject}
            onSelect={(id) => { selectProject(id); setMobileView('chat'); }}
            onRename={renameProject}
            onDuplicate={duplicateProject}
            onDelete={(id) => setPendingDeleteId(id)}
          />
        </div>

        {/* Center: chat / files / versions */}
        <div
          className={`${mobileView === 'chat' || mobileView === 'code' ? 'flex' : 'hidden'} min-w-0 flex-1 flex-col border-r border-[#2a2d36] lg:flex`}
        >
          <div className="flex items-center gap-1 border-b border-[#2a2d36] px-3 py-2">
            {centerTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setCenterTab(t.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                  (mobileView === 'code' ? 'files' : centerTab) === t.id
                    ? 'bg-[#1d1f26] text-white'
                    : 'text-[#5b606c] hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
            <button
              onClick={handleExport}
              disabled={!project || exporting}
              className="ml-auto hidden rounded-lg border border-[#2a2d36] bg-[#1d1f26] px-3 py-1.5 text-xs font-semibold text-[#a7abb6] hover:text-white disabled:opacity-40 lg:block"
            >
              {exporting ? 'Exportando…' : '⤓ Exportar ZIP'}
            </button>
          </div>

          <div className="min-h-0 flex-1">
            {(mobileView === 'code' ? 'files' : centerTab) === 'chat' && (
              project ? (
                <ChatPanel
                  projectName={project.name}
                  messages={project.messages}
                  working={working}
                  onSend={sendMessage}
                />
              ) : (
                <EmptyCenter onNew={newProject} />
              )
            )}
            {(mobileView === 'code' ? 'files' : centerTab) === 'files' && (
              project ? (
                <div className="flex h-full flex-col lg:flex-row">
                  <div className="h-44 shrink-0 border-b border-[#2a2d36] lg:h-auto lg:w-60 lg:border-b-0 lg:border-r">
                    <FileExplorer
                      files={project.files}
                      activePath={activePath}
                      dirtyPaths={dirtyPaths}
                      onSelect={setActivePath}
                      onCreate={createFile}
                      onDelete={deleteFile}
                    />
                  </div>
                  <div className="min-h-0 flex-1">
                    {activeFile && activePath ? (
                      <CodeEditor
                        path={activePath}
                        value={editorValue}
                        dirty={editorDirty}
                        onChange={(v) => setDrafts((prev) => ({ ...prev, [activePath]: v }))}
                        onSave={saveFile}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-8 text-center text-sm text-[#5b606c]">
                        Selecciona un archivo para editarlo. Los cambios se marcan hasta que guardes.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <EmptyCenter onNew={newProject} />
              )
            )}
            {(mobileView === 'code' ? 'files' : centerTab) === 'versions' && (
              project ? (
                <VersionsPanel versions={project.versions} onRestore={restoreVersion} />
              ) : (
                <EmptyCenter onNew={newProject} />
              )
            )}
          </div>
        </div>

        {/* Right: preview */}
        <div
          className={`${mobileView === 'preview' ? 'flex' : 'hidden'} w-full shrink-0 flex-col lg:flex lg:w-[44%]`}
        >
          <PreviewPanel
            html={previewHtml}
            buildOk={hasIndex}
            buildNote={hasIndex ? 'index.html encontrado y ensamblado' : 'Agrega un index.html para activar la vista previa'}
            fileCount={project?.files.length ?? 0}
          />
        </div>
      </div>

      {pendingDeleteId && (
        <Modal
          title="¿Eliminar proyecto?"
          message="Esto elimina permanentemente el proyecto, sus archivos, el historial del chat y las versiones. No se puede deshacer."
          confirmLabel="Eliminar"
          danger
          onConfirm={() => confirmDeleteProject(pendingDeleteId)}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  );
}

function EmptyCenter({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <span className="mb-4 inline-block h-12 w-12 rounded-2xl bg-gradient-to-br from-[#7c5cff] to-[#9a82ff]" />
      <h2 className="mb-2 text-lg font-bold text-white">Ningún proyecto abierto</h2>
      <p className="mb-5 max-w-sm text-sm text-[#a7abb6]">
        Crea un proyecto, describe el sitio web que quieres en el chat y el motor demo
        lo construirá con plantillas reales.
      </p>
      <button
        onClick={onNew}
        className="rounded-xl bg-[#7c5cff] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#9a82ff]"
      >
        + Nuevo proyecto
      </button>
    </div>
  );
}
