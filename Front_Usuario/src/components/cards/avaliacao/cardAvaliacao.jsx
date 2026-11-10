import { useState } from "react"
import { Star, BadgeCheck, Clock, CircleCheck, MessageSquare, Package, ThumbsUp, MapPin } from "lucide-react"

const LABELS = ["", "Ruim", "Regular", "Bom", "Muito bom", "Excelente"]

const TAGS = [
  { id: "pontual", label: "Pontual", icon: Clock },
  { id: "conforme", label: "Item conforme anunciado", icon: CircleCheck },
  { id: "comunicacao", label: "Comunicação ágil", icon: MessageSquare },
  { id: "embalagem", label: "Embalagem sustentável", icon: Package },
]

export default function CardAvaliacao({ negociacao, onEnviar, onAdiar }) {
  const [rating, setRating] = useState(0)
  const [selectedTags, setSelectedTags] = useState([])
  const [recommend, setRecommend] = useState(false)
  const [comment, setComment] = useState("")

  const preco = negociacao.preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  function marcarOuDesmarcarTag(id) {
    if (selectedTags.includes(id)) {
      setSelectedTags(selectedTags.filter((t) => t !== id))
    } else {
      setSelectedTags([...selectedTags, id])
    }
  }

  function enviar() {
    onEnviar({ rating, tags: selectedTags, recommend, comment })
  }

  return (
    <div className="flex flex-col w-full max-w-[860px] mx-auto bg-white rounded-[32px] p-12 mb-3">
      <span className="inline-flex items-center gap-1.5 self-start bg-[#4CAF50] text-white text-[11px] font-semibold rounded-full px-3 py-1">
        <BadgeCheck size={14} />
        Transação Concluída com Sucesso
      </span>

      <h2 className="mt-5 text-[32px] font-bold text-[#191C1E]">
        Avaliar Negociação &amp; Impacto Circular
      </h2>

      {/* Card do item */}
      <div className="mt-8 flex flex-row items-center justify-between gap-6 w-full bg-[#F8F8F8] rounded-[24px] p-6">
        <div className="flex flex-row items-center gap-4">
          <img
            src={negociacao.itemImagem}
            alt={negociacao.itemTitulo}
            className="w-28 h-28 rounded-xl object-cover"
          />
          <div className="flex flex-col gap-1">
            <p className="font-bold text-[11px] text-[#4CAF50]">ITEM ENTREGUE</p>
            <p className="font-semibold text-[20px] text-[#191C1E]">
              {negociacao.itemTitulo}
            </p>
            <p className="text-[12px] text-[#3E4A3D]">
              Vendedor: <span className="text-[#191C1E]">{negociacao.vendedorNome}</span> • {negociacao.dataEntrega}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2">
            <span className="text-[14px] font-semibold text-[#191C1E]">{preco}</span>
            <span className="bg-[#4CAF50] text-white text-[11px] font-semibold rounded-full px-2 py-0.5">
              +{negociacao.ecoPontos} EcoPts
            </span>
          </div>
          <p className="flex items-center gap-1.5 text-[12px] text-[#3E4A3D]">
            <MapPin size={14} className="text-[#4CAF50]" />
            Entrega no <span className="text-[#191C1E]">{negociacao.localEntrega}</span>
          </p>
        </div>
      </div>

      {/* Estrelas */}
      <p className="mt-8 text-[20px] font-semibold text-[#191C1E]">
        Como foi sua experiência com {negociacao.vendedorNome}?
      </p>

      <div className="mt-5 flex items-center gap-4">
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)} className="cursor-pointer">
              <Star
                size={32}
                className={n <= rating ? "fill-[#4CAF50] text-[#4CAF50]" : "text-gray-300"}
              />
            </button>
          ))}
        </div>

        {rating > 0 && (
          <span className="bg-[#4CAF50] text-white text-[14px] font-semibold rounded-full px-4 py-1">
            {LABELS[rating]} ({rating}.0)
          </span>
        )}
      </div>

      {/* Tags */}
      <div className="mt-8 flex flex-wrap gap-3">
        {TAGS.map((tag) => (
          <button
            key={tag.id}
            onClick={() => marcarOuDesmarcarTag(tag.id)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold cursor-pointer ${
              selectedTags.includes(tag.id)
                ? "bg-[#724BC2] text-white"
                : "bg-[#F3F3F3] text-[#191C1E]"
            }`}
          >
            <tag.icon size={16} />
            {tag.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => setRecommend(!recommend)}
        className={`mt-3 self-start inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold cursor-pointer ${
          recommend ? "bg-[#724BC2] text-white" : "bg-[#F3F3F3] text-[#191C1E]"
        }`}
      >
        <ThumbsUp size={16} />
        Recomendo para a comunidade
      </button>

      {/* Comentário */}
      <div className="mt-8 flex items-center justify-between">
        <label htmlFor="comentario" className="text-[14px] font-semibold text-[#191C1E]">
          Conte mais detalhes sobre a negociação{" "}
          <span className="font-normal text-[12px] text-[#3E4A3D]">(opcional)</span>
        </label>
        <span className="text-[12px] text-[#3E4A3D]">{comment.length} / 500 caracteres</span>
      </div>

      <textarea
        id="comentario"
        rows={4}
        maxLength={500}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Ex: O vendedor foi super prestativo, explicou a procedência da restauração e o ponto de encontro foi seguro..."
        className="mt-3 w-full resize-none rounded-2xl bg-[#F8F8F8] border border-gray-200 p-4 text-[14px] focus:outline-none"
      />

      {/* Ações */}
      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={onAdiar}
          className="rounded-xl border border-[#724BC2]/40 px-6 py-3 text-[14px] font-semibold text-[#724BC2] cursor-pointer"
        >
          Avaliar mais tarde
        </button>

        <button
          onClick={enviar}
          disabled={rating === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-[#724BC2] px-6 py-3 text-[14px] font-semibold text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CircleCheck size={18} />
          Enviar avaliação
        </button>
      </div>
    </div>
  )
}