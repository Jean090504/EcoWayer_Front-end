import CardPonto from "./CardPonto.jsx";

export default function ListaPontos({ pontos, selecionadoId, onSelect, onGerenciar, onCadastrar }) {
  const operando = pontos.filter((p) => p.status === "ativo").length;

  return (
    // Coluna esquerda: cabeçalho + lista rolável de cards
    <section className="flex w-full shrink-0 flex-col gap-3 xl:w-[320px]">
      {/* Cabeçalho: total de pontos e quantos estão operando */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Pontos cadastrados ({pontos.length})
        </span>
        <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-[#65BA69]">
          {operando} Operando
        </span>
      </div>

      {/* Área rolável com os cards (altura limitada à tela) */}
      <div className="flex max-h-[calc(100vh-260px)] flex-col gap-3 overflow-y-auto pr-1">
        {/* Mensagem quando a busca não encontra nenhum ponto */}
        {pontos.length === 0 && (
          <p className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-xs text-slate-400 shadow-sm">Nenhum ponto encontrado</p>
        )}

        {pontos.map((p) => (
          <CardPonto
            key={p.id}
            ponto={p}
            selecionado={p.id === selecionadoId}
            onSelect={onSelect}
            onGerenciar={onGerenciar}
            onCadastrar={onCadastrar}
          />
        ))}
      </div>
    </section>
  );
}
