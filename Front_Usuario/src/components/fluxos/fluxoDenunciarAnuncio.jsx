import { useState } from "react"
import { DenunciarAnuncio } from '../../pages'
import { denunciarAnuncio } from "../../services/denunciaService.js"

export default function FluxoDenunciarAnuncio({ anuncio, onNavegar, onDenunciaEnviada }) {
    const [erro, setErro] = useState("")
    const [enviando, setEnviando] = useState(false)

    async function enviar(dados) {
        setErro("")
        setEnviando(true)
        try {
            await denunciarAnuncio(anuncio.id, dados)
            onDenunciaEnviada?.(anuncio)
        } catch (e) {
            setErro(e.message)
        } finally {
            setEnviando(false)
        }
    }

    return (
        <DenunciarAnuncio
            anuncio={anuncio}
            erro={erro}
            enviando={enviando}
            onEnviar={enviar}
            onVoltar={() => onNavegar("detalhesAnuncio", anuncio)}
        />
    )
}