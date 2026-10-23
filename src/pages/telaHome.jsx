
import Cima from '../components/layout/cima.jsx'
import Baixo from '../components/layout/baixo.jsx'

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">

            {/* Chama o header */}
            <Cima />

            {/* Conteúdo principal da tela */}
            <main className="flex-1">


                {/* Contêiner para guardar as categorias da home */}
                <div className="flex items-center gap-2 overflow-x-auto h-[70px] px-1 whitespace-nowrap">

                    {/* Botão de categorias + ícone de > */}
                    <button
                        type="button"
                        className="flex items-center justify-center gap-1 h-10 px-4 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold shrink-0"
                    >
                        categorias
                        <span className="text-lg leading-none">›</span>
                    </button>

                    {/* Botão de "Tudo" */}
                    <button
                        type="button"
                        className="flex items-center justify-center h-10 w-[120px] rounded-full bg-green-600 text-white text-sm font-semibold shrink-0"
                    >
                        Tudo
                    </button>

                    {/* Botão de "Favoritos" */}
            <button
                        type="button"
                        className="flex items-center justify-center h-10 w-[120px] rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold shrink-0"
                    >
                        favoritos
                    </button>

                    {/* Botão de "Móveis" */}
                    <button
                        type="button"
                        className="flex items-center justify-center h-10 w-[120px] rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold shrink-0"
                    >
                        Móveis
                    </button>

                    {/* Botão de "Fardos" */}
                    <button
                        type="button"
                        className="flex items-center justify-center h-10 w-[120px] rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold shrink-0"
                    >
                        Fardos
                    </button>

                    {/* Botão de "Vidro" */}
                    <button
                        type="button"
                        className="flex items-center justify-center h-10 w-[120px] rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold shrink-0"
                    >
                        vidro
                    </button>

                    {/* Botão de "Papelão" */}
                    <button
                        type="button"
                        className="flex items-center justify-center h-10 w-[120px] rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold shrink-0"
                    >
                        Papelão
                    </button>

                    {/* Botão de "Madeira" */}
                    <button
                        type="button"
                        className="flex items-center justify-center h-10 w-[120px] rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold shrink-0"
                    >
                        madeira
                    </button>

                    {/* Botão de "Eletrodomésticos" */}
                    <button
                        type="button"
                        className="flex items-center justify-center h-10 px-4 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold shrink-0"
                    >
                        eletro domesticos
                    </button>

                    {/* Botão de "Dispositivos" */}
                    <button
                        type="button"
                        className="flex items-center justify-center h-10 px-4 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold shrink-0"
                    >
                        dispositivos
                    </button>

                </div>
            </main>

            {/* Chama o footer */}
            <Baixo />

        </div>
    )
}
