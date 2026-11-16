import { apiFetch, urlImagem } from './api.js'

const resposta = (dados, chave) => dados?.response?.[chave] ?? dados?.[chave] ?? dados

function dataParaApi(data) {
    const valor = String(data || '').trim()
    const partes = valor.split('/')
    return partes.length === 3 ? `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}` : valor
}

export async function loginUsuario(email, senha) {
    const dados = await apiFetch('/usuario/login', { method: 'POST', body: JSON.stringify({ email, senha }) })
    const autenticacao = dados.response || dados
    if (!autenticacao.usuario) throw new Error('A API não retornou os dados de autenticação.')
    if (autenticacao.token) sessionStorage.setItem('ecowayer_token', autenticacao.token)
    sessionStorage.setItem('ecowayer_usuario', JSON.stringify(autenticacao.usuario))
    return autenticacao.usuario
}

export async function criarUsuario(dados) {
    const payload = {
        nome: dados.nome,
        data_nascimento: dataParaApi(dados.nascimento),
        cpf: dados.cpf,
        email: dados.email,
        telefone: dados.telefone,
        senha: dados.senha,
        // Valores iniciais do seed local; a tela de endereço/gênero pode substituir estes campos depois.
        id_genero: Number(dados.id_genero || 1),
        id_endereco: Number(dados.id_endereco || 1)
    }
    const retorno = await apiFetch('/usuario', { method: 'POST', body: JSON.stringify(payload) })
    return resposta(retorno, 'usuario')
}

export async function buscarAnuncios() {
    const dados = await apiFetch('/anuncio')
    return (resposta(dados, 'anuncio') || []).map(anuncio => ({ ...anuncio, imagem: urlImagem(anuncio.imagem) }))
}

export async function buscarAnuncio(id) {
    const dados = await apiFetch(`/anuncio/${id}`)
    const anuncio = resposta(dados, 'anuncio')
    return {
        ...anuncio,
        imagem: urlImagem(anuncio?.imagem) || null,
        imagens: (anuncio?.imagens || (anuncio?.imagem ? [anuncio.imagem] : [])).map(urlImagem),
        categoria: anuncio?.categoria || 'Anúncio',
        subcategoria: anuncio?.subcategoria || '',
        publicado: anuncio?.data_publicacao || '',
        peso: anuncio?.quantidade && anuncio?.unidade ? `${anuncio.quantidade} ${anuncio.unidade}` : anuncio?.peso || anuncio?.peso_kg ? `${anuncio.peso || anuncio.peso_kg} kg` : 'Não informado',
        quantidade: anuncio?.quantidade || '',
        estado: anuncio?.estado || anuncio?.status || 'Ativo',
        conservacao: anuncio?.conservacao || '',
        troca: anuncio?.troca || '',
        vendedor: anuncio?.vendedor || { nome: 'Usuário EcoWayer' },
        outrosAnuncios: anuncio?.outrosAnuncios || []
    }
}

export async function buscarPerfil(id) {
    const dados = await apiFetch(`/usuario/${id}`)
    return resposta(dados, 'usuario')
}

export async function publicarAnuncio(dados, idUsuario) {
    const opcoes = await buscarOpcoesAnuncio()
    const normalizar = valor => String(valor).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    const modalidade = opcoes.modalidades.find(item => normalizar(item.nome) === dados.modalidade)
    if (!modalidade) throw new Error('Modalidade não disponível no backend.')
    const payload = {
        nome: dados.titulo,
        descricao: dados.descricao,
        data_publicacao: new Date().toISOString().slice(0, 19).replace('T', ' '),
        id_usuario: Number(idUsuario),
        id_categoria: Number(dados.categoria),
        id_modalidade: modalidade.id,
        id_condicao_item: Number(dados.condicao),
        preco: dados.modalidade === 'venda' ? dados.preco : '',
        quantidade: dados.peso,
        unidade: dados.unidade,
        status: 'ativo'
    }
    const body = new FormData()
    Object.entries(payload).forEach(([chave, valor]) => body.append(chave, String(valor)))
    dados.fotos.forEach(foto => body.append('fotos', foto))
    const retorno = await apiFetch('/anuncio/publicar', { method: 'POST', body })
    return resposta(retorno, 'anuncio')
}

export async function buscarOpcoesAnuncio() {
    const dados = await apiFetch('/anuncio/opcoes')
    return dados.response
}

export function logoutUsuario() {
    apiFetch('/usuario/logout', { method: 'POST' }).catch(() => {})
    sessionStorage.removeItem('ecowayer_usuario')
    sessionStorage.removeItem('ecowayer_token')
}
