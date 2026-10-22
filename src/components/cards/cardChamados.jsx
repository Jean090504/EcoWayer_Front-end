import CardBase from "./cardBase"

export default function CardChamado({ imagem, titulo, descricao }) {
  return (
    <CardBase
      imagem = {imagem}
      botaoTexto = "Verificar Anúncio"
    >
      <p className = "font-semibold text-[clamp(18px,1.2vw,22px)]">{titulo}</p>
      <p className = "text-[clamp(16px,1.2vw,20px)]">{descricao}</p>
    </CardBase>
  )
}