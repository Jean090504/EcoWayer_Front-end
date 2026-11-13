import Categorias from "../components/layout/categorias.jsx";
import Banner from "../components/layout/banner.jsx";
import DestaqueAnuncios from "../components/layout/destaqueAnuncios.jsx";
import DestaquesCategorias from "../components/layout/anunciosDestaquePorCategoria.jsx";


export default function Home() {
    return (
            <main className="flex flex-1 w-full flex-col items-center py-10">
                <div className="flex w-[90%] flex-col items-center gap-10">

                    {/* chama as categorias */}
                    <Categorias />

                    {/* Banner */}
                    <div className="w-max[90%] w-full">
                        <Banner />
                    </div>

                    {/* Anúncios em destaque */}
                    <div className="w-full">
                        <DestaqueAnuncios />
                    </div>

                    {/* Carrosséis por categoria */}
                    <div className="w-full">
                        <DestaquesCategorias />
                    </div>
                </div>
            </main>
    
    );
}

