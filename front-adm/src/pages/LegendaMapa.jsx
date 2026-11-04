// Itens da legenda (cor = status do pin)
const LEGENDA = [
    { cor: "bg-green-500", texto: "Operando normal" },
    { cor: "bg-orange-400", texto: "Atenção / Manutenção" },
    { cor: "bg-red-500", texto: "Cheio / Inativo" },
  ];
  
  export default function LegendaMapa() {
    return (
      // Caixa branca no rodapé esquerdo do mapa
      <div className="absolute bottom-3 left-3 z-10 flex gap-4 rounded-lg bg-white px-3 py-2 text-[10px] text-gray-600 shadow">
        {LEGENDA.map((l) => (
          <span key={l.texto} className="flex items-center gap-1.5">
            {/* Bolinha colorida */}
            <span className={`h-2 w-2 rounded-full ${l.cor}`} />
            {l.texto}
          </span>
        ))}
      </div>
    );
  }