
import { useState } from "react";

export default function Categorias() {

    // Controla qual categoria está selecionada.
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("Tudo");

    // Controla se as categorias estão visíveis.
    const [mostrarCategorias, setMostrarCategorias] = useState(false);

    const listaCategorias = [
        "Tudo",
        "favoritos",
        "Móveis",
        "Fardos",
        "vidro",
        "Papelão",
        "madeira",
        "eletro domesticos",
        "dispositivos"
    ];

    return (
        <div className={`flex h-12 w-full items-center gap-3.5 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            mostrarCategorias ? "justify-center" : "justify-start"
        }`}>

            {/* Botão para mostrar ou esconder as categorias */}
            <button
                type="button"
                onClick={() => setMostrarCategorias(!mostrarCategorias)}
                className="flex h-9 shrink-0 items-center justify-center gap-1 rounded-full border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-600 transition-colors hover:border-green-600 hover:text-green-600"
            >
                categorias

                <span className="text-base leading-none">
                    {mostrarCategorias ? "‹" : "›"}
                </span>
            </button>

            {/* Lista de categorias */}
            {mostrarCategorias && (
                <>
                    {listaCategorias.map((categoria) => (

                        <button
                            key={categoria}
                            type="button"
                            onClick={() => setCategoriaSelecionada(categoria)}
                            className={`flex h-9 shrink-0 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors ${
                                categoriaSelecionada === categoria
                                    ? "bg-green-600 text-white"
                                    : "border border-gray-200 bg-white text-gray-600"
                            }`}
                        >
                            {categoria}

                        </button>

                    ))}
                </>
            )}

        </div>
    );
}
