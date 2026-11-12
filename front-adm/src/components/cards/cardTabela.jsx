import TextoTabela from "../ui/textoTabela.jsx"

export default function CardTabela({ corBolinha, categoria, pontosBase, condExcelente, condBom, condRegular, ativo, onToggle, onEdit }) {
  return (
      <div className="group flex w-full flex-row items-center justify-between border-b border-slate-100 px-4 py-4 transition hover:bg-green-50/50">

      <div className="flex w-[clamp(100px,12vw,150px)] flex-row items-center gap-2">
        <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${corBolinha || "bg-slate-300"}`}></div>
        <span className="truncate text-base font-semibold text-slate-700">{categoria}</span>
      </div>

      <span className="w-[clamp(80px,8vw,100px)] text-center text-base font-extrabold text-slate-800">{pontosBase}</span>

      <div className="flex w-[clamp(150px,20vw,250px)] flex-row items-center justify-center gap-1.5">
        <TextoTabela texto={condRegular} corTexto="text-orange-700" background="bg-orange-100" />

        <TextoTabela texto={condBom} corTexto="text-purple-700" background="bg-purple-100" />

        <TextoTabela texto={condExcelente} corTexto="text-green-700" background="bg-green-100" />
      </div>

      <div className="flex w-[clamp(80px,8vw,100px)] flex-row items-center justify-end gap-3 pr-2">
        <button type="button" onClick={onEdit} className="rounded-lg px-2.5 py-1.5 text-sm font-bold text-[#65BA69] transition hover:bg-green-100">Editar</button>
      </div>

    </div>
  )
}
