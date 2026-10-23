
import logo from "../../assets/icons/logo/Ecomarket.png";
import lupa from "../../assets/icons/icones/lupa.png";
import filtro from "../../assets/icons/icones/filtro.png";
import carta from "../../assets/icons/icones/carta.png";
import carteira from "../../assets/icons/icones/carteira.png";
import chat from "../../assets/icons/icones/menssagem.png";

export default function Cima() {
    return (
        <header className="w-full min-w-[1366px] h-[116px] bg-white border-b border-gray-100">

            {/* Contêiner dos elementos */}
            <div className="flex items-center justify-between w-full h-full px-6 gap-4">

                {/* Imagem da logo */}
                <div className="flex items-center shrink-0">
                    <img
                        src={logo}
                        alt="EcoMarket"
                        className="h-10 w-[130px] object-contain"
                    />
                </div>

                {/* Campo de pesquisa */}
                <div className="flex flex-1 min-w-[250px] max-w-[560px] items-center rounded-xl border border-gray-200 shadow-sm px-3 h-12">

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

                    {/* Separador e ícone de filtro */}
                    <div className="flex items-center ml-3 pl-3 border-l border-gray-300 h-7 shrink-0">

                        <button
                            type="button"
                            aria-label="Filtros de pesquisa"
                            className="flex items-center justify-center"
                        >
                            <img
                                src={filtro}
                                alt=""
                                className="h-5 w-5 object-contain"
                            />
                        </button>

                    </div>
                </div>

                {/* Navegação */}
                <nav className="flex items-center gap-4 shrink-0">

                    {/* Meus anúncios */}
                    <button
                        type="button"
                        className="flex items-center gap-2 whitespace-nowrap shrink-0"
                    >
                        <img
                            src={carta}
                            alt=""
                            className="h-7 w-7 object-contain"
                        />

                        <span className="text-sm font-medium text-gray-600">
                            Meus anúncios
                        </span>
                    </button>

                    {/* Carteira */}
                    <button
                        type="button"
                        className="flex items-center gap-2 whitespace-nowrap shrink-0"
                    >
                        <img
                            src={carteira}
                            alt=""
                            className="h-7 w-7 object-contain"
                        />

                        <span className="text-sm font-medium text-gray-600">
            Carteira
                        </span>
                    </button>

                    {/* Chat */}
                    <button
                        type="button"
                        className="flex items-center gap-2 whitespace-nowrap shrink-0"
                    >
                        <img
                            src={chat}
                            alt=""
                            className="h-7 w-7 object-contain"
                        />

                        <span className="text-sm font-medium text-gray-600">
                            Chat
                        </span>
                    </button>

                </nav>

                {/* Botões de acesso */}
                <div className="flex items-center gap-4 shrink-0">

                    {/* Entrar */}
                    <button
                        type="button"
                        className="flex items-center justify-center w-[150px] h-11 rounded-full border-2 border-green-600 text-gray-600 text-lg font-semibold hover:bg-green-50 transition shrink-0"
                    >
                        Entrar
                    </button>

                    {/* Anunciar */}
                    <button
                        type="button"
                        className="flex items-center justify-center w-[150px] h-11 rounded-full bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition shrink-0"
                    >
                        Anunciar
                    </button>

        </div>

            </div>
        </header>
    );
}
