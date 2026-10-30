import { useState } from "react"

import Titulo from "../components/ui/titulo.jsx"
import CardChamado from "../components/cards/cardChamados.jsx"
import InputBusca from "../components/ui/inputBusca.jsx"
import ModalFiltro from "../components/modal/modalFiltro.jsx"

export default function Chamados(){
  const [modalAberto, setModalAberto] = useState(false)

  return (
    <div> 
      <Titulo texto = "Chamados" />

      <div className = "flex flex-col items-center justify-center mt-5">

        <div className = "flex flex-col w-[95%] h-[85vh]"> 
    
          <InputBusca placeholder = "Buscar denúncia ou alerta" aoFiltrar = {() => setModalAberto(true)}/>

          <div className = "mt-8 flex-1 min-h-0 space-y-4 overflow-y-auto overflow-x-hidden">

            <CardChamado
              tipo = "ia"
              titulo = "Título do Chamado"
              descricao = "Descrição do problema"
            />

            <CardChamado
              tipo = "denuncia"
              titulo = "Título do Chamado"
              descricao = "Descrição do problema"
            />
          </div>
        </div>

        <ModalFiltro
          modalAberto = {modalAberto}
          onFechar = {() => setModalAberto(false)}
          titulo = {"Filtrar Chamados"}
          opcoes = {[
            { valor: "opcao1", label: "Denúncias" }, // bom, só temos esses opções mesmo
            { valor: "opcao2", label: "Alertas" }
          ]}
          selecionado = {""}
          onSelecionar = {() => {}}
        />
      </div>
    </div>
  )
}