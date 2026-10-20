import { useState } from "react"

import Titulo from "../components/ui/titulo.jsx"
import CardStatus from "../components/cards/cardStatus.jsx"
import GraficoHome from "../components/dashboard/graficoHome.jsx"
import RankingPontos from "../components/dashboard/rankingPontos.jsx"

export default function Home(){
  const [filtroRanking, setFiltroRanking] = useState("semanal")

  // dados teste para a lista não ficar vazia
    const dadosRanking = {
      diario: [
        { id: 1, nome: "João Paulo", pontos: 50, variacao: "+50" },
        { id: 2, nome: "Daniel Santana", pontos: 20, variacao: "+20" },
      ],
      semanal: [
        { id: 1, nome: "João Paulo", pontos: 300, variacao: "+50" },
        { id: 2, nome: "Daniel Santana", pontos: 250, variacao: "+20" },
        { id: 3, nome: "Vitor Hugo", pontos: 180, variacao: "+60" },
        { id: 4, nome: "Gabriel Junior", pontos: 90, variacao: "+10" },
        { id: 5, nome: "Alfredo Augusto", pontos: 30, variacao: "-0" },
      ],
      mensal: [
        { id: 1, nome: "Maria Clara", pontos: 1200, variacao: "+200" },
        { id: 2, nome: "João Paulo", pontos: 1100, variacao: "+150" },
        { id: 3, nome: "Daniel Santana", pontos: 800, variacao: "+100" },
        { id: 4, nome: "Vitor Hugo", pontos: 500, variacao: "+80" },
        { id: 5, nome: "Alfredo Augusto", pontos: 150, variacao: "+10" },
      ]
    }
  return (
    <div>

      <Titulo texto = "Home" />

      <div className = "flex flex-col items-center w-full">
        
        {/* Container principal travado em 1050px */}
        <div className = "w-[1050px]"> 

          {/* Cards de cima */}
          <div className = "flex flex-row gap-5 mt-5 justify-between w-full">
            <CardStatus 
              titulo = "Usuários Ativos" 
              valor = "250" 
              porcentagem = "+57%" 
              textoRodape = "no último mês"
              largura = "w-[330px]"
              altura = "h-[180px]"
              maxLargura = "2xl:w-[330px]"
              maxAltura = "2xl:h-[180px]"
            />

            <CardStatus 
              titulo = "Usuários Ativos Hoje" 
              valor = "2.502" 
              porcentagem = "+10%" 
              textoRodape = "no último mês" 
              largura = "w-[330px]"
              altura = "h-[180px]"
              maxLargura = "2xl:w-[330px]"
              maxAltura = "2xl:h-[180px]"
            />

            <CardStatus 
              titulo = "Usuários Cadastrados" 
              valor = "4.067" 
              porcentagem = "+50%" 
              textoRodape = "no último mês" 
              largura = "w-[330px]"
              altura = "h-[180px]"
              maxLargura = "2xl:w-[330px]"
              maxAltura = "2xl:h-[180px]"
            />
          </div>

          {/* Gráfico e Ranking embaixo */}
          <div className = "flex flex-row gap-5 mt-5 justify-between w-full">
            <GraficoHome />
            <RankingPontos 
              // usuarios = {dadosRanking[filtroRanking]} 
              filtroAtivo = {filtroRanking} 
              aoMudarFiltro = {setFiltroRanking} 
            />
          </div>
        </div>

      </div>
    </div>
  )
}