import { useState } from "react"

import { Clock, Image } from "lucide-react"

import InputImagem from "../ui/inputImagem.jsx"

export default function CardInfoItem({
    categoria = "Móveis",
    titulo = "Sofá Retrátil 3 Lugares Suede Cinza",
    dataPublicacao = "14/10/2024 às 14:32",
    local = "São Paulo, SP",
    descricao = "Vendo sofá seminovo com pouco tempo de uso, tecido suede na cor cinza grafite. Retrátil e reclinável, muito confortável. Motivo de mudança urgente para outro estado, por isso o preço bem abaixo. Retirada por conta do comprador na região central.",
    precoAnunciado = "R$ 450,00",
    precoEstimado = "R$ 1.800,00",
    condicao = "Seminovo / Usado",
    frete = "Retirada no Local",
    pontos = "+45 Pontos"
}) {
    const [arquivo, setArquivo] = useState(null)
    return (
        <div className = "flex flex-col bg-white flex-1 min-w-0 rounded-lg shadow-md mt-4 p-6">
            {/* Topo: foto + informações */}
            <div className = "flex flex-row gap-6">
                <label className = "relative w-[clamp(170px,16vw,224px)] h-[clamp(190px,18vh,195px)] border border-dashed border-[#D1D5DB] bg-[#F1F5F9] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#F9FAFB] shrink-0">
                    <span className = "absolute top-2 left-2 bg-[#4B5563] text-white text-[clamp(9px,0.7vw,10px)] px-1.5 py-0.5 rounded">Anexo Original</span>
                    <Image size = {48} className = "text-[#9CA3AF]"/>
                    <span className = "text-[#6B7280] text-[clamp(11px,0.9vw,13px)]">Foto 1 de 4</span>
                    <InputImagem
                        onChange = {setArquivo}
                        className = "hidden"
                    />
                </label>

                <div className = "flex flex-col flex-1 gap-2">
                    <span className = "bg-[#65BA69] text-white text-[clamp(10px,0.8vw,11px)] font-semibold px-2 py-0.5 w-fit rounded">{categoria}</span>
                    <h3 className = "font-bold text-[clamp(17px,1.3vw,20px)] leading-7 text-[#111827] max-w-[300px]">{titulo}</h3>
                    <p className = "flex flex-row items-center text-[clamp(10px,0.8vw,12px)] text-[#6B7280] gap-1">
                        <Clock size = {13}/> Publicado em {dataPublicacao} • {local}
                    </p>

                    <div className = "flex flex-row gap-16 bg-[#F9FAFB] border border-[#F3F4F6] rounded-lg px-4 py-3 mt-2">
                        <div className = "flex flex-col">
                            <p className = "text-[clamp(10px,0.8vw,12px)] text-[#6B7280]">Preço Anunciado</p>
                            <span className = "font-bold text-[clamp(17px,1.3vw,20px)] text-[#DC2626]">{precoAnunciado}</span>
                        </div>

                        <div className = "flex flex-col">
                            <p className = "text-[clamp(10px,0.8vw,12px)] text-[#6B7280]">Estimativa do Sistema</p>
                            <span className = "font-bold text-[clamp(17px,1.3vw,20px)] text-[#1E293B]">{precoEstimado}</span>
                        </div>
                    </div>
                </div>
            </div>

            <hr className = "border-t border-[#E5E7EB] mt-6" />

            {/* Descrição */}
            <div className = "flex flex-col gap-3 mt-6 flex-1">
                <h4 className = "text-[clamp(10px,0.8vw,12px)] font-semibold tracking-wider text-[#8A8A8A] uppercase">Descrição do anúncio</h4>
                <p className = "bg-[#F9FAFB] border border-[#F3F4F6] rounded-lg px-5 py-4 text-[clamp(12px,0.95vw,14px)] leading-6 flex-1 text-[#4B5563]">
                    "{descricao}"
                </p>
            </div>

            <hr className = "border-t border-[#E5E7EB] mt-6" />

            {/* Mini-cards */}
            <div className = "flex flex-row gap-4 mt-6">
                <div className = "flex flex-col flex-1 border border-[#F3F4F6] rounded-lg px-3 py-2.5">
                    <span className = "text-[clamp(9px,0.75vw,11px)] text-[#8A8A8A]">Condição</span>
                    <span className = "font-semibold text-[clamp(12px,0.95vw,14px)] text-[#111827]">{condicao}</span>
                </div>

                <div className = "flex flex-col flex-1 border border-[#F3F4F6] rounded-lg px-3 py-2.5">
                    <span className = "text-[clamp(9px,0.75vw,11px)] text-[#8A8A8A]">Frete / Coleta</span>
                    <span className = "font-semibold text-[clamp(12px,0.95vw,14px)] text-[#111827]">{frete}</span>
                </div>

                <div className = "flex flex-col flex-1 border border-[#F3F4F6] rounded-lg px-3 py-2.5">
                    <span className = "text-[clamp(9px,0.75vw,11px)] text-[#8A8A8A]">Ponto Ecológico</span>
                    <span className = "font-semibold text-[clamp(12px,0.95vw,14px)] text-[#65BA69]">{pontos}</span>
                </div>
            </div>
        </div>
    )
}