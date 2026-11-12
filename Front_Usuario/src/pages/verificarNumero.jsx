import { useEffect, useRef, useState } from "react";

const TAMANHO_CODIGO = 6;
const TEMPO_REENVIO = 60; // segundos até liberar o reenvio

// Exibe só o final do número: (11) *****-9999
function mascararTelefone(telefone = "") {
    const numeros = telefone.replace(/\D/g, "");

    if (numeros.length < 10) return telefone;

    return `(${numeros.slice(0, 2)}) •••••-${numeros.slice(-4)}`;
}

const camposVazios = () => Array(TAMANHO_CODIGO).fill("");

export default function VerificacaoNumero({
    telefone,
    tipo = "telefone",
    codigoDesenvolvimento,
    onVoltar,
    onVerificar,
    onReenviar
}) {
    const [digitos, setDigitos] = useState(camposVazios);
    const [erro, setErro] = useState("");
    const [aviso, setAviso] = useState("");
    const [verificando, setVerificando] = useState(false);
    const [reenviando, setReenviando] = useState(false);
    const [segundos, setSegundos] = useState(TEMPO_REENVIO);

    const campos = useRef([]);

    // Foca o primeiro campo ao abrir
    useEffect(() => {
        campos.current[0]?.focus();
    }, []);

    // Contagem regressiva do reenvio
    useEffect(() => {
        if (segundos <= 0) return;

        const timer = setTimeout(() => setSegundos((s) => s - 1), 1000);

        return () => clearTimeout(timer);
    }, [segundos]);

    // Preenche os campos a partir de uma posição (digitação ou colagem)
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

        campos.current[
            Math.min(inicio + numeros.length, TAMANHO_CODIGO - 1)
        ]?.focus();

        setErro("");
    }

    function aoDigitar(indice, evento) {
        const valor = evento.target.value;

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

    function aoColar(indice, evento) {
        evento.preventDefault();

        const numeros = evento.clipboardData
            .getData("text")
            .replace(/\D/g, "");

        // Permite que um codigo completo seja colado (preenche todos os quadrados)
        preencher(numeros.length >= TAMANHO_CODIGO ? 0 : indice, numeros);
    }

    async function enviarFormulario(evento) {
        evento.preventDefault();

        const codigo = digitos.join("");

        if (codigo.length < TAMANHO_CODIGO) {
            setErro(`Digite os ${TAMANHO_CODIGO} números do código.`);
            return;
        }

        setVerificando(true);
        setErro("");
        setAviso("");

        try {
            await onVerificar(codigo);
            // Se estiver tudo certo o componente 'pai' fecha essa tela
        } catch (err) {
            setErro(err.message || "Código inválido. Tente novamente.");
            setDigitos(camposVazios());
            campos.current[0]?.focus();
        } finally {
            setVerificando(false);
        }
    }

    async function reenviar() {
        if (segundos > 0 || reenviando) return;

        setReenviando(true);
        setErro("");
        setAviso("");

        try {
            await onReenviar();

            setDigitos(camposVazios());
            setSegundos(TEMPO_REENVIO);
            setAviso("Enviamos um novo código por SMS.");
            campos.current[0]?.focus();
        } catch (err) {
            setErro(err.message || "Não foi possível reenviar o código.");
        } finally {
            setReenviando(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-2 backdrop-blur-[3px] sm:p-4">

            <div className="relative w-full max-w-[480px] rounded-[15px] bg-white px-6 pb-[30px] pt-[30px] shadow-xl sm:px-[56px]">

                {/* Título */}
                <h2 className="mb-[10px] text-center text-[26px] font-bold leading-[32px] tracking-[-0.5px]">
                    <span className="text-[#61B86B]">Verificar</span>{" "}
                    <span className="text-[#7548CB]">número</span>
                </h2>

                <p className="mb-[22px] text-center text-[13px] leading-[19px] text-[#666]">
                    Enviamos um código de {TAMANHO_CODIGO} dígitos por {tipo === "telefone" ? "SMS" : "e-mail"} para{" "}
                    <strong className="font-semibold text-[#444]">
                        {mascararTelefone(telefone)}
                    </strong>
                    .
                </p>

                {codigoDesenvolvimento && (
                    <p className="mb-[18px] rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-800">
                        Código de demonstração: <strong className="text-sm tracking-[0.18em]">{codigoDesenvolvimento}</strong>
                    </p>
                )}

                <form onSubmit={enviarFormulario}>

                    {/* Campos do código */}
                    <div className="flex justify-center gap-[8px]">
                        {digitos.map((digito, indice) => (
                            <input
                                key={indice}
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
                                className="h-[48px] w-[42px] rounded-[11px] border border-[#E2E6EB] bg-white text-center text-[20px] font-semibold text-[#444] outline-none transition focus:border-[#7950CC] focus:ring-1 focus:ring-[#7950CC]/20 disabled:opacity-60 sm:w-[46px]"
                            />
                        ))}
                    </div>

                    {/* Erro */}
                    {erro && (
                        <p
                            role="alert"
                            className="mt-[14px] text-center text-xs text-red-500"
                        >
                            {erro}
                        </p>
                    )}

                    {/* Aviso */}
                    {aviso && (
                        <p
                            role="status"
                            className="mt-[14px] text-center text-xs text-[#399B43]"
                        >
                            {aviso}
                        </p>
                    )}

                    {/* Botão verificar */}
                    <div className="pt-[22px]">
                        <button
                            type="submit"
                            disabled={verificando}
                            className="flex h-[38px] w-full items-center justify-center rounded-[12px] bg-[#7548C8] text-[15px] font-bold text-white transition hover:bg-[#6539B8] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {verificando ? "Verificando..." : "Verificar"}
                        </button>
                    </div>

                </form>

                {/* Reenviar */}
                <div className="mt-[16px] text-center text-[12px] text-[#666]">
                    {segundos > 0 ? (
                        <span>Reenviar código em {segundos}s</span>
                    ) : (
                        <button
                            type="button"
                            onClick={reenviar}
                            disabled={reenviando}
                            className="font-medium text-[#399B43] underline underline-offset-2 disabled:opacity-60"
                        >
                            {reenviando ? "Enviando..." : "Reenviar código"}
                        </button>
                    )}
                </div>

                {/* Voltar */}
                <div className="mt-[10px] text-center">
                    <button
                        type="button"
                        onClick={onVoltar}
                        disabled={verificando}
                        className="text-[12px] font-medium text-[#7548C8] transition hover:underline disabled:opacity-60"
                    >
                        Voltar
                    </button>
                </div>

            </div>
        </div>
    );
}
