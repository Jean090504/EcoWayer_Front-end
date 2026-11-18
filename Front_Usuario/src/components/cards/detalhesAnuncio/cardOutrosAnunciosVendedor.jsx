import { ArrowRight } from "lucide-react"
import CardAnuncioRelacionado from "./cardAnuncioRelacionado"

export default function CardOutrosAnunciosVendedor({
    anuncio,
    favoritos,
    demonstrar,
    favoritar,
    onAbrirAnuncio
}) {
    return (
        <section className = "pb-2 pt-3">
            <div className = "mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className = "text-lg font-semibold">
                    Outros anúncios em destaque deste vendedor
                </h2>

                <button
                    type = "button"
                    onClick = {() => demonstrar('Todos os anúncios do vendedor')}
                    className = "flex items-center gap-1 text-xs font-medium text-[#724BC2] hover:underline"
                >
                    Ver todos os itens de {anuncio.vendedor?.nome?.split(' ')[0] || 'anunciante'}
                    <ArrowRight size = {14} />
                </button>
            </div>

            <div className = "grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
                {anuncio.outrosAnuncios.map(item => (
                    <CardAnuncioRelacionado
                        key = {item.id}
                        anuncio = {item}
                        favoritado = {favoritos.includes(item.id)}
                        onFavoritar = {() => favoritar(item.id)}
                        onAbrir = {() => onAbrirAnuncio(item)}
                    />
                ))}
            </div>
        </section>
    )
}