import { useState } from "react";

import CriarConta from "../cards/conta/cardCriarConta.jsx";
import VerificacaoNumero from "../cards/conta/cardVerificarNumero.jsx";
import VerificacaoEmail from "../cards/conta/cardVerificarEmail.jsx";
import { enviarCodigo, conferirCodigo } from "../../mocks/mockVerificarNumero.js";
import { enviarCodigoEmail, conferirCodigoEmail } from "../../mocks/mockVerificarEmail.js";
import { criarConta } from "../../mocks/mockCriarConta.js";


// Campos que precisam estar preenchidos pra seguir nas verificações
const CAMPOS_OBRIGATORIOS = [
    "nome",
    "nascimento",
    "cpf",
    "email",
    "telefone",
    "senha",
    "confirmarSenha"
];

// Verifica se todos os campos estão preenchidos (não só espaços em branco)
// Se algum estiver vazio, lança erro e o fluxo não sai da etapa "dados"
function conferirCamposPreenchidos(dados) {
    const algumVazio = CAMPOS_OBRIGATORIOS.some(
        (campo) => !String(dados?.[campo] ?? "").trim()
    );

    if (algumVazio) {
        throw new Error("Preencha todos os campos para continuar.");
    }
}


export default function FluxoCriarConta({ onClose, onContaCriada }) {

    // Qual card está na tela: "dados" | "numero" | "email"
    const [etapa, setEtapa] = useState("dados");

    // O que preenchi no cadastro (fica só na memória)
    const [dadosCadastro, setDadosCadastro] = useState(null);

    // Telefone que já passou na verificação do SMS (pra não pedir de novo)
    const [telefoneVerificado, setTelefoneVerificado] = useState(null);

    // Se o envio do e-mail falhar, guardo a mensagem pra mostrar no card
    const [erroEnvioEmail, setErroEnvioEmail] = useState("");


    // Manda o código por e-mail e abre o card de verificação do e-mail
    async function irParaEmail(dados) {
        try {
            await enviarCodigoEmail(dados.email);
            setErroEnvioEmail("");
        } catch (err) {
            setErroEnvioEmail(
                err.message || "Não foi possível enviar o e-mail. Toque em reenviar."
            );
        }

        setEtapa("email");
    }

    // Cadastro preenchido: manda o SMS e abre a verificação do número.
    // Se algum campo estiver vazio ou o envio falhar, o erro volta
    // pro CriarConta mostrar na tela.
    async function continuarVerificacao(dados) {
        // Barra aqui: campo vazio não segue pra número nem e-mail
        conferirCamposPreenchidos(dados);

        setDadosCadastro(dados);

        // Telefone igual ao que já foi verificado: pula o SMS e vai pro e-mail
        if (dados.telefone === telefoneVerificado) {
            await irParaEmail(dados);
            return;
        }

        await enviarCodigo(dados.telefone);

        setEtapa("numero");
    }

    // Volta de qualquer verificação pro cadastro (os campos continuam preenchidos)
    function voltarCadastro() {
        setEtapa("dados");
    }

    // Confere o código do SMS
    // Certo = guarda que o telefone foi verificado e segue pro e-mail
    // Errado = dá erro e a tela de verificação mostra a mensagem
    async function verificarCodigo(codigo) {
        await conferirCodigo(dadosCadastro.telefone, codigo);

        setTelefoneVerificado(dadosCadastro.telefone);

        await irParaEmail(dadosCadastro);
    }

    // Pede um novo SMS
    async function reenviarCodigo() {
        await enviarCodigo(dadosCadastro.telefone);
    }

    // Confere o código do e-mail e, se estiver certo, cria a conta
    // Quem devolve o usuário é o backend (mock), sem a senha
    // Se algum passo falhar, o erro volta pro card do e-mail mostrar na tela
    async function verificarEmail(codigo) {
        await conferirCodigoEmail(dadosCadastro.email, codigo);

        const { usuario } = await criarConta(dadosCadastro);

        // Terminou: avisa o App. Quando ele fechar o fluxo, tudo que estava
        // guardado aqui (dados, telefone verificado, erro) some sozinho.
        onContaCriada(usuario);
    }

    // Pede um novo código por e-mail
    async function reenviarEmail() {
        await enviarCodigoEmail(dadosCadastro.email);
    }

    return (
        <>
            {/* Etapa 1: dados do cadastro */}
            {etapa === "dados" && (
                <CriarConta
                    dadosIniciais={dadosCadastro}
                    onClose={onClose}
                    onContinuarVerificacao={continuarVerificacao}
                />
            )}

            {/* Etapa 2: verificação do telefone */}
            {etapa === "numero" && (
                <VerificacaoNumero
                    telefone={dadosCadastro?.telefone}
                    onVoltar={voltarCadastro}
                    onVerificar={verificarCodigo}
                    onReenviar={reenviarCodigo}
                />
            )}

            {/* Etapa 3: verificação do e-mail (só depois do número) */}
            {etapa === "email" && (
                <VerificacaoEmail
                    email={dadosCadastro?.email}
                    erroInicial={erroEnvioEmail}
                    onVoltar={voltarCadastro}
                    onAlterarEmail={voltarCadastro}
                    onVerificar={verificarEmail}
                    onReenviar={reenviarEmail}
                />
            )}
        </>
    );
}