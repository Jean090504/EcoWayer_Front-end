export default function Paginacao({ paginaAtual, totalPaginas, onMudarPagina }) {
    const botaoNav = "px-3 h-9 border border-[#E5E7EB] rounded-[6px] text-sm font-bold bg-white transition-colors"
  
    const irParaAnterior = () => onMudarPagina(Math.max(1, paginaAtual - 1))
    const irParaProxima = () => onMudarPagina(Math.min(totalPaginas, paginaAtual + 1))
  
    return (
      <div className="flex flex-row items-center gap-2">
        <button
          onClick={irParaAnterior}
          disabled={paginaAtual === 1}
          className={`${botaoNav} ${paginaAtual === 1 ? "text-[#C4C4C4] cursor-not-allowed" : "text-[#202735] cursor-pointer hover:bg-[#F3F4F6]"}`}
        >
          Anterior
        </button>
  
        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
          <button
            key={numero}
            onClick={() => onMudarPagina(numero)}
            className={`w-9 h-9 rounded-[6px] text-sm font-bold cursor-pointer transition-colors ${
              numero === paginaAtual
                ? "bg-[#7350B9] text-white"
                : "bg-white text-[#6B7280] hover:bg-[#F3F4F6]"
            }`}
          >
            {numero}
          </button>
        ))}
  
        <button
          onClick={irParaProxima}
          disabled={paginaAtual === totalPaginas}
          className={`${botaoNav} ${paginaAtual === totalPaginas ? "text-[#C4C4C4] cursor-not-allowed" : "text-[#202735] cursor-pointer hover:bg-[#F3F4F6]"}`}
        >
          Próxima
        </button>
      </div>
    )
  }