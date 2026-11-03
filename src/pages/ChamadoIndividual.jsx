import { useState } from "react"

import { Clock, Image } from "lucide-react"

import BotaoVoltar from "../components/ui/botaoVoltar.jsx"
import CardAlerta from "../components/cards/cardAlerta.jsx"
import InputImagem from "../components/ui/inputImagem.jsx"

export default function ChamadoIndividual({ aoVoltar }) {
    const [arquivo, setArquivo] = useState(null)
    const [tipo, setTipo] = useState("")

    return (
        <div>
            <BotaoVoltar aoVoltar={aoVoltar} texto="← Voltar para todos os Chamados" />

            <div className="flex flex-col items-center justify-center gap-[clamp(16px,1.3vw,24px)] mt-[clamp(20px,1.3vw,26px)]">

                <div className="flex flex-col w-[95%] min-h-[85vh]">

                    <div className="flex flex-row w-full">
                        <h1>Verificar anúncio</h1>
                        <h2>#CH-8492</h2>
                        <span className="bg-[#7350B9] text-white rounded-[clamp(10px,0.7vw,14px)] text-[clamp(12px,1vw,16px)] w-[clamp(105px,8vw,155px)] h-[clamp(35px,3vh,45px)] flex items-center justify-center">
                            ◉ Em Análise / Alerta
                        </span>
                        <p className="text-[clamp(12px,1vw,14px)] text-slate-500 font-medium ml-auto">
                            Prioridade: <span className="text-red-500 font-bold uppercase">alta</span>
                        </p>
                    </div>

                    <CardAlerta imagem = "">
                        <h3>Alerta da Inteligência Artificial: Atividade Suspeita / Conteúdo Irregular</h3>

                        <p>
                            A IA detectou divergência acentuada no preço de mercado (75% abaixo do padrão para a categoria) e descrição idêntica a anúncio duplicado recentemente denunciado por conduta fraudulenta.
                        </p>
                    </CardAlerta>


                    <div className="flex flex-row w-full">
                        <div className="flex flex-col">

                            <div className="bg-white flex flex-row">
                                <label className="w-[200px] h-[200px] border-2 border-dashed border-[#E5E7EB] rounded-xl flex flex-col items-center justify-center cursor-pointer bg-[#F1F5F9] hover:bg-[#F9FAFB]">

                                    <Image size={32} className="text-[#8A8A8A] mb-2" />

                                    <InputImagem
                                        onChange={setArquivo}
                                        className="hidden"
                                    />

                                    <span className="text-[#8A8A8A] text-sm">Foto 1 de 4</span>
                                    

                                </label>

                                <Clock size={16} className="text-[#8A8A8A] mt-1" />
                                <p>Publicado em 14/10/2024 às 14:32 • São Paulo, SP</p>
                            </div>

                            <div className="bg-white">
                                <p>Detalhamento da Análise Automatizada</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}