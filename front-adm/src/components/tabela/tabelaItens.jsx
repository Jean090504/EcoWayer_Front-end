import { useState, useEffect } from "react"

import CardItem from "../cards/cardItem.jsx"
import Cabecalho from "./cabecalhoTabela.jsx"
import Paginacao from "../Paginacao/paginacao.jsx"

const ITENS_POR_PAGINA = 6

export default function TabelaItens({ itens = [], total = 0 }) {
  const [paginaAtual, setPaginaAtual] = useState(1)

  const totalPaginas = Math.max(1, Math.ceil(itens.length / ITENS_POR_PAGINA))

  // se a lista encolher (busca/filtro), volta para uma página válida
  useEffect(() => {
    if (paginaAtual > totalPaginas) setPaginaAtual(1)
  }, [totalPaginas, paginaAtual])

  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const itensPagina = itens.slice(inicio, inicio + ITENS_POR_PAGINA)

  return (
    <div className="bg-white rounded-[16px] shadow-sm border border-[#F3F4F6] w-full">

      <div className="flex flex-row items-center py-4 bg-[#F9FAFB] text-xs font-bold uppercase text-[#6B7280]">
        <Cabecalho largura="w-[35%]" alinhamento="px-4" texto="Item / Identificação" />
        <Cabecalho largura="w-[20%]" alinhamento="text-center" texto="Pontuação Base" />
        <Cabecalho largura="w-[25%]" alinhamento="text-center" texto="Status" />
        <Cabecalho largura="w-[15%]" alinhamento="text-center" texto="Ações" />
      </div>

      <div className="flex flex-col">
        {itensPagina.length === 0 && (
          <p className="text-center text-[#6B7280] py-10">
            Nenhum item cadastrado nesta categoria.
          </p>
        )}

        {itensPagina.map((item) => (
          <CardItem
            key={item.id}
            nome={item.nome}
            pontos={item.pontos_base}
            status={item.status}
          />
        ))}
      </div>

      <div className="flex flex-row items-center justify-between gap-2 px-6 py-4 mt-auto border-t border-[#F3F4F6]">
        <p className="text-xs text-[#6B7280]">
          {itens.length === 0
            ? "Nenhum item"
            : `Mostrando ${inicio + 1} a ${inicio + itensPagina.length} de ${total} itens cadastrados`}
        </p>

        <Paginacao
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          onMudarPagina={setPaginaAtual}
        />
      </div>
    </div>
  )
}