import { useEffect, useMemo, useState } from "react"
import CardSaldoDisponivel from "../components/cards/pontosBeneficios/cardSaldoDisponivel"
import CardPremio from "../components/cards/pontosBeneficios/cardPremio"
import CardHistoricoPontuacao from "../components/cards/pontosBeneficios/cardHistoricoPontuacao"
import { consultarSaldoResgate, listarEntregasUsuario, listarPontosUsuario, listarRecompensas, listarVouchersUsuario } from "../services/userService"

export default function PontosBeneficios() {
    const [pontos, setPontos] = useState([])
    const [entregas, setEntregas] = useState([])
    const [vouchers, setVouchers] = useState([])
    const [erro, setErro] = useState("")
    const [saldo, setSaldo] = useState(null)
    const [catalogo, setCatalogo] = useState(null)
    const [aviso, setAviso] = useState("")

    useEffect(() => {
        Promise.all([listarPontosUsuario(), listarEntregasUsuario(), listarVouchersUsuario(), consultarSaldoResgate(), listarRecompensas()])
            .then(([pontosApi, entregasApi, vouchersApi, saldoApi, catalogoApi]) => {
                setPontos(pontosApi)
                setEntregas(entregasApi)
                setVouchers(vouchersApi)
                setSaldo(saldoApi)
                setCatalogo(catalogoApi.filter(item => Number(item.ativo) === 1))
            })
            .catch((error) => setErro(error.message))
    }, [])

    const historico = useMemo(() => pontos.map((item) => ({
        id: item.id,
        titulo: `Pontuação da entrega #${item.id_entrega || "—"}`,
        data: item.data_registro,
        pontos: Number(item.qntd_pontos) || 0,
    })), [pontos])

    return(
        <main className="flex flex-1 w-full justify-center bg-[#F8F9FB]">
            <div className="flex w-full max-w-[90%] flex-col gap-8 px-6 py-10">
                {erro && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{erro}</p>}
                <CardSaldoDisponivel
                    saldo={saldo}
                    descartes={entregas.length}
                    resgates={vouchers.length}
                    onGanharPontos={() => setAviso("Você ganha EcoPontos quando uma entrega é registrada e pontuada.")}
                />

                {aviso && <p role="status" className="rounded-xl bg-white p-4 text-sm">{aviso}</p>}
                {catalogo === null && !erro && <p role="status">Carregando recompensas…</p>}
                {catalogo && <CardPremio catalogo={catalogo} saldo={saldo} onResgatado={({ voucher, saldo: saldoAtual }) => {
                    setSaldo(saldoAtual)
                    setVouchers(anteriores => [voucher, ...anteriores.filter(item => item.id !== voucher.id)])
                }} />}

                {vouchers.length > 0 && <section className="rounded-3xl bg-white p-6">
                    <h2 className="text-xl font-bold">Meus vouchers</h2>
                    <ul className="mt-3 divide-y divide-gray-100">
                        {vouchers.map(voucher => <li key={voucher.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                            <span>{voucher.beneficio} <span className="text-sm text-gray-600">({voucher.status})</span></span>
                            <code className="max-w-full break-all rounded bg-gray-100 px-2 py-1 text-sm">{voucher.codigo}</code>
                        </li>)}
                    </ul>
                </section>}

                <div className="flex flex-col gap-10"> 
                    <CardHistoricoPontuacao historico={historico} />
                </div>
            </div>
        </main>
    )
}
