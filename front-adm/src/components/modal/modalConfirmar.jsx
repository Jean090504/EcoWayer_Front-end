import { useEffect, useId } from "react"

const btnBase =
  "min-w-[120px] rounded px-6 py-2.5 text-base cursor-pointer " +
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-black/25"

const BUTTON_STYLES = {
  danger: `${btnBase} bg-red-500 text-white hover:brightness-95`,
  success: `${btnBase} bg-green-500 text-white hover:brightness-95`,
  neutral: `${btnBase} border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50`,
}

export default function ModalConfirmar({
  open,
  title,
  children,
  cancelLabel = "Cancelar",
  confirmLabel = "Confirmar",
  cancelVariant = "neutral",
  confirmVariant = "danger",
  onCancel,
  onConfirm,
}) {
  const uid = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key !== "Escape") return
      e.stopPropagation()
      onCancel?.()
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-[#1e2950]/35 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onCancel?.()}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        className="flex w-full max-w-[500px] flex-col gap-6 rounded-lg bg-white p-6 text-neutral-900"
      >
        <h2 id={`${uid}-title`} className="text-xl font-bold">
          {title}
        </h2>

        <div className="flex flex-col gap-4 text-lg">{children}</div>

        <div className="mt-2 flex justify-end gap-3 sm:gap-6">
          <button type="button" onClick={onCancel} className={BUTTON_STYLES[cancelVariant]}>
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className={BUTTON_STYLES[confirmVariant]}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}