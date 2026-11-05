import { useEffect, useMemo, useState } from "react"

import Titulo from "../components/ui/titulo.jsx"
import CardChamado from "../components/cards/cardChamados.jsx"
import InputBusca from "../components/ui/inputBusca.jsx"
import ModalFiltro from "../components/modal/modalFiltro.jsx"
import ChamadoIndividual from "./ChamadoIndividual.jsx"
import { listarAlertas } from "../services/alertas.js"

// pendentes primeiro, depois id decrescente (mais recentes no topo)
const ordenar = (a, b) => {
  if (a.status === "PENDENTE" && b.status !== "PENDENTE") return -1
  if (a.status !== "PENDENTE" && b.status === "PENDENTE") return 1
  return b.id - a.id
}

export default function Chamados() {
  const [modalAberto, setModalAberto] = useState(false)
  const [alertas, setAlertas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [busca, setBusca] = useState("")
  const [filtro, setFiltro] = useState("") // "", "opcao1" (denúncias), "opcao2" (alertas)
  const [selecionado, setSelecionado] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function carregar() {
      try {
        setCarregando(true)
        setErro(null)
        setAlertas(await listarAlertas(controller.signal))
      } catch (e) {
        if (e.name !== "AbortError") setErro(e.message)
      } finally {
        setCarregando(false)
      }
    }

    carregar()
    return () => controller.abort()
  }, [])

  const chamados = useMemo(() => {
    // por enquanto só existem alertas (IA); denúncias entram aqui quando tiver o endpoint
    const lista = filtro === "opcao1" ? [] : alertas
    const termo = busca.trim().toLowerCase()

    return [...lista]
      .filter(a =>
        !termo ||
        a.motivo?.toLowerCase().includes(termo) ||
        a.usuario?.nome?.toLowerCase().includes(termo) ||
        a.acao?.toLowerCase().includes(termo) ||
        String(a.id).includes(termo)
      )
      .sort(ordenar)
  }, [alertas, busca, filtro])

  // tela de detalhe (substitui a listagem enquanto houver um alerta selecionado)
  if (selecionado) {
    return (
      <ChamadoIndividual
        alerta={selecionado}
        aoVoltar={() => setSelecionado(null)}
        aoAtualizar={(atualizado) => {
          setAlertas(lista => lista.map(a => (a.id === atualizado.id ? atualizado : a)))
          setSelecionado(atualizado)
        }}
      />
    )
  }

  return (
    <div>
      <Titulo texto="Chamados" />

      <div className="flex flex-col items-center justify-center mt-5">
        <div className="flex flex-col w-[95%] h-[85vh]">

          <InputBusca
            placeholder="Buscar denúncia ou alerta"
            valor={busca}
            onChange={setBusca}
            aoFiltrar={() => setModalAberto(true)}
          />

          <div className="mt-8 flex-1 min-h-0 space-y-4 overflow-y-auto overflow-x-hidden pr-1">
            {carregando && (
              <p className="text-center text-gray-500 mt-10">Carregando chamados...</p>
            )}

            {erro && !carregando && (
              <p className="text-center text-red-600 mt-10">{erro}</p>
            )}

            {!carregando && !erro && chamados.length === 0 && (
              <p className="text-center text-gray-500 mt-10">Nenhum chamado encontrado.</p>
            )}

            {!carregando && !erro && chamados.map(alerta => (
              <CardChamado
                key={`alerta-${alerta.id}`}
                tipo="ia"
                titulo={`Alerta #${alerta.id}`}
                descricao={alerta.motivo}
                status={alerta.status}
                acao={alerta.acao}
                usuario={alerta.usuario?.nome}
                origem={alerta.ia?.nome}
                botaoTexto={alerta.status === "PENDENTE" ? "Revisar Alerta" : "Ver Detalhes"}
                onClick={() => setSelecionado(alerta)}
              />
            ))}
          </div>
        </div>

        <ModalFiltro
          modalAberto={modalAberto}
          onFechar={() => setModalAberto(false)}
          titulo="Filtrar Chamados"
          opcoes={[
            { valor: "opcao1", label: "Denúncias" },
            { valor: "opcao2", label: "Alertas" }
          ]}
          selecionado={filtro}
          onSelecionar={(valor) => {
            setFiltro(prev => (prev === valor ? "" : valor)) // clicar de novo limpa
            setModalAberto(false)
          }}
        />
      </div>
    </div>
  )
}