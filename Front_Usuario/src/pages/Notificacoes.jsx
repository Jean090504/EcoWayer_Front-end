import { useEffect, useState } from 'react'
import { Bell, CheckCheck, Trash2 } from 'lucide-react'
import { atualizarLeitura, excluirNotificacao, listarNotificacoes } from '../services/notificacoesService.js'

const FILTROS = [
    { id: 'todas', nome: 'Todas' },
    { id: 'naoLidas', nome: 'Não lidas', lida: false },
    { id: 'lidas', nome: 'Lidas', lida: true }
]

const NOMES_TIPO = {
    mensagem: 'Mensagem',
    pontos: 'Pontos',
    proposta: 'Proposta',
    denuncia: 'Denúncia',
    sistema: 'Sistema'
}

const formatoData = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

function formatarData(valor) {
    if (!valor) return 'Data indisponível'
    const iso = valor.replace(' ', 'T')
    const data = new Date(/(?:Z|[+-]\d{2}:?\d{2})$/i.test(iso) ? iso : iso + 'Z')
    return Number.isNaN(data.getTime()) ? 'Data indisponível' : formatoData.format(data)
}

export default function Notificacoes() {
    const [itens, setItens] = useState(null)
    const [filtro, setFiltro] = useState(FILTROS[0])
    const [tipo, setTipo] = useState('')
    const [erro, setErro] = useState('')
    const [tentativa, setTentativa] = useState(0)
    const [ocupado, setOcupado] = useState(false)

    useEffect(() => {
        let ativo = true
        listarNotificacoes()
            .then(lista => { if (ativo) setItens(lista) })
            .catch(falha => { if (ativo) setErro(falha.message) })
        return () => { ativo = false }
    }, [tentativa])

    const lista = itens ?? []
    const naoLidas = lista.filter(item => !item.lida)
    const tipos = [...new Set(lista.map(item => item.tipo))]
    const tipoAtivo = tipos.includes(tipo) ? tipo : ''
    const visiveis = lista.filter(item => (filtro.lida === undefined || filtro.lida === item.lida)
        && (!tipoAtivo || tipoAtivo === item.tipo))

    async function executar(acao) {
        setOcupado(true)
        setErro('')
        try {
            await acao()
        } catch (falha) {
            setErro(falha.message)
        } finally {
            setOcupado(false)
        }
    }

    async function marcar(item, lida) {
        await atualizarLeitura(item.id, lida)
        setItens(atuais => atuais.map(atual => atual.id === item.id ? { ...atual, lida } : atual))
    }

    async function marcarTodas() {
        let falhas = 0
        for (const item of naoLidas) {
            try { await marcar(item, true) } catch { falhas++ }
        }
        if (falhas) throw new Error('Algumas notificações não puderam ser marcadas. Tente novamente.')
    }

    async function excluir(item) {
        if (!window.confirm('Excluir esta notificação?')) return
        await executar(async () => {
            await excluirNotificacao(item.id)
            setItens(atuais => atuais.filter(atual => atual.id !== item.id))
        })
    }

    return (
        <div className="flex flex-1 justify-center bg-[#FAF8FF]">
            <section className="w-[90%] max-w-[1000px] py-8 sm:py-10">
                <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#191C1E]">Notificações</h1>
                        {itens && <p className="mt-1 text-sm text-[#724BC2]">{naoLidas.length} {naoLidas.length === 1 ? 'não lida' : 'não lidas'}</p>}
                    </div>
                    <button type="button" disabled={ocupado || naoLidas.length === 0} onClick={() => executar(marcarTodas)} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#724BC2] shadow-sm disabled:opacity-50">
                        <CheckCheck size={17} aria-hidden="true" /> Marcar todas como lidas
                    </button>
                </header>

                {erro && <div role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                    {erro}{' '}
                    {!itens && <button type="button" className="underline" onClick={() => { setErro(''); setTentativa(valor => valor + 1) }}>Tentar novamente</button>}
                </div>}
                {!itens && !erro && <p role="status">Carregando notificações...</p>}

                {itens && <>
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-3 shadow-sm">
                        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por leitura">
                            {FILTROS.map(opcao => (
                                <button key={opcao.id} type="button" aria-pressed={filtro.id === opcao.id} onClick={() => setFiltro(opcao)}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold ${filtro.id === opcao.id ? 'bg-[#724BC2] text-white' : 'text-[#191C1E] hover:bg-gray-100'}`}>
                                    {opcao.nome}
                                </button>
                            ))}
                        </div>
                        {tipos.length > 0 && <select aria-label="Filtrar por tipo" value={tipoAtivo} onChange={evento => setTipo(evento.target.value)}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
                            <option value="">Todos os tipos</option>
                            {tipos.map(valor => <option key={valor} value={valor}>{NOMES_TIPO[valor] || valor}</option>)}
                        </select>}
                    </div>

                    {visiveis.length === 0 && <p role="status" className="rounded-2xl bg-white p-6 text-sm text-gray-600 shadow-sm">
                        {lista.length === 0 ? 'Você ainda não tem notificações.' : 'Nenhuma notificação corresponde ao filtro.'}
                    </p>}

                    <ul className="space-y-3">
                        {visiveis.map(item => (
                            <li key={item.id} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm sm:gap-4 sm:p-5">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1E9FB] text-[#724BC2]">
                                    <Bell size={19} aria-hidden="true" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                        <h2 className="text-sm font-bold text-[#191C1E]">{NOMES_TIPO[item.tipo] || item.tipo}</h2>
                                        <span className={`rounded-full px-2 py-0.5 text-xs ${item.lida ? 'bg-gray-100 text-gray-600' : 'bg-[#F1E9FB] font-semibold text-[#724BC2]'}`}>
                                            {item.lida ? 'Lida' : 'Não lida'}
                                        </span>
                                        <span className="text-xs text-gray-600">{formatarData(item.data_criacao)}</span>
                                    </div>
                                    <p className="mt-2 whitespace-pre-wrap break-words text-sm text-[#191C1E]">{item.texto}</p>
                                    <details className="mt-2 text-xs text-gray-600">
                                        <summary className="cursor-pointer">Detalhes</summary>
                                        <dl className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                                            <div><dt className="inline font-semibold">Notificação </dt><dd className="inline">#{item.id}</dd></div>
                                            <div><dt className="inline font-semibold">Usuário </dt><dd className="inline">#{item.id_usuario}</dd></div>
                                            <div><dt className="inline font-semibold">Tipo </dt><dd className="inline">{item.tipo}</dd></div>
                                        </dl>
                                    </details>
                                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold">
                                        <button type="button" disabled={ocupado} onClick={() => executar(() => marcar(item, !item.lida))} className="text-[#724BC2] hover:underline disabled:opacity-50">
                                            {item.lida ? 'Marcar como não lida' : 'Marcar como lida'}
                                        </button>
                                        <button type="button" disabled={ocupado} onClick={() => excluir(item)} className="inline-flex items-center gap-1 text-red-700 hover:underline disabled:opacity-50">
                                            <Trash2 size={14} aria-hidden="true" /> Excluir
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>}
            </section>
        </div>
    )
}
