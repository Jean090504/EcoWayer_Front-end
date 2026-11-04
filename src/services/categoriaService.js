const URL_API = "http://localhost:8080/meraki/ecowayer/admin/categoria"

export async function listarCategorias() {
  const resposta = await fetch(URL_API)
  const dados = await resposta.json()

  if (!dados.status) throw new Error("Erro ao buscar categorias")

  return dados.response.categoria
}

export async function buscarCategoria(id) {
  const lista = await listarCategorias()
  return lista.find((c) => String(c.id) === String(id)) ?? null
}

export async function criarCategoria({ nome, pontos, id_tipo_categoria, img }) {
  const resposta = await fetch(URL_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, pontos, id_tipo_categoria, img })
  })

  const dados = await resposta.json()

  if (!dados.status) throw new Error("Erro ao criar categoria")

  return dados
}