import CardBotaoTabela from "./cardBotaoTabela.jsx"

export default function CardTabela({ corBolinha, categoria, pontosBase, condExcelente, condBom, condRegular }) {
  return (
    <div className = "w-full flex flex-row items-center justify-between py-4 px-4 border-b border-[#F3F4F6]">

      <div className = "flex flex-row items-center gap-2 w-[clamp(100px,12vw,150px)]">
        <div className = {`w-[10px] h-[10px] rounded-full shrink-0 ${corBolinha}`}></div>
        <span className = "text-[clamp(12px,0.8vw,16px)] font-medium text-[#202735]">{categoria}</span>
      </div>

      <span className = "w-[clamp(80px,8vw,100px)] text-center text-[clamp(12px,0.8vw,16px)] font-bold text-[#202735]">{pontosBase}</span>

      <div className = "w-[clamp(150px,20vw,250px)] flex flex-row justify-center items-center gap-2">
        <span className = "bg-[#E8F5E9] text-[#2E8B57] text-[clamp(10px,0.7vw,14px)] font-semibold px-2 py-1 rounded-[6px]">{condExcelente}</span>
        <span className = "bg-[#FFF8E1] text-[#B8860B] text-[clamp(10px,0.7vw,14px)] font-semibold px-2 py-1 rounded-[6px]">{condBom}</span>
        <span className = "bg-[#F3F4F6] text-[#6B7280] text-[clamp(10px,0.7vw,14px)] font-semibold px-2 py-1 rounded-[6px]">{condRegular}</span>
      </div>

      <div className = "w-[clamp(80px,8vw,100px)] flex flex-row justify-end items-center gap-3 pr-2">
        <CardBotaoTabela />
      </div>

    </div>
  )
}