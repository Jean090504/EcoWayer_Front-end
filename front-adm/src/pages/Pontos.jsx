import { useEffect, useState } from "react"

import Titulo from "../components/ui/titulo.jsx"
import CardStatus from "../components/cards/cardStatus.jsx"
import CardConversao from "../components/cards/cardConversao.jsx"
import CardValidador from "../components/cards/cardValidador.jsx"
import TabelaPontuacao from "../components/tabela/tabelaPontuacao.jsx"
import ModalRegra from "../components/modal/modalRegra.jsx"
import {
  listarRegras,
  atualizarStatusRegra,
  criarRegra,
  atualizarRegra,
  listarCategorias
} from "../services/regraPontuacaoService.js"

// Provisório: trocar pelo valor vindo do endpoint da taxa de conversão
const TAXA_CONVERSAO = 1.25

export default function Pontos() {
  const [regras, setRegras] = useState([])
  const [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [modal, setModal] = useState({ aberto: false, regra: null })

  async function carregar() {
    try {
      setRegras(await listarRegras())
      setErro("")
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
    listarCategorias().then(setCategorias).catch((e) => setErro(e.message))
  }, [])

  async function alternarStatus(regra) {
    try {
      const novoStatus = !regra.status
      await atualizarStatusRegra(regra.id, novoStatus)
      setRegras((atuais) =>
        atuais.map((r) => (r.id === regra.id ? { ...r, status: novoStatus } : r))
      )
    } catch (e) {
      setErro(e.message)
    }
  }

  // id undefined = Nova Regra (POST); com id = edição (PUT)
  async function salvarRegra(id, dados) {
    if (id) {
      await atualizarRegra(id, dados)
    } else {
      await criarRegra(dados)
    }
    await carregar()
  }

  const abrirNova = () => setModal({ aberto: true, regra: null })
  const abrirEdicao = (regra) => setModal({ aberto: true, regra })
  const fecharModal = () => setModal({ aberto: false, regra: null })

  const regrasAtivas = regras.filter((r) => r.status).length

  return (
    <div>
      <Titulo texto="Pontos" />

      <div className="flex flex-col items-center justify-center mt-5">
        <div className="w-[95%] min-h-[85vh]">
          <div className="flex flex-row gap-5">
            <CardStatus titulo="Taxa de Conversão" valor="2.500" porcentagem="+3%" textoRodape="no último mês" />
            <CardStatus titulo="Itens Validados" valor="275" porcentagem="+5%" textoRodape="no último mês" />
            <CardStatus titulo="Pontos Gerados" valor="1.000" porcentagem="+10%" textoRodape="no último mês" />
            <CardStatus titulo="Regras Ativas" valor={String(regrasAtivas)} />
          </div>

          <div className="flex flex-row gap-6 w-full mx-auto mt-8 pb-8">
            <div className="flex flex-col gap-5 shrink-0">
              <CardConversao />
              <CardValidador regras={regras} taxa={TAXA_CONVERSAO} />
            </div>

            <div className="flex-1">
              <TabelaPontuacao
                regras={regras}
                carregando={carregando}
                erro={erro}
                onAlternarStatus={alternarStatus}
                onNovaRegra={abrirNova}
                onEditar={abrirEdicao}
              />
            </div>
          </div>
        </div>
      </div>

      {modal.aberto && (
        <ModalRegra
          key={modal.regra?.id ?? "nova"}
          regra={modal.regra}
          categorias={categorias}
          regras={regras}
          onSalvar={salvarRegra}
          onAlternarStatus={alternarStatus}
          onFechar={fecharModal}
        />
      )}
    </div>
  )
}