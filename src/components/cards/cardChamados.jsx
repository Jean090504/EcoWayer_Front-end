import CardBase from "./cardBase"

export default function CardChamado(){
  return (
    <CardBase 
      imagem = ""
      botaoTexto = "Verificar Anúncio"
    >
      <p className = "font-semibold text-[18px]">Anúncio irregular</p>
      <p className = "text-[16px]">Este anúncio apresenta...</p>
    </CardBase>
  )
}