import { useState } from "react"
import { Eye, SquarePen, Trash2 } from "lucide-react"

import ModalConfirmar from "../../modal/modalConfirmar.jsx"

export default function CardItem({
  icon,
  nome,
  pontos,
  status,
  descricao = "",
  aoVer,
  aoEditar,
  onDelete,
}) {
  const [modalDeleteAberto, setModalDeleteAberto] = useState(false)

  const closeModal = () => setModalDeleteAberto(false)

  const confirmDelete = () => {
    onDelete?.()
    closeModal()
  }

  return (
    <>
      <div className="flex flex-row items-center py-6 border-b border-[#F3F4F6]">
        <div className="w-[35%] flex flex-row items-center gap-3 px-4">
          <div className="w-[36px] h-[36px] rounded-lg bg-[#7350B9]" />
          {icon && <img src={icon} alt="" />}
          <span className="font-bold text-[#202735]">{nome}</span>
        </div>

        <div className="w-[20%] flex justify-center">
          <span className="bg-[#65BA69] text-white text-sm font-bold px-3 py-1 rounded-md">
            {pontos} pts
          </span>
        </div>

        <div className="w-[25%] flex justify-center">
          <span
            className={`text-white text-xs font-bold px-3 py-1 rounded-full ${
              status === "Ativo" ? "bg-[#65BA69]" : "bg-[#F5A623]"
            }`}
          >
            {status}
          </span>
        </div>

        <div className="w-[10%] mx-auto flex flex-row justify-between">
          <button type="button" onClick={aoVer} className="cursor-pointer">
            <Eye className="w-4 h-4 text-[#94A3B8]" />
          </button>
          <button type="button" onClick={aoEditar} className="cursor-pointer">
            <SquarePen className="w-4 h-4 text-[#94A3B8]" />
          </button>
          <button
            type="button"
            onClick={() => setModalDeleteAberto(true)}
            className="cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-[#94A3B8]" />
          </button>
        </div>
      </div>

      {/* Excluir item */}
      <ModalConfirmar
        open={modalDeleteAberto}
        title="Excluir Item"
        cancelLabel="Cancelar"
        cancelVariant="neutral"
        confirmLabel="Excluir"
        confirmVariant="danger"
        onCancel={closeModal}
        onConfirm={confirmDelete}
      >
        <p>Tem certeza que deseja excluir o item "{nome}"?</p>
        <p>Essa ação não pode ser desfeita.</p>
      </ModalConfirmar>
    </>
  )
}