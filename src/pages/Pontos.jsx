import Titulo from "../components/titulo.jsx"
import CardStatus from "../components/cardStatus.jsx"

export default function Pontos(){
  return (
    <div>
      <Titulo texto = "Pontos" />

      <div className = "flex flex-row gap-5 mt-5 items-center justify-center">
        <CardStatus 
          titulo = "Taxa de Conversão" 
          valor = "2.500" 
          porcentagem = "+3%" 
          textoRodape = "no último mês"
          largura = "w-[250px]"
          altura = "h-[180px]"
          maxLargura = "2xl:w-[275px]"
          maxAltura = "2xl:h-[200px]"
        />

        <CardStatus 
          titulo = "Itens Validados" 
          valor = "275" 
          porcentagem = "+5%" 
          textoRodape = "no último mês"
          largura = "w-[250px]"
          altura = "h-[180px]"
          maxLargura = "2xl:w-[275px]"
          maxAltura = "2xl:h-[200px]"
        />
          
        <CardStatus 
          titulo = "Pontos Gerados" 
          valor = "1.000" 
          porcentagem = "+10%" 
          textoRodape = "no último mês"
          largura = "w-[250px]"
          altura = "h-[180px]"
          maxLargura = "2xl:w-[275px]"
          maxAltura = "2xl:h-[200px]"
        />
          
        <CardStatus 
          titulo = "Regras Ativas" 
          valor = "5"
          largura = "w-[250px]"
          altura = "h-[180px]"
          maxLargura = "2xl:w-[275px]"
          maxAltura = "2xl:h-[200px]"
        />
          
      </div>
    </div>
  )
}