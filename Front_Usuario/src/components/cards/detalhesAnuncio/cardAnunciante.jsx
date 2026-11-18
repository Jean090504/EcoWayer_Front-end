import { BadgeCheck, Check, Star } from 'lucide-react'

function Estatistica({ valor, rotulo, className = '' }) {
    return (
        <div className="flex flex-col items-center gap-1 text-center">
            <span className={`flex items-center gap-1 text-lg font-bold ${className}`}>{valor}</span>
            <span className="text-[11px] text-gray-500">{rotulo}</span>
        </div>
    )
}

export default function CardAnunciante({ vendedor, onDenunciar, onVerPerfil }) {
    if (!vendedor) return null

    const avaliacao = Number(vendedor.avaliacao ?? vendedor.nota)
    const totalAvaliacoes = vendedor.total_avaliacoes ?? vendedor.avaliacoes
    const tempoResposta = vendedor.tempo_resposta
    const entregas = vendedor.entregas_no_prazo

    return (
        <section className="flex flex-1 flex-col rounded-[26px] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold">Sobre o anunciante</h2>
                {onVerPerfil && (
                    <button type="button" onClick={onDenunciar} className="text-[11px] font-medium text-[#E53935] hover:underline">
                        Denunciar Anúncio
                    </button>
                )}
            </div>

            <div className="mt-6 flex items-center gap-4">
                <div className="relative shrink-0 cursor-pointer" onClick={() => onVerPerfil(vendedor)}>
                    {vendedor.foto ? (
                        <img src={vendedor.foto} alt={vendedor.nome} className="h-16 w-16 rounded-full border-2 border-[#4CAF50] object-cover" />
                    ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#4CAF50] bg-[#F1EBFF] text-xl font-bold text-[#724BC2]">
                            {vendedor.nome?.[0]?.toUpperCase() || '?'}
                        </div>
                    )}
                    {vendedor.verificado && (
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#4CAF50] text-white">
                            <Check size={11} strokeWidth={3} />
                        </span>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="truncate text-lg font-semibold">{vendedor.nome}</p>
                    {vendedor.verificado && (
                        <p className="flex items-center gap-1 text-[11px] font-medium text-[#4CAF50]">
                            <BadgeCheck size={12} />Vendedor Verificado EcoWayer
                        </p>
                    )}
                </div>
            </div>

            <div className="mb-6 mt-10 grid grid-cols-3 gap-2">
                <Estatistica
                    valor={Number.isFinite(avaliacao) ? <><Star size={15} className="fill-amber-400 text-amber-400" />{avaliacao.toFixed(1)}</> : '—'}
                    rotulo={totalAvaliacoes != null ? `${totalAvaliacoes} avaliações` : 'Sem avaliações'}
                    className="text-amber-500"
                />
                <Estatistica valor={tempoResposta || '—'} rotulo="Tempo resposta" />
                <Estatistica
                    valor={entregas != null ? `${entregas}%` : '—'}
                    rotulo="Entregas no prazo"
                    className="text-[#4CAF50]"
                />
            </div>
        </section>
    )
}