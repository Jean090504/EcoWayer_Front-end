import CardAvaliacao from "../components/cards/cardAvaliacao"

export default function AvaliacaoAnuncio(aoVoltar) {
    return (
        <main className = "flex flex-1 w-full flex-col items-center justify-center bg-[#FAF8FF]">
            <div className = "w-[75%]">
                <button
                    onClick = {aoVoltar} 
                    className = "text-[#3E4A3D]"
                > ← Voltar para todas as Categorias
                </button>

                {/* <CardAvaliacao /> */}

            </div>
        </main>
    )
}