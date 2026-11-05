const URL_ALERTAS = "http://localhost:8080/meraki/ecowayer/admin/alertas"

export async function listarAlertas(signal) {
  const res = await fetch(URL_ALERTAS, { signal })
  if (!res.ok) throw new Error(`Erro ${res.status} ao buscar alertas`)

  const data = await res.json()
  if (!data.status) throw new Error("A API retornou status inválido")

  return data.response.alertas ?? []
}

export async function atualizarAlerta(id, dados) {
  const res = await fetch(`${URL_ALERTAS}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  })

  const data = await res.json()
  if (!res.ok || !data.status) throw new Error(data.message ?? `Erro ${res.status} ao atualizar alerta`)

  return data.response // alerta completo, já montado pelo back
}