import { apiFetch } from './api.js'

export async function listarAlertas() {
  try {
    const data = await apiFetch('/alertas')
    return data?.response?.alertas || []
  } catch (error) {
    if (/404/.test(error.message)) return []
    throw error
  }
}

export async function atualizarAlerta(id, dados) {
  return apiFetch(`/alertas/${id}`, { method: 'PUT', body: JSON.stringify(dados) })
}
