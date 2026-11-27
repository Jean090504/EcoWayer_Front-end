import { useState } from "react"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import CardTransacao from "./cardTransacao"

const POR_PAGINA = 7

const FILTROS = [
  { id: "todas", label: "Todas" },
  { id: "entrega", label: "Entregas em EcoPontos" },
  { id: "resgate", label: "Resgates" },
  { id: "venda", label: "Vendas no Marketplace" },
  { id: "credito", label: "Créditos" },
  { id: "bonus", label: "Bônus Gamificação" },
]

export default function CardHistorico({ transacoes = [] }) {
  const [filtro, setFiltro] = useState("todas")
  const [busca, setBusca] = useState("")
  const [pagina, setPagina] = useState(1)

  const filtradas = transacoes.filter((t) => {
    const tipoOk = filtro === "todas" || t.tipo === filtro
    const texto = `${t.titulo} ${t.local} ${t.detalhe || ''}`.toLowerCase()
    return tipoOk && texto.includes(busca.toLowerCase())
  })

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA))
  const visiveis = filtradas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  function mudarFiltro(id) {
    setFiltro(id)
    setPagina(1)
  }

  function mudarBusca(e) {
    setBusca(e.target.value)
    setPagina(1)
  }

  return (
    <div className="flex min-w-0 w-full flex-col rounded-2xl border border-[#EAE7EF] bg-white p-6 shadow-sm sm:p-7">
      {/* Topo */}
      <div className="flex items-start justify-between">
        <h2 className="text-[24px] font-semibold text-[#191C1E]">Histórico de Transações</h2>


      </div>

      {/* Filtros */}
      <div className="mt-5 flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            onClick={() => mudarFiltro(f.id)}
            className={`rounded-full px-4 py-1.5 text-[12px] font-semibold cursor-pointer ${
              filtro === f.id ? "bg-[#724BC2] text-white" : "bg-[#F3F3F3] text-[#3E4A3D]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Busca */}
      <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#F3F3F3] px-4 py-3">
        <Search size={16} className="text-[#3E4A3D]" />
        <input
          value={busca}
          onChange={mudarBusca}
          placeholder="Buscar por material, EcoPonto, código ou benefício..."
          className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Lista: altura mínima fixa pra não pular entre páginas */}
      <div className="mt-5 flex min-h-[260px] flex-col gap-3">
        {visiveis.length === 0 && (
          <p className="py-8 text-center text-[13px] text-[#3E4A3D]">
            Nenhuma transação encontrada.
          </p>
        )}

        {visiveis.map((t) => (
          <CardTransacao key={t.id} transacao={t} />
        ))}
      </div>

      {/* Paginação: sempre no fundo do card */}
      <div className="mt-auto flex items-center justify-center gap-2 border-t border-gray-200 pt-4">

         <button
          onClick={() => setPagina(pagina - 1)}
          disabled={pagina === 1}
          className="flex items-center gap-1 rounded-lg bg-[#F3F3F3] px-3 py-1.5 text-[12px] text-[#3E4A3D] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} />
          Anterior
        </button>

        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => setPagina(n)}
            className={`h-8 w-8 rounded-lg text-[12px] font-semibold cursor-pointer ${
              pagina === n ? "bg-[#6D32C9] text-white" : "bg-[#F3F3F3] text-[#3E4A3D]"
            }`}
          >
            {n}
          </button>
        ))}

        <button
          onClick={() => setPagina(pagina + 1)}
          disabled={pagina === totalPaginas}
          className="flex items-center gap-1 rounded-lg bg-[#F3F3F3] px-3 py-1.5 text-[12px] text-[#3E4A3D] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Próxima
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
