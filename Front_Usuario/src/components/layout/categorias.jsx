import { useEffect, useState } from "react";
import Botao from "../ui/botao.jsx";
import { apiFetch } from "../../services/api.js";

export default function Categorias({ categoriaSelecionada = "", onCategoria }) {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        let ativo = true;
        apiFetch("/catalog/categorias")
            .then((resposta) => { if (ativo) setCategorias(resposta.categorias || []); })
            .catch(() => { if (ativo) setCategorias([]); });
        return () => { ativo = false; };
    }, []);

    const selecionada = categoriaSelecionada || "Tudo";
    return (
        <div className="flex min-h-12 w-full items-center gap-3 overflow-x-auto whitespace-nowrap py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Botao texto="Tudo" onClick={() => onCategoria?.("")} className={`flex h-10 shrink-0 items-center justify-center rounded-full px-7 text-base font-semibold transition-colors ${selecionada === "Tudo" ? "bg-green-600 text-white" : "border border-gray-200 bg-white text-gray-600 hover:border-green-500 hover:text-green-600"}`}>
                Tudo
            </Botao>
            {categorias.map((categoria) => (
                <Botao key={categoria.id} texto={categoria.nome} onClick={() => onCategoria?.(categoria.nome)} className={`flex h-10 shrink-0 items-center justify-center rounded-full px-7 text-base font-semibold transition-colors ${selecionada === categoria.nome ? "bg-green-600 text-white" : "border border-gray-200 bg-white text-gray-600 hover:border-green-500 hover:text-green-600"}`}>
                    {categoria.nome}
                </Botao>
            ))}
        </div>
    );
}
