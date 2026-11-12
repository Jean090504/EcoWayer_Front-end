import { useRef, useState } from "react";
import Mesa from "../../assets/icons/img/mesa.png";
import Garrafas from "../../assets/icons/img/garrafas.png";
import Sofa from "../../assets/icons/img/sofa.png";
import Papelao from "../../assets/icons/img/papelao.png";
import Poltrona from "../../assets/icons/img/poltrona.png";
import Telefone from "../../assets/icons/img/telefone.png";
import Geladeira from "../../assets/icons/img/geladeira.png";


// ===================================================================
//                            CONSTANTES
// ===================================================================

const GAP_CARROSSEL = 16; // gap-4 = 16px (tem que bater com o gap do carrossel)

// Classes repetidas nas setinhas do cabeçalho
const setaClass = "flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-[#724BC2] hover:text-[#724BC2]";

// Um carrossel para cada modalidade (os "id" são os mesmos do card de novo anúncio)
const MODALIDADES = [
    { id: "venda", titulo: "Mais recentes em Venda" },
    { id: "troca", titulo: "Mais recentes em Troca" },
    { id: "doacao", titulo: "Mais recentes em Doação" }
];

// Anúncios de teste.
// Obs.: "precoAntigo" é opcional (aparece riscado) e "destaque" mostra a etiqueta roxa.
// Na troca e na doação, o "preco" mostra o próprio nome da modalidade.
const anunciosIniciais = [

    // ---------- VENDA ----------
    { id: 1, modalidade: "venda", nome: "Mesa semi nova", preco: "R$ 170,00", imagem: Mesa, destaque: true, data: "Hoje, 9:20", local: "São Paulo - SP" },
    { id: 2, modalidade: "venda", nome: "Sofá semi novo - confortável", preco: "R$ 450,00", precoAntigo: "R$ 600,00", imagem: Sofa, destaque: true, data: "Hoje, 9:15", local: "Osasco - SP" },
    { id: 3, modalidade: "venda", nome: "Fardo de PET limpo - garrafas", preco: "R$ 64,00", imagem: Garrafas, destaque: false, data: "Hoje, 8:30", local: "Guarulhos - SP" },
    { id: 4, modalidade: "venda", nome: "Geladeira nova - branca", preco: "R$ 1.200,00", precoAntigo: "R$ 1.500,00", imagem: Geladeira, destaque: true, data: "11/11/2026, 13:05", local: "São Paulo - SP" },
    { id: 5, modalidade: "venda", nome: "Papelão prensado - 50 kg", preco: "R$ 45,00", imagem: Papelao, destaque: false, data: "10/11/2026, 11:20", local: "Osasco - SP" },
    { id: 6, modalidade: "venda", nome: "Celular usado - modelo antigo", preco: "R$ 150,00", imagem: Telefone, destaque: false, data: "09/11/2026, 9:10", local: "Mauá - SP" },

    // ---------- TROCA ----------
    { id: 7, modalidade: "troca", nome: "Poltrona cor creme nova", preco: "Troca", imagem: Poltrona, destaque: true, data: "Hoje, 9:05", local: "Guarulhos - SP" },
    { id: 8, modalidade: "troca", nome: "Celular para peças", preco: "Troca", imagem: Telefone, destaque: false, data: "Hoje, 7:50", local: "Mauá - SP" },
    { id: 9, modalidade: "troca", nome: "Mesa de jantar 4 lugares", preco: "Troca", imagem: Mesa, destaque: false, data: "11/11/2026, 14:30", local: "São Bernardo do Campo - SP" },
    { id: 10, modalidade: "troca", nome: "Fardo de papelão limpo", preco: "Troca", imagem: Papelao, destaque: false, data: "10/11/2026, 16:10", local: "Diadema - SP" },
    { id: 11, modalidade: "troca", nome: "Geladeira frost free usada", preco: "Troca", imagem: Geladeira, destaque: true, data: "09/11/2026, 12:00", local: "Santo André - SP" },

    // ---------- DOAÇÃO ----------
    { id: 12, modalidade: "doacao", nome: "Garrafas PET sem rótulo", preco: "Doação", imagem: Garrafas, destaque: true, data: "Hoje, 9:40", local: "Diadema - SP" },
    { id: 13, modalidade: "doacao", nome: "Sofá 2 lugares retrátil", preco: "Doação", imagem: Sofa, destaque: false, data: "Hoje, 8:10", local: "Santo André - SP" },
    { id: 14, modalidade: "doacao", nome: "Papelão ondulado limpo", preco: "Doação", imagem: Papelao, destaque: false, data: "11/11/2026, 16:45", local: "Osasco - SP" },
    { id: 15, modalidade: "doacao", nome: "Poltrona reclinável", preco: "Doação", imagem: Poltrona, destaque: false, data: "10/11/2026, 17:45", local: "São Paulo - SP" }
];


// ===================================================================
//                      COMPONENTES REUTILIZÁVEIS
// Ficam fora do componente principal de propósito: se ficassem dentro,
// seriam recriados a cada render e o carrossel perderia a posição.
// ===================================================================

// Card de um anúncio (imagem, etiqueta, coração, preço, data e local)
function CardAnuncio({ anuncio, favoritado, onFavoritar }) {
    return (
        <article className="w-[clamp(160px,17vw,230px)] min-w-[clamp(160px,17vw,230px)] shrink-0 snap-start cursor-pointer">

            {/* Imagem */}
            <div className="relative h-[clamp(160px,17vw,230px)] w-full overflow-hidden rounded-xl bg-gray-100">
                <img
                    src={anuncio.imagem}
                    alt={anuncio.nome}
                    loading="lazy"
                    className="h-full w-full object-cover"
                />

                {/* Etiqueta de destaque */}
                {anuncio.destaque && (
                    <span className="absolute left-2 top-2 rounded-md bg-[#724BC2] px-2 py-1 text-[11px] font-semibold text-white">
                        Destaque
                    </span>
                )}

                {/* Favoritar */}
                <button
                    type="button"
                    onClick={onFavoritar}
                    aria-label={favoritado ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    aria-pressed={favoritado}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-110"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={favoritado ? "#724BC2" : "none"} stroke={favoritado ? "#724BC2" : "#374151"} strokeWidth="1.8" className="h-4 w-4">
                        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Info */}
            <div className="px-0.5 pt-3">
                <h3 title={anuncio.nome} className="truncate text-sm font-semibold leading-5 text-gray-800">
                    {anuncio.nome}
                </h3>

                {/* Preço antigo riscado (só se tiver desconto) */}
                {anuncio.precoAntigo && (
                    <p className="mt-1 text-xs leading-4 text-gray-400 line-through">
                        {anuncio.precoAntigo}
                    </p>
                )}

                <p className="truncate text-base font-bold leading-6 text-[#4CAF50]">
                    {anuncio.preco}
                </p>

                <p className="mt-1 truncate text-[11px] leading-4 text-gray-500">
                    {anuncio.data} · {anuncio.local}
                </p>
            </div>
        </article>
    );
}

// Um carrossel completo de uma modalidade (título, setas e lista de cards)
function CarrosselModalidade({ titulo, anuncios }) {
    const carrosselRef = useRef(null);
    const [favoritos, setFavoritos] = useState([]);

    // Rola o carrossel um card pra esquerda (-1) ou pra direita (1)
    function moverCarrossel(direcao) {
        if (!carrosselRef.current) return;

        const card = carrosselRef.current.querySelector("article");
        if (!card) return;

        carrosselRef.current.scrollBy({
            left: direcao * (card.offsetWidth + GAP_CARROSSEL),
            behavior: "smooth"
        });
    }

    function alternarFavorito(id) {
        setFavoritos((atuais) =>
            atuais.includes(id)
                ? atuais.filter((item) => item !== id)
                : [...atuais, id]
        );
    }

    return (
        <section className="w-full min-w-0 py-4">

            {/* Cabeçalho */}
            <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-[clamp(16px,1.4vw,22px)] font-semibold text-gray-800">
                    {titulo}
                </h2>

                <div className="flex shrink-0 gap-2">
                    <button
                        type="button"
                        onClick={() => moverCarrossel(-1)}
                        aria-label={`Ver anúncios anteriores: ${titulo}`}
                        className={setaClass}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                            <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        onClick={() => moverCarrossel(1)}
                        aria-label={`Ver próximos anúncios: ${titulo}`}
                        className={setaClass}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                            <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Lista de anúncios */}
            <div
                ref={carrosselRef}
                className="flex w-full min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {anuncios.map((anuncio) => (
                    <CardAnuncio
                        key={anuncio.id}
                        anuncio={anuncio}
                        favoritado={favoritos.includes(anuncio.id)}
                        onFavoritar={() => alternarFavorito(anuncio.id)}
                    />
                ))}
            </div>
        </section>
    );
}


// ===================================================================
//              ANÚNCIOS EM DESTAQUE POR MODALIDADE
//
// Mostra um carrossel para cada modalidade (venda, troca e doação),
// parecido com o "Mais recentes em..." da OLX.
//
// Props recebidas da Home:
//   anunciosNovos -> anúncios publicados nesta sessão (aparecem primeiro)
// ===================================================================
export default function AnunciosDestaquePorCategoria({ anunciosNovos = [] }) {

    // Anúncios novos na frente, depois os de teste
    const todos = [...anunciosNovos, ...anunciosIniciais];

    return (
        <div className="flex w-full flex-col gap-6">
            {MODALIDADES.map((modalidade) => {
                const anuncios = todos.filter((a) => a.modalidade === modalidade.id);

                // Modalidade sem nenhum anúncio não aparece
                if (anuncios.length === 0) return null;

                return (
                    <CarrosselModalidade
                        key={modalidade.id}
                        titulo={modalidade.titulo}
                        anuncios={anuncios}
                    />
                );
            })}
        </div>
    );
}