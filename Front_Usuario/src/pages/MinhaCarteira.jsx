import { CircleHelp } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import Botao from "../components/ui/botao"
import CardSaldo from "../components/cards/minhaCarteira/cardSaldo"
import CardAcumulo from "../components/cards/minhaCarteira/cardAcumulo"
import CardResgates from "../components/cards/minhaCarteira/cardResgates"
import CardHistorico from "../components/cards/minhaCarteira/cardHistorico"
import CardStatusDoador from "../components/cards/minhaCarteira/cardStatusDoador"
import CardRecompensas from "../components/cards/minhaCarteira/cardRecompensas"
import { buscarAnuncio, listarEntregasUsuario, listarPontosUsuario, listarRecompensas, listarVouchersUsuario } from "../services/userService"

const numero = (valor) => Number(valor) || 0

function dataLegivel(valor) {
  if (!valor) return "Data não informada"
  const data = new Date(String(valor).replace(" ", "T"))
  return Number.isNaN(data.getTime()) ? String(valor) : data.toLocaleDateString("pt-BR")
}

export default function MinhaCarteira() {
  const [pontos, setPontos] = useState([])
  const [entregas, setEntregas] = useState([])
  const [vouchers, setVouchers] = useState([])
  const [recompensas, setRecompensas] = useState([])
  const [erro, setErro] = useState("")

  useEffect(() => {
    Promise.allSettled([listarPontosUsuario(), listarEntregasUsuario(), listarVouchersUsuario(), listarRecompensas()])
      .then(([pontosResult, entregasResult, vouchersResult, recompensasResult]) => {
        if (pontosResult.status === "fulfilled") setPontos(pontosResult.value)
        if (entregasResult.status === "fulfilled") setEntregas(entregasResult.value)
        if (vouchersResult.status === "fulfilled") setVouchers(vouchersResult.value)
        if (recompensasResult.status === "fulfilled") setRecompensas(recompensasResult.value.filter((item) => item.ativo !== 0))
        if ([pontosResult, entregasResult, vouchersResult, recompensasResult].some((item) => item.status === "rejected")) {
          setErro("Alguns dados da carteira não puderam ser carregados.")
        }
      })
  }, [])

  const saldo = useMemo(() => pontos.reduce((total, item) => total + numero(item.qntd_pontos), 0), [pontos])
  const pontosMes = useMemo(() => {
    const inicioMes = new Date()
    inicioMes.setDate(1)
    return pontos.filter((item) => new Date(String(item.data_registro || "").replace(" ", "T")) >= inicioMes)
      .reduce((total, item) => total + numero(item.qntd_pontos), 0)
  }, [pontos])
  const transacoes = useMemo(() => [
    ...pontos.map((item) => ({
      id: `ponto-${item.id}`,
      tipo: "entrega",
      icone: "reciclagem",
      cor: "verde",
      titulo: `Pontuação registrada${item.id_categoria ? ` · categoria ${item.id_categoria}` : ""}`,
      status: "Confirmado",
      local: item.id_entrega ? `Entrega #${item.id_entrega}` : "EcoWayer",
      quando: dataLegivel(item.data_registro),
      pontos: numero(item.qntd_pontos),
    })),
    ...entregas.map((item) => ({
      id: `entrega-${item.id}`,
      tipo: "entrega",
      icone: "reciclagem",
      cor: "verde",
      titulo: `Entrega de resíduo${item.peso_estimado ? ` (${item.peso_estimado} kg)` : ""}`,
      status: item.status || "Pendente",
      local: `Entrega #${item.id}`,
      quando: dataLegivel(item.data_entrega),
      pontos: 0,
    })),
    ...vouchers.map((item) => ({
      id: `voucher-${item.id}`,
      tipo: "resgate",
      icone: "resgate",
      cor: "roxo",
      titulo: `Resgate ${item.id_voucher_catalogo ? `#${item.id_voucher_catalogo}` : "de benefício"}`,
      status: item.status || "Registrado",
      local: "Catálogo de benefícios",
      quando: dataLegivel(item.data_emissao || item.data_criacao),
      pontos: -numero(item.pontos_utilizados || item.pontos_necessarios),
    })),
  ].sort((a, b) => String(b.quando).localeCompare(String(a.quando))), [pontos, entregas, vouchers])

  const recompensasFormatadas = useMemo(() => recompensas.map((item) => ({
    id: item.id,
    categoria: item.nome_parceiro || "Parceiro EcoWayer",
    titulo: item.beneficio || "Benefício disponível",
    pontos: numero(item.pontos_necessarios),
  })), [recompensas])

  return (
    <main className="flex flex-1 w-full justify-center bg-[#F8F9FB]">
      <div className="flex w-full max-w-[80%] flex-col gap-8 px-6 py-10">
        {erro && <p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-700">{erro}</p>}
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
            saldo={saldo}
            valorReais={null}
            onResgatar={() => console.log("resgatar")}
            onTransferir={() => console.log("transferir")}
          />
          <CardAcumulo total={saldo} pontosMes={pontosMes} />
          <CardResgates
            total={vouchers.reduce((total, item) => total + numero(item.pontos_utilizados || item.pontos_necessarios), 0)}
            cuponsConcluidos={vouchers.length}
          />
        </div>

        {/* Histórico (2/3) + coluna direita (1/3) */}
        <div className="grid grid-cols-3 items-stretch gap-6">
            <div className="col-span-2 flex">
                <CardHistorico transacoes={transacoes} />
            </div>

            <div className="flex flex-col gap-6">
                <CardStatusDoador
                nivel={3}
                nomeNivel="Guardião Circular"
                proximaMeta="Mestre Regenerativo"
                pontosAtuais={saldo}
                pontosMeta={Math.max(1, saldo)}
                />
                <CardRecompensas recompensas={recompensasFormatadas} />
            </div>
        </div>
      </div>
    </main>
  )
}
