import { useEffect, useState } from 'react'
import { apiFetch } from '../services/api.js'
import { iniciarPagamentoTeste } from '../services/userService.js'

const estados = { pending: 'Aguardando pagamento', in_process: 'Em análise', authorized: 'Aguardando aprovação', approved: 'Pago', rejected: 'Recusado', cancelled: 'Cancelado', refunded: 'Estornado', charged_back: 'Contestado' }
const entregas = { aguardando_pagamento: 'Aguardando pagamento', aguardando_entrega: 'Combine a entrega pelo chat', entregue: 'Entregue', problema: 'Problema relatado — entrega bloqueada' }
const botao = 'rounded-xl bg-[#724BC2] px-4 py-2 text-white disabled:opacity-50'

export default function MeusPedidos({ usuario, onEntrar, onNavegar }) {
    const [pedidos, setPedidos] = useState([])
    const [aba, setAba] = useState('comprador')
    const [erro, setErro] = useState('')
    const [aviso, setAviso] = useState('')
    const [carregando, setCarregando] = useState(true)
    const [ocupado, setOcupado] = useState(false)
    const [codigos, setCodigos] = useState({})
    const [digitados, setDigitados] = useState({})
    const [motivos, setMotivos] = useState({})
    const [agora, setAgora] = useState(() => Date.now())
    const idUsuario = usuario?.id

    useEffect(() => {
        if (!idUsuario) return
        let ativo = true
        async function carregar() {
            try {
                const id = new URLSearchParams(window.location.search).get('pedido')
                if (id) await apiFetch(`/pedidos/${encodeURIComponent(id)}/atualizar`, { method: 'POST' })
            } catch (e) { if (ativo) setErro(e.message) }
            try {
                const dados = await apiFetch('/pedidos')
                if (ativo) setPedidos(dados.pedidos)
            } catch (e) { if (ativo) setErro(e.message) }
            finally { if (ativo) setCarregando(false) }
        }
        carregar()
        const timer = setInterval(() => setAgora(Date.now()), 1000)
        return () => { ativo = false; clearInterval(timer) }
    }, [idUsuario])

    async function executar(id, acao, body) {
        if (ocupado) return
        setOcupado(true); setErro(''); setAviso('')
        try {
            const dados = await apiFetch(`/pedidos/${id}/${acao}`, { method: 'POST', ...(body ? { body: JSON.stringify(body) } : {}) })
            if (acao === 'codigo') setCodigos(c => ({ ...c, [id]: dados }))
            if (acao === 'confirmar') { setDigitados(c => ({ ...c, [id]: '' })); setAviso('Entrega confirmada com sucesso.') }
            if (dados.message) setAviso(dados.message)
            setPedidos((await apiFetch('/pedidos')).pedidos)
        } catch (e) { setErro(e.message) }
        finally { setOcupado(false) }
    }
    async function pagar(id) {
        if (ocupado) return
        setOcupado(true); setErro('')
        try { window.location.assign(await iniciarPagamentoTeste(id)) }
        catch (e) { setErro(e.message); setOcupado(false) }
    }
    async function conversar(id) {
        if (ocupado) return
        setOcupado(true); setErro('')
        try {
            const dados = await apiFetch(`/pedidos/${id}/conversa`)
            sessionStorage.setItem(`ecowayer_conversa_${idUsuario}`, String(dados.id_conversa))
            onNavegar('chat')
        } catch (e) { setErro(e.message) }
        finally { setOcupado(false) }
    }
    async function recarregar() {
        setOcupado(true); setErro('')
        try { setPedidos((await apiFetch('/pedidos')).pedidos) }
        catch (e) { setErro(e.message) }
        finally { setOcupado(false) }
    }

    if (!usuario) return <section className="mx-auto w-[90%] max-w-4xl py-10"><h1 className="text-2xl font-bold">Meus pedidos</h1><p className="my-4">Entre para acompanhar suas compras e vendas.</p><button className={botao} onClick={onEntrar}>Entrar</button></section>
    const lista = pedidos.filter(p => p.papel === aba)
    return <section className="mx-auto w-[90%] max-w-4xl py-10">
        <h1 className="text-2xl font-bold">Meus pedidos</h1>
        <p className="my-3 rounded-xl bg-amber-50 p-3 text-amber-900">Ambiente de teste do TCC. Use somente contas e cartões de teste. Não há repasse financeiro ao vendedor.</p>
        <div className="my-5 flex flex-wrap gap-3">
            <button className={botao} aria-pressed={aba === 'comprador'} onClick={() => setAba('comprador')}>Minhas compras</button>
            <button className={botao} aria-pressed={aba === 'vendedor'} onClick={() => setAba('vendedor')}>Minhas vendas</button>
            <button className="rounded-xl border px-4 py-2" onClick={() => onNavegar('chat')}>Abrir chat</button>
            <button className="rounded-xl border px-4 py-2" disabled={ocupado} onClick={recarregar}>Atualizar lista</button>
        </div>
        {erro && <p role="alert" className="my-3 text-red-700">{erro}</p>}
        {aviso && <p role="status" className="my-3 text-green-800">{aviso}</p>}
        {carregando ? <p role="status">Carregando pedidos…</p> : !lista.length && <p>Nenhum pedido nesta lista.</p>}
        <div className="space-y-5">{lista.map(p => {
            const liberado = p.status_pagamento === 'approved' && p.status_entrega === 'aguardando_entrega'
            const codigo = codigos[p.id]
            const valido = codigo && new Date(codigo.expira_em).getTime() > agora
            const codigoAtivo = p.codigo_expira_em && new Date(p.codigo_expira_em).getTime() > agora
            return <article key={p.id} className="rounded-2xl border border-gray-200 bg-white p-5 text-gray-800">
                <h2 className="text-xl font-semibold">{p.titulo}</h2>
                <p className="break-all text-xs text-gray-500">Pedido {p.id}</p>
                <p className="my-2 font-semibold">{Number(p.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                <p>Pagamento: {estados[p.status_pagamento] || 'Aguardando atualização'}</p>
                <p>Entrega: {entregas[p.status_entrega] || p.status_entrega}</p>
                {p.entregue_em && <p>Recebimento confirmado em {new Date(p.entregue_em).toLocaleString('pt-BR')}.</p>}
                {p.problema && <p className="my-2 text-amber-800">Relato: {p.problema}. A confirmação está bloqueada. Na demonstração, a análise é manual e não gera reembolso automático.</p>}
                <div className="my-4 flex flex-wrap gap-3">
                    <button className="rounded-xl border px-4 py-2" disabled={ocupado} onClick={() => conversar(p.id)}>Combinar entrega no chat</button>
                    <button className={botao} disabled={ocupado} onClick={() => executar(p.id, 'atualizar')}>Consultar pagamento</button>
                    {aba === 'comprador' && !['approved', 'refunded', 'charged_back'].includes(p.status_pagamento) && !p.entregue_em && <button className={botao} disabled={ocupado} onClick={() => pagar(p.id_anuncio)}>Continuar pagamento de teste</button>}
                </div>
                {liberado && aba === 'comprador' && <div className="rounded-xl bg-purple-50 p-4">
                    <p>Informe o código ao vendedor somente após receber e conferir o produto.</p>
                    {valido && <p role="status" className="my-3 text-3xl font-bold tracking-widest">{codigo.codigo}</p>}
                    {valido && <p>Expira às {new Date(codigo.expira_em).toLocaleTimeString('pt-BR')}.</p>}
                    {!valido && codigoAtivo && <p>Já existe um código ativo. Se você fechou a tela, aguarde até {new Date(p.codigo_expira_em).toLocaleTimeString('pt-BR')} para gerar outro.</p>}
                    <button className={`${botao} mt-3`} disabled={ocupado || !!codigoAtivo} onClick={() => executar(p.id, 'codigo')}>Gerar código de recebimento</button>
                    <details className="mt-4"><summary className="cursor-pointer">Relatar problema</summary>
                        <label className="mt-2 block">O que aconteceu?<textarea className="mt-2 block w-full rounded border p-2" minLength={10} maxLength={2000} value={motivos[p.id] || ''} onChange={e => setMotivos(m => ({ ...m, [p.id]: e.target.value }))} /></label>
                        <button className={`${botao} mt-2`} disabled={ocupado || (motivos[p.id] || '').trim().length < 10} onClick={() => executar(p.id, 'problema', { motivo: motivos[p.id] })}>Registrar problema e bloquear entrega</button>
                    </details>
                </div>}
                {liberado && aba === 'vendedor' && <form onSubmit={e => { e.preventDefault(); executar(p.id, 'confirmar', { codigo: digitados[p.id] }) }}>
                    <label className="block">Código informado pelo comprador após o recebimento
                        <input className="my-2 block rounded border p-2" inputMode="numeric" autoComplete="off" pattern="[0-9]{8}" minLength={8} maxLength={8} required value={digitados[p.id] || ''} onChange={e => setDigitados(c => ({ ...c, [p.id]: e.target.value.replace(/\D/g, '') }))} />
                    </label>
                    <button className={botao} disabled={ocupado}>Confirmar entrega</button>
                </form>}
            </article>
        })}</div>
    </section>
}
