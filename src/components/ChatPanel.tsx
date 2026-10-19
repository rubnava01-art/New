import { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '../types';

interface ChatPanelProps {
  projectName: string;
  messages: ChatMessage[];
  working: boolean;
  onSend: (text: string) => void;
}

const SUGGESTIONS = [
  'Crea un sitio profesional para una agencia de marketing digital con servicios, precios, testimonios y formulario de contacto',
  'Haz un portafolio para una fotógrafa llamada Elena Ruiz',
  'Crea el sitio de un restaurante "Casa Verde" con menú y reservaciones',
  'Haz una landing page para una startup SaaS llamada Flowbase',
];

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-[#7c5cff] text-white'
            : message.kind === 'error'
              ? 'border border-red-900/60 bg-red-950/40 text-red-200'
              : 'border border-[#2a2d36] bg-[#1d1f26] text-[#e8eaf0]'
        }`}
      >
        {!isUser && message.kind !== 'info' && (
          <span className="mb-1 inline-block rounded-md bg-[#2a2d36] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#9a82ff]">
            {message.kind === 'plan' ? 'Plan' : message.kind === 'summary' ? 'Resumen' : 'Demo'}
          </span>
        )}
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

export default function ChatPanel({ projectName, messages, working, onSend }: ChatPanelProps) {
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  // Show starter suggestions until the user sends their first message
  // (a fresh project always seeds a welcome message, so messages.length is never 0).
  const showSuggestions = !working && !messages.some((m) => m.role === 'user');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, working]);

  const submit = () => {
    const text = draft.trim();
    if (!text || working) return;
    setDraft('');
    onSend(text);
  };

  return (
    <div className="flex h-full flex-col bg-[#101114]">
      <div className="flex items-center justify-between border-b border-[#2a2d36] px-4 py-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-white">{projectName}</h2>
          <p className="text-xs text-[#5b606c]">Asistente IA</p>
        </div>
        <span className="shrink-0 rounded-lg border border-[#7c5cff]/50 bg-[#7c5cff]/15 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#9a82ff]">
          Modo demo
        </span>
      </div>

      <div className="slim-scroll flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {showSuggestions && (
          <div className="py-6">
            <p className="mb-4 text-center text-sm text-[#a7abb6]">
              Describe el sitio web que quieres. El motor demo lo construye con plantillas
              reales — sin API key.
            </p>
            <div className="space-y-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => onSend(s)}
                  disabled={working}
                  className="block w-full rounded-xl border border-[#2a2d36] bg-[#17181d] px-4 py-3 text-left text-sm text-[#d5d8e0] hover:border-[#7c5cff] disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {working && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl border border-[#2a2d36] bg-[#1d1f26] px-4 py-3 text-sm text-[#a7abb6]">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#2a2d36] border-t-[#7c5cff]" />
              El motor demo está trabajando…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-[#2a2d36] p-4">
        <div className="flex gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={3}
            enterKeyHint="send"
            placeholder="Describe tu sitio o pide un cambio… (Enter para enviar)"
            className="slim-scroll flex-1 resize-none rounded-xl border border-[#2a2d36] bg-[#17181d] px-4 py-3 text-base text-white placeholder-[#5b606c] focus:border-[#7c5cff] focus:outline-none"
          />
          <button
            onClick={submit}
            disabled={working || !draft.trim()}
            className="shrink-0 self-end rounded-xl bg-[#7c5cff] px-5 py-3 text-sm font-bold text-white hover:bg-[#9a82ff] disabled:opacity-40"
          >
            Enviar
          </button>
        </div>
        <p className="mt-2 text-[11px] text-[#5b606c]">
          Motor demo: generación con plantillas y operaciones de archivo validadas.
        </p>
      </div>
    </div>
  );
}
