import CardBase from "./cardBase"
import IconChamado from "../../assets/icons/ui/chamado-ia-icon.png"
import IconDenuncia from "../../assets/icons/ui/denuncia-icon.png"

const icones = {
  ia: IconChamado,
  denuncia: IconDenuncia
}

const estiloStatus = {
  PENDENTE: "bg-amber-100 text-amber-700",
  RESOLVIDO: "bg-green-100 text-green-700"
}

// "ANUNCIO_BLOQUEADO" -> "Anuncio bloqueado"
const formatar = (texto = "") =>
  texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase().replaceAll("_", " ")

export default function CardChamado({
  titulo,
  descricao,
  tipo,
  status,
  acao,
  usuario,
  origem,
  botaoTexto = "Verificar Anúncio",
  onClick
}) {
  return (
    <CardBase
      imagem={icones[tipo]}
      imagemTamanho="w-[65px] h-[60px]"
      margin="ml-5"
      botaoTexto={botaoTexto}
      onClick={onClick}
    >
      <div className="pl-2 flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-[clamp(18px,1.2vw,22px)]">{titulo}</p>

          {status && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${estiloStatus[status] ?? "bg-gray-100 text-gray-600"}`}>
              {formatar(status)}
            </span>
          )}

          {acao && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#7350B9]/10 text-[#7350B9]">
              {formatar(acao)}
            </span>
          )}
        </div>

        <p className="text-[clamp(14px,1.1vw,18px)] text-gray-700 line-clamp-2">{descricao}</p>

        {(usuario || origem) && (
          <p className="text-xs text-gray-500">
            {usuario && <>Usuário: <b>{usuario}</b></>}
            {usuario && origem && " · "}
            {origem && <>Detectado por {origem}</>}
          </p>
        )}
      </div>
    </CardBase>
  )
}