export default function CardStatus({ titulo, valor, porcentagem, textoRodape, largura, altura, maxLargura, maxAltura }){
  const negativo = porcentagem?.startsWith("-")
  const corPorcentagem = negativo ? "text-[#E43E42]" : "text-[#58A24D]"
  const seta = negativo ? "↓" : "↑"

  return (
    <div className = {`flex flex-col items-center justify-center bg-[#FFFFFF] rounded-[25px] gap-2 ${largura} ${altura} ${maxLargura} ${maxAltura}`}>
      <p className = "text-[14px] text-[#8A8A8A] font-bold 2xl:text-[16px]">{titulo}</p>
      <p className = "text-[44px] text-[#7350B9] font-semibold 2xl:text-[48px]">{valor}</p>
    
      <p className = {`text-[12.5px] text-[#6E7B6C] 2xl:text-[13.5px] ${(!porcentagem || !textoRodape) ? "invisible" : ""}`}>
        <span className = {corPorcentagem}>{seta} {porcentagem} </span> {textoRodape} 
      </p>
    </div>
  )
}