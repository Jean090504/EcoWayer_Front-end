import {
    Archive,
    Truck,
    MessageSquareText,
    UserCog,
    Eye,
    Star,
    MapPin,
    ChevronDown
} from "lucide-react";


// ===================================================================
//                         FUNÇÕES AUXILIARES
// ===================================================================

// 64 -> "R$ 64,00"
function formatarPreco(valor) {
    return Number(valor ?? 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// 4.7 -> "4,7"
function formatarNota(nota) {
    return Number(nota).toFixed(1).replace(".", ",");
}

// Texto e cor do selo no canto da foto
function pegarSelo(anuncio) {
    if (anuncio.modalidade === "doacao") {
        return { texto: "Doação Solidária", classe: "bg-[#724BC2]" };
    }

    return {
        texto: STATUS[anuncio.status]?.rotulo ?? "Ativo",
        classe: STATUS[anuncio.status]?.classe ?? "bg-[#4CAF50]"
    };
}


// ===================================================================
//                            CONSTANTES
// ===================================================================

// Abas do perfil (o "id" é o que volta pra página em onMudarAba)
const ABAS = [
    { id: "anuncios", rotulo: "Meus Anúncios", Icone: Archive },
    { id: "historico", rotulo: "Histórico & Doações", Icone: Truck },
    { id: "avaliacoes", rotulo: "Avaliações", Icone: MessageSquareText },
    { id: "configuracoes", rotulo: "Configurações de Conta", Icone: UserCog }
];

const ORDENACOES = [
    { valor: "recentes", rotulo: "Mais recentes" },
    { valor: "antigos", rotulo: "Mais antigos" },
    { valor: "visualizacoes", rotulo: "Mais vistos" }
];

// Selo de cada status do anúncio
const STATUS = {
    ativo: { rotulo: "Ativo", classe: "bg-[#4CAF50]" },
    pausado: { rotulo: "Pausado", classe: "bg-[#9AA39A]" },
    rascunho: { rotulo: "Rascunho", classe: "bg-[#F5A524]" }
};


// ===================================================================
//                      COMPONENTES REUTILIZÁVEIS
// ===================================================================

// Aba (a ativa fica verde)
function Aba({ rotulo, Icone, ativa, notificacao, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={ativa}
            className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition ${ativa
                ? "bg-[#4CAF50] text-white"
                : "text-[#3E4A3D] hover:bg-[#F8F8F8]"
                }`}
        >
            <Icone size={16} aria-hidden="true" />
            {rotulo}

            {/* Bolinha de aviso (ex: avaliação nova) */}
            {notificacao && (
                <span
                    aria-label="Novidades"
                    className="h-[7px] w-[7px] rounded-full bg-[#724BC2]"
                />
            )}
        </button>
    );
}

// Preço do anúncio (muda conforme a modalidade)
function PrecoAnuncio({ anuncio }) {
    if (anuncio.modalidade === "doacao") {
        return (
            <span className="text-[24px] font-bold leading-tight text-[#724BC2]">
                Grátis
            </span>
        );
    }

    if (anuncio.modalidade === "troca") {
        return (
            <span className="text-[24px] font-bold leading-tight text-[#724BC2]">
                Troca
            </span>
        );
    }

    return (
        <span className="text-[24px] font-bold leading-tight text-[#4CAF50]">
            {formatarPreco(anuncio.preco)}
            {anuncio.unidadePreco && (
                <span className="ml-1 text-[11px] font-normal text-[#3E4A3D]">
                    / {anuncio.unidadePreco}
                </span>
            )}
        </span>
    );
}

// Card de um anúncio
function CardAnuncio({ anuncio, onEditar, onAlterarVisibilidade }) {
    const selo = pegarSelo(anuncio);

    return (
        <article className="flex flex-col rounded-[24px] bg-white p-2 shadow-sm">

            {/* Foto */}
            <div className="relative h-[273px] overflow-hidden rounded-[18px] bg-[#F8F8F8]">
                {anuncio.imagem && (
                    <img
                        src={anuncio.imagem}
                        alt={anuncio.titulo}
                        className="h-full w-full object-cover"
                    />
                )}

                <span className={`absolute left-2 top-2 rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white ${selo.classe}`}>
                    {selo.texto}
                </span>

                <button
                    type="button"
                    onClick={() => onAlterarVisibilidade?.(anuncio)}
                    aria-label={`Alterar visibilidade de ${anuncio.titulo}`}
                    className="absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#3E4A3D] transition hover:bg-white"
                >
                    <Eye size={16} />
                </button>

                {typeof anuncio.views === "number" && (
                    <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
                        {anuncio.views} views
                    </span>
                )}
            </div>

            {/* Informações */}
            <div className="flex flex-1 flex-col gap-1 px-1 pb-1 pt-3">

                <div className="flex items-center justify-between gap-2 py-2">

                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#3E4A3D]">
                        <MapPin size={12} aria-hidden="true" />
                        {[anuncio.distancia, anuncio.entrega].filter(Boolean).join(" • ")}
                    </span>

                    {typeof anuncio.nota === "number" && (

                        <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-[#F5A524]">
                            <Star size={11} aria-hidden="true" className="fill-[#F5A524]" />
                            {formatarNota(anuncio.nota)}
                        </span>
                    )}

                </div>

                <h3 className="truncate text-[18px] font-semibold leading-tight text-[#191C1E]">
                    {anuncio.titulo}
                </h3>

                <PrecoAnuncio anuncio={anuncio} />


                <button
                    type="button"
                    onClick={() => onEditar?.(anuncio)}
                    className="mt-3 h-[26px] w-full cursor-pointer rounded-full bg-[#724BC2] text-[11px] font-semibold text-white transition hover:bg-[#6539B8] active:scale-[0.99]"
                >
                    Editar Anúncio
                </button>

            </div>
        </article>
    );
}


// ===================================================================
//                    CARD DE CATÁLOGO DE ANÚNCIOS
// ===================================================================

// Props recebidas da página:
//   anuncios                -> lista de anúncios do usuário:
//                              { id, titulo, categoria, imagem, modalidade
//                                ("venda" | "troca" | "doacao"), status, preco,
//                                unidadePreco, nota, views, distancia, entrega }
//   atualizadoEm            -> texto, ex: "hoje às 14:22"
//   abaAtiva                -> id da aba selecionada (padrão: "anuncios")
//   abaComNotificacao       -> id da aba que mostra a bolinha (ex: "avaliacoes")
//   ordenacao               -> valor da ordenação atual (padrão: "recentes")
//   carregando              -> true enquanto o back end responde
//   onMudarAba              -> recebe o id da aba clicada
//   onMudarOrdenacao        -> recebe o valor da ordenação escolhida
//   onEditarAnuncio         -> recebe o anúncio clicado
//   onAlterarVisibilidade   -> recebe o anúncio (botão do olhinho)
// ===================================================================
export default function CardCatalogoDeAnuncios({
    anuncios = [],
    atualizadoEm,
    abaAtiva = "anuncios",
    abaComNotificacao,
    ordenacao = "recentes",
    carregando = false,
    onMudarAba,
    onMudarOrdenacao,
    onEditarAnuncio,
    onAlterarVisibilidade
}) {

    // ---------------------------------------------------------------
    //                              CARD
    // ---------------------------------------------------------------
    return (
        <section className="mx-auto w-full max-w-[1376px]">

            {/* ---------------- Abas e ordenação ---------------- */}
            <div className="flex flex-col gap-3 rounded-full bg-white p-1.5 shadow-sm sm:flex-row sm:items-center sm:justify-between">

                <div className="flex gap-1 overflow-x-auto">
                    {ABAS.map((aba) => (
                        <Aba
                            key={aba.id}
                            rotulo={aba.rotulo}
                            Icone={aba.Icone}
                            ativa={abaAtiva === aba.id}
                            notificacao={abaComNotificacao === aba.id}
                            onClick={() => onMudarAba?.(aba.id)}
                        />
                    ))}
                </div>

                <label className="flex items-center gap-2 px-3 text-[11px] text-[#3E4A3D]">
                    Ordenar por:

                    <span className="relative">
                        <select
                            value={ordenacao}
                            onChange={(e) => onMudarOrdenacao?.(e.target.value)}
                            className="cursor-pointer appearance-none rounded-full bg-[#F1EFFB] py-1.5 pl-3 pr-7 text-[11px] font-medium text-[#3E3A52] outline-none"
                        >
                            {ORDENACOES.map((item) => (
                                <option key={item.valor} value={item.valor}>
                                    {item.rotulo}
                                </option>
                            ))}
                        </select>

                        <ChevronDown
                            size={12}
                            aria-hidden="true"
                            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#3E3A52]"
                        />
                    </span>
                </label>

            </div>


            {/* ---------------- Título da lista ---------------- */}
            <div className="mt-10 flex items-center justify-between gap-3 px-3">
                <h2 className="text-[20px] font-semibold text-[#191C1E]">
                    Meus anúncios
                </h2>

                {atualizadoEm && (
                    <span className="text-[11px] text-[#3E4A3D]">
                        Atualizado {atualizadoEm}
                    </span>
                )}
            </div>


            {/* ---------------- Lista de anúncios ---------------- */}
            {carregando ? (
                <p className="mt-10 text-center text-[14px] text-[#3E4A3D]">
                    Carregando anúncios...
                </p>
            ) : anuncios.length === 0 ? (
                <p className="mt-10 text-center text-[14px] text-[#3E4A3D]">
                    Você ainda não publicou nenhum anúncio.
                </p>
            ) : (
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {anuncios.map((anuncio) => (
                        <CardAnuncio
                            key={anuncio.id}
                            anuncio={anuncio}
                            onEditar={onEditarAnuncio}
                            onAlterarVisibilidade={onAlterarVisibilidade}
                        />
                    ))}
                </div>
            )}

        </section>
    );
}
