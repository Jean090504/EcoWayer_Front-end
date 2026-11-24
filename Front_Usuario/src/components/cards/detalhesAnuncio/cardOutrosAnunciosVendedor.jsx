import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import CardAnuncioRelacionado from "./cardAnuncioRelacionado"
import { buscarOutrosAnunciosVendedor } from "../../../services/userService.js"

export default function CardOutrosAnunciosVendedor({
    anuncio,
    favoritos,
    onVerTodos,
    favoritar,
    onAbrirAnuncio
}) {
    const [itens, setItens] = useState(null)
    const [erro, setErro] = useState('')
    const [tentativa, setTentativa] = useState(0)

    useEffect(() => {
        let ativo = true
        buscarOutrosAnunciosVendedor(anuncio).then(dados => {
            if (ativo) setItens(dados)
        }).catch(() => {
            if (ativo) setErro('Não foi possível carregar os anúncios do vendedor.')
        })
        return () => { ativo = false }
    }, [anuncio, tentativa])

    const visiveis = onVerTodos ? itens?.slice(0, 4) : itens
    return (
        <section className = "pb-2 pt-3">
            {onVerTodos && <div className = "mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className = "text-lg font-semibold">
                    Outros anúncios em destaque deste vendedor
                </h2>

                <button
                    type = "button"
                    onClick = {onVerTodos}
                    className = "flex items-center gap-1 text-xs font-medium text-[#724BC2] hover:underline"
                >
                    Ver todos os itens de {anuncio.vendedor?.nome?.split(' ')[0] || 'anunciante'}
                    <ArrowRight size = {14} />
                </button>
            </div>}

            {erro ? (
                <div role="alert" className="rounded-2xl bg-white p-5 text-sm">
                    {erro}{' '}
                    <button type="button" className="text-[#724BC2] underline" onClick={() => { setErro(''); setTentativa(valor => valor + 1) }}>
                        Tentar novamente
                    </button>
                </div>
            ) : itens === null ? (
                <p role="status" className="text-sm text-gray-600">Carregando anúncios...</p>
            ) : itens.length === 0 && (
                <p className="rounded-2xl bg-white p-5 text-sm text-gray-600">Este vendedor ainda não tem outros anúncios ativos.</p>
            )}

            <div className = "grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
                {visiveis?.map(item => (
                    <CardAnuncioRelacionado
                        key = {item.id}
                        anuncio = {item}
                        favoritado = {favoritos.includes(String(item.id))}
                        onFavoritar = {() => favoritar(item.id)}
                        onAbrir = {() => onAbrirAnuncio(item)}
                    />
                ))}
            </div>
        </section>
    )
}
