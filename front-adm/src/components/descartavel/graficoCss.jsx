export default function GraficoCss() {
  // Dados fictícios (em porcentagem de altura para facilitar o CSS)
  // O mês 12 (Dez) é o maior, então ele será o 100% de altura.
  const dados = [
    { mes: "Jan", cad: "30%", at: "15%" },
    { mes: "Fev", cad: "33%", at: "18%" },
    { mes: "Mar", cad: "45%", at: "25%" },
    { mes: "Abr", cad: "50%", at: "23%" },
    { mes: "Mai", cad: "60%", at: "32%" },
    { mes: "Jun", cad: "65%", at: "40%" },
    { mes: "Jul", cad: "73%", at: "42%" },
    { mes: "Ago", cad: "73%", at: "44%" },
    { mes: "Set", cad: "73%", at: "46%" },
    { mes: "Out", cad: "82%", at: "50%" },
    { mes: "Nov", cad: "90%", at: "55%" },
    { mes: "Dez", cad: "100%", at: "52%" },
  ]

  return (
    <div className = "bg-[#FFFFFF] rounded-[25px] p-[clamp(16px,2vw,32px)] w-full min-h-[400px] shadow-md flex flex-col justify-between">
      
      <h2 className = "text-center text-[22px] font-semibold text-[#202735] mb-4">
        Usuários Ativos X Cadastrados
      </h2>
      
      <div className = "flex flex-row items-stretch h-[300px] w-full gap-2">
        
        {/* Eixo Y Esquerdo */}
        <div className = "flex flex-col justify-between items-end pr-2 text-[12px] text-[#8C8C8C] font-medium border-r border-[#E5E7EB] w-[50px]">
          <span>5000</span><span>4000</span><span>3000</span><span>2000</span><span>1000</span><span>0</span>
        </div>

        {/* Área do Gráfico */}
        <div className = "flex-1 flex flex-row items-end justify-between relative pb-2 border-b border-[#E5E7EB]">
          
          {/* Linhas Horizontais de fundo */}
          <div className = "absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className = "border-b border-[#F3F4F6] w-full"></div>
            <div className = "border-b border-[#F3F4F6] w-full"></div>
            <div className = "border-b border-[#F3F4F6] w-full"></div>
            <div className = "border-b border-[#F3F4F6] w-full"></div>
            <div className = "border-b border-[#F3F4F6] w-full"></div>
            <div className = "border-b border-[#E5E7EB] w-full"></div>
          </div>

          {/* Colunas de Dados */}
          {dados.map((item, index) => (
            <div key = {index} className = "flex flex-row items-end gap-1 relative h-full w-full justify-center group cursor-pointer">
              
              {/* Linha/Bolinha Cadastrados (Escura) */}
              <div className = "relative h-full w-[4px] bg-[#2F4F2F] flex flex-col justify-end items-center z-10" style = {{ height: item.cad }}>
                <div className = "w-[12px] h-[12px] bg-[#2F4F2F] rounded-full absolute -bottom-[6px]"></div>
              </div>

              {/* Linha/Bolinha Ativos (Clara e Tracejada) */}
              <div className = "relative h-full w-[4px] flex flex-col justify-end items-center z-10" 
                   style = {{ 
                     height: item.at, 
                     backgroundImage: 'linear-gradient(to bottom, #A3C9A3 50%, transparent 50%)', 
                     backgroundSize: '4px 10px' 
                   }}>
                <div className = "w-[12px] h-[12px] bg-[#A3C9A3] rounded-full absolute -bottom-[6px]"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Eixo Y Direito */}
        <div className = "flex flex-col justify-between items-start pl-2 text-[12px] text-[#8C8C8C] font-medium border-l border-[#E5E7EB] w-[50px]">
          <span>3000</span><span>2500</span><span>2000</span><span>1500</span><span>1000</span><span>0</span>
        </div>
      </div>

      {/* Nomes dos Meses (embaixo do gráfico) */}
      <div className = "flex flex-row justify-between w-full pl-[50px] pr-[50px] mt-2 text-[12px] text-[#202735] font-medium">
        {dados.map((item, index) => (
          <span key = {index}>{item.mes}</span>
        ))}
      </div>

      {/* Legenda */}
      <div className = "flex flex-row justify-center gap-8 mt-4 text-[14px] font-bold text-[#202735]">
        <div className = "flex items-center gap-2">
          <div className = "w-[30px] h-[10px] bg-[#2F4F2F]"></div>
          <span>Usuários Cadastrados</span>
        </div>
        <div className = "flex items-center gap-2">
          <div className = "w-[30px] h-[10px] border-2 border-dashed border-[#A3C9A3] bg-[#E8F3E8]"></div>
          <span>Usuários Ativos</span>
        </div>
      </div>

    </div>
  )
}