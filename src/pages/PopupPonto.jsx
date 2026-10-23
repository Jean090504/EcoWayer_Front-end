import TagMaterial from "./TagMaterial.jsx";

// Conteúdo do balão que aparece em cima do pin selecionado
export default function PopupPonto({ ponto }) {
  return (
    // Caixa branca do balão
    <div className="w-[190px] p-1">
      {/* Nome + selo de capacidade */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-[11px] font-semibold text-gray-800">{ponto.nome}</h4>
        <span className="rounded bg-green-500 px-1.5 py-0.5 text-[9px] font-semibold text-white">
          Capacidade {ponto.capacidade}%
        </span>
      </div>

      {/* Horário de funcionamento */}
      <p className="mt-2 text-[10px] text-gray-500">Horário: {ponto.horario}</p>

      {/* Materiais aceitos */}
      <div className="mt-2 flex flex-wrap gap-1">
        {ponto.materiais.map((m) => (
          <TagMaterial key={m} nome={m} />
        ))}
      </div>
    </div>
  );
}