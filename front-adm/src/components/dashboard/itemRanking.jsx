import { useState } from "react"

export default function ItemRanking({ posicao, nome, pontos, variacao, isLast, fotoUrl }) {
  const [imagemComErro, setImagemComErro] = useState(false)
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
    <div className = {`flex shrink-0 items-center gap-3 py-3 ${!isLast ? "border-b border-slate-100" : ""}`}>
      
      {/* Número da Posição (só aparece pro Top 3) */}
      <div className = {`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold text-slate-700 ${corBolinha}`}>
        {posicao <= 3 ? posicao : ""}
      </div>

      {/* Foto ou Avatar com Inicial */}
      {fotoUrl && !imagemComErro ? (
        <img 
          src = {fotoUrl} 
          alt = {`Foto de ${nome}`} 
          onError = {() => setImagemComErro(true)}
          className = "h-10 w-10 rounded-full bg-gray-200 object-cover"
        />
      ) : (
        <div className = "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-600 text-lg font-bold text-white">
          {inicialNome}
        </div>
      )}
      
      {/* Nome e Pontos */}
      <div className = "flex flex-col flex-1">
        <span className = "truncate text-base font-semibold text-slate-700">{nome}</span>
        <span className = "text-sm font-medium text-slate-400">{Number(pontos || 0).toLocaleString("pt-BR")} pontos</span>
      </div>
      
      {/* Variação */}
      <span className = {`text-xs font-bold ${corVariacao}`}>{variacao}</span>
    </div>
  )
}
