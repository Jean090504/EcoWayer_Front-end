import { simular } from './mockBase'

export const criarSaldoMock = (override = {}) => ({
  saldo: 1250,
  porcentagem: 62,
  nivelAtual: 2000,
  descartes: 48,
  resgates: 3,
  ...override,
})

export function buscarSaldoMock() {
  return simular(criarSaldoMock)
}