import { ExternalLink } from "lucide-react"
import CardRecompensa from "./cardRecompensa"

const recompensas = [
  {
    id: 1,
    categoria: "Loja Sustentável",
    titulo: "Desconto de 20% em Loja Zero Desperdício",
    imagem: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80",
    pontos: 250,
  },
  {
    id: 2,
    categoria: "Alimentos Regenerativos",
    titulo: "Cupom R$ 25 Hortifruti Regenerativo",
    imagem: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=200&q=80",
    pontos: 300,
  },
  {
    id: 3,
    categoria: "Restauração Ecológica",
    titulo: "Árvore Plantada em Mutirão da Mata",
    imagem: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&q=80",
    pontos: 150,
  },
]

const TOTAL_RECOMPENSAS = 24

export default function CardRecompensas() {
  function resgatar(recompensa) {
    console.log("resgatar:", recompensa)
  }

  return (
    <div className="flex flex-1 flex-col bg-white rounded-2xl p-6">
      <h2 className="text-[20px] font-semibold text-[#191C1E]">Recompensas em Destaque</h2>

      <div className="mt-5 flex flex-col gap-2">
        {recompensas.map((r) => (
          <CardRecompensa key={r.id} recompensa={r} onResgatar={resgatar} />
        ))}
      </div>

      <button className="mt-auto pt-6 flex items-center justify-center gap-2 text-[13px] font-semibold text-[#4CAF50] cursor-pointer">
        Ver todas as {TOTAL_RECOMPENSAS} recompensas
        <ExternalLink size={14} />
      </button>
    </div>
  )
}