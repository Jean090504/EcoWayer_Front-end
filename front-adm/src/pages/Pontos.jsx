import { useEffect, useState, useCallback } from "react"
import CardStatus from "../components/cards/cardStatus.jsx"
import CardValidador from "../components/cards/cardValidador.jsx"
import TabelaPontuacao from "../components/tabela/tabelaPontuacao.jsx"
import { getDashboardPontos, listarCategoriasParaRegra, listarRegrasPontuacao } from "../services/pontos.js"

export default function Pontos() {
  // 1. Estados para guardar a resposta da API, loading e erro
  const [dados, setDados] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [categorias, setCategorias] = useState([])

  // 2. Função assíncrona onde o trecho foi inserido
  const carregarDados = useCallback(async () => {
    try {
      setLoading(true)
      setErro(null)

      const [response, categoriasResponse, regrasResponse] = await Promise.all([
        getDashboardPontos(),
        listarCategoriasParaRegra(),
        listarRegrasPontuacao()
      ])
      // Se o controller envelopar em response.response:
      const payload = response.response || response

      setDados(payload)
      setCategorias(categoriasResponse)
      setDados((atual) => ({ ...payload, regrasPontuacao: regrasResponse }))
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error)
      setErro(error.message || "Falha ao carregar as informações.")
    } finally {
      setLoading(false)
    }
  }, [])

  // 3. Executa a requisição assim que o componente é montado na tela
  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  // Feedback visual enquanto a requisição está em andamento
  if (loading) {
    return (
      <div>
        <div className="mx-auto w-full max-w-[1600px] px-5 pt-7 sm:px-8 lg:px-10"><h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Pontos</h1></div>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-500 font-medium animate-pulse">Carregando painel de pontos...</p>
        </div>
      </div>
    )
  }

  // Feedback visual em caso de erro na requisição/token
  if (erro) {
    return (
      <div>
        <div className="mx-auto w-full max-w-[1600px] px-5 pt-7 sm:px-8 lg:px-10"><h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Pontos</h1></div>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <p className="text-red-600 font-medium">{erro}</p>
          <button
            onClick={carregarDados}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  // 4. Desestruturação dos dados recebidos do backend
  const { metricas, regrasPontuacao = [] } = dados || {}
  const regrasPorCategoria = new Map(regrasPontuacao.map((regra) => [
    regra.id_categoria ?? regra.categoria?.id ?? regra.id,
    regra
  ]))
  const tabelaCategorias = categorias.map((categoria) => {
    const regra = regrasPontuacao.find((item) => String(item.categoria?.id ?? item.id_categoria) === String(categoria.id)) || regrasPorCategoria.get(categoria.id)
    const multiplicador = (nome) => regra?.condicao?.find((item) => item.nome?.toLowerCase() === nome)?.multiplicador
    return {
      id: categoria.id,
      cat: categoria.nome,
      base: categoria.pontos ?? regra?.pontos_base ?? regra?.base ?? 0,
      cor: categoria.cor ?? regra?.cor ?? "#65BA69",
      regraId: regra?.regraId ?? regra?.id,
      ativo: regra?.ativo ?? regra?.status ?? false,
      exc: multiplicador("excelente") ? `${multiplicador("excelente")}x` : "—",
      bom: multiplicador("bom") ? `${multiplicador("bom")}x` : "—",
      reg: multiplicador("regular") ? `${multiplicador("regular")}x` : "—"
    }
  })

  return (
    <div>
      <div className="mx-auto w-full max-w-[1600px] px-5 pb-10 pt-7 sm:px-8 lg:px-10">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Gestão da pontuação</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-800">Pontos</h1><p className="mt-1 text-sm text-slate-400">Acompanhe regras, categorias e validações da comunidade.</p></div>
        </div>
        <div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <CardStatus 
              titulo="Taxa de Conversão" 
              valor={metricas?.taxaConversao?.valor ?? "--"} 
              porcentagem={metricas?.taxaConversao?.porcentagem} 
              textoRodape={metricas?.taxaConversao?.textoRodape}
              accent="green"
            />

            <CardStatus 
              titulo="Itens Validados" 
              valor={metricas?.itensValidados?.valor ?? "--"} 
              porcentagem={metricas?.itensValidados?.porcentagem} 
              textoRodape={metricas?.itensValidados?.textoRodape}
              accent="purple"
            />
              
            <CardStatus 
              titulo="Pontos Gerados" 
              valor={metricas?.pontosGerados?.valor ?? "--"} 
              porcentagem={metricas?.pontosGerados?.porcentagem} 
              textoRodape={metricas?.pontosGerados?.textoRodape}
              accent="green"
            />
              
            <CardStatus 
              titulo="Regras Ativas" 
              valor={metricas?.regrasAtivas?.valor ?? "--"}
              accent="purple"
            />
          </div>

          <div className="mt-6 grid w-full grid-cols-1 gap-6 pb-8 xl:grid-cols-[minmax(280px,0.8fr)_minmax(0,2fr)]">
            <div className="flex min-w-0 flex-col gap-5">
              <CardValidador onUpdate={carregarDados} />
            </div>

            <div className="flex-1">
              <TabelaPontuacao dados={tabelaCategorias} onUpdate={carregarDados} />
            </div>
          </div>
      </div>
    </div>
    </div>
  )
}
