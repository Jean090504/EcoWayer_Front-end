import { MapPin, ChevronRight } from "lucide-react"

export default function CardEcoPonto({ nome = "EcoPonto Central Lapa", distancia = "1.8", horarioFuncionamento = "18", onClick }) {
    return (
        <button
            onClick = {onClick}
            className = "flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm"
        >
            <span className = "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8F9FB] text-[#6F2DBD]">
                <MapPin size = {18} />
            </span>

            <div className = "flex flex-1 flex-col">
                <p className = "text-xs font-semibold text-[#191C1E]">
                    {nome}
                </p>

                <p className = "text-xs text-gray-600">
                    {distancia}km de você • Aberto até {horarioFuncionamento}h
                </p>
            </div>

            <span className = "flex h-7 w-7 items-center justify-center rounded-full bg-[#F8F9FB]">
                <ChevronRight size = {14} />
            </span>
        </button>
    )
}