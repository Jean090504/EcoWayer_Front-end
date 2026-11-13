import Categorias from "../components/layout/categorias.jsx";
import Banner from "../components/layout/banner.jsx";
import DestaqueAnuncios from "../components/layout/destaqueAnuncios.jsx";
import DestaquesCategorias from "../components/layout/anunciosDestaquePorCategoria.jsx";


export default function Home() {
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

                {/* Anúncios em destaque */}
                <div className="w-full min-w-0">
                    <DestaqueAnuncios />
                </div>

                {/* Carrosséis por categoria */}
                <div className="w-full min-w-0">
                    <DestaquesCategorias />
                </div>
            </div>
        </main>
    );
}