import IconSearch from "../../assets/icons/ui/search.png"
import barra from "../../assets/icons/imagens/barra-input.png"
import filtro from "../../assets/icons/ui/filtro.png"

export default function InputBusca({ placeholder, aoFiltrar }) {
  return (
    <div className = "relative w-[500px]">
      <img 
        src = {IconSearch} 
        alt = "Ícone de busca"
        className = "absolute left-0 top-1/2 -translate-y-1/2 w-[15px] h-[15px] ml-4 cursor-pointer"
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
      
      <img 
        src = {filtro} 
        alt = "Ícone de filtro" 
        onClick = {aoFiltrar}
        className = "absolute right-0 top-1/2 -translate-y-1/2 w-[20px] h-[20px] mr-4 cursor-pointer"
      />
    </div>
  )
}