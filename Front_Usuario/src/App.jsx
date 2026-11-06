import { useState } from "react";

import Header from "./components/layout/header.jsx";
import Footer from "./components/layout/footer.jsx";

import Home from "./pages/telaHome.jsx";
import Login from "./pages/login.jsx";
import CriarConta from "./pages/criarConta.jsx";

export default function App() {
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
        <div className = "flex min-h-screen flex-col gap-6 sm:gap-8">
            <Header
                usuario = {usuario}
                onAbrirLogin = {() => setAbrirLogin(true)}
                onAbrirCriarConta = {() => setAbrirCadastro(true)}
            />

            <Home />

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