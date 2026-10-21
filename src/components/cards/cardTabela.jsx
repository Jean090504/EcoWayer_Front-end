export default function CardTabela({ corBolinha, categoria, pontosBase, condExcelente, condBom, condRegular }) {
  return (
    <div className = "flex flex-row items-center justify-between py-4 border-b border-[#F3F4F6] w-full hover:bg-gray-50 transition-colors px-4">
      
      <div className = "flex flex-row items-center gap-2 w-[150px]">
        <div className = {`w-[8px] h-[8px] rounded-full ${corBolinha}`}></div>
        <span className = "text-[14px] text-[#202735] font-medium">{categoria}</span>
      </div>

      <div className = "w-[100px] text-center text-[14px] text-[#8A8A8A] font-medium">
        {pontosBase}
      </div>

      <div className = "flex flex-row gap-2 justify-center w-[250px]">
        <span className = "bg-[#65BA69] text-[#FFFFFF] text-[12px] font-bold px-2 py-0.5 rounded-[4px] w-[45px] text-center">{condExcelente}</span>
        <span className = "bg-[#7350B9] text-[#FFFFFF] text-[12px] font-bold px-2 py-0.5 rounded-[4px] w-[45px] text-center">{condBom}</span>
        <span className = "bg-[#F5A623] text-[#FFFFFF] text-[12px] font-bold px-2 py-0.5 rounded-[4px] w-[45px] text-center">{condRegular}</span>
      </div>

      <div className = "w-[100px] flex justify-end">
        <button className = "bg-[#E43E42] text-[#FFFFFF] text-[12px] font-bold px-4 py-1.5 rounded-[6px] cursor-pointer hover:bg-red-600 transition-colors">
          Desativar
        </button>
      </div>

    </div>
  )
}