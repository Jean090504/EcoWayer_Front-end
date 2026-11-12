import Categorias from "../components/layout/categorias.jsx";
import Banner from "../components/layout/banner.jsx";
import DestaqueAnuncios from "../components/layout/destaqueAnuncios.jsx";

export default function Home() {
    return (
        <div className = "flex flex-1 w-full flex-col items-center mt-7">
            <main className = "flex flex-1 w-full flex-col items-center">
                <div className = "flex w-[90%] flex-col items-center gap-4">
                    
                    {/* chama as categorias */}
                    <Categorias />

                    {/* Banner */}
                    <div className = "w-full">
                        <Banner />
                    </div>

                    {/* Anúncios em destaque */}
                    <div className = "w-full">
                        <DestaqueAnuncios />
                    </div>
                </div>
            </main>
        </div>
    );
}