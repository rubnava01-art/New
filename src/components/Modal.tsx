interface ModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Modal({
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancelar',
  danger = false,
  onConfirm,
  onCancel,
}: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[#2a2d36] bg-[#17181d] p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
        <p className="mb-6 text-sm text-[#a7abb6]">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="rounded-xl border border-[#2a2d36] bg-[#1d1f26] px-4 py-2 text-sm font-semibold text-white hover:bg-[#26282f]"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`rounded-xl px-4 py-2 text-sm font-bold text-white ${
              danger
                ? 'bg-red-600 hover:bg-red-500'
                : 'bg-[#7c5cff] hover:bg-[#9a82ff]'
            }`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
