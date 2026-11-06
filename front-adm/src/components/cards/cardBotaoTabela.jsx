export default function CardBotaoTabela({ ativo = true, onClick }) {
  return (
    <button
      onClick = {onClick}
      className = {`${ativo ? "bg-[#F43F5E]" : "bg-[#65BA69]"} text-[#FFFFFF] text-[clamp(12px,0.8vw,16px)] font-semibold px-3 py-2 rounded-[8px] cursor-pointer`}
    >
      {ativo ? "Desativar" : "Ativar"}
    </button>
  )
}