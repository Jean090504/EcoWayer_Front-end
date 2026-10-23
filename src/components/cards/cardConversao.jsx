import CardPadrao from "./cardPadrao"

export default function CardConversao(){
  return (
    <CardPadrao>
      <div className = "flex flex-row justify-between items-center mb-6">
        <h2 className = "text-[clamp(16px,1vw,20px)] font-bold text-[#202735]">Itens e Conversão</h2>
        <span className = "bg-[#65BA69] text-[#FFFFFF] text-[clamp(12px,0.8vw,16px)] font-bold px-3 py-1 rounded-full">
          Ativo
        </span>
      </div>

      <p className = "text-[clamp(10px,0.6vw,14px)] font-bold text-[#8A8A8A] uppercase tracking-wide mb-2">
        Taxa de conversão
      </p>

      <div className = "flex flex-row items-center w-full h-[45px] border border-[#E5E7EB] rounded-[8px] px-4 mb-2 bg-[#FFFFFF]">
 
        <svg xmlns = "http://www.w3.org/2000/svg" fill = "none" viewBox = "0 0 24 24" strokeWidth = {2} stroke = "currentColor" className = "w-[clamp(18px,1.5vw,24px)] h-[clamp(18px,1.5vw,24px)] text-[#8A8A8A] mr-3">
          <path strokeLinecap = "round" strokeLinejoin = "round" d = "m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
        
        <input 
          type="number" 
          defaultValue = "1.25" 
          className = "w-full h-full outline-none text-[clamp(16px,1.0vw,20px)] text-[#202735] font-medium bg-transparent"
        />
      </div>

      <p className = "text-[clamp(12px,0.8vw,16px)] text-[#8A8A8A]">
        Defina a taxa multiplicadora do ciclo
      </p>
    </CardPadrao>
  )
}