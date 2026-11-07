export default function CardBotaoTabela({ onClick, onEdit, ativo = true }) {
    return (<>
      <button type="button" onClick={onEdit} className="border border-[#65BA69] text-[#65BA69] text-xs font-semibold px-2 py-2 rounded-[8px] cursor-pointer">Editar</button>
      <button
        onClick = {onClick}
        className = {`text-[#FFFFFF] text-[clamp(12px,0.8vw,16px)] font-semibold px-3 py-2 rounded-[8px] cursor-pointer ${ativo ? "bg-[#F43F5E]" : "bg-[#65BA69]"}`}
      >
        {ativo ? "Desativar" : "Ativar"}
      </button></>)
  }
