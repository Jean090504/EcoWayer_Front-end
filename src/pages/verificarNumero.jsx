
import { useState, useEffect, useRef } from "react";

export default function VerificacaoNumero({
    telefone = "(11) 98765-4321",
    onVoltar,
    onVerificar,
    onReenviar
}) {
    const [codigo, setCodigo] = useState(["", "", "", "", "", ""]);
    const [tempoExpiracao, setTempoExpiracao] = useState(300);
    const [tempoReenvio, setTempoReenvio] = useState(45);

    const inputsRef = useRef([]);

    // Contagem regressiva
    useEffect(() => {
        const intervalo = setInterval(() => {
            setTempoExpiracao((tempo) => Math.max(0, tempo - 1));
            setTempoReenvio((tempo) => Math.max(0, tempo - 1));
        }, 1000);

        return () => clearInterval(intervalo);
    }, []);

    // Formata segundos em minutos
    function formatarTempo(segundos) {
        const minutos = Math.floor(segundos / 60);
        const restante = segundos % 60;

        return `${String(minutos).padStart(2, "0")}:${String(restante).padStart(2, "0")}`;
    }

    // Digitação do código
    function handleChange(valor, indice) {
        const numero = valor.replace(/\D/g, "").slice(-1);

        const novoCodigo = [...codigo];
        novoCodigo[indice] = numero;

        setCodigo(novoCodigo);

        if (numero && indice < 5) {
            inputsRef.current[indice + 1]?.focus();
        }
    }

    // Voltar ao campo anterior com Backspace
    function handleKeyDown(event, indice) {
        if (event.key === "Backspace" && !codigo[indice] && indice > 0) {
            inputsRef.current[indice - 1]?.focus();
        }
    }

    // Colar código completo
    function handlePaste(event) {
        event.preventDefault();

        const numeros = event.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        const novoCodigo = Array(6).fill("");

        numeros.split("").forEach((numero, indice) => {
            novoCodigo[indice] = numero;
        });

        setCodigo(novoCodigo);

        inputsRef.current[Math.min(numeros.length, 5)]?.focus();
    }

    // Verificar código
    function verificarCodigo() {
        const codigoCompleto = codigo.join("");

        if (codigoCompleto.length !== 6) {
            alert("Informe os 6 dígitos do código.");
            return;
        }

        if (tempoExpiracao === 0) {
            alert("O código expirou. Solicite um novo código.");
            return;
        }

        onVerificar?.(codigoCompleto);
    }

    // Reenviar SMS
    function reenviarCodigo() {
        if (tempoReenvio > 0 || tempoExpiracao === 0) return;

        onReenviar?.();

        setCodigo(["", "", "", "", "", ""]);
        setTempoExpiracao(300);
        setTempoReenvio(45);

        inputsRef.current[0]?.focus();
    }

    return (
        <div className="min-h-screen w-full bg-white flex items-center justify-center px-4 py-8">

            {/* Card de verificação */}
            <div className="w-full max-w-[448px] min-h-[590px] bg-white border border-gray-200 rounded-xl shadow-lg px-6 sm:px-8 py-8">

                {/* Voltar para login */}
                <button
                    type="button"
                    onClick={onVoltar}
                    className="flex items-center gap-2 text-sm font-semibold text-[#455445] hover:text-[#58A24D] transition"
                >
                    <span className="text-xl">←</span>
                    Voltar para o login
                </button>

                {/* Ícone de segurança */}
                <div className="flex justify-center mt-8">
                    <div className="w-16 h-16 rounded-2xl bg-[#4CAF50] flex items-center justify-center">

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            className="w-8 h-8"
                        >
                            <path d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2ZM10 6a2 2 0 1 1 4 0v2h-4V6Zm2 11a2 2 0 1 1 1-3.732V16a1 1 0 0 1-1 1Z" />
                        </svg>

                    </div>
                </div>

                {/* Título e descrição */}
                <div className="text-center mt-6">

                    <h1 className="text-2xl font-bold text-[#202124]">
                        Verificação de número
                    </h1>

                    <p className="text-sm text-[#455445] mt-3 leading-relaxed">
                        Enviamos um código SMS de 6 dígitos para o número
                        <strong className="text-[#202124]"> {telefone}.</strong>
                        {" "}Insira-o abaixo para validar sua conta.
                    </p>

                </div>

                {/* Campos do código */}
                <div className="flex justify-center gap-2 mt-8">

                    {codigo.map((numero, indice) => (
                        <input
                            key={indice}
                            ref={(elemento) => {
                                inputsRef.current[indice] = elemento;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={numero}
                            onChange={(event) =>
                                handleChange(event.target.value, indice)
                            }
                            onKeyDown={(event) =>
                                handleKeyDown(event, indice)
                            }
                            onPaste={indice === 0 ? handlePaste : undefined}
                            className="w-10 h-14 sm:w-12 sm:h-14 rounded-xl bg-[#F1F3F5] text-center text-xl font-semibold text-[#202124] outline-none border-2 border-transparent focus:border-[#58A24D] transition"
                        />
                    ))}

                </div>

                {/* Tempo de expiração */}
                <div className="flex justify-center mt-4">

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F1F3F5] text-xs text-[#455445]">

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-4 h-4"
                        >
                            <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                            <path
                                d="M12 7v5l3 2"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>

                        <span>
                            O código expira em{" "}
                            <strong className="text-[#202124]">
                                {formatarTempo(tempoExpiracao)}
                            </strong>
                        </span>

                    </div>

                </div>

                {/* Botão verificar */}
                <button
                    type="button"
                    onClick={verificarCodigo}
                    disabled={codigo.join("").length !== 6 || tempoExpiracao === 0}
                    className="w-full h-11 mt-6 rounded-xl bg-[#4CAF50] hover:bg-[#429B46] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center justify-center gap-2 transition"
                >
                    Verificar número
                    <span className="text-lg">→</span>
                </button>

                {/* Reenviar código */}
                <div className="text-center mt-6 text-xs text-[#455445]">

                    Não recebeu o SMS?{" "}

                    <button
                        type="button"
                        onClick={reenviarCodigo}
                        disabled={tempoReenvio > 0 || tempoExpiracao === 0}
                        className="text-[#7546CF] font-medium hover:underline disabled:opacity-50 disabled:no-underline"
                    >
                        Reenviar código
                    </button>

                    {tempoReenvio > 0 && (
                        <span>
                            {" "}(disponível em {tempoReenvio}s)
                        </span>
                    )}

                </div>

            </div>
        </div>
    );
}
