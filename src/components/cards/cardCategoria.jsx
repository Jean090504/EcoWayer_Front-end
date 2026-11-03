import CardBase from "./cardBase"

export default function CardCategoria({ titulo, quantidade, pontos, imagem, onClick }) {
  return (
    <CardBase
      imagem={imagem}
      botaoTexto="Ver Categoria"
      onClick={onClick}
    >
      <p className="font-semibold text-[18px]">{titulo}</p>

      <div className="flex flex-row items-center gap-3 text-[16px]">
        <p>Quantidade de itens registrados</p>
        <span className="border border-gray-300 rounded-md px-3 py-0.5 text-[#7350B9]">
          {quantidade}
        </span>
      </div>

      <div className="flex flex-row items-center gap-3 text-[16px] mt-1">
        <p>Pontos por categoria</p>
        <span className="border border-gray-300 rounded-md px-3 py-0.5 text-[#65BA69]">
          {pontos}
        </span>
      </div>
    </CardBase>
  )
}