import { Star, Lock } from "lucide-react"

export default function CardStatusDoador({
  nivel,
  nomeNivel,
  proximaMeta,
  pontosAtuais,
  pontosMeta,
}) {
  const porcentagem = Math.min(100, Math.round((pontosAtuais / pontosMeta) * 100))
  const faltam = Math.max(0, pontosMeta - pontosAtuais)

  return (
    <div className="flex flex-col bg-white rounded-2xl p-6">
      {/* Topo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#724BC2]">
            <Star size={20} className="text-white" />
          </div>

          <div className="flex flex-col">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#3E4A3D]">
              Status de Doador
            </p>
            <p className="text-[16px] font-semibold text-[#191C1E]">
              Nível {nivel}: {nomeNivel}
            </p>
          </div>
        </div>

        <span className="rounded-full bg-[#4CAF50] px-2 py-0.5 text-[11px] font-semibold text-white">
          {porcentagem}%
        </span>
      </div>

      {/* Meta */}
      <div className="mt-5 flex items-center justify-between text-[12px] text-[#3E4A3D]">
        <p>
          Próxima meta: <span className="text-[#191C1E]">{proximaMeta}</span>
        </p>
        <p className="font-semibold text-[#724BC2]">
          {pontosAtuais.toLocaleString("pt-BR")} / {pontosMeta.toLocaleString("pt-BR")}
        </p>
      </div>

      {/* Barra de progresso */}
      <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-[#724BC2]"
          style={{ width: `${porcentagem}%` }}
        />
      </div>

      {/* Aviso */}
      <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#724BC2] p-4 text-[13px] text-white">
        <Lock size={16} className="shrink-0" />
        <p>
          Faltam {faltam} pts para desbloquear a bonificação de 2x em entregas de
          vidro e frete grátis na loja circular.
        </p>
      </div>
    </div>
  )
}