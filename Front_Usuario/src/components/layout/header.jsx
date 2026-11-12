import { useEffect, useState } from "react";
import logo from "../../assets/icons/logo/ecomarket.svg";
import lupa from "../../assets/icons/icones/lupa.png";
import filtro from "../../assets/icons/icones/filtro.png";
import carta from "../../assets/icons/icones/carta.png";
import carteira from "../../assets/icons/icones/carteira.png";
import chat from "../../assets/icons/icones/menssagem.png";
import perfil from "../../assets/icons/icones/foto.png";

function DropdownLocalidade({ label, value, placeholder, options, onChange, disabled = false, mensagemVazia }) {
    const [aberto, setAberto] = useState(false);
    const [busca, setBusca] = useState("");
    const atual = options.find((option) => String(option.value) === String(value));
    const filtradas = options.filter((option) => option.label.toLowerCase().includes(busca.toLowerCase()));

    function selecionar(option) {
        onChange(option.value);
        setBusca("");
        setAberto(false);
    }

    return (
        <div className="relative mb-4">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</label>
            <button type="button" disabled={disabled} onClick={() => setAberto((estado) => !estado)} className={`flex h-10 w-full items-center justify-between rounded-lg border px-3 text-left text-sm transition ${aberto ? "border-[#4CAF50] ring-2 ring-[#4CAF50]/15" : "border-slate-200"} ${disabled ? "cursor-not-allowed bg-slate-50 text-slate-400" : "bg-white text-slate-700 hover:border-[#61B86B]"}`}>
                <span className={atual ? "truncate" : "truncate text-slate-400"}>{atual?.label || placeholder}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-4 w-4 shrink-0 text-slate-400 transition ${aberto ? "rotate-180 text-[#4CAF50]" : ""}`}><path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            {aberto && !disabled && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[60] overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                    <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 ring-1 ring-slate-100 focus-within:ring-[#61B86B]/40">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-slate-400"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
                        <input autoFocus value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar na lista..." className="h-9 min-w-0 flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400" />
                    </div>
                    <div className="mt-2 max-h-52 overflow-y-auto pr-1 [scrollbar-color:#94a3b8_transparent] [scrollbar-width:thin]">
                        {filtradas.length ? filtradas.map((option) => (
                            <button type="button" key={option.value} onClick={() => selecionar(option)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition ${String(option.value) === String(value) ? "bg-green-50 font-bold text-[#278d3a]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                                <span>{option.label}</span>
                                {String(option.value) === String(value) && <span className="text-[#4CAF50]">✓</span>}
                            </button>
                        )) : <p className="px-3 py-4 text-center text-xs text-slate-400">{mensagemVazia || "Nenhum resultado encontrado"}</p>}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Header({ onAbrirCriarConta, onAbrirLogin, usuario, busca = "", onBusca }) {
    const [mostrarFiltro, setMostrarFiltro] = useState(false);
    const [estados, setEstados] = useState([]);
    const [ufSelecionada, setUfSelecionada] = useState("");
    const [cidades, setCidades] = useState([]);
    const [cidadeSelecionada, setCidadeSelecionada] = useState("");
    const [carregandoEstados, setCarregandoEstados] = useState(false);
    const [carregandoCidades, setCarregandoCidades] = useState(false);
    const [erroEstados, setErroEstados] = useState(false);
    const [erroCidades, setErroCidades] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        setCarregandoEstados(true);
        fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome", { signal: controller.signal })
            .then((resposta) => { if (!resposta.ok) throw new Error("Falha"); return resposta.json(); })
            .then(setEstados)
            .catch((error) => { if (error.name !== "AbortError") setErroEstados(true); })
            .finally(() => { if (!controller.signal.aborted) setCarregandoEstados(false); });
        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!ufSelecionada) { setCidades([]); setCidadeSelecionada(""); return undefined; }
        const controller = new AbortController();
        setCarregandoCidades(true);
        setErroCidades(false);
        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSelecionada}/municipios?orderBy=nome`, { signal: controller.signal })
            .then((resposta) => { if (!resposta.ok) throw new Error("Falha"); return resposta.json(); })
            .then(setCidades)
            .catch((error) => { if (error.name !== "AbortError") setErroCidades(true); })
            .finally(() => { if (!controller.signal.aborted) setCarregandoCidades(false); });
        return () => controller.abort();
    }, [ufSelecionada]);

    function limparLocalizacao() {
        setUfSelecionada("");
        setCidadeSelecionada("");
        setCidades([]);
    }

    return (
        <header style={{ height: "128px", minHeight: "128px" }} className="mt-0 w-full border-0 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.06)]">
            <div className="mx-auto flex h-full w-full max-w-[1800px] items-center justify-between gap-4 px-5 sm:gap-6 sm:px-8 xl:px-12">
                <div className="flex h-12 w-[220px] shrink-0 items-center"><img src={logo} alt="EcoMarket" className="h-10 w-[220px] object-contain" /></div>

                <div className="relative flex h-12 min-w-[260px] max-w-[800px] flex-[1.5] items-center rounded-xl border border-gray-200 bg-white px-4 shadow-sm transition focus-within:border-[#61B86B] focus-within:shadow-md">
                    <input type="text" placeholder="Buscar anúncios, produtos ou materiais..." value={busca} onChange={(event) => onBusca?.(event.target.value)} className="min-w-0 flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-400" />
                    <img src={lupa} alt="Pesquisar" className="ml-3 h-4 w-4 shrink-0 object-contain" />
                    <div className="ml-3 flex h-7 shrink-0 items-center border-l border-gray-200 pl-2">
                        <button type="button" aria-label="Filtros de localização" aria-expanded={mostrarFiltro} onClick={() => setMostrarFiltro((aberto) => !aberto)} className={`flex items-center justify-center rounded-md p-1 transition ${mostrarFiltro ? "bg-green-50" : "hover:bg-gray-100"}`}><img src={filtro} alt="" className="h-4 w-4 object-contain" /></button>
                    </div>
                    {mostrarFiltro && (
                        <div className="absolute right-0 top-full z-50 mt-2 w-[min(330px,calc(100vw-32px))] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10">
                            <div className="mb-4 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#61B86B]">Localização</p><h3 className="mt-1 text-base font-bold text-slate-800">Filtrar por região</h3></div><button type="button" onClick={() => setMostrarFiltro(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Fechar filtro">×</button></div>
                            <DropdownLocalidade label="Estado (UF)" value={ufSelecionada} placeholder={carregandoEstados ? "Carregando estados..." : erroEstados ? "Erro ao carregar estados" : "Selecione um estado"} options={estados.map((estado) => ({ value: estado.id, label: `${estado.nome} (${estado.sigla})` }))} disabled={carregandoEstados || erroEstados} mensagemVazia="Estado não encontrado" onChange={(valor) => { setUfSelecionada(valor); setCidadeSelecionada(""); }} />
                            <DropdownLocalidade label="Cidade" value={cidadeSelecionada} placeholder={!ufSelecionada ? "Selecione primeiro o estado" : carregandoCidades ? "Carregando cidades..." : erroCidades ? "Erro ao carregar cidades" : "Selecione uma cidade"} options={cidades.map((cidade) => ({ value: cidade.id, label: cidade.nome }))} disabled={!ufSelecionada || carregandoCidades || erroCidades || cidades.length === 0} mensagemVazia="Cidade não encontrada" onChange={setCidadeSelecionada} />
                            <button type="button" onClick={limparLocalizacao} className="w-full rounded-xl border border-green-100 bg-green-50 py-2.5 text-xs font-bold text-[#278d3a] transition hover:bg-green-100">Limpar localização</button>
                        </div>
                    )}
                </div>

                <nav style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "22px" }} className="hidden min-w-max shrink-0 lg:flex">
                    <button type="button" style={{ display: "inline-flex", flexDirection: "row", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }} className="shrink-0 text-[15px] font-medium text-gray-600"><img src={carta} alt="" className="h-7 w-6 shrink-0 object-contain" /><span>Meus anúncios</span></button>
                    <button type="button" style={{ display: "inline-flex", flexDirection: "row", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }} className="shrink-0 text-[15px] font-medium text-gray-600"><img src={carteira} alt="" className="h-6 w-6 shrink-0 object-contain" /><span>Carteira</span></button>
                    <button type="button" style={{ display: "inline-flex", flexDirection: "row", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }} className="shrink-0 text-[15px] font-medium text-gray-600"><img src={chat} alt="" className="h-6 w-6 shrink-0 object-contain" /><span>Chat</span></button>
                </nav>

                {usuario ? <div className="flex shrink-0 items-center gap-3"><div className="hidden items-center gap-2 xl:flex"><img src={usuario.foto || perfil} alt="Foto de perfil" referrerPolicy="no-referrer" className="h-9 w-9 rounded-full object-cover" /><span className="max-w-28 truncate text-sm font-semibold text-black">{usuario.nome}</span></div><button type="button" className="flex h-10 shrink-0 items-center justify-center rounded-full bg-[#724BC2] px-6 text-sm font-semibold text-white transition hover:bg-purple-700">Anunciar</button></div> : <div className="flex shrink-0 items-center gap-3"><button type="button" onClick={onAbrirCriarConta} className="hidden h-9 items-center justify-center rounded-full border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:border-green-600 hover:text-green-600 sm:flex">Criar Conta</button><button type="button" onClick={onAbrirLogin} className="flex h-9 items-center justify-center rounded-full bg-[#724BC2] px-5 text-sm font-semibold text-white transition hover:bg-purple-700">Logar</button></div>}
            </div>
        </header>
    );
}
