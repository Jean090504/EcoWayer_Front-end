import Categorias from "../components/layout/categorias.jsx"
import Banner from "../components/layout/banner.jsx"
import DestaqueAnuncios from "../components/layout/destaqueAnuncios.jsx"

export default function Home() {
    return (
        <main className = "flex flex-1 w-full flex-col items-center py-5">
            <div className = "flex flex-col w-[90%] items-center gap-4">
                <Categorias />
                <Banner />
                <DestaqueAnuncios />
            </div>
        </main>
    )
}