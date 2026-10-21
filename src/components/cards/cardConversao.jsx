import CardPadrao from "./cardPadrao"

export default function CardConversao() {
  return (
    <CardPadrao>
      {/* Topo do Card */}
      <div className = "flex flex-row justify-between items-center mb-6">
        <h2 className = "text-[16px] font-bold text-[#202735]">Itens e Conversão</h2>
        <span className = "bg-[#65BA69] text-[#FFFFFF] text-[12px] font-bold px-3 py-1 rounded-full">
          Ativo
        </span>
      </div>

      {/* Subtítulo */}
      <p className = "text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wide mb-2">
        Taxa de conversão
      </p>

      {/* Input */}
      <div className = "flex flex-row items-center w-full h-[45px] border border-[#E5E7EB] rounded-[8px] px-4 mb-2 bg-[#FFFFFF]">
        {/* Ícone de raio (SVG) */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[18px] h-[18px] text-[#8A8A8A] mr-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
        
        <input 
          type="number" 
          defaultValue="1.25" 
          className = "w-full h-full outline-none text-[16px] text-[#202735] font-medium bg-transparent"
        />
      </div>

      {/* Rodapé (descrição) */}
      <p className = "text-[12px] text-[#8A8A8A]">
        Defina a taxa multiplicadora do ciclo
      </p>
    </CardPadrao>
  )
}