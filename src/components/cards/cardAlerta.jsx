import { Megaphone } from "lucide-react"

export default function CardAlertaIA({ titulo, descricao, porcentagem }) {
  return (
    <div className = "flex flex-row bg-white gap-4 items-center rounded-lg shadow-md w-full min-h-[100px] h-[12vh] mt-2">

      <div className = "w-[60px] h-[60px] bg-[#7350B9] rounded-lg flex items-center justify-center ml-4 p-2 shrink-0">
        <Megaphone size = {32} color = "#FFFFFF" />
      </div>

      <div className = "flex flex-col">
        <h3 className = "text-[clamp(16px,1vw,18px)] text-[#1E293B] font-bold">{titulo}</h3>

        <p className = "text-[clamp(12px,1vw,14px)] text-[#475569] font-medium">
          {descricao}
        </p>
      </div>

      <span className = "bg-[#7350B9] text-white rounded-[clamp(10px,0.7vw,14px)] text-[clamp(8px,1vw,12px)] w-[clamp(110px,8vw,135px)] h-[clamp(25px,3vh,40px)] flex items-center justify-center ml-auto mr-3 uppercase shrink-0">
        {porcentagem} certeza
      </span>

    </div>
  )
}