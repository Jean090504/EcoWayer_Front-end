import { ArrowRight } from "lucide-react"

export default function CardRecompensa({ recompensa, onResgatar }) {
  const { categoria, titulo, descricao, imagem, pontos } = recompensa

  return (
    <div className="flex flex-col rounded-xl bg-[#F8F8F8] p-4">
      <div className="flex gap-3">
        <img
          src={imagem}
          alt={titulo}
          className="h-14 w-14 shrink-0 rounded-lg object-cover"
        />

        <div className="flex flex-col items-start gap-0.5">
          <span className="rounded-full bg-[#ECECEC] px-2 py-0.5 text-[10px] text-[#3E4A3D]">
            {categoria}
          </span>
          <p className="text-[12px] font-semibold leading-snug text-[#191C1E]">{titulo}</p>
          <p className="text-[11px] leading-snug text-[#3E4A3D]">{descricao}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
        <p className="text-[14px] font-extrabold text-[#4CAF50]">
          {pontos} <span className="text-[11px] font-semibold">pts</span>
        </p>

        <button
          onClick={() => onResgatar(recompensa)}
          className="flex items-center gap-1 rounded-md bg-[#4CAF50] px-3 py-1.5 text-[11px] font-semibold text-white cursor-pointer"
        >
          Resgatar
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  )
}