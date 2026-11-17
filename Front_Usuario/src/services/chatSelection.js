export function conversaDoAnuncio(conversas, anuncio, idUsuario) {
    if (!anuncio || Number(anuncio.id_usuario) === Number(idUsuario)) return null
    return conversaDaPessoa(conversas, idUsuario, anuncio.id_usuario)
}

export function conversaDaPessoa(conversas, idUsuario, idContato) {
    return conversas.find(item =>
        (Number(item.id_interessado) === Number(idUsuario) && Number(item.id_anunciante) === Number(idContato)) ||
        (Number(item.id_anunciante) === Number(idUsuario) && Number(item.id_interessado) === Number(idContato))) || null
}

export function conversaInicial(conversas, idMemorizado) {
    return conversas.find(item => Number(item.id) === Number(idMemorizado) || item.ids_conversas?.includes(Number(idMemorizado))) ||
        conversas.find(item => Number(item.nao_lidas) > 0) || conversas[0] || null
}
