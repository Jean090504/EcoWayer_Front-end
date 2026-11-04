
import { useState } from "react";

import Header from "../components/layout/cima.jsx";
import Baixo from "../components/layout/baixo.jsx";
import Banner from "../components/layout/banner.jsx";
import Destaques from "../components/layout/destaqueAnuncios.jsx";
import Login from "./login.jsx";
import Categorias from "../components/layout/categorias.jsx"
import CriarConta from "./criarConta.jsx";

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

                    {/* chama as categorias */}
                        <Categorias/>
                 

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
