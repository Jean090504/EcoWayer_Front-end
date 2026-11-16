import { useState } from "react"
import CardProgresso from "../components/cards/insignia/cardProgresso"
import CardInsignia from "../components/cards/insignia/cardInsignia"
import Botao from "../components/ui/botao"

const FILTROS = [
  { key: "todas", label: "Todas as Insígnias (24)" },
  { key: "conquistado", label: "Conquistadas (12)" },
  { key: "em_progresso", label: "Em Progresso (6)" },
  { key: "bloqueado", label: "Bloqueadas (6)" },
]

const INSIGNIAS = [
  {
    id: 1,
    status: "conquistado",
    badge: "Conquistado",
    title: "Primeiro Passo Verde",
    footerLeft: "Desbloqueado em 14/04/2024",
    footerRight: "+150 XP",
  },
  {
    id: 2,
    status: "conquistado",
    badge: "Conquistado",
    title: "Guardião da Celulose",
    footerLeft: "58 / 50 kg reciclados",
    footerRight: "+300 XP",
  },
  {
    id: 3,
    status: "conquistado",
    badge: "Conquistado",
    title: "Mestre do Reuso",
    footerLeft: "5 / 5 transações",
  },
  {
    id: 4,
    status: "em_progresso",
    badge: "Faltam 3 descartes",
    title: "Muralha do E-Lixo",
    description:
      "Descarte consciente de 10 itens eletrônicos, cabos ou periféricos em pontos com destinação segura.",
    progress: { label: "7 de 10 descartes", value: 7, total: 10 },
    footerLeft: "Recompensa: +450 XP",
    footerRight: "EcoPonto sugerido ›",
  },
  {
    id: 5,
    status: "em_progresso",
    badge: "Em andamento",
    title: "Sequência Ecológica 30 Dias",
    description:
      "Registre pelo menos uma ação regenerativa por semana durante um mês consecutivo.",
    progress: { label: "3 de 4 semanas ativas", value: 3, total: 4 },
    footerLeft: "Expira em: 6 dias",
    footerRight: "+350 XP",
  },
  {
    id: 6,
    status: "bloqueado",
    badge: "Bloqueado (Requer Nível 5)",
    title: "Voz da Comunidade",
    description:
      "Ajude a cadastrar, validar e auditar voluntariamente um novo EcoPonto comunitário em seu bairro.",
    footerLeft: "Expira em: 6 dias",
    footerRight: "+350 XP",
  },
]

export default function Insignias() {
  const [filtroAtivo, setFiltroAtivo] = useState("todas")

  const insigniasFiltradas =
    filtroAtivo === "todas"
      ? INSIGNIAS
      : INSIGNIAS.filter((i) => i.status === filtroAtivo)

  return (
    <main className="flex w-full flex-1 justify-center bg-[#FAF8FF]">
      <div className="flex w-[85%] flex-col gap-8 px-6 py-8">
        <h1 className="text-[30px] font-bold">Jornada Circular & Insígnias</h1>

        <CardProgresso
          nivel={4}
          patente="Guardião Circular"
          xpAtual={3420}
          xpMeta={4000}
          bonus={25}
        />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {FILTROS.map((f) => (
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