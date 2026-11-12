export default function CardStatus({ titulo, valor, porcentagem, textoRodape, altura, accent = "green" }){
  const percentual = porcentagem == null ? "" : String(porcentagem)
  const negativo = percentual.startsWith("-")
  const corPorcentagem = negativo ? "text-[#E43E42]" : "text-[#58A24D]"
  const seta = negativo ? "↓" : "↑"

  return (
    <article className={`flex min-h-[156px] flex-col items-center justify-center gap-5 rounded-2xl border border-slate-100 border-t-4 bg-white p-5 text-center shadow-[0_8px_30px_rgba(31,41,55,0.05)] ${accent === "purple" ? "border-t-[#7350B9]" : "border-t-[#65BA69]"}`}>
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-400">{titulo}</p>
        {percentual && (
          <span className={`rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold ${corPorcentagem}`}>
            {seta} {percentual}
          </span>
        )}
      </div>
      <p className="text-5xl font-extrabold leading-none tracking-tight text-slate-900">{valor}</p>
      {textoRodape && <p className="mt-1 text-xs text-slate-400">{textoRodape}</p>}
    </article>
  )
}
