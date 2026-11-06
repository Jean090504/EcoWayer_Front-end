import { useState } from "react"

// ids de tbl_condicao_item (1 = Excelente, 2 = Bom, 3 = Regular), como no JSON do regra-pontuacao
const CONDICOES = [
  { id: 1, nome: "Excelente", tag: "Top", fundo: "bg-[#4CAF50]", tagCor: "text-[#2E8B57]" },
  { id: 2, nome: "Bom", tag: "Médio", fundo: "bg-[#7350B9]", tagCor: "text-[#7350B9]" },
  { id: 3, nome: "Regular", tag: "Base", fundo: "bg-[#F5A623]", tagCor: "text-[#F5A623]" }
]

const rotulo = "text-[clamp(10px,0.7vw,12px)] font-bold text-[#475569] uppercase tracking-wide mb-2"
const campo = "flex flex-row items-center w-full h-[42px] border border-[#E5E7EB] rounded-[8px] px-3 bg-[#FFFFFF]"

export default function ModalRegra({ regra, categorias, regras, onSalvar, onAlternarStatus, onFechar }) {
  const editando = Boolean(regra)

  const [categoriaId, setCategoriaId] = useState(regra?.categoria.id ?? "")
  const [pontosBase, setPontosBase] = useState(regra?.pontos_base ?? "")
  const [bonusPercentual, setBonusPercentual] = useState(regra?.bonus_campanha_percentual ?? 0)
  const [bonusAtivo, setBonusAtivo] = useState(regra?.bonus_campanha_ativo ?? false)
  const [status, setStatus] = useState(regra?.status ?? true)
  const [multiplicadores, setMultiplicadores] = useState(
    Object.fromEntries(
      CONDICOES.map((c) => [c.id, regra?.condicao.find((x) => x.id === c.id)?.multiplicador ?? ""])
    )
  )
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")

  // Em "Nova Regra" só aparecem categorias que ainda não têm regra
  const idsComRegra = regras.map((r) => r.categoria.id)
  const categoriasDisponiveis = editando
    ? [regra.categoria]
    : categorias.filter((c) => !idsComRegra.includes(c.id))

  // Simulação do protótipo: base × multiplicador Excelente × bônus (se ativo)
  const base = Number(pontosBase) || 0
  const excelente = Number(multiplicadores[1]) || 0
  const fatorBonus = bonusAtivo ? 1 + (Number(bonusPercentual) || 0) / 100 : 1
  const simulacao = Number((base * excelente * fatorBonus).toFixed(1))

  function alterarMultiplicador(id, valor) {
    setMultiplicadores((atuais) => ({ ...atuais, [id]: valor }))
  }

  function validar() {
    if (!categoriaId) return "Selecione uma categoria."
    if (!(base > 0)) return "A pontuação base deve ser maior que zero."
    if (Number(bonusPercentual) < 0) return "A bonificação não pode ser negativa."
    for (const c of CONDICOES) {
      if (!(Number(multiplicadores[c.id]) > 0)) return `O multiplicador de "${c.nome}" deve ser maior que zero.`
    }
    return ""
  }

  async function salvar() {
    const mensagem = validar()
    if (mensagem) return setErro(mensagem)

    setSalvando(true)
    setErro("")

    try {
        await onSalvar(regra?.id, {
            id_categoria: Number(categoriaId),
            pontos_base: base,
            bonus_campanha_percentual: Number(bonusPercentual) || 0,
            bonus_campanha_ativo: bonusAtivo,
            status,
            condicao: CONDICOES.map((c) => ({
              id_condicao_item: c.id,
              multiplicador: Number(multiplicadores[c.id])
            }))
          })
      onFechar()
    } catch (e) {
      setErro(e.message)
    } finally {
      setSalvando(false)
    }
  }

  async function alternarStatusRegra() {
    await onAlternarStatus(regra)
    onFechar()
  }

  return (
    <div
      className = "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick = {onFechar}
    >
      <div
        className = "bg-[#FFFFFF] rounded-[16px] shadow-xl w-full max-w-[600px] max-h-[95vh] overflow-y-auto"
        onClick = {(e) => e.stopPropagation()}
      >
        <div className = "flex flex-row items-center gap-2 px-6 py-4 border-b border-[#F3F4F6]">
          <span className = "w-[8px] h-[8px] rounded-full bg-[#7350B9]"></span>
          <h2 className = "text-[clamp(16px,1.1vw,20px)] font-bold text-[#202735]">
            {editando ? "Gerenciar Regra de Pontuação" : "Nova Regra de Pontuação"}
          </h2>
        </div>

        <div className = "flex flex-col gap-5 px-6 py-5">

          <div className = "flex flex-row gap-4">
            <div className = "flex-1">
              <p className = {rotulo}>Categoria selecionada</p>
              <select
                value = {categoriaId}
                onChange = {(e) => setCategoriaId(e.target.value)}
                disabled = {editando}
                className = "w-full h-[42px] border border-[#E5E7EB] rounded-[8px] px-3 bg-[#FFFFFF] text-[#202735] outline-none disabled:bg-[#F9FAFB]"
              >
                {!editando && <option value = "">Selecione...</option>}
                {categoriasDisponiveis.map((c) => (
                  <option key = {c.id} value = {c.id}>{c.nome}</option>
                ))}
              </select>
            </div>

            <div className = "flex-1">
              <p className = {rotulo}>&nbsp;</p>
              <div className = "flex flex-row items-center justify-between h-[42px] border border-[#E5E7EB] rounded-[8px] px-3 bg-[#F9FAFB]">
                <span className = "text-[clamp(12px,0.8vw,14px)] font-semibold text-[#202735]">Status da Regra</span>
                <button
                  type = "button"
                  onClick = {() => setStatus(!status)}
                  className = {`w-[40px] h-[22px] rounded-full p-[2px] flex cursor-pointer transition-colors ${status ? "bg-[#4CAF50] justify-end" : "bg-[#D1D5DB] justify-start"}`}
                >
                  <span className = "w-[18px] h-[18px] rounded-full bg-[#FFFFFF]"></span>
                </button>
              </div>
            </div>
          </div>

          <div className = "flex flex-row gap-4">
            <div className = "flex-1">
              <p className = {rotulo}>Pontuação base (pts)</p>
              <div className = {campo}>
                <input
                  type = "number"
                  min = "1"
                  value = {pontosBase}
                  onChange = {(e) => setPontosBase(e.target.value)}
                  className = "w-full outline-none font-semibold text-[#202735] bg-transparent"
                />
                <span className = "bg-[#4CAF50] text-[#FFFFFF] text-[11px] font-bold px-2 py-0.5 rounded-[6px]">pts</span>
              </div>
            </div>

            <div className = "flex-1">
              <p className = {rotulo}>Bonificação extra de campanha</p>
              <div className = {campo}>
                <span className = "text-[#4CAF50] font-semibold">+</span>
                <input
                  type = "number"
                  min = "0"
                  value = {bonusPercentual}
                  onChange = {(e) => setBonusPercentual(e.target.value)}
                  className = "w-full outline-none font-semibold text-[#4CAF50] bg-transparent"
                />
                <span className = "text-[#4CAF50] font-semibold mr-2">%</span>
                <button
                  type = "button"
                  onClick = {() => setBonusAtivo(!bonusAtivo)}
                  className = {`text-[11px] font-bold px-2 py-0.5 rounded-[6px] cursor-pointer ${bonusAtivo ? "bg-[#4CAF50] text-[#FFFFFF]" : "bg-[#E5E7EB] text-[#6B7280]"}`}
                >
                  {bonusAtivo ? "Ativo" : "Inativo"}
                </button>
              </div>
            </div>
          </div>

          <div>
            <p className = {rotulo}>Multiplicadores por estado de conservação</p>
            <div className = "flex flex-row gap-3">
              {CONDICOES.map((c) => (
                <div key = {c.id} className = {`flex-1 rounded-[10px] p-3 ${c.fundo}`}>
                  <div className = "flex flex-row justify-between items-center mb-2">
                    <span className = "text-[#FFFFFF] text-[clamp(11px,0.8vw,13px)] font-bold">{c.nome}</span>
                    <span className = {`bg-[#FFFFFF] ${c.tagCor} text-[10px] font-bold px-1.5 py-0.5 rounded-[4px]`}>{c.tag}</span>
                  </div>
                  <div className = "flex flex-row items-center bg-[#FFFFFF] rounded-[6px] h-[34px] px-2">
                    <input
                      type = "number"
                      step = "0.1"
                      min = "0"
                      value = {multiplicadores[c.id]}
                      onChange = {(e) => alterarMultiplicador(c.id, e.target.value)}
                      className = "w-full outline-none text-[#202735] font-semibold bg-transparent"
                    />
                    <span className = "text-[#8A8A8A] text-sm">×</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className = "flex flex-row justify-between items-center bg-[#F8F7FD] border border-[#EFEAFB] rounded-[10px] px-4 py-3">
            <span className = "text-[clamp(10px,0.7vw,12px)] font-bold text-[#8A8A8A] uppercase tracking-wide">Simulação instantânea</span>
            <div className = "text-right">
              <p className = "text-[clamp(18px,1.4vw,24px)] font-bold text-[#7350B9] leading-none">{simulacao} pts</p>
              <p className = "text-[10px] text-[#8A8A8A] mt-1">
                {base} × {excelente} {bonusAtivo ? `× ${bonusPercentual}% bônus` : ""}
              </p>
            </div>
          </div>

          {erro && <p className = "text-[#E43E42] text-sm font-semibold">{erro}</p>}
        </div>

        <div className = "flex flex-row justify-between items-center px-6 py-4 border-t border-[#F3F4F6]">
          {editando ? (
            <button
              type = "button"
              onClick = {alternarStatusRegra}
              className = {`${regra.status ? "bg-[#E43E42]" : "bg-[#65BA69]"} text-[#FFFFFF] text-sm font-bold px-4 py-2 rounded-[8px] cursor-pointer`}
            >
              {regra.status ? "Desativar Esta Regra" : "Ativar Esta Regra"}
            </button>
          ) : <span></span>}

          <div className = "flex flex-row gap-3">
            <button
              type = "button"
              onClick = {onFechar}
              className = "border border-[#E5E7EB] text-[#202735] text-sm font-semibold px-4 py-2 rounded-[8px] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type = "button"
              onClick = {salvar}
              disabled = {salvando}
              className = "bg-[#7350B9] text-[#FFFFFF] text-sm font-bold px-4 py-2 rounded-[8px] cursor-pointer disabled:opacity-60"
            >
              {salvando ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}