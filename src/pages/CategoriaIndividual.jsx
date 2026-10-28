import { useState } from "react"

import BotaoPower from "../assets/icons/ui/button_power.png"
import BotaoReset from "../assets/icons/ui/button_reset.png"
import TabelaItens from  "../components/dashboard/tabelaItens.jsx"

export default function CategoriaIndividual({ aoVoltar }) {
  const [status, setStatus] = useState("")
  return (
    <div>

      <button className = "text-[#9A9A9A] pt-5 pl-6" onClick = {aoVoltar}>← Voltar para todas as Categorias</button>

        <div className = "flex flex-col items-center justify-center gap-4 mt-5">

          <div className = "flex flex-col w-[95%] min-h-[85vh]">

            <div className = "flex flex-row items-center justify-center bg-[#FFFFFF] min-h-[150px] gap-10 mb-2">
              <img src = "" alt = "" />
              <h1 className = "text-[25px] font-bold">Móveis</h1>
              <div className = "bg-[#7350B9] text-[#FFFFFF] rounded">XX Itens registrados</div>
              <div className = "bg-[#65BA69] text-[#FFFFFF] rounded">Categoria Ativa</div>
              <button className = "bg-[#E43E42] text-[#FFFFFF] rounded cursor-pointer">excluir categoria</button>
              <button className = "bg-[#65BA69] text-[#FFFFFF] rounded cursor-pointer">adicionar novo item</button>
              <button className = "cursor-pointer">
                <img src = {BotaoPower} alt = "" />
              </button>
            </div>

            <div className = "bg-[#FFFFFF] mb-10">
              <input className = "border border-gray-300" type = "search" placeholder = "Buscar Item" />

              <select className = "border border-gray-300 p-2 mb-4" value = "" onChange = {(e) => setTipo(e.target.value)}>
                <option value = "">Status (Todos)</option>
                <option value = "moveis">Móveis</option>
                <option value = "materiais">Materiais</option>
                <option value = "eletronicos">Eletrônicos</option>
              </select>

              <button className = "flex flex-row">
                <img src = {BotaoReset} alt = "" />
                Redefinir
              </button>

              <div>
              <TabelaItens />
              </div>

            </div>

            </div>
        </div>
    </div>
  )
}