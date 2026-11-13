import { ArrowLeft } from "lucide-react"

import Botao from "../components/ui/botao"

import CardMotivoDenuncia from "../components/cards/denunciarAnuncio/cardMotivoDenuncia"

export default function DenunciarAnuncio() {
    return(
        <main className="flex w-full flex-1 justify-center bg-[#FAF8FF]">
            <div className="flex flex-col w-[85%] gap-8 px-6 py-8">

                <div className="relative flex items-center justify-center mt-2">
                    <div className="absolute left-0">
                        <Botao
                        onClick={() => navigate(-1)}
                        className="absolute left-0 flex w-auto shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#191C1E] shadow-sm transition hover:bg-gray-100"
                        >
                        <ArrowLeft size={18} strokeWidth={2.5} className="shrink-0" />
                        Voltar ao anúncio
                        </Botao>
                    </div>
                    <h1 className="text-[36px] font-bold text-[#191C1E]">Denunciar este anúncio</h1>
                </div>

                <CardMotivoDenuncia
                onCancelar={() => navigate(-1)}
                onEnviar={({ motivo, descricao, arquivos }) => {
                    console.log(motivo, descricao, arquivos)
                }}
                />

            </div> 
        </main>
    )
}