import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import CardBase from "./cardBase"
import { buscarBeneficiosMock } from "../../../mocks/mockBeneficios"
import { USAR_MOCK } from "../../../mocks/mockBase"

export default function CardPremio() {
  const listaRef = useRef(null)
  const [beneficios, setBeneficios] = useState([])

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

  function resgatar(beneficio) {
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
        {beneficios.map((b) => (
          <div key={b.id} className="min-w-[calc((75%-48px)/3)] flex-1">
            <CardBase beneficio={b} onResgatar={resgatar} />
          </div>
        ))}
      </div>
    </section>
  )
}