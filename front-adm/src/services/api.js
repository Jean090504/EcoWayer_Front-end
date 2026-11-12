// src/services/api.js

// Garante que o prefixo '/meraki/ecowayer/admin' sempre esteja presente
const RAW_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const BASE_ORIGIN = RAW_URL.replace(/\/+$/, '').replace('/meraki/ecowayer/admin', '')
const API_BASE_URL = `${BASE_ORIGIN}/meraki/ecowayer/admin`

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  }

  // endpoint deve começar com '/'
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  let response
  try {
    response = await fetch(url, {
      ...options,
      headers
    })
  } catch {
    throw new Error(`Não foi possível conectar à API Admin em ${BASE_ORIGIN}. Inicie o backend Admin e tente novamente.`)
  }

  // No login, o 401 precisa voltar para a tela para que ela mostre a mensagem.
  // Nas demais rotas, a sessão expirada deve levar o usuário ao login.
  if (response.status === 401 && !endpoint.includes('/acesso/login')) {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    window.dispatchEvent(new Event('auth:expired'))
    throw new Error('Sessão expirada. Faça login novamente.')
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || `Erro HTTP: ${response.status}`)
  }

  return data
}
