export default function ModalFiltro({ modalAberto, onFechar, titulo, opcoes, selecionado, onSelecionar }) {
  return (
    <>
      {modalAberto && (
        <div className = "fixed inset-0 z-[90] bg-[#b8c5e3]/65 flex items-center justify-center p-4" onClick = {onFechar}>
          <div role="dialog" aria-modal="true" aria-label={titulo} className = "bg-white p-6 rounded-xl w-full max-w-[400px] shadow-2xl" onClick = {(e) => e.stopPropagation()}>
            <h2 className = "text-xl font-bold mb-4">{titulo}</h2>

            <div className = "flex flex-col gap-2">
              {opcoes.map((opcao) => (
                <button
                  key = {opcao.valor}
                  onClick = {() => {
                    onSelecionar(opcao.valor)
                    onFechar()
                  }}
                  className = {`p-3 rounded-lg border text-left cursor-pointer ${
                    selecionado === opcao.valor ? "bg-[#EDE9FE] border-[#7350B9] font-bold" : "border-[#E5E7EB]"
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
