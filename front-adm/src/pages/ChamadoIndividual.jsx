import { useState } from "react"

import BotaoVoltar from "../components/ui/botaoVoltar.jsx"
import CardAlertaIA from "../components/cards/cardChamadosIndividuais/cardAlertaIA.jsx"
import CardInfoItem from "../components/cards/cardChamadosIndividuais/cardInfoItem.jsx"
import CardDadosVendedor from "../components/cards/cardChamadosIndividuais/cardDadosVendedor.jsx"
import CardAcoesAdministrador from "../components/cards/cardChamadosIndividuais/cardAcoesAdministrador.jsx"


export default function ChamadoIndividual({ aoVoltar }) {
    const [arquivo, setArquivo] = useState(null)
    const [tipo, setTipo] = useState("")

    return (
        <div>
            <BotaoVoltar aoVoltar={aoVoltar} texto="← Voltar para todos os Chamados" />

            <div className="flex flex-col items-center justify-center gap-[clamp(16px,1.3vw,24px)] mt-[clamp(20px,1.3vw,26px)]">

                <div className="flex flex-col w-[95%] min-h-[85vh]">

                    <div className="flex flex-row w-full items-center">
                        <h1 className="text-[25px] font-bold">Verificar anúncio</h1>
                        <h1 className="text-[25px] font-bold text-[#9CA3AF] ml-1.5">#CH-8492</h1>
                        <span className="bg-[#7350B9] text-white rounded-[clamp(10px,0.7vw,14px)] text-[clamp(10px,1vw,14px)] w-[clamp(165px,8vw,190px)] h-[clamp(25px,3vh,40px)] flex items-center justify-center ml-4.5">
                            ◉ Em Análise / Alerta
                        </span>
                        <p className="text-[clamp(12px,1vw,14px)] text-slate-500 font-medium ml-auto">
                            Prioridade: <span className="text-red-500 font-bold uppercase">alta</span>
                        </p>
                    </div>

                    <CardAlertaIA
                        titulo="Anúncio com Divergência de Preço"
                        descricao="A IA detectou divergência acentuada no preço de mercado (75% abaixo do padrão para a categoria) e descrição idêntica a anúncio duplicado recentemente denunciado por conduta fraudulenta."
                        porcentagem="94%"
                    />

                    <div className = "grid grid-cols-[1fr_clamp(300px,27vw,375px)] grid-rows-[auto_1fr] gap-x-6 min-h-[calc(90vh-200px)] mb-5">
                        <div className = "row-span-2 flex">
                            <CardInfoItem />
                        </div>

                        <CardDadosVendedor />
                        <CardAcoesAdministrador
                            onAprovar = {() => console.log("aprovar")}
                            onDesativar = {() => console.log("desativar")}
                            onRemover = {() => console.log("remover")}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}