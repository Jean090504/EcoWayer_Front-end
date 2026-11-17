import { ArrowLeft } from "lucide-react";
import FluxoEditarAnuncio from "../components/fluxos/fluxoEditarAnuncio.jsx";

export default function EditarAnuncio({ anuncioId, onNavegar, onSalvo }) {
    return <section className="flex-1 bg-[#FAF8FF] px-4 py-8 sm:px-8 sm:py-12">
        <nav aria-label="Caminho de navegação" className="mx-auto mb-6 flex max-w-[960px] items-center gap-2 text-xs text-[#3E4A3D]">
            <button onClick={() => onNavegar("home")} className="flex items-center gap-1 hover:underline"><ArrowLeft size={14} />Voltar ao Início</button><span>/</span><h1 className="font-semibold text-[#191C30]">Editar Anúncio</h1>
        </nav>
        <FluxoEditarAnuncio anuncioId={anuncioId} onNavegar={onNavegar} onSalvo={onSalvo} />
    </section>;
}
