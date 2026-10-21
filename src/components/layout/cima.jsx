import logo from "../../assets/icons/logo/Ecomarket.png"
import lupa from "../../assets/icons/icones/lupa.png"
import filtro from "../../assets/icons/icones/filtro.png"
import carta from "../../assets/icons/icones/carta.png"

export default function Cima() {
    return (

        <div className="w-full bg-white border-b border-gray-100">

            {/* Conteiner dos elementos */}
            <div className="flex items-center px-6 py-4 gap-6">

                {/* Imagem da logo */}
                <div className="flex items-center w-30 h-15 bg-green-200 ">
                    <img
                        src={logo}
                        alt="EcoMarket"
                        className="h-10 object-contain w-[120px]"
                    />
                </div>


                {/* Campo de pesquisa */}
                <div className="flex flex-1 max-w-xl items-center rounded-xl border border-gray-200 shadow-sm px-3 h-12">

                    <input
                        type="text"
                        placeholder="Buscar ponto de coleta, bairro..."
                        className="flex-1 min-w-0 outline-none text-sm text-gray-700 placeholder-gray-400"
                    />

                    {/* Ícone da lupa */}
                    <img
                        src={lupa}
                        alt="Pesquisar"
                        className="h-5 w-5 object-contain shrink-0"
                    />

                    {/* Separador (borda cinza) e ícone de filtro */}
                    <div className="flex items-center ml-3 pl-3 border-l border-gray-300 h-7">

                        <button
                            type="button"
                            className="flex items-center justify-center">

                            <img
                                src={filtro}
                                alt="Filtro"
                                className="h-5 w-5 object-contain"
                            />
                        </button>

                    </div>

                </div>

                {/* Navegação */}
                <nav className="flex items-center w-50 h-12 shrink-0">

                    <button
                        type="button"
                        className="flex intems-center justify-center">

                        <img
                            src={carta}
                            alt="carta"
                            className="h-7 w-7 object-contain" 
                        />

                        <span className="text-sm font-medium text-gray-600">
                            Meus anúncios
                        </span>
                    </button>
                </nav>



            </div>

            {/* Meus anúncios */}
        </div>

    )
}