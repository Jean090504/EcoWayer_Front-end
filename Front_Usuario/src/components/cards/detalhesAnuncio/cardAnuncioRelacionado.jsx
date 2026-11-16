import { Heart, MapPin, Star } from 'lucide-react';
export default function CardAnuncioRelacionado({ anuncio, favoritado, onFavoritar, onAbrir }) {
 return <article className="relative overflow-hidden rounded-[24px] bg-white p-2 shadow-sm transition hover:shadow-md">
 <button type="button" onClick={onAbrir} aria-label={'Ver anúncio: '+anuncio.nome} className="block w-full text-left"><img src={anuncio.imagem} alt={anuncio.nome} loading="lazy" className="aspect-[1.15] w-full rounded-t-[18px] object-cover"/><div className="px-1 py-3"><h3 className="text-sm font-semibold">{anuncio.nome}</h3><p className="mt-1 font-bold text-[#4CAF50]">{anuncio.preco}</p><div className="mt-2 flex items-center gap-1 text-[11px] text-gray-500"><Star size={12} fill="currentColor" className="text-amber-500"/>{anuncio.avaliacao}<span>·</span><MapPin size={12}/>{anuncio.distancia}</div></div></button>
 <button type="button" onClick={onFavoritar} aria-label={(favoritado?'Desfavoritar ':'Favoritar ')+anuncio.nome} aria-pressed={favoritado} className="absolute right-4 top-4 rounded-full bg-white/95 p-1.5 text-gray-500"><Heart size={17} className={favoritado?'fill-red-500 text-red-500':''}/></button>
 </article>;
}
