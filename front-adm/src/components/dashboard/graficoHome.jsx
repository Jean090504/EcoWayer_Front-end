// Eixo Y "bonito": 4 marcas (0, 1/3, 2/3, topo) arredondadas para 1, 2 ou 5 x 10^n
function escalaY(maximo) {
  const max = Math.max(maximo, 3)
  const bruto = max / 3
  const mag = 10 ** Math.floor(Math.log10(bruto))
  const norm = bruto / mag
  const passo = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag

  return { topo: passo * 3, ticks: [0, passo, passo * 2, passo * 3] }
}

const formatarTick = (n) => (n >= 1000 ? `${String(n / 1000).replace(".", ",")}k` : String(n))
const formatarDia = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`

// Curva suave passando pelos pontos (Catmull-Rom convertido em bezier)
function gerarCaminho(pts) {
  if (pts.length === 0) return ""
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`

  let d = `M ${pts[0].x} ${pts[0].y}`

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2

    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6

    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`
  }

  return d
}

export default function GraficoHome({
  serie = [],
  total = 0,
  variacao = "+0%",
  periodo = "30d",
  opcoes = [],
  aoMudarPeriodo = () => {},
  carregando = false
}) {
  const maximo = serie.reduce((m, p) => Math.max(m, p.valor), 0)
  const { topo, ticks } = escalaY(maximo)

  const pontos = serie.map((p, i) => ({
    x: serie.length > 1 ? (i / (serie.length - 1)) * 100 : 100,
    y: 100 - (p.valor / topo) * 100
  }))

  const linha = gerarCaminho(pontos)
  const area = linha ? `${linha} L 100 100 L 0 100 Z` : ""
  const ultimo = pontos[pontos.length - 1]

  // 5 datas espalhadas ao longo do eixo X
  const datas = serie.length === 0
    ? []
    : [...new Set([0, 1, 2, 3, 4].map(i => Math.round((i * (serie.length - 1)) / 4)))]
        .map(i => formatarDia(serie[i].data))

  const negativo = variacao.startsWith("-")

  return (
    <div className="bg-[#FFFFFF] rounded-[25px] p-8 w-[60%] min-h-[425px] shadow-md flex flex-col justify-between">

      <div className="flex flex-row justify-between items-start w-full mb-4">
        <div className="flex flex-col">
          <h2 className="text-[24px] font-bold text-[#202735]">Dashboard</h2>
          <p className="text-[#8A8A8A] text-[14px]">Evolução dos pontos acumulados pelos usuários</p>
        </div>

        <div className="relative w-[200px]">
          <select
            value={periodo}
            onChange={(e) => aoMudarPeriodo(e.target.value)}
            className="appearance-none w-full px-4 py-2 pr-10 border border-[#E5E7EB] bg-[#FFFFFF] rounded-[10px] shadow-sm text-[16px] text-[#202735] cursor-pointer"
          >
            {opcoes.map(o => (
              <option key={o.valor} value={o.valor}>{o.label}</option>
            ))}
          </select>

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
               className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col mt-2">
        <p className="text-[20px] font-semibold text-[#202735]">Pontos acumulados</p>
        <p className="text-[56px] font-bold text-[#202735] leading-none">
          {carregando ? "..." : total.toLocaleString("pt-BR")}
        </p>
        <p className={`text-[16px] font-medium mt-2 ${negativo ? "text-[#E43E42]" : "text-[#58A24D]"} ${carregando ? "invisible" : ""}`}>
          {negativo ? "↓" : "↑"} {variacao} em relação ao mês anterior
        </p>
      </div>

      <div className="flex flex-row items-stretch h-[220px] w-full gap-2 mt-6">
        {/* Eixo Y */}
        <div className="flex flex-col-reverse justify-between items-end pr-2 text-[12px] text-[#8C8C8C] font-medium border-r border-[#E5E7EB] w-[40px]">
          {ticks.map(t => <span key={t}>{formatarTick(t)}</span>)}
        </div>

        {/* Área do gráfico */}
        <div className="relative flex-1 mr-3 border-b border-[#E5E7EB]">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="border-b border-[#F3F4F6] w-full"></div>
            <div className="border-b border-[#F3F4F6] w-full"></div>
            <div className="border-b border-[#F3F4F6] w-full"></div>
            <div className="w-full"></div>
          </div>

          {carregando ? (
            <div className="absolute inset-0 flex items-center justify-center text-[#8A8A8A]">
              Carregando gráfico...
            </div>
          ) : (
            <>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradGraficoHome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#58A24D" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#58A24D" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path d={area} fill="url(#gradGraficoHome)" />
                <path d={linha} fill="none" stroke="#58A24D" strokeWidth="3" strokeLinecap="round"
                      vectorEffect="non-scaling-stroke" />
              </svg>

              {ultimo && (
                <>
                  <div
                    className="absolute w-[12px] h-[12px] bg-[#58A24D] rounded-full -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${ultimo.x}%`, top: `${ultimo.y}%` }}
                  />
                  <div
                    className="absolute bg-[#3F7D3A] text-[#FFFFFF] text-[13px] font-semibold px-3 py-1 rounded-md"
                    style={{ right: 0, bottom: `calc(${100 - ultimo.y}% + 12px)` }}
                  >
                    {serie[serie.length - 1].valor.toLocaleString("pt-BR")}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Eixo X */}
      <div className="flex flex-row justify-between w-full pl-[48px] pr-3 mt-2 text-[12px] text-[#8C8C8C] font-medium">
        {datas.map(d => <span key={d}>{d}</span>)}
      </div>

    </div>
  )
}