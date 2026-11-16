import {
    MapPin,
    CalendarDays,
    Star,
    ShieldCheck,
    Share2,
    Wallet,
    PlusCircle
} from "lucide-react";


// ===================================================================
//                         FUNÇÕES AUXILIARES
// ===================================================================

// Pega a primeira letra do nome (usado quando o usuário não tem foto)
function pegarInicial(nome) {
    return (nome ?? "").trim().charAt(0).toUpperCase();
}

function formatarDataMembro(valor) {
    const data = String(valor ?? "").match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s]|$)/);
    return data ? `${data[3]}/${data[2]}/${data[1]}` : valor;
}


// ===================================================================
//                            CONSTANTES
// ===================================================================

// Classes repetidas nos botões do topo
const botaoAcaoClass = "inline-flex h-[40px] cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-[13px] font-semibold text-white transition active:scale-[0.99]";


// ===================================================================
//                      COMPONENTES REUTILIZÁVEIS
// ===================================================================

// Foto do perfil (se não tiver foto, mostra a inicial do nome)
function Avatar({ nome, foto }) {
    return (
        <div className="absolute -bottom-[48px] left-[20px] h-[96px] w-[96px] overflow-hidden rounded-full border-4 border-white bg-[#EEEAFB] shadow-md sm:-bottom-[68px] sm:left-[36px] sm:h-[136px] sm:w-[136px]">
            {foto ? (
                <img
                    src={foto}
                    alt={`Foto de ${nome}`}
                    className="h-full w-full object-cover"
                />
            ) : (
                <span className="flex h-full w-full items-center justify-center text-[40px] font-bold text-[#724BC2] sm:text-[56px]">
                    {pegarInicial(nome)}
                </span>
            )}
        </div>
    );
}

// Item pequeno com ícone (localização, membro desde...)
function InfoComIcone({ Icone, children }) {
    return (
        <span className="inline-flex items-center gap-1 text-[12px] text-[#3E4A3D]">
            <Icone size={13} aria-hidden="true" />
            {children}
        </span>
    );
}


// ===================================================================
//                     CARD DE DADOS DA PERSONA
// ===================================================================

// Props recebidas da página:
//   usuario            -> { nome, foto, localizacao, membroDesde, nota,
//                           totalAvaliacoes, verificado }
//   onCompartilhar     -> clique no botão de compartilhar
//   onExtratoCarteira  -> clique em "Carteira"
//   onNovoAnuncio      -> clique em "Anunciar"
// ===================================================================
export default function CardDadosPersona({
    usuario,
    onCompartilhar,
    onExtratoCarteira,
    onNovoAnuncio
}) {

    // Enquanto os dados não chegam do back end, não mostra nada
    if (!usuario) return null;

    const {
        nome,
        foto,
        localizacao,
        membroDesde,
        nota,
        totalAvaliacoes,
        verificado
    } = usuario;

    // ---------------------------------------------------------------
    //                              CARD
    // ---------------------------------------------------------------
    return (
        <section className="mx-auto w-full max-w-[1376px]">

            {/* ---------------- Banner ---------------- */}
            <div className="relative h-[208px] rounded-[32px] bg-gradient-to-r from-[#047A31] via-[#3F8F7F] to-[#8B52F6]">

                {/* Foto do perfil (sobrepõe a borda de baixo do banner) */}
                <Avatar nome={nome} foto={foto} />

                {/* Nome */}
                <h1 className="absolute bottom-[14px] left-[132px] right-[16px] truncate text-[24px] font-bold leading-tight text-white sm:left-[184px] sm:text-[32px]">
                    {nome}
                </h1>

                {/* Selo de perfil verificado */}
                {verificado && (
                    <span className="absolute right-[16px] top-[16px] inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase text-white backdrop-blur-sm sm:bottom-[14px] sm:top-auto">
                        <ShieldCheck size={13} aria-hidden="true" />
                        Perfil verificado
                    </span>
                )}
            </div>


            {/* ---------------- Informações e ações ---------------- */}
            <div className="flex flex-col gap-4 pt-[60px] sm:flex-row sm:items-start sm:justify-between sm:pl-[184px] sm:pt-3">

                {/* Localização, membro desde e avaliação */}
                <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        {localizacao && (
                            <InfoComIcone Icone={MapPin}>{localizacao}</InfoComIcone>
                        )}

                        {membroDesde && (
                            <InfoComIcone Icone={CalendarDays}>
                                Membro desde {formatarDataMembro(membroDesde)}
                            </InfoComIcone>
                        )}
                    </div>

                    {typeof nota === "number" && (
                        <span className="inline-flex items-center gap-1 text-[12px] text-[#3E4A3D]">
                            <Star
                                size={13}
                                aria-hidden="true"
                                className="fill-[#F5A524] text-[#F5A524]"
                            />
                            <strong className="font-semibold text-[#191C1E]">
                                {nota.toFixed(1).replace(".", ",")}
                            </strong>
                            {typeof totalAvaliacoes === "number" && (
                                <span>({totalAvaliacoes} avaliações positivas)</span>
                            )}
                        </span>
                    )}
                </div>

                {/* Botões */}
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={onCompartilhar}
                        aria-label="Compartilhar perfil"
                        className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full bg-[#4CAF50] text-white transition hover:bg-[#3E9A42] active:scale-[0.99]"
                    >
                        <Share2 size={16} />
                    </button>

                    <button
                        type="button"
                        onClick={onExtratoCarteira}
                        className={`${botaoAcaoClass} bg-[#4CAF50] hover:bg-[#3E9A42]`}
                    >
                        <Wallet size={16} />
                        Carteira
                    </button>

                    <button
                        type="button"
                        onClick={onNovoAnuncio}
                        className={`${botaoAcaoClass} bg-[#724BC2] shadow-md shadow-[#724BC2]/30 hover:bg-[#6539B8]`}
                    >
                        <PlusCircle size={16} />
                        Anunciar
                    </button>
                </div>

            </div>
        </section>
    );
}
