import TagMaterial from "./TagMaterial.jsx";

// Cor do pin conforme status
const COR_PIN = { ativo: "border-green-500 text-green-600", manutencao: "border-orange-400 text-orange-500", cheio: "border-red-500 text-red-600" };

// Itens da legenda no rodapé do mapa
const LEGENDA = [
  { cor: "bg-green-500", texto: "Operando normal" },
  { cor: "bg-orange-400", texto: "Atenção / Manutenção" },
  { cor: "bg-red-500", texto: "Cheio / Inativo" },
];

// Pin redondo posicionado em % dentro do mapa
function Pin({ ponto, selecionado, onClick }) {
  return (
    <button
      onClick={() => onClick(ponto.id)}
      style={{ left: `${ponto.pos.x}%`, top: `${ponto.pos.y}%` }}
      className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-white ${
        COR_PIN[ponto.status]
      } ${selecionado ? "h-10 w-10 !bg-green-600 !text-white" : "h-6 w-6"}`}
    >
      {/* Ícone de localização (SVG simples) */}
      <svg viewBox="0 0 24 24" className="h-3/5 w-3/5" fill="currentColor">
        <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
      </svg>
    </button>
  );
}

export default function MapaPontos({ pontos, selecionadoId, onSelect }) {
  const sel = pontos.find((p) => p.id === selecionadoId);

  return (
    // Container do mapa (troque o fundo/ruas por Google Maps ou Leaflet depois)
    <section className="relative h-[calc(100vh-200px)] min-h-[420px] flex-1 overflow-hidden rounded-2xl bg-gray-100 shadow-inner">
      {/* Camada decorativa: rio */}
      <div className="absolute -left-10 top-[22%] h-12 w-[120%] -rotate-12 bg-blue-200/70" />
      {/* Camada decorativa: parque */}
      <div className="absolute bottom-[8%] left-[20%] h-[45%] w-[50%] rounded-[50%] bg-green-100" />
      {/* Camada decorativa: ruas (faixas brancas) */}
      <div className="absolute left-0 top-[48%] h-3 w-full -rotate-3 bg-white" />
      <div className="absolute left-0 top-[78%] h-2 w-full rotate-12 bg-white" />
      <div className="absolute left-[48%] top-0 h-full w-3 rotate-[4deg] bg-white" />

      {/* Pins dos pontos de coleta */}
      {pontos.map((p) => (
        <Pin key={p.id} ponto={p} selecionado={p.id === selecionadoId} onClick={onSelect} />
      ))}

      {/* Popup com os dados do ponto selecionado */}
      {sel && (
        <div
          style={{ left: `${sel.pos.x}%`, top: `${sel.pos.y}%` }}
          className="absolute z-10 w-[190px] -translate-x-1/2 -translate-y-[130%] rounded-lg bg-white p-3 shadow-lg"
        >
          {/* Nome + selo de capacidade */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-[11px] font-semibold text-gray-800">{sel.nome}</h4>
            <span className="rounded bg-green-500 px-1.5 py-0.5 text-[9px] font-semibold text-white">
              Capacidade {sel.capacidade}%
            </span>
          </div>
          {/* Horário de funcionamento */}
          <p className="mt-2 text-[10px] text-gray-500">Horário: {sel.horario}</p>
          {/* Materiais aceitos */}
          <div className="mt-2 flex flex-wrap gap-1">
            {sel.materiais.map((m) => (
              <TagMaterial key={m} nome={m} />
            ))}
          </div>
        </div>
      )}

      {/* Controles de zoom e "minha localização" (canto superior direito) */}
      <div className="absolute right-3 top-3 flex flex-col gap-2">
        {/* Zoom + / - */}
        <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow">
          <button className="h-8 w-8 text-gray-600 hover:bg-gray-50">+</button>
          <button className="h-8 w-8 border-t border-gray-100 text-gray-600 hover:bg-gray-50">−</button>
        </div>
        {/* Centralizar na minha localização */}
        <button className="h-8 w-8 rounded-lg bg-white text-gray-600 shadow hover:bg-gray-50">◎</button>
      </div>

      {/* Legenda de cores (rodapé esquerdo) */}
      <div className="absolute bottom-3 left-3 flex gap-4 rounded-lg bg-white px-3 py-2 text-[10px] text-gray-600 shadow">
        {LEGENDA.map((l) => (
          <span key={l.texto} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${l.cor}`} />
            {l.texto}
          </span>
        ))}
      </div>
    </section>
  );
}