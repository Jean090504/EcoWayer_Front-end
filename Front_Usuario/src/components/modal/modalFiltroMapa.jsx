import { useEffect, useState } from "react";
import { Bike, Car, Check, SlidersHorizontal, X } from "lucide-react";

export const RAIO_MIN_KM = 1;
export const RAIO_MAX_KM = 25;

// Valores iniciais (e usados também pelo botão "Limpar Filtros")
export const FILTROS_PADRAO = {
    raioKm: 5,
    abertoAgora: false,
    abertoFimDeSemana: false,
    balancaCalibrada: false,
    bonificacaoTurbinada: false,
    certificadoESG: false,
    acessoVeicular: false,
    bicicletario: false,
};

// Quantos filtros estão diferentes do padrão (usado no ponto do botão "Filtros")
export function contarFiltrosAtivos(filtros) {
    const { raioKm, ...opcoes } = filtros;
    const marcados = Object.values(opcoes).filter(Boolean).length;
    return marcados + (raioKm !== FILTROS_PADRAO.raioKm ? 1 : 0);
}

const GRUPOS = [
    {
        titulo: "Disponibilidade",
        opcoes: [
            { chave: "abertoAgora", rotulo: "Aberto agora" },
            { chave: "abertoFimDeSemana", rotulo: "Aberto nos fins de semana" },
            { chave: "balancaCalibrada", rotulo: "Possui balança digital calibrada" },
        ],
    },
    {
        titulo: "Recompensas e Impacto",
        opcoes: [
            { chave: "bonificacaoTurbinada", rotulo: "Bonificação EcoPontos turbinada (+30pts)" },
            { chave: "certificadoESG", rotulo: "Certificado ESG com rastreabilidade em blockchain" },
        ],
    },
];

const ACESSOS = [
    { chave: "acessoVeicular", rotulo: "Acesso Veicular", Icone: Car },
    { chave: "bicicletario", rotulo: "Bicicletário", Icone: Bike },
];

function Opcao({ rotulo, marcado, onChange }) {
    return (
        <label className="flex cursor-pointer items-center gap-3 text-base text-[#191C1E]">
            <input
                type="checkbox"
                checked={marcado}
                onChange={(e) => onChange(e.target.checked)}
                className="peer sr-only"
            />
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-[#555F6F]/60 bg-white text-transparent transition peer-checked:border-[#724BC2] peer-checked:bg-[#724BC2] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#724BC2]/40">
                <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
            </span>
            {rotulo}
        </label>
    );
}

export default function ModalFiltroMapa({
    filtrosIniciais = FILTROS_PADRAO,
    totalPontos = 12,
    onAplicar,
    onFechar,
}) {
    // rascunho: só vai para a tela quando clicar em "Aplicar"
    const [rascunho, setRascunho] = useState(filtrosIniciais);

    // fecha com ESC
    useEffect(() => {
        const aoTeclar = (e) => e.key === "Escape" && onFechar?.();
        window.addEventListener("keydown", aoTeclar);
        return () => window.removeEventListener("keydown", aoTeclar);
    }, [onFechar]);

    const alterar = (chave, valor) => setRascunho((atual) => ({ ...atual, [chave]: valor }));

    const percentual = ((rascunho.raioKm - RAIO_MIN_KM) / (RAIO_MAX_KM - RAIO_MIN_KM)) * 100;

    const aplicar = () => {
        onAplicar?.(rascunho);
        onFechar?.();
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* fundo escurecido */}
            <div className="absolute inset-0 bg-black/30" onClick={onFechar} aria-hidden="true" />

            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-filtros"
                className="relative flex h-full w-full max-w-[484px] flex-col bg-white shadow-xl"
            >
                {/* cabeçalho */}
                <header className="flex items-center justify-between px-6 pb-2 pt-6">
                    <h2
                        id="titulo-filtros"
                        className="flex items-center gap-3 text-2xl font-semibold text-[#191C1E]"
                    >
                        <SlidersHorizontal className="h-6 w-6 text-[#724BC2]" aria-hidden="true" />
                        Filtros
                    </h2>
                    <button
                        type="button"
                        aria-label="Fechar filtros"
                        onClick={onFechar}
                        className="rounded-md p-1 text-[#191C1E] transition hover:bg-gray-100"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </header>

                {/* conteúdo rolável */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    {/* Raio máximo */}
                    <div className="mt-8">
                        <div className="flex items-center justify-between text-sm">
                            <label htmlFor="raio-maximo" className="font-semibold text-[#191C1E]">
                                Raio Máximo
                            </label>
                            <span className="font-semibold text-[#724BC2]">
                                {rascunho.raioKm.toFixed(1)} km
                            </span>
                        </div>

                        <input
                            id="raio-maximo"
                            type="range"
                            min={RAIO_MIN_KM}
                            max={RAIO_MAX_KM}
                            step={0.5}
                            value={rascunho.raioKm}
                            onChange={(e) => alterar("raioKm", Number(e.target.value))}
                            style={{
                                background: `linear-gradient(to right, #724BC2 ${percentual}%, #E6E8EC ${percentual}%)`,
                            }}
                            className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-[#724BC2] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[#724BC2] [&::-webkit-slider-thumb]:shadow"
                        />

                        <div className="mt-4 flex justify-between text-xs text-[#555F6F]">
                            <span>1 km</span>
                            <span>10 km</span>
                            <span>25 km</span>
                        </div>
                    </div>

                    {/* Grupos de checkboxes */}
                    {GRUPOS.map((grupo) => (
                        <fieldset key={grupo.titulo} className="mt-8">
                            <legend className="text-sm font-semibold text-[#191C1E]">
                                {grupo.titulo}
                            </legend>
                            <div className="mt-4 flex flex-col gap-3">
                                {grupo.opcoes.map((op) => (
                                    <Opcao
                                        key={op.chave}
                                        rotulo={op.rotulo}
                                        marcado={rascunho[op.chave]}
                                        onChange={(valor) => alterar(op.chave, valor)}
                                    />
                                ))}
                            </div>
                        </fieldset>
                    ))}

                    {/* Acesso e veículos */}
                    <div className="mt-8">
                        <h3 className="text-sm font-semibold text-[#191C1E]">Acesso e Veículos</h3>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {ACESSOS.map(({ chave, rotulo, Icone }) => {
                                const ativo = rascunho[chave];

                                return (
                                    <button
                                        key={chave}
                                        type="button"
                                        aria-pressed={ativo}
                                        onClick={() => alterar(chave, !ativo)}
                                        className={`flex h-10 items-center justify-center gap-2 rounded-xl text-sm font-medium transition ${
                                            ativo
                                                ? "bg-[#724BC2] text-white"
                                                : "bg-[#ECEDEF] text-[#191C1E] hover:bg-[#E2E3E6]"
                                        }`}
                                    >
                                        <Icone className="h-4 w-4" aria-hidden="true" />
                                        {rotulo}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* rodapé com ações */}
                <footer className="flex gap-3 bg-[#FAF8FF] px-6 py-5">
                    <button
                        type="button"
                        onClick={() => setRascunho(FILTROS_PADRAO)}
                        className="h-11 flex-1 rounded-xl bg-white text-sm font-semibold text-[#3E4A3D] transition hover:bg-gray-50"
                    >
                        Limpar Filtros
                    </button>
                    <button
                        type="button"
                        onClick={aplicar}
                        className="h-11 flex-1 rounded-xl bg-[#724BC2] text-sm font-semibold text-white transition hover:bg-[#6340AE]"
                    >
                        Aplicar ({totalPontos} Pontos)
                    </button>
                </footer>
            </section>
        </div>
    );
}