// Estilos de cada status do ponto (selo no canto do card)
const ESTILOS = {
    ativo: { texto: "Ativo", classe: "bg-green-500 text-white" },
    manutencao: { texto: "Manutenção", classe: "bg-orange-100 text-orange-600" },
    cheio: { texto: "Cheio", classe: "bg-red-100 text-red-600" },
  };
  
  export default function StatusBadge({ status }) {
    const { texto, classe } = ESTILOS[status] ?? ESTILOS.ativo;
    return (
      // Selo arredondado com o texto do status
      <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${classe}`}>{texto}</span>
    );
  }