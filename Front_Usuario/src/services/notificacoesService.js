import { apiFetch } from './api.js'

export async function listarNotificacoes() {
    try {
        const dados = await apiFetch('/notificacao')
        const lista = dados.response?.notificacao
        if (!Array.isArray(lista)) throw new Error('A API retornou uma lista de notificações inválida.')
        return lista.map(item => ({ ...item, lida: item.lida === true || Number(item.lida) === 1 }))
    } catch (erro) {
        if (erro.status === 404) return []
        throw erro
    }
}

export function atualizarLeitura(id, lida) {
    return apiFetch(`/notificacao/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify({ lida })
    })
}

export function excluirNotificacao(id) {
    return apiFetch(`/notificacao/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
