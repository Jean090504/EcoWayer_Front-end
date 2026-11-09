import { useState } from "react";

<<<<<<< Updated upstream
// Layout fixo que aparece em todas as telas
import Header from "./components/layout/cima.jsx";
import Footer from "./components/layout/baixo.jsx";
=======
// Layout fixo: aparece em todas as telas
import Header from "./components/layout/header.jsx";
import Footer from "./components/layout/footer.jsx";
>>>>>>> Stashed changes

// Telas que mudam dentro do <main>
import Home from "./pages/Home.jsx";

<<<<<<< Updated upstream
// Cards que abrem por cima da tela (login, cadastro e verificação)
import Login from "./pages/login.jsx";
import CriarConta from "./pages/criarConta.jsx";
import VerificacaoNumero from "./pages/verificarNumero.jsx";
=======
// Cards que abrem por cima da tela
import Login from "./pages/Login.jsx";
>>>>>>> Stashed changes

// Fluxo de cadastro (número -> e-mail -> criar conta). Toda a lógica mora lá dentro.
import FluxoCriarConta from "./fluxos/FluxoCriarConta.jsx";

export default function App() {

    // Quem está logado (null = ninguém). O header lê isso daqui.
    const [usuario, setUsuario] = useState(null);

    // Controla a tela ativa dentro do <main>.
    const [telaAtiva, setTelaAtiva] = useState("home");

    // Controla a abertura do login e do fluxo de cadastro.
    const [abrirLogin, setAbrirLogin] = useState(false);
    const [abrirCadastro, setAbrirCadastro] = useState(false);


    // Controla a navegação entre as telas.
    function navegar(tela) {
        setTelaAtiva(tela);
    }

    // Executada quando o login for realizado com sucesso (e-mail/senha ou Google).
    function realizarLogin(dadosUsuario) {
        setUsuario(dadosUsuario);
        setAbrirLogin(false);
    }

    // Fecha o login e abre o cadastro.
    function abrirTelaCadastro() {
        setAbrirLogin(false);
        setAbrirCadastro(true);
    }

    // Executada quando o cadastro termina: guarda o usuário e fecha o fluxo.
    // O header muda sozinho porque lê o usuário daqui.
    function contaCriada(novoUsuario) {
        setUsuario(novoUsuario);
        setAbrirCadastro(false);
    }

    return (
        <div className="flex min-h-screen flex-col gap-8">

            {/* Header: sempre aqui. O onNavegar já está pronto pra quando ele precisar trocar de tela */}
            <Header
                usuario={usuario}
                onAbrirLogin={() => setAbrirLogin(true)}
                onAbrirCriarConta={abrirTelaCadastro}
                onNavegar={navegar}
            />

            {/* Main: só o conteúdo muda conforme a tela ativa */}
            <main className="flex flex-1 flex-col items-center">
                {telaAtiva === "home" && (
                    <Home onNavegar={navegar} />
                )}
            </main>

            {/* Footer: sempre aqui também */}
            <Footer />

            {/* Card de login */}
            {abrirLogin && (
                <Login
                    onClose={() => setAbrirLogin(false)}
                    onLoginSuccess={realizarLogin}
                    onAbrirCriarConta={abrirTelaCadastro}
                />
            )}

            {/* Fluxo de cadastro (cuida sozinho das 3 etapas) */}
            {abrirCadastro && (
                <FluxoCriarConta
                    onClose={() => setAbrirCadastro(false)}
                    onContaCriada={contaCriada}
                />
            )}

        </div>
    );
}