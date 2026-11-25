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

test('usa cookie HttpOnly e remove tokens antigos acessíveis ao JavaScript', async () => {
    localStorage.setItem('token', 'antigo')
    sessionStorage.setItem('token', 'novo')
    let requisicao
    globalThis.fetch = async (_url, options) => { requisicao = options; return Response.json({}) }
    await apiFetch('/categoria')
    assert.equal(requisicao.headers.Authorization, undefined)
    assert.equal(requisicao.credentials, 'include')
    assert.equal(localStorage.getItem('token'), null)
    assert.equal(sessionStorage.getItem('token'), null)
})
test('não reutiliza token legado persistido', () => {
    localStorage.setItem('token', 'legado')
    assert.equal(lerToken(), null)
    assert.equal(sessionStorage.getItem('token'), null)
    assert.equal(localStorage.getItem('token'), null)
})
test('401 atrasado não apaga o token nem encerra um login novo', async () => {
    salvarSessao()
    let resolver
    globalThis.fetch = () => new Promise(resolve => { resolver = resolve })
    const antiga = apiFetch('/categoria')
    salvarSessao()
    resolver(Response.json({}, { status: 401 }))
    await assert.rejects(antiga)
    assert.equal(lerToken(), '1')
    assert.equal(expiracoes, 0)
})
test('401 atual encerra a sessão e notifica a aplicação', async () => {
    salvarSessao()
    globalThis.fetch = async () => Response.json({}, { status: 401 })
    await assert.rejects(apiFetch('/categoria'))
    assert.equal(lerToken(), null)
    assert.equal(expiracoes, 1)
})
test('erro de senha no login não encerra sessão existente', async () => {
    salvarSessao()
    globalThis.fetch = async (_url, options) => {
        assert.equal(options.headers.Authorization, undefined)
        return Response.json({}, { status: 401 })
    }
    await assert.rejects(apiFetch('/acesso/login', { method: 'POST' }))
    assert.equal(lerToken(), '1')
    assert.equal(expiracoes, 0)
})
