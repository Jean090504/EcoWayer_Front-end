import IconChamado from "../../assets/icons/ui/chamado-ia-icon.png"
import IconDenuncia from "../../assets/icons/ui/denuncia-icon.png"
import { textosVinculadosAoAlerta } from "../../services/alertasService.js"

export default function CardChamado({ alerta, onClick }) {
  const denuncia = alerta.denuncia?.[0]
  const anuncio = alerta.anuncio?.[0]
  const mensagens = textosVinculadosAoAlerta(alerta)
  const titulo = denuncia
    ? (anuncio ? "Denúncia de anúncio" : mensagens.length ? "Denúncia de mensagem" : "Denúncia recebida")
    : "Atividade suspeita"
  const descricao = denuncia?.descricao?.trim() || alerta.motivo?.trim()
  const referencias = [`#${alerta.id}`, denuncia?.tipo_denuncia?.tipo, anuncio?.nome].filter(Boolean)

  return <article className={`flex min-h-[126px] flex-col gap-4 rounded-2xl border border-slate-100 border-l-4 bg-white px-5 py-5 shadow-[0_6px_24px_rgba(31,41,55,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(31,41,55,0.08)] sm:flex-row sm:items-center sm:gap-5 sm:px-6 ${denuncia ? "border-l-[#65BA69]" : "border-l-[#7350B9]"}`}>
    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${denuncia ? "bg-green-50" : "bg-violet-50"}`}>
      <img src={denuncia ? IconDenuncia : IconChamado} alt="" className="h-9 w-9 object-contain" />
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-base font-bold text-slate-800 sm:text-lg">{titulo}</h2>
      </div>
      {descricao && <p className="mt-1 whitespace-pre-wrap [overflow-wrap:anywhere] text-sm text-slate-600 sm:text-base">{descricao}</p>}
      {mensagens.length > 0 && (
        <ul aria-label="Mensagens vinculadas" className="mt-2 space-y-2">
          {mensagens.map((texto) => (
            <li key={texto} className="whitespace-pre-wrap rounded-lg bg-slate-50 px-3 py-2 [overflow-wrap:anywhere] text-sm text-slate-700">
              {texto}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 truncate text-xs text-slate-500">{referencias.join(" · ")}</p>
    </div>
    <button type="button" onClick={onClick} className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 ${denuncia ? "bg-[#65BA69] hover:bg-[#51a856] focus-visible:outline-[#65BA69]" : "bg-[#7350B9] hover:bg-[#6140a5] focus-visible:outline-[#7350B9]"}`}>Verificar chamado</button>
  </article>
}
