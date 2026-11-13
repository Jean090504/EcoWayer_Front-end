
import { useEffect, useState } from "react";
import { Search, MapPin, Mail, Wallet, MessageSquare } from "lucide-react";
import ItemNavegacao from "../ui/itemNavegacao.jsx";
import BotaoHeader from "../ui/botao.jsx";
import perfil from "../../assets/icons/icones/foto.png";

// ---------------------------------------------------------------------------
//                              Constantes
// ---------------------------------------------------------------------------
const IBGE_API = "https://servicodados.ibge.gov.br/api/v1/localidades";

const TEXTO_XS = "text-[length:clamp(11px,0.82vw,12px)]";
const TEXTO_SM = "text-[length:clamp(12px,0.92vw,14px)]";

const ICONE_NAV =
    "h-[clamp(17px,1.32vw,20px)] w-[clamp(17px,1.32vw,20px)]";

// Espaçamentos
const GAP_GRUPOS = "gap-[clamp(10px,1.1vw,18px)]";
const GAP_NAV = "gap-[clamp(10px,1.15vw,18px)]";
const GAP_ITEM = "gap-[clamp(7px,0.7vw,11px)]";

// ---------------------------------------------------------------------------
//   Props recebidas do App:
//     usuario             -> dados do usuário logado (ou null)
//     onAbrirLogin        -> abre o card de login
//     onAbrirCriarConta   -> abre o fluxo de cadastro
//     onAbrirNovoAnuncio  -> abre o fluxo de novo anúncio
//     onNavegar           -> troca a tela ativa
// ---------------------------------------------------------------------------
export default function Header({
    usuario,
    onAbrirLogin,
    onAbrirCriarConta,
    onAbrirNovoAnuncio,
    onNavegar
}) {
    // -----------------------------------------------------------------------
    //                         Estados: interface
    // -----------------------------------------------------------------------
    const [mostrarFiltro, setMostrarFiltro] = useState(false);

    // -----------------------------------------------------------------------
    //                         Estados: estados (UF)
    // -----------------------------------------------------------------------
    const [estados, setEstados] = useState([]);
    const [ufSelecionada, setUfSelecionada] = useState("");
    const [carregandoEstados, setCarregandoEstados] = useState(false);
    const [erroEstados, setErroEstados] = useState(false);

    // -----------------------------------------------------------------------
    //                        Estados: cidades
    // -----------------------------------------------------------------------
    const [cidades, setCidades] = useState([]);
    const [cidadeSelecionada, setCidadeSelecionada] = useState("");
    const [carregandoCidades, setCarregandoCidades] = useState(false);
    const [erroCidades, setErroCidades] = useState(false);

    // -----------------------------------------------------------------------
    //                             Efeitos
    // -----------------------------------------------------------------------

    // Busca os estados ao montar o header
    useEffect(() => {
        const controller = new AbortController();

        async function buscarEstados() {
            setCarregandoEstados(true);
            setErroEstados(false);

            try {
                const resposta = await fetch(`${IBGE_API}/estados?orderBy=nome`, {
                    signal: controller.signal,
                });

                if (!resposta.ok) {
                    throw new Error("Não foi possível carregar os estados.");
                }

                setEstados(await resposta.json());
            } catch (erro) {
                if (erro.name !== "AbortError") {
                    console.error("Erro ao buscar estados:", erro);
                    setErroEstados(true);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setCarregandoEstados(false);
                }
            }
        }

        buscarEstados();
        return () => controller.abort();
    }, []);

    // Busca as cidades sempre que o estado muda
    useEffect(() => {
        if (!ufSelecionada) {
            setCidades([]);
            setCidadeSelecionada("");
            setErroCidades(false);
            return;
        }

        const controller = new AbortController();

        async function buscarCidades() {
            setCarregandoCidades(true);
            setErroCidades(false);
            setCidades([]);

            try {
                const resposta = await fetch(
                    `${IBGE_API}/estados/${ufSelecionada}/municipios?orderBy=nome`,
                    { signal: controller.signal }
                );

                if (!resposta.ok) {
                    throw new Error("Não foi possível carregar as cidades.");
                }

                setCidades(await resposta.json());
            } catch (erro) {
                if (erro.name !== "AbortError") {
                    console.error("Erro ao buscar cidades:", erro);
                    setErroCidades(true);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setCarregandoCidades(false);
                }
            }
        }

        buscarCidades();
        return () => controller.abort();
    }, [ufSelecionada]);

    // -----------------------------------------------------------------------
    //                                 Funções
    // -----------------------------------------------------------------------
    function selecionarEstado(e) {
        setUfSelecionada(e.target.value);
        setCidadeSelecionada("");
    }

    function limparLocalizacao() {
        setUfSelecionada("");
        setCidadeSelecionada("");
        setCidades([]);
    }

    // -----------------------------------------------------------------------
    //                                 Tela
    // -----------------------------------------------------------------------
    return (
        <header className="h-[clamp(88px,7.67vw,116px)] w-full border-b border-gray-200 bg-white">

            {/* Contêiner principal */}
            <div
                className={`mx-auto flex h-full w-full items-center ${GAP_GRUPOS} px-[clamp(24px,2.5vw,40px)]`}
            >

                {/* Logo */}
                <div className="flex shrink-0 items-center">
                    <p className="whitespace-nowrap font-bold leading-none text-[clamp(25px,2vw,32px)] text-[#4CAF50]">
                        Eco<span className="text-[#724BC2]">market</span>
                    </p>
                </div>

                {/* Campo de pesquisa */}
                <div className="relative flex h-[clamp(30px,3.2vw,48px)] min-w-[180px] flex-1 items-center rounded-xl border border-gray-200 bg-white px-[clamp(10px,0.88vw,16px)] shadow-sm">

                    <input
                        type="text"
                        placeholder="Buscar ponto de coleta, bairro..."
                        className={`min-w-0 flex-1 ${TEXTO_SM} text-gray-700 outline-none placeholder:text-gray-400`}
                    />

                    {/* Lupa de pesquisa */}
                    <Search
                        className="ml-3 h-[clamp(16px,1.17vw,19px)] w-[clamp(16px,1.17vw,19px)] shrink-0 text-[#8C8C8C]"
                    />

                    <div className="ml-3 flex h-[clamp(24px,2.05vw,32px)] shrink-0 items-center border-l border-gray-200 pl-2">

                        {/* Botão do filtro */}
                        <button
                            type="button"
                            aria-label="Filtros de localização"
                            aria-expanded={mostrarFiltro}
                            onClick={() => setMostrarFiltro(!mostrarFiltro)}
                            className="flex items-center justify-center rounded-md p-1 transition hover:bg-gray-100"
                        >
                            <MapPin className={`${ICONE_NAV} object-contain text-[#8C8C8C]`} />
                        </button>
                    </div>

                    {/* Menu suspenso de localização */}
                    {mostrarFiltro && (
                        <div className="absolute right-0 top-full z-50 mt-2 w-[clamp(240px,18.7vw,300px)] rounded-xl border border-gray-200 bg-white p-[clamp(14px,1.17vw,20px)] shadow-lg">

                            <div className="mb-3 flex items-center justify-between">
                                <h3 className={`${TEXTO_SM} font-semibold text-gray-800`}>
                                    Filtrar localização
                                </h3>

                                <BotaoHeader
                                    onClick={() => setMostrarFiltro(false)}
                                    className="text-[length:clamp(18px,1.32vw,22px)] text-gray-400 transition hover:text-gray-700"
                                    aria-label="Fechar filtro"
                                >
                                    ×
                                </BotaoHeader>
                            </div>

                            {/* Seleção do estado */}
                            <label className={`mb-1 block ${TEXTO_XS} font-semibold text-gray-600`}>
                                Estado (UF)
                            </label>

                            <select
                                value={ufSelecionada}
                                onChange={selecionarEstado}
                                disabled={carregandoEstados || erroEstados}
                                className={`mb-4 h-[clamp(36px,2.93vw,46px)] w-full rounded-lg border border-gray-200 bg-white px-3 ${TEXTO_SM} text-gray-700 outline-none focus:border-[#4CAF50] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400`}
                            >
                                <option value="">
                                    {carregandoEstados
                                        ? "Carregando estados..."
                                        : erroEstados
                                            ? "Erro ao carregar estados"
                                            : "Selecione um estado"}
                                </option>

                                {estados.map((estado) => (
                                    <option key={estado.id} value={estado.id}>
                                        {estado.nome} ({estado.sigla})
                                    </option>
                                ))}
                            </select>

                            {/* Seleção da cidade */}
                            <label className={`mb-1 block ${TEXTO_XS} font-semibold text-gray-600`}>
                                Cidade
                            </label>

                            <select
                                value={cidadeSelecionada}
                                onChange={(e) => setCidadeSelecionada(e.target.value)}
                                disabled={!ufSelecionada || carregandoCidades || erroCidades || cidades.length === 0}
                                className={`h-[clamp(36px,2.93vw,46px)] w-full rounded-lg border border-gray-200 bg-white px-3 ${TEXTO_SM} text-gray-700 outline-none focus:border-[#4CAF50] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400`}
                            >
                                <option value="">
                                    {!ufSelecionada
                                        ? "Selecione primeiro o estado"
                                        : carregandoCidades
                                            ? "Carregando cidades..."
                                            : erroCidades
                                                ? "Erro ao carregar cidades"
                                                : cidades.length === 0
                                                    ? "Nenhuma cidade disponível"
                                                    : "Selecione uma cidade"}
                                </option>

                                {cidades.map((cidade) => (
                                    <option key={cidade.id} value={cidade.id}>
                                        {cidade.nome}
                                    </option>
                                ))}
                            </select>

                            {/* Limpar filtros */}
                            <button
                                type="button"
                                onClick={limparLocalizacao}
                                className={`mt-4 w-full rounded-lg py-2 ${TEXTO_XS} font-semibold text-[#4CAF50] transition hover:bg-green-50`}
                            >
                                Limpar localização
                            </button>
                        </div>
                    )}
                </div>

                {/* Navegação */}
                <nav
                    className={`flex shrink-0 items-center ${GAP_NAV} text-[length:clamp(11px,0.9vw,14px)] [&_svg]:!h-[clamp(17px,1.32vw,20px)] [&_svg]:!w-[clamp(17px,1.32vw,20px)]`}
                >
                    <ItemNavegacao Icone={Mail} texto="Meus anúncios" />
                    <ItemNavegacao Icone={Wallet} texto="Carteira" />
                    <ItemNavegacao Icone={MessageSquare} texto="Chat" />
                </nav>

                {/* Renderização condicional: usuário logado ou deslogado */}
                {usuario ? (
                    <div className={`flex shrink-0 items-center ${GAP_ITEM}`}>

                        {/* Perfil do usuário */}
                        <div className={`flex shrink-0 items-center ${GAP_ITEM}`}>
                            <img
                                src={usuario.foto || perfil}
                                alt="Foto de perfil"
                                className="h-[clamp(34px,2.5vw,40px)] w-[clamp(34px,2.5vw,40px)] rounded-full object-cover"
                            />

                            <span className={`whitespace-nowrap ${TEXTO_SM} font-semibold text-black`}>
                                {usuario.nome}
                            </span>
                        </div>

                        {/* Botão anunciar */}
                        <BotaoHeader
                            onClick={onAbrirNovoAnuncio}
                            className={`flex h-[clamp(34px,2.5vw,40px)] shrink-0 items-center justify-center rounded-full bg-[#724BC2] px-[clamp(18px,1.8vw,28px)] ${TEXTO_SM} font-semibold text-white transition hover:bg-purple-700`}
                        >
                            Anunciar
                        </BotaoHeader>
                    </div>
                ) : (
                    <div className={`flex shrink-0 items-center ${GAP_ITEM}`}>

                        {/* Botão criar conta */}
                        <BotaoHeader
                            onClick={onAbrirCriarConta}
                            className={`flex h-[clamp(34px,2.5vw,40px)] shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white px-[clamp(14px,1.35vw,21px)] ${TEXTO_SM} font-semibold text-gray-700 transition-colors hover:border-green-600 hover:text-green-600`}
                        >
                            Criar Conta
                        </BotaoHeader>

                        {/* Botão logar */}
                        <BotaoHeader
                            onClick={onAbrirLogin}
                            className={`flex h-[clamp(34px,2.5vw,40px)] shrink-0 items-center justify-center rounded-full bg-[#724BC2] px-[clamp(16px,1.45vw,23px)] ${TEXTO_SM} font-semibold text-white transition hover:bg-purple-700`}
                        >
                            Logar
                        </BotaoHeader>
                    </div>
                )}
            </div>
        </header>
    );
}
