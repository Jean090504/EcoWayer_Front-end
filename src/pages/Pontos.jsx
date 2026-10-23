import Titulo from "../components/ui/titulo.jsx"
import CardStatus from "../components/cards/cardStatus.jsx"
import CardConversao from "../components/cards/cardConversao.jsx"
import CardValidador from "../components/cards/cardValidador.jsx"
import TabelaPontuacao from "../components/dashboard/tabelaPontuacao.jsx"

export default function Pontos(){
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