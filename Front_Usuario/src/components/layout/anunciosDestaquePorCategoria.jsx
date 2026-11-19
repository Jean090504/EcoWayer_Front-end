import { useMemo, useRef } from "react"

const MODALIDADES = [
    { id: 1, titulo: "Mais recentes" },
    { id: 2, titulo: "Mais recentes em Troca" },
    { id: 3, titulo: "Mais recentes em Doação" }
]

function formatarPreco(anuncio) {
    if (!anuncio.preco || Number(anuncio.preco) === 0) return "Doação / troca"
    return Number(anuncio.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function CardAnuncio({ anuncio, onAbrir }) {
    return <article className="w-[clamp(160px,17vw,230px)] min-w-[clamp(160px,17vw,230px)] shrink-0 snap-start">
        <button type="button" onClick={() => onAbrir?.(anuncio)} className="block w-full text-left">
            <div className="h-[clamp(160px,17vw,230px)] overflow-hidden rounded-xl bg-gray-100">
                <img src={anuncio.imagem || `https://placehold.co/400x400?text=${encodeURIComponent(anuncio.nome)}`} alt={anuncio.nome} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <h3 className="mt-3 truncate text-sm font-semibold text-gray-800">{anuncio.nome}</h3>
            <p className="truncate text-base font-bold text-[#4CAF50]">{formatarPreco(anuncio)}</p>
            <p className="mt-1 text-[11px] text-gray-500">{anuncio.status || "ativo"}</p>
        </button>
    </article>
}

function Carrossel({ titulo, anuncios, onAbrirAnuncio }) {
    const ref = useRef(null)
    return <section className="w-full py-4">
        <div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-semibold text-gray-800">{titulo}</h2><div className="flex gap-2"><button type="button" onClick={() => ref.current?.scrollBy({ left: -300, behavior: "smooth" })} className="rounded-full border px-3 py-1">‹</button><button type="button" onClick={() => ref.current?.scrollBy({ left: 300, behavior: "smooth" })} className="rounded-full border px-3 py-1">›</button></div></div>
        <div ref={ref} className="flex gap-4 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{anuncios.map(anuncio => <CardAnuncio key={anuncio.id} anuncio={anuncio} onAbrir={onAbrirAnuncio} />)}</div>
    </section>
}

export default function AnunciosDestaquePorCategoria({ anuncios = [], onAbrirAnuncio }) {
    const agrupados = useMemo(() => MODALIDADES.map(modalidade => ({ ...modalidade, anuncios: anuncios.filter(anuncio => modalidade.id === 1 || Number(anuncio.id_modalidade) === modalidade.id) })), [anuncios])
    return <div className="flex w-full flex-col gap-6">{agrupados.filter(grupo => grupo.anuncios.length > 0).map(grupo => <Carrossel key={grupo.id} titulo={grupo.titulo} anuncios={grupo.anuncios} onAbrirAnuncio={onAbrirAnuncio} />)}</div>
}