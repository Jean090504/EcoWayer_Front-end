import { Recycle, HandHeart, ShoppingBag, BatteryCharging, MapPin, Store } from "lucide-react"

const ICONES = {
  reciclagem: Recycle,
  doacao: HandHeart,
  resgate: ShoppingBag,
  eletronicos: BatteryCharging,
}

const ICONES_LOCAL = {
  ecoponto: MapPin,
  loja: Store,
}

const FUNDO = {
  verde: "bg-[#4CAF50]",
  roxo: "bg-[#724BC2]",
}

export default function CardPontuacao({ pontuacao }) {
  const { icone, cor, tipoLocal, titulo, local, quando, pontos } = pontuacao

  const Icone = ICONES[icone]
  const IconeLocal = ICONES_LOCAL[tipoLocal]
  const positivo = pontos > 0

  return (
    <div className="flex items-center gap-4 border-b border-gray-100 px-6 py-4 last:border-b-0">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${FUNDO[cor]}`}>
        <Icone size={22} className="text-white" />
      </div>

      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-[15px] font-semibold text-[#191C1E]">{titulo}</p>
        <p className="flex items-center gap-1.5 text-[12px] text-[#3E4A3D]">
          <IconeLocal size={12} />
          {local} • {quando}
        </p>
      </div>

      <p className={`pr-2 text-[18px] font-bold ${positivo ? "text-[#4CAF50]" : "text-[#724BC2]"}`}>
        {positivo ? "+" : ""}{pontos} pts
      </p>
    </div>
  )
}