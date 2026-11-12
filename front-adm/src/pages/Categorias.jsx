import { useState, useEffect, useMemo } from "react"

import CardCategoria from "../components/cards/cardCategoria.jsx"
import InputBusca from "../components/ui/inputBusca.jsx"
import ModalAdicionarCategoria from "../components/modal/modalAdicionarCategoria.jsx"
import { listarCategorias, excluirCategoria } from "../services/categoriaService.js"
import ModalExcluirCategoria from "../components/modal/ModalExcluirCategoria.jsx"

const URL_IMAGENS = "http://localhost:8080"

// monta a URL da imagem sem gerar ".../undefined"
function urlImagem(img) {
  if (!img) return ""
  if (img.includes("storage.ecowayer.test")) return ""
  return img.startsWith("http") ? img : `${URL_IMAGENS}/${img}`
}

export default function Categorias({ aoAbrirCategoria }) {
  const [modalAdd, setModalAdd] = useState(false)
  const [categoriaExcluir, setCategoriaExcluir] = useState(null)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState("")

  const [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  const [busca, setBusca] = useState("")

  async function carregarCategorias() {
    try {
      setCarregando(true)
      setErro("")
      const dados = await listarCategorias()
      setCategorias(Array.isArray(dados) ? dados : [])
    } catch (e) {
      console.error(e)
      setErro("Não foi possível carregar as categorias.")
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarCategorias()
  }, [])

  const tipos = useMemo(() => {
    const mapa = new Map()
    categorias.forEach((c) => {
      if (c.id_tipo_categoria != null) {
        mapa.set(c.id_tipo_categoria, c.tipo_categoria ?? "")
      }
    })
    return [...mapa].map(([id, nome]) => ({ valor: String(id), label: nome }))
  }, [categorias])

  const categoriasFiltradas = categorias.filter((c) => {
    const bateNome = (c.nome ?? "").toLowerCase().includes(busca.toLowerCase())
    return bateNome
  })

  async function confirmarExclusao(confirmado) {
    if (!confirmado) return setErroExclusao("Digite exatamente o texto solicitado para confirmar.")
    try { setExcluindo(true); await excluirCategoria(categoriaExcluir.id); setCategoriaExcluir(null); await carregarCategorias() }
    catch (e) { setErroExclusao(e.message || "Não foi possível excluir a categoria.") }
    finally { setExcluindo(false) }
  }

  return (
    <div className="min-h-full bg-[#f6f7fb] pb-10">
      <main className="mx-auto w-full max-w-[1600px] px-5 py-7 sm:px-8 lg:px-10">
          <header className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#65BA69]">Catálogo</p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">Categorias</h1>
            </div>
            <button className="w-fit rounded-xl bg-[#65BA69] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#51a856]" onClick={() => setModalAdd(true)}>Adicionar categoria</button>
          </header>

          <div className="flex w-full items-center">
            <InputBusca
              placeholder="Buscar categoria"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="mt-5 min-h-0 space-y-3 overflow-y-auto overflow-x-hidden">
            {carregando && <p className="rounded-2xl bg-white p-5 text-sm text-slate-500 shadow-sm">Carregando categorias...</p>}
            {erro && <p className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-500">{erro}</p>}
            {!carregando && !erro && categoriasFiltradas.length === 0 && (
              <p className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">Nenhuma categoria encontrada.</p>
            )}

            {categoriasFiltradas.map((categoria) => (
              <CardCategoria
                key={categoria.id}
                titulo={categoria.nome}
                quantidade={Array.isArray(categoria.itens) ? categoria.itens.length : 0}
                imagem={urlImagem(categoria.img)}
                onClick={() => aoAbrirCategoria?.(categoria.id)}
              />
            ))}
          </div>
        <ModalAdicionarCategoria
          modalAberto={modalAdd}
          onFechar={() => setModalAdd(false)}
          tipos={tipos}
          aoCriar={carregarCategorias}
        />
        {categoriaExcluir && <ModalExcluirCategoria categoria={categoriaExcluir} aoFechar={() => setCategoriaExcluir(null)} aoConfirmar={confirmarExclusao} salvando={excluindo} erro={erroExclusao} />}
      </main>
    </div>
  )
}
