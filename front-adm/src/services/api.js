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

  const response = await fetch(url, {
    ...options,
    headers
  })

  if (response.status === 401) {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    window.location.reload()
    throw new Error('Sessão expirada. Faça login novamente.')
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || `Erro HTTP: ${response.status}`)
  }

  return data
}