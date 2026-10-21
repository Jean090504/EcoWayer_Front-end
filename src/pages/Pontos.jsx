import Titulo from "../components/ui/titulo.jsx"
import CardStatus from "../components/cards/cardStatus.jsx"
import CardConversao from "../components/cards/cardConversao.jsx"
import CardValidador from "../components/cards/cardValidador.jsx"
import TabelaPontuacao from "../components/dashboard/tabelaPontuacao.jsx"

export default function Pontos(){
  return (
    <div>
      <Titulo texto = "Pontos" />

      <div className = "flex flex-row gap-4 mt-5 px-8 justify-center">
        <CardStatus 
          titulo = "Taxa de Conversão" 
          valor = "2.500" 
          porcentagem = "+3%" 
          textoRodape = "no último mês"
          largura = "w-full max-w-[17rem]"
          altura = "min-h-[11rem]"
          maxLargura = ""
          maxAltura = ""
        />

        <CardStatus 
          titulo = "Itens Validados" 
          valor = "275" 
          porcentagem = "+5%" 
          textoRodape = "no último mês"
          largura = "w-full max-w-[17rem]"
          altura = "min-h-[11rem]"
          maxLargura = ""
          maxAltura = ""
        />
          
        <CardStatus 
          titulo = "Pontos Gerados" 
          valor = "1.000" 
          porcentagem = "+10%" 
          textoRodape = "no último mês"
          largura = "w-full max-w-[17rem]"
          altura = "min-h-[11rem]"
          maxLargura = ""
          maxAltura = ""
        />
          
        <CardStatus 
          titulo = "Regras Ativas" 
          valor = "5"
          largura = "w-full max-w-[17rem]"
          altura = "min-h-[11rem]"
          maxLargura = ""
          maxAltura = ""
        />
      </div>

      <div className = "flex flex-row gap-6 w-full max-w-[75rem] mx-auto mt-8 px-8 pb-8">
        <div className = "flex flex-col gap-5 w-[22rem] shrink-0 min-w-0">
          <CardConversao />
          <CardValidador />
        </div>

        <div className = "flex-1 min-w-0">
          <TabelaPontuacao />
        </div>
      </div>
    </div>
  )
}