
import { useState } from "react";

export default function CreateAccount({ onClose }) {
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

    const inputClass =
        "w-full h-[40px] rounded-[11px] border border-[#E2E6EB] bg-white px-[12px] text-[12px] text-[#444] placeholder:text-[#929292] outline-none transition focus:border-[#7950CC] focus:ring-1 focus:ring-[#7950CC]/20";

    const labelClass =
        "mb-[4px] block text-[11px] font-medium leading-[14px] text-[#454545]";

    function Campo({ label, placeholder, type = "text" }) {
        return (
            <div>
                <label className={labelClass}>{label}</label>
                <input
                    type={type}
                    placeholder={placeholder}
                    className={inputClass}
                    required
                />
            </div>
        );
    }

    function CampoSenha({ label, placeholder, mostrar, alternar }) {
        return (
            <div>
                <label className={labelClass}>{label}</label>

                <div className="relative">
                    <input
                        type={mostrar ? "text" : "password"}
                        placeholder={placeholder}
                        className={`${inputClass} pr-10`}
                        required
                    />

                    <button
                        type="button"
                        onClick={alternar}
                        aria-label={mostrar ? "Ocultar senha" : "Mostrar senha"}
                        className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#888] hover:text-[#555]"
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
                            {mostrar && <path d="M4 4l16 16" />}
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-2 backdrop-blur-[3px] sm:p-4">
            <div className="relative max-h-[calc(100dvh-16px)] w-full max-w-[640px] overflow-y-auto rounded-[15px] bg-white px-6 pb-[30px] pt-[25px] shadow-xl sm:max-h-[calc(100dvh-32px)] sm:px-[94px] sm:pt-[25px]">

                {/* Fechar card */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Fechar"
                    className="absolute right-[13px] top-[11px] text-[16px] font-light leading-none text-[#FF4545] hover:text-red-700"
                >
                    ×
                </button>

                {/* Título */}
                <h2 className="mb-[17px] text-center text-[28px] font-bold leading-[34px] tracking-[-0.5px]">
                    <span className="text-[#61B86B]">Criar</span>{" "}
                    <span className="text-[#7548CB]">conta</span>
                </h2>

                <form
                    className="space-y-[14px]"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <Campo
                        label="Nome completo"
                        placeholder="Seu nome aqui"
                    />

                    <div className="grid grid-cols-2 gap-[15px]">
                        <Campo
                            label="Data de nascimento"
                            placeholder="DD/MM/AAAA"
                        />

                        <Campo
                            label="CPF"
                            placeholder="000.000.000-00"
                        />
                    </div>

                    <Campo
                        label="E-mail"
                        placeholder="seuemail@exemplo.com"
                        type="email"
                    />

                    <Campo
                        label="Telefone"
                        placeholder="(00) 00000-0000"
                        type="tel"
                    />

                    <CampoSenha
                        label="Senha"
                        placeholder="Crie uma senha"
                        mostrar={mostrarSenha}
                        alternar={() => setMostrarSenha(!mostrarSenha)}
                    />

                    <CampoSenha
                        label="Confirmar senha"
                        placeholder="Repita a senha"
                        mostrar={mostrarConfirmacao}
                        alternar={() =>
                            setMostrarConfirmacao(!mostrarConfirmacao)
                        }
                    />

                    {/* Termos */}
                    <label className="flex cursor-pointer items-center gap-[9px] pt-[18px] text-[11px] leading-[16px] text-[#666]">
                        <input
                            type="checkbox"
                            required
                            className="h-[16px] w-[16px] shrink-0 cursor-pointer accent-[#55B75D]"
                        />

                        <span>
                            Aceito os{" "}
                            <a
                                href="#termos"
                                className="font-medium text-[#399B43] underline underline-offset-2"
                            >
                                Termos de Serviço
                            </a>{" "}
                            e{" "}
                            <a
                                href="#privacidade"
                                className="font-medium text-[#399B43] underline underline-offset-2"
                            >
                                Privacidade
                            </a>
                        </span>
                    </label>

                    {/* Botão de cadastro */}
                    <div className="pt-[23px]">
                        <button
                            type="submit"
                            className="mx-auto flex h-[33px] w-full items-center justify-center rounded-[12px] bg-[#7548C8] text-[16px] font-bold text-white transition hover:bg-[#6539B8] active:scale-[0.99] sm:w-[calc(100%-72px)]"
                        >
                            Criar conta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
