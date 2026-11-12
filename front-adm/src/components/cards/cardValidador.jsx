import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import CardPadrao from "./cardPadrao"
import { listarCategoriasParaRegra, listarCondicoes, listarRegrasPontuacao, calcularPontuacao } from "../../services/pontos.js"

function SelectBonito({ value, options, onChange, placeholder }) {
  const [aberto, setAberto] = useState(false)
  const selecionado = options.find((item) => String(item.id) === String(value))

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAberto((atual) => !atual)}
        className={`flex h-11 w-full items-center justify-between rounded-xl border bg-white px-4 text-left text-sm outline-none transition ${aberto ? "border-[#65BA69] ring-2 ring-green-100" : "border-slate-200 hover:border-slate-300"}`}
        aria-haspopup="listbox"
        aria-expanded={aberto}
      >
        <span className={selecionado ? "text-slate-700" : "text-slate-400"}>{selecionado?.nome || placeholder}</span>
        <ChevronDown size={16} strokeWidth={1.8} className={`shrink-0 text-slate-400 transition-transform ${aberto ? "rotate-180" : ""}`} />
      </button>
      {aberto && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl" role="listbox">
          {options.length ? options.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => { onChange(String(item.id)); setAberto(false) }}
              className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition ${String(item.id) === String(value) ? "bg-green-50 font-semibold text-[#65BA69]" : "text-slate-600 hover:bg-slate-50"}`}
            >
              {item.nome}
            </button>
          )) : <span className="block px-3 py-2.5 text-sm text-slate-400">Nenhuma opção disponível</span>}
        </div>
      )}
    </div>
  )
}

export default function CardValidador() {
  const [categorias, setCategorias] = useState([])
  const [condicoes, setCondicoes] = useState([])
  const [regras, setRegras] = useState([])
  const [categoriaId, setCategoriaId] = useState("")
  const [condicaoId, setCondicaoId] = useState("")
  const [multiplicador, setMultiplicador] = useState("1")
  const [pontos, setPontos] = useState("0.00")

  useEffect(() => {
    Promise.all([listarCategoriasParaRegra(), listarCondicoes(), listarRegrasPontuacao()]).then(([cats, conds, rules]) => {
      setCategorias(cats); setCondicoes(conds); setRegras(rules)
      if (cats[0]) setCategoriaId(String(cats[0].id))
      if (conds[0]) setCondicaoId(String(conds[0].id))
    }).catch((error) => console.error("Erro ao carregar validador:", error))
  }, [])

  useEffect(() => {
    const regra = regras.find((item) => String(item.categoria?.id ?? item.id_categoria) === categoriaId)
    const condicao = regra?.condicao?.find((item) => String(item.id ?? item.id_condicao_item) === condicaoId)
    setMultiplicador(condicao?.multiplicador ? String(condicao.multiplicador) : "1")
  }, [regras, categoriaId, condicaoId])

  useEffect(() => {
    const condicao = condicoes.find((item) => String(item.id) === condicaoId)
    if (!categoriaId || !condicao || Number(multiplicador) <= 0) return
    calcularPontuacao({ id_categoria: Number(categoriaId), id_condicao_item: condicao.id, multiplicador: Number(multiplicador) })
      .then((resultado) => setPontos(Number(resultado.pontos_calculados).toFixed(2)))
      .catch(() => setPontos("0.00"))
  }, [categoriaId, condicoes, condicaoId, multiplicador])

  return <CardPadrao>
    <div className="mb-6">
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#65BA69]">Simulador</p>
      <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-800">Validador de fórmula</h2>
    </div>
    <p className="mb-2 text-sm font-bold uppercase tracking-[0.12em] text-slate-400">Categoria selecionada</p>
    <div className="mb-5"><SelectBonito value={categoriaId} options={categorias} onChange={setCategoriaId} placeholder="Selecione uma categoria" /></div>
    <p className="mb-2 text-sm font-bold uppercase tracking-[0.12em] text-slate-400">Condição analisada</p>
    <div className="mb-4"><SelectBonito value={condicaoId} options={condicoes} onChange={setCondicaoId} placeholder="Selecione uma condição" /></div>
    <label className="text-sm font-bold uppercase tracking-[0.12em] text-slate-400">Multiplicador</label>
    <input type="number" value={multiplicador} readOnly className="mt-2 mb-5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-600" />
    <p className="mb-1 text-sm font-bold uppercase tracking-[0.12em] text-slate-400">Pontos a receber</p>
    <p className="text-4xl font-extrabold leading-none tracking-tight text-[#65BA69]">{pontos}<span className="ml-1 text-lg font-bold">pts</span></p>
  </CardPadrao>
}
