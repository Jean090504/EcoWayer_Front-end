export function registrarMensagemEnviada(mensagens, mensagem) {
    if (!mensagem?.id || mensagens.some(item => String(item.id) === String(mensagem.id))) return mensagens
    return [...mensagens, mensagem]
}

export const INTERVALO_CONVERSAS = 30000
export const INTERVALO_MENSAGENS = 15000
