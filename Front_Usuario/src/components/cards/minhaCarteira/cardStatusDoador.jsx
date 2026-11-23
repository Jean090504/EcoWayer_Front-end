import { Star } from "lucide-react"

export default function CardStatusDoador({ atual, proximo }) {
  const meta = proximo?.meta == null ? null : Number(proximo.meta)

  return (
    <section className="flex flex-col rounded-2xl bg-white p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#724BC2]">
          <Star size={20} className="text-white" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[#3E4A3D]">
            Status de Doador
          </h2>
          {atual && (
            <p className="text-[16px] font-semibold text-[#191C1E]">
              Nível {atual.numero}: {atual.nome}
            </p>
          )}
        </div>
      </div>

      {!atual ? (
        <p className="mt-5 text-sm text-[#3E4A3D]">Seu nível de doador ainda não está disponível.</p>
      ) : proximo ? (
        <div className="mt-5 flex flex-wrap justify-between gap-2 text-sm text-[#3E4A3D]">
          <p>Próxima meta: <span className="font-semibold text-[#191C1E]">{proximo.nome}</span></p>
          {Number.isFinite(meta) && (
            <p className="font-semibold text-[#724BC2]">
              {meta.toLocaleString("pt-BR")} {proximo.unidade}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-5 text-sm text-[#3E4A3D]">Você alcançou o nível máximo.</p>
      )}
    </section>
  )
}
