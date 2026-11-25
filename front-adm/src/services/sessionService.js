let geracao = 0
export const geracaoSessao = () => geracao

export function lerToken() {
  // Tokens antigos acessíveis ao JavaScript não são reutilizados.
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
  return sessionStorage.getItem('authenticated')
}

export function salvarSessao() {
  geracao++
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
  sessionStorage.setItem('authenticated', '1')
}

export function limparSessao() {
  geracao++
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('authenticated')
}

export function encerrarSeAtual(geracaoRequisicao) {
  if (geracaoRequisicao !== geracao) return false
  limparSessao()
  window.dispatchEvent(new Event('auth:expired'))
  return true
}
