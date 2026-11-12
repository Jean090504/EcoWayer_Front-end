import { useState, useEffect } from "react"
import CardPadrao from "./cardPadrao"
import { atualizarTaxaConversao } from "../../services/pontos.js"

export default function CardConversao({ dados, onUpdate }) {
  const [multiplicador, setMultiplicador] = useState("1.25")
  const [ativo, setAtivo] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [mensagemSucesso, setMensagemSucesso] = useState(false)

  // Sincroniza caso o backend já traga dados salvos
  useEffect(() => {
    if (dados?.fatorMultiplicador !== undefined) {
      setMultiplicador(String(dados.fatorMultiplicador))
    }
    if (dados?.ativo !== undefined) {
      setAtivo(Boolean(dados.ativo))
    }
  }, [dados])

  const handleSalvar = async () => {
    const valorNumerico = parseFloat(multiplicador)

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      alert("Informe um multiplicador válido e maior que 0.")
      return
    }

    try {
      setSalvando(true)
      await atualizarTaxaConversao({
        multiplicador: valorNumerico,
        ativo: ativo
      })

      setMensagemSucesso(true)
      setTimeout(() => setMensagemSucesso(false), 2500)

      // Atualiza os dados gerais do dashboard na tela pai (Pontos.jsx)
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.error("Erro ao salvar taxa de conversão:", error)
      alert(error.message || "Erro ao atualizar a taxa de conversão.")
    } finally {
      setSalvando(false)
    }
  }

  return (
    <CardPadrao>
      <div className="flex flex-row justify-between items-center mb-1">
        <h2 className="text-[clamp(16px,1vw,20px)] font-bold text-[#202735]">
          Taxa de Conversão
        </h2>

        {/* Clicar no badge alterna o status entre Ativo e Inativo */}
        <button
          type="button"
          onClick={() => setAtivo(!ativo)}
          className={`cursor-pointer text-[#FFFFFF] text-[clamp(12px,0.8vw,16px)] font-bold px-3 py-1 rounded-full transition-colors ${
            ativo ? "bg-[#65BA69] hover:bg-[#57a45b]" : "bg-gray-400 hover:bg-gray-500"
          }`}
          title="Clique para alternar o status"
        >
          {ativo ? "Ativo" : "Inativo"}
        </button>
      </div>

      <p className="text-[clamp(11px,0.6vw,12px)] font-bold text-[#94A3B8] tracking-wide mb-4">
        Regra aplicada aos itens desta categoria
      </p>

      <p className="text-[#475569] text-[clamp(12px,1vw,14px)] mb-1">
        MULTIPLICADOR DE PONTOS
      </p>

      <div className="flex flex-row items-center w-full h-[45px] border border-[#E5E7EB] rounded-[8px] px-4 mb-2 bg-[#FFFFFF] focus-within:border-[#65BA69] transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-[clamp(18px,1.5vw,24px)] h-[clamp(18px,1.5vw,24px)] text-[#8A8A8A] mr-3 shrink-0"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
          />
        </svg>

        <input
          type="number"
          step="0.05"
          min="0.1"
          value={multiplicador}
          onChange={(e) => setMultiplicador(e.target.value)}
          className="w-full h-full outline-none text-[clamp(16px,1.0vw,20px)] text-[#202735] font-medium bg-transparent"
        />
      </div>

      <p className="text-[clamp(12px,0.8vw,16px)] text-[#8A8A8A] mb-4">
        Os pontos base dos itens serão multiplicados por {multiplicador || "0"}.
      </p>

      {/* Botão de Enviar ao Back-end */}
      <button
        type="button"
        onClick={handleSalvar}
        disabled={salvando}
        className="w-full h-[42px] bg-[#65BA69] hover:bg-[#57a45b] active:scale-[0.99] disabled:opacity-50 text-[#FFFFFF] font-bold text-[clamp(13px,0.9vw,15px)] rounded-[8px] transition-all flex items-center justify-center cursor-pointer shadow-sm"
      >
        {salvando ? "Salvando..." : "Salvar Alterações"}
      </button>

      {/* Feedback visual de sucesso */}
      {mensagemSucesso && (
        <p className="text-center text-[#65BA69] text-[clamp(11px,0.7vw,13px)] font-semibold mt-2">
          ✓ Alterações salvas com sucesso!
        </p>
      )}
    </CardPadrao>
  )
}