import { useState, useEffect } from "react"
import { Search } from "lucide-react"

import BotaoPower from "../assets/icons/ui/button_power.png"
import BotaoReset from "../assets/icons/ui/button_reset.png"
import TabelaItens from "../components/tabela/tabelaItens.jsx"
import { buscarCategoria, alterarStatusCategoria } from "../services/categoriaService.js"
import ModalNovoItem from "../components/modal/ModalNovoItem.jsx"
import ModalDetalhesItem from "../components/modal/ModalDetalhesItem.jsx"
import ModalEditarItem from "../components/modal/ModalEditarItem.jsx"
import ModalExcluirItem from "../components/modal/ModalExcluirItem.jsx"
import ModalExcluirCategoria from "../components/modal/ModalExcluirCategoria.jsx"

const URL_IMAGENS = "http://localhost:8080"

function urlImagem(img) {
  if (!img) return ""
  return img.startsWith("http") ? img : `${URL_IMAGENS}/${img}`
}

export default function CategoriaIndividual({ categoriaId, aoVoltar }) {
  const [categoria, setCategoria] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  const [busca, setBusca] = useState("")
  const [status, setStatus] = useState("")

  const [modalAberto, setModalAberto] = useState(false)
  const [recarregar, setRecarregar] = useState(0)

  const [itemVisualizado, setItemVisualizado] = useState(null)
  const [itemEditando, setItemEditando] = useState(null)
  const [itemExcluindo, setItemExcluindo] = useState(null)
  const [excluindoCategoria, setExcluindoCategoria] = useState(false)
  const [alterandoStatus, setAlterandoStatus] = useState(false)

  const ativa = (categoria?.status ?? "ativo") === "ativo"

  async function alternarStatus() {
    const novo = ativa ? "inativo" : "ativo"

    if (ativa && !window.confirm("Desativar a categoria? Ela deixará de aparecer para novos anúncios.")) return

    try {
      setAlterandoStatus(true)
      setErro("")
      await alterarStatusCategoria(categoriaId, novo)
      setRecarregar((n) => n + 1)
    } catch (e) {
      setErro(e.message || "Não foi possível alterar o status.")
    } finally {
      setAlterandoStatus(false)
    }
  }

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true)
        setErro("")
        const dados = await buscarCategoria(categoriaId)
        if (!dados) setErro("Categoria não encontrada.")
        setCategoria(dados)
      } catch (e) {
        console.error(e)
        setErro("Não foi possível carregar a categoria.")
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [categoriaId, recarregar])

  const itens = Array.isArray(categoria?.itens) ? categoria.itens : []

  const itensFiltrados = itens.filter((i) => {
    const bateNome = (i.nome ?? "").toLowerCase().includes(busca.toLowerCase())
    const bateStatus = !status || (i.status ?? "").toLowerCase() === status
    return bateNome && bateStatus
  })

  function redefinir() {
    setBusca("")
    setStatus("")
  }

  return (
    <div>
      <button className="text-[#9A9A9A] pt-5 pl-6 cursor-pointer" onClick={aoVoltar}>
        ← Voltar para todas as Categorias
      </button>

      <div className="flex flex-col items-center justify-center gap-4 mt-5">
        <div className="flex flex-col w-[95%] min-h-[85vh]">

          {carregando && <p>Carregando...</p>}
          {erro && <p className="text-red-500">{erro}</p>}

          {categoria && (
            <>
              <div className="flex flex-row items-center justify-center bg-[#FFFFFF] min-h-[150px] gap-5 mb-2">
                {categoria.img && (
                  <img
                    src={urlImagem(categoria.img)}
                    alt=""
                    className="w-[56px] h-[56px] object-contain"
                  />
                )}
                <h1 className="text-[25px] font-bold">{categoria.nome}</h1>

                <div className="bg-[#7350B9] text-[#FFFFFF] rounded-[10px] text-[10px] w-[125px] h-[30px] flex items-center justify-center">
                  {itens.length} Itens registrados
                </div>

                <div
                  className={`${ativa ? "bg-[#65BA69]" : "bg-[#9CA3AF]"} text-[#FFFFFF] rounded-[10px] text-[10px] w-[105px] h-[30px] flex items-center justify-center`}
                >
                  {ativa ? "Categoria Ativa" : "Categoria Inativa"}
                </div>

                <button
                  onClick={() => setExcluindoCategoria(true)}
                  className="ml-auto bg-[#E43E42] text-[#FFFFFF] rounded-[10px] cursor-pointer text-[10px] w-[125px] h-[30px] flex items-center justify-center"
                >
                  excluir categoria
                </button>

                <button
                  onClick={() => setModalAberto(true)}
                  className="bg-[#65BA69] text-[#FFFFFF] rounded-[10px] cursor-pointer text-[10px] w-[125px] h-[30px] flex items-center justify-center"
                >
                  adicionar novo item
                </button>

                <button
                  onClick={alternarStatus}
                  disabled={alterandoStatus}
                  title={ativa ? "Desativar categoria" : "Ativar categoria"}
                  className="cursor-pointer mr-8 bg-[#D9D9D9] w-[30px] h-[30px] rounded-full items-center justify-center flex disabled:opacity-60"
                >
                  <img src={BotaoPower} alt="" />
                </button>
              </div>

              <div className="bg-[#FFFFFF] mb-10">
                <div className="flex flex-row items-center h-[70px]">
                  <div className="relative min-w-[180px] w-[20vw] ml-5">
                    <Search
                      size={12}
                      className="absolute left-4 top-1/2 -translate-y-1/2 shrink-0 text-[#334155]"
                    />
                    <input
                      className="border border-[#E2E8F0] rounded-[8px] bg-[#F8FAFC] text-[12px] placeholder:text-[#334155] px-3 py-0.5 pl-[35px] w-full h-[30px]"
                      type="search"
                      placeholder="Buscar Item"
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                    />
                  </div>

                  <select
                    className="border border-[#E2E8F0] rounded-[8px] bg-[#F8FAFC] text-[12px] text-[#334155] ml-3 h-[30px] w-[120px] px-1"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">Status (Todos)</option>
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                    <option value="em revisão">Em Revisão</option>
                  </select>

                  <button
                    onClick={redefinir}
                    className="flex flex-row items-center justify-center border border-[#E2E8F0] rounded-[8px] text-[12px] text-[#64748B] gap-1 w-[100px] h-[30px] ml-auto mr-4 cursor-pointer"
                  >
                    <img src={BotaoReset} alt="" />
                    Redefinir
                  </button>
                </div>

                <TabelaItens
                  itens={itensFiltrados}
                  total={itens.length}
                  aoVer={(id) => setItemVisualizado(id)}
                  aoEditar={(id) => setItemEditando(id)}
                  aoExcluir={(item) => setItemExcluindo(item)}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {modalAberto && (
        <ModalNovoItem
          categoriaId={categoriaId}
          aoFechar={() => setModalAberto(false)}
          aoSalvar={async () => {
            setModalAberto(false)
            setRecarregar((n) => n + 1) // refaz o fetch e a tabela atualiza sozinha
          }}
        />
      )}

      {itemVisualizado && (
        <ModalDetalhesItem
          itemId={itemVisualizado}
          aoFechar={() => setItemVisualizado(null)}
        />
      )}

      {itemEditando && (
        <ModalEditarItem
          itemId={itemEditando}
          categoriaId={categoriaId}
          aoFechar={() => setItemEditando(null)}
          aoSalvar={async () => {
            setItemEditando(null)
            setRecarregar((n) => n + 1)
          }}
        />
      )}

      {itemExcluindo && (
        <ModalExcluirItem
          item={itemExcluindo}
          aoFechar={() => setItemExcluindo(null)}
          aoExcluir={async () => {
            setItemExcluindo(null)
            setRecarregar((n) => n + 1)
          }}
        />
      )}

      {excluindoCategoria && categoria && (
        <ModalExcluirCategoria
          categoria={categoria}
          itens={itens}
          aoFechar={() => setExcluindoCategoria(false)}
          aoExcluir={async () => {
            setExcluindoCategoria(false)
            aoVoltar() // a categoria não existe mais, volta para a lista
          }}
        />
      )}
    </div>
  )
}