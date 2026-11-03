import { useState, useEffect, useMemo } from "react"

import Titulo from "../components/ui/titulo.jsx"
import CardCategoria from "../components/cards/cardCategoria.jsx"
import InputBusca from "../components/ui/inputBusca.jsx"
import ModalFiltro from "../components/modal/modalFiltro.jsx"
import ModalAdicionarCategoria from "../components/modal/modalAdicionarCategoria.jsx"
import { listarCategorias } from "../services/categoriaService.js"

// ajuste para o endereço onde as imagens são servidas
const URL_IMAGENS = "http://localhost:8080"

export default function Categorias({ aoAbrirCategoria }) {
  const [modalAberto, setModalAberto] = useState(false)
  const [modalAdd, setModalAdd] = useState(false)

  const [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  const [busca, setBusca] = useState("")
  const [tipoSelecionado, setTipoSelecionado] = useState("")

  async function carregarCategorias() {
    try {
      setCarregando(true)
      setErro("")
      setCategorias(await listarCategorias())
    } catch (e) {
      setErro("Não foi possível carregar as categorias.")
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarCategorias()
  }, [])

  // tipos únicos tirados da própria resposta (usado no filtro e no modal)
  const tipos = useMemo(() => {
    const mapa = new Map()
    categorias.forEach((c) => mapa.set(c.id_tipo_categoria, c.tipo_categoria))
    return [...mapa].map(([id, nome]) => ({ valor: String(id), label: nome }))
  }, [categorias])

  // busca por nome + filtro por tipo
  const categoriasFiltradas = categorias.filter((c) => {
    const bateNome = c.nome.toLowerCase().includes(busca.toLowerCase())
    const bateTipo = !tipoSelecionado || String(c.id_tipo_categoria) === tipoSelecionado
    return bateNome && bateTipo
  })

  return (
    <div>
      <Titulo texto = "Categorias" />

      <div className = "flex flex-col items-center justify-center gap-4 mt-5">

        <div className = "flex flex-col w-[95%] h-[85vh]">

          {/* Barra de busca + botão adicionar */}
          <div className = "flex flex-row items-center w-full">
            <InputBusca
              placeholder = "Buscar categoria"
              valor = {busca}
              aoDigitar = {(e) => setBusca(e.target.value)}
              aoFiltrar = {() => setModalAberto(true)}
            />

            <button
              className = "bg-[#65BA69] text-[#FFFFFF] text-[clamp(18px,1.2vw,20px)] w-[clamp(200px,15vw,260px)] h-[clamp(50px,5vh,60px)] rounded-[10px] ml-auto cursor-pointer"
              onClick = {() => setModalAdd(true)}
            >
              Adicionar Categoria
            </button>
          </div>

          {/* Lista de categorias */}
          <div className = "mt-8 flex-1 min-h-0 space-y-4 overflow-y-auto overflow-x-hidden">
            {carregando && <p>Carregando...</p>}
            {erro && <p className = "text-red-500">{erro}</p>}
            {!carregando && !erro && categoriasFiltradas.length === 0 && (
              <p>Nenhuma categoria encontrada.</p>
            )}

            {categoriasFiltradas.map((categoria) => (
              <CardCategoria
                key = {categoria.id}
                titulo = {categoria.nome}
                quantidade = {categoria.itens.length}
                imagem = {`${URL_IMAGENS}/${categoria.img}`}
                onClick = {() => aoAbrirCategoria(categoria.id)}
              />
            ))}
          </div>
        </div>

        <ModalFiltro
          modalAberto = {modalAberto}
          onFechar = {() => setModalAberto(false)}
          titulo = "Filtrar Categorias"
          opcoes = {tipos}
          selecionado = {tipoSelecionado}
          onSelecionar = {setTipoSelecionado}
        />

        <ModalAdicionarCategoria
          modalAberto = {modalAdd}
          onFechar = {() => setModalAdd(false)}
          tipos = {tipos}
          aoCriar = {carregarCategorias}
        />

      </div>
    </div>
  )
}