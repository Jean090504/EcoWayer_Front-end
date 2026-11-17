import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validarSenha, requisitosSenha } from '../src/services/passwordValidation.js'
import { conversaDaPessoa, conversaDoAnuncio, conversaInicial } from '../src/services/chatSelection.js'

test('senha válida mantém as regras existentes e aceita espaços e símbolos', () => {
    for (const senha of ['Exemplo12', 'Exemplo 12!', `Aa1${'x'.repeat(47)}`]) assert.equal(validarSenha(senha), '')
})

test('senha aponta exatamente os requisitos ausentes', () => {
    assert.equal(requisitosSenha('abcdefgh').filter(r => !r.valido).map(r => r.id).join(','), 'maiuscula,numero')
    assert.match(validarSenha('Ab1'), /8 e 50/)
    assert.match(validarSenha(`Aa1${'x'.repeat(48)}`), /8 e 50/)
    assert.match(validarSenha(null), /número/)
})

const conversas = [
    { id: 10, id_anuncio: 7, id_interessado: 2, id_anunciante: 1, nao_lidas: 0 },
    { id: 11, id_anuncio: 7, id_interessado: 3, id_anunciante: 1, nao_lidas: 1 },
    { id: 12, id_anuncio: 8, id_interessado: 2, id_anunciante: 1, nao_lidas: 0 }
]

test('anúncios diferentes da mesma pessoa abrem o mesmo histórico', () => {
    assert.equal(conversaDoAnuncio(conversas, { id: 7, id_usuario: 1 }, 2).id, 10)
    assert.equal(conversaDoAnuncio(conversas, { id: 7, id_usuario: 1 }, 3).id, 11)
    assert.equal(conversaDoAnuncio(conversas, { id: 8, id_usuario: 1 }, 2).id, 10)
})

test('proprietário não abre automaticamente a conversa de outro interessado pelo anúncio', () => {
    assert.equal(conversaDoAnuncio(conversas, { id: 7, id_usuario: 1 }, 1), null)
    assert.equal(conversaDoAnuncio(conversas, { id: 7, id_usuario: 1 }, 4), null)
})

test('caixa de entrada recupera a conversa escolhida ou prioriza não lidas', () => {
    assert.equal(conversaInicial(conversas, '12').id, 12)
    assert.equal(conversaInicial(conversas, '999').id, 11)
    assert.equal(conversaInicial([], 10), null)
})

test('a mesma dupla é localizada quando anunciante e interessado trocam de papel', () => {
    assert.equal(conversaDaPessoa(conversas, 1, 2).id, 10)
    assert.equal(conversaDaPessoa(conversas, 2, 1).id, 10)
    assert.equal(conversaDaPessoa(conversas, 2, 3), null)
})

test('IDs antigos selecionam o chat unificado depois da atualização', () => {
    const unificadas = [{ ...conversas[0], ids_conversas: [10, 12] }]
    assert.equal(conversaInicial(unificadas, 12).id, 10)
})
