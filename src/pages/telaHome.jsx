import Cima from '../components/layout/cima.jsx'
import Baixo from '../components/layout/baixo.jsx'
import Banner from '../components/layout/banner.jsx'
import Destaques from '../components/layout/destaqueAnuncios.jsx'

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col">

            {/* Header */}
            <Cima />

            {/* Conteúdo principal */}
            <main className="flex flex-1 flex-col items-center">

                {/* Contêiner principal: centralizado e com a mesma largura do banner */}
                <div className="w-full max-w-[1280px] mx-auto px-4 flex flex-col gap-4 items-center">

                    {/* Categorias - altura e espaçamento ajustados para ficar igual ao protótipo */}
                    <div className="flex h-12 w-full items-center justify-center gap-4 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

                        <button
                            type="button"
                            className="flex h-9 shrink-0 items-center justify-center gap-1 rounded-full border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-600"
                        >
                            categorias
                            <span className="text-base leading-none">›</span>
                        </button>

                        <button
                            type="button"
                            className="flex h-9 shrink-0 items-center justify-center rounded-full bg-green-600 px-6 text-sm font-semibold text-white"
                        >
                            Tudo
                        </button>

                        <button
                            type="button"
                            className="flex h-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-600"
                        >
                            favoritos
                        </button>

                        <button
                            type="button"
                            className="flex h-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-600"
                        >
                            Móveis
                        </button>

                        <button
                            type="button"
                            className="flex h-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-600"
                        >
                            Fardos
                        </button>

                        <button
                            type="button"
                            className="flex h-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-600"
                        >
                            vidro
                        </button>

                        <button
                            type="button"
                            className="flex h-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-600"
                        >
                            Papelão
                        </button>

                        <button
                            type="button"
                            className="flex h-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-600"
                        >
                            madeira
                        </button>

                        <button
                            type="button"
                            className="flex h-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-600"
                        >
                            eletro domesticos
                        </button>

                        <button
                            type="button"
                            className="flex h-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-600"
                        >
                            dispositivos
                        </button>

                    </div>

                    {/* Banner */}
                    <div className="w-full">
                        <Banner />
                    </div>

                    {/* Anúncios em destaque */}
                    <div className="w-full">
                        <Destaques />
                    </div>

                </div>

            </main>

            {/* Footer */}
            <Baixo />

        </div>
    )
}