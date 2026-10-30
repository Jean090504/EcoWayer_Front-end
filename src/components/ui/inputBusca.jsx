import { Search, SlidersHorizontal } from "lucide-react"
import barra from "../../assets/icons/imagens/barra-input.png"

export default function InputBusca({ placeholder, aoFiltrar }) {
  return (
    <div className = "relative min-w-[500px] w-[20vw]">
      <Search
        size = {17}
        className = "absolute left-4 top-1/2 -translate-y-1/2 shrink-0 text-gray-400"
      />

      <input
        type = "search"
        placeholder = {placeholder}
        className = "bg-[#FFFFFF] border border-[#E5E7EB] rounded-[12px] px-3 py-0.5 pl-[42.5px] w-full h-[50px] shadow-md placeholder:text-[#8C8C8C] outline-none"
      />

      <img
        src = {barra}
        alt = "Ícone de barra"
        className = "absolute right-0 top-1/2 -translate-y-1/2 w-[1.75px] h-[20px] mr-10"
      />

      <button
        type = "button"
        onClick = {aoFiltrar}
        aria-label = "Abrir filtros"
        className = "absolute right-0 top-1/2 -translate-y-1/2 mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lime-600 transition hover:bg-lime-50"
      >
        <SlidersHorizontal size = {18} />
      </button>
    </div>
  )
}