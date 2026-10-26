import StatusBadge from "./StatusBadge.jsx";
import TagMaterial from "./TagMaterial.jsx";

// Bolinha colorida ao lado do nome (verde = ativo, vermelha = inativo)
const COR_BOLINHA = {
  ativo: "bg-green-500",
  inativo: "bg-red-500",
  manutencao: "bg-yellow-400",
  cheio: "bg-red-500",
};

export default function CardPonto({ ponto, selecionado, onSelect, onGerenciar }) {
  return (
    // Card clicável do ponto; ganha borda verde quando está selecionado no mapa
    <div
      onClick={() => onSelect(ponto.id)}
      className={`cursor-pointer rounded-xl border bg-white p-3 shadow-sm transition hover:shadow-md ${
        selecionado ? "border-green-500" : "border-gray-100"
      }`}
    >
      {/* Topo: nome + bolinha de status à esquerda, selo de status à direita */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-semibold text-gray-800">{ponto.nome}</h3>
            <span className={`h-1.5 w-1.5 rounded-full ${COR_BOLINHA[ponto.status] ?? "bg-gray-400"}`} />
          </div>
          <p className="mt-0.5 text-[10px] text-gray-400">{ponto.endereco}</p>
        </div>

        <StatusBadge status={ponto.status} tamanho="pequeno" />
      </div>

      {/* Lista de materiais aceitos */}
      <div className="mt-2 flex flex-wrap gap-1">
        {ponto.materiais.map((m) => (
          <TagMaterial key={m} nome={m} />
        ))}
      </div>

      {/* Rodapé: botão Gerenciar */}
      <div className="mt-3 flex justify-end border-t border-gray-100 pt-2">
        <button
          onClick={(e) => {
            e.stopPropagation(); // evita selecionar o card ao clicar no botão
            onGerenciar(ponto.id);
          }}
          className="rounded-md bg-purple-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-purple-700"
        >
          Gerenciar
        </button>
      </div>
    </div>
  );
}