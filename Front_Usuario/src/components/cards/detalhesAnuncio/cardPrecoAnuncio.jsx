import { MessageSquare, RefreshCw } from 'lucide-react'

function formatarDataPublicacao(valor) {
    const partes = String(valor || '').match(/^(\d{4})-(\d{2})-(\d{2})/)
    return partes ? `${partes[3]}/${partes[2]}/${partes[1]}` : 'Data não informada'
}

function tempoDecorrido(valor) {
    const data = new Date(String(valor || '').replace(' ', 'T'))
    if (Number.isNaN(data.getTime())) return formatarDataPublicacao(valor)
    const minutos = Math.floor((Date.now() - data.getTime()) / 60000)
    if (minutos < 1) return 'Publicado agora'
    if (minutos < 60) return `Publicado há ${minutos} min`
    const horas = Math.floor(minutos / 60)
    if (horas < 24) return `Publicado há ${horas} ${horas === 1 ? 'hora' : 'horas'}`
    const dias = Math.floor(horas / 24)
    if (dias < 30) return `Publicado há ${dias} ${dias === 1 ? 'dia' : 'dias'}`
    return `Publicado em ${formatarDataPublicacao(valor)}`
}

function textoPreco(anuncio) {
    const modalidade = String(anuncio.modalidade_nome || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    if (modalidade === 'doacao') return 'Grátis (Doação)'
    if (modalidade === 'troca') return 'Troca'
    const preco = Number(anuncio.preco)
    if (anuncio.preco == null || String(anuncio.preco).trim() === '' || !Number.isFinite(preco) || preco <= 0) return 'Preço não informado'
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function CardPrecoAnuncio({ anuncio, onConversar, onContraproposta }) {
    return (
        <section className="rounded-[26px] bg-white p-6 px-9 shadow-sm">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                <span className="font-semibold uppercase tracking-wider text-[#6E7B6C]">
                    {[anuncio.categoria, anuncio.subcategoria].filter(Boolean).join(' • ')}
                </span>
                <span className="text-[#6E7B6C]">{tempoDecorrido(anuncio.publicado)}</span>
            </div>

            <h1 className="text-[22.5px] font-bold leading-[1.15] text-[#191C30]">{anuncio.nome}</h1>

            <p className="mb-6 mt-4 flex flex-wrap items-baseline gap-2">
                <span className="text-[27.5px] font-bold leading-none text-[#4CAF50]">
                    {textoPreco(anuncio)}
                </span>
                {anuncio.peso && anuncio.peso !== 'Não informado' && (
                    <span className="text-sm text-[#191C30]">/ lote total ({anuncio.peso})</span>
                )}
            </p>

            {anuncio.troca?.trim() && (
                <p className="mb-7 flex items-center gap-3 px-2 text-xs leading-relaxed">
                    <RefreshCw size={28} aria-hidden="true" className="shrink-0 rounded-full bg-[#724BC2] p-1.5 text-white" />
                    {anuncio.troca}
                </p>
            )}

            <div className="space-y-4">
                <button
                    type="button"
                    onClick={() => onConversar(anuncio)}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#724BC2] px-4 py-3 text-sm font-semibold text-white hover:bg-[#603ca8]"
                >
                    <MessageSquare size={16} />Conversar com anunciante
                </button>
                <button
                    type="button"
                    onClick={() => onContraproposta(anuncio)}
                    className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#4CAF50] bg-white px-4 py-3 text-sm font-semibold text-[#4CAF50] hover:bg-[#4CAF50]/10"
                >
                    Fazer contraproposta
                </button>
            </div>
        </section>
    )
}