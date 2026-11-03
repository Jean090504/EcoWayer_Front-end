import { useState } from "react"

import { Search } from "lucide-react"

import BotaoPower from "../assets/icons/ui/button_power.png"
import BotaoReset from "../assets/icons/ui/button_reset.png"
import TabelaItens from  "../components/tabela/tabelaItens.jsx"

export default function CategoriaIndividual({ aoVoltar }) {
  const [status, setStatus] = useState("")
  return (
    <div>

      <button className = "text-[#9A9A9A] pt-5 pl-6" onClick = {aoVoltar}>← Voltar para todas as Categorias</button>

        <div className = "flex flex-col items-center justify-center gap-4 mt-5">

          <div className = "flex flex-col w-[95%] min-h-[85vh]">

              <div className = "flex flex-row items-center justify-center bg-[#FFFFFF] min-h-[150px] gap-5 mb-2">
                <img src = "" alt = "" />
                <h1 className = "text-[25px] font-bold">Móveis</h1>

                <div className = "bg-[#7350B9] text-[#FFFFFF] rounded-[10px] text-[10px] w-[125px] h-[30px] flex items-center justify-center">
                  XX Itens registrados
                </div>

                <div className = "bg-[#65BA69] text-[#FFFFFF] rounded-[10px] text-[10px] w-[105px] h-[30px] flex items-center justify-center">
                  Categoria Ativa
                </div>

                <button className = "ml-auto bg-[#E43E42] text-[#FFFFFF] rounded-[10px] cursor-pointer text-[10px] w-[125px] h-[30px] flex items-center justify-center">
                  excluir categoria
                </button>

                <button className = "bg-[#65BA69] text-[#FFFFFF] rounded-[10px] cursor-pointer text-[10px] w-[125px] h-[30px] flex items-center justify-center">
                  adicionar novo item
                </button>

                <button className = "cursor-pointer mr-8 bg-[#D9D9D9] w-[30px] h-[30px] rounded-full items-center justify-center flex">
                  <img src = {BotaoPower} alt = "" />
                </button>
              </div>

            <div className = "bg-[#FFFFFF] mb-10">
              <div className = "flex flex-row items-center h-[70px]">

                <div className = "relative min-w-[180px] w-[20vw] ml-5">
                  <Search
                    size = {12}
                    className = "absolute left-4 top-1/2 -translate-y-1/2 shrink-0 text-[#334155]"
                  />

                  <input
                    className = "border border-[#E2E8F0] rounded-[8px] bg-[#F8FAFC] text-[12px] placeholder:text-[#334155] px-3 py-0.5 pl-[35px] w-full h-[30px]"
                    type = "search"
                    placeholder = "Buscar Item"
                  />
                </div>

                <select className = "border border-[#E2E8F0] rounded-[8px] bg-[#F8FAFC] text-[12px] text-[#334155] ml-3 h-[30px] w-[120px] px-1" value = "" onChange = {(e) => setTipo(e.target.value)}>
                  <option value = "">Status (Todos)</option>
                  <option value = "moveis">Móveis</option>
                  <option value = "materiais">Materiais</option>
                  <option value = "eletronicos">Eletrônicos</option>
                </select>

                <button className = "flex flex-row items-center justify-center border border-[#E2E8F0] rounded-[8px] text-[12px] text-[#64748B] gap-1 w-[100px] h-[30px] ml-auto mr-4">
                  <img src = {BotaoReset} alt = "" className = "text-[#64748B]"/>
                  Redefinir
                </button>
                </div>

              <div>
                  <TabelaItens />
                </div>

              
            </div>
          </div>
        </div>
    </div>
  )
}