import { useEffect, useState } from "react"

import { Categorias, Banner, DestaquesCategorias } from '../components/layout'

import { buscarAnuncios } from "../services/userService.js"

export default function Home({ onAbrirAnuncio, favoritos = [], favoritar, categoria = "tudo", busca = "", localizacao = { uf: "", cidade: "" }, onSelecionarCategoria }) {
    const [anuncios, setAnuncios] = useState([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativo = true;
        let carregando = false;
        async function atualizar({ ignorarVisibilidade = false } = {}) {
            if (carregando || (!ignorarVisibilidade && document.visibilityState === "hidden")) return;
            carregando = true;
            try {
                const lista = await buscarAnuncios();
                if (ativo) { setAnuncios(lista); setErro(""); }
            } catch (error) {
                if (ativo) setErro(error.message);
            } finally {
                carregando = false;
            }
        }
        atualizar({ ignorarVisibilidade: true });
        window.addEventListener("focus", atualizar);
        document.addEventListener("visibilitychange", atualizar);
        const intervalo = window.setInterval(atualizar, 30000);
        return () => {
            ativo = false;
            window.clearInterval(intervalo);
            window.removeEventListener("focus", atualizar);
            document.removeEventListener("visibilitychange", atualizar);
        };
    }, []);

    const categoriasPorId = new Map();
    for (const anuncio of anuncios) {
        if (anuncio.id_categoria != null && anuncio.categoria) {
            categoriasPorId.set(String(anuncio.id_categoria), anuncio.categoria);
        }
    }
    const categorias = Array.from(categoriasPorId, ([id, nome]) => ({ id, nome }))
        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    const termoBusca = busca.trim().toLocaleLowerCase("pt-BR");
    const filtrados = anuncios.filter(anuncio => {
        const correspondeBusca = !termoBusca || [anuncio.nome, anuncio.descricao, anuncio.categoria, anuncio.modalidade_nome]
            .some(valor => String(valor || "").toLocaleLowerCase("pt-BR").includes(termoBusca));
        if (!correspondeBusca) return false;
        if (localizacao.uf && String(anuncio.uf_exibicao || "").toLocaleLowerCase("pt-BR") !== localizacao.uf.toLocaleLowerCase("pt-BR")) return false;
        if (localizacao.cidade && String(anuncio.cidade_exibicao || "").toLocaleLowerCase("pt-BR") !== localizacao.cidade.toLocaleLowerCase("pt-BR")) return false;
        if (categoria === "tudo") return true;
        if (categoria === "favoritos") return favoritos.includes(String(anuncio.id));
        return String(anuncio.id_categoria) === categoria;
    });

    return (
        // espaçamento vertical cresce e diminui junto com a tela
        <main className="flex flex-1 w-full flex-col items-center py-[clamp(1.5rem,3vw,2.5rem)]">

            {/* 90% da tela, mas nunca passa de 1600px (evita esticar demais em monitor ultrawide) */}
            <div className="home-entrada flex w-[90%] max-w-[1600px] flex-col items-center gap-[clamp(1.5rem,3vw,2.5rem)]">

                {/* chama as categorias */}
                <Categorias categorias={categorias} selecionada={categoria} onSelecionar={onSelecionarCategoria} />

                {/* Banner */}
                <div className="w-full min-w-0">
                    <Banner />
                </div>

                {erro && <p role="alert" className="w-full rounded-xl bg-red-50 p-4 text-red-600">{erro}</p>}
                <div className="w-full min-w-0">
                    {!erro && filtrados.length === 0 && anuncios.length > 0 ? (
                        <p role="status" className="rounded-xl bg-gray-50 p-4 text-gray-600">
                            {categoria === "favoritos" && !busca && !localizacao.uf ? "Nenhum anúncio favoritado para exibir." : "Nenhum anúncio encontrado com os filtros selecionados. Tente outra busca ou localização."}
                        </p>
                    ) : (
                        <DestaquesCategorias
                            key={categoria}
                            anuncios={filtrados}
                            onAbrirAnuncio={onAbrirAnuncio}
                            favoritos={favoritos}
                            onFavoritar={favoritar}
                            mostrarFavoritos={categoria === "favoritos"}
                        />
                    )}
                </div>
            </div>
        </main>
    )
}
