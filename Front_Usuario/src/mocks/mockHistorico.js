// src/mocks/mockHistorico.js
import { simular } from './mockBase'

export const TOTAL_TRANSACOES_MOCK = 28
export const POR_VEZ_MOCK = 4

export const TIPOS_MOCK = [
  { id: "todos", label: "Todos os tipos" },
  { id: "descarte", label: "Descartes" },
  { id: "doacao", label: "Doações" },
  { id: "resgate", label: "Resgates" },
]

export const criarPontuacaoMock = (override = {}) => ({
  id: 1,
  tipo: "descarte",
  icone: "reciclagem",
  cor: "verde",
  tipoLocal: "ecoponto",
  titulo: "Transação de exemplo",
  local: "Local de exemplo",
  quando: "Há 1 dia",
  pontos: 100,
  ...override,
})

export const criarListaHistoricoMock = () => [
  criarPontuacaoMock({
    id: 1,
    tipo: "descarte",
    icone: "reciclagem",
    titulo: "Descarte de 12kg de Papelão",
    local: "EcoPonto Pinheiros",
    quando: "Há 2 dias (14/10 às 15:42)",
    pontos: 240,
  }),
  criarPontuacaoMock({
    id: 2,
    tipo: "doacao",
    icone: "doacao",
    titulo: "Doação de Cadeira de Escritório",
    local: "Marketplace Circular EcoWayer",
    quando: "Há 5 dias (11/10 às 10:15)",
    pontos: 300,
  }),
  criarPontuacaoMock({
    id: 3,
    tipo: "resgate",
    icone: "resgate",
    cor: "roxo",
    titulo: "Resgate de Cupom de Hortifruti Orgânico",
    local: "Cooperativa Terra Viva",
    quando: "Há 10 dias (06/10 às 18:30)",
    pontos: -800,
  }),
  criarPontuacaoMock({
    id: 4,
    tipo: "descarte",
    icone: "eletronicos",
    titulo: "Descarte de Eletrônicos & Pilhas (3kg)",
    local: "EcoPonto Shopping Eldorado",
    quando: "Há 14 dias (02/10 às 14:10)",
    pontos: 180,
  }),
  criarPontuacaoMock({
    id: 5,
    tipo: "descarte",
    icone: "reciclagem",
    titulo: "Descarte de 8kg de Vidro",
    local: "EcoPonto Vila Madalena",
    quando: "Há 16 dias (30/09 às 11:20)",
    pontos: 160,
  }),
  criarPontuacaoMock({
    id: 6,
    tipo: "doacao",
    icone: "doacao",
    titulo: "Doação de Roupas (5kg)",
    local: "Marketplace Circular EcoWayer",
    quando: "Há 18 dias (28/09 às 16:45)",
    pontos: 120,
  }),
  criarPontuacaoMock({
    id: 7,
    tipo: "resgate",
    icone: "resgate",
    cor: "roxo",
    titulo: "Resgate de Muda Nativa para Plantio",
    local: "Programa Mata Viva",
    quando: "Há 20 dias (26/09 às 09:30)",
    pontos: -500,
  }),
  criarPontuacaoMock({
    id: 8,
    tipo: "descarte",
    icone: "eletronicos",
    titulo: "Descarte de Celular Antigo",
    local: "EcoPonto Pinheiros",
    quando: "Há 22 dias (24/09 às 13:05)",
    pontos: 200,
  }),
]

export function buscarHistoricoMock() {
  return simular(() => {
    return {
      total: TOTAL_TRANSACOES_MOCK,
      tipos: TIPOS_MOCK,
      lista: criarListaHistoricoMock(),
    }
  })
}