import CardAvaliacao from "../components/cards/cardAvaliacao"

export default function AvaliacaoAnuncio({ aoVoltar }) {
  const dadosTeste = {
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
        <button
          onClick={aoVoltar}
          className="self-start text-[#3E4A3D] cursor-pointer text-[14px] font-semibold flex items-center gap-2 mt-8 mb-4"
        >
          ← Voltar para Minhas Negociações
        </button>

        <CardAvaliacao
          negociacao={dadosTeste}
          onEnviar={(avaliacao) => console.log(avaliacao)}
          onAdiar={() => console.log("avaliar depois")}
        />
      </div>
    </main>
  )
}