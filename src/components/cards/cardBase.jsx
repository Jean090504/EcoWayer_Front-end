export default function CardBase({ imagem, botaoTexto, children, largura, altura, maxLargura, maxAltura }){
  return (
    <div className = {`flex flex-row bg-[#FFFFFF] gap-4 items-center rounded-lg shadow-md ${largura} ${altura} ${maxLargura} ${maxAltura}`}>
      
      <img src = {imagem} alt = "" />
      
      <div className = "flex flex-col gap-1">
        {children}
      </div>
      
      <button className = "ml-auto bg-[#7350B9] text-[#FFFFFF] text-[16px] w-[180px] h-[45px] rounded-[10px] mr-5 cursor-pointer">
        {botaoTexto}
      </button>

    </div>
  )
}