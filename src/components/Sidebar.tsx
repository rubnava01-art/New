import { useState } from 'react';
import type { ProjectMeta } from '../types';

interface SidebarProps {
  projects: ProjectMeta[];
  activeId: string | null;
  onNew: () => void;
  onSelect: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es', { month: 'short', day: 'numeric' });
}

export default function Sidebar({
  projects,
  activeId,
  onNew,
  onSelect,
  onRename,
  onDuplicate,
  onDelete,
}: SidebarProps) {
  const [query, setQuery] = useState('');
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  const [helpOpen, setHelpOpen] = useState(false);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );

  const commitRename = (id: string) => {
    const name = renameDraft.trim();
    if (name) onRename(id, name.slice(0, 80));
    setRenamingId(null);
    setMenuFor(null);
  };

  return (
    <aside className="flex h-full w-full flex-col bg-[#14151a]">
      <div className="flex items-center gap-2 px-4 pt-4">
        <span className="inline-block h-7 w-7 rounded-lg bg-gradient-to-br from-[#7c5cff] to-[#9a82ff]" />
        <div className="leading-tight">
          <p className="font-extrabold tracking-tight text-white">NEST Forge AI</p>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#7c5cff]">
            Modo demo
          </p>
        </div>
      </div>

      <div className="px-4 pt-4">
        <button
          onClick={onNew}
          className="w-full rounded-xl bg-[#7c5cff] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#9a82ff]"
        >
          + Nuevo proyecto
        </button>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar proyectos…"
          className="mt-3 w-full rounded-xl border border-[#2a2d36] bg-[#1d1f26] px-3 py-2 text-base text-white placeholder-[#5b606c] focus:border-[#7c5cff] focus:outline-none"
        />
      </div>

      <div className="slim-scroll mt-3 flex-1 overflow-y-auto px-2 pb-2">
        {filtered.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-[#5b606c]">
            {projects.length === 0
              ? 'Aún no hay proyectos. Crea el primero arriba.'
              : 'Ningún proyecto coincide con tu búsqueda.'}
          </p>
        )}
        {filtered.map((p) => (
          <div
            key={p.id}
            className={`group relative mb-1 rounded-xl px-3 py-2.5 ${
              p.id === activeId ? 'bg-[#1d1f26]' : 'hover:bg-[#1a1c22]'
            }`}
          >
            {renamingId === p.id ? (
              <input
                autoFocus
                value={renameDraft}
                onChange={(e) => setRenameDraft(e.target.value)}
                onBlur={() => commitRename(p.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitRename(p.id);
                  if (e.key === 'Escape') setRenamingId(null);
                }}
                className="w-full rounded-lg border border-[#7c5cff] bg-[#101114] px-2 py-1 text-base text-white focus:outline-none"
              />
            ) : (
              <button
                onClick={() => onSelect(p.id)}
                className="block w-full pr-8 text-left"
              >
                <span className="block truncate text-sm font-semibold text-white">
                  {p.name}
                </span>
                <span className="block text-xs text-[#5b606c]">
                  {p.fileCount} archivos · editado {formatDate(p.updatedAt)}
                </span>
              </button>
            )}
            {renamingId !== p.id && (
              <button
                aria-label="Acciones del proyecto"
                onClick={() => setMenuFor(menuFor === p.id ? null : p.id)}
                className="absolute right-2 top-2.5 rounded-lg px-2 py-0.5 text-[#5b606c] hover:bg-[#2a2d36] hover:text-white"
              >
                ⋯
              </button>
            )}
            {menuFor === p.id && renamingId !== p.id && (
              <div className="absolute right-2 top-10 z-20 w-44 overflow-hidden rounded-xl border border-[#2a2d36] bg-[#1d1f26] shadow-xl">
                {[
                  {
                    label: 'Renombrar',
                    fn: () => {
                      setRenameDraft(p.name);
                      setRenamingId(p.id);
                      setMenuFor(null);
                    },
                  },
                  { label: 'Duplicar', fn: () => { onDuplicate(p.id); setMenuFor(null); } },
                  { label: 'Eliminar', fn: () => { onDelete(p.id); setMenuFor(null); }, danger: true },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.fn}
                    className={`block w-full px-4 py-2 text-left text-sm hover:bg-[#2a2d36] ${
                      'danger' in item && item.danger ? 'text-red-400' : 'text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-[#2a2d36] p-4">
        <button
          onClick={() => setHelpOpen(true)}
          className="w-full rounded-xl border border-[#2a2d36] bg-[#1d1f26] px-4 py-2 text-sm font-semibold text-[#a7abb6] hover:text-white"
        >
          Ayuda e info del demo
        </button>
      </div>

      {helpOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setHelpOpen(false)}
        >
          <div
            className="slim-scroll max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#2a2d36] bg-[#17181d] p-6"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h3 className="mb-3 text-lg font-bold text-white">NEST Forge AI — modo demo</h3>
            <div className="space-y-3 text-sm text-[#a7abb6]">
              <p>
                Describe un sitio web en el chat (p. ej. “Crea un sitio de agencia de
                marketing para Acme”) y el motor demo lo construye con plantillas
                integradas. Pide ediciones como “cambia el título principal a …” o
                “agrega una sección de precios”.
              </p>
              <p>
                Cada cambio es una operación de archivo validada, queda registrada en el
                historial de versiones (pestaña Versiones) y se puede ver en vivo.
                Exporta cualquier proyecto como ZIP.
              </p>
              <p>
                <strong className="text-white">Límites de este MVP:</strong> la generación
                está basada en plantillas, no es un modelo de IA real. La integración
                con un modelo real (Fase 3) necesita un servidor seguro para las API
                keys y no está incluida. Tus proyectos se guardan solo en este
                navegador.
              </p>
            </div>
            <button
              onClick={() => setHelpOpen(false)}
              className="mt-5 w-full rounded-xl bg-[#7c5cff] px-4 py-2 text-sm font-bold text-white hover:bg-[#9a82ff]"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
