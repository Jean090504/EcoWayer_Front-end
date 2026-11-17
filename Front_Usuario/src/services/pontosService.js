import { apiFetch } from './api.js'

export async function buscarPontosUsuario(idUsuario) {
  if (!Number.isSafeInteger(Number(idUsuario)) || Number(idUsuario) <= 0) {
    throw new Error('Entre na sua conta para consultar seus pontos.')
  }
  let dados
  try {
    dados = await apiFetch('/pontos')
  } catch (erro) {
    // A listagem do backend responde 404 quando não há registros.
    if (erro.status === 404) return []
    throw erro
  }
  if (!Array.isArray(dados.response?.pontos)) {
    throw new Error('Não foi possível ler os pontos retornados pela API.')
  }
  // GET /pontos/:id busca o registro, não o usuário.
  return dados.response.pontos.filter((ponto) => String(ponto.id_usuario) === String(idUsuario))
}

export function resumirPontos(registros, agora = new Date()) {
  let total = 0
  let pontosMes = 0
  const transacoes = registros.map((registro) => {
    const pontos = Number(registro.qntd_pontos)
    if (!Number.isFinite(pontos) || pontos <= 0) throw new Error('Registro de pontos inválido.')
    const data = new Date(String(registro.data_registro).replace(' ', 'T'))
    total += pontos
    if (data.getFullYear() === agora.getFullYear() && data.getMonth() === agora.getMonth()) pontosMes += pontos
    const entrega = registro.id_entrega != null
    return {
      id: registro.id,
      tipo: entrega ? 'entrega' : 'credito',
      icone: 'reciclagem',
      cor: 'verde',
      titulo: entrega ? `Pontos da entrega #${registro.id_entrega}` : 'Crédito de pontos',
      status: 'Creditado',
      local: `Categoria #${registro.id_categoria}`,
      quando: Number.isNaN(data.getTime()) ? 'Data não informada' : data.toLocaleDateString('pt-BR'),
      data: data.getTime(),
      pontos,
      detalhe: `Registro #${registro.id}`,
    }
  }).sort((a, b) => (b.data || 0) - (a.data || 0))
  return { total, pontosMes, transacoes }
}
