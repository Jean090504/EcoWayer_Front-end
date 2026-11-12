import { useState } from "react"

// Cards de cada etapa do cadastro
import CriarConta from "../components/cards/criarConta.jsx"
import VerificacaoNumero from "../components/cards/verificarNumero.jsx"
import VerificacaoEmail from "../components/cards/verificarEmail.jsx"

/* 
    Mocks do cadastro (fazem o papel do backend), um por etapa:
    número (SMS) -> e-mail -> criação da conta.
    Na integração, só mudam as rotas e os JSONs dentro de cada mock. 
*/
import { enviarCodigo, conferirCodigo } from "../mocks/mockVerificarNumero.js"
import { enviarCodigoEmail, conferirCodigoEmail } from "../mocks/mockVerificarEmail.js"
import { criarConta } from "../mocks/mockCriarConta.js"

/* 
    Fluxo de cadastro: 1) DADOS  2) NÚMERO (SMS)  3) E-MAIL  -> cria a conta.
    Só um card aparece por vez, quem decide qual é a "etapa".

    Props:
     onClose        -> o usuário fechou o cadastro (o App esconde o fluxo)
     onContaCriada  -> cadastro terminou; recebe o usuário que o backend (mock) devolveu 
*/
export default function FluxoCriarConta({ onClose, onContaCriada }) {

    // Qual card está na tela: "dados" | "numero" | "email"
    const [etapa, setEtapa] = useState("dados")

    // O que preenchi no cadastro (fica só na memória)
    const [dadosCadastro, setDadosCadastro] = useState(null)

    // Telefone que já passou na verificação do SMS (pra não pedir de novo)
    const [telefoneVerificado, setTelefoneVerificado] = useState(null)

    // Se o envio do e-mail falhar, guardo a mensagem pra mostrar no card
    const [erroEnvioEmail, setErroEnvioEmail] = useState("")


    /* 
        Manda o código por e-mail e abre o card de verificação do e-mail.
        Se o envio falhar, abro o card mesmo assim com um aviso (dá pra reenviar lá). 
    */
    async function irParaEmail(dados) {
        try {
            await enviarCodigoEmail(dados.email)
            setErroEnvioEmail("")
        } catch (err) {
            setErroEnvioEmail(
                err.message || "Não foi possível enviar o e-mail. Toque em reenviar."
            )
        }

        setEtapa("email")
    }

    /* 
        Cadastro preenchido: manda o SMS e abre a verificação do número.
        Se o envio falhar, o erro volta pro CriarConta mostrar na tela. 
    */
    async function continuarVerificacao(dados) {
        setDadosCadastro(dados)

        // Telefone igual ao que já foi verificado: pula o SMS e vai pro e-mail
        if (dados.telefone === telefoneVerificado) {
            await irParaEmail(dados)
            return
        }

        await enviarCodigo(dados.telefone)

        setEtapa("numero")
    }

    // Volta de qualquer verificação pro cadastro (os campos continuam preenchidos)
    function voltarCadastro() {
        setEtapa("dados")
    }

    /* 
        Confere o código do SMS.
        Certo = guarda que o telefone foi verificado e segue pro e-mail.
        Errado = dá erro e a tela de verificação mostra a mensagem. 
    */
    async function verificarCodigo(codigo) {
        await conferirCodigo(dadosCadastro.telefone, codigo)

        setTelefoneVerificado(dadosCadastro.telefone)

        await irParaEmail(dadosCadastro)
    }

    // Pede um novo SMS
    async function reenviarCodigo() {
        await enviarCodigo(dadosCadastro.telefone)
    }

    /* 
        Confere o código do e-mail e, se estiver certo, cria a conta.
        Quem devolve o usuário é o backend (mock), sem a senha.
        Se algum passo falhar, o erro volta pro card do e-mail mostrar na tela. 
    */
    async function verificarEmail(codigo) {
        await conferirCodigoEmail(dadosCadastro.email, codigo)

        const { usuario } = await criarConta(dadosCadastro)

        /* 
            Terminou: avisa o App. Quando ele fechar o fluxo, tudo que estava
            guardado aqui (dados, telefone verificado, erro) some sozinho. 
        */
        onContaCriada(usuario)
    }

    // Pede um novo código por e-mail
    async function reenviarEmail() {
        await enviarCodigoEmail(dadosCadastro.email)
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
    )
}