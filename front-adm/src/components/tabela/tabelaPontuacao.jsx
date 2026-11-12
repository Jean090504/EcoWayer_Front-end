import { useState, useMemo, useEffect } from "react"
import { Check, ChevronDown, Search } from "lucide-react"

import CardTabela from "../cards/cardTabela.jsx"
import Cabecalho from "./cabecalhoTabela.jsx"
import Paginacao from "../Paginacao/paginacao.jsx"
import { listarCategoriasParaRegra, listarCondicoes, atualizarStatusRegra, atualizarRegraPontuacao } from "../../services/pontos.js"
import { atualizarCategoriaPontos } from "../../services/categoriaService.js"

const ITENS_POR_PAGINA = 5

export default function TabelaPontuacao({ dados = [], onUpdate }) {
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [busca, setBusca] = useState("")
  const [modalAberto, setModalAberto] = useState(false)
  const [categorias, setCategorias] = useState([])
  const [categoriaId, setCategoriaId] = useState("")
  const [erro, setErro] = useState("")
  const [salvando, setSalvando] = useState(false)
  const [editando, setEditando] = useState(null)
  const [statusRegra, setStatusRegra] = useState(true)
  const [bonus, setBonus] = useState("0")
  const [condicoes, setCondicoes] = useState([])
  const [multiplicadores, setMultiplicadores] = useState({})
  const [pontosBase, setPontosBase] = useState(0)
  const [categoriaMenuAberto, setCategoriaMenuAberto] = useState(false)

  useEffect(() => {
    if (!modalAberto) return
    Promise.all([listarCategoriasParaRegra(), listarCondicoes()])
      .then(([cats, conds]) => { setCategorias(cats); setCondicoes(conds) })
      .catch((error) => setErro(error.message || "Não foi possível carregar as categorias."))
  }, [modalAberto])

  const abrirModal = () => {
    setErro("")
    setCategoriaId("")
    setEditando(null)
    setStatusRegra(true)
    setBonus("0")
    setPontosBase(0)
    setMultiplicadores({})
    setCategoriaMenuAberto(false)
    setModalAberto(true)
  }

  const salvarRegra = async (event) => {
    event.preventDefault()
    if (!categoriaId) return setErro("Selecione uma categoria.")
    try {
      setSalvando(true)
      setErro("")
      await criarRegraPontuacao({
        id_categoria: Number(categoriaId),
        bonus_campanha_percentual: 0,
        bonus_campanha_ativo: false,
        status: true
      })
      setModalAberto(false)
      onUpdate?.()
    } catch (error) {
      setErro(error.message || "Não foi possível criar a regra.")
    } finally {
      setSalvando(false)
    }
  }

  const editarRegra = async (item) => {
    if (!item.regraId) return setErro("Esta categoria ainda não possui uma regra.")
    setErro("")
    setEditando(item)
    setCategoriaId(String(item.id))
    setStatusRegra(Boolean(item.ativo))
    setBonus(String(item.bonus ?? 0))
    setPontosBase(Number(item.base || 0))
    setMultiplicadores(Object.fromEntries((item.condicao || []).map((condicao) => [condicao.id || condicao.id_condicao_item, condicao.multiplicador])))
    setCategoriaMenuAberto(false)
    setModalAberto(true)
  }

  const salvarEdicao = async (event) => {
    event.preventDefault()
    const valor = Number(bonus)
    if (!editando?.regraId || !Number.isFinite(valor) || valor < 0 || valor > 100) return setErro("Informe um bônus entre 0 e 100.")
    try {
      setSalvando(true)
      const categoriaAtual = categorias.find((categoria) => String(categoria.id) === String(editando.id))
      await atualizarCategoriaPontos(editando.id, categoriaAtual, Number(pontosBase))
      await atualizarRegraPontuacao(editando.regraId, { bonus_campanha_percentual: valor, bonus_campanha_ativo: valor > 0, status: statusRegra, condicao: Object.entries(multiplicadores).filter(([, fator]) => Number(fator) > 0).map(([id, fator]) => ({ id_condicao_item: Number(id), multiplicador: Number(fator) })) })
      setModalAberto(false)
      onUpdate?.()
    } catch (error) { setErro(error.message || "Não foi possível salvar a regra.") }
    finally { setSalvando(false) }
  }

  // Filtra as categorias com base no input de pesquisa
  const dadosFiltrados = useMemo(() => {
    if (!busca.trim()) return dados
    return dados.filter((item) =>
      item.cat?.toLowerCase().includes(busca.toLowerCase().trim())
    )
  }, [dados, busca])

  // Recalcula paginação
  const totalPaginas = Math.max(1, Math.ceil(dadosFiltrados.length / ITENS_POR_PAGINA))
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const dadosPagina = dadosFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA)

  const handleBuscar = (e) => {
    setBusca(e.target.value)
    setPaginaAtual(1) // Reseta para a primeira página ao pesquisar
  }

  return (
    <div className="flex h-full w-full flex-col rounded-2xl border border-slate-100 bg-white pb-4 shadow-[0_8px_30px_rgba(31,41,55,0.05)]">
      {/* Cabeçalho superior com barra de busca e botão de ação */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#65BA69]">Configuração</p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-800">
          Pontuação Base por Categoria
          </h2>
        </div>

        <div className="flex w-full flex-row items-center gap-4 sm:w-auto">
          <div className="flex h-10 w-full flex-row items-center rounded-xl border border-slate-200 px-3 transition-colors focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 sm:w-[220px]">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              value={busca}
              onChange={handleBuscar}
              placeholder="Filtrar categoria..."
              className="w-full bg-transparent pl-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={editando ? salvarEdicao : salvarRegra} className="w-[min(520px,94vw)] rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="mb-5 border-b border-gray-100 pb-4 text-lg font-bold text-[#202735]">● Gerenciar Regra de Pontuação</h3>
            <div className="grid grid-cols-2 gap-4">
            <div className="relative"><label className="mb-2 block text-[11px] font-bold uppercase text-slate-500">Categoria selecionada</label>
              <button type="button" onClick={() => setCategoriaMenuAberto((aberto) => !aberto)} disabled={salvando} aria-expanded={categoriaMenuAberto} className="flex h-[46px] w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 text-left text-sm font-semibold text-slate-700 outline-none transition hover:border-[#7350B9] focus:border-[#7350B9] focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-60">
                <span className={categoriaId ? "text-slate-700" : "text-slate-400"}>{categorias.find((categoria) => String(categoria.id) === String(categoriaId))?.nome || "Selecione uma categoria"}</span>
                <ChevronDown size={17} className={`text-slate-400 transition-transform ${categoriaMenuAberto ? "rotate-180 text-[#7350B9]" : ""}`} />
              </button>
              {categoriaMenuAberto && <div className="absolute left-0 top-[74px] z-30 max-h-64 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_16px_35px_rgba(31,41,55,0.18)]">
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Categorias disponíveis</p>
                {categorias.map((categoria) => { const selecionada = String(categoria.id) === String(categoriaId); return <button key={categoria.id} type="button" onClick={() => { setCategoriaId(String(categoria.id)); setCategoriaMenuAberto(false) }} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${selecionada ? "bg-purple-50 font-bold text-[#7350B9]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}><span>{categoria.nome}</span>{selecionada && <Check size={16} className="text-[#65BA69]" />}</button> })}
              </div>}
            </div>
            <div><label className="mb-2 block text-[11px] font-bold uppercase text-slate-500">Status da regra</label><button type="button" onClick={() => setStatusRegra(!statusRegra)} className={`h-[42px] w-full rounded-lg border text-sm font-semibold ${statusRegra ? "border-green-200 bg-green-50 text-green-700" : "border-gray-200 bg-gray-100 text-gray-500"}`}>{statusRegra ? "● Ativa" : "○ Inativa"}</button></div>
            </div>
            {editando && <>
              <div className="mt-4 grid grid-cols-2 gap-4"><div><label className="mb-2 block text-[11px] font-bold uppercase text-slate-500">Pontuação base (pts)</label><input type="number" min="0" value={pontosBase} onChange={(e) => setPontosBase(e.target.value)} className="h-[42px] w-full rounded-lg border px-3 font-bold" /></div><div><label className="mb-2 block text-[11px] font-bold uppercase text-slate-500">Bonificação extra de campanha</label><input type="number" min="0" max="100" step="0.01" value={bonus} onChange={(e) => setBonus(e.target.value)} className="h-[42px] w-full rounded-lg border px-3 font-bold text-green-600" /></div></div>
              <p className="mt-4 text-[11px] font-bold uppercase text-slate-500">Multiplicadores por estado de conservação</p><div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">{condicoes.slice(0, 3).map((condicao) => { const nome = condicao.nome.toLowerCase(); const cor = nome.includes("excel") ? "bg-green-500" : nome.includes("bom") ? "bg-purple-600" : "bg-orange-500"; return <label key={condicao.id} className={`rounded-lg ${cor} p-2 text-xs font-bold text-white`}>{condicao.nome}<input type="number" min="0.01" step="0.01" value={multiplicadores[condicao.id] ?? 1} onChange={(e) => setMultiplicadores({ ...multiplicadores, [condicao.id]: e.target.value })} className="mt-2 w-full rounded bg-white p-2 text-black" /></label> })}</div>
              <div className="mt-4 rounded-xl border border-purple-100 bg-purple-50 p-4"><p className="text-[11px] uppercase text-slate-500">Simulação instantânea</p><p className="text-right text-xl font-bold text-purple-600">{(Number(editando.base || 0) * (1 + Number(bonus || 0) / 100)).toFixed(2)} pts</p></div>
            </>}
            {erro && <p className="mt-3 text-sm text-red-600">{erro}</p>}
            <div className="mt-5 flex justify-end gap-2 border-t border-gray-100 pt-4"><button type="button" onClick={() => setModalAberto(false)} className="rounded-lg border px-4 py-2 text-sm" disabled={salvando}>Cancelar</button><button type="submit" className="rounded-lg bg-purple-600 px-5 py-2 text-sm font-bold text-white" disabled={salvando}>{salvando ? "Salvando..." : "Salvar Alterações"}</button></div>
          </form>
        </div>
      )}

      {/* Cabeçalho da grade da tabela */}
      <div className="mx-3 mt-3 flex w-[calc(100%-1.5rem)] flex-row items-center justify-between rounded-xl bg-[#65BA69] px-4 py-3">
        <Cabecalho largura="w-[clamp(90px,12vw,150px)]" alinhamento="text-left pl-3.5" texto="Categoria" textoCor="text-[#FFFFFF]" />
        <Cabecalho largura="w-[clamp(90px,8vw,100px)]" alinhamento="text-center pl-1" texto="Pontos Base" textoCor="text-[#FFFFFF]" />
        <Cabecalho largura="w-[clamp(150px,20vw,250px)]" alinhamento="text-center" texto="Condições" textoCor="text-[#FFFFFF]" />
        <Cabecalho largura="w-[clamp(80px,8vw,100px)]" alinhamento="text-right pr-8.5" texto="Ações" textoCor="text-[#FFFFFF]" />
      </div>


      {/* Linhas da tabela populadas via Back-end */}
      <div className="flex flex-col w-full px-2 min-h-[220px]">
        {dadosPagina.length > 0 ? (
          dadosPagina.map((item) => (
            <CardTabela
              key={item.id}
              corBolinha={item.cor}
              categoria={item.cat}
              pontosBase={item.base}
              condExcelente={item.exc}
              condBom={item.bom}
              condRegular={item.reg}
              ativo={item.ativo}
              onToggle={item.regraId ? async () => { await atualizarStatusRegra(item.regraId, !item.ativo); onUpdate?.() } : undefined}
              onEdit={() => editarRegra(item)}
            />
          ))
        ) : (
          <div className="flex items-center justify-center py-12 text-[#94A3B8] text-sm font-medium">
            {busca ? `Nenhuma categoria encontrada para "${busca}".` : "Nenhuma categoria cadastrada no banco."}
          </div>
        )}
      </div>

      {/* Rodapé com controle de paginação */}
      <div className="flex flex-row items-center justify-between px-6 pt-4 mt-auto border-t border-[#F3F4F6]">

        {/* Legenda na esquerda */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-bold uppercase mr-1">Legenda:</span>
          <span className="rounded bg-orange-100 px-2 py-1 text-orange-700">Regular</span>
          <span className="rounded bg-purple-100 px-2 py-1 text-purple-700">Bom</span>
          <span className="rounded bg-green-100 px-2 py-1 text-green-700">Excelente</span>
        </div>

        {/* Paginação na direita */}
        <Paginacao
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          onMudarPagina={setPaginaAtual}
        />

      </div>
    </div>
  )
}
