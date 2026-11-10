import { Recycle, Factory, ShoppingBag, Bike, Award, MapPin, Store, ArrowLeftRight, Users } from "lucide-react"

const ICONES = {
  reciclagem: Recycle,
  metais: Factory,
  resgate: ShoppingBag,
  bicicleta: Bike,
  bonus: Award,
}

const ICONES_LOCAL = {
  entrega: MapPin,
  resgate: Store,
  venda: ArrowLeftRight,
  bonus: Users,
}

const FUNDO = {
  verde: "bg-[#4CAF50]",
  roxo: "bg-[#724BC2]",
}

// Cor da etiqueta de status (altere o hex aqui para mudar em todas)
const ETIQUETA = "bg-[#6FE07A] text-[#0B5D1E]"

const COR_STATUS = {
  Confirmado: ETIQUETA,
  Concluído: ETIQUETA,
  Creditado: ETIQUETA,
}

export default function CardTransacao({ transacao }) {
  const { tipo, icone, cor, titulo, status, local, quando, pontos, detalhe } = transacao

  const Icone = ICONES[icone]
  const IconeLocal = ICONES_LOCAL[tipo]

  let corPontos = "text-[#4CAF50]"
  if (pontos < 0) corPontos = "text-[#EF4444]"
  else if (tipo === "bonus") corPontos = "text-[#724BC2]"

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-[#F8F8F8] p-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${FUNDO[cor]}`}>
        <Icone size={20} className="text-white" />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="text-[14px] font-semibold text-[#191C1E]">{titulo}</p>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              COR_STATUS[status] ?? ETIQUETA
            }`}
          >
            {status}
          </span>
        </div>
        <p className="flex items-center gap-1.5 text-[12px] text-[#3E4A3D]">
          <IconeLocal size={12} />
          {local} • {quando}
        </p>
      </div>

      <div className="flex flex-col items-end">
        <p className={`text-[18px] font-bold ${corPontos}`}>
          {pontos > 0 ? "+" : ""}{pontos} pts
        </p>
        <p className="text-[12px] text-[#3E4A3D]">{detalhe}</p>
      </div>
    </div>
  )
}