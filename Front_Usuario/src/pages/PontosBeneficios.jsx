import CardSaldoDisponivel from "../components/cards/pontosBeneficios/cardSaldoDisponivel"
import CardPremio from "../components/cards/pontosBeneficios/cardPremio"
import CardHistoricoPontuacao from "../components/cards/pontosBeneficios/cardHistoricoPontuacao"

export default function PontosBeneficios() {
    return(
        <main className="flex flex-1 w-full justify-center bg-[#F8F9FB]">
            <div className="flex w-full max-w-[90%] flex-col gap-8 px-6 py-10">
                <CardSaldoDisponivel
                    saldo={0}
                    porcentagem={0}
                    nivelAtual={0}
                    descartes={0}
                    resgates={0}
                    onGanharPontos={() => undefined}
                />

                <CardPremio />

                <div className="flex flex-col gap-10"> 
                    <CardHistoricoPontuacao />
                </div>
            </div>
        </main>
    )
}
