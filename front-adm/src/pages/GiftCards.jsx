import { useEffect, useState } from "react"
import { apiFetch } from "../services/api.js"

const vazio = { id: null, nome: "", slug_api: "", valor_reais: 50, pontos_resgate: 2500, imagem_url: "", categoria: "Gift card", status: "ativo" }

const moeda = (valor) => Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
const numero = (valor) => Number(valor || 0).toLocaleString("pt-BR")

export default function GiftCards() {
  const [giftCards, setGiftCards] = useState([])
  const [form, setForm] = useState(vazio)
  const [statusAberto, setStatusAberto] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [sincronizando, setSincronizando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState("")
  const [erro, setErro] = useState("")

  const carregar = async () => {
    setCarregando(true)
    setErro("")
    try {
      const resposta = await apiFetch("/gift-card")
      const itens = resposta.response?.giftCards || []
      setGiftCards(itens)
      if (!itens.length) await sincronizar(true)
    } catch (error) {
      setErro(error.message)
    } finally {
      setCarregando(false)
    }
  }

  const sincronizar = async (silencioso = false) => {
    setSincronizando(true)
    if (!silencioso) setMensagem("")
    try {
      const resposta = await apiFetch("/gift-card/sincronizar", { method: "POST" })
      setMensagem(`${resposta.response?.quantidade || 0} gift cards sincronizados da API pública.`)
      const lista = await apiFetch("/gift-card")
      setGiftCards(lista.response?.giftCards || [])
    } catch (error) {
      setErro(error.message)
    } finally {
      setSincronizando(false)
    }
  }

  useEffect(() => { carregar() }, [])

  const editar = (giftCard) => {
    setMensagem("")
    setErro("")
    setStatusAberto(false)
    setForm({ ...giftCard, valor_reais: Number(giftCard.valor_reais), pontos_resgate: Number(giftCard.pontos_resgate) })
  }

  const fecharEditor = () => {
    setStatusAberto(false)
    setForm(vazio)
  }

  const salvar = async (event) => {
    event.preventDefault()
    setSalvando(true)
    setErro("")
    try {
      await apiFetch(`/gift-card/${form.id}`, { method: "PUT", body: JSON.stringify(form) })
      setGiftCards((atual) => atual.map((item) => item.id === form.id ? { ...item, ...form } : item))
      setMensagem(`${form.nome}: custo atualizado para ${numero(form.pontos_resgate)} pontos.`)
      fecharEditor()
    } catch (error) {
      setErro(error.message)
    } finally {
      setSalvando(false)
    }
  }

  const excluir = async (id) => {
    if (!window.confirm("Excluir este gift card do catálogo?")) return
    try {
      await apiFetch(`/gift-card/${id}`, { method: "DELETE" })
      setGiftCards((atual) => atual.filter((item) => item.id !== id))
      setMensagem("Gift card removido do catálogo.")
    } catch (error) {
      setErro(error.message)
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F6FA] px-4 py-7 sm:px-7 lg:px-10">
      <header className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#65BA69]">Recompensas</p>
          <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-slate-900">Gift cards</h1>
        </div>
      </header>

      {mensagem && <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{mensagem}</div>}
      {erro && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{erro}</div>}

      {form.id && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) fecharEditor() }}>
          <form onSubmit={salvar} className="max-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-y-auto rounded-2xl border border-violet-100 bg-white p-6 shadow-2xl sm:p-7" role="dialog" aria-modal="true" aria-labelledby="titulo-configurar-gift-card">
          <div className="mb-6 flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-500">Configuração do catálogo</p><h2 id="titulo-configurar-gift-card" className="mt-1 text-2xl font-extrabold text-slate-900">Configurar troca</h2><p className="mt-1 text-sm text-slate-500">Defina o valor e a quantidade de pontos necessários para este benefício.</p></div><button type="button" onClick={fecharEditor} className="shrink-0 rounded-lg px-2 py-1 text-sm font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-700">Fechar</button></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-slate-600">Gift card<input value={form.nome} disabled className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-base text-slate-500" /></label>
            <label className="text-sm font-bold text-slate-600">Categoria<input value={form.categoria || "Gift card"} disabled className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-base text-slate-500" /></label>
            <label className="text-sm font-bold text-slate-600">Valor em reais<input type="number" min="1" step="0.01" value={form.valor_reais} onChange={(e) => setForm({ ...form, valor_reais: e.target.value })} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-base text-slate-800 outline-none focus:border-violet-400" /></label>
            <label className="text-sm font-bold text-slate-600">Pontos para resgate<input type="number" min="1" step="1" value={form.pontos_resgate} onChange={(e) => setForm({ ...form, pontos_resgate: e.target.value })} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-base text-slate-800 outline-none focus:border-violet-400" /></label>
            <label className="text-sm font-bold text-slate-600">Status<div className="relative mt-2"><button type="button" onClick={() => setStatusAberto((aberto) => !aberto)} className={`flex h-11 w-full items-center justify-between rounded-xl border bg-white px-3 text-left text-base font-semibold outline-none transition focus:ring-2 focus:ring-violet-100 ${statusAberto ? "border-violet-400" : "border-slate-200"}`}><span className={form.status === "ativo" ? "text-emerald-600" : "text-slate-500"}>{form.status === "ativo" ? "Ativo" : "Inativo"}</span><span className={`text-sm text-slate-400 transition ${statusAberto ? "rotate-180" : ""}`}>⌄</span></button>{statusAberto && <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl"><button type="button" onClick={() => { setForm({ ...form, status: "ativo" }); setStatusAberto(false) }} className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-emerald-50 ${form.status === "ativo" ? "bg-emerald-50 text-emerald-700" : "text-slate-600"}`}>Ativo</button><button type="button" onClick={() => { setForm({ ...form, status: "inativo" }); setStatusAberto(false) }} className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-slate-50 ${form.status === "inativo" ? "bg-slate-100 text-slate-700" : "text-slate-600"}`}>Inativo</button></div>}</div></label>
          </div>
          <label className="mt-4 block text-sm font-bold text-slate-600">Identificador da API<input value={form.slug_api} disabled className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500" /></label>
          <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row"><button type="button" onClick={fecharEditor} className="h-11 rounded-xl border border-slate-200 px-5 text-base font-bold text-slate-600 hover:bg-slate-50">Cancelar</button>
          <button type="submit" disabled={salvando} className="h-11 rounded-xl bg-[#65BA69] px-5 text-base font-bold text-white hover:bg-[#54a958] disabled:opacity-60">{salvando ? "Salvando..." : "Salvar configuração"}</button>
          </div></form>
        </div>
      )}

      {carregando ? <p className="rounded-2xl bg-white p-8 text-center text-base text-slate-500">Carregando catálogo...</p> : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {giftCards.map((giftCard) => (
            <article key={giftCard.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-32 items-center justify-center bg-slate-50 p-5"><img src={giftCard.imagem_url} alt="" className="max-h-20 max-w-[180px] object-contain" /></div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{giftCard.categoria || "Gift card"}</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">{giftCard.nome}</h2></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${giftCard.status === "ativo" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{giftCard.status === "ativo" ? "Ativo" : "Inativo"}</span></div>
                <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-semibold text-slate-400">Valor</p><p className="mt-1 text-lg font-extrabold text-slate-800">{moeda(giftCard.valor_reais)}</p></div><div className="rounded-xl bg-violet-50 p-3"><p className="text-xs font-semibold text-violet-500">Troca</p><p className="mt-1 text-lg font-extrabold text-violet-700">{numero(giftCard.pontos_resgate)} pts</p></div></div>
                <div className="mt-5 flex gap-2"><button type="button" onClick={() => editar(giftCard)} className="h-10 flex-1 rounded-xl bg-[#7350B9] text-sm font-bold text-white hover:bg-[#6241a4]">Editar pontos</button><button type="button" onClick={() => excluir(giftCard.id)} className="h-10 rounded-xl border border-red-100 px-4 text-sm font-bold text-red-600 hover:bg-red-50">Excluir</button></div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
