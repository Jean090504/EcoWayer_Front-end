export default function BotaoFiltro({ texto, ativo, onClick }) {
  return (
    <button 
      onClick = {onClick}
      className = {`flex-1 py-2 text-[16px] font-semibold rounded-full cursor-pointer transition-colors ${
        ativo ? "bg-[#FFFFFF] text-[#7350B9] shadow-sm" : "text-[#FFFFFF] hover:bg-[#6342a3]"
      }`}
    >
      {texto}
    </button>
  )
}