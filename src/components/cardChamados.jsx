export default function CardChamado({ imagem, titulo, descricao, tamanhoTitulo, maxTamanhoTitulo, tamanhoDescricao, maxTamanhoDescricao }) {
  return (
    <div className = "flex flex-row bg-[#FFFFFF] gap-4 w-[1000px] h-[130px] items-center rounded-lg shadow-md">
      
      <img src = {imagem} alt = "" />
      
      <div className = "flex flex-col">
        <p className = {`font-semibold ${tamanhoTitulo} ${maxTamanhoTitulo}`}>{titulo}</p>
        <p className = {`${tamanhoDescricao} ${maxTamanhoDescricao}`}>{descricao}</p>
      </div>
      
      <button className = "ml-auto bg-[#7350B9] text-[#FFFFFF] text-[16px] w-[180px] h-[45px] rounded-[10px] mr-5 cursor-pointer">
        Verificar Anúncio
      </button>

    </div>
  )
}