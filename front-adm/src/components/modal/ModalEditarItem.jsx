import { useState, useEffect } from "react"
import { buscarItem, atualizarItem } from "../../services/categoriaService.js"

const campo =
  "border border-[#E2E8F0] rounded-[8px] bg-[#F8FAFC] text-[14px] text-[#334155] px-3 w-full h-[36px]"

export default function ModalEditarItem({ itemId, categoriaId, aoFechar, aoSalvar }) {
  const [nome, setNome] = useState("")
  const [pontos, setPontos] = useState("")
  const [status, setStatus] = useState("ativo")
  const [descricao, setDescricao] = useState("")

  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true)
        setErro("")
        const item = await buscarItem(itemId)
        if (!item) {
          setErro("Item não encontrado.")
          return
        }
        setNome(item.nome ?? "")
        setPontos(String(item.pontos_base ?? ""))
        setStatus((item.status ?? "ativo").toLowerCase())
        setDescricao(item.descricao ?? "")
      } catch (e) {
        console.error(e)
        setErro("Não foi possível carregar o item.")
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [itemId])

  async function salvar() {
    if (!nome.trim() || pontos === "") {
      setErro("Preencha o nome e a pontuação base.")
      return
    }

    try {
      setSalvando(true)
      setErro("")
      await atualizarItem(itemId, {
        nome: nome.trim(),
        descricao: descricao.trim(),
        pontos_base: Number(pontos),
        status,
        id_categoria: categoriaId,
      })
      await aoSalvar?.()
    } catch (e) {
      console.error(e)
      setErro(e.message || "Erro ao salvar o item.")
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={aoFechar}
    >
      <div
        className="bg-white rounded-[10px] w-[560px] max-w-[95%] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[18px] font-bold text-[#202735]">Editar Item</h2>
        <p className="text-[14px] font-semibold text-[#202735] mt-4 mb-4">
          Atualize as informações deste item
        </p>

        {carregando && <p>Carregando...</p>}
        {erro && <p className="text-red-500 mb-3">{erro}</p>}

        {!carregando && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <div className="w-[80px] h-[80px] rounded-[8px] bg-[#D9D9D9] shrink-0" />
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[14px] font-semibold text-[#202735]">Nome do Item</label>
                <input
                  className={campo}
                  type="text"
                  placeholder="Ex: Cômoda 5 Gavetas"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-row gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[14px] font-semibold text-[#202735]">Pontuação Base</label>
                <input
                  className={campo}
                  type="number"
                  min="0"
                  placeholder="350"
                  value={pontos}
                  onChange={(e) => setPontos(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[14px] font-semibold text-[#202735]">Status</label>
                <select
                  className={campo}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="em revisão">Em Revisão</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-semibold text-[#202735]">Descrição (Opcional)</label>
              <textarea
                className="border border-[#E2E8F0] rounded-[8px] bg-[#F8FAFC] text-[14px] text-[#334155] px-3 py-2 w-full min-h-[100px] resize-none"
                placeholder="Ex: Aceitamos apenas com todas as gavetas"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={aoFechar}
            className="bg-[#E43E42] text-white rounded-[8px] text-[14px] w-[100px] h-[36px] cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={salvando || carregando}
            className="bg-[#65BA69] text-white rounded-[8px] text-[14px] w-[100px] h-[36px] cursor-pointer disabled:opacity-60"
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  )
}