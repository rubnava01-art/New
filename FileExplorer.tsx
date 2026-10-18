import { useState } from 'react';
import type { ProjectFile } from '../types';

interface FileExplorerProps {
  files: ProjectFile[];
  activePath: string | null;
  dirtyPaths: string[];
  onSelect: (path: string) => void;
  onCreate: (name: string) => string | null; // returns error or null
  onDelete: (path: string) => void;
}

function iconFor(path: string): string {
  if (path.endsWith('.html')) return '◧';
  if (path.endsWith('.css')) return '🎨';
  if (path.endsWith('.js')) return '◈';
  return '📄';
}

export default function FileExplorer({
  files,
  activePath,
  dirtyPaths,
  onSelect,
  onCreate,
  onDelete,
}: FileExplorerProps) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const sorted = [...files].sort((a, b) => a.path.localeCompare(b.path));

  const commit = () => {
    const err = onCreate(name.trim());
    if (err) {
      setError(err);
    } else {
      setAdding(false);
      setName('');
      setError(null);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#101114]">
      <div className="flex items-center justify-between border-b border-[#2a2d36] px-4 py-3">
        <h2 className="text-sm font-bold text-white">Files</h2>
        <button
          onClick={() => { setAdding(true); setError(null); }}
          className="rounded-lg border border-[#2a2d36] bg-[#1d1f26] px-2.5 py-1 text-xs font-semibold text-[#a7abb6] hover:text-white"
        >
          + New file
        </button>
      </div>

      {adding && (
        <div className="border-b border-[#2a2d36] p-3">
          <div className="flex gap-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commit();
                if (e.key === 'Escape') { setAdding(false); setName(''); setError(null); }
              }}
              placeholder="name.html"
              className="code-font flex-1 rounded-lg border border-[#7c5cff] bg-[#17181d] px-2 py-1.5 text-sm text-white focus:outline-none"
            />
            <button
              onClick={commit}
              className="rounded-lg bg-[#7c5cff] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#9a82ff]"
            >
              Add
            </button>
          </div>
          {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
          <p className="mt-1 text-[11px] text-[#5b606c]">
            Plain file names only (html, css, js, json, md, txt, svg).
          </p>
        </div>
      )}

      <div className="slim-scroll flex-1 overflow-y-auto p-2">
        {sorted.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-[#5b606c]">
            No files yet — generate a site from the chat to get started.
          </p>
        )}
        {sorted.map((f) => (
          <div
            key={f.path}
            className={`group flex items-center rounded-lg px-2 py-1.5 ${
              f.path === activePath ? 'bg-[#1d1f26]' : 'hover:bg-[#1a1c22]'
            }`}
          >
            <button
              onClick={() => onSelect(f.path)}
              className="flex min-w-0 flex-1 items-center gap-2 text-left"
            >
              <span className="text-[#5b606c]">{iconFor(f.path)}</span>
              <span className="code-font truncate text-sm text-[#d5d8e0]">{f.path}</span>
              {dirtyPaths.includes(f.path) && (
                <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" title="Unsaved changes" />
              )}
            </button>
            {confirmDelete === f.path ? (
              <span className="flex shrink-0 gap-1">
                <button
                  onClick={() => { onDelete(f.path); setConfirmDelete(null); }}
                  className="rounded-md bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="rounded-md border border-[#2a2d36] px-2 py-0.5 text-[11px] text-[#a7abb6]"
                >
                  No
                </button>
              </span>
            ) : (
              <button
                aria-label={`Delete ${f.path}`}
                onClick={() => setConfirmDelete(f.path)}
                className="shrink-0 rounded-md px-1.5 text-[#5b606c] opacity-0 hover:text-red-400 group-hover:opacity-100"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
