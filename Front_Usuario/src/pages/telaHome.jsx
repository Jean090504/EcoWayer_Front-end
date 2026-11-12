import Categorias from "../components/layout/categorias.jsx";
import Banner from "../components/layout/banner.jsx";
import Destaques from "../components/layout/destaqueAnuncios.jsx";

// Tela principal (inicial)
// Aqui só tem o conteúdo da home
// O header e o footer quem chama é o App, então não coloco aqui
export default function Home() {
    return (
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-4 px-4">

            {/* Categorias */}
            <Categorias />

            {/* Banner */}
            <div className="w-full">
                <Banner />
            </div>

            {/* Anúncios em destaque */}
            <div className="w-full">
                <Destaques />
            </div>

        </div>
    );
}