export default function ItemRanking({ posicao, nome, pontos, variacao, isLast, fotoUrl }) {
  // Define a cor da bolinha apenas para o Top 3
  const corBolinha = 
    posicao === 1 ? "bg-[#E8C888]" : 
    posicao === 2 ? "bg-[#D1D5DB]" : 
    posicao === 3 ? "bg-[#C59B76]" : "";

  // Define a cor da variação de pontos (verde positivo, cinza zero/negativo)
  const corVariacao = variacao.startsWith("+") ? "text-[#58A24D]" : "text-[#8A8A8A]";

  // Pega a primeira letra do nome para usar caso não tenha foto
  const inicialNome = nome ? nome.charAt(0).toUpperCase() : "?";

  return (
    <div className = {`flex flex-row shrink-0 items-center gap-6 py-4 ${!isLast ? "border-b border-[#E5E7EB]" : ""}`}>
      
      {/* Número da Posição (só aparece pro Top 3) */}
      <div className = {`w-[45px] h-[45px] rounded-full flex items-center justify-center text-[20px] font-bold text-[#202735] ${corBolinha}`}>
        {posicao <= 3 ? posicao : ""}
      </div>

      {/* Foto ou Avatar com Inicial */}
      {fotoUrl ? (
        <img 
          src = {fotoUrl} 
          alt = {`Foto de ${nome}`} 
          className = "w-[70px] h-[70px] rounded-full bg-gray-200 object-cover" 
        />
      ) : (
        <div className = "w-[70px] h-[70px] rounded-full bg-[#7350B9] flex items-center justify-center text-[24px] font-bold text-[#FFFFFF]">
          {inicialNome}
        </div>
      )}
      
      {/* Nome e Pontos */}
      <div className = "flex flex-col flex-1">
        <span className = "text-[18px] font-semibold text-[#202735]">{nome}</span>
        <span className = "text-[14px] text-[#8A8A8A] font-medium">Pontos: {pontos}</span>
      </div>
      
      {/* Variação */}
      <span className = {`text-[16px] font-medium ${corVariacao}`}>{variacao}</span>
    </div>
  )
}