const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "")

export async function apiFetch(endpoint, options = {}) {
    const token = sessionStorage.getItem("ecowayer_token")
    const resposta = await fetch(`${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`, {
        ...options,
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) }
    })
    const dados = await resposta.json().catch(() => ({}))
    if (!resposta.ok) throw new Error(dados.erro?.mensagem || dados.message || "Não foi possível concluir a operação.")
    return dados
}
