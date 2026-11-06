import { useState } from "react"

import CardPadrao from "./cardPadrao"
import IconValidador from "../../assets/icons/imagens/icon-validador.png"

const SetaSelect = () => (
  <div className = "absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
    <svg xmlns = "http://www.w3.org/2000/svg" fill = "none" viewBox = "0 0 24 24" strokeWidth = {2} stroke = "currentColor" className = "w-[clamp(14px,0.9vw,18px)] h-[clamp(14px,0.9vw,18px)] text-[#8A8A8A]">
      <path strokeLinecap = "round" strokeLinejoin = "round" d = "m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  </div>
)

const estiloSelect = "w-full h-[45px] border border-[#E5E7EB] rounded-[8px] px-4 bg-[#FFFFFF] text-[#202735] text-[clamp(14px,0.9vw,18px)] outline-none appearance-none cursor-pointer"

export default function CardValidador({ regras = [], taxa = 1 }) {
  const [regraId, setRegraId] = useState(null)
  const [condicaoNome, setCondicaoNome] = useState("Excelente")

  const regra = regras.find((r) => r.id === regraId) ?? regras[0]
  const condicao = regra?.condicao.find((c) => c.nome === condicaoNome)

  // base × condição × taxa de conversão (× bônus só se a campanha estiver ativa)
  const bonus = regra?.bonus_campanha_ativo ? 1 + regra.bonus_campanha_percentual / 100 : 1
  const pontos = regra && condicao
    ? Math.round(regra.pontos_base * condicao.multiplicador * taxa * bonus)
    : 0

  return (
    <CardPadrao>
      <div className = "flex flex-row items-center gap-3 mb-6">
        <div className = "bg-[#7350B9] w-[clamp(32px,2.5vw,40px)] h-[clamp(32px,2.5vw,40px)] rounded-[8px] flex items-center justify-center">
          <img src = {IconValidador} alt = "Ícone de Fórmula" className = "w-[clamp(18px,1.5vw,24px)] h-[clamp(18px,1.5vw,24px)]" />
        </div>
        <h2 className = "text-[clamp(16px,1vw,20px)] font-bold text-[#202735]">Validador de Fórmula</h2>
      </div>

      <p className = "text-[clamp(12px,0.8vw,16px)] font-bold text-[#8A8A8A] uppercase tracking-wide mb-2">
        Categoria selecionada
      </p>
      <div className = "relative w-full mb-5">
        <select
          value = {regra?.id ?? ""}
          onChange = {(e) => setRegraId(Number(e.target.value))}
          className = {estiloSelect}
        >
          {regras.map((r) => (
            <option key = {r.id} value = {r.id}>{r.categoria.nome}</option>
          ))}
        </select>
        <SetaSelect />
      </div>

      <p className = "text-[clamp(12px,0.8vw,16px)] font-bold text-[#8A8A8A] uppercase tracking-wide mb-2">
        Condição analisada
      </p>
      <div className = "relative w-full mb-6">
        <select
          value = {condicaoNome}
          onChange = {(e) => setCondicaoNome(e.target.value)}
          className = {estiloSelect}
        >
          {(regra?.condicao ?? []).map((c) => (
            <option key = {c.id} value = {c.nome}>{c.nome}</option>
          ))}
        </select>
        <SetaSelect />
      </div>

      <p className = "text-[clamp(12px,0.8vw,16px)] font-bold text-[#8A8A8A] uppercase tracking-wide mb-1">
        Pontos a receber
      </p>
      <p className = "text-[clamp(32px,2.5vw,40px)] font-bold text-[#7350B9] leading-none">
        {pontos}<span className = "text-[clamp(16px,1vw,20px)] font-semibold ml-1">pts</span>
      </p>
    </CardPadrao>
  )
}