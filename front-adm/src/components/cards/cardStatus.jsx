export default function CardStatus({ titulo, valor, porcentagem, textoRodape, altura }){
  const negativo = porcentagem?.startsWith("-")
  const corPorcentagem = negativo ? "text-[#E43E42]" : "text-[#58A24D]"
  const seta = negativo ? "↓" : "↑"

  return (
    <div className = {`flex flex-col items-center justify-center bg-[#FFFFFF] rounded-[25px] w-full h-[200px]`}>
      <p className = "text-[clamp(14px,1.25vw,18px)] text-[#8A8A8A] font-bold">{titulo}</p>
      <p className = "text-[clamp(44px,2.75vw,56px)] text-[#7350B9] font-semibold">{valor}</p>

      <p className = {`text-[clamp(12.5px,0.8vw,16px)] text-[#6E7B6C] ${(!porcentagem || !textoRodape) ? "invisible" : ""}`}>
        <span className = {corPorcentagem}>{seta} {porcentagem} </span> {textoRodape}&#x20;
      </p>
    </div>
  )
}