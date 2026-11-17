import { apiFetch } from './api.js'

export async function denunciarAnuncio(idAnuncio, { motivo, descricao, arquivos = [] }) {
    const body = new FormData()
    body.append('motivo', motivo)
    body.append('descricao', descricao || '')
    arquivos.forEach(arquivo => body.append('arquivos', arquivo))

    // FormData: o apiFetch já remove o Content-Type automaticamente
    return apiFetch(`/anuncio/${idAnuncio}/denuncia`, { method: 'POST', body })
}