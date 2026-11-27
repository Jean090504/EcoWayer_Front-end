import { useEffect, useRef, useState } from "react"
import { ArrowLeft } from "lucide-react"

import CardMotivoDenuncia from "../components/cards/denunciarAnuncio/cardMotivoDenuncia"
import { apiFetch } from "../services/api.js"
import { uploadFoto } from "../services/cloudinaryService.js"

export default function DenunciarAnuncio({ anuncioId, anuncio, mensagem, erro: erroExterno = "", enviando: enviandoExterno = false, onEnviar: onEnviarExterno, onVoltar, onNavegar }) {
    const [motivos, setMotivos] = useState(null)
    const [erroCarga, setErroCarga] = useState("")
    const [tentativa, setTentativa] = useState(0)
    const [erroEnvio, setErroEnvio] = useState("")
    const [enviando, setEnviando] = useState(false)
    const [enviado, setEnviado] = useState(false)
    const uploads = useRef(new WeakMap())
    const mensagemId = mensagem?.id
    const idAlvo = anuncioId || anuncio?.id
    const temAlvo = Boolean(idAlvo || mensagemId)

    useEffect(() => {
        if (!temAlvo) return

        let ativo = true
        apiFetch("/tipo_denuncias")
            .then(dados => {
                if (!ativo) return
                const tipos = dados.response?.tipo_denuncias
                setMotivos(Array.isArray(tipos) ? tipos : [])
            })
            .catch(erro => {
                if (ativo) setErroCarga(erro.message)
            })
        return () => { ativo = false }
    }, [temAlvo, tentativa])

    function voltar() {
        if (onVoltar) return onVoltar()
        onNavegar(mensagemId ? "chat" : idAlvo ? "detalhesAnuncio" : "home")
    }

    async function enviar({ motivo, descricao, arquivos }) {
        setEnviando(true)
        setErroEnvio("")
        try {
            if (onEnviarExterno) {
                await onEnviarExterno({ motivo, descricao, arquivos })
                setEnviado(true)
                return
            }
            const fotos = []
            for (const arquivo of arquivos) {
                let url = uploads.current.get(arquivo)
                if (!url) {
                    url = await uploadFoto(arquivo)
                    uploads.current.set(arquivo, url)
                }
                fotos.push(url)
            }
            await apiFetch("/denuncias", {
                method: "POST",
                body: JSON.stringify({
                    ...(mensagemId ? { mensagens: [Number(mensagemId)] } : { id_anuncio: Number(idAlvo) }),
                    id_tipo_denuncias: motivo,
                    descricao,
                    ...(fotos.length > 0 && { fotos }),
                }),
            })
            setEnviado(true)
        } catch (erro) {
            setErroEnvio(erro.message)
        } finally {
            setEnviando(false)
        }
    }

    return (
        <section className="flex w-full flex-1 justify-center bg-[#FAF8FF]">
            <div className="flex w-full max-w-[1280px] flex-col gap-8 px-5 py-8 sm:px-8">
                <div className="flex flex-col items-start gap-4 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                    <button
                        type="button"
                        onClick={voltar}
                        disabled={enviando}
                        className="flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#191C1E] shadow-sm hover:bg-gray-100"
                    >
                        <ArrowLeft size={18} aria-hidden="true" />
                        {mensagemId ? "Voltar ao chat" : anuncioId ? "Voltar ao anúncio" : "Voltar aos anúncios"}
                    </button>
                    <h1 className="text-3xl font-bold text-[#191C1E] sm:text-4xl">{mensagemId ? "Denunciar mensagem" : "Denunciar este anúncio"}</h1>
                </div>

                {!temAlvo && <p role="alert">Abra um anúncio para denunciá-lo.</p>}
                {temAlvo && erroCarga && (
                    <div>
                        <p role="alert">{erroCarga}</p>
                        <button type="button" className="mt-2 text-[#6F2DBD] underline" onClick={() => {
                            setErroCarga("")
                            setTentativa(valor => valor + 1)
                        }}>Tentar novamente</button>
                    </div>
                )}
                {temAlvo && !erroCarga && motivos === null && <p role="status">Carregando motivos…</p>}
                {motivos?.length === 0 && <p role="status">Nenhum motivo de denúncia está disponível.</p>}
                {enviado && <p role="status" className="rounded-2xl bg-white p-6 font-semibold text-[#3E4A3D]">Denúncia enviada com sucesso.</p>}
                {mensagemId && !enviado && (
                    <blockquote className="whitespace-pre-wrap break-words rounded-2xl border-l-4 border-[#724BC2] bg-white p-4 text-sm text-gray-700">
                        <p className="mb-1 font-semibold">{mensagem.remetente || "Mensagem selecionada"}</p>
                        {mensagem.texto}
                    </blockquote>
                )}
                {!enviado && motivos?.length > 0 && (
                    <CardMotivoDenuncia
                        motivos={motivos}
                         erro={erroExterno || erroEnvio}
                         enviando={enviando || enviandoExterno}
                        onCancelar={voltar}
                        onEnviar={enviar}
                    />
                )}
            </div>
        </section>
    )
}
