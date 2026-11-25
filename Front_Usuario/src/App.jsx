import { useEffect, useState } from "react"

import { Header, Footer } from './components/layout'

import Login from "./components/cards/conta/cardLogin.jsx"

import { FluxoCriarConta, FluxoDenunciarAnuncio } from './components/fluxos'
import DenunciarAnuncio from './pages/DenunciarAnuncio.jsx'
import AnunciosVendedor from './pages/AnunciosVendedor.jsx'

import {
    Home,
    ConfiguracoesPerfil,
    AvaliacaoAnuncio,
    DetalhesAnuncio,
    MinhaCarteira,
    PontosBeneficios,
    Insignias,
    CriarNovoAnuncio,
    TelaMeuPerfil,
    Notificacoes,
    Chat,
    EditarAnuncio,
    ConfirmacaoAnuncioAlterado,
    SessaoEncerrada
} from './pages'

import { logoutUsuario } from "./services/userService.js"
import { EVENTO_SESSAO_EXPIRADA, sessaoFoiEncerrada } from "./services/sessionService.js"

const CHAVE_FAVORITOS = "ecowayer_favoritos"

export default function App() {

    const [categoria, setCategoria] = useState("tudo")
    const [busca, setBusca] = useState("")
    const [favoritos, setFavoritos] = useState(() => {
        try {
            const salvos = JSON.parse(localStorage.getItem(CHAVE_FAVORITOS) || "[]")
            return Array.isArray(salvos) ? salvos.map(String) : []
        } catch {
            return []
        }
    })

    useEffect(() => {
        try { localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos)) } catch {
            // A lista continua disponível durante a navegação se o armazenamento estiver bloqueado.
        }
    }, [favoritos])

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
    const [anuncioSelecionado, setAnuncioSelecionado] = useState(null)
    const [anuncioOrigemVendedor, setAnuncioOrigemVendedor] = useState(null)
    const [veioDaListaVendedor, setVeioDaListaVendedor] = useState(false)
    const [anuncioConversa, setAnuncioConversa] = useState(null)
    const [mensagemDenunciada, setMensagemDenunciada] = useState(null)
    const [telaAtiva, setTelaAtiva] = useState("home")
    const [abrirLogin, setAbrirLogin] = useState(false)
    const [abrirCadastro, setAbrirCadastro] = useState(false)
    const [cadastroConcluido, setCadastroConcluido] = useState(null)
    const [anuncioAlterado, setAnuncioAlterado] = useState(false)
    const [sessaoExpirada, setSessaoExpirada] = useState(sessaoFoiEncerrada)
    const [encerrandoSessao, setEncerrandoSessao] = useState(false)
    const [avisoDetalhes, setAvisoDetalhes] = useState('')

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

    function favoritar(id) {
        if (!usuario) return
        const chave = String(id)
        setFavoritos(atuais => atuais.includes(chave) ? atuais.filter(item => item !== chave) : [...atuais, chave])
    }

    const favoritarAutenticado = usuario ? favoritar : undefined

    function abrirAnunciosVendedor(anuncio) {
        setAnuncioOrigemVendedor(anuncio)
        navegar("anunciosVendedor")
    }

    function abrirAnuncio(anuncio, daListaVendedor = false) {
        setVeioDaListaVendedor(daListaVendedor === true)
        setAvisoDetalhes('') // NOVO: limpa o aviso ao abrir outro anúncio
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

    // NOVO
    function abrirDenuncia() {
        if (!usuario) { pedirLogin(); return } // precisa estar logado para denunciar
        setAvisoDetalhes('')
        navegar("denunciarAnuncio")
    }

    // NOVO
    function voltarParaAnuncio() {
        navegar("detalhesAnuncio")
    }

    // NOVO
    function denunciaEnviada() {
        setAvisoDetalhes('Denúncia enviada. Obrigado por ajudar a manter a comunidade segura!')
        navegar("detalhesAnuncio")
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
                busca={busca}
                onBuscar={setBusca}
            />

            <main className="flex flex-1 flex-col">
                {sessaoExpirada ? <SessaoEncerrada encerrando={encerrandoSessao} onEntrar={pedirLogin} /> : <>
                {telaAtiva === "home" && (
                    <Home
                        onNavegar={navegar}
                        onAbrirAnuncio={abrirAnuncio}
                        categoria={categoria}
                        busca={busca}
                        onSelecionarCategoria={setCategoria}
                        favoritos={favoritos}
                        favoritar={favoritarAutenticado}
                    />
                )}
                {telaAtiva === "detalhesAnuncio" && (
                    <DetalhesAnuncio
                        key={`${anuncioSelecionado?.id}-${anuncioSelecionado?.nome}`}
                        anuncioSelecionado={anuncioSelecionado}
                        onNavegar={navegar}
                        onAbrirAnuncio={anuncio => abrirAnuncio(anuncio, veioDaListaVendedor)}
                        onConversar={abrirChat}
                        onVerAnunciosVendedor={veioDaListaVendedor ? () => navegar("anunciosVendedor") : abrirAnunciosVendedor}
                        onVoltarAoVendedor={veioDaListaVendedor ? () => navegar("anunciosVendedor") : undefined}
                        favoritos={favoritos}
                        favoritar={favoritarAutenticado}
                        onDenunciar={abrirDenuncia}      // NOVO
                        avisoInicial={avisoDetalhes}     // NOVO
                    />
                )}
                {telaAtiva === "anunciosVendedor" && anuncioOrigemVendedor && (
                    <AnunciosVendedor
                        anuncio={anuncioOrigemVendedor}
                        onVoltar={() => abrirAnuncio(anuncioOrigemVendedor)}
                        onAbrirAnuncio={anuncio => abrirAnuncio(anuncio, true)}
                        favoritos={favoritos}
                        favoritar={favoritarAutenticado}
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
                {telaAtiva === "configuracoesPerfil" && <ConfiguracoesPerfil tema={tema} onAlterarTema={alterarTema} usuario={usuario} onAtualizarUsuario={setUsuario} onNavegar={navegar} onContaDesativada={sair} />}
                {telaAtiva === "editarAnuncio" && <EditarAnuncio key={anuncioSelecionado?.id} anuncioId={anuncioSelecionado?.id} onNavegar={navegar} onSalvo={concluirEdicao} />}
                {telaAtiva === "denunciarAnuncio" && (   // NOVO
                    <FluxoDenunciarAnuncio
                        anuncio={anuncioSelecionado}
                        onNavegar={voltarParaAnuncio}
                        onDenunciaEnviada={denunciaEnviada}
                    />
                )}
                {telaAtiva === "denunciarMensagem" && mensagemDenunciada && (
                    <DenunciarAnuncio mensagem={mensagemDenunciada} onNavegar={navegar} />
                )}
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
