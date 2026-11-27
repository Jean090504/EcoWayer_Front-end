import { ArrowLeft, MapPin, UserRound } from 'lucide-react'
import CardOutrosAnunciosVendedor from '../components/cards/detalhesAnuncio/cardOutrosAnunciosVendedor.jsx'

export default function AnunciosVendedor({ anuncio, onVoltar, onAbrirAnuncio, favoritos, favoritar }) {
    const nome = anuncio.vendedor?.nome || anuncio.vendedor_nome || 'Anunciante'
    const local = [anuncio.cidade_exibicao, anuncio.uf_exibicao].filter(Boolean).join(' - ')

    return (
        <div className="flex-1 bg-[#FAF8FF] text-[#191C30]">
            <div className="mx-auto w-[90%] max-w-[1200px] py-8 sm:w-[80%]">
                <button type="button" onClick={onVoltar} className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm hover:text-[#724BC2]">
                    <ArrowLeft size={16} /> Voltar ao anúncio
                </button>
                <div className="mb-7 flex items-center gap-4 rounded-3xl border border-[#EDE6F4] bg-white p-5 shadow-sm sm:p-7">
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#EEE8FA] text-[#724BC2]"><UserRound size={30} aria-hidden="true" /></span>
                    <div className="min-w-0"><p className="text-sm font-semibold text-[#724BC2]">Perfil do anunciante</p><h1 className="truncate text-2xl font-bold sm:text-3xl">{nome}</h1>{local && <p className="mt-1 flex items-center gap-1 text-sm text-[#635C6B]"><MapPin size={15} aria-hidden="true" />{local}</p>}</div>
                </div>
                <h2 className="mb-2 text-xl font-bold">Anúncios de {nome}</h2>
                <CardOutrosAnunciosVendedor anuncio={anuncio} mostrarTodos favoritos={favoritos} favoritar={favoritar} onAbrirAnuncio={onAbrirAnuncio} />
            </div>
        </div>
    )
}
