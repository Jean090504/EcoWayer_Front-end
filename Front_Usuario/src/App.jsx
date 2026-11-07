import { useState } from "react";

// Layout fixo que aparece em todas as telas
import Header from "./components/layout/header.jsx";
import Footer from "./components/layout/footer.jsx"; 

// Telas que mudam dentro do <main>
import Home from "./pages/telaHome.jsx";

// Cards que abrem por cima da tela (login, cadastro e verificação)
import Login from "./pages/login.jsx";
import CriarConta from "./pages/criarConta.jsx";
import VerificacaoNumero from "./pages/verificarNumero.jsx";
import AssistenteChat from "./components/AssistenteChat.jsx";

// ---------------------------------------------------------------
// 1. O App guarda quem está logado (usuario) e quais cards estão abertos.
// 2. Header e Footer ficam sempre aqui. O <main> só troca a tela.
// 3. Criar conta:
//    preencho o cadastro -> App manda o SMS -> abre a verificação
//    -> digito o código -> se estiver certo, o App define o usuario
//    -> o header muda sozinho (some "Criar Conta", aparece foto e nome).

// 4. Login com Google:
//    escolho a conta -> o Login lê nome e foto -> chama onLoginSuccess
//    -> o App define o usuario -> o header muda.
// 5. Sem backend ainda: utilizando o VITE_USAR_MOCK=true no .env para receber uma simulação de codigo
//    (o código do SMS é sempre 123456).
// ---------------------------------------------------------------

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const USAR_MOCK = import.meta.env.VITE_USAR_MOCK === "true";

const CODIGO_MOCK = "123456";
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Chama o backend e traduz os erros pra mensagem que aparece pro usuário
async function chamarApi(rota, corpo) {
    let resposta;

    try {
        resposta = await fetch(`${API_URL}/verificacao/${rota}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(corpo)
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor. Tente novamente.");
    }

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
        throw new Error(dados.erro || "Algo deu errado. Tente novamente.");
    }

    return dados;
}

// Pede pro backend enviar o código por SMS
async function enviarCodigo(telefone) {
    if (USAR_MOCK) {
        await esperar(800);
        console.info(`[MOCK] SMS "enviado" para ${telefone}. Código: ${CODIGO_MOCK}`);
        return { ok: true };
    }

    return chamarApi("enviar", { telefone });
}

// Pede pro backend conferir o código que digitei
async function conferirCodigo(telefone, codigo) {
    if (USAR_MOCK) {
        await esperar(800);

        if (codigo !== CODIGO_MOCK) {
            throw new Error("Código incorreto. Você tem mais 4 tentativas.");
        }

        return { ok: true };
    }

    return chamarApi("verificar", { telefone, codigo });
}

// ---------------------------------------------------------------

export default function App() {

    // Quem está logado (null = ninguém). O header lê isso daqui.
    const [usuario, setUsuario] = useState(null);

    // Qual tela aparece dentro do <main>.
    // Por enquanto só tem "home". Tela nova = novo case no renderizarTela().
    const [telaAtual, setTelaAtual] = useState("home");

    // Quais cards estão abertos por cima da tela
    const [abrirLogin, setAbrirLogin] = useState(false);
    const [abrirCadastro, setAbrirCadastro] = useState(false);
    const [abrirVerificacao, setAbrirVerificacao] = useState(false);

    // O que preenchi no cadastro (fica só na memória)
    const [dadosCadastro, setDadosCadastro] = useState(null);


    // Login deu certo (e-mail/senha ou Google): guarda o usuário e fecha o card
    function realizarLogin(dadosUsuario) {
        setUsuario(dadosUsuario);
        setAbrirLogin(false);
    }

    // Fecha o login e abre o cadastro
    function abrirTelaCadastro() {
        setAbrirLogin(false);
        setAbrirCadastro(true);
    }

    // Cadastro preenchido: manda o SMS e abre a verificação.
    // Se o envio falhar, o erro volta pro CriarConta mostrar na tela.
    async function continuarVerificacao(dados) {
        await enviarCodigo(dados.telefone);

        setDadosCadastro(dados);
        setAbrirCadastro(false);
        setAbrirVerificacao(true);
    }

    // Volta da verificação pro cadastro (os campos continuam preenchidos)
    function voltarCadastro() {
        setAbrirVerificacao(false);
        setAbrirCadastro(true);
    }

    // Confere o código. Certo = loga e o header muda sozinho.
    // Errado = dá erro e a tela de verificação mostra a mensagem.
    async function verificarCodigo(codigo) {
        await conferirCodigo(dadosCadastro.telefone, codigo);

        // Não guardo a senha no usuário logado
        const { nome, email, telefone } = dadosCadastro;

        setUsuario({ nome, email, telefone, foto: null });

        setAbrirVerificacao(false);
        setDadosCadastro(null);
    }

    // Pede um novo SMS
    async function reenviarCodigo() {
        await enviarCodigo(dadosCadastro.telefone);
    }

    // Escolhe qual tela aparece dentro do <main>
    function renderizarTela() {
        switch (telaAtual) {

            // case "perfil":
            //     return <MeuPerfil usuario={usuario} />;

            case "home":
            default:
                return <Home />;
        }
    }


    return (
        <div className="flex min-h-screen flex-col gap-8">

            {/* Header: sempre aqui, quem controla é o App */}
            <Header
                usuario={usuario}
                onAbrirLogin={() => setAbrirLogin(true)}
                onAbrirCriarConta={abrirTelaCadastro}
            />

            {/* Main: só o conteúdo muda conforme a tela atual */}
            <main className="flex flex-1 flex-col items-center">
                {renderizarTela()}
            </main>

            {/* Footer: sempre aqui também */}
            <Footer />
            <AssistenteChat />

            {/* Card de login */}
            {abrirLogin && (
                <Login
                    onClose={() => setAbrirLogin(false)}
                    onLoginSuccess={realizarLogin}
                    onAbrirCriarConta={abrirTelaCadastro}
                />
            )}

            {/* Card de cadastro */}
            {abrirCadastro && (
                <CriarConta
                    dadosIniciais={dadosCadastro}
                    onClose={() => setAbrirCadastro(false)}
                    onContinuarVerificacao={continuarVerificacao}
                />
            )}

            {/* Card de verificação do telefone */}
            {abrirVerificacao && (
                <VerificacaoNumero
                    telefone={dadosCadastro?.telefone}
                    onVoltar={voltarCadastro}
                    onVerificar={verificarCodigo}
                    onReenviar={reenviarCodigo}
                />
            )}

        </div>
    );
}
