import { useEffect, useState } from "react";
import { Search, MapPin, Mail, Wallet, MessageSquare } from "lucide-react";

import ItemNavegacao from "../ui/itemNavegacao.jsx"
import BotaoHeader from "../ui/botao.jsx"

import perfil from "../../assets/icons/icones/foto.png";

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------
const IBGE_API = "https://servicodados.ibge.gov.br/api/v1/localidades";

// Tamanhos responsivos (base: 1366px). Precisam estar escritos por inteiro
// para o Tailwind enxergar as classes.
const TEXTO_XS = "text-[length:clamp(12px,0.88vw,15px)]";
const TEXTO_SM = "text-[length:clamp(14px,1.025vw,18px)]";
const ICONE_NAV = "h-[clamp(20px,1.46vw,28px)] w-[clamp(20px,1.46vw,28px)]";

// Espaçamentos que crescem só acima de 1366px (20px em 1366, ~45px em 1920).
const GAP_GRUPOS = "gap-[clamp(20px,calc(20px_+_(100vw_-_1366px)*0.045),52px)]";
const GAP_NAV = "gap-[clamp(20px,calc(20px_+_(100vw_-_1366px)*0.05),60px)]";
const GAP_ITEM = "gap-[clamp(12px,calc(12px_+_(100vw_-_1366px)*0.02),24px)]";

export default function Header({ onAbrirCriarConta, onAbrirLogin, usuario }) {
    // -----------------------------------------------------------------------
    // Estados: interface
    // -----------------------------------------------------------------------
    const [mostrarFiltro, setMostrarFiltro] = useState(false);

    // -----------------------------------------------------------------------
    // Estados: estados (UF)
    // -----------------------------------------------------------------------
    const [estados, setEstados] = useState([]);
    const [ufSelecionada, setUfSelecionada] = useState("");
    const [carregandoEstados, setCarregandoEstados] = useState(false);
    const [erroEstados, setErroEstados] = useState(false);

    // -----------------------------------------------------------------------
    // Estados: cidades
    // -----------------------------------------------------------------------
    const [cidades, setCidades] = useState([]);
    const [cidadeSelecionada, setCidadeSelecionada] = useState("");
    const [carregandoCidades, setCarregandoCidades] = useState(false);
    const [erroCidades, setErroCidades] = useState(false);

    // -----------------------------------------------------------------------
    // Efeitos
    // -----------------------------------------------------------------------
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
    // Funções
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
    // Render
    // -----------------------------------------------------------------------
    return (
        <header className="mt-3 h-[clamp(72px,5.27vw,104px)] w-full border-b border-gray-100 bg-white">
            {/* Contêiner dos elementos */}
            <div className={`mx-auto flex h-full w-full max-w-[clamp(1360px,99.5vw,1800px)] items-center justify-between ${GAP_GRUPOS} px-[clamp(24px,1.76vw,40px)]`}>

                {/* Logo */}
                <div className="flex shrink-0 items-center">
                    <p className="font-bold text-[clamp(25px,2vw,32px)] text-[#4CAF50]">Eco<span className="text-[#724BC2]">market</span></p>
                </div>

                {/* Campo de pesquisa */}
                <div className="relative flex h-[clamp(44px,3.22vw,60px)] min-w-[220px] max-w-[clamp(560px,41vw,820px)] flex-1 items-center rounded-xl border border-gray-200 bg-white px-[clamp(12px,0.88vw,18px)] shadow-sm">
                    <input
                        type="text"
                        placeholder="Buscar ponto de coleta, bairro..."
                        className={`min-w-0 flex-1 ${TEXTO_SM} text-gray-700 outline-none placeholder:text-gray-400`}
                    />
                    <Search
                    size = {25}
                    className = "ml-3 h-[clamp(16px,1.17vw,24px)] w-[clamp(16px,1.17vw,24px)] shrink-0 text-[#8C8C8C]"
                    />

                    <div className="ml-3 flex h-[clamp(28px,2.05vw,38px)] shrink-0 items-center border-l border-gray-200 pl-2">
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
                        <div className="absolute right-0 top-full z-50 mt-2 w-[clamp(256px,18.7vw,360px)] rounded-xl border border-gray-200 bg-white p-[clamp(16px,1.17vw,24px)] shadow-lg">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className={`${TEXTO_SM} font-semibold text-gray-800`}>
                                    Filtrar localização
                                </h3>
                                <BotaoHeader
                                    onClick = {() => setMostrarFiltro(false)}
                                    className = "text-[length:clamp(18px,1.32vw,24px)] text-gray-400 transition hover:text-gray-700"
                                    aria-label = "Fechar filtro"
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
                                className={`mb-4 h-[clamp(40px,2.93vw,54px)] w-full rounded-lg border border-gray-200 bg-white px-3 ${TEXTO_SM} text-gray-700 outline-none focus:border-[#4CAF50] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400`}
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
                                className={`h-[clamp(40px,2.93vw,54px)] w-full rounded-lg border border-gray-200 bg-white px-3 ${TEXTO_SM} text-gray-700 outline-none focus:border-[#4CAF50] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400`}
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
                <nav className={`flex shrink-0 items-center ${GAP_NAV}`}>
                    <ItemNavegacao Icone = {Mail} texto = "Meus anúncios" />
                    <ItemNavegacao Icone = {Wallet} texto = "Carteira" />
                    <ItemNavegacao Icone = {MessageSquare} texto = "Chat" />
                </nav>

                {/* Renderização condicional: usuário logado ou deslogado */}
                {usuario ? (
                    <div className={`flex shrink-0 items-center ${GAP_ITEM}`}>
                        {/* Perfil do usuário */}
                        <div className={`flex shrink-0 items-center ${GAP_ITEM}`}>
                            <img
                                src={usuario.foto || perfil}
                                alt="Foto de perfil"
                                className="h-[clamp(40px,2.93vw,56px)] w-[clamp(40px,2.93vw,56px)] rounded-full object-cover"
                            />
                            <span className={`whitespace-nowrap ${TEXTO_SM} font-semibold text-black`}>
                                {usuario.nome}
                            </span>
                        </div>

                        {/* Botão anunciar */}
                        <BotaoHeader
                            className = {`flex h-[clamp(40px,2.93vw,56px)] shrink-0 items-center justify-center rounded-full bg-[#724BC2] px-[clamp(40px,2.93vw,56px)] ${TEXTO_SM} font-semibold text-white transition hover:bg-purple-700`}
                        >
                            Anunciar
                        </BotaoHeader>
                    </div>
                ) : (
                    <div className="flex shrink-0 items-center gap-3">
                        {/* Botão criar conta */}
                        <div className="flex shrink-0 items-center gap-3">
                            <BotaoHeader
                                onClick={onAbrirCriarConta}
                                className={`flex h-[clamp(36px,2.64vw,50px)] items-center justify-center rounded-full border border-gray-300 bg-white px-[clamp(24px,1.76vw,34px)] ${TEXTO_SM} font-semibold text-gray-700 transition-colors hover:border-green-600 hover:text-green-600`}
                            >
                                Criar Conta
                            </BotaoHeader>

                            <BotaoHeader
                                onClick={onAbrirLogin}
                                className={`flex h-[clamp(36px,2.64vw,50px)] items-center justify-center rounded-full bg-[#724BC2] px-[clamp(24px,1.76vw,34px)] ${TEXTO_SM} font-semibold text-white transition hover:bg-purple-700`}
                            >
                                Logar
                            </BotaoHeader>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}