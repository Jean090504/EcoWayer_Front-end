import { Fragment, useEffect, useRef, useState } from "react";
import iconeEmail from "../assets/icons/icones/emailVerificado.png";
import folha from "../assets/icons/icones/folha.png";

// Quantos dígitos tem o código
const TAMANHO_CODIGO = 6;

// Quantos segundos espero até liberar o "reenviar código"
const TEMPO_REENVIO = 60;

// Lista de 6 campos vazios (usei em vários lugares)
const camposVazios = () => Array(TAMANHO_CODIGO).fill("");

// TELA DE VERIFICAÇÃO DE E-MAIL
// Só aparece depois que o número de telefone já foi verificado (no criar conta)

// O que recebe do App:
// - email: pra mostrar em qual e-mail o código foi enviado
// - erroInicial: se o envio do e-mail falhou, mostra um aviso logo de cara
// - onVoltar: botão "Voltar" lá em cima
// - onAlterarEmail: link "Alterar e-mail" lá embaixo
// - onVerificar: confere o código (se estiver errado, joga um erro)
// - onReenviar: manda um novo código pro email
export default function VerificacaoEmail({
    email,
    erroInicial = "",
    onVoltar,
    onAlterarEmail,
    onVerificar,
    onReenviar
}) {
    // O que ja foi digitado em cada quadrado
    const [digitos, setDigitos] = useState(camposVazios);

    // Mensagens que aparecem abaixo dos quadradinhos
    const [erro, setErro] = useState(erroInicial);
    const [aviso, setAviso] = useState("");

    // Controles de "carregando"
    const [verificando, setVerificando] = useState(false);
    const [reenviando, setReenviando] = useState(false);

    // Contagem regressiva do reenvio.
    // Se o e-mail nem foi enviado (erroInicial) já libera o reenvio.
    const [segundos, setSegundos] = useState(erroInicial ? 0 : TEMPO_REENVIO);

    // Guarda os 6 inputs pra eu conseguir pular de um pro outro
    const campos = useRef([]);

    // Quando abre a tela já foca no primeiro quadrado
    useEffect(() => {
        campos.current[0]?.focus();
    }, []);

    // Faz a contagem de 1 em 1 segundo até chegar em 0
    useEffect(() => {
        if (segundos <= 0) return;

        const timer = setTimeout(() => setSegundos((s) => s - 1), 1000);

        return () => clearTimeout(timer);
    }, [segundos]);

    // Preenche os quadradinhos a partir de uma posição
    // Serve tanto pra digitar quanto pra colar o código inteiro.
    function preencher(inicio, texto) {
        const numeros = texto
            .replace(/\D/g, "")
            .slice(0, TAMANHO_CODIGO - inicio);

        if (!numeros) return;

        setDigitos((atual) => {
            const novo = [...atual];

            [...numeros].forEach((numero, k) => {
                novo[inicio + k] = numero;
            });

            return novo;
        });

        // Vai pro próximo quadradinho (ou fica no último)
        campos.current[
            Math.min(inicio + numeros.length, TAMANHO_CODIGO - 1)
        ]?.focus();

        setErro("");
    }

    // Sempre que digitar ou apagar algo dos quadrados
    function aoDigitar(indice, evento) {
        const valor = evento.target.value;

        // se apagar algo -> só limpa aquele quadrado
        if (valor === "") {
            setDigitos((atual) => {
                const novo = [...atual];
                novo[indice] = "";
                return novo;
            });
            return;
        }

        preencher(indice, valor);
    }

    // Teclas especiais: Backspace volta um quadradinho, setas andam de lado
    function aoPressionarTecla(indice, evento) {
        if (evento.key === "Backspace" && !digitos[indice] && indice > 0) {
            evento.preventDefault();

            setDigitos((atual) => {
                const novo = [...atual];
                novo[indice - 1] = "";
                return novo;
            });

            campos.current[indice - 1]?.focus();
        }

        if (evento.key === "ArrowLeft" && indice > 0) {
            campos.current[indice - 1]?.focus();
        }

        if (evento.key === "ArrowRight" && indice < TAMANHO_CODIGO - 1) {
            campos.current[indice + 1]?.focus();
        }
    }

    // Colar o código: se vier os 6 números, preenche tudo desde o começo
    function aoColar(indice, evento) {
        evento.preventDefault();

        const numeros = evento.clipboardData
            .getData("text")
            .replace(/\D/g, "");

        preencher(numeros.length >= TAMANHO_CODIGO ? 0 : indice, numeros);
    }

    // Botão "Confirmar e-mail"
    async function confirmar(evento) {
        evento.preventDefault();

        const codigo = digitos.join("");

        // Falta número
        if (codigo.length < TAMANHO_CODIGO) {
            setErro(`Digite os ${TAMANHO_CODIGO} números do código.`);
            return;
        }

        setVerificando(true);
        setErro("");
        setAviso("");

        try {
            // Se o código estiver certo, o App fecha esta tela e entra no login
            await onVerificar(codigo);
        } catch (err) {
            // Se o código estiver errado: mostra o erro e limpa pra tentar de novo
            setErro(err.message || "Código inválido. Tente novamente.");
            setDigitos(camposVazios());
            campos.current[0]?.focus();
        } finally {
            setVerificando(false);
        }
    }

    // Link "Reenviar código de confirmação"
    async function reenviar() {
        if (segundos > 0 || reenviando) return;

        setReenviando(true);
        setErro("");
        setAviso("");

        try {
            await onReenviar();

            setDigitos(camposVazios());
            setSegundos(TEMPO_REENVIO);
            setAviso("Enviamos um novo código para o seu e-mail.");
            campos.current[0]?.focus();
        } catch (err) {
            setErro(err.message || "Não foi possível reenviar o código.");
        } finally {
            setReenviando(false);
        }
    }

    return (
        // Fundo desfocado (igual aos outros cards)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-2 backdrop-blur-[3px] sm:p-4">

            {/* Card */}
            <div className="relative max-h-[calc(100dvh-16px)] w-full max-w-[500px] overflow-y-auto rounded-[20px] bg-white px-6 pb-[36px] pt-[30px] shadow-xl sm:max-h-[calc(100dvh-32px)] sm:px-[44px]">

                {/* Botão voltar (seta + texto) */}
                <button
                    type="button"
                    onClick={onVoltar}
                    disabled={verificando}
                    className="flex items-center gap-[8px] text-[13px] font-semibold text-[#4B5563] transition hover:text-[#1F2937] disabled:opacity-60"
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
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Voltar
                </button>

                {/* Ícone: quadrado roxo com o e-mail e a bolinha verde da folha */}
                <div className="relative mx-auto mt-[34px] h-[64px] w-[64px]">

                    <div className="flex h-full w-full items-center justify-center rounded-[18px] bg-[#724BC2]">
                        <img
                            src={iconeEmail}
                            alt=""
                            className="h-[34px] w-[34px] object-contain"
                        />
                    </div>

                    {/* Bolinha verde no canto com a folha */}
                    <div className="absolute -bottom-[4px] -right-[8px] flex h-[26px] w-[26px] items-center justify-center rounded-full border-2 border-white bg-[#4CAF50]">
                        <img
                            src={folha}
                            alt=""
                            className="h-[12px] w-[12px] object-contain"
                        />
                    </div>

                </div>

                {/* Título */}
                <h2 className="mt-[22px] text-center text-[24px] font-bold leading-[30px] tracking-[-0.4px] text-[#1B1B1F]">
                    Verificação de e-mail
                </h2>

                {/* Explicação com o e-mail em destaque */}
                <p className="mt-[10px] text-center text-[13px] leading-[20px] text-[#374151]">
                    Enviamos um link e código de {TAMANHO_CODIGO} dígitos para
                    <br />
                    o e-mail{" "}
                    <span className="break-all rounded-md bg-[#F1EDFA] px-[8px] py-[2px] font-semibold text-[#6F42C1]">
                        {email}
                    </span>
                    .
                    <br />
                    Digite o código recebido:
                </p>

                <form onSubmit={confirmar}>

                    {/* Quadrados do código: 3 + traço + 3 */}
                    <div className="mt-[26px] flex items-center justify-center gap-[8px] sm:gap-[12px]">
                        {digitos.map((digito, indice) => (
                            <Fragment key={indice}>

                                {/* Traço no meio, entre o 3º e o 4º */}
                                {indice === 3 && (
                                    <span
                                        aria-hidden="true"
                                        className="text-[14px] text-[#BDBDBD]"
                                    >
                                        -
                                    </span>
                                )}

                                <input
                                    ref={(el) => (campos.current[indice] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete={indice === 0 ? "one-time-code" : "off"}
                                    aria-label={`Dígito ${indice + 1} de ${TAMANHO_CODIGO}`}
                                    value={digito}
                                    onChange={(e) => aoDigitar(indice, e)}
                                    onKeyDown={(e) => aoPressionarTecla(indice, e)}
                                    onPaste={(e) => aoColar(indice, e)}
                                    onFocus={(e) => e.target.select()}
                                    disabled={verificando}
                                    className="h-[56px] w-[40px] rounded-[12px] bg-[#F3F4F6] text-center text-[20px] font-semibold text-[#1F2937] outline-none transition focus:bg-white focus:shadow-[0_4px_14px_rgba(0,0,0,0.14)] disabled:opacity-60 sm:w-[48px]"
                                />

                            </Fragment>
                        ))}
                    </div>

                    {/* Erro (código errado, faltou número, falha no envio...) */}
                    {erro && (
                        <p
                            role="alert"
                            className="mt-[14px] text-center text-xs text-red-500"
                        >
                            {erro}
                        </p>
                    )}

                    {/* Aviso de sucesso (ex.: novo código enviado) */}
                    {aviso && (
                        <p
                            role="status"
                            className="mt-[14px] text-center text-xs text-[#399B43]"
                        >
                            {aviso}
                        </p>
                    )}

                    {/* Caixinha cinza lembrando de olhar o spam */}
                    <div className="mt-[22px] flex items-center gap-[12px] rounded-[12px] bg-[#F3F4F6] px-[16px] py-[12px] text-[12px] leading-[16px] text-[#374151]">
                        <svg
                            className="shrink-0"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 11v5M12 8h.01" />
                        </svg>

                        <span>
                            Verifique também sua caixa de spam ou lixo
                            eletrônico caso demore a chegar.
                        </span>
                    </div>

                    {/* Botão confirmar */}
                    <button
                        type="submit"
                        disabled={verificando}
                        className="mt-[20px] flex h-[48px] w-full items-center justify-center gap-[8px] rounded-[12px] bg-[#4CAF50] text-[14px] font-semibold text-white transition hover:bg-[#43A047] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
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
                            <circle cx="12" cy="12" r="9" />
                            <path d="m8 12 3 3 5-6" />
                        </svg>

                        {verificando ? "Confirmando..." : "Confirmar e-mail"}
                    </button>

                </form>

                {/* "Não recebeu o código?" + reenviar */}
                <div className="mt-[30px] flex items-center justify-center gap-[14px] text-[12px] text-[#4B5563]">

                    {/* Ícone de relógio */}
                    <svg
                        className="shrink-0"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                    </svg>

                    <span className="max-w-[100px] leading-[16px]">
                        Não recebeu o código?
                    </span>

                    {/* Enquanto a contagem não zera, o link fica bloqueado */}
                    {segundos > 0 ? (
                        <span className="max-w-[130px] text-[11px] font-semibold leading-[14px] text-[#9CA3AF]">
                            Reenviar em {segundos}s
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={reenviar}
                            disabled={reenviando}
                            className="max-w-[130px] text-left text-[11px] font-semibold leading-[14px] text-[#6F42C1] transition hover:underline disabled:opacity-60"
                        >
                            {reenviando
                                ? "Enviando..."
                                : "Reenviar código de confirmação"}
                        </button>
                    )}

                </div>

                {/* Linha separando */}
                <div className="mx-auto mt-[16px] h-px w-[80px] bg-[#E5E7EB]" />

                {/* Errei o e-mail: volta pro cadastro pra corrigir */}
                <p className="mt-[18px] flex items-center justify-center gap-[6px] text-[12px] text-[#4B5563]">
                    Digitou o e-mail errado?

                    <button
                        type="button"
                        onClick={onAlterarEmail}
                        disabled={verificando}
                        className="flex items-center gap-[4px] text-[11px] font-semibold text-[#6F42C1] transition hover:underline disabled:opacity-60"
                    >
                        Alterar e-mail

                        {/* Lápis */}
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                    </button>
                </p>

            </div>
        </div>
    );
}