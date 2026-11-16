import { History } from "lucide-react"

export default function CardHistoricoPontuacao() {
  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[24px] font-bold text-[#191C1E]">
          <History size={22} className="text-[#4CAF50]" />
          Histórico Recente de Pontuação
        </h2>

      </div>

      <div className="mt-5 flex flex-col rounded-3xl bg-white">
        {
          <p className="py-10 text-center text-[13px] text-[#3E4A3D]">
            Nenhuma transação desse tipo.
          </p>
        }
      </div>

      <div className="mt-4 flex items-center justify-between text-[12px]">
        <p className="text-[#3E4A3D]">
          Nenhuma transação disponível. O backend ainda não possui o endpoint de pontuação.
        </p>

      </div>
    </section>
  )
}
