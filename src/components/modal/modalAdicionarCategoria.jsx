export default function ModalAdicionarCategoria({ modalAberto, onFechar }) {
  return (
    <>
      {modalAberto && (
        <div className = "fixed inset-0 bg-black/50 flex items-center justify-center" onClick = {onFechar}>
          <div className = "bg-white p-6 rounded-xl w-[600px]" onClick = {(e) => e.stopPropagation()}>
            <h2 className = "text-xl font-bold mb-4">Adicionar Nova Categoria</h2>

            <div className = "flex flex-row gap-10">
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
                      className = "border border-gray-300 rounded-md py-2 px-3 mb-4"
                    />

                    <label className = "text-sm font-medium text-gray-700">
                        Tipo da Categoria
                    </label>
                <select className = "border border-gray-300 p-2 mb-4" value = "" onChange = {(e) => setTipo(e.target.value)}>
                        <option value = "">Selecionar</option>
                        <option value = "moveis">Móveis</option>
                        <option value = "materiais">Materiais</option>
                        <option value = "eletronicos">Eletrônicos</option>
                </select>
                </div>

                <div className = "flex row gap-6">
                  <button onClick = {onFechar} className = "w-[100px] h-[35px] border border-gray-300 rounded-[0.5rem] cursor-pointer">Cancelar</button>
                  <button className = "w-[200px] text-[#FFFFFF] bg-[#65BA69] rounded-[0.5rem] cursor-pointer">Adicionar Categoria</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}