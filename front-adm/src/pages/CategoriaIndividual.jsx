import { useState } from "react"

import { Search } from "lucide-react"

import BotaoVoltar from "../components/ui/botaoVoltar.jsx"
import BotaoPower from "../assets/icons/ui/button_power.png"
import BotaoReset from "../assets/icons/ui/button_reset.png"
import TabelaItens from  "../components/tabela/tabelaItens.jsx"
import ModalItem from "../components/modal/modalItem.jsx"

export default function CategoriaIndividual({ aoVoltar }) {
  const [status, setStatus] = useState("")
  const [modal, setModal] = useState({ aberto: false, modo: "create", item: null })

  const abrirModal = (modo, item = null) => setModal({ aberto: true, modo, item })
  const fecharModal = () => setModal((m) => ({ ...m, aberto: false }))

  const salvarItem = (dados) => {
    // modal.modo === "create" -> criar | "edit" -> atualizar
    console.log(modal.modo, dados)
    fecharModal()
  }

  return (
    <div>

      <BotaoVoltar aoVoltar = {aoVoltar} texto = "← Voltar para todas as Categorias" />

        <div className = "flex flex-col items-center justify-center gap-[clamp(16px,1.3vw,24px)] mt-[clamp(20px,1.3vw,26px)]">

          <div className = "flex flex-col w-[95%] min-h-[85vh]">

              <div className = "flex flex-row items-center justify-center bg-[#FFFFFF] min-h-[clamp(150px,12vh,200px)] gap-[clamp(20px,1.5vw,32px)] mb-[clamp(20px,1vw,30px)] rounded-[16px] shadow-sm">
                <img src = "" alt = "" />
                <h1 className = "text-[clamp(25px,1.8vw,36px)] font-bold">Móveis</h1>

                <div className = "bg-[#7350B9] text-[#FFFFFF] rounded-[clamp(10px,0.7vw,14px)] text-[clamp(12px,1vw,16px)] w-[clamp(125px,9vw,175px)] h-[clamp(35px,3vh,45px)] flex items-center justify-center">
                  XX Itens registrados
                </div>

                <div className = "bg-[#65BA69] text-[#FFFFFF] rounded-[clamp(10px,0.7vw,14px)] text-[clamp(12px,1vw,16px)] w-[clamp(105px,8vw,155px)] h-[clamp(35px,3vh,45px)] flex items-center justify-center">
                  ⊚ Categoria Ativa
                </div>

                <button className = "ml-auto bg-[#E43E42] text-[#FFFFFF] rounded-[clamp(10px,0.7vw,14px)] cursor-pointer text-[clamp(12px,1vw,16px)] w-[clamp(125px,9vw,175px)] h-[clamp(35px,3vh,45px)] flex items-center justify-center">
                  excluir categoria
                </button>

                <button
                  onClick = {() => abrirModal("create")}
                  className = "bg-[#65BA69] text-[#FFFFFF] rounded-[clamp(10px,0.7vw,14px)] cursor-pointer text-[clamp(12px,1vw,16px)] w-[clamp(125px,9vw,175px)] h-[clamp(35px,3vh,45px)] flex items-center justify-center"
                >
                  adicionar novo item
                </button>

                <button className = "cursor-pointer mr-[clamp(32px,2vw,40px)] bg-[#D9D9D9] w-[clamp(35px,2.5vw,45px)] h-[clamp(35px,2.5vw,45px)] rounded-full items-center justify-center flex">
                  <img src = {BotaoPower} alt = "" />
                </button>
              </div>

            <div className = "bg-[#FFFFFF] mb-[clamp(40px,3vw,56px)] rounded-[16px] shadow-sm pb-10">
              <div className = "flex flex-row items-center h-[clamp(70px,6vh,85px)]">

                <div className = "relative min-w-[clamp(180px,12vw,220px)] w-[20vw] ml-[clamp(20px,1.3vw,28px)]">
                  <Search
                    size = {12}
                    className = "absolute left-[clamp(16px,1vw,20px)] top-1/2 -translate-y-1/2 shrink-0 text-[#334155]"
                  />

                  <input
                    className = "border border-[#E2E8F0] rounded-[clamp(8px,0.5vw,10px)] bg-[#F8FAFC] text-[clamp(12px,0.8vw,14px)] placeholder:text-[#334155] px-[clamp(12px,0.8vw,16px)] py-[clamp(2px,0.2vw,4px)] pl-[clamp(35px,2.3vw,42px)] w-full h-[clamp(30px,3vh,38px)]"
                    type = "search"
                    placeholder = "Buscar Item"
                  />
                </div>

                <select className = "border border-[#E2E8F0] rounded-[clamp(8px,0.5vw,10px)] bg-[#F8FAFC] text-[clamp(12px,0.8vw,14px)] text-[#334155] ml-[clamp(12px,0.8vw,16px)] h-[clamp(30px,3vh,38px)] w-[clamp(120px,8vw,150px)] px-[clamp(4px,0.3vw,6px)]" value = {status} onChange = {(e) => setStatus(e.target.value)}>
                  <option value = "">Status (Todos)</option>
                  <option value = "moveis">Móveis</option>
                  <option value = "materiais">Materiais</option>
                  <option value = "eletronicos">Eletrônicos</option>
                </select>

                <button className = "flex flex-row items-center justify-center border border-[#E2E8F0] rounded-[clamp(8px,0.5vw,10px)] text-[clamp(12px,0.8vw,14px)] text-[#64748B] gap-[clamp(4px,0.3vw,6px)] w-[clamp(100px,6.5vw,125px)] h-[clamp(30px,3vh,38px)] ml-auto mr-[clamp(16px,1vw,20px)]">
                  <img src = {BotaoReset} alt = "" className = "text-[#64748B]"/>
                  Redefinir
                </button>
                </div>

              <div>
                  <TabelaItens
                    aoVer = {(item) => abrirModal("view", item)}
                    aoEditar = {(item) => abrirModal("edit", item)}
                  />
                </div>

            </div>
          </div>
        </div>

      <ModalItem
        open = {modal.aberto}
        mode = {modal.modo}
        initialValues = {modal.item}
        onClose = {fecharModal}
        onSubmit = {salvarItem}
      />
    </div>
  )
}