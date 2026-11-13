import { useRef, useState } from "react"
import { Scale, BanknoteX, Skull, Copy, MessageSquareWarning, Ellipsis, CloudUpload, X } from "lucide-react"
import TituloSecao from "../../ui/tituloSecao"
import BotaoDenuncia from "../../ui/BotaoDenuncia"

const MOTIVOS = [
  {
    value: "material_divergente",
    icon: <Scale size={16} />,
    title: "Material ou peso divergente",
    description:
      "Não condiz com a descrição fornecida, lote inferior a 50kg ou formato incorreto.",
  },
  {
    value: "preco_abusivo",
    icon: <BanknoteX size={16} />,
    title: "Preço abusivo ou fraude externa",
    description:
      "Exigência de PIX ou transferência fora do checkout seguro da plataforma.",
  },
  {
    value: "residuo_perigoso",
    icon: <Skull size={16} />,
    title: "Resíduo contaminado ou perigoso",
    description:
      "Presença de graxas, solventes, umidade severa ou infração ambiental.",
  },
  {
    value: "anuncio_falso",
    icon: <Copy size={16} />,
    title: "Anúncio falso, duplicado ou vendido",
    description:
      "Fotos copiadas de outro anunciante ou produto que já foi negociado.",
  },
  {
    value: "comportamento_chat",
    icon: <MessageSquareWarning size={16} />,
    title: "Comportamento abusivo no chat",
    description:
      "Desrespeito, mensagens ofensivas, intimidação ou assédio comercial.",
  },
  {
    value: "outro",
    icon: <Ellipsis size={16} />,
    title: "Outro motivo não listado",
    description:
      "Circunstâncias específicas ou dúvidas regulatórias sobre a cooperativa.",
  },
]

const TIPOS_ACEITOS = ["image/png", "image/jpeg", "application/pdf"]
const TAMANHO_MAX = 10 * 1024 * 1024 // 10MB

export default function CardMotivoDenuncia({
  valorInicial = "material_divergente",
  onChange,
  onCancelar,
  onEnviar,
}) {
  const [motivo, setMotivo] = useState(valorInicial)
  const [descricao, setDescricao] = useState("")
  const [arquivos, setArquivos] = useState([])
  const [erroArquivo, setErroArquivo] = useState("")
  const [arrastando, setArrastando] = useState(false)
  const [declaracao, setDeclaracao] = useState(false)
  const inputArquivoRef = useRef(null)

  function selecionar(value) {
    setMotivo(value)
    onChange?.(value)
  }

  function adicionarArquivos(lista) {
    const novos = []
    let erro = ""

    Array.from(lista).forEach((f) => {
      if (!TIPOS_ACEITOS.includes(f.type)) {
        erro = `"${f.name}" não é PNG, JPG ou PDF.`
      } else if (f.size > TAMANHO_MAX) {
        erro = `"${f.name}" passa de 10MB.`
      } else {
        novos.push(f)
      }
    })

    setErroArquivo(erro)
    setArquivos((atuais) => [...atuais, ...novos])
  }

  function aoSoltar(e) {
    e.preventDefault()
    setArrastando(false)
    adicionarArquivos(e.dataTransfer.files)
  }

  function removerArquivo(indice) {
    setArquivos((atuais) => atuais.filter((_, i) => i !== indice))
  }

  function enviar() {
    onEnviar?.({ motivo, descricao, arquivos })
  }

  return (
    <section className="flex flex-col gap-6 rounded-3xl bg-white px-5 py-5">

      <TituloSecao numero={1}>
        Selecione o motivo principal da denúncia
      </TituloSecao>

      <div
        role="radiogroup"
        aria-label="Motivo da denúncia"
        className="grid grid-cols-1 gap-3 md:grid-cols-2"
      >
        {MOTIVOS.map((m) => (
          <BotaoDenuncia
            key={m.value}
            {...m}
            checked={motivo === m.value}
            onChange={selecionar}
          />
        ))}
      </div>

      <TituloSecao numero={2}>
        Descrição detalhada do ocorrido
      </TituloSecao>

      <div className="flex flex-col gap-2">
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          maxLength={1000}
          placeholder="Explique com mais detalhes o que aconteceu. Se houver mensagens suspeitas, menção de outros canais ou inconsistências no lote de papelão prensado, relate aqui..."
          className="h-[194px] w-full resize-none rounded-2xl bg-[#F8F9FB] p-4 text-sm text-[#191C1E] outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-[#6F2DBD]/30"
        />
        
        <div className="flex items-center justify-end gap-2">
          <span className="font-mono text-[11px] text-gray-500">
            {descricao.length} / 1000
          </span>
          <span className="text-[11px] font-medium text-gray-500 pr-6">
            Opcional
          </span>
        </div>
      </div>

      <TituloSecao numero={3}>
        Anexar evidências
      </TituloSecao>

      <div className="flex flex-col gap-2">
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputArquivoRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              inputArquivoRef.current?.click()
            }
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setArrastando(true)
          }}
          onDragLeave={() => setArrastando(false)}
          onDrop={aoSoltar}
          className={`flex h-[150px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl text-center transition ${
            arrastando
              ? "bg-[#F1E9FB] ring-2 ring-[#6F2DBD]/40"
              : "bg-[#F8F9FB] hover:bg-gray-100"
          }`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#6F2DBD] shadow-sm">
            <CloudUpload size={22} />
          </span>
          <p className="text-sm font-medium text-[#6F2DBD]">
            Clique para selecionar ou arraste arquivos aqui
          </p>

          <input
            ref={inputArquivoRef}
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.pdf"
            className="hidden"
            onChange={(e) => {
              adicionarArquivos(e.target.files)
              e.target.value = "" // permite reenviar o mesmo arquivo
            }}
          />
        </div>

        <div className="flex justify-end">
            <span className="text-[11px] font-medium text-gray-500 pr-6">
              Opcional
            </span>
        </div>

        {erroArquivo && (
          <p className="text-xs font-medium text-[#E53E3E]">{erroArquivo}</p>
        )}

        {arquivos.length > 0 && (
          <ul className="mt-1 flex flex-wrap gap-2">
            {arquivos.map((f, i) => (
              <li
                key={`${f.name}-${i}`}
                className="flex items-center gap-2 rounded-full bg-[#F1E9FB] px-3 py-1 text-xs font-medium text-[#6F2DBD]"
              >
                <span className="max-w-[200px] truncate">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removerArquivo(i)}
                  aria-label={`Remover ${f.name}`}
                  className="cursor-pointer"
                >
                  <X size={12} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-[#F8F9FB] p-4">
        <input
          type="checkbox"
          checked={declaracao}
          onChange={(e) => setDeclaracao(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#6F2DBD]"
        />
        <span className="text-sm font-semibold leading-snug text-[#3E4A3D]">
          Declaro em boa-fé que as informações registradas são verdadeiras,
          objetivas e fundamentadas nas Diretrizes da Comunidade Ecomarket.
          Estou ciente de que falsas acusações intencionais podem acarretar em
          sanções na conta.
        </span>
      </label>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancelar}
          className="cursor-pointer rounded-full bg-[#F8F9FB] px-6 py-3 text-sm font-bold text-[#E53E3E] transition hover:bg-gray-100"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={enviar}
          disabled={!declaracao}
          className="cursor-pointer rounded-full bg-[#6F2DBD] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#5E23A5] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Confirmar e Enviar Denúncia
        </button>
      </div>
    </section>
  )
}