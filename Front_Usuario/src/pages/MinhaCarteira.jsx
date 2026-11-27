import { useEffect, useMemo, useState } from "react"
import { buscarPontosUsuario, resumirPontos } from "../services/pontosService"
import { CircleHelp, Wallet } from "lucide-react"

import Botao from "../components/ui/botao"
import AcessoConta from "../components/ui/AcessoConta"
import CardSaldo from "../components/cards/minhaCarteira/cardSaldo"
import CardAcumulo from "../components/cards/minhaCarteira/cardAcumulo"
import CardResgates from "../components/cards/minhaCarteira/cardResgates"
import CardHistorico from "../components/cards/minhaCarteira/cardHistorico"
import CardStatusDoador from "../components/cards/minhaCarteira/cardStatusDoador"
import CardRecompensas from "../components/cards/minhaCarteira/cardRecompensas"
import { buscarNivelDoador, consultarSaldoResgate, listarEntregasUsuario, listarRecompensas, listarVouchersUsuario } from "../services/userService"

export default function MinhaCarteira({ onNavegar, onAbrirLogin, usuario }) {
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
    if (!usuario?.id) return
    let ativo = true
    async function carregar() {
      try {
        const registros = await buscarPontosUsuario(usuario?.id)
        const resumo = resumirPontos(registros)
        const entregasUsuario = listarEntregasUsuario()
        const nivelUsuario = entregasUsuario.then(
          entregas => buscarNivelDoador(usuario?.id, { semAtividade: registros.length === 0 && entregas.length === 0 }),
          () => buscarNivelDoador(usuario?.id)
        )
        const resultados = await Promise.allSettled([entregasUsuario, listarVouchersUsuario(), listarRecompensas(), nivelUsuario, consultarSaldoResgate()])
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
  }, [tentativa, usuario?.id])

  const saldo = dados?.total || 0
  const pontosMes = dados?.pontosMes || 0
  const transacoes = useMemo(() => [
    ...(dados?.transacoes || []),
    ...entregas.map((item) => ({ id: `entrega-${item.id}`, tipo: "entrega", icone: "reciclagem", cor: "verde", titulo: `Entrega de resíduo${item.peso_estimado ? ` (${item.peso_estimado} kg)` : ""}`, status: item.status || "Pendente", local: `Entrega #${item.id}`, pontos: 0, quando: item.data_entrega || "Data não informada" })),
    ...vouchers.map((item) => ({ id: `voucher-${item.id}`, tipo: "resgate", icone: "resgate", cor: "roxo", titulo: "Resgate de benefício", status: item.status || "Registrado", local: "Catálogo de benefícios", pontos: -(Number(item.pontos_utilizados || item.pontos_necessarios) || 0), quando: item.data_emissao || item.data_criacao || "Data não informada" })),
  ], [dados, entregas, vouchers])

  const recompensasFormatadas = useMemo(() => recompensas.map((item) => ({ id: item.id, categoria: item.nome_parceiro || "Parceiro EcoWayer", titulo: item.beneficio || "Benefício disponível", descricao: item.descricao || "", imagem: item.imagem || item.imagem_url || "", pontos: Number(item.pontos_necessarios) || 0 })), [recompensas])

  return (
    <main className="flex w-full flex-1 bg-[#F7F8FB]">
      <div className="flex w-full min-w-0 flex-col gap-7 px-[clamp(18px,3vw,72px)] py-8 sm:py-10 lg:gap-8">
        {/* Título */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-gradient-to-r from-[#ECF7EE] via-white to-[#F1EBFC] px-6 py-6 sm:px-8 sm:py-8">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5D3B9D]">Seu impacto</p><h1 className="mt-1 text-[clamp(28px,2.6vw,42px)] font-extrabold leading-tight text-[#22202A]">Minha Carteira</h1><p className="mt-2 max-w-2xl text-sm text-[#635C6B]">Acompanhe pontos, entregas e benefícios em um só lugar.</p></div>
          {usuario?.id && <Botao
            onClick={() => setAviso("Os pontos são creditados após o registro das suas entregas. Consulte o histórico para acompanhar seus créditos.")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#724BC2] px-5 py-3 text-[13px] font-semibold text-white cursor-pointer"
          >
            <CircleHelp size={16} />
            Como Pontuar?
          </Botao>}
        </div>

        {!usuario?.id && <div className="flex min-h-[420px] items-center justify-center py-8"><AcessoConta icone={Wallet} titulo="Acompanhe seus pontos e benefícios" descricao="Entre na sua conta para consultar seu saldo, acompanhar suas entregas e resgatar recompensas." onEntrar={onAbrirLogin} /></div>}
        {usuario?.id && <>
        {aviso && <p role="status" className="rounded-xl bg-white p-4 text-sm">{aviso}</p>}
        {erro && <div role="alert" className="rounded-xl bg-white p-4 text-sm text-red-700">{erro} <button className="underline" onClick={() => { setErro(""); setDados(null); setTentativa(tentativa + 1) }}>Tentar novamente</button></div>}
        {!dados && !erro && <p role="status" className="rounded-xl bg-white p-6 text-[#5D5667]">Carregando seus pontos...</p>}
        {dados && <>
        {/* 3 cards de resumo: mesma largura e mesma altura */}
        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:gap-7">
          <CardSaldo
            saldo={saldoResgate}
            valorReais={null}
            onResgatar={() => onNavegar("pontosBeneficios")}
          />
          <CardAcumulo total={saldo} pontosMes={pontosMes} />
          <CardResgates
            total={vouchers.reduce((total, item) => total + (Number(item.pontos_utilizados || item.pontos_necessarios) || 0), 0)}
            cuponsConcluidos={vouchers.length}
          />
        </div>

        {/* Histórico (2/3) + coluna direita (1/3) */}
        <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(340px,1fr)] 2xl:gap-7">
            <div className="flex min-w-0">
                <CardHistorico transacoes={transacoes} />
            </div>

            <div className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-1 2xl:gap-7">
                <CardStatusDoador atual={nivelDoador?.atual} proximo={nivelDoador?.proximo} />
                <CardRecompensas recompensas={recompensasFormatadas} onResgatar={() => onNavegar("pontosBeneficios")} />
            </div>
        </div>
        </>}
        </>}
      </div>
    </main>
  )
}
