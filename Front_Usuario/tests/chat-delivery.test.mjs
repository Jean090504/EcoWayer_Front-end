import { test } from 'node:test'
import assert from 'node:assert/strict'
import { registrarMensagemEnviada, INTERVALO_CONVERSAS, INTERVALO_MENSAGENS } from '../src/services/chatDelivery.js'

test('a mensagem confirmada aparece no histórico a partir da resposta do envio', () => {
    const mensagens = [{ id: 1, texto: 'Anterior' }]
    const enviada = { id: 2, texto: 'Olá' }
    assert.deepEqual(registrarMensagemEnviada(mensagens, enviada), [...mensagens, enviada])
    assert.equal(mensagens.length, 1)
})

test('a resposta do envio não duplica mensagem já encontrada pela atualização periódica', () => {
    const mensagens = [{ id: '2', texto: 'Olá', lida: 1 }]
    assert.equal(registrarMensagemEnviada(mensagens, { id: 2, texto: 'Olá', lida: 0 }), mensagens)
})

test('consultas periódicas mais leituras em lote cabem no limite de 300 por 15 minutos', () => {
    const janela = 15 * 60 * 1000
    const consultas = janela / INTERVALO_CONVERSAS + janela / INTERVALO_MENSAGENS
    const leiturasEmLote = janela / INTERVALO_MENSAGENS
    assert.equal(consultas, 90)
    assert.ok(consultas + leiturasEmLote < 300)
})
