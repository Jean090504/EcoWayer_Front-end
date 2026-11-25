import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Archive, Check, CheckCheck, ChevronDown, Flag, MessageSquare, RefreshCw, Search, Send, Smile, X } from 'lucide-react'
import { abrirEventosMensagens, urlImagem } from '../services/api.js'
import { criarConversa, enviarMensagem, listarConversas, listarMensagens, marcarConversaLida } from '../services/chatService.js'
import { registrarMensagemEnviada, INTERVALO_CONVERSAS, INTERVALO_MENSAGENS } from '../services/chatDelivery.js'
import { conversaDaPessoa, conversaDoAnuncio, conversaInicial } from '../services/chatSelection.js'
import { dia, horario } from '../services/chatHorario.js'

const AVISO_ANUNCIO_INATIVO = 'Este anúncio não está mais ativo. Abra um anúncio ativo para iniciar uma conversa.'

const nomeContato = (conversa, id) => Number(conversa.id_anunciante) === Number(id) ? conversa.interessado : conversa.anunciante
const fotoContato = (conversa, id) => Number(conversa.id_anunciante) === Number(id) ? conversa.foto_interessado : conversa.foto_anunciante
const iniciais = nome => (nome || 'Anunciante').split(' ').filter(Boolean).slice(0, 2).map(parte => parte[0]).join('')

function AvatarContato({ nome, foto }) {
    const url = urlImagem(foto)
    const [fotoComErro, setFotoComErro] = useState(null)
    return <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#EEE8FA] text-base font-bold text-[#724BC2]">
        {url && url !== fotoComErro
            ? <img src={url} alt="" onError={() => setFotoComErro(url)} className="h-full w-full object-cover" />
            : iniciais(nome)}
    </span>
}

export default function Chat({ usuario, anuncio, onAbrirLogin, onNavegar, onAbrirAnuncio, onDenunciarMensagem }) {
    const [sinalMensagem] = useState(() => new EventTarget())
    const [conversas, setConversas] = useState([])
    const [selecionada, setSelecionada] = useState(null)
    const [contextoPendente, setContextoPendente] = useState(anuncio || null)
    const [mensagens, setMensagens] = useState([])
    const [busca, setBusca] = useState('')
    const [filtro, setFiltro] = useState('todas')
    const [texto, setTexto] = useState('')
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(true)
    const [mensagemPendente, setMensagemPendente] = useState('')
    const enviando = Boolean(mensagemPendente)
    const [tentativa, setTentativa] = useState(0)
    const [mostrarBusca, setMostrarBusca] = useState(false)
    const [buscaMensagem, setBuscaMensagem] = useState('')
    const [menuMensagem, setMenuMensagem] = useState(null)
    const [emojis, setEmojis] = useState(false)
    const fim = useRef(null)
    const campo = useRef(null)
    const travaEnvio = useRef(false)
    const revisaoEnvio = useRef(0)
    const idUsuario = usuario?.id
    const idConversa = selecionada?.id
    const contato = selecionada ? nomeContato(selecionada, idUsuario) : ''

    useEffect(() => { setContextoPendente(anuncio || null) }, [anuncio])

    useEffect(() => {
        let ativo = true
        async function carregar() {
            if (!idUsuario) { setCarregando(false); return }
            setCarregando(true)
            setErro('')
            try {
                const lista = await listarConversas(idUsuario)
                if (!ativo) return
                setConversas(lista)
                const existente = conversaDoAnuncio(lista, anuncio, idUsuario)
                if (existente) setSelecionada(existente)
                else if (anuncio && Number(anuncio.id_usuario) !== Number(idUsuario)) {
                    setSelecionada({ id: null, id_anuncio: anuncio.id, anuncio: anuncio.nome, id_anunciante: anuncio.id_usuario, anunciante: anuncio.vendedor?.nome || 'Anunciante', foto_anunciante: anuncio.vendedor?.foto, id_interessado: idUsuario, interessado: usuario.nome })
                } else if (anuncio) {
                    setSelecionada(null)
                    setErro('Este anúncio é seu. Selecione a conversa do interessado na lista.')
                } else setSelecionada(atual => conversaInicial(lista, atual?.id || sessionStorage.getItem(`ecowayer_conversa_${idUsuario}`)))
            } catch (error) { if (ativo) setErro(error.message) }
            finally { if (ativo) setCarregando(false) }
        }
        carregar()
        return () => { ativo = false }
    }, [idUsuario, anuncio, tentativa, usuario?.nome])

    useEffect(() => {
        if (idUsuario && idConversa) sessionStorage.setItem(`ecowayer_conversa_${idUsuario}`, String(idConversa))
    }, [idUsuario, idConversa])

    useEffect(() => {
        if (!idUsuario || typeof EventSource === 'undefined') return
        const eventos = abrirEventosMensagens()
        const avisar = () => sinalMensagem.dispatchEvent(new Event('mensagem'))
        eventos.addEventListener('open', avisar)
        eventos.addEventListener('mensagem', avisar)
        return () => eventos.close()
    }, [idUsuario, sinalMensagem])

    // A caixa de entrada deve atualizar mesmo quando ainda não há conversa selecionada.
    useEffect(() => {
        if (!idUsuario) return
        let ativo = true
        let carregandoLista = false
        let repetir = false
        async function atualizarLista(evento) {
            if (!ativo || document.visibilityState !== 'visible') return
            if (carregandoLista) {
                if (evento?.type === 'mensagem') repetir = true
                return
            }
            carregandoLista = true
            const revisao = revisaoEnvio.current
            try {
                const lista = await listarConversas(idUsuario)
                if (!ativo || revisao !== revisaoEnvio.current) return
                setConversas(lista)
                setSelecionada(atual => {
                    if (!atual) return null
                    if (atual.id) return conversaDaPessoa(lista, atual.id_interessado, atual.id_anunciante) || atual
                    return conversaDoAnuncio(lista, { id: atual.id_anuncio, id_usuario: atual.id_anunciante }, idUsuario) || atual
                })
            } catch (error) { if (ativo) setErro(error.message) }
            finally {
                carregandoLista = false
                if (repetir && ativo) {
                    repetir = false
                    void atualizarLista()
                }
            }
        }
        const timer = setInterval(atualizarLista, INTERVALO_CONVERSAS)
        sinalMensagem.addEventListener('mensagem', atualizarLista)
        return () => {
            ativo = false
            clearInterval(timer)
            sinalMensagem.removeEventListener('mensagem', atualizarLista)
        }
    }, [idUsuario, sinalMensagem])

    useEffect(() => {
        let ativo = true
        if (!idConversa) return () => { ativo = false }
        let atualizando = false
        let repetir = false
        async function atualizar(evento) {
            if (!ativo || document.visibilityState !== 'visible') return
            if (atualizando) {
                if (evento?.type === 'mensagem') repetir = true
                return
            }
            atualizando = true
            const revisao = revisaoEnvio.current
            try {
                const itens = await listarMensagens(idConversa)
                if (!ativo || revisao !== revisaoEnvio.current) return
                setMensagens(itens)
                const naoLidas = itens.filter(item => Number(item.id_remetente) !== Number(idUsuario) && !Number(item.lida))
                if (naoLidas.length && document.visibilityState === 'visible' && document.hasFocus()) {
                    await marcarConversaLida(idConversa, Math.max(...itens.map(item => Number(item.id))))
                    if (!ativo) return
                    setConversas(lista => lista.map(item => Number(item.id) === Number(idConversa) ? { ...item, nao_lidas: Math.max(0, Number(item.nao_lidas || 0) - naoLidas.length) } : item))
                }
            } catch (error) { if (ativo) setErro(error.message) }
            finally {
                atualizando = false
                if (repetir && ativo) {
                    repetir = false
                    void atualizar()
                }
            }
        }
        atualizar()
        const timer = setInterval(atualizar, INTERVALO_MENSAGENS)
        sinalMensagem.addEventListener('mensagem', atualizar)
        window.addEventListener('focus', atualizar)
        document.addEventListener('visibilitychange', atualizar)
        return () => {
            ativo = false
            clearInterval(timer)
            sinalMensagem.removeEventListener('mensagem', atualizar)
            window.removeEventListener('focus', atualizar)
            document.removeEventListener('visibilitychange', atualizar)
        }
    }, [idConversa, idUsuario, sinalMensagem])

    useEffect(() => { fim.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }) }, [mensagens.length, mensagemPendente])
    useEffect(() => {
        const textarea = campo.current
        if (!textarea) return
        textarea.style.height = 'auto'
        textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`
    }, [texto])

    async function enviar(event) {
        event.preventDefault()
        if (!texto.trim() || !selecionada || travaEnvio.current) return
        travaEnvio.current = true
        setErro('')
        const atual = selecionada
        const conteudo = texto.trim()
        setMensagemPendente(conteudo)
        setTexto('')
        setEmojis(false)
        try {
            let idEnvio = atual.id_conversa_envio || atual.id
            // O histórico é único por pessoa; a mensagem preserva o anúncio por onde o contato chegou.
            if (contextoPendente || !idEnvio) {
                const origem = contextoPendente?.id || atual.id_anuncio
                const conversa = await criarConversa(origem, idUsuario)
                idEnvio = conversa.id
            }
            const mensagem = await enviarMensagem(idEnvio, idUsuario, conteudo)
            revisaoEnvio.current++
            const conversa = {
                ...atual,
                id: atual.id || idEnvio,
                id_conversa_envio: idEnvio,
                ids_conversas: [...new Set([...(atual.ids_conversas || []), atual.id || idEnvio, idEnvio])]
            }
            setContextoPendente(null)
            setSelecionada(conversa)
            setMensagens(itens => registrarMensagemEnviada(itens, mensagem))
            setConversas(lista => {
                const anterior = conversaDaPessoa(lista, atual.id_interessado, atual.id_anunciante)
                const atualizada = {
                    ...anterior,
                    ...conversa,
                    ultima_mensagem: mensagem.texto,
                    ultimo_envio: mensagem.envio || anterior?.ultimo_envio
                }
                return [atualizada, ...lista.filter(item => item !== anterior)]
            })
        } catch (error) {
            setTexto(conteudo)
            setErro(error.message === '[ID_ANUNCIO] ANÚNCIO NÃO ESTÁ ATIVO' ? AVISO_ANUNCIO_INATIVO : error.message)
        }
        finally {
            travaEnvio.current = false
            setMensagemPendente('')
        }
    }

    useEffect(() => {
        if (!enviando && document.activeElement === document.body) campo.current?.focus()
    }, [enviando])

    const visiveis = conversas.filter(item => (filtro === 'todas' || Number(item.nao_lidas) > 0) && `${nomeContato(item, idUsuario)} ${item.anuncio}`.toLocaleLowerCase('pt-BR').includes(busca.toLocaleLowerCase('pt-BR')))
    const totalNaoLidas = conversas.filter(item => Number(item.nao_lidas) > 0).length
    const mensagensVisiveis = mensagens.filter(item => (selecionada?.ids_conversas || [idConversa]).map(Number).includes(Number(item.id_conversa))).filter(item => item.texto.toLocaleLowerCase('pt-BR').includes(buscaMensagem.toLocaleLowerCase('pt-BR')))

    return <section className="flex-1 bg-[#FAF8FF] px-[4%] py-7 text-[#191C30] sm:py-10">
        <nav aria-label="Caminho de navegação" className="mx-auto mb-5 flex max-w-[1440px] items-center gap-2 text-sm"><button onClick={() => onNavegar('home')} className="font-semibold text-[#724BC2] hover:underline">Início</button><span aria-hidden="true">›</span><h1 className="font-semibold">Chat &amp; Mensagens</h1>{conversas.length > 0 && <span className="rounded-full bg-[#724BC2] px-2.5 py-0.5 text-xs text-white">{conversas.length} conversas</span>}</nav>
        {!idUsuario ? <div className="mx-auto flex min-h-[450px] max-w-[1440px] flex-col items-center justify-center gap-4 rounded-[28px] bg-white p-6 text-center"><MessageSquare size={42} className="text-[#724BC2]"/><h2 className="text-xl font-bold">Converse com o anunciante</h2><p className="text-gray-500">Entre na sua conta para acessar suas mensagens.</p><button onClick={onAbrirLogin} className="rounded-full bg-[#724BC2] px-7 py-3 font-semibold text-white">Entrar na conta</button></div> : <>
        {erro && <div role="alert" className="mx-auto mb-4 flex max-w-[1440px] items-center gap-3 rounded-xl border border-red-100 bg-white p-4 text-sm text-red-700"><span className="flex-1">{erro}</span>{erro !== AVISO_ANUNCIO_INATIVO && <button onClick={() => setTentativa(valor => valor + 1)} className="font-semibold underline">Tentar novamente</button>}<button aria-label="Fechar erro" onClick={() => setErro('')}><X size={18}/></button></div>}
        <div className="mx-auto grid min-h-[620px] max-w-[1440px] overflow-hidden rounded-[28px] bg-white shadow-sm md:h-[min(780px,80vh)] md:grid-cols-[32%_1fr]">
            <aside className={`${selecionada ? 'hidden md:flex' : 'flex'} min-h-0 flex-col border-r border-gray-100 p-4 lg:p-5`}>
                <div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-bold">Mensagens</h2><button disabled={carregando || enviando} onClick={() => setTentativa(valor => valor + 1)} aria-label="Atualizar conversas" className="rounded-full bg-[#F3F4F6] p-2.5 text-[#536252] disabled:opacity-50"><RefreshCw size={18} className={carregando ? 'animate-spin' : ''}/></button></div>
                <label className="flex items-center gap-2 rounded-full bg-[#F3F4F6] px-3 py-2 text-[#73806F]"><Search size={17}/><input aria-label="Buscar conversa ou anúncio" value={busca} onChange={event => setBusca(event.target.value)} placeholder="Buscar conversa ou anúncio..." className="min-w-0 w-full bg-transparent text-sm outline-none"/></label>
                <div className="my-4 flex gap-2 text-xs"><button onClick={() => setFiltro('todas')} aria-pressed={filtro === 'todas'} className={`rounded-full px-4 py-2 ${filtro === 'todas' ? 'bg-[#4CAF50] text-white' : 'bg-[#F3F4F6] text-[#536252]'}`}>Todas</button><button onClick={() => setFiltro('naoLidas')} aria-pressed={filtro === 'naoLidas'} className={`rounded-full px-4 py-2 ${filtro === 'naoLidas' ? 'bg-[#4CAF50] text-white' : 'bg-[#F3F4F6] text-[#536252]'}`}>Não lidas ({totalNaoLidas})</button></div>
                <div className="min-h-0 flex-1 space-y-1 overflow-y-auto">
                    {carregando && <p role="status" className="p-4 text-sm text-gray-500">Carregando conversas...</p>}
                    {!carregando && !visiveis.length && <p className="p-4 text-sm leading-relaxed text-gray-500">{busca || filtro !== 'todas' ? 'Nenhuma conversa encontrada.' : 'Suas conversas aparecerão aqui. Abra um anúncio para começar.'}</p>}
                    {visiveis.map(item => {
                        const quantidade = Number(item.nao_lidas || 0)
                        const naoLida = quantidade > 0
                        const nome = nomeContato(item, idUsuario)
                        return <button disabled={enviando} key={item.id} onClick={() => { setSelecionada(item); setContextoPendente(null); setMensagens([]); setTexto(''); setBuscaMensagem(''); setErro('') }} aria-label={`${nome}${naoLida ? `, ${quantidade} ${quantidade === 1 ? 'mensagem não lida' : 'mensagens não lidas'}` : ''}`} aria-pressed={item.id === idConversa} className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition ${naoLida ? 'border-green-100 bg-green-50/70 hover:bg-green-50' : `border-transparent hover:bg-[#F3F4F6] ${item.id === idConversa ? 'bg-[#F3F4F6]' : ''}`}`}>
                            <span className="relative shrink-0"><AvatarContato nome={nome} foto={fotoContato(item, idUsuario)} />{naoLida && <span aria-hidden="true" className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#258D43]" />}</span>
                            <span className="min-w-0 flex-1">
                                <span className="flex items-center justify-between gap-2"><span className={`truncate text-[#191C30] ${naoLida ? 'font-bold' : 'font-medium'}`}>{nome}</span><span className={`shrink-0 text-[10px] ${naoLida ? 'font-bold text-[#258D43]' : 'text-gray-500'}`}>{horario(item.ultimo_envio)}</span></span>
                                <span className="mt-1 flex items-center gap-1 text-xs text-[#724BC2]"><Archive size={13} className="shrink-0" /><span className="truncate">{item.anuncio}</span></span>
                                <span className="mt-1 flex items-center justify-between gap-2 text-xs"><span className={`truncate ${naoLida ? 'font-semibold text-[#191C30]' : 'text-[#536252]'}`}>{item.ultima_mensagem || 'Inicie a conversa'}</span>{naoLida && <span aria-hidden="true" className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#258D43] px-1.5 text-[10px] font-bold text-white">{quantidade > 99 ? '99+' : quantidade}</span>}</span>
                            </span>
                        </button>
                    })}
                </div>
            </aside>
            <div className={`${selecionada ? 'flex' : 'hidden md:flex'} min-h-0 min-w-0 flex-col`}>
                {selecionada ? <>
                    <header className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 lg:px-5"><button disabled={enviando} aria-label="Voltar às conversas" onClick={() => setSelecionada(null)} className="p-1 md:hidden"><ArrowLeft size={20}/></button><AvatarContato nome={contato} foto={fotoContato(selecionada, idUsuario)} /><div className="min-w-0 flex-1"><h2 className="truncate text-lg font-bold">{contato}</h2><button onClick={() => onAbrirAnuncio({ id: selecionada.id_anuncio })} className="block max-w-full truncate text-xs text-[#724BC2] hover:underline">{selecionada.anuncio}</button></div><button onClick={() => { setMostrarBusca(valor => !valor); setBuscaMensagem('') }} aria-label="Buscar nas mensagens" aria-expanded={mostrarBusca} className="rounded-full bg-[#F3F4F6] p-2.5 text-[#536252]"><Search size={19}/></button></header>
                    {mostrarBusca && <label className="flex items-center gap-2 border-b border-gray-100 px-5 py-3"><Search size={16}/><input autoFocus value={buscaMensagem} onChange={event => setBuscaMensagem(event.target.value)} aria-label="Buscar texto nas mensagens" placeholder="Buscar nas mensagens..." className="w-full text-sm outline-none"/></label>}
                    <div className="min-h-[300px] flex-1 space-y-4 overflow-y-auto bg-[#F0F0F0] px-4 py-6 lg:px-6" role="log" aria-label="Histórico de mensagens" aria-live="polite">
                        {contextoPendente && <div className="mx-auto max-w-md rounded-2xl border border-purple-100 bg-white p-4 text-xs text-[#724BC2]"><span className="block text-gray-500">Você chegou pelo anúncio</span><button type="button" onClick={() => onAbrirAnuncio({ id: contextoPendente.id })} className="mt-2 flex items-center gap-2 text-left font-semibold hover:underline"><Archive size={18} className="shrink-0" />{contextoPendente.nome}</button><p className="mt-2 text-gray-500">O anúncio será enviado junto com sua próxima mensagem.</p></div>}
                        {!mensagensVisiveis.length && !mensagemPendente && <div className="flex h-full min-h-[250px] flex-col items-center justify-center gap-3 text-center text-[#73806F]"><MessageSquare size={36} className="text-[#724BC2]"/><p className="text-sm">{buscaMensagem ? 'Nenhuma mensagem encontrada.' : 'Comece a conversa sobre este anúncio.'}</p></div>}
                        {mensagensVisiveis.map((item, indice) => {
                            const minha = Number(item.id_remetente) === Number(idUsuario)
                            const data = dia(item.envio)
                            return <div key={item.id}>
                                {(indice === 0 || dia(mensagensVisiveis[indice - 1].envio) !== data) && data && <div className="mb-5 text-center"><span className="rounded-full bg-[#EDE9FE] px-4 py-1.5 text-xs text-[#536252]">{data}</span></div>}
                                {(indice === 0 || Number(mensagensVisiveis[indice - 1].id_anuncio) !== Number(item.id_anuncio)) && item.id_anuncio && <button type="button" onClick={() => onAbrirAnuncio({ id: item.id_anuncio })} className="mx-auto mb-5 flex max-w-md items-center gap-3 rounded-2xl border border-purple-100 bg-white px-4 py-3 text-left text-xs text-[#724BC2]"><Archive size={20} className="shrink-0" /><span><span className="block text-gray-500">{indice === 0 ? `${item.remetente} iniciou o contato pelo anúncio` : `${item.remetente} enviou uma mensagem sobre o anúncio`}</span><span className="mt-1 block font-semibold">{item.anuncio}</span><span className="mt-1 block underline">Ver anúncio</span></span></button>}
                                <div className={`flex ${minha ? 'justify-end' : 'justify-start'}`}><div className="relative min-w-0 max-w-[88%] sm:max-w-[78%]" onBlur={evento => {
                                    if (!evento.currentTarget.contains(evento.relatedTarget)) setMenuMensagem(null)
                                }}><p className={`whitespace-pre-wrap break-words rounded-[20px] px-4 py-3 text-sm leading-relaxed shadow-sm lg:px-5 lg:py-4 ${minha ? 'rounded-br-sm bg-[#724BC2] text-white' : 'rounded-bl-sm bg-white pr-11 text-[#191C30] lg:pr-12'}`}>{item.texto}</p>
                                    {!minha && onDenunciarMensagem && (
                                        <div className="absolute right-1 top-1" onKeyDown={evento => {
                                            if (evento.key === 'Escape') {
                                                evento.currentTarget.querySelector('button')?.focus()
                                                setMenuMensagem(null)
                                            }
                                        }}>
                                            <button
                                                type="button"
                                                aria-label="Opções da mensagem"
                                                aria-expanded={menuMensagem === item.id}
                                                onClick={() => setMenuMensagem(atual => atual === item.id ? null : item.id)}
                                                className="rounded-full p-2 text-gray-600 hover:bg-purple-50 focus-visible:outline-2 focus-visible:outline-[#724BC2]"
                                            ><ChevronDown size={16} aria-hidden="true" /></button>
                                            {menuMensagem === item.id && (
                                                <button
                                                    type="button"
                                                    onClick={() => onDenunciarMensagem(item)}
                                                    className="absolute left-0 top-full z-10 flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-lg hover:bg-red-50"
                                                ><Flag size={15} aria-hidden="true" />Denunciar</button>
                                            )}
                                        </div>
                                    )}
                                    <div className={`mt-1 flex items-center gap-1 px-1 text-[11px] text-[#536252] ${minha ? 'justify-end' : ''}`}><time>{horario(item.envio)}</time>{minha && (Number(item.lida) ? <CheckCheck size={14} className="text-[#4CAF50]" aria-label="Lida"/> : <Check size={14} aria-label="Enviada"/>)}</div></div></div>
                            </div>
                        })}
                        {mensagemPendente && <div className="flex justify-end">
                            <div className="max-w-[88%] sm:max-w-[78%]">
                                <p className="whitespace-pre-wrap break-words rounded-[20px] rounded-br-sm bg-[#724BC2]/75 px-4 py-3 text-sm text-white">{mensagemPendente}</p>
                                <span className="mt-1 block text-right text-[11px] text-[#536252]">Enviando…</span>
                            </div>
                        </div>}
                        <div ref={fim}/>
                    </div>
                    <form onSubmit={enviar} className="relative flex items-end gap-2 bg-white p-4">
                        {emojis && <div className="absolute bottom-full left-4 grid max-h-48 grid-cols-8 gap-1 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-3 shadow-lg">{['😊', '👍', '♻️', '🤝', '💚', '🌱', '🌿', '🌎', '🌍', '🌳', '🍃', '🌻', '🌼', '🌸', '🐝', '🐢', '🦋', '🐬', '🌊', '💧', '☀️', '🌤️', '🌈', '🪴', '🪻', '🧹', '🧴', '🫙', '📦', '🛍️', '👕', '👖', '👟', '📚', '🔋', '🪫', '🚲', '🚶', '🏡', '❤️'].map(emoji => <button type="button" key={emoji} aria-label={`Inserir ${emoji}`} onClick={() => { setTexto(valor => (valor + emoji).slice(0, 2000)); setEmojis(false); campo.current?.focus() }} className="rounded p-1 text-xl hover:bg-gray-100">{emoji}</button>)}</div>}
                        <div className="flex flex-1 items-end gap-2 rounded-[24px] bg-[#F3F4F6] px-4 py-2"><textarea ref={campo} rows={1} maxLength={2000} disabled={enviando} value={texto} onChange={event => setTexto(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form.requestSubmit() } }} aria-label="Mensagem" placeholder={`Digite sua mensagem para ${contato?.split(' ')[0] || 'o anunciante'}...`} className="max-h-32 min-h-8 w-full resize-none overflow-y-auto bg-transparent py-1 text-sm outline-none placeholder:text-[#73806F]"/><button type="button" disabled={enviando} onClick={() => setEmojis(valor => !valor)} aria-label="Inserir emoji" aria-expanded={emojis} className="py-1 text-[#73806F]"><Smile size={22}/></button></div>
                        <button type="submit" disabled={enviando || !texto.trim()} aria-label="Enviar mensagem" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#724BC2] text-white shadow-md hover:bg-[#603ca8] disabled:cursor-not-allowed disabled:opacity-40">{enviando ? <RefreshCw size={20} className="animate-spin"/> : <Send size={21}/>}</button>
                    </form>
                </> : <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-[#F0F0F0] p-8 text-center"><MessageSquare size={44} className="text-[#724BC2]"/><h2 className="text-xl font-semibold">Suas conversas, em um só lugar</h2><p className="max-w-xs text-sm leading-relaxed text-[#73806F]">Selecione uma conversa ou encontre um anúncio para falar com o anunciante.</p><button onClick={() => onNavegar('home')} className="rounded-full bg-[#724BC2] px-5 py-2.5 text-sm font-semibold text-white">Explorar anúncios</button></div>}
            </div>
        </div></>}
    </section>
}
