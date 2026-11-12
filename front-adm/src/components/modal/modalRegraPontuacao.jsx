import { useEffect, useId, useState } from "react"

const EMPTY_VALUES = {
  categoria: "",
  ativa: true,
  pontos: "",
  bonus: "",
  excelente: "",
  bom: "",
  regular: "",
}

// Para mudar os multiplicadores (nome, cor ou etiqueta), edite aqui
const MULTIPLICADORES = [
  { key: "excelente", label: "Excelente", tag: "Top", cor: "bg-[#4CAF50]", tagCor: "text-[#4CAF50]" },
  { key: "bom", label: "Bom", tag: "Médio", cor: "bg-[#7350B9]", tagCor: "text-[#7350B9]" },
  { key: "regular", label: "Regular", tag: "Base", cor: "bg-[#F5A623]", tagCor: "text-[#F5A623]" },
]

const labelClass = "text-xs font-bold uppercase text-neutral-800"

const fieldBox =
  "flex h-[42px] items-center gap-2 rounded border border-neutral-200 bg-white px-3 " +
  "focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/25"

const bareInput =
  "min-w-0 flex-1 bg-transparent text-base font-medium text-neutral-900 outline-none " +
  "placeholder:text-neutral-400"

const formatNumber = (n) => Number(n.toFixed(2))

export default function ModalRegraPontuacao({
  open,
  initialValues,
  categorias = [], // [{ value: "eletronicos", label: "Eletrônicos" }]
  onClose,
  onSubmit, // recebe { categoria, ativa, pontos, bonus, excelente, bom, regular }
  onDeactivate, // clique em "Desativar Esta Regra"
}) {
  const uid = useId()
  const [values, setValues] = useState({ ...EMPTY_VALUES, ...initialValues })
  const [errors, setErrors] = useState({})

  // Reseta ao abrir ou trocar de regra (use useMemo no initialValues do pai)
  useEffect(() => {
    if (!open) return
    setValues({ ...EMPTY_VALUES, ...initialValues })
    setErrors({})
  }, [open, initialValues])

  // Fecha com ESC
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && onClose?.()
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  const set = (field) => (e) =>
    setValues((v) => ({ ...v, [field]: e.target.value }))

  // Simulação instantânea: pontos × multiplicador "Excelente" + bônus %
  const pontos = Number(values.pontos) || 0
  const mult = Number(values.excelente) || 0
  const bonus = Number(values.bonus) || 0
  const simulacao = pontos * mult * (1 + bonus / 100)

  const validate = () => {
    const next = {}
    if (!values.categoria) next.categoria = "Selecione uma categoria"
    if (values.pontos === "" || Number(values.pontos) < 0)
      next.pontos = "Informe uma pontuação válida"
    MULTIPLICADORES.forEach(({ key }) => {
      if (values[key] === "" || Number(values[key]) <= 0)
        next[key] = "Inválido"
    })
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit?.({
      ...values,
      pontos: Number(values.pontos),
      bonus: Number(values.bonus) || 0,
      excelente: Number(values.excelente),
      bom: Number(values.bom),
      regular: Number(values.regular),
    })
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#1e2950]/35 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        onSubmit={handleSubmit}
        noValidate
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-[672px] flex-col overflow-y-auto rounded-3xl bg-white text-neutral-900"
      >
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 border-b border-neutral-100 px-7 py-6">
          <span className="h-2.5 w-2.5 rounded-full bg-[#7350B9]" aria-hidden="true" />
          <h2 id={`${uid}-title`} className="text-xl font-bold text-[#202735]">
            Gerenciar Regra de Pontuação
          </h2>
        </div>

        <div className="flex flex-col gap-5 px-7 py-6">
          {/* Categoria + status */}
          <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor={`${uid}-categoria`} className={labelClass}>
                Categoria selecionada
              </label>
              <select
                id={`${uid}-categoria`}
                value={values.categoria}
                onChange={set("categoria")}
                aria-invalid={!!errors.categoria}
                className="h-[42px] w-full rounded border border-neutral-200 bg-white px-3 text-base font-medium outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/25 aria-[invalid=true]:border-red-500"
              >
                <option value="" disabled>
                  Selecione...
                </option>
                {categorias.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {errors.categoria && (
                <span className="text-sm text-red-500">{errors.categoria}</span>
              )}
            </div>

            <div className="flex h-[50px] items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4">
              <span id={`${uid}-status`} className="text-sm font-bold">
                Status da Regra
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={values.ativa}
                aria-labelledby={`${uid}-status`}
                onClick={() => setValues((v) => ({ ...v, ativa: !v.ativa }))}
                className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-green-500/50 ${
                  values.ativa ? "bg-green-500" : "bg-neutral-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    values.ativa ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Pontuação base + bonificação */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor={`${uid}-pontos`} className={labelClass}>
                Pontuação base (pts)
              </label>
              <div className={`${fieldBox} ${errors.pontos ? "border-red-500" : ""}`}>
                <input
                  id={`${uid}-pontos`}
                  type="number"
                  min="0"
                  placeholder="150"
                  value={values.pontos}
                  onChange={set("pontos")}
                  aria-invalid={!!errors.pontos}
                  className={bareInput}
                />
                <span className="rounded bg-green-500 px-2 py-0.5 text-xs font-bold text-white">
                  pts
                </span>
              </div>
              {errors.pontos && (
                <span className="text-sm text-red-500">{errors.pontos}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={`${uid}-bonus`} className={labelClass}>
                Bonificação extra de campanha
              </label>
              <div className={fieldBox}>
                <span className="font-medium text-green-600">+</span>
                <input
                  id={`${uid}-bonus`}
                  type="number"
                  min="0"
                  placeholder="10"
                  value={values.bonus}
                  onChange={set("bonus")}
                  className={`${bareInput} !flex-none w-16 text-green-600`}
                />
                <span className="font-medium text-green-600">%</span>
                {bonus > 0 && (
                  <span className="ml-auto rounded bg-green-500 px-2 py-0.5 text-xs font-bold text-white">
                    Ativo
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Multiplicadores */}
          <div className="flex flex-col gap-2">
            <span className={labelClass}>Multiplicadores por estado de conservação</span>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {MULTIPLICADORES.map(({ key, label, tag, cor, tagCor }) => (
                <div key={key} className={`flex flex-col gap-2 rounded-2xl p-3.5 ${cor}`}>
                  <div className="flex items-center justify-between text-white">
                    <label htmlFor={`${uid}-${key}`} className="text-sm font-bold">
                      {label}
                    </label>
                    <span className={`rounded bg-white px-2 py-0.5 text-xs font-bold ${tagCor}`}>
                      {tag}
                    </span>
                  </div>
                  <div
                    className={`flex h-[34px] items-center rounded bg-white px-3 ${
                      errors[key] ? "ring-2 ring-red-500" : ""
                    }`}
                  >
                    <input
                      id={`${uid}-${key}`}
                      type="number"
                      min="0"
                      step="0.1"
                      value={values[key]}
                      onChange={set(key)}
                      aria-invalid={!!errors[key]}
                      className="min-w-0 flex-1 bg-transparent text-base font-medium text-neutral-900 outline-none"
                    />
                    <span className="text-sm text-neutral-500" aria-hidden="true">×</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulação instantânea */}
          <div
            className="flex items-center justify-between gap-4 rounded-2xl border border-[#E6E1F5] bg-[#F7F5FD] px-5 py-5"
            aria-live="polite"
          >
            <span className="text-sm font-bold uppercase text-neutral-500">
              Simulação instantânea
            </span>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#7350B9]">
                {formatNumber(simulacao)} pts
              </p>
              <p className="text-xs text-neutral-500">
                {pontos} × {mult} + {bonus}% bônus
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mx-7 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-6 pb-7">
          <button
            type="button"
            onClick={onDeactivate}
            className="cursor-pointer rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-white hover:brightness-95 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-black/25"
          >
            Desativar Esta Regra
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm hover:bg-neutral-50 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-black/25"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-[#7350B9] px-5 py-2.5 text-sm font-bold text-white hover:brightness-95 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-black/25"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}