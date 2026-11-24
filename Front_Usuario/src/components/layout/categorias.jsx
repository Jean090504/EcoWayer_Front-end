import { useId, useState } from "react";
import { ChevronRight } from "lucide-react";

export default function Categorias({ categorias, selecionada, onSelecionar }) {
    const [aberta, setAberta] = useState(false);
    const listaId = useId();
    const opcoes = [
        { id: "tudo", nome: "Tudo" },
        { id: "favoritos", nome: "Favoritos" },
        ...categorias
    ];
    const categoriaAtiva = opcoes.find(opcao => opcao.id === selecionada);

    return (
        <div className="flex w-full min-w-0 items-center">
            <button
                type="button"
                aria-expanded={aberta}
                aria-controls={listaId}
                onClick={() => setAberta(atual => !atual)}
                className="flex min-h-9 shrink-0 items-center gap-1 rounded-full border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 transition-colors hover:border-green-600 hover:text-green-600"
            >
                Categorias
                <ChevronRight aria-hidden="true" size={16} className={`transition-transform duration-300 motion-reduce:transition-none ${aberta ? "rotate-180" : ""}`} />
            </button>

            <div
                id={listaId}
                role="group"
                aria-label="Filtros de anúncios"
                inert={!aberta}
                className={`grid min-w-0 flex-1 transition-[grid-template-columns,opacity] duration-300 ease-out motion-reduce:transition-none ${aberta ? "grid-cols-[1fr] opacity-100" : "grid-cols-[0fr] opacity-0"}`}
            >
                <div className="min-w-0 overflow-hidden">
                    <div className="flex gap-2 overflow-x-auto px-3 py-1.5 whitespace-nowrap">
                        {opcoes.map(({ id, nome }) => (
                            <button
                                key={id}
                                type="button"
                                aria-pressed={selecionada === id}
                                onClick={() => onSelecionar(id)}
                                className={`h-9 shrink-0 rounded-full border px-5 text-sm font-semibold transition-colors ${selecionada === id
                                    ? "border-green-700 bg-green-700 text-white"
                                    : "border-gray-200 bg-white text-gray-600 hover:border-green-600 hover:text-green-600"}`}
                            >
                                {nome}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {!aberta && selecionada !== "tudo" && (
                <span className="ml-3 min-w-0 truncate text-sm font-medium">{categoriaAtiva?.nome}</span>
            )}
        </div>
    );
}
