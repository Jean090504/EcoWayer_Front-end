import { useEffect, useId, useRef, useState } from "react"

const STATUS_OPTIONS = ["Ativo", "Inativo", "Em Revisão"]

const EMPTY_VALUES = {
  image: null, // File | string (url) | null
  name: "",
  points: "",
  status: "Ativo",
  description: "",
}

// Para criar um novo modo, basta adicionar uma entrada aqui
const MODE_CONFIG = {
  create: {
    title: "Adicionar Novo Item",
    subtitle: "Cadastre um novo móvel para pontuação",
    descriptionLabel: "Descrição (Opcional)",
    submitLabel: "Salvar Item",
    cancelLabel: "Cancelar",
    readOnly: false,
  },
  edit: {
    title: "Editar Item",
    subtitle: "Atualize as informações deste item",
    descriptionLabel: "Descrição (Opcional)",
    submitLabel: "Salvar",
    cancelLabel: "Cancelar",
    readOnly: false,
  },
  view: {
    title: "Detalhes do Item",
    subtitle: "Informações cadastradas para este item",
    descriptionLabel: "Descrição",
    submitLabel: null,
    cancelLabel: "Fechar",
    readOnly: true,
  },
}

const inputClass =
  "w-full rounded border border-neutral-200 bg-neutral-50 px-3.5 py-3.5 text-base text-neutral-900 " +
  "placeholder:text-neutral-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/25 " +
  "read-only:cursor-default aria-[invalid=true]:border-red-500"

export default function ModalItem({
  open,
  mode = "create", // "create" | "edit" | "view"
  initialValues,
  onClose,
  onSubmit,
  statusOptions = STATUS_OPTIONS,
  children, // campos extras opcionais
}) {
  const config = MODE_CONFIG[mode]
  const uid = useId()
  const fileRef = useRef(null)
  const [values, setValues] = useState({ ...EMPTY_VALUES, ...initialValues })
  const [errors, setErrors] = useState({})
  const [preview, setPreview] = useState(null)

  // Reseta o formulário ao abrir ou trocar de item
  useEffect(() => {
    if (!open) return
    setValues({ ...EMPTY_VALUES, ...initialValues })
    setErrors({})
  }, [open, initialValues])

  // Preview da imagem (File ou URL)
  useEffect(() => {
    const img = values.image
    if (!img) return setPreview(null)
    if (typeof img === "string") return setPreview(img)
    const url = URL.createObjectURL(img)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [values.image])

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

  const validate = () => {
    const next = {}
    if (!values.name.trim()) next.name = "Informe o nome do item"
    if (values.points === "" || Number(values.points) < 0)
      next.points = "Informe uma pontuação válida"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (config.readOnly || !validate()) return
    onSubmit?.({ ...values, points: Number(values.points) })
  }

  return (
    <div
      className = "fixed inset-0 z-[1000] flex items-center justify-center bg-[#1e2950]/35 p-4"
      onMouseDown = {(e) => e.target === e.currentTarget && onClose?.()}
    >
      <form
        role = "dialog"
        aria-modal = "true"
        aria-labelledby = {`${uid}-title`}
        onSubmit = {handleSubmit}
        noValidate
        className = "flex max-h-[calc(100vh-2rem)] w-full max-w-[700px] flex-col gap-5 overflow-y-auto rounded-lg bg-white p-5 text-neutral-900 sm:p-7"
      >
        <h2 id = {`${uid}-title`} className = "text-xl font-bold">
          {config.title}
        </h2>
        <p className = "-mt-2 text-lg">{config.subtitle}</p>

        {/* Imagem + nome */}
        <div className = "flex items-end gap-5">
          <button
            type = "button"
            onClick = {() => !config.readOnly && fileRef.current?.click()}
            disabled = {config.readOnly}
            aria-label = "Selecionar imagem do item"
            className = "h-20 w-20 shrink-0 overflow-hidden rounded bg-neutral-300 enabled:cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-green-500/50"
          >
            {preview && (
              <img src = {preview} alt = "" className = "h-full w-full object-cover" />
            )}
          </button>
          <input
            ref = {fileRef}
            type = "file"
            accept = "image/*"
            hidden
            onChange = {(e) =>
              setValues((v) => ({ ...v, image: e.target.files?.[0] ?? null }))
            }
          />

          <div className = "flex min-w-0 flex-1 flex-col gap-2">
            <label htmlFor = {`${uid}-name`} className = "text-lg">
              Nome do Item
            </label>
            <input
              id = {`${uid}-name`}
              type = "text"
              placeholder = "Ex: Cômoda 5 Gavetas"
              value = {values.name}
              onChange = {set("name")}
              readOnly = {config.readOnly}
              aria-invalid = {!!errors.name}
              className = {inputClass}
            />
            {errors.name && (
              <span className = "text-sm text-red-500">{errors.name}</span>
            )}
          </div>
        </div>

        {/* Pontuação + status */}
        <div className = "flex flex-col gap-5 sm:flex-row">
          <div className = "flex flex-1 flex-col gap-2">
            <label htmlFor = {`${uid}-points`} className = "text-lg">
              Pontuação Base
            </label>
            <input
              id = {`${uid}-points`}
              type = "number"
              min = "0"
              placeholder = "350"
              value = {values.points}
              onChange = {set("points")}
              readOnly = {config.readOnly}
              aria-invalid = {!!errors.points}
              className = {inputClass}
            />
            {errors.points && (
              <span className = "text-sm text-red-500">{errors.points}</span>
            )}
          </div>

          <div className = "flex flex-1 flex-col gap-2">
            <label htmlFor = {`${uid}-status`} className = "text-lg">
              Status Inicial
            </label>
            <select
              id = {`${uid}-status`}
              value = {values.status}
              onChange = {set("status")}
              disabled = {config.readOnly}
              className = {inputClass}
            >
              {statusOptions.map((s) => (
                <option key = {s} value = {s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Descrição */}
        <div className = "flex flex-col gap-2">
          <label htmlFor = {`${uid}-desc`} className = "text-lg">
            {config.descriptionLabel}
          </label>
          <textarea
            id = {`${uid}-desc`}
            rows = {4}
            placeholder = "Ex: Aceitamos apenas com todas as gavetas"
            value = {values.description}
            onChange = {set("description")}
            readOnly = {config.readOnly}
            className = {`${inputClass} min-h-[130px] resize-y`}
          />
        </div>

        {children}

        {/* Rodapé */}
        <div className = "mt-2 flex justify-end gap-3 sm:gap-6">
          {config.readOnly ? (
            <button
              type = "button"
              onClick = {onClose}
              className = "rounded border border-neutral-200 bg-white px-6 py-2.5 text-base hover:bg-neutral-50 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-black/25"
            >
              {config.cancelLabel}
            </button>
          ) : (
            <>
              <button
                type = "button"
                onClick = {onClose}
                className = "min-w-[120px] flex-1 rounded bg-red-500 px-6 py-2.5 text-base text-white hover:brightness-95 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-black/25 sm:flex-none"
              >
                {config.cancelLabel}
              </button>
              <button
                type = "submit"
                className = "min-w-[120px] flex-1 rounded bg-green-500 px-6 py-2.5 text-base text-white hover:brightness-95 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-black/25 sm:flex-none"
              >
                {config.submitLabel}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  )
}