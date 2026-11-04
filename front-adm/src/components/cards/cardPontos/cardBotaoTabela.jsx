export default function CardBotaoTabela({ onClick }) {
    return (
      <button
        onClick = {onClick}
        className = "bg-[#F43F5E] text-[#FFFFFF] text-[clamp(12px,0.8vw,16px)] font-semibold px-3 py-2 rounded-[8px] cursor-pointer"
      >
        Desativar
      </button>
    )
  }