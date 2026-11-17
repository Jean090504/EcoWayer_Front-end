export const EVENTO_SESSAO_EXPIRADA = 'ecowayer:sessao-expirada'
const CHAVE_EXPIRADA = 'ecowayer_sessao_expirada'
let geracao = 0
let encerramento = null

export const geracaoSessao = () => geracao
export const sessaoFoiEncerrada = () => sessionStorage.getItem(CHAVE_EXPIRADA) === '1'

export function registrarNovaSessao() {
    geracao += 1
    sessionStorage.removeItem(CHAVE_EXPIRADA)
    sessionStorage.removeItem('ecowayer_token')
}

export function limparSessaoLocal() {
    geracao += 1
    sessionStorage.removeItem(CHAVE_EXPIRADA)
    sessionStorage.removeItem('ecowayer_usuario')
    sessionStorage.removeItem('ecowayer_token')
}

export function encerrarSessaoInvalida(baseUrl) {
    if (encerramento) return encerramento
    if (sessaoFoiEncerrada()) return Promise.resolve()
    sessionStorage.removeItem('ecowayer_usuario')
    sessionStorage.removeItem('ecowayer_token')
    sessionStorage.setItem(CHAVE_EXPIRADA, '1')
    // O cookie HttpOnly só pode ser removido pelo backend.
    encerramento = fetch(`${baseUrl}/usuario/logout`, {
        method: 'POST', credentials: 'include', signal: AbortSignal.timeout(5000)
    }).catch(() => {}).finally(() => { encerramento = null })
    window.dispatchEvent(new CustomEvent(EVENTO_SESSAO_EXPIRADA, { detail: { encerramento } }))
    return encerramento
}
