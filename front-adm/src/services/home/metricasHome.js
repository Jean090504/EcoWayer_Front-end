// ---------------------------------------------------------------------------
// Datas: tudo trabalha com texto "YYYY-MM-DD" (comparação simples e sem
// problema de fuso horário). O back devolve datas como "2026-11-05T00:00:00.000Z"
// ou "2026-11-05 14:20:00"; pego só os 10 primeiros caracteres.
// ---------------------------------------------------------------------------
export const dia = (valor) => String(valor ?? "").replace(" ", "T").slice(0, 10)

export const hoje = () => new Date().toLocaleDateString("en-CA") // YYYY-MM-DD (data local)

export const somarDias = (data, n) => {
  const d = new Date(`${data}T12:00:00`)
  d.setDate(d.getDate() + n)
  return d.toLocaleDateString("en-CA")
}

const entre = (data, inicio, fim) => data >= inicio && data <= fim

export const numero = (n) => Number(n ?? 0).toLocaleString("pt-BR")

export function variacaoPercentual(atual, anterior) {
  const v = anterior === 0
    ? (atual > 0 ? 100 : 0)
    : Math.round(((atual - anterior) / anterior) * 100)

  return `${v >= 0 ? "+" : ""}${v}%`
}

// o item pode vir com o usuário aninhado ({ usuario: { id } }) ou só com id_usuario
const idDoUsuario = (item) => Number(item.usuario?.id ?? item.id_usuario)
const quantidade = (p) => Number(p.qntd_pontos ?? p.pontos ?? 0)

// ---------------------------------------------------------------------------
// Cards de cima
// ---------------------------------------------------------------------------
export function calcularCards({ acessos, usuarios }) {
  const h = hoje()

  const unicos = (inicio, fim) =>
    new Set(acessos.filter(a => entre(dia(a.data_acesso), inicio, fim)).map(idDoUsuario)).size

  // Usuários ativos: acessaram nos últimos 30 dias (comparado aos 30 dias anteriores)
  const ativos = unicos(somarDias(h, -29), h)
  const ativosAnterior = unicos(somarDias(h, -59), somarDias(h, -30))

  // Ativos hoje (comparado ao mesmo dia 30 dias atrás)
  const ativosHoje = unicos(h, h)
  const ativosHojeAnterior = unicos(somarDias(h, -30), somarDias(h, -30))

  // Cadastrados: total e crescimento em relação a 30 dias atrás
  const total = usuarios.length
  const novos = usuarios.filter(u => dia(u.data_cadastro) >= somarDias(h, -29)).length

  return {
    ativos: { valor: numero(ativos), variacao: variacaoPercentual(ativos, ativosAnterior) },
    ativosHoje: { valor: numero(ativosHoje), variacao: variacaoPercentual(ativosHoje, ativosHojeAnterior) },
    cadastrados: { valor: numero(total), variacao: variacaoPercentual(total, total - novos) }
  }
}

// ---------------------------------------------------------------------------
// Gráfico: pontos acumulados dia a dia
// ---------------------------------------------------------------------------
export const opcoesPeriodo = [
  { valor: "7d", label: "Últimos 7 dias" },
  { valor: "30d", label: "Últimos 30 dias" },
  { valor: "mes", label: "Este mês" }
]

const totalAte = (pontos, data) =>
  pontos.reduce((soma, p) => (dia(p.data_registro) <= data ? soma + quantidade(p) : soma), 0)

export function calcularGrafico(pontos, periodo) {
  const h = hoje()
  const inicio =
    periodo === "7d" ? somarDias(h, -6) :
    periodo === "mes" ? `${h.slice(0, 8)}01` :
    somarDias(h, -29)

  const porDia = {}
  let acumulado = 0

  for (const p of pontos) {
    const d = dia(p.data_registro)

    if (d < inicio) acumulado += quantidade(p)
    else if (d <= h) porDia[d] = (porDia[d] ?? 0) + quantidade(p)
  }

  const serie = []

  for (let d = inicio; d <= h; d = somarDias(d, 1)) {
    acumulado += porDia[d] ?? 0
    serie.push({ data: d, valor: acumulado })
  }

  const total = totalAte(pontos, h)
  const mesAnterior = totalAte(pontos, somarDias(h, -30))

  return { serie, total, variacao: variacaoPercentual(total, mesAnterior) }
}

// ---------------------------------------------------------------------------
// Ranking: quem mais pontuou no período (e quanto mudou em relação ao período anterior)
//   diário = hoje | semanal = últimos 7 dias | mensal = últimos 30 dias
// ---------------------------------------------------------------------------
export function calcularRanking(pontos, usuarios, filtro) {
  const h = hoje()
  const dias = filtro === "diario" ? 1 : filtro === "mensal" ? 30 : 7

  const inicio = somarDias(h, -(dias - 1))
  const inicioAnterior = somarDias(h, -(2 * dias - 1))
  const fimAnterior = somarDias(h, -dias)

  const cadastro = new Map(usuarios.map(u => [Number(u.id), u]))
  const acumulado = new Map()

  for (const p of pontos) {
    const id = idDoUsuario(p)
    if (Number.isNaN(id)) continue

    const d = dia(p.data_registro)
    const reg = acumulado.get(id) ?? { atual: 0, anterior: 0, usuario: p.usuario }

    if (entre(d, inicio, h)) reg.atual += quantidade(p)
    else if (entre(d, inicioAnterior, fimAnterior)) reg.anterior += quantidade(p)

    acumulado.set(id, reg)
  }

  return [...acumulado.entries()]
    .filter(([, v]) => v.atual > 0)
    .sort((a, b) => b[1].atual - a[1].atual)
    .slice(0, 10)
    .map(([id, v]) => {
      const u = cadastro.get(id) ?? v.usuario ?? {}
      const diferenca = v.atual - v.anterior

      return {
        id,
        nome: u.nome ?? `Usuário #${id}`,
        pontos: v.atual,
        // "-0" quando não mudou, no mesmo formato dos seus dados de teste
        variacao: diferenca > 0 ? `+${diferenca}` : diferenca < 0 ? `${diferenca}` : "-0",
        fotoUrl: u.imagem?.url
      }
    })
}