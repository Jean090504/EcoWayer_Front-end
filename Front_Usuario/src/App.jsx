import { useEffect, useState } from "react";
import Header from "./components/layout/header.jsx";
import Footer from "./components/layout/footer.jsx";
import Home from "./pages/telaHome.jsx";
import Login from "./pages/login.jsx";
import CriarConta from "./pages/criarConta.jsx";
import VerificacaoNumero from "./pages/verificarNumero.jsx";
import AssistenteChat from "./components/AssistenteChat.jsx";
import { apiFetch } from "./services/api.js";

const dataApi = (valor) => {
    const match = String(valor || "").match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    return match ? `${match[3]}-${match[2]}-${match[1]}` : valor;
};

export default function App() {
    const [usuario, setUsuario] = useState(null);
    const [abrirLogin, setAbrirLogin] = useState(false);
    const [abrirCadastro, setAbrirCadastro] = useState(false);
    const [abrirVerificacao, setAbrirVerificacao] = useState(false);
    const [dadosCadastro, setDadosCadastro] = useState(null);
    const [tipoVerificacao, setTipoVerificacao] = useState("telefone");

    useEffect(() => {
        if (!sessionStorage.getItem("ecowayer_token")) return;
        apiFetch("/users/me").then((resposta) => setUsuario(resposta.usuario)).catch(() => sessionStorage.removeItem("ecowayer_token"));
    }, []);

    async function continuarVerificacao(dados) {
        const resposta = await apiFetch("/auth/register", { method: "POST", body: JSON.stringify({ nome: dados.nome, cpf: dados.cpf, data_nascimento: dataApi(dados.nascimento), id_genero: Number(dados.id_genero), email: dados.email, telefone: dados.telefone, senha: dados.senha }) });
        setDadosCadastro({ ...dados, id_usuario: resposta.id_usuario });
        setTipoVerificacao("telefone");
        setAbrirCadastro(false);
        setAbrirVerificacao(true);
    }

    async function verificarCodigo(codigo) {
        const contato = tipoVerificacao === "telefone" ? dadosCadastro.telefone : dadosCadastro.email;
        await apiFetch(`/auth/verify-${tipoVerificacao === "telefone" ? "phone" : "email"}`, { method: "POST", body: JSON.stringify(tipoVerificacao === "telefone" ? { telefone: contato, codigo_verificacao: codigo } : { email: contato, codigo_verificacao: codigo }) });
        if (tipoVerificacao === "telefone") { setTipoVerificacao("email"); return; }
        const login = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ login: dadosCadastro.email, senha: dadosCadastro.senha }) });
        sessionStorage.setItem("ecowayer_token", login.token);
        setUsuario({ ...login.usuario, nome: dadosCadastro.nome, email: dadosCadastro.email, telefone: dadosCadastro.telefone, foto: null });
        setAbrirVerificacao(false);
        setDadosCadastro(null);
    }

    async function reenviarCodigo() {
        const contato = tipoVerificacao === "telefone" ? dadosCadastro.telefone : dadosCadastro.email;
        await apiFetch("/auth/resend-code", { method: "POST", body: JSON.stringify({ contato, finalidade: tipoVerificacao }) });
    }

    return <div className="flex min-h-screen flex-col gap-8">
        <Header usuario={usuario} onAbrirLogin={() => setAbrirLogin(true)} onAbrirCriarConta={() => { setAbrirLogin(false); setAbrirCadastro(true); }} />
        <main className="flex flex-1 flex-col items-center"><Home /></main>
        <Footer /><AssistenteChat />
        {abrirLogin && <Login onClose={() => setAbrirLogin(false)} onLoginSuccess={(dados) => { setUsuario(dados); setAbrirLogin(false); }} onAbrirCriarConta={() => { setAbrirLogin(false); setAbrirCadastro(true); }} />}
        {abrirCadastro && <CriarConta dadosIniciais={dadosCadastro} onClose={() => setAbrirCadastro(false)} onContinuarVerificacao={continuarVerificacao} />}
        {abrirVerificacao && <VerificacaoNumero telefone={tipoVerificacao === "telefone" ? dadosCadastro?.telefone : dadosCadastro?.email} tipo={tipoVerificacao} onVoltar={() => { setAbrirVerificacao(false); setAbrirCadastro(true); }} onVerificar={verificarCodigo} onReenviar={reenviarCodigo} />}
    </div>;
}
