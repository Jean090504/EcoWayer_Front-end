import { geracaoSessao, encerrarSessaoInvalida } from './sessionService.js'

const RAW_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "")
const API_URL = RAW_URL.replace(/\/meraki\/ecowayer\/user$/, "")
const API_BASE_URL = `${API_URL}/meraki/ecowayer/user`

export function abrirEventosMensagens() {
    return new EventSource(`${API_BASE_URL}/mensagens/eventos`, { withCredentials: true })
}

export const urlImagem = valor => /^\/(?:uploads|catalogo-demo)\//.test(valor || '') ? `${API_URL}${valor}` : valor

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
        const mensagemPadrao = resposta.status === 429
            ? 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.'
            : `Não foi possível concluir a operação (HTTP ${resposta.status}).`
        const erro = new Error(dados.erro?.mensagem || dados.field || dados.message || mensagemPadrao)
        erro.status = resposta.status
        throw erro
    }
    return dados
}
