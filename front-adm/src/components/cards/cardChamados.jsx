import IconChamado from "../../assets/icons/ui/chamado-ia-icon.png"
import IconDenuncia from "../../assets/icons/ui/denuncia-icon.png"

export default function CardChamado({ alerta, onClick }) {
  const denuncia = Array.isArray(alerta.denuncia) && alerta.denuncia.length > 0
  const titulo = denuncia ? "Anúncio irregular" : "Atividade suspeita"
  const descricao = denuncia
    ? "Este anúncio apresenta conteúdo que pode estar em desacordo com as regras."
    : "A IA identificou uma possível violação das regras."

  return <article className={`flex min-h-[126px] flex-col gap-4 rounded-2xl border border-slate-100 border-l-4 bg-white px-5 py-5 shadow-[0_6px_24px_rgba(31,41,55,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(31,41,55,0.08)] sm:flex-row sm:items-center sm:gap-5 sm:px-6 ${denuncia ? "border-l-red-600" : "border-l-amber-500"}`}>
    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${denuncia ? "bg-red-50" : "bg-amber-50"}`}>
      {denuncia ? (
        <span
          aria-hidden="true"
          className="block h-9 w-9 bg-red-600"
          style={{
            maskImage: `url(${IconDenuncia})`,
            maskPosition: "center",
            maskRepeat: "no-repeat",
            maskSize: "contain",
            WebkitMaskImage: `url(${IconDenuncia})`,
            WebkitMaskPosition: "center",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
          }}
        />
      ) : (
        <span
          aria-hidden="true"
          className="block h-9 w-9 bg-amber-500"
          style={{
            maskImage: `url(${IconChamado})`,
            maskPosition: "center",
            maskRepeat: "no-repeat",
            maskSize: "contain",
            WebkitMaskImage: `url(${IconChamado})`,
            WebkitMaskPosition: "center",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
          }}
        />
      )}
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-base font-bold text-slate-800 sm:text-lg">{titulo}</h2>
      </div>
      <p className="mt-1 text-sm text-slate-600 sm:text-base">{descricao}</p>
    </div>
    <button type="button" onClick={onClick} className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 ${denuncia ? "bg-red-600 hover:bg-red-700 focus-visible:outline-red-600" : "bg-amber-500 hover:bg-amber-600 focus-visible:outline-amber-500"}`}>Verificar chamado</button>
  </article>
}
