import Categorias from "../components/layout/categorias.jsx";
import Banner from "../components/layout/banner.jsx";
import Destaques from "../components/layout/destaqueAnuncios.jsx";

// Tela principal (inicial)
// Aqui só tem o conteúdo da home
// O header e o footer quem chama é o App, então não coloco aqui
export default function Home({ busca = "", categoria = "", onCategoria }) {
    return (
        <div className="mx-auto flex w-full max-w-[1800px] flex-col items-center gap-7 px-4 sm:px-8 lg:px-12 2xl:px-16">

            {/* Categorias */}
            <Categorias categoriaSelecionada={categoria} onCategoria={onCategoria} />

            {/* Banner */}
            <div className="w-full">
                <Banner />
            </div>

            {/* Anúncios em destaque */}
            <div className="w-full">
                <Destaques busca={busca} categoria={categoria} />
            </div>

        </div>
    );
}
