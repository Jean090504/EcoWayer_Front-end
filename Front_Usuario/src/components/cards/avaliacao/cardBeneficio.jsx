export default function CardBeneficio({ icone: Icone, titulo, descricao }) {
  return (
    <div className="flex flex-1 items-center gap-4 bg-white rounded-2xl p-5">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#4CAF50] shrink-0">
        <Icone size={20} className="text-white" />
      </div>

      <div className="flex flex-col">
        <p className="text-[12px] font-semibold text-[#191C1E]">{titulo}</p>
        <p className="text-[12px] text-[#3E4A3D]">{descricao}</p>
      </div>
    </div>
  )
}