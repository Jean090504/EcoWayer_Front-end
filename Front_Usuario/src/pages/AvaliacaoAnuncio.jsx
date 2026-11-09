import CardAvaliacao from "../components/cards/cardAvaliacao"

export default function AvaliacaoAnuncio({ aoVoltar }) {
  const dadosTeste = {
    protocolo: "ECW-89421-BR",
    itemTitulo: "Bicicleta Urbana Vintage Restaurada",
    itemImagem: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&q=80",
    vendedorNome: "Carlos Eduardo M.",
    dataEntrega: "Ontem, 16:30",
    preco: 380,
    ecoPontos: 40,
    localEntrega: "EcoPonto Pinheiros",
  }

  return (
    <main className="flex flex-1 w-full flex-col items-center bg-[#FAF8FF]">
      <div className="w-full max-w-[860px] flex flex-col">
        <div className="flex items-center justify-between mt-8 mb-4">
          <button
            onClick={aoVoltar}
            className="text-[#3E4A3D] cursor-pointer text-[14px] font-semibold flex items-center gap-2"
          >
            ← Voltar para Minhas Negociações
          </button>

          <span className="inline-flex items-center gap-2 bg-white rounded-full px-3 py-1 text-[11px] text-[#3E4A3D]">
            <span className="w-2 h-2 rounded-full bg-[#4CAF50]" />
            Protocolo #{dadosTeste.protocolo} 
          </span> 
        </div>

        <CardAvaliacao
          negociacao={dadosTeste}
          onEnviar={(avaliacao) => console.log(avaliacao)}
          onAdiar={() => console.log("avaliar depois")}
        />
      </div>
    </main>
  )
}