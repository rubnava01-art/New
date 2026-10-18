import { useState } from 'react';
import type { ProjectVersion } from '../types';

interface VersionsPanelProps {
  versions: ProjectVersion[];
  onRestore: (versionId: string) => void;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function VersionsPanel({ versions, onRestore }: VersionsPanelProps) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const sorted = [...versions].sort((a, b) => b.versionNumber - a.versionNumber);

  return (
    <div className="flex h-full flex-col bg-[#101114]">
      <div className="border-b border-[#2a2d36] px-4 py-3">
        <h2 className="text-sm font-bold text-white">Version history</h2>
        <p className="text-xs text-[#5b606c]">
          A snapshot is saved before every AI change. Restoring creates a new version — nothing is lost.
        </p>
      </div>
      <div className="slim-scroll flex-1 overflow-y-auto p-4">
        {sorted.length === 0 && (
          <p className="py-6 text-center text-sm text-[#5b606c]">
            No versions yet. Generate or modify the project to create the first snapshot.
          </p>
        )}
        <ol className="space-y-3">
          {sorted.map((v) => (
            <li
              key={v.id}
              className="rounded-xl border border-[#2a2d36] bg-[#17181d] p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-lg bg-[#2a2d36] px-2 py-0.5 text-xs font-bold text-[#9a82ff]">
                  v{v.versionNumber}
                </span>
                <span className="text-xs text-[#5b606c]">{formatDateTime(v.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm text-[#d5d8e0]">{v.changeSummary}</p>
              <p className="mt-1 text-xs text-[#5b606c]">{v.files.length} files</p>
              {confirmId === v.id ? (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => { onRestore(v.id); setConfirmId(null); }}
                    className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-black hover:bg-amber-400"
                  >
                    Confirm restore v{v.versionNumber}
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="rounded-lg border border-[#2a2d36] px-3 py-1.5 text-xs text-[#a7abb6]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmId(v.id)}
                  className="mt-3 rounded-lg border border-[#2a2d36] bg-[#1d1f26] px-3 py-1.5 text-xs font-semibold text-[#a7abb6] hover:text-white"
                >
                  Restore this version
                </button>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
