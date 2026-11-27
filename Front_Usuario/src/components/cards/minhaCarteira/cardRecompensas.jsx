import { ExternalLink } from "lucide-react"
import CardRecompensa from "./cardRecompensa"

export default function CardRecompensas({ recompensas = [], onResgatar }) {

  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-2xl border border-[#EAE7EF] bg-white p-6 shadow-sm sm:p-7">
      <h2 className="text-[20px] font-semibold text-[#191C1E]">Recompensas em Destaque</h2>

      <div className="mt-5 flex flex-col gap-2">
        {recompensas.map((r) => (
          <CardRecompensa key={r.id} recompensa={r} onResgatar={onResgatar} />
        ))}
        {recompensas.length === 0 && <p className="py-4 text-center text-xs text-[#3E4A3D]">Nenhuma recompensa disponível.</p>}
      </div>

      <button type="button" onClick={onResgatar} className="mt-auto pt-6 flex items-center justify-center gap-2 text-[13px] font-semibold text-[#4CAF50] cursor-pointer">
        Ver todas as {recompensas.length} recompensas
        <ExternalLink size={14} />
      </button>
    </div>
  )
}
