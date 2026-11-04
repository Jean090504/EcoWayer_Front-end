
import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';

export default function Login({ onClose, onAbrirCriarConta }) {

    const larguraGoogle = "250";

    const botaoGoogle = (
        <div className="flex w-full justify-center overflow-visible">
            <div className="w-[250px] shrink-0">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                        console.error('Falha no login com Google');
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
    );

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [lembrar, setLembrar] = useState(true);

    // Estilo padrão dos campos de entrada
    const inputClass =
        "h-[35px] w-full border-0 border-b border-[#55B75D] bg-[#F8F8F8] pl-[29px] pr-[10px] text-[12px] text-[#444] outline-none transition focus:bg-[#F3F3F3] focus:border-[#7548C8]";

    return (

        // Camada de desfoque do fundo
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[5px]">

            {/* Card principal do login */}
            <div className="relative min-h-[506px] w-full max-w-[650px] rounded-[15px] bg-white px-3 pb-[35px] pt-[55px] shadow-xl sm:px-[98px]">

                {/* Botão para fechar o card */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Fechar login"
                    className="absolute right-[17px] top-[13px] text-[17px] font-light leading-none text-[#FF4545] transition hover:text-red-700"
                >
                    ×
                </button>

                {/* Conteúdo do formulário */}
                <div className="w-full">

                    {/* Título */}
                    <h2 className="mb-[10px] text-left text-[21px] font-bold leading-[25px] text-[#7548C8] underline decoration-[#7548C8] underline-offset-2">
                        Login
                    </h2>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >

                        {/* Campo de e-mail */}
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
                                placeholder="E-mail"
                                className={inputClass}
                                required
                            />
                        </div>

                        {/* Campo de senha */}
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
                                placeholder="Senha"
                                className={inputClass}
                                required
                            />

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

                        {/* Botão entrar */}
                        <div className="mt-[49px]">

                            <button
                                type="submit"
                                className="flex h-[33px] w-full items-center justify-center rounded-full bg-[#7548C8] text-[13px] font-bold text-white transition hover:bg-[#6539B8] active:scale-[0.99]"
                            >
                                Entrar
                            </button>

                        </div>

                        {/* Divisor com a palavra OU */}
                        <div className="my-[30px] flex items-center gap-1">

                            <div className="h-px flex-1 bg-[#7548C8]" />

                            <span className="text-[12px] font-semibold text-[#7548C8]">
                                ou
                            </span>

                            <div className="h-px flex-1 bg-[#7548C8]" />

                        </div>

                        {/* Entrar com Google */}
                        {botaoGoogle}

                        {/* Link para criar conta */}
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

// Autenticação com Google
const handleGoogleSuccess = async (credentialResponse) => {
    try {
        const resposta = await fetch('http://localhost:3000/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                credential: credentialResponse.credential,
            }),
        });

        if (!resposta.ok) {
            throw new Error('Não foi possível autenticar com o Google.');
        }

        const usuario = await resposta.json();

        console.log('Login realizado:', usuario);

    } catch (error) {
        console.error('Erro na autenticação:', error);
    }
};
