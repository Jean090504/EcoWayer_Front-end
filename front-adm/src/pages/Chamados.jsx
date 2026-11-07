import { useEffect, useMemo, useState } from "react"
import CardChamado from "../components/cards/cardChamados.jsx"
import InputBusca from "../components/ui/inputBusca.jsx"
import ModalFiltro from "../components/modal/modalFiltro.jsx"
import { listarAlertas } from "../services/alertasService.js"

export default function Chamados({ aoAbrir }) {
  const [alertas, setAlertas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [busca, setBusca] = useState("")
  const [filtro, setFiltro] = useState("")
  const [modalAberto, setModalAberto] = useState(false)

  useEffect(() => {
    let ativo = true
    listarAlertas()
      .then((dados) => { if (ativo) setAlertas(dados) })
      .catch((e) => { if (ativo) setErro(e.message || "Não foi possível carregar os chamados.") })
      .finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [])

  const chamados = useMemo(() => alertas.filter((alerta) => {
    if (String(alerta.status).toUpperCase() !== "PENDENTE") return false
    const denuncia = Array.isArray(alerta.denuncia) && alerta.denuncia.length > 0
    if (filtro === "denuncia" && !denuncia) return false
    if (filtro === "ia" && denuncia) return false
    const texto = [alerta.motivo, alerta.anuncio?.[0]?.nome, alerta.usuario?.nome, alerta.id].join(" ").toLocaleLowerCase("pt-BR")
    return texto.includes(busca.trim().toLocaleLowerCase("pt-BR"))
  }), [alertas, busca, filtro])

  return <div className="min-h-screen px-4 pb-12 pt-2 sm:px-7 lg:px-10">
    <h1 className="pt-5 text-3xl font-bold text-slate-900 sm:text-4xl">Chamados</h1>
    <div className="mt-5 max-w-[1320px]">
      <InputBusca placeholder="Buscar denúncia ou alerta" value={busca} onChange={(e) => setBusca(e.target.value)} aoFiltrar={() => setModalAberto(true)} />
      <div className="mt-7 flex flex-col gap-4">
        {carregando && <p className="rounded-xl bg-white p-6 text-slate-500">Carregando chamados...</p>}
        {erro && <p role="alert" className="rounded-xl bg-red-50 p-6 text-red-700">{erro}</p>}
        {!carregando && !erro && chamados.length === 0 && <p className="rounded-xl bg-white p-8 text-center text-slate-500">Nenhum chamado pendente encontrado.</p>}
        {chamados.map((alerta) => <CardChamado key={alerta.id} alerta={alerta} onClick={() => aoAbrir(alerta)} />)}
      </div>
    </div>
    <ModalFiltro modalAberto={modalAberto} onFechar={() => setModalAberto(false)} titulo="Filtrar Chamados" opcoes={[{ valor: "denuncia", label: "Denúncias" }, { valor: "ia", label: "Alertas" }]} selecionado={filtro} onSelecionar={setFiltro} />
  </div>
}
