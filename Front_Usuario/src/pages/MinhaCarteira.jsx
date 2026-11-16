import { useEffect, useState } from "react"
import { buscarPontosUsuario, resumirPontos } from "../services/pontosService"
import { CircleHelp } from "lucide-react"

import Botao from "../components/ui/botao"
import CardSaldo from "../components/cards/minhaCarteira/cardSaldo"
import CardAcumulo from "../components/cards/minhaCarteira/cardAcumulo"
import CardResgates from "../components/cards/minhaCarteira/cardResgates"
import CardHistorico from "../components/cards/minhaCarteira/cardHistorico"
import CardStatusDoador from "../components/cards/minhaCarteira/cardStatusDoador"
import CardRecompensas from "../components/cards/minhaCarteira/cardRecompensas"

export default function MinhaCarteira() {
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState("")
  const [tentativa, setTentativa] = useState(0)
  const [aviso, setAviso] = useState("")

  useEffect(() => {
    let ativo = true
    async function carregar() {
      try {
        const usuario = JSON.parse(sessionStorage.getItem("ecowayer_usuario") || "null")
        const registros = await buscarPontosUsuario(usuario?.id)
        const resumo = resumirPontos(registros)
        if (ativo) setDados(resumo)
      } catch (error) {
        if (ativo) setErro(error.message)
      }
    }
    carregar()
    return () => { ativo = false }
  }, [tentativa])

  return (
    <main className="flex flex-1 w-full justify-center bg-[#F8F9FB]">
      <div className="flex w-full max-w-[80%] flex-col gap-8 px-6 py-10">
        {/* Título */}
        <div className="flex items-center justify-between">
          <h1 className="text-[#191C1E] text-[32px] font-bold">Minha Carteira</h1>
          <Botao
            onClick={() => setAviso("Os pontos são creditados após o registro das suas entregas. Consulte o histórico para acompanhar seus créditos.")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#724BC2] px-5 py-3 text-[13px] font-semibold text-white cursor-pointer"
          >
            <CircleHelp size={16} />
            Como Pontuar?
          </Botao>
        </div>

        {aviso && <p role="status" className="rounded-xl bg-white p-4 text-sm">{aviso}</p>}
        {erro && <div role="alert" className="rounded-xl bg-white p-4 text-sm text-red-700">{erro} <button className="underline" onClick={() => { setErro(""); setDados(null); setTentativa(tentativa + 1) }}>Tentar novamente</button></div>}
        {!dados && !erro && <p role="status">Carregando seus pontos...</p>}
        {dados && <>
        {/* 3 cards de resumo: mesma largura e mesma altura */}
        <div className="grid grid-cols-3 items-stretch gap-6">
          <CardSaldo
            saldo={dados.total}
            valorReais={null}
            onResgatar={() => setAviso("O resgate de pontos ainda não está disponível.")}
            onTransferir={() => setAviso("A transferência de pontos ainda não está disponível.")}
          />
          <CardAcumulo total={dados.total} pontosMes={dados.pontosMes} />
          <CardResgates
            total={null}
            cuponsConcluidos={null}
          />
        </div>

        {/* Histórico (2/3) + coluna direita (1/3) */}
        <div className="grid grid-cols-3 items-stretch gap-6">
            <div className="col-span-2 flex">
                <CardHistorico transacoes={dados.transacoes} />
            </div>

            <div className="flex flex-col gap-6">
                <CardStatusDoador />
                <CardRecompensas />
            </div>
        </div>
        </>}
      </div>
    </main>
  )
}