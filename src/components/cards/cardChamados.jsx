import CardBase from "./cardBase"

export default function CardChamado(){
  return (
    <CardBase 
      imagem = ""
      botaoTexto = "Verificar Anúncio"
      largura = "w-[1050px]"
      altura = "h-[130px]"
    >
      <p className = "font-semibold text-[18px]">Anúncio irregular</p>
      <p className = "text-[16px]">Este anúncio apresenta...</p>
    </CardBase>
  )
}