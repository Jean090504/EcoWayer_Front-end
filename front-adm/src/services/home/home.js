const BASE = "http://localhost:8080/meraki/ecowayer/admin"

// Busca uma lista no back. Os endpoints devolvem { status, response: { count, <lista> } },
// então pego o primeiro array de "response" sem depender do nome da chave.
// O back responde 404 quando não há registros: aqui isso vira lista vazia, não erro.
async function buscarLista(caminho, signal) {
  const res = await fetch(`${BASE}/${caminho}`, { signal })

  if (res.status === 404) return []
  if (!res.ok) throw new Error(`Erro ${res.status} ao buscar ${caminho}`)

  const data = await res.json()
  if (!data.status) throw new Error(`A API retornou status inválido em ${caminho}`)

  return Object.values(data.response ?? {}).find(Array.isArray) ?? []
}

export const listarAcessos = (signal) => buscarLista("acesso", signal)
export const listarPontos = (signal) => buscarLista("pontos", signal)
export const listarUsuarios = (signal) => buscarLista("usuario", signal)