import { useState } from "react"
import { criarItem } from "../../services/categoriaService.js"

export default function ModalNovoItem({ categoriaId, aoFechar, aoSalvar }) {
  const [nome, setNome] = useState("")
  const [pontos, setPontos] = useState("")
  const [descricao, setDescricao] = useState("")
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")

  async function salvar() {
    const pontosNum = Number(pontos)

    if (!nome.trim()) return setErro("Informe o nome do item.")
    if (!Number.isInteger(pontosNum) || pontosNum <= 0)
      return setErro("A pontuação base deve ser um número inteiro maior que zero.")

    try {
      setSalvando(true)
      setErro("")
      await criarItem({
        nome: nome.trim(),
        descricao: descricao.trim() || null,
        pontos_base: pontosNum,
        status: "ativo",
        id_categoria: Number(categoriaId),
      })
      await aoSalvar() // recarrega a categoria e fecha o modal
    } catch (e) {
      console.error(e)
      setErro(e.message || "Não foi possível salvar o item.")
    } finally {
      setSalvando(false)
    }
  }

  const campo =
    "border border-[#E2E8F0] rounded-[8px] bg-[#F8FAFC] text-[13px] px-3 py-2 w-full"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={aoFechar}
    >
      <div
        className="bg-white rounded-[12px] w-[520px] max-w-[95vw] p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h2 className="text-[16px] font-bold">Adicionar Novo Item</h2>
          <p className="text-[13px] text-[#6B7280] mt-1">
            Cadastre um novo móvel para pontuação
          </p>
        </div>

        <div className="flex flex-row gap-4">
          <div className="w-[80px] h-[80px] rounded-[8px] bg-[#D9D9D9] shrink-0" />
          <div className="flex-1">
            <label className="text-[13px] font-bold">Nome do Item</label>
            <input
              className={`${campo} mt-1`}
              placeholder="Ex: Cômoda 5 Gavetas"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <label className="text-[13px] font-bold">Pontuação Base</label>
            <input
              className={`${campo} mt-1`}
              type="number"
              min="1"
              placeholder="350"
              value={pontos}
              onChange={(e) => setPontos(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="text-[13px] font-bold">Status Inicial</label>
            <input className={`${campo} mt-1 text-[#9A9A9A]`} value="Ativo" disabled />
          </div>
        </div>

        <div>
          <label className="text-[13px] font-bold">Descrição (Opcional)</label>
          <textarea
            className={`${campo} mt-1 h-[90px] resize-none`}
            placeholder="Ex: Aceitamos apenas com todas as gavetas"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        {erro && <p className="text-red-500 text-[12px]">{erro}</p>}

        <div className="flex flex-row justify-end gap-3">
          <button
            onClick={aoFechar}
            disabled={salvando}
            className="bg-[#E43E42] text-white rounded-[8px] text-[12px] w-[100px] h-[32px] cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={salvando}
            className="bg-[#65BA69] text-white rounded-[8px] text-[12px] w-[100px] h-[32px] cursor-pointer disabled:opacity-60"
          >
            {salvando ? "Salvando..." : "Salvar Item"}
          </button>
        </div>
      </div>
    </div>
  )
}