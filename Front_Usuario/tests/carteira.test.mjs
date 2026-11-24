import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
const sessao = new URL('../src/services/sessionService.js', import.meta.url).href
const apiSource = (await readFile(new URL('../src/services/api.js', import.meta.url), 'utf8'))
    .replace('import.meta.env.VITE_API_URL', 'undefined').replace("'./sessionService.js'", JSON.stringify(sessao))
const apiUrl = `data:text/javascript;base64,${Buffer.from(apiSource).toString('base64')}`
const cloudinarySource = (await readFile(new URL('../src/services/cloudinaryService.js', import.meta.url), 'utf8'))
    .replace('import.meta.env.VITE_CLOUDINARY_CLOUD_NAME', '"teste-cloud"')
    .replace('import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET', '"teste-preset"')
const cloudinaryUrl = `data:text/javascript;base64,${Buffer.from(cloudinarySource).toString('base64')}`
const serviceSource = (await readFile(new URL('../src/services/userService.js', import.meta.url), 'utf8'))
    .replace("'./api.js'", JSON.stringify(apiUrl)).replace("'./sessionService.js'", JSON.stringify(sessao))
    .replace("'./cloudinaryService.js'", JSON.stringify(cloudinaryUrl))
const { buscarNivelDoador, listarEntregasUsuario, listarVouchersUsuario, listarRecompensas } = await import(`data:text/javascript;base64,${Buffer.from(serviceSource).toString('base64')}`)
beforeEach(() => {
    globalThis.sessionStorage = { getItem: () => null }
})

test('a carteira usa o nível inicial sem atividade e preserva o nível cadastrado com atividade', async () => {
    const semente = { numero: 1, nome: 'Semente' }
    const broto = { numero: 2, nome: 'Broto' }
    const floresta = { numero: 4, nome: 'Floresta' }
    globalThis.fetch = async url => Response.json({
        response: url.endsWith('/nivel_impacto')
            ? { nivel_impacto: [floresta, broto, semente] }
            : { usuario: { nivel_impacto: floresta } }
    })
    assert.deepEqual(await buscarNivelDoador(1, { semAtividade: true }), { atual: semente, proximo: broto })
    assert.deepEqual(await buscarNivelDoador(1), { atual: floresta, proximo: undefined })
})
for (const listar of [listarEntregasUsuario, listarVouchersUsuario, listarRecompensas]) {
    test(`${listar.name}: HTTP 404 com mensagem do backend representa lista vazia`, async () => {
        globalThis.fetch = async () => Response.json({ message: 'NÃO FOI ENCONTRADO NENHUM DADO PARA RETORNO!' }, { status: 404 })
        assert.deepEqual(await listar(), [])
    })
    test(`${listar.name}: HTTP 500 continua sendo erro mesmo com 404 no texto`, async () => {
        globalThis.fetch = async () => Response.json({ message: 'Falha interna 404' }, { status: 500 })
        await assert.rejects(listar(), { status: 500 })
    })
}
