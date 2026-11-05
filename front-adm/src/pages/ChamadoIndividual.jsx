import { useState } from "react"

import BotaoVoltar from "../components/ui/botaoVoltar.jsx"
import CardAlertaIA from "../components/cards/cardAlerta.jsx"
import CardInfoItem from "../components/cards/cardInfoItem.jsx"
import CardVendedor from "../components/cards/cardVendedor.jsx"
import CardAcoesAdmin from "../components/cards/cardAcoesAdmin.jsx"
import { atualizarAlerta } from "../services/alertas.js"

const badgeStatus = {
  PENDENTE: { texto: "◉ Em Análise / Alerta", cor: "bg-[#7350B9]" },
  RESOLVIDO: { texto: "✓ Resolvido", cor: "bg-green-600" }
}

export default function ChamadoIndividual({ alerta, aoVoltar, aoAtualizar }) {
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)

  const anuncio = alerta.anuncio?.[0] ?? null
  const badge = badgeStatus[alerta.status] ?? { texto: alerta.status, cor: "bg-gray-500" }

  async function resolver(acao) {
    try {
      setSalvando(true)
      setErro(null)

      // o PUT do back exige motivo, status e acao; sem "anuncio" no body os vínculos são mantidos
      const atualizado = await atualizarAlerta(alerta.id, {
        motivo: alerta.motivo,
        status: "RESOLVIDO",
        acao
      })

      aoAtualizar?.(atualizado)
    } catch (e) {
      setErro(e.message)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div>
      <BotaoVoltar aoVoltar={aoVoltar} texto="← Voltar para todos os Chamados" />

      <div className="flex flex-col items-center justify-center mt-[clamp(20px,1.3vw,26px)]">
        <div className="flex flex-col gap-5 w-[95%] min-h-[85vh]">

          <div className="flex flex-row w-full items-center flex-wrap gap-y-2">
            <h1 className="text-[25px] font-bold">Verificar anúncio</h1>
            <h1 className="text-[25px] font-bold text-[#9CA3AF] ml-1.5">#CH-{alerta.id}</h1>

            <span className={`${badge.cor} text-white rounded-full text-[clamp(10px,1vw,14px)] px-3 py-1 ml-4`}>
              {badge.texto}
            </span>

            {alerta.prioridade && (
              <p className="text-[clamp(12px,1vw,14px)] text-slate-500 font-medium ml-auto">
                Prioridade: <span className="text-red-500 font-bold uppercase">{alerta.prioridade}</span>
              </p>
            )}
          </div>

          <CardAlertaIA
            titulo={`Alerta da IA: ${alerta.ia?.nome ?? "Moderação automática"}`}
            descricao={alerta.motivo}
            porcentagem={alerta.certeza}
          />

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 items-start">
            {anuncio ? (
              <CardInfoItem anuncio={anuncio} />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-gray-500">
                Este alerta não está vinculado a um anúncio (ex.: mensagem ou usuário).
              </div>
            )}

            <div className="flex flex-col gap-5">
              <CardVendedor usuario={alerta.usuario} />

              <CardAcoesAdmin
                pendente={alerta.status === "PENDENTE"}
                acaoAtual={alerta.acao}
                salvando={salvando}
                erro={erro}
                onAprovar={() => resolver("ANUNCIO_APROVADO")}
                onDesativar={() => resolver("ANUNCIO_DESATIVADO")}
                onRemover={() => {
                  if (window.confirm("Remover o anúncio e penalizar o usuário?")) resolver("ANUNCIO_BLOQUEADO")
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}