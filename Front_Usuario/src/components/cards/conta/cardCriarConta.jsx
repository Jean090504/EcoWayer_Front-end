import { useState } from "react";


// ===================================================================
//                         FUNÇÕES AUXILIARES
// ===================================================================

// Tira o "somente leitura" ao clicar no campo
// Ele existe só pra o navegador não preencher tudo sozinho ao abrir o card
function liberarCampo(evento) {
    evento.target.removeAttribute("readonly");
}

// Telefone: (11) 99999-9999
function mascararTelefone(valor) {
    const n = valor.replace(/\D/g, "").slice(0, 11);

    if (n.length === 0) return "";
    if (n.length <= 2) return `(${n}`;
    if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`;

    // Fixo (10 dígitos): (11) 1234-5678
    if (n.length <= 10) {
        return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
    }

    // Celular (11 dígitos): (11) 91234-5678
    return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
}

// CPF: 000.000.000-00
function mascararCpf(valor) {
    const n = valor.replace(/\D/g, "").slice(0, 11);

    if (n.length <= 3) return n;
    if (n.length <= 6) return `${n.slice(0, 3)}.${n.slice(3)}`;
    if (n.length <= 9) {
        return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6)}`;
    }

    return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
}

// Data: 01/01/2000
function mascararData(valor) {
    const n = valor.replace(/\D/g, "").slice(0, 8);

    if (n.length <= 2) return n;
    if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`;

    return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
}


// ===================================================================
//                            CONSTANTES
// ===================================================================

// Classes repetidas nos campos
const inputClass = "w-full h-[40px] rounded-[11px] border border-[#E2E6EB] bg-white px-[12px] text-[12px] text-[#444] placeholder:text-[#929292] outline-none transition focus:border-[#7950CC] focus:ring-1 focus:ring-[#7950CC]/20";
const labelClass = "mb-[4px] block text-[11px] font-medium leading-[14px] text-[#454545]";
const MASCARAS = { // Máscara de cada campo (pelo "name" do input)
    nascimento: mascararData,
    cpf: mascararCpf,
    telefone: mascararTelefone
};



// ===================================================================
//                      CAMPOS REUTILIZÁVEIS
// Ficam fora do CreateAccount de propósito: se ficassem dentro, seriam
// recriados a cada letra digitada e os campos perderiam o foco.
// ===================================================================

// Campo comum
function Campo({
    label,
    name,
    placeholder,
    type = "text",
    value,
    inputMode,
    onChange
}) {
    return (
        <div>
            <label htmlFor={name} className={labelClass}>
                {label}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                inputMode={inputMode}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                autoComplete="off"
                readOnly
                onFocus={liberarCampo}
                className={inputClass}
                required
            />
        </div>
    );
}

// Campo de senha (com o olhinho)
function CampoSenha({
    label,
    name,
    placeholder,
    mostrar,
    alternar,
    value,
    onChange
}) {
    return (
        <div>
            <label htmlFor={name} className={labelClass}>
                {label}
            </label>

            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={mostrar ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    autoComplete="new-password"
                    readOnly
                    onFocus={liberarCampo}
                    className={`${inputClass} pr-10`}
                    required
                />

                {/* Olhinho: mostra ou esconde a senha */}
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


// ===================================================================
//                          TELA DE CRIAR CONTA
//====================================================================

// Props recebidas do fluxo:
//   onClose                 -> fecha o card
//   onContinuarVerificacao  -> recebe os dados, envia o SMS e abre a verificação
//   dadosIniciais           -> dados já preenchidos (quando volta da verificação)
// ===================================================================
export default function CreateAccount({
    onClose,
    onContinuarVerificacao,
    dadosIniciais
}) {

    // ---------------------------------------------------------------
    //                            Estados
    // ---------------------------------------------------------------
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
    const [erro, setErro] = useState("");                                       // Mensagem acima do botão
    const [enviando, setEnviando] = useState(false);                            // true enquanto envia o SMS (trava o botão)
    const [aceitouTermos, setAceitouTermos] = useState(Boolean(dadosIniciais)); // Ao voltar da verificação, os termos já foram aceitos
    const [formulario, setFormulario] = useState(                               // Ao voltar da verificação, começa com os dados de antes
        dadosIniciais ?? {
            nome: "",
            nascimento: "",
            cpf: "",
            email: "",
            telefone: "",
            senha: "",
            confirmarSenha: ""
        }
    );

    // ---------------------------------------------------------------
    //                            Funções
    // ---------------------------------------------------------------

    // Atualiza o campo digitado (aplicando a máscara, se ele tiver uma)
    function atualizarCampo(event) {
        const { name, value } = event.target;
        const formatar = MASCARAS[name];

        setFormulario((anterior) => ({
            ...anterior,
            [name]: formatar ? formatar(value) : value
        }));

        setErro("");
    }

    // Clique em "Criar conta"
    async function handleSubmit(event) {
        event.preventDefault();
        setErro("");

        // 1. As senhas precisam ser iguais
        if (formulario.senha !== formulario.confirmarSenha) {
            setErro("As senhas informadas não coincidem.");
            return;
        }

        // 2. Os termos precisam estar aceitos (falta criar a tela com o texto dos termos)
        if (!aceitouTermos) {
            setErro("Você precisa aceitar os termos para continuar.");
            return;
        }

        // 3. O fluxo precisa ter enviado a função de continuar
        if (typeof onContinuarVerificacao !== "function") {
            setErro("Não foi possível abrir a tela de verificação.");
            console.error("A propriedade onContinuarVerificacao não foi fornecida.");
            return;
        }

        // 4. Manda os dados pro fluxo (ele envia o SMS e abre a verificação).
        //    Se der erro, a mensagem aparece aqui mesmo.
        setEnviando(true);

        try {
            await onContinuarVerificacao({ ...formulario });
        } catch (err) {
            setErro(err.message || "Não foi possível enviar o código.");
        } finally {
            setEnviando(false);
        }
    }

    // ---------------------------------------------------------------
    //                              Tela
    // ---------------------------------------------------------------
    return (
        // Fundo desfocado
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-2 backdrop-blur-[3px] sm:p-4">

            {/* Card do cadastro */}
            <div className="relative max-h-[calc(100dvh-16px)] w-full max-w-[640px] overflow-y-auto rounded-[15px] bg-white px-6 pb-[30px] pt-[25px] shadow-xl sm:max-h-[calc(100dvh-32px)] sm:px-[94px] sm:pt-[25px]">

                {/* Botão de fechar */}
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
                    onSubmit={handleSubmit}
                    autoComplete="off"
                >

                    {/* Nome */}
                    <Campo
                        label="Nome completo"
                        name="nome"
                        placeholder="Seu nome aqui"
                        value={formulario.nome}
                        onChange={atualizarCampo}
                    />

                    {/* Nascimento e CPF lado a lado */}
                    <div className="grid grid-cols-2 gap-[15px]">

                        <Campo
                            label="Data de nascimento"
                            name="nascimento"
                            placeholder="DD/MM/AAAA"
                            value={formulario.nascimento}
                            inputMode="numeric"
                            onChange={atualizarCampo}
                        />

                        <Campo
                            label="CPF"
                            name="cpf"
                            placeholder="000.000.000-00"
                            value={formulario.cpf}
                            inputMode="numeric"
                            onChange={atualizarCampo}
                        />

                    </div>

                    {/* E-mail */}
                    <Campo
                        label="E-mail"
                        name="email"
                        placeholder="seuemail@exemplo.com"
                        type="email"
                        value={formulario.email}
                        onChange={atualizarCampo}
                    />

                    {/* Telefone (é pra esse número que vai o SMS) */}
                    <Campo
                        label="Telefone"
                        name="telefone"
                        placeholder="(00) 00000-0000"
                        type="tel"
                        value={formulario.telefone}
                        inputMode="tel"
                        onChange={atualizarCampo}
                    />

                    {/* Senha */}
                    <CampoSenha
                        label="Senha"
                        name="senha"
                        placeholder="Crie uma senha"
                        mostrar={mostrarSenha}
                        alternar={() => setMostrarSenha(!mostrarSenha)}
                        value={formulario.senha}
                        onChange={atualizarCampo}
                    />

                    {/* Confirmar senha */}
                    <CampoSenha
                        label="Confirmar senha"
                        name="confirmarSenha"
                        placeholder="Repita a senha"
                        mostrar={mostrarConfirmacao}
                        alternar={() => setMostrarConfirmacao(!mostrarConfirmacao)}
                        value={formulario.confirmarSenha}
                        onChange={atualizarCampo}
                    />

                    {/* Termos */}
                    <label className="flex cursor-pointer items-center gap-[9px] pt-[18px] text-[11px] leading-[16px] text-[#666]">

                        <input
                            type="checkbox"
                            checked={aceitouTermos}
                            onChange={(e) => setAceitouTermos(e.target.checked)}
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

                    {/* Erro (senhas diferentes, termos, falha no SMS...) */}
                    {erro && (
                        <p
                            role="alert"
                            className="text-center text-xs text-red-500"
                        >
                            {erro}
                        </p>
                    )}

                    {/* Botão criar conta */}
                    <div className="pt-[23px]">
                        <button
                            type="submit"
                            disabled={enviando}
                            className="mx-auto flex h-[35px] w-full items-center justify-center rounded-[12px] bg-[#7548C8] text-[16px] font-bold text-white transition hover:bg-[#6539B8] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:w-[calc(100%-72px)]"
                        >
                            {enviando ? "Enviando código..." : "Criar conta"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}