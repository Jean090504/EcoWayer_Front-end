import { BadgeCheck, Banknote, Gift } from "lucide-react"
import CardBase from "./cardBase"
import Botao from "../../ui/botao"

export default function CardSaldo({ saldo, valorReais, onResgatar }) {
  const reais = valorReais == null ? null : valorReais.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  return (
    <CardBase
      titulo="Saldo disponível"
      valor={saldo ?? "—"}
      destaque={
        <span className="inline-flex items-center gap-1 bg-[#4CAF50] text-white text-[11px] font-semibold rounded-full px-2 py-0.5">
          <BadgeCheck size={12} />
          Ativo
        </span>
      }
      rodape={
        <div className="flex">
          <Botao onClick={onResgatar} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4CAF50] py-3 text-[14px] font-semibold text-white cursor-pointer">
            <Gift size={18} />
            Resgatar
          </Botao>
        </div>
      }
    >
      <p className="flex items-center gap-2 text-[12px] text-[#3E4A3D]">
        <Banknote size={14} className="text-[#4CAF50]" />
        {reais ? <>Equivalente a <span className="font-semibold text-[#191C1E]">{reais}</span> em benefícios</> : "Valor em benefícios será calculado pelo catálogo"}
      </p>
    </CardBase>
  )
}
