import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export default function CodigoEntregaQr({ pedidoId, codigo }) {
    const [resultado, setResultado] = useState(null)
    const chave = `${pedidoId}:${codigo}`

    useEffect(() => {
        let ativo = true
        QRCode.toDataURL(`ecowayer:pedido:v1:${pedidoId}:${codigo}`, { width: 220, margin: 2 })
            .then(url => { if (ativo) setResultado({ chave, url }) })
        return () => { ativo = false }
    }, [pedidoId, codigo, chave])

    return resultado?.chave === chave && <img src={resultado.url} alt="QR Code para confirmar o recebimento" width="220" height="220" className="my-3 rounded-lg bg-white p-2" />
}
