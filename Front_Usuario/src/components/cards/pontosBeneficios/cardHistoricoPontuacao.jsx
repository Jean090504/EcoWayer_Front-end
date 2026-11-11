import { useEffect, useState } from "react"
import { History, ListFilter, ChevronDown } from "lucide-react"
import CardPontuacao from "./cardPontuacao"
import ModalFiltroTipo from "../../modal/modalFiltroTipo"
import { buscarHistoricoMock, POR_VEZ_MOCK } from "../../../mocks/mockHistorico"
import { USAR_MOCK } from "../../../mocks/mockBase"

export default function CardHistoricoPontuacao() {
  const [modalAberto, setModalAberto] = useState(false)
  const [tipo, setTipo] = useState("todos")
  const [quantidade, setQuantidade] = useState(POR_VEZ_MOCK)

  // Estados para os dados que virão do Mock/API
  const [pontuacoes, setPontuacoes] = useState([])
  const [totalTransacoes, setTotalTransacoes] = useState(0)
  const [tipos, setTipos] = useState([])

  useEffect(() => {
    let ativo = true

    async function carregar() {
      if (USAR_MOCK) {
        const dados = await buscarHistoricoMock()
        if (ativo) {
          setPontuacoes(dados.lista)
          setTotalTransacoes(dados.total)
          setTipos(dados.tipos)
        }
      } else {
        // TODO: fetch real, ex.: chamarApi("historico", {})
      }
    }

    carregar()
    return () => { ativo = false }
  }, [])

  const filtradas = pontuacoes.filter((p) => tipo === "todos" || p.tipo === tipo)
  const visiveis = filtradas.slice(0, quantidade)
  const temMais = quantidade < filtradas.length
  const tipoAtual = tipos.find((t) => t.id === tipo) || { label: "Carregando..." }

  function carregarMais() {
    setQuantidade(quantidade + POR_VEZ_MOCK)
  }
  
  function mudarTipo(id) {
    setTipo(id)
    setQuantidade(POR_VEZ_MOCK)
  }

  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[24px] font-bold text-[#191C1E]">
          <History size={22} className="text-[#4CAF50]" />
          Histórico Recente de Pontuação
        </h2>

        <button
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-semibold text-[#191C1E] cursor-pointer"
        >
          <ListFilter size={14} />
          {tipoAtual.label}
        </button>
      </div>

      <div className="mt-5 flex flex-col rounded-3xl bg-white">
        {visiveis.length === 0 && (
          <p className="py-10 text-center text-[13px] text-[#3E4A3D]">
            Nenhuma transação desse tipo.
          </p>
        )}

        {visiveis.map((p) => (
          <CardPontuacao key={p.id} pontuacao={p} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-[12px]">
        <p className="text-[#3E4A3D]">
          {tipo === "todos"
            ? `Exibindo ${visiveis.length} de ${totalTransacoes} transações registradas neste mês`
            : `Exibindo ${visiveis.length} de ${filtradas.length} transações do tipo "${tipoAtual.label}"`}
        </p>

        {temMais && (
          <button
            onClick={carregarMais}
            className="flex items-center gap-1 font-semibold text-[#4CAF50] cursor-pointer"
          >
            Carregar mais histórico
            <ChevronDown size={14} />
          </button>
        )}
      </div>

      <ModalFiltroTipo
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        opcoes={tipos}
        selecionado={tipo}
        onSelecionar={mudarTipo}
      />
    </section>
  )
}