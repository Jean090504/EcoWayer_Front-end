import { useMemo } from "react"

import Titulo from "../components/ui/titulo.jsx"
import CardStatus from "../components/cards/cardStatus.jsx"
import CardConversao from "../components/cards/cardPontos/cardConversao.jsx"
import CardValidador from "../components/cards/cardPontos/cardValidador.jsx"
import TabelaPontuacao from "../components/tabela/tabelaPontuacao.jsx"

export default function Pontos(){
  const valoresIniciais = useMemo(
  () => ({
    categoria: "eletronicos",
    ativa: true,
    pontos: 150,
    bonus: 10,
    excelente: 1.5,
    bom: 1.2,
    regular: 1.0,
    }),
    []
  )
  return (
    <div>
      <Titulo texto = "Pontos" />

      <div className = "flex flex-col items-center justify-center mt-5">
        <div className = "w-[95%] min-h-[85vh]">
            <div className = "flex flex-row gap-5">
              <CardStatus 
                titulo = "Taxa de Conversão" 
                valor = "2.500" 
                porcentagem = "+3%" 
                textoRodape = "no último mês"
              />

              <CardStatus 
                titulo = "Itens Validados" 
                valor = "275" 
                porcentagem = "+5%" 
                textoRodape = "no último mês"
              />
                
              <CardStatus 
                titulo = "Pontos Gerados" 
                valor = "1.000" 
                porcentagem = "+10%" 
                textoRodape = "no último mês"
              />
                
              <CardStatus 
                titulo = "Regras Ativas" 
                valor = "5"
              />
            </div>

          <div className = "flex flex-row gap-6 w-full mx-auto mt-8 pb-8">
            <div className = "flex flex-col gap-5 shrink-0">
              <CardConversao />
              <CardValidador />
            </div>

            <div className = "flex-1">
              <TabelaPontuacao />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}