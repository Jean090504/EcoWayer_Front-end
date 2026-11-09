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

  return <div className="min-h-full bg-[#f6f7fb] pb-12">
    <main className="mx-auto w-full max-w-[1600px] px-5 py-7 sm:px-8 lg:px-10">
      <header className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#65BA69]">Moderação</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">Chamados</h1>
          <p className="mt-2 text-sm text-slate-500">Revise alertas automáticos e denúncias pendentes.</p>
        </div>
        <div className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#65BA69]" /> {chamados.length} pendente{chamados.length === 1 ? "" : "s"}
        </div>
      </header>

      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_8px_30px_rgba(31,41,55,0.05)] sm:p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div><h2 className="text-base font-bold text-slate-800">Fila de moderação</h2><p className="mt-1 text-xs text-slate-400">Chamados aguardando uma decisão administrativa.</p></div>
          <InputBusca placeholder="Buscar denúncia ou alerta" value={busca} onChange={(e) => setBusca(e.target.value)} aoFiltrar={() => setModalAberto(true)} />
        </div>
        <div className="mt-5 flex flex-col gap-3">
          {carregando && <p className="rounded-xl bg-slate-50 p-6 text-sm text-slate-500">Carregando chamados...</p>}
          {erro && <p role="alert" className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">{erro}</p>}
          {!carregando && !erro && chamados.length === 0 && <p className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">Nenhum chamado pendente encontrado.</p>}
          {chamados.map((alerta) => <CardChamado key={alerta.id} alerta={alerta} onClick={() => aoAbrir(alerta)} />)}
        </div>
      </section>
    </main>
    <ModalFiltro modalAberto={modalAberto} onFechar={() => setModalAberto(false)} titulo="Filtrar Chamados" opcoes={[{ valor: "denuncia", label: "Denúncias" }, { valor: "ia", label: "Alertas" }]} selecionado={filtro} onSelecionar={setFiltro} />
  </div>
}
