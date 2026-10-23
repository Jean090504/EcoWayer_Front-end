export default function ModalFiltro({ modalAberto, onFechar }) {
    return (
      <>
        {modalAberto && (
          <div className = "fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className = "bg-white p-6 rounded-xl w-[400px]">
              <h2 className = "text-xl font-bold">Título do modal</h2>
              <p>Conteúdo do modal.</p>
  
              <button onClick = {onFechar}>
                Fechar
              </button>
            </div>
          </div>
        )}
      </>
    )
  }