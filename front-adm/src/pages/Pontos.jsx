import { useEffect, useState, useCallback } from "react"
import Titulo from "../components/ui/titulo.jsx"
import CardStatus from "../components/cards/cardStatus.jsx"
import CardConversao from "../components/cards/cardConversao.jsx"
import CardValidador from "../components/cards/cardValidador.jsx"
import TabelaPontuacao from "../components/tabela/tabelaPontuacao.jsx"
import { getDashboardPontos } from "../services/pontos.js"

export default function Pontos() {
  // 1. Estados para guardar a resposta da API, loading e erro
  const [dados, setDados] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  // 2. Função assíncrona onde o trecho foi inserido
  const carregarDados = useCallback(async () => {
    try {
      setLoading(true)
      setErro(null)

      const response = await getDashboardPontos()
      // Se o controller envelopar em response.response:
      const payload = response.response || response

      setDados(payload)
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
        <Titulo texto="Pontos" />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-gray-500 font-medium animate-pulse">Carregando painel de pontos...</p>
        </div>
      </div>
    )
  }

  // Feedback visual em caso de erro na requisição/token
  if (erro) {
    return (
      <div>
        <Titulo texto="Pontos" />
        <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
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
  const { metricas, configuracaoConversao, regrasPontuacao } = dados || {}

  return (
    <div>
      <Titulo texto="Pontos" />

      <div className="flex flex-col items-center justify-center mt-5">
        <div className="w-[95%] min-h-[85vh]">
          <div className="flex flex-row gap-5">
            <CardStatus 
              titulo="Taxa de Conversão" 
              valor={metricas?.taxaConversao?.valor ?? "--"} 
              porcentagem={metricas?.taxaConversao?.porcentagem} 
              textoRodape={metricas?.taxaConversao?.textoRodape}
            />

            <CardStatus 
              titulo="Itens Validados" 
              valor={metricas?.itensValidados?.valor ?? "--"} 
              porcentagem={metricas?.itensValidados?.porcentagem} 
              textoRodape={metricas?.itensValidados?.textoRodape}
            />
              
            <CardStatus 
              titulo="Pontos Gerados" 
              valor={metricas?.pontosGerados?.valor ?? "--"} 
              porcentagem={metricas?.pontosGerados?.porcentagem} 
              textoRodape={metricas?.pontosGerados?.textoRodape}
            />
              
            <CardStatus 
              titulo="Regras Ativas" 
              valor={metricas?.regrasAtivas?.valor ?? "--"}
            />
          </div>

          <div className="flex flex-row gap-6 w-full mx-auto mt-8 pb-8">
            <div className="flex flex-col gap-5 shrink-0">
              <CardConversao dados={configuracaoConversao} onUpdate={carregarDados} />
              <CardValidador onUpdate={carregarDados} />
            </div>

            <div className="flex-1">
              <TabelaPontuacao dados={regrasPontuacao} onUpdate={carregarDados} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}