
import { useEffect, useRef, useState } from "react";
import {
    ImagePlus,
    Camera,
    Image as IconeImagem,
    Banknote,
    ArrowLeftRight,
    HandHeart,
    ChevronDown,
    ArrowRight,
    X
} from "lucide-react";


// ===================================================================
//                         FUNÇÕES AUXILIARES
// ===================================================================

// Preço: digita 4500 -> mostra 45,00
function mascararPreco(valor) {
    const centavos = valor.replace(/\D/g, "").slice(0, 9);

    if (!centavos) return "";

    return (Number(centavos) / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Peso: só números
function mascararPeso(valor) {
    return valor.replace(/\D/g, "").slice(0, 7);
}

// "1.234,56" -> 1234.56
function precoParaNumero(texto) {
    return Number(texto.replace(/\./g, "").replace(",", ".")) || 0;
}

// Devolve a mensagem do primeiro problema, ou "" se estiver tudo certo
function validarFormulario(f, modalidade, qtdFotos) {
    if (qtdFotos === 0) return "Adicione pelo menos 1 foto do material.";
    if (!f.titulo.trim()) return "Informe o título do anúncio.";
    if (!f.categoria) return "Escolha a categoria do material.";
    if (!f.condicao) return "Escolha o estado / condição do material.";

    if (modalidade === "venda" && precoParaNumero(f.preco) <= 0) {
        return "Informe o preço estimado.";
    }

    if (!Number(f.peso)) return "Informe o volume / peso estimado.";

    if (f.descricao.trim().length < 20) {
        return "Descreva o material com mais detalhes (mínimo 20 caracteres).";
    }

    return "";
}


// ===================================================================
//                            CONSTANTES
// ===================================================================

const MAX_FOTOS = 6;
const SLOTS_MINIMOS = 4;
const MAX_FOTO_MB = 5;
const MAX_TITULO = 70;
const MAX_DESCRICAO = 1000;

// Classes repetidas nos campos
const campoClass = "h-[44px] w-full rounded-full border border-transparent bg-[#F8F8F8] px-4 text-[14px] text-[#191C1E] placeholder:text-[#9AA39A] outline-none transition focus:border-[#724BC2] focus:bg-white";
const selectClass = `${campoClass} appearance-none cursor-pointer pr-10`;

// Máscara de cada campo
const MASCARAS = {
    preco: mascararPreco,
    peso: mascararPeso
};

const MODALIDADES = [
    { id: "venda", titulo: "Venda", descricao: "Receba via EcoCarteira ou Pix", Icone: Banknote },
    { id: "troca", titulo: "Troca", descricao: "Permute por outros materiais", Icone: ArrowLeftRight },
    { id: "doacao", titulo: "Doação", descricao: "Destine a cooperativas/catadores", Icone: HandHeart }
];

const CATEGORIAS = [
    { valor: "papelao-papel", rotulo: "Papelão & Papel" },
    { valor: "plastico", rotulo: "Plástico" },
    { valor: "metal", rotulo: "Metal" },
    { valor: "vidro", rotulo: "Vidro" },
    { valor: "eletronicos", rotulo: "Eletrônicos" },
    { valor: "madeira", rotulo: "Madeira" },
    { valor: "textil", rotulo: "Têxtil" },
    { valor: "outros", rotulo: "Outros" }
];

const CONDICOES = [
    { valor: "excelente", rotulo: "Excelente / Higienizado / Pronto p/ Processamento" },
    { valor: "bom", rotulo: "Bom / Pequenas sujidades" },
    { valor: "regular", rotulo: "Regular / Requer triagem" },
    { valor: "sujo", rotulo: "Sujo / Requer limpeza" }
];

const UNIDADES = [
    { valor: "kg", rotulo: "Quilogramas (kg)" },
    { valor: "t", rotulo: "Toneladas (t)" },
    { valor: "un", rotulo: "Unidades" },
    { valor: "l", rotulo: "Litros (l)" }
];


// ===================================================================
//                      COMPONENTES REUTILIZÁVEIS
// ===================================================================

// Título de cada seção
function TituloSecao({ numero, children, direita }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#EEEAFB] text-[11px] font-semibold text-[#724BC2]">
                    {numero}
                </span>

                <h3 className="text-[18px] font-semibold text-[#191C1E]">
                    {children}
                </h3>
            </div>

            {direita && (
                <span className="text-[12px] text-[#3E4A3D]">{direita}</span>
            )}
        </div>
    );
}

// Rótulo do campo (sem asterisco)
function Rotulo({ htmlFor, children }) {
    return (
        <label
            htmlFor={htmlFor}
            className="mb-2 block text-[14px] font-semibold text-[#191C1E]"
        >
            {children}
        </label>
    );
}

// Campo de seleção com seta
function CampoSelect({ id, name, value, onChange, opcoes, placeholder, ariaLabel }) {
    return (
        <div className="relative">
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                aria-label={ariaLabel}
                className={`${selectClass} ${value ? "text-[#191C1E]" : "text-[#9AA39A]"}`}
            >
                {placeholder && <option value="">{placeholder}</option>}

                {opcoes.map((opcao) => (
                    <option key={opcao.valor} value={opcao.valor}>
                        {opcao.rotulo}
                    </option>
                ))}
            </select>

            <ChevronDown
                size={16}
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#3E4A3D]"
            />
        </div>
    );
}

// Opção de modalidade (venda, troca ou doação)
function OpcaoModalidade({ titulo, descricao, Icone, selecionada, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selecionada}
            className={`flex min-h-[80px] cursor-pointer items-center gap-3 rounded-[20px] px-3 py-4 text-left transition ${
                selecionada
                    ? "bg-[#724BC2] text-white"
                    : "bg-[#F8F8F8] text-[#191C1E] hover:bg-[#F1EFFB]"
            }`}
        >
            <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    selecionada
                        ? "bg-white/20 text-white"
                        : "bg-white text-[#724BC2]"
                }`}
            >
                <Icone size={20} />
            </span>

            <span className="flex flex-1 flex-col">
                <span className="text-[18px] font-semibold leading-tight">
                    {titulo}
                </span>

                <span className={`text-[12px] ${
                    selecionada ? "text-white/85" : "text-[#3E4A3D]"
                }`}>
                    {descricao}
                </span>
            </span>
        </button>
    );
}

// Quadradinho de foto
function SlotFoto({ numero, foto, principal, onRemover }) {
    if (!foto) {
        return (
            <div className="flex h-[144px] min-w-[96px] flex-1 flex-col items-center justify-center gap-1 rounded-[32px] bg-[#F8F8F8] text-[#9AA39A]">
                <IconeImagem size={20} />
                <span className="text-[11px]">Foto {numero}</span>
            </div>
        );
    }

    return (
        <div className="relative h-[144px] min-w-[96px] flex-1 overflow-hidden rounded-[32px] bg-[#F8F8F8]">
            <img
                src={foto.url}
                alt={`Foto ${numero} do material`}
                className="h-full w-full object-cover"
            />

            {principal && (
                <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white">
                    Principal
                </span>
            )}

            <button
                type="button"
                onClick={onRemover}
                aria-label={`Remover foto ${numero}`}
                className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#191C1E] transition hover:bg-white"
            >
                <X size={14} />
            </button>
        </div>
    );
}


// ===================================================================
//                       CARD DE CRIAR ANÚNCIO
// ===================================================================

export default function CriarAnuncio({ onPublicar, onSalvarRascunho, onCancelar }) {

    // ---------------------------------------------------------------
    //                            Estados
    // ---------------------------------------------------------------

    const [fotos, setFotos] = useState([]);
    const [arrastando, setArrastando] = useState(false);
    const [modalidade, setModalidade] = useState("venda");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    const [formulario, setFormulario] = useState({
        titulo: "",
        categoria: "",
        condicao: "",
        preco: "",
        peso: "",
        unidade: "kg",
        descricao: ""
    });

    const inputArquivo = useRef(null);
    const fotosRef = useRef([]);

    // Libera as URLs das fotos quando o card fecha
    useEffect(() => {
        fotosRef.current = fotos;
    }, [fotos]);

    useEffect(() => {
        return () => fotosRef.current.forEach((f) => URL.revokeObjectURL(f.url));
    }, []);

    // ---------------------------------------------------------------
    //                            Funções
    // ---------------------------------------------------------------

    // Adiciona fotos respeitando tipo, tamanho e limite
    function adicionarFotos(lista) {
        const arquivos = Array.from(lista ?? []);

        if (arquivos.length === 0) return;

        const imagens = arquivos.filter((a) => a.type.startsWith("image/"));
        const leves = imagens.filter((a) => a.size <= MAX_FOTO_MB * 1024 * 1024);
        const vagas = Math.max(MAX_FOTOS - fotos.length, 0);

        let aviso = "";

        if (imagens.length < arquivos.length) {
            aviso = "Só são aceitas imagens.";
        } else if (leves.length < imagens.length) {
            aviso = `Cada foto pode ter até ${MAX_FOTO_MB} MB.`;
        }

        if (leves.length > vagas) {
            aviso = `Você pode enviar até ${MAX_FOTOS} fotos.`;
        }

        const novas = leves.slice(0, vagas).map((arquivo) => ({
            id: `${Date.now()}-${Math.random()}`,
            arquivo,
            url: URL.createObjectURL(arquivo)
        }));

        setFotos((atuais) => [...atuais, ...novas]);
        setErro(aviso);
    }

    function aoEscolherArquivos(event) {
        adicionarFotos(event.target.files);
        event.target.value = "";
    }

    // Arrastar arquivos sobre toda a área das fotos
    function aoArrastarSobre(event) {
        event.preventDefault();
        setArrastando(true);
    }

    function aoSairDoArraste(event) {
        if (event.currentTarget.contains(event.relatedTarget)) return;

        setArrastando(false);
    }

    function aoSoltarArquivos(event) {
        event.preventDefault();
        setArrastando(false);
        adicionarFotos(event.dataTransfer.files);
    }

    function removerFoto(id) {
        const foto = fotos.find((f) => f.id === id);

        if (foto) URL.revokeObjectURL(foto.url);

        setFotos((atuais) => atuais.filter((f) => f.id !== id));
        setErro("");
    }

    // Atualiza o campo digitado
    function atualizarCampo(event) {
        const { name, value } = event.target;
        const formatar = MASCARAS[name];

        setFormulario((anterior) => ({
            ...anterior,
            [name]: formatar ? formatar(value) : value
        }));

        setErro("");
    }

    // Monta os dados enviados para a página
    function montarDados() {
        return {
            modalidade,
            fotos: fotos.map((f) => f.arquivo),
            titulo: formulario.titulo.trim(),
            categoria: formulario.categoria,
            condicao: formulario.condicao,
            preco: modalidade === "venda" ? precoParaNumero(formulario.preco) : 0,
            peso: Number(formulario.peso) || 0,
            unidade: formulario.unidade,
            descricao: formulario.descricao.trim()
        };
    }

    // Executa publicação ou salvamento
    async function executar(acao, mensagemPadrao) {
        if (typeof acao !== "function") {
            setErro("Ação indisponível no momento.");
            console.error("A função recebida da página não foi fornecida.");
            return;
        }

        setEnviando(true);
        setErro("");

        try {
            await acao(montarDados());
        } catch (err) {
            setErro(err.message || mensagemPadrao);
        } finally {
            setEnviando(false);
        }
    }

    // Publicar anúncio
    async function handlePublicar(event) {
        event.preventDefault();

        const mensagem = validarFormulario(formulario, modalidade, fotos.length);

        if (mensagem) {
            setErro(mensagem);
            return;
        }

        await executar(onPublicar, "Não foi possível publicar o anúncio.");
    }

    // Salvar rascunho
    async function handleRascunho() {
        await executar(onSalvarRascunho, "Não foi possível salvar o rascunho.");
    }

    // ---------------------------------------------------------------
    //                              CARD
    // ---------------------------------------------------------------

    const qtdSlots = Math.max(SLOTS_MINIMOS, fotos.length);
    const limiteDeFotos = fotos.length >= MAX_FOTOS;

    return (
        <form
            onSubmit={handlePublicar}
            noValidate
            className="mx-auto w-full max-w-[1320px] rounded-[48px] bg-white p-6 shadow-sm sm:p-10"
        >

            {/* Título */}
            <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#724BC2] text-white">
                    <ImagePlus size={20} />
                </span>

                <h2 className="text-[32px] font-bold leading-tight text-[#191C1E]">
                    Editar Anúncio
                </h2>
            </div>


            {/* ---------------- 1. Fotos do material ---------------- */}
            <section className="mt-10">
                <TituloSecao numero={1}>
                    Fotos do Material
                </TituloSecao>

                {/* Área de fotos */}
                <div
                    onDragOver={aoArrastarSobre}
                    onDragLeave={aoSairDoArraste}
                    onDrop={aoSoltarArquivos}
                    className="mt-4 flex gap-4 overflow-x-auto"
                >

                    {/* Adicionar fotos */}
                    <button
                        type="button"
                        onClick={() => inputArquivo.current?.click()}
                        disabled={limiteDeFotos}
                        className={`flex h-[144px] w-[180px] shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-[32px] px-4 text-center transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            arrastando
                                ? "border border-dashed border-[#724BC2] bg-[#F1EFFB]"
                                : "border border-transparent bg-[#F8F8F8] hover:bg-[#F1EFFB]"
                        }`}
                    >
                        <span className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#724BC2]">
                            <Camera size={20} />
                        </span>

                        <span className="text-[13px] font-semibold text-[#191C1E]">
                            Adicionar fotos
                        </span>
                    </button>

                    <input
                        ref={inputArquivo}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={aoEscolherArquivos}
                        className="hidden"
                    />

                    {/* Quadradinhos das fotos */}
                    {Array.from({ length: qtdSlots }).map((_, indice) => (
                        <SlotFoto
                            key={fotos[indice]?.id ?? `vazio-${indice}`}
                            numero={indice + 1}
                            foto={fotos[indice]}
                            principal={indice === 0}
                            onRemover={() => removerFoto(fotos[indice].id)}
                        />
                    ))}

                </div>
            </section>


            {/* ---------------- 2. Modalidade de negociação ---------------- */}
            <section className="mt-10 w-full">
                <TituloSecao numero={2}>
                    Modalidade de Negociação
                </TituloSecao>

                <div className="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-3">
                    {MODALIDADES.map((item) => (
                        <OpcaoModalidade
                            key={item.id}
                            titulo={item.titulo}
                            descricao={item.descricao}
                            Icone={item.Icone}
                            selecionada={modalidade === item.id}
                            onClick={() => {
                                setModalidade(item.id);
                                setErro("");
                            }}
                        />
                    ))}
                </div>
            </section>


            {/* ---------------- 3. Informações do material ---------------- */}
            <section className="mt-10">
                <TituloSecao numero={3}>
                    Informações do Material
                </TituloSecao>

                <div className="mt-5 space-y-6">

                    {/* Título do anúncio */}
                    <div>
                        <Rotulo htmlFor="titulo">
                            Título do Anúncio
                        </Rotulo>

                        <div className="relative">
                            <input
                                id="titulo"
                                name="titulo"
                                type="text"
                                value={formulario.titulo}
                                onChange={atualizarCampo}
                                maxLength={MAX_TITULO}
                                placeholder="Ex: Fardos de Papelão Ondulado Prensado - Limpo"
                                autoComplete="off"
                                className={`${campoClass} pr-16`}
                            />

                            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-[#9AA39A]">
                                {formulario.titulo.length}/{MAX_TITULO}
                            </span>
                        </div>
                    </div>

                    {/* Categoria e condição */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Rotulo htmlFor="categoria">
                                Categoria do Material
                            </Rotulo>

                            <CampoSelect
                                id="categoria"
                                name="categoria"
                                value={formulario.categoria}
                                onChange={atualizarCampo}
                                opcoes={CATEGORIAS}
                                placeholder="Selecione a categoria"
                            />
                        </div>

                        <div>
                            <Rotulo htmlFor="condicao">
                                Estado / Condição
                            </Rotulo>

                            <CampoSelect
                                id="condicao"
                                name="condicao"
                                value={formulario.condicao}
                                onChange={atualizarCampo}
                                opcoes={CONDICOES}
                                placeholder="Selecione a condição"
                            />
                        </div>
                    </div>

                    {/* Preço e volume / peso */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        {modalidade === "venda" && (
                            <div>
                                <Rotulo htmlFor="preco">
                                    Preço Estimado
                                </Rotulo>

                                <div className="relative">
                                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-bold text-[#724BC2]">
                                        R$
                                    </span>

                                    <input
                                        id="preco"
                                        name="preco"
                                        type="text"
                                        inputMode="numeric"
                                        value={formulario.preco}
                                        onChange={atualizarCampo}
                                        placeholder="0,00"
                                        autoComplete="off"
                                        className={`${campoClass} pl-12 text-[18px] font-semibold`}
                                    />
                                </div>
                            </div>
                        )}

                        <div className={modalidade === "venda" ? "" : "sm:col-span-1"}>
                            <Rotulo htmlFor="peso">
                                Volume / Peso Estimado
                            </Rotulo>

                            <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-1">
                                <input
                                    id="peso"
                                    name="peso"
                                    type="text"
                                    inputMode="numeric"
                                    value={formulario.peso}
                                    onChange={atualizarCampo}
                                    placeholder="Ex: 120"
                                    autoComplete="off"
                                    className={campoClass}
                                />

                                <CampoSelect
                                    id="unidade"
                                    name="unidade"
                                    value={formulario.unidade}
                                    onChange={atualizarCampo}
                                    opcoes={UNIDADES}
                                    ariaLabel="Unidade de medida"
                                />
                            </div>
                        </div>

                    </div>

                    {/* Descrição detalhada */}
                    <div>
                        <Rotulo htmlFor="descricao">
                            Descrição Detalhada
                        </Rotulo>

                        <textarea
                            id="descricao"
                            name="descricao"
                            rows={5}
                            maxLength={MAX_DESCRICAO}
                            value={formulario.descricao}
                            onChange={atualizarCampo}
                            placeholder="Descreva o material, a procedência, o estado de conservação e como funciona a retirada..."
                            className="w-full resize-none rounded-[24px] border border-transparent bg-[#F8F8F8] p-4 text-[14px] leading-[20px] text-[#191C1E] placeholder:text-[#9AA39A] outline-none transition focus:border-[#724BC2] focus:bg-white"
                        />
                    </div>

                </div>
            </section>


            {/* Erro */}
            {erro && (
                <p
                    role="alert"
                    className="mt-6 text-center text-[13px] text-red-500"
                >
                    {erro}
                </p>
            )}


            {/* ---------------- Ações ---------------- */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onCancelar}
                        disabled={enviando}
                        className="cursor-pointer rounded-full bg-[#E53935] px-6 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#C62828] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Cancelar
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={enviando}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#724BC2] px-6 py-2.5 text-[16px] font-semibold text-white transition hover:bg-[#6539B8] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {enviando ? "Enviando..." : "Salvar alterações"}
                    {!enviando && <ArrowRight size={18} />}
                </button>

            </div>

        </form>
    );
}
