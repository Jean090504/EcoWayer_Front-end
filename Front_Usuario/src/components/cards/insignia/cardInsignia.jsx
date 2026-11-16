import { useState } from "react"

const VARIANTES = {
  conquistado: {
    color: "bg-[#58A24E]",
  },
  em_progresso: {
    color: "bg-[#6F4BBF]",
  },
  bloqueado: {
    color: "bg-[#E53E3E]",
  },
  default: {
    color: "bg-gray-400",
  }
}

export default function CardInsignia({ status = "conquistado", badge, title, description, progress, footerLeft, footerRight }) {
  const [aberto, setAberto] = useState(false)

  const { color } = VARIANTES[status] ?? VARIANTES.default

  const percent =
    progress && progress.total > 0
      ? Math.min(100, (progress.value / progress.total) * 100)
      : 0

  return (
    <div
      onMouseEnter={() => setAberto(true)}
      onMouseLeave={() => setAberto(false)}
      className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm"
    >
      <div className="flex flex-1 flex-col px-6 pt-6">
        <div className="flex justify-end">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${color}`}
          >
            {badge}
          </span>
        </div>

        <div className="mt-auto pb-4">
          <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>

          {/* Descrição: só aparece com o mouse em cima */}
          {aberto && description && (
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              {description}
            </p>
          )}

          {status === "em_progresso" && progress && (
            <div className="mt-3">
              <p className="mb-1.5 text-xs text-gray-600">{progress.label}</p>
              <div className="h-1.5 w-full rounded-full bg-gray-200">
                <div
                  className={`h-full rounded-full ${color}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={`flex items-center justify-between px-6 py-4 text-xs font-semibold text-white ${color}`}
      >
        <span>{footerLeft}</span>
        <span>{footerRight}</span>
      </div>
    </div>
  )
}