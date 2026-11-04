import CardBase from "../cardBase"

import Megaphone from "../../../assets/icons/ui/chamado-ia-icon.png"
import { TriangleAlert } from "lucide-react"

export default function CardChamado({ titulo, descricao, tipo, onClick }) {
  return (
    <CardBase
      // Remove as props de imagem que não estão funcionando
      botaoTexto="Verificar Anúncio"
      onClick={onClick}
    >
      <div className="flex items-start gap-4 pl-2">
        {/* Renderiza o ícone diretamente aqui */}
        <div className="mt-1">
          {tipo === "ia" ? (
            <img src={Megaphone} alt="Ícone de megafone" className="w-[55px] h-[55px]" />
          ) : (
            <TriangleAlert className="w-[55px] h-[55px] text-[#F5A623]" strokeWidth={1.5} />
          )}
        </div>

        {/* Textos */}
        <div>
          <p className="font-semibold text-[clamp(18px,1.2vw,22px)] text-[#202735]">{titulo}</p>
          <p className="text-[clamp(16px,1.2vw,20px)] text-[#8A8A8A]">{descricao}</p>
        </div>
      </div>
    </CardBase>
  )
}