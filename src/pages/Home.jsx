import Titulo from "../components/titulo.jsx"
import CardStatus from "../components/cardStatus.jsx"

export default function Home(){
  return (
    <div>
      <Titulo texto = "Home" />

      <div className = "flex flex-row gap-5 mt-5 items-center justify-center">
        <CardStatus 
          titulo = "Usuários Ativos" 
          valor = "250" 
          porcentagem = "+57%" 
          textoRodape = "no último mês"
          largura = "w-[300px]"
          altura = "h-[180px]"
          maxLargura = "2xl:w-[380px]"
          maxAltura = "2xl:h-[200px]"
        />

        <CardStatus 
          titulo = "Usuários Ativos Hoje" 
          valor = "2.502" 
          porcentagem = "+10%" 
          textoRodape = "no último mês" 
          largura = "w-[300px]"
          altura = "h-[180px]"
          maxLargura = "2xl:w-[380px]"
          maxAltura = "2xl:h-[200px]"
        />

        <CardStatus 
          titulo = "Usuários Cadastrados" 
          valor = "4.067" 
          porcentagem = "+50%" 
          textoRodape = "no último mês" 
          largura = "w-[300px]"
          altura = "h-[180px]"
          maxLargura = "2xl:w-[380px]"
          maxAltura = "2xl:h-[200px]"
        />
      </div>
    </div>
  )
}