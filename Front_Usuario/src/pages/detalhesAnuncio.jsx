import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Archive, Heart, Home, Share2 } from 'lucide-react'

import { CardAnunciante, CardPrecoAnuncio, CardAnuncioRelacionado} from '../components/cards/detalhesAnuncio'

import { buscarAnuncio } from '../services/userService.js'

function textoPreco(anuncio) {
    const modalidade = String(anuncio.modalidade_nome || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    if (modalidade === 'doacao') return 'Grátis (Doação)'
    if (modalidade === 'troca') return 'Troca'
    const preco = Number(anuncio.preco)
    if (anuncio.preco == null || String(anuncio.preco).trim() === '' || !Number.isFinite(preco) || preco <= 0) return 'Preço não informado'
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function DetalhesAnuncio({ anuncioSelecionado, onNavegar, onAbrirAnuncio, onConversar, onDenunciar, avisoInicial = '' }) {
    const [anuncio, setAnuncio] = useState(null)
    const [fotoAtiva, setFotoAtiva] = useState(0)
    const [erro, setErro] = useState('')
    const [tentativa, setTentativa] = useState(0)
    const [favoritos, setFavoritos] = useState([])
    const [aviso, setAviso] = useState(avisoInicial)

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

    function favoritar(id) {
        setFavoritos(atuais => atuais.includes(id) ? atuais.filter(item => item !== id) : [...atuais, id])
    }

    function demonstrar(acao) {
        setAviso(acao + ': funcionalidade em demonstração, ainda sem integração.')
    }

    function denunciar() {
        if (onDenunciar) onDenunciar(anuncio)
        else demonstrar('Denúncia de anúncio')
    }

    async function compartilhar() {
        try {
            // Sem rotas por anúncio, compartilha os dados sem inventar uma URL.
            const texto = anuncio.nome + ' — ' + textoPreco(anuncio) + ' | EcoWayer'
            if (navigator.share) await navigator.share({ title: anuncio.nome, text: texto })
            else if (navigator.clipboard) {
                await navigator.clipboard.writeText(texto)
                setAviso('Informações do anúncio copiadas.')
            } else setAviso(texto)
        } catch (error) {
            if (error.name !== 'AbortError') setAviso('Não foi possível compartilhar. Tente novamente.')
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

    const favoritado = favoritos.includes(anuncio.id)

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
                        onClick={() => onNavegar('home')}
                        className="flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs hover:text-[#724BC2]"
                    >
                        <ArrowLeft size={14} />Voltar aos anúncios
                    </button>
                    <div className="flex gap-2">
                        <button type="button" onClick={compartilhar} aria-label="Compartilhar anúncio" className="rounded-full bg-white p-2.5 text-gray-500">
                            <Share2 size={17} />
                        </button>
                        <button
                            type="button"
                            onClick={() => favoritar(anuncio.id)}
                            aria-label={favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                            aria-pressed={favoritado}
                            className="rounded-full bg-white p-2.5 text-red-500"
                        >
                            <Heart size={17} fill={favoritado ? 'currentColor' : 'none'} />
                        </button>
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
                        
                        <section className="flex-1 rounded-[26px] bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="mb-7 flex items-center gap-2 text-base font-semibold text-[#724BC2]">
                                <Archive size={18} />Especificações do material
                            </h2>
                            <dl className="grid grid-cols-2 gap-2">
                                <div>
                                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">Volume / peso</dt>
                                    <dd className="mt-1 text-lg font-bold">{anuncio.peso}</dd>
                                    <dd className="mt-1 text-xs text-gray-500">{anuncio.quantidade}</dd>
                                </div>
                                <div>
                                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">Estado</dt>
                                    <dd className="mt-1 text-lg font-bold text-[#4CAF50]">{anuncio.estado}</dd>
                                    <dd className="mt-1 text-xs text-gray-500">{anuncio.conservacao}</dd>
                                </div>
                            </dl>
                        </section>
                    </div>

                    <div className="flex min-w-0 flex-col gap-10">
                        <CardPrecoAnuncio
                            anuncio={anuncio}
                            onConversar={onConversar}
                            onContraproposta={() => demonstrar('Contraproposta / Agendar retirada')}
                        />
                        <CardAnunciante vendedor={anuncio.vendedor} onDenunciar={denunciar} onVerPerfil={(v) => navigate(`/perfil/${v.id}`)} />
                    </div>
                </div>

                <section className="my-7 rounded-[26px] bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="mb-8 text-base font-semibold">Descrição detalhada</h2>
                    <p className="whitespace-pre-line text-[15px] leading-relaxed text-[#3E4A3D]">{anuncio.descricao}</p>
                </section>

                <section className="pb-2 pt-3">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold">Outros anúncios em destaque deste vendedor</h2>
                        <button
                            type="button"
                            onClick={() => demonstrar('Todos os anúncios do vendedor')}
                            className="flex items-center gap-1 text-xs font-medium text-[#724BC2] hover:underline"
                        >
                            Ver todos os itens de {anuncio.vendedor?.nome?.split(' ')[0] || 'anunciante'}
                            <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
                        {anuncio.outrosAnuncios.map(item => (
                            <CardAnuncioRelacionado
                                key={item.id}
                                anuncio={item}
                                favoritado={favoritos.includes(item.id)}
                                onFavoritar={() => favoritar(item.id)}
                                onAbrir={() => onAbrirAnuncio(item)}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}