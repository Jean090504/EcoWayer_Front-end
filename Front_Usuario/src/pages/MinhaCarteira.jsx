import { useEffect, useMemo, useState } from "react"
import { buscarPontosUsuario, resumirPontos } from "../services/pontosService"
import { CircleHelp } from "lucide-react"

import Botao from "../components/ui/botao"
import CardSaldo from "../components/cards/minhaCarteira/cardSaldo"
import CardAcumulo from "../components/cards/minhaCarteira/cardAcumulo"
import CardResgates from "../components/cards/minhaCarteira/cardResgates"
import CardHistorico from "../components/cards/minhaCarteira/cardHistorico"
import CardStatusDoador from "../components/cards/minhaCarteira/cardStatusDoador"
import CardRecompensas from "../components/cards/minhaCarteira/cardRecompensas"
import { buscarNivelDoador, consultarSaldoResgate, listarEntregasUsuario, listarRecompensas, listarVouchersUsuario } from "../services/userService"

export default function MinhaCarteira({ onNavegar }) {
  const [dados, setDados] = useState(null)
  const [saldoResgate, setSaldoResgate] = useState(null)
  const [nivelDoador, setNivelDoador] = useState(null)
  const [entregas, setEntregas] = useState([])
  const [vouchers, setVouchers] = useState([])
  const [recompensas, setRecompensas] = useState([])
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
        const resultados = await Promise.allSettled([listarEntregasUsuario(), listarVouchersUsuario(), listarRecompensas(), buscarNivelDoador(usuario?.id), consultarSaldoResgate()])
        if (!ativo) return
        setDados(resumo)
        if (resultados[0].status === "fulfilled") setEntregas(resultados[0].value)
        if (resultados[1].status === "fulfilled") setVouchers(resultados[1].value)
        if (resultados[2].status === "fulfilled") setRecompensas(resultados[2].value.filter((item) => item.ativo !== 0))
        setNivelDoador(resultados[3].status === "fulfilled" ? resultados[3].value : null)
        setSaldoResgate(resultados[4].status === "fulfilled" ? resultados[4].value : null)
        if (resultados.some((item) => item.status === "rejected")) setErro("Alguns dados da carteira não puderam ser carregados.")
      } catch (error) {
        if (ativo) setErro(error.message)
      }
    }
    carregar()
    return () => { ativo = false }
  }, [tentativa])

  const saldo = dados?.total || 0
  const pontosMes = dados?.pontosMes || 0
  const transacoes = useMemo(() => [
    ...(dados?.transacoes || []),
    ...entregas.map((item) => ({ id: `entrega-${item.id}`, tipo: "entrega", icone: "reciclagem", cor: "verde", titulo: `Entrega de resíduo${item.peso_estimado ? ` (${item.peso_estimado} kg)` : ""}`, status: item.status || "Pendente", local: `Entrega #${item.id}`, pontos: 0, quando: item.data_entrega || "Data não informada" })),
    ...vouchers.map((item) => ({ id: `voucher-${item.id}`, tipo: "resgate", icone: "resgate", cor: "roxo", titulo: "Resgate de benefício", status: item.status || "Registrado", local: "Catálogo de benefícios", pontos: -(Number(item.pontos_utilizados || item.pontos_necessarios) || 0), quando: item.data_emissao || item.data_criacao || "Data não informada" })),
  ], [dados, entregas, vouchers])

  const recompensasFormatadas = useMemo(() => recompensas.map((item) => ({ id: item.id, categoria: item.nome_parceiro || "Parceiro EcoWayer", titulo: item.beneficio || "Benefício disponível", pontos: Number(item.pontos_necessarios) || 0 })), [recompensas])

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
            saldo={saldoResgate}
            valorReais={null}
            onResgatar={() => onNavegar("pontosBeneficios")}
            onTransferir={() => setAviso("A transferência de pontos ainda não está disponível.")}
          />
          <CardAcumulo total={saldo} pontosMes={pontosMes} />
          <CardResgates
            total={vouchers.reduce((total, item) => total + (Number(item.pontos_utilizados || item.pontos_necessarios) || 0), 0)}
            cuponsConcluidos={vouchers.length}
          />
        </div>

        {/* Histórico (2/3) + coluna direita (1/3) */}
        <div className="grid grid-cols-3 items-stretch gap-6">
            <div className="col-span-2 flex">
                <CardHistorico transacoes={transacoes} />
            </div>

            <div className="flex flex-col gap-6">
                <CardStatusDoador atual={nivelDoador?.atual} proximo={nivelDoador?.proximo} />
                <CardRecompensas recompensas={recompensasFormatadas} onResgatar={() => onNavegar("pontosBeneficios")} />
            </div>
        </div>
        </>}
      </div>
    </main>
  )
}
