const RAW_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "")
const API_URL = RAW_URL.replace(/\/meraki\/ecowayer\/user$/, "")
const API_BASE_URL = `${API_URL}/meraki/ecowayer/user`

export async function apiFetch(endpoint, options = {}) {
    const resposta = await fetch(`${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`, {
        ...options,
        credentials: "include",
        headers: { "Content-Type": "application/json", ...(options.headers || {}) }
    })
    const dados = await resposta.json().catch(() => ({}))
    if (!resposta.ok) throw new Error(dados.erro?.mensagem || dados.message || dados.field || "Não foi possível concluir a operação.")
    return dados
}
