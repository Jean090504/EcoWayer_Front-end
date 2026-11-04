
import { useState } from "react";

import Header from "../components/layout/cima.jsx";
import Baixo from "../components/layout/baixo.jsx";
import Banner from "../components/layout/banner.jsx";
import Destaques from "../components/layout/destaqueAnuncios.jsx";
import Categorias from "../components/layout/categorias.jsx";

import Login from "./login.jsx";
import CriarConta from "./criarConta.jsx";
import VerificacaoNumero from "./verificarNumero.jsx";

export default function Home() {

    // Dados do usuário logado
    const [usuario, setUsuario] = useState(null);

    // Controle das telas
    const [abrirLogin, setAbrirLogin] = useState(false);
    const [abrirCadastro, setAbrirCadastro] = useState(false);
    const [abrirVerificacao, setAbrirVerificacao] = useState(false);

    // Armazena os dados preenchidos no cadastro
    const [dadosCadastro, setDadosCadastro] = useState(null);

    // Login realizado
    function realizarLogin(dadosUsuario) {
        setUsuario(dadosUsuario);
        setAbrirLogin(false);
    }

    // Abre o cadastro
    function abrirTelaCadastro() {
        setAbrirLogin(false);
        setAbrirCadastro(true);
    }

    // Recebe os dados do cadastro e abre a verificação
    function continuarVerificacao(dados) {
        setDadosCadastro(dados);

        setAbrirCadastro(false);
        setAbrirVerificacao(true);
    }

    // Volta da verificação para o cadastro
    function voltarCadastro() {
        setAbrirVerificacao(false);
        setAbrirCadastro(true);
    }

    // Recebe o código digitado
    function verificarCodigo(codigo) {
        console.log("Código informado:", codigo);
        console.log("Dados do cadastro:", dadosCadastro);

        // Aqui será implementada a validação pelo backend.
    }

    // Reenviar código SMS
    function reenviarCodigo() {
        console.log(
            "Solicitando novo código para:",
            dadosCadastro?.telefone
        );

        // Aqui será implementado o envio pelo serviço de SMS.
    }

    return (
        <div className="flex min-h-screen flex-col gap-8">

            {/* Header */}
            <Header
                usuario={usuario}
                onAbrirLogin={() => setAbrirLogin(true)}
                onAbrirCriarConta={abrirTelaCadastro}
            />

            {/* Conteúdo principal */}
            <main className="flex flex-1 flex-col items-center">

                <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-4 px-4">

                    {/* Categorias */}
                    <Categorias />

                    {/* Banner */}
                    <div className="w-full">
                        <Banner />
                    </div>

                    {/* Anúncios em destaque */}
                    <div className="w-full">
                        <Destaques />
                    </div>

                </div>
            </main>

            {/* Footer */}
            <Baixo />

            {/* Login */}
            {abrirLogin && (
                <Login
                    onClose={() => setAbrirLogin(false)}
                    onLoginSuccess={realizarLogin}
                    onAbrirCriarConta={abrirTelaCadastro}
                />
            )}

            {/* Cadastro */}
            {abrirCadastro && (
                <CriarConta
                    onClose={() => setAbrirCadastro(false)}
                    onContinuarVerificacao={continuarVerificacao}
                />
            )}

            {/* Verificação de telefone */}
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
