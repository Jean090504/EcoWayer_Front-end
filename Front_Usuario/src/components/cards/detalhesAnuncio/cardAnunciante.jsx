import { BadgeCheck, Star } from 'lucide-react';
export default function CardAnunciante({ vendedor, onVerPerfil, onDenunciar }) {
 return <section className="rounded-[26px] bg-white p-6 shadow-sm">
  <div className="flex items-center justify-between gap-3"><h2 className="text-sm font-semibold">Sobre o anunciante</h2><button type="button" onClick={onVerPerfil} className="text-xs text-[#724BC2] hover:underline">Ver perfil completo</button></div>
  <div className="my-6 flex items-center gap-3"><img src={vendedor.foto} alt={'Foto de '+vendedor.nome} className="h-14 w-14 rounded-full border-2 border-[#4CAF50] object-cover"/><div><p className="font-semibold">{vendedor.nome}</p>{vendedor.verificado && <p className="flex items-center gap-1 text-xs text-[#4CAF50]"><BadgeCheck size={14}/>Vendedor Verificado EcoWayer</p>}</div></div>
  <div className="grid grid-cols-3 gap-2 text-center"><div><p className="flex items-center justify-center gap-1 font-bold text-amber-500"><Star size={14} fill="currentColor"/>{vendedor.avaliacao}</p><p className="mt-1 text-[11px] text-gray-500">{vendedor.avaliacoes} avaliações</p></div><div><p className="font-bold">{vendedor.tempoResposta}</p><p className="mt-1 text-[11px] text-gray-500">Tempo de resposta</p></div><div><p className="font-bold text-[#4CAF50]">{vendedor.entregas}</p><p className="mt-1 text-[11px] text-gray-500">Entregas no prazo</p></div></div>
  <div className="mt-10 text-center"><button type="button" onClick={onDenunciar} className="rounded-full bg-[#EF3E49] px-6 py-2 text-xs font-semibold text-white hover:bg-red-600">Denunciar anúncio</button></div>
 </section>;
}
