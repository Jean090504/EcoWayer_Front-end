import { useEffect, useMemo, useState } from "react"

import Botao from "../components/ui/botao"

import { CardProgresso, CardInsignia } from '../components/cards/insignia'

import { listarInsignias, listarInsigniasUsuario } from "../services/userService"

export default function Insignias() {
  const [filtroAtivo, setFiltroAtivo] = useState("todas")
  const [insignias, setInsignias] = useState([])
  const [erro, setErro] = useState("")

  useEffect(() => {
    Promise.all([listarInsignias(), listarInsigniasUsuario()])
      .then(([catalogo, vinculos]) => {
        const porInsignia = new Map(vinculos.map((item) => [Number(item.id_insignia), item]))
        setInsignias(catalogo.map((item) => {
          const vinculo = porInsignia.get(Number(item.id))
          const progresso = Number(vinculo?.progresso || 0)
          const meta = Number(item.meta || 0)
          const conquistada = String(vinculo?.status || "").toLowerCase().includes("concl") || (meta > 0 && progresso >= meta)
          const status = conquistada ? "conquistado" : vinculo ? "em_progresso" : "bloqueado"
          return {
            id: item.id,
            status,
            badge: conquistada ? "Conquistado" : vinculo ? "Em progresso" : "Bloqueado",
            title: item.nome,
            description: item.descricao,
            progress: meta > 0 ? { label: `${progresso} de ${meta} ${item.unidade || "unidades"}`, value: progresso, total: meta } : null,
            footerLeft: item.unidade ? `Meta: ${item.meta} ${item.unidade}` : "Meta cadastrada no backend",
            footerRight: vinculo?.status || "Disponível",
          }
        }))
      })
      .catch((error) => setErro(error.message))
  }, [])

  const filtros = useMemo(() => [
    { key: "todas", label: `Todas as Insígnias (${insignias.length})` },
    { key: "conquistado", label: `Conquistadas (${insignias.filter((i) => i.status === "conquistado").length})` },
    { key: "em_progresso", label: `Em Progresso (${insignias.filter((i) => i.status === "em_progresso").length})` },
    { key: "bloqueado", label: `Bloqueadas (${insignias.filter((i) => i.status === "bloqueado").length})` },
  ], [insignias])

  const insigniasFiltradas =
    filtroAtivo === "todas"
      ? insignias
      : insignias.filter((i) => i.status === filtroAtivo)

  return (
    <main className="flex w-full flex-1 justify-center bg-[#FAF8FF]">
      <div className="flex w-[85%] flex-col gap-8 px-6 py-8">
        <h1 className="text-[30px] font-bold">Jornada Circular & Insígnias</h1>
        {erro && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{erro}</p>}

        <CardProgresso
          nivel={4}
          patente="Guardião Circular"
          xpAtual={3420}
          xpMeta={4000}
          bonus={25}
        />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {filtros.map((f) => (
              <Botao
                key={f.key}
                onClick={() => setFiltroAtivo(f.key)}
                className={`rounded-full px-4 py-2 text-xs font-semibold cursor-pointer ${
                  filtroAtivo === f.key
                    ? "bg-[#6F4BBF] text-white"
                    : "bg-white text-[#191C1E]"
                }`}
              >
                {f.label}
              </Botao>
            ))}
          </div>
        </div>

        <section className="grid grid-cols-3 items-start gap-6">
          {insigniasFiltradas.map((i) => (
            <CardInsignia key={i.id} {...i} />
          ))}
        </section>
      </div>
    </main>
  )
}
