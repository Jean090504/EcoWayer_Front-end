export default function CardMensagens({ mensagens = [] }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-4">
      <h2 className="text-[18px] font-bold">Mensagens denunciadas</h2>

      {mensagens.map((m) => (
        <div key={m.id} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
          <div className="flex flex-row items-center justify-between flex-wrap gap-2">
            <span className="font-semibold text-[14px]">{m.remetente?.nome}</span>
            <span className="text-[12px] text-gray-500">{m.envio}</span>
          </div>

          <p className="bg-red-50 border-l-4 border-red-400 rounded p-3 text-[14px]">
            {m.texto}
          </p>

          {m.conversa?.anuncio && (
            <p className="text-[12px] text-gray-500">
              Conversa sobre o anúncio{" "}
              <span className="font-semibold text-gray-700">
                #{m.conversa.anuncio.id} - {m.conversa.anuncio.nome}
              </span>{" "}
              (anunciante: {m.conversa.anuncio.usuario?.nome})
            </p>
          )}
        </div>
      ))}
    </div>
  )
}