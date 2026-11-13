import { useEffect, useState } from "react"
import CardSaldoDisponivel from "../components/cards/pontosBeneficios/cardSaldoDisponivel"
import CardPremio from "../components/cards/pontosBeneficios/cardPremio"
import CardHistoricoPontuacao from "../components/cards/pontosBeneficios/cardHistoricoPontuacao"
import { buscarSaldoMock } from "../mocks/mockPontosBeneficios"
import { USAR_MOCK } from "../mocks/mockBase"

export default function PontosBeneficios() {
    // Estado inicial vazio (ou com zeros) para enquanto o mock "carrega"
    const [saldoDados, setSaldoDados] = useState({
        saldo: 0,
        porcentagem: 0,
        nivelAtual: 0,
        descartes: 0,
        resgates: 0,
    })

    useEffect(() => {
        let ativo = true

        async function carregar() {
            if (USAR_MOCK) {
                const dados = await buscarSaldoMock()
                if (ativo) setSaldoDados(dados)
            } else {
                // TODO: fetch real, ex.: 
                // const dados = await chamarApi("pontos/saldo", {})
                // if (ativo) setSaldoDados(dados)
            }
        }

        carregar()
        return () => { ativo = false }
    }, [])

    return(
        <main className="flex flex-1 w-full justify-center bg-[#F8F9FB]">
            <div className="flex w-full max-w-[90%] flex-col gap-8 px-6 py-10">
                <CardSaldoDisponivel
                    saldo={saldoDados.saldo}
                    porcentagem={saldoDados.porcentagem}
                    nivelAtual={saldoDados.nivelAtual}
                    descartes={saldoDados.descartes}
                    resgates={saldoDados.resgates}
                    onGanharPontos={() => console.log("clicou")}
                />

                <CardPremio />

                <div className="flex flex-col gap-10"> 
                    <CardHistoricoPontuacao />
                </div>
            </div>
        </main>
    )
}