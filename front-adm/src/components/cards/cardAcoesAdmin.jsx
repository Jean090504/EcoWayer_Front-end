const formatar = (t = "") => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase().replaceAll("_", " ")

export default function CardAcoesAdmin({ pendente, acaoAtual, salvando, erro, onAprovar, onDesativar, onRemover }) {
  const base = "w-full text-white font-semibold rounded-lg py-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <p className="text-xs font-semibold text-gray-400 uppercase mb-4">Ações do administrador</p>

      {pendente ? (
        <div className="flex flex-col gap-3">
          <button className={`${base} bg-[#5DB96B]`} disabled={salvando} onClick={onAprovar}>Aprovar Anúncio</button>
          <button className={`${base} bg-[#7350B9]`} disabled={salvando} onClick={onDesativar}>Desativar Temporariamente</button>
          <button className={`${base} bg-red-500`} disabled={salvando} onClick={onRemover}>Remover Anúncio e Penalizar</button>
        </div>
      ) : (
        <p className="text-sm text-gray-600">
          Alerta já resolvido: <b>{formatar(acaoAtual)}</b>
        </p>
      )}

      {erro && <p className="text-sm text-red-600 mt-3">{erro}</p>}
    </div>
  )
}