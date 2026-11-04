import { useState } from "react"

import { Clock, Image } from "lucide-react"

import InputImagem from "../ui/inputImagem.jsx"

export default function CardInfoItem({ categoria, titulo, descricao }) {
    const [arquivo, setArquivo] = useState(null)
    return (
        <div className = "flex flex-col bg-white w-900px">

            <InputImagem
                onChange = {setArquivo}
                className = "hidden"
            />
            
            <span className="bg-[#65BA69] text-white">Móveis</span>
            <h3 className="font-bold text-[18px]">Sofá Retrátil 3 Lugares Suede Cinza</h3>
            <p className="flex flex-row items-center text-[16px] text-[#6B7280] gap-1"> <Clock size = {20}/> Publicado em 14/10/2024 às 14:32 • São Paulo, SP</p>

        </div>
    )
}