const RAW_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "")
const API_URL = RAW_URL.replace(/\/meraki\/ecowayer\/user$/, "")
const API_BASE_URL = `${API_URL}/meraki/ecowayer/user`

export async function apiFetch(endpoint, options = {}) {
    const token = sessionStorage.getItem("ecowayer_token")
    const resposta = await fetch(`${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`, {
        ...options,
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) }
    })
    const dados = await resposta.json().catch(() => ({}))
    if (!resposta.ok) throw new Error(dados.erro?.mensagem || dados.message || "Não foi possível concluir a operação.")
    return dados
}
