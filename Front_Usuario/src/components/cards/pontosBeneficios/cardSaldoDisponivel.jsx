import { Leaf } from "lucide-react"

export default function CardSaldoDisponivel({ saldo, porcentagem, nivelAtual, descartes, resgates, onGanharPontos,}) {
  return (
    <div className="flex w-full flex-row items-center justify-between rounded-3xl bg-white p-10">
      <div className="flex flex-col">
        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-[#4CAF50] px-3 py-1 text-[12px] font-bold uppercase text-white">
          <Leaf size={12} />
          Saldo Disponível
        </span>

        <p className="mt-4 text-[44px] font-extrabold leading-none text-[#191C1E]">
          {saldo.toLocaleString("pt-BR")}{" "}
          <span className="text-[25px] font-bold text-[#4CAF50]">EcoPontos</span>
        </p>

        <p className="mt-6 text-[15px] font-semibold text-[#4CAF50]">{porcentagem}% concluído</p>

        <div className="mt-1 h-2 w-40 rounded-full bg-[#E8EAF6]">
          <div
            className="h-2 rounded-full bg-[#4CAF50]"
            style={{ width: `${porcentagem}%` }}
          />
        </div>

        <p className="mt-2 text-[14px] font-semibold text-[#3E4A3D]">
          Nível Atual: {nivelAtual.toLocaleString("pt-BR")} pts
        </p>
      </div>

      <div className="flex flex-col items-center gap-5">
        <button
          onClick={onGanharPontos}
          className="rounded-full bg-[#724BC2] px-8 py-3 text-[16px] font-semibold text-white cursor-pointer"
        >
          Como ganhar mais pontos
        </button>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <p className="text-[12px] text-[#3E4A3D]">Descartes</p>
            <p className="text-[20px] font-bold text-[#4CAF50]">{descartes} un</p>
          </div>

          <div className="h-8 w-px bg-[#724BC2]" />

          <div className="flex flex-col items-center">
            <p className="text-[11px] text-[#3E4A3D]">Resgates</p>
            <p className="text-[18px] font-bold text-[#724BC2]">{resgates} vezes</p>
          </div>
        </div>
      </div>
    </div>
  )
}