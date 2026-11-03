const URL_API = "http://localhost:8080/meraki/ecowayer/admin/categoria"

export async function listarCategorias() {
  const resposta = await fetch(URL_API)
  const dados = await resposta.json()

  if (!dados.status) throw new Error("Erro ao buscar categorias")

  return dados.response.categoria
}

export async function criarCategoria({ nome, id_tipo_categoria, arquivo }) {
  const formData = new FormData()
  formData.append("nome", nome)
  formData.append("id_tipo_categoria", id_tipo_categoria)
  if (arquivo) formData.append("img", arquivo)

  const resposta = await fetch(URL_API, {
    method: "POST",
    body: formData
  })

  const dados = await resposta.json()

  if (!dados.status) throw new Error("Erro ao criar categoria")

  return dados
}