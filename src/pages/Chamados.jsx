import Titulo from "../components/ui/titulo.jsx"
import CardChamado from "../components/cards/cardChamados.jsx"
import InputBusca from "../components/ui/inputBusca.jsx"

export default function Chamados(){
  return (
    <div> 
      <Titulo texto = "Chamados" />

      <div className = "flex flex-col items-center justify-center gap-4 mt-5 mx-auto overflow-y-auto">

        <div className = "w-[95%] h-[85vh]"> 

          <div className = "flex flex-row items-center w-full mb-9">
    
            <InputBusca placeholder = "Buscar denúncia ou alerta"/>

            <button className = "bg-[#65BA69] text-[#FFFFFF] text-[18px] w-[200px] h-[50px] rounded-[10px] ml-auto cursor-pointer">
              Adicionar Categoria
            </button>
                    
          </div>

          <div className="space-y-4 overflow-y-auto overflow-x-hidden h-[775px]">

          <CardChamado 
            imagem = ""
            titulo = "Título do Chamado"
            descricao = "Descrição do problema"
            
            tamanhoTitulo = "text-[16px]"
            maxTamanhoTitulo = "2xl:text-[18px]"
            
            tamanhoDescricao = "text-[14px]"
            maxTamanhoDescricao = "2xl:text-[16px]"
          />

          <CardChamado 
            imagem = ""
            titulo = "Título do Chamado"
            descricao = "Descrição do problema"
            
            tamanhoTitulo = "text-[16px]"
            maxTamanhoTitulo = "2xl:text-[18px]"
            
            tamanhoDescricao = "text-[14px]"
            maxTamanhoDescricao = "2xl:text-[16px]"
          />

          <CardChamado 
            imagem = ""
            titulo = "Título do Chamado"
            descricao = "Descrição do problema"
            
            tamanhoTitulo = "text-[16px]"
            maxTamanhoTitulo = "2xl:text-[18px]"
            
            tamanhoDescricao = "text-[14px]"
            maxTamanhoDescricao = "2xl:text-[16px]"
          />

          <CardChamado 
            imagem = ""
            titulo = "Título do Chamado"
            descricao = "Descrição do problema"
            
            tamanhoTitulo = "text-[16px]"
            maxTamanhoTitulo = "2xl:text-[18px]"
            
            tamanhoDescricao = "text-[14px]"
            maxTamanhoDescricao = "2xl:text-[16px]"
          />

          <CardChamado 
            imagem = ""
            titulo = "Título do Chamado"
            descricao = "Descrição do problema"
            
            tamanhoTitulo = "text-[16px]"
            maxTamanhoTitulo = "2xl:text-[18px]"
            
            tamanhoDescricao = "text-[14px]"
            maxTamanhoDescricao = "2xl:text-[16px]"
          />

          <CardChamado 
            imagem = ""
            titulo = "Título do Chamado"
            descricao = "Descrição do problema"
            
            tamanhoTitulo = "text-[16px]"
            maxTamanhoTitulo = "2xl:text-[18px]"
            
            tamanhoDescricao = "text-[14px]"
            maxTamanhoDescricao = "2xl:text-[16px]"
          />

          <CardChamado 
            imagem = ""
            titulo = "Título do Chamado"
            descricao = "Descrição do problema"
            
            tamanhoTitulo = "text-[16px]"
            maxTamanhoTitulo = "2xl:text-[18px]"
            
            tamanhoDescricao = "text-[14px]"
            maxTamanhoDescricao = "2xl:text-[16px]"
          />

          <CardChamado 
            imagem = ""
            titulo = "Título do Chamado"
            descricao = "Descrição do problema"
            
            tamanhoTitulo = "text-[16px]"
            maxTamanhoTitulo = "2xl:text-[18px]"
            
            tamanhoDescricao = "text-[14px]"
            maxTamanhoDescricao = "2xl:text-[16px]"
          />

          <CardChamado 
            imagem = ""
            titulo = "Título do Chamado"
            descricao = "Descrição do problema"
            
            tamanhoTitulo = "text-[16px]"
            maxTamanhoTitulo = "2xl:text-[18px]"
            
            tamanhoDescricao = "text-[14px]"
            maxTamanhoDescricao = "2xl:text-[16px]"
          />
          </div>
        </div>
      </div>
    </div>
  )
}