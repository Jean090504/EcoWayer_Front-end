import { useEffect, useRef, useState } from "react"
import { Star, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { buscarBeneficiosMock } from "../../../mocks/mockBeneficios"
import { USAR_MOCK } from "../../../mocks/mockBase"

export default function CardPremio() {
  const listaRef = useRef(null)
  const [beneficios, setBeneficios] = useState([])
  const [abertoId, setAbertoId] = useState(null)

  useEffect(() => {
    let ativo = true

    async function carregar() {
      if (USAR_MOCK) {
        const dados = await buscarBeneficiosMock()
        if (ativo) setBeneficios(dados)
      } else {
        // TODO: fetch real, ex.: chamarApi("beneficios", {})
        // const dados = await chamarApi("beneficios", {})
        // if (ativo) setBeneficios(dados)
      }
    }

    carregar()
    return () => { ativo = false }
  }, [])

  function rolar(direcao) {
    const lista = listaRef.current
    lista.scrollBy({ left: direcao * lista.clientWidth, behavior: "smooth" })
  }

  function resgatar(e, beneficio) {
    e.stopPropagation()
    console.log("resgatar:", beneficio)
  }

  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-bold text-[#191C1E]">
          Benefícios e Recompensas Prontas para Resgate
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => rolar(-1)}
            aria-label="Anterior"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#191C1E] cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => rolar(1)}
            aria-label="Próximo"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#191C1E] cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div ref={listaRef} className="mt-5 flex items-start gap-3 overflow-x-auto scroll-smooth">
        {beneficios.map((b) => {
          const { imagem, selo, aviso, categoria, pontos, titulo, descricao, nota, resgates } = b
          const aberto = abertoId === b.id

          return (
            <div
              key={b.id}
              onMouseEnter={() => setAbertoId(b.id)}
              onMouseLeave={() => setAbertoId((atual) => (atual === b.id ? null : atual))}
              className="flex min-w-[calc((75%-48px)/3)] flex-1 flex-col rounded-3xl bg-white p-4"
            >
              {/* Imagem com selo e aviso por cima */}
              <div className="relative">
                <img
                  src={imagem}
                  alt={titulo}
                  className="h-[225px] w-full rounded-2xl object-cover"
                />
                <span className="absolute right-2 top-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#4CAF50]">
                  {selo}
                </span>
                <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[11px] text-white">
                  {aviso}
                </span>
              </div>

              {/* Categoria e pontos */}
              <div className="mt-4 flex flex-row items-center justify-between">
                <p className="text-[11px] font-semibold uppercase text-[#4CAF50]">{categoria}</p>
                <p className="text-[18px] font-bold text-[#4CAF50]">
                  {pontos.toLocaleString("pt-BR")} pts
                </p>
              </div>

              {/* Título */}
              <p className="mt-1 text-[18px] font-bold text-[#191C1E]">{titulo}</p>

              {/* Descrição: só aparece com o mouse em cima */}
              {aberto && (
                <p className="mt-2 text-[12px] text-[#3E4A3D]">{descricao}</p>
              )}

              {/* Rodapé */}
              <div className="mt-auto flex flex-row items-center justify-between pt-4">
                <p className="flex items-center gap-1.5 text-[12px] text-[#3E4A3D]">
                  <Star size={14} className="text-[#F5A623]" />
                  <span className="font-bold text-[#191C1E]">{nota}</span>
                  ({resgates.toLocaleString("pt-BR")} resgates)
                </p>

                <button
                  onClick={(e) => resgatar(e, b)}
                  className="flex items-center gap-1.5 rounded-lg bg-[#4CAF50] px-5 py-2 text-[13px] font-semibold text-white cursor-pointer"
                >
                  Resgatar
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}