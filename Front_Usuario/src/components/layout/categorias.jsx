import { useId } from "react";

export default function Categorias({ categorias, selecionada, onSelecionar }) {
    const listaId = useId();
    const opcoes = [
        { id: "tudo", nome: "Tudo" },
        ...categorias,
        { id: "favoritos", nome: "Favoritos" }
    ];

    return (
        <div id={listaId} role="group" aria-label="Filtros de anuncios" className="w-full min-w-0">
            <div className="flex gap-2 overflow-x-auto py-1.5 whitespace-nowrap">
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
    );
}
