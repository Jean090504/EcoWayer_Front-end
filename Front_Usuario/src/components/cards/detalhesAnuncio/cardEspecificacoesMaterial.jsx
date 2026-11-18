import { Archive } from "lucide-react"

export default function CardEspecificacoesMaterial({ anuncio }) {
    return (
        <section className = "flex-1 rounded-[26px] bg-white p-6 shadow-sm sm:p-8">
            <h2 className = "mb-7 flex items-center gap-2 text-base font-semibold text-[#724BC2]">
                <Archive size = {18} />
                Especificações do material
            </h2>

            <dl className = "grid grid-cols-2 gap-2">
                <div className = "w-full">
                    <dt className = "text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                        Volume / peso
                    </dt>
                    <dd className = "mt-1 text-lg font-bold">{anuncio.peso}</dd>
                    <dd className = "mt-1 text-xs text-gray-500">{anuncio.quantidade}</dd>
                </div>

                <div className = "w-full">
                    <dt className = "text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                        Estado
                    </dt>
                    <dd className = "mt-1 text-lg font-bold text-[#4CAF50] capitalize">
                        {anuncio.estado}
                    </dd>
                    <dd className = "mt-1 text-xs text-gray-500">{anuncio.conservacao}</dd>
                </div>
            </dl>
        </section>
    )
}
