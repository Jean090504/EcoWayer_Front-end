import { useState, useEffect } from "react"

import CardItem from "../cards/cardItem.jsx"
import Cabecalho from "./cabecalhoTabela.jsx"
import Paginacao from "../Paginacao/paginacao.jsx"

const ITENS_POR_PAGINA = 6

export default function TabelaItens({ itens = [], total = 0, imagemCategoria, onView, onEdit, onDelete }) {
  const [paginaAtual, setPaginaAtual] = useState(1)

  const totalPaginas = Math.max(1, Math.ceil(itens.length / ITENS_POR_PAGINA))

  // se a lista encolher (busca/filtro), volta para uma página válida
  useEffect(() => {
    if (paginaAtual > totalPaginas) setPaginaAtual(1)
  }, [totalPaginas, paginaAtual])

  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const itensPagina = itens.slice(inicio, inicio + ITENS_POR_PAGINA)

  return (
    <div className="w-full bg-white">

      <div className="flex flex-row items-center bg-slate-50 px-1 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">
        <Cabecalho largura="w-[35%]" alinhamento="px-4" texto="Item / Identificação" />
        <Cabecalho largura="w-[20%]" alinhamento="text-center" texto="Pontuação Base" />
        <Cabecalho largura="w-[25%]" alinhamento="text-center" texto="Status" />
        <Cabecalho largura="w-[15%]" alinhamento="text-center" texto="Ações" />
      </div>

      <div className="flex flex-col">
        {itensPagina.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">
            Nenhum item cadastrado nesta categoria.
          </p>
        )}

        {itensPagina.map((item) => (
          <CardItem
            key={item.id}
            nome={item.nome}
            pontos={item.pontos_base}
            status={item.status}
            imagem={item.img && !item.img.includes("storage.ecowayer.test") ? item.img : imagemCategoria}
            onView={() => onView?.(item)}
            onEdit={() => onEdit?.(item)}
            onDelete={() => onDelete?.(item)}
          />
        ))}
      </div>

      <div className="mt-auto flex flex-row items-center justify-end gap-2 border-t border-slate-100 px-5 py-4">
        <Paginacao
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          onMudarPagina={setPaginaAtual}
        />
      </div>
    </div>
  )
}
