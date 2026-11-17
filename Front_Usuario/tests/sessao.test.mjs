import { beforeEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { EVENTO_SESSAO_EXPIRADA, registrarNovaSessao, sessaoFoiEncerrada, limparSessaoLocal } from '../src/services/sessionService.js'

// Carrega o cliente HTTP sem depender da substituição de import.meta.env do Vite.
const apiUrl = new URL('../src/services/api.js', import.meta.url)
const sessaoUrl = new URL('../src/services/sessionService.js', import.meta.url)
const source = (await readFile(apiUrl, 'utf8'))
    .replace('import.meta.env.VITE_API_URL', 'undefined')
    .replace("'./sessionService.js'", JSON.stringify(sessaoUrl.href))
const { apiFetch } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
let expiracoes

beforeEach(() => {
    const dados = new Map()
    globalThis.sessionStorage = {
        getItem: chave => dados.get(chave) ?? null,
        setItem: (chave, valor) => dados.set(chave, String(valor)),
        removeItem: chave => dados.delete(chave)
    }
    globalThis.window = new EventTarget()
    expiracoes = []
    window.addEventListener(EVENTO_SESSAO_EXPIRADA, evento => expiracoes.push(evento.detail.encerramento))
    registrarNovaSessao()
    sessionStorage.setItem('ecowayer_usuario', '{"id":1}')
    sessionStorage.setItem('ecowayer_token', 'antigo')
})

test('401 limpa a sessão, notifica a tela e solicita remoção do cookie', async () => {
    let logout = 0
    globalThis.fetch = async (url, opcoes) => {
        if (url.endsWith('/usuario/logout')) {
            logout++
            assert.equal(opcoes.credentials, 'include')
            return new Response(null, { status: 204 })
        }
        return Response.json({ message: 'Token de acesso não informado.' }, { status: 401 })
    }
    await assert.rejects(apiFetch('/usuario/1'), { status: 401 })
    assert.equal(sessionStorage.getItem('ecowayer_usuario'), null)
    assert.equal(sessionStorage.getItem('ecowayer_token'), null)
    assert.equal(sessaoFoiEncerrada(), true)
    assert.equal(expiracoes.length, 1)
    await expiracoes[0]
    assert.equal(logout, 1)
})

test('senha incorreta no login não encerra a sessão nem fecha o formulário', async () => {
    globalThis.fetch = async () => Response.json({ message: 'E-mail ou senha inválidos.' }, { status: 401 })
    await assert.rejects(apiFetch('/usuario/login', { method: 'POST' }), { status: 401 })
    assert.equal(expiracoes.length, 0)
    assert.equal(sessaoFoiEncerrada(), false)
})

test('403 de permissão não desloga o usuário', async () => {
    globalThis.fetch = async () => Response.json({ message: 'Acesso negado.' }, { status: 403 })
    await assert.rejects(apiFetch('/anuncio/2'), { status: 403 })
    assert.equal(expiracoes.length, 0)
    assert.ok(sessionStorage.getItem('ecowayer_usuario'))
})

test('vários 401 simultâneos produzem apenas um logout', async () => {
    let resolverLogout
    let logout = 0
    globalThis.fetch = async url => {
        if (url.endsWith('/usuario/logout')) {
            logout++
            return new Promise(resolve => { resolverLogout = resolve })
        }
        return Response.json({}, { status: 401 })
    }
    await Promise.allSettled([apiFetch('/conversa'), apiFetch('/usuario/1'), apiFetch('/mensagens')])
    assert.equal(logout, 1)
    assert.equal(expiracoes.length, 1)
    resolverLogout(new Response(null, { status: 204 }))
    await expiracoes[0]
})

test('401 atrasado de uma sessão antiga não derruba o novo login', async () => {
    let resolver
    globalThis.fetch = () => new Promise(resolve => { resolver = resolve })
    const requisicaoAntiga = apiFetch('/conversa')
    registrarNovaSessao()
    sessionStorage.setItem('ecowayer_usuario', '{"id":2}')
    resolver(Response.json({}, { status: 401 }))
    await assert.rejects(requisicaoAntiga, { status: 401 })
    assert.equal(expiracoes.length, 0)
    assert.equal(sessionStorage.getItem('ecowayer_usuario'), '{"id":2}')
})

test('falha de rede no logout libera o novo login e mantém a sessão local encerrada', async () => {
    globalThis.fetch = async url => {
        if (url.endsWith('/usuario/logout')) throw new Error('Sem conexão')
        return Response.json({}, { status: 401 })
    }
    await assert.rejects(apiFetch('/usuario/1'), { status: 401 })
    await expiracoes[0]
    assert.equal(sessaoFoiEncerrada(), true)
    registrarNovaSessao()
    assert.equal(sessaoFoiEncerrada(), false)
})

test('sair limpa os dados e impede que um 401 anterior ao logout reabra a tela de sessão expirada', async () => {
    let resolver
    globalThis.fetch = () => new Promise(resolve => { resolver = resolve })
    const requisicaoAntiga = apiFetch('/usuario/1')
    limparSessaoLocal()
    assert.equal(sessionStorage.getItem('ecowayer_usuario'), null)
    assert.equal(sessionStorage.getItem('ecowayer_token'), null)
    assert.equal(sessaoFoiEncerrada(), false)
    resolver(Response.json({}, { status: 401 }))
    await assert.rejects(requisicaoAntiga, { status: 401 })
    assert.equal(expiracoes.length, 0)
})
