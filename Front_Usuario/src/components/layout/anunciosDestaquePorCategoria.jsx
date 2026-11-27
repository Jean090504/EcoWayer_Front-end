import { useState } from "react"
import { Heart, ImageOff, MapPin } from "lucide-react"

function preco(anuncio) {
    const modalidade = String(anuncio.modalidade_nome || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    if (modalidade === 'doacao') return 'Doação'
    if (modalidade === 'troca') return 'Troca'
    const valor = Number(anuncio.preco)
    return valor > 0 ? valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'A combinar'
}

function CardAnuncio({ anuncio, onAbrir, favoritado, onFavoritar }) {
    const [imagemComErro, setImagemComErro] = useState(false)
    const local = [anuncio.cidade_exibicao, anuncio.uf_exibicao].filter(Boolean).join(' - ')
    return (
        <article className="group relative min-w-0 overflow-hidden rounded-2xl border border-[#ECE8F1] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <button type="button" onClick={() => onAbrir?.(anuncio)} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[#724BC2]">
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#F0EDF4]">
                    {anuncio.imagem && !imagemComErro
                        ? <img src={anuncio.imagem} alt={anuncio.nome} loading="lazy" onError={() => setImagemComErro(true)} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
                        : <span className="flex flex-col items-center gap-2 px-3 text-center text-xs font-medium text-[#746B7D]"><ImageOff size={30} aria-hidden="true" />Imagem indisponível</span>}
                </div>
                <div className="space-y-2 p-4">
                    <p className="text-xs font-semibold text-[#6D6476]">{anuncio.categoria}{anuncio.condicao_nome ? ` · ${anuncio.condicao_nome}` : ''}</p>
                    <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-bold leading-snug text-[#24202A]">{anuncio.nome}</h3>
                    <p className="text-xl font-extrabold text-[#278247]">{preco(anuncio)}</p>
                    {local && <p className="flex items-center gap-1.5 text-xs text-[#635C6B]"><MapPin size={14} aria-hidden="true" />{local}</p>}
                    {anuncio.vendedor_nome && <p className="truncate border-t border-[#F0EDF4] pt-2 text-xs text-[#635C6B]">Por {anuncio.vendedor_nome}</p>}
                </div>
            </button>
            {onFavoritar && <button type="button" onClick={() => onFavoritar(anuncio.id)} aria-label={`${favoritado ? 'Remover dos favoritos' : 'Favoritar'}: ${anuncio.nome}`} aria-pressed={favoritado} className="absolute right-3 top-3 rounded-full bg-white/95 p-2.5 text-[#724BC2] shadow-sm focus-visible:outline-2 focus-visible:outline-[#724BC2]"><Heart size={19} fill={favoritado ? 'currentColor' : 'none'} aria-hidden="true" /></button>}
        </article>
    )
}

export default function AnunciosDestaquePorCategoria({ anuncios = [], onAbrirAnuncio, favoritos = [], onFavoritar, mostrarFavoritos }) {
    return (
        <section className="w-full py-2" aria-label={mostrarFavoritos ? 'Anúncios favoritos' : 'Anúncios disponíveis'}>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div><p className="mb-1 text-sm font-semibold text-[#724BC2]">ECOMARKET</p><h2 className="text-2xl font-extrabold text-[#24202A] sm:text-3xl">{mostrarFavoritos ? 'Seus favoritos' : 'Encontre algo para dar nova vida'}</h2><p className="mt-2 text-sm text-[#635C6B]">Explore itens de pessoas em diferentes cidades.</p></div>
                <span className="rounded-full bg-[#F1EBFC] px-4 py-2 text-sm font-semibold text-[#5D3B9D]">{anuncios.length} {anuncios.length === 1 ? 'anúncio' : 'anúncios'}</span>
            </div>
            <div className="grid grid-cols-1 gap-5 min-[430px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {anuncios.map(anuncio => <CardAnuncio key={anuncio.id} anuncio={anuncio} onAbrir={onAbrirAnuncio} favoritado={favoritos.includes(String(anuncio.id))} onFavoritar={onFavoritar} />)}
            </div>
        </section>
    )
}
