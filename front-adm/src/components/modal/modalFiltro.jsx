export default function ModalFiltro({ modalAberto, onFechar, titulo, opcoes, selecionado, onSelecionar }) {
  return (
    <>
      {modalAberto && (
        <div className = "fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/35 p-4" onClick = {onFechar}>
          <div role="dialog" aria-modal="true" aria-label={titulo} className = "w-full max-w-[400px] rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl" onClick = {(e) => e.stopPropagation()}>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#65BA69]">Filtros</p>
            <h2 className = "mb-4 mt-1 text-xl font-extrabold tracking-tight text-slate-800">{titulo}</h2>

            <div className = "flex flex-col gap-2">
              {opcoes.map((opcao) => (
                <button
                  key = {opcao.valor}
                  onClick = {() => {
                    onSelecionar(opcao.valor)
                    onFechar()
                  }}
                  className = {`p-3 rounded-lg border text-left cursor-pointer ${
                    selecionado === opcao.valor ? "border-[#7350B9] bg-violet-50 font-bold text-[#7350B9]" : "border-slate-200 text-slate-600 hover:border-[#65BA69] hover:bg-green-50"
                  }`}
                >
                  {opcao.label}
                </button>
              ))}
            </div>

            <button onClick = {() => { onSelecionar(""); onFechar() }} className = "mt-4 text-sm text-[#6B7280] cursor-pointer">
              Limpar filtro
            </button>
          </div>
        </div>
      )}
    </>
  )
}
