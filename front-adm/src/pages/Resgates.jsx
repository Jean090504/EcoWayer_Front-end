import { useEffect, useMemo, useState } from "react"
import { apiFetch } from "../services/api.js"

const statusLabel = { ativo: "Ativo", utilizado: "Utilizado", expirado: "Expirado", cancelado: "Cancelado" }
const statusClass = {
  ativo: "bg-amber-50 text-amber-700",
  utilizado: "bg-green-50 text-green-700",
  expirado: "bg-slate-100 text-slate-600",
  cancelado: "bg-red-50 text-red-600"
}

export default function Resgates() {
  const [resgates, setResgates] = useState([])
  const [busca, setBusca] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  const carregar = async () => {
    setCarregando(true)
    setErro("")
    try {
      const resposta = await apiFetch("/voucher")
      setResgates(resposta.response?.voucher || [])
    } catch (e) {
      setErro(e.message || "Não foi possível carregar os resgates.")
    } finally { setCarregando(false) }
  }

  useEffect(() => { carregar() }, [])

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return resgates
    return resgates.filter(item => [item.usuario, item.nome_parceiro, item.beneficio, item.gift_card, item.codigo]
      .some(valor => String(valor || "").toLowerCase().includes(termo)))
  }, [resgates, busca])

  return <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 sm:px-7 lg:px-10">
    <div className="mx-auto max-w-7xl">
      <div className="mb-7 pt-2">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#65ba69]">Controle de benefícios</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">Resgates</h1>
      </div>
      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar usuário, gift card ou código" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base outline-none focus:border-[#65ba69] sm:max-w-xl" />
          <button onClick={carregar} className="rounded-xl bg-[#65ba69] px-5 py-3 text-sm font-bold text-white hover:bg-[#54a95d]">Atualizar</button>
        </div>
        {erro && <p className="m-5 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600">{erro}</p>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500"><tr><th className="px-6 py-4">Benefício</th><th className="px-6 py-4">Usuário</th><th className="px-6 py-4">Pontos</th><th className="px-6 py-4">Data</th><th className="px-6 py-4">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {!carregando && filtrados.length === 0 && <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">Nenhum resgate encontrado.</td></tr>}
              {filtrados.map(item => <tr key={item.id} className="hover:bg-slate-50"><td className="px-6 py-4"><p className="font-bold text-slate-800">{item.gift_card || item.beneficio}</p><p className="text-sm text-slate-500">{item.nome_parceiro}</p></td><td className="px-6 py-4 font-medium text-slate-700">{item.usuario || `Usuário #${item.id_usuario || "—"}`}</td><td className="px-6 py-4 font-extrabold text-[#65ba69]">{Number(item.pontos_utilizados || 0).toLocaleString("pt-BR")} pts</td><td className="px-6 py-4 text-sm text-slate-500">{item.data_resgate ? new Date(item.data_resgate).toLocaleDateString("pt-BR") : "—"}</td><td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass[item.status] || "bg-slate-100 text-slate-600"}`}>{statusLabel[item.status] || item.status}</span></td></tr>)}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </main>
}
