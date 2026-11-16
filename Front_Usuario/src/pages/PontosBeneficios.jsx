import { useEffect, useMemo, useState } from "react"
import CardSaldoDisponivel from "../components/cards/pontosBeneficios/cardSaldoDisponivel"
import CardPremio from "../components/cards/pontosBeneficios/cardPremio"
import CardHistoricoPontuacao from "../components/cards/pontosBeneficios/cardHistoricoPontuacao"
import { listarEntregasUsuario, listarPontosUsuario, listarVouchersUsuario } from "../services/userService"

export default function PontosBeneficios() {
    const [pontos, setPontos] = useState([])
    const [entregas, setEntregas] = useState([])
    const [vouchers, setVouchers] = useState([])
    const [erro, setErro] = useState("")

    useEffect(() => {
        Promise.all([listarPontosUsuario(), listarEntregasUsuario(), listarVouchersUsuario()])
            .then(([pontosApi, entregasApi, vouchersApi]) => {
                setPontos(pontosApi)
                setEntregas(entregasApi)
                setVouchers(vouchersApi)
            })
            .catch((error) => setErro(error.message))
    }, [])

    const saldo = useMemo(() => pontos.reduce((total, item) => total + (Number(item.qntd_pontos) || 0), 0), [pontos])
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
                    porcentagem={0}
                    nivelAtual={saldo}
                    descartes={entregas.length}
                    resgates={vouchers.length}
                    onGanharPontos={() => undefined}
                />

                <CardPremio />

                <div className="flex flex-col gap-10"> 
                    <CardHistoricoPontuacao historico={historico} />
                </div>
            </div>
        </main>
    )
}
