import { useState } from "react"
import { ImagePlus, X } from "lucide-react"
import { validarFoto } from "../../../services/cloudinaryService.js"
import { TituloSecao, BotaoDenuncia } from "../../ui"

export default function CardMotivoDenuncia({ motivos, enviando, erro, onCancelar, onEnviar }) {
  const [motivo, setMotivo] = useState(null)
  const [descricao, setDescricao] = useState("")
  const [arquivos, setArquivos] = useState([])
  const [erroArquivo, setErroArquivo] = useState("")

  function adicionarFotos(evento) {
    const selecionadas = Array.from(evento.target.files)
    evento.target.value = ""
    try {
      if (arquivos.length + selecionadas.length > 5) {
        throw new Error("Você pode anexar até cinco fotos.")
      }
      selecionadas.forEach(validarFoto)
      setArquivos([...arquivos, ...selecionadas])
      setErroArquivo("")
    } catch (erro) {
      setErroArquivo(erro.message)
    }
  }
  const [declaracao, setDeclaracao] = useState(false)

  function enviar(evento) {
    evento.preventDefault()
    if (!enviando && declaracao && motivo && descricao.trim()) {
      onEnviar({ motivo, descricao: descricao.trim(), arquivos })
    }
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-6 rounded-3xl bg-white px-5 py-5">

      <TituloSecao numero={1}>
        Selecione o motivo principal da denúncia
      </TituloSecao>

      <div
        role="radiogroup"
        aria-label="Motivo da denúncia"
        className="grid grid-cols-1 gap-3 md:grid-cols-2"
      >
        {motivos.map((m) => (
          <BotaoDenuncia
            key={m.id}
            value={m.id}
            title={m.tipo}
            checked={motivo === m.id}
            onChange={setMotivo}
          />
        ))}
      </div>

      <TituloSecao numero={2}>
        Descrição detalhada do ocorrido
      </TituloSecao>

      <div className="flex flex-col gap-2">
        <textarea
          aria-label="Descrição detalhada do ocorrido"
          required
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
        </div>
      </div>

      <TituloSecao numero={3}>
        Anexar fotos como evidência
      </TituloSecao>

      <div className="space-y-4 rounded-2xl border border-purple-100 bg-linear-to-br from-[#FAF8FF] to-[#F5F8F5] p-5">
        <input
          id="fotos-denuncia"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={enviando}
          onChange={adicionarFotos}
          aria-describedby="limites-fotos-denuncia"
          className="sr-only"
        />
        <label htmlFor="fotos-denuncia" className={`flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-purple-200 bg-white/80 px-4 py-6 text-center transition hover:border-[#6F2DBD] hover:bg-purple-50/50 ${enviando ? 'pointer-events-none opacity-60' : ''}`}>
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-[#6F2DBD]"><ImagePlus size={24} aria-hidden="true" /></span>
          <span className="text-sm font-semibold text-[#303640]">{arquivos.length ? "Adicionar mais fotos" : "Clique para escolher fotos"}</span>
          <span className="mt-1 text-xs text-gray-500">JPG, PNG ou WebP · até 5 MB por foto</span>
        </label>
        <div className="flex items-center justify-between text-xs text-gray-500"><p id="limites-fotos-denuncia">Opcional. Anexe até 5 fotos como evidência.</p><span className="shrink-0 font-semibold text-[#6F2DBD]">{arquivos.length}/5</span></div>
        {erroArquivo && <p role="alert" className="text-sm text-red-700">{erroArquivo}</p>}
        {arquivos.length > 0 && (
          <ul className="grid gap-2 sm:grid-cols-2">
            {arquivos.map((arquivo, indice) => (
              <li key={`${arquivo.name}-${indice}`} className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 text-sm shadow-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700"><ImagePlus size={18} aria-hidden="true" /></span>
                <span className="min-w-0 flex-1"><span className="block truncate font-medium text-gray-800">{arquivo.name}</span><span className="text-xs text-gray-500">{(arquivo.size / (1024 * 1024)).toFixed(1)} MB</span></span>
                <button
                  type="button"
                  disabled={enviando}
                  aria-label={`Remover ${arquivo.name}`}
                  className="rounded-full p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                  onClick={() => {
                    setArquivos(arquivos.filter((_, posicao) => posicao !== indice))
                    setErroArquivo("")
                  }}
                ><X size={16} aria-hidden="true" /></button>
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

      {erro && <p role="alert" className="text-sm text-red-700">{erro}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onCancelar}
          disabled={enviando}
          className="cursor-pointer rounded-full bg-[#F8F9FB] px-6 py-3 text-sm font-bold text-[#E53E3E] transition hover:bg-gray-100"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={enviando || !declaracao || !motivo || !descricao.trim()}
          className="cursor-pointer rounded-full bg-[#6F2DBD] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#5E23A5] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {enviando ? "Enviando…" : "Confirmar e Enviar Denúncia"}
        </button>
      </div>
    </form>
  )
}
