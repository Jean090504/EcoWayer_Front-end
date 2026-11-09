import { useEffect, useMemo, useState } from "react"
import GraficoCss from "../components/descartavel/graficoCss.jsx"
import RankingPontos from "../components/dashboard/rankingPontos.jsx"
import { apiFetch } from "../services/api.js"

const vazio = {
  usuariosAtivosHoje: 0,
  usuariosCadastrados: 0,
  usuariosTotal: 0,
  anunciosAtivos: 0,
  denunciasNoMes: 0,
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

function KpiCard({ titulo, valor, variacao, legenda, carregando }) {
  const variacaoPositiva = String(variacao || "").startsWith("+")

  return (
    <article className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgba(31,41,55,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(31,41,55,0.09)]">
      <div className="flex min-h-6 items-start justify-end gap-3">
        {variacao && (
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${variacaoPositiva ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
            {variacao}
          </span>
        )}
      </div>
      <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-400">{titulo}</p>
      <p className="mt-1 text-3xl font-extrabold tracking-tight text-slate-800">{carregando ? "—" : valor}</p>
      <p className="mt-1 text-xs text-slate-400">{legenda}</p>
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
  const taxaAtivacao = Math.round((Number(dados.usuariosAtivosHoje || 0) / totalUsuarios) * 100)
  const periodoLabel = useMemo(() => periodos.find((item) => item.id === periodo)?.label || "Período", [periodo])

  return (
    <div className="min-h-full bg-[#f6f7fb] pb-10">
      <main className="mx-auto w-full max-w-[1600px] px-5 py-2 sm:px-8 lg:px-10">
        <section className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Visão geral</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">Dashboard</h1>
            <p className="mt-2 text-sm text-slate-500">Acompanhe os principais resultados da plataforma.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              {periodos.map((item) => (
                <button key={item.id} type="button" onClick={() => setPeriodo(item.id)} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${periodo === item.id ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}>
                  {item.label}
                </button>
              ))}
            </div>
            <button type="button" onClick={carregarDashboard} disabled={carregando} className="flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-violet-200 hover:text-violet-600 disabled:cursor-wait disabled:opacity-60" title="Atualizar dados">
              <span>{carregando ? "Carregando…" : "Atualizar"}</span>
            </button>
          </div>
        </section>

        {erro && <p role="alert" className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">{erro}</p>}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard titulo={`Usuários ativos · ${periodoLabel}`} valor={formatarNumero(dados.usuariosAtivosHoje)} variacao={dados.variacoes?.usuariosAtivosHoje} legenda="comparado ao período anterior" carregando={carregando} />
          <KpiCard titulo={`Novos usuários · ${periodoLabel}`} valor={formatarNumero(dados.usuariosCadastrados)} variacao={dados.variacoes?.usuariosCadastrados} legenda="cadastros no período selecionado" carregando={carregando} />
          <KpiCard titulo={`Anúncios publicados · ${periodoLabel}`} valor={formatarNumero(dados.anunciosAtivos)} variacao={dados.variacoes?.anunciosAtivos} legenda="publicados e ativos no período" carregando={carregando} />
          <KpiCard titulo={`Denúncias · ${periodoLabel}`} valor={formatarNumero(dados.denunciasNoMes)} variacao={dados.variacoes?.denunciasNoMes} legenda="acompanhe a moderação" carregando={carregando} />
        </section>

        <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard titulo="Pontos gerados" valor={formatarNumero(metricas.pontosGerados)} legenda="pontuação acumulada" carregando={carregando} />
          <KpiCard titulo="Itens validados" valor={formatarNumero(metricas.itensValidados)} legenda="registros de sustentabilidade" carregando={carregando} />
          <KpiCard titulo="Regras ativas" valor={formatarNumero(metricas.regrasAtivas)} legenda="regras de pontuação" carregando={carregando} />
          <KpiCard titulo="Multiplicador" valor={`${metricas.taxaConversao}x`} legenda="conversão de pontos atual" carregando={carregando} />
        </section>

        <section className="mt-6 grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1.65fr)_minmax(360px,0.9fr)]">
          <GraficoCss dados={dados.evolucaoPontos} periodo={graficoPeriodo} onPeriodoChange={setGraficoPeriodo} />
          <RankingPontos usuarios={dados.ranking} filtroAtivo={periodo} carregando={carregando} />
        </section>

        <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(31,41,55,0.05)]">
            <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Saúde da comunidade</p><h2 className="mt-1 text-xl font-bold text-slate-800">Engajamento dos usuários</h2></div>
            <div className="space-y-5"><ProgressMetric label="Usuários ativos no período" value={dados.usuariosAtivosHoje} max={totalUsuarios} color="bg-emerald-500" /><ProgressMetric label="Base total de usuários" value={dados.usuariosTotal} max={Math.max(totalUsuarios, 1)} color="bg-violet-500" /><div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-4"><span className="text-sm font-medium text-slate-500">Taxa de ativação</span><strong className="text-xl font-extrabold text-slate-800">{taxaAtivacao}%</strong></div></div>
          </article>
          <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(31,41,55,0.05)]">
            <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Impacto EcoWayer</p><h2 className="mt-1 text-xl font-bold text-slate-800">Resumo de sustentabilidade</h2></div>
            <div className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-emerald-50 p-4"><p className="text-xs font-semibold text-emerald-700">Pontos distribuídos</p><p className="mt-2 text-2xl font-extrabold text-emerald-800">{formatarNumero(metricas.pontosGerados)}</p></div><div className="rounded-xl bg-sky-50 p-4"><p className="text-xs font-semibold text-sky-700">Itens reconhecidos</p><p className="mt-2 text-2xl font-extrabold text-sky-800">{formatarNumero(metricas.itensValidados)}</p></div><div className="col-span-2 rounded-xl border border-slate-100 p-4"><p className="text-sm font-bold text-slate-700">Moderação configurada</p><p className="mt-1 text-xs text-slate-400">{formatarNumero(metricas.regrasAtivas)} regras de pontuação ativas</p></div></div>
          </article>
        </section>
      </main>
    </div>
  )
}
