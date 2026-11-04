import { useState, useEffect } from "react"
import { buscarItem } from "../../services/categoriaService.js"

const ROTULOS = { ativo: "Ativo", inativo: "Inativo", "em revisão": "Em Revisão" }

const campo =
  "border border-[#E2E8F0] rounded-[8px] bg-[#F8FAFC] text-[14px] text-[#334155] px-3 w-full"

export default function ModalDetalhesItem({ itemId, aoFechar }) {
  const [item, setItem] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true)
        setErro("")
        const dados = await buscarItem(itemId)
        if (!dados) setErro("Item não encontrado.")
        setItem(dados)
      } catch (e) {
        console.error(e)
        setErro("Não foi possível carregar o item.")
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [itemId])

  const chave = (item?.status ?? "").toLowerCase()

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={aoFechar}
    >
      <div
        className="bg-white rounded-[10px] w-[560px] max-w-[95%] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[18px] font-bold text-[#202735]">Detalhes do Item</h2>
        <p className="text-[14px] font-semibold text-[#202735] mt-4 mb-4">
          Informações cadastradas para este item
        </p>

        {carregando && <p>Carregando...</p>}
        {erro && <p className="text-red-500">{erro}</p>}

        {item && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <div className="w-[80px] h-[80px] rounded-[8px] bg-[#D9D9D9] shrink-0" />
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[14px] font-semibold text-[#202735]">Nome do Item</label>
                <div className={`${campo} h-[36px] flex items-center`}>{item.nome}</div>
              </div>
            </div>

            <div className="flex flex-row gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[14px] font-semibold text-[#202735]">Pontuação Base</label>
                <div className={`${campo} h-[36px] flex items-center`}>{item.pontos_base}</div>
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[14px] font-semibold text-[#202735]">Status</label>
                <div className={`${campo} h-[36px] flex items-center`}>
                  {ROTULOS[chave] ?? item.status}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-semibold text-[#202735]">Descrição</label>
              <div className={`${campo} min-h-[100px] py-2 whitespace-pre-wrap`}>
                {item.descricao}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={aoFechar}
            className="border border-[#E2E8F0] rounded-[8px] text-[14px] w-[100px] h-[36px] cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}