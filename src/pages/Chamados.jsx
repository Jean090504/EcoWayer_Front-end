import Titulo from "../components/ui/titulo.jsx"
import CardChamado from "../components/cards/cardChamados.jsx"
import InputBusca from "../components/ui/inputBusca.jsx"
import IconSearch from "../assets/icons/ui/search.png"
import barra from "../assets/icons/imagens/barra-input.png"
import filtro from "../assets/icons/ui/filtro.png"

export default function Chamados(){
  return (
    <div className = "flex flex-col gap-4">
      <Titulo texto = "Chamados" />

      <div className = "flex flex-col gap-4 items-center mt-5 overflow-y-auto h-screen w-[1050px] mx-auto">

        <div className = "flex flex-row items-center w-full mb-9">
  
          <div className = "relative w-[500px]">
            <img src = {IconSearch} alt = "Ícone de busca" className = "absolute left-0 top-[25px] -translate-y-1/2 w-[15px] h-[15px] ml-4 cursor-pointer"/>
            
            <InputBusca placeholder = "Buscar denúncia ou alerta"/>
            
            <img src = {barra} alt = "Ícone de barra" className = "absolute right-0 top-[25px] -translate-y-1/2 w-[1.75px] h-[20px] mr-10"/>
            
            <img src = {filtro} alt = "Ícone de filtro" className = "absolute right-0 top-[25px] -translate-y-1/2 w-[20px] h-[20px] mr-4 cursor-pointer"/>
          </div>

            <button className = "bg-[#65BA69] text-[#FFFFFF] text-[18px] w-[200px] h-[50px] rounded-[10px] ml-auto cursor-pointer">
              Adicionar Categoria
            </button>
                  
          </div>

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
  )
}