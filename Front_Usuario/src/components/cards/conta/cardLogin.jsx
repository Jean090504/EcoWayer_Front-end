
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

// Estilo padrão dos campos de entrada
const inputClass = "h-[48px] w-full border-0 border-b border-[#55B75D] bg-[#F8F8F8] pl-[48px] pr-[10px] text-[14px] text-[#444] outline-none transition focus:bg-[#F3F3F3] focus:border-[#7548C8]";

const USAR_MOCK = import.meta.env.VITE_USAR_MOCK === "true";

// Lê os dados da credencial do Google
function lerCredencialGoogle(credential) {
    const parteDados = credential.split(".")[1];
    const base64 = parteDados.replace(/-/g, "+").replace(/_/g, "/");

    const texto = decodeURIComponent(
        atob(base64)
            .split("")
            .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
            .join("")
    );

    return JSON.parse(texto);
}

// Impede o preenchimento automático do navegador
function liberarCampo(evento) {
    evento.target.removeAttribute("readonly");
}

export default function Login({ onClose, onAbrirCriarConta, onLoginSuccess }) {

    const larguraGoogle = "250";

    // Dados digitados
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    // Controles da tela
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [lembrar, setLembrar] = useState(true);
    const [erro, setErro] = useState("");

    // Login com Google
    async function handleGoogleSuccess(credentialResponse) {
        setErro("");

        try {
            let usuario;

            if (USAR_MOCK) {
                const dados = lerCredencialGoogle(credentialResponse.credential);

                usuario = {
                    nome: dados.name,
                    email: dados.email,
                    foto: dados.picture ?? null
                };
            } else {
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

            if (typeof onLoginSuccess === "function") {
                onLoginSuccess(usuario);
            }

        } catch (error) {
            console.error("Erro na autenticação:", error);
            setErro("Não foi possível entrar com o Google.");
        }
    }

    // Login por e-mail e senha
    function handleSubmit(event) {
        event.preventDefault();
        setErro("");

        console.log("Tentativa de login:", { email, lembrar });
    }

    return (

        // Fundo desfocado
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[5px]">

            {/* Card do login */}
            <div className="relative min-h-[520px] w-full max-w-[700px] rounded-[15px] bg-white px-3 pb-[35px] pt-[55px] shadow-xl sm:px-[98px]">

                {/* Botão de fechar */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Fechar login"
                    className="absolute right-[20px] top-[13px] text-[27px] font-light leading-none text-[#FF4545] transition hover:text-red-700"
                >
                    ×
                </button>

                <div className="w-full">

                    {/* Título */}
                    <h2 className="mb-[15px] text-left text-[25px] font-bold leading-[30px] text-[#7548C8] underline decoration-[#7548C8] underline-offset-2">
                        Login
                    </h2>

                    <form onSubmit={handleSubmit} autoComplete="off">

                        {/* E-mail */}
                        <div className="relative mb-[20px]">

                            {/* Ícone de envelope */}
                            <svg
                                className="absolute left-[12px] top-1/2 -translate-y-1/2 pointer-events-none"
                                width="25"
                                height="25"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                <path d="m3 7 9 7 9-7" />
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
                                className="absolute left-[12px] top-1/2 -translate-y-1/2 pointer-events-none"
                                width="25"
                                height="25"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <rect x="4" y="10" width="16" height="11" rx="2" />
                                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                <path d="M12 14v3" />
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
                                className={`${inputClass} pr-[45px]`}
                                required
                            />

                            {/* Olhinho: mostra ou esconde a senha */}
                            <button
                                type="button"
                                onClick={() => setMostrarSenha((atual) => !atual)}
                                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                                className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#888] hover:text-[#555]"
                            >
                                <svg
                                    width="18"
                                    height="18"
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
                        <div className="mt-[20px] flex items-center justify-between">

                            <label className="flex cursor-pointer items-center gap-[3px] text-[15px] font-semibold text-[#7548C8]">

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
                                className="text-[15px] font-semibold text-[#7548C8] transition hover:underline"
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
                        <div className="mt-[40px]">

                            <button
                                type="submit"
                                className="flex h-[33px] w-full items-center justify-center rounded-full bg-[#7548C8] text-[13px] font-bold text-white transition hover:bg-[#6539B8] active:scale-[0.99]"
                            >
                                Entrar
                            </button>

                        </div>

                        {/* Divisor */}
                        <div className="my-[10px] flex items-center gap-1">

                            <div className="h-px flex-1 bg-[#7548C8]" />

                            <span className="text-[12px] font-semibold text-[#7548C8]">
                                ou
                            </span>

                            <div className="h-px flex-1 bg-[#7548C8]" />

                        </div>


                        {/* Entrar com Google */}
                        <div className="flex w-full justify-center overflow-visible pt-10">
                            <div className="flex w-full justify-center">
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


                        {/* Link para criar conta */}
                        <div className="mt-[30px] flex items-center justify-center gap-2 text-[12px]">

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
