import StatusBadge from "./StatusBadge.jsx";
import TagMaterial from "./TagMaterial.jsx";

// Bolinha colorida ao lado do nome (verde = ativo, amarela = manutenção)
const COR_BOLINHA = { ativo: "bg-green-500", manutencao: "bg-yellow-400", cheio: "bg-red-500" };

export default function CardPonto({ ponto, selecionado, onSelect, onGerenciar, onCadastrar }) {
  return (
    // Card clicável do ponto; ganha borda verde quando está selecionado no mapa
    <div
      onClick={() => onSelect(ponto.id)}
      className={`cursor-pointer rounded-2xl border bg-white p-4 shadow-[0_6px_24px_rgba(31,41,55,0.04)] transition hover:-translate-y-0.5 hover:shadow-md ${
        selecionado ? "border-[#65BA69] ring-2 ring-green-100" : "border-slate-100"
      }`}
    >
      {/* Topo: nome + bolinha de status à esquerda, selo de status à direita */}
      <div className="flex items-start justify-between">
        {/* Nome e endereço */}
        <div>
          {/* Nome com a bolinha de status */}
          <div className="flex items-center gap-1.5">
            <h3 className="max-w-[190px] truncate text-sm font-bold text-slate-800">{ponto.nome}</h3>
            <span className={`h-1.5 w-1.5 rounded-full ${COR_BOLINHA[ponto.status]}`} />
          </div>
          {/* Endereço do ponto */}
          <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-400">{ponto.endereco}</p>
        </div>

        <StatusBadge status={ponto.status} />
      </div>

      {/* Lista de materiais aceitos */}
      <div className="mt-2 flex flex-wrap gap-1">
        {ponto.materiais.map((m) => (
          <TagMaterial key={m} nome={m} />
        ))}
      </div>

      {/* Rodapé: barra de capacidade + botão Gerenciar */}
      <div className="mt-4 flex justify-end border-t border-slate-100 pt-3">
        {ponto.externo ? <button
          onClick={(e) => {
            e.stopPropagation();
            onCadastrar?.(ponto);
          }}
          className="rounded-lg bg-[#65BA69] px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-[#51a856]"
        >
          Cadastrar
        </button> : <button
          onClick={(e) => {
            e.stopPropagation(); // evita selecionar o card ao clicar no botão
            onGerenciar(ponto.id);
          }}
          className="rounded-lg bg-[#7350B9] px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-[#6140a5]"
        >
          Gerenciar
        </button>}
      </div>
    </div>
  );
}
