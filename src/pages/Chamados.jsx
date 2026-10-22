import Titulo from "../components/ui/titulo.jsx"
import CardChamado from "../components/cards/cardChamados.jsx"
import InputBusca from "../components/ui/inputBusca.jsx"

export default function Chamados(){
  return (
    <div> 
      <Titulo texto = "Chamados" />

      <div className = "flex flex-col items-center justify-center mt-5">

        <div className = "flex flex-col w-[95%] h-[85vh]"> 
    
          <InputBusca placeholder = "Buscar denúncia ou alerta"/>

          <div className = "mt-8 flex-1 min-h-0 space-y-4 overflow-y-auto overflow-x-hidden">

            <CardChamado 
              imagem = ""
              titulo = "Título do Chamado"
              descricao = "Descrição do problema"
            />

            <CardChamado 
              imagem = ""
              titulo = "Título do Chamado"
              descricao = "Descrição do problema"
            />

            <CardChamado 
              imagem = ""
              titulo = "Título do Chamado"
              descricao = "Descrição do problema"
            />

            <CardChamado 
              imagem = ""
              titulo = "Título do Chamado"
              descricao = "Descrição do problema"
            />

            <CardChamado 
              imagem = ""
              titulo = "Título do Chamado"
              descricao = "Descrição do problema"
            />

            <CardChamado 
              imagem = ""
              titulo = "Título do Chamado"
              descricao = "Descrição do problema"
            />

            <CardChamado 
              imagem = ""
              titulo = "Título do Chamado"
              descricao = "Descrição do problema"
            />

            <CardChamado 
              imagem = ""
              titulo = "Título do Chamado"
              descricao = "Descrição do problema"
            />

            <CardChamado 
              imagem = ""
              titulo = "Título do Chamado"
              descricao = "Descrição do problema"
            />
          </div>
        </div>
      </div>
    </div>
  )
}