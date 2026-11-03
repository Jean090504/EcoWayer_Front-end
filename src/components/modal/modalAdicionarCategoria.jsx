import { useState } from "react"
import { criarCategoria } from "../../services/categoriaService.js"

export default function ModalAdicionarCategoria({ modalAberto, onFechar, tipos = [], aoCriar }) {
  const [nome, setNome] = useState("")
  const [tipo, setTipo] = useState("")
  const [arquivo, setArquivo] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState("")

  function fechar() {
    setNome("")
    setTipo("")
    setArquivo(null)
    setErro("")
    onFechar()
  }

  async function salvar() {
    if (!nome.trim() || !tipo) {
      setErro("Preencha o nome e o tipo da categoria.")
      return
    }

    try {
      setEnviando(true)
      setErro("")
      await criarCategoria({ nome: nome.trim(), id_tipo_categoria: tipo, arquivo })
      await aoCriar()   // recarrega a lista
      fechar()
    } catch (e) {
      setErro("Não foi possível criar a categoria.")
    } finally {
      setEnviando(false)
    }
  }

  if (!modalAberto) return null

  return (
    <div className = "fixed inset-0 bg-black/50 flex items-center justify-center" onClick = {fechar}>
      <div className = "bg-white p-6 rounded-xl w-[600px]" onClick = {(e) => e.stopPropagation()}>
        <h2 className = "text-xl font-bold mb-4">Adicionar Nova Categoria</h2>

        <div className = "flex flex-row gap-10">

          {/* Upload de imagem com preview */}
          <label className = "w-[200px] h-[200px] border-2 border-dashed border-[#E5E7EB] rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#F9FAFB] overflow-hidden">
            {arquivo ? (
              <img src = {URL.createObjectURL(arquivo)} alt = "Pré-visualização" className = "w-full h-full object-contain" />
            ) : (
              <span className = "text-[#8A8A8A] text-sm">+ Adicionar imagem</span>
            )}

            <input
              type = "file"
              accept = "image/*"
              onChange = {(e) => setArquivo(e.target.files[0])}
              className = "hidden"
            />
          </label>

          <div className = "flex flex-col flex-1">
            <label className = "text-sm font-medium text-gray-700">Nome da Categoria</label>
            <input
              type = "text"
              placeholder = "Digite o nome da categoria"
              value = {nome}
              onChange = {(e) => setNome(e.target.value)}
              className = "border border-gray-300 rounded-md py-2 px-3 mb-4"
            />

            <label className = "text-sm font-medium text-gray-700">Tipo da Categoria</label>
            <select
              className = "border border-gray-300 rounded-md p-2 mb-4"
              value = {tipo}
              onChange = {(e) => setTipo(e.target.value)}
            >
              <option value = "">Selecionar</option>
              {tipos.map((t) => (
                <option key = {t.valor} value = {t.valor}>{t.label}</option>
              ))}
            </select>

            {erro && <p className = "text-red-500 text-sm mb-2">{erro}</p>}

            <div className = "flex flex-row gap-6">
              <button
                onClick = {fechar}
                className = "w-[100px] h-[35px] border border-gray-300 rounded-[0.5rem] cursor-pointer"
              >
                Cancelar
              </button>

              <button
                onClick = {salvar}
                disabled = {enviando}
                className = "w-[200px] text-[#FFFFFF] bg-[#65BA69] rounded-[0.5rem] cursor-pointer disabled:opacity-60"
              >
                {enviando ? "Salvando..." : "Adicionar Categoria"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}