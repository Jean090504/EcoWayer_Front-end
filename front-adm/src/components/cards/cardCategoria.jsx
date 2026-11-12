import CardBase from "./cardBase"

export default function CardCategoria({ titulo, quantidade, imagem, onClick, onDelete }) {
  return (
<CardBase
  imagem={imagem}
  imagemTamanho="w-[56px] h-[56px] object-contain"
  margin="ml-4"
  botaoTexto="Ver Categoria"
  onClick={onClick}
  onDelete={onDelete}
>
      <p className="truncate text-base font-bold text-slate-800 sm:text-lg">{titulo}</p>

      <div className="flex flex-row items-center gap-2 text-sm text-slate-400">
        <p>Itens registrados</p>
        <span className="rounded-full border border-violet-100 bg-violet-50 px-2.5 py-0.5 text-sm font-bold text-[#7350B9]">
          {quantidade}
        </span>
      </div>
    </CardBase>
  )
}
