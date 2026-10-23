import Titulo from "../components/ui/titulo.jsx"
import CardStatus from "../components/cards/cardStatus.jsx"
import GraficoCss from "../components/descartavel/graficoCss.jsx"

export default function Dashboard(){
  return (
    <div>
      <Titulo texto = "Dashboard" />

      <div className = "flex flex-col items-center justify-center"> 

        <div className = "w-[95%] h-[85vh]">

          <div className = "flex flex-row gap-5 mt-5">
    
            <CardStatus 
              titulo = "Usuários Ativos Hoje" 
              valor = "2.502" 
              porcentagem = "+10%" 
              textoRodape = "no último mês" 
            />
    
            <CardStatus 
              titulo = "Usuários Cadastrados" 
              valor = "4.067" 
              porcentagem = "+10%" 
              textoRodape = "no último mês" 
            />

            <CardStatus 
              titulo = "Anúncios Ativos" 
              valor = "1.500" 
              porcentagem = "+3%" 
              textoRodape = "no último mês" 
            />

            <CardStatus 
              titulo = "Denúncias no Mês" 
              valor = "190" 
              porcentagem = "-20%" 
              textoRodape = "no último mês" 
            />

          </div>
          <div className = "mt-5">
            <GraficoCss /> 
          </div> 
        </div>
      </div>
    </div>
  )
}