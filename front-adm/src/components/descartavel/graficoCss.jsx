import { useState } from "react"

const formatarData = (valor, mostrarAno = false) => {
  if (!valor) return "—"
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", ...(mostrarAno ? { year: "2-digit" } : {}) }).format(new Date(`${valor}T12:00:00`))
}

const opcoes = [
  { id: "7d", label: "7 dias" },
  { id: "30d", label: "30 dias" },
  { id: "90d", label: "90 dias" },
]

export default function GraficoCss({ dados = [], periodo = "30d", onPeriodoChange = () => {} }) {
  const [pontoEmFoco, setPontoEmFoco] = useState(null)
  const maior = Math.max(...dados.map((item) => Number(item.acumulado || 0)), 1)
  const pontos = dados.map((item, index) => {
    const x = dados.length <= 1 ? 50 : (index / (dados.length - 1)) * 100
    const y = 100 - (Number(item.acumulado || 0) / maior) * 100
    return { ...item, x, y }
  })
  const area = pontos.length ? `0,100 ${pontos.map((item) => `${item.x},${item.y}`).join(" ")} 100,100` : ""
  const linha = pontos.map((item) => `${item.x},${item.y}`).join(" ")
  const ultimo = dados[dados.length - 1]?.acumulado || 0
  const linhas = [maior, maior * 0.75, maior * 0.5, maior * 0.25, 0]

  return (
    <article className="min-w-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgba(31,41,55,0.05)] sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="mt-1 text-2xl font-bold text-slate-800">Pontos acumulados</h2>
        </div>
        <select value={periodo} onChange={(event) => onPeriodoChange(event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none transition focus:border-[#65BA69] focus:ring-2 focus:ring-green-100">
          {opcoes.map((opcao) => <option key={opcao.id} value={opcao.id}>{opcao.label}</option>)}
        </select>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-5xl font-extrabold tracking-tight text-slate-800">{Number(ultimo).toLocaleString("pt-BR")}</p>
        </div>
        <p className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-600">{opcoes.find((opcao) => opcao.id === periodo)?.label}</p>
      </div>

      <div className="mt-7 flex h-[280px] gap-3 sm:h-[330px]">
        <div className="flex w-11 shrink-0 flex-col justify-between pb-8 text-right text-xs font-medium text-slate-400">
          {linhas.map((linha, index) => <span key={index}>{Math.round(linha).toLocaleString("pt-BR")}</span>)}
        </div>
        <div className="relative min-w-0 flex-1">
          <div className="pointer-events-none absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between">
            {linhas.map((_, index) => <span key={index} className="border-t border-dashed border-slate-100" />)}
          </div>
          <div className="absolute inset-x-0 top-0 bottom-8">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
            {area && <polygon points={area} fill="rgba(88,162,77,0.12)" />}
            {linha && <polyline points={linha} fill="none" stroke="#438b4b" strokeWidth="1.2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />}
            {pontos.map((item, index) => (
              <g key={item.data || index}>
                <title>{formatarData(item.data, true)}: {Number(item.acumulado || 0).toLocaleString("pt-BR")} pontos acumulados</title>
              </g>
            ))}
            </svg>
            {pontos.map((item, index) => (
              <span
                key={item.data || index}
                role="button"
                tabIndex="0"
                aria-label={`${formatarData(item.data, true)}: ${Number(item.acumulado || 0).toLocaleString("pt-BR")} pontos acumulados`}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#438b4b] ${index === pontos.length - 1 ? "h-3 w-3 border-2 border-white shadow-[0_1px_4px_rgba(67,139,75,0.35)]" : "h-1.5 w-1.5"}`}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                onMouseEnter={() => setPontoEmFoco(index)}
                onMouseLeave={() => setPontoEmFoco(null)}
                onFocus={() => setPontoEmFoco(index)}
                onBlur={() => setPontoEmFoco(null)}
              />
            ))}
            {pontoEmFoco !== null && pontos[pontoEmFoco] && (
              <div
                className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+14px)] whitespace-nowrap rounded-lg bg-slate-800 px-3 py-2 text-xs text-white shadow-lg"
                style={{ left: `${pontos[pontoEmFoco].x}%`, top: `${pontos[pontoEmFoco].y}%` }}
              >
                <p className="font-semibold">{formatarData(pontos[pontoEmFoco].data, true)}</p>
                <p className="mt-0.5 text-slate-300">
                  {Number(pontos[pontoEmFoco].acumulado || 0).toLocaleString("pt-BR")} pontos acumulados
                </p>
              </div>
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-between text-xs font-semibold text-slate-400">
            {pontos.length > 0 && [pontos[0], pontos[Math.floor((pontos.length - 1) / 2)], pontos[pontos.length - 1]].map((item, index) => <span key={index}>{formatarData(item.data)}</span>)}
          </div>
        </div>
      </div>
    </article>
  )
}
