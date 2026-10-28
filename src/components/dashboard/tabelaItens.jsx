import { useState } from "react"

import CardItem from "../cards/cardItem.jsx"
import Paginacao from "../Paginacao/paginacao.jsx"

const ITENS_POR_PAGINA = 6

export default function TabelaItens() {
  const [paginaAtual, setPaginaAtual] = useState(1)

  const itens = [
    { id: 1, nome: "Sofá Retrátil 3 Lugares", pontos: 350, status: "Ativo" },
    { id: 2, nome: "Mesa de Jantar Madeira Maciça", pontos: 420, status: "Ativo" },
    { id: 3, nome: "Cadeira de Escritório Ergonômica", pontos: 190, status: "Ativo" },
    { id: 4, nome: "Guarda-Roupa Modular 4 Portas", pontos: 280, status: "Ativo" },
    { id: 5, nome: "Poltrona Estofada Vintage", pontos: 230, status: "Em Revisão" },
    { id: 6, nome: "Estante de Livros Modular", pontos: 160, status: "Ativo" },
  ]

  const totalPaginas = Math.max(1, Math.ceil(itens.length / ITENS_POR_PAGINA))
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const itensPagina = itens.slice(inicio, inicio + ITENS_POR_PAGINA)

  return (
    <div className="bg-white rounded-[16px] shadow-sm border border-[#F3F4F6] w-full">

      {/* Cabeçalho das colunas */}
      <div className="flex flex-row items-center py-4 bg-[#F9FAFB] text-xs font-bold uppercase text-[#6B7280]">
        <span className="w-[35%] px-4">Item / Identificação</span>
        <span className="w-[20%] text-center">Pontuação Base</span>
        <span className="w-[25%] text-center">Status</span>
        <span className="w-[15%] text-center">Ações</span>
      </div>

      {/* Linhas */}
      <div className="flex flex-col">
        {itensPagina.map((item) => (
          <CardItem
            key={item.id}
            nome={item.nome}
            pontos={item.pontos}
            status={item.status}
          />
        ))}
      </div>

      {/* Rodapé */}
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