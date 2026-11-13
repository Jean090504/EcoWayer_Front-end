import { useState } from "react"

const AI_URL = import.meta.env.VITE_AI_URL || "http://localhost:3333/api/v1/ai"
const AI_TOKEN = import.meta.env.VITE_AI_TOKEN || ""

export default function AssistenteChat() {
  const [aberto, setAberto] = useState(false)
  const [mensagem, setMensagem] = useState("")
  const [historico, setHistorico] = useState([])
  const [carregando, setCarregando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    const texto = mensagem.trim()
    if (!texto || carregando) return
    setMensagem("")
    const proximo = [...historico, { role: "user", text: texto }]
    setHistorico(proximo)
    setCarregando(true)
    try {
      const res = await fetch(`${AI_URL}/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(AI_TOKEN && { "x-ai-token": AI_TOKEN }) },
        body: JSON.stringify({ message: texto, history: proximo.slice(-10) }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Não foi possível falar com o assistente.")
      setHistorico((atual) => [...atual, { role: "model", text: data.resposta }])
    } catch (error) {
      setHistorico((atual) => [...atual, { role: "model", text: error.message }])
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {aberto && <div className="mb-3 flex h-[430px] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">
        <div className="bg-green-600 p-4 text-white"><strong>Assistente EcoWayer</strong><p className="text-xs opacity-80">Encontre produtos e entenda a plataforma</p></div>
        <div className="flex-1 space-y-2 overflow-y-auto p-3 text-sm">{historico.length === 0 && <p className="text-gray-500">Olá! Posso ajudar a encontrar produtos recicláveis ou explicar como usar o EcoWayer.</p>}{historico.map((item, i) => <p key={i} className={`rounded-lg p-2 ${item.role === "user" ? "ml-6 bg-green-50" : "mr-6 bg-gray-100"}`}>{item.text}</p>)}{carregando && <p className="text-gray-400">Pensando...</p>}</div>
        <form onSubmit={enviar} className="flex gap-2 border-t p-3"><input value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Digite sua dúvida..." className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm" /><button className="rounded-lg bg-green-600 px-3 text-white">Enviar</button></form>
      </div>}
      <button onClick={() => setAberto((v) => !v)} className="rounded-full bg-green-600 px-5 py-3 font-semibold text-white shadow-lg">{aberto ? "Fechar" : "Assistente"}</button>
    </div>
  )
}