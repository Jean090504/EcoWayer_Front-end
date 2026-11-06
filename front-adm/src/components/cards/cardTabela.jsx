import CardBotaoTabela from "./cardBotaoTabela.jsx"
import TextoTabela from "../ui/textoTabela.jsx"

const formatarMultiplicador = (condicoes, nome) => {
  const item = condicoes.find((c) => c.nome === nome)
  return item ? `${Number(item.multiplicador).toFixed(1)}x` : "—"
}

export default function CardTabela({ regra, onAlternarStatus, onEditar }) {
  const { categoria, pontos_base, condicao, status } = regra

  return (
    <div
      onClick={onEditar}
      className={`w-full flex flex-row items-center justify-between py-4 px-4 border-b border-[#F3F4F6] cursor-pointer hover:bg-[#FAFAFA] ${status ? "" : "opacity-60"}`}
    >

      <div className="flex flex-row items-center gap-2 w-[clamp(100px,12vw,150px)]">
        <div className="w-[10px] h-[10px] rounded-full shrink-0" style={{ backgroundColor: categoria.cor }}></div>
        <span className="text-[clamp(12px,0.8vw,16px)] font-medium text-[#202735]">{categoria.nome}</span>
      </div>

      <span className="w-[clamp(80px,8vw,100px)] text-center text-[clamp(12px,0.8vw,16px)] font-bold text-[#202735]">{pontos_base}</span>

      <div className="w-[clamp(150px,20vw,250px)] flex flex-row justify-center items-center gap-2">
        <TextoTabela texto={formatarMultiplicador(condicao, "Excelente")} corTexto="text-[#2E8B57]" background="bg-[#E8F5E9]" />
        <TextoTabela texto={formatarMultiplicador(condicao, "Bom")} corTexto="text-[#B8860B]" background="bg-[#FFF8E1]" />
        <TextoTabela texto={formatarMultiplicador(condicao, "Regular")} corTexto="text-[#6B7280]" background="bg-[#F3F4F6]" />
      </div>

      <div
        className="w-[clamp(80px,8vw,100px)] flex flex-row justify-end items-center gap-3 pr-2"
        onClick={(e) => e.stopPropagation()}
      >
        <CardBotaoTabela ativo={status} onClick={onAlternarStatus} />
      </div>

    </div>
  )
}