// O POST confirmado nunca volta a ser tratado como uma mensagem não enviada.
export async function enviarComAtualizacao({ enviar, confirmar, atualizar }) {
    const mensagem = await enviar()
    confirmar(mensagem)
    try {
        await atualizar()
        return { enviada: true }
    } catch (erroAtualizacao) {
        return { enviada: true, erroAtualizacao }
    }
}

export const INTERVALO_CONVERSAS = 30000
export const INTERVALO_MENSAGENS = 15000
