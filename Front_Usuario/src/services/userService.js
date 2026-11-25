import { apiFetch, urlImagem } from './api.js'
import { uploadFoto, validarFoto } from './cloudinaryService.js'
import { registrarNovaSessao, limparSessaoLocal } from './sessionService.js'

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
    registrarNovaSessao()
    if (autenticacao.token) sessionStorage.setItem('ecowayer_token', autenticacao.token)
    sessionStorage.setItem('ecowayer_usuario', JSON.stringify(autenticacao.usuario))
    return autenticacao.usuario
}

export async function criarUsuario(dados) {
    if (!Number.isSafeInteger(Number(dados.id_genero)) || Number(dados.id_genero) <= 0) throw new Error('Selecione seu gênero para continuar.')
    const payload = {
        nome: dados.nome,
        data_nascimento: dataParaApi(dados.nascimento),
        cpf: dados.cpf,
        email: dados.email,
        telefone: dados.telefone,
        senha: dados.senha,
        id_genero: Number(dados.id_genero),
        foto_url: dados.foto_url
    }
    const retorno = await apiFetch('/usuario', { method: 'POST', body: JSON.stringify(payload) })
    return resposta(retorno, 'usuario')
}

export async function buscarGenerosCadastro() {
    return resposta(await apiFetch('/genero'), 'genero') || []
}

export async function buscarAnuncios() {
    const dados = await apiFetch('/anuncio')
    return (resposta(dados, 'anuncio') || [])
        .map(anuncio => ({ ...anuncio, imagem: urlImagem(anuncio.imagem) }))
        .sort((a, b) => Number(b.id) - Number(a.id))
}

export async function buscarOutrosAnunciosVendedor(anuncio) {
    const idVendedor = Number(anuncio.id_usuario ?? anuncio.vendedor?.id)
    if (!Number.isSafeInteger(idVendedor) || idVendedor <= 0) throw new Error('Vendedor não encontrado.')
    const anuncios = await buscarAnuncios()
    return anuncios.filter(item => Number(item.id_usuario) === idVendedor
        && Number(item.id) !== Number(anuncio.id) && item.status === 'ativo')
}

export async function listarPontosUsuario() {
    try {
        const dados = await apiFetch('/pontos')
        return resposta(dados, 'pontos') || []
    } catch (erro) {
        if (erro.status === 404) return []
        throw erro
    }
}

export async function listarEntregasUsuario() {
    try {
        const dados = await apiFetch('/entrega')
        return resposta(dados, 'entrega') || []
    } catch (erro) {
        if (erro.status === 404) return []
        throw erro
    }
}

export async function buscarNivelDoador(idUsuario, { semAtividade = false } = {}) {
    const [perfil, catalogo] = await Promise.all([
        apiFetch(`/usuario/${encodeURIComponent(idUsuario)}`),
        apiFetch('/nivel_impacto')
    ])
    const niveis = resposta(catalogo, 'nivel_impacto')
        .slice().sort((a, b) => Number(a.numero) - Number(b.numero))
    const nivelCadastrado = resposta(perfil, 'usuario')?.nivel_impacto
    const atual = semAtividade ? niveis[0] : nivelCadastrado
    if (!atual) return null
    const proximo = niveis.find(nivel => Number(nivel.numero) > Number(atual.numero))
    return { atual, proximo }
}

export async function listarInsignias() {
    try {
        const dados = await apiFetch('/insignia')
        return resposta(dados, 'insignia') || []
    } catch (erro) {
        if (erro.status === 404) return []
        throw erro
    }
}

export async function listarInsigniasUsuario() {
    try {
        const dados = await apiFetch('/usuario_insignia')
        return resposta(dados, 'usuario_insignia') || []
    } catch (erro) {
        if (erro.status === 404) return []
        throw erro
    }
}

export async function consultarSaldoResgate() {
    const dados = await apiFetch('/voucher/saldo')
    return resposta(dados, 'saldo')
}

export async function resgatarRecompensa(id, solicitacao, pontosConfirmados) {
    const dados = await apiFetch('/voucher/resgatar', {
        method: 'POST',
        body: JSON.stringify({ id_voucher_catalogo: Number(id), solicitacao, pontos_confirmados: Number(pontosConfirmados) })
    })
    return dados.response
}

export async function listarRecompensas() {
    try {
        const dados = await apiFetch('/voucher_catalogo')
        return resposta(dados, 'voucher_catalogo') || []
    } catch (erro) {
        if (erro.status === 404) return []
        throw erro
    }
}

export async function listarVouchersUsuario() {
    try {
        const dados = await apiFetch('/voucher')
        return resposta(dados, 'voucher') || []
    } catch (erro) {
        if (erro.status === 404) return []
        throw erro
    }
}

export function formatarQuantidade(quantidade) {
    const texto = String(quantidade ?? '')
    const decimal = texto.match(/^(\d+)[.,](\d+)$/)
    if (!decimal) return texto

    const fracao = decimal[2].replace(/0+$/, '')
    return fracao ? `${decimal[1]},${fracao}` : decimal[1]
}

export async function buscarAnuncio(id) {
    const dados = await apiFetch(`/anuncio/${id}`)
    const anuncio = resposta(dados, 'anuncio')
    return {
        ...anuncio,
        imagem: urlImagem(anuncio?.imagem) || null,
        imagens: (anuncio?.imagens || (anuncio?.imagem ? [anuncio.imagem] : [])).map(urlImagem),
        imagensOriginais: anuncio?.imagens || (anuncio?.imagem ? [anuncio.imagem] : []),
        categoria: anuncio?.categoria || 'Anúncio',
        subcategoria: anuncio?.subcategoria || '',
        publicado: anuncio?.data_publicacao || '',
        peso: anuncio?.quantidade && anuncio?.unidade
            ? `${formatarQuantidade(anuncio.quantidade)} ${anuncio.unidade}`
            : anuncio?.peso || anuncio?.peso_kg
                ? `${formatarQuantidade(anuncio.peso || anuncio.peso_kg)} kg`
                : 'Não informado',
        quantidade: anuncio?.quantidade || '',
        estado: anuncio?.estado || anuncio?.status || 'Ativo',
        conservacao: anuncio?.conservacao || '',
        troca: anuncio?.troca || '',
        vendedor: anuncio?.vendedor ? { ...anuncio.vendedor, foto: urlImagem(anuncio.vendedor.foto) } : null,
        outrosAnuncios: anuncio?.outrosAnuncios || []
    }
}

export async function iniciarPagamentoTeste(idAnuncio) {
    const dados = await apiFetch('/pagamento/teste/preferencia', {
        method: 'POST',
        body: JSON.stringify({ id_anuncio: Number(idAnuncio) })
    })
    const url = dados?.response?.init_point
    if (!/^https:\/\/(?:www\.)?mercadopago\.com\.br\//.test(url || '')) {
        throw new Error('O Mercado Pago não retornou um checkout válido.')
    }
    return url
}

export async function buscarPerfil(id) {
    const dados = await apiFetch(`/usuario/${id}/perfil`)
    return resposta(dados, 'usuario')
}

export async function buscarCep(cep) {
    const digitos = String(cep || '').replace(/\D/g, '')
    if (digitos.length !== 8) throw new Error('Informe um CEP com 8 numeros.')
    const respostaCep = await fetch(`https://viacep.com.br/ws/${digitos}/json/`)
    if (!respostaCep.ok) throw new Error('Nao foi possivel consultar o CEP agora.')
    const dados = await respostaCep.json()
    if (dados.erro) throw new Error('CEP nao encontrado. Confira o numero e tente novamente.')
    return { cep: dados.cep || digitos, rua: dados.logradouro || '', bairro: dados.bairro || '', cidade: dados.localidade || '', estado: dados.estado || '', sigla: dados.uf || '' }
}

export async function atualizarPerfil(id, perfil) {
    const dados = await apiFetch(`/usuario/${id}/perfil`, {
        method: 'PATCH',
        body: JSON.stringify({
            nome: perfil.nome,
            email: perfil.email,
            confirmar_email: perfil.confirmar_email,
            telefone: perfil.telefone,
            endereco: perfil.endereco,
            senha_atual: perfil.senha_atual,
            senha: perfil.senha,
            confirmar_senha: perfil.confirmar_senha,
            foto_url: perfil.foto_url
        })
    })
    return resposta(dados, 'usuario')
}

export async function desativarConta(id) {
    return apiFetch(`/usuario/${id}`, { method: 'DELETE' })
}

async function salvarAnuncioComFotos(dados, idUsuario, idAnuncio) {
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
    const mantidas = idAnuncio ? dados.fotosMantidas || [] : []
    const fotos = dados.fotos || []
    if (mantidas.length + fotos.length < 1 || mantidas.length + fotos.length > 6) {
        throw new Error('Envie de 1 a 6 fotos para o anúncio.')
    }
    fotos.forEach(validarFoto)
    payload.fotos = await Promise.all(fotos.map(uploadFoto))
    if (idAnuncio) payload.fotos_mantidas = mantidas
    const retorno = await apiFetch(idAnuncio ? `/anuncio/${idAnuncio}/publicar` : '/anuncio/publicar', {
        method: idAnuncio ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
    })
    return resposta(retorno, 'anuncio')
}

export const publicarAnuncio = (dados, idUsuario) => salvarAnuncioComFotos(dados, idUsuario)
export const atualizarAnuncio = (id, dados, idUsuario) => salvarAnuncioComFotos(dados, idUsuario, id)

export async function apagarAnuncio(id) {
    await apiFetch(`/anuncio/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export async function buscarOpcoesAnuncio() {
    const dados = await apiFetch('/anuncio/opcoes')
    return dados.response
}

export function logoutUsuario() {
    const pedido = apiFetch('/usuario/logout', { method: 'POST', signal: AbortSignal.timeout(5000) }).catch(() => {})
    limparSessaoLocal()
    return pedido
}
