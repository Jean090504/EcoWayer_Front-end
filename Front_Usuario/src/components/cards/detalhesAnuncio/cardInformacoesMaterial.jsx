const CONDICOES = {
    1: "Excelente",
    2: "Bom",
    3: "Regular",
}

export default function CardEspecificacoesMaterial({ anuncio }) {
    const quantidade = Number(anuncio.quantidade) > 0 ? `${Number(anuncio.quantidade).toLocaleString('pt-BR')} ${anuncio.unidade || 'un'}` : null
    const peso = !quantidade && Number(anuncio.peso_kg) > 0 ? `${Number(anuncio.peso_kg).toLocaleString('pt-BR')} kg` : null
    return (
        <section className = "flex-1 rounded-[26px] bg-white p-6 shadow-sm sm:p-8">
            <h2 className = "mb-7 text-[22px] font-semibold text-[#724BC2]">Detalhes do item</h2>

            <dl className = "grid grid-cols-2 gap-5">
                <div className = "w-full">
                    <dt className = "text-[14px] font-semibold uppercase tracking-wide text-gray-600">
                        Categoria
                    </dt>
                    <dd className = "mt-1 text-lg font-bold">{anuncio.categoria || 'Não informada'}</dd>
                </div>

                <div className = "w-full">
                    <dt className = "text-[14px] font-semibold uppercase tracking-wide text-gray-600">
                        Estado
                    </dt>
                    <dd className = "mt-1 text-lg font-bold text-[#278247]">{anuncio.condicao_nome || CONDICOES[anuncio.id_condicao_item] || 'Não informado'}</dd>
                    <dd className = "mt-1 text-xs text-gray-500">{anuncio.conservacao}</dd>
                </div>
                {(quantidade || peso) && <div><dt className="text-[14px] font-semibold uppercase tracking-wide text-gray-600">{quantidade ? 'Quantidade' : 'Peso'}</dt><dd className="mt-1 text-lg font-bold">{quantidade || peso}</dd></div>}
            </dl>
        </section>
    )
}
