import { useState, useMemo, useEffect } from "react"
import { Search } from "lucide-react"

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
    <div className="bg-[#FFFFFF] rounded-[16px] shadow-sm border border-[#F3F4F6] w-full h-full flex flex-col pb-4">
      {/* Cabeçalho superior com barra de busca e botão de ação */}
      <div className="flex flex-row justify-between items-center p-4 border-b border-[#F3F4F6]">
        <h2 className="text-[clamp(12px,1vw,16px)] font-bold text-[#202735]">
          Pontuação Base por Categoria
        </h2>

        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-row items-center w-[clamp(140px,18vw,200px)] h-[clamp(30px,1vw,35px)] border border-[#E5E7EB] rounded-[8px] px-3 focus-within:border-[#65BA69] transition-colors">
            <Search size={14} className="text-[#8A8A8A]" />
            <input
              type="text"
              value={busca}
              onChange={handleBuscar}
              placeholder="Filtrar categoria..."
              className="w-full outline-none text-[clamp(12px,0.8vw,14px)] bg-transparent placeholder-[#8A8A8A] pl-2 text-[#202735]"
            />
          </div>

        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={editando ? salvarEdicao : salvarRegra} className="w-[min(520px,94vw)] rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="mb-5 border-b border-gray-100 pb-4 text-lg font-bold text-[#202735]">● Gerenciar Regra de Pontuação</h3>
            <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-2 block text-[11px] font-bold uppercase text-slate-500">Categoria selecionada</label>
            <select
              value={categoriaId}
              onChange={(event) => setCategoriaId(event.target.value)}
              className="mb-3 w-full rounded-lg border border-gray-300 p-2 outline-none focus:border-[#65BA69]"
              disabled={salvando}
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
              ))}
            </select>
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
      <div className="bg-[#65BA69] w-full flex flex-row items-center justify-between py-3 px-4 mt-2">
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

      <div className="flex flex-wrap items-center justify-center gap-3 border-b border-[#F3F4F6] px-4 py-3 text-xs text-slate-500">
        <span className="font-bold uppercase">Legenda:</span>
        <span className="rounded bg-green-100 px-2 py-1 text-green-700">Excelente</span>
        <span className="rounded bg-purple-100 px-2 py-1 text-purple-700">Bom</span>
        <span className="rounded bg-orange-100 px-2 py-1 text-orange-700">Regular</span>
      </div>

      {/* Rodapé com controle de paginação */}
      <div className="flex flex-row items-center justify-end gap-2 px-6 pt-4 mt-auto border-t border-[#F3F4F6]">
        <Paginacao
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          onMudarPagina={setPaginaAtual}
        />
      </div>
    </div>
  )
}
