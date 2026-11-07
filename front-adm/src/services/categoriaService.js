import { apiFetch } from "./api.js"
const URL_API = "http://localhost:8080/meraki/ecowayer/admin/categoria"

export async function atualizarCategoriaPontos(id, categoria, pontos) {
  return apiFetch(`/categoria/${id}`, { method: "PUT", body: JSON.stringify({ nome: categoria.nome, pontos, id_tipo_categoria: categoria.id_tipo_categoria, img: categoria.img }) })
}

export async function excluirCategoria(id) {
  return apiFetch(`/categoria/${id}`, { method: "DELETE" })
}

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

const URL_ITEM = "http://localhost:8080/meraki/ecowayer/admin/item" // ajuste para a sua rota real

export async function criarItem({ nome, descricao, pontos_base, status, id_categoria, img }) {
  const resposta = await fetch(URL_ITEM, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, descricao, pontos_base, status, id_categoria, img })
  })

  const dados = await resposta.json().catch(() => null)

  if (!resposta.ok || !dados?.status) {
    throw new Error(dados?.message ?? "Erro ao criar item")
  }

  return dados
}
