import { useState } from "react";

import {
    Bike,
    Bookmark,
    ChevronRight,
    Layers,
    LocateFixed,
    MapPin,
    Minus,
    Navigation,
    Plus,
    Recycle,
    Smartphone,
    Star,
} from "lucide-react";
import HeaderMapa from "../components/layout/headerMapa.jsx";
import ModalFiltroMapa, {FILTROS_PADRAO, contarFiltrosAtivos,} from "../components/modal/modalFiltroMapa.jsx";

// ---- Dados de exemplo (trocar pela API / mock da tela depois) ----
const PONTO_SELECIONADO = {
    id: "EP-049",
    nome: "EcoPonto Central Pinheiros",
    aberto: true,
    fechaAs: "18:00",
    nota: 4.8,
    avaliacoes: 142,
    distanciaKm: 1.2,
    minutosBike: 8,
    endereco: "Rua Gilberto Sabino, 180 — Pinheiros",
    complemento: "São Paulo - SP, 05425-020 - Acesso ao lado da Estação Pinheiros",
    materiais: [
        { rotulo: "Plásticos (PET, PEAD)", cor: "#10B981" },
        { rotulo: "Papelão / Papel", cor: "#F59E0B" },
        { rotulo: "Alumínio & Latas", cor: "#64748B" },
        { rotulo: "Vidro", cor: "#06B6D4" },
        { rotulo: "Eletrônicos Leves", cor: "#8B5CF6" },
    ],
};

const PONTOS_PROXIMOS = [
    {
        id: "EP-051",
        nome: "Estação Ecológica Vila Madalena",
        detalhe: "2.4 km • Aceita baterias, óleo vegetal",
        Icone: Recycle,
        corFundo: "bg-[#4DBB5A]",
    },
    {
        id: "EP-063",
        nome: "Ponto Verde Butantã",
        detalhe: "3.1 km • Eletrônicos pesados, sucata",
        Icone: Smartphone,
        corFundo: "bg-[#724BC2]",
    },
];

const LEGENDA_MAPA = [
    { rotulo: "Ponto Municipal", cor: "#4DBB5A" },
    { rotulo: "Coleta Especial", cor: "#724BC2" },
    { rotulo: "Cooperativa Parceira", cor: "#64748B" },
];

function Estatistica({ icone, valor, rotulo, corValor = "text-[#3E4A3D]" }) {
    return (
        <div className="flex flex-col items-center gap-0.5 text-xs">
            <span className={`flex items-center gap-1 font-medium ${corValor}`}>
                {icone}
                {valor}
            </span>
            <span className="text-[#555F6F]">{rotulo}</span>
        </div>
    );
}

export default function MapaEcoPontos() {
    const [busca, setBusca] = useState("Pinheiros, São Paulo");
    const [categoria, setCategoria] = useState("todos");
    const [filtrosAbertos, setFiltrosAbertos] = useState(false);
    const [filtros, setFiltros] = useState(FILTROS_PADRAO); // filtros já aplicados
    const [salvo, setSalvo] = useState(false);

    const ponto = PONTO_SELECIONADO;

    return (
        <div className="bg-[#F2F4F6]">
            {/* Pesquisa, filtros e categorias */}
            <HeaderMapa
                busca={busca}
                onBuscaChange={setBusca}
                categoriaAtiva={categoria}
                onCategoriaChange={setCategoria}
                raioKm={filtros.raioKm}
                onRaioClick={() => setFiltrosAbertos(true)}
                temFiltrosAtivos={contarFiltrosAtivos(filtros) > 0}
                filtrosAbertos={filtrosAbertos}
                onToggleFiltros={() => setFiltrosAbertos((v) => !v)}
            />

            <main className="grid grid-cols-1 gap-[clamp(16px,1.6vw,24px)] px-[clamp(12px,5vw,110px)] py-[clamp(16px,1.6vw,24px)] lg:grid-cols-[minmax(0,2fr)_minmax(340px,1fr)]">
                {/* ---------- MAPA ---------- */}
                <section
                    aria-label="Mapa de EcoPontos"
                    className="relative h-[60vh] min-h-[420px] overflow-hidden rounded-2xl border border-[#724BC2]/50 bg-[#E9EEF2] lg:h-[calc(100vh-15rem)] lg:min-h-[520px] lg:max-h-[760px]"
                >
                    {/* TODO: renderizar aqui o mapa real (Google Maps / Leaflet).
                        Os overlays abaixo ficam por cima dele (z-10). */}
                    <div className="absolute inset-0" id="mapa-container" />

                    {/* Badge superior */}
                    <div className="absolute left-3.5 top-3.5 z-10 flex w-[clamp(240px,55%,386px)] items-center gap-3 justify-between rounded-xl bg-white/95 px-3.5 py-2.5 text-xs shadow-sm">
                        <span className="flex items-center gap-2 font-medium text-[#191C1E]">
                            <span className="h-2 w-2 rounded-full bg-[#4DBB5A]" />
                            12 EcoPontos abertos nesta área
                        </span>
                        <span className="text-[#555F6F]">GPS Ativo</span>
                    </div>

                    {/* Legenda */}
                    <ul className="absolute bottom-3.5 left-3.5 z-10 flex max-w-[calc(100%-4.5rem)] flex-wrap items-center gap-x-4 gap-y-1 rounded-xl bg-white/95 px-3.5 py-2.5 text-xs text-[#191C1E] shadow-sm">
                        {LEGENDA_MAPA.map((item) => (
                            <li key={item.rotulo} className="flex items-center gap-2">
                                <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: item.cor }}
                                />
                                {item.rotulo}
                            </li>
                        ))}
                    </ul>

                    {/* Controles do mapa */}
                    <div className="absolute bottom-3.5 right-3.5 z-10 flex flex-col items-end gap-2">
                        <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm">
                            <button
                                type="button"
                                aria-label="Aproximar"
                                className="flex h-9 w-9 items-center justify-center text-[#191C1E] hover:bg-gray-50"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                aria-label="Afastar"
                                className="flex h-9 w-9 items-center justify-center border-t border-gray-100 text-[#191C1E] hover:bg-gray-50"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm">
                            <button
                                type="button"
                                aria-label="Minha localização"
                                className="flex h-9 w-9 items-center justify-center text-[#4DBB5A] hover:bg-gray-50"
                            >
                                <LocateFixed className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                aria-label="Camadas do mapa"
                                className="flex h-9 w-9 items-center justify-center border-t border-gray-100 text-[#191C1E] hover:bg-gray-50"
                            >
                                <Layers className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* ---------- PAINEL LATERAL ---------- */}
                <aside className="flex flex-col gap-4">
                    {/* Detalhe do ponto selecionado */}
                    <article className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                                {ponto.aberto && (
                                    <span className="flex items-center gap-1.5 rounded-full bg-[#4DBB5A] px-2.5 py-0.5 text-[11px] font-medium text-white">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                        Aberto agora • Fecha às {ponto.fechaAs}
                                    </span>
                                )}
                                <span className="text-[11px] text-[#555F6F]">#{ponto.id}</span>
                            </div>

                            <button
                                type="button"
                                aria-label={salvo ? "Remover dos salvos" : "Salvar ponto"}
                                aria-pressed={salvo}
                                onClick={() => setSalvo((v) => !v)}
                                className="text-[#191C1E] transition hover:text-[#724BC2]"
                            >
                                <Bookmark className="h-5 w-5" fill={salvo ? "currentColor" : "none"} />
                            </button>
                        </div>

                        <h2 className="mt-3 text-lg font-semibold text-[#191C1E] sm:text-xl">{ponto.nome}</h2>

                        <div className="mt-6 grid grid-cols-3">
                            <Estatistica
                                icone={<Star className="h-3 w-3 fill-[#724BC2] text-[#724BC2]" />}
                                valor={ponto.nota}
                                rotulo={`${ponto.avaliacoes} reviews`}
                                corValor="text-[#6C46BE]"
                            />
                            <Estatistica
                                icone={<Navigation className="h-3 w-3" />}
                                valor={`${ponto.distanciaKm} km`}
                                rotulo="Distância"
                                corValor="text-[#4DBB5A]"
                            />
                            <Estatistica
                                icone={<Bike className="h-3 w-3" />}
                                valor={`${ponto.minutosBike} min`}
                                rotulo="Tempo de bike"
                                corValor="text-[#724BC2]"
                            />
                        </div>

                        <div className="mt-8 flex gap-2.5">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#724BC2]" />
                            <div className="text-xs text-[#555F6F]">
                                <p className="text-sm font-medium text-[#724BC2]">{ponto.endereco}</p>
                                <p className="mt-1">{ponto.complemento}</p>
                            </div>
                        </div>

                        <h3 className="mt-8 text-sm font-semibold text-[#191C1E]">Materiais Aceitos</h3>
                        <ul className="mt-3 flex flex-wrap gap-2">
                            {ponto.materiais.map((m) => (
                                <li
                                    key={m.rotulo}
                                    className="flex items-center gap-2 rounded-full bg-[#FAF8FF] px-3 py-1.5 text-xs text-[#191C1E]"
                                >
                                    <span
                                        className="h-1.5 w-1.5 rounded-full"
                                        style={{ backgroundColor: m.cor }}
                                    />
                                    {m.rotulo}
                                </li>
                            ))}
                        </ul>
                    </article>

                    {/* Outros pontos próximos */}
                    <section aria-label="Outros pontos próximos">
                        <div className="mb-3 flex items-center justify-between px-1 text-xs">
                            <h3 className="font-semibold text-[#191C1E]">Outros pontos próximos</h3>
                            <button type="button" className="text-[#555F6F] hover:text-[#724BC2]">
                                Ver todos (12)
                            </button>
                        </div>

                        <ul className="flex flex-col gap-3">
                            {PONTOS_PROXIMOS.map(({ id, nome, detalhe, Icone, corFundo }) => (
                                <li key={id}>
                                    <button
                                        type="button"
                                        className="flex w-full items-center gap-4 rounded-2xl bg-white p-3 text-left shadow-sm transition hover:shadow-md"
                                    >
                                        <span
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${corFundo}`}
                                        >
                                            <Icone className="h-5 w-5" />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-xs font-semibold text-[#191C1E]">
                                                {nome}
                                            </span>
                                            <span className="block truncate text-xs text-[#555F6F]">
                                                {detalhe}
                                            </span>
                                        </span>
                                        <ChevronRight className="h-4 w-4 shrink-0 text-[#555F6F]" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                </aside>
            </main>

            {/* Painel de filtros (montado só quando aberto, então o rascunho sempre começa dos filtros aplicados) */}
            {filtrosAbertos && (
                <ModalFiltroMapa
                    filtrosIniciais={filtros}
                    totalPontos={12}
                    onAplicar={setFiltros}
                    onFechar={() => setFiltrosAbertos(false)}
                />
            )}
        </div>
    );
}