import { useEffect, useState } from "react"

import { Categorias, Banner, DestaquesCategorias } from '../components/layout'

import { buscarAnuncios } from "../services/userService.js"

export default function Home({ onAbrirAnuncio }) {
    const [anuncios, setAnuncios] = useState([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativo = true;
        let carregando = false;
        async function atualizar() {
            if (carregando || document.visibilityState === "hidden") return;
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
        atualizar();
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

    return (
        // espaçamento vertical cresce e diminui junto com a tela
        <main className="flex flex-1 w-full flex-col items-center py-[clamp(1.5rem,3vw,2.5rem)]">

            {/* 90% da tela, mas nunca passa de 1600px (evita esticar demais em monitor ultrawide) */}
            <div className="flex w-[90%] max-w-[1600px] flex-col items-center gap-[clamp(1.5rem,3vw,2.5rem)]">

                {/* chama as categorias */}
                <Categorias />

                {/* Banner */}
                <div className="w-full min-w-0">
                    <Banner />
                </div>

                {erro && <p role="alert" className="w-full rounded-xl bg-red-50 p-4 text-red-600">{erro}</p>}
                <div className="w-full min-w-0">
                    <DestaquesCategorias anuncios={anuncios} onAbrirAnuncio={onAbrirAnuncio} />
                </div>
            </div>
        </main>
    )
}