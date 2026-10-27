export default function ModalAdicionarCategoria({ modalAberto, onFechar }) {
  return (
    <>
      {modalAberto && (
        <div className = "fixed inset-0 bg-black/50 flex items-center justify-center" onClick = {onFechar}>
          <div className = "bg-white p-6 rounded-xl w-[600px]" onClick = {(e) => e.stopPropagation()}>
            <h2 className = "text-xl font-bold mb-4">Adicionar Nova Categoria</h2>

            <div className = "flex flex-row">
            <label className = "w-[200px] h-[200px] border-2 border-dashed border-[#E5E7EB] rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#F9FAFB]">
                <span className = "text-[#8A8A8A] text-sm">+ Adicionar imagem</span>

                <input
                    type = "file"
                    accept = "image/*"
                    onChange = {(e) => setArquivo(e.target.files[0])}
                    className = "hidden"
                />
                </label>
                <div className = "flex flex-col gap-1">
                    <label className = "text-sm font-medium text-gray-700">
                        Nome da Categoria
                    </label>
                <div className = "flex flex-col">
                        <input
                            type = "text"
                            placeholder = "Digite o nome da categoria"
                            className = "border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}