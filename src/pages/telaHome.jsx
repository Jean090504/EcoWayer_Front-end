
import { useState } from "react";

import Header from "../components/layout/cima.jsx";
import Baixo from "../components/layout/baixo.jsx";
import Banner from "../components/layout/banner.jsx";
import Destaques from "../components/layout/destaqueAnuncios.jsx";
import Login from "../pages/login.jsx";
import CriarConta from "../pages/criarConta.jsx";

export default function Home() {

    // Armazena os dados do usuário logado.
    // null significa que não existe usuário autenticado.
    const [usuario, setUsuario] = useState(null);

    // Controla a abertura dos cards.
    const [abrirLogin, setAbrirLogin] = useState(false);
    const [abrirCadastro, setAbrirCadastro] = useState(false);

    // Executada quando o login for realizado com sucesso.
    function realizarLogin(dadosUsuario) {
        setUsuario(dadosUsuario);
        setAbrirLogin(false);
    }

    return (
        <div className="flex min-h-screen flex-col gap-8">

            {/* Header: recebe os dados do usuário e as funções */}
            <Header
                usuario={usuario}
                onAbrirLogin={() => setAbrirLogin(true)}
                onAbrirCriarConta={() => setAbrirCadastro(true)}
            />

            {/* Conteúdo principal */}
            <main className="flex flex-1 flex-col items-center">

                <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-4 px-4">

                    {/* Categorias */}
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

            {/* Card de Login */}
            {abrirLogin && (
                <Login
                    onClose={() => setAbrirLogin(false)}
                    onLoginSuccess={realizarLogin}
                    onAbrirCriarConta={() => {
                        setAbrirLogin(false);
                        setAbrirCadastro(true);
                    }}
                />
            )}

            {/* Card de Cadastro */}
            {abrirCadastro && (
                <CriarConta
                    onClose={() => setAbrirCadastro(false)}
                />
            )}

        </div>
    );
}
