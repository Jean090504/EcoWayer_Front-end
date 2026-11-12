import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { atualizarItem, criarItem } from "../../services/categoriaService.js"
import { uploadImagem } from "../../services/claudnaryService.js"

export default function ModalNovoItem({ categoriaId, item, aoFechar, aoSalvar }) {
  const editando = Boolean(item)
  const [nome, setNome] = useState(item?.nome || "")
  const [pontos, setPontos] = useState(item?.pontos_base?.toString() || "")
  const [descricao, setDescricao] = useState(item?.descricao || "")
  const [status, setStatus] = useState(item?.status || "ativo")
  const [statusAberto, setStatusAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")
  const [arquivo, setArquivo] = useState(null)

  useEffect(() => {
    setNome(item?.nome || "")
    setPontos(item?.pontos_base?.toString() || "")
    setDescricao(item?.descricao || "")
    setStatus(item?.status || "ativo")
  }, [item])

  function fechar() {
    setNome(""); setPontos(""); setDescricao(""); setStatus("ativo"); setStatusAberto(false); setArquivo(null); setErro(""); aoFechar()
  }

  async function salvar() {
    const pontosNum = Number(pontos)

    if (!nome.trim()) return setErro("Informe o nome do item.")
    if (!Number.isInteger(pontosNum) || pontosNum <= 0)
      return setErro("A pontuação base deve ser um número inteiro maior que zero.")

    try {
      setSalvando(true)
      setErro("")
      const img = arquivo ? await uploadImagem(arquivo) : null
      const dados = {
        nome: nome.trim(),
        descricao: descricao.trim() || null,
        pontos_base: pontosNum,
        status,
        img,
      }
      if (editando) await atualizarItem(item.id, dados)
      else await criarItem({ ...dados, id_categoria: Number(categoriaId) })
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
          <h2 className="text-[16px] font-bold">{editando ? "Editar item" : "Adicionar novo item"}</h2>
          <p className="text-[13px] text-[#6B7280] mt-1">
            {editando ? "Atualize os dados e a pontuação do item." : "Cadastre um novo item para pontuação."}
          </p>
        </div>

        <div className="flex flex-row gap-4">
          <label className="w-[80px] h-[80px] rounded-[8px] bg-[#D9D9D9] shrink-0 overflow-hidden flex items-center justify-center cursor-pointer">
            {arquivo ? <img src={URL.createObjectURL(arquivo)} alt="Prévia" className="h-full w-full object-contain" /> : <span className="text-center text-xs text-slate-500">Adicionar imagem</span>}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setArquivo(e.target.files?.[0] || null)} />
          </label>
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
            <label className="text-[13px] font-bold">Status</label>
            <div className="relative mt-1">
              <button
                type="button"
                onClick={() => setStatusAberto((aberto) => !aberto)}
                className={`flex h-10 w-full items-center justify-between rounded-xl border bg-slate-50 px-3 text-left text-sm text-slate-600 outline-none transition ${statusAberto ? "border-[#65BA69] ring-2 ring-green-100" : "border-slate-200 hover:border-slate-300"}`}
                aria-expanded={statusAberto}
              >
                <span className="leading-none">{status === "inativo" ? "Inativo" : "Ativo"}</span>
                <ChevronDown size={15} strokeWidth={1.8} className={`shrink-0 text-slate-400 transition-transform ${statusAberto ? "rotate-180" : ""}`} />
              </button>
              {statusAberto && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                  {[{ valor: "ativo", label: "Ativo" }, { valor: "inativo", label: "Inativo" }].map((opcao) => (
                    <button
                      key={opcao.valor}
                      type="button"
                      onClick={() => { setStatus(opcao.valor); setStatusAberto(false) }}
                      className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${opcao.valor === status ? "bg-green-50 font-bold text-[#65BA69]" : "text-slate-600 hover:bg-slate-50"}`}
                    >
                      {opcao.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
            onClick={fechar}
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
            {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Salvar item"}
          </button>
        </div>
      </div>
    </div>
  )
}
