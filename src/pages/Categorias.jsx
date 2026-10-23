import { useState } from "react"

import Titulo from "../components/ui/titulo.jsx"
import CardCategoria from "../components/cards/cardCategoria.jsx"
import InputBusca from "../components/ui/inputBusca.jsx"
import ModalFiltro from "../components/modal/modalFiltro.jsx"

export default function Categorias() {
  const [modalAberto, setModalAberto] = useState(false)

  return (
    <div>
      <Titulo texto = "Categorias" />

      <div className = "flex flex-col items-center justify-center gap-4 mt-5">

        <div className = "flex flex-col w-[95%] h-[85vh]"> 

          <div className = "flex flex-row items-center w-full">

            <InputBusca placeholder = "Buscar denúncia ou alerta" aoFiltrar = {() => setModalAberto(true)}/>

            <button className = "bg-[#65BA69] text-[#FFFFFF] text-[clamp(18px,1.2vw,20px)] w-[clamp(200px,15vw,260px)] h-[clamp(50px,5vh,60px)] rounded-[10px] ml-auto cursor-pointer">
              Adicionar Categoria
            </button>
          </div>

          <div className = "mt-8 flex-1 min-h-0 space-y-4 overflow-y-auto overflow-x-hidden">
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
        <ModalFiltro
          modalAberto={modalAberto}
          onFechar={() => setModalAberto(false)}
        />     
      </div>
    </div>
  )
}