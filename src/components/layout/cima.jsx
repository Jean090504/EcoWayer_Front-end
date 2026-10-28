
import logo from "../../assets/icons/logo/Ecomarket.png";
import lupa from "../../assets/icons/icones/lupa.png";
import filtro from "../../assets/icons/icones/filtro.png";
import carta from "../../assets/icons/icones/carta.png";
import carteira from "../../assets/icons/icones/carteira.png";
import chat from "../../assets/icons/icones/menssagem.png";

export default function Cima({ onAbrirCriarConta }) {
    return (
        <header className="mt-3 h-[72px] w-full border-b border-gray-100 bg-white">

            {/* Contêiner dos elementos */}
            <div className="mx-auto flex h-full w-full max-w-[1360px] items-center justify-between gap-5 px-6">

                {/* Logo */}
                <div className="flex shrink-0 items-center">
                    <img
                        src={logo}
                        alt="EcoMarket"
                        className="h-6 w-auto object-contain"
                    />
                </div>

                {/* Campo de pesquisa */}
                <div className="flex h-10 min-w-[220px] max-w-[480px] flex-1 items-center rounded-full border border-gray-200 bg-white px-3">

                    <input
                        type="text"
                        placeholder="Buscar ponto de coleta, bairro..."
                        className="min-w-0 flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-400"
                    />

                    <img
                        src={lupa}
                        alt="Pesquisar"
                        className="ml-2 h-4 w-4 shrink-0 object-contain"
                    />

                    <div className="ml-2 flex h-5 shrink-0 items-center border-l border-gray-200 pl-2">
                        <button
                            type="button"
                            aria-label="Filtros de pesquisa"
                            className="flex items-center justify-center"
                        >
                            <img
                                src={filtro}
                                alt=""
                                className="h-4 w-4 object-contain"
                            />
                        </button>
                    </div>
                </div>

                {/* Navegação */}
                <nav className="flex shrink-0 items-center gap-5">

                    <button
                        type="button"
                        className="flex items-center gap-1.5 whitespace-nowrap"
                    >
                        <img
                            src={carta}
                            alt=""
                            className="h-5 w-5 object-contain"
                        />
                        <span className="text-sm font-medium text-gray-600">
                            Meus anúncios
                        </span>
                    </button>

                    <button
                        type="button"
                        className="flex items-center gap-1.5 whitespace-nowrap"
                    >
                        <img
                            src={carteira}
                            alt=""
                            className="h-5 w-5 object-contain"
                        />
                        <span className="text-sm font-medium text-gray-600">
                            Carteira
                        </span>
                    </button>

                    <button
                        type="button"
                        className="flex items-center gap-1.5 whitespace-nowrap"
                    >
                        <img
                            src={chat}
                            alt=""
                            className="h-5 w-5 object-contain"
                        />
                        <span className="text-sm font-medium text-gray-600">
                            Chat
                        </span>
                    </button>
                </nav>

                {/* Botões de acesso */}
                <div className="flex shrink-0 items-center gap-3">

                    {/* Botão que abre o card */}
                    <button
                        type="button"
                        onClick={onAbrirCriarConta}
                        className="flex h-9 items-center justify-center rounded-full border border-green-600 px-6 text-sm font-semibold text-gray-700 transition hover:bg-green-50"
                    >
                        Criar Conta
                    </button>

                    <button
                        type="button"
                        className="flex h-9 items-center justify-center rounded-full bg-[#724BC2] px-6 text-sm font-semibold text-white transition hover:bg-purple-700"
                    >
                        Logar
                    </button>
                </div>

            </div>
        </header>
    );
}
