import Ver from "../../assets/icons/ui/olho-categoria_individual.png"
import Editar from "../../assets/icons/ui/editar-categoria_individual.png"
import Apagar from "../../assets/icons/ui/lixo-categoria_individual.png"

export default function CardItem({ icon, nome, pontos, status }) {
    return (
      <div className = "flex flex-row items-center py-6 border-b border-[#F3F4F6]">
  
        {/* Coluna 1: ícone + nome */}
        <div className = "w-[35%] flex flex-row items-center gap-3 px-4">
          <div className = "w-[36px] h-[36px] rounded-lg bg-[#7350B9]" />
          <img src = {icon} alt = "" />
          <span className = "font-bold text-[#202735]">{nome}</span>
        </div>
  
        {/* Coluna 2: pontuação */}
        <div className = "w-[20%] flex justify-center">
          <span className = "bg-[#65BA69] text-white text-sm font-bold px-3 py-1 rounded-md">
            {pontos} pts
          </span>
        </div>
  
        <div className = "w-[25%] flex justify-center">
          <span
            className = {`text-white text-xs font-bold px-3 py-1 rounded-full ${
              status === "Ativo" ? "bg-[#65BA69]" : "bg-[#F5A623]"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Coluna 4: ações */}
        <div className="w-[10%] mx-auto flex flex-row justify-between">
          <button><img src = {Ver} alt = "Ver" className = "w-4 h-4" /></button>
          <button><img src = {Editar} alt = "Editar" className = "w-4 h-4" /></button>
          <button><img src = {Apagar} alt = "Apagar" className = "w-4 h-4" /></button>
        </div>
  
      </div>
    )
}