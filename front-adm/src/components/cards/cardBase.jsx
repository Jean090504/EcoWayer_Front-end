export default function CardBase({ imagem, botaoTexto, children, onClick, onDelete, imagemTamanho = "w-auto h-auto", margin }) {
  return (
    <div className="group flex min-h-[112px] w-full flex-row items-center gap-4 rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-[0_6px_24px_rgba(31,41,55,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(31,41,55,0.08)] sm:px-5">

      {imagem ? <img src={imagem} alt="" onError={(e) => { e.currentTarget.style.display = "none" }} className={`${imagemTamanho} ${margin}`} /> : <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br from-[#7350B9] to-[#65BA69]" />}

      <div className="flex min-w-0 flex-col gap-1">
        {children}
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
      <button className="rounded-xl bg-[#7350B9] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#6140a5]" onClick={onClick}>
        {botaoTexto}
      </button>
      {onDelete && <button type="button" onClick={onDelete} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Excluir</button>}
      </div>

    </div>
  )
}
