import { apiFetch } from './api.js'

async function listar(endpoint, chave) {
    try {
        const dados = await apiFetch(endpoint)
        return dados.response?.[chave] || []
    } catch (erro) {
        if (erro.status === 404) return []
        throw erro
    }
}

export const listarConversas = id => listar(`/conversa?id_usuario=${Number(id)}`, 'conversa')
export const listarMensagens = id => listar(`/mensagens?id_conversa=${Number(id)}`, 'mensagem')
export async function criarConversa(idAnuncio, idUsuario) {
    const dados = await apiFetch('/conversa', { method: 'POST', body: JSON.stringify({ id_anuncio: Number(idAnuncio), id_usuario: Number(idUsuario) }) })
    return dados.response.conversa
}
export async function enviarMensagem(idConversa, idRemetente, texto) {
    const dados = await apiFetch('/mensagens', { method: 'POST', body: JSON.stringify({ id_conversa: Number(idConversa), id_remetente: Number(idRemetente), texto }) })
    return dados.response.mensagem
}
export const marcarLida = id => apiFetch(`/mensagens/${id}`, { method: 'PUT', body: JSON.stringify({ lida: true }) })
