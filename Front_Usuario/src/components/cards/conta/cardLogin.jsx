import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

// Estilo padrão dos campos de entrada
const inputClass ="h-[35px] w-full border-0 border-b border-[#55B75D] bg-[#F8F8F8] pl-[29px] pr-[10px] text-[12px] text-[#444] outline-none transition focus:bg-[#F3F3F3] focus:border-[#7548C8]";
const USAR_MOCK = import.meta.env.VITE_USAR_MOCK === "true";

// O Google devolve um "credential" (token JWT) com os dados da conta
// Aqui eu abro o token só pra ler nome, e-mail e foto
// ATENÇÃO: isso é só pra simular. No login de verdade, o backend
// é quem precisa validar o token (o token atual foi fabricado no front)
function lerCredencialGoogle(credential) {
    const parteDados = credential.split(".")[1];
    const base64 = parteDados.replace(/-/g, "+").replace(/_/g, "/");

    // Esse passo extra é pra não quebrar acentos (ex -> João)
    const texto = decodeURIComponent(
        atob(base64)
            .split("")
            .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
            .join("")
    );

    return JSON.parse(texto);
}

// Para impedir que o navegador preencha o email e senha sozinho automaticamente
// Deixo o campo "somente leitura" até eu clicar nele,
// assim não preenche tudo ao abrir o card
function liberarCampo(evento) {
    evento.target.removeAttribute("readonly");
}

export default function Login({ onClose, onAbrirCriarConta, onLoginSuccess }) {

    const larguraGoogle = "250";

    // O que estou digitando
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    // Controles da tela
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [lembrar, setLembrar] = useState(true);
    const [erro, setErro] = useState("");

    // Quando escolho uma conta Google cai direto nessa parte
    // Monta o usuário (nome, e-mail, foto) e avisa o App
    async function handleGoogleSuccess(credentialResponse) {
        setErro("");

        try {
            let usuario;

            if (USAR_MOCK) {
                // Simulação: pega o nome e foto direto do token do Google
                const dados = lerCredencialGoogle(credentialResponse.credential);

                usuario = {
                    nome: dados.name,
                    email: dados.email,
                    foto: dados.picture ?? null
                };
            } else {
                // Login de verdade: o backend valida o token e devolve o usuário
                const resposta = await fetch("http://localhost:3000/api/auth/google", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        credential: credentialResponse.credential
                    })
                });

                if (!resposta.ok) {
                    throw new Error("Não foi possível autenticar com o Google.");
                }

                const retorno = await resposta.json();
                const dados = retorno.usuario ?? retorno;

                usuario = {
                    nome: dados.nome ?? dados.name,
                    email: dados.email,
                    foto: dados.foto ?? dados.picture ?? null
                };
            }

            console.log("Login realizado:", usuario);

            // Avisa o App que o login deu certo (o header muda por causa disso)
            if (typeof onLoginSuccess === "function") {
                onLoginSuccess(usuario);
            }
        } catch (error) {
            console.error("Erro na autenticação:", error);
            setErro("Não foi possível entrar com o Google.");
        }
    }

    // Botão "Entrar" (e-mail e senha)
    function handleSubmit(event) {
        event.preventDefault();
        setErro("");

        // login por e-mail e senha pelo backend (ainda não existe)
        console.log("Tentativa de login:", { email, lembrar });
    }

    return (

        // Fundo desfocado
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[5px]">

            {/* Card do login */}
            <div className="relative min-h-[506px] w-full max-w-[650px] rounded-[15px] bg-white px-3 pb-[35px] pt-[55px] shadow-xl sm:px-[98px]">

                {/* Botão de fechar */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Fechar login"
                    className="absolute right-[17px] top-[13px] text-[17px] font-light leading-none text-[#FF4545] transition hover:text-red-700"
                >
                    ×
                </button>

                <div className="w-full">

                    {/* Título */}
                    <h2 className="mb-[10px] text-left text-[21px] font-bold leading-[25px] text-[#7548C8] underline decoration-[#7548C8] underline-offset-2">
                        Login
                    </h2>

                    <form onSubmit={handleSubmit} autoComplete="off">

                        {/* E-mail */}
                        <div className="relative mb-[20px]">

                            {/* Ícone de envelope */}
                            <svg
                                className="absolute left-[6px] top-1/2 -translate-y-1/2"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="m22 7-10 7L2 7" />
                            </svg>

                            <input
                                type="email"
                                name="login-email"
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="off"
                                readOnly
                                onFocus={liberarCampo}
                                className={inputClass}
                                required
                            />
                        </div>

                        {/* Senha */}
                        <div className="relative">

                            {/* Ícone de cadeado */}
                            <svg
                                className="absolute left-[6px] top-1/2 -translate-y-1/2"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <rect x="3" y="10" width="18" height="12" rx="2" />
                                <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                                <path d="M12 14v4" />
                            </svg>

                            <input
                                type={mostrarSenha ? "text" : "password"}
                                name="login-senha"
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                autoComplete="new-password"
                                readOnly
                                onFocus={liberarCampo}
                                className={`${inputClass} pr-[34px]`}
                                required
                            />

                            {/* Olhinho: mostra ou esconde a senha */}
                            <button
                                type="button"
                                onClick={() => setMostrarSenha((atual) => !atual)}
                                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                                className="absolute right-[8px] top-1/2 -translate-y-1/2 text-[#888] hover:text-[#555]"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                    {mostrarSenha && <path d="M4 4l16 16" />}
                                </svg>
                            </button>

                        </div>

                        {/* Lembrar-me e esqueci a senha */}
                        <div className="mt-[15px] flex items-center justify-between">

                            <label className="flex cursor-pointer items-center gap-[3px] text-[11px] font-semibold text-[#7548C8]">

                                <input
                                    type="checkbox"
                                    checked={lembrar}
                                    onChange={(e) => setLembrar(e.target.checked)}
                                    className="h-[9px] w-[9px] cursor-pointer accent-[#7548C8]"
                                />

                                lembre-me
                            </label>

                            <button
                                type="button"
                                className="text-[11px] font-semibold text-[#7548C8] transition hover:underline"
                            >
                                esqueci a senha
                            </button>

                        </div>

                        {/* Mensagem de erro */}
                        {erro && (
                            <p
                                role="alert"
                                className="mt-[10px] text-center text-xs text-red-500"
                            >
                                {erro}
                            </p>
                        )}

                        {/* Botão entrar */}
                        <div className="mt-[49px]">

                            <button
                                type="submit"
                                className="flex h-[33px] w-full items-center justify-center rounded-full bg-[#7548C8] text-[13px] font-bold text-white transition hover:bg-[#6539B8] active:scale-[0.99]"
                            >
                                Entrar
                            </button>

                        </div>

                        {/* Divisor com a palavra "ou" */}
                        <div className="my-[30px] flex items-center gap-1">

                            <div className="h-px flex-1 bg-[#7548C8]" />

                            <span className="text-[12px] font-semibold text-[#7548C8]">
                                ou
                            </span>

                            <div className="h-px flex-1 bg-[#7548C8]" />

                        </div>

                        {/* Entrar com Google */}
                        <div className="flex w-full justify-center overflow-visible">
                            <div className="w-[250px] shrink-0">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => {
                                        console.error("Falha no login com Google");
                                        setErro("Falha no login com Google.");
                                    }}
                                    text="signin"
                                    shape="pill"
                                    theme="outline"
                                    size="medium"
                                    locale="pt-BR"
                                    width={larguraGoogle}
                                />
                            </div>
                        </div>

                        {/* Link pra criar conta */}
                        <div className="mt-[36px] flex items-center justify-center gap-2 text-[12px]">

                            <span className="text-[#222]">
                                Ainda não tem uma conta?
                            </span>

                            <button
                                type="button"
                                onClick={onAbrirCriarConta}
                                className="border-b border-[#55B75D] pb-[2px] font-medium text-[#399B43] transition hover:text-green-700"
                            >
                                Criar conta
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}