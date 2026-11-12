// src/services/pontos.js
import { apiFetch } from './api.js'

export async function listarCategoriasParaRegra() {
  const dados = await apiFetch('/categoria')
  return dados.response?.categoria || []
}

export async function criarRegraPontuacao(dados) {
  return apiFetch('/regra-pontuacao', {
    method: 'POST',
    body: JSON.stringify(dados)
  })
}

export async function listarRegrasPontuacao() {
  const dados = await apiFetch('/regra-pontuacao')
  return dados.response?.regra_pontuacao || []
}

export async function listarCondicoes() {
  const dados = await apiFetch('/condicao-item')
  return dados.response?.condicao_item || []
}

export async function atualizarRegraPontuacao(id, dados) {
  return apiFetch(`/regra-pontuacao/${id}`, { method: 'PUT', body: JSON.stringify(dados) })
}

export async function atualizarStatusRegra(id, status) {
  return apiFetch(`/regra-pontuacao/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
}

export async function calcularPontuacao(dados) {
  const resposta = await apiFetch('/regra-pontuacao/calcular', { method: 'POST', body: JSON.stringify(dados) })
  return resposta.response
}

/**
 * Busca todas as métricas dos cards, conversão e lista de registros formatada
 * Rota: GET /meraki/ecowayer/admin/pontos/dashboard
 */
export async function getDashboardPontos() {
  return apiFetch('/pontos/dashboard')
}

/**
 * Lista todos os lançamentos de pontos
 * Rota: GET /meraki/ecowayer/admin/pontos
 */
export async function listarPontos() {
  return apiFetch('/pontos')
}

/**
 * Busca uma pontuação pelo ID
 * Rota: GET /meraki/ecowayer/admin/pontos/:id
 */
export async function buscarPontoPorId(id) {
  return apiFetch(`/pontos/${id}`)
}

/**
 * Cadastra uma nova pontuação / validação
 * Rota: POST /meraki/ecowayer/admin/pontos
 * @param {Object} dados - { qntd_pontos, id_categoria, id_usuario }
 */
export async function criarPonto(dados) {
  return apiFetch('/pontos', {
    method: 'POST',
    body: JSON.stringify(dados)
  })
}


/**
 * Atualiza um registro de pontuação existente
 * Rota: PUT /meraki/ecowayer/admin/pontos/:id
 * @param {number|string} id
 * @param {Object} dados - { qntd_pontos, id_categoria }
 */
export async function atualizarPonto(id, dados) {
  return apiFetch(`/pontos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados)
  })
}

/**
 * Remove um registro de pontos
 * Rota: DELETE /meraki/ecowayer/admin/pontos/:id
 */
export async function excluirPonto(id) {
  return apiFetch(`/pontos/${id}`, {
    method: 'DELETE'
  })
}

export async function atualizarTaxaConversao(dados) {
  return apiFetch('/pontos/taxa', {
    method: 'PUT',
    body: JSON.stringify(dados)
  })
}
