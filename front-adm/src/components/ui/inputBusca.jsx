import { Search, SlidersHorizontal } from "lucide-react"
import barra from "../../assets/icons/imagens/barra-input.png"

export default function InputBusca({ placeholder, aoFiltrar, value, onChange, maxWidth = "max-w-[500px]" }) {
  return (
    <div className = {`relative w-full ${maxWidth}`}>
      <Search
        size = {17}
        className = "absolute left-4 top-1/2 -translate-y-1/2 shrink-0 text-gray-400"
      />

      <input
        type = "text"
        autoComplete = "off"
        value = {value}
        onChange = {onChange}
        placeholder = {placeholder}
        className = "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-0.5 pl-[42.5px] pr-20 text-base shadow-sm outline-none placeholder:text-slate-400 focus:border-[#65BA69] focus:ring-2 focus:ring-green-100"
      />

      {aoFiltrar && <>
        <img
          src = {barra}
          alt = "Ícone de barra"
          className = "pointer-events-none absolute right-10 top-1/2 h-5 w-px -translate-y-1/2 bg-slate-200"
        />

        <button
          type = "button"
          onClick = {aoFiltrar}
          aria-label = "Abrir filtros"
          className = "absolute right-0 top-1/2 mr-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#65BA69] transition hover:bg-green-50"
        >
          <SlidersHorizontal size = {18} className = "cursor-pointer"/>
        </button>
      </>}
    </div>
  )
}
