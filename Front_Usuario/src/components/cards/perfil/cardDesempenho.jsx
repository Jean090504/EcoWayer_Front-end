import { TrendingUp } from "lucide-react";


// ===================================================================
//                         FUNÇÕES AUXILIARES
// ===================================================================

// 3490 -> "3.490"
function formatarNumero(valor) {
    return Number(valor ?? 0).toLocaleString("pt-BR");
}


// ===================================================================
//                      COMPONENTES REUTILIZÁVEIS
// ===================================================================

// Um indicador (título, número grande, unidade e um destaque opcional)
function Indicador({ titulo, valor, unidade, corValor, destaque }) {
    return (
        <div className="flex min-h-[174px] flex-col justify-between rounded-[24px] bg-white p-6 shadow-sm">

            {/* Título e destaque (ex: "+180 neste mês") */}
            <div className="flex items-start justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase text-[#3E4A3D]">
                    {titulo}
                </span>

                {destaque && (
                    <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-[#2E9B3A]">
                        <TrendingUp size={13} aria-hidden="true" />
                        {destaque}
                    </span>
                )}
            </div>

            {/* Número + unidade */}
            <div className="flex items-baseline gap-2">
                <span className={`text-[48px] font-bold leading-none ${corValor}`}>
                    {formatarNumero(valor)}
                </span>

                <span className="text-[14px] font-medium text-[#191C1E]">
                    {unidade}
                </span>
            </div>

        </div>
    );
}


// ===================================================================
//                       CARD DE DESEMPENHO
// ===================================================================

// Props recebidas da página:
//   desempenho -> { saldoPontos, pontosNoMes, kgReciclados, itensRegenerados }
// ===================================================================
export default function CardDesempenho({ desempenho }) {

    // Enquanto os dados não chegam do back end, não mostra nada
    if (!desempenho) return null;

    const {
        saldoPontos,
        pontosNoMes,
        kgReciclados,
        itensRegenerados
    } = desempenho;

    // ---------------------------------------------------------------
    //                              CARD
    // ---------------------------------------------------------------
    return (
        <section
            aria-label="Desempenho do usuário"
            className="mx-auto grid w-full max-w-[1376px] grid-cols-1 gap-5 md:grid-cols-3"
        >

            <Indicador
                titulo="Saldo de recompensas"
                valor={saldoPontos}
                unidade="pts"
                corValor="text-[#191C1E]"
                destaque={pontosNoMes > 0 ? `+${formatarNumero(pontosNoMes)} neste mês` : ""}
            />

            <Indicador
                titulo="Impacto ambiental direto"
                valor={kgReciclados}
                unidade="kg reciclados"
                corValor="text-[#2E9B3A]"
            />

            <Indicador
                titulo="Atividade circular"
                valor={itensRegenerados}
                unidade="itens regenerados"
                corValor="text-[#724BC2]"
            />

        </section>
    );
}