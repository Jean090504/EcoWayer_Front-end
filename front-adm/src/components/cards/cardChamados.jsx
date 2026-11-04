import CardBase from "./cardBase"
import IconChamado from "../../assets/icons/ui/chamado-ia-icon.png"
import IconDenuncia from "../../assets/icons/ui/denuncia-icon.png"

const icones = {
  ia: IconChamado,
  denuncia: IconDenuncia
}

export default function CardChamado({ titulo, descricao, tipo }) {
  return (
    <CardBase
      imagem = {icones[tipo]}
      imagemTamanho = "w-[65px] h-[60px]"
      margin = "ml-5"
      botaoTexto = "Verificar Anúncio"
    >
      <div className = "pl-2">
        <p className = "font-semibold text-[clamp(18px,1.2vw,22px)]">{titulo}</p>
        <p className = "text-[clamp(16px,1.2vw,20px)]">{descricao}</p>
      </div>
    </CardBase>
  )
}