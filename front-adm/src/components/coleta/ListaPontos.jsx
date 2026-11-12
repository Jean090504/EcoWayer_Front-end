import CardPonto from "./CardPonto.jsx";

export default function ListaPontos({ pontos, selecionadoId, onSelect, onGerenciar, onCadastrar, onAlterarStatus, statusAlterandoId }) {
  return (
    // Coluna esquerda com a lista rolável de cards
    <section className="flex w-full shrink-0 flex-col gap-3 xl:w-[320px]">
      {/* Área rolável com os cards (altura limitada à tela) */}
      <div className="flex max-h-[calc(100vh-260px)] flex-col gap-3 overflow-y-auto px-1 pb-2 pt-2">
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
            onAlterarStatus={onAlterarStatus}
            statusAlterando={statusAlterandoId === p.id}
          />
        ))}
      </div>
    </section>
  );
}
