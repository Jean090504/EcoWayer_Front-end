let geracao = 0
export const geracaoSessao = () => geracao

export function lerToken() {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token')
  if (token) sessionStorage.setItem('token', token)
  localStorage.removeItem('token')
  return token
}

export function salvarSessao(token) {
  geracao++
  localStorage.removeItem('token')
  sessionStorage.setItem('token', token)
}

export function limparSessao() {
  geracao++
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
}

export function encerrarSeAtual(geracaoRequisicao, tokenRequisicao) {
  if (geracaoRequisicao !== geracao || tokenRequisicao !== lerToken()) return false
  limparSessao()
  window.dispatchEvent(new Event('auth:expired'))
  return true
}
