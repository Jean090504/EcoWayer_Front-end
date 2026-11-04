
import { useEffect, useState } from "react";

import logo from "../../assets/icons/logo/Ecomarket.png";
import lupa from "../../assets/icons/icones/lupa.png";
import filtro from "../../assets/icons/icones/filtro.png";
import carta from "../../assets/icons/icones/carta.png";
import carteira from "../../assets/icons/icones/carteira.png";
import chat from "../../assets/icons/icones/menssagem.png";
import perfil from "../../assets/icons/icones/foto.png";

export default function Header({
    onAbrirCriarConta,
    onAbrirLogin,
    usuario
}) {

    // Controla a abertura do menu de localização.
    const [mostrarFiltro, setMostrarFiltro] = useState(false);

    // Armazena os estados retornados pela API do IBGE.
    const [estados, setEstados] = useState([]);

    // Armazena o código IBGE do estado selecionado.
    const [ufSelecionada, setUfSelecionada] = useState("");

    // Armazena os municípios retornados pela API.
    const [cidades, setCidades] = useState([]);

    // Armazena o código IBGE do município selecionado.
    const [cidadeSelecionada, setCidadeSelecionada] = useState("");

    // Controla o carregamento dos estados.
    const [carregandoEstados, setCarregandoEstados] = useState(false);

    // Controla o carregamento das cidades.
    const [carregandoCidades, setCarregandoCidades] = useState(false);

    // Armazena possíveis erros nas consultas.
    const [erroEstados, setErroEstados] = useState(false);
    const [erroCidades, setErroCidades] = useState(false);


    // Busca todos os estados diretamente na API do IBGE.
    useEffect(() => {

        const controller = new AbortController();

        async function buscarEstados() {

            setCarregandoEstados(true);
            setErroEstados(false);

            try {
                const resposta = await fetch(
                    "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome",
                    { signal: controller.signal }
                );

                if (!resposta.ok) {
                    throw new Error("Não foi possível carregar os estados.");
                }

                const dados = await resposta.json();

                setEstados(dados);

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


    // Busca as cidades sempre que um estado é selecionado.
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
                    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSelecionada}/municipios?orderBy=nome`,
                    { signal: controller.signal }
                );

                if (!resposta.ok) {
                    throw new Error("Não foi possível carregar as cidades.");
                }

                const dados = await resposta.json();

                setCidades(dados);

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


    // Limpa a localização selecionada.
    function limparLocalizacao() {
        setUfSelecionada("");
        setCidadeSelecionada("");
        setCidades([]);
    }


    return (
        <header className="mt-3 h-[72px] w-full border-b border-gray-100 bg-white">

            {/* Contêiner dos elementos */}
            <div className="mx-auto flex h-full w-full max-w-[1360px] items-center justify-between gap-5 px-6">

                {/* Logo */}
                <div className="flex shrink-0 items-center">
                    <img
                        src={logo}
                        alt="EcoMarket"
                        className="h-5 w-auto object-contain"
                    />
                </div>


                {/* Campo de pesquisa */}
                <div className="relative flex h-11 min-w-[220px] max-w-[560px] flex-1 items-center rounded-xl border border-gray-200 bg-white px-3 shadow-sm">

                    <input
                        type="text"
                        placeholder="Buscar ponto de coleta, bairro..."
                        className="min-w-0 flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-400"
                    />

                    <img
                        src={lupa}
                        alt="Pesquisar"
                        className="ml-3 h-4 w-4 shrink-0 object-contain"
                    />


                    <div className="ml-3 flex h-7 shrink-0 items-center border-l border-gray-200 pl-2">

                        {/* Botão do filtro */}
                        <button
                            type="button"
                            aria-label="Filtros de localização"
                            aria-expanded={mostrarFiltro}
                            onClick={() => setMostrarFiltro(!mostrarFiltro)}
                            className="flex items-center justify-center rounded-md p-1 transition hover:bg-gray-100"
                        >
                            <img
                                src={filtro}
                                alt=""
                                className="h-4 w-4 object-contain"
                            />
                        </button>

                    </div>


                    {/* Menu suspenso de localização */}
                    {mostrarFiltro && (

                        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">

                            <div className="mb-3 flex items-center justify-between">

                                <h3 className="text-sm font-semibold text-gray-800">
                                    Filtrar localização
                                </h3>

                                <button
                                    type="button"
                                    onClick={() => setMostrarFiltro(false)}
                                    className="text-lg text-gray-400 transition hover:text-gray-700"
                                    aria-label="Fechar filtro"
                                >
                                    ×
                                </button>

                            </div>


                            {/* Seleção do estado */}
                            <label className="mb-1 block text-xs font-semibold text-gray-600">
                                Estado (UF)
                            </label>

                            <select
                                value={ufSelecionada}
                                onChange={(e) => {
                                    setUfSelecionada(e.target.value);
                                    setCidadeSelecionada("");
                                }}
                                disabled={carregandoEstados || erroEstados}
                                className="mb-4 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#4CAF50] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                            >

                                <option value="">
                                    {carregandoEstados
                                        ? "Carregando estados..."
                                        : erroEstados
                                            ? "Erro ao carregar estados"
                                            : "Selecione um estado"}
                                </option>

                                {estados.map((estado) => (

                                    <option
                                        key={estado.id}
                                        value={estado.id}
                                    >
                                        {estado.nome} ({estado.sigla})
                                    </option>

                                ))}

                            </select>


                            {/* Seleção da cidade */}
                            <label className="mb-1 block text-xs font-semibold text-gray-600">
                                Cidade
                            </label>

                            <select
                                value={cidadeSelecionada}
                                onChange={(e) => setCidadeSelecionada(e.target.value)}
                                disabled={!ufSelecionada || carregandoCidades || erroCidades || cidades.length === 0}
                                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#4CAF50] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
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

                                    <option
                                        key={cidade.id}
                                        value={cidade.id}
                                    >
                                        {cidade.nome}
                                    </option>

                                ))}

                            </select>


                            {/* Limpar filtros */}
                            <button
                                type="button"
                                onClick={limparLocalizacao}
                                className="mt-4 w-full rounded-lg py-2 text-xs font-semibold text-[#4CAF50] transition hover:bg-green-50"
                            >
                                Limpar localização
                            </button>

                        </div>

                    )}

                </div>


                {/* Navegação */}
                <nav className="flex shrink-0 items-center gap-5">

                    {/* Meus anúncios */}
                    <button
                        type="button"
                        className="flex items-center gap-1.5 whitespace-nowrap"
                    >
                        <img
                            src={carta}
                            alt=""
                            className="h-7 w-6 object-contain"
                        />

                        <span className="text-sm font-medium text-gray-600">
                            Meus anúncios
                        </span>
                    </button>


                    {/* Carteira */}
                    <button
                        type="button"
                        className="flex items-center gap-1.5 whitespace-nowrap"
                    >
                        <img
                            src={carteira}
                            alt=""
                            className="h-5 w-5 object-contain"
                        />

                        <span className="text-sm font-medium text-gray-600">
                            Carteira
                        </span>
                    </button>


                    {/* Chat */}
                    <button
                        type="button"
                        className="flex items-center gap-1.5 whitespace-nowrap"
                    >
                        <img
                            src={chat}
                            alt=""
                            className="h-6 w-6 object-contain"
                        />

                        <span className="text-sm font-medium text-gray-600">
                            Chat
                        </span>
                    </button>

                </nav>


                {/* Renderização condicional: usuário logado ou deslogado */}
                {usuario ? (

                    <div className="flex shrink-0 items-center gap-3">

                        {/* Perfil do usuário */}
                        <div className="flex shrink-0 items-center gap-2">

                            <img
                                src={usuario.foto || perfil}
                                alt="Foto de perfil"
                                className="h-10 w-10 rounded-full object-cover"
                            />

                            <span className="whitespace-nowrap text-sm font-semibold text-black">
                                {usuario.nome}
                            </span>

                        </div>


                        {/* Botão anunciar */}
                        <button
                            type="button"
                            className="flex h-10 shrink-0 items-center justify-center rounded-full bg-[#724BC2] px-10 text-sm font-semibold text-white transition hover:bg-purple-700"
                        >
                            Anunciar
                        </button>

                    </div>

                ) : (

                    <div className="flex shrink-0 items-center gap-3">

                        {/* Botão criar conta */}
                        <button
                            type="button"
                            onClick={onAbrirCriarConta}
                            className="flex h-9 items-center justify-center rounded-full border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-700 transition-colors hover:border-green-600 hover:text-green-600"
                        >
                            Criar Conta
                        </button>


                        {/* Botão login */}
                        <button
                            type="button"
                            onClick={onAbrirLogin}
                            className="flex h-9 items-center justify-center rounded-full bg-[#724BC2] px-6 text-sm font-semibold text-white transition hover:bg-purple-700"
                        >
                            Logar
                        </button>

                    </div>

                )}

            </div>

        </header>
    );
}
