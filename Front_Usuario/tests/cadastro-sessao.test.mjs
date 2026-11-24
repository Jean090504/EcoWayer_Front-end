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
const { criarUsuario, loginUsuario, buscarGenerosCadastro, atualizarPerfil, publicarAnuncio } = await import(`data:text/javascript;base64,${Buffer.from(serviceSource).toString('base64')}`)
beforeEach(() => {
    const dados = new Map()
    globalThis.sessionStorage = { getItem: k => dados.get(k) ?? null, setItem: (k, v) => dados.set(k, String(v)), removeItem: k => dados.delete(k) }
    globalThis.window = new EventTarget()
})
const cadastro = { nome: 'Teste', nascimento: '01/01/2000', cpf: '52998224725', email: 'teste@example.com', telefone: '11999999999', senha: 'Teste123', id_genero: 7 }

test('cadastro envia gênero escolhido, sem endereço artificial, e só login cria sessão local', async () => {
    const chamadas = []
    globalThis.fetch = async (url, options) => {
        chamadas.push({ url, payload: JSON.parse(options.body) })
        return Response.json({ response: { usuario: { id: 42, nome: 'Teste' } } }, { status: url.endsWith('/login') ? 200 : 201 })
    }
    await criarUsuario(cadastro)
    assert.equal(chamadas[0].payload.id_genero, 7)
    assert.equal('id_endereco' in chamadas[0].payload, false)
    assert.equal(chamadas[0].payload.data_nascimento, '2000-01-01')
    assert.equal(sessionStorage.getItem('ecowayer_usuario'), null)
    await loginUsuario(cadastro.email, cadastro.senha)
    assert.equal(JSON.parse(sessionStorage.getItem('ecowayer_usuario')).id, 42)
})
test('gênero ausente é rejeitado antes de enviar cadastro', async () => {
    let chamadas = 0
    globalThis.fetch = async () => { chamadas++ }
    await assert.rejects(criarUsuario({ ...cadastro, id_genero: '' }), /Selecione seu gênero/)
    assert.equal(chamadas, 0)
})
test('gêneros disponíveis vêm do catálogo do backend', async () => {
    globalThis.fetch = async () => Response.json({ response: { genero: [{ id: 7, nome: 'Opção cadastrada' }] } })
    assert.deepEqual(await buscarGenerosCadastro(), [{ id: 7, nome: 'Opção cadastrada' }])
})


test('edição do perfil envia contato e endereço sem depender de IDs removidos da resposta', async () => {
    globalThis.fetch = async (url, options) => {
        assert.ok(url.endsWith('/usuario/42/perfil'))
        assert.equal(options.method, 'PATCH')
        assert.deepEqual(JSON.parse(options.body), { nome: 'Nome atualizado', email: 'teste@example.com', confirmar_email: 'teste@example.com', telefone: '11999999999', endereco: { cidade: 'São Paulo' } })
        return Response.json({ response: { usuario: { id: 42, nome: 'Nome atualizado' } } })
    }
    const usuario = await atualizarPerfil(42, { nome: 'Nome atualizado', email: 'teste@example.com', confirmar_email: 'teste@example.com', telefone: '11999999999', endereco: { cidade: 'São Paulo' }, id_genero: undefined })
    assert.equal(usuario.nome, 'Nome atualizado')
})

test('publicação envia duas fotos ao Cloudinary e só as URLs à API', async () => {
    const urls = ['capa.png', 'detalhe.png'].map(nome => `https://res.cloudinary.com/teste-cloud/image/upload/${nome}`)
    const fotos = ['capa.png', 'detalhe.png'].map(nome => new File(['foto'], nome, { type: 'image/png' }))
    let uploads = 0
    globalThis.fetch = async (url, options) => {
        if (url.endsWith('/anuncio/opcoes')) {
            return Response.json({ response: { modalidades: [{ id: 1, nome: 'Venda' }] } })
        }
        if (url.startsWith('https://api.cloudinary.com/')) {
            assert.equal(options.body.get('file'), fotos[uploads])
            return Response.json({ secure_url: urls[uploads++] })
        }
        assert.ok(url.endsWith('/anuncio/publicar'))
        assert.equal(options.headers['Content-Type'], 'application/json')
        assert.deepEqual(JSON.parse(options.body).fotos, urls)
        return Response.json({ response: { anuncio: { imagens: urls } } }, { status: 201 })
    }
    const anuncio = await publicarAnuncio({ modalidade: 'venda', fotos }, 42)
    assert.deepEqual(anuncio.imagens, urls)
})
