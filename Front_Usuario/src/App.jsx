import { useEffect, useState } from "react"

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
import EditarAnuncio from "./pages/editarAnuncio.jsx"
import ConfirmacaoAnuncioAlterado from "./components/cards/editarAnuncio/cardMenssagemDeAnuncioAlterado.jsx"
import SessaoEncerrada from "./pages/SessaoEncerrada.jsx"
import { EVENTO_SESSAO_EXPIRADA, sessaoFoiEncerrada } from "./services/sessionService.js"

export default function App() {
    const [usuario, setUsuario] = useState(() => {
        if (sessaoFoiEncerrada()) return null
        try { return JSON.parse(sessionStorage.getItem("ecowayer_usuario") || "null") } catch { return null }
    })
    const [anuncioSelecionado, setAnuncioSelecionado] = useState(null)
    const [anuncioConversa, setAnuncioConversa] = useState(null)
    const [telaAtiva, setTelaAtiva] = useState("home")
    const [abrirLogin, setAbrirLogin] = useState(false)
    const [abrirCadastro, setAbrirCadastro] = useState(false)
    const [anuncioAlterado, setAnuncioAlterado] = useState(false)
    const [sessaoExpirada, setSessaoExpirada] = useState(sessaoFoiEncerrada)
    const [encerrandoSessao, setEncerrandoSessao] = useState(false)

    useEffect(() => {
        let ativo = true
        function sessaoEncerrada(evento) {
            setUsuario(null)
            setAnuncioSelecionado(null)
            setAnuncioConversa(null)
            setAnuncioAlterado(false)
            setAbrirCadastro(false)
            setAbrirLogin(false)
            setSessaoExpirada(true)
            setEncerrandoSessao(true)
            setTelaAtiva("home")
            window.scrollTo(0, 0)
            evento.detail.encerramento.finally(() => { if (ativo) setEncerrandoSessao(false) })
        }
        window.addEventListener(EVENTO_SESSAO_EXPIRADA, sessaoEncerrada)
        return () => { ativo = false; window.removeEventListener(EVENTO_SESSAO_EXPIRADA, sessaoEncerrada) }
    }, [])

    function pedirLogin() {
        if (!encerrandoSessao) setAbrirLogin(true)
    }

    function realizarLogin(dadosUsuario) {
        setUsuario(dadosUsuario)
        setAbrirLogin(false)
        if (sessaoExpirada) setTelaAtiva("perfil")
        setSessaoExpirada(false)
    }

    function navegar(tela) {
        if (sessaoExpirada) { pedirLogin(); return }
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

    function editarAnuncio(anuncio) {
        setAnuncioSelecionado(anuncio)
        setTelaAtiva("editarAnuncio")
        window.scrollTo(0, 0)
    }

    function concluirEdicao() {
        setTelaAtiva("perfil")
        setAnuncioAlterado(true)
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header
                usuario={usuario}
                onAbrirLogin={pedirLogin}
                onAbrirCriarConta={() => sessaoExpirada ? pedirLogin() : setAbrirCadastro(true)}
                onAbrirNovoAnuncio={() => navegar("novoAnuncio")}
                onNavegar={navegar}
            />

            <main className="flex flex-1 flex-col">
                {sessaoExpirada ? <SessaoEncerrada encerrando={encerrandoSessao} onEntrar={pedirLogin} /> : <>
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
                {telaAtiva === "perfil" && <TelaMeuPerfil onNavegar={navegar} onEditarAnuncio={editarAnuncio} />}
                {telaAtiva === "editarAnuncio" && <EditarAnuncio key={anuncioSelecionado?.id} anuncioId={anuncioSelecionado?.id} onNavegar={navegar} onSalvo={concluirEdicao} />}
                {telaAtiva === "denunciarAnuncio" && <DenunciarAnuncio onNavegar={navegar} />}
                </>}
            </main>

            <Footer />
            {anuncioAlterado && <ConfirmacaoAnuncioAlterado onFechar={() => setAnuncioAlterado(false)} />}

            {abrirLogin && (
                <Login
                    exigirLogin={sessaoExpirada}
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
