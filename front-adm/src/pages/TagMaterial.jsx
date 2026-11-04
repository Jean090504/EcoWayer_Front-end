// Cores de cada tipo de material (chip colorido)
const CORES = {
    "Plástico": "bg-blue-500",
    "Metal": "bg-yellow-600",
    "Vidro": "bg-green-500",
    "Papel": "bg-yellow-600",
    "Eletrônico": "bg-purple-600",
    "Plásticos": "bg-blue-500",
    "Metais": "bg-yellow-600",
    "Vidros": "bg-green-500",
    "Eletrônicos": "bg-purple-600",
    "Pilhas & Bat.": "bg-blue-500",
    "Orgânicos": "bg-green-500",
    "Papelão": "bg-yellow-600",
  };
  
  export default function TagMaterial({ nome }) {
    return (
      // Chip pequeno com o nome do material; cor definida pelo mapa CORES
      <span className={`rounded px-2 py-0.5 text-[10px] font-medium text-white ${CORES[nome] ?? "bg-gray-400"}`}>
        {nome}
      </span>
    );
  }