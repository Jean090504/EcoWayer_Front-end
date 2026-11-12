import Ver from "../../assets/icons/ui/olho-categoria_individual.png"
import Editar from "../../assets/icons/ui/editar-categoria_individual.png"
import Apagar from "../../assets/icons/ui/lixo-categoria_individual.png"

const ROTULOS = { ativo: "Ativo", inativo: "Inativo", "em revisão": "Em Revisão" }
const CORES = {
  ativo: "bg-[#65BA69]",
  inativo: "bg-[#9A9A9A]",
  "em revisão": "bg-[#F5A623]",
}

export default function CardItem({ nome, pontos, status, imagem, onView, onEdit, onDelete }) {
  const chave = (status ?? "").toLowerCase()

  return (
    <div className="flex flex-row items-center border-b border-slate-100 px-1 py-4 transition hover:bg-green-50/30">

      {/* Coluna 1: ícone + nome */}
      <div className="flex w-[35%] flex-row items-center gap-3 px-4">
        {imagem ? <img src={imagem} alt="" onError={(e) => { e.currentTarget.style.display = "none" }} className="h-9 w-9 rounded-lg object-contain" /> : <div className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-[#7350B9] to-[#65BA69]" />}
        <span className="truncate text-sm font-bold text-slate-800">{nome}</span>
      </div>

      {/* Coluna 2: pontuação */}
      <div className="w-[20%] flex justify-center">
        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-[#65BA69]">
          {pontos} pts
        </span>
      </div>

      {/* Coluna 3: status */}
      <div className="w-[25%] flex justify-center">
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full text-white ${CORES[chave] ?? "bg-slate-400"}`}
        >
          {ROTULOS[chave] ?? status}
        </span>
      </div>

      {/* Coluna 4: ações */}
      <div className="flex w-[15%] flex-row justify-center gap-3">
        <button type="button" onClick={() => onView?.()} aria-label={`Visualizar ${nome}`} className="rounded-lg p-1.5 transition hover:bg-slate-100"><img src={Ver} alt="Visualizar" className="h-4 w-4" /></button>
        <button type="button" onClick={() => onEdit?.()} aria-label={`Editar ${nome}`} className="rounded-lg p-1.5 transition hover:bg-green-50"><img src={Editar} alt="Editar" className="h-4 w-4" /></button>
        <button type="button" onClick={() => onDelete?.()} aria-label={`Excluir ${nome}`} className="rounded-lg p-1.5 transition hover:bg-red-50"><img src={Apagar} alt="Excluir" className="h-4 w-4" /></button>
      </div>

    </div>
  )
}
