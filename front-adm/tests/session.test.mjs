import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { lerToken, salvarSessao, limparSessao } from '../src/services/sessionService.js'

const sessao = new URL('../src/services/sessionService.js', import.meta.url)
const source = (await readFile(new URL('../src/services/api.js', import.meta.url), 'utf8'))
    .replace('import.meta.env.VITE_API_URL', 'undefined')
    .replace("'./sessionService.js'", JSON.stringify(sessao.href))
const { apiFetch } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
let expiracoes
beforeEach(() => {
    const store = () => {
        const dados = new Map()
        return { getItem: key => dados.get(key) ?? null, setItem: (key, value) => dados.set(key, String(value)), removeItem: key => dados.delete(key) }
    }
    globalThis.localStorage = store()
    globalThis.sessionStorage = store()
    globalThis.window = new EventTarget()
    expiracoes = 0
    window.addEventListener('auth:expired', () => expiracoes++)
    limparSessao()
})

test('token novo da sessão prevalece sobre token antigo persistido', async () => {
    localStorage.setItem('token', 'antigo')
    sessionStorage.setItem('token', 'novo')
    let enviado
    globalThis.fetch = async (_url, options) => { enviado = options.headers.Authorization; return Response.json({}) }
    await apiFetch('/categoria')
    assert.equal(enviado, 'Bearer novo')
    assert.equal(localStorage.getItem('token'), null)
})
test('sessão antiga persistida é migrada sem manter dois tokens', () => {
    localStorage.setItem('token', 'legado')
    assert.equal(lerToken(), 'legado')
    assert.equal(sessionStorage.getItem('token'), 'legado')
    assert.equal(localStorage.getItem('token'), null)
})
test('401 atrasado não apaga o token nem encerra um login novo', async () => {
    salvarSessao('anterior')
    let resolver
    globalThis.fetch = () => new Promise(resolve => { resolver = resolve })
    const antiga = apiFetch('/categoria')
    salvarSessao('nova-sessao')
    resolver(Response.json({}, { status: 401 }))
    await assert.rejects(antiga)
    assert.equal(lerToken(), 'nova-sessao')
    assert.equal(expiracoes, 0)
})
test('401 atual encerra a sessão e notifica a aplicação', async () => {
    salvarSessao('atual')
    globalThis.fetch = async () => Response.json({}, { status: 401 })
    await assert.rejects(apiFetch('/categoria'))
    assert.equal(lerToken(), null)
    assert.equal(expiracoes, 1)
})
test('erro de senha no login não encerra sessão existente', async () => {
    salvarSessao('atual')
    globalThis.fetch = async (_url, options) => {
        assert.equal(options.headers.Authorization, undefined)
        return Response.json({}, { status: 401 })
    }
    await assert.rejects(apiFetch('/acesso/login', { method: 'POST' }))
    assert.equal(lerToken(), 'atual')
    assert.equal(expiracoes, 0)
})
