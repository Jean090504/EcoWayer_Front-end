import CardPonto from "./CardPonto.jsx";

export default function ListaPontos({ pontos, selecionadoId, onSelect, onGerenciar }) {
  const operando = pontos.filter((p) => p.status === "ativo").length;

  return (
    // Coluna esquerda: cabeçalho + lista rolável de cards
    <section className="flex w-[300px] shrink-0 flex-col gap-3">
      {/* Cabeçalho: total de pontos e quantos estão operando */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          Pontos cadastrados ({pontos.length})
        </span>
        <span className="rounded bg-green-500 px-2 py-0.5 text-[10px] font-semibold text-white">
          {operando} Operando
        </span>
      </div>

      {/* Área rolável com os cards (altura limitada à tela) */}
      <div className="flex max-h-[calc(100vh-220px)] flex-col gap-3 overflow-y-auto pr-1">
        {pontos.map((p) => (
          <CardPonto
            key={p.id}
            ponto={p}
            selecionado={p.id === selecionadoId}
            onSelect={onSelect}
            onGerenciar={onGerenciar}
          />
        ))}
      </div>
    </section>
  );
}