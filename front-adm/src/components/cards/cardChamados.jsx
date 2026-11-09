import IconChamado from "../../assets/icons/ui/chamado-ia-icon.png"
import IconDenuncia from "../../assets/icons/ui/denuncia-icon.png"

export default function CardChamado({ alerta, onClick }) {
  const denuncia = Array.isArray(alerta.denuncia) && alerta.denuncia.length > 0
  const titulo = denuncia ? "Anúncio irregular" : "Atividade suspeita"
  const descricao = denuncia
    ? "Este anúncio apresenta conteúdo que pode estar em desacordo com as regras."
    : "A IA identificou uma possível violação das regras."

  return <article className={`flex min-h-[126px] flex-col gap-4 rounded-2xl border border-slate-100 border-l-4 bg-white px-5 py-5 shadow-[0_6px_24px_rgba(31,41,55,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(31,41,55,0.08)] sm:flex-row sm:items-center sm:gap-5 sm:px-6 ${denuncia ? "border-l-[#65BA69]" : "border-l-[#7350B9]"}`}>
    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${denuncia ? "bg-green-50" : "bg-violet-50"}`}>
      <img src={denuncia ? IconDenuncia : IconChamado} alt="" className="h-9 w-9 object-contain" />
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-base font-bold text-slate-800 sm:text-lg">{titulo}</h2>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${denuncia ? "bg-green-50 text-[#65BA69]" : "bg-violet-50 text-[#7350B9]"}`}>{denuncia ? "Denúncia" : "Alerta IA"}</span>
      </div>
      <p className="mt-1 text-sm text-slate-600 sm:text-base">{descricao}</p>
      <p className="mt-1 truncate text-xs text-slate-400">#{alerta.id} · {alerta.anuncio?.[0]?.nome || "Anúncio não vinculado"}</p>
    </div>
    <button type="button" onClick={onClick} className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 ${denuncia ? "bg-[#65BA69] hover:bg-[#51a856] focus-visible:outline-[#65BA69]" : "bg-[#7350B9] hover:bg-[#6140a5] focus-visible:outline-[#7350B9]"}`}>Verificar chamado</button>
  </article>
}
