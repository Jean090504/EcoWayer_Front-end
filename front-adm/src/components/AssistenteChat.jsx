import { useEffect, useState } from "react";
import { Send, X } from "lucide-react";
import ecoPersonagem from "../assets/icons/imagens/assistente-eco-personagem.png";
import { apiFetch } from "../services/api";

const AI_URL = import.meta.env.VITE_AI_URL || "http://localhost:3333/api/v1/ai";
const AI_TOKEN = import.meta.env.VITE_AI_TOKEN || "";

export default function AssistenteChat() {
  const [aberto, setAberto] = useState(false);
  const [texto, setTexto] = useState("");
  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [pontosHoje, setPontosHoje] = useState(null);

  useEffect(() => {
    if (!aberto) return undefined;
    let ativo = true;
    apiFetch("/pontos/dashboard?period=diario&grafico=7d")
      .then((dados) => {
        if (ativo) setPontosHoje(Number(dados?.response?.metricas?.pontosGerados?.valor || 0));
      })
      .catch(() => {
        if (ativo) setPontosHoje(null);
      });
    return () => { ativo = false; };
  }, [aberto]);

  async function obterContextoPainel(pergunta) {
    if (!/ponto|pontua|últimos|ultimos|quantidade/i.test(pergunta)) return null;
    const dados = await apiFetch("/pontos/dashboard?period=semanal&grafico=7d");
    const evolucao = dados?.response?.dashboard?.evolucaoPontos || [];
    const ultimosDias = evolucao.slice(-2);
    return {
      pontosUltimosDoisDias: ultimosDias.reduce((total, item) => total + Number(item.pontos || 0), 0),
      detalhamentoUltimosDoisDias: ultimosDias.map((item) => ({ data: item.data, pontos: Number(item.pontos || 0) }))
    };
  }

  async function enviar(e) {
    e.preventDefault();
    const mensagem = texto.trim();
    if (!mensagem || carregando) return;
    setTexto("");
    const historico = [...mensagens, { role: "user", text: mensagem }];
    setMensagens(historico);
    setCarregando(true);
    try {
      const contextoPainel = await obterContextoPainel(mensagem).catch(() => null);
      const res = await fetch(`${AI_URL}/assistant/chat`, { method: "POST", headers: { "Content-Type": "application/json", ...(AI_TOKEN && { "x-ai-token": AI_TOKEN }) }, body: JSON.stringify({ message: mensagem, history: historico.slice(-10), audience: "admin", context: contextoPainel }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Assistente indisponível.");
      setMensagens((atual) => [...atual, { role: "model", text: data.resposta }]);
    } catch (error) {
      setMensagens((atual) => [...atual, { role: "model", text: error.message }]);
    }
    finally { setCarregando(false); }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {aberto && (
        <div className="relative mb-3">
          <img src={ecoPersonagem} alt="Eco, assistente da EcoWayer" className="pointer-events-none absolute -left-10 -top-60 z-20 h-64 w-auto object-contain drop-shadow-[0_8px_10px_rgba(31,41,55,0.16)]" />
          <div className="absolute left-16 -top-48 z-10 w-56 rounded-3xl border border-white bg-white/95 px-5 py-4 shadow-[0_14px_30px_rgba(31,41,55,0.14)] backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Pontos hoje</p>
            <p className="mt-1 text-3xl font-extrabold leading-none text-[#7350B9]">{pontosHoje == null ? "—" : pontosHoje.toLocaleString("pt-BR")} <span className="text-sm font-bold text-[#65BA69]">pts</span></p>
          </div>
          <section className="flex h-[min(560px,calc(100vh-6rem))] w-[min(430px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(31,41,55,0.14)]">
          <header className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
            <div className="flex items-center gap-3">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7350B9]">EcoWayer</p><h2 className="text-base font-extrabold text-slate-800">Eco <span className="font-medium text-slate-400">· suporte</span></h2></div>
            </div>
            <button type="button" onClick={() => setAberto(false)} aria-label="Fechar assistente" className="relative z-30 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X size={17} /></button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#fafbfc] p-4 text-sm">
            {mensagens.length === 0 && <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-green-50 p-4"><strong className="text-[#7350B9]">Como posso ajudar?</strong><p className="mt-2 leading-5 text-slate-600">Pergunte sobre uma tela, uma regra ou uma operação do painel.</p></div>}
            {mensagens.map((item, i) => <div key={i} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}><p className={`max-w-[84%] rounded-2xl px-4 py-3 leading-5 ${item.role === "user" ? "rounded-br-sm bg-[#7350B9] text-white" : "rounded-bl-sm bg-white text-slate-600 shadow-sm ring-1 ring-slate-100"}`}>{item.text}</p></div>)}
            {carregando && <div className="flex items-center gap-2 text-xs font-medium text-slate-400"><span className="h-2 w-2 animate-pulse rounded-full bg-[#65BA69]" /> Eco está preparando uma resposta...</div>}
          </div>

          <form onSubmit={enviar} className="flex gap-2 border-t border-slate-100 bg-white p-3">
            <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escreva sua dúvida" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#7350B9] focus:bg-white focus:ring-2 focus:ring-purple-100" />
            <button type="submit" aria-label="Enviar pergunta" disabled={carregando} className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7350B9] text-white transition hover:bg-[#6140a5] disabled:cursor-not-allowed disabled:opacity-50"><Send size={17} /></button>
          </form>
          </section>
        </div>
      )}

      <button type="button" onClick={() => setAberto((v) => !v)} aria-label={aberto ? "Fechar assistente Eco" : "Abrir assistente Eco"} className="group flex items-center gap-2 rounded-2xl border border-white bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-[0_8px_24px_rgba(31,41,55,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(31,41,55,0.16)]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#65BA69] shadow-[0_0_0_4px_rgba(101,186,105,0.14)]" />
        <span>{aberto ? "Fechar" : "Falar com a Eco"}</span>
      </button>
    </div>
  );
}
