import { geracaoSessao, encerrarSessaoInvalida } from './sessionService.js'

const RAW_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "")
const API_URL = RAW_URL.replace(/\/meraki\/ecowayer\/user$/, "")
const API_BASE_URL = `${API_URL}/meraki/ecowayer/user`

export const urlImagem = valor => valor?.startsWith('/uploads/') ? `${API_URL}${valor}` : valor

export async function apiFetch(endpoint, options = {}) {
    const geracaoRequisicao = geracaoSessao()
    const token = sessionStorage.getItem('ecowayer_token')
    const multipart = options.body instanceof FormData
    let resposta
    try {
        resposta = await fetch(`${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`, {
            ...options,
            credentials: 'include',
            headers: { ...(!multipart ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) }
        })
    } catch {
        throw new Error(`Não foi possível conectar à API em ${API_URL}. Verifique se o backend está em execução e se permite a origem do frontend no CORS.`)
    }
    const dados = await resposta.json().catch(() => ({}))
    if (!resposta.ok) {
        const caminho = `/${endpoint.replace(/^\//, '')}`.split('?')[0]
        if (resposta.status === 401 && !['/usuario/login', '/usuario/logout'].includes(caminho) && geracaoRequisicao === geracaoSessao()) {
            // A tela é notificada imediatamente; o novo login aguarda o logout terminar.
            encerrarSessaoInvalida(API_BASE_URL)
        }
        const erro = new Error(dados.erro?.mensagem || dados.field || dados.message || "Não foi possível concluir a operação.")
        erro.status = resposta.status
        throw erro
    }
    return dados
}
