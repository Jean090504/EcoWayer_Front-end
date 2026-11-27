import { useEffect, useState } from 'react'
import { ArrowLeft, Heart, Home, Share2 } from 'lucide-react'

import { CardAnunciante, CardPrecoAnuncio, CardInformacoesMaterial, CardDescricaoDetalhada, CardOutrosAnunciosVendedor } from '../components/cards/detalhesAnuncio'
import { buscarAnuncio, iniciarPagamento } from '../services/userService.js'

function textoPreco(anuncio) {
    const modalidade = String(anuncio.modalidade_nome || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    if (modalidade === 'doacao') return 'Grátis (Doação)'
    if (modalidade === 'troca') return 'Troca'
    const preco = Number(anuncio.preco)
    if (anuncio.preco == null || String(anuncio.preco).trim() === '' || !Number.isFinite(preco) || preco <= 0) return 'Preço não informado'
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function DetalhesAnuncio({ anuncioSelecionado, onNavegar, onAbrirAnuncio, onVerAnunciosVendedor, onVoltarAoVendedor, favoritos, favoritar, onConversar, onContraproposta, onDenunciar, onAbrirLogin, usuario, avisoInicial = '' }) {
    const [anuncio, setAnuncio] = useState(null)
    const [fotoAtiva, setFotoAtiva] = useState(0)
    const [erro, setErro] = useState('')
    const [tentativa, setTentativa] = useState(0)
    const [aviso, setAviso] = useState(avisoInicial)
    const [pagamentoCarregando, setPagamentoCarregando] = useState(false)

    useEffect(() => {
        let ativo = true
        const id = anuncioSelecionado?.id
        if (!id) {
            setErro('Anúncio inválido.')
            return () => { ativo = false }
        }
        buscarAnuncio(id)
            .then(dados => {
                if (ativo) {
                    setAnuncio(dados)
                    setFotoAtiva(0)
                }
            })
            .catch(error => {
                if (ativo) setErro(error.message || 'Não foi possível carregar o anúncio.')
            })
        return () => { ativo = false }
    }, [anuncioSelecionado, tentativa])

    function demonstrar(acao) {
        setAviso(acao + ': funcionalidade em demonstração, ainda sem integração.')
    }

    function denunciar() {
        if (onDenunciar) onDenunciar(anuncio)
        else demonstrar('Denúncia de anúncio')
    }

    async function pagar() {
        if (!usuario?.id) { onAbrirLogin(); return }
        if (pagamentoCarregando) return
        setPagamentoCarregando(true)
        setAviso('')
        try {
            window.location.assign(await iniciarPagamento(anuncio.id))
        } catch (error) {
            setAviso(error.message || 'Não foi possível iniciar o pagamento.')
            setPagamentoCarregando(false)
        }
    }

    async function compartilhar() {
        const texto = `${anuncio.nome} - ${textoPreco(anuncio)} | EcoWayer`
        const url = window.location.href
        try {
            if (navigator.share) {
                await navigator.share({ title: anuncio.nome, text: texto, url })
                return
            }
            const conteudo = `${texto}\n${url}`
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(conteudo)
            } else {
                const temporario = document.createElement('textarea')
                temporario.value = conteudo
                temporario.setAttribute('readonly', '')
                temporario.style.position = 'fixed'
                temporario.style.opacity = '0'
                document.body.appendChild(temporario)
                temporario.select()
                const copiado = document.execCommand('copy')
                temporario.remove()
                if (!copiado) throw new Error('Falha ao copiar')
            }
            setAviso('Link e informacoes do anuncio copiados. Voce ja pode compartilhar.')
        } catch (error) {
            if (error.name !== 'AbortError') setAviso('Nao foi possivel compartilhar nem copiar o link. Tente novamente.')
        }
    }

    if (erro) {
        return (
            <section role="alert" className="mx-auto w-[90%] py-12">
                <p>{erro}</p>
                <button
                    type="button"
                    className="mt-4 text-[#724BC2]"
                    onClick={() => { setErro(''); setTentativa(valor => valor + 1) }}
                >
                    Tentar novamente
                </button>
            </section>
        )
    }

    if (!anuncio) {
        return <section role="status" className="mx-auto w-[90%] py-12 text-gray-500">Carregando anúncio...</section>
    }

    const favoritado = favoritos.includes(String(anuncio.id))

    return (
        <div className="flex-1 bg-[#FAF8FF] text-[#191C30]">
            <nav aria-label="Caminho de navegação" className="bg-white py-4 text-xs text-[#724BC2]">
                <ol className="mx-auto flex w-[80%] flex-wrap items-center gap-2">
                    <li>
                        <button type="button" onClick={() => onNavegar('home')} className="flex items-center gap-1 hover:underline">
                            <Home size={12} />Início
                        </button>
                    </li>
                    <li aria-hidden="true">›</li>
                    <li>
                        <button type="button" onClick={() => onNavegar('home')} className="hover:underline">
                            Categorias
                        </button>
                    </li>
                    {anuncio.categoria && (
                        <>
                            <li aria-hidden="true">›</li>
                            <li>{anuncio.subcategoria || anuncio.categoria}</li>
                        </>
                    )}
                    <li aria-hidden="true">›</li>
                    <li aria-current="page" className="font-semibold text-[#191C30]">{anuncio.nome}</li>
                </ol>
            </nav>

            <div className="mx-auto w-[80%] py-7 sm:py-9">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={onVoltarAoVendedor || (() => onNavegar('home'))}
                        className="flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs hover:text-[#724BC2]"
                    >
                        <ArrowLeft size={14} />{onVoltarAoVendedor ? 'Voltar aos anúncios do vendedor' : 'Voltar aos anúncios'}
                    </button>
                    <div className="flex gap-2">
                        <button type="button" onClick={compartilhar} aria-label="Compartilhar anúncio" className="rounded-full bg-white p-2.5 text-gray-500">
                            <Share2 size={17} />
                        </button>
                        {favoritar && <button
                            type="button"
                            onClick={() => favoritar(anuncio.id)}
                            aria-label={favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                            aria-pressed={favoritado}
                            className="rounded-full bg-white p-2.5 text-red-500"
                        >
                            <Heart size={17} fill={favoritado ? 'currentColor' : 'none'} />
                        </button>}
                    </div>
                </div>

                {aviso && (
                    <div role="status" className="mb-4 flex items-center justify-between gap-4 rounded-xl border border-purple-100 bg-white px-4 py-3 text-sm text-[#724BC2]">
                        <span>{aviso}</span>
                        <button type="button" onClick={() => setAviso('')} aria-label="Fechar aviso" className="px-2 text-lg">×</button>
                    </div>
                )}

                <div className="grid items-stretch gap-6 lg:grid-cols-[1.50fr_1fr]">
                    <div className="flex min-w-0 flex-col gap-5">
                        <img
                            src={anuncio.imagens[fotoAtiva] || anuncio.imagem}
                            alt={anuncio.nome}
                            className="aspect-[2] w-full rounded-[26px] bg-gray-100 object-cover"
                        />
                        {anuncio.imagens.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto" aria-label="Fotos do anúncio">
                                {anuncio.imagens.map((url, indice) => (
                                    <button
                                        key={url}
                                        type="button"
                                        onClick={() => setFotoAtiva(indice)}
                                        aria-label={`Ver foto ${indice + 1}`}
                                        aria-pressed={fotoAtiva === indice}
                                        className={`shrink-0 overflow-hidden rounded-xl border-2 ${fotoAtiva === indice ? 'border-[#724BC2]' : 'border-transparent'}`}
                                    >
                                        <img src={url} alt={`Foto ${indice + 1} de ${anuncio.nome}`} className="h-20 w-24 object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        <CardInformacoesMaterial anuncio = {anuncio} />
                    </div>

                    <div className="flex min-w-0 flex-col gap-10">
                        <CardPrecoAnuncio
                            anuncio={anuncio}
                            onConversar={onConversar}
                            onContraproposta={onContraproposta}
                            onPagar={pagar}
                            pagamentoCarregando={pagamentoCarregando}
                        />
                        <CardAnunciante vendedor={anuncio.vendedor} onDenunciar={denunciar} onVerPerfil={() => onVerAnunciosVendedor(anuncio)} />
                    </div>
                </div>

                <CardDescricaoDetalhada anuncio = {anuncio} />

                <CardOutrosAnunciosVendedor
                    anuncio = {anuncio}
                    favoritos = {favoritos}
                    onVerTodos = {() => onVerAnunciosVendedor(anuncio)}
                    favoritar = {favoritar}
                    onAbrirAnuncio = {onAbrirAnuncio}
                />
            </div>
        </div>
    )
}
