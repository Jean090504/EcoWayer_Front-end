import { useState } from "react"

import Header from "./components/layout/header.jsx"
import Footer from "./components/layout/footer.jsx"
import Login from "./components/cards/conta/cardLogin.jsx"
import FluxoCriarConta from "./components/fluxos/fluxoCriarConta.jsx"

import Home from "./pages/Home.jsx"
import AvaliacaoAnuncio from "./pages/AvaliacaoAnuncio.jsx"
import DetalhesAnuncio from "./pages/detalhesAnuncio.jsx";
import MinhaCarteira from "./pages/MinhaCarteira.jsx"
import PontosBeneficios from "./pages/PontosBeneficios.jsx"
import Insignias from "./pages/Insignias.jsx"
import CriarNovoAnuncio from "./pages/criarNovoAnuncio.jsx"
import TelaMeuPerfil from "./pages/meuPerfil.jsx"
import DenunciarAnuncio from "./pages/DenunciarAnuncio.jsx"
import Chat from "./pages/Chat.jsx"

export default function App() {
    const [usuario, setUsuario] = useState(() => {
        try { return JSON.parse(sessionStorage.getItem("ecowayer_usuario") || "null") } catch { return null }
    })
    const [anuncioSelecionado, setAnuncioSelecionado] = useState(null)
    const [anuncioConversa, setAnuncioConversa] = useState(null)
    const [telaAtiva, setTelaAtiva] = useState("home")
    const [abrirLogin, setAbrirLogin] = useState(false)
    const [abrirCadastro, setAbrirCadastro] = useState(false)

    function realizarLogin(dadosUsuario) {
        setUsuario(dadosUsuario)
        setAbrirLogin(false)
    }

    function navegar(tela) {
        setTelaAtiva(tela)
    }

    function abrirAnuncio(anuncio) {
        setAnuncioSelecionado(anuncio)
        setTelaAtiva("detalhesAnuncio")
        window.scrollTo(0, 0)
    }

    function abrirChat(anuncio) {
        setAnuncioConversa(anuncio)
        setTelaAtiva("chat")
        window.scrollTo(0, 0)
    }

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
                {telaAtiva === "home" && <Home onNavegar={navegar} onAbrirAnuncio={abrirAnuncio} />}
                {telaAtiva === "detalhesAnuncio" && (
                    <DetalhesAnuncio
                        key={`${anuncioSelecionado?.id}-${anuncioSelecionado?.nome}`}
                        anuncioSelecionado={anuncioSelecionado}
                        onNavegar={navegar}
                        onAbrirAnuncio={abrirAnuncio}
                        onConversar={abrirChat}
                    />
                )}
                {telaAtiva === "avaliacao" && <AvaliacaoAnuncio onNavegar={navegar} />}
                {telaAtiva === "chat" && <Chat key={usuario?.id || 'visitante'} usuario={usuario} anuncio={anuncioConversa} onAbrirLogin={() => setAbrirLogin(true)} onNavegar={navegar} onAbrirAnuncio={abrirAnuncio} />}
                {telaAtiva === "novoAnuncio" && <CriarNovoAnuncio onNavegar={navegar} />}
                {telaAtiva === "minhaCarteira" && <MinhaCarteira />}
                {telaAtiva === "pontosBeneficios" && <PontosBeneficios />}
                {telaAtiva === "insignias" && <Insignias />}
                {telaAtiva === "perfil" && <TelaMeuPerfil />}
                {telaAtiva === "denunciarAnuncio" && <DenunciarAnuncio onNavegar={navegar} />}
            </main>

            <Footer />

            {abrirLogin && (
                <Login
                    onClose={() => setAbrirLogin(false)}
                    onLoginSuccess={realizarLogin}
                    onAbrirCriarConta={() => {
                        setAbrirLogin(false)
                        setAbrirCadastro(true)
                    }}
                />
            )}

            {abrirCadastro && (
                <FluxoCriarConta
                    onClose={() => setAbrirCadastro(false)}
                    onContaCriada={(novoUsuario) => {
                        setUsuario(novoUsuario)
                        setAbrirCadastro(false)
                    }}
                />
            )}
        </div>
    )
}
