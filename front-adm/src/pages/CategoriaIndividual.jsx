import { useState, useEffect } from "react"
import { Search } from "lucide-react"

import TabelaItens from "../components/tabela/tabelaItens.jsx"
import { buscarCategoria, excluirCategoria, excluirItem } from "../services/categoriaService.js"
import ModalNovoItem from "../components/modal/ModalNovoItem.jsx"
import ModalExcluirCategoria from "../components/modal/ModalExcluirCategoria.jsx"
import ModalExcluirItem from "../components/modal/ModalExcluirItem.jsx"

const URL_IMAGENS = "http://localhost:8080"

function urlImagem(img) {
  if (!img) return ""
  if (img.includes("storage.ecowayer.test")) return ""
  return img.startsWith("http") ? img : `${URL_IMAGENS}/${img}`
}

function FiltroStatus({ value, onChange }) {
  const [aberto, setAberto] = useState(false)
  const opcoes = [
    { valor: "", label: "Status (Todos)" },
    { valor: "ativo", label: "Ativo" },
    { valor: "inativo", label: "Inativo" },
    { valor: "em revisão", label: "Em Revisão" },
  ]
  const atual = opcoes.find((opcao) => opcao.valor === value) || opcoes[0]

  return (
    <div className="relative w-[150px]">
      <button type="button" onClick={() => setAberto((estado) => !estado)} className={`flex h-10 w-full items-center justify-between rounded-xl border bg-slate-50 px-3 text-left text-sm text-slate-600 outline-none transition ${aberto ? "border-[#65BA69] ring-2 ring-green-100" : "border-slate-200 hover:border-slate-300"}`}>
        <span>{atual.label}</span>
        <span className={`text-slate-400 transition-transform ${aberto ? "rotate-180" : ""}`}>⌄</span>
      </button>
      {aberto && <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
        {opcoes.map((opcao) => <button key={opcao.valor || "todos"} type="button" onClick={() => { onChange(opcao.valor); setAberto(false) }} className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${opcao.valor === value ? "bg-green-50 font-bold text-[#65BA69]" : "text-slate-600 hover:bg-slate-50"}`}>{opcao.label}</button>)}
      </div>}
    </div>
  )
}

export default function CategoriaIndividual({ categoriaId, aoVoltar }) {
  const [categoria, setCategoria] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  const [busca, setBusca] = useState("")
  const [status, setStatus] = useState("")

  const [modalAberto, setModalAberto] = useState(false)
  const [recarregar, setRecarregar] = useState(0)
  const [modalExcluir, setModalExcluir] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState("")
  const [itemVisualizado, setItemVisualizado] = useState(null)
  const [itemEditando, setItemEditando] = useState(null)
  const [itemParaExcluir, setItemParaExcluir] = useState(null)
  const [excluindoItem, setExcluindoItem] = useState(false)
  const [erroExclusaoItem, setErroExclusaoItem] = useState("")

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true)
        setErro("")
        const dados = await buscarCategoria(categoriaId)
        if (!dados) setErro("Categoria não encontrada.")
        setCategoria(dados)
      } catch (e) {
        console.error(e)
        setErro("Não foi possível carregar a categoria.")
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [categoriaId, recarregar])

  const itens = Array.isArray(categoria?.itens) ? categoria.itens : []

  const itensFiltrados = itens.filter((i) => {
    const bateNome = (i.nome ?? "").toLowerCase().includes(busca.toLowerCase())
    const bateStatus = !status || (i.status ?? "").toLowerCase() === status
    return bateNome && bateStatus
  })

  function redefinir() {
    setBusca("")
    setStatus("")
  }

  async function excluirAtual() {
    try { setExcluindo(true); await excluirCategoria(categoriaId); aoVoltar() }
    catch (e) { setErroExclusao(e.message || "Não foi possível excluir a categoria.") }
    finally { setExcluindo(false) }
  }

  function solicitarExclusaoItem(item) {
    setErroExclusaoItem("")
    setItemParaExcluir(item)
  }

  async function excluirItemAtual(confirmado) {
    if (!confirmado) return setErroExclusaoItem(`Digite exatamente "Deletar${itemParaExcluir?.nome || ""}" para confirmar.`)
    try {
      setExcluindoItem(true)
      await excluirItem(itemParaExcluir.id)
      setItemParaExcluir(null)
      setRecarregar((n) => n + 1)
    } catch (e) {
      setErroExclusaoItem(e.message || "Não foi possível excluir o item.")
    } finally { setExcluindoItem(false) }
  }

  return (
    <div className="min-h-full bg-[#f6f7fb] pb-10">
      <main className="mx-auto w-full max-w-[1600px] px-5 py-7 sm:px-8 lg:px-10">
      <button className="mb-5 text-sm font-semibold text-slate-500 transition hover:text-[#7350B9]" onClick={aoVoltar}>
        ← Voltar para categorias
      </button>

      <div className="min-h-[85vh]">
          {carregando && <p className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">Carregando categoria...</p>}
          {erro && <p className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-500">{erro}</p>}

          {categoria && (
            <>
              <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-5 shadow-[0_8px_30px_rgba(31,41,55,0.05)] sm:px-6">
                {categoria.img && (
                  <img
                    src={urlImagem(categoria.img)}
                    alt=""
                    className="h-14 w-14 rounded-xl object-contain"
                  />
                )}
                <div className="min-w-[180px] flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#65BA69]">Categoria</p><h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-800">{categoria.nome}</h1><p className="mt-1 text-sm text-slate-400">Itens e pontuação cadastrados nesta categoria.</p></div>

                <div className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-[#7350B9]">
                  {itens.length} itens
                </div>

                <div className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-[#65BA69]">
                  Categoria ativa
                </div>

                <button onClick={() => { setErroExclusao(""); setModalExcluir(true) }} className="ml-auto rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100">
                  Excluir
                </button>

                <button
                  onClick={() => setModalAberto(true)}
                  className="rounded-xl bg-[#65BA69] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#51a856]"
                >
                  Adicionar item
                </button>

              </div>

              <div className="mb-10 mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgba(31,41,55,0.05)]">
                <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-5">
                  <div className="relative min-w-[220px] flex-1">
                    <Search
                      size={12}
                      className="absolute left-4 top-1/2 -translate-y-1/2 shrink-0 text-[#334155]"
                    />
                    <input
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 pl-[35px] text-sm outline-none placeholder:text-slate-400 focus:border-[#65BA69] focus:ring-2 focus:ring-green-100"
                      type="text"
                      placeholder="Buscar Item"
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                    />
                  </div>

                  <FiltroStatus value={status} onChange={setStatus} />

                  <button
                    onClick={redefinir}
                    className="ml-auto flex h-10 items-center justify-center rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-500 transition hover:border-[#7350B9] hover:bg-violet-50"
                  >
                    Redefinir filtros
                  </button>
                </div>

              <TabelaItens
                itens={itensFiltrados}
                total={itens.length}
                imagemCategoria={urlImagem(categoria.img)}
                onView={setItemVisualizado}
                onEdit={setItemEditando}
                onDelete={solicitarExclusaoItem}
              />
              </div>
            </>
          )}
      </div>

      {modalAberto && (
        <ModalNovoItem
          categoriaId={categoriaId}
          aoFechar={() => setModalAberto(false)}
          aoSalvar={async () => {
            setModalAberto(false)
            setRecarregar((n) => n + 1) // refaz o fetch e a tabela atualiza sozinha
          }}
        />
      )}
      {itemEditando && <ModalNovoItem item={itemEditando} categoriaId={categoriaId} aoFechar={() => setItemEditando(null)} aoSalvar={async () => { setItemEditando(null); setRecarregar((n) => n + 1) }} />}
      {itemParaExcluir && <ModalExcluirItem item={itemParaExcluir} aoFechar={() => setItemParaExcluir(null)} aoConfirmar={excluirItemAtual} salvando={excluindoItem} erro={erroExclusaoItem} />}
      {itemVisualizado && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setItemVisualizado(null)}><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#65BA69]">Detalhes do item</p><h2 className="mt-1 text-xl font-extrabold text-slate-800">{itemVisualizado.nome}</h2><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between border-b border-slate-100 pb-3"><span className="text-slate-400">Pontuação base</span><strong className="text-[#65BA69]">{itemVisualizado.pontos_base} pts</strong></div><div className="flex justify-between border-b border-slate-100 pb-3"><span className="text-slate-400">Status</span><strong className="text-slate-700">{itemVisualizado.status}</strong></div><div><span className="text-slate-400">Descrição</span><p className="mt-1 rounded-xl bg-slate-50 p-3 text-slate-600">{itemVisualizado.descricao || "Sem descrição cadastrada."}</p></div></div><button type="button" onClick={() => setItemVisualizado(null)} className="mt-6 w-full rounded-xl bg-[#7350B9] px-4 py-2.5 text-sm font-bold text-white">Fechar</button></div></div>}
      {modalExcluir && <ModalExcluirCategoria categoria={categoria} aoFechar={() => setModalExcluir(false)} aoConfirmar={async (ok) => { if (!ok) return setErroExclusao("Digite exatamente o texto solicitado para confirmar."); await excluirAtual() }} salvando={excluindo} erro={erroExclusao} />}
      </main>
    </div>
  )
}
