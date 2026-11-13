import { Leaf, Archive, RefreshCw, Laptop, CalendarClock, Lock } from "lucide-react"

import CardProgresso from "../components/cards/insignia/cardProgresso"
import CardInsignia from "../components/cards/insignia/cardInsignia"

export default function Insignias() {
  return (
    <main className="flex w-full flex-1 justify-center bg-[#FAF8FF]">
      <div className="flex w-[85%] flex-col gap-8 px-6 py-15">
        <h1 className="text-[30px] font-bold">Jornada Circular &amp; Insígnias</h1>

        <CardProgresso
          nivel={4}
          patente="Guardião Circular"
          xpAtual={3420}
          xpMeta={4000}
          bonus={25}
        />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full bg-[#6F4BBF] px-4 py-2 text-xs font-semibold text-white">
              Todas as Insígnias (24)
            </button>
            <button className="rounded-full bg-white px-4 py-2 text-xs font-semibold">
              Conquistadas (12)
            </button>
            <button className="rounded-full bg-white px-4 py-2 text-xs font-semibold">
              Em Progresso (6)
            </button>
            <button className="rounded-full bg-white px-4 py-2 text-xs font-semibold">
              Bloqueadas (6)
            </button>
          </div>

          <p className="text-xs text-gray-500">
            Ordenado por: Relevância de Conquista
          </p>
        </div>

        {/* 3 cards por linha */}
        <section className="grid grid-cols-3 gap-6">
          <CardInsignia
            status="conquistado"
            icon={<Leaf size={24} />}
            badge="Conquistado"
            category="Primeira Coleta"
            title="Primeiro Passo Verde"
            footerLeft="Desbloqueado em 14/04/2024"
            footerRight="+150 XP"
          />

          <CardInsignia
            status="conquistado"
            icon={<Archive size={24} />}
            badge="Conquistado"
            category="Ciclo do Papel"
            title="Guardião da Celulose"
            footerLeft="58 / 50 kg reciclados"
            footerRight="+300 XP"
          />

          <CardInsignia
            status="conquistado"
            icon={<RefreshCw size={24} />}
            badge="Conquistado"
            category="Comércio Circular"
            title="Mestre do Reuso"
            footerLeft="5 / 5 transações"
          />

          <CardInsignia
            status="em_progresso"
            icon={<Laptop size={24} />}
            badge="Faltam 3 descartes"
            title="Muralha do E-Lixo"
            description="Descarte consciente de 10 itens eletrônicos, cabos ou periféricos em pontos com destinação segura."
            progress={{ label: "7 de 10 descartes", value: 7, total: 10 }}
            footerLeft="Recompensa: +450 XP"
            footerRight="EcoPonto sugerido ›"
          />

          <CardInsignia
            status="em_progresso"
            icon={<CalendarClock size={24} />}
            badge="Em andamento"
            title="Sequência Ecológica 30 Dias"
            description="Registre pelo menos uma ação regenerativa por semana durante um mês consecutivo."
            progress={{ label: "3 de 4 semanas ativas", value: 3, total: 4 }}
            footerLeft="Expira em: 6 dias"
            footerRight="+350 XP"
          />

          <CardInsignia
            status="bloqueado"
            icon={<Lock size={24} />}
            badge="Bloqueado (Requer Nível 5)"
            title="Voz da Comunidade"
            description="Ajude a cadastrar, validar e auditar voluntariamente um novo EcoPonto comunitário em seu bairro."
            footerLeft="Expira em: 6 dias"
            footerRight="+350 XP"
          />
        </section>
      </div>
    </main>
  )
}