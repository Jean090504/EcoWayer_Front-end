import { useState } from "react"
import CardTabela from "../cards/cardTabela.jsx"
import Cabecalho from "./cabecalhoTabela.jsx"
import Paginacao from "../Paginacao/paginacao.jsx"
import Mais from "../../assets/icons/ui/mais.png"
import IconSearch from "../../assets/icons/ui/search.png"

const ITENS_POR_PAGINA = 5

export default function TabelaPontuacao() {
  const [paginaAtual, setPaginaAtual] = useState(1)

  const dados = [
    { id: 1, cor: "bg-[#7350B9]", cat: "Eletrônicos", base: "150", exc: "1.5x", bom: "1.2x", reg: "1.0x" },
    { id: 2, cor: "bg-[#2E8B57]", cat: "Metal", base: "80", exc: "1.5x", bom: "1.2x", reg: "0.9x" },
    { id: 3, cor: "bg-[#00CED1]", cat: "Vidro", base: "50", exc: "1.4x", bom: "1.2x", reg: "0.8x" },
    { id: 4, cor: "bg-[#FFD700]", cat: "Papelão", base: "40", exc: "1.3x", bom: "1.1x", reg: "0.7x" },
    { id: 5, cor: "bg-[#4169E1]", cat: "Plástico", base: "30", exc: "1.2x", bom: "1.0x", reg: "0.6x" },
    { id: 6, cor: "bg-[#FF6347]", cat: "Papel", base: "25", exc: "1.2x", bom: "1.0x", reg: "0.6x" },
    { id: 7, cor: "bg-[#8B4513]", cat: "Madeira", base: "60", exc: "1.4x", bom: "1.2x", reg: "0.8x" },
    { id: 8, cor: "bg-[#9370DB]", cat: "Têxteis", base: "35", exc: "1.3x", bom: "1.1x", reg: "0.7x" },
    { id: 9, cor: "bg-[#FF69B4]", cat: "Borracha", base: "45", exc: "1.3x", bom: "1.1x", reg: "0.7x" },
    { id: 10, cor: "bg-[#708090]", cat: "Baterias", base: "100", exc: "1.5x", bom: "1.3x", reg: "0.9x" },
    { id: 11, cor: "bg-[#32CD32]", cat: "Orgânicos", base: "20", exc: "1.2x", bom: "1.0x", reg: "0.5x" },
    { id: 12, cor: "bg-[#FF8C00]", cat: "Óleo de cozinha", base: "70", exc: "1.4x", bom: "1.2x", reg: "0.8x" },
    { id: 13, cor: "bg-[#4682B4]", cat: "Isopor", base: "15", exc: "1.1x", bom: "0.9x", reg: "0.5x" },
    { id: 14, cor: "bg-[#DAA520]", cat: "Metais pesados", base: "90", exc: "1.5x", bom: "1.2x", reg: "0.9x" },
    { id: 15, cor: "bg-[#20B2AA]", cat: "Eletrônicos pequenos", base: "120", exc: "1.5x", bom: "1.3x", reg: "1.0x" }
  ]

  const totalPaginas = Math.max(1, Math.ceil(dados.length / ITENS_POR_PAGINA))
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const dadosPagina = dados.slice(inicio, inicio + ITENS_POR_PAGINA)

  return (
    <div className = "bg-[#FFFFFF] rounded-[16px] shadow-sm border border-[#F3F4F6] w-full h-full flex flex-col pb-4">

      <div className = "flex flex-row justify-between items-center p-4 border-b border-[#F3F4F6]">
        <h2 className = "text-[clamp(12px,1vw,16px)] font-bold text-[#202735]">Pontuação Base por Categoria</h2>

        <div className = "flex flex-row items-center gap-4">
          <div className = "flex flex-row items-center w-[clamp(140px,18vw,200px)] h-[clamp(30px,1vw,35px)] border border-[#E5E7EB] rounded-[8px] px-3">
            <img src = {IconSearch} alt = "" className = "w-[10px]" />
            <input type = "text" placeholder = "Filtrar categoria..." className = "w-full outline-none text-[clamp(12px,0.8vw,16px)] bg-transparent placeholder-[#8A8A8A] pl-2" />
          </div>

          <button className = "flex flex-row items-center justify-center gap-2 bg-[#65BA69] text-[#FFFFFF] text-[clamp(10px,0.9vw,18px)] font-bold w-[clamp(100px,18vw,120px)] h-[clamp(30px,1vw,35px)] rounded-[8px] cursor-pointer">
            <img src = {Mais} alt = "" />
            Nova Regra
          </button>
        </div>
      </div>

      <div className = "bg-[#65BA69] w-full flex flex-row items-center justify-between py-3 px-4 mt-2">
        <Cabecalho largura = "w-[clamp(90px,12vw,150px)]" alinhamento = "text-left pl-3.5" texto = "Categoria" textoCor = "text-[#FFFFFF]" />

        <Cabecalho largura = "w-[clamp(90px,8vw,100px)]" alinhamento = "text-center pl-1" texto = "Pontos Base" textoCor = "text-[#FFFFFF]" />

        <Cabecalho largura = "w-[clamp(150px,20vw,250px)]" alinhamento = "text-center" texto = "Condições" textoCor = "text-[#FFFFFF]" />

        <Cabecalho largura = "w-[clamp(80px,8vw,100px)]" alinhamento = "text-right pr-8.5" texto = "Ações" textoCor = "text-[#FFFFFF]" />
      </div>

      <div className = "flex flex-col w-full px-2">
        {dadosPagina.map((item) => (
          <CardTabela
            key = {item.id}
            corBolinha = {item.cor}
            categoria = {item.cat}
            pontosBase = {item.base}
            condExcelente = {item.exc}
            condBom = {item.bom}
            condRegular = {item.reg}
          />
        ))}
      </div>

      <div className = "flex flex-row items-center justify-end gap-2 px-6 pt-4 mt-auto border-t border-[#F3F4F6]">
        <Paginacao
          paginaAtual = {paginaAtual}
          totalPaginas = {totalPaginas}
          onMudarPagina = {setPaginaAtual}
        />
      </div>

    </div>
  )
}