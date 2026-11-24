import { ArrowLeft } from 'lucide-react'
import CardOutrosAnunciosVendedor from '../components/cards/detalhesAnuncio/cardOutrosAnunciosVendedor.jsx'

export default function AnunciosVendedor({ anuncio, onVoltar, onAbrirAnuncio, favoritos, favoritar }) {
    const nome = anuncio.vendedor?.nome

    return (
        <div className="flex-1 bg-[#FAF8FF] text-[#191C30]">
            <div className="mx-auto w-[90%] max-w-[1200px] py-8 sm:w-[80%]">
                <button type="button" onClick={onVoltar} className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm hover:text-[#724BC2]">
                    <ArrowLeft size={16} /> Voltar ao anúncio
                </button>
                <h1 className="text-2xl font-bold sm:text-3xl">{nome ? `Outros anúncios de ${nome}` : 'Outros anúncios do vendedor'}</h1>
                <CardOutrosAnunciosVendedor anuncio={anuncio} favoritos={favoritos} favoritar={favoritar} onAbrirAnuncio={onAbrirAnuncio} />
            </div>
        </div>
    )
}
