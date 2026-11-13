import { ChartColumn, TrendingUp } from "lucide-react"
import CardBase from "./cardBase"

export default function CardAcumulado({ total, pontosMes }) {
  return (
    <CardBase
      titulo="Total Acumulado"
      valor={total}
      destaque={
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#724BC2]">
          <ChartColumn size={16} className="text-white" />
        </div>
      }
      rodape={
        <div className="flex items-center justify-between text-[12px] text-[#3E4A3D]">
          <span>Frequência trimestral</span>
          <svg width="96" height="24" viewBox="0 0 96 24" fill="none">
            <polyline
              points="0,20 20,22 45,12 60,16 96,6"
              stroke="#4CAF50"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      }
    >
      <span className="inline-flex items-center gap-1 bg-[#4CAF50] text-white text-[11px] font-semibold rounded-full px-2 py-0.5">
        <TrendingUp size={12} />
        +{pontosMes} pts este mês
      </span>
    </CardBase>
  )
}