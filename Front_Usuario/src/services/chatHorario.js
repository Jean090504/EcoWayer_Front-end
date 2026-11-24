function dataMensagem(valor) {
    if (typeof valor !== 'string' || !valor.trim()) return null
    const iso = valor.trim().replace(' ', 'T')
    const temFuso = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(iso)
    const data = new Date(temFuso ? iso : iso + 'Z')
    return Number.isNaN(data.getTime()) ? null : data
}

export function horario(valor) {
    return dataMensagem(valor)?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) ?? ''
}

export function dia(valor) {
    return dataMensagem(valor)?.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }) ?? ''
}
