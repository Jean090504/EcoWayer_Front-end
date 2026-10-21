import Titulo from "../components/ui/titulo.jsx"
import CardCategoria from "../components/cards/cardCategoria.jsx"
import InputBusca from "../components/ui/inputBusca.jsx"
import IconSearch from "../assets/icons/ui/search.png"
import barra from "../assets/icons/imagens/barra-input.png"
import filtro from "../assets/icons/ui/filtro.png"

export default function Categorias() {
  return (
    <div>
      <Titulo texto = "Categorias" />

      <div className = "flex flex-col gap-4 mt-5 overflow-y-auto w-[1050px] mx-auto">

      <div className = "flex flex-row items-center w-full mb-9">
        <div className = "relative w-[500px]">
          <img src = {IconSearch} alt = "Ícone de busca" className = "absolute left-0 top-[25px] -translate-y-1/2 w-[15px] h-[15px] ml-4 cursor-pointer"/>
                    
            <InputBusca placeholder = "Buscar denúncia ou alerta"/>
                    
            <img src = {barra} alt = "Ícone de barra" className = "absolute right-0 top-[25px] -translate-y-1/2 w-[1.75px] h-[20px] mr-10"/>
                    
          <img src = {filtro} alt = "Ícone de filtro" className = "absolute right-0 top-[25px] -translate-y-1/2 w-[20px] h-[20px] mr-4 cursor-pointer"/>
        </div>

          <button className = "bg-[#65BA69] text-[#FFFFFF] text-[18px] w-[200px] h-[50px] rounded-[10px] ml-auto cursor-pointer">
            Adicionar Categoria
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto overflow-x-hidden h-[775px]">
            <CardCategoria 
              titulo = "Móveis"
              quantidade = "25"
              imagem = ""
            />

            <CardCategoria 
              titulo = "Eletrônicos"
              quantidade = "12"
              imagem = ""
            />
            
            <CardCategoria 
              titulo = "Roupas"
              quantidade = "45"
              imagem = ""
            />
          </div>           
        </div>
      </div>
  )
}