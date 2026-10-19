interface CodeEditorProps {
  path: string;
  value: string;
  dirty: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
}

export default function CodeEditor({ path, value, dirty, onChange, onSave }: CodeEditorProps) {
  return (
    <div className="flex h-full flex-col bg-[#0c0d10]">
      <div className="flex items-center justify-between border-b border-[#2a2d36] px-4 py-2.5">
        <span className="code-font flex items-center gap-2 truncate text-sm text-[#d5d8e0]">
          {path}
          {dirty && <span className="h-2 w-2 rounded-full bg-amber-400" title="Unsaved changes" />}
        </span>
        <button
          onClick={onSave}
          disabled={!dirty}
          className="rounded-lg bg-[#7c5cff] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#9a82ff] disabled:opacity-40"
        >
          Save (Ctrl+S)
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            onSave();
          }
          if (e.key === 'Tab') {
            e.preventDefault();
            const el = e.currentTarget;
            const start = el.selectionStart;
            const end = el.selectionEnd;
            const next = value.slice(0, start) + '  ' + value.slice(end);
            onChange(next);
            requestAnimationFrame(() => {
              el.selectionStart = el.selectionEnd = start + 2;
            });
          }
        }}
        spellCheck={false}
        className="code-font slim-scroll flex-1 resize-none bg-[#0c0d10] p-4 text-[13px] leading-relaxed text-[#e8eaf0] focus:outline-none"
      />
    </div>
  );
}
