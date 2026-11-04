import { Check, PauseCircle, Trash2 } from "lucide-react"

export default function CardAcoesAdministrador({
    onAprovar,
    onDesativar,
    onRemover
}) {
    return (
        <div className = "flex flex-col bg-white w-full min-w-0 rounded-lg shadow-md mt-4 p-6">
            <h4 className = "text-[clamp(10px,0.8vw,12px)] font-semibold tracking-wider text-[#8A8A8A] uppercase">Ações do administrador</h4>

            <div className = "flex flex-col gap-4 mt-5 flex-1">
                <button
                    type = "button"
                    onClick = {onAprovar}
                    className = "relative w-full flex-1 min-h-[44px] max-h-[80px] rounded-lg bg-[#65BA69] hover:bg-[#58A85C] text-white text-[clamp(12px,0.95vw,16px)] font-semibold flex items-center justify-center cursor-pointer"
                >
                    <Check size = {18} className = "absolute left-5"/>
                    Aprovar Anúncio
                </button>

                <button
                    type = "button"
                    onClick = {onDesativar}
                    className = "relative w-full flex-1 min-h-[44px] max-h-[80px] rounded-lg bg-[#6D4AB8] hover:bg-[#5E3FA3] text-white text-[clamp(12px,0.95vw,16px)] font-semibold flex items-center justify-center cursor-pointer"
                >
                    <PauseCircle size = {18} className = "absolute left-5"/>
                    Desativar Temporariamente
                </button>

                <button
                    type = "button"
                    onClick = {onRemover}
                    className = "relative w-full flex-1 min-h-[44px] max-h-[80px] rounded-lg bg-[#E53E3E] hover:bg-[#D03232] text-white text-[clamp(12px,0.95vw,16px)] font-semibold flex items-center justify-center cursor-pointer"
                >
                    <Trash2 size = {18} className = "absolute left-5"/>
                    Remover Anúncio e Penalizar
                </button>
            </div>
        </div>
    )
}