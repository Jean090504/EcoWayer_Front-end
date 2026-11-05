import { useEffect, useMemo, useState } from "react"

import Titulo from "../components/ui/titulo.jsx"
import CardStatus from "../components/cards/cardStatus.jsx"
import GraficoHome from "../components/dashboard/graficoHome.jsx"
import RankingPontos from "../components/dashboard/rankingPontos.jsx"
import { listarAcessos, listarPontos, listarUsuarios } from "../services/home/home.js"
import { calcularCards, calcularGrafico, calcularRanking, opcoesPeriodo } from "../services/home/metricasHome.js"

const SEM_DADOS = { acessos: [], pontos: [], usuarios: [] }

export default function Home() {
  const [dados, setDados] = useState(SEM_DADOS)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const [filtroRanking, setFiltroRanking] = useState("semanal")
  const [periodoGrafico, setPeriodoGrafico] = useState("30d")

  useEffect(() => {
    const controller = new AbortController()

    async function carregar() {
      try {
        setCarregando(true)
        setErro(null)

        const [acessos, pontos, usuarios] = await Promise.all([
          listarAcessos(controller.signal),
          listarPontos(controller.signal),
          listarUsuarios(controller.signal)
        ])

        setDados({ acessos, pontos, usuarios })
      } catch (e) {
        if (e.name !== "AbortError") setErro(e.message)
      } finally {
        setCarregando(false)
      }
    }

    carregar()
    return () => controller.abort()
  }, [])

  const cards = useMemo(() => calcularCards(dados), [dados])
  const grafico = useMemo(() => calcularGrafico(dados.pontos, periodoGrafico), [dados.pontos, periodoGrafico])
  const ranking = useMemo(
    () => calcularRanking(dados.pontos, dados.usuarios, filtroRanking),
    [dados.pontos, dados.usuarios, filtroRanking]
  )

  // enquanto carrega, o rodapé do card fica invisível (o CardStatus esconde quando não há porcentagem)
  const valor = (card) => (carregando ? "..." : card.valor)
  const variacao = (card) => (carregando ? undefined : card.variacao)

  return (
    <div>
      <Titulo texto="Home" />

      <div className="flex flex-col items-center justify-center">
        <div className="w-[95%] min-h-[85vh]">

          {erro && (
            <p className="mt-5 text-center text-red-600">{erro}</p>
          )}

          {/* Cards de cima */}
          <div className="flex flex-row gap-5 mt-5 justify-between w-full">
            <CardStatus
              titulo="Usuários Ativos"
              valor={valor(cards.ativos)}
              porcentagem={variacao(cards.ativos)}
              textoRodape="no último mês"
              largura="w-full"
              altura="h-[25vh] min-h-[180px]"
            />

            <CardStatus
              titulo="Usuários Ativos Hoje"
              valor={valor(cards.ativosHoje)}
              porcentagem={variacao(cards.ativosHoje)}
              textoRodape="no último mês"
              largura="w-full"
              altura="h-[25vh] min-h-[180px]"
            />

            <CardStatus
              titulo="Usuários Cadastrados"
              valor={valor(cards.cadastrados)}
              porcentagem={variacao(cards.cadastrados)}
              textoRodape="no último mês"
              largura="w-full"
              altura="h-[25vh] min-h-[180px]"
            />
          </div>

          {/* Gráfico e Ranking embaixo */}
          <div className="flex flex-row gap-5 mt-5 justify-between w-full h-[55vh]">
            <GraficoHome
              serie={grafico.serie}
              total={grafico.total}
              variacao={grafico.variacao}
              periodo={periodoGrafico}
              opcoes={opcoesPeriodo}
              aoMudarPeriodo={setPeriodoGrafico}
              carregando={carregando}
            />

            <RankingPontos
              usuarios={ranking}
              filtroAtivo={filtroRanking}
              aoMudarFiltro={setFiltroRanking}
              carregando={carregando}
            />
          </div>

        </div>
      </div>
    </div>
  )
}