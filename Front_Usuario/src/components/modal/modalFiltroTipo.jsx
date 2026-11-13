import { X, Check } from "lucide-react"

export default function ModalFiltroTipo({ aberto, onFechar, opcoes, selecionado, onSelecionar }) {
  if (!aberto) return null

  function escolher(id) {
    onSelecionar(id)
    onFechar()
  }

  return (
    <div
      onClick={onFechar}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[380px] rounded-3xl bg-white p-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-[#191C1E]">Filtrar por tipo</h3>
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F3F3] cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {opcoes.map((o) => {
            const ativo = selecionado === o.id
            return (
              <button
                key={o.id}
                onClick={() => escolher(o.id)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-[14px] font-semibold cursor-pointer ${
                  ativo ? "bg-[#724BC2] text-white" : "bg-[#F3F3F3] text-[#191C1E]"
                }`}
              >
                {o.label}
                {ativo && <Check size={16} />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}