import { useState } from "react"
import { Star, ArrowRight } from "lucide-react"

export default function CardBase({ beneficio, onResgatar }) {
  const [aberto, setAberto] = useState(false)

  const { imagem, selo, aviso, categoria, pontos, titulo, descricao, nota, resgates } = beneficio

  function resgatar(e) {
    e.stopPropagation()
    onResgatar(beneficio)
  }

  return (
    <div
      onClick={() => setAberto(!aberto)}
      className="flex w-full cursor-pointer flex-col rounded-3xl bg-white p-4"
    >
      {/* Imagem com selo e aviso por cima */}
      <div className="relative">
        <img
          src={imagem}
          alt={titulo}
          className="h-[225px] w-full rounded-2xl object-cover"
        />
        <span className="absolute right-2 top-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#4CAF50]">
          {selo}
        </span>
        <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[11px] text-white">
          {aviso}
        </span>
      </div>

      {/* Categoria e pontos */}
      <div className="mt-4 flex flex-row items-center justify-between">
        <p className="text-[11px] font-semibold uppercase text-[#4CAF50]">{categoria}</p>
        <p className="text-[18px] font-bold text-[#4CAF50]">
          {pontos.toLocaleString("pt-BR")} pts
        </p>
      </div>

      {/* Título */}
      <p className="mt-1 text-[18px] font-bold text-[#191C1E]">{titulo}</p>

      {/* Descrição: só aparece ao clicar no card */}
      {aberto && (
        <p className="mt-2 text-[12px] text-[#3E4A3D]">{descricao}</p>
      )}

      {/* Rodapé */}
      <div className="mt-auto flex flex-row items-center justify-between pt-4">
        <p className="flex items-center gap-1.5 text-[12px] text-[#3E4A3D]">
          <Star size={14} className="text-[#F5A623]" />
          <span className="font-bold text-[#191C1E]">{nota}</span>
          ({resgates.toLocaleString("pt-BR")} resgates)
        </p>

        <button
          onClick={resgatar}
          className="flex items-center gap-1.5 rounded-lg bg-[#4CAF50] px-5 py-2 text-[13px] font-semibold text-white cursor-pointer"
        >
          Resgatar
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}