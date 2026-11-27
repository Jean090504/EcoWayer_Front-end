import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../services/api.js'

const numero = (valor) => Number(valor || 0).toLocaleString('pt-BR')
const data = (valor) => valor ? new Date(valor.replace(' ', 'T')).toLocaleString('pt-BR') : '—'

export default function Usuarios() {
  const [resumo, setResumo] = useState({})
  const [registros, setRegistros] = useState({ usuarios: [], total: 0, pagina: 1, limite: 20 })
  const [busca, setBusca] = useState('')
  const [filtroBusca, setFiltroBusca] = useState('')
  const [status, setStatus] = useState('')
  const [pagina, setPagina] = useState(1)
  const [carregando, setCarregando] = useState(false)
  const [alterando, setAlterando] = useState(null)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')

  const carregar = useCallback(async () => {
    setCarregando(true)
    setErro('')
    try {
      const params = new URLSearchParams({ pagina: String(pagina), limite: '20' })
      if (filtroBusca) params.set('busca', filtroBusca)
      if (status) params.set('status', status)
      const [lista, painel] = await Promise.all([
        apiFetch(`/usuario/gestao?${params}`),
        apiFetch('/pontos/dashboard?period=mensal'),
      ])
      setRegistros(lista.response)
      setResumo(painel.response?.dashboard || {})
    } catch (error) {
      setErro(error.message || 'Não foi possível carregar os usuários.')
    } finally {
      setCarregando(false)
    }
  }, [pagina, filtroBusca, status])

  useEffect(() => { carregar() }, [carregar])

  async function alterarStatus(usuario) {
    const proximo = usuario.status === 'ativo' ? 'desativado' : 'ativo'
    setAlterando(usuario.id)
    setErro('')
    setAviso('')
    try {
      await apiFetch(`/usuario/${usuario.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: proximo }),
      })
      setAviso(`Status de ${usuario.nome} alterado para ${proximo}.`)
      await carregar()
    } catch (error) {
      setErro(error.message || 'Não foi possível alterar o status.')
    } finally {
      setAlterando(null)
    }
  }

  const totalPaginas = Math.max(1, Math.ceil(registros.total / registros.limite))

  return (
    <main className="min-h-full bg-[#f6f7fb] px-5 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-widest text-violet-600">Comunidade</p><h1 className="mt-1 text-3xl font-extrabold text-slate-800">Usuários</h1><p className="mt-2 text-sm text-slate-500">Contas do site e aplicativo no banco compartilhado.</p></div>
          <button type="button" onClick={carregar} disabled={carregando} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">Atualizar</button>
        </div>
        {erro && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{erro}</p>}
        {aviso && <p role="status" className="mb-4 rounded-xl bg-green-50 p-4 text-sm text-green-800">{aviso}</p>}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Cadastrados', resumo.usuariosTotal],
            ['Ativos', resumo.usuariosAtivosTotal],
            ['Desativados', resumo.usuariosInativosTotal],
            ['Novos neste mês', resumo.usuariosCadastrados],
          ].map(([titulo, valor]) => <article key={titulo} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-slate-500">{titulo}</p><p className="mt-2 text-3xl font-extrabold text-slate-800">{carregando ? '—' : numero(valor)}</p></article>)}
        </section>
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <form onSubmit={(event) => { event.preventDefault(); setPagina(1); setFiltroBusca(busca.trim()) }} className="mb-5 flex flex-wrap gap-3">
            <input aria-label="Buscar por nome ou email" value={busca} onChange={(event) => setBusca(event.target.value)} maxLength={120} placeholder="Buscar por nome ou email" className="min-w-56 flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm" />
            <select aria-label="Filtrar por status" value={status} onChange={(event) => { setStatus(event.target.value); setPagina(1) }} className="rounded-xl border border-slate-200 px-4 py-2 text-sm"><option value="">Todos os status</option><option value="ativo">Ativos</option><option value="desativado">Desativados</option></select>
            <button type="submit" className="rounded-xl bg-[#7350B9] px-5 py-2 text-sm font-semibold text-white">Buscar</button>
          </form>
          <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-slate-500"><th className="py-3">Usuário</th><th>Contato</th><th>Cadastro</th><th>Último acesso</th><th>Status</th><th>Ação</th></tr></thead><tbody>{registros.usuarios.map((usuario) => <tr key={usuario.id} className="border-b border-slate-100"><td className="py-4 font-semibold text-slate-800">{usuario.nome} <span className="font-normal text-slate-400">#{usuario.id}</span></td><td><div>{usuario.email || '—'}</div><div className="text-slate-500">{usuario.telefone || ''}</div></td><td>{data(usuario.data_cadastro)}</td><td>{data(usuario.ultimo_acesso)}</td><td><span className={`rounded-full px-2 py-1 text-xs font-semibold ${usuario.status === 'ativo' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{usuario.status || 'sem status'}</span></td><td><button type="button" disabled={alterando === usuario.id || !['ativo', 'desativado'].includes(usuario.status)} onClick={() => alterarStatus(usuario)} className="font-semibold text-violet-700 disabled:opacity-50">{alterando === usuario.id ? 'Salvando…' : usuario.status === 'ativo' ? 'Desativar' : 'Ativar'}</button></td></tr>)}</tbody></table></div>
          {!carregando && !registros.usuarios.length && <p className="py-8 text-center text-sm text-slate-500">Nenhum usuário encontrado.</p>}
          <div className="mt-5 flex items-center justify-between gap-3 text-sm text-slate-500"><span>{numero(registros.total)} resultado(s) · página {pagina} de {totalPaginas}</span><div className="flex gap-2"><button type="button" onClick={() => setPagina(pagina - 1)} disabled={pagina <= 1 || carregando} className="rounded-lg border px-3 py-2 disabled:opacity-40">Anterior</button><button type="button" onClick={() => setPagina(pagina + 1)} disabled={pagina >= totalPaginas || carregando} className="rounded-lg border px-3 py-2 disabled:opacity-40">Próxima</button></div></div>
        </section>
      </div>
    </main>
  )
}
