import { ShieldCheck, Settings, Award } from "lucide-react"

export default function CardProgresso({nivel, patente, xpAtual, xpMeta, bonus}){
  const porcentagem = Math.min(100, Math.round((xpAtual / xpMeta) * 100))

  return (
    <div className="flex w-full flex-row items-center justify-between gap-10 rounded-3xl bg-white p-8">
      <div className="flex items-center gap-5">

        <div className="relative">
          
          <div className="rounded-2xl bg-gradient-to-br from-[#724BC2] to-[#4CAF50] p-[3px] shadow-md">
            <div className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-[13px] bg-white">
              <ShieldCheck size={26} className="text-[#724BC2]" />
              <p className="text-[10px] font-bold text-[#2E7D32]">LVL {nivel}</p>
            </div>
          </div>

          <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#4CAF50]">
            <Settings size={16} className="text-white" />
          </span>
        </div>

        <div className="flex flex-col">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#724BC2]">
            Patente atual
          </p>
          <p className="text-[26px] font-bold text-[#191C1E]">{patente}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between text-[12px] text-[#3E4A3D]">
          <p>Progresso de Experiência</p>
          <p>
            <span className="text-[14px] font-bold text-[#191C1E]">
              {xpAtual.toLocaleString("pt-BR")}
            </span>{" "}
            / {xpMeta.toLocaleString("pt-BR")} XP
          </p>
        </div>

        <div className="h-2.5 w-full rounded-full bg-gray-200">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-[#724BC2] to-[#4CAF50]"
            style={{ width: `${porcentagem}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 rounded-xl bg-[#724BC2] px-6 py-4 text-white">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide">
          <Award size={14} />
          Bônus ativo
        </p>
        <p className="text-[20px] font-bold">+{bonus}% EcoPontos</p>
      </div>
    </div>
  )
}