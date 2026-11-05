const tempoNaPlataforma = (data) => {
  if (!data) return "-"
  const meses = Math.floor((Date.now() - new Date(data.replace(" ", "T"))) / (1000 * 60 * 60 * 24 * 30.44))

  if (meses < 1) return "Menos de 1 mês"
  if (meses < 12) return `${meses} ${meses === 1 ? "mês" : "meses"}`

  const anos = Math.floor(meses / 12)
  return `${anos} ${anos === 1 ? "ano" : "anos"}`
}

function Linha({ label, valor, cor = "" }) {
  return (
    <div className="flex justify-between text-sm py-1.5">
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold ${cor}`}>{valor}</span>
    </div>
  )
}

export default function CardVendedor({ usuario, onVerPerfil }) {
  if (!usuario) return null

  const iniciais = usuario.nome?.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase()
  const ativo = usuario.status_usuario?.status === "ativo"

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <p className="text-xs font-semibold text-gray-400 uppercase mb-4">Dados do vendedor</p>

      <div className="flex items-center gap-3 mb-4">
        {usuario.imagem?.url ? (
          <img src={usuario.imagem.url} alt={usuario.nome} className="w-11 h-11 rounded-full object-cover" />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">{iniciais}</div>
        )}
        <p className="font-bold">{usuario.nome}</p>
      </div>

      <div className="border-t border-gray-100 pt-2">
        <Linha label="Tempo na plataforma" valor={tempoNaPlataforma(usuario.data_cadastro)} />
        <Linha label="Nível de impacto" valor={usuario.nivel_impacto?.nome ?? "-"} />
        <Linha
          label="Status da conta"
          valor={ativo ? "Ativo" : "Desativado"}
          cor={ativo ? "text-green-600" : "text-red-600"}
        />
      </div>

      <button
        className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-sm font-semibold rounded-md py-2 cursor-pointer"
        onClick={onVerPerfil}
      >
        Ver Perfil Completo do Usuário
      </button>
    </div>
  )
}