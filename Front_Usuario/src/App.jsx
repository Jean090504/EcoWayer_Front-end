import { useState } from "react";

import Header from "./components/layout/header.jsx";
import Footer from "./components/layout/footer.jsx";

import TelaMeuPerfil from "./pages/MeuPerfil.jsx";

import mockPerfil from "./mocks/mockMeuPerfil.js";

// Imports das outras telas (voltam quando você reativar as áreas comentadas)
// import FluxoCriarConta from "./components/fluxos/fluxoCriarConta.jsx";
// import TelaHome from "./pages/Home.jsx";
// import TelaAvaliacaoAnuncio from "./pages/AvaliacaoAnuncio.jsx";
// import TelaCriarNovoAnuncio from "./pages/CriarNovoAnuncio.jsx";
// import CardLogin from "./components/cards/conta/cardLogin.jsx";
// import CardEditarAnuncio from "./components/cards/editarAnuncio/cardEditarAnuncio.jsx";
// import CardMenssagem from "./components/cards/editarAnuncio/cardMenssagemDeAnuncioAlterado.jsx";


export default function App() {

    // O Header usa estas 3 coisas, então elas precisam existir
    // (por enquanto o usuário vem do mock, pra o header aparecer logado)
    const [usuario, setUsuario] = useState(mockPerfil.usuario);
    const [abrirLogin, setAbrirLogin] = useState(false);
    const [abrirCadastro, setAbrirCadastro] = useState(false);

    // Controla a navegação entre as telas (por enquanto só mostra no console)
    function navegar(tela) {
        console.log("Navegar para:", tela);
    }

    // const [telaAtiva, setTelaAtiva] = useState("home");

    // function realizarLogin(dadosUsuario) {
    //     setUsuario(dadosUsuario);
    //     setAbrirLogin(false);
    // }

    return (
        <div className="flex min-h-screen flex-col">
            <Header
                usuario={usuario}
                onAbrirLogin={() => setAbrirLogin(true)}
                onAbrirCriarConta={() => setAbrirCadastro(true)}
                onAbrirNovoAnuncio={() => navegar("novoAnuncio")}
                onNavegar={navegar}
            />

            <main className="flex flex-1 flex-col">
                {/* {telaAtiva === "home" && (
                    <TelaHome onNavegar={navegar} />
                )}

                {telaAtiva === "avaliacao" && (
                    <TelaAvaliacaoAnuncio onNavegar={navegar} />
                )}

                {telaAtiva === "novoAnuncio" && (
                    <TelaCriarNovoAnuncio onNavegar={navegar} />
                )} */}

                <TelaMeuPerfil />
            </main>

            <Footer />

            {/* {abrirLogin && (
                <FluxoLogin
                    onClose={() => setAbrirLogin(false)}
                    onLoginSuccess={realizarLogin}
                    onAbrirCriarConta={() => {
                        setAbrirLogin(false);
                        setAbrirCadastro(true);
                    }}
                />
            )} */}

            {/* {abrirCadastro && (
                <FluxoCriarConta
                    onClose={() => setAbrirCadastro(false)}
                    onContaCriada={(novoUsuario) => {
                        setUsuario(novoUsuario);
                        setAbrirCadastro(false);
                    }}
                />
            )} */}
        </div>
    );
}