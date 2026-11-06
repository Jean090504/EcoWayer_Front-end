import { useState } from "react"
import { excluirCategoria } from "../../services/categoriaService.js"

export default function ModalExcluirCategoria({ categoria, itens = [], aoFechar, aoExcluir }) {
  const [excluindo, setExcluindo] = useState(false)
  const [erro, setErro] = useState("")

  async function confirmar() {
    try {
      setExcluindo(true)
      setErro("")
      await excluirCategoria(categoria.id)
      await aoExcluir?.()
    } catch (e) {
      console.error(e)
      setErro(e.message || "Não foi possível excluir a categoria.")
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={excluindo ? undefined : aoFechar}
    >
      <div
        className="bg-white rounded-[10px] w-[420px] max-w-[95%] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[18px] font-bold text-[#202735]">Excluir Categoria</h2>

        <p className="text-[14px] text-[#202735] mt-5">
          Tem certeza que deseja excluir a categoria "{categoria.nome}"?
        </p>

        {itens.length > 0 && (
          <p className="text-[14px] text-[#E43E42] font-semibold mt-4">
            Os {itens.length} itens vinculados a ela também serão excluídos.
          </p>
        )}

        <p className="text-[14px] text-[#202735] mt-4">
          Essa ação não pode ser desfeita.
        </p>

        {erro && <p className="text-red-500 text-[13px] mt-3">{erro}</p>}

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={aoFechar}
            disabled={excluindo}
            className="border border-[#E2E8F0] rounded-[8px] text-[14px] text-[#202735] w-[100px] h-[36px] cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={confirmar}
            disabled={excluindo}
            className="bg-[#E43E42] text-white rounded-[8px] text-[14px] w-[100px] h-[36px] cursor-pointer disabled:opacity-60"
          >
            {excluindo ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  )
}