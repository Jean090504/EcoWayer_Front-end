import { useState } from "react";

// Classes que se repetem nos campos
const inputClass =
    "w-full h-[40px] rounded-[11px] border border-[#E2E6EB] bg-white px-[12px] text-[12px] text-[#444] placeholder:text-[#929292] outline-none transition focus:border-[#7950CC] focus:ring-1 focus:ring-[#7950CC]/20";

const labelClass =
    "mb-[4px] block text-[11px] font-medium leading-[14px] text-[#454545]";

// Deixa como "somente leitura" para o navegador não 
// preencher tudo sozinho até que seja clicado no campo
// assim não vem nada preenchido ao abrir o card
function liberarCampo(evento) {
    evento.target.removeAttribute("readonly");
}

// CAMPO COMUM

// Fica fora do CreateAccount de propósito: se ficasse dentro, seria
// recriado a cada letra digitada e os campos perderiam o foco.
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

// CAMPO DE SENHA (com o olhinho)
// Também fica fora do CreateAccount, pelo mesmo motivo.
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

// TELA DE CRIAR CONTA

// propriedade que recebo do App:
// - onClose: fecha o card
// - onContinuarVerificacao: manda os dados, o App envia o SMS e abre a verificação
// - dadosIniciais: o que eu já tinha preenchido (quando volto da verificação)
export default function CreateAccount({
    onClose,
    onContinuarVerificacao,
    dadosIniciais
}) {
    // Olhinhos das duas senhas
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

    // Mensagem de erro que aparece acima do botão
    const [erro, setErro] = useState("");

    // true enquanto o SMS está sendo enviado (trava o botão)
    const [enviando, setEnviando] = useState(false);

    // Tudo que preencho -> Se voltei da verificação, começa com os dados de antes
    const [formulario, setFormulario] = useState(
        dadosIniciais ?? {
            nome: "",
            nascimento: "",
            cpf: "",
            email: "",
            telefone: "",
            id_genero: "",
            senha: "",
            confirmarSenha: ""
        }
    );

    // Se voltei da verificação, os termos já tinham sido aceitos
    const [aceitouTermos, setAceitouTermos] = useState(Boolean(dadosIniciais));

    // Atualiza o campo que estou digitando
    function atualizarCampo(event) {
        const { name, value } = event.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value
        }));

        setErro("");
    }

    // Quando clico em "Criar conta"
    async function handleSubmit(event) {
        event.preventDefault();

        setErro("");

        // 1. As duas senhas precisam ser iguais
        if (formulario.senha !== formulario.confirmarSenha) {
            setErro("As senhas informadas não coincidem.");
            return;
        }

        // 2. Garante que a pessoa tenha clicado em "aceitar os termos" -> falta criar a tela que terá o texto dos termos
        if (!aceitouTermos) {
            setErro("Você precisa aceitar os termos para continuar.");
            return;
        }

        // 3. Garante que o App mandou a função de continuar
        if (typeof onContinuarVerificacao !== "function") {
            setErro("Não foi possível abrir a tela de verificação.");

            console.error(
                "A propriedade onContinuarVerificacao não foi fornecida."
            );

            return;
        }

        // 4. Manda os dados pro App -> Ele envia o SMS e abre a verificação
        //    Se o envio der erro, mostra a mensagem aqui mesmo
        setEnviando(true);

        try {
            await onContinuarVerificacao({ ...formulario });
        } catch (err) {
            setErro(err.message || "Não foi possível enviar o código.");
        } finally {
            setEnviando(false);
        }
    }

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

                    {/* Telefone: é pra esse número que vai o SMS */}
                    <Campo
                        label="Telefone"
                        name="telefone"
                        placeholder="(00) 00000-0000"
                        type="tel"
                        value={formulario.telefone}
                        inputMode="tel"
                        onChange={atualizarCampo}
                    />

                    <div>
                        <label htmlFor="id_genero" className={labelClass}>Gênero</label>
                        <select id="id_genero" name="id_genero" value={formulario.id_genero} onChange={atualizarCampo} className={inputClass} required>
                            <option value="">Selecione</option>
                            <option value="1">Masculino</option>
                            <option value="2">Feminino</option>
                            <option value="3">Não-binário</option>
                            <option value="4">Outro</option>
                            <option value="5">Prefiro não informar</option>
                        </select>
                    </div>

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
                        alternar={() =>
                            setMostrarConfirmacao(!mostrarConfirmacao)
                        }
                        value={formulario.confirmarSenha}
                        onChange={atualizarCampo}
                    />

                    {/* Termos */}
                    <label className="flex cursor-pointer items-center gap-[9px] pt-[18px] text-[11px] leading-[16px] text-[#666]">

                        <input
                            type="checkbox"
                            checked={aceitouTermos}
                            onChange={(e) =>
                                setAceitouTermos(e.target.checked)
                            }
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
