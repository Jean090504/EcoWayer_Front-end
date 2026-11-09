import { useState } from "react";

import Header from "./components/layout/header.jsx";
import Footer from "./components/layout/footer.jsx";

import Login from "./pages/Login.jsx";
import CriarConta from "./pages/CriarConta.jsx";

import Home from "./pages/Home.jsx";
import AvaliacaoAnuncio from "./pages/AvaliacaoAnuncio.jsx";

export default function App() {
    const [usuario, setUsuario] = useState(null);

    // Controla a tela ativa.
    const [telaAtiva, setTelaAtiva] = useState("home");

    // Controla a abertura dos cards.
    const [abrirLogin, setAbrirLogin] = useState(false);
    const [abrirCadastro, setAbrirCadastro] = useState(false);

    // Executada quando o login for realizado com sucesso.
    function realizarLogin(dadosUsuario) {
        setUsuario(dadosUsuario);
        setAbrirLogin(false);
    }

    // Controla a navegação entre as telas.
    function navegar(tela) {
        setTelaAtiva(tela);
    }

    return (
        <div className = "flex min-h-screen flex-col gap-6 sm:gap-8">
            <Header
                usuario = {usuario}
                onAbrirLogin = {() => setAbrirLogin(true)}
                onAbrirCriarConta = {() => setAbrirCadastro(true)}
                onNavegar = {navegar}
            />

            <main className = "flex flex-1 flex-col">
                {/* {telaAtiva === "home" && (
                    <Home onNavegar = {navegar} />
                )}

                {telaAtiva === "avaliacao" && (
                    <AvaliacaoAnuncio onNavegar = {navegar} />
                )} */}

                <AvaliacaoAnuncio/>
            </main>

            <Footer />

            {abrirLogin && (
                <Login
                    onClose = {() => setAbrirLogin(false)}
                    onLoginSuccess = {realizarLogin}
                    onAbrirCriarConta = {() => {
                        setAbrirLogin(false);
                        setAbrirCadastro(true);
                    }}
                />
            )}

            {abrirCadastro && (
                <CriarConta
                    onClose = {() => setAbrirCadastro(false)}
                />
            )}
        </div>
    );
}