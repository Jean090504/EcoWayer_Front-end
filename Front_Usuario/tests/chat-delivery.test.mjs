import { test } from 'node:test'
import assert from 'node:assert/strict'
import { enviarComAtualizacao, INTERVALO_CONVERSAS, INTERVALO_MENSAGENS } from '../src/services/chatDelivery.js'

test('envio confirmado não é tratado como falha quando a leitura posterior falha', async () => {
    let envios = 0
    let texto = 'Olá'
    const resultado = await enviarComAtualizacao({
        enviar: async () => { envios++; return { id: 1 } },
        confirmar: () => { texto = '' },
        atualizar: async () => { throw new Error('Leitura indisponível') }
    })
    assert.equal(resultado.enviada, true)
    assert.equal(envios, 1)
    assert.equal(texto, '')
    assert.match(resultado.erroAtualizacao.message, /Leitura/)
})

test('falha real de envio preserva o rascunho e não atualiza o histórico', async () => {
    let confirmou = false
    let atualizou = false
    await assert.rejects(enviarComAtualizacao({
        enviar: async () => { throw new Error('Envio rejeitado') },
        confirmar: () => { confirmou = true },
        atualizar: async () => { atualizou = true }
    }), /rejeitado/)
    assert.equal(confirmou, false)
    assert.equal(atualizou, false)
})

test('atualização normal confirma uma vez e retorna sem erro', async () => {
    const passos = []
    const resultado = await enviarComAtualizacao({
        enviar: async () => { passos.push('enviar'); return { id: 2 } },
        confirmar: () => passos.push('confirmar'),
        atualizar: async () => passos.push('atualizar')
    })
    assert.deepEqual(passos, ['enviar', 'confirmar', 'atualizar'])
    assert.deepEqual(resultado, { enviada: true })
})

test('consultas periódicas mais leituras em lote cabem no limite de 300 por 15 minutos', () => {
    const janela = 15 * 60 * 1000
    const consultas = janela / INTERVALO_CONVERSAS + janela / INTERVALO_MENSAGENS
    const leiturasEmLote = janela / INTERVALO_MENSAGENS
    assert.equal(consultas, 90)
    assert.ok(consultas + leiturasEmLote < 300)
})
