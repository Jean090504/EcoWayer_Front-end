export default function CardBase({ titulo, valor, destaque, children, rodape }) {
  return (
    <div className="flex flex-1 flex-col bg-white rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <p className="text-[12px] font-semibold text-[#191C1E]">{titulo}</p>
        {destaque}
      </div>

      <p className="mt-4 text-[40px] leading-none font-extrabold text-[#191C1E]">
        {valor.toLocaleString("pt-BR")}{" "}
        <span className="text-[18px] font-semibold text-[#3E4A3D]">pts</span>
      </p>

      <div className="mt-3 flex-1">{children}</div>

      <div className="mt-6 flex h-[72px] items-center border-t border-gray-200 pt-4">
        <div className="w-full">{rodape}</div>
      </div>
    </div>
  )
}