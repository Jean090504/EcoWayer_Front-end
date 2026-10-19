import Titulo from "../components/titulo.jsx"
import CardStatus from "../components/cardStatus.jsx"

export default function Dashboard(){
  return (
    <div>
      <Titulo texto = "Dashboard" />

          <div className = "flex flex-row gap-5 mt-5 items-center justify-center">
    
            <CardStatus 
              titulo = "Usuários Ativos Hoje" 
              valor = "2.502" 
              porcentagem = "+10%" 
              textoRodape = "no último mês" 
              largura = "w-[250px]"
              altura = "h-[180px]"
              maxLargura = "2xl:w-[275px]"
              maxAltura = "2xl:h-[200px]"
            />
    
            <CardStatus 
              titulo = "Usuários Cadastrados" 
              valor = "4.067" 
              porcentagem = "+10%" 
              textoRodape = "no último mês" 
              largura = "w-[250px]"
              altura = "h-[180px]"
              maxLargura = "2xl:w-[275px]"
              maxAltura = "2xl:h-[200px]"
            />

            <CardStatus 
              titulo = "Anúncios Ativos" 
              valor = "1.500" 
              porcentagem = "+3%" 
              textoRodape = "no último mês" 
              largura = "w-[250px]"
              altura = "h-[180px]"
              maxLargura = "2xl:w-[275px]"
              maxAltura = "2xl:h-[200px]"
            />

            <CardStatus 
              titulo = "Denúncias no Mês" 
              valor = "190" 
              porcentagem = "-20%" 
              textoRodape = "no último mês" 
              largura = "w-[250px]"
              altura = "h-[180px]"
              maxLargura = "2xl:w-[275px]"
              maxAltura = "2xl:h-[200px]"
            />

          </div>

    </div>
  )
}