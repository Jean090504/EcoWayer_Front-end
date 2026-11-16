import { History } from "lucide-react"

export default function CardHistoricoPontuacao({ historico = [] }) {
  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[24px] font-bold text-[#191C1E]">
          <History size={22} className="text-[#4CAF50]" />
          Histórico Recente de Pontuação
        </h2>

      </div>

      <div className="mt-5 flex flex-col rounded-3xl bg-white">
        {historico.length === 0 && <p className="py-10 text-center text-[13px] text-[#3E4A3D]">Nenhuma transação desse tipo.</p>}
        {historico.map((item) => <div key={item.id} className="flex items-center justify-between border-b border-gray-100 px-6 py-4 text-sm last:border-0"><span>{item.titulo}</span><strong className="text-[#4CAF50]">+{item.pontos} pts</strong></div>)}
      </div>

      <div className="mt-4 flex items-center justify-between text-[12px]">
        <p className="text-[#3E4A3D]">
          {historico.length ? `${historico.length} registro(s) carregado(s) do backend.` : "Nenhum registro de pontuação disponível."}
        </p>

      </div>
    </section>
  )
}
