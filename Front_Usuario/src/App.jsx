import { useEffect, useState } from "react"

import Header from "./components/layout/header.jsx"
import Footer from "./components/layout/footer.jsx"
import Login from "./components/cards/conta/cardLogin.jsx"
import FluxoCriarConta from "./components/fluxos/fluxoCriarConta.jsx"

import Home from "./pages/Home.jsx"
import ConfiguracoesPerfil from "./pages/ConfiguracoesPerfil.jsx"
import AvaliacaoAnuncio from "./pages/AvaliacaoAnuncio.jsx"
import DetalhesAnuncio from "./pages/detalhesAnuncio.jsx";
import MinhaCarteira from "./pages/MinhaCarteira.jsx"
import PontosBeneficios from "./pages/PontosBeneficios.jsx"
import Insignias from "./pages/Insignias.jsx"
import CriarNovoAnuncio from "./pages/criarNovoAnuncio.jsx"
import TelaMeuPerfil from "./pages/meuPerfil.jsx"
import DenunciarAnuncio from "./pages/DenunciarAnuncio.jsx"
import Notificacoes from "./pages/Notificacoes.jsx"
import Chat from "./pages/Chat.jsx"
import EditarAnuncio from "./pages/editarAnuncio.jsx"
import ConfirmacaoAnuncioAlterado from "./components/cards/editarAnuncio/cardMenssagemDeAnuncioAlterado.jsx"
import SessaoEncerrada from "./pages/SessaoEncerrada.jsx"
import { logoutUsuario } from "./services/userService.js"
import { EVENTO_SESSAO_EXPIRADA, sessaoFoiEncerrada } from "./services/sessionService.js"

export default function App() {
    const [tema, setTema] = useState(() => localStorage.getItem("ecowayer_tema") === "escuro" ? "escuro" : "claro")
    function alterarTema(valor) {
        const novoTema = valor === "escuro" ? "escuro" : "claro"
        setTema(novoTema)
        localStorage.setItem("ecowayer_tema", novoTema)
    }
    const [usuario, setUsuario] = useState(() => {
        if (sessaoFoiEncerrada()) return null
        try { return JSON.parse(sessionStorage.getItem("ecowayer_usuario") || "null") } catch { return null }
    })
    const [categoriaHome, setCategoriaHome] = useState("tudo")
    const [favoritos, setFavoritos] = useState([])
    function favoritar(id) {
        const chave = String(id)
        setFavoritos(atuais => atuais.includes(chave)
            ? atuais.filter(item => item !== chave)
            : [...atuais, chave])
    }
    const [anuncioSelecionado, setAnuncioSelecionado] = useState(null)
    const [anuncioConversa, setAnuncioConversa] = useState(null)
    const [mensagemDenunciada, setMensagemDenunciada] = useState(null)
    const [telaAtiva, setTelaAtiva] = useState("home")
    const [abrirLogin, setAbrirLogin] = useState(false)
    const [abrirCadastro, setAbrirCadastro] = useState(false)
    const [cadastroConcluido, setCadastroConcluido] = useState(null)
    const [anuncioAlterado, setAnuncioAlterado] = useState(false)
    const [sessaoExpirada, setSessaoExpirada] = useState(sessaoFoiEncerrada)
    const [encerrandoSessao, setEncerrandoSessao] = useState(false)

    useEffect(() => {
        let ativo = true
        function sessaoEncerrada(evento) {
            setUsuario(null)
            setAnuncioSelecionado(null)
            setAnuncioConversa(null)
            setMensagemDenunciada(null)
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
        setCadastroConcluido(null)
        if (sessaoExpirada) setTelaAtiva("perfil")
        setSessaoExpirada(false)
    }

    function navegar(tela) {
        if (sessaoExpirada) { pedirLogin(); return }
        if (tela === "chat") setAnuncioConversa(null)
        setTelaAtiva(tela)
        window.scrollTo(0, 0)
    }

    async function sair() {
        const encerramento = logoutUsuario()
        setUsuario(null)
        setAnuncioSelecionado(null)
        setAnuncioConversa(null)
        setMensagemDenunciada(null)
        setAnuncioAlterado(false)
        setAbrirLogin(false)
        setAbrirCadastro(false)
        setSessaoExpirada(false)
        setEncerrandoSessao(true)
        setTelaAtiva("home")
        window.scrollTo(0, 0)
        await encerramento
        setEncerrandoSessao(false)
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

    function denunciarMensagem(mensagem) {
        setMensagemDenunciada(mensagem)
        navegar("denunciarMensagem")
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
        <div data-tema={tema} className="ecowayer-app flex min-h-screen flex-col">
            <Header
                usuario={usuario}
                onAbrirLogin={pedirLogin}
                onAbrirCriarConta={() => sessaoExpirada ? pedirLogin() : setAbrirCadastro(true)}
                onAbrirNovoAnuncio={() => navegar("novoAnuncio")}
                onNavegar={navegar}
                onSair={sair}
            />

            <main className="flex flex-1 flex-col">
                {sessaoExpirada ? <SessaoEncerrada encerrando={encerrandoSessao} onEntrar={pedirLogin} /> : <>
                {telaAtiva === "home" && <Home onAbrirAnuncio={abrirAnuncio} favoritos={favoritos} categoria={categoriaHome} onSelecionarCategoria={setCategoriaHome} />}
                {telaAtiva === "detalhesAnuncio" && (
                    <DetalhesAnuncio
                        key={`${anuncioSelecionado?.id}-${anuncioSelecionado?.nome}`}
                        anuncioSelecionado={anuncioSelecionado}
                        favoritos={favoritos}
                        onFavoritar={favoritar}
                        onNavegar={navegar}
                        onAbrirAnuncio={abrirAnuncio}
                        onConversar={abrirChat}
                        onDenunciar={() => usuario ? navegar("denunciarAnuncio") : pedirLogin()}
                    />
                )}
                {telaAtiva === "avaliacao" && <AvaliacaoAnuncio onNavegar={navegar} />}
                {telaAtiva === "chat" && <Chat key={usuario?.id || 'visitante'} usuario={usuario} anuncio={anuncioConversa} onDenunciarMensagem={denunciarMensagem} onAbrirLogin={() => setAbrirLogin(true)} onNavegar={navegar} onAbrirAnuncio={abrirAnuncio} />}
                {telaAtiva === "novoAnuncio" && <CriarNovoAnuncio onNavegar={navegar} />}
                {telaAtiva === "minhaCarteira" && <MinhaCarteira />}
                {telaAtiva === "pontosBeneficios" && <PontosBeneficios />}
                {telaAtiva === "insignias" && <Insignias />}
                {telaAtiva === "notificacoes" && <Notificacoes />}
                {telaAtiva === "perfil" && <TelaMeuPerfil onNavegar={navegar} onEditarAnuncio={editarAnuncio} />}
                {telaAtiva === "configuracoesPerfil" && <ConfiguracoesPerfil tema={tema} onAlterarTema={alterarTema} usuario={usuario} onAtualizarUsuario={setUsuario} onNavegar={navegar} />}
                {telaAtiva === "editarAnuncio" && <EditarAnuncio key={anuncioSelecionado?.id} anuncioId={anuncioSelecionado?.id} onNavegar={navegar} onSalvo={concluirEdicao} />}
                {telaAtiva === "denunciarMensagem" && mensagemDenunciada && (
                    <DenunciarAnuncio mensagem={mensagemDenunciada} onNavegar={navegar} />
                )}
                {telaAtiva === "denunciarAnuncio" && <DenunciarAnuncio anuncioId={anuncioSelecionado?.id} onNavegar={navegar} />}
                </>}
            </main>

            <Footer />
            {anuncioAlterado && <ConfirmacaoAnuncioAlterado onFechar={() => setAnuncioAlterado(false)} />}

            {abrirLogin && (
                <Login
                    emailInicial={cadastroConcluido?.email || ""}
                    aviso={cadastroConcluido ? "Conta criada com sucesso. Faça login para continuar." : ""}
                    exigirLogin={sessaoExpirada}
                    onClose={() => { setAbrirLogin(false); setCadastroConcluido(null) }}
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
                    onContaCriada={(dados) => {
                        setCadastroConcluido(dados)
                        setAbrirCadastro(false)
                        setAbrirLogin(true)
                    }}
                />
            )}
        </div>
    )
}
