import { Heart, ImageOff } from 'lucide-react'
import { useState } from 'react'

export default function CardAnuncioRelacionado({ anuncio, favoritado, onFavoritar, onAbrir }) {
    const [fotoComErro, setFotoComErro] = useState(null)
    const modalidade = String(anuncio.modalidade_nome || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    const preco = Number(anuncio.preco)
    let textoPreco = 'Preço não informado'
    if (modalidade === 'doacao') textoPreco = 'Doação'
    else if (modalidade === 'troca') textoPreco = 'Troca'
    else if (Number.isFinite(preco) && preco > 0) textoPreco = preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    return (
        <article className="relative overflow-hidden rounded-[24px] bg-white p-2 shadow-sm transition hover:shadow-md">
            <button
                type="button"
                onClick={onAbrir}
                aria-label={'Ver anúncio: ' + anuncio.nome}
                className="block w-full text-left"
            >
                {anuncio.imagem && anuncio.imagem !== fotoComErro ? <img
                    src={anuncio.imagem}
                    alt={anuncio.nome}
                    loading="lazy"
                    onError={() => setFotoComErro(anuncio.imagem)}
                    className="aspect-[1.15] w-full rounded-[18px] object-cover"
                /> : <div className="flex aspect-[1.15] items-center justify-center rounded-[18px] bg-gray-100 text-gray-400"><ImageOff size={24} aria-label="Foto indisponível" /></div>}
                <div className="px-1 py-3">
                    <h3 className="text-base font-semibold">{anuncio.nome}</h3>
                    <p className="mt-1 text-lg font-bold text-[#4CAF50]">{textoPreco}</p>
                    {anuncio.categoria && <p className="mt-2 text-xs text-gray-500">{anuncio.categoria}</p>}
                </div>
            </button>
            {onFavoritar && <button
                type="button"
                onClick={onFavoritar}
                aria-label={(favoritado ? 'Desfavoritar ' : 'Favoritar ') + anuncio.nome}
                aria-pressed={favoritado}
                className="absolute right-4 top-4 rounded-full bg-white/95 p-1.5 text-gray-500"
            >
                <Heart size={17} className={favoritado ? 'fill-red-500 text-red-500' : ''} />
            </button>}
        </article>
    )
}
