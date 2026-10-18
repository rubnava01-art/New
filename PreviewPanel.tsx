import { useState } from 'react';

interface PreviewPanelProps {
  html: string;
  buildOk: boolean;
  buildNote: string;
  fileCount: number;
}

type Viewport = 'desktop' | 'tablet' | 'mobile';

const VIEWPORTS: Record<Viewport, { label: string; width: string }> = {
  desktop: { label: 'Desktop', width: '100%' },
  tablet: { label: 'Tablet', width: '768px' },
  mobile: { label: 'Mobile', width: '390px' },
};

export default function PreviewPanel({ html, buildOk, buildNote, fileCount }: PreviewPanelProps) {
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [refreshKey, setRefreshKey] = useState(0);

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
          ↻ Refresh
        </button>
        <span
          className={`ml-auto rounded-lg px-2 py-1 text-[11px] font-bold ${
            buildOk ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
          }`}
          title={buildNote}
        >
          {buildOk ? `✓ Preview ready · ${fileCount} files` : 'Preview unavailable'}
        </span>
      </div>

      <div className="slim-scroll flex flex-1 justify-center overflow-auto p-4">
        <div
          className="h-full w-full overflow-hidden rounded-xl border border-[#2a2d36] bg-white"
          style={{ maxWidth: VIEWPORTS[viewport].width }}
        >
          <iframe
            key={refreshKey}
            title="Live preview"
            srcDoc={html}
            sandbox="allow-scripts"
            className="h-full w-full border-0 bg-white"
          />
        </div>
      </div>

      <p className="border-t border-[#2a2d36] px-4 py-2 text-[11px] text-[#5b606c]">
        Sandboxed preview (scripts allowed, same-origin blocked) — generated code is isolated
        from this app. New-tab preview arrives in Phase 4.
      </p>
    </div>
  );
}
