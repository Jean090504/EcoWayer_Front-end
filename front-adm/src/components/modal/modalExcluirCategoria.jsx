import { useEffect, useId, useState } from "react"

export default function ModalExcluirCategoria({
  open,
  nomeCategoria,
  totalItens = 0,
  onClose,
  onConfirm,
}) {
  const uid = useId()
  const [texto, setTexto] = useState("")

  useEffect(() => {
    if (open) setTexto("")
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && onClose?.()
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  const confirmado =
    texto.trim().toLowerCase() === String(nomeCategoria).trim().toLowerCase()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (confirmado) onConfirm?.()
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#1e2950]/35 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <form
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        onSubmit={handleSubmit}
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-[700px] flex-col gap-4 overflow-y-auto rounded-lg bg-white p-6 text-neutral-900"
      >
        <h2 id={`${uid}-title`} className="text-center text-2xl font-bold">
          Excluir Categoria
        </h2>

        <p className="-mt-2 px-0.5 text-lg">Ação irreversível</p>

        <p className="mt-3 text-lg">
          Tem certeza que deseja excluir a categoria "{nomeCategoria}"?
        </p>

        <p className="text-lg leading-snug">
          <strong>Atenção:</strong> Esta categoria possui {totalItens} itens
          cadastrados. Se você continuar, TODOS os itens serão apagados
          permanentemente.
        </p>

        <label htmlFor={`${uid}-confirm`} className="mt-3 text-lg">
          Para confirmar, digite o nome da categoria abaixo:
        </label>
        <input
          id={`${uid}-confirm`}
          type="text"
          autoFocus
          autoComplete="off"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          className="h-[50px] w-full rounded border border-neutral-200 bg-neutral-50 px-3.5 text-base outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/25"
        />

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 min-w-[120px] cursor-pointer rounded border border-neutral-200 bg-white px-6 text-base hover:bg-neutral-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!confirmado}
            className="h-10 min-w-[120px] cursor-pointer rounded bg-red-500 px-6 text-base text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Excluir Tudo
          </button>
        </div>
      </form>
    </div>
  )
}