const BASE_URL = "http://localhost:8080/meraki/ecowayer/admin"

export async function listarRegras() {
  const resp = await fetch(`${BASE_URL}/regra-pontuacao`)
  const json = await resp.json()

  if (!resp.ok || !json.status) {
    throw new Error(json.message || "Erro ao buscar as regras de pontuação")
  }

  return json.response.regra_pontuacao
}

export async function atualizarStatusRegra(id, status) {
  const resp = await fetch(`${BASE_URL}/regra-pontuacao/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  })
  const json = await resp.json()

  if (!resp.ok || !json.status) {
    throw new Error(json.message || "Erro ao atualizar o status da regra")
  }

  return json
}

async function enviar(url, method, body) {
    const resp = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
    const json = await resp.json()
  
    if (!resp.ok || !json.status) {
      throw new Error(json.message || "Erro ao salvar a regra de pontuação")
    }
  
    return json.response
  }
  
  export const criarRegra = (dados) => enviar(`${BASE_URL}/regra-pontuacao`, "POST", dados)
  
  export const atualizarRegra = (id, dados) => enviar(`${BASE_URL}/regra-pontuacao/${id}`, "PUT", dados)
  
  export async function listarCategorias() {
    const resp = await fetch(`${BASE_URL}/categoria`)
    const json = await resp.json()
  
    if (!resp.ok || !json.status) {
      throw new Error(json.message || "Erro ao buscar as categorias")
    }
  
    return json.response.categoria
  }