import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Archive, CalendarDays, Heart, Home, MessageSquare, RefreshCw, Share2 } from 'lucide-react';
import { buscarDetalhesAnuncio } from '../mocks/mockDetalhesAnuncio.js';
import CardAnunciante from '../components/cards/detalhesAnuncio/cardAnunciante.jsx';
import CardAnuncioRelacionado from '../components/cards/detalhesAnuncio/cardAnuncioRelacionado.jsx';

export default function DetalhesAnuncio({ anuncioSelecionado, onNavegar, onAbrirAnuncio }) {
    const [anuncio, setAnuncio] = useState(null);
    const [erro, setErro] = useState('');
    const [tentativa, setTentativa] = useState(0);
    const [favoritos, setFavoritos] = useState([]);
    const [aviso, setAviso] = useState('');
    useEffect(() => {
        let ativo = true;
        buscarDetalhesAnuncio(anuncioSelecionado).then(dados => { if (ativo) setAnuncio(dados); }).catch(error => { if (ativo) setErro(error.message || 'Não foi possível carregar o anúncio.'); });
        return () => { ativo = false; };
    }, [anuncioSelecionado, tentativa]);
    function favoritar(id) { setFavoritos(atuais => atuais.includes(id) ? atuais.filter(item => item !== id) : [...atuais, id]); }
    function demonstrar(acao) { setAviso(acao + ': funcionalidade em demonstração, ainda sem integração.'); }
    async function compartilhar() {
        try {
            // Sem rotas por anúncio, compartilha os dados sem inventar uma URL.
            const texto = anuncio.nome + ' — ' + anuncio.preco + ' | EcoWayer';
            if (navigator.share) await navigator.share({ title: anuncio.nome, text: texto });
            else if (navigator.clipboard) { await navigator.clipboard.writeText(texto); setAviso('Informações do anúncio copiadas.'); }
            else setAviso(texto);
        } catch (error) { if (error.name !== 'AbortError') setAviso('Não foi possível compartilhar. Tente novamente.'); }
    }
    if (erro) return <section role="alert" className="mx-auto w-[90%] py-12"><p>{erro}</p><button type="button" className="mt-4 text-[#724BC2]" onClick={() => { setErro(''); setTentativa(valor => valor + 1); }}>Tentar novamente</button></section>;
    if (!anuncio) return <section role="status" className="mx-auto w-[90%] py-12 text-gray-500">Carregando anúncio...</section>;
    return <div className="flex-1 bg-[#FAF8FF] text-[#191C30]">
        <nav aria-label="Caminho de navegação" className="bg-white px-[5%] py-4 text-xs text-[#724BC2]"><ol className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-2"><li><button type="button" onClick={() => onNavegar('home')} className="flex items-center gap-1 hover:underline"><Home size={12} />Início</button></li><li aria-hidden="true">›</li><li>{anuncio.categoria}</li><li aria-hidden="true">›</li><li aria-current="page" className="font-semibold text-[#191C30]">{anuncio.nome}</li></ol></nav>
        <div className="mx-auto w-[90%] max-w-[1280px] py-7 sm:py-9">
            <div className="mb-4 flex items-center justify-between gap-4"><button type="button" onClick={() => onNavegar('home')} className="flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs hover:text-[#724BC2]"><ArrowLeft size={14} />Voltar aos anúncios</button><div className="flex gap-2"><button type="button" onClick={compartilhar} aria-label="Compartilhar anúncio" className="rounded-full bg-white p-2.5 text-gray-500"><Share2 size={17} /></button><button type="button" onClick={() => favoritar(anuncio.id)} aria-label={favoritos.includes(anuncio.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} aria-pressed={favoritos.includes(anuncio.id)} className="rounded-full bg-white p-2.5 text-red-500"><Heart size={17} fill={favoritos.includes(anuncio.id) ? 'currentColor' : 'none'} /></button></div></div>
            {aviso && <div role="status" className="mb-4 flex items-center justify-between gap-4 rounded-xl border border-purple-100 bg-white px-4 py-3 text-sm text-[#724BC2]"><span>{aviso}</span><button type="button" onClick={() => setAviso('')} aria-label="Fechar aviso" className="px-2 text-lg">×</button></div>}
            <div className="grid items-start gap-6 lg:grid-cols-[1.43fr_1fr]">
                <div className="min-w-0 space-y-6">
                    <img src={anuncio.imagem} alt={anuncio.nome} className="aspect-[1.67] w-full rounded-[26px] bg-gray-100 object-cover" />
                    <section className="rounded-[26px] bg-white p-6 shadow-sm sm:p-8"><h2 className="mb-7 flex items-center gap-2 text-base font-semibold text-[#724BC2]"><Archive size={18} />Especificações do material</h2><dl className="grid grid-cols-2 gap-5"><div><dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">Volume / peso</dt><dd className="mt-1 text-lg font-bold">{anuncio.peso}</dd><dd className="mt-1 text-xs text-gray-500">{anuncio.quantidade}</dd></div><div><dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">Estado</dt><dd className="mt-1 text-lg font-bold text-[#4CAF50]">{anuncio.estado}</dd><dd className="mt-1 text-xs text-gray-500">{anuncio.conservacao}</dd></div></dl></section>
                </div>
                <div className="min-w-0 space-y-3">
                    <section className="rounded-[26px] bg-white p-6 shadow-sm"><div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[10px]"><span className="font-semibold uppercase tracking-wider text-[#724BC2]">{anuncio.categoria} · {anuncio.subcategoria}</span><span className="text-gray-500">{anuncio.publicado}</span></div><h1 className="text-2xl font-bold leading-tight sm:text-[30px]">{anuncio.nome}</h1><p className="my-4 flex flex-wrap items-baseline gap-2"><span className="text-[34px] font-bold tracking-tight text-[#4CAF50]">{anuncio.preco}</span><span className="text-xs text-gray-600">{anuncio.unidade}</span></p><p className="mb-5 flex items-start gap-2 text-xs leading-relaxed"><RefreshCw size={23} className="shrink-0 rounded-full bg-[#724BC2] p-1 text-white" />{anuncio.troca}</p><div className="space-y-2"><button type="button" onClick={() => demonstrar('Conversa com o anunciante')} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#724BC2] px-4 py-3 text-sm font-semibold text-white hover:bg-[#603ca8]"><MessageSquare size={16} />Conversar com anunciante</button><button type="button" onClick={() => demonstrar('Contraproposta / agendamento de retirada')} className="flex w-full items-center justify-center gap-2 rounded-full border border-[#4CAF50] px-4 py-3 text-xs font-semibold text-[#4CAF50] hover:bg-green-50"><CalendarDays size={16} />Fazer contraproposta / Agendar retirada</button></div></section>
                    <CardAnunciante vendedor={anuncio.vendedor} onVerPerfil={() => demonstrar('Perfil do anunciante')} onDenunciar={() => demonstrar('Denúncia de anúncio')} />
                </div>
            </div>
            <section className="my-7 rounded-[26px] bg-white p-6 shadow-sm sm:p-8"><h2 className="mb-6 text-base font-semibold">Descrição detalhada</h2><p className="whitespace-pre-line text-sm leading-relaxed text-[#3E4A3D]">{anuncio.descricao}</p></section>
            <section className="pb-2 pt-3"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">Outros anúncios em destaque deste vendedor</h2><button type="button" onClick={() => demonstrar('Todos os anúncios do vendedor')} className="flex items-center gap-1 text-xs font-medium text-[#724BC2] hover:underline">Ver todos os itens de {anuncio.vendedor.nome.split(' ')[0]}<ArrowRight size={14} /></button></div><div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">{anuncio.outrosAnuncios.map(item => <CardAnuncioRelacionado key={item.id} anuncio={item} favoritado={favoritos.includes(item.id)} onFavoritar={() => favoritar(item.id)} onAbrir={() => onAbrirAnuncio(item)} />)}</div></section>
        </div>
    </div>;
}
