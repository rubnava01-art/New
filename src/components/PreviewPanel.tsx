import { useEffect, useRef, useState } from 'react';
import {
  PREVIEW_ERROR_MESSAGE_TYPE,
  PREVIEW_HEARTBEAT_MESSAGE_TYPE,
  type PreviewError,
} from '../preview/buildPreviewHtml';

interface PreviewPanelProps {
  html: string;
  buildOk: boolean;
  buildNote: string;
  fileCount: number;
  /** Unsaved drafts actually reflected in this preview (0 = fully saved). */
  unsavedCount?: number;
}

type Viewport = 'desktop' | 'tablet' | 'mobile';

const VIEWPORTS: Record<Viewport, { label: string; width: string }> = {
  desktop: { label: 'Escritorio', width: '100%' },
  tablet: { label: 'Tableta', width: '768px' },
  mobile: { label: 'Móvil', width: '390px' },
};

export default function PreviewPanel({ html, buildOk, buildNote, fileCount, unsavedCount = 0 }: PreviewPanelProps) {
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [refreshKey, setRefreshKey] = useState(0);
  const [errors, setErrors] = useState<PreviewError[]>([]);
  const [diagOpen, setDiagOpen] = useState(false);
  const [unresponsive, setUnresponsive] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const watchdogRef = useRef<number | null>(null);
  // Set by "Ignorar": the banner stays hidden until the next project load
  // or manual refresh, even if the watchdog timer keeps firing.
  const suppressedRef = useRef(false);

  const clearWatchdog = () => {
    if (watchdogRef.current !== null) {
      window.clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
  };
  const armWatchdog = (ms: number) => {
    clearWatchdog();
    watchdogRef.current = window.setTimeout(() => {
      if (!suppressedRef.current) setUnresponsive(true);
    }, ms);
  };

  // Runtime error diagnostics + unresponsiveness watchdog, both fed by the
  // reporter script injected into the preview document. The iframe is
  // sandboxed without allow-same-origin (opaque origin), so the app cannot
  // read its window — instead the reporter postMessages errors and a
  // 2-second heartbeat out. The source check guarantees we only accept
  // messages from our own preview iframe, not from any nested frame the
  // generated page might embed. A synchronous infinite loop blocks the
  // preview's main thread, so heartbeats stop and the watchdog fires; the
  // "Recargar" button then remounts the iframe, which kills the loop.
  // The watchdog is only armed for real previews (buildOk): the "No
  // index.html" fallback document has no reporter and would otherwise
  // trip it immediately.
  useEffect(() => {
    setErrors([]);
    setDiagOpen(false);
    setUnresponsive(false);
    suppressedRef.current = false;
    clearWatchdog();
    if (buildOk) armWatchdog(8000);
    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      const data = event.data;
      if (!data) return;
      if (data.type === PREVIEW_HEARTBEAT_MESSAGE_TYPE) {
        if (!suppressedRef.current) setUnresponsive(false);
        armWatchdog(6000);
        return;
      }
      if (data.type !== PREVIEW_ERROR_MESSAGE_TYPE) return;
      const incoming: PreviewError[] = Array.isArray(data.errors) ? data.errors : [];
      // The reporter sends its FULL error list on every report, so replace
      // the state instead of appending — appending duplicated every error
      // reported before the latest one.
      if (incoming.length > 0) {
        setErrors(incoming);
      }
    };
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      clearWatchdog();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html, refreshKey]);

  // Remounts the iframe (killing any frozen preview loop) and re-arms the
  // watchdog via the effect above.
  const reloadPreview = () => {
    setUnresponsive(false);
    suppressedRef.current = false;
    setRefreshKey((k) => k + 1);
  };

  // Opens the same generated HTML in a real browser tab (via blob URL).
  // Unlike the iframe above, a new tab runs without the iframe sandbox,
  // so the label makes that explicit.
  const openInNewTab = () => {
    if (!buildOk) return;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener');
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  return (
    <div className="flex h-full flex-col bg-[#0c0d10]">
      <div className="flex flex-wrap items-center gap-2 border-b border-[#2a2d36] px-4 py-3">
        <div className="flex rounded-xl border border-[#2a2d36] bg-[#17181d] p-0.5">
          {(Object.keys(VIEWPORTS) as Viewport[]).map((v) => (
            <button
              key={v}
              onClick={() => setViewport(v)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                viewport === v ? 'bg-[#7c5cff] text-white' : 'text-[#a7abb6] hover:text-white'
              }`}
            >
              {VIEWPORTS[v].label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="rounded-xl border border-[#2a2d36] bg-[#17181d] px-3 py-1.5 text-xs font-semibold text-[#a7abb6] hover:text-white"
        >
          ↻ Actualizar
        </button>
        <button
          onClick={openInNewTab}
          disabled={!buildOk}
          title="Abre la vista previa en una pestaña nueva (sin el aislamiento del iframe)"
          className="rounded-xl border border-[#2a2d36] bg-[#17181d] px-3 py-1.5 text-xs font-semibold text-[#a7abb6] hover:text-white disabled:opacity-40"
        >
          ↗ Pestaña nueva
        </button>
        {unsavedCount > 0 && (
          <span
            className="rounded-lg bg-amber-950 px-2 py-1 text-[11px] font-bold text-amber-300"
            title="La vista previa ya incluye estos cambios sin guardar; guarda con Ctrl+S para fijarlos"
          >
            ● {unsavedCount} {unsavedCount === 1 ? 'cambio sin guardar' : 'cambios sin guardar'}
          </span>
        )}
        <span
          className={`ml-auto rounded-lg px-2 py-1 text-[11px] font-bold ${
            buildOk ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
          }`}
          title={buildNote}
        >
          {buildOk ? `✓ Vista previa lista · ${fileCount} archivos` : 'Vista previa no disponible'}
        </span>
      </div>

      <div className="slim-scroll flex flex-1 justify-center overflow-auto p-4">
        <div
          className="h-full w-full overflow-hidden rounded-xl border border-[#2a2d36] bg-white"
          style={{ maxWidth: VIEWPORTS[viewport].width }}
        >
          <iframe
            key={refreshKey}
            ref={iframeRef}
            title="Live preview"
            srcDoc={html}
            sandbox="allow-scripts"
            className="h-full w-full border-0 bg-white"
          />
        </div>
      </div>

      {unresponsive && buildOk && (
        <div className="flex flex-wrap items-center gap-2 border-t border-amber-900/60 bg-[#1d1503] px-4 py-2">
          <span className="text-xs font-semibold text-amber-300">
            ⚠ La vista previa no responde — puede contener un bucle infinito o un script
            muy pesado. Recargarla detiene el código atascado.
          </span>
          <button
            onClick={reloadPreview}
            className="ml-auto rounded-lg border border-amber-900 bg-amber-950 px-2 py-1 text-[11px] font-bold text-amber-200 hover:bg-amber-900"
          >
            ↻ Recargar vista previa
          </button>
          <button
            onClick={() => {
              suppressedRef.current = true;
              clearWatchdog();
              setUnresponsive(false);
            }}
            className="rounded-lg border border-amber-900 px-2 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-950"
            title="Ocultar este aviso hasta la próxima vista previa"
          >
            Ignorar
          </button>
        </div>
      )}

      {errors.length > 0 && (
        <div className="border-t border-red-900/60 bg-[#1d1013]">
          <button
            onClick={() => setDiagOpen((o) => !o)}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-semibold text-red-300 hover:text-red-200"
          >
            <span>{diagOpen ? '▾' : '▸'}</span>
            <span>
              ⚠ {errors.length} {errors.length === 1 ? 'error' : 'errores'} de
              JavaScript en la vista previa — la página puede verse rota
            </span>
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                setErrors([]);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  setErrors([]);
                }
              }}
              className="ml-auto rounded-lg border border-red-900 px-2 py-0.5 text-[11px] font-bold text-red-300 hover:bg-red-950"
              title="Limpiar la lista de errores"
            >
              Limpiar
            </span>
          </button>
          {diagOpen && (
            <ul className="slim-scroll max-h-40 space-y-1 overflow-auto px-4 pb-3">
              {errors.map((err, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-red-900/40 bg-[#141014] px-3 py-1.5 font-mono text-[11px] text-red-200"
                >
                  <span className="mr-2 rounded bg-red-950 px-1.5 py-0.5 text-[10px] font-bold text-red-300">
                    {err.kind === 'promise' ? 'PROMESA' : 'ERROR'}
                  </span>
                  {err.message}
                  {err.lineno > 0 && (
                    <span className="text-red-400"> · línea {err.lineno}{err.colno > 0 ? `, col ${err.colno}` : ''}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <p className="border-t border-[#2a2d36] px-4 py-2 text-[11px] text-[#5b606c]">
        Vista previa aislada (scripts permitidos, mismo origen bloqueado) — el código generado
        está separado de esta app. «Pestaña nueva» abre el mismo código sin ese aislamiento.
      </p>
    </div>
  );
}
