import { useState } from "react"

const formatarData = (iso) =>
  iso
    ? new Date(iso)
        .toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
        .replace(", ", " às ")
    : ""

const moeda = (v) => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

function Info({ label, valor, destaque }) {
  return (
    <div className="border border-gray-200 rounded-md px-3 py-2 flex-1">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-sm font-semibold ${destaque ?? ""}`}>{valor}</p>
    </div>
  )
}

export default function CardInfoItem({ anuncio }) {
  const [foto, setFoto] = useState(0)
  const imagens = anuncio.imagem ?? []
  const atual = imagens[foto]

  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex flex-col gap-5">
      <div className="flex flex-col md:flex-row gap-5">

        <div className="relative w-full md:w-[220px] h-[200px] shrink-0 rounded-lg bg-gray-100 border border-dashed border-gray-300 overflow-hidden flex items-center justify-center">
          <span className="absolute top-2 left-2 bg-gray-600 text-white text-[10px] px-2 py-0.5 rounded z-10">
            Anexo Original
          </span>

          {atual ? (
            <img src={atual.url} alt={anuncio.nome} className="w-full h-full object-cover" />
          ) : (
            <p className="text-sm text-gray-400">Sem imagem</p>
          )}

          {imagens.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2 text-xs">
              <button className="bg-white/80 rounded px-2 cursor-pointer" onClick={() => setFoto((foto - 1 + imagens.length) % imagens.length)}>‹</button>
              <span className="bg-white/80 rounded px-2">Foto {foto + 1} de {imagens.length}</span>
              <button className="bg-white/80 rounded px-2 cursor-pointer" onClick={() => setFoto((foto + 1) % imagens.length)}>›</button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 flex-1">
          {anuncio.categoria && (
            <span className="self-start bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
              {anuncio.categoria.nome}
            </span>
          )}

          <h2 className="text-xl font-bold">{anuncio.nome}</h2>
          <p className="text-xs text-gray-400">Publicado em {formatarData(anuncio.data_publicacao)}</p>

          {anuncio.preco != null && (
            <div className="flex gap-8 bg-gray-50 border border-gray-200 rounded-md px-4 py-3 mt-1">
              <div>
                <p className="text-xs text-gray-400">Preço Anunciado</p>
                <p className="text-lg font-bold text-red-600">{moeda(anuncio.preco)}</p>
              </div>

              {anuncio.estimativa_sistema != null && (
                <div>
                  <p className="text-xs text-gray-400">Estimativa do Sistema</p>
                  <p className="text-lg font-bold">{moeda(anuncio.estimativa_sistema)}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Descrição do anúncio</p>
        <p className="bg-gray-50 border border-gray-200 rounded-md p-4 text-sm text-gray-700 italic">
          "{anuncio.descricao}"
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 border-t border-gray-100 pt-4">
        <Info label="Condição" valor={anuncio.condicao_item?.nome ?? "-"} />
        <Info label="Modalidade" valor={anuncio.modalidade?.nome ?? "-"} />
        <Info label="Ponto Ecológico" valor={anuncio.categoria ? `+${anuncio.categoria.pontos} Pontos` : "-"} destaque="text-green-600" />
      </div>
    </div>
  )
}