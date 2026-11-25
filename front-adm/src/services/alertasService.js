import { apiFetch } from './api.js'

export function textosVinculadosAoAlerta(alerta) {
  const mensagens = [
    ...(alerta.mensagem ?? []),
    ...(alerta.denuncia ?? []).flatMap((denuncia) => denuncia.mensagem ?? []),
  ]
  return [...new Set(mensagens.map((mensagem) => mensagem.texto?.trim()).filter(Boolean))]
}

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

export async function atualizarStatusUsuario(id, status) {
  const dados = await apiFetch(`/usuario/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  return dados.response.status_usuario
}
