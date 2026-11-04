// src/services/pontos.js
import { apiFetch } from './api.js'

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