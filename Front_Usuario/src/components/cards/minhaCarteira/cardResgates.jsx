import { ShoppingBag } from "lucide-react"
import CardBase from "./cardBase"

export default function CardResgates({ total, cuponsConcluidos }) {
  return (
    <CardBase
      titulo="Resgates Efetuados"
      valor={total}
      destaque={
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#724BC2]">
          <ShoppingBag size={16} className="text-white" />
        </div>
      }
      rodape={
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-[#3E4A3D]">Cupons gerados</span>
          <span className="font-semibold text-[#724BC2]">
            {cuponsConcluidos} resgates concluídos
          </span>
        </div>
      }
    >
    </CardBase>
  )
}