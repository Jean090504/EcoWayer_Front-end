import { useEffect, useMemo, useState } from "react"
import GraficoCss from "../components/descartavel/graficoCss.jsx"
import RankingPontos from "../components/dashboard/rankingPontos.jsx"
import { apiFetch } from "../services/api.js"

const periodoOpcoes = [
  { id: "diario", label: "Hoje" },
  { id: "semanal", label: "7 dias" },
  { id: "mensal", label: "Este mês" },
]

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

const formatarNumero = (valor) => Number(valor || 0).toLocaleString("pt-BR")

function CardResumo({ titulo, valor, detalhe, destaque = false, carregando }) {
  return (
    <article className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgba(31,41,55,0.05)] ${destaque ? "border-transparent bg-gradient-to-br from-[#7350B9] to-[#65BA69] text-white" : ""}`}>
      <p className={`text-xs font-bold uppercase tracking-[0.1em] ${destaque ? "text-white/80" : "text-slate-400"}`}>{titulo}</p>
      <p className={`mt-3 text-3xl font-extrabold tracking-tight ${destaque ? "text-white" : "text-slate-800"}`}>{carregando ? "—" : valor}</p>
      <p className={`mt-1 text-xs ${destaque ? "text-white/80" : "text-slate-400"}`}>{detalhe}</p>
    </article>
  )
}

function Atalho({ titulo, descricao, onClick }) {
  return (
    <button type="button" onClick={onClick} className="rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-[0_8px_30px_rgba(31,41,55,0.04)] transition hover:-translate-y-0.5 hover:border-[#65BA69] hover:shadow-[0_12px_30px_rgba(31,41,55,0.08)]">
      <p className="text-sm font-bold text-slate-800">{titulo}</p>
      <p className="mt-1 text-xs leading-5 text-slate-400">{descricao}</p>
      <span className="mt-4 inline-block text-xs font-bold text-[#7350B9]">Acessar →</span>
    </button>
  )
}

export default function Home({ setAtiva }) {
  const [periodo, setPeriodo] = useState("semanal")
  const [graficoPeriodo, setGraficoPeriodo] = useState("30d")
  const [dados, setDados] = useState(vazio)
  const [metricas, setMetricas] = useState({ pontosGerados: 0, itensValidados: 0, regrasAtivas: 0 })
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

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
          pontosGerados: valores.pontosGerados?.valor ?? 0,
          itensValidados: valores.itensValidados?.valor ?? 0,
          regrasAtivas: valores.regrasAtivas?.valor ?? 0,
        })
      })
      .catch((error) => {
        if (ativo) setErro(error.message || "Não foi possível carregar os dados da Home.")
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => { ativo = false }
  }, [periodo, graficoPeriodo])

  const periodoLabel = useMemo(() => periodoOpcoes.find((item) => item.id === periodo)?.label || "Período", [periodo])

  return (
    <div className="min-h-full bg-[#f6f7fb] pb-10">
      <main className="mx-auto w-full max-w-[1600px] px-5 py-7 sm:px-8 lg:px-10">
        <header className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#65BA69]">EcoWayer Admin</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">Olá, administrador</h1>
            <p className="mt-2 text-sm text-slate-500">Aqui está um resumo do que está acontecendo na plataforma.</p>
          </div>
          <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {periodoOpcoes.map((item) => (
              <button key={item.id} type="button" onClick={() => setPeriodo(item.id)} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${periodo === item.id ? "bg-[#7350B9] text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}>
                {item.label}
              </button>
            ))}
          </div>
        </header>

        {erro && <p role="alert" className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">{erro}</p>}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <CardResumo titulo="Pontos gerados" valor={formatarNumero(metricas.pontosGerados)} detalhe={`no período: ${periodoLabel}`} destaque={true} carregando={carregando} />
          <CardResumo titulo="Usuários ativos" valor={formatarNumero(dados.usuariosAtivosHoje)} detalhe="usuários com atividade no período" carregando={carregando} />
          <CardResumo titulo="Anúncios publicados" valor={formatarNumero(dados.anunciosAtivos)} detalhe="anúncios ativos no período" carregando={carregando} />
          <CardResumo titulo="Itens validados" valor={formatarNumero(metricas.itensValidados)} detalhe="registros de sustentabilidade" carregando={carregando} />
        </section>

        <section className="mt-5 grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1.65fr)_minmax(360px,0.9fr)]">
          <GraficoCss dados={dados.evolucaoPontos} periodo={graficoPeriodo} onPeriodoChange={setGraficoPeriodo} />
          <RankingPontos usuarios={dados.ranking} filtroAtivo={periodo} carregando={carregando} />
        </section>

        <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(31,41,55,0.05)]">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Acesso rápido</p>
            <h2 className="mt-1 text-xl font-bold text-slate-800">Continuar gerenciando</h2>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Atalho titulo="Validar pontos" descricao="Confira os lançamentos e acompanhe a pontuação dos usuários." onClick={() => setAtiva("pontos")} />
              <Atalho titulo="Ver chamados" descricao="Acesse denúncias e solicitações pendentes da comunidade." onClick={() => setAtiva("chamados")} />
              <Atalho titulo="Pontos de coleta" descricao="Gerencie locais, capacidade e materiais aceitos." onClick={() => setAtiva("coleta")} />
              <Atalho titulo="Categorias" descricao="Atualize categorias, itens e regras de pontuação." onClick={() => setAtiva("categorias")} />
            </div>
          </article>

          <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(31,41,55,0.05)]">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Status do sistema</p>
            <h2 className="mt-1 text-xl font-bold text-slate-800">Visão operacional</h2>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4"><span className="text-sm text-slate-500">Usuários cadastrados</span><strong className="text-slate-800">{formatarNumero(dados.usuariosTotal)}</strong></div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4"><span className="text-sm text-slate-500">Denúncias no período</span><strong className="text-slate-800">{formatarNumero(dados.denunciasNoMes)}</strong></div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4"><span className="text-sm text-slate-500">Regras de pontuação</span><strong className="text-slate-800">{formatarNumero(metricas.regrasAtivas)} ativas</strong></div>
              <button type="button" onClick={() => setAtiva("dashboard")} className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-xs font-bold text-[#7350B9] transition hover:border-[#65BA69] hover:bg-green-50">
                <span>Abrir dashboard completo</span>
                <span className="text-base transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}
