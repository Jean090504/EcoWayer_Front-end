import { BadgeCheck, Banknote, Gift, Send } from "lucide-react"
import CardBase from "./cardBase"
import Botao from "../../ui/botao"

export default function CardSaldo({ saldo, valorReais, onResgatar, onTransferir }) {
  const reais = valorReais.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  return (
    <CardBase
      titulo="Saldo Disponível"
      valor={saldo}
      destaque={
        <span className="inline-flex items-center gap-1 bg-[#4CAF50] text-white text-[11px] font-semibold rounded-full px-2 py-0.5">
          <BadgeCheck size={12} />
          Ativo
        </span>
      }
      rodape={
        <div className="flex gap-3">
          <Botao onClick={onResgatar} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#4CAF50] py-3 text-[14px] font-semibold text-white cursor-pointer">
            <Gift size={18} />
            Resgatar
          </Botao>
          <Botao onClick={onTransferir} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#724BC2] py-3 text-[14px] font-semibold text-white cursor-pointer">
            <Send size={18} />
            Transferir
          </Botao>
        </div>
      }
    >
      <p className="flex items-center gap-2 text-[12px] text-[#3E4A3D]">
        <Banknote size={14} className="text-[#4CAF50]" />
        Equivalente a <span className="font-semibold text-[#191C1E]">{reais}</span> em benefícios
      </p>
    </CardBase>
  )
}