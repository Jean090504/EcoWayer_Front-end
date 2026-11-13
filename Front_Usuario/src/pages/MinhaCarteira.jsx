import { CircleHelp } from "lucide-react"

import Botao from "../components/ui/botao"
import CardSaldo from "../components/cards/minhaCarteira/cardSaldo"
import CardAcumulo from "../components/cards/minhaCarteira/cardAcumulo"
import CardResgates from "../components/cards/minhaCarteira/cardResgates"
import CardHistorico from "../components/cards/minhaCarteira/cardHistorico"
import CardStatusDoador from "../components/cards/minhaCarteira/cardStatusDoador"
import CardRecompensas from "../components/cards/minhaCarteira/cardRecompensas"

const dadosTeste = {
  saldo: 1420,
  valorReais: 142,
  totalAcumulado: 3850,
  pontosMes: 240,
  totalResgatado: 2430,
  resgatesConcluidos: 6,
}

export default function MinhaCarteira() {
  return (
    <main className="flex flex-1 w-full justify-center bg-[#F8F9FB]">
      <div className="flex w-full max-w-[80%] flex-col gap-8 px-6 py-10">
        {/* Título */}
        <div className="flex items-center justify-between">
          <h1 className="text-[#191C1E] text-[32px] font-bold">Minha Carteira</h1>
          <Botao
            onClick={() => console.log("como pontuar")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#724BC2] px-5 py-3 text-[13px] font-semibold text-white cursor-pointer"
          >
            <CircleHelp size={16} />
            Como Pontuar?
          </Botao>
        </div>

        {/* 3 cards de resumo: mesma largura e mesma altura */}
        <div className="grid grid-cols-3 items-stretch gap-6">
          <CardSaldo
            saldo={dadosTeste.saldo}
            valorReais={dadosTeste.valorReais}
            onResgatar={() => console.log("resgatar")}
            onTransferir={() => console.log("transferir")}
          />
          <CardAcumulo total={dadosTeste.totalAcumulado} pontosMes={dadosTeste.pontosMes} />
          <CardResgates
            total={dadosTeste.totalResgatado}
            cuponsConcluidos={dadosTeste.resgatesConcluidos}
          />
        </div>

        {/* Histórico (2/3) + coluna direita (1/3) */}
        <div className="grid grid-cols-3 items-stretch gap-6">
            <div className="col-span-2 flex">
                <CardHistorico />
            </div>

            <div className="flex flex-col gap-6">
                <CardStatusDoador
                nivel={3}
                nomeNivel="Guardião Circular"
                proximaMeta="Mestre Regenerativo"
                pontosAtuais={1420}
                pontosMeta={2000}
                />
                <CardRecompensas />
            </div>
        </div>
      </div>
    </main>
  )
}