import { useEffect, useState } from "react"
import CardPadrao from "./cardPadrao"
import IconValidador from "../../assets/icons/imagens/icon-validador.png"
import { listarCategoriasParaRegra, listarCondicoes, listarRegrasPontuacao, calcularPontuacao } from "../../services/pontos.js"

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
    <div className="flex flex-row items-center gap-3 mb-6"><div className="bg-[#7350B9] w-10 h-10 rounded-[8px] flex items-center justify-center"><img src={IconValidador} alt="Ícone de Fórmula" className="w-6 h-6" /></div><h2 className="text-xl font-bold text-[#202735]">Validador de Fórmula</h2></div>
    <p className="text-xs font-bold text-[#8A8A8A] uppercase mb-2">Categoria selecionada</p>
    <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="w-full h-[45px] border rounded-lg px-4 mb-5 bg-white">{categorias.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}</select>
    <p className="text-xs font-bold text-[#8A8A8A] uppercase mb-2">Condição analisada</p>
      <select value={condicaoId} onChange={(e) => setCondicaoId(e.target.value)} className="w-full h-[45px] border rounded-lg px-4 mb-4 bg-white">{condicoes.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}</select>
    <label className="text-xs font-bold text-[#8A8A8A] uppercase">Multiplicador</label>
    <input type="number" value={multiplicador} readOnly className="w-full h-[45px] border rounded-lg px-4 mt-2 mb-5 bg-slate-100 text-slate-600" />
    <p className="text-xs font-bold text-[#8A8A8A] uppercase mb-1">Pontos a receber</p><p className="text-[40px] font-bold text-[#7350B9] leading-none">{pontos}<span className="text-xl ml-1">pts</span></p>
  </CardPadrao>
}
