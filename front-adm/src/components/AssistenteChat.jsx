import { useState } from "react";

const AI_URL = import.meta.env.VITE_AI_URL || "http://localhost:3333/api/v1/ai";
const AI_TOKEN = import.meta.env.VITE_AI_TOKEN || "";

export default function AssistenteChat() {
  const [aberto, setAberto] = useState(false);
  const [texto, setTexto] = useState("");
  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    const mensagem = texto.trim();
    if (!mensagem || carregando) return;
    setTexto("");
    const historico = [...mensagens, { role: "user", text: mensagem }];
    setMensagens(historico);
    setCarregando(true);
    try {
      const res = await fetch(`${AI_URL}/assistant/chat`, { method: "POST", headers: { "Content-Type": "application/json", ...(AI_TOKEN && { "x-ai-token": AI_TOKEN }) }, body: JSON.stringify({ message: mensagem, history: historico.slice(-10), audience: "admin" }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Assistente indisponível.");
      setMensagens((atual) => [...atual, { role: "model", text: data.resposta }]);
    } catch (error) { setMensagens((atual) => [...atual, { role: "model", text: error.message }]); }
    finally { setCarregando(false); }
  }

  return <div className="fixed bottom-5 right-5 z-50">{aberto && <div className="mb-3 flex h-[420px] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200"><div className="bg-[#7350B9] p-4 text-white"><strong>Assistente administrativo</strong><p className="text-xs opacity-80">Ajuda sobre o painel e operações</p></div><div className="flex-1 space-y-2 overflow-y-auto p-3 text-sm">{mensagens.length === 0 && <p className="text-gray-500">Posso explicar as telas, regras e operações administrativas.</p>}{mensagens.map((item, i) => <p key={i} className={`rounded-lg p-2 ${item.role === "user" ? "ml-6 bg-purple-50" : "mr-6 bg-gray-100"}`}>{item.text}</p>)}{carregando && <p className="text-gray-400">Pensando...</p>}</div><form onSubmit={enviar} className="flex gap-2 border-t p-3"><input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Digite sua dúvida..." className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm" /><button className="rounded-lg bg-[#7350B9] px-3 text-white">Enviar</button></form></div>}<button onClick={() => setAberto((v) => !v)} className="rounded-full bg-[#7350B9] px-5 py-3 font-semibold text-white shadow-lg">{aberto ? "Fechar" : "Assistente"}</button></div>;
}
