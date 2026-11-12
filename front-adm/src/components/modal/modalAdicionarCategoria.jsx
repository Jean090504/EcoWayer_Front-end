import { useState } from "react"
import { criarCategoria } from "../../services/categoriaService.js"
import { uploadImagem } from "../../services/claudnaryService.js"

export default function ModalAdicionarCategoria({ modalAberto, onFechar, tipos = [], aoCriar }) {
  const [nome, setNome] = useState("")
  const [pontos, setPontos] = useState("")
  const [tipo, setTipo] = useState("")
  const [arquivo, setArquivo] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState("")

  function fechar() {
    setNome("")
    setPontos("")
    setTipo("")
    setArquivo(null)
    setErro("")
    onFechar()
  }

  async function salvar() {
    if (!nome.trim() || !tipo || pontos === "" || Number(pontos) < 0) {
      setErro("Preencha nome, pontos e tipo da categoria.")
      return
    }

try {
  setEnviando(true)
  setErro("")

  let linkImagem = null

  if (arquivo) {
    try {
      linkImagem = await uploadImagem(arquivo)
    } catch (e) {
      console.log("ERRO NO UPLOAD:", e)
      setErro("Falha no upload da imagem: " + e.message)
      return
    }
  }

  try {
    await criarCategoria({
      nome: nome.trim(),
      pontos: Number(pontos),
      id_tipo_categoria: Number(tipo),
      img: linkImagem
    })
  } catch (e) {
    console.log("ERRO NA API:", e)
    setErro("Falha ao salvar na API: " + e.message)
    return
  }

  await aoCriar()
  fechar()
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
          <label className = "w-[200px] h-[200px] shrink-0 border-2 border-dashed border-[#E5E7EB] rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#F9FAFB] overflow-hidden">
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

          {/* Campos */}
          <div className = "flex flex-col flex-1">
            <label className = "text-sm font-medium text-gray-700">Nome da Categoria</label>
            <input
              type = "text"
              placeholder = "Digite o nome da categoria"
              value = {nome}
              onChange = {(e) => setNome(e.target.value)}
              className = "border border-gray-300 rounded-md py-2 px-3 mb-4"
            />

            <label className = "text-sm font-medium text-gray-700">Pontos da Categoria</label>
            <input
              type = "number"
              min = "0"
              placeholder = "Ex: 10"
              value = {pontos}
              onChange = {(e) => setPontos(e.target.value)}
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