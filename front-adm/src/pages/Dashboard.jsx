import { useEffect, useState } from "react"
import GraficoCss from "../components/descartavel/graficoCss.jsx"
import RankingPontos from "../components/dashboard/rankingPontos.jsx"
import { apiFetch } from "../services/api.js"

const vazio = {
  usuariosAtivosHoje: 0,
  usuariosCadastrados: 0,
  usuariosTotal: 0,
  anunciosAtivos: 0,
  denunciasNoMes: 0,
  giftCardsResgatados: 0,
  beneficiosResgatados: 0,
  pontosGastos: 0,
  variacoes: {},
  evolucao: [],
  evolucaoPontos: [],
  ranking: [],
}
const metricasVazias = {
  itensValidados: 0,
  pontosGerados: 0,
  regrasAtivas: 0,
  taxaConversao: 1,
}

const periodos = [
  { id: "diario", label: "Hoje" },
  { id: "semanal", label: "7 dias" },
  { id: "mensal", label: "Este mês" },
]

const formatarNumero = (valor) => Number(valor || 0).toLocaleString("pt-BR")

function KpiCard({ titulo, valor, accent = "green", carregando }) {
  return (
    <article className={`flex min-h-[156px] flex-col items-center justify-center gap-5 rounded-2xl border border-slate-100 border-t-4 bg-white p-5 text-center shadow-[0_8px_30px_rgba(31,41,55,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(31,41,55,0.09)] ${accent === "purple" ? "border-t-[#7350B9]" : "border-t-[#65BA69]"}`}>
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-400">{titulo}</p>
      <p className="text-5xl font-extrabold leading-none tracking-tight text-slate-900">{carregando ? "—" : valor}</p>
    </article>
  )
}

function ProgressMetric({ label, value, max, color = "bg-violet-500" }) {
  const percentual = Math.min(100, max > 0 ? (Number(value || 0) / max) * 100 : 0)
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <strong className="text-slate-800">{formatarNumero(value)}</strong>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${percentual}%` }} />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [dados, setDados] = useState(vazio)
  const [metricas, setMetricas] = useState(metricasVazias)
  const [periodo, setPeriodo] = useState("semanal")
  const [graficoPeriodo, setGraficoPeriodo] = useState("30d")
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  const carregarDashboard = () => {
    setCarregando(true)
    setErro("")
    apiFetch(`/pontos/dashboard?period=${periodo}&grafico=${graficoPeriodo}`)
      .then((resposta) => {
        setDados({ ...vazio, ...(resposta.response?.dashboard || {}) })
        const valores = resposta.response?.metricas || {}
        setMetricas({
          itensValidados: valores.itensValidados?.valor ?? 0,
          pontosGerados: valores.pontosGerados?.valor ?? 0,
          regrasAtivas: valores.regrasAtivas?.valor ?? 0,
          taxaConversao: valores.taxaConversao?.valor ?? 1,
        })
      })
      .catch((error) => setErro(error.message || "Não foi possível carregar o dashboard."))
      .finally(() => setCarregando(false))
  }

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro("")
    apiFetch(`/pontos/dashboard?period=${periodo}&grafico=${graficoPeriodo}`)
      .then((resposta) => {
        if (!ativo) return
        setDados({ ...vazio, ...(resposta.response?.dashboard || {}) })
        const valores = resposta.response?.metricas || {}
        setMetricas({
          itensValidados: valores.itensValidados?.valor ?? 0,
          pontosGerados: valores.pontosGerados?.valor ?? 0,
          regrasAtivas: valores.regrasAtivas?.valor ?? 0,
          taxaConversao: valores.taxaConversao?.valor ?? 1,
        })
      })
      .catch((error) => {
        if (ativo) setErro(error.message || "Não foi possível carregar o dashboard.")
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })
    return () => { ativo = false }
  }, [periodo, graficoPeriodo])

  const totalUsuarios = Math.max(Number(dados.usuariosTotal || dados.usuariosCadastrados || 0), 1)
  return (
    <div className="min-h-full bg-[#f6f7fb] pb-10">
      <main className="mx-auto w-full max-w-[1600px] px-5 pb-10 pt-7 sm:px-8 lg:px-10">
        <section className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-600">Visão geral</p>
            <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl">Dashboard</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              {periodos.map((item) => (
                <button key={item.id} type="button" onClick={() => setPeriodo(item.id)} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${periodo === item.id ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}>
                  {item.label}
                </button>
              ))}
            </div>
            <button type="button" onClick={carregarDashboard} disabled={carregando} className="flex h-11 items-center rounded-xl border border-slate-200 bg-white px-5 text-base font-bold text-slate-600 shadow-sm transition hover:border-violet-200 hover:text-violet-600 disabled:cursor-wait disabled:opacity-60" title="Atualizar dados">
              <span>{carregando ? "Carregando…" : "Atualizar"}</span>
            </button>
          </div>
        </section>

        {erro && <p role="alert" className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">{erro}</p>}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard titulo="Usuários ativos" valor={formatarNumero(dados.usuariosAtivosHoje)} accent="purple" carregando={carregando} />
          <KpiCard titulo="Anúncios publicados" valor={formatarNumero(dados.anunciosAtivos)} accent="green" carregando={carregando} />
          <KpiCard titulo="Denúncias registradas" valor={formatarNumero(dados.denunciasNoMes)} accent="purple" carregando={carregando} />
          <KpiCard titulo="Pontos gerados" valor={formatarNumero(metricas.pontosGerados)} accent="green" carregando={carregando} />
        </section>

        <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <KpiCard titulo="Gift cards resgatados" valor={formatarNumero(dados.giftCardsResgatados)} accent="purple" carregando={carregando} />
          <KpiCard titulo="Pontos gastos" valor={formatarNumero(dados.pontosGastos)} accent="purple" carregando={carregando} />
        </section>

        <section className="mt-6 grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1.65fr)_minmax(360px,0.9fr)]">
          <GraficoCss dados={dados.evolucaoPontos} periodo={graficoPeriodo} onPeriodoChange={setGraficoPeriodo} />
          <RankingPontos usuarios={dados.ranking} filtroAtivo={periodo} carregando={carregando} />
        </section>

        <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(31,41,55,0.05)]">
            <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Saúde da comunidade</p><h2 className="mt-1 text-xl font-bold text-slate-800">Engajamento dos usuários</h2></div>
            <div className="space-y-5"><ProgressMetric label="Usuários ativos no período" value={dados.usuariosAtivosHoje} max={totalUsuarios} color="bg-emerald-500" /><ProgressMetric label="Base total de usuários" value={dados.usuariosTotal} max={Math.max(totalUsuarios, 1)} color="bg-violet-500" /></div>
          </article>
          <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(31,41,55,0.05)]">
            <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Impacto EcoWayer</p><h2 className="mt-1 text-xl font-bold text-slate-800">Resumo de sustentabilidade</h2></div>
            <div className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-emerald-50 p-4"><p className="text-xs font-semibold text-emerald-700">Pontos distribuídos</p><p className="mt-2 text-2xl font-extrabold text-emerald-800">{formatarNumero(metricas.pontosGerados)}</p></div><div className="rounded-xl bg-sky-50 p-4"><p className="text-xs font-semibold text-sky-700">Itens reconhecidos</p><p className="mt-2 text-2xl font-extrabold text-sky-800">{formatarNumero(metricas.itensValidados)}</p></div></div>
          </article>
        </section>
      </main>
    </div>
  )
}
