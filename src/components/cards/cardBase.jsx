export default function CardBase({ imagem, botaoTexto, children, onClick }){
  return (
    <div className = {`flex flex-row bg-[#FFFFFF] gap-4 items-center rounded-lg shadow-md w-full min-h-[130px] h-[15vh]`}>
      
      <img src = {imagem} alt = "" />
      
      <div className = "flex flex-col gap-1">
        {children}
      </div>
      
      <button className = "ml-auto bg-[#7350B9] text-[#FFFFFF] text-[clamp(16px,1.2vw,18px)] w-[clamp(180px,15vw,200px)] h-[clamp(45px,5vh,60px)] rounded-[10px] mr-5 cursor-pointer" onClick = {onClick}>
        {botaoTexto}
      </button>

    </div>
  )
} 