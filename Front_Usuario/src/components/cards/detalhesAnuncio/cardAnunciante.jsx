import { useState } from 'react';
import { CalendarDays, Archive } from 'lucide-react';

export default function CardAnunciante({ vendedor, onVerPerfil, onDenunciar }) {
    const [fotoComErro, setFotoComErro] = useState(null);
    const nome = vendedor?.nome || 'Anunciante não disponível';
    const data = vendedor?.membroDesde?.match(/^(\d{4})-(\d{2})-(\d{2})/);
    const membroDesde = data ? `${data[3]}/${data[2]}/${data[1]}` : null;
    return <section className="rounded-[26px] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3"><h2 className="text-sm font-semibold">Sobre o anunciante</h2>{onVerPerfil && <button type="button" onClick={onVerPerfil} className="text-xs text-[#724BC2] hover:underline">Ver perfil completo</button>}</div>
        <div className="my-6 flex items-center gap-3">
            {vendedor?.foto && fotoComErro !== vendedor.foto ? <img src={vendedor.foto} onError={() => setFotoComErro(vendedor.foto)} alt={`Foto de ${nome}`} className="h-14 w-14 rounded-full border-2 border-[#4CAF50] object-cover" /> : <span aria-label={`Perfil de ${nome}`} className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EEE8FA] text-xl font-bold text-[#724BC2]">{nome.trim().charAt(0).toUpperCase()}</span>}
            <p className="min-w-0 break-words font-semibold">{nome}</p>
        </div>
        {vendedor && <dl className="grid grid-cols-2 gap-3 rounded-2xl bg-[#FAF8FF] p-4 text-center">
            <div><dt className="mb-2 flex items-center justify-center gap-1 text-[11px] text-gray-500"><CalendarDays size={13} aria-hidden="true" />Membro desde</dt><dd className="text-sm font-semibold text-[#191C30]">{membroDesde || 'Não informado'}</dd></div>
            <div><dt className="mb-2 flex items-center justify-center gap-1 text-[11px] text-gray-500"><Archive size={13} aria-hidden="true" />Anúncios ativos</dt><dd className="text-sm font-bold text-[#4CAF50]">{Number(vendedor.anunciosAtivos || 0)}</dd></div>
        </dl>}
        <div className="mt-8 text-center"><button type="button" onClick={onDenunciar} className="rounded-full bg-[#EF3E49] px-6 py-2 text-xs font-semibold text-white hover:bg-red-600">Denunciar anúncio</button></div>
    </section>;
}
