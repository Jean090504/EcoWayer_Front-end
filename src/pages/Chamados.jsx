import Titulo from "../components/titulo.jsx"
import CardChamado from "../components/cardChamados.jsx"

export default function Chamados(){
  return (
    <div className = "flex flex-col gap-4">
      <Titulo texto = "Chamados" />

      <div className = "flex flex-col gap-4 items-center mt-5 overflow-y-auto h-screen">
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