import IconChamado from "../../assets/icons/ui/chamado-ia-icon.png"
import IconDenuncia from "../../assets/icons/ui/denuncia-icon.png"

export default function CardChamado({ alerta, onClick }) {
  const denuncia = Array.isArray(alerta.denuncia) && alerta.denuncia.length > 0
  const titulo = denuncia ? "Anúncio irregular" : "Atividade suspeita"
  const descricao = denuncia
    ? "Este anúncio apresenta conteúdo que pode estar em desacordo com as regras."
    : "A IA identificou uma possível violação das regras."

  return <article className="flex min-h-[126px] flex-col gap-4 rounded-xl bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:gap-6 sm:px-7">
    <img src={denuncia ? IconDenuncia : IconChamado} alt="" className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16" />
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">{titulo}</h2>
        {String(alerta.motivo || "").startsWith("[TESTE TCC]") && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">Teste TCC</span>}
      </div>
      <p className="mt-1 text-sm text-slate-600 sm:text-base">{descricao}</p>
      <p className="mt-1 truncate text-xs text-slate-400">#{alerta.id} · {alerta.anuncio?.[0]?.nome || "Anúncio não vinculado"}</p>
    </div>
    <button type="button" onClick={onClick} className="shrink-0 rounded-lg bg-[#7350B9] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6140a5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7350B9]">Verificar Anúncio</button>
  </article>
}
