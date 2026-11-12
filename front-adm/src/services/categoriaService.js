import { apiFetch } from "./api.js"

export async function atualizarCategoriaPontos(id, categoria, pontos) {
  return apiFetch(`/categoria/${id}`, { method: "PUT", body: JSON.stringify({ nome: categoria.nome, pontos, id_tipo_categoria: categoria.id_tipo_categoria, img: categoria.img }) })
}

export async function excluirCategoria(id) {
  return apiFetch(`/categoria/${id}`, { method: "DELETE" })
}

export async function listarCategorias() {
  const dados = await apiFetch("/categoria")
  return dados.response.categoria
}

export async function buscarCategoria(id) {
  const lista = await listarCategorias()
  return lista.find((c) => String(c.id) === String(id)) ?? null
}

export async function criarCategoria({ nome, pontos, id_tipo_categoria, img }) {
  return apiFetch("/categoria", {
    method: "POST",
    body: JSON.stringify({ nome, pontos, id_tipo_categoria, img })
  })
}

export async function criarItem({ nome, descricao, pontos_base, status, id_categoria, img }) {
  return apiFetch("/item", {
    method: "POST",
    body: JSON.stringify({ nome, descricao, pontos_base, status, id_categoria, img })
  })
}

export async function atualizarItem(id, { nome, descricao, pontos_base, status, img }) {
  return apiFetch(`/item/${id}`, { method: "PUT", body: JSON.stringify({ nome, descricao, pontos_base, status, img }) })
}

export async function excluirItem(id) {
  return apiFetch(`/item/${id}`, { method: "DELETE" })
}
