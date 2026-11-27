import { useEffect, useRef, useState } from "react"
import { MessageCircle, Send, Sparkles, X } from "lucide-react"
import ecoPersonagem from "../assets/assistente-eco-personagem.png"
import { apiFetch } from "../services/api.js"

const SUGESTOES = ["Como encontro um anúncio perto de mim?", "Como funcionam os EcoPontos?", "Como acompanho meus pontos?"]

export default function AssistenteChat() {
  const [aberto, setAberto] = useState(false)
  const [texto, setTexto] = useState("")
  const [mensagens, setMensagens] = useState([])
  const [carregando, setCarregando] = useState(false)
  const fimRef = useRef(null)

  useEffect(() => { if (aberto) fimRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }) }, [aberto, mensagens, carregando])

  async function perguntar(pergunta) {
    const mensagem = pergunta.trim()
    if (!mensagem || carregando) return
    setTexto("")
    const historico = mensagens.slice(-10)
    setMensagens(atual => [...atual, { role: "user", text: mensagem }])
    setCarregando(true)
    try {
      const dados = await apiFetch("/ia/assistant-chat", { method: "POST", body: JSON.stringify({ message: mensagem, history: historico }) })
      if (!dados?.resposta) throw new Error(dados?.message || "Não consegui responder agora. Tente novamente.")
      setMensagens(atual => [...atual, { role: "model", text: dados.resposta }])
    } catch (erro) {
      setMensagens(atual => [...atual, { role: "model", text: erro.message || "Não consegui responder agora. Tente novamente." }])
    } finally { setCarregando(false) }
  }

  return <div className="fixed bottom-4 right-4 z-[70] sm:bottom-6 sm:right-6">
    {aberto && <section role="dialog" aria-label="Conversa com a Eco" className="mb-3 flex h-[min(620px,calc(100dvh-7rem))] w-[min(440px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-[#E5DDEC] bg-white shadow-[0_20px_60px_rgba(39,22,54,0.24)]">
      <header className="flex min-h-24 items-center gap-3 bg-gradient-to-r from-[#603AAF] via-[#7650C4] to-[#4CAF50] px-4 py-3 text-white">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/30 bg-[#473064] shadow-sm"><img src={ecoPersonagem} alt="Eco" className="h-auto w-full origin-top scale-[2.2]" /></div>
        <div className="min-w-0 flex-1"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">EcoWayer</p><h2 className="mt-0.5 text-lg font-extrabold">Converse com a Eco</h2><p className="mt-1 text-xs text-white/85">Anúncios, pontos e EcoPontos</p></div>
        <button type="button" onClick={() => setAberto(false)} aria-label="Fechar assistente" className="self-start rounded-full p-2 text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"><X size={18} /></button>
      </header>
      <div className="flex-1 space-y-4 overflow-y-auto bg-[#FBFAFD] px-4 py-5 text-sm" aria-live="polite">
        {mensagens.length === 0 && <div className="rounded-2xl border border-[#E9E0F1] bg-white p-4 shadow-sm"><p className="flex items-center gap-2 font-bold text-[#5D3B9D]"><Sparkles size={17} />Olá! Sou a Eco.</p><p className="mt-2 leading-relaxed text-[#5F5968]">Posso ajudar você a explorar anúncios, entender seus pontos ou encontrar EcoPontos.</p><div className="mt-4 flex flex-wrap gap-2">{SUGESTOES.map(sugestao => <button key={sugestao} type="button" onClick={() => perguntar(sugestao)} className="rounded-full border border-[#DDD0EF] bg-[#F8F4FC] px-3 py-2 text-left text-xs font-medium text-[#5D3B9D] transition hover:bg-[#EEE5F9]">{sugestao}</button>)}</div></div>}
        {mensagens.map((item, indice) => <div key={indice} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}><p className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 leading-relaxed ${item.role === "user" ? "rounded-br-sm bg-[#724BC2] text-white" : "rounded-bl-sm border border-[#EEE8F3] bg-white text-[#403748] shadow-sm"}`}>{item.text}</p></div>)}
        {carregando && <p className="flex items-center gap-2 text-xs font-medium text-[#746B7D]"><span className="h-2 w-2 animate-pulse rounded-full bg-[#4CAF50]" />Eco está preparando uma resposta...</p>}
        <div ref={fimRef} />
      </div>
      <form onSubmit={evento => { evento.preventDefault(); perguntar(texto) }} className="flex items-end gap-2 border-t border-[#EEE8F3] bg-white p-3">
        <textarea aria-label="Mensagem para a Eco" rows={1} maxLength={2000} value={texto} onChange={evento => setTexto(evento.target.value)} onKeyDown={evento => { if (evento.key === "Enter" && !evento.shiftKey) { evento.preventDefault(); perguntar(texto) } }} placeholder="Pergunte à Eco..." className="max-h-28 min-h-11 min-w-0 flex-1 resize-none rounded-xl border border-[#E2DAEA] bg-[#FAF9FC] px-3 py-2.5 text-sm outline-none focus:border-[#724BC2]" />
        <button type="submit" disabled={!texto.trim() || carregando} aria-label="Enviar mensagem" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#724BC2] text-white transition hover:bg-[#5D3B9D] disabled:cursor-not-allowed disabled:opacity-50"><Send size={18} /></button>
      </form>
    </section>}
    <button type="button" onClick={() => setAberto(valor => !valor)} aria-label={aberto ? "Fechar assistente Eco" : "Abrir assistente Eco"} aria-expanded={aberto} className="ml-auto flex items-center gap-2 rounded-full bg-[#724BC2] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(84,50,149,0.3)] transition hover:-translate-y-0.5 hover:bg-[#5D3B9D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#724BC2]"><MessageCircle size={18} />{aberto ? "Fechar" : "Falar com a Eco"}</button>
  </div>
}
