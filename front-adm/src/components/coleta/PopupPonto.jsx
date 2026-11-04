import TagMaterial from "./TagMaterial.jsx";
import StatusBadge from "./StatusBadge.jsx";

// Conteúdo do balão que aparece em cima do pin selecionado
export default function PopupPonto({ ponto }) {
  return (
    // Caixa branca do balão
    <div className="w-[190px] p-1">
      {/* Nome + status do ponto (verde = ativo, vermelho = inativo) */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-[11px] font-semibold text-gray-800">{ponto.nome}</h4>
        <StatusBadge status={ponto.status} />
      </div>

      {/* Materiais aceitos */}
      <div className="mt-2 flex flex-wrap gap-1">
        {ponto.materiais.map((m) => (
          <TagMaterial key={m} nome={m} />
        ))}
      </div>
    </div>
  );
}