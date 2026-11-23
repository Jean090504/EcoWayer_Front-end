export default function CardDescricaoDetalhada({ anuncio }) {
    return (
        <section className = "my-7 rounded-[26px] bg-white p-6 shadow-sm sm:p-8">
            <h2 className = "mb-4 text-base font-semibold">
                Descrição
            </h2>

            <p className = "whitespace-pre-line text-[15px] leading-relaxed text-[#3E4A3D]">
                {anuncio.descricao}
            </p>
        </section>
    )
}