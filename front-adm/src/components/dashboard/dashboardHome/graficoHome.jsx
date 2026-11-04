export default function GraficoHome() {
  return (
    <div className = "bg-[#FFFFFF] rounded-[25px] p-8 w-[60%] min-h-[425px] shadow-md flex flex-col justify-between">
      
      <div className = "flex flex-row justify-between items-start w-full mb-4">
        <div className = "flex flex-col">
          <h2 className = "text-[24px] font-bold text-[#202735]">Dashboard</h2>
          <p className = "text-[#8A8A8A] text-[14px]">Evolução dos pontos acumulados pelos usuários</p>
        </div>
        
        <button className = "flex flex-row items-center justify-between px-4 py-2 border border-[#E5E7EB] bg-[#FFFFFF] rounded-[10px] shadow-sm text-[16px] text-[#202735] w-[200px] cursor-pointer">
          Selecionar
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>

      <div className = "flex flex-col mt-2">
        <p className = "text-[20px] font-semibold text-[#202735]">Pontos acumulados</p>
        <p className = "text-[56px] font-bold text-[#202735] leading-none">12.840</p>
        <p className = "text-[16px] text-[#58A24D] font-medium mt-2">↑ +18% em relação ao mês anterior</p>
      </div>

      <div className = "flex flex-row items-stretch h-[220px] w-full gap-2 mt-6">
        <div className = "flex flex-col justify-between items-end pr-2 text-[12px] text-[#8C8C8C] font-medium border-r border-[#E5E7EB] w-[40px]">
          <span>15k</span><span>10k</span><span>5k</span><span>0</span>
        </div>

        <div className = "flex-1 flex flex-row items-end justify-between relative pb-2 border-b border-[#E5E7EB]">
          <div className = "absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className = "border-b border-[#F3F4F6] w-full"></div>
            <div className = "border-b border-[#F3F4F6] w-full"></div>
            <div className = "border-b border-[#F3F4F6] w-full"></div>
            <div className = "border-b border-[#E5E7EB] w-full"></div>
          </div>

          {[25, 45, 60, 55, 80, 70, 85, 90, 100].map((altura, index) => (
            <div key = {index} className = "relative h-full w-full flex flex-row justify-center items-end z-10">
              <div className = "relative w-full h-full flex flex-col justify-end items-center">
                <div className = "w-[100%] bg-[#58A24D]/10 absolute bottom-0" style = {{ height: `${altura}%` }}></div>
                <div className = "w-full h-[3px] bg-[#58A24D] absolute" style = {{ bottom: `${altura}%` }}></div>
                {index === 8 && (
                  <div className = "absolute -bottom-[6px] w-[12px] h-[12px] bg-[#58A24D] rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className = "flex flex-row justify-between w-full pl-[48px] mt-2 text-[12px] text-[#8C8C8C] font-medium">
        <span>01/05</span>
        <span>08/05</span>
        <span>15/05</span>
        <span>22/05</span>
        <span>31/05</span>
      </div>
      
    </div>
  )
}