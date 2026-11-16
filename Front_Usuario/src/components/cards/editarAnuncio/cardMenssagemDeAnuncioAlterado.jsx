import { useEffect, useRef } from "react";
import { Check, X } from "lucide-react";

export default function CardMenssagemDeAnuncioAlterado({ onFechar }) {
    const botao = useRef(null);
    useEffect(() => {
        const anterior = document.activeElement;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        botao.current?.focus();
        const teclado = event => {
            if (event.key === "Escape") onFechar();
            if (event.key === "Tab") {
                const botoes = botao.current?.closest('[role="dialog"]')?.querySelectorAll('button');
                if (!botoes?.length) return;
                if (event.shiftKey && document.activeElement === botoes[0]) { event.preventDefault(); botoes[botoes.length - 1].focus(); }
                else if (!event.shiftKey && document.activeElement === botoes[botoes.length - 1]) { event.preventDefault(); botoes[0].focus(); }
            }
        };
        document.addEventListener("keydown", teclado);
        return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", teclado); anterior?.focus(); };
    }, [onFechar]);
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#191C30]/40 p-4">
        <div role="dialog" aria-modal="true" aria-labelledby="anuncio-alterado-titulo" aria-describedby="anuncio-alterado-descricao" className="relative w-full max-w-[420px] rounded-2xl bg-white px-8 pb-10 pt-11 text-center shadow-xl">
            <button aria-label="Fechar confirmação" onClick={onFechar} className="absolute right-5 top-5 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            <div className="mx-auto mb-5 flex h-[74px] w-[74px] items-center justify-center rounded-full border border-green-200 bg-[#E5F5E8]"><Check size={44} className="text-[#399B50]" /></div>
            <h2 id="anuncio-alterado-titulo" className="text-2xl font-bold leading-tight tracking-tight text-[#191C30]">Seu anúncio foi alterado<br />com sucesso!</h2>
            <p id="anuncio-alterado-descricao" className="my-5 text-sm leading-relaxed text-gray-500">As alterações foram salvas e já estão visíveis no seu anúncio publicado.</p>
            <button ref={botao} onClick={onFechar} className="w-full rounded-full bg-[#724BC2] px-6 py-3 text-sm font-semibold text-white hover:bg-[#6539B8]">Entendi</button>
        </div>
    </div>;
}
