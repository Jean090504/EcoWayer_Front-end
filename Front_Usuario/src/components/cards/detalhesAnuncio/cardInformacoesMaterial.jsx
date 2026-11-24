const CONDICOES = {
    1: "Excelente",
    2: "Bom",
    3: "Regular",
}

export default function CardEspecificacoesMaterial({ anuncio }) {
    console.log(anuncio);
    return (
        <section className = "flex-1 rounded-[26px] bg-white p-6 shadow-sm sm:p-8">
            <h1 className = "mb-7 flex items-center gap-2 text-base font-semibold text-[#724BC2] text-[22px]">
                Informações do material
            </h1>

            <dl className = "grid grid-cols-2 gap-2">
                <div className = "w-full">
                    <dt className = "text-[14px] font-semibold uppercase tracking-wide text-gray-600">
                        Peso
                    </dt>
                    <dd className = "mt-1 text-lg font-bold">{anuncio.peso}</dd>
                    <dd className = "mt-1 text-xs text-gray-500">{anuncio.quantidade}</dd>
                </div>

                <div className = "w-full">
                    <dt className = "text-[14px] font-semibold uppercase tracking-wide text-gray-600">
                        Estado
                    </dt>
                    <dd className = "mt-1 text-lg font-bold text-[#4CAF50] capitalize bg-blue">
                        {CONDICOES[anuncio.id_condicao_item]}
                    </dd>
                    <dd className = "mt-1 text-xs text-gray-500">{anuncio.conservacao}</dd>
                </div>
            </dl>
        </section>
    )
}
