import Ver from "../../assets/icons/ui/olho-categoria_individual.png"
import Editar from "../../assets/icons/ui/editar-categoria_individual.png"
import Apagar from "../../assets/icons/ui/lixo-categoria_individual.png"

const ROTULOS = { ativo: "Ativo", inativo: "Inativo", "em revisão": "Em Revisão" }
const CORES = {
  ativo: "bg-[#65BA69]",
  inativo: "bg-[#9A9A9A]",
  "em revisão": "bg-[#F5A623]",
}

export default function CardItem({ nome, pontos, status, imagem }) {
  const chave = (status ?? "").toLowerCase()

  return (
    <div className="flex flex-row items-center py-6 border-b border-[#F3F4F6]">

      {/* Coluna 1: ícone + nome */}
      <div className="w-[35%] flex flex-row items-center gap-3 px-4">
        {imagem ? <img src={imagem} alt="" onError={(e) => { e.currentTarget.style.display = "none" }} className="h-[36px] w-[36px] rounded-lg object-contain" /> : <div className="w-[36px] h-[36px] rounded-lg bg-[#7350B9] shrink-0" />}
        <span className="font-bold text-[#202735]">{nome}</span>
      </div>

      {/* Coluna 2: pontuação */}
      <div className="w-[20%] flex justify-center">
        <span className="bg-[#65BA69] text-white text-sm font-bold px-3 py-1 rounded-md">
          {pontos} pts
        </span>
      </div>

      {/* Coluna 3: status */}
      <div className="w-[25%] flex justify-center">
        <span
          className={`text-white text-xs font-bold px-3 py-1 rounded-full ${CORES[chave] ?? "bg-[#9A9A9A]"}`}
        >
          {ROTULOS[chave] ?? status}
        </span>
      </div>

      {/* Coluna 4: ações */}
      <div className="w-[15%] flex flex-row justify-center gap-4">
        <button className="cursor-pointer"><img src={Ver} alt="Ver" className="w-4 h-4" /></button>
        <button className="cursor-pointer"><img src={Editar} alt="Editar" className="w-4 h-4" /></button>
        <button className="cursor-pointer"><img src={Apagar} alt="Apagar" className="w-4 h-4" /></button>
      </div>

    </div>
  )
}
