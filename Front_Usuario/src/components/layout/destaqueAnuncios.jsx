import { useEffect, useState } from "react";
import Mesa from "../../assets/icons/img/mesa.png";
import Garrafas from "../../assets/icons/img/garrafas.png";
import Sofa from "../../assets/icons/img/sofa.png";
import Papelao from "../../assets/icons/img/papelao.png";
import Poltrona from "../../assets/icons/img/poltrona.png";
import Telefone from "../../assets/icons/img/telefone.png";
import Geladeira from "../../assets/icons/img/geladeira.png";
import { apiFetch } from "../../services/api.js";

const imagensDemo = [Mesa, Garrafas, Sofa, Papelao, Poltrona, Telefone, Geladeira];
const produtosDemo = [
    [1, "Mesa semi nova", "R$ 170,00", Mesa, "Móveis"],
    [2, "Fardo de PET limpo", "R$ 64,00", Garrafas, "Plástico"],
    [3, "Sofá semi novo confortável", "R$ 450,00", Sofa, "Móveis"],
    [4, "Papelão prensado - 50 kg", "R$ 45,00", Papelao, "Papel"],
    [5, "Poltrona cor creme", "R$ 280,00", Poltrona, "Móveis"],
    [6, "Celular usado para peças", "R$ 120,00", Telefone, "Eletrônicos"],
    [7, "Geladeira branca usada", "R$ 680,00", Geladeira, "Eletrônicos"],
    [8, "Luminárias de garrafa PET", "Gratuito", Garrafas, "Plástico"],
    [9, "Jornais e revistas", "Gratuito", Papelao, "Papel"],
    [10, "Potes de vidro com tampa", "Gratuito", Garrafas, "Vidro"],
    [11, "Panelas de alumínio", "R$ 90,00", Mesa, "Metal"],
    [12, "Monitor para reaproveitamento", "Gratuito", Telefone, "Eletrônicos"],
];

const demoProdutos = produtosDemo.map(([id, nome, preco, imagem, categoria], index) => ({
    id, nome, preco, imagem, fallbackImagem: imagem, categoria,
    avaliacao: (4.6 + (index % 4) / 10).toFixed(1),
    distancia: `${(1.1 + (index % 5) * 0.7).toFixed(1)} km`,
}));

export default function DestaqueAnuncios({ busca = "", categoria = "" }) {
    const [produtos, setProdutos] = useState(demoProdutos);
    const [favoritos, setFavoritos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const termo = busca.trim();
        async function carregar() {
            setCarregando(true);
            try {
                const parametros = new URLSearchParams();
                if (termo) parametros.set("q", termo);
                if (categoria) parametros.set("categoria", categoria);
                const query = parametros.toString();
                const resposta = await apiFetch(`/catalog/anuncios${query ? `?${query}` : ""}`, { signal: controller.signal });
                const anuncios = (resposta.anuncios || []).map((anuncio, index) => ({
                    id: `api-${anuncio.id}`,
                    nome: anuncio.nome,
                    preco: anuncio.modalidade === "Venda" ? "Disponível para venda" : anuncio.modalidade,
                    imagem: anuncio.imagem || imagensDemo[index % imagensDemo.length],
                    fallbackImagem: imagensDemo[index % imagensDemo.length],
                    avaliacao: anuncio.condicao || "Novo",
                    distancia: anuncio.categoria?.nome || "EcoWayer",
                    categoria: anuncio.categoria?.nome,
                }));
                setProdutos(anuncios);
            } catch (error) {
                if (error.name !== "AbortError") {
                    const termoNormalizado = `${termo} ${categoria}`.toLowerCase();
                    setProdutos(termoNormalizado.trim() ? demoProdutos.filter((produto) => `${produto.nome} ${produto.categoria}`.toLowerCase().includes(termoNormalizado)) : demoProdutos);
                }
            } finally {
                if (!controller.signal.aborted) setCarregando(false);
            }
        }
        carregar();
        return () => controller.abort();
    }, [busca, categoria]);

    function alternarFavorito(id) {
        setFavoritos((atuais) => atuais.includes(id) ? atuais.filter((item) => item !== id) : [...atuais, id]);
    }

    return (
        <section className="w-full py-5">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#61B86B]">Reutilize e compartilhe</p>
                    <h2 className="mt-1 text-3xl font-extrabold text-slate-900 sm:text-4xl">Anúncios em destaque</h2>
                </div>
            </div>
            {carregando ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-72 animate-pulse rounded-2xl bg-slate-100" />)}</div> : produtos.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-base text-slate-500">Nenhum anúncio encontrado para essa busca.</div> : (
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                    {produtos.map((produto) => {
                        const favoritado = favoritos.includes(produto.id);
                        return <article key={produto.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#61B86B]/40 hover:shadow-xl hover:shadow-[#61B86B]/10">
                            <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
                                <img src={produto.imagem} alt={produto.nome} loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = produto.fallbackImagem || imagensDemo[0]; }} className="h-full w-full object-cover" />
                                <button type="button" onClick={() => alternarFavorito(produto.id)} aria-label={favoritado ? "Remover dos favoritos" : "Adicionar aos favoritos"} aria-pressed={favoritado} className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow transition hover:scale-110"><svg viewBox="0 0 24 24" fill={favoritado ? "#724BC2" : "none"} stroke={favoritado ? "#724BC2" : "#374151"} strokeWidth="1.8" className="h-5 w-5"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                            </div>
                            <div className="px-1 pt-3">
                                <span className="text-xs font-bold uppercase tracking-wide text-[#61B86B]">{produto.categoria || "Anúncio"}</span>
                                <h3 title={produto.nome} className="mt-1 min-h-12 line-clamp-2 text-base font-bold leading-6 text-slate-800">{produto.nome}</h3>
                                <p className="mt-2 text-lg font-extrabold text-[#4CAF50]">{produto.preco}</p>
                                <div className="mt-2 flex items-center justify-between text-sm text-slate-500"><span>★ {produto.avaliacao}</span><span>{produto.distancia}</span></div>
                            </div>
                        </article>;
                    })}
                </div>
            )}
        </section>
    );
}
