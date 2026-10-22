import Titulo from "../components/ui/titulo.jsx"
import CardCategoria from "../components/cards/cardCategoria.jsx"
import InputBusca from "../components/ui/inputBusca.jsx"

export default function Categorias() {
  return (
    <div>
      <Titulo texto = "Categorias" />

      <div className = "flex flex-col gap-4 mt-5 overflow-y-auto w-[1050px] mx-auto">

      <div className = "flex flex-row items-center w-full mb-9">

        <InputBusca placeholder = "Buscar denúncia ou alerta"/>

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