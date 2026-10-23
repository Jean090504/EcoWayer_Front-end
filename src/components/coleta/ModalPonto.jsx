import { useEffect } from "react";
import StatusBadge from "./StatusBadge.jsx";
import TagMaterial from "./TagMaterial.jsx";
import BarraCapacidade from "./BarraCapacidade.jsx";

// Linha de informação: rótulo pequeno em cima, valor embaixo
function Campo({ rotulo, children }) {
  return (
    // Bloco de um dado do ponto
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{rotulo}</p>
      <div className="mt-0.5 text-sm text-gray-800">{children}</div>
    </div>
  );
}

export default function ModalPonto({ ponto, onClose }) {
  // Fecha o modal ao apertar ESC
  useEffect(() => {
    const aoApertar = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", aoApertar);
    return () => window.removeEventListener("keydown", aoApertar);
  }, [onClose]);

  if (!ponto) return null; // sem ponto, não desenha nada

  return (
    // Fundo escuro que cobre a tela; clicar nele fecha o modal
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      {/* Caixa branca do modal; stopPropagation evita fechar ao clicar dentro */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        {/* Cabeçalho: nome, id e botão de fechar */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{ponto.nome}</h2>
            <p className="text-xs text-gray-400">ID do ponto: #{ponto.id}</p>
          </div>
          <button onClick={onClose} className="text-xl leading-none text-gray-400 hover:text-gray-700">
            ×
          </button>
        </div>

        {/* Corpo: informações base do ponto */}
        <div className="mt-5 flex flex-col gap-4">
          {/* Status atual */}
          <Campo rotulo="Status">
            <StatusBadge status={ponto.status} />
          </Campo>

          {/* Endereço, CEP e cidade */}
          <Campo rotulo="Endereço">
            {ponto.endereco || "—"}
            {(ponto.cep || ponto.cidade) && (
              <span className="block text-xs text-gray-500">
                {[ponto.cep, ponto.cidade].filter(Boolean).join(" · ")}
              </span>
            )}
          </Campo>

          {/* Horário de funcionamento */}
          <Campo rotulo="Horário">{ponto.horario}</Campo>

          {/* Capacidade com barra colorida */}
          <Campo rotulo="Capacidade">
            <BarraCapacidade valor={ponto.capacidade} />
          </Campo>

          {/* Materiais aceitos */}
          <Campo rotulo="Materiais aceitos">
            <div className="flex flex-wrap gap-1">
              {ponto.materiais.length
                ? ponto.materiais.map((m) => <TagMaterial key={m} nome={m} />)
                : "—"}
            </div>
          </Campo>

          {/* Coordenadas usadas no mapa */}
          <Campo rotulo="Coordenadas">
            <span className="text-xs text-gray-500">
              {Number.isFinite(ponto.lat) ? `${ponto.lat}, ${ponto.lng}` : "Não informadas"}
            </span>
          </Campo>
        </div>

        {/* Rodapé: botões de ação */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            Fechar
          </button>
          <button
            onClick={() => console.log("Editar ponto:", ponto.id)}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}