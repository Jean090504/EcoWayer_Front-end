import { Search, SlidersHorizontal } from "lucide-react";

// Categorias exibidas nos chips (a cor vira o "ponto" colorido de cada chip)
export const CATEGORIAS_MAPA = [
    { id: "todos", rotulo: "Todos", total: 48 },
    { id: "plasticos", rotulo: "Plásticos (PET/PEAD)", total: 32, cor: "#10B981" },
    { id: "papel", rotulo: "Papelão & Papel", total: 29, cor: "#F59E0B" },
    { id: "vidro", rotulo: "Vidro", total: 18, cor: "#06B6D4" },
    { id: "eletronicos", rotulo: "Eletrônicos Leves", total: 14, cor: "#8B5CF6" },
    { id: "metais", rotulo: "Metais & Latas", total: 27, cor: "#64748B" },
    { id: "baterias", rotulo: "Baterias & Pilhas", total: 11, cor: "#EF4444" },
];

export default function HeaderMapa({
    busca = "",
    onBuscaChange,
    categoriaAtiva = "todos",
    onCategoriaChange,
    raioKm = 5,
    onRaioClick,
    temFiltrosAtivos = false,
    filtrosAbertos = false,
    onToggleFiltros,
}) {
    return (
        // container principal
        <header className="border-b border-gray-100 bg-white px-[clamp(16px,5vw,78px)] pb-4 pt-[clamp(16px,2vw,30px)]">
            {/* caixa 01: campo de pesquisa + botão de filtros */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex h-10 min-w-0 max-w-[578px] flex-1 items-center gap-3 rounded-xl bg-[#FAF8FF] px-3.5">
                    <Search className="h-4 w-4 shrink-0 text-[#555F6F]" aria-hidden="true" />
                    <input
                        type="text"
                        value={busca}
                        onChange={(e) => onBuscaChange?.(e.target.value)}
                        placeholder="Buscar ponto de coleta, bairro..."
                        aria-label="Buscar ponto de coleta ou bairro"
                        className="min-w-0 flex-1 bg-transparent text-sm text-[#191C1E] outline-none placeholder:text-gray-400"
                    />
                </div>

                <button
                    type="button"
                    aria-label="Filtros de localização"
                    aria-haspopup="dialog"
                    aria-expanded={filtrosAbertos}
                    onClick={onToggleFiltros}
                    className="flex h-[31px] shrink-0 items-center gap-2 rounded-xl bg-[#724BC2] px-4 text-sm font-medium text-white transition hover:bg-[#6340AE]"
                >
                    <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Filtros</span>
                    {temFiltrosAtivos && (
                        <span className="h-2 w-2 rounded-full bg-white" aria-label="Há filtros ativos" />
                    )}
                </button>
            </div>

            {/* caixa 02: categorias disponíveis + raio de busca */}
            <div className="mt-5 flex items-center gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {CATEGORIAS_MAPA.map((cat) => {
                    const ativa = cat.id === categoriaAtiva;

                    return (
                        <button
                            key={cat.id}
                            type="button"
                            aria-pressed={ativa}
                            onClick={() => onCategoriaChange?.(cat.id)}
                            className={`flex h-[26px] shrink-0 items-center gap-2 rounded-full px-3.5 text-xs font-medium transition ${
                                ativa
                                    ? "bg-[#6C46BE] text-white shadow-sm"
                                    : "bg-[#FAF8FF] text-[#3E4A3D] hover:bg-[#F0EBFF]"
                            }`}
                        >
                            {!ativa && cat.cor && (
                                <span
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: cat.cor }}
                                />
                            )}
                            {cat.rotulo}
                            {ativa ? (
                                <span className="rounded-full bg-white/20 px-2 py-px text-[10px]">
                                    {cat.total}
                                </span>
                            ) : (
                                <span className="text-[#555F6F]">{cat.total}</span>
                            )}
                        </button>
                    );
                })}

                {/* empurra o raio de busca para a direita em telas largas */}
                <div className="ml-auto" />

                <button
                    type="button"
                    onClick={onRaioClick}
                    className="flex h-[27px] shrink-0 items-center gap-2 rounded-full bg-[#FAF8FF] px-3.5 text-xs font-medium text-[#3E4A3D] transition hover:bg-[#F0EBFF]"
                >
                    <span className="h-2 w-2 rounded-full bg-[#4DBB5A]" />
                    Raio de busca: {raioKm} km
                </button>
            </div>
        </header>
    );
}