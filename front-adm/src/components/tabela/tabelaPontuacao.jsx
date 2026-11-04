import { useState, useMemo } from "react"
import { Search } from "lucide-react"

import CardTabela from "../cards/cardTabela.jsx"
import Cabecalho from "./cabecalhoTabela.jsx"
import Paginacao from "../Paginacao/paginacao.jsx"
import Mais from "../../assets/icons/ui/mais.png"

const ITENS_POR_PAGINA = 5

export default function TabelaPontuacao({ dados = [], onUpdate }) {
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [busca, setBusca] = useState("")

  // Filtra as categorias com base no input de pesquisa
  const dadosFiltrados = useMemo(() => {
    if (!busca.trim()) return dados
    return dados.filter((item) =>
      item.cat?.toLowerCase().includes(busca.toLowerCase().trim())
    )
  }, [dados, busca])

  // Recalcula paginação
  const totalPaginas = Math.max(1, Math.ceil(dadosFiltrados.length / ITENS_POR_PAGINA))
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const dadosPagina = dadosFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA)

  const handleBuscar = (e) => {
    setBusca(e.target.value)
    setPaginaAtual(1) // Reseta para a primeira página ao pesquisar
  }

  return (
    <div className="bg-[#FFFFFF] rounded-[16px] shadow-sm border border-[#F3F4F6] w-full h-full flex flex-col pb-4">
      {/* Cabeçalho superior com barra de busca e botão de ação */}
      <div className="flex flex-row justify-between items-center p-4 border-b border-[#F3F4F6]">
        <h2 className="text-[clamp(12px,1vw,16px)] font-bold text-[#202735]">
          Pontuação Base por Categoria
        </h2>

        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-row items-center w-[clamp(140px,18vw,200px)] h-[clamp(30px,1vw,35px)] border border-[#E5E7EB] rounded-[8px] px-3 focus-within:border-[#65BA69] transition-colors">
            <Search size={14} className="text-[#8A8A8A]" />
            <input
              type="text"
              value={busca}
              onChange={handleBuscar}
              placeholder="Filtrar categoria..."
              className="w-full outline-none text-[clamp(12px,0.8vw,14px)] bg-transparent placeholder-[#8A8A8A] pl-2 text-[#202735]"
            />
          </div>

          <button 
            type="button"
            className="flex flex-row items-center justify-center gap-2 bg-[#65BA69] hover:bg-[#57a45b] active:scale-[0.98] text-[#FFFFFF] text-[clamp(10px,0.9vw,14px)] font-bold w-[clamp(100px,18vw,120px)] h-[clamp(30px,1vw,35px)] rounded-[8px] cursor-pointer transition-all shadow-sm"
          >
            <img src={Mais} alt="Ícone adicionar" className="w-3.5 h-3.5" />
            Nova Regra
          </button>
        </div>
      </div>

      {/* Cabeçalho da grade da tabela */}
      <div className="bg-[#65BA69] w-full flex flex-row items-center justify-between py-3 px-4 mt-2">
        <Cabecalho largura="w-[clamp(90px,12vw,150px)]" alinhamento="text-left pl-3.5" texto="Categoria" textoCor="text-[#FFFFFF]" />
        <Cabecalho largura="w-[clamp(90px,8vw,100px)]" alinhamento="text-center pl-1" texto="Pontos Base" textoCor="text-[#FFFFFF]" />
        <Cabecalho largura="w-[clamp(150px,20vw,250px)]" alinhamento="text-center" texto="Condições" textoCor="text-[#FFFFFF]" />
        <Cabecalho largura="w-[clamp(80px,8vw,100px)]" alinhamento="text-right pr-8.5" texto="Ações" textoCor="text-[#FFFFFF]" />
      </div>

      {/* Linhas da tabela populadas via Back-end */}
      <div className="flex flex-col w-full px-2 min-h-[220px]">
        {dadosPagina.length > 0 ? (
          dadosPagina.map((item) => (
            <CardTabela
              key={item.id}
              corBolinha={item.cor}
              categoria={item.cat}
              pontosBase={item.base}
              condExcelente={item.exc}
              condBom={item.bom}
              condRegular={item.reg}
            />
          ))
        ) : (
          <div className="flex items-center justify-center py-12 text-[#94A3B8] text-sm font-medium">
            {busca ? `Nenhuma categoria encontrada para "${busca}".` : "Nenhuma categoria cadastrada no banco."}
          </div>
        )}
      </div>

      {/* Rodapé com controle de paginação */}
      <div className="flex flex-row items-center justify-end gap-2 px-6 pt-4 mt-auto border-t border-[#F3F4F6]">
        <Paginacao
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          onMudarPagina={setPaginaAtual}
        />
      </div>
    </div>
  )
}