import { useEffect, useRef } from 'react';
import { LogIn, ShieldCheck } from 'lucide-react';

export default function SessaoEncerrada({ encerrando, onEntrar }) {
    const botao = useRef(null);
    useEffect(() => { if (!encerrando) botao.current?.focus(); }, [encerrando]);
    return <section className="flex flex-1 items-center justify-center bg-[#FAF8FF] px-4 py-16 sm:py-24" aria-labelledby="sessao-encerrada-titulo">
        <div className="w-full max-w-[480px] rounded-[32px] bg-white px-7 py-12 text-center shadow-sm sm:px-10">
            <span className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#EEE8FA] text-[#724BC2]"><ShieldCheck size={38} aria-hidden="true" /></span>
            <h1 id="sessao-encerrada-titulo" className="text-2xl font-bold text-[#191C30]">Sua sessão foi encerrada</h1>
            <p className="mb-8 mt-4 text-sm leading-relaxed text-gray-500">Entre novamente na sua conta para continuar usando o EcoWayer.</p>
            <button ref={botao} onClick={onEntrar} disabled={encerrando} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#724BC2] px-6 py-3 font-semibold text-white transition hover:bg-[#6539B8] disabled:cursor-wait disabled:opacity-60"><LogIn size={18} aria-hidden="true" />{encerrando ? 'Encerrando sessão...' : 'Entrar novamente'}</button>
            <p role="status" className="mt-4 text-xs text-gray-500">{encerrando ? 'Aguarde um instante.' : 'Faça login para acessar seus anúncios, mensagens e carteira.'}</p>
        </div>
    </section>;
}
