import { useState } from "react"

import { Search } from "lucide-react"

import CardTabela from "../cards/cardTabela.jsx"
import Cabecalho from "./cabecalhoTabela.jsx"
import Paginacao from "../Paginacao/paginacao.jsx"
import Mais from "../../assets/icons/ui/mais.png"

const ITENS_POR_PAGINA = 5

// Remove acentos e caixa para o filtro ("papel" encontra "Papel", "eletronicos" encontra "Eletrônicos")
const normalizar = (texto) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

export default function TabelaPontuacao({ regras, carregando, erro, onAlternarStatus, onNovaRegra, onEditar }) {
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [busca, setBusca] = useState("")

  const filtradas = regras.filter((r) =>
    normalizar(r.categoria.nome).includes(normalizar(busca))
  )

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / ITENS_POR_PAGINA))
  const paginaSegura = Math.min(paginaAtual, totalPaginas)
  const inicio = (paginaSegura - 1) * ITENS_POR_PAGINA
  const dadosPagina = filtradas.slice(inicio, inicio + ITENS_POR_PAGINA)

  function aoDigitarBusca(e) {
    setBusca(e.target.value)
    setPaginaAtual(1)
  }

  return (
    <div className="bg-[#FFFFFF] rounded-[16px] shadow-sm border border-[#F3F4F6] w-full h-full flex flex-col pb-4">

      <div className="flex flex-row justify-between items-center p-4 border-b border-[#F3F4F6]">
        <h2 className="text-[clamp(12px,1vw,16px)] font-bold text-[#202735]">Pontuação Base por Categoria</h2>

        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-row items-center w-[clamp(140px,18vw,200px)] h-[clamp(30px,1vw,35px)] border border-[#E5E7EB] rounded-[8px] px-3">
            <Search size={12} />
            <input
              type="text"
              value={busca}
              onChange={aoDigitarBusca}
              placeholder="Filtrar categoria..."
              className="w-full outline-none text-[clamp(12px,0.8vw,16px)] bg-transparent placeholder-[#8A8A8A] pl-2"
            />
          </div>

          <button
            onClick={onNovaRegra}
            className="flex flex-row items-center justify-center gap-2 bg-[#65BA69] text-[#FFFFFF] text-[clamp(10px,0.9vw,14px)] font-bold w-[clamp(100px,18vw,120px)] h-[clamp(30px,1vw,35px)] rounded-[8px] cursor-pointer"
          >
            <img src={Mais} alt="" />
            Nova Regra
          </button>
        </div>
      </div>

      <div className="bg-[#65BA69] w-full flex flex-row items-center justify-between py-3 px-4 mt-2">
        <Cabecalho largura="w-[clamp(90px,12vw,150px)]" alinhamento="text-left pl-3.5" texto="Categoria" textoCor="text-[#FFFFFF]" />
        <Cabecalho largura="w-[clamp(90px,8vw,100px)]" alinhamento="text-center pl-1" texto="Pontos Base" textoCor="text-[#FFFFFF]" />
        <Cabecalho largura="w-[clamp(150px,20vw,250px)]" alinhamento="text-center" texto="Condições" textoCor="text-[#FFFFFF]" />
        <Cabecalho largura="w-[clamp(80px,8vw,100px)]" alinhamento="text-right pr-8.5" texto="Ações" textoCor="text-[#FFFFFF]" />
      </div>

      <div className="flex flex-col w-full px-2">
        {carregando && <p className="p-6 text-center text-[#8A8A8A]">Carregando regras...</p>}
        {!carregando && erro && <p className="p-6 text-center text-[#E43E42]">{erro}</p>}
        {!carregando && !erro && dadosPagina.length === 0 && (
          <p className="p-6 text-center text-[#8A8A8A]">Nenhuma regra encontrada.</p>
        )}

        {dadosPagina.map((regra) => (
          <CardTabela
            key={regra.id}
            regra={regra}
            onAlternarStatus={() => onAlternarStatus(regra)}
            onEditar={() => onEditar(regra)}
          />
        ))}
      </div>

      <div className="flex flex-row items-center justify-end gap-2 px-6 pt-4 mt-auto border-t border-[#F3F4F6]">
        <Paginacao
          paginaAtual={paginaSegura}
          totalPaginas={totalPaginas}
          onMudarPagina={setPaginaAtual}
        />
      </div>

    </div>
  )
}